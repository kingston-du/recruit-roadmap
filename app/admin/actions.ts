"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient, requireAdmin } from "@/lib/admin";

const planTierMutationSchema = z.object({
  user_id: z.string().uuid(),
  plan_tier: z.enum(["free", "pro"]),
});

export async function updatePlanTierAction(formData: FormData) {
  await requireAdmin("/admin");

  const parsed = planTierMutationSchema.safeParse({
    user_id: formData.get("user_id"),
    plan_tier: formData.get("plan_tier"),
  });

  if (!parsed.success) {
    redirect("/admin?message=invalid-plan");
  }

  let updateFailed = false;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("subscriptions").upsert(
      {
        user_id: parsed.data.user_id,
        plan_name: parsed.data.plan_tier,
        status: "active",
      },
      { onConflict: "user_id" },
    );

    updateFailed = Boolean(error);
  } catch {
    updateFailed = true;
  }

  if (updateFailed) {
    redirect("/admin?message=plan-error");
  }

  revalidatePath("/admin");
  redirect(`/admin?message=plan-${parsed.data.plan_tier}`);
}
