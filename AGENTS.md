<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Recruit Roadmap Hockey - Coding Instructions

You are building a lean MVP for a hockey recruiting roadmap app.

## Product goal
Build a private recruiting command center for hockey players and parents. The app helps a family turn a player profile into a target team/school board, outreach tracker, camp/tryout tracker, and weekly recruiting roadmap.

## What this is NOT
- Not a scouting network
- Not a marketplace
- Not a coach/player messaging platform
- Not an AI advisor that decides where a player should go
- Not a full team database
- Not a video hosting platform
- Not an automated scraper of MyHockeyRankings or Elite Prospects

## UX direction
Clean, serious, calm, sports-professional.
Think: Notion + Linear + recruiting binder.
Use dark navy, white, light gray, subtle ice-blue accents.
Avoid loud sports graphics, clutter, neon, childish styling.

## MVP pages
1. Landing page
2. Auth pages
3. Onboarding/player intake
4. Dashboard: weekly recruiting roadmap
5. Target board
6. Program detail page
7. Player profile page
8. Settings/admin seed page

## Main user
A hockey parent/player managing recruiting manually through spreadsheets, emails, camp links, and notes.

## Core value
The app should always answer:
"What should I do next this week?"

## Technical rules
- Use Next.js App Router
- Use TypeScript
- Use Tailwind
- Use shadcn/ui
- Use Supabase for auth and database
- Keep components simple
- Avoid unnecessary abstractions
- Use mock data first before wiring the database
- Every page should be mobile-friendly but desktop-first
- Do not add paid APIs
- Do not add AI features yet
- Do not add scraping

## MVP data objects
- PlayerProfile
- Program
- TargetProgram
- Contact
- OutreachLog
- Task
- Event
- RoadmapStage

## Development style
Build in small increments.
After each task, run lint/build.
Do not rewrite unrelated files.
Do not add features not requested.
