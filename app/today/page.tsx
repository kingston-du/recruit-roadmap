import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Circle, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { todayPlan } from "@/lib/mock-data";

export default function TodayPage() {
  return (
    <AppShell
      title="Today"
      eyebrow="This week"
      activeHref="/today"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/targets">
            <Target /> Start First Action
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-cyan-100">Home base</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">
              {todayPlan.heading}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              {todayPlan.subheading}
            </p>
          </div>
        </Panel>

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Do these first</h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep this week focused on the few steps that matter most.
              </p>
            </div>
            <StatusPill tone="cyan">3 actions</StatusPill>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {todayPlan.actions.map((action) => (
              <Panel key={action.title} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{action.title}</h3>
                  <StatusPill tone="amber">{action.urgency}</StatusPill>
                </div>

                <div className="mt-4 grid gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Why
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {action.whyItMatters}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Path or target
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {action.relatedTo}
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className="mt-5 w-fit bg-[#071a2f] text-white hover:bg-[#0b2745]"
                >
                  <Link href={action.href}>
                    {action.buttonLabel} <ArrowRight />
                  </Link>
                </Button>
              </Panel>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Panel>
            <div className="flex items-center gap-2">
              <AlertCircle className="size-5 text-amber-600" />
              <h2 className="text-lg font-semibold">Needs attention</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              These are the gaps most likely to slow down next steps.
            </p>

            <div className="mt-5 grid gap-3">
              {todayPlan.needsAttention.map((item) => (
                <div key={item.title} className="rounded-md border border-slate-200 p-4">
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-200 bg-cyan-50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-cyan-800" />
              <h2 className="text-lg font-semibold">Progress summary</h2>
            </div>
            <p className="mt-1 text-sm text-slate-700">
              A quick snapshot of what is already moving.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {todayPlan.progressSummary.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-md bg-white p-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 size-5 text-cyan-800" />
                  ) : (
                    <Circle className="mt-1 size-4 text-slate-400" />
                  )}
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
