import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseMock, hasFilter } from "@/tests/helpers/mock-supabase";
import {
  contactId,
  eventId,
  makeFormData,
  outreachLogId,
  targetId,
  userId,
} from "@/tests/helpers/recruit-fixtures";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  requireUser: vi.fn(async () => ({
    id: "11111111-1111-4111-8111-111111111111",
    email: "family@example.com",
  })),
  createClient: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/auth", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/supabase/server", () => ({ createClient: mocks.createClient }));

function targetForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    name: "Northwood School",
    target_type: "school",
    level: "Prep",
    location: "Lake Placid, NY",
    connected_path: "College Hockey Path",
    status: "Researching",
    next_step: "Review roster.",
    follow_up_date: "2026-06-15",
    priority: "High",
    website_url: "https://example.com",
    roster_url: "https://example.com/roster",
    camp_url: "https://example.com/camp",
    notes: "Notes",
    why_considering: "Fit",
    concerns: "Cost",
    ...overrides,
  });
}

function contactForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    target_id: targetId,
    name: "Coach Taylor",
    role: "Head coach",
    email: "coach@example.com",
    phone: "555-0101",
    source_url: "https://example.com/staff",
    notes: "Notes",
    ...overrides,
  });
}

function eventForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    target_id: targetId,
    title: "Prospect camp",
    event_type: "camp",
    start_date: "2026-07-10",
    end_date: "2026-07-12",
    registration_deadline: "2026-06-20",
    cost: "450",
    location: "Lake Placid, NY",
    url: "https://example.com/register",
    notes: "Notes",
    status: "Planned",
    ...overrides,
  });
}

function outreachForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    target_id: targetId,
    contact_id: contactId,
    outreach_type: "email",
    direction: "sent",
    outreach_date: "2026-05-20",
    summary: "Sent intro email.",
    outcome: "Waiting.",
    next_follow_up_date: "2026-06-03",
    ...overrides,
  });
}

describe("Targets server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Validates target validation returns field errors before auth or Supabase writes run.
  it("rejects invalid target creation input before authentication", async () => {
    const { createTargetAction } = await import("@/app/targets/actions");

    const result = await createTargetAction({ message: "" }, targetForm({ name: "" }));

    expect(result.message).toBe("Please fill in the highlighted fields.");
    expect(result.fieldErrors?.name?.[0]).toContain("Target name is required");
    expect(mocks.requireUser).not.toHaveBeenCalled();
  });

  // Validates successful target creation checks quota and inserts with the authenticated user ID.
  it("creates a target for the authenticated user when free quota remains", async () => {
    const supabase = createSupabaseMock({
      subscriptions: { maybeSingle: { data: { plan_name: "free", status: "active" }, error: null } },
      targets: { count: { count: 0, error: null }, insert: { error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createTargetAction } = await import("@/app/targets/actions");

    const result = await createTargetAction({ message: "" }, targetForm());

    expect(result).toEqual({ message: "Target added.", success: true });
    const insert = supabase.operations.find((operation) => operation.table === "targets" && operation.op === "insert");
    expect(insert?.payload).toMatchObject({ user_id: userId, name: "Northwood School" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/targets");
  });

  // Validates free accounts cannot exceed the target quota.
  it("returns an upgrade prompt when free target quota is reached", async () => {
    const supabase = createSupabaseMock({
      subscriptions: { maybeSingle: { data: { plan_name: "free", status: "active" }, error: null } },
      targets: { count: { count: 5, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createTargetAction } = await import("@/app/targets/actions");

    const result = await createTargetAction({ message: "" }, targetForm());

    expect(result.upgradeRequired).toBe(true);
    expect(result.message).toContain("Free accounts can track up to 5 targets");
  });

  // Validates save/network failures from Supabase are converted into a parent-friendly error.
  it("returns a friendly error when target saving fails", async () => {
    const supabase = createSupabaseMock({
      subscriptions: { maybeSingle: { data: { plan_name: "free", status: "active" }, error: null } },
      targets: {
        count: { count: 0, error: null },
        insert: { error: { message: "network request failed" } },
      },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createTargetAction } = await import("@/app/targets/actions");

    const result = await createTargetAction({ message: "" }, targetForm());

    expect(result.success).toBeUndefined();
    expect(result.message).toBe("We could not save the target. Wait a moment and try again.");
  });

  // Validates target updates filter by both target ID and authenticated user ID.
  it("updates only the authenticated user's target row", async () => {
    const supabase = createSupabaseMock({
      targets: { update: { data: { id: targetId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { updateTargetAction } = await import("@/app/targets/actions");

    const result = await updateTargetAction({ message: "" }, targetForm({ id: targetId, status: "Contacted" }));

    const update = supabase.operations.find((operation) => operation.table === "targets" && operation.op === "update");
    expect(result.success).toBe(true);
    expect(hasFilter(update, "id", targetId)).toBe(true);
    expect(hasFilter(update, "user_id", userId)).toBe(true);
    expect(update?.payload).toMatchObject({ status: "Contacted" });
  });

  // Validates target deletion uses the same ownership filters and reports missing rows.
  it("deletes only the authenticated user's target row", async () => {
    const supabase = createSupabaseMock({
      targets: { delete: { data: { id: targetId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { deleteTargetAction } = await import("@/app/targets/actions");

    const result = await deleteTargetAction({ message: "" }, makeFormData({ id: targetId }));

    const deletion = supabase.operations.find((operation) => operation.table === "targets" && operation.op === "delete");
    expect(result.success).toBe(true);
    expect(hasFilter(deletion, "id", targetId)).toBe(true);
    expect(hasFilter(deletion, "user_id", userId)).toBe(true);
  });

  // Validates coach contacts cannot be tied to a target owned by another user.
  it("rejects coach creation for a target not owned by the user", async () => {
    const supabase = createSupabaseMock({
      targets: { maybeSingle: { data: null, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createContactAction } = await import("@/app/targets/actions");

    const result = await createContactAction({ message: "" }, contactForm());

    expect(result.message).toBe("Choose one of your targets or leave the target blank.");
    expect(supabase.operations.some((operation) => operation.table === "contacts")).toBe(false);
  });

  // Validates successful coach contact creation checks target ownership, quota, and writes authenticated ownership.
  it("creates a coach contact for an owned school target", async () => {
    const supabase = createSupabaseMock({
      targets: { maybeSingle: { data: { id: targetId }, error: null } },
      subscriptions: { maybeSingle: { data: { plan_name: "free", status: "active" }, error: null } },
      contacts: { count: { count: 0, error: null }, insert: { error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createContactAction } = await import("@/app/targets/actions");

    const result = await createContactAction({ message: "" }, contactForm());

    const insert = supabase.operations.find((operation) => operation.table === "contacts" && operation.op === "insert");
    expect(result.success).toBe(true);
    expect(insert?.payload).toMatchObject({ user_id: userId, target_id: targetId, email: "coach@example.com" });
  });

  // Validates event creation rejects malformed date ranges before target ownership checks.
  it("rejects invalid event date ranges before persistence", async () => {
    const { createEventAction } = await import("@/app/targets/actions");

    const result = await createEventAction(
      { message: "" },
      eventForm({ start_date: "2026-07-12", end_date: "2026-07-10" }),
    );

    expect(result.fieldErrors?.end_date?.[0]).toContain("End date cannot be before");
    expect(mocks.requireUser).not.toHaveBeenCalled();
  });

  // Validates event updates filter by event ID and authenticated user ID.
  it("updates only the authenticated user's saved event", async () => {
    const supabase = createSupabaseMock({
      targets: { maybeSingle: { data: { id: targetId }, error: null } },
      events: { update: { data: { id: eventId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { updateEventAction } = await import("@/app/targets/actions");

    const result = await updateEventAction({ message: "" }, eventForm({ id: eventId, status: "Registered" }));

    const update = supabase.operations.find((operation) => operation.table === "events" && operation.op === "update");
    expect(result.success).toBe(true);
    expect(hasFilter(update, "id", eventId)).toBe(true);
    expect(hasFilter(update, "user_id", userId)).toBe(true);
  });

  // Validates free users are blocked from creating outreach history after target and contact ownership pass.
  it("blocks outreach history for free users", async () => {
    const supabase = createSupabaseMock({
      targets: { maybeSingle: { data: { id: targetId }, error: null } },
      contacts: { maybeSingle: { data: { id: contactId, target_id: targetId }, error: null } },
      subscriptions: { maybeSingle: { data: { plan_name: "free", status: "active" }, error: null } },
      outreach_logs: { count: { count: 0, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createOutreachLogAction } = await import("@/app/targets/actions");

    const result = await createOutreachLogAction({ message: "" }, outreachForm());

    expect(result.upgradeRequired).toBe(true);
    expect(result.message).toContain("Outreach history is included with Pro");
  });

  // Validates outreach log updates require a contact that belongs to the selected target.
  it("rejects outreach updates when the contact belongs to another target", async () => {
    const supabase = createSupabaseMock({
      targets: { maybeSingle: { data: { id: targetId }, error: null } },
      contacts: { maybeSingle: { data: { id: contactId, target_id: "99999999-9999-4999-8999-999999999999" }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { updateOutreachLogAction } = await import("@/app/targets/actions");

    const result = await updateOutreachLogAction({ message: "" }, outreachForm({ id: outreachLogId }));

    expect(result.message).toBe("Choose a contact saved to this target or leave the contact blank.");
  });
});
