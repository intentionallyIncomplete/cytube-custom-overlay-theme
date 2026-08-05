import test from "node:test";
import assert from "node:assert/strict";

// Mirrors feature-notification-sounds.js's plainText() — a regex-based tag strip + entity
// decode used instead of `element.innerHTML = html` for untrusted chat message text. See
// .github/INNERHTML-AUDIT.md MEDIUM table (issue #201 Phase 3): setting innerHTML on a
// live-document element (even one never attached to the visible DOM) can still fire
// `<img src=x onerror=...>`, so this never hands attacker-controlled text to an HTML parser.
function decodeNumericEntity(code) {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return " ";
  try {
    return String.fromCodePoint(code);
  } catch {
    return " ";
  }
}

function plainText(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, dec) => decodeNumericEntity(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => decodeNumericEntity(parseInt(hex, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

test("plainText strips tags without leaving markup fragments", () => {
  assert.equal(plainText("<b>hey @Alice</b>"), "hey @Alice");
});

test("plainText neutralizes an img onerror payload to inert text", () => {
  const text = plainText('hey <img src=x onerror="alert(1)"> @Alice');
  assert.equal(text, "hey @Alice");
  assert.ok(!text.includes("<"), "no angle brackets should survive");
});

test("plainText decodes common named entities", () => {
  assert.equal(plainText("Tom&amp;Jerry&nbsp;show"), "Tom&Jerry show");
  assert.equal(plainText("&lt;3 &amp; &quot;stuff&quot;"), "<3 & \"stuff\"");
});

test("plainText decodes numeric and hex entities", () => {
  assert.equal(plainText("&#64;Alice"), "@Alice");
  assert.equal(plainText("&#x40;Alice"), "@Alice");
});

test("plainText collapses whitespace and trims", () => {
  assert.equal(plainText("  hey   @Alice  "), "hey @Alice");
});

test("plainText returns empty string for falsy input", () => {
  assert.equal(plainText(""), "");
  assert.equal(plainText(null), "");
  assert.equal(plainText(undefined), "");
});

test("plainText tolerates out-of-range numeric entities", () => {
  assert.equal(plainText("hey &#999999999; @Alice"), "hey @Alice");
  assert.equal(plainText("hey &#x110000; @Alice"), "hey @Alice");
});
