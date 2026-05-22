import { CalendarDays, CheckCircle2, Clock3, Mail, Target } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import {
  mockEvents,
  mockTasks,
  outreachLog,
  playerProfile,
  roadmapStages,
  targetPrograms,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const activeStageIndex = roadmapStages.indexOf(playerProfile.stage);

  return (
    <AppShell
      title="This Week's Recruiting Plan"
      eyebrow="Dashboard"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/targets">Open board</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <div className="grid gap-6">
          <Panel className="bg-[#071a2f] text-white">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-medium text-cyan-100">
                  May 18-24 recruiting block
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  Move 3 priority programs forward.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Focus the week on Northwood follow-up, Jr. Bruins camp
                  registration, and getting the spring transcript into the
                  player packet.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">6</p>
                  <p className="mt-1 text-xs text-slate-300">Tasks</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">3</p>
                  <p className="mt-1 text-xs text-slate-300">Touches</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">2</p>
                  <p className="mt-1 text-xs text-slate-300">Deadlines</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Priority task list</h2>
                <p className="mt-1 text-sm text-slate-500">
                  The small list the family should actually work from this week.
                </p>
              </div>
              <StatusPill tone="cyan">Manual tracker</StatusPill>
            </div>
            <div className="mt-5 grid gap-3">
              {mockTasks.map((task) => (
                <div
                  key={task.title}
                  className="grid gap-3 rounded-md border border-slate-200 p-4 md:grid-cols-[1fr_auto]"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{task.program}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <StatusPill>{task.type}</StatusPill>
                    <span className="text-sm font-medium text-slate-700">{task.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid gap-6">
          <Panel>
            <h2 className="text-lg font-semibold">Roadmap stage</h2>
            <div className="mt-5 grid gap-3">
              {roadmapStages.map((stage, index) => (
                <div key={stage} className="flex items-center gap-3">
                  <div
                    className={
                      index <= activeStageIndex
                        ? "flex size-7 items-center justify-center rounded-full bg-cyan-700 text-white"
                        : "flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                    }
                  >
                    {index + 1}
                  </div>
                  <p
                    className={
                      index === activeStageIndex
                        ? "text-sm font-semibold text-slate-950"
                        : "text-sm text-slate-600"
                    }
                  >
                    {stage}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Top target programs</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {targetPrograms.slice(0, 4).map((target) => (
                <Link
                  key={target.id}
                  href={`/targets/${target.id}`}
                  className="rounded-md border border-slate-200 p-3 hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{target.program.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {target.program.level} - {target.fit}
                      </p>
                    </div>
                    <StatusPill tone={target.status === "Follow-up due" ? "amber" : "slate"}>
                      {target.status}
                    </StatusPill>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Upcoming</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {mockEvents.slice(0, 3).map((event) => (
                <div key={event.title} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.date} - {event.location}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Recent outreach</h2>
            </div>
            <div className="mt-4 grid gap-4">
              {outreachLog.map((log) => (
                <div key={`${log.date}-${log.program}`} className="flex gap-3">
                  <Clock3 className="mt-0.5 size-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium">{log.program}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {log.date}: {log.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
