import Link from "next/link";
import { FileText, GraduationCap, Shield, Video } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { playerProfile, readinessItems, type ReadinessItem } from "@/lib/mock-data";

function readinessTone(status: ReadinessItem["status"]) {
  if (status === "Ready") {
    return "green" as const;
  }

  if (status === "Needs update") {
    return "amber" as const;
  }

  return "slate" as const;
}

export default function MyPlayerPage() {
  const readyCount = readinessItems.filter((item) => item.status === "Ready").length;

  return (
    <AppShell
      title="My Player"
      eyebrow="Player profile"
      activeHref="/my-player"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <FileText /> View My Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="bg-[#071a2f] text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-100">{playerProfile.currentTeam}</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                {playerProfile.name}
              </h2>
              <p className="mt-3 text-slate-300">
                {playerProfile.position} - Class of {playerProfile.gradYear}
              </p>
            </div>
            <StatusPill tone="cyan">{readyCount} ready</StatusPill>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Hometown", playerProfile.hometown],
              ["School", playerProfile.currentSchool],
              ["Height", playerProfile.height],
              ["Weight", playerProfile.weight],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-300">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel>
            <GraduationCap className="size-5 text-cyan-700" />
            <h2 className="mt-3 text-lg font-semibold">Academics</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">GPA</dt>
                <dd className="font-medium">{playerProfile.gpa}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Testing</dt>
                <dd className="font-medium">{playerProfile.testStatus}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Family target summary</dt>
                <dd className="mt-1 font-medium">{playerProfile.targetSummary}</dd>
              </div>
            </dl>
          </Panel>

          <Panel>
            <Video className="size-5 text-cyan-700" />
            <h2 className="mt-3 text-lg font-semibold">Video</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
              <p>{playerProfile.videoStatus}</p>
              <p>{playerProfile.fullGameStatus}</p>
            </div>
          </Panel>
        </div>

        <Panel>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">Profile readiness</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {readinessItems.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{item.label}</p>
                  <StatusPill tone={readinessTone(item.status)}>{item.status}</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">References</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {playerProfile.references.map((reference) => (
              <div key={reference} className="rounded-md bg-slate-50 p-4">
                <p className="text-sm font-medium">{reference}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Saved for outreach when a target asks for more context.
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
