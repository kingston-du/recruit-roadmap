import Link from "next/link";
import {
  Eye,
  GraduationCap,
  LinkIcon,
  Shield,
  UserRound,
  Video,
} from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { playerProfileReadiness, type ProfileInfoItem } from "@/lib/mock-data";

function itemTone(item: ProfileInfoItem) {
  return item.value ? ("green" as const) : ("amber" as const);
}

function InfoGrid({ items }: { items: ProfileInfoItem[] }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-slate-200 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-slate-950">{item.label}</p>
            <StatusPill tone={itemTone(item)}>{item.value ? "Added" : "Missing"}</StatusPill>
          </div>
          <p className={item.value ? "mt-2 text-sm text-slate-600" : "mt-2 text-sm text-amber-700"}>
            {item.value ?? item.emptyText}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function MyPlayerPage() {
  return (
    <AppShell
      title="My Player"
      eyebrow="Profile readiness"
      activeHref="/my-player"
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="#videos-links">
            <Video /> Fix Missing Items
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
            <div className="rounded-md border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-sm font-medium text-cyan-100">Profile readiness</p>
              <p className="mt-3 text-6xl font-semibold tracking-tight">
                {playerProfileReadiness.score}%
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-200"
                  style={{ width: `${playerProfileReadiness.score}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-300">{playerProfileReadiness.status}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-cyan-100">Ready to send?</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
                Check the player profile before contacting more coaches.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {playerProfileReadiness.summary}
              </p>
            </div>
          </div>
        </Panel>

        <div className="grid gap-6 xl:grid-cols-2">
          <Panel>
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Basic Info</h2>
            </div>
            <InfoGrid items={playerProfileReadiness.basicInfo} />
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Hockey Info</h2>
            </div>
            <InfoGrid items={playerProfileReadiness.hockeyInfo} />
          </Panel>

          <Panel>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">School Info</h2>
            </div>
            <InfoGrid items={playerProfileReadiness.schoolInfo} />
          </Panel>

          <div id="videos-links">
            <Panel>
              <div className="flex items-center gap-2">
                <Video className="size-5 text-cyan-700" />
                <h2 className="text-lg font-semibold">Videos & Links</h2>
              </div>
              <InfoGrid items={playerProfileReadiness.videosAndLinks} />
            </Panel>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <Panel>
            <div className="flex items-center gap-2">
              <LinkIcon className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">References</h2>
            </div>
            <InfoGrid items={playerProfileReadiness.references} />
          </Panel>

          <Panel className="border-cyan-200 bg-cyan-50">
            <div className="flex items-center gap-2">
              <Eye className="size-5 text-cyan-800" />
              <h2 className="text-lg font-semibold">Shareable Profile Preview</h2>
            </div>
            <p className="mt-1 text-sm text-slate-700">Preview what a coach would see.</p>

            <div className="mt-5 rounded-md border border-cyan-100 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-800">
                Coach preview
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {playerProfileReadiness.preview.headline}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {playerProfileReadiness.preview.summary}
              </p>
              <div className="mt-4 grid gap-2">
                {playerProfileReadiness.preview.details.map((detail) => (
                  <p key={detail} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            <Button disabled className="mt-5 bg-[#071a2f] text-white disabled:opacity-60">
              Share profile
            </Button>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
