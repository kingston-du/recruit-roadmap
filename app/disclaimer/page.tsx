import type { Metadata } from "next";

import { SiteShell } from "@/components/roadmap/site-shell";
import { createPageMetadata } from "@/lib/seo";

const disclaimerDescription =
  "Hockey Pathway provides general information. We are not recruiters, scouts, or a player placement service.";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description: disclaimerDescription,
  path: "/disclaimer",
});

const disclaimerSections = [
  {
    title: "General information only",
    body: [
      "Hockey Pathway explains boys hockey leagues and the paths between them. The information is general and may not apply to your player.",
      "We do not evaluate or rank players and teams. We also do not tell families which league or program to choose.",
    ],
  },
  {
    title: "Not a recruiting service",
    body: [
      "Hockey Pathway is not a recruiting agency, scouting service, marketplace, placement service, or professional adviser.",
      "We do not contact coaches, send player information, negotiate offers, or promise that anyone will reply.",
    ],
  },
  {
    title: "No guaranteed outcomes",
    body: [
      "Nothing on this site promises a roster spot, scholarship, admission, draft selection, college placement, professional contract, or any other result.",
      "A team or league is included for reference. Its inclusion does not mean that we recommend it or believe it is right for a particular player.",
    ],
  },
  {
    title: "Verify current information",
    body: [
      "Leagues, teams, rules, costs, rosters, deadlines, and contact details can change at any time.",
      "Please confirm anything important with the league, team, school, or governing body before you make a decision.",
    ],
  },
  {
    title: "No scraping or AI advice",
    body: [
      "We do not collect listings from MyHockeyRankings, Elite Prospects, or team, school, and league websites.",
      "We do not use AI to advise families or decide where a player should play.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <SiteShell activeHref="/disclaimer" className="px-5 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-cyan-800">Last updated June 18, 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Disclaimer
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Hockey Pathway shares public information. We do not represent or evaluate players.
        </p>

        <div className="mt-10 grid gap-8">
          {disclaimerSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {section.title}
              </h2>
              <div className="mt-3 grid gap-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-7 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </SiteShell>
  );
}
