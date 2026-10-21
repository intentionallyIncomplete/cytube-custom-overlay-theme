import { LS_KEYS } from "../lib/btfw-constants.js";
import { safeGetItem, safeSetItem } from "../lib/storage.js";

BTFW.define("feature:chat-timestamps", [], async () => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  // #202: keys from the canonical LS_KEYS registry; access via the guarded
  // storage wrapper (private browsing / quota safe).
  const LS_SHOW   = LS_KEYS.chatTimestampsShow;
  const LS_FORMAT = LS_KEYS.chatTimestampsFormat;

  function getShow(){  return safeGetItem(LS_SHOW, "1")==="1"; }
  function setShow(v){ safeSetItem(LS_SHOW, v?"1":"0"); applyVisibility(v); }

  function getFmt(){   return safeGetItem(LS_FORMAT, "24") || "24"; }
  function setFmt(f){  safeSetItem(LS_FORMAT, f); reformatAll(f); }

  function applyVisibility(on){
    document.body.classList.toggle("btfw-ts-hide", !on);
  }

  function reformatOne(tEl, fmt){
    if (!tEl) return;
    const raw = (tEl.textContent||"").trim();
    const m = raw.match(/^\[([^\]]+)\]$/);
    if (!m) return;
    const s = m[1].trim();

    let hh=0, mm=0, ampm=null;
    let m1 = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m1) {
      hh = parseInt(m1[1],10); mm = parseInt(m1[2],10); ampm = m1[3].toUpperCase();
    } else {
      let m2 = s.match(/^(\d{1,2}):(\d{2})$/);
      if (!m2) return;
      hh = parseInt(m2[1],10); mm = parseInt(m2[2],10);
    }

    let out="";
    if (fmt==="12") {
      let h = hh % 12; if (h===0) h=12;
      const mer = (ampm ? ampm : (hh>=12?"PM":"AM"));
      out = `[${h}:${String(mm).padStart(2,"0")} ${mer}]`;
    } else {
      let h = hh;
      if (ampm==="AM" && hh===12) h=0;
      if (ampm==="PM" && hh<12) h=hh+1*12;
      out = `[${String(h).padStart(2,"0")}:${String(mm).padStart(2,"0")}]`;
    }
    if (out !== raw) tEl.textContent = out;
  }

  function reformatAll(fmt){
    $$("#messagebuffer .timestamp").forEach(t => reformatOne(t, fmt));
  }

  function processNode(n){
    if (!n) return;
    const ts = n.matches?.(".timestamp") ? [n] : (n.querySelectorAll?.(".timestamp")||[]);
    ts.forEach(t => reformatOne(t, getFmt()));
  }

  function boot(){
    applyVisibility(getShow());
    reformatAll(getFmt());

    const buf = $("#messagebuffer");
    if (buf && !buf._btfwTsMO){
      const mo = new MutationObserver(muts=>{
        for (const m of muts) {
          if (m.type==="childList" && m.addedNodes) {
            m.addedNodes.forEach(n => { if (n.nodeType===1) processNode(n); });
          }
        }
      });
      mo.observe(buf, { childList:true, subtree:true });
      buf._btfwTsMO = mo;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:chat-timestamps", getShow, setShow, getFmt, setFmt, reapply: ()=>{ applyVisibility(getShow()); reformatAll(getFmt()); } };
});
