import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  ExternalLink,
  MapPin,
  Target,
} from "lucide-react";

import { AppShell } from "@/components/recruit/app-shell";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import {
  compareRecruitEvents,
  eventSelect,
  eventTypeLabels,
  formatDateLabel,
  formatEventDateRange,
  normalizeEvents,
  type RecruitEvent,
} from "@/lib/events";
import { todayPlan } from "@/lib/mock-data";
import {
  compareFollowUpLogs,
  normalizeOutreachLogs,
  outreachDirectionLabels,
  outreachLogSelect,
  outreachTypeLabels,
  type OutreachLog,
} from "@/lib/outreach";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await requireUser("/today");
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [eventsResult, targetsResult, outreachLogsResult] = await Promise.all([
    supabase
      .from("events")
      .select(eventSelect)
      .eq("user_id", user.id)
      .order("start_date", { ascending: true }),
    supabase.from("targets").select("id, name").eq("user_id", user.id),
    supabase
      .from("outreach_logs")
      .select(outreachLogSelect)
      .eq("user_id", user.id)
      .order("next_follow_up_date", { ascending: true }),
  ]);
  const upcomingEvents = normalizeEvents(eventsResult.data)
    .filter((event) => event.status !== "Canceled")
    .filter(
      (event) =>
        event.start_date >= today ||
        Boolean(event.registration_deadline && event.registration_deadline >= today),
    )
    .sort(compareRecruitEvents)
    .slice(0, 6);
  const followUps = normalizeOutreachLogs(outreachLogsResult.data)
    .filter((outreachLog) => Boolean(outreachLog.next_follow_up_date))
    .sort(compareFollowUpLogs)
    .slice(0, 6);
  const targetNameById = new Map(
    (targetsResult.data ?? [])
      .map((target) => {
        const id = typeof target.id === "string" ? target.id : "";
        const name = typeof target.name === "string" ? target.name : "";
        return id && name ? ([id, name] as const) : null;
      })
      .filter((target): target is readonly [string, string] => Boolean(target)),
  );

  return (
    <AppShell
      title="Today"
      eyebrow="This week"
      activeHref="/today"
      userEmail={user.email}
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

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Follow-ups</h2>
              <p className="mt-1 text-sm text-slate-500">
                Outreach next steps with saved follow-up dates.
              </p>
            </div>
            <StatusPill tone="cyan">{followUps.length} queued</StatusPill>
          </div>

          {outreachLogsResult.error || targetsResult.error ? (
            <Panel className="border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  We could not load outreach follow-ups. Try refreshing before making changes.
                </p>
              </div>
            </Panel>
          ) : null}

          {followUps.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {followUps.map((outreachLog) => (
                <FollowUpCard
                  key={outreachLog.id}
                  outreachLog={outreachLog}
                  targetName={targetNameById.get(outreachLog.target_id)}
                  today={today}
                />
              ))}
            </div>
          ) : (
            <Panel className="border-dashed">
              <p className="font-semibold text-slate-950">No outreach follow-ups saved yet.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Log outreach from a target and add a next follow-up date when a coach response or next step matters.
              </p>
              <Button asChild variant="outline" className="mt-4 w-fit rounded-md">
                <Link href="/targets">Open Targets</Link>
              </Button>
            </Panel>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Upcoming dates</h2>
              <p className="mt-1 text-sm text-slate-500">
                Camps, tryouts, deadlines, calls, and visits coming up.
              </p>
            </div>
            <StatusPill tone="cyan">{upcomingEvents.length} saved</StatusPill>
          </div>

          {eventsResult.error || targetsResult.error ? (
            <Panel className="border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 size-5 text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  We could not load upcoming dates. Try refreshing before making changes.
                </p>
              </div>
            </Panel>
          ) : null}

          {upcomingEvents.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {upcomingEvents.map((event) => (
                <UpcomingEventCard
                  key={event.id}
                  event={event}
                  targetName={event.target_id ? targetNameById.get(event.target_id) : undefined}
                />
              ))}
            </div>
          ) : (
            <Panel className="border-dashed">
              <p className="font-semibold text-slate-950">No upcoming dates saved yet.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add camps, deadlines, tryouts, calls, or visits from Targets when a date matters.
              </p>
              <Button asChild variant="outline" className="mt-4 w-fit rounded-md">
                <Link href="/targets">Open Targets</Link>
              </Button>
            </Panel>
          )}
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

function FollowUpCard({
  outreachLog,
  targetName,
  today,
}: {
  outreachLog: OutreachLog;
  targetName: string | undefined;
  today: string;
}) {
  const followUpDate = outreachLog.next_follow_up_date ?? "";
  const isDue = followUpDate <= today;

  return (
    <Panel className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusPill tone="cyan">{outreachTypeLabels[outreachLog.outreach_type]}</StatusPill>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">
            {targetName ?? "Target"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {outreachDirectionLabels[outreachLog.direction]} {formatDateLabel(outreachLog.outreach_date)}
          </p>
        </div>
        <StatusPill tone={isDue ? "amber" : "slate"}>{isDue ? "Due" : "Next"}</StatusPill>
      </div>

      <div className="mt-4 grid flex-1 gap-2 text-sm leading-6 text-slate-600">
        <p className="flex items-start gap-2 font-medium text-slate-800">
          <CalendarDays className="mt-1 size-4 shrink-0 text-cyan-700" />
          Follow up {formatDateLabel(followUpDate)}
        </p>
        <p className="whitespace-pre-wrap break-words text-slate-700">{outreachLog.summary}</p>
        {outreachLog.outcome ? (
          <p className="whitespace-pre-wrap break-words">
            <span className="font-medium text-slate-700">Outcome:</span> {outreachLog.outcome}
          </p>
        ) : null}
      </div>

      <Button asChild className="mt-5 w-fit bg-[#071a2f] text-white hover:bg-[#0b2745]">
        <Link href="/targets">
          Open Targets <ArrowRight />
        </Link>
      </Button>
    </Panel>
  );
}

function UpcomingEventCard({
  event,
  targetName,
}: {
  event: RecruitEvent;
  targetName: string | undefined;
}) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusPill tone="cyan">{eventTypeLabels[event.event_type]}</StatusPill>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{targetName ? `Target: ${targetName}` : "No target"}</p>
        </div>
        <StatusPill tone={event.status === "Completed" ? "green" : "slate"}>{event.status}</StatusPill>
      </div>

      <div className="mt-4 grid flex-1 gap-2 text-sm leading-6 text-slate-600">
        <p className="flex items-start gap-2 font-medium text-slate-800">
          <CalendarDays className="mt-1 size-4 shrink-0 text-cyan-700" />
          {formatEventDateRange(event)}
        </p>
        {event.registration_deadline ? (
          <p>Register by {formatDateLabel(event.registration_deadline)}</p>
        ) : null}
        {event.location ? (
          <p className="flex items-start gap-2">
            <MapPin className="mt-1 size-4 shrink-0 text-slate-400" />
            {event.location}
          </p>
        ) : null}
        {event.notes ? <p className="whitespace-pre-wrap break-words text-slate-700">{event.notes}</p> : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild className="w-fit bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/targets">
            Open Targets <ArrowRight />
          </Link>
        </Button>
        {event.url ? (
          <Button asChild variant="outline" className="w-fit rounded-md">
            <a href={event.url} target="_blank" rel="noreferrer">
              Event link <ExternalLink />
            </a>
          </Button>
        ) : null}
      </div>
    </Panel>
  );
}
