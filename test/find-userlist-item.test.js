import test from "node:test";
import assert from "node:assert/strict";
import {
  findUserlistItem,
  normalizeUserIdentifier
} from "../src/lib/find-userlist-item.js";

test("normalizeUserIdentifier strips trailing colon", () => {
  assert.equal(normalizeUserIdentifier("Alice:"), "Alice");
  assert.equal(normalizeUserIdentifier("  Bob  "), "Bob");
});

test("findUserlistItem matches data-name", () => {
  const item = { id: "alice-row" };
  const root = {
    querySelector(sel) {
      return sel.includes("Alice") ? item : null;
    },
    querySelectorAll() {
      return [];
    }
  };
  assert.equal(findUserlistItem("Alice:", root), item);
});
