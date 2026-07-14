/** @typedef {{ ok: true } | { ok: false, reason: string }} VerifyResult */

export const CDN_REPO = "intentionallyIncomplete/cytube-custom-overlay-theme";

/** Paths shipped on jsDelivr for each release tag. */
export const CDN_ASSET_PATHS = [
  "channel_config_settings.js",
  "dist/billtube-fw.js",
  "dist/core.bundle.js",
  "dist/chat.bundle.js",
  "dist/player.bundle.js",
  "dist/playlist.bundle.js",
  "dist/admin.bundle.js",
  "dist/features.bundle.js",
  "css/tokens.css",
  "css/base.css",
  "css/navbar.css",
  "css/chat.css",
  "css/overlays.css",
  "css/player.css",
  "css/mobile.css",
  "css/boot-overlay.css",
];

/**
 * @param {string} repo
 * @param {string} tag e.g. v1.2.3 (no leading @)
 * @param {string} filePath
 */
export function buildCdnUrl(repo, tag, filePath) {
  const normalizedTag = tag.replace(/^@/, "");
  return `https://cdn.jsdelivr.net/gh/${repo}@${normalizedTag}/${filePath}`;
}

/**
 * @param {string} content
 * @param {string} tag e.g. v1.2.3
 * @returns {VerifyResult}
 */
export function verifyChannelConfigPin(content, tag) {
  const normalizedTag = tag.replace(/^@/, "");
  const needle = `@${normalizedTag}`;
  if (!content.includes(needle)) {
    return { ok: false, reason: `channel_config_settings.js missing CDN pin ${needle}` };
  }
  return { ok: true };
}

/**
 * @param {string} filePath
 * @param {string} content
 * @returns {VerifyResult}
 */
export function verifyAssetContent(filePath, content) {
  if (!content || content.length < 50) {
    return { ok: false, reason: `${filePath} empty or too small` };
  }

  if (filePath === "dist/core.bundle.js" && !/util:motion/.test(content)) {
    return { ok: false, reason: "core.bundle.js missing util:motion marker" };
  }

  if (filePath === "dist/billtube-fw.js" && !/BTFW/.test(content)) {
    return { ok: false, reason: "dist/billtube-fw.js missing BTFW marker" };
  }

  return { ok: true };
}

/**
 * @param {number} ms
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
