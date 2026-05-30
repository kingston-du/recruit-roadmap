<wizard-report>
# PostHog post-wizard report

The wizard attempted a deeper PostHog integration into Hockey Pathway. The identity-related parts were removed after review so the app stays on the anonymous, privacy-safe analytics plan.

- **`instrumentation-client.ts`** — Initializes PostHog via `initializePostHog()` on client hydration, using `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.
- **`lib/analytics.ts`** — Keeps a `before_send` privacy hook that only allows manual `$pageview` plus approved custom events.
- **`lib/analytics-client.ts`** — Keeps `trackAnalyticsEvent` and `trackPageView`; no `posthog.identify()` or `posthog.reset()` wrappers are present.
- **`app/layout.tsx`** — Keeps the manual `<AnalyticsPageViews />` component in `Suspense`.
- **`.env.local`** — Set `NEXT_PUBLIC_POSTHOG_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `signup_completed` | User completes signup and lands on the app for the first time | `components/recruit/analytics-page-views.tsx` |
| `player_profile_saved` | User saves their player profile (position, birth year, goals, etc.) | `components/recruit/player-profile-form.tsx` |
| `target_created` | User adds a new target (team, school, camp, or league) to their board | `components/recruit/targets-board.tsx` |
| `third_target_created` | Milestone: user has created their third target | `components/recruit/targets-board.tsx` |
| `contact_created` | User saves a new coach or staff contact | `components/recruit/targets-board.tsx` |
| `event_created` | User adds a camp, tryout, deadline, visit, or other date | `components/recruit/targets-board.tsx` |
| `free_limit_hit` | Free-plan user encounters a target, contact, event, or outreach limit | `components/recruit/targets-board.tsx` |
| `upgrade_clicked` | User clicks an upgrade or Pro button | `components/recruit/checkout-button.tsx`, `components/recruit/targets-board.tsx` |
| `my_plan_created` | User creates or saves their first My Plan pathway entry | `components/recruit/my-plan-workspace.tsx` |
| `roadmap_card_clicked` | User opens a card in the public Roadmap guide | `components/recruit/roadmap-guide.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/project/446203/dashboard/1646169)
- [New signups over time](/project/446203/insights/6HA9T0ux)
- [Activation funnel: signup → target → contact](/project/446203/insights/6RjHr14S)
- [Feature engagement over time](/project/446203/insights/QNT8dZxe)
- [Upgrade intent: limit hits and upgrade clicks](/project/446203/insights/kvUWsStm)
- [Content creation: targets, events, contacts](/project/446203/insights/0GM9OVUv)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
