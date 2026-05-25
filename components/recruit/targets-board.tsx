"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CalendarDays, ExternalLink, Mail, MapPin, NotebookText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/recruit/ui";
import type { Target, TargetStatus } from "@/lib/mock-data";

const columns: TargetStatus[] = [
  "Researching",
  "Planning to Contact",
  "Contacted",
  "Interested / Next Step",
  "Not a Fit",
];

export function TargetsBoard({ targets }: { targets: Target[] }) {
  const [selectedId, setSelectedId] = useState(targets[0]?.id ?? "");
  const selectedTarget = targets.find((target) => target.id === selectedId) ?? targets[0];
  const targetsByStatus = useMemo(
    () =>
      columns.map((column) => ({
        title: column,
        targets: targets.filter((target) => target.status === column),
      })),
    [targets],
  );

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px] 2xl:items-start">
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1180px] grid-cols-5 gap-4">
          {targetsByStatus.map((column) => (
            <section key={column.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 px-1 py-2">
                <h2 className="text-sm font-semibold text-slate-950">{column.title}</h2>
                <span className="text-xs font-medium text-slate-500">{column.targets.length}</span>
              </div>

              <div className="mt-2 grid gap-3">
                {column.targets.length > 0 ? (
                  column.targets.map((target) => (
                    <TargetCard
                      key={target.id}
                      target={target}
                      isSelected={target.id === selectedTarget.id}
                      onClick={() => setSelectedId(target.id)}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
                    No targets here yet.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <aside className="2xl:sticky 2xl:top-28 2xl:max-h-[calc(100vh-8rem)] 2xl:overflow-y-auto 2xl:pr-2 2xl:overscroll-contain">
        <TargetDetailPanel target={selectedTarget} />
      </aside>
    </div>
  );
}

function TargetCard({
  target,
  isSelected,
  onClick,
}: {
  target: Target;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={
        isSelected
          ? "rounded-md border border-cyan-500 bg-white p-4 text-left shadow-sm ring-2 ring-cyan-100"
          : "rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-cyan-200 hover:bg-cyan-50/40"
      }
    >
      <h3 className="font-semibold tracking-tight text-slate-950">{target.name}</h3>
      <p className="mt-1 text-sm text-slate-600">
        {target.kind} - {target.path}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="size-4 text-slate-400" /> {target.location}
      </p>
      <div className="mt-3">
        <StatusPill tone="cyan">{target.connectedPath}</StatusPill>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{target.nextStep}</p>
      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
        <CalendarDays className="size-4 text-cyan-700" /> {target.nextDate}
      </p>
    </button>
  );
}

function TargetDetailPanel({ target }: { target: Target }) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <StatusPill tone="cyan">{target.status}</StatusPill>
        <StatusPill>{target.connectedPath}</StatusPill>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight">{target.name}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {target.kind} - {target.path}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {target.location}
      </p>

      <div className="mt-5 grid gap-4">
        <DetailBlock title="Notes" icon={<NotebookText className="size-4 text-cyan-700" />}>
          <p>{target.notes}</p>
        </DetailBlock>

        <DetailBlock title="Coach contact" icon={<UserRound className="size-4 text-cyan-700" />}>
          <p>{target.contactName}</p>
          <p className="mt-1 text-slate-500">{target.contactRole}</p>
          <p className="mt-2 flex items-center gap-2 break-all">
            <Mail className="size-4 text-slate-400" /> {target.email}
          </p>
        </DetailBlock>

        <DisclosureBlock title="Outreach history" icon={<CalendarDays className="size-4 text-cyan-700" />}>
          <div className="grid gap-2">
            {target.outreachHistory.map((item) => (
              <div key={`${target.id}-${item.date}`} className="rounded-md bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {item.date}
                </p>
                <p className="mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </DisclosureBlock>

        <DisclosureBlock title="Team link" icon={<ExternalLink className="size-4 text-cyan-700" />}>
          <p>{target.rosterLinkPlaceholder}</p>
          <Button disabled variant="outline" className="mt-3">
            Open link
          </Button>
        </DisclosureBlock>

        <DisclosureBlock title="Why this target is on the list">
          <p>{target.details.whyOnList}</p>
        </DisclosureBlock>

        <DisclosureBlock title="Questions to answer">
          <ul className="grid gap-2">
            {target.details.concerns.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </DisclosureBlock>
      </div>
    </section>
  );
}

function DetailBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-semibold text-slate-950">{title}</p>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function DisclosureBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <details className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
      <summary className="flex cursor-pointer items-center gap-2 font-semibold text-slate-950">
        {icon}
        {title}
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
