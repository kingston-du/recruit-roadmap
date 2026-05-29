import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/analytics-client", () => ({
  initializePostHog: vi.fn(),
  trackAnalyticsEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

import { trackAnalyticsEvent } from "@/lib/analytics-client";
import { CheckoutButton } from "@/components/recruit/checkout-button";

describe("CheckoutButton", () => {
  beforeEach(() => {
    vi.mocked(trackAnalyticsEvent).mockClear();
  });

  it("tracks pro upgrade clicks with billing interval metadata", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutButton
        href="https://checkout.stripe.com/test"
        disabledLabel="Monthly checkout not ready"
        billingInterval="monthly"
      >
        Upgrade monthly
      </CheckoutButton>,
    );
    const link = screen.getByRole("link", { name: /upgrade monthly/i });
    link.addEventListener("click", (event) => event.preventDefault());

    await user.click(link);

    expect(trackAnalyticsEvent).toHaveBeenCalledWith("upgrade_clicked", {
      billing_interval: "monthly",
      plan_tier: "free",
      source: "pricing_page",
    });
  });

  it("does not track disabled checkout buttons", () => {
    render(
      <CheckoutButton href={undefined} disabledLabel="Monthly checkout not ready">
        Upgrade monthly
      </CheckoutButton>,
    );

    expect(screen.getByRole("button", { name: /monthly checkout not ready/i })).toBeDisabled();
    expect(trackAnalyticsEvent).not.toHaveBeenCalled();
  });
});
