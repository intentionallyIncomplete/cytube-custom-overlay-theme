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
    // Boot keeps settling for ~2.1s after the items attach (1000ms stored-state
    // pass + the 700ms populate interval x3). Interacting inside that window
    // races the boot writers — toggle clicks can be overwritten or read
    // mid-flight (flake, verified 2026-10-16). Wait it out before any test
    // interacts with the stack.
    await page.waitForFunction(() => localStorage.getItem("btfw-stack-order") !== null);
    await page.waitForTimeout(2300);
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

  test("playlist toggle click persists the closed preference", async ({ page }) => {
    const toggle = page.locator(`${STACK_ITEM("playlist-group")} .btfw-playlist-toggle`).first();
    await expect(toggle).toBeAttached();
    await toggle.click();
    await expect(page.locator(STACK_ITEM("playlist-group"))).toHaveAttribute("data-open", "false");
    const stored = await page.evaluate(() => localStorage.getItem("btfw-stack-playlist-open"));
    expect(stored).toBe("false");
  });

  test("poll toggle click flips the panel state and persists the new value", async ({ page }) => {
    // The poll group's boot state is nondeterministic on the fixture:
    // getDefaultPollOpen(stored, hasPollContent()) depends on whether other
    // modules have injected poll UI into #pollwrap by the time boot reads it
    // (observed both open and closed across runs). Pin the contract, not the
    // direction: the toggle flips data-open and persists the flipped value.
    const item = page.locator(STACK_ITEM("poll-group"));
    const initial = await item.getAttribute("data-open");
    const flipped = initial === "true" ? "false" : "true";
    const toggle = page.locator(`${STACK_ITEM("poll-group")} .btfw-poll-toggle`).first();
    await expect(toggle).toBeAttached();
    await toggle.click();
    await expect(item).toHaveAttribute("data-open", flipped);
    const stored = await page.evaluate(() => localStorage.getItem("btfw-stack-poll-open"));
    expect(stored).toBe(flipped);
  });

  test("down arrow reorder persists the new stack order", async ({ page }) => {
    const down = page.locator(`${STACK_ITEM("motd-group")} .btfw-down`).first();
    await expect(down).toBeAttached();
    await down.click();
    const binds = await page.$$eval(
      '#btfw-stack .btfw-stack-item[data-group="true"]',
      (els) => els.map((e) => e.dataset.bind)
    );
    expect(binds).toEqual(["playlist-group", "motd-group", "poll-group"]);
    const savedOrder = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("btfw-stack-order") || "[]")
    );
    expect(savedOrder.map((e) => e.id)).toEqual(["playlist-group", "motd-group", "poll-group"]);
  });

  test("dock button pins the panel to the panels menu bar", async ({ page }) => {
    const dockBtn = page.locator(`${STACK_ITEM("playlist-group")} .btfw-stack-dock-btn`).first();
    await expect(dockBtn).toBeAttached();
    await dockBtn.click();

    await expect(page.locator(STACK_ITEM("playlist-group"))).toHaveAttribute("data-docked", "true");
    await expect(page.locator(STACK_ITEM("playlist-group"))).toHaveClass(/btfw-stack-item--docked/);
    const stored = await page.evaluate(() => localStorage.getItem("btfw-stack-playlist-docked"));
    expect(stored).toBe("true");

    // Panel bar button for the docked group exists; menu button becomes visible
    await expect(page.locator('#btfw-panel-bar .btfw-panel-btn[data-group="playlist-group"]')).toBeAttached();
    await expect(page.locator("#btfw-panels-menu-btn")).toBeVisible();
  });

  test("panels menu button opens the bar and a docked panel click opens its flyout", async ({ page }) => {
    await page.locator(`${STACK_ITEM("playlist-group")} .btfw-stack-dock-btn`).first().click();
    const menuBtn = page.locator("#btfw-panels-menu-btn");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    await expect(page.locator("#btfw-panel-bar")).toHaveClass(/open/);
    await expect(page.locator("html")).toHaveClass(/btfw-panels-bar-open/);

    const panelBtn = page.locator('.btfw-panel-btn[data-group="playlist-group"]');
    await panelBtn.click();
    await expect(panelBtn).toHaveClass(/is-active/);
    await expect(page.locator("html")).toHaveClass(/btfw-panels-flyout-open/);
  });

  test("undock returns the docked panel to the stack", async ({ page }) => {
    await page.locator(`${STACK_ITEM("playlist-group")} .btfw-stack-dock-btn`).first().click();
    const menuBtn = page.locator("#btfw-panels-menu-btn");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    const panelBtn = page.locator('.btfw-panel-btn[data-group="playlist-group"]');
    await panelBtn.click();
    await expect(panelBtn).toHaveClass(/is-active/);

    await page.locator('.btfw-panel-btn[data-group="playlist-group"] .btfw-panel-undock').click();
    await expect(page.locator(STACK_ITEM("playlist-group"))).toHaveAttribute("data-docked", "false");
    await expect(page.locator('#btfw-stack .btfw-stack-item[data-bind="playlist-group"]')).toBeAttached();
    const stored = await page.evaluate(() => localStorage.getItem("btfw-stack-playlist-docked"));
    expect(stored).toBe("false");
  });
});
