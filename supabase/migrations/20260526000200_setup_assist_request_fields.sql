alter table public.setup_assist_requests
  add column if not exists parent_player_name text,
  add column if not exists email text,
  add column if not exists player_name text,
  add column if not exists help_needed text,
  add column if not exists goals text,
  add column if not exists current_target_list text,
  add column if not exists coach_contacts text,
  add column if not exists camp_date_links text,
  add column if not exists notes text;
