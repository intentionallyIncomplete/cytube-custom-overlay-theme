/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var k="btfw-confirm-dialog",F="btfw-confirm-dialog-style";function z(){if(typeof document=="undefined"||document.getElementById(F))return;let e=document.createElement("style");e.id=F,e.textContent=`
    #${k} {
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 40%, transparent 60%);
      border-radius: 16px;
      padding: 0;
      max-width: 420px;
      width: calc(100vw - 32px);
      background: color-mix(in srgb, var(--btfw-theme-panel, #141f36) 96%, transparent 4%);
      color: var(--btfw-theme-text, #e8ecfb);
      box-shadow: 0 24px 60px color-mix(in srgb, var(--btfw-theme-bg, #05060d) 60%, transparent 40%);
      font-family: var(--btfw-font-body, "Inter", sans-serif);
    }
    #${k}::backdrop {
      background: color-mix(in srgb, var(--btfw-theme-bg, #05060d) 55%, transparent 45%);
      backdrop-filter: blur(4px);
    }
    #${k} .btfw-confirm-body { padding: 22px 24px 8px; }
    #${k} h2 { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: 0.02em; }
    #${k} p {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.5;
      color: color-mix(in srgb, var(--btfw-theme-text, #e8ecfb) 82%, transparent 18%);
    }
    #${k} .btfw-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 18px 24px 22px;
    }
    #${k} button {
      padding: 8px 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.88rem;
    }
    #${k} .btfw-confirm-cancel {
      background: color-mix(in srgb, var(--btfw-theme-surface, #0b111d) 90%, transparent 10%);
      color: var(--btfw-theme-text, #e8ecfb);
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 26%, transparent 74%);
    }
    #${k} .btfw-confirm-ok {
      background: var(--btfw-theme-accent, #6d4df6);
      color: #fff;
    }
  `,document.head.appendChild(e)}function V(){z();let e=document.getElementById(k);if(e instanceof HTMLDialogElement)return e;let l=document.createElement("dialog");l.id=k;let a=document.createElement("div");a.className="btfw-confirm-body";let c=document.createElement("h2");c.dataset.role="title";let p=document.createElement("p");p.dataset.role="message",a.append(c,p);let n=document.createElement("div");n.className="btfw-confirm-actions";let h=document.createElement("button");h.type="button",h.className="btfw-confirm-cancel",h.dataset.role="cancel";let u=document.createElement("button");return u.type="button",u.className="btfw-confirm-ok",u.dataset.role="confirm",n.append(h,u),l.append(a,n),document.body.appendChild(l),l}function I(e){let{title:l="Discard changes?",message:a,confirmLabel:c="Discard",cancelLabel:p="Cancel"}=e;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(a):!1);let n=V();n.open&&n.close();let h=n.querySelector('[data-role="title"]'),u=n.querySelector('[data-role="message"]'),i=n.querySelector('[data-role="cancel"]'),f=n.querySelector('[data-role="confirm"]');return h&&(h.textContent=l),u&&(u.textContent=a),i&&(i.textContent=p),f&&(f.textContent=c),new Promise(s=>{let t=!1,o=()=>{i==null||i.removeEventListener("click",d),f==null||f.removeEventListener("click",r),n.removeEventListener("click",w),n.removeEventListener("close",g)},b=v=>{t||(t=!0,o(),s(v))},d=()=>{n.close()},r=()=>{n.returnValue="confirm",n.close()},w=v=>{v.target===n&&n.close()},g=()=>{b(n.returnValue==="confirm")};i==null||i.addEventListener("click",d),f==null||f.addEventListener("click",r),n.addEventListener("click",w),n.addEventListener("close",g),n.returnValue="",n.showModal(),f==null||f.focus()})}function T(e){return e.ok===!0}function H(e){return e.ok===!1}function M(e){return typeof HTMLElement=="function"&&e instanceof HTMLElement?!0:typeof e=="object"&&e!==null&&"closest"in e&&typeof e.closest=="function"&&"contains"in e&&typeof e.contains=="function"}function R(e){return typeof HTMLButtonElement=="function"&&e instanceof HTMLButtonElement?!0:M(e)&&"disabled"in e&&typeof e.disabled=="boolean"}function A(e,l){e.hidden=!l,l?(e.removeAttribute("aria-hidden"),e.removeAttribute("tabindex")):(e.setAttribute("aria-hidden","true"),e.setAttribute("tabindex","-1"))}function L(e,l,a){if(!M(e)||a.length===0)return!1;for(let c of a)try{let p=l.querySelector(c);if(M(p)&&p.contains(e)||e.closest(c))return!0}catch(p){}return!1}function W(e,l){l?(e.setAttribute("aria-busy","true"),e.disabled=!0):(e.removeAttribute("aria-busy"),e.disabled=!1)}function C(e,l){e&&(e.textContent=l)}function _(e){let{modal:l,applyButton:a,sections:c,ignoreRoots:p=[],confirmDiscard:n,statusEl:h}=e,u=new Map,i=new Set,f=new AbortController,s=!1,t=!1,o=[];function b(){return t}function d(){return t?new Promise(m=>{o.push(m)}):Promise.resolve()}function r(){u.clear(),i.clear();for(let m of c)u.set(m.id,m.snapshot());v()}function w(m){if(i.has(m.id))return!0;let y=u.get(m.id);return y===void 0?!0:m.snapshot()!==y}function g(){return c.some(m=>w(m))}function v(){let m=g();m?l.dataset.btfwDirty="1":delete l.dataset.btfwDirty,A(a,m),m||C(h,"")}function B(){s||t||(s=!0,queueMicrotask(()=>{s=!1,v()}))}function O(m){if(typeof m=="string"&&m.length>0)i.add(m);else for(let y of c)i.add(y.id);B()}async function $(){if(t)return{ok:!1,error:"Apply already in progress"};t=!0,W(a,!0),C(h,"");try{let m=c.filter(x=>w(x));if(m.length===0)return A(a,!1),{ok:!0};let y=null,E=0;for(let x of m)try{let S=await x.apply();T(S)?(u.set(x.id,x.snapshot()),i.delete(x.id)):(E+=1,y===null&&(y=S.error))}catch(S){E+=1;let j=S instanceof Error?S.message:"Unknown apply error";y===null&&(y=j)}if(v(),E>0){let x=y===null?`Failed to apply ${E} section(s)`:`${y}${E>1?` (+${E-1} more)`:""}`;return C(h,x),{ok:!1,error:x}}return C(h,"Changes applied"),{ok:!0}}finally{W(a,!1),t=!1;let m=o;o=[],m.forEach(y=>y())}}function P(){for(let m of c){let y=u.get(m.id);y!==void 0&&m.restore(y)}i.clear(),v()}async function q(){if(await d(),!g())return!0;if(n){if(!await n())return!1}else if(!await I({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return P(),!0}function D(m){L(m.target,l,p)||B()}l.addEventListener("input",D,{signal:f.signal,capture:!0}),l.addEventListener("change",D,{signal:f.signal,capture:!0});let N=m=>{g()&&(m.preventDefault(),m.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",N,{signal:f.signal}),r(),{isDirty:g,isApplying:b,recalculate:v,markDirty:O,captureBaseline:r,applyAll:$,tryClose:q,discard:P,dispose(){f.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:_,setApplyButtonVisible:A,eventTargetIsInsideIgnoredRoot:L,isHTMLElement:M,isHTMLButtonElement:R,isPersistSuccess:T,isPersistFailure:H}));BTFW.define("util:motion",[],async()=>{let e=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,l=!!(e&&e.matches);if(e){let t=o=>{l=!!o.matches};typeof e.addEventListener=="function"?e.addEventListener("change",t):typeof e.addListener=="function"&&e.addListener(t)}function a(){return l}function c(t){return t?t.split(",").reduce((o,b)=>{let d=parseFloat(b.trim());return Number.isNaN(d)?o:b.trim().endsWith("ms")?Math.max(o,d):Math.max(o,d*1e3)},0):0}function p(t){if(!t||typeof window=="undefined"||!window.getComputedStyle)return 0;let o=getComputedStyle(t),b=c(o.transitionDuration||"0s"),d=c(o.transitionDelay||"0s");return b+d}function n(t){return new Promise(o=>{if(!t||a()){o();return}let b=p(t);if(!b){o();return}let d=!1,r=()=>{d||(d=!0,t.removeEventListener("transitionend",w),o())},w=g=>{g&&g.target!==t||r()};t.addEventListener("transitionend",w),setTimeout(r,b+34)})}function h(t){typeof t=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(t)}):setTimeout(t,32))}function u(t){if(!t)return;let o=t.dataset.btfwModalState;if(o==="open"||o==="opening")return;t.dataset.btfwModalState="opening",t.removeAttribute("aria-hidden"),t.removeAttribute("hidden");let b=()=>{!t||t.dataset.btfwModalState!=="opening"||(t.classList.add("is-active"),t.dataset.btfwModalState="open")};a()?b():h(b)}async function i(t){if(!t)return;let o=t.dataset.btfwModalState;if(o==="closing"||o==="closed")return;t.dataset.btfwModalState="closing",t.setAttribute("aria-hidden","true");let b=t.querySelector(".modal-card, .modal-content, .modal-dialog"),d=t.querySelector(".modal-background, .modal-backdrop");t.classList.remove("is-active"),await Promise.all([n(b),n(d)]),t.dataset.btfwModalState==="closing"&&(t.dataset.btfwModalState="closed",t.setAttribute("hidden",""))}function f(t,o={}){if(!t)return;let b=t.dataset.btfwPopoverState;if(b==="open"||b==="opening")return;t.dataset.btfwPopoverState="opening",t.removeAttribute("hidden"),t.removeAttribute("aria-hidden");let d=o.backdrop;d&&(d.dataset.btfwPopoverState="opening",d.removeAttribute("hidden"),d.removeAttribute("aria-hidden"));let r=()=>{t.dataset.btfwPopoverState==="opening"&&(t.dataset.btfwPopoverState="open",d&&d.dataset.btfwPopoverState==="opening"&&(d.dataset.btfwPopoverState="open"))};a()?r():h(r)}async function s(t,o={}){if(!t)return;let b=t.dataset.btfwPopoverState;if(b==="closing"||b==="closed")return;t.dataset.btfwPopoverState="closing",t.setAttribute("aria-hidden","true");let d=[n(t)],r=o.backdrop;r&&(r.dataset.btfwPopoverState="closing",r.setAttribute("aria-hidden","true"),d.push(n(r))),await Promise.all(d),t.dataset.btfwPopoverState==="closing"&&(t.dataset.btfwPopoverState="closed",t.setAttribute("hidden","")),r&&r.dataset.btfwPopoverState==="closing"&&(r.dataset.btfwPopoverState="closed",r.setAttribute("hidden",""))}return{prefersReducedMotion:a,waitForTransition:n,openModal:u,closeModal:i,openPopover:f,closePopover:s}});BTFW.define("util:tmdb-proxy",[],async()=>{let e="https://empty-bar-d620.movies-storage-a.workers.dev",l="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function a(){var u,i,f,s,t,o,b;try{let d=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((u=d.movieSuggestions)==null?void 0:u.endpoint)||((f=(i=d.integrations)==null?void 0:i.movieSuggestions)==null?void 0:f.endpoint)||((t=(s=d.integrations)==null?void 0:s.movieRequests)==null?void 0:t.endpoint)||((b=(o=d.integrations)==null?void 0:o.tmdbProxy)==null?void 0:b.endpoint)||e).trim().replace(/\/+$/,"")}catch(d){return e}}function c(u,i){let f=u.startsWith("/")?u:`/${u}`,s=new URL(`${a()}${f}`);if(i)for(let[t,o]of Object.entries(i))o==null||o===""||s.searchParams.set(t,String(o));return s.toString()}async function p(u,i={}){let f=await fetch(c(u,i.params),{method:i.method||"GET",headers:i.body?{"Content-Type":"application/json"}:void 0,body:i.body?JSON.stringify(i.body):void 0,signal:i.signal}),s=await f.json().catch(()=>({}));if(!f.ok)throw new Error(s.error||`Worker request failed (${f.status})`);return s}async function n(u,i={},f={}){let s=String(u||"").replace(/^\/+/,"");return p(`/api/tmdb/${s}`,{params:i,signal:f.signal})}function h(){return!!a()}return{getWorkerBase:a,workerFetch:p,tmdbFetch:n,isAvailable:h,MISSING_PROXY_MSG:l}});BTFW.define("feature:styleCore",[],async()=>{let e="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",l="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",a="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/paper/bootstrap.min.css";function c(s){return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(t=>(t.getAttribute("href")||"").includes(s))}function p(s,t){if(document.getElementById(s)||c(t))return;let o=document.createElement("link");o.id=s,o.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[t]&&(o.integrity=window.BTFW.SRI[t],o.crossOrigin="anonymous"),o.href=t,document.head.appendChild(o)}function n(){!!!window.FontAwesome&&!c("font-awesome")&&p("btfw-fa-css",e)}function h(){c("bulma")||p("btfw-bulma-css",l)}function u(){c("bootstrap")||p("btfw-bootswatch-paper",a)}function i(){let s=document.querySelector('meta[name="viewport"]');s||(s=document.createElement("meta"),s.name="viewport",s.content="width=device-width, initial-scale=1",document.head.appendChild(s))}function f(){i(),n(),h(),u()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f(),{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let e="btfw:theme:mode",l="btfw:bulma:theme",a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),c;function p(){if(c)return c;let r=document.getElementById("btfw-bulma-dark-bridge");return r&&r.remove(),c=document.createElement("style"),c.id="btfw-theme-mode-bridge",document.head.appendChild(c),c}let n=`
/* --- Global dark scope --- */
html[data-btfw-theme="dark"] { color-scheme: dark; }
html[data-btfw-theme="dark"], html[data-btfw-theme="dark"] body {
  background: var(--btfw-color-bg);
  color: var(--btfw-color-text);
}
html[data-btfw-theme="dark"] body {
  background-image: none;
}

/* Text/surfaces (Bulma) */
html[data-btfw-theme="dark"] .content,
html[data-btfw-theme="dark"] .title,
html[data-btfw-theme="dark"] .subtitle,
html[data-btfw-theme="dark"] p,
html[data-btfw-theme="dark"] small {
  color: var(--btfw-color-text);
}

html[data-btfw-theme="dark"] .box,
html[data-btfw-theme="dark"] .card,
html[data-btfw-theme="dark"] .panel,
html[data-btfw-theme="dark"] .menu,
html[data-btfw-theme="dark"] .notification,
html[data-btfw-theme="dark"] .dropdown-content,
html[data-btfw-theme="dark"] .modal-card {
  background: color-mix(in srgb, var(--btfw-color-surface) 92%, transparent 8%) !important;
  color: var(--btfw-color-text) !important;
  border: 0 !important;
  box-shadow: var(--btfw-overlay-shadow);
  border-radius: var(--btfw-radius);
}

html[data-btfw-theme="dark"] .tabs.is-boxed li a { background:transparent; border-color:transparent; color:#c8d4e0; }
html[data-btfw-theme="dark"] .tabs.is-boxed li.is-active a {
  background: color-mix(in srgb, var(--btfw-color-panel) 82%, transparent 18%);
  color: var(--btfw-color-text);
  border-color: var(--btfw-surface-divider);
}

/* Inputs */
html[data-btfw-theme="dark"] .input,
html[data-btfw-theme="dark"] .textarea,
html[data-btfw-theme="dark"] .select select {
  background: color-mix(in srgb, var(--btfw-color-panel) 94%, transparent 6%) !important;
  color: var(--btfw-color-text) !important;
  border: 0 !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--btfw-surface-divider) 85%, transparent 15%) !important;
}
html[data-btfw-theme="dark"] .input::placeholder,
html[data-btfw-theme="dark"] .textarea::placeholder {
  color: color-mix(in srgb, var(--btfw-color-text) 55%, transparent 45%) !important;
}

/* Buttons */
html[data-btfw-theme="dark"] .button,
html[data-btfw-theme="dark"] .btn {
  background: color-mix(in srgb, var(--btfw-color-panel) 88%, transparent 12%);
  color: var(--btfw-color-text);
  border: 0;
}
html[data-btfw-theme="dark"] .button:hover,
html[data-btfw-theme="dark"] .btn:hover {
  filter: brightness(1.05);
}
html[data-btfw-theme="dark"] .button.is-link,
html[data-btfw-theme="dark"] .button.is-primary {
  background: color-mix(in srgb, var(--btfw-color-accent) 82%, transparent 18%) !important;
  border-color: color-mix(in srgb, var(--btfw-color-accent) 68%, transparent 32%) !important;
  color: var(--btfw-color-on-accent) !important;
}

/* Chat/stack surfaces you themed */
html[data-btfw-theme="dark"] #chatwrap,
html[data-btfw-theme="dark"] #messagebuffer { background:transparent; }

/* --- Bulma modal dark --- */
html[data-btfw-theme="dark"] .modal { z-index: 6000 !important; }
html[data-btfw-theme="dark"] .modal .modal-background { background-color: color-mix(in srgb, var(--btfw-color-bg) 88%, transparent 12%) !important; }
html[data-btfw-theme="dark"] .modal-card-head,
html[data-btfw-theme="dark"] .modal-card-foot {
  background-color: color-mix(in srgb, var(--btfw-color-panel) 92%, transparent 8%) !important;
  border-color: var(--btfw-surface-divider) !important;
  color: var(--btfw-color-text) !important;
}
html[data-btfw-theme="dark"] .modal-card {
  background-color: color-mix(in srgb, var(--btfw-color-surface) 94%, transparent 6%) !important;
  color: var(--btfw-color-text) !important;
}
html[data-btfw-theme="dark"] .modal-card-title { color: var(--btfw-color-text) !important; }

/* --- Bootstrap/CyTube modal bridge (skin Bootstrap modals to match Bulma dark) --- */
html[data-btfw-theme="dark"] .modal.fade,
html[data-btfw-theme="dark"] .modal.in,
html[data-btfw-theme="dark"] .modal { z-index: 6000 !important; }
html[data-btfw-theme="dark"] .modal-backdrop {
  background-color: color-mix(in srgb, var(--btfw-color-bg) 88%, transparent 12%) !important;
}
html[data-btfw-theme="dark"] .modal-dialog { max-width: 880px; }
html[data-btfw-theme="dark"] .modal-content {
  background-color: color-mix(in srgb, var(--btfw-color-surface) 94%, transparent 6%) !important;
  color: var(--btfw-color-text) !important;
  border:0 !important;
  box-shadow: var(--btfw-overlay-shadow);
}
@media screen and (min-width: 769px) {
  .modal-card, .modal-content {
    width: auto;
    max-width: 55rem;
  }
}
html[data-btfw-theme="dark"] .modal-header,
html[data-btfw-theme="dark"] .modal-footer {
  background-color: color-mix(in srgb, var(--btfw-color-panel) 92%, transparent 8%) !important;
  border-color: var(--btfw-surface-divider) !important;
  color: var(--btfw-color-text) !important;
}
html[data-btfw-theme="dark"] .modal-title { color: var(--btfw-color-text) !important; }
html[data-btfw-theme="dark"] .modal .btn-primary {
  background: color-mix(in srgb, var(--btfw-color-accent) 82%, transparent 18%) !important;
  border-color: color-mix(in srgb, var(--btfw-color-accent) 68%, transparent 32%) !important;
  color: var(--btfw-color-on-accent) !important;
}
html[data-btfw-theme="dark"] .modal .btn-default {
  background: color-mix(in srgb, var(--btfw-color-panel) 88%, transparent 12%) !important;
  border-color: color-mix(in srgb, var(--btfw-border) 70%, transparent 30%) !important;
  color: var(--btfw-color-text) !important;
}
/* Scroll lock (Bootstrap) */
body.modal-open { overflow: hidden; }
`;function h(r){let w=r==="dark"?"dark":"light",g=document.querySelector('meta[name="color-scheme"]');g||(g=document.createElement("meta"),g.setAttribute("name","color-scheme"),document.head.appendChild(g)),g.setAttribute("content",w)}function u(){try{let r=localStorage.getItem(e);return r||localStorage.getItem(l)||"dark"}catch(r){return"dark"}}function i(r){try{localStorage.setItem(e,r)}catch(w){}}function f(){return a&&a.matches?"dark":"light"}function s(r){let w=r==="auto"?f():r||"dark",g=document.documentElement;g.setAttribute("data-btfw-theme",w),g.classList.toggle("btfw-theme-dark",w==="dark"),h(w);let v=p();v.textContent=w==="dark"?n:""}function t(r){let w=r==="auto"||r==="dark"||r==="light"?r:"dark";i(w),s(w)}function o(){return u()}function b(){!a||!a.addEventListener||a.addEventListener("change",()=>{o()==="auto"&&s("auto")})}function d(){s(u()),b()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d(),{name:"feature:themeMode",setTheme:t,getTheme:o}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async e=>e.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async e=>e.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async({init:e})=>{let l={videoColumnPx:null,videoColumnRatio:null,chatSidePref:"right",isVertical:!1,navAutohideActive:!1,navAutohideHidden:!1},a=e("util:layout-columns",{state:l}),c=e("util:layout-viewport",{state:l,columns:a});function p(){}function n(){a.makeResizable()}return a.onColumnTemplateApplied=p,c.onCommitFinalize=n,a.loadVideoColumnWidth(),a.applyColumnTemplate(),c.ensureShell(),c.commitLayout(),{name:"feature:layout",state:l}});})();
