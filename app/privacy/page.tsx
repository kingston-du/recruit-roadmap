import Link from "next/link";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { LogoMark } from "@/components/recruit/logo";

const privacySections = [
  {
    title: "What we collect",
    body: [
      "We collect only information needed to run Hockey Pathway and organize the recruiting details a family chooses to save. That can include account email, player profile details, target teams or schools, coach contact details, camp or date links, reminders, outreach history, setup assist requests, and notes.",
      "If you pay for a plan or Setup Assist, Stripe handles payment processing. Hockey Pathway may receive payment status information, but it does not store full card numbers or bank account details.",
      "We do not collect information to scout, rank, evaluate, or represent a player.",
    ],
  },
  {
    title: "Cookieless analytics",
    body: [
      "We use PostHog only for limited product analytics, such as sanitized page views and app events. PostHog is configured in cookieless mode, with no PostHog cookies, no local storage, no session storage, no session replay, no surveys, no product tours, no web experiments, no automatic click/form capture, and no person profiles.",
      "Analytics events are filtered before they leave the browser. The app allows only planned event names and limited metadata, such as page path, plan tier, feature source, count, or limit type. It strips emails, names, phone numbers, notes, player details, query strings, device IDs, session IDs, IP properties, and other browser or device metadata from client analytics events.",
      "PostHog cookieless measurement may use a short-lived server-side hash to count visits without storing a browser identifier. We do not call PostHog identify, and analytics is not used to identify a family or player.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "The current service uses essential cookies or similar storage only when needed for authentication, account security, checkout, or the basic operation of a feature the user requests.",
      "Because the current analytics setup is cookieless and we do not use advertising, retargeting, or cross-site tracking cookies, we do not show an accept cookies banner. If optional tracking cookies are added later, they should be disclosed and consent-gated where required before they are used.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use saved information to run the app, keep each family's tracking private to their account, provide Setup Assist when requested, process payments or subscription status, prevent abuse, troubleshoot errors, and improve basic product reliability.",
      "We do not sell personal information. We do not share personal information for cross-context behavioral advertising. We do not scrape MyHockeyRankings, Elite Prospects, team sites, school sites, or league sites for user profiles.",
    ],
  },
  {
    title: "Service providers",
    body: [
      "We use service providers to operate the product, including Supabase for authentication and database storage, Vercel for hosting, Stripe for payment processing, and PostHog for cookieless analytics when analytics environment variables are enabled.",
      "These providers may process information only as needed to provide their services, secure the app, comply with law, or support operations.",
    ],
  },
  {
    title: "Minors and family accounts",
    body: [
      "Hockey Pathway is intended for parents, guardians, and hockey families. A parent or guardian should create and manage any account used for a player under 13.",
      "Do not create or use an account for a child under 13 unless the parent or guardian is creating, managing, and consenting to the information saved in the account. Parents and guardians decide what information about a minor player is appropriate to save.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can update most saved recruiting information in the app. You can delete your account from Settings. Account deletion removes private app records tied to that account, including player profile, plan, targets, contacts, dates, outreach history, and setup assist requests.",
      "Some operational records may be retained only when required for legal, tax, payment, security, backup, or abuse-prevention purposes.",
      "California residents and users in similar privacy-rights jurisdictions may have rights to know, access, correct, delete, or limit certain uses of personal information. Hockey Pathway does not sell or share personal information for targeted advertising.",
    ],
  },
  {
    title: "Important limits",
    body: [
      "Users must verify team, league, school, NCAA, and eligibility information independently. Information saved in Hockey Pathway may become outdated or may be entered incorrectly.",
      "This is not a recruiting agency, scouting service, coach/player marketplace, or legal/eligibility advisor. It does not guarantee roster spots, scholarships, coach responses, or recruiting outcomes.",
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
          <p className="mt-8 text-sm font-semibold text-cyan-800">Last updated May 30, 2026</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This policy explains what Hockey Pathway collects, why it is used,
            and how the current app avoids non-essential tracking cookies.
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
