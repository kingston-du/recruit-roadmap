import type { CaptureResult, Properties } from "posthog-js";

export const analyticsEventNames = [
  "signup_completed",
  "player_profile_saved",
  "target_created",
  "third_target_created",
  "free_limit_hit",
  "upgrade_clicked",
  "roadmap_card_clicked",
  "my_plan_created",
  "event_created",
  "contact_created",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsBillingInterval = "monthly" | "yearly";
export type AnalyticsLimitType = "target" | "contact" | "event" | "outreach";
export type AnalyticsPlanTier = "free" | "pro";
export type AnalyticsSource =
  | "signup_redirect"
  | "pricing_page"
  | "target_limit_banner"
  | "target_limit_drawer"
  | "contact_limit_drawer"
  | "event_limit_drawer"
  | "outreach_limit_drawer"
  | "inline_target_limit"
  | "inline_contact_limit"
  | "inline_event_limit"
  | "inline_outreach_limit"
  | "target_add_button"
  | "contact_add_button"
  | "event_add_button"
  | "outreach_add_button"
  | "target_form"
  | "contact_form"
  | "event_form"
  | "player_profile_form"
  | "my_plan_form"
  | "roadmap_card";

export type AnalyticsProperties = {
  "$current_url"?: string;
  "$host"?: string;
  "$pathname"?: string;
  billing_interval?: AnalyticsBillingInterval;
  contact_count?: number;
  event_count?: number;
  event_type?: string;
  limit_count?: number;
  limit_type?: AnalyticsLimitType;
  page_name?: string;
  page_path?: string;
  path_count?: number;
  plan_tier?: AnalyticsPlanTier;
  source?: AnalyticsSource;
  target_count?: number;
  target_type?: string;
  used_count?: number;
};

const analyticsEventNameSet = new Set<string>(analyticsEventNames);
const allowedEventNames = new Set<string>(["$pageview", ...analyticsEventNames]);
const allowedPropertyKeys = new Set<string>([
  "$current_url",
  "$host",
  "$pathname",
  "billing_interval",
  "contact_count",
  "event_count",
  "event_type",
  "limit_count",
  "limit_type",
  "page_name",
  "page_path",
  "path_count",
  "plan_tier",
  "source",
  "target_count",
  "target_type",
  "used_count",
]);
const postHogInternalPropertyKeys = new Set<string>(["distinct_id", "token"]);
const forbiddenPropertyNamePattern =
  /(^|[_-])(coach_email|email|first_name|gpa|last_name|notes?|phone|player_name)([_-]|$)/i;
const emailValuePattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const likelyPhoneValuePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/;

function isPlainSafeKey(key: string) {
  return allowedPropertyKeys.has(key) || postHogInternalPropertyKeys.has(key);
}

function isForbiddenPropertyKey(key: string) {
  return !allowedPropertyKeys.has(key) && forbiddenPropertyNamePattern.test(key);
}

export function sanitizeAnalyticsPath(value: unknown) {
  if (typeof value !== "string") {
    return "/";
  }

  const path = value.split(/[?#]/)[0] || "/";

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function sanitizeUrlValue(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${sanitizeAnalyticsPath(url.pathname)}`;
  } catch {
    return sanitizeAnalyticsPath(value);
  }
}

function sanitizeOrigin(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function sanitizeHost(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value).host;
  } catch {
    return undefined;
  }
}

function hasSensitiveStringValue(value: string) {
  return emailValuePattern.test(value) || likelyPhoneValuePattern.test(value);
}

function sanitizeScalarValue(key: string, value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed || trimmed.length > 160) {
    return undefined;
  }

  if (key === "$current_url" || key.toLowerCase().includes("url")) {
    const sanitizedUrl = sanitizeUrlValue(trimmed);
    return hasSensitiveStringValue(sanitizedUrl) ? undefined : sanitizedUrl;
  }

  if (key === "$host") {
    const sanitizedHost = trimmed.includes("://")
      ? sanitizeHost(trimmed)
      : sanitizeHost(`https://${trimmed}`);
    return sanitizedHost && !hasSensitiveStringValue(sanitizedHost) ? sanitizedHost : undefined;
  }

  if (key === "$pathname" || key === "page_path") {
    const sanitizedPath = sanitizeAnalyticsPath(trimmed);
    return hasSensitiveStringValue(sanitizedPath) ? undefined : sanitizedPath;
  }

  if (hasSensitiveStringValue(trimmed)) {
    return undefined;
  }

  return trimmed;
}

export function sanitizeAnalyticsProperties(
  properties: AnalyticsProperties | Record<string, unknown>,
) {
  const safeProperties: Record<string, string | number | boolean> = {};

  Object.entries(properties).forEach(([key, value]) => {
    if (!isPlainSafeKey(key) || isForbiddenPropertyKey(key)) {
      return;
    }

    const safeValue = sanitizeScalarValue(key, value);

    if (safeValue !== undefined) {
      safeProperties[key] = safeValue;
    }
  });

  return safeProperties;
}

function sanitizePostHogProperties(properties: Properties | undefined) {
  const safeProperties: Properties = {};

  Object.entries(properties ?? {}).forEach(([key, value]) => {
    if (isForbiddenPropertyKey(key)) {
      return;
    }

    if (!key.startsWith("$") && !isPlainSafeKey(key)) {
      return;
    }

    const safeValue = sanitizeScalarValue(key, value);

    if (safeValue !== undefined) {
      safeProperties[key] = safeValue;
    }
  });

  return safeProperties;
}

export function sanitizePostHogCapture(captureResult: CaptureResult | null) {
  if (!captureResult || !allowedEventNames.has(String(captureResult.event))) {
    return null;
  }

  return {
    ...captureResult,
    $set: undefined,
    $set_once: undefined,
    properties: sanitizePostHogProperties(captureResult.properties),
  } satisfies CaptureResult;
}

export function pageNameFromPathname(pathname: string) {
  const path = sanitizeAnalyticsPath(pathname);

  if (path === "/") {
    return "Home";
  }

  const [segment] = path.slice(1).split("/");

  switch (segment) {
    case "admin":
      return "Admin";
    case "disclaimer":
      return "Disclaimer";
    case "login":
      return "Login";
    case "my-plan":
      return "My Plan";
    case "my-player":
      return "My Player";
    case "pricing":
      return "Pricing";
    case "privacy":
      return "Privacy";
    case "roadmap":
      return "Roadmap";
    case "settings":
      return "Settings";
    case "setup-assist":
      return "Setup Assist";
    case "signup":
      return "Signup";
    case "targets":
      return "Targets";
    case "terms":
      return "Terms";
    case "today":
      return "Today";
    default:
      return "Unknown";
  }
}

export function buildPageViewProperties(pathname: string, origin?: string) {
  const pagePath = sanitizeAnalyticsPath(pathname);
  const safeOrigin = sanitizeOrigin(origin);
  const safeHost = sanitizeHost(safeOrigin);

  return sanitizeAnalyticsProperties({
    "$current_url": safeOrigin ? `${safeOrigin}${pagePath}` : pagePath,
    "$host": safeHost,
    "$pathname": pagePath,
    page_name: pageNameFromPathname(pagePath),
    page_path: pagePath,
  });
}

export function appendSignupCompletedMarker(path: string) {
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  const url = new URL(safePath, "https://hockey-pathway.local");
  url.searchParams.set("signup", "completed");

  return `${url.pathname}${url.search}`;
}

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNameSet.has(value);
}
