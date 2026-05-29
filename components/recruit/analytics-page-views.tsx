"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { pageNameFromPathname } from "@/lib/analytics";
import { trackAnalyticsEvent, trackPageView } from "@/lib/analytics-client";

export function AnalyticsPageViews() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lastTrackedPathnameRef = useRef<string | null>(null);
  const signupTrackedRef = useRef(false);

  useEffect(() => {
    if (!pathname || lastTrackedPathnameRef.current === pathname) {
      return;
    }

    lastTrackedPathnameRef.current = pathname;
    trackPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    if (!pathname || searchParams.get("signup") !== "completed" || signupTrackedRef.current) {
      return;
    }

    signupTrackedRef.current = true;
    trackAnalyticsEvent("signup_completed", {
      page_name: pageNameFromPathname(pathname),
      source: "signup_redirect",
    });

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete("signup");
    const nextQueryString = nextSearchParams.toString();

    router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  return null;
}
