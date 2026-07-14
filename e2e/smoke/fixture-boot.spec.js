import { test, expect } from "@playwright/test";

const fixturePath = process.env.E2E_FIXTURE_PATH || "/e2e/fixture/channel.html";

test.describe.configure({ mode: "parallel" });

test.describe("E2E fixture target", () => {
  test("fixture page boots BillTube overlay", async ({ page }) => {
    await page.goto(fixturePath, { waitUntil: "domcontentloaded" });

    await expect(page.getByTestId("btfw-grid")).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId("btfw-boot-overlay")).toHaveCount(0);
    await expect(page.getByTestId("cytube-messagebuffer")).toBeVisible();
    await expect(page.getByTestId("cytube-videowrap")).toBeVisible();
  });

  test("fixture reports boot failure when a bundle fails to load", async ({ page }) => {
    await page.route("**/dist/core.bundle.js*", (route) => route.abort());
    await page.goto(fixturePath, { waitUntil: "domcontentloaded" });

    const bootStatus = page.getByRole("status");
    await expect(bootStatus).toBeVisible({ timeout: 30_000 });
    await expect(bootStatus).toHaveAttribute("data-state", "error");
    await expect(bootStatus).toContainText(/went wrong|refresh to retry/i);
    await expect(page.getByTestId("btfw-grid")).toHaveCount(0);
  });
});
