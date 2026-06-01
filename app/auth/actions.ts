"use server";

import { isAuthApiError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { z } from "zod";

import { appendSignupCompletedMarker } from "@/lib/analytics";
import { buildEmailRedirectTo } from "@/lib/auth-redirect";
import { getSafeRedirectPath } from "@/lib/auth";
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
  captchaToken: z.string().trim().optional(),
  next: z.string().optional(),
});

const initialError = {
  message:
    "Login is not ready because the Supabase settings are missing.",
} satisfies AuthFormState;

function readOptionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function isSignupCaptchaEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
}

function getSignupErrorMessage(error: unknown) {
  if (isAuthApiError(error)) {
    if (
      error.status === 429 ||
      error.code === "over_email_send_rate_limit" ||
      error.code === "over_request_rate_limit"
    ) {
      return "Too many account confirmation emails were requested. Wait a few minutes and try again.";
    }

    if (error.code === "captcha_failed") {
      return "The security check did not complete. Refresh the page and try again.";
    }

    if (error.code === "email_address_not_authorized") {
      return "Account confirmation email is not ready for public signups yet.";
    }

    if (error.code === "signup_disabled" || error.code === "email_provider_disabled") {
      return "Account creation is temporarily unavailable. Try again later.";
    }
  }

  return "We could not create that account. Check the details and try again.";
}

function getLoginErrorMessage(error: unknown) {
  if (isAuthApiError(error)) {
    if (error.status === 429 || error.code === "over_request_rate_limit") {
      return "Too many login attempts. Wait a few minutes and try again.";
    }

    if (error.code === "email_not_confirmed") {
      return "Check your email to confirm this account before logging in.";
    }

    if (error.code === "invalid_credentials") {
      return "We could not sign you in. Check the email and password, then try again.";
    }
  }

  return "We could not sign you in. Check the email and password, then try again.";
}

function readAuthForm(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    captchaToken: readOptionalString(formData.get("captchaToken")),
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
    limit: 20,
    windowSeconds: 15 * 60,
    message: "Too many login attempts. Wait a few minutes and try again.",
    failOpen: true,
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
      message: getLoginErrorMessage(error),
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

  if (isSignupCaptchaEnabled() && !parsed.data.captchaToken) {
    return {
      message: "Complete the security check and try again.",
    };
  }

  const rateLimit = await enforceRateLimit({
    scope: "auth:signup",
    limit: 12,
    windowSeconds: 60 * 60,
    message: "Too many signup attempts. Wait a few minutes, then try again.",
    failOpen: true,
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
      captchaToken: parsed.data.captchaToken,
      emailRedirectTo: await buildEmailRedirectTo(parsed.data.next),
    },
  });

  if (error) {
    return {
      message: getSignupErrorMessage(error),
    };
  }

  if (!session) {
    return {
      message:
        "Check your email to confirm your account, then come back to sign in. If this email is already confirmed, use Log in instead.",
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
