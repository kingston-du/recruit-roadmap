-- Freemium MVP schema for the Hockey Recruiting Roadmap app.
-- This migration keeps the data model intentionally simple: UUID primary keys,
-- user-owned rows, text status fields, and RLS policies for every private table.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = public
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  timezone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.player_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  preferred_name text,
  birth_year text,
  graduation_year text,
  position text,
  shoots text,
  height text,
  weight text,
  current_team text,
  current_level text,
  hometown text,
  school_name text,
  gpa text,
  profile_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'My Plan',
  season text,
  pathway_goal text,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, id)
);

create table public.plan_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null,
  title text not null,
  stage text,
  description text,
  status text not null default 'not_started',
  target_date date,
  sort_order integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint plan_paths_plan_owner_fk
    foreign key (user_id, plan_id)
    references public.plans(user_id, id)
    on delete cascade
);

create table public.targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_type text,
  level text,
  league text,
  location text,
  website_url text,
  status text not null default 'researching',
  priority text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid references public.targets(id) on delete set null,
  name text not null,
  title text,
  organization text,
  email text,
  phone text,
  website_url text,
  relationship_status text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid references public.targets(id) on delete set null,
  title text not null,
  event_type text,
  event_date date,
  end_date date,
  start_time text,
  end_time text,
  location text,
  website_url text,
  status text not null default 'planned',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.outreach_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid references public.targets(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  outreach_date date not null default current_date,
  method text,
  subject text,
  summary text,
  outcome text,
  next_follow_up_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  target_id uuid references public.targets(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  title text not null,
  description text,
  category text,
  status text not null default 'open',
  priority text,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_name text not null default 'free',
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_payment_link_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.setup_assist_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_status text not null default 'new',
  paid_status text not null default 'unpaid',
  player_notes text,
  target_links text,
  contact_details text,
  event_details text,
  preferred_contact_method text,
  stripe_payment_reference text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_user_id_idx on public.profiles(user_id);
create index player_profiles_user_id_idx on public.player_profiles(user_id);
create index plans_user_id_idx on public.plans(user_id);
create index plan_paths_user_id_idx on public.plan_paths(user_id);
create index plan_paths_plan_id_idx on public.plan_paths(plan_id);
create index targets_user_id_idx on public.targets(user_id);
create index contacts_user_id_idx on public.contacts(user_id);
create index contacts_target_id_idx on public.contacts(target_id);
create index events_user_id_idx on public.events(user_id);
create index events_target_id_idx on public.events(target_id);
create index outreach_logs_user_id_idx on public.outreach_logs(user_id);
create index outreach_logs_target_id_idx on public.outreach_logs(target_id);
create index outreach_logs_contact_id_idx on public.outreach_logs(contact_id);
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_due_date_idx on public.tasks(due_date);
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index setup_assist_requests_user_id_idx on public.setup_assist_requests(user_id);

alter table public.profiles enable row level security;
alter table public.player_profiles enable row level security;
alter table public.plans enable row level security;
alter table public.plan_paths enable row level security;
alter table public.targets enable row level security;
alter table public.contacts enable row level security;
alter table public.events enable row level security;
alter table public.outreach_logs enable row level security;
alter table public.tasks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.setup_assist_requests enable row level security;

create policy "Users can manage their own profiles"
on public.profiles
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own player profiles"
on public.player_profiles
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own plans"
on public.plans
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own plan paths"
on public.plan_paths
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own targets"
on public.targets
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own contacts"
on public.contacts
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own events"
on public.events
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own outreach logs"
on public.outreach_logs
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can manage their own tasks"
on public.tasks
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can view their own subscriptions"
on public.subscriptions
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can view subscriptions"
on public.subscriptions
for select
to authenticated
using (public.is_admin());

create policy "Admins can update subscriptions"
on public.subscriptions
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can manage their own setup assist requests"
on public.setup_assist_requests
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admins can view setup assist requests"
on public.setup_assist_requests
for select
to authenticated
using (public.is_admin());

create policy "Admins can update setup assist requests"
on public.setup_assist_requests
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_player_profiles_updated_at
before update on public.player_profiles
for each row execute function public.set_updated_at();

create trigger set_plans_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

create trigger set_plan_paths_updated_at
before update on public.plan_paths
for each row execute function public.set_updated_at();

create trigger set_targets_updated_at
before update on public.targets
for each row execute function public.set_updated_at();

create trigger set_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create trigger set_outreach_logs_updated_at
before update on public.outreach_logs
for each row execute function public.set_updated_at();

create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger set_setup_assist_requests_updated_at
before update on public.setup_assist_requests
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (user_id) do update
    set email = excluded.email,
        full_name = coalesce(profiles.full_name, excluded.full_name),
        updated_at = now();

  insert into public.subscriptions (user_id, plan_name, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (user_id, email, full_name)
select
  users.id,
  users.email,
  coalesce(users.raw_user_meta_data ->> 'full_name', users.raw_user_meta_data ->> 'name')
from auth.users
on conflict (user_id) do nothing;

insert into public.subscriptions (user_id, plan_name, status)
select users.id, 'free', 'active'
from auth.users
on conflict (user_id) do nothing;

grant usage on schema public to authenticated;
grant execute on function public.is_admin() to authenticated;
grant select, insert, update, delete on
  public.profiles,
  public.player_profiles,
  public.plans,
  public.plan_paths,
  public.targets,
  public.contacts,
  public.events,
  public.outreach_logs,
  public.tasks,
  public.subscriptions,
  public.setup_assist_requests
to authenticated;
