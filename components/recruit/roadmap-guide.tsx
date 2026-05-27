"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Info,
  Search,
  Target,
  X,
} from "lucide-react";
import { Dialog } from "radix-ui";

import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/recruit/ui";
import { cn } from "@/lib/utils";
import type { RoadmapCard, RoadmapSection } from "@/lib/mock-data";

const sectionVisuals = [
  {
    imageSrc: "/images/hockey/skates-lineup.jpg",
    imagePosition: "center 58%",
  },
  {
    imageSrc: "/images/hockey/on-ice-action.jpg",
    imagePosition: "center",
  },
  {
    imageSrc: "/images/hockey/sticks-detail.jpg",
    imagePosition: "center 52%",
  },
  {
    imageSrc: "/images/hockey/empty-rink.jpg",
    imagePosition: "center 48%",
  },
  {
    imageSrc: "/images/hockey/on-ice-action.jpg",
    imagePosition: "center 58%",
  },
];

export function RoadmapGuide({ sections }: { sections: RoadmapSection[] }) {
  return (
    <section id="roadmap-guide" className="grid gap-5">
      <div className="grid gap-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="cyan">2-minute scan</StatusPill>
            <StatusPill>Educational guide</StatusPill>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Scan the pathway from top to bottom, then open the options your family wants to understand.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Most boys hockey families are comparing a current playing environment, a
            development step, possible junior options, and a college or later outcome.
            This roadmap keeps those choices organized without treating any route as a promise.
          </p>
        </div>

        <div className="border-l-4 border-cyan-200 pl-4">
          <p className="text-sm font-semibold text-slate-950">How parents can use it</p>
          <div className="mt-3 grid gap-3">
            {[
              "Start with where your player is now.",
              "Open realistic options to see what to research.",
              "Turn good-fit options into targets and plan steps.",
            ].map((item) => (
              <div key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-cyan-800" />
                <p className="text-sm leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        {sections.map((section, sectionIndex) => (
          <section key={section.title} className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
              <div className="md:sticky md:top-28">
                <div className="relative mb-3 hidden h-24 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm md:block">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${
                        sectionVisuals[sectionIndex]?.imageSrc ?? sectionVisuals[0].imageSrc
                      }")`,
                      backgroundPosition:
                        sectionVisuals[sectionIndex]?.imagePosition ??
                        sectionVisuals[0].imagePosition,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#071a2f]/62 via-[#071a2f]/14 to-white/0"
                  />
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-800">
                  Row {sectionIndex + 1}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.intro}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  {section.cards.length} options
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {section.cards.map((card) => (
                  <RoadmapCardDialog key={card.id} card={card} sectionTitle={section.title} />
                ))}
              </div>
            </div>

            {sectionIndex < sections.length - 1 ? (
              <div className="flex justify-center text-cyan-800" aria-hidden="true">
                <ArrowDown className="size-6" />
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}

function RoadmapCardDialog({
  card,
  sectionTitle,
}: {
  card: RoadmapCard;
  sectionTitle: string;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={`Open ${card.name} details`}
          className={cn(
            "group flex min-h-44 flex-col rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm transition",
            "hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50/40 hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950">{card.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </p>
            </div>
            <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700" />
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-800">
              View details
              <ArrowRight className="size-3.5" />
            </span>
          </div>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-3 bottom-3 z-50 max-h-[calc(100vh-1.5rem)] overflow-y-auto rounded-md border border-slate-200 bg-white p-5 shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-6",
            "md:inset-y-3 md:left-auto md:right-3 md:w-[min(560px,calc(100vw-2rem))] md:max-h-none md:data-[state=open]:slide-in-from-right-6 md:data-[state=closed]:slide-out-to-right-6",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="cyan">{sectionTitle}</StatusPill>
                <StatusPill>{card.label}</StatusPill>
              </div>
              <Dialog.Title className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                {card.name}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
                {card.description}
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close details"
                className="flex size-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailBlock title="Best for" body={card.bestFor} />
              <DetailBlock title="Common next step" body={card.commonNextStep} />
            </div>

            <DetailBlock title="What it is" body={card.whatItIs} />
            <DetailBlock title="Who it is usually for" body={card.usuallyFor} />
            <DetailBlock title="How players usually get there" body={card.howPlayersGetThere} />

            <DetailList
              icon={<Search className="size-4 text-cyan-700" />}
              title="What to research"
              items={card.whatToResearch}
            />
            <DetailList
              icon={<Info className="size-4 text-cyan-700" />}
              title="Common misconceptions"
              items={card.misconceptions}
            />
            {card.examples ? (
              <DetailList
                icon={<CheckCircle2 className="size-4 text-cyan-700" />}
                title="Examples"
                items={card.examples}
              />
            ) : null}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <Link href="/targets">
                <Target /> Start tracking your targets
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/my-plan">
                <ClipboardList /> Create My Plan
              </Link>
            </Button>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            This guide is educational. It is not a recruiting agency, scouting service,
            roster promise, scholarship promise, or guarantee of coach responses.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function DetailList({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm font-semibold text-slate-900">{title}</p>
      </div>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-1 size-3.5 shrink-0 text-cyan-700" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
