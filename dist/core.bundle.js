/*! Quiglytube core bundle */
var BTFW = globalThis.BTFW;
(()=>{var Zt=Object.defineProperty;var ft=(n,s)=>{for(var a in s)Zt(n,a,{get:s[a],enumerable:!0})};var nt=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),Ct=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),D=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",avatarUrlsCache:"btfw:chat:avatars:urls:v1",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",chatTimestampsShow:"btfw:chat:ts:show",chatTimestampsFormat:"btfw:chat:ts:fmt",chatToolsHistory:"btfw:chat:history",chatStickColor:"btfw:chat:stickColor",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors",emojiCompat:"btfw:emoji:twemoji",emotesSort:"btfw:emotes:sort",gifsFavorites:"btfw:gifs:favorites",notifyEnabled:"btfw:notify:enabled",notifySounds:"btfw:notify:sounds:v2",themeMode:"btfw:theme:mode",localSubs:"btfw:video:localsubs",addFromUrlTemp:"btfw:addfromurl:addTemp",layoutSide:"btfw:layout:chatSide",layoutGridLeftPx:"btfw:grid:leftPx",layoutGridVideoRatio:"btfw:grid:videoRatio",channelOptionsSize:"btfw:channeloptions:size",stackOrder:"btfw-stack-order",stackMotdOpen:"btfw-stack-motd-open",stackPlaylistOpen:"btfw-stack-playlist-open",stackPollOpen:"btfw-stack-poll-open",stackMotdDocked:"btfw-stack-motd-docked",stackPlaylistDocked:"btfw-stack-playlist-docked",stackPollDocked:"btfw-stack-poll-docked",emojiCache:"btfw:emoji:cache",themeModeLegacy:"btfw:bulma:theme",chatNameColorRetired:"btfw:chat:nameColor"}),ye=Object.freeze({emotesRecent:"btfw:recent:emotes:",userThemePresets:"btfw:userThemePresets:"});BTFW.define("util:constants",[],async()=>({name:"util:constants",SELECTORS:nt,EVENTS:Ct,LS_KEYS:D}));function _t(){try{return globalThis.localStorage.getItem("__btfw_probe__"),!0}catch(n){return!1}}function W(n,s=null){try{let a=globalThis.localStorage.getItem(n);return a!=null?a:s}catch(a){return s}}function N(n,s){try{return globalThis.localStorage.setItem(n,s),!0}catch(a){return!1}}function Lt(n){try{return globalThis.localStorage.removeItem(n),!0}catch(s){return!1}}function Mt(n,s){try{let a=globalThis.localStorage.getItem(n);return a===null?s:JSON.parse(a)}catch(a){return s}}function It(n,s){try{return globalThis.localStorage.setItem(n,JSON.stringify(s)),!0}catch(a){return!1}}BTFW.define("util:storage",[],async()=>({name:"util:storage",storageAvailable:_t,getItem:W,setItem:N,removeItem:Lt,getJson:Mt,setJson:It}));function te(n){return typeof CSS!="undefined"&&typeof CSS.escape=="function"?CSS.escape(n):String(n).replace(/\\/g,"\\\\").replace(/"/g,'\\"')}function ot(n){if(n==null)return"";let s=String(n).trim();return s?(s.endsWith(":")&&(s=s.slice(0,-1).trimEnd()),s):""}function Tt(n,s=document){let a=ot(n);if(!a)return null;let r=s.querySelector(`#userlist li[data-name="${te(a)}"]`);if(r)return r;let d=s.querySelectorAll(nt.userlistItem),f=a.toLowerCase();for(let x of d){let m=x.getAttribute&&x.getAttribute("data-name")||""||x.textContent||"";if(!m)continue;let p=ot(m);if(p&&(p.toLowerCase()===f||p.replace(/\s+/g,"").toLowerCase().startsWith(f)))return x}return null}BTFW.define("util:dom",[],async()=>({name:"util:dom",findUserlistItem:Tt,normalizeUserIdentifier:ot}));var O="btfw-confirm-dialog",Bt="btfw-confirm-dialog-style";function ee(){if(typeof document=="undefined"||document.getElementById(Bt))return;let n=document.createElement("style");n.id=Bt,n.textContent=`
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
  `,document.head.appendChild(n)}function ne(){ee();let n=document.getElementById(O);if(n instanceof HTMLDialogElement)return n;let s=document.createElement("dialog");s.id=O;let a=document.createElement("div");a.className="btfw-confirm-body";let r=document.createElement("h2");r.dataset.role="title";let d=document.createElement("p");d.dataset.role="message",a.append(r,d);let f=document.createElement("div");f.className="btfw-confirm-actions";let x=document.createElement("button");x.type="button",x.className="btfw-confirm-cancel",x.dataset.role="cancel";let y=document.createElement("button");return y.type="button",y.className="btfw-confirm-ok",y.dataset.role="confirm",f.append(x,y),s.append(a,f),document.body.appendChild(s),s}function Pt(n){let{title:s="Discard changes?",message:a,confirmLabel:r="Discard",cancelLabel:d="Cancel"}=n;if(typeof document=="undefined"||typeof HTMLDialogElement=="undefined"||typeof HTMLDialogElement.prototype.showModal!="function")return Promise.resolve(typeof window!="undefined"?window.confirm(a):!1);let f=ne();f.open&&f.close();let x=f.querySelector('[data-role="title"]'),y=f.querySelector('[data-role="message"]'),m=f.querySelector('[data-role="cancel"]'),p=f.querySelector('[data-role="confirm"]');return x&&(x.textContent=s),y&&(y.textContent=a),m&&(m.textContent=d),p&&(p.textContent=r),new Promise(h=>{let o=!1,c=()=>{m==null||m.removeEventListener("click",b),p==null||p.removeEventListener("click",u),f.removeEventListener("click",k),f.removeEventListener("close",C)},E=L=>{o||(o=!0,c(),h(L))},b=()=>{f.close()},u=()=>{f.returnValue="confirm",f.close()},k=L=>{L.target===f&&f.close()},C=()=>{E(f.returnValue==="confirm")};m==null||m.addEventListener("click",b),p==null||p.addEventListener("click",u),f.addEventListener("click",k),f.addEventListener("close",C),f.returnValue="",f.showModal(),p==null||p.focus()})}function ut(n){return n.ok===!0}function Rt(n){return n.ok===!1}function K(n){return typeof HTMLElement=="function"&&n instanceof HTMLElement?!0:typeof n=="object"&&n!==null&&"closest"in n&&typeof n.closest=="function"&&"contains"in n&&typeof n.contains=="function"}function Ht(n){return typeof HTMLButtonElement=="function"&&n instanceof HTMLButtonElement?!0:K(n)&&"disabled"in n&&typeof n.disabled=="boolean"}function rt(n,s){n.hidden=!s,s?(n.removeAttribute("aria-hidden"),n.removeAttribute("tabindex")):(n.setAttribute("aria-hidden","true"),n.setAttribute("tabindex","-1"))}function mt(n,s,a){if(!K(n)||a.length===0)return!1;for(let r of a)try{let d=s.querySelector(r);if(K(d)&&d.contains(n)||n.closest(r))return!0}catch(d){}return!1}function At(n,s){s?(n.setAttribute("aria-busy","true"),n.disabled=!0):(n.removeAttribute("aria-busy"),n.disabled=!1)}function at(n,s){n&&(n.textContent=s)}function Ot(n){let{modal:s,applyButton:a,sections:r,ignoreRoots:d=[],confirmDiscard:f,statusEl:x}=n,y=new Map,m=new Set,p=new AbortController,h=!1,o=!1,c=[];function E(){return o}function b(){return o?new Promise(w=>{c.push(w)}):Promise.resolve()}function u(){y.clear(),m.clear();for(let w of r)y.set(w.id,w.snapshot());L()}function k(w){if(m.has(w.id))return!0;let M=y.get(w.id);return M===void 0?!0:w.snapshot()!==M}function C(){return r.some(w=>k(w))}function L(){let w=C();w?s.dataset.btfwDirty="1":delete s.dataset.btfwDirty,rt(a,w),w||at(x,"")}function $(){h||o||(h=!0,queueMicrotask(()=>{h=!1,L()}))}function j(w){if(typeof w=="string"&&w.length>0)m.add(w);else for(let M of r)m.add(M.id);$()}async function Y(){if(o)return{ok:!1,error:"Apply already in progress"};o=!0,At(a,!0),at(x,"");try{let w=r.filter(B=>k(B));if(w.length===0)return rt(a,!1),{ok:!0};let M=null,P=0;for(let B of w)try{let A=await B.apply();ut(A)?(y.set(B.id,B.snapshot()),m.delete(B.id)):(P+=1,M===null&&(M=A.error))}catch(A){P+=1;let st=A instanceof Error?A.message:"Unknown apply error";M===null&&(M=st)}if(L(),P>0){let B=M===null?`Failed to apply ${P} section(s)`:`${M}${P>1?` (+${P-1} more)`:""}`;return at(x,B),{ok:!1,error:B}}return at(x,"Changes applied"),{ok:!0}}finally{At(a,!1),o=!1;let w=c;c=[],w.forEach(M=>M())}}function J(){for(let w of r){let M=y.get(w.id);M!==void 0&&w.restore(M)}m.clear(),L()}async function X(){if(await b(),!C())return!0;if(f){if(!await f())return!1}else if(!await Pt({title:"Discard changes?",message:"Discard unsaved changes?"}))return!1;return J(),!0}function U(w){mt(w.target,s,d)||$()}s.addEventListener("input",U,{signal:p.signal,capture:!0}),s.addEventListener("change",U,{signal:p.signal,capture:!0});let it=w=>{C()&&(w.preventDefault(),w.returnValue="")};return typeof window!="undefined"&&typeof window.addEventListener=="function"&&window.addEventListener("beforeunload",it,{signal:p.signal}),u(),{isDirty:C,isApplying:E,recalculate:L,markDirty:j,captureBaseline:u,applyAll:Y,tryClose:X,discard:J,dispose(){p.abort()}}}BTFW.define("util:dirtyApply",[],async()=>({name:"util:dirtyApply",createDirtyApplyController:Ot,setApplyButtonVisible:rt,eventTargetIsInsideIgnoredRoot:mt,isHTMLElement:K,isHTMLButtonElement:Ht,isPersistSuccess:ut,isPersistFailure:Rt}));function Ft(){return{userlist:{isOpen:null,open:null,close:null,position:null},nav:{setMobileOpen:null,toggleMobile:null,isMobileOpen:null,setMenuOpen:null,toggleMenu:null},theme:{openSettings:null},chat:{userlistWatch:!1,btnWatch:!1,nameContextWired:!1}}}function pt(n,s=document){Object.defineProperty(s,"_btfw_userlist_watch",{configurable:!0,get(){return n.chat.userlistWatch},set(a){n.chat.userlistWatch=a}}),s._btfw_userlist_isOpen=()=>{var a,r;return(r=(a=n.userlist).isOpen)==null?void 0:r.call(a)},s._btfw_userlist_open=(...a)=>{var r,d;return(d=(r=n.userlist).open)==null?void 0:d.call(r,...a)},s._btfw_userlist_close=(...a)=>{var r,d;return(d=(r=n.userlist).close)==null?void 0:d.call(r,...a)},s._btfw_userlist_position=(...a)=>{var r,d;return(d=(r=n.userlist).position)==null?void 0:d.call(r,...a)},s._btfw_nav_setMobileOpen=(...a)=>{var r,d;return(d=(r=n.nav).setMobileOpen)==null?void 0:d.call(r,...a)},s._btfw_nav_toggleMobile=(...a)=>{var r,d;return(d=(r=n.nav).toggleMobile)==null?void 0:d.call(r,...a)},s._btfw_nav_isMobileOpen=(...a)=>{var r,d;return(d=(r=n.nav).isMobileOpen)==null?void 0:d.call(r,...a)},s._btfw_nav_setMenuOpen=(...a)=>{var r,d;return(d=(r=n.nav).setMenuOpen)==null?void 0:d.call(r,...a)},s._btfw_nav_toggleMenu=(...a)=>{var r,d;return(d=(r=n.nav).toggleMenu)==null?void 0:d.call(r,...a)},s._btfw_openThemeSettings=(...a)=>{var r,d;return(d=(r=n.theme).openSettings)==null?void 0:d.call(r,...a)}}BTFW.define("util:state",[],async()=>{let n=Ft();return pt(n),typeof window!="undefined"&&window.BTFW&&(window.BTFW.state=n),{name:"util:state",state:n,installLegacyStateShims:pt}});var bt={};ft(bt,{chatEmotesIconHtml:()=>oe,chatGifIconHtml:()=>ae,chatGifIconSlotHtml:()=>re,chatTopbarHtml:()=>se,chatUserlistPopoverHtml:()=>le,chatUsersIconHtml:()=>ie});function oe(){return'<span data-btfw-icon-slot="chat-emotes" aria-hidden="true"><i class="fa fa-smile-o"></i></span>'}function ae(){return'<i class="fa fa-file-video-o"></i>'}function re(){return'<span data-btfw-icon-slot="chat-gif" aria-hidden="true"><i class="fa fa-file-video-o"></i></span>'}function ie(){return'<span data-btfw-icon-slot="chat-users" aria-hidden="true"><i class="fa fa-users"></i></span>'}function se(){return`
        <div class="btfw-chat-topbar-left">
          <div class="btfw-chat-title" id="btfw-nowplaying-slot"></div>
        </div>
        <div class="btfw-chat-topbar-actions" id="btfw-chat-topbar-actions"></div>
      `}function le(){return`
      <div class="btfw-pophead">
        <span>Users</span>
        <button class="btfw-popclose" aria-label="Close">&times;</button>
      </div>
      <div class="btfw-popbody"></div>
    `}var ht={};ft(ht,{addMediaButtonHtml:()=>he,addMediaPanelHtml:()=>fe,panelUndockIconHtml:()=>pe,panelsMenuButtonHtml:()=>me,playlistAddFormHtml:()=>be,stackGroupHeaderHtml:()=>ue});function de(n){return n==null?"":String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ce(n,...s){var r;let a="";for(let d=0;d<n.length;d+=1)a+=(r=n[d])!=null?r:"",d<s.length&&(a+=de(s[d]));return a}function fe(){return`
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
      `}function ue(n){return ce`
      <span class="btfw-stack-item__title">${n}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `}function me(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function pe(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function be(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function he(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}var wt={};ft(wt,{channelThemeAdminPanelHtml:()=>we});function we(){return`
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
    `}BTFW.define("util:templates",[],async()=>({name:"util:templates",chat:bt,stack:ht,channelThemeAdmin:wt}));BTFW.define("util:motion",[],async()=>{let n=typeof window!="undefined"&&window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null,s=!!(n&&n.matches);if(n){let o=c=>{s=!!c.matches};typeof n.addEventListener=="function"?n.addEventListener("change",o):typeof n.addListener=="function"&&n.addListener(o)}function a(){return s}function r(o){return o?o.split(",").reduce((c,E)=>{let b=parseFloat(E.trim());return Number.isNaN(b)?c:E.trim().endsWith("ms")?Math.max(c,b):Math.max(c,b*1e3)},0):0}function d(o){if(!o||typeof window=="undefined"||!window.getComputedStyle)return 0;let c=getComputedStyle(o),E=r(c.transitionDuration||"0s"),b=r(c.transitionDelay||"0s");return E+b}function f(o){return new Promise(c=>{if(!o||a()){c();return}let E=d(o);if(!E){c();return}let b=!1,u=()=>{b||(b=!0,o.removeEventListener("transitionend",k),c())},k=C=>{C&&C.target!==o||u()};o.addEventListener("transitionend",k),setTimeout(u,E+34)})}function x(o){typeof o=="function"&&(typeof window!="undefined"&&typeof window.requestAnimationFrame=="function"?window.requestAnimationFrame(()=>{window.requestAnimationFrame(o)}):setTimeout(o,32))}function y(o){if(!o)return;let c=o.dataset.btfwModalState;if(c==="open"||c==="opening")return;o.dataset.btfwModalState="opening",o.removeAttribute("aria-hidden"),o.removeAttribute("hidden");let E=()=>{!o||o.dataset.btfwModalState!=="opening"||(o.classList.add("is-active"),o.dataset.btfwModalState="open")};a()?E():x(E)}async function m(o){if(!o)return;let c=o.dataset.btfwModalState;if(c==="closing"||c==="closed")return;o.dataset.btfwModalState="closing",o.setAttribute("aria-hidden","true");let E=o.querySelector(".modal-card, .modal-content, .modal-dialog"),b=o.querySelector(".modal-background, .modal-backdrop");o.classList.remove("is-active"),await Promise.all([f(E),f(b)]),o.dataset.btfwModalState==="closing"&&(o.dataset.btfwModalState="closed",o.setAttribute("hidden",""))}function p(o,c={}){if(!o)return;let E=o.dataset.btfwPopoverState;if(E==="open"||E==="opening")return;o.dataset.btfwPopoverState="opening",o.removeAttribute("hidden"),o.removeAttribute("aria-hidden");let b=c.backdrop;b&&(b.dataset.btfwPopoverState="opening",b.removeAttribute("hidden"),b.removeAttribute("aria-hidden"));let u=()=>{o.dataset.btfwPopoverState==="opening"&&(o.dataset.btfwPopoverState="open",b&&b.dataset.btfwPopoverState==="opening"&&(b.dataset.btfwPopoverState="open"))};a()?u():x(u)}async function h(o,c={}){if(!o)return;let E=o.dataset.btfwPopoverState;if(E==="closing"||E==="closed")return;o.dataset.btfwPopoverState="closing",o.setAttribute("aria-hidden","true");let b=[f(o)],u=c.backdrop;u&&(u.dataset.btfwPopoverState="closing",u.setAttribute("aria-hidden","true"),b.push(f(u))),await Promise.all(b),o.dataset.btfwPopoverState==="closing"&&(o.dataset.btfwPopoverState="closed",o.setAttribute("hidden","")),u&&u.dataset.btfwPopoverState==="closing"&&(u.dataset.btfwPopoverState="closed",u.setAttribute("hidden",""))}return{prefersReducedMotion:a,waitForTransition:f,openModal:y,closeModal:m,openPopover:p,closePopover:h}});BTFW.define("util:tmdb-proxy",[],async()=>{let n="https://empty-bar-d620.movies-storage-a.workers.dev",s="TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";function a(){var y,m,p,h,o,c,E;try{let b=window.BTFW_CONFIG&&typeof window.BTFW_CONFIG=="object"?window.BTFW_CONFIG:{};return(((y=b.movieSuggestions)==null?void 0:y.endpoint)||((p=(m=b.integrations)==null?void 0:m.movieSuggestions)==null?void 0:p.endpoint)||((o=(h=b.integrations)==null?void 0:h.movieRequests)==null?void 0:o.endpoint)||((E=(c=b.integrations)==null?void 0:c.tmdbProxy)==null?void 0:E.endpoint)||n).trim().replace(/\/+$/,"")}catch(b){return n}}function r(y,m){let p=y.startsWith("/")?y:`/${y}`,h=new URL(`${a()}${p}`);if(m)for(let[o,c]of Object.entries(m))c==null||c===""||h.searchParams.set(o,String(c));return h.toString()}async function d(y,m={}){let p=await fetch(r(y,m.params),{method:m.method||"GET",headers:m.body?{"Content-Type":"application/json"}:void 0,body:m.body?JSON.stringify(m.body):void 0,signal:m.signal}),h=await p.json().catch(()=>({}));if(!p.ok)throw new Error(h.error||`Worker request failed (${p.status})`);return h}async function f(y,m={},p={}){let h=String(y||"").replace(/^\/+/,"");return d(`/api/tmdb/${h}`,{params:m,signal:p.signal})}function x(){return!!a()}return{getWorkerBase:a,workerFetch:d,tmdbFetch:f,isAvailable:x,MISSING_PROXY_MSG:s}});BTFW.define("feature:styleCore",[],async()=>{let n="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",s="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",a="https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/paper/bootstrap.min.css";function r(h){return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(o=>(o.getAttribute("href")||"").includes(h))}function d(h,o){if(document.getElementById(h)||r(o))return;let c=document.createElement("link");c.id=h,c.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[o]&&(c.integrity=window.BTFW.SRI[o],c.crossOrigin="anonymous"),c.href=o,document.head.appendChild(c)}function f(){!!!window.FontAwesome&&!r("font-awesome")&&d("btfw-fa-css",n)}function x(){r("bulma")||d("btfw-bulma-css",s)}function y(){r("bootstrap")||d("btfw-bootswatch-paper",a)}function m(){let h=document.querySelector('meta[name="viewport"]');h||(h=document.createElement("meta"),h.name="viewport",h.content="width=device-width, initial-scale=1",document.head.appendChild(h))}function p(){m(),f(),x(),y()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p(),{name:"feature:styleCore"}});BTFW.define("feature:themeMode",[],async()=>{let n=D.themeMode,s=D.themeModeLegacy,a=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)"),r;function d(){if(r)return r;let u=document.getElementById("btfw-bulma-dark-bridge");return u&&u.remove(),r=document.createElement("style"),r.id="btfw-theme-mode-bridge",document.head.appendChild(r),r}let f=`
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
`;function x(u){let k=u==="dark"?"dark":"light",C=document.querySelector('meta[name="color-scheme"]');C||(C=document.createElement("meta"),C.setAttribute("name","color-scheme"),document.head.appendChild(C)),C.setAttribute("content",k)}function y(){let u=W(n);return u||W(s)||"dark"}function m(u){N(n,u)}function p(){return a&&a.matches?"dark":"light"}function h(u){let k=u==="auto"?p():u||"dark",C=document.documentElement;C.setAttribute("data-btfw-theme",k),C.classList.toggle("btfw-theme-dark",k==="dark"),x(k);let L=d();L.textContent=k==="dark"?f:""}function o(u){let k=u==="auto"||u==="dark"||u==="light"?u:"dark";m(k),h(k)}function c(){return y()}function E(){!a||!a.addEventListener||a.addEventListener("change",()=>{c()==="auto"&&h("auto")})}function b(){h(y()),E()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",b):b(),{name:"feature:themeMode",setTheme:o,getTheme:c}});BTFW.define("feature:bulma-layer",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:bulma",["feature:themeMode"],async n=>n.init("feature:themeMode"));BTFW.define("feature:layout",["feature:styleCore","feature:themeMode"],async()=>{let n=D.layoutGridLeftPx,s=D.layoutSide,a="btfw-navhost",r=520,d=680,f=360,x=20,y=900,m=1100,p=40,h=D.layoutGridVideoRatio,o=.35,c=.78,E=.62,b=180,u=null,k=null,C="right",L=!1,$=!1,j=!1;function Y(){var t;return((t=window.visualViewport)==null?void 0:t.height)||window.innerHeight||1440}function J(){let t=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return t.length?Array.from(t).every(e=>e.dataset.docked==="true"):!0}function X(){let t=document.getElementById("btfw-video-overlay");return!t||getComputedStyle(t).display==="none"?0:t.offsetHeight||0}function U(){let t=document.documentElement,e=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-nav-real-height"))||48;return $&&j?0:e}function it(){let t=Y(),e=U(),i=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-gap"))||10;return Math.max(0,t-e-i*2)}function w(t){return Math.max(0,Math.round(t/2)*2)}function M(){let t=document.documentElement,e=U(),i=parseFloat(getComputedStyle(t).getPropertyValue("--btfw-gap"))||10,l=it();t.style.setProperty("--btfw-top-effective",`${e}px`),t.style.setProperty("--btfw-primary-budget",`${Math.floor(l)}px`),t.style.setProperty("--btfw-primary-row-h",`${Math.floor(l)}px`);let S=document.getElementById("btfw-leftpad"),_=(L?Math.max(0,window.innerWidth-i*2):(S==null?void 0:S.getBoundingClientRect().width)||window.innerWidth*E)*(9/16);if(!L){let F=l;t.style.setProperty("--btfw-video-stage-h",`${Math.floor(F)}px`),t.style.setProperty("--btfw-stack-max-h","none"),t.style.setProperty("--btfw-video-max-h","none");return}t.style.setProperty("--btfw-stack-max-h","none");let v=w(X()),I=w(Math.floor(l/2)),R=Math.max(b,I-v);R=w(Math.min(R,_));let T=R+v,H=I;t.style.setProperty("--btfw-video-chrome-h",`${v}px`),t.style.setProperty("--btfw-videowrap-max-h",`${R}px`),t.style.setProperty("--btfw-vertical-video-row-h",`${T}px`),t.style.setProperty("--btfw-vertical-chat-row-h",`${H}px`),t.style.setProperty("--btfw-video-row-h",`${T}px`),t.style.setProperty("--btfw-video-max-h",`${T}px`)}function P(){if(!L)return;let t=Y(),e=2,i=document.documentElement,l=document.getElementById("btfw-chatcol"),S=document.getElementById("btfw-leftpad");if(!l||!S)return;let g=l.getBoundingClientRect().bottom;if(g<=t-e)return;let _=g-(t-e),v=X(),I=parseFloat(getComputedStyle(i).getPropertyValue("--btfw-vertical-chat-row-h"))||l.getBoundingClientRect().height||0,R=parseFloat(getComputedStyle(i).getPropertyValue("--btfw-vertical-video-row-h"))||parseFloat(getComputedStyle(i).getPropertyValue("--btfw-video-row-h"))||0,T=Math.max(0,R-v),H=F=>{let V=Math.max(b,Math.floor(F)),z=V+v;i.style.setProperty("--btfw-videowrap-max-h",`${V}px`),i.style.setProperty("--btfw-vertical-video-row-h",`${z}px`),i.style.setProperty("--btfw-video-row-h",`${z}px`),i.style.setProperty("--btfw-video-max-h",`${z}px`)};if(I>180){let F=Math.min(_,I-180);i.style.setProperty("--btfw-vertical-chat-row-h",`${Math.floor(I-F)}px`);let V=_-F;V>0&&T>b&&H(T-V),A();return}T>b&&(H(T-_),A())}function B(t={}){var g;let e=document.getElementById("btfw-grid"),i=document.getElementById("btfw-leftpad"),l=document.getElementById("btfw-stack"),S=(g=t.allHidden)!=null?g:J();e&&e.classList.toggle("btfw-grid--stack-hidden",S),i&&i.classList.toggle("btfw-leftpad--stack-hidden",S),l&&l.classList.toggle("btfw-stack--all-hidden",S)}function A(){var i;let t=document.getElementById("videowrap");if(!t)return;t.querySelectorAll("iframe, video, .vjs-tech").forEach(l=>{l.style.removeProperty("height"),l.style.removeProperty("width"),l.style.removeProperty("maxHeight"),l.style.removeProperty("maxWidth"),l.style.removeProperty("top"),l.style.removeProperty("left"),l.style.removeProperty("right"),l.style.removeProperty("bottom"),l.style.removeProperty("transform")});let e=t.querySelector(".video-js");if(e){e.style.removeProperty("padding-top"),e.style.removeProperty("height"),e.style.removeProperty("width");let l=e.player||e.player_||window.videojs&&(((i=window.videojs.players)==null?void 0:i[e.id])||window.videojs(e.id));if(l)try{typeof l.trigger=="function"&&l.trigger("componentresize"),l.tech_&&typeof l.tech_.trigger=="function"&&l.tech_.trigger("resize"),typeof l.resize=="function"&&l.resize()}catch(S){}}}function st(){return W(s)==="left"?"left":"right"}function Dt(){let t=parseFloat(W(h,""),10);if(!isNaN(t)&&t>=o&&t<=c){k=t;return}let e=parseInt(W(n,""),10);if(!isNaN(e)&&e>=r){u=e;let i=Math.max(window.innerWidth-x,r+f);yt(e/i)}}function Q(t){return Math.min(c,Math.max(o,t))}function gt(t){var S;let e=(S=t==null?void 0:t.getBoundingClientRect)==null?void 0:S.call(t),i=(e==null?void 0:e.width)||window.innerWidth||0,l=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--btfw-split-width"))||8;return Math.max(i-l,r+f)}function Wt(t){let e=gt(t),i=k!==null?k:E;if(e>0){let l=r/e,S=(e-f)/e;i=Math.min(Math.max(i,l),S)}return Q(i)}function yt(t){k=Q(t),N(h,String(k))}function Vt(t){let e=Q(t),i=1-e,l=100;return{video:`minmax(0, ${Math.max(1,Math.round(e*l))}fr)`,chat:`minmax(var(--btfw-chat-min, 280px), ${Math.max(1,Math.round(i*l))}fr)`}}function Z(){let t=document.getElementById("btfw-grid");if(!t)return;if(L){t.style.gridTemplateColumns="",t.classList.remove("btfw-grid--chat-left","btfw-grid--chat-right");return}let{video:e,chat:i}=Vt(Wt(t)),l=C==="left"?`${i} var(--btfw-split-width, 8px) ${e}`:`${e} var(--btfw-split-width, 8px) ${i}`;t.style.gridTemplateColumns=l,t.classList.toggle("btfw-grid--chat-left",C==="left"),t.classList.toggle("btfw-grid--chat-right",C!=="left")}function Nt(t){if(!Number.isFinite(t))return;let e=document.getElementById("btfw-grid"),i=gt(e),l=Math.min(Math.max(t,r),i-f);u=l,yt(l/i),N(n,String(l)),Z()}function $t(){let t=window.innerWidth,l=Math.max(r,t*Q(k!==null?k:E))+f+x;return Math.min(Math.max(l,y),m)}function qt(){let t=window.innerWidth,e=$t();return L?t<e+p:t<e}function tt(){let t=document.getElementById("btfw-stack");if(!t)return;if(L){t.classList.add("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let _=document.getElementById("btfw-grid"),v=document.getElementById("btfw-chatcol");if(!_||!v)return;(t.parentElement!==_||t.previousElementSibling!==v)&&(v.nextSibling?_.insertBefore(t,v.nextSibling):_.appendChild(t));return}t.classList.remove("btfw-stack--below-chat"),t.classList.remove("btfw-stack--in-chat");let e=document.getElementById("btfw-leftpad");if(!e)return;let i=document.getElementById("btfw-video-stage"),l=document.getElementById("videowrap"),S=document.getElementById("btfw-video-overlay"),g=i||(S&&S.parentElement===e?S:l);g&&g.parentElement===e?g.nextSibling!==t&&(g.nextSibling?e.insertBefore(t,g.nextSibling):e.appendChild(t)):t.parentElement!==e&&e.appendChild(t)}function et(){let t=document.getElementById("btfw-grid");if(!t)return;let e=qt();e!==L?(L=e,t.classList.toggle("btfw-grid--vertical",e),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&(document.body.classList.toggle("btfw-mobile-stack-enabled",e),document.body.classList.toggle("btfw-desktop-scroll-enabled",!e)),tt(),G(),setTimeout(()=>{G();try{window.dispatchEvent(new Event("resize"))}catch(i){}},60),document.dispatchEvent(new CustomEvent("btfw:layout:orientation",{detail:{vertical:e}}))):tt(),t.classList.toggle("btfw-grid--desktop-scroll",!e),document.body&&document.body.classList.toggle("btfw-desktop-scroll-enabled",!e),Z(),q(),M(),B(),G(),xt(),requestAnimationFrame(()=>{M(),P(),G()})}function q(){let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top"),i=(t?t.offsetHeight:48)+"px";document.documentElement.style.setProperty("--btfw-nav-real-height",i),document.documentElement.style.setProperty("--btfw-top",i);let l=$&&j?"0px":i;document.documentElement.style.setProperty("--btfw-top-effective",l);let S=document.getElementById("btfw-chatcol");S&&(S.style.removeProperty("top"),S.style.removeProperty("height"))}function zt(){let t=document.getElementById("btfw-grid"),e=document.getElementById("btfw-vsplit");if(!t||!e){console.warn("[BTFW] Resizer elements not found.");return}if(e.dataset.btfwResizeWired)return;e.dataset.btfwResizeWired="true";let i=!1,l=null;function S(v){if(!i||l!==null&&v.pointerId!==l)return;if(L){g();return}let I=t.getBoundingClientRect(),T=e.getBoundingClientRect().width||parseFloat(getComputedStyle(e).width)||6,H;if(C==="left"){let F=v.clientX-I.left,V=Math.max(F-T/2,0),z=I.width-V-T;if(z<r||V<f)return;H=z}else{H=v.clientX-I.left;let F=I.width-H-T;if(H<r||F<f)return}Number.isFinite(H)&&Nt(H)}function g(){if(!i)return;let v=l;i=!1,l=null,document.body.classList.remove("btfw-resizing"),e.removeEventListener("pointermove",S),e.removeEventListener("pointerup",g),e.removeEventListener("pointercancel",g),window.removeEventListener("blur",g),document.removeEventListener("visibilitychange",_);try{v!==null&&typeof e.releasePointerCapture=="function"&&e.releasePointerCapture(v)}catch(I){}et()}function _(){document.visibilityState==="hidden"&&g()}e.addEventListener("pointerdown",v=>{if(!(L||v.button!==0)){i=!0,l=v.pointerId,v.preventDefault(),document.body.classList.add("btfw-resizing");try{e.setPointerCapture(v.pointerId)}catch(I){}e.addEventListener("pointermove",S),e.addEventListener("pointerup",g),e.addEventListener("pointercancel",g),window.addEventListener("blur",g),document.addEventListener("visibilitychange",_)}})}let vt=/^(col(-(xs|sm|md|lg|xl))?-(\d+|auto)|row|container(-fluid)?|pull-(left|right)|offset-\d+)$/;function jt(t){t&&((t.classList||[]).forEach(e=>{vt.test(e)&&t.classList.remove(e)}),t.querySelectorAll("[class]").forEach(e=>{Array.from(e.classList).forEach(i=>{vt.test(i)&&e.classList.remove(i)})}))}function Ut(){let t=document.getElementById("videowrap-header");if(!t){console.log("[layout] No videowrap-header found");return}let e=t.querySelector("#currenttitle"),i=document.querySelector("#chatwrap .btfw-chat-topbar");if(i){let l=i.querySelector("#btfw-nowplaying-slot");l||(l=document.createElement("div"),l.id="btfw-nowplaying-slot",l.className="btfw-chat-title",i.innerHTML="",i.appendChild(l)),e?(l.appendChild(e),console.log("[layout] Moved #currenttitle to slot")):console.log("[layout] No #currenttitle found in videowrap-header")}t.remove()}function Gt(t){if(!t)return;let e=document.getElementById("btfw-video-stage");e?e.getAttribute("data-testid")||e.setAttribute("data-testid","btfw-video-stage"):(e=document.createElement("div"),e.id="btfw-video-stage",e.className="btfw-video-stage",e.setAttribute("data-testid","btfw-video-stage")),e.parentElement!==t&&t.insertBefore(e,t.firstChild);let i=document.getElementById("videowrap"),l=document.getElementById("btfw-video-overlay");i&&i.parentElement!==e&&e.appendChild(i),l&&l.parentElement!==e&&e.appendChild(l)}function Kt(){let t=document.getElementById("wrap")||document.body,e=document.getElementById("videowrap"),i=document.getElementById("chatwrap"),l=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer");if(document.getElementById("btfw-grid")){let g=document.getElementById("btfw-leftpad"),_=document.getElementById("btfw-chatcol");_&&!_.getAttribute("data-testid")&&_.setAttribute("data-testid","btfw-chatcol");let v=document.getElementById("videowrap"),I=document.getElementById("chatwrap"),R=document.getElementById("playlistrow")||document.getElementById("playlistwrap")||document.getElementById("queuecontainer"),T=document.getElementById("btfw-grid");T&&!T.getAttribute("data-testid")&&T.setAttribute("data-testid","btfw-grid"),kt(T),v&&!g.contains(v)&&g.appendChild(v),R&&!g.contains(R)&&g.appendChild(R),I&&!_.contains(I)&&_.appendChild(I)}else{let g=document.createElement("div");g.id="btfw-grid",g.setAttribute("data-testid","btfw-grid");let _=document.createElement("div");_.id="btfw-leftpad";let v=document.createElement("aside");v.id="btfw-chatcol",v.setAttribute("data-testid","btfw-chatcol"),e&&_.appendChild(e),l&&_.appendChild(l),i&&v.appendChild(i);let I=document.createElement("div");I.id="btfw-vsplit",kt(g),g.appendChild(_),g.appendChild(I),g.appendChild(v),g.style.opacity="0",t.prepend(g)}["videowrap","playlistrow","playlistwrap","queuecontainer","queue","plmeta","chatwrap","controlsrow","rightcontrols"].forEach(g=>jt(document.getElementById(g))),Ut();let S=document.getElementById("btfw-leftpad");Gt(S),tt()}function Yt(){let t=document.getElementById("btfw-grid");t&&(t.classList.add("btfw-loaded"),t.style.opacity="1"),et(),document.dispatchEvent(new CustomEvent("btfw:layoutReady"))}function Jt(){Kt();let t=()=>{q(),zt(),Yt()};t(),document.readyState!=="complete"&&window.addEventListener("load",t,{once:!0})}let lt=0,dt=0,ct=0;function G(){ct||(ct=requestAnimationFrame(()=>{ct=0,A()}))}function Xt(){dt||(dt=requestAnimationFrame(()=>{dt=0,L&&(M(),P(),G())}))}function Et(){lt||(lt=requestAnimationFrame(()=>{lt=0,et()}))}function xt(){let t=document.getElementById("btfw-video-overlay");if(!t||t._btfwChromeObs)return;t._btfwChromeObs=!0,new ResizeObserver(()=>{L&&Xt()}).observe(t)}document.addEventListener("btfw:layoutReady",xt);function St(){Dt(),C=st(),Z(),q();let t=document.querySelector(".navbar, #nav-collapsible, #navbar, .navbar-fixed-top");t&&new ResizeObserver(()=>{setTimeout(q,0),Et()}).observe(t),window.addEventListener("resize",()=>{setTimeout(q,0),Et()})}document.addEventListener("btfw:layout:chatSideChanged",t=>{C=t&&t.detail&&t.detail.side==="left"?"left":"right",Z(),et()}),document.addEventListener("btfw:chat:barsReady",()=>{tt()}),document.addEventListener("btfw:layout:stackVisibility",t=>{B((t==null?void 0:t.detail)||{}),M(),A(),requestAnimationFrame(P)}),document.addEventListener("btfw:navbar:autohide",t=>{let e=(t==null?void 0:t.detail)||{};$=!!e.active,j=!!e.hidden,q(),M(),A(),requestAnimationFrame(P)});function Qt(){let t=["nav.navbar",".navbar-fixed-top","#navbar"];for(let e of t){let i=document.querySelector(e);if(i)return i}return null}function kt(t){if(!t)return;let e=Qt();if(!e)return;let i=document.getElementById(a);i||(i=document.createElement("div"),i.id=a,i.className="btfw-navhost"),e.parentElement!==i&&i.appendChild(e),i.parentElement!==t&&t.insertBefore(i,t.firstChild)}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",St):St(),{name:"feature:layout",commitLayout:Jt}});})();
