import { describe, expect, it } from "vitest";

import {
  buildPlayerProfileUpsert,
  getPlayerProfileCompleteness,
  normalizePlayerProfile,
  playerProfileFormSchema,
  readPlayerProfileFormData,
} from "@/lib/player-profile";
import { makeFormData, makePlayerProfile, userId } from "@/tests/helpers/recruit-fixtures";

const validProfileInput = {
  first_name: " Evan ",
  last_name: " Miller ",
  birth_year: "2009",
  position: "Defense",
  shoots: "Right",
  height: "5'10\"",
  weight: "165 lbs",
  current_team: "Cushing Academy",
  current_level: "Prep",
  hometown: "Worcester, MA",
  gpa: "3.72",
  target_path: "Prep, juniors, college hockey",
  goals: "Find the right development fit while keeping academics strong.",
  video_links_text: "https://example.com/highlight\nhttps://example.com/full-game, https://example.com/shift",
  elite_prospects_url: "https://example.com/elite",
  myhockey_url: "https://example.com/myhockey",
  coach_reference_name: "Coach Martin",
  coach_reference_contact: "coach@example.com",
};

describe("Player profile validation and completeness", () => {
  // Validates that a complete profile is trimmed, video links are split, and writes use authenticated ownership.
  it("creates a profile upsert payload from valid player inputs", () => {
    const parsed = playerProfileFormSchema.safeParse(validProfileInput);

    expect(parsed.success).toBe(true);
    if (!parsed.success) {
      return;
    }

    expect(parsed.data.first_name).toBe("Evan");
    expect(parsed.data.video_links_text).toEqual([
      "https://example.com/highlight",
      "https://example.com/full-game",
      "https://example.com/shift",
    ]);
    expect(buildPlayerProfileUpsert(userId, parsed.data)).toMatchObject({
      user_id: userId,
      first_name: "Evan",
      video_links: [
        "https://example.com/highlight",
        "https://example.com/full-game",
        "https://example.com/shift",
      ],
    });
  });

  // Validates required player identity, hockey, and goals fields fail together with clear field errors.
  it("returns validation errors for missing required player fields", () => {
    const parsed = playerProfileFormSchema.safeParse({
      ...validProfileInput,
      first_name: "",
      birth_year: "",
      position: "",
      shoots: "",
      height: "",
      weight: "",
      current_team: "",
      current_level: "",
      target_path: "",
      goals: "",
    });

    expect(parsed.success).toBe(false);
    if (parsed.success) {
      return;
    }

    const errors = parsed.error.flatten().fieldErrors;
    expect(errors.first_name?.[0]).toContain("First name is required");
    expect(errors.birth_year?.[0]).toContain("4-digit birth year");
    expect(errors.position?.[0]).toContain("Choose a position");
    expect(errors.target_path?.[0]).toContain("Path you are considering is required");
  });

  // Validates GPA accepts blank optional values but rejects impossible or non-numeric academic entries.
  it("rejects GPA values outside the allowed range", () => {
    expect(playerProfileFormSchema.safeParse({ ...validProfileInput, gpa: "" }).success).toBe(true);
    expect(playerProfileFormSchema.safeParse({ ...validProfileInput, gpa: "-0.1" }).success).toBe(false);
    expect(playerProfileFormSchema.safeParse({ ...validProfileInput, gpa: "5.1" }).success).toBe(false);
    expect(playerProfileFormSchema.safeParse({ ...validProfileInput, gpa: "honors" }).success).toBe(false);
  });

  // Validates public profile links are URL-only and disallow non-HTTP schemes.
  it("rejects invalid player profile and video URLs", () => {
    expect(
      playerProfileFormSchema.safeParse({
        ...validProfileInput,
        video_links_text: "https://example.com/video\nnot-a-url",
      }).success,
    ).toBe(false);
    expect(
      playerProfileFormSchema.safeParse({
        ...validProfileInput,
        elite_prospects_url: "ftp://example.com/profile",
      }).success,
    ).toBe(false);
    expect(
      playerProfileFormSchema.safeParse({
        ...validProfileInput,
        myhockey_url: "javascript:alert(1)",
      }).success,
    ).toBe(false);
  });

  // Validates optional fields normalize to null and an empty video textarea becomes an empty link list.
  it("normalizes optional blank profile fields", () => {
    const parsed = playerProfileFormSchema.parse({
      ...validProfileInput,
      last_name: " ",
      hometown: "",
      gpa: "",
      video_links_text: "",
      elite_prospects_url: "",
      myhockey_url: "",
      coach_reference_name: "",
      coach_reference_contact: "",
    });

    expect(parsed.last_name).toBeNull();
    expect(parsed.hometown).toBeNull();
    expect(parsed.gpa).toBeNull();
    expect(parsed.video_links_text).toEqual([]);
    expect(parsed.elite_prospects_url).toBeNull();
  });

  // Validates the form-data reader ignores non-string fields and preserves the exact input names the form submits.
  it("reads player profile FormData by field name", () => {
    const formData = makeFormData(validProfileInput);

    expect(readPlayerProfileFormData(formData)).toMatchObject({
      first_name: validProfileInput.first_name,
      target_path: validProfileInput.target_path,
      video_links_text: validProfileInput.video_links_text,
    });
  });

  // Validates malformed database rows are normalized without crashing the profile sidebar.
  it("normalizes profile rows and filters invalid video link values", () => {
    const profile = normalizePlayerProfile({
      ...makePlayerProfile(),
      first_name: "",
      video_links: ["https://example.com/one", 42, null],
    });

    expect(profile?.first_name).toBeNull();
    expect(profile?.video_links).toEqual(["https://example.com/one"]);
  });

  // Validates completeness distinguishes required missing fields from optional profile polish.
  it("computes completeness for empty and complete profiles", () => {
    const empty = getPlayerProfileCompleteness(null);
    const complete = getPlayerProfileCompleteness(makePlayerProfile());

    expect(empty.status).toBe("Not started");
    expect(empty.requiredCompleted).toBe(0);
    expect(complete.status).toBe("Complete");
    expect(complete.requiredCompleted).toBe(complete.requiredTotal);
  });
});
