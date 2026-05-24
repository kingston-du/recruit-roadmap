import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { events, myPlan, targets, weeklyTasks, type Target as TargetItem } from "@/lib/mock-data";

function priorityTone(priority: TargetItem["priority"]) {
  if (priority === "High") {
    return "amber" as const;
  }

  if (priority === "Medium") {
    return "cyan" as const;
  }

  return "slate" as const;
}

export default function TodayPage() {
  const priorityTargets = targets.filter((target) => target.priority !== "Low").slice(0, 3);

  return (
    <AppShell
      title="Today"
      eyebrow="This week"
      activeHref="/today"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> View My Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="grid gap-6">
          <Panel className="bg-[#071a2f] text-white">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-medium text-cyan-100">Family focus</p>
                <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
                  {myPlan.weekFocus}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Keep this week small: finish the most important follow-up, update the
                  player packet, and keep upcoming dates visible.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">{weeklyTasks.length}</p>
                  <p className="mt-1 text-xs text-slate-300">Next steps</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">{priorityTargets.length}</p>
                  <p className="mt-1 text-xs text-slate-300">Priority targets</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-3">
                  <p className="text-2xl font-semibold">{events.length}</p>
                  <p className="mt-1 text-xs text-slate-300">Key dates</p>
                </div>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Next steps</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A short list the family can work from this week.
                </p>
              </div>
              <StatusPill tone="cyan">This week</StatusPill>
            </div>

            <div className="mt-5 grid gap-3">
              {weeklyTasks.map((task) => (
                <div
                  key={task.title}
                  className="grid gap-3 rounded-md border border-slate-200 p-4 md:grid-cols-[1fr_auto]"
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-800">
                      <CheckCircle2 className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-950">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{task.target}</p>
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
            <div className="flex items-center gap-2">
              <Target className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Priority targets</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {priorityTargets.map((target) => (
                <Link
                  key={target.id}
                  href={`/targets/${target.id}`}
                  className="rounded-md border border-slate-200 p-3 hover:border-cyan-200 hover:bg-cyan-50/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{target.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {target.kind} - {target.path}
                      </p>
                    </div>
                    <StatusPill tone={priorityTone(target.priority)}>{target.priority}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{target.nextStep}</p>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Upcoming dates</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {events.slice(0, 4).map((event) => (
                <div key={event.title} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {event.date} - {event.location}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-200 bg-cyan-50">
            <h2 className="text-lg font-semibold">Keep it simple</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Add fewer targets, keep better notes, and make sure every target has one clear
              next step.
            </p>
            <Button asChild variant="outline" className="mt-5 border-cyan-200 bg-white">
              <Link href="/targets">
                Review Targets <ArrowRight />
              </Link>
            </Button>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
