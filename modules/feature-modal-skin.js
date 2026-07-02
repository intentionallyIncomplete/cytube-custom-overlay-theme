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

  function readChannelModalSize(){
    try {
      const raw = localStorage.getItem(CHANNEL_MODAL_SIZE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const width = Number(parsed?.width);
      const height = Number(parsed?.height);
      if (!Number.isFinite(width) || width < CHANNEL_MODAL_MIN_WIDTH) return null;
      const maxW = Math.floor(window.innerWidth * 0.96);
      const size = { width: Math.min(Math.round(width), maxW) };
      if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
        const maxH = Math.floor(window.innerHeight * 0.9);
        size.height = Math.min(Math.round(height), maxH);
      }
      return size;
    } catch (_) {
      return null;
    }
  }

  function writeChannelModalSize(width, height){
    try {
      const payload = { width: Math.round(width) };
      if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
        payload.height = Math.round(height);
      }
      localStorage.setItem(CHANNEL_MODAL_SIZE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function setChannelDialogSize(dialog, width, height){
    const maxW = Math.floor(window.innerWidth * 0.96);
    const maxH = Math.floor(window.innerHeight * 0.9);
    const w = Math.max(
      CHANNEL_MODAL_MIN_WIDTH,
      Math.min(maxW, Math.round(width))
    );
    // Match max-width to target width so CyTube's width:auto/max-width !important
    // rules cannot block expansion above the current rendered size.
    dialog.style.setProperty("width", `${w}px`, "important");
    dialog.style.setProperty("max-width", `${w}px`, "important");
    dialog.style.setProperty("min-width", `${CHANNEL_MODAL_MIN_WIDTH}px`, "important");

    const content = dialog.querySelector(".modal-content");
    if (content) {
      content.style.setProperty("width", "100%", "important");
      content.style.setProperty("max-width", "none", "important");
      content.style.setProperty("box-sizing", "border-box", "important");
    }

    if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
      const h = Math.max(
        CHANNEL_MODAL_MIN_HEIGHT,
        Math.min(maxH, Math.round(height))
      );
      dialog.style.setProperty("height", `${h}px`, "important");
      dialog.style.setProperty("max-height", `${maxH}px`, "important");
      if (content) {
        content.style.setProperty("height", "100%", "important");
        content.style.setProperty("max-height", "100%", "important");
      }
    } else {
      dialog.style.removeProperty("height");
      dialog.style.removeProperty("max-height");
      if (content) {
        content.style.removeProperty("height");
        content.style.removeProperty("max-height");
      }
    }
  }

  function measureChannelDialogSize(dialog){
    return {
      width: dialog.offsetWidth,
      height: dialog.offsetHeight,
    };
  }

  function applyChannelModalSize(modal){
    const dialog = modal?.querySelector(".modal-dialog");
    if (!dialog) return;
    const stored = readChannelModalSize();
    setChannelDialogSize(
      dialog,
      stored?.width || CHANNEL_MODAL_DEFAULT_WIDTH,
      stored?.height
    );
  }

  function installChannelModalResizeHandle(modal){
    const dialog = modal?.querySelector(".modal-dialog");
    const content = dialog?.querySelector(".modal-content");
    if (!dialog || !content) return;

    // Drop legacy handles mounted on .modal-dialog from earlier builds.
    dialog.querySelectorAll(":scope > .btfw-modal-resize-handle").forEach((el) => el.remove());

    if (content.dataset.btfwResizeHandleWired === "1") return;
    content.dataset.btfwResizeHandleWired = "1";

    let handle = content.querySelector(".btfw-modal-resize-handle");
    if (!handle) {
      handle = document.createElement("div");
      handle.className = "btfw-modal-resize-handle";
      handle.setAttribute("aria-hidden", "true");
      handle.title = "Drag to resize";
      content.appendChild(handle);
    } else if (handle.parentElement !== content) {
      content.appendChild(handle);
    }

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startW = 0;
    let startH = 0;

    const onPointerDown = (event) => {
      if (event.button !== 0) return;
      dragging = true;
      const size = measureChannelDialogSize(dialog);
      startX = event.clientX;
      startY = event.clientY;
      startW = size.width;
      startH = size.height;
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerMove = (event) => {
      if (!dragging) return;
      setChannelDialogSize(
        dialog,
        startW + (event.clientX - startX),
        startH + (event.clientY - startY)
      );
    };

    const finishDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      try { handle.releasePointerCapture(event.pointerId); } catch (_) {}
      const size = measureChannelDialogSize(dialog);
      writeChannelModalSize(size.width, size.height);
    };

    handle.addEventListener("pointerdown", onPointerDown);
    handle.addEventListener("pointermove", onPointerMove);
    handle.addEventListener("pointerup", finishDrag);
    handle.addEventListener("pointercancel", finishDrag);
  }

  function enableChannelModalResize(modal){
    if (!modal || modal.id !== "channeloptions") return;
    modal.classList.add("btfw-modal-resizable");
    applyChannelModalSize(modal);
    installChannelModalResizeHandle(modal);
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
    if (!isNew) {
      enableChannelModalResize(modal);
      return;
    }
    modal.classList.add("btfw-bulma-skin");

    modal.querySelectorAll(".modal-content").forEach(c=>c.classList.add("btfw-card"));
    modal.querySelectorAll(".modal-header").forEach(h=>h.classList.add("btfw-card-head"));
    modal.querySelectorAll(".modal-body").forEach(b=>b.classList.add("btfw-card-body"));
    modal.querySelectorAll(".modal-footer").forEach(f=>f.classList.add("btfw-card-foot"));

    ensureDeleteButton(modal);

    restyleButtons(modal);

    enableChannelModalResize(modal);

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

    document.addEventListener("show.bs.modal", handleBootstrapModal, true);
    document.addEventListener("shown.bs.modal", handleBootstrapModal, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:modal-skin", reskin: skinAll };
});
