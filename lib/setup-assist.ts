import { z } from "zod";

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

export const setupAssistRequestFormSchema = z.object({
  parent_player_name: requiredText("Parent or family contact name", 120),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email must be 254 characters or fewer."),
  player_name: requiredText("Player name", 120),
  help_needed: requiredText("What you need help importing", 1200),
  goals: requiredText("What you are trying to organize", 1200),
  current_target_list: optionalText("Current target list", 5000),
  coach_contacts: optionalText("Coach contacts", 5000),
  camp_date_links: optionalText("Camp/date links", 5000),
  notes: optionalText("Notes", 3000),
});

export type SetupAssistRequestFieldName = keyof z.input<typeof setupAssistRequestFormSchema>;
export type SetupAssistRequestFormData = z.infer<typeof setupAssistRequestFormSchema>;

export function readSetupAssistRequestFormData(formData: FormData) {
  function read(name: SetupAssistRequestFieldName) {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  }

  return {
    parent_player_name: read("parent_player_name"),
    email: read("email"),
    player_name: read("player_name"),
    help_needed: read("help_needed"),
    goals: read("goals"),
    current_target_list: read("current_target_list"),
    coach_contacts: read("coach_contacts"),
    camp_date_links: read("camp_date_links"),
    notes: read("notes"),
  };
}

export function buildSetupAssistRequestInsert(
  userId: string,
  data: SetupAssistRequestFormData,
) {
  return {
    user_id: userId,
    parent_player_name: data.parent_player_name,
    email: data.email,
    player_name: data.player_name,
    help_needed: data.help_needed,
    goals: data.goals,
    current_target_list: data.current_target_list,
    coach_contacts: data.coach_contacts,
    camp_date_links: data.camp_date_links,
    notes: data.notes,
  };
}
