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
import { contactSelect, freeContactLimit, normalizeContacts, type Contact } from "@/lib/contacts";
import {
  compareRecruitEvents,
  eventSelect,
  freeEventLimit,
  eventTypeLabels,
  formatDateLabel,
  formatEventDateRange,
  normalizeEvents,
  type RecruitEvent,
} from "@/lib/events";
import {
  getPlayerProfileCompleteness,
  normalizePlayerProfile,
  playerProfileSelect,
} from "@/lib/player-profile";
import {
  mainPlanSelect,
  normalizeMainPlan,
  normalizePlanPaths,
  planPathSelect,
} from "@/lib/my-plan";
import { createClient } from "@/lib/supabase/server";
import {
  freeTargetLimit,
  hasProTargets,
  normalizeSubscription,
  normalizeTargets,
  targetSelect,
  type Target as RecruitTarget,
} from "@/lib/targets";

export const dynamic = "force-dynamic";

type TodayAction = {
  id: string;
  title: string;
  detail: string;
  href: string;
  buttonLabel: string;
  urgency: string;
  tone: "cyan" | "green" | "amber" | "slate";
};

type LimitPrompt = {
  id: string;
  title: string;
  detail: string;
};

type ProgressItem = {
  title: string;
  detail: string;
  done: boolean;
};

function getTodayDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isWithinNextDays(value: string | null, today: string, days: number) {
  if (!value) {
    return false;
  }

  return value >= today && value <= addDays(today, days);
}

function sortTargetsByName(targets: RecruitTarget[]) {
  return [...targets].sort((first, second) => first.name.localeCompare(second.name));
}

function primaryContactByTarget(contacts: Contact[]) {
  const map = new Map<string, Contact>();
  const sortedContacts = [...contacts].sort((first, second) => first.name.localeCompare(second.name));

  sortedContacts.forEach((contact) => {
    if (!contact.target_id || map.has(contact.target_id)) {
      return;
    }

    map.set(contact.target_id, contact);
  });

  return map;
}

function buildTodayActions({
  profileIncomplete,
  targets,
  contacts,
  events,
  hasPlan,
  pathCount,
  today,
}: {
  profileIncomplete: boolean;
  targets: RecruitTarget[];
  contacts: Contact[];
  events: RecruitEvent[];
  hasPlan: boolean;
  pathCount: number;
  today: string;
}) {
  const actions: TodayAction[] = [];
  const contactByTarget = primaryContactByTarget(contacts);

  if (profileIncomplete) {
    actions.push({
      id: "player-profile",
      title: "Finish player profile.",
      detail: "Complete the required player details, goals, and video link before broader outreach.",
      href: "/my-player",
      buttonLabel: "Open My Player",
      urgency: "Setup",
      tone: "amber",
    });
  }

  if (targets.length < freeTargetLimit) {
    actions.push({
      id: "add-targets",
      title: "Add more targets.",
      detail: `${targets.length} of ${freeTargetLimit} starter targets are saved.`,
      href: "/targets",
      buttonLabel: "Open Targets",
      urgency: "This week",
      tone: "cyan",
    });
  }

  sortTargetsByName(targets)
    .filter((target) => !target.next_step)
    .forEach((target) => {
      actions.push({
        id: `target-next-step-${target.id}`,
        title: `Add next step for ${target.name}.`,
        detail: "Write one clear next action so the target does not sit idle.",
        href: "/targets",
        buttonLabel: "Open Targets",
        urgency: "Next",
        tone: "slate",
      });
    });

  sortTargetsByName(targets)
    .filter((target) => target.status === "Contacted")
    .filter((target) => Boolean(target.follow_up_date && target.follow_up_date <= today))
    .forEach((target) => {
      const contact = contactByTarget.get(target.id);
      const followUpName = contact ? `${contact.name} for ${target.name}` : target.name;

      actions.push({
        id: `target-follow-up-${target.id}`,
        title: `Follow up with ${followUpName}.`,
        detail: target.follow_up_date
          ? `Follow-up date was ${formatDateLabel(target.follow_up_date)}.`
          : "This target is ready for a follow-up.",
        href: "/targets",
        buttonLabel: "Open Targets",
        urgency: "Due",
        tone: "amber",
      });
    });

  [...events]
    .filter((event) => event.status !== "Canceled")
    .filter((event) => isWithinNextDays(event.registration_deadline, today, 14))
    .sort((first, second) => {
      const firstDeadline = first.registration_deadline ?? "";
      const secondDeadline = second.registration_deadline ?? "";
      return firstDeadline.localeCompare(secondDeadline) || first.title.localeCompare(second.title);
    })
    .forEach((event) => {
      actions.push({
        id: `event-decision-${event.id}`,
        title: `Decide on ${event.title}.`,
        detail: `Registration deadline is ${formatDateLabel(event.registration_deadline)}.`,
        href: "/targets",
        buttonLabel: "Open Dates",
        urgency: "Soon",
        tone: "amber",
      });
    });

  if (targets.length > 0 && contacts.length === 0) {
    actions.push({
      id: "add-coach-contacts",
      title: "Add coach contacts.",
      detail: "Save the coach or staff contacts connected to your current targets.",
      href: "/targets",
      buttonLabel: "Open Contacts",
      urgency: "This week",
      tone: "cyan",
    });
  }

  if (hasPlan && pathCount === 0) {
    actions.push({
      id: "add-first-path",
      title: "Add your first path.",
      detail: "Create one path in My Plan so targets connect to a bigger decision.",
      href: "/my-plan",
      buttonLabel: "Open My Plan",
      urgency: "Setup",
      tone: "cyan",
    });
  }

  return actions;
}

function buildLimitPrompts({
  isPro,
  targetCount,
  contactCount,
  eventCount,
}: {
  isPro: boolean;
  targetCount: number;
  contactCount: number;
  eventCount: number;
}) {
  if (isPro) {
    return [];
  }

  const prompts: LimitPrompt[] = [];

  if (targetCount >= freeTargetLimit) {
    prompts.push({
      id: "target-limit",
      title: "Free target limit reached",
      detail: `You are tracking ${targetCount} of ${freeTargetLimit} free targets. Pro unlocks unlimited targets.`,
    });
  }

  if (contactCount >= freeContactLimit) {
    prompts.push({
      id: "contact-limit",
      title: "Free contact limit reached",
      detail: `You are tracking ${contactCount} of ${freeContactLimit} free coach contacts. Pro unlocks unlimited contacts.`,
    });
  }

  if (eventCount >= freeEventLimit) {
    prompts.push({
      id: "event-limit",
      title: "Free event limit reached",
      detail: `You are tracking ${eventCount} of ${freeEventLimit} free events or dates. Pro unlocks unlimited events.`,
    });
  }

  return prompts;
}

function buildProgressSummary({
  profileRequiredCompleted,
  profileRequiredTotal,
  targets,
  contacts,
  events,
  planTitle,
  pathCount,
  isPro,
}: {
  profileRequiredCompleted: number;
  profileRequiredTotal: number;
  targets: RecruitTarget[];
  contacts: Contact[];
  events: RecruitEvent[];
  planTitle: string | null;
  pathCount: number;
  isPro: boolean;
}) {
  return [
    {
      title: "Player profile essentials",
      detail: `${profileRequiredCompleted} of ${profileRequiredTotal} complete`,
      done: profileRequiredCompleted === profileRequiredTotal,
    },
    {
      title: "Targets saved",
      detail: isPro
        ? `${targets.length} saved`
        : `${Math.min(targets.length, freeTargetLimit)} of ${freeTargetLimit} free targets used`,
      done: targets.length >= freeTargetLimit,
    },
    {
      title: "Coach contacts saved",
      detail: `${contacts.length} saved`,
      done: targets.length === 0 || contacts.length > 0,
    },
    {
      title: "Dates saved",
      detail: `${events.length} saved`,
      done: events.length > 0,
    },
    {
      title: "My Plan paths",
      detail: planTitle ? `${pathCount} saved for ${planTitle}` : "No plan saved",
      done: Boolean(planTitle && pathCount > 0),
    },
  ] satisfies ProgressItem[];
}

export default async function TodayPage() {
  const user = await requireUser("/today");
  const supabase = await createClient();
  const today = getTodayDateString();
  const [profileResult, targetsResult, contactsResult, eventsResult, planResult, subscriptionResult] =
    await Promise.all([
      supabase
        .from("player_profiles")
        .select(playerProfileSelect)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("targets")
        .select(targetSelect)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("contacts")
        .select(contactSelect)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("events")
        .select(eventSelect)
        .eq("user_id", user.id)
        .order("start_date", { ascending: true }),
      supabase
        .from("plans")
        .select(mainPlanSelect)
        .eq("user_id", user.id)
        .eq("is_main", true)
        .maybeSingle(),
      supabase
        .from("subscriptions")
        .select("plan_name, status")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
  const profile = normalizePlayerProfile(profileResult.data);
  const completeness = getPlayerProfileCompleteness(profile);
  const targets = normalizeTargets(targetsResult.data);
  const contacts = normalizeContacts(contactsResult.data);
  const events = normalizeEvents(eventsResult.data);
  const plan = normalizeMainPlan(planResult.data);
  const subscription = normalizeSubscription(subscriptionResult.data);
  const isPro = hasProTargets(subscription);

  let pathRows: unknown[] = [];
  let pathError: unknown = null;

  if (plan) {
    const result = await supabase
      .from("plan_paths")
      .select(planPathSelect)
      .eq("user_id", user.id)
      .eq("plan_id", plan.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    pathRows = result.data ?? [];
    pathError = result.error;
  }

  const paths = normalizePlanPaths(pathRows);
  const profileIncomplete = completeness.requiredCompleted < completeness.requiredTotal;
  const todayActions = buildTodayActions({
    profileIncomplete,
    targets,
    contacts,
    events,
    hasPlan: Boolean(plan),
    pathCount: paths.length,
    today,
  });
  const topActions = todayActions.slice(0, 3);
  const needsAttention = todayActions.slice(3);
  const limitPrompts = buildLimitPrompts({
    isPro,
    targetCount: targets.length,
    contactCount: contacts.length,
    eventCount: events.length,
  });
  const upcomingEvents = events
    .filter((event) => event.status !== "Canceled")
    .filter(
      (event) =>
        event.start_date >= today ||
        Boolean(event.registration_deadline && event.registration_deadline >= today),
    )
    .sort(compareRecruitEvents)
    .slice(0, 6);
  const progressSummary = buildProgressSummary({
    profileRequiredCompleted: completeness.requiredCompleted,
    profileRequiredTotal: completeness.requiredTotal,
    targets,
    contacts,
    events,
    planTitle: plan?.title ?? null,
    pathCount: paths.length,
    isPro,
  });
  const targetNameById = new Map(targets.map((target) => [target.id, target.name]));
  const hasLoadError = Boolean(
    profileResult.error ||
      targetsResult.error ||
      contactsResult.error ||
      eventsResult.error ||
      planResult.error ||
      subscriptionResult.error ||
      pathError,
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
        {hasLoadError ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                We could not load all Today data. Try refreshing before making changes.
              </p>
            </div>
          </Panel>
        ) : null}

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Top 3 Actions</h2>
              <p className="mt-1 text-sm text-slate-500">
                The most important saved-data gaps and deadlines for this week.
              </p>
            </div>
            <StatusPill tone="cyan">{topActions.length} ready</StatusPill>
          </div>

          {topActions.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-3">
              {topActions.map((action) => (
                <TodayActionCard key={action.id} action={action} />
              ))}
            </div>
          ) : (
            <Panel className="border-dashed">
              <p className="font-semibold text-slate-950">No required actions this week.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Your saved targets, profile essentials, contacts, plan paths, and near-term deadlines are covered.
              </p>
              <Button asChild variant="outline" className="mt-4 w-fit rounded-md">
                <Link href="/targets">Review Targets</Link>
              </Button>
            </Panel>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Needs Attention</h2>
              <p className="mt-1 text-sm text-slate-500">
                Other items to clean up after the top actions.
              </p>
            </div>
            <StatusPill tone="cyan">
              {needsAttention.length + limitPrompts.length} items
            </StatusPill>
          </div>

          {needsAttention.length > 0 || limitPrompts.length > 0 ? (
            <div className="grid gap-3">
              {needsAttention.map((action) => (
                <AttentionItem key={action.id} action={action} />
              ))}
              {limitPrompts.map((prompt) => (
                <LimitPromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <Panel className="border-dashed">
              <p className="font-semibold text-slate-950">No extra gaps right now.</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Keep checking Today as targets, contacts, dates, and plan paths change.
              </p>
            </Panel>
          )}
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Upcoming Dates</h2>
              <p className="mt-1 text-sm text-slate-500">
                Camps, tryouts, deadlines, calls, and visits coming up.
              </p>
            </div>
            <StatusPill tone="cyan">{upcomingEvents.length} saved</StatusPill>
          </div>

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

        <section className="grid gap-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Progress Summary</h2>
              <p className="mt-1 text-sm text-slate-500">
                A quick snapshot of what is already moving.
              </p>
            </div>
            <StatusPill tone="cyan">
              {progressSummary.filter((item) => item.done).length} of {progressSummary.length} ready
            </StatusPill>
          </div>

          <Panel className="border-cyan-200 bg-cyan-50">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {progressSummary.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-md bg-white p-3">
                  {item.done ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-cyan-800" />
                  ) : (
                    <Circle className="mt-1 size-4 shrink-0 text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}

function TodayActionCard({ action }: { action: TodayAction }) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">{action.title}</h3>
        <StatusPill tone={action.tone}>{action.urgency}</StatusPill>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{action.detail}</p>
      <Button asChild className="mt-5 w-fit bg-[#071a2f] text-white hover:bg-[#0b2745]">
        <Link href={action.href}>
          {action.buttonLabel} <ArrowRight />
        </Link>
      </Button>
    </Panel>
  );
}

function AttentionItem({ action }: { action: TodayAction }) {
  return (
    <Panel className="p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={action.tone}>{action.urgency}</StatusPill>
            <p className="font-semibold text-slate-950">{action.title}</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{action.detail}</p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-md">
          <Link href={action.href}>
            {action.buttonLabel} <ArrowRight />
          </Link>
        </Button>
      </div>
    </Panel>
  );
}

function LimitPromptCard({ prompt }: { prompt: LimitPrompt }) {
  return (
    <Panel className="border-amber-200 bg-amber-50 p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-amber-700" />
          <div>
            <p className="font-semibold text-amber-950">{prompt.title}</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">{prompt.detail}</p>
          </div>
        </div>
        <Button asChild className="w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/pricing">View Pro options</Link>
        </Button>
      </div>
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
