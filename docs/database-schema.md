# Database Schema

This schema is the private data model for the freemium MVP. Every table uses a UUID primary key, every user-owned table has a `user_id` that points to `auth.users(id)`, and every table has `created_at` and `updated_at` timestamps.

Row Level Security is enabled on every table. Normal signed-in users can only work with rows where `user_id` matches their own Supabase Auth user id. Admin-only access is checked through the Supabase Auth app metadata claim `role = "admin"` so users cannot make themselves admins by editing profile data.

## Tables

### `profiles`

One row per signed-in user. This stores basic account information such as email, name, phone, and timezone. A database trigger creates this row automatically when a Supabase Auth user is created.

### `player_profiles`

The player's basic hockey profile. This is intentionally simple for MVP: name, graduation year, position, current team, school, GPA, profile URL, and notes. The table is one player profile per user for now.

### `plans`

The user's personal recruiting plan. It stores the plan title, season, pathway goal, status, and notes. A user can have more than one plan, but the default app experience can still show a single "My Plan".

### `plan_paths`

The roadmap steps inside a plan. These are the concrete path items a family wants to track, such as researching teams, building a profile, visiting schools, or planning camp dates. Each row belongs to a plan.

### `targets`

Teams, schools, leagues, or other recruiting targets the family wants to track. The MVP uses text fields for type, level, status, and priority so the product can evolve before locking down strict values.

### `contacts`

Coach or staff contact records connected to a target when useful. This stores contact details and notes only. It does not add messaging or marketplace behavior.

### `events`

Important dates such as camps, showcases, visits, tryouts, application deadlines, or follow-up dates. Events can optionally connect to a target.

### `outreach_logs`

History of outreach activity for Pro users later. This is a log of what happened, when it happened, the method used, the outcome, and a possible next follow-up date. It is not a messaging system.

### `tasks`

The Today checklist and plan tasks. Tasks can optionally connect to a plan, target, or event. Status and priority are plain text for now.

### `subscriptions`

The freemium/pro account state. Each user gets a default `free` subscription row when their auth user is created. Users can view their own subscription, but only an admin or server-side service role should update subscription rows.

### `setup_assist_requests`

Requests for the optional paid setup assist. Signed-in users can create and manage their own requests. Owners and admins can view requests; admins can update the request status and internal notes.

## Security Model

- RLS is on for all 11 tables.
- Most tables have one owner policy: the user can select, insert, update, and delete only rows where `user_id = auth.uid()`.
- `setup_assist_requests` also allows admins to view and update requests.
- `subscriptions` allows users to view their own row and admins to view or update subscription rows.
- The service role key should stay server-only. It is not needed in client code and should never be committed.

## Automatic Rows

The migration adds an `on_auth_user_created` trigger on `auth.users`. When a new user signs up, the trigger creates:

- a `profiles` row
- a default `subscriptions` row with `plan_name = 'free'` and `status = 'active'`

The migration also backfills those rows for any auth users that already exist when the migration is applied.
