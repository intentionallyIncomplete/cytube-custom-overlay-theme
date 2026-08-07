/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",[],async()=>{var b;let L=(s,v=document)=>v.querySelector(s),A=(s,v=document)=>Array.from(v.querySelectorAll(s)),U=((b=window.BTFW)==null?void 0:b.BASE)||"";function y(s){if(!s)return;let v=s.startsWith("http")?s:`${U}/${s.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(I=>I.getAttribute("href")===v||I.getAttribute("href")===s))return;let W=document.createElement("link");W.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[s]&&(W.integrity=window.BTFW.SRI[s],W.crossOrigin="anonymous"),W.href=v,document.head.appendChild(W)}function G(){let s=L("#videowrap");if(!s)return;y("dist/css/player.css"),s.classList.add("btfw-player-wrap");let v=s.querySelector("#controlsrow, .player-controls");v&&v.classList.add("btfw-player-controls"),p()}function p(){if(window.videojs)try{let s=document.querySelector(".video-js");s&&!s.classList.contains("btfw-vjs-enhanced")&&s.classList.add("btfw-vjs-enhanced")}catch(s){}}function o(){let s=L("#videowrap");if(!s)return;new MutationObserver(()=>{p()}).observe(s,{childList:!0,subtree:!0})}function i(){G(),o();try{let s=window.socket;s&&typeof s.on=="function"&&s.on("changeMedia",()=>{setTimeout(G,100)})}catch(s){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i(),{name:"feature:player",applyPlayerLayoutEnhancements:G}});function Me(L=document){return!L||typeof L.querySelector!="function"?!1:!!(L.querySelector("#pollwrap .well.active")||L.querySelector("#pollwrap .well.muted")||L.querySelector("#pollwrap .poll-menu"))}function Ae(L,A){return L!=null?!!L:!!A}var St=/[&<>"']/g,_t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function xe(L){return L==null?"":String(L).replace(St,A=>{var U;return(U=_t[A])!=null?U:A})}function kt(L){return L.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function st(L){return L.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var Tt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],Lt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},Ct=["http","https","mailto"],At="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",Pt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,Mt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,Nt={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function It(L){let A=L;for(let y=0;y<3;y+=1){let G=A.replace(/&#x([0-9a-fA-F]+);?/g,(p,o)=>{let i=Number.parseInt(o,16);if(!Number.isFinite(i)||i<0||i>1114111)return"";try{return String.fromCodePoint(i)}catch(b){return""}}).replace(/&#(\d+);?/g,(p,o)=>{let i=Number(o);if(!Number.isFinite(i)||i<0||i>1114111)return"";try{return String.fromCodePoint(i)}catch(b){return""}}).replace(/&([a-zA-Z]+);?/g,(p,o)=>{let i=Nt[o.toLowerCase()];return i!==void 0?i:p});if(G===A)break;A=G}let U="";for(let y=0;y<A.length;y+=1){let G=A.charCodeAt(y);G<=31||G===127||(U+=A[y])}return U.replace(/[\s\u00a0]+/g,"")}function Bt(L){var G,p;let A=new Map,U=new RegExp(Pt.source,"g"),y;for(;(y=U.exec(L))!==null;){let o=((G=y[1])!=null?G:"").toLowerCase(),i=(p=y[2])!=null?p:"";(i.startsWith('"')&&i.endsWith('"')||i.startsWith("'")&&i.endsWith("'"))&&(i=i.slice(1,-1)),A.set(o,i),y[0].length===0&&(U.lastIndex+=1)}return A}function Ot(L,A){var p;let U=It(L);if(U.length===0)return!0;let y=Mt.exec(U);if(!y)return!0;let G=((p=y[1])!=null?p:"").toLowerCase();return A.includes(G)?G==="data"?/^data:image\//i.test(U):!0:!1}function Rt(L,A,U,y,G,p,o){var V,B;let i=A.toLowerCase();if(!G.has(i))return"";if(L)return`</${i}>`;let b=Bt(U||""),s=(V=p["*"])!=null?V:[],v=(B=p[i])!=null?B:[],R=[];for(let[$,Z]of b)$.startsWith("on")||!(s.includes($)||v.includes($))||($==="href"||$==="src")&&!Ot(Z,o)||R.push(`${$}="${kt(Z)}"`);i==="a"&&b.get("target")==="_blank"&&v.includes("rel")&&(R.some($=>$.startsWith("rel="))||R.push('rel="noopener noreferrer"'));let W=R.length>0?` ${R.join(" ")}`:"";return`<${i}${W}${y?" /":""}>`}function Ne(L,A={}){var v,R,W;if(L==null)return"";let U=String(L).replace(/<!--[\s\S]*?-->/g,""),y=new Set(((v=A.allowedTags)!=null?v:Tt).map(I=>I.toLowerCase())),G=(R=A.allowedAttributes)!=null?R:Lt,p=(W=A.allowedSchemes)!=null?W:Ct,o=new RegExp(At,"g"),i="",b=0,s;for(;(s=o.exec(U))!==null;){let[I,V,B="",$="",Z]=s;i+=st(U.slice(b,s.index)),i+=Rt(V,B,$,Z,y,G,p),b=s.index+I.length}return i+=st(U.slice(b)),i}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:L})=>{let A=await L("util:templates"),{stack:U}=A,y="btfw-stack-order",G="btfw-stack-motd-open",p="btfw-stack-playlist-open",o="btfw-stack-poll-open",i={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},b=i,s={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},v={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},R={"motd-group":1,"poll-group":2,"playlist-group":3},W=!1,I=null,V="",B=null,$=null,Z=null,re={"motd-group":{storageKey:G,getDefaultOpen:e=>Ae(e,be()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:p,getDefaultOpen:e=>Ae(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:o,getDefaultOpen:e=>Ae(e,Me()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},z=null,q=!1,ae=!1,te=null,K=!1,ge=!1,le=!1,pe=null,_e=!1;function de(e=""){let t=String(e||"").trim();return t?!t.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function be(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=ue(e);return t?!de(t.innerHTML||""):!1}function ue(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let he=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Se=["#main","#mainpage","#mainpane"],ve=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function ke(e,t,n){if(!e||!t||!n)return null;let a=ve.map(D=>{let j=document.getElementById(D.id);return j?{...D,el:j}:null}).filter(Boolean);if(!a.length){let D=document.getElementById("btfw-addmedia-panel");return D&&D.remove(),null}let r=document.getElementById("btfw-addmedia-panel");if(r||(r=document.createElement("section"),r.id="btfw-addmedia-panel",r.className="btfw-addmedia-panel",r.dataset.open="false",r.setAttribute("role","region"),r.setAttribute("aria-label","Add media controls"),r.setAttribute("aria-hidden","true"),r.setAttribute("hidden","hidden"),r.innerHTML=U.addMediaPanelHtml()),r.parentElement!==e){let D=t.parentElement===e?t.nextSibling:null;e.insertBefore(r,D)}let u=r.querySelector(".btfw-addmedia-tabs"),w=r.querySelector(".btfw-addmedia-views"),g=r.querySelector(".btfw-addmedia-close");if(!u||!w)return null;for(;u.firstChild;)u.removeChild(u.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);a.forEach(({id:D,title:j,el:O})=>{O.classList.remove("collapse","in","plcontrol-collapse"),O.style.removeProperty("display"),O.style.removeProperty("height"),O.removeAttribute("aria-expanded"),O.setAttribute("role","tabpanel"),O.setAttribute("data-btfw-addmedia","panel");let ce=document.createElement("button");ce.type="button",ce.className="btfw-addmedia-tab",ce.dataset.target=D,ce.textContent=j,ce.setAttribute("role","tab"),u.appendChild(ce);let se=document.createElement("div");se.className="btfw-addmedia-view",se.dataset.target=D,se.setAttribute("role","tabpanel"),se.setAttribute("aria-hidden","true"),se.appendChild(O),w.appendChild(se)});let _=a.find(D=>D.default)||a[0],S=D=>{let j=D||r.dataset.active||_.id;r.dataset.active=j,u.querySelectorAll(".btfw-addmedia-tab").forEach(O=>{let ce=O.dataset.target===j;O.classList.toggle("is-active",ce),O.setAttribute("aria-selected",ce?"true":"false"),O.setAttribute("tabindex",ce?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(O=>{let ce=O.dataset.target===j;O.classList.toggle("is-active",ce),O.setAttribute("aria-hidden",ce?"false":"true")})},H=D=>{let j=D!=null?!!D:r.dataset.open!=="true";return r.dataset.open=j?"true":"false",r.classList.toggle("is-open",j),r.setAttribute("aria-hidden",j?"false":"true"),j?(r.removeAttribute("hidden"),S(r.dataset.active||_.id)):r.setAttribute("hidden","hidden"),r.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:j}})),j};return r._btfwWired||(u.addEventListener("click",D=>{let j=D.target.closest(".btfw-addmedia-tab");j&&(D.preventDefault(),S(j.dataset.target))}),g&&g.addEventListener("click",()=>H(!1)),r._btfwWired=!0),S(r.dataset.active||_.id),r._btfwToggle=H,r._btfwSetActive=S,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:j,target:O})=>{let ce=document.getElementById(j);ce&&ce.dataset.btfwAddmedia!==O&&(ce.dataset.btfwAddmedia=O,ce.setAttribute("aria-controls","btfw-addmedia-panel"),ce.addEventListener("click",se=>{se.preventDefault(),se.stopPropagation(),S(O),H(!0),ce.blur()}))})})(),{panel:r,toggle:H,setActive:S}}function we(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),a=document.getElementById("btfw-video-overlay"),r=a&&n&&a.parentElement===n.parentElement?a:n;r&&r.parentElement?r.nextSibling?r.parentNode.insertBefore(t,r.nextSibling):r.parentNode.appendChild(t):e.appendChild(t);let u=document.createElement("div");u.className="btfw-stack-list",t.appendChild(u);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function ye(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let u=t.querySelector(":scope > #motd");return u?{motdwrap:t,motd:u}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let a=[];t.querySelectorAll(".btfw-motd-editrow").forEach(u=>{let w=(u.textContent||"").trim();w&&a.push(`<p>${w}</p>`),u.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(u=>{u.contains(t)||u===t||((u.querySelector("#motd")||u.classList.contains("btfw-motd-editrow"))&&u.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&a.push(w.innerHTML)}),u.remove())});let r=t.querySelector(":scope > #motd");if(r||(r=document.createElement("div"),r.id="motd",t.appendChild(r)),t.querySelectorAll("#motd").forEach(u=>{u!==r&&((u.innerHTML||"").trim()&&a.push(u.innerHTML),u.remove())}),r.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(u=>{u.remove()}),r.querySelectorAll("#motd").forEach(u=>{(u.innerHTML||"").trim()&&a.push(u.innerHTML),u.remove()}),document.querySelectorAll("#togglemotd").forEach((u,w)=>{w!==0&&u.remove()}),a.length){let u=a.join("").trim();u&&de(r.innerHTML)?r.innerHTML=Ne(u):u&&(r.innerHTML+=Ne(u))}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:r}}function m(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),a=document.getElementById("playlistwrap"),r=document.getElementById("queuecontainer"),u=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),g=document.querySelectorAll(".btfw-controls-row"),_=u||a||r||w;if(!_)return;let S=e;S?S.classList.add("btfw-plbar"):(S=document.createElement("div"),S.id="btfw-plbar",S.className="btfw-plbar");let H=S.querySelector(".btfw-plbar__layout"),oe,D;if(H)oe=H.querySelector(".btfw-plbar__primary")||H,D=H.querySelector(".btfw-plbar__aside")||H;else{for(H=document.createElement("div"),H.className="btfw-plbar__layout",oe=document.createElement("div"),oe.className="btfw-plbar__primary",D=document.createElement("div"),D.className="btfw-plbar__aside",H.append(oe,D);S.firstChild;)oe.appendChild(S.firstChild);S.appendChild(H);let ee=oe.querySelector(".field.has-addons");ee&&ee.classList.add("btfw-plbar__search");let me=oe.querySelector("#btfw-pl-count");me&&(me.classList.add("btfw-plbar__count"),D.appendChild(me))}S.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(ee=>ee.remove());let j=S.querySelector(".btfw-plbar__actions");j||(j=document.createElement("div"),j.className="btfw-plbar__actions",(D||S).appendChild(j));let O=document.getElementById("btfw-addmedia-btn"),ce=ee=>{if(ee){if(ee.classList.add("btfw-plbar__action-btn"),ee.tagName==="BUTTON"||ee.tagName==="A")ee.classList.add("button","is-dark","is-small");else if(ee.tagName==="INPUT"){let me=(ee.type||"").toLowerCase();me==="button"||me==="submit"||me==="reset"?ee.classList.add("button","is-dark","is-small"):ee.classList.remove("button","is-dark","is-small")}}};S.parentElement!==_&&_.insertBefore(S,_.firstChild);let se=ke(_,S,j);se?!O||!document.body.contains(O)?(O=document.createElement("button"),O.id="btfw-addmedia-btn",O.type="button",O.className="button is-small",O.innerHTML=U.addMediaButtonHtml(),j.prepend(O)):j.contains(O)||j.prepend(O):O&&(O.parentElement&&O.parentElement.removeChild(O),O=null);let Pe=ee=>{if(!ee)return;Array.from(ee.children||[]).forEach(Ce=>{Ce&&(Ce.classList.add("btfw-plbar__control"),j.appendChild(Ce))})};if(n&&(Pe(n),n.remove()),t&&(Pe(t),t.remove()),j.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(ce),se&&O){O.classList.remove("is-dark"),O.classList.add("is-primary"),O.dataset.iconified||(O.innerHTML=U.addMediaButtonHtml(),O.dataset.iconified="1"),O.setAttribute("aria-controls","btfw-addmedia-panel");let ee=Ce=>{O.setAttribute("aria-expanded",Ce?"true":"false")};O.dataset.btfwBound||(O.dataset.btfwBound="1",O.addEventListener("click",Ce=>{Ce.preventDefault();let rt=document.getElementById("btfw-addmedia-panel"),at=rt&&rt._btfwToggle,xt=typeof at=="function"?at():!1;ee(xt)}));let me=se.panel||document.getElementById("btfw-addmedia-panel");me&&(ee(me.dataset.open==="true"),me._btfwButtonSync||(me.addEventListener("btfw:addmedia:state",Ce=>{ee(!!(Ce.detail&&Ce.detail.open))}),me._btfwButtonSync=!0))}g.forEach(ee=>{ee&&!_.contains(ee)&&(ee.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,ee.remove(),_.appendChild(ee),console.log("[stack] Moved floating controls row into playlist container"))}),_.contains(S)||_.insertBefore(S,_.firstChild),S.dataset.btfwMerged="1"}function P(e,t){if(e.id==="motd-group"&&(ye(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Be(),m(),t=t.filter(g=>g&&g.id!=="rightcontrols"&&g.id!=="pollwrap").filter(g=>!g.querySelector||!g.querySelector("#pollwrap"))),e.id==="poll-group"&&(Be(),Ye(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(g=>g&&!n.contains(g)&&!g.contains(n)));let a=document.createElement("section");a.className="btfw-stack-item btfw-group-item",a.dataset.bind=e.id,a.dataset.group="true";let r=document.createElement("header");r.className="btfw-stack-item__header",r.innerHTML=U.stackGroupHeaderHtml(e.title);let u=document.createElement("div");u.className="btfw-stack-item__body btfw-group-body",t.forEach(g=>{if(g&&g.parentElement!==u&&!u.contains(g)&&!g.contains(u))try{u.appendChild(g)}catch(_){console.warn("[stack] Failed to move element:",g.id||g.className,_)}}),a.appendChild(r),a.appendChild(u);let w=re[e.id];return w&&pt(a,w),Qe(a,e.id),a.querySelector(".btfw-up").onclick=function(){let g=a.parentElement,_=a.previousElementSibling;_&&g.insertBefore(a,_),M(g)},a.querySelector(".btfw-down").onclick=function(){let g=a.parentElement,_=a.nextElementSibling;_?g.insertBefore(_,a):g.appendChild(a),M(g)},a}function M(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(y,JSON.stringify(t))}catch(t){}}function F(){try{return JSON.parse(localStorage.getItem(y)||"[]")}catch(e){return[]}}function ie(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function ne(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function f(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),a=localStorage.getItem(n);return a!==null?a==="true":!1}catch(t){return!1}}function h(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function x(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function N(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Q(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Me()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function d(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Re())}function k(e){d(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function E(e,t,n){if(!e||N(e))return;let a=ie(t),r=typeof n=="function"?n(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(r,{persist:!1}):(e.dataset.open=r?"true":"false",e.classList.toggle("is-open",r))}function Y(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,a=document.getElementById("btfw-stack"),r=document.getElementById("btfw-leftpad"),u=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",n),a.classList.toggle("btfw-stack--all-docked",n)),r&&r.classList.toggle("btfw-leftpad--stack-hidden",n),u&&u.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function Te(){var a;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let r=document.createElement("div");r.id="btfw-panel-bar",r.className="btfw-panel-bar",r.setAttribute("role","toolbar"),r.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(r)}let n=t.querySelector("#btfw-panel-bar");return fe(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),W||(ft(),W=!0),(a=document.getElementById("btfw-stack-drawer"))==null||a.remove(),t}function l(e){e.preventDefault(),e.stopPropagation(),ut()}function c(){let e=Te();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=U.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",l),t.dataset.btfwPanelsWired="1"),t}function T(e){if(!e)return null;let t=Array.from(e.classList).find(a=>a.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let a=n(e).data("uid");if(a!=null&&a!=="")return a}return e.dataset.uid||null}function C(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),a=n==null?void 0:n.querySelector(".qbtn-play");return a?(a.click(),!0):!1}function X(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),a=document.getElementById("queue_next");if(n&&a&&(n.value=t,!a.disabled))return a.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let r=window.socket;if(r&&typeof parseMediaLink=="function")try{let u=parseMediaLink(t);if((u==null?void 0:u.id)!=null&&(u!=null&&u.type))return r.emit("queue",{id:u.id,type:u.type,pos:"next",temp:!1}),!0}catch(u){}return!1}function J(e){we();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(B&&(clearTimeout(B),B=null),I=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),Le(),ze(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function fe(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var u,w,g;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let _=n.dataset.panelGroup||((u=n.closest(".btfw-panel-btn"))==null?void 0:u.dataset.group);_&&J(_);return}let a=t.target.closest(".btfw-panel-playlist__play");if(a){t.preventDefault(),t.stopPropagation(),C(a.dataset.queueUid);return}let r=t.target.closest(".btfw-panel-playlist__add");if(r){t.preventDefault(),t.stopPropagation();let _=(w=r.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!_)return;let S=_.hidden;_.hidden=!S,r.setAttribute("aria-expanded",S?"true":"false"),S&&((g=_.querySelector(".btfw-panel-playlist__link-input"))==null||g.focus())}}),e.addEventListener("submit",t=>{var w,g,_,S;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let a=n.querySelector(".btfw-panel-playlist__link-input"),r=(w=a==null?void 0:a.value)==null?void 0:w.trim();if(!r||!X(r))return;a.value="",n.hidden=!0,(_=(g=n.closest(".btfw-panel-container"))==null?void 0:g.querySelector(".btfw-panel-playlist__add"))==null||_.setAttribute("aria-expanded","false");let u=(S=n.closest(".btfw-panel-container"))==null?void 0:S.querySelector(".btfw-panel-playlist__queue");u&&Fe(u)}))}function Le(){if($){try{$.disconnect()}catch(e){}$=null}Z=null}function Ee(e){if(!e||Z===e)return;Le();let t=document.getElementById("queue");t&&(Z=e,$=new MutationObserver(()=>{e.isConnected&&I==="playlist-group"&&Fe(e)}),$.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Ie(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),a=n.findIndex(u=>u.classList.contains("queue_active")||u.classList.contains("playing")),r=a>=0?a+1:0;return n.slice(r,r+e)}function Fe(e){if(!e)return;let t=Ie(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var _,S;let a=document.createElement("div");a.className="btfw-panel-playlist__item";let r=document.createElement("span");r.className="btfw-panel-playlist__title",r.textContent=(((_=n.querySelector(".qe_title"))==null?void 0:_.textContent)||"Untitled").trim();let u=document.createElement("span");u.className="btfw-panel-playlist__meta",u.textContent=(((S=n.querySelector(".qe_time"))==null?void 0:S.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let g=T(n);if(g!=null&&g!==""){let H=document.createElement("button");H.type="button",H.className="btfw-panel-playlist__play",H.textContent="Play",H.dataset.queueUid=String(g),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(H.disabled=!0),w.appendChild(H)}a.append(r,u,w),e.appendChild(a)})}function je(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=U.panelUndockIconHtml(),n}function lt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=U.playlistAddFormHtml(),e}function ct(e,t,n){let a=document.createElement("div");if(a.className="btfw-panel-container",n>0&&(a.style.bottom=`${-n*50}px`),e==="playlist-group"){a.classList.add("btfw-panel-container--playlist");let u=document.createElement("div");u.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let g=je(e,t);u.append(w,g);let _=lt(),S=document.createElement("div");return S.className="btfw-panel-container__host btfw-panel-playlist__queue",a.append(u,_,S),a}a.classList.add("btfw-panel-container--dock-only");let r=document.createElement("div");return r.className="btfw-panel-container__dock-only",r.appendChild(je(e,t)),a.appendChild(r),a}function He(){B&&(clearTimeout(B),B=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{k(e)}),Le(),I=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function $e(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||He()}function dt(){$e(!1)}function ut(){Te();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||$e(!e.classList.contains("open"))}function Ke(e){B&&clearTimeout(B),B=setTimeout(()=>{B=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),I===e&&(I=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function De(e,t){if(t&&(B&&(clearTimeout(B),B=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),I=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(Fe(n),Ee(n))}}function ft(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{I&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),He()))}))}function Xe(e,t){var a;if(!((a=document.getElementById("btfw-panel-bar"))!=null&&a.classList.contains("open")))return;if(B&&(clearTimeout(B),B=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),I===e&&(I=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(r=>{r!==t&&delete r.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",De(e,t)}function mt(e,t){let n=e.querySelector(".btfw-panel-container"),a=()=>{var r;(r=document.getElementById("btfw-panel-bar"))!=null&&r.classList.contains("open")&&(B&&(clearTimeout(B),B=null),De(t,e))};e.addEventListener("mouseenter",a),e.addEventListener("focusin",a),e.addEventListener("click",r=>{r.target.closest(".btfw-panel-container")||(r.preventDefault(),r.stopPropagation(),Xe(t,e))}),e.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),Xe(t,e))}),e.addEventListener("mouseleave",r=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(r.relatedTarget)||Ke(t))}),n==null||n.addEventListener("mouseenter",()=>{B&&(clearTimeout(B),B=null)}),n==null||n.addEventListener("mouseleave",r=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(r.relatedTarget)||Ke(t))})}function We(){let e=Te();c();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((g,_)=>(R[g.dataset.bind]||99)-(R[_.dataset.bind]||99)),a=n.map(g=>g.dataset.bind).join("|"),r=document.getElementById("btfw-panels-menu-btn");if(r&&(r.hidden=n.length===0,n.length===0)){V="",dt();return}if(a===V&&t.childElementCount===n.length)return;V=a;let u=t.classList.contains("open"),w=I;if(He(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((g,_)=>{let S=g.dataset.bind,H=s[S]||{short:"?",title:S},oe=document.createElement("div");oe.className="btfw-panel-btn",oe.dataset.group=S,oe.title=H.title,oe.setAttribute("role","button"),oe.setAttribute("aria-label",H.title),oe.tabIndex=0;let D=document.createElement("span");D.className="btfw-panel-btn__label",D.textContent=v[S]||H.short,oe.appendChild(D),oe.appendChild(ct(S,H,_)),t.appendChild(oe),mt(oe,S)}),u&&($e(!0),w&&n.some(_=>_.dataset.bind===w))){let _=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);_&&De(w,_)}}function ze(e,t,n={}){if(!e)return;let a=!!t,r=n.persist===!1,u=e.dataset.bind,w=i[u];e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let g=e.querySelector(".btfw-stack-dock-btn");g&&(g.setAttribute("aria-pressed",a?"true":"false"),g.title=a?"Pinned to panels menu":"Dock to panels menu"),a?N(e)?k(e):I===u&&(I=null):(k(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!r&&w&&h(w,a),We(),Y()}function Qe(e,t){var _;let n=i[t];if(!n)return;let a=e.querySelector(".btfw-stack-item__header"),r=a==null?void 0:a.querySelector(".btfw-stack-header-toolbar"),u=r==null?void 0:r.querySelector(".btfw-stack-arrows");if(!u||u.querySelector(".btfw-stack-dock-btn"))return;let w=f(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let g=document.createElement("button");g.type="button",g.className="btfw-arrow btfw-stack-dock-btn",g.textContent="\u2AF7",g.setAttribute("aria-label",`Dock ${((_=s[t])==null?void 0:_.title)||t} to panels menu`),g.setAttribute("aria-pressed",w?"true":"false"),g.title=w?"Pinned to panels menu":"Dock to panels menu",g.addEventListener("click",S=>{S.preventDefault(),S.stopPropagation(),e.dataset.docked!=="true"&&ze(e,!0)}),u.insertBefore(g,u.firstChild)}function qt(){return ie(p)}function Ft(e){ne(p,e)}function Ht(){return ie(o)}function $t(e){ne(o,e)}function pt(e,t={}){let{storageKey:n,getDefaultOpen:a,toggleClass:r,ariaLabel:u="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:g="Show panel"}=t,_=ie(n),S=typeof a=="function"?a(_):_!==null?_:!0;e.hasAttribute("data-open")||(e.dataset.open=S?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let H=e.querySelector(".btfw-stack-item__header"),oe=H&&H.querySelector(".btfw-stack-arrows");if(!oe||oe.querySelector(`.${r}`))return;let D=document.createElement("button");D.type="button",D.className=`btfw-arrow ${r}`,D.setAttribute("aria-label",u),D.style.display="flex",D.style.alignItems="center",D.style.justifyContent="center";let j=()=>{let se=e.dataset.open!=="false";D.textContent=se?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",D.title=se?w:g,D.setAttribute("aria-expanded",se?"true":"false"),e.classList.toggle("is-open",se)},O=(se,Pe={})=>{let ee=!!se,me=Pe.persist===!1;me&&(e._btfwSuppressPersist=!0),e.dataset.open=ee?"true":"false",j(),me||ne(n,ee),me&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};D.addEventListener("click",se=>{se.preventDefault(),se.stopPropagation(),O(e.dataset.open==="false")}),j(),new MutationObserver(se=>{for(let Pe of se)Pe.type==="attributes"&&(j(),e._btfwSuppressPersist||ne(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),oe.insertBefore(D,oe.firstChild),e._btfwSetOpenState=O,Qe(e,e.dataset.bind)}function Be(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function Ue(e){ye();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(a){let r=a.querySelector(".btfw-group-body");r&&!r.contains(t)&&r.appendChild(t)}else{let r=he.find(u=>u.id==="motd-group");if(!r)return;a=P(r,[t]),a&&(n.appendChild(a),M(n))}bt(a)}function bt(e){let t=document.getElementById("motdwrap");if(!t)return;let n=be();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let a=ue();a&&a.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let a=ie(G),r=Ae(a,!0);e._btfwSetOpenState?e._btfwSetOpenState(r,{persist:!1}):(e.dataset.open=r?"true":"false",e.classList.toggle("is-open",r))}}function Ge(e){te&&clearTimeout(te),te=setTimeout(()=>{te=null,Ue(e)},50)}function ht(e){let t=ue();t&&(K||(K=!0,new MutationObserver(()=>{Ge(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function yt(e){ge||!window.socket||!window.socket.on||(ge=!0,window.socket.on("setMotd",t=>{let n=typeof t=="string"?t:t&&typeof t.motd=="string"?t.motd:null,a=ue();if(a){let r=n!==null?n:a.innerHTML,u=Ne(r);a.innerHTML!==u&&(a.innerHTML=u)}Ge(e)}))}function Ze(e){let t=we(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let a=ye(!0),r=(a==null?void 0:a.motd)||ue();r&&typeof e=="string"&&(r.innerHTML=Ne(e));let u=document.getElementById("cs-motdtext");u&&typeof e=="string"&&(u.value=e),t&&Ge(t)}function Ve(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,a=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||a==="video")return;Be(),Ye();let r=e&&e.list;if(!r)return;let u=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!u){let _=he.find(S=>S.id==="poll-group");if(!_)return;u=P(_,[t]),u&&(r.appendChild(u),M(r));return}let w=u.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&g.contains(t)&&w&&w.appendChild(t)}function Je(e,t={}){Ve(e),Re();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Oe(e,t={}){z&&clearTimeout(z),z=setTimeout(()=>{z=null,Je(e,t)},50)}function gt(e){if(q)return;let t=document.getElementById("pollwrap");if(!t)return;q=!0,new MutationObserver(()=>{Oe(e,{forceOpen:Me()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let a=document.getElementById("newpollbtn");a&&!a.dataset.btfwPollSync&&(a.dataset.btfwPollSync="1",a.addEventListener("click",()=>{Oe(e,{forceOpen:!0})}))}function wt(e){ae||!window.socket||!window.socket.on||(ae=!0,window.socket.on("newPoll",()=>Oe(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Oe(e)))}function vt(e){return!!e.closest('.modal, [role="dialog"]')}function et(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(a=>!vt(a));n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function tt(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let a=n.querySelector(".btfw-stack-header-actions");if(!a){a=document.createElement("span"),a.className="btfw-stack-header-actions";let r=n.querySelector(".btfw-stack-header-toolbar"),u=(r==null?void 0:r.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");r&&u?r.insertBefore(a,u):u?n.insertBefore(a,u):n.appendChild(a)}return a}function nt(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Re(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Me();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function ot(){let e=tt("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){nt(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let r=document.querySelector("#pollwrap > .poll-controls");r&&r.children.length===0&&r.remove()}let n=tt("motd-group"),a=document.getElementById("btfw-motd-editbtn");if(n&&a){nt(a,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),a.parentElement!==n&&n.appendChild(a);let r=a.closest(".btfw-motd-editrow");r&&r.parentElement&&r.remove()}}function Ye(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(a=>{let r=t.querySelector(".poll-controls");r||(r=document.createElement("div"),r.className="poll-controls",t.insertBefore(r,t.firstChild)),a.parentElement!==r&&r.appendChild(a)}),e.children.length===0&&e.remove())}function Et(e){return he.every(t=>t.selectors.some(a=>{var u,w;if(Se.includes(a))return!1;let r=document.querySelector(a);if(!r||e.contains(r)||r.contains(e))return!1;if(a==="#pollwrap"){let g=(u=r.dataset)==null?void 0:u.btfwPollOverlay,_=(w=r.getAttribute)==null?void 0:w.call(r,"data-btfw-poll-overlay");if(g==="video"||_==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function qe(e){if(!le){le=!0;try{let t=e.list,n=e.footer;if(Et(t)&&t.children.length>0){Ue(e),Ve(e),Re(),ot(),et(n);return}Ye(),Be();let a=new Map;he.forEach(w=>{let g=[];w.selectors.forEach(_=>{let S=document.querySelector(_);if(S&&!(t.contains(S)||S.contains(t))&&!Se.includes(_)){if(_==="#pollwrap"){let H=S.dataset&&S.dataset.btfwPollOverlay,oe=S.getAttribute&&S.getAttribute("data-btfw-poll-overlay");if(H==="video"||oe==="video")return}g.push(S)}}),g.length>0&&a.set(w.id,{group:w,elements:g})});let r=F(),u=[];a.forEach(({group:w,elements:g},_)=>{if(!Array.from(t.children).find(H=>H.dataset.bind===_))try{let H=P(w,g);H&&u.push({item:H,id:_,priority:w.priority,isGroup:!0})}catch(H){console.warn("[stack] Failed to create group item:",_,H)}}),r.length>0?u.sort((w,g)=>{let _=r.findIndex(H=>H.id===w.id),S=r.findIndex(H=>H.id===g.id);return _>=0&&S>=0?_-S:_>=0?-1:S>=0?1:w.priority-g.priority}):u.sort((w,g)=>w.priority-g.priority),u.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(g){console.warn("[stack] Failed to add item to list:",g)}}),M(t),Ue(e),Ve(e),Re(),ot(),et(n)}finally{le=!1}}}function it(){let e=we();if(!e||(qe(e),ht(e),yt(e),gt(e),wt(e),_e))return;_e=!0;let t=new MutationObserver(()=>{pe||(pe=requestAnimationFrame(()=>{pe=null,qe(e)}))}),n=document.getElementById("btfw-leftpad"),a=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),a&&t.observe(a,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&E(w,G,S=>Ae(S,be()));let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&E(g,p,S=>S!==null?!!S:!0);let _=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');_&&E(_,o,S=>Ae(S,Me())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(S=>{let H=i[S.dataset.bind];H&&ze(S,f(H),{persist:!1})}),Te(),c(),We(),Je(e),Y()},1e3);let r=0,u=setInterval(()=>{qe(e),++r>2&&clearInterval(u)},700)}return document.addEventListener("btfw:layoutReady",it),document.addEventListener("btfw:chat:barsReady",()=>{Te(),c(),We()}),setTimeout(it,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=we();e&&setTimeout(()=>qe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Ze(t)}),{name:"feature:stack",hasMotdContent:be,resolveMotdHost:ue,normalizeMotdStructure:ye,applyMotdUpdate:Ze}});BTFW.define("feature:videoOverlay",[],async()=>{let L=(l,c=document)=>c.querySelector(l),A=["#mediarefresh","#voteskip","#fullscreenbtn"],U={localSubs:"btfw:video:localsubs"},y=5,G={owner:["chanowner","owner","founder","admin","administrator"]};function p(){var l;try{return((l=window.PLAYER)==null?void 0:l.mediaType)||null}catch(c){return null}}function o(){let l=(p()||"").toLowerCase();return l==="fi"||l==="gd"}function i(){try{return window.CLIENT||window.client||null}catch(l){return null}}function b(){try{return window.CHANNEL||window.channel||null}catch(l){return null}}function s(){let l=b();if(l&&typeof l.perms=="object"&&l.perms)return l.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(c){return{}}}function v(l=[]){let c=s();for(let T of l){let C=c==null?void 0:c[T];if(typeof C=="number")return C}}function R(){let l=v(G.owner);return typeof l=="number"?l:y}function W(l){if(!l)return!1;try{if(typeof l.hasPermission=="function"&&l.hasPermission("chanowner"))return!0}catch(c){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(c){}return!1}function I(){let l=i();if(!l)return!1;let c=Number(l.rank);return Number.isFinite(c)?!!(c>=R()||W(l)):!1}let V=()=>{try{return localStorage.getItem(U.localSubs)!=="0"}catch(l){return!0}},B=l=>{try{localStorage.setItem(U.localSubs,l?"1":"0")}catch(c){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!l}}))},$=0,Z=0,re=0,z=2e3,q=8e3,ae=45e3,te=12e4,K=q,ge=!1,le=null;function pe(){if(L("#btfw-vo-css"))return;let l=document.createElement("style");l.id="btfw-vo-css",l.textContent=`
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
    `,document.head.appendChild(l)}function _e(l){let c=L("#videowrap");!c||!l||((l.parentElement!==c.parentElement||l.previousElementSibling!==c)&&c.insertAdjacentElement("afterend",l),l.classList.add("btfw-vo-visible"))}function de(){if(!L("#videowrap"))return null;let c=L("#btfw-video-overlay");c||(c=document.createElement("div"),c.id="btfw-video-overlay",c.setAttribute("data-testid","btfw-video-overlay")),c.classList.add("btfw-video-overlay"),c.getAttribute("data-testid")||c.setAttribute("data-testid","btfw-video-overlay"),_e(c);let T=c.querySelector("#btfw-vo-bar");T||(T=document.createElement("div"),T.className="btfw-vo-bar",T.id="btfw-vo-bar",c.appendChild(T));let C=ue(c,T);return Y(C.left),m(C),P(C),be(c),c}function be(l){l&&l.querySelectorAll("button").forEach(c=>{c.classList.contains("btfw-vo-btn")||c.classList.add("btfw-vo-btn")})}function ue(l,c){let T="btfw-vo-left",C="btfw-vo-right",X=c.querySelector(`#${T}`);X||(X=document.createElement("div"),X.id=T,X.className="btfw-vo-section btfw-vo-section--left",c.insertBefore(X,c.firstChild));let J=c.querySelector(`#${C}`);return J||(J=document.createElement("div"),J.id=C,J.className="btfw-vo-section btfw-vo-section--right",c.appendChild(J)),Array.from(c.children).forEach(fe=>{fe===X||fe===J||J.appendChild(fe)}),l.dataset.leftSection=`#${T}`,l.dataset.rightSection=`#${C}`,c.dataset.leftSection=`#${T}`,c.dataset.rightSection=`#${C}`,{left:X,right:J}}function he(){return document.querySelector("#ytapiplayer video, video")}function Se(l=he()){return l?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof l.webkitShowPlaybackTargetPicker=="function":!1}function ve(){if(!le)return;let l=le._btfwAirplayHandler;if(l){try{le.removeEventListener("webkitplaybacktargetavailabilitychanged",l)}catch(c){}delete le._btfwAirplayHandler}le=null}function ke(l){if(!l||typeof l.addEventListener!="function"){ve();return}if(le===l)return;ve();let c=T=>{let C=!T||T.availability==="available",X=L("#btfw-airplay");X&&(X.style.display=C?"":"none")};try{l.addEventListener("webkitplaybacktargetavailabilitychanged",c),l._btfwAirplayHandler=c,le=l}catch(T){}}function we(){let l=L("#btfw-airplay");if(!l)return;let c=he();if(!Se(c)){l.style.display="none",ve();return}l.style.display="",ke(c)}function ye(l,c){c&&c.classList.add("btfw-vo-visible")}function m(l){if(!(l!=null&&l.right)||!(l!=null&&l.left))return;let c=[];document.querySelector("#fullscreenbtn")||c.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:ie,section:"right"}),c.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:h,section:"right"}),c.forEach(T=>{let C=document.querySelector(`#${T.id}`),X=T.section==="left"?l.left:l.right;if(C)X&&C.parentElement!==X&&X.appendChild(C);else{C=document.createElement("button"),C.id=T.id,C.className="btfw-vo-btn";let J=document.createElement("i");J.className=T.icon,C.appendChild(J),C.title=T.tooltip,C.addEventListener("click",T.action),(X||l.right).appendChild(C)}}),we()}function P(l){let c=l==null?void 0:l.right;c&&A.forEach(T=>{let C=document.querySelector(T);if(!C)return;if(C.dataset.btfwOverlay==="1"){C.parentElement!==c&&c.appendChild(C);return}let X=document.createElement("span");X.hidden=!0,X.setAttribute("data-btfw-ph",T);try{C.insertAdjacentElement("afterend",X)}catch(J){}if(C.classList.add("btfw-vo-adopted"),C.dataset.btfwOverlay="1",C.id==="mediarefresh"){let J=C.onclick;C.onclick=fe=>{fe.preventDefault();let Le=!!(fe&&fe.isTrusted);F(()=>{if(typeof J=="function")try{return J.call(C,fe),!0}catch(Ee){console.warn("[video-overlay] native refresh handler failed:",Ee)}return!1},{isUserAction:Le})}}c.appendChild(C)})}function M(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(l){console.warn("[video-overlay] Media refresh failed:",l)}return!1}function F(l,c={}){let{isUserAction:T=!1}=c,C=Date.now();if(re&&C-re>te&&(K=q,$=0),C<Z){let Ee=Math.ceil((Z-C)/1e3);return x(T?`Refresh available in ${Ee}s`:`Auto refresh paused. Next attempt in ${Ee}s`,"warning"),!1}let X=T?z:K;if(re&&C-re<X){let Ee=X-(C-re),Ie=Math.ceil(Ee/1e3);return Z=C+Ee,x(T?`Refresh available in ${Ie}s`:`Auto refresh paused. Next attempt in ${Ie}s`,"warning"),!1}if($++,$>=10)return Z=C+3e4,$=0,x("Refresh limit reached. 30s cooldown active.","error"),!1;let J=T?6e3:Math.max(12e3,K+2e3);setTimeout(()=>{$>0&&$--},J);let fe=!1;if(typeof l=="function")try{fe=l()===!0}catch(Ee){console.warn("[video-overlay] Refresh handler error:",Ee)}return fe||(fe=M()),re=Date.now(),T?K=q:K=Math.min(ae,Math.max(q,Math.round(K*(fe?1.25:1.5)))),Z=Math.max(Z,re+(T?z:K)),!T&&fe?x(`Auto refresh sent. Next attempt in ${Math.ceil(K/1e3)}s`,"info"):x(fe?"Media refreshed":"Unable to refresh media",fe?"success":"error"),fe}function ie(){let l=L("#videowrap");l&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():l.requestFullscreen?l.requestFullscreen():l.webkitRequestFullscreen?l.webkitRequestFullscreen():l.mozRequestFullScreen&&l.mozRequestFullScreen())}function ne(l,c=!0){if(!l||!Se(l))return!1;if(l.setAttribute("airplay","allow"),l.setAttribute("x-webkit-airplay","allow"),c&&typeof l.webkitShowPlaybackTargetPicker=="function")try{l.webkitShowPlaybackTargetPicker()}catch(T){console.warn("[video-overlay] AirPlay picker failed:",T)}return we(),!0}function f(){if(!(ge||!window.socket)){ge=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let l=he();l&&(ne(l,!1),ke(l)),we()},1e3)})}catch(l){console.warn("[video-overlay] Failed to attach AirPlay listener:",l)}}}function h(){let l=he();return Se(l)?ne(l)?(x("AirPlay enabled","success"),f(),!0):(x("AirPlay not available","warning"),!1):(we(),x("AirPlay not available","warning"),!1)}function x(l,c="info"){let T=document.getElementById("btfw-notification");T||(T=document.createElement("div"),T.id="btfw-notification",T.className="btfw-notification",document.body.appendChild(T)),T.textContent=l,T.className=`btfw-notification btfw-notification--${c} btfw-notification--show`,clearTimeout(T._hideTimer),T._hideTimer=setTimeout(()=>{T.classList.remove("btfw-notification--show")},3e3)}function N(){return L("video")}function Q(l){let c=(l||"").replace(/\r\n/g,`
`).trim()+`
`;return c=c.replace(/^\d+\s*$\n/gm,""),c=c.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),c=c.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+c}async function d(){let l=N();if(!l){E("Local subs only for HTML5 sources.");return}let c=document.createElement("input");c.type="file",c.accept=".vtt,.srt,text/vtt,text/plain",c.style.display="none",document.body.appendChild(c);let T=new Promise(C=>{c.addEventListener("change",async()=>{let X=c.files&&c.files[0];if(document.body.removeChild(c),!X)return C(!1);try{let J=await X.text(),Le=(X.name.split(".").pop()||"").toLowerCase()==="srt"?Q(J):J.startsWith("WEBVTT")?J:`WEBVTT

`+J,Ee=URL.createObjectURL(new Blob([Le],{type:"text/vtt"}));k(l,Ee,X.name.replace(/\.[^.]+$/,"")||"Local"),E("Subtitles loaded."),C(!0)}catch(J){console.error(J),E("Failed to load subtitles."),C(!1)}},{once:!0})});c.click(),await T}function k(l,c,T){var X;(X=L('track[data-btfw="1"]',l))==null||X.remove();let C=document.createElement("track");C.kind="subtitles",C.label=T||"Local",C.srclang="en",C.src=c,C.default=!0,C.setAttribute("data-btfw","1"),l.appendChild(C);try{for(let J of l.textTracks)J.mode=J.label===C.label?"showing":"disabled"}catch(J){}}function E(l){let c=L("#btfw-mini-toast");c||(c=document.createElement("div"),c.id="btfw-mini-toast",document.body.appendChild(c)),c.textContent=l,c.style.opacity="1",clearTimeout(c._hid),c._hid=setTimeout(()=>c.style.opacity="0",1400)}function Y(l){if(!l)return;let c=document.querySelector("#btfw-vo-subs");if(!c){c=document.createElement("button"),c.id="btfw-vo-subs",c.className="btfw-vo-btn",c.title="Load local subtitles (.vtt/.srt)";let C=document.createElement("i");C.className="fa fa-closed-captioning",c.appendChild(C),c.addEventListener("click",X=>{X.preventDefault(),d()}),l.insertBefore(c,l.firstChild||null)}let T=V()&&o();c.style.display=T?"":"none"}function Te(){pe(),de();let l=[L("#videowrap"),L("#rightcontrols"),L("#leftcontrols"),document.body].filter(Boolean),c=new MutationObserver(()=>de());l.forEach(T=>c.observe(T,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>de());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>de(),0)})}catch(T){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te(),{name:"feature:videoOverlay",setLocalSubsEnabled:B,toggleFullscreen:ie,enableAirplay:h}});(function(){"use strict";let y="https://vidprox.movies-storage-a.workers.dev/?url=";function G(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function p(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var i,b,s;let o=typeof window!="undefined"&&(((i=window.BTFW_CONFIG)==null?void 0:i.corsVideoProxy)||((s=(b=window.BTFW_CONFIG)==null?void 0:b.integrations)==null?void 0:s.corsVideoProxy));if(typeof o=="string"&&o.trim()){let v=o.trim();if(v.includes("?"))return v;let R=v.endsWith("/")?"":"/";return`${v}${R}?url=`}return y},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(o){try{return new URL(y).origin.toLowerCase()}catch(i){return""}}},_isTrusted(o){if(!o)return!1;if(String(o).includes(this.CORS_PROXY))return!0;try{let i=new URL(o),b=i.origin.toLowerCase(),s=this._getCorsProxyOrigin();return s&&b===s?!0:/^vidprox\./i.test(i.hostname)}catch(i){return!1}},_unwrapProxiedUrl(o){if(!o||!this._isTrusted(o))return o;try{return new URL(o).searchParams.get("url")||o}catch(i){return o}},_markInternalSrcSet(){this._lastInternalSrcSetAt=p()},_isInsideInternalWindow(){return p()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let o=this._getMediaElement();return o?o.crossOrigin==="anonymous"||o.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var i,b,s,v;if(this._hasAnonymousCrossOrigin())return!1;let o=((b=(i=this.player)==null?void 0:i.currentSrc)==null?void 0:b.call(i))||((s=this._getMediaElement())==null?void 0:s.currentSrc)||"";if(o&&!this._isTrusted(o))return!1;try{return(v=this.player)==null||v.crossOrigin("anonymous"),!0}catch(R){return!1}},_clearMediaElementForCorsSwap(){let o=this._getMediaElement();if(o)try{for(o.removeAttribute("src"),o.removeAttribute("crossorigin");o.firstChild;)o.removeChild(o.firstChild);o.load()}catch(i){}},_same(o,i){return String(o||"")===String(i||"")},_getMediaElement(){var b;let o=(b=this.player)==null?void 0:b.tech_;if(o){try{let s=typeof o.el=="function"?o.el():null;if(s instanceof HTMLMediaElement&&s.isConnected)return s}catch(s){}if(o.el_ instanceof HTMLMediaElement&&o.el_.isConnected)return o.el_}let i=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return i instanceof HTMLMediaElement&&i.isConnected?i:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(o){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(o){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(o){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(o){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(o){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(o){}this.mergerNode=null}},resetMediaBinding(){var i,b;this.disconnectChain();let o=this._getMediaElement();if(o&&this._syncFromRegistry(o)){((i=this.audioContext)==null?void 0:i.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(o){var W;let i=(W=this.player)==null?void 0:W.tech_;if(!(i!=null&&i.el_)||i.el_!==o)return null;let b=o.parentNode;if(!b)return null;let s=o.tagName.toLowerCase()==="audio"?"audio":"video",v=document.createElement(s);v.className=o.className,o.id&&(v.id=o.id),v.setAttribute("playsinline",""),v.setAttribute("webkit-playsinline",""),v.classList.contains("vjs-tech")||v.classList.add("vjs-tech");let R=o.crossOrigin||o.getAttribute("crossorigin");return R&&(v.crossOrigin=R,v.setAttribute("crossorigin",R)),b.replaceChild(v,o),i.el_=v,delete o.__btfwSourceNode,v},_syncFromRegistry(o){let i=G().get(o)||o.__btfwSourceNode||null;return i?(G().set(o,i),this.sourceNode=i,this._sourceMediaElement=o,i.context&&i.context.state!=="closed"&&(this.audioContext=i.context),i):null},_getOrCreateSourceNode(o){var v;let i=G(),b=i.get(o)||o.__btfwSourceNode||null;if(b)return i.set(o,b),this.sourceNode=b,this._sourceMediaElement=o,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b;if(this.sourceNode&&this._sourceMediaElement===o)return i.set(o,this.sourceNode),o.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let s;try{s=this.audioContext.createMediaElementSource(o)}catch(R){if((R==null?void 0:R.name)!=="InvalidStateError")throw R;let W=this._syncFromRegistry(o);if(W)return W;let I=this._swapVideoTechElement(o);if(!I)throw R;let V=(v=this.player)==null?void 0:v.currentSrc();if(V&&this.player){this._markInternalSrcSet(),this.player.src({src:V,type:"video/mp4"});try{this.player.load()}catch(B){}}return this._getOrCreateSourceNode(I)}return i.set(o,s),o.__btfwSourceNode=s,this.sourceNode=s,this._sourceMediaElement=o,s},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(o){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(o){return!1}},_clearCrossOriginAttribute(){var i,b;let o=this._getMediaElement();if(o)try{o.crossOrigin=null,o.removeAttribute("crossorigin")}catch(s){}try{(b=(i=this.player)==null?void 0:i.crossOrigin)==null||b.call(i,null)}catch(s){}},cleanup(){this.disconnectChain();let o=this._getMediaElement();o&&(o.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){var i,b;this.cleanup();let o=((b=(i=this.player)==null?void 0:i.currentSrc)==null?void 0:b.call(i))||"";return this.sourceNode&&o&&!this._isTrusted(o)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(o,{currentTime:i=0,wasPlaying:b=!1,clearCrossOrigin:s=!1}={}){if(!this.player||!o)return Promise.resolve(!1);try{this.player.pause()}catch(v){}s&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(v){}return new Promise(v=>{let R=!1,W=()=>{if(R)return;R=!0;try{this.player.off("canplay",I)}catch(B){}try{this.player.off("loadeddata",I)}catch(B){}try{this.player.currentTime(i)}catch(B){}let V=b?this.player.play():Promise.resolve();Promise.resolve(V).catch(()=>{}).finally(()=>v(!0))},I=()=>W();try{this.player.one("canplay",I)}catch(V){try{this.player.on("canplay",I)}catch(B){}}try{this.player.one("loadeddata",I)}catch(V){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&W()}catch(V){}}),setTimeout(W,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let i=new MutationObserver(()=>{this._checkAndReapply("sources")});i.observe(o,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=i}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([i,b])=>{this.player.on(i,b)})}catch(i){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this.player.currentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;if(this._stopWatchdogInterval(),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(i){}try{(o=this._mutationObserver._sourceObserver)==null||o.disconnect()}catch(i){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([i,b])=>{this.player.off(i,b)})}catch(i){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(o){if(!this.player)return;let i=this.player.currentSrc();if(i&&(this._lastKnownSrc=i,!this._isInsideInternalWindow())){if(this._isTrusted(i)){this.isProxied=!0,this.proxiedSrc=i,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(i)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(p()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=p(),this._forceProxyPreservingState(i)}}},async _forceProxyPreservingState(o){if(!this.player)return!1;let i=this.player.currentTime(),b=!this.player.paused();if(this._isTrusted(o))return this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(o)||o,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(s){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(s){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(s){}return new Promise(s=>{let v=!1,R=()=>{if(!v){v=!0;try{this.player.off("canplay",W)}catch(I){}try{this.player.off("loadeddata",W)}catch(I){}try{this.player.currentTime(i)}catch(I){}this.isProxied=!0,b&&this.player.play().catch(()=>{}),s(!0)}},W=()=>R();try{this.player.one("canplay",W)}catch(I){try{this.player.on("canplay",W)}catch(V){}}try{this.player.one("loadeddata",W)}catch(I){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&R()}catch(I){}}),setTimeout(R,5e3)})},async ensureProxy(){if(!this.player)return!1;let o=this.player.currentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let i=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(s){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(s){}return new Promise(s=>{this.player.ready(()=>{try{this.player.currentTime(i)}catch(v){}b&&this.player.play().catch(()=>{}),s(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var i;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let b=this.player.currentSrc();if(this._isTrusted(b))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this.player.currentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let o=this._getMediaElement();if(!o)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((i=this.audioContext)==null?void 0:i.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),o.disableRemotePlayback=!0;let s=this._getOrCreateSourceNode(o);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let v=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(v.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(v.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(v.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(v.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(v.release,this.audioContext.currentTime),s.connect(this.compressorNode),s=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),s.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),s=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,s.connect(this.gainNode),s=this.gainNode),s.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(b){return console.error("[BTFW_AUDIO] Error building audio chain:",b),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(o){return this.NORM_PRESETS[o]?(this.currentNormPreset=o,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(o){return this.BOOST_MULTIPLIER=o,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()}}})();(function(){"use strict";let L=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),A=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),U="--btfw-boost-anchor",y="--btfw-norm-anchor";function G(o,i,b){if(A&&b){i.style.setProperty("anchor-name",b),o.style.setProperty("position-anchor",b),o.style.setProperty("top","anchor(bottom)"),o.style.setProperty("left","anchor(left)");return}let s=i.getBoundingClientRect();o.style.left=s.left+"px",o.style.top=s.bottom+"px"}function p(o){window.BTFW&&typeof BTFW.define=="function"?o():setTimeout(()=>p(o),0)}p(function(){BTFW.define("feature:audio",[],async()=>{let o=(d,k=document)=>k.querySelector(d),i=window.BTFW_AUDIO,b=null,s=null,v=null,R=!1,W=!1,I=!1,V=null,B=null,$=null,Z=null,re=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function z(d){b&&(d?(b.classList.add("active"),b.style.background="rgba(46, 213, 115, 0.3)",b.style.borderColor="#2ed573",b.style.color="#2ed573",b.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(b.classList.remove("active"),b.style.background="",b.style.borderColor="",b.style.color="",b.style.boxShadow=""))}function q(d,k="info"){let E=o("#btfw-audioboost-toast");E||(E=document.createElement("div"),E.id="btfw-audioboost-toast",E.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${k==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(E)),E.textContent=d,E.style.background=k==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",E.style.opacity="1",setTimeout(()=>{E.style.opacity="0"},2e3)}async function ae(){if(await i.enableBoost()){R=!0;let k=Math.round(i.BOOST_MULTIPLIER*100);q(`Boosted by ${k}%`,"success"),z(!0)}else{let k=i._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";q(k,"error")}}async function te(){await i.disableBoost(),R=!1,z(!1)}function K(d){s&&(d?(s.classList.add("active"),s.style.background="rgba(52, 152, 219, 0.3)",s.style.borderColor="#3498db",s.style.color="#3498db",s.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(s.classList.remove("active"),s.style.background="",s.style.borderColor="",s.style.color="",s.style.boxShadow=""))}function ge(d,k="info"){let E=o("#btfw-audionorm-toast");E||(E=document.createElement("div"),E.id="btfw-audionorm-toast",E.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${k==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(E)),E.textContent=d,E.style.background=k==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",E.style.opacity="1",setTimeout(()=>{E.style.opacity="0"},2e3)}async function le(){if(await i.enableNormalization())W=!0,ge("Normalization enabled","success"),K(!0);else{let k=i._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";ge(k,"error")}}async function pe(){await i.disableNormalization(),W=!1,K(!1)}function _e(d){v&&(d?(v.classList.add("active"),v.style.background="rgba(155, 89, 182, 0.3)",v.style.borderColor="#9b59b6",v.style.color="#9b59b6",v.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(v.classList.remove("active"),v.style.background="",v.style.borderColor="",v.style.color="",v.style.boxShadow=""))}function de(d,k="info"){let E=o("#btfw-mono-toast");E||(E=document.createElement("div"),E.id="btfw-mono-toast",E.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${k==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(E)),E.textContent=d,E.style.background=k==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",E.style.opacity="1",setTimeout(()=>{E.style.opacity="0"},2e3)}async function be(){if(await i.enableMono())I=!0,de("Stereo audio enabled","success"),_e(!0);else{let k=i._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";de(k,"error")}}async function ue(){await i.disableMono(),I=!1,_e(!1)}function he(){let d=document.createElement("button");d.id="btfw-vo-audioboost",d.className="btn btn-sm btn-default btfw-vo-adopted";let k=Math.round(i.BOOST_MULTIPLIER*100);d.title=`Toggle Audio Boost (${k}%)`,d.setAttribute("data-btfw-overlay","1");let E=document.createElement("i");return E.className="fa-solid fa-megaphone",d.appendChild(E),d.addEventListener("click",()=>{i.boostEnabled?te():ae()}),d.addEventListener("mouseenter",()=>{$&&(clearTimeout($),$=null),we()}),d.addEventListener("mouseleave",()=>{$=setTimeout(()=>ye(),150)}),d}function Se(){let d=document.createElement("button");d.id="btfw-vo-audionorm",d.className="btn btn-sm btn-default btfw-vo-adopted";let k=i.NORM_PRESETS[i.currentNormPreset].label;d.title=`Toggle Audio Normalization (${k})`,d.setAttribute("data-btfw-overlay","1");let E=document.createElement("i");return E.className="fa-solid fa-waveform-lines",d.appendChild(E),d.addEventListener("click",()=>{i.normalizationEnabled?pe():le()}),d.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null),M()}),d.addEventListener("mouseleave",()=>{Z=setTimeout(()=>F(),150)}),d}function ve(){let d=document.createElement("button");d.id="btfw-vo-mono",d.className="btn btn-sm btn-default btfw-vo-adopted",d.title="Toggle Mono Audio (mix both channels to stereo)",d.setAttribute("data-btfw-overlay","1");let k=document.createElement("i");return k.className="fa-solid fa-headphones",d.appendChild(k),d.addEventListener("click",()=>{i.monoEnabled?ue():be()}),d}function ke(){if(V)return V;let d=document.createElement("div");return d.id="btfw-boost-context-menu",L&&(d.popover="auto"),d.style.cssText=`
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
          ${L?"":"display: none;"}
        `,re.forEach(k=>{let E=document.createElement("button");E.className="btfw-context-item",E.textContent=k.label,E.style.cssText=`
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
          `,i.BOOST_MULTIPLIER===k.multiplier&&(E.style.background="rgba(46, 213, 115, 0.2)",E.style.color="#2ed573"),E.addEventListener("mouseenter",()=>{i.BOOST_MULTIPLIER!==k.multiplier&&(E.style.background="rgba(109, 77, 246, 0.2)")}),E.addEventListener("mouseleave",()=>{i.BOOST_MULTIPLIER!==k.multiplier&&(E.style.background="transparent")}),E.addEventListener("click",async()=>{if(await i.setBoostMultiplier(k.multiplier),m(),b){let Y=Math.round(k.multiplier*100);b.title=`Toggle Audio Boost (${Y}%)`}i.boostEnabled&&q(`Boost set to ${k.label}`,"success")}),d.appendChild(E)}),d.addEventListener("mouseenter",()=>{$&&(clearTimeout($),$=null)}),d.addEventListener("mouseleave",()=>{$=setTimeout(()=>ye(),100)}),document.body.appendChild(d),V=d,d}function we(){if(!b)return;let d=ke();G(d,b,U),L?d.matches(":popover-open")||d.showPopover():d.style.display="block"}function ye(){V&&(L?V.matches(":popover-open")&&V.hidePopover():V.style.display="none")}function m(){if(!V)return;V.querySelectorAll(".btfw-context-item").forEach((k,E)=>{let Y=re[E];i.BOOST_MULTIPLIER===Y.multiplier?(k.style.background="rgba(46, 213, 115, 0.2)",k.style.color="#2ed573"):(k.style.background="transparent",k.style.color="#e0e0e0")})}function P(){if(B)return B;let d=document.createElement("div");return d.id="btfw-norm-context-menu",L&&(d.popover="auto"),d.style.cssText=`
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
          ${L?"":"display: none;"}
        `,Object.keys(i.NORM_PRESETS).forEach(k=>{let E=i.NORM_PRESETS[k],Y=document.createElement("button");Y.className="btfw-context-item",Y.textContent=E.label,Y.style.cssText=`
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
          `,i.currentNormPreset===k&&(Y.style.background="rgba(52, 152, 219, 0.2)",Y.style.color="#3498db"),Y.addEventListener("mouseenter",()=>{i.currentNormPreset!==k&&(Y.style.background="rgba(109, 77, 246, 0.2)")}),Y.addEventListener("mouseleave",()=>{i.currentNormPreset!==k&&(Y.style.background="transparent")}),Y.addEventListener("click",async()=>{await i.setNormPreset(k),ie(),s&&(s.title=`Toggle Audio Normalization (${E.label})`),i.normalizationEnabled&&ge(`Preset: ${E.label}`,"success")}),d.appendChild(Y)}),d.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null)}),d.addEventListener("mouseleave",()=>{Z=setTimeout(()=>F(),100)}),document.body.appendChild(d),B=d,d}function M(){if(!s)return;let d=P();G(d,s,y),L?d.matches(":popover-open")||d.showPopover():d.style.display="block"}function F(){B&&(L?B.matches(":popover-open")&&B.hidePopover():B.style.display="none")}function ie(){if(!B)return;let d=B.querySelectorAll(".btfw-context-item");Object.keys(i.NORM_PRESETS).forEach((k,E)=>{let Y=d[E];i.currentNormPreset===k?(Y.style.background="rgba(52, 152, 219, 0.2)",Y.style.color="#3498db"):(Y.style.background="transparent",Y.style.color="#e0e0e0")})}function ne(){let d=o("#btfw-vo-left");if(!d)return!1;let k=o("#btfw-vo-audioboost");k&&k.remove();let E=o("#btfw-vo-audionorm");E&&E.remove();let Y=o("#btfw-vo-mono");return Y&&Y.remove(),b=he(),s=Se(),v=ve(),d.appendChild(b),d.appendChild(s),d.appendChild(v),!0}function f(d,k=20){let E=0,Y=setInterval(()=>{E++,ne()?(clearInterval(Y),d()):E>=k&&clearInterval(Y)},500)}function h(){if(typeof videojs=="undefined"){setTimeout(h,500);return}if(!o("#ytapiplayer")){setTimeout(h,500);return}i.player=videojs("ytapiplayer"),i.originalSrc=i.player.currentSrc(),i.startWatchdog()}function x(){setTimeout(()=>{i.resetMediaBinding(),i.boostEnabled=!1,i.normalizationEnabled=!1,i.monoEnabled=!1,i.isProxied=!1,z(!1),K(!1),_e(!1),h(),R&&setTimeout(()=>{ae()},1200),W&&setTimeout(()=>{le()},1200),I&&setTimeout(()=>{be()},1200)},600)}function N(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>i._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>i._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",x))}function Q(){f(()=>{h()}),N()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Q):Q(),{name:"feature:audio",activate:ae,deactivate:te,isActive:()=>i.boostEnabled,activateNormalization:le,deactivateNormalization:pe,isNormalizationActive:()=>i.normalizationEnabled,activateMono:be,deactivateMono:ue,isMonoActive:()=>i.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async o=>o.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:L})=>{let A=await L("util:tmdb-proxy"),U="movie-info",y={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},G="btfw-movie-info-style",p={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},o=0,i=!1,b=null;function s(f){typeof f=="function"&&p.cleanup.push(f)}function v(){for(;p.cleanup.length;){let f=p.cleanup.pop();try{f()}catch(h){}}p.header&&(p.header.remove(),p.header=null)}function R(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null),p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null),o=0,p.currentTitle="",p.isInitialized=!1,v()}function W(f){if(typeof f=="boolean")return f;if(typeof f=="number")return Number.isFinite(f)?f>0:!1;if(typeof f=="string"){let h=f.trim().toLowerCase();return h?h==="1"||h==="true"||h==="yes"||h==="on":!1}return!1}function I(){let f=[()=>{var h,x,N;return(N=(x=(h=window.BTFW_THEME_ADMIN)==null?void 0:h.integrations)==null?void 0:x.movieInfo)==null?void 0:N.enabled},()=>{var h,x,N;return(N=(x=(h=window.BTFW_CONFIG)==null?void 0:h.integrations)==null?void 0:x.movieInfo)==null?void 0:N.enabled},()=>{var h,x;return(x=(h=window.BTFW_CONFIG)==null?void 0:h.movieInfo)==null?void 0:x.enabled},()=>{var h;return(h=window.BTFW_CONFIG)==null?void 0:h.movieInfoEnabled},()=>{var h,x;return(x=(h=document==null?void 0:document.body)==null?void 0:h.dataset)==null?void 0:x.btfwMovieInfoEnabled}];for(let h of f)try{let x=typeof h=="function"?h():h;if(W(x))return!0}catch(x){}return!1}function V(){if(b||typeof MutationObserver!="function")return;let f=document.body;f&&(b=new MutationObserver(()=>re()),b.observe(f,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function B(){if(i)return;i=!0;let f=()=>re();document.addEventListener("btfw:channelIntegrationsChanged",f),document.addEventListener("btfw:ready",f)}function $(f=0){p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.initTimer=window.setTimeout(()=>{p.initTimer=null,I()&&Z()},Math.max(0,f))}function Z(){if(p.isInitialized)return;let f=document.querySelector(y.TOPBAR_SELECTOR);if(!f){$(500);return}try{z(f),ie(),ae(),p.isInitialized=!0,setTimeout(()=>{be(),ue()},120)}catch(h){$(800)}}function re(){I()?p.isInitialized?(be(),setTimeout(ue,80)):$(0):R()}function z(f){if(!f&&(f=document.querySelector(y.TOPBAR_SELECTOR),!f))throw new Error("Chat topbar not found");let h=document.getElementById(y.CONTAINER_ID);h&&h.remove();let x=document.createElement("div");x.id=y.CONTAINER_ID,x.className="btfw-movie-header hide",x.dataset.module=U,f.insertAdjacentElement("afterend",x),p.header=x}function q(){try{return window.socket||window.SOCKET||null}catch(f){return null}}function ae(){te(),le();let f=F(be,250);window.addEventListener("resize",f),s(()=>window.removeEventListener("resize",f))}function te(){K(),ge()}function K(){let f=document.querySelector(y.TITLE_SELECTOR);if(f){let h=()=>_e(),x=()=>de();f.addEventListener("mouseenter",h),f.addEventListener("mouseleave",x),s(()=>{f.removeEventListener("mouseenter",h),f.removeEventListener("mouseleave",x)})}else if(typeof MutationObserver=="function"){let h=new MutationObserver(()=>{document.querySelector(y.TITLE_SELECTOR)&&(h.disconnect(),K())});h.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),s(()=>{try{h.disconnect()}catch(x){}})}}function ge(){let f=p.header;if(!f)return;let h=()=>pe(),x=()=>de();f.addEventListener("mouseenter",h),f.addEventListener("mouseleave",x),s(()=>{f.removeEventListener("mouseenter",h),f.removeEventListener("mouseleave",x)})}function le(){let f=q();if(f&&typeof f.on=="function"){f.on("changeMedia",ue),s(()=>{var N,Q;try{(N=f.off)==null||N.call(f,"changeMedia",ue)}catch(d){try{(Q=f.removeListener)==null||Q.call(f,"changeMedia",ue)}catch(k){}}});return}let h=0,x=()=>{if(!I()){p.socketRetryTimer=null;return}let N=q();if(N&&typeof N.on=="function"){N.on("changeMedia",ue),s(()=>{var Q,d;try{(Q=N.off)==null||Q.call(N,"changeMedia",ue)}catch(k){try{(d=N.removeListener)==null||d.call(N,"changeMedia",ue)}catch(E){}}}),p.socketRetryTimer=null;return}if(h+=1,h>10){p.socketRetryTimer=null;return}p.socketRetryTimer=window.setTimeout(x,1e3)};p.socketRetryTimer=window.setTimeout(x,1200),s(()=>{p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null)})}function pe(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null)}function _e(){pe(),p.header&&(p.header.classList.remove("hide"),p.header.classList.add("show"))}function de(){pe(),p.hideTimer=window.setTimeout(()=>{p.header&&(p.header.classList.remove("show"),p.header.classList.add("hide"),setTimeout(()=>{p.header&&p.header.classList.contains("hide")&&p.header.classList.remove("hide")},320))},300)}function be(){if(!p.header)return;let f=window.innerWidth<=768;p.header.classList.toggle("btfw-mobile",f)}async function ue(){var Q;if(!p.isInitialized)return;let f=document.querySelector(y.TITLE_SELECTOR),h=p.header;if(!f||!h)return;let x=((Q=f.textContent)==null?void 0:Q.trim())||"";if(!x){p.currentTitle="",we();return}if(x===p.currentTitle)return;p.currentTitle=x;let N=++o;ve();try{let d=await Se(x);if(N!==o)return;m(d)}catch(d){if(N!==o)return;A.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ke()}}function he(f){let h=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],x=f;return h.forEach(N=>{let Q=new RegExp(`\\b${N}\\b`,"gi");x=x.replace(Q,"")}),x.replace(/\s{2,}/g," ").trim()}async function Se(f){var k;if(!A.isAvailable())throw new Error(A.MISSING_PROXY_MSG);let h=f.match(/(.+)\s*\((\d{4})\)/),x=h?h[1].trim():f,N=h?h[2]:"";N||(h=f.match(/(.+?)\s+(\d{4})\s*$/),h&&(x=h[1].trim(),N=h[2]));let Q=he(x),d=await A.tmdbFetch("search/movie",{query:Q,year:N});if(((k=d==null?void 0:d.results)==null?void 0:k.length)>0){let E=d.results[0];return{title:f,backdrop:E.backdrop_path?`https://image.tmdb.org/t/p/w1280${E.backdrop_path}`:null,poster:E.poster_path?`https://image.tmdb.org/t/p/w500${E.poster_path}`:null,summary:E.overview||"",rating:E.vote_average||0,releaseDate:E.release_date||"",voteCount:E.vote_count||0}}return{title:f,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ve(){if(!p.header)return;ye();let f=document.createElement("div");f.className="btfw-movie-content";let h=document.createElement("div");h.className="btfw-movie-loading";let x=document.createElement("i");x.className="fa fa-spinner fa-spin";let N=document.createElement("p");N.textContent="Loading movie information...",h.append(x,N),f.appendChild(h),p.header.replaceChildren(f)}function ke(){if(!p.header)return;ye();let f=document.createElement("div");f.className="btfw-movie-content";let h=document.createElement("div");h.className="btfw-movie-error";let x=document.createElement("i");x.className="fa fa-exclamation-triangle";let N=document.createElement("p");N.textContent="Unable to fetch movie information";let Q=document.createElement("small");Q.textContent="Check TMDB API key in Theme Settings",h.append(x,N,Q),f.appendChild(h),p.header.replaceChildren(f)}function we(){if(!p.header)return;ye();let f=document.createElement("div");f.className="btfw-movie-content";let h=document.createElement("p");h.textContent="No movie information available",f.appendChild(h),p.header.replaceChildren(f)}function ye(){p.header&&(p.header.style.backgroundImage="",p.header.style.backgroundColor="")}function m(f){if(!p.header)return;p.header.replaceChildren(),y.ENABLE_BACKDROP&&f.backdrop?(p.header.style.backgroundImage=`url(${f.backdrop})`,p.header.style.backgroundSize="cover",p.header.style.backgroundPosition="center"):ye();let h=document.createElement("div");h.className="btfw-movie-overlay",p.header.appendChild(h);let x=document.createElement("div");if(x.className="btfw-movie-content",p.header.appendChild(x),f.poster){let d=document.createElement("img");d.src=f.poster,d.alt=`${f.title} Poster`,d.className="btfw-movie-poster",x.appendChild(d)}let N=document.createElement("div");N.className="btfw-movie-details",x.appendChild(N);let Q=document.createElement("h2");if(Q.textContent=f.title,Q.className="btfw-movie-title",N.appendChild(Q),y.SHOW_SUMMARY&&f.summary){let d=document.createElement("p");d.textContent=f.summary,d.className="btfw-movie-summary",N.appendChild(d)}if(y.ENABLE_RATING&&f.rating>0){let d=P(f.rating,f.voteCount);x.appendChild(d)}}function P(f,h){let x=document.createElement("div");x.className="btfw-movie-rating";let N=Math.round(f*10),Q=M(N),d="http://www.w3.org/2000/svg",k=document.createElementNS(d,"svg");k.setAttribute("width","60"),k.setAttribute("height","60"),k.setAttribute("viewBox","0 0 60 60");let E=25,Y=2*Math.PI*E,Te=Y-f/10*Y,l=document.createElementNS(d,"circle");l.setAttribute("cx","30"),l.setAttribute("cy","30"),l.setAttribute("r",E.toString()),l.setAttribute("stroke","#2a2a2a"),l.setAttribute("stroke-width","4"),l.setAttribute("fill","#1a1a1a"),k.appendChild(l);let c=document.createElementNS(d,"circle");c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r",E.toString()),c.setAttribute("stroke",Q),c.setAttribute("stroke-width","3"),c.setAttribute("fill","none"),c.setAttribute("stroke-dasharray",Y.toString()),c.setAttribute("stroke-dashoffset",Te.toString()),c.setAttribute("transform","rotate(-90 30 30)"),c.setAttribute("stroke-linecap","round"),k.appendChild(c);let T=document.createElementNS(d,"text");if(T.setAttribute("x","50%"),T.setAttribute("y","50%"),T.setAttribute("text-anchor","middle"),T.setAttribute("dominant-baseline","central"),T.setAttribute("fill","#fff"),T.setAttribute("font-size","10"),T.setAttribute("font-weight","bold"),T.textContent=`${N}%`,k.appendChild(T),x.appendChild(k),h>0){let C=document.createElement("div");C.className="btfw-movie-votes",C.textContent=`${h.toLocaleString()} votes`,x.appendChild(C)}return x}function M(f){let h=Math.max(0,Math.min(f,100));return h>=70?"#4caf50":h>=50?"#ff9800":"#f44336"}function F(f,h){let x=null;return function(...Q){x&&clearTimeout(x),x=setTimeout(()=>{x=null,f(...Q)},h)}}function ie(){if(document.getElementById(G))return;let f=`
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
      ${y.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,h=document.createElement("style");h.id=G,h.textContent=f,document.head.appendChild(h)}function ne(){V(),B(),re()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ne,{once:!0}):ne(),{name:"feature:movie-info",refresh:re,cleanup:R}});BTFW.define("feature:monkeyPaw",[],async()=>{let L="btfw-monkey-paw-styles",A="btfw-monkey-paw-overlay",U="/src/assets/monkey-paw/paw.svg",y={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},G={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},p={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},o=null,i=null,b=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function s(z){let q=String(z||"").trim();return/^<svg[\s>]/i.test(q)?!b.test(q):!1}function v(z){return new Promise(q=>setTimeout(q,z))}function R(){try{let z=typeof window!="undefined"?window.BTFW:null;return z&&(z.BASE||z.DEV_CDN)||""}catch(z){return""}}function W(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(z){return!1}}function I(){if(typeof document=="undefined"||document.getElementById(L))return;let z=document.createElement("style");z.id=L,z.textContent=`
      #${A} {
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

      #${A}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${A}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${A}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${A} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${A} .btfw-monkey-paw-title {
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

      #${A} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${A} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${A} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${A} .f-tip {
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

      #${A} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${A} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${A} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${A} .f-root,
        #${A} .f-tip,
        #${A} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(z)}async function V(){if(o)return o;let q=`${R()}${U}`,ae=await fetch(q,{credentials:"omit"});if(!ae.ok)throw new Error(`Monkey paw SVG failed to load (${ae.status})`);let te=await ae.text();if(!s(te))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return o=te,o}function B(z){Object.entries(p).forEach(([q,ae])=>{let te=z.querySelector(`#${q}`),K=z.querySelector(`#${q}-tip`);te&&(te.style.transform=ae.root),K&&(K.style.transform=ae.tip)})}function $(z){Object.entries(y).forEach(([q,ae])=>{window.setTimeout(()=>{let te=z.querySelector(`#${q}`),K=z.querySelector(`#${q}-tip`);te&&(te.style.transform=ae.root),K&&window.setTimeout(()=>{K.style.transform=ae.tip},120)},G[q])})}function Z(z){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${z}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function re(z={}){if(i)return i;if(typeof document!="undefined")return i=(async()=>{var ge,le;if(I(),W()){await v((ge=z.reducedMotionMs)!=null?ge:450);return}let q=document.getElementById(A);q||(q=document.createElement("div"),q.id=A,document.body.appendChild(q));let ae;try{ae=await V()}catch(pe){console.warn("[monkey-paw] SVG load failed:",pe),await v(300);return}q.innerHTML=Z(ae),B(q);let te=q.querySelector("#paw"),K=q.querySelector("#btfw-monkey-paw-msg");q.classList.remove("is-cursed"),K==null||K.classList.remove("is-visible"),requestAnimationFrame(()=>q.classList.add("is-active")),$(q),await v(980),te==null||te.classList.add("btfw-monkey-paw-shaking"),await v(720),te==null||te.classList.remove("btfw-monkey-paw-shaking"),q.classList.add("is-cursed"),K==null||K.classList.add("is-visible"),await v((le=z.holdMs)!=null?le:1100),q.classList.remove("is-active"),await v(320),q.remove()})().finally(()=>{i=null}),i}return{name:"feature:monkeyPaw",play:re}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:L})=>{let A=await L("util:tmdb-proxy"),U=await L("feature:monkeyPaw"),y=(m,P=document)=>P.querySelector(m),G=(m,P=document)=>Array.from(P.querySelectorAll(m)),p=null,o=null,i=null,b=null,s={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},v=null,R=null,W="[movie-suggestion]";function I(...m){console.log(W,...m)}function V(...m){console.error(W,...m)}function B(m){var P;try{if((P=window.socket)!=null&&P.emit)return window.socket.emit("chatMsg",{msg:m}),!0}catch(M){}return!1}async function $(m,P={}){return A.workerFetch(m,P)}function Z(){if(document.getElementById("btfw-movie-suggest-styles"))return;let m=document.createElement("style");m.id="btfw-movie-suggest-styles",m.textContent=`
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
    `,document.head.appendChild(m)}let re=(CLIENT==null?void 0:CLIENT.rank)||0;function z(){let m=y("a[href*='donate'], #donate-btn, .donate-btn");if(m){let M=m.closest("ul");if(M)return{ul:M,insertAfter:m.parentElement}}let P=y("#btfw-theme-btn-nav");if(P){let M=P.closest("ul");if(M)return{ul:M,insertAfter:null}}return{ul:y(".navbar .nav.navbar-nav")||y(".navbar-nav")||y(".btfw-navbar ul")||y(".navbar ul"),insertAfter:null}}function q(){if(y("#btfw-movie-suggest-btn"))return!0;let m=z();if(!m.ul)return!1;let P=document.createElement("li"),M=document.createElement("a");return M.href="javascript:void(0)",M.className="btfw-nav-pill",M.id="btfw-movie-suggest-btn",M.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,P.appendChild(M),m.insertAfter?m.insertAfter.after(P):m.ul.insertBefore(P,m.ul.firstChild),M.addEventListener("click",Se),!0}function ae(){var F,ie,ne,f,h,x;if(y("#btfw-movie-suggest-modal"))return;let m=document.createElement("div");m.id="btfw-movie-suggest-modal",m.className="modal",m.innerHTML=`
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
                     placeholder="${re===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${re===0?"disabled":""}>
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
    `,document.body.appendChild(m);let P=y(".modal-background",m),M=y(".delete",m);if(P.addEventListener("click",ve),M.addEventListener("click",ve),(F=y("#btfw-movie-prev",m))==null||F.addEventListener("click",()=>{s.page>1&&(s.page-=1,de())}),(ie=y("#btfw-movie-next",m))==null||ie.addEventListener("click",()=>{s.page<s.totalPages&&(s.page+=1,de())}),re===0){let N=y("#btfw-movie-search",m);N.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),N.blur()})}else{let N,Q=y("#btfw-movie-search",m);Q.addEventListener("input",()=>{clearTimeout(N),s.query=Q.value.trim(),s.page=1,N=setTimeout(()=>de(),400)}),(ne=y("#btfw-movie-sort",m))==null||ne.addEventListener("change",d=>{s.sortBy=d.target.value,s.page=1,de()}),(f=y("#btfw-movie-genre",m))==null||f.addEventListener("change",d=>{s.genreId=d.target.value,s.page=1,de()}),(h=y("#btfw-movie-year",m))==null||h.addEventListener("change",d=>{s.year=d.target.value.trim(),s.page=1,de()}),(x=y("#btfw-movie-rating",m))==null||x.addEventListener("change",d=>{s.minRating=d.target.value.trim(),s.page=1,de()})}}function te(){if(y("#btfw-movie-confirm-modal"))return;let m=document.createElement("div");m.id="btfw-movie-confirm-modal",m.className="modal",m.innerHTML=`
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
    `,document.body.appendChild(m);let P=y(".modal-background",m),M=y(".delete",m),F=y("#btfw-movie-cancel",m),ie=y("#btfw-movie-confirm",m),ne=()=>he();P.addEventListener("click",ne),M.addEventListener("click",ne),F.addEventListener("click",ne),ie.addEventListener("click",we)}async function K(){if(v&&R)return;let[m,P]=await Promise.all([$("/api/meta"),$("/api/genres")]);v=m,R=P;let M=y("#btfw-movie-suggest-modal");if(!M)return;let F=y("#btfw-movie-sort",M);if(F&&F.options.length===0){for(let ne of m.sortOptions||[]){let f=document.createElement("option");f.value=ne.value,f.textContent=ne.label,F.appendChild(f)}F.value=s.sortBy}let ie=y("#btfw-movie-genre",M);if(ie&&ie.options.length<=1)for(let ne of P.genres||[]){let f=document.createElement("option");f.value=String(ne.id),f.textContent=ne.name,ie.appendChild(f)}}function ge(){let m={page:s.page,sort_by:s.sortBy};return s.query?(m.query=s.query,s.year&&(m.primary_release_year=s.year,m.year=s.year)):(s.genreId&&(m.with_genres=s.genreId),s.year&&(m.primary_release_year=s.year),s.minRating&&(m["vote_average.gte"]=s.minRating)),m}function le(m){return!m||m==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${m}`}function pe(){let m=y("#btfw-movie-suggest-modal");if(!m)return;let P=y("#btfw-movie-prev",m),M=y("#btfw-movie-next",m),F=y("#btfw-movie-page-label",m);F&&(F.textContent=`Page ${s.page} of ${s.totalPages}`),P&&(P.disabled=s.page<=1||s.loading),M&&(M.disabled=s.page>=s.totalPages||s.loading)}function _e(m){let P=y("#btfw-movie-suggest-modal");if(!P)return;let M=y(".btfw-movie-results",P);if(!m.length){M.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}M.innerHTML=m.map(F=>`
      <div class="movie-result"
           data-id="${xe(F.id)}"
           data-title="${xe(F.title)}"
           data-poster="${xe(F.posterPath||"")}"
           data-year="${xe(F.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${xe(le(F.posterPath))}" alt="${xe(F.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${xe(F.title)}</div>
          <small style="opacity:0.7;">${xe(F.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),G(".movie-result",M).forEach(F=>{F.addEventListener("click",()=>{p=F.dataset.id,o=F.dataset.title,i=F.dataset.poster,b=F.dataset.year||null;let ie=y("#btfw-movie-confirm-modal");if(!ie)return;let ne=b?` (${b})`:"";y("#btfw-confirm-movie-title",ie).textContent=`${o}${ne}`,ue()})})}async function de(){let m=y("#btfw-movie-suggest-modal");if(!m||s.loading)return;s.loading=!0,pe();let P=y(".btfw-movie-results",m);P.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await K();let M=await $("/api/search",{params:ge()});s.totalPages=Math.max(1,M.totalPages||1),_e(M.results||[]),I("runSearch",{page:s.page,totalPages:s.totalPages,count:(M.results||[]).length})}catch(M){V("runSearch failed:",M),P.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{s.loading=!1,pe()}}async function be(){let m=y("#btfw-movie-history");if(m){m.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let M=(await $("/api/history",{params:{page:1,limit:10}})).results||[];if(!M.length){m.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}m.innerHTML=M.map(F=>{let ie=F.releaseYear?` (${xe(F.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${xe(le(F.posterPath).replace("w154","w92"))}" alt="${xe(F.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${xe(F.movieTitle)}${ie}</div>
              <div class="history-item__meta">Requested by ${xe(F.username)}</div>
            </div>
          </div>
        `}).join("")}catch(P){V("loadHistory failed:",P),m.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function ue(){let m=y("#btfw-movie-suggest-modal"),P=y("#btfw-movie-confirm-modal");P&&(m&&m.classList.add("btfw-movie-suggest-pending"),P.classList.add("is-active"))}function he(){let m=y("#btfw-movie-suggest-modal"),P=y("#btfw-movie-confirm-modal");m&&m.classList.remove("btfw-movie-suggest-pending"),P&&P.classList.remove("is-active")}async function Se(){let m=y("#btfw-movie-suggest-modal");if(m){I("openModal",{userRank:re}),m.classList.remove("btfw-movie-suggest-pending"),m.classList.add("is-active");try{await K(),await Promise.all([de(),be()])}catch(P){V("openModal bootstrap failed:",P)}}}function ve(){let m=y("#btfw-movie-suggest-modal");m&&(he(),I("closeModal"),m.classList.remove("is-active"),y("#btfw-movie-search",m).value="",y(".btfw-movie-results",m).innerHTML="",s.query="",s.page=1,s.totalPages=1,p=null,o=null,i=null,b=null)}function ke(m,P,M){let F=M?` (${M})`:"";return`\u{1F3AC} Movie request: ${P}${F} \u2014 suggested by ${m}`}async function we(){if(!p||!o)return;let m=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";I("confirmSuggestion",{movieId:p,movieTitle:o}),he();try{await U.play(),await $("/api/suggestions",{method:"POST",body:{movieId:Number(p),movieTitle:o,username:m,posterPath:i||null,releaseYear:b||null}}),B(ke(m,o,b)),await be(),ve()}catch(P){V("confirmSuggestion failed:",P),alert("Could not save your movie request. Please try again.")}}function ye(){I("boot: start",{workerBase:A.getWorkerBase()}),Z(),ae(),te();let m=0,P=50,M=()=>{if(q()){I("Button added successfully");return}m+=1,m<P?setTimeout(M,100):console.warn(W,"Failed to add button after retries",{retryCount:m})};M()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ye,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ye,200)}):setTimeout(ye,200),{name:"ext:movie-suggestion",open:Se,close:ve,getWorkerBase:A.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async L=>L.init("ext:movie-suggestion"));})();
