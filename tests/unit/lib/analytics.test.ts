import { describe, expect, it } from "vitest";
import type { CaptureResult } from "posthog-js";

import {
  appendSignupCompletedMarker,
  buildPageViewProperties,
  pageNameFromPathname,
  sanitizeAnalyticsProperties,
  sanitizePostHogCapture,
} from "@/lib/analytics";

describe("analytics privacy helpers", () => {
  it("keeps only safe app metadata", () => {
    expect(
      sanitizeAnalyticsProperties({
        contact_count: 2,
        email: "parent@example.com",
        notes: "This should never leave the app.",
        page_name: "Targets",
        phone: "555-123-4567",
        plan_tier: "free",
        target_type: "school",
      }),
    ).toEqual({
      contact_count: 2,
      page_name: "Targets",
      plan_tier: "free",
      target_type: "school",
    });
  });

  it("drops sensitive-looking string values even on allowed keys", () => {
    expect(
      sanitizeAnalyticsProperties({
        page_name: "parent@example.com",
        source: "target_form",
        target_type: "555-123-4567",
      }),
    ).toEqual({
      source: "target_form",
    });
  });

  it("builds page view metadata without query strings", () => {
    expect(buildPageViewProperties("/targets?signup=completed", "https://example.com")).toEqual({
      "$current_url": "https://example.com/targets",
      "$pathname": "/targets",
      page_name: "Targets",
      page_path: "/targets",
    });
  });

  it("sanitizes PostHog capture payloads before send", () => {
    const captureResult = {
      uuid: "event-id",
      event: "target_created",
      properties: {
        "$browser": "Chrome",
        "$current_url": "https://example.com/targets?email=parent@example.com",
        coach_email: "coach@example.com",
        distinct_id: "anonymous-id",
        page_name: "Targets",
        target_count: 1,
      },
      $set: {
        email: "parent@example.com",
      },
      $set_once: {
        first_name: "Evan",
      },
    } satisfies CaptureResult;

    expect(sanitizePostHogCapture(captureResult)).toEqual({
      uuid: "event-id",
      event: "target_created",
      properties: {
        "$browser": "Chrome",
        "$current_url": "https://example.com/targets",
        distinct_id: "anonymous-id",
        page_name: "Targets",
        target_count: 1,
      },
      $set: undefined,
      $set_once: undefined,
    });
  });

  it("rejects unplanned automatic events", () => {
    expect(
      sanitizePostHogCapture({
        uuid: "event-id",
        event: "$autocapture",
        properties: {},
      }),
    ).toBeNull();
    expect(
      sanitizePostHogCapture({
        uuid: "event-id",
        event: "$identify",
        properties: {
          distinct_id: "user-id",
        },
      }),
    ).toBeNull();
    expect(
      sanitizePostHogCapture({
        uuid: "event-id",
        event: "$exception",
        properties: {
          "$exception_message": "Unexpected parent@example.com value",
        },
      }),
    ).toBeNull();
  });

  it("maps page names and preserves safe signup redirect query params", () => {
    expect(pageNameFromPathname("/my-player")).toBe("My Player");
    expect(appendSignupCompletedMarker("/today?next_step=targets")).toBe(
      "/today?next_step=targets&signup=completed",
    );
  });
});
