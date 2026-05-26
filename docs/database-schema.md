# Database Schema

This schema is the private data model for the freemium MVP. Every table uses a UUID primary key, every user-owned table has a `user_id` that points to `auth.users(id)`, and every table has `created_at` and `updated_at` timestamps.

Row Level Security is enabled on every table. Normal signed-in users can only work with rows where `user_id` matches their own Supabase Auth user id. Admin-only access is checked through the Supabase Auth app metadata claim `role = "admin"` so users cannot make themselves admins by editing profile data.

## Tables

### `profiles`

One row per signed-in user. This stores basic account information such as email, name, phone, and timezone. A database trigger creates this row automatically when a Supabase Auth user is created.

### `player_profiles`

The player's private hockey profile. This stores name, birth year, position,
shoots, size, current team and level, hometown, GPA, target path, goals, video
links, optional Elite Prospects and MyHockey URLs, and an optional coach
reference. The table is one player profile per user for now.

### `plans`

The user's main recruiting plan. It stores the plan title, season, main focus,
short-term goal, long-term goal, status, and notes. The app marks one main plan
per user so families have a single private place to organize options and next
steps.

### `plan_paths`

The paths inside a plan. These are user-owned options the family wants to
compare, such as a junior hockey path, college hockey path, or development
backup path. Each row belongs to a plan and stores a title, goal, timeline, why
the family is considering it, next steps, and open questions.

### `targets`

Teams, schools, camps, leagues, or other recruiting targets the family wants to track. The table stores board status, priority, follow-up date, links, notes, why the family is considering the target, and concerns. RLS keeps targets user-owned, and a trigger prevents free accounts from creating more than 5 targets while Pro accounts can create unlimited targets.

### `contacts`

Coach or staff contact records connected to a target when useful. This stores
role, email, optional phone, optional source URL, and notes only. It does not
add email sending, messaging, or marketplace behavior. RLS keeps contacts
user-owned, a trigger ensures a contact can only point at one of the user's own
targets, and a trigger prevents free accounts from creating more than 3 contacts
while Pro accounts can create unlimited contacts.

### `events`

Important dates such as camps, showcases, visits, tryouts, calls,
registration deadlines, or follow-up dates. Events can optionally connect to a
target, store date range, registration deadline, cost, location, URL, notes, and
status. RLS keeps events user-owned, a trigger ensures an event can only point
at one of the user's own targets, and a trigger prevents free accounts from
creating more than 3 events while Pro accounts can create unlimited events.

### `outreach_logs`

History of outreach activity for targets. Each log belongs to the user and one
target, can optionally point to a contact saved to that target, and stores the
outreach type, direction, outreach date, summary, outcome, and optional next
follow-up date. RLS keeps logs user-owned, triggers ensure target/contact
ownership, and a trigger reserves outreach history for Pro accounts. Pro
accounts can create unlimited logs. It is not a
messaging system and does not send email.

### `tasks`

The Today checklist and plan tasks. Tasks can optionally connect to a plan, target, or event. Status and priority are plain text for now.

### `subscriptions`

The freemium/pro account state. Each user gets a default `free` subscription row when their auth user is created. Users can view their own subscription, but only an admin or server-side service role should update subscription rows.

### `setup_assist_requests`

Requests for the optional paid setup assist. Signed-in users can create and manage their own requests. Owners and admins can view requests; admins can update the request status and internal notes.

## Security Model

- RLS is on for all 11 tables.
- Most tables have one owner policy: the user can select, insert, update, and delete only rows where `user_id = auth.uid()`.
- Contacts and events have extra trigger-level guards so `target_id` cannot point to another user's target.
- Outreach logs have extra trigger-level guards so `target_id` is required and
  `contact_id` can only point at a contact saved to the same target by the same
  user.
- `setup_assist_requests` also allows admins to view and update requests.
- `subscriptions` allows users to view their own row and admins to view or update subscription rows.
- The service role key should stay server-only. It is not needed in client code and should never be committed.

## Automatic Rows

The migration adds an `on_auth_user_created` trigger on `auth.users`. When a new user signs up, the trigger creates:

- a `profiles` row
- a default `subscriptions` row with `plan_name = 'free'` and `status = 'active'`

The migration also backfills those rows for any auth users that already exist when the migration is applied.
