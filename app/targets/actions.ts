"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  buildTargetInsert,
  buildTargetUpdate,
  freeTargetLimit,
  hasProTargets,
  normalizeSubscription,
  readTargetFormData,
  targetFormSchema,
  targetIdSchema,
  type TargetFormFieldName,
} from "@/lib/targets";

export type TargetMutationState = {
  message: string;
  success?: boolean;
  upgradeRequired?: boolean;
  fieldErrors?: Partial<Record<TargetFormFieldName, string[]>>;
};

export type TargetDeleteState = {
  message: string;
  success?: boolean;
};

async function userHasProTargets(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_name, status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return {
      isPro: false,
      error,
    };
  }

  return {
    isPro: hasProTargets(normalizeSubscription(data)),
    error: null,
  };
}

async function canCreateAnotherTarget(userId: string) {
  const supabase = await createClient();
  const [{ isPro, error: planError }, { count, error: countError }] = await Promise.all([
    userHasProTargets(userId),
    supabase
      .from("targets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (planError || countError) {
    return {
      allowed: false,
      upgradeRequired: false,
    };
  }

  return {
    allowed: isPro || (count ?? 0) < freeTargetLimit,
    upgradeRequired: !isPro && (count ?? 0) >= freeTargetLimit,
  };
}

function formatDatabaseError(message: string) {
  if (message.toLowerCase().includes("target limit")) {
    return {
      message: "Free accounts can track up to 5 targets. Upgrade to Pro for unlimited targets.",
      upgradeRequired: true,
    } satisfies TargetMutationState;
  }

  return {
    message: "We could not save the target. Please try again.",
  } satisfies TargetMutationState;
}

export async function createTargetAction(
  _previousState: TargetMutationState,
  formData: FormData,
): Promise<TargetMutationState> {
  const parsed = targetFormSchema.safeParse(readTargetFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const limit = await canCreateAnotherTarget(user.id);

  if (!limit.allowed) {
    return {
      message: limit.upgradeRequired
        ? "Free accounts can track up to 5 targets. Upgrade to Pro for unlimited targets."
        : "We could not verify your plan. Please try again.",
      upgradeRequired: limit.upgradeRequired,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("targets").insert(buildTargetInsert(user.id, parsed.data));

  if (error) {
    return formatDatabaseError(error.message);
  }

  revalidatePath("/targets");

  return {
    message: "Target added.",
    success: true,
  };
}

export async function updateTargetAction(
  _previousState: TargetMutationState,
  formData: FormData,
): Promise<TargetMutationState> {
  const idParsed = targetIdSchema.safeParse({ id: formData.get("id") });
  const parsed = targetFormSchema.safeParse(readTargetFormData(formData));

  if (!idParsed.success || !parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("targets")
    .update(buildTargetUpdate(parsed.data))
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return formatDatabaseError(error.message);
  }

  if (!data) {
    return {
      message: "We could not find that target.",
    };
  }

  revalidatePath("/targets");

  return {
    message: "Target updated.",
    success: true,
  };
}

export async function deleteTargetAction(
  _previousState: TargetDeleteState,
  formData: FormData,
): Promise<TargetDeleteState> {
  const idParsed = targetIdSchema.safeParse({ id: formData.get("id") });

  if (!idParsed.success) {
    return {
      message: "Target id is invalid.",
    };
  }

  const user = await requireUser("/targets");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("targets")
    .delete()
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      message: "We could not delete the target. Please try again.",
    };
  }

  if (!data) {
    return {
      message: "We could not find that target.",
    };
  }

  revalidatePath("/targets");

  return {
    message: "Target deleted.",
    success: true,
  };
}
