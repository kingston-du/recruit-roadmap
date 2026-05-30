# Pre-Launch Security Audit

Last updated: May 29, 2026

## Fixed in code

- Added app-wide security headers in `next.config.ts`: CSP, HSTS, frame denial, content type sniffing protection, referrer policy, and permissions policy.
- Set the Server Actions body limit to `64kb`.
- Added proxy-level redirects for private routes while keeping page and action-level authorization checks.
- Added a dedicated `rate_limits` table plus the server-only `check_rate_limit` RPC for sliding-window throttling.
- Added rate-limit checks for login, signup, authenticated mutations, setup assist, admin plan changes, and account deletion.
- Kept rate-limit rows separate from `profiles`, `subscriptions`, and other identity or product data.
- Added self-service account deletion in Settings. Supabase Auth deletion cascades private app rows through existing foreign keys.
- Added user-friendly `404` and error pages.
- Revoked direct execute access from privileged trigger functions; only intended RPC/functions remain callable.
- Made signup errors generic to avoid leaking account existence details.

## Current audit notes

- RLS is enabled on every app table in the migrations, including `rate_limits`.
- Admin routes check Supabase Auth `app_metadata.role = "admin"` on the server before loading dashboard data or mutating subscription rows.
- The app does not define custom password hashing, raw SQL queries, upload endpoints, AI endpoints, CORS-open API routes, or Stripe webhook handlers.
- Stripe is currently Payment Links only. Pro access is still manually activated, so server-side price validation and webhook signature verification become required before adding automated billing fulfillment.

## Manual production checks

- Supabase Auth: enable email confirmation, short access-token expiry, refresh-token rotation, secure password policy, and secure password reset settings in the Supabase dashboard.
- Supabase project: verify backups, point-in-time restore policy, encryption at rest, and network restrictions appropriate to the launch plan.
- Bot protection: add Turnstile or hCaptcha before launch if anonymous signup/reset abuse becomes likely.
- Stripe: keep Payment Link prices fixed in Stripe, use separate dev/prod links, and rotate any exposed keys.
- Observability: configure production error monitoring and uptime checks before launch.
- Secrets: keep `.env.local` ignored and rotate any key that was ever committed or shared.
