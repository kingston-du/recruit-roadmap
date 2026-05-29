"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Dialog } from "radix-ui";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Circle,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from "lucide-react";

import type {
  DefaultPathsState,
  MainPlanFormState,
  PlanPathDeleteState,
  PlanPathMutationState,
} from "@/app/my-plan/actions";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import {
  compareRecruitEvents,
  eventTypeLabels,
  formatEventCost,
  formatEventDateRange,
  type RecruitEvent,
} from "@/lib/events";
import {
  defaultPlanPathExamples,
  type ConnectedTargetGroup,
  type MainPlan,
  type MainPlanFormFieldName,
  type PlanPath,
  type PlanPathFormFieldName,
} from "@/lib/my-plan";
import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { targetTypeLabels } from "@/lib/targets";
import { cn } from "@/lib/utils";

const initialMainPlanState: MainPlanFormState = {
  message: "",
};

const initialPathState: PlanPathMutationState = {
  message: "",
};

const initialDeleteState: PlanPathDeleteState = {
  message: "",
};

const initialDefaultPathsState: DefaultPathsState = {
  message: "",
};

type MainPlanAction = (
  previousState: MainPlanFormState,
  formData: FormData,
) => Promise<MainPlanFormState>;

type PlanPathAction = (
  previousState: PlanPathMutationState,
  formData: FormData,
) => Promise<PlanPathMutationState>;

type PlanPathDeleteAction = (
  previousState: PlanPathDeleteState,
  formData: FormData,
) => Promise<PlanPathDeleteState>;

type DefaultPathsAction = (
  previousState: DefaultPathsState,
  formData: FormData,
) => Promise<DefaultPathsState>;

type DrawerMode = "create" | "edit" | null;

type FieldState<FieldName extends string> = {
  fieldErrors?: Partial<Record<FieldName, string[]>>;
};

function fieldError<FieldName extends string>(state: FieldState<FieldName>, name: FieldName) {
  return state.fieldErrors?.[name]?.[0];
}

function fieldClass(hasError: boolean) {
  return cn(
    "smooth-field min-h-10 rounded-md border bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4",
    hasError ? "border-red-300" : "border-slate-300",
  );
}

function FieldMessage({
  id,
  message,
}: {
  id: string;
  message: string | undefined;
}) {
  return message ? (
    <p id={id} className="text-sm text-red-700">
      {message}
    </p>
  ) : null;
}

function TextField<FieldName extends string>({
  name,
  label,
  defaultValue,
  required,
  placeholder,
  helperText,
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  state: FieldState<FieldName>;
}) {
  const error = fieldError(state, name);
  const reactId = useId();
  const fieldId = `${name}-${reactId}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
        {label}
        {required ? null : <span className="text-slate-400"> optional</span>}
      </label>
      <input
        id={fieldId}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass(Boolean(error))}
      />
      {helperText ? <p className="text-sm leading-5 text-slate-500">{helperText}</p> : null}
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function TextAreaField<FieldName extends string>({
  name,
  label,
  defaultValue,
  required,
  rows,
  placeholder,
  helperText,
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  rows: number;
  placeholder?: string;
  helperText?: string;
  state: FieldState<FieldName>;
}) {
  const error = fieldError(state, name);
  const reactId = useId();
  const fieldId = `${name}-${reactId}`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-700">
        {label}
        {required ? null : <span className="text-slate-400"> optional</span>}
      </label>
      <textarea
        id={fieldId}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClass(Boolean(error)), "py-3 leading-6")}
      />
      {helperText ? <p className="text-sm leading-5 text-slate-500">{helperText}</p> : null}
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

export function MyPlanWorkspace({
  plan,
  paths,
  targetGroups,
  targetEvents,
  saveMainPlanAction,
  createPlanPathAction,
  updatePlanPathAction,
  deletePlanPathAction,
  addDefaultPlanPathsAction,
}: {
  plan: MainPlan | null;
  paths: PlanPath[];
  targetGroups: ConnectedTargetGroup[];
  targetEvents: RecruitEvent[];
  saveMainPlanAction: MainPlanAction;
  createPlanPathAction: PlanPathAction;
  updatePlanPathAction: PlanPathAction;
  deletePlanPathAction: PlanPathDeleteAction;
  addDefaultPlanPathsAction: DefaultPathsAction;
}) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const selectedPath = paths.find((path) => path.id === selectedPathId) ?? null;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openDrawer(mode: NonNullable<DrawerMode>) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setDrawerMode(mode);
    setDrawerOpen(true);
  }

  function openCreateDrawer() {
    setSelectedPathId(null);
    openDrawer("create");
  }

  function openEditDrawer(path: PlanPath) {
    setSelectedPathId(path.id);
    openDrawer("edit");
  }

  function closeDrawer() {
    setDrawerOpen(false);

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setDrawerMode(null);
      closeTimerRef.current = null;
    }, 200);
  }

  return (
    <div className="grid gap-6">
      <PlanSummary
        plan={plan}
        pathCount={paths.length}
        targetGroupCount={targetGroups.length}
        eventCount={targetEvents.length}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="grid gap-6">
          <Panel>
            <div className="flex items-center gap-2">
              <Save className="size-5 text-cyan-700" />
              <h2 className="text-lg font-semibold">Family Plan</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep the big-picture goals in one private place before comparing options.
            </p>
            <div className="mt-5">
              <MainPlanForm plan={plan} action={saveMainPlanAction} />
            </div>
          </Panel>

          <section className="grid gap-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Possible Paths</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Compare routes your family is considering, such as prep, juniors, college, or backup options.
                </p>
              </div>
              <Button
                type="button"
                onClick={openCreateDrawer}
                className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
              >
                <Plus /> Add path
              </Button>
            </div>

            {paths.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-3">
                {paths.map((path) => (
                  <PathCard
                    key={path.id}
                    path={path}
                    onEdit={() => openEditDrawer(path)}
                    deleteAction={deletePlanPathAction}
                  />
                ))}
              </div>
            ) : (
              <Panel className="border-dashed">
                <p className="font-semibold text-slate-950">No possible paths saved yet.</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Add one route your family is considering, or start with the examples and adjust them for the player.
                </p>
              </Panel>
            )}
          </section>
        </div>

        <aside className="grid gap-6 xl:h-fit xl:sticky xl:top-28">
          <DefaultPathsPanel action={addDefaultPlanPathsAction} />
          <TargetGroupsPanel targetGroups={targetGroups} targetEvents={targetEvents} />
        </aside>
      </div>

      {drawerMode ? (
        <PathDrawer
          open={drawerOpen}
          title={drawerMode === "create" ? "Add path" : "Edit path"}
          onClose={closeDrawer}
        >
          {drawerMode === "create" ? (
            <PlanPathForm
              key="create-path"
              action={createPlanPathAction}
              submitLabel="Add path"
              pendingLabel="Adding..."
              onSuccess={closeDrawer}
            />
          ) : null}

          {drawerMode === "edit" && selectedPath ? (
            <PlanPathForm
              key={`edit-path-${selectedPath.id}`}
              path={selectedPath}
              action={updatePlanPathAction}
              submitLabel="Save path"
              pendingLabel="Saving..."
              onSuccess={closeDrawer}
            />
          ) : null}
        </PathDrawer>
      ) : null}
    </div>
  );
}

function PlanSummary({
  plan,
  pathCount,
  targetGroupCount,
  eventCount,
}: {
  plan: MainPlan | null;
  pathCount: number;
  targetGroupCount: number;
  eventCount: number;
}) {
  return (
    <Panel className="bg-[#071a2f] text-white">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div>
          <p className="text-sm font-medium text-cyan-100">Family recruiting plan</p>
          <h2 className="mt-2 max-w-4xl text-3xl font-semibold tracking-tight">
            {plan?.pathway_goal ?? "Organize options, possible paths, and next steps."}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            This plan helps your family compare choices without treating any outcome as certain.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100">
            Snapshot
          </p>
          <div className="mt-3 grid gap-3 text-sm text-slate-300">
            <p>{pathCount} possible paths</p>
            <p>{targetGroupCount} target groups</p>
            <p>{eventCount} linked dates</p>
            <p>{plan?.season ?? "Season not set"}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function MainPlanForm({ plan, action }: { plan: MainPlan | null; action: MainPlanAction }) {
  const planCreateTrackedRef = useRef(Boolean(plan));

  async function trackedAction(previousState: MainPlanFormState, formData: FormData) {
    const result = await action(previousState, formData);

    if (result.success && !planCreateTrackedRef.current && !plan) {
      planCreateTrackedRef.current = true;
      trackAnalyticsEvent("my_plan_created", {
        source: "my_plan_form",
      });
    }

    return result;
  }

  const [state, formAction, pending] = useActionState(trackedAction, initialMainPlanState);

  return (
    <form id="main-plan-form" action={formAction} className="grid gap-5">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<MainPlanFormFieldName>
          name="title"
          label="Plan name"
          defaultValue={plan?.title ?? "My Plan"}
          required
          state={state}
        />
        <TextField<MainPlanFormFieldName>
          name="season"
          label="Season"
          defaultValue={plan?.season}
          placeholder="2026-27"
          helperText="Use the season this plan is mostly about."
          state={state}
        />
      </div>

      <TextAreaField<MainPlanFormFieldName>
        name="pathway_goal"
        label="Family focus"
        defaultValue={plan?.pathway_goal}
        rows={3}
        placeholder="Example: Compare prep, junior, college, and development options for next season."
        helperText="One plain sentence is enough."
        state={state}
      />
      <TextAreaField<MainPlanFormFieldName>
        name="short_term_goal"
        label="Short-term goal"
        defaultValue={plan?.short_term_goal}
        rows={3}
        placeholder="Example: Pick three target options to research this month."
        helperText="What should happen in the next few weeks?"
        state={state}
      />
      <TextAreaField<MainPlanFormFieldName>
        name="long_term_goal"
        label="Long-term goal"
        defaultValue={plan?.long_term_goal}
        rows={3}
        placeholder="Example: Keep school, hockey, and development fit organized over the next two seasons."
        helperText="What bigger outcome is the family working toward?"
        state={state}
      />
      <TextAreaField<MainPlanFormFieldName>
        name="notes"
        label="Family notes"
        defaultValue={plan?.notes}
        rows={4}
        state={state}
      />

      {state.message ? (
        <p
          className={
            state.success
              ? "rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
              : "rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
      >
        <Save /> {pending ? "Saving..." : plan ? "Save plan" : "Create plan"}
      </Button>
    </form>
  );
}

function PathCard({
  path,
  onEdit,
  deleteAction,
}: {
  path: PlanPath;
  onEdit: () => void;
  deleteAction: PlanPathDeleteAction;
}) {
  return (
    <Panel className="smooth-card flex flex-col hover:border-cyan-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusPill tone="cyan">Path</StatusPill>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">{path.title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="smooth-action flex size-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
          aria-label={`Edit ${path.title}`}
          title="Edit path"
        >
          <Pencil className="size-4" />
        </button>
      </div>

      <div className="mt-5 grid flex-1 gap-4">
        <PathDetail title="Goal">{path.goal ?? "No goal added yet."}</PathDetail>
        <PathDetail title="Timeline">{path.timeline ?? "No timeline added yet."}</PathDetail>
        <PathDetail title="Why this might fit">
          {path.why_considering ?? "No notes added yet."}
        </PathDetail>

        <PathList title="Next steps" value={path.next_steps} emptyText="No next steps added yet." />
        <PathList
          title="Questions to answer"
          value={path.open_questions}
          emptyText="No open questions added yet."
        />
      </div>

      <DeletePathForm path={path} action={deleteAction} />
    </Panel>
  );
}

function PathDetail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <div className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
        {children}
      </div>
    </div>
  );
}

function splitLines(value: string | null) {
  return (
    value
      ?.split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean) ?? []
  );
}

function PathList({
  title,
  value,
  emptyText,
}: {
  title: string;
  value: string | null;
  emptyText: string;
}) {
  const items = splitLines(value);

  return (
    <div className="rounded-md bg-slate-50 p-3">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-2">
          {items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
              <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-700" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm leading-6 text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

function DeletePathForm({
  path,
  action,
}: {
  path: PlanPath;
  action: PlanPathDeleteAction;
}) {
  const [state, formAction, pending] = useActionState(action, initialDeleteState);

  return (
    <form
      action={formAction}
      className="mt-5"
      onSubmit={(event) => {
        if (!window.confirm(`Delete the path "${path.title}"?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={path.id} />
      <Button type="submit" disabled={pending} variant="destructive" className="rounded-md">
        <Trash2 /> {pending ? "Deleting..." : "Delete path"}
      </Button>
      {state.message && !state.success ? <p className="mt-2 text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}

function PathDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/35 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-3 bottom-3 z-50 flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-6",
            "md:inset-y-3 md:left-auto md:right-3 md:w-[min(672px,calc(100vw-2rem))] md:max-h-none md:data-[state=open]:slide-in-from-right-6 md:data-[state=closed]:slide-out-to-right-6",
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <Dialog.Title className="text-xl font-semibold tracking-tight text-slate-950">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close path drawer"
                className="smooth-action flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function PlanPathForm({
  path,
  action,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  path?: PlanPath;
  action: PlanPathAction;
  submitLabel: string;
  pendingLabel: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialPathState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="grid gap-5">
      {path ? <input type="hidden" name="id" value={path.id} /> : null}

      <TextField<PlanPathFormFieldName>
        name="title"
        label="Path name"
        defaultValue={path?.title}
        required
        placeholder="Junior Hockey Path"
        helperText="Name the route your family wants to compare."
        state={state}
      />
      <TextAreaField<PlanPathFormFieldName>
        name="goal"
        label="What this path is for"
        defaultValue={path?.goal}
        required
        rows={3}
        placeholder="Describe what this path helps the family compare."
        helperText="This can be a simple sentence."
        state={state}
      />
      <TextField<PlanPathFormFieldName>
        name="timeline"
        label="Timeline"
        defaultValue={path?.timeline}
        placeholder="This season, next offseason, longer-term"
        helperText="When would this path matter?"
        state={state}
      />
      <TextAreaField<PlanPathFormFieldName>
        name="why_considering"
        label="Why this might fit"
        defaultValue={path?.why_considering}
        rows={4}
        placeholder="Example: More development time, school fit, location, cost, or competition level."
        state={state}
      />
      <TextAreaField<PlanPathFormFieldName>
        name="next_steps"
        label="Next steps"
        defaultValue={path?.next_steps}
        rows={5}
        placeholder="One next step per line"
        helperText="Add small actions like research a team, check cost, or save a contact."
        state={state}
      />
      <TextAreaField<PlanPathFormFieldName>
        name="open_questions"
        label="Questions to answer"
        defaultValue={path?.open_questions}
        rows={5}
        placeholder="One question per line"
        state={state}
      />

      {state.message ? (
        <p
          className={
            state.success
              ? "rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
              : "rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
      >
        <Save /> {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}

function DefaultPathsPanel({ action }: { action: DefaultPathsAction }) {
  const [state, formAction, pending] = useActionState(action, initialDefaultPathsState);

  return (
    <Panel className="border-cyan-200 bg-cyan-50">
      <div className="flex items-start gap-3">
        <Circle className="mt-1 size-4 text-cyan-800" />
        <div>
          <h2 className="text-lg font-semibold">Starter Path Examples</h2>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            Add common planning paths, then edit them so they match your player.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {defaultPlanPathExamples.map((example) => (
          <div key={example.title} className="rounded-md bg-white p-3">
            <p className="text-sm font-semibold text-slate-950">{example.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{example.timeline}</p>
          </div>
        ))}
      </div>

      {state.message ? (
        <p
          className={
            state.success
              ? "mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
              : "mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
          }
        >
          {state.message}
        </p>
      ) : null}

      <form action={formAction} className="mt-4">
        <Button
          type="submit"
          disabled={pending}
          variant="outline"
          className="h-10 rounded-md border-cyan-200 bg-white"
        >
          <Plus /> {pending ? "Adding..." : "Add starter examples"}
        </Button>
      </form>
    </Panel>
  );
}

function TargetGroupsPanel({
  targetGroups,
  targetEvents,
}: {
  targetGroups: ConnectedTargetGroup[];
  targetEvents: RecruitEvent[];
}) {
  const eventsByTargetId = useMemo(() => {
    const groupedEvents = new Map<string, RecruitEvent[]>();

    targetEvents.forEach((event) => {
      if (!event.target_id) {
        return;
      }

      groupedEvents.set(event.target_id, [
        ...(groupedEvents.get(event.target_id) ?? []),
        event,
      ]);
    });

    groupedEvents.forEach((events, targetId) => {
      groupedEvents.set(targetId, [...events].sort(compareRecruitEvents));
    });

    return groupedEvents;
  }, [targetEvents]);

  return (
    <Panel>
      <div className="flex items-center gap-2">
        <Target className="size-5 text-cyan-700" />
        <h2 className="text-lg font-semibold">Targets by Path</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Targets appear here when their connected path matches a path in your plan.
      </p>

      <div className="mt-5 grid gap-3">
        {targetGroups.length > 0 ? (
          targetGroups.map((group) => (
            <details
              key={group.connectedPath}
              className="rounded-md border border-slate-200 p-3 transition-[border-color,box-shadow] duration-200 ease-out hover:border-cyan-200 hover:shadow-sm"
              open={group.connectedPath !== "No connected path"}
            >
              <summary className="cursor-pointer rounded-sm outline-none transition-colors duration-200 ease-out hover:text-cyan-800 focus-visible:ring-3 focus-visible:ring-cyan-200">
                <span className="font-semibold text-slate-950">{group.connectedPath}</span>
                <span className="ml-2 text-sm text-slate-500">{group.targets.length} options</span>
              </summary>
              <div className="mt-3 grid gap-2">
                {group.targets.map((target) => {
                  const events = eventsByTargetId.get(target.id) ?? [];

                  return (
                    <div key={target.id} className="smooth-card rounded-md bg-slate-50 p-3 hover:bg-cyan-50/40">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{target.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {targetTypeLabels[target.target_type]}
                            {target.level ? ` - ${target.level}` : ""}
                          </p>
                        </div>
                        <StatusPill>{target.status}</StatusPill>
                      </div>
                      {target.next_step ? (
                        <p className="mt-3 text-sm leading-6 text-slate-600">{target.next_step}</p>
                      ) : null}
                      {events.length > 0 ? <TargetEventList events={events} /> : null}
                    </div>
                  );
                })}
              </div>
            </details>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 size-4 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-950">No targets connected to a path yet.</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Open Targets and add a connected plan path, such as Junior Hockey Path or College Hockey Path.
                </p>
                <Button asChild variant="outline" className="mt-3 rounded-md">
                  <Link href="/targets">Open Targets</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function TargetEventList({ events }: { events: RecruitEvent[] }) {
  return (
    <div className="mt-3 rounded-md bg-white p-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-cyan-700" />
        <p className="text-sm font-semibold text-slate-950">Linked dates</p>
      </div>
      <div className="mt-3 grid gap-2">
        {events.map((event) => {
          const cost = formatEventCost(event.cost);

          return (
            <div key={event.id} className="smooth-card rounded-md border border-slate-200 p-3 hover:border-cyan-200 hover:shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="cyan">{eventTypeLabels[event.event_type]}</StatusPill>
                <StatusPill tone={event.status === "Completed" ? "green" : "slate"}>{event.status}</StatusPill>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-950">{event.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{formatEventDateRange(event)}</p>
              {cost ? <p className="mt-1 text-sm leading-6 text-slate-600">Cost: {cost}</p> : null}
              {event.url ? (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center gap-2 break-all text-sm font-medium text-cyan-800 underline-offset-4 hover:text-cyan-900 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-cyan-200"
                >
                  <ExternalLink className="size-4 shrink-0" /> Event link
                </a>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
