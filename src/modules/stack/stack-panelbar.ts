/**
 * Panel bar sub-domain of the feature stack (#228 Phase 2).
 *
 * Owns the docked-panels menu: the panel bar shell inside #btfw-chat-actions,
 * the panels menu button, per-group flyout previews (hover/click/keyboard),
 * dock/undock entry points, the queue-preview wiring for the playlist flyout,
 * and the signature-based bar re-render.
 *
 * Extracted verbatim from src/modules/feature-stack.js — behavior-preserving.
 * Collaborators the block read from shell closures (templates, the playlist
 * and poll domains, setPanelDocked, ensureStack) are injected via context.
 * The shell's setPanelDocked reads this domain's active flyout state through
 * the getActiveFlyoutGroup/clearActiveFlyoutIf accessors, breaking the
 * panelbar <-> assembly cycle.
 */

import {
  GROUP_LABELS,
  PANEL_BAR_LABELS,
  PANEL_GROUP_ORDER,
  type StackGroupId
} from "../../lib/stack-core.js";
import type { StackPlaylistDomain } from "./stack-playlist.js";

/** util:templates `stack` fragment pieces used by the panel bar UI. */
export interface StackPanelBarTemplates {
  panelsMenuButtonHtml(): string;
  panelUndockIconHtml(): string;
  playlistAddFormHtml(): string;
}

/** Dock options as used by the shell's setPanelDocked (exactOptionalPropertyTypes). */
export interface SetPanelDockedOptions {
  persist?: boolean;
}

/** Pieces of the shared stack shell the panel bar domain needs. */
export interface StackPanelBarContext {
  tpl: StackPanelBarTemplates;
  playlist: StackPlaylistDomain;
  /** Poll domain's pollwrap visibility sync (drawer/overlay state). */
  syncPollWrapVisibility(): void;
  /** Shell's dock-state writer (assembly side; injected as a thunk). */
  setPanelDocked(wrapper: HTMLElement, docked: boolean, opts?: SetPanelDockedOptions): void;
  /** Shell's stack shell creator (creates #btfw-stack if missing). */
  ensureStack(): unknown;
}

export interface StackPanelBarDomain {
  clearPanelDrawerMode(item: HTMLElement | null | undefined): void;
  restorePanelToStack(item: HTMLElement | null | undefined): void;
  ensurePanelsMenuShell(): HTMLElement | null;
  ensurePanelsMenuButton(): HTMLElement | null;
  undockPanelFromMenu(groupId: string): void;
  syncPanelBar(): void;
  /** Current active flyout group id, or null (read by the shell's setPanelDocked). */
  getActiveFlyoutGroup(): string | null;
  /** Clear the active flyout group if it matches groupId (idempotent). */
  clearActiveFlyoutIf(groupId: string): void;
}

export function createStackPanelBar(ctx: StackPanelBarContext): StackPanelBarDomain {
  const { tpl } = ctx;
  const playlist = ctx.playlist;

  let panelBarWired = false;
  let activeFlyoutGroup: string | null = null;
  let lastPanelBarSignature = "";
  let flyoutCloseTimer: ReturnType<typeof setTimeout> | null = null;

  function clearPanelDrawerMode(item: HTMLElement | null | undefined): void {
    if (!item) return;
    item.classList.remove("btfw-stack-item--in-drawer");
    delete item.dataset.btfwInDrawer;
    item.classList.toggle("is-open", item.dataset.open !== "false");
    ctx.syncPollWrapVisibility();
  }

  function restorePanelToStack(item: HTMLElement | null | undefined): void {
    clearPanelDrawerMode(item);
    if (!item) return;
    const list = document.querySelector("#btfw-stack .btfw-stack-list");
    if (!list) return;
    if (item.parentElement !== list) list.appendChild(item);
  }

  function ensurePanelsMenuShell(): HTMLElement | null {
    const actions = document.getElementById("btfw-chat-actions");
    if (!actions) return null;

    let shell = document.getElementById("btfw-panels-menu-shell");
    if (!shell) {
      shell = document.createElement("div");
      shell.id = "btfw-panels-menu-shell";
      shell.className = "btfw-panels-menu-shell";
      shell.setAttribute("aria-label", "Docked channel panels");

      const bar = document.createElement("div");
      bar.id = "btfw-panel-bar";
      bar.className = "btfw-panel-bar";
      bar.setAttribute("role", "toolbar");
      bar.setAttribute("aria-label", "Docked panel shortcuts");
      shell.appendChild(bar);
    }
    const bar = shell.querySelector<HTMLElement>("#btfw-panel-bar");
    wirePanelBarActions(bar);
    if (shell.parentElement !== actions) {
      actions.insertBefore(shell, actions.firstChild);
    }
    if (!panelBarWired) {
      wirePanelDismiss();
      panelBarWired = true;
    }
    document.getElementById("btfw-stack-drawer")?.remove();
    return shell;
  }

  function onPanelsMenuButtonClick(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    togglePanelBar();
  }

  function ensurePanelsMenuButton(): HTMLElement | null {
    const shell = ensurePanelsMenuShell();
    if (!shell) return null;

    let btn = document.getElementById("btfw-panels-menu-btn") as HTMLButtonElement | null;
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btfw-panels-menu-btn";
      btn.className = "button btfw-chatbtn btfw-panels-menu-btn";
      btn.innerHTML = tpl.panelsMenuButtonHtml();
      btn.title = "Docked Panels";
      btn.setAttribute("aria-expanded", "false");
      btn.hidden = true;
      shell.appendChild(btn);
    } else if (btn.parentElement !== shell) {
      shell.appendChild(btn);
    }

    btn.title = "Docked Panels";
    const label = btn.querySelector(".btfw-panels-menu-btn__label");
    if (label) label.textContent = "Panels";
    btn.classList.remove("is-wide");
    if (!btn.dataset.btfwPanelsWired) {
      btn.addEventListener("click", onPanelsMenuButtonClick);
      btn.dataset.btfwPanelsWired = "1";
    }
    return btn;
  }

  function undockPanelFromMenu(groupId: string): void {
    ctx.ensureStack();
    const wrapper = document.querySelector<HTMLElement>(`#btfw-stack .btfw-stack-item[data-bind="${groupId}"]`);
    if (!wrapper) return;

    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }
    activeFlyoutGroup = null;
    document.querySelectorAll<HTMLElement>(".btfw-panel-btn.is-active").forEach((el) => {
      el.classList.remove("is-active");
      delete el.dataset.btfwFlyoutLocked;
    });
    document.documentElement.classList.remove("btfw-panels-flyout-open");
    playlist.disconnectQueuePreviewObserver();

    ctx.setPanelDocked(wrapper, false);
    requestAnimationFrame(() => {
      try { wrapper.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (_) {}
    });
  }

  function wirePanelBarActions(bar: HTMLElement | null): void {
    if (!bar || bar.dataset.btfwActionsWired) return;
    bar.dataset.btfwActionsWired = "1";

    bar.addEventListener("click", (ev) => {
      const target = ev.target as Element;
      const undock = target.closest<HTMLElement>(".btfw-panel-undock");
      if (undock) {
        ev.preventDefault();
        ev.stopPropagation();
        const groupId = undock.dataset.panelGroup || undock.closest<HTMLElement>(".btfw-panel-btn")?.dataset.group;
        if (groupId) undockPanelFromMenu(groupId);
        return;
      }

      const playBtn = target.closest<HTMLElement>(".btfw-panel-playlist__play");
      if (playBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        playlist.playQueueEntry(playBtn.dataset.queueUid);
        return;
      }

      const addBtn = target.closest<HTMLElement>(".btfw-panel-playlist__add");
      if (addBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        const form = addBtn.closest(".btfw-panel-container")?.querySelector<HTMLFormElement>(".btfw-panel-playlist__add-form");
        if (!form) return;
        const open = form.hidden;
        form.hidden = !open;
        addBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) form.querySelector<HTMLInputElement>(".btfw-panel-playlist__link-input")?.focus();
      }
    });

    bar.addEventListener("submit", (ev) => {
      const form = (ev.target as Element).closest<HTMLFormElement>(".btfw-panel-playlist__add-form");
      if (!form) return;
      ev.preventDefault();
      ev.stopPropagation();
      const input = form.querySelector<HTMLInputElement>(".btfw-panel-playlist__link-input");
      const url = input?.value?.trim();
      if (!input || !url || !playlist.queueMediaLink(url)) return;
      input.value = "";
      form.hidden = true;
      form.closest(".btfw-panel-container")?.querySelector(".btfw-panel-playlist__add")
        ?.setAttribute("aria-expanded", "false");
      const host = form.closest(".btfw-panel-container")?.querySelector(".btfw-panel-playlist__queue");
      if (host) playlist.renderPlaylistQueuePreview(host);
    });
  }

  function createPanelUndockButton(groupId: string, meta: { title: string }): HTMLElement {
    const undock = document.createElement("button");
    undock.type = "button";
    undock.className = "btfw-panel-undock";
    undock.dataset.panelGroup = groupId;
    undock.setAttribute("aria-label", `Pin ${meta.title} below video`);
    undock.title = "Pin below video";
    undock.innerHTML = tpl.panelUndockIconHtml();
    return undock;
  }

  function buildPlaylistPanelAddForm(): HTMLFormElement {
    const addForm = document.createElement("form");
    addForm.className = "btfw-panel-playlist__add-form";
    addForm.hidden = true;
    addForm.innerHTML = tpl.playlistAddFormHtml();
    return addForm;
  }

  function buildPanelContainer(groupId: string, meta: { title: string; short: string }, index: number): HTMLElement {
    const container = document.createElement("div");
    container.className = "btfw-panel-container";
    if (index > 0) container.style.bottom = `${-index * 50}px`;

    if (groupId === "playlist-group") {
      container.classList.add("btfw-panel-container--playlist");
      const toolbar = document.createElement("div");
      toolbar.className = "btfw-panel-playlist__toolbar";

      const addBtn = document.createElement("button");
      addBtn.type = "button";
      addBtn.className = "btfw-panel-playlist__add";
      addBtn.textContent = "+Add";
      addBtn.setAttribute("aria-expanded", "false");

      const undock = createPanelUndockButton(groupId, meta);
      toolbar.append(addBtn, undock);

      const addForm = buildPlaylistPanelAddForm();

      const host = document.createElement("div");
      host.className = "btfw-panel-container__host btfw-panel-playlist__queue";

      container.append(toolbar, addForm, host);
      return container;
    }

    container.classList.add("btfw-panel-container--dock-only");
    const dockOnly = document.createElement("div");
    dockOnly.className = "btfw-panel-container__dock-only";
    dockOnly.appendChild(createPanelUndockButton(groupId, meta));
    container.appendChild(dockOnly);
    return container;
  }

  function closeAllFlyouts(): void {
    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }
    document.querySelectorAll<HTMLElement>(".btfw-panel-btn.is-active").forEach((el) => {
      el.classList.remove("is-active");
      delete el.dataset.btfwFlyoutLocked;
    });
    document.querySelectorAll<HTMLElement>(".btfw-panel-container__host .btfw-stack-item").forEach((item) => {
      restorePanelToStack(item);
    });
    playlist.disconnectQueuePreviewObserver();
    activeFlyoutGroup = null;
    document.documentElement.classList.remove("btfw-panels-flyout-open");
  }

  function setPanelBarOpen(open: boolean): void {
    const bar = document.getElementById("btfw-panel-bar");
    const btn = document.getElementById("btfw-panels-menu-btn");
    if (bar) bar.classList.toggle("open", open);
    document.documentElement.classList.toggle("btfw-panels-bar-open", open);
    if (btn) {
      btn.classList.toggle("is-expanded", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    if (!open) closeAllFlyouts();
  }

  function closePanelBar(): void {
    setPanelBarOpen(false);
  }

  function togglePanelBar(): void {
    ensurePanelsMenuShell();
    const bar = document.getElementById("btfw-panel-bar");
    const btn = document.getElementById("btfw-panels-menu-btn");
    if (!bar || !btn || btn.hidden) return;
    setPanelBarOpen(!bar.classList.contains("open"));
  }

  function scheduleCloseFlyout(groupId: string): void {
    if (flyoutCloseTimer) clearTimeout(flyoutCloseTimer);
    flyoutCloseTimer = setTimeout(() => {
      flyoutCloseTimer = null;
      const btn = document.querySelector(`.btfw-panel-btn[data-group="${groupId}"]`);
      if (!btn) return;
      if (btn.matches(":hover") || btn.querySelector(".btfw-panel-container:hover")) return;
      btn.classList.remove("is-active");
      if (activeFlyoutGroup === groupId) {
        activeFlyoutGroup = null;
        playlist.disconnectQueuePreviewObserver();
      }
      if (!document.querySelector(".btfw-panel-btn.is-active")) {
        document.documentElement.classList.remove("btfw-panels-flyout-open");
      }
    }, 140);
  }

  function openPanelPreview(groupId: string, btnEl: Element | null | undefined): void {
    if (!btnEl) return;

    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }

    document.querySelectorAll(".btfw-panel-btn.is-active").forEach((btn) => {
      if (btn !== btnEl) btn.classList.remove("is-active");
    });

    activeFlyoutGroup = groupId;
    btnEl.classList.add("is-active");
    document.documentElement.classList.add("btfw-panels-flyout-open");

    if (groupId === "playlist-group") {
      const host = btnEl.querySelector(".btfw-panel-playlist__queue");
      if (host) {
        playlist.renderPlaylistQueuePreview(host);
        playlist.ensureQueuePreviewObserver(host);
      }
    }
  }

  function wirePanelDismiss(): void {
    if (document.documentElement.dataset.btfwPanelDismissWired) return;
    document.documentElement.dataset.btfwPanelDismissWired = "1";
    document.addEventListener("click", (ev) => {
      if (!activeFlyoutGroup) return;
      if ((ev.target as Element).closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")) return;
      document.querySelectorAll<HTMLElement>(".btfw-panel-btn[data-btfw-flyout-locked]").forEach((el) => {
        delete el.dataset.btfwFlyoutLocked;
      });
      closeAllFlyouts();
    });
  }

  function togglePanelFlyout(groupId: string, btn: HTMLElement): void {
    if (!document.getElementById("btfw-panel-bar")?.classList.contains("open")) return;
    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }

    const locked = btn.dataset.btfwFlyoutLocked === "true";
    if (locked && btn.classList.contains("is-active")) {
      delete btn.dataset.btfwFlyoutLocked;
      btn.classList.remove("is-active");
      if (activeFlyoutGroup === groupId) {
        activeFlyoutGroup = null;
        playlist.disconnectQueuePreviewObserver();
      }
      if (!document.querySelector(".btfw-panel-btn.is-active")) {
        document.documentElement.classList.remove("btfw-panels-flyout-open");
      }
      return;
    }

    document.querySelectorAll<HTMLElement>(".btfw-panel-btn[data-btfw-flyout-locked]").forEach((el) => {
      if (el !== btn) delete el.dataset.btfwFlyoutLocked;
    });
    btn.dataset.btfwFlyoutLocked = "true";
    openPanelPreview(groupId, btn);
  }

  function wirePanelBtn(btn: HTMLElement, groupId: string): void {
    const container = btn.querySelector<HTMLElement>(".btfw-panel-container");

    const showFlyout = () => {
      if (!document.getElementById("btfw-panel-bar")?.classList.contains("open")) return;
      if (flyoutCloseTimer) {
        clearTimeout(flyoutCloseTimer);
        flyoutCloseTimer = null;
      }
      openPanelPreview(groupId, btn);
    };

    btn.addEventListener("mouseenter", showFlyout);
    btn.addEventListener("focusin", showFlyout);

    btn.addEventListener("click", (ev) => {
      if ((ev.target as Element).closest(".btfw-panel-container")) return;
      ev.preventDefault();
      ev.stopPropagation();
      togglePanelFlyout(groupId, btn);
    });

    btn.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      ev.preventDefault();
      togglePanelFlyout(groupId, btn);
    });

    btn.addEventListener("mouseleave", (ev) => {
      if (btn.dataset.btfwFlyoutLocked === "true") return;
      if (!container?.contains(ev.relatedTarget as Node)) scheduleCloseFlyout(groupId);
    });
    container?.addEventListener("mouseenter", () => {
      if (flyoutCloseTimer) {
        clearTimeout(flyoutCloseTimer);
        flyoutCloseTimer = null;
      }
    });
    container?.addEventListener("mouseleave", (ev) => {
      if (btn.dataset.btfwFlyoutLocked === "true") return;
      if (!btn.contains(ev.relatedTarget as Node)) scheduleCloseFlyout(groupId);
    });
  }

  function syncPanelBar(): void {
    const shell = ensurePanelsMenuShell();
    ensurePanelsMenuButton();
    const bar = shell?.querySelector<HTMLElement>("#btfw-panel-bar");
    if (!bar) return;

    const docked = Array.from(document.querySelectorAll<HTMLElement>('#btfw-stack .btfw-stack-item[data-docked="true"]'))
      .sort((a, b) => {
        const aBind = a.dataset.bind as StackGroupId | undefined;
        const bBind = b.dataset.bind as StackGroupId | undefined;
        const aOrder = (aBind !== undefined ? PANEL_GROUP_ORDER[aBind] : undefined) ?? 99;
        const bOrder = (bBind !== undefined ? PANEL_GROUP_ORDER[bBind] : undefined) ?? 99;
        return aOrder - bOrder;
      });

    const signature = docked.map((item) => item.dataset.bind).join("|");
    const menuBtn = document.getElementById("btfw-panels-menu-btn");
    if (menuBtn) {
      menuBtn.hidden = docked.length === 0;
      if (docked.length === 0) {
        lastPanelBarSignature = "";
        closePanelBar();
        return;
      }
    }

    if (signature === lastPanelBarSignature && bar.childElementCount === docked.length) {
      return;
    }
    lastPanelBarSignature = signature;

    const wasOpen = bar.classList.contains("open");
    const reopenGroup = activeFlyoutGroup;
    closeAllFlyouts();

    bar.replaceChildren();
    bar.style.setProperty("--btfw-panel-bar-count", String(Math.max(docked.length, 1)));

    docked.forEach((item, index) => {
      const groupId = item.dataset.bind;
      if (!groupId) return;
      const meta = GROUP_LABELS[groupId as StackGroupId] || { short: "?", title: groupId };
      const btn = document.createElement("div");
      btn.className = "btfw-panel-btn";
      btn.dataset.group = groupId;
      btn.title = meta.title;
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-label", meta.title);
      btn.tabIndex = 0;

      const label = document.createElement("span");
      label.className = "btfw-panel-btn__label";
      label.textContent = PANEL_BAR_LABELS[groupId as StackGroupId] || meta.short;
      btn.appendChild(label);
      btn.appendChild(buildPanelContainer(groupId, meta, index));
      bar.appendChild(btn);
      wirePanelBtn(btn, groupId);
    });

    if (wasOpen) {
      setPanelBarOpen(true);
      const stillDocked = reopenGroup && docked.some((item) => item.dataset.bind === reopenGroup);
      if (stillDocked) {
        const btn = bar.querySelector(`.btfw-panel-btn[data-group="${reopenGroup}"]`);
        if (btn) openPanelPreview(reopenGroup, btn);
      }
    }
  }

  return {
    clearPanelDrawerMode,
    restorePanelToStack,
    ensurePanelsMenuShell,
    ensurePanelsMenuButton,
    undockPanelFromMenu,
    syncPanelBar,
    getActiveFlyoutGroup: () => activeFlyoutGroup,
    clearActiveFlyoutIf: (groupId: string) => {
      if (activeFlyoutGroup === groupId) activeFlyoutGroup = null;
    }
  };
}
