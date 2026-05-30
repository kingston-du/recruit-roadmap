import { beforeEach, describe, expect, it, vi } from "vitest";

const posthogMock = vi.hoisted(() => ({
  capture: vi.fn(),
  init: vi.fn(),
}));

vi.mock("posthog-js", () => ({
  default: posthogMock,
}));

describe("analytics client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_TOKEN", "test-token");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
    posthogMock.capture.mockReset();
    posthogMock.init.mockReset();
    window.history.replaceState(null, "", "http://localhost:3000/roadmap");
  });

  it("queues page views until PostHog finishes loading", async () => {
    let loaded: (() => void) | undefined;
    posthogMock.init.mockImplementation((_token: string, config: { loaded: () => void }) => {
      loaded = config.loaded;
    });

    const { trackPageView } = await import("@/lib/analytics-client");

    trackPageView("/roadmap");

    expect(posthogMock.capture).not.toHaveBeenCalled();

    loaded?.();

    expect(posthogMock.capture).toHaveBeenCalledWith(
      "$pageview",
      expect.objectContaining({
        "$current_url": "http://localhost:3000/roadmap",
        "$host": "localhost:3000",
        "$pathname": "/roadmap",
        page_name: "Roadmap",
        page_path: "/roadmap",
      }),
    );
  });

  it("captures custom events immediately after PostHog is ready", async () => {
    let loaded: (() => void) | undefined;
    posthogMock.init.mockImplementation((_token: string, config: { loaded: () => void }) => {
      loaded = config.loaded;
    });

    const { initializePostHog, trackAnalyticsEvent } = await import("@/lib/analytics-client");

    initializePostHog();
    loaded?.();
    trackAnalyticsEvent("upgrade_clicked", {
      billing_interval: "monthly",
      source: "pricing_page",
    });

    expect(posthogMock.capture).toHaveBeenCalledWith("upgrade_clicked", {
      billing_interval: "monthly",
      source: "pricing_page",
    });
  });
});
