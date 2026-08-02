import { test, expect } from "@playwright/test";
import { gotoFixtureAndBoot } from "../helpers/boot.js";

async function openThemeSettings(page) {
  await page.evaluate(() => {
    document.dispatchEvent(new CustomEvent("btfw:openThemeSettings"));
  });
  await expect(page.locator("#btfw-theme-modal")).toBeVisible();
}

test.describe("theme settings: dirty-state Apply button", () => {
  test("stays inside the modal footer and is not adopted by the stack footer", async ({ page }) => {
    await gotoFixtureAndBoot(page);
    await openThemeSettings(page);

    // Give feature:stack's delayed footer-adoption pass a chance to run —
    // regression guard for the bug where a bare `footer` tag selector
    // relocated modal footers (Apply/Close buttons) into the hidden
    // #btfw-stack-footer container.
    await page.waitForTimeout(1500);

    const applyBtn = page.locator("#btfw-theme-modal #btfw-ts-apply");
    await expect(applyBtn).toHaveCount(1);
    await expect(page.locator("#btfw-stack-footer #btfw-ts-apply")).toHaveCount(0);
  });

  test("reveals Apply after changing tint/font on the General tab", async ({ page }) => {
    await gotoFixtureAndBoot(page);
    await openThemeSettings(page);
    await page.waitForTimeout(1500);

    const applyBtn = page.locator("#btfw-theme-modal #btfw-ts-apply");
    await expect(applyBtn).toBeHidden();

    await page.selectOption("#btfw-user-tint", "aurora");
    await expect(applyBtn).toBeVisible();
  });

  test("reveals Apply after changing emote size or media scale on the Chat tab", async ({ page }) => {
    await gotoFixtureAndBoot(page);
    await openThemeSettings(page);
    await page.waitForTimeout(1500);

    await page.click('#btfw-ts-tabs li[data-tab="chat"] a');

    const applyBtn = page.locator("#btfw-theme-modal #btfw-ts-apply");
    await expect(applyBtn).toBeHidden();

    await page.selectOption("#btfw-emote-size", "big");
    await expect(applyBtn).toBeVisible();
  });
});
