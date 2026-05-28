import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSupabaseMock, hasFilter } from "@/tests/helpers/mock-supabase";
import { makeFormData, pathId, planId, userId } from "@/tests/helpers/recruit-fixtures";

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

function mainPlanForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    title: "2026-27 recruiting plan",
    season: "2026-27",
    pathway_goal: "Compare junior and college options.",
    short_term_goal: "Research three schools this month.",
    long_term_goal: "Keep academics and development aligned.",
    notes: "Review monthly.",
    ...overrides,
  });
}

function pathForm(overrides: Record<string, string> = {}) {
  return makeFormData({
    title: "College Hockey Path",
    goal: "Compare academic and hockey fit.",
    timeline: "This season",
    why_considering: "Good balance.",
    next_steps: "Build school list",
    open_questions: "Which divisions fit?",
    ...overrides,
  });
}

describe("My Plan server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Validates the main plan action returns Zod field errors before auth and persistence.
  it("rejects a main plan without a plan name before authentication", async () => {
    const { saveMainPlanAction } = await import("@/app/my-plan/actions");

    const result = await saveMainPlanAction({ message: "" }, mainPlanForm({ title: "" }));

    expect(result.message).toBe("Please fill in the highlighted fields.");
    expect(result.fieldErrors?.title?.[0]).toContain("Plan name is required");
    expect(mocks.requireUser).not.toHaveBeenCalled();
  });

  // Validates editing the current main plan filters by plan ID, user ID, and main-plan flag.
  it("updates the authenticated user's existing main plan", async () => {
    const supabase = createSupabaseMock({
      plans: { update: { data: { id: planId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { saveMainPlanAction } = await import("@/app/my-plan/actions");

    const result = await saveMainPlanAction({ message: "" }, mainPlanForm({ id: planId }));

    const update = supabase.operations.find((operation) => operation.table === "plans" && operation.op === "update");
    expect(result.success).toBe(true);
    expect(hasFilter(update, "id", planId)).toBe(true);
    expect(hasFilter(update, "user_id", userId)).toBe(true);
    expect(hasFilter(update, "is_main", true)).toBe(true);
  });

  // Validates creating a path finds the main plan, counts existing paths, and inserts with sort order.
  it("creates a pathway under the authenticated user's main plan", async () => {
    const supabase = createSupabaseMock({
      plans: { maybeSingle: { data: { id: planId }, error: null } },
      plan_paths: { count: { count: 2, error: null }, insert: { error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { createPlanPathAction } = await import("@/app/my-plan/actions");

    const result = await createPlanPathAction({ message: "" }, pathForm());

    const insert = supabase.operations.find((operation) => operation.table === "plan_paths" && operation.op === "insert");
    expect(result.success).toBe(true);
    expect(insert?.payload).toMatchObject({
      user_id: userId,
      plan_id: planId,
      title: "College Hockey Path",
      sort_order: 2,
    });
  });

  // Validates empty or unsupported path data fails before finding or creating a main plan.
  it("rejects invalid pathway data before persistence", async () => {
    const { createPlanPathAction } = await import("@/app/my-plan/actions");

    const result = await createPlanPathAction({ message: "" }, pathForm({ title: "", goal: "" }));

    expect(result.fieldErrors?.title?.[0]).toContain("Path name is required");
    expect(result.fieldErrors?.goal?.[0]).toContain("What this path is for is required");
    expect(mocks.requireUser).not.toHaveBeenCalled();
  });

  // Validates pathway updates are scoped to the authenticated user and selected path ID.
  it("updates only the authenticated user's pathway", async () => {
    const supabase = createSupabaseMock({
      plan_paths: { update: { data: { id: pathId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { updatePlanPathAction } = await import("@/app/my-plan/actions");

    const result = await updatePlanPathAction({ message: "" }, pathForm({ id: pathId, timeline: "Updated monthly" }));

    const update = supabase.operations.find((operation) => operation.table === "plan_paths" && operation.op === "update");
    expect(result.success).toBe(true);
    expect(hasFilter(update, "id", pathId)).toBe(true);
    expect(hasFilter(update, "user_id", userId)).toBe(true);
    expect(update?.payload).toMatchObject({ timeline: "Updated monthly" });
  });

  // Validates pathway deletion is scoped by path ID and user ID.
  it("deletes only the authenticated user's pathway", async () => {
    const supabase = createSupabaseMock({
      plan_paths: { delete: { data: { id: pathId }, error: null } },
    });
    mocks.createClient.mockResolvedValue(supabase.client);
    const { deletePlanPathAction } = await import("@/app/my-plan/actions");

    const result = await deletePlanPathAction({ message: "" }, makeFormData({ id: pathId }));

    const deletion = supabase.operations.find((operation) => operation.table === "plan_paths" && operation.op === "delete");
    expect(result.success).toBe(true);
    expect(hasFilter(deletion, "id", pathId)).toBe(true);
    expect(hasFilter(deletion, "user_id", userId)).toBe(true);
  });
});
