import { z } from "zod";

export const freeEventLimit = 3;

export const eventTypeOptions = [
  "camp",
  "tryout",
  "showcase",
  "call",
  "deadline",
  "visit",
  "other",
] as const;

export const eventTypeLabels: Record<EventType, string> = {
  camp: "Camp",
  tryout: "Tryout",
  showcase: "Showcase",
  call: "Call",
  deadline: "Deadline",
  visit: "Visit",
  other: "Other",
};

export const eventStatusOptions = ["Planned", "Registered", "Completed", "Canceled"] as const;

export const eventSelect = `
  id,
  user_id,
  target_id,
  title,
  event_type,
  start_date,
  end_date,
  registration_deadline,
  cost,
  location,
  url,
  notes,
  status,
  created_at,
  updated_at
`;

export type EventType = (typeof eventTypeOptions)[number];
export type EventStatus = (typeof eventStatusOptions)[number];

export type RecruitEvent = {
  id: string;
  user_id: string;
  target_id: string | null;
  title: string;
  event_type: EventType;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  cost: number | null;
  location: string | null;
  url: string | null;
  notes: string | null;
  status: EventStatus;
  created_at: string | null;
  updated_at: string | null;
};

export type EventFormFieldName = keyof z.input<typeof eventFormSchema>;

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

function optionalCost(label: string) {
  return z
    .string()
    .trim()
    .refine((value) => value.length === 0 || Number.isFinite(Number(value)), {
      message: `${label} must be a number.`,
    })
    .refine((value) => value.length === 0 || Number(value) >= 0, {
      message: `${label} cannot be negative.`,
    })
    .transform((value) => (value.length > 0 ? Number(value) : null));
}

export const eventFormSchema = z
  .object({
    target_id: z
      .union([z.string().uuid("Choose a valid target."), z.literal("")])
      .transform((value) => (value.length > 0 ? value : null)),
    title: requiredText("Title", 120),
    event_type: z.enum(eventTypeOptions, { message: "Choose an event type." }),
    start_date: requiredDate("Start date"),
    end_date: optionalDate("End date"),
    registration_deadline: optionalDate("Registration deadline"),
    cost: optionalCost("Cost"),
    location: optionalText("Location", 160),
    url: optionalUrl("URL"),
    notes: optionalText("Notes", 2000),
    status: z.enum(eventStatusOptions, { message: "Choose an event status." }),
  })
  .superRefine((data, context) => {
    if (data.end_date && data.end_date < data.start_date) {
      context.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "End date cannot be before the start date.",
      });
    }
  });

export const eventIdSchema = z.object({
  id: z.string().uuid("Event id is invalid."),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export function readEventFormData(formData: FormData) {
  function read(name: EventFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    target_id: read("target_id"),
    title: read("title"),
    event_type: read("event_type"),
    start_date: read("start_date"),
    end_date: read("end_date"),
    registration_deadline: read("registration_deadline"),
    cost: read("cost"),
    location: read("location"),
    url: read("url"),
    notes: read("notes"),
    status: read("status") || "Planned",
  };
}

export function buildEventInsert(userId: string, data: EventFormData) {
  return {
    user_id: userId,
    target_id: data.target_id,
    title: data.title,
    event_type: data.event_type,
    start_date: data.start_date,
    end_date: data.end_date,
    registration_deadline: data.registration_deadline,
    cost: data.cost,
    location: data.location,
    url: data.url,
    notes: data.notes,
    status: data.status,
  };
}

export function buildEventUpdate(data: EventFormData) {
  return {
    target_id: data.target_id,
    title: data.title,
    event_type: data.event_type,
    start_date: data.start_date,
    end_date: data.end_date,
    registration_deadline: data.registration_deadline,
    cost: data.cost,
    location: data.location,
    url: data.url,
    notes: data.notes,
    status: data.status,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeEventType(value: unknown): EventType {
  return typeof value === "string" && eventTypeOptions.includes(value as EventType)
    ? (value as EventType)
    : "other";
}

function normalizeEventStatus(value: unknown): EventStatus {
  if (typeof value !== "string") {
    return "Planned";
  }

  const matchedStatus = eventStatusOptions.find(
    (status) => status.toLowerCase() === value.toLowerCase(),
  );

  return matchedStatus ?? "Planned";
}

function normalizeCost(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function normalizeEvent(value: unknown): RecruitEvent | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<RecruitEvent>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const title = normalizeText(row.title);
  const startDate = normalizeText(row.start_date);

  if (!id || !userId || !title || !startDate) {
    return null;
  }

  return {
    id,
    user_id: userId,
    target_id: normalizeText(row.target_id),
    title,
    event_type: normalizeEventType(row.event_type),
    start_date: startDate,
    end_date: normalizeText(row.end_date),
    registration_deadline: normalizeText(row.registration_deadline),
    cost: normalizeCost(row.cost),
    location: normalizeText(row.location),
    url: normalizeText(row.url),
    notes: normalizeText(row.notes),
    status: normalizeEventStatus(row.status),
    created_at: normalizeText(row.created_at),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizeEvents(value: unknown): RecruitEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const event = normalizeEvent(row);
    return event ? [event] : [];
  });
}

export function compareRecruitEvents(first: RecruitEvent, second: RecruitEvent) {
  return (
    first.start_date.localeCompare(second.start_date) ||
    first.title.localeCompare(second.title)
  );
}

export function formatDateLabel(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function formatEventDateRange(event: RecruitEvent) {
  if (!event.end_date || event.end_date === event.start_date) {
    return formatDateLabel(event.start_date);
  }

  return `${formatDateLabel(event.start_date)} to ${formatDateLabel(event.end_date)}`;
}

export function formatEventCost(cost: number | null) {
  if (cost === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(cost) ? 0 : 2,
  }).format(cost);
}
