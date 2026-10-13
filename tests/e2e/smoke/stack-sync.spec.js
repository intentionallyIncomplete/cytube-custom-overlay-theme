import { test, expect } from "@playwright/test";
import { gotoFixtureAndBoot } from "../helpers/boot.js";
import { installSocketRecorder, emitSocketEvent } from "../helpers/socket-recorder.js";

/**
 * Characterization tests for feature-stack sync behavior (#228 Phase 0).
 *
 * These pin CURRENT observable behavior of the stack panels — group creation,
 * MOTD visibility sync, socket-driven sync (setMotd/newPoll/closePoll), and
 * toggle persistence — so the Phase 1–4 module split can be verified against
 * the same behavior. Assertions intentionally mirror today's behavior, warts
 * included; change them only when a behavior change is deliberate.
 */

const STACK_ITEM = (bind) => `#btfw-stack .btfw-stack-item[data-bind="${bind}"]`;

test.describe("feature-stack characterization (#228 Phase 0)", () => {
  test.beforeEach(async ({ page }) => {
    await installSocketRecorder(page);
    await gotoFixtureAndBoot(page);
    // boot() runs on btfw:layoutReady or a 1200ms fallback; the stack items
    // must exist before any sync assertion is meaningful.
    await expect(page.locator(STACK_ITEM("motd-group"))).toBeAttached();
    await expect(page.locator(STACK_ITEM("playlist-group"))).toBeAttached();
    await expect(page.locator(STACK_ITEM("poll-group"))).toBeAttached();
  });

  test("boot creates the three stack groups in priority order and adopts the panels", async ({ page }) => {
    const binds = await page.$$eval(
      '#btfw-stack .btfw-stack-item[data-group="true"]',
      (els) => els.map((e) => e.dataset.bind)
    );
    expect(binds).toEqual(["motd-group", "playlist-group", "poll-group"]);

    // motdwrap is adopted into the motd group body
    await expect(page.locator(`${STACK_ITEM("motd-group")} #motdwrap`)).toHaveCount(1);

    // pollwrap is detached from the playlist row and adopted by the poll group
    await expect(page.locator(`${STACK_ITEM("poll-group")} #pollwrap`)).toHaveCount(1);
    const pollInPlaylist = await page.evaluate(
      () => !!document.querySelector("#playlistrow #pollwrap, #playlistwrap #pollwrap")
    );
    expect(pollInPlaylist).toBe(false);

    // stack order is persisted
    const savedOrder = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("btfw-stack-order") || "[]")
    );
    expect(savedOrder.map((e) => e.id)).toEqual(["motd-group", "playlist-group", "poll-group"]);
  });

  test("MOTD visibility syncs with content: empty hides motdwrap, content restores it", async ({ page }) => {
    // Fixture MOTD has content -> visible with content open by default
    await expect(page.locator("#motdwrap")).toBeVisible();

    await page.evaluate(() => {
      document.querySelector("#motd").replaceChildren();
    });
    await expect(page.locator("#motdwrap")).toBeHidden();
    await expect(page.locator("#motdwrap")).toHaveClass(/btfw-motd-empty/);

    await page.evaluate(() => {
      const p = document.createElement("p");
      p.textContent = "Welcome back";
      document.querySelector("#motd").replaceChildren(p);
    });
    await expect(page.locator("#motdwrap")).toBeVisible();
    await expect(page.locator("#motdwrap")).not.toHaveClass(/btfw-motd-empty/);
  });

  test("setMotd socket event repaints sanitized HTML into #motd", async ({ page }) => {
    await emitSocketEvent(
      page,
      "setMotd",
      '<p>Hello<script>window.__xss=1</script><img src=x onerror="window.__xss=1"></p>'
    );

    const motdHtml = await page.evaluate(() => document.querySelector("#motd").innerHTML);
    expect(motdHtml).not.toContain("<script");
    expect(motdHtml).not.toContain("onerror");
    await expect(page.locator("#motd")).toContainText("Hello");
    expect(await page.evaluate(() => window.__xss)).toBeUndefined();
  });

  test("newPoll socket event force-opens the poll group", async ({ page }) => {
    await emitSocketEvent(page, "newPoll", {});
    await expect(page.locator(STACK_ITEM("poll-group"))).toHaveAttribute("data-open", "true");
  });

  test("closePoll socket event syncs without detaching the poll group", async ({ page }) => {
    await emitSocketEvent(page, "closePoll", {});
    await page.waitForTimeout(150);
    await expect(page.locator(STACK_ITEM("poll-group"))).toBeAttached();
    await expect(page.locator(`${STACK_ITEM("poll-group")} #pollwrap`)).toHaveCount(1);
  });

  test("motd toggle click persists the closed preference", async ({ page }) => {
    const toggle = page.locator(`${STACK_ITEM("motd-group")} .btfw-motd-toggle`).first();
    await expect(toggle).toBeAttached();
    await toggle.click();
    await expect(page.locator(STACK_ITEM("motd-group"))).toHaveAttribute("data-open", "false");
    const stored = await page.evaluate(() => localStorage.getItem("btfw-stack-motd-open"));
    expect(stored).toBe("false");
  });
});
