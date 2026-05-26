import { z } from "zod";

export const freeContactLimit = 3;

export const contactSelect = `
  id,
  user_id,
  target_id,
  name,
  role,
  email,
  phone,
  source_url,
  notes,
  created_at,
  updated_at
`;

export type Contact = {
  id: string;
  user_id: string;
  target_id: string | null;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  source_url: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ContactFormFieldName = keyof z.input<typeof contactFormSchema>;

function requiredText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);
}

function requiredEmail(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .email(`${label} must be a valid email address.`);
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

export const contactFormSchema = z.object({
  target_id: z
    .union([z.string().uuid("Choose a valid target."), z.literal("")])
    .transform((value) => (value.length > 0 ? value : null)),
  name: requiredText("Contact name", 120),
  role: requiredText("Coach or staff role", 120),
  email: requiredEmail("Email", 240),
  phone: optionalText("Phone", 60),
  source_url: optionalUrl("Where you found this contact"),
  notes: optionalText("Notes", 2000),
});

export const contactIdSchema = z.object({
  id: z.string().uuid("We could not identify that contact. Refresh and try again."),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function readContactFormData(formData: FormData) {
  function read(name: ContactFormFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    target_id: read("target_id"),
    name: read("name"),
    role: read("role"),
    email: read("email"),
    phone: read("phone"),
    source_url: read("source_url"),
    notes: read("notes"),
  };
}

export function buildContactInsert(userId: string, data: ContactFormData) {
  return {
    user_id: userId,
    target_id: data.target_id,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    source_url: data.source_url,
    notes: data.notes,
  };
}

export function buildContactUpdate(data: ContactFormData) {
  return {
    target_id: data.target_id,
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    source_url: data.source_url,
    notes: data.notes,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function normalizeContact(value: unknown): Contact | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<Contact>;
  const id = normalizeText(row.id);
  const userId = normalizeText(row.user_id);
  const name = normalizeText(row.name);

  if (!id || !userId || !name) {
    return null;
  }

  return {
    id,
    user_id: userId,
    target_id: normalizeText(row.target_id),
    name,
    role: normalizeText(row.role),
    email: normalizeText(row.email),
    phone: normalizeText(row.phone),
    source_url: normalizeText(row.source_url),
    notes: normalizeText(row.notes),
    created_at: normalizeText(row.created_at),
    updated_at: normalizeText(row.updated_at),
  };
}

export function normalizeContacts(value: unknown): Contact[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((row) => {
    const contact = normalizeContact(row);
    return contact ? [contact] : [];
  });
}
