import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseCssSelectors,
  auditCoverage,
} from "../../scripts/dead-selector-lib.js";

describe("parseCssSelectors", () => {
  it("extracts top-level rules including comma lists", () => {
    const css = "a { color: red; }\n.b, .c { padding: 0; }";
    const records = parseCssSelectors(css);
    assert.deepEqual(
      records.map((record) => record.selector),
      ["a", ".b", ".c"]
    );
    assert.ok(records.every((record) => record.mediaContext === ""));
  });

  it("records the wrapping @media chain as mediaContext", () => {
    const css =
      "@media (min-width: 1000px) { .wide { display: flex; } }";
    const records = parseCssSelectors(css);
    assert.equal(records.length, 1);
    assert.equal(records[0].selector, ".wide");
    assert.equal(records[0].mediaContext, "@media (min-width: 1000px)");
  });

  it("excludes @keyframes steps and @font-face descriptors", () => {
    const css = `
      @keyframes spin {
        from { transform: rotate(0); }
        50% { opacity: 0.5; }
        to { transform: rotate(360deg); }
      }
      @font-face { font-family: "Nope, .fake { }"; src: url(font.woff2); }
      .real { color: green; }
    `;
    const records = parseCssSelectors(css);
    assert.deepEqual(
      records.map((record) => record.selector),
      [".real"]
    );
  });

  it("ignores comments and braces or commas inside strings", () => {
    const css = "/* .ghost { } */\n.quote::before { content: \", { }\"; }";
    const records = parseCssSelectors(css);
    assert.deepEqual(
      records.map((record) => record.selector),
      [".quote::before"]
    );
  });

  it("handles nested conditional at-rules", () => {
    const css =
      "@supports (display: grid) { @media (max-width: 480px) { .tall { } } }";
    const records = parseCssSelectors(css);
    assert.equal(records.length, 1);
    assert.equal(
      records[0].mediaContext,
      "@supports (display: grid) @media (max-width: 480px)"
    );
  });
});

describe("auditCoverage", () => {
  it("counts matched and never-matched selectors per file", () => {
    const entries = [
      {
        file: "a.css",
        selectors: [
          { selector: ".x" },
          { selector: ".y" },
          { selector: ".z" },
        ],
      },
      { file: "b.css", selectors: [{ selector: ".x" }, { selector: ".w" }] },
    ];

    const result = auditCoverage(entries, new Set([".x"]));

    assert.equal(result.files[0].total, 3);
    assert.equal(result.files[0].matched, 1);
    assert.deepEqual(
      result.files[0].candidates.map((candidate) => candidate.selector),
      [".y", ".z"]
    );
    assert.equal(result.files[1].matched, 1);
    assert.equal(result.totals.selectors, 5);
    assert.equal(result.totals.matched, 2);
    assert.equal(result.totals.candidates, 3);
    assert.equal(result.distinct.selectors, 4);
    assert.equal(result.distinct.matched, 1);
    assert.equal(result.distinct.candidates, 3);
  });

  it("carries mediaContext on candidates", () => {
    const entries = [
      {
        file: "a.css",
        selectors: [
          { selector: ".m", mediaContext: "@media (max-width: 480px)" },
        ],
      },
    ];

    const result = auditCoverage(entries, new Set());

    assert.equal(
      result.files[0].candidates[0].mediaContext,
      "@media (max-width: 480px)"
    );
  });

  it("does not mutate the input entries", () => {
    const entries = [
      { file: "a.css", selectors: [{ selector: ".x" }] },
    ];
    auditCoverage(entries, new Set());
    assert.deepEqual(entries[0].selectors[0], { selector: ".x" });
  });
});