import { AuthApiError } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeFormData } from "@/tests/helpers/recruit-fixtures";

const mocks = vi.hoisted(() => ({
  buildEmailRedirectTo: vi.fn(async () => "https://hockeypathway.com/auth/callback?next=%2Ftoday"),
  createClient: vi.fn(),
  enforceRateLimit: vi.fn(async () => ({ allowed: true, message: "" })),
  getSupabaseConfig: vi.fn(() => ({
    publishableKey: "sb_publishable_test",
    url: "https://project.supabase.co",
  })),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/lib/auth-redirect", () => ({
  buildEmailRedirectTo: mocks.buildEmailRedirectTo,
}));

vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: mocks.enforceRateLimit,
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabaseConfig: mocks.getSupabaseConfig,
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

function authForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    email: "family@example.com",
    password: "correct-horse",
    next: "/today",
    ...overrides,
  });
}

describe("auth server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  // Validates login fails before Supabase when Turnstile is configured but no token is submitted.
  it("requires a CAPTCHA token for login when auth CAPTCHA is enabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    const { loginAction } = await import("@/app/auth/actions");

    const result = await loginAction({ message: "" }, authForm());

    expect(result.message).toBe("Complete the security check and try again.");
    expect(mocks.enforceRateLimit).not.toHaveBeenCalled();
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  // Validates login passes the Turnstile token to Supabase Auth.
  it("passes the CAPTCHA token to signInWithPassword", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    const signInWithPassword = vi.fn(async () => ({ error: null }));
    mocks.createClient.mockResolvedValue({
      auth: { signInWithPassword },
    });
    const { loginAction } = await import("@/app/auth/actions");

    await expect(
      loginAction({ message: "" }, authForm({ captchaToken: "turnstile-token" })),
    ).rejects.toThrow("redirect:/today");

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "family@example.com",
      password: "correct-horse",
      options: {
        captchaToken: "turnstile-token",
      },
    });
  });

  // Validates Supabase CAPTCHA failures are shown as security-check failures, not password failures.
  it("returns a clear login message for Supabase CAPTCHA failures", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    mocks.createClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn(async () => ({
          error: new AuthApiError("captcha protection: request disallowed", 400, "captcha_failed"),
        })),
      },
    });
    const { loginAction } = await import("@/app/auth/actions");

    const result = await loginAction(
      { message: "" },
      authForm({ captchaToken: "expired-turnstile-token" }),
    );

    expect(result.message).toBe("The security check did not complete. Refresh the page and try again.");
  });
});
