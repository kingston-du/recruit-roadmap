import Link from "next/link";
import type { Metadata } from "next";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { LogoMark } from "@/components/recruit/logo";
import { createPageMetadata } from "@/lib/seo";

const disclaimerDescription =
  "Understand Hockey Pathway's role as a planning tool, not a recruiting agency, scouting service, marketplace, or guarantee of outcomes.";

export const metadata: Metadata = createPageMetadata({
  title: "Disclaimer",
  description: disclaimerDescription,
  path: "/disclaimer",
});

const disclaimerSections = [
  {
    title: "Planning tool only",
    body: [
      "Hockey Pathway helps families organize targets, dates, contacts, profile links, notes, and next steps. This is not a recruiting agency, scouting service, or legal/eligibility advisor.",
      "The app does not evaluate players, rank players, decide where players should go, send messages to coaches, or scrape recruiting websites.",
    ],
  },
  {
    title: "No guaranteed outcomes",
    body: [
      "We do not guarantee roster spots, scholarships, placement, coach responses, or recruiting outcomes.",
      "Any recruiting result depends on many people and rules outside this app, including players, families, coaches, teams, schools, leagues, and eligibility organizations.",
    ],
  },
  {
    title: "Verify independently",
    body: [
      "Users must verify team, league, school, NCAA, and eligibility information independently. Do not rely on saved notes, links, or dates as the final source of truth.",
      "Before making decisions, check current official team, league, school, NCAA, and eligibility resources.",
    ],
  },
  {
    title: "Minors",
    body: [
      "Parent/guardian should manage accounts for minors. Do not use the service if the player is under 13 without parent/guardian involvement.",
    ],
  },
  {
    title: "Privacy reminder",
    body: [
      "We collect only information needed to organize recruiting tracking. Users can request deletion of account/data.",
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col">
        <article className="flex-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-cyan-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
          >
            <LogoMark size={28} />
            <span>Hockey Pathway</span>
          </Link>
          <p className="mt-8 text-sm font-semibold text-cyan-800">Last updated May 26, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Disclaimer</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This page keeps the boundary clear: Hockey Pathway is for organizing
            family recruiting work, not for promising or deciding recruiting results.
          </p>

          <div className="mt-10 grid gap-8">
            {disclaimerSections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
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

        <footer className="mt-12 border-t border-slate-200 pt-6">
          <LegalFooterLinks
            className="flex flex-wrap gap-4 text-sm"
            linkClassName="text-slate-600 hover:text-cyan-800"
          />
        </footer>
      </div>
    </main>
  );
}
