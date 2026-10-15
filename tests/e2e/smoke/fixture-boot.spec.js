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

  // Regression guard for the pre-existing fixture-page error where the audio
  // engine's player binding called player.currentSrc() unguarded on the stub
  // videojs player (no currentSrc method) — surfacing as the minified
  // "o.player.currentSrc is not a function" on every watchdog tick.
  test("fixture boot logs no uncaught page errors", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await gotoFixtureAndBoot(page);
    // Allow late async work (audio watchdog, movie-suggestion boot, etc.) to run.
    await page.waitForTimeout(1500);

    expect(pageErrors).toEqual([]);
  });
});
