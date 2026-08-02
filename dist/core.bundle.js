/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var Ut=Object.defineProperty;var rt=(n,l)=>{for(var a in l)Ut(n,a,{get:l[a],enumerable:!0})};var J=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),Et=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),_t=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",localSubs:"btfw:video:localsubs",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:J,EVENTS:Et,LS_KEYS:_t}));function $t(n){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(n):String(n).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function Q(n){if(n==null)return"";let l=String(n).trim();return l?(l.endsWith(":")&&(l=l.slice(0,-1).trimEnd()),l):""}function St(n,l=document){let a=Q(n);if(!a)return null;let s=l.querySelector(`#userlist li[data-name="${$t(a)}"]`);if(s)return s;let d=l.querySelectorAll(J.userlistItem),T=a.toLowerCase();for(let I of d){let h=I.getAttribute&&I.getAttribute("data-name")||""||I.textContent||"";if(!h)continue;let E=Q(h);if(E&&(E.toLowerCase()===T||E.replace(/\s+/g,"").toLowerCase().startsWith(T)))return I}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:St,normalizeUserIdentifier:Q}));function st(n){return n.ok===!0}function kt(n){return n.ok===!1}function X(n){return typeof HTMLElement=="function"&&n instanceof HTMLElement?!0:typeof n=="object"&&n!==null&&"closest"in n&&typeof n.closest=="function"&&"contains"in n&&typeof n.contains=="function"}function xt(n){return typeof HTMLButtonElement=="function"&&n instanceof HTMLButtonElement?!0:X(n)&&"disabled"in n&&typeof n.disabled=="boolean"}function tt(n,l){n.hidden=!l,l?(n.removeAttribute("aria-hidden"),n.removeAttribute("tabindex")):(n.setAttribute("aria-hidden","true"),n.setAttribute("tabindex","-1"))}function lt(n,l,a){if(!X(n)||a.length===0)return!1;for(let s of a)try{let d=l.querySelector(s);if(X(d)&&d.contains(n)||n.closest(s))return!0}catch(d){}return!1}function it(n,l){l?(n.setAttribute("aria-busy","true"),n.disabled=!0):(n.removeAttribute("aria-busy"),n.disabled=!1)}function Z(n,l){n&&(n.textContent=l)}function It(n){let{modal:l,applyButton:a,sections:s,ignoreRoots:d=[],confirmDiscard:T,statusEl:I}=n,_=new Map,h=new Set,E=new AbortController,S=!1,r=!1;function u(){_.clear(),h.clear();for(let b of s)_.set(b.id,b.snapshot());c()}function y(b){if(h.has(b.id))return!0;let M=_.get(b.id);return M===void 0?!0:b.snapshot()!==M}function m(){return s.some(b=>y(b))}function c(){let b=m();b?l.dataset.btfwDirty="1":delete l.dataset.btfwDirty,tt(a,b),b||Z(I,"")}function g(){S||r||(S=!0,queueMicrotask(()=>{S=!1,c()}))}function k(b){if(typeof b=="string"&&b.length>0)h.add(b);else for(let M of s)h.add(M.id);g()}async function B(){if(r)return{ok:!1,error:"Apply already in progress"};r=!0,it(a,!0),Z(I,"");let b=s.filter(P=>y(P));if(b.length===0)return it(a,!1),r=!1,tt(a,!1),{ok:!0};let M=null,O=0;for(let P of b)try{let L=await P.apply();st(L)?(_.set(P.id,P.snapshot()),h.delete(P.id)):(O+=1,M===null&&(M=L.error))}catch(L){O+=1;let V=L instanceof Error?L.message:"Unknown apply error";M===null&&(M=V)}if(it(a,!1),r=!1,c(),O>0){let P=M===null?`Failed to apply ${O} section(s)`:`${M}${O>1?` (+${O-1} more)`:""}`;return Z(I,P),{ok:!1,error:P}}return Z(I,"Changes applied"),{ok:!0}}function F(){for(let b of s){let M=_.get(b.id);M!==void 0&&b.restore(M)}h.clear(),c()}async function z(){if(!m())return!0;if(T){if(!await T())return!1}else if(!window.confirm("Discard unsaved changes?"))return!1;return F(),!0}function q(b){lt(b.target,l,d)||g()}l.addEventListener("input",q,{signal:E.signal,capture:!0}),l.addEventListener("change",q,{signal:E.signal,capture:!0});let et=b=>{m()&&(b.preventDefault(),b.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",et,{signal:E.signal}),u(),{isDirty:m,recalculate:c,markDirty:k,captureBaseline:u,applyAll:B,tryClose:z,discard:F,dispose(){E.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:It,setApplyButtonVisible:tt,eventTargetIsInsideIgnoredRoot:lt,isHTMLElement:X,isHTMLButtonElement:xt,isPersistSuccess:st,isPersistFailure:kt}));function Mt(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function dt(n,l=document){Object.defineProperty(l,"_btfw_userlist_watch",{configurable:!0,get(){return n.chat.userlistWatch},set(a){n.chat.userlistWatch=a}}),l._btfw_userlist_isOpen=()=>{var a,s;return(s=(a=n.userlist).isOpen)==null?void 0:s.call(a)},l._btfw_userlist_open=(...a)=>{var s,d;return(d=(s=n.userlist).open)==null?void 0:d.call(s,...a)},l._btfw_userlist_close=(...a)=>{var s,d;return(d=(s=n.userlist).close)==null?void 0:d.call(s,...a)},l._btfw_userlist_position=(...a)=>{var s,d;return(d=(s=n.userlist).position)==null?void 0:d.call(s,...a)},l._btfw_nav_setMobileOpen=(...a)=>{var s,d;return(d=(s=n.nav).setMobileOpen)==null?void 0:d.call(s,...a)},l._btfw_nav_toggleMobile=(...a)=>{var s,d;return(d=(s=n.nav).toggleMobile)==null?void 0:d.call(s,...a)},l._btfw_nav_isMobileOpen=(...a)=>{var s,d;return(d=(s=n.nav).isMobileOpen)==null?void 0:d.call(s,...a)},l._btfw_nav_setMenuOpen=(...a)=>{var s,d;return(d=(s=n.nav).setMenuOpen)==null?void 0:d.call(s,...a)},l._btfw_nav_toggleMenu=(...a)=>{var s,d;return(d=(s=n.nav).toggleMenu)==null?void 0:d.call(s,...a)},l._btfw_openThemeSettings=(...a)=>{var s,d;return(d=(s=n.theme).openSettings)==null?void 0:d.call(s,...a)}}BTFW.define("util:state",[],async()=>{let n=Mt();return dt(n),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=n),{name:"util:state",state:n,installLegacyStateShims:dt}});var ct={};rt(ct,{chatEmotesIconHtml:()=>Xt,chatGifIconHtml:()=>jt,chatGifIconSlotHtml:()=>Gt,chatTopbarHtml:()=>Yt,chatUserlistPopoverHtml:()=>Jt,chatUsersIconHtml:()=>Kt});function Xt(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile"></i></span>'}function jt(){return'<i class="fa-solid fa-gif"></i>'}function Gt(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function Kt(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function Yt(){return`
        <div class="btfw-chat-topbar-left">
          <div class="btfw-chat-title" id="btfw-nowplaying-slot"></div>
        </div>
        <div class="btfw-chat-topbar-actions" id="btfw-chat-topbar-actions"></div>
      `}function Jt(){return`
      <div class="btfw-pophead">
        <span>Users</span>
        <button class="btfw-popclose" aria-label="Close">&times;</button>
      </div>
      <div class="btfw-popbody"></div>
    `}var ut={};rt(ut,{addMediaButtonHtml:()=>oe,addMediaPanelHtml:()=>Qt,panelUndockIconHtml:()=>ee,panelsMenuButtonHtml:()=>te,playlistAddFormHtml:()=>ne,stackGroupHeaderHtml:()=>Zt});function Qt(){return`
        <div class="btfw-addmedia-panel__inner">
          <header class="btfw-addmedia-panel__header">
            <nav class="btfw-addmedia-tabs" role="tablist"></nav>
            <button type="button" class="btfw-addmedia-close" aria-label="Close add media">
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div class="btfw-addmedia-panel__body">
            <div class="btfw-addmedia-views"></div>
            <p class="btfw-addmedia-help">Queue media by URL or browse your library without leaving the playlist.</p>
          </div>
        </div>
      `}function Zt(n){return`
      <span class="btfw-stack-item__title">${n}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">\u2191</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">\u2193</button>
        </span>
      </div>
    `}function te(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function ee(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function ne(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function oe(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var ft={};rt(ft,{channelThemeAdminPanelHtml:()=>ae,channelThemeTabAnchorHtml:()=>re});function ae(){return`
      <div class="btfw-theme-admin">
        <h3>Channel operations</h3>
        <p class="lead">Manage channel branding, optional resources, and BillTube integrations. Per-user colors and fonts live in each viewer's Theme settings.</p>

        <details class="section" data-section="resources">
          <summary class="section__summary">
            <div class="section__title">
              <h4>Theme Resources</h4>
              <span>Extra stylesheets, scripts, and optional module URLs.</span>
            </div>
            <span class="section__chevron" aria-hidden="true">></span>
          </summary>
          <div class="section__body">
            <div class="field">
              <label for="btfw-theme-css-urls">Additional CSS URLs</label>
              <textarea id="btfw-theme-css-urls" data-btfw-bind="resources.styles" placeholder="https://example.com/theme.css"></textarea>
              <p class="help">Each line becomes a stylesheet link injected before the theme renders.</p>
            </div>
            <div class="field">
              <label for="btfw-theme-js-urls">Additional Script URLs</label>
              <textarea id="btfw-theme-js-urls" data-btfw-bind="resources.scripts" placeholder="https://example.com/widget.js"></textarea>
              <p class="help">Each line becomes a deferred script tag for optional widgets or behavior.</p>
            </div>
            <div class="field">
              <label for="btfw-theme-module-0">Additional module URLs</label>
              <div class="module-inputs" data-role="module-inputs">
                <div class="module-input__row">
                  <input type="url" id="btfw-theme-module-0" name="btfw-theme-module-0" class="module-input__control" placeholder="https://example.com/module.js" data-role="module-input">
                </div>
                <div class="module-input__row">
                  <input type="url" id="btfw-theme-module-1" name="btfw-theme-module-1" class="module-input__control" placeholder="https://example.com/module.js" data-role="module-input">
                </div>
                <div class="module-input__row">
                  <input type="url" id="btfw-theme-module-2" name="btfw-theme-module-2" class="module-input__control" placeholder="https://example.com/module.js" data-role="module-input">
                </div>
              </div>
              <p class="help">Load up to 10 extra BillTube modules by URL. A new field appears once you fill the last one.</p>
            </div>
          </div>
        </details>

        <details class="section" data-section="integrations">
          <summary class="section__summary">
            <div class="section__title">
              <h4>Integrations</h4>
              <span>Channel-wide BillTube feature toggles.</span>
            </div>
            <span class="section__chevron" aria-hidden="true">></span>
          </summary>
          <div class="section__body">
            <div class="field">
              <label for="btfw-theme-movie-info-toggle">Movie info overlay</label>
              <div class="movie-info-toggle">
                <button type="button" class="button is-dark is-small" id="btfw-theme-movie-info-toggle" aria-pressed="false">Enable movie info overlay</button>
                <input type="checkbox" id="btfw-theme-movie-info-enabled" data-btfw-bind="integrations.movieInfo.enabled" hidden>
              </div>
              <p class="help">Shows posters and metadata when viewers hover the now playing title. TMDB access is configured in the worker.</p>
            </div>
          </div>
        </details>

        <details class="section" data-section="branding">
          <summary class="section__summary">
            <div class="section__title">
              <h4>Branding</h4>
              <span>Navbar title, favicon, and poster overrides.</span>
            </div>
            <span class="section__chevron" aria-hidden="true">></span>
          </summary>
          <div class="section__body">
            <div class="field">
              <label for="btfw-theme-header-name">Channel header name</label>
              <input type="text" id="btfw-theme-header-name" data-btfw-bind="branding.headerName" placeholder="CyTube">
              <p class="help">Replaces the navbar brand text for all visitors.</p>
            </div>
            <div class="field">
              <label for="btfw-theme-favicon">Favicon URL</label>
              <input type="url" id="btfw-theme-favicon" data-btfw-bind="branding.faviconUrl" placeholder="https://example.com/favicon.png">
              <p class="help">Provide a full URL to the icon browsers should show in the tab bar.</p>
            </div>
            <div class="field">
              <label for="btfw-theme-poster">Video poster URL</label>
              <input type="url" id="btfw-theme-poster" data-btfw-bind="branding.posterUrl" placeholder="https://example.com/poster.jpg">
              <p class="help">Optional hero image used by some overlays. Leave blank to use the default poster.</p>
            </div>
          </div>
        </details>

        <div class="buttons">
          <button type="button" class="btn-primary" id="btfw-theme-apply">Apply to Channel CSS &amp; JS</button>
          <button type="button" class="btn-secondary" id="btfw-theme-reset">Reset to preset</button>
          <span class="status" id="btfw-theme-status" data-variant="idle">No changes applied yet.</span>
        </div>
      </div>
    `}function re(){return'<span class="fa fa-magic"></span> <span>Theme</span>'}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:ct,stack:ut,channelThemeAdmin:ft}));BTFW.define("util:motion",[],async()=>{let n=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,l=!!(n&&n.matches);if(n){let r=u=>{l=!!u.matches};typeof n.addEventListener=="function"?n.addEventListener("change",r):typeof n.addListener=="function"&&n.addListener(r)}function a(){return l}function s(r){return r?r.split(",").reduce((u,y)=>{let m=parseFloat(y.trim());return Number.isNaN(m)?u:y.trim().endsWith("ms")?Math.max(u,m):Math.max(u,m*1e3)},0):0}function d(r){if(!r||typeof window=="undefined"||!window.getComputedStyle)return 0;let u=getComputedStyle(r),y=s(u.transitionDuration||"0s"),m=s(u.transitionDelay||"0s");return y+m}function T(r){return new Promise(u=>{if(!r||a()){u();return}let y=d(r);if(!y){u();return}let m=!1,c=()=>{m||(m=!0,r.removeEventListener("transitionend",g),u())},g=k=>{k&&k.target!==r||c()};r.addEventListener("transitionend",g),setTimeout(c,y+34)})}function I(r){typeof r=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(r)}):setTimeout(r,32))}function _(r){if(!r)return;let u=r.dataset.btfwModalState;if(u==="open"||u==="opening")return;r.dataset.btfwModalState="opening",r.removeAttribute("aria-hidden"),r.removeAttribute("hidden");let y=()=>{!r||r.dataset.btfwModalState!=="opening"||(r.classList.add("is-active"),r.dataset.btfwModalState="open")};a()?y():I(y)}async function h(r){if(!r)return;let u=r.dataset.btfwModalState;if(u==="closing"||u==="closed")return;r.dataset.btfwModalState="closing",r.setAttribute("aria-hidden","true");let y=r.querySelector(".modal-card, .modal-content, .modal-dialog"),m=r.querySelector(".modal-background, .modal-backdrop");r.classList.remove("is-active"),await Promise.all([T(y),T(m)]),r.dataset.btfwModalState==="closing"&&(r.dataset.btfwModalState="closed",r.setAttribute("hidden",""))}function E(r,u={}){if(!r)return;let y=r.dataset.btfwPopoverState;if(y==="open"||y==="opening")return;r.dataset.btfwPopoverState="opening",r.removeAttribute("hidden"),r.removeAttribute("aria-hidden");let m=u.backdrop;m&&(m.dataset.btfwPopoverState="opening",m.removeAttribute("hidden"),m.removeAttribute("aria-hidden"));let c=()=>{r.dataset.btfwPopoverState==="opening"&&(r.dataset.btfwPopoverState="open",m&&m.dataset.btfwPopoverState==="opening"&&(m.dataset.btfwPopoverState="open"))};a()?c():I(c)}async function S(r,u={}){if(!r)return;let y=r.dataset.btfwPopoverState;if(y==="closing"||y==="closed")return;r.dataset.btfwPopoverState="closing",r.setAttribute("aria-hidden","true");let m=[T(r)],c=u.backdrop;c&&(c.dataset.btfwPopoverState="closing",c.setAttribute("aria-hidden","true"),m.push(T(c))),await Promise.all(m),r.dataset.btfwPopoverState==="closing"&&(r.dataset.btfwPopoverState="closed",r.setAttribute("hidden","")),c&&c.dataset.btfwPopoverState==="closing"&&(c.dataset.btfwPopoverState="closed",c.setAttribute("hidden",""))}return{prefersReducedMotion:a,waitForTransition:T,openModal:_,closeModal:h,openPopover:E,closePopover:S}});BTFW.define("util:tmdb-proxy",[],async()=>{let n="https://empty-bar-d620.movies-storage-a.workers.dev",l="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function a(){var _,h,E,S,r,u,y;try{let m=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((_=m.movieSuggestions)==null?void 0:_.endpoint)||((E=(h=m.integrations)==null?void 0:h.movieSuggestions)==null?void 0:E.endpoint)||((r=(S=m.integrations)==null?void 0:S.movieRequests)==null?void 0:r.endpoint)||((y=(u=m.integrations)==null?void 0:u.tmdbProxy)==null?void 0:y.endpoint)||n).trim().replace(/\/+$/,"")}catch(m){return n}}function s(_,h){let E=_.startsWith("/")?_:`/${_}`,S=new URL(`${a()}${E}`);if(h)for(let[r,u]of Object.entries(h))u==null||u===""||S.searchParams.set(r,String(u));return S.toString()}async function d(_,h={}){let E=await fetch(s(_,h.params),{method:h.method||"GET",headers:h.body?{"Content-Type":"application/json"}:void 0,body:h.body?JSON.stringify(h.body):void 0,signal:h.signal}),S=await E.json().catch(()=>({}));if(!E.ok)throw new Error(S.error||`Worker request failed (${E.status})`);return S}async function T(_,h={},E={}){let S=String(_||"").replace(/^\/+/,"");return d(`/api/tmdb/${S}`,{params:h,signal:E.signal})}function I(){return!!a()}return{getWorkerBase:a,workerFetch:d,tmdbFetch:T,isAvailable:I,MISSING_PROXY_MSG:l}});BTFW.define("feature:styleCore",[],async()=>{function n(){if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(d=>/(bootstrap.*\.css|bootswatch.*slate)/i.test(d.href||""))&&!document.querySelector("link[data-btfw-slate]")){let d=document.createElement("link");d.rel="stylesheet",d.href="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",d.dataset.btfwSlate="1",document.head.insertBefore(d,document.head.firstChild)}}function l(){if(!document.querySelector('link[href*="bulma.min.css"]')&&!document.querySelector("link[data-btfw-bulma]")){let a=document.createElement("link");a.rel="stylesheet",a.href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",a.dataset.btfwBulma="1",document.head.appendChild(a)}if(!document.querySelector("link[data-btfw-fa6]")&&!document.querySelector('link[href*="fontawesome"]')){let a=document.createElement("link");a.rel="stylesheet",a.href="https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",a.dataset.btfwFa6="1",document.head.appendChild(a)}if(!document.getElementById("btfw-modal-zfix-core")){let a=document.createElement("style");a.id="btfw-modal-zfix-core",a.textContent=`
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
      `,document.head.appendChild(a)}}n(),setTimeout(n,400),l(),setTimeout(l,300);try{localStorage.setItem("cytube-layout","fluid"),localStorage.setItem("layout","fluid"),typeof window.setPreferredLayout=="function"&&window.setPreferredLayout("fluid")}catch(a){}return{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let n="btfw:theme:mode",l="btfw:bulma:theme",a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),s;function d(){if(s)return s;let c=document.getElementById("btfw-bulma-dark-bridge");return c&&c.remove(),s=document.createElement("style"),s.id="btfw-theme-mode-bridge",document.head.appendChild(s),s}let T=`
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
`;function I(c){let g=c==="dark"?"dark":"light",k=document.querySelector('meta[name="color-scheme"]');k||(k=document.createElement("meta"),k.setAttribute("name","color-scheme"),document.head.appendChild(k)),k.setAttribute("content",g)}function _(){try{let c=localStorage.getItem(n);return c||localStorage.getItem(l)||"dark"}catch(c){return"dark"}}function h(c){try{localStorage.setItem(n,c)}catch(g){}}function E(){return a&&a.matches?"dark":"light"}function S(c){let g=c==="auto"?E():c||"dark",k=document.documentElement;k.setAttribute("data-btfw-theme",g),k.classList.toggle("btfw-theme-dark",g==="dark"),I(g);let B=d();B.textContent=g==="dark"?T:""}function r(c){let g=c==="auto"||c==="dark"||c==="light"?c:"dark";h(g),S(g)}function u(){return _()}function y(){!a||!a.addEventListener||a.addEventListener("change",()=>{u()==="auto"&&S("auto")})}function m(){S(_()),y()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),{name:"feature:themeMode",setTheme:r,getTheme:u}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let n="btfw:grid:leftPx",l="btfw:layout:chatSide",a="btfw-navhost",S="btfw:grid:videoRatio",c=null,g=null,k="right",B=!1,F=!1,z=!1;function q(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function et(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function b(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function M(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return F&&z?0:e}function O(){let t=q(),e=M(),o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-o*2)}function P(t){return Math.max(0,Math.round(t/2)*2)}function L(){let t=document.documentElement,e=M(),o=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,i=O();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(i)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(i)}px`);let w=document.getElementById("btfw-leftpad"),v=(B?Math.max(0,window.innerWidth-o*2):(w==null?void 0:w.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!B){let H=i;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(H)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let p=P(b()),x=P(Math.floor(i/2)),A=Math.max(180,x-p);A=P(Math.min(A,v));let C=A+p,R=x;t.style.setProperty("--btfw-video-chrome-h",`${p}px`),t.style.setProperty("--btfw-videowrap-max-h",`${A}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${C}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${R}px`),t.style.setProperty("--btfw-video-row-h",`${C}px`),t.style.setProperty("--btfw-video-max-h",`${C}px`)}function V(){if(!B)return;let t=q(),e=2,o=document.documentElement,i=document.getElementById("btfw-chatcol"),w=document.getElementById("btfw-leftpad");if(!i||!w)return;let f=i.getBoundingClientRect().bottom;if(f<=t-e)return;let v=f-(t-e),p=b(),x=parseFloat(getComputedStyle(o).getPropertyValue("--btfw-vertical-chat-row-h"))||i.getBoundingClientRect().height||0,A=parseFloat(getComputedStyle(o).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(o).getPropertyValue("--btfw-video-row-h"))||0,C=Math.max(0,A-p),R=H=>{let D=Math.max(180,Math.floor(H)),W=D+p;o.style.setProperty("--btfw-videowrap-max-h",`${D}px`),o.style.setProperty("--btfw-vertical-video-row-h",`${W}px`),o.style.setProperty("--btfw-video-row-h",`${W}px`),o.style.setProperty("--btfw-video-max-h",`${W}px`)};if(x>180){let H=Math.min(v,x-180);o.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(x-H)}px`);let D=v-H;D>0&&C>180&&R(C-D),U();return}C>180&&(R(C-v),U())}function mt(t={}){var f;let e=document.getElementById("btfw-grid"),o=document.getElementById("btfw-leftpad"),i=document.getElementById("btfw-stack"),w=(f=t.allHidden)!=null?f:et();e&&e.classList.toggle("btfw-grid--stack-hidden",w),o&&o.classList.toggle("btfw-leftpad--stack-hidden",w),i&&i.classList.toggle("btfw-stack--all-hidden",w)}function U(){var o;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(i=>{i.style.removeProperty("height"),i.style.removeProperty("width"),i.style.removeProperty("maxHeight"),i.style.removeProperty("maxWidth"),i.style.removeProperty("top"),i.style.removeProperty("left"),i.style.removeProperty("right"),i.style.removeProperty("bottom"),i.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let i=e.player||e.player_||window.videojs&&(((o=window.videojs.players)==null?void 0:o[e.id])||window.videojs(e.id));if(i)try{typeof i.trigger=="function"&&i.trigger("componentresize"),i.tech_&&typeof i.tech_.trigger=="function"&&i.tech_.trigger("resize"),typeof i.resize=="function"&&i.resize()}catch(w){}}}function Ct(){try{return localStorage.getItem(l)==="left"?"left":"right"}catch(t){return"right"}}function Tt(){try{let t=parseFloat(localStorage.getItem(S)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){g=t;return}let e=parseInt(localStorage.getItem(n)||"",10);if(!isNaN(e)&&e>=520){c=e;let o=Math.max(window.innerWidth-20,880);bt(e/o)}}catch(t){c=null,g=null}}function j(t){return Math.min(.78,Math.max(.35,t))}function pt(t){var w;let e=(w=t==null?void 0:t.getBoundingClientRect)==null?void 0:w.call(t),o=(e==null?void 0:e.width)||window.innerWidth||0,i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(o-i,880)}function Bt(t){let e=pt(t),o=g!==null?g:.62;if(e>0){let i=520/e,w=(e-360)/e;o=Math.min(Math.max(o,i),w)}return j(o)}function bt(t){g=j(t);try{localStorage.setItem(S,String(g))}catch(e){}}function Pt(t){let e=j(t),o=1-e,i=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*i))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(o*i))}fr)`}}function G(){let t=document.getElementById("btfw-grid");if(!t)return;if(B){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:o}=Pt(Bt(t)),i=k==="left"?`${o} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${o}`;t.style.gridTemplateColumns=i,t.classList.toggle("btfw-grid--chat-left",k==="left"),t.classList.toggle("btfw-grid--chat-right",k!=="left")}function Lt(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),o=pt(e),i=Math.min(Math.max(t,520),o-360);c=i,bt(i/o);try{localStorage.setItem(n,String(i))}catch(w){}G()}function At(){let t=window.innerWidth,i=Math.max(520,t*j(g!==null?g:.62))+360+20;return Math.min(Math.max(i,900),1100)}function Rt(){let t=window.innerWidth,e=At();return B?t<e+40:t<e}function K(){let t=document.getElementById("btfw-stack");if(!t)return;if(B){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let v=document.getElementById("btfw-grid"),p=document.getElementById("btfw-chatcol");if(!v||!p)return;(t.parentElement!==v||t.previousElementSibling!==p)&&(p.nextSibling?v.insertBefore(t,p.nextSibling):v.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let o=document.getElementById("btfw-video-stage"),i=document.getElementById("videowrap"),w=document.getElementById("btfw-video-overlay"),f=o||(w&&w.parentElement===e?w:i);f&&f.parentElement===e?f.nextSibling!==t&&(f.nextSibling?e.insertBefore(t,f.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function Y(){let t=document.getElementById("btfw-grid");if(!t)return;let e=Rt();e!==B?(B=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),K(),$(),setTimeout(()=>{$();try{window.dispatchEvent(new Event("resize"))}catch(o){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):K(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),G(),N(),L(),mt(),$(),yt(),requestAnimationFrame(()=>{L(),V(),$()})}function N(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),o=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",o),document.documentElement.style.setProperty("--btfw-top",o);let i=F&&z?"0px":o;document.documentElement.style.setProperty("--btfw-top-effective",i);let w=document.getElementById("btfw-chatcol");w&&(w.style.removeProperty("top"),w.style.removeProperty("height"))}function Ht(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let o=!1,i=null;function w(p){if(!o||i!==null&&p.pointerId!==i)return;if(B){f();return}let x=t.getBoundingClientRect(),C=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,R;if(k==="left"){let H=p.clientX-x.left,D=Math.max(H-C/2,0),W=x.width-D-C;if(W<520||D<360)return;R=W}else{R=p.clientX-x.left;let H=x.width-R-C;if(R<520||H<360)return}Number.isFinite(R)&&Lt(R)}function f(){if(!o)return;let p=i;o=!1,i=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",w),e.removeEventListener("pointerup",f),e.removeEventListener("pointercancel",f),window.removeEventListener("blur",f),document.removeEventListener("visibilitychange",v);try{p!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(p)}catch(x){}Y()}function v(){document.visibilityState==="hidden"&&f()}e.addEventListener("pointerdown",p=>{if(!(B||p.button!==0)){o=!0,i=p.pointerId,p.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(p.pointerId)}catch(x){}e.addEventListener("pointermove",w),e.addEventListener("pointerup",f),e.addEventListener("pointercancel",f),window.addEventListener("blur",f),document.addEventListener("visibilitychange",v)}})}let ht=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function Ot(t){t&&((t.classList||[]).forEach(e=>{ht.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(o=>{ht.test(o)&&e.classList.remove(o)})}))}function Dt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),o=document.querySelector("#chatwrap .btfw-chat-topbar");if(o){let i=o.querySelector("#btfw-nowplaying-slot");i||(i=document.createElement("div"),i.id="btfw-nowplaying-slot",i.className="btfw-chat-title",o.innerHTML="",o.appendChild(i)),e?(i.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Ft(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e?e.getAttribute("data-testid")||e.setAttribute("data-testid","btfw-video-stage"):(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage",e.setAttribute("data-testid","btfw-video-stage")),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let o=document.getElementById("videowrap"),i=document.getElementById("btfw-video-overlay");o&&o.parentElement!==e&&e.appendChild(o),i&&i.parentElement!==e&&e.appendChild(i)}function Vt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),o=document.getElementById("chatwrap"),i=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let f=document.getElementById("btfw-leftpad"),v=document.getElementById("btfw-chatcol");v&&!v.getAttribute("data-testid")&&v.setAttribute("data-testid","btfw-chatcol");let p=document.getElementById("videowrap"),x=document.getElementById("chatwrap"),A=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),C=document.getElementById("btfw-grid");C&&!C.getAttribute("data-testid")&&C.setAttribute("data-testid","btfw-grid"),vt(C),p&&!f.contains(p)&&f.appendChild(p),A&&!f.contains(A)&&f.appendChild(A),x&&!v.contains(x)&&v.appendChild(x)}else{let f=document.createElement("div");f.id="btfw-grid",f.setAttribute("data-testid","btfw-grid");let v=document.createElement("div");v.id="btfw-leftpad";let p=document.createElement("aside");p.id="btfw-chatcol",p.setAttribute("data-testid","btfw-chatcol"),e&&v.appendChild(e),i&&v.appendChild(i),o&&p.appendChild(o);let x=document.createElement("div");x.id="btfw-vsplit",vt(f),f.appendChild(v),f.appendChild(x),f.appendChild(p),f.style.opacity="0",t.prepend(f)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(f=>Ot(document.getElementById(f))),Dt();let w=document.getElementById("btfw-leftpad");Ft(w),K()}function Nt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),Y(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function Wt(){Vt();let t=()=>{N(),Ht(),Nt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let nt=0,ot=0,at=0;function $(){at||(at=requestAnimationFrame(()=>{at=0,U()}))}function zt(){ot||(ot=requestAnimationFrame(()=>{ot=0,B&&(L(),V(),$())}))}function wt(){nt||(nt=requestAnimationFrame(()=>{nt=0,Y()}))}function yt(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{B&&zt()}).observe(t)}document.addEventListener("btfw:layoutReady",yt);function gt(){Tt(),k=Ct(),G(),N();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(N,0),wt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(N,0),wt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{k=t&&t.detail&&t.detail.side==="left"?"left":"right",G(),Y()}),document.addEventListener("btfw:chat:barsReady",()=>{K()}),document.addEventListener("btfw:layout:stackVisibility",t=>{mt((t==null?void 0:t.detail)||{}),L(),U(),requestAnimationFrame(V)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};F=!!e.active,z=!!e.hidden,N(),L(),U(),requestAnimationFrame(V)});function qt(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let o=document.querySelector(e);if(o)return o}return null}function vt(t){if(!t)return;let e=qt();if(!e)return;let o=document.getElementById(a);o||(o=document.createElement("div"),o.id=a,o.className="btfw-navhost"),e.parentElement!==o&&o.appendChild(e),o.parentElement!==t&&t.insertBefore(o,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gt):gt(),{name:"feature:layout",commitLayout:Wt}});})();
