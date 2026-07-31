/**
 * Channel config source vs root runtime pin helpers (issue #211).
 * Source of truth: src/config/channel_config_settings.js
 * Generated runtime: ./channel_config_settings.js (jsDelivr / CyTube External JS)
 */

/** @typedef {{ ok: true } | { ok: false, reason: string }} ChannelConfigResult */

export const CHANNEL_CONFIG_SOURCE_PATH = "src/config/channel_config_settings.js";
export const CHANNEL_CONFIG_ROOT_PATH = "channel_config_settings.js";
export const CHANNEL_CONFIG_VERSION_PLACEHOLDER = "@__VERSION__";
export const CHANNEL_CONFIG_CDN_REPO =
  "intentionallyIncomplete/cytube-custom-overlay-theme";

/**
 * Source template must keep the release placeholder and must not ship a concrete pin.
 * @param {string} content
 * @returns {ChannelConfigResult}
 */
export function verifyChannelConfigSource(content) {
  if (typeof content !== "string" || content.trim().length === 0) {
    return { ok: false, reason: "channel config source is empty" };
  }
  if (/@v\d+\.\d+\.\d+/.test(content)) {
    return {
      ok: false,
      reason: "channel config source must not contain a concrete @vX.Y.Z pin",
    };
  }
  if (!content.includes(CHANNEL_CONFIG_VERSION_PLACEHOLDER)) {
    return {
      ok: false,
      reason: `channel config source missing ${CHANNEL_CONFIG_VERSION_PLACEHOLDER}`,
    };
  }
  return { ok: true };
}

/**
 * Pins CDN refs in channel config content for a release tag.
 * Never mutates the source file — callers write the result to the root runtime path.
 * @param {string} content
 * @param {string} version Semver without leading v (e.g. 1.2.3)
 * @param {string} [repo]
 * @returns {string}
 */
export function pinChannelConfigContent(
  content,
  version,
  repo = CHANNEL_CONFIG_CDN_REPO
) {
  const normalizedVersion = version.replace(/^v/, "");
  const tag = `v${normalizedVersion}`;
  const cdnRef = `@${tag}`;
  const escapedRepo = repo.replace("/", "\\/");

  return content
    .replaceAll(CHANNEL_CONFIG_VERSION_PLACEHOLDER, cdnRef)
    .replace(new RegExp(`gh/${escapedRepo}@[^/"']+`, "g"), `gh/${repo}@${tag}`);
}

/**
 * @param {string} content
 * @param {string} tag e.g. v1.2.3
 * @returns {ChannelConfigResult}
 */
export function verifyPinnedChannelConfig(content, tag) {
  const normalizedTag = tag.replace(/^@/, "").replace(/^v/, "");
  const needle = `@v${normalizedTag}`;
  if (!content.includes(needle)) {
    return {
      ok: false,
      reason: `${CHANNEL_CONFIG_ROOT_PATH} missing CDN pin ${needle}`,
    };
  }
  if (content.includes(CHANNEL_CONFIG_VERSION_PLACEHOLDER)) {
    return {
      ok: false,
      reason: `${CHANNEL_CONFIG_ROOT_PATH} still contains ${CHANNEL_CONFIG_VERSION_PLACEHOLDER}`,
    };
  }
  return { ok: true };
}
