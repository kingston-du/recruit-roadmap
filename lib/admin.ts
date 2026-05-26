import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getSupabaseConfigOrThrow } from "@/lib/supabase/config";

function getAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(/[,\s;]+/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().has(email.toLowerCase());
}

export async function requireAdmin(currentPath: string): Promise<User> {
  const user = await requireUser(currentPath);

  if (!isAdminEmail(user.email)) {
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
