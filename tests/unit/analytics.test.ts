import { describe, expect, it } from "vitest";

import {
  buildPageViewProperties,
  isAnalyticsEventName,
  pageNameFromPathname,
  sanitizeAnalyticsProperties,
} from "@/lib/analytics";

describe("public analytics helpers", () => {
  it("maps public routes to page names", () => {
    expect(pageNameFromPathname("/")).toBe("Home");
    expect(pageNameFromPathname("/roadmap")).toBe("Roadmap");
    expect(pageNameFromPathname("/leagues/ushl")).toBe("League");
    expect(pageNameFromPathname("/privacy")).toBe("Privacy");
  });

  it("builds sanitized page view properties without query data", () => {
    expect(buildPageViewProperties("/leagues/ushl?email=parent@example.com", "https://example.com")).toEqual({
      "$current_url": "https://example.com/leagues/ushl",
      "$host": "example.com",
      "$pathname": "/leagues/ushl",
      page_name: "League",
      page_path: "/leagues/ushl",
    });
  });

  it("allows only public roadmap event names and safe properties", () => {
    expect(isAnalyticsEventName("roadmap_filter_used")).toBe(true);
    expect(isAnalyticsEventName("signup_completed")).toBe(false);

    expect(
      sanitizeAnalyticsProperties({
        source: "roadmap_filter",
        filter_type: "stage",
        filter_value: "Junior",
        league_slug: "ushl",
        email: "parent@example.com",
        notes: "private player note",
      }),
    ).toEqual({
      source: "roadmap_filter",
      filter_type: "stage",
      filter_value: "Junior",
      league_slug: "ushl",
    });
  });
});
