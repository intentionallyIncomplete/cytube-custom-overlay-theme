import test from "node:test";
import assert from "node:assert/strict";

// Regex-based tag strip, deliberately not `probe.innerHTML = raw` + read `.textContent` (see
// .github/INNERHTML-AUDIT.md MEDIUM table, issue #201 Phase 3). This mirrors the implementation
// in feature-stack.js and feature-motd-editor.js exactly — both previously used a `<div>`-based DOM
// probe in the browser — that DOM probe could still fire `<img src=x onerror=...>` even though
// the probe element was never attached to the visible page, because "detached from the DOM" is
// not the same as "inert document". The regex approach never hands MOTD HTML to an HTML parser.
// (feature-motd-editor.js's copy of this bug was found and fixed during the Phase 3 LOW-table
// sweep — the original audit only caught the feature-stack.js instance.)
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

test("motd content detection ignores markup-only payloads (e.g. bare img tags)", () => {
  assert.equal(hasMotdContent('<img src=x onerror="alert(1)">'), false);
  assert.equal(hasMotdContent('<p>Welcome<img src=x onerror="alert(1)"></p>'), true);
});

function getMotdShouldOpen(stored, hasContent) {
  if (!hasContent) return false;
  if (stored !== null && stored !== undefined) return !!stored;
  return true;
}

test("motd hide preference is respected when content exists", () => {
  assert.equal(getMotdShouldOpen(false, true), false);
  assert.equal(getMotdShouldOpen(true, true), true);
  assert.equal(getMotdShouldOpen(null, true), true);
  assert.equal(getMotdShouldOpen(null, false), false);
});
