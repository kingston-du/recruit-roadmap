import Link from "next/link";
import { AlertCircle, Lock, Save, UserRound } from "lucide-react";

import { savePlayerProfileAction } from "@/app/my-player/actions";
import { PlayerProfileForm } from "@/components/recruit/player-profile-form";
import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import {
  getPlayerProfileCompleteness,
  normalizePlayerProfile,
  playerProfileSelect,
  type PlayerProfileCompletenessItem,
} from "@/lib/player-profile";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function itemTone(item: PlayerProfileCompletenessItem) {
  if (item.value) {
    return "green" as const;
  }

  return item.required ? ("amber" as const) : ("slate" as const);
}

function itemStatus(item: PlayerProfileCompletenessItem) {
  if (item.value) {
    return "Added";
  }

  return item.required ? "Missing" : "Optional";
}

function InfoGrid({ items }: { items: PlayerProfileCompletenessItem[] }) {
  return (
    <div className="mt-3 grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-slate-200 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-slate-950">{item.label}</p>
            <StatusPill tone={itemTone(item)}>{itemStatus(item)}</StatusPill>
          </div>
          <p
            className={
              item.value
                ? "mt-2 break-words text-sm text-slate-600"
                : "mt-2 break-words text-sm text-slate-500"
            }
          >
            {item.value ?? item.emptyText}
          </p>
        </div>
      ))}
    </div>
  );
}

export default async function MyPlayerPage() {
  const user = await requireUser("/my-player");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("player_profiles")
    .select(playerProfileSelect)
    .eq("user_id", user.id)
    .maybeSingle();
  const profile = normalizePlayerProfile(data);
  const completeness = getPlayerProfileCompleteness(profile);

  return (
    <AppShell
      title="My Player"
      eyebrow="Private profile"
      activeHref="/my-player"
      userEmail={user.email}
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="#player-profile-form">
            <Save /> {profile ? "Edit Profile" : "Create Profile"}
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        <Panel className="bg-[#071a2f] text-white">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-center">
            <div className="rounded-md border border-white/10 bg-white/5 p-5 text-center">
              <p className="text-sm font-medium text-cyan-100">Profile completeness</p>
              <p className="mt-3 text-6xl font-semibold tracking-tight">{completeness.score}%</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-cyan-200"
                  style={{ width: `${completeness.score}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-300">{completeness.status}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-cyan-100">
                {completeness.requiredCompleted} of {completeness.requiredTotal} essentials ready
              </p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
                Keep the player details, goals, references, and video links in one private place.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {completeness.completed} of {completeness.total} profile details are filled in.
              </p>
            </div>
          </div>
        </Panel>

        {error ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                We could not load the saved player profile. The form is still available below.
              </p>
            </div>
          </Panel>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Panel>
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Player Profile</h2>
            </div>
            <div className="mt-5">
              <PlayerProfileForm profile={profile} action={savePlayerProfileAction} />
            </div>
          </Panel>

          <div className="grid gap-6">
            <Panel>
              <h2 className="text-lg font-semibold">Completeness</h2>
              <div className="mt-5 grid gap-5">
                {completeness.groups.map((group) => (
                  <section key={group.title}>
                    <h3 className="text-sm font-semibold text-slate-950">{group.title}</h3>
                    <InfoGrid items={group.items} />
                  </section>
                ))}
              </div>
            </Panel>

            <Panel className="border-cyan-200 bg-cyan-50">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-cyan-800" />
                <h2 className="text-lg font-semibold">Private</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                This profile is saved for this account only.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
