import { describe, expect, it } from "vitest";

import {
  buildContactInsert,
  buildContactUpdate,
  contactFormSchema,
  normalizeContact,
  readContactFormData,
} from "@/lib/contacts";
import {
  buildEventInsert,
  compareRecruitEvents,
  eventFormSchema,
  formatEventCost,
  formatEventDateRange,
  normalizeEvent,
  readEventFormData,
} from "@/lib/events";
import {
  buildTargetInsert,
  buildTargetUpdate,
  hasProTargets,
  normalizeSubscription,
  normalizeTarget,
  readTargetFormData,
  targetFormSchema,
} from "@/lib/targets";
import {
  contactId,
  makeContact,
  makeEvent,
  makeFormData,
  makeTarget,
  targetId,
  userId,
} from "@/tests/helpers/recruit-fixtures";

const validTargetInput = {
  name: " Northwood School ",
  target_type: "school",
  level: "Prep",
  location: "Lake Placid, NY",
  connected_path: "College Hockey Path",
  status: "Researching",
  next_step: "Review roster and admissions dates.",
  follow_up_date: "2026-06-15",
  priority: "High",
  website_url: "https://example.com",
  roster_url: "https://example.com/roster",
  camp_url: "https://example.com/camp",
  notes: "Strong school fit.",
  why_considering: "Academics and hockey fit.",
  concerns: "Cost needs review.",
};

const validContactInput = {
  target_id: targetId,
  name: " Coach Taylor ",
  role: "Head coach",
  email: " coach.taylor@example.com ",
  phone: "555-0101",
  source_url: "https://example.com/staff",
  notes: "Prefers concise email.",
};

const validEventInput = {
  target_id: targetId,
  title: " Prospect camp ",
  event_type: "camp",
  start_date: "2026-07-10",
  end_date: "2026-07-12",
  registration_deadline: "2026-06-20",
  cost: "450.50",
  location: "Lake Placid, NY",
  url: "https://example.com/register",
  notes: "Bring schedule.",
  status: "Planned",
};

describe("Target teams, schools, coaches, and events", () => {
  // Validates a complete target school entry accepts all tracked fields and writes authenticated ownership.
  it("creates a target school insert from all fields", () => {
    const parsed = targetFormSchema.parse(validTargetInput);

    expect(parsed.name).toBe("Northwood School");
    expect(buildTargetInsert(userId, parsed)).toMatchObject({
      user_id: userId,
      name: "Northwood School",
      target_type: "school",
      status: "Researching",
      follow_up_date: "2026-06-15",
      priority: "High",
    });
  });

  // Validates target updates can move a school through the board statuses without changing ownership.
  it("builds target updates for status changes", () => {
    const interested = targetFormSchema.parse({
      ...validTargetInput,
      status: "Interested / Next Step",
    });
    const contacted = targetFormSchema.parse({
      ...validTargetInput,
      status: "Contacted",
    });

    expect(buildTargetUpdate(interested)).not.toHaveProperty("user_id");
    expect(buildTargetUpdate(contacted).status).toBe("Contacted");
  });

  // Validates blank target names and unsupported select values are rejected before persistence.
  it("rejects missing target names and unsupported target values", () => {
    const parsed = targetFormSchema.safeParse({
      ...validTargetInput,
      name: "",
      target_type: "academy",
      status: "Offer Received",
      priority: "Urgent",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      expect(errors.name?.[0]).toContain("Target name is required");
      expect(errors.target_type?.[0]).toContain("Choose what kind of target");
      expect(errors.status?.[0]).toContain("Choose the current stage");
      expect(errors.priority?.[0]).toBeDefined();
    }
  });

  // Validates optional target fields become null and URL/date fields block malformed values.
  it("normalizes optional target fields and rejects invalid target URLs", () => {
    const parsed = targetFormSchema.parse({
      ...validTargetInput,
      level: "",
      location: "",
      connected_path: "",
      follow_up_date: "",
      priority: "",
      website_url: "",
      roster_url: "",
      camp_url: "",
    });

    expect(parsed.level).toBeNull();
    expect(parsed.priority).toBeNull();
    expect(parsed.website_url).toBeNull();
    expect(targetFormSchema.safeParse({ ...validTargetInput, website_url: "ftp://example.com" }).success).toBe(false);
    expect(targetFormSchema.safeParse({ ...validTargetInput, follow_up_date: "06/15/2026" }).success).toBe(false);
  });

  // Validates duplicate target names are not blocked by schema alone, making uniqueness a product/database rule.
  it("allows duplicate target names at the validation layer", () => {
    expect(targetFormSchema.safeParse(validTargetInput).success).toBe(true);
    expect(targetFormSchema.safeParse({ ...validTargetInput, status: "Contacted" }).success).toBe(true);
  });

  // Validates target normalization keeps unsupported database enum values from breaking the board.
  it("normalizes malformed target rows to safe defaults", () => {
    const target = normalizeTarget({
      ...makeTarget(),
      target_type: "unknown",
      status: "Offer Received",
      priority: "Urgent",
    });

    expect(target?.target_type).toBe("other");
    expect(target?.status).toBe("Researching");
    expect(target?.priority).toBeNull();
  });

  // Validates subscription normalization and Pro detection for quota-sensitive target flows.
  it("detects active Pro subscriptions for quota checks", () => {
    expect(hasProTargets(normalizeSubscription({ plan_name: "pro", status: "active" }))).toBe(true);
    expect(hasProTargets(normalizeSubscription({ plan_name: "pro", status: "past_due" }))).toBe(false);
    expect(hasProTargets(normalizeSubscription(null))).toBe(false);
  });

  // Validates a coach can be tied to a target school with email, phone, source, and notes.
  it("creates a coach contact insert tied to a school", () => {
    const parsed = contactFormSchema.parse(validContactInput);

    expect(buildContactInsert(userId, parsed)).toEqual({
      user_id: userId,
      target_id: targetId,
      name: "Coach Taylor",
      role: "Head coach",
      email: "coach.taylor@example.com",
      phone: "555-0101",
      source_url: "https://example.com/staff",
      notes: "Prefers concise email.",
    });
  });

  // Validates coach contact edits only include mutable fields and can clear optional target linkage.
  it("builds coach contact updates and clears optional fields", () => {
    const parsed = contactFormSchema.parse({
      ...validContactInput,
      target_id: "",
      phone: "",
      source_url: "",
      notes: "",
    });

    expect(buildContactUpdate(parsed)).toMatchObject({
      target_id: null,
      phone: null,
      source_url: null,
      notes: null,
    });
  });

  // Validates invalid contact emails and malformed target IDs fail validation.
  it("rejects invalid coach contact email and target IDs", () => {
    const parsed = contactFormSchema.safeParse({
      ...validContactInput,
      target_id: "not-a-uuid",
      email: "coach-at-example",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      expect(errors.target_id?.[0]).toContain("valid target");
      expect(errors.email?.[0]).toContain("valid email");
    }
  });

  // Validates contact normalization preserves saved coach details while dropping broken rows.
  it("normalizes coach contacts and rejects rows without required identity", () => {
    expect(normalizeContact(makeContact())?.email).toBe("coach.taylor@example.com");
    expect(normalizeContact({ id: contactId, user_id: userId, name: "" })).toBeNull();
  });

  // Validates a camp or date can be saved with all fields, including cost and target linkage.
  it("creates an event insert with all tracked date fields", () => {
    const parsed = eventFormSchema.parse(validEventInput);

    expect(buildEventInsert(userId, parsed)).toMatchObject({
      user_id: userId,
      target_id: targetId,
      title: "Prospect camp",
      event_type: "camp",
      start_date: "2026-07-10",
      end_date: "2026-07-12",
      registration_deadline: "2026-06-20",
      cost: 450.5,
      status: "Planned",
    });
  });

  // Validates event date ranges and costs render consistently for roadmap and Today cards.
  it("formats event dates and costs for display", () => {
    expect(formatEventDateRange(makeEvent())).toBe("Jul 10, 2026 to Jul 12, 2026");
    expect(formatEventDateRange(makeEvent({ end_date: "2026-07-10" }))).toBe("Jul 10, 2026");
    expect(formatEventCost(450)).toBe("$450");
    expect(formatEventCost(450.5)).toBe("$450.50");
    expect(formatEventCost(null)).toBeNull();
  });

  // Validates invalid event dates, end-before-start ranges, and negative costs are rejected.
  it("rejects invalid event dates and negative costs", () => {
    expect(eventFormSchema.safeParse({ ...validEventInput, start_date: "" }).success).toBe(false);
    expect(
      eventFormSchema.safeParse({
        ...validEventInput,
        start_date: "2026-07-12",
        end_date: "2026-07-10",
      }).success,
    ).toBe(false);
    expect(eventFormSchema.safeParse({ ...validEventInput, cost: "-1" }).success).toBe(false);
    expect(eventFormSchema.safeParse({ ...validEventInput, url: "javascript:bad()" }).success).toBe(false);
  });

  // Validates event sorting uses date first and title second for stable Today and Targets lists.
  it("sorts events by start date and title", () => {
    const events = [
      makeEvent({ id: "33333333-3333-4333-8333-333333333333", title: "B event", start_date: "2026-07-11" }),
      makeEvent({ id: "44444444-4444-4444-8444-444444444444", title: "A event", start_date: "2026-07-10" }),
      makeEvent({ id: "55555555-5555-4555-8555-555555555555", title: "C event", start_date: "2026-07-10" }),
    ].sort(compareRecruitEvents);

    expect(events.map((event) => event.title)).toEqual(["A event", "C event", "B event"]);
  });

  // Validates event normalization makes unsupported database enum values safe for rendering.
  it("normalizes event rows to safe defaults", () => {
    const event = normalizeEvent({
      ...makeEvent(),
      event_type: "clinic",
      status: "completed",
      cost: "125",
    });

    expect(event?.event_type).toBe("other");
    expect(event?.status).toBe("Completed");
    expect(event?.cost).toBe(125);
  });

  // Validates target, contact, and event FormData readers match the client form names.
  it("reads target, contact, and event FormData", () => {
    expect(readTargetFormData(makeFormData(validTargetInput))).toMatchObject({
      name: validTargetInput.name,
      status: validTargetInput.status,
    });
    expect(readContactFormData(makeFormData(validContactInput))).toMatchObject({
      name: validContactInput.name,
      email: validContactInput.email,
    });
    expect(readEventFormData(makeFormData(validEventInput))).toMatchObject({
      title: validEventInput.title,
      event_type: validEventInput.event_type,
    });
  });
});
