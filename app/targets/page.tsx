import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, ClipboardList } from "lucide-react";

import {
  createContactAction,
  createEventAction,
  createOutreachLogAction,
  createTargetAction,
  deleteContactAction,
  deleteEventAction,
  deleteOutreachLogAction,
  deleteTargetAction,
  updateContactAction,
  updateEventAction,
  updateOutreachLogAction,
  updateTargetAction,
} from "@/app/targets/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { TargetsBoard } from "@/components/recruit/targets-board";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { contactSelect, freeContactLimit, normalizeContacts } from "@/lib/contacts";
import { eventSelect, freeEventLimit, normalizeEvents } from "@/lib/events";
import { freeOutreachLogLimit, normalizeOutreachLogs, outreachLogSelect } from "@/lib/outreach";
import {
  freeTargetLimit,
  hasProTargets,
  normalizeSubscription,
  normalizeTargets,
  targetSelect,
} from "@/lib/targets";
import { createClient } from "@/lib/supabase/server";
import { createNoIndexMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Targets",
  description: "Private Hockey Pathway targets, coach contacts, dates, and outreach workspace.",
  path: "/targets",
});

export default async function TargetsPage() {
  const user = await requireUser("/targets");
  const supabase = await createClient();
  const [targetsResult, contactsResult, eventsResult, outreachLogsResult, subscriptionResult] = await Promise.all([
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
      .from("outreach_logs")
      .select(outreachLogSelect)
      .eq("user_id", user.id)
      .order("outreach_date", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("plan_name, status")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  const userTargets = normalizeTargets(targetsResult.data);
  const userContacts = normalizeContacts(contactsResult.data);
  const userEvents = normalizeEvents(eventsResult.data);
  const userOutreachLogs = normalizeOutreachLogs(outreachLogsResult.data);
  const subscription = normalizeSubscription(subscriptionResult.data);
  const isPro = hasProTargets(subscription);

  return (
    <AppShell
      title="Targets"
      eyebrow="Targets, contacts, and dates"
      activeHref="/targets"
      userEmail={user.email}
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> Review My Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Keep each target clear</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Track the teams, schools, camps, leagues, coach contacts, dates, and next
            steps your family is already researching.
          </p>
        </div>

        {targetsResult.error ||
        contactsResult.error ||
        eventsResult.error ||
        outreachLogsResult.error ||
        subscriptionResult.error ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                We could not load all target details. Refresh before adding or editing anything.
              </p>
            </div>
          </Panel>
        ) : null}

        <TargetsBoard
          targets={userTargets}
          contacts={userContacts}
          events={userEvents}
          outreachLogs={userOutreachLogs}
          isPro={isPro}
          freeTargetLimit={freeTargetLimit}
          freeContactLimit={freeContactLimit}
          freeEventLimit={freeEventLimit}
          freeOutreachLogLimit={freeOutreachLogLimit}
          createAction={createTargetAction}
          updateAction={updateTargetAction}
          deleteAction={deleteTargetAction}
          createContactAction={createContactAction}
          updateContactAction={updateContactAction}
          deleteContactAction={deleteContactAction}
          createEventAction={createEventAction}
          updateEventAction={updateEventAction}
          deleteEventAction={deleteEventAction}
          createOutreachLogAction={createOutreachLogAction}
          updateOutreachLogAction={updateOutreachLogAction}
          deleteOutreachLogAction={deleteOutreachLogAction}
        />
      </div>
    </AppShell>
  );
}
