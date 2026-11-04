/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{var ct=Object.defineProperty;var dt=(e,n)=>{for(var m in n)ct(e,m,{get:n[m],enumerable:!0})};BTFW.define("feature:player",[],async()=>{var M;let e=(b,_=document)=>_.querySelector(b),n=(b,_=document)=>Array.from(_.querySelectorAll(b)),m=((M=window.BTFW)==null?void 0:M.BASE)||"";function s(b){if(!b)return;let _=b.startsWith("http")?b:`${m}/${b.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(h=>h.getAttribute("href")===_||h.getAttribute("href")===b))return;let f=document.createElement("link");f.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[b]&&(f.integrity=window.BTFW.SRI[b],f.crossOrigin="anonymous"),f.href=_,document.head.appendChild(f)}function u(){let b=e("#videowrap");if(!b)return;s("dist/css/player.css"),b.classList.add("btfw-player-wrap");let _=b.querySelector("#controlsrow, .player-controls");_&&_.classList.add("btfw-player-controls"),a()}function a(){if(window.videojs)try{let b=document.querySelector(".video-js");b&&!b.classList.contains("btfw-vjs-enhanced")&&b.classList.add("btfw-vjs-enhanced")}catch(b){}}function S(){let b=e("#videowrap");if(!b)return;new MutationObserver(()=>{a()}).observe(b,{childList:!0,subtree:!0})}function y(){u(),S();try{let b=window.socket;b&&typeof b.on=="function"&&b.on("changeMedia",()=>{setTimeout(u,100)})}catch(b){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",y):y(),{name:"feature:player",applyPlayerLayoutEnhancements:u}});var Ae={};dt(Ae,{addMediaButtonHtml:()=>pt,addMediaPanelHtml:()=>mt,panelUndockIconHtml:()=>Me,panelsMenuButtonHtml:()=>Le,playlistAddFormHtml:()=>Ce,playlistSearchButtonHtml:()=>bt,stackGroupHeaderHtml:()=>_e});function ut(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ft(e,...n){var s;let m="";for(let u=0;u<e.length;u+=1)m+=(s=e[u])!=null?s:"",u<n.length&&(m+=ut(n[u]));return m}function mt(){return`
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
      `}function _e(e){return ft`
      <span class="btfw-stack-item__title">${e}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `}function Le(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function Me(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function Ce(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function pt(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}function bt(){return'<i class="fa fa-search" aria-hidden="true"></i>'}function ue(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function se(e,n){return e!=null?!!e:!!n}var we=class extends Error{constructor(n){super(n),this.name="TimeoutError"}};function Ge(){let e=globalThis.MutationObserver;return typeof e=="function"?e:null}function Ye(){var n,m;let e=globalThis;return{setTimeoutFn:(n=e.setTimeout)!=null?n:null,clearTimeoutFn:(m=e.clearTimeout)!=null?m:null}}function ht(e,n){if(n)return n;let m=e!=null?e:globalThis.document;return m&&typeof m.querySelector=="function"?s=>m.querySelector(s):()=>null}function Ve(e){if(e)try{e.disconnect()}catch(n){}}function fe(e,n={}){let{root:m=null,timeoutMs:s,includeExisting:u=!0,observerClass:a}=n;return new Promise((S,y)=>{var U,F;let M=a!==void 0?a:Ge(),b=ht(m,n.querySelector),_=Ye(),A=(U=n.setTimeoutFn)!=null?U:_.setTimeoutFn,f=(F=n.clearTimeoutFn)!=null?F:_.clearTimeoutFn,h=null,p=null,v=!1,k=I=>{v||(v=!0,Ve(h),h=null,p!==null&&f&&(f(p),p=null),I())},L=I=>{k(()=>S(I))},x=I=>{k(()=>y(I))},C=()=>{typeof s!="number"||!A||!f||(p=A(()=>{x(new we(`waitForElement: "${e}" not found within ${s}ms`))},s))};if(u){let I=b(e);if(I){L(I);return}}if(!M){x(new Error("waitForElement: no MutationObserver implementation available"));return}h=new M(()=>{let I=b(e);I&&L(I)});let O=m!=null?m:globalThis.document;if(!O){x(new Error("waitForElement: no root available to observe"));return}h.observe(O,{childList:!0,subtree:!0}),C()})}function pe(e,n={}){let{root:m=null,timeoutMs:s,observerClass:u}=n;return new Promise((a,S)=>{var x,C;let y=u!==void 0?u:Ge(),M=Ye(),b=(x=n.setTimeoutFn)!=null?x:M.setTimeoutFn,_=(C=n.clearTimeoutFn)!=null?C:M.clearTimeoutFn,A=null,f=null,h=!1,p=O=>{h||(h=!0,Ve(A),A=null,f!==null&&_&&(_(f),f=null),O())},v=()=>{typeof s!="number"||!b||!_||(f=b(()=>{p(()=>S(new we("waitForCondition: condition not met within timeout")))},s))},k=e();if(k){p(()=>a(k));return}if(!y){p(()=>S(new Error("waitForCondition: no MutationObserver implementation available")));return}let L=m!=null?m:globalThis.document;if(!L){p(()=>S(new Error("waitForCondition: no root available to observe")));return}A=new y(()=>{let O=e();O&&p(()=>a(O))}),A.observe(L,{childList:!0,subtree:!0,attributes:!0}),v()})}var yt=/[&<>"']/g,gt={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function re(e){return e==null?"":String(e).replace(yt,n=>{var m;return(m=gt[n])!=null?m:n})}function wt(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function je(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var vt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],Et={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},St=["http","https","mailto"],kt="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",xt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,Tt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,_t={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function Lt(e){let n=e;for(let s=0;s<3;s+=1){let u=n.replace(/&#x([0-9a-fA-F]+);?/g,(a,S)=>{let y=Number.parseInt(S,16);if(!Number.isFinite(y)||y<0||y>1114111)return"";try{return String.fromCodePoint(y)}catch(M){return""}}).replace(/&#(\d+);?/g,(a,S)=>{let y=Number(S);if(!Number.isFinite(y)||y<0||y>1114111)return"";try{return String.fromCodePoint(y)}catch(M){return""}}).replace(/&([a-zA-Z]+);?/g,(a,S)=>{let y=_t[S.toLowerCase()];return y!==void 0?y:a});if(u===n)break;n=u}let m="";for(let s=0;s<n.length;s+=1){let u=n.charCodeAt(s);u<=31||u===127||(m+=n[s])}return m.replace(/[\s\u00a0]+/g,"")}function Mt(e){var u,a;let n=new Map,m=new RegExp(xt.source,"g"),s;for(;(s=m.exec(e))!==null;){let S=((u=s[1])!=null?u:"").toLowerCase(),y=(a=s[2])!=null?a:"";(y.startsWith('"')&&y.endsWith('"')||y.startsWith("'")&&y.endsWith("'"))&&(y=y.slice(1,-1)),n.set(S,y),s[0].length===0&&(m.lastIndex+=1)}return n}function Ct(e,n){var a;let m=Lt(e);if(m.length===0)return!0;let s=Tt.exec(m);if(!s)return!0;let u=((a=s[1])!=null?a:"").toLowerCase();return n.includes(u)?u==="data"?/^data:image\//i.test(m):!0:!1}function At(e,n,m,s,u,a,S){var p,v;let y=n.toLowerCase();if(!u.has(y))return"";if(e)return`</${y}>`;let M=Mt(m||""),b=(p=a["*"])!=null?p:[],_=(v=a[y])!=null?v:[],A=[];for(let[k,L]of M)k.startsWith("on")||!(b.includes(k)||_.includes(k))||(k==="href"||k==="src")&&!Ct(L,S)||A.push(`${k}="${wt(L)}"`);y==="a"&&M.get("target")==="_blank"&&_.includes("rel")&&(A.some(k=>k.startsWith("rel="))||A.push('rel="noopener noreferrer"'));let f=A.length>0?` ${A.join(" ")}`:"";return`<${y}${f}${s?" /":""}>`}function be(e,n={}){var _,A,f;if(e==null)return"";let m=String(e).replace(/<!--[\s\S]*?-->/g,""),s=new Set(((_=n.allowedTags)!=null?_:vt).map(h=>h.toLowerCase())),u=(A=n.allowedAttributes)!=null?A:Et,a=(f=n.allowedSchemes)!=null?f:St,S=new RegExp(kt,"g"),y="",M=0,b;for(;(b=S.exec(m))!==null;){let[h,p,v="",k="",L]=b;y+=je(m.slice(M,b.index)),y+=At(p,v,k,L,s,u,a),M=b.index+h.length}return y+=je(m.slice(M)),y}var Ke="btfw-stack-order",he="btfw-stack-motd-open",Pe="btfw-stack-playlist-open",Oe="btfw-stack-poll-open",ve={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Ie={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},Qe={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Ne={"motd-group":1,"poll-group":2,"playlist-group":3},de=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Be=["#main","#mainpage","#mainpane"];function le(e){try{let n=Array.from(e.children).map(m=>({id:m.dataset.bind,isGroup:m.dataset.group==="true"}));localStorage.setItem(Ke,JSON.stringify(n))}catch(n){}}function Xe(){try{return JSON.parse(localStorage.getItem(Ke)||"[]")}catch(e){return[]}}function ye(e){try{let n=localStorage.getItem(e);return n===null?null:n==="true"}catch(n){return null}}function Re(e,n){try{localStorage.setItem(e,n?"true":"false")}catch(m){}}function qe(e){try{let n=localStorage.getItem(e);if(n!==null)return n==="true";let m=e.replace("-docked","-hidden"),s=localStorage.getItem(m);return s!==null?s==="true":!1}catch(n){return!1}}function Ze(e,n){try{localStorage.setItem(e,n?"true":"false")}catch(m){}}function He(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Ee(e,n,m){if(!e||He(e))return;let s=ye(n!=null?n:""),u=typeof m=="function"?m(s):s!==null?!!s:!0;e._btfwSetOpenState?e._btfwSetOpenState(u,{persist:!1}):(e.dataset.open=u?"true":"false",e.classList.toggle("is-open",u))}function Fe(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),n=e.filter(S=>S.dataset.docked!=="true"),m=e.length>0&&n.length===0,s=document.getElementById("btfw-stack"),u=document.getElementById("btfw-leftpad"),a=document.getElementById("btfw-grid");s&&(s.classList.toggle("btfw-stack--all-hidden",m),s.classList.toggle("btfw-stack--all-docked",m)),u&&u.classList.toggle("btfw-leftpad--stack-hidden",m),a&&a.classList.toggle("btfw-grid--stack-hidden",m),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:m,allDocked:m,visibleCount:n.length,totalCount:e.length}}))}function We(e=""){let n=String(e||"").trim();return n?!n.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function Je(e=document){if(!e||typeof e.querySelector!="function")return!1;let n=me(e);return n?!We(n.innerHTML||""):!1}function me(e=document){if(!e||typeof e.getElementById!="function")return null;let n=e.getElementById("motdwrap");if(!n)return e.getElementById("motd");let m=n.querySelector(":scope > #motd");return m||n.querySelector("#motd")||e.getElementById("motd")}function De(e=!1){let n=document.getElementById("motdwrap");if(!n)return null;if(!e&&n.dataset.btfwMotdNormalized==="1"){let a=n.querySelector(":scope > #motd");return a?{motdwrap:n,motd:a}:null}let m=document.getElementById("togglemotd");m&&m.closest("#motd")&&n.insertBefore(m,n.firstChild);let s=[];n.querySelectorAll(".btfw-motd-editrow").forEach(a=>{let S=(a.textContent||"").trim();S&&s.push(`<p>${S}</p>`),a.remove()}),n.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(a=>{a.contains(n)||a===n||((a.querySelector("#motd")||a.classList.contains("btfw-motd-editrow"))&&a.querySelectorAll("#motd").forEach(S=>{(S.innerHTML||"").trim()&&s.push(S.innerHTML)}),a.remove())});let u=n.querySelector(":scope > #motd");if(u||(u=document.createElement("div"),u.id="motd",n.appendChild(u)),n.querySelectorAll("#motd").forEach(a=>{a!==u&&((a.innerHTML||"").trim()&&s.push(a.innerHTML),a.remove())}),u.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(a=>{a.remove()}),u.querySelectorAll("#motd").forEach(a=>{(a.innerHTML||"").trim()&&s.push(a.innerHTML),a.remove()}),document.querySelectorAll("#togglemotd").forEach((a,S)=>{S!==0&&a.remove()}),s.length){let a=s.join("").trim();a&&We(u.innerHTML)?u.innerHTML=be(a):a&&(u.innerHTML+=be(a))}return n.dataset.btfwMotdNormalized="1",{motdwrap:n,motd:u}}function et(e){let n=null,m=!1,s=!1;function u(_){De();let A=document.getElementById("motdwrap");if(!A)return;let f=_&&_.list;if(!f)return;let h=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(h){let p=h.querySelector(".btfw-group-body");p&&!p.contains(A)&&p.appendChild(A)}else{let p=de.find(v=>v.id==="motd-group");if(!p)return;h=e.createGroupItem(p,[A]),h&&(f.appendChild(h),le(f))}a(h)}function a(_){let A=document.getElementById("motdwrap");if(!A)return;let f=Je();if(A.classList.toggle("btfw-motd-empty",!f),A.toggleAttribute("hidden",!f),A.setAttribute("aria-hidden",f?"false":"true"),f){A.style.removeProperty("display");let h=me();h&&h.style.removeProperty("display")}if(_||(_=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),_&&f){let h=ye(he),p=se(h,!0),v=_;v._btfwSetOpenState?v._btfwSetOpenState(p,{persist:!1}):(v.dataset.open=p?"true":"false",v.classList.toggle("is-open",p))}}function S(_){n&&clearTimeout(n),n=setTimeout(()=>{n=null,u(_)},50)}function y(_){let A=me();A&&(m||(m=!0,new MutationObserver(()=>{S(_)}).observe(A,{childList:!0,subtree:!0,characterData:!0})))}function M(_){s||!window.socket||!window.socket.on||(s=!0,window.socket.on("setMotd",A=>{let f=typeof A=="string"?A:A&&typeof A=="object"&&typeof A.motd=="string"?A.motd:null,h=me();if(h){let p=f!==null?f:h.innerHTML,v=be(p);h.innerHTML!==v&&(h.innerHTML=v)}S(_)}))}function b(_){let A=e.ensureStackRefs(),f=document.getElementById("motdwrap");f&&delete f.dataset.btfwMotdNormalized;let h=De(!0),p=(h==null?void 0:h.motd)||me();p&&typeof _=="string"&&(p.innerHTML=be(_));let v=document.getElementById("cs-motdtext");v&&typeof _=="string"&&(v.value=_),A&&S(A)}return{isMotdHtmlEmpty:We,hasMotdContent:Je,resolveMotdHost:me,normalizeMotdStructure:De,ensureMotdStackPanel:u,syncMotdWrapVisibility:a,scheduleMotdSync:S,wireMotdObservers:y,wireMotdSocket:M,applyMotdUpdate:b}}var Pt=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function tt(e){let{tpl:n}=e;function m(p,v,k){if(!p||!v||!k)return null;let L=Pt.map(W=>{let $=document.getElementById(W.id);return $?{...W,el:$}:null}).filter(Boolean);if(!L.length){let W=document.getElementById("btfw-addmedia-panel");return W&&W.remove(),null}let x=document.getElementById("btfw-addmedia-panel");if(x||(x=document.createElement("section"),x.id="btfw-addmedia-panel",x.className="btfw-addmedia-panel",x.dataset.open="false",x.setAttribute("role","region"),x.setAttribute("aria-label","Add media controls"),x.setAttribute("aria-hidden","true"),x.setAttribute("hidden","hidden"),x.innerHTML=n.addMediaPanelHtml()),x.parentElement!==p){let W=v.parentElement===p?v.nextSibling:null;p.insertBefore(x,W)}let C=x.querySelector(".btfw-addmedia-tabs"),O=x.querySelector(".btfw-addmedia-views"),U=x.querySelector(".btfw-addmedia-close");if(!C||!O)return null;for(;C.firstChild;)C.removeChild(C.firstChild);for(;O.firstChild;)O.removeChild(O.firstChild);L.forEach(({id:W,title:$,el:N})=>{N.classList.remove("collapse","in","plcontrol-collapse"),N.style.removeProperty("display"),N.style.removeProperty("height"),N.removeAttribute("aria-expanded"),N.setAttribute("role","tabpanel"),N.setAttribute("data-btfw-addmedia","panel");let G=document.createElement("button");G.type="button",G.className="btfw-addmedia-tab",G.dataset.target=W,G.textContent=$,G.setAttribute("role","tab"),C.appendChild(G);let j=document.createElement("div");j.className="btfw-addmedia-view",j.dataset.target=W,j.setAttribute("role","tabpanel"),j.setAttribute("aria-hidden","true"),j.appendChild(N),O.appendChild(j)});let F=L.find(W=>W.default)||L[0],I=W=>{let $=W||x.dataset.active||F.id;x.dataset.active=$,C.querySelectorAll(".btfw-addmedia-tab").forEach(N=>{let G=N.dataset.target===$;N.classList.toggle("is-active",G),N.setAttribute("aria-selected",G?"true":"false"),N.setAttribute("tabindex",G?"0":"-1")}),O.querySelectorAll(".btfw-addmedia-view").forEach(N=>{let G=N.dataset.target===$;N.classList.toggle("is-active",G),N.setAttribute("aria-hidden",G?"false":"true")})},V=W=>{let $=W!=null?!!W:x.dataset.open!=="true";return x.dataset.open=$?"true":"false",x.classList.toggle("is-open",$),x.setAttribute("aria-hidden",$?"false":"true"),$?(x.removeAttribute("hidden"),I(x.dataset.active||F.id)):x.setAttribute("hidden","hidden"),x.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:$}})),$};return x._btfwWired||(C.addEventListener("click",W=>{let $=W.target.closest(".btfw-addmedia-tab");$&&(W.preventDefault(),I($.dataset.target))}),U&&U.addEventListener("click",()=>V(!1)),x._btfwWired=!0),I(x.dataset.active||F.id),x._btfwToggle=V,x._btfwSetActive=I,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:$,target:N})=>{let G=document.getElementById($);G&&G.dataset.btfwAddmedia!==N&&(G.dataset.btfwAddmedia=N,G.setAttribute("aria-controls","btfw-addmedia-panel"),G.addEventListener("click",j=>{j.preventDefault(),j.stopPropagation(),I(N),V(!0),G.blur()}))})})(),{panel:x,toggle:V,setActive:I}}function s(p,v,k){let L=p.querySelector(".btfw-plbar__search");if(!L||document.getElementById("btfw-pl-search-toggle"))return;L.id||(L.id="btfw-plbar-search"),L.hidden=!0;let x=document.createElement("button");x.type="button",x.id="btfw-pl-search-toggle",x.className="button is-dark is-small btfw-plbar__action-btn",x.innerHTML=n.playlistSearchButtonHtml(),x.title="Filter Playlist",x.setAttribute("aria-label","Filter Playlist"),x.setAttribute("aria-controls",L.id),x.setAttribute("aria-expanded","false"),k&&k.parentElement===v?k.after(x):v.prepend(x);let C=L.querySelector("input"),O=U=>{var F;if(L.hidden=!U,x.setAttribute("aria-expanded",U?"true":"false"),U){C==null||C.focus();return}C!=null&&C.value&&((F=L.querySelector("#btfw-pl-clear"))==null||F.click())};x.addEventListener("click",()=>O(x.getAttribute("aria-expanded")!=="true")),L.addEventListener("keydown",U=>{U.key==="Escape"&&(O(!1),x.focus())})}function u(){let p=document.getElementById("btfw-plbar");if((p==null?void 0:p.dataset.btfwMerged)==="1")return;let v=document.getElementById("controlsrow"),k=document.getElementById("rightcontrols"),L=document.getElementById("playlistwrap"),x=document.getElementById("queuecontainer"),C=document.getElementById("playlistrow"),O=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),U=document.querySelectorAll(".btfw-controls-row"),F=C||L||x||O;if(!F)return;let I=p;I?I.classList.add("btfw-plbar"):(I=document.createElement("div"),I.id="btfw-plbar",I.className="btfw-plbar");let V=I.querySelector(".btfw-plbar__layout"),K,W;if(V)K=V.querySelector(".btfw-plbar__primary")||V,W=V.querySelector(".btfw-plbar__aside")||V;else{for(V=document.createElement("div"),V.className="btfw-plbar__layout",K=document.createElement("div"),K.className="btfw-plbar__primary",W=document.createElement("div"),W.className="btfw-plbar__aside",V.append(K,W);I.firstChild;)K.appendChild(I.firstChild);I.appendChild(V);let Y=K.querySelector(".field.has-addons");Y&&Y.classList.add("btfw-plbar__search");let Q=K.querySelector("#btfw-pl-count");Q&&(Q.classList.add("btfw-plbar__count"),W.appendChild(Q))}I.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(Y=>Y.remove());let $=I.querySelector(".btfw-plbar__actions");$||($=document.createElement("div"),$.className="btfw-plbar__actions",(W||I).appendChild($));let N=document.getElementById("btfw-addmedia-btn"),G=Y=>{if(Y){if(Y.classList.add("btfw-plbar__action-btn"),Y.tagName==="BUTTON"||Y.tagName==="A")Y.classList.add("button","is-dark","is-small");else if(Y.tagName==="INPUT"){let Q=(Y.type||"").toLowerCase();Q==="button"||Q==="submit"||Q==="reset"?Y.classList.add("button","is-dark","is-small"):Y.classList.remove("button","is-dark","is-small")}}};I.parentElement!==F&&F.insertBefore(I,F.firstChild);let j=m(F,I,$);j?!N||!document.body.contains(N)?(N=document.createElement("button"),N.id="btfw-addmedia-btn",N.setAttribute("type","button"),N.className="button is-small",N.innerHTML=n.addMediaButtonHtml(),$.prepend(N)):$.contains(N)||$.prepend(N):N&&(N.parentElement&&N.parentElement.removeChild(N),N=null);let ie=Y=>{if(!Y)return;Array.from(Y.children||[]).forEach(J=>{J&&(J.classList.add("btfw-plbar__control"),$.appendChild(J))})};if(k&&(ie(k),k.remove()),v&&(ie(v),v.remove()),$.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(G),j&&N){N.classList.remove("is-dark"),N.classList.add("is-primary"),N.dataset.iconified||(N.innerHTML=n.addMediaButtonHtml(),N.dataset.iconified="1"),N.setAttribute("aria-controls","btfw-addmedia-panel");let Y=J=>{N.setAttribute("aria-expanded",J?"true":"false")};N.dataset.btfwBound||(N.dataset.btfwBound="1",N.addEventListener("click",J=>{J.preventDefault();let oe=document.getElementById("btfw-addmedia-panel"),ee=oe&&oe._btfwToggle,E=typeof ee=="function"?ee():!1;Y(E)}));let Q=j.panel||document.getElementById("btfw-addmedia-panel");Q&&(Y(Q.dataset.open==="true"),Q._btfwButtonSync||(Q.addEventListener("btfw:addmedia:state",J=>{Y(!!J.detail&&!!J.detail.open)}),Q._btfwButtonSync=!0))}s(I,$,N),U.forEach(Y=>{Y&&!F.contains(Y)&&(Y.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,Y.remove(),F.appendChild(Y),console.log("[stack] Moved floating controls row into playlist container"))}),F.contains(I)||F.insertBefore(I,F.firstChild),I.dataset.btfwMerged="1"}function a(p){if(!p)return null;let v=Array.from(p.classList).find(L=>L.startsWith("pluid-"));if(v)return v.slice(6);let k=window.jQuery||window.$;if(k){let L=k(p).data("uid");if(L!=null&&L!=="")return L}return p.dataset.uid||null}function S(p){if(p==null||p==="")return!1;let v=window.socket;if(v&&typeof v.emit=="function")return v.emit("jumpTo",p),!0;let k=document.querySelector(`#queue > .queue_entry.pluid-${p}`),L=k==null?void 0:k.querySelector(".qbtn-play");return L?(L.click(),!0):!1}function y(p){let v=(p||"").trim();if(!v)return!1;let k=document.getElementById("mediaurl"),L=document.getElementById("queue_next");if(k&&L&&(k.value=v,!L.disabled))return L.click(),!0;if(typeof window.queue=="function"&&k)return k.value=v,window.queue("next","url"),!0;let x=window.socket;if(x&&typeof parseMediaLink=="function")try{let C=parseMediaLink(v);if((C==null?void 0:C.id)!=null&&(C!=null&&C.type))return x.emit("queue",{id:C.id,type:C.type,pos:"next",temp:!1}),!0}catch(C){}return!1}let M=null,b=null;function _(){if(M){try{M.disconnect()}catch(p){}M=null}b=null}function A(p){if(!p||b===p)return;_();let v=document.getElementById("queue");v&&(b=p,M=new MutationObserver(()=>{p.isConnected&&e.getActiveFlyoutGroup()==="playlist-group"&&h(p)}),M.observe(v,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function f(p=5){let v=document.getElementById("queue");if(!v)return[];let k=Array.from(v.querySelectorAll(":scope > .queue_entry")),L=k.findIndex(C=>C.classList.contains("queue_active")||C.classList.contains("playing")),x=L>=0?L+1:0;return k.slice(x,x+p)}function h(p){if(!p)return;let v=f(5);if(p.replaceChildren(),!v.length){let k=document.createElement("p");k.className="btfw-panel-playlist__empty",k.textContent="No upcoming videos",p.appendChild(k);return}v.forEach(k=>{var F,I;let L=document.createElement("div");L.className="btfw-panel-playlist__item";let x=document.createElement("span");x.className="btfw-panel-playlist__title",x.textContent=(((F=k.querySelector(".qe_title"))==null?void 0:F.textContent)||"Untitled").trim();let C=document.createElement("span");C.className="btfw-panel-playlist__meta",C.textContent=(((I=k.querySelector(".qe_time"))==null?void 0:I.textContent)||"").trim();let O=document.createElement("div");O.className="btfw-panel-playlist__actions";let U=a(k);if(U!=null&&U!==""){let V=document.createElement("button");V.type="button",V.className="btfw-panel-playlist__play",V.textContent="Play",V.dataset.queueUid=String(U),!(k==null?void 0:k.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(V.disabled=!0),O.appendChild(V)}L.append(x,C,O),p.appendChild(L)})}return{ensureAddMediaUI:m,mergePlaylistControls:u,getQueueEntryUid:a,playQueueEntry:S,queueMediaLink:y,disconnectQueuePreviewObserver:_,ensureQueuePreviewObserver:A,getUpcomingQueueEntries:f,renderPlaylistQueuePreview:h}}function nt(e){let n=null,m=!1,s=!1;function u(){let f=document.getElementById("pollwrap");if(!f)return null;if(!f.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return f;let p=document.getElementById("btfw-poll-parking");return p||(p=document.createElement("div"),p.id="btfw-poll-parking",p.hidden=!0,p.setAttribute("aria-hidden","true"),document.body.appendChild(p)),p.appendChild(f),f}function a(f){let h=document.getElementById("pollwrap");if(!h)return;let p=h.dataset&&h.dataset.btfwPollOverlay,v=h.getAttribute&&h.getAttribute("data-btfw-poll-overlay");if(p==="video"||v==="video")return;u(),A();let k=f&&f.list;if(!k)return;let L=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!L){let O=de.find(U=>U.id==="poll-group");if(!O)return;L=e.createGroupItem(O,[h]),L&&(k.appendChild(L),le(k));return}let x=L.querySelector(".btfw-group-body");x&&!x.contains(h)&&x.appendChild(h);let C=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');C&&C.contains(h)&&x&&x.appendChild(h)}function S(f,h={}){a(f),_();let p=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');p&&(p.hidden=!1,p.removeAttribute("hidden"),h.forceOpen&&p._btfwSetOpenState?p._btfwSetOpenState(!0,{persist:!1}):h.forceOpen&&(p.dataset.open="true",p.classList.add("is-open")))}function y(f,h={}){n&&clearTimeout(n),n=setTimeout(()=>{n=null,S(f,h)},50)}function M(f){if(m)return;let h=document.getElementById("pollwrap");if(!h)return;m=!0,new MutationObserver(()=>{y(f,{forceOpen:ue()})}).observe(h,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let v=document.getElementById("newpollbtn");v&&!v.dataset.btfwPollSync&&(v.dataset.btfwPollSync="1",v.addEventListener("click",()=>{y(f,{forceOpen:!0})}))}function b(f){s||!window.socket||!window.socket.on||(s=!0,window.socket.on("newPoll",()=>y(f,{forceOpen:!0})),window.socket.on("closePoll",()=>y(f)))}function _(){let f=document.getElementById("pollwrap");if(!f)return;let h=!!f.closest(".btfw-panel-container__host"),p=!ue();if(h&&!p){f.classList.remove("btfw-poll-idle"),f.removeAttribute("hidden"),f.setAttribute("aria-hidden","false");return}f.classList.toggle("btfw-poll-idle",p),f.toggleAttribute("hidden",p),f.setAttribute("aria-hidden",p?"true":"false")}function A(){let f=document.getElementById("leftcontrols"),h=document.getElementById("pollwrap");f&&h&&(f.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(v=>{let k=h.querySelector(".poll-controls");k||(k=document.createElement("div"),k.className="poll-controls",h.insertBefore(k,h.firstChild)),v.parentElement!==k&&k.appendChild(v)}),f.children.length===0&&f.remove())}return{detachPollWrapFromPlaylist:u,movePollButton:A,ensurePollStackPanel:a,syncPollPanelVisibility:S,schedulePollSync:y,wirePollObservers:M,wirePollSocket:b,syncPollWrapVisibility:_}}BTFW.define("feature:stack",["feature:layout"],async({init:e})=>{let n=!1,m=null,s="",u=null,a={"motd-group":{storageKey:he,getDefaultOpen:t=>se(t,_()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:Pe,getDefaultOpen:t=>se(t,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:Oe,getDefaultOpen:t=>se(t,ue()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},S=!1,y=null,M=!1,b=et({createGroupItem:p,ensureStackRefs:()=>h()}),_=b.hasMotdContent,A=tt({tpl:Ae,getActiveFlyoutGroup:()=>m}),f=nt({createGroupItem:p});function h(){let t=document.getElementById("btfw-leftpad");if(!t)return null;let r=document.getElementById("btfw-stack");if(!r){r=document.createElement("div"),r.id="btfw-stack",r.className="btfw-stack";let o=document.getElementById("videowrap"),d=document.getElementById("btfw-video-overlay"),l=d&&o&&d.parentElement===o.parentElement?d:o;l&&l.parentElement?l.nextSibling?l.parentNode.insertBefore(r,l.nextSibling):l.parentNode.appendChild(r):t.appendChild(r);let P=document.createElement("div");P.className="btfw-stack-list",r.appendChild(P);let R=document.createElement("div");R.id="btfw-stack-footer",R.className="btfw-stack-footer",r.appendChild(R)}return{list:r.querySelector(".btfw-stack-list"),footer:r.querySelector("#btfw-stack-footer")}}function p(t,r){if(t.id==="motd-group"&&(b.normalizeMotdStructure(),r=[document.getElementById("motdwrap")].filter(Boolean)),t.id==="playlist-group"&&(f.detachPollWrapFromPlaylist(),A.mergePlaylistControls(),r=r.filter(T=>T&&T.id!=="rightcontrols"&&T.id!=="pollwrap").filter(T=>!T.querySelector||!T.querySelector("#pollwrap"))),t.id==="poll-group"&&(f.detachPollWrapFromPlaylist(),f.movePollButton(),r=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),r.length===0)return null;let o=document.querySelector("#btfw-stack .btfw-stack-list");o&&(r=r.filter(T=>T&&!o.contains(T)&&!T.contains(o)));let d=document.createElement("section");d.className="btfw-stack-item btfw-group-item",d.dataset.bind=t.id,d.dataset.group="true";let l=document.createElement("header");l.className="btfw-stack-item__header",l.innerHTML=_e(t.title);let P=document.createElement("div");P.className="btfw-stack-item__body btfw-group-body",r.forEach(T=>{if(T&&T.parentElement!==P&&!P.contains(T)&&!T.contains(P))try{P.appendChild(T)}catch(B){console.warn("[stack] Failed to move element:",T.id||T.className,B)}}),d.appendChild(l),d.appendChild(P);let R=a[t.id];return R&&E(d,R),ee(d,t.id),d.querySelector(".btfw-up").onclick=function(){let T=d.parentElement,B=d.previousElementSibling;B&&T.insertBefore(d,B),le(T)},d.querySelector(".btfw-down").onclick=function(){let T=d.parentElement,B=d.nextElementSibling;B?T.insertBefore(B,d):T.appendChild(d),le(T)},d}function v(t){t&&(t.classList.remove("btfw-stack-item--in-drawer"),delete t.dataset.btfwInDrawer,t.classList.toggle("is-open",t.dataset.open!=="false"),f.syncPollWrapVisibility())}function k(t){v(t);let r=document.querySelector("#btfw-stack .btfw-stack-list");!r||!t||t.parentElement!==r&&r.appendChild(t)}function L(){var d;let t=document.getElementById("btfw-chat-actions");if(!t)return null;let r=document.getElementById("btfw-panels-menu-shell");if(!r){r=document.createElement("div"),r.id="btfw-panels-menu-shell",r.className="btfw-panels-menu-shell",r.setAttribute("aria-label","Docked channel panels");let l=document.createElement("div");l.id="btfw-panel-bar",l.className="btfw-panel-bar",l.setAttribute("role","toolbar"),l.setAttribute("aria-label","Docked panel shortcuts"),r.appendChild(l)}let o=r.querySelector("#btfw-panel-bar");return U(o),r.parentElement!==t&&t.insertBefore(r,t.firstChild),n||(ie(),n=!0),(d=document.getElementById("btfw-stack-drawer"))==null||d.remove(),r}function x(t){t.preventDefault(),t.stopPropagation(),N()}function C(){let t=L();if(!t)return null;let r=document.getElementById("btfw-panels-menu-btn");r?r.parentElement!==t&&t.appendChild(r):(r=document.createElement("button"),r.type="button",r.id="btfw-panels-menu-btn",r.className="button btfw-chatbtn btfw-panels-menu-btn",r.innerHTML=Le(),r.title="Docked Panels",r.setAttribute("aria-expanded","false"),r.hidden=!0,t.appendChild(r)),r.title="Docked Panels";let o=r.querySelector(".btfw-panels-menu-btn__label");return o&&(o.textContent="Panels"),r.classList.remove("is-wide"),r.dataset.btfwPanelsWired||(r.addEventListener("click",x),r.dataset.btfwPanelsWired="1"),r}function O(t){h();let r=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${t}"]`);r&&(u&&(clearTimeout(u),u=null),m=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o.classList.remove("is-active"),delete o.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),A.disconnectQueuePreviewObserver(),oe(r,!1),requestAnimationFrame(()=>{try{r.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(o){}}))}function U(t){!t||t.dataset.btfwActionsWired||(t.dataset.btfwActionsWired="1",t.addEventListener("click",r=>{var P,R,T;let o=r.target.closest(".btfw-panel-undock");if(o){r.preventDefault(),r.stopPropagation();let B=o.dataset.panelGroup||((P=o.closest(".btfw-panel-btn"))==null?void 0:P.dataset.group);B&&O(B);return}let d=r.target.closest(".btfw-panel-playlist__play");if(d){r.preventDefault(),r.stopPropagation(),A.playQueueEntry(d.dataset.queueUid);return}let l=r.target.closest(".btfw-panel-playlist__add");if(l){r.preventDefault(),r.stopPropagation();let B=(R=l.closest(".btfw-panel-container"))==null?void 0:R.querySelector(".btfw-panel-playlist__add-form");if(!B)return;let z=B.hidden;B.hidden=!z,l.setAttribute("aria-expanded",z?"true":"false"),z&&((T=B.querySelector(".btfw-panel-playlist__link-input"))==null||T.focus())}}),t.addEventListener("submit",r=>{var R,T,B,z;let o=r.target.closest(".btfw-panel-playlist__add-form");if(!o)return;r.preventDefault(),r.stopPropagation();let d=o.querySelector(".btfw-panel-playlist__link-input"),l=(R=d==null?void 0:d.value)==null?void 0:R.trim();if(!l||!A.queueMediaLink(l))return;d.value="",o.hidden=!0,(B=(T=o.closest(".btfw-panel-container"))==null?void 0:T.querySelector(".btfw-panel-playlist__add"))==null||B.setAttribute("aria-expanded","false");let P=(z=o.closest(".btfw-panel-container"))==null?void 0:z.querySelector(".btfw-panel-playlist__queue");P&&A.renderPlaylistQueuePreview(P)}))}function F(t,r){let o=document.createElement("button");return o.type="button",o.className="btfw-panel-undock",o.dataset.panelGroup=t,o.setAttribute("aria-label",`Pin ${r.title} below video`),o.title="Pin below video",o.innerHTML=Me(),o}function I(){let t=document.createElement("form");return t.className="btfw-panel-playlist__add-form",t.hidden=!0,t.innerHTML=Ce(),t}function V(t,r,o){let d=document.createElement("div");if(d.className="btfw-panel-container",o>0&&(d.style.bottom=`${-o*50}px`),t==="playlist-group"){d.classList.add("btfw-panel-container--playlist");let P=document.createElement("div");P.className="btfw-panel-playlist__toolbar";let R=document.createElement("button");R.type="button",R.className="btfw-panel-playlist__add",R.textContent="+Add",R.setAttribute("aria-expanded","false");let T=F(t,r);P.append(R,T);let B=I(),z=document.createElement("div");return z.className="btfw-panel-container__host btfw-panel-playlist__queue",d.append(P,B,z),d}d.classList.add("btfw-panel-container--dock-only");let l=document.createElement("div");return l.className="btfw-panel-container__dock-only",l.appendChild(F(t,r)),d.appendChild(l),d}function K(){u&&(clearTimeout(u),u=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(t=>{t.classList.remove("is-active"),delete t.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(t=>{k(t)}),A.disconnectQueuePreviewObserver(),m=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function W(t){let r=document.getElementById("btfw-panel-bar"),o=document.getElementById("btfw-panels-menu-btn");r&&r.classList.toggle("open",t),document.documentElement.classList.toggle("btfw-panels-bar-open",t),o&&(o.classList.toggle("is-expanded",t),o.setAttribute("aria-expanded",t?"true":"false")),t||K()}function $(){W(!1)}function N(){L();let t=document.getElementById("btfw-panel-bar"),r=document.getElementById("btfw-panels-menu-btn");!t||!r||r.hidden||W(!t.classList.contains("open"))}function G(t){u&&clearTimeout(u),u=setTimeout(()=>{u=null;let r=document.querySelector(`.btfw-panel-btn[data-group="${t}"]`);r&&(r.matches(":hover")||r.querySelector(".btfw-panel-container:hover")||(r.classList.remove("is-active"),m===t&&(m=null,A.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function j(t,r){if(r&&(u&&(clearTimeout(u),u=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o!==r&&o.classList.remove("is-active")}),m=t,r.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),t==="playlist-group")){let o=r.querySelector(".btfw-panel-playlist__queue");o&&(A.renderPlaylistQueuePreview(o),A.ensureQueuePreviewObserver(o))}}function ie(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",t=>{m&&(t.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(r=>{delete r.dataset.btfwFlyoutLocked}),K()))}))}function Y(t,r){var d;if(!((d=document.getElementById("btfw-panel-bar"))!=null&&d.classList.contains("open")))return;if(u&&(clearTimeout(u),u=null),r.dataset.btfwFlyoutLocked==="true"&&r.classList.contains("is-active")){delete r.dataset.btfwFlyoutLocked,r.classList.remove("is-active"),m===t&&(m=null,A.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(l=>{l!==r&&delete l.dataset.btfwFlyoutLocked}),r.dataset.btfwFlyoutLocked="true",j(t,r)}function Q(t,r){let o=t.querySelector(".btfw-panel-container"),d=()=>{var l;(l=document.getElementById("btfw-panel-bar"))!=null&&l.classList.contains("open")&&(u&&(clearTimeout(u),u=null),j(r,t))};t.addEventListener("mouseenter",d),t.addEventListener("focusin",d),t.addEventListener("click",l=>{l.target.closest(".btfw-panel-container")||(l.preventDefault(),l.stopPropagation(),Y(r,t))}),t.addEventListener("keydown",l=>{l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),Y(r,t))}),t.addEventListener("mouseleave",l=>{t.dataset.btfwFlyoutLocked!=="true"&&(o!=null&&o.contains(l.relatedTarget)||G(r))}),o==null||o.addEventListener("mouseenter",()=>{u&&(clearTimeout(u),u=null)}),o==null||o.addEventListener("mouseleave",l=>{t.dataset.btfwFlyoutLocked!=="true"&&(t.contains(l.relatedTarget)||G(r))})}function J(){let t=L();C();let r=t==null?void 0:t.querySelector("#btfw-panel-bar");if(!r)return;let o=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((T,B)=>(Ne[T.dataset.bind]||99)-(Ne[B.dataset.bind]||99)),d=o.map(T=>T.dataset.bind).join("|"),l=document.getElementById("btfw-panels-menu-btn");if(l&&(l.hidden=o.length===0,o.length===0)){s="",$();return}if(d===s&&r.childElementCount===o.length)return;s=d;let P=r.classList.contains("open"),R=m;if(K(),r.replaceChildren(),r.style.setProperty("--btfw-panel-bar-count",String(Math.max(o.length,1))),o.forEach((T,B)=>{let z=T.dataset.bind,X=Ie[z]||{short:"?",title:z},te=document.createElement("div");te.className="btfw-panel-btn",te.dataset.group=z,te.title=X.title,te.setAttribute("role","button"),te.setAttribute("aria-label",X.title),te.tabIndex=0;let ne=document.createElement("span");ne.className="btfw-panel-btn__label",ne.textContent=Qe[z]||X.short,te.appendChild(ne),te.appendChild(V(z,X,B)),r.appendChild(te),Q(te,z)}),P&&(W(!0),R&&o.some(B=>B.dataset.bind===R))){let B=r.querySelector(`.btfw-panel-btn[data-group="${R}"]`);B&&j(R,B)}}function oe(t,r,o={}){if(!t)return;let d=!!r,l=o.persist===!1,P=t.dataset.bind,R=ve[P];t.dataset.docked=d?"true":"false",t.classList.toggle("btfw-stack-item--docked",d);let T=t.querySelector(".btfw-stack-dock-btn");T&&(T.setAttribute("aria-pressed",d?"true":"false"),T.title=d?"Pinned to panels menu":"Dock to panels menu"),d?He(t)?k(t):m===P&&(m=null):(k(t),t._btfwSetOpenState?t._btfwSetOpenState(!0):(t.dataset.open="true",t.classList.add("is-open"))),!l&&R&&Ze(R,d),J(),Fe()}function ee(t,r){var B;let o=ve[r];if(!o)return;let d=t.querySelector(".btfw-stack-item__header"),l=d==null?void 0:d.querySelector(".btfw-stack-header-toolbar"),P=l==null?void 0:l.querySelector(".btfw-stack-arrows");if(!P||P.querySelector(".btfw-stack-dock-btn"))return;let R=qe(o);t.dataset.docked=R?"true":"false",t.classList.toggle("btfw-stack-item--docked",R);let T=document.createElement("button");T.type="button",T.className="btfw-arrow btfw-stack-dock-btn",T.textContent="\u2AF7",T.setAttribute("aria-label",`Dock ${((B=Ie[r])==null?void 0:B.title)||r} to panels menu`),T.setAttribute("aria-pressed",R?"true":"false"),T.title=R?"Pinned to panels menu":"Dock to panels menu",T.addEventListener("click",z=>{z.preventDefault(),z.stopPropagation(),t.dataset.docked!=="true"&&oe(t,!0)}),P.insertBefore(T,P.firstChild)}function E(t,r={}){let{storageKey:o,getDefaultOpen:d,toggleClass:l,ariaLabel:P="Toggle panel visibility",openTitle:R="Hide panel",closeTitle:T="Show panel"}=r,B=ye(o),z=typeof d=="function"?d(B):B!==null?B:!0;t.hasAttribute("data-open")||(t.dataset.open=z?"true":"false"),t.classList.toggle("is-open",t.dataset.open!=="false");let X=t.querySelector(".btfw-stack-item__header"),te=X&&X.querySelector(".btfw-stack-arrows");if(!te||te.querySelector(`.${l}`))return;let ne=document.createElement("button");ne.type="button",ne.className=`btfw-arrow ${l}`,ne.setAttribute("aria-label",P),ne.style.display="flex",ne.style.alignItems="center",ne.style.justifyContent="center";let ke=()=>{let ae=t.dataset.open!=="false";ne.textContent=ae?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",ne.title=ae?R:T,ne.setAttribute("aria-expanded",ae?"true":"false"),t.classList.toggle("is-open",ae)},ze=(ae,xe={})=>{let Ue=!!ae,Te=xe.persist===!1;Te&&(t._btfwSuppressPersist=!0),t.dataset.open=Ue?"true":"false",ke(),Te||Re(o,Ue),Te&&queueMicrotask(()=>{t._btfwSuppressPersist=!1})};ne.addEventListener("click",ae=>{ae.preventDefault(),ae.stopPropagation(),ze(t.dataset.open==="false")}),ke(),new MutationObserver(ae=>{for(let xe of ae)xe.type==="attributes"&&(ke(),t._btfwSuppressPersist||Re(o,t.dataset.open!=="false"))}).observe(t,{attributes:!0,attributeFilter:["data-open"]}),te.insertBefore(ne,te.firstChild),t._btfwSetOpenState=ze,ee(t,t.dataset.bind)}function q(t){return!!t.closest('.modal, [role="dialog"]')}function D(t){if(!t||t.querySelector("#btfw-footer"))return;let r=document.getElementById("btfw-footer");if(r&&r!==t&&!t.contains(r)){t.innerHTML="",t.appendChild(r);return}let o=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(d=>!q(d));o&&!t.contains(o)&&(o.classList.add("btfw-footer"),t.innerHTML="",t.appendChild(o))}function H(t){let r=document.querySelector(`.btfw-stack-item[data-bind="${t}"]`),o=r==null?void 0:r.querySelector(".btfw-stack-item__header");if(!o)return null;let d=o.querySelector(".btfw-stack-header-actions");if(!d){d=document.createElement("span"),d.className="btfw-stack-header-actions";let l=o.querySelector(".btfw-stack-header-toolbar"),P=(l==null?void 0:l.querySelector(".btfw-stack-arrows"))||o.querySelector(".btfw-stack-arrows");l&&P?l.insertBefore(d,P):P?o.insertBefore(d,P):o.appendChild(d)}return d}function Z(t,r){t&&(t.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),t.classList.add("btfw-stack-header-btn"),t.innerHTML!==r&&(t.innerHTML=r))}function g(){let t=H("poll-group"),r=document.getElementById("newpollbtn");if(t&&r){Z(r,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),r.parentElement!==t&&t.appendChild(r);let l=document.querySelector("#pollwrap > .poll-controls");l&&l.children.length===0&&l.remove()}let o=H("motd-group"),d=document.getElementById("btfw-motd-editbtn");if(o&&d){Z(d,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),d.parentElement!==o&&o.appendChild(d);let l=d.closest(".btfw-motd-editrow");l&&l.parentElement&&l.remove()}}function i(t){return de.every(r=>r.selectors.some(d=>{var P,R;if(Be.includes(d))return!1;let l=document.querySelector(d);if(!l||t.contains(l)||l.contains(t))return!1;if(d==="#pollwrap"){let T=(P=l.dataset)==null?void 0:P.btfwPollOverlay,B=(R=l.getAttribute)==null?void 0:R.call(l,"data-btfw-poll-overlay");if(T==="video"||B==="video")return!1}return!0})?!!t.querySelector(`[data-bind="${r.id}"]`):!0)}function c(t){if(!S){S=!0;try{let r=t.list,o=t.footer;if(i(r)&&r.children.length>0){b.ensureMotdStackPanel(t),f.ensurePollStackPanel(t),f.syncPollWrapVisibility(),g(),D(o);return}f.movePollButton(),f.detachPollWrapFromPlaylist();let d=new Map;de.forEach(R=>{let T=[];R.selectors.forEach(B=>{let z=document.querySelector(B);if(z&&!(r.contains(z)||z.contains(r))&&!Be.includes(B)){if(B==="#pollwrap"){let X=z.dataset&&z.dataset.btfwPollOverlay,te=z.getAttribute&&z.getAttribute("data-btfw-poll-overlay");if(X==="video"||te==="video")return}T.push(z)}}),T.length>0&&d.set(R.id,{group:R,elements:T})});let l=Xe(),P=[];d.forEach(({group:R,elements:T},B)=>{if(!Array.from(r.children).find(X=>X.dataset.bind===B))try{let X=p(R,T);X&&P.push({item:X,id:B,priority:R.priority,isGroup:!0})}catch(X){console.warn("[stack] Failed to create group item:",B,X)}}),l.length>0?P.sort((R,T)=>{let B=l.findIndex(X=>X.id===R.id),z=l.findIndex(X=>X.id===T.id);return B>=0&&z>=0?B-z:B>=0?-1:z>=0?1:R.priority-T.priority}):P.sort((R,T)=>R.priority-T.priority),P.forEach(({item:R})=>{try{R&&!r.contains(R)&&!R.contains(r)&&r.appendChild(R)}catch(T){console.warn("[stack] Failed to add item to list:",T)}}),le(r),b.ensureMotdStackPanel(t),f.ensurePollStackPanel(t),f.syncPollWrapVisibility(),g(),D(o)}finally{S=!1}}}function w(){let t=h();if(!t||(c(t),b.wireMotdObservers(t),b.wireMotdSocket(t),f.wirePollObservers(t),f.wirePollSocket(t),M))return;M=!0;let r=new MutationObserver(()=>{y||(y=requestAnimationFrame(()=>{y=null,c(t)}))}),o=document.getElementById("btfw-leftpad"),d=document.getElementById("main");o&&r.observe(o,{childList:!0,subtree:!1}),d&&r.observe(d,{childList:!0,subtree:!1}),fe("#btfw-stack .btfw-stack-item",{root:document}).then(()=>{let l=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');l&&Ee(l,he,T=>se(T,_()));let P=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');P&&Ee(P,Pe,T=>T!==null?!!T:!0);let R=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');R&&Ee(R,Oe,T=>se(T,ue())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(T=>{let B=ve[T.dataset.bind];B&&oe(T,qe(B),{persist:!1})}),L(),C(),J(),f.syncPollPanelVisibility(t),Fe(),c(t)}).catch(()=>{})}return document.addEventListener("btfw:layoutReady",w),document.addEventListener("btfw:chat:barsReady",()=>{L(),C(),J()}),setTimeout(w,1200),document.addEventListener("btfw:channelThemeTint",()=>{let t=h();t&&setTimeout(()=>c(t),100)}),document.addEventListener("btfw:motd:updated",t=>{var o;let r=(o=t==null?void 0:t.detail)==null?void 0:o.html;typeof r=="string"&&b.applyMotdUpdate(r)}),{name:"feature:stack",hasMotdContent:_,resolveMotdHost:b.resolveMotdHost,normalizeMotdStructure:b.normalizeMotdStructure,applyMotdUpdate:b.applyMotdUpdate}});BTFW.define("feature:videoOverlay",[],async()=>{let e=(g,i=document)=>i.querySelector(g),n=["#mediarefresh","#voteskip","#fullscreenbtn"],s={owner:["chanowner","owner","founder","admin","administrator"]};function u(){try{return window.CLIENT||window.client||null}catch(g){return null}}function a(){try{return window.CHANNEL||window.channel||null}catch(g){return null}}function S(){let g=a();if(g&&typeof g.perms=="object"&&g.perms)return g.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(i){return{}}}function y(g=[]){let i=S();for(let c of g){let w=i==null?void 0:i[c];if(typeof w=="number")return w}}function M(){let g=y(s.owner);return typeof g=="number"?g:5}function b(g){if(!g)return!1;try{if(typeof g.hasPermission=="function"&&g.hasPermission("chanowner"))return!0}catch(i){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(i){}return!1}function _(){let g=u();if(!g)return!1;let i=Number(g.rank);return Number.isFinite(i)?!!(i>=M()||b(g)):!1}let A=0,f=0,h=0,p=2e3,v=8e3,k=45e3,L=12e4,x=v,C=!1,O=null;function U(){if(e("#btfw-vo-css"))return;let g=document.createElement("style");g.id="btfw-vo-css",g.textContent=`
      #btfw-video-overlay{
        position: static;
        display: block;
        width: 100%;
        pointer-events: auto;
        opacity: 1;
        margin: 8px 0 4px;
      }

      #btfw-video-overlay .btfw-vo-bar{
        position: static;
        display: flex;
        gap: 8px;
        pointer-events: auto;
        background: transparent;
      }

      #btfw-video-overlay .btfw-vo-section {
        display:flex;
        align-items:center;
        gap:8px;
        pointer-events:auto;
      }

      #btfw-video-overlay .btfw-vo-section--right {
        margin-left:auto;
      }

      #btfw-video-overlay .btfw-vo-btn,
      #btfw-video-overlay .btfw-vo-adopted{
        all: unset;
        box-sizing: border-box;
        display:inline-grid;
        place-items:center;
        min-width:44px;
        height:44px;
        padding:0;
        border-radius:22px;
        border:0;
        background:rgba(0, 0, 0, 0.42);
        color:#fff;
        cursor:pointer;
        font:600 14px/1.05 "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.01em;
        backdrop-filter: blur(12px) saturate(120%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration:none;
      }

      #btfw-video-overlay .btfw-vo-btn i,
      #btfw-video-overlay .btfw-vo-adopted i {
        transition: transform 0.2s ease;
        font-size: 16px;
      }

      #btfw-video-overlay .btfw-vo-btn:hover,
      #btfw-video-overlay .btfw-vo-adopted:hover{
        background: rgba(109, 77, 246, 0.82);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(109, 77, 246, 0.36);
      }

      #btfw-video-overlay .btfw-vo-btn:hover i,
      #btfw-video-overlay .btfw-vo-adopted:hover i {
        transform: scale(1.08);
      }

      #btfw-video-overlay .btfw-vo-btn:active,
      #btfw-video-overlay .btfw-vo-adopted:active {
        transform: translateY(0);
      }

      #btfw-video-overlay .btfw-vo-btn:focus-visible,
      #btfw-video-overlay .btfw-vo-adopted:focus-visible {
        outline: 2px solid rgba(109, 77, 246, 0.95);
        outline-offset: 2px;
      }

      .btfw-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 12px;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(12px) saturate(120%);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 300px;
      }

      .btfw-notification--show {
        transform: translateX(0);
        opacity: 1;
      }

      .btfw-notification--success {
        background: rgba(34, 197, 94, 0.9);
        border: 1px solid rgba(34, 197, 94, 0.3);
      }

      .btfw-notification--error {
        background: rgba(239, 68, 68, 0.9);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      .btfw-notification--warning {
        background: rgba(245, 158, 11, 0.9);
        border: 1px solid rgba(245, 158, 11, 0.3);
      }

      .btfw-notification--info {
        background: rgba(59, 130, 246, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      #btfw-mini-toast{position:fixed;right:12px;bottom:12px;background:#111a;color:#fff;padding:8px 12px;border-radius:8px;font:12px/1.2 system-ui,Segoe UI,Arial;z-index:99999;pointer-events:none;opacity:0;transition:opacity .2s}

      @media (max-width: 768px) {
        #btfw-video-overlay .btfw-vo-bar {
          gap: 6px;
        }

        #btfw-video-overlay .btfw-vo-section {
          gap: 6px;
          flex-wrap: wrap;
        }

        #btfw-video-overlay .btfw-vo-btn,
        #btfw-video-overlay .btfw-vo-adopted {
          min-width: 40px;
          height: 40px;
          border-radius: 20px;
          font-size: 12px;
        }
      }
    `,document.head.appendChild(g)}function F(g){let i=e("#videowrap");!i||!g||((g.parentElement!==i.parentElement||g.previousElementSibling!==i)&&i.insertAdjacentElement("afterend",g),g.classList.add("btfw-vo-visible"))}function I(){if(!e("#videowrap"))return null;let i=e("#btfw-video-overlay");i||(i=document.createElement("div"),i.id="btfw-video-overlay",i.setAttribute("data-testid","btfw-video-overlay")),i.classList.add("btfw-video-overlay"),i.getAttribute("data-testid")||i.setAttribute("data-testid","btfw-video-overlay"),F(i);let c=i.querySelector("#btfw-vo-bar");c||(c=document.createElement("div"),c.className="btfw-vo-bar",c.id="btfw-vo-bar",i.appendChild(c));let w=K(i,c);return Y(w),Q(w),V(i),i}function V(g){g&&g.querySelectorAll("button").forEach(i=>{i.classList.contains("btfw-vo-btn")||i.classList.add("btfw-vo-btn")})}function K(g,i){let c="btfw-vo-left",w="btfw-vo-right",t=i.querySelector(`#${c}`);t||(t=document.createElement("div"),t.id=c,t.className="btfw-vo-section btfw-vo-section--left",i.insertBefore(t,i.firstChild));let r=i.querySelector(`#${w}`);return r||(r=document.createElement("div"),r.id=w,r.className="btfw-vo-section btfw-vo-section--right",i.appendChild(r)),Array.from(i.children).forEach(o=>{o===t||o===r||r.appendChild(o)}),g.dataset.leftSection=`#${c}`,g.dataset.rightSection=`#${w}`,i.dataset.leftSection=`#${c}`,i.dataset.rightSection=`#${w}`,{left:t,right:r}}function W(){return document.querySelector("#ytapiplayer video, video")}function $(g=W()){return g?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof g.webkitShowPlaybackTargetPicker=="function":!1}function N(){if(!O)return;let g=O._btfwAirplayHandler;if(g){try{O.removeEventListener("webkitplaybacktargetavailabilitychanged",g)}catch(i){}delete O._btfwAirplayHandler}O=null}function G(g){if(!g||typeof g.addEventListener!="function"){N();return}if(O===g)return;N();let i=c=>{let w=!c||c.availability==="available",t=e("#btfw-airplay");t&&(t.style.display=w?"":"none")};try{g.addEventListener("webkitplaybacktargetavailabilitychanged",i),g._btfwAirplayHandler=i,O=g}catch(c){}}function j(){let g=e("#btfw-airplay");if(!g)return;let i=W();if(!$(i)){g.style.display="none",N();return}g.style.display="",G(i)}function ie(g,i){i&&i.classList.add("btfw-vo-visible")}function Y(g){if(!(g!=null&&g.right)||!(g!=null&&g.left))return;let i=[];document.querySelector("#fullscreenbtn")||i.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:ee,section:"right"}),i.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:D,section:"right"}),i.forEach(c=>{let w=document.querySelector(`#${c.id}`),t=c.section==="left"?g.left:g.right;if(w)t&&w.parentElement!==t&&t.appendChild(w);else{w=document.createElement("button"),w.id=c.id,w.className="btfw-vo-btn";let r=document.createElement("i");r.className=c.icon,w.appendChild(r),w.title=c.tooltip,w.addEventListener("click",c.action),(t||g.right).appendChild(w)}}),j()}function Q(g){let i=g==null?void 0:g.right;i&&n.forEach(c=>{let w=document.querySelector(c);if(!w)return;if(w.dataset.btfwOverlay==="1"){w.parentElement!==i&&i.appendChild(w);return}let t=document.createElement("span");t.hidden=!0,t.setAttribute("data-btfw-ph",c);try{w.insertAdjacentElement("afterend",t)}catch(r){}if(w.classList.add("btfw-vo-adopted"),w.dataset.btfwOverlay="1",w.id==="mediarefresh"){let r=w.onclick;w.onclick=o=>{o.preventDefault();let d=!!(o&&o.isTrusted);oe(()=>{if(typeof r=="function")try{return r.call(w,o),!0}catch(l){console.warn("[video-overlay] native refresh handler failed:",l)}return!1},{isUserAction:d})}}i.appendChild(w)})}function J(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(g){console.warn("[video-overlay] Media refresh failed:",g)}return!1}function oe(g,i={}){let{isUserAction:c=!1}=i,w=Date.now();if(h&&w-h>L&&(x=v,A=0),w<f){let l=Math.ceil((f-w)/1e3);return H(c?`Refresh available in ${l}s`:`Auto refresh paused. Next attempt in ${l}s`,"warning"),!1}let t=c?p:x;if(h&&w-h<t){let l=t-(w-h),P=Math.ceil(l/1e3);return f=w+l,H(c?`Refresh available in ${P}s`:`Auto refresh paused. Next attempt in ${P}s`,"warning"),!1}if(A++,A>=10)return f=w+3e4,A=0,H("Refresh limit reached. 30s cooldown active.","error"),!1;let r=c?6e3:Math.max(12e3,x+2e3);setTimeout(()=>{A>0&&A--},r);let o=!1;if(typeof g=="function")try{o=g()===!0}catch(l){console.warn("[video-overlay] Refresh handler error:",l)}return o||(o=J()),h=Date.now(),c?x=v:x=Math.min(k,Math.max(v,Math.round(x*(o?1.25:1.5)))),f=Math.max(f,h+(c?p:x)),!c&&o?H(`Auto refresh sent. Next attempt in ${Math.ceil(x/1e3)}s`,"info"):H(o?"Media refreshed":"Unable to refresh media",o?"success":"error"),o}function ee(){let g=e("#videowrap");g&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():g.requestFullscreen?g.requestFullscreen():g.webkitRequestFullscreen?g.webkitRequestFullscreen():g.mozRequestFullScreen&&g.mozRequestFullScreen())}function E(g,i=!0){if(!g||!$(g))return!1;if(g.setAttribute("airplay","allow"),g.setAttribute("x-webkit-airplay","allow"),i&&typeof g.webkitShowPlaybackTargetPicker=="function")try{g.webkitShowPlaybackTargetPicker()}catch(c){console.warn("[video-overlay] AirPlay picker failed:",c)}return j(),!0}function q(){if(!(C||!window.socket)){C=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let g=W();g&&(E(g,!1),G(g)),j()},1e3)})}catch(g){console.warn("[video-overlay] Failed to attach AirPlay listener:",g)}}}function D(){let g=W();return $(g)?E(g)?(H("AirPlay enabled","success"),q(),!0):(H("AirPlay not available","warning"),!1):(j(),H("AirPlay not available","warning"),!1)}function H(g,i="info"){let c=document.getElementById("btfw-notification");c||(c=document.createElement("div"),c.id="btfw-notification",c.className="btfw-notification",document.body.appendChild(c)),c.textContent=g,c.className=`btfw-notification btfw-notification--${i} btfw-notification--show`,clearTimeout(c._hideTimer),c._hideTimer=setTimeout(()=>{c.classList.remove("btfw-notification--show")},3e3)}function Z(){U(),I();let g=[e("#videowrap"),e("#rightcontrols"),e("#leftcontrols"),document.body].filter(Boolean),i=new MutationObserver(()=>I());g.forEach(c=>i.observe(c,{childList:!0,subtree:!0}));try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>I(),0)})}catch(c){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z):Z(),{name:"feature:videoOverlay",toggleFullscreen:ee,enableAirplay:D}});function ot(e,n){let m=n==null?"":String(n),s=e==null?"":String(e),u=m.replace(/^\uFEFF/,"");if(!s.toLowerCase().endsWith(".srt")&&u.startsWith("WEBVTT"))return m;let a=u.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim()+`
`;return a=a.replace(/^\d+\s*$\n/gm,""),a=a.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),a=a.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+a}var rt="btfw-vo-subs",it="btfw-vo-subs-input",Ot="btfw-vo-left",It="data-btfw-local-subs",ge=null,ce=null,at=0;window.BTFW.define("feature:local-subs",[],async()=>{function e(f,h){let p=window.BTFW_notify,v=p==null?void 0:p[f];if(typeof v!="function")return;let k=document.createElement("span");k.textContent=h,v({title:"Subtitles",html:k.outerHTML,timeout:f==="error"?5200:2600})}function n(){let f=document.querySelector("#videowrap video");return f instanceof HTMLVideoElement?f:null}function m(f){let h=f.closest(".video-js"),p=h==null?void 0:h.player;if(!p&&(h!=null&&h.id)){let k=window.videojs;try{p=typeof(k==null?void 0:k.getPlayer)=="function"?k.getPlayer(h.id):null}catch(L){p=null}}let v=p;return v&&typeof v.addRemoteTextTrack=="function"&&typeof v.textTracks=="function"?v:null}function s(){if(ce){try{ce.remove()}catch(f){}ce=null}ge&&(URL.revokeObjectURL(ge),ge=null)}function u(f,h){for(let p=0;p<h.length;p++){let v=h[p];!v||v.kind!=="subtitles"&&v.kind!=="captions"||(v.mode=v===f?"showing":"disabled")}f.mode="showing"}function a(f,h){let p=f.track;u(p,h());let v=()=>{(ce==null?void 0:ce.track)===p&&(p.mode="disabled",u(p,h()))};f.readyState===2?v():f.addEventListener("load",v)}function S(f,h,p){let v=m(f);if(v){let L=v.addRemoteTextTrack({kind:"subtitles",src:h,label:p,srclang:"en",default:!0},!0);return!L||!L.track?!1:(ce={track:L.track,remove:()=>v.removeRemoteTextTrack(L)},a(L,()=>v.textTracks()),!0)}let k=document.createElement("track");return k.kind="subtitles",k.label=p,k.srclang="en",k.src=h,k.default=!0,k.setAttribute(It,"1"),f.appendChild(k),ce={track:k.track,remove:()=>k.remove()},a(k,()=>f.textTracks),!0}async function y(f){let h=n();if(!h){e("error","Local subtitles only work with direct video files.");return}try{let p=ot(f.name,await f.text());s(),ge=URL.createObjectURL(new Blob([p],{type:"text/vtt"}));let v=f.name.replace(/\.[^.]+$/,"")||"Local";if(!S(h,ge,v))throw new Error("Player rejected the subtitle track");e("success",`Loaded ${f.name}`)}catch(p){console.error("[local-subs]",p),s(),e("error","Could not load that subtitle file.")}}function M(){let f=document.getElementById(it);f||(f=document.createElement("input"),f.type="file",f.id=it,f.accept=".vtt,.srt,text/vtt",f.hidden=!0,f.addEventListener("change",()=>{var p;let h=(p=f==null?void 0:f.files)==null?void 0:p[0];f&&(f.value=""),h&&y(h)}),document.body.appendChild(f)),f.click()}function b(){let f=document.getElementById(Ot);if(!f)return;let h=document.getElementById(rt);if(!h){h=document.createElement("button"),h.id=rt,h.setAttribute("type","button"),h.className="btfw-vo-btn",h.title="Load your own subtitles (.vtt/.srt)",h.setAttribute("aria-label","Load your own subtitles");let p=document.createElement("i");p.className="fa fa-cc",p.setAttribute("aria-hidden","true"),h.appendChild(p),h.addEventListener("click",v=>{v.preventDefault(),M()})}h.parentElement!==f&&f.insertBefore(h,f.firstChild),h.style.display=n()?"":"none"}function _(){window.clearTimeout(at),at=window.setTimeout(b,50)}function A(){b();let f=document.body;f&&f.dataset.btfwLocalSubsObs!=="1"&&(f.dataset.btfwLocalSubsObs="1",new MutationObserver(_).observe(f,{childList:!0,subtree:!0}));let h=window.socket;h&&typeof h.on=="function"&&h.on("changeMedia",()=>{s(),_()})}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",A,{once:!0}):A(),{name:"feature:local-subs"}});var st="https://vidprox.movies-storage-a.workers.dev/?url=";function $e(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function Se(){return Date.now()}var lt=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var n,m,s;let e=typeof window!="undefined"&&(((n=window.BTFW_CONFIG)==null?void 0:n.corsVideoProxy)||((s=(m=window.BTFW_CONFIG)==null?void 0:m.integrations)==null?void 0:s.corsVideoProxy));if(typeof e=="string"&&e.trim()){let u=e.trim();if(u.includes("?"))return u;let a=u.endsWith("/")?"":"/";return`${u}${a}?url=`}return st},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(e){try{return new URL(st).origin.toLowerCase()}catch(n){return""}}},_isTrusted(e){if(!e)return!1;if(String(e).includes(this.CORS_PROXY))return!0;try{let n=new URL(e),m=n.origin.toLowerCase(),s=this._getCorsProxyOrigin();return s&&m===s?!0:/^vidprox\./i.test(n.hostname)}catch(n){return!1}},_unwrapProxiedUrl(e){if(!e||!this._isTrusted(e))return e;try{return new URL(e).searchParams.get("url")||e}catch(n){return e}},_markInternalSrcSet(){this._lastInternalSrcSetAt=Se()},_isInsideInternalWindow(){return Se()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let e=this._getMediaElement();return e?e.crossOrigin==="anonymous"||e.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var n;if(this._hasAnonymousCrossOrigin())return!1;let e=this._readCurrentSrc();if(e&&!this._isTrusted(e))return!1;try{return(n=this.player)==null||n.crossOrigin("anonymous"),!0}catch(m){return!1}},_clearMediaElementForCorsSwap(){let e=this._getMediaElement();if(e)try{for(e.removeAttribute("src"),e.removeAttribute("crossorigin");e.firstChild;)e.removeChild(e.firstChild);e.load()}catch(n){}},_same(e,n){return String(e||"")===String(n||"")},_readCurrentSrc(){var e,n,m;try{let s=((n=(e=this.player)==null?void 0:e.currentSrc)==null?void 0:n.call(e))||"";if(s)return s}catch(s){}return((m=this._getMediaElement())==null?void 0:m.currentSrc)||""},_getMediaElement(){var m;let e=(m=this.player)==null?void 0:m.tech_;if(e){try{let s=typeof e.el=="function"?e.el():null;if(s instanceof HTMLMediaElement&&s.isConnected)return s}catch(s){}if(e.el_ instanceof HTMLMediaElement&&e.el_.isConnected)return e.el_}let n=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return n instanceof HTMLMediaElement&&n.isConnected?n:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(e){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(e){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(e){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(e){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(e){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(e){}this.mergerNode=null}},resetMediaBinding(){var n,m;this.disconnectChain();let e=this._getMediaElement();if(e&&this._syncFromRegistry(e)){((n=this.audioContext)==null?void 0:n.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((m=this.audioContext)==null?void 0:m.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(e){var S;let n=(S=this.player)==null?void 0:S.tech_;if(!(n!=null&&n.el_)||n.el_!==e)return null;let m=e.parentNode;if(!m)return null;let s=e.tagName.toLowerCase()==="audio"?"audio":"video",u=document.createElement(s);u.className=e.className,e.id&&(u.id=e.id),u.setAttribute("playsinline",""),u.setAttribute("webkit-playsinline",""),u.classList.contains("vjs-tech")||u.classList.add("vjs-tech");let a=e.crossOrigin||e.getAttribute("crossorigin");return a&&(u.crossOrigin=a,u.setAttribute("crossorigin",a)),m.replaceChild(u,e),n.el_=u,delete e.__btfwSourceNode,u},_syncFromRegistry(e){let n=$e().get(e)||e.__btfwSourceNode||null;return n?($e().set(e,n),this.sourceNode=n,this._sourceMediaElement=e,n.context instanceof AudioContext&&n.context.state!=="closed"&&(this.audioContext=n.context),n):null},_getOrCreateSourceNode(e){let n=$e(),m=n.get(e)||e.__btfwSourceNode||null;if(m)return n.set(e,m),this.sourceNode=m,this._sourceMediaElement=e,m.context instanceof AudioContext&&m.context.state!=="closed"&&(this.audioContext=m.context),m;if(this.sourceNode&&this._sourceMediaElement===e)return n.set(e,this.sourceNode),e.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let s;try{s=this.audioContext.createMediaElementSource(e)}catch(u){if(!(u instanceof DOMException)||u.name!=="InvalidStateError")throw u;let a=this._syncFromRegistry(e);if(a)return a;let S=this._swapVideoTechElement(e);if(!S)throw u;let y=this._readCurrentSrc();if(y&&this.player){this._markInternalSrcSet(),this.player.src({src:y,type:"video/mp4"});try{this.player.load()}catch(M){}}return this._getOrCreateSourceNode(S)}return n.set(e,s),e.__btfwSourceNode=s,this.sourceNode=s,this._sourceMediaElement=e,s},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(e){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(e){return!1}},_clearCrossOriginAttribute(){var n,m;let e=this._getMediaElement();if(e)try{e.crossOrigin=null,e.removeAttribute("crossorigin")}catch(s){}try{(m=(n=this.player)==null?void 0:n.crossOrigin)==null||m.call(n,null)}catch(s){}},cleanup(){this.disconnectChain();let e=this._getMediaElement();e&&(e.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let e=this._readCurrentSrc();return this.sourceNode&&e&&!this._isTrusted(e)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(e,{currentTime:n=0,wasPlaying:m=!1,clearCrossOrigin:s=!1}={}){if(!this.player||!e)return Promise.resolve(!1);let u=this.player;try{this.player.pause()}catch(a){}s&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:e,type:"video/mp4"});try{this.player.load()}catch(a){}return new Promise(a=>{let S=!1,y=()=>{if(S)return;S=!0;try{u.off("canplay",M)}catch(_){}try{u.off("loadeddata",M)}catch(_){}try{u.currentTime(n)}catch(_){}let b=m?u.play():Promise.resolve();Promise.resolve(b).catch(()=>{}).finally(()=>a(!0))},M=()=>y();try{u.one("canplay",M)}catch(b){try{u.on("canplay",M)}catch(_){}}try{u.one("loadeddata",M)}catch(b){}typeof u.ready=="function"&&u.ready(()=>{try{typeof u.readyState=="function"&&u.readyState()>=2&&y()}catch(b){}}),setTimeout(y,5e3)})},startWatchdog(){if(!this.player)return;let e=this.player;this.stopWatchdog();let n=this._getMediaElement();if(n&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(n,{attributes:!0,attributeFilter:["src","crossorigin"]});let m=new MutationObserver(()=>{this._checkAndReapply("sources")});m.observe(n,{childList:!0,subtree:!0}),this._sourceObserver=m}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([m,s])=>{e.on(m,s)})}catch(m){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var n;this._stopWatchdogInterval();let e=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(m){}try{(n=this._sourceObserver)==null||n.disconnect()}catch(m){}this._sourceObserver=null,this._mutationObserver=null}if(e&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([m,s])=>{e.off(m,s)})}catch(m){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(e){if(!this.player)return;let n=this._readCurrentSrc();if(n&&(this._lastKnownSrc=n,!this._isInsideInternalWindow())){if(this._isTrusted(n)){this.isProxied=!0,this.proxiedSrc=n,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(n)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(Se()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=Se(),this._forceProxyPreservingState(n)}}},async _forceProxyPreservingState(e){if(!this.player)return!1;let n=this.player,m=n.currentTime(),s=!n.paused();if(this._isTrusted(e))return this.isProxied=!0,this.proxiedSrc=e,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(e)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(e)||e,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(u){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(u){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(u){}return new Promise(u=>{let a=!1,S=()=>{if(!a){a=!0;try{n.off("canplay",y)}catch(M){}try{n.off("loadeddata",y)}catch(M){}try{n.currentTime(m)}catch(M){}this.isProxied=!0,s&&n.play().catch(()=>{}),u(!0)}},y=()=>S();try{n.one("canplay",y)}catch(M){try{n.on("canplay",y)}catch(b){}}try{n.one("loadeddata",y)}catch(M){}typeof n.ready=="function"&&n.ready(()=>{try{typeof n.readyState=="function"&&n.readyState()>=2&&S()}catch(M){}}),setTimeout(S,5e3)})},async ensureProxy(){if(!this.player)return!1;let e=this.player,n=this._readCurrentSrc();if(!n)return!1;if(this._isTrusted(n)){if(this.isProxied=!0,this.proxiedSrc=n,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(n)),this._hasAnonymousCrossOrigin())return!0;let m=e.currentTime(),s=!e.paused();try{e.pause()}catch(u){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),e.src({src:n,type:"video/mp4"});try{e.load()}catch(u){}return new Promise(u=>{e.ready(()=>{try{e.currentTime(m)}catch(a){}s&&e.play().catch(()=>{}),u(!0)})})}return await this._forceProxyPreservingState(n),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var n,m;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let s=this._readCurrentSrc();if(this._isTrusted(s))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let e=this._getMediaElement();if(!e)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((n=this.audioContext)==null?void 0:n.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),e.disableRemotePlayback=!0;let s=this._getOrCreateSourceNode(e),u=this.audioContext;if(!u)return!1;let a=s;if(this.normalizationEnabled){this.compressorNode=u.createDynamicsCompressor();let S=(m=this.NORM_PRESETS[this.currentNormPreset])!=null?m:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(S.threshold,u.currentTime),this.compressorNode.knee.setValueAtTime(S.knee,u.currentTime),this.compressorNode.ratio.setValueAtTime(S.ratio,u.currentTime),this.compressorNode.attack.setValueAtTime(S.attack,u.currentTime),this.compressorNode.release.setValueAtTime(S.release,u.currentTime),a.connect(this.compressorNode),a=this.compressorNode}return this.monoEnabled&&(this.splitterNode=u.createChannelSplitter(2),this.monoMixGain=u.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=u.createChannelMerger(2),a.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),a=this.mergerNode),this.boostEnabled&&(this.gainNode=u.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,a.connect(this.gainNode),a=this.gainNode),a.connect(u.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(s){return console.error("[BTFW_AUDIO] Error building audio chain:",s),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(e){return this.NORM_PRESETS[e]?(this.currentNormPreset=e,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(e){return this.BOOST_MULTIPLIER=e,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()}};(function(){"use strict";let e=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),n=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),m="--btfw-boost-anchor",s="--btfw-norm-anchor";function u(S,y,M){if(n&&M){y.style.setProperty("anchor-name",M),S.style.setProperty("position-anchor",M),S.style.setProperty("top","anchor(bottom)"),S.style.setProperty("left","anchor(left)");return}let b=y.getBoundingClientRect();S.style.left=b.left+"px",S.style.top=b.bottom+"px"}function a(S){window.BTFW&&typeof BTFW.define=="function"?S():setTimeout(()=>a(S),0)}a(function(){BTFW.define("feature:audio",[],async()=>{let S=(o,d=document)=>d.querySelector(o),y=lt,M=null,b=null,_=null,A=!1,f=!1,h=!1,p=null,v=null,k=null,L=null,x=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function C(o){M&&(o?(M.classList.add("active"),M.style.background="rgba(46, 213, 115, 0.3)",M.style.borderColor="#2ed573",M.style.color="#2ed573",M.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(M.classList.remove("active"),M.style.background="",M.style.borderColor="",M.style.color="",M.style.boxShadow=""))}function O(o,d="info"){let l=S("#btfw-audioboost-toast");l||(l=document.createElement("div"),l.id="btfw-audioboost-toast",l.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${d==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=d==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function U(){if(await y.enableBoost()){A=!0;let d=Math.round(y.BOOST_MULTIPLIER*100);O(`Boosted by ${d}%`,"success"),C(!0)}else{let d=y._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";O(d,"error")}}async function F(){await y.disableBoost(),A=!1,C(!1)}function I(o){b&&(o?(b.classList.add("active"),b.style.background="rgba(52, 152, 219, 0.3)",b.style.borderColor="#3498db",b.style.color="#3498db",b.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(b.classList.remove("active"),b.style.background="",b.style.borderColor="",b.style.color="",b.style.boxShadow=""))}function V(o,d="info"){let l=S("#btfw-audionorm-toast");l||(l=document.createElement("div"),l.id="btfw-audionorm-toast",l.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${d==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=d==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function K(){if(await y.enableNormalization())f=!0,V("Normalization enabled","success"),I(!0);else{let d=y._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";V(d,"error")}}async function W(){await y.disableNormalization(),f=!1,I(!1)}function $(o){_&&(o?(_.classList.add("active"),_.style.background="rgba(155, 89, 182, 0.3)",_.style.borderColor="#9b59b6",_.style.color="#9b59b6",_.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(_.classList.remove("active"),_.style.background="",_.style.borderColor="",_.style.color="",_.style.boxShadow=""))}function N(o,d="info"){let l=S("#btfw-mono-toast");l||(l=document.createElement("div"),l.id="btfw-mono-toast",l.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${d==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=d==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function G(){if(await y.enableMono())h=!0,N("Stereo audio enabled","success"),$(!0);else{let d=y._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";N(d,"error")}}async function j(){await y.disableMono(),h=!1,$(!1)}function ie(){let o=document.createElement("button");o.id="btfw-vo-audioboost",o.className="btn btn-sm btn-default btfw-vo-adopted";let d=Math.round(y.BOOST_MULTIPLIER*100);o.title=`Toggle Audio Boost (${d}%)`,o.setAttribute("data-btfw-overlay","1");let l=document.createElement("i");return l.className="fa fa-bullhorn",o.appendChild(l),o.addEventListener("click",()=>{y.boostEnabled?F():U()}),o.addEventListener("mouseenter",()=>{k&&(clearTimeout(k),k=null),oe()}),o.addEventListener("mouseleave",()=>{k=setTimeout(()=>ee(),150)}),o}function Y(){let o=document.createElement("button");o.id="btfw-vo-audionorm",o.className="btn btn-sm btn-default btfw-vo-adopted";let d=y.NORM_PRESETS[y.currentNormPreset].label;o.title=`Toggle Audio Normalization (${d})`,o.setAttribute("data-btfw-overlay","1");let l=document.createElement("i");return l.className="fa fa-sliders",o.appendChild(l),o.addEventListener("click",()=>{y.normalizationEnabled?W():K()}),o.addEventListener("mouseenter",()=>{L&&(clearTimeout(L),L=null),D()}),o.addEventListener("mouseleave",()=>{L=setTimeout(()=>H(),150)}),o}function Q(){let o=document.createElement("button");o.id="btfw-vo-mono",o.className="btn btn-sm btn-default btfw-vo-adopted",o.title="Toggle Mono Audio (mix both channels to stereo)",o.setAttribute("data-btfw-overlay","1");let d=document.createElement("i");return d.className="fa fa-headphones",o.appendChild(d),o.addEventListener("click",()=>{y.monoEnabled?j():G()}),o}function J(){if(p)return p;let o=document.createElement("div");return o.id="btfw-boost-context-menu",e&&(o.popover="auto"),o.style.cssText=`
          position: fixed;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(109, 77, 246, 0.3);
          border-radius: 8px;
          padding: 6px;
          margin: 0;
          z-index: 10000;
          min-width: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          ${e?"":"display: none;"}
        `,x.forEach(d=>{let l=document.createElement("button");l.className="btfw-context-item",l.textContent=d.label,l.style.cssText=`
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `,y.BOOST_MULTIPLIER===d.multiplier&&(l.style.background="rgba(46, 213, 115, 0.2)",l.style.color="#2ed573"),l.addEventListener("mouseenter",()=>{y.BOOST_MULTIPLIER!==d.multiplier&&(l.style.background="rgba(109, 77, 246, 0.2)")}),l.addEventListener("mouseleave",()=>{y.BOOST_MULTIPLIER!==d.multiplier&&(l.style.background="transparent")}),l.addEventListener("click",async()=>{if(await y.setBoostMultiplier(d.multiplier),E(),M){let P=Math.round(d.multiplier*100);M.title=`Toggle Audio Boost (${P}%)`}y.boostEnabled&&O(`Boost set to ${d.label}`,"success")}),o.appendChild(l)}),o.addEventListener("mouseenter",()=>{k&&(clearTimeout(k),k=null)}),o.addEventListener("mouseleave",()=>{k=setTimeout(()=>ee(),100)}),document.body.appendChild(o),p=o,o}function oe(){if(!M)return;let o=J();u(o,M,m),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function ee(){p&&(e?p.matches(":popover-open")&&p.hidePopover():p.style.display="none")}function E(){if(!p)return;p.querySelectorAll(".btfw-context-item").forEach((d,l)=>{let P=x[l];y.BOOST_MULTIPLIER===P.multiplier?(d.style.background="rgba(46, 213, 115, 0.2)",d.style.color="#2ed573"):(d.style.background="transparent",d.style.color="#e0e0e0")})}function q(){if(v)return v;let o=document.createElement("div");return o.id="btfw-norm-context-menu",e&&(o.popover="auto"),o.style.cssText=`
          position: fixed;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 152, 219, 0.3);
          border-radius: 8px;
          padding: 6px;
          margin: 0;
          z-index: 10000;
          min-width: 110px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          ${e?"":"display: none;"}
        `,Object.keys(y.NORM_PRESETS).forEach(d=>{let l=y.NORM_PRESETS[d],P=document.createElement("button");P.className="btfw-context-item",P.textContent=l.label,P.style.cssText=`
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `,y.currentNormPreset===d&&(P.style.background="rgba(52, 152, 219, 0.2)",P.style.color="#3498db"),P.addEventListener("mouseenter",()=>{y.currentNormPreset!==d&&(P.style.background="rgba(109, 77, 246, 0.2)")}),P.addEventListener("mouseleave",()=>{y.currentNormPreset!==d&&(P.style.background="transparent")}),P.addEventListener("click",async()=>{await y.setNormPreset(d),Z(),b&&(b.title=`Toggle Audio Normalization (${l.label})`),y.normalizationEnabled&&V(`Preset: ${l.label}`,"success")}),o.appendChild(P)}),o.addEventListener("mouseenter",()=>{L&&(clearTimeout(L),L=null)}),o.addEventListener("mouseleave",()=>{L=setTimeout(()=>H(),100)}),document.body.appendChild(o),v=o,o}function D(){if(!b)return;let o=q();u(o,b,s),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function H(){v&&(e?v.matches(":popover-open")&&v.hidePopover():v.style.display="none")}function Z(){if(!v)return;let o=v.querySelectorAll(".btfw-context-item");Object.keys(y.NORM_PRESETS).forEach((d,l)=>{let P=o[l];y.currentNormPreset===d?(P.style.background="rgba(52, 152, 219, 0.2)",P.style.color="#3498db"):(P.style.background="transparent",P.style.color="#e0e0e0")})}function g(){let o=S("#btfw-vo-left");if(!o)return!1;let d=S("#btfw-vo-audioboost");d&&d.remove();let l=S("#btfw-vo-audionorm");l&&l.remove();let P=S("#btfw-vo-mono");return P&&P.remove(),M=ie(),b=Y(),_=Q(),o.appendChild(M),o.appendChild(b),o.appendChild(_),!0}function i(o,d=20){let l=d*500;pe(()=>S("#btfw-vo-left")?!0:null,{timeoutMs:l}).then(()=>{g(),o()}).catch(()=>{g()&&o()})}function c(){Promise.all([pe(()=>typeof videojs!="undefined"?videojs:null),fe("#ytapiplayer")]).then(([o])=>{y.player=o("ytapiplayer"),y.originalSrc=y._readCurrentSrc(),y.startWatchdog()}).catch(()=>{})}function w(){setTimeout(()=>{y.resetMediaBinding(),y.boostEnabled=!1,y.normalizationEnabled=!1,y.monoEnabled=!1,y.isProxied=!1,C(!1),I(!1),$(!1),c(),A&&setTimeout(()=>{U()},1200),f&&setTimeout(()=>{K()},1200),h&&setTimeout(()=>{G()},1200)},600)}function t(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>y._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>y._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",w))}function r(){i(()=>{c()}),t()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r(),{name:"feature:audio",activate:U,deactivate:F,isActive:()=>y.boostEnabled,activateNormalization:K,deactivateNormalization:W,isNormalizationActive:()=>y.normalizationEnabled,activateMono:G,deactivateMono:j,isMonoActive:()=>y.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async S=>S.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async S=>S.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async S=>S.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async S=>S.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:e})=>{let n=await e("util:tmdb-proxy"),m="movie-info",s={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},u="btfw-movie-info-style",a={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},S=0,y=!1,M=null;function b(i){typeof i=="function"&&a.cleanup.push(i)}function _(){for(;a.cleanup.length;){let i=a.cleanup.pop();try{i()}catch(c){}}a.header&&(a.header.remove(),a.header=null)}function A(){a.hideTimer&&(clearTimeout(a.hideTimer),a.hideTimer=null),a.initTimer&&(clearTimeout(a.initTimer),a.initTimer=null),a.socketRetryTimer&&(clearTimeout(a.socketRetryTimer),a.socketRetryTimer=null),S=0,a.currentTitle="",a.isInitialized=!1,_()}function f(i){if(typeof i=="boolean")return i;if(typeof i=="number")return Number.isFinite(i)?i>0:!1;if(typeof i=="string"){let c=i.trim().toLowerCase();return c?c==="1"||c==="true"||c==="yes"||c==="on":!1}return!1}function h(){let i=[()=>{var c,w,t;return(t=(w=(c=window.BTFW_THEME_ADMIN)==null?void 0:c.integrations)==null?void 0:w.movieInfo)==null?void 0:t.enabled},()=>{var c,w,t;return(t=(w=(c=window.BTFW_CONFIG)==null?void 0:c.integrations)==null?void 0:w.movieInfo)==null?void 0:t.enabled},()=>{var c,w;return(w=(c=window.BTFW_CONFIG)==null?void 0:c.movieInfo)==null?void 0:w.enabled},()=>{var c;return(c=window.BTFW_CONFIG)==null?void 0:c.movieInfoEnabled},()=>{var c,w;return(w=(c=document==null?void 0:document.body)==null?void 0:c.dataset)==null?void 0:w.btfwMovieInfoEnabled}];for(let c of i)try{let w=typeof c=="function"?c():c;if(f(w))return!0}catch(w){}return!1}function p(){if(M||typeof MutationObserver!="function")return;let i=document.body;i&&(M=new MutationObserver(()=>x()),M.observe(i,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function v(){if(y)return;y=!0;let i=()=>x();document.addEventListener("btfw:channelIntegrationsChanged",i),document.addEventListener("btfw:ready",i)}function k(i=0){a.initTimer&&(clearTimeout(a.initTimer),a.initTimer=null),a.initTimer=window.setTimeout(()=>{a.initTimer=null,h()&&L()},Math.max(0,i))}function L(){if(a.isInitialized)return;let i=document.querySelector(s.TOPBAR_SELECTOR);if(!i){k(500);return}try{C(i),Z(),U(),a.isInitialized=!0,setTimeout(()=>{G(),j()},120)}catch(c){k(800)}}function x(){h()?a.isInitialized?(G(),setTimeout(j,80)):k(0):A()}function C(i){if(!i&&(i=document.querySelector(s.TOPBAR_SELECTOR),!i))throw new Error("Chat topbar not found");let c=document.getElementById(s.CONTAINER_ID);c&&c.remove();let w=document.createElement("div");w.id=s.CONTAINER_ID,w.className="btfw-movie-header hide",w.dataset.module=m,i.insertAdjacentElement("afterend",w),a.header=w}function O(){try{return window.socket||window.SOCKET||null}catch(i){return null}}function U(){F(),K();let i=H(G,250);window.addEventListener("resize",i),b(()=>window.removeEventListener("resize",i))}function F(){I(),V()}function I(){let i=document.querySelector(s.TITLE_SELECTOR);if(i){let c=()=>$(),w=()=>N();i.addEventListener("mouseenter",c),i.addEventListener("mouseleave",w),b(()=>{i.removeEventListener("mouseenter",c),i.removeEventListener("mouseleave",w)})}else if(typeof MutationObserver=="function"){let c=new MutationObserver(()=>{document.querySelector(s.TITLE_SELECTOR)&&(c.disconnect(),I())});c.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),b(()=>{try{c.disconnect()}catch(w){}})}}function V(){let i=a.header;if(!i)return;let c=()=>W(),w=()=>N();i.addEventListener("mouseenter",c),i.addEventListener("mouseleave",w),b(()=>{i.removeEventListener("mouseenter",c),i.removeEventListener("mouseleave",w)})}function K(){let i=O();if(i&&typeof i.on=="function"){i.on("changeMedia",j),b(()=>{var c,w;try{(c=i.off)==null||c.call(i,"changeMedia",j)}catch(t){try{(w=i.removeListener)==null||w.call(i,"changeMedia",j)}catch(r){}}});return}pe(()=>{if(!h())return null;let c=O();return c&&typeof c.on=="function"?c:null},{timeoutMs:1e4}).then(c=>{a.socketRetryTimer=null,c.on("changeMedia",j),b(()=>{var w,t;try{(w=c.off)==null||w.call(c,"changeMedia",j)}catch(r){try{(t=c.removeListener)==null||t.call(c,"changeMedia",j)}catch(o){}}})}).catch(()=>{a.socketRetryTimer=null}),b(()=>{a.socketRetryTimer&&(clearTimeout(a.socketRetryTimer),a.socketRetryTimer=null)})}function W(){a.hideTimer&&(clearTimeout(a.hideTimer),a.hideTimer=null)}function $(){W(),a.header&&(a.header.classList.remove("hide"),a.header.classList.add("show"))}function N(){W(),a.hideTimer=window.setTimeout(()=>{a.header&&(a.header.classList.remove("show"),a.header.classList.add("hide"),setTimeout(()=>{a.header&&a.header.classList.contains("hide")&&a.header.classList.remove("hide")},320))},300)}function G(){if(!a.header)return;let i=window.innerWidth<=768;a.header.classList.toggle("btfw-mobile",i)}async function j(){var r;if(!a.isInitialized)return;let i=document.querySelector(s.TITLE_SELECTOR),c=a.header;if(!i||!c)return;let w=((r=i.textContent)==null?void 0:r.trim())||"";if(!w){a.currentTitle="",oe();return}if(w===a.currentTitle)return;a.currentTitle=w;let t=++S;Q();try{let o=await Y(w);if(t!==S)return;E(o)}catch(o){if(t!==S)return;n.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),J()}}function ie(i){let c=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],w=i;return c.forEach(t=>{let r=new RegExp(`\\b${t}\\b`,"gi");w=w.replace(r,"")}),w.replace(/\s{2,}/g," ").trim()}async function Y(i){var d;if(!n.isAvailable())throw new Error(n.MISSING_PROXY_MSG);let c=i.match(/(.+)\s*\((\d{4})\)/),w=c?c[1].trim():i,t=c?c[2]:"";t||(c=i.match(/(.+?)\s+(\d{4})\s*$/),c&&(w=c[1].trim(),t=c[2]));let r=ie(w),o=await n.tmdbFetch("search/movie",{query:r,year:t});if(((d=o==null?void 0:o.results)==null?void 0:d.length)>0){let l=o.results[0];return{title:i,backdrop:l.backdrop_path?`https://image.tmdb.org/t/p/w1280${l.backdrop_path}`:null,poster:l.poster_path?`https://image.tmdb.org/t/p/w500${l.poster_path}`:null,summary:l.overview||"",rating:l.vote_average||0,releaseDate:l.release_date||"",voteCount:l.vote_count||0}}return{title:i,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function Q(){if(!a.header)return;ee();let i=document.createElement("div");i.className="btfw-movie-content";let c=document.createElement("div");c.className="btfw-movie-loading";let w=document.createElement("i");w.className="fa fa-spinner fa-spin";let t=document.createElement("p");t.textContent="Loading movie information...",c.append(w,t),i.appendChild(c),a.header.replaceChildren(i)}function J(){if(!a.header)return;ee();let i=document.createElement("div");i.className="btfw-movie-content";let c=document.createElement("div");c.className="btfw-movie-error";let w=document.createElement("i");w.className="fa fa-exclamation-triangle";let t=document.createElement("p");t.textContent="Unable to fetch movie information";let r=document.createElement("small");r.textContent="Check TMDB API key in Theme Settings",c.append(w,t,r),i.appendChild(c),a.header.replaceChildren(i)}function oe(){if(!a.header)return;ee();let i=document.createElement("div");i.className="btfw-movie-content";let c=document.createElement("p");c.textContent="No movie information available",i.appendChild(c),a.header.replaceChildren(i)}function ee(){a.header&&(a.header.style.backgroundImage="",a.header.style.backgroundColor="")}function E(i){if(!a.header)return;a.header.replaceChildren(),s.ENABLE_BACKDROP&&i.backdrop?(a.header.style.backgroundImage=`url(${i.backdrop})`,a.header.style.backgroundSize="cover",a.header.style.backgroundPosition="center"):ee();let c=document.createElement("div");c.className="btfw-movie-overlay",a.header.appendChild(c);let w=document.createElement("div");if(w.className="btfw-movie-content",a.header.appendChild(w),i.poster){let o=document.createElement("img");o.src=i.poster,o.alt=`${i.title} Poster`,o.className="btfw-movie-poster",w.appendChild(o)}let t=document.createElement("div");t.className="btfw-movie-details",w.appendChild(t);let r=document.createElement("h2");if(r.textContent=i.title,r.className="btfw-movie-title",t.appendChild(r),s.SHOW_SUMMARY&&i.summary){let o=document.createElement("p");o.textContent=i.summary,o.className="btfw-movie-summary",t.appendChild(o)}if(s.ENABLE_RATING&&i.rating>0){let o=q(i.rating,i.voteCount);w.appendChild(o)}}function q(i,c){let w=document.createElement("div");w.className="btfw-movie-rating";let t=Math.round(i*10),r=D(t),o="http://www.w3.org/2000/svg",d=document.createElementNS(o,"svg");d.setAttribute("width","60"),d.setAttribute("height","60"),d.setAttribute("viewBox","0 0 60 60");let l=25,P=2*Math.PI*l,R=P-i/10*P,T=document.createElementNS(o,"circle");T.setAttribute("cx","30"),T.setAttribute("cy","30"),T.setAttribute("r",l.toString()),T.setAttribute("stroke","#2a2a2a"),T.setAttribute("stroke-width","4"),T.setAttribute("fill","#1a1a1a"),d.appendChild(T);let B=document.createElementNS(o,"circle");B.setAttribute("cx","30"),B.setAttribute("cy","30"),B.setAttribute("r",l.toString()),B.setAttribute("stroke",r),B.setAttribute("stroke-width","3"),B.setAttribute("fill","none"),B.setAttribute("stroke-dasharray",P.toString()),B.setAttribute("stroke-dashoffset",R.toString()),B.setAttribute("transform","rotate(-90 30 30)"),B.setAttribute("stroke-linecap","round"),d.appendChild(B);let z=document.createElementNS(o,"text");if(z.setAttribute("x","50%"),z.setAttribute("y","50%"),z.setAttribute("text-anchor","middle"),z.setAttribute("dominant-baseline","central"),z.setAttribute("fill","#fff"),z.setAttribute("font-size","10"),z.setAttribute("font-weight","bold"),z.textContent=`${t}%`,d.appendChild(z),w.appendChild(d),c>0){let X=document.createElement("div");X.className="btfw-movie-votes",X.textContent=`${c.toLocaleString()} votes`,w.appendChild(X)}return w}function D(i){let c=Math.max(0,Math.min(i,100));return c>=70?"#4caf50":c>=50?"#ff9800":"#f44336"}function H(i,c){let w=null;return function(...r){w&&clearTimeout(w),w=setTimeout(()=>{w=null,i(...r)},c)}}function Z(){if(document.getElementById(u))return;let i=`
      .btfw-movie-header {
        position: absolute;
        top: 44px;
        right: 0;
        height: auto;
        width: 100%;
        max-width: 90vw;
        background: rgba(20, 20, 20, 0.95);
        border-radius: 0 0 12px 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        z-index: 1000;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        pointer-events: none;
      }
      .btfw-movie-header.show {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
        animation: slideInDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      .btfw-movie-header.hide {
        animation: slideOutUp 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;
      }
      @keyframes slideInDown {
        0% {
          opacity: 0;
          transform: translateY(-30px) scale(0.9);
        }
        60% {
          opacity: 0.8;
          transform: translateY(5px) scale(1.02);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes slideOutUp {
        0% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translateY(-25px) scale(0.95);
        }
      }
      .btfw-movie-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 0.8) 100%);
        z-index: 1;
      }
      .btfw-movie-content {
        position: relative;
        z-index: 2;
        padding: 10px;
        display: flex;
        gap: 15px;
        min-height: 160px;
      }
      .btfw-movie-poster {
        width: 100px;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        flex-shrink: 0;
      }
      .btfw-movie-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .btfw-movie-title {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
        margin: 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        line-height: 1.3;
      }
      .btfw-movie-summary {
        color: #e0e0e0;
        font-size: 0.85em;
        line-height: 1.5;
        margin: 0;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .btfw-movie-rating {
        position: sticky;
        bottom: 16px;
        right: 16px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        justify-content: flex-end;
      }
      .btfw-movie-votes {
        color: #ccc;
        font-size: 0.7em;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }
      .btfw-movie-loading,
      .btfw-movie-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: #ccc;
        text-align: center;
        min-height: 120px;
      }
      .btfw-movie-loading i,
      .btfw-movie-error i {
        font-size: 2em;
        opacity: 0.7;
      }
      .btfw-movie-error i {
        color: #ff6b6b;
      }
      .btfw-movie-error small {
        font-size: 0.8em;
        color: #aaa;
      }
      @media (max-width: 768px) {
        .btfw-movie-header {
          width: 100%;
          right: 0;
          left: 0;
          border-radius: 0;
        }
        .btfw-movie-content {
          padding: 16px;
          flex-direction: column;
          min-height: auto;
        }
        .btfw-movie-poster {
          width: 80px;
          align-self: center;
        }
        .btfw-movie-rating {
          position: static;
          align-self: center;
          margin-top: 12px;
        }
        .btfw-movie-summary {
          -webkit-line-clamp: 3;
        }
      }
      ${s.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,c=document.createElement("style");c.id=u,c.textContent=i,document.head.appendChild(c)}function g(){p(),v(),x()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):g(),{name:"feature:movie-info",refresh:x,cleanup:A}});BTFW.define("feature:monkeyPaw",[],async()=>{let e="btfw-monkey-paw-styles",n="btfw-monkey-paw-overlay",m="/src/assets/monkey-paw/paw.svg",s={"f-pinky":{root:"rotate(-8deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-ring":{root:"rotate(-4deg) scaleY(0.28)",tip:"rotate(0deg) scaleY(0)"},"f-index":{root:"rotate(5deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-thumb":{root:"rotate(80deg) scaleY(1)",tip:"rotate(70deg) scaleY(1)"}},u={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},a={"f-pinky":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-ring":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-index":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-thumb":{root:"rotate(-18deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"}},S=null,y=null,M=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function b(C){let O=String(C||"").trim();return/^<svg[\s>]/i.test(O)?!M.test(O):!1}function _(C){return new Promise(O=>setTimeout(O,C))}function A(){try{let C=typeof window!="undefined"?window.BTFW:null;return C&&(C.BASE||C.DEV_CDN)||""}catch(C){return""}}function f(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(C){return!1}}function h(){if(typeof document=="undefined"||document.getElementById(e))return;let C=document.createElement("style");C.id=e,C.textContent=`
      #${n} {
        position: fixed;
        inset: 0;
        z-index: 6200;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(10, 8, 6, 0.92);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease;
        font-family: Georgia, "Times New Roman", serif;
        overflow: hidden;
      }

      #${n}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${n}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${n}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${n} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${n} .btfw-monkey-paw-title {
        color: #7a4c22;
        font-size: 0.95rem;
        font-weight: normal;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        margin: 0;
        opacity: 0;
        animation: btfwMonkeyPawFadeIn 1.2s 0.15s forwards;
      }

      @keyframes btfwMonkeyPawFadeIn {
        to { opacity: 1; }
      }

      #${n} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${n} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${n} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${n} .f-tip {
        transition: transform 0.55s 0.12s cubic-bezier(0.4, 0, 0.15, 1);
      }

      @keyframes btfwMonkeyPawShake {
        0%, 100% { transform: rotate(0deg) translateY(0); }
        15% { transform: rotate(-4deg) translateY(-4px); }
        30% { transform: rotate(5deg) translateY(-6px); }
        45% { transform: rotate(-4deg) translateY(-3px); }
        60% { transform: rotate(4deg) translateY(-5px); }
        75% { transform: rotate(-3deg) translateY(-2px); }
        90% { transform: rotate(2deg) translateY(-1px); }
      }

      #${n} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${n} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${n} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${n} .f-root,
        #${n} .f-tip,
        #${n} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(C)}async function p(){if(S)return S;let O=`${A()}${m}`,U=await fetch(O,{credentials:"omit"});if(!U.ok)throw new Error(`Monkey paw SVG failed to load (${U.status})`);let F=await U.text();if(!b(F))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return S=F,S}function v(C){Object.entries(a).forEach(([O,U])=>{let F=C.querySelector(`#${O}`),I=C.querySelector(`#${O}-tip`);F&&(F.style.transform=U.root),I&&(I.style.transform=U.tip)})}function k(C){Object.entries(s).forEach(([O,U])=>{window.setTimeout(()=>{let F=C.querySelector(`#${O}`),I=C.querySelector(`#${O}-tip`);F&&(F.style.transform=U.root),I&&window.setTimeout(()=>{I.style.transform=U.tip},120)},u[O])})}function L(C){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${C}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function x(C={}){if(y)return y;if(typeof document!="undefined")return y=(async()=>{var V,K;if(h(),f()){await _((V=C.reducedMotionMs)!=null?V:450);return}let O=document.getElementById(n);O||(O=document.createElement("div"),O.id=n,document.body.appendChild(O));let U;try{U=await p()}catch(W){console.warn("[monkey-paw] SVG load failed:",W),await _(300);return}O.innerHTML=L(U),v(O);let F=O.querySelector("#paw"),I=O.querySelector("#btfw-monkey-paw-msg");O.classList.remove("is-cursed"),I==null||I.classList.remove("is-visible"),requestAnimationFrame(()=>O.classList.add("is-active")),k(O),await _(980),F==null||F.classList.add("btfw-monkey-paw-shaking"),await _(720),F==null||F.classList.remove("btfw-monkey-paw-shaking"),O.classList.add("is-cursed"),I==null||I.classList.add("is-visible"),await _((K=C.holdMs)!=null?K:1100),O.classList.remove("is-active"),await _(320),O.remove()})().finally(()=>{y=null}),y}return{name:"feature:monkeyPaw",play:x}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:e})=>{let n=await e("util:tmdb-proxy"),m=await e("feature:monkeyPaw"),s=(E,q=document)=>q.querySelector(E),u=(E,q=document)=>Array.from(q.querySelectorAll(E)),a=null,S=null,y=null,M=null,b={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},_=null,A=null,f="[movie-suggestion]";function h(...E){console.log(f,...E)}function p(...E){console.error(f,...E)}function v(E){var q;try{if((q=window.socket)!=null&&q.emit)return window.socket.emit("chatMsg",{msg:E}),!0}catch(D){}return!1}async function k(E,q={}){return n.workerFetch(E,q)}function L(){if(document.getElementById("btfw-movie-suggest-styles"))return;let E=document.createElement("style");E.id="btfw-movie-suggest-styles",E.textContent=`
      #btfw-movie-suggest-modal.is-active,
      #btfw-movie-confirm-modal.is-active {
        display: flex !important;
        align-items: center;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
      }

      #btfw-movie-suggest-modal .modal-card,
      #btfw-movie-confirm-modal .modal-card {
        width: min(720px, calc(100vw - 24px));
        max-width: calc(100vw - 24px);
        max-height: calc(100dvh - 24px);
        margin: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      #btfw-movie-suggest-modal .modal-card-head,
      #btfw-movie-suggest-modal .modal-card-foot {
        flex-shrink: 0;
      }

      #btfw-movie-suggest-modal .modal-card-title {
        font-size: clamp(0.95rem, 2.8vw, 1.15rem);
        line-height: 1.25;
      }

      #btfw-movie-confirm-modal.is-active {
        z-index: 6100 !important;
      }

      #btfw-movie-suggest-modal.btfw-movie-suggest-pending .modal-card {
        pointer-events: none;
        opacity: 0.4;
      }

      #btfw-movie-suggest-modal .modal-card-body {
        flex: 1 1 auto;
        min-height: 0;
        max-height: calc(100dvh - 148px);
        overflow-y: auto;
        scrollbar-gutter: stable;
      }

      #btfw-movie-suggest-modal .btfw-movie-filters {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-top: 12px;
      }

      @media (max-width: 768px) {
        #btfw-movie-suggest-modal .btfw-movie-filters {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      #btfw-movie-suggest-modal .btfw-movie-filters .label {
        font-size: 0.75rem;
        margin-bottom: 4px;
        opacity: 0.8;
      }

      #btfw-movie-suggest-modal .btfw-movie-results {
        display: flex;
        flex-wrap: nowrap;
        gap: 12px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-gutter: stable;
        margin-top: 16px;
        padding-bottom: 4px;
        min-height: min(230px, 32dvh);
      }

      @media (max-width: 900px) {
        #btfw-movie-suggest-modal .btfw-movie-results {
          min-height: min(200px, 28dvh);
        }

        #btfw-movie-suggest-modal .movie-result {
          flex: 0 0 120px;
          width: 120px;
        }

        #btfw-movie-suggest-modal .btfw-movie-history {
          margin-top: 16px;
        }
      }

      #btfw-movie-suggest-modal .movie-result {
        flex: 0 0 150px;
        width: 150px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        overflow: hidden;
        transition: border-color 0.15s ease, background-color 0.15s ease;
      }

      #btfw-movie-suggest-modal .movie-result:hover {
        border-color: var(--btfw-color-accent, #6d4df6);
      }

      #btfw-movie-suggest-modal .movie-result__poster {
        aspect-ratio: 2 / 3;
        background: rgba(255,255,255,0.06);
        overflow: hidden;
      }

      #btfw-movie-suggest-modal .movie-result img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      #btfw-movie-suggest-modal .movie-result__info {
        padding: 8px;
      }

      #btfw-movie-suggest-modal .movie-result__title {
        font-weight: 600;
        font-size: 0.85rem;
      }

      #btfw-movie-suggest-modal .btfw-movie-pager {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-top: 12px;
      }

      #btfw-movie-suggest-modal .btfw-movie-history {
        margin-top: 24px;
      }

      #btfw-movie-suggest-modal .btfw-movie-history__title {
        font-weight: 600;
        margin-bottom: 12px;
      }

      #btfw-movie-suggest-modal .history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
      }

      #btfw-movie-suggest-modal .history-item img {
        width: 46px;
        height: 69px;
        border-radius: 4px;
        object-fit: cover;
        flex-shrink: 0;
      }

      #btfw-movie-suggest-modal .history-item__title {
        font-weight: 600;
      }

      #btfw-movie-suggest-modal .history-item__meta {
        opacity: 0.7;
        font-size: 0.85rem;
      }

      .button.btfw-nav-pill#btfw-movie-suggest-btn:hover {
        background-color: var(--btfw-color-accent, #6d4df6);
      }

      #btfw-movie-confirm-modal .modal-card {
        display: flex;
        flex-direction: column;
        overflow: visible;
      }

      #btfw-movie-confirm-modal .btfw-movie-confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid var(--btfw-surface-divider, rgba(255,255,255,0.12));
      }

      #btfw-movie-confirm-modal .btfw-movie-confirm-actions .button {
        min-width: 4.5rem;
      }
    `,document.head.appendChild(E)}let x=(CLIENT==null?void 0:CLIENT.rank)||0;function C(){let E=s("a[href*='donate'], #donate-btn, .donate-btn");if(E){let D=E.closest("ul");if(D)return{ul:D,insertAfter:E.parentElement}}let q=s("#btfw-theme-btn-nav");if(q){let D=q.closest("ul");if(D)return{ul:D,insertAfter:null}}return{ul:s(".navbar .nav.navbar-nav")||s(".navbar-nav")||s(".btfw-navbar ul")||s(".navbar ul"),insertAfter:null}}function O(){if(s("#btfw-movie-suggest-btn"))return!0;let E=C();if(!E.ul)return!1;let q=document.createElement("li"),D=document.createElement("a");return D.href="javascript:void(0)",D.className="btfw-nav-pill",D.id="btfw-movie-suggest-btn",D.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,q.appendChild(D),E.insertAfter?E.insertAfter.after(q):E.ul.insertBefore(q,E.ul.firstChild),D.addEventListener("click",Y),!0}function U(){var H,Z,g,i,c,w;if(s("#btfw-movie-suggest-modal"))return;let E=document.createElement("div");E.id="btfw-movie-suggest-modal",E.className="modal",E.innerHTML=`
      <div class="modal-background"></div>
      <div class="modal-card btfw-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Suggest a movie for the playlist</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <div class="control">
              <input type="text" id="btfw-movie-search" class="input"
                     placeholder="${x===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${x===0?"disabled":""}>
            </div>
          </div>
          <div class="btfw-movie-filters">
            <div class="field">
              <label class="label" for="btfw-movie-sort">Sort</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="btfw-movie-sort" class="input"></select>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label" for="btfw-movie-genre">Genre</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="btfw-movie-genre" class="input">
                    <option value="">Any genre</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="label" for="btfw-movie-year">Year</label>
              <div class="control">
                <input type="number" id="btfw-movie-year" class="input" min="1900" max="2100" placeholder="Any">
              </div>
            </div>
            <div class="field">
              <label class="label" for="btfw-movie-rating">Min rating</label>
              <div class="control">
                <input type="number" id="btfw-movie-rating" class="input" min="0" max="10" step="0.5" placeholder="Any">
              </div>
            </div>
          </div>
          <div class="btfw-movie-results" aria-live="polite"></div>
          <nav class="btfw-movie-pager" aria-label="Search pages">
            <button type="button" class="button is-small" id="btfw-movie-prev" disabled>Prev</button>
            <span id="btfw-movie-page-label">Page 1</span>
            <button type="button" class="button is-small" id="btfw-movie-next" disabled>Next</button>
          </nav>
          <div class="btfw-movie-history">
            <h6 class="btfw-movie-history__title">Recent requests</h6>
            <div id="btfw-movie-history"></div>
          </div>
        </section>
      </div>
    `,document.body.appendChild(E);let q=s(".modal-background",E),D=s(".delete",E);if(q.addEventListener("click",Q),D.addEventListener("click",Q),(H=s("#btfw-movie-prev",E))==null||H.addEventListener("click",()=>{b.page>1&&(b.page-=1,N())}),(Z=s("#btfw-movie-next",E))==null||Z.addEventListener("click",()=>{b.page<b.totalPages&&(b.page+=1,N())}),x===0){let t=s("#btfw-movie-search",E);t.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),t.blur()})}else{let t,r=s("#btfw-movie-search",E);r.addEventListener("input",()=>{clearTimeout(t),b.query=r.value.trim(),b.page=1,t=setTimeout(()=>N(),400)}),(g=s("#btfw-movie-sort",E))==null||g.addEventListener("change",o=>{b.sortBy=o.target.value,b.page=1,N()}),(i=s("#btfw-movie-genre",E))==null||i.addEventListener("change",o=>{b.genreId=o.target.value,b.page=1,N()}),(c=s("#btfw-movie-year",E))==null||c.addEventListener("change",o=>{b.year=o.target.value.trim(),b.page=1,N()}),(w=s("#btfw-movie-rating",E))==null||w.addEventListener("change",o=>{b.minRating=o.target.value.trim(),b.page=1,N()})}}function F(){if(s("#btfw-movie-confirm-modal"))return;let E=document.createElement("div");E.id="btfw-movie-confirm-modal",E.className="modal",E.innerHTML=`
      <div class="modal-background"></div>
      <div class="modal-card btfw-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Suggestion</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <p>Are you sure you want to suggest <strong id="btfw-confirm-movie-title"></strong>?</p>
          <div class="btfw-movie-confirm-actions">
            <button type="button" class="button" id="btfw-movie-cancel">No</button>
            <button type="button" class="button is-link" id="btfw-movie-confirm">Yes</button>
          </div>
        </section>
      </div>
    `,document.body.appendChild(E);let q=s(".modal-background",E),D=s(".delete",E),H=s("#btfw-movie-cancel",E),Z=s("#btfw-movie-confirm",E),g=()=>ie();q.addEventListener("click",g),D.addEventListener("click",g),H.addEventListener("click",g),Z.addEventListener("click",oe)}async function I(){if(_&&A)return;let[E,q]=await Promise.all([k("/api/meta"),k("/api/genres")]);_=E,A=q;let D=s("#btfw-movie-suggest-modal");if(!D)return;let H=s("#btfw-movie-sort",D);if(H&&H.options.length===0){for(let g of E.sortOptions||[]){let i=document.createElement("option");i.value=g.value,i.textContent=g.label,H.appendChild(i)}H.value=b.sortBy}let Z=s("#btfw-movie-genre",D);if(Z&&Z.options.length<=1)for(let g of q.genres||[]){let i=document.createElement("option");i.value=String(g.id),i.textContent=g.name,Z.appendChild(i)}}function V(){let E={page:b.page,sort_by:b.sortBy};return b.query?(E.query=b.query,b.year&&(E.primary_release_year=b.year,E.year=b.year)):(b.genreId&&(E.with_genres=b.genreId),b.year&&(E.primary_release_year=b.year),b.minRating&&(E["vote_average.gte"]=b.minRating)),E}function K(E){return!E||E==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${E}`}function W(){let E=s("#btfw-movie-suggest-modal");if(!E)return;let q=s("#btfw-movie-prev",E),D=s("#btfw-movie-next",E),H=s("#btfw-movie-page-label",E);H&&(H.textContent=`Page ${b.page} of ${b.totalPages}`),q&&(q.disabled=b.page<=1||b.loading),D&&(D.disabled=b.page>=b.totalPages||b.loading)}function $(E){let q=s("#btfw-movie-suggest-modal");if(!q)return;let D=s(".btfw-movie-results",q);if(!E.length){D.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}D.innerHTML=E.map(H=>`
      <div class="movie-result"
           data-id="${re(H.id)}"
           data-title="${re(H.title)}"
           data-poster="${re(H.posterPath||"")}"
           data-year="${re(H.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${re(K(H.posterPath))}" alt="${re(H.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${re(H.title)}</div>
          <small style="opacity:0.7;">${re(H.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),u(".movie-result",D).forEach(H=>{H.addEventListener("click",()=>{a=H.dataset.id,S=H.dataset.title,y=H.dataset.poster,M=H.dataset.year||null;let Z=s("#btfw-movie-confirm-modal");if(!Z)return;let g=M?` (${M})`:"";s("#btfw-confirm-movie-title",Z).textContent=`${S}${g}`,j()})})}async function N(){let E=s("#btfw-movie-suggest-modal");if(!E||b.loading)return;b.loading=!0,W();let q=s(".btfw-movie-results",E);q.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await I();let D=await k("/api/search",{params:V()});b.totalPages=Math.max(1,D.totalPages||1),$(D.results||[]),h("runSearch",{page:b.page,totalPages:b.totalPages,count:(D.results||[]).length})}catch(D){p("runSearch failed:",D),q.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{b.loading=!1,W()}}async function G(){let E=s("#btfw-movie-history");if(E){E.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let D=(await k("/api/history",{params:{page:1,limit:10}})).results||[];if(!D.length){E.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}E.innerHTML=D.map(H=>{let Z=H.releaseYear?` (${re(H.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${re(K(H.posterPath).replace("w154","w92"))}" alt="${re(H.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${re(H.movieTitle)}${Z}</div>
              <div class="history-item__meta">Requested by ${re(H.username)}</div>
            </div>
          </div>
        `}).join("")}catch(q){p("loadHistory failed:",q),E.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function j(){let E=s("#btfw-movie-suggest-modal"),q=s("#btfw-movie-confirm-modal");q&&(E&&E.classList.add("btfw-movie-suggest-pending"),q.classList.add("is-active"))}function ie(){let E=s("#btfw-movie-suggest-modal"),q=s("#btfw-movie-confirm-modal");E&&E.classList.remove("btfw-movie-suggest-pending"),q&&q.classList.remove("is-active")}async function Y(){let E=s("#btfw-movie-suggest-modal");if(E){h("openModal",{userRank:x}),E.classList.remove("btfw-movie-suggest-pending"),E.classList.add("is-active");try{await I(),await Promise.all([N(),G()])}catch(q){p("openModal bootstrap failed:",q)}}}function Q(){let E=s("#btfw-movie-suggest-modal");E&&(ie(),h("closeModal"),E.classList.remove("is-active"),s("#btfw-movie-search",E).value="",s(".btfw-movie-results",E).innerHTML="",b.query="",b.page=1,b.totalPages=1,a=null,S=null,y=null,M=null)}function J(E,q,D){let H=D?` (${D})`:"";return`\u{1F3AC} Movie request: ${q}${H} \u2014 suggested by ${E}`}async function oe(){if(!a||!S)return;let E=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";h("confirmSuggestion",{movieId:a,movieTitle:S}),ie();try{await m.play(),await k("/api/suggestions",{method:"POST",body:{movieId:Number(a),movieTitle:S,username:E,posterPath:y||null,releaseYear:M||null}}),v(J(E,S,M)),await G(),Q()}catch(q){p("confirmSuggestion failed:",q),alert("Could not save your movie request. Please try again.")}}function ee(){h("boot: start",{workerBase:n.getWorkerBase()}),L(),U(),F(),fe(".navbar, .navbar-nav, #nav-collapsible",{timeoutMs:5e3}).catch(()=>{}).then(()=>{O()?h("Button added successfully"):console.warn(f,"Failed to add nav button")})}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ee,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ee,200)}):setTimeout(ee,200),{name:"ext:movie-suggestion",open:Y,close:Q,getWorkerBase:n.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async e=>e.init("ext:movie-suggestion"));})();
