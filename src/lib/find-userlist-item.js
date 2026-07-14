import { SELECTORS } from "./btfw-constants.js";

function escapeSelectorValue(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/** Strip trailing colon from chat display names. */
export function normalizeUserIdentifier(str) {
  if (str == null) return "";
  let result = String(str).trim();
  if (!result) return "";
  if (result.endsWith(":")) {
    result = result.slice(0, -1).trimEnd();
  }
  return result;
}

/** Resolve a CyTube userlist row by data-name or visible label. */
export function findUserlistItem(name, root = document) {
  const targetName = normalizeUserIdentifier(name);
  if (!targetName) return null;

  const direct = root.querySelector(
    `#userlist li[data-name="${escapeSelectorValue(targetName)}"]`
  );
  if (direct) return direct;

  const candidates = root.querySelectorAll(SELECTORS.userlistItem);
  const normalizedTarget = targetName.toLowerCase();

  for (const el of candidates) {
    const attr = (el.getAttribute && el.getAttribute("data-name")) || "";
    const text = attr || (el.textContent || "");
    if (!text) continue;

    const normalizedText = normalizeUserIdentifier(text);
    if (!normalizedText) continue;

    if (normalizedText.toLowerCase() === normalizedTarget) return el;
    if (
      normalizedText.replace(/\s+/g, "").toLowerCase().startsWith(normalizedTarget)
    ) {
      return el;
    }
  }
  return null;
}
