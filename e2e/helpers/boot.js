import { expect } from "@playwright/test";

export const FIXTURE_PATH = process.env.E2E_FIXTURE_PATH || "/e2e/fixture/channel.html";

/** Navigate to the fixture and wait until BillTube layout is ready. */
export async function gotoFixtureAndBoot(page) {
  await page.goto(FIXTURE_PATH, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("btfw-grid")).toBeVisible({ timeout: 45_000 });
  await expect(page.getByTestId("btfw-boot-overlay")).toHaveCount(0);
}
