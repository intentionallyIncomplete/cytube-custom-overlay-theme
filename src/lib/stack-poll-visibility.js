/** Pure helpers for poll stack panel visibility (unit-tested). */

export function hasPollContent(doc = document) {
  if (!doc || typeof doc.querySelector !== "function") return false;
  return !!(
    doc.querySelector("#pollwrap .well.active") ||
    doc.querySelector("#pollwrap .well.muted") ||
    doc.querySelector("#pollwrap .poll-menu")
  );
}

export function getDefaultPollOpen(stored, hasContent) {
  if (stored !== null && stored !== undefined) return !!stored;
  return !!hasContent;
}
