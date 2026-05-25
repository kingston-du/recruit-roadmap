-- Add the My Player fields used by the private player profile form.
-- The existing unique user_id constraint keeps this to one profile per user.

alter table public.player_profiles
  add column if not exists target_path text,
  add column if not exists goals text,
  add column if not exists video_links text[] not null default '{}',
  add column if not exists elite_prospects_url text,
  add column if not exists myhockey_url text,
  add column if not exists coach_reference_name text,
  add column if not exists coach_reference_contact text;

grant select, insert, update, delete on public.player_profiles to authenticated;
