/**
 * Stack assembly sub-domain (#228 Phase 3).
 *
 * Owns the shared stack shell infrastructure: stack shell creation, group item
 * creation, dock/visibility wiring, footer attachment, stack population, ordering
 * persistence, header action relocation, and boot. These responsibilities move here
 * verbatim from the shell; the three sub-domain modules (motd, playlist, poll) and
 * the panel bar module delegate to this domain through the injected context.
 *
 * Module-private state (populateActive, populateTimer, bootWired, STACK_VISIBILITY,
 * and the persistence helpers read from closures) is local to this factory —
 * nothing that shared mutable state touches belongs in a domain object method.
 *
 * Extracted verbatim from src/modules/feature-stack.js — behavior-preserving.
 * Dependencies the block read from shell closures (templates, motd, playlist, poll,
 * panelbar, save/load/getStored* functions from stack-core) are injected via ctx.
 */

import {
  DOCKED_KEYS,
  GROUPS,
  SKIP_SELECTORS,
  MOTD_VISIBILITY_KEY,
  PLAYLIST_VISIBILITY_KEY,
  POLL_VISIBILITY_KEY,
  GROUP_LABELS,
  saveStackOrder as save,
  loadStackOrder as load,
  getStoredVisibility,
  storeVisibility,
  getStoredDocked,
  storeDocked,
  isPanelInDrawer,
  applyStoredPanelOpenState,
  dispatchStackVisibility,
  type StackGroup,
  type StackPanelElement,
} from "../../lib/stack-core.js";
import { getDefaultPollOpen, hasPollContent } from "../../lib/stack-poll-visibility.js";
import type { StackMotdDomain } from "./stack-motd.js";
import type { StackPlaylistDomain } from "./stack-playlist.js";
import type { StackPollDomain } from "./stack-poll.js";
import type { StackPanelBarDomain } from "./stack-panelbar.js";

/** Return type of ensureStack — both fields are nullable. */
interface StackRefs {
  list: HTMLElement | null;
  footer: Element | null;
}

/** util:templates `stack` fragment pieces used by the assembly domain. */
export interface StackAssemblyTemplates {
  stackGroupHeaderHtml(title: string): string;
}

/** Options for attachStackVisibilityToggle (exactOptionalPropertyTypes). */
export interface StackVisibilityOptions {
  storageKey: string;
  getDefaultOpen: (stored: boolean | null) => boolean;
  toggleClass: string;
  ariaLabel?: string;
  openTitle?: string;
  closeTitle?: string;
}

/** Pieces of the shared stack shell the assembly domain needs. */
export interface StackAssemblyContext {
  tpl: StackAssemblyTemplates;
  motd: StackMotdDomain;
  playlist: StackPlaylistDomain;
  poll: StackPollDomain;
  panelbar: StackPanelBarDomain;
  hasMotdContent: () => boolean;
}

export interface StackAssemblyDomain {
  ensureStack(): StackRefs | null;
  createGroupItem(group: StackGroup, elements: Element[]): HTMLElement | null;
  setPanelDocked(wrapper: HTMLElement, docked: boolean, opts?: { persist?: boolean }): void;
  attachPanelDockButton(wrapper: HTMLElement, groupId: string): void;
  attachStackVisibilityToggle(wrapper: HTMLElement, options: StackVisibilityOptions): void;
  attachFooter(footer: Element | null): void;
  populate(refs: StackRefs): void;
  boot(): void;
  relocateStackHeaderActions(): void;
}

export function createStackAssembly(ctx: StackAssemblyContext): StackAssemblyDomain {
  const { tpl } = ctx;
  const motd = ctx.motd;
  const playlist = ctx.playlist;
  const poll = ctx.poll;
  const panelbar = ctx.panelbar;

  let populateActive = false;
  let populateTimer: number | null = null;
  let bootWired = false;

  const STACK_VISIBILITY: Record<string, StackVisibilityOptions> = {
    "motd-group": {
      storageKey: MOTD_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, ctx.hasMotdContent()),
      toggleClass: "btfw-motd-toggle",
      ariaLabel: "Toggle message of the day visibility",
      openTitle: "Hide message of the day",
      closeTitle: "Show message of the day",
    },
    "playlist-group": {
      storageKey: PLAYLIST_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, true),
      toggleClass: "btfw-playlist-toggle",
      ariaLabel: "Toggle playlist visibility",
      openTitle: "Hide playlist (improves performance)",
      closeTitle: "Show playlist",
    },
    "poll-group": {
      storageKey: POLL_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, hasPollContent()),
      toggleClass: "btfw-poll-toggle",
      ariaLabel: "Toggle poll panel visibility",
      openTitle: "Hide poll panel",
      closeTitle: "Show poll panel",
    },
  };

  function ensureStack(): StackRefs | null {
    const left = document.getElementById("btfw-leftpad");
    if (!left) return null;
    let stack = document.getElementById("btfw-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "btfw-stack";
      stack.className = "btfw-stack";
      const v = document.getElementById("videowrap");
      const overlay = document.getElementById("btfw-video-overlay");
      const anchor = (overlay && v && overlay.parentElement === v.parentElement) ? overlay : v;
      if (anchor && anchor.parentElement) {
        if (anchor.nextSibling) anchor.parentNode!.insertBefore(stack, anchor.nextSibling);
        else anchor.parentNode!.appendChild(stack);
      } else left.appendChild(stack);

      const list = document.createElement("div");
      list.className = "btfw-stack-list";
      stack.appendChild(list);
      const footer = document.createElement("div");
      footer.id = "btfw-stack-footer";
      footer.className = "btfw-stack-footer";
      stack.appendChild(footer);
    }
    return {
      list: stack.querySelector<HTMLElement>(".btfw-stack-list"),
      footer: stack.querySelector("#btfw-stack-footer"),
    };
  }

  function createGroupItem(group: StackGroup, elements: Element[]): HTMLElement | null {
    // Special handling for MOTD group
    if (group.id === "motd-group") {
      motd.normalizeMotdStructure();
      elements = [document.getElementById("motdwrap")].filter(
        (el): el is HTMLElement => Boolean(el)
      );
    }

    // Special handling for playlist group
    if (group.id === "playlist-group") {
      poll.detachPollWrapFromPlaylist();
      playlist.mergePlaylistControls();
      elements = elements
        .filter((el) => el && el.id !== "rightcontrols" && el.id !== "pollwrap")
        .filter((el) => !el.querySelector || !el.querySelector("#pollwrap"));
    }

    if (group.id === "poll-group") {
      poll.detachPollWrapFromPlaylist();
      poll.movePollButton();
      const pollWrap = document.getElementById("pollwrap");
      elements = [pollWrap, document.getElementById("btfw-poll-history")].filter(
        (el): el is HTMLElement => Boolean(el)
      );
    }

    if (elements.length === 0) return null;

    // Filter out any elements that are already in the stack to avoid circular references
    const stackList = document.querySelector("#btfw-stack .btfw-stack-list");
    if (stackList) {
      elements = elements.filter((el) => el && !stackList.contains(el) && !el.contains(stackList));
    }

    const wrapper = document.createElement("section");
    wrapper.className = "btfw-stack-item btfw-group-item";
    wrapper.dataset.bind = group.id;
    wrapper.dataset.group = "true";

    const header = document.createElement("header");
    header.className = "btfw-stack-item__header";
    header.innerHTML = tpl.stackGroupHeaderHtml(group.title);

    const body = document.createElement("div");
    body.className = "btfw-stack-item__body btfw-group-body";

    // Add all elements to this group with safety checks
    elements.forEach((el) => {
      if (el && el.parentElement !== body && !body.contains(el) && !el.contains(body)) {
        try {
          body.appendChild(el);
        } catch (error) {
          console.warn("[stack] Failed to move element:", el.id || el.className, error);
        }
      }
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    const vis = STACK_VISIBILITY[group.id];
    if (vis) attachStackVisibilityToggle(wrapper, vis);
    attachPanelDockButton(wrapper, group.id);

    // Wire up/down buttons
    const upBtn = wrapper.querySelector(".btfw-up") as HTMLElement | null;
    if (upBtn) {
      upBtn.onclick = function () {
        const p = wrapper.parentElement as HTMLElement;
        const prev = wrapper.previousElementSibling;
        if (prev) p.insertBefore(wrapper, prev);
        save(p);
      };
    }
    const downBtn = wrapper.querySelector(".btfw-down") as HTMLElement | null;
    if (downBtn) {
      downBtn.onclick = function () {
        const p = wrapper.parentElement as HTMLElement;
        const next = wrapper.nextElementSibling;
        if (next) p.insertBefore(next, wrapper);
        else p.appendChild(wrapper);
        save(p);
      };
    }

    return wrapper;
  }

  function isModalScopedFooter(el: Element | null | undefined): boolean {
    return !!el?.closest(".modal, [role=\"dialog\"]");
  }

  function attachFooter(footer: Element | null): void {
    if (!footer) return;
    if (footer.querySelector("#btfw-footer")) return;

    const themed = document.getElementById("btfw-footer");
    if (themed && themed !== footer && !footer.contains(themed)) {
      footer.innerHTML = "";
      footer.appendChild(themed);
      return;
    }

    // Only adopt the real page footer here. A bare `footer` tag selector
    // would otherwise match modal footers (e.g. Theme Settings, MOTD editor)
    // and silently relocate their Apply/Close buttons into this hidden
    // stack footer — see feature-theme-settings.js Apply button reveal bug.
    const real =
      document.getElementById("footer") ||
      Array.from(document.querySelectorAll("footer")).find((el) => !isModalScopedFooter(el));
    if (real && !footer.contains(real)) {
      real.classList.add("btfw-footer");
      footer.innerHTML = "";
      footer.appendChild(real);
    }
  }

  function ensureStackHeaderActionsSlot(groupId: string): HTMLElement | null {
    const group = document.querySelector(`.btfw-stack-item[data-bind="${groupId}"]`) as HTMLElement | null;
    const header = group?.querySelector(".btfw-stack-item__header");
    if (!header) return null;

    let slot = header.querySelector<HTMLElement>(".btfw-stack-header-actions");
    if (!slot) {
      slot = document.createElement("span");
      slot.className = "btfw-stack-header-actions";
      const toolbar = header.querySelector(".btfw-stack-header-toolbar");
      const arrows = toolbar?.querySelector(".btfw-stack-arrows") || header.querySelector(".btfw-stack-arrows");
      if (toolbar && arrows) toolbar.insertBefore(slot, arrows);
      else if (arrows) header.insertBefore(slot, arrows);
      else header.appendChild(slot);
    }
    return slot;
  }

  function styleStackHeaderButton(btn: HTMLElement | null, html: string): void {
    if (!btn) return;
    btn.classList.remove("btn", "btn-sm", "btn-default", "button", "is-small", "is-link");
    btn.classList.add("btfw-stack-header-btn");
    if (btn.innerHTML !== html) btn.innerHTML = html;
  }

  function relocateStackHeaderActions(): void {
    const pollSlot = ensureStackHeaderActionsSlot("poll-group");
    const pollBtn = document.getElementById("newpollbtn");
    if (pollSlot && pollBtn) {
      styleStackHeaderButton(
        pollBtn,
        '<span data-btfw-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'
      );
      if (pollBtn.parentElement !== pollSlot) pollSlot.appendChild(pollBtn);
      const controls = document.querySelector("#pollwrap > .poll-controls");
      if (controls && controls.children.length === 0) controls.remove();
    }

    const motdSlot = ensureStackHeaderActionsSlot("motd-group");
    const motdBtn = document.getElementById("btfw-motd-editbtn");
    if (motdSlot && motdBtn) {
      styleStackHeaderButton(
        motdBtn,
        '<span data-btfw-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'
      );
      if (motdBtn.parentElement !== motdSlot) motdSlot.appendChild(motdBtn);
      const row = motdBtn.closest(".btfw-motd-editrow");
      if (row && row.parentElement) row.remove();
    }
  }

  function stackGroupsSatisfied(list: HTMLElement | null): boolean {
    if (!list) return true;
    return GROUPS.every((group) => {
      const hasDom = group.selectors.some((sel) => {
        if (SKIP_SELECTORS.includes(sel)) return false;
        const el = document.querySelector(sel);
        if (!el || list.contains(el) || el.contains(list)) return false;
        if (sel === "#pollwrap") {
          const overlayState = (el as HTMLElement).dataset?.btfwPollOverlay;
          const attrState = (el as HTMLElement).getAttribute?.("data-btfw-poll-overlay");
          if (overlayState === "video" || attrState === "video") return false;
        }
        return true;
      });
      if (!hasDom) return true;
      return Boolean(list.querySelector(`[data-bind="${group.id}"]`));
    });
  }

  function setPanelDocked(wrapper: HTMLElement, docked: boolean, opts?: { persist?: boolean }): void {
    if (!wrapper) return;
    const isDocked = !!docked;
    const suppressPersist = opts?.persist === false;
    const groupId = wrapper.dataset.bind;
    const dockKey = DOCKED_KEYS[groupId as keyof typeof DOCKED_KEYS];

    wrapper.dataset.docked = isDocked ? "true" : "false";
    wrapper.classList.toggle("btfw-stack-item--docked", isDocked);

    const dockBtn = wrapper.querySelector(".btfw-stack-dock-btn") as HTMLElement | null;
    if (dockBtn) {
      dockBtn.setAttribute("aria-pressed", isDocked ? "true" : "false");
      dockBtn.title = isDocked ? "Pinned to panels menu" : "Dock to panels menu";
    }

    if (isDocked) {
      if (isPanelInDrawer(wrapper)) panelbar.restorePanelToStack(wrapper);
      else panelbar.clearActiveFlyoutIf(groupId as string);
    } else {
      panelbar.restorePanelToStack(wrapper);
      const setOpen = (wrapper as StackPanelElement)._btfwSetOpenState;
      if (setOpen) {
        setOpen(true);
      } else {
        wrapper.dataset.open = "true";
        wrapper.classList.add("is-open");
      }
    }

    if (!suppressPersist && dockKey) storeDocked(dockKey, isDocked);
    panelbar.syncPanelBar();
    dispatchStackVisibility();
  }

  function attachPanelDockButton(wrapper: HTMLElement, groupId: string): void {
    const dockKey = DOCKED_KEYS[groupId as keyof typeof DOCKED_KEYS];
    if (!dockKey) return;

    const header = wrapper.querySelector(".btfw-stack-item__header") as HTMLElement | null;
    const toolbar = header?.querySelector(".btfw-stack-header-toolbar");
    const arrows = toolbar?.querySelector(".btfw-stack-arrows");
    if (!arrows || arrows.querySelector(".btfw-stack-dock-btn")) return;

    const storedDocked = getStoredDocked(dockKey);
    wrapper.dataset.docked = storedDocked ? "true" : "false";
    wrapper.classList.toggle("btfw-stack-item--docked", storedDocked);

    const dockBtn = document.createElement("button");
    dockBtn.type = "button";
    dockBtn.className = "btfw-arrow btfw-stack-dock-btn";
    dockBtn.textContent = "⫷";
    dockBtn.setAttribute(
      "aria-label",
      `Dock ${GROUP_LABELS[groupId as keyof typeof GROUP_LABELS]?.title || groupId} to panels menu`
    );
    dockBtn.setAttribute("aria-pressed", storedDocked ? "true" : "false");
    dockBtn.title = storedDocked ? "Pinned to panels menu" : "Dock to panels menu";

    dockBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (wrapper.dataset.docked === "true") return;
      setPanelDocked(wrapper, true);
    });

    arrows.insertBefore(dockBtn, arrows.firstChild);
  }

  function attachStackVisibilityToggle(wrapper: HTMLElement, options: StackVisibilityOptions): void {
    const {
      storageKey,
      getDefaultOpen,
      toggleClass,
      ariaLabel = "Toggle panel visibility",
      openTitle = "Hide panel",
      closeTitle = "Show panel",
    } = options;

    const stored = getStoredVisibility(storageKey);
    const defaultOpen =
      typeof getDefaultOpen === "function"
        ? getDefaultOpen(stored)
        : stored !== null
          ? stored
          : true;

    if (!wrapper.hasAttribute("data-open")) {
      wrapper.dataset.open = defaultOpen ? "true" : "false";
    }

    wrapper.classList.toggle("is-open", wrapper.dataset.open !== "false");

    const header = wrapper.querySelector(".btfw-stack-item__header") as HTMLElement | null;
    const arrows = header && header.querySelector(".btfw-stack-arrows");
    if (!arrows || arrows.querySelector(`.${toggleClass}`)) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = `btfw-arrow ${toggleClass}`;
    toggleBtn.setAttribute("aria-label", ariaLabel);
    toggleBtn.style.display = "flex";
    toggleBtn.style.alignItems = "center";
    toggleBtn.style.justifyContent = "center";

    function updateToggle(): void {
      const isOpen = wrapper.dataset.open !== "false";
      toggleBtn.textContent = isOpen ? "👁️" : "👁️🗨️";
      toggleBtn.title = isOpen ? openTitle : closeTitle;
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      wrapper.classList.toggle("is-open", isOpen);
    }

    function setOpenState(open: boolean, opts?: { persist?: boolean }): void {
      const isOpen = !!open;
      const suppressPersist = opts?.persist === false;
      if (suppressPersist) (wrapper as HTMLElement & { _btfwSuppressPersist?: boolean })._btfwSuppressPersist = true;
      wrapper.dataset.open = isOpen ? "true" : "false";
      updateToggle();
      if (!suppressPersist) {
        storeVisibility(storageKey, isOpen);
      }
      if (suppressPersist) {
        queueMicrotask(() => {
          (wrapper as HTMLElement & { _btfwSuppressPersist?: boolean })._btfwSuppressPersist = false;
        });
      }
    }

    toggleBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      setOpenState(wrapper.dataset.open === "false");
    });

    updateToggle();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          updateToggle();
          if (!(wrapper as HTMLElement & { _btfwSuppressPersist?: boolean })._btfwSuppressPersist) {
            storeVisibility(storageKey, wrapper.dataset.open !== "false");
          }
        }
      }
    });
    observer.observe(wrapper, { attributes: true, attributeFilter: ["data-open"] });

    arrows.insertBefore(toggleBtn, arrows.firstChild);
    (wrapper as StackPanelElement)._btfwSetOpenState = setOpenState;
    attachPanelDockButton(wrapper, wrapper.dataset.bind as string);
  }

  function populate(refs: StackRefs): void {
    if (populateActive) return;
    populateActive = true;
    try {
      const list = refs.list;
      const footer = refs.footer;

      if (!list || !footer) return;

      if (stackGroupsSatisfied(list) && list.children.length > 0) {
        motd.ensureMotdStackPanel(refs);
        poll.ensurePollStackPanel(refs);
        poll.syncPollWrapVisibility();
        relocateStackHeaderActions();
        attachFooter(footer);
        return;
      }

      // Move poll button first, then decouple poll from playlist DOM
      poll.movePollButton();
      poll.detachPollWrapFromPlaylist();

      // Group elements
      const groupedElements = new Map<string, { group: StackGroup; elements: Element[] }>();

      // Process groups with better safety checks
      GROUPS.forEach((group) => {
        const elements: Element[] = [];
        group.selectors.forEach((sel) => {
          const el = document.querySelector(sel);
          if (!el) return;
          if (list.contains(el) || el.contains(list)) return;
          if (SKIP_SELECTORS.includes(sel)) return;
          if (sel === "#pollwrap") {
            const overlayState = (el as HTMLElement).dataset?.btfwPollOverlay;
            const attrState = (el as HTMLElement).getAttribute?.("data-btfw-poll-overlay");
            if (overlayState === "video" || attrState === "video") {
              return;
            }
          }
          elements.push(el);
        });

        if (elements.length > 0) {
          groupedElements.set(group.id, { group, elements });
        }
      });

      // Create items by priority/order
      const savedOrder = load();
      const itemsToAdd: Array<{ item: HTMLElement | null; id: string; priority: number; isGroup: boolean }> = [];

      // Add groups
      groupedElements.forEach(({ group, elements }, groupId) => {
        const existingItem = Array.from(list.children).find(
          (n) => (n as HTMLElement).dataset.bind === groupId
        ) as HTMLElement | undefined;
        if (!existingItem) {
          try {
            const groupItem = createGroupItem(group, elements);
            if (groupItem) {
              itemsToAdd.push({ item: groupItem, id: groupId, priority: group.priority, isGroup: true });
            }
          } catch (error) {
            console.warn("[stack] Failed to create group item:", groupId, error);
          }
        }
      });

      // Sort by saved order, then by priority
      if (savedOrder.length > 0) {
        itemsToAdd.sort((a, b) => {
          const aIndex = savedOrder.findIndex((s) => s.id === a.id);
          const bIndex = savedOrder.findIndex((s) => s.id === b.id);
          if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
          if (aIndex >= 0) return -1;
          if (bIndex >= 0) return 1;
          return a.priority - b.priority;
        });
      } else {
        itemsToAdd.sort((a, b) => a.priority - b.priority);
      }

      // Add items to list with safety checks
      itemsToAdd.forEach(({ item }) => {
        try {
          if (item && !list.contains(item) && !item.contains(list)) {
            list.appendChild(item);
          }
        } catch (error) {
          console.warn("[stack] Failed to add item to list:", error);
        }
      });

      save(list);
      motd.ensureMotdStackPanel(refs);
      poll.ensurePollStackPanel(refs);
      poll.syncPollWrapVisibility();
      relocateStackHeaderActions();
      attachFooter(footer);
    } finally {
      populateActive = false;
    }
  }

  function boot(): void {
    const refs = ensureStack();
    if (!refs) return;
    populate(refs);
    motd.wireMotdObservers(refs);
    motd.wireMotdSocket(refs);
    poll.wirePollObservers(refs);
    poll.wirePollSocket(refs);
    if (bootWired) return;
    bootWired = true;

    const observer = new MutationObserver(() => {
      if (populateTimer) return;
      populateTimer = window.requestAnimationFrame(() => {
        populateTimer = null;
        populate(refs);
      });
    });
    const leftpad = document.getElementById("btfw-leftpad");
    const main = document.getElementById("main");

    if (leftpad) {
      observer.observe(leftpad, { childList: true, subtree: false });
    }
    if (main) {
      observer.observe(main, { childList: true, subtree: false });
    }

    setTimeout(() => {
      const motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]') as HTMLElement | null;
      if (motdGroup) {
        applyStoredPanelOpenState(motdGroup as StackPanelElement, MOTD_VISIBILITY_KEY, (stored) =>
          getDefaultPollOpen(stored, ctx.hasMotdContent())
        );
      }

      const playlistGroup = document.querySelector('.btfw-stack-item[data-bind="playlist-group"]') as HTMLElement | null;
      if (playlistGroup) {
        applyStoredPanelOpenState(playlistGroup as StackPanelElement, PLAYLIST_VISIBILITY_KEY, (stored) =>
          stored !== null ? !!stored : true
        );
      }

      const pollGroup = document.querySelector('.btfw-stack-item[data-bind="poll-group"]') as HTMLElement | null;
      if (pollGroup) {
        applyStoredPanelOpenState(pollGroup as StackPanelElement, POLL_VISIBILITY_KEY, (stored) =>
          getDefaultPollOpen(stored, hasPollContent())
        );
      }

      document
        .querySelectorAll<HTMLElement>('#btfw-stack .btfw-stack-item[data-group="true"]')
        .forEach((item) => {
          const dockKey = DOCKED_KEYS[item.dataset.bind as keyof typeof DOCKED_KEYS];
          if (!dockKey) return;
          setPanelDocked(item, getStoredDocked(dockKey), { persist: false });
        });

      panelbar.ensurePanelsMenuShell();
      panelbar.ensurePanelsMenuButton();
      panelbar.syncPanelBar();
      poll.syncPollPanelVisibility(refs);
      dispatchStackVisibility();
    }, 1000);

    let n = 0;
    const iv = setInterval(() => {
      populate(refs);
      if (++n > 2) clearInterval(iv);
    }, 700);
  }

  return {
    ensureStack,
    createGroupItem,
    setPanelDocked,
    attachPanelDockButton,
    attachStackVisibilityToggle,
    attachFooter,
    populate,
    boot,
    relocateStackHeaderActions,
  };
}
