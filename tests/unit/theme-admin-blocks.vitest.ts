import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  CSS_BLOCK_END,
  CSS_BLOCK_START,
  CSS_END_MARKERS,
  CSS_START_MARKERS,
  JS_BLOCK_END,
  JS_BLOCK_START,
  JS_END_MARKERS,
  JS_START_MARKERS,
  buildJsConfigBlock,
  hasBrokenThemeAdminJsMarkers,
  hasThemeAdminJsBlock,
  parseThemeAdminConfig,
  replaceThemeAdminBlock,
  wrapCssThemeBlock
} from "../../src/lib/theme-admin-blocks.js";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const CHANNEL_SNIPPET = readFileSync(
  join(REPO_ROOT, "src/config/channel_config_settings.js"),
  "utf8"
);

const BROKEN_LIVE_JS = `const CDN_BASE = "http://127.0.0.1:3000";

// BTFW_THEME_ADMIN_START
window.BTFW_THEME_ADMIN = {
  "version": 6,
  "tint": "custom",
  "branding": { "headerName": "from-snippet" }
};
// BTFW_THEME_ADMIN_END

==BTFW_THEME_ADMIN_START==
window.BTFW_THEME_ADMIN = {
  "version": 8,
  "tint": "midnight",
  "branding": { "headerName": "from-stale-merge" }
};
=BTFW_THEME_ADMIN_END==

// BTFW_LOADER_SENTINEL
(function (W, D) {
  W.BTFW_LOADED = true;
})(window, document);
`;

function assertParsesAsScript(source: string): void {
  // Channel JS is evaluated as a script; a SyntaxError here is the boot failure.
  expect(() => new Function(source)).not.toThrow();
}

describe("theme-admin channel JS sentinels", () => {
  it("keeps the checked-in channel snippet parseable", () => {
    assertParsesAsScript(CHANNEL_SNIPPET);
    expect(CHANNEL_SNIPPET).toContain(JS_BLOCK_START);
    expect(CHANNEL_SNIPPET).toContain(JS_BLOCK_END);
    expect(hasBrokenThemeAdminJsMarkers(CHANNEL_SNIPPET)).toBe(false);
    expect(parseThemeAdminConfig(CHANNEL_SNIPPET)).toMatchObject({ version: 6 });
  });

  it("treats uncommented == sentinels as a syntax-breaking stale merge", () => {
    expect(hasBrokenThemeAdminJsMarkers(BROKEN_LIVE_JS)).toBe(true);
    expect(() => new Function(BROKEN_LIVE_JS)).toThrow(SyntaxError);
  });

  it("strips stale raw sentinels and emits comment-wrapped JS that parses", () => {
    const next = buildJsConfigBlock(JSON.stringify({ version: 8, tint: "midnight" }, null, 2));
    const repaired = replaceThemeAdminBlock(
      BROKEN_LIVE_JS,
      next,
      JS_START_MARKERS,
      JS_END_MARKERS
    );

    assertParsesAsScript(repaired);
    expect(hasBrokenThemeAdminJsMarkers(repaired)).toBe(false);
    expect(repaired).toContain(JS_BLOCK_START);
    expect(repaired).toContain("// BTFW_LOADER_SENTINEL");
    expect(repaired).not.toMatch(/^==BTFW_THEME_ADMIN_START==/m);
    expect(parseThemeAdminConfig(repaired)).toEqual({ version: 8, tint: "midnight" });
    expect(hasThemeAdminJsBlock(repaired)).toBe(true);
  });

  it("parses the last theme-admin object when both snippet and stale blocks exist", () => {
    expect(parseThemeAdminConfig(BROKEN_LIVE_JS)).toEqual({
      version: 8,
      tint: "midnight",
      branding: { headerName: "from-stale-merge" }
    });
  });

  it("wraps CSS theme tokens in comments, not raw == sentinels", () => {
    const css = wrapCssThemeBlock(":root { --btfw-theme-accent: #fff; }");
    expect(css.startsWith("/* ==BTFW_THEME_ADMIN_START== */")).toBe(true);
    expect(css).toContain("/* ==BTFW_THEME_ADMIN_END== */");
    expect(css).not.toMatch(/^==BTFW_THEME_ADMIN/m);

    const replaced = replaceThemeAdminBlock(
      "==BTFW_THEME_ADMIN_START==\nold {}\n==BTFW_THEME_ADMIN_END==\nbody { color: red; }",
      css,
      CSS_START_MARKERS,
      CSS_END_MARKERS
    );
    expect(replaced).toContain("--btfw-theme-accent: #fff");
    expect(replaced).toContain("body { color: red; }");
    expect(replaced).not.toMatch(/^==BTFW_THEME_ADMIN/m);
  });
});

describe("#202 sentinel value formats (canonical write, legacy read)", () => {
  it("js writer emits only the canonical comment form and it reparses", () => {
    const js = buildJsConfigBlock('{"version":6}');
    expect(js.startsWith(JS_BLOCK_START)).toBe(true);
    expect(js.endsWith(JS_BLOCK_END)).toBe(true);
    expect(hasBrokenThemeAdminJsMarkers(js)).toBe(false);
    expect(parseThemeAdminConfig(`const a = 1;\n${js}\n`)).toEqual({ version: 6 });
  });

  it("css writer emits only the comment-wrapped canonical form", () => {
    const css = wrapCssThemeBlock(":root { --btfw-theme-accent: #123456; }");
    expect(css.startsWith(CSS_BLOCK_START)).toBe(true);
    expect(css.endsWith(CSS_BLOCK_END)).toBe(true);
    expect(hasBrokenThemeAdminJsMarkers(css)).toBe(false);
  });

  it("parser accepts legacy forms without producing them", () => {
    const legacy = [
      "// ==BTFW_THEME_ADMIN_START==",
      'window.BTFW_THEME_ADMIN = {"version":5};',
      "// ==BTFW_THEME_ADMIN_END=="
    ].join("\n");
    expect(parseThemeAdminConfig(legacy)).toEqual({ version: 5 });
    expect(hasBrokenThemeAdminJsMarkers(legacy)).toBe(false);

    const broken = [
      "==BTFW_THEME_ADMIN_START==",
      "window.BTFW_THEME_ADMIN = {};",
      "==BTFW_THEME_ADMIN_END=="
    ].join("\n");
    expect(hasBrokenThemeAdminJsMarkers(broken)).toBe(true);
  });
});
