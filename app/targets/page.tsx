import Link from "next/link";
import { AlertCircle, ClipboardList } from "lucide-react";

import {
  createContactAction,
  createEventAction,
  createTargetAction,
  deleteContactAction,
  deleteEventAction,
  deleteTargetAction,
  updateContactAction,
  updateEventAction,
  updateTargetAction,
} from "@/app/targets/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { TargetsBoard } from "@/components/recruit/targets-board";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { contactSelect, freeContactLimit, normalizeContacts } from "@/lib/contacts";
import { eventSelect, freeEventLimit, normalizeEvents } from "@/lib/events";
import {
  freeTargetLimit,
  hasProTargets,
  normalizeSubscription,
  normalizeTargets,
  targetSelect,
} from "@/lib/targets";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TargetsPage() {
  const user = await requireUser("/targets");
  const supabase = await createClient();
  const [targetsResult, contactsResult, eventsResult, subscriptionResult] = await Promise.all([
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
      .from("subscriptions")
      .select("plan_name, status")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);
  const userTargets = normalizeTargets(targetsResult.data);
  const userContacts = normalizeContacts(contactsResult.data);
  const userEvents = normalizeEvents(eventsResult.data);
  const subscription = normalizeSubscription(subscriptionResult.data);
  const isPro = hasProTargets(subscription);

  return (
    <AppShell
      title="Targets"
      eyebrow="Execution board"
      activeHref="/targets"
      userEmail={user.email}
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/my-plan">
            <ClipboardList /> Review Plan
          </Link>
        </Button>
      }
    >
      <div className="grid gap-5">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Move targets forward</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pick one target, review the notes, and complete the next step. Keep the
            board simple so follow-ups do not get lost.
          </p>
        </div>

        {targetsResult.error || contactsResult.error || eventsResult.error || subscriptionResult.error ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                We could not load all target data. Try refreshing before making changes.
              </p>
            </div>
          </Panel>
        ) : null}

        <TargetsBoard
          targets={userTargets}
          contacts={userContacts}
          events={userEvents}
          isPro={isPro}
          freeTargetLimit={freeTargetLimit}
          freeContactLimit={freeContactLimit}
          freeEventLimit={freeEventLimit}
          createAction={createTargetAction}
          updateAction={updateTargetAction}
          deleteAction={deleteTargetAction}
          createContactAction={createContactAction}
          updateContactAction={updateContactAction}
          deleteContactAction={deleteContactAction}
          createEventAction={createEventAction}
          updateEventAction={updateEventAction}
          deleteEventAction={deleteEventAction}
        />
      </div>
    </AppShell>
  );
}
