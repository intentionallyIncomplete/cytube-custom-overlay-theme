/** Runtime module init groups — bootstrap entry points for billtube-fw. */

export const BOOT_FOUNDATION = ["feature:styleCore", "feature:themeMode"] as const;

export const BOOT_LAYOUT = ["feature:layout"] as const;

export const BOOT_FEATURES = [
  "feature:footer",
  "feature:player",
  "feature:stack",
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
  "feature:themeIcons",
  "feature:navbar",
  "feature:modal-skin",
  "feature:nowplaying",
  "feature:gifs",
  "feature:videoOverlay",
  "feature:poll-overlay",
  "feature:notify",
  "feature:notification-sounds",
  "feature:syncGuard",
  "feature:chat-commands",
  "feature:drink-counter",
  "feature:playlistPerformance",
  "feature:playlist-tools",
  "feature:local-subs",
  "feature:emoji-loader",
  "feature:motd-editor",
  "feature:channelThemeAdmin",
  "feature:themeSettings",
  "feature:audio",
  "feature:movie-info",
  "ext:movie-suggestion"
] as const;
