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

  it("initializes PostHog in cookieless non-identifying mode", async () => {
    const { initializePostHog } = await import("@/lib/analytics-client");

    expect(initializePostHog()).toBe(true);
    expect(posthogMock.init).toHaveBeenCalledWith(
      "test-token",
      expect.objectContaining({
        advanced_disable_decide: true,
        advanced_disable_feature_flags: true,
        advanced_disable_feature_flags_on_first_load: true,
        autocapture: false,
        capture_dead_clicks: false,
        capture_exceptions: false,
        capture_heatmaps: false,
        capture_pageleave: false,
        capture_pageview: false,
        capture_performance: false,
        cookieless_mode: "always",
        defaults: "2026-01-30",
        disable_conversations: true,
        disable_external_dependency_loading: true,
        disable_persistence: true,
        disable_product_tours: true,
        disable_scroll_properties: true,
        disable_session_recording: true,
        disable_surveys: true,
        disable_surveys_automatic_display: true,
        disable_web_experiments: true,
        internal_or_test_user_hostname: null,
        persistence: "memory",
        person_profiles: "never",
        property_denylist: expect.arrayContaining([
          "$browser",
          "$device_id",
          "$ip",
          "$session_id",
          "$user_agent",
        ]),
        rageclick: false,
        save_campaign_params: false,
        save_referrer: false,
      }),
    );
    expect(posthogMock.init.mock.calls[0][1].before_send).toEqual(expect.any(Function));
    expect(posthogMock.init.mock.calls[0][1].loaded).toEqual(expect.any(Function));
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
