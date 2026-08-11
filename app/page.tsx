import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  Map,
  ShieldCheck,
} from "lucide-react";

import { ImageBackdrop, StatusPill } from "@/components/recruit/ui";
import { JsonLd } from "@/components/recruit/json-ld";
import { SiteShell } from "@/components/roadmap/site-shell";
import { Button } from "@/components/ui/button";
import {
  formatReviewDate,
  getLeaguePath,
  leagues,
  pathwayStages,
} from "@/lib/roadmap-data";
import {
  absoluteUrl,
  createCollectionJsonLd,
  createPageMetadata,
  siteConfig,
} from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
  image: "/landing-hero.png",
});

const featuredLeagueSlugs = ["aaa-hockey", "ushl", "chl", "ncaa-d3", "acha", "bchl"];
const featuredLeagues = featuredLeagueSlugs
  .map((slug) => leagues.find((league) => league.slug === slug))
  .filter((league): league is (typeof leagues)[number] => Boolean(league));

const principles = [
  "Free information for hockey families",
  "Links to official sources on every league page",
  "No rankings, promises, or player evaluations",
  "No accounts, payments, scraping, AI, or marketplace",
];

function homeJsonLd() {
  return [
    createCollectionJsonLd({
      id: absoluteUrl("/#league-guide"),
      name: "North American boys hockey league and pathway guide",
      description: siteConfig.description,
      path: "/",
      items: leagues.map((league) => ({
        name: league.name,
        description: league.summary,
        url: absoluteUrl(getLeaguePath(league)),
      })),
    }),
  ];
}

export default function HomePage() {
  return (
    <SiteShell activeHref="/">
      <JsonLd data={homeJsonLd()} />

      <section className="relative overflow-hidden bg-[#071a2f] text-white">
        <ImageBackdrop
          imageSrc="/landing-hero.png"
          imagePosition="center right"
          overlayClassName="bg-[#071a2f]/54"
          gradientClassName="bg-gradient-to-r from-[#071a2f] via-[#071a2f]/90 to-[#071a2f]/36"
        />
        <div className="relative mx-auto grid min-h-[calc(100svh-6.5rem)] max-w-7xl content-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-cyan-50 ring-1 ring-white/15">
              <Map className="size-4" />
              North American boys hockey roadmap
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
              Hockey Pathway
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
              Learn how youth, prep, academy, junior, and college hockey fit together
              before your family starts making calls.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-md bg-white px-5 text-base text-[#071a2f] hover:bg-cyan-50"
              >
                <Link href="/roadmap">
                  See the Roadmap <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-md border-white/30 bg-white/10 px-5 text-base text-white hover:bg-white hover:text-[#071a2f]"
              >
                <Link href="#leagues">Find a League</Link>
              </Button>
            </div>
          </div>

          <aside className="rounded-md border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold text-cyan-100">What you will find here</p>
            <div className="mt-4 grid gap-3">
              {principles.map((principle) => (
                <div key={principle} className="flex gap-3 text-sm leading-6 text-slate-100">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-200" />
                  {principle}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-300">
              We are not recruiters or scouts. We do not represent players, contact
              coaches, or promise roster spots, scholarships, or replies.
            </p>
          </aside>
        </div>
      </section>

      <section id="pathways" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-cyan-800">How the roadmap works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Start with where your player is now.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              From there, you can look at school, prep, academy, junior, and college
              options. Each section shows what families usually need to think about next.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pathwayStages.map((stage, index) => (
              <div
                key={stage.id}
                className="rounded-md border border-slate-200 bg-[#fbfcfe] p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <StatusPill tone={index < 2 ? "amber" : index < 5 ? "cyan" : "slate"}>
                    {stage.eyebrow}
                  </StatusPill>
                  <span className="font-mono text-xs text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  {stage.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="leagues" className="bg-[#eef7fb]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-cyan-800">League guides</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                Get the basics without digging through dozens of tabs.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Each page covers who the league is for, how players get in, what it may
                cost, which questions to ask, and where to check the official details.
              </p>
            </div>
            <Button asChild className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <Link href="/roadmap">
                See Every Path <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredLeagues.map((league) => (
              <Link
                key={league.slug}
                href={getLeaguePath(league)}
                className="smooth-card group flex min-h-60 flex-col rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-cyan-300 hover:bg-cyan-50/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    <StatusPill tone="cyan">{league.type}</StatusPill>
                    <StatusPill tone="amber">{league.geography}</StatusPill>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-cyan-700" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                  {league.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{league.summary}</p>
                <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-cyan-800">
                  <ShieldCheck className="size-3.5" />
                  Information checked {formatReviewDate(league.lastReviewed)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-cyan-800">A quick note</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Use this as a starting point for your own research.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              League rules, costs, rosters, and deadlines change. Check important details
              with the league, team, school, or governing body before making a decision.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                icon: BookOpen,
                title: "Written and checked by hand",
                body: "The information comes from published sources. We do not scrape listings or accept public rankings.",
              },
              {
                icon: Compass,
                title: "Notes for families",
                body: "The parent, coach, and scout notes are general points to consider. They are not quotes or endorsements.",
              },
              {
                icon: ExternalLink,
                title: "Official links",
                body: "Every league page links to official websites so you can confirm the current details yourself.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-md border border-slate-200 bg-[#fbfcfe] p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#d71920] text-white">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight text-slate-950">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
