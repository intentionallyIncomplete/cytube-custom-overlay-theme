import { test, expect } from "@playwright/test";
import { gotoFixtureAndBoot } from "../helpers/boot.js";

test.describe("Chat scroll isolation", () => {
  test("chat area scrolling does not propagate to video/playlist area", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    // Wait for layout to be fully ready
    await page.waitForSelector("#btfw-grid.btfw-loaded");
    await page.waitForSelector("#messagebuffer");

    // Get initial scroll positions
    const initialChatScroll = await page.evaluate(() => {
      const msgBuffer = document.getElementById("messagebuffer");
      return msgBuffer ? msgBuffer.scrollTop : 0;
    });

    const initialStackScroll = await page.evaluate(() => {
      const queue = document.querySelector('#btfw-stack [data-bind="playlist-group"] #queue');
      return queue ? queue.scrollTop : 0;
    });

    // Simulate scrolling in chat area by wheeling over messagebuffer
    const messageBuffer = await page.locator("#messagebuffer");
    await messageBuffer.hover();
    
    // Wheel down in chat area
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(100);

    // Check chat scrolled
    const chatScrollAfter = await page.evaluate(() => {
      const msgBuffer = document.getElementById("messagebuffer");
      return msgBuffer ? msgBuffer.scrollTop : 0;
    });

    // Check stack/playlist did NOT scroll
    const stackScrollAfter = await page.evaluate(() => {
      const queue = document.querySelector('#btfw-stack [data-bind="playlist-group"] #queue');
      return queue ? queue.scrollTop : 0;
    });

    console.log("Chat scroll:", initialChatScroll, "->", chatScrollAfter);
    console.log("Stack scroll:", initialStackScroll, "->", stackScrollAfter);

    // Chat should have scrolled
    expect(chatScrollAfter).toBeGreaterThan(initialChatScroll);
    
    // Stack/playlist should NOT have scrolled (scroll isolation)
    expect(stackScrollAfter).toBe(initialStackScroll);
  });

  test("playlist area scrolling does not propagate to chat area", async ({ page }) => {
    await gotoFixtureAndBoot(page);

    // Wait for layout to be fully ready
    await page.waitForSelector("#btfw-grid.btfw-loaded");
    await page.waitForSelector("#messagebuffer");

    // Get initial scroll positions
    const initialChatScroll = await page.evaluate(() => {
      const msgBuffer = document.getElementById("messagebuffer");
      return msgBuffer ? msgBuffer.scrollTop : 0;
    });

    const initialStackScroll = await page.evaluate(() => {
      const queue = document.querySelector('#btfw-stack [data-bind="playlist-group"] #queue');
      return queue ? queue.scrollTop : 0;
    });

    // Simulate scrolling in playlist/stack area
    const queueElement = await page.locator('#btfw-stack [data-bind="playlist-group"] #queue');
    
    // Only test if queue exists and is scrollable
    const queueExists = await queueElement.count();
    if (queueExists > 0) {
      await queueElement.hover();
      
      // Wheel down in playlist area
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);

      // Check playlist scrolled
      const stackScrollAfter = await page.evaluate(() => {
        const queue = document.querySelector('#btfw-stack [data-bind="playlist-group"] #queue');
        return queue ? queue.scrollTop : 0;
      });

      // Check chat did NOT scroll
      const chatScrollAfter = await page.evaluate(() => {
        const msgBuffer = document.getElementById("messagebuffer");
        return msgBuffer ? msgBuffer.scrollTop : 0;
      });

      console.log("Chat scroll:", initialChatScroll, "->", chatScrollAfter);
      console.log("Stack scroll:", initialStackScroll, "->", stackScrollAfter);

      // If playlist scrolled, chat should NOT have scrolled
      if (stackScrollAfter > initialStackScroll) {
        expect(chatScrollAfter).toBe(initialChatScroll);
      }
    }
  });
});