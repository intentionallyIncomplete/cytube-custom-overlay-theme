BTFW.define("feature:stack", ["feature:layout"], async ({}) => {
  const SKEY="btfw-stack-order";
  const MOTD_VISIBILITY_KEY = "btfw-stack-motd-open";
  const PLAYLIST_VISIBILITY_KEY = "btfw-stack-playlist-open";
  const POLL_VISIBILITY_KEY = "btfw-stack-poll-open";

  const STACK_VISIBILITY = {
    "motd-group": {
      storageKey: MOTD_VISIBILITY_KEY,
      getDefaultOpen: (stored) => getDefaultPollOpen(stored, true),
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
  let populateActive = false;
  let populateTimer = null;

  function hasPollContent(doc = document) {
    if (!doc || typeof doc.querySelector !== "function") return false;
    return !!(
      doc.querySelector("#pollwrap .well.active") ||
      doc.querySelector("#pollwrap .well.muted") ||
      doc.querySelector("#pollwrap .poll-menu")
    );
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
    { id: "searchcontrol", title: "Library & YouTube" },
    { id: "customembed", title: "Custom embed" }
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
            <p class="btfw-addmedia-help">Queue media by URL, browse your library, or embed custom players without leaving the playlist.</p>
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
        { id: "showsearch", target: "searchcontrol" },
        { id: "showcustomembed", target: "customembed" }
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
  
  function mergeMotdElements() {
    const motdwrap = document.getElementById("motdwrap");
    const motdrow = document.getElementById("motdrow");
    const motd = document.getElementById("motd");
    
    if (!motdwrap && !motdrow) return;
    
    // Use motdwrap as the main container, or create it
    let container = motdwrap;
    if (!container && motdrow) {
      container = motdrow;
      container.id = "motdwrap";
    }
    
    // Merge motd content into container (avoid circular reference)
    if (motd && container && !container.contains(motd) && !motd.contains(container)) {
      // Move motd's content directly into container
      while (motd.firstChild) {
        container.appendChild(motd.firstChild);
      }
      motd.remove();
    }

    // Ensure the merged container still exposes an element with id="motd"
    if (container && !container.querySelector("#motd")) {
      const host = document.createElement("div");
      host.id = "motd";
      while (container.firstChild) {
        host.appendChild(container.firstChild);
      }
      container.appendChild(host);
    }

    // Remove duplicate motdrow if we're using motdwrap (avoid circular reference)
    if (motdwrap && motdrow && motdrow !== motdwrap && !motdwrap.contains(motdrow) && !motdrow.contains(motdwrap)) {
      while (motdrow.firstChild) {
        motdwrap.appendChild(motdrow.firstChild);
      }
      motdrow.remove();
    }
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
        addMediaBtn.innerHTML = `<i class="fa fa-plus"></i><span>Add media</span>`;
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
        addMediaBtn.innerHTML = `<i class="fa fa-plus"></i><span>Add media</span>`;
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
      mergeMotdElements();
      // Re-get the element after merging
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
      <span class="btfw-stack-arrows">
        <button class="btfw-arrow btfw-up">↑</button>
        <button class="btfw-arrow btfw-down">↓</button>
      </span>
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
      wrapper.dataset.open = isOpen ? "true" : "false";
      updateToggle();
      if (opts.persist !== false) {
        storeVisibility(storageKey, isOpen);
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
          storeVisibility(storageKey, wrapper.dataset.open !== "false");
        }
      }
    });
    observer.observe(wrapper, { attributes: true, attributeFilter: ["data-open"] });

    arrows.insertBefore(toggleBtn, arrows.firstChild);
    wrapper._btfwSetOpenState = setOpenState;
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
      const arrows = header.querySelector(".btfw-stack-arrows");
      if (arrows) header.insertBefore(slot, arrows);
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
    const idle = !hasPollContent();
    pollWrap.classList.toggle("btfw-poll-idle", idle);
    pollWrap.toggleAttribute("hidden", idle);
    pollWrap.setAttribute("aria-hidden", idle ? "true" : "false");
  }

  function relocateStackHeaderActions() {
    const pollSlot = ensureStackHeaderActionsSlot("poll-group");
    const pollBtn = document.getElementById("newpollbtn");
    if (pollSlot && pollBtn) {
      styleStackHeaderButton(pollBtn, '<i class="fa fa-plus" aria-hidden="true"></i> New Poll');
      if (pollBtn.parentElement !== pollSlot) pollSlot.appendChild(pollBtn);
      const controls = document.querySelector("#pollwrap > .poll-controls");
      if (controls && controls.children.length === 0) controls.remove();
    }

    const motdSlot = ensureStackHeaderActionsSlot("motd-group");
    const motdBtn = document.getElementById("btfw-motd-editbtn");
    if (motdSlot && motdBtn) {
      styleStackHeaderButton(motdBtn, '<i class="fa fa-plus" aria-hidden="true"></i> Edit MOTD');
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
  wirePollObservers(refs);
  wirePollSocket(refs);
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
    const playlistGroup = document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');
    if (playlistGroup) {
      const storedVisibility = getStoredPlaylistVisibility();
      const shouldBeOpen = storedVisibility !== null ? storedVisibility : true;
      playlistGroup.dataset.open = shouldBeOpen ? 'true' : 'false';
      playlistGroup.classList.toggle('is-open', shouldBeOpen);
    }

    const pollGroup = document.querySelector('.btfw-stack-item[data-bind="poll-group"]');
    if (pollGroup) {
      const storedPoll = getStoredPollVisibility();
      const shouldPollOpen = getDefaultPollOpen(storedPoll, hasPollContent());
      pollGroup.dataset.open = shouldPollOpen ? 'true' : 'false';
      pollGroup.classList.toggle('is-open', shouldPollOpen);
    }

    syncPollPanelVisibility(refs);
  }, 1000);
  let n=0;
  const iv=setInterval(()=>{
    populate(refs);
    if(++n>8) clearInterval(iv);
  },700);
}

  document.addEventListener("btfw:layoutReady", boot);
  setTimeout(boot, 1200);
  
  document.addEventListener("btfw:channelThemeTint", () => {
    const refs = ensureStack();
    if (refs) {
      setTimeout(() => populate(refs), 100);
    }
  });

  return {
    name:"feature:stack"
  };
});
