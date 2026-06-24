import test from "node:test";
import assert from "node:assert/strict";

const LS_HOVER_MAGNIFY = "btfw:chat:imageHoverMagnify";

function parseHoverMagnify(stored) {
  return (stored ?? "0") === "1";
}

function applyHoverMagnify(doc, on) {
  if (on) doc.documentElement.dataset.btfwChatHoverMagnify = "1";
  else delete doc.documentElement.dataset.btfwChatHoverMagnify;
}

test("hover magnify defaults off", () => {
  assert.equal(parseHoverMagnify(null), false);
  assert.equal(parseHoverMagnify("1"), true);
  assert.equal(parseHoverMagnify("0"), false);
});

test("hover magnify toggles html data attribute", () => {
  const doc = { documentElement: { dataset: {} } };
  applyHoverMagnify(doc, true);
  assert.equal(doc.documentElement.dataset.btfwChatHoverMagnify, "1");
  applyHoverMagnify(doc, false);
  assert.equal(doc.documentElement.dataset.btfwChatHoverMagnify, undefined);
});

test("hover magnify storage key", () => {
  assert.equal(LS_HOVER_MAGNIFY, "btfw:chat:imageHoverMagnify");
});
