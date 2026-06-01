import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { createAdminClient } from "@/lib/admin";
import { getSupabaseConfig } from "@/lib/supabase/config";

const defaultRateLimitMessage = "Too many attempts. Wait a few minutes and try again.";

type RateLimitOptions = {
  scope: string;
  limit: number;
  windowSeconds: number;
  userId?: string | null;
  message?: string;
  failOpen?: boolean;
};

type RateLimitResult = {
  allowed: boolean;
  message: string;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function firstForwardedIp(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function isRateLimitExceeded(error: { message?: string }) {
  return error.message?.toLowerCase().includes("rate limit exceeded") ?? false;
}

async function requestFingerprintHash() {
  const headerStore = await headers();
  const ip =
    firstForwardedIp(headerStore.get("x-forwarded-for")) ??
    headerStore.get("x-real-ip") ??
    headerStore.get("cf-connecting-ip") ??
    "unknown";
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  const language = headerStore.get("accept-language") ?? "unknown";

  return sha256(`ip:${ip}|ua:${userAgent.slice(0, 200)}|lang:${language.slice(0, 120)}`);
}

export async function enforceRateLimit({
  scope,
  limit,
  windowSeconds,
  userId = null,
  message = defaultRateLimitMessage,
  failOpen = false,
}: RateLimitOptions): Promise<RateLimitResult> {
  if (!getSupabaseConfig()) {
    return { allowed: true, message: "" };
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (failOpen) {
      console.error(`Rate limit skipped for ${scope}: missing service role key.`);

      return { allowed: true, message: "" };
    }

    return process.env.NODE_ENV === "production"
      ? { allowed: false, message }
      : { allowed: true, message: "" };
  }

  const supabase = createAdminClient();
  const identities = [
    {
      identity_type: "ip",
      identity_hash: await requestFingerprintHash(),
      user_id: userId,
    },
  ];

  if (userId) {
    identities.push({
      identity_type: "user",
      identity_hash: sha256(`user:${userId}`),
      user_id: userId,
    });
  }

  for (const identity of identities) {
    const { error } = await supabase.rpc("check_rate_limit", {
      p_scope: scope,
      p_identity_type: identity.identity_type,
      p_identity_hash: identity.identity_hash,
      p_user_id: identity.user_id,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      if (isRateLimitExceeded(error)) {
        return { allowed: false, message };
      }

      console.error(`Rate limit skipped for ${scope}: ${error.message}`);

      if (failOpen) {
        return { allowed: true, message: "" };
      }

      return { allowed: false, message };
    }
  }

  return { allowed: true, message: "" };
}
