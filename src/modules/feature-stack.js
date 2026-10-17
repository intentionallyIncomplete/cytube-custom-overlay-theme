import { getDefaultPollOpen, hasPollContent } from "../lib/stack-poll-visibility.js";
import { createStackMotd } from "./stack/stack-motd.js";
import { createStackPlaylist } from "./stack/stack-playlist.js"; // resolves to stack-playlist.ts
import { createStackPoll } from "./stack/stack-poll.js"; // resolves to stack-poll.ts
import { createStackPanelBar } from "./stack/stack-panelbar.js"; // resolves to stack-panelbar.ts
import {
  MOTD_VISIBILITY_KEY,
  PLAYLIST_VISIBILITY_KEY,
  POLL_VISIBILITY_KEY,
  DOCKED_KEYS,
  GROUP_LABELS,
  GROUPS,
  SKIP_SELECTORS,
  saveStackOrder as save,
  loadStackOrder as load,
  getStoredVisibility,
  storeVisibility,
  getStoredDocked,
  storeDocked,
  isPanelInDrawer,
  applyStoredPanelOpenState,
  dispatchStackVisibility
} from "../lib/stack-core.js"; // resolves to stack-core.ts (see scripts/build.js)

BTFW.define("feature:stack", ["feature:layout", "util:templates"], async ({ init }) => {
  const templates = await init("util:templates");
  const { stack: stackTpl } = templates;


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

  let populateActive = false;
  let populateTimer = null;
  let bootWired = false;

  // MOTD sub-domain (#228 Phase 2): structure normalization, content detection,
  // panel adoption, visibility sync, observers, and the setMotd socket handler
  // now live in ./stack/stack-motd.ts. Function declarations below are hoisted,
  // so referencing createGroupItem/ensureStack here is safe.
  const motd = createStackMotd({
    createGroupItem,
    ensureStackRefs: () => ensureStack()
  });
  const hasMotdContent = motd.hasMotdContent;

  // Playlist sub-domain (#228 Phase 2): merged controls bar, add-media panel,
  // and panel-bar queue preview now live in ./stack/stack-playlist.ts.
  // The active-flyout getter resolves lazily to the panel bar domain below.
  const playlist = createStackPlaylist({
    tpl: stackTpl,
    getActiveFlyoutGroup: () => panelbar.getActiveFlyoutGroup()
  });

  // Panel bar sub-domain (#228 Phase 2): docked-panels menu shell, panels menu
  // button, flyout previews, dock/undock entry points, and the signature-based
  // bar re-render now live in ./stack/stack-panelbar.ts.
  const panelbar = createStackPanelBar({
    tpl: stackTpl,
    playlist,
    syncPollWrapVisibility: () => poll.syncPollWrapVisibility(),
    setPanelDocked: (wrapper, docked, opts) => setPanelDocked(wrapper, docked, opts),
    ensureStack: () => ensureStack()
  });

  // Poll sub-domain (#228 Phase 2): pollwrap decoupling from the playlist DOM,
  // poll button relocation, panel adoption, visibility sync, observers, and
  // the newPoll/closePoll socket handlers now live in ./stack/stack-poll.ts.
  const poll = createStackPoll({
    createGroupItem
  });
  
  // Define what should be grouped together
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
  
  
  function createGroupItem(group, elements) {
    // Special handling for MOTD group
    if (group.id === "motd-group") {
      motd.normalizeMotdStructure();
      elements = [document.getElementById("motdwrap")].filter(Boolean);
    }
    
    // Special handling for playlist group
    if (group.id === "playlist-group") {
      poll.detachPollWrapFromPlaylist();
      playlist.mergePlaylistControls();
      // Re-get elements after merging; never absorb poll UI into playlist
      elements = elements
        .filter((el) => el && el.id !== "rightcontrols" && el.id !== "pollwrap")
        .filter((el) => !el.querySelector || !el.querySelector("#pollwrap"));
    }

    if (group.id === "poll-group") {
      poll.detachPollWrapFromPlaylist();
      poll.movePollButton();
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
    header.innerHTML = stackTpl.stackGroupHeaderHtml(group.title);

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
      if (isPanelInDrawer(wrapper)) panelbar.restorePanelToStack(wrapper);
      else panelbar.clearActiveFlyoutIf(groupId);
    } else {
      panelbar.restorePanelToStack(wrapper);
      if (wrapper._btfwSetOpenState) {
        wrapper._btfwSetOpenState(true);
      } else {
        wrapper.dataset.open = "true";
        wrapper.classList.add("is-open");
      }
    }

    if (!suppressPersist && dockKey) storeDocked(dockKey, isDocked);
    panelbar.syncPanelBar();
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

  function isModalScopedFooter(el){
    return !!el.closest('.modal, [role="dialog"]');
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

    // Only adopt the real page footer here. A bare `footer` tag selector
    // would otherwise match modal footers (e.g. Theme Settings, MOTD editor)
    // and silently relocate their Apply/Close buttons into this hidden
    // stack footer — see feature-theme-settings.js Apply button reveal bug.
    const real = document.getElementById("footer")
      || Array.from(document.querySelectorAll("footer")).find((el) => !isModalScopedFooter(el));
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

  function stackGroupsSatisfied(list) {
    return GROUPS.every((group) => {
      const hasDom = group.selectors.some((sel) => {
        if (SKIP_SELECTORS.includes(sel)) return false;
        const el = document.querySelector(sel);
        if (!el || list.contains(el) || el.contains(list)) return false;
        if (sel === "#pollwrap") {
          const overlayState = el.dataset?.btfwPollOverlay;
          const attrState = el.getAttribute?.("data-btfw-poll-overlay");
          if (overlayState === "video" || attrState === "video") return false;
        }
        return true;
      });
      if (!hasDom) return true;
      return Boolean(list.querySelector(`[data-bind="${group.id}"]`));
    });
  }

  function populate(refs){
    if (populateActive) return;
    populateActive = true;
    try {
    const list = refs.list;
    const footer = refs.footer;

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
    motd.ensureMotdStackPanel(refs);
    poll.ensurePollStackPanel(refs);
    poll.syncPollWrapVisibility();
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
  motd.wireMotdObservers(refs);
  motd.wireMotdSocket(refs);
  poll.wirePollObservers(refs);
  poll.wirePollSocket(refs);
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

    panelbar.ensurePanelsMenuShell();
    panelbar.ensurePanelsMenuButton();
    panelbar.syncPanelBar();
    poll.syncPollPanelVisibility(refs);
    dispatchStackVisibility();
  }, 1000);
  let n=0;
  const iv=setInterval(()=>{
    populate(refs);
    if(++n>2) clearInterval(iv);
  },700);
}

  document.addEventListener("btfw:layoutReady", boot);
  document.addEventListener("btfw:chat:barsReady", () => {
    panelbar.ensurePanelsMenuShell();
    panelbar.ensurePanelsMenuButton();
    panelbar.syncPanelBar();
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
    motd.applyMotdUpdate(html);
  });

  return {
    name: "feature:stack",
    hasMotdContent,
    resolveMotdHost: motd.resolveMotdHost,
    normalizeMotdStructure: motd.normalizeMotdStructure,
    applyMotdUpdate: motd.applyMotdUpdate,
  };
});
