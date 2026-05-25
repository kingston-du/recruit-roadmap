import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfigOrThrow } from "@/lib/supabase/config";

export function createClient() {
  const { url, publishableKey } = getSupabaseConfigOrThrow();

  return createBrowserClient(url, publishableKey);
}
