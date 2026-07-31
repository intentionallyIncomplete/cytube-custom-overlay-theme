import { test, expect } from "@playwright/test";
import { gotoFixtureAndBoot } from "../helpers/boot.js";

test.describe.configure({ mode: "parallel" });

/** Fixture target sanity from #171 — full smoke coverage lives in overlay-smoke.spec.js (#170). */
test.describe("E2E fixture target", () => {
  test("fixture page boots BillTube overlay", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    await expect(page.getByTestId("btfw-grid")).toBeVisible();
    await expect(page.getByTestId("cytube-messagebuffer")).toBeVisible();
    await expect(page.getByTestId("cytube-videowrap")).toBeVisible();
  });
});
