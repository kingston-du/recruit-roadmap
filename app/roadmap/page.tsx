import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, Map, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { JsonLd } from "@/components/recruit/json-ld";
import { RoadmapGuide } from "@/components/recruit/roadmap-guide";
import { ImagePanel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { roadmapSections } from "@/lib/mock-data";
import { absoluteUrl, createBreadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

const roadmapDescription =
  "Learn common boys hockey paths from youth, AAA, high school, prep, academy, junior hockey, college, and beyond before building your target list.";

export const metadata: Metadata = createPageMetadata({
  title: "Boys Hockey Roadmap",
  description: roadmapDescription,
  path: "/roadmap",
  image: "/images/hockey/empty-rink.jpg",
  imageAlt: "Empty hockey rink used for the Hockey Pathway boys hockey roadmap",
  imageWidth: 1800,
  imageHeight: 1100,
});

const pathExamples = [
  "AAA",
  "High School",
  "Prep",
  "Academy",
  "USHL",
  "CHL",
  "NAHL",
  "NCDC",
  "EHL",
  "USPHL Premier",
  "NA3HL",
  "NCAA D1",
  "NCAA D3",
  "ACHA",
  "Pro / Minor Pro",
];

function createRoadmapJsonLd() {
  return [
    createBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Roadmap", path: "/roadmap" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": absoluteUrl("/roadmap#collection"),
      name: "Boys Hockey Roadmap",
      description: roadmapDescription,
      url: absoluteUrl("/roadmap"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: pathExamples.map((name) => ({
        "@type": "Thing",
        name,
      })),
      mainEntity: {
        "@type": "ItemList",
        itemListElement: roadmapSections.map((section, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: section.title,
          description: section.intro,
        })),
      },
    },
  ];
}

export default function RoadmapPage() {
  return (
    <AppShell
      title="Roadmap"
      eyebrow="Public pathway guide"
      activeHref="/roadmap"
      action={
        <div className="flex items-center gap-2">
          <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
            <Link href="/signup?next=/targets">
              <Target /> Start tracking your targets
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/signup?next=/my-plan">
              <ClipboardList /> Create My Plan
            </Link>
          </Button>
        </div>
      }
    >
      <JsonLd data={createRoadmapJsonLd()} />
      <div className="grid gap-6">
        <ImagePanel
          imageSrc="/images/hockey/empty-rink.jpg"
          imagePosition="center 48%"
          overlayClassName="bg-[#071a2f]/84"
          gradientClassName="bg-gradient-to-r from-[#071a2f]/96 via-[#071a2f]/88 to-[#071a2f]/70"
          className="p-5"
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-cyan-100">
                <Map className="size-5" />
                <p className="text-sm font-medium">Boys hockey pathway guide</p>
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Understand the common paths from youth hockey to college and beyond.
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                A free educational roadmap for families comparing AAA, school, prep,
                academy, junior, college, and later hockey options. Use it to learn the
                landscape first, then track the specific teams, schools, coaches, camps, and
                dates that fit your player.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild className="bg-white text-[#071a2f] hover:bg-cyan-50">
                  <Link href="/signup?next=/targets">
                    <Target /> Start tracking your targets
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/signup?next=/my-plan">
                    <ClipboardList /> Create My Plan
                  </Link>
                </Button>
              </div>
            </div>

            <div className="xl:border-l xl:border-white/10 xl:pl-6">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100">
                Path examples covered
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pathExamples.map((example) => (
                  <span
                    key={example}
                    className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/10"
                  >
                    {example}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-300">
                This is not a recruiting agency, scouting service, marketplace, or
                guarantee of roster spots, scholarships, or coach responses.
              </p>
            </div>
          </div>
        </ImagePanel>

        <RoadmapGuide sections={roadmapSections} />
      </div>
    </AppShell>
  );
}
