/**
 * Poll sub-domain of the feature stack (#228 Phase 2).
 *
 * Owns everything poll: decoupling #pollwrap from the playlist DOM, poll
 * button relocation, stack-panel adoption, visibility sync, the debounced
 * sync scheduler, DOM observers, and the newPoll/closePoll socket handlers.
 *
 * Extracted verbatim from src/modules/feature-stack.js — behavior-preserving.
 * The shared stack shell (createGroupItem) is injected via context.
 */

import {
  GROUPS,
  saveStackOrder,
  type StackGroup,
  type StackPanelElement
} from "../../lib/stack-core.js";
import { hasPollContent } from "../../lib/stack-poll-visibility.js";
import type { StackRefs } from "./stack-motd.js";

/** Pieces of the shared stack shell the poll domain needs. */
export interface StackPollContext {
  createGroupItem(group: StackGroup, elements: Element[]): HTMLElement | null;
}

export interface StackPollSyncOptions {
  forceOpen?: boolean;
}

export interface StackPollDomain {
  detachPollWrapFromPlaylist(): HTMLElement | null;
  movePollButton(): void;
  ensurePollStackPanel(refs: StackRefs | null): void;
  syncPollPanelVisibility(refs: StackRefs | null, options?: StackPollSyncOptions): void;
  schedulePollSync(refs: StackRefs | null, options?: StackPollSyncOptions): void;
  wirePollObservers(refs: StackRefs | null): void;
  wirePollSocket(refs: StackRefs | null): void;
  syncPollWrapVisibility(): void;
}

export function createStackPoll(ctx: StackPollContext): StackPollDomain {
  let pollSyncTimer: ReturnType<typeof setTimeout> | null = null;
  let pollObserverWired = false;
  let pollSocketWired = false;

  function detachPollWrapFromPlaylist(): HTMLElement | null {
    const pollWrap = document.getElementById("pollwrap");
    if (!pollWrap) return null;

    const insidePlaylist = pollWrap.closest(
      "#playlistrow, #playlistwrap, #queuecontainer, [data-bind=\"playlist-group\"]"
    );
    if (!insidePlaylist) return pollWrap;

    let parking = document.getElementById("btfw-poll-parking");
    if (!parking) {
      parking = document.createElement("div");
      parking.id = "btfw-poll-parking";
      parking.hidden = true;
      parking.setAttribute("aria-hidden", "true");
      document.body.appendChild(parking);
    }
    parking.appendChild(pollWrap);
    return pollWrap;
  }

  function ensurePollStackPanel(refs: StackRefs | null): void {
    const pollWrap = document.getElementById("pollwrap");
    if (!pollWrap) return;

    const overlayState = pollWrap.dataset && pollWrap.dataset.btfwPollOverlay;
    const attrState = pollWrap.getAttribute && pollWrap.getAttribute("data-btfw-poll-overlay");
    if (overlayState === "video" || attrState === "video") return;

    detachPollWrapFromPlaylist();
    movePollButton();

    const list = refs && refs.list;
    if (!list) return;

    let pollGroup = document.querySelector<StackPanelElement>('.btfw-stack-item[data-bind="poll-group"]');
    if (!pollGroup) {
      const group = GROUPS.find((g) => g.id === "poll-group");
      if (!group) return;
      pollGroup = ctx.createGroupItem(group, [pollWrap]);
      if (pollGroup) {
        list.appendChild(pollGroup);
        saveStackOrder(list);
      }
      return;
    }

    const body = pollGroup.querySelector(".btfw-group-body");
    if (body && !body.contains(pollWrap)) {
      body.appendChild(pollWrap);
    }

    const playlistGroup = document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');
    if (playlistGroup && playlistGroup.contains(pollWrap) && body) {
      body.appendChild(pollWrap);
    }
  }

  function syncPollPanelVisibility(refs: StackRefs | null, options: StackPollSyncOptions = {}): void {
    ensurePollStackPanel(refs);
    syncPollWrapVisibility();

    const group = document.querySelector<StackPanelElement>('.btfw-stack-item[data-bind="poll-group"]');
    if (!group) return;

    group.hidden = false;
    group.removeAttribute("hidden");

    if (options.forceOpen && group._btfwSetOpenState) {
      group._btfwSetOpenState(true, { persist: false });
    } else if (options.forceOpen) {
      group.dataset.open = "true";
      group.classList.add("is-open");
    }
  }

  function schedulePollSync(refs: StackRefs | null, options: StackPollSyncOptions = {}): void {
    if (pollSyncTimer) clearTimeout(pollSyncTimer);
    pollSyncTimer = setTimeout(() => {
      pollSyncTimer = null;
      syncPollPanelVisibility(refs, options);
    }, 50);
  }

  function wirePollObservers(refs: StackRefs | null): void {
    if (pollObserverWired) return;
    const pollWrap = document.getElementById("pollwrap");
    if (!pollWrap) return;
    pollObserverWired = true;

    const observer = new MutationObserver(() => {
      schedulePollSync(refs, { forceOpen: hasPollContent() });
    });
    observer.observe(pollWrap, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    const newPollBtn = document.getElementById("newpollbtn");
    if (newPollBtn && !newPollBtn.dataset.btfwPollSync) {
      newPollBtn.dataset.btfwPollSync = "1";
      newPollBtn.addEventListener("click", () => {
        schedulePollSync(refs, { forceOpen: true });
      });
    }
  }

  function wirePollSocket(refs: StackRefs | null): void {
    if (pollSocketWired || !window.socket || !window.socket.on) return;
    pollSocketWired = true;
    window.socket.on("newPoll", () => schedulePollSync(refs, { forceOpen: true }));
    window.socket.on("closePoll", () => schedulePollSync(refs));
  }

  function syncPollWrapVisibility(): void {
    const pollWrap = document.getElementById("pollwrap");
    if (!pollWrap) return;
    const inDrawer = !!pollWrap.closest(".btfw-panel-container__host");
    const idle = !hasPollContent();
    if (inDrawer && !idle) {
      pollWrap.classList.remove("btfw-poll-idle");
      pollWrap.removeAttribute("hidden");
      pollWrap.setAttribute("aria-hidden", "false");
      return;
    }
    pollWrap.classList.toggle("btfw-poll-idle", idle);
    pollWrap.toggleAttribute("hidden", idle);
    pollWrap.setAttribute("aria-hidden", idle ? "true" : "false");
  }

  function movePollButton(): void {
    // Move poll button from leftcontrols to pollwrap
    const leftControls = document.getElementById("leftcontrols");
    const pollWrap = document.getElementById("pollwrap");

    if (leftControls && pollWrap) {
      // Find poll-related buttons
      const pollButtons = leftControls.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn');

      pollButtons.forEach(btn => {
        // Create a container if pollwrap doesn't have one
        let btnContainer = pollWrap.querySelector('.poll-controls');
        if (!btnContainer) {
          btnContainer = document.createElement('div');
          btnContainer.className = 'poll-controls';
          pollWrap.insertBefore(btnContainer, pollWrap.firstChild);
        }

        if (btn.parentElement !== btnContainer) btnContainer.appendChild(btn);
      });

      // Remove leftcontrols if it's empty
      if (leftControls.children.length === 0) {
        leftControls.remove();
      }
    }
  }

  return {
    detachPollWrapFromPlaylist,
    movePollButton,
    ensurePollStackPanel,
    syncPollPanelVisibility,
    schedulePollSync,
    wirePollObservers,
    wirePollSocket,
    syncPollWrapVisibility
  };
}
