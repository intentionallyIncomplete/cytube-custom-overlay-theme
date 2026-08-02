/**
 * Apply persisted chat text / emote size / media scale CSS without loading feature:themeSettings.
 * Keeps appearance correct when theme-settings init is deferred (#197).
 */

import { EVENTS, LS_KEYS } from "./btfw-constants.js";

export type EmoteSizeName = "small" | "medium" | "big";

export const MEDIA_SCALE_DEFAULT = 80;
export const MEDIA_SCALE_MIN = 40;
export const MEDIA_SCALE_MAX = 100;
export const MEDIA_SCALE_STEP = 5;

const EMOTE_SIZE_PCT: Readonly<Record<EmoteSizeName, number>> = {
  small: 30,
  medium: 60,
  big: 90
};

const LEGACY_EMOTE_ALIASES: Readonly<Record<string, EmoteSizeName>> = {
  sm: "small",
  md: "medium",
  lg: "big"
};

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

export function normalizeEmoteSizeName(size: string): EmoteSizeName {
  const legacy = LEGACY_EMOTE_ALIASES[size];
  if (legacy) return legacy;
  if (size === "small" || size === "medium" || size === "big") return size;
  return "medium";
}

/** Maps Small/Medium/Big (and legacy sm/md/lg) to chat-width percent. */
export function emoteSizeToPercent(size: string): number {
  return EMOTE_SIZE_PCT[normalizeEmoteSizeName(size)];
}

export function applyEmoteSize(
  size: string,
  doc: Document = document
): number {
  const name = normalizeEmoteSizeName(size);
  const pct = EMOTE_SIZE_PCT[name];
  doc.documentElement.style.setProperty("--btfw-emote-size-pct", String(pct));
  doc.documentElement.style.setProperty("--btfw-emote-size", `${pct}%`);
  doc.dispatchEvent(
    new CustomEvent(EVENTS.chatEmoteSizeChanged, { detail: { size: name, pct } })
  );
  return pct;
}

export function clampMediaScale(value: unknown): number {
  const raw =
    typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(raw)) return MEDIA_SCALE_DEFAULT;
  const clamped = Math.min(
    Math.max(raw, MEDIA_SCALE_MIN),
    MEDIA_SCALE_MAX
  );
  return Math.round(clamped / MEDIA_SCALE_STEP) * MEDIA_SCALE_STEP;
}

export function applyMediaScale(
  value: unknown,
  doc: Document = document
): number {
  const pct = clampMediaScale(value);
  doc.documentElement.style.setProperty("--btfw-chat-media-scale", `${pct}%`);
  doc.dispatchEvent(
    new CustomEvent(EVENTS.chatMediaScaleChanged, { detail: { pct } })
  );
  return pct;
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
  applyMediaScale(readLocalStorage(LS_KEYS.mediaScale, String(MEDIA_SCALE_DEFAULT)), doc);
}
