import { expect, test } from "@playwright/test";

const hasCredentials = Boolean(process.env.E2E_TEST_EMAIL && process.env.E2E_TEST_PASSWORD);
const runId = Date.now();

test.describe("Authenticated recruiting tracker flow", () => {
  test.skip(!hasCredentials, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD to run the full authenticated flow.");

  // Validates a real user can create onboarding data, set a path, add targets/coaches, update status, and delete a target.
  test("new user onboarding and target management flow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "Full data mutation flow runs on desktop only.");

    await page.goto("/login?next=/my-player");
    await page.getByLabel("Email").fill(process.env.E2E_TEST_EMAIL ?? "");
    await page.getByLabel("Password").fill(process.env.E2E_TEST_PASSWORD ?? "");
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/my-player/);
    await page.getByLabel("First name").fill("E2E");
    await page.getByLabel("Last name optional").fill(`Player ${runId}`);
    await page.getByLabel("Birth year").fill("2009");
    await page.getByLabel("Position").selectOption("Defense");
    await page.getByLabel("Shoots").selectOption("Right");
    await page.getByLabel("Height").fill("5'10\"");
    await page.getByLabel("Weight").fill("165 lbs");
    await page.getByLabel("Current team").fill("E2E Test Team");
    await page.getByLabel("Current level").fill("Prep");
    await page.getByLabel("Path you are considering").fill("USHL to NCAA D1");
    await page.getByLabel("Player and family goals").fill("Exercise the authenticated QA flow.");
    await page.getByLabel("Video links optional").fill("https://example.com/highlight");
    await page.getByRole("button", { name: /save player profile/i }).click();
    await expect(page.getByText("Player profile saved.")).toBeVisible();

    await page.goto("/my-plan");
    await page.getByLabel("Plan name").fill(`E2E plan ${runId}`);
    await page.getByLabel("Family focus optional").fill("USHL to NCAA D1 test pathway.");
    await page.getByRole("button", { name: /save plan/i }).click();
    await expect(page.getByText("Plan saved.")).toBeVisible();
    await page.getByRole("button", { name: /add path/i }).click();
    await page.getByLabel("Path name").fill(`E2E USHL to NCAA D1 ${runId}`);
    await page.getByLabel("What this path is for").fill("Testing roadmap-linked plan behavior.");
    await page.getByRole("button", { name: /^add path$/i }).click();
    await expect(page.getByText("Path added.")).toBeVisible();

    await page.goto("/roadmap");
    await page.getByRole("button", { name: /open USHL details/i }).click();
    await expect(page.getByRole("dialog", { name: "USHL" })).toBeVisible();
    await page.getByRole("button", { name: /close details/i }).click();

    await page.goto("/targets");
    const targetNames = [`E2E School A ${runId}`, `E2E School B ${runId}`, `E2E School C ${runId}`];
    for (const [index, targetName] of targetNames.entries()) {
      await page.getByRole("button", { name: /add target/i }).click();
      await page.getByLabel("Team, school, camp, or league name").fill(targetName);
      await page.getByLabel("What kind of target is this?").selectOption("school");
      await page.getByLabel("Level optional").fill(index === 0 ? "NCAA D1" : "Prep");
      await page.getByLabel("Location optional").fill("Test City, ST");
      await page.getByLabel("Current stage").selectOption(index === 0 ? "Researching" : index === 1 ? "Contacted" : "Interested / Next Step");
      await page.getByLabel("Connected plan path optional").fill(`E2E USHL to NCAA D1 ${runId}`);
      await page.getByRole("button", { name: /^add target$/i }).click();
      await expect(page.getByText("Target added.")).toBeVisible();

      await page.getByRole("button", { name: new RegExp(targetName) }).click();
      await page.getByRole("button", { name: /add contact/i }).click();
      await page.getByLabel("Contact name").fill(`Coach ${index + 1}`);
      await page.getByLabel("Coach or staff role").fill("Head coach");
      await page.getByLabel("Email").fill(`coach${index + 1}-${runId}@example.com`);
      await page.getByRole("button", { name: /^add contact$/i }).click();
      await expect(page.getByText("Contact added.")).toBeVisible();
      await page.getByRole("button", { name: /close drawer/i }).click();
    }

    await page.getByRole("button", { name: new RegExp(targetNames[0]) }).click();
    await page.getByRole("button", { name: /edit target/i }).click();
    await page.getByLabel("Current stage").selectOption("Contacted");
    await page.getByRole("button", { name: /save target/i }).click();
    await expect(page.getByText("Target updated.")).toBeVisible();

    await page.getByRole("button", { name: new RegExp(targetNames[2]) }).click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: /^delete$/i }).click();
    await expect(page.getByText("Target deleted.")).toBeVisible();
    await expect(page.getByRole("button", { name: new RegExp(targetNames[2]) })).toHaveCount(0);
  });
});
