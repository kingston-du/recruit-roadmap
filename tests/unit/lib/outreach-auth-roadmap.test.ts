import { describe, expect, it } from "vitest";

import { getSafeRedirectPath } from "@/lib/auth";
import { roadmapSections } from "@/lib/mock-data";
import {
  buildOutreachLogInsert,
  buildOutreachLogUpdate,
  compareFollowUpLogs,
  compareOutreachLogs,
  freeOutreachLogLimit,
  normalizeOutreachLog,
  outreachLogFormSchema,
  readOutreachLogFormData,
} from "@/lib/outreach";
import {
  contactId,
  makeFormData,
  makeOutreachLog,
  targetId,
  userId,
} from "@/tests/helpers/recruit-fixtures";

const validOutreachInput = {
  target_id: targetId,
  contact_id: contactId,
  outreach_type: "email",
  direction: "sent",
  outreach_date: "2026-05-20",
  summary: "Sent intro email with player profile.",
  outcome: "Waiting on response.",
  next_follow_up_date: "2026-06-03",
};

describe("Outreach history, auth redirects, and roadmap data", () => {
  // Validates outreach history is Pro-only under the current freemium model.
  it("keeps free outreach history quota at zero", () => {
    expect(freeOutreachLogLimit).toBe(0);
  });

  // Validates a Pro outreach log write ties the entry to the authenticated user, target, and optional coach.
  it("creates outreach log insert and update payloads", () => {
    const parsed = outreachLogFormSchema.parse(validOutreachInput);

    expect(buildOutreachLogInsert(userId, parsed)).toMatchObject({
      user_id: userId,
      target_id: targetId,
      contact_id: contactId,
      outreach_type: "email",
      direction: "sent",
    });
    expect(buildOutreachLogUpdate(parsed)).not.toHaveProperty("user_id");
  });

  // Validates outreach validation catches missing target, bad contact IDs, and missing summaries.
  it("rejects invalid outreach logs", () => {
    const parsed = outreachLogFormSchema.safeParse({
      ...validOutreachInput,
      target_id: "bad-target",
      contact_id: "bad-contact",
      outreach_date: "",
      summary: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      expect(errors.target_id?.[0]).toContain("valid target");
      expect(errors.contact_id?.[0]).toContain("valid contact");
      expect(errors.summary?.[0]).toContain("What happened is required");
    }
  });

  // Validates blank optional outreach fields normalize to null.
  it("normalizes blank optional outreach fields", () => {
    const parsed = outreachLogFormSchema.parse({
      ...validOutreachInput,
      contact_id: "",
      outcome: "",
      next_follow_up_date: "",
    });

    expect(parsed.contact_id).toBeNull();
    expect(parsed.outcome).toBeNull();
    expect(parsed.next_follow_up_date).toBeNull();
  });

  // Validates outreach sorting shows newest communication first and follow-up reminders earliest first.
  it("sorts outreach logs by recency and follow-up date", () => {
    const older = makeOutreachLog({
      id: "33333333-3333-4333-8333-333333333333",
      outreach_date: "2026-05-18",
      next_follow_up_date: "2026-06-05",
      summary: "Older note",
    });
    const newer = makeOutreachLog({
      id: "44444444-4444-4444-8444-444444444444",
      outreach_date: "2026-05-20",
      next_follow_up_date: "2026-06-01",
      summary: "Newer note",
    });

    expect([older, newer].sort(compareOutreachLogs)[0].summary).toBe("Newer note");
    expect([older, newer].sort(compareFollowUpLogs)[0].summary).toBe("Newer note");
  });

  // Validates outreach row normalization shields the UI from unsupported enum values and malformed rows.
  it("normalizes outreach rows and rejects broken rows", () => {
    const log = normalizeOutreachLog({
      ...makeOutreachLog(),
      outreach_type: "letter",
      direction: "incoming",
    });

    expect(log?.outreach_type).toBe("other");
    expect(log?.direction).toBe("sent");
    expect(normalizeOutreachLog({ id: "bad", user_id: userId })).toBeNull();
  });

  // Validates the outreach form-data reader uses the exact hidden and visible field names.
  it("reads outreach FormData", () => {
    expect(readOutreachLogFormData(makeFormData(validOutreachInput))).toMatchObject({
      target_id: targetId,
      contact_id: contactId,
      summary: validOutreachInput.summary,
    });
  });

  // Validates redirect hardening blocks external and protocol-relative next URLs.
  it("only allows safe internal redirect paths", () => {
    expect(getSafeRedirectPath("/targets")).toBe("/targets");
    expect(getSafeRedirectPath("https://evil.example")).toBe("/today");
    expect(getSafeRedirectPath("//evil.example")).toBe("/today");
    expect(getSafeRedirectPath(null)).toBe("/today");
  });

  // Validates the public roadmap includes core boys hockey pathway stages and rich card details.
  it("includes the expected roadmap stages and junior-to-college options", () => {
    const sectionTitles = roadmapSections.map((section) => section.title);
    const cardNames = roadmapSections.flatMap((section) => section.cards.map((card) => card.name));

    expect(sectionTitles).toContain("Junior Branches");
    expect(cardNames).toEqual(expect.arrayContaining(["USHL", "NAHL", "NCAA D1", "NCAA D3"]));
    expect(roadmapSections.every((section) => section.cards.length > 0)).toBe(true);
    expect(
      roadmapSections.flatMap((section) => section.cards).every((card) => card.whatToResearch.length > 0),
    ).toBe(true);
  });
});
