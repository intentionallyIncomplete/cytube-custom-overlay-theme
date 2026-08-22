/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
"use strict";(()=>{var jt=Object.defineProperty;var lt=(n,l)=>{for(var i in l)jt(n,i,{get:l[i],enumerable:!0})};var Z=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),_t=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),xt=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",localSubs:"btfw:video:localsubs",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:Z,EVENTS:_t,LS_KEYS:xt}));function Gt(n){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(n):String(n).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function tt(n){if(n==null)return"";let l=String(n).trim();return l?(l.endsWith(":")&&(l=l.slice(0,-1).trimEnd()),l):""}function St(n,l=document){let i=tt(n);if(!i)return null;let s=l.querySelector(`#userlist li[data-name="${Gt(i)}"]`);if(s)return s;let d=l.querySelectorAll(Z.userlistItem),f=i.toLowerCase();for(let x of d){let m=x.getAttribute&&x.getAttribute("data-name")||""||x.textContent||"";if(!m)continue;let p=tt(m);if(p&&(p.toLowerCase()===f||p.replace(/\s+/g,"").toLowerCase().startsWith(f)))return x}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:St,normalizeUserIdentifier:tt}));var O="btfw-confirm-dialog",kt="btfw-confirm-dialog-style";function Kt(){if(typeof document=="undefined"||document.getElementById(kt))return;let n=document.createElement("style");n.id=kt,n.textContent=`
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
  `,document.head.appendChild(n)}function Yt(){Kt();let n=document.getElementById(O);if(n instanceof HTMLDialogElement)return n;let l=document.createElement("dialog");l.id=O;let i=document.createElement("div");i.className="btfw-confirm-body";let s=document.createElement("h2");s.dataset.role="title";let d=document.createElement("p");d.dataset.role="message",i.append(s,d);let f=document.createElement("div");f.className="btfw-confirm-actions";let x=document.createElement("button");x.type="button",x.className="btfw-confirm-cancel",x.dataset.role="cancel";let v=document.createElement("button");return v.type="button",v.className="btfw-confirm-ok",v.dataset.role="confirm",f.append(x,v),l.append(i,f),document.body.appendChild(l),l}function It(n){let{title:l="Discard changes?",message:i,confirmLabel:s="Discard",cancelLabel:d="Cancel"}=n;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(i):!1);let f=Yt();f.open&&f.close();let x=f.querySelector('[data-role="title"]'),v=f.querySelector('[data-role="message"]'),m=f.querySelector('[data-role="cancel"]'),p=f.querySelector('[data-role="confirm"]');return x&&(x.textContent=l),v&&(v.textContent=i),m&&(m.textContent=d),p&&(p.textContent=s),new Promise(b=>{let o=!1,c=()=>{m==null||m.removeEventListener("click",g),p==null||p.removeEventListener("click",u),f.removeEventListener("click",E),f.removeEventListener("close",k)},S=M=>{o||(o=!0,c(),b(M))},g=()=>{f.close()},u=()=>{f.returnValue="confirm",f.close()},E=M=>{M.target===f&&f.close()},k=()=>{S(f.returnValue==="confirm")};m==null||m.addEventListener("click",g),p==null||p.addEventListener("click",u),f.addEventListener("click",E),f.addEventListener("close",k),f.returnValue="",f.showModal(),p==null||p.focus()})}function dt(n){return n.ok===!0}function Ct(n){return n.ok===!1}function U(n){return typeof HTMLElement=="function"&&n instanceof HTMLElement?!0:typeof n=="object"&&n!==null&&"closest"in n&&typeof n.closest=="function"&&"contains"in n&&typeof n.contains=="function"}function Lt(n){return typeof HTMLButtonElement=="function"&&n instanceof HTMLButtonElement?!0:U(n)&&"disabled"in n&&typeof n.disabled=="boolean"}function nt(n,l){n.hidden=!l,l?(n.removeAttribute("aria-hidden"),n.removeAttribute("tabindex")):(n.setAttribute("aria-hidden","true"),n.setAttribute("tabindex","-1"))}function ct(n,l,i){if(!U(n)||i.length===0)return!1;for(let s of i)try{let d=l.querySelector(s);if(U(d)&&d.contains(n)||n.closest(s))return!0}catch(d){}return!1}function Mt(n,l){l?(n.setAttribute("aria-busy","true"),n.disabled=!0):(n.removeAttribute("aria-busy"),n.disabled=!1)}function et(n,l){n&&(n.textContent=l)}function Tt(n){let{modal:l,applyButton:i,sections:s,ignoreRoots:d=[],confirmDiscard:f,statusEl:x}=n,v=new Map,m=new Set,p=new AbortController,b=!1,o=!1,c=[];function S(){return o}function g(){return o?new Promise(h=>{c.push(h)}):Promise.resolve()}function u(){v.clear(),m.clear();for(let h of s)v.set(h.id,h.snapshot());M()}function E(h){if(m.has(h.id))return!0;let C=v.get(h.id);return C===void 0?!0:h.snapshot()!==C}function k(){return s.some(h=>E(h))}function M(){let h=k();h?l.dataset.btfwDirty="1":delete l.dataset.btfwDirty,nt(i,h),h||et(x,"")}function N(){b||o||(b=!0,queueMicrotask(()=>{b=!1,M()}))}function q(h){if(typeof h=="string"&&h.length>0)m.add(h);else for(let C of s)m.add(C.id);N()}async function X(){if(o)return{ok:!1,error:"Apply already in progress"};o=!0,Mt(i,!0),et(x,"");try{let h=s.filter(P=>E(P));if(h.length===0)return nt(i,!1),{ok:!0};let C=null,A=0;for(let P of h)try{let B=await P.apply();dt(B)?(v.set(P.id,P.snapshot()),m.delete(P.id)):(A+=1,C===null&&(C=B.error))}catch(B){A+=1;let at=B instanceof Error?B.message:"Unknown apply error";C===null&&(C=at)}if(M(),A>0){let P=C===null?`Failed to apply ${A} section(s)`:`${C}${A>1?` (+${A-1} more)`:""}`;return et(x,P),{ok:!1,error:P}}return et(x,"Changes applied"),{ok:!0}}finally{Mt(i,!1),o=!1;let h=c;c=[],h.forEach(C=>C())}}function j(){for(let h of s){let C=v.get(h.id);C!==void 0&&h.restore(C)}m.clear(),M()}async function G(){if(await g(),!k())return!0;if(f){if(!await f())return!1}else if(!await It({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return j(),!0}function $(h){ct(h.target,l,d)||N()}l.addEventListener("input",$,{signal:p.signal,capture:!0}),l.addEventListener("change",$,{signal:p.signal,capture:!0});let ot=h=>{k()&&(h.preventDefault(),h.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",ot,{signal:p.signal}),u(),{isDirty:k,isApplying:S,recalculate:M,markDirty:q,captureBaseline:u,applyAll:X,tryClose:G,discard:j,dispose(){p.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:Tt,setApplyButtonVisible:nt,eventTargetIsInsideIgnoredRoot:ct,isHTMLElement:U,isHTMLButtonElement:Lt,isPersistSuccess:dt,isPersistFailure:Ct}));function Pt(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function ut(n,l=document){Object.defineProperty(l,"_btfw_userlist_watch",{configurable:!0,get(){return n.chat.userlistWatch},set(i){n.chat.userlistWatch=i}}),l._btfw_userlist_isOpen=()=>{var i,s;return(s=(i=n.userlist).isOpen)==null?void 0:s.call(i)},l._btfw_userlist_open=(...i)=>{var s,d;return(d=(s=n.userlist).open)==null?void 0:d.call(s,...i)},l._btfw_userlist_close=(...i)=>{var s,d;return(d=(s=n.userlist).close)==null?void 0:d.call(s,...i)},l._btfw_userlist_position=(...i)=>{var s,d;return(d=(s=n.userlist).position)==null?void 0:d.call(s,...i)},l._btfw_nav_setMobileOpen=(...i)=>{var s,d;return(d=(s=n.nav).setMobileOpen)==null?void 0:d.call(s,...i)},l._btfw_nav_toggleMobile=(...i)=>{var s,d;return(d=(s=n.nav).toggleMobile)==null?void 0:d.call(s,...i)},l._btfw_nav_isMobileOpen=(...i)=>{var s,d;return(d=(s=n.nav).isMobileOpen)==null?void 0:d.call(s,...i)},l._btfw_nav_setMenuOpen=(...i)=>{var s,d;return(d=(s=n.nav).setMenuOpen)==null?void 0:d.call(s,...i)},l._btfw_nav_toggleMenu=(...i)=>{var s,d;return(d=(s=n.nav).toggleMenu)==null?void 0:d.call(s,...i)},l._btfw_openThemeSettings=(...i)=>{var s,d;return(d=(s=n.theme).openSettings)==null?void 0:d.call(s,...i)}}BTFW.define("util:state",[],async()=>{let n=Pt();return ut(n),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=n),{name:"util:state",state:n,installLegacyStateShims:ut}});var ft={};lt(ft,{chatEmotesIconHtml:()=>Qt,chatGifIconHtml:()=>Jt,chatGifIconSlotHtml:()=>Zt,chatTopbarHtml:()=>ee,chatUserlistPopoverHtml:()=>ne,chatUsersIconHtml:()=>te});function Qt(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile-o"></i></span>'}function Jt(){return'<i class="fa fa-file-video-o"></i>'}function Zt(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function te(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function ee(){return`
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
    `}var mt={};lt(mt,{addMediaButtonHtml:()=>ce,addMediaPanelHtml:()=>re,panelUndockIconHtml:()=>le,panelsMenuButtonHtml:()=>se,playlistAddFormHtml:()=>de,stackGroupHeaderHtml:()=>ie});function oe(n){return n==null?"":String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ae(n,...l){var s;let i="";for(let d=0;d<n.length;d+=1)i+=(s=n[d])!=null?s:"",d<l.length&&(i+=oe(l[d]));return i}function re(){return`
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
      `}function ie(n){return ae`
      <span class="btfw-stack-item__title">${n}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `}function se(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function le(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function de(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function ce(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var pt={};lt(pt,{channelThemeAdminPanelHtml:()=>ue});function ue(){return`
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
    `}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:ft,stack:mt,channelThemeAdmin:pt}));BTFW.define("util:motion",[],async()=>{let n=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,l=!!(n&&n.matches);if(n){let o=c=>{l=!!c.matches};typeof n.addEventListener=="function"?n.addEventListener("change",o):typeof n.addListener=="function"&&n.addListener(o)}function i(){return l}function s(o){return o?o.split(",").reduce((c,S)=>{let g=parseFloat(S.trim());return Number.isNaN(g)?c:S.trim().endsWith("ms")?Math.max(c,g):Math.max(c,g*1e3)},0):0}function d(o){if(!o||typeof window=="undefined"||!window.getComputedStyle)return 0;let c=getComputedStyle(o),S=s(c.transitionDuration||"0s"),g=s(c.transitionDelay||"0s");return S+g}function f(o){return new Promise(c=>{if(!o||i()){c();return}let S=d(o);if(!S){c();return}let g=!1,u=()=>{g||(g=!0,o.removeEventListener("transitionend",E),c())},E=k=>{k&&k.target!==o||u()};o.addEventListener("transitionend",E),setTimeout(u,S+34)})}function x(o){typeof o=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(o)}):setTimeout(o,32))}function v(o){if(!o)return;let c=o.dataset.btfwModalState;if(c==="open"||c==="opening")return;o.dataset.btfwModalState="opening",o.removeAttribute("aria-hidden"),o.removeAttribute("hidden");let S=()=>{!o||o.dataset.btfwModalState!=="opening"||(o.classList.add("is-active"),o.dataset.btfwModalState="open")};i()?S():x(S)}async function m(o){if(!o)return;let c=o.dataset.btfwModalState;if(c==="closing"||c==="closed")return;o.dataset.btfwModalState="closing",o.setAttribute("aria-hidden","true");let S=o.querySelector(".modal-card, .modal-content, .modal-dialog"),g=o.querySelector(".modal-background, .modal-backdrop");o.classList.remove("is-active"),await Promise.all([f(S),f(g)]),o.dataset.btfwModalState==="closing"&&(o.dataset.btfwModalState="closed",o.setAttribute("hidden",""))}function p(o,c={}){if(!o)return;let S=o.dataset.btfwPopoverState;if(S==="open"||S==="opening")return;o.dataset.btfwPopoverState="opening",o.removeAttribute("hidden"),o.removeAttribute("aria-hidden");let g=c.backdrop;g&&(g.dataset.btfwPopoverState="opening",g.removeAttribute("hidden"),g.removeAttribute("aria-hidden"));let u=()=>{o.dataset.btfwPopoverState==="opening"&&(o.dataset.btfwPopoverState="open",g&&g.dataset.btfwPopoverState==="opening"&&(g.dataset.btfwPopoverState="open"))};i()?u():x(u)}async function b(o,c={}){if(!o)return;let S=o.dataset.btfwPopoverState;if(S==="closing"||S==="closed")return;o.dataset.btfwPopoverState="closing",o.setAttribute("aria-hidden","true");let g=[f(o)],u=c.backdrop;u&&(u.dataset.btfwPopoverState="closing",u.setAttribute("aria-hidden","true"),g.push(f(u))),await Promise.all(g),o.dataset.btfwPopoverState==="closing"&&(o.dataset.btfwPopoverState="closed",o.setAttribute("hidden","")),u&&u.dataset.btfwPopoverState==="closing"&&(u.dataset.btfwPopoverState="closed",u.setAttribute("hidden",""))}return{prefersReducedMotion:i,waitForTransition:f,openModal:v,closeModal:m,openPopover:p,closePopover:b}});BTFW.define("util:tmdb-proxy",[],async()=>{let n="https://empty-bar-d620.movies-storage-a.workers.dev",l="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function i(){var v,m,p,b,o,c,S;try{let g=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((v=g.movieSuggestions)==null?void 0:v.endpoint)||((p=(m=g.integrations)==null?void 0:m.movieSuggestions)==null?void 0:p.endpoint)||((o=(b=g.integrations)==null?void 0:b.movieRequests)==null?void 0:o.endpoint)||((S=(c=g.integrations)==null?void 0:c.tmdbProxy)==null?void 0:S.endpoint)||n).trim().replace(/\/+$/,"")}catch(g){return n}}function s(v,m){let p=v.startsWith("/")?v:`/${v}`,b=new URL(`${i()}${p}`);if(m)for(let[o,c]of Object.entries(m))c==null||c===""||b.searchParams.set(o,String(c));return b.toString()}async function d(v,m={}){let p=await fetch(s(v,m.params),{method:m.method||"GET",headers:m.body?{"Content-Type":"application/json"}:void 0,body:m.body?JSON.stringify(m.body):void 0,signal:m.signal}),b=await p.json().catch(()=>({}));if(!p.ok)throw new Error(b.error||`Worker request failed (${p.status})`);return b}async function f(v,m={},p={}){let b=String(v||"").replace(/^\/+/,"");return d(`/api/tmdb/${b}`,{params:m,signal:p.signal})}function x(){return!!i()}return{getWorkerBase:i,workerFetch:d,tmdbFetch:f,isAvailable:x,MISSING_PROXY_MSG:l}});BTFW.define("feature:styleCore",[],async()=>{let n="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",l="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",i="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/paper/bootstrap.min.css";function s(b){return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(o=>(o.getAttribute("href")||"").includes(b))}function d(b,o){if(document.getElementById(b)||s(o))return;let c=document.createElement("link");c.id=b,c.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[o]&&(c.integrity=window.BTFW.SRI[o],c.crossOrigin="anonymous"),c.href=o,document.head.appendChild(c)}function f(){!!!window.FontAwesome&&!s("font-awesome")&&d("btfw-fa-css",n)}function x(){s("bulma")||d("btfw-bulma-css",l)}function v(){s("bootstrap")||d("btfw-bootswatch-paper",i)}function m(){let b=document.querySelector('meta[name="viewport"]');b||(b=document.createElement("meta"),b.name="viewport",b.content="width=device-width, initial-scale=1",document.head.appendChild(b))}function p(){m(),f(),x(),v()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p(),{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let n="btfw:theme:mode",l="btfw:bulma:theme",i=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),s;function d(){if(s)return s;let u=document.getElementById("btfw-bulma-dark-bridge");return u&&u.remove(),s=document.createElement("style"),s.id="btfw-theme-mode-bridge",document.head.appendChild(s),s}let f=`
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
`;function x(u){let E=u==="dark"?"dark":"light",k=document.querySelector('meta[name="color-scheme"]');k||(k=document.createElement("meta"),k.setAttribute("name","color-scheme"),document.head.appendChild(k)),k.setAttribute("content",E)}function v(){try{let u=localStorage.getItem(n);return u||localStorage.getItem(l)||"dark"}catch(u){return"dark"}}function m(u){try{localStorage.setItem(n,u)}catch(E){}}function p(){return i&&i.matches?"dark":"light"}function b(u){let E=u==="auto"?p():u||"dark",k=document.documentElement;k.setAttribute("data-btfw-theme",E),k.classList.toggle("btfw-theme-dark",E==="dark"),x(E);let M=d();M.textContent=E==="dark"?f:""}function o(u){let E=u==="auto"||u==="dark"||u==="light"?u:"dark";m(E),b(E)}function c(){return v()}function S(){!i||!i.addEventListener||i.addEventListener("change",()=>{c()==="auto"&&b("auto")})}function g(){b(v()),S()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g(),{name:"feature:themeMode",setTheme:o,getTheme:c}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let n="btfw:grid:leftPx",l="btfw:layout:chatSide",i="btfw-navhost",b="btfw:grid:videoRatio",u=null,E=null,k="right",M=!1,N=!1,q=!1;function X(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function j(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function G(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function $(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return N&&q?0:e}function ot(){let t=X(),e=$(),a=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-a*2)}function h(t){return Math.max(0,Math.round(t/2)*2)}function C(){let t=document.documentElement,e=$(),a=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,r=ot();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(r)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(r)}px`);let _=document.getElementById("btfw-leftpad"),I=(M?Math.max(0,window.innerWidth-a*2):(_==null?void 0:_.getBoundingClientRect().width)||window.innerWidth*.62)*(9/16);if(!M){let D=r;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(D)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let y=h(G()),L=h(Math.floor(r/2)),H=Math.max(180,L-y);H=h(Math.min(H,I));let T=H+y,R=L;t.style.setProperty("--btfw-video-chrome-h",`${y}px`),t.style.setProperty("--btfw-videowrap-max-h",`${H}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${T}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${R}px`),t.style.setProperty("--btfw-video-row-h",`${T}px`),t.style.setProperty("--btfw-video-max-h",`${T}px`)}function A(){if(!M)return;let t=X(),e=2,a=document.documentElement,r=document.getElementById("btfw-chatcol"),_=document.getElementById("btfw-leftpad");if(!r||!_)return;let w=r.getBoundingClientRect().bottom;if(w<=t-e)return;let I=w-(t-e),y=G(),L=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-chat-row-h"))||r.getBoundingClientRect().height||0,H=parseFloat(getComputedStyle(a).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(a).getPropertyValue("--btfw-video-row-h"))||0,T=Math.max(0,H-y),R=D=>{let F=Math.max(180,Math.floor(D)),W=F+y;a.style.setProperty("--btfw-videowrap-max-h",`${F}px`),a.style.setProperty("--btfw-vertical-video-row-h",`${W}px`),a.style.setProperty("--btfw-video-row-h",`${W}px`),a.style.setProperty("--btfw-video-max-h",`${W}px`)};if(L>180){let D=Math.min(I,L-180);a.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(L-D)}px`);let F=I-D;F>0&&T>180&&R(T-F),B();return}T>180&&(R(T-I),B())}function P(t={}){var w;let e=document.getElementById("btfw-grid"),a=document.getElementById("btfw-leftpad"),r=document.getElementById("btfw-stack"),_=(w=t.allHidden)!=null?w:j();e&&e.classList.toggle("btfw-grid--stack-hidden",_),a&&a.classList.toggle("btfw-leftpad--stack-hidden",_),r&&r.classList.toggle("btfw-stack--all-hidden",_)}function B(){var a;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(r=>{r.style.removeProperty("height"),r.style.removeProperty("width"),r.style.removeProperty("maxHeight"),r.style.removeProperty("maxWidth"),r.style.removeProperty("top"),r.style.removeProperty("left"),r.style.removeProperty("right"),r.style.removeProperty("bottom"),r.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let r=e.player||e.player_||window.videojs&&(((a=window.videojs.players)==null?void 0:a[e.id])||window.videojs(e.id));if(r)try{typeof r.trigger=="function"&&r.trigger("componentresize"),r.tech_&&typeof r.tech_.trigger=="function"&&r.tech_.trigger("resize"),typeof r.resize=="function"&&r.resize()}catch(_){}}}function at(){try{return localStorage.getItem(l)==="left"?"left":"right"}catch(t){return"right"}}function At(){try{let t=parseFloat(localStorage.getItem(b)||"",10);if(!isNaN(t)&&t>=.35&&t<=.78){E=t;return}let e=parseInt(localStorage.getItem(n)||"",10);if(!isNaN(e)&&e>=520){u=e;let a=Math.max(window.innerWidth-20,880);ht(e/a)}}catch(t){u=null,E=null}}function K(t){return Math.min(.78,Math.max(.35,t))}function bt(t){var _;let e=(_=t==null?void 0:t.getBoundingClientRect)==null?void 0:_.call(t),a=(e==null?void 0:e.width)||window.innerWidth||0,r=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(a-r,880)}function Bt(t){let e=bt(t),a=E!==null?E:.62;if(e>0){let r=520/e,_=(e-360)/e;a=Math.min(Math.max(a,r),_)}return K(a)}function ht(t){E=K(t);try{localStorage.setItem(b,String(E))}catch(e){}}function Ht(t){let e=K(t),a=1-e,r=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*r))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(a*r))}fr)`}}function Y(){let t=document.getElementById("btfw-grid");if(!t)return;if(M){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:a}=Ht(Bt(t)),r=k==="left"?`${a} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${a}`;t.style.gridTemplateColumns=r,t.classList.toggle("btfw-grid--chat-left",k==="left"),t.classList.toggle("btfw-grid--chat-right",k!=="left")}function Rt(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),a=bt(e),r=Math.min(Math.max(t,520),a-360);u=r,ht(r/a);try{localStorage.setItem(n,String(r))}catch(_){}Y()}function Ot(){let t=window.innerWidth,r=Math.max(520,t*K(E!==null?E:.62))+360+20;return Math.min(Math.max(r,900),1100)}function Dt(){let t=window.innerWidth,e=Ot();return M?t<e+40:t<e}function Q(){let t=document.getElementById("btfw-stack");if(!t)return;if(M){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let I=document.getElementById("btfw-grid"),y=document.getElementById("btfw-chatcol");if(!I||!y)return;(t.parentElement!==I||t.previousElementSibling!==y)&&(y.nextSibling?I.insertBefore(t,y.nextSibling):I.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let a=document.getElementById("btfw-video-stage"),r=document.getElementById("videowrap"),_=document.getElementById("btfw-video-overlay"),w=a||(_&&_.parentElement===e?_:r);w&&w.parentElement===e?w.nextSibling!==t&&(w.nextSibling?e.insertBefore(t,w.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function J(){let t=document.getElementById("btfw-grid");if(!t)return;let e=Dt();e!==M?(M=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),Q(),z(),setTimeout(()=>{z();try{window.dispatchEvent(new Event("resize"))}catch(a){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):Q(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),Y(),V(),C(),P(),z(),yt(),requestAnimationFrame(()=>{C(),A(),z()})}function V(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),a=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",a),document.documentElement.style.setProperty("--btfw-top",a);let r=N&&q?"0px":a;document.documentElement.style.setProperty("--btfw-top-effective",r);let _=document.getElementById("btfw-chatcol");_&&(_.style.removeProperty("top"),_.style.removeProperty("height"))}function Ft(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let a=!1,r=null;function _(y){if(!a||r!==null&&y.pointerId!==r)return;if(M){w();return}let L=t.getBoundingClientRect(),T=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,R;if(k==="left"){let D=y.clientX-L.left,F=Math.max(D-T/2,0),W=L.width-F-T;if(W<520||F<360)return;R=W}else{R=y.clientX-L.left;let D=L.width-R-T;if(R<520||D<360)return}Number.isFinite(R)&&Rt(R)}function w(){if(!a)return;let y=r;a=!1,r=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",_),e.removeEventListener("pointerup",w),e.removeEventListener("pointercancel",w),window.removeEventListener("blur",w),document.removeEventListener("visibilitychange",I);try{y!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(y)}catch(L){}J()}function I(){document.visibilityState==="hidden"&&w()}e.addEventListener("pointerdown",y=>{if(!(M||y.button!==0)){a=!0,r=y.pointerId,y.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(y.pointerId)}catch(L){}e.addEventListener("pointermove",_),e.addEventListener("pointerup",w),e.addEventListener("pointercancel",w),window.addEventListener("blur",w),document.addEventListener("visibilitychange",I)}})}let wt=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function Nt(t){t&&((t.classList||[]).forEach(e=>{wt.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(a=>{wt.test(a)&&e.classList.remove(a)})}))}function Vt(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),a=document.querySelector("#chatwrap .btfw-chat-topbar");if(a){let r=a.querySelector("#btfw-nowplaying-slot");r||(r=document.createElement("div"),r.id="btfw-nowplaying-slot",r.className="btfw-chat-title",a.innerHTML="",a.appendChild(r)),e?(r.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Wt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e?e.getAttribute("data-testid")||e.setAttribute("data-testid","btfw-video-stage"):(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage",e.setAttribute("data-testid","btfw-video-stage")),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let a=document.getElementById("videowrap"),r=document.getElementById("btfw-video-overlay");a&&a.parentElement!==e&&e.appendChild(a),r&&r.parentElement!==e&&e.appendChild(r)}function qt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),a=document.getElementById("chatwrap"),r=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let w=document.getElementById("btfw-leftpad"),I=document.getElementById("btfw-chatcol");I&&!I.getAttribute("data-testid")&&I.setAttribute("data-testid","btfw-chatcol");let y=document.getElementById("videowrap"),L=document.getElementById("chatwrap"),H=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),T=document.getElementById("btfw-grid");T&&!T.getAttribute("data-testid")&&T.setAttribute("data-testid","btfw-grid"),Et(T),y&&!w.contains(y)&&w.appendChild(y),H&&!w.contains(H)&&w.appendChild(H),L&&!I.contains(L)&&I.appendChild(L)}else{let w=document.createElement("div");w.id="btfw-grid",w.setAttribute("data-testid","btfw-grid");let I=document.createElement("div");I.id="btfw-leftpad";let y=document.createElement("aside");y.id="btfw-chatcol",y.setAttribute("data-testid","btfw-chatcol"),e&&I.appendChild(e),r&&I.appendChild(r),a&&y.appendChild(a);let L=document.createElement("div");L.id="btfw-vsplit",Et(w),w.appendChild(I),w.appendChild(L),w.appendChild(y),w.style.opacity="0",t.prepend(w)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(w=>Nt(document.getElementById(w))),Vt();let _=document.getElementById("btfw-leftpad");Wt(_),Q()}function $t(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),J(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function zt(){qt();let t=()=>{V(),Ft(),$t()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let rt=0,it=0,st=0;function z(){st||(st=requestAnimationFrame(()=>{st=0,B()}))}function Ut(){it||(it=requestAnimationFrame(()=>{it=0,M&&(C(),A(),z())}))}function gt(){rt||(rt=requestAnimationFrame(()=>{rt=0,J()}))}function yt(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{M&&Ut()}).observe(t)}document.addEventListener("btfw:layoutReady",yt);function vt(){At(),k=at(),Y(),V();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(V,0),gt()}).observe(t),window.addEventListener("resize",()=>{setTimeout(V,0),gt()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{k=t&&t.detail&&t.detail.side==="left"?"left":"right",Y(),J()}),document.addEventListener("btfw:chat:barsReady",()=>{Q()}),document.addEventListener("btfw:layout:stackVisibility",t=>{P((t==null?void 0:t.detail)||{}),C(),B(),requestAnimationFrame(A)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};N=!!e.active,q=!!e.hidden,V(),C(),B(),requestAnimationFrame(A)});function Xt(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let a=document.querySelector(e);if(a)return a}return null}function Et(t){if(!t)return;let e=Xt();if(!e)return;let a=document.getElementById(i);a||(a=document.createElement("div"),a.id=i,a.className="btfw-navhost"),e.parentElement!==a&&a.appendChild(e),a.parentElement!==t&&t.insertBefore(a,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",vt):vt(),{name:"feature:layout",commitLayout:zt}});})();
