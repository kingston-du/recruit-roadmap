import { FileText, GraduationCap, Shield, Video } from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { playerProfile } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <AppShell title="Player Profile" eyebrow="Recruiting packet">
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
            <StatusPill tone="cyan">{playerProfile.stage}</StatusPill>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Hometown", playerProfile.hometown],
              ["Shoots", playerProfile.shoots],
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
            <h2 className="mt-3 text-lg font-semibold">Academic profile</h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">GPA</dt>
                <dd className="font-medium">{playerProfile.gpa}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">SAT</dt>
                <dd className="font-medium">{playerProfile.sat}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Target path</dt>
                <dd className="mt-1 font-medium">{playerProfile.targetLevel}</dd>
              </div>
            </dl>
          </Panel>

          <Panel>
            <Video className="size-5 text-cyan-700" />
            <h2 className="mt-3 text-lg font-semibold">Video status</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {playerProfile.videoStatus}
            </p>
            <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
              Needs three defensive retrieval clips and two power-play breakout
              clips from the Buffalo showcase.
            </div>
          </Panel>
        </div>

        <Panel>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">Recruiting packet checklist</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["One-page player profile", "Ready"],
              ["Spring highlight video", "Ready"],
              ["Full game link", "Needs update"],
              ["Academic transcript", "Due Friday"],
              ["June tournament schedule", "Confirming"],
              ["Coach reference list", "Ready"],
            ].map(([item, status]) => (
              <div
                key={item}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3"
              >
                <p className="text-sm font-medium">{item}</p>
                <StatusPill tone={status === "Ready" ? "green" : "amber"}>{status}</StatusPill>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-cyan-700" />
            <h2 className="text-lg font-semibold">Player development notes</h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              [
                "Strengths",
                "First pass under pressure, gap control through neutral ice, calm bench presence.",
              ],
              [
                "Focus areas",
                "Add pace to shoulder checks before retrievals and finish contact earlier.",
              ],
              [
                "Recruiting angle",
                "Reliable two-way defender looking for a structured academic hockey setting.",
              ],
            ].map(([label, copy]) => (
              <div key={label} className="rounded-md bg-slate-50 p-4">
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
