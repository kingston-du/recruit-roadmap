import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { StatusPill } from "@/components/recruit/ui";
import { JsonLd } from "@/components/recruit/json-ld";
import { SiteShell } from "@/components/roadmap/site-shell";
import { Button } from "@/components/ui/button";
import {
  formatReviewDate,
  getLeagueBySlug,
  getLeaguePath,
  leagues,
  pathwayStages,
  type League,
} from "@/lib/roadmap-data";
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";

type LeaguePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return leagues.map((league) => ({ slug: league.slug }));
}

export async function generateMetadata({ params }: LeaguePageProps): Promise<Metadata> {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);

  if (!league) {
    return createPageMetadata({
      title: "League Not Found",
      description: "We could not find that Hockey Pathway league page.",
      path: "/roadmap",
    });
  }

  return createPageMetadata({
    title: `${league.name} Guide`,
    description: league.summary,
    path: getLeaguePath(league),
    image: "/images/hockey/on-ice-action.jpg",
    imageAlt: `${league.name} hockey pathway guide`,
    imageWidth: 1800,
    imageHeight: 1200,
  });
}

function leagueJsonLd(league: League) {
  return [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Roadmap", path: "/roadmap" },
      { name: league.shortName, path: getLeaguePath(league) },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": absoluteUrl(`${getLeaguePath(league)}#article`),
      headline: `${league.name} Guide`,
      description: league.summary,
      url: absoluteUrl(getLeaguePath(league)),
      dateModified: league.lastReviewed,
      mainEntityOfPage: absoluteUrl(getLeaguePath(league)),
      about: [
        { "@type": "Thing", name: league.name },
        { "@type": "Thing", name: league.type },
        { "@type": "Place", name: league.geography },
      ],
      citation: league.sources.map((source) => source.url),
    },
  ];
}

export default async function LeaguePage({ params }: LeaguePageProps) {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);

  if (!league) {
    notFound();
  }

  const stage = pathwayStages.find((item) => item.id === league.stageId);
  const relatedLeagues = leagues
    .filter((item) => item.stageId === league.stageId && item.slug !== league.slug)
    .slice(0, 4);

  return (
    <SiteShell className="px-5 py-6 sm:px-6 lg:px-8">
      <JsonLd data={leagueJsonLd(league)} />
      <article className="mx-auto grid max-w-7xl gap-6">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 rounded-md text-sm font-semibold text-cyan-800 hover:text-cyan-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
          >
            <ArrowLeft className="size-4" />
            Roadmap
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone="cyan">{league.type}</StatusPill>
                <StatusPill tone="amber">{league.geography}</StatusPill>
                {stage ? <StatusPill>{stage.eyebrow}</StatusPill> : null}
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {league.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                {league.summary}
              </p>
            </div>

            <aside className="rounded-md border border-cyan-100 bg-cyan-50 p-4">
              <div className="flex items-center gap-2 text-cyan-900">
                <ShieldCheck className="size-4" />
                <p className="text-sm font-semibold">Page details</p>
              </div>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold text-slate-950">Last checked</dt>
                  <dd className="mt-1 text-slate-700">
                    {formatReviewDate(league.lastReviewed)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Category</dt>
                  <dd className="mt-1 text-slate-700">{league.category}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-950">Official links</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {league.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-100 hover:text-cyan-950"
                      >
                        {source.label}
                        <ExternalLink className="size-3" />
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="grid gap-6">
            <Section title="What This League Is" icon={<FileText className="size-5" />}>
              <p className="text-base leading-7 text-slate-600">{league.overview}</p>
            </Section>

            <Section title="Who Usually Plays Here" icon={<Users className="size-5" />}>
              <DetailList items={league.whoFor} />
            </Section>

            <Section title="How Players Get In" icon={<ArrowRight className="size-5" />}>
              <DetailList items={league.entryPoints} />
            </Section>

            <Section title="Questions Worth Asking" icon={<Search className="size-5" />}>
              <DetailList items={league.researchQuestions} />
            </Section>

            <Section title="Costs And Practical Details" icon={<MapPin className="size-5" />}>
              <DetailList items={league.costLogistics} />
            </Section>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-28">
            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                A Few Things To Consider
              </h2>
              <div className="mt-4 grid gap-3">
                {league.perspectives.map((note) => (
                  <div key={`${note.type}-${note.body}`} className="rounded-md bg-[#f7fafc] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#d71920]">
                      {note.type}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{note.body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-500">
                These notes are general guidance. They are not quotes, endorsements, or scouting reports.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                Teams And Programs To Know
              </h2>
              <div className="mt-4 grid gap-3">
                {league.notableTeams.map((team) => (
                  <a
                    key={team.name}
                    href={team.url}
                    target="_blank"
                    rel="noreferrer"
                    className="smooth-card rounded-md border border-slate-200 bg-[#fbfcfe] p-3 hover:border-cyan-300 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{team.name}</p>
                        <p className="mt-1 text-xs font-medium text-slate-500">{team.location}</p>
                      </div>
                      <ExternalLink className="size-4 shrink-0 text-slate-400" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>

        {relatedLeagues.length > 0 ? (
          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-cyan-800">Keep looking</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Other paths at this stage
                </h2>
              </div>
              <Button asChild variant="outline" className="h-10 w-fit rounded-md bg-white">
                <Link href="/roadmap">See the Full Roadmap</Link>
              </Button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {relatedLeagues.map((related) => (
                <Link
                  key={related.slug}
                  href={getLeaguePath(related)}
                  className="smooth-card group rounded-md border border-slate-200 bg-[#fbfcfe] p-4 hover:border-cyan-300 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{related.shortName}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {related.category}
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{related.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteShell>
  );
}

function Section({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 text-cyan-800">
        {icon}
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-7 text-slate-600">
          <CheckDot />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckDot() {
  return <span className="mt-2 size-2 shrink-0 rounded-full bg-[#d71920]" aria-hidden="true" />;
}
