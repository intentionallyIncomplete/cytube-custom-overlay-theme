/* BTFW — feature:motd-editor
   MOTD editor using Summernote (outputs inline styles, not classes).
   Saves via socket.emit("setMotd", { motd: "<html>" }).
*/
import {
  createDirtyApplyController,
  setApplyButtonVisible
} from "../lib/dirty-apply.js";
import { confirmDialog } from "../lib/confirm-dialog.js";
import { escapeHtml, sanitizeHtml } from "../lib/escape-html.js";

BTFW.define("feature:motd-editor", [], async () => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const motion = await BTFW.init("util:motion");
  
  // Summernote CDN (v0.8.20 - stable)
  const SUMMERNOTE_CSS = "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css";
  const SUMMERNOTE_JS = "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js";
  
  // jQuery is required for Summernote
  const JQUERY_JS = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js";

  function loadOnce(href, rel="stylesheet"){
    return new Promise((res,rej)=>{
      if (rel === "stylesheet" && $$(`link[href="${href}"]`).length) return res();
      if (rel === "script" && $$(`script[src="${href}"]`).length) return res();
      const el = document.createElement(rel==="script"?"script":"link");
      if (window.BTFW && window.BTFW.SRI && window.BTFW.SRI[href]) {
        el.integrity = window.BTFW.SRI[href];
        el.crossOrigin = "anonymous";
      }
      if (rel==="script") { 
        el.src = href; 
        el.async = false; // Summernote needs jQuery first
        el.onload = res; 
        el.onerror = rej; 
      } else { 
        el.rel="stylesheet"; 
        el.href = href; 
        el.onload = res; 
        el.onerror = rej; 
      }
      document.head.appendChild(el);
    });
  }

  function canEditMotd(){
    try {
      if (typeof window.hasPermission === "function") {
        if (window.hasPermission("motdedit") || window.hasPermission("editMotd") || window.hasPermission("motd")) {
          return true;
        }
      }
      const client = window.CLIENT || null;
      if (client?.hasPermission) {
        if (client.hasPermission("motdedit") || client.hasPermission("editMotd") || client.hasPermission("motd")) {
          return true;
        }
      }
      if (client && typeof client.rank !== "undefined") {
        const rank = client.rank|0;
        const ranks = window.RANK || window.Ranks || {};
        const thresholds = [ranks.moderator, ranks.mod, ranks.admin, ranks.administrator];
        const needed = thresholds.find(v => typeof v === "number");
        if (typeof needed === "number") return rank >= needed;
        return rank >= 2;
      }
    } catch(_) {}
    return false;
  }

  function getMotdContent(){
    const csMotd = $("#cs-motdtext");
    if (csMotd && csMotd.value && !isMotdHtmlEmpty(csMotd.value)) {
      return csMotd.value;
    }

    const motdDisplay = resolveMotdDisplay();
    if (motdDisplay && !isMotdHtmlEmpty(motdDisplay.innerHTML)) {
      return motdDisplay.innerHTML;
    }

    return "";
  }

  function buildModal(){
    const existing = $("#btfw-motd-modal");
    if (existing) {
      if (window.jQuery && window.jQuery.fn.summernote) {
        const host = $("#btfw-motd-editor", existing);
        if (host && jQuery(host).next(".note-editor").length) {
          jQuery(host).summernote("destroy");
        }
      }
      existing.remove();
    }
    
    const m = document.createElement("div");
    m.id = "btfw-motd-modal";
    m.className = "modal";
    m.dataset.btfwModalState = "closed";
    m.setAttribute("hidden", "");
    m.setAttribute("aria-hidden", "true");

    const background = document.createElement("div");
    background.className = "modal-background";

    const card = document.createElement("div");
    card.className = "modal-card btfw-modal";

    const header = document.createElement("header");
    header.className = "modal-card-head";
    const title = document.createElement("p");
    title.className = "modal-card-title";
    title.textContent = "Edit MOTD";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.setAttribute("aria-label", "close");
    header.append(title, deleteBtn);

    const body = document.createElement("section");
    body.className = "modal-card-body";
    const editorHost = document.createElement("div");
    editorHost.id = "btfw-motd-editor";
    body.appendChild(editorHost);

    const footer = document.createElement("footer");
    footer.className = "modal-card-foot";
    const applyBtn = document.createElement("button");
    applyBtn.className = "button is-link";
    applyBtn.id = "btfw-motd-apply";
    applyBtn.hidden = true;
    applyBtn.setAttribute("aria-hidden", "true");
    applyBtn.tabIndex = -1;
    applyBtn.textContent = "Apply";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "button";
    cancelBtn.id = "btfw-motd-cancel";
    cancelBtn.textContent = "Cancel";
    footer.append(applyBtn, cancelBtn);

    card.append(header, body, footer);
    m.append(background, card);
    document.body.appendChild(m);
    return m;
  }

  function wireModalDismiss(m, onDismiss) {
    const dismiss = async () => {
      if (m._btfwMotdDirty) {
        const ok = await m._btfwMotdDirty.tryClose();
        if (!ok) return;
        m._btfwMotdDirty.dispose();
        m._btfwMotdDirty = null;
      }
      const host = $("#btfw-motd-editor", m);
      if (window.jQuery && window.jQuery.fn.summernote && host) {
        const hasEditor = jQuery(host).next(".note-editor").length;
        if (hasEditor) jQuery(host).summernote("destroy");
      }
      motion.closeModal(m);
      if (typeof onDismiss === "function") onDismiss();
    };
    $(".modal-background", m)?.addEventListener("click", () => { void dismiss(); });
    $(".delete", m)?.addEventListener("click", () => { void dismiss(); });
    $("#btfw-motd-cancel", m)?.addEventListener("click", () => { void dismiss(); });
    return dismiss;
  }

  async function openEditor(){
    if (editorModalOpen) return;
    editorModalOpen = true;

    const stack = await getStackApi();
    if (stack?.normalizeMotdStructure) {
      stack.normalizeMotdStructure();
    }

    const initialHTML = getMotdContent();
    const m = buildModal();
    const closeEditor = wireModalDismiss(m, () => { editorModalOpen = false; });
    
    // Load dependencies in order: jQuery → Summernote CSS → Summernote JS
    try {
      if (!window.jQuery) {
        await loadOnce(JQUERY_JS, "script");
      }
      await loadOnce(SUMMERNOTE_CSS, "stylesheet");
      await loadOnce(SUMMERNOTE_JS, "script");
    } catch(e){ 
      console.warn("[motd-editor] Summernote load failed", e);
      const host = $("#btfw-motd-editor", m);
      if (host) {
        host.innerHTML = `<textarea class="textarea" style="height:400px; font-family:monospace;">${escapeHtml(initialHTML)}</textarea>`;
      }
      motion.openModal(m);
      editorModalOpen = false;
      return;
    }
    
    const host = $("#btfw-motd-editor", m);
    if (!host) {
      console.error('[motd-editor] Editor host not found');
      editorModalOpen = false;
      return;
    }

    // Initialize Summernote
    if (window.jQuery && window.jQuery.fn.summernote) {
      jQuery(host).summernote({
        height: 400,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
          ['fontname', ['fontname']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video']],
          ['view', ['codeview', 'help']]
        ],
        styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans'],
        fontSizes: ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'],
        placeholder: 'Enter your message of the day here...',
        callbacks: {
          onInit: function() {
            // Set initial content
            jQuery(host).summernote('code', initialHTML);
            console.log('[motd-editor] Summernote initialized');
          }
        }
      });
    } else {
      host.innerHTML = `<textarea class="textarea" style="height:400px;">${escapeHtml(initialHTML)}</textarea>`;
    }

    const applyBtn = $("#btfw-motd-apply", m);
    let baselineHtml = initialHTML;
    let currentHtml = () =>
      window.jQuery && window.jQuery.fn.summernote
        ? jQuery(host).summernote("code")
        : ($("#btfw-motd-editor textarea", m)?.value || "");

    if (applyBtn) {
      setApplyButtonVisible(applyBtn, false);
      const section = {
        id: "motd-modal",
        snapshot: () => currentHtml(),
        restore: (snap) => {
          if (window.jQuery && window.jQuery.fn.summernote) {
            jQuery(host).summernote("code", snap);
          } else {
            const ta = $("#btfw-motd-editor textarea", m);
            if (ta) ta.value = snap;
          }
        },
        apply: async () => {
          const html = currentHtml();
          try {
            if (window.socket?.emit) {
              socket.emit("setMotd", { motd: html });
            }
          } catch (e) {
            console.warn("[motd-editor] setMotd emit failed", e);
            return { ok: false, error: "Failed to emit setMotd" };
          }

          const stackModule = await getStackApi();
          if (stackModule?.applyMotdUpdate) {
            stackModule.applyMotdUpdate(html);
          } else {
            const motdDisplay = resolveMotdDisplay();
            if (motdDisplay) motdDisplay.innerHTML = sanitizeHtml(html);
            const csMotd = $("#cs-motdtext");
            if (csMotd) csMotd.value = html;
          }
          baselineHtml = html;
          return { ok: true };
        }
      };

      const controller = createDirtyApplyController({
        modal: m,
        applyButton: applyBtn,
        sections: [section],
        confirmDiscard: () =>
          confirmDialog({ message: "Discard unsaved MOTD changes?" })
      });

      applyBtn.onclick = async () => {
        const result = await controller.applyAll();
        if (result.ok) closeEditor();
      };

      if (window.jQuery && window.jQuery.fn.summernote) {
        jQuery(host).on("summernote.change", () => {
          controller.markDirty("motd-modal");
        });
      } else {
        const ta = $("#btfw-motd-editor textarea", m);
        ta?.addEventListener("input", () => controller.markDirty("motd-modal"));
      }

      m._btfwMotdDirty = controller;
    }

    motion.openModal(m);
  }

  // Enhance channel settings MOTD textarea
  async function enhanceChannelSettingsMotd(){
    const textarea = $("#cs-motdtext");
    if (!textarea || textarea.dataset.btfwSummernoteEnhanced) return;
    
    textarea.dataset.btfwSummernoteEnhanced = "true";
    
    try {
      if (!window.jQuery) {
        await loadOnce(JQUERY_JS, "script");
      }
      await loadOnce(SUMMERNOTE_CSS, "stylesheet");
      await loadOnce(SUMMERNOTE_JS, "script");
    } catch(e){ 
      console.warn("[motd-editor] Summernote load failed for channel settings", e); 
      return;
    }
    
    if (!window.jQuery || !window.jQuery.fn.summernote) return;
    
    const initialHTML = textarea.value || "";
    
    // Initialize Summernote directly on textarea
    jQuery(textarea).summernote({
      height: 350,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['codeview']]
      ],
      styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      fontNames: ['Arial', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Roboto', 'Open Sans'],
      fontSizes: ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48'],
      callbacks: {
        onChange: function(contents) {
          // Summernote automatically updates the original textarea
          textarea.value = contents;
          // Bubble so feature:channelOptionsApply dirty controller sees the edit
          textarea.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    });
    
    console.log('[motd-editor] Channel settings MOTD enhanced with Summernote');
  }

  function watchChannelSettings(){
    const observer = new MutationObserver(() => {
      const modal = $("#channeloptions, #channelsettingsmodal, #channeloptionsmodal");
      if (modal && modal.style.display !== "none" && !modal.classList.contains("hidden")) {
        setTimeout(() => enhanceChannelSettingsMotd(), 150);
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    document.addEventListener("show.bs.modal", (event) => {
      const modal = event?.target;
      if (modal && (modal.id === "channeloptions" || modal.id === "channelsettingsmodal" || modal.id === "channeloptionsmodal")) {
        setTimeout(() => enhanceChannelSettingsMotd(), 150);
      }
    }, true);
    
    document.addEventListener("shown.bs.modal", (event) => {
      const modal = event?.target;
      if (modal && (modal.id === "channeloptions" || modal.id === "channelsettingsmodal" || modal.id === "channeloptionsmodal")) {
        setTimeout(() => enhanceChannelSettingsMotd(), 150);
      }
    }, true);
  }

  const MOTD_EDIT_BTN_CLASS = "btfw-stack-header-btn";

  function buildMotdEditBtnContent() {
    const icon = document.createElement("i");
    icon.className = "fa fa-plus";
    icon.setAttribute("aria-hidden", "true");
    return [icon, document.createTextNode(" Edit MOTD")];
  }
  let injectButtonTimer = null;
  let editorModalOpen = false;
  let stackApi = null;

  async function getStackApi() {
    if (!stackApi) {
      try { stackApi = await BTFW.init("feature:stack"); } catch (_) {}
    }
    return stackApi;
  }

  function resolveMotdDisplay() {
    const wrap = $("#motdwrap");
    if (wrap) {
      const direct = wrap.querySelector(":scope > #motd");
      if (direct) return direct;
      const nested = wrap.querySelector("#motd");
      if (nested) return nested;
    }
    return $("#motd");
  }

  // Regex-based tag strip + entity decode, deliberately avoiding `element.innerHTML = html`. MOTD
  // source can be attacker-influenced (see feature-motd-editor.js's own CRITICAL-table fixes above),
  // and setting innerHTML on a live-document element still triggers resource-loading event handlers
  // like `<img src=x onerror=...>` even when that element is never attached to the visible DOM —
  // "detached" is not the same as "inert document". Mirrors feature-stack.js's isMotdHtmlEmpty().
  function isMotdHtmlEmpty(html = "") {
    const raw = String(html || "").trim();
    if (!raw) return true;
    const text = raw
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return !text;
  }

  function injectButton(){
    const existingBtn = document.getElementById("btfw-motd-editbtn");
    const existingRow = existingBtn ? existingBtn.closest(".btfw-motd-editrow") : null;

    if (!canEditMotd()) {
      if (existingBtn && existingBtn.closest(".btfw-stack-header-actions")) {
        existingBtn.remove();
      }
      if (existingRow) existingRow.remove();
      return;
    }

    const motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]');
    const header = motdGroup?.querySelector(".btfw-stack-item__header");
    if (header) {
      let slot = header.querySelector(".btfw-stack-header-actions");
      if (!slot) {
        slot = document.createElement("span");
        slot.className = "btfw-stack-header-actions";
        const arrows = header.querySelector(".btfw-stack-arrows");
        if (arrows) header.insertBefore(slot, arrows);
        else header.appendChild(slot);
      }

      let btn = existingBtn;
      if (!btn) {
        btn = document.createElement("button");
        btn.id = "btfw-motd-editbtn";
      }
      btn.className = MOTD_EDIT_BTN_CLASS;
      if (!btn.querySelector(".fa-plus")) btn.replaceChildren(...buildMotdEditBtnContent());
      if (!btn._btfwMotdBound) {
        btn._btfwMotdBound = true;
        btn.addEventListener("click", openEditor);
      }
      if (btn.parentElement !== slot) slot.appendChild(btn);
      if (existingRow && existingRow.parentElement) existingRow.remove();
      return;
    }

    const motdWrap = $("#motdwrap") || $("#motd")?.closest(".well") || $("#btfw-leftpad");
    const host = motdWrap?.parentNode;
    if (!motdWrap || !host) return;

    let row = existingRow;
    if (!row) {
      row = document.createElement("div");
      const seedBtn = document.createElement("button");
      seedBtn.id = "btfw-motd-editbtn";
      seedBtn.className = "btfw-stack-header-btn";
      seedBtn.append(...buildMotdEditBtnContent());
      row.appendChild(seedBtn);
    }

    row.classList.add("buttons", "is-right", "btfw-motd-editrow");

    if (!row.querySelector("#btfw-motd-editbtn")) {
      const btn = document.createElement("button");
      btn.id = "btfw-motd-editbtn";
      btn.className = MOTD_EDIT_BTN_CLASS;
      btn.append(...buildMotdEditBtnContent());
      row.appendChild(btn);
    }

    if (row.parentNode !== host || row.previousElementSibling !== motdWrap) {
      host.insertBefore(row, motdWrap.nextSibling);
    }

    const btn = row.querySelector("#btfw-motd-editbtn");
    if (btn && !btn._btfwMotdBound) {
      btn._btfwMotdBound = true;
      btn.addEventListener("click", openEditor);
    }
  }

  function scheduleInjectButton() {
    if (editorModalOpen) return;
    if (injectButtonTimer) return;
    injectButtonTimer = requestAnimationFrame(() => {
      injectButtonTimer = null;
      if (!editorModalOpen) injectButton();
    });
  }

  function boot(){
    injectButton();
    const stackRoot = document.getElementById("btfw-stack");
    if (stackRoot) {
      const mo = new MutationObserver(() => scheduleInjectButton());
      mo.observe(stackRoot, { childList: true, subtree: true });
    } else {
      const mo = new MutationObserver(() => scheduleInjectButton());
      mo.observe(document.body, { childList: true, subtree: false });
    }
    watchChannelSettings();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:motd-editor", openEditor };
});
