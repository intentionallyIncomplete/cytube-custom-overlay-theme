/**
 * Shared stack core for the feature-stack module family (#228 Phase 1).
 *
 * Pure move out of src/modules/feature-stack.js: group registry, storage keys,
 * and the localStorage persistence / panel-state helpers used by the stack
 * panels. No behavior changes.
 */

export type StackGroupId = "motd-group" | "playlist-group" | "poll-group";

export interface StackGroup {
  id: StackGroupId;
  title: string;
  selectors: string[];
  priority: number;
}

/** One serialized entry of the saved stack order. */
export interface StackOrderEntry {
  id?: string | undefined;
  isGroup: boolean;
}

/** A stack group wrapper element with the open-state hook wired by the shell. */
export interface StackPanelElement extends HTMLElement {
  _btfwSetOpenState?: (open: boolean, opts?: { persist?: boolean }) => void;
}

export type GetDefaultOpen = (stored: boolean | null) => boolean;

export const SKEY = "btfw-stack-order";
export const MOTD_VISIBILITY_KEY = "btfw-stack-motd-open";
export const PLAYLIST_VISIBILITY_KEY = "btfw-stack-playlist-open";
export const POLL_VISIBILITY_KEY = "btfw-stack-poll-open";

export const DOCKED_KEYS: Record<StackGroupId, string> = {
  "motd-group": "btfw-stack-motd-docked",
  "playlist-group": "btfw-stack-playlist-docked",
  "poll-group": "btfw-stack-poll-docked"
};

export const GROUP_LABELS: Record<StackGroupId, { short: string; title: string }> = {
  "motd-group": { short: "MOTD", title: "Message of the Day" },
  "playlist-group": { short: "PL", title: "Playlist" },
  "poll-group": { short: "Poll", title: "Polls & Voting" }
};

export const PANEL_BAR_LABELS: Record<StackGroupId, string> = {
  "motd-group": "MD",
  "playlist-group": "PL",
  "poll-group": "PV"
};

export const PANEL_GROUP_ORDER: Record<StackGroupId, number> = {
  "motd-group": 1,
  "poll-group": 2,
  "playlist-group": 3
};

export const GROUPS: StackGroup[] = [
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
export const SKIP_SELECTORS: string[] = ["#main", "#mainpage", "#mainpane"];

export function saveStackOrder(list: HTMLElement): void {
  try {
    const items: StackOrderEntry[] = (Array.from(list.children) as HTMLElement[]).map((n) => ({
      id: n.dataset.bind,
      isGroup: n.dataset.group === "true"
    }));
    localStorage.setItem(SKEY, JSON.stringify(items));
  } catch {
    // storage unavailable (private mode / quota) — stack order simply not persisted
  }
}

export function loadStackOrder(): StackOrderEntry[] {
  try {
    return JSON.parse(localStorage.getItem(SKEY) || "[]") as StackOrderEntry[];
  } catch {
    return [];
  }
}

export function getStoredVisibility(key: string): boolean | null {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return null;
    return stored === "true";
  } catch {
    return null;
  }
}

export function storeVisibility(key: string, isOpen: boolean): void {
  try {
    localStorage.setItem(key, isOpen ? "true" : "false");
  } catch {
    // storage unavailable — visibility preference simply not persisted
  }
}

export function getStoredDocked(key: string): boolean {
  try {
    const docked = localStorage.getItem(key);
    if (docked !== null) return docked === "true";
    const legacy = key.replace("-docked", "-hidden");
    const hidden = localStorage.getItem(legacy);
    if (hidden !== null) return hidden === "true";
    return false;
  } catch {
    return false;
  }
}

export function storeDocked(key: string, isDocked: boolean): void {
  try {
    localStorage.setItem(key, isDocked ? "true" : "false");
  } catch {
    // storage unavailable — docked preference simply not persisted
  }
}

export function isPanelInDrawer(item?: Element | null): boolean {
  return !!item?.closest(".btfw-panel-container__host");
}

export function applyStoredPanelOpenState(
  wrapper?: StackPanelElement | null,
  storageKey?: string,
  getDefaultOpen?: GetDefaultOpen
): void {
  if (!wrapper || isPanelInDrawer(wrapper)) return;
  const stored = getStoredVisibility(storageKey ?? "");
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

export function dispatchStackVisibility(): void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("#btfw-stack .btfw-stack-item[data-group='true']")
  );
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
