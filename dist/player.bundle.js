/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{var it=Object.defineProperty;var rt=(e,t)=>{for(var u in t)it(e,u,{get:t[u],enumerable:!0})};BTFW.define("feature:player",[],async()=>{var C;let e=(m,M=document)=>M.querySelector(m),t=(m,M=document)=>Array.from(M.querySelectorAll(m)),u=((C=window.BTFW)==null?void 0:C.BASE)||"";function l(m){if(!m)return;let M=m.startsWith("http")?m:`${u}/${m.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(b=>b.getAttribute("href")===M||b.getAttribute("href")===m))return;let S=document.createElement("link");S.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[m]&&(S.integrity=window.BTFW.SRI[m],S.crossOrigin="anonymous"),S.href=M,document.head.appendChild(S)}function f(){let m=e("#videowrap");if(!m)return;l("dist/css/player.css"),m.classList.add("btfw-player-wrap");let M=m.querySelector("#controlsrow, .player-controls");M&&M.classList.add("btfw-player-controls"),s()}function s(){if(window.videojs)try{let m=document.querySelector(".video-js");m&&!m.classList.contains("btfw-vjs-enhanced")&&m.classList.add("btfw-vjs-enhanced")}catch(m){}}function w(){let m=e("#videowrap");if(!m)return;new MutationObserver(()=>{s()}).observe(m,{childList:!0,subtree:!0})}function p(){f(),w();try{let m=window.socket;m&&typeof m.on=="function"&&m.on("changeMedia",()=>{setTimeout(f,100)})}catch(m){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p(),{name:"feature:player",applyPlayerLayoutEnhancements:f}});var Ae={};rt(Ae,{addMediaButtonHtml:()=>ct,addMediaPanelHtml:()=>lt,panelUndockIconHtml:()=>Me,panelsMenuButtonHtml:()=>Le,playlistAddFormHtml:()=>Ce,stackGroupHeaderHtml:()=>Te});function at(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function st(e,...t){var l;let u="";for(let f=0;f<e.length;f+=1)u+=(l=e[f])!=null?l:"",f<t.length&&(u+=at(t[f]));return u}function lt(){return`
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
      `}function Te(e){return st`
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
    `}function ct(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}function me(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function ce(e,t){return e!=null?!!e:!!t}var ve=class extends Error{constructor(t){super(t),this.name="TimeoutError"}};function Ue(){let e=globalThis.MutationObserver;return typeof e=="function"?e:null}function Ge(){var t,u;let e=globalThis;return{setTimeoutFn:(t=e.setTimeout)!=null?t:null,clearTimeoutFn:(u=e.clearTimeout)!=null?u:null}}function dt(e,t){if(t)return t;let u=e!=null?e:globalThis.document;return u&&typeof u.querySelector=="function"?l=>u.querySelector(l):()=>null}function Ve(e){if(e)try{e.disconnect()}catch(t){}}function pe(e,t={}){let{root:u=null,timeoutMs:l,includeExisting:f=!0,observerClass:s}=t;return new Promise((w,p)=>{var U,q;let C=s!==void 0?s:Ue(),m=dt(u,t.querySelector),M=Ge(),P=(U=t.setTimeoutFn)!=null?U:M.setTimeoutFn,S=(q=t.clearTimeoutFn)!=null?q:M.clearTimeoutFn,b=null,y=null,L=!1,k=O=>{L||(L=!0,Ve(b),b=null,y!==null&&S&&(S(y),y=null),O())},x=O=>{k(()=>w(O))},I=O=>{k(()=>p(O))},B=()=>{typeof l!="number"||!P||!S||(y=P(()=>{I(new ve(`waitForElement: "${e}" not found within ${l}ms`))},l))};if(f){let O=m(e);if(O){x(O);return}}if(!C){I(new Error("waitForElement: no MutationObserver implementation available"));return}b=new C(()=>{let O=m(e);O&&x(O)});let N=u!=null?u:globalThis.document;if(!N){I(new Error("waitForElement: no root available to observe"));return}b.observe(N,{childList:!0,subtree:!0}),B()})}function he(e,t={}){let{root:u=null,timeoutMs:l,observerClass:f}=t;return new Promise((s,w)=>{var I,B;let p=f!==void 0?f:Ue(),C=Ge(),m=(I=t.setTimeoutFn)!=null?I:C.setTimeoutFn,M=(B=t.clearTimeoutFn)!=null?B:C.clearTimeoutFn,P=null,S=null,b=!1,y=N=>{b||(b=!0,Ve(P),P=null,S!==null&&M&&(M(S),S=null),N())},L=()=>{typeof l!="number"||!m||!M||(S=m(()=>{y(()=>w(new ve("waitForCondition: condition not met within timeout")))},l))},k=e();if(k){y(()=>s(k));return}if(!p){y(()=>w(new Error("waitForCondition: no MutationObserver implementation available")));return}let x=u!=null?u:globalThis.document;if(!x){y(()=>w(new Error("waitForCondition: no root available to observe")));return}P=new p(()=>{let N=e();N&&y(()=>s(N))}),P.observe(x,{childList:!0,subtree:!0,attributes:!0}),L()})}var ut=/[&<>"']/g,ft={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function se(e){return e==null?"":String(e).replace(ut,t=>{var u;return(u=ft[t])!=null?u:t})}function mt(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ye(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var pt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],bt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},ht=["http","https","mailto"],yt="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",gt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,wt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,vt={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function Et(e){let t=e;for(let l=0;l<3;l+=1){let f=t.replace(/&#x([0-9a-fA-F]+);?/g,(s,w)=>{let p=Number.parseInt(w,16);if(!Number.isFinite(p)||p<0||p>1114111)return"";try{return String.fromCodePoint(p)}catch(C){return""}}).replace(/&#(\d+);?/g,(s,w)=>{let p=Number(w);if(!Number.isFinite(p)||p<0||p>1114111)return"";try{return String.fromCodePoint(p)}catch(C){return""}}).replace(/&([a-zA-Z]+);?/g,(s,w)=>{let p=vt[w.toLowerCase()];return p!==void 0?p:s});if(f===t)break;t=f}let u="";for(let l=0;l<t.length;l+=1){let f=t.charCodeAt(l);f<=31||f===127||(u+=t[l])}return u.replace(/[\s\u00a0]+/g,"")}function St(e){var f,s;let t=new Map,u=new RegExp(gt.source,"g"),l;for(;(l=u.exec(e))!==null;){let w=((f=l[1])!=null?f:"").toLowerCase(),p=(s=l[2])!=null?s:"";(p.startsWith('"')&&p.endsWith('"')||p.startsWith("'")&&p.endsWith("'"))&&(p=p.slice(1,-1)),t.set(w,p),l[0].length===0&&(u.lastIndex+=1)}return t}function xt(e,t){var s;let u=Et(e);if(u.length===0)return!0;let l=wt.exec(u);if(!l)return!0;let f=((s=l[1])!=null?s:"").toLowerCase();return t.includes(f)?f==="data"?/^data:image\//i.test(u):!0:!1}function kt(e,t,u,l,f,s,w){var y,L;let p=t.toLowerCase();if(!f.has(p))return"";if(e)return`</${p}>`;let C=St(u||""),m=(y=s["*"])!=null?y:[],M=(L=s[p])!=null?L:[],P=[];for(let[k,x]of C)k.startsWith("on")||!(m.includes(k)||M.includes(k))||(k==="href"||k==="src")&&!xt(x,w)||P.push(`${k}="${mt(x)}"`);p==="a"&&C.get("target")==="_blank"&&M.includes("rel")&&(P.some(k=>k.startsWith("rel="))||P.push('rel="noopener noreferrer"'));let S=P.length>0?` ${P.join(" ")}`:"";return`<${p}${S}${l?" /":""}>`}function ye(e,t={}){var M,P,S;if(e==null)return"";let u=String(e).replace(/<!--[\s\S]*?-->/g,""),l=new Set(((M=t.allowedTags)!=null?M:pt).map(b=>b.toLowerCase())),f=(P=t.allowedAttributes)!=null?P:bt,s=(S=t.allowedSchemes)!=null?S:ht,w=new RegExp(yt,"g"),p="",C=0,m;for(;(m=w.exec(u))!==null;){let[b,y,L="",k="",x]=m;p+=Ye(u.slice(C,m.index)),p+=kt(y,L,k,x,l,f,s),C=m.index+b.length}return p+=Ye(u.slice(C)),p}var je="btfw-stack-order",ge="btfw-stack-motd-open",Pe="btfw-stack-playlist-open",Oe="btfw-stack-poll-open",Ee={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Ie={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},Ke={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Ne={"motd-group":1,"poll-group":2,"playlist-group":3},fe=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Be=["#main","#mainpage","#mainpane"];function de(e){try{let t=Array.from(e.children).map(u=>({id:u.dataset.bind,isGroup:u.dataset.group==="true"}));localStorage.setItem(je,JSON.stringify(t))}catch(t){}}function Qe(){try{return JSON.parse(localStorage.getItem(je)||"[]")}catch(e){return[]}}function we(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function Re(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(u){}}function qe(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let u=e.replace("-docked","-hidden"),l=localStorage.getItem(u);return l!==null?l==="true":!1}catch(t){return!1}}function Xe(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(u){}}function Fe(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Se(e,t,u){if(!e||Fe(e))return;let l=we(t!=null?t:""),f=typeof u=="function"?u(l):l!==null?!!l:!0;e._btfwSetOpenState?e._btfwSetOpenState(f,{persist:!1}):(e.dataset.open=f?"true":"false",e.classList.toggle("is-open",f))}function He(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),u=e.length>0&&t.length===0,l=document.getElementById("btfw-stack"),f=document.getElementById("btfw-leftpad"),s=document.getElementById("btfw-grid");l&&(l.classList.toggle("btfw-stack--all-hidden",u),l.classList.toggle("btfw-stack--all-docked",u)),f&&f.classList.toggle("btfw-leftpad--stack-hidden",u),s&&s.classList.toggle("btfw-grid--stack-hidden",u),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:u,allDocked:u,visibleCount:t.length,totalCount:e.length}}))}function We(e=""){let t=String(e||"").trim();return t?!t.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function Ze(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=be(e);return t?!We(t.innerHTML||""):!1}function be(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let u=t.querySelector(":scope > #motd");return u||t.querySelector("#motd")||e.getElementById("motd")}function De(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let s=t.querySelector(":scope > #motd");return s?{motdwrap:t,motd:s}:null}let u=document.getElementById("togglemotd");u&&u.closest("#motd")&&t.insertBefore(u,t.firstChild);let l=[];t.querySelectorAll(".btfw-motd-editrow").forEach(s=>{let w=(s.textContent||"").trim();w&&l.push(`<p>${w}</p>`),s.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(s=>{s.contains(t)||s===t||((s.querySelector("#motd")||s.classList.contains("btfw-motd-editrow"))&&s.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&l.push(w.innerHTML)}),s.remove())});let f=t.querySelector(":scope > #motd");if(f||(f=document.createElement("div"),f.id="motd",t.appendChild(f)),t.querySelectorAll("#motd").forEach(s=>{s!==f&&((s.innerHTML||"").trim()&&l.push(s.innerHTML),s.remove())}),f.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(s=>{s.remove()}),f.querySelectorAll("#motd").forEach(s=>{(s.innerHTML||"").trim()&&l.push(s.innerHTML),s.remove()}),document.querySelectorAll("#togglemotd").forEach((s,w)=>{w!==0&&s.remove()}),l.length){let s=l.join("").trim();s&&We(f.innerHTML)?f.innerHTML=ye(s):s&&(f.innerHTML+=ye(s))}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:f}}function Je(e){let t=null,u=!1,l=!1;function f(M){De();let P=document.getElementById("motdwrap");if(!P)return;let S=M&&M.list;if(!S)return;let b=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(b){let y=b.querySelector(".btfw-group-body");y&&!y.contains(P)&&y.appendChild(P)}else{let y=fe.find(L=>L.id==="motd-group");if(!y)return;b=e.createGroupItem(y,[P]),b&&(S.appendChild(b),de(S))}s(b)}function s(M){let P=document.getElementById("motdwrap");if(!P)return;let S=Ze();if(P.classList.toggle("btfw-motd-empty",!S),P.toggleAttribute("hidden",!S),P.setAttribute("aria-hidden",S?"false":"true"),S){P.style.removeProperty("display");let b=be();b&&b.style.removeProperty("display")}if(M||(M=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),M&&S){let b=we(ge),y=ce(b,!0),L=M;L._btfwSetOpenState?L._btfwSetOpenState(y,{persist:!1}):(L.dataset.open=y?"true":"false",L.classList.toggle("is-open",y))}}function w(M){t&&clearTimeout(t),t=setTimeout(()=>{t=null,f(M)},50)}function p(M){let P=be();P&&(u||(u=!0,new MutationObserver(()=>{w(M)}).observe(P,{childList:!0,subtree:!0,characterData:!0})))}function C(M){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("setMotd",P=>{let S=typeof P=="string"?P:P&&typeof P=="object"&&typeof P.motd=="string"?P.motd:null,b=be();if(b){let y=S!==null?S:b.innerHTML,L=ye(y);b.innerHTML!==L&&(b.innerHTML=L)}w(M)}))}function m(M){let P=e.ensureStackRefs(),S=document.getElementById("motdwrap");S&&delete S.dataset.btfwMotdNormalized;let b=De(!0),y=(b==null?void 0:b.motd)||be();y&&typeof M=="string"&&(y.innerHTML=ye(M));let L=document.getElementById("cs-motdtext");L&&typeof M=="string"&&(L.value=M),P&&w(P)}return{isMotdHtmlEmpty:We,hasMotdContent:Ze,resolveMotdHost:be,normalizeMotdStructure:De,ensureMotdStackPanel:f,syncMotdWrapVisibility:s,scheduleMotdSync:w,wireMotdObservers:p,wireMotdSocket:C,applyMotdUpdate:m}}var _t=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function et(e){let{tpl:t}=e;function u(b,y,L){if(!b||!y||!L)return null;let k=_t.map(D=>{let $=document.getElementById(D.id);return $?{...D,el:$}:null}).filter(Boolean);if(!k.length){let D=document.getElementById("btfw-addmedia-panel");return D&&D.remove(),null}let x=document.getElementById("btfw-addmedia-panel");if(x||(x=document.createElement("section"),x.id="btfw-addmedia-panel",x.className="btfw-addmedia-panel",x.dataset.open="false",x.setAttribute("role","region"),x.setAttribute("aria-label","Add media controls"),x.setAttribute("aria-hidden","true"),x.setAttribute("hidden","hidden"),x.innerHTML=t.addMediaPanelHtml()),x.parentElement!==b){let D=y.parentElement===b?y.nextSibling:null;b.insertBefore(x,D)}let I=x.querySelector(".btfw-addmedia-tabs"),B=x.querySelector(".btfw-addmedia-views"),N=x.querySelector(".btfw-addmedia-close");if(!I||!B)return null;for(;I.firstChild;)I.removeChild(I.firstChild);for(;B.firstChild;)B.removeChild(B.firstChild);k.forEach(({id:D,title:$,el:F})=>{F.classList.remove("collapse","in","plcontrol-collapse"),F.style.removeProperty("display"),F.style.removeProperty("height"),F.removeAttribute("aria-expanded"),F.setAttribute("role","tabpanel"),F.setAttribute("data-btfw-addmedia","panel");let V=document.createElement("button");V.type="button",V.className="btfw-addmedia-tab",V.dataset.target=D,V.textContent=$,V.setAttribute("role","tab"),I.appendChild(V);let K=document.createElement("div");K.className="btfw-addmedia-view",K.dataset.target=D,K.setAttribute("role","tabpanel"),K.setAttribute("aria-hidden","true"),K.appendChild(F),B.appendChild(K)});let U=k.find(D=>D.default)||k[0],q=D=>{let $=D||x.dataset.active||U.id;x.dataset.active=$,I.querySelectorAll(".btfw-addmedia-tab").forEach(F=>{let V=F.dataset.target===$;F.classList.toggle("is-active",V),F.setAttribute("aria-selected",V?"true":"false"),F.setAttribute("tabindex",V?"0":"-1")}),B.querySelectorAll(".btfw-addmedia-view").forEach(F=>{let V=F.dataset.target===$;F.classList.toggle("is-active",V),F.setAttribute("aria-hidden",V?"false":"true")})},O=D=>{let $=D!=null?!!D:x.dataset.open!=="true";return x.dataset.open=$?"true":"false",x.classList.toggle("is-open",$),x.setAttribute("aria-hidden",$?"false":"true"),$?(x.removeAttribute("hidden"),q(x.dataset.active||U.id)):x.setAttribute("hidden","hidden"),x.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:$}})),$};return x._btfwWired||(I.addEventListener("click",D=>{let $=D.target.closest(".btfw-addmedia-tab");$&&(D.preventDefault(),q($.dataset.target))}),N&&N.addEventListener("click",()=>O(!1)),x._btfwWired=!0),q(x.dataset.active||U.id),x._btfwToggle=O,x._btfwSetActive=q,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:$,target:F})=>{let V=document.getElementById($);V&&V.dataset.btfwAddmedia!==F&&(V.dataset.btfwAddmedia=F,V.setAttribute("aria-controls","btfw-addmedia-panel"),V.addEventListener("click",K=>{K.preventDefault(),K.stopPropagation(),q(F),O(!0),V.blur()}))})})(),{panel:x,toggle:O,setActive:q}}function l(){let b=document.getElementById("btfw-plbar");if((b==null?void 0:b.dataset.btfwMerged)==="1")return;let y=document.getElementById("controlsrow"),L=document.getElementById("rightcontrols"),k=document.getElementById("playlistwrap"),x=document.getElementById("queuecontainer"),I=document.getElementById("playlistrow"),B=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),N=document.querySelectorAll(".btfw-controls-row"),U=I||k||x||B;if(!U)return;let q=b;q?q.classList.add("btfw-plbar"):(q=document.createElement("div"),q.id="btfw-plbar",q.className="btfw-plbar");let O=q.querySelector(".btfw-plbar__layout"),Z,D;if(O)Z=O.querySelector(".btfw-plbar__primary")||O,D=O.querySelector(".btfw-plbar__aside")||O;else{for(O=document.createElement("div"),O.className="btfw-plbar__layout",Z=document.createElement("div"),Z.className="btfw-plbar__primary",D=document.createElement("div"),D.className="btfw-plbar__aside",O.append(Z,D);q.firstChild;)Z.appendChild(q.firstChild);q.appendChild(O);let j=Z.querySelector(".field.has-addons");j&&j.classList.add("btfw-plbar__search");let Q=Z.querySelector("#btfw-pl-count");Q&&(Q.classList.add("btfw-plbar__count"),D.appendChild(Q))}q.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(j=>j.remove());let $=q.querySelector(".btfw-plbar__actions");$||($=document.createElement("div"),$.className="btfw-plbar__actions",(D||q).appendChild($));let F=document.getElementById("btfw-addmedia-btn"),V=j=>{if(j){if(j.classList.add("btfw-plbar__action-btn"),j.tagName==="BUTTON"||j.tagName==="A")j.classList.add("button","is-dark","is-small");else if(j.tagName==="INPUT"){let Q=(j.type||"").toLowerCase();Q==="button"||Q==="submit"||Q==="reset"?j.classList.add("button","is-dark","is-small"):j.classList.remove("button","is-dark","is-small")}}};q.parentElement!==U&&U.insertBefore(q,U.firstChild);let K=u(U,q,$);K?!F||!document.body.contains(F)?(F=document.createElement("button"),F.id="btfw-addmedia-btn",F.setAttribute("type","button"),F.className="button is-small",F.innerHTML=t.addMediaButtonHtml(),$.prepend(F)):$.contains(F)||$.prepend(F):F&&(F.parentElement&&F.parentElement.removeChild(F),F=null);let te=j=>{if(!j)return;Array.from(j.children||[]).forEach(J=>{J&&(J.classList.add("btfw-plbar__control"),$.appendChild(J))})};if(L&&(te(L),L.remove()),y&&(te(y),y.remove()),$.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(V),K&&F){F.classList.remove("is-dark"),F.classList.add("is-primary"),F.dataset.iconified||(F.innerHTML=t.addMediaButtonHtml(),F.dataset.iconified="1"),F.setAttribute("aria-controls","btfw-addmedia-panel");let j=J=>{F.setAttribute("aria-expanded",J?"true":"false")};F.dataset.btfwBound||(F.dataset.btfwBound="1",F.addEventListener("click",J=>{J.preventDefault();let re=document.getElementById("btfw-addmedia-panel"),oe=re&&re._btfwToggle,ie=typeof oe=="function"?oe():!1;j(ie)}));let Q=K.panel||document.getElementById("btfw-addmedia-panel");Q&&(j(Q.dataset.open==="true"),Q._btfwButtonSync||(Q.addEventListener("btfw:addmedia:state",J=>{j(!!J.detail&&!!J.detail.open)}),Q._btfwButtonSync=!0))}N.forEach(j=>{j&&!U.contains(j)&&(j.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,j.remove(),U.appendChild(j),console.log("[stack] Moved floating controls row into playlist container"))}),U.contains(q)||U.insertBefore(q,U.firstChild),q.dataset.btfwMerged="1"}function f(b){if(!b)return null;let y=Array.from(b.classList).find(k=>k.startsWith("pluid-"));if(y)return y.slice(6);let L=window.jQuery||window.$;if(L){let k=L(b).data("uid");if(k!=null&&k!=="")return k}return b.dataset.uid||null}function s(b){if(b==null||b==="")return!1;let y=window.socket;if(y&&typeof y.emit=="function")return y.emit("jumpTo",b),!0;let L=document.querySelector(`#queue > .queue_entry.pluid-${b}`),k=L==null?void 0:L.querySelector(".qbtn-play");return k?(k.click(),!0):!1}function w(b){let y=(b||"").trim();if(!y)return!1;let L=document.getElementById("mediaurl"),k=document.getElementById("queue_next");if(L&&k&&(L.value=y,!k.disabled))return k.click(),!0;if(typeof window.queue=="function"&&L)return L.value=y,window.queue("next","url"),!0;let x=window.socket;if(x&&typeof parseMediaLink=="function")try{let I=parseMediaLink(y);if((I==null?void 0:I.id)!=null&&(I!=null&&I.type))return x.emit("queue",{id:I.id,type:I.type,pos:"next",temp:!1}),!0}catch(I){}return!1}let p=null,C=null;function m(){if(p){try{p.disconnect()}catch(b){}p=null}C=null}function M(b){if(!b||C===b)return;m();let y=document.getElementById("queue");y&&(C=b,p=new MutationObserver(()=>{b.isConnected&&e.getActiveFlyoutGroup()==="playlist-group"&&S(b)}),p.observe(y,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function P(b=5){let y=document.getElementById("queue");if(!y)return[];let L=Array.from(y.querySelectorAll(":scope > .queue_entry")),k=L.findIndex(I=>I.classList.contains("queue_active")||I.classList.contains("playing")),x=k>=0?k+1:0;return L.slice(x,x+b)}function S(b){if(!b)return;let y=P(5);if(b.replaceChildren(),!y.length){let L=document.createElement("p");L.className="btfw-panel-playlist__empty",L.textContent="No upcoming videos",b.appendChild(L);return}y.forEach(L=>{var U,q;let k=document.createElement("div");k.className="btfw-panel-playlist__item";let x=document.createElement("span");x.className="btfw-panel-playlist__title",x.textContent=(((U=L.querySelector(".qe_title"))==null?void 0:U.textContent)||"Untitled").trim();let I=document.createElement("span");I.className="btfw-panel-playlist__meta",I.textContent=(((q=L.querySelector(".qe_time"))==null?void 0:q.textContent)||"").trim();let B=document.createElement("div");B.className="btfw-panel-playlist__actions";let N=f(L);if(N!=null&&N!==""){let O=document.createElement("button");O.type="button",O.className="btfw-panel-playlist__play",O.textContent="Play",O.dataset.queueUid=String(N),!(L==null?void 0:L.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(O.disabled=!0),B.appendChild(O)}k.append(x,I,B),b.appendChild(k)})}return{ensureAddMediaUI:u,mergePlaylistControls:l,getQueueEntryUid:f,playQueueEntry:s,queueMediaLink:w,disconnectQueuePreviewObserver:m,ensureQueuePreviewObserver:M,getUpcomingQueueEntries:P,renderPlaylistQueuePreview:S}}function tt(e){let t=null,u=!1,l=!1;function f(){let S=document.getElementById("pollwrap");if(!S)return null;if(!S.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return S;let y=document.getElementById("btfw-poll-parking");return y||(y=document.createElement("div"),y.id="btfw-poll-parking",y.hidden=!0,y.setAttribute("aria-hidden","true"),document.body.appendChild(y)),y.appendChild(S),S}function s(S){let b=document.getElementById("pollwrap");if(!b)return;let y=b.dataset&&b.dataset.btfwPollOverlay,L=b.getAttribute&&b.getAttribute("data-btfw-poll-overlay");if(y==="video"||L==="video")return;f(),P();let k=S&&S.list;if(!k)return;let x=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!x){let N=fe.find(U=>U.id==="poll-group");if(!N)return;x=e.createGroupItem(N,[b]),x&&(k.appendChild(x),de(k));return}let I=x.querySelector(".btfw-group-body");I&&!I.contains(b)&&I.appendChild(b);let B=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');B&&B.contains(b)&&I&&I.appendChild(b)}function w(S,b={}){s(S),M();let y=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');y&&(y.hidden=!1,y.removeAttribute("hidden"),b.forceOpen&&y._btfwSetOpenState?y._btfwSetOpenState(!0,{persist:!1}):b.forceOpen&&(y.dataset.open="true",y.classList.add("is-open")))}function p(S,b={}){t&&clearTimeout(t),t=setTimeout(()=>{t=null,w(S,b)},50)}function C(S){if(u)return;let b=document.getElementById("pollwrap");if(!b)return;u=!0,new MutationObserver(()=>{p(S,{forceOpen:me()})}).observe(b,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let L=document.getElementById("newpollbtn");L&&!L.dataset.btfwPollSync&&(L.dataset.btfwPollSync="1",L.addEventListener("click",()=>{p(S,{forceOpen:!0})}))}function m(S){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("newPoll",()=>p(S,{forceOpen:!0})),window.socket.on("closePoll",()=>p(S)))}function M(){let S=document.getElementById("pollwrap");if(!S)return;let b=!!S.closest(".btfw-panel-container__host"),y=!me();if(b&&!y){S.classList.remove("btfw-poll-idle"),S.removeAttribute("hidden"),S.setAttribute("aria-hidden","false");return}S.classList.toggle("btfw-poll-idle",y),S.toggleAttribute("hidden",y),S.setAttribute("aria-hidden",y?"true":"false")}function P(){let S=document.getElementById("leftcontrols"),b=document.getElementById("pollwrap");S&&b&&(S.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(L=>{let k=b.querySelector(".poll-controls");k||(k=document.createElement("div"),k.className="poll-controls",b.insertBefore(k,b.firstChild)),L.parentElement!==k&&k.appendChild(L)}),S.children.length===0&&S.remove())}return{detachPollWrapFromPlaylist:f,movePollButton:P,ensurePollStackPanel:s,syncPollPanelVisibility:w,schedulePollSync:p,wirePollObservers:C,wirePollSocket:m,syncPollWrapVisibility:M}}BTFW.define("feature:stack",["feature:layout"],async({init:e})=>{let t=!1,u=null,l="",f=null,s={"motd-group":{storageKey:ge,getDefaultOpen:n=>ce(n,M()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:Pe,getDefaultOpen:n=>ce(n,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:Oe,getDefaultOpen:n=>ce(n,me()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},w=!1,p=null,C=!1,m=Je({createGroupItem:y,ensureStackRefs:()=>b()}),M=m.hasMotdContent,P=et({tpl:Ae,getActiveFlyoutGroup:()=>u}),S=tt({createGroupItem:y});function b(){let n=document.getElementById("btfw-leftpad");if(!n)return null;let r=document.getElementById("btfw-stack");if(!r){r=document.createElement("div"),r.id="btfw-stack",r.className="btfw-stack";let o=document.getElementById("videowrap"),d=document.getElementById("btfw-video-overlay"),c=d&&o&&d.parentElement===o.parentElement?d:o;c&&c.parentElement?c.nextSibling?c.parentNode.insertBefore(r,c.nextSibling):c.parentNode.appendChild(r):n.appendChild(r);let A=document.createElement("div");A.className="btfw-stack-list",r.appendChild(A);let R=document.createElement("div");R.id="btfw-stack-footer",R.className="btfw-stack-footer",r.appendChild(R)}return{list:r.querySelector(".btfw-stack-list"),footer:r.querySelector("#btfw-stack-footer")}}function y(n,r){if(n.id==="motd-group"&&(m.normalizeMotdStructure(),r=[document.getElementById("motdwrap")].filter(Boolean)),n.id==="playlist-group"&&(S.detachPollWrapFromPlaylist(),P.mergePlaylistControls(),r=r.filter(i=>i&&i.id!=="rightcontrols"&&i.id!=="pollwrap").filter(i=>!i.querySelector||!i.querySelector("#pollwrap"))),n.id==="poll-group"&&(S.detachPollWrapFromPlaylist(),S.movePollButton(),r=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),r.length===0)return null;let o=document.querySelector("#btfw-stack .btfw-stack-list");o&&(r=r.filter(i=>i&&!o.contains(i)&&!i.contains(o)));let d=document.createElement("section");d.className="btfw-stack-item btfw-group-item",d.dataset.bind=n.id,d.dataset.group="true";let c=document.createElement("header");c.className="btfw-stack-item__header",c.innerHTML=Te(n.title);let A=document.createElement("div");A.className="btfw-stack-item__body btfw-group-body",r.forEach(i=>{if(i&&i.parentElement!==A&&!A.contains(i)&&!i.contains(A))try{A.appendChild(i)}catch(a){console.warn("[stack] Failed to move element:",i.id||i.className,a)}}),d.appendChild(c),d.appendChild(A);let R=s[n.id];return R&&g(d,R),ie(d,n.id),d.querySelector(".btfw-up").onclick=function(){let i=d.parentElement,a=d.previousElementSibling;a&&i.insertBefore(d,a),de(i)},d.querySelector(".btfw-down").onclick=function(){let i=d.parentElement,a=d.nextElementSibling;a?i.insertBefore(a,d):i.appendChild(d),de(i)},d}function L(n){n&&(n.classList.remove("btfw-stack-item--in-drawer"),delete n.dataset.btfwInDrawer,n.classList.toggle("is-open",n.dataset.open!=="false"),S.syncPollWrapVisibility())}function k(n){L(n);let r=document.querySelector("#btfw-stack .btfw-stack-list");!r||!n||n.parentElement!==r&&r.appendChild(n)}function x(){var d;let n=document.getElementById("btfw-chat-actions");if(!n)return null;let r=document.getElementById("btfw-panels-menu-shell");if(!r){r=document.createElement("div"),r.id="btfw-panels-menu-shell",r.className="btfw-panels-menu-shell",r.setAttribute("aria-label","Docked channel panels");let c=document.createElement("div");c.id="btfw-panel-bar",c.className="btfw-panel-bar",c.setAttribute("role","toolbar"),c.setAttribute("aria-label","Docked panel shortcuts"),r.appendChild(c)}let o=r.querySelector("#btfw-panel-bar");return U(o),r.parentElement!==n&&n.insertBefore(r,n.firstChild),t||(j(),t=!0),(d=document.getElementById("btfw-stack-drawer"))==null||d.remove(),r}function I(n){n.preventDefault(),n.stopPropagation(),V()}function B(){let n=x();if(!n)return null;let r=document.getElementById("btfw-panels-menu-btn");r?r.parentElement!==n&&n.appendChild(r):(r=document.createElement("button"),r.type="button",r.id="btfw-panels-menu-btn",r.className="button btfw-chatbtn btfw-panels-menu-btn",r.innerHTML=Le(),r.title="Docked Panels",r.setAttribute("aria-expanded","false"),r.hidden=!0,n.appendChild(r)),r.title="Docked Panels";let o=r.querySelector(".btfw-panels-menu-btn__label");return o&&(o.textContent="Panels"),r.classList.remove("is-wide"),r.dataset.btfwPanelsWired||(r.addEventListener("click",I),r.dataset.btfwPanelsWired="1"),r}function N(n){b();let r=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${n}"]`);r&&(f&&(clearTimeout(f),f=null),u=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o.classList.remove("is-active"),delete o.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),P.disconnectQueuePreviewObserver(),oe(r,!1),requestAnimationFrame(()=>{try{r.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(o){}}))}function U(n){!n||n.dataset.btfwActionsWired||(n.dataset.btfwActionsWired="1",n.addEventListener("click",r=>{var A,R,i;let o=r.target.closest(".btfw-panel-undock");if(o){r.preventDefault(),r.stopPropagation();let a=o.dataset.panelGroup||((A=o.closest(".btfw-panel-btn"))==null?void 0:A.dataset.group);a&&N(a);return}let d=r.target.closest(".btfw-panel-playlist__play");if(d){r.preventDefault(),r.stopPropagation(),P.playQueueEntry(d.dataset.queueUid);return}let c=r.target.closest(".btfw-panel-playlist__add");if(c){r.preventDefault(),r.stopPropagation();let a=(R=c.closest(".btfw-panel-container"))==null?void 0:R.querySelector(".btfw-panel-playlist__add-form");if(!a)return;let E=a.hidden;a.hidden=!E,c.setAttribute("aria-expanded",E?"true":"false"),E&&((i=a.querySelector(".btfw-panel-playlist__link-input"))==null||i.focus())}}),n.addEventListener("submit",r=>{var R,i,a,E;let o=r.target.closest(".btfw-panel-playlist__add-form");if(!o)return;r.preventDefault(),r.stopPropagation();let d=o.querySelector(".btfw-panel-playlist__link-input"),c=(R=d==null?void 0:d.value)==null?void 0:R.trim();if(!c||!P.queueMediaLink(c))return;d.value="",o.hidden=!0,(a=(i=o.closest(".btfw-panel-container"))==null?void 0:i.querySelector(".btfw-panel-playlist__add"))==null||a.setAttribute("aria-expanded","false");let A=(E=o.closest(".btfw-panel-container"))==null?void 0:E.querySelector(".btfw-panel-playlist__queue");A&&P.renderPlaylistQueuePreview(A)}))}function q(n,r){let o=document.createElement("button");return o.type="button",o.className="btfw-panel-undock",o.dataset.panelGroup=n,o.setAttribute("aria-label",`Pin ${r.title} below video`),o.title="Pin below video",o.innerHTML=Me(),o}function O(){let n=document.createElement("form");return n.className="btfw-panel-playlist__add-form",n.hidden=!0,n.innerHTML=Ce(),n}function Z(n,r,o){let d=document.createElement("div");if(d.className="btfw-panel-container",o>0&&(d.style.bottom=`${-o*50}px`),n==="playlist-group"){d.classList.add("btfw-panel-container--playlist");let A=document.createElement("div");A.className="btfw-panel-playlist__toolbar";let R=document.createElement("button");R.type="button",R.className="btfw-panel-playlist__add",R.textContent="+Add",R.setAttribute("aria-expanded","false");let i=q(n,r);A.append(R,i);let a=O(),E=document.createElement("div");return E.className="btfw-panel-container__host btfw-panel-playlist__queue",d.append(A,a,E),d}d.classList.add("btfw-panel-container--dock-only");let c=document.createElement("div");return c.className="btfw-panel-container__dock-only",c.appendChild(q(n,r)),d.appendChild(c),d}function D(){f&&(clearTimeout(f),f=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(n=>{k(n)}),P.disconnectQueuePreviewObserver(),u=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function $(n){let r=document.getElementById("btfw-panel-bar"),o=document.getElementById("btfw-panels-menu-btn");r&&r.classList.toggle("open",n),document.documentElement.classList.toggle("btfw-panels-bar-open",n),o&&(o.classList.toggle("is-expanded",n),o.setAttribute("aria-expanded",n?"true":"false")),n||D()}function F(){$(!1)}function V(){x();let n=document.getElementById("btfw-panel-bar"),r=document.getElementById("btfw-panels-menu-btn");!n||!r||r.hidden||$(!n.classList.contains("open"))}function K(n){f&&clearTimeout(f),f=setTimeout(()=>{f=null;let r=document.querySelector(`.btfw-panel-btn[data-group="${n}"]`);r&&(r.matches(":hover")||r.querySelector(".btfw-panel-container:hover")||(r.classList.remove("is-active"),u===n&&(u=null,P.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function te(n,r){if(r&&(f&&(clearTimeout(f),f=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(o=>{o!==r&&o.classList.remove("is-active")}),u=n,r.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),n==="playlist-group")){let o=r.querySelector(".btfw-panel-playlist__queue");o&&(P.renderPlaylistQueuePreview(o),P.ensureQueuePreviewObserver(o))}}function j(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",n=>{u&&(n.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(r=>{delete r.dataset.btfwFlyoutLocked}),D()))}))}function Q(n,r){var d;if(!((d=document.getElementById("btfw-panel-bar"))!=null&&d.classList.contains("open")))return;if(f&&(clearTimeout(f),f=null),r.dataset.btfwFlyoutLocked==="true"&&r.classList.contains("is-active")){delete r.dataset.btfwFlyoutLocked,r.classList.remove("is-active"),u===n&&(u=null,P.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(c=>{c!==r&&delete c.dataset.btfwFlyoutLocked}),r.dataset.btfwFlyoutLocked="true",te(n,r)}function J(n,r){let o=n.querySelector(".btfw-panel-container"),d=()=>{var c;(c=document.getElementById("btfw-panel-bar"))!=null&&c.classList.contains("open")&&(f&&(clearTimeout(f),f=null),te(r,n))};n.addEventListener("mouseenter",d),n.addEventListener("focusin",d),n.addEventListener("click",c=>{c.target.closest(".btfw-panel-container")||(c.preventDefault(),c.stopPropagation(),Q(r,n))}),n.addEventListener("keydown",c=>{c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),Q(r,n))}),n.addEventListener("mouseleave",c=>{n.dataset.btfwFlyoutLocked!=="true"&&(o!=null&&o.contains(c.relatedTarget)||K(r))}),o==null||o.addEventListener("mouseenter",()=>{f&&(clearTimeout(f),f=null)}),o==null||o.addEventListener("mouseleave",c=>{n.dataset.btfwFlyoutLocked!=="true"&&(n.contains(c.relatedTarget)||K(r))})}function re(){let n=x();B();let r=n==null?void 0:n.querySelector("#btfw-panel-bar");if(!r)return;let o=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((i,a)=>(Ne[i.dataset.bind]||99)-(Ne[a.dataset.bind]||99)),d=o.map(i=>i.dataset.bind).join("|"),c=document.getElementById("btfw-panels-menu-btn");if(c&&(c.hidden=o.length===0,o.length===0)){l="",F();return}if(d===l&&r.childElementCount===o.length)return;l=d;let A=r.classList.contains("open"),R=u;if(D(),r.replaceChildren(),r.style.setProperty("--btfw-panel-bar-count",String(Math.max(o.length,1))),o.forEach((i,a)=>{let E=i.dataset.bind,_=Ie[E]||{short:"?",title:E},W=document.createElement("div");W.className="btfw-panel-btn",W.dataset.group=E,W.title=_.title,W.setAttribute("role","button"),W.setAttribute("aria-label",_.title),W.tabIndex=0;let Y=document.createElement("span");Y.className="btfw-panel-btn__label",Y.textContent=Ke[E]||_.short,W.appendChild(Y),W.appendChild(Z(E,_,a)),r.appendChild(W),J(W,E)}),A&&($(!0),R&&o.some(a=>a.dataset.bind===R))){let a=r.querySelector(`.btfw-panel-btn[data-group="${R}"]`);a&&te(R,a)}}function oe(n,r,o={}){if(!n)return;let d=!!r,c=o.persist===!1,A=n.dataset.bind,R=Ee[A];n.dataset.docked=d?"true":"false",n.classList.toggle("btfw-stack-item--docked",d);let i=n.querySelector(".btfw-stack-dock-btn");i&&(i.setAttribute("aria-pressed",d?"true":"false"),i.title=d?"Pinned to panels menu":"Dock to panels menu"),d?Fe(n)?k(n):u===A&&(u=null):(k(n),n._btfwSetOpenState?n._btfwSetOpenState(!0):(n.dataset.open="true",n.classList.add("is-open"))),!c&&R&&Xe(R,d),re(),He()}function ie(n,r){var a;let o=Ee[r];if(!o)return;let d=n.querySelector(".btfw-stack-item__header"),c=d==null?void 0:d.querySelector(".btfw-stack-header-toolbar"),A=c==null?void 0:c.querySelector(".btfw-stack-arrows");if(!A||A.querySelector(".btfw-stack-dock-btn"))return;let R=qe(o);n.dataset.docked=R?"true":"false",n.classList.toggle("btfw-stack-item--docked",R);let i=document.createElement("button");i.type="button",i.className="btfw-arrow btfw-stack-dock-btn",i.textContent="\u2AF7",i.setAttribute("aria-label",`Dock ${((a=Ie[r])==null?void 0:a.title)||r} to panels menu`),i.setAttribute("aria-pressed",R?"true":"false"),i.title=R?"Pinned to panels menu":"Dock to panels menu",i.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),n.dataset.docked!=="true"&&oe(n,!0)}),A.insertBefore(i,A.firstChild)}function g(n,r={}){let{storageKey:o,getDefaultOpen:d,toggleClass:c,ariaLabel:A="Toggle panel visibility",openTitle:R="Hide panel",closeTitle:i="Show panel"}=r,a=we(o),E=typeof d=="function"?d(a):a!==null?a:!0;n.hasAttribute("data-open")||(n.dataset.open=E?"true":"false"),n.classList.toggle("is-open",n.dataset.open!=="false");let _=n.querySelector(".btfw-stack-item__header"),W=_&&_.querySelector(".btfw-stack-arrows");if(!W||W.querySelector(`.${c}`))return;let Y=document.createElement("button");Y.type="button",Y.className=`btfw-arrow ${c}`,Y.setAttribute("aria-label",A),Y.style.display="flex",Y.style.alignItems="center",Y.style.justifyContent="center";let ne=()=>{let ae=n.dataset.open!=="false";Y.textContent=ae?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",Y.title=ae?R:i,Y.setAttribute("aria-expanded",ae?"true":"false"),n.classList.toggle("is-open",ae)},ue=(ae,ke={})=>{let ze=!!ae,_e=ke.persist===!1;_e&&(n._btfwSuppressPersist=!0),n.dataset.open=ze?"true":"false",ne(),_e||Re(o,ze),_e&&queueMicrotask(()=>{n._btfwSuppressPersist=!1})};Y.addEventListener("click",ae=>{ae.preventDefault(),ae.stopPropagation(),ue(n.dataset.open==="false")}),ne(),new MutationObserver(ae=>{for(let ke of ae)ke.type==="attributes"&&(ne(),n._btfwSuppressPersist||Re(o,n.dataset.open!=="false"))}).observe(n,{attributes:!0,attributeFilter:["data-open"]}),W.insertBefore(Y,W.firstChild),n._btfwSetOpenState=ue,ie(n,n.dataset.bind)}function H(n){return!!n.closest('.modal, [role="dialog"]')}function z(n){if(!n||n.querySelector("#btfw-footer"))return;let r=document.getElementById("btfw-footer");if(r&&r!==n&&!n.contains(r)){n.innerHTML="",n.appendChild(r);return}let o=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(d=>!H(d));o&&!n.contains(o)&&(o.classList.add("btfw-footer"),n.innerHTML="",n.appendChild(o))}function G(n){let r=document.querySelector(`.btfw-stack-item[data-bind="${n}"]`),o=r==null?void 0:r.querySelector(".btfw-stack-item__header");if(!o)return null;let d=o.querySelector(".btfw-stack-header-actions");if(!d){d=document.createElement("span"),d.className="btfw-stack-header-actions";let c=o.querySelector(".btfw-stack-header-toolbar"),A=(c==null?void 0:c.querySelector(".btfw-stack-arrows"))||o.querySelector(".btfw-stack-arrows");c&&A?c.insertBefore(d,A):A?o.insertBefore(d,A):o.appendChild(d)}return d}function ee(n,r){n&&(n.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),n.classList.add("btfw-stack-header-btn"),n.innerHTML!==r&&(n.innerHTML=r))}function X(){let n=G("poll-group"),r=document.getElementById("newpollbtn");if(n&&r){ee(r,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),r.parentElement!==n&&n.appendChild(r);let c=document.querySelector("#pollwrap > .poll-controls");c&&c.children.length===0&&c.remove()}let o=G("motd-group"),d=document.getElementById("btfw-motd-editbtn");if(o&&d){ee(d,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),d.parentElement!==o&&o.appendChild(d);let c=d.closest(".btfw-motd-editrow");c&&c.parentElement&&c.remove()}}function h(n){return fe.every(r=>r.selectors.some(d=>{var A,R;if(Be.includes(d))return!1;let c=document.querySelector(d);if(!c||n.contains(c)||c.contains(n))return!1;if(d==="#pollwrap"){let i=(A=c.dataset)==null?void 0:A.btfwPollOverlay,a=(R=c.getAttribute)==null?void 0:R.call(c,"data-btfw-poll-overlay");if(i==="video"||a==="video")return!1}return!0})?!!n.querySelector(`[data-bind="${r.id}"]`):!0)}function v(n){if(!w){w=!0;try{let r=n.list,o=n.footer;if(h(r)&&r.children.length>0){m.ensureMotdStackPanel(n),S.ensurePollStackPanel(n),S.syncPollWrapVisibility(),X(),z(o);return}S.movePollButton(),S.detachPollWrapFromPlaylist();let d=new Map;fe.forEach(R=>{let i=[];R.selectors.forEach(a=>{let E=document.querySelector(a);if(E&&!(r.contains(E)||E.contains(r))&&!Be.includes(a)){if(a==="#pollwrap"){let _=E.dataset&&E.dataset.btfwPollOverlay,W=E.getAttribute&&E.getAttribute("data-btfw-poll-overlay");if(_==="video"||W==="video")return}i.push(E)}}),i.length>0&&d.set(R.id,{group:R,elements:i})});let c=Qe(),A=[];d.forEach(({group:R,elements:i},a)=>{if(!Array.from(r.children).find(_=>_.dataset.bind===a))try{let _=y(R,i);_&&A.push({item:_,id:a,priority:R.priority,isGroup:!0})}catch(_){console.warn("[stack] Failed to create group item:",a,_)}}),c.length>0?A.sort((R,i)=>{let a=c.findIndex(_=>_.id===R.id),E=c.findIndex(_=>_.id===i.id);return a>=0&&E>=0?a-E:a>=0?-1:E>=0?1:R.priority-i.priority}):A.sort((R,i)=>R.priority-i.priority),A.forEach(({item:R})=>{try{R&&!r.contains(R)&&!R.contains(r)&&r.appendChild(R)}catch(i){console.warn("[stack] Failed to add item to list:",i)}}),de(r),m.ensureMotdStackPanel(n),S.ensurePollStackPanel(n),S.syncPollWrapVisibility(),X(),z(o)}finally{w=!1}}}function T(){let n=b();if(!n||(v(n),m.wireMotdObservers(n),m.wireMotdSocket(n),S.wirePollObservers(n),S.wirePollSocket(n),C))return;C=!0;let r=new MutationObserver(()=>{p||(p=requestAnimationFrame(()=>{p=null,v(n)}))}),o=document.getElementById("btfw-leftpad"),d=document.getElementById("main");o&&r.observe(o,{childList:!0,subtree:!1}),d&&r.observe(d,{childList:!0,subtree:!1}),pe("#btfw-stack .btfw-stack-item",{root:document}).then(()=>{let c=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');c&&Se(c,ge,i=>ce(i,M()));let A=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');A&&Se(A,Pe,i=>i!==null?!!i:!0);let R=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');R&&Se(R,Oe,i=>ce(i,me())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(i=>{let a=Ee[i.dataset.bind];a&&oe(i,qe(a),{persist:!1})}),x(),B(),re(),S.syncPollPanelVisibility(n),He(),v(n)}).catch(()=>{})}return document.addEventListener("btfw:layoutReady",T),document.addEventListener("btfw:chat:barsReady",()=>{x(),B(),re()}),setTimeout(T,1200),document.addEventListener("btfw:channelThemeTint",()=>{let n=b();n&&setTimeout(()=>v(n),100)}),document.addEventListener("btfw:motd:updated",n=>{var o;let r=(o=n==null?void 0:n.detail)==null?void 0:o.html;typeof r=="string"&&m.applyMotdUpdate(r)}),{name:"feature:stack",hasMotdContent:M,resolveMotdHost:m.resolveMotdHost,normalizeMotdStructure:m.normalizeMotdStructure,applyMotdUpdate:m.applyMotdUpdate}});BTFW.define("feature:videoOverlay",[],async()=>{let e=(i,a=document)=>a.querySelector(i),t=["#mediarefresh","#voteskip","#fullscreenbtn"],u={localSubs:"btfw:video:localsubs"},l=5,f={owner:["chanowner","owner","founder","admin","administrator"]};function s(){var i;try{return((i=window.PLAYER)==null?void 0:i.mediaType)||null}catch(a){return null}}function w(){let i=(s()||"").toLowerCase();return i==="fi"||i==="gd"}function p(){try{return window.CLIENT||window.client||null}catch(i){return null}}function C(){try{return window.CHANNEL||window.channel||null}catch(i){return null}}function m(){let i=C();if(i&&typeof i.perms=="object"&&i.perms)return i.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(a){return{}}}function M(i=[]){let a=m();for(let E of i){let _=a==null?void 0:a[E];if(typeof _=="number")return _}}function P(){let i=M(f.owner);return typeof i=="number"?i:l}function S(i){if(!i)return!1;try{if(typeof i.hasPermission=="function"&&i.hasPermission("chanowner"))return!0}catch(a){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(a){}return!1}function b(){let i=p();if(!i)return!1;let a=Number(i.rank);return Number.isFinite(a)?!!(a>=P()||S(i)):!1}let y=()=>{try{return localStorage.getItem(u.localSubs)!=="0"}catch(i){return!0}},L=i=>{try{localStorage.setItem(u.localSubs,i?"1":"0")}catch(a){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!i}}))},k=0,x=0,I=0,B=2e3,N=8e3,U=45e3,q=12e4,O=N,Z=!1,D=null;function $(){if(e("#btfw-vo-css"))return;let i=document.createElement("style");i.id="btfw-vo-css",i.textContent=`
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
    `,document.head.appendChild(i)}function F(i){let a=e("#videowrap");!a||!i||((i.parentElement!==a.parentElement||i.previousElementSibling!==a)&&a.insertAdjacentElement("afterend",i),i.classList.add("btfw-vo-visible"))}function V(){if(!e("#videowrap"))return null;let a=e("#btfw-video-overlay");a||(a=document.createElement("div"),a.id="btfw-video-overlay",a.setAttribute("data-testid","btfw-video-overlay")),a.classList.add("btfw-video-overlay"),a.getAttribute("data-testid")||a.setAttribute("data-testid","btfw-video-overlay"),F(a);let E=a.querySelector("#btfw-vo-bar");E||(E=document.createElement("div"),E.className="btfw-vo-bar",E.id="btfw-vo-bar",a.appendChild(E));let _=te(a,E);return A(_.left),g(_),H(_),K(a),a}function K(i){i&&i.querySelectorAll("button").forEach(a=>{a.classList.contains("btfw-vo-btn")||a.classList.add("btfw-vo-btn")})}function te(i,a){let E="btfw-vo-left",_="btfw-vo-right",W=a.querySelector(`#${E}`);W||(W=document.createElement("div"),W.id=E,W.className="btfw-vo-section btfw-vo-section--left",a.insertBefore(W,a.firstChild));let Y=a.querySelector(`#${_}`);return Y||(Y=document.createElement("div"),Y.id=_,Y.className="btfw-vo-section btfw-vo-section--right",a.appendChild(Y)),Array.from(a.children).forEach(ne=>{ne===W||ne===Y||Y.appendChild(ne)}),i.dataset.leftSection=`#${E}`,i.dataset.rightSection=`#${_}`,a.dataset.leftSection=`#${E}`,a.dataset.rightSection=`#${_}`,{left:W,right:Y}}function j(){return document.querySelector("#ytapiplayer video, video")}function Q(i=j()){return i?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof i.webkitShowPlaybackTargetPicker=="function":!1}function J(){if(!D)return;let i=D._btfwAirplayHandler;if(i){try{D.removeEventListener("webkitplaybacktargetavailabilitychanged",i)}catch(a){}delete D._btfwAirplayHandler}D=null}function re(i){if(!i||typeof i.addEventListener!="function"){J();return}if(D===i)return;J();let a=E=>{let _=!E||E.availability==="available",W=e("#btfw-airplay");W&&(W.style.display=_?"":"none")};try{i.addEventListener("webkitplaybacktargetavailabilitychanged",a),i._btfwAirplayHandler=a,D=i}catch(E){}}function oe(){let i=e("#btfw-airplay");if(!i)return;let a=j();if(!Q(a)){i.style.display="none",J();return}i.style.display="",re(a)}function ie(i,a){a&&a.classList.add("btfw-vo-visible")}function g(i){if(!(i!=null&&i.right)||!(i!=null&&i.left))return;let a=[];document.querySelector("#fullscreenbtn")||a.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:ee,section:"right"}),a.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:v,section:"right"}),a.forEach(E=>{let _=document.querySelector(`#${E.id}`),W=E.section==="left"?i.left:i.right;if(_)W&&_.parentElement!==W&&W.appendChild(_);else{_=document.createElement("button"),_.id=E.id,_.className="btfw-vo-btn";let Y=document.createElement("i");Y.className=E.icon,_.appendChild(Y),_.title=E.tooltip,_.addEventListener("click",E.action),(W||i.right).appendChild(_)}}),oe()}function H(i){let a=i==null?void 0:i.right;a&&t.forEach(E=>{let _=document.querySelector(E);if(!_)return;if(_.dataset.btfwOverlay==="1"){_.parentElement!==a&&a.appendChild(_);return}let W=document.createElement("span");W.hidden=!0,W.setAttribute("data-btfw-ph",E);try{_.insertAdjacentElement("afterend",W)}catch(Y){}if(_.classList.add("btfw-vo-adopted"),_.dataset.btfwOverlay="1",_.id==="mediarefresh"){let Y=_.onclick;_.onclick=ne=>{ne.preventDefault();let ue=!!(ne&&ne.isTrusted);G(()=>{if(typeof Y=="function")try{return Y.call(_,ne),!0}catch(le){console.warn("[video-overlay] native refresh handler failed:",le)}return!1},{isUserAction:ue})}}a.appendChild(_)})}function z(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(i){console.warn("[video-overlay] Media refresh failed:",i)}return!1}function G(i,a={}){let{isUserAction:E=!1}=a,_=Date.now();if(I&&_-I>q&&(O=N,k=0),_<x){let le=Math.ceil((x-_)/1e3);return T(E?`Refresh available in ${le}s`:`Auto refresh paused. Next attempt in ${le}s`,"warning"),!1}let W=E?B:O;if(I&&_-I<W){let le=W-(_-I),ae=Math.ceil(le/1e3);return x=_+le,T(E?`Refresh available in ${ae}s`:`Auto refresh paused. Next attempt in ${ae}s`,"warning"),!1}if(k++,k>=10)return x=_+3e4,k=0,T("Refresh limit reached. 30s cooldown active.","error"),!1;let Y=E?6e3:Math.max(12e3,O+2e3);setTimeout(()=>{k>0&&k--},Y);let ne=!1;if(typeof i=="function")try{ne=i()===!0}catch(le){console.warn("[video-overlay] Refresh handler error:",le)}return ne||(ne=z()),I=Date.now(),E?O=N:O=Math.min(U,Math.max(N,Math.round(O*(ne?1.25:1.5)))),x=Math.max(x,I+(E?B:O)),!E&&ne?T(`Auto refresh sent. Next attempt in ${Math.ceil(O/1e3)}s`,"info"):T(ne?"Media refreshed":"Unable to refresh media",ne?"success":"error"),ne}function ee(){let i=e("#videowrap");i&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():i.requestFullscreen?i.requestFullscreen():i.webkitRequestFullscreen?i.webkitRequestFullscreen():i.mozRequestFullScreen&&i.mozRequestFullScreen())}function X(i,a=!0){if(!i||!Q(i))return!1;if(i.setAttribute("airplay","allow"),i.setAttribute("x-webkit-airplay","allow"),a&&typeof i.webkitShowPlaybackTargetPicker=="function")try{i.webkitShowPlaybackTargetPicker()}catch(E){console.warn("[video-overlay] AirPlay picker failed:",E)}return oe(),!0}function h(){if(!(Z||!window.socket)){Z=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let i=j();i&&(X(i,!1),re(i)),oe()},1e3)})}catch(i){console.warn("[video-overlay] Failed to attach AirPlay listener:",i)}}}function v(){let i=j();return Q(i)?X(i)?(T("AirPlay enabled","success"),h(),!0):(T("AirPlay not available","warning"),!1):(oe(),T("AirPlay not available","warning"),!1)}function T(i,a="info"){let E=document.getElementById("btfw-notification");E||(E=document.createElement("div"),E.id="btfw-notification",E.className="btfw-notification",document.body.appendChild(E)),E.textContent=i,E.className=`btfw-notification btfw-notification--${a} btfw-notification--show`,clearTimeout(E._hideTimer),E._hideTimer=setTimeout(()=>{E.classList.remove("btfw-notification--show")},3e3)}function n(){return e("video")}function r(i){let a=(i||"").replace(/\r\n/g,`
`).trim()+`
`;return a=a.replace(/^\d+\s*$\n/gm,""),a=a.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),a=a.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+a}async function o(){let i=n();if(!i){c("Local subs only for HTML5 sources.");return}let a=document.createElement("input");a.type="file",a.accept=".vtt,.srt,text/vtt,text/plain",a.style.display="none",document.body.appendChild(a);let E=new Promise(_=>{a.addEventListener("change",async()=>{let W=a.files&&a.files[0];if(document.body.removeChild(a),!W)return _(!1);try{let Y=await W.text(),ue=(W.name.split(".").pop()||"").toLowerCase()==="srt"?r(Y):Y.startsWith("WEBVTT")?Y:`WEBVTT

`+Y,le=URL.createObjectURL(new Blob([ue],{type:"text/vtt"}));d(i,le,W.name.replace(/\.[^.]+$/,"")||"Local"),c("Subtitles loaded."),_(!0)}catch(Y){console.error(Y),c("Failed to load subtitles."),_(!1)}},{once:!0})});a.click(),await E}function d(i,a,E){var W;(W=e('track[data-btfw="1"]',i))==null||W.remove();let _=document.createElement("track");_.kind="subtitles",_.label=E||"Local",_.srclang="en",_.src=a,_.default=!0,_.setAttribute("data-btfw","1"),i.appendChild(_);try{for(let Y of i.textTracks)Y.mode=Y.label===_.label?"showing":"disabled"}catch(Y){}}function c(i){let a=e("#btfw-mini-toast");a||(a=document.createElement("div"),a.id="btfw-mini-toast",document.body.appendChild(a)),a.textContent=i,a.style.opacity="1",clearTimeout(a._hid),a._hid=setTimeout(()=>a.style.opacity="0",1400)}function A(i){if(!i)return;let a=document.querySelector("#btfw-vo-subs");if(!a){a=document.createElement("button"),a.id="btfw-vo-subs",a.className="btfw-vo-btn",a.title="Load local subtitles (.vtt/.srt)";let _=document.createElement("i");_.className="fa fa-cc",a.appendChild(_),a.addEventListener("click",W=>{W.preventDefault(),o()}),i.insertBefore(a,i.firstChild||null)}let E=y()&&w();a.style.display=E?"":"none"}function R(){$(),V();let i=[e("#videowrap"),e("#rightcontrols"),e("#leftcontrols"),document.body].filter(Boolean),a=new MutationObserver(()=>V());i.forEach(E=>a.observe(E,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>V());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>V(),0)})}catch(E){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R(),{name:"feature:videoOverlay",setLocalSubsEnabled:L,toggleFullscreen:ee,enableAirplay:v}});var nt="https://vidprox.movies-storage-a.workers.dev/?url=";function $e(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function xe(){return Date.now()}var ot=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var t,u,l;let e=typeof window!="undefined"&&(((t=window.BTFW_CONFIG)==null?void 0:t.corsVideoProxy)||((l=(u=window.BTFW_CONFIG)==null?void 0:u.integrations)==null?void 0:l.corsVideoProxy));if(typeof e=="string"&&e.trim()){let f=e.trim();if(f.includes("?"))return f;let s=f.endsWith("/")?"":"/";return`${f}${s}?url=`}return nt},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(e){try{return new URL(nt).origin.toLowerCase()}catch(t){return""}}},_isTrusted(e){if(!e)return!1;if(String(e).includes(this.CORS_PROXY))return!0;try{let t=new URL(e),u=t.origin.toLowerCase(),l=this._getCorsProxyOrigin();return l&&u===l?!0:/^vidprox\./i.test(t.hostname)}catch(t){return!1}},_unwrapProxiedUrl(e){if(!e||!this._isTrusted(e))return e;try{return new URL(e).searchParams.get("url")||e}catch(t){return e}},_markInternalSrcSet(){this._lastInternalSrcSetAt=xe()},_isInsideInternalWindow(){return xe()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let e=this._getMediaElement();return e?e.crossOrigin==="anonymous"||e.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var t;if(this._hasAnonymousCrossOrigin())return!1;let e=this._readCurrentSrc();if(e&&!this._isTrusted(e))return!1;try{return(t=this.player)==null||t.crossOrigin("anonymous"),!0}catch(u){return!1}},_clearMediaElementForCorsSwap(){let e=this._getMediaElement();if(e)try{for(e.removeAttribute("src"),e.removeAttribute("crossorigin");e.firstChild;)e.removeChild(e.firstChild);e.load()}catch(t){}},_same(e,t){return String(e||"")===String(t||"")},_readCurrentSrc(){var e,t,u;try{let l=((t=(e=this.player)==null?void 0:e.currentSrc)==null?void 0:t.call(e))||"";if(l)return l}catch(l){}return((u=this._getMediaElement())==null?void 0:u.currentSrc)||""},_getMediaElement(){var u;let e=(u=this.player)==null?void 0:u.tech_;if(e){try{let l=typeof e.el=="function"?e.el():null;if(l instanceof HTMLMediaElement&&l.isConnected)return l}catch(l){}if(e.el_ instanceof HTMLMediaElement&&e.el_.isConnected)return e.el_}let t=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return t instanceof HTMLMediaElement&&t.isConnected?t:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(e){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(e){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(e){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(e){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(e){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(e){}this.mergerNode=null}},resetMediaBinding(){var t,u;this.disconnectChain();let e=this._getMediaElement();if(e&&this._syncFromRegistry(e)){((t=this.audioContext)==null?void 0:t.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((u=this.audioContext)==null?void 0:u.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(e){var w;let t=(w=this.player)==null?void 0:w.tech_;if(!(t!=null&&t.el_)||t.el_!==e)return null;let u=e.parentNode;if(!u)return null;let l=e.tagName.toLowerCase()==="audio"?"audio":"video",f=document.createElement(l);f.className=e.className,e.id&&(f.id=e.id),f.setAttribute("playsinline",""),f.setAttribute("webkit-playsinline",""),f.classList.contains("vjs-tech")||f.classList.add("vjs-tech");let s=e.crossOrigin||e.getAttribute("crossorigin");return s&&(f.crossOrigin=s,f.setAttribute("crossorigin",s)),u.replaceChild(f,e),t.el_=f,delete e.__btfwSourceNode,f},_syncFromRegistry(e){let t=$e().get(e)||e.__btfwSourceNode||null;return t?($e().set(e,t),this.sourceNode=t,this._sourceMediaElement=e,t.context instanceof AudioContext&&t.context.state!=="closed"&&(this.audioContext=t.context),t):null},_getOrCreateSourceNode(e){let t=$e(),u=t.get(e)||e.__btfwSourceNode||null;if(u)return t.set(e,u),this.sourceNode=u,this._sourceMediaElement=e,u.context instanceof AudioContext&&u.context.state!=="closed"&&(this.audioContext=u.context),u;if(this.sourceNode&&this._sourceMediaElement===e)return t.set(e,this.sourceNode),e.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let l;try{l=this.audioContext.createMediaElementSource(e)}catch(f){if(!(f instanceof DOMException)||f.name!=="InvalidStateError")throw f;let s=this._syncFromRegistry(e);if(s)return s;let w=this._swapVideoTechElement(e);if(!w)throw f;let p=this._readCurrentSrc();if(p&&this.player){this._markInternalSrcSet(),this.player.src({src:p,type:"video/mp4"});try{this.player.load()}catch(C){}}return this._getOrCreateSourceNode(w)}return t.set(e,l),e.__btfwSourceNode=l,this.sourceNode=l,this._sourceMediaElement=e,l},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(e){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(e){return!1}},_clearCrossOriginAttribute(){var t,u;let e=this._getMediaElement();if(e)try{e.crossOrigin=null,e.removeAttribute("crossorigin")}catch(l){}try{(u=(t=this.player)==null?void 0:t.crossOrigin)==null||u.call(t,null)}catch(l){}},cleanup(){this.disconnectChain();let e=this._getMediaElement();e&&(e.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let e=this._readCurrentSrc();return this.sourceNode&&e&&!this._isTrusted(e)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(e,{currentTime:t=0,wasPlaying:u=!1,clearCrossOrigin:l=!1}={}){if(!this.player||!e)return Promise.resolve(!1);let f=this.player;try{this.player.pause()}catch(s){}l&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:e,type:"video/mp4"});try{this.player.load()}catch(s){}return new Promise(s=>{let w=!1,p=()=>{if(w)return;w=!0;try{f.off("canplay",C)}catch(M){}try{f.off("loadeddata",C)}catch(M){}try{f.currentTime(t)}catch(M){}let m=u?f.play():Promise.resolve();Promise.resolve(m).catch(()=>{}).finally(()=>s(!0))},C=()=>p();try{f.one("canplay",C)}catch(m){try{f.on("canplay",C)}catch(M){}}try{f.one("loadeddata",C)}catch(m){}typeof f.ready=="function"&&f.ready(()=>{try{typeof f.readyState=="function"&&f.readyState()>=2&&p()}catch(m){}}),setTimeout(p,5e3)})},startWatchdog(){if(!this.player)return;let e=this.player;this.stopWatchdog();let t=this._getMediaElement();if(t&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(t,{attributes:!0,attributeFilter:["src","crossorigin"]});let u=new MutationObserver(()=>{this._checkAndReapply("sources")});u.observe(t,{childList:!0,subtree:!0}),this._sourceObserver=u}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([u,l])=>{e.on(u,l)})}catch(u){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var t;this._stopWatchdogInterval();let e=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(u){}try{(t=this._sourceObserver)==null||t.disconnect()}catch(u){}this._sourceObserver=null,this._mutationObserver=null}if(e&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([u,l])=>{e.off(u,l)})}catch(u){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(e){if(!this.player)return;let t=this._readCurrentSrc();if(t&&(this._lastKnownSrc=t,!this._isInsideInternalWindow())){if(this._isTrusted(t)){this.isProxied=!0,this.proxiedSrc=t,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(t)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(xe()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=xe(),this._forceProxyPreservingState(t)}}},async _forceProxyPreservingState(e){if(!this.player)return!1;let t=this.player,u=t.currentTime(),l=!t.paused();if(this._isTrusted(e))return this.isProxied=!0,this.proxiedSrc=e,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(e)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(e)||e,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(f){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(f){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(f){}return new Promise(f=>{let s=!1,w=()=>{if(!s){s=!0;try{t.off("canplay",p)}catch(C){}try{t.off("loadeddata",p)}catch(C){}try{t.currentTime(u)}catch(C){}this.isProxied=!0,l&&t.play().catch(()=>{}),f(!0)}},p=()=>w();try{t.one("canplay",p)}catch(C){try{t.on("canplay",p)}catch(m){}}try{t.one("loadeddata",p)}catch(C){}typeof t.ready=="function"&&t.ready(()=>{try{typeof t.readyState=="function"&&t.readyState()>=2&&w()}catch(C){}}),setTimeout(w,5e3)})},async ensureProxy(){if(!this.player)return!1;let e=this.player,t=this._readCurrentSrc();if(!t)return!1;if(this._isTrusted(t)){if(this.isProxied=!0,this.proxiedSrc=t,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(t)),this._hasAnonymousCrossOrigin())return!0;let u=e.currentTime(),l=!e.paused();try{e.pause()}catch(f){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),e.src({src:t,type:"video/mp4"});try{e.load()}catch(f){}return new Promise(f=>{e.ready(()=>{try{e.currentTime(u)}catch(s){}l&&e.play().catch(()=>{}),f(!0)})})}return await this._forceProxyPreservingState(t),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var t,u;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let l=this._readCurrentSrc();if(this._isTrusted(l))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let e=this._getMediaElement();if(!e)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((t=this.audioContext)==null?void 0:t.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),e.disableRemotePlayback=!0;let l=this._getOrCreateSourceNode(e),f=this.audioContext;if(!f)return!1;let s=l;if(this.normalizationEnabled){this.compressorNode=f.createDynamicsCompressor();let w=(u=this.NORM_PRESETS[this.currentNormPreset])!=null?u:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(w.threshold,f.currentTime),this.compressorNode.knee.setValueAtTime(w.knee,f.currentTime),this.compressorNode.ratio.setValueAtTime(w.ratio,f.currentTime),this.compressorNode.attack.setValueAtTime(w.attack,f.currentTime),this.compressorNode.release.setValueAtTime(w.release,f.currentTime),s.connect(this.compressorNode),s=this.compressorNode}return this.monoEnabled&&(this.splitterNode=f.createChannelSplitter(2),this.monoMixGain=f.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=f.createChannelMerger(2),s.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),s=this.mergerNode),this.boostEnabled&&(this.gainNode=f.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,s.connect(this.gainNode),s=this.gainNode),s.connect(f.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(l){return console.error("[BTFW_AUDIO] Error building audio chain:",l),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(e){return this.NORM_PRESETS[e]?(this.currentNormPreset=e,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(e){return this.BOOST_MULTIPLIER=e,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()}};(function(){"use strict";let e=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),t=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),u="--btfw-boost-anchor",l="--btfw-norm-anchor";function f(w,p,C){if(t&&C){p.style.setProperty("anchor-name",C),w.style.setProperty("position-anchor",C),w.style.setProperty("top","anchor(bottom)"),w.style.setProperty("left","anchor(left)");return}let m=p.getBoundingClientRect();w.style.left=m.left+"px",w.style.top=m.bottom+"px"}function s(w){window.BTFW&&typeof BTFW.define=="function"?w():setTimeout(()=>s(w),0)}s(function(){BTFW.define("feature:audio",[],async()=>{let w=(o,d=document)=>d.querySelector(o),p=ot,C=null,m=null,M=null,P=!1,S=!1,b=!1,y=null,L=null,k=null,x=null,I=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function B(o){C&&(o?(C.classList.add("active"),C.style.background="rgba(46, 213, 115, 0.3)",C.style.borderColor="#2ed573",C.style.color="#2ed573",C.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(C.classList.remove("active"),C.style.background="",C.style.borderColor="",C.style.color="",C.style.boxShadow=""))}function N(o,d="info"){let c=w("#btfw-audioboost-toast");c||(c=document.createElement("div"),c.id="btfw-audioboost-toast",c.style.cssText=`
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
          `,document.body.appendChild(c)),c.textContent=o,c.style.background=d==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",c.style.opacity="1",setTimeout(()=>{c.style.opacity="0"},2e3)}async function U(){if(await p.enableBoost()){P=!0;let d=Math.round(p.BOOST_MULTIPLIER*100);N(`Boosted by ${d}%`,"success"),B(!0)}else{let d=p._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";N(d,"error")}}async function q(){await p.disableBoost(),P=!1,B(!1)}function O(o){m&&(o?(m.classList.add("active"),m.style.background="rgba(52, 152, 219, 0.3)",m.style.borderColor="#3498db",m.style.color="#3498db",m.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(m.classList.remove("active"),m.style.background="",m.style.borderColor="",m.style.color="",m.style.boxShadow=""))}function Z(o,d="info"){let c=w("#btfw-audionorm-toast");c||(c=document.createElement("div"),c.id="btfw-audionorm-toast",c.style.cssText=`
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
          `,document.body.appendChild(c)),c.textContent=o,c.style.background=d==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",c.style.opacity="1",setTimeout(()=>{c.style.opacity="0"},2e3)}async function D(){if(await p.enableNormalization())S=!0,Z("Normalization enabled","success"),O(!0);else{let d=p._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";Z(d,"error")}}async function $(){await p.disableNormalization(),S=!1,O(!1)}function F(o){M&&(o?(M.classList.add("active"),M.style.background="rgba(155, 89, 182, 0.3)",M.style.borderColor="#9b59b6",M.style.color="#9b59b6",M.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(M.classList.remove("active"),M.style.background="",M.style.borderColor="",M.style.color="",M.style.boxShadow=""))}function V(o,d="info"){let c=w("#btfw-mono-toast");c||(c=document.createElement("div"),c.id="btfw-mono-toast",c.style.cssText=`
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
          `,document.body.appendChild(c)),c.textContent=o,c.style.background=d==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",c.style.opacity="1",setTimeout(()=>{c.style.opacity="0"},2e3)}async function K(){if(await p.enableMono())b=!0,V("Stereo audio enabled","success"),F(!0);else{let d=p._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";V(d,"error")}}async function te(){await p.disableMono(),b=!1,F(!1)}function j(){let o=document.createElement("button");o.id="btfw-vo-audioboost",o.className="btn btn-sm btn-default btfw-vo-adopted";let d=Math.round(p.BOOST_MULTIPLIER*100);o.title=`Toggle Audio Boost (${d}%)`,o.setAttribute("data-btfw-overlay","1");let c=document.createElement("i");return c.className="fa fa-bullhorn",o.appendChild(c),o.addEventListener("click",()=>{p.boostEnabled?q():U()}),o.addEventListener("mouseenter",()=>{k&&(clearTimeout(k),k=null),oe()}),o.addEventListener("mouseleave",()=>{k=setTimeout(()=>ie(),150)}),o}function Q(){let o=document.createElement("button");o.id="btfw-vo-audionorm",o.className="btn btn-sm btn-default btfw-vo-adopted";let d=p.NORM_PRESETS[p.currentNormPreset].label;o.title=`Toggle Audio Normalization (${d})`,o.setAttribute("data-btfw-overlay","1");let c=document.createElement("i");return c.className="fa fa-sliders",o.appendChild(c),o.addEventListener("click",()=>{p.normalizationEnabled?$():D()}),o.addEventListener("mouseenter",()=>{x&&(clearTimeout(x),x=null),z()}),o.addEventListener("mouseleave",()=>{x=setTimeout(()=>G(),150)}),o}function J(){let o=document.createElement("button");o.id="btfw-vo-mono",o.className="btn btn-sm btn-default btfw-vo-adopted",o.title="Toggle Mono Audio (mix both channels to stereo)",o.setAttribute("data-btfw-overlay","1");let d=document.createElement("i");return d.className="fa fa-headphones",o.appendChild(d),o.addEventListener("click",()=>{p.monoEnabled?te():K()}),o}function re(){if(y)return y;let o=document.createElement("div");return o.id="btfw-boost-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,I.forEach(d=>{let c=document.createElement("button");c.className="btfw-context-item",c.textContent=d.label,c.style.cssText=`
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
          `,p.BOOST_MULTIPLIER===d.multiplier&&(c.style.background="rgba(46, 213, 115, 0.2)",c.style.color="#2ed573"),c.addEventListener("mouseenter",()=>{p.BOOST_MULTIPLIER!==d.multiplier&&(c.style.background="rgba(109, 77, 246, 0.2)")}),c.addEventListener("mouseleave",()=>{p.BOOST_MULTIPLIER!==d.multiplier&&(c.style.background="transparent")}),c.addEventListener("click",async()=>{if(await p.setBoostMultiplier(d.multiplier),g(),C){let A=Math.round(d.multiplier*100);C.title=`Toggle Audio Boost (${A}%)`}p.boostEnabled&&N(`Boost set to ${d.label}`,"success")}),o.appendChild(c)}),o.addEventListener("mouseenter",()=>{k&&(clearTimeout(k),k=null)}),o.addEventListener("mouseleave",()=>{k=setTimeout(()=>ie(),100)}),document.body.appendChild(o),y=o,o}function oe(){if(!C)return;let o=re();f(o,C,u),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function ie(){y&&(e?y.matches(":popover-open")&&y.hidePopover():y.style.display="none")}function g(){if(!y)return;y.querySelectorAll(".btfw-context-item").forEach((d,c)=>{let A=I[c];p.BOOST_MULTIPLIER===A.multiplier?(d.style.background="rgba(46, 213, 115, 0.2)",d.style.color="#2ed573"):(d.style.background="transparent",d.style.color="#e0e0e0")})}function H(){if(L)return L;let o=document.createElement("div");return o.id="btfw-norm-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,Object.keys(p.NORM_PRESETS).forEach(d=>{let c=p.NORM_PRESETS[d],A=document.createElement("button");A.className="btfw-context-item",A.textContent=c.label,A.style.cssText=`
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
          `,p.currentNormPreset===d&&(A.style.background="rgba(52, 152, 219, 0.2)",A.style.color="#3498db"),A.addEventListener("mouseenter",()=>{p.currentNormPreset!==d&&(A.style.background="rgba(109, 77, 246, 0.2)")}),A.addEventListener("mouseleave",()=>{p.currentNormPreset!==d&&(A.style.background="transparent")}),A.addEventListener("click",async()=>{await p.setNormPreset(d),ee(),m&&(m.title=`Toggle Audio Normalization (${c.label})`),p.normalizationEnabled&&Z(`Preset: ${c.label}`,"success")}),o.appendChild(A)}),o.addEventListener("mouseenter",()=>{x&&(clearTimeout(x),x=null)}),o.addEventListener("mouseleave",()=>{x=setTimeout(()=>G(),100)}),document.body.appendChild(o),L=o,o}function z(){if(!m)return;let o=H();f(o,m,l),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function G(){L&&(e?L.matches(":popover-open")&&L.hidePopover():L.style.display="none")}function ee(){if(!L)return;let o=L.querySelectorAll(".btfw-context-item");Object.keys(p.NORM_PRESETS).forEach((d,c)=>{let A=o[c];p.currentNormPreset===d?(A.style.background="rgba(52, 152, 219, 0.2)",A.style.color="#3498db"):(A.style.background="transparent",A.style.color="#e0e0e0")})}function X(){let o=w("#btfw-vo-left");if(!o)return!1;let d=w("#btfw-vo-audioboost");d&&d.remove();let c=w("#btfw-vo-audionorm");c&&c.remove();let A=w("#btfw-vo-mono");return A&&A.remove(),C=j(),m=Q(),M=J(),o.appendChild(C),o.appendChild(m),o.appendChild(M),!0}function h(o,d=20){let c=d*500;he(()=>w("#btfw-vo-left")?!0:null,{timeoutMs:c}).then(()=>{X(),o()}).catch(()=>{X()&&o()})}function v(){Promise.all([he(()=>typeof videojs!="undefined"?videojs:null),pe("#ytapiplayer")]).then(([o])=>{p.player=o("ytapiplayer"),p.originalSrc=p._readCurrentSrc(),p.startWatchdog()}).catch(()=>{})}function T(){setTimeout(()=>{p.resetMediaBinding(),p.boostEnabled=!1,p.normalizationEnabled=!1,p.monoEnabled=!1,p.isProxied=!1,B(!1),O(!1),F(!1),v(),P&&setTimeout(()=>{U()},1200),S&&setTimeout(()=>{D()},1200),b&&setTimeout(()=>{K()},1200)},600)}function n(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>p._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>p._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",T))}function r(){h(()=>{v()}),n()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",r):r(),{name:"feature:audio",activate:U,deactivate:q,isActive:()=>p.boostEnabled,activateNormalization:D,deactivateNormalization:$,isNormalizationActive:()=>p.normalizationEnabled,activateMono:K,deactivateMono:te,isMonoActive:()=>p.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async w=>w.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:e})=>{let t=await e("util:tmdb-proxy"),u="movie-info",l={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},f="btfw-movie-info-style",s={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},w=0,p=!1,C=null;function m(h){typeof h=="function"&&s.cleanup.push(h)}function M(){for(;s.cleanup.length;){let h=s.cleanup.pop();try{h()}catch(v){}}s.header&&(s.header.remove(),s.header=null)}function P(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null),s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null),w=0,s.currentTitle="",s.isInitialized=!1,M()}function S(h){if(typeof h=="boolean")return h;if(typeof h=="number")return Number.isFinite(h)?h>0:!1;if(typeof h=="string"){let v=h.trim().toLowerCase();return v?v==="1"||v==="true"||v==="yes"||v==="on":!1}return!1}function b(){let h=[()=>{var v,T,n;return(n=(T=(v=window.BTFW_THEME_ADMIN)==null?void 0:v.integrations)==null?void 0:T.movieInfo)==null?void 0:n.enabled},()=>{var v,T,n;return(n=(T=(v=window.BTFW_CONFIG)==null?void 0:v.integrations)==null?void 0:T.movieInfo)==null?void 0:n.enabled},()=>{var v,T;return(T=(v=window.BTFW_CONFIG)==null?void 0:v.movieInfo)==null?void 0:T.enabled},()=>{var v;return(v=window.BTFW_CONFIG)==null?void 0:v.movieInfoEnabled},()=>{var v,T;return(T=(v=document==null?void 0:document.body)==null?void 0:v.dataset)==null?void 0:T.btfwMovieInfoEnabled}];for(let v of h)try{let T=typeof v=="function"?v():v;if(S(T))return!0}catch(T){}return!1}function y(){if(C||typeof MutationObserver!="function")return;let h=document.body;h&&(C=new MutationObserver(()=>I()),C.observe(h,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function L(){if(p)return;p=!0;let h=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",h),document.addEventListener("btfw:ready",h)}function k(h=0){s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.initTimer=window.setTimeout(()=>{s.initTimer=null,b()&&x()},Math.max(0,h))}function x(){if(s.isInitialized)return;let h=document.querySelector(l.TOPBAR_SELECTOR);if(!h){k(500);return}try{B(h),ee(),U(),s.isInitialized=!0,setTimeout(()=>{K(),te()},120)}catch(v){k(800)}}function I(){b()?s.isInitialized?(K(),setTimeout(te,80)):k(0):P()}function B(h){if(!h&&(h=document.querySelector(l.TOPBAR_SELECTOR),!h))throw new Error("Chat topbar not found");let v=document.getElementById(l.CONTAINER_ID);v&&v.remove();let T=document.createElement("div");T.id=l.CONTAINER_ID,T.className="btfw-movie-header hide",T.dataset.module=u,h.insertAdjacentElement("afterend",T),s.header=T}function N(){try{return window.socket||window.SOCKET||null}catch(h){return null}}function U(){q(),D();let h=G(K,250);window.addEventListener("resize",h),m(()=>window.removeEventListener("resize",h))}function q(){O(),Z()}function O(){let h=document.querySelector(l.TITLE_SELECTOR);if(h){let v=()=>F(),T=()=>V();h.addEventListener("mouseenter",v),h.addEventListener("mouseleave",T),m(()=>{h.removeEventListener("mouseenter",v),h.removeEventListener("mouseleave",T)})}else if(typeof MutationObserver=="function"){let v=new MutationObserver(()=>{document.querySelector(l.TITLE_SELECTOR)&&(v.disconnect(),O())});v.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),m(()=>{try{v.disconnect()}catch(T){}})}}function Z(){let h=s.header;if(!h)return;let v=()=>$(),T=()=>V();h.addEventListener("mouseenter",v),h.addEventListener("mouseleave",T),m(()=>{h.removeEventListener("mouseenter",v),h.removeEventListener("mouseleave",T)})}function D(){let h=N();if(h&&typeof h.on=="function"){h.on("changeMedia",te),m(()=>{var v,T;try{(v=h.off)==null||v.call(h,"changeMedia",te)}catch(n){try{(T=h.removeListener)==null||T.call(h,"changeMedia",te)}catch(r){}}});return}he(()=>{if(!b())return null;let v=N();return v&&typeof v.on=="function"?v:null},{timeoutMs:1e4}).then(v=>{s.socketRetryTimer=null,v.on("changeMedia",te),m(()=>{var T,n;try{(T=v.off)==null||T.call(v,"changeMedia",te)}catch(r){try{(n=v.removeListener)==null||n.call(v,"changeMedia",te)}catch(o){}}})}).catch(()=>{s.socketRetryTimer=null}),m(()=>{s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null)})}function $(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null)}function F(){$(),s.header&&(s.header.classList.remove("hide"),s.header.classList.add("show"))}function V(){$(),s.hideTimer=window.setTimeout(()=>{s.header&&(s.header.classList.remove("show"),s.header.classList.add("hide"),setTimeout(()=>{s.header&&s.header.classList.contains("hide")&&s.header.classList.remove("hide")},320))},300)}function K(){if(!s.header)return;let h=window.innerWidth<=768;s.header.classList.toggle("btfw-mobile",h)}async function te(){var r;if(!s.isInitialized)return;let h=document.querySelector(l.TITLE_SELECTOR),v=s.header;if(!h||!v)return;let T=((r=h.textContent)==null?void 0:r.trim())||"";if(!T){s.currentTitle="",oe();return}if(T===s.currentTitle)return;s.currentTitle=T;let n=++w;J();try{let o=await Q(T);if(n!==w)return;g(o)}catch(o){if(n!==w)return;t.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),re()}}function j(h){let v=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],T=h;return v.forEach(n=>{let r=new RegExp(`\\b${n}\\b`,"gi");T=T.replace(r,"")}),T.replace(/\s{2,}/g," ").trim()}async function Q(h){var d;if(!t.isAvailable())throw new Error(t.MISSING_PROXY_MSG);let v=h.match(/(.+)\s*\((\d{4})\)/),T=v?v[1].trim():h,n=v?v[2]:"";n||(v=h.match(/(.+?)\s+(\d{4})\s*$/),v&&(T=v[1].trim(),n=v[2]));let r=j(T),o=await t.tmdbFetch("search/movie",{query:r,year:n});if(((d=o==null?void 0:o.results)==null?void 0:d.length)>0){let c=o.results[0];return{title:h,backdrop:c.backdrop_path?`https://image.tmdb.org/t/p/w1280${c.backdrop_path}`:null,poster:c.poster_path?`https://image.tmdb.org/t/p/w500${c.poster_path}`:null,summary:c.overview||"",rating:c.vote_average||0,releaseDate:c.release_date||"",voteCount:c.vote_count||0}}return{title:h,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function J(){if(!s.header)return;ie();let h=document.createElement("div");h.className="btfw-movie-content";let v=document.createElement("div");v.className="btfw-movie-loading";let T=document.createElement("i");T.className="fa fa-spinner fa-spin";let n=document.createElement("p");n.textContent="Loading movie information...",v.append(T,n),h.appendChild(v),s.header.replaceChildren(h)}function re(){if(!s.header)return;ie();let h=document.createElement("div");h.className="btfw-movie-content";let v=document.createElement("div");v.className="btfw-movie-error";let T=document.createElement("i");T.className="fa fa-exclamation-triangle";let n=document.createElement("p");n.textContent="Unable to fetch movie information";let r=document.createElement("small");r.textContent="Check TMDB API key in Theme Settings",v.append(T,n,r),h.appendChild(v),s.header.replaceChildren(h)}function oe(){if(!s.header)return;ie();let h=document.createElement("div");h.className="btfw-movie-content";let v=document.createElement("p");v.textContent="No movie information available",h.appendChild(v),s.header.replaceChildren(h)}function ie(){s.header&&(s.header.style.backgroundImage="",s.header.style.backgroundColor="")}function g(h){if(!s.header)return;s.header.replaceChildren(),l.ENABLE_BACKDROP&&h.backdrop?(s.header.style.backgroundImage=`url(${h.backdrop})`,s.header.style.backgroundSize="cover",s.header.style.backgroundPosition="center"):ie();let v=document.createElement("div");v.className="btfw-movie-overlay",s.header.appendChild(v);let T=document.createElement("div");if(T.className="btfw-movie-content",s.header.appendChild(T),h.poster){let o=document.createElement("img");o.src=h.poster,o.alt=`${h.title} Poster`,o.className="btfw-movie-poster",T.appendChild(o)}let n=document.createElement("div");n.className="btfw-movie-details",T.appendChild(n);let r=document.createElement("h2");if(r.textContent=h.title,r.className="btfw-movie-title",n.appendChild(r),l.SHOW_SUMMARY&&h.summary){let o=document.createElement("p");o.textContent=h.summary,o.className="btfw-movie-summary",n.appendChild(o)}if(l.ENABLE_RATING&&h.rating>0){let o=H(h.rating,h.voteCount);T.appendChild(o)}}function H(h,v){let T=document.createElement("div");T.className="btfw-movie-rating";let n=Math.round(h*10),r=z(n),o="http://www.w3.org/2000/svg",d=document.createElementNS(o,"svg");d.setAttribute("width","60"),d.setAttribute("height","60"),d.setAttribute("viewBox","0 0 60 60");let c=25,A=2*Math.PI*c,R=A-h/10*A,i=document.createElementNS(o,"circle");i.setAttribute("cx","30"),i.setAttribute("cy","30"),i.setAttribute("r",c.toString()),i.setAttribute("stroke","#2a2a2a"),i.setAttribute("stroke-width","4"),i.setAttribute("fill","#1a1a1a"),d.appendChild(i);let a=document.createElementNS(o,"circle");a.setAttribute("cx","30"),a.setAttribute("cy","30"),a.setAttribute("r",c.toString()),a.setAttribute("stroke",r),a.setAttribute("stroke-width","3"),a.setAttribute("fill","none"),a.setAttribute("stroke-dasharray",A.toString()),a.setAttribute("stroke-dashoffset",R.toString()),a.setAttribute("transform","rotate(-90 30 30)"),a.setAttribute("stroke-linecap","round"),d.appendChild(a);let E=document.createElementNS(o,"text");if(E.setAttribute("x","50%"),E.setAttribute("y","50%"),E.setAttribute("text-anchor","middle"),E.setAttribute("dominant-baseline","central"),E.setAttribute("fill","#fff"),E.setAttribute("font-size","10"),E.setAttribute("font-weight","bold"),E.textContent=`${n}%`,d.appendChild(E),T.appendChild(d),v>0){let _=document.createElement("div");_.className="btfw-movie-votes",_.textContent=`${v.toLocaleString()} votes`,T.appendChild(_)}return T}function z(h){let v=Math.max(0,Math.min(h,100));return v>=70?"#4caf50":v>=50?"#ff9800":"#f44336"}function G(h,v){let T=null;return function(...r){T&&clearTimeout(T),T=setTimeout(()=>{T=null,h(...r)},v)}}function ee(){if(document.getElementById(f))return;let h=`
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
    `,v=document.createElement("style");v.id=f,v.textContent=h,document.head.appendChild(v)}function X(){y(),L(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X,{once:!0}):X(),{name:"feature:movie-info",refresh:I,cleanup:P}});BTFW.define("feature:monkeyPaw",[],async()=>{let e="btfw-monkey-paw-styles",t="btfw-monkey-paw-overlay",u="/src/assets/monkey-paw/paw.svg",l={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},f={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},s={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},w=null,p=null,C=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function m(B){let N=String(B||"").trim();return/^<svg[\s>]/i.test(N)?!C.test(N):!1}function M(B){return new Promise(N=>setTimeout(N,B))}function P(){try{let B=typeof window!="undefined"?window.BTFW:null;return B&&(B.BASE||B.DEV_CDN)||""}catch(B){return""}}function S(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(B){return!1}}function b(){if(typeof document=="undefined"||document.getElementById(e))return;let B=document.createElement("style");B.id=e,B.textContent=`
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
    `,document.head.appendChild(B)}async function y(){if(w)return w;let N=`${P()}${u}`,U=await fetch(N,{credentials:"omit"});if(!U.ok)throw new Error(`Monkey paw SVG failed to load (${U.status})`);let q=await U.text();if(!m(q))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return w=q,w}function L(B){Object.entries(s).forEach(([N,U])=>{let q=B.querySelector(`#${N}`),O=B.querySelector(`#${N}-tip`);q&&(q.style.transform=U.root),O&&(O.style.transform=U.tip)})}function k(B){Object.entries(l).forEach(([N,U])=>{window.setTimeout(()=>{let q=B.querySelector(`#${N}`),O=B.querySelector(`#${N}-tip`);q&&(q.style.transform=U.root),O&&window.setTimeout(()=>{O.style.transform=U.tip},120)},f[N])})}function x(B){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${B}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function I(B={}){if(p)return p;if(typeof document!="undefined")return p=(async()=>{var Z,D;if(b(),S()){await M((Z=B.reducedMotionMs)!=null?Z:450);return}let N=document.getElementById(t);N||(N=document.createElement("div"),N.id=t,document.body.appendChild(N));let U;try{U=await y()}catch($){console.warn("[monkey-paw] SVG load failed:",$),await M(300);return}N.innerHTML=x(U),L(N);let q=N.querySelector("#paw"),O=N.querySelector("#btfw-monkey-paw-msg");N.classList.remove("is-cursed"),O==null||O.classList.remove("is-visible"),requestAnimationFrame(()=>N.classList.add("is-active")),k(N),await M(980),q==null||q.classList.add("btfw-monkey-paw-shaking"),await M(720),q==null||q.classList.remove("btfw-monkey-paw-shaking"),N.classList.add("is-cursed"),O==null||O.classList.add("is-visible"),await M((D=B.holdMs)!=null?D:1100),N.classList.remove("is-active"),await M(320),N.remove()})().finally(()=>{p=null}),p}return{name:"feature:monkeyPaw",play:I}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:e})=>{let t=await e("util:tmdb-proxy"),u=await e("feature:monkeyPaw"),l=(g,H=document)=>H.querySelector(g),f=(g,H=document)=>Array.from(H.querySelectorAll(g)),s=null,w=null,p=null,C=null,m={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},M=null,P=null,S="[movie-suggestion]";function b(...g){console.log(S,...g)}function y(...g){console.error(S,...g)}function L(g){var H;try{if((H=window.socket)!=null&&H.emit)return window.socket.emit("chatMsg",{msg:g}),!0}catch(z){}return!1}async function k(g,H={}){return t.workerFetch(g,H)}function x(){if(document.getElementById("btfw-movie-suggest-styles"))return;let g=document.createElement("style");g.id="btfw-movie-suggest-styles",g.textContent=`
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
    `,document.head.appendChild(g)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function B(){let g=l("a[href*='donate'], #donate-btn, .donate-btn");if(g){let z=g.closest("ul");if(z)return{ul:z,insertAfter:g.parentElement}}let H=l("#btfw-theme-btn-nav");if(H){let z=H.closest("ul");if(z)return{ul:z,insertAfter:null}}return{ul:l(".navbar .nav.navbar-nav")||l(".navbar-nav")||l(".btfw-navbar ul")||l(".navbar ul"),insertAfter:null}}function N(){if(l("#btfw-movie-suggest-btn"))return!0;let g=B();if(!g.ul)return!1;let H=document.createElement("li"),z=document.createElement("a");return z.href="javascript:void(0)",z.className="btfw-nav-pill",z.id="btfw-movie-suggest-btn",z.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,H.appendChild(z),g.insertAfter?g.insertAfter.after(H):g.ul.insertBefore(H,g.ul.firstChild),z.addEventListener("click",Q),!0}function U(){var G,ee,X,h,v,T;if(l("#btfw-movie-suggest-modal"))return;let g=document.createElement("div");g.id="btfw-movie-suggest-modal",g.className="modal",g.innerHTML=`
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
                     placeholder="${I===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${I===0?"disabled":""}>
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
    `,document.body.appendChild(g);let H=l(".modal-background",g),z=l(".delete",g);if(H.addEventListener("click",J),z.addEventListener("click",J),(G=l("#btfw-movie-prev",g))==null||G.addEventListener("click",()=>{m.page>1&&(m.page-=1,V())}),(ee=l("#btfw-movie-next",g))==null||ee.addEventListener("click",()=>{m.page<m.totalPages&&(m.page+=1,V())}),I===0){let n=l("#btfw-movie-search",g);n.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),n.blur()})}else{let n,r=l("#btfw-movie-search",g);r.addEventListener("input",()=>{clearTimeout(n),m.query=r.value.trim(),m.page=1,n=setTimeout(()=>V(),400)}),(X=l("#btfw-movie-sort",g))==null||X.addEventListener("change",o=>{m.sortBy=o.target.value,m.page=1,V()}),(h=l("#btfw-movie-genre",g))==null||h.addEventListener("change",o=>{m.genreId=o.target.value,m.page=1,V()}),(v=l("#btfw-movie-year",g))==null||v.addEventListener("change",o=>{m.year=o.target.value.trim(),m.page=1,V()}),(T=l("#btfw-movie-rating",g))==null||T.addEventListener("change",o=>{m.minRating=o.target.value.trim(),m.page=1,V()})}}function q(){if(l("#btfw-movie-confirm-modal"))return;let g=document.createElement("div");g.id="btfw-movie-confirm-modal",g.className="modal",g.innerHTML=`
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
    `,document.body.appendChild(g);let H=l(".modal-background",g),z=l(".delete",g),G=l("#btfw-movie-cancel",g),ee=l("#btfw-movie-confirm",g),X=()=>j();H.addEventListener("click",X),z.addEventListener("click",X),G.addEventListener("click",X),ee.addEventListener("click",oe)}async function O(){if(M&&P)return;let[g,H]=await Promise.all([k("/api/meta"),k("/api/genres")]);M=g,P=H;let z=l("#btfw-movie-suggest-modal");if(!z)return;let G=l("#btfw-movie-sort",z);if(G&&G.options.length===0){for(let X of g.sortOptions||[]){let h=document.createElement("option");h.value=X.value,h.textContent=X.label,G.appendChild(h)}G.value=m.sortBy}let ee=l("#btfw-movie-genre",z);if(ee&&ee.options.length<=1)for(let X of H.genres||[]){let h=document.createElement("option");h.value=String(X.id),h.textContent=X.name,ee.appendChild(h)}}function Z(){let g={page:m.page,sort_by:m.sortBy};return m.query?(g.query=m.query,m.year&&(g.primary_release_year=m.year,g.year=m.year)):(m.genreId&&(g.with_genres=m.genreId),m.year&&(g.primary_release_year=m.year),m.minRating&&(g["vote_average.gte"]=m.minRating)),g}function D(g){return!g||g==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${g}`}function $(){let g=l("#btfw-movie-suggest-modal");if(!g)return;let H=l("#btfw-movie-prev",g),z=l("#btfw-movie-next",g),G=l("#btfw-movie-page-label",g);G&&(G.textContent=`Page ${m.page} of ${m.totalPages}`),H&&(H.disabled=m.page<=1||m.loading),z&&(z.disabled=m.page>=m.totalPages||m.loading)}function F(g){let H=l("#btfw-movie-suggest-modal");if(!H)return;let z=l(".btfw-movie-results",H);if(!g.length){z.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}z.innerHTML=g.map(G=>`
      <div class="movie-result"
           data-id="${se(G.id)}"
           data-title="${se(G.title)}"
           data-poster="${se(G.posterPath||"")}"
           data-year="${se(G.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${se(D(G.posterPath))}" alt="${se(G.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${se(G.title)}</div>
          <small style="opacity:0.7;">${se(G.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),f(".movie-result",z).forEach(G=>{G.addEventListener("click",()=>{s=G.dataset.id,w=G.dataset.title,p=G.dataset.poster,C=G.dataset.year||null;let ee=l("#btfw-movie-confirm-modal");if(!ee)return;let X=C?` (${C})`:"";l("#btfw-confirm-movie-title",ee).textContent=`${w}${X}`,te()})})}async function V(){let g=l("#btfw-movie-suggest-modal");if(!g||m.loading)return;m.loading=!0,$();let H=l(".btfw-movie-results",g);H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await O();let z=await k("/api/search",{params:Z()});m.totalPages=Math.max(1,z.totalPages||1),F(z.results||[]),b("runSearch",{page:m.page,totalPages:m.totalPages,count:(z.results||[]).length})}catch(z){y("runSearch failed:",z),H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{m.loading=!1,$()}}async function K(){let g=l("#btfw-movie-history");if(g){g.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let z=(await k("/api/history",{params:{page:1,limit:10}})).results||[];if(!z.length){g.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}g.innerHTML=z.map(G=>{let ee=G.releaseYear?` (${se(G.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${se(D(G.posterPath).replace("w154","w92"))}" alt="${se(G.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${se(G.movieTitle)}${ee}</div>
              <div class="history-item__meta">Requested by ${se(G.username)}</div>
            </div>
          </div>
        `}).join("")}catch(H){y("loadHistory failed:",H),g.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function te(){let g=l("#btfw-movie-suggest-modal"),H=l("#btfw-movie-confirm-modal");H&&(g&&g.classList.add("btfw-movie-suggest-pending"),H.classList.add("is-active"))}function j(){let g=l("#btfw-movie-suggest-modal"),H=l("#btfw-movie-confirm-modal");g&&g.classList.remove("btfw-movie-suggest-pending"),H&&H.classList.remove("is-active")}async function Q(){let g=l("#btfw-movie-suggest-modal");if(g){b("openModal",{userRank:I}),g.classList.remove("btfw-movie-suggest-pending"),g.classList.add("is-active");try{await O(),await Promise.all([V(),K()])}catch(H){y("openModal bootstrap failed:",H)}}}function J(){let g=l("#btfw-movie-suggest-modal");g&&(j(),b("closeModal"),g.classList.remove("is-active"),l("#btfw-movie-search",g).value="",l(".btfw-movie-results",g).innerHTML="",m.query="",m.page=1,m.totalPages=1,s=null,w=null,p=null,C=null)}function re(g,H,z){let G=z?` (${z})`:"";return`\u{1F3AC} Movie request: ${H}${G} \u2014 suggested by ${g}`}async function oe(){if(!s||!w)return;let g=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";b("confirmSuggestion",{movieId:s,movieTitle:w}),j();try{await u.play(),await k("/api/suggestions",{method:"POST",body:{movieId:Number(s),movieTitle:w,username:g,posterPath:p||null,releaseYear:C||null}}),L(re(g,w,C)),await K(),J()}catch(H){y("confirmSuggestion failed:",H),alert("Could not save your movie request. Please try again.")}}function ie(){b("boot: start",{workerBase:t.getWorkerBase()}),x(),U(),q(),pe(".navbar, .navbar-nav, #nav-collapsible",{timeoutMs:5e3}).catch(()=>{}).then(()=>{N()?b("Button added successfully"):console.warn(S,"Failed to add nav button")})}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ie,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ie,200)}):setTimeout(ie,200),{name:"ext:movie-suggestion",open:Q,close:J,getWorkerBase:t.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async e=>e.init("ext:movie-suggestion"));})();
