"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth";
import {
  buildMainPlanWrite,
  buildPlanPathInsert,
  buildPlanPathUpdate,
  defaultMainPlanTitle,
  defaultPlanPathExamples,
  mainPlanFormSchema,
  planIdSchema,
  planPathFormSchema,
  planPathIdSchema,
  readMainPlanFormData,
  readPlanPathFormData,
  type MainPlanFormFieldName,
  type PlanPathFormFieldName,
} from "@/lib/my-plan";
import { createClient } from "@/lib/supabase/server";

export type MainPlanFormState = {
  message: string;
  success?: boolean;
  fieldErrors?: Partial<Record<MainPlanFormFieldName, string[]>>;
};

export type PlanPathMutationState = {
  message: string;
  success?: boolean;
  fieldErrors?: Partial<Record<PlanPathFormFieldName, string[]>>;
};

export type PlanPathDeleteState = {
  message: string;
  success?: boolean;
};

export type DefaultPathsState = {
  message: string;
  success?: boolean;
};

async function findMainPlanId(userId: string) {
  const supabase = await createClient();
  const { data: mainPlan, error: mainError } = await supabase
    .from("plans")
    .select("id")
    .eq("user_id", userId)
    .eq("is_main", true)
    .maybeSingle();

  if (mainError) {
    return {
      id: null,
      error: mainError,
    };
  }

  if (mainPlan?.id) {
    return {
      id: mainPlan.id as string,
      error: null,
    };
  }

  const { data: fallbackPlan, error: fallbackError } = await supabase
    .from("plans")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fallbackError) {
    return {
      id: null,
      error: fallbackError,
    };
  }

  if (!fallbackPlan?.id) {
    return {
      id: null,
      error: null,
    };
  }

  const { error: updateError } = await supabase
    .from("plans")
    .update({ is_main: true })
    .eq("id", fallbackPlan.id)
    .eq("user_id", userId);

  return {
    id: updateError ? null : (fallbackPlan.id as string),
    error: updateError,
  };
}

async function getOrCreateMainPlanId(userId: string) {
  const existingPlan = await findMainPlanId(userId);

  if (existingPlan.id || existingPlan.error) {
    return existingPlan;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plans")
    .insert({
      user_id: userId,
      title: defaultMainPlanTitle,
      status: "active",
      is_main: true,
    })
    .select("id")
    .single();

  if (!error && data?.id) {
    return {
      id: data.id as string,
      error: null,
    };
  }

  const retryPlan = await findMainPlanId(userId);

  if (retryPlan.id) {
    return retryPlan;
  }

  return {
    id: null,
    error,
  };
}

export async function saveMainPlanAction(
  _previousState: MainPlanFormState,
  formData: FormData,
): Promise<MainPlanFormState> {
  const parsed = mainPlanFormSchema.safeParse(readMainPlanFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const rawId = formData.get("id");
  const planId =
    typeof rawId === "string" && rawId.length > 0 ? planIdSchema.safeParse({ id: rawId }) : null;
  const write = buildMainPlanWrite(user.id, parsed.data);

  if (planId && !planId.success) {
    return {
      message: "We could not identify that plan. Refresh and try again.",
    };
  }

  if (planId?.success) {
    const { data, error } = await supabase
      .from("plans")
      .update(write)
      .eq("id", planId.data.id)
      .eq("user_id", user.id)
      .eq("is_main", true)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return {
        message: "We could not save the plan. Wait a moment and try again.",
      };
    }
  } else {
    const existingPlan = await findMainPlanId(user.id);

    if (existingPlan.error) {
      return {
        message: "We could not load the current plan. Refresh and try again.",
      };
    }

    if (existingPlan.id) {
      const { error } = await supabase
        .from("plans")
        .update(write)
        .eq("id", existingPlan.id)
        .eq("user_id", user.id);

      if (error) {
        return {
          message: "We could not save the plan. Wait a moment and try again.",
        };
      }
    } else {
      const { error } = await supabase.from("plans").insert(write);

      if (error) {
        return {
          message: "We could not create the plan. Wait a moment and try again.",
        };
      }
    }
  }

  revalidatePath("/my-plan");

  return {
    message: "Plan saved.",
    success: true,
  };
}

export async function createPlanPathAction(
  _previousState: PlanPathMutationState,
  formData: FormData,
): Promise<PlanPathMutationState> {
  const parsed = planPathFormSchema.safeParse(readPlanPathFormData(formData));

  if (!parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const mainPlan = await getOrCreateMainPlanId(user.id);

  if (!mainPlan.id || mainPlan.error) {
    return {
      message: "We could not prepare the plan. Refresh and try again.",
    };
  }

  const { count } = await supabase
    .from("plan_paths")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("plan_id", mainPlan.id);
  const { error } = await supabase
    .from("plan_paths")
    .insert(buildPlanPathInsert(user.id, mainPlan.id, parsed.data, count ?? 0));

  if (error) {
    return {
      message: "We could not add the path. Wait a moment and try again.",
    };
  }

  revalidatePath("/my-plan");

  return {
    message: "Path added.",
    success: true,
  };
}

export async function updatePlanPathAction(
  _previousState: PlanPathMutationState,
  formData: FormData,
): Promise<PlanPathMutationState> {
  const idParsed = planPathIdSchema.safeParse({ id: formData.get("id") });
  const parsed = planPathFormSchema.safeParse(readPlanPathFormData(formData));

  if (!idParsed.success || !parsed.success) {
    return {
      message: "Please fill in the highlighted fields.",
      fieldErrors: parsed.success ? undefined : parsed.error.flatten().fieldErrors,
    };
  }

  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plan_paths")
    .update(buildPlanPathUpdate(parsed.data))
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      message: "We could not save the path. Wait a moment and try again.",
    };
  }

  revalidatePath("/my-plan");

  return {
    message: "Path saved.",
    success: true,
  };
}

export async function deletePlanPathAction(
  _previousState: PlanPathDeleteState,
  formData: FormData,
): Promise<PlanPathDeleteState> {
  const idParsed = planPathIdSchema.safeParse({ id: formData.get("id") });

  if (!idParsed.success) {
    return {
      message: "We could not identify that path. Refresh and try again.",
    };
  }

  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plan_paths")
    .delete()
    .eq("id", idParsed.data.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return {
      message: "We could not delete the path. Wait a moment and try again.",
    };
  }

  revalidatePath("/my-plan");

  return {
    message: "Path deleted.",
    success: true,
  };
}

export async function addDefaultPlanPathsAction(): Promise<DefaultPathsState> {
  const user = await requireUser("/my-plan");
  const supabase = await createClient();
  const mainPlan = await getOrCreateMainPlanId(user.id);

  if (!mainPlan.id || mainPlan.error) {
    return {
      message: "We could not prepare the plan. Refresh and try again.",
    };
  }

  const planId = mainPlan.id;
  const { data: existingPaths, error: existingError } = await supabase
    .from("plan_paths")
    .select("title")
    .eq("user_id", user.id)
    .eq("plan_id", planId);

  if (existingError) {
    return {
      message: "We could not check the current paths. Refresh and try again.",
    };
  }

  const existingTitles = new Set(
    (existingPaths ?? [])
      .map((path) => (typeof path.title === "string" ? path.title.toLowerCase() : ""))
      .filter(Boolean),
  );
  const examplesToAdd = defaultPlanPathExamples.filter(
    (example) => !existingTitles.has(example.title.toLowerCase()),
  );

  if (examplesToAdd.length === 0) {
    return {
      message: "The default path examples are already in this plan.",
      success: true,
    };
  }

  const startOrder = existingPaths?.length ?? 0;
  const rows = examplesToAdd.map((example, index) =>
    buildPlanPathInsert(user.id, planId, example, startOrder + index),
  );
  const { error } = await supabase.from("plan_paths").insert(rows);

  if (error) {
    return {
      message: "We could not add the path examples. Wait a moment and try again.",
    };
  }

  revalidatePath("/my-plan");

  return {
    message: "Path examples added.",
    success: true,
  };
}
