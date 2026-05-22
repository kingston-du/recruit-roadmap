import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, MapPin, NotebookText, UserRound } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { targetPrograms } from "@/lib/mock-data";

export function generateStaticParams() {
  return targetPrograms.map((target) => ({ id: target.id }));
}

export default async function ProgramDetailPage(props: PageProps<"/targets/[id]">) {
  const { id } = await props.params;
  const target = targetPrograms.find((item) => item.id === id) ?? targetPrograms[0];

  return (
    <AppShell
      title={target.program.name}
      eyebrow="Program detail"
      action={
        <Button asChild variant="outline">
          <Link href="/targets">
            <ArrowLeft /> Back to board
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <Panel>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="cyan">{target.program.level}</StatusPill>
                  <StatusPill>{target.fit} fit</StatusPill>
                  <StatusPill tone={target.status === "Follow-up due" ? "amber" : "slate"}>
                    {target.status}
                  </StatusPill>
                </div>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                  {target.program.name}
                </h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="size-4" /> {target.program.location} - {target.program.league}
                </p>
              </div>
              <div className="rounded-md bg-cyan-50 px-4 py-3 text-right">
                <p className="text-xs text-slate-500">Priority score</p>
                <p className="text-3xl font-semibold text-cyan-800">{target.priority}</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-md border border-slate-200 p-4">
                <UserRound className="size-5 text-cyan-700" />
                <p className="mt-3 text-sm font-medium">Primary contact</p>
                <p className="mt-1 text-sm text-slate-500">{target.program.coach}</p>
              </div>
              <div className="rounded-md border border-slate-200 p-4">
                <Mail className="size-5 text-cyan-700" />
                <p className="mt-3 text-sm font-medium">Email</p>
                <p className="mt-1 break-all text-sm text-slate-500">{target.program.email}</p>
              </div>
              <div className="rounded-md border border-slate-200 p-4">
                <CalendarDays className="size-5 text-cyan-700" />
                <p className="mt-3 text-sm font-medium">Next date</p>
                <p className="mt-1 text-sm text-slate-500">{target.program.nextEvent}</p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold">Program notes</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {[
                ["Playing style", target.program.style],
                ["Roster need", target.program.rosterNeed],
                ["Academic fit", target.program.academicFit],
                ["Family notes", target.notes],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-slate-50 p-4">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-6">
          <Panel className="border-cyan-200 bg-cyan-50">
            <NotebookText className="size-5 text-cyan-800" />
            <h2 className="mt-3 text-lg font-semibold">Next best action</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{target.nextStep}</p>
            <Button className="mt-5 bg-[#071a2f] text-white hover:bg-[#0b2745]">
              Mark as planned
            </Button>
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold">Outreach snapshot</h2>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Last touch
                </p>
                <p className="mt-2 text-sm text-slate-700">{target.lastTouch}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  Suggested packet
                </p>
                <ul className="mt-2 grid gap-2 text-sm text-slate-700">
                  <li>Player one-page profile</li>
                  <li>Spring highlight link</li>
                  <li>June tournament schedule</li>
                  <li>Transcript snapshot</li>
                </ul>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
