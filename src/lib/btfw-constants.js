/** Shared DOM selectors, custom events, and localStorage keys.
 *
 * LS_KEYS is the canonical registry of every storage key this framework
 * reads or writes (#202). Feature modules import keys from here instead of
 * declaring their own string literals; scripts/check-storage-keys.js and the
 * eslint no-restricted-syntax rule enforce that. Groups: preferences
 * (user settings), layout/panel state, caches (derived data, safe to clear),
 * legacy (read-only migration sources; never write).
 */

export const SELECTORS = Object.freeze({
  messagebuffer: "#messagebuffer",
  chatline: "#chatline",
  chatwrap: "#chatwrap",
  userlist: "#userlist",
  userlistItem: '#userlist li, #userlist .userlist_item, #userlist .user',
  videowrap: "#videowrap",
  pollwrap: "#pollwrap",
  motd: "#motd",
  motdwrap: "#motdwrap",
  chatMsg: ".chat-msg, .message, [class*=message]",
  username: ".username"
});

export const EVENTS = Object.freeze({
  ready: "btfw:ready",
  layoutReady: "btfw:layoutReady",
  chatBarsReady: "btfw:chat:barsReady",
  themeSettingsApply: "btfw:themeSettings:apply",
  openThemeSettings: "btfw:openThemeSettings",
  layoutOrientation: "btfw:layout:orientation",
  layoutStackVisibility: "btfw:layout:stackVisibility",
  channelThemeTint: "btfw:channelThemeTint",
  chatAutoScrollChanged: "btfw:chat:autoScrollChanged",
  chatEmoteSizeChanged: "btfw:chat:emoteSizeChanged",
  chatMediaScaleChanged: "btfw:chat:mediaScaleChanged",
  chatImageHoverMagnifyChanged: "btfw:chat:imageHoverMagnifyChanged",
  chatGifAutoplayChanged: "btfw:chat:gifAutoplayChanged",
  chatJoinNoticesChanged: "btfw:chat:joinNoticesChanged",
  videoLocalSubsChanged: "btfw:video:localsubs:changed",
  layoutChatSideChanged: "btfw:layout:chatSideChanged",
  themeSettingsOpen: "btfw:themeSettings:open"
});

export const LS_KEYS = Object.freeze({
  // Preferences — user settings (durable)
  chatTextPx: "btfw:chat:textSize",
  avatarsMode: "btfw:chat:avatars",
  avatarUrlsCache: "btfw:chat:avatars:urls:v1",
  emoteSize: "btfw:chat:emoteSize",
  mediaScale: "btfw:chat:mediaScale",
  gifAutoplay: "btfw:chat:gifAutoplay",
  chatAutoScroll: "btfw:chat:autoScroll",
  imageHoverMagnify: "btfw:chat:imageHoverMagnify",
  chatJoinNotices: "btfw:chat:joinNotices",
  chatTimestampsShow: "btfw:chat:ts:show",
  chatTimestampsFormat: "btfw:chat:ts:fmt",
  chatToolsHistory: "btfw:chat:history",
  chatStickColor: "btfw:chat:stickColor",
  chatIgnore: "btfw:chat:ignore",
  chatUnameColors: "btfw:chat:unameColors",
  emojiCompat: "btfw:emoji:twemoji",
  emotesSort: "btfw:emotes:sort",
  gifsFavorites: "btfw:gifs:favorites",
  notifyEnabled: "btfw:notify:enabled",
  notifySounds: "btfw:notify:sounds:v2",
  themeMode: "btfw:theme:mode",
  localSubs: "btfw:video:localsubs",
  addFromUrlTemp: "btfw:addfromurl:addTemp",

  // Layout / panel state
  layoutSide: "btfw:layout:chatSide",
  layoutGridLeftPx: "btfw:grid:leftPx",
  layoutGridVideoRatio: "btfw:grid:videoRatio",
  channelOptionsSize: "btfw:channeloptions:size",
  stackOrder: "btfw-stack-order",
  stackMotdOpen: "btfw-stack-motd-open",
  stackPlaylistOpen: "btfw-stack-playlist-open",
  stackPollOpen: "btfw-stack-poll-open",
  stackMotdDocked: "btfw-stack-motd-docked",
  stackPlaylistDocked: "btfw-stack-playlist-docked",
  stackPollDocked: "btfw-stack-poll-docked",

  // Caches — derived data, safe to clear
  emojiCache: "btfw:emoji:cache",

  // Legacy — read-only migration sources / retired keys; never write
  themeModeLegacy: "btfw:bulma:theme",
  chatNameColorRetired: "btfw:chat:nameColor"
});

/** Prefixes for per-channel keys — compose with channelStorageKey(). */
export const LS_KEY_PREFIXES = Object.freeze({
  emotesRecent: "btfw:recent:emotes:",
  userThemePresets: "btfw:userThemePresets:"
});

/**
 * Build a per-channel storage key from a registry prefix (#202).
 * `channel` must already be resolved/slugified by the caller; `suffix`
 * appends version markers (e.g. `:v1`) after the channel segment.
 */
export function channelStorageKey(prefix, channel, suffix = "") {
  return `${prefix}${channel}${suffix}`;
}
