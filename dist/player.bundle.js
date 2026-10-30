/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{var ot=Object.defineProperty;var it=(e,o)=>{for(var u in o)ot(e,u,{get:o[u],enumerable:!0})};BTFW.define("feature:player",[],async()=>{var M;let e=(m,T=document)=>T.querySelector(m),o=(m,T=document)=>Array.from(T.querySelectorAll(m)),u=((M=window.BTFW)==null?void 0:M.BASE)||"";function l(m){if(!m)return;let T=m.startsWith("http")?m:`${u}/${m.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(S=>S.getAttribute("href")===T||S.getAttribute("href")===m))return;let v=document.createElement("link");v.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[m]&&(v.integrity=window.BTFW.SRI[m],v.crossOrigin="anonymous"),v.href=T,document.head.appendChild(v)}function f(){let m=e("#videowrap");if(!m)return;l("dist/css/player.css"),m.classList.add("btfw-player-wrap");let T=m.querySelector("#controlsrow, .player-controls");T&&T.classList.add("btfw-player-controls"),a()}function a(){if(window.videojs)try{let m=document.querySelector(".video-js");m&&!m.classList.contains("btfw-vjs-enhanced")&&m.classList.add("btfw-vjs-enhanced")}catch(m){}}function w(){let m=e("#videowrap");if(!m)return;new MutationObserver(()=>{a()}).observe(m,{childList:!0,subtree:!0})}function p(){f(),w();try{let m=window.socket;m&&typeof m.on=="function"&&m.on("changeMedia",()=>{setTimeout(f,100)})}catch(m){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p(),{name:"feature:player",applyPlayerLayoutEnhancements:f}});var Me={};it(Me,{addMediaButtonHtml:()=>lt,addMediaPanelHtml:()=>st,panelUndockIconHtml:()=>Te,panelsMenuButtonHtml:()=>_e,playlistAddFormHtml:()=>Le,playlistSearchButtonHtml:()=>ct,stackGroupHeaderHtml:()=>ke});function rt(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function at(e,...o){var l;let u="";for(let f=0;f<e.length;f+=1)u+=(l=e[f])!=null?l:"",f<o.length&&(u+=rt(o[f]));return u}function st(){return`
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
      `}function ke(e){return at`
      <span class="btfw-stack-item__title">${e}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `}function _e(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function Te(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function Le(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function lt(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}function ct(){return'<i class="fa fa-search" aria-hidden="true"></i>'}function de(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function se(e,o){return e!=null?!!e:!!o}var ye=class extends Error{constructor(o){super(o),this.name="TimeoutError"}};function ze(){let e=globalThis.MutationObserver;return typeof e=="function"?e:null}function Ue(){var o,u;let e=globalThis;return{setTimeoutFn:(o=e.setTimeout)!=null?o:null,clearTimeoutFn:(u=e.clearTimeout)!=null?u:null}}function dt(e,o){if(o)return o;let u=e!=null?e:globalThis.document;return u&&typeof u.querySelector=="function"?l=>u.querySelector(l):()=>null}function Ge(e){if(e)try{e.disconnect()}catch(o){}}function ue(e,o={}){let{root:u=null,timeoutMs:l,includeExisting:f=!0,observerClass:a}=o;return new Promise((w,p)=>{var U,F;let M=a!==void 0?a:ze(),m=dt(u,o.querySelector),T=Ue(),P=(U=o.setTimeoutFn)!=null?U:T.setTimeoutFn,v=(F=o.clearTimeoutFn)!=null?F:T.clearTimeoutFn,S=null,y=null,_=!1,x=I=>{_||(_=!0,Ge(S),S=null,y!==null&&v&&(v(y),y=null),I())},A=I=>{x(()=>w(I))},E=I=>{x(()=>p(I))},L=()=>{typeof l!="number"||!P||!v||(y=P(()=>{E(new ye(`waitForElement: "${e}" not found within ${l}ms`))},l))};if(f){let I=m(e);if(I){A(I);return}}if(!M){E(new Error("waitForElement: no MutationObserver implementation available"));return}S=new M(()=>{let I=m(e);I&&A(I)});let O=u!=null?u:globalThis.document;if(!O){E(new Error("waitForElement: no root available to observe"));return}S.observe(O,{childList:!0,subtree:!0}),L()})}function me(e,o={}){let{root:u=null,timeoutMs:l,observerClass:f}=o;return new Promise((a,w)=>{var E,L;let p=f!==void 0?f:ze(),M=Ue(),m=(E=o.setTimeoutFn)!=null?E:M.setTimeoutFn,T=(L=o.clearTimeoutFn)!=null?L:M.clearTimeoutFn,P=null,v=null,S=!1,y=O=>{S||(S=!0,Ge(P),P=null,v!==null&&T&&(T(v),v=null),O())},_=()=>{typeof l!="number"||!m||!T||(v=m(()=>{y(()=>w(new ye("waitForCondition: condition not met within timeout")))},l))},x=e();if(x){y(()=>a(x));return}if(!p){y(()=>w(new Error("waitForCondition: no MutationObserver implementation available")));return}let A=u!=null?u:globalThis.document;if(!A){y(()=>w(new Error("waitForCondition: no root available to observe")));return}P=new p(()=>{let O=e();O&&y(()=>a(O))}),P.observe(A,{childList:!0,subtree:!0,attributes:!0}),_()})}var ut=/[&<>"']/g,ft={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ie(e){return e==null?"":String(e).replace(ut,o=>{var u;return(u=ft[o])!=null?u:o})}function mt(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ye(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var pt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],bt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},ht=["http","https","mailto"],yt="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",gt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,wt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,vt={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function Et(e){let o=e;for(let l=0;l<3;l+=1){let f=o.replace(/&#x([0-9a-fA-F]+);?/g,(a,w)=>{let p=Number.parseInt(w,16);if(!Number.isFinite(p)||p<0||p>1114111)return"";try{return String.fromCodePoint(p)}catch(M){return""}}).replace(/&#(\d+);?/g,(a,w)=>{let p=Number(w);if(!Number.isFinite(p)||p<0||p>1114111)return"";try{return String.fromCodePoint(p)}catch(M){return""}}).replace(/&([a-zA-Z]+);?/g,(a,w)=>{let p=vt[w.toLowerCase()];return p!==void 0?p:a});if(f===o)break;o=f}let u="";for(let l=0;l<o.length;l+=1){let f=o.charCodeAt(l);f<=31||f===127||(u+=o[l])}return u.replace(/[\s\u00a0]+/g,"")}function St(e){var f,a;let o=new Map,u=new RegExp(gt.source,"g"),l;for(;(l=u.exec(e))!==null;){let w=((f=l[1])!=null?f:"").toLowerCase(),p=(a=l[2])!=null?a:"";(p.startsWith('"')&&p.endsWith('"')||p.startsWith("'")&&p.endsWith("'"))&&(p=p.slice(1,-1)),o.set(w,p),l[0].length===0&&(u.lastIndex+=1)}return o}function xt(e,o){var a;let u=Et(e);if(u.length===0)return!0;let l=wt.exec(u);if(!l)return!0;let f=((a=l[1])!=null?a:"").toLowerCase();return o.includes(f)?f==="data"?/^data:image\//i.test(u):!0:!1}function kt(e,o,u,l,f,a,w){var y,_;let p=o.toLowerCase();if(!f.has(p))return"";if(e)return`</${p}>`;let M=St(u||""),m=(y=a["*"])!=null?y:[],T=(_=a[p])!=null?_:[],P=[];for(let[x,A]of M)x.startsWith("on")||!(m.includes(x)||T.includes(x))||(x==="href"||x==="src")&&!xt(A,w)||P.push(`${x}="${mt(A)}"`);p==="a"&&M.get("target")==="_blank"&&T.includes("rel")&&(P.some(x=>x.startsWith("rel="))||P.push('rel="noopener noreferrer"'));let v=P.length>0?` ${P.join(" ")}`:"";return`<${p}${v}${l?" /":""}>`}function pe(e,o={}){var T,P,v;if(e==null)return"";let u=String(e).replace(/<!--[\s\S]*?-->/g,""),l=new Set(((T=o.allowedTags)!=null?T:pt).map(S=>S.toLowerCase())),f=(P=o.allowedAttributes)!=null?P:bt,a=(v=o.allowedSchemes)!=null?v:ht,w=new RegExp(yt,"g"),p="",M=0,m;for(;(m=w.exec(u))!==null;){let[S,y,_="",x="",A]=m;p+=Ye(u.slice(M,m.index)),p+=kt(y,_,x,A,l,f,a),M=m.index+S.length}return p+=Ye(u.slice(M)),p}var Ve="btfw-stack-order",be="btfw-stack-motd-open",Ce="btfw-stack-playlist-open",Ae="btfw-stack-poll-open",ge={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Pe={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},je={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Oe={"motd-group":1,"poll-group":2,"playlist-group":3},ce=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Ie=["#main","#mainpage","#mainpane"];function le(e){try{let o=Array.from(e.children).map(u=>({id:u.dataset.bind,isGroup:u.dataset.group==="true"}));localStorage.setItem(Ve,JSON.stringify(o))}catch(o){}}function Ke(){try{return JSON.parse(localStorage.getItem(Ve)||"[]")}catch(e){return[]}}function he(e){try{let o=localStorage.getItem(e);return o===null?null:o==="true"}catch(o){return null}}function Ne(e,o){try{localStorage.setItem(e,o?"true":"false")}catch(u){}}function Be(e){try{let o=localStorage.getItem(e);if(o!==null)return o==="true";let u=e.replace("-docked","-hidden"),l=localStorage.getItem(u);return l!==null?l==="true":!1}catch(o){return!1}}function Qe(e,o){try{localStorage.setItem(e,o?"true":"false")}catch(u){}}function Re(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function we(e,o,u){if(!e||Re(e))return;let l=he(o!=null?o:""),f=typeof u=="function"?u(l):l!==null?!!l:!0;e._btfwSetOpenState?e._btfwSetOpenState(f,{persist:!1}):(e.dataset.open=f?"true":"false",e.classList.toggle("is-open",f))}function qe(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),o=e.filter(w=>w.dataset.docked!=="true"),u=e.length>0&&o.length===0,l=document.getElementById("btfw-stack"),f=document.getElementById("btfw-leftpad"),a=document.getElementById("btfw-grid");l&&(l.classList.toggle("btfw-stack--all-hidden",u),l.classList.toggle("btfw-stack--all-docked",u)),f&&f.classList.toggle("btfw-leftpad--stack-hidden",u),a&&a.classList.toggle("btfw-grid--stack-hidden",u),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:u,allDocked:u,visibleCount:o.length,totalCount:e.length}}))}function Fe(e=""){let o=String(e||"").trim();return o?!o.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function Xe(e=document){if(!e||typeof e.querySelector!="function")return!1;let o=fe(e);return o?!Fe(o.innerHTML||""):!1}function fe(e=document){if(!e||typeof e.getElementById!="function")return null;let o=e.getElementById("motdwrap");if(!o)return e.getElementById("motd");let u=o.querySelector(":scope > #motd");return u||o.querySelector("#motd")||e.getElementById("motd")}function He(e=!1){let o=document.getElementById("motdwrap");if(!o)return null;if(!e&&o.dataset.btfwMotdNormalized==="1"){let a=o.querySelector(":scope > #motd");return a?{motdwrap:o,motd:a}:null}let u=document.getElementById("togglemotd");u&&u.closest("#motd")&&o.insertBefore(u,o.firstChild);let l=[];o.querySelectorAll(".btfw-motd-editrow").forEach(a=>{let w=(a.textContent||"").trim();w&&l.push(`<p>${w}</p>`),a.remove()}),o.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(a=>{a.contains(o)||a===o||((a.querySelector("#motd")||a.classList.contains("btfw-motd-editrow"))&&a.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&l.push(w.innerHTML)}),a.remove())});let f=o.querySelector(":scope > #motd");if(f||(f=document.createElement("div"),f.id="motd",o.appendChild(f)),o.querySelectorAll("#motd").forEach(a=>{a!==f&&((a.innerHTML||"").trim()&&l.push(a.innerHTML),a.remove())}),f.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(a=>{a.remove()}),f.querySelectorAll("#motd").forEach(a=>{(a.innerHTML||"").trim()&&l.push(a.innerHTML),a.remove()}),document.querySelectorAll("#togglemotd").forEach((a,w)=>{w!==0&&a.remove()}),l.length){let a=l.join("").trim();a&&Fe(f.innerHTML)?f.innerHTML=pe(a):a&&(f.innerHTML+=pe(a))}return o.dataset.btfwMotdNormalized="1",{motdwrap:o,motd:f}}function Ze(e){let o=null,u=!1,l=!1;function f(T){He();let P=document.getElementById("motdwrap");if(!P)return;let v=T&&T.list;if(!v)return;let S=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(S){let y=S.querySelector(".btfw-group-body");y&&!y.contains(P)&&y.appendChild(P)}else{let y=ce.find(_=>_.id==="motd-group");if(!y)return;S=e.createGroupItem(y,[P]),S&&(v.appendChild(S),le(v))}a(S)}function a(T){let P=document.getElementById("motdwrap");if(!P)return;let v=Xe();if(P.classList.toggle("btfw-motd-empty",!v),P.toggleAttribute("hidden",!v),P.setAttribute("aria-hidden",v?"false":"true"),v){P.style.removeProperty("display");let S=fe();S&&S.style.removeProperty("display")}if(T||(T=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),T&&v){let S=he(be),y=se(S,!0),_=T;_._btfwSetOpenState?_._btfwSetOpenState(y,{persist:!1}):(_.dataset.open=y?"true":"false",_.classList.toggle("is-open",y))}}function w(T){o&&clearTimeout(o),o=setTimeout(()=>{o=null,f(T)},50)}function p(T){let P=fe();P&&(u||(u=!0,new MutationObserver(()=>{w(T)}).observe(P,{childList:!0,subtree:!0,characterData:!0})))}function M(T){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("setMotd",P=>{let v=typeof P=="string"?P:P&&typeof P=="object"&&typeof P.motd=="string"?P.motd:null,S=fe();if(S){let y=v!==null?v:S.innerHTML,_=pe(y);S.innerHTML!==_&&(S.innerHTML=_)}w(T)}))}function m(T){let P=e.ensureStackRefs(),v=document.getElementById("motdwrap");v&&delete v.dataset.btfwMotdNormalized;let S=He(!0),y=(S==null?void 0:S.motd)||fe();y&&typeof T=="string"&&(y.innerHTML=pe(T));let _=document.getElementById("cs-motdtext");_&&typeof T=="string"&&(_.value=T),P&&w(P)}return{isMotdHtmlEmpty:Fe,hasMotdContent:Xe,resolveMotdHost:fe,normalizeMotdStructure:He,ensureMotdStackPanel:f,syncMotdWrapVisibility:a,scheduleMotdSync:w,wireMotdObservers:p,wireMotdSocket:M,applyMotdUpdate:m}}var _t=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function Je(e){let{tpl:o}=e;function u(y,_,x){if(!y||!_||!x)return null;let A=_t.map(W=>{let $=document.getElementById(W.id);return $?{...W,el:$}:null}).filter(Boolean);if(!A.length){let W=document.getElementById("btfw-addmedia-panel");return W&&W.remove(),null}let E=document.getElementById("btfw-addmedia-panel");if(E||(E=document.createElement("section"),E.id="btfw-addmedia-panel",E.className="btfw-addmedia-panel",E.dataset.open="false",E.setAttribute("role","region"),E.setAttribute("aria-label","Add media controls"),E.setAttribute("aria-hidden","true"),E.setAttribute("hidden","hidden"),E.innerHTML=o.addMediaPanelHtml()),E.parentElement!==y){let W=_.parentElement===y?_.nextSibling:null;y.insertBefore(E,W)}let L=E.querySelector(".btfw-addmedia-tabs"),O=E.querySelector(".btfw-addmedia-views"),U=E.querySelector(".btfw-addmedia-close");if(!L||!O)return null;for(;L.firstChild;)L.removeChild(L.firstChild);for(;O.firstChild;)O.removeChild(O.firstChild);A.forEach(({id:W,title:$,el:N})=>{N.classList.remove("collapse","in","plcontrol-collapse"),N.style.removeProperty("display"),N.style.removeProperty("height"),N.removeAttribute("aria-expanded"),N.setAttribute("role","tabpanel"),N.setAttribute("data-btfw-addmedia","panel");let G=document.createElement("button");G.type="button",G.className="btfw-addmedia-tab",G.dataset.target=W,G.textContent=$,G.setAttribute("role","tab"),L.appendChild(G);let j=document.createElement("div");j.className="btfw-addmedia-view",j.dataset.target=W,j.setAttribute("role","tabpanel"),j.setAttribute("aria-hidden","true"),j.appendChild(N),O.appendChild(j)});let F=A.find(W=>W.default)||A[0],I=W=>{let $=W||E.dataset.active||F.id;E.dataset.active=$,L.querySelectorAll(".btfw-addmedia-tab").forEach(N=>{let G=N.dataset.target===$;N.classList.toggle("is-active",G),N.setAttribute("aria-selected",G?"true":"false"),N.setAttribute("tabindex",G?"0":"-1")}),O.querySelectorAll(".btfw-addmedia-view").forEach(N=>{let G=N.dataset.target===$;N.classList.toggle("is-active",G),N.setAttribute("aria-hidden",G?"false":"true")})},V=W=>{let $=W!=null?!!W:E.dataset.open!=="true";return E.dataset.open=$?"true":"false",E.classList.toggle("is-open",$),E.setAttribute("aria-hidden",$?"false":"true"),$?(E.removeAttribute("hidden"),I(E.dataset.active||F.id)):E.setAttribute("hidden","hidden"),E.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:$}})),$};return E._btfwWired||(L.addEventListener("click",W=>{let $=W.target.closest(".btfw-addmedia-tab");$&&(W.preventDefault(),I($.dataset.target))}),U&&U.addEventListener("click",()=>V(!1)),E._btfwWired=!0),I(E.dataset.active||F.id),E._btfwToggle=V,E._btfwSetActive=I,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:$,target:N})=>{let G=document.getElementById($);G&&G.dataset.btfwAddmedia!==N&&(G.dataset.btfwAddmedia=N,G.setAttribute("aria-controls","btfw-addmedia-panel"),G.addEventListener("click",j=>{j.preventDefault(),j.stopPropagation(),I(N),V(!0),G.blur()}))})})(),{panel:E,toggle:V,setActive:I}}function l(y,_,x){let A=y.querySelector(".btfw-plbar__search");if(!A||document.getElementById("btfw-pl-search-toggle"))return;A.id||(A.id="btfw-plbar-search"),A.hidden=!0;let E=document.createElement("button");E.type="button",E.id="btfw-pl-search-toggle",E.className="button is-dark is-small btfw-plbar__action-btn",E.innerHTML=o.playlistSearchButtonHtml(),E.title="Filter Playlist",E.setAttribute("aria-label","Filter Playlist"),E.setAttribute("aria-controls",A.id),E.setAttribute("aria-expanded","false"),x&&x.parentElement===_?x.after(E):_.prepend(E);let L=A.querySelector("input"),O=U=>{var F;if(A.hidden=!U,E.setAttribute("aria-expanded",U?"true":"false"),U){L==null||L.focus();return}L!=null&&L.value&&((F=A.querySelector("#btfw-pl-clear"))==null||F.click())};E.addEventListener("click",()=>O(E.getAttribute("aria-expanded")!=="true")),A.addEventListener("keydown",U=>{U.key==="Escape"&&(O(!1),E.focus())})}function f(){let y=document.getElementById("btfw-plbar");if((y==null?void 0:y.dataset.btfwMerged)==="1")return;let _=document.getElementById("controlsrow"),x=document.getElementById("rightcontrols"),A=document.getElementById("playlistwrap"),E=document.getElementById("queuecontainer"),L=document.getElementById("playlistrow"),O=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),U=document.querySelectorAll(".btfw-controls-row"),F=L||A||E||O;if(!F)return;let I=y;I?I.classList.add("btfw-plbar"):(I=document.createElement("div"),I.id="btfw-plbar",I.className="btfw-plbar");let V=I.querySelector(".btfw-plbar__layout"),K,W;if(V)K=V.querySelector(".btfw-plbar__primary")||V,W=V.querySelector(".btfw-plbar__aside")||V;else{for(V=document.createElement("div"),V.className="btfw-plbar__layout",K=document.createElement("div"),K.className="btfw-plbar__primary",W=document.createElement("div"),W.className="btfw-plbar__aside",V.append(K,W);I.firstChild;)K.appendChild(I.firstChild);I.appendChild(V);let Y=K.querySelector(".field.has-addons");Y&&Y.classList.add("btfw-plbar__search");let Q=K.querySelector("#btfw-pl-count");Q&&(Q.classList.add("btfw-plbar__count"),W.appendChild(Q))}I.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(Y=>Y.remove());let $=I.querySelector(".btfw-plbar__actions");$||($=document.createElement("div"),$.className="btfw-plbar__actions",(W||I).appendChild($));let N=document.getElementById("btfw-addmedia-btn"),G=Y=>{if(Y){if(Y.classList.add("btfw-plbar__action-btn"),Y.tagName==="BUTTON"||Y.tagName==="A")Y.classList.add("button","is-dark","is-small");else if(Y.tagName==="INPUT"){let Q=(Y.type||"").toLowerCase();Q==="button"||Q==="submit"||Q==="reset"?Y.classList.add("button","is-dark","is-small"):Y.classList.remove("button","is-dark","is-small")}}};I.parentElement!==F&&F.insertBefore(I,F.firstChild);let j=u(F,I,$);j?!N||!document.body.contains(N)?(N=document.createElement("button"),N.id="btfw-addmedia-btn",N.setAttribute("type","button"),N.className="button is-small",N.innerHTML=o.addMediaButtonHtml(),$.prepend(N)):$.contains(N)||$.prepend(N):N&&(N.parentElement&&N.parentElement.removeChild(N),N=null);let re=Y=>{if(!Y)return;Array.from(Y.children||[]).forEach(J=>{J&&(J.classList.add("btfw-plbar__control"),$.appendChild(J))})};if(x&&(re(x),x.remove()),_&&(re(_),_.remove()),$.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(G),j&&N){N.classList.remove("is-dark"),N.classList.add("is-primary"),N.dataset.iconified||(N.innerHTML=o.addMediaButtonHtml(),N.dataset.iconified="1"),N.setAttribute("aria-controls","btfw-addmedia-panel");let Y=J=>{N.setAttribute("aria-expanded",J?"true":"false")};N.dataset.btfwBound||(N.dataset.btfwBound="1",N.addEventListener("click",J=>{J.preventDefault();let oe=document.getElementById("btfw-addmedia-panel"),ee=oe&&oe._btfwToggle,g=typeof ee=="function"?ee():!1;Y(g)}));let Q=j.panel||document.getElementById("btfw-addmedia-panel");Q&&(Y(Q.dataset.open==="true"),Q._btfwButtonSync||(Q.addEventListener("btfw:addmedia:state",J=>{Y(!!J.detail&&!!J.detail.open)}),Q._btfwButtonSync=!0))}l(I,$,N),U.forEach(Y=>{Y&&!F.contains(Y)&&(Y.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,Y.remove(),F.appendChild(Y),console.log("[stack] Moved floating controls row into playlist container"))}),F.contains(I)||F.insertBefore(I,F.firstChild),I.dataset.btfwMerged="1"}function a(y){if(!y)return null;let _=Array.from(y.classList).find(A=>A.startsWith("pluid-"));if(_)return _.slice(6);let x=window.jQuery||window.$;if(x){let A=x(y).data("uid");if(A!=null&&A!=="")return A}return y.dataset.uid||null}function w(y){if(y==null||y==="")return!1;let _=window.socket;if(_&&typeof _.emit=="function")return _.emit("jumpTo",y),!0;let x=document.querySelector(`#queue > .queue_entry.pluid-${y}`),A=x==null?void 0:x.querySelector(".qbtn-play");return A?(A.click(),!0):!1}function p(y){let _=(y||"").trim();if(!_)return!1;let x=document.getElementById("mediaurl"),A=document.getElementById("queue_next");if(x&&A&&(x.value=_,!A.disabled))return A.click(),!0;if(typeof window.queue=="function"&&x)return x.value=_,window.queue("next","url"),!0;let E=window.socket;if(E&&typeof parseMediaLink=="function")try{let L=parseMediaLink(_);if((L==null?void 0:L.id)!=null&&(L!=null&&L.type))return E.emit("queue",{id:L.id,type:L.type,pos:"next",temp:!1}),!0}catch(L){}return!1}let M=null,m=null;function T(){if(M){try{M.disconnect()}catch(y){}M=null}m=null}function P(y){if(!y||m===y)return;T();let _=document.getElementById("queue");_&&(m=y,M=new MutationObserver(()=>{y.isConnected&&e.getActiveFlyoutGroup()==="playlist-group"&&S(y)}),M.observe(_,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function v(y=5){let _=document.getElementById("queue");if(!_)return[];let x=Array.from(_.querySelectorAll(":scope > .queue_entry")),A=x.findIndex(L=>L.classList.contains("queue_active")||L.classList.contains("playing")),E=A>=0?A+1:0;return x.slice(E,E+y)}function S(y){if(!y)return;let _=v(5);if(y.replaceChildren(),!_.length){let x=document.createElement("p");x.className="btfw-panel-playlist__empty",x.textContent="No upcoming videos",y.appendChild(x);return}_.forEach(x=>{var F,I;let A=document.createElement("div");A.className="btfw-panel-playlist__item";let E=document.createElement("span");E.className="btfw-panel-playlist__title",E.textContent=(((F=x.querySelector(".qe_title"))==null?void 0:F.textContent)||"Untitled").trim();let L=document.createElement("span");L.className="btfw-panel-playlist__meta",L.textContent=(((I=x.querySelector(".qe_time"))==null?void 0:I.textContent)||"").trim();let O=document.createElement("div");O.className="btfw-panel-playlist__actions";let U=a(x);if(U!=null&&U!==""){let V=document.createElement("button");V.type="button",V.className="btfw-panel-playlist__play",V.textContent="Play",V.dataset.queueUid=String(U),!(x==null?void 0:x.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(V.disabled=!0),O.appendChild(V)}A.append(E,L,O),y.appendChild(A)})}return{ensureAddMediaUI:u,mergePlaylistControls:f,getQueueEntryUid:a,playQueueEntry:w,queueMediaLink:p,disconnectQueuePreviewObserver:T,ensureQueuePreviewObserver:P,getUpcomingQueueEntries:v,renderPlaylistQueuePreview:S}}function et(e){let o=null,u=!1,l=!1;function f(){let v=document.getElementById("pollwrap");if(!v)return null;if(!v.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return v;let y=document.getElementById("btfw-poll-parking");return y||(y=document.createElement("div"),y.id="btfw-poll-parking",y.hidden=!0,y.setAttribute("aria-hidden","true"),document.body.appendChild(y)),y.appendChild(v),v}function a(v){let S=document.getElementById("pollwrap");if(!S)return;let y=S.dataset&&S.dataset.btfwPollOverlay,_=S.getAttribute&&S.getAttribute("data-btfw-poll-overlay");if(y==="video"||_==="video")return;f(),P();let x=v&&v.list;if(!x)return;let A=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!A){let O=ce.find(U=>U.id==="poll-group");if(!O)return;A=e.createGroupItem(O,[S]),A&&(x.appendChild(A),le(x));return}let E=A.querySelector(".btfw-group-body");E&&!E.contains(S)&&E.appendChild(S);let L=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');L&&L.contains(S)&&E&&E.appendChild(S)}function w(v,S={}){a(v),T();let y=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');y&&(y.hidden=!1,y.removeAttribute("hidden"),S.forceOpen&&y._btfwSetOpenState?y._btfwSetOpenState(!0,{persist:!1}):S.forceOpen&&(y.dataset.open="true",y.classList.add("is-open")))}function p(v,S={}){o&&clearTimeout(o),o=setTimeout(()=>{o=null,w(v,S)},50)}function M(v){if(u)return;let S=document.getElementById("pollwrap");if(!S)return;u=!0,new MutationObserver(()=>{p(v,{forceOpen:de()})}).observe(S,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let _=document.getElementById("newpollbtn");_&&!_.dataset.btfwPollSync&&(_.dataset.btfwPollSync="1",_.addEventListener("click",()=>{p(v,{forceOpen:!0})}))}function m(v){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("newPoll",()=>p(v,{forceOpen:!0})),window.socket.on("closePoll",()=>p(v)))}function T(){let v=document.getElementById("pollwrap");if(!v)return;let S=!!v.closest(".btfw-panel-container__host"),y=!de();if(S&&!y){v.classList.remove("btfw-poll-idle"),v.removeAttribute("hidden"),v.setAttribute("aria-hidden","false");return}v.classList.toggle("btfw-poll-idle",y),v.toggleAttribute("hidden",y),v.setAttribute("aria-hidden",y?"true":"false")}function P(){let v=document.getElementById("leftcontrols"),S=document.getElementById("pollwrap");v&&S&&(v.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(_=>{let x=S.querySelector(".poll-controls");x||(x=document.createElement("div"),x.className="poll-controls",S.insertBefore(x,S.firstChild)),_.parentElement!==x&&x.appendChild(_)}),v.children.length===0&&v.remove())}return{detachPollWrapFromPlaylist:f,movePollButton:P,ensurePollStackPanel:a,syncPollPanelVisibility:w,schedulePollSync:p,wirePollObservers:M,wirePollSocket:m,syncPollWrapVisibility:T}}BTFW.define("feature:stack",["feature:layout"],async({init:e})=>{let o=!1,u=null,l="",f=null,a={"motd-group":{storageKey:be,getDefaultOpen:t=>se(t,T()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:Ce,getDefaultOpen:t=>se(t,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:Ae,getDefaultOpen:t=>se(t,de()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},w=!1,p=null,M=!1,m=Ze({createGroupItem:y,ensureStackRefs:()=>S()}),T=m.hasMotdContent,P=Je({tpl:Me,getActiveFlyoutGroup:()=>u}),v=et({createGroupItem:y});function S(){let t=document.getElementById("btfw-leftpad");if(!t)return null;let i=document.getElementById("btfw-stack");if(!i){i=document.createElement("div"),i.id="btfw-stack",i.className="btfw-stack";let n=document.getElementById("videowrap"),d=document.getElementById("btfw-video-overlay"),s=d&&n&&d.parentElement===n.parentElement?d:n;s&&s.parentElement?s.nextSibling?s.parentNode.insertBefore(i,s.nextSibling):s.parentNode.appendChild(i):t.appendChild(i);let C=document.createElement("div");C.className="btfw-stack-list",i.appendChild(C);let R=document.createElement("div");R.id="btfw-stack-footer",R.className="btfw-stack-footer",i.appendChild(R)}return{list:i.querySelector(".btfw-stack-list"),footer:i.querySelector("#btfw-stack-footer")}}function y(t,i){if(t.id==="motd-group"&&(m.normalizeMotdStructure(),i=[document.getElementById("motdwrap")].filter(Boolean)),t.id==="playlist-group"&&(v.detachPollWrapFromPlaylist(),P.mergePlaylistControls(),i=i.filter(k=>k&&k.id!=="rightcontrols"&&k.id!=="pollwrap").filter(k=>!k.querySelector||!k.querySelector("#pollwrap"))),t.id==="poll-group"&&(v.detachPollWrapFromPlaylist(),v.movePollButton(),i=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),i.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(i=i.filter(k=>k&&!n.contains(k)&&!k.contains(n)));let d=document.createElement("section");d.className="btfw-stack-item btfw-group-item",d.dataset.bind=t.id,d.dataset.group="true";let s=document.createElement("header");s.className="btfw-stack-item__header",s.innerHTML=ke(t.title);let C=document.createElement("div");C.className="btfw-stack-item__body btfw-group-body",i.forEach(k=>{if(k&&k.parentElement!==C&&!C.contains(k)&&!k.contains(C))try{C.appendChild(k)}catch(B){console.warn("[stack] Failed to move element:",k.id||k.className,B)}}),d.appendChild(s),d.appendChild(C);let R=a[t.id];return R&&g(d,R),ee(d,t.id),d.querySelector(".btfw-up").onclick=function(){let k=d.parentElement,B=d.previousElementSibling;B&&k.insertBefore(d,B),le(k)},d.querySelector(".btfw-down").onclick=function(){let k=d.parentElement,B=d.nextElementSibling;B?k.insertBefore(B,d):k.appendChild(d),le(k)},d}function _(t){t&&(t.classList.remove("btfw-stack-item--in-drawer"),delete t.dataset.btfwInDrawer,t.classList.toggle("is-open",t.dataset.open!=="false"),v.syncPollWrapVisibility())}function x(t){_(t);let i=document.querySelector("#btfw-stack .btfw-stack-list");!i||!t||t.parentElement!==i&&i.appendChild(t)}function A(){var d;let t=document.getElementById("btfw-chat-actions");if(!t)return null;let i=document.getElementById("btfw-panels-menu-shell");if(!i){i=document.createElement("div"),i.id="btfw-panels-menu-shell",i.className="btfw-panels-menu-shell",i.setAttribute("aria-label","Docked channel panels");let s=document.createElement("div");s.id="btfw-panel-bar",s.className="btfw-panel-bar",s.setAttribute("role","toolbar"),s.setAttribute("aria-label","Docked panel shortcuts"),i.appendChild(s)}let n=i.querySelector("#btfw-panel-bar");return U(n),i.parentElement!==t&&t.insertBefore(i,t.firstChild),o||(re(),o=!0),(d=document.getElementById("btfw-stack-drawer"))==null||d.remove(),i}function E(t){t.preventDefault(),t.stopPropagation(),N()}function L(){let t=A();if(!t)return null;let i=document.getElementById("btfw-panels-menu-btn");i?i.parentElement!==t&&t.appendChild(i):(i=document.createElement("button"),i.type="button",i.id="btfw-panels-menu-btn",i.className="button btfw-chatbtn btfw-panels-menu-btn",i.innerHTML=_e(),i.title="Docked Panels",i.setAttribute("aria-expanded","false"),i.hidden=!0,t.appendChild(i)),i.title="Docked Panels";let n=i.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),i.classList.remove("is-wide"),i.dataset.btfwPanelsWired||(i.addEventListener("click",E),i.dataset.btfwPanelsWired="1"),i}function O(t){S();let i=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${t}"]`);i&&(f&&(clearTimeout(f),f=null),u=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),P.disconnectQueuePreviewObserver(),oe(i,!1),requestAnimationFrame(()=>{try{i.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function U(t){!t||t.dataset.btfwActionsWired||(t.dataset.btfwActionsWired="1",t.addEventListener("click",i=>{var C,R,k;let n=i.target.closest(".btfw-panel-undock");if(n){i.preventDefault(),i.stopPropagation();let B=n.dataset.panelGroup||((C=n.closest(".btfw-panel-btn"))==null?void 0:C.dataset.group);B&&O(B);return}let d=i.target.closest(".btfw-panel-playlist__play");if(d){i.preventDefault(),i.stopPropagation(),P.playQueueEntry(d.dataset.queueUid);return}let s=i.target.closest(".btfw-panel-playlist__add");if(s){i.preventDefault(),i.stopPropagation();let B=(R=s.closest(".btfw-panel-container"))==null?void 0:R.querySelector(".btfw-panel-playlist__add-form");if(!B)return;let z=B.hidden;B.hidden=!z,s.setAttribute("aria-expanded",z?"true":"false"),z&&((k=B.querySelector(".btfw-panel-playlist__link-input"))==null||k.focus())}}),t.addEventListener("submit",i=>{var R,k,B,z;let n=i.target.closest(".btfw-panel-playlist__add-form");if(!n)return;i.preventDefault(),i.stopPropagation();let d=n.querySelector(".btfw-panel-playlist__link-input"),s=(R=d==null?void 0:d.value)==null?void 0:R.trim();if(!s||!P.queueMediaLink(s))return;d.value="",n.hidden=!0,(B=(k=n.closest(".btfw-panel-container"))==null?void 0:k.querySelector(".btfw-panel-playlist__add"))==null||B.setAttribute("aria-expanded","false");let C=(z=n.closest(".btfw-panel-container"))==null?void 0:z.querySelector(".btfw-panel-playlist__queue");C&&P.renderPlaylistQueuePreview(C)}))}function F(t,i){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=t,n.setAttribute("aria-label",`Pin ${i.title} below video`),n.title="Pin below video",n.innerHTML=Te(),n}function I(){let t=document.createElement("form");return t.className="btfw-panel-playlist__add-form",t.hidden=!0,t.innerHTML=Le(),t}function V(t,i,n){let d=document.createElement("div");if(d.className="btfw-panel-container",n>0&&(d.style.bottom=`${-n*50}px`),t==="playlist-group"){d.classList.add("btfw-panel-container--playlist");let C=document.createElement("div");C.className="btfw-panel-playlist__toolbar";let R=document.createElement("button");R.type="button",R.className="btfw-panel-playlist__add",R.textContent="+Add",R.setAttribute("aria-expanded","false");let k=F(t,i);C.append(R,k);let B=I(),z=document.createElement("div");return z.className="btfw-panel-container__host btfw-panel-playlist__queue",d.append(C,B,z),d}d.classList.add("btfw-panel-container--dock-only");let s=document.createElement("div");return s.className="btfw-panel-container__dock-only",s.appendChild(F(t,i)),d.appendChild(s),d}function K(){f&&(clearTimeout(f),f=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(t=>{t.classList.remove("is-active"),delete t.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(t=>{x(t)}),P.disconnectQueuePreviewObserver(),u=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function W(t){let i=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");i&&i.classList.toggle("open",t),document.documentElement.classList.toggle("btfw-panels-bar-open",t),n&&(n.classList.toggle("is-expanded",t),n.setAttribute("aria-expanded",t?"true":"false")),t||K()}function $(){W(!1)}function N(){A();let t=document.getElementById("btfw-panel-bar"),i=document.getElementById("btfw-panels-menu-btn");!t||!i||i.hidden||W(!t.classList.contains("open"))}function G(t){f&&clearTimeout(f),f=setTimeout(()=>{f=null;let i=document.querySelector(`.btfw-panel-btn[data-group="${t}"]`);i&&(i.matches(":hover")||i.querySelector(".btfw-panel-container:hover")||(i.classList.remove("is-active"),u===t&&(u=null,P.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function j(t,i){if(i&&(f&&(clearTimeout(f),f=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==i&&n.classList.remove("is-active")}),u=t,i.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),t==="playlist-group")){let n=i.querySelector(".btfw-panel-playlist__queue");n&&(P.renderPlaylistQueuePreview(n),P.ensureQueuePreviewObserver(n))}}function re(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",t=>{u&&(t.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(i=>{delete i.dataset.btfwFlyoutLocked}),K()))}))}function Y(t,i){var d;if(!((d=document.getElementById("btfw-panel-bar"))!=null&&d.classList.contains("open")))return;if(f&&(clearTimeout(f),f=null),i.dataset.btfwFlyoutLocked==="true"&&i.classList.contains("is-active")){delete i.dataset.btfwFlyoutLocked,i.classList.remove("is-active"),u===t&&(u=null,P.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(s=>{s!==i&&delete s.dataset.btfwFlyoutLocked}),i.dataset.btfwFlyoutLocked="true",j(t,i)}function Q(t,i){let n=t.querySelector(".btfw-panel-container"),d=()=>{var s;(s=document.getElementById("btfw-panel-bar"))!=null&&s.classList.contains("open")&&(f&&(clearTimeout(f),f=null),j(i,t))};t.addEventListener("mouseenter",d),t.addEventListener("focusin",d),t.addEventListener("click",s=>{s.target.closest(".btfw-panel-container")||(s.preventDefault(),s.stopPropagation(),Y(i,t))}),t.addEventListener("keydown",s=>{s.key!=="Enter"&&s.key!==" "||(s.preventDefault(),Y(i,t))}),t.addEventListener("mouseleave",s=>{t.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(s.relatedTarget)||G(i))}),n==null||n.addEventListener("mouseenter",()=>{f&&(clearTimeout(f),f=null)}),n==null||n.addEventListener("mouseleave",s=>{t.dataset.btfwFlyoutLocked!=="true"&&(t.contains(s.relatedTarget)||G(i))})}function J(){let t=A();L();let i=t==null?void 0:t.querySelector("#btfw-panel-bar");if(!i)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((k,B)=>(Oe[k.dataset.bind]||99)-(Oe[B.dataset.bind]||99)),d=n.map(k=>k.dataset.bind).join("|"),s=document.getElementById("btfw-panels-menu-btn");if(s&&(s.hidden=n.length===0,n.length===0)){l="",$();return}if(d===l&&i.childElementCount===n.length)return;l=d;let C=i.classList.contains("open"),R=u;if(K(),i.replaceChildren(),i.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((k,B)=>{let z=k.dataset.bind,X=Pe[z]||{short:"?",title:z},te=document.createElement("div");te.className="btfw-panel-btn",te.dataset.group=z,te.title=X.title,te.setAttribute("role","button"),te.setAttribute("aria-label",X.title),te.tabIndex=0;let ne=document.createElement("span");ne.className="btfw-panel-btn__label",ne.textContent=je[z]||X.short,te.appendChild(ne),te.appendChild(V(z,X,B)),i.appendChild(te),Q(te,z)}),C&&(W(!0),R&&n.some(B=>B.dataset.bind===R))){let B=i.querySelector(`.btfw-panel-btn[data-group="${R}"]`);B&&j(R,B)}}function oe(t,i,n={}){if(!t)return;let d=!!i,s=n.persist===!1,C=t.dataset.bind,R=ge[C];t.dataset.docked=d?"true":"false",t.classList.toggle("btfw-stack-item--docked",d);let k=t.querySelector(".btfw-stack-dock-btn");k&&(k.setAttribute("aria-pressed",d?"true":"false"),k.title=d?"Pinned to panels menu":"Dock to panels menu"),d?Re(t)?x(t):u===C&&(u=null):(x(t),t._btfwSetOpenState?t._btfwSetOpenState(!0):(t.dataset.open="true",t.classList.add("is-open"))),!s&&R&&Qe(R,d),J(),qe()}function ee(t,i){var B;let n=ge[i];if(!n)return;let d=t.querySelector(".btfw-stack-item__header"),s=d==null?void 0:d.querySelector(".btfw-stack-header-toolbar"),C=s==null?void 0:s.querySelector(".btfw-stack-arrows");if(!C||C.querySelector(".btfw-stack-dock-btn"))return;let R=Be(n);t.dataset.docked=R?"true":"false",t.classList.toggle("btfw-stack-item--docked",R);let k=document.createElement("button");k.type="button",k.className="btfw-arrow btfw-stack-dock-btn",k.textContent="\u2AF7",k.setAttribute("aria-label",`Dock ${((B=Pe[i])==null?void 0:B.title)||i} to panels menu`),k.setAttribute("aria-pressed",R?"true":"false"),k.title=R?"Pinned to panels menu":"Dock to panels menu",k.addEventListener("click",z=>{z.preventDefault(),z.stopPropagation(),t.dataset.docked!=="true"&&oe(t,!0)}),C.insertBefore(k,C.firstChild)}function g(t,i={}){let{storageKey:n,getDefaultOpen:d,toggleClass:s,ariaLabel:C="Toggle panel visibility",openTitle:R="Hide panel",closeTitle:k="Show panel"}=i,B=he(n),z=typeof d=="function"?d(B):B!==null?B:!0;t.hasAttribute("data-open")||(t.dataset.open=z?"true":"false"),t.classList.toggle("is-open",t.dataset.open!=="false");let X=t.querySelector(".btfw-stack-item__header"),te=X&&X.querySelector(".btfw-stack-arrows");if(!te||te.querySelector(`.${s}`))return;let ne=document.createElement("button");ne.type="button",ne.className=`btfw-arrow ${s}`,ne.setAttribute("aria-label",C),ne.style.display="flex",ne.style.alignItems="center",ne.style.justifyContent="center";let Ee=()=>{let ae=t.dataset.open!=="false";ne.textContent=ae?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",ne.title=ae?R:k,ne.setAttribute("aria-expanded",ae?"true":"false"),t.classList.toggle("is-open",ae)},We=(ae,Se={})=>{let $e=!!ae,xe=Se.persist===!1;xe&&(t._btfwSuppressPersist=!0),t.dataset.open=$e?"true":"false",Ee(),xe||Ne(n,$e),xe&&queueMicrotask(()=>{t._btfwSuppressPersist=!1})};ne.addEventListener("click",ae=>{ae.preventDefault(),ae.stopPropagation(),We(t.dataset.open==="false")}),Ee(),new MutationObserver(ae=>{for(let Se of ae)Se.type==="attributes"&&(Ee(),t._btfwSuppressPersist||Ne(n,t.dataset.open!=="false"))}).observe(t,{attributes:!0,attributeFilter:["data-open"]}),te.insertBefore(ne,te.firstChild),t._btfwSetOpenState=We,ee(t,t.dataset.bind)}function q(t){return!!t.closest('.modal, [role="dialog"]')}function D(t){if(!t||t.querySelector("#btfw-footer"))return;let i=document.getElementById("btfw-footer");if(i&&i!==t&&!t.contains(i)){t.innerHTML="",t.appendChild(i);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(d=>!q(d));n&&!t.contains(n)&&(n.classList.add("btfw-footer"),t.innerHTML="",t.appendChild(n))}function H(t){let i=document.querySelector(`.btfw-stack-item[data-bind="${t}"]`),n=i==null?void 0:i.querySelector(".btfw-stack-item__header");if(!n)return null;let d=n.querySelector(".btfw-stack-header-actions");if(!d){d=document.createElement("span"),d.className="btfw-stack-header-actions";let s=n.querySelector(".btfw-stack-header-toolbar"),C=(s==null?void 0:s.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");s&&C?s.insertBefore(d,C):C?n.insertBefore(d,C):n.appendChild(d)}return d}function Z(t,i){t&&(t.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),t.classList.add("btfw-stack-header-btn"),t.innerHTML!==i&&(t.innerHTML=i))}function b(){let t=H("poll-group"),i=document.getElementById("newpollbtn");if(t&&i){Z(i,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),i.parentElement!==t&&t.appendChild(i);let s=document.querySelector("#pollwrap > .poll-controls");s&&s.children.length===0&&s.remove()}let n=H("motd-group"),d=document.getElementById("btfw-motd-editbtn");if(n&&d){Z(d,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),d.parentElement!==n&&n.appendChild(d);let s=d.closest(".btfw-motd-editrow");s&&s.parentElement&&s.remove()}}function r(t){return ce.every(i=>i.selectors.some(d=>{var C,R;if(Ie.includes(d))return!1;let s=document.querySelector(d);if(!s||t.contains(s)||s.contains(t))return!1;if(d==="#pollwrap"){let k=(C=s.dataset)==null?void 0:C.btfwPollOverlay,B=(R=s.getAttribute)==null?void 0:R.call(s,"data-btfw-poll-overlay");if(k==="video"||B==="video")return!1}return!0})?!!t.querySelector(`[data-bind="${i.id}"]`):!0)}function c(t){if(!w){w=!0;try{let i=t.list,n=t.footer;if(r(i)&&i.children.length>0){m.ensureMotdStackPanel(t),v.ensurePollStackPanel(t),v.syncPollWrapVisibility(),b(),D(n);return}v.movePollButton(),v.detachPollWrapFromPlaylist();let d=new Map;ce.forEach(R=>{let k=[];R.selectors.forEach(B=>{let z=document.querySelector(B);if(z&&!(i.contains(z)||z.contains(i))&&!Ie.includes(B)){if(B==="#pollwrap"){let X=z.dataset&&z.dataset.btfwPollOverlay,te=z.getAttribute&&z.getAttribute("data-btfw-poll-overlay");if(X==="video"||te==="video")return}k.push(z)}}),k.length>0&&d.set(R.id,{group:R,elements:k})});let s=Ke(),C=[];d.forEach(({group:R,elements:k},B)=>{if(!Array.from(i.children).find(X=>X.dataset.bind===B))try{let X=y(R,k);X&&C.push({item:X,id:B,priority:R.priority,isGroup:!0})}catch(X){console.warn("[stack] Failed to create group item:",B,X)}}),s.length>0?C.sort((R,k)=>{let B=s.findIndex(X=>X.id===R.id),z=s.findIndex(X=>X.id===k.id);return B>=0&&z>=0?B-z:B>=0?-1:z>=0?1:R.priority-k.priority}):C.sort((R,k)=>R.priority-k.priority),C.forEach(({item:R})=>{try{R&&!i.contains(R)&&!R.contains(i)&&i.appendChild(R)}catch(k){console.warn("[stack] Failed to add item to list:",k)}}),le(i),m.ensureMotdStackPanel(t),v.ensurePollStackPanel(t),v.syncPollWrapVisibility(),b(),D(n)}finally{w=!1}}}function h(){let t=S();if(!t||(c(t),m.wireMotdObservers(t),m.wireMotdSocket(t),v.wirePollObservers(t),v.wirePollSocket(t),M))return;M=!0;let i=new MutationObserver(()=>{p||(p=requestAnimationFrame(()=>{p=null,c(t)}))}),n=document.getElementById("btfw-leftpad"),d=document.getElementById("main");n&&i.observe(n,{childList:!0,subtree:!1}),d&&i.observe(d,{childList:!0,subtree:!1}),ue("#btfw-stack .btfw-stack-item",{root:document}).then(()=>{let s=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');s&&we(s,be,k=>se(k,T()));let C=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');C&&we(C,Ce,k=>k!==null?!!k:!0);let R=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');R&&we(R,Ae,k=>se(k,de())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(k=>{let B=ge[k.dataset.bind];B&&oe(k,Be(B),{persist:!1})}),A(),L(),J(),v.syncPollPanelVisibility(t),qe(),c(t)}).catch(()=>{})}return document.addEventListener("btfw:layoutReady",h),document.addEventListener("btfw:chat:barsReady",()=>{A(),L(),J()}),setTimeout(h,1200),document.addEventListener("btfw:channelThemeTint",()=>{let t=S();t&&setTimeout(()=>c(t),100)}),document.addEventListener("btfw:motd:updated",t=>{var n;let i=(n=t==null?void 0:t.detail)==null?void 0:n.html;typeof i=="string"&&m.applyMotdUpdate(i)}),{name:"feature:stack",hasMotdContent:T,resolveMotdHost:m.resolveMotdHost,normalizeMotdStructure:m.normalizeMotdStructure,applyMotdUpdate:m.applyMotdUpdate}});BTFW.define("feature:videoOverlay",[],async()=>{let e=(b,r=document)=>r.querySelector(b),o=["#mediarefresh","#voteskip","#fullscreenbtn"],l={owner:["chanowner","owner","founder","admin","administrator"]};function f(){try{return window.CLIENT||window.client||null}catch(b){return null}}function a(){try{return window.CHANNEL||window.channel||null}catch(b){return null}}function w(){let b=a();if(b&&typeof b.perms=="object"&&b.perms)return b.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(r){return{}}}function p(b=[]){let r=w();for(let c of b){let h=r==null?void 0:r[c];if(typeof h=="number")return h}}function M(){let b=p(l.owner);return typeof b=="number"?b:5}function m(b){if(!b)return!1;try{if(typeof b.hasPermission=="function"&&b.hasPermission("chanowner"))return!0}catch(r){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(r){}return!1}function T(){let b=f();if(!b)return!1;let r=Number(b.rank);return Number.isFinite(r)?!!(r>=M()||m(b)):!1}let P=0,v=0,S=0,y=2e3,_=8e3,x=45e3,A=12e4,E=_,L=!1,O=null;function U(){if(e("#btfw-vo-css"))return;let b=document.createElement("style");b.id="btfw-vo-css",b.textContent=`
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
    `,document.head.appendChild(b)}function F(b){let r=e("#videowrap");!r||!b||((b.parentElement!==r.parentElement||b.previousElementSibling!==r)&&r.insertAdjacentElement("afterend",b),b.classList.add("btfw-vo-visible"))}function I(){if(!e("#videowrap"))return null;let r=e("#btfw-video-overlay");r||(r=document.createElement("div"),r.id="btfw-video-overlay",r.setAttribute("data-testid","btfw-video-overlay")),r.classList.add("btfw-video-overlay"),r.getAttribute("data-testid")||r.setAttribute("data-testid","btfw-video-overlay"),F(r);let c=r.querySelector("#btfw-vo-bar");c||(c=document.createElement("div"),c.className="btfw-vo-bar",c.id="btfw-vo-bar",r.appendChild(c));let h=K(r,c);return Y(h),Q(h),V(r),r}function V(b){b&&b.querySelectorAll("button").forEach(r=>{r.classList.contains("btfw-vo-btn")||r.classList.add("btfw-vo-btn")})}function K(b,r){let c="btfw-vo-left",h="btfw-vo-right",t=r.querySelector(`#${c}`);t||(t=document.createElement("div"),t.id=c,t.className="btfw-vo-section btfw-vo-section--left",r.insertBefore(t,r.firstChild));let i=r.querySelector(`#${h}`);return i||(i=document.createElement("div"),i.id=h,i.className="btfw-vo-section btfw-vo-section--right",r.appendChild(i)),Array.from(r.children).forEach(n=>{n===t||n===i||i.appendChild(n)}),b.dataset.leftSection=`#${c}`,b.dataset.rightSection=`#${h}`,r.dataset.leftSection=`#${c}`,r.dataset.rightSection=`#${h}`,{left:t,right:i}}function W(){return document.querySelector("#ytapiplayer video, video")}function $(b=W()){return b?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof b.webkitShowPlaybackTargetPicker=="function":!1}function N(){if(!O)return;let b=O._btfwAirplayHandler;if(b){try{O.removeEventListener("webkitplaybacktargetavailabilitychanged",b)}catch(r){}delete O._btfwAirplayHandler}O=null}function G(b){if(!b||typeof b.addEventListener!="function"){N();return}if(O===b)return;N();let r=c=>{let h=!c||c.availability==="available",t=e("#btfw-airplay");t&&(t.style.display=h?"":"none")};try{b.addEventListener("webkitplaybacktargetavailabilitychanged",r),b._btfwAirplayHandler=r,O=b}catch(c){}}function j(){let b=e("#btfw-airplay");if(!b)return;let r=W();if(!$(r)){b.style.display="none",N();return}b.style.display="",G(r)}function re(b,r){r&&r.classList.add("btfw-vo-visible")}function Y(b){if(!(b!=null&&b.right)||!(b!=null&&b.left))return;let r=[];document.querySelector("#fullscreenbtn")||r.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:ee,section:"right"}),r.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:D,section:"right"}),r.forEach(c=>{let h=document.querySelector(`#${c.id}`),t=c.section==="left"?b.left:b.right;if(h)t&&h.parentElement!==t&&t.appendChild(h);else{h=document.createElement("button"),h.id=c.id,h.className="btfw-vo-btn";let i=document.createElement("i");i.className=c.icon,h.appendChild(i),h.title=c.tooltip,h.addEventListener("click",c.action),(t||b.right).appendChild(h)}}),j()}function Q(b){let r=b==null?void 0:b.right;r&&o.forEach(c=>{let h=document.querySelector(c);if(!h)return;if(h.dataset.btfwOverlay==="1"){h.parentElement!==r&&r.appendChild(h);return}let t=document.createElement("span");t.hidden=!0,t.setAttribute("data-btfw-ph",c);try{h.insertAdjacentElement("afterend",t)}catch(i){}if(h.classList.add("btfw-vo-adopted"),h.dataset.btfwOverlay="1",h.id==="mediarefresh"){let i=h.onclick;h.onclick=n=>{n.preventDefault();let d=!!(n&&n.isTrusted);oe(()=>{if(typeof i=="function")try{return i.call(h,n),!0}catch(s){console.warn("[video-overlay] native refresh handler failed:",s)}return!1},{isUserAction:d})}}r.appendChild(h)})}function J(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(b){console.warn("[video-overlay] Media refresh failed:",b)}return!1}function oe(b,r={}){let{isUserAction:c=!1}=r,h=Date.now();if(S&&h-S>A&&(E=_,P=0),h<v){let s=Math.ceil((v-h)/1e3);return H(c?`Refresh available in ${s}s`:`Auto refresh paused. Next attempt in ${s}s`,"warning"),!1}let t=c?y:E;if(S&&h-S<t){let s=t-(h-S),C=Math.ceil(s/1e3);return v=h+s,H(c?`Refresh available in ${C}s`:`Auto refresh paused. Next attempt in ${C}s`,"warning"),!1}if(P++,P>=10)return v=h+3e4,P=0,H("Refresh limit reached. 30s cooldown active.","error"),!1;let i=c?6e3:Math.max(12e3,E+2e3);setTimeout(()=>{P>0&&P--},i);let n=!1;if(typeof b=="function")try{n=b()===!0}catch(s){console.warn("[video-overlay] Refresh handler error:",s)}return n||(n=J()),S=Date.now(),c?E=_:E=Math.min(x,Math.max(_,Math.round(E*(n?1.25:1.5)))),v=Math.max(v,S+(c?y:E)),!c&&n?H(`Auto refresh sent. Next attempt in ${Math.ceil(E/1e3)}s`,"info"):H(n?"Media refreshed":"Unable to refresh media",n?"success":"error"),n}function ee(){let b=e("#videowrap");b&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():b.requestFullscreen?b.requestFullscreen():b.webkitRequestFullscreen?b.webkitRequestFullscreen():b.mozRequestFullScreen&&b.mozRequestFullScreen())}function g(b,r=!0){if(!b||!$(b))return!1;if(b.setAttribute("airplay","allow"),b.setAttribute("x-webkit-airplay","allow"),r&&typeof b.webkitShowPlaybackTargetPicker=="function")try{b.webkitShowPlaybackTargetPicker()}catch(c){console.warn("[video-overlay] AirPlay picker failed:",c)}return j(),!0}function q(){if(!(L||!window.socket)){L=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let b=W();b&&(g(b,!1),G(b)),j()},1e3)})}catch(b){console.warn("[video-overlay] Failed to attach AirPlay listener:",b)}}}function D(){let b=W();return $(b)?g(b)?(H("AirPlay enabled","success"),q(),!0):(H("AirPlay not available","warning"),!1):(j(),H("AirPlay not available","warning"),!1)}function H(b,r="info"){let c=document.getElementById("btfw-notification");c||(c=document.createElement("div"),c.id="btfw-notification",c.className="btfw-notification",document.body.appendChild(c)),c.textContent=b,c.className=`btfw-notification btfw-notification--${r} btfw-notification--show`,clearTimeout(c._hideTimer),c._hideTimer=setTimeout(()=>{c.classList.remove("btfw-notification--show")},3e3)}function Z(){U(),I();let b=[e("#videowrap"),e("#rightcontrols"),e("#leftcontrols"),document.body].filter(Boolean),r=new MutationObserver(()=>I());b.forEach(c=>r.observe(c,{childList:!0,subtree:!0}));try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>I(),0)})}catch(c){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z):Z(),{name:"feature:videoOverlay",toggleFullscreen:ee,enableAirplay:D}});var tt="https://vidprox.movies-storage-a.workers.dev/?url=";function De(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function ve(){return Date.now()}var nt=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var o,u,l;let e=typeof window!="undefined"&&(((o=window.BTFW_CONFIG)==null?void 0:o.corsVideoProxy)||((l=(u=window.BTFW_CONFIG)==null?void 0:u.integrations)==null?void 0:l.corsVideoProxy));if(typeof e=="string"&&e.trim()){let f=e.trim();if(f.includes("?"))return f;let a=f.endsWith("/")?"":"/";return`${f}${a}?url=`}return tt},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(e){try{return new URL(tt).origin.toLowerCase()}catch(o){return""}}},_isTrusted(e){if(!e)return!1;if(String(e).includes(this.CORS_PROXY))return!0;try{let o=new URL(e),u=o.origin.toLowerCase(),l=this._getCorsProxyOrigin();return l&&u===l?!0:/^vidprox\./i.test(o.hostname)}catch(o){return!1}},_unwrapProxiedUrl(e){if(!e||!this._isTrusted(e))return e;try{return new URL(e).searchParams.get("url")||e}catch(o){return e}},_markInternalSrcSet(){this._lastInternalSrcSetAt=ve()},_isInsideInternalWindow(){return ve()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let e=this._getMediaElement();return e?e.crossOrigin==="anonymous"||e.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var o;if(this._hasAnonymousCrossOrigin())return!1;let e=this._readCurrentSrc();if(e&&!this._isTrusted(e))return!1;try{return(o=this.player)==null||o.crossOrigin("anonymous"),!0}catch(u){return!1}},_clearMediaElementForCorsSwap(){let e=this._getMediaElement();if(e)try{for(e.removeAttribute("src"),e.removeAttribute("crossorigin");e.firstChild;)e.removeChild(e.firstChild);e.load()}catch(o){}},_same(e,o){return String(e||"")===String(o||"")},_readCurrentSrc(){var e,o,u;try{let l=((o=(e=this.player)==null?void 0:e.currentSrc)==null?void 0:o.call(e))||"";if(l)return l}catch(l){}return((u=this._getMediaElement())==null?void 0:u.currentSrc)||""},_getMediaElement(){var u;let e=(u=this.player)==null?void 0:u.tech_;if(e){try{let l=typeof e.el=="function"?e.el():null;if(l instanceof HTMLMediaElement&&l.isConnected)return l}catch(l){}if(e.el_ instanceof HTMLMediaElement&&e.el_.isConnected)return e.el_}let o=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return o instanceof HTMLMediaElement&&o.isConnected?o:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(e){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(e){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(e){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(e){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(e){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(e){}this.mergerNode=null}},resetMediaBinding(){var o,u;this.disconnectChain();let e=this._getMediaElement();if(e&&this._syncFromRegistry(e)){((o=this.audioContext)==null?void 0:o.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((u=this.audioContext)==null?void 0:u.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(e){var w;let o=(w=this.player)==null?void 0:w.tech_;if(!(o!=null&&o.el_)||o.el_!==e)return null;let u=e.parentNode;if(!u)return null;let l=e.tagName.toLowerCase()==="audio"?"audio":"video",f=document.createElement(l);f.className=e.className,e.id&&(f.id=e.id),f.setAttribute("playsinline",""),f.setAttribute("webkit-playsinline",""),f.classList.contains("vjs-tech")||f.classList.add("vjs-tech");let a=e.crossOrigin||e.getAttribute("crossorigin");return a&&(f.crossOrigin=a,f.setAttribute("crossorigin",a)),u.replaceChild(f,e),o.el_=f,delete e.__btfwSourceNode,f},_syncFromRegistry(e){let o=De().get(e)||e.__btfwSourceNode||null;return o?(De().set(e,o),this.sourceNode=o,this._sourceMediaElement=e,o.context instanceof AudioContext&&o.context.state!=="closed"&&(this.audioContext=o.context),o):null},_getOrCreateSourceNode(e){let o=De(),u=o.get(e)||e.__btfwSourceNode||null;if(u)return o.set(e,u),this.sourceNode=u,this._sourceMediaElement=e,u.context instanceof AudioContext&&u.context.state!=="closed"&&(this.audioContext=u.context),u;if(this.sourceNode&&this._sourceMediaElement===e)return o.set(e,this.sourceNode),e.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let l;try{l=this.audioContext.createMediaElementSource(e)}catch(f){if(!(f instanceof DOMException)||f.name!=="InvalidStateError")throw f;let a=this._syncFromRegistry(e);if(a)return a;let w=this._swapVideoTechElement(e);if(!w)throw f;let p=this._readCurrentSrc();if(p&&this.player){this._markInternalSrcSet(),this.player.src({src:p,type:"video/mp4"});try{this.player.load()}catch(M){}}return this._getOrCreateSourceNode(w)}return o.set(e,l),e.__btfwSourceNode=l,this.sourceNode=l,this._sourceMediaElement=e,l},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(e){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(e){return!1}},_clearCrossOriginAttribute(){var o,u;let e=this._getMediaElement();if(e)try{e.crossOrigin=null,e.removeAttribute("crossorigin")}catch(l){}try{(u=(o=this.player)==null?void 0:o.crossOrigin)==null||u.call(o,null)}catch(l){}},cleanup(){this.disconnectChain();let e=this._getMediaElement();e&&(e.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let e=this._readCurrentSrc();return this.sourceNode&&e&&!this._isTrusted(e)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(e,{currentTime:o=0,wasPlaying:u=!1,clearCrossOrigin:l=!1}={}){if(!this.player||!e)return Promise.resolve(!1);let f=this.player;try{this.player.pause()}catch(a){}l&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:e,type:"video/mp4"});try{this.player.load()}catch(a){}return new Promise(a=>{let w=!1,p=()=>{if(w)return;w=!0;try{f.off("canplay",M)}catch(T){}try{f.off("loadeddata",M)}catch(T){}try{f.currentTime(o)}catch(T){}let m=u?f.play():Promise.resolve();Promise.resolve(m).catch(()=>{}).finally(()=>a(!0))},M=()=>p();try{f.one("canplay",M)}catch(m){try{f.on("canplay",M)}catch(T){}}try{f.one("loadeddata",M)}catch(m){}typeof f.ready=="function"&&f.ready(()=>{try{typeof f.readyState=="function"&&f.readyState()>=2&&p()}catch(m){}}),setTimeout(p,5e3)})},startWatchdog(){if(!this.player)return;let e=this.player;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let u=new MutationObserver(()=>{this._checkAndReapply("sources")});u.observe(o,{childList:!0,subtree:!0}),this._sourceObserver=u}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([u,l])=>{e.on(u,l)})}catch(u){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;this._stopWatchdogInterval();let e=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(u){}try{(o=this._sourceObserver)==null||o.disconnect()}catch(u){}this._sourceObserver=null,this._mutationObserver=null}if(e&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([u,l])=>{e.off(u,l)})}catch(u){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(e){if(!this.player)return;let o=this._readCurrentSrc();if(o&&(this._lastKnownSrc=o,!this._isInsideInternalWindow())){if(this._isTrusted(o)){this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(ve()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=ve(),this._forceProxyPreservingState(o)}}},async _forceProxyPreservingState(e){if(!this.player)return!1;let o=this.player,u=o.currentTime(),l=!o.paused();if(this._isTrusted(e))return this.isProxied=!0,this.proxiedSrc=e,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(e)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(e)||e,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(f){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(f){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(f){}return new Promise(f=>{let a=!1,w=()=>{if(!a){a=!0;try{o.off("canplay",p)}catch(M){}try{o.off("loadeddata",p)}catch(M){}try{o.currentTime(u)}catch(M){}this.isProxied=!0,l&&o.play().catch(()=>{}),f(!0)}},p=()=>w();try{o.one("canplay",p)}catch(M){try{o.on("canplay",p)}catch(m){}}try{o.one("loadeddata",p)}catch(M){}typeof o.ready=="function"&&o.ready(()=>{try{typeof o.readyState=="function"&&o.readyState()>=2&&w()}catch(M){}}),setTimeout(w,5e3)})},async ensureProxy(){if(!this.player)return!1;let e=this.player,o=this._readCurrentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let u=e.currentTime(),l=!e.paused();try{e.pause()}catch(f){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),e.src({src:o,type:"video/mp4"});try{e.load()}catch(f){}return new Promise(f=>{e.ready(()=>{try{e.currentTime(u)}catch(a){}l&&e.play().catch(()=>{}),f(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var o,u;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let l=this._readCurrentSrc();if(this._isTrusted(l))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let e=this._getMediaElement();if(!e)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((o=this.audioContext)==null?void 0:o.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),e.disableRemotePlayback=!0;let l=this._getOrCreateSourceNode(e),f=this.audioContext;if(!f)return!1;let a=l;if(this.normalizationEnabled){this.compressorNode=f.createDynamicsCompressor();let w=(u=this.NORM_PRESETS[this.currentNormPreset])!=null?u:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(w.threshold,f.currentTime),this.compressorNode.knee.setValueAtTime(w.knee,f.currentTime),this.compressorNode.ratio.setValueAtTime(w.ratio,f.currentTime),this.compressorNode.attack.setValueAtTime(w.attack,f.currentTime),this.compressorNode.release.setValueAtTime(w.release,f.currentTime),a.connect(this.compressorNode),a=this.compressorNode}return this.monoEnabled&&(this.splitterNode=f.createChannelSplitter(2),this.monoMixGain=f.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=f.createChannelMerger(2),a.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),a=this.mergerNode),this.boostEnabled&&(this.gainNode=f.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,a.connect(this.gainNode),a=this.gainNode),a.connect(f.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(l){return console.error("[BTFW_AUDIO] Error building audio chain:",l),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(e){return this.NORM_PRESETS[e]?(this.currentNormPreset=e,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(e){return this.BOOST_MULTIPLIER=e,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()}};(function(){"use strict";let e=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),o=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),u="--btfw-boost-anchor",l="--btfw-norm-anchor";function f(w,p,M){if(o&&M){p.style.setProperty("anchor-name",M),w.style.setProperty("position-anchor",M),w.style.setProperty("top","anchor(bottom)"),w.style.setProperty("left","anchor(left)");return}let m=p.getBoundingClientRect();w.style.left=m.left+"px",w.style.top=m.bottom+"px"}function a(w){window.BTFW&&typeof BTFW.define=="function"?w():setTimeout(()=>a(w),0)}a(function(){BTFW.define("feature:audio",[],async()=>{let w=(n,d=document)=>d.querySelector(n),p=nt,M=null,m=null,T=null,P=!1,v=!1,S=!1,y=null,_=null,x=null,A=null,E=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function L(n){M&&(n?(M.classList.add("active"),M.style.background="rgba(46, 213, 115, 0.3)",M.style.borderColor="#2ed573",M.style.color="#2ed573",M.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(M.classList.remove("active"),M.style.background="",M.style.borderColor="",M.style.color="",M.style.boxShadow=""))}function O(n,d="info"){let s=w("#btfw-audioboost-toast");s||(s=document.createElement("div"),s.id="btfw-audioboost-toast",s.style.cssText=`
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
          `,document.body.appendChild(s)),s.textContent=n,s.style.background=d==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",s.style.opacity="1",setTimeout(()=>{s.style.opacity="0"},2e3)}async function U(){if(await p.enableBoost()){P=!0;let d=Math.round(p.BOOST_MULTIPLIER*100);O(`Boosted by ${d}%`,"success"),L(!0)}else{let d=p._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";O(d,"error")}}async function F(){await p.disableBoost(),P=!1,L(!1)}function I(n){m&&(n?(m.classList.add("active"),m.style.background="rgba(52, 152, 219, 0.3)",m.style.borderColor="#3498db",m.style.color="#3498db",m.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(m.classList.remove("active"),m.style.background="",m.style.borderColor="",m.style.color="",m.style.boxShadow=""))}function V(n,d="info"){let s=w("#btfw-audionorm-toast");s||(s=document.createElement("div"),s.id="btfw-audionorm-toast",s.style.cssText=`
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
          `,document.body.appendChild(s)),s.textContent=n,s.style.background=d==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",s.style.opacity="1",setTimeout(()=>{s.style.opacity="0"},2e3)}async function K(){if(await p.enableNormalization())v=!0,V("Normalization enabled","success"),I(!0);else{let d=p._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";V(d,"error")}}async function W(){await p.disableNormalization(),v=!1,I(!1)}function $(n){T&&(n?(T.classList.add("active"),T.style.background="rgba(155, 89, 182, 0.3)",T.style.borderColor="#9b59b6",T.style.color="#9b59b6",T.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(T.classList.remove("active"),T.style.background="",T.style.borderColor="",T.style.color="",T.style.boxShadow=""))}function N(n,d="info"){let s=w("#btfw-mono-toast");s||(s=document.createElement("div"),s.id="btfw-mono-toast",s.style.cssText=`
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
          `,document.body.appendChild(s)),s.textContent=n,s.style.background=d==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",s.style.opacity="1",setTimeout(()=>{s.style.opacity="0"},2e3)}async function G(){if(await p.enableMono())S=!0,N("Stereo audio enabled","success"),$(!0);else{let d=p._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";N(d,"error")}}async function j(){await p.disableMono(),S=!1,$(!1)}function re(){let n=document.createElement("button");n.id="btfw-vo-audioboost",n.className="btn btn-sm btn-default btfw-vo-adopted";let d=Math.round(p.BOOST_MULTIPLIER*100);n.title=`Toggle Audio Boost (${d}%)`,n.setAttribute("data-btfw-overlay","1");let s=document.createElement("i");return s.className="fa fa-bullhorn",n.appendChild(s),n.addEventListener("click",()=>{p.boostEnabled?F():U()}),n.addEventListener("mouseenter",()=>{x&&(clearTimeout(x),x=null),oe()}),n.addEventListener("mouseleave",()=>{x=setTimeout(()=>ee(),150)}),n}function Y(){let n=document.createElement("button");n.id="btfw-vo-audionorm",n.className="btn btn-sm btn-default btfw-vo-adopted";let d=p.NORM_PRESETS[p.currentNormPreset].label;n.title=`Toggle Audio Normalization (${d})`,n.setAttribute("data-btfw-overlay","1");let s=document.createElement("i");return s.className="fa fa-sliders",n.appendChild(s),n.addEventListener("click",()=>{p.normalizationEnabled?W():K()}),n.addEventListener("mouseenter",()=>{A&&(clearTimeout(A),A=null),D()}),n.addEventListener("mouseleave",()=>{A=setTimeout(()=>H(),150)}),n}function Q(){let n=document.createElement("button");n.id="btfw-vo-mono",n.className="btn btn-sm btn-default btfw-vo-adopted",n.title="Toggle Mono Audio (mix both channels to stereo)",n.setAttribute("data-btfw-overlay","1");let d=document.createElement("i");return d.className="fa fa-headphones",n.appendChild(d),n.addEventListener("click",()=>{p.monoEnabled?j():G()}),n}function J(){if(y)return y;let n=document.createElement("div");return n.id="btfw-boost-context-menu",e&&(n.popover="auto"),n.style.cssText=`
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
        `,E.forEach(d=>{let s=document.createElement("button");s.className="btfw-context-item",s.textContent=d.label,s.style.cssText=`
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
          `,p.BOOST_MULTIPLIER===d.multiplier&&(s.style.background="rgba(46, 213, 115, 0.2)",s.style.color="#2ed573"),s.addEventListener("mouseenter",()=>{p.BOOST_MULTIPLIER!==d.multiplier&&(s.style.background="rgba(109, 77, 246, 0.2)")}),s.addEventListener("mouseleave",()=>{p.BOOST_MULTIPLIER!==d.multiplier&&(s.style.background="transparent")}),s.addEventListener("click",async()=>{if(await p.setBoostMultiplier(d.multiplier),g(),M){let C=Math.round(d.multiplier*100);M.title=`Toggle Audio Boost (${C}%)`}p.boostEnabled&&O(`Boost set to ${d.label}`,"success")}),n.appendChild(s)}),n.addEventListener("mouseenter",()=>{x&&(clearTimeout(x),x=null)}),n.addEventListener("mouseleave",()=>{x=setTimeout(()=>ee(),100)}),document.body.appendChild(n),y=n,n}function oe(){if(!M)return;let n=J();f(n,M,u),e?n.matches(":popover-open")||n.showPopover():n.style.display="block"}function ee(){y&&(e?y.matches(":popover-open")&&y.hidePopover():y.style.display="none")}function g(){if(!y)return;y.querySelectorAll(".btfw-context-item").forEach((d,s)=>{let C=E[s];p.BOOST_MULTIPLIER===C.multiplier?(d.style.background="rgba(46, 213, 115, 0.2)",d.style.color="#2ed573"):(d.style.background="transparent",d.style.color="#e0e0e0")})}function q(){if(_)return _;let n=document.createElement("div");return n.id="btfw-norm-context-menu",e&&(n.popover="auto"),n.style.cssText=`
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
        `,Object.keys(p.NORM_PRESETS).forEach(d=>{let s=p.NORM_PRESETS[d],C=document.createElement("button");C.className="btfw-context-item",C.textContent=s.label,C.style.cssText=`
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
          `,p.currentNormPreset===d&&(C.style.background="rgba(52, 152, 219, 0.2)",C.style.color="#3498db"),C.addEventListener("mouseenter",()=>{p.currentNormPreset!==d&&(C.style.background="rgba(109, 77, 246, 0.2)")}),C.addEventListener("mouseleave",()=>{p.currentNormPreset!==d&&(C.style.background="transparent")}),C.addEventListener("click",async()=>{await p.setNormPreset(d),Z(),m&&(m.title=`Toggle Audio Normalization (${s.label})`),p.normalizationEnabled&&V(`Preset: ${s.label}`,"success")}),n.appendChild(C)}),n.addEventListener("mouseenter",()=>{A&&(clearTimeout(A),A=null)}),n.addEventListener("mouseleave",()=>{A=setTimeout(()=>H(),100)}),document.body.appendChild(n),_=n,n}function D(){if(!m)return;let n=q();f(n,m,l),e?n.matches(":popover-open")||n.showPopover():n.style.display="block"}function H(){_&&(e?_.matches(":popover-open")&&_.hidePopover():_.style.display="none")}function Z(){if(!_)return;let n=_.querySelectorAll(".btfw-context-item");Object.keys(p.NORM_PRESETS).forEach((d,s)=>{let C=n[s];p.currentNormPreset===d?(C.style.background="rgba(52, 152, 219, 0.2)",C.style.color="#3498db"):(C.style.background="transparent",C.style.color="#e0e0e0")})}function b(){let n=w("#btfw-vo-left");if(!n)return!1;let d=w("#btfw-vo-audioboost");d&&d.remove();let s=w("#btfw-vo-audionorm");s&&s.remove();let C=w("#btfw-vo-mono");return C&&C.remove(),M=re(),m=Y(),T=Q(),n.appendChild(M),n.appendChild(m),n.appendChild(T),!0}function r(n,d=20){let s=d*500;me(()=>w("#btfw-vo-left")?!0:null,{timeoutMs:s}).then(()=>{b(),n()}).catch(()=>{b()&&n()})}function c(){Promise.all([me(()=>typeof videojs!="undefined"?videojs:null),ue("#ytapiplayer")]).then(([n])=>{p.player=n("ytapiplayer"),p.originalSrc=p._readCurrentSrc(),p.startWatchdog()}).catch(()=>{})}function h(){setTimeout(()=>{p.resetMediaBinding(),p.boostEnabled=!1,p.normalizationEnabled=!1,p.monoEnabled=!1,p.isProxied=!1,L(!1),I(!1),$(!1),c(),P&&setTimeout(()=>{U()},1200),v&&setTimeout(()=>{K()},1200),S&&setTimeout(()=>{G()},1200)},600)}function t(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>p._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>p._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",h))}function i(){r(()=>{c()}),t()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i(),{name:"feature:audio",activate:U,deactivate:F,isActive:()=>p.boostEnabled,activateNormalization:K,deactivateNormalization:W,isNormalizationActive:()=>p.normalizationEnabled,activateMono:G,deactivateMono:j,isMonoActive:()=>p.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async w=>w.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:e})=>{let o=await e("util:tmdb-proxy"),u="movie-info",l={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},f="btfw-movie-info-style",a={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},w=0,p=!1,M=null;function m(r){typeof r=="function"&&a.cleanup.push(r)}function T(){for(;a.cleanup.length;){let r=a.cleanup.pop();try{r()}catch(c){}}a.header&&(a.header.remove(),a.header=null)}function P(){a.hideTimer&&(clearTimeout(a.hideTimer),a.hideTimer=null),a.initTimer&&(clearTimeout(a.initTimer),a.initTimer=null),a.socketRetryTimer&&(clearTimeout(a.socketRetryTimer),a.socketRetryTimer=null),w=0,a.currentTitle="",a.isInitialized=!1,T()}function v(r){if(typeof r=="boolean")return r;if(typeof r=="number")return Number.isFinite(r)?r>0:!1;if(typeof r=="string"){let c=r.trim().toLowerCase();return c?c==="1"||c==="true"||c==="yes"||c==="on":!1}return!1}function S(){let r=[()=>{var c,h,t;return(t=(h=(c=window.BTFW_THEME_ADMIN)==null?void 0:c.integrations)==null?void 0:h.movieInfo)==null?void 0:t.enabled},()=>{var c,h,t;return(t=(h=(c=window.BTFW_CONFIG)==null?void 0:c.integrations)==null?void 0:h.movieInfo)==null?void 0:t.enabled},()=>{var c,h;return(h=(c=window.BTFW_CONFIG)==null?void 0:c.movieInfo)==null?void 0:h.enabled},()=>{var c;return(c=window.BTFW_CONFIG)==null?void 0:c.movieInfoEnabled},()=>{var c,h;return(h=(c=document==null?void 0:document.body)==null?void 0:c.dataset)==null?void 0:h.btfwMovieInfoEnabled}];for(let c of r)try{let h=typeof c=="function"?c():c;if(v(h))return!0}catch(h){}return!1}function y(){if(M||typeof MutationObserver!="function")return;let r=document.body;r&&(M=new MutationObserver(()=>E()),M.observe(r,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function _(){if(p)return;p=!0;let r=()=>E();document.addEventListener("btfw:channelIntegrationsChanged",r),document.addEventListener("btfw:ready",r)}function x(r=0){a.initTimer&&(clearTimeout(a.initTimer),a.initTimer=null),a.initTimer=window.setTimeout(()=>{a.initTimer=null,S()&&A()},Math.max(0,r))}function A(){if(a.isInitialized)return;let r=document.querySelector(l.TOPBAR_SELECTOR);if(!r){x(500);return}try{L(r),Z(),U(),a.isInitialized=!0,setTimeout(()=>{G(),j()},120)}catch(c){x(800)}}function E(){S()?a.isInitialized?(G(),setTimeout(j,80)):x(0):P()}function L(r){if(!r&&(r=document.querySelector(l.TOPBAR_SELECTOR),!r))throw new Error("Chat topbar not found");let c=document.getElementById(l.CONTAINER_ID);c&&c.remove();let h=document.createElement("div");h.id=l.CONTAINER_ID,h.className="btfw-movie-header hide",h.dataset.module=u,r.insertAdjacentElement("afterend",h),a.header=h}function O(){try{return window.socket||window.SOCKET||null}catch(r){return null}}function U(){F(),K();let r=H(G,250);window.addEventListener("resize",r),m(()=>window.removeEventListener("resize",r))}function F(){I(),V()}function I(){let r=document.querySelector(l.TITLE_SELECTOR);if(r){let c=()=>$(),h=()=>N();r.addEventListener("mouseenter",c),r.addEventListener("mouseleave",h),m(()=>{r.removeEventListener("mouseenter",c),r.removeEventListener("mouseleave",h)})}else if(typeof MutationObserver=="function"){let c=new MutationObserver(()=>{document.querySelector(l.TITLE_SELECTOR)&&(c.disconnect(),I())});c.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),m(()=>{try{c.disconnect()}catch(h){}})}}function V(){let r=a.header;if(!r)return;let c=()=>W(),h=()=>N();r.addEventListener("mouseenter",c),r.addEventListener("mouseleave",h),m(()=>{r.removeEventListener("mouseenter",c),r.removeEventListener("mouseleave",h)})}function K(){let r=O();if(r&&typeof r.on=="function"){r.on("changeMedia",j),m(()=>{var c,h;try{(c=r.off)==null||c.call(r,"changeMedia",j)}catch(t){try{(h=r.removeListener)==null||h.call(r,"changeMedia",j)}catch(i){}}});return}me(()=>{if(!S())return null;let c=O();return c&&typeof c.on=="function"?c:null},{timeoutMs:1e4}).then(c=>{a.socketRetryTimer=null,c.on("changeMedia",j),m(()=>{var h,t;try{(h=c.off)==null||h.call(c,"changeMedia",j)}catch(i){try{(t=c.removeListener)==null||t.call(c,"changeMedia",j)}catch(n){}}})}).catch(()=>{a.socketRetryTimer=null}),m(()=>{a.socketRetryTimer&&(clearTimeout(a.socketRetryTimer),a.socketRetryTimer=null)})}function W(){a.hideTimer&&(clearTimeout(a.hideTimer),a.hideTimer=null)}function $(){W(),a.header&&(a.header.classList.remove("hide"),a.header.classList.add("show"))}function N(){W(),a.hideTimer=window.setTimeout(()=>{a.header&&(a.header.classList.remove("show"),a.header.classList.add("hide"),setTimeout(()=>{a.header&&a.header.classList.contains("hide")&&a.header.classList.remove("hide")},320))},300)}function G(){if(!a.header)return;let r=window.innerWidth<=768;a.header.classList.toggle("btfw-mobile",r)}async function j(){var i;if(!a.isInitialized)return;let r=document.querySelector(l.TITLE_SELECTOR),c=a.header;if(!r||!c)return;let h=((i=r.textContent)==null?void 0:i.trim())||"";if(!h){a.currentTitle="",oe();return}if(h===a.currentTitle)return;a.currentTitle=h;let t=++w;Q();try{let n=await Y(h);if(t!==w)return;g(n)}catch(n){if(t!==w)return;o.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),J()}}function re(r){let c=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],h=r;return c.forEach(t=>{let i=new RegExp(`\\b${t}\\b`,"gi");h=h.replace(i,"")}),h.replace(/\s{2,}/g," ").trim()}async function Y(r){var d;if(!o.isAvailable())throw new Error(o.MISSING_PROXY_MSG);let c=r.match(/(.+)\s*\((\d{4})\)/),h=c?c[1].trim():r,t=c?c[2]:"";t||(c=r.match(/(.+?)\s+(\d{4})\s*$/),c&&(h=c[1].trim(),t=c[2]));let i=re(h),n=await o.tmdbFetch("search/movie",{query:i,year:t});if(((d=n==null?void 0:n.results)==null?void 0:d.length)>0){let s=n.results[0];return{title:r,backdrop:s.backdrop_path?`https://image.tmdb.org/t/p/w1280${s.backdrop_path}`:null,poster:s.poster_path?`https://image.tmdb.org/t/p/w500${s.poster_path}`:null,summary:s.overview||"",rating:s.vote_average||0,releaseDate:s.release_date||"",voteCount:s.vote_count||0}}return{title:r,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function Q(){if(!a.header)return;ee();let r=document.createElement("div");r.className="btfw-movie-content";let c=document.createElement("div");c.className="btfw-movie-loading";let h=document.createElement("i");h.className="fa fa-spinner fa-spin";let t=document.createElement("p");t.textContent="Loading movie information...",c.append(h,t),r.appendChild(c),a.header.replaceChildren(r)}function J(){if(!a.header)return;ee();let r=document.createElement("div");r.className="btfw-movie-content";let c=document.createElement("div");c.className="btfw-movie-error";let h=document.createElement("i");h.className="fa fa-exclamation-triangle";let t=document.createElement("p");t.textContent="Unable to fetch movie information";let i=document.createElement("small");i.textContent="Check TMDB API key in Theme Settings",c.append(h,t,i),r.appendChild(c),a.header.replaceChildren(r)}function oe(){if(!a.header)return;ee();let r=document.createElement("div");r.className="btfw-movie-content";let c=document.createElement("p");c.textContent="No movie information available",r.appendChild(c),a.header.replaceChildren(r)}function ee(){a.header&&(a.header.style.backgroundImage="",a.header.style.backgroundColor="")}function g(r){if(!a.header)return;a.header.replaceChildren(),l.ENABLE_BACKDROP&&r.backdrop?(a.header.style.backgroundImage=`url(${r.backdrop})`,a.header.style.backgroundSize="cover",a.header.style.backgroundPosition="center"):ee();let c=document.createElement("div");c.className="btfw-movie-overlay",a.header.appendChild(c);let h=document.createElement("div");if(h.className="btfw-movie-content",a.header.appendChild(h),r.poster){let n=document.createElement("img");n.src=r.poster,n.alt=`${r.title} Poster`,n.className="btfw-movie-poster",h.appendChild(n)}let t=document.createElement("div");t.className="btfw-movie-details",h.appendChild(t);let i=document.createElement("h2");if(i.textContent=r.title,i.className="btfw-movie-title",t.appendChild(i),l.SHOW_SUMMARY&&r.summary){let n=document.createElement("p");n.textContent=r.summary,n.className="btfw-movie-summary",t.appendChild(n)}if(l.ENABLE_RATING&&r.rating>0){let n=q(r.rating,r.voteCount);h.appendChild(n)}}function q(r,c){let h=document.createElement("div");h.className="btfw-movie-rating";let t=Math.round(r*10),i=D(t),n="http://www.w3.org/2000/svg",d=document.createElementNS(n,"svg");d.setAttribute("width","60"),d.setAttribute("height","60"),d.setAttribute("viewBox","0 0 60 60");let s=25,C=2*Math.PI*s,R=C-r/10*C,k=document.createElementNS(n,"circle");k.setAttribute("cx","30"),k.setAttribute("cy","30"),k.setAttribute("r",s.toString()),k.setAttribute("stroke","#2a2a2a"),k.setAttribute("stroke-width","4"),k.setAttribute("fill","#1a1a1a"),d.appendChild(k);let B=document.createElementNS(n,"circle");B.setAttribute("cx","30"),B.setAttribute("cy","30"),B.setAttribute("r",s.toString()),B.setAttribute("stroke",i),B.setAttribute("stroke-width","3"),B.setAttribute("fill","none"),B.setAttribute("stroke-dasharray",C.toString()),B.setAttribute("stroke-dashoffset",R.toString()),B.setAttribute("transform","rotate(-90 30 30)"),B.setAttribute("stroke-linecap","round"),d.appendChild(B);let z=document.createElementNS(n,"text");if(z.setAttribute("x","50%"),z.setAttribute("y","50%"),z.setAttribute("text-anchor","middle"),z.setAttribute("dominant-baseline","central"),z.setAttribute("fill","#fff"),z.setAttribute("font-size","10"),z.setAttribute("font-weight","bold"),z.textContent=`${t}%`,d.appendChild(z),h.appendChild(d),c>0){let X=document.createElement("div");X.className="btfw-movie-votes",X.textContent=`${c.toLocaleString()} votes`,h.appendChild(X)}return h}function D(r){let c=Math.max(0,Math.min(r,100));return c>=70?"#4caf50":c>=50?"#ff9800":"#f44336"}function H(r,c){let h=null;return function(...i){h&&clearTimeout(h),h=setTimeout(()=>{h=null,r(...i)},c)}}function Z(){if(document.getElementById(f))return;let r=`
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
      ${l.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,c=document.createElement("style");c.id=f,c.textContent=r,document.head.appendChild(c)}function b(){y(),_(),E()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",b,{once:!0}):b(),{name:"feature:movie-info",refresh:E,cleanup:P}});BTFW.define("feature:monkeyPaw",[],async()=>{let e="btfw-monkey-paw-styles",o="btfw-monkey-paw-overlay",u="/src/assets/monkey-paw/paw.svg",l={"f-pinky":{root:"rotate(-8deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-ring":{root:"rotate(-4deg) scaleY(0.28)",tip:"rotate(0deg) scaleY(0)"},"f-index":{root:"rotate(5deg) scaleY(0.3)",tip:"rotate(0deg) scaleY(0)"},"f-thumb":{root:"rotate(80deg) scaleY(1)",tip:"rotate(70deg) scaleY(1)"}},f={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},a={"f-pinky":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-ring":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-index":{root:"rotate(0deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"},"f-thumb":{root:"rotate(-18deg) scaleY(1)",tip:"rotate(0deg) scaleY(1)"}},w=null,p=null,M=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function m(L){let O=String(L||"").trim();return/^<svg[\s>]/i.test(O)?!M.test(O):!1}function T(L){return new Promise(O=>setTimeout(O,L))}function P(){try{let L=typeof window!="undefined"?window.BTFW:null;return L&&(L.BASE||L.DEV_CDN)||""}catch(L){return""}}function v(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(L){return!1}}function S(){if(typeof document=="undefined"||document.getElementById(e))return;let L=document.createElement("style");L.id=e,L.textContent=`
      #${o} {
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

      #${o}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${o}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${o}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${o} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${o} .btfw-monkey-paw-title {
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

      #${o} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${o} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${o} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${o} .f-tip {
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

      #${o} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${o} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${o} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${o} .f-root,
        #${o} .f-tip,
        #${o} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(L)}async function y(){if(w)return w;let O=`${P()}${u}`,U=await fetch(O,{credentials:"omit"});if(!U.ok)throw new Error(`Monkey paw SVG failed to load (${U.status})`);let F=await U.text();if(!m(F))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return w=F,w}function _(L){Object.entries(a).forEach(([O,U])=>{let F=L.querySelector(`#${O}`),I=L.querySelector(`#${O}-tip`);F&&(F.style.transform=U.root),I&&(I.style.transform=U.tip)})}function x(L){Object.entries(l).forEach(([O,U])=>{window.setTimeout(()=>{let F=L.querySelector(`#${O}`),I=L.querySelector(`#${O}-tip`);F&&(F.style.transform=U.root),I&&window.setTimeout(()=>{I.style.transform=U.tip},120)},f[O])})}function A(L){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${L}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function E(L={}){if(p)return p;if(typeof document!="undefined")return p=(async()=>{var V,K;if(S(),v()){await T((V=L.reducedMotionMs)!=null?V:450);return}let O=document.getElementById(o);O||(O=document.createElement("div"),O.id=o,document.body.appendChild(O));let U;try{U=await y()}catch(W){console.warn("[monkey-paw] SVG load failed:",W),await T(300);return}O.innerHTML=A(U),_(O);let F=O.querySelector("#paw"),I=O.querySelector("#btfw-monkey-paw-msg");O.classList.remove("is-cursed"),I==null||I.classList.remove("is-visible"),requestAnimationFrame(()=>O.classList.add("is-active")),x(O),await T(980),F==null||F.classList.add("btfw-monkey-paw-shaking"),await T(720),F==null||F.classList.remove("btfw-monkey-paw-shaking"),O.classList.add("is-cursed"),I==null||I.classList.add("is-visible"),await T((K=L.holdMs)!=null?K:1100),O.classList.remove("is-active"),await T(320),O.remove()})().finally(()=>{p=null}),p}return{name:"feature:monkeyPaw",play:E}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:e})=>{let o=await e("util:tmdb-proxy"),u=await e("feature:monkeyPaw"),l=(g,q=document)=>q.querySelector(g),f=(g,q=document)=>Array.from(q.querySelectorAll(g)),a=null,w=null,p=null,M=null,m={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},T=null,P=null,v="[movie-suggestion]";function S(...g){console.log(v,...g)}function y(...g){console.error(v,...g)}function _(g){var q;try{if((q=window.socket)!=null&&q.emit)return window.socket.emit("chatMsg",{msg:g}),!0}catch(D){}return!1}async function x(g,q={}){return o.workerFetch(g,q)}function A(){if(document.getElementById("btfw-movie-suggest-styles"))return;let g=document.createElement("style");g.id="btfw-movie-suggest-styles",g.textContent=`
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
    `,document.head.appendChild(g)}let E=(CLIENT==null?void 0:CLIENT.rank)||0;function L(){let g=l("a[href*='donate'], #donate-btn, .donate-btn");if(g){let D=g.closest("ul");if(D)return{ul:D,insertAfter:g.parentElement}}let q=l("#btfw-theme-btn-nav");if(q){let D=q.closest("ul");if(D)return{ul:D,insertAfter:null}}return{ul:l(".navbar .nav.navbar-nav")||l(".navbar-nav")||l(".btfw-navbar ul")||l(".navbar ul"),insertAfter:null}}function O(){if(l("#btfw-movie-suggest-btn"))return!0;let g=L();if(!g.ul)return!1;let q=document.createElement("li"),D=document.createElement("a");return D.href="javascript:void(0)",D.className="btfw-nav-pill",D.id="btfw-movie-suggest-btn",D.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,q.appendChild(D),g.insertAfter?g.insertAfter.after(q):g.ul.insertBefore(q,g.ul.firstChild),D.addEventListener("click",Y),!0}function U(){var H,Z,b,r,c,h;if(l("#btfw-movie-suggest-modal"))return;let g=document.createElement("div");g.id="btfw-movie-suggest-modal",g.className="modal",g.innerHTML=`
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
                     placeholder="${E===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${E===0?"disabled":""}>
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
    `,document.body.appendChild(g);let q=l(".modal-background",g),D=l(".delete",g);if(q.addEventListener("click",Q),D.addEventListener("click",Q),(H=l("#btfw-movie-prev",g))==null||H.addEventListener("click",()=>{m.page>1&&(m.page-=1,N())}),(Z=l("#btfw-movie-next",g))==null||Z.addEventListener("click",()=>{m.page<m.totalPages&&(m.page+=1,N())}),E===0){let t=l("#btfw-movie-search",g);t.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),t.blur()})}else{let t,i=l("#btfw-movie-search",g);i.addEventListener("input",()=>{clearTimeout(t),m.query=i.value.trim(),m.page=1,t=setTimeout(()=>N(),400)}),(b=l("#btfw-movie-sort",g))==null||b.addEventListener("change",n=>{m.sortBy=n.target.value,m.page=1,N()}),(r=l("#btfw-movie-genre",g))==null||r.addEventListener("change",n=>{m.genreId=n.target.value,m.page=1,N()}),(c=l("#btfw-movie-year",g))==null||c.addEventListener("change",n=>{m.year=n.target.value.trim(),m.page=1,N()}),(h=l("#btfw-movie-rating",g))==null||h.addEventListener("change",n=>{m.minRating=n.target.value.trim(),m.page=1,N()})}}function F(){if(l("#btfw-movie-confirm-modal"))return;let g=document.createElement("div");g.id="btfw-movie-confirm-modal",g.className="modal",g.innerHTML=`
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
    `,document.body.appendChild(g);let q=l(".modal-background",g),D=l(".delete",g),H=l("#btfw-movie-cancel",g),Z=l("#btfw-movie-confirm",g),b=()=>re();q.addEventListener("click",b),D.addEventListener("click",b),H.addEventListener("click",b),Z.addEventListener("click",oe)}async function I(){if(T&&P)return;let[g,q]=await Promise.all([x("/api/meta"),x("/api/genres")]);T=g,P=q;let D=l("#btfw-movie-suggest-modal");if(!D)return;let H=l("#btfw-movie-sort",D);if(H&&H.options.length===0){for(let b of g.sortOptions||[]){let r=document.createElement("option");r.value=b.value,r.textContent=b.label,H.appendChild(r)}H.value=m.sortBy}let Z=l("#btfw-movie-genre",D);if(Z&&Z.options.length<=1)for(let b of q.genres||[]){let r=document.createElement("option");r.value=String(b.id),r.textContent=b.name,Z.appendChild(r)}}function V(){let g={page:m.page,sort_by:m.sortBy};return m.query?(g.query=m.query,m.year&&(g.primary_release_year=m.year,g.year=m.year)):(m.genreId&&(g.with_genres=m.genreId),m.year&&(g.primary_release_year=m.year),m.minRating&&(g["vote_average.gte"]=m.minRating)),g}function K(g){return!g||g==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${g}`}function W(){let g=l("#btfw-movie-suggest-modal");if(!g)return;let q=l("#btfw-movie-prev",g),D=l("#btfw-movie-next",g),H=l("#btfw-movie-page-label",g);H&&(H.textContent=`Page ${m.page} of ${m.totalPages}`),q&&(q.disabled=m.page<=1||m.loading),D&&(D.disabled=m.page>=m.totalPages||m.loading)}function $(g){let q=l("#btfw-movie-suggest-modal");if(!q)return;let D=l(".btfw-movie-results",q);if(!g.length){D.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}D.innerHTML=g.map(H=>`
      <div class="movie-result"
           data-id="${ie(H.id)}"
           data-title="${ie(H.title)}"
           data-poster="${ie(H.posterPath||"")}"
           data-year="${ie(H.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${ie(K(H.posterPath))}" alt="${ie(H.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${ie(H.title)}</div>
          <small style="opacity:0.7;">${ie(H.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),f(".movie-result",D).forEach(H=>{H.addEventListener("click",()=>{a=H.dataset.id,w=H.dataset.title,p=H.dataset.poster,M=H.dataset.year||null;let Z=l("#btfw-movie-confirm-modal");if(!Z)return;let b=M?` (${M})`:"";l("#btfw-confirm-movie-title",Z).textContent=`${w}${b}`,j()})})}async function N(){let g=l("#btfw-movie-suggest-modal");if(!g||m.loading)return;m.loading=!0,W();let q=l(".btfw-movie-results",g);q.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await I();let D=await x("/api/search",{params:V()});m.totalPages=Math.max(1,D.totalPages||1),$(D.results||[]),S("runSearch",{page:m.page,totalPages:m.totalPages,count:(D.results||[]).length})}catch(D){y("runSearch failed:",D),q.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{m.loading=!1,W()}}async function G(){let g=l("#btfw-movie-history");if(g){g.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let D=(await x("/api/history",{params:{page:1,limit:10}})).results||[];if(!D.length){g.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}g.innerHTML=D.map(H=>{let Z=H.releaseYear?` (${ie(H.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${ie(K(H.posterPath).replace("w154","w92"))}" alt="${ie(H.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${ie(H.movieTitle)}${Z}</div>
              <div class="history-item__meta">Requested by ${ie(H.username)}</div>
            </div>
          </div>
        `}).join("")}catch(q){y("loadHistory failed:",q),g.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function j(){let g=l("#btfw-movie-suggest-modal"),q=l("#btfw-movie-confirm-modal");q&&(g&&g.classList.add("btfw-movie-suggest-pending"),q.classList.add("is-active"))}function re(){let g=l("#btfw-movie-suggest-modal"),q=l("#btfw-movie-confirm-modal");g&&g.classList.remove("btfw-movie-suggest-pending"),q&&q.classList.remove("is-active")}async function Y(){let g=l("#btfw-movie-suggest-modal");if(g){S("openModal",{userRank:E}),g.classList.remove("btfw-movie-suggest-pending"),g.classList.add("is-active");try{await I(),await Promise.all([N(),G()])}catch(q){y("openModal bootstrap failed:",q)}}}function Q(){let g=l("#btfw-movie-suggest-modal");g&&(re(),S("closeModal"),g.classList.remove("is-active"),l("#btfw-movie-search",g).value="",l(".btfw-movie-results",g).innerHTML="",m.query="",m.page=1,m.totalPages=1,a=null,w=null,p=null,M=null)}function J(g,q,D){let H=D?` (${D})`:"";return`\u{1F3AC} Movie request: ${q}${H} \u2014 suggested by ${g}`}async function oe(){if(!a||!w)return;let g=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";S("confirmSuggestion",{movieId:a,movieTitle:w}),re();try{await u.play(),await x("/api/suggestions",{method:"POST",body:{movieId:Number(a),movieTitle:w,username:g,posterPath:p||null,releaseYear:M||null}}),_(J(g,w,M)),await G(),Q()}catch(q){y("confirmSuggestion failed:",q),alert("Could not save your movie request. Please try again.")}}function ee(){S("boot: start",{workerBase:o.getWorkerBase()}),A(),U(),F(),ue(".navbar, .navbar-nav, #nav-collapsible",{timeoutMs:5e3}).catch(()=>{}).then(()=>{O()?S("Button added successfully"):console.warn(v,"Failed to add nav button")})}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ee,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ee,200)}):setTimeout(ee,200),{name:"ext:movie-suggestion",open:Y,close:Q,getWorkerBase:o.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async e=>e.init("ext:movie-suggestion"));})();
