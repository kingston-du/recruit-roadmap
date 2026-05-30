"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createAdminClient, requireAdmin } from "@/lib/admin";
import { enforceRateLimit } from "@/lib/rate-limit";

const planTierMutationSchema = z.object({
  user_id: z.string().uuid(),
  plan_tier: z.enum(["free", "pro"]),
});

export async function updatePlanTierAction(formData: FormData) {
  const admin = await requireAdmin("/admin");

  const parsed = planTierMutationSchema.safeParse({
    user_id: formData.get("user_id"),
    plan_tier: formData.get("plan_tier"),
  });

  if (!parsed.success) {
    redirect("/admin?message=invalid-plan");
  }

  const rateLimit = await enforceRateLimit({
    scope: "admin:plan-tier",
    limit: 30,
    windowSeconds: 10 * 60,
    userId: admin.id,
    message: "Too many admin changes. Wait a few minutes and try again.",
  });

  if (!rateLimit.allowed) {
    redirect("/admin?message=rate-limited");
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
