import { describe, expect, it } from "vitest";

import {
  buildMainPlanWrite,
  buildPlanPathInsert,
  buildPlanPathUpdate,
  defaultMainPlanTitle,
  defaultPlanPathExamples,
  groupTargetsByConnectedPath,
  mainPlanFormSchema,
  normalizeMainPlan,
  normalizePlanPath,
  planPathFormSchema,
  readMainPlanFormData,
  readPlanPathFormData,
} from "@/lib/my-plan";
import { makeFormData, makeTarget, pathId, planId, userId } from "@/tests/helpers/recruit-fixtures";

const validMainPlanInput = {
  title: " 2026-27 recruiting plan ",
  season: "2026-27",
  pathway_goal: "Compare junior and college options.",
  short_term_goal: "Research three schools this month.",
  long_term_goal: "Keep academics and development aligned.",
  notes: "Review monthly.",
};

const validPathInput = {
  title: " College Hockey Path ",
  goal: "Compare academic and hockey fit.",
  timeline: "This season",
  why_considering: "Good balance.",
  next_steps: "Build school list\nSave camp dates",
  open_questions: "Which division fits?",
};

describe("Recruitment plan and pathway domain rules", () => {
  // Validates a family plan trims text, preserves optional planning fields, and writes authenticated ownership.
  it("creates a main plan write from valid inputs", () => {
    const parsed = mainPlanFormSchema.parse(validMainPlanInput);

    expect(parsed.title).toBe("2026-27 recruiting plan");
    expect(buildMainPlanWrite(userId, parsed)).toEqual({
      user_id: userId,
      title: "2026-27 recruiting plan",
      season: "2026-27",
      pathway_goal: "Compare junior and college options.",
      short_term_goal: "Research three schools this month.",
      long_term_goal: "Keep academics and development aligned.",
      notes: "Review monthly.",
      status: "active",
      is_main: true,
    });
  });

  // Validates the main plan cannot be saved without its required plan name.
  it("returns a validation error when plan name is missing", () => {
    const parsed = mainPlanFormSchema.safeParse({ ...validMainPlanInput, title: " " });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.flatten().fieldErrors.title?.[0]).toContain("Plan name is required");
    }
  });

  // Validates pathway creation stores plan ownership, sort order, and the selected route fields.
  it("creates a pathway insert payload for a selected route", () => {
    const parsed = planPathFormSchema.parse(validPathInput);

    expect(buildPlanPathInsert(userId, planId, parsed, 2)).toMatchObject({
      user_id: userId,
      plan_id: planId,
      title: "College Hockey Path",
      goal: "Compare academic and hockey fit.",
      sort_order: 2,
    });
  });

  // Validates unsupported or empty pathway definitions fail before persistence.
  it("returns validation errors for unsupported empty pathway data", () => {
    const parsed = planPathFormSchema.safeParse({
      ...validPathInput,
      title: "",
      goal: "",
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      expect(errors.title?.[0]).toContain("Path name is required");
      expect(errors.goal?.[0]).toContain("What this path is for is required");
    }
  });

  // Validates pathway updates only expose mutable fields, leaving user and plan ownership to the server action filters.
  it("builds a pathway update without ownership fields", () => {
    const parsed = planPathFormSchema.parse(validPathInput);

    expect(buildPlanPathUpdate(parsed)).toEqual({
      title: "College Hockey Path",
      goal: "Compare academic and hockey fit.",
      timeline: "This season",
      why_considering: "Good balance.",
      next_steps: "Build school list\nSave camp dates",
      open_questions: "Which division fits?",
    });
  });

  // Validates FormData readers line up with the server action field names.
  it("reads plan and pathway form data", () => {
    expect(readMainPlanFormData(makeFormData(validMainPlanInput))).toMatchObject({
      title: validMainPlanInput.title,
      season: validMainPlanInput.season,
    });
    expect(readPlanPathFormData(makeFormData(validPathInput))).toMatchObject({
      title: validPathInput.title,
      goal: validPathInput.goal,
    });
  });

  // Validates target grouping reflects pathway changes and keeps unmatched targets visible.
  it("groups targets by connected pathway with a no-path bucket", () => {
    const groups = groupTargetsByConnectedPath([
      makeTarget({ name: "Target C", connected_path: null }),
      makeTarget({ id: "33333333-3333-4333-8333-333333333333", name: "Target A", connected_path: "College Hockey Path" }),
      makeTarget({ id: "44444444-4444-4444-8444-444444444444", name: "Target B", connected_path: "Junior Hockey Path" }),
    ]);

    expect(groups.map((group) => group.connectedPath)).toEqual([
      "College Hockey Path",
      "Junior Hockey Path",
      "No connected path",
    ]);
    expect(groups.find((group) => group.connectedPath === "No connected path")?.targets[0].name).toBe("Target C");
  });

  // Validates malformed plan rows are discarded so views can render empty states instead of broken records.
  it("normalizes valid plan rows and rejects malformed plan rows", () => {
    expect(normalizeMainPlan({ id: planId, user_id: userId, title: "" })).toBeNull();
    expect(normalizePlanPath({ id: pathId, user_id: userId, plan_id: planId, title: "" })).toBeNull();
    expect(
      normalizeMainPlan({
        id: planId,
        user_id: userId,
        title: defaultMainPlanTitle,
        is_main: true,
      })?.title,
    ).toBe(defaultMainPlanTitle);
  });

  // Validates the starter pathway examples include the expected core route options for an empty plan.
  it("ships starter pathway examples for empty plan onboarding", () => {
    expect(defaultPlanPathExamples.map((example) => example.title)).toEqual([
      "Junior Hockey Path",
      "College Hockey Path",
      "Development / Backup Path",
    ]);
  });
});
