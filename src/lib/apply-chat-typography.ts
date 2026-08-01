/**
 * Apply persisted chat text / emote size CSS without loading feature:themeSettings.
 * Keeps appearance correct when theme-settings init is deferred (#197).
 */

import { EVENTS, LS_KEYS } from "./btfw-constants.js";

export type EmoteSizeName = "small" | "medium" | "big";

function readLocalStorage(key: string, fallback: string): string {
  try {
    const value = localStorage.getItem(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

export function applyChatTextPx(px: number, root: ParentNode = document): void {
  const wrap = root.querySelector("#chatwrap");
  if (
    typeof wrap !== "object" ||
    wrap === null ||
    !("style" in wrap) ||
    typeof (wrap as HTMLElement).style?.setProperty !== "function"
  ) {
    return;
  }
  const clamped = Math.min(Math.max(Number(px) || 14, 10), 20);
  (wrap as HTMLElement).style.setProperty("--btfw-chat-text", `${clamped}px`);
}

export function emoteSizeToPx(size: string): number {
  if (size === "small") return 100;
  if (size === "big") return 170;
  return 130;
}

export function applyEmoteSize(
  size: string,
  doc: Document = document
): number {
  const px = emoteSizeToPx(size);
  doc.documentElement.style.setProperty("--btfw-emote-size", `${px}px`);
  doc.dispatchEvent(
    new CustomEvent(EVENTS.chatEmoteSizeChanged, { detail: { size, px } })
  );
  return px;
}

/**
 * Rehydrate chat typography from localStorage (safe to call multiple times).
 */
export function applyStoredChatTypography(
  doc: Document = document
): void {
  const textPx = parseInt(readLocalStorage(LS_KEYS.chatTextPx, "14"), 10);
  applyChatTextPx(textPx, doc);
  applyEmoteSize(readLocalStorage(LS_KEYS.emoteSize, "medium"), doc);
}
