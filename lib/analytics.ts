import type { CaptureResult, Properties } from "posthog-js";

export const analyticsEventNames = [
  "league_source_clicked",
  "roadmap_filter_used",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsSource =
  | "home_featured_league"
  | "league_page_source"
  | "roadmap_filter"
  | "roadmap_node";

export type AnalyticsProperties = {
  "$cookieless_mode"?: boolean;
  "$current_url"?: string;
  "$host"?: string;
  "$pathname"?: string;
  event_type?: string;
  filter_type?: string;
  filter_value?: string;
  league_slug?: string;
  page_name?: string;
  page_path?: string;
  source?: AnalyticsSource;
};

const analyticsEventNameSet = new Set<string>(analyticsEventNames);
const allowedEventNames = new Set<string>(["$pageview", ...analyticsEventNames]);
const allowedPropertyKeys = new Set<string>([
  "$cookieless_mode",
  "$current_url",
  "$host",
  "$pathname",
  "event_type",
  "filter_type",
  "filter_value",
  "league_slug",
  "page_name",
  "page_path",
  "source",
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

    if (!isPlainSafeKey(key)) {
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
    case "disclaimer":
      return "Disclaimer";
    case "leagues":
      return "League";
    case "privacy":
      return "Privacy";
    case "roadmap":
      return "Roadmap";
    case "terms":
      return "Terms";
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

export function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNameSet.has(value);
}
