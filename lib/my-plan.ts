import { z } from "zod";

import type { Target } from "@/lib/targets";

export const defaultMainPlanTitle = "My Plan";

export const mainPlanSelect = `
  id,
  user_id,
  title,
  season,
  pathway_goal,
  short_term_goal,
  long_term_goal,
  notes,
  status,
  is_main,
  updated_at
`;

export const planPathSelect = `
  id,
  user_id,
  plan_id,
  title,
  goal,
  timeline,
  why_considering,
  next_steps,
  open_questions,
  sort_order,
  updated_at
`;

export type MainPlan = {
  id: string;
  user_id: string;
  title: string;
  season: string | null;
  pathway_goal: string | null;
  short_term_goal: string | null;
  long_term_goal: string | null;
  notes: string | null;
  status: string;
  is_main: boolean;
  updated_at: string | null;
};

export type PlanPath = {
  id: string;
  user_id: string;
  plan_id: string;
  title: string;
  goal: string | null;
  timeline: string | null;
  why_considering: string | null;
  next_steps: string | null;
  open_questions: string | null;
  sort_order: number;
  updated_at: string | null;
};

export type ConnectedTargetGroup = {
  connectedPath: string;
  targets: Target[];
};

export type PlanPathTemplate = {
  title: string;
  goal: string;
  timeline: string;
  why_considering: string;
  next_steps: string;
  open_questions: string;
};

export const defaultPlanPathExamples: PlanPathTemplate[] = [
  {
    title: "Junior Hockey Path",
    goal: "Compare junior options that could support the player's development, school plan, and family schedule.",
    timeline: "This season and next offseason",
    why_considering:
      "Junior hockey may be one option if the player needs older competition, more time, or a different development setting.",
    next_steps:
      "List teams or leagues to research\nReview roster age mix, cost, travel, and school fit\nSave questions for coaches or program staff",
    open_questions:
      "What level is the best development fit right now?\nHow would school, billet, travel, and cost work?\nWhat would the player need ready before conversations?",
  },
  {
    title: "College Hockey Path",
    goal: "Keep college options organized while the family researches academic, hockey, and financial fit.",
    timeline: "Longer-term path",
    why_considering:
      "College hockey can be part of the long-term plan, but the family still needs to compare schools, teams, academics, and timing.",
    next_steps:
      "Build an initial school list\nKeep transcript, video, and player profile current\nTrack camps, visits, and application dates",
    open_questions:
      "Which schools fit academically and socially?\nWhat roster needs should the family research?\nWhat dates or materials should be tracked?",
  },
  {
    title: "Development / Backup Path",
    goal: "Keep practical backup options visible so the player has next steps even if the first path changes.",
    timeline: "Review every 30 to 60 days",
    why_considering:
      "A backup path helps the family compare options without overcommitting to one route too early.",
    next_steps:
      "Identify local or regional development options\nTrack tryout, camp, and showcase dates\nReview training, school, and budget fit",
    open_questions:
      "Which option keeps the player developing?\nWhat is the cost and travel load?\nWhen should the family revisit this path?",
  },
];

function requiredText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);
}

function optionalText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .transform((value) => (value.length > 0 ? value : null));
}

export const mainPlanFormSchema = z.object({
  title: requiredText("Plan name", 120),
  season: optionalText("Season", 80),
  pathway_goal: optionalText("Main focus", 800),
  short_term_goal: optionalText("Short-term goal", 1000),
  long_term_goal: optionalText("Long-term goal", 1000),
  notes: optionalText("Notes", 2000),
});

export const planPathFormSchema = z.object({
  title: requiredText("Path title", 120),
  goal: requiredText("Goal", 800),
  timeline: optionalText("Timeline", 200),
  why_considering: optionalText("Why considering", 1200),
  next_steps: optionalText("Next steps", 2000),
  open_questions: optionalText("Open questions", 2000),
});

export const planIdSchema = z.object({
  id: z.string().uuid("Plan id is invalid."),
});

export const planPathIdSchema = z.object({
  id: z.string().uuid("Path id is invalid."),
});

export type MainPlanFormFieldName = keyof z.input<typeof mainPlanFormSchema>;
export type PlanPathFormFieldName = keyof z.input<typeof planPathFormSchema>;
export type MainPlanFormData = z.infer<typeof mainPlanFormSchema>;
export type PlanPathFormData = z.infer<typeof planPathFormSchema>;

export function readMainPlanFormData(formData: FormData) {
  function read(name: MainPlanFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    title: read("title"),
    season: read("season"),
    pathway_goal: read("pathway_goal"),
    short_term_goal: read("short_term_goal"),
    long_term_goal: read("long_term_goal"),
    notes: read("notes"),
  };
}

export function readPlanPathFormData(formData: FormData) {
  function read(name: PlanPathFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    title: read("title"),
    goal: read("goal"),
    timeline: read("timeline"),
    why_considering: read("why_considering"),
    next_steps: read("next_steps"),
    open_questions: read("open_questions"),
  };
}

export function buildMainPlanWrite(userId: string, data: MainPlanFormData) {
  return {
    user_id: userId,
    title: data.title,
    season: data.season,
    pathway_goal: data.pathway_goal,
    short_term_goal: data.short_term_goal,
    long_term_goal: data.long_term_goal,
    notes: data.notes,
    status: "active",
    is_main: true,
  };
}

export function buildPlanPathInsert(
  userId: string,
  planId: string,
  data: PlanPathFormData,
  sortOrder: number,
) {
  return {
    user_id: userId,
    plan_id: planId,
    title: data.title,
    goal: data.goal,
    timeline: data.timeline,
    why_considering: data.why_considering,
    next_steps: data.next_steps,
    open_questions: data.open_questions,
    sort_order: sortOrder,
  };
}

export function buildPlanPathUpdate(data: PlanPathFormData) {
  return {
    title: data.title,
    goal: data.goal,
    timeline: data.timeline,
    why_considering: data.why_considering,
    next_steps: data.next_steps,
    open_questions: data.open_questions,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function normalizeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function normalizeMainPlan(value: unknown): MainPlan | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<MainPlan>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const title = normalizeText(row.title);

  if (!id || !userId || !title) {
    return null;
  }

  return {
    id,
    user_id: userId,
    title,
    season: normalizeText(row.season),
    pathway_goal: normalizeText(row.pathway_goal),
    short_term_goal: normalizeText(row.short_term_goal),
    long_term_goal: normalizeText(row.long_term_goal),
    notes: normalizeText(row.notes),
    status: normalizeText(row.status) ?? "active",
    is_main: normalizeBoolean(row.is_main),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizePlanPath(value: unknown): PlanPath | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<PlanPath>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const planId = normalizeText(row.plan_id);
  const title = normalizeText(row.title);

  if (!id || !userId || !planId || !title) {
    return null;
  }

  return {
    id,
    user_id: userId,
    plan_id: planId,
    title,
    goal: normalizeText(row.goal),
    timeline: normalizeText(row.timeline),
    why_considering: normalizeText(row.why_considering),
    next_steps: normalizeText(row.next_steps),
    open_questions: normalizeText(row.open_questions),
    sort_order: normalizeNumber(row.sort_order),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizePlanPaths(value: unknown): PlanPath[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const path = normalizePlanPath(row);
    return path ? [path] : [];
  });
}

export function groupTargetsByConnectedPath(targets: Target[]): ConnectedTargetGroup[] {
  const groups = new Map<string, Target[]>();

  targets.forEach((target) => {
    const connectedPath = target.connected_path ?? "No connected path";
    groups.set(connectedPath, [...(groups.get(connectedPath) ?? []), target]);
  });

  return Array.from(groups.entries())
    .map(([connectedPath, groupTargets]) => ({
      connectedPath,
      targets: groupTargets,
    }))
    .sort((first, second) => first.connectedPath.localeCompare(second.connectedPath));
}
