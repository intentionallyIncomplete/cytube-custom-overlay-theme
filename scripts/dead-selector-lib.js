/**
 * Dead-selector audit helpers (issue #231).
 *
 * Pure functions over compiled CSS and crawl results: selector extraction
 * from `dist/css/*.css` and coverage diffing against the selectors that a
 * crawled page actually matched. No I/O — kept separate from the CLI so it
 * is unit-testable (tests/unit/dead-selector-lib.test.js).
 */

import postcss from "postcss";

/**
 * At-rules whose child rules are not CSS selectors (animation steps, margin
 * boxes, descriptors) and must be excluded from the audit.
 *
 * @type {ReadonlySet<string>}
 */
const NON_SELECTOR_AT_RULES = new Set([
  "keyframes",
  "page",
  "font-face",
  "property",
  "counter-style",
]);

/**
 * Parse compiled CSS text into selector records.
 *
 * @param {string} cssText Compiled (plain) CSS — e.g. a file from dist/css/.
 * @returns {Array<{ selector: string, mediaContext: string }>}
 *   Selector records in source order. `mediaContext` holds the wrapping
 *   conditional at-rule chain ("@media (max-width: 480px)") or "" for
 *   top-level rules.
 */
export function parseCssSelectors(cssText) {
  const root = postcss.parse(cssText);
  const records = [];

  root.walk((node) => {
    if (node.type !== "rule") {
      return;
    }
    if (isInsideNonSelectorAtRule(node)) {
      return;
    }
    const mediaContext = collectAtRuleChain(node);
    for (const selector of node.selectors) {
      records.push({ selector, mediaContext });
    }
  });

  return records;
}

/**
 * Report whether a rule sits under an at-rule that must be excluded
 * (e.g. @keyframes steps, @page margin boxes).
 *
 * @param {object} ruleNode A postcss rule node.
 * @returns {boolean}
 */
function isInsideNonSelectorAtRule(ruleNode) {
  for (let parent = ruleNode.parent; parent; parent = parent.parent) {
    if (
      parent.type === "atrule" &&
      NON_SELECTOR_AT_RULES.has(parent.name.toLowerCase())
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Build the conditional at-rule chain wrapping a rule, innermost-last.
 *
 * @param {object} ruleNode A postcss rule node.
 * @returns {string} e.g. "@media (min-width: 480px)" or "".
 */
function collectAtRuleChain(ruleNode) {
  const chain = [];
  for (let parent = ruleNode.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule") {
      const params = parent.params ? ` ${parent.params}` : "";
      chain.unshift(`@${parent.name}${params}`);
    }
  }
  return chain.join(" ");
}

/**
 * Diff parsed selectors against the set of selectors that matched at least
 * one element on a crawled page.
 *
 * @param {Array<{ file: string, selectors: Array<{ selector: string, mediaContext?: string }> }>} fileEntries
 *   Per-stylesheet parsed selectors.
 * @param {Set<string>} matchedSelectors Selectors seen matching on any page.
 * @returns {{
 *   files: Array<{ file: string, total: number, matched: number, candidates: Array<{ selector: string, mediaContext: string }> }>,
 *   totals: { selectors: number, matched: number, candidates: number },
 *   distinct: { selectors: number, matched: number, candidates: number }
 * }}
 */
export function auditCoverage(fileEntries, matchedSelectors) {
  const files = [];
  const distinctSelectors = new Set();
  const distinctMatched = new Set();

  for (const entry of fileEntries) {
    const candidates = [];
    let matched = 0;
    for (const record of entry.selectors) {
      distinctSelectors.add(record.selector);
      if (matchedSelectors.has(record.selector)) {
        matched += 1;
        distinctMatched.add(record.selector);
      } else {
        candidates.push({
          selector: record.selector,
          mediaContext: record.mediaContext ?? "",
        });
      }
    }
    files.push({
      file: entry.file,
      total: entry.selectors.length,
      matched,
      candidates,
    });
  }

  const totals = {
    selectors: files.reduce((sum, file) => sum + file.total, 0),
    matched: files.reduce((sum, file) => sum + file.matched, 0),
    candidates: files.reduce(
      (sum, file) => sum + file.candidates.length,
      0
    ),
  };

  return {
    files,
    totals,
    distinct: {
      selectors: distinctSelectors.size,
      matched: distinctMatched.size,
      candidates: distinctSelectors.size - distinctMatched.size,
    },
  };
}