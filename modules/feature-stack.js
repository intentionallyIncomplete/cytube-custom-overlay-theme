BTFW.define("feature:stack", ["feature:layout"], async ({}) => {
  const SKEY="btfw-stack-order";
  const MOTD_VISIBILITY_KEY = "btfw-stack-motd-open";
  const PLAYLIST_VISIBILITY_KEY = "btfw-stack-playlist-open";
  const POLL_VISIBILITY_KEY = "btfw-stack-poll-open";

  const DOCKED_KEYS = {
    "motd-group": "btfw-stack-motd-docked",
    "playlist-group": "btfw-stack-playlist-docked",
    "poll-group": "btfw-stack-poll-docked"
  };

  /** @deprecated migrated to DOCKED_KEYS */
  const HIDDEN_KEYS = DOCKED_KEYS;

  const GROUP_LABELS = {
    "motd-group": { short: "MOTD", title: "Message of the Day" },
    "playlist-group": { short: "PL", title: "Playlist" },
    "poll-group": { short: "Poll", title: "Polls & Voting" }
  };

  const PANEL_BAR_LABELS = {
    "motd-group": "MD",
    "playlist-group": "PL",
    "poll-group": "PV"
  };

  const PANEL_GROUP_ORDER = {
    "motd-group": 1,
    "poll-group": 2,
    "playlist-group": 3
  };

  let panelBarWired = false;
  let activeFlyoutGroup = null;
  let lastPanelBarSignature = "";
  let flyoutCloseTimer = null;
  let queuePreviewObserver = null;
  let queuePreviewHost = null;

  const STACK_VISIBILITY = {
    "motd-group": {
      storageKey: MOTD_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, hasMotdContent()),
      toggleClass: "btfw-motd-toggle",
      ariaLabel: "Toggle message of the day visibility",
      openTitle: "Hide message of the day",
      closeTitle: "Show message of the day"
    },
    "playlist-group": {
      storageKey: PLAYLIST_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, true),
      toggleClass: "btfw-playlist-toggle",
      ariaLabel: "Toggle playlist visibility",
      openTitle: "Hide playlist (improves performance)",
      closeTitle: "Show playlist"
    },
    "poll-group": {
      storageKey: POLL_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, hasPollContent()),
      toggleClass: "btfw-poll-toggle",
      ariaLabel: "Toggle poll panel visibility",
      openTitle: "Hide poll panel",
      closeTitle: "Show poll panel"
    }
  };

  let pollSyncTimer = null;
  let pollObserverWired = false;
  let pollSocketWired = false;
  let motdSyncTimer = null;
  let motdObserverWired = false;
  let motdSocketWired = false;
  let populateActive = false;
  let populateTimer = null;
  let bootWired = false;

  function hasPollContent(doc = document) {
    if (!doc || typeof doc.querySelector !== "function") return false;
    return !!(
      doc.querySelector("#pollwrap .well.active") ||
      doc.querySelector("#pollwrap .well.muted") ||
      doc.querySelector("#pollwrap .poll-menu")
    );
  }

  function isMotdHtmlEmpty(html = "") {
    const raw = String(html || "").trim();
    if (!raw) return true;
    if (typeof document !== "undefined") {
      const probe = document.createElement("div");
      probe.innerHTML = raw;
      return !Boolean((probe.textContent || "").replace(/\u00a0/g, " ").trim());
    }
    return !Boolean(raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  }

  function hasMotdContent(doc = document) {
    if (!doc || typeof doc.querySelector !== "function") return false;
    const motd = resolveMotdHost(doc);
    if (!motd) return false;
    return !isMotdHtmlEmpty(motd.innerHTML || "");
  }

  function resolveMotdHost(doc = document) {
    if (!doc || typeof doc.getElementById !== "function") return null;
    const motdwrap = doc.getElementById("motdwrap");
    if (!motdwrap) return doc.getElementById("motd");
    const direct = motdwrap.querySelector(":scope > #motd");
    if (direct) return direct;
    return motdwrap.querySelector("#motd") || doc.getElementById("motd");
  }

  function getDefaultPollOpen(stored, hasContent) {
    if (stored !== null && stored !== undefined) return !!stored;
    return !!hasContent;
  }
  
  // Define what should be grouped together
  const GROUPS = [
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
  const SKIP_SELECTORS = ["#main", "#mainpage", "#mainpane"];

  const ADD_MEDIA_SECTIONS = [
    { id: "addfromurl", title: "From URL", default: true },
    { id: "searchcontrol", title: "Library & YouTube" }
  ];

  function ensureAddMediaUI(mainContainer, controlsBar, actionsCluster) {
    if (!mainContainer || !controlsBar || !actionsCluster) return null;

    const available = ADD_MEDIA_SECTIONS.map(cfg => {
      const el = document.getElementById(cfg.id);
      if (!el) return null;
      return { ...cfg, el };
    }).filter(Boolean);

    if (!available.length) {
      const existingPanel = document.getElementById("btfw-addmedia-panel");
      if (existingPanel) existingPanel.remove();
      return null;
    }

    let panel = document.getElementById("btfw-addmedia-panel");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "btfw-addmedia-panel";
      panel.className = "btfw-addmedia-panel";
      panel.dataset.open = "false";
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-label", "Add media controls");
      panel.setAttribute("aria-hidden", "true");
      panel.setAttribute("hidden", "hidden");
      panel.innerHTML = `
        <div class="btfw-addmedia-panel__inner">
          <header class="btfw-addmedia-panel__header">
            <nav class="btfw-addmedia-tabs" role="tablist"></nav>
            <button type="button" class="btfw-addmedia-close" aria-label="Close add media">
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div class="btfw-addmedia-panel__body">
            <div class="btfw-addmedia-views"></div>
            <p class="btfw-addmedia-help">Queue media by URL or browse your library without leaving the playlist.</p>
          </div>
        </div>
      `;
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

    const defaultSection = available.find(sec => sec.default) || available[0];

    const setActive = (targetId) => {
      const activeId = targetId || panel.dataset.active || defaultSection.id;
      panel.dataset.active = activeId;
      tabs.querySelectorAll(".btfw-addmedia-tab").forEach(tab => {
        const match = tab.dataset.target === activeId;
        tab.classList.toggle("is-active", match);
        tab.setAttribute("aria-selected", match ? "true" : "false");
        tab.setAttribute("tabindex", match ? "0" : "-1");
      });
      viewsHost.querySelectorAll(".btfw-addmedia-view").forEach(view => {
        const match = view.dataset.target === activeId;
        view.classList.toggle("is-active", match);
        view.setAttribute("aria-hidden", match ? "false" : "true");
      });
    };

    const toggle = (force) => {
      const open = force != null ? !!force : panel.dataset.open !== "true";
      panel.dataset.open = open ? "true" : "false";
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        panel.removeAttribute("hidden");
        setActive(panel.dataset.active || defaultSection.id);
      } else {
        panel.setAttribute("hidden", "hidden");
      }
      panel.dispatchEvent(new CustomEvent("btfw:addmedia:state", { detail: { open } }));
      return open;
    };

    if (!panel._btfwWired) {
      tabs.addEventListener("click", (ev) => {
        const btn = ev.target.closest(".btfw-addmedia-tab");
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
        const btn = document.getElementById(id);
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

  
  function ensureStack(){
    const left=document.getElementById("btfw-leftpad");
    if(!left) return null;
    let stack=document.getElementById("btfw-stack");
    if(!stack){
      stack=document.createElement("div");
      stack.id="btfw-stack";
      stack.className="btfw-stack";
      const v=document.getElementById("videowrap");
      const overlay=document.getElementById("btfw-video-overlay");
      const anchor=(overlay && v && overlay.parentElement===v.parentElement) ? overlay : v;
      if(anchor && anchor.parentElement) {
        if(anchor.nextSibling) anchor.parentNode.insertBefore(stack, anchor.nextSibling);
        else anchor.parentNode.appendChild(stack);
      } else left.appendChild(stack);

      // Just create the list - no header with "Page Modules"
      const list=document.createElement("div");
      list.className="btfw-stack-list";
      stack.appendChild(list);
      const footer=document.createElement("div");
      footer.id="btfw-stack-footer";
      footer.className="btfw-stack-footer";
      stack.appendChild(footer);
    }
    return {
      list:stack.querySelector(".btfw-stack-list"),
      footer:stack.querySelector("#btfw-stack-footer")
    };
  }
  
  // function normalizeId(el){ 
  //   if(!el) return null; 
  //   if(!el.id) el.id="stackitem-"+Math.random().toString(36).slice(2,7); 
  //   return el.id; 
  // }
  
  // function titleOf(el){ 
  //   return el.getAttribute("data-title")||el.getAttribute("title")||el.id; 
  // }
  
  function normalizeMotdStructure() {
    const motdwrap = document.getElementById("motdwrap");
    if (!motdwrap) return null;

    const toggle = document.getElementById("togglemotd");
    if (toggle && toggle.closest("#motd")) {
      motdwrap.insertBefore(toggle, motdwrap.firstChild);
    }

    const extraParts = [];
    motdwrap.querySelectorAll(".btfw-motd-editrow").forEach((row) => {
      const text = (row.textContent || "").trim();
      if (text) extraParts.push(`<p>${text}</p>`);
      row.remove();
    });

    motdwrap.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach((el) => {
      if (el.contains(motdwrap) || el === motdwrap) return;
      if (el.querySelector("#motd") || el.classList.contains("btfw-motd-editrow")) {
        el.querySelectorAll("#motd").forEach((inner) => {
          if ((inner.innerHTML || "").trim()) extraParts.push(inner.innerHTML);
        });
      }
      el.remove();
    });

    let motd = motdwrap.querySelector(":scope > #motd");
    if (!motd) {
      motd = document.createElement("div");
      motd.id = "motd";
      motdwrap.appendChild(motd);
    }

    motdwrap.querySelectorAll("#motd").forEach((node) => {
      if (node === motd) return;
      if ((node.innerHTML || "").trim()) extraParts.push(node.innerHTML);
      node.remove();
    });

    motd.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach((el) => {
      el.remove();
    });
    motd.querySelectorAll("#motd").forEach((inner) => {
      if ((inner.innerHTML || "").trim()) extraParts.push(inner.innerHTML);
      inner.remove();
    });

    document.querySelectorAll("#togglemotd").forEach((btn, index) => {
      if (index === 0) return;
      btn.remove();
    });

    if (extraParts.length) {
      const merged = extraParts.join("").trim();
      if (merged && isMotdHtmlEmpty(motd.innerHTML)) {
        motd.innerHTML = merged;
      } else if (merged) {
        motd.innerHTML += merged;
      }
    }

    return { motdwrap, motd };
  }
  
  function mergePlaylistControls() {
    const controlsRow = document.getElementById("controlsrow");
    const rightControls = document.getElementById("rightcontrols");
    const plBar = document.getElementById("btfw-plbar");
    const playlistWrap = document.getElementById("playlistwrap");
    const queueContainer = document.getElementById("queuecontainer");
    const playlistRow = document.getElementById("playlistrow");
    const stackPlaylist = document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body');

    // Find any floating controls row (legacy CyTube layout)
    const controlsRows = document.querySelectorAll(".btfw-controls-row");

    // Find the main playlist container
    let mainContainer = playlistRow || playlistWrap || queueContainer || stackPlaylist;
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
    let primary; // search + playlist tools
    let aside;   // playlist actions from rightcontrols
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
    let actionsCluster = controlsBar.querySelector(".btfw-plbar__actions");
    if (!actionsCluster) {
      actionsCluster = document.createElement("div");
      actionsCluster.className = "btfw-plbar__actions";
      (aside || controlsBar).appendChild(actionsCluster);
    }

    let addMediaBtn = document.getElementById("btfw-addmedia-btn");

    const styleActionButton = (btn) => {
      if (!btn) return;
      btn.classList.add("btfw-plbar__action-btn");
      if (btn.tagName === "BUTTON" || btn.tagName === "A") {
        btn.classList.add("button", "is-dark", "is-small");
      } else if (btn.tagName === "INPUT") {
        const type = (btn.type || "").toLowerCase();
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
        addMediaBtn.type = "button";
        addMediaBtn.className = "button is-small";
        addMediaBtn.innerHTML = `<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>`;
        actionsCluster.prepend(addMediaBtn);
      } else if (!actionsCluster.contains(addMediaBtn)) {
        actionsCluster.prepend(addMediaBtn);
      }
    } else if (addMediaBtn) {
      if (addMediaBtn.parentElement) addMediaBtn.parentElement.removeChild(addMediaBtn);
      addMediaBtn = null;
    }

    const moveControls = (root) => {
      if (!root) return;
      const elements = Array.from(root.children || []);
      elements.forEach(el => {
        if (!el) return;
        el.classList.add("btfw-plbar__control");
        actionsCluster.appendChild(el);
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
        addMediaBtn.innerHTML = `<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>`;
        addMediaBtn.dataset.iconified = "1";
      }
      addMediaBtn.setAttribute("aria-controls", "btfw-addmedia-panel");

      const syncState = (open) => {
        addMediaBtn.setAttribute("aria-expanded", open ? "true" : "false");
      };

      if (!addMediaBtn.dataset.btfwBound) {
        addMediaBtn.dataset.btfwBound = "1";
        addMediaBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          const panel = document.getElementById("btfw-addmedia-panel");
          const toggleFn = panel && panel._btfwToggle;
          const open = typeof toggleFn === "function" ? toggleFn() : false;
          syncState(open);
        });
      }

      const panel = addMedia.panel || document.getElementById("btfw-addmedia-panel");
      if (panel) {
        syncState(panel.dataset.open === "true");
        if (!panel._btfwButtonSync) {
          panel.addEventListener("btfw:addmedia:state", (ev) => {
            syncState(!!(ev.detail && ev.detail.open));
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
  }
  
  function createGroupItem(group, elements) {
    // Special handling for MOTD group
    if (group.id === "motd-group") {
      normalizeMotdStructure();
      elements = [document.getElementById("motdwrap")].filter(Boolean);
    }
    
    // Special handling for playlist group
    if (group.id === "playlist-group") {
      detachPollWrapFromPlaylist();
      mergePlaylistControls();
      // Re-get elements after merging; never absorb poll UI into playlist
      elements = elements
        .filter((el) => el && el.id !== "rightcontrols" && el.id !== "pollwrap")
        .filter((el) => !el.querySelector || !el.querySelector("#pollwrap"));
    }

    if (group.id === "poll-group") {
      detachPollWrapFromPlaylist();
      movePollButton();
      const pollWrap = document.getElementById("pollwrap");
      elements = [pollWrap, document.getElementById("btfw-poll-history")]
        .filter(Boolean);
    }

    if (elements.length === 0) return null;
    
    // Filter out any elements that are already in the stack to avoid circular references
    const stackList = document.querySelector("#btfw-stack .btfw-stack-list");
    if (stackList) {
      elements = elements.filter(el => el && !stackList.contains(el) && !el.contains(stackList));
    }
    
    const wrapper = document.createElement("section");
    wrapper.className = "btfw-stack-item btfw-group-item";
    wrapper.dataset.bind = group.id;
    wrapper.dataset.group = "true";
    
    const header = document.createElement("header");
    header.className = "btfw-stack-item__header";
    header.innerHTML = `
      <span class="btfw-stack-item__title">${group.title}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "btfw-stack-item__body btfw-group-body";

    // Add all elements to this group with safety checks
    elements.forEach(el => {
      if (el && el.parentElement !== body && !body.contains(el) && !el.contains(body)) {
        try {
          body.appendChild(el);
        } catch (error) {
          console.warn('[stack] Failed to move element:', el.id || el.className, error);
        }
      }
    });

    wrapper.appendChild(header);
    wrapper.appendChild(body);

    const vis = STACK_VISIBILITY[group.id];
    if (vis) attachStackVisibilityToggle(wrapper, vis);
    attachPanelDockButton(wrapper, group.id);

    // Wire up/down buttons
    wrapper.querySelector(".btfw-up").onclick = function(){
      const p = wrapper.parentElement;
      const prev = wrapper.previousElementSibling;
      if(prev) p.insertBefore(wrapper, prev); 
      save(p); 
    };
    wrapper.querySelector(".btfw-down").onclick = function(){ 
      const p = wrapper.parentElement; 
      const next = wrapper.nextElementSibling; 
      if(next) p.insertBefore(next, wrapper); 
      else p.appendChild(wrapper); 
      save(p); 
    };
    
    return wrapper;
  }
  
  function save(list){ 
    try{ 
      const items = Array.from(list.children).map(n => ({
        id: n.dataset.bind,
        isGroup: n.dataset.group === "true"
      }));
      localStorage.setItem(SKEY, JSON.stringify(items)); 
    }catch(e){} 
  }
  
  function load(){
    try{
      return JSON.parse(localStorage.getItem(SKEY)||"[]");
    }catch(e){
      return [];
    }
  }

  function getStoredVisibility(key){
    try{
      const stored = localStorage.getItem(key);
      if (stored === null) return null;
      return stored === "true";
    }catch(e){
      return null;
    }
  }

  function storeVisibility(key, isOpen){
    try{
      localStorage.setItem(key, isOpen ? "true" : "false");
    }catch(e){}
  }

  function getStoredDocked(key){
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

  function storeDocked(key, isDocked){
    try {
      localStorage.setItem(key, isDocked ? "true" : "false");
    } catch (e) {}
  }

  function isInlineStackEmpty(){
    const items = document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");
    if (!items.length) return true;
    return Array.from(items).every((el) => el.dataset.docked === "true");
  }

  function isPanelInDrawer(item){
    return !!item?.closest(".btfw-panel-container__host");
  }

  function preparePanelForDrawer(item){
    if (!item) return;
    item.classList.add("btfw-stack-item--in-drawer");
    item.dataset.btfwInDrawer = "true";

    const bind = item.dataset.bind;
    if (bind === "poll-group") {
      const pollWrap = item.querySelector("#pollwrap");
      if (pollWrap && hasPollContent()) {
        pollWrap.classList.remove("btfw-poll-idle");
        pollWrap.removeAttribute("hidden");
        pollWrap.setAttribute("aria-hidden", "false");
      }
    }
  }

  function clearPanelDrawerMode(item){
    if (!item) return;
    item.classList.remove("btfw-stack-item--in-drawer");
    delete item.dataset.btfwInDrawer;
    item.classList.toggle("is-open", item.dataset.open !== "false");
    syncPollWrapVisibility();
  }

  function restorePanelToStack(item){
    clearPanelDrawerMode(item);
    const list = document.querySelector("#btfw-stack .btfw-stack-list");
    if (!list || !item) return;
    if (item.parentElement !== list) list.appendChild(item);
  }

  function applyStoredPanelOpenState(wrapper, storageKey, getDefaultOpen){
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

  function dispatchStackVisibility(){
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

  function ensurePanelsMenuShell(){
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
    const bar = shell.querySelector("#btfw-panel-bar");
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

  function onPanelsMenuButtonClick(ev){
    ev.preventDefault();
    ev.stopPropagation();
    togglePanelBar();
  }

  function ensurePanelsMenuButton(){
    const shell = ensurePanelsMenuShell();
    if (!shell) return null;

    let btn = document.getElementById("btfw-panels-menu-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "btfw-panels-menu-btn";
      btn.className = "button btfw-chatbtn btfw-panels-menu-btn";
      btn.innerHTML = '<span class="btfw-panels-menu-btn__label">Panels</span>';
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

  function getQueueEntryUid(entry){
    if (!entry) return null;
    const pluid = Array.from(entry.classList).find((cls) => cls.startsWith("pluid-"));
    if (pluid) return pluid.slice("pluid-".length);
    const jq = window.jQuery || window.$;
    if (jq) {
      const uid = jq(entry).data("uid");
      if (uid != null && uid !== "") return uid;
    }
    return entry.dataset.uid || null;
  }

  function playQueueEntry(uid){
    if (uid == null || uid === "") return false;
    const sock = window.socket;
    if (sock && typeof sock.emit === "function") {
      sock.emit("jumpTo", uid);
      return true;
    }
    const entry = document.querySelector(`#queue > .queue_entry.pluid-${uid}`);
    const nativePlay = entry?.querySelector(".qbtn-play");
    if (nativePlay) {
      nativePlay.click();
      return true;
    }
    return false;
  }

  function queueMediaLink(url){
    const trimmed = (url || "").trim();
    if (!trimmed) return false;

    const mediaurl = document.getElementById("mediaurl");
    const queueNext = document.getElementById("queue_next");
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
          sock.emit("queue", { id: data.id, type: data.type, pos: "next", temp: false });
          return true;
        }
      } catch (_) {}
    }
    return false;
  }

  function undockPanelFromMenu(groupId){
    ensureStack();
    const wrapper = document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${groupId}"]`);
    if (!wrapper) return;

    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }
    activeFlyoutGroup = null;
    document.querySelectorAll(".btfw-panel-btn.is-active").forEach((el) => {
      el.classList.remove("is-active");
      delete el.dataset.btfwFlyoutLocked;
    });
    document.documentElement.classList.remove("btfw-panels-flyout-open");
    disconnectQueuePreviewObserver();

    setPanelDocked(wrapper, false);
    requestAnimationFrame(() => {
      try { wrapper.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (_) {}
    });
  }

  function wirePanelBarActions(bar){
    if (!bar || bar.dataset.btfwActionsWired) return;
    bar.dataset.btfwActionsWired = "1";

    bar.addEventListener("click", (ev) => {
      const undock = ev.target.closest(".btfw-panel-undock");
      if (undock) {
        ev.preventDefault();
        ev.stopPropagation();
        const groupId = undock.dataset.panelGroup || undock.closest(".btfw-panel-btn")?.dataset.group;
        if (groupId) undockPanelFromMenu(groupId);
        return;
      }

      const playBtn = ev.target.closest(".btfw-panel-playlist__play");
      if (playBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        playQueueEntry(playBtn.dataset.queueUid);
        return;
      }

      const addBtn = ev.target.closest(".btfw-panel-playlist__add");
      if (addBtn) {
        ev.preventDefault();
        ev.stopPropagation();
        const form = addBtn.closest(".btfw-panel-container")?.querySelector(".btfw-panel-playlist__add-form");
        if (!form) return;
        const open = form.hidden;
        form.hidden = !open;
        addBtn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) form.querySelector(".btfw-panel-playlist__link-input")?.focus();
      }
    });

    bar.addEventListener("submit", (ev) => {
      const form = ev.target.closest(".btfw-panel-playlist__add-form");
      if (!form) return;
      ev.preventDefault();
      ev.stopPropagation();
      const input = form.querySelector(".btfw-panel-playlist__link-input");
      const url = input?.value?.trim();
      if (!url || !queueMediaLink(url)) return;
      input.value = "";
      form.hidden = true;
      form.closest(".btfw-panel-container")?.querySelector(".btfw-panel-playlist__add")
        ?.setAttribute("aria-expanded", "false");
      const host = form.closest(".btfw-panel-container")?.querySelector(".btfw-panel-playlist__queue");
      if (host) renderPlaylistQueuePreview(host);
    });
  }

  function disconnectQueuePreviewObserver(){
    if (queuePreviewObserver) {
      try { queuePreviewObserver.disconnect(); } catch (_) {}
      queuePreviewObserver = null;
    }
    queuePreviewHost = null;
  }

  function ensureQueuePreviewObserver(hostEl){
    if (!hostEl || queuePreviewHost === hostEl) return;
    disconnectQueuePreviewObserver();
    const queue = document.getElementById("queue");
    if (!queue) return;
    queuePreviewHost = hostEl;
    queuePreviewObserver = new MutationObserver(() => {
      if (hostEl.isConnected && activeFlyoutGroup === "playlist-group") {
        renderPlaylistQueuePreview(hostEl);
      }
    });
    queuePreviewObserver.observe(queue, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  function getUpcomingQueueEntries(limit = 5){
    const queue = document.getElementById("queue");
    if (!queue) return [];
    const entries = Array.from(queue.querySelectorAll(":scope > .queue_entry"));
    const activeIdx = entries.findIndex((el) =>
      el.classList.contains("queue_active") || el.classList.contains("playing")
    );
    const start = activeIdx >= 0 ? activeIdx + 1 : 0;
    return entries.slice(start, start + limit);
  }

  function renderPlaylistQueuePreview(hostEl){
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

  function createPanelUndockButton(groupId, meta){
    const undock = document.createElement("button");
    undock.type = "button";
    undock.className = "btfw-panel-undock";
    undock.dataset.panelGroup = groupId;
    undock.setAttribute("aria-label", `Pin ${meta.title} below video`);
    undock.title = "Pin below video";
    undock.innerHTML = '<i class="fa fa-thumb-tack" aria-hidden="true"></i>';
    return undock;
  }

  function buildPlaylistPanelAddForm(){
    const addForm = document.createElement("form");
    addForm.className = "btfw-panel-playlist__add-form";
    addForm.hidden = true;
    addForm.innerHTML = `
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `;
    return addForm;
  }

  function buildPanelContainer(groupId, meta, index){
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

  function closeAllFlyouts(){
    if (flyoutCloseTimer) {
      clearTimeout(flyoutCloseTimer);
      flyoutCloseTimer = null;
    }
    document.querySelectorAll(".btfw-panel-btn.is-active").forEach((el) => {
      el.classList.remove("is-active");
      delete el.dataset.btfwFlyoutLocked;
    });
    document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach((item) => {
      restorePanelToStack(item);
    });
    disconnectQueuePreviewObserver();
    activeFlyoutGroup = null;
    document.documentElement.classList.remove("btfw-panels-flyout-open");
  }

  function setPanelBarOpen(open){
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

  function closePanelBar(){
    setPanelBarOpen(false);
  }

  function togglePanelBar(){
    ensurePanelsMenuShell();
    const bar = document.getElementById("btfw-panel-bar");
    const btn = document.getElementById("btfw-panels-menu-btn");
    if (!bar || !btn || btn.hidden) return;
    setPanelBarOpen(!bar.classList.contains("open"));
  }

  function scheduleCloseFlyout(groupId){
    if (flyoutCloseTimer) clearTimeout(flyoutCloseTimer);
    flyoutCloseTimer = setTimeout(() => {
      flyoutCloseTimer = null;
      const btn = document.querySelector(`.btfw-panel-btn[data-group="${groupId}"]`);
      if (!btn) return;
      if (btn.matches(":hover") || btn.querySelector(".btfw-panel-container:hover")) return;
      btn.classList.remove("is-active");
      if (activeFlyoutGroup === groupId) {
        activeFlyoutGroup = null;
        disconnectQueuePreviewObserver();
      }
      if (!document.querySelector(".btfw-panel-btn.is-active")) {
        document.documentElement.classList.remove("btfw-panels-flyout-open");
      }
    }, 140);
  }

  function openPanelPreview(groupId, btnEl){
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
        renderPlaylistQueuePreview(host);
        ensureQueuePreviewObserver(host);
      }
    }
  }

  function wirePanelDismiss(){
    if (document.documentElement.dataset.btfwPanelDismissWired) return;
    document.documentElement.dataset.btfwPanelDismissWired = "1";
    document.addEventListener("click", (ev) => {
      if (!activeFlyoutGroup) return;
      if (ev.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")) return;
      document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach((el) => {
        delete el.dataset.btfwFlyoutLocked;
      });
      closeAllFlyouts();
    });
  }

  function togglePanelFlyout(groupId, btn){
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
        disconnectQueuePreviewObserver();
      }
      if (!document.querySelector(".btfw-panel-btn.is-active")) {
        document.documentElement.classList.remove("btfw-panels-flyout-open");
      }
      return;
    }

    document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach((el) => {
      if (el !== btn) delete el.dataset.btfwFlyoutLocked;
    });
    btn.dataset.btfwFlyoutLocked = "true";
    openPanelPreview(groupId, btn);
  }

  function wirePanelBtn(btn, groupId){
    const container = btn.querySelector(".btfw-panel-container");

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
      if (ev.target.closest(".btfw-panel-container")) return;
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
      if (!container?.contains(ev.relatedTarget)) scheduleCloseFlyout(groupId);
    });
    container?.addEventListener("mouseenter", () => {
      if (flyoutCloseTimer) {
        clearTimeout(flyoutCloseTimer);
        flyoutCloseTimer = null;
      }
    });
    container?.addEventListener("mouseleave", (ev) => {
      if (btn.dataset.btfwFlyoutLocked === "true") return;
      if (!btn.contains(ev.relatedTarget)) scheduleCloseFlyout(groupId);
    });
  }

  function syncPanelBar(){
    const shell = ensurePanelsMenuShell();
    ensurePanelsMenuButton();
    const bar = shell?.querySelector("#btfw-panel-bar");
    if (!bar) return;

    const docked = Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]'))
      .sort((a, b) => (PANEL_GROUP_ORDER[a.dataset.bind] || 99) - (PANEL_GROUP_ORDER[b.dataset.bind] || 99));

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
      const meta = GROUP_LABELS[groupId] || { short: "?", title: groupId };
      const btn = document.createElement("div");
      btn.className = "btfw-panel-btn";
      btn.dataset.group = groupId;
      btn.title = meta.title;
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-label", meta.title);
      btn.tabIndex = 0;

      const label = document.createElement("span");
      label.className = "btfw-panel-btn__label";
      label.textContent = PANEL_BAR_LABELS[groupId] || meta.short;
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

  function setPanelDocked(wrapper, docked, opts = {}){
    if (!wrapper) return;
    const isDocked = !!docked;
    const suppressPersist = opts.persist === false;
    const groupId = wrapper.dataset.bind;
    const dockKey = DOCKED_KEYS[groupId];

    wrapper.dataset.docked = isDocked ? "true" : "false";
    wrapper.classList.toggle("btfw-stack-item--docked", isDocked);

    const dockBtn = wrapper.querySelector(".btfw-stack-dock-btn");
    if (dockBtn) {
      dockBtn.setAttribute("aria-pressed", isDocked ? "true" : "false");
      dockBtn.title = isDocked ? "Pinned to panels menu" : "Dock to panels menu";
    }

    if (isDocked) {
      if (isPanelInDrawer(wrapper)) restorePanelToStack(wrapper);
      else if (activeFlyoutGroup === groupId) activeFlyoutGroup = null;
    } else {
      restorePanelToStack(wrapper);
      if (wrapper._btfwSetOpenState) {
        wrapper._btfwSetOpenState(true);
      } else {
        wrapper.dataset.open = "true";
        wrapper.classList.add("is-open");
      }
    }

    if (!suppressPersist && dockKey) storeDocked(dockKey, isDocked);
    syncPanelBar();
    dispatchStackVisibility();
  }

  function attachPanelDockButton(wrapper, groupId){
    const dockKey = DOCKED_KEYS[groupId];
    if (!dockKey) return;

    const header = wrapper.querySelector(".btfw-stack-item__header");
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
    dockBtn.setAttribute("aria-label", `Dock ${GROUP_LABELS[groupId]?.title || groupId} to panels menu`);
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

  function getStoredPlaylistVisibility(){
    return getStoredVisibility(PLAYLIST_VISIBILITY_KEY);
  }

  function storePlaylistVisibility(isOpen){
    storeVisibility(PLAYLIST_VISIBILITY_KEY, isOpen);
  }

  function getStoredPollVisibility(){
    return getStoredVisibility(POLL_VISIBILITY_KEY);
  }

  function storePollVisibility(isOpen){
    storeVisibility(POLL_VISIBILITY_KEY, isOpen);
  }

  function attachStackVisibilityToggle(wrapper, options = {}) {
    const {
      storageKey,
      getDefaultOpen,
      toggleClass,
      ariaLabel = "Toggle panel visibility",
      openTitle = "Hide panel",
      closeTitle = "Show panel"
    } = options;

    const stored = getStoredVisibility(storageKey);
    const defaultOpen = typeof getDefaultOpen === "function"
      ? getDefaultOpen(stored)
      : (stored !== null ? stored : true);

    if (!wrapper.hasAttribute("data-open")) {
      wrapper.dataset.open = defaultOpen ? "true" : "false";
    }

    wrapper.classList.toggle("is-open", wrapper.dataset.open !== "false");

    const header = wrapper.querySelector(".btfw-stack-item__header");
    const arrows = header && header.querySelector(".btfw-stack-arrows");
    if (!arrows || arrows.querySelector(`.${toggleClass}`)) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = `btfw-arrow ${toggleClass}`;
    toggleBtn.setAttribute("aria-label", ariaLabel);
    toggleBtn.style.display = "flex";
    toggleBtn.style.alignItems = "center";
    toggleBtn.style.justifyContent = "center";

    const updateToggle = () => {
      const isOpen = wrapper.dataset.open !== "false";
      toggleBtn.textContent = isOpen ? "👁️" : "👁️‍🗨️";
      toggleBtn.title = isOpen ? openTitle : closeTitle;
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      wrapper.classList.toggle("is-open", isOpen);
    };

    const setOpenState = (open, opts = {}) => {
      const isOpen = !!open;
      const suppressPersist = opts.persist === false;
      if (suppressPersist) wrapper._btfwSuppressPersist = true;
      wrapper.dataset.open = isOpen ? "true" : "false";
      updateToggle();
      if (!suppressPersist) {
        storeVisibility(storageKey, isOpen);
      }
      if (suppressPersist) {
        queueMicrotask(() => {
          wrapper._btfwSuppressPersist = false;
        });
      }
    };

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
          if (!wrapper._btfwSuppressPersist) {
            storeVisibility(storageKey, wrapper.dataset.open !== "false");
          }
        }
      }
    });
    observer.observe(wrapper, { attributes: true, attributeFilter: ["data-open"] });

    arrows.insertBefore(toggleBtn, arrows.firstChild);
    wrapper._btfwSetOpenState = setOpenState;
    attachPanelDockButton(wrapper, wrapper.dataset.bind);
  }

  function detachPollWrapFromPlaylist() {
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

  function ensureMotdStackPanel(refs) {
    normalizeMotdStructure();

    const motdwrap = document.getElementById("motdwrap");
    if (!motdwrap) return;

    const list = refs && refs.list;
    if (!list) return;

    let motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]');
    if (!motdGroup) {
      const group = GROUPS.find((g) => g.id === "motd-group");
      if (!group) return;
      motdGroup = createGroupItem(group, [motdwrap]);
      if (motdGroup) {
        list.appendChild(motdGroup);
        save(list);
      }
    } else {
      const body = motdGroup.querySelector(".btfw-group-body");
      if (body && !body.contains(motdwrap)) {
        body.appendChild(motdwrap);
      }
    }

    syncMotdWrapVisibility(motdGroup);
  }

  function syncMotdWrapVisibility(motdGroup) {
    const motdwrap = document.getElementById("motdwrap");
    if (!motdwrap) return;

    const hasContent = hasMotdContent();
    motdwrap.classList.toggle("btfw-motd-empty", !hasContent);
    motdwrap.toggleAttribute("hidden", !hasContent);
    motdwrap.setAttribute("aria-hidden", hasContent ? "false" : "true");

    if (hasContent) {
      motdwrap.style.removeProperty("display");
      const motd = resolveMotdHost();
      if (motd) motd.style.removeProperty("display");
    }

    if (!motdGroup) {
      motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]');
    }
    if (motdGroup && hasContent) {
      const stored = getStoredVisibility(MOTD_VISIBILITY_KEY);
      const shouldOpen = getDefaultPollOpen(stored, true);
      if (motdGroup._btfwSetOpenState) {
        motdGroup._btfwSetOpenState(shouldOpen, { persist: false });
      } else {
        motdGroup.dataset.open = shouldOpen ? "true" : "false";
        motdGroup.classList.toggle("is-open", shouldOpen);
      }
    }
  }

  function scheduleMotdSync(refs) {
    if (motdSyncTimer) clearTimeout(motdSyncTimer);
    motdSyncTimer = setTimeout(() => {
      motdSyncTimer = null;
      ensureMotdStackPanel(refs);
    }, 50);
  }

  function wireMotdObservers(refs) {
    const motd = resolveMotdHost();
    if (!motd) return;

    if (!motdObserverWired) {
      motdObserverWired = true;
      const observer = new MutationObserver(() => {
        scheduleMotdSync(refs);
      });
      observer.observe(motd, { childList: true, subtree: true, characterData: true });
    }
  }

  function wireMotdSocket(refs) {
    if (motdSocketWired || !window.socket || !window.socket.on) return;
    motdSocketWired = true;
    window.socket.on("setMotd", () => {
      scheduleMotdSync(refs);
    });
  }

  function applyMotdUpdate(html) {
    const refs = ensureStack();
    const resolved = normalizeMotdStructure();
    const motd = resolved?.motd || resolveMotdHost();
    if (motd && typeof html === "string") {
      motd.innerHTML = html;
    }
    const csMotd = document.getElementById("cs-motdtext");
    if (csMotd && typeof html === "string") csMotd.value = html;
    if (refs) scheduleMotdSync(refs);
  }

  function ensurePollStackPanel(refs) {
    const pollWrap = document.getElementById("pollwrap");
    if (!pollWrap) return;

    const overlayState = pollWrap.dataset && pollWrap.dataset.btfwPollOverlay;
    const attrState = pollWrap.getAttribute && pollWrap.getAttribute("data-btfw-poll-overlay");
    if (overlayState === "video" || attrState === "video") return;

    detachPollWrapFromPlaylist();
    movePollButton();

    const list = refs && refs.list;
    if (!list) return;

    let pollGroup = document.querySelector('.btfw-stack-item[data-bind="poll-group"]');
    if (!pollGroup) {
      const group = GROUPS.find((g) => g.id === "poll-group");
      if (!group) return;
      pollGroup = createGroupItem(group, [pollWrap]);
      if (pollGroup) {
        list.appendChild(pollGroup);
        save(list);
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

  function syncPollPanelVisibility(refs, options = {}) {
    ensurePollStackPanel(refs);
    syncPollWrapVisibility();

    const group = document.querySelector('.btfw-stack-item[data-bind="poll-group"]');
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

  function schedulePollSync(refs, options = {}) {
    if (pollSyncTimer) clearTimeout(pollSyncTimer);
    pollSyncTimer = setTimeout(() => {
      pollSyncTimer = null;
      syncPollPanelVisibility(refs, options);
    }, 50);
  }

  function wirePollObservers(refs) {
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

  function wirePollSocket(refs) {
    if (pollSocketWired || !window.socket || !window.socket.on) return;
    pollSocketWired = true;
    window.socket.on("newPoll", () => schedulePollSync(refs, { forceOpen: true }));
    window.socket.on("closePoll", () => schedulePollSync(refs));
  }
  
  function attachFooter(footer){
    if (!footer) return;
    if (footer.querySelector("#btfw-footer")) return;

    const themed = document.getElementById("btfw-footer");
    if (themed && themed !== footer && !footer.contains(themed)) {
      footer.innerHTML = "";
      footer.appendChild(themed);
      return;
    }

    const real=document.getElementById("footer")||document.querySelector("footer");
    if(real && !footer.contains(real)){
      real.classList.add("btfw-footer");
      footer.innerHTML="";
      footer.appendChild(real);
    }
  }

  function ensureStackHeaderActionsSlot(groupId) {
    const group = document.querySelector(`.btfw-stack-item[data-bind="${groupId}"]`);
    const header = group?.querySelector(".btfw-stack-item__header");
    if (!header) return null;

    let slot = header.querySelector(".btfw-stack-header-actions");
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

  function styleStackHeaderButton(btn, html) {
    if (!btn) return;
    btn.classList.remove("btn", "btn-sm", "btn-default", "button", "is-small", "is-link");
    btn.classList.add("btfw-stack-header-btn");
    if (btn.innerHTML !== html) btn.innerHTML = html;
  }

  function syncPollWrapVisibility() {
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

  function relocateStackHeaderActions() {
    const pollSlot = ensureStackHeaderActionsSlot("poll-group");
    const pollBtn = document.getElementById("newpollbtn");
    if (pollSlot && pollBtn) {
      styleStackHeaderButton(pollBtn, '<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll');
      if (pollBtn.parentElement !== pollSlot) pollSlot.appendChild(pollBtn);
      const controls = document.querySelector("#pollwrap > .poll-controls");
      if (controls && controls.children.length === 0) controls.remove();
    }

    const motdSlot = ensureStackHeaderActionsSlot("motd-group");
    const motdBtn = document.getElementById("btfw-motd-editbtn");
    if (motdSlot && motdBtn) {
      styleStackHeaderButton(motdBtn, '<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD');
      if (motdBtn.parentElement !== motdSlot) motdSlot.appendChild(motdBtn);
      const row = motdBtn.closest(".btfw-motd-editrow");
      if (row && row.parentElement) row.remove();
    }
  }

  function movePollButton() {
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
  
  function populate(refs){
    if (populateActive) return;
    populateActive = true;
    try {
    const list = refs.list;
    const footer = refs.footer;
    
    // Move poll button first, then decouple poll from playlist DOM
    movePollButton();
    detachPollWrapFromPlaylist();
    
    // Group elements
    const groupedElements = new Map();
    
    // Process groups with better safety checks
    GROUPS.forEach(group => {
      const elements = [];
      group.selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        if (list.contains(el) || el.contains(list)) return;
        if (SKIP_SELECTORS.includes(sel)) return;
        if (sel === "#pollwrap") {
          const overlayState = el.dataset && el.dataset.btfwPollOverlay;
          const attrState = el.getAttribute && el.getAttribute("data-btfw-poll-overlay");
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
    const itemsToAdd = [];
    
    // Add groups
    groupedElements.forEach(({ group, elements }, groupId) => {
      const existingItem = Array.from(list.children).find(n => n.dataset.bind === groupId);
      if (!existingItem) {
        try {
          const groupItem = createGroupItem(group, elements);
          if (groupItem) {
            itemsToAdd.push({ item: groupItem, id: groupId, priority: group.priority, isGroup: true });
          }
        } catch (error) {
          console.warn('[stack] Failed to create group item:', groupId, error);
        }
      }
    });
    
    // Sort by saved order, then by priority
    if (savedOrder.length > 0) {
      itemsToAdd.sort((a, b) => {
        const aIndex = savedOrder.findIndex(s => s.id === a.id);
        const bIndex = savedOrder.findIndex(s => s.id === b.id);
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
        console.warn('[stack] Failed to add item to list:', error);
      }
    });
    
    save(list);
    ensureMotdStackPanel(refs);
    ensurePollStackPanel(refs);
    syncPollWrapVisibility();
    relocateStackHeaderActions();
    attachFooter(footer);
    } finally {
      populateActive = false;
    }
  }

 function boot(){
  const refs=ensureStack();
  if(!refs) return;
  populate(refs);
  wireMotdObservers(refs);
  wireMotdSocket(refs);
  wirePollObservers(refs);
  wirePollSocket(refs);
  if (bootWired) return;
  bootWired = true;
    const observer=new MutationObserver(() => {
      if (populateTimer) return;
      populateTimer = requestAnimationFrame(() => {
        populateTimer = null;
        populate(refs);
      });
    });
    const leftpad = document.getElementById('btfw-leftpad');
  const main = document.getElementById('main');
  
  if (leftpad) {
    observer.observe(leftpad, {childList:true, subtree:false});
  }
  if (main) {
    observer.observe(main, {childList:true, subtree:false});
  }
  setTimeout(() => {
    const motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]');
    if (motdGroup) {
      applyStoredPanelOpenState(motdGroup, MOTD_VISIBILITY_KEY, (stored) => getDefaultPollOpen(stored, hasMotdContent()));
    }

    const playlistGroup = document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');
    if (playlistGroup) {
      applyStoredPanelOpenState(playlistGroup, PLAYLIST_VISIBILITY_KEY, (stored) => stored !== null ? !!stored : true);
    }

    const pollGroup = document.querySelector('.btfw-stack-item[data-bind="poll-group"]');
    if (pollGroup) {
      applyStoredPanelOpenState(pollGroup, POLL_VISIBILITY_KEY, (stored) => getDefaultPollOpen(stored, hasPollContent()));
    }

    document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach((item) => {
      const dockKey = DOCKED_KEYS[item.dataset.bind];
      if (!dockKey) return;
      setPanelDocked(item, getStoredDocked(dockKey), { persist: false });
    });

    ensurePanelsMenuShell();
    ensurePanelsMenuButton();
    syncPanelBar();
    syncPollPanelVisibility(refs);
    dispatchStackVisibility();
  }, 1000);
  let n=0;
  const iv=setInterval(()=>{
    populate(refs);
    if(++n>8) clearInterval(iv);
  },700);
}

  document.addEventListener("btfw:layoutReady", boot);
  document.addEventListener("btfw:chat:barsReady", () => {
    ensurePanelsMenuShell();
    ensurePanelsMenuButton();
    syncPanelBar();
  });
  setTimeout(boot, 1200);
  
  document.addEventListener("btfw:channelThemeTint", () => {
    const refs = ensureStack();
    if (refs) {
      setTimeout(() => populate(refs), 100);
    }
  });

  document.addEventListener("btfw:motd:updated", (event) => {
    const html = event?.detail?.html;
    if (typeof html !== "string") return;
    applyMotdUpdate(html);
  });

  return {
    name: "feature:stack",
    hasMotdContent,
    resolveMotdHost,
    normalizeMotdStructure,
    applyMotdUpdate,
  };
});
