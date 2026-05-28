"use client";

import { CreditCard, Send } from "lucide-react";
import { useActionState } from "react";

import type { SetupAssistRequestFormState } from "@/app/setup-assist/actions";
import type { SetupAssistRequestFieldName } from "@/lib/setup-assist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const initialState: SetupAssistRequestFormState = {
  message: "",
};

type SetupAssistFormProps = {
  action: (
    previousState: SetupAssistRequestFormState,
    formData: FormData,
  ) => Promise<SetupAssistRequestFormState>;
  defaultEmail: string;
  paymentLink: string | undefined;
};

type TextFieldProps = {
  name: SetupAssistRequestFieldName;
  label: string;
  defaultValue?: string;
  required?: boolean;
  type?: "text" | "email";
  placeholder?: string;
  helperText?: string;
  autoComplete?: string;
  state: SetupAssistRequestFormState;
};

function fieldError(state: SetupAssistRequestFormState, name: SetupAssistRequestFieldName) {
  return state.fieldErrors?.[name]?.[0];
}

function fieldClass(hasError: boolean) {
  return cn(
    "smooth-field min-h-11 rounded-md border bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4",
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
  helperText,
  autoComplete,
  state,
}: TextFieldProps) {
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
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass(Boolean(error))}
      />
      {helperText ? <p className="text-sm leading-5 text-slate-500">{helperText}</p> : null}
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  required,
  rows,
  placeholder,
  helperText,
  state,
}: {
  name: SetupAssistRequestFieldName;
  label: string;
  required?: boolean;
  rows: number;
  placeholder?: string;
  helperText?: string;
  state: SetupAssistRequestFormState;
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

export function SetupAssistForm({
  action,
  defaultEmail,
  paymentLink,
}: SetupAssistFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          name="parent_player_name"
          label="Parent or family contact name"
          required
          autoComplete="name"
          helperText="Who should be connected to this request?"
          state={state}
        />
        <TextField
          name="email"
          label="Email"
          defaultValue={defaultEmail}
          required
          type="email"
          autoComplete="email"
          helperText="Use the email tied to this account if possible."
          state={state}
        />
        <TextField name="player_name" label="Player name" required state={state} />
      </div>

      <div className="grid gap-4">
        <TextAreaField
          name="help_needed"
          label="What do you need help importing?"
          required
          rows={4}
          placeholder="Targets, coach contacts, dates, profile links, or a mix."
          helperText="List the buckets of information you already have."
          state={state}
        />
        <TextAreaField
          name="goals"
          label="What are you trying to organize?"
          required
          rows={4}
          placeholder="Example: Get our target list, camp dates, and coach contacts into the app."
          helperText="A short explanation helps setup stay focused."
          state={state}
        />
      </div>

      <div className="grid gap-4">
        <TextAreaField
          name="current_target_list"
          label="Paste your current target list"
          rows={6}
          placeholder="Paste teams, schools, camps, leagues, links, or notes."
          helperText="Plain text is fine. Clean formatting is not required."
          state={state}
        />
        <TextAreaField
          name="coach_contacts"
          label="Paste coach contacts"
          rows={6}
          placeholder="Paste names, roles, emails, phone numbers, source links, or notes."
          helperText="Only include contacts your family already found."
          state={state}
        />
        <TextAreaField
          name="camp_date_links"
          label="Paste camp, date, or deadline links"
          rows={6}
          placeholder="Paste camp links, registration deadlines, tryout dates, or follow-up dates."
          state={state}
        />
        <TextAreaField
          name="notes"
          label="Notes"
          rows={4}
          placeholder="Anything else that would help set up the account."
          state={state}
        />
      </div>

      {state.message ? (
        <div
          className={
            state.success
              ? "grid gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-800"
              : "rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800"
          }
        >
          <p aria-live="polite">{state.message}</p>
          {state.success && paymentLink ? (
            <Button
              asChild
              className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
            >
              <a href={paymentLink}>
                <CreditCard /> Pay $20 Setup Assist
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-fit rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
      >
        <Send /> {pending ? "Submitting..." : "Submit setup request"}
      </Button>
    </form>
  );
}
