import { z } from "zod";

export const freeOutreachLogLimit = 0;

export const outreachTypeOptions = [
  "email",
  "call",
  "text",
  "in_person",
  "camp",
  "other",
] as const;

export const outreachTypeLabels: Record<OutreachType, string> = {
  email: "Email",
  call: "Call",
  text: "Text",
  in_person: "In person",
  camp: "Camp",
  other: "Other",
};

export const outreachDirectionOptions = ["sent", "received"] as const;

export const outreachDirectionLabels: Record<OutreachDirection, string> = {
  sent: "Sent",
  received: "Received",
};

export const outreachLogSelect = `
  id,
  user_id,
  target_id,
  contact_id,
  outreach_type,
  direction,
  outreach_date,
  summary,
  outcome,
  next_follow_up_date,
  created_at,
  updated_at
`;

export type OutreachType = (typeof outreachTypeOptions)[number];
export type OutreachDirection = (typeof outreachDirectionOptions)[number];

export type OutreachLog = {
  id: string;
  user_id: string;
  target_id: string;
  contact_id: string | null;
  outreach_type: OutreachType;
  direction: OutreachDirection;
  outreach_date: string;
  summary: string;
  outcome: string | null;
  next_follow_up_date: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type OutreachLogFormFieldName = keyof z.input<typeof outreachLogFormSchema>;

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

function requiredDate(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: `${label} must be a valid date.`,
    });
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

export const outreachLogFormSchema = z.object({
  target_id: z.string().uuid("Choose a valid target."),
  contact_id: z
    .union([z.string().uuid("Choose a valid contact."), z.literal("")])
    .transform((value) => (value.length > 0 ? value : null)),
  outreach_type: z.enum(outreachTypeOptions, { message: "Choose an outreach type." }),
  direction: z.enum(outreachDirectionOptions, { message: "Choose a direction." }),
  outreach_date: requiredDate("Outreach date"),
  summary: requiredText("Summary", 2000),
  outcome: optionalText("Outcome", 1000),
  next_follow_up_date: optionalDate("Next follow-up date"),
});

export const outreachLogIdSchema = z.object({
  id: z.string().uuid("Outreach log id is invalid."),
});

export type OutreachLogFormData = z.infer<typeof outreachLogFormSchema>;

export function readOutreachLogFormData(formData: FormData) {
  function read(name: OutreachLogFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    target_id: read("target_id"),
    contact_id: read("contact_id"),
    outreach_type: read("outreach_type") || "email",
    direction: read("direction") || "sent",
    outreach_date: read("outreach_date"),
    summary: read("summary"),
    outcome: read("outcome"),
    next_follow_up_date: read("next_follow_up_date"),
  };
}

export function buildOutreachLogInsert(userId: string, data: OutreachLogFormData) {
  return {
    user_id: userId,
    target_id: data.target_id,
    contact_id: data.contact_id,
    outreach_type: data.outreach_type,
    direction: data.direction,
    outreach_date: data.outreach_date,
    summary: data.summary,
    outcome: data.outcome,
    next_follow_up_date: data.next_follow_up_date,
  };
}

export function buildOutreachLogUpdate(data: OutreachLogFormData) {
  return {
    target_id: data.target_id,
    contact_id: data.contact_id,
    outreach_type: data.outreach_type,
    direction: data.direction,
    outreach_date: data.outreach_date,
    summary: data.summary,
    outcome: data.outcome,
    next_follow_up_date: data.next_follow_up_date,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeOutreachType(value: unknown): OutreachType {
  return typeof value === "string" && outreachTypeOptions.includes(value as OutreachType)
    ? (value as OutreachType)
    : "other";
}

function normalizeDirection(value: unknown): OutreachDirection {
  return typeof value === "string" && outreachDirectionOptions.includes(value as OutreachDirection)
    ? (value as OutreachDirection)
    : "sent";
}

export function normalizeOutreachLog(value: unknown): OutreachLog | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<OutreachLog>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const targetId = normalizeText(row.target_id);
  const outreachDate = normalizeText(row.outreach_date);
  const summary = normalizeText(row.summary);

  if (!id || !userId || !targetId || !outreachDate || !summary) {
    return null;
  }

  return {
    id,
    user_id: userId,
    target_id: targetId,
    contact_id: normalizeText(row.contact_id),
    outreach_type: normalizeOutreachType(row.outreach_type),
    direction: normalizeDirection(row.direction),
    outreach_date: outreachDate,
    summary,
    outcome: normalizeText(row.outcome),
    next_follow_up_date: normalizeText(row.next_follow_up_date),
    created_at: normalizeText(row.created_at),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizeOutreachLogs(value: unknown): OutreachLog[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const log = normalizeOutreachLog(row);
    return log ? [log] : [];
  });
}

export function compareOutreachLogs(first: OutreachLog, second: OutreachLog) {
  return (
    second.outreach_date.localeCompare(first.outreach_date) ||
    (second.created_at ?? "").localeCompare(first.created_at ?? "") ||
    first.summary.localeCompare(second.summary)
  );
}

export function compareFollowUpLogs(first: OutreachLog, second: OutreachLog) {
  return (
    (first.next_follow_up_date ?? "").localeCompare(second.next_follow_up_date ?? "") ||
    first.outreach_date.localeCompare(second.outreach_date) ||
    first.summary.localeCompare(second.summary)
  );
}
