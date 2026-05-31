-- Add a dedicated sliding-window rate limit table and tighten direct access to privileged functions.

create table if not exists public.rate_limits (
  id uuid primary key default gen_random_uuid(),
  scope text not null,
  identity_type text not null,
  identity_hash text not null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint rate_limits_scope_length_check
    check (char_length(scope) between 1 and 80),
  constraint rate_limits_identity_type_check
    check (identity_type in ('ip', 'user')),
  constraint rate_limits_identity_hash_check
    check (identity_hash ~ '^[a-f0-9]{64}$'),
  constraint rate_limits_user_identity_check
    check (identity_type <> 'user' or user_id is not null)
);

create index if not exists rate_limits_lookup_idx
on public.rate_limits(scope, identity_type, identity_hash, created_at desc);

create index if not exists rate_limits_user_lookup_idx
on public.rate_limits(user_id, scope, created_at desc)
where user_id is not null;

create index if not exists rate_limits_created_at_idx
on public.rate_limits(created_at);

alter table public.rate_limits enable row level security;

revoke all on table public.rate_limits from public, anon, authenticated;

create or replace function public.check_rate_limit(
  p_scope text,
  p_identity_type text,
  p_identity_hash text,
  p_user_id uuid,
  p_limit integer,
  p_window_seconds integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count integer;
  rate_window interval;
begin
  if p_scope is null
    or char_length(p_scope) < 1
    or char_length(p_scope) > 80
    or p_identity_type is null
    or p_identity_type not in ('ip', 'user')
    or p_identity_hash is null
    or p_identity_hash !~ '^[a-f0-9]{64}$'
    or p_limit is null
    or p_limit < 1
    or p_limit > 10000
    or p_window_seconds is null
    or p_window_seconds < 1
    or p_window_seconds > 86400
  then
    raise exception 'Invalid rate limit request'
      using errcode = 'P0001';
  end if;

  if p_identity_type = 'user' and p_user_id is null then
    raise exception 'User rate limit requires a user id'
      using errcode = 'P0001';
  end if;

  rate_window = make_interval(secs => p_window_seconds);

  perform pg_advisory_xact_lock(
    hashtext(p_scope || ':' || p_identity_type || ':' || p_identity_hash)
  );

  delete from public.rate_limits
  where created_at < now() - make_interval(secs => least(p_window_seconds * 4, 86400));

  select count(*)
  into current_count
  from public.rate_limits
  where scope = p_scope
    and identity_type = p_identity_type
    and identity_hash = p_identity_hash
    and created_at > now() - rate_window;

  if current_count >= p_limit then
    raise exception 'Rate limit exceeded'
      using errcode = 'P0001';
  end if;

  insert into public.rate_limits (scope, identity_type, identity_hash, user_id)
  values (p_scope, p_identity_type, p_identity_hash, p_user_id);

  return jsonb_build_object(
    'allowed', true,
    'remaining', greatest(p_limit - current_count - 1, 0)
  );
end;
$$;

revoke all on function public.check_rate_limit(text, text, text, uuid, integer, integer)
from public;
grant execute on function public.check_rate_limit(text, text, text, uuid, integer, integer)
to service_role;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.enforce_targets_free_limit() from public, anon, authenticated;
revoke all on function public.enforce_contact_target_owner() from public, anon, authenticated;
revoke all on function public.enforce_contacts_free_limit() from public, anon, authenticated;
revoke all on function public.enforce_event_target_owner() from public, anon, authenticated;
revoke all on function public.enforce_events_free_limit() from public, anon, authenticated;
revoke all on function public.enforce_outreach_log_owner_links() from public, anon, authenticated;
revoke all on function public.enforce_outreach_logs_free_limit() from public, anon, authenticated;
revoke all on function public.enforce_task_owner_links() from public, anon, authenticated;

grant execute on function public.is_admin() to authenticated, service_role;
