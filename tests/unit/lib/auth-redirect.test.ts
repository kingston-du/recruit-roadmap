import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  headers: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: mocks.headers,
}));

describe("auth redirect URLs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    mocks.headers.mockResolvedValue(
      new Headers({
        host: "localhost:3000",
        "x-forwarded-proto": "http",
      }),
    );
  });

  // Validates a mistaken production localhost env cannot leak into confirmation emails.
  it("ignores localhost NEXT_PUBLIC_SITE_URL in production and uses the request origin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");
    mocks.headers.mockResolvedValue(
      new Headers({
        "x-forwarded-host": "hockeypathway.example",
        "x-forwarded-proto": "https",
      }),
    );
    const { buildEmailRedirectTo } = await import("@/lib/auth-redirect");

    await expect(buildEmailRedirectTo("/targets")).resolves.toBe(
      "https://hockeypathway.example/auth/callback?next=%2Ftargets",
    );
  });

  // Validates the configured canonical site is preferred when it is safe for production.
  it("uses a non-local configured site origin", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.hockeypathway.app/some/path");
    const { buildEmailRedirectTo } = await import("@/lib/auth-redirect");

    await expect(buildEmailRedirectTo("/today")).resolves.toBe(
      "https://www.hockeypathway.app/auth/callback?next=%2Ftoday",
    );
  });

  // Validates Vercel deployment URLs are normalized with https when no canonical URL exists.
  it("normalizes Vercel deployment URLs", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "recruit-roadmap.vercel.app");
    const { buildEmailRedirectTo } = await import("@/lib/auth-redirect");

    await expect(buildEmailRedirectTo("/my-plan")).resolves.toBe(
      "https://recruit-roadmap.vercel.app/auth/callback?next=%2Fmy-plan",
    );
  });

  // Validates malicious next values cannot ride along in confirmation links.
  it("keeps the next path internal", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.hockeypathway.app");
    const { buildEmailRedirectTo } = await import("@/lib/auth-redirect");

    await expect(buildEmailRedirectTo("https://evil.example")).resolves.toBe(
      "https://www.hockeypathway.app/auth/callback?next=%2Ftoday",
    );
  });
});
