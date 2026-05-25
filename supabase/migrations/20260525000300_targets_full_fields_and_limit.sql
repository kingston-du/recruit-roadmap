-- Add the complete Targets fields and enforce the free-plan target limit.
-- RLS remains the ownership boundary; the trigger is a database backstop for plan limits.

alter table public.targets
  add column if not exists connected_path text,
  add column if not exists next_step text,
  add column if not exists follow_up_date date,
  add column if not exists roster_url text,
  add column if not exists camp_url text,
  add column if not exists why_considering text,
  add column if not exists concerns text;

update public.targets
set status = case lower(status)
  when 'researching' then 'Researching'
  when 'planning to contact' then 'Planning to Contact'
  when 'contacted' then 'Contacted'
  when 'interested / next step' then 'Interested / Next Step'
  when 'camp or tryout' then 'Camp or Tryout'
  when 'not a fit' then 'Not a Fit'
  else coalesce(nullif(status, ''), 'Researching')
end;

alter table public.targets
  alter column status set default 'Researching';

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

drop trigger if exists enforce_targets_free_limit on public.targets;

create trigger enforce_targets_free_limit
before insert on public.targets
for each row execute function public.enforce_targets_free_limit();

grant execute on function public.enforce_targets_free_limit() to authenticated;
grant select, insert, update, delete on public.targets to authenticated;
