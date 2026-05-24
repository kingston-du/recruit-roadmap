import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, MapPin, Target } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { targets, type Target as TargetItem } from "@/lib/mock-data";

function statusTone(status: TargetItem["status"]) {
  if (status === "Follow-up due") {
    return "amber" as const;
  }

  if (status === "Planned" || status === "Ready to contact") {
    return "cyan" as const;
  }

  return "slate" as const;
}

export default function TargetsPage() {
  const followUps = targets.filter((target) => target.status === "Follow-up due");
  const highPriority = targets.filter((target) => target.priority === "High");

  return (
    <AppShell
      title="Targets"
      eyebrow="Teams, schools, camps, coaches"
      activeHref="/targets"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> View My Plan
          </Link>
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          ["Total targets", targets.length.toString()],
          ["Need follow-up", followUps.length.toString()],
          ["High priority", highPriority.length.toString()],
        ].map(([label, value]) => (
          <Panel key={label} className="p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel>
          <div className="flex items-center gap-2">
            <Target className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">Target list</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Each target has one clear next step so the family knows what happens next.
          </p>

          <div className="mt-5 grid gap-4">
            {targets.map((target) => (
              <Link
                key={target.id}
                href={`/targets/${target.id}`}
                className="rounded-md border border-slate-200 p-4 hover:border-cyan-200 hover:bg-cyan-50/40"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <StatusPill tone="cyan">{target.kind}</StatusPill>
                      <StatusPill>{target.path}</StatusPill>
                      <StatusPill tone={statusTone(target.status)}>{target.status}</StatusPill>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{target.name}</h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="size-4" /> {target.location}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{target.nextStep}</p>
                  </div>
                  <ArrowRight className="hidden size-5 text-slate-400 md:block" />
                </div>
              </Link>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6">
          <Panel className="border-cyan-200 bg-cyan-50">
            <h2 className="text-lg font-semibold">Good target notes answer three things</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              <p>Why is this target on the list?</p>
              <p>What does the family need to ask?</p>
              <p>What is the next step?</p>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Soonest dates</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {targets.slice(0, 4).map((target) => (
                <div key={target.id} className="rounded-md bg-slate-50 p-3">
                  <p className="text-sm font-medium">{target.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{target.nextDate}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
