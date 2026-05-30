"use client";

import posthog from "posthog-js";

import {
  buildPageViewProperties,
  sanitizeAnalyticsProperties,
  sanitizePostHogCapture,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics";

let initialized = false;
let postHogReady = false;

type PendingCapture = {
  eventName: AnalyticsEventName | "$pageview";
  properties: Record<string, string | number | boolean>;
};

const pendingCaptures: PendingCapture[] = [];

const deniedPostHogProperties = [
  "$browser",
  "$browser_version",
  "$city_name",
  "$device",
  "$device_id",
  "$device_type",
  "$geoip_city_name",
  "$geoip_country_name",
  "$geoip_country_code",
  "$geoip_latitude",
  "$geoip_longitude",
  "$initial_current_url",
  "$initial_pathname",
  "$initial_referrer",
  "$initial_referring_domain",
  "$ip",
  "$os",
  "$os_version",
  "$referrer",
  "$referring_domain",
  "$screen_height",
  "$screen_width",
  "$session_id",
  "$user_agent",
  "$viewport_height",
  "$viewport_width",
  "$window_id",
];

function flushPendingCaptures() {
  pendingCaptures.splice(0).forEach(({ eventName, properties }) => {
    posthog.capture(eventName, properties);
  });
}

export function isPostHogConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_POSTHOG_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);
}

export function initializePostHog() {
  if (initialized) {
    return true;
  }

  if (typeof window === "undefined" || !isPostHogConfigured()) {
    return false;
  }

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2026-01-30",
    cookieless_mode: "always",
    persistence: "memory",
    disable_persistence: true,
    person_profiles: "never",
    autocapture: false,
    advanced_disable_decide: true,
    advanced_disable_feature_flags: true,
    advanced_disable_feature_flags_on_first_load: true,
    capture_dead_clicks: false,
    capture_exceptions: false,
    capture_heatmaps: false,
    capture_pageleave: false,
    capture_pageview: false,
    capture_performance: false,
    disable_conversations: true,
    disable_external_dependency_loading: true,
    disable_product_tours: true,
    disable_scroll_properties: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_web_experiments: true,
    internal_or_test_user_hostname: null,
    property_denylist: deniedPostHogProperties,
    rageclick: false,
    save_campaign_params: false,
    save_referrer: false,
    before_send: sanitizePostHogCapture,
    loaded: () => {
      postHogReady = true;
      flushPendingCaptures();
    },
  });

  initialized = true;
  return true;
}

function captureWhenReady(eventName: PendingCapture["eventName"], properties: PendingCapture["properties"]) {
  if (!initializePostHog()) {
    return;
  }

  if (!postHogReady) {
    pendingCaptures.push({ eventName, properties });
    return;
  }

  posthog.capture(eventName, properties);
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (!initializePostHog()) {
    return;
  }

  captureWhenReady(eventName, sanitizeAnalyticsProperties(properties));
}

export function trackPageView(pathname: string) {
  if (!initializePostHog()) {
    return;
  }

  captureWhenReady("$pageview", buildPageViewProperties(pathname, window.location.origin));
}
