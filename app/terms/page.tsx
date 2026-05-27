import Link from "next/link";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";

const termsSections = [
  {
    title: "What this service is",
    body: [
      "Hockey Pathway is a planning and organization tool for hockey families. It helps users track their own player profile details, target teams or schools, coach contact notes, camps, dates, links, and next steps.",
      "This is not a recruiting agency, scouting service, or legal/eligibility advisor.",
    ],
  },
  {
    title: "Accounts for minors",
    body: [
      "Parent/guardian should manage accounts for minors. Do not use the service if the player is under 13 without parent/guardian involvement.",
      "Parents and guardians are responsible for deciding what information about a minor player is entered into the app.",
    ],
  },
  {
    title: "No recruiting promises",
    body: [
      "We do not guarantee roster spots, scholarships, placement, coach responses, or recruiting outcomes.",
      "The app does not decide where a player should go, does not contact coaches for users, and does not provide scouting evaluations.",
    ],
  },
  {
    title: "User responsibility",
    body: [
      "Users must verify team, league, school, NCAA, and eligibility information independently. Rules, rosters, costs, deadlines, and eligibility requirements can change.",
      "Users are responsible for their own outreach, research, decisions, and compliance with any team, league, school, NCAA, or eligibility rules that apply.",
    ],
  },
  {
    title: "Data and deletion",
    body: [
      "We collect only information needed to organize recruiting tracking and operate the account.",
      "Users can request deletion of account/data. We may verify the request through the account email before deleting private account records.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col">
        <article className="flex-1">
          <Link href="/" className="text-sm font-semibold text-cyan-800">
            Hockey Pathway
          </Link>
          <p className="mt-8 text-sm font-semibold text-cyan-800">Last updated May 26, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Terms</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            These early MVP terms are written for hockey families, not lawyers. By
            using Hockey Pathway, you agree to use it as an organization tool and
            to verify important recruiting information yourself.
          </p>

          <div className="mt-10 grid gap-8">
            {termsSections.map((section) => (
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
