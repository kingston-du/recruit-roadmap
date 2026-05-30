"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getSafeRedirectPath } from "@/lib/auth";
import { appendSignupCompletedMarker } from "@/lib/analytics";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  message: string;
  success?: boolean;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
};

const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  next: z.string().optional(),
});

const initialError = {
  message:
    "Login is not ready because the Supabase settings are missing.",
} satisfies AuthFormState;

function getConfiguredSiteOrigin() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return "http://localhost:3000";
  }

  try {
    return new URL(siteUrl).origin;
  } catch {
    return "http://localhost:3000";
  }
}

function buildEmailRedirectTo(next: string | undefined) {
  const callbackUrl = new URL("/auth/callback", getConfiguredSiteOrigin());
  callbackUrl.searchParams.set("next", getSafeRedirectPath(next));

  return callbackUrl.toString();
}

function readAuthForm(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
}

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = readAuthForm(formData);

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!getSupabaseConfig()) {
    return initialError;
  }

  const rateLimit = await enforceRateLimit({
    scope: "auth:login",
    limit: 8,
    windowSeconds: 15 * 60,
    message: "Too many login attempts. Wait a few minutes and try again.",
  });

  if (!rateLimit.allowed) {
    return {
      message: rateLimit.message,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      message: "We could not sign you in. Check the email and password, then try again.",
    };
  }

  redirect(getSafeRedirectPath(parsed.data.next));
}

export async function signupAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = readAuthForm(formData);

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!getSupabaseConfig()) {
    return initialError;
  }

  const rateLimit = await enforceRateLimit({
    scope: "auth:signup",
    limit: 4,
    windowSeconds: 60 * 60,
    message: "Too many signup attempts. Wait a bit and try again.",
  });

  if (!rateLimit.allowed) {
    return {
      message: rateLimit.message,
    };
  }

  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: buildEmailRedirectTo(parsed.data.next),
    },
  });

  if (error) {
    return {
      message: "We could not create that account. Check the details and try again.",
    };
  }

  if (!session) {
    return {
      message: "Check your email to confirm your account, then come back to sign in.",
      success: true,
    };
  }

  redirect(appendSignupCompletedMarker(getSafeRedirectPath(parsed.data.next)));
}

export async function logoutAction() {
  if (getSupabaseConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/login");
}
