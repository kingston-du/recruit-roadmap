import { z } from "zod";

export const playerPositionOptions = [
  "Forward",
  "Center",
  "Left Wing",
  "Right Wing",
  "Defense",
  "Goalie",
] as const;

export const shootsOptions = ["Left", "Right"] as const;

export const playerProfileSelect = `
  id,
  user_id,
  first_name,
  last_name,
  birth_year,
  position,
  shoots,
  height,
  weight,
  current_team,
  current_level,
  hometown,
  gpa,
  target_path,
  goals,
  video_links,
  elite_prospects_url,
  myhockey_url,
  coach_reference_name,
  coach_reference_contact,
  updated_at
`;

export type PlayerProfile = {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  birth_year: string | null;
  position: string | null;
  shoots: string | null;
  height: string | null;
  weight: string | null;
  current_team: string | null;
  current_level: string | null;
  hometown: string | null;
  gpa: string | null;
  target_path: string | null;
  goals: string | null;
  video_links: string[];
  elite_prospects_url: string | null;
  myhockey_url: string | null;
  coach_reference_name: string | null;
  coach_reference_contact: string | null;
  updated_at: string | null;
};

export type PlayerProfileUpsert = Omit<PlayerProfile, "id" | "updated_at">;

export type PlayerProfileFieldName = keyof z.input<typeof playerProfileFormSchema>;

export type PlayerProfileCompletenessItem = {
  label: string;
  value: string | null;
  emptyText: string;
  required: boolean;
};

export type PlayerProfileCompletenessGroup = {
  title: string;
  items: PlayerProfileCompletenessItem[];
};

const currentYear = new Date().getFullYear();

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

function hasOption(options: readonly string[], value: string) {
  return options.includes(value);
}

function selectValue(label: string, options: readonly string[]) {
  return z
    .string()
    .trim()
    .refine((value) => hasOption(options, value), `Choose ${label.toLowerCase()}.`);
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

function splitVideoLinks(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((link) => link.trim())
    .filter(Boolean);
}

export const playerProfileFormSchema = z.object({
  first_name: requiredText("First name", 80),
  last_name: optionalText("Last name", 80),
  birth_year: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter a 4-digit birth year.")
    .refine((value) => {
      const year = Number(value);
      return year >= 1990 && year <= currentYear;
    }, `Enter a birth year between 1990 and ${currentYear}.`),
  position: selectValue("a position", playerPositionOptions),
  shoots: selectValue("shoots", shootsOptions),
  height: requiredText("Height", 30),
  weight: requiredText("Weight", 30),
  current_team: requiredText("Current team", 120),
  current_level: requiredText("Current level", 80),
  hometown: optionalText("Hometown", 120),
  gpa: z
    .string()
    .trim()
    .max(8, "GPA must be 8 characters or fewer.")
    .refine((value) => {
      if (value.length === 0) {
        return true;
      }

      const gpa = Number(value);
      return Number.isFinite(gpa) && gpa >= 0 && gpa <= 5;
    }, "Enter a GPA from 0.0 to 5.0.")
    .transform((value) => (value.length > 0 ? value : null)),
  target_path: requiredText("Target path", 200),
  goals: requiredText("Goals", 1200),
  video_links_text: z
    .string()
    .trim()
    .max(2000, "Video links must be 2,000 characters or fewer.")
    .transform(splitVideoLinks)
    .refine((links) => links.length > 0, "Add at least one video link.")
    .refine((links) => links.length <= 12, "Add 12 or fewer video links.")
    .refine((links) => links.every(isValidUrl), "Enter one valid URL per line."),
  elite_prospects_url: optionalUrl("Elite Prospects URL"),
  myhockey_url: optionalUrl("MyHockey URL"),
  coach_reference_name: optionalText("Coach reference name", 120),
  coach_reference_contact: optionalText("Coach reference contact", 200),
});

export function readPlayerProfileFormData(formData: FormData) {
  function read(name: PlayerProfileFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    first_name: read("first_name"),
    last_name: read("last_name"),
    birth_year: read("birth_year"),
    position: read("position"),
    shoots: read("shoots"),
    height: read("height"),
    weight: read("weight"),
    current_team: read("current_team"),
    current_level: read("current_level"),
    hometown: read("hometown"),
    gpa: read("gpa"),
    target_path: read("target_path"),
    goals: read("goals"),
    video_links_text: read("video_links_text"),
    elite_prospects_url: read("elite_prospects_url"),
    myhockey_url: read("myhockey_url"),
    coach_reference_name: read("coach_reference_name"),
    coach_reference_contact: read("coach_reference_contact"),
  };
}

export function buildPlayerProfileUpsert(
  userId: string,
  data: z.infer<typeof playerProfileFormSchema>,
): PlayerProfileUpsert {
  return {
    user_id: userId,
    first_name: data.first_name,
    last_name: data.last_name,
    birth_year: data.birth_year,
    position: data.position,
    shoots: data.shoots,
    height: data.height,
    weight: data.weight,
    current_team: data.current_team,
    current_level: data.current_level,
    hometown: data.hometown,
    gpa: data.gpa,
    target_path: data.target_path,
    goals: data.goals,
    video_links: data.video_links_text,
    elite_prospects_url: data.elite_prospects_url,
    myhockey_url: data.myhockey_url,
    coach_reference_name: data.coach_reference_name,
    coach_reference_contact: data.coach_reference_contact,
  };
}

function normalizeText(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function normalizePlayerProfile(value: unknown): PlayerProfile | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Partial<PlayerProfile>;

  return {
    id: normalizeText(row.id) ?? "",
    user_id: normalizeText(row.user_id) ?? "",
    first_name: normalizeText(row.first_name),
    last_name: normalizeText(row.last_name),
    birth_year: normalizeText(row.birth_year),
    position: normalizeText(row.position),
    shoots: normalizeText(row.shoots),
    height: normalizeText(row.height),
    weight: normalizeText(row.weight),
    current_team: normalizeText(row.current_team),
    current_level: normalizeText(row.current_level),
    hometown: normalizeText(row.hometown),
    gpa: normalizeText(row.gpa),
    target_path: normalizeText(row.target_path),
    goals: normalizeText(row.goals),
    video_links: Array.isArray(row.video_links)
      ? row.video_links.filter((link): link is string => typeof link === "string")
      : [],
    elite_prospects_url: normalizeText(row.elite_prospects_url),
    myhockey_url: normalizeText(row.myhockey_url),
    coach_reference_name: normalizeText(row.coach_reference_name),
    coach_reference_contact: normalizeText(row.coach_reference_contact),
    updated_at: normalizeText(row.updated_at),
  };
}

function fullName(profile: PlayerProfile | null) {
  const parts = [profile?.first_name, profile?.last_name].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function formatLinks(profile: PlayerProfile | null) {
  const count = profile?.video_links.length ?? 0;

  if (count === 0) {
    return null;
  }

  return count === 1 ? "1 video link" : `${count} video links`;
}

export function getPlayerProfileCompleteness(profile: PlayerProfile | null) {
  const groups: PlayerProfileCompletenessGroup[] = [
    {
      title: "Player Info",
      items: [
        {
          label: "Player name",
          value: fullName(profile),
          emptyText: "Add player name",
          required: true,
        },
        {
          label: "Birth year",
          value: profile?.birth_year ?? null,
          emptyText: "Add birth year",
          required: true,
        },
        {
          label: "Hometown",
          value: profile?.hometown ?? null,
          emptyText: "Add hometown",
          required: false,
        },
      ],
    },
    {
      title: "Hockey Info",
      items: [
        {
          label: "Position",
          value: profile?.position ?? null,
          emptyText: "Choose position",
          required: true,
        },
        {
          label: "Shoots",
          value: profile?.shoots ?? null,
          emptyText: "Choose shoots",
          required: true,
        },
        {
          label: "Height and weight",
          value: profile?.height && profile.weight ? `${profile.height}, ${profile.weight}` : null,
          emptyText: "Add height and weight",
          required: true,
        },
        {
          label: "Current team",
          value: profile?.current_team ?? null,
          emptyText: "Add current team",
          required: true,
        },
        {
          label: "Current level",
          value: profile?.current_level ?? null,
          emptyText: "Add current level",
          required: true,
        },
      ],
    },
    {
      title: "School and Goals",
      items: [
        {
          label: "GPA",
          value: profile?.gpa ?? null,
          emptyText: "Add GPA",
          required: false,
        },
        {
          label: "Target path",
          value: profile?.target_path ?? null,
          emptyText: "Add target path",
          required: true,
        },
        {
          label: "Goals",
          value: profile?.goals ?? null,
          emptyText: "Add goals",
          required: true,
        },
      ],
    },
    {
      title: "Video and Links",
      items: [
        {
          label: "Video links",
          value: formatLinks(profile),
          emptyText: "Add at least one video link",
          required: true,
        },
        {
          label: "Elite Prospects",
          value: profile?.elite_prospects_url ?? null,
          emptyText: "Add Elite Prospects URL",
          required: false,
        },
        {
          label: "MyHockey",
          value: profile?.myhockey_url ?? null,
          emptyText: "Add MyHockey URL",
          required: false,
        },
      ],
    },
    {
      title: "Reference",
      items: [
        {
          label: "Coach reference name",
          value: profile?.coach_reference_name ?? null,
          emptyText: "Add coach name",
          required: false,
        },
        {
          label: "Coach reference contact",
          value: profile?.coach_reference_contact ?? null,
          emptyText: "Add coach contact",
          required: false,
        },
      ],
    },
  ];

  const items = groups.flatMap((group) => group.items);
  const completed = items.filter((item) => item.value).length;
  const requiredItems = items.filter((item) => item.required);
  const requiredCompleted = requiredItems.filter((item) => item.value).length;
  const score = Math.round((completed / items.length) * 100);

  const status =
    score === 100
      ? "Complete"
      : score >= 75
        ? "Strong foundation"
        : score >= 40
          ? "In progress"
          : score > 0
            ? "Getting started"
            : "Not started";

  return {
    score,
    status,
    completed,
    total: items.length,
    requiredCompleted,
    requiredTotal: requiredItems.length,
    groups,
  };
}
