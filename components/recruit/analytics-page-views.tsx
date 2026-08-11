"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackPageView } from "@/lib/analytics-client";

export function AnalyticsPageViews() {
  const pathname = usePathname();
  const lastTrackedPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPathnameRef.current === pathname) {
      return;
    }

    lastTrackedPathnameRef.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
