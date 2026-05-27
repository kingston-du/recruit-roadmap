-- Harden quota enforcement against concurrent inserts and guard future task links.

create or replace function public.enforce_targets_free_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  current_status text;
  current_target_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  select subscriptions.plan_name, subscriptions.status
  into current_plan, current_status
  from public.subscriptions
  where subscriptions.user_id = new.user_id;

  if coalesce(lower(current_plan), 'free') <> 'pro'
    or coalesce(lower(current_status), 'active') <> 'active'
  then
    select count(*)
    into current_target_count
    from public.targets
    where targets.user_id = new.user_id;

    if current_target_count >= 5 then
      raise exception 'Free plan target limit reached'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.enforce_contacts_free_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  current_status text;
  current_contact_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  select subscriptions.plan_name, subscriptions.status
  into current_plan, current_status
  from public.subscriptions
  where subscriptions.user_id = new.user_id;

  if coalesce(lower(current_plan), 'free') <> 'pro'
    or coalesce(lower(current_status), 'active') <> 'active'
  then
    select count(*)
    into current_contact_count
    from public.contacts
    where contacts.user_id = new.user_id;

    if current_contact_count >= 3 then
      raise exception 'Free plan contact limit reached'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.enforce_events_free_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  current_status text;
  current_event_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  select subscriptions.plan_name, subscriptions.status
  into current_plan, current_status
  from public.subscriptions
  where subscriptions.user_id = new.user_id;

  if coalesce(lower(current_plan), 'free') <> 'pro'
    or coalesce(lower(current_status), 'active') <> 'active'
  then
    select count(*)
    into current_event_count
    from public.events
    where events.user_id = new.user_id;

    if current_event_count >= 3 then
      raise exception 'Free plan event limit reached'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.enforce_task_owner_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.plan_id is not null and not exists (
    select 1
    from public.plans
    where plans.id = new.plan_id
      and plans.user_id = new.user_id
  ) then
    raise exception 'Task plan must belong to the same user'
      using errcode = 'P0001';
  end if;

  if new.target_id is not null and not exists (
    select 1
    from public.targets
    where targets.id = new.target_id
      and targets.user_id = new.user_id
  ) then
    raise exception 'Task target must belong to the same user'
      using errcode = 'P0001';
  end if;

  if new.event_id is not null and not exists (
    select 1
    from public.events
    where events.id = new.event_id
      and events.user_id = new.user_id
  ) then
    raise exception 'Task event must belong to the same user'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_task_owner_links on public.tasks;

create trigger enforce_task_owner_links
before insert or update of user_id, plan_id, target_id, event_id on public.tasks
for each row execute function public.enforce_task_owner_links();

grant execute on function public.enforce_targets_free_limit() to authenticated;
grant execute on function public.enforce_contacts_free_limit() to authenticated;
grant execute on function public.enforce_events_free_limit() to authenticated;
grant execute on function public.enforce_task_owner_links() to authenticated;
