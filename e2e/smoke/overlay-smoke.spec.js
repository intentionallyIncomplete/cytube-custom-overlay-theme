import { test, expect } from "@playwright/test";
import { FIXTURE_PATH, gotoFixtureAndBoot } from "../helpers/boot.js";

test.describe.configure({ mode: "parallel" });

test.describe("smoke: app boot", () => {
  test("loads framework and dismisses boot overlay", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    await expect(page.getByTestId("btfw-grid")).toBeVisible();
    await expect(page.getByTestId("btfw-boot-overlay")).toHaveCount(0);
  });
});

test.describe("smoke: overlay load", () => {
  test("mounts layout grid, video stage, and video overlay chrome", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    await expect(page.getByTestId("btfw-video-stage")).toBeVisible();
    await expect(page.getByTestId("btfw-video-overlay")).toBeVisible();
    await expect(page.getByTestId("btfw-chatcol")).toBeVisible();
  });
});

test.describe("smoke: chat and player rendering", () => {
  test("renders chat chrome and player shell", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    await expect(page.getByTestId("btfw-chat-topbar")).toBeVisible();
    await expect(page.getByTestId("btfw-chat-bottombar")).toBeVisible();
    await expect(page.getByTestId("cytube-messagebuffer")).toBeVisible();
    await expect(page.getByLabel("Chat message")).toBeVisible();

    await expect(page.getByTestId("cytube-videowrap")).toBeVisible();
    await expect(page.getByTestId("cytube-player")).toBeVisible();
  });
});

test.describe("smoke: failure path", () => {
  test("surfaces boot error when a required bundle fails", async ({ page }) => {
    await page.route("**/dist/core.bundle.js*", (route) => route.abort());
    await page.goto(FIXTURE_PATH, { waitUntil: "domcontentloaded" });

    const bootStatus = page.getByRole("status");
    await expect(bootStatus).toBeVisible({ timeout: 30_000 });
    await expect(bootStatus).toHaveAttribute("data-state", "error");
    await expect(bootStatus).toContainText(/went wrong|refresh to retry/i);
    await expect(page.getByTestId("btfw-grid")).toHaveCount(0);
  });
});
