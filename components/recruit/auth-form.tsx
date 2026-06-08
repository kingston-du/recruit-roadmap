"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import type { AuthFormState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = {
  message: "",
};

type AuthFormProps = {
  mode: "login" | "signup";
  action: (previousState: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  nextPath: string;
  turnstileSiteKey?: string;
};

export function AuthForm({ mode, action, nextPath, turnstileSiteKey }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [captchaError, setCaptchaError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance>(null);
  const isLogin = mode === "login";
  const hasTurnstile = Boolean(turnstileSiteKey);

  function handleFormAction(formData: FormData) {
    formAction(formData);

    if (hasTurnstile) {
      setCaptchaToken("");
      turnstileRef.current?.reset();
    }
  }

  return (
    <form action={handleFormAction} className="mt-8 grid gap-5">
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
          className="smooth-field h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4"
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
          className="smooth-field h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none ring-cyan-700/20 focus:border-cyan-700 focus:ring-4"
        />
        {state.fieldErrors?.password ? (
          <p className="text-sm text-red-700">{state.fieldErrors.password[0]}</p>
        ) : !isLogin ? (
          <p className="text-sm leading-5 text-slate-500">Use at least 6 characters.</p>
        ) : null}
      </div>

      {hasTurnstile && turnstileSiteKey ? (
        <div className="grid min-h-[65px] gap-2 overflow-hidden">
          <Turnstile
            ref={turnstileRef}
            siteKey={turnstileSiteKey}
            options={{
              action: mode,
              size: "flexible",
              theme: "light",
            }}
            onSuccess={(token) => {
              setCaptchaError("");
              setCaptchaToken(token);
            }}
            onExpire={() => {
              setCaptchaToken("");
            }}
            onError={() => {
              setCaptchaToken("");
              setCaptchaError("Security check did not load. Refresh and try again.");
            }}
            onTimeout={() => {
              setCaptchaToken("");
              setCaptchaError("Security check timed out. Refresh and try again.");
            }}
          />
          <input type="hidden" name="captchaToken" value={captchaToken} />
          {captchaError ? <p className="text-sm text-red-700">{captchaError}</p> : null}
        </div>
      ) : null}

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
        disabled={pending || (hasTurnstile && !captchaToken)}
        className="h-11 rounded-md bg-[#071a2f] text-white hover:bg-[#0b2745]"
      >
        {pending ? (isLogin ? "Checking..." : "Creating...") : isLogin ? "Log in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? `/signup?next=${encodeURIComponent(nextPath)}` : `/login?next=${encodeURIComponent(nextPath)}`}
          className="font-semibold text-cyan-800 underline-offset-4 hover:text-cyan-900 hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
