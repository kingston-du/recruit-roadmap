"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";

import type { PlayerProfileFormState } from "@/app/my-player/actions";
import {
  playerPositionOptions,
  shootsOptions,
  type PlayerProfile,
  type PlayerProfileFieldName,
} from "@/lib/player-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const initialState: PlayerProfileFormState = {
  message: "",
};

type PlayerProfileFormProps = {
  profile: PlayerProfile | null;
  action: (
    previousState: PlayerProfileFormState,
    formData: FormData,
  ) => Promise<PlayerProfileFormState>;
};

type TextFieldProps = {
  name: PlayerProfileFieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  type?: "text" | "number" | "url";
  min?: string;
  max?: string;
  step?: string;
  placeholder?: string;
  helperText?: string;
  autoComplete?: string;
  state: PlayerProfileFormState;
};

function fieldError(state: PlayerProfileFormState, name: PlayerProfileFieldName) {
  return state.fieldErrors?.[name]?.[0];
}

function fieldClass(hasError: boolean) {
  return cn(
    "min-h-11 rounded-md border bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4",
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
  min,
  max,
  step,
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
        min={min}
        max={max}
        step={step}
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

function SelectField({
  name,
  label,
  defaultValue,
  options,
  helperText,
  state,
}: {
  name: PlayerProfileFieldName;
  label: string;
  defaultValue?: string | null;
  options: readonly string[];
  helperText?: string;
  state: PlayerProfileFormState;
}) {
  const error = fieldError(state, name);
  const errorId = `${name}-error`;

  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={fieldClass(Boolean(error))}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helperText ? <p className="text-sm leading-5 text-slate-500">{helperText}</p> : null}
      <FieldMessage id={errorId} message={error} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  required,
  rows,
  placeholder,
  helperText,
  state,
}: {
  name: PlayerProfileFieldName;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  rows: number;
  placeholder?: string;
  helperText?: string;
  state: PlayerProfileFormState;
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

export function PlayerProfileForm({ profile, action }: PlayerProfileFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form id="player-profile-form" action={formAction} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          name="first_name"
          label="First name"
          defaultValue={profile?.first_name}
          required
          autoComplete="given-name"
          state={state}
        />
        <TextField
          name="last_name"
          label="Last name"
          defaultValue={profile?.last_name}
          autoComplete="family-name"
          state={state}
        />
        <TextField
          name="birth_year"
          label="Birth year"
          defaultValue={profile?.birth_year}
          required
          type="number"
          placeholder="2009"
          helperText="Use the player's birth year, not graduation year."
          state={state}
        />
        <TextField
          name="hometown"
          label="Hometown"
          defaultValue={profile?.hometown}
          placeholder="City, State"
          autoComplete="address-level2"
          state={state}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          name="position"
          label="Position"
          defaultValue={profile?.position}
          options={playerPositionOptions}
          helperText="Choose the position families and coaches would recognize first."
          state={state}
        />
        <SelectField
          name="shoots"
          label="Shoots"
          defaultValue={profile?.shoots}
          options={shootsOptions}
          helperText="For goalies, use catching hand if that is how your family tracks it."
          state={state}
        />
        <TextField
          name="height"
          label="Height"
          defaultValue={profile?.height}
          required
          placeholder="5'10&quot;"
          state={state}
        />
        <TextField
          name="weight"
          label="Weight"
          defaultValue={profile?.weight}
          required
          placeholder="165 lbs"
          state={state}
        />
        <TextField
          name="current_team"
          label="Current team"
          defaultValue={profile?.current_team}
          required
          state={state}
        />
        <TextField
          name="current_level"
          label="Current level"
          defaultValue={profile?.current_level}
          required
          placeholder="AAA, Prep, High School"
          helperText="Use the level your family uses when comparing options."
          state={state}
        />
      </div>

      <div className="grid gap-4">
        <TextField
          name="gpa"
          label="GPA"
          defaultValue={profile?.gpa}
          type="number"
          min="0"
          max="5"
          step="0.01"
          placeholder="3.7"
          helperText="Optional. Add it only if your family wants academics visible here."
          state={state}
        />
        <TextField
          name="target_path"
          label="Path you are considering"
          defaultValue={profile?.target_path}
          required
          placeholder="Prep, juniors, college hockey"
          helperText="This is not a prediction. It is the path your family wants to organize."
          state={state}
        />
        <TextAreaField
          name="goals"
          label="Player and family goals"
          defaultValue={profile?.goals}
          required
          rows={5}
          placeholder="Example: Find the right development level, keep academics strong, and compare realistic next steps."
          state={state}
        />
      </div>

      <div className="grid gap-4">
        <TextAreaField
          name="video_links_text"
          label="Video links"
          defaultValue={profile?.video_links.join("\n")}
          rows={4}
          placeholder="One URL per line"
          helperText="Optional while you get started. Paste links your family already has. Recruit Roadmap does not scrape video or profile sites."
          state={state}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            name="elite_prospects_url"
            label="Elite Prospects URL"
            defaultValue={profile?.elite_prospects_url}
            type="url"
            helperText="Optional public profile link."
            state={state}
          />
          <TextField
            name="myhockey_url"
            label="MyHockey URL"
            defaultValue={profile?.myhockey_url}
            type="url"
            helperText="Optional public profile or ranking link."
            state={state}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          name="coach_reference_name"
          label="Coach reference name"
          defaultValue={profile?.coach_reference_name}
          state={state}
        />
        <TextField
          name="coach_reference_contact"
          label="Coach reference contact"
          defaultValue={profile?.coach_reference_contact}
          placeholder="Email or phone"
          state={state}
        />
      </div>

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
        <Save /> {pending ? "Saving..." : "Save player profile"}
      </Button>
    </form>
  );
}
