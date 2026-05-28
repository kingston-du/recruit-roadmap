import Link from "next/link";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { LogoMark } from "@/components/recruit/logo";

const privacySections = [
  {
    title: "What we collect",
    body: [
      "We collect only information needed to organize recruiting tracking. That can include account email, player profile details, target teams or schools, coach contact notes, camp or date links, reminders, and notes you choose to save.",
      "We do not ask for information because we want to evaluate a player. We collect it so the signed-in family account can keep recruiting planning details in one place.",
    ],
  },
  {
    title: "Minors and family accounts",
    body: [
      "Parent/guardian should manage accounts for minors. Do not use the service if the player is under 13 without parent/guardian involvement.",
      "If a family uses the app for a minor player, the parent or guardian is responsible for deciding what information is appropriate to save.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use saved information to run the app, keep each family's tracking private to their account, provide Setup Assist when requested, and improve basic product reliability.",
      "We do not sell recruiting data. We do not scrape MyHockeyRankings, Elite Prospects, team sites, school sites, or league sites for user profiles.",
    ],
  },
  {
    title: "Your responsibility",
    body: [
      "Users must verify team, league, school, NCAA, and eligibility information independently. Information saved in Hockey Pathway may become outdated or may be entered incorrectly.",
      "This is not a recruiting agency, scouting service, or legal/eligibility advisor.",
    ],
  },
  {
    title: "Deleting account data",
    body: [
      "Users can request deletion of account/data. We may use the account email to verify the request before deleting private account records.",
    ],
  },
];

export default function PrivacyPage() {
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
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This early MVP privacy page explains, in plain language, what Hockey
            Pathway is trying to collect and why.
          </p>

          <div className="mt-10 grid gap-8">
            {privacySections.map((section) => (
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
