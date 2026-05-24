import Link from "next/link";
import { ArrowDown, ArrowRight, ClipboardList, Map } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { roadmapSections } from "@/lib/mock-data";

export default function RoadmapPage() {
  const roadmapCards = roadmapSections.flatMap((section) => section.cards);

  return (
    <AppShell
      title="Roadmap"
      eyebrow="Public pathway guide"
      activeHref="/roadmap"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> View My Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-100">
              <Map className="size-5" />
              <p className="text-sm font-medium">Boys hockey pathway guide</p>
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              A simple way to understand the common paths.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This public guide explains options in plain language. It is not a promise,
              prediction, or ranking.
            </p>
          </div>
        </Panel>

        <div className="grid gap-5">
          {roadmapSections.map((section, sectionIndex) => (
            <div key={section.title} className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-start">
                <div className="rounded-md border border-slate-200 bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-800">
                    Step {sectionIndex + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{section.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{section.intro}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {section.cards.map((card) => (
                    <a
                      key={card.id}
                      href={`#roadmap-${card.id}`}
                      className="flex min-h-44 flex-col rounded-md border border-slate-200 bg-white p-4 shadow-sm hover:border-cyan-200 hover:bg-cyan-50/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold">{card.name}</p>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                            {card.label}
                          </p>
                        </div>
                        <ArrowRight className="size-4 text-slate-400" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {sectionIndex < roadmapSections.length - 1 ? (
                <div className="flex justify-center text-cyan-800" aria-hidden="true">
                  <ArrowDown className="size-6" />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Panel>
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <h2 className="text-lg font-semibold">Path details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Plain-language notes for each option in the guide.
              </p>
            </div>
            <StatusPill tone="cyan">Public guide</StatusPill>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {roadmapCards.map((card) => (
              <div
                key={card.id}
                id={`roadmap-${card.id}`}
                className="scroll-mt-32 rounded-md border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{card.name}</h3>
                  <StatusPill>{card.label}</StatusPill>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-md bg-slate-50 p-3">
                    <p className="text-sm font-medium">Parent note</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{card.parentNote}</p>
                  </div>
                  <div className="rounded-md bg-cyan-50 p-3">
                    <p className="text-sm font-medium">Common next step</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {card.commonNextStep}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
