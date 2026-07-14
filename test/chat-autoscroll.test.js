import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAutoScrollEnabled,
  isPinnedToBottom,
  shouldAutoScroll
} from "../src/lib/chat-autoscroll.js";

describe("chat-autoscroll", () => {
  it("defaults auto-scroll to enabled", () => {
    assert.equal(getAutoScrollEnabled(null), true);
    assert.equal(getAutoScrollEnabled(undefined), true);
  });

  it("respects stored off preference", () => {
    assert.equal(getAutoScrollEnabled("0"), false);
    assert.equal(getAutoScrollEnabled("1"), true);
  });

  it("detects pinned-to-bottom within threshold", () => {
    assert.equal(isPinnedToBottom(900, 1000, 100), true);
    assert.equal(isPinnedToBottom(800, 1000, 100), false);
  });

  it("always scrolls when preference is on", () => {
    assert.equal(
      shouldAutoScroll({ autoScrollEnabled: true, scrollChatFlag: false, pinnedToBottom: false }),
      true
    );
  });

  it("skips scroll when preference is off and user scrolled up", () => {
    assert.equal(
      shouldAutoScroll({ autoScrollEnabled: false, scrollChatFlag: false, pinnedToBottom: false }),
      false
    );
  });

  it("scrolls when preference is off but user is at bottom", () => {
    assert.equal(
      shouldAutoScroll({ autoScrollEnabled: false, scrollChatFlag: true, pinnedToBottom: true }),
      true
    );
  });
});
