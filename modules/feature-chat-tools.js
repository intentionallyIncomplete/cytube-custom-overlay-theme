/* BillTube Framework — feature:chat-tools
   Mini panel above chat input: BBCode buttons, AFK/Clear, and Color tools.
   Color uses BillTube2 format: prefix 'col:#RRGGBB:' at the start of the message.
*/
BTFW.define("feature:chat-tools", ["feature:chat"], async ({ init }) => {
  const motion = await init("util:motion");
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const LS = {
    hist:       "btfw:chat:history",
    stickColor: "btfw:chat:stickColor"
  };

  const COLORS = ["#1abc9c","#16a085","#f1c40f","#f39c12","#2ecc71","#27ae60","#e67e22",
                  "#d35400","#3498db","#2980b9","#e74c3c","#c0392b","#9b59b6","#8e44ad",
                  "#0080a5","#34495e","#2c3e50","#87724b","#7300a7","#ec87bf","#d870ad",
                  "#f69785","#9ba37e","#b49255","#a94136"];

  try { localStorage.removeItem("btfw:chat:nameColor"); } catch(e){}
  (function clearUsernameTint(){
    $$("#messagebuffer .username, #messagebuffer .nick, #messagebuffer .name")
      .forEach(n => { try { n.style.color = ""; } catch(e){} });
  })();

  const chatline = () => $("#chatline");

  function withSelection(fn){
    const l = chatline(); if (!l) return;
    const a = l.selectionStart ?? l.value.length;
    const b = l.selectionEnd ?? l.value.length;
    const before = l.value.slice(0, a);
    const mid    = l.value.slice(a, b);
    const after  = l.value.slice(b);
    fn(l, {a,b,before,mid,after});
  }

  function wrapWithTag(tag){
    withSelection((l, s)=>{
      const open = `[${tag}]`, close = `[/${tag}]`;
      l.value = s.before + open + s.mid + close + s.after;

      if (s.mid.length === 0) {
        const pos = s.before.length + open.length;
        l.focus(); l.setSelectionRange(pos, pos);
      } else {
        const start = s.before.length + open.length;
        const end   = start + s.mid.length;
        l.focus(); l.setSelectionRange(start, end);
      }
    });
  }

  function normalizeHex(x){
    if (!x) return "";
    x = x.trim();
    if (/^[0-9a-f]{6}$/i.test(x)) x = "#"+x;
    if (!/^#[0-9a-f]{6}$/i.test(x)) return "";
    return x.toLowerCase();
  }

  function applyColPrefix(hex){
    hex = normalizeHex(hex); if (!hex) return;
    const l = chatline(); if (!l) return;
    const prefixRe = /^col:\s*#?[0-9a-fA-F]{6}:\s*/;
    const current = l.value || "";
    const without = current.replace(prefixRe, "");
    const prefix  = `col:${hex}:`;
    const glue = without && !/^\s/.test(without) ? " " : "";
    l.value = prefix + glue + without;
    const pos = l.value.length;
    l.focus(); l.setSelectionRange(pos, pos);
  }

  function getStickColor(){ try { return localStorage.getItem(LS.stickColor)||""; } catch(e){ return ""; } }
  function setStickColor(hex){ try { localStorage.setItem(LS.stickColor, normalizeHex(hex)||""); } catch(e){} }

  function applyStickyColorBeforeSend(){
    const hex = getStickColor(); if (!hex) return;
    const l = chatline(); if (!l) return;
    const v = (l.value||"").trimStart();
    if (/^col:\s*#?[0-9a-fA-F]{6}:/i.test(v)) return;
    l.value = `col:${normalizeHex(hex)}:` + (v ? " " : "") + v;
  }

  function ensureMiniModal(){
    const cw = document.getElementById("chatwrap") || document.body;

    let modal = document.getElementById("btfw-ct-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "btfw-ct-modal";
      modal.setAttribute("hidden", "");
      modal.setAttribute("aria-hidden", "true");
      cw.appendChild(modal);
    }

   modal.textContent = "";

    const modalCard = document.createElement("div");
    modalCard.className = "btfw-ct-card";

    const cardHead = document.createElement("div");
    cardHead.className = "btfw-ct-cardhead";
    const title = document.createElement("span");
    title.textContent = "Chat Tools";
    const closeBtn = document.createElement("button");
    closeBtn.className = "btfw-ct-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "&times;";

    cardHead.appendChild(title);
    cardHead.appendChild(closeBtn);
    modalCard.appendChild(cardHead);

    const cardBody = document.createElement("div");
    cardBody.className = "btfw-ct-body";

    const grid = document.createElement("div");
    grid.className = "btfw-ct-grid";

    [
      { tag: "b", html: "<strong>B</strong><span>Bold</span>" },
      { tag: "i", html: "<em>I</em><span>Italic</span>" },
      { tag: "u", html: "<u>U</u><span>Underline</span>" },
      { tag: "s", html: '<span style="text-decoration:line-through">S</span><span>Strike</span>' },
      { tag: "sp", html: "<span>🙈</span><span>Spoiler</span>" }
    ].forEach(({ tag, html }) => {
      const btn = document.createElement("button");
      btn.className = "btfw-ct-item";
      btn.setAttribute("data-tag", tag);
      btn.innerHTML = html;
      grid.appendChild(btn);
    });
    cardBody.appendChild(grid);

    const colorDiv = document.createElement("div");
    colorDiv.className = "btfw-ct-color";

    const keepLabel = document.createElement("label");
    keepLabel.className = "btfw-ct-keep";
    const keepBox = document.createElement("input");
    keepBox.type = "checkbox";
    keepBox.id = "btfw-ct-keepcolor";
    keepLabel.appendChild(keepBox);
    keepLabel.appendChild(document.createTextNode(" Keep color"));
    colorDiv.appendChild(keepLabel);

    const swatch = document.createElement("div");
    swatch.className = "btfw-ct-swatch";
    swatch.id = "btfw-ct-swatch";
    colorDiv.appendChild(swatch);

    const hexRow = document.createElement("div");
    hexRow.className = "btfw-ct-hexrow";
    hexRow.style.display = "flex";
    hexRow.style.gap = "6px";
    hexRow.style.alignItems = "center";
    hexRow.style.marginTop = "6px";

    const hexInput = document.createElement("input");
    hexInput.id = "btfw-ct-hex";
    hexInput.type = "text";
    hexInput.placeholder = "#rrggbb";
    hexInput.maxLength = 7;
    hexInput.className = "input is-small";
    hexInput.style.maxWidth = "120px";

    const insertBtn = document.createElement("button");
    insertBtn.id = "btfw-ct-insertcolor";
    insertBtn.className = "button is-small";
    insertBtn.textContent = "Insert";
    const clearBtn = document.createElement("button");
    clearBtn.id = "btfw-ct-clearcolor";
    clearBtn.className = "button is-small";
    clearBtn.textContent = "Clear Keep";

    hexRow.appendChild(hexInput);
    hexRow.appendChild(insertBtn);
    hexRow.appendChild(clearBtn);
    colorDiv.appendChild(hexRow);

    cardBody.appendChild(colorDiv);

    const actions = document.createElement("div");
    actions.className = "btfw-ct-actions";
    actions.style.display = "flex";
    actions.style.gap = "6px";
    actions.style.marginTop = "8px";

    [
      { act: "clear", text: "Clear" },
      { act: "afk", text: "AFK" }
    ].forEach(({ act, text }) => {
      const btn = document.createElement("button");
      btn.className = "btfw-ct-item button is-small";
      btn.setAttribute("data-act", act);
      btn.textContent = text;
      actions.appendChild(btn);
    });
    cardBody.appendChild(actions);

    modalCard.appendChild(cardBody);
    modal.appendChild(modalCard);

    modal.style.background = "transparent";
    modal.style.pointerEvents = "none";

    (function syncKeepColorUI() {
      const keep = $("#btfw-ct-keepcolor");
      const hexEl = $("#btfw-ct-hex");
      const stored = (getStickColor && getStickColor()) || "";
      if (keep) keep.checked = !!stored;
      if (hexEl && stored) hexEl.value = stored;
    })();

    const card = modal.querySelector(".btfw-ct-card");
    if (card) {
      card.classList.add("btfw-popover");
      card.style.pointerEvents = "auto";
      card.dataset.btfwPopoverState = "closed";
      card.setAttribute("hidden", "");
      card.setAttribute("aria-hidden", "true");
    }

    const sw = document.querySelector("#btfw-ct-swatch");
    if (sw && !sw.hasChildNodes()) {
      COLORS.forEach(c => {
        const b = document.createElement("button");
        b.className = "btfw-ct-swatchbtn";
        b.style.background = c;
        b.dataset.color = c;
        sw.appendChild(b);
      });
    }

    return modal;
  }

  function openMiniModal() {
    const m = ensureMiniModal(); if (!m) return;

    (function syncKeepColorUI() {
      const keep = document.getElementById("btfw-ct-keepcolor");
      const hexEl = document.getElementById("btfw-ct-hex");
      const stored = (typeof getStickColor === "function" && getStickColor()) || "";
      if (keep) keep.checked = !!stored;
      if (hexEl && stored) hexEl.value = stored;
      if (keep && keep.checked && !stored) keep.checked = false;
    })();

    m.removeAttribute("hidden");
    m.removeAttribute("aria-hidden");
    positionMiniModal();
    const card = m.querySelector(".btfw-ct-card");
    if (card) motion.openPopover(card);
  }

  function closeMiniModal() {
    const m = $("#btfw-ct-modal");
    if (!m) return;
    const card = m.querySelector(".btfw-ct-card");
    if (!card) {
      m.setAttribute("hidden", "");
      m.setAttribute("aria-hidden", "true");
      return;
    }
    motion.closePopover(card).then(() => {
      if (card.dataset.btfwPopoverState === "open") return;
      m.setAttribute("hidden", "");
      m.setAttribute("aria-hidden", "true");
    });
  }

  function positionMiniModal() {
    const m = document.getElementById("btfw-ct-modal"); if (!m) return;
    const card = m.querySelector(".btfw-ct-card"); if (!card) return;

    if (window.BTFW_positionPopoverAboveChatBar) {
      window.BTFW_positionPopoverAboveChatBar(card, {
        widthPx: 420,
        widthVw: 92,
        maxHpx: 360,
        maxHvh: 60
      });
      return;
    }

    const c = (document.getElementById("chatcontrols")
      || document.getElementById("chat-controls")
      || (document.getElementById("chatline") && document.getElementById("chatline").parentElement));
    if (!c) return;

    const bottom = (c.offsetHeight || 48) + 12;
    card.style.position = "fixed";
    card.style.right = "8px";
    card.style.bottom = bottom + "px";
    card.style.maxHeight = "60vh";
    card.style.width = "min(420px,92vw)";
  }

  function ensureActionsButton() {
    const actions = $("#chatwrap .btfw-chat-bottombar #btfw-chat-actions");
    if (!actions) return;

    if ($("#btfw-chattools-btn") || $("#btfw-ct-open")) return;

    const b = document.createElement("button");
    b.id = "btfw-chattools-btn";
    b.className = "button is-dark is-small btfw-chatbtn";
    b.title = "Chat tools";
    b.setAttribute("aria-label", "Chat tools");
    b.innerHTML = '<span style="font-weight:700;letter-spacing:.5px;">Aa</span>';
    const insertBefore = actions.querySelector("#btfw-chatcmds-btn")
      || actions.querySelector("#btfw-users-toggle")
      || actions.querySelector("#usercount");
    actions.insertBefore(b, insertBefore || null);
  }

  function getHist() { try { return JSON.parse(localStorage.getItem(LS.hist) || "[]"); } catch (e) { return []; } }
  function setHist(a) { try { localStorage.setItem(LS.hist, JSON.stringify(a.slice(-50))); } catch (e) { } }
  let histIndex = -1;
  function commitToHist(text) {
    if (!text) return;
    const h = getHist();
    if (h[h.length - 1] !== text) { h.push(text); setHist(h); }
    histIndex = -1;
  }
  function histUpDown(dir) {
    const l = chatline(); if (!l) return;
    const h = getHist(); if (!h.length) return;
    if (histIndex === -1) histIndex = h.length;
    histIndex += (dir < 0 ? -1 : +1);
    histIndex = Math.max(0, Math.min(h.length - 1, histIndex));
    l.value = h[histIndex] || "";
    l.focus(); l.setSelectionRange(l.value.length, l.value.length);
  }

  function wire(){
    if (window._btfwChatToolsWired) return;
    window._btfwChatToolsWired = true;

    ensureActionsButton();
    ensureMiniModal();

    const toolsBtn = $("#btfw-chattools-btn") || $("#btfw-ct-open");
    if (toolsBtn) {
      toolsBtn.title = toolsBtn.title || "Chat tools";
      if (!toolsBtn.getAttribute("aria-label")) {
        toolsBtn.setAttribute("aria-label", "Chat tools");
      }
      toolsBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const m = $("#btfw-ct-modal");
        const card = m?.querySelector?.(".btfw-ct-card");
        const isOpen = !!(card && card.dataset.btfwPopoverState === "open");
        if (isOpen) closeMiniModal(); else openMiniModal();
      }, { capture: true });
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest && e.target.closest(".btfw-ct-close")) {
        e.preventDefault();
        closeMiniModal();
        return;
      }

      const inCard = e.target.closest && e.target.closest("#btfw-ct-modal .btfw-ct-card");

      const bb = e.target.closest && e.target.closest(".btfw-ct-item[data-tag]");
      if (bb && inCard) {
        e.preventDefault();
        wrapWithTag(bb.dataset.tag);
        closeMiniModal();
        return;
      }

      const afk = e.target.closest && e.target.closest('.btfw-ct-item[data-act="afk"]');
      if (afk && inCard) {
        e.preventDefault();
        if (window.socket?.emit) window.socket.emit("chatMsg", { msg: "/afk" });
        closeMiniModal();
        return;
      }
      const clr = e.target.closest && e.target.closest('.btfw-ct-item[data-act="clear"]');
      if (clr && inCard) {
        e.preventDefault();
        const mb = $("#messagebuffer"); if (mb) mb.innerHTML = "";
        closeMiniModal();
        return;
      }

      const swb = e.target.closest && e.target.closest(".btfw-ct-swatchbtn");
      if (swb && inCard) {
        e.preventDefault();
        const swHex = normalizeHex(swb.dataset.color || "");
        const hexEl = $("#btfw-ct-hex");
        if (hexEl) hexEl.value = swHex;
        const keep = $("#btfw-ct-keepcolor");
        if (keep && keep.checked) setStickColor(swHex);
        return;
      }

      if (e.target && e.target.id === "btfw-ct-insertcolor" && inCard) {
        e.preventDefault();
        const hexEl = $("#btfw-ct-hex");
        const hex = normalizeHex((hexEl?.value || "").trim());
        if (hex) {
          applyColPrefix(hex);
          const keep = $("#btfw-ct-keepcolor");
          if (keep && keep.checked) setStickColor(hex);
          closeMiniModal();
        }
        return;
      }

      if (e.target && e.target.id === "btfw-ct-clearcolor" && inCard) {
        e.preventDefault();
        setStickColor("");
        const keep = $("#btfw-ct-keepcolor"); if (keep) keep.checked = false;
        return;
      }

      if (!inCard &&
          !e.target.closest("#btfw-chattools-btn") &&
          !e.target.closest("#btfw-ct-open")) {
        closeMiniModal();
        return;
      }
    }, true);

    document.addEventListener("change", (e)=>{
      if (e.target && e.target.id === "btfw-ct-keepcolor") {
        const hexEl = $("#btfw-ct-hex");
        const hex = normalizeHex((hexEl?.value || "").trim());

        if (e.target.checked) {
          if (hex) {
            setStickColor(hex);
          } else {
            setStickColor("");
            e.target.checked = false;
          }
        } else {
          setStickColor("");
        }
        return;
      }
    }, true);

    document.addEventListener("input", (e)=>{
      if (e.target && e.target.id === "btfw-ct-hex") {
        const keep = $("#btfw-ct-keepcolor");
        if (keep && keep.checked) {
          const val = normalizeHex((e.target.value || "").trim());
          setStickColor(val);
        }
      }
    }, true);

    document.addEventListener("keydown", (e)=>{
      if (e.key === "Escape") closeMiniModal();
    }, true);

    const l = chatline(); if (l) {
      l.addEventListener("keydown", (ev)=>{
        if (ev.key === "Enter" && !ev.shiftKey) {
          applyStickyColorBeforeSend();
          commitToHist(l.value.trim());
        }
        if (ev.key === "ArrowUp" && !ev.shiftKey && l.selectionStart===l.selectionEnd && l.selectionStart===0) {
          ev.preventDefault(); histUpDown(-1);
        }
        if (ev.key === "ArrowDown" && !ev.shiftKey && l.selectionStart===l.selectionEnd && l.selectionStart===l.value.length) {
          ev.preventDefault(); histUpDown(+1);
        }
      });
    }

    window.addEventListener("resize", positionMiniModal);
    $("#chatwrap")?.addEventListener("scroll", positionMiniModal, { passive:true });
  }

  function boot(){ wire(); positionMiniModal(); }
  document.addEventListener("btfw:layoutReady", ()=>setTimeout(boot,0));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  return { name: "feature:chat-tools" };
});