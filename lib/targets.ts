import { z } from "zod";

export const freeTargetLimit = 5;

export const targetTypeOptions = ["team", "school", "camp", "league", "other"] as const;

export const targetTypeLabels: Record<TargetType, string> = {
  team: "Team",
  school: "School",
  camp: "Camp",
  league: "League",
  other: "Other",
};

export const targetStatusOptions = [
  "Researching",
  "Planning to Contact",
  "Contacted",
  "Interested / Next Step",
  "Camp or Tryout",
  "Not a Fit",
] as const;

export const targetPriorityOptions = ["High", "Medium", "Low"] as const;

export const targetSelect = `
  id,
  user_id,
  name,
  target_type,
  level,
  location,
  connected_path,
  status,
  next_step,
  follow_up_date,
  priority,
  website_url,
  roster_url,
  camp_url,
  notes,
  why_considering,
  concerns,
  created_at,
  updated_at
`;

export type TargetType = (typeof targetTypeOptions)[number];
export type TargetStatus = (typeof targetStatusOptions)[number];
export type TargetPriority = (typeof targetPriorityOptions)[number];

export type Target = {
  id: string;
  user_id: string;
  name: string;
  target_type: TargetType;
  level: string | null;
  location: string | null;
  connected_path: string | null;
  status: TargetStatus;
  next_step: string | null;
  follow_up_date: string | null;
  priority: TargetPriority | null;
  website_url: string | null;
  roster_url: string | null;
  camp_url: string | null;
  notes: string | null;
  why_considering: string | null;
  concerns: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TargetFormFieldName = keyof z.input<typeof targetFormSchema>;

export type TargetSubscription = {
  plan_name: string | null;
  status: string | null;
};

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

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function optionalUrl(label: string) {
  return z
    .string()
    .trim()
    .max(240, `${label} must be 240 characters or fewer.`)
    .refine((value) => value.length === 0 || isValidUrl(value), `${label} must be a valid URL.`)
    .transform((value) => (value.length > 0 ? value : null));
}

function optionalDate(label: string) {
  return z
    .string()
    .trim()
    .refine((value) => value.length === 0 || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: `${label} must be a valid date.`,
    })
    .transform((value) => (value.length > 0 ? value : null));
}

export const targetFormSchema = z.object({
  name: requiredText("Name", 120),
  target_type: z.enum(targetTypeOptions, { message: "Choose a target type." }),
  level: optionalText("Level", 80),
  location: optionalText("Location", 160),
  connected_path: optionalText("Connected path", 160),
  status: z.enum(targetStatusOptions, { message: "Choose a board column." }),
  next_step: optionalText("Next step", 400),
  follow_up_date: optionalDate("Follow-up date"),
  priority: z
    .union([z.enum(targetPriorityOptions), z.literal("")])
    .transform((value) => (value.length > 0 ? value : null)),
  website_url: optionalUrl("Website URL"),
  roster_url: optionalUrl("Roster URL"),
  camp_url: optionalUrl("Camp URL"),
  notes: optionalText("Notes", 2000),
  why_considering: optionalText("Why considering", 2000),
  concerns: optionalText("Concerns", 2000),
});

export const targetIdSchema = z.object({
  id: z.string().uuid("Target id is invalid."),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;

export function readTargetFormData(formData: FormData) {
  function read(name: TargetFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    name: read("name"),
    target_type: read("target_type"),
    level: read("level"),
    location: read("location"),
    connected_path: read("connected_path"),
    status: read("status") || "Researching",
    next_step: read("next_step"),
    follow_up_date: read("follow_up_date"),
    priority: read("priority"),
    website_url: read("website_url"),
    roster_url: read("roster_url"),
    camp_url: read("camp_url"),
    notes: read("notes"),
    why_considering: read("why_considering"),
    concerns: read("concerns"),
  };
}

export function buildTargetInsert(userId: string, data: TargetFormData) {
  return {
    user_id: userId,
    name: data.name,
    target_type: data.target_type,
    level: data.level,
    location: data.location,
    connected_path: data.connected_path,
    status: data.status,
    next_step: data.next_step,
    follow_up_date: data.follow_up_date,
    priority: data.priority,
    website_url: data.website_url,
    roster_url: data.roster_url,
    camp_url: data.camp_url,
    notes: data.notes,
    why_considering: data.why_considering,
    concerns: data.concerns,
  };
}

export function buildTargetUpdate(data: TargetFormData) {
  return {
    name: data.name,
    target_type: data.target_type,
    level: data.level,
    location: data.location,
    connected_path: data.connected_path,
    status: data.status,
    next_step: data.next_step,
    follow_up_date: data.follow_up_date,
    priority: data.priority,
    website_url: data.website_url,
    roster_url: data.roster_url,
    camp_url: data.camp_url,
    notes: data.notes,
    why_considering: data.why_considering,
    concerns: data.concerns,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeTargetType(value: unknown): TargetType {
  return typeof value === "string" && targetTypeOptions.includes(value as TargetType)
    ? (value as TargetType)
    : "other";
}

function normalizeStatus(value: unknown): TargetStatus {
  return typeof value === "string" && targetStatusOptions.includes(value as TargetStatus)
    ? (value as TargetStatus)
    : "Researching";
}

function normalizePriority(value: unknown): TargetPriority | null {
  return typeof value === "string" && targetPriorityOptions.includes(value as TargetPriority)
    ? (value as TargetPriority)
    : null;
}

export function normalizeTarget(value: unknown): Target | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<Target>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const name = normalizeText(row.name);

  if (!id || !userId || !name) {
    return null;
  }

  return {
    id,
    user_id: userId,
    name,
    target_type: normalizeTargetType(row.target_type),
    level: normalizeText(row.level),
    location: normalizeText(row.location),
    connected_path: normalizeText(row.connected_path),
    status: normalizeStatus(row.status),
    next_step: normalizeText(row.next_step),
    follow_up_date: normalizeText(row.follow_up_date),
    priority: normalizePriority(row.priority),
    website_url: normalizeText(row.website_url),
    roster_url: normalizeText(row.roster_url),
    camp_url: normalizeText(row.camp_url),
    notes: normalizeText(row.notes),
    why_considering: normalizeText(row.why_considering),
    concerns: normalizeText(row.concerns),
    created_at: normalizeText(row.created_at),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizeTargets(value: unknown): Target[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const target = normalizeTarget(row);
    return target ? [target] : [];
  });
}

export function normalizeSubscription(value: unknown): TargetSubscription {
  if (!value || typeof value !== "object") {
    return {
      plan_name: "free",
      status: "active",
    };
  }

  const row = value as Partial<TargetSubscription>;

  return {
    plan_name: normalizeText(row.plan_name) ?? "free",
    status: normalizeText(row.status) ?? "active",
  };
}

export function hasProTargets(subscription: TargetSubscription) {
  return (
    subscription.plan_name?.toLowerCase() === "pro" &&
    subscription.status?.toLowerCase() === "active"
  );
}
