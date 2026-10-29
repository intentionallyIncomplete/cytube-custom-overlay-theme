/**
 * Layout viewport/orientation domain (#203 split from feature-layout.js).
 *
 * Owns viewport budgeting, vertical/desktop orientation decisions, stack
 * placement, video sizing refresh, and the top-offset (navbar height) sync.
 * Logic moved verbatim from feature-layout.js.
 */
import {
  VIDEO_MIN_HEIGHT_PX,
  CHAT_MIN_PX,
  WIDTH_BUFFER,
  MOBILE_THRESHOLD_MIN,
  MOBILE_THRESHOLD_MAX,
  STACK_HYSTERESIS_PX,
  DEFAULT_VIDEO_RATIO,
  NAV_HOST_ID,
  VIDEO_MIN_PX,
  MIN_VIDEO_RATIO,
  MAX_VIDEO_RATIO
} from "./layout-state.js";

export interface LayoutViewportDomain {
  setTop(): void;
  updateResponsiveLayout(): void;
  applyViewportBudget(): void;
  alignPrimaryRowBottoms(): void;
  refreshVideoSizing(): void;
  placeStackInLayout(): void;
  syncStackLayoutClasses(detail?: { allHidden?: boolean }): void;
  shouldUseVerticalLayout(): boolean;
  computeStackEnterThreshold(): number;
  wireVideoChromeObserver(): void;
  ensureShell(): void;
  finishLayout(): void;
  commitLayout(): void;
  ensureNavHost(grid: HTMLElement | null): void;
  findNavbarElement(): HTMLElement | null;
  onNavbarAutohide(active: boolean, hidden: boolean): void;
}

export function createLayoutViewportDomain(ctx: {
  state: {
    isVertical: boolean;
    navAutohideActive: boolean;
    navAutohideHidden: boolean;
    videoColumnPx: number | null;
    videoColumnRatio: number | null;
    chatSidePref: "left" | "right";
  };
  columns: {
    applyColumnTemplate(): void;
  };
  /** Called by commitLayout's finalize step (columns.makeResizable, by the shell). */
  onCommitFinalize: () => void;
}): LayoutViewportDomain {
  function clampRatio(ratio: number): number {
    return Math.min(MAX_VIDEO_RATIO, Math.max(MIN_VIDEO_RATIO, ratio));
  }
  function getViewportHeight(): number {
    return window.visualViewport?.height || window.innerHeight || 1440;
  }

  function isStackFullyHidden(): boolean {
    const items = document.querySelectorAll<HTMLElement>("#btfw-stack .btfw-stack-item[data-group='true']");
    if (!items.length) return true;
    return Array.from(items).every((el) => el.dataset.docked === "true");
  }

  function measureOverlayHeight(): number {
    const overlay = document.getElementById("btfw-video-overlay");
    if (!overlay) return 0;
    const style = getComputedStyle(overlay);
    if (style.display === "none") return 0;
    return overlay.offsetHeight || 0;
  }

  function getTopEffectivePx(): number {
    const root = document.documentElement;
    const navReal = parseFloat(getComputedStyle(root).getPropertyValue("--btfw-nav-real-height")) || 48;
    return ctx.state.navAutohideActive && ctx.state.navAutohideHidden ? 0 : navReal;
  }

  function getPrimaryRowHeight(): number {
    const viewportH = getViewportHeight();
    const topEffective = getTopEffectivePx();
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap")) || 10;
    return Math.max(0, viewportH - topEffective - gap);
  }

  function roundLayoutPx(value: number): number {
    return Math.max(0, Math.round(value / 2) * 2);
  }

  function applyViewportBudget(): void {
    const root = document.documentElement;
    const topEffective = getTopEffectivePx();
    const primaryRowH = getPrimaryRowHeight();

    root.style.setProperty("--btfw-top-effective", `${topEffective}px`);
    root.style.setProperty("--btfw-primary-budget", `${Math.floor(primaryRowH)}px`);
    root.style.setProperty("--btfw-primary-row-h", `${Math.floor(primaryRowH)}px`);

    const leftpad = document.getElementById("btfw-leftpad");
    const colW = ctx.state.isVertical
      ? window.innerWidth
      : (leftpad?.getBoundingClientRect().width || window.innerWidth * DEFAULT_VIDEO_RATIO);
    const aspectCap = colW * (9 / 16);

    if (!ctx.state.isVertical) {
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

  function alignPrimaryRowBottoms(): void {
    if (!ctx.state.isVertical) return;
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

    const setVideoRow = (videowrapPx: number) => {
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

  function syncStackLayoutClasses(detail: { allHidden?: boolean } = {}): void {
    const grid = document.getElementById("btfw-grid");
    const leftpad = document.getElementById("btfw-leftpad");
    const stack = document.getElementById("btfw-stack");
    const allHidden = detail.allHidden ?? isStackFullyHidden();
    if (grid) grid.classList.toggle("btfw-grid--stack-hidden", allHidden);
    if (leftpad) leftpad.classList.toggle("btfw-leftpad--stack-hidden", allHidden);
    if (stack) stack.classList.toggle("btfw-stack--all-hidden", allHidden);
  }

  function refreshVideoSizing(): void {
    const wrap = document.getElementById("videowrap");
    if (!wrap) return;

    wrap.querySelectorAll<HTMLElement>("iframe, video, .vjs-tech").forEach((el) => {
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

    const vjs = wrap.querySelector<HTMLElement>(".video-js");
    if (vjs) {
      vjs.style.removeProperty("padding-top");
      vjs.style.removeProperty("height");
      vjs.style.removeProperty("width");
      const player = (vjs as HTMLElement & { player?: unknown; player_?: unknown }).player
        || (vjs as HTMLElement & { player_?: unknown }).player_
        || ((window as unknown as { videojs?: { players?: Record<string, unknown>; (id: string): unknown } }).videojs
          ? ((window as unknown as { videojs: { players?: Record<string, unknown>; (id: string): unknown } }).videojs)(vjs.id)
          : null);
      if (player) {
        try {
          const p = player as { trigger?: (n: string) => void; tech_?: { trigger?: (n: string) => void }; resize?: () => void };
          if (typeof p.trigger === "function") p.trigger("componentresize");
          if (p.tech_ && typeof p.tech_.trigger === "function") p.tech_.trigger("resize");
          if (typeof p.resize === "function") p.resize();
        } catch (_) {}
      }
    }
  }

  function computeStackEnterThreshold(): number {
    const available = window.innerWidth;
    const ratio = ctx.state.videoColumnRatio !== null ? ctx.state.videoColumnRatio : DEFAULT_VIDEO_RATIO;
    const videoNeed = Math.max(VIDEO_MIN_PX, available * clampRatio(ratio));
    const comfortable = videoNeed + CHAT_MIN_PX + WIDTH_BUFFER;
    return Math.min(
      Math.max(comfortable, MOBILE_THRESHOLD_MIN),
      MOBILE_THRESHOLD_MAX
    );
  }

  function shouldUseVerticalLayout(): boolean {
    const width = window.innerWidth;
    const enter = computeStackEnterThreshold();
    if (ctx.state.isVertical) return width < enter + STACK_HYSTERESIS_PX;
    return width < enter;
  }

  function placeStackInLayout(): void {
    const stack = document.getElementById("btfw-stack");
    if (!stack) return;

    if (ctx.state.isVertical) {
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

  function updateResponsiveLayout(): void {
    const grid = document.getElementById("btfw-grid");
    if (!grid) return;

    const shouldVertical = shouldUseVerticalLayout();
    if (shouldVertical !== ctx.state.isVertical) {
      ctx.state.isVertical = shouldVertical;
      grid.classList.toggle("btfw-grid--vertical", shouldVertical);
      grid.classList.toggle("btfw-grid--desktop-scroll", !shouldVertical);
      if (document.body) {
        document.body.classList.toggle("btfw-mobile-stack-enabled", shouldVertical);
        document.body.classList.toggle("btfw-desktop-scroll-enabled", !shouldVertical);
      }
      placeStackInLayout();
      scheduleRefreshVideoSizing();
      setTimeout(() => {
        scheduleRefreshVideoSizing();
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

    ctx.columns.applyColumnTemplate();
    setTop();
    applyViewportBudget();
    syncStackLayoutClasses();
    scheduleRefreshVideoSizing();
    wireVideoChromeObserver();
    requestAnimationFrame(() => {
      applyViewportBudget();
      alignPrimaryRowBottoms();
      scheduleRefreshVideoSizing();
    });
  }

  function setTop(): void {
    const header = document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");
    const h = header ? (header as HTMLElement).offsetHeight : 48;
    const newTop = h + "px";

    document.documentElement.style.setProperty("--btfw-nav-real-height", newTop);
    document.documentElement.style.setProperty("--btfw-top", newTop);

    const topEffective = ctx.state.navAutohideActive && ctx.state.navAutohideHidden ? "0px" : newTop;
    document.documentElement.style.setProperty("--btfw-top-effective", topEffective);

    const chatcol = document.getElementById("btfw-chatcol");
    if (chatcol) {
      chatcol.style.removeProperty("top");
      chatcol.style.removeProperty("height");
    }
  }

  // ---- rAF schedulers (moved verbatim) ----
  let budgetFrame = 0;
  let videoSizingFrame = 0;
  let layoutFrame = 0;

  function scheduleRefreshVideoSizing(): void {
    if (videoSizingFrame) return;
    videoSizingFrame = requestAnimationFrame(() => {
      videoSizingFrame = 0;
      refreshVideoSizing();
    });
  }

  function scheduleViewportBudget(): void {
    if (budgetFrame) return;
    budgetFrame = requestAnimationFrame(() => {
      budgetFrame = 0;
      if (!ctx.state.isVertical) return;
      applyViewportBudget();
      alignPrimaryRowBottoms();
      scheduleRefreshVideoSizing();
    });
  }

  function scheduleResponsiveLayout(): void {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      updateResponsiveLayout();
    });
  }

  function wireVideoChromeObserver(): void {
    const overlay = document.getElementById("btfw-video-overlay");
    if (!overlay || (overlay as HTMLElement & { _btfwChromeObs?: boolean })._btfwChromeObs) return;
    (overlay as HTMLElement & { _btfwChromeObs?: boolean })._btfwChromeObs = true;
    const ro = new ResizeObserver(() => {
      if (!ctx.state.isVertical) return;
      scheduleViewportBudget();
    });
    ro.observe(overlay);
  }

  // ---- shell ----
  const BOOT = /^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;
  function stripDeep(root: Element | null): void {
    if (!root) return;
    Array.from(root.classList || []).forEach((c) => { if (BOOT.test(c)) root.classList.remove(c); });
    root.querySelectorAll("[class]").forEach((el) => {
      Array.from(el.classList).forEach((c) => { if (BOOT.test(c)) el.classList.remove(c); });
    });
  }

  function moveCurrent(): void {
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
        (slot as HTMLElement).id = "btfw-nowplaying-slot";
        (slot as HTMLElement).className = "btfw-chat-title";
        (top as HTMLElement).innerHTML = "";
        (top as HTMLElement).appendChild(slot);
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

  function ensureVideoStage(left: HTMLElement | null): void {
    if (!left) return;
    let stage = document.getElementById("btfw-video-stage");
    if (!stage) {
      stage = document.createElement("div");
      stage.id = "btfw-video-stage";
      stage.className = "btfw-video-stage";
      stage.setAttribute("data-testid", "btfw-video-stage");
    } else if (!stage.getAttribute("data-testid")) {
      stage.setAttribute("data-testid", "btfw-video-stage");
    }
    if (stage.parentElement !== left) {
      left.insertBefore(stage, left.firstChild);
    }
    const v = document.getElementById("videowrap");
    const overlay = document.getElementById("btfw-video-overlay");
    if (v && v.parentElement !== stage) stage.appendChild(v);
    if (overlay && overlay.parentElement !== stage) stage.appendChild(overlay);
  }

  function ensureShell(): void {
    const wrap = document.getElementById("wrap") || document.body;
    const v = document.getElementById("videowrap");
    const c = document.getElementById("chatwrap");
    const q = document.getElementById("playlistrow") || document.getElementById("playlistwrap") || document.getElementById("queuecontainer");

    if (!document.getElementById("btfw-grid")) {
      const grid = document.createElement("div");
      grid.id = "btfw-grid";
      grid.setAttribute("data-testid", "btfw-grid");

      const left = document.createElement("div");
      left.id = "btfw-leftpad";

      const right = document.createElement("aside");
      right.id = "btfw-chatcol";
      right.setAttribute("data-testid", "btfw-chatcol");

      if (v) left.appendChild(v);
      if (q) left.appendChild(q);
      if (c) right.appendChild(c);

      const split = document.createElement("div");
      split.id = "btfw-vsplit";

      // Vertical resize handle (for vertical/mobile layout)
      const verticalSplit = document.createElement("div");
      verticalSplit.id = "btfw-vsplit-vertical";

      ensureNavHost(grid);

      grid.appendChild(left);
      grid.appendChild(split);
      grid.appendChild(right);
      grid.appendChild(verticalSplit);

      grid.style.opacity = '0';
      wrap.prepend(grid);
    } else {
      const left = document.getElementById("btfw-leftpad");
      const right = document.getElementById("btfw-chatcol");
      if (right && !right.getAttribute("data-testid")) {
        right.setAttribute("data-testid", "btfw-chatcol");
      }
      const v2 = document.getElementById("videowrap");
      const c2 = document.getElementById("chatwrap");
      const q2 = document.getElementById("playlistrow") || document.getElementById("playlistwrap") || document.getElementById("queuecontainer");
      const grid = document.getElementById("btfw-grid");
      if (grid && !grid.getAttribute("data-testid")) {
        grid.setAttribute("data-testid", "btfw-grid");
      }

      ensureNavHost(grid);

      if (v2 && !left!.contains(v2)) left!.appendChild(v2);
      if (q2 && !left!.contains(q2)) left!.appendChild(q2);
      if (c2 && !right!.contains(c2)) right!.appendChild(c2);
    }

    ["videowrap", "playlistrow", "playlistwrap", "queuecontainer", "queue", "plmeta", "chatwrap", "controlsrow", "rightcontrols"].forEach((id) => stripDeep(document.getElementById(id)));
    moveCurrent();
    const left = document.getElementById("btfw-leftpad");
    ensureVideoStage(left);
    placeStackInLayout();
  }

  function finishLayout(): void {
    const grid = document.getElementById("btfw-grid");
    if (grid) {
      grid.classList.add("btfw-loaded");
      grid.style.opacity = '1';
    }
    updateResponsiveLayout();
    document.dispatchEvent(new CustomEvent("btfw:layoutReady"));
  }

  function commitLayout(): void {
    ensureShell();
    const finalize = () => {
      setTop();
      // resizable wiring lives in the columns domain; invoked by the shell
      ctx.onCommitFinalize();
      finishLayout();
    };
    finalize();
    if (document.readyState !== 'complete') {
      window.addEventListener('load', finalize, { once: true });
    }
  }

  function findNavbarElement(): HTMLElement | null {
    const selectors = [
      "nav.navbar",
      ".navbar-fixed-top",
      "#navbar"
    ];
    for (const sel of selectors) {
      const el = document.querySelector<HTMLElement>(sel);
      if (el) return el;
    }
    return null;
  }

  function ensureNavHost(grid: HTMLElement | null): void {
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

  function onNavbarAutohide(active: boolean, hidden: boolean): void {
    ctx.state.navAutohideActive = !!active;
    ctx.state.navAutohideHidden = !!hidden;
    setTop();
    applyViewportBudget();
    refreshVideoSizing();
    requestAnimationFrame(alignPrimaryRowBottoms);
  }

  return {
    setTop,
    updateResponsiveLayout,
    applyViewportBudget,
    alignPrimaryRowBottoms,
    refreshVideoSizing,
    placeStackInLayout,
    syncStackLayoutClasses,
    shouldUseVerticalLayout,
    computeStackEnterThreshold,
    wireVideoChromeObserver,
    ensureShell,
    finishLayout,
    commitLayout,
    ensureNavHost,
    findNavbarElement,
    onNavbarAutohide
  };
}
