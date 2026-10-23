/**
 * Playlist sub-domain of the feature stack (#228 Phase 2).
 *
 * Owns everything playlist: the merged playlist controls bar (btfw-plbar),
 * the add-media panel (tabs over #addfromurl / #searchcontrol), and the
 * panel-bar queue preview (upcoming entries + play/queue actions).
 *
 * Extracted verbatim from src/modules/feature-stack.js — behavior-preserving.
 * Shell state the domain reads (the active flyout group) is injected via
 * context; templates are the src/lib/templates/stack.js namespace (#230).
 */

/** Pieces of the shared stack shell the playlist domain needs. */
export interface StackPlaylistContext {
  /** src/lib/templates/stack.js fragment used by the add-media UI. */
  tpl: {
    addMediaPanelHtml(): string;
    addMediaButtonHtml(): string;
  };
  /** Shell's active flyout group id, or null when no flyout is open. */
  getActiveFlyoutGroup(): string | null;
}

export interface AddMediaUi {
  panel: AddMediaPanelElement;
  toggle(force?: boolean): boolean;
  setActive(targetId?: string): void;
}

interface AddMediaPanelElement extends HTMLElement {
  _btfwWired?: boolean;
  _btfwToggle?: (force?: boolean) => boolean;
  _btfwSetActive?: (targetId?: string) => void;
  _btfwButtonSync?: boolean;
}

export interface StackPlaylistDomain {
  ensureAddMediaUI(
    mainContainer: HTMLElement | null | undefined,
    controlsBar: HTMLElement | null | undefined,
    actionsCluster: HTMLElement | null | undefined
  ): AddMediaUi | null;
  mergePlaylistControls(): void;
  getQueueEntryUid(entry: HTMLElement | null | undefined): string | number | null;
  playQueueEntry(uid: string | number | null | undefined): boolean;
  queueMediaLink(url: string | null | undefined): boolean;
  disconnectQueuePreviewObserver(): void;
  ensureQueuePreviewObserver(hostEl: Element | null | undefined): void;
  getUpcomingQueueEntries(limit?: number): HTMLElement[];
  renderPlaylistQueuePreview(hostEl: Element | null | undefined): void;
}

const ADD_MEDIA_SECTIONS = [
  { id: "addfromurl", title: "From URL", default: true },
  { id: "searchcontrol", title: "Library & YouTube" }
];

export function createStackPlaylist(ctx: StackPlaylistContext): StackPlaylistDomain {
  const { tpl } = ctx;

  function ensureAddMediaUI(
    mainContainer: HTMLElement | null | undefined,
    controlsBar: HTMLElement | null | undefined,
    actionsCluster: HTMLElement | null | undefined
  ): AddMediaUi | null {
    if (!mainContainer || !controlsBar || !actionsCluster) return null;

    const available = ADD_MEDIA_SECTIONS.map(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return null;
      return { ...cfg, el };
    }).filter(Boolean) as { id: string; title: string; default?: boolean; el: HTMLElement }[];

    if (!available.length) {
      const existingPanel = document.getElementById("btfw-addmedia-panel");
      if (existingPanel) existingPanel.remove();
      return null;
    }

    let panel = document.getElementById("btfw-addmedia-panel") as AddMediaPanelElement | null;
    if (!panel) {
      panel = document.createElement("section") as AddMediaPanelElement;
      panel.id = "btfw-addmedia-panel";
      panel.className = "btfw-addmedia-panel";
      panel.dataset.open = "false";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-label", "Add media controls");
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("hidden", "hidden");
      panel.innerHTML = tpl.addMediaPanelHtml();
    }

    if (panel.parentElement !== mainContainer) {
      const anchor = controlsBar.parentElement === mainContainer ?
        controlsBar.nextSibling : null;
      mainContainer.insertBefore(panel, anchor);
    }

    const tabs = panel.querySelector(".btfw-addmedia-tabs");
    const viewsHost = panel.querySelector(".btfw-addmedia-views");
    const closeBtn = panel.querySelector(".btfw-addmedia-close");

    if (!tabs || !viewsHost) return null;

    while (tabs.firstChild) tabs.removeChild(tabs.firstChild);
    while (viewsHost.firstChild) viewsHost.removeChild(viewsHost.firstChild);

    available.forEach(({ id, title, el }) => {
      el.classList.remove("collapse", "in", "plcontrol-collapse");
      el.style.removeProperty("display");
      el.style.removeProperty("height");
      el.removeAttribute("aria-expanded");
      el.setAttribute("role", "tabpanel");
      el.setAttribute("data-btfw-addmedia", "panel");

      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "btfw-addmedia-tab";
      tab.dataset.target = id;
      tab.textContent = title;
      tab.setAttribute("role", "tab");
      tabs.appendChild(tab);

      const view = document.createElement("div");
      view.className = "btfw-addmedia-view";
      view.dataset.target = id;
      view.setAttribute("role", "tabpanel");
      view.setAttribute("aria-hidden", "true");
      view.appendChild(el);
      viewsHost.appendChild(view);
    });

    const defaultSection = available.find(sec => sec.default) || available[0]!;

    const setActive = (targetId?: string) => {
      const activeId = targetId || panel!.dataset.active || defaultSection.id;
      panel!.dataset.active = activeId;
      tabs!.querySelectorAll(".btfw-addmedia-tab").forEach(tab => {
        const match = (tab as HTMLElement).dataset.target === activeId;
        tab.classList.toggle("is-active", match);
        tab.setAttribute("aria-selected", match ? "true" : "false");
        tab.setAttribute("tabindex", match ? "0" : "-1");
      });
      viewsHost!.querySelectorAll(".btfw-addmedia-view").forEach(view => {
        const match = (view as HTMLElement).dataset.target === activeId;
        view.classList.toggle("is-active", match);
        view.setAttribute("aria-hidden", match ? "false" : "true");
      });
    };

    const toggle = (force?: boolean) => {
      const open = force != null ? !!force : panel!.dataset.open !== "true";
      panel!.dataset.open = open ? "true" : "false";
      panel!.classList.toggle("is-open", open);
      panel!.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        panel!.removeAttribute("hidden");
        setActive(panel!.dataset.active || defaultSection.id);
      } else {
        panel!.setAttribute("hidden", "hidden");
      }
      panel!.dispatchEvent(new CustomEvent("btfw:addmedia:state", { detail: { open } }));
      return open;
    };

    if (!panel._btfwWired) {
      tabs.addEventListener("click", (ev) => {
        const btn = (ev.target as Element).closest(".btfw-addmedia-tab") as HTMLElement | null;
        if (!btn) return;
        ev.preventDefault();
        setActive(btn.dataset.target);
      });
      if (closeBtn) {
        closeBtn.addEventListener("click", () => toggle(false));
      }
      panel._btfwWired = true;
    }

    setActive(panel.dataset.active || defaultSection.id);

    panel._btfwToggle = toggle;
    panel._btfwSetActive = setActive;

    const wireLegacyTriggers = () => {
      const triggers = [
        { id: "showsearch", target: "searchcontrol" }
      ];

      triggers.forEach(({ id, target }) => {
        const btn = document.getElementById(id) as HTMLElement | null;
        if (!btn) return;
        if (btn.dataset.btfwAddmedia === target) return;

        btn.dataset.btfwAddmedia = target;
        btn.setAttribute("aria-controls", "btfw-addmedia-panel");
        btn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          setActive(target);
          toggle(true);
          btn.blur();
        });
      });
    };

    wireLegacyTriggers();

    return { panel, toggle, setActive };
  }

  function mergePlaylistControls(): void {
    const plBar = document.getElementById("btfw-plbar");
    if (plBar?.dataset.btfwMerged === "1") return;
    const controlsRow = document.getElementById("controlsrow");
    const rightControls = document.getElementById("rightcontrols");
    const playlistWrap = document.getElementById("playlistwrap");
    const queueContainer = document.getElementById("queuecontainer");
    const playlistRow = document.getElementById("playlistrow");
    const stackPlaylist = document.querySelector<HTMLElement>('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body');

    // Find any floating controls row (legacy CyTube layout)
    const controlsRows = document.querySelectorAll<HTMLElement>(".btfw-controls-row");

    // Find the main playlist container
    const mainContainer = playlistRow || playlistWrap || queueContainer || stackPlaylist;
    if (!mainContainer) return;

    // Create or enhance the playlist bar
    let controlsBar = plBar;
    if (!controlsBar) {
      controlsBar = document.createElement("div");
      controlsBar.id = "btfw-plbar";
      controlsBar.className = "btfw-plbar";
    } else {
      controlsBar.classList.add("btfw-plbar");
    }

    // Build a modern layout scaffold once
    let layout = controlsBar.querySelector(".btfw-plbar__layout");
    let primary: Element; // search + playlist tools
    let aside: Element;   // playlist actions from rightcontrols
    if (!layout) {
      layout = document.createElement("div");
      layout.className = "btfw-plbar__layout";

      primary = document.createElement("div");
      primary.className = "btfw-plbar__primary";

      aside = document.createElement("div");
      aside.className = "btfw-plbar__aside";

      layout.append(primary, aside);

      while (controlsBar.firstChild) {
        primary.appendChild(controlsBar.firstChild);
      }
      controlsBar.appendChild(layout);

      const searchBlock = primary.querySelector(".field.has-addons");
      if (searchBlock) searchBlock.classList.add("btfw-plbar__search");

      const countBadge = primary.querySelector("#btfw-pl-count");
      if (countBadge) {
        countBadge.classList.add("btfw-plbar__count");
        aside.appendChild(countBadge);
      }
    } else {
      primary = layout.querySelector(".btfw-plbar__primary") || layout;
      aside = layout.querySelector(".btfw-plbar__aside") || layout;
    }

    // Drop legacy controls that conflict with the modern bar
    controlsBar.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(btn => btn.remove());

    // Ensure we have an actions cluster for playlist controls
    let actionsCluster = controlsBar.querySelector<HTMLElement>(".btfw-plbar__actions");
    if (!actionsCluster) {
      actionsCluster = document.createElement("div");
      actionsCluster.className = "btfw-plbar__actions";
      (aside || controlsBar).appendChild(actionsCluster);
    }

    let addMediaBtn = document.getElementById("btfw-addmedia-btn");

    const styleActionButton = (btn: Element | null) => {
      if (!btn) return;
      btn.classList.add("btfw-plbar__action-btn");
      if (btn.tagName === "BUTTON" || btn.tagName === "A") {
        btn.classList.add("button", "is-dark", "is-small");
      } else if (btn.tagName === "INPUT") {
        const type = ((btn as HTMLInputElement).type || "").toLowerCase();
        if (type === "button" || type === "submit" || type === "reset") {
          btn.classList.add("button", "is-dark", "is-small");
        } else {
          btn.classList.remove("button", "is-dark", "is-small");
        }
      }
    };

    if (controlsBar.parentElement !== mainContainer) {
      mainContainer.insertBefore(controlsBar, mainContainer.firstChild);
    }

    const addMedia = ensureAddMediaUI(mainContainer, controlsBar, actionsCluster);
    if (addMedia) {
      if (!addMediaBtn || !document.body.contains(addMediaBtn)) {
        addMediaBtn = document.createElement("button");
        addMediaBtn.id = "btfw-addmedia-btn";
        addMediaBtn.setAttribute("type", "button");
        addMediaBtn.className = "button is-small";
        addMediaBtn.innerHTML = tpl.addMediaButtonHtml();
        actionsCluster.prepend(addMediaBtn);
      } else if (!actionsCluster.contains(addMediaBtn)) {
        actionsCluster.prepend(addMediaBtn);
      }
    } else if (addMediaBtn) {
      if (addMediaBtn.parentElement) addMediaBtn.parentElement.removeChild(addMediaBtn);
      addMediaBtn = null;
    }

    const moveControls = (root: HTMLElement | null) => {
      if (!root) return;
      const elements = Array.from(root.children || []);
      elements.forEach(el => {
        if (!el) return;
        el.classList.add("btfw-plbar__control");
        actionsCluster!.appendChild(el);
      });
    };

    // Move rightcontrols buttons into the enhanced bar
    if (rightControls) {
      moveControls(rightControls);
      rightControls.remove();
    }

    // Move any remaining legacy controls into the bar
    if (controlsRow) {
      moveControls(controlsRow);
      controlsRow.remove();
    }

    actionsCluster.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(styleActionButton);

    if (addMedia && addMediaBtn) {
      addMediaBtn.classList.remove("is-dark");
      addMediaBtn.classList.add("is-primary");
      if (!addMediaBtn.dataset.iconified) {
        addMediaBtn.innerHTML = tpl.addMediaButtonHtml();
        addMediaBtn.dataset.iconified = "1";
      }
      addMediaBtn.setAttribute("aria-controls", "btfw-addmedia-panel");

      const syncState = (open: boolean) => {
        addMediaBtn!.setAttribute("aria-expanded", open ? "true" : "false");
      };

      if (!addMediaBtn.dataset.btfwBound) {
        addMediaBtn.dataset.btfwBound = "1";
        addMediaBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          const panel = document.getElementById("btfw-addmedia-panel") as AddMediaPanelElement | null;
          const toggleFn = panel && panel._btfwToggle;
          const open = typeof toggleFn === "function" ? toggleFn() : false;
          syncState(open);
        });
      }

      const panel = addMedia.panel || (document.getElementById("btfw-addmedia-panel") as AddMediaPanelElement | null);
      if (panel) {
        syncState(panel.dataset.open === "true");
        if (!panel._btfwButtonSync) {
          panel.addEventListener("btfw:addmedia:state", (ev) => {
            syncState(!!(ev as CustomEvent).detail && !!(ev as CustomEvent).detail.open);
          });
          panel._btfwButtonSync = true;
        }
      }
    }

    // Move any floating controls rows into the playlist container
    controlsRows.forEach(row => {
      if (row && !mainContainer.contains(row)) {
        row.style.cssText += `
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `;
        row.remove();
        mainContainer.appendChild(row);
        console.log('[stack] Moved floating controls row into playlist container');
      }
    });

    // Hide the legacy controls row if it no longer contains useful content
    // Ensure the bar is at the top of the playlist container
    if (!mainContainer.contains(controlsBar)) {
      mainContainer.insertBefore(controlsBar, mainContainer.firstChild);
    }
    controlsBar.dataset.btfwMerged = "1";
  }

  function getQueueEntryUid(entry: HTMLElement | null | undefined): string | number | null {
    if (!entry) return null;
    const pluid = Array.from(entry.classList).find((cls) => cls.startsWith("pluid-"));
    if (pluid) return pluid.slice("pluid-".length);
    const jq = window.jQuery || window.$;
    if (jq) {
      const uid = jq(entry).data("uid");
      if (uid != null && uid !== "") return uid as string | number;
    }
    return entry.dataset.uid || null;
  }

  function playQueueEntry(uid: string | number | null | undefined): boolean {
    if (uid == null || uid === "") return false;
    const sock = window.socket;
    if (sock && typeof sock.emit === "function") {
      sock.emit("jumpTo", uid);
      return true;
    }
    const entry = document.querySelector(`#queue > .queue_entry.pluid-${uid}`);
    const nativePlay = entry?.querySelector<HTMLButtonElement>(".qbtn-play");
    if (nativePlay) {
      nativePlay.click();
      return true;
    }
    return false;
  }

  function queueMediaLink(url: string | null | undefined): boolean {
    const trimmed = (url || "").trim();
    if (!trimmed) return false;

    const mediaurl = document.getElementById("mediaurl") as HTMLInputElement | null;
    const queueNext = document.getElementById("queue_next") as HTMLButtonElement | null;
    if (mediaurl && queueNext) {
      mediaurl.value = trimmed;
      if (!queueNext.disabled) {
        queueNext.click();
        return true;
      }
    }

    if (typeof window.queue === "function" && mediaurl) {
      mediaurl.value = trimmed;
      window.queue("next", "url");
      return true;
    }

    const sock = window.socket;
    if (sock && typeof parseMediaLink === "function") {
      try {
        const data = parseMediaLink(trimmed);
        if (data?.id != null && data?.type) {
          sock.emit!("queue", { id: data.id, type: data.type, pos: "next", temp: false });
          return true;
        }
      } catch (_) {}
    }
    return false;
  }

  let queuePreviewObserver: MutationObserver | null = null;
  let queuePreviewHost: Element | null = null;

  function disconnectQueuePreviewObserver(): void {
    if (queuePreviewObserver) {
      try { queuePreviewObserver.disconnect(); } catch (_) {}
      queuePreviewObserver = null;
    }
    queuePreviewHost = null;
  }

  function ensureQueuePreviewObserver(hostEl: Element | null | undefined): void {
    if (!hostEl || queuePreviewHost === hostEl) return;
    disconnectQueuePreviewObserver();
    const queue = document.getElementById("queue");
    if (!queue) return;
    queuePreviewHost = hostEl;
    queuePreviewObserver = new MutationObserver(() => {
      if (hostEl.isConnected && ctx.getActiveFlyoutGroup() === "playlist-group") {
        renderPlaylistQueuePreview(hostEl);
      }
    });
    queuePreviewObserver.observe(queue, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  function getUpcomingQueueEntries(limit = 5): HTMLElement[] {
    const queue = document.getElementById("queue");
    if (!queue) return [];
    const entries = Array.from(queue.querySelectorAll<HTMLElement>(":scope > .queue_entry"));
    const activeIdx = entries.findIndex((el) =>
      el.classList.contains("queue_active") || el.classList.contains("playing")
    );
    const start = activeIdx >= 0 ? activeIdx + 1 : 0;
    return entries.slice(start, start + limit);
  }

  function renderPlaylistQueuePreview(hostEl: Element | null | undefined): void {
    if (!hostEl) return;
    const entries = getUpcomingQueueEntries(5);
    hostEl.replaceChildren();
    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "btfw-panel-playlist__empty";
      empty.textContent = "No upcoming videos";
      hostEl.appendChild(empty);
      return;
    }

    entries.forEach((entry) => {
      const item = document.createElement("div");
      item.className = "btfw-panel-playlist__item";

      const title = document.createElement("span");
      title.className = "btfw-panel-playlist__title";
      title.textContent = (entry.querySelector(".qe_title")?.textContent || "Untitled").trim();

      const meta = document.createElement("span");
      meta.className = "btfw-panel-playlist__meta";
      meta.textContent = (entry.querySelector(".qe_time")?.textContent || "").trim();

      const actions = document.createElement("div");
      actions.className = "btfw-panel-playlist__actions";

      const uid = getQueueEntryUid(entry);
      if (uid != null && uid !== "") {
        const play = document.createElement("button");
        play.type = "button";
        play.className = "btfw-panel-playlist__play";
        play.textContent = "Play";
        play.dataset.queueUid = String(uid);
        const nativePlay = entry?.querySelector(".qbtn-play");
        if (!nativePlay && !(window.socket && typeof window.socket.emit === "function")) {
          play.disabled = true;
        }
        actions.appendChild(play);
      }

      item.append(title, meta, actions);
      hostEl.appendChild(item);
    });
  }

  return {
    ensureAddMediaUI,
    mergePlaylistControls,
    getQueueEntryUid,
    playQueueEntry,
    queueMediaLink,
    disconnectQueuePreviewObserver,
    ensureQueuePreviewObserver,
    getUpcomingQueueEntries,
    renderPlaylistQueuePreview
  };
}
