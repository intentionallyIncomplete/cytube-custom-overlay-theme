import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  ASSET_SOURCE_DIR,
  CONTINENTAL_ICON_TEMPLATES,
  KLIPY_POWERED_BY_SEGMENTS,
  KLIPY_WATERMARK_SEGMENTS,
  LEGACY_ASSET_ROOT,
  MONKEY_PAW_SVG_PATH,
  assetRepoPath,
  isLegacyAssetPath,
} from "../../src/lib/asset-paths";

const REPO_ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("asset paths (issue #209)", () => {
  it("keeps authored static assets under src/assets", () => {
    expect(ASSET_SOURCE_DIR).toBe("src/assets");
    expect(LEGACY_ASSET_ROOT).toBe("assets");
  });

  it("builds repo-relative paths under the source dir", () => {
    expect(assetRepoPath("monkey-paw", "paw.svg")).toBe(
      "src/assets/monkey-paw/paw.svg"
    );
    expect(assetRepoPath("/themes/continental/crown.svg")).toBe(
      "src/assets/themes/continental/crown.svg"
    );
  });

  it("detects legacy root assets/ paths", () => {
    expect(isLegacyAssetPath("assets/foo.svg")).toBe(true);
    expect(isLegacyAssetPath("/assets/foo.svg")).toBe(true);
    expect(isLegacyAssetPath("src/assets/foo.svg")).toBe(false);
  });

  it("points runtime constants at src/assets (not legacy root)", () => {
    expect(MONKEY_PAW_SVG_PATH).toBe("/src/assets/monkey-paw/paw.svg");
    expect(isLegacyAssetPath(MONKEY_PAW_SVG_PATH)).toBe(false);

    for (const template of Object.values(CONTINENTAL_ICON_TEMPLATES)) {
      expect(template.startsWith(`{base}/${ASSET_SOURCE_DIR}/`)).toBe(true);
      expect(template.includes("{base}/assets/")).toBe(false);
    }

    expect(KLIPY_POWERED_BY_SEGMENTS[0]).toBe(ASSET_SOURCE_DIR);
    expect(KLIPY_WATERMARK_SEGMENTS[0]).toBe(ASSET_SOURCE_DIR);
  });

  it("ships required branding files from src/assets on disk", () => {
    const requiredRelativePaths: readonly string[] = [
      "monkey-paw/paw.svg",
      "themes/continental/crown.svg",
      "themes/continental/castle.svg",
      "themes/continental/ship.svg",
      "themes/continental/jewel.svg",
      "klipy/card-branding/KLIPY Light with logo.svg",
      "klipy/search-interface-branding/SVG Files/Powered by KLIPY  - white.svg",
    ];

    for (const relative of requiredRelativePaths) {
      const absolutePath: string = join(REPO_ROOT, ASSET_SOURCE_DIR, relative);
      expect(existsSync(absolutePath), absolutePath).toBe(true);
    }

    expect(existsSync(join(REPO_ROOT, LEGACY_ASSET_ROOT))).toBe(false);
  });
});
