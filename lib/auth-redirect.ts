import "server-only";

import { headers } from "next/headers";

import { getSafeRedirectPath } from "@/lib/auth";

const fallbackLocalOrigin = "http://localhost:3000";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || null;
}

function originFromValue(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(
      trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")
        ? trimmedValue
        : `https://${trimmedValue}`,
    );

    return url.origin;
  } catch {
    return null;
  }
}

function isLocalOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname;

    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname.endsWith(".localhost")
    );
  } catch {
    return false;
  }
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const host = firstHeaderValue(headerStore.get("x-forwarded-host")) ?? headerStore.get("host");
  const proto = firstHeaderValue(headerStore.get("x-forwarded-proto")) ?? "https";

  if (!host) {
    return null;
  }

  return originFromValue(`${proto}://${host}`);
}

export async function getAuthRedirectOrigin() {
  const configuredOrigin =
    originFromValue(process.env.NEXT_PUBLIC_SITE_URL) ??
    originFromValue(process.env.NEXT_PUBLIC_VERCEL_URL) ??
    originFromValue(process.env.VERCEL_URL);

  if (
    configuredOrigin &&
    (process.env.NODE_ENV !== "production" || !isLocalOrigin(configuredOrigin))
  ) {
    return configuredOrigin;
  }

  const requestOrigin = await getRequestOrigin();

  if (requestOrigin) {
    return requestOrigin;
  }

  return fallbackLocalOrigin;
}

export async function buildEmailRedirectTo(next: string | undefined) {
  const callbackUrl = new URL("/auth/callback", await getAuthRedirectOrigin());
  callbackUrl.searchParams.set("next", getSafeRedirectPath(next));

  return callbackUrl.toString();
}
