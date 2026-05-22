<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Hockey Recruiting Roadmap App

## Product concept

This is a hockey recruiting roadmap app for boys hockey players and parents.

The app helps families:
1. Understand the hockey pathway through a public Roadmap page.
2. Build a personal My Plan for short-term and long-term recruiting goals.
3. Track target teams, schools, coaches, camps, and follow-ups.
4. Know what to do today or this week.

## Main app tabs

1. Today
2. My Plan
3. Targets
4. My Player
5. Roadmap

## Page purposes

### Today
Shows what the player/family should do this week.

### My Plan
Shows the player's personal recruiting plan:
- short-term next-season goals
- long-term goals
- selected pathways
- connected targets
- next steps

### Targets
Tracks teams, schools, camps, coaches, and opportunities.

### My Player
Shows player profile, videos, academics, references, and profile readiness.

### Roadmap
A public static educational boys hockey pathway guide.

Roadmap should be a vertical branching guide using clickable cards.
It should be easy for non-technical hockey parents to understand.

Example structure:
AAA / High School / Prep / Academy
branches into:
USHL, CHL, NAHL, NCDC, EHL, USPHL, Prep/PG
branches into:
NCAA D1, NCAA D3, ACHA, Pro / Minor Pro

## UX principles

- Extremely easy to understand
- Parent-friendly language
- Calm, clean, serious design
- Not flashy
- Not a scouting network
- Not a marketplace
- Not a generic spreadsheet
- No AI recommendations yet
- No scraping
- No Elite Prospects or MyHockeyRankings integrations yet
- Use mock data only for now

## Design style

- Dark navy / white / light gray / ice blue accent
- Big headings
- Clear cards
- Obvious buttons
- Few things on screen at once
- No clutter
- Desktop-first but mobile-friendly

## Important wording

Use:
- paths
- options
- targets
- recruiting plan
- next steps
- opportunities

Avoid:
- guaranteed spots
- predictions
- recruiting chances
- AI advisor language
- claims that the app can get a player recruited

## Technical stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Mock data only for this prototype
- No Supabase/auth/database yet
- No AI
- No scraping