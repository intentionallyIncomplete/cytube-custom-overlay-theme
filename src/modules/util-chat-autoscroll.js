import {
  getAutoScrollEnabled as getEnabledFromStored,
  isPinnedToBottom as isPinned,
  shouldAutoScroll as shouldScroll
} from "../lib/chat-autoscroll.js";

BTFW.define("util:chatAutoscroll", ["util:constants"], async ({ init }) => {
  const { LS_KEYS, EVENTS } = await init("util:constants");
  const PIN_THRESHOLD = 48;

  function readStored() {
    try {
      return localStorage.getItem(LS_KEYS.chatAutoScroll);
    } catch (_) {
      return null;
    }
  }

  function getAutoScrollEnabled() {
    return getEnabledFromStored(readStored());
  }

  function getChatBuffer() {
    return document.getElementById("messagebuffer");
  }

  function isPinnedToBottom(buf = getChatBuffer()) {
    if (!buf) return true;
    return isPinned(buf.scrollTop, buf.scrollHeight, buf.clientHeight, PIN_THRESHOLD);
  }

  function shouldAutoScroll() {
    return shouldScroll({
      autoScrollEnabled: getAutoScrollEnabled(),
      scrollChatFlag: typeof window.SCROLLCHAT !== "undefined" ? window.SCROLLCHAT : undefined,
      pinnedToBottom: isPinnedToBottom()
    });
  }

  function scrollChatIfAllowed() {
    if (!shouldAutoScroll()) return;
    if (typeof window.scrollChat === "function") window.scrollChat();
  }

  document.addEventListener(EVENTS.chatAutoScrollChanged, () => {});

  return {
    name: "util:chatAutoscroll",
    getAutoScrollEnabled,
    shouldAutoScroll,
    scrollChatIfAllowed,
    isPinnedToBottom
  };
});
