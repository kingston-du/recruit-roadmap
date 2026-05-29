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
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,
    capture_performance: false,
    disable_external_dependency_loading: true,
    disable_product_tours: true,
    disable_session_recording: true,
    disable_surveys: true,
    disable_surveys_automatic_display: true,
    disable_web_experiments: true,
    rageclick: false,
    before_send: sanitizePostHogCapture,
  });

  initialized = true;
  return true;
}

export function trackAnalyticsEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (!initializePostHog()) {
    return;
  }

  posthog.capture(eventName, sanitizeAnalyticsProperties(properties));
}

export function trackPageView(pathname: string) {
  if (!initializePostHog()) {
    return;
  }

  posthog.capture("$pageview", buildPageViewProperties(pathname, window.location.origin));
}
