import Link from "next/link";
import { ArrowRight, Filter, Plus } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { targetPrograms, type TargetProgram } from "@/lib/mock-data";

const columns: Array<{ title: TargetProgram["status"]; description: string }> = [
  { title: "Researching", description: "Need basic fit and contact context." },
  { title: "Ready for outreach", description: "Profile can be sent this week." },
  { title: "Contacted", description: "Conversation started; keep notes current." },
  { title: "Follow-up due", description: "Action needed before momentum fades." },
];

export default function TargetsPage() {
  return (
    <AppShell
      title="Target Board"
      eyebrow="Programs"
      action={
        <Button className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Plus /> Add target
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[
          ["Total targets", "5"],
          ["Match fits", "2"],
          ["Follow-ups due", "1"],
          ["Camp deadlines", "2"],
        ].map(([label, value]) => (
          <Panel key={label} className="p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </Panel>
        ))}
      </div>

      <div className="mb-4 flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row md:items-center">
        <div>
          <p className="font-medium">Board view</p>
          <p className="mt-1 text-sm text-slate-500">
            Mock recruiting pipeline grouped by the next manual action.
          </p>
        </div>
        <Button variant="outline">
          <Filter /> Filters
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const targets = targetPrograms.filter((target) => target.status === column.title);

          return (
            <section key={column.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="px-1 py-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold">{column.title}</h2>
                  <span className="text-xs text-slate-500">{targets.length}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{column.description}</p>
              </div>
              <div className="mt-2 grid gap-3">
                {targets.map((target) => (
                  <Link
                    key={target.id}
                    href={`/targets/${target.id}`}
                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-cyan-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-tight">{target.program.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {target.program.level} - {target.program.location}
                        </p>
                      </div>
                      <ArrowRight className="size-4 text-slate-400" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusPill tone={target.fit === "Reach" ? "amber" : "cyan"}>
                        {target.fit}
                      </StatusPill>
                      <StatusPill>{target.program.league}</StatusPill>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Priority</span>
                        <span>{target.priority}%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-1.5 rounded-full bg-cyan-700"
                          style={{ width: `${target.priority}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{target.nextStep}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
