import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Circle, Map, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { myPlan, playerProfile } from "@/lib/mock-data";

export default function MyPlanPage() {
  return (
    <AppShell
      title="My Plan"
      eyebrow="Recruiting plan"
      activeHref="/my-plan"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/roadmap">
            <Map /> Open Roadmap
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div>
              <p className="text-sm font-medium text-cyan-100">Main goal</p>
              <h2 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight">
                {myPlan.mainGoal}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                This plan keeps the family focused on options, paths, targets, and next
                steps without treating any outcome as certain.
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100">
                Demo player
              </p>
              <h3 className="mt-2 text-xl font-semibold">{playerProfile.name}</h3>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <p>{myPlan.playerSnapshot.birthYear} birth year</p>
                <p>{myPlan.playerSnapshot.position}</p>
                <p>{myPlan.playerSnapshot.currentTeam}</p>
              </div>
            </div>
          </div>
        </Panel>

        <section className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Selected paths</h2>
            <p className="mt-1 text-sm text-slate-500">
              Three paths the family is actively comparing for the next step.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {myPlan.selectedPaths.map((path) => (
              <Panel key={path.name} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{path.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{path.summary}</p>
                  </div>
                  <StatusPill tone="cyan">Path</StatusPill>
                </div>

                <div className="mt-5 rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-semibold">Why this path is being considered</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {path.whyConsidering}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold">Connected targets</p>
                  <div className="mt-2 grid gap-2">
                    {path.connectedTargets.map((target) => (
                      <div
                        key={`${path.name}-${target.name}`}
                        className="rounded-md border border-slate-200 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{target.name}</p>
                            <p className="mt-1 text-xs text-slate-500">{target.kind}</p>
                          </div>
                          <StatusPill>{target.status}</StatusPill>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div>
                    <p className="text-sm font-semibold">Next 3 steps</p>
                    <div className="mt-2 grid gap-2">
                      {path.nextSteps.map((step) => (
                        <div key={step} className="flex gap-2 rounded-md bg-cyan-50 p-3">
                          <CheckCircle2 className="mt-0.5 size-4 text-cyan-800" />
                          <p className="text-sm leading-6 text-slate-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Open questions</p>
                    <div className="mt-2 grid gap-2">
                      {path.openQuestions.map((question) => (
                        <div key={question} className="flex gap-2 rounded-md bg-slate-50 p-3">
                          <Circle className="mt-1 size-3 text-slate-400" />
                          <p className="text-sm leading-6 text-slate-600">{question}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.65fr]">
          <Panel>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Next season options</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Mock targets grouped by the type of option the family is weighing.
            </p>

            <div className="mt-5 grid gap-5">
              {myPlan.nextSeasonOptions.map((group) => (
                <section key={group.title} className="rounded-md border border-slate-200 p-4">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <h3 className="font-semibold">{group.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{group.note}</p>
                    </div>
                    <StatusPill tone="cyan">{group.options.length} options</StatusPill>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    {group.options.map((option) => (
                      <div key={option.name} className="rounded-md bg-slate-50 p-3">
                        <p className="text-sm font-semibold">{option.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{option.level}</p>
                        <div className="mt-3">
                          <StatusPill>{option.status}</StatusPill>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {option.nextStep}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-200 bg-cyan-50">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-cyan-800" />
              <h2 className="text-lg font-semibold">30-Day Plan</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A short checklist to turn the plan into next steps.
            </p>

            <div className="mt-5 grid gap-3">
              {myPlan.thirtyDayPlan.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-cyan-100 bg-white p-3"
                >
                  <div className="flex items-start gap-3">
                    {item.done ? (
                      <CheckCircle2 className="mt-0.5 size-5 text-cyan-800" />
                    ) : (
                      <Circle className="mt-1 size-4 text-slate-400" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
