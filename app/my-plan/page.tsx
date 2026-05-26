import Link from "next/link";
import { AlertCircle, Target } from "lucide-react";

import {
  addDefaultPlanPathsAction,
  createPlanPathAction,
  deletePlanPathAction,
  saveMainPlanAction,
  updatePlanPathAction,
} from "@/app/my-plan/actions";
import { AppShell } from "@/components/recruit/app-shell";
import { MyPlanWorkspace } from "@/components/recruit/my-plan-workspace";
import { Panel } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { eventSelect, normalizeEvents } from "@/lib/events";
import {
  groupTargetsByConnectedPath,
  mainPlanSelect,
  normalizeMainPlan,
  normalizePlanPaths,
  planPathSelect,
} from "@/lib/my-plan";
import { createClient } from "@/lib/supabase/server";
import { normalizeTargets, targetSelect } from "@/lib/targets";

export const dynamic = "force-dynamic";

export default async function MyPlanPage() {
  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const [planResult, targetsResult, eventsResult] = await Promise.all([
    supabase
      .from("plans")
      .select(mainPlanSelect)
      .eq("user_id", user.id)
      .eq("is_main", true)
      .maybeSingle(),
    supabase
      .from("targets")
      .select(targetSelect)
      .eq("user_id", user.id)
      .order("connected_path", { ascending: true })
      .order("updated_at", { ascending: false }),
    supabase
      .from("events")
      .select(eventSelect)
      .eq("user_id", user.id)
      .order("start_date", { ascending: true }),
  ]);
  const plan = normalizeMainPlan(planResult.data);

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
  const targetGroups = groupTargetsByConnectedPath(normalizeTargets(targetsResult.data));
  const targetEvents = normalizeEvents(eventsResult.data);

  return (
    <AppShell
      title="My Plan"
      eyebrow="Family recruiting plan"
      activeHref="/my-plan"
      userEmail={user.email}
      action={
        <Button asChild className="bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Link href="/targets">
            <Target /> Work on Targets
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6">
        {planResult.error || pathError || targetsResult.error || eventsResult.error ? (
          <Panel className="border-amber-200 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 text-amber-700" />
              <p className="text-sm leading-6 text-amber-900">
                We could not load all plan details. Refresh before adding or editing anything.
              </p>
            </div>
          </Panel>
        ) : null}

        <MyPlanWorkspace
          plan={plan}
          paths={paths}
          targetGroups={targetGroups}
          targetEvents={targetEvents}
          saveMainPlanAction={saveMainPlanAction}
          createPlanPathAction={createPlanPathAction}
          updatePlanPathAction={updatePlanPathAction}
          deletePlanPathAction={deletePlanPathAction}
          addDefaultPlanPathsAction={addDefaultPlanPathsAction}
        />
      </div>
    </AppShell>
  );
}
