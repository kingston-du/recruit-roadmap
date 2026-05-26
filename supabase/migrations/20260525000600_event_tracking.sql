-- Add camps, dates, and events tracking with target ownership and free-plan limits.
-- RLS already keeps event rows user-owned; these triggers add database backstops.

alter table public.events
  add column if not exists start_date date,
  add column if not exists registration_deadline date,
  add column if not exists cost numeric(10, 2),
  add column if not exists url text;

update public.events
set start_date = event_date
where start_date is null
  and event_date is not null;

update public.events
set url = website_url
where url is null
  and website_url is not null;

update public.events
set start_date = current_date
where start_date is null;

update public.events
set event_type = case lower(coalesce(event_type, ''))
  when 'camp' then 'camp'
  when 'tryout' then 'tryout'
  when 'showcase' then 'showcase'
  when 'call' then 'call'
  when 'deadline' then 'deadline'
  when 'visit' then 'visit'
  else 'other'
end;

update public.events
set status = case lower(status)
  when 'planned' then 'Planned'
  when 'registered' then 'Registered'
  when 'completed' then 'Completed'
  when 'done' then 'Completed'
  when 'canceled' then 'Canceled'
  when 'cancelled' then 'Canceled'
  else 'Planned'
end;

alter table public.events
  alter column start_date set not null,
  alter column event_type set default 'other',
  alter column event_type set not null,
  alter column status set default 'Planned';

create index if not exists events_user_start_date_idx
on public.events(user_id, start_date);

create index if not exists events_user_registration_deadline_idx
on public.events(user_id, registration_deadline);

create or replace function public.enforce_event_target_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.target_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.targets
    where targets.id = new.target_id
      and targets.user_id = new.user_id
  ) then
    raise exception 'Event target must belong to the same user'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_event_target_owner on public.events;

create trigger enforce_event_target_owner
before insert or update of user_id, target_id on public.events
for each row execute function public.enforce_event_target_owner();

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

drop trigger if exists enforce_events_free_limit on public.events;

create trigger enforce_events_free_limit
before insert on public.events
for each row execute function public.enforce_events_free_limit();

grant execute on function public.enforce_event_target_owner() to authenticated;
grant execute on function public.enforce_events_free_limit() to authenticated;
grant select, insert, update, delete on public.events to authenticated;
