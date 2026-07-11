/** Shared DOM selectors, custom events, and localStorage keys. */

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
  chatImageHoverMagnifyChanged: "btfw:chat:imageHoverMagnifyChanged",
  chatGifAutoplayChanged: "btfw:chat:gifAutoplayChanged",
  chatJoinNoticesChanged: "btfw:chat:joinNoticesChanged",
  videoLocalSubsChanged: "btfw:video:localsubs:changed",
  layoutChatSideChanged: "btfw:layout:chatSideChanged",
  themeSettingsOpen: "btfw:themeSettings:open"
});

export const LS_KEYS = Object.freeze({
  chatTextPx: "btfw:chat:textSize",
  avatarsMode: "btfw:chat:avatars",
  emoteSize: "btfw:chat:emoteSize",
  gifAutoplay: "btfw:chat:gifAutoplay",
  chatAutoScroll: "btfw:chat:autoScroll",
  imageHoverMagnify: "btfw:chat:imageHoverMagnify",
  chatJoinNotices: "btfw:chat:joinNotices",
  localSubs: "btfw:video:localsubs",
  layoutSide: "btfw:layout:chatSide",
  chatIgnore: "btfw:chat:ignore",
  chatUnameColors: "btfw:chat:unameColors"
});
