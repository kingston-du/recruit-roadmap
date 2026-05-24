"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, CheckCircle2, Info, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/recruit/ui";
import { cn } from "@/lib/utils";
import type { RoadmapCard, RoadmapSection } from "@/lib/mock-data";

export function RoadmapGuide({ sections }: { sections: RoadmapSection[] }) {
  const cards = useMemo(() => sections.flatMap((section) => section.cards), [sections]);
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? "");
  const selectedCard = cards.find((card) => card.id === selectedId) ?? cards[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <div className="grid gap-5">
        {sections.map((section, sectionIndex) => (
          <section key={section.title} className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
              <div className="md:sticky md:top-28">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-800">
                  Row {sectionIndex + 1}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">{section.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{section.intro}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                {section.cards.map((card) => (
                  <RoadmapCardButton
                    key={card.id}
                    card={card}
                    isSelected={card.id === selectedCard.id}
                    onClick={() => setSelectedId(card.id)}
                  />
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

      <aside className="xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:pr-2 xl:overscroll-contain">
        <SelectedRoadmapPanel card={selectedCard} />
      </aside>
    </div>
  );
}

function RoadmapCardButton({
  card,
  isSelected,
  onClick,
}: {
  card: RoadmapCard;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        "flex min-h-72 flex-col rounded-md border bg-white p-4 text-left shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200",
        isSelected ? "border-cyan-500 ring-2 ring-cyan-100" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold tracking-tight text-slate-950">{card.name}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {card.label}
          </p>
        </div>
        <ArrowRight className="size-4 text-slate-400" />
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>

      <div className="mt-4 grid gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Best for
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-700">{card.bestFor}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Common next step
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-700">{card.commonNextStep}</p>
        </div>
      </div>
    </button>
  );
}

function SelectedRoadmapPanel({ card }: { card: RoadmapCard }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="cyan">Selected path</StatusPill>
        <StatusPill>{card.label}</StatusPill>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">{card.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>

      <div className="mt-5 grid gap-4">
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
            title="Example related leagues or teams"
            items={card.examples}
          />
        ) : null}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Button disabled className="bg-[#071a2f] text-white disabled:opacity-60">
          Add to My Plan
        </Button>
        <Button disabled variant="outline">
          View related targets
        </Button>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">
        Mock actions for this static prototype. This guide is educational and does not
        guarantee placement or predict outcomes.
      </p>
    </section>
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
          <li key={item} className="text-sm leading-6 text-slate-600">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
