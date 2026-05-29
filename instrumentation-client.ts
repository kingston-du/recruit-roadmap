import { initializePostHog } from "@/lib/analytics-client";

try {
  initializePostHog();
} catch {
  // Analytics should never block the app from hydrating.
}
