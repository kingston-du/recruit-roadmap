import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  headers: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

vi.mock("@/lib/admin", () => ({
  createAdminClient: mocks.createAdminClient,
}));

vi.mock("@/lib/supabase/config", () => ({
  getSupabaseConfig: () => ({
    url: "https://project.supabase.co",
    publishableKey: "sb_publishable_test",
  }),
}));

describe("enforceRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
    mocks.headers.mockResolvedValue(
      new Headers({
        "x-forwarded-for": "203.0.113.10",
        "user-agent": "vitest",
        "accept-language": "en-US",
      }),
    );
  });

  // Validates real limiter rejections still block the caller.
  it("blocks when the rate limit RPC reports the window is exhausted", async () => {
    mocks.createAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        error: { message: "Rate limit exceeded" },
      }),
    });
    const { enforceRateLimit } = await import("@/lib/rate-limit");

    const result = await enforceRateLimit({
      scope: "auth:login",
      limit: 1,
      windowSeconds: 60,
      message: "Too many login attempts.",
      failOpen: true,
    });

    expect(result).toEqual({ allowed: false, message: "Too many login attempts." });
  });

  // Validates auth stays available if the optional app-level limiter has an infra/config error.
  it("allows fail-open callers when the rate limit RPC itself fails", async () => {
    mocks.createAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        error: { message: "permission denied for function check_rate_limit" },
      }),
    });
    const { enforceRateLimit } = await import("@/lib/rate-limit");

    const result = await enforceRateLimit({
      scope: "auth:signup",
      limit: 1,
      windowSeconds: 60,
      message: "Too many signup attempts.",
      failOpen: true,
    });

    expect(result).toEqual({ allowed: true, message: "" });
  });

  // Validates missing rate-limit config cannot take down auth when auth opts into fail-open behavior.
  it("allows fail-open callers when the service role key is missing", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const { enforceRateLimit } = await import("@/lib/rate-limit");

    const result = await enforceRateLimit({
      scope: "auth:login",
      limit: 1,
      windowSeconds: 60,
      message: "Too many login attempts.",
      failOpen: true,
    });

    expect(result).toEqual({ allowed: true, message: "" });
    expect(mocks.createAdminClient).not.toHaveBeenCalled();
  });

  // Validates non-auth callers keep the stricter default when the limiter is broken.
  it("blocks fail-closed callers when the rate limit RPC itself fails", async () => {
    mocks.createAdminClient.mockReturnValue({
      rpc: vi.fn().mockResolvedValue({
        error: { message: "permission denied for function check_rate_limit" },
      }),
    });
    const { enforceRateLimit } = await import("@/lib/rate-limit");

    const result = await enforceRateLimit({
      scope: "targets:mutation",
      limit: 1,
      windowSeconds: 60,
      message: "Too many target changes.",
    });

    expect(result).toEqual({ allowed: false, message: "Too many target changes." });
  });
});
