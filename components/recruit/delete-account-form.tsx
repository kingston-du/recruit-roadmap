"use client";

import { Trash2 } from "lucide-react";
import { useActionState } from "react";

import type { DeleteAccountState } from "@/app/settings/actions";
import { Button } from "@/components/ui/button";

const initialState: DeleteAccountState = {
  message: "",
};

export function DeleteAccountForm({
  action,
}: {
  action: (
    previousState: DeleteAccountState,
    formData: FormData,
  ) => Promise<DeleteAccountState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const error = state.fieldErrors?.confirm?.[0];

  return (
    <form action={formAction} className="mt-5 grid gap-3">
      <div className="grid gap-2">
        <label htmlFor="confirm-delete" className="text-sm font-medium text-slate-700">
          Type DELETE to confirm
        </label>
        <input
          id="confirm-delete"
          name="confirm"
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "confirm-delete-error" : undefined}
          className="smooth-field h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none ring-red-700/20 focus:border-red-700 focus:ring-4"
        />
        {error ? (
          <p id="confirm-delete-error" className="text-sm text-red-700">
            {error}
          </p>
        ) : null}
      </div>

      {state.message ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-10 w-fit rounded-md bg-red-700 text-white hover:bg-red-800"
      >
        <Trash2 /> {pending ? "Deleting..." : "Delete account"}
      </Button>
    </form>
  );
}
