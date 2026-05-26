export type SupabaseConfig = {
  url: string;
  publishableKey: string;
};

function normalizeSupabaseUrl(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return value;
  }
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    return null;
  }

  return { url: normalizeSupabaseUrl(url), publishableKey };
}

export function getSupabaseConfigOrThrow(): SupabaseConfig {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return config;
}
