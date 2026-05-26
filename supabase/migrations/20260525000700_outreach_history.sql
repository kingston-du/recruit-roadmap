-- Add outreach history tracking with ownership guards and free-plan limits.
-- This remains a logging feature only; it does not send messages or email.

alter table public.outreach_logs
  add column if not exists outreach_type text,
  add column if not exists direction text;

update public.outreach_logs
set outreach_type = case lower(coalesce(outreach_type, method, 'other'))
  when 'email' then 'email'
  when 'call' then 'call'
  when 'phone' then 'call'
  when 'text' then 'text'
  when 'sms' then 'text'
  when 'in person' then 'in_person'
  when 'in_person' then 'in_person'
  when 'camp' then 'camp'
  else 'other'
end;

update public.outreach_logs
set direction = case lower(coalesce(direction, 'sent'))
  when 'received' then 'received'
  else 'sent'
end;

update public.outreach_logs
set summary = 'Outreach logged.'
where summary is null
  or length(trim(summary)) = 0;

alter table public.outreach_logs
  alter column outreach_type set default 'other',
  alter column outreach_type set not null,
  alter column direction set default 'sent',
  alter column direction set not null,
  alter column summary set not null;

alter table public.outreach_logs
  drop constraint if exists outreach_logs_target_id_fkey,
  add constraint outreach_logs_target_id_fkey
    foreign key (target_id)
    references public.targets(id)
    on delete cascade;

alter table public.outreach_logs
  drop constraint if exists outreach_logs_contact_id_fkey,
  add constraint outreach_logs_contact_id_fkey
    foreign key (contact_id)
    references public.contacts(id)
    on delete set null;

alter table public.outreach_logs
  add constraint outreach_logs_outreach_type_check
    check (outreach_type in ('email', 'call', 'text', 'in_person', 'camp', 'other')),
  add constraint outreach_logs_direction_check
    check (direction in ('sent', 'received')),
  add constraint outreach_logs_target_required
    check (target_id is not null) not valid;

create index if not exists outreach_logs_user_outreach_date_idx
on public.outreach_logs(user_id, outreach_date desc);

create index if not exists outreach_logs_user_next_follow_up_date_idx
on public.outreach_logs(user_id, next_follow_up_date);

create index if not exists outreach_logs_target_outreach_date_idx
on public.outreach_logs(target_id, outreach_date desc);

create or replace function public.enforce_outreach_log_owner_links()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.target_id is null then
    raise exception 'Outreach log target is required'
      using errcode = 'P0001';
  end if;

  if not exists (
    select 1
    from public.targets
    where targets.id = new.target_id
      and targets.user_id = new.user_id
  ) then
    raise exception 'Outreach log target must belong to the same user'
      using errcode = 'P0001';
  end if;

  if new.contact_id is not null and not exists (
    select 1
    from public.contacts
    where contacts.id = new.contact_id
      and contacts.user_id = new.user_id
      and contacts.target_id = new.target_id
  ) then
    raise exception 'Outreach log contact must belong to the same target and user'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_outreach_log_owner_links on public.outreach_logs;

create trigger enforce_outreach_log_owner_links
before insert or update of user_id, target_id, contact_id on public.outreach_logs
for each row execute function public.enforce_outreach_log_owner_links();

create or replace function public.enforce_outreach_logs_free_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  current_status text;
  current_outreach_log_count integer;
begin
  select subscriptions.plan_name, subscriptions.status
  into current_plan, current_status
  from public.subscriptions
  where subscriptions.user_id = new.user_id;

  if coalesce(lower(current_plan), 'free') <> 'pro'
    or coalesce(lower(current_status), 'active') <> 'active'
  then
    select count(*)
    into current_outreach_log_count
    from public.outreach_logs
    where outreach_logs.user_id = new.user_id;

    if current_outreach_log_count >= 3 then
      raise exception 'Free plan outreach log limit reached'
        using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_outreach_logs_free_limit on public.outreach_logs;

create trigger enforce_outreach_logs_free_limit
before insert on public.outreach_logs
for each row execute function public.enforce_outreach_logs_free_limit();

grant execute on function public.enforce_outreach_log_owner_links() to authenticated;
grant execute on function public.enforce_outreach_logs_free_limit() to authenticated;
grant select, insert, update, delete on public.outreach_logs to authenticated;
