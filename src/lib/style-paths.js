/**
 * Shared style source / ship paths (issue #208).
 * Authored SCSS lives under src/styles; compiled CSS ships under dist/css.
 */

/** @type {string} */
export const STYLE_SOURCE_DIR = "src/styles";

/** @type {string} */
export const CSS_OUTPUT_DIR = "dist/css";

/** @type {readonly string[]} */
export const REQUIRED_CSS = Object.freeze([
  "tokens.css",
  "base.css",
  "navbar.css",
  "chat.css",
  "overlays.css",
  "player.css",
  "mobile.css",
  "boot-overlay.css",
]);

/** Relative CDN / loader paths for each compiled stylesheet. */
/** @type {readonly string[]} */
export const CSS_ASSET_PATHS = Object.freeze(
  REQUIRED_CSS.map((name) => `${CSS_OUTPUT_DIR}/${name}`)
);
