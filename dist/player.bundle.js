/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{var mt=Object.defineProperty;var pt=(e,t)=>{for(var d in t)mt(e,d,{get:t[d],enumerable:!0})};BTFW.define("feature:player",[],async()=>{var _;let e=(p,T=document)=>T.querySelector(p),t=(p,T=document)=>Array.from(T.querySelectorAll(p)),d=((_=window.BTFW)==null?void 0:_.BASE)||"";function s(p){if(!p)return;let T=p.startsWith("http")?p:`${d}/${p.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(b=>b.getAttribute("href")===T||b.getAttribute("href")===p))return;let u=document.createElement("link");u.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[p]&&(u.integrity=window.BTFW.SRI[p],u.crossOrigin="anonymous"),u.href=T,document.head.appendChild(u)}function c(){let p=e("#videowrap");if(!p)return;s("dist/css/player.css"),p.classList.add("btfw-player-wrap");let T=p.querySelector("#controlsrow, .player-controls");T&&T.classList.add("btfw-player-controls"),i()}function i(){if(window.videojs)try{let p=document.querySelector(".video-js");p&&!p.classList.contains("btfw-vjs-enhanced")&&p.classList.add("btfw-vjs-enhanced")}catch(p){}}function E(){let p=e("#videowrap");if(!p)return;new MutationObserver(()=>{i()}).observe(p,{childList:!0,subtree:!0})}function y(){c(),E();try{let p=window.socket;p&&typeof p.on=="function"&&p.on("changeMedia",()=>{setTimeout(c,100)})}catch(p){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",y):y(),{name:"feature:player",applyPlayerLayoutEnhancements:c}});var Ae={};pt(Ae,{addMediaButtonHtml:()=>gt,addMediaPanelHtml:()=>yt,panelUndockIconHtml:()=>Me,panelsMenuButtonHtml:()=>Le,playlistAddFormHtml:()=>Ce,playlistSearchButtonHtml:()=>wt,stackGroupHeaderHtml:()=>_e});function bt(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ht(e,...t){var s;let d="";for(let c=0;c<e.length;c+=1)d+=(s=e[c])!=null?s:"",c<t.length&&(d+=bt(t[c]));return d}function yt(){return`
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
      `}function _e(e){return ht`
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
    `}function gt(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}function wt(){return'<i class="fa fa-search" aria-hidden="true"></i>'}function ue(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function se(e,t){return e!=null?!!e:!!t}var we=class extends Error{constructor(t){super(t),this.name="TimeoutError"}};function Ye(){let e=globalThis.MutationObserver;return typeof e=="function"?e:null}function Ve(){var t,d;let e=globalThis;return{setTimeoutFn:(t=e.setTimeout)!=null?t:null,clearTimeoutFn:(d=e.clearTimeout)!=null?d:null}}function vt(e,t){if(t)return t;let d=e!=null?e:globalThis.document;return d&&typeof d.querySelector=="function"?s=>d.querySelector(s):()=>null}function je(e){if(e)try{e.disconnect()}catch(t){}}function fe(e,t={}){let{root:d=null,timeoutMs:s,includeExisting:c=!0,observerClass:i}=t;return new Promise((E,y)=>{var U,$;let _=i!==void 0?i:Ye(),p=vt(d,t.querySelector),T=Ve(),I=(U=t.setTimeoutFn)!=null?U:T.setTimeoutFn,u=($=t.clearTimeoutFn)!=null?$:T.clearTimeoutFn,b=null,f=null,g=!1,S=B=>{g||(g=!0,je(b),b=null,f!==null&&u&&(u(f),f=null),B())},M=B=>{S(()=>E(B))},x=B=>{S(()=>y(B))},P=()=>{typeof s!="number"||!I||!u||(f=I(()=>{x(new we(`waitForElement: "${e}" not found within ${s}ms`))},s))};if(c){let B=p(e);if(B){M(B);return}}if(!_){x(new Error("waitForElement: no MutationObserver implementation available"));return}b=new _(()=>{let B=p(e);B&&M(B)});let N=d!=null?d:globalThis.document;if(!N){x(new Error("waitForElement: no root available to observe"));return}b.observe(N,{childList:!0,subtree:!0}),P()})}function pe(e,t={}){let{root:d=null,timeoutMs:s,observerClass:c}=t;return new Promise((i,E)=>{var x,P;let y=c!==void 0?c:Ye(),_=Ve(),p=(x=t.setTimeoutFn)!=null?x:_.setTimeoutFn,T=(P=t.clearTimeoutFn)!=null?P:_.clearTimeoutFn,I=null,u=null,b=!1,f=N=>{b||(b=!0,je(I),I=null,u!==null&&T&&(T(u),u=null),N())},g=()=>{typeof s!="number"||!p||!T||(u=p(()=>{f(()=>E(new we("waitForCondition: condition not met within timeout")))},s))},S=e();if(S){f(()=>i(S));return}if(!y){f(()=>E(new Error("waitForCondition: no MutationObserver implementation available")));return}let M=d!=null?d:globalThis.document;if(!M){f(()=>E(new Error("waitForCondition: no root available to observe")));return}I=new y(()=>{let N=e();N&&f(()=>i(N))}),I.observe(M,{childList:!0,subtree:!0,attributes:!0}),g()})}var Et=/[&<>"']/g,St={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function re(e){return e==null?"":String(e).replace(Et,t=>{var d;return(d=St[t])!=null?d:t})}function xt(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ke(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var kt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],Tt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},_t=["http","https","mailto"],Lt="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",Mt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,Ct=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,At={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function Pt(e){let t=e;for(let s=0;s<3;s+=1){let c=t.replace(/&#x([0-9a-fA-F]+);?/g,(i,E)=>{let y=Number.parseInt(E,16);if(!Number.isFinite(y)||y<0||y>1114111)return"";try{return String.fromCodePoint(y)}catch(_){return""}}).replace(/&#(\d+);?/g,(i,E)=>{let y=Number(E);if(!Number.isFinite(y)||y<0||y>1114111)return"";try{return String.fromCodePoint(y)}catch(_){return""}}).replace(/&([a-zA-Z]+);?/g,(i,E)=>{let y=At[E.toLowerCase()];return y!==void 0?y:i});if(c===t)break;t=c}let d="";for(let s=0;s<t.length;s+=1){let c=t.charCodeAt(s);c<=31||c===127||(d+=t[s])}return d.replace(/[\s\u00a0]+/g,"")}function It(e){var c,i;let t=new Map,d=new RegExp(Mt.source,"g"),s;for(;(s=d.exec(e))!==null;){let E=((c=s[1])!=null?c:"").toLowerCase(),y=(i=s[2])!=null?i:"";(y.startsWith('"')&&y.endsWith('"')||y.startsWith("'")&&y.endsWith("'"))&&(y=y.slice(1,-1)),t.set(E,y),s[0].length===0&&(d.lastIndex+=1)}return t}function Ot(e,t){var i;let d=Pt(e);if(d.length===0)return!0;let s=Ct.exec(d);if(!s)return!0;let c=((i=s[1])!=null?i:"").toLowerCase();return t.includes(c)?c==="data"?/^data:image\//i.test(d):!0:!1}function Nt(e,t,d,s,c,i,E){var f,g;let y=t.toLowerCase();if(!c.has(y))return"";if(e)return`</${y}>`;let _=It(d||""),p=(f=i["*"])!=null?f:[],T=(g=i[y])!=null?g:[],I=[];for(let[S,M]of _)S.startsWith("on")||!(p.includes(S)||T.includes(S))||(S==="href"||S==="src")&&!Ot(M,E)||I.push(`${S}="${xt(M)}"`);y==="a"&&_.get("target")==="_blank"&&T.includes("rel")&&(I.some(S=>S.startsWith("rel="))||I.push('rel="noopener noreferrer"'));let u=I.length>0?` ${I.join(" ")}`:"";return`<${y}${u}${s?" /":""}>`}function be(e,t={}){var T,I,u;if(e==null)return"";let d=String(e).replace(/<!--[\s\S]*?-->/g,""),s=new Set(((T=t.allowedTags)!=null?T:kt).map(b=>b.toLowerCase())),c=(I=t.allowedAttributes)!=null?I:Tt,i=(u=t.allowedSchemes)!=null?u:_t,E=new RegExp(Lt,"g"),y="",_=0,p;for(;(p=E.exec(d))!==null;){let[b,f,g="",S="",M]=p;y+=Ke(d.slice(_,p.index)),y+=Nt(f,g,S,M,s,c,i),_=p.index+b.length}return y+=Ke(d.slice(_)),y}var Qe="btfw-stack-order",he="btfw-stack-motd-open",Pe="btfw-stack-playlist-open",Ie="btfw-stack-poll-open",ve={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Oe={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},Xe={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Ne={"motd-group":1,"poll-group":2,"playlist-group":3},de=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Be=["#main","#mainpage","#mainpane"];function le(e){try{let t=Array.from(e.children).map(d=>({id:d.dataset.bind,isGroup:d.dataset.group==="true"}));localStorage.setItem(Qe,JSON.stringify(t))}catch(t){}}function Ze(){try{return JSON.parse(localStorage.getItem(Qe)||"[]")}catch(e){return[]}}function ye(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function Re(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(d){}}function qe(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let d=e.replace("-docked","-hidden"),s=localStorage.getItem(d);return s!==null?s==="true":!1}catch(t){return!1}}function Je(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(d){}}function He(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Ee(e,t,d){if(!e||He(e))return;let s=ye(t!=null?t:""),c=typeof d=="function"?d(s):s!==null?!!s:!0;e._btfwSetOpenState?e._btfwSetOpenState(c,{persist:!1}):(e.dataset.open=c?"true":"false",e.classList.toggle("is-open",c))}function Fe(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(E=>E.dataset.docked!=="true"),d=e.length>0&&t.length===0,s=document.getElementById("btfw-stack"),c=document.getElementById("btfw-leftpad"),i=document.getElementById("btfw-grid");s&&(s.classList.toggle("btfw-stack--all-hidden",d),s.classList.toggle("btfw-stack--all-docked",d)),c&&c.classList.toggle("btfw-leftpad--stack-hidden",d),i&&i.classList.toggle("btfw-grid--stack-hidden",d),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:d,allDocked:d,visibleCount:t.length,totalCount:e.length}}))}function $e(e=""){let t=String(e||"").trim();return t?!t.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function et(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=me(e);return t?!$e(t.innerHTML||""):!1}function me(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let d=t.querySelector(":scope > #motd");return d||t.querySelector("#motd")||e.getElementById("motd")}function De(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let i=t.querySelector(":scope > #motd");return i?{motdwrap:t,motd:i}:null}let d=document.getElementById("togglemotd");d&&d.closest("#motd")&&t.insertBefore(d,t.firstChild);let s=[];t.querySelectorAll(".btfw-motd-editrow").forEach(i=>{let E=(i.textContent||"").trim();E&&s.push(`<p>${E}</p>`),i.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(i=>{i.contains(t)||i===t||((i.querySelector("#motd")||i.classList.contains("btfw-motd-editrow"))&&i.querySelectorAll("#motd").forEach(E=>{(E.innerHTML||"").trim()&&s.push(E.innerHTML)}),i.remove())});let c=t.querySelector(":scope > #motd");if(c||(c=document.createElement("div"),c.id="motd",t.appendChild(c)),t.querySelectorAll("#motd").forEach(i=>{i!==c&&((i.innerHTML||"").trim()&&s.push(i.innerHTML),i.remove())}),c.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(i=>{i.remove()}),c.querySelectorAll("#motd").forEach(i=>{(i.innerHTML||"").trim()&&s.push(i.innerHTML),i.remove()}),document.querySelectorAll("#togglemotd").forEach((i,E)=>{E!==0&&i.remove()}),s.length){let i=s.join("").trim();i&&$e(c.innerHTML)?c.innerHTML=be(i):i&&(c.innerHTML+=be(i))}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:c}}function tt(e){let t=null,d=!1,s=!1;function c(T){De();let I=document.getElementById("motdwrap");if(!I)return;let u=T&&T.list;if(!u)return;let b=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(b){let f=b.querySelector(".btfw-group-body");f&&!f.contains(I)&&f.appendChild(I)}else{let f=de.find(g=>g.id==="motd-group");if(!f)return;b=e.createGroupItem(f,[I]),b&&(u.appendChild(b),le(u))}i(b)}function i(T){let I=document.getElementById("motdwrap");if(!I)return;let u=et();if(I.classList.toggle("btfw-motd-empty",!u),I.toggleAttribute("hidden",!u),I.setAttribute("aria-hidden",u?"false":"true"),u){I.style.removeProperty("display");let b=me();b&&b.style.removeProperty("display")}if(T||(T=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),T&&u){let b=ye(he),f=se(b,!0),g=T;g._btfwSetOpenState?g._btfwSetOpenState(f,{persist:!1}):(g.dataset.open=f?"true":"false",g.classList.toggle("is-open",f))}}function E(T){t&&clearTimeout(t),t=setTimeout(()=>{t=null,c(T)},50)}function y(T){let I=me();I&&(d||(d=!0,new MutationObserver(()=>{E(T)}).observe(I,{childList:!0,subtree:!0,characterData:!0})))}function _(T){s||!window.socket||!window.socket.on||(s=!0,window.socket.on("setMotd",I=>{let u=typeof I=="string"?I:I&&typeof I=="object"&&typeof I.motd=="string"?I.motd:null,b=me();if(b){let f=u!==null?u:b.innerHTML,g=be(f);b.innerHTML!==g&&(b.innerHTML=g)}E(T)}))}function p(T){let I=e.ensureStackRefs(),u=document.getElementById("motdwrap");u&&delete u.dataset.btfwMotdNormalized;let b=De(!0),f=(b==null?void 0:b.motd)||me();f&&typeof T=="string"&&(f.innerHTML=be(T));let g=document.getElementById("cs-motdtext");g&&typeof T=="string"&&(g.value=T),I&&E(I)}return{isMotdHtmlEmpty:$e,hasMotdContent:et,resolveMotdHost:me,normalizeMotdStructure:De,ensureMotdStackPanel:c,syncMotdWrapVisibility:i,scheduleMotdSync:E,wireMotdObservers:y,wireMotdSocket:_,applyMotdUpdate:p}}var Bt=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function nt(e){let{tpl:t}=e;function d(f,g,S){if(!f||!g||!S)return null;let M=Bt.map(z=>{let F=document.getElementById(z.id);return F?{...z,el:F}:null}).filter(Boolean);if(!M.length){let z=document.getElementById("btfw-addmedia-panel");return z&&z.remove(),null}let x=document.getElementById("btfw-addmedia-panel");if(x||(x=document.createElement("section"),x.id="btfw-addmedia-panel",x.className="btfw-addmedia-panel",x.dataset.open="false",x.setAttribute("role","region"),x.setAttribute("aria-label","Add media controls"),x.setAttribute("aria-hidden","true"),x.setAttribute("hidden","hidden"),x.innerHTML=t.addMediaPanelHtml()),x.parentElement!==f){let z=g.parentElement===f?g.nextSibling:null;f.insertBefore(x,z)}let P=x.querySelector(".btfw-addmedia-tabs"),N=x.querySelector(".btfw-addmedia-views"),U=x.querySelector(".btfw-addmedia-close");if(!P||!N)return null;for(;P.firstChild;)P.removeChild(P.firstChild);for(;N.firstChild;)N.removeChild(N.firstChild);M.forEach(({id:z,title:F,el:R})=>{R.classList.remove("collapse","in","plcontrol-collapse"),R.style.removeProperty("display"),R.style.removeProperty("height"),R.removeAttribute("aria-expanded"),R.setAttribute("role","tabpanel"),R.setAttribute("data-btfw-addmedia","panel");let Y=document.createElement("button");Y.type="button",Y.className="btfw-addmedia-tab",Y.dataset.target=z,Y.textContent=F,Y.setAttribute("role","tab"),P.appendChild(Y);let Q=document.createElement("div");Q.className="btfw-addmedia-view",Q.dataset.target=z,Q.setAttribute("role","tabpanel"),Q.setAttribute("aria-hidden","true"),Q.appendChild(R),N.appendChild(Q)});let $=M.find(z=>z.default)||M[0],B=z=>{let F=z||x.dataset.active||$.id;x.dataset.active=F,P.querySelectorAll(".btfw-addmedia-tab").forEach(R=>{let Y=R.dataset.target===F;R.classList.toggle("is-active",Y),R.setAttribute("aria-selected",Y?"true":"false"),R.setAttribute("tabindex",Y?"0":"-1")}),N.querySelectorAll(".btfw-addmedia-view").forEach(R=>{let Y=R.dataset.target===F;R.classList.toggle("is-active",Y),R.setAttribute("aria-hidden",Y?"false":"true")})},V=z=>{let F=z!=null?!!z:x.dataset.open!=="true";return x.dataset.open=F?"true":"false",x.classList.toggle("is-open",F),x.setAttribute("aria-hidden",F?"false":"true"),F?(x.removeAttribute("hidden"),B(x.dataset.active||$.id)):x.setAttribute("hidden","hidden"),x.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:F}})),F};return x._btfwWired||(P.addEventListener("click",z=>{let F=z.target.closest(".btfw-addmedia-tab");F&&(z.preventDefault(),B(F.dataset.target))}),U&&U.addEventListener("click",()=>V(!1)),x._btfwWired=!0),B(x.dataset.active||$.id),x._btfwToggle=V,x._btfwSetActive=B,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:F,target:R})=>{let Y=document.getElementById(F);Y&&Y.dataset.btfwAddmedia!==R&&(Y.dataset.btfwAddmedia=R,Y.setAttribute("aria-controls","btfw-addmedia-panel"),Y.addEventListener("click",Q=>{Q.preventDefault(),Q.stopPropagation(),B(R),V(!0),Y.blur()}))})})(),{panel:x,toggle:V,setActive:B}}function s(f,g,S){let M=f.querySelector(".btfw-plbar__search");if(!M||document.getElementById("btfw-pl-search-toggle"))return;M.id||(M.id="btfw-plbar-search"),M.hidden=!0;let x=document.createElement("button");x.type="button",x.id="btfw-pl-search-toggle",x.className="button is-dark is-small btfw-plbar__action-btn",x.innerHTML=t.playlistSearchButtonHtml(),x.title="Filter Playlist",x.setAttribute("aria-label","Filter Playlist"),x.setAttribute("aria-controls",M.id),x.setAttribute("aria-expanded","false"),S&&S.parentElement===g?S.after(x):g.prepend(x);let P=M.querySelector("input"),N=U=>{var $;if(M.hidden=!U,x.setAttribute("aria-expanded",U?"true":"false"),U){P==null||P.focus();return}P!=null&&P.value&&(($=M.querySelector("#btfw-pl-clear"))==null||$.click())};x.addEventListener("click",()=>N(x.getAttribute("aria-expanded")!=="true")),M.addEventListener("keydown",U=>{U.key==="Escape"&&(N(!1),x.focus())})}function c(){let f=document.getElementById("btfw-plbar");if((f==null?void 0:f.dataset.btfwMerged)==="1")return;let g=document.getElementById("controlsrow"),S=document.getElementById("rightcontrols"),M=document.getElementById("playlistwrap"),x=document.getElementById("queuecontainer"),P=document.getElementById("playlistrow"),N=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),U=document.querySelectorAll(".btfw-controls-row"),$=P||M||x||N;if(!$)return;let B=f;B?B.classList.add("btfw-plbar"):(B=document.createElement("div"),B.id="btfw-plbar",B.className="btfw-plbar");let V=B.querySelector(".btfw-plbar__layout"),X,z;if(V)X=V.querySelector(".btfw-plbar__primary")||V,z=V.querySelector(".btfw-plbar__aside")||V;else{for(V=document.createElement("div"),V.className="btfw-plbar__layout",X=document.createElement("div"),X.className="btfw-plbar__primary",z=document.createElement("div"),z.className="btfw-plbar__aside",V.append(X,z);B.firstChild;)X.appendChild(B.firstChild);B.appendChild(V);let G=X.querySelector(".field.has-addons");G&&G.classList.add("btfw-plbar__search");let K=X.querySelector("#btfw-pl-count");K&&(K.classList.add("btfw-plbar__count"),z.appendChild(K))}B.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(G=>G.remove());let F=B.querySelector(".btfw-plbar__actions");F||(F=document.createElement("div"),F.className="btfw-plbar__actions",(z||B).appendChild(F));let R=document.getElementById("btfw-addmedia-btn"),Y=G=>{if(G){if(G.classList.add("btfw-plbar__action-btn"),G.tagName==="BUTTON"||G.tagName==="A")G.classList.add("button","is-dark","is-small");else if(G.tagName==="INPUT"){let K=(G.type||"").toLowerCase();K==="button"||K==="submit"||K==="reset"?G.classList.add("button","is-dark","is-small"):G.classList.remove("button","is-dark","is-small")}}};B.parentElement!==$&&$.insertBefore(B,$.firstChild);let Q=d($,B,F);Q?!R||!document.body.contains(R)?(R=document.createElement("button"),R.id="btfw-addmedia-btn",R.setAttribute("type","button"),R.className="button is-small",R.innerHTML=t.addMediaButtonHtml(),F.prepend(R)):F.contains(R)||F.prepend(R):R&&(R.parentElement&&R.parentElement.removeChild(R),R=null);let ie=G=>{if(!G)return;Array.from(G.children||[]).forEach(Z=>{Z&&(Z.classList.add("btfw-plbar__control"),F.appendChild(Z))})};if(S&&(ie(S),S.remove()),g&&(ie(g),g.remove()),F.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(Y),Q&&R){R.classList.remove("is-dark"),R.classList.add("is-primary"),R.dataset.iconified||(R.innerHTML=t.addMediaButtonHtml(),R.dataset.iconified="1"),R.setAttribute("aria-controls","btfw-addmedia-panel");let G=Z=>{R.setAttribute("aria-expanded",Z?"true":"false")};R.dataset.btfwBound||(R.dataset.btfwBound="1",R.addEventListener("click",Z=>{Z.preventDefault();let oe=document.getElementById("btfw-addmedia-panel"),ee=oe&&oe._btfwToggle,w=typeof ee=="function"?ee():!1;G(w)}));let K=Q.panel||document.getElementById("btfw-addmedia-panel");K&&(G(K.dataset.open==="true"),K._btfwButtonSync||(K.addEventListener("btfw:addmedia:state",Z=>{G(!!Z.detail&&!!Z.detail.open)}),K._btfwButtonSync=!0))}s(B,F,R),U.forEach(G=>{G&&!$.contains(G)&&(G.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,G.remove(),$.appendChild(G),console.log("[stack] Moved floating controls row into playlist container"))}),$.contains(B)||$.insertBefore(B,$.firstChild),B.dataset.btfwMerged="1"}function i(f){if(!f)return null;let g=Array.from(f.classList).find(M=>M.startsWith("pluid-"));if(g)return g.slice(6);let S=window.jQuery||window.$;if(S){let M=S(f).data("uid");if(M!=null&&M!=="")return M}return f.dataset.uid||null}function E(f){if(f==null||f==="")return!1;let g=window.socket;if(g&&typeof g.emit=="function")return g.emit("jumpTo",f),!0;let S=document.querySelector(`#queue > .queue_entry.pluid-${f}`),M=S==null?void 0:S.querySelector(".qbtn-play");return M?(M.click(),!0):!1}function y(f){let g=(f||"").trim();if(!g)return!1;let S=document.getElementById("mediaurl"),M=document.getElementById("queue_next");if(S&&M&&(S.value=g,!M.disabled))return M.click(),!0;if(typeof window.queue=="function"&&S)return S.value=g,window.queue("next","url"),!0;let x=window.socket;if(x&&typeof parseMediaLink=="function")try{let P=parseMediaLink(g);if((P==null?void 0:P.id)!=null&&(P!=null&&P.type))return x.emit("queue",{id:P.id,type:P.type,pos:"next",temp:!1}),!0}catch(P){}return!1}let _=null,p=null;function T(){if(_){try{_.disconnect()}catch(f){}_=null}p=null}function I(f){if(!f||p===f)return;T();let g=document.getElementById("queue");g&&(p=f,_=new MutationObserver(()=>{f.isConnected&&e.getActiveFlyoutGroup()==="playlist-group"&&b(f)}),_.observe(g,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function u(f=5){let g=document.getElementById("queue");if(!g)return[];let S=Array.from(g.querySelectorAll(":scope > .queue_entry")),M=S.findIndex(P=>P.classList.contains("queue_active")||P.classList.contains("playing")),x=M>=0?M+1:0;return S.slice(x,x+f)}function b(f){if(!f)return;let g=u(5);if(f.replaceChildren(),!g.length){let S=document.createElement("p");S.className="btfw-panel-playlist__empty",S.textContent="No upcoming videos",f.appendChild(S);return}g.forEach(S=>{var $,B;let M=document.createElement("div");M.className="btfw-panel-playlist__item";let x=document.createElement("span");x.className="btfw-panel-playlist__title",x.textContent=((($=S.querySelector(".qe_title"))==null?void 0:$.textContent)||"Untitled").trim();let P=document.createElement("span");P.className="btfw-panel-playlist__meta",P.textContent=(((B=S.querySelector(".qe_time"))==null?void 0:B.textContent)||"").trim();let N=document.createElement("div");N.className="btfw-panel-playlist__actions";let U=i(S);if(U!=null&&U!==""){let V=document.createElement("button");V.type="button",V.className="btfw-panel-playlist__play",V.textContent="Play",V.dataset.queueUid=String(U),!(S==null?void 0:S.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(V.disabled=!0),N.appendChild(V)}M.append(x,P,N),f.appendChild(M)})}return{ensureAddMediaUI:d,mergePlaylistControls:c,getQueueEntryUid:i,playQueueEntry:E,queueMediaLink:y,disconnectQueuePreviewObserver:T,ensureQueuePreviewObserver:I,getUpcomingQueueEntries:u,renderPlaylistQueuePreview:b}}function ot(e){let t=null,d=!1,s=!1;function c(){let u=document.getElementById("pollwrap");if(!u)return null;if(!u.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return u;let f=document.getElementById("btfw-poll-parking");return f||(f=document.createElement("div"),f.id="btfw-poll-parking",f.hidden=!0,f.setAttribute("aria-hidden","true"),document.body.appendChild(f)),f.appendChild(u),u}function i(u){let b=document.getElementById("pollwrap");if(!b)return;let f=b.dataset&&b.dataset.btfwPollOverlay,g=b.getAttribute&&b.getAttribute("data-btfw-poll-overlay");if(f==="video"||g==="video")return;c(),I();let S=u&&u.list;if(!S)return;let M=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!M){let N=de.find(U=>U.id==="poll-group");if(!N)return;M=e.createGroupItem(N,[b]),M&&(S.appendChild(M),le(S));return}let x=M.querySelector(".btfw-group-body");x&&!x.contains(b)&&x.appendChild(b);let P=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');P&&P.contains(b)&&x&&x.appendChild(b)}function E(u,b={}){i(u),T();let f=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');f&&(f.hidden=!1,f.removeAttribute("hidden"),b.forceOpen&&f._btfwSetOpenState?f._btfwSetOpenState(!0,{persist:!1}):b.forceOpen&&(f.dataset.open="true",f.classList.add("is-open")))}function y(u,b={}){t&&clearTimeout(t),t=setTimeout(()=>{t=null,E(u,b)},50)}function _(u){if(d)return;let b=document.getElementById("pollwrap");if(!b)return;d=!0,new MutationObserver(()=>{y(u,{forceOpen:ue()})}).observe(b,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let g=document.getElementById("newpollbtn");g&&!g.dataset.btfwPollSync&&(g.dataset.btfwPollSync="1",g.addEventListener("click",()=>{y(u,{forceOpen:!0})}))}function p(u){s||!window.socket||!window.socket.on||(s=!0,window.socket.on("newPoll",()=>y(u,{forceOpen:!0})),window.socket.on("closePoll",()=>y(u)))}function T(){let u=document.getElementById("pollwrap");if(!u)return;let b=!!u.closest(".btfw-panel-container__host"),f=!ue();if(b&&!f){u.classList.remove("btfw-poll-idle"),u.removeAttribute("hidden"),u.setAttribute("aria-hidden","false");return}u.classList.toggle("btfw-poll-idle",f),u.toggleAttribute("hidden",f),u.setAttribute("aria-hidden",f?"true":"false")}function I(){let u=document.getElementById("leftcontrols"),b=document.getElementById("pollwrap");u&&b&&(u.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(g=>{let S=b.querySelector(".poll-controls");S||(S=document.createElement("div"),S.className="poll-controls",b.insertBefore(S,b.firstChild)),g.parentElement!==S&&S.appendChild(g)}),u.children.length===0&&u.remove())}return{detachPollWrapFromPlaylist:c,movePollButton:I,ensurePollStackPanel:i,syncPollPanelVisibility:E,schedulePollSync:y,wirePollObservers:_,wirePollSocket:p,syncPollWrapVisibility:T}}BTFW.define("feature:stack",["feature:layout"],async({init:e})=>{let t=!1,d=null,s="",c=null,i={"motd-group":{storageKey:he,getDefaultOpen:n=>se(n,T()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:Pe,getDefaultOpen:n=>se(n,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:Ie,getDefaultOpen:n=>se(n,ue()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},E=!1,y=null,_=!1,p=tt({createGroupItem:f,ensureStackRefs:()=>b()}),T=p.hasMotdContent,I=nt({tpl:Ae,getActiveFlyoutGroup:()=>d}),u=ot({createGroupItem:f});function b(){let n=document.getElementById("btfw-leftpad");if(!n)return null;let r=document.getElementById("btfw-stack");if(!r){r=document.createElement("div"),r.id="btfw-stack",r.className="btfw-stack";let o=document.getElementById("videowrap"),m=document.getElementById("btfw-video-overlay"),l=m&&o&&m.parentElement===o.parentElement?m:o;l&&l.parentElement?l.nextSibling?l.parentNode.insertBefore(r,l.nextSibling):l.parentNode.appendChild(r):n.appendChild(r);let L=document.createElement("div");L.className="btfw-stack-list",r.appendChild(L);let q=document.createElement("div");q.id="btfw-stack-footer",q.className="btfw-stack-footer",r.appendChild(q)}return{list:r.querySelector(".btfw-stack-list"),footer:r.querySelector("#btfw-stack-footer")}}function f(n,r){if(n.id==="motd-group"&&(p.normalizeMotdStructure(),r=[document.getElementById("motdwrap")].filter(Boolean)),n.id==="playlist-group"&&(u.detachPollWrapFromPlaylist(),I.mergePlaylistControls(),r=r.filter(C=>C&&C.id!=="rightcontrols"&&C.id!=="pollwrap").filter(C=>!C.querySelector||!C.querySelector("#pollwrap"))),n.id==="poll-group"&&(u.detachPollWrapFromPlaylist(),u.movePollButton(),r=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),r.length===0)return null;let o=document.querySelector("#btfw-stack .btfw-stack-list");o&&(r=r.filter(C=>C&&!o.contains(C)&&!C.contains(o)));let m=document.createElement("section");m.className="btfw-stack-item btfw-group-item",m.dataset.bind=n.id,m.dataset.group="true";let l=document.createElement("header");l.className="btfw-stack-item__header",l.innerHTML=_e(n.title);let L=document.createElement("div");L.className="btfw-stack-item__body btfw-group-body",r.forEach(C=>{if(C&&C.parentElement!==L&&!L.contains(C)&&!C.contains(L))try{L.appendChild(C)}catch(D){console.warn("[stack] Failed to move element:",C.id||C.className,D)}}),m.appendChild(l),m.appendChild(L);let q=i[n.id];return q&&w(m,q),ee(m,n.id),m.querySelector(".btfw-up").onclick=function(){let C=m.parentElement,D=m.previousElementSibling;D&&C.insertBefore(m,D),le(C)},m.querySelector(".btfw-down").onclick=function(){let C=m.parentElement,D=m.nextElementSibling;D?C.insertBefore(D,m):C.appendChild(m),le(C)},m}function g(n){n&&(n.classList.remove("btfw-stack-item--in-drawer"),delete n.dataset.btfwInDrawer,n.classList.toggle("is-open",n.dataset.open!=="false"),u.syncPollWrapVisibility())}function S(n){g(n);let r=document.querySelector("#btfw-stack .btfw-stack-list");!r||!n||n.parentElement!==r&&r.appendChild(n)}function M(){var m;let n=document.getElementById("btfw-chat-actions");if(!n)return null;let r=document.getElementById("btfw-panels-menu-shell");if(!r){r=document.createElement("div"),r.id="btfw-panels-menu-shell",r.className="btfw-panels-menu-shell",r.setAttribute("aria-label","Docked channel panels");let l=document.createElement("div");l.id="btfw-panel-bar",l.className="btfw-panel-bar",l.setAttribute("role","toolbar"),l.setAttribute("aria-label","Docked panel shortcuts"),r.appendChild(l)}let o=r.querySelector("#btfw-panel-bar");return U(o),r.parentElement!==n&&n.insertBefore(r,n.firstChild),t||(ie(),t=!0),(m=document.getElementById("btfw-stack-drawer"))==null||m.remove(),r}function x(n){n.preventDefault(),n.stopPropagation(),R()}function P(){let n=M();if(!n)return null;let r=document.getElementById("btfw-panels-menu-btn");r?r.parentElement!==n&&n.appendChild(r):(r=document.createElement("button"),r.type="button",r.id="btfw-panels-menu-btn",r.className="button btfw-chatbtn btfw-panels-menu-btn",r.innerHTML=Le(),r.title="Docked Panels",r.setAttribute("aria-expanded","false"),r.hidden=!0,n.appendChild(r)),r.title="Docked Panels";let o=r.querySelector(".btfw-panels-menu-btn__label");return o&&(o.textContent="Panels"),r.classList.remove("is-wide"),r.dataset.btfwPanelsWired||(r.addEventListener("click",x),r.dataset.btfwPanelsWired="1"),r}function N(n){b();let r=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${n}"]`);r&&(c&&(clearTimeout(c),c=null),d=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o.classList.remove("is-active"),delete o.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),I.disconnectQueuePreviewObserver(),oe(r,!1),requestAnimationFrame(()=>{try{r.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(o){}}))}function U(n){!n||n.dataset.btfwActionsWired||(n.dataset.btfwActionsWired="1",n.addEventListener("click",r=>{var L,q,C;let o=r.target.closest(".btfw-panel-undock");if(o){r.preventDefault(),r.stopPropagation();let D=o.dataset.panelGroup||((L=o.closest(".btfw-panel-btn"))==null?void 0:L.dataset.group);D&&N(D);return}let m=r.target.closest(".btfw-panel-playlist__play");if(m){r.preventDefault(),r.stopPropagation(),I.playQueueEntry(m.dataset.queueUid);return}let l=r.target.closest(".btfw-panel-playlist__add");if(l){r.preventDefault(),r.stopPropagation();let D=(q=l.closest(".btfw-panel-container"))==null?void 0:q.querySelector(".btfw-panel-playlist__add-form");if(!D)return;let j=D.hidden;D.hidden=!j,l.setAttribute("aria-expanded",j?"true":"false"),j&&((C=D.querySelector(".btfw-panel-playlist__link-input"))==null||C.focus())}}),n.addEventListener("submit",r=>{var q,C,D,j;let o=r.target.closest(".btfw-panel-playlist__add-form");if(!o)return;r.preventDefault(),r.stopPropagation();let m=o.querySelector(".btfw-panel-playlist__link-input"),l=(q=m==null?void 0:m.value)==null?void 0:q.trim();if(!l||!I.queueMediaLink(l))return;m.value="",o.hidden=!0,(D=(C=o.closest(".btfw-panel-container"))==null?void 0:C.querySelector(".btfw-panel-playlist__add"))==null||D.setAttribute("aria-expanded","false");let L=(j=o.closest(".btfw-panel-container"))==null?void 0:j.querySelector(".btfw-panel-playlist__queue");L&&I.renderPlaylistQueuePreview(L)}))}function $(n,r){let o=document.createElement("button");return o.type="button",o.className="btfw-panel-undock",o.dataset.panelGroup=n,o.setAttribute("aria-label",`Pin ${r.title} below video`),o.title="Pin below video",o.innerHTML=Me(),o}function B(){let n=document.createElement("form");return n.className="btfw-panel-playlist__add-form",n.hidden=!0,n.innerHTML=Ce(),n}function V(n,r,o){let m=document.createElement("div");if(m.className="btfw-panel-container",o>0&&(m.style.bottom=`${-o*50}px`),n==="playlist-group"){m.classList.add("btfw-panel-container--playlist");let L=document.createElement("div");L.className="btfw-panel-playlist__toolbar";let q=document.createElement("button");q.type="button",q.className="btfw-panel-playlist__add",q.textContent="+Add",q.setAttribute("aria-expanded","false");let C=$(n,r);L.append(q,C);let D=B(),j=document.createElement("div");return j.className="btfw-panel-container__host btfw-panel-playlist__queue",m.append(L,D,j),m}m.classList.add("btfw-panel-container--dock-only");let l=document.createElement("div");return l.className="btfw-panel-container__dock-only",l.appendChild($(n,r)),m.appendChild(l),m}function X(){c&&(clearTimeout(c),c=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(n=>{S(n)}),I.disconnectQueuePreviewObserver(),d=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function z(n){let r=document.getElementById("btfw-panel-bar"),o=document.getElementById("btfw-panels-menu-btn");r&&r.classList.toggle("open",n),document.documentElement.classList.toggle("btfw-panels-bar-open",n),o&&(o.classList.toggle("is-expanded",n),o.setAttribute("aria-expanded",n?"true":"false")),n||X()}function F(){z(!1)}function R(){M();let n=document.getElementById("btfw-panel-bar"),r=document.getElementById("btfw-panels-menu-btn");!n||!r||r.hidden||z(!n.classList.contains("open"))}function Y(n){c&&clearTimeout(c),c=setTimeout(()=>{c=null;let r=document.querySelector(`.btfw-panel-btn[data-group="${n}"]`);r&&(r.matches(":hover")||r.querySelector(".btfw-panel-container:hover")||(r.classList.remove("is-active"),d===n&&(d=null,I.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function Q(n,r){if(r&&(c&&(clearTimeout(c),c=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o!==r&&o.classList.remove("is-active")}),d=n,r.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),n==="playlist-group")){let o=r.querySelector(".btfw-panel-playlist__queue");o&&(I.renderPlaylistQueuePreview(o),I.ensureQueuePreviewObserver(o))}}function ie(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",n=>{d&&(n.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(r=>{delete r.dataset.btfwFlyoutLocked}),X()))}))}function G(n,r){var m;if(!((m=document.getElementById("btfw-panel-bar"))!=null&&m.classList.contains("open")))return;if(c&&(clearTimeout(c),c=null),r.dataset.btfwFlyoutLocked==="true"&&r.classList.contains("is-active")){delete r.dataset.btfwFlyoutLocked,r.classList.remove("is-active"),d===n&&(d=null,I.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(l=>{l!==r&&delete l.dataset.btfwFlyoutLocked}),r.dataset.btfwFlyoutLocked="true",Q(n,r)}function K(n,r){let o=n.querySelector(".btfw-panel-container"),m=()=>{var l;(l=document.getElementById("btfw-panel-bar"))!=null&&l.classList.contains("open")&&(c&&(clearTimeout(c),c=null),Q(r,n))};n.addEventListener("mouseenter",m),n.addEventListener("focusin",m),n.addEventListener("click",l=>{l.target.closest(".btfw-panel-container")||(l.preventDefault(),l.stopPropagation(),G(r,n))}),n.addEventListener("keydown",l=>{l.key!=="Enter"&&l.key!==" "||(l.preventDefault(),G(r,n))}),n.addEventListener("mouseleave",l=>{n.dataset.btfwFlyoutLocked!=="true"&&(o!=null&&o.contains(l.relatedTarget)||Y(r))}),o==null||o.addEventListener("mouseenter",()=>{c&&(clearTimeout(c),c=null)}),o==null||o.addEventListener("mouseleave",l=>{n.dataset.btfwFlyoutLocked!=="true"&&(n.contains(l.relatedTarget)||Y(r))})}function Z(){let n=M();P();let r=n==null?void 0:n.querySelector("#btfw-panel-bar");if(!r)return;let o=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((C,D)=>(Ne[C.dataset.bind]||99)-(Ne[D.dataset.bind]||99)),m=o.map(C=>C.dataset.bind).join("|"),l=document.getElementById("btfw-panels-menu-btn");if(l&&(l.hidden=o.length===0,o.length===0)){s="",F();return}if(m===s&&r.childElementCount===o.length)return;s=m;let L=r.classList.contains("open"),q=d;if(X(),r.replaceChildren(),r.style.setProperty("--btfw-panel-bar-count",String(Math.max(o.length,1))),o.forEach((C,D)=>{let j=C.dataset.bind,J=Oe[j]||{short:"?",title:j},te=document.createElement("div");te.className="btfw-panel-btn",te.dataset.group=j,te.title=J.title,te.setAttribute("role","button"),te.setAttribute("aria-label",J.title),te.tabIndex=0;let ne=document.createElement("span");ne.className="btfw-panel-btn__label",ne.textContent=Xe[j]||J.short,te.appendChild(ne),te.appendChild(V(j,J,D)),r.appendChild(te),K(te,j)}),L&&(z(!0),q&&o.some(D=>D.dataset.bind===q))){let D=r.querySelector(`.btfw-panel-btn[data-group="${q}"]`);D&&Q(q,D)}}function oe(n,r,o={}){if(!n)return;let m=!!r,l=o.persist===!1,L=n.dataset.bind,q=ve[L];n.dataset.docked=m?"true":"false",n.classList.toggle("btfw-stack-item--docked",m);let C=n.querySelector(".btfw-stack-dock-btn");C&&(C.setAttribute("aria-pressed",m?"true":"false"),C.title=m?"Pinned to panels menu":"Dock to panels menu"),m?He(n)?S(n):d===L&&(d=null):(S(n),n._btfwSetOpenState?n._btfwSetOpenState(!0):(n.dataset.open="true",n.classList.add("is-open"))),!l&&q&&Je(q,m),Z(),Fe()}function ee(n,r){var D;let o=ve[r];if(!o)return;let m=n.querySelector(".btfw-stack-item__header"),l=m==null?void 0:m.querySelector(".btfw-stack-header-toolbar"),L=l==null?void 0:l.querySelector(".btfw-stack-arrows");if(!L||L.querySelector(".btfw-stack-dock-btn"))return;let q=qe(o);n.dataset.docked=q?"true":"false",n.classList.toggle("btfw-stack-item--docked",q);let C=document.createElement("button");C.type="button",C.className="btfw-arrow btfw-stack-dock-btn",C.textContent="\u2AF7",C.setAttribute("aria-label",`Dock ${((D=Oe[r])==null?void 0:D.title)||r} to panels menu`),C.setAttribute("aria-pressed",q?"true":"false"),C.title=q?"Pinned to panels menu":"Dock to panels menu",C.addEventListener("click",j=>{j.preventDefault(),j.stopPropagation(),n.dataset.docked!=="true"&&oe(n,!0)}),L.insertBefore(C,L.firstChild)}function w(n,r={}){let{storageKey:o,getDefaultOpen:m,toggleClass:l,ariaLabel:L="Toggle panel visibility",openTitle:q="Hide panel",closeTitle:C="Show panel"}=r,D=ye(o),j=typeof m=="function"?m(D):D!==null?D:!0;n.hasAttribute("data-open")||(n.dataset.open=j?"true":"false"),n.classList.toggle("is-open",n.dataset.open!=="false");let J=n.querySelector(".btfw-stack-item__header"),te=J&&J.querySelector(".btfw-stack-arrows");if(!te||te.querySelector(`.${l}`))return;let ne=document.createElement("button");ne.type="button",ne.className=`btfw-arrow ${l}`,ne.setAttribute("aria-label",L),ne.style.display="flex",ne.style.alignItems="center",ne.style.justifyContent="center";let xe=()=>{let ae=n.dataset.open!=="false";ne.textContent=ae?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",ne.title=ae?q:C,ne.setAttribute("aria-expanded",ae?"true":"false"),n.classList.toggle("is-open",ae)},Ue=(ae,ke={})=>{let Ge=!!ae,Te=ke.persist===!1;Te&&(n._btfwSuppressPersist=!0),n.dataset.open=Ge?"true":"false",xe(),Te||Re(o,Ge),Te&&queueMicrotask(()=>{n._btfwSuppressPersist=!1})};ne.addEventListener("click",ae=>{ae.preventDefault(),ae.stopPropagation(),Ue(n.dataset.open==="false")}),xe(),new MutationObserver(ae=>{for(let ke of ae)ke.type==="attributes"&&(xe(),n._btfwSuppressPersist||Re(o,n.dataset.open!=="false"))}).observe(n,{attributes:!0,attributeFilter:["data-open"]}),te.insertBefore(ne,te.firstChild),n._btfwSetOpenState=Ue,ee(n,n.dataset.bind)}function H(n){return!!n.closest('.modal, [role="dialog"]')}function W(n){if(!n||n.querySelector("#btfw-footer"))return;let r=document.getElementById("btfw-footer");if(r&&r!==n&&!n.contains(r)){n.innerHTML="",n.appendChild(r);return}let o=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(m=>!H(m));o&&!n.contains(o)&&(o.classList.add("btfw-footer"),n.innerHTML="",n.appendChild(o))}function h(n){let r=document.querySelector(`.btfw-stack-item[data-bind="${n}"]`),o=r==null?void 0:r.querySelector(".btfw-stack-item__header");if(!o)return null;let m=o.querySelector(".btfw-stack-header-actions");if(!m){m=document.createElement("span"),m.className="btfw-stack-header-actions";let l=o.querySelector(".btfw-stack-header-toolbar"),L=(l==null?void 0:l.querySelector(".btfw-stack-arrows"))||o.querySelector(".btfw-stack-arrows");l&&L?l.insertBefore(m,L):L?o.insertBefore(m,L):o.appendChild(m)}return m}function k(n,r){n&&(n.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),n.classList.add("btfw-stack-header-btn"),n.innerHTML!==r&&(n.innerHTML=r))}function a(){let n=h("poll-group"),r=document.getElementById("newpollbtn");if(n&&r){k(r,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),r.parentElement!==n&&n.appendChild(r);let l=document.querySelector("#pollwrap > .poll-controls");l&&l.children.length===0&&l.remove()}let o=h("motd-group"),m=document.getElementById("btfw-motd-editbtn");if(o&&m){k(m,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),m.parentElement!==o&&o.appendChild(m);let l=m.closest(".btfw-motd-editrow");l&&l.parentElement&&l.remove()}}function v(n){return de.every(r=>r.selectors.some(m=>{var L,q;if(Be.includes(m))return!1;let l=document.querySelector(m);if(!l||n.contains(l)||l.contains(n))return!1;if(m==="#pollwrap"){let C=(L=l.dataset)==null?void 0:L.btfwPollOverlay,D=(q=l.getAttribute)==null?void 0:q.call(l,"data-btfw-poll-overlay");if(C==="video"||D==="video")return!1}return!0})?!!n.querySelector(`[data-bind="${r.id}"]`):!0)}function A(n){if(!E){E=!0;try{let r=n.list,o=n.footer;if(v(r)&&r.children.length>0){p.ensureMotdStackPanel(n),u.ensurePollStackPanel(n),u.syncPollWrapVisibility(),a(),W(o);return}u.movePollButton(),u.detachPollWrapFromPlaylist();let m=new Map;de.forEach(q=>{let C=[];q.selectors.forEach(D=>{let j=document.querySelector(D);if(j&&!(r.contains(j)||j.contains(r))&&!Be.includes(D)){if(D==="#pollwrap"){let J=j.dataset&&j.dataset.btfwPollOverlay,te=j.getAttribute&&j.getAttribute("data-btfw-poll-overlay");if(J==="video"||te==="video")return}C.push(j)}}),C.length>0&&m.set(q.id,{group:q,elements:C})});let l=Ze(),L=[];m.forEach(({group:q,elements:C},D)=>{if(!Array.from(r.children).find(J=>J.dataset.bind===D))try{let J=f(q,C);J&&L.push({item:J,id:D,priority:q.priority,isGroup:!0})}catch(J){console.warn("[stack] Failed to create group item:",D,J)}}),l.length>0?L.sort((q,C)=>{let D=l.findIndex(J=>J.id===q.id),j=l.findIndex(J=>J.id===C.id);return D>=0&&j>=0?D-j:D>=0?-1:j>=0?1:q.priority-C.priority}):L.sort((q,C)=>q.priority-C.priority),L.forEach(({item:q})=>{try{q&&!r.contains(q)&&!q.contains(r)&&r.appendChild(q)}catch(C){console.warn("[stack] Failed to add item to list:",C)}}),le(r),p.ensureMotdStackPanel(n),u.ensurePollStackPanel(n),u.syncPollWrapVisibility(),a(),W(o)}finally{E=!1}}}function O(){let n=b();if(!n||(A(n),p.wireMotdObservers(n),p.wireMotdSocket(n),u.wirePollObservers(n),u.wirePollSocket(n),_))return;_=!0;let r=new MutationObserver(()=>{y||(y=requestAnimationFrame(()=>{y=null,A(n)}))}),o=document.getElementById("btfw-leftpad"),m=document.getElementById("main");o&&r.observe(o,{childList:!0,subtree:!1}),m&&r.observe(m,{childList:!0,subtree:!1}),fe("#btfw-stack .btfw-stack-item",{root:document}).then(()=>{let l=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');l&&Ee(l,he,C=>se(C,T()));let L=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');L&&Ee(L,Pe,C=>C!==null?!!C:!0);let q=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');q&&Ee(q,Ie,C=>se(C,ue())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(C=>{let D=ve[C.dataset.bind];D&&oe(C,qe(D),{persist:!1})}),M(),P(),Z(),u.syncPollPanelVisibility(n),Fe(),A(n)}).catch(()=>{})}return document.addEventListener("btfw:layoutReady",O),document.addEventListener("btfw:chat:barsReady",()=>{M(),P(),Z()}),setTimeout(O,1200),document.addEventListener("btfw:channelThemeTint",()=>{let n=b();n&&setTimeout(()=>A(n),100)}),document.addEventListener("btfw:motd:updated",n=>{var o;let r=(o=n==null?void 0:n.detail)==null?void 0:o.html;typeof r=="string"&&p.applyMotdUpdate(r)}),{name:"feature:stack",hasMotdContent:T,resolveMotdHost:p.resolveMotdHost,normalizeMotdStructure:p.normalizeMotdStructure,applyMotdUpdate:p.applyMotdUpdate}});BTFW.define("feature:videoOverlay",[],async()=>{let e=(a,v=document)=>v.querySelector(a),t=["#mediarefresh","#voteskip","#fullscreenbtn"],s={owner:["chanowner","owner","founder","admin","administrator"]};function c(){try{return window.CLIENT||window.client||null}catch(a){return null}}function i(){try{return window.CHANNEL||window.channel||null}catch(a){return null}}function E(){let a=i();if(a&&typeof a.perms=="object"&&a.perms)return a.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(v){return{}}}function y(a=[]){let v=E();for(let A of a){let O=v==null?void 0:v[A];if(typeof O=="number")return O}}function _(){let a=y(s.owner);return typeof a=="number"?a:5}function p(a){if(!a)return!1;try{if(typeof a.hasPermission=="function"&&a.hasPermission("chanowner"))return!0}catch(v){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(v){}return!1}function T(){let a=c();if(!a)return!1;let v=Number(a.rank);return Number.isFinite(v)?!!(v>=_()||p(a)):!1}let I=0,u=0,b=0,f=2e3,g=8e3,S=45e3,M=12e4,x=g,P=!1,N=null;function U(){if(e("#btfw-vo-css"))return;let a=document.createElement("style");a.id="btfw-vo-css",a.textContent=`
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
    `,document.head.appendChild(a)}function $(a){let v=e("#videowrap");!v||!a||((a.parentElement!==v.parentElement||a.previousElementSibling!==v)&&v.insertAdjacentElement("afterend",a),a.classList.add("btfw-vo-visible"))}function B(){if(!e("#videowrap"))return null;let v=e("#btfw-video-overlay");v||(v=document.createElement("div"),v.id="btfw-video-overlay",v.setAttribute("data-testid","btfw-video-overlay")),v.classList.add("btfw-video-overlay"),v.getAttribute("data-testid")||v.setAttribute("data-testid","btfw-video-overlay"),$(v);let A=v.querySelector("#btfw-vo-bar");A||(A=document.createElement("div"),A.className="btfw-vo-bar",A.id="btfw-vo-bar",v.appendChild(A));let O=X(v,A);return G(O),K(O),V(v),v}function V(a){a&&a.querySelectorAll("button").forEach(v=>{v.classList.contains("btfw-vo-btn")||v.classList.add("btfw-vo-btn")})}function X(a,v){let A="btfw-vo-left",O="btfw-vo-right",n=v.querySelector(`#${A}`);n||(n=document.createElement("div"),n.id=A,n.className="btfw-vo-section btfw-vo-section--left",v.insertBefore(n,v.firstChild));let r=v.querySelector(`#${O}`);return r||(r=document.createElement("div"),r.id=O,r.className="btfw-vo-section btfw-vo-section--right",v.appendChild(r)),Array.from(v.children).forEach(o=>{o===n||o===r||r.appendChild(o)}),a.dataset.leftSection=`#${A}`,a.dataset.rightSection=`#${O}`,v.dataset.leftSection=`#${A}`,v.dataset.rightSection=`#${O}`,{left:n,right:r}}function z(){return document.querySelector("#ytapiplayer video, video")}function F(a=z()){return a?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof a.webkitShowPlaybackTargetPicker=="function":!1}function R(){if(!N)return;let a=N._btfwAirplayHandler;if(a){try{N.removeEventListener("webkitplaybacktargetavailabilitychanged",a)}catch(v){}delete N._btfwAirplayHandler}N=null}function Y(a){if(!a||typeof a.addEventListener!="function"){R();return}if(N===a)return;R();let v=A=>{let O=!A||A.availability==="available",n=e("#btfw-airplay");n&&(n.style.display=O?"":"none")};try{a.addEventListener("webkitplaybacktargetavailabilitychanged",v),a._btfwAirplayHandler=v,N=a}catch(A){}}function Q(){let a=e("#btfw-airplay");if(!a)return;let v=z();if(!F(v)){a.style.display="none",R();return}a.style.display="",Y(v)}function ie(a,v){v&&v.classList.add("btfw-vo-visible")}function G(a){if(!(a!=null&&a.right)||!(a!=null&&a.left))return;let v=[];document.querySelector("#fullscreenbtn")||v.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:ee,section:"right"}),v.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:W,section:"right"}),v.forEach(A=>{let O=document.querySelector(`#${A.id}`),n=A.section==="left"?a.left:a.right;if(O)n&&O.parentElement!==n&&n.appendChild(O);else{O=document.createElement("button"),O.id=A.id,O.className="btfw-vo-btn";let r=document.createElement("i");r.className=A.icon,O.appendChild(r),O.title=A.tooltip,O.addEventListener("click",A.action),(n||a.right).appendChild(O)}}),Q()}function K(a){let v=a==null?void 0:a.right;v&&t.forEach(A=>{let O=document.querySelector(A);if(!O)return;if(O.dataset.btfwOverlay==="1"){O.parentElement!==v&&v.appendChild(O);return}let n=document.createElement("span");n.hidden=!0,n.setAttribute("data-btfw-ph",A);try{O.insertAdjacentElement("afterend",n)}catch(r){}if(O.classList.add("btfw-vo-adopted"),O.dataset.btfwOverlay="1",O.id==="mediarefresh"){let r=O.onclick;O.onclick=o=>{o.preventDefault();let m=!!(o&&o.isTrusted);oe(()=>{if(typeof r=="function")try{return r.call(O,o),!0}catch(l){console.warn("[video-overlay] native refresh handler failed:",l)}return!1},{isUserAction:m})}}v.appendChild(O)})}function Z(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(a){console.warn("[video-overlay] Media refresh failed:",a)}return!1}function oe(a,v={}){let{isUserAction:A=!1}=v,O=Date.now();if(b&&O-b>M&&(x=g,I=0),O<u){let l=Math.ceil((u-O)/1e3);return h(A?`Refresh available in ${l}s`:`Auto refresh paused. Next attempt in ${l}s`,"warning"),!1}let n=A?f:x;if(b&&O-b<n){let l=n-(O-b),L=Math.ceil(l/1e3);return u=O+l,h(A?`Refresh available in ${L}s`:`Auto refresh paused. Next attempt in ${L}s`,"warning"),!1}if(I++,I>=10)return u=O+3e4,I=0,h("Refresh limit reached. 30s cooldown active.","error"),!1;let r=A?6e3:Math.max(12e3,x+2e3);setTimeout(()=>{I>0&&I--},r);let o=!1;if(typeof a=="function")try{o=a()===!0}catch(l){console.warn("[video-overlay] Refresh handler error:",l)}return o||(o=Z()),b=Date.now(),A?x=g:x=Math.min(S,Math.max(g,Math.round(x*(o?1.25:1.5)))),u=Math.max(u,b+(A?f:x)),!A&&o?h(`Auto refresh sent. Next attempt in ${Math.ceil(x/1e3)}s`,"info"):h(o?"Media refreshed":"Unable to refresh media",o?"success":"error"),o}function ee(){let a=e("#videowrap");a&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():a.requestFullscreen?a.requestFullscreen():a.webkitRequestFullscreen?a.webkitRequestFullscreen():a.mozRequestFullScreen&&a.mozRequestFullScreen())}function w(a,v=!0){if(!a||!F(a))return!1;if(a.setAttribute("airplay","allow"),a.setAttribute("x-webkit-airplay","allow"),v&&typeof a.webkitShowPlaybackTargetPicker=="function")try{a.webkitShowPlaybackTargetPicker()}catch(A){console.warn("[video-overlay] AirPlay picker failed:",A)}return Q(),!0}function H(){if(!(P||!window.socket)){P=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let a=z();a&&(w(a,!1),Y(a)),Q()},1e3)})}catch(a){console.warn("[video-overlay] Failed to attach AirPlay listener:",a)}}}function W(){let a=z();return F(a)?w(a)?(h("AirPlay enabled","success"),H(),!0):(h("AirPlay not available","warning"),!1):(Q(),h("AirPlay not available","warning"),!1)}function h(a,v="info"){let A=document.getElementById("btfw-notification");A||(A=document.createElement("div"),A.id="btfw-notification",A.className="btfw-notification",document.body.appendChild(A)),A.textContent=a,A.className=`btfw-notification btfw-notification--${v} btfw-notification--show`,clearTimeout(A._hideTimer),A._hideTimer=setTimeout(()=>{A.classList.remove("btfw-notification--show")},3e3)}function k(){U(),B();let a=[e("#videowrap"),e("#rightcontrols"),e("#leftcontrols"),document.body].filter(Boolean),v=new MutationObserver(()=>B());a.forEach(A=>v.observe(A,{childList:!0,subtree:!0}));try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>B(),0)})}catch(A){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",k):k(),{name:"feature:videoOverlay",toggleFullscreen:ee,enableAirplay:W}});function rt(e,t){let d=t==null?"":String(t),s=e==null?"":String(e),c=d.replace(/^\uFEFF/,"");if(!s.toLowerCase().endsWith(".srt")&&c.startsWith("WEBVTT"))return d;let i=c.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim()+`
`;return i=i.replace(/^\d+\s*$\n/gm,""),i=i.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),i=i.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+i}var it="btfw-vo-subs",at="btfw-vo-subs-input",Rt="btfw-vo-left",qt="data-btfw-local-subs",ge=null,ce=null,st=0;window.BTFW.define("feature:local-subs",[],async()=>{function e(u,b){let f=window.BTFW_notify,g=f==null?void 0:f[u];if(typeof g!="function")return;let S=document.createElement("span");S.textContent=b,g({title:"Subtitles",html:S.outerHTML,timeout:u==="error"?5200:2600})}function t(){let u=document.querySelector("#videowrap video");return u instanceof HTMLVideoElement?u:null}function d(u){let b=u.closest(".video-js"),f=b==null?void 0:b.player;if(!f&&(b!=null&&b.id)){let S=window.videojs;try{f=typeof(S==null?void 0:S.getPlayer)=="function"?S.getPlayer(b.id):null}catch(M){f=null}}let g=f;return g&&typeof g.addRemoteTextTrack=="function"&&typeof g.textTracks=="function"?g:null}function s(){if(ce){try{ce.remove()}catch(u){}ce=null}ge&&(URL.revokeObjectURL(ge),ge=null)}function c(u,b){for(let f=0;f<b.length;f++){let g=b[f];!g||g.kind!=="subtitles"&&g.kind!=="captions"||(g.mode=g===u?"showing":"disabled")}u.mode="showing"}function i(u,b){let f=u.track;c(f,b());let g=()=>{(ce==null?void 0:ce.track)===f&&(f.mode="disabled",c(f,b()))};u.readyState===2?g():u.addEventListener("load",g)}function E(u,b,f){let g=d(u);if(g){let M=g.addRemoteTextTrack({kind:"subtitles",src:b,label:f,srclang:"en",default:!0},!0);return!M||!M.track?!1:(ce={track:M.track,remove:()=>g.removeRemoteTextTrack(M)},i(M,()=>g.textTracks()),!0)}let S=document.createElement("track");return S.kind="subtitles",S.label=f,S.srclang="en",S.src=b,S.default=!0,S.setAttribute(qt,"1"),u.appendChild(S),ce={track:S.track,remove:()=>S.remove()},i(S,()=>u.textTracks),!0}async function y(u){let b=t();if(!b){e("error","Local subtitles only work with direct video files.");return}try{let f=rt(u.name,await u.text());s(),ge=URL.createObjectURL(new Blob([f],{type:"text/vtt"}));let g=u.name.replace(/\.[^.]+$/,"")||"Local";if(!E(b,ge,g))throw new Error("Player rejected the subtitle track");e("success",`Loaded ${u.name}`)}catch(f){console.error("[local-subs]",f),s(),e("error","Could not load that subtitle file.")}}function _(){let u=document.getElementById(at);u||(u=document.createElement("input"),u.type="file",u.id=at,u.accept=".vtt,.srt,text/vtt",u.hidden=!0,u.addEventListener("change",()=>{var f;let b=(f=u==null?void 0:u.files)==null?void 0:f[0];u&&(u.value=""),b&&y(b)}),document.body.appendChild(u)),u.click()}function p(){let u=document.getElementById(Rt);if(!u)return;let b=document.getElementById(it);if(!b){b=document.createElement("button"),b.id=it,b.setAttribute("type","button"),b.className="btfw-vo-btn",b.title="Load your own subtitles (.vtt/.srt)",b.setAttribute("aria-label","Load your own subtitles");let f=document.createElement("i");f.className="fa fa-cc",f.setAttribute("aria-hidden","true"),b.appendChild(f),b.addEventListener("click",g=>{g.preventDefault(),_()})}b.parentElement!==u&&u.insertBefore(b,u.firstChild),b.style.display=t()?"":"none"}function T(){window.clearTimeout(st),st=window.setTimeout(p,50)}function I(){p();let u=document.body;u&&u.dataset.btfwLocalSubsObs!=="1"&&(u.dataset.btfwLocalSubsObs="1",new MutationObserver(T).observe(u,{childList:!0,subtree:!0}));let b=window.socket;b&&typeof b.on=="function"&&b.on("changeMedia",()=>{s(),T()})}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",I,{once:!0}):I(),{name:"feature:local-subs"}});var lt="https://vidprox.movies-storage-a.workers.dev/?url=";function We(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function Se(){return Date.now()}var ct=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var t,d,s;let e=typeof window!="undefined"&&(((t=window.BTFW_CONFIG)==null?void 0:t.corsVideoProxy)||((s=(d=window.BTFW_CONFIG)==null?void 0:d.integrations)==null?void 0:s.corsVideoProxy));if(typeof e=="string"&&e.trim()){let c=e.trim();if(c.includes("?"))return c;let i=c.endsWith("/")?"":"/";return`${c}${i}?url=`}return lt},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(e){try{return new URL(lt).origin.toLowerCase()}catch(t){return""}}},_isTrusted(e){if(!e)return!1;if(String(e).includes(this.CORS_PROXY))return!0;try{let t=new URL(e),d=t.origin.toLowerCase(),s=this._getCorsProxyOrigin();return s&&d===s?!0:/^vidprox\./i.test(t.hostname)}catch(t){return!1}},_unwrapProxiedUrl(e){if(!e||!this._isTrusted(e))return e;try{return new URL(e).searchParams.get("url")||e}catch(t){return e}},_markInternalSrcSet(){this._lastInternalSrcSetAt=Se()},_isInsideInternalWindow(){return Se()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let e=this._getMediaElement();return e?e.crossOrigin==="anonymous"||e.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var t;if(this._hasAnonymousCrossOrigin())return!1;let e=this._readCurrentSrc();if(e&&!this._isTrusted(e))return!1;try{return(t=this.player)==null||t.crossOrigin("anonymous"),!0}catch(d){return!1}},_clearMediaElementForCorsSwap(){let e=this._getMediaElement();if(e)try{for(e.removeAttribute("src"),e.removeAttribute("crossorigin");e.firstChild;)e.removeChild(e.firstChild);e.load()}catch(t){}},_same(e,t){return String(e||"")===String(t||"")},_readCurrentSrc(){var e,t,d;try{let s=((t=(e=this.player)==null?void 0:e.currentSrc)==null?void 0:t.call(e))||"";if(s)return s}catch(s){}return((d=this._getMediaElement())==null?void 0:d.currentSrc)||""},_getMediaElement(){var d;let e=(d=this.player)==null?void 0:d.tech_;if(e){try{let s=typeof e.el=="function"?e.el():null;if(s instanceof HTMLMediaElement&&s.isConnected)return s}catch(s){}if(e.el_ instanceof HTMLMediaElement&&e.el_.isConnected)return e.el_}let t=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return t instanceof HTMLMediaElement&&t.isConnected?t:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(e){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(e){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(e){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(e){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(e){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(e){}this.mergerNode=null}},resetMediaBinding(){var t,d;this.disconnectChain();let e=this._getMediaElement();if(e&&this._syncFromRegistry(e)){((t=this.audioContext)==null?void 0:t.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((d=this.audioContext)==null?void 0:d.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(e){var E;let t=(E=this.player)==null?void 0:E.tech_;if(!(t!=null&&t.el_)||t.el_!==e)return null;let d=e.parentNode;if(!d)return null;let s=e.tagName.toLowerCase()==="audio"?"audio":"video",c=document.createElement(s);c.className=e.className,e.id&&(c.id=e.id),c.setAttribute("playsinline",""),c.setAttribute("webkit-playsinline",""),c.classList.contains("vjs-tech")||c.classList.add("vjs-tech");let i=e.crossOrigin||e.getAttribute("crossorigin");return i&&(c.crossOrigin=i,c.setAttribute("crossorigin",i)),d.replaceChild(c,e),t.el_=c,delete e.__btfwSourceNode,c},_syncFromRegistry(e){let t=We().get(e)||e.__btfwSourceNode||null;return t?(We().set(e,t),this.sourceNode=t,this._sourceMediaElement=e,t.context instanceof AudioContext&&t.context.state!=="closed"&&(this.audioContext=t.context),t):null},_getOrCreateSourceNode(e){let t=We(),d=t.get(e)||e.__btfwSourceNode||null;if(d)return t.set(e,d),this.sourceNode=d,this._sourceMediaElement=e,d.context instanceof AudioContext&&d.context.state!=="closed"&&(this.audioContext=d.context),d;if(this.sourceNode&&this._sourceMediaElement===e)return t.set(e,this.sourceNode),e.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let s;try{s=this.audioContext.createMediaElementSource(e)}catch(c){if(!(c instanceof DOMException)||c.name!=="InvalidStateError")throw c;let i=this._syncFromRegistry(e);if(i)return i;let E=this._swapVideoTechElement(e);if(!E)throw c;let y=this._readCurrentSrc();if(y&&this.player){this._markInternalSrcSet(),this.player.src({src:y,type:"video/mp4"});try{this.player.load()}catch(_){}}return this._getOrCreateSourceNode(E)}return t.set(e,s),e.__btfwSourceNode=s,this.sourceNode=s,this._sourceMediaElement=e,s},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(e){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(e){return!1}},_clearCrossOriginAttribute(){var t,d;let e=this._getMediaElement();if(e)try{e.crossOrigin=null,e.removeAttribute("crossorigin")}catch(s){}try{(d=(t=this.player)==null?void 0:t.crossOrigin)==null||d.call(t,null)}catch(s){}},cleanup(){this.disconnectChain();let e=this._getMediaElement();e&&(e.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let e=this._readCurrentSrc();return this.sourceNode&&e&&!this._isTrusted(e)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(e,{currentTime:t=0,wasPlaying:d=!1,clearCrossOrigin:s=!1}={}){if(!this.player||!e)return Promise.resolve(!1);let c=this.player;try{this.player.pause()}catch(i){}s&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:e,type:"video/mp4"});try{this.player.load()}catch(i){}return new Promise(i=>{let E=!1,y=()=>{if(E)return;E=!0;try{c.off("canplay",_)}catch(T){}try{c.off("loadeddata",_)}catch(T){}try{c.currentTime(t)}catch(T){}let p=d?c.play():Promise.resolve();Promise.resolve(p).catch(()=>{}).finally(()=>i(!0))},_=()=>y();try{c.one("canplay",_)}catch(p){try{c.on("canplay",_)}catch(T){}}try{c.one("loadeddata",_)}catch(p){}typeof c.ready=="function"&&c.ready(()=>{try{typeof c.readyState=="function"&&c.readyState()>=2&&y()}catch(p){}}),setTimeout(y,5e3)})},startWatchdog(){if(!this.player)return;let e=this.player;this.stopWatchdog();let t=this._getMediaElement();if(t&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(t,{attributes:!0,attributeFilter:["src","crossorigin"]});let d=new MutationObserver(()=>{this._checkAndReapply("sources")});d.observe(t,{childList:!0,subtree:!0}),this._sourceObserver=d}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([d,s])=>{e.on(d,s)})}catch(d){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var t;this._stopWatchdogInterval();let e=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(d){}try{(t=this._sourceObserver)==null||t.disconnect()}catch(d){}this._sourceObserver=null,this._mutationObserver=null}if(e&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([d,s])=>{e.off(d,s)})}catch(d){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(e){if(!this.player)return;let t=this._readCurrentSrc();if(t&&(this._lastKnownSrc=t,!this._isInsideInternalWindow())){if(this._isTrusted(t)){this.isProxied=!0,this.proxiedSrc=t,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(t)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(Se()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=Se(),this._forceProxyPreservingState(t)}}},async _forceProxyPreservingState(e){if(!this.player)return!1;let t=this.player,d=t.currentTime(),s=!t.paused();if(this._isTrusted(e))return this.isProxied=!0,this.proxiedSrc=e,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(e)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(e)||e,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(c){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(c){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(c){}return new Promise(c=>{let i=!1,E=()=>{if(!i){i=!0;try{t.off("canplay",y)}catch(_){}try{t.off("loadeddata",y)}catch(_){}try{t.currentTime(d)}catch(_){}this.isProxied=!0,s&&t.play().catch(()=>{}),c(!0)}},y=()=>E();try{t.one("canplay",y)}catch(_){try{t.on("canplay",y)}catch(p){}}try{t.one("loadeddata",y)}catch(_){}typeof t.ready=="function"&&t.ready(()=>{try{typeof t.readyState=="function"&&t.readyState()>=2&&E()}catch(_){}}),setTimeout(E,5e3)})},async ensureProxy(){if(!this.player)return!1;let e=this.player,t=this._readCurrentSrc();if(!t)return!1;if(this._isTrusted(t)){if(this.isProxied=!0,this.proxiedSrc=t,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(t)),this._hasAnonymousCrossOrigin())return!0;let d=e.currentTime(),s=!e.paused();try{e.pause()}catch(c){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),e.src({src:t,type:"video/mp4"});try{e.load()}catch(c){}return new Promise(c=>{e.ready(()=>{try{e.currentTime(d)}catch(i){}s&&e.play().catch(()=>{}),c(!0)})})}return await this._forceProxyPreservingState(t),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var t,d;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let s=this._readCurrentSrc();if(this._isTrusted(s))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let e=this._getMediaElement();if(!e)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((t=this.audioContext)==null?void 0:t.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),e.disableRemotePlayback=!0;let s=this._getOrCreateSourceNode(e),c=this.audioContext;if(!c)return!1;let i=s;if(this.normalizationEnabled){this.compressorNode=c.createDynamicsCompressor();let E=(d=this.NORM_PRESETS[this.currentNormPreset])!=null?d:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(E.threshold,c.currentTime),this.compressorNode.knee.setValueAtTime(E.knee,c.currentTime),this.compressorNode.ratio.setValueAtTime(E.ratio,c.currentTime),this.compressorNode.attack.setValueAtTime(E.attack,c.currentTime),this.compressorNode.release.setValueAtTime(E.release,c.currentTime),i.connect(this.compressorNode),i=this.compressorNode}return this.monoEnabled&&(this.splitterNode=c.createChannelSplitter(2),this.monoMixGain=c.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=c.createChannelMerger(2),i.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),i=this.mergerNode),this.boostEnabled&&(this.gainNode=c.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,i.connect(this.gainNode),i=this.gainNode),i.connect(c.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(s){return console.error("[BTFW_AUDIO] Error building audio chain:",s),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(e){return this.NORM_PRESETS[e]?(this.currentNormPreset=e,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(e){return this.BOOST_MULTIPLIER=e,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()}};(function(){"use strict";let e=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),t=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),d="--btfw-boost-anchor",s="--btfw-norm-anchor";function c(E,y,_){if(t&&_){y.style.setProperty("anchor-name",_),E.style.setProperty("position-anchor",_),E.style.setProperty("top","anchor(bottom)"),E.style.setProperty("left","anchor(left)");return}let p=y.getBoundingClientRect();E.style.left=p.left+"px",E.style.top=p.bottom+"px"}function i(E){window.BTFW&&typeof BTFW.define=="function"?E():setTimeout(()=>i(E),0)}i(function(){BTFW.define("feature:audio",[],async()=>{let E=(o,m=document)=>m.querySelector(o),y=ct,_=null,p=null,T=null,I=!1,u=!1,b=!1,f=null,g=null,S=null,M=null,x=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function P(o){_&&(o?(_.classList.add("active"),_.style.background="rgba(46, 213, 115, 0.3)",_.style.borderColor="#2ed573",_.style.color="#2ed573",_.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(_.classList.remove("active"),_.style.background="",_.style.borderColor="",_.style.color="",_.style.boxShadow=""))}function N(o,m="info"){let l=E("#btfw-audioboost-toast");l||(l=document.createElement("div"),l.id="btfw-audioboost-toast",l.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${m==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=m==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function U(){if(await y.enableBoost()){I=!0;let m=Math.round(y.BOOST_MULTIPLIER*100);N(`Boosted by ${m}%`,"success"),P(!0)}else{let m=y._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";N(m,"error")}}async function $(){await y.disableBoost(),I=!1,P(!1)}function B(o){p&&(o?(p.classList.add("active"),p.style.background="rgba(52, 152, 219, 0.3)",p.style.borderColor="#3498db",p.style.color="#3498db",p.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(p.classList.remove("active"),p.style.background="",p.style.borderColor="",p.style.color="",p.style.boxShadow=""))}function V(o,m="info"){let l=E("#btfw-audionorm-toast");l||(l=document.createElement("div"),l.id="btfw-audionorm-toast",l.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${m==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=m==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function X(){if(await y.enableNormalization())u=!0,V("Normalization enabled","success"),B(!0);else{let m=y._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";V(m,"error")}}async function z(){await y.disableNormalization(),u=!1,B(!1)}function F(o){T&&(o?(T.classList.add("active"),T.style.background="rgba(155, 89, 182, 0.3)",T.style.borderColor="#9b59b6",T.style.color="#9b59b6",T.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(T.classList.remove("active"),T.style.background="",T.style.borderColor="",T.style.color="",T.style.boxShadow=""))}function R(o,m="info"){let l=E("#btfw-mono-toast");l||(l=document.createElement("div"),l.id="btfw-mono-toast",l.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${m==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(l)),l.textContent=o,l.style.background=m==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",l.style.opacity="1",setTimeout(()=>{l.style.opacity="0"},2e3)}async function Y(){if(await y.enableMono())b=!0,R("Stereo audio enabled","success"),F(!0);else{let m=y._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";R(m,"error")}}async function Q(){await y.disableMono(),b=!1,F(!1)}function ie(){let o=document.createElement("button");o.id="btfw-vo-audioboost",o.className="btn btn-sm btn-default btfw-vo-adopted";let m=Math.round(y.BOOST_MULTIPLIER*100);o.title=`Toggle Audio Boost (${m}%)`,o.setAttribute("data-btfw-overlay","1");let l=document.createElement("i");return l.className="fa fa-bullhorn",o.appendChild(l),o.addEventListener("click",()=>{y.boostEnabled?$():U()}),o.addEventListener("mouseenter",()=>{S&&(clearTimeout(S),S=null),oe()}),o.addEventListener("mouseleave",()=>{S=setTimeout(()=>ee(),150)}),o}function G(){let o=document.createElement("button");o.id="btfw-vo-audionorm",o.className="btn btn-sm btn-default btfw-vo-adopted";let m=y.NORM_PRESETS[y.currentNormPreset].label;o.title=`Toggle Audio Normalization (${m})`,o.setAttribute("data-btfw-overlay","1");let l=document.createElement("i");return l.className="fa fa-sliders",o.appendChild(l),o.addEventListener("click",()=>{y.normalizationEnabled?z():X()}),o.addEventListener("mouseenter",()=>{M&&(clearTimeout(M),M=null),W()}),o.addEventListener("mouseleave",()=>{M=setTimeout(()=>h(),150)}),o}function K(){let o=document.createElement("button");o.id="btfw-vo-mono",o.className="btn btn-sm btn-default btfw-vo-adopted",o.title="Toggle Mono Audio (mix both channels to stereo)",o.setAttribute("data-btfw-overlay","1");let m=document.createElement("i");return m.className="fa fa-headphones",o.appendChild(m),o.addEventListener("click",()=>{y.monoEnabled?Q():Y()}),o}function Z(){if(f)return f;let o=document.createElement("div");return o.id="btfw-boost-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,x.forEach(m=>{let l=document.createElement("button");l.className="btfw-context-item",l.textContent=m.label,l.style.cssText=`
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
          `,y.BOOST_MULTIPLIER===m.multiplier&&(l.style.background="rgba(46, 213, 115, 0.2)",l.style.color="#2ed573"),l.addEventListener("mouseenter",()=>{y.BOOST_MULTIPLIER!==m.multiplier&&(l.style.background="rgba(109, 77, 246, 0.2)")}),l.addEventListener("mouseleave",()=>{y.BOOST_MULTIPLIER!==m.multiplier&&(l.style.background="transparent")}),l.addEventListener("click",async()=>{if(await y.setBoostMultiplier(m.multiplier),w(),_){let L=Math.round(m.multiplier*100);_.title=`Toggle Audio Boost (${L}%)`}y.boostEnabled&&N(`Boost set to ${m.label}`,"success")}),o.appendChild(l)}),o.addEventListener("mouseenter",()=>{S&&(clearTimeout(S),S=null)}),o.addEventListener("mouseleave",()=>{S=setTimeout(()=>ee(),100)}),document.body.appendChild(o),f=o,o}function oe(){if(!_)return;let o=Z();c(o,_,d),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function ee(){f&&(e?f.matches(":popover-open")&&f.hidePopover():f.style.display="none")}function w(){if(!f)return;f.querySelectorAll(".btfw-context-item").forEach((m,l)=>{let L=x[l];y.BOOST_MULTIPLIER===L.multiplier?(m.style.background="rgba(46, 213, 115, 0.2)",m.style.color="#2ed573"):(m.style.background="transparent",m.style.color="#e0e0e0")})}function H(){if(g)return g;let o=document.createElement("div");return o.id="btfw-norm-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,Object.keys(y.NORM_PRESETS).forEach(m=>{let l=y.NORM_PRESETS[m],L=document.createElement("button");L.className="btfw-context-item",L.textContent=l.label,L.style.cssText=`
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
          `,y.currentNormPreset===m&&(L.style.background="rgba(52, 152, 219, 0.2)",L.style.color="#3498db"),L.addEventListener("mouseenter",()=>{y.currentNormPreset!==m&&(L.style.background="rgba(109, 77, 246, 0.2)")}),L.addEventListener("mouseleave",()=>{y.currentNormPreset!==m&&(L.style.background="transparent")}),L.addEventListener("click",async()=>{await y.setNormPreset(m),k(),p&&(p.title=`Toggle Audio Normalization (${l.label})`),y.normalizationEnabled&&V(`Preset: ${l.label}`,"success")}),o.appendChild(L)}),o.addEventListener("mouseenter",()=>{M&&(clearTimeout(M),M=null)}),o.addEventListener("mouseleave",()=>{M=setTimeout(()=>h(),100)}),document.body.appendChild(o),g=o,o}function W(){if(!p)return;let o=H();c(o,p,s),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function h(){g&&(e?g.matches(":popover-open")&&g.hidePopover():g.style.display="none")}function k(){if(!g)return;let o=g.querySelectorAll(".btfw-context-item");Object.keys(y.NORM_PRESETS).forEach((m,l)=>{let L=o[l];y.currentNormPreset===m?(L.style.background="rgba(52, 152, 219, 0.2)",L.style.color="#3498db"):(L.style.background="transparent",L.style.color="#e0e0e0")})}function a(){let o=E("#btfw-vo-left");if(!o)return!1;let m=E("#btfw-vo-audioboost");m&&m.remove();let l=E("#btfw-vo-audionorm");l&&l.remove();let L=E("#btfw-vo-mono");return L&&L.remove(),_=ie(),p=G(),T=K(),o.appendChild(_),o.appendChild(p),o.appendChild(T),!0}function v(o,m=20){let l=m*500;pe(()=>E("#btfw-vo-left")?!0:null,{timeoutMs:l}).then(()=>{a(),o()}).catch(()=>{a()&&o()})}function A(){Promise.all([pe(()=>typeof videojs!="undefined"?videojs:null),fe("#ytapiplayer")]).then(([o])=>{y.player=o("ytapiplayer"),y.originalSrc=y._readCurrentSrc(),y.startWatchdog()}).catch(()=>{})}function O(){setTimeout(()=>{y.resetMediaBinding(),y.boostEnabled=!1,y.normalizationEnabled=!1,y.monoEnabled=!1,y.isProxied=!1,P(!1),B(!1),F(!1),A(),I&&setTimeout(()=>{U()},1200),u&&setTimeout(()=>{X()},1200),b&&setTimeout(()=>{Y()},1200)},600)}function n(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>y._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>y._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",O))}function r(){v(()=>{A()}),n()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r(),{name:"feature:audio",activate:U,deactivate:$,isActive:()=>y.boostEnabled,activateNormalization:X,deactivateNormalization:z,isNormalizationActive:()=>y.normalizationEnabled,activateMono:Y,deactivateMono:Q,isMonoActive:()=>y.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async E=>E.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async E=>E.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async E=>E.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async E=>E.init("feature:audio"))})})();var un=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),ze=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",movieInfoChanged:"btfw:movieInfo:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),dt=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",layoutSide:"btfw:layout:chatSide",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors",movieInfoEnabled:"btfw:movieInfo:enabled"});var Ht="1";function ut(e=localStorage){try{return e.getItem(dt.movieInfoEnabled)===Ht}catch(t){return!1}}function ft(e,t=document){let d=s=>{let c=s.detail;e((c==null?void 0:c.enabled)===!0)};return t.addEventListener(ze.movieInfoChanged,d),()=>t.removeEventListener(ze.movieInfoChanged,d)}BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:e})=>{let t=await e("util:tmdb-proxy"),d="movie-info",s={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},c="btfw-movie-info-style",i={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},E=0,y=!1;function _(h){typeof h=="function"&&i.cleanup.push(h)}function p(){for(;i.cleanup.length;){let h=i.cleanup.pop();try{h()}catch(k){}}i.header&&(i.header.remove(),i.header=null)}function T(){i.hideTimer&&(clearTimeout(i.hideTimer),i.hideTimer=null),i.initTimer&&(clearTimeout(i.initTimer),i.initTimer=null),i.socketRetryTimer&&(clearTimeout(i.socketRetryTimer),i.socketRetryTimer=null),E=0,i.currentTitle="",i.isInitialized=!1,p()}let I=()=>ut();function u(){y||(y=!0,ft(()=>g()),document.addEventListener("btfw:ready",()=>g()))}function b(h=0){i.initTimer&&(clearTimeout(i.initTimer),i.initTimer=null),i.initTimer=window.setTimeout(()=>{i.initTimer=null,I()&&f()},Math.max(0,h))}function f(){if(i.isInitialized)return;let h=document.querySelector(s.TOPBAR_SELECTOR);if(!h){b(500);return}try{S(h),H(),x(),i.isInitialized=!0,setTimeout(()=>{z(),F()},120)}catch(k){b(800)}}function g(){I()?i.isInitialized?(z(),setTimeout(F,80)):b(0):T()}function S(h){if(!h&&(h=document.querySelector(s.TOPBAR_SELECTOR),!h))throw new Error("Chat topbar not found");let k=document.getElementById(s.CONTAINER_ID);k&&k.remove();let a=document.createElement("div");a.id=s.CONTAINER_ID,a.className="btfw-movie-header hide",a.dataset.module=d,h.insertAdjacentElement("afterend",a),i.header=a}function M(){try{return window.socket||window.SOCKET||null}catch(h){return null}}function x(){P(),$();let h=w(z,250);window.addEventListener("resize",h),_(()=>window.removeEventListener("resize",h))}function P(){N(),U()}function N(){let h=document.querySelector(s.TITLE_SELECTOR);if(h){let k=()=>V(),a=()=>X();h.addEventListener("mouseenter",k),h.addEventListener("mouseleave",a),_(()=>{h.removeEventListener("mouseenter",k),h.removeEventListener("mouseleave",a)})}else if(typeof MutationObserver=="function"){let k=new MutationObserver(()=>{document.querySelector(s.TITLE_SELECTOR)&&(k.disconnect(),N())});k.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),_(()=>{try{k.disconnect()}catch(a){}})}}function U(){let h=i.header;if(!h)return;let k=()=>B(),a=()=>X();h.addEventListener("mouseenter",k),h.addEventListener("mouseleave",a),_(()=>{h.removeEventListener("mouseenter",k),h.removeEventListener("mouseleave",a)})}function $(){let h=M();if(h&&typeof h.on=="function"){h.on("changeMedia",F),_(()=>{var k,a;try{(k=h.off)==null||k.call(h,"changeMedia",F)}catch(v){try{(a=h.removeListener)==null||a.call(h,"changeMedia",F)}catch(A){}}});return}pe(()=>{if(!I())return null;let k=M();return k&&typeof k.on=="function"?k:null},{timeoutMs:1e4}).then(k=>{i.socketRetryTimer=null,k.on("changeMedia",F),_(()=>{var a,v;try{(a=k.off)==null||a.call(k,"changeMedia",F)}catch(A){try{(v=k.removeListener)==null||v.call(k,"changeMedia",F)}catch(O){}}})}).catch(()=>{i.socketRetryTimer=null}),_(()=>{i.socketRetryTimer&&(clearTimeout(i.socketRetryTimer),i.socketRetryTimer=null)})}function B(){i.hideTimer&&(clearTimeout(i.hideTimer),i.hideTimer=null)}function V(){B(),i.header&&(i.header.classList.remove("hide"),i.header.classList.add("show"))}function X(){B(),i.hideTimer=window.setTimeout(()=>{i.header&&(i.header.classList.remove("show"),i.header.classList.add("hide"),setTimeout(()=>{i.header&&i.header.classList.contains("hide")&&i.header.classList.remove("hide")},320))},300)}function z(){if(!i.header)return;let h=window.innerWidth<=768;i.header.classList.toggle("btfw-mobile",h)}async function F(){var A;if(!i.isInitialized)return;let h=document.querySelector(s.TITLE_SELECTOR),k=i.header;if(!h||!k)return;let a=((A=h.textContent)==null?void 0:A.trim())||"";if(!a){i.currentTitle="",G();return}if(a===i.currentTitle)return;i.currentTitle=a;let v=++E;Q();try{let O=await Y(a);if(v!==E)return;Z(O)}catch(O){if(v!==E)return;t.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ie()}}function R(h){let k=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],a=h;return k.forEach(v=>{let A=new RegExp(`\\b${v}\\b`,"gi");a=a.replace(A,"")}),a.replace(/\s{2,}/g," ").trim()}async function Y(h){var n;if(!t.isAvailable())throw new Error(t.MISSING_PROXY_MSG);let k=h.match(/(.+)\s*\((\d{4})\)/),a=k?k[1].trim():h,v=k?k[2]:"";v||(k=h.match(/(.+?)\s+(\d{4})\s*$/),k&&(a=k[1].trim(),v=k[2]));let A=R(a),O=await t.tmdbFetch("search/movie",{query:A,year:v});if(((n=O==null?void 0:O.results)==null?void 0:n.length)>0){let r=O.results[0];return{title:h,backdrop:r.backdrop_path?`https://image.tmdb.org/t/p/w1280${r.backdrop_path}`:null,poster:r.poster_path?`https://image.tmdb.org/t/p/w500${r.poster_path}`:null,summary:r.overview||"",rating:r.vote_average||0,releaseDate:r.release_date||"",voteCount:r.vote_count||0}}return{title:h,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function Q(){if(!i.header)return;K();let h=document.createElement("div");h.className="btfw-movie-content";let k=document.createElement("div");k.className="btfw-movie-loading";let a=document.createElement("i");a.className="fa fa-spinner fa-spin";let v=document.createElement("p");v.textContent="Loading movie information...",k.append(a,v),h.appendChild(k),i.header.replaceChildren(h)}function ie(){if(!i.header)return;K();let h=document.createElement("div");h.className="btfw-movie-content";let k=document.createElement("div");k.className="btfw-movie-error";let a=document.createElement("i");a.className="fa fa-exclamation-triangle";let v=document.createElement("p");v.textContent="Unable to fetch movie information";let A=document.createElement("small");A.textContent="Check TMDB API key in Theme Settings",k.append(a,v,A),h.appendChild(k),i.header.replaceChildren(h)}function G(){if(!i.header)return;K();let h=document.createElement("div");h.className="btfw-movie-content";let k=document.createElement("p");k.textContent="No movie information available",h.appendChild(k),i.header.replaceChildren(h)}function K(){i.header&&(i.header.style.backgroundImage="",i.header.style.backgroundColor="")}function Z(h){if(!i.header)return;i.header.replaceChildren(),s.ENABLE_BACKDROP&&h.backdrop?(i.header.style.backgroundImage=`url(${h.backdrop})`,i.header.style.backgroundSize="cover",i.header.style.backgroundPosition="center"):K();let k=document.createElement("div");k.className="btfw-movie-overlay",i.header.appendChild(k);let a=document.createElement("div");if(a.className="btfw-movie-content",i.header.appendChild(a),h.poster){let O=document.createElement("img");O.src=h.poster,O.alt=`${h.title} Poster`,O.className="btfw-movie-poster",a.appendChild(O)}let v=document.createElement("div");v.className="btfw-movie-details",a.appendChild(v);let A=document.createElement("h2");if(A.textContent=h.title,A.className="btfw-movie-title",v.appendChild(A),s.SHOW_SUMMARY&&h.summary){let O=document.createElement("p");O.textContent=h.summary,O.className="btfw-movie-summary",v.appendChild(O)}if(s.ENABLE_RATING&&h.rating>0){let O=oe(h.rating,h.voteCount);a.appendChild(O)}}function oe(h,k){let a=document.createElement("div");a.className="btfw-movie-rating";let v=Math.round(h*10),A=ee(v),O="http://www.w3.org/2000/svg",n=document.createElementNS(O,"svg");n.setAttribute("width","60"),n.setAttribute("height","60"),n.setAttribute("viewBox","0 0 60 60");let r=25,o=2*Math.PI*r,m=o-h/10*o,l=document.createElementNS(O,"circle");l.setAttribute("cx","30"),l.setAttribute("cy","30"),l.setAttribute("r",r.toString()),l.setAttribute("stroke","#2a2a2a"),l.setAttribute("stroke-width","4"),l.setAttribute("fill","#1a1a1a"),n.appendChild(l);let L=document.createElementNS(O,"circle");L.setAttribute("cx","30"),L.setAttribute("cy","30"),L.setAttribute("r",r.toString()),L.setAttribute("stroke",A),L.setAttribute("stroke-width","3"),L.setAttribute("fill","none"),L.setAttribute("stroke-dasharray",o.toString()),L.setAttribute("stroke-dashoffset",m.toString()),L.setAttribute("transform","rotate(-90 30 30)"),L.setAttribute("stroke-linecap","round"),n.appendChild(L);let q=document.createElementNS(O,"text");if(q.setAttribute("x","50%"),q.setAttribute("y","50%"),q.setAttribute("text-anchor","middle"),q.setAttribute("dominant-baseline","central"),q.setAttribute("fill","#fff"),q.setAttribute("font-size","10"),q.setAttribute("font-weight","bold"),q.textContent=`${v}%`,n.appendChild(q),a.appendChild(n),k>0){let C=document.createElement("div");C.className="btfw-movie-votes",C.textContent=`${k.toLocaleString()} votes`,a.appendChild(C)}return a}function ee(h){let k=Math.max(0,Math.min(h,100));return k>=70?"#4caf50":k>=50?"#ff9800":"#f44336"}function w(h,k){let a=null;return function(...A){a&&clearTimeout(a),a=setTimeout(()=>{a=null,h(...A)},k)}}function H(){if(document.getElementById(c))return;let h=`
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
    `,k=document.createElement("style");k.id=c,k.textContent=h,document.head.appendChild(k)}function W(){u(),g()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W,{once:!0}):W(),{name:"feature:movie-info",refresh:g,cleanup:T}});BTFW.define("feature:monkeyPaw",[],async()=>{let e="btfw-monkey-paw-styles",t="btfw-monkey-paw-overlay",d="/src/assets/monkey-paw/paw.svg",s={"f-pinky":{root:"rotate(-8deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-ring":{root:"rotate(-4deg) scaleY(0.28)",tip:"rotate(0deg) scaleY(0)"},"f-index":{root:"rotate(5deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-thumb":{root:"rotate(80deg) scaleY(1)",tip:"rotate(70deg) scaleY(1)"}},c={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},i={"f-pinky":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-ring":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-index":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-thumb":{root:"rotate(-18deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"}},E=null,y=null,_=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function p(P){let N=String(P||"").trim();return/^<svg[\s>]/i.test(N)?!_.test(N):!1}function T(P){return new Promise(N=>setTimeout(N,P))}function I(){try{let P=typeof window!="undefined"?window.BTFW:null;return P&&(P.BASE||P.DEV_CDN)||""}catch(P){return""}}function u(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(P){return!1}}function b(){if(typeof document=="undefined"||document.getElementById(e))return;let P=document.createElement("style");P.id=e,P.textContent=`
      #${t} {
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

      #${t}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${t}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${t}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${t} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${t} .btfw-monkey-paw-title {
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

      #${t} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${t} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${t} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${t} .f-tip {
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

      #${t} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${t} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${t} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${t} .f-root,
        #${t} .f-tip,
        #${t} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(P)}async function f(){if(E)return E;let N=`${I()}${d}`,U=await fetch(N,{credentials:"omit"});if(!U.ok)throw new Error(`Monkey paw SVG failed to load (${U.status})`);let $=await U.text();if(!p($))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return E=$,E}function g(P){Object.entries(i).forEach(([N,U])=>{let $=P.querySelector(`#${N}`),B=P.querySelector(`#${N}-tip`);$&&($.style.transform=U.root),B&&(B.style.transform=U.tip)})}function S(P){Object.entries(s).forEach(([N,U])=>{window.setTimeout(()=>{let $=P.querySelector(`#${N}`),B=P.querySelector(`#${N}-tip`);$&&($.style.transform=U.root),B&&window.setTimeout(()=>{B.style.transform=U.tip},120)},c[N])})}function M(P){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${P}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function x(P={}){if(y)return y;if(typeof document!="undefined")return y=(async()=>{var V,X;if(b(),u()){await T((V=P.reducedMotionMs)!=null?V:450);return}let N=document.getElementById(t);N||(N=document.createElement("div"),N.id=t,document.body.appendChild(N));let U;try{U=await f()}catch(z){console.warn("[monkey-paw] SVG load failed:",z),await T(300);return}N.innerHTML=M(U),g(N);let $=N.querySelector("#paw"),B=N.querySelector("#btfw-monkey-paw-msg");N.classList.remove("is-cursed"),B==null||B.classList.remove("is-visible"),requestAnimationFrame(()=>N.classList.add("is-active")),S(N),await T(980),$==null||$.classList.add("btfw-monkey-paw-shaking"),await T(720),$==null||$.classList.remove("btfw-monkey-paw-shaking"),N.classList.add("is-cursed"),B==null||B.classList.add("is-visible"),await T((X=P.holdMs)!=null?X:1100),N.classList.remove("is-active"),await T(320),N.remove()})().finally(()=>{y=null}),y}return{name:"feature:monkeyPaw",play:x}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:e})=>{let t=await e("util:tmdb-proxy"),d=await e("feature:monkeyPaw"),s=(w,H=document)=>H.querySelector(w),c=(w,H=document)=>Array.from(H.querySelectorAll(w)),i=null,E=null,y=null,_=null,p={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},T=null,I=null,u="[movie-suggestion]";function b(...w){console.log(u,...w)}function f(...w){console.error(u,...w)}function g(w){var H;try{if((H=window.socket)!=null&&H.emit)return window.socket.emit("chatMsg",{msg:w}),!0}catch(W){}return!1}async function S(w,H={}){return t.workerFetch(w,H)}function M(){if(document.getElementById("btfw-movie-suggest-styles"))return;let w=document.createElement("style");w.id="btfw-movie-suggest-styles",w.textContent=`
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
    `,document.head.appendChild(w)}let x=(CLIENT==null?void 0:CLIENT.rank)||0;function P(){let w=s("a[href*='donate'], #donate-btn, .donate-btn");if(w){let W=w.closest("ul");if(W)return{ul:W,insertAfter:w.parentElement}}let H=s("#btfw-theme-btn-nav");if(H){let W=H.closest("ul");if(W)return{ul:W,insertAfter:null}}return{ul:s(".navbar .nav.navbar-nav")||s(".navbar-nav")||s(".btfw-navbar ul")||s(".navbar ul"),insertAfter:null}}function N(){if(s("#btfw-movie-suggest-btn"))return!0;let w=P();if(!w.ul)return!1;let H=document.createElement("li"),W=document.createElement("a");return W.href="javascript:void(0)",W.className="btfw-nav-pill",W.id="btfw-movie-suggest-btn",W.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,H.appendChild(W),w.insertAfter?w.insertAfter.after(H):w.ul.insertBefore(H,w.ul.firstChild),W.addEventListener("click",G),!0}function U(){var h,k,a,v,A,O;if(s("#btfw-movie-suggest-modal"))return;let w=document.createElement("div");w.id="btfw-movie-suggest-modal",w.className="modal",w.innerHTML=`
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
    `,document.body.appendChild(w);let H=s(".modal-background",w),W=s(".delete",w);if(H.addEventListener("click",K),W.addEventListener("click",K),(h=s("#btfw-movie-prev",w))==null||h.addEventListener("click",()=>{p.page>1&&(p.page-=1,R())}),(k=s("#btfw-movie-next",w))==null||k.addEventListener("click",()=>{p.page<p.totalPages&&(p.page+=1,R())}),x===0){let n=s("#btfw-movie-search",w);n.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),n.blur()})}else{let n,r=s("#btfw-movie-search",w);r.addEventListener("input",()=>{clearTimeout(n),p.query=r.value.trim(),p.page=1,n=setTimeout(()=>R(),400)}),(a=s("#btfw-movie-sort",w))==null||a.addEventListener("change",o=>{p.sortBy=o.target.value,p.page=1,R()}),(v=s("#btfw-movie-genre",w))==null||v.addEventListener("change",o=>{p.genreId=o.target.value,p.page=1,R()}),(A=s("#btfw-movie-year",w))==null||A.addEventListener("change",o=>{p.year=o.target.value.trim(),p.page=1,R()}),(O=s("#btfw-movie-rating",w))==null||O.addEventListener("change",o=>{p.minRating=o.target.value.trim(),p.page=1,R()})}}function $(){if(s("#btfw-movie-confirm-modal"))return;let w=document.createElement("div");w.id="btfw-movie-confirm-modal",w.className="modal",w.innerHTML=`
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
    `,document.body.appendChild(w);let H=s(".modal-background",w),W=s(".delete",w),h=s("#btfw-movie-cancel",w),k=s("#btfw-movie-confirm",w),a=()=>ie();H.addEventListener("click",a),W.addEventListener("click",a),h.addEventListener("click",a),k.addEventListener("click",oe)}async function B(){if(T&&I)return;let[w,H]=await Promise.all([S("/api/meta"),S("/api/genres")]);T=w,I=H;let W=s("#btfw-movie-suggest-modal");if(!W)return;let h=s("#btfw-movie-sort",W);if(h&&h.options.length===0){for(let a of w.sortOptions||[]){let v=document.createElement("option");v.value=a.value,v.textContent=a.label,h.appendChild(v)}h.value=p.sortBy}let k=s("#btfw-movie-genre",W);if(k&&k.options.length<=1)for(let a of H.genres||[]){let v=document.createElement("option");v.value=String(a.id),v.textContent=a.name,k.appendChild(v)}}function V(){let w={page:p.page,sort_by:p.sortBy};return p.query?(w.query=p.query,p.year&&(w.primary_release_year=p.year,w.year=p.year)):(p.genreId&&(w.with_genres=p.genreId),p.year&&(w.primary_release_year=p.year),p.minRating&&(w["vote_average.gte"]=p.minRating)),w}function X(w){return!w||w==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${w}`}function z(){let w=s("#btfw-movie-suggest-modal");if(!w)return;let H=s("#btfw-movie-prev",w),W=s("#btfw-movie-next",w),h=s("#btfw-movie-page-label",w);h&&(h.textContent=`Page ${p.page} of ${p.totalPages}`),H&&(H.disabled=p.page<=1||p.loading),W&&(W.disabled=p.page>=p.totalPages||p.loading)}function F(w){let H=s("#btfw-movie-suggest-modal");if(!H)return;let W=s(".btfw-movie-results",H);if(!w.length){W.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}W.innerHTML=w.map(h=>`
      <div class="movie-result"
           data-id="${re(h.id)}"
           data-title="${re(h.title)}"
           data-poster="${re(h.posterPath||"")}"
           data-year="${re(h.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${re(X(h.posterPath))}" alt="${re(h.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${re(h.title)}</div>
          <small style="opacity:0.7;">${re(h.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),c(".movie-result",W).forEach(h=>{h.addEventListener("click",()=>{i=h.dataset.id,E=h.dataset.title,y=h.dataset.poster,_=h.dataset.year||null;let k=s("#btfw-movie-confirm-modal");if(!k)return;let a=_?` (${_})`:"";s("#btfw-confirm-movie-title",k).textContent=`${E}${a}`,Q()})})}async function R(){let w=s("#btfw-movie-suggest-modal");if(!w||p.loading)return;p.loading=!0,z();let H=s(".btfw-movie-results",w);H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await B();let W=await S("/api/search",{params:V()});p.totalPages=Math.max(1,W.totalPages||1),F(W.results||[]),b("runSearch",{page:p.page,totalPages:p.totalPages,count:(W.results||[]).length})}catch(W){f("runSearch failed:",W),H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{p.loading=!1,z()}}async function Y(){let w=s("#btfw-movie-history");if(w){w.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let W=(await S("/api/history",{params:{page:1,limit:10}})).results||[];if(!W.length){w.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}w.innerHTML=W.map(h=>{let k=h.releaseYear?` (${re(h.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${re(X(h.posterPath).replace("w154","w92"))}" alt="${re(h.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${re(h.movieTitle)}${k}</div>
              <div class="history-item__meta">Requested by ${re(h.username)}</div>
            </div>
          </div>
        `}).join("")}catch(H){f("loadHistory failed:",H),w.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function Q(){let w=s("#btfw-movie-suggest-modal"),H=s("#btfw-movie-confirm-modal");H&&(w&&w.classList.add("btfw-movie-suggest-pending"),H.classList.add("is-active"))}function ie(){let w=s("#btfw-movie-suggest-modal"),H=s("#btfw-movie-confirm-modal");w&&w.classList.remove("btfw-movie-suggest-pending"),H&&H.classList.remove("is-active")}async function G(){let w=s("#btfw-movie-suggest-modal");if(w){b("openModal",{userRank:x}),w.classList.remove("btfw-movie-suggest-pending"),w.classList.add("is-active");try{await B(),await Promise.all([R(),Y()])}catch(H){f("openModal bootstrap failed:",H)}}}function K(){let w=s("#btfw-movie-suggest-modal");w&&(ie(),b("closeModal"),w.classList.remove("is-active"),s("#btfw-movie-search",w).value="",s(".btfw-movie-results",w).innerHTML="",p.query="",p.page=1,p.totalPages=1,i=null,E=null,y=null,_=null)}function Z(w,H,W){let h=W?` (${W})`:"";return`\u{1F3AC} Movie request: ${H}${h} \u2014 suggested by ${w}`}async function oe(){if(!i||!E)return;let w=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";b("confirmSuggestion",{movieId:i,movieTitle:E}),ie();try{await d.play(),await S("/api/suggestions",{method:"POST",body:{movieId:Number(i),movieTitle:E,username:w,posterPath:y||null,releaseYear:_||null}}),g(Z(w,E,_)),await Y(),K()}catch(H){f("confirmSuggestion failed:",H),alert("Could not save your movie request. Please try again.")}}function ee(){b("boot: start",{workerBase:t.getWorkerBase()}),M(),U(),$(),fe(".navbar, .navbar-nav, #nav-collapsible",{timeoutMs:5e3}).catch(()=>{}).then(()=>{N()?b("Button added successfully"):console.warn(u,"Failed to add nav button")})}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ee,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ee,200)}):setTimeout(ee,200),{name:"ext:movie-suggestion",open:G,close:K,getWorkerBase:t.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async e=>e.init("ext:movie-suggestion"));})();
