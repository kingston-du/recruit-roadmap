"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {
  message: "",
};

type AuthFormProps = {
  mode: "login" | "signup";
  action: (previousState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  nextPath: string;
};

export function AuthForm({ mode, action, nextPath }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLogin = mode === "login";

  return (
    <form action={formAction} className="mt-8 grid gap-5">
      <input type="hidden" name="next" value={nextPath} />

      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4"
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm text-red-700">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          required
          minLength={6}
          className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4"
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-red-700">{state.fieldErrors.password[0]}</p>
        ) : null}
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
        className="h-11 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
      >
        {pending ? "Working..." : isLogin ? "Log in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? `/signup?next=${encodeURIComponent(nextPath)}` : `/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-cyan-800 hover:text-cyan-900"
        >
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
