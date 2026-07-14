/** Pure helpers for optional chat auto-scroll (unit-tested). */

export const CHAT_AUTOSCROLL_KEY = "btfw:chat:autoScroll";

export function getAutoScrollEnabled(stored) {
  if (stored === null || stored === undefined) return true;
  return stored === "1";
}

export function isPinnedToBottom(scrollTop, scrollHeight, clientHeight, threshold = 48) {
  return scrollHeight - scrollTop - clientHeight <= threshold;
}

export function shouldAutoScroll({
  autoScrollEnabled,
  scrollChatFlag,
  pinnedToBottom
}) {
  if (autoScrollEnabled) return true;
  if (scrollChatFlag === false) return false;
  return !!pinnedToBottom;
}
