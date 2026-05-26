-- Add the My Plan fields used by the private recruiting plan workspace.
-- Existing RLS policies on plans and plan_paths continue to enforce ownership.

alter table public.plans
  add column if not exists is_main boolean not null default false,
  add column if not exists short_term_goal text,
  add column if not exists long_term_goal text;

with ranked_plans as (
  select
    id,
    row_number() over (partition by user_id order by created_at, id) as plan_rank
  from public.plans
)
update public.plans
set is_main = true
from ranked_plans
where plans.id = ranked_plans.id
  and ranked_plans.plan_rank = 1
  and not exists (
    select 1
    from public.plans existing_main
    where existing_main.user_id = plans.user_id
      and existing_main.is_main = true
  );

create unique index if not exists plans_one_main_plan_per_user_idx
on public.plans(user_id)
where is_main = true;

alter table public.plan_paths
  add column if not exists goal text,
  add column if not exists timeline text,
  add column if not exists why_considering text,
  add column if not exists next_steps text,
  add column if not exists open_questions text;

update public.plan_paths
set
  goal = coalesce(goal, description),
  timeline = coalesce(timeline, stage),
  next_steps = coalesce(next_steps, notes)
where goal is null
   or timeline is null
   or next_steps is null;

grant select, insert, update, delete on public.plans, public.plan_paths to authenticated;
