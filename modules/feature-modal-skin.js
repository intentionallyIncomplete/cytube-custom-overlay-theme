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
      const size = { width: Math.round(width) };
      if (Number.isFinite(height) && height >= CHANNEL_MODAL_MIN_HEIGHT) {
        size.height = Math.round(height);
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

  function applyChannelModalSize(modal){
    const dialog = modal?.querySelector(".modal-dialog");
    if (!dialog) return;
    const stored = readChannelModalSize();
    const width = stored?.width || CHANNEL_MODAL_DEFAULT_WIDTH;
    dialog.style.width = `${width}px`;
    dialog.style.maxWidth = "96vw";
    if (stored?.height) {
      dialog.style.height = `${stored.height}px`;
      dialog.style.maxHeight = "90vh";
    } else {
      dialog.style.removeProperty("height");
      dialog.style.removeProperty("max-height");
    }
  }

  function watchChannelModalResize(modal){
    const dialog = modal?.querySelector(".modal-dialog");
    if (!dialog || dialog.dataset.btfwResizeWired === "1") return;
    dialog.dataset.btfwResizeWired = "1";

    let saveTimer = null;
    const persist = () => {
      const rect = dialog.getBoundingClientRect();
      writeChannelModalSize(rect.width, rect.height);
    };
    const scheduleSave = () => {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(persist, 180);
    };

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(scheduleSave);
      observer.observe(dialog);
      dialog._btfwResizeObserver = observer;
    } else {
      dialog.addEventListener("mouseup", scheduleSave);
    }
  }

  function enableChannelModalResize(modal){
    if (!modal || modal.id !== "channeloptions") return;
    modal.classList.add("btfw-modal-resizable");
    applyChannelModalSize(modal);
    watchChannelModalResize(modal);
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
