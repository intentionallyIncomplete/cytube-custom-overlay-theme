BTFW.define("feature:layout", ["feature:styleCore","feature:themeMode"], async ({}) => {
  const SPLIT_KEY = "btfw:grid:leftPx";
  /** "right" = video left, chat right (default). "left" = chat left, video right. */
  const CHAT_SIDE_KEY = "btfw:layout:chatSide";
  const NAV_HOST_ID = "btfw-navhost";
  const VIDEO_MIN_PX = 520;
  const DEFAULT_VIDEO_TARGET = 680;
  const CHAT_MIN_PX = 360;
  const WIDTH_BUFFER = 20;
  const MOBILE_THRESHOLD_MIN = 900;
  const MOBILE_THRESHOLD_MAX = 1100;
  const STACK_HYSTERESIS_PX = 40;
  const RATIO_KEY = "btfw:grid:videoRatio";
  const MIN_VIDEO_RATIO = 0.35;
  const MAX_VIDEO_RATIO = 0.78;
  const DEFAULT_VIDEO_RATIO = 0.62;
  const VIDEO_MIN_HEIGHT_PX = 180;

  let videoColumnPx = null;
  let videoColumnRatio = null;
  let chatSidePref = "right";
  let isVertical = false;
  let navAutohideActive = false;
  let navAutohideHidden = false;

  function getViewportHeight(){
    return window.visualViewport?.height || window.innerHeight || 1440;
  }

  function isStackFullyHidden(){
    const items = document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");
    if (!items.length) return true;
    return Array.from(items).every((el) => el.dataset.docked === "true");
  }

  function measureOverlayHeight(){
    const overlay = document.getElementById("btfw-video-overlay");
    if (!overlay) return 0;
    const style = getComputedStyle(overlay);
    if (style.display === "none") return 0;
    return overlay.offsetHeight || 0;
  }

  function getTopEffectivePx(){
    const root = document.documentElement;
    const navReal = parseFloat(getComputedStyle(root).getPropertyValue("--btfw-nav-real-height")) || 48;
    return navAutohideActive && navAutohideHidden ? 0 : navReal;
  }

  function getPrimaryRowHeight(){
    const viewportH = getViewportHeight();
    const topEffective = getTopEffectivePx();
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap")) || 10;
    return Math.max(0, viewportH - topEffective - gap * 2);
  }

  function roundLayoutPx(value){
    return Math.max(0, Math.round(value / 2) * 2);
  }

  function applyViewportBudget(){
    const root = document.documentElement;
    const topEffective = getTopEffectivePx();
    const gap = parseFloat(getComputedStyle(root).getPropertyValue("--btfw-gap")) || 10;
    const primaryRowH = getPrimaryRowHeight();

    root.style.setProperty("--btfw-top-effective", `${topEffective}px`);
    root.style.setProperty("--btfw-primary-budget", `${Math.floor(primaryRowH)}px`);
    root.style.setProperty("--btfw-primary-row-h", `${Math.floor(primaryRowH)}px`);

    const leftpad = document.getElementById("btfw-leftpad");
    const colW = isVertical
      ? Math.max(0, window.innerWidth - gap * 2)
      : (leftpad?.getBoundingClientRect().width || window.innerWidth * DEFAULT_VIDEO_RATIO);
    const aspectCap = colW * (9 / 16);

    if (!isVertical) {
      const stageH = primaryRowH;
      root.style.setProperty("--btfw-video-stage-h", `${Math.floor(stageH)}px`);
      root.style.setProperty("--btfw-stack-max-h", "none");
      root.style.setProperty("--btfw-video-max-h", "none");
      return;
    }

    root.style.setProperty("--btfw-stack-max-h", "none");

    const overlayH = roundLayoutPx(measureOverlayHeight());
    const half = roundLayoutPx(Math.floor(primaryRowH / 2));
    let videowrapH = Math.max(VIDEO_MIN_HEIGHT_PX, half - overlayH);
    videowrapH = roundLayoutPx(Math.min(videowrapH, aspectCap));
    const videoRowH = videowrapH + overlayH;
    const chatRowH = half;

    root.style.setProperty("--btfw-video-chrome-h", `${overlayH}px`);
    root.style.setProperty("--btfw-videowrap-max-h", `${videowrapH}px`);
    root.style.setProperty("--btfw-vertical-video-row-h", `${videoRowH}px`);
    root.style.setProperty("--btfw-vertical-chat-row-h", `${chatRowH}px`);
    root.style.setProperty("--btfw-video-row-h", `${videoRowH}px`);
    root.style.setProperty("--btfw-video-max-h", `${videoRowH}px`);
  }

  function alignPrimaryRowBottoms(){
    if (!isVertical) return;
    const viewportH = getViewportHeight();
    const margin = 2;
    const root = document.documentElement;
    const chat = document.getElementById("btfw-chatcol");
    const leftpad = document.getElementById("btfw-leftpad");
    if (!chat || !leftpad) return;

    const chatBottom = chat.getBoundingClientRect().bottom;
    if (chatBottom <= viewportH - margin) return;

    const overflow = chatBottom - (viewportH - margin);
    const overlayH = measureOverlayHeight();
    const currentChat = parseFloat(getComputedStyle(root).getPropertyValue("--btfw-vertical-chat-row-h"))
      || chat.getBoundingClientRect().height
      || 0;
    const currentVideoRow = parseFloat(getComputedStyle(root).getPropertyValue("--btfw-vertical-video-row-h"))
      || parseFloat(getComputedStyle(root).getPropertyValue("--btfw-video-row-h"))
      || 0;
    const currentVideowrap = Math.max(0, currentVideoRow - overlayH);

    const setVideoRow = (videowrapPx) => {
      const nextVideowrap = Math.max(VIDEO_MIN_HEIGHT_PX, Math.floor(videowrapPx));
      const nextRowH = nextVideowrap + overlayH;
      root.style.setProperty("--btfw-videowrap-max-h", `${nextVideowrap}px`);
      root.style.setProperty("--btfw-vertical-video-row-h", `${nextRowH}px`);
      root.style.setProperty("--btfw-video-row-h", `${nextRowH}px`);
      root.style.setProperty("--btfw-video-max-h", `${nextRowH}px`);
    };

    if (currentChat > 180) {
      const chatShrink = Math.min(overflow, currentChat - 180);
      root.style.setProperty("--btfw-vertical-chat-row-h", `${Math.floor(currentChat - chatShrink)}px`);
      const remaining = overflow - chatShrink;
      if (remaining > 0 && currentVideowrap > VIDEO_MIN_HEIGHT_PX) {
        setVideoRow(currentVideowrap - remaining);
      }
      refreshVideoSizing();
      return;
    }

    if (currentVideowrap > VIDEO_MIN_HEIGHT_PX) {
      setVideoRow(currentVideowrap - overflow);
      refreshVideoSizing();
    }
  }

  function syncStackLayoutClasses(detail = {}){
    const grid = document.getElementById("btfw-grid");
    const leftpad = document.getElementById("btfw-leftpad");
    const stack = document.getElementById("btfw-stack");
    const allHidden = detail.allHidden ?? isStackFullyHidden();
    if (grid) grid.classList.toggle("btfw-grid--stack-hidden", allHidden);
    if (leftpad) leftpad.classList.toggle("btfw-leftpad--stack-hidden", allHidden);
    if (stack) stack.classList.toggle("btfw-stack--all-hidden", allHidden);
  }

  function refreshVideoSizing(){
    const wrap = document.getElementById("videowrap");
    if (!wrap) return;

    wrap.querySelectorAll("iframe, video, .vjs-tech").forEach((el) => {
      el.style.removeProperty("height");
      el.style.removeProperty("width");
      el.style.removeProperty("maxHeight");
      el.style.removeProperty("maxWidth");
      el.style.removeProperty("top");
      el.style.removeProperty("left");
      el.style.removeProperty("right");
      el.style.removeProperty("bottom");
      el.style.removeProperty("transform");
    });

    const vjs = wrap.querySelector(".video-js");
    if (vjs) {
      vjs.style.removeProperty("padding-top");
      vjs.style.removeProperty("height");
      vjs.style.removeProperty("width");
      const player = vjs.player || vjs.player_ || (window.videojs && (window.videojs.players?.[vjs.id] || window.videojs(vjs.id)));
      if (player) {
        try {
          if (typeof player.trigger === "function") player.trigger("componentresize");
          if (player.tech_ && typeof player.tech_.trigger === "function") player.tech_.trigger("resize");
          if (typeof player.resize === "function") player.resize();
        } catch (_) {}
      }
    }
  }

  function getStoredChatSide(){
    try {
      const stored = localStorage.getItem(CHAT_SIDE_KEY);
      return stored === "left" ? "left" : "right";
    } catch (_) {
      return "right";
    }
  }

  function loadVideoColumnWidth(){
    try {
      const storedRatio = parseFloat(localStorage.getItem(RATIO_KEY) || "", 10);
      if (!isNaN(storedRatio) && storedRatio >= MIN_VIDEO_RATIO && storedRatio <= MAX_VIDEO_RATIO) {
        videoColumnRatio = storedRatio;
        return;
      }

      const saved = parseInt(localStorage.getItem(SPLIT_KEY) || "", 10);
      if (!isNaN(saved) && saved >= VIDEO_MIN_PX) {
        videoColumnPx = saved;
        const available = Math.max(window.innerWidth - WIDTH_BUFFER, VIDEO_MIN_PX + CHAT_MIN_PX);
        persistVideoRatio(saved / available);
      }
    } catch (_) {
      videoColumnPx = null;
      videoColumnRatio = null;
    }
  }

  function clampRatio(ratio){
    return Math.min(MAX_VIDEO_RATIO, Math.max(MIN_VIDEO_RATIO, ratio));
  }

  function getGridAvailableWidth(grid){
    const rect = grid?.getBoundingClientRect?.();
    const width = rect?.width || window.innerWidth || 0;
    const splitWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width")) || 8;
    return Math.max(width - splitWidth, VIDEO_MIN_PX + CHAT_MIN_PX);
  }

  function resolveVideoRatio(grid){
    const available = getGridAvailableWidth(grid);
    let ratio = videoColumnRatio !== null ? videoColumnRatio : DEFAULT_VIDEO_RATIO;

    if (available > 0) {
      const minRatio = VIDEO_MIN_PX / available;
      const maxRatio = (available - CHAT_MIN_PX) / available;
      ratio = Math.min(Math.max(ratio, minRatio), maxRatio);
    }

    return clampRatio(ratio);
  }

  function persistVideoRatio(ratio){
    videoColumnRatio = clampRatio(ratio);
    try { localStorage.setItem(RATIO_KEY, String(videoColumnRatio)); } catch (_) {}
  }

  function ratioToFrSegments(ratio){
    const videoShare = clampRatio(ratio);
    const chatShare = 1 - videoShare;
    const scale = 100;
    return {
      video: `minmax(0, ${Math.max(1, Math.round(videoShare * scale))}fr)`,
      chat: `minmax(var(--btfw-chat-min, 280px), ${Math.max(1, Math.round(chatShare * scale))}fr)`
    };
  }

  function applyColumnTemplate(){
    const grid = document.getElementById("btfw-grid");
    if (!grid) return;

    if (isVertical) {
      grid.style.gridTemplateColumns = "";
      grid.classList.remove("btfw-grid--chat-left", "btfw-grid--chat-right");
      return;
    }

    const { video, chat } = ratioToFrSegments(resolveVideoRatio(grid));
    const template = chatSidePref === "left"
      ? `${chat} var(--btfw-split-width, 8px) ${video}`
      : `${video} var(--btfw-split-width, 8px) ${chat}`;

    grid.style.gridTemplateColumns = template;
    grid.classList.toggle("btfw-grid--chat-left", chatSidePref === "left");
    grid.classList.toggle("btfw-grid--chat-right", chatSidePref !== "left");
  }

  function setVideoColumnWidth(px){
    if (!Number.isFinite(px)) return;
    const grid = document.getElementById("btfw-grid");
    const available = getGridAvailableWidth(grid);
    const width = Math.min(Math.max(px, VIDEO_MIN_PX), available - CHAT_MIN_PX);
    videoColumnPx = width;
    persistVideoRatio(width / available);
    try { localStorage.setItem(SPLIT_KEY, String(width)); } catch (_) {}
    applyColumnTemplate();
  }

  function computeStackEnterThreshold(){
    const available = window.innerWidth;
    const ratio = videoColumnRatio !== null ? videoColumnRatio : DEFAULT_VIDEO_RATIO;
    const videoNeed = Math.max(VIDEO_MIN_PX, available * clampRatio(ratio));
    const comfortable = videoNeed + CHAT_MIN_PX + WIDTH_BUFFER;
    return Math.min(
      Math.max(comfortable, MOBILE_THRESHOLD_MIN),
      MOBILE_THRESHOLD_MAX
    );
  }

  function shouldUseVerticalLayout(){
    const width = window.innerWidth;
    const enter = computeStackEnterThreshold();
    if (isVertical) return width < enter + STACK_HYSTERESIS_PX;
    return width < enter;
  }

  function placeStackInLayout(){
    const stack = document.getElementById("btfw-stack");
    if (!stack) return;

    if (isVertical) {
      stack.classList.add("btfw-stack--below-chat");
      stack.classList.remove("btfw-stack--in-chat");
      const grid = document.getElementById("btfw-grid");
      const chatcol = document.getElementById("btfw-chatcol");
      if (!grid || !chatcol) return;
      if (stack.parentElement !== grid) {
        if (chatcol.nextSibling) grid.insertBefore(stack, chatcol.nextSibling);
        else grid.appendChild(stack);
      } else if (stack.previousElementSibling !== chatcol) {
        if (chatcol.nextSibling) grid.insertBefore(stack, chatcol.nextSibling);
        else grid.appendChild(stack);
      }
      return;
    }

    stack.classList.remove("btfw-stack--below-chat");
    stack.classList.remove("btfw-stack--in-chat");
    const left = document.getElementById("btfw-leftpad");
    if (!left) return;
    const stage = document.getElementById("btfw-video-stage");
    const video = document.getElementById("videowrap");
    const overlay = document.getElementById("btfw-video-overlay");
    const anchor = stage || ((overlay && overlay.parentElement === left) ? overlay : video);
    if (anchor && anchor.parentElement === left) {
      if (anchor.nextSibling !== stack) {
        if (anchor.nextSibling) left.insertBefore(stack, anchor.nextSibling);
        else left.appendChild(stack);
      }
    } else if (stack.parentElement !== left) {
      left.appendChild(stack);
    }
  }

  function updateResponsiveLayout(){
    const grid = document.getElementById("btfw-grid");
    if (!grid) return;

    const shouldVertical = shouldUseVerticalLayout();
    if (shouldVertical !== isVertical) {
      isVertical = shouldVertical;
      grid.classList.toggle("btfw-grid--vertical", shouldVertical);
      grid.classList.toggle("btfw-grid--desktop-scroll", !shouldVertical);
      if (document.body) {
        document.body.classList.toggle("btfw-mobile-stack-enabled", shouldVertical);
        document.body.classList.toggle("btfw-desktop-scroll-enabled", !shouldVertical);
      }
      placeStackInLayout();
      refreshVideoSizing();
      setTimeout(() => {
        refreshVideoSizing();
        try {
          window.dispatchEvent(new Event("resize"));
        } catch (_) {}
      }, 60);
      document.dispatchEvent(new CustomEvent("btfw:layout:orientation", { detail: { vertical: shouldVertical } }));
    } else {
      placeStackInLayout();
    }

    grid.classList.toggle("btfw-grid--desktop-scroll", !shouldVertical);
    if (document.body) {
      document.body.classList.toggle("btfw-desktop-scroll-enabled", !shouldVertical);
    }

    applyColumnTemplate();
    setTop();
    applyViewportBudget();
    syncStackLayoutClasses();
    refreshVideoSizing();
    wireVideoChromeObserver();
    requestAnimationFrame(() => {
      applyViewportBudget();
      alignPrimaryRowBottoms();
      refreshVideoSizing();
    });
  }
  
  function setTop(){
    const header = document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");
    const h = header ? header.offsetHeight : 48;
    const newTop = h + "px";
    
    document.documentElement.style.setProperty("--btfw-nav-real-height", newTop);
    document.documentElement.style.setProperty("--btfw-top", newTop);

    const topEffective = navAutohideActive && navAutohideHidden ? "0px" : newTop;
    document.documentElement.style.setProperty("--btfw-top-effective", topEffective);

    const chatcol = document.getElementById("btfw-chatcol");
    if (chatcol) {
      chatcol.style.removeProperty("top");
      chatcol.style.removeProperty("height");
    }
  }

  function makeResizable() {
    const grid = document.getElementById("btfw-grid");
    const splitter = document.getElementById("btfw-vsplit");
    if (!grid || !splitter) {
      console.warn("[BTFW] Resizer elements not found.");
      return;
    }
    if (splitter.dataset.btfwResizeWired) return;
    splitter.dataset.btfwResizeWired = "true";

    let isResizing = false;
    let activePointerId = null;

    function handlePointerMove(e) {
      if (!isResizing) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      if (isVertical) {
        stopResize();
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const splitRect = splitter.getBoundingClientRect();
      const splitWidth = splitRect.width || parseFloat(getComputedStyle(splitter).width) || 6;

      let newVideoWidth;

      if (chatSidePref === "left") {
        const pointerX = e.clientX - gridRect.left;
        const chatWidth = Math.max(pointerX - splitWidth / 2, 0);
        const available = gridRect.width - chatWidth - splitWidth;
        if (available < VIDEO_MIN_PX || chatWidth < CHAT_MIN_PX) return;
        newVideoWidth = available;
      } else {
        newVideoWidth = e.clientX - gridRect.left;
        const chatWidthCandidate = gridRect.width - newVideoWidth - splitWidth;
        if (newVideoWidth < VIDEO_MIN_PX || chatWidthCandidate < CHAT_MIN_PX) return;
      }

      if (!Number.isFinite(newVideoWidth)) return;
      setVideoColumnWidth(newVideoWidth);
    }

    function stopResize() {
      if (!isResizing) return;
      const pointerId = activePointerId;
      isResizing = false;
      activePointerId = null;
      document.body.classList.remove("btfw-resizing");
      splitter.removeEventListener("pointermove", handlePointerMove);
      splitter.removeEventListener("pointerup", stopResize);
      splitter.removeEventListener("pointercancel", stopResize);
      window.removeEventListener("blur", stopResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      try {
        if (pointerId !== null && typeof splitter.releasePointerCapture === "function") {
          splitter.releasePointerCapture(pointerId);
        }
      } catch (_) {}
      updateResponsiveLayout();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") stopResize();
    }

    splitter.addEventListener("pointerdown", (e) => {
      if (isVertical || e.button !== 0) return;
      isResizing = true;
      activePointerId = e.pointerId;
      e.preventDefault();
      document.body.classList.add("btfw-resizing");
      try {
        splitter.setPointerCapture(e.pointerId);
      } catch (_) {}
      splitter.addEventListener("pointermove", handlePointerMove);
      splitter.addEventListener("pointerup", stopResize);
      splitter.addEventListener("pointercancel", stopResize);
      window.addEventListener("blur", stopResize);
      document.addEventListener("visibilitychange", onVisibilityChange);
    });
  }

  const BOOT=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;
  function stripDeep(root){ 
    if(!root) return; 
    (root.classList||[]).forEach(c=>{ if(BOOT.test(c)) root.classList.remove(c); }); 
    root.querySelectorAll("[class]").forEach(el=>{ 
      Array.from(el.classList).forEach(c=>{ if(BOOT.test(c)) el.classList.remove(c); }); 
    }); 
  }

  function moveCurrent(){ 
    const vh = document.getElementById("videowrap-header"); 
    
    if (!vh) {
      console.log('[layout] No videowrap-header found');
      return;
    }
    
    const ct = vh.querySelector("#currenttitle"); 
    const top = document.querySelector("#chatwrap .btfw-chat-topbar"); 
    
    if (top) { 
      let slot = top.querySelector("#btfw-nowplaying-slot"); 
      if (!slot) { 
        slot = document.createElement("div"); 
        slot.id = "btfw-nowplaying-slot"; 
        slot.className = "btfw-chat-title"; 
        top.innerHTML = ""; 
        top.appendChild(slot);
      }
      
      if (ct) {
        slot.appendChild(ct);
        console.log('[layout] Moved #currenttitle to slot');
      } else {
        console.log('[layout] No #currenttitle found in videowrap-header');
      }
    }
    
    vh.remove(); 
  }

  function ensureVideoStage(left){
    if (!left) return;
    let stage = document.getElementById("btfw-video-stage");
    if (!stage) {
      stage = document.createElement("div");
      stage.id = "btfw-video-stage";
      stage.className = "btfw-video-stage";
    }
    if (stage.parentElement !== left) {
      left.insertBefore(stage, left.firstChild);
    }
    const v = document.getElementById("videowrap");
    const overlay = document.getElementById("btfw-video-overlay");
    if (v && v.parentElement !== stage) stage.appendChild(v);
    if (overlay && overlay.parentElement !== stage) stage.appendChild(overlay);
  }

  function ensureShell(){
    const wrap=document.getElementById("wrap")||document.body; 
    const v=document.getElementById("videowrap"); 
    const c=document.getElementById("chatwrap"); 
    const q=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");
    
    if(!document.getElementById("btfw-grid")){
      const grid=document.createElement("div");
      grid.id="btfw-grid";

      const left=document.createElement("div");
      left.id="btfw-leftpad";

      const right=document.createElement("aside");
      right.id="btfw-chatcol";

      if(v) left.appendChild(v);
      if(q) left.appendChild(q);
      if(c) right.appendChild(c);

      const split=document.createElement("div");
      split.id="btfw-vsplit";

      ensureNavHost(grid);

      grid.appendChild(left);
      grid.appendChild(split);
      grid.appendChild(right);

      grid.style.opacity = '0';
      wrap.prepend(grid);

    } else {
      const left=document.getElementById("btfw-leftpad");
      const right=document.getElementById("btfw-chatcol");
      const v=document.getElementById("videowrap");
      const c=document.getElementById("chatwrap");
      const q=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");
      const grid=document.getElementById("btfw-grid");

      ensureNavHost(grid);

      if(v && !left.contains(v)) left.appendChild(v);
      if(q && !left.contains(q)) left.appendChild(q);
      if(c && !right.contains(c)) right.appendChild(c);
    }

    ["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(id=>stripDeep(document.getElementById(id)));
    moveCurrent();
    const left = document.getElementById("btfw-leftpad");
    ensureVideoStage(left);
    placeStackInLayout();
  }
  
  function finishLayout() {
    const grid = document.getElementById("btfw-grid");
    if (grid) {
      grid.classList.add("btfw-loaded");
      grid.style.opacity = '1';
    }
    updateResponsiveLayout();
    document.dispatchEvent(new CustomEvent("btfw:layoutReady"));
  }

  function commitLayout() {
    ensureShell();
    const finalize = () => {
      setTop();
      makeResizable();
      finishLayout();
    };
    finalize();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', finalize, { once: true });
    }
  }

  let layoutFrame = 0;
  let budgetFrame = 0;

  function scheduleViewportBudget(){
    if (budgetFrame) return;
    budgetFrame = requestAnimationFrame(() => {
      budgetFrame = 0;
      if (!isVertical) return;
      applyViewportBudget();
      alignPrimaryRowBottoms();
      refreshVideoSizing();
    });
  }

  function scheduleResponsiveLayout(){
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      updateResponsiveLayout();
    });
  }

  function wireVideoChromeObserver(){
    const overlay = document.getElementById("btfw-video-overlay");
    if (!overlay || overlay._btfwChromeObs) return;
    overlay._btfwChromeObs = true;
    const ro = new ResizeObserver(() => {
      if (!isVertical) return;
      scheduleViewportBudget();
    });
    ro.observe(overlay);
  }

  document.addEventListener("btfw:layoutReady", wireVideoChromeObserver);

  function init() {
    loadVideoColumnWidth();
    chatSidePref = getStoredChatSide();
    applyColumnTemplate();
    setTop();

    const navbar = document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");
    if (navbar) {
      const resizeObserver = new ResizeObserver(() => {
        setTimeout(setTop, 0);
        scheduleResponsiveLayout();
      });
      resizeObserver.observe(navbar);
    }

    window.addEventListener('resize', () => {
      setTimeout(setTop, 0);
      scheduleResponsiveLayout();
    });
  }

  document.addEventListener("btfw:layout:chatSideChanged", (ev) => {
    const side = ev && ev.detail && ev.detail.side === "left" ? "left" : "right";
    chatSidePref = side;
    applyColumnTemplate();
    updateResponsiveLayout();
  });

  document.addEventListener("btfw:chat:barsReady", () => {
    placeStackInLayout();
  });

  document.addEventListener("btfw:layout:stackVisibility", (ev) => {
    syncStackLayoutClasses(ev?.detail || {});
    applyViewportBudget();
    refreshVideoSizing();
    requestAnimationFrame(alignPrimaryRowBottoms);
  });

  document.addEventListener("btfw:navbar:autohide", (ev) => {
    const detail = ev?.detail || {};
    navAutohideActive = !!detail.active;
    navAutohideHidden = !!detail.hidden;
    setTop();
    applyViewportBudget();
    refreshVideoSizing();
    requestAnimationFrame(alignPrimaryRowBottoms);
  });

  function findNavbarElement(){
    const selectors = [
      "nav.navbar",
      ".navbar-fixed-top",
      "#navbar"
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function ensureNavHost(grid){
    if (!grid) return;
    const navEl = findNavbarElement();
    if (!navEl) return;

    let host = document.getElementById(NAV_HOST_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = NAV_HOST_ID;
      host.className = "btfw-navhost";
    }

    if (navEl.parentElement !== host) {
      host.appendChild(navEl);
    }

    if (host.parentElement !== grid) {
      grid.insertBefore(host, grid.firstChild);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {name:"feature:layout", commitLayout};
});
