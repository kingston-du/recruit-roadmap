"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { cn } from "@/lib/utils";
import type { AnalyticsBillingInterval } from "@/lib/analytics";

export function CheckoutButton({
  href,
  children,
  disabledLabel,
  variant = "primary",
  billingInterval,
}: {
  href: string | undefined;
  children: ReactNode;
  disabledLabel: string;
  variant?: "primary" | "secondary";
  billingInterval?: AnalyticsBillingInterval;
}) {
  const buttonClassName = cn(
    "h-10 w-full rounded-md",
    variant === "primary"
      ? "bg-[#071a2f] text-white hover:bg-[#0b2745]"
      : "border-slate-300 bg-white text-slate-950 hover:bg-slate-50",
  );

  if (!href) {
    return (
      <Button
        type="button"
        disabled
        variant={variant === "secondary" ? "outline" : "default"}
        className={buttonClassName}
      >
        <LockKeyhole /> {disabledLabel}
      </Button>
    );
  }

  return (
    <Button asChild variant={variant === "secondary" ? "outline" : "default"} className={buttonClassName}>
      <a
        href={href}
        onClick={() => {
          trackAnalyticsEvent("upgrade_clicked", {
            billing_interval: billingInterval,
            plan_tier: "free",
            source: "pricing_page",
          });
        }}
      >
        {children} <ArrowRight />
      </a>
    </Button>
  );
}
