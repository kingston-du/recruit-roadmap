import type { Metadata } from "next";

import { SiteShell } from "@/components/roadmap/site-shell";
import { createPageMetadata } from "@/lib/seo";

const termsDescription =
  "Read the terms for using Hockey Pathway and its league guides.";

export const metadata: Metadata = createPageMetadata({
  title: "Terms",
  description: termsDescription,
  path: "/terms",
});

const termsSections = [
  {
    title: "What this service is",
    body: [
      "Hockey Pathway is a public guide to boys hockey leagues and pathways.",
      "We are not recruiters, scouts, legal advisers, eligibility advisers, or a marketplace. We do not promise hockey results.",
    ],
  },
  {
    title: "No recruiting promises",
    body: [
      "The site does not promise roster spots, scholarships, placement, replies from coaches, advancement, or professional opportunities.",
      "The league pages can help with research, but your family is responsible for deciding where a player should play.",
    ],
  },
  {
    title: "Verify independently",
    body: [
      "Rules, league status, rosters, costs, eligibility requirements, admissions requirements, and deadlines can change.",
      "Before making a decision, confirm the details with the league, team, school, NCAA, U SPORTS, USA Hockey, Hockey Canada, or another official source.",
    ],
  },
  {
    title: "No submissions or messaging",
    body: [
      "The site does not offer public comments, player profiles, coach messaging, recruiting outreach, target lists, or paid services.",
      "The parent, coach, and scout notes are general guidance written for this site. They are not quotes, endorsements, scouting reports, or public comments.",
    ],
  },
  {
    title: "External links",
    body: [
      "Hockey Pathway links to outside websites. We are not responsible for their content, policies, or availability.",
    ],
  },
];

export default function TermsPage() {
  return (
    <SiteShell activeHref="/disclaimer" className="px-5 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-cyan-800">Last updated June 18, 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Terms</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          These terms apply to the public Hockey Pathway website.
        </p>

        <div className="mt-10 grid gap-8">
          {termsSections.map((section) => (
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
