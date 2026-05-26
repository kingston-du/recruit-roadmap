"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  buildContactInsert,
  buildContactUpdate,
  contactFormSchema,
  contactIdSchema,
  freeContactLimit,
  readContactFormData,
  type ContactFormFieldName,
} from "@/lib/contacts";
import {
  buildEventInsert,
  buildEventUpdate,
  eventFormSchema,
  eventIdSchema,
  freeEventLimit,
  readEventFormData,
  type EventFormFieldName,
} from "@/lib/events";
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

export type ContactMutationState = {
  message: string;
  success?: boolean;
  upgradeRequired?: boolean;
  fieldErrors?: Partial<Record<ContactFormFieldName, string[]>>;
};

export type ContactDeleteState = {
  message: string;
  success?: boolean;
};

export type EventMutationState = {
  message: string;
  success?: boolean;
  upgradeRequired?: boolean;
  fieldErrors?: Partial<Record<EventFormFieldName, string[]>>;
};

export type EventDeleteState = {
  message: string;
  success?: boolean;
};

async function userHasActivePro(userId: string) {
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
    userHasActivePro(userId),
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

async function canCreateAnotherContact(userId: string) {
  const supabase = await createClient();
  const [{ isPro, error: planError }, { count, error: countError }] = await Promise.all([
    userHasActivePro(userId),
    supabase
      .from("contacts")
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
    allowed: isPro || (count ?? 0) < freeContactLimit,
    upgradeRequired: !isPro && (count ?? 0) >= freeContactLimit,
  };
}

async function canCreateAnotherEvent(userId: string) {
  const supabase = await createClient();
  const [{ isPro, error: planError }, { count, error: countError }] = await Promise.all([
    userHasActivePro(userId),
    supabase
      .from("events")
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
    allowed: isPro || (count ?? 0) < freeEventLimit,
    upgradeRequired: !isPro && (count ?? 0) >= freeEventLimit,
  };
}

async function validateOwnedTarget(userId: string, targetId: string | null) {
  if (!targetId) {
    return {
      valid: true,
      message: "",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("targets")
    .select("id")
    .eq("id", targetId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return {
      valid: false,
      message: "We could not verify the selected target. Please try again.",
    };
  }

  if (!data) {
    return {
      valid: false,
      message: "Choose one of your targets or leave the target blank.",
    };
  }

  return {
    valid: true,
    message: "",
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

function formatContactDatabaseError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("contact limit")) {
    return {
      message: "Free accounts can track up to 3 coach contacts. Upgrade to Pro for unlimited contacts.",
      upgradeRequired: true,
    } satisfies ContactMutationState;
  }

  if (lowerMessage.includes("contact target") || lowerMessage.includes("same user")) {
    return {
      message: "Choose one of your targets or leave the target blank.",
    } satisfies ContactMutationState;
  }

  return {
    message: "We could not save the contact. Please try again.",
  } satisfies ContactMutationState;
}

function formatEventDatabaseError(message: string) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("event limit")) {
    return {
      message: "Free accounts can track up to 3 events or dates. Upgrade to Pro for unlimited events.",
      upgradeRequired: true,
    } satisfies EventMutationState;
  }

  if (lowerMessage.includes("event target") || lowerMessage.includes("same user")) {
    return {
      message: "Choose one of your targets or leave the target blank.",
    } satisfies EventMutationState;
  }

  return {
    message: "We could not save the event. Please try again.",
  } satisfies EventMutationState;
}

function revalidateEventViews() {
  revalidatePath("/targets");
  revalidatePath("/today");
  revalidatePath("/my-plan");
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

export async function createContactAction(
  _previousState: ContactMutationState,
  formData: FormData,
): Promise<ContactMutationState> {
  const parsed = contactFormSchema.safeParse(readContactFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const target = await validateOwnedTarget(user.id, parsed.data.target_id);

  if (!target.valid) {
    return {
      message: target.message,
    };
  }

  const limit = await canCreateAnotherContact(user.id);

  if (!limit.allowed) {
    return {
      message: limit.upgradeRequired
        ? "Free accounts can track up to 3 coach contacts. Upgrade to Pro for unlimited contacts."
        : "We could not verify your plan. Please try again.",
      upgradeRequired: limit.upgradeRequired,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert(buildContactInsert(user.id, parsed.data));

  if (error) {
    return formatContactDatabaseError(error.message);
  }

  revalidatePath("/targets");

  return {
    message: "Contact added.",
    success: true,
  };
}

export async function createEventAction(
  _previousState: EventMutationState,
  formData: FormData,
): Promise<EventMutationState> {
  const parsed = eventFormSchema.safeParse(readEventFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const target = await validateOwnedTarget(user.id, parsed.data.target_id);

  if (!target.valid) {
    return {
      message: target.message,
    };
  }

  const limit = await canCreateAnotherEvent(user.id);

  if (!limit.allowed) {
    return {
      message: limit.upgradeRequired
        ? "Free accounts can track up to 3 events or dates. Upgrade to Pro for unlimited events."
        : "We could not verify your plan. Please try again.",
      upgradeRequired: limit.upgradeRequired,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert(buildEventInsert(user.id, parsed.data));

  if (error) {
    return formatEventDatabaseError(error.message);
  }

  revalidateEventViews();

  return {
    message: "Event added.",
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

export async function updateContactAction(
  _previousState: ContactMutationState,
  formData: FormData,
): Promise<ContactMutationState> {
  const idParsed = contactIdSchema.safeParse({ id: formData.get("id") });
  const parsed = contactFormSchema.safeParse(readContactFormData(formData));

  if (!idParsed.success) {
    return {
      message: "Contact id is invalid.",
    };
  }

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const target = await validateOwnedTarget(user.id, parsed.data.target_id);

  if (!target.valid) {
    return {
      message: target.message,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .update(buildContactUpdate(parsed.data))
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return formatContactDatabaseError(error.message);
  }

  if (!data) {
    return {
      message: "We could not find that contact.",
    };
  }

  revalidatePath("/targets");

  return {
    message: "Contact updated.",
    success: true,
  };
}

export async function updateEventAction(
  _previousState: EventMutationState,
  formData: FormData,
): Promise<EventMutationState> {
  const idParsed = eventIdSchema.safeParse({ id: formData.get("id") });
  const parsed = eventFormSchema.safeParse(readEventFormData(formData));

  if (!idParsed.success) {
    return {
      message: "Event id is invalid.",
    };
  }

  if (!parsed.success) {
    return {
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/targets");
  const target = await validateOwnedTarget(user.id, parsed.data.target_id);

  if (!target.valid) {
    return {
      message: target.message,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(buildEventUpdate(parsed.data))
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return formatEventDatabaseError(error.message);
  }

  if (!data) {
    return {
      message: "We could not find that event.",
    };
  }

  revalidateEventViews();

  return {
    message: "Event updated.",
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

export async function deleteContactAction(
  _previousState: ContactDeleteState,
  formData: FormData,
): Promise<ContactDeleteState> {
  const idParsed = contactIdSchema.safeParse({ id: formData.get("id") });

  if (!idParsed.success) {
    return {
      message: "Contact id is invalid.",
    };
  }

  const user = await requireUser("/targets");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      message: "We could not delete the contact. Please try again.",
    };
  }

  if (!data) {
    return {
      message: "We could not find that contact.",
    };
  }

  revalidatePath("/targets");

  return {
    message: "Contact deleted.",
    success: true,
  };
}

export async function deleteEventAction(
  _previousState: EventDeleteState,
  formData: FormData,
): Promise<EventDeleteState> {
  const idParsed = eventIdSchema.safeParse({ id: formData.get("id") });

  if (!idParsed.success) {
    return {
      message: "Event id is invalid.",
    };
  }

  const user = await requireUser("/targets");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .delete()
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      message: "We could not delete the event. Please try again.",
    };
  }

  if (!data) {
    return {
      message: "We could not find that event.",
    };
  }

  revalidateEventViews();

  return {
    message: "Event deleted.",
    success: true,
  };
}
