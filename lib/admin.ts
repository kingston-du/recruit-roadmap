import "server-only";

import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getSupabaseConfigOrThrow } from "@/lib/supabase/config";

export function isAdminUser(user: User) {
  return user.app_metadata?.role === "admin";
}

export async function requireAdmin(currentPath: string): Promise<User> {
  const user = await requireUser(currentPath);

  if (!isAdminUser(user)) {
    notFound();
  }

  return user;
}

export function createAdminClient() {
  const { url } = getSupabaseConfigOrThrow();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin access.");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
