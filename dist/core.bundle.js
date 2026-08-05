/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var jt=Object.defineProperty;var lt=(n,l)=>{for(var o in l)jt(n,o,{get:l[o],enumerable:!0})};var Z=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),xt=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),_t=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",localSubs:"btfw:video:localsubs",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:Z,EVENTS:xt,LS_KEYS:_t}));function Gt(n){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(n):String(n).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function tt(n){if(n==null)return"";let l=String(n).trim();return l?(l.endsWith(":")&&(l=l.slice(0,-1).trimEnd()),l):""}function St(n,l=document){let o=tt(n);if(!o)return null;let s=l.querySelector(`#userlist li[data-name="${Gt(o)}"]`);if(s)return s;let d=l.querySelectorAll(Z.userlistItem),f=o.toLowerCase();for(let _ of d){let m=_.getAttribute&&_.getAttribute("data-name")||""||_.textContent||"";if(!m)continue;let h=tt(m);if(h&&(h.toLowerCase()===f||h.replace(/\s+/g,"").toLowerCase().startsWith(f)))return _}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:St,normalizeUserIdentifier:tt}));var O="btfw-confirm-dialog",kt="btfw-confirm-dialog-style";function Kt(){if(typeof document=="undefined"||document.getElementById(kt))return;let n=document.createElement("style");n.id=kt,n.textContent=`
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
  `,document.head.appendChild(n)}function Yt(){Kt();let n=document.getElementById(O);if(n instanceof HTMLDialogElement)return n;let l=document.createElement("dialog");l.id=O;let o=document.createElement("div");o.className="btfw-confirm-body";let s=document.createElement("h2");s.dataset.role="title";let d=document.createElement("p");d.dataset.role="message",o.append(s,d);let f=document.createElement("div");f.className="btfw-confirm-actions";let _=document.createElement("button");_.type="button",_.className="btfw-confirm-cancel",_.dataset.role="cancel";let y=document.createElement("button");return y.type="button",y.className="btfw-confirm-ok",y.dataset.role="confirm",f.append(_,y),l.append(o,f),document.body.appendChild(l),l}function It(n){let{title:l="Discard changes?",message:o,confirmLabel:s="Discard",cancelLabel:d="Cancel"}=n;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(o):!1);let f=Yt();f.open&&f.close();let _=f.querySelector('[data-role="title"]'),y=f.querySelector('[data-role="message"]'),m=f.querySelector('[data-role="cancel"]'),h=f.querySelector('[data-role="confirm"]');return _&&(_.textContent=l),y&&(y.textContent=o),m&&(m.textContent=d),h&&(h.textContent=s),new Promise(I=>{let a=!1,u=()=>{m==null||m.removeEventListener("click",w),h==null||h.removeEventListener("click",c),f.removeEventListener("click",v),f.removeEventListener("close",S)},x=C=>{a||(a=!0,u(),I(C))},w=()=>{f.close()},c=()=>{f.returnValue="confirm",f.close()},v=C=>{C.target===f&&f.close()},S=()=>{x(f.returnValue==="confirm")};m==null||m.addEventListener("click",w),h==null||h.addEventListener("click",c),f.addEventListener("click",v),f.addEventListener("close",S),f.returnValue="",f.showModal(),h==null||h.focus()})}function dt(n){return n.ok===!0}function Mt(n){return n.ok===!1}function U(n){return typeof HTMLElement=="function"&&n instanceof HTMLElement?!0:typeof n=="object"&&n!==null&&"closest"in n&&typeof n.closest=="function"&&"contains"in n&&typeof n.contains=="function"}function Lt(n){return typeof HTMLButtonElement=="function"&&n instanceof HTMLButtonElement?!0:U(n)&&"disabled"in n&&typeof n.disabled=="boolean"}function nt(n,l){n.hidden=!l,l?(n.removeAttribute("aria-hidden"),n.removeAttribute("tabindex")):(n.setAttribute("aria-hidden","true"),n.setAttribute("tabindex","-1"))}function ct(n,l,o){if(!U(n)||o.length===0)return!1;for(let s of o)try{let d=l.querySelector(s);if(U(d)&&d.contains(n)||n.closest(s))return!0}catch(d){}return!1}function Ct(n,l){l?(n.setAttribute("aria-busy","true"),n.disabled=!0):(n.removeAttribute("aria-busy"),n.disabled=!1)}function et(n,l){n&&(n.textContent=l)}function Tt(n){let{modal:l,applyButton:o,sections:s,ignoreRoots:d=[],confirmDiscard:f,statusEl:_}=n,y=new Map,m=new Set,h=new AbortController,I=!1,a=!1,u=[];function x(){return a}function w(){return a?new Promise(p=>{u.push(p)}):Promise.resolve()}function c(){y.clear(),m.clear();for(let p of s)y.set(p.id,p.snapshot());C()}function v(p){if(m.has(p.id))return!0;let M=y.get(p.id);return M===void 0?!0:p.snapshot()!==M}function S(){return s.some(p=>v(p))}function C(){let p=S();p?l.dataset.btfwDirty="1":delete l.dataset.btfwDirty,nt(o,p),p||et(_,"")}function V(){I||a||(I=!0,queueMicrotask(()=>{I=!1,C()}))}function z(p){if(typeof p=="string"&&p.length>0)m.add(p);else for(let M of s)m.add(M.id);V()}async function X(){if(a)return{ok:!1,error:"Apply already in progress"};a=!0,Ct(o,!0),et(_,"");try{let p=s.filter(P=>v(P));if(p.length===0)return nt(o,!1),{ok:!0};let M=null,B=0;for(let P of p)try{let A=await P.apply();dt(A)?(y.set(P.id,P.snapshot()),m.delete(P.id)):(B+=1,M===null&&(M=A.error))}catch(A){B+=1;let at=A instanceof Error?A.message:"Unknown apply error";M===null&&(M=at)}if(C(),B>0){let P=M===null?`Failed to apply ${B} section(s)`:`${M}${B>1?` (+${B-1} more)`:""}`;return et(_,P),{ok:!1,error:P}}return et(_,"Changes applied"),{ok:!0}}finally{Ct(o,!1),a=!1;let p=u;u=[],p.forEach(M=>M())}}function j(){for(let p of s){let M=y.get(p.id);M!==void 0&&p.restore(M)}m.clear(),C()}async function G(){if(await w(),!S())return!0;if(f){if(!await f())return!1}else if(!await It({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return j(),!0}function q(p){ct(p.target,l,d)||V()}l.addEventListener("input",q,{signal:h.signal,capture:!0}),l.addEventListener("change",q,{signal:h.signal,capture:!0});let ot=p=>{S()&&(p.preventDefault(),p.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",ot,{signal:h.signal}),c(),{isDirty:S,isApplying:x,recalculate:C,markDirty:z,captureBaseline:c,applyAll:X,tryClose:G,discard:j,dispose(){h.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:Tt,setApplyButtonVisible:nt,eventTargetIsInsideIgnoredRoot:ct,isHTMLElement:U,isHTMLButtonElement:Lt,isPersistSuccess:dt,isPersistFailure:Mt}));function Pt(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function ut(n,l=document){Object.defineProperty(l,"_btfw_userlist_watch",{configurable:!0,get(){return n.chat.userlistWatch},set(o){n.chat.userlistWatch=o}}),l._btfw_userlist_isOpen=()=>{var o,s;return(s=(o=n.userlist).isOpen)==null?void 0:s.call(o)},l._btfw_userlist_open=(...o)=>{var s,d;return(d=(s=n.userlist).open)==null?void 0:d.call(s,...o)},l._btfw_userlist_close=(...o)=>{var s,d;return(d=(s=n.userlist).close)==null?void 0:d.call(s,...o)},l._btfw_userlist_position=(...o)=>{var s,d;return(d=(s=n.userlist).position)==null?void 0:d.call(s,...o)},l._btfw_nav_setMobileOpen=(...o)=>{var s,d;return(d=(s=n.nav).setMobileOpen)==null?void 0:d.call(s,...o)},l._btfw_nav_toggleMobile=(...o)=>{var s,d;return(d=(s=n.nav).toggleMobile)==null?void 0:d.call(s,...o)},l._btfw_nav_isMobileOpen=(...o)=>{var s,d;return(d=(s=n.nav).isMobileOpen)==null?void 0:d.call(s,...o)},l._btfw_nav_setMenuOpen=(...o)=>{var s,d;return(d=(s=n.nav).setMenuOpen)==null?void 0:d.call(s,...o)},l._btfw_nav_toggleMenu=(...o)=>{var s,d;return(d=(s=n.nav).toggleMenu)==null?void 0:d.call(s,...o)},l._btfw_openThemeSettings=(...o)=>{var s,d;return(d=(s=n.theme).openSettings)==null?void 0:d.call(s,...o)}}BTFW.define("util:state",[],async()=>{let n=Pt();return ut(n),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=n),{name:"util:state",state:n,installLegacyStateShims:ut}});var ft={};lt(ft,{chatEmotesIconHtml:()=>Jt,chatGifIconHtml:()=>Qt,chatGifIconSlotHtml:()=>Zt,chatTopbarHtml:()=>ee,chatUserlistPopoverHtml:()=>ne,chatUsersIconHtml:()=>te});function Jt(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile"></i></span>'}function Qt(){return'<i class="fa-solid fa-gif"></i>'}function Zt(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function te(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function ee(){return`
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
    `}var mt={};lt(mt,{addMediaButtonHtml:()=>de,addMediaPanelHtml:()=>ae,panelUndockIconHtml:()=>se,panelsMenuButtonHtml:()=>ie,playlistAddFormHtml:()=>le,stackGroupHeaderHtml:()=>re});function oe(n){return n==null?"":String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ae(){return`
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
      `}function re(n){return`
      <span class="btfw-stack-item__title">${oe(n)}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">\u2191</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">\u2193</button>
        </span>
      </div>
    `}function ie(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function se(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function le(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function de(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var pt={};lt(pt,{channelThemeAdminPanelHtml:()=>ce});function ce(){return`
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
    `}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:ft,stack:mt,channelThemeAdmin:pt}));BTFW.define("util:motion",[],async()=>{let n=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,l=!!(n&&n.matches);if(n){let a=u=>{l=!!u.matches};typeof n.addEventListener=="function"?n.addEventListener("change",a):typeof n.addListener=="function"&&n.addListener(a)}function o(){return l}function s(a){return a?a.split(",").reduce((u,x)=>{let w=parseFloat(x.trim());return Number.isNaN(w)?u:x.trim().endsWith("ms")?Math.max(u,w):Math.max(u,w*1e3)},0):0}function d(a){if(!a||typeof window=="undefined"||!window.getComputedStyle)return 0;let u=getComputedStyle(a),x=s(u.transitionDuration||"0s"),w=s(u.transitionDelay||"0s");return x+w}function f(a){return new Promise(u=>{if(!a||o()){u();return}let x=d(a);if(!x){u();return}let w=!1,c=()=>{w||(w=!0,a.removeEventListener("transitionend",v),u())},v=S=>{S&&S.target!==a||c()};a.addEventListener("transitionend",v),setTimeout(c,x+34)})}function _(a){typeof a=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(a)}):setTimeout(a,32))}function y(a){if(!a)return;let u=a.dataset.btfwModalState;if(u==="open"||u==="opening")return;a.dataset.btfwModalState="opening",a.removeAttribute("aria-hidden"),a.removeAttribute("hidden");let x=()=>{!a||a.dataset.btfwModalState!=="opening"||(a.classList.add("is-active"),a.dataset.btfwModalState="open")};o()?x():_(x)}async function m(a){if(!a)return;let u=a.dataset.btfwModalState;if(u==="closing"||u==="closed")return;a.dataset.btfwModalState="closing",a.setAttribute("aria-hidden","true");let x=a.querySelector(".modal-card, .modal-content, .modal-dialog"),w=a.querySelector(".modal-background, .modal-backdrop");a.classList.remove("is-active"),await Promise.all([f(x),f(w)]),a.dataset.btfwModalState==="closing"&&(a.dataset.btfwModalState="closed",a.setAttribute("hidden",""))}function h(a,u={}){if(!a)return;let x=a.dataset.btfwPopoverState;if(x==="open"||x==="opening")return;a.dataset.btfwPopoverState="opening",a.removeAttribute("hidden"),a.removeAttribute("aria-hidden");let w=u.backdrop;w&&(w.dataset.btfwPopoverState="opening",w.removeAttribute("hidden"),w.removeAttribute("aria-hidden"));let c=()=>{a.dataset.btfwPopoverState==="opening"&&(a.dataset.btfwPopoverState="open",w&&w.dataset.btfwPopoverState==="opening"&&(w.dataset.btfwPopoverState="open"))};o()?c():_(c)}async function I(a,u={}){if(!a)return;let x=a.dataset.btfwPopoverState;if(x==="closing"||x==="closed")return;a.dataset.btfwPopoverState="closing",a.setAttribute("aria-hidden","true");let w=[f(a)],c=u.backdrop;c&&(c.dataset.btfwPopoverState="closing",c.setAttribute("aria-hidden","true"),w.push(f(c))),await Promise.all(w),a.dataset.btfwPopoverState==="closing"&&(a.dataset.btfwPopoverState="closed",a.setAttribute("hidden","")),c&&c.dataset.btfwPopoverState==="closing"&&(c.dataset.btfwPopoverState="closed",c.setAttribute("hidden",""))}return{prefersReducedMotion:o,waitForTransition:f,openModal:y,closeModal:m,openPopover:h,closePopover:I}});BTFW.define("util:tmdb-proxy",[],async()=>{let n="https://empty-bar-d620.movies-storage-a.workers.dev",l="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function o(){var y,m,h,I,a,u,x;try{let w=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((y=w.movieSuggestions)==null?void 0:y.endpoint)||((h=(m=w.integrations)==null?void 0:m.movieSuggestions)==null?void 0:h.endpoint)||((a=(I=w.integrations)==null?void 0:I.movieRequests)==null?void 0:a.endpoint)||((x=(u=w.integrations)==null?void 0:u.tmdbProxy)==null?void 0:x.endpoint)||n).trim().replace(/\/+$/,"")}catch(w){return n}}function s(y,m){let h=y.startsWith("/")?y:`/${y}`,I=new URL(`${o()}${h}`);if(m)for(let[a,u]of Object.entries(m))u==null||u===""||I.searchParams.set(a,String(u));return I.toString()}async function d(y,m={}){let h=await fetch(s(y,m.params),{method:m.method||"GET",headers:m.body?{"Content-Type":"application/json"}:void 0,body:m.body?JSON.stringify(m.body):void 0,signal:m.signal}),I=await h.json().catch(()=>({}));if(!h.ok)throw new Error(I.error||`Worker request failed (${h.status})`);return I}async function f(y,m={},h={}){let I=String(y||"").replace(/^\/+/,"");return d(`/api/tmdb/${I}`,{params:m,signal:h.signal})}function _(){return!!o()}return{getWorkerBase:o,workerFetch:d,tmdbFetch:f,isAvailable:_,MISSING_PROXY_MSG:l}});BTFW.define("feature:styleCore",[],async()=>{function n(){if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(d=>/(bootstrap.*\.css|bootswatch.*slate)/i.test(d.href||""))&&!document.querySelector("link[data-btfw-slate]")){let d=document.createElement("link");d.rel="stylesheet",d.href="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",d.dataset.btfwSlate="1",document.head.insertBefore(d,document.head.firstChild)}}function l(){if(!document.querySelector('link[href*="bulma.min.css"]')&&!document.querySelector("link[data-btfw-bulma]")){let o=document.createElement("link");o.rel="stylesheet",o.href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",o.dataset.btfwBulma="1",document.head.appendChild(o)}if(!document.querySelector("link[data-btfw-fa6]")&&!document.querySelector('link[href*="fontawesome"]')){let o=document.createElement("link");o.rel="stylesheet",o.href="https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",o.dataset.btfwFa6="1",document.head.appendChild(o)}if(!document.getElementById("btfw-modal-zfix-core")){let o=document.createElement("style");o.id="btfw-modal-zfix-core",o.textContent=`
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
      `,document.head.appendChild(o)}}n(),setTimeout(n,400),l(),setTimeout(l,300);try{localStorage.setItem("cytube-layout","fluid"),localStorage.setItem("layout","fluid"),typeof window.setPreferredLayout=="function"&&window.setPreferredLayout("fluid")}catch(o){}return{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let n="btfw:theme:mode",l="btfw:bulma:theme",o=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),s;function d(){if(s)return s;let c=document.getElementById("btfw-bulma-dark-bridge");return c&&c.remove(),s=document.createElement("style"),s.id="btfw-theme-mode-bridge",document.head.appendChild(s),s}let f=`
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
`;function _(c){let v=c==="dark"?"dark":"light",S=document.querySelector('meta[name="color-scheme"]');S||(S=document.createElement("meta"),S.setAttribute("name","color-scheme"),document.head.appendChild(S)),S.setAttribute("content",v)}function y(){try{let c=localStorage.getItem(n);return c||localStorage.getItem(l)||"dark"}catch(c){return"dark"}}function m(c){try{localStorage.setItem(n,c)}catch(v){}}function h(){return o&&o.matches?"dark":"light"}function I(c){let v=c==="auto"?h():c||"dark",S=document.documentElement;S.setAttribute("data-btfw-theme",v),S.classList.toggle("btfw-theme-dark",v==="dark"),_(v);let C=d();C.textContent=v==="dark"?f:""}function a(c){let v=c==="auto"||c==="dark"||c==="light"?c:"dark";m(v),I(v)}function u(){return y()}function x(){!o||!o.addEventListener||o.addEventListener("change",()=>{u()==="auto"&&I("auto")})}function w(){I(y()),x()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",w):w(),{name:"feature:themeMode",setTheme:a,getTheme:u}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let n="btfw:grid:leftPx",l="btfw:layout:chatSide",o="btfw-navhost",I="btfw:grid:videoRatio",c=null,v=null,S="right",C=!1,V=!1,z=!1;function X(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function j(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function G(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function q(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return V&&z?0:e}function ot(){let t=X(),e=q(),r=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-r*2)}function p(t){return Math.max(0,Math.round(t/2)*2)}function M(){let t=document.documentElement,e=q(),r=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,i=ot();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(i)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(i)}px`);let E=document.getElementById("btfw-leftpad"),k=(C?Math.max(0,window.innerWidth-r*2):(E==null?void 0:E.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!C){let D=i;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(D)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let g=p(G()),L=p(Math.floor(i/2)),R=Math.max(180,L-g);R=p(Math.min(R,k));let T=R+g,H=L;t.style.setProperty("--btfw-video-chrome-h",`${g}px`),t.style.setProperty("--btfw-videowrap-max-h",`${R}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${T}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${H}px`),t.style.setProperty("--btfw-video-row-h",`${T}px`),t.style.setProperty("--btfw-video-max-h",`${T}px`)}function B(){if(!C)return;let t=X(),e=2,r=document.documentElement,i=document.getElementById("btfw-chatcol"),E=document.getElementById("btfw-leftpad");if(!i||!E)return;let b=i.getBoundingClientRect().bottom;if(b<=t-e)return;let k=b-(t-e),g=G(),L=parseFloat(getComputedStyle(r).getPropertyValue("--btfw-vertical-chat-row-h"))||i.getBoundingClientRect().height||0,R=parseFloat(getComputedStyle(r).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(r).getPropertyValue("--btfw-video-row-h"))||0,T=Math.max(0,R-g),H=D=>{let F=Math.max(180,Math.floor(D)),W=F+g;r.style.setProperty("--btfw-videowrap-max-h",`${F}px`),r.style.setProperty("--btfw-vertical-video-row-h",`${W}px`),r.style.setProperty("--btfw-video-row-h",`${W}px`),r.style.setProperty("--btfw-video-max-h",`${W}px`)};if(L>180){let D=Math.min(k,L-180);r.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(L-D)}px`);let F=k-D;F>0&&T>180&&H(T-F),A();return}T>180&&(H(T-k),A())}function P(t={}){var b;let e=document.getElementById("btfw-grid"),r=document.getElementById("btfw-leftpad"),i=document.getElementById("btfw-stack"),E=(b=t.allHidden)!=null?b:j();e&&e.classList.toggle("btfw-grid--stack-hidden",E),r&&r.classList.toggle("btfw-leftpad--stack-hidden",E),i&&i.classList.toggle("btfw-stack--all-hidden",E)}function A(){var r;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(i=>{i.style.removeProperty("height"),i.style.removeProperty("width"),i.style.removeProperty("maxHeight"),i.style.removeProperty("maxWidth"),i.style.removeProperty("top"),i.style.removeProperty("left"),i.style.removeProperty("right"),i.style.removeProperty("bottom"),i.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let i=e.player||e.player_||window.videojs&&(((r=window.videojs.players)==null?void 0:r[e.id])||window.videojs(e.id));if(i)try{typeof i.trigger=="function"&&i.trigger("componentresize"),i.tech_&&typeof i.tech_.trigger=="function"&&i.tech_.trigger("resize"),typeof i.resize=="function"&&i.resize()}catch(E){}}}function at(){try{return localStorage.getItem(l)==="left"?"left":"right"}catch(t){return"right"}}function Bt(){try{let t=parseFloat(localStorage.getItem(I)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){v=t;return}let e=parseInt(localStorage.getItem(n)||"",10);if(!isNaN(e)&&e>=520){c=e;let r=Math.max(window.innerWidth-20,880);ht(e/r)}}catch(t){c=null,v=null}}function K(t){return Math.min(.78,Math.max(.35,t))}function bt(t){var E;let e=(E=t==null?void 0:t.getBoundingClientRect)==null?void 0:E.call(t),r=(e==null?void 0:e.width)||window.innerWidth||0,i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(r-i,880)}function At(t){let e=bt(t),r=v!==null?v:.62;if(e>0){let i=520/e,E=(e-360)/e;r=Math.min(Math.max(r,i),E)}return K(r)}function ht(t){v=K(t);try{localStorage.setItem(I,String(v))}catch(e){}}function Rt(t){let e=K(t),r=1-e,i=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*i))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(r*i))}fr)`}}function Y(){let t=document.getElementById("btfw-grid");if(!t)return;if(C){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:r}=Rt(At(t)),i=S==="left"?`${r} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${r}`;t.style.gridTemplateColumns=i,t.classList.toggle("btfw-grid--chat-left",S==="left"),t.classList.toggle("btfw-grid--chat-right",S!=="left")}function Ht(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),r=bt(e),i=Math.min(Math.max(t,520),r-360);c=i,ht(i/r);try{localStorage.setItem(n,String(i))}catch(E){}Y()}function Ot(){let t=window.innerWidth,i=Math.max(520,t*K(v!==null?v:.62))+360+20;return Math.min(Math.max(i,900),1100)}function Dt(){let t=window.innerWidth,e=Ot();return C?t<e+40:t<e}function J(){let t=document.getElementById("btfw-stack");if(!t)return;if(C){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let k=document.getElementById("btfw-grid"),g=document.getElementById("btfw-chatcol");if(!k||!g)return;(t.parentElement!==k||t.previousElementSibling!==g)&&(g.nextSibling?k.insertBefore(t,g.nextSibling):k.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let r=document.getElementById("btfw-video-stage"),i=document.getElementById("videowrap"),E=document.getElementById("btfw-video-overlay"),b=r||(E&&E.parentElement===e?E:i);b&&b.parentElement===e?b.nextSibling!==t&&(b.nextSibling?e.insertBefore(t,b.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function Q(){let t=document.getElementById("btfw-grid");if(!t)return;let e=Dt();e!==C?(C=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),J(),$(),setTimeout(()=>{$();try{window.dispatchEvent(new Event("resize"))}catch(r){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):J(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),Y(),N(),M(),P(),$(),yt(),requestAnimationFrame(()=>{M(),B(),$()})}function N(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),r=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",r),document.documentElement.style.setProperty("--btfw-top",r);let i=V&&z?"0px":r;document.documentElement.style.setProperty("--btfw-top-effective",i);let E=document.getElementById("btfw-chatcol");E&&(E.style.removeProperty("top"),E.style.removeProperty("height"))}function Ft(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let r=!1,i=null;function E(g){if(!r||i!==null&&g.pointerId!==i)return;if(C){b();return}let L=t.getBoundingClientRect(),T=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,H;if(S==="left"){let D=g.clientX-L.left,F=Math.max(D-T/2,0),W=L.width-F-T;if(W<520||F<360)return;H=W}else{H=g.clientX-L.left;let D=L.width-H-T;if(H<520||D<360)return}Number.isFinite(H)&&Ht(H)}function b(){if(!r)return;let g=i;r=!1,i=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",E),e.removeEventListener("pointerup",b),e.removeEventListener("pointercancel",b),window.removeEventListener("blur",b),document.removeEventListener("visibilitychange",k);try{g!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(g)}catch(L){}Q()}function k(){document.visibilityState==="hidden"&&b()}e.addEventListener("pointerdown",g=>{if(!(C||g.button!==0)){r=!0,i=g.pointerId,g.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(g.pointerId)}catch(L){}e.addEventListener("pointermove",E),e.addEventListener("pointerup",b),e.addEventListener("pointercancel",b),window.addEventListener("blur",b),document.addEventListener("visibilitychange",k)}})}let wt=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function Vt(t){t&&((t.classList||[]).forEach(e=>{wt.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(r=>{wt.test(r)&&e.classList.remove(r)})}))}function Nt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),r=document.querySelector("#chatwrap .btfw-chat-topbar");if(r){let i=r.querySelector("#btfw-nowplaying-slot");i||(i=document.createElement("div"),i.id="btfw-nowplaying-slot",i.className="btfw-chat-title",r.innerHTML="",r.appendChild(i)),e?(i.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Wt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e?e.getAttribute("data-testid")||e.setAttribute("data-testid","btfw-video-stage"):(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage",e.setAttribute("data-testid","btfw-video-stage")),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let r=document.getElementById("videowrap"),i=document.getElementById("btfw-video-overlay");r&&r.parentElement!==e&&e.appendChild(r),i&&i.parentElement!==e&&e.appendChild(i)}function zt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),r=document.getElementById("chatwrap"),i=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let b=document.getElementById("btfw-leftpad"),k=document.getElementById("btfw-chatcol");k&&!k.getAttribute("data-testid")&&k.setAttribute("data-testid","btfw-chatcol");let g=document.getElementById("videowrap"),L=document.getElementById("chatwrap"),R=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),T=document.getElementById("btfw-grid");T&&!T.getAttribute("data-testid")&&T.setAttribute("data-testid","btfw-grid"),Et(T),g&&!b.contains(g)&&b.appendChild(g),R&&!b.contains(R)&&b.appendChild(R),L&&!k.contains(L)&&k.appendChild(L)}else{let b=document.createElement("div");b.id="btfw-grid",b.setAttribute("data-testid","btfw-grid");let k=document.createElement("div");k.id="btfw-leftpad";let g=document.createElement("aside");g.id="btfw-chatcol",g.setAttribute("data-testid","btfw-chatcol"),e&&k.appendChild(e),i&&k.appendChild(i),r&&g.appendChild(r);let L=document.createElement("div");L.id="btfw-vsplit",Et(b),b.appendChild(k),b.appendChild(L),b.appendChild(g),b.style.opacity="0",t.prepend(b)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(b=>Vt(document.getElementById(b))),Nt();let E=document.getElementById("btfw-leftpad");Wt(E),J()}function qt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),Q(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function $t(){zt();let t=()=>{N(),Ft(),qt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let rt=0,it=0,st=0;function $(){st||(st=requestAnimationFrame(()=>{st=0,A()}))}function Ut(){it||(it=requestAnimationFrame(()=>{it=0,C&&(M(),B(),$())}))}function gt(){rt||(rt=requestAnimationFrame(()=>{rt=0,Q()}))}function yt(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{C&&Ut()}).observe(t)}document.addEventListener("btfw:layoutReady",yt);function vt(){Bt(),S=at(),Y(),N();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(N,0),gt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(N,0),gt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{S=t&&t.detail&&t.detail.side==="left"?"left":"right",Y(),Q()}),document.addEventListener("btfw:chat:barsReady",()=>{J()}),document.addEventListener("btfw:layout:stackVisibility",t=>{P((t==null?void 0:t.detail)||{}),M(),A(),requestAnimationFrame(B)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};V=!!e.active,z=!!e.hidden,N(),M(),A(),requestAnimationFrame(B)});function Xt(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let r=document.querySelector(e);if(r)return r}return null}function Et(t){if(!t)return;let e=Xt();if(!e)return;let r=document.getElementById(o);r||(r=document.createElement("div"),r.id=o,r.className="btfw-navhost"),e.parentElement!==r&&r.appendChild(e),r.parentElement!==t&&t.insertBefore(r,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vt):vt(),{name:"feature:layout",commitLayout:$t}});})();
