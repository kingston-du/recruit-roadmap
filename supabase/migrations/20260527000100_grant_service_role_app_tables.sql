-- Allow server-only Supabase service-role clients to administer app tables.
-- The service-role key still must never be exposed to client code.

grant usage on schema public to service_role;

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
to service_role;

grant execute on function public.is_admin() to service_role;
grant execute on function public.enforce_targets_free_limit() to service_role;
grant execute on function public.enforce_contacts_free_limit() to service_role;
grant execute on function public.enforce_events_free_limit() to service_role;
grant execute on function public.enforce_task_owner_links() to service_role;
