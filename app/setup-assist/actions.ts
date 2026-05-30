"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  buildSetupAssistRequestInsert,
  readSetupAssistRequestFormData,
  setupAssistRequestFormSchema,
  type SetupAssistRequestFieldName,
} from "@/lib/setup-assist";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";

export type SetupAssistRequestFormState = {
  message: string;
  success?: boolean;
  fieldErrors?: Partial<Record<SetupAssistRequestFieldName, string[]>>;
};

export async function createSetupAssistRequestAction(
  _previousState: SetupAssistRequestFormState,
  formData: FormData,
): Promise<SetupAssistRequestFormState> {
  const parsed = setupAssistRequestFormSchema.safeParse(
    readSetupAssistRequestFormData(formData),
  );

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/setup-assist");
  const rateLimit = await enforceRateLimit({
    scope: "setup-assist:create",
    limit: 5,
    windowSeconds: 60 * 60,
    userId: user.id,
    message: "Too many setup requests. Wait a bit and try again.",
  });

  if (!rateLimit.allowed) {
    return {
      message: rateLimit.message,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("setup_assist_requests")
    .insert(buildSetupAssistRequestInsert(user.id, parsed.data));

  if (error) {
    return {
      message: "We could not submit your setup request. Wait a moment and try again.",
    };
  }

  revalidatePath("/setup-assist");
  revalidatePath("/admin");

  return {
    message: "Setup Assist request submitted. Complete the one-time payment when ready.",
    success: true,
  };
}
