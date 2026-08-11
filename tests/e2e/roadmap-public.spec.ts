import { expect, test } from "@playwright/test";

test.describe("public roadmap site", () => {
  test("homepage loads the public guide", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Hockey Pathway" })).toBeVisible();
    await expect(page.getByRole("link", { name: /see the roadmap/i })).toBeVisible();
    await expect(page.getByText(/No accounts, payments, scraping, AI, or marketplace/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /log in/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /pricing/i })).toHaveCount(0);
  });

  test("roadmap links to league pages", async ({ page }) => {
    await page.goto("/roadmap");

    await page.getByRole("link", { name: /United States Hockey League/i }).click();
    await expect(page).toHaveURL(/\/leagues\/ushl$/);
    await expect(page.getByRole("heading", { name: "United States Hockey League" })).toBeVisible();
    await expect(page.getByText(/A Few Things To Consider/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /USHL official site/i })).toBeVisible();
  });

  test("old product routes redirect to the roadmap", async ({ page }) => {
    for (const route of ["/login", "/signup", "/pricing", "/today", "/my-plan", "/targets"]) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/roadmap$/);
    }
  });
});
