BTFW.define("util:chatAutoscroll", [], async () => {
  const LS_KEY = "btfw:chat:autoScroll";
  const PIN_THRESHOLD = 48;

  function readStored() {
    try {
      return localStorage.getItem(LS_KEY);
    } catch (_) {
      return null;
    }
  }

  function getAutoScrollEnabled() {
    const stored = readStored();
    if (stored === null) return true;
    return stored === "1";
  }

  function getChatBuffer() {
    return document.getElementById("messagebuffer");
  }

  function isPinnedToBottom(buf = getChatBuffer()) {
    if (!buf) return true;
    return buf.scrollHeight - buf.scrollTop - buf.clientHeight <= PIN_THRESHOLD;
  }

  function shouldAutoScroll() {
    if (getAutoScrollEnabled()) return true;
    if (typeof window.SCROLLCHAT !== "undefined" && !window.SCROLLCHAT) return false;
    return isPinnedToBottom();
  }

  function scrollChatIfAllowed() {
    if (!shouldAutoScroll()) return;
    if (typeof window.scrollChat === "function") window.scrollChat();
  }

  document.addEventListener("btfw:chat:autoScrollChanged", () => {});

  return {
    name: "util:chatAutoscroll",
    LS_KEY,
    getAutoScrollEnabled,
    isPinnedToBottom,
    shouldAutoScroll,
    scrollChatIfAllowed
  };
});
