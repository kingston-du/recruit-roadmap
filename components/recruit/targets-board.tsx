"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import type { TargetDeleteState, TargetMutationState } from "@/app/targets/actions";
import { Button } from "@/components/ui/button";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { cn } from "@/lib/utils";
import {
  targetPriorityOptions,
  targetStatusOptions,
  targetTypeLabels,
  targetTypeOptions,
  type Target,
  type TargetFormFieldName,
} from "@/lib/targets";

const initialMutationState: TargetMutationState = {
  message: "",
};

const initialDeleteState: TargetDeleteState = {
  message: "",
};

type TargetMutationAction = (
  previousState: TargetMutationState,
  formData: FormData,
) => Promise<TargetMutationState>;

type TargetDeleteAction = (
  previousState: TargetDeleteState,
  formData: FormData,
) => Promise<TargetDeleteState>;

type DrawerMode = "create" | "detail" | "edit" | "upgrade" | null;

type TargetsBoardProps = {
  targets: Target[];
  isPro: boolean;
  freeTargetLimit: number;
  createAction: TargetMutationAction;
  updateAction: TargetMutationAction;
  deleteAction: TargetDeleteAction;
};

type FormFieldProps = {
  name: TargetFormFieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: "text" | "url" | "date";
  placeholder?: string;
  state: TargetMutationState;
};

function fieldError(state: TargetMutationState, name: TargetFormFieldName) {
  return state.fieldErrors?.[name]?.[0];
}

function fieldClass(hasError: boolean) {
  return cn(
    "min-h-10 rounded-md border bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4",
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

function TextField({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  placeholder,
  state,
}: FormFieldProps) {
  const error = fieldError(state, name);
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required ? null : <span className="text-slate-400"> optional</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass(Boolean(error))}
      />
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  required,
  options,
  state,
}: {
  name: TargetFormFieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  state: TargetMutationState;
}) {
  const error = fieldError(state, name);
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        {required ? null : <span className="text-slate-400"> optional</span>}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass(Boolean(error))}
      >
        <option value="" disabled={required}>
          Select
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  rows,
  placeholder,
  state,
}: {
  name: TargetFormFieldName;
  label: string;
  defaultValue?: string | null;
  rows: number;
  placeholder?: string;
  state: TargetMutationState;
}) {
  const error = fieldError(state, name);
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
        <span className="text-slate-400"> optional</span>
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(fieldClass(Boolean(error)), "py-3 leading-6")}
      />
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

export function TargetsBoard({
  targets,
  isPro,
  freeTargetLimit,
  createAction,
  updateAction,
  deleteAction,
}: TargetsBoardProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedId, setSelectedId] = useState<string | null>(targets[0]?.id ?? null);
  const selectedTarget = targets.find((target) => target.id === selectedId) ?? null;
  const limitReached = !isPro && targets.length >= freeTargetLimit;
  const targetsByStatus = useMemo(
    () =>
      targetStatusOptions.map((column) => ({
        title: column,
        targets: targets.filter((target) => target.status === column),
      })),
    [targets],
  );

  function openCreateDrawer() {
    setDrawerMode(limitReached ? "upgrade" : "create");
  }

  function openDetailDrawer(target: Target) {
    setSelectedId(target.id);
    setDrawerMode("detail");
  }

  function closeDrawer() {
    setDrawerMode(null);
  }

  return (
    <div className="grid gap-4">
      <Panel>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Target board</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isPro ? "Pro plan: unlimited targets" : `${targets.length} of ${freeTargetLimit} free targets used`}
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreateDrawer}
            className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
          >
            <Plus /> Add target
          </Button>
        </div>
      </Panel>

      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[1420px] grid-cols-6 gap-4">
          {targetsByStatus.map((column) => (
            <section key={column.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 px-1 py-2">
                <h2 className="text-sm font-semibold text-slate-950">{column.title}</h2>
                <span className="text-xs font-medium text-slate-500">{column.targets.length}</span>
              </div>

              <div className="mt-2 grid gap-3">
                {column.targets.length > 0 ? (
                  column.targets.map((target) => (
                    <TargetCard
                      key={target.id}
                      target={target}
                      isSelected={target.id === selectedTarget?.id}
                      onClick={() => openDetailDrawer(target)}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
                    No targets here yet.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {drawerMode ? (
        <TargetDrawer title={drawerTitle(drawerMode, selectedTarget)} onClose={closeDrawer}>
          {drawerMode === "create" ? (
            <TargetForm
              key="create-target"
              action={createAction}
              submitLabel="Add target"
              pendingLabel="Adding..."
              onSuccess={closeDrawer}
            />
          ) : null}

          {drawerMode === "detail" && selectedTarget ? (
            <TargetDetail
              target={selectedTarget}
              onEdit={() => setDrawerMode("edit")}
              onClose={closeDrawer}
              deleteAction={deleteAction}
            />
          ) : null}

          {drawerMode === "edit" && selectedTarget ? (
            <TargetForm
              key={`edit-target-${selectedTarget.id}`}
              target={selectedTarget}
              action={updateAction}
              submitLabel="Save target"
              pendingLabel="Saving..."
              onSuccess={closeDrawer}
            />
          ) : null}

          {drawerMode === "upgrade" ? <UpgradePrompt used={targets.length} limit={freeTargetLimit} /> : null}
        </TargetDrawer>
      ) : null}
    </div>
  );
}

function drawerTitle(mode: DrawerMode, target: Target | null) {
  if (mode === "create") {
    return "Add target";
  }

  if (mode === "edit") {
    return "Edit target";
  }

  if (mode === "upgrade") {
    return "Upgrade target limit";
  }

  return target?.name ?? "Target details";
}

function TargetCard({
  target,
  isSelected,
  onClick,
}: {
  target: Target;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={
        isSelected
          ? "rounded-md border border-cyan-500 bg-white p-4 text-left shadow-sm ring-2 ring-cyan-100"
          : "rounded-md border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-cyan-200 hover:bg-cyan-50/40"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold tracking-tight text-slate-950">{target.name}</h3>
        {target.priority ? <StatusPill tone={target.priority === "High" ? "amber" : "slate"}>{target.priority}</StatusPill> : null}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        {targetTypeLabels[target.target_type]}
        {target.level ? ` - ${target.level}` : ""}
      </p>
      {target.location ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="size-4 text-slate-400" /> {target.location}
        </p>
      ) : null}
      {target.connected_path ? (
        <div className="mt-3">
          <StatusPill tone="cyan">{target.connected_path}</StatusPill>
        </div>
      ) : null}
      {target.next_step ? <p className="mt-3 text-sm leading-6 text-slate-700">{target.next_step}</p> : null}
      {target.follow_up_date ? (
        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
          <CalendarDays className="size-4 text-cyan-700" /> {target.follow_up_date}
        </p>
      ) : null}
    </button>
  );
}

function TargetDrawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close target drawer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close target drawer"
            className="flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </section>
    </div>
  );
}

function TargetForm({
  target,
  action,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  target?: Target;
  action: TargetMutationAction;
  submitLabel: string;
  pendingLabel: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialMutationState);
  const typeOptions = targetTypeOptions.map((option) => ({
    value: option,
    label: targetTypeLabels[option],
  }));
  const statusOptions = targetStatusOptions.map((option) => ({ value: option, label: option }));
  const priorityOptions = targetPriorityOptions.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="grid gap-5">
      {target ? <input type="hidden" name="id" value={target.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField name="name" label="Name" defaultValue={target?.name} required state={state} />
        <SelectField
          name="target_type"
          label="Target type"
          defaultValue={target?.target_type}
          required
          options={typeOptions}
          state={state}
        />
        <TextField name="level" label="Level" defaultValue={target?.level} placeholder="AAA, prep, D3" state={state} />
        <TextField name="location" label="Location" defaultValue={target?.location} placeholder="City, State" state={state} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="status"
          label="Board column"
          defaultValue={target?.status ?? "Researching"}
          required
          options={statusOptions}
          state={state}
        />
        <SelectField
          name="priority"
          label="Priority"
          defaultValue={target?.priority}
          options={priorityOptions}
          state={state}
        />
        <TextField
          name="connected_path"
          label="Connected path"
          defaultValue={target?.connected_path}
          placeholder="Prep, juniors, college"
          state={state}
        />
        <TextField
          name="follow_up_date"
          label="Follow-up date"
          type="date"
          defaultValue={target?.follow_up_date}
          state={state}
        />
      </div>

      <TextAreaField
        name="next_step"
        label="Next step"
        defaultValue={target?.next_step}
        rows={3}
        placeholder="Example: Research roster size and save coach contact."
        state={state}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <TextField name="website_url" label="Website URL" type="url" defaultValue={target?.website_url} state={state} />
        <TextField name="roster_url" label="Roster URL" type="url" defaultValue={target?.roster_url} state={state} />
        <TextField name="camp_url" label="Camp URL" type="url" defaultValue={target?.camp_url} state={state} />
      </div>

      <TextAreaField name="notes" label="Notes" defaultValue={target?.notes} rows={4} state={state} />
      <TextAreaField
        name="why_considering"
        label="Why considering"
        defaultValue={target?.why_considering}
        rows={4}
        state={state}
      />
      <TextAreaField name="concerns" label="Concerns" defaultValue={target?.concerns} rows={4} state={state} />

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

      {state.upgradeRequired ? <InlineUpgradePrompt /> : null}

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

function TargetDetail({
  target,
  onEdit,
  onClose,
  deleteAction,
}: {
  target: Target;
  onEdit: () => void;
  onClose: () => void;
  deleteAction: TargetDeleteAction;
}) {
  return (
    <div className="grid gap-5">
      <div>
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="cyan">{target.status}</StatusPill>
          <StatusPill>{targetTypeLabels[target.target_type]}</StatusPill>
          {target.priority ? <StatusPill tone={target.priority === "High" ? "amber" : "slate"}>{target.priority}</StatusPill> : null}
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{target.name}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {[target.level, target.location].filter(Boolean).join(" - ") || "No level or location yet"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onEdit} className="rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
          <Pencil /> Edit
        </Button>
        <DeleteTargetForm target={target} action={deleteAction} onSuccess={onClose} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DetailBlock title="Connected path">{target.connected_path ?? "Not set"}</DetailBlock>
        <DetailBlock title="Follow-up date">{target.follow_up_date ?? "Not set"}</DetailBlock>
      </div>

      <DetailBlock title="Next step">{target.next_step ?? "No next step yet."}</DetailBlock>
      <DetailBlock title="Notes">{target.notes ?? "No notes yet."}</DetailBlock>
      <DetailBlock title="Why considering">{target.why_considering ?? "No reason added yet."}</DetailBlock>
      <DetailBlock title="Concerns">{target.concerns ?? "No concerns added yet."}</DetailBlock>

      <DetailBlock title="Links">
        <div className="grid gap-2">
          <TargetLink label="Website" href={target.website_url} />
          <TargetLink label="Roster" href={target.roster_url} />
          <TargetLink label="Camp" href={target.camp_url} />
        </div>
      </DetailBlock>
    </div>
  );
}

function DeleteTargetForm({
  target,
  action,
  onSuccess,
}: {
  target: Target;
  action: TargetDeleteAction;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialDeleteState);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${target.name}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={target.id} />
      <Button type="submit" disabled={pending} variant="destructive" className="rounded-md">
        <Trash2 /> {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.message && !state.success ? <p className="mt-2 text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}

function DetailBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
      <p className="font-semibold text-slate-950">{title}</p>
      <div className="mt-2 whitespace-pre-wrap break-words">{children}</div>
    </section>
  );
}

function TargetLink({ label, href }: { label: string; href: string | null }) {
  if (!href) {
    return <p className="text-sm text-slate-500">{label}: Not set</p>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 break-all text-sm font-medium text-cyan-800 hover:text-cyan-900"
    >
      <ExternalLink className="size-4 shrink-0" /> {label}: {href}
    </a>
  );
}

function UpgradePrompt({ used, limit }: { used: number; limit: number }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-amber-700" />
          <div>
            <h3 className="font-semibold text-amber-950">Free target limit reached</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              You are tracking {used} of {limit} free targets. Pro unlocks unlimited targets.
            </p>
          </div>
        </div>
      </div>
      <Button asChild className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
        <Link href="/pricing">View Pro options</Link>
      </Button>
    </div>
  );
}

function InlineUpgradePrompt() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <p>
          Free accounts include 5 targets.{" "}
          <Link href="/pricing" className="font-semibold text-amber-950 underline-offset-4 hover:underline">
            View Pro options
          </Link>
        </p>
      </div>
    </div>
  );
}
