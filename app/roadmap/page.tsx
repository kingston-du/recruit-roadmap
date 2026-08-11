import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Map, ShieldCheck } from "lucide-react";

import { ImagePanel, StatusPill } from "@/components/recruit/ui";
import { JsonLd } from "@/components/recruit/json-ld";
import { RoadmapExplorer } from "@/components/roadmap/roadmap-explorer";
import { SiteShell } from "@/components/roadmap/site-shell";
import { Button } from "@/components/ui/button";
import {
  getLeaguePath,
  leagues,
  pathwayStages,
} from "@/lib/roadmap-data";
import {
  absoluteUrl,
  createBreadcrumbJsonLd,
  createCollectionJsonLd,
  createPageMetadata,
} from "@/lib/seo";

const roadmapDescription =
  "See how boys hockey can move from youth and school programs into prep, academy, junior, college, and professional leagues.";

export const metadata: Metadata = createPageMetadata({
  title: "Boys Hockey Roadmap",
  description: roadmapDescription,
  path: "/roadmap",
  image: "/images/hockey/empty-rink.jpg",
  imageAlt: "An empty hockey rink",
  imageWidth: 1800,
  imageHeight: 1100,
});

function roadmapJsonLd() {
  return [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Roadmap", path: "/roadmap" },
    ]),
    createCollectionJsonLd({
      id: absoluteUrl("/roadmap#collection"),
      name: "Boys Hockey Roadmap",
      description: roadmapDescription,
      path: "/roadmap",
      items: leagues.map((league) => ({
        name: league.name,
        description: league.summary,
        url: absoluteUrl(getLeaguePath(league)),
      })),
    }),
  ];
}

export default function RoadmapPage() {
  return (
    <SiteShell activeHref="/roadmap" className="px-5 py-6 sm:px-6 lg:px-8">
      <JsonLd data={roadmapJsonLd()} />
      <div className="mx-auto grid max-w-7xl gap-6">
        <ImagePanel
          imageSrc="/images/hockey/empty-rink.jpg"
          imagePosition="center 48%"
          overlayClassName="bg-[#071a2f]/82"
          gradientClassName="bg-gradient-to-r from-[#071a2f]/95 via-[#071a2f]/88 to-[#071a2f]/62"
          className="p-5 md:p-7"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-cyan-100">
                <Map className="size-5" />
                <p className="text-sm font-medium">Boys hockey roadmap</p>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                Find the leagues that make sense for your family to research.
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Choose a stage, region, or type of hockey. Open any league to see who it
                is for, how players get there, what to ask, and where to learn more.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <StatusPill tone="cyan">{leagues.length} pages</StatusPill>
                <StatusPill tone="amber">{pathwayStages.length} stages</StatusPill>
                <StatusPill>Boys hockey in North America</StatusPill>
              </div>
            </div>

            <div className="rounded-md border border-white/15 bg-white/10 p-4">
              <div className="flex items-center gap-2 text-cyan-100">
                <ShieldCheck className="size-4" />
                <p className="text-sm font-semibold">Before you use the guide</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-200">
                This is general information. We do not rank players, judge teams,
                contact coaches, collect data from other sites, or promise results.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-4 h-10 rounded-md border-white/25 bg-white text-[#071a2f] hover:bg-cyan-50"
              >
                <Link href="/disclaimer">
                  Read the Disclaimer <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </ImagePanel>

        <RoadmapExplorer stages={pathwayStages} leagues={leagues} />
      </div>
    </SiteShell>
  );
}
