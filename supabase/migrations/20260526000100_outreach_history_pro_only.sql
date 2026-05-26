-- Align outreach history with Pro pricing.

create or replace function public.enforce_outreach_logs_free_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_plan text;
  current_status text;
begin
  select subscriptions.plan_name, subscriptions.status
  into current_plan, current_status
  from public.subscriptions
  where subscriptions.user_id = new.user_id;

  if coalesce(lower(current_plan), 'free') <> 'pro'
    or coalesce(lower(current_status), 'active') <> 'active'
  then
    raise exception 'Free plan outreach log limit reached'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

grant execute on function public.enforce_outreach_logs_free_limit() to authenticated;
