<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Hockey Recruiting Roadmap App

## Product direction

This is a freemium hockey recruiting tracker and roadmap app for boys hockey players and parents.

The app helps families:
1. Learn the boys hockey pathway through a public Roadmap.
2. Create a personal My Plan.
3. Track target teams, schools, coaches, camps, and dates.
4. Know what to do today or this week.

## Main pages

1. Today
2. My Plan
3. Targets
4. My Player
5. Roadmap

## Business model

Free:
- Public Roadmap
- My Player
- My Plan
- Up to 5 targets
- Up to 3 coach contacts
- Up to 3 events/dates
- Basic Today checklist

Pro:
- Unlimited targets
- Unlimited contacts
- Unlimited events/dates
- Outreach history
- Follow-up reminders
- Shareable player profile
- Advanced Today checklist

Optional:
- $20 Setup Assist to help users import their own targets, contacts, dates, and links.

## What this is NOT

- Not a recruiting agency
- Not a scouting service
- Not a coach/player marketplace
- Not a guarantee of roster spots, scholarships, or coach responses
- Not an AI advisor deciding where players should go
- Not a scraping app for MyHockeyRankings or Elite Prospects

## Technical stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Zod validation
- Stripe Payment Links first
- Vercel deployment
- GitHub Actions CI

## Engineering rules

- Use TypeScript strictly.
- Use Zod for form validation.
- Use Supabase RLS for every private user-owned table.
- Never expose service role keys to client code.
- Never commit `.env.local`.
- Do not add AI.
- Do not add scraping.
- Do not add coach/player messaging.
- Do not add a marketplace.
- Keep every page simple enough for a non-technical hockey parent.
- Run lint, typecheck, and build after major changes.
- Codex must plan before coding.
- Codex must not add unrelated features.