# Production Email Auth

Hockey Pathway keeps Supabase Auth for users, sessions, `auth.users`, and RLS. For production email/password signup, do not use Supabase's built-in email sender.

## Supabase Auth Settings

1. In Supabase, keep email confirmation enabled.
2. Configure custom SMTP in **Authentication > Emails > SMTP Settings**.
   - Default provider recommendation: Resend.
   - Use a verified transactional sender such as `no-reply@auth.your-domain.com`.
3. Configure SPF, DKIM, and DMARC for the sending domain before public launch.
4. In **Authentication > Rate Limits**, raise the email-send limit after SMTP is enabled.
   - Launch default: `rate_limit_email_sent = 100` emails per hour.
   - Supabase starts custom SMTP projects at a low sender-protection limit, so confirm this value before launch.
5. In **Authentication > Bot and Abuse Protection**, enable CAPTCHA protection with Cloudflare Turnstile.
   - Store the Turnstile secret key in Supabase only.
   - Store the public Turnstile site key in Vercel as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
6. In **Authentication > URL Configuration**, set production URLs.
   - **Site URL**: your live HTTPS site, not localhost.
   - **Redirect URLs**: add the exact live callback URL, for example `https://your-domain.com/auth/callback`.
   - Keep `http://localhost:3000/**` only as an additional local-development redirect URL.
7. In Vercel, set `NEXT_PUBLIC_SITE_URL` to the same live HTTPS site. Do not set it to `localhost` for Production or Preview.

## App Behavior

- Signup still calls `supabase.auth.signUp(...)` so existing sessions, callback handling, `auth.users`, and RLS policies keep working.
- When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set, the signup and login forms render Turnstile and pass the token to Supabase as `options.captchaToken`.
- The app shows friendly signup messages for email sender rate limits, CAPTCHA failures, disabled signup, and the default-SMTP "email address not authorized" failure.
- Supabase CAPTCHA protection applies to password sign-in too. If login returns `captcha_failed`, the login form is missing or submitting an expired Turnstile token.
- Cloudflare showing a successful Turnstile challenge only proves the browser solved the widget. Supabase still needs the matching Turnstile secret configured in **Authentication > Bot and Abuse Protection** before it will accept the token.
- If signup repeatedly fails with CAPTCHA errors, check the Supabase CAPTCHA secret before retrying. Failed signup attempts can still consume app and Supabase rate-limit windows.
- Confirmation links should be opened in the same browser used to sign up because the SSR email flow uses PKCE cookies.
- Production confirmation emails should never point to `localhost`. If they do, check both Vercel `NEXT_PUBLIC_SITE_URL` and Supabase **Authentication > URL Configuration**.

## Verification

- Create a new account with a non-team email address and confirm the email arrives from the verified domain.
- Open the confirmation link and verify it lands on `/auth/callback`, signs in, and redirects to the requested `next` path.
- Submit repeated signup attempts until rate limiting is triggered and verify the user sees a friendly retry message.
- Run `npm run lint`, `npm run typecheck`, and `npm run build` before release.
