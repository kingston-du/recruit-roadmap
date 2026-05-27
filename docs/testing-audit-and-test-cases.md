# Testing Audit and Test Cases

## Current Coverage

- `npm run lint`, `npm run typecheck`, and `npm run build` are the current automated checks.
- CI runs lint, typecheck, and build in `.github/workflows/ci.yml`.
- There is no committed unit, integration, browser, or Supabase RLS test runner yet.

## Highest-Risk Areas to Cover First

1. Form validation and normalization in `lib/*`.
2. Freemium limits for targets, contacts, events, and Pro-only outreach history.
3. Supabase ownership rules for linked records.
4. Auth redirects for private pages and admin-only routes.
5. Server action authorization, because actions are callable entry points.

## Unit Test Cases

### Player Profile

- Saves basic profile data when `video_links_text` is empty.
- Splits video links by comma and newline.
- Rejects non-HTTP(S) video, Elite Prospects, and MyHockey URLs.
- Rejects GPA below `0`, above `5`, and non-numeric values.
- Converts optional empty fields to `null`.
- Computes profile completeness with video links missing but other essentials present.

### Targets

- Rejects a blank target name.
- Rejects unsupported target type, status, and priority values.
- Converts optional URL/text/date fields from empty strings to `null`.
- Rejects non-HTTP(S) website, roster, and camp URLs.
- Builds insert rows with the authenticated `user_id`, not form-provided ownership.

### Contacts

- Requires contact name, role, and valid email.
- Allows blank `target_id`, but rejects malformed UUIDs.
- Converts optional phone, source URL, and notes to `null`.
- Rejects non-HTTP(S) source URLs.

### Events

- Requires title, event type, start date, and status.
- Rejects invalid date strings.
- Rejects an end date before the start date.
- Allows blank cost and rejects negative or non-numeric cost.
- Formats same-day and multi-day event ranges correctly.

### My Plan

- Requires plan and path titles.
- Converts optional plan/path fields to `null`.
- Groups targets by `connected_path`, including the `No connected path` bucket.
- Sorts connected path groups consistently.

## Server Action Test Cases

- Unauthenticated mutations redirect to `/login?next=...`.
- Free users can create up to 5 targets, 3 contacts, and 3 events.
- Free users cannot create outreach logs.
- Pro users can create targets, contacts, events, and outreach logs beyond free limits.
- Contact and event actions reject a `target_id` not owned by the user.
- Outreach actions reject a target not owned by the user.
- Outreach actions reject a contact that is not saved to the selected target.
- Update and delete actions only affect rows matching both `id` and `user_id`.
- Signup and login only redirect to safe internal paths.

## Supabase Migration/RLS Test Cases

- Every private table has RLS enabled.
- Users can select, insert, update, and delete only their own rows where the app intends full ownership.
- Users can insert setup assist requests only for themselves and only with safe initial status fields.
- Users cannot update `setup_assist_requests` after insert unless they are an admin/service role path.
- Users can view only their own subscription row.
- Non-admin users cannot update subscriptions.
- Contacts and events cannot reference targets owned by another user.
- Outreach logs require a target and can only reference a contact owned by the same user and target.
- Tasks cannot reference another user's plan, target, or event.
- Concurrent free-plan inserts cannot exceed free quotas.

## Browser Smoke Test Cases

- `/`, `/roadmap`, `/pricing`, `/login`, and `/signup` render with HTTP 200.
- `/today`, `/my-plan`, `/targets`, `/my-player`, `/settings`, `/setup-assist`, and `/admin` redirect unauthenticated users to `/login?next=...`.
- Login and signup forms show validation errors without a full page crash.
- Pricing checkout buttons are disabled when Stripe links are missing.
- Target drawer opens, closes, and keeps keyboard focus inside the dialog.
- My Plan drawer opens, closes, and keeps keyboard focus inside the dialog.
- My Player allows saving a draft without video links and keeps Today completeness guidance accurate.

## Recommended Tooling

- Add Vitest for pure TypeScript validation and normalization tests.
- Add a small mocked-Supabase layer for server action tests.
- Add Supabase CLI database tests for RLS, triggers, and migration behavior.
- Add Playwright smoke tests once auth test fixtures are available.
