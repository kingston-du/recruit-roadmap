"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  buildPlayerProfileUpsert,
  playerProfileFormSchema,
  readPlayerProfileFormData,
  type PlayerProfileFieldName,
} from "@/lib/player-profile";
import { createClient } from "@/lib/supabase/server";

export type PlayerProfileFormState = {
  message: string;
  success?: boolean;
  fieldErrors?: Partial<Record<PlayerProfileFieldName, string[]>>;
};

export async function savePlayerProfileAction(
  _previousState: PlayerProfileFormState,
  formData: FormData,
): Promise<PlayerProfileFormState> {
  const parsed = playerProfileFormSchema.safeParse(readPlayerProfileFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/my-player");
  const supabase = await createClient();
  const { error } = await supabase
    .from("player_profiles")
    .upsert(buildPlayerProfileUpsert(user.id, parsed.data), { onConflict: "user_id" });

  if (error) {
    return {
      message: "We could not save the player profile. Wait a moment and try again.",
    };
  }

  revalidatePath("/my-player");

  return {
    message: "Player profile saved.",
    success: true,
  };
}
