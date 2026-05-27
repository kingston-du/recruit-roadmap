import "server-only";

import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { getSupabaseConfig } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const fallbackPath = "/today";

export function getSafeRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return fallbackPath;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallbackPath;
  }

  return value;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireUser(currentPath: string): Promise<User> {
  if (!getSupabaseConfig()) {
    redirect(`/login?next=${encodeURIComponent(currentPath)}&message=setup`);
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(currentPath)}`);
  }

  return user;
}
