/**
 * Channel JS/CSS sentinels for BillTube theme-admin config.
 *
 * These markers are written into CyTube Channel Settings textareas, so they
 * MUST be valid comments. Uncommented `==BTFW_THEME_ADMIN_*==` tokens are a
 * SyntaxError that aborts the rest of channel JS — including the loader that
 * injects billtube-fw.js — which leaves font icons and theme SVGs missing.
 */

export const JS_BLOCK_START = "// BTFW_THEME_ADMIN_START";
export const JS_BLOCK_END = "// BTFW_THEME_ADMIN_END";
export const CSS_BLOCK_START = "/* ==BTFW_THEME_ADMIN_START== */";
export const CSS_BLOCK_END = "/* ==BTFW_THEME_ADMIN_END== */";
export const LOADER_SENTINEL = "// BTFW_LOADER_SENTINEL";

/** Recognized JS start markers, longest-first so comment forms win over raw tokens. */
export const JS_START_MARKERS = Object.freeze([
  "// ==BTFW_THEME_ADMIN_START==",
  JS_BLOCK_START,
  "==BTFW_THEME_ADMIN_START=="
]);

/** Includes the stale merge artifact `=BTFW_THEME_ADMIN_END==` (one leading =). */
export const JS_END_MARKERS = Object.freeze([
  "// ==BTFW_THEME_ADMIN_END==",
  JS_BLOCK_END,
  "==BTFW_THEME_ADMIN_END==",
  "=BTFW_THEME_ADMIN_END=="
]);

export const CSS_START_MARKERS = Object.freeze([
  CSS_BLOCK_START,
  "==BTFW_THEME_ADMIN_START=="
]);

export const CSS_END_MARKERS = Object.freeze([
  CSS_BLOCK_END,
  "==BTFW_THEME_ADMIN_END=="
]);

/**
 * @param {string} text
 * @param {readonly string[]} startMarkers
 * @param {readonly string[]} endMarkers
 * @returns {{ start: number, end: number, startMarker: string, endMarker: string } | null}
 */
export function findLeftmostBlock(text, startMarkers, endMarkers) {
  if (!text) return null;

  let start = -1;
  let startMarker = "";
  for (const marker of startMarkers) {
    const idx = text.indexOf(marker);
    if (idx === -1) continue;
    if (start === -1 || idx < start || (idx === start && marker.length > startMarker.length)) {
      start = idx;
      startMarker = marker;
    }
  }
  if (start === -1) return null;

  const searchFrom = start + startMarker.length;
  let end = -1;
  let endMarker = "";
  for (const marker of endMarkers) {
    const idx = text.indexOf(marker, searchFrom);
    if (idx === -1) continue;
    if (end === -1 || idx < end || (idx === end && marker.length > endMarker.length)) {
      end = idx;
      endMarker = marker;
    }
  }
  if (end === -1) return null;

  return { start, end: end + endMarker.length, startMarker, endMarker };
}

function joinSections(parts, ensureTrailingNewline) {
  const filtered = (parts || [])
    .map((part) => (typeof part === "string" ? part : ""))
    .filter((part) => part.trim().length > 0);
  if (filtered.length === 0) {
    return ensureTrailingNewline ? "\n" : "";
  }
  let combined = filtered.join("\n\n");
  if (ensureTrailingNewline && !combined.endsWith("\n")) {
    combined += "\n";
  }
  return combined;
}

function stripAllBlocks(original, startMarkers, endMarkers) {
  let text = original;
  for (;;) {
    const found = findLeftmostBlock(text, startMarkers, endMarkers);
    if (!found) break;
    const before = text.slice(0, found.start).replace(/\s+$/, "");
    const after = text.slice(found.end).replace(/^\s+/, "");
    text = joinSections([before, after], false);
  }
  return text;
}

/**
 * Replace every recognized theme-admin block with `block`, inserting before
 * the loader sentinel when no block was present.
 *
 * @param {string} original
 * @param {string} block
 * @param {readonly string[]} startMarkers
 * @param {readonly string[]} endMarkers
 * @param {string} [loaderSentinel]
 * @returns {string}
 */
export function replaceThemeAdminBlock(
  original,
  block,
  startMarkers,
  endMarkers,
  loaderSentinel = LOADER_SENTINEL
) {
  const sanitizedBlock = (block || "").trim();
  if (!sanitizedBlock) return original;

  const hadTrailingNewline = /\n\s*$/.test(original);
  const stripped = stripAllBlocks(original, startMarkers, endMarkers);
  const loaderIdx = stripped.indexOf(loaderSentinel);

  if (loaderIdx !== -1) {
    const before = stripped.slice(0, loaderIdx).replace(/\s+$/, "");
    const after = stripped.slice(loaderIdx);
    return joinSections([before, sanitizedBlock, after], hadTrailingNewline);
  }

  const trimmed = stripped.trim();
  if (!trimmed) {
    return sanitizedBlock + "\n";
  }
  return joinSections([trimmed, sanitizedBlock], true);
}

export function buildJsConfigBlock(json) {
  return `${JS_BLOCK_START}\nwindow.BTFW_THEME_ADMIN = ${json};\n${JS_BLOCK_END}`;
}

export function wrapCssThemeBlock(innerCss) {
  return `${CSS_BLOCK_START}\n${innerCss.trim()}\n${CSS_BLOCK_END}`;
}

/**
 * Parse window.BTFW_THEME_ADMIN from channel JS. When multiple blocks exist,
 * the last successfully parsed object wins (theme-admin writes after the
 * checked-in snippet).
 *
 * @param {string} jsText
 * @returns {object | null}
 */
export function parseThemeAdminConfig(jsText) {
  if (!jsText) return null;
  let remaining = jsText;
  let last = null;
  for (;;) {
    const found = findLeftmostBlock(remaining, JS_START_MARKERS, JS_END_MARKERS);
    if (!found) break;
    const inner = remaining.slice(
      found.start + found.startMarker.length,
      found.end - found.endMarker.length
    );
    const match = inner.match(/window\.BTFW_THEME_ADMIN\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
      try {
        last = JSON.parse(match[1]);
      } catch {
        /* keep previous successful parse */
      }
    }
    remaining = remaining.slice(found.end);
  }
  return last;
}

export function hasThemeAdminJsBlock(jsText) {
  return findLeftmostBlock(jsText || "", JS_START_MARKERS, JS_END_MARKERS) !== null;
}

export function hasThemeAdminCssBlock(cssText) {
  return findLeftmostBlock(cssText || "", CSS_START_MARKERS, CSS_END_MARKERS) !== null;
}

/** True when channel JS still contains uncommented (syntax-breaking) sentinels. */
export function hasBrokenThemeAdminJsMarkers(jsText) {
  const text = jsText || "";
  return /(?:^|\n)\s*==BTFW_THEME_ADMIN_START==/.test(text)
    || /(?:^|\n)\s*=+BTFW_THEME_ADMIN_END==/.test(text);
}
