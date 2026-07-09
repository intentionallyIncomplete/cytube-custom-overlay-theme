/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("util:motion",[],async()=>{let h=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,_=!!(h&&h.matches);if(h){let r=d=>{_=!!d.matches};typeof h.addEventListener=="function"?h.addEventListener("change",r):typeof h.addListener=="function"&&h.addListener(r)}function l(){return _}function S(r){return r?r.split(",").reduce((d,f)=>{let c=parseFloat(f.trim());return Number.isNaN(c)?d:f.trim().endsWith("ms")?Math.max(d,c):Math.max(d,c*1e3)},0):0}function I(r){if(!r||typeof window=="undefined"||!window.getComputedStyle)return 0;let d=getComputedStyle(r),f=S(d.transitionDuration||"0s"),c=S(d.transitionDelay||"0s");return f+c}function B(r){return new Promise(d=>{if(!r||l()){d();return}let f=I(r);if(!f){d();return}let c=!1,a=()=>{c||(c=!0,r.removeEventListener("transitionend",u),d())},u=g=>{g&&g.target!==r||a()};r.addEventListener("transitionend",u),setTimeout(a,f+34)})}function A(r){typeof r=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(r)}):setTimeout(r,32))}function v(r){if(!r)return;let d=r.dataset.btfwModalState;if(d==="open"||d==="opening")return;r.dataset.btfwModalState="opening",r.removeAttribute("aria-hidden"),r.removeAttribute("hidden");let f=()=>{!r||r.dataset.btfwModalState!=="opening"||(r.classList.add("is-active"),r.dataset.btfwModalState="open")};l()?f():A(f)}async function w(r){if(!r)return;let d=r.dataset.btfwModalState;if(d==="closing"||d==="closed")return;r.dataset.btfwModalState="closing",r.setAttribute("aria-hidden","true");let f=r.querySelector(".modal-card, .modal-content, .modal-dialog"),c=r.querySelector(".modal-background, .modal-backdrop");r.classList.remove("is-active"),await Promise.all([B(f),B(c)]),r.dataset.btfwModalState==="closing"&&(r.dataset.btfwModalState="closed",r.setAttribute("hidden",""))}function E(r,d={}){if(!r)return;let f=r.dataset.btfwPopoverState;if(f==="open"||f==="opening")return;r.dataset.btfwPopoverState="opening",r.removeAttribute("hidden"),r.removeAttribute("aria-hidden");let c=d.backdrop;c&&(c.dataset.btfwPopoverState="opening",c.removeAttribute("hidden"),c.removeAttribute("aria-hidden"));let a=()=>{r.dataset.btfwPopoverState==="opening"&&(r.dataset.btfwPopoverState="open",c&&c.dataset.btfwPopoverState==="opening"&&(c.dataset.btfwPopoverState="open"))};l()?a():A(a)}async function y(r,d={}){if(!r)return;let f=r.dataset.btfwPopoverState;if(f==="closing"||f==="closed")return;r.dataset.btfwPopoverState="closing",r.setAttribute("aria-hidden","true");let c=[B(r)],a=d.backdrop;a&&(a.dataset.btfwPopoverState="closing",a.setAttribute("aria-hidden","true"),c.push(B(a))),await Promise.all(c),r.dataset.btfwPopoverState==="closing"&&(r.dataset.btfwPopoverState="closed",r.setAttribute("hidden","")),a&&a.dataset.btfwPopoverState==="closing"&&(a.dataset.btfwPopoverState="closed",a.setAttribute("hidden",""))}return{prefersReducedMotion:l,waitForTransition:B,openModal:v,closeModal:w,openPopover:E,closePopover:y}});BTFW.define("util:tmdb-proxy",[],async()=>{let h="https://empty-bar-d620.movies-storage-a.workers.dev",_="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function l(){var v,w,E,y,r,d,f;try{let c=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((v=c.movieSuggestions)==null?void 0:v.endpoint)||((E=(w=c.integrations)==null?void 0:w.movieSuggestions)==null?void 0:E.endpoint)||((r=(y=c.integrations)==null?void 0:y.movieRequests)==null?void 0:r.endpoint)||((f=(d=c.integrations)==null?void 0:d.tmdbProxy)==null?void 0:f.endpoint)||h).trim().replace(/\/+$/,"")}catch(c){return h}}function S(v,w){let E=v.startsWith("/")?v:`/${v}`,y=new URL(`${l()}${E}`);if(w)for(let[r,d]of Object.entries(w))d==null||d===""||y.searchParams.set(r,String(d));return y.toString()}async function I(v,w={}){let E=await fetch(S(v,w.params),{method:w.method||"GET",headers:w.body?{"Content-Type":"application/json"}:void 0,body:w.body?JSON.stringify(w.body):void 0,signal:w.signal}),y=await E.json().catch(()=>({}));if(!E.ok)throw new Error(y.error||`Worker request failed (${E.status})`);return y}async function B(v,w={},E={}){let y=String(v||"").replace(/^\/+/,"");return I(`/api/tmdb/${y}`,{params:w,signal:E.signal})}function A(){return!!l()}return{getWorkerBase:l,workerFetch:I,tmdbFetch:B,isAvailable:A,MISSING_PROXY_MSG:_}});BTFW.define("feature:styleCore",[],async()=>{function h(){if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(I=>/(bootstrap.*\.css|bootswatch.*slate)/i.test(I.href||""))&&!document.querySelector("link[data-btfw-slate]")){let I=document.createElement("link");I.rel="stylesheet",I.href="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",I.dataset.btfwSlate="1",document.head.insertBefore(I,document.head.firstChild)}}function _(){if(!document.querySelector('link[href*="bulma.min.css"]')&&!document.querySelector("link[data-btfw-bulma]")){let l=document.createElement("link");l.rel="stylesheet",l.href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",l.dataset.btfwBulma="1",document.head.appendChild(l)}if(!document.querySelector("link[data-btfw-fa6]")&&!document.querySelector('link[href*="fontawesome"]')){let l=document.createElement("link");l.rel="stylesheet",l.href="https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",l.dataset.btfwFa6="1",document.head.appendChild(l)}if(!document.getElementById("btfw-modal-zfix-core")){let l=document.createElement("style");l.id="btfw-modal-zfix-core",l.textContent=`
        /* Keep navbar on top */
        #nav-collapsible, .navbar, #navbar, .navbar-fixed-top {
          position: sticky !important;
          top: 0;
          left: 0;
          right: 0;
          z-index: 5000 !important;
        }
        /* Bulma modal layered correctly above content */
        .modal { z-index: 6000 !important; }
        .modal .modal-background { z-index: 6001 !important; }
        .modal:not(.btfw-modal-resizable) .modal-card,
        .modal:not(.btfw-modal-resizable) .modal-content { z-index: 6002 !important; }

        /* Userlist overlay default CLOSED (chat module toggles classes) */
        #userlist.btfw-userlist-overlay:not(.btfw-userlist-overlay--open) {
          display: none !important;
        }
      `,document.head.appendChild(l)}}h(),setTimeout(h,400),_(),setTimeout(_,300);try{localStorage.setItem("cytube-layout","fluid"),localStorage.setItem("layout","fluid"),typeof window.setPreferredLayout=="function"&&window.setPreferredLayout("fluid")}catch(l){}return{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let h="btfw:theme:mode",_="btfw:bulma:theme",l=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),S;function I(){if(S)return S;let a=document.getElementById("btfw-bulma-dark-bridge");return a&&a.remove(),S=document.createElement("style"),S.id="btfw-theme-mode-bridge",document.head.appendChild(S),S}let B=`
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
`;function A(a){let u=a==="dark"?"dark":"light",g=document.querySelector('meta[name="color-scheme"]');g||(g=document.createElement("meta"),g.setAttribute("name","color-scheme"),document.head.appendChild(g)),g.setAttribute("content",u)}function v(){try{let a=localStorage.getItem(h);return a||localStorage.getItem(_)||"dark"}catch(a){return"dark"}}function w(a){try{localStorage.setItem(h,a)}catch(u){}}function E(){return l&&l.matches?"dark":"light"}function y(a){let u=a==="auto"?E():a||"dark",g=document.documentElement;g.setAttribute("data-btfw-theme",u),g.classList.toggle("btfw-theme-dark",u==="dark"),A(u);let k=I();k.textContent=u==="dark"?B:""}function r(a){let u=a==="auto"||a==="dark"||a==="light"?a:"dark";w(u),y(u)}function d(){return v()}function f(){!l||!l.addEventListener||l.addEventListener("change",()=>{d()==="auto"&&y("auto")})}function c(){y(v()),f()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c(),{name:"feature:themeMode",setTheme:r,getTheme:d}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async h=>h.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async h=>h.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async({})=>{let h="btfw:grid:leftPx",_="btfw:layout:chatSide",l="btfw-navhost",y="btfw:grid:videoRatio",a=null,u=null,g="right",k=!1,q=!1,z=!1;function U(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function rt(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function j(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function K(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return q&&z?0:e}function at(){let t=U(),e=K(),o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-o*2)}function X(t){return Math.max(0,Math.round(t/2)*2)}function H(){let t=document.documentElement,e=K(),o=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,n=at();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(n)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(n)}px`);let m=document.getElementById("btfw-leftpad"),b=(k?Math.max(0,window.innerWidth-o*2):(m==null?void 0:m.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!k){let C=n;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(C)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let s=X(j()),p=X(Math.floor(n/2)),P=Math.max(180,p-s);P=X(Math.min(P,b));let x=P+s,M=p;t.style.setProperty("--btfw-video-chrome-h",`${s}px`),t.style.setProperty("--btfw-videowrap-max-h",`${P}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${x}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${M}px`),t.style.setProperty("--btfw-video-row-h",`${x}px`),t.style.setProperty("--btfw-video-max-h",`${x}px`)}function F(){if(!k)return;let t=U(),e=2,o=document.documentElement,n=document.getElementById("btfw-chatcol"),m=document.getElementById("btfw-leftpad");if(!n||!m)return;let i=n.getBoundingClientRect().bottom;if(i<=t-e)return;let b=i-(t-e),s=j(),p=parseFloat(getComputedStyle(o).getPropertyValue("--btfw-vertical-chat-row-h"))||n.getBoundingClientRect().height||0,P=parseFloat(getComputedStyle(o).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(o).getPropertyValue("--btfw-video-row-h"))||0,x=Math.max(0,P-s),M=C=>{let T=Math.max(180,Math.floor(C)),O=T+s;o.style.setProperty("--btfw-videowrap-max-h",`${T}px`),o.style.setProperty("--btfw-vertical-video-row-h",`${O}px`),o.style.setProperty("--btfw-video-row-h",`${O}px`),o.style.setProperty("--btfw-video-max-h",`${O}px`)};if(p>180){let C=Math.min(b,p-180);o.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(p-C)}px`);let T=b-C;T>0&&x>180&&M(x-T),L();return}x>180&&(M(x-b),L())}function Y(t={}){var i;let e=document.getElementById("btfw-grid"),o=document.getElementById("btfw-leftpad"),n=document.getElementById("btfw-stack"),m=(i=t.allHidden)!=null?i:rt();e&&e.classList.toggle("btfw-grid--stack-hidden",m),o&&o.classList.toggle("btfw-leftpad--stack-hidden",m),n&&n.classList.toggle("btfw-stack--all-hidden",m)}function L(){var o;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(n=>{n.style.removeProperty("height"),n.style.removeProperty("width"),n.style.removeProperty("maxHeight"),n.style.removeProperty("maxWidth"),n.style.removeProperty("top"),n.style.removeProperty("left"),n.style.removeProperty("right"),n.style.removeProperty("bottom"),n.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let n=e.player||e.player_||window.videojs&&(((o=window.videojs.players)==null?void 0:o[e.id])||window.videojs(e.id));if(n)try{typeof n.trigger=="function"&&n.trigger("componentresize"),n.tech_&&typeof n.tech_.trigger=="function"&&n.tech_.trigger("resize"),typeof n.resize=="function"&&n.resize()}catch(m){}}}function it(){try{return localStorage.getItem(_)==="left"?"left":"right"}catch(t){return"right"}}function dt(){try{let t=parseFloat(localStorage.getItem(y)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){u=t;return}let e=parseInt(localStorage.getItem(h)||"",10);if(!isNaN(e)&&e>=520){a=e;let o=Math.max(window.innerWidth-20,880);Q(e/o)}}catch(t){a=null,u=null}}function V(t){return Math.min(.78,Math.max(.35,t))}function J(t){var m;let e=(m=t==null?void 0:t.getBoundingClientRect)==null?void 0:m.call(t),o=(e==null?void 0:e.width)||window.innerWidth||0,n=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(o-n,880)}function lt(t){let e=J(t),o=u!==null?u:.62;if(e>0){let n=520/e,m=(e-360)/e;o=Math.min(Math.max(o,n),m)}return V(o)}function Q(t){u=V(t);try{localStorage.setItem(y,String(u))}catch(e){}}function st(t){let e=V(t),o=1-e,n=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*n))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(o*n))}fr)`}}function D(){let t=document.getElementById("btfw-grid");if(!t)return;if(k){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:o}=st(lt(t)),n=g==="left"?`${o} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${o}`;t.style.gridTemplateColumns=n,t.classList.toggle("btfw-grid--chat-left",g==="left"),t.classList.toggle("btfw-grid--chat-right",g!=="left")}function ct(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),o=J(e),n=Math.min(Math.max(t,520),o-360);a=n,Q(n/o);try{localStorage.setItem(h,String(n))}catch(m){}D()}function mt(){let t=window.innerWidth,n=Math.max(520,t*V(u!==null?u:.62))+360+20;return Math.min(Math.max(n,900),1100)}function ft(){let t=window.innerWidth,e=mt();return k?t<e+40:t<e}function N(){let t=document.getElementById("btfw-stack");if(!t)return;if(k){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let b=document.getElementById("btfw-grid"),s=document.getElementById("btfw-chatcol");if(!b||!s)return;(t.parentElement!==b||t.previousElementSibling!==s)&&(s.nextSibling?b.insertBefore(t,s.nextSibling):b.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let o=document.getElementById("btfw-video-stage"),n=document.getElementById("videowrap"),m=document.getElementById("btfw-video-overlay"),i=o||(m&&m.parentElement===e?m:n);i&&i.parentElement===e?i.nextSibling!==t&&(i.nextSibling?e.insertBefore(t,i.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function W(){let t=document.getElementById("btfw-grid");if(!t)return;let e=ft();e!==k?(k=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),N(),L(),setTimeout(()=>{L();try{window.dispatchEvent(new Event("resize"))}catch(o){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):N(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),D(),R(),H(),Y(),L(),et(),requestAnimationFrame(()=>{H(),F(),L()})}function R(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),o=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",o),document.documentElement.style.setProperty("--btfw-top",o);let n=q&&z?"0px":o;document.documentElement.style.setProperty("--btfw-top-effective",n);let m=document.getElementById("btfw-chatcol");m&&(m.style.removeProperty("top"),m.style.removeProperty("height"))}function ut(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let o=!1,n=null;function m(s){if(!o||n!==null&&s.pointerId!==n)return;if(k){i();return}let p=t.getBoundingClientRect(),x=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,M;if(g==="left"){let C=s.clientX-p.left,T=Math.max(C-x/2,0),O=p.width-T-x;if(O<520||T<360)return;M=O}else{M=s.clientX-p.left;let C=p.width-M-x;if(M<520||C<360)return}Number.isFinite(M)&&ct(M)}function i(){if(!o)return;let s=n;o=!1,n=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",m),e.removeEventListener("pointerup",i),e.removeEventListener("pointercancel",i),window.removeEventListener("blur",i),document.removeEventListener("visibilitychange",b);try{s!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(s)}catch(p){}W()}function b(){document.visibilityState==="hidden"&&i()}e.addEventListener("pointerdown",s=>{if(!(k||s.button!==0)){o=!0,n=s.pointerId,s.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(s.pointerId)}catch(p){}e.addEventListener("pointermove",m),e.addEventListener("pointerup",i),e.addEventListener("pointercancel",i),window.addEventListener("blur",i),document.addEventListener("visibilitychange",b)}})}let Z=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function ht(t){t&&((t.classList||[]).forEach(e=>{Z.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(o=>{Z.test(o)&&e.classList.remove(o)})}))}function bt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),o=document.querySelector("#chatwrap .btfw-chat-topbar");if(o){let n=o.querySelector("#btfw-nowplaying-slot");n||(n=document.createElement("div"),n.id="btfw-nowplaying-slot",n.className="btfw-chat-title",o.innerHTML="",o.appendChild(n)),e?(n.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function pt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e||(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage"),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let o=document.getElementById("videowrap"),n=document.getElementById("btfw-video-overlay");o&&o.parentElement!==e&&e.appendChild(o),n&&n.parentElement!==e&&e.appendChild(n)}function wt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),o=document.getElementById("chatwrap"),n=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let i=document.getElementById("btfw-leftpad"),b=document.getElementById("btfw-chatcol"),s=document.getElementById("videowrap"),p=document.getElementById("chatwrap"),P=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),x=document.getElementById("btfw-grid");nt(x),s&&!i.contains(s)&&i.appendChild(s),P&&!i.contains(P)&&i.appendChild(P),p&&!b.contains(p)&&b.appendChild(p)}else{let i=document.createElement("div");i.id="btfw-grid";let b=document.createElement("div");b.id="btfw-leftpad";let s=document.createElement("aside");s.id="btfw-chatcol",e&&b.appendChild(e),n&&b.appendChild(n),o&&s.appendChild(o);let p=document.createElement("div");p.id="btfw-vsplit",nt(i),i.appendChild(b),i.appendChild(p),i.appendChild(s),i.style.opacity="0",t.prepend(i)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(i=>ht(document.getElementById(i))),bt();let m=document.getElementById("btfw-leftpad");pt(m),N()}function yt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),W(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function gt(){wt();let t=()=>{R(),ut(),yt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let $=0,G=0;function vt(){G||(G=requestAnimationFrame(()=>{G=0,k&&(H(),F(),L())}))}function tt(){$||($=requestAnimationFrame(()=>{$=0,W()}))}function et(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{k&&vt()}).observe(t)}document.addEventListener("btfw:layoutReady",et);function ot(){dt(),g=it(),D(),R();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(R,0),tt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(R,0),tt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{g=t&&t.detail&&t.detail.side==="left"?"left":"right",D(),W()}),document.addEventListener("btfw:chat:barsReady",()=>{N()}),document.addEventListener("btfw:layout:stackVisibility",t=>{Y((t==null?void 0:t.detail)||{}),H(),L(),requestAnimationFrame(F)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};q=!!e.active,z=!!e.hidden,R(),H(),L(),requestAnimationFrame(F)});function Et(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let o=document.querySelector(e);if(o)return o}return null}function nt(t){if(!t)return;let e=Et();if(!e)return;let o=document.getElementById(l);o||(o=document.createElement("div"),o.id=l,o.className="btfw-navhost"),e.parentElement!==o&&o.appendChild(e),o.parentElement!==t&&t.insertBefore(o,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ot):ot(),{name:"feature:layout",commitLayout:gt}});})();
/*! Quiglytube core bundle entry — generated by scripts/build.js */
