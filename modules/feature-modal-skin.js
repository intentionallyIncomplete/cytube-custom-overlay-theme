/* BTFW — feature:modal-skin
   Make CyTube Bootstrap modals look like Bulma modal-card, without changing behavior.
   - Skins any `.modal` that is NOT our own `.btfw-modal` (keeps our Bulma modals intact)
   - Normalizes header/footer and re-styles .btn -> .button variants
   - Adds a Bulma-like close "delete" button that hides via Bootstrap
*/
BTFW.define("feature:modal-skin", [], async () => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  const CHANNEL_MODAL_SIZE_KEY = "btfw:channeloptions:size";
  const CHANNEL_MODAL_DEFAULT_WIDTH = 736;
  const CHANNEL_MODAL_MIN_WIDTH = 520;
  const CHANNEL_MODAL_MIN_HEIGHT = 360;
  const CHANNEL_MODAL_DEFAULT_HEIGHT_VH = 0.6;

  function channelModalDefaultHeight(){
    return Math.max(
      CHANNEL_MODAL_MIN_HEIGHT,
      Math.floor(window.innerHeight * CHANNEL_MODAL_DEFAULT_HEIGHT_VH)
    );
  }

  function readChannelModalSize(){
    try {
      const raw = localStorage.getItem(CHANNEL_MODAL_SIZE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const width = Number(parsed?.width);
      const height = Number(parsed?.height);
      const left = Number(parsed?.left);
      const top = Number(parsed?.top);
      if (!Number.isFinite(width) || width < CHANNEL_MODAL_MIN_WIDTH) return null;
      const maxW = Math.floor(window.innerWidth * 0.96);
      const size = { width: Math.min(Math.round(width), maxW) };
      if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
        const maxH = Math.floor(window.innerHeight * 0.9);
        size.height = Math.min(Math.round(height), maxH);
      }
      if (Number.isFinite(left)) size.left = Math.round(left);
      if (Number.isFinite(top)) size.top = Math.round(top);
      return size;
    } catch (_) {
      return null;
    }
  }

  function writeChannelModalSize(width, height, left, top){
    try {
      const payload = { width: Math.round(width) };
      if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
        payload.height = Math.round(height);
      }
      if (Number.isFinite(left)) payload.left = Math.round(left);
      if (Number.isFinite(top)) payload.top = Math.round(top);
      localStorage.setItem(CHANNEL_MODAL_SIZE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function getDialogRect(dialog){
    const rect = dialog.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: dialog.offsetWidth,
      height: dialog.offsetHeight,
    };
  }

  function clampDialogRect(left, top, width, height){
    const maxW = Math.floor(window.innerWidth * 0.96);
    const maxH = Math.floor(window.innerHeight * 0.9);
    const w = Math.max(
      CHANNEL_MODAL_MIN_WIDTH,
      Math.min(maxW, Math.round(width))
    );
    const h = Math.max(
      CHANNEL_MODAL_MIN_HEIGHT,
      Math.min(maxH, Math.round(height))
    );
    const maxLeft = Math.max(0, window.innerWidth - w);
    const maxTop = Math.max(0, window.innerHeight - h);
    const l = Math.max(0, Math.min(maxLeft, Math.round(left)));
    const t = Math.max(0, Math.min(maxTop, Math.round(top)));
    return { left: l, top: t, width: w, height: h };
  }

  function setChannelDialogRect(dialog, left, top, width, height){
    const box = clampDialogRect(left, top, width, height);
    dialog.style.setProperty("position", "fixed", "important");
    dialog.style.setProperty("margin", "0", "important");
    dialog.style.setProperty("left", `${box.left}px`, "important");
    dialog.style.setProperty("top", `${box.top}px`, "important");
    dialog.style.setProperty("width", `${box.width}px`, "important");
    dialog.style.setProperty("max-width", `${box.width}px`, "important");
    dialog.style.setProperty("min-width", `${CHANNEL_MODAL_MIN_WIDTH}px`, "important");
    dialog.style.setProperty("height", `${box.height}px`, "important");
    dialog.style.setProperty("max-height", `${Math.floor(window.innerHeight * 0.9)}px`, "important");
    dialog.style.setProperty("pointer-events", "auto", "important");

    const content = dialog.querySelector(".modal-content");
    if (content) {
      content.style.setProperty("width", "100%", "important");
      content.style.setProperty("max-width", "none", "important");
      content.style.setProperty("height", "100%", "important");
      content.style.setProperty("max-height", "100%", "important");
      content.style.setProperty("box-sizing", "border-box", "important");
    }
    return box;
  }

  function centerChannelDialog(dialog, width, height){
    const w = width || CHANNEL_MODAL_DEFAULT_WIDTH;
    const h = height || channelModalDefaultHeight();
    const left = Math.max(0, (window.innerWidth - w) / 2);
    const top = Math.max(0, (window.innerHeight - h) / 2);
    return setChannelDialogRect(dialog, left, top, w, h);
  }

  function applyChannelModalSize(modal){
    const dialog = modal?.querySelector(".modal-dialog");
    if (!dialog) return;
    const stored = readChannelModalSize();
    const width = stored?.width || CHANNEL_MODAL_DEFAULT_WIDTH;
    const height = stored?.height || channelModalDefaultHeight();
    if (Number.isFinite(stored?.left) && Number.isFinite(stored?.top)) {
      setChannelDialogRect(dialog, stored.left, stored.top, width, height);
    } else {
      centerChannelDialog(dialog, width, height);
    }
  }

  const RESIZE_DIRS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  function cursorForResizeDir(dir){
    if (dir === "n" || dir === "s") return "ns-resize";
    if (dir === "e" || dir === "w") return "ew-resize";
    if (dir === "ne" || dir === "sw") return "nesw-resize";
    return "nwse-resize";
  }

  function ensureResizeHandles(dialog){
    let layer = dialog.querySelector(":scope > .btfw-modal-resize-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "btfw-modal-resize-layer";
      layer.setAttribute("aria-hidden", "true");
      for (const dir of RESIZE_DIRS) {
        const handle = document.createElement("div");
        handle.className = "btfw-modal-resize-handle";
        handle.dataset.resize = dir;
        handle.title = "Drag to resize";
        layer.appendChild(handle);
      }
    }
    layer.style.setProperty("pointer-events", "none", "important");
    layer.querySelectorAll(".btfw-modal-resize-handle").forEach((handle) => {
      handle.style.setProperty("pointer-events", "auto", "important");
    });
    dialog.appendChild(layer);
    return layer;
  }

  function installChannelModalResize(dialog, modal){
    if (!dialog) return;

    dialog.querySelectorAll(".modal-content > .btfw-modal-resize-handle").forEach((el) => el.remove());
    const legacyContent = dialog.querySelector(".modal-content");
    if (legacyContent) delete legacyContent.dataset.btfwResizeHandleWired;

    const layer = ensureResizeHandles(dialog);

    if (dialog.dataset.btfwResizableWired === "1") return;
    dialog.dataset.btfwResizableWired = "1";

    const header = dialog.querySelector(".modal-header");
    if (header && !header.dataset.btfwMoveWired) {
      header.dataset.btfwMoveWired = "1";
      header.classList.add("btfw-modal-drag-head");
      header.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        if (event.target.closest("button, a, input, select, textarea, .delete")) return;

        event.preventDefault();
        const startX = event.clientX;
        const startY = event.clientY;
        const start = getDialogRect(dialog);

        const onMove = (ev) => {
          setChannelDialogRect(
            dialog,
            start.left + (ev.clientX - startX),
            start.top + (ev.clientY - startY),
            start.width,
            start.height
          );
        };

        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          const box = getDialogRect(dialog);
          writeChannelModalSize(box.width, box.height, box.left, box.top);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    }

    layer.querySelectorAll(".btfw-modal-resize-handle").forEach((handle) => {
      if (handle.dataset.btfwResizeWired === "1") return;
      handle.dataset.btfwResizeWired = "1";
      const dir = handle.dataset.resize || "se";

      handle.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();

        const startX = event.clientX;
        const startY = event.clientY;
        const start = getDialogRect(dialog);
        const startW = start.width;
        const startH = start.height;
        const startL = start.left;
        const startT = start.top;
        const maxW = Math.floor(window.innerWidth * 0.96);
        const maxH = Math.floor(window.innerHeight * 0.9);

        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          let nextW = startW;
          let nextH = startH;
          let nextL = startL;
          let nextT = startT;

          if (dir.includes("e")) {
            nextW = Math.max(CHANNEL_MODAL_MIN_WIDTH, Math.min(maxW, startW + dx));
          }
          if (dir.includes("w")) {
            nextW = Math.max(CHANNEL_MODAL_MIN_WIDTH, Math.min(maxW, startW - dx));
            nextL = startL + (startW - nextW);
          }
          if (dir.includes("s")) {
            nextH = Math.max(CHANNEL_MODAL_MIN_HEIGHT, Math.min(maxH, startH + dy));
          }
          if (dir.includes("n")) {
            nextH = Math.max(CHANNEL_MODAL_MIN_HEIGHT, Math.min(maxH, startH - dy));
            nextT = startT + (startH - nextH);
          }

          setChannelDialogRect(dialog, nextL, nextT, nextW, nextH);
        };

        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          const box = getDialogRect(dialog);
          writeChannelModalSize(box.width, box.height, box.left, box.top);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      handle.style.cursor = cursorForResizeDir(dir);
    });
  }

  function enableChannelModalResize(modal){
    if (!modal || modal.id !== "channeloptions") return;
    modal.classList.add("btfw-modal-resizable");
    const dialog = modal.querySelector(".modal-dialog");
    if (!dialog) return;
    applyChannelModalSize(modal);
    installChannelModalResize(dialog, modal);
  }

  function restyleButtons(root){
    const map = [
      ["btn-primary", "is-link"],
      ["btn-danger",  "is-danger"],
      ["btn-warning", "is-warning"],
      ["btn-success", "is-success"],
      ["btn-info",    "is-info"],
      ["btn-default", "is-dark"]
    ];
    root.querySelectorAll(".btn").forEach(btn=>{
      btn.classList.add("button","is-small");
      btn.classList.remove("btn","btn-lg","btn-sm","btn-xs");
      let mapped=false;
      for (const [bs,bul] of map){
        if (btn.classList.contains(bs)) { btn.classList.remove(bs); btn.classList.add(bul); mapped=true; }
      }
      if (!mapped) btn.classList.add("is-dark");
      if (btn.classList.contains("pull-right")) { btn.classList.remove("pull-right"); btn.classList.add("is-pulled-right"); }
      if (btn.classList.contains("pull-left"))  { btn.classList.remove("pull-left");  btn.classList.add("is-pulled-left"); }
    });
  }

  function ensureDeleteButton(modal){
    const header = modal.querySelector(".modal-header");
    if (!header) return;
    if (header.querySelector(".delete")) return;
    const del = document.createElement("button");
    del.className = "delete"; del.setAttribute("aria-label","close");
    del.addEventListener("click", (e)=>{
      e.preventDefault();
      try { if (window.jQuery) window.jQuery(modal).modal("hide"); } catch(_) {}
      modal.classList.remove("is-active");
    });
    header.appendChild(del);
  }

  function decorate(modal){
    if (!modal || modal.classList.contains("btfw-modal")) return;
    const isNew = !modal.classList.contains("btfw-bulma-skin");
    if (!isNew) return;

    modal.classList.add("btfw-bulma-skin");

    modal.querySelectorAll(".modal-content").forEach(c=>c.classList.add("btfw-card"));
    modal.querySelectorAll(".modal-header").forEach(h=>h.classList.add("btfw-card-head"));
    modal.querySelectorAll(".modal-body").forEach(b=>b.classList.add("btfw-card-body"));
    modal.querySelectorAll(".modal-footer").forEach(f=>f.classList.add("btfw-card-foot"));

    ensureDeleteButton(modal);
    restyleButtons(modal);

    if (modal.id !== "channeloptions") return;

    try {
      if (window.jQuery) {
        window.jQuery(modal).on("shown.bs.modal", function(){
          restyleButtons(modal);
          enableChannelModalResize(modal);
        });
      }
    } catch(_) {}
  }

  function skinAll(){
    $$(".modal").forEach(m => decorate(m));
  }

  function boot(){
    skinAll();

    const handleBootstrapModal = (event)=>{
      const modal = event?.target && event.target.classList?.contains("modal")
        ? event.target
        : event?.target?.closest?.(".modal");
      if (modal) decorate(modal);
    };

    document.addEventListener("shown.bs.modal", handleBootstrapModal, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:modal-skin", reskin: skinAll };
});
