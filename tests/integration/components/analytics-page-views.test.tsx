import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navigationMocks = vi.hoisted(() => ({
  pathname: "/today",
  replace: vi.fn(),
  searchParams: new URLSearchParams("signup=completed"),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({
    replace: navigationMocks.replace,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

vi.mock("@/lib/analytics-client", () => ({
  initializePostHog: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

import { trackAnalyticsEvent, trackPageView } from "@/lib/analytics-client";
import { AnalyticsPageViews } from "@/components/recruit/analytics-page-views";

describe("AnalyticsPageViews", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
    vi.mocked(trackPageView).mockClear();
    navigationMocks.replace.mockClear();
    navigationMocks.pathname = "/today";
    navigationMocks.searchParams = new URLSearchParams("signup=completed");
  });

  it("tracks page views and a signup completion marker without query data", async () => {
    render(<AnalyticsPageViews />);

    await waitFor(() => expect(trackPageView).toHaveBeenCalledWith("/today"));
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("signup_completed", {
      page_name: "Today",
      source: "signup_redirect",
    });
    expect(navigationMocks.replace).toHaveBeenCalledWith("/today", {
      scroll: false,
    });
  });
});
