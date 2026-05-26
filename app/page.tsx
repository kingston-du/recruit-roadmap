import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Mail,
  Map,
  Target,
  UserRound,
  Video,
} from "lucide-react";

import { LegalFooterLinks } from "@/components/recruit/legal-footer-links";
import { Button } from "@/components/ui/button";

const productPages: Array<{
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    name: "Today",
    href: "/today",
    description: "See the few things that need attention this week.",
    icon: CalendarCheck,
  },
  {
    name: "My Plan",
    href: "/my-plan",
    description: "Turn goals into a simple plan the whole family can follow.",
    icon: ClipboardList,
  },
  {
    name: "Targets",
    href: "/targets",
    description: "Track teams, schools, camps, coaches, notes, and next steps.",
    icon: Target,
  },
  {
    name: "My Player",
    href: "/my-player",
    description: "Keep player details, video links, and profile items in one place.",
    icon: UserRound,
  },
  {
    name: "Roadmap",
    href: "/roadmap",
    description: "Learn common boys hockey paths before choosing what to research.",
    icon: Map,
  },
];

const problemItems = [
  { label: "Teams", icon: Target },
  { label: "Coaches", icon: UserRound },
  { label: "Camps", icon: CalendarCheck },
  { label: "Videos", icon: Video },
  { label: "Emails", icon: Mail },
  { label: "Follow-ups", icon: CheckCircle2 },
];

const freePlanItems = [
  "Public Roadmap",
  "My Player and My Plan",
  "Up to 5 targets",
  "Up to 3 coach contacts",
  "Up to 3 events or dates",
  "Basic Today checklist",
];

const proPlanItems = [
  "Unlimited targets",
  "Unlimited contacts",
  "Unlimited events and dates",
  "Outreach history",
  "Follow-up reminders",
  "Shareable player profile",
  "Advanced Today checklist",
];

function StartFreeButton({ className = "" }: { className?: string }) {
  return (
    <Button
      asChild
      className={`h-12 rounded-md bg-[#d71920] px-5 text-base text-white hover:bg-[#b8141a] ${className}`}
    >
      <Link href="/signup">
        Start free <ArrowRight className="size-4" />
      </Link>
    </Button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold text-cyan-800">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-slate-600">{children}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section
        className="relative flex min-h-[84svh] overflow-hidden bg-[#071a2f] text-white"
        style={{
          backgroundImage: "url('/landing-hero.png')",
          backgroundPosition: "center right",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#071a2f]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071a2f] via-[#071a2f]/88 to-[#071a2f]/20" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-6 lg:px-8">
          <header className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-semibold text-[#071a2f]">
                RR
              </span>
              <span>
                <span className="block text-sm font-semibold">Recruit Roadmap</span>
                <span className="block text-xs text-cyan-100">Hockey family plan</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium text-cyan-50 md:flex">
              <Link href="#product" className="hover:text-white">
                Product
              </Link>
              <Link href="/pricing" className="hover:text-white">
                Plans
              </Link>
              <Link href="/roadmap" className="hover:text-white">
                Roadmap
              </Link>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
            </nav>
          </header>

          <div className="flex flex-1 items-center py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-cyan-100">
                Boys hockey recruiting tracker for families
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] text-white md:text-6xl">
                Organize your hockey recruiting path without messy spreadsheets.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
                Recruit Roadmap helps parents and players keep targets, coach contacts,
                camps, videos, dates, and next steps together so the week feels clear.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <StartFreeButton />
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-md border-white/35 bg-white/10 px-5 text-base text-white hover:bg-white hover:text-[#071a2f]"
                >
                  <Link href="/roadmap">View Roadmap</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-cyan-50">
                Free includes the public Roadmap, My Plan, My Player, and 5 targets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef7fb]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <SectionHeading
            eyebrow="The problem"
            title="Recruiting gets hard to manage before it gets official."
          >
            Families are juggling teams, coaches, camps, videos, emails, and
            follow-ups. A simple plan keeps important details from getting buried in
            texts, tabs, and old spreadsheets.
          </SectionHeading>

          <div className="grid gap-3 sm:grid-cols-2 lg:pt-8">
            {problemItems.map((item) => (
              <div
                key={item.label}
                className="flex min-h-20 items-center gap-3 rounded-md border border-cyan-100 bg-white p-4 shadow-sm"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-cyan-50 text-cyan-800">
                  <item.icon className="size-5" />
                </span>
                <p className="font-semibold text-slate-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The product"
            title="Five simple pages for the work families already do."
          >
            The app is organized around the way hockey parents actually plan:
            understand the pathway, build a plan, track targets, keep the player
            profile ready, and know what to do next.
          </SectionHeading>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {productPages.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                className="group flex min-h-56 flex-col rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-cyan-300 hover:bg-cyan-50/40"
              >
                <span className="flex size-11 items-center justify-center rounded-md bg-[#071a2f] text-white">
                  <page.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{page.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {page.description}
                </p>
                <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-cyan-800">
                  Preview page <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Start free"
            title="Begin with 5 targets before you decide to upgrade."
          >
            Recruit Roadmap is built for families who want to get organized first.
            Start with the free plan, then move to Pro only when tracking grows.
          </SectionHeading>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-cyan-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-semibold text-cyan-800">Free plan</p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-950">$0</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    A clear place to start without a payment method.
                  </p>
                </div>
                <StartFreeButton className="sm:mt-1" />
              </div>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {freePlanItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-700" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-slate-200 bg-[#071a2f] p-6 text-white shadow-sm">
              <p className="text-sm font-semibold text-cyan-100">Pro plan</p>
              <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h3 className="text-3xl font-semibold">$5/month</h3>
                <p className="pb-1 text-sm text-slate-300">or $39/year</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                For families tracking more teams, contacts, dates, and follow-ups.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {proPlanItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-200" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-slate-300">
                Upgrade when the family is tracking more than the free limits.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-5 h-10 rounded-md border-white/25 bg-white text-[#071a2f] hover:bg-cyan-50"
              >
                <Link href="/pricing">View Pro options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <SectionHeading
            eyebrow="Setup Assist"
            title="Optional $20 import help when your list is already scattered."
          >
            Some families already have targets, coach names, camp dates, and links in
            different places. Setup Assist is a one-time import service to help get
            those details into the tracker.
          </SectionHeading>

          <div className="rounded-md border border-[#f5c2c5] bg-[#fff7f7] p-6">
            <h3 className="text-xl font-semibold text-slate-950">What it can help with</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {["Targets", "Coach contacts", "Important dates", "Video and profile links"].map(
                (item) => (
                  <div key={item} className="flex gap-3 rounded-md bg-white p-4">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#d71920]" />
                    <p className="text-sm font-medium text-slate-800">{item}</p>
                  </div>
                ),
              )}
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              This is optional and not required to use the free plan.
            </p>
            <Button
              asChild
              className="mt-5 h-10 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
            >
              <Link href="/pricing">View Setup Assist</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#071a2f] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-cyan-100">Plain-English disclaimer</p>
            <h2 className="mt-3 text-3xl font-semibold">
              A planning tool, not a recruiting service.
            </h2>
          </div>
          <p className="text-base leading-8 text-slate-200">
            Recruit Roadmap is not a recruiting agency, scouting service, coach/player
            marketplace, or guarantee of roster spots, scholarships, coach responses,
            or outcomes. It helps your family stay organized while you do your own
            research and outreach.
          </p>
        </div>
      </section>

      <section className="bg-[#eef7fb]">
        <div
          id="start-free"
          className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-cyan-800">Ready to get organized?</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              Start free and build your first hockey recruiting plan.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Add your player profile, pick a few targets, and use Today to keep the
              next step clear.
            </p>
          </div>
          <StartFreeButton />
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>Recruit Roadmap is a planning tool for hockey families.</p>
          <LegalFooterLinks
            className="flex flex-wrap gap-4"
            linkClassName="hover:text-cyan-800"
          />
        </div>
      </footer>
    </main>
  );
}
