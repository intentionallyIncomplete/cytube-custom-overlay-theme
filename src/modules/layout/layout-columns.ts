/**
 * Layout columns domain (#203 split from feature-layout.js).
 *
 * Owns the desktop grid column template: video/chat ratio persistence,
 * min/max clamping, chat-side preference, and the split-handle drag wiring.
 * Logic moved verbatim from feature-layout.js; state comes from the shared
 * layout state object.
 */
import {
  CHAT_MIN_PX,
  VIDEO_MIN_PX,
  WIDTH_BUFFER,
  MIN_VIDEO_RATIO,
  MAX_VIDEO_RATIO,
  DEFAULT_VIDEO_RATIO,
  SPLIT_KEY,
  CHAT_SIDE_KEY,
  RATIO_KEY,
  VERTICAL_VIDEO_MIN_PX,
  VERTICAL_CHAT_MIN_PX,
  VERTICAL_RATIO_KEY
} from "./layout-state.js";

export interface LayoutColumnsDomain {
  getStoredChatSide(): "left" | "right";
  loadVideoColumnWidth(): void;
  applyColumnTemplate(): void;
  setVideoColumnWidth(px: number): void;
  makeResizable(): void;
  makeVerticalResizable(): void;
  setVerticalVideoHeight(px: number): void;
  loadVerticalVideoHeight(): void;
}

export function createLayoutColumnsDomain(ctx: {
  state: {
    videoColumnPx: number | null;
    videoColumnRatio: number | null;
    chatSidePref: "left" | "right";
    isVertical: boolean;
  };
  onColumnTemplateApplied: () => void;
}): LayoutColumnsDomain {
  function clampRatio(ratio: number): number {
    return Math.min(MAX_VIDEO_RATIO, Math.max(MIN_VIDEO_RATIO, ratio));
  }

  function getGridAvailableWidth(grid: HTMLElement | null): number {
    const rect = grid?.getBoundingClientRect?.();
    const width = rect?.width || window.innerWidth || 0;
    const splitWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width")) || 8;
    return Math.max(width - splitWidth, VIDEO_MIN_PX + CHAT_MIN_PX);
  }

  function resolveVideoRatio(grid: HTMLElement | null): number {
    const available = getGridAvailableWidth(grid);
    let ratio = ctx.state.videoColumnRatio !== null ? ctx.state.videoColumnRatio : DEFAULT_VIDEO_RATIO;

    if (available > 0) {
      const minRatio = VIDEO_MIN_PX / available;
      const maxRatio = (available - CHAT_MIN_PX) / available;
      ratio = Math.min(Math.max(ratio, minRatio), maxRatio);
    }

    return clampRatio(ratio);
  }

  function persistVideoRatio(ratio: number): void {
    ctx.state.videoColumnRatio = clampRatio(ratio);
    localStorage.setItem(RATIO_KEY, String(ctx.state.videoColumnRatio));
  }

  function ratioToFrSegments(ratio: number): { video: string; chat: string } {
    const videoShare = clampRatio(ratio);
    const chatShare = 1 - videoShare;
    const scale = 100;
    return {
      video: `minmax(0, ${Math.max(1, Math.round(videoShare * scale))}fr)`,
      chat: `minmax(var(--btfw-chat-min, 280px), ${Math.max(1, Math.round(chatShare * scale))}fr)`
    };
  }

  function getStoredChatSide(): "left" | "right" {
    const stored = localStorage.getItem(CHAT_SIDE_KEY);
    return stored === "left" ? "left" : "right";
  }

  function loadVideoColumnWidth(): void {
    const storedRatio = parseFloat(localStorage.getItem(RATIO_KEY) || "");
    if (!isNaN(storedRatio) && storedRatio >= MIN_VIDEO_RATIO && storedRatio <= MAX_VIDEO_RATIO) {
      ctx.state.videoColumnRatio = storedRatio;
      return;
    }

    const saved = parseInt(localStorage.getItem(SPLIT_KEY) || "", 10);
    if (!isNaN(saved) && saved >= VIDEO_MIN_PX) {
      ctx.state.videoColumnPx = saved;
      const available = Math.max(window.innerWidth - WIDTH_BUFFER, VIDEO_MIN_PX + CHAT_MIN_PX);
      persistVideoRatio(saved / available);
    }
  }

  function applyColumnTemplate(): void {
    const grid = document.getElementById("btfw-grid");
    if (!grid) return;

    if (ctx.state.isVertical) {
      grid.style.gridTemplateColumns = "";
      grid.classList.remove("btfw-grid--chat-left", "btfw-grid--chat-right");
      return;
    }

    const { video, chat } = ratioToFrSegments(resolveVideoRatio(grid));
    const template = ctx.state.chatSidePref === "left"
      ? `${chat} var(--btfw-split-width, 8px) ${video}`
      : `${video} var(--btfw-split-width, 8px) ${chat}`;

    grid.style.gridTemplateColumns = template;
    grid.classList.toggle("btfw-grid--chat-left", ctx.state.chatSidePref === "left");
    grid.classList.toggle("btfw-grid--chat-right", ctx.state.chatSidePref !== "left");
    ctx.onColumnTemplateApplied();
  }

  function setVideoColumnWidth(px: number): void {
    if (!Number.isFinite(px)) return;
    const grid = document.getElementById("btfw-grid");
    const available = getGridAvailableWidth(grid);
    const width = Math.min(Math.max(px, VIDEO_MIN_PX), available - CHAT_MIN_PX);
    ctx.state.videoColumnPx = width;
    persistVideoRatio(width / available);
    localStorage.setItem(SPLIT_KEY, String(width));
    applyColumnTemplate();
  }

  function makeResizable(): void {
    const grid = document.getElementById("btfw-grid");
    const splitter = document.getElementById("btfw-vsplit");
    if (!grid || !splitter) {
      console.warn("[BTFW] Resizer elements not found.");
      return;
    }
    if (splitter.dataset.btfwResizeWired) return;
    splitter.dataset.btfwResizeWired = "true";

    let isResizing = false;
    let activePointerId: number | null = null;

    function handlePointerMove(e: PointerEvent) {
      if (!isResizing) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      if (ctx.state.isVertical) {
        stopResize();
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const splitRect = splitter.getBoundingClientRect();
      const splitWidth = splitRect.width || parseFloat(getComputedStyle(splitter).width) || 6;

      let newVideoWidth: number;

      if (ctx.state.chatSidePref === "left") {
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
      ctx.onColumnTemplateApplied();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") stopResize();
    }

    splitter.addEventListener("pointerdown", (e) => {
      if (ctx.state.isVertical || e.button !== 0) return;
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

  function makeVerticalResizable(): void {
    const grid = document.getElementById("btfw-grid");
    const verticalSplitter = document.getElementById("btfw-vsplit-vertical");
    if (!grid || !verticalSplitter) {
      console.warn("[BTFW] Vertical resizer elements not found.");
      return;
    }
    if (verticalSplitter.dataset.btfwResizeWired) return;
    verticalSplitter.dataset.btfwResizeWired = "true";

    let isResizing = false;
    let activePointerId: number | null = null;

    function handleVerticalPointerMove(e: PointerEvent) {
      if (!isResizing) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;

      if (!ctx.state.isVertical) {
        stopVerticalResize();
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const splitRect = verticalSplitter.getBoundingClientRect();
      const splitHeight = splitRect.height || 8;

      const pointerY = e.clientY - gridRect.top;
      const videoRowH = pointerY - splitHeight / 2;
      const chatRowH = gridRect.height - pointerY - splitHeight / 2;

      if (videoRowH < VERTICAL_VIDEO_MIN_PX || chatRowH < VERTICAL_CHAT_MIN_PX) return;

      const totalH = videoRowH + chatRowH + splitHeight;
      const ratio = videoRowH / totalH;

      if (!Number.isFinite(ratio)) return;
      setVerticalVideoHeight(ratio);
    }

    function stopVerticalResize() {
      if (!isResizing) return;
      const pointerId = activePointerId;
      isResizing = false;
      activePointerId = null;
      document.body.classList.remove("btfw-resizing");
      verticalSplitter.removeEventListener("pointermove", handleVerticalPointerMove);
      verticalSplitter.removeEventListener("pointerup", stopVerticalResize);
      verticalSplitter.removeEventListener("pointercancel", stopVerticalResize);
      window.removeEventListener("blur", stopVerticalResize);
      document.removeEventListener("visibilitychange", onVerticalVisibilityChange);
      try {
        if (pointerId !== null && typeof verticalSplitter.releasePointerCapture === "function") {
          verticalSplitter.releasePointerCapture(pointerId);
        }
      } catch (_) {}
      ctx.onColumnTemplateApplied();
    }

    function onVerticalVisibilityChange() {
      if (document.visibilityState === "hidden") stopVerticalResize();
    }

    verticalSplitter.addEventListener("pointerdown", (e) => {
      if (!ctx.state.isVertical || e.button !== 0) return;
      isResizing = true;
      activePointerId = e.pointerId;
      e.preventDefault();
      document.body.classList.add("btfw-resizing");
      try {
        verticalSplitter.setPointerCapture(e.pointerId);
      } catch (_) {}
      verticalSplitter.addEventListener("pointermove", handleVerticalPointerMove);
      verticalSplitter.addEventListener("pointerup", stopVerticalResize);
      verticalSplitter.addEventListener("pointercancel", stopVerticalResize);
      window.addEventListener("blur", stopVerticalResize);
      document.addEventListener("visibilitychange", onVerticalVisibilityChange);
    });
  }

  function loadVerticalVideoHeight(): void {
    const stored = parseFloat(localStorage.getItem(VERTICAL_RATIO_KEY) || "");
    if (!isNaN(stored) && stored > 0 && stored < 1) {
      const root = document.documentElement;
      const primaryRowH = parseFloat(root.style.getPropertyValue("--btfw-primary-row-h")) || 720;
      const videoRowH = Math.round(primaryRowH * stored);
      root.style.setProperty("--btfw-vertical-video-row-h", `${videoRowH}px`);
      root.style.setProperty("--btfw-vertical-chat-row-h", `${primaryRowH - videoRowH}px`);
    }
  }

  function setVerticalVideoHeight(ratio: number): void {
    if (!Number.isFinite(ratio) || ratio <= 0 || ratio >= 1) return;
    const root = document.documentElement;
    const primaryRowH = parseFloat(root.style.getPropertyValue("--btfw-primary-row-h")) || 720;
    const videoRowH = Math.round(primaryRowH * Math.max(0.15, Math.min(0.85, ratio)));
    const chatRowH = primaryRowH - videoRowH;

    if (videoRowH < VERTICAL_VIDEO_MIN_PX || chatRowH < VERTICAL_CHAT_MIN_PX) return;

    root.style.setProperty("--btfw-vertical-video-row-h", `${videoRowH}px`);
    root.style.setProperty("--btfw-vertical-chat-row-h", `${chatRowH}px`);
    localStorage.setItem(VERTICAL_RATIO_KEY, String(ratio));
  }

  return {
    getStoredChatSide,
    loadVideoColumnWidth,
    applyColumnTemplate,
    setVideoColumnWidth,
    makeResizable,
    makeVerticalResizable,
    setVerticalVideoHeight,
    loadVerticalVideoHeight
  };
}
