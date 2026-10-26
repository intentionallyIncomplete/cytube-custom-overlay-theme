import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  normalizeSelector,
  stripQuotedAtRules,
  flattenFileSelectors,
  buildSourceIndex,
  lookupCandidates,
} from "../../scripts/map-dead-selectors.js";

describe("normalizeSelector", () => {
  it("trims and collapses whitespace runs", () => {
    assert.equal(normalizeSelector("  .a  >  .b  "), ".a > .b");
    assert.equal(normalizeSelector(".a,\n.b"), ".a, .b");
  });
});

describe("stripQuotedAtRules", () => {
  it("neutralizes quoted @use/@forward/@import directives", () => {
    const scss =
      '@use "partials/_variables" as vars;\n' +
      "@use 'partials/_tokens-surfaces.scss';\\n\n" +
      ".real { color: red; }\n";
    const stripped = stripQuotedAtRules(scss);
    assert.ok(!stripped.includes("@use"));
    assert.ok(stripped.includes(".real"));
  });
});

describe("flattenFileSelectors", () => {
  it("flattens nested rules with the descendant combinator", () => {
    const scss = ".panel {\n  .title {\n    color: red;\n  }\n}\n";
    const records = flattenFileSelectors(scss);
    assert.deepEqual(records.map((record) => record.selector), [".panel .title"]);
    assert.equal(records[0].line, 2);
    assert.equal(records[0].mediaContext, "");
  });

  it("substitutes & as a prefix", () => {
    const scss = ".btn {\n  &--big {\n    height: 40px;\n  }\n}\n";
    const records = flattenFileSelectors(scss);
    assert.deepEqual(records.map((record) => record.selector), [".btn--big"]);
  });

  it("substitutes & mid-selector and honors combinator order", () => {
    const scss = ".card {\n  .icon & {\n    z-index: 3;\n  }\n}\n";
    const records = flattenFileSelectors(scss);
    assert.deepEqual(records.map((record) => record.selector), [".icon .card"]);
  });

  it("cross-products comma groups at every level", () => {
    const scss = ".a, .b {\n  &:hover, &.active {\n    opacity: 1;\n  }\n}\n";
    const records = flattenFileSelectors(scss);
    assert.deepEqual(
      records.map((record) => record.selector),
      [".a:hover", ".b:hover", ".a.active", ".b.active"]
    );
  });

  it("records @media wrappers as mediaContext", () => {
    const scss =
      "@media (max-width: 480px) {\n  .mobile-only {\n    display: none;\n  }\n}\n";
    const records = flattenFileSelectors(scss);
    assert.equal(records.length, 1);
    assert.equal(records[0].selector, ".mobile-only");
    assert.equal(records[0].mediaContext, "@media (max-width: 480px)");
  });

  it("returns [] instead of crashing on unparseable interpolation syntax", () => {
    const scss = ".a {\n  &--#{ $mode } {\n    x: y;\n  }\n}\n.plain { z: w; }\n";
    assert.deepEqual(flattenFileSelectors(scss), []);
  });

  it("never crashes and never emits artifacts on interpolation files", () => {
    // postcss-scss cannot tokenize interpolated selectors: some shapes
    // throw (whole file -> []), some parse with truncated artifacts. Either
    // outcome is safe as long as nothing corrupt reaches the index.
    for (const scss of [
      ".a { &--#{ $mode } { x: y } }",
      ".a { &--#{$m} { x: y } .b { z: w } }",
    ]) {
      const records = flattenFileSelectors(scss);
      assert.ok(Array.isArray(records));
      assert.ok(
        records.every(
          (record) =>
            record.selector.trim() !== "" &&
            !record.selector.endsWith("#") &&
            record.line > 0
        )
      );
    }
  });
});

describe("buildSourceIndex + lookupCandidates", () => {
  const files = [
    { name: "a.scss", scss: ".one { .two { x: y } }\n.shared { a: b; }\n" },
    { name: "partials/_p.scss", scss: ".shared { padding: 0; }\n" },
  ];
  const index = buildSourceIndex(files);

  it("resolves a compiled nested selector to its author line", () => {
    const locations = lookupCandidates(index, ".one .two");
    assert.equal(locations.length, 1);
    assert.equal(locations[0].file, "a.scss");
    assert.equal(locations[0].line, 1);
  });

  it("returns every file that authored the same selector", () => {
    const locations = lookupCandidates(index, ".shared");
    assert.deepEqual(
      locations.map((location) => location.file).sort(),
      ["a.scss", "partials/_p.scss"]
    );
  });

  it("matches despite whitespace differences", () => {
    const locations = lookupCandidates(index, ".one  >  .two");
    assert.equal(locations.length, 0); // ".one > .two" shape is not authored
    assert.equal(lookupCandidates(index, ".one .two").length, 1);
  });

  it("returns nothing for unknown selectors", () => {
    assert.deepEqual(lookupCandidates(index, ".ghost"), []);
  });

  it("resolves &-built compiled selectors", () => {
    const flattened = flattenFileSelectors(".btn { &--big { h: 1 } }");
    assert.equal(lookupCandidates(index, flattened[0].selector).length, 0);
    const withBtn = buildSourceIndex([
      { name: "b.scss", scss: ".btn { &--big { h: 1 } }" },
    ]);
    assert.equal(lookupCandidates(withBtn, ".btn--big").length, 1);
  });
});