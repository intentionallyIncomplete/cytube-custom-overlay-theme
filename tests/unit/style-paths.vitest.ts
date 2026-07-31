import { describe, expect, it } from "vitest";

import { CDN_ASSET_PATHS } from "../../src/lib/cdn-deploy.js";
import {
  CSS_ASSET_PATHS,
  CSS_OUTPUT_DIR,
  REQUIRED_CSS,
  STYLE_SOURCE_DIR,
} from "../../src/lib/style-paths.js";

describe("style paths (issue #208)", () => {
  it("keeps authored styles under src/styles", () => {
    expect(STYLE_SOURCE_DIR).toBe("src/styles");
  });

  it("ships compiled CSS only under dist/css", () => {
    expect(CSS_OUTPUT_DIR).toBe("dist/css");
    for (const assetPath of CSS_ASSET_PATHS) {
      expect(assetPath.startsWith("dist/css/")).toBe(true);
      expect(assetPath.startsWith("css/")).toBe(false);
    }
  });

  it("lists the eight required stylesheet artifacts", () => {
    expect(REQUIRED_CSS).toEqual([
      "tokens.css",
      "base.css",
      "navbar.css",
      "chat.css",
      "overlays.css",
      "player.css",
      "mobile.css",
      "boot-overlay.css",
    ]);
    expect(CSS_ASSET_PATHS).toEqual(
      REQUIRED_CSS.map((name) => `dist/css/${name}`)
    );
  });

  it("includes compiled CSS paths in the CDN ship list", () => {
    for (const assetPath of CSS_ASSET_PATHS) {
      expect(CDN_ASSET_PATHS).toContain(assetPath);
    }
    expect(CDN_ASSET_PATHS.some((p) => p.startsWith("css/"))).toBe(false);
  });
});
