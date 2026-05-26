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
  EventDeleteState,
  EventMutationState,
  OutreachLogDeleteState,
  OutreachLogMutationState,
  TargetDeleteState,
  TargetMutationState,
} from "@/app/targets/actions";
import { Panel, StatusPill } from "@/components/recruit/ui";
import { Button } from "@/components/ui/button";
import type { Contact, ContactFormFieldName } from "@/lib/contacts";
import {
  compareRecruitEvents,
  eventStatusOptions,
  eventTypeLabels,
  eventTypeOptions,
  formatDateLabel,
  formatEventCost,
  formatEventDateRange,
  type EventFormFieldName,
  type RecruitEvent,
} from "@/lib/events";
import {
  compareOutreachLogs,
  outreachDirectionLabels,
  outreachDirectionOptions,
  outreachTypeLabels,
  outreachTypeOptions,
  type OutreachLog,
  type OutreachLogFormFieldName,
} from "@/lib/outreach";
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

const initialEventMutationState: EventMutationState = {
  message: "",
};

const initialEventDeleteState: EventDeleteState = {
  message: "",
};

const initialOutreachLogMutationState: OutreachLogMutationState = {
  message: "",
};

const initialOutreachLogDeleteState: OutreachLogDeleteState = {
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

type EventMutationAction = (
  previousState: EventMutationState,
  formData: FormData,
) => Promise<EventMutationState>;

type EventDeleteAction = (
  previousState: EventDeleteState,
  formData: FormData,
) => Promise<EventDeleteState>;

type OutreachLogMutationAction = (
  previousState: OutreachLogMutationState,
  formData: FormData,
) => Promise<OutreachLogMutationState>;

type OutreachLogDeleteAction = (
  previousState: OutreachLogDeleteState,
  formData: FormData,
) => Promise<OutreachLogDeleteState>;

type DrawerMode =
  | "create"
  | "detail"
  | "edit"
  | "upgrade"
  | "create-contact"
  | "edit-contact"
  | "contact-upgrade"
  | "create-event"
  | "edit-event"
  | "event-upgrade"
  | "create-outreach"
  | "edit-outreach"
  | "outreach-upgrade"
  | null;

type TargetsBoardProps = {
  targets: Target[];
  contacts: Contact[];
  events: RecruitEvent[];
  outreachLogs: OutreachLog[];
  isPro: boolean;
  freeTargetLimit: number;
  freeContactLimit: number;
  freeEventLimit: number;
  freeOutreachLogLimit: number;
  createAction: TargetMutationAction;
  updateAction: TargetMutationAction;
  deleteAction: TargetDeleteAction;
  createContactAction: ContactMutationAction;
  updateContactAction: ContactMutationAction;
  deleteContactAction: ContactDeleteAction;
  createEventAction: EventMutationAction;
  updateEventAction: EventMutationAction;
  deleteEventAction: EventDeleteAction;
  createOutreachLogAction: OutreachLogMutationAction;
  updateOutreachLogAction: OutreachLogMutationAction;
  deleteOutreachLogAction: OutreachLogDeleteAction;
};

type FieldState<FieldName extends string> = {
  fieldErrors?: Partial<Record<FieldName, string[]>>;
};

type FormFieldProps<FieldName extends string> = {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: "text" | "url" | "date" | "email" | "tel" | "number";
  min?: string;
  step?: string;
  placeholder?: string;
  helperText?: string;
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
  min,
  step,
  placeholder,
  helperText,
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
        min={min}
        step={step}
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

function SelectField<FieldName extends string>({
  name,
  label,
  defaultValue,
  required,
  options,
  placeholder = "Select",
  helperText,
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  helperText?: string;
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
      {helperText ? <p className="text-sm leading-5 text-slate-500">{helperText}</p> : null}
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function TextAreaField<FieldName extends string>({
  name,
  label,
  defaultValue,
  rows,
  required,
  placeholder,
  helperText,
  state,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  rows: number;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
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
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        required={required}
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

export function TargetsBoard({
  targets,
  contacts,
  events,
  outreachLogs,
  isPro,
  freeTargetLimit,
  freeContactLimit,
  freeEventLimit,
  freeOutreachLogLimit,
  createAction,
  updateAction,
  deleteAction,
  createContactAction,
  updateContactAction,
  deleteContactAction,
  createEventAction,
  updateEventAction,
  deleteEventAction,
  createOutreachLogAction,
  updateOutreachLogAction,
  deleteOutreachLogAction,
}: TargetsBoardProps) {
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [selectedId, setSelectedId] = useState<string | null>(targets[0]?.id ?? null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(contacts[0]?.id ?? null);
  const [contactTargetId, setContactTargetId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id ?? null);
  const [eventTargetId, setEventTargetId] = useState<string | null>(null);
  const [selectedOutreachLogId, setSelectedOutreachLogId] = useState<string | null>(
    outreachLogs[0]?.id ?? null,
  );
  const [outreachTargetId, setOutreachTargetId] = useState<string | null>(null);
  const selectedTarget = targets.find((target) => target.id === selectedId) ?? null;
  const selectedContact = contacts.find((contact) => contact.id === selectedContactId) ?? null;
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null;
  const selectedOutreachLog =
    outreachLogs.find((outreachLog) => outreachLog.id === selectedOutreachLogId) ?? null;
  const limitReached = !isPro && targets.length >= freeTargetLimit;
  const contactLimitReached = !isPro && contacts.length >= freeContactLimit;
  const eventLimitReached = !isPro && events.length >= freeEventLimit;
  const outreachLogLimitReached = !isPro && outreachLogs.length >= freeOutreachLogLimit;
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
  const eventCountByTarget = useMemo(() => {
    const counts = new Map<string, number>();

    events.forEach((event) => {
      if (!event.target_id) {
        return;
      }

      counts.set(event.target_id, (counts.get(event.target_id) ?? 0) + 1);
    });

    return counts;
  }, [events]);
  const lastOutreachDateByTarget = useMemo(() => {
    const dates = new Map<string, string>();

    outreachLogs.forEach((outreachLog) => {
      const currentDate = dates.get(outreachLog.target_id);

      if (!currentDate || outreachLog.outreach_date > currentDate) {
        dates.set(outreachLog.target_id, outreachLog.outreach_date);
      }
    });

    return dates;
  }, [outreachLogs]);
  const selectedTargetContacts = selectedTarget
    ? contacts.filter((contact) => contact.target_id === selectedTarget.id)
    : [];
  const selectedTargetEvents = selectedTarget
    ? [...events]
        .filter((event) => event.target_id === selectedTarget.id)
        .sort(compareRecruitEvents)
    : [];
  const selectedTargetOutreachLogs = selectedTarget
    ? [...outreachLogs]
        .filter((outreachLog) => outreachLog.target_id === selectedTarget.id)
        .sort(compareOutreachLogs)
    : [];
  const sortedEvents = useMemo(() => [...events].sort(compareRecruitEvents), [events]);
  const targetsByStatus = useMemo(
    () =>
      targetStatusOptions.map((column) => ({
        title: column,
        targets: targets.filter((target) => target.status === column),
      })),
    [targets],
  );
  const freeLimitPrompts = [
    {
      id: "target-limit",
      reached: limitReached,
      title: "Free target limit reached",
      detail: `${targets.length} of ${freeTargetLimit} free targets are used. Upgrade only when your family needs more room.`,
    },
    {
      id: "contact-limit",
      reached: contactLimitReached,
      title: "Free contact limit reached",
      detail: `${contacts.length} of ${freeContactLimit} free contacts are used. Upgrade only when your contact list grows.`,
    },
    {
      id: "event-limit",
      reached: eventLimitReached,
      title: "Free event limit reached",
      detail: `${events.length} of ${freeEventLimit} free dates are used. Upgrade only when you need more camps, deadlines, or visits.`,
    },
  ].filter((prompt) => prompt.reached);

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

  function openCreateEventDrawer(targetId: string | null = null) {
    setEventTargetId(targetId);
    setSelectedEventId(null);
    setDrawerMode(eventLimitReached ? "event-upgrade" : "create-event");
  }

  function openEditEventDrawer(event: RecruitEvent) {
    setSelectedEventId(event.id);
    setEventTargetId(event.target_id);

    if (event.target_id) {
      setSelectedId(event.target_id);
    }

    setDrawerMode("edit-event");
  }

  function openCreateOutreachLogDrawer(targetId: string) {
    setOutreachTargetId(targetId);
    setSelectedOutreachLogId(null);
    setDrawerMode(outreachLogLimitReached ? "outreach-upgrade" : "create-outreach");
  }

  function openEditOutreachLogDrawer(outreachLog: OutreachLog) {
    setSelectedOutreachLogId(outreachLog.id);
    setOutreachTargetId(outreachLog.target_id);
    setSelectedId(outreachLog.target_id);
    setDrawerMode("edit-outreach");
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

  function handleEventSaved() {
    if (eventTargetId) {
      setSelectedId(eventTargetId);
      setDrawerMode("detail");
      return;
    }

    closeDrawer();
  }

  function handleEventEdited(event: RecruitEvent) {
    if (event.target_id) {
      setSelectedId(event.target_id);
      setDrawerMode("detail");
      return;
    }

    closeDrawer();
  }

  function handleOutreachLogSaved() {
    if (outreachTargetId) {
      setSelectedId(outreachTargetId);
      setDrawerMode("detail");
      return;
    }

    closeDrawer();
  }

  function handleOutreachLogEdited(outreachLog: OutreachLog) {
    setSelectedId(outreachLog.target_id);
    setDrawerMode("detail");
  }

  return (
    <div className="grid gap-4">
      {freeLimitPrompts.length > 0 ? (
        <Panel className="border-amber-200 bg-amber-50">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-700" />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-amber-950">
                  Upgrade to keep adding to your board
                </h2>
                <div className="mt-2 grid gap-1">
                  {freeLimitPrompts.map((prompt) => (
                    <p key={prompt.id} className="text-sm leading-6 text-amber-900">
                      <span className="font-semibold">{prompt.title}:</span> {prompt.detail}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <Button asChild className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]">
              <Link href="/pricing">View Pro options</Link>
            </Button>
          </div>
        </Panel>
      ) : null}

      <Panel>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Target Board</h2>
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
                      eventCount={eventCountByTarget.get(target.id) ?? 0}
                      lastOutreachDate={lastOutreachDateByTarget.get(target.id) ?? null}
                      isSelected={target.id === selectedTarget?.id}
                      onClick={() => openDetailDrawer(target)}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
                    No targets in this stage yet.
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      <EventsSection
        events={sortedEvents}
        targetNameById={targetNameById}
        isPro={isPro}
        freeEventLimit={freeEventLimit}
        onAddEvent={() => openCreateEventDrawer()}
        onEditEvent={openEditEventDrawer}
        deleteEventAction={deleteEventAction}
      />

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
              events={selectedTargetEvents}
              outreachLogs={selectedTargetOutreachLogs}
              contactsUsed={contacts.length}
              eventsUsed={events.length}
              isPro={isPro}
              freeContactLimit={freeContactLimit}
              freeEventLimit={freeEventLimit}
              onEdit={() => setDrawerMode("edit")}
              onClose={closeDrawer}
              onAddContact={() => openCreateContactDrawer(selectedTarget.id)}
              onEditContact={openEditContactDrawer}
              onAddEvent={() => openCreateEventDrawer(selectedTarget.id)}
              onEditEvent={openEditEventDrawer}
              onAddOutreachLog={() => openCreateOutreachLogDrawer(selectedTarget.id)}
              onEditOutreachLog={openEditOutreachLogDrawer}
              deleteAction={deleteAction}
              deleteContactAction={deleteContactAction}
              deleteEventAction={deleteEventAction}
              deleteOutreachLogAction={deleteOutreachLogAction}
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

          {drawerMode === "create-event" ? (
            <EventForm
              key={`create-event-${eventTargetId ?? "none"}`}
              targets={targets}
              defaultTargetId={eventTargetId}
              action={createEventAction}
              submitLabel="Add event"
              pendingLabel="Adding..."
              onSuccess={handleEventSaved}
            />
          ) : null}

          {drawerMode === "edit-event" && selectedEvent ? (
            <EventForm
              key={`edit-event-${selectedEvent.id}`}
              event={selectedEvent}
              targets={targets}
              action={updateEventAction}
              submitLabel="Save event"
              pendingLabel="Saving..."
              onSuccess={() => handleEventEdited(selectedEvent)}
            />
          ) : null}

          {drawerMode === "create-outreach" && selectedTarget ? (
            <OutreachLogForm
              key={`create-outreach-${outreachTargetId ?? selectedTarget.id}`}
              target={selectedTarget}
              contacts={selectedTargetContacts}
              action={createOutreachLogAction}
              submitLabel="Add outreach"
              pendingLabel="Adding..."
              onSuccess={handleOutreachLogSaved}
            />
          ) : null}

          {drawerMode === "edit-outreach" && selectedOutreachLog && selectedTarget ? (
            <OutreachLogForm
              key={`edit-outreach-${selectedOutreachLog.id}`}
              outreachLog={selectedOutreachLog}
              target={selectedTarget}
              contacts={selectedTargetContacts}
              action={updateOutreachLogAction}
              submitLabel="Save outreach"
              pendingLabel="Saving..."
              onSuccess={() => handleOutreachLogEdited(selectedOutreachLog)}
            />
          ) : null}

          {drawerMode === "contact-upgrade" ? (
            <ContactUpgradePrompt used={contacts.length} limit={freeContactLimit} />
          ) : null}

          {drawerMode === "event-upgrade" ? (
            <EventUpgradePrompt used={events.length} limit={freeEventLimit} />
          ) : null}

          {drawerMode === "outreach-upgrade" ? (
            <OutreachUpgradePrompt used={outreachLogs.length} />
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
    return "Free target limit reached";
  }

  if (mode === "create-contact") {
    return "Add contact";
  }

  if (mode === "edit-contact") {
    return contact?.name ? `Edit ${contact.name}` : "Edit contact";
  }

  if (mode === "contact-upgrade") {
    return "Free contact limit reached";
  }

  if (mode === "create-event") {
    return "Add event";
  }

  if (mode === "edit-event") {
    return "Edit event";
  }

  if (mode === "event-upgrade") {
    return "Free date limit reached";
  }

  if (mode === "create-outreach") {
    return "Log outreach";
  }

  if (mode === "edit-outreach") {
    return "Edit outreach";
  }

  if (mode === "outreach-upgrade") {
    return "Outreach history is Pro";
  }

  return target?.name ?? "Target details";
}

function TargetCard({
  target,
  contactCount,
  eventCount,
  lastOutreachDate,
  isSelected,
  onClick,
}: {
  target: Target;
  contactCount: number;
  eventCount: number;
  lastOutreachDate: string | null;
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
      {eventCount > 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4 text-slate-400" /> {eventCount}{" "}
          {eventCount === 1 ? "date" : "dates"}
        </p>
      ) : null}
      {lastOutreachDate ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <Mail className="size-4 text-slate-400" /> Last outreach {formatDateLabel(lastOutreachDate)}
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
        <TextField
          name="name"
          label="Team, school, camp, or league name"
          defaultValue={target?.name}
          required
          placeholder="Boston Junior Eagles"
          helperText="Use the name your family will recognize later."
          state={state}
        />
        <SelectField
          name="target_type"
          label="What kind of target is this?"
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
          label="Current stage"
          defaultValue={target?.status ?? "Researching"}
          required
          options={statusOptions}
          helperText="This decides which board column the target appears in."
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
          label="Connected plan path"
          defaultValue={target?.connected_path}
          placeholder="Junior Hockey Path"
          helperText="Use the same wording as a path in My Plan when possible."
          state={state}
        />
        <TextField
          name="follow_up_date"
          label="Next follow-up date"
          type="date"
          defaultValue={target?.follow_up_date}
          helperText="Use this when someone needs to check back."
          state={state}
        />
      </div>

      <TextAreaField
        name="next_step"
        label="Next step"
        defaultValue={target?.next_step}
        rows={3}
        placeholder="Example: Research roster size and save coach contact."
        helperText="Write one small action your family can do next."
        state={state}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <TextField name="website_url" label="Main website" type="url" defaultValue={target?.website_url} state={state} />
        <TextField name="roster_url" label="Roster link" type="url" defaultValue={target?.roster_url} state={state} />
        <TextField name="camp_url" label="Camp or tryout link" type="url" defaultValue={target?.camp_url} state={state} />
      </div>

      <TextAreaField name="notes" label="Notes" defaultValue={target?.notes} rows={4} state={state} />
      <TextAreaField
        name="why_considering"
        label="Why this might fit"
        defaultValue={target?.why_considering}
        rows={4}
        placeholder="Example: Strong academics, reachable travel, good development fit, or right level."
        state={state}
      />
      <TextAreaField
        name="concerns"
        label="Questions or concerns"
        defaultValue={target?.concerns}
        rows={4}
        placeholder="Example: Cost, billet plan, roster depth, school fit, travel."
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
        label="Related target"
        defaultValue={contact?.target_id ?? defaultTargetId ?? ""}
        options={targetOptions}
        placeholder="No related target"
        helperText="Optional, but helpful when this contact belongs to a team, school, or camp."
        state={state}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<ContactFormFieldName>
          name="name"
          label="Contact name"
          defaultValue={contact?.name}
          required
          placeholder="Coach name"
          state={state}
        />
        <TextField<ContactFormFieldName>
          name="role"
          label="Coach or staff role"
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
        label="Where you found this contact"
        type="url"
        defaultValue={contact?.source_url}
        placeholder="Team staff page or public profile URL"
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

function EventForm({
  event,
  targets,
  defaultTargetId,
  action,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  event?: RecruitEvent;
  targets: Target[];
  defaultTargetId?: string | null;
  action: EventMutationAction;
  submitLabel: string;
  pendingLabel: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialEventMutationState);
  const targetOptions = targets.map((target) => ({ value: target.id, label: target.name }));
  const typeOptions = eventTypeOptions.map((option) => ({
    value: option,
    label: eventTypeLabels[option],
  }));
  const statusOptions = eventStatusOptions.map((option) => ({ value: option, label: option }));

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="grid gap-5">
      {event ? <input type="hidden" name="id" value={event.id} /> : null}

      <SelectField<EventFormFieldName>
        name="target_id"
        label="Related target"
        defaultValue={event?.target_id ?? defaultTargetId ?? ""}
        options={targetOptions}
        placeholder="No related target"
        helperText="Optional, but helpful if this date belongs to a specific target."
        state={state}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<EventFormFieldName>
          name="title"
          label="Date or event name"
          defaultValue={event?.title}
          required
          placeholder="Summer showcase"
          state={state}
        />
        <SelectField<EventFormFieldName>
          name="event_type"
          label="Date type"
          defaultValue={event?.event_type ?? "camp"}
          required
          options={typeOptions}
          state={state}
        />
        <TextField<EventFormFieldName>
          name="start_date"
          label="Start date"
          type="date"
          defaultValue={event?.start_date}
          required
          state={state}
        />
        <TextField<EventFormFieldName>
          name="end_date"
          label="End date"
          type="date"
          defaultValue={event?.end_date}
          state={state}
        />
        <TextField<EventFormFieldName>
          name="registration_deadline"
          label="Registration deadline"
          type="date"
          defaultValue={event?.registration_deadline}
          state={state}
        />
        <TextField<EventFormFieldName>
          name="cost"
          label="Cost"
          type="number"
          min="0"
          step="0.01"
          defaultValue={event?.cost === null || event?.cost === undefined ? "" : String(event.cost)}
          placeholder="450"
          state={state}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField<EventFormFieldName>
          name="location"
          label="Location"
          defaultValue={event?.location}
          placeholder="Rink, city, state"
          state={state}
        />
        <SelectField<EventFormFieldName>
          name="status"
          label="Date status"
          defaultValue={event?.status ?? "Planned"}
          required
          options={statusOptions}
          state={state}
        />
      </div>

      <TextField<EventFormFieldName>
        name="url"
        label="Registration or event link"
        type="url"
        defaultValue={event?.url}
        placeholder="Registration or event page"
        state={state}
      />

      <TextAreaField<EventFormFieldName>
        name="notes"
        label="Notes"
        defaultValue={event?.notes}
        rows={5}
        placeholder="Registration details, questions, or what to prepare."
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

      {state.upgradeRequired ? <InlineEventUpgradePrompt /> : null}

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

function OutreachLogForm({
  outreachLog,
  target,
  contacts,
  action,
  submitLabel,
  pendingLabel,
  onSuccess,
}: {
  outreachLog?: OutreachLog;
  target: Target;
  contacts: Contact[];
  action: OutreachLogMutationAction;
  submitLabel: string;
  pendingLabel: string;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialOutreachLogMutationState);
  const contactOptions = contacts.map((contact) => ({ value: contact.id, label: contact.name }));
  const typeOptions = outreachTypeOptions.map((option) => ({
    value: option,
    label: outreachTypeLabels[option],
  }));
  const directionOptions = outreachDirectionOptions.map((option) => ({
    value: option,
    label: outreachDirectionLabels[option],
  }));

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [onSuccess, state.success]);

  return (
    <form action={formAction} className="grid gap-5">
      {outreachLog ? <input type="hidden" name="id" value={outreachLog.id} /> : null}
      <input type="hidden" name="target_id" value={target.id} />

      <div className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <p className="font-semibold text-slate-950">{target.name}</p>
        <p className="mt-1">Save what happened so the next follow-up is easy to find.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField<OutreachLogFormFieldName>
          name="outreach_type"
          label="Outreach type"
          defaultValue={outreachLog?.outreach_type ?? "email"}
          required
          options={typeOptions}
          state={state}
        />
        <SelectField<OutreachLogFormFieldName>
          name="direction"
          label="Sent or received"
          defaultValue={outreachLog?.direction ?? "sent"}
          required
          options={directionOptions}
          state={state}
        />
        <TextField<OutreachLogFormFieldName>
          name="outreach_date"
          label="Outreach date"
          type="date"
          defaultValue={outreachLog?.outreach_date}
          required
          state={state}
        />
        <TextField<OutreachLogFormFieldName>
          name="next_follow_up_date"
          label="Next follow-up date"
          type="date"
          defaultValue={outreachLog?.next_follow_up_date}
          state={state}
        />
      </div>

      <SelectField<OutreachLogFormFieldName>
        name="contact_id"
        label="Contact"
        defaultValue={outreachLog?.contact_id ?? ""}
        options={contactOptions}
        placeholder="No saved contact"
        state={state}
      />

      <TextAreaField<OutreachLogFormFieldName>
        name="summary"
        label="What happened"
        defaultValue={outreachLog?.summary}
        rows={5}
        required
        placeholder="What did you send, hear, ask, or learn?"
        state={state}
      />

      <TextAreaField<OutreachLogFormFieldName>
        name="outcome"
        label="Result or response"
        defaultValue={outreachLog?.outcome}
        rows={4}
        placeholder="Example: Waiting on coach response, invited to call, no fit."
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

      {state.upgradeRequired ? <InlineOutreachUpgradePrompt /> : null}

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
  events,
  outreachLogs,
  contactsUsed,
  eventsUsed,
  isPro,
  freeContactLimit,
  freeEventLimit,
  onEdit,
  onClose,
  onAddContact,
  onEditContact,
  onAddEvent,
  onEditEvent,
  onAddOutreachLog,
  onEditOutreachLog,
  deleteAction,
  deleteContactAction,
  deleteEventAction,
  deleteOutreachLogAction,
}: {
  target: Target;
  contacts: Contact[];
  events: RecruitEvent[];
  outreachLogs: OutreachLog[];
  contactsUsed: number;
  eventsUsed: number;
  isPro: boolean;
  freeContactLimit: number;
  freeEventLimit: number;
  onEdit: () => void;
  onClose: () => void;
  onAddContact: () => void;
  onEditContact: (contact: Contact) => void;
  onAddEvent: () => void;
  onEditEvent: (event: RecruitEvent) => void;
  onAddOutreachLog: () => void;
  onEditOutreachLog: (outreachLog: OutreachLog) => void;
  deleteAction: TargetDeleteAction;
  deleteContactAction: ContactDeleteAction;
  deleteEventAction: EventDeleteAction;
  deleteOutreachLogAction: OutreachLogDeleteAction;
}) {
  const contactNameById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact.name])),
    [contacts],
  );

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
          <Pencil /> Edit target
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
            <p className="font-semibold text-slate-950">Dates and events</p>
            <p className="mt-1 text-slate-500">
              {isPro
                ? "Pro plan: unlimited dates"
                : `${eventsUsed} of ${freeEventLimit} free dates used`}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onAddEvent} className="h-8 w-fit rounded-md">
            <Plus /> Add date
          </Button>
        </div>
        <div className="mt-3">
          <EventList
            events={events}
            emptyText="No dates saved for this target yet."
            showTarget={false}
            onEditEvent={onEditEvent}
            deleteEventAction={deleteEventAction}
          />
        </div>
      </section>

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
            emptyText="No contacts saved for this target yet."
            showTarget={false}
            onEditContact={onEditContact}
            deleteContactAction={deleteContactAction}
          />
        </div>
      </section>

      <section className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-slate-950">Outreach history</p>
            <p className="mt-1 text-slate-500">
              {isPro
                ? "Pro plan: unlimited outreach logs"
                : "Pro feature: outreach history and follow-up reminders"}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={onAddOutreachLog} className="h-8 w-fit rounded-md">
            <Plus /> Log outreach
          </Button>
        </div>
        <div className="mt-3">
          <OutreachLogList
            outreachLogs={outreachLogs}
            contactNameById={contactNameById}
            emptyText="No outreach notes saved for this target yet."
            onEditOutreachLog={onEditOutreachLog}
            deleteOutreachLogAction={deleteOutreachLogAction}
          />
        </div>
      </section>

      <DetailBlock title="Next step">{target.next_step ?? "No next step yet."}</DetailBlock>
      <DetailBlock title="Notes">{target.notes ?? "No notes yet."}</DetailBlock>
      <DetailBlock title="Why this might fit">{target.why_considering ?? "No fit notes yet."}</DetailBlock>
      <DetailBlock title="Questions or concerns">{target.concerns ?? "No questions or concerns added yet."}</DetailBlock>

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
        if (!window.confirm(`Delete the target "${target.name}"?`)) {
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

function EventsSection({
  events,
  targetNameById,
  isPro,
  freeEventLimit,
  onAddEvent,
  onEditEvent,
  deleteEventAction,
}: {
  events: RecruitEvent[];
  targetNameById: Map<string, string>;
  isPro: boolean;
  freeEventLimit: number;
  onAddEvent: () => void;
  onEditEvent: (event: RecruitEvent) => void;
  deleteEventAction: EventDeleteAction;
}) {
  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Camps, dates, and events</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isPro ? "Pro plan: unlimited dates" : `${events.length} of ${freeEventLimit} free dates used`}
          </p>
        </div>
        <Button
          type="button"
          onClick={onAddEvent}
          className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
        >
          <Plus /> Add date
        </Button>
      </div>

      <div className="mt-4">
        <EventList
          events={events}
          targetNameById={targetNameById}
          emptyText="No camps, deadlines, visits, calls, or tryouts saved yet. Add a date when something needs to be remembered."
          showTarget
          onEditEvent={onEditEvent}
          deleteEventAction={deleteEventAction}
        />
      </div>
    </Panel>
  );
}

function EventList({
  events,
  targetNameById,
  emptyText,
  showTarget,
  onEditEvent,
  deleteEventAction,
}: {
  events: RecruitEvent[];
  targetNameById?: Map<string, string>;
  emptyText: string;
  showTarget: boolean;
  onEditEvent: (event: RecruitEvent) => void;
  deleteEventAction: EventDeleteAction;
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          targetName={event.target_id ? targetNameById?.get(event.target_id) : undefined}
          showTarget={showTarget}
          onEdit={() => onEditEvent(event)}
          deleteEventAction={deleteEventAction}
        />
      ))}
    </div>
  );
}

function EventItem({
  event,
  targetName,
  showTarget,
  onEdit,
  deleteEventAction,
}: {
  event: RecruitEvent;
  targetName?: string;
  showTarget: boolean;
  onEdit: () => void;
  deleteEventAction: EventDeleteAction;
}) {
  const cost = formatEventCost(event.cost);

  return (
    <section className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="cyan">{eventTypeLabels[event.event_type]}</StatusPill>
            <StatusPill tone={event.status === "Completed" ? "green" : "slate"}>{event.status}</StatusPill>
          </div>
          <p className="mt-3 font-semibold tracking-tight text-slate-950">{event.title}</p>
          {showTarget ? (
            <p className="mt-1 text-sm text-slate-500">{targetName ? `Target: ${targetName}` : "No target"}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="rounded-md">
            <Pencil /> Edit
          </Button>
          <DeleteEventForm event={event} action={deleteEventAction} />
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        <p className="flex items-start gap-2 font-medium text-slate-700">
          <CalendarDays className="mt-1 size-4 shrink-0 text-cyan-700" /> {formatEventDateRange(event)}
        </p>
        {event.registration_deadline ? (
          <p>Register by {formatDateLabel(event.registration_deadline)}</p>
        ) : null}
        {cost ? <p>Cost: {cost}</p> : null}
        {event.location ? (
          <p className="flex items-start gap-2">
            <MapPin className="mt-1 size-4 shrink-0 text-slate-400" /> {event.location}
          </p>
        ) : null}
        {event.url ? (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-2 break-all font-medium text-cyan-800 hover:text-cyan-900"
          >
            <ExternalLink className="mt-1 size-4 shrink-0" /> {event.url}
          </a>
        ) : null}
        {event.notes ? <p className="whitespace-pre-wrap break-words text-slate-700">{event.notes}</p> : null}
      </div>
    </section>
  );
}

function DeleteEventForm({
  event,
  action,
}: {
  event: RecruitEvent;
  action: EventDeleteAction;
}) {
  const [state, formAction, pending] = useActionState(action, initialEventDeleteState);

  return (
    <form
      action={formAction}
      onSubmit={(submitEvent) => {
        if (!window.confirm(`Delete the date "${event.title}"?`)) {
          submitEvent.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={event.id} />
      <Button type="submit" disabled={pending} variant="destructive" size="sm" className="rounded-md">
        <Trash2 /> {pending ? "Deleting..." : "Delete"}
      </Button>
      {state.message && !state.success ? <p className="mt-2 text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}

function OutreachLogList({
  outreachLogs,
  contactNameById,
  emptyText,
  onEditOutreachLog,
  deleteOutreachLogAction,
}: {
  outreachLogs: OutreachLog[];
  contactNameById: Map<string, string>;
  emptyText: string;
  onEditOutreachLog: (outreachLog: OutreachLog) => void;
  deleteOutreachLogAction: OutreachLogDeleteAction;
}) {
  if (outreachLogs.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {outreachLogs.map((outreachLog) => (
        <OutreachLogItem
          key={outreachLog.id}
          outreachLog={outreachLog}
          contactName={outreachLog.contact_id ? contactNameById.get(outreachLog.contact_id) : undefined}
          onEdit={() => onEditOutreachLog(outreachLog)}
          deleteOutreachLogAction={deleteOutreachLogAction}
        />
      ))}
    </div>
  );
}

function OutreachLogItem({
  outreachLog,
  contactName,
  onEdit,
  deleteOutreachLogAction,
}: {
  outreachLog: OutreachLog;
  contactName?: string;
  onEdit: () => void;
  deleteOutreachLogAction: OutreachLogDeleteAction;
}) {
  return (
    <section className="rounded-md border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="cyan">{outreachTypeLabels[outreachLog.outreach_type]}</StatusPill>
            <StatusPill>{outreachDirectionLabels[outreachLog.direction]}</StatusPill>
          </div>
          <p className="mt-3 flex items-start gap-2 font-semibold tracking-tight text-slate-950">
            <CalendarDays className="mt-1 size-4 shrink-0 text-cyan-700" />
            {formatDateLabel(outreachLog.outreach_date)}
          </p>
          {contactName ? <p className="mt-1 text-sm text-slate-500">Contact: {contactName}</p> : null}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="rounded-md">
            <Pencil /> Edit
          </Button>
          <DeleteOutreachLogForm outreachLog={outreachLog} action={deleteOutreachLogAction} />
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        <p className="whitespace-pre-wrap break-words text-slate-700">{outreachLog.summary}</p>
        {outreachLog.outcome ? (
          <p className="whitespace-pre-wrap break-words">
            <span className="font-medium text-slate-700">Outcome:</span> {outreachLog.outcome}
          </p>
        ) : null}
        {outreachLog.next_follow_up_date ? (
          <p className="flex items-start gap-2 font-medium text-slate-700">
            <CalendarDays className="mt-1 size-4 shrink-0 text-cyan-700" />
            Next follow-up {formatDateLabel(outreachLog.next_follow_up_date)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function DeleteOutreachLogForm({
  outreachLog,
  action,
}: {
  outreachLog: OutreachLog;
  action: OutreachLogDeleteAction;
}) {
  const [state, formAction, pending] = useActionState(action, initialOutreachLogDeleteState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this outreach log?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={outreachLog.id} />
      <Button type="submit" disabled={pending} variant="destructive" size="sm" className="rounded-md">
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
          emptyText="No coach contacts saved yet. Add a contact when you find a public coach or staff email."
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
        if (!window.confirm(`Delete the contact "${contact.name}"?`)) {
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
              You have used {used} of {limit} free targets. Upgrade only when your family needs to track more.
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
              You have used {used} of {limit} free coach contacts. Upgrade only when your contact list grows.
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

function EventUpgradePrompt({ used, limit }: { used: number; limit: number }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-amber-700" />
          <div>
            <h3 className="font-semibold text-amber-950">Free event limit reached</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              You have used {used} of {limit} free dates. Upgrade only when you need more camps, deadlines, or visits.
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

function OutreachUpgradePrompt({ used }: { used: number }) {
  return (
    <div className="grid gap-5">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 text-amber-700" />
          <div>
            <h3 className="font-semibold text-amber-950">Outreach history is a Pro feature</h3>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              {used > 0 ? `You have ${used} saved outreach logs. ` : ""}
              Pro includes outreach history and follow-up reminders.
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
          Free accounts include 5 targets. Upgrade when your family needs more room.{" "}
          <Link href="/pricing" className="font-semibold text-amber-950 underline-offset-4 hover:underline">
            View Pro options
          </Link>
        </p>
      </div>
    </div>
  );
}

function InlineEventUpgradePrompt() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <p>
          Free accounts include 3 events or dates. Upgrade when you need more room for camps, deadlines, or visits.{" "}
          <Link href="/pricing" className="font-semibold text-amber-950 underline-offset-4 hover:underline">
            View Pro options
          </Link>
        </p>
      </div>
    </div>
  );
}

function InlineOutreachUpgradePrompt() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700" />
        <p>
          Outreach history and follow-up reminders are included with Pro.{" "}
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
          Free accounts include 3 coach contacts. Upgrade when your contact list grows.{" "}
          <Link href="/pricing" className="font-semibold text-amber-950 underline-offset-4 hover:underline">
            View Pro options
          </Link>
        </p>
      </div>
    </div>
  );
}
