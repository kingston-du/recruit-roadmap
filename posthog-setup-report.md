<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Hockey Pathway. The following changes were made:

- **`instrumentation-client.ts`** — Already initializing PostHog via `initializePostHog()`. Added `capture_exceptions: true` and `defaults: "2026-01-30"` to the `posthog.init()` call so automatic exception tracking and PostHog defaults are enabled.
- **`lib/analytics-client.ts`** — Added `identifyPostHogUser(userId)` and `resetPostHog()` helpers alongside the existing `trackAnalyticsEvent` and `trackPageView` utilities.
- **`lib/analytics.ts`** — Updated `sanitizePostHogCapture` to allow `$identify` events through (so user linking works) and `$exception` events through (for automatic error tracking). These system events were previously filtered by the `before_send` hook.
- **`components/recruit/analytics-page-views.tsx`** — Added a Supabase `onAuthStateChange` listener that calls `posthog.identify(userId)` on `SIGNED_IN` and `posthog.reset()` on `SIGNED_OUT`, linking all events to the Supabase user UUID.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `signup_completed` | User completes signup and lands on the app for the first time | `components/recruit/analytics-page-views.tsx` |
| `player_profile_saved` | User saves their player profile (position, birth year, graduation year, etc.) | `components/recruit/player-profile-form.tsx` |
| `target_created` | User adds a new target (team, school, camp, or league) to their board | `components/recruit/targets-board.tsx` |
| `third_target_created` | Milestone: user has created their third target | `components/recruit/targets-board.tsx` |
| `contact_created` | User saves a new coach or staff contact | `components/recruit/targets-board.tsx` |
| `event_created` | User adds a camp, tryout, deadline, visit, or other date | `components/recruit/targets-board.tsx` |
| `free_limit_hit` | Free-plan user encounters a target, contact, event, or outreach limit | `components/recruit/targets-board.tsx` |
| `upgrade_clicked` | User clicks an upgrade or Pro button | `components/recruit/checkout-button.tsx` |
| `my_plan_created` | User creates or saves their first My Plan pathway entry | `components/recruit/my-plan-workspace.tsx` |
| `roadmap_card_clicked` | User opens a card in the public Roadmap guide | `components/recruit/roadmap-guide.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/project/443718/dashboard/1645753)
- [New signups over time](/project/443718/insights/AcfYQMWX)
- [Upgrade intent over time](/project/443718/insights/XgKoD254)
- [Core engagement: targets, contacts & events](/project/443718/insights/f2ZyF4jj)
- [Signup to first target funnel](/project/443718/insights/WHBbQeBz)
- [Free limit hit to upgrade funnel](/project/443718/insights/WKyBKZgG)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
