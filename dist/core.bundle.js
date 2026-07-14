/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var Rt=Object.defineProperty;var J=(i,m)=>{for(var r in m)Rt(i,r,{get:m[r],enumerable:!0})};var q=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),ft=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),pt=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",localSubs:"btfw:video:localsubs",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:q,EVENTS:ft,LS_KEYS:pt}));function Ht(i){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(i):String(i).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function U(i){if(i==null)return"";let m=String(i).trim();return m?(m.endsWith(":")&&(m=m.slice(0,-1).trimEnd()),m):""}function bt(i,m=document){let r=U(i);if(!r)return null;let s=m.querySelector(`#userlist li[data-name="${Ht(r)}"]`);if(s)return s;let l=m.querySelectorAll(q.userlistItem),C=r.toLowerCase();for(let M of l){let y=M.getAttribute&&M.getAttribute("data-name")||""||M.textContent||"";if(!y)continue;let _=U(y);if(_&&(_.toLowerCase()===C||_.replace(/\s+/g,"").toLowerCase().startsWith(C)))return M}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:bt,normalizeUserIdentifier:U}));function ht(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function Q(i,m=document){Object.defineProperty(m,"_btfw_userlist_watch",{configurable:!0,get(){return i.chat.userlistWatch},set(r){i.chat.userlistWatch=r}}),m._btfw_userlist_isOpen=()=>{var r,s;return(s=(r=i.userlist).isOpen)==null?void 0:s.call(r)},m._btfw_userlist_open=(...r)=>{var s,l;return(l=(s=i.userlist).open)==null?void 0:l.call(s,...r)},m._btfw_userlist_close=(...r)=>{var s,l;return(l=(s=i.userlist).close)==null?void 0:l.call(s,...r)},m._btfw_userlist_position=(...r)=>{var s,l;return(l=(s=i.userlist).position)==null?void 0:l.call(s,...r)},m._btfw_nav_setMobileOpen=(...r)=>{var s,l;return(l=(s=i.nav).setMobileOpen)==null?void 0:l.call(s,...r)},m._btfw_nav_toggleMobile=(...r)=>{var s,l;return(l=(s=i.nav).toggleMobile)==null?void 0:l.call(s,...r)},m._btfw_nav_isMobileOpen=(...r)=>{var s,l;return(l=(s=i.nav).isMobileOpen)==null?void 0:l.call(s,...r)},m._btfw_nav_setMenuOpen=(...r)=>{var s,l;return(l=(s=i.nav).setMenuOpen)==null?void 0:l.call(s,...r)},m._btfw_nav_toggleMenu=(...r)=>{var s,l;return(l=(s=i.nav).toggleMenu)==null?void 0:l.call(s,...r)},m._btfw_openThemeSettings=(...r)=>{var s,l;return(l=(s=i.theme).openSettings)==null?void 0:l.call(s,...r)}}BTFW.define("util:state",[],async()=>{let i=ht();return Q(i),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=i),{name:"util:state",state:i,installLegacyStateShims:Q}});var Z={};J(Z,{chatEmotesIconHtml:()=>Ft,chatGifIconHtml:()=>Nt,chatGifIconSlotHtml:()=>Vt,chatTopbarHtml:()=>Wt,chatUserlistPopoverHtml:()=>zt,chatUsersIconHtml:()=>Dt});function Ft(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile"></i></span>'}function Nt(){return'<i class="fa-solid fa-gif"></i>'}function Vt(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function Dt(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function Wt(){return`
        <div class="btfw-chat-topbar-left">
          <div class="btfw-chat-title" id="btfw-nowplaying-slot"></div>
        </div>
        <div class="btfw-chat-topbar-actions" id="btfw-chat-topbar-actions"></div>
      `}function zt(){return`
      <div class="btfw-pophead">
        <span>Users</span>
        <button class="btfw-popclose" aria-label="Close">&times;</button>
      </div>
      <div class="btfw-popbody"></div>
    `}var tt={};J(tt,{addMediaButtonHtml:()=>Gt,addMediaPanelHtml:()=>qt,panelUndockIconHtml:()=>$t,panelsMenuButtonHtml:()=>Xt,playlistAddFormHtml:()=>jt,stackGroupHeaderHtml:()=>Ut});function qt(){return`
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
      `}function Ut(i){return`
      <span class="btfw-stack-item__title">${i}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">\u2191</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">\u2193</button>
        </span>
      </div>
    `}function Xt(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function $t(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function jt(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function Gt(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var et={};J(et,{channelThemeAdminPanelHtml:()=>Kt,channelThemeTabAnchorHtml:()=>Yt});function Kt(){return`
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
    `}function Yt(){return'<span class="fa fa-magic"></span> <span>Theme</span>'}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:Z,stack:tt,channelThemeAdmin:et}));BTFW.define("util:motion",[],async()=>{let i=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,m=!!(i&&i.matches);if(i){let n=u=>{m=!!u.matches};typeof i.addEventListener=="function"?i.addEventListener("change",n):typeof i.addListener=="function"&&i.addListener(n)}function r(){return m}function s(n){return n?n.split(",").reduce((u,h)=>{let p=parseFloat(h.trim());return Number.isNaN(p)?u:h.trim().endsWith("ms")?Math.max(u,p):Math.max(u,p*1e3)},0):0}function l(n){if(!n||typeof window=="undefined"||!window.getComputedStyle)return 0;let u=getComputedStyle(n),h=s(u.transitionDuration||"0s"),p=s(u.transitionDelay||"0s");return h+p}function C(n){return new Promise(u=>{if(!n||r()){u();return}let h=l(n);if(!h){u();return}let p=!1,d=()=>{p||(p=!0,n.removeEventListener("transitionend",w),u())},w=S=>{S&&S.target!==n||d()};n.addEventListener("transitionend",w),setTimeout(d,h+34)})}function M(n){typeof n=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(n)}):setTimeout(n,32))}function x(n){if(!n)return;let u=n.dataset.btfwModalState;if(u==="open"||u==="opening")return;n.dataset.btfwModalState="opening",n.removeAttribute("aria-hidden"),n.removeAttribute("hidden");let h=()=>{!n||n.dataset.btfwModalState!=="opening"||(n.classList.add("is-active"),n.dataset.btfwModalState="open")};r()?h():M(h)}async function y(n){if(!n)return;let u=n.dataset.btfwModalState;if(u==="closing"||u==="closed")return;n.dataset.btfwModalState="closing",n.setAttribute("aria-hidden","true");let h=n.querySelector(".modal-card, .modal-content, .modal-dialog"),p=n.querySelector(".modal-background, .modal-backdrop");n.classList.remove("is-active"),await Promise.all([C(h),C(p)]),n.dataset.btfwModalState==="closing"&&(n.dataset.btfwModalState="closed",n.setAttribute("hidden",""))}function _(n,u={}){if(!n)return;let h=n.dataset.btfwPopoverState;if(h==="open"||h==="opening")return;n.dataset.btfwPopoverState="opening",n.removeAttribute("hidden"),n.removeAttribute("aria-hidden");let p=u.backdrop;p&&(p.dataset.btfwPopoverState="opening",p.removeAttribute("hidden"),p.removeAttribute("aria-hidden"));let d=()=>{n.dataset.btfwPopoverState==="opening"&&(n.dataset.btfwPopoverState="open",p&&p.dataset.btfwPopoverState==="opening"&&(p.dataset.btfwPopoverState="open"))};r()?d():M(d)}async function E(n,u={}){if(!n)return;let h=n.dataset.btfwPopoverState;if(h==="closing"||h==="closed")return;n.dataset.btfwPopoverState="closing",n.setAttribute("aria-hidden","true");let p=[C(n)],d=u.backdrop;d&&(d.dataset.btfwPopoverState="closing",d.setAttribute("aria-hidden","true"),p.push(C(d))),await Promise.all(p),n.dataset.btfwPopoverState==="closing"&&(n.dataset.btfwPopoverState="closed",n.setAttribute("hidden","")),d&&d.dataset.btfwPopoverState==="closing"&&(d.dataset.btfwPopoverState="closed",d.setAttribute("hidden",""))}return{prefersReducedMotion:r,waitForTransition:C,openModal:x,closeModal:y,openPopover:_,closePopover:E}});BTFW.define("util:tmdb-proxy",[],async()=>{let i="https://empty-bar-d620.movies-storage-a.workers.dev",m="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function r(){var x,y,_,E,n,u,h;try{let p=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((x=p.movieSuggestions)==null?void 0:x.endpoint)||((_=(y=p.integrations)==null?void 0:y.movieSuggestions)==null?void 0:_.endpoint)||((n=(E=p.integrations)==null?void 0:E.movieRequests)==null?void 0:n.endpoint)||((h=(u=p.integrations)==null?void 0:u.tmdbProxy)==null?void 0:h.endpoint)||i).trim().replace(/\/+$/,"")}catch(p){return i}}function s(x,y){let _=x.startsWith("/")?x:`/${x}`,E=new URL(`${r()}${_}`);if(y)for(let[n,u]of Object.entries(y))u==null||u===""||E.searchParams.set(n,String(u));return E.toString()}async function l(x,y={}){let _=await fetch(s(x,y.params),{method:y.method||"GET",headers:y.body?{"Content-Type":"application/json"}:void 0,body:y.body?JSON.stringify(y.body):void 0,signal:y.signal}),E=await _.json().catch(()=>({}));if(!_.ok)throw new Error(E.error||`Worker request failed (${_.status})`);return E}async function C(x,y={},_={}){let E=String(x||"").replace(/^\/+/,"");return l(`/api/tmdb/${E}`,{params:y,signal:_.signal})}function M(){return!!r()}return{getWorkerBase:r,workerFetch:l,tmdbFetch:C,isAvailable:M,MISSING_PROXY_MSG:m}});BTFW.define("feature:styleCore",[],async()=>{function i(){if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(l=>/(bootstrap.*\.css|bootswatch.*slate)/i.test(l.href||""))&&!document.querySelector("link[data-btfw-slate]")){let l=document.createElement("link");l.rel="stylesheet",l.href="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",l.dataset.btfwSlate="1",document.head.insertBefore(l,document.head.firstChild)}}function m(){if(!document.querySelector('link[href*="bulma.min.css"]')&&!document.querySelector("link[data-btfw-bulma]")){let r=document.createElement("link");r.rel="stylesheet",r.href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",r.dataset.btfwBulma="1",document.head.appendChild(r)}if(!document.querySelector("link[data-btfw-fa6]")&&!document.querySelector('link[href*="fontawesome"]')){let r=document.createElement("link");r.rel="stylesheet",r.href="https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",r.dataset.btfwFa6="1",document.head.appendChild(r)}if(!document.getElementById("btfw-modal-zfix-core")){let r=document.createElement("style");r.id="btfw-modal-zfix-core",r.textContent=`
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
      `,document.head.appendChild(r)}}i(),setTimeout(i,400),m(),setTimeout(m,300);try{localStorage.setItem("cytube-layout","fluid"),localStorage.setItem("layout","fluid"),typeof window.setPreferredLayout=="function"&&window.setPreferredLayout("fluid")}catch(r){}return{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let i="btfw:theme:mode",m="btfw:bulma:theme",r=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),s;function l(){if(s)return s;let d=document.getElementById("btfw-bulma-dark-bridge");return d&&d.remove(),s=document.createElement("style"),s.id="btfw-theme-mode-bridge",document.head.appendChild(s),s}let C=`
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
`;function M(d){let w=d==="dark"?"dark":"light",S=document.querySelector('meta[name="color-scheme"]');S||(S=document.createElement("meta"),S.setAttribute("name","color-scheme"),document.head.appendChild(S)),S.setAttribute("content",w)}function x(){try{let d=localStorage.getItem(i);return d||localStorage.getItem(m)||"dark"}catch(d){return"dark"}}function y(d){try{localStorage.setItem(i,d)}catch(w){}}function _(){return r&&r.matches?"dark":"light"}function E(d){let w=d==="auto"?_():d||"dark",S=document.documentElement;S.setAttribute("data-btfw-theme",w),S.classList.toggle("btfw-theme-dark",w==="dark"),M(w);let I=l();I.textContent=w==="dark"?C:""}function n(d){let w=d==="auto"||d==="dark"||d==="light"?d:"dark";y(w),E(w)}function u(){return x()}function h(){!r||!r.addEventListener||r.addEventListener("change",()=>{u()==="auto"&&E("auto")})}function p(){E(x()),h()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p(),{name:"feature:themeMode",setTheme:n,getTheme:u}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async i=>i.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async i=>i.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let i="btfw:grid:leftPx",m="btfw:layout:chatSide",r="btfw-navhost",E="btfw:grid:videoRatio",d=null,w=null,S="right",I=!1,X=!1,$=!1;function at(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function wt(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function ot(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function nt(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return X&&$?0:e}function gt(){let t=at(),e=nt(),a=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-a*2)}function j(t){return Math.max(0,Math.round(t/2)*2)}function R(){let t=document.documentElement,e=nt(),a=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,o=gt();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(o)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(o)}px`);let b=document.getElementById("btfw-leftpad"),g=(I?Math.max(0,window.innerWidth-a*2):(b==null?void 0:b.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!I){let P=o;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(P)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let f=j(ot()),v=j(Math.floor(o/2)),T=Math.max(180,v-f);T=j(Math.min(T,g));let k=T+f,B=v;t.style.setProperty("--btfw-video-chrome-h",`${f}px`),t.style.setProperty("--btfw-videowrap-max-h",`${T}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${k}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${B}px`),t.style.setProperty("--btfw-video-row-h",`${k}px`),t.style.setProperty("--btfw-video-max-h",`${k}px`)}function N(){if(!I)return;let t=at(),e=2,a=document.documentElement,o=document.getElementById("btfw-chatcol"),b=document.getElementById("btfw-leftpad");if(!o||!b)return;let c=o.getBoundingClientRect().bottom;if(c<=t-e)return;let g=c-(t-e),f=ot(),v=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-chat-row-h"))||o.getBoundingClientRect().height||0,T=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(a).getPropertyValue("--btfw-video-row-h"))||0,k=Math.max(0,T-f),B=P=>{let L=Math.max(180,Math.floor(P)),O=L+f;a.style.setProperty("--btfw-videowrap-max-h",`${L}px`),a.style.setProperty("--btfw-vertical-video-row-h",`${O}px`),a.style.setProperty("--btfw-video-row-h",`${O}px`),a.style.setProperty("--btfw-video-max-h",`${O}px`)};if(v>180){let P=Math.min(g,v-180);a.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(v-P)}px`);let L=g-P;L>0&&k>180&&B(k-L),H();return}k>180&&(B(k-g),H())}function rt(t={}){var c;let e=document.getElementById("btfw-grid"),a=document.getElementById("btfw-leftpad"),o=document.getElementById("btfw-stack"),b=(c=t.allHidden)!=null?c:wt();e&&e.classList.toggle("btfw-grid--stack-hidden",b),a&&a.classList.toggle("btfw-leftpad--stack-hidden",b),o&&o.classList.toggle("btfw-stack--all-hidden",b)}function H(){var a;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(o=>{o.style.removeProperty("height"),o.style.removeProperty("width"),o.style.removeProperty("maxHeight"),o.style.removeProperty("maxWidth"),o.style.removeProperty("top"),o.style.removeProperty("left"),o.style.removeProperty("right"),o.style.removeProperty("bottom"),o.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let o=e.player||e.player_||window.videojs&&(((a=window.videojs.players)==null?void 0:a[e.id])||window.videojs(e.id));if(o)try{typeof o.trigger=="function"&&o.trigger("componentresize"),o.tech_&&typeof o.tech_.trigger=="function"&&o.tech_.trigger("resize"),typeof o.resize=="function"&&o.resize()}catch(b){}}}function yt(){try{return localStorage.getItem(m)==="left"?"left":"right"}catch(t){return"right"}}function vt(){try{let t=parseFloat(localStorage.getItem(E)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){w=t;return}let e=parseInt(localStorage.getItem(i)||"",10);if(!isNaN(e)&&e>=520){d=e;let a=Math.max(window.innerWidth-20,880);st(e/a)}}catch(t){d=null,w=null}}function V(t){return Math.min(.78,Math.max(.35,t))}function it(t){var b;let e=(b=t==null?void 0:t.getBoundingClientRect)==null?void 0:b.call(t),a=(e==null?void 0:e.width)||window.innerWidth||0,o=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(a-o,880)}function _t(t){let e=it(t),a=w!==null?w:.62;if(e>0){let o=520/e,b=(e-360)/e;a=Math.min(Math.max(a,o),b)}return V(a)}function st(t){w=V(t);try{localStorage.setItem(E,String(w))}catch(e){}}function Et(t){let e=V(t),a=1-e,o=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*o))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(a*o))}fr)`}}function D(){let t=document.getElementById("btfw-grid");if(!t)return;if(I){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:a}=Et(_t(t)),o=S==="left"?`${a} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${a}`;t.style.gridTemplateColumns=o,t.classList.toggle("btfw-grid--chat-left",S==="left"),t.classList.toggle("btfw-grid--chat-right",S!=="left")}function St(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),a=it(e),o=Math.min(Math.max(t,520),a-360);d=o,st(o/a);try{localStorage.setItem(i,String(o))}catch(b){}D()}function xt(){let t=window.innerWidth,o=Math.max(520,t*V(w!==null?w:.62))+360+20;return Math.min(Math.max(o,900),1100)}function It(){let t=window.innerWidth,e=xt();return I?t<e+40:t<e}function W(){let t=document.getElementById("btfw-stack");if(!t)return;if(I){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let g=document.getElementById("btfw-grid"),f=document.getElementById("btfw-chatcol");if(!g||!f)return;(t.parentElement!==g||t.previousElementSibling!==f)&&(f.nextSibling?g.insertBefore(t,f.nextSibling):g.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let a=document.getElementById("btfw-video-stage"),o=document.getElementById("videowrap"),b=document.getElementById("btfw-video-overlay"),c=a||(b&&b.parentElement===e?b:o);c&&c.parentElement===e?c.nextSibling!==t&&(c.nextSibling?e.insertBefore(t,c.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function z(){let t=document.getElementById("btfw-grid");if(!t)return;let e=It();e!==I?(I=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),W(),F(),setTimeout(()=>{F();try{window.dispatchEvent(new Event("resize"))}catch(a){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):W(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),D(),A(),R(),rt(),F(),ct(),requestAnimationFrame(()=>{R(),N(),F()})}function A(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),a=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",a),document.documentElement.style.setProperty("--btfw-top",a);let o=X&&$?"0px":a;document.documentElement.style.setProperty("--btfw-top-effective",o);let b=document.getElementById("btfw-chatcol");b&&(b.style.removeProperty("top"),b.style.removeProperty("height"))}function kt(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let a=!1,o=null;function b(f){if(!a||o!==null&&f.pointerId!==o)return;if(I){c();return}let v=t.getBoundingClientRect(),k=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,B;if(S==="left"){let P=f.clientX-v.left,L=Math.max(P-k/2,0),O=v.width-L-k;if(O<520||L<360)return;B=O}else{B=f.clientX-v.left;let P=v.width-B-k;if(B<520||P<360)return}Number.isFinite(B)&&St(B)}function c(){if(!a)return;let f=o;a=!1,o=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",b),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c),window.removeEventListener("blur",c),document.removeEventListener("visibilitychange",g);try{f!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(f)}catch(v){}z()}function g(){document.visibilityState==="hidden"&&c()}e.addEventListener("pointerdown",f=>{if(!(I||f.button!==0)){a=!0,o=f.pointerId,f.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(f.pointerId)}catch(v){}e.addEventListener("pointermove",b),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),window.addEventListener("blur",c),document.addEventListener("visibilitychange",g)}})}let lt=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function Ct(t){t&&((t.classList||[]).forEach(e=>{lt.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(a=>{lt.test(a)&&e.classList.remove(a)})}))}function Mt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),a=document.querySelector("#chatwrap .btfw-chat-topbar");if(a){let o=a.querySelector("#btfw-nowplaying-slot");o||(o=document.createElement("div"),o.id="btfw-nowplaying-slot",o.className="btfw-chat-title",a.innerHTML="",a.appendChild(o)),e?(o.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Tt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e||(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage"),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let a=document.getElementById("videowrap"),o=document.getElementById("btfw-video-overlay");a&&a.parentElement!==e&&e.appendChild(a),o&&o.parentElement!==e&&e.appendChild(o)}function Bt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),a=document.getElementById("chatwrap"),o=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let c=document.getElementById("btfw-leftpad"),g=document.getElementById("btfw-chatcol"),f=document.getElementById("videowrap"),v=document.getElementById("chatwrap"),T=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),k=document.getElementById("btfw-grid");ut(k),f&&!c.contains(f)&&c.appendChild(f),T&&!c.contains(T)&&c.appendChild(T),v&&!g.contains(v)&&g.appendChild(v)}else{let c=document.createElement("div");c.id="btfw-grid",c.setAttribute("data-testid","btfw-grid");let g=document.createElement("div");g.id="btfw-leftpad";let f=document.createElement("aside");f.id="btfw-chatcol",e&&g.appendChild(e),o&&g.appendChild(o),a&&f.appendChild(a);let v=document.createElement("div");v.id="btfw-vsplit",ut(c),c.appendChild(g),c.appendChild(v),c.appendChild(f),c.style.opacity="0",t.prepend(c)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(c=>Ct(document.getElementById(c))),Mt();let b=document.getElementById("btfw-leftpad");Tt(b),W()}function Pt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),z(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function Lt(){Bt();let t=()=>{A(),kt(),Pt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let G=0,K=0,Y=0;function F(){Y||(Y=requestAnimationFrame(()=>{Y=0,H()}))}function At(){K||(K=requestAnimationFrame(()=>{K=0,I&&(R(),N(),F())}))}function dt(){G||(G=requestAnimationFrame(()=>{G=0,z()}))}function ct(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{I&&At()}).observe(t)}document.addEventListener("btfw:layoutReady",ct);function mt(){vt(),S=yt(),D(),A();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(A,0),dt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(A,0),dt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{S=t&&t.detail&&t.detail.side==="left"?"left":"right",D(),z()}),document.addEventListener("btfw:chat:barsReady",()=>{W()}),document.addEventListener("btfw:layout:stackVisibility",t=>{rt((t==null?void 0:t.detail)||{}),R(),H(),requestAnimationFrame(N)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};X=!!e.active,$=!!e.hidden,A(),R(),H(),requestAnimationFrame(N)});function Ot(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let a=document.querySelector(e);if(a)return a}return null}function ut(t){if(!t)return;let e=Ot();if(!e)return;let a=document.getElementById(r);a||(a=document.createElement("div"),a.id=r,a.className="btfw-navhost"),e.parentElement!==a&&a.appendChild(e),a.parentElement!==t&&t.insertBefore(a,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",mt):mt(),{name:"feature:layout",commitLayout:Lt}});})();
