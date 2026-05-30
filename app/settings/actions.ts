"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient } from "@/lib/admin";
import { requireUser } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export type DeleteAccountState = {
  message: string;
  success?: boolean;
  fieldErrors?: {
    confirm?: string[];
  };
};

const deleteAccountSchema = z.object({
  confirm: z
    .string()
    .trim()
    .refine((value) => value === "DELETE", 'Type "DELETE" to confirm account deletion.'),
});

export async function deleteAccountAction(
  _previousState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const parsed = deleteAccountSchema.safeParse({
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      message: "Confirm deletion before continuing.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/settings");
  const rateLimit = await enforceRateLimit({
    scope: "settings:delete-account",
    limit: 3,
    windowSeconds: 60 * 60,
    userId: user.id,
    message: "Too many account deletion attempts. Wait a bit and try again.",
  });

  if (!rateLimit.allowed) {
    return {
      message: rateLimit.message,
    };
  }

  let deleteFailed = false;

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    deleteFailed = Boolean(error);
  } catch {
    deleteFailed = true;
  }

  if (deleteFailed) {
    return {
      message: "We could not delete the account. Wait a moment and try again.",
    };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login?message=account-deleted");
}
