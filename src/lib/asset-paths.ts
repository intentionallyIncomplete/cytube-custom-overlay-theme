/**
 * Shared authored static asset paths (issue #209).
 * Source-owned SVGs live under src/assets and ship in-tree via jsDelivr
 * (not generated — no separate dist/ copy step).
 */

/** Repo-relative directory for authored static assets. */
export const ASSET_SOURCE_DIR = "src/assets" as const;

/** Legacy root directory removed by #209. */
export const LEGACY_ASSET_ROOT = "assets" as const;

/**
 * Build a repo-relative CDN path under {@link ASSET_SOURCE_DIR}.
 * Segments are joined with `/` and must not be URI-encoded here
 * (callers that need encoding apply it at URL construction time).
 */
export function assetRepoPath(...segments: readonly string[]): string {
  const parts: string[] = [ASSET_SOURCE_DIR];
  for (const segment of segments) {
    const trimmed: string = segment.replace(/^\/+|\/+$/g, "");
    if (trimmed.length > 0) {
      parts.push(trimmed);
    }
  }
  return parts.join("/");
}

/**
 * True when a path still points at the pre-#209 root `assets/` tree.
 */
export function isLegacyAssetPath(path: string): boolean {
  const normalized: string = path.replace(/^\/+/, "");
  return (
    normalized === LEGACY_ASSET_ROOT ||
    normalized.startsWith(`${LEGACY_ASSET_ROOT}/`)
  );
}

/**
 * Theme icon pack templates keyed for util-theme-icon-packs.
 * `{base}` is substituted at runtime with BTFW.BASE.
 */
export const CONTINENTAL_ICON_TEMPLATES: Readonly<Record<string, string>> =
  Object.freeze({
    "nav-theme": `{base}/${ASSET_SOURCE_DIR}/themes/continental/crown.svg`,
    "nav-movie-request": `{base}/${ASSET_SOURCE_DIR}/themes/continental/castle.svg`,
    "perf-rocket": `{base}/${ASSET_SOURCE_DIR}/themes/continental/ship.svg`,
    "chat-emotes": `{base}/${ASSET_SOURCE_DIR}/themes/continental/jewel.svg`,
    "chat-gif": `{base}/${ASSET_SOURCE_DIR}/themes/continental/ship.svg`,
    "stack-add-media": `{base}/${ASSET_SOURCE_DIR}/themes/continental/castle.svg`,
    "stack-new-poll": `{base}/${ASSET_SOURCE_DIR}/themes/continental/crown.svg`,
    "stack-edit-motd": `{base}/${ASSET_SOURCE_DIR}/themes/continental/crown.svg`,
    "chat-commands-help": `{base}/${ASSET_SOURCE_DIR}/themes/continental/jewel.svg`,
  });

/** Monkey paw SVG path relative to BTFW.BASE (leading slash). */
export const MONKEY_PAW_SVG_PATH = `/${ASSET_SOURCE_DIR}/monkey-paw/paw.svg` as const;

/** KLIPY branding paths relative to repo root (for assetUrl segments). */
export const KLIPY_POWERED_BY_SEGMENTS: readonly string[] = Object.freeze([
  ASSET_SOURCE_DIR,
  "klipy/search-interface-branding/SVG Files/Powered by KLIPY  - white.svg",
]);

export const KLIPY_WATERMARK_SEGMENTS: readonly string[] = Object.freeze([
  ASSET_SOURCE_DIR,
  "klipy/card-branding/KLIPY Light with logo.svg",
]);
