import Link from "next/link";
import { ArrowRight, CheckCircle2, Map, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { myPlan, targets } from "@/lib/mock-data";

export default function MyPlanPage() {
  const connectedTargets = targets.filter((target) =>
    myPlan.connectedTargetIds.includes(target.id),
  );

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
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <Panel className="bg-[#071a2f] text-white">
            <p className="text-sm font-medium text-cyan-100">Current family focus</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
              {myPlan.weekFocus}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              This plan keeps short-term tasks connected to the longer path without
              turning the process into a spreadsheet.
            </p>
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold">Selected paths</h2>
            <p className="mt-1 text-sm text-slate-500">
              The family is comparing these options first.
            </p>

            <div className="mt-5 grid gap-4">
              {myPlan.selectedPaths.map((path) => (
                <div key={path.name} className="rounded-md border border-slate-200 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="font-semibold">{path.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{path.note}</p>
                    </div>
                    <StatusPill tone="cyan">Path</StatusPill>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Next step: {path.nextStep}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <h2 className="text-lg font-semibold">Goals</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">This season</h3>
                <div className="mt-3 grid gap-3">
                  {myPlan.shortTermGoals.map((goal) => (
                    <div key={goal} className="flex gap-3 rounded-md bg-slate-50 p-3">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-700" />
                      <p className="text-sm leading-6 text-slate-700">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Longer term</h3>
                <div className="mt-3 grid gap-3">
                  {myPlan.longTermGoals.map((goal) => (
                    <div key={goal} className="flex gap-3 rounded-md bg-slate-50 p-3">
                      <CheckCircle2 className="mt-0.5 size-4 text-cyan-700" />
                      <p className="text-sm leading-6 text-slate-700">{goal}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-6">
          <Panel>
            <h2 className="text-lg font-semibold">Plan next steps</h2>
            <div className="mt-4 grid gap-3">
              {myPlan.nextSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-md border border-slate-200 p-4"
                >
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {step.owner} - {step.timing}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Connected targets</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {connectedTargets.map((target) => (
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
                    <ArrowRight className="size-4 text-slate-400" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {target.connectedGoal}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel className="border-cyan-200 bg-cyan-50">
            <h2 className="text-lg font-semibold">Use the Roadmap as a guide</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              The Roadmap is public and educational. My Plan is the family&apos;s shortlist
              of paths, targets, and next steps.
            </p>
            <Button asChild variant="outline" className="mt-5 border-cyan-200 bg-white">
              <Link href="/roadmap">
                View Roadmap <ArrowRight />
              </Link>
            </Button>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
