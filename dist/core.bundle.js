/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var jt=Object.defineProperty;var lt=(n,s)=>{for(var o in s)jt(n,o,{get:s[o],enumerable:!0})};var Z=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),xt=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),_t=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",localSubs:"btfw:video:localsubs",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:Z,EVENTS:xt,LS_KEYS:_t}));function Gt(n){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(n):String(n).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function tt(n){if(n==null)return"";let s=String(n).trim();return s?(s.endsWith(":")&&(s=s.slice(0,-1).trimEnd()),s):""}function St(n,s=document){let o=tt(n);if(!o)return null;let l=s.querySelector(`#userlist li[data-name="${Gt(o)}"]`);if(l)return l;let d=s.querySelectorAll(Z.userlistItem),w=o.toLowerCase();for(let M of d){let u=M.getAttribute&&M.getAttribute("data-name")||""||M.textContent||"";if(!u)continue;let b=tt(u);if(b&&(b.toLowerCase()===w||b.replace(/\s+/g,"").toLowerCase().startsWith(w)))return M}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:St,normalizeUserIdentifier:tt}));var O="btfw-confirm-dialog",kt="btfw-confirm-dialog-style";function Kt(){if(typeof document=="undefined"||document.getElementById(kt))return;let n=document.createElement("style");n.id=kt,n.textContent=`
    #${O} {
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
    #${O}::backdrop {
      background: color-mix(in srgb, var(--btfw-theme-bg, #05060d) 55%, transparent 45%);
      backdrop-filter: blur(4px);
    }
    #${O} .btfw-confirm-body { padding: 22px 24px 8px; }
    #${O} h2 { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: 0.02em; }
    #${O} p {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.5;
      color: color-mix(in srgb, var(--btfw-theme-text, #e8ecfb) 82%, transparent 18%);
    }
    #${O} .btfw-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 18px 24px 22px;
    }
    #${O} button {
      padding: 8px 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.88rem;
    }
    #${O} .btfw-confirm-cancel {
      background: color-mix(in srgb, var(--btfw-theme-surface, #0b111d) 90%, transparent 10%);
      color: var(--btfw-theme-text, #e8ecfb);
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 26%, transparent 74%);
    }
    #${O} .btfw-confirm-ok {
      background: var(--btfw-theme-accent, #6d4df6);
      color: #fff;
    }
  `,document.head.appendChild(n)}function Yt(){Kt();let n=document.getElementById(O);if(n instanceof HTMLDialogElement)return n;let s=document.createElement("dialog");return s.id=O,s.innerHTML=`
    <div class="btfw-confirm-body">
      <h2 data-role="title"></h2>
      <p data-role="message"></p>
    </div>
    <div class="btfw-confirm-actions">
      <button type="button" class="btfw-confirm-cancel" data-role="cancel"></button>
      <button type="button" class="btfw-confirm-ok" data-role="confirm"></button>
    </div>
  `,document.body.appendChild(s),s}function It(n){let{title:s="Discard changes?",message:o,confirmLabel:l="Discard",cancelLabel:d="Cancel"}=n;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(o):!1);let w=Yt();w.open&&w.close();let M=w.querySelector('[data-role="title"]'),x=w.querySelector('[data-role="message"]'),u=w.querySelector('[data-role="cancel"]'),b=w.querySelector('[data-role="confirm"]');return M&&(M.textContent=s),x&&(x.textContent=o),u&&(u.textContent=d),b&&(b.textContent=l),new Promise(k=>{let a=!1,f=()=>{u==null||u.removeEventListener("click",h),b==null||b.removeEventListener("click",c),w.removeEventListener("click",y),w.removeEventListener("close",_)},E=I=>{a||(a=!0,f(),k(I))},h=()=>{w.close()},c=()=>{w.returnValue="confirm",w.close()},y=I=>{I.target===w&&w.close()},_=()=>{E(w.returnValue==="confirm")};u==null||u.addEventListener("click",h),b==null||b.addEventListener("click",c),w.addEventListener("click",y),w.addEventListener("close",_),w.returnValue="",w.showModal(),b==null||b.focus()})}function dt(n){return n.ok===!0}function Mt(n){return n.ok===!1}function U(n){return typeof HTMLElement=="function"&&n instanceof HTMLElement?!0:typeof n=="object"&&n!==null&&"closest"in n&&typeof n.closest=="function"&&"contains"in n&&typeof n.contains=="function"}function Lt(n){return typeof HTMLButtonElement=="function"&&n instanceof HTMLButtonElement?!0:U(n)&&"disabled"in n&&typeof n.disabled=="boolean"}function nt(n,s){n.hidden=!s,s?(n.removeAttribute("aria-hidden"),n.removeAttribute("tabindex")):(n.setAttribute("aria-hidden","true"),n.setAttribute("tabindex","-1"))}function ct(n,s,o){if(!U(n)||o.length===0)return!1;for(let l of o)try{let d=s.querySelector(l);if(U(d)&&d.contains(n)||n.closest(l))return!0}catch(d){}return!1}function Ct(n,s){s?(n.setAttribute("aria-busy","true"),n.disabled=!0):(n.removeAttribute("aria-busy"),n.disabled=!1)}function et(n,s){n&&(n.textContent=s)}function Tt(n){let{modal:s,applyButton:o,sections:l,ignoreRoots:d=[],confirmDiscard:w,statusEl:M}=n,x=new Map,u=new Set,b=new AbortController,k=!1,a=!1,f=[];function E(){return a}function h(){return a?new Promise(m=>{f.push(m)}):Promise.resolve()}function c(){x.clear(),u.clear();for(let m of l)x.set(m.id,m.snapshot());I()}function y(m){if(u.has(m.id))return!0;let C=x.get(m.id);return C===void 0?!0:m.snapshot()!==C}function _(){return l.some(m=>y(m))}function I(){let m=_();m?s.dataset.btfwDirty="1":delete s.dataset.btfwDirty,nt(o,m),m||et(M,"")}function V(){k||a||(k=!0,queueMicrotask(()=>{k=!1,I()}))}function z(m){if(typeof m=="string"&&m.length>0)u.add(m);else for(let C of l)u.add(C.id);V()}async function X(){if(a)return{ok:!1,error:"Apply already in progress"};a=!0,Ct(o,!0),et(M,"");try{let m=l.filter(P=>y(P));if(m.length===0)return nt(o,!1),{ok:!0};let C=null,A=0;for(let P of m)try{let B=await P.apply();dt(B)?(x.set(P.id,P.snapshot()),u.delete(P.id)):(A+=1,C===null&&(C=B.error))}catch(B){A+=1;let at=B instanceof Error?B.message:"Unknown apply error";C===null&&(C=at)}if(I(),A>0){let P=C===null?`Failed to apply ${A} section(s)`:`${C}${A>1?` (+${A-1} more)`:""}`;return et(M,P),{ok:!1,error:P}}return et(M,"Changes applied"),{ok:!0}}finally{Ct(o,!1),a=!1;let m=f;f=[],m.forEach(C=>C())}}function j(){for(let m of l){let C=x.get(m.id);C!==void 0&&m.restore(C)}u.clear(),I()}async function G(){if(await h(),!_())return!0;if(w){if(!await w())return!1}else if(!await It({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return j(),!0}function q(m){ct(m.target,s,d)||V()}s.addEventListener("input",q,{signal:b.signal,capture:!0}),s.addEventListener("change",q,{signal:b.signal,capture:!0});let ot=m=>{_()&&(m.preventDefault(),m.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",ot,{signal:b.signal}),c(),{isDirty:_,isApplying:E,recalculate:I,markDirty:z,captureBaseline:c,applyAll:X,tryClose:G,discard:j,dispose(){b.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:Tt,setApplyButtonVisible:nt,eventTargetIsInsideIgnoredRoot:ct,isHTMLElement:U,isHTMLButtonElement:Lt,isPersistSuccess:dt,isPersistFailure:Mt}));function Pt(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function ft(n,s=document){Object.defineProperty(s,"_btfw_userlist_watch",{configurable:!0,get(){return n.chat.userlistWatch},set(o){n.chat.userlistWatch=o}}),s._btfw_userlist_isOpen=()=>{var o,l;return(l=(o=n.userlist).isOpen)==null?void 0:l.call(o)},s._btfw_userlist_open=(...o)=>{var l,d;return(d=(l=n.userlist).open)==null?void 0:d.call(l,...o)},s._btfw_userlist_close=(...o)=>{var l,d;return(d=(l=n.userlist).close)==null?void 0:d.call(l,...o)},s._btfw_userlist_position=(...o)=>{var l,d;return(d=(l=n.userlist).position)==null?void 0:d.call(l,...o)},s._btfw_nav_setMobileOpen=(...o)=>{var l,d;return(d=(l=n.nav).setMobileOpen)==null?void 0:d.call(l,...o)},s._btfw_nav_toggleMobile=(...o)=>{var l,d;return(d=(l=n.nav).toggleMobile)==null?void 0:d.call(l,...o)},s._btfw_nav_isMobileOpen=(...o)=>{var l,d;return(d=(l=n.nav).isMobileOpen)==null?void 0:d.call(l,...o)},s._btfw_nav_setMenuOpen=(...o)=>{var l,d;return(d=(l=n.nav).setMenuOpen)==null?void 0:d.call(l,...o)},s._btfw_nav_toggleMenu=(...o)=>{var l,d;return(d=(l=n.nav).toggleMenu)==null?void 0:d.call(l,...o)},s._btfw_openThemeSettings=(...o)=>{var l,d;return(d=(l=n.theme).openSettings)==null?void 0:d.call(l,...o)}}BTFW.define("util:state",[],async()=>{let n=Pt();return ft(n),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=n),{name:"util:state",state:n,installLegacyStateShims:ft}});var ut={};lt(ut,{chatEmotesIconHtml:()=>Jt,chatGifIconHtml:()=>Qt,chatGifIconSlotHtml:()=>Zt,chatTopbarHtml:()=>ee,chatUserlistPopoverHtml:()=>ne,chatUsersIconHtml:()=>te});function Jt(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile"></i></span>'}function Qt(){return'<i class="fa-solid fa-gif"></i>'}function Zt(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function te(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function ee(){return`
        <div class="btfw-chat-topbar-left">
          <div class="btfw-chat-title" id="btfw-nowplaying-slot"></div>
        </div>
        <div class="btfw-chat-topbar-actions" id="btfw-chat-topbar-actions"></div>
      `}function ne(){return`
      <div class="btfw-pophead">
        <span>Users</span>
        <button class="btfw-popclose" aria-label="Close">&times;</button>
      </div>
      <div class="btfw-popbody"></div>
    `}var mt={};lt(mt,{addMediaButtonHtml:()=>le,addMediaPanelHtml:()=>oe,panelUndockIconHtml:()=>ie,panelsMenuButtonHtml:()=>re,playlistAddFormHtml:()=>se,stackGroupHeaderHtml:()=>ae});function oe(){return`
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
      `}function ae(n){return`
      <span class="btfw-stack-item__title">${n}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">\u2191</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">\u2193</button>
        </span>
      </div>
    `}function re(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function ie(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function se(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function le(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var pt={};lt(pt,{channelThemeAdminPanelHtml:()=>de,channelThemeTabAnchorHtml:()=>ce});function de(){return`
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
    `}function ce(){return'<span class="fa fa-magic"></span> <span>Theme</span>'}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:ut,stack:mt,channelThemeAdmin:pt}));BTFW.define("util:motion",[],async()=>{let n=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,s=!!(n&&n.matches);if(n){let a=f=>{s=!!f.matches};typeof n.addEventListener=="function"?n.addEventListener("change",a):typeof n.addListener=="function"&&n.addListener(a)}function o(){return s}function l(a){return a?a.split(",").reduce((f,E)=>{let h=parseFloat(E.trim());return Number.isNaN(h)?f:E.trim().endsWith("ms")?Math.max(f,h):Math.max(f,h*1e3)},0):0}function d(a){if(!a||typeof window=="undefined"||!window.getComputedStyle)return 0;let f=getComputedStyle(a),E=l(f.transitionDuration||"0s"),h=l(f.transitionDelay||"0s");return E+h}function w(a){return new Promise(f=>{if(!a||o()){f();return}let E=d(a);if(!E){f();return}let h=!1,c=()=>{h||(h=!0,a.removeEventListener("transitionend",y),f())},y=_=>{_&&_.target!==a||c()};a.addEventListener("transitionend",y),setTimeout(c,E+34)})}function M(a){typeof a=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(a)}):setTimeout(a,32))}function x(a){if(!a)return;let f=a.dataset.btfwModalState;if(f==="open"||f==="opening")return;a.dataset.btfwModalState="opening",a.removeAttribute("aria-hidden"),a.removeAttribute("hidden");let E=()=>{!a||a.dataset.btfwModalState!=="opening"||(a.classList.add("is-active"),a.dataset.btfwModalState="open")};o()?E():M(E)}async function u(a){if(!a)return;let f=a.dataset.btfwModalState;if(f==="closing"||f==="closed")return;a.dataset.btfwModalState="closing",a.setAttribute("aria-hidden","true");let E=a.querySelector(".modal-card, .modal-content, .modal-dialog"),h=a.querySelector(".modal-background, .modal-backdrop");a.classList.remove("is-active"),await Promise.all([w(E),w(h)]),a.dataset.btfwModalState==="closing"&&(a.dataset.btfwModalState="closed",a.setAttribute("hidden",""))}function b(a,f={}){if(!a)return;let E=a.dataset.btfwPopoverState;if(E==="open"||E==="opening")return;a.dataset.btfwPopoverState="opening",a.removeAttribute("hidden"),a.removeAttribute("aria-hidden");let h=f.backdrop;h&&(h.dataset.btfwPopoverState="opening",h.removeAttribute("hidden"),h.removeAttribute("aria-hidden"));let c=()=>{a.dataset.btfwPopoverState==="opening"&&(a.dataset.btfwPopoverState="open",h&&h.dataset.btfwPopoverState==="opening"&&(h.dataset.btfwPopoverState="open"))};o()?c():M(c)}async function k(a,f={}){if(!a)return;let E=a.dataset.btfwPopoverState;if(E==="closing"||E==="closed")return;a.dataset.btfwPopoverState="closing",a.setAttribute("aria-hidden","true");let h=[w(a)],c=f.backdrop;c&&(c.dataset.btfwPopoverState="closing",c.setAttribute("aria-hidden","true"),h.push(w(c))),await Promise.all(h),a.dataset.btfwPopoverState==="closing"&&(a.dataset.btfwPopoverState="closed",a.setAttribute("hidden","")),c&&c.dataset.btfwPopoverState==="closing"&&(c.dataset.btfwPopoverState="closed",c.setAttribute("hidden",""))}return{prefersReducedMotion:o,waitForTransition:w,openModal:x,closeModal:u,openPopover:b,closePopover:k}});BTFW.define("util:tmdb-proxy",[],async()=>{let n="https://empty-bar-d620.movies-storage-a.workers.dev",s="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function o(){var x,u,b,k,a,f,E;try{let h=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((x=h.movieSuggestions)==null?void 0:x.endpoint)||((b=(u=h.integrations)==null?void 0:u.movieSuggestions)==null?void 0:b.endpoint)||((a=(k=h.integrations)==null?void 0:k.movieRequests)==null?void 0:a.endpoint)||((E=(f=h.integrations)==null?void 0:f.tmdbProxy)==null?void 0:E.endpoint)||n).trim().replace(/\/+$/,"")}catch(h){return n}}function l(x,u){let b=x.startsWith("/")?x:`/${x}`,k=new URL(`${o()}${b}`);if(u)for(let[a,f]of Object.entries(u))f==null||f===""||k.searchParams.set(a,String(f));return k.toString()}async function d(x,u={}){let b=await fetch(l(x,u.params),{method:u.method||"GET",headers:u.body?{"Content-Type":"application/json"}:void 0,body:u.body?JSON.stringify(u.body):void 0,signal:u.signal}),k=await b.json().catch(()=>({}));if(!b.ok)throw new Error(k.error||`Worker request failed (${b.status})`);return k}async function w(x,u={},b={}){let k=String(x||"").replace(/^\/+/,"");return d(`/api/tmdb/${k}`,{params:u,signal:b.signal})}function M(){return!!o()}return{getWorkerBase:o,workerFetch:d,tmdbFetch:w,isAvailable:M,MISSING_PROXY_MSG:s}});BTFW.define("feature:styleCore",[],async()=>{function n(){if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(d=>/(bootstrap.*\.css|bootswatch.*slate)/i.test(d.href||""))&&!document.querySelector("link[data-btfw-slate]")){let d=document.createElement("link");d.rel="stylesheet",d.href="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",d.dataset.btfwSlate="1",document.head.insertBefore(d,document.head.firstChild)}}function s(){if(!document.querySelector('link[href*="bulma.min.css"]')&&!document.querySelector("link[data-btfw-bulma]")){let o=document.createElement("link");o.rel="stylesheet",o.href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",o.dataset.btfwBulma="1",document.head.appendChild(o)}if(!document.querySelector("link[data-btfw-fa6]")&&!document.querySelector('link[href*="fontawesome"]')){let o=document.createElement("link");o.rel="stylesheet",o.href="https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",o.dataset.btfwFa6="1",document.head.appendChild(o)}if(!document.getElementById("btfw-modal-zfix-core")){let o=document.createElement("style");o.id="btfw-modal-zfix-core",o.textContent=`
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
      `,document.head.appendChild(o)}}n(),setTimeout(n,400),s(),setTimeout(s,300);try{localStorage.setItem("cytube-layout","fluid"),localStorage.setItem("layout","fluid"),typeof window.setPreferredLayout=="function"&&window.setPreferredLayout("fluid")}catch(o){}return{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let n="btfw:theme:mode",s="btfw:bulma:theme",o=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),l;function d(){if(l)return l;let c=document.getElementById("btfw-bulma-dark-bridge");return c&&c.remove(),l=document.createElement("style"),l.id="btfw-theme-mode-bridge",document.head.appendChild(l),l}let w=`
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
`;function M(c){let y=c==="dark"?"dark":"light",_=document.querySelector('meta[name="color-scheme"]');_||(_=document.createElement("meta"),_.setAttribute("name","color-scheme"),document.head.appendChild(_)),_.setAttribute("content",y)}function x(){try{let c=localStorage.getItem(n);return c||localStorage.getItem(s)||"dark"}catch(c){return"dark"}}function u(c){try{localStorage.setItem(n,c)}catch(y){}}function b(){return o&&o.matches?"dark":"light"}function k(c){let y=c==="auto"?b():c||"dark",_=document.documentElement;_.setAttribute("data-btfw-theme",y),_.classList.toggle("btfw-theme-dark",y==="dark"),M(y);let I=d();I.textContent=y==="dark"?w:""}function a(c){let y=c==="auto"||c==="dark"||c==="light"?c:"dark";u(y),k(y)}function f(){return x()}function E(){!o||!o.addEventListener||o.addEventListener("change",()=>{f()==="auto"&&k("auto")})}function h(){k(x()),E()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h(),{name:"feature:themeMode",setTheme:a,getTheme:f}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let n="btfw:grid:leftPx",s="btfw:layout:chatSide",o="btfw-navhost",k="btfw:grid:videoRatio",c=null,y=null,_="right",I=!1,V=!1,z=!1;function X(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function j(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function G(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function q(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return V&&z?0:e}function ot(){let t=X(),e=q(),r=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-r*2)}function m(t){return Math.max(0,Math.round(t/2)*2)}function C(){let t=document.documentElement,e=q(),r=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,i=ot();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(i)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(i)}px`);let v=document.getElementById("btfw-leftpad"),S=(I?Math.max(0,window.innerWidth-r*2):(v==null?void 0:v.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!I){let D=i;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(D)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let g=m(G()),L=m(Math.floor(i/2)),H=Math.max(180,L-g);H=m(Math.min(H,S));let T=H+g,R=L;t.style.setProperty("--btfw-video-chrome-h",`${g}px`),t.style.setProperty("--btfw-videowrap-max-h",`${H}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${T}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${R}px`),t.style.setProperty("--btfw-video-row-h",`${T}px`),t.style.setProperty("--btfw-video-max-h",`${T}px`)}function A(){if(!I)return;let t=X(),e=2,r=document.documentElement,i=document.getElementById("btfw-chatcol"),v=document.getElementById("btfw-leftpad");if(!i||!v)return;let p=i.getBoundingClientRect().bottom;if(p<=t-e)return;let S=p-(t-e),g=G(),L=parseFloat(getComputedStyle(r).getPropertyValue("--btfw-vertical-chat-row-h"))||i.getBoundingClientRect().height||0,H=parseFloat(getComputedStyle(r).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(r).getPropertyValue("--btfw-video-row-h"))||0,T=Math.max(0,H-g),R=D=>{let F=Math.max(180,Math.floor(D)),W=F+g;r.style.setProperty("--btfw-videowrap-max-h",`${F}px`),r.style.setProperty("--btfw-vertical-video-row-h",`${W}px`),r.style.setProperty("--btfw-video-row-h",`${W}px`),r.style.setProperty("--btfw-video-max-h",`${W}px`)};if(L>180){let D=Math.min(S,L-180);r.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(L-D)}px`);let F=S-D;F>0&&T>180&&R(T-F),B();return}T>180&&(R(T-S),B())}function P(t={}){var p;let e=document.getElementById("btfw-grid"),r=document.getElementById("btfw-leftpad"),i=document.getElementById("btfw-stack"),v=(p=t.allHidden)!=null?p:j();e&&e.classList.toggle("btfw-grid--stack-hidden",v),r&&r.classList.toggle("btfw-leftpad--stack-hidden",v),i&&i.classList.toggle("btfw-stack--all-hidden",v)}function B(){var r;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(i=>{i.style.removeProperty("height"),i.style.removeProperty("width"),i.style.removeProperty("maxHeight"),i.style.removeProperty("maxWidth"),i.style.removeProperty("top"),i.style.removeProperty("left"),i.style.removeProperty("right"),i.style.removeProperty("bottom"),i.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let i=e.player||e.player_||window.videojs&&(((r=window.videojs.players)==null?void 0:r[e.id])||window.videojs(e.id));if(i)try{typeof i.trigger=="function"&&i.trigger("componentresize"),i.tech_&&typeof i.tech_.trigger=="function"&&i.tech_.trigger("resize"),typeof i.resize=="function"&&i.resize()}catch(v){}}}function at(){try{return localStorage.getItem(s)==="left"?"left":"right"}catch(t){return"right"}}function At(){try{let t=parseFloat(localStorage.getItem(k)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){y=t;return}let e=parseInt(localStorage.getItem(n)||"",10);if(!isNaN(e)&&e>=520){c=e;let r=Math.max(window.innerWidth-20,880);ht(e/r)}}catch(t){c=null,y=null}}function K(t){return Math.min(.78,Math.max(.35,t))}function bt(t){var v;let e=(v=t==null?void 0:t.getBoundingClientRect)==null?void 0:v.call(t),r=(e==null?void 0:e.width)||window.innerWidth||0,i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(r-i,880)}function Bt(t){let e=bt(t),r=y!==null?y:.62;if(e>0){let i=520/e,v=(e-360)/e;r=Math.min(Math.max(r,i),v)}return K(r)}function ht(t){y=K(t);try{localStorage.setItem(k,String(y))}catch(e){}}function Ht(t){let e=K(t),r=1-e,i=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*i))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(r*i))}fr)`}}function Y(){let t=document.getElementById("btfw-grid");if(!t)return;if(I){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:r}=Ht(Bt(t)),i=_==="left"?`${r} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${r}`;t.style.gridTemplateColumns=i,t.classList.toggle("btfw-grid--chat-left",_==="left"),t.classList.toggle("btfw-grid--chat-right",_!=="left")}function Rt(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),r=bt(e),i=Math.min(Math.max(t,520),r-360);c=i,ht(i/r);try{localStorage.setItem(n,String(i))}catch(v){}Y()}function Ot(){let t=window.innerWidth,i=Math.max(520,t*K(y!==null?y:.62))+360+20;return Math.min(Math.max(i,900),1100)}function Dt(){let t=window.innerWidth,e=Ot();return I?t<e+40:t<e}function J(){let t=document.getElementById("btfw-stack");if(!t)return;if(I){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let S=document.getElementById("btfw-grid"),g=document.getElementById("btfw-chatcol");if(!S||!g)return;(t.parentElement!==S||t.previousElementSibling!==g)&&(g.nextSibling?S.insertBefore(t,g.nextSibling):S.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let r=document.getElementById("btfw-video-stage"),i=document.getElementById("videowrap"),v=document.getElementById("btfw-video-overlay"),p=r||(v&&v.parentElement===e?v:i);p&&p.parentElement===e?p.nextSibling!==t&&(p.nextSibling?e.insertBefore(t,p.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function Q(){let t=document.getElementById("btfw-grid");if(!t)return;let e=Dt();e!==I?(I=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),J(),$(),setTimeout(()=>{$();try{window.dispatchEvent(new Event("resize"))}catch(r){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):J(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),Y(),N(),C(),P(),$(),yt(),requestAnimationFrame(()=>{C(),A(),$()})}function N(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),r=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",r),document.documentElement.style.setProperty("--btfw-top",r);let i=V&&z?"0px":r;document.documentElement.style.setProperty("--btfw-top-effective",i);let v=document.getElementById("btfw-chatcol");v&&(v.style.removeProperty("top"),v.style.removeProperty("height"))}function Ft(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let r=!1,i=null;function v(g){if(!r||i!==null&&g.pointerId!==i)return;if(I){p();return}let L=t.getBoundingClientRect(),T=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,R;if(_==="left"){let D=g.clientX-L.left,F=Math.max(D-T/2,0),W=L.width-F-T;if(W<520||F<360)return;R=W}else{R=g.clientX-L.left;let D=L.width-R-T;if(R<520||D<360)return}Number.isFinite(R)&&Rt(R)}function p(){if(!r)return;let g=i;r=!1,i=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",v),e.removeEventListener("pointerup",p),e.removeEventListener("pointercancel",p),window.removeEventListener("blur",p),document.removeEventListener("visibilitychange",S);try{g!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(g)}catch(L){}Q()}function S(){document.visibilityState==="hidden"&&p()}e.addEventListener("pointerdown",g=>{if(!(I||g.button!==0)){r=!0,i=g.pointerId,g.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(g.pointerId)}catch(L){}e.addEventListener("pointermove",v),e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),window.addEventListener("blur",p),document.addEventListener("visibilitychange",S)}})}let wt=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function Vt(t){t&&((t.classList||[]).forEach(e=>{wt.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(r=>{wt.test(r)&&e.classList.remove(r)})}))}function Nt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),r=document.querySelector("#chatwrap .btfw-chat-topbar");if(r){let i=r.querySelector("#btfw-nowplaying-slot");i||(i=document.createElement("div"),i.id="btfw-nowplaying-slot",i.className="btfw-chat-title",r.innerHTML="",r.appendChild(i)),e?(i.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Wt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e?e.getAttribute("data-testid")||e.setAttribute("data-testid","btfw-video-stage"):(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage",e.setAttribute("data-testid","btfw-video-stage")),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let r=document.getElementById("videowrap"),i=document.getElementById("btfw-video-overlay");r&&r.parentElement!==e&&e.appendChild(r),i&&i.parentElement!==e&&e.appendChild(i)}function zt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),r=document.getElementById("chatwrap"),i=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let p=document.getElementById("btfw-leftpad"),S=document.getElementById("btfw-chatcol");S&&!S.getAttribute("data-testid")&&S.setAttribute("data-testid","btfw-chatcol");let g=document.getElementById("videowrap"),L=document.getElementById("chatwrap"),H=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),T=document.getElementById("btfw-grid");T&&!T.getAttribute("data-testid")&&T.setAttribute("data-testid","btfw-grid"),Et(T),g&&!p.contains(g)&&p.appendChild(g),H&&!p.contains(H)&&p.appendChild(H),L&&!S.contains(L)&&S.appendChild(L)}else{let p=document.createElement("div");p.id="btfw-grid",p.setAttribute("data-testid","btfw-grid");let S=document.createElement("div");S.id="btfw-leftpad";let g=document.createElement("aside");g.id="btfw-chatcol",g.setAttribute("data-testid","btfw-chatcol"),e&&S.appendChild(e),i&&S.appendChild(i),r&&g.appendChild(r);let L=document.createElement("div");L.id="btfw-vsplit",Et(p),p.appendChild(S),p.appendChild(L),p.appendChild(g),p.style.opacity="0",t.prepend(p)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(p=>Vt(document.getElementById(p))),Nt();let v=document.getElementById("btfw-leftpad");Wt(v),J()}function qt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),Q(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function $t(){zt();let t=()=>{N(),Ft(),qt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let rt=0,it=0,st=0;function $(){st||(st=requestAnimationFrame(()=>{st=0,B()}))}function Ut(){it||(it=requestAnimationFrame(()=>{it=0,I&&(C(),A(),$())}))}function gt(){rt||(rt=requestAnimationFrame(()=>{rt=0,Q()}))}function yt(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{I&&Ut()}).observe(t)}document.addEventListener("btfw:layoutReady",yt);function vt(){At(),_=at(),Y(),N();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(N,0),gt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(N,0),gt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{_=t&&t.detail&&t.detail.side==="left"?"left":"right",Y(),Q()}),document.addEventListener("btfw:chat:barsReady",()=>{J()}),document.addEventListener("btfw:layout:stackVisibility",t=>{P((t==null?void 0:t.detail)||{}),C(),B(),requestAnimationFrame(A)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};V=!!e.active,z=!!e.hidden,N(),C(),B(),requestAnimationFrame(A)});function Xt(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let r=document.querySelector(e);if(r)return r}return null}function Et(t){if(!t)return;let e=Xt();if(!e)return;let r=document.getElementById(o);r||(r=document.createElement("div"),r.id=o,r.className="btfw-navhost"),e.parentElement!==r&&r.appendChild(e),r.parentElement!==t&&t.insertBefore(r,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vt):vt(),{name:"feature:layout",commitLayout:$t}});})();
