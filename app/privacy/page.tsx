import type { Metadata } from "next";

import { SiteShell } from "@/components/roadmap/site-shell";
import { createPageMetadata } from "@/lib/seo";

const privacyDescription =
  "Read what Hockey Pathway collects, how site analytics may be used, and what happens when you follow an outside link.";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: privacyDescription,
  path: "/privacy",
});

const privacySections = [
  {
    title: "What we collect",
    body: [
      "Hockey Pathway is a public information site. There are no accounts, player profiles, paid plans, or private user records.",
      "We do not ask for player details, coach contacts, team lists, payment information, or recruiting notes.",
    ],
  },
  {
    title: "Analytics",
    body: [
      "We may use basic site analytics to learn which public pages people visit and whether the site is working properly.",
      "We do not use analytics to identify, rank, evaluate, or build profiles of players or families.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We do not use cookies for accounts, checkout, or recruiting tools because the site does not offer those features.",
      "If that changes, we will update this policy before the new feature is used.",
    ],
  },
  {
    title: "Links to other websites",
    body: [
      "We link to league, team, school, and governing body websites. Those sites have their own privacy policies and practices.",
      "Check current rules, rosters, costs, and school information with the official source.",
    ],
  },
  {
    title: "Minors",
    body: [
      "This site is for parents, guardians, and families researching boys hockey. We do not collect information from children or create accounts for minors.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <SiteShell activeHref="/disclaimer" className="px-5 py-10 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-cyan-800">Last updated June 18, 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
          Privacy Policy
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Hockey Pathway is a public guide. You do not need an account to use it.
        </p>

        <div className="mt-10 grid gap-8">
          {privacySections.map((section) => (
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
