/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var _="btfw-confirm-dialog",ct="btfw-confirm-dialog-style";function xt(){if(typeof document=="undefined"||document.getElementById(ct))return;let o=document.createElement("style");o.id=ct,o.textContent=`
    #${_} {
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
    #${_}::backdrop {
      background: color-mix(in srgb, var(--btfw-theme-bg, #05060d) 55%, transparent 45%);
      backdrop-filter: blur(4px);
    }
    #${_} .btfw-confirm-body { padding: 22px 24px 8px; }
    #${_} h2 { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: 0.02em; }
    #${_} p {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.5;
      color: color-mix(in srgb, var(--btfw-theme-text, #e8ecfb) 82%, transparent 18%);
    }
    #${_} .btfw-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 18px 24px 22px;
    }
    #${_} button {
      padding: 8px 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.88rem;
    }
    #${_} .btfw-confirm-cancel {
      background: color-mix(in srgb, var(--btfw-theme-surface, #0b111d) 90%, transparent 10%);
      color: var(--btfw-theme-text, #e8ecfb);
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 26%, transparent 74%);
    }
    #${_} .btfw-confirm-ok {
      background: var(--btfw-theme-accent, #6d4df6);
      color: #fff;
    }
  `,document.head.appendChild(o)}function St(){xt();let o=document.getElementById(_);if(o instanceof HTMLDialogElement)return o;let c=document.createElement("dialog");c.id=_;let f=document.createElement("div");f.className="btfw-confirm-body";let v=document.createElement("h2");v.dataset.role="title";let E=document.createElement("p");E.dataset.role="message",f.append(v,E);let u=document.createElement("div");u.className="btfw-confirm-actions";let S=document.createElement("button");S.type="button",S.className="btfw-confirm-cancel",S.dataset.role="cancel";let h=document.createElement("button");return h.type="button",h.className="btfw-confirm-ok",h.dataset.role="confirm",u.append(S,h),c.append(f,u),document.body.appendChild(c),c}function ut(o){let{title:c="Discard changes?",message:f,confirmLabel:v="Discard",cancelLabel:E="Cancel"}=o;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(f):!1);let u=St();u.open&&u.close();let S=u.querySelector('[data-role="title"]'),h=u.querySelector('[data-role="message"]'),d=u.querySelector('[data-role="cancel"]'),m=u.querySelector('[data-role="confirm"]');return S&&(S.textContent=c),h&&(h.textContent=f),d&&(d.textContent=E),m&&(m.textContent=v),new Promise(p=>{let t=!1,n=()=>{d==null||d.removeEventListener("click",i),m==null||m.removeEventListener("click",s),u.removeEventListener("click",w),u.removeEventListener("close",x)},l=k=>{t||(t=!0,n(),p(k))},i=()=>{u.close()},s=()=>{u.returnValue="confirm",u.close()},w=k=>{k.target===u&&u.close()},x=()=>{l(u.returnValue==="confirm")};d==null||d.addEventListener("click",i),m==null||m.addEventListener("click",s),u.addEventListener("click",w),u.addEventListener("close",x),u.returnValue="",u.showModal(),m==null||m.focus()})}function at(o){return o.ok===!0}function ft(o){return o.ok===!1}function U(o){return typeof HTMLElement=="function"&&o instanceof HTMLElement?!0:typeof o=="object"&&o!==null&&"closest"in o&&typeof o.closest=="function"&&"contains"in o&&typeof o.contains=="function"}function pt(o){return typeof HTMLButtonElement=="function"&&o instanceof HTMLButtonElement?!0:U(o)&&"disabled"in o&&typeof o.disabled=="boolean"}function et(o,c){o.hidden=!c,c?(o.removeAttribute("aria-hidden"),o.removeAttribute("tabindex")):(o.setAttribute("aria-hidden","true"),o.setAttribute("tabindex","-1"))}function it(o,c,f){if(!U(o)||f.length===0)return!1;for(let v of f)try{let E=c.querySelector(v);if(U(E)&&E.contains(o)||o.closest(v))return!0}catch(E){}return!1}function mt(o,c){c?(o.setAttribute("aria-busy","true"),o.disabled=!0):(o.removeAttribute("aria-busy"),o.disabled=!1)}function tt(o,c){o&&(o.textContent=c)}function bt(o){let{modal:c,applyButton:f,sections:v,ignoreRoots:E=[],confirmDiscard:u,statusEl:S}=o,h=new Map,d=new Set,m=new AbortController,p=!1,t=!1,n=[];function l(){return t}function i(){return t?new Promise(g=>{n.push(g)}):Promise.resolve()}function s(){h.clear(),d.clear();for(let g of v)h.set(g.id,g.snapshot());k()}function w(g){if(d.has(g.id))return!0;let M=h.get(g.id);return M===void 0?!0:g.snapshot()!==M}function x(){return v.some(g=>w(g))}function k(){let g=x();g?c.dataset.btfwDirty="1":delete c.dataset.btfwDirty,et(f,g),g||tt(S,"")}function T(){p||t||(p=!0,queueMicrotask(()=>{p=!1,k()}))}function O(g){if(typeof g=="string"&&g.length>0)d.add(g);else for(let M of v)d.add(M.id);T()}async function $(){if(t)return{ok:!1,error:"Apply already in progress"};t=!0,mt(f,!0),tt(S,"");try{let g=v.filter(B=>w(B));if(g.length===0)return et(f,!1),{ok:!0};let M=null,V=0;for(let B of g)try{let q=await B.apply();at(q)?(h.set(B.id,B.snapshot()),d.delete(B.id)):(V+=1,M===null&&(M=q.error))}catch(q){V+=1;let J=q instanceof Error?q.message:"Unknown apply error";M===null&&(M=J)}if(k(),V>0){let B=M===null?`Failed to apply ${V} section(s)`:`${M}${V>1?` (+${V-1} more)`:""}`;return tt(S,B),{ok:!1,error:B}}return tt(S,"Changes applied"),{ok:!0}}finally{mt(f,!1),t=!1;let g=n;n=[],g.forEach(M=>M())}}function H(){for(let g of v){let M=h.get(g.id);M!==void 0&&g.restore(M)}d.clear(),k()}async function W(){if(await i(),!x())return!0;if(u){if(!await u())return!1}else if(!await ut({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return H(),!0}function N(g){it(g.target,c,E)||T()}c.addEventListener("input",N,{signal:m.signal,capture:!0}),c.addEventListener("change",N,{signal:m.signal,capture:!0});let z=g=>{x()&&(g.preventDefault(),g.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",z,{signal:m.signal}),s(),{isDirty:x,isApplying:l,recalculate:k,markDirty:O,captureBaseline:s,applyAll:$,tryClose:W,discard:H,dispose(){m.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:bt,setApplyButtonVisible:et,eventTargetIsInsideIgnoredRoot:it,isHTMLElement:U,isHTMLButtonElement:pt,isPersistSuccess:at,isPersistFailure:ft}));BTFW.define("util:motion",[],async()=>{let o=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,c=!!(o&&o.matches);if(o){let t=n=>{c=!!n.matches};typeof o.addEventListener=="function"?o.addEventListener("change",t):typeof o.addListener=="function"&&o.addListener(t)}function f(){return c}function v(t){return t?t.split(",").reduce((n,l)=>{let i=parseFloat(l.trim());return Number.isNaN(i)?n:l.trim().endsWith("ms")?Math.max(n,i):Math.max(n,i*1e3)},0):0}function E(t){if(!t||typeof window=="undefined"||!window.getComputedStyle)return 0;let n=getComputedStyle(t),l=v(n.transitionDuration||"0s"),i=v(n.transitionDelay||"0s");return l+i}function u(t){return new Promise(n=>{if(!t||f()){n();return}let l=E(t);if(!l){n();return}let i=!1,s=()=>{i||(i=!0,t.removeEventListener("transitionend",w),n())},w=x=>{x&&x.target!==t||s()};t.addEventListener("transitionend",w),setTimeout(s,l+34)})}function S(t){typeof t=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(t)}):setTimeout(t,32))}function h(t){if(!t)return;let n=t.dataset.btfwModalState;if(n==="open"||n==="opening")return;t.dataset.btfwModalState="opening",t.removeAttribute("aria-hidden"),t.removeAttribute("hidden");let l=()=>{!t||t.dataset.btfwModalState!=="opening"||(t.classList.add("is-active"),t.dataset.btfwModalState="open")};f()?l():S(l)}async function d(t){if(!t)return;let n=t.dataset.btfwModalState;if(n==="closing"||n==="closed")return;t.dataset.btfwModalState="closing",t.setAttribute("aria-hidden","true");let l=t.querySelector(".modal-card, .modal-content, .modal-dialog"),i=t.querySelector(".modal-background, .modal-backdrop");t.classList.remove("is-active"),await Promise.all([u(l),u(i)]),t.dataset.btfwModalState==="closing"&&(t.dataset.btfwModalState="closed",t.setAttribute("hidden",""))}function m(t,n={}){if(!t)return;let l=t.dataset.btfwPopoverState;if(l==="open"||l==="opening")return;t.dataset.btfwPopoverState="opening",t.removeAttribute("hidden"),t.removeAttribute("aria-hidden");let i=n.backdrop;i&&(i.dataset.btfwPopoverState="opening",i.removeAttribute("hidden"),i.removeAttribute("aria-hidden"));let s=()=>{t.dataset.btfwPopoverState==="opening"&&(t.dataset.btfwPopoverState="open",i&&i.dataset.btfwPopoverState==="opening"&&(i.dataset.btfwPopoverState="open"))};f()?s():S(s)}async function p(t,n={}){if(!t)return;let l=t.dataset.btfwPopoverState;if(l==="closing"||l==="closed")return;t.dataset.btfwPopoverState="closing",t.setAttribute("aria-hidden","true");let i=[u(t)],s=n.backdrop;s&&(s.dataset.btfwPopoverState="closing",s.setAttribute("aria-hidden","true"),i.push(u(s))),await Promise.all(i),t.dataset.btfwPopoverState==="closing"&&(t.dataset.btfwPopoverState="closed",t.setAttribute("hidden","")),s&&s.dataset.btfwPopoverState==="closing"&&(s.dataset.btfwPopoverState="closed",s.setAttribute("hidden",""))}return{prefersReducedMotion:f,waitForTransition:u,openModal:h,closeModal:d,openPopover:m,closePopover:p}});BTFW.define("util:tmdb-proxy",[],async()=>{let o="https://empty-bar-d620.movies-storage-a.workers.dev",c="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function f(){var h,d,m,p,t,n,l;try{let i=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((h=i.movieSuggestions)==null?void 0:h.endpoint)||((m=(d=i.integrations)==null?void 0:d.movieSuggestions)==null?void 0:m.endpoint)||((t=(p=i.integrations)==null?void 0:p.movieRequests)==null?void 0:t.endpoint)||((l=(n=i.integrations)==null?void 0:n.tmdbProxy)==null?void 0:l.endpoint)||o).trim().replace(/\/+$/,"")}catch(i){return o}}function v(h,d){let m=h.startsWith("/")?h:`/${h}`,p=new URL(`${f()}${m}`);if(d)for(let[t,n]of Object.entries(d))n==null||n===""||p.searchParams.set(t,String(n));return p.toString()}async function E(h,d={}){let m=await fetch(v(h,d.params),{method:d.method||"GET",headers:d.body?{"Content-Type":"application/json"}:void 0,body:d.body?JSON.stringify(d.body):void 0,signal:d.signal}),p=await m.json().catch(()=>({}));if(!m.ok)throw new Error(p.error||`Worker request failed (${m.status})`);return p}async function u(h,d={},m={}){let p=String(h||"").replace(/^\/+/,"");return E(`/api/tmdb/${p}`,{params:d,signal:m.signal})}function S(){return!!f()}return{getWorkerBase:f,workerFetch:E,tmdbFetch:u,isAvailable:S,MISSING_PROXY_MSG:c}});BTFW.define("feature:styleCore",[],async()=>{let o="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",c="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",f="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/paper/bootstrap.min.css";function v(p){return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(t=>(t.getAttribute("href")||"").includes(p))}function E(p,t){if(document.getElementById(p)||v(t))return;let n=document.createElement("link");n.id=p,n.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[t]&&(n.integrity=window.BTFW.SRI[t],n.crossOrigin="anonymous"),n.href=t,document.head.appendChild(n)}function u(){!!!window.FontAwesome&&!v("font-awesome")&&E("btfw-fa-css",o)}function S(){v("bulma")||E("btfw-bulma-css",c)}function h(){v("bootstrap")||E("btfw-bootswatch-paper",f)}function d(){let p=document.querySelector('meta[name="viewport"]');p||(p=document.createElement("meta"),p.name="viewport",p.content="width=device-width, initial-scale=1",document.head.appendChild(p))}function m(){d(),u(),S(),h()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let o="btfw:theme:mode",c="btfw:bulma:theme",f=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),v;function E(){if(v)return v;let s=document.getElementById("btfw-bulma-dark-bridge");return s&&s.remove(),v=document.createElement("style"),v.id="btfw-theme-mode-bridge",document.head.appendChild(v),v}let u=`
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
`;function S(s){let w=s==="dark"?"dark":"light",x=document.querySelector('meta[name="color-scheme"]');x||(x=document.createElement("meta"),x.setAttribute("name","color-scheme"),document.head.appendChild(x)),x.setAttribute("content",w)}function h(){try{let s=localStorage.getItem(o);return s||localStorage.getItem(c)||"dark"}catch(s){return"dark"}}function d(s){try{localStorage.setItem(o,s)}catch(w){}}function m(){return f&&f.matches?"dark":"light"}function p(s){let w=s==="auto"?m():s||"dark",x=document.documentElement;x.setAttribute("data-btfw-theme",w),x.classList.toggle("btfw-theme-dark",w==="dark"),S(w);let k=E();k.textContent=w==="dark"?u:""}function t(s){let w=s==="auto"||s==="dark"||s==="light"?s:"dark";d(w),p(w)}function n(){return h()}function l(){!f||!f.addEventListener||f.addEventListener("change",()=>{n()==="auto"&&p("auto")})}function i(){p(h()),l()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i(),{name:"feature:themeMode",setTheme:t,getTheme:n}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async o=>o.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async o=>o.init("feature:themeMode"));var st="btfw-navhost",D=520;var F=360,ot=20,ht=900,wt=1100,gt=40,K=.35,Y=.78,G=.62,Q=180,lt="btfw:grid:leftPx",vt="btfw:layout:chatSide",dt="btfw:grid:videoRatio";function yt(o){function c(t){return Math.min(Y,Math.max(K,t))}function f(t){var s;let n=(s=t==null?void 0:t.getBoundingClientRect)==null?void 0:s.call(t),l=(n==null?void 0:n.width)||window.innerWidth||0,i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(l-i,D+F)}function v(t){let n=f(t),l=o.state.videoColumnRatio!==null?o.state.videoColumnRatio:G;if(n>0){let i=D/n,s=(n-F)/n;l=Math.min(Math.max(l,i),s)}return c(l)}function E(t){o.state.videoColumnRatio=c(t),localStorage.setItem(dt,String(o.state.videoColumnRatio))}function u(t){let n=c(t),l=1-n,i=100;return{video:`minmax(0, ${Math.max(1,Math.round(n*i))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(l*i))}fr)`}}function S(){return localStorage.getItem(vt)==="left"?"left":"right"}function h(){let t=parseFloat(localStorage.getItem(dt)||"");if(!isNaN(t)&&t>=K&&t<=Y){o.state.videoColumnRatio=t;return}let n=parseInt(localStorage.getItem(lt)||"",10);if(!isNaN(n)&&n>=D){o.state.videoColumnPx=n;let l=Math.max(window.innerWidth-ot,D+F);E(n/l)}}function d(){let t=document.getElementById("btfw-grid");if(!t)return;if(o.state.isVertical){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:n,chat:l}=u(v(t)),i=o.state.chatSidePref==="left"?`${l} var(--btfw-split-width, 8px) ${n}`:`${n} var(--btfw-split-width, 8px) ${l}`;t.style.gridTemplateColumns=i,t.classList.toggle("btfw-grid--chat-left",o.state.chatSidePref==="left"),t.classList.toggle("btfw-grid--chat-right",o.state.chatSidePref!=="left"),o.onColumnTemplateApplied()}function m(t){if(!Number.isFinite(t))return;let n=document.getElementById("btfw-grid"),l=f(n),i=Math.min(Math.max(t,D),l-F);o.state.videoColumnPx=i,E(i/l),localStorage.setItem(lt,String(i)),d()}function p(){let t=document.getElementById("btfw-grid"),n=document.getElementById("btfw-vsplit");if(!t||!n){console.warn("[BTFW] Resizer elements not found.");return}if(n.dataset.btfwResizeWired)return;n.dataset.btfwResizeWired="true";let l=!1,i=null;function s(k){if(!l||i!==null&&k.pointerId!==i)return;if(o.state.isVertical){w();return}let T=t.getBoundingClientRect(),$=n.getBoundingClientRect().width||parseFloat(getComputedStyle(n).width)||6,H;if(o.state.chatSidePref==="left"){let W=k.clientX-T.left,N=Math.max(W-$/2,0),z=T.width-N-$;if(z<D||N<F)return;H=z}else{H=k.clientX-T.left;let W=T.width-H-$;if(H<D||W<F)return}Number.isFinite(H)&&m(H)}function w(){if(!l)return;let k=i;l=!1,i=null,document.body.classList.remove("btfw-resizing"),n.removeEventListener("pointermove",s),n.removeEventListener("pointerup",w),n.removeEventListener("pointercancel",w),window.removeEventListener("blur",w),document.removeEventListener("visibilitychange",x);try{k!==null&&typeof n.releasePointerCapture=="function"&&n.releasePointerCapture(k)}catch(T){}o.onColumnTemplateApplied()}function x(){document.visibilityState==="hidden"&&w()}n.addEventListener("pointerdown",k=>{if(!(o.state.isVertical||k.button!==0)){l=!0,i=k.pointerId,k.preventDefault(),document.body.classList.add("btfw-resizing");try{n.setPointerCapture(k.pointerId)}catch(T){}n.addEventListener("pointermove",s),n.addEventListener("pointerup",w),n.addEventListener("pointercancel",w),window.addEventListener("blur",w),document.addEventListener("visibilitychange",x)}})}return{getStoredChatSide:S,loadVideoColumnWidth:h,applyColumnTemplate:d,setVideoColumnWidth:m,makeResizable:p}}function Et(o){function c(e){return Math.min(Y,Math.max(K,e))}function f(){var e;return((e=window.visualViewport)==null?void 0:e.height)||window.innerHeight||1440}function v(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(r=>r.dataset.docked==="true"):!0}function E(){let e=document.getElementById("btfw-video-overlay");return!e||getComputedStyle(e).display==="none"?0:e.offsetHeight||0}function u(){let e=document.documentElement,r=parseFloat(getComputedStyle(e).getPropertyValue("--btfw-nav-real-height"))||48;return o.state.navAutohideActive&&o.state.navAutohideHidden?0:r}function S(){let e=f(),r=u(),a=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,e-r-a*2)}function h(e){return Math.max(0,Math.round(e/2)*2)}function d(){let e=document.documentElement,r=u(),a=parseFloat(getComputedStyle(e).getPropertyValue("--btfw-gap"))||10,b=S();e.style.setProperty("--btfw-top-effective",`${r}px`),e.style.setProperty("--btfw-primary-budget",`${Math.floor(b)}px`),e.style.setProperty("--btfw-primary-row-h",`${Math.floor(b)}px`);let I=document.getElementById("btfw-leftpad"),C=(o.state.isVertical?Math.max(0,window.innerWidth-a*2):(I==null?void 0:I.getBoundingClientRect().width)||window.innerWidth*G)*(9/16);if(!o.state.isVertical){let X=b;e.style.setProperty("--btfw-video-stage-h",`${Math.floor(X)}px`),e.style.setProperty("--btfw-stack-max-h","none"),e.style.setProperty("--btfw-video-max-h","none");return}e.style.setProperty("--btfw-stack-max-h","none");let L=h(E()),A=h(Math.floor(b/2)),R=Math.max(Q,A-L);R=h(Math.min(R,C));let P=R+L,Z=A;e.style.setProperty("--btfw-video-chrome-h",`${L}px`),e.style.setProperty("--btfw-videowrap-max-h",`${R}px`),e.style.setProperty("--btfw-vertical-video-row-h",`${P}px`),e.style.setProperty("--btfw-vertical-chat-row-h",`${Z}px`),e.style.setProperty("--btfw-video-row-h",`${P}px`),e.style.setProperty("--btfw-video-max-h",`${P}px`)}function m(){if(!o.state.isVertical)return;let e=f(),r=2,a=document.documentElement,b=document.getElementById("btfw-chatcol"),I=document.getElementById("btfw-leftpad");if(!b||!I)return;let y=b.getBoundingClientRect().bottom;if(y<=e-r)return;let C=y-(e-r),L=E(),A=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-chat-row-h"))||b.getBoundingClientRect().height||0,R=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(a).getPropertyValue("--btfw-video-row-h"))||0,P=Math.max(0,R-L),Z=X=>{let j=Math.max(Q,Math.floor(X)),rt=j+L;a.style.setProperty("--btfw-videowrap-max-h",`${j}px`),a.style.setProperty("--btfw-vertical-video-row-h",`${rt}px`),a.style.setProperty("--btfw-video-row-h",`${rt}px`),a.style.setProperty("--btfw-video-max-h",`${rt}px`)};if(A>180){let X=Math.min(C,A-180);a.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(A-X)}px`);let j=C-X;j>0&&P>Q&&Z(P-j),t();return}P>Q&&(Z(P-C),t())}function p(e={}){var y;let r=document.getElementById("btfw-grid"),a=document.getElementById("btfw-leftpad"),b=document.getElementById("btfw-stack"),I=(y=e.allHidden)!=null?y:v();r&&r.classList.toggle("btfw-grid--stack-hidden",I),a&&a.classList.toggle("btfw-leftpad--stack-hidden",I),b&&b.classList.toggle("btfw-stack--all-hidden",I)}function t(){let e=document.getElementById("videowrap");if(!e)return;e.querySelectorAll("iframe, video, .vjs-tech").forEach(a=>{a.style.removeProperty("height"),a.style.removeProperty("width"),a.style.removeProperty("maxHeight"),a.style.removeProperty("maxWidth"),a.style.removeProperty("top"),a.style.removeProperty("left"),a.style.removeProperty("right"),a.style.removeProperty("bottom"),a.style.removeProperty("transform")});let r=e.querySelector(".video-js");if(r){r.style.removeProperty("padding-top"),r.style.removeProperty("height"),r.style.removeProperty("width");let a=r.player||r.player_||(window.videojs?window.videojs(r.id):null);if(a)try{let b=a;typeof b.trigger=="function"&&b.trigger("componentresize"),b.tech_&&typeof b.tech_.trigger=="function"&&b.tech_.trigger("resize"),typeof b.resize=="function"&&b.resize()}catch(b){}}}function n(){let e=window.innerWidth,r=o.state.videoColumnRatio!==null?o.state.videoColumnRatio:G,b=Math.max(D,e*c(r))+F+ot;return Math.min(Math.max(b,ht),wt)}function l(){let e=window.innerWidth,r=n();return o.state.isVertical?e<r+gt:e<r}function i(){let e=document.getElementById("btfw-stack");if(!e)return;if(o.state.isVertical){e.classList.add("btfw-stack--below-chat"),e.classList.remove("btfw-stack--in-chat");let C=document.getElementById("btfw-grid"),L=document.getElementById("btfw-chatcol");if(!C||!L)return;(e.parentElement!==C||e.previousElementSibling!==L)&&(L.nextSibling?C.insertBefore(e,L.nextSibling):C.appendChild(e));return}e.classList.remove("btfw-stack--below-chat"),e.classList.remove("btfw-stack--in-chat");let r=document.getElementById("btfw-leftpad");if(!r)return;let a=document.getElementById("btfw-video-stage"),b=document.getElementById("videowrap"),I=document.getElementById("btfw-video-overlay"),y=a||(I&&I.parentElement===r?I:b);y&&y.parentElement===r?y.nextSibling!==e&&(y.nextSibling?r.insertBefore(e,y.nextSibling):r.appendChild(e)):e.parentElement!==r&&r.appendChild(e)}function s(){let e=document.getElementById("btfw-grid");if(!e)return;let r=l();r!==o.state.isVertical?(o.state.isVertical=r,e.classList.toggle("btfw-grid--vertical",r),e.classList.toggle("btfw-grid--desktop-scroll",!r),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",r),document.body.classList.toggle("btfw-desktop-scroll-enabled",!r)),i(),O(),setTimeout(()=>{O();try{window.dispatchEvent(new Event("resize"))}catch(a){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:r}}))):i(),e.classList.toggle("btfw-grid--desktop-scroll",!r),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!r),o.columns.applyColumnTemplate(),w(),d(),p(),O(),W(),requestAnimationFrame(()=>{d(),m(),O()})}function w(){let e=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),a=(e?e.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",a),document.documentElement.style.setProperty("--btfw-top",a);let b=o.state.navAutohideActive&&o.state.navAutohideHidden?"0px":a;document.documentElement.style.setProperty("--btfw-top-effective",b);let I=document.getElementById("btfw-chatcol");I&&(I.style.removeProperty("top"),I.style.removeProperty("height"))}let x=0,k=0,T=0;function O(){k||(k=requestAnimationFrame(()=>{k=0,t()}))}function $(){x||(x=requestAnimationFrame(()=>{x=0,o.state.isVertical&&(d(),m(),O())}))}function H(){T||(T=requestAnimationFrame(()=>{T=0,s()}))}function W(){let e=document.getElementById("btfw-video-overlay");if(!e||e._btfwChromeObs)return;e._btfwChromeObs=!0,new ResizeObserver(()=>{o.state.isVertical&&$()}).observe(e)}let N=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function z(e){e&&(Array.from(e.classList||[]).forEach(r=>{N.test(r)&&e.classList.remove(r)}),e.querySelectorAll("[class]").forEach(r=>{Array.from(r.classList).forEach(a=>{N.test(a)&&r.classList.remove(a)})}))}function g(){let e=document.getElementById("videowrap-header");if(!e){console.log("[layout] No videowrap-header found");return}let r=e.querySelector("#currenttitle"),a=document.querySelector("#chatwrap .btfw-chat-topbar");if(a){let b=a.querySelector("#btfw-nowplaying-slot");b||(b=document.createElement("div"),b.id="btfw-nowplaying-slot",b.className="btfw-chat-title",a.innerHTML="",a.appendChild(b)),r?(b.appendChild(r),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}e.remove()}function M(e){if(!e)return;let r=document.getElementById("btfw-video-stage");r?r.getAttribute("data-testid")||r.setAttribute("data-testid","btfw-video-stage"):(r=document.createElement("div"),r.id="btfw-video-stage",r.className="btfw-video-stage",r.setAttribute("data-testid","btfw-video-stage")),r.parentElement!==e&&e.insertBefore(r,e.firstChild);let a=document.getElementById("videowrap"),b=document.getElementById("btfw-video-overlay");a&&a.parentElement!==r&&r.appendChild(a),b&&b.parentElement!==r&&r.appendChild(b)}function V(){let e=document.getElementById("wrap")||document.body,r=document.getElementById("videowrap"),a=document.getElementById("chatwrap"),b=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let y=document.getElementById("btfw-leftpad"),C=document.getElementById("btfw-chatcol");C&&!C.getAttribute("data-testid")&&C.setAttribute("data-testid","btfw-chatcol");let L=document.getElementById("videowrap"),A=document.getElementById("chatwrap"),R=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),P=document.getElementById("btfw-grid");P&&!P.getAttribute("data-testid")&&P.setAttribute("data-testid","btfw-grid"),nt(P),L&&!y.contains(L)&&y.appendChild(L),R&&!y.contains(R)&&y.appendChild(R),A&&!C.contains(A)&&C.appendChild(A)}else{let y=document.createElement("div");y.id="btfw-grid",y.setAttribute("data-testid","btfw-grid");let C=document.createElement("div");C.id="btfw-leftpad";let L=document.createElement("aside");L.id="btfw-chatcol",L.setAttribute("data-testid","btfw-chatcol"),r&&C.appendChild(r),b&&C.appendChild(b),a&&L.appendChild(a);let A=document.createElement("div");A.id="btfw-vsplit",nt(y),y.appendChild(C),y.appendChild(A),y.appendChild(L),y.style.opacity="0",e.prepend(y)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(y=>z(document.getElementById(y))),g();let I=document.getElementById("btfw-leftpad");M(I),i()}function B(){let e=document.getElementById("btfw-grid");e&&(e.classList.add("btfw-loaded"),e.style.opacity="1"),s(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function q(){V();let e=()=>{w(),o.onCommitFinalize(),B()};e(),document.readyState!=="complete"&&window.addEventListener("load",e,{once:!0})}function J(){let e=["nav.navbar",".navbar-fixed-top","#navbar"];for(let r of e){let a=document.querySelector(r);if(a)return a}return null}function nt(e){if(!e)return;let r=J();if(!r)return;let a=document.getElementById(st);a||(a=document.createElement("div"),a.id=st,a.className="btfw-navhost"),r.parentElement!==a&&a.appendChild(r),a.parentElement!==e&&e.insertBefore(a,e.firstChild)}function kt(e,r){o.state.navAutohideActive=!!e,o.state.navAutohideHidden=!!r,w(),d(),t(),requestAnimationFrame(m)}return{setTop:w,updateResponsiveLayout:s,applyViewportBudget:d,alignPrimaryRowBottoms:m,refreshVideoSizing:t,placeStackInLayout:i,syncStackLayoutClasses:p,shouldUseVerticalLayout:l,computeStackEnterThreshold:n,wireVideoChromeObserver:W,ensureShell:V,finishLayout:B,commitLayout:q,ensureNavHost:nt,findNavbarElement:J,onNavbarAutohide:kt}}BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let o={videoColumnPx:null,videoColumnRatio:null,chatSidePref:"right",isVertical:!1,navAutohideActive:!1,navAutohideHidden:!1},c=yt({state:o,onColumnTemplateApplied:()=>{}}),f=Et({state:o,columns:c,onCommitFinalize:()=>c.makeResizable()});return c.loadVideoColumnWidth(),o.chatSidePref=c.getStoredChatSide(),c.applyColumnTemplate(),f.ensureShell(),f.commitLayout(),{name:"feature:layout",state:o,commitLayout:f.commitLayout}});})();
