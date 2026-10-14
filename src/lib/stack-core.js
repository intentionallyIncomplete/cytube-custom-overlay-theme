/**
 * Shared stack core for the feature-stack module family (#228 Phase 1).
 *
 * Pure move out of src/modules/feature-stack.js: group registry, storage keys,
 * and the localStorage persistence / panel-state helpers used by the stack
 * panels. No behavior changes — see the Phase 0 characterization suite
 * (tests/e2e/smoke/stack-sync.spec.js).
 */

export const SKEY = "btfw-stack-order";
export const MOTD_VISIBILITY_KEY = "btfw-stack-motd-open";
export const PLAYLIST_VISIBILITY_KEY = "btfw-stack-playlist-open";
export const POLL_VISIBILITY_KEY = "btfw-stack-poll-open";

export const DOCKED_KEYS = {
  "motd-group": "btfw-stack-motd-docked",
  "playlist-group": "btfw-stack-playlist-docked",
  "poll-group": "btfw-stack-poll-docked"
};

export const GROUP_LABELS = {
  "motd-group": { short: "MOTD", title: "Message of the Day" },
  "playlist-group": { short: "PL", title: "Playlist" },
  "poll-group": { short: "Poll", title: "Polls & Voting" }
};

export const PANEL_BAR_LABELS = {
  "motd-group": "MD",
  "playlist-group": "PL",
  "poll-group": "PV"
};

export const PANEL_GROUP_ORDER = {
  "motd-group": 1,
  "poll-group": 2,
  "playlist-group": 3
};

export const GROUPS = [
  {
    id: "motd-group",
    title: "Message of the Day",
    selectors: ["#motdwrap", "#motdrow", "#motd", "#announcements"],
    priority: 1
  },
  {
    id: "playlist-group",
    title: "Playlist",
    selectors: ["#playlistrow", "#playlistwrap", "#queuecontainer", "#queue"],
    priority: 2
  },
  {
    id: "poll-group",
    title: "Polls & Voting",
    selectors: ["#pollwrap", "#btfw-poll-parking", "#btfw-poll-history"],
    priority: 3
  }
];

// Skip these - they're either empty or handled elsewhere
export const SKIP_SELECTORS = ["#main", "#mainpage", "#mainpane"];

export function saveStackOrder(list) {
  try {
    const items = Array.from(list.children).map(n => ({
      id: n.dataset.bind,
      isGroup: n.dataset.group === "true"
    }));
    localStorage.setItem(SKEY, JSON.stringify(items));
  } catch (e) {}
}

export function loadStackOrder() {
  try {
    return JSON.parse(localStorage.getItem(SKEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function getStoredVisibility(key) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return null;
    return stored === "true";
  } catch (e) {
    return null;
  }
}

export function storeVisibility(key, isOpen) {
  try {
    localStorage.setItem(key, isOpen ? "true" : "false");
  } catch (e) {}
}

export function getStoredDocked(key) {
  try {
    const docked = localStorage.getItem(key);
    if (docked !== null) return docked === "true";
    const legacy = key.replace("-docked", "-hidden");
    const hidden = localStorage.getItem(legacy);
    if (hidden !== null) return hidden === "true";
    return false;
  } catch (e) {
    return false;
  }
}

export function storeDocked(key, isDocked) {
  try {
    localStorage.setItem(key, isDocked ? "true" : "false");
  } catch (e) {}
}

export function isPanelInDrawer(item) {
  return !!item?.closest(".btfw-panel-container__host");
}

export function applyStoredPanelOpenState(wrapper, storageKey, getDefaultOpen) {
  if (!wrapper || isPanelInDrawer(wrapper)) return;
  const stored = getStoredVisibility(storageKey);
  const shouldOpen = typeof getDefaultOpen === "function"
    ? getDefaultOpen(stored)
    : (stored !== null ? !!stored : true);
  if (wrapper._btfwSetOpenState) {
    wrapper._btfwSetOpenState(shouldOpen, { persist: false });
  } else {
    wrapper.dataset.open = shouldOpen ? "true" : "false";
    wrapper.classList.toggle("is-open", shouldOpen);
  }
}

export function dispatchStackVisibility() {
  const items = Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']"));
  const inlineItems = items.filter((el) => el.dataset.docked !== "true");
  const allDocked = items.length > 0 && inlineItems.length === 0;
  const stack = document.getElementById("btfw-stack");
  const leftpad = document.getElementById("btfw-leftpad");
  const grid = document.getElementById("btfw-grid");
  if (stack) {
    stack.classList.toggle("btfw-stack--all-hidden", allDocked);
    stack.classList.toggle("btfw-stack--all-docked", allDocked);
  }
  if (leftpad) leftpad.classList.toggle("btfw-leftpad--stack-hidden", allDocked);
  if (grid) grid.classList.toggle("btfw-grid--stack-hidden", allDocked);
  document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility", {
    detail: {
      allHidden: allDocked,
      allDocked,
      visibleCount: inlineItems.length,
      totalCount: items.length
    }
  }));
}
