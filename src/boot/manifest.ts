/** Runtime module init groups — bootstrap entry points for billtube-fw. */

export const BOOT_FOUNDATION = ["feature:styleCore", "feature:themeMode"] as const;

export const BOOT_LAYOUT = ["feature:layout"] as const;

/** Shell + player + playlist (DOM layout around video). */
export const BOOT_DOM = [
  "feature:footer",
  "feature:player",
  "feature:stack",
  "feature:videoOverlay",
  "feature:nowplaying",
  "feature:playlistPerformance",
  "feature:playlist-tools",
  "feature:audio",
  "feature:movie-info",
  "ext:movie-suggestion"
] as const;

/** Chat cluster + overlays tied to chat. */
export const BOOT_CHAT = [
  "feature:chat",
  "feature:chat-tools",
  "feature:chat-filters",
  "feature:chat-username-colors",
  "feature:emotes",
  "feature:chatMedia",
  "feature:emoji-compat",
  "feature:chat-avatars",
  "feature:chat-timestamps",
  "feature:chat-ignore",
  "feature:gifs",
  "feature:poll-overlay",
  "feature:notify",
  "feature:notification-sounds",
  "feature:chat-commands",
  "feature:drink-counter"
] as const;

/** Navigation chrome. */
export const BOOT_NAV = [
  "feature:themeIcons",
  "feature:navbar",
  "feature:modal-skin"
] as const;

/** Sync/socket integration and playback guard. */
export const BOOT_SYNC = [
  "feature:syncGuard",
  "feature:local-subs"
] as const;

/** Viewer settings that ship outside admin.bundle.js. */
export const BOOT_SETTINGS_VIEWER = [
  "feature:emoji-loader",
  "feature:themeSettings"
] as const;

/**
 * Channel-admin modules from admin.bundle.js.
 * Only inited when {@link canLoadAdminBundle} is true (issue #197).
 */
export const BOOT_SETTINGS_ADMIN = [
  "feature:motd-editor",
  "feature:channelThemeAdmin"
] as const;

/** @deprecated Prefer BOOT_SETTINGS_VIEWER + BOOT_SETTINGS_ADMIN. */
export const BOOT_SETTINGS = [
  ...BOOT_SETTINGS_VIEWER,
  ...BOOT_SETTINGS_ADMIN
] as const;

export const BOOT_FEATURES = [
  ...BOOT_DOM,
  ...BOOT_CHAT,
  ...BOOT_NAV,
  ...BOOT_SYNC,
  ...BOOT_SETTINGS
] as const;
