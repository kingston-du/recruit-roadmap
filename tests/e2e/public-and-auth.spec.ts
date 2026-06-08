import { expect, test } from "@playwright/test";

const privateRoutes = ["/today", "/my-plan", "/targets", "/my-player", "/settings", "/setup-assist", "/admin"];

test.describe("Public routes and unauthenticated behavior", () => {
  // Validates the public roadmap renders and route detail dialogs are usable.
  test("public roadmap opens route details", async ({ page }) => {
    await page.goto("/roadmap");

    await expect(page.getByRole("heading", { name: "Roadmap" })).toBeVisible();
    await page.getByRole("button", { name: /open USHL details/i }).click();
    const dialog = page.getByRole("dialog", { name: "USHL" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("What to research", { exact: true })).toBeVisible();
  });

  // Validates private app sections require authentication and preserve a safe next route.
  test("private routes redirect anonymous users to login", async ({ page }) => {
    for (const route of privateRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`/login\\?next=${encodeURIComponent(route)}`));
    }
  });

  // Validates login and signup forms expose accessible labels and client-side constraints.
  test("login and signup forms are accessible and constrained", async ({ page }) => {
    await page.goto("/login?next=/targets");

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      await expect(page.locator('input[name="captchaToken"]')).toHaveCount(1);
    }
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/signup\?next=%2Ftargets/);
    await expect(page.getByText("Use at least 6 characters.")).toBeVisible();
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      await expect(page.locator('input[name="captchaToken"]')).toHaveCount(1);
    }
  });

  // Validates the pricing page communicates missing Stripe links without crashing checkout buttons.
  test("pricing page handles missing checkout links", async ({ page }) => {
    await page.goto("/pricing");

    await expect(
      page.getByRole("heading", { name: "Start free, upgrade only when tracking grows." }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /monthly checkout not ready/i })).toBeDisabled();
    await expect(page.getByRole("button", { name: /yearly checkout not ready/i })).toBeDisabled();
  });

  // Validates mobile public views do not render with horizontal viewport overflow.
  test("core public views fit the viewport on mobile", async ({ page }) => {
    for (const route of ["/", "/roadmap", "/pricing", "/login", "/signup"]) {
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    }
  });
});
