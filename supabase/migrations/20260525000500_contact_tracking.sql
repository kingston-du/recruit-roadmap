-- Add coach/contact tracking fields and enforce the free-plan contact limit.
-- Existing RLS keeps rows user-owned; these triggers add database backstops.

alter table public.contacts
  add column if not exists role text,
  add column if not exists source_url text;

update public.contacts
set role = title
where role is null
  and title is not null;

update public.contacts
set source_url = website_url
where source_url is null
  and website_url is not null;

create or replace function public.enforce_contact_target_owner()
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
    raise exception 'Contact target must belong to the same user'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_contact_target_owner on public.contacts;

create trigger enforce_contact_target_owner
before insert or update of user_id, target_id on public.contacts
for each row execute function public.enforce_contact_target_owner();

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

drop trigger if exists enforce_contacts_free_limit on public.contacts;

create trigger enforce_contacts_free_limit
before insert on public.contacts
for each row execute function public.enforce_contacts_free_limit();

grant execute on function public.enforce_contact_target_owner() to authenticated;
grant execute on function public.enforce_contacts_free_limit() to authenticated;
grant select, insert, update, delete on public.contacts to authenticated;
