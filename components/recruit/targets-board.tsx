"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  CalendarDays,
  ExternalLink,
  Link2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import type {
  ContactDeleteState,
  ContactMutationState,
  TargetDeleteState,
  TargetMutationState,
} from "@/app/targets/actions";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import type { Contact, ContactFormFieldName } from "@/lib/contacts";
import { cn } from "@/lib/utils";
import {
  targetPriorityOptions,
  targetStatusOptions,
  targetTypeLabels,
  targetTypeOptions,
  type Target,
} from "@/lib/targets";

const initialMutationState: TargetMutationState = {
  message: "",
};

const initialDeleteState: TargetDeleteState = {
  message: "",
};

const initialContactMutationState: ContactMutationState = {
  message: "",
};

const initialContactDeleteState: ContactDeleteState = {
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

type ContactMutationAction = (
  previousState: ContactMutationState,
  formData: FormData,
) => Promise<ContactMutationState>;

type ContactDeleteAction = (
  previousState: ContactDeleteState,
  formData: FormData,
) => Promise<ContactDeleteState>;

type DrawerMode =
  | "create"
  | "detail"
  | "edit"
  | "upgrade"
  | "create-contact"
  | "edit-contact"
  | "contact-upgrade"
  | null;

type TargetsBoardProps = {
  targets: Target[];
  contacts: Contact[];
  isPro: boolean;
  freeTargetLimit: number;
  freeContactLimit: number;
  createAction: TargetMutationAction;
  updateAction: TargetMutationAction;
  deleteAction: TargetDeleteAction;
  createContactAction: ContactMutationAction;
  updateContactAction: ContactMutationAction;
  deleteContactAction: ContactDeleteAction;
};

type FieldState<FieldName extends string> = {
  fieldErrors?: Partial<Record<FieldName, string[]>>;
};

type FormFieldProps<FieldName extends string> = {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: "text" | "url" | "date" | "email" | "tel";
  placeholder?: string;
  state: FieldState<FieldName>;
};

function fieldError<FieldName extends string>(state: FieldState<FieldName>, name: FieldName) {
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

function TextField<FieldName extends string>({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  placeholder,
  state,
}: FormFieldProps<FieldName>) {
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

function SelectField<FieldName extends string>({
  name,
  label,
  defaultValue,
  required,
  options,
  placeholder = "Select",
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  state: FieldState<FieldName>;
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
          {placeholder}
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

function TextAreaField<FieldName extends string>({
  name,
  label,
  defaultValue,
  rows,
  placeholder,
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  rows: number;
  placeholder?: string;
  state: FieldState<FieldName>;
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
  contacts,
  isPro,
  freeTargetLimit,
  freeContactLimit,
  createAction,
  updateAction,
  deleteAction,
  createContactAction,
  updateContactAction,
  deleteContactAction,
}: TargetsBoardProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedId, setSelectedId] = useState<string | null>(targets[0]?.id ?? null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(contacts[0]?.id ?? null);
  const [contactTargetId, setContactTargetId] = useState<string | null>(null);
  const selectedTarget = targets.find((target) => target.id === selectedId) ?? null;
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? null;
  const limitReached = !isPro && targets.length >= freeTargetLimit;
  const contactLimitReached = !isPro && contacts.length >= freeContactLimit;
  const targetNameById = useMemo(
    () => new Map(targets.map((target) => [target.id, target.name])),
    [targets],
  );
  const contactCountByTarget = useMemo(() => {
    const counts = new Map<string, number>();

    contacts.forEach((contact) => {
      if (!contact.target_id) {
        return;
      }

      counts.set(contact.target_id, (counts.get(contact.target_id) ?? 0) + 1);
    });

    return counts;
  }, [contacts]);
  const selectedTargetContacts = selectedTarget
    ? contacts.filter((contact) => contact.target_id === selectedTarget.id)
    : [];
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

  function openCreateContactDrawer(targetId: string | null = null) {
    setContactTargetId(targetId);
    setSelectedContactId(null);
    setDrawerMode(contactLimitReached ? "contact-upgrade" : "create-contact");
  }

  function openEditContactDrawer(contact: Contact) {
    setSelectedContactId(contact.id);
    setContactTargetId(contact.target_id);

    if (contact.target_id) {
      setSelectedId(contact.target_id);
    }

    setDrawerMode("edit-contact");
  }

  function closeDrawer() {
    setDrawerMode(null);
  }

  function handleContactSaved() {
    if (contactTargetId) {
      setSelectedId(contactTargetId);
      setDrawerMode("detail");
      return;
    }

    closeDrawer();
  }

  function handleContactEdited(contact: Contact) {
    if (contact.target_id) {
      setSelectedId(contact.target_id);
      setDrawerMode("detail");
      return;
    }

    closeDrawer();
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
                      contactCount={contactCountByTarget.get(target.id) ?? 0}
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

      <ContactsSection
        contacts={contacts}
        targetNameById={targetNameById}
        isPro={isPro}
        freeContactLimit={freeContactLimit}
        onAddContact={() => openCreateContactDrawer()}
        onEditContact={openEditContactDrawer}
        deleteContactAction={deleteContactAction}
      />

      {drawerMode ? (
        <TargetDrawer title={drawerTitle(drawerMode, selectedTarget, selectedContact)} onClose={closeDrawer}>
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
              contacts={selectedTargetContacts}
              contactsUsed={contacts.length}
              isPro={isPro}
              freeContactLimit={freeContactLimit}
              onEdit={() => setDrawerMode("edit")}
              onClose={closeDrawer}
              onAddContact={() => openCreateContactDrawer(selectedTarget.id)}
              onEditContact={openEditContactDrawer}
              deleteAction={deleteAction}
              deleteContactAction={deleteContactAction}
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

          {drawerMode === "create-contact" ? (
            <ContactForm
              key={`create-contact-${contactTargetId ?? "none"}`}
              targets={targets}
              defaultTargetId={contactTargetId}
              action={createContactAction}
              submitLabel="Add contact"
              pendingLabel="Adding..."
              onSuccess={handleContactSaved}
            />
          ) : null}

          {drawerMode === "edit-contact" && selectedContact ? (
            <ContactForm
              key={`edit-contact-${selectedContact.id}`}
              contact={selectedContact}
              targets={targets}
              action={updateContactAction}
              submitLabel="Save contact"
              pendingLabel="Saving..."
              onSuccess={() => handleContactEdited(selectedContact)}
            />
          ) : null}

          {drawerMode === "contact-upgrade" ? (
            <ContactUpgradePrompt used={contacts.length} limit={freeContactLimit} />
          ) : null}
        </TargetDrawer>
      ) : null}
    </div>
  );
}

function drawerTitle(mode: DrawerMode, target: Target | null, contact: Contact | null) {
  if (mode === "create") {
    return "Add target";
  }

  if (mode === "edit") {
    return "Edit target";
  }

  if (mode === "upgrade") {
    return "Upgrade target limit";
  }

  if (mode === "create-contact") {
    return "Add contact";
  }

  if (mode === "edit-contact") {
    return contact?.name ? `Edit ${contact.name}` : "Edit contact";
  }

  if (mode === "contact-upgrade") {
    return "Upgrade contact limit";
  }

  return target?.name ?? "Target details";
}

function TargetCard({
  target,
  contactCount,
  isSelected,
  onClick,
}: {
  target: Target;
  contactCount: number;
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
      {contactCount > 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <UserRound className="size-4 text-slate-400" /> {contactCount}{" "}
          {contactCount === 1 ? "contact" : "contacts"}
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
        aria-label="Close drawer"
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
            aria-label="Close drawer"
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

function ContactForm({
  contact,
  targets,
  defaultTargetId,
  action,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  contact?: Contact;
  targets: Target[];
  defaultTargetId?: string | null;
  action: ContactMutationAction;
  submitLabel: string;
  pendingLabel: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialContactMutationState);
  const targetOptions = targets.map((target) => ({ value: target.id, label: target.name }));

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="grid gap-5">
      {contact ? <input type="hidden" name="id" value={contact.id} /> : null}

      <SelectField<ContactFormFieldName>
        name="target_id"
        label="Target"
        defaultValue={contact?.target_id ?? defaultTargetId ?? ""}
        options={targetOptions}
        placeholder="No target"
        state={state}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<ContactFormFieldName>
          name="name"
          label="Name"
          defaultValue={contact?.name}
          required
          placeholder="Coach name"
          state={state}
        />
        <TextField<ContactFormFieldName>
          name="role"
          label="Role"
          defaultValue={contact?.role}
          required
          placeholder="Head coach"
          state={state}
        />
        <TextField<ContactFormFieldName>
          name="email"
          label="Email"
          type="email"
          defaultValue={contact?.email}
          required
          state={state}
        />
        <TextField<ContactFormFieldName>
          name="phone"
          label="Phone"
          type="tel"
          defaultValue={contact?.phone}
          state={state}
        />
      </div>

      <TextField<ContactFormFieldName>
        name="source_url"
        label="Source URL"
        type="url"
        defaultValue={contact?.source_url}
        placeholder="Team staff page or public profile"
        state={state}
      />

      <TextAreaField<ContactFormFieldName>
        name="notes"
        label="Notes"
        defaultValue={contact?.notes}
        rows={5}
        placeholder="What should your family remember about this contact?"
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

      {state.upgradeRequired ? <InlineContactUpgradePrompt /> : null}

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
  contacts,
  contactsUsed,
  isPro,
  freeContactLimit,
  onEdit,
  onClose,
  onAddContact,
  onEditContact,
  deleteAction,
  deleteContactAction,
}: {
  target: Target;
  contacts: Contact[];
  contactsUsed: number;
  isPro: boolean;
  freeContactLimit: number;
  onEdit: () => void;
  onClose: () => void;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  deleteAction: TargetDeleteAction;
  deleteContactAction: ContactDeleteAction;
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

      <section className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-slate-950">Contacts</p>
            <p className="mt-1 text-slate-500">
              {isPro
                ? "Pro plan: unlimited contacts"
                : `${contactsUsed} of ${freeContactLimit} free contacts used`}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onAddContact} className="h-8 w-fit rounded-md">
            <Plus /> Add contact
          </Button>
        </div>
        <div className="mt-3">
          <ContactList
            contacts={contacts}
            emptyText="No contacts saved for this target."
            showTarget={false}
            onEditContact={onEditContact}
            deleteContactAction={deleteContactAction}
          />
        </div>
      </section>

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

function ContactsSection({
  contacts,
  targetNameById,
  isPro,
  freeContactLimit,
  onAddContact,
  onEditContact,
  deleteContactAction,
}: {
  contacts: Contact[];
  targetNameById: Map<string, string>;
  isPro: boolean;
  freeContactLimit: number;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  deleteContactAction: ContactDeleteAction;
}) {
  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Coach contacts</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isPro ? "Pro plan: unlimited contacts" : `${contacts.length} of ${freeContactLimit} free contacts used`}
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddContact}
          className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
        >
          <Plus /> Add contact
        </Button>
      </div>

      <div className="mt-4">
        <ContactList
          contacts={contacts}
          targetNameById={targetNameById}
          emptyText="No coach contacts yet."
          showTarget
          onEditContact={onEditContact}
          deleteContactAction={deleteContactAction}
        />
      </div>
    </Panel>
  );
}

function ContactList({
  contacts,
  targetNameById,
  emptyText,
  showTarget,
  onEditContact,
  deleteContactAction,
}: {
  contacts: Contact[];
  targetNameById?: Map<string, string>;
  emptyText: string;
  showTarget: boolean;
  onEditContact: (contact: Contact) => void;
  deleteContactAction: ContactDeleteAction;
}) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          targetName={contact.target_id ? targetNameById?.get(contact.target_id) : undefined}
          showTarget={showTarget}
          onEdit={() => onEditContact(contact)}
          deleteContactAction={deleteContactAction}
        />
      ))}
    </div>
  );
}

function ContactItem({
  contact,
  targetName,
  showTarget,
  onEdit,
  deleteContactAction,
}: {
  contact: Contact;
  targetName?: string;
  showTarget: boolean;
  onEdit: () => void;
  deleteContactAction: ContactDeleteAction;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold tracking-tight text-slate-950">{contact.name}</p>
          <p className="mt-1 text-sm text-slate-500">{contact.role ?? "Role not set"}</p>
          {showTarget ? (
            <p className="mt-1 text-sm text-slate-500">{targetName ? `Target: ${targetName}` : "No target"}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="rounded-md">
            <Pencil /> Edit
          </Button>
          <DeleteContactForm contact={contact} action={deleteContactAction} />
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        <p className="flex items-start gap-2 break-all">
          <Mail className="mt-1 size-4 shrink-0 text-slate-400" /> {contact.email ?? "No email saved"}
        </p>
        {contact.phone ? (
          <p className="flex items-start gap-2">
            <Phone className="mt-1 size-4 shrink-0 text-slate-400" /> {contact.phone}
          </p>
        ) : null}
        {contact.source_url ? (
          <a
            href={contact.source_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-2 break-all font-medium text-cyan-800 hover:text-cyan-900"
          >
            <Link2 className="mt-1 size-4 shrink-0" /> Source: {contact.source_url}
          </a>
        ) : null}
        {contact.notes ? <p className="whitespace-pre-wrap break-words text-slate-700">{contact.notes}</p> : null}
      </div>
    </section>
  );
}

function DeleteContactForm({
  contact,
  action,
}: {
  contact: Contact;
  action: ContactDeleteAction;
}) {
  const [state, formAction, pending] = useActionState(action, initialContactDeleteState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${contact.name}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={contact.id} />
      <Button type="submit" disabled={pending} variant="destructive" size="sm" className="rounded-md">
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

function ContactUpgradePrompt({ used, limit }: { used: number; limit: number }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-amber-700" />
          <div>
            <h3 className="font-semibold text-amber-950">Free contact limit reached</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              You are tracking {used} of {limit} free coach contacts. Pro unlocks unlimited contacts.
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

function InlineContactUpgradePrompt() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <p>
          Free accounts include 3 coach contacts.{" "}
          <Link href="/pricing" className="font-semibold text-amber-950 underline-offset-4 hover:underline">
            View Pro options
          </Link>
        </p>
      </div>
    </div>
  );
}
