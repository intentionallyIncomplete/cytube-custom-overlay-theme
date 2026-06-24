import test from "node:test";
import assert from "node:assert/strict";

function isMotdHtmlEmpty(html = "") {
  const raw = String(html || "").trim();
  if (!raw) return true;
  const text = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return !text;
}

function hasMotdContent(html = "") {
  return !isMotdHtmlEmpty(html);
}

test("motd content detection", () => {
  assert.equal(hasMotdContent(""), false);
  assert.equal(hasMotdContent("   "), false);
  assert.equal(hasMotdContent("<p><br></p>"), false);
  assert.equal(hasMotdContent("<p>&nbsp;</p>"), false);
  assert.equal(hasMotdContent("<p>Welcome</p>"), true);
});
