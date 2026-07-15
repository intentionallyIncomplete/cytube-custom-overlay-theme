/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let $="#videowrap .video-js",P="vjs-default-skin",L="vjs-theme-city",h="vjs-big-play-centered",V=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),f={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},a="btfw-videojs-base-css",b="btfw-videojs-city-css",S=["https://vjs.zencdn.net/7.20.3/video-js.css"],u=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function E(v,A){let O=document;if(!O||!O.head||O.getElementById(v))return;let Y=O.createElement("link");Y.id=v,Y.rel="stylesheet";let ie=Array.isArray(A)?A.slice():[A],se=()=>{if(!ie.length)return!1;let le=ie.shift();return le?(Y.href=le,!0):se()};Y.addEventListener("error",()=>{se()||Y.remove()}),se()&&O.head.appendChild(Y)}function H(){if(typeof window=="undefined"||!document.body)return!1;let v=document.createElement("div");v.className=`video-js ${P}`,v.style.position="absolute",v.style.opacity="0",v.style.pointerEvents="none",v.style.width="1px",v.style.height="1px",document.body.appendChild(v);let A=window.getComputedStyle(v).fontSize;return v.remove(),A&&Math.abs(parseFloat(A)-10)<.2}function R(){H()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||E(a,S)}function I(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||E(b,u)}function K(v){if(!v)return null;try{return v.player||v.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(v.id)||window.videojs&&window.videojs.players&&window.videojs.players[v.id]}catch(A){return null}}function U(v){let A=K(v);if(!A)return;let O=typeof A.getChild=="function"?A.getChild("controlBar"):null,Y=O&&typeof O.getChild=="function"?O.getChild("volumePanel"):null;if(Y){v.classList.add("btfw-volume-inline");try{typeof Y.inline=="function"&&Y.inline(!0)}catch(ie){}}}function Q(){R(),I(),document.querySelectorAll($).forEach(v=>{v.classList.contains(P)&&v.classList.remove(P),Array.from(v.classList).forEach(A=>{A.startsWith("vjs-theme-")&&A!==L&&v.classList.remove(A)}),v.classList.contains(L)||v.classList.add(L),v.classList.contains(h)||v.classList.add(h),U(v)})}function F(){var A;if(typeof window=="undefined")return;let v=(A=window.BTFW)==null?void 0:A.channelPosterUrl;v&&document.querySelectorAll($).forEach(O=>{O.poster!==v&&(O.poster=v);try{let Y=O.player||O.player_||window.videojs&&window.videojs.players&&window.videojs.players[O.id];Y&&typeof Y.poster=="function"&&Y.poster(v)}catch(Y){let ie=O.querySelector(".vjs-poster");ie&&(ie.style.backgroundImage=`url("${v}")`)}})}function N(){var O;if(typeof window=="undefined")return;let v=(O=window.PLAYER)==null?void 0:O.mediaType;document.querySelectorAll(".vjs-poster").forEach(Y=>{v==="yt"||v==="dm"||v==="vi"||v==="tw"?Y.classList.add("hidden"):Y.classList.remove("hidden")})}function J(){document.querySelectorAll(V).forEach(A=>{A instanceof HTMLVideoElement&&(typeof A.playsInline=="boolean"&&(A.playsInline=!0),Object.entries(f).forEach(([O,Y])=>{try{A.setAttribute(O,Y)}catch(ie){}}))})}function ee(){if(typeof window=="undefined")return!1;let v=window.videojs;if(!v)return!1;let A=v.dom||v;if(!A||typeof A.textContent!="function")return!1;if(A.textContent&&A.textContent._btfwOptimized)return!0;let O=A.textContent.bind(A),Y=function(se,le){if(!se)return se;let ue;try{typeof se.textContent!="undefined"?ue=se.textContent:typeof se.innerText!="undefined"&&(ue=se.innerText)}catch(l){ue=void 0}if(ue!==void 0){let l=le==null?"":String(le);if(ue===l)return se}return O(se,le)};return Y._btfwOptimized=!0,Y._btfwOriginal=O,A.textContent=Y,!0}function te(){if(ee()){te._tries=0;return}te._tries>20||(te._tries=(te._tries||0)+1,setTimeout(te,250))}let he="_btfwGuarded";function oe(v){if(!v)return!1;let A=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!v.closest(A)}function Ee(v){if(!v||v[he])return;v[he]=!0;let A=O=>{oe(O.target)||O.type==="click"&&O.button!==0||(O.preventDefault(),O.stopImmediatePropagation())};v.addEventListener("click",A,!0),v.addEventListener("pointerdown",O=>{oe(O.target)||(O.preventDefault(),O.stopImmediatePropagation())},!0),v.addEventListener("contextmenu",A,!0)}function pe(){document.querySelectorAll($).forEach(Ee)}function we(){if(we._mo)return;let v=document.getElementById("videowrap")||document.body,A=new MutationObserver(O=>{var ie,se,le;let Y=!1;for(let ue of O){for(let l of ue.addedNodes)if(l.nodeType===1&&((ie=l.classList)!=null&&ie.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME"||(se=l.querySelector)!=null&&se.call(l,$))){Y=!0;break}for(let l of ue.removedNodes)if(l.nodeType===1&&((le=l.classList)!=null&&le.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME")){Y=!0;break}}Y&&(Q(),pe(),J(),F(),N(),document.querySelectorAll($).forEach(U))});A.observe(v,{childList:!0,subtree:!0,characterData:!1}),we._mo=A}function Se(){setTimeout(()=>{J(),F(),N(),document.querySelectorAll($).forEach(U)},100)}function de(){if(Q(),pe(),J(),te(),F(),N(),we(),setInterval(()=>{N()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",Se),socket.on("changeMedia",Se)}catch(v){console.warn("[feature:player] Unable to bind changeMedia handler",v)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",de):de(),document.addEventListener("btfw:layoutReady",()=>setTimeout(de,0)),{name:"feature:player",applyCityTheme:Q,attachGuards:pe,ensureInlinePlayback:J,applyPosterUrl:F,togglePosterVisibility:N,shouldAllowClick:oe}});function Pe($=document){return!$||typeof $.querySelector!="function"?!1:!!($.querySelector("#pollwrap .well.active")||$.querySelector("#pollwrap .well.muted")||$.querySelector("#pollwrap .poll-menu"))}function Ce($,P){return $!=null?!!$:!!P}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:$})=>{let P=await $("util:templates"),{stack:L}=P,h="btfw-stack-order",V="btfw-stack-motd-open",f="btfw-stack-playlist-open",a="btfw-stack-poll-open",b={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},S=b,u={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},E={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},H={"motd-group":1,"poll-group":2,"playlist-group":3},R=!1,I=null,K="",U=null,Q=null,F=null,N={"motd-group":{storageKey:V,getDefaultOpen:e=>Ce(e,v()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:f,getDefaultOpen:e=>Ce(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:a,getDefaultOpen:e=>Ce(e,Pe()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},J=null,ee=!1,te=!1,he=null,oe=!1,Ee=!1,pe=!1,we=null,Se=!1;function de(e=""){let t=String(e||"").trim();if(!t)return!0;if(typeof document!="undefined"){let n=document.createElement("div");return n.innerHTML=t,!(n.textContent||"").replace(/\u00a0/g," ").trim()}return!t.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function v(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=A(e);return t?!de(t.innerHTML||""):!1}function A(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let O=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Y=["#main","#mainpage","#mainpane"],ie=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function se(e,t,n){if(!e||!t||!n)return null;let r=ie.map(W=>{let X=document.getElementById(W.id);return X?{...W,el:X}:null}).filter(Boolean);if(!r.length){let W=document.getElementById("btfw-addmedia-panel");return W&&W.remove(),null}let o=document.getElementById("btfw-addmedia-panel");if(o||(o=document.createElement("section"),o.id="btfw-addmedia-panel",o.className="btfw-addmedia-panel",o.dataset.open="false",o.setAttribute("role","region"),o.setAttribute("aria-label","Add media controls"),o.setAttribute("aria-hidden","true"),o.setAttribute("hidden","hidden"),o.innerHTML=L.addMediaPanelHtml()),o.parentElement!==e){let W=t.parentElement===e?t.nextSibling:null;e.insertBefore(o,W)}let d=o.querySelector(".btfw-addmedia-tabs"),w=o.querySelector(".btfw-addmedia-views"),y=o.querySelector(".btfw-addmedia-close");if(!d||!w)return null;for(;d.firstChild;)d.removeChild(d.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);r.forEach(({id:W,title:X,el:q})=>{q.classList.remove("collapse","in","plcontrol-collapse"),q.style.removeProperty("display"),q.style.removeProperty("height"),q.removeAttribute("aria-expanded"),q.setAttribute("role","tabpanel"),q.setAttribute("data-btfw-addmedia","panel");let me=document.createElement("button");me.type="button",me.className="btfw-addmedia-tab",me.dataset.target=W,me.textContent=X,me.setAttribute("role","tab"),d.appendChild(me);let fe=document.createElement("div");fe.className="btfw-addmedia-view",fe.dataset.target=W,fe.setAttribute("role","tabpanel"),fe.setAttribute("aria-hidden","true"),fe.appendChild(q),w.appendChild(fe)});let k=r.find(W=>W.default)||r[0],x=W=>{let X=W||o.dataset.active||k.id;o.dataset.active=X,d.querySelectorAll(".btfw-addmedia-tab").forEach(q=>{let me=q.dataset.target===X;q.classList.toggle("is-active",me),q.setAttribute("aria-selected",me?"true":"false"),q.setAttribute("tabindex",me?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(q=>{let me=q.dataset.target===X;q.classList.toggle("is-active",me),q.setAttribute("aria-hidden",me?"false":"true")})},j=W=>{let X=W!=null?!!W:o.dataset.open!=="true";return o.dataset.open=X?"true":"false",o.classList.toggle("is-open",X),o.setAttribute("aria-hidden",X?"false":"true"),X?(o.removeAttribute("hidden"),x(o.dataset.active||k.id)):o.setAttribute("hidden","hidden"),o.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:X}})),X};return o._btfwWired||(d.addEventListener("click",W=>{let X=W.target.closest(".btfw-addmedia-tab");X&&(W.preventDefault(),x(X.dataset.target))}),y&&y.addEventListener("click",()=>j(!1)),o._btfwWired=!0),x(o.dataset.active||k.id),o._btfwToggle=j,o._btfwSetActive=x,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:X,target:q})=>{let me=document.getElementById(X);me&&me.dataset.btfwAddmedia!==q&&(me.dataset.btfwAddmedia=q,me.setAttribute("aria-controls","btfw-addmedia-panel"),me.addEventListener("click",fe=>{fe.preventDefault(),fe.stopPropagation(),x(q),j(!0),me.blur()}))})})(),{panel:o,toggle:j,setActive:x}}function le(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),r=document.getElementById("btfw-video-overlay"),o=r&&n&&r.parentElement===n.parentElement?r:n;o&&o.parentElement?o.nextSibling?o.parentNode.insertBefore(t,o.nextSibling):o.parentNode.appendChild(t):e.appendChild(t);let d=document.createElement("div");d.className="btfw-stack-list",t.appendChild(d);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function ue(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let d=t.querySelector(":scope > #motd");return d?{motdwrap:t,motd:d}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let r=[];t.querySelectorAll(".btfw-motd-editrow").forEach(d=>{let w=(d.textContent||"").trim();w&&r.push(`<p>${w}</p>`),d.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(d=>{d.contains(t)||d===t||((d.querySelector("#motd")||d.classList.contains("btfw-motd-editrow"))&&d.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&r.push(w.innerHTML)}),d.remove())});let o=t.querySelector(":scope > #motd");if(o||(o=document.createElement("div"),o.id="motd",t.appendChild(o)),t.querySelectorAll("#motd").forEach(d=>{d!==o&&((d.innerHTML||"").trim()&&r.push(d.innerHTML),d.remove())}),o.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(d=>{d.remove()}),o.querySelectorAll("#motd").forEach(d=>{(d.innerHTML||"").trim()&&r.push(d.innerHTML),d.remove()}),document.querySelectorAll("#togglemotd").forEach((d,w)=>{w!==0&&d.remove()}),r.length){let d=r.join("").trim();d&&de(o.innerHTML)?o.innerHTML=d:d&&(o.innerHTML+=d)}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:o}}function l(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),r=document.getElementById("playlistwrap"),o=document.getElementById("queuecontainer"),d=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),y=document.querySelectorAll(".btfw-controls-row"),k=d||r||o||w;if(!k)return;let x=e;x?x.classList.add("btfw-plbar"):(x=document.createElement("div"),x.id="btfw-plbar",x.className="btfw-plbar");let j=x.querySelector(".btfw-plbar__layout"),ae,W;if(j)ae=j.querySelector(".btfw-plbar__primary")||j,W=j.querySelector(".btfw-plbar__aside")||j;else{for(j=document.createElement("div"),j.className="btfw-plbar__layout",ae=document.createElement("div"),ae.className="btfw-plbar__primary",W=document.createElement("div"),W.className="btfw-plbar__aside",j.append(ae,W);x.firstChild;)ae.appendChild(x.firstChild);x.appendChild(j);let ne=ae.querySelector(".field.has-addons");ne&&ne.classList.add("btfw-plbar__search");let ve=ae.querySelector("#btfw-pl-count");ve&&(ve.classList.add("btfw-plbar__count"),W.appendChild(ve))}x.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(ne=>ne.remove());let X=x.querySelector(".btfw-plbar__actions");X||(X=document.createElement("div"),X.className="btfw-plbar__actions",(W||x).appendChild(X));let q=document.getElementById("btfw-addmedia-btn"),me=ne=>{if(ne){if(ne.classList.add("btfw-plbar__action-btn"),ne.tagName==="BUTTON"||ne.tagName==="A")ne.classList.add("button","is-dark","is-small");else if(ne.tagName==="INPUT"){let ve=(ne.type||"").toLowerCase();ve==="button"||ve==="submit"||ve==="reset"?ne.classList.add("button","is-dark","is-small"):ne.classList.remove("button","is-dark","is-small")}}};x.parentElement!==k&&k.insertBefore(x,k.firstChild);let fe=se(k,x,X);fe?!q||!document.body.contains(q)?(q=document.createElement("button"),q.id="btfw-addmedia-btn",q.type="button",q.className="button is-small",q.innerHTML=L.addMediaButtonHtml(),X.prepend(q)):X.contains(q)||X.prepend(q):q&&(q.parentElement&&q.parentElement.removeChild(q),q=null);let Ae=ne=>{if(!ne)return;Array.from(ne.children||[]).forEach(Te=>{Te&&(Te.classList.add("btfw-plbar__control"),X.appendChild(Te))})};if(n&&(Ae(n),n.remove()),t&&(Ae(t),t.remove()),X.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(me),fe&&q){q.classList.remove("is-dark"),q.classList.add("is-primary"),q.dataset.iconified||(q.innerHTML=L.addMediaButtonHtml(),q.dataset.iconified="1"),q.setAttribute("aria-controls","btfw-addmedia-panel");let ne=Te=>{q.setAttribute("aria-expanded",Te?"true":"false")};q.dataset.btfwBound||(q.dataset.btfwBound="1",q.addEventListener("click",Te=>{Te.preventDefault();let ot=document.getElementById("btfw-addmedia-panel"),it=ot&&ot._btfwToggle,wt=typeof it=="function"?it():!1;ne(wt)}));let ve=fe.panel||document.getElementById("btfw-addmedia-panel");ve&&(ne(ve.dataset.open==="true"),ve._btfwButtonSync||(ve.addEventListener("btfw:addmedia:state",Te=>{ne(!!(Te.detail&&Te.detail.open))}),ve._btfwButtonSync=!0))}y.forEach(ne=>{ne&&!k.contains(ne)&&(ne.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,ne.remove(),k.appendChild(ne),console.log("[stack] Moved floating controls row into playlist container"))}),k.contains(x)||k.insertBefore(x,k.firstChild),x.dataset.btfwMerged="1"}function M(e,t){if(e.id==="motd-group"&&(ue(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Ie(),l(),t=t.filter(y=>y&&y.id!=="rightcontrols"&&y.id!=="pollwrap").filter(y=>!y.querySelector||!y.querySelector("#pollwrap"))),e.id==="poll-group"&&(Ie(),Ue(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(y=>y&&!n.contains(y)&&!y.contains(n)));let r=document.createElement("section");r.className="btfw-stack-item btfw-group-item",r.dataset.bind=e.id,r.dataset.group="true";let o=document.createElement("header");o.className="btfw-stack-item__header",o.innerHTML=L.stackGroupHeaderHtml(e.title);let d=document.createElement("div");d.className="btfw-stack-item__body btfw-group-body",t.forEach(y=>{if(y&&y.parentElement!==d&&!d.contains(y)&&!y.contains(d))try{d.appendChild(y)}catch(k){console.warn("[stack] Failed to move element:",y.id||y.className,k)}}),r.appendChild(o),r.appendChild(d);let w=N[e.id];return w&&ut(r,w),Ke(r,e.id),r.querySelector(".btfw-up").onclick=function(){let y=r.parentElement,k=r.previousElementSibling;k&&y.insertBefore(r,k),B(y)},r.querySelector(".btfw-down").onclick=function(){let y=r.parentElement,k=r.nextElementSibling;k?y.insertBefore(k,r):y.appendChild(r),B(y)},r}function B(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(h,JSON.stringify(t))}catch(t){}}function z(){try{return JSON.parse(localStorage.getItem(h)||"[]")}catch(e){return[]}}function m(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function g(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function i(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),r=localStorage.getItem(n);return r!==null?r==="true":!1}catch(t){return!1}}function p(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function _(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function D(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function ce(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Pe()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function G(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Be())}function ge(e){G(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function be(e,t,n){if(!e||D(e))return;let r=m(t),o=typeof n=="function"?n(r):r!==null?!!r:!0;e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}function Le(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,r=document.getElementById("btfw-stack"),o=document.getElementById("btfw-leftpad"),d=document.getElementById("btfw-grid");r&&(r.classList.toggle("btfw-stack--all-hidden",n),r.classList.toggle("btfw-stack--all-docked",n)),o&&o.classList.toggle("btfw-leftpad--stack-hidden",n),d&&d.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function ke(){var r;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let o=document.createElement("div");o.id="btfw-panel-bar",o.className="btfw-panel-bar",o.setAttribute("role","toolbar"),o.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(o)}let n=t.querySelector("#btfw-panel-bar");return ye(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),R||(ct(),R=!0),(r=document.getElementById("btfw-stack-drawer"))==null||r.remove(),t}function s(e){e.preventDefault(),e.stopPropagation(),lt()}function c(){let e=ke();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=L.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",s),t.dataset.btfwPanelsWired="1"),t}function T(e){if(!e)return null;let t=Array.from(e.classList).find(r=>r.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let r=n(e).data("uid");if(r!=null&&r!=="")return r}return e.dataset.uid||null}function C(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),r=n==null?void 0:n.querySelector(".qbtn-play");return r?(r.click(),!0):!1}function Z(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),r=document.getElementById("queue_next");if(n&&r&&(n.value=t,!r.disabled))return r.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let o=window.socket;if(o&&typeof parseMediaLink=="function")try{let d=parseMediaLink(t);if((d==null?void 0:d.id)!=null&&(d!=null&&d.type))return o.emit("queue",{id:d.id,type:d.type,pos:"next",temp:!1}),!0}catch(d){}return!1}function re(e){le();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(U&&(clearTimeout(U),U=null),I=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),_e(),He(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function ye(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var d,w,y;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let k=n.dataset.panelGroup||((d=n.closest(".btfw-panel-btn"))==null?void 0:d.dataset.group);k&&re(k);return}let r=t.target.closest(".btfw-panel-playlist__play");if(r){t.preventDefault(),t.stopPropagation(),C(r.dataset.queueUid);return}let o=t.target.closest(".btfw-panel-playlist__add");if(o){t.preventDefault(),t.stopPropagation();let k=(w=o.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!k)return;let x=k.hidden;k.hidden=!x,o.setAttribute("aria-expanded",x?"true":"false"),x&&((y=k.querySelector(".btfw-panel-playlist__link-input"))==null||y.focus())}}),e.addEventListener("submit",t=>{var w,y,k,x;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let r=n.querySelector(".btfw-panel-playlist__link-input"),o=(w=r==null?void 0:r.value)==null?void 0:w.trim();if(!o||!Z(o))return;r.value="",n.hidden=!0,(k=(y=n.closest(".btfw-panel-container"))==null?void 0:y.querySelector(".btfw-panel-playlist__add"))==null||k.setAttribute("aria-expanded","false");let d=(x=n.closest(".btfw-panel-container"))==null?void 0:x.querySelector(".btfw-panel-playlist__queue");d&&qe(d)}))}function _e(){if(Q){try{Q.disconnect()}catch(e){}Q=null}F=null}function xe(e){if(!e||F===e)return;_e();let t=document.getElementById("queue");t&&(F=e,Q=new MutationObserver(()=>{e.isConnected&&I==="playlist-group"&&qe(e)}),Q.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Me(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),r=n.findIndex(d=>d.classList.contains("queue_active")||d.classList.contains("playing")),o=r>=0?r+1:0;return n.slice(o,o+e)}function qe(e){if(!e)return;let t=Me(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var k,x;let r=document.createElement("div");r.className="btfw-panel-playlist__item";let o=document.createElement("span");o.className="btfw-panel-playlist__title",o.textContent=(((k=n.querySelector(".qe_title"))==null?void 0:k.textContent)||"Untitled").trim();let d=document.createElement("span");d.className="btfw-panel-playlist__meta",d.textContent=(((x=n.querySelector(".qe_time"))==null?void 0:x.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let y=T(n);if(y!=null&&y!==""){let j=document.createElement("button");j.type="button",j.className="btfw-panel-playlist__play",j.textContent="Play",j.dataset.queueUid=String(y),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(j.disabled=!0),w.appendChild(j)}r.append(o,d,w),e.appendChild(r)})}function Ye(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=L.panelUndockIconHtml(),n}function rt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=L.playlistAddFormHtml(),e}function at(e,t,n){let r=document.createElement("div");if(r.className="btfw-panel-container",n>0&&(r.style.bottom=`${-n*50}px`),e==="playlist-group"){r.classList.add("btfw-panel-container--playlist");let d=document.createElement("div");d.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let y=Ye(e,t);d.append(w,y);let k=rt(),x=document.createElement("div");return x.className="btfw-panel-container__host btfw-panel-playlist__queue",r.append(d,k,x),r}r.classList.add("btfw-panel-container--dock-only");let o=document.createElement("div");return o.className="btfw-panel-container__dock-only",o.appendChild(Ye(e,t)),r.appendChild(o),r}function Re(){U&&(clearTimeout(U),U=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{ge(e)}),_e(),I=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function Fe(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||Re()}function st(){Fe(!1)}function lt(){ke();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||Fe(!e.classList.contains("open"))}function Ve(e){U&&clearTimeout(U),U=setTimeout(()=>{U=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),I===e&&(I=null,_e()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function De(e,t){if(t&&(U&&(clearTimeout(U),U=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),I=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(qe(n),xe(n))}}function ct(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{I&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),Re()))}))}function Ge(e,t){var r;if(!((r=document.getElementById("btfw-panel-bar"))!=null&&r.classList.contains("open")))return;if(U&&(clearTimeout(U),U=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),I===e&&(I=null,_e()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(o=>{o!==t&&delete o.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",De(e,t)}function dt(e,t){let n=e.querySelector(".btfw-panel-container"),r=()=>{var o;(o=document.getElementById("btfw-panel-bar"))!=null&&o.classList.contains("open")&&(U&&(clearTimeout(U),U=null),De(t,e))};e.addEventListener("mouseenter",r),e.addEventListener("focusin",r),e.addEventListener("click",o=>{o.target.closest(".btfw-panel-container")||(o.preventDefault(),o.stopPropagation(),Ge(t,e))}),e.addEventListener("keydown",o=>{o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),Ge(t,e))}),e.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(o.relatedTarget)||Ve(t))}),n==null||n.addEventListener("mouseenter",()=>{U&&(clearTimeout(U),U=null)}),n==null||n.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(o.relatedTarget)||Ve(t))})}function $e(){let e=ke();c();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((y,k)=>(H[y.dataset.bind]||99)-(H[k.dataset.bind]||99)),r=n.map(y=>y.dataset.bind).join("|"),o=document.getElementById("btfw-panels-menu-btn");if(o&&(o.hidden=n.length===0,n.length===0)){K="",st();return}if(r===K&&t.childElementCount===n.length)return;K=r;let d=t.classList.contains("open"),w=I;if(Re(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((y,k)=>{let x=y.dataset.bind,j=u[x]||{short:"?",title:x},ae=document.createElement("div");ae.className="btfw-panel-btn",ae.dataset.group=x,ae.title=j.title,ae.setAttribute("role","button"),ae.setAttribute("aria-label",j.title),ae.tabIndex=0;let W=document.createElement("span");W.className="btfw-panel-btn__label",W.textContent=E[x]||j.short,ae.appendChild(W),ae.appendChild(at(x,j,k)),t.appendChild(ae),dt(ae,x)}),d&&(Fe(!0),w&&n.some(k=>k.dataset.bind===w))){let k=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);k&&De(w,k)}}function He(e,t,n={}){if(!e)return;let r=!!t,o=n.persist===!1,d=e.dataset.bind,w=b[d];e.dataset.docked=r?"true":"false",e.classList.toggle("btfw-stack-item--docked",r);let y=e.querySelector(".btfw-stack-dock-btn");y&&(y.setAttribute("aria-pressed",r?"true":"false"),y.title=r?"Pinned to panels menu":"Dock to panels menu"),r?D(e)?ge(e):I===d&&(I=null):(ge(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!o&&w&&p(w,r),$e(),Le()}function Ke(e,t){var k;let n=b[t];if(!n)return;let r=e.querySelector(".btfw-stack-item__header"),o=r==null?void 0:r.querySelector(".btfw-stack-header-toolbar"),d=o==null?void 0:o.querySelector(".btfw-stack-arrows");if(!d||d.querySelector(".btfw-stack-dock-btn"))return;let w=i(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let y=document.createElement("button");y.type="button",y.className="btfw-arrow btfw-stack-dock-btn",y.textContent="\u2AF7",y.setAttribute("aria-label",`Dock ${((k=u[t])==null?void 0:k.title)||t} to panels menu`),y.setAttribute("aria-pressed",w?"true":"false"),y.title=w?"Pinned to panels menu":"Dock to panels menu",y.addEventListener("click",x=>{x.preventDefault(),x.stopPropagation(),e.dataset.docked!=="true"&&He(e,!0)}),d.insertBefore(y,d.firstChild)}function gt(){return m(f)}function vt(e){g(f,e)}function Et(){return m(a)}function xt(e){g(a,e)}function ut(e,t={}){let{storageKey:n,getDefaultOpen:r,toggleClass:o,ariaLabel:d="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:y="Show panel"}=t,k=m(n),x=typeof r=="function"?r(k):k!==null?k:!0;e.hasAttribute("data-open")||(e.dataset.open=x?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let j=e.querySelector(".btfw-stack-item__header"),ae=j&&j.querySelector(".btfw-stack-arrows");if(!ae||ae.querySelector(`.${o}`))return;let W=document.createElement("button");W.type="button",W.className=`btfw-arrow ${o}`,W.setAttribute("aria-label",d),W.style.display="flex",W.style.alignItems="center",W.style.justifyContent="center";let X=()=>{let fe=e.dataset.open!=="false";W.textContent=fe?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",W.title=fe?w:y,W.setAttribute("aria-expanded",fe?"true":"false"),e.classList.toggle("is-open",fe)},q=(fe,Ae={})=>{let ne=!!fe,ve=Ae.persist===!1;ve&&(e._btfwSuppressPersist=!0),e.dataset.open=ne?"true":"false",X(),ve||g(n,ne),ve&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};W.addEventListener("click",fe=>{fe.preventDefault(),fe.stopPropagation(),q(e.dataset.open==="false")}),X(),new MutationObserver(fe=>{for(let Ae of fe)Ae.type==="attributes"&&(X(),e._btfwSuppressPersist||g(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),ae.insertBefore(W,ae.firstChild),e._btfwSetOpenState=q,Ke(e,e.dataset.bind)}function Ie(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function ze(e){ue();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let r=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(r){let o=r.querySelector(".btfw-group-body");o&&!o.contains(t)&&o.appendChild(t)}else{let o=O.find(d=>d.id==="motd-group");if(!o)return;r=M(o,[t]),r&&(n.appendChild(r),B(n))}ft(r)}function ft(e){let t=document.getElementById("motdwrap");if(!t)return;let n=v();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let r=A();r&&r.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let r=m(V),o=Ce(r,!0);e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}}function je(e){he&&clearTimeout(he),he=setTimeout(()=>{he=null,ze(e)},50)}function mt(e){let t=A();t&&(oe||(oe=!0,new MutationObserver(()=>{je(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function pt(e){Ee||!window.socket||!window.socket.on||(Ee=!0,window.socket.on("setMotd",()=>{je(e)}))}function Xe(e){let t=le(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let r=ue(!0),o=(r==null?void 0:r.motd)||A();o&&typeof e=="string"&&(o.innerHTML=e);let d=document.getElementById("cs-motdtext");d&&typeof e=="string"&&(d.value=e),t&&je(t)}function We(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,r=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||r==="video")return;Ie(),Ue();let o=e&&e.list;if(!o)return;let d=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!d){let k=O.find(x=>x.id==="poll-group");if(!k)return;d=M(k,[t]),d&&(o.appendChild(d),B(o));return}let w=d.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&y.contains(t)&&w&&w.appendChild(t)}function Qe(e,t={}){We(e),Be();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Ne(e,t={}){J&&clearTimeout(J),J=setTimeout(()=>{J=null,Qe(e,t)},50)}function bt(e){if(ee)return;let t=document.getElementById("pollwrap");if(!t)return;ee=!0,new MutationObserver(()=>{Ne(e,{forceOpen:Pe()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let r=document.getElementById("newpollbtn");r&&!r.dataset.btfwPollSync&&(r.dataset.btfwPollSync="1",r.addEventListener("click",()=>{Ne(e,{forceOpen:!0})}))}function ht(e){te||!window.socket||!window.socket.on||(te=!0,window.socket.on("newPoll",()=>Ne(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Ne(e)))}function Je(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||document.querySelector("footer");n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function Ze(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let r=n.querySelector(".btfw-stack-header-actions");if(!r){r=document.createElement("span"),r.className="btfw-stack-header-actions";let o=n.querySelector(".btfw-stack-header-toolbar"),d=(o==null?void 0:o.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");o&&d?o.insertBefore(r,d):d?n.insertBefore(r,d):n.appendChild(r)}return r}function et(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Be(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Pe();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function tt(){let e=Ze("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){et(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let o=document.querySelector("#pollwrap > .poll-controls");o&&o.children.length===0&&o.remove()}let n=Ze("motd-group"),r=document.getElementById("btfw-motd-editbtn");if(n&&r){et(r,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),r.parentElement!==n&&n.appendChild(r);let o=r.closest(".btfw-motd-editrow");o&&o.parentElement&&o.remove()}}function Ue(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(r=>{let o=t.querySelector(".poll-controls");o||(o=document.createElement("div"),o.className="poll-controls",t.insertBefore(o,t.firstChild)),r.parentElement!==o&&o.appendChild(r)}),e.children.length===0&&e.remove())}function yt(e){return O.every(t=>t.selectors.some(r=>{var d,w;if(Y.includes(r))return!1;let o=document.querySelector(r);if(!o||e.contains(o)||o.contains(e))return!1;if(r==="#pollwrap"){let y=(d=o.dataset)==null?void 0:d.btfwPollOverlay,k=(w=o.getAttribute)==null?void 0:w.call(o,"data-btfw-poll-overlay");if(y==="video"||k==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function Oe(e){if(!pe){pe=!0;try{let t=e.list,n=e.footer;if(yt(t)&&t.children.length>0){ze(e),We(e),Be(),tt(),Je(n);return}Ue(),Ie();let r=new Map;O.forEach(w=>{let y=[];w.selectors.forEach(k=>{let x=document.querySelector(k);if(x&&!(t.contains(x)||x.contains(t))&&!Y.includes(k)){if(k==="#pollwrap"){let j=x.dataset&&x.dataset.btfwPollOverlay,ae=x.getAttribute&&x.getAttribute("data-btfw-poll-overlay");if(j==="video"||ae==="video")return}y.push(x)}}),y.length>0&&r.set(w.id,{group:w,elements:y})});let o=z(),d=[];r.forEach(({group:w,elements:y},k)=>{if(!Array.from(t.children).find(j=>j.dataset.bind===k))try{let j=M(w,y);j&&d.push({item:j,id:k,priority:w.priority,isGroup:!0})}catch(j){console.warn("[stack] Failed to create group item:",k,j)}}),o.length>0?d.sort((w,y)=>{let k=o.findIndex(j=>j.id===w.id),x=o.findIndex(j=>j.id===y.id);return k>=0&&x>=0?k-x:k>=0?-1:x>=0?1:w.priority-y.priority}):d.sort((w,y)=>w.priority-y.priority),d.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(y){console.warn("[stack] Failed to add item to list:",y)}}),B(t),ze(e),We(e),Be(),tt(),Je(n)}finally{pe=!1}}}function nt(){let e=le();if(!e||(Oe(e),mt(e),pt(e),bt(e),ht(e),Se))return;Se=!0;let t=new MutationObserver(()=>{we||(we=requestAnimationFrame(()=>{we=null,Oe(e)}))}),n=document.getElementById("btfw-leftpad"),r=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),r&&t.observe(r,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&be(w,V,x=>Ce(x,v()));let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&be(y,f,x=>x!==null?!!x:!0);let k=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');k&&be(k,a,x=>Ce(x,Pe())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(x=>{let j=b[x.dataset.bind];j&&He(x,i(j),{persist:!1})}),ke(),c(),$e(),Qe(e),Le()},1e3);let o=0,d=setInterval(()=>{Oe(e),++o>2&&clearInterval(d)},700)}return document.addEventListener("btfw:layoutReady",nt),document.addEventListener("btfw:chat:barsReady",()=>{ke(),c(),$e()}),setTimeout(nt,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=le();e&&setTimeout(()=>Oe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Xe(t)}),{name:"feature:stack",hasMotdContent:v,resolveMotdHost:A,normalizeMotdStructure:ue,applyMotdUpdate:Xe}});BTFW.define("feature:videoOverlay",[],async()=>{let $=(s,c=document)=>c.querySelector(s),P=["#mediarefresh","#voteskip","#fullscreenbtn"],L={localSubs:"btfw:video:localsubs"},h=5,V={owner:["chanowner","owner","founder","admin","administrator"]};function f(){var s;try{return((s=window.PLAYER)==null?void 0:s.mediaType)||null}catch(c){return null}}function a(){let s=(f()||"").toLowerCase();return s==="fi"||s==="gd"}function b(){try{return window.CLIENT||window.client||null}catch(s){return null}}function S(){try{return window.CHANNEL||window.channel||null}catch(s){return null}}function u(){let s=S();if(s&&typeof s.perms=="object"&&s.perms)return s.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(c){return{}}}function E(s=[]){let c=u();for(let T of s){let C=c==null?void 0:c[T];if(typeof C=="number")return C}}function H(){let s=E(V.owner);return typeof s=="number"?s:h}function R(s){if(!s)return!1;try{if(typeof s.hasPermission=="function"&&s.hasPermission("chanowner"))return!0}catch(c){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(c){}return!1}function I(){let s=b();if(!s)return!1;let c=Number(s.rank);return Number.isFinite(c)?!!(c>=H()||R(s)):!1}let K=()=>{try{return localStorage.getItem(L.localSubs)!=="0"}catch(s){return!0}},U=s=>{try{localStorage.setItem(L.localSubs,s?"1":"0")}catch(c){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!s}}))},Q=0,F=0,N=0,J=2e3,ee=8e3,te=45e3,he=12e4,oe=ee,Ee=!1,pe=null;function we(){if($("#btfw-vo-css"))return;let s=document.createElement("style");s.id="btfw-vo-css",s.textContent=`
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
    `,document.head.appendChild(s)}function Se(s){let c=$("#videowrap");!c||!s||((s.parentElement!==c.parentElement||s.previousElementSibling!==c)&&c.insertAdjacentElement("afterend",s),s.classList.add("btfw-vo-visible"))}function de(){if(!$("#videowrap"))return null;let c=$("#btfw-video-overlay");c||(c=document.createElement("div"),c.id="btfw-video-overlay",c.setAttribute("data-testid","btfw-video-overlay")),c.classList.add("btfw-video-overlay"),c.getAttribute("data-testid")||c.setAttribute("data-testid","btfw-video-overlay"),Se(c);let T=c.querySelector("#btfw-vo-bar");T||(T=document.createElement("div"),T.className="btfw-vo-bar",T.id="btfw-vo-bar",c.appendChild(T));let C=A(c,T);return Le(C.left),l(C),M(C),v(c),c}function v(s){s&&s.querySelectorAll("button").forEach(c=>{c.classList.contains("btfw-vo-btn")||c.classList.add("btfw-vo-btn")})}function A(s,c){let T="btfw-vo-left",C="btfw-vo-right",Z=c.querySelector(`#${T}`);Z||(Z=document.createElement("div"),Z.id=T,Z.className="btfw-vo-section btfw-vo-section--left",c.insertBefore(Z,c.firstChild));let re=c.querySelector(`#${C}`);return re||(re=document.createElement("div"),re.id=C,re.className="btfw-vo-section btfw-vo-section--right",c.appendChild(re)),Array.from(c.children).forEach(ye=>{ye===Z||ye===re||re.appendChild(ye)}),s.dataset.leftSection=`#${T}`,s.dataset.rightSection=`#${C}`,c.dataset.leftSection=`#${T}`,c.dataset.rightSection=`#${C}`,{left:Z,right:re}}function O(){return document.querySelector("#ytapiplayer video, video")}function Y(s=O()){return s?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof s.webkitShowPlaybackTargetPicker=="function":!1}function ie(){if(!pe)return;let s=pe._btfwAirplayHandler;if(s){try{pe.removeEventListener("webkitplaybacktargetavailabilitychanged",s)}catch(c){}delete pe._btfwAirplayHandler}pe=null}function se(s){if(!s||typeof s.addEventListener!="function"){ie();return}if(pe===s)return;ie();let c=T=>{let C=!T||T.availability==="available",Z=$("#btfw-airplay");Z&&(Z.style.display=C?"":"none")};try{s.addEventListener("webkitplaybacktargetavailabilitychanged",c),s._btfwAirplayHandler=c,pe=s}catch(T){}}function le(){let s=$("#btfw-airplay");if(!s)return;let c=O();if(!Y(c)){s.style.display="none",ie();return}s.style.display="",se(c)}function ue(s,c){c&&c.classList.add("btfw-vo-visible")}function l(s){if(!(s!=null&&s.right)||!(s!=null&&s.left))return;let c=[];document.querySelector("#fullscreenbtn")||c.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:m,section:"right"}),c.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:p,section:"right"}),c.forEach(T=>{let C=document.querySelector(`#${T.id}`),Z=T.section==="left"?s.left:s.right;C?Z&&C.parentElement!==Z&&Z.appendChild(C):(C=document.createElement("button"),C.id=T.id,C.className="btfw-vo-btn",C.innerHTML=`<i class="${T.icon}"></i>`,C.title=T.tooltip,C.addEventListener("click",T.action),(Z||s.right).appendChild(C))}),le()}function M(s){let c=s==null?void 0:s.right;c&&P.forEach(T=>{let C=document.querySelector(T);if(!C)return;if(C.dataset.btfwOverlay==="1"){C.parentElement!==c&&c.appendChild(C);return}let Z=document.createElement("span");Z.hidden=!0,Z.setAttribute("data-btfw-ph",T);try{C.insertAdjacentElement("afterend",Z)}catch(re){}if(C.classList.add("btfw-vo-adopted"),C.dataset.btfwOverlay="1",C.id==="mediarefresh"){let re=C.onclick;C.onclick=ye=>{ye.preventDefault();let _e=!!(ye&&ye.isTrusted);z(()=>{if(typeof re=="function")try{return re.call(C,ye),!0}catch(xe){console.warn("[video-overlay] native refresh handler failed:",xe)}return!1},{isUserAction:_e})}}c.appendChild(C)})}function B(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(s){console.warn("[video-overlay] Media refresh failed:",s)}return!1}function z(s,c={}){let{isUserAction:T=!1}=c,C=Date.now();if(N&&C-N>he&&(oe=ee,Q=0),C<F){let xe=Math.ceil((F-C)/1e3);return _(T?`Refresh available in ${xe}s`:`Auto refresh paused. Next attempt in ${xe}s`,"warning"),!1}let Z=T?J:oe;if(N&&C-N<Z){let xe=Z-(C-N),Me=Math.ceil(xe/1e3);return F=C+xe,_(T?`Refresh available in ${Me}s`:`Auto refresh paused. Next attempt in ${Me}s`,"warning"),!1}if(Q++,Q>=10)return F=C+3e4,Q=0,_("Refresh limit reached. 30s cooldown active.","error"),!1;let re=T?6e3:Math.max(12e3,oe+2e3);setTimeout(()=>{Q>0&&Q--},re);let ye=!1;if(typeof s=="function")try{ye=s()===!0}catch(xe){console.warn("[video-overlay] Refresh handler error:",xe)}return ye||(ye=B()),N=Date.now(),T?oe=ee:oe=Math.min(te,Math.max(ee,Math.round(oe*(ye?1.25:1.5)))),F=Math.max(F,N+(T?J:oe)),!T&&ye?_(`Auto refresh sent. Next attempt in ${Math.ceil(oe/1e3)}s`,"info"):_(ye?"Media refreshed":"Unable to refresh media",ye?"success":"error"),ye}function m(){let s=$("#videowrap");s&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen())}function g(s,c=!0){if(!s||!Y(s))return!1;if(s.setAttribute("airplay","allow"),s.setAttribute("x-webkit-airplay","allow"),c&&typeof s.webkitShowPlaybackTargetPicker=="function")try{s.webkitShowPlaybackTargetPicker()}catch(T){console.warn("[video-overlay] AirPlay picker failed:",T)}return le(),!0}function i(){if(!(Ee||!window.socket)){Ee=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let s=O();s&&(g(s,!1),se(s)),le()},1e3)})}catch(s){console.warn("[video-overlay] Failed to attach AirPlay listener:",s)}}}function p(){let s=O();return Y(s)?g(s)?(_("AirPlay enabled","success"),i(),!0):(_("AirPlay not available","warning"),!1):(le(),_("AirPlay not available","warning"),!1)}function _(s,c="info"){let T=document.getElementById("btfw-notification");T||(T=document.createElement("div"),T.id="btfw-notification",T.className="btfw-notification",document.body.appendChild(T)),T.textContent=s,T.className=`btfw-notification btfw-notification--${c} btfw-notification--show`,clearTimeout(T._hideTimer),T._hideTimer=setTimeout(()=>{T.classList.remove("btfw-notification--show")},3e3)}function D(){return $("video")}function ce(s){let c=(s||"").replace(/\r\n/g,`
`).trim()+`
`;return c=c.replace(/^\d+\s*$\n/gm,""),c=c.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),c=c.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+c}async function G(){let s=D();if(!s){be("Local subs only for HTML5 sources.");return}let c=document.createElement("input");c.type="file",c.accept=".vtt,.srt,text/vtt,text/plain",c.style.display="none",document.body.appendChild(c);let T=new Promise(C=>{c.addEventListener("change",async()=>{let Z=c.files&&c.files[0];if(document.body.removeChild(c),!Z)return C(!1);try{let re=await Z.text(),_e=(Z.name.split(".").pop()||"").toLowerCase()==="srt"?ce(re):re.startsWith("WEBVTT")?re:`WEBVTT

`+re,xe=URL.createObjectURL(new Blob([_e],{type:"text/vtt"}));ge(s,xe,Z.name.replace(/\.[^.]+$/,"")||"Local"),be("Subtitles loaded."),C(!0)}catch(re){console.error(re),be("Failed to load subtitles."),C(!1)}},{once:!0})});c.click(),await T}function ge(s,c,T){var Z;(Z=$('track[data-btfw="1"]',s))==null||Z.remove();let C=document.createElement("track");C.kind="subtitles",C.label=T||"Local",C.srclang="en",C.src=c,C.default=!0,C.setAttribute("data-btfw","1"),s.appendChild(C);try{for(let re of s.textTracks)re.mode=re.label===C.label?"showing":"disabled"}catch(re){}}function be(s){let c=$("#btfw-mini-toast");c||(c=document.createElement("div"),c.id="btfw-mini-toast",document.body.appendChild(c)),c.textContent=s,c.style.opacity="1",clearTimeout(c._hid),c._hid=setTimeout(()=>c.style.opacity="0",1400)}function Le(s){if(!s)return;let c=document.querySelector("#btfw-vo-subs");c||(c=document.createElement("button"),c.id="btfw-vo-subs",c.className="btfw-vo-btn",c.title="Load local subtitles (.vtt/.srt)",c.innerHTML='<i class="fa fa-closed-captioning"></i>',c.addEventListener("click",C=>{C.preventDefault(),G()}),s.insertBefore(c,s.firstChild||null));let T=K()&&a();c.style.display=T?"":"none"}function ke(){we(),de();let s=[$("#videowrap"),$("#rightcontrols"),$("#leftcontrols"),document.body].filter(Boolean),c=new MutationObserver(()=>de());s.forEach(T=>c.observe(T,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>de());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>de(),0)})}catch(T){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ke):ke(),{name:"feature:videoOverlay",setLocalSubsEnabled:U,toggleFullscreen:m,enableAirplay:p}});(function(){"use strict";let h="https://vidprox.billtube.workers.dev/?url=";function V(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function f(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var b,S,u;let a=typeof window!="undefined"&&(((b=window.BTFW_CONFIG)==null?void 0:b.corsVideoProxy)||((u=(S=window.BTFW_CONFIG)==null?void 0:S.integrations)==null?void 0:u.corsVideoProxy));if(typeof a=="string"&&a.trim()){let E=a.trim();if(E.includes("?"))return E;let H=E.endsWith("/")?"":"/";return`${E}${H}?url=`}return h},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(a){try{return new URL(h).origin.toLowerCase()}catch(b){return""}}},_isTrusted(a){if(!a)return!1;if(String(a).includes(this.CORS_PROXY))return!0;try{let b=new URL(a).origin.toLowerCase(),S=this._getCorsProxyOrigin();return!!(S&&b===S)}catch(b){return!1}},_markInternalSrcSet(){this._lastInternalSrcSetAt=f()},_isInsideInternalWindow(){return f()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let a=this._getMediaElement();return a?a.crossOrigin==="anonymous"||a.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var a;if(this._hasAnonymousCrossOrigin())return!1;try{return(a=this.player)==null||a.crossOrigin("anonymous"),!0}catch(b){return!1}},_same(a,b){return String(a||"")===String(b||"")},_getMediaElement(){var S;let a=(S=this.player)==null?void 0:S.tech_;if(a){try{let u=typeof a.el=="function"?a.el():null;if(u instanceof HTMLMediaElement&&u.isConnected)return u}catch(u){}if(a.el_ instanceof HTMLMediaElement&&a.el_.isConnected)return a.el_}let b=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return b instanceof HTMLMediaElement&&b.isConnected?b:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(a){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(a){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(a){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(a){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(a){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(a){}this.mergerNode=null}},resetMediaBinding(){var b,S;this.disconnectChain();let a=this._getMediaElement();if(a&&this._syncFromRegistry(a)){((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((S=this.audioContext)==null?void 0:S.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(a){var R;let b=(R=this.player)==null?void 0:R.tech_;if(!(b!=null&&b.el_)||b.el_!==a)return null;let S=a.parentNode;if(!S)return null;let u=a.tagName.toLowerCase()==="audio"?"audio":"video",E=document.createElement(u);E.className=a.className,a.id&&(E.id=a.id),E.setAttribute("playsinline",""),E.setAttribute("webkit-playsinline",""),E.classList.contains("vjs-tech")||E.classList.add("vjs-tech");let H=a.crossOrigin||a.getAttribute("crossorigin");return H&&(E.crossOrigin=H,E.setAttribute("crossorigin",H)),S.replaceChild(E,a),b.el_=E,delete a.__btfwSourceNode,E},_syncFromRegistry(a){let b=V().get(a)||a.__btfwSourceNode||null;return b?(V().set(a,b),this.sourceNode=b,this._sourceMediaElement=a,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b):null},_getOrCreateSourceNode(a){var E;let b=V(),S=b.get(a)||a.__btfwSourceNode||null;if(S)return b.set(a,S),this.sourceNode=S,this._sourceMediaElement=a,S.context&&S.context.state!=="closed"&&(this.audioContext=S.context),S;if(this.sourceNode&&this._sourceMediaElement===a)return b.set(a,this.sourceNode),a.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new(window.AudioContext||window.webkitAudioContext));let u;try{u=this.audioContext.createMediaElementSource(a)}catch(H){if((H==null?void 0:H.name)!=="InvalidStateError")throw H;let R=this._syncFromRegistry(a);if(R)return R;let I=this._swapVideoTechElement(a);if(!I)throw H;let K=(E=this.player)==null?void 0:E.currentSrc();if(K&&this.player){this._markInternalSrcSet(),this.player.src({src:K,type:"video/mp4"});try{this.player.load()}catch(U){}}return this._getOrCreateSourceNode(I)}return b.set(a,u),a.__btfwSourceNode=u,this.sourceNode=u,this._sourceMediaElement=a,u},cleanup(){this.disconnectChain();let a=this._getMediaElement();if(a&&(a.disableRemotePlayback=!1),a&&(this.sourceNode||V().get(a)||a.__btfwSourceNode)){this._swapVideoTechElement(a),V().delete(a);try{delete a.__btfwSourceNode}catch(b){}}this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{}),this.stopWatchdog()},_restorePlayerSrc(a,{currentTime:b=0,wasPlaying:S=!1,clearCrossOrigin:u=!1}={}){if(!this.player||!a)return Promise.resolve(!1);try{this.player.pause()}catch(E){}if(u)try{this.player.crossOrigin(null)}catch(E){}this._markInternalSrcSet(),this.player.src({src:a,type:"video/mp4"});try{this.player.load()}catch(E){}return new Promise(E=>{let H=!1,R=()=>{if(H)return;H=!0;try{this.player.off("canplay",I)}catch(U){}try{this.player.off("loadeddata",I)}catch(U){}try{this.player.currentTime(b)}catch(U){}let K=S?this.player.play():Promise.resolve();Promise.resolve(K).catch(()=>{}).finally(()=>E(!0))},I=()=>R();try{this.player.one("canplay",I)}catch(K){try{this.player.on("canplay",I)}catch(U){}}try{this.player.one("loadeddata",I)}catch(K){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&R()}catch(K){}}),setTimeout(R,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let a=this._getMediaElement();if(a&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(a,{attributes:!0,attributeFilter:["src","crossorigin"]});let b=new MutationObserver(()=>{this._checkAndReapply("sources")});b.observe(a,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=b}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,S])=>{this.player.on(b,S)})}catch(b){}}this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800),this._lastKnownSrc=this.player.currentSrc()},stopWatchdog(){var a;if(this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(b){}try{(a=this._mutationObserver._sourceObserver)==null||a.disconnect()}catch(b){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,S])=>{this.player.off(b,S)})}catch(b){}this._watchdogPlayerHandlers=null}},_checkAndReapply(a){if(!this.player)return;let b=this.player.currentSrc();if(!b||(this._lastKnownSrc=b,this._isInsideInternalWindow()))return;if(b.includes(this.CORS_PROXY)){this.isProxied=!0,this.proxiedSrc=b;return}if(this._isTrusted(b)){this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin(),this.isProxied=!1,this.originalSrc=b;return}if(this._shouldForceProxy()){if(f()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=f(),this._forceProxyPreservingState(b)}},async _forceProxyPreservingState(a){if(!this.player)return!1;let b=this.player.currentTime(),S=!this.player.paused();this.originalSrc=a,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(a);try{this.player.pause()}catch(u){}try{this.player.crossOrigin("anonymous")}catch(u){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(u){}return new Promise(u=>{let E=!1,H=()=>{if(!E){E=!0;try{this.player.off("canplay",R)}catch(I){}try{this.player.off("loadeddata",R)}catch(I){}try{this.player.currentTime(b)}catch(I){}this.isProxied=!0,S&&this.player.play().catch(()=>{}),u(!0)}},R=()=>H();try{this.player.one("canplay",R)}catch(I){try{this.player.on("canplay",R)}catch(K){}}try{this.player.one("loadeddata",R)}catch(I){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&H()}catch(I){}}),setTimeout(H,5e3)})},async ensureProxy(){if(!this.player)return!1;let a=this.player.currentSrc();if(!a)return!1;if(a.includes(this.CORS_PROXY))return this.isProxied=!0,this.proxiedSrc=a,!0;try{let b=new URL(a);if(this._isTrusted(a)){if(this.originalSrc=a,this.isProxied=!1,this._hasAnonymousCrossOrigin())return!0;let S=this.player.currentTime(),u=!this.player.paused();try{this.player.pause()}catch(E){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:a,type:"video/mp4"});try{this.player.load()}catch(E){}return new Promise(E=>{this.player.ready(()=>{try{this.player.currentTime(S)}catch(H){}u&&this.player.play().catch(()=>{}),E(!0)})})}}catch(b){console.warn("[BTFW_AUDIO] Invalid URL:",b)}return await this._forceProxyPreservingState(a),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var b;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if((this.boostEnabled||this.normalizationEnabled||this.monoEnabled)&&(!this.isProxied&&!this._isTrusted(this.player.currentSrc())?await this.ensureProxy():this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin()),!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let a=this._getMediaElement();if(!a)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((b=this.audioContext)==null?void 0:b.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),a.disableRemotePlayback=!0;let u=this._getOrCreateSourceNode(a);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let E=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(E.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(E.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(E.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(E.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(E.release,this.audioContext.currentTime),u.connect(this.compressorNode),u=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),u.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),u=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,u.connect(this.gainNode),u=this.gainNode),u.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(S){return console.error("[BTFW_AUDIO] Error building audio chain:",S),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){var E,H,R,I;if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let K=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),K}let a=((H=(E=this.player)==null?void 0:E.currentTime)==null?void 0:H.call(E))||0,b=this.player?!this.player.paused():!1,S=!!(this.originalSrc&&this.isProxied),u=S?this.originalSrc:((I=(R=this.player)==null?void 0:R.currentSrc)==null?void 0:I.call(R))||null;return this.cleanup(),u&&(await this._restorePlayerSrc(u,{currentTime:a,wasPlaying:b,clearCrossOrigin:S}),S&&(this.isProxied=!1)),!0},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(a){return this.NORM_PRESETS[a]?(this.currentNormPreset=a,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(a){return this.BOOST_MULTIPLIER=a,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){var E,H,R,I;if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let K=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),K}let a=((H=(E=this.player)==null?void 0:E.currentTime)==null?void 0:H.call(E))||0,b=this.player?!this.player.paused():!1,S=!!(this.originalSrc&&this.isProxied),u=S?this.originalSrc:((I=(R=this.player)==null?void 0:R.currentSrc)==null?void 0:I.call(R))||null;return this.cleanup(),u&&(await this._restorePlayerSrc(u,{currentTime:a,wasPlaying:b,clearCrossOrigin:S}),S&&(this.isProxied=!1)),!0},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){var E,H,R,I;if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let K=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),K}let a=((H=(E=this.player)==null?void 0:E.currentTime)==null?void 0:H.call(E))||0,b=this.player?!this.player.paused():!1,S=!!(this.originalSrc&&this.isProxied),u=S?this.originalSrc:((I=(R=this.player)==null?void 0:R.currentSrc)==null?void 0:I.call(R))||null;return this.cleanup(),u&&(await this._restorePlayerSrc(u,{currentTime:a,wasPlaying:b,clearCrossOrigin:S}),S&&(this.isProxied=!1)),!0}}})();(function(){"use strict";function $(P){window.BTFW&&typeof BTFW.define=="function"?P():setTimeout(()=>$(P),0)}$(function(){BTFW.define("feature:audio",[],async()=>{let P=(m,g=document)=>g.querySelector(m),L=window.BTFW_AUDIO,h=null,V=null,f=null,a=!1,b=!1,S=!1,u=null,E=null,H=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function R(m){h&&(m?(h.classList.add("active"),h.style.background="rgba(46, 213, 115, 0.3)",h.style.borderColor="#2ed573",h.style.color="#2ed573",h.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(h.classList.remove("active"),h.style.background="",h.style.borderColor="",h.style.color="",h.style.boxShadow=""))}function I(m,g="info"){let i=P("#btfw-audioboost-toast");i||(i=document.createElement("div"),i.id="btfw-audioboost-toast",i.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${g==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=g==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function K(){if(await L.enableBoost()){a=!0;let g=Math.round(L.BOOST_MULTIPLIER*100);I(`Boosted by ${g}%`,"success"),R(!0)}else{let g=L._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";I(g,"error")}}async function U(){await L.disableBoost(),a=!1,R(!1)}function Q(m){V&&(m?(V.classList.add("active"),V.style.background="rgba(52, 152, 219, 0.3)",V.style.borderColor="#3498db",V.style.color="#3498db",V.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(V.classList.remove("active"),V.style.background="",V.style.borderColor="",V.style.color="",V.style.boxShadow=""))}function F(m,g="info"){let i=P("#btfw-audionorm-toast");i||(i=document.createElement("div"),i.id="btfw-audionorm-toast",i.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${g==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=g==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function N(){if(await L.enableNormalization())b=!0,F("Normalization enabled","success"),Q(!0);else{let g=L._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";F(g,"error")}}async function J(){await L.disableNormalization(),b=!1,Q(!1)}function ee(m){f&&(m?(f.classList.add("active"),f.style.background="rgba(155, 89, 182, 0.3)",f.style.borderColor="#9b59b6",f.style.color="#9b59b6",f.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(f.classList.remove("active"),f.style.background="",f.style.borderColor="",f.style.color="",f.style.boxShadow=""))}function te(m,g="info"){let i=P("#btfw-mono-toast");i||(i=document.createElement("div"),i.id="btfw-mono-toast",i.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${g==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=g==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function he(){if(await L.enableMono())S=!0,te("Stereo audio enabled","success"),ee(!0);else{let g=L._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";te(g,"error")}}async function oe(){await L.disableMono(),S=!1,ee(!1)}function Ee(){let m=document.createElement("button");m.id="btfw-vo-audioboost",m.className="btn btn-sm btn-default btfw-vo-adopted";let g=Math.round(L.BOOST_MULTIPLIER*100);return m.title=`Toggle Audio Boost (${g}%)`,m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-megaphone"></i>',m.addEventListener("click",()=>{L.boostEnabled?U():K()}),m.addEventListener("mouseenter",()=>de()),m.addEventListener("mouseleave",()=>{setTimeout(()=>{!(u!=null&&u.matches(":hover"))&&!m.matches(":hover")&&v()},100)}),m}function pe(){let m=document.createElement("button");m.id="btfw-vo-audionorm",m.className="btn btn-sm btn-default btfw-vo-adopted";let g=L.NORM_PRESETS[L.currentNormPreset].label;return m.title=`Toggle Audio Normalization (${g})`,m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-waveform-lines"></i>',m.addEventListener("click",()=>{L.normalizationEnabled?J():N()}),m.addEventListener("mouseenter",()=>Y()),m.addEventListener("mouseleave",()=>{setTimeout(()=>{!(E!=null&&E.matches(":hover"))&&!m.matches(":hover")&&ie()},100)}),m}function we(){let m=document.createElement("button");return m.id="btfw-vo-mono",m.className="btn btn-sm btn-default btfw-vo-adopted",m.title="Toggle Mono Audio (mix both channels to stereo)",m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-headphones"></i>',m.addEventListener("click",()=>{L.monoEnabled?oe():he()}),m}function Se(){if(u)return u;let m=document.createElement("div");return m.id="btfw-boost-context-menu",m.style.cssText=`
          position: absolute;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(109, 77, 246, 0.3);
          border-radius: 8px;
          padding: 6px;
          display: none;
          z-index: 10000;
          min-width: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `,H.forEach(g=>{let i=document.createElement("button");i.className="btfw-context-item",i.textContent=g.label,i.style.cssText=`
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
          `,L.BOOST_MULTIPLIER===g.multiplier&&(i.style.background="rgba(46, 213, 115, 0.2)",i.style.color="#2ed573"),i.addEventListener("mouseenter",()=>{L.BOOST_MULTIPLIER!==g.multiplier&&(i.style.background="rgba(109, 77, 246, 0.2)")}),i.addEventListener("mouseleave",()=>{L.BOOST_MULTIPLIER!==g.multiplier&&(i.style.background="transparent")}),i.addEventListener("click",async()=>{if(await L.setBoostMultiplier(g.multiplier),A(),h){let p=Math.round(g.multiplier*100);h.title=`Toggle Audio Boost (${p}%)`}L.boostEnabled&&I(`Boost set to ${g.label}`,"success")}),m.appendChild(i)}),m.addEventListener("mouseleave",()=>{setTimeout(()=>{h!=null&&h.matches(":hover")||v()},100)}),document.body.appendChild(m),u=m,m}function de(){if(!h)return;let m=Se(),g=h.getBoundingClientRect();m.style.left=g.left+"px",m.style.top=g.bottom+5+"px",m.style.display="block"}function v(){u&&(u.style.display="none")}function A(){if(!u)return;u.querySelectorAll(".btfw-context-item").forEach((g,i)=>{let p=H[i];L.BOOST_MULTIPLIER===p.multiplier?(g.style.background="rgba(46, 213, 115, 0.2)",g.style.color="#2ed573"):(g.style.background="transparent",g.style.color="#e0e0e0")})}function O(){if(E)return E;let m=document.createElement("div");return m.id="btfw-norm-context-menu",m.style.cssText=`
          position: absolute;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 152, 219, 0.3);
          border-radius: 8px;
          padding: 6px;
          display: none;
          z-index: 10000;
          min-width: 110px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `,Object.keys(L.NORM_PRESETS).forEach(g=>{let i=L.NORM_PRESETS[g],p=document.createElement("button");p.className="btfw-context-item",p.textContent=i.label,p.style.cssText=`
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
          `,L.currentNormPreset===g&&(p.style.background="rgba(52, 152, 219, 0.2)",p.style.color="#3498db"),p.addEventListener("mouseenter",()=>{L.currentNormPreset!==g&&(p.style.background="rgba(109, 77, 246, 0.2)")}),p.addEventListener("mouseleave",()=>{L.currentNormPreset!==g&&(p.style.background="transparent")}),p.addEventListener("click",async()=>{await L.setNormPreset(g),se(),V&&(V.title=`Toggle Audio Normalization (${i.label})`),L.normalizationEnabled&&F(`Preset: ${i.label}`,"success")}),m.appendChild(p)}),m.addEventListener("mouseleave",()=>{setTimeout(()=>{V!=null&&V.matches(":hover")||ie()},100)}),document.body.appendChild(m),E=m,m}function Y(){if(!V)return;let m=O(),g=V.getBoundingClientRect();m.style.left=g.left+"px",m.style.top=g.bottom+5+"px",m.style.display="block"}function ie(){E&&(E.style.display="none")}function se(){if(!E)return;let m=E.querySelectorAll(".btfw-context-item");Object.keys(L.NORM_PRESETS).forEach((g,i)=>{let p=m[i];L.currentNormPreset===g?(p.style.background="rgba(52, 152, 219, 0.2)",p.style.color="#3498db"):(p.style.background="transparent",p.style.color="#e0e0e0")})}function le(){let m=P("#btfw-vo-left");if(!m)return!1;let g=P("#btfw-vo-audioboost");g&&g.remove();let i=P("#btfw-vo-audionorm");i&&i.remove();let p=P("#btfw-vo-mono");return p&&p.remove(),h=Ee(),V=pe(),f=we(),m.appendChild(h),m.appendChild(V),m.appendChild(f),!0}function ue(m,g=20){let i=0,p=setInterval(()=>{i++,le()?(clearInterval(p),m()):i>=g&&clearInterval(p)},500)}function l(){if(typeof videojs=="undefined"){setTimeout(l,500);return}if(!P("#ytapiplayer")){setTimeout(l,500);return}L.player=videojs("ytapiplayer"),L.originalSrc=L.player.currentSrc(),L.startWatchdog()}function M(){setTimeout(()=>{L.resetMediaBinding(),L.boostEnabled=!1,L.normalizationEnabled=!1,L.monoEnabled=!1,L.isProxied=!1,R(!1),Q(!1),ee(!1),l(),a&&setTimeout(()=>{K()},1200),b&&setTimeout(()=>{N()},1200),S&&setTimeout(()=>{he()},1200)},600)}function B(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>L._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>L._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",M))}function z(){ue(()=>{l()}),B()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",z):z(),{name:"feature:audio",activate:K,deactivate:U,isActive:()=>L.boostEnabled,activateNormalization:N,deactivateNormalization:J,isNormalizationActive:()=>L.normalizationEnabled,activateMono:he,deactivateMono:oe,isMonoActive:()=>L.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async P=>P.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:$})=>{let P=await $("util:tmdb-proxy"),L="movie-info",h={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},V="btfw-movie-info-style",f={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},a=0,b=!1,S=null;function u(i){typeof i=="function"&&f.cleanup.push(i)}function E(){for(;f.cleanup.length;){let i=f.cleanup.pop();try{i()}catch(p){}}f.header&&(f.header.remove(),f.header=null)}function H(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null),f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null),a=0,f.currentTitle="",f.isInitialized=!1,E()}function R(i){if(typeof i=="boolean")return i;if(typeof i=="number")return Number.isFinite(i)?i>0:!1;if(typeof i=="string"){let p=i.trim().toLowerCase();return p?p==="1"||p==="true"||p==="yes"||p==="on":!1}return!1}function I(){let i=[()=>{var p,_,D;return(D=(_=(p=window.BTFW_THEME_ADMIN)==null?void 0:p.integrations)==null?void 0:_.movieInfo)==null?void 0:D.enabled},()=>{var p,_,D;return(D=(_=(p=window.BTFW_CONFIG)==null?void 0:p.integrations)==null?void 0:_.movieInfo)==null?void 0:D.enabled},()=>{var p,_;return(_=(p=window.BTFW_CONFIG)==null?void 0:p.movieInfo)==null?void 0:_.enabled},()=>{var p;return(p=window.BTFW_CONFIG)==null?void 0:p.movieInfoEnabled},()=>{var p,_;return(_=(p=document==null?void 0:document.body)==null?void 0:p.dataset)==null?void 0:_.btfwMovieInfoEnabled}];for(let p of i)try{let _=typeof p=="function"?p():p;if(R(_))return!0}catch(_){}return!1}function K(){if(S||typeof MutationObserver!="function")return;let i=document.body;i&&(S=new MutationObserver(()=>N()),S.observe(i,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function U(){if(b)return;b=!0;let i=()=>N();document.addEventListener("btfw:channelIntegrationsChanged",i),document.addEventListener("btfw:ready",i)}function Q(i=0){f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.initTimer=window.setTimeout(()=>{f.initTimer=null,I()&&F()},Math.max(0,i))}function F(){if(f.isInitialized)return;let i=document.querySelector(h.TOPBAR_SELECTOR);if(!i){Q(500);return}try{J(i),m(),te(),f.isInitialized=!0,setTimeout(()=>{v(),A()},120)}catch(p){Q(800)}}function N(){I()?f.isInitialized?(v(),setTimeout(A,80)):Q(0):H()}function J(i){if(!i&&(i=document.querySelector(h.TOPBAR_SELECTOR),!i))throw new Error("Chat topbar not found");let p=document.getElementById(h.CONTAINER_ID);p&&p.remove();let _=document.createElement("div");_.id=h.CONTAINER_ID,_.className="btfw-movie-header hide",_.dataset.module=L,i.insertAdjacentElement("afterend",_),f.header=_}function ee(){try{return window.socket||window.SOCKET||null}catch(i){return null}}function te(){he(),pe();let i=z(v,250);window.addEventListener("resize",i),u(()=>window.removeEventListener("resize",i))}function he(){oe(),Ee()}function oe(){let i=document.querySelector(h.TITLE_SELECTOR);if(i){let p=()=>Se(),_=()=>de();i.addEventListener("mouseenter",p),i.addEventListener("mouseleave",_),u(()=>{i.removeEventListener("mouseenter",p),i.removeEventListener("mouseleave",_)})}else if(typeof MutationObserver=="function"){let p=new MutationObserver(()=>{document.querySelector(h.TITLE_SELECTOR)&&(p.disconnect(),oe())});p.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),u(()=>{try{p.disconnect()}catch(_){}})}}function Ee(){let i=f.header;if(!i)return;let p=()=>we(),_=()=>de();i.addEventListener("mouseenter",p),i.addEventListener("mouseleave",_),u(()=>{i.removeEventListener("mouseenter",p),i.removeEventListener("mouseleave",_)})}function pe(){let i=ee();if(i&&typeof i.on=="function"){i.on("changeMedia",A),u(()=>{var D,ce;try{(D=i.off)==null||D.call(i,"changeMedia",A)}catch(G){try{(ce=i.removeListener)==null||ce.call(i,"changeMedia",A)}catch(ge){}}});return}let p=0,_=()=>{if(!I()){f.socketRetryTimer=null;return}let D=ee();if(D&&typeof D.on=="function"){D.on("changeMedia",A),u(()=>{var ce,G;try{(ce=D.off)==null||ce.call(D,"changeMedia",A)}catch(ge){try{(G=D.removeListener)==null||G.call(D,"changeMedia",A)}catch(be){}}}),f.socketRetryTimer=null;return}if(p+=1,p>10){f.socketRetryTimer=null;return}f.socketRetryTimer=window.setTimeout(_,1e3)};f.socketRetryTimer=window.setTimeout(_,1200),u(()=>{f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null)})}function we(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null)}function Se(){we(),f.header&&(f.header.classList.remove("hide"),f.header.classList.add("show"))}function de(){we(),f.hideTimer=window.setTimeout(()=>{f.header&&(f.header.classList.remove("show"),f.header.classList.add("hide"),setTimeout(()=>{f.header&&f.header.classList.contains("hide")&&f.header.classList.remove("hide")},320))},300)}function v(){if(!f.header)return;let i=window.innerWidth<=768;f.header.classList.toggle("btfw-mobile",i)}async function A(){var ce;if(!f.isInitialized)return;let i=document.querySelector(h.TITLE_SELECTOR),p=f.header;if(!i||!p)return;let _=((ce=i.textContent)==null?void 0:ce.trim())||"";if(!_){f.currentTitle="",le();return}if(_===f.currentTitle)return;f.currentTitle=_;let D=++a;ie();try{let G=await Y(_);if(D!==a)return;l(G)}catch(G){if(D!==a)return;P.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),se()}}function O(i){let p=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],_=i;return p.forEach(D=>{let ce=new RegExp(`\\b${D}\\b`,"gi");_=_.replace(ce,"")}),_.replace(/\s{2,}/g," ").trim()}async function Y(i){var ge;if(!P.isAvailable())throw new Error(P.MISSING_PROXY_MSG);let p=i.match(/(.+)\s*\((\d{4})\)/),_=p?p[1].trim():i,D=p?p[2]:"";D||(p=i.match(/(.+?)\s+(\d{4})\s*$/),p&&(_=p[1].trim(),D=p[2]));let ce=O(_),G=await P.tmdbFetch("search/movie",{query:ce,year:D});if(((ge=G==null?void 0:G.results)==null?void 0:ge.length)>0){let be=G.results[0];return{title:i,backdrop:be.backdrop_path?`https://image.tmdb.org/t/p/w1280${be.backdrop_path}`:null,poster:be.poster_path?`https://image.tmdb.org/t/p/w500${be.poster_path}`:null,summary:be.overview||"",rating:be.vote_average||0,releaseDate:be.release_date||"",voteCount:be.vote_count||0}}return{title:i,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ie(){f.header&&(ue(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-loading">
          <i class="fa fa-spinner fa-spin"></i>
          <p>Loading movie information...</p>
        </div>
      </div>
    `)}function se(){f.header&&(ue(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-error">
          <i class="fa fa-exclamation-triangle"></i>
          <p>Unable to fetch movie information</p>
          <small>Check TMDB API key in Theme Settings</small>
        </div>
      </div>
    `)}function le(){f.header&&(ue(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <p>No movie information available</p>
      </div>
    `)}function ue(){f.header&&(f.header.style.backgroundImage="",f.header.style.backgroundColor="")}function l(i){if(!f.header)return;f.header.innerHTML="",h.ENABLE_BACKDROP&&i.backdrop?(f.header.style.backgroundImage=`url(${i.backdrop})`,f.header.style.backgroundSize="cover",f.header.style.backgroundPosition="center"):ue();let p=document.createElement("div");p.className="btfw-movie-overlay",f.header.appendChild(p);let _=document.createElement("div");if(_.className="btfw-movie-content",f.header.appendChild(_),i.poster){let G=document.createElement("img");G.src=i.poster,G.alt=`${i.title} Poster`,G.className="btfw-movie-poster",_.appendChild(G)}let D=document.createElement("div");D.className="btfw-movie-details",_.appendChild(D);let ce=document.createElement("h2");if(ce.textContent=i.title,ce.className="btfw-movie-title",D.appendChild(ce),h.SHOW_SUMMARY&&i.summary){let G=document.createElement("p");G.textContent=i.summary,G.className="btfw-movie-summary",D.appendChild(G)}if(h.ENABLE_RATING&&i.rating>0){let G=M(i.rating,i.voteCount);_.appendChild(G)}}function M(i,p){let _=document.createElement("div");_.className="btfw-movie-rating";let D=Math.round(i*10),ce=B(D),G="http://www.w3.org/2000/svg",ge=document.createElementNS(G,"svg");ge.setAttribute("width","60"),ge.setAttribute("height","60"),ge.setAttribute("viewBox","0 0 60 60");let be=25,Le=2*Math.PI*be,ke=Le-i/10*Le,s=document.createElementNS(G,"circle");s.setAttribute("cx","30"),s.setAttribute("cy","30"),s.setAttribute("r",be.toString()),s.setAttribute("stroke","#2a2a2a"),s.setAttribute("stroke-width","4"),s.setAttribute("fill","#1a1a1a"),ge.appendChild(s);let c=document.createElementNS(G,"circle");c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r",be.toString()),c.setAttribute("stroke",ce),c.setAttribute("stroke-width","3"),c.setAttribute("fill","none"),c.setAttribute("stroke-dasharray",Le.toString()),c.setAttribute("stroke-dashoffset",ke.toString()),c.setAttribute("transform","rotate(-90 30 30)"),c.setAttribute("stroke-linecap","round"),ge.appendChild(c);let T=document.createElementNS(G,"text");if(T.setAttribute("x","50%"),T.setAttribute("y","50%"),T.setAttribute("text-anchor","middle"),T.setAttribute("dominant-baseline","central"),T.setAttribute("fill","#fff"),T.setAttribute("font-size","10"),T.setAttribute("font-weight","bold"),T.textContent=`${D}%`,ge.appendChild(T),_.appendChild(ge),p>0){let C=document.createElement("div");C.className="btfw-movie-votes",C.textContent=`${p.toLocaleString()} votes`,_.appendChild(C)}return _}function B(i){let p=Math.max(0,Math.min(i,100));return p>=70?"#4caf50":p>=50?"#ff9800":"#f44336"}function z(i,p){let _=null;return function(...ce){_&&clearTimeout(_),_=setTimeout(()=>{_=null,i(...ce)},p)}}function m(){if(document.getElementById(V))return;let i=`
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
      ${h.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,p=document.createElement("style");p.id=V,p.textContent=i,document.head.appendChild(p)}function g(){K(),U(),N()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):g(),{name:"feature:movie-info",refresh:N,cleanup:H}});BTFW.define("feature:monkeyPaw",[],async()=>{let $="btfw-monkey-paw-styles",P="btfw-monkey-paw-overlay",L="/assets/monkey-paw/paw.svg",h={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},V={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},f={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},a=null,b=null;function S(F){return new Promise(N=>setTimeout(N,F))}function u(){try{let F=typeof window!="undefined"?window.BTFW:null;return F&&(F.BASE||F.DEV_CDN)||""}catch(F){return""}}function E(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(F){return!1}}function H(){if(typeof document=="undefined"||document.getElementById($))return;let F=document.createElement("style");F.id=$,F.textContent=`
      #${P} {
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

      #${P}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${P}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${P}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${P} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${P} .btfw-monkey-paw-title {
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

      #${P} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${P} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${P} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${P} .f-tip {
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

      #${P} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${P} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${P} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${P} .f-root,
        #${P} .f-tip,
        #${P} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(F)}async function R(){if(a)return a;let N=`${u()}${L}`,J=await fetch(N,{credentials:"omit"});if(!J.ok)throw new Error(`Monkey paw SVG failed to load (${J.status})`);return a=await J.text(),a}function I(F){Object.entries(f).forEach(([N,J])=>{let ee=F.querySelector(`#${N}`),te=F.querySelector(`#${N}-tip`);ee&&(ee.style.transform=J.root),te&&(te.style.transform=J.tip)})}function K(F){Object.entries(h).forEach(([N,J])=>{window.setTimeout(()=>{let ee=F.querySelector(`#${N}`),te=F.querySelector(`#${N}-tip`);ee&&(ee.style.transform=J.root),te&&window.setTimeout(()=>{te.style.transform=J.tip},120)},V[N])})}function U(F){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${F}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function Q(F={}){if(b)return b;if(typeof document!="undefined")return b=(async()=>{var he,oe;if(H(),E()){await S((he=F.reducedMotionMs)!=null?he:450);return}let N=document.getElementById(P);N||(N=document.createElement("div"),N.id=P,document.body.appendChild(N));let J;try{J=await R()}catch(Ee){console.warn("[monkey-paw] SVG load failed:",Ee),await S(300);return}N.innerHTML=U(J),I(N);let ee=N.querySelector("#paw"),te=N.querySelector("#btfw-monkey-paw-msg");N.classList.remove("is-cursed"),te==null||te.classList.remove("is-visible"),requestAnimationFrame(()=>N.classList.add("is-active")),K(N),await S(980),ee==null||ee.classList.add("btfw-monkey-paw-shaking"),await S(720),ee==null||ee.classList.remove("btfw-monkey-paw-shaking"),N.classList.add("is-cursed"),te==null||te.classList.add("is-visible"),await S((oe=F.holdMs)!=null?oe:1100),N.classList.remove("is-active"),await S(320),N.remove()})().finally(()=>{b=null}),b}return{name:"feature:monkeyPaw",play:Q}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:$})=>{let P=await $("util:tmdb-proxy"),L=await $("feature:monkeyPaw"),h=(l,M=document)=>M.querySelector(l),V=(l,M=document)=>Array.from(M.querySelectorAll(l)),f=null,a=null,b=null,S=null,u={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},E=null,H=null,R="[movie-suggestion]";function I(...l){console.log(R,...l)}function K(...l){console.error(R,...l)}function U(l){var M;try{if((M=window.socket)!=null&&M.emit)return window.socket.emit("chatMsg",{msg:l}),!0}catch(B){}return!1}async function Q(l,M={}){return P.workerFetch(l,M)}function F(){if(document.getElementById("btfw-movie-suggest-styles"))return;let l=document.createElement("style");l.id="btfw-movie-suggest-styles",l.textContent=`
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
    `,document.head.appendChild(l)}let N=(CLIENT==null?void 0:CLIENT.rank)||0;function J(){let l=h("a[href*='donate'], #donate-btn, .donate-btn");if(l){let B=l.closest("ul");if(B)return{ul:B,insertAfter:l.parentElement}}let M=h("#btfw-theme-btn-nav");if(M){let B=M.closest("ul");if(B)return{ul:B,insertAfter:null}}return{ul:h(".navbar .nav.navbar-nav")||h(".navbar-nav")||h(".btfw-navbar ul")||h(".navbar ul"),insertAfter:null}}function ee(){if(h("#btfw-movie-suggest-btn"))return!0;let l=J();if(!l.ul)return!1;let M=document.createElement("li"),B=document.createElement("a");return B.href="javascript:void(0)",B.className="btfw-nav-pill",B.id="btfw-movie-suggest-btn",B.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,M.appendChild(B),l.insertAfter?l.insertAfter.after(M):l.ul.insertBefore(M,l.ul.firstChild),B.addEventListener("click",Y),!0}function te(){var z,m,g,i,p,_;if(h("#btfw-movie-suggest-modal"))return;let l=document.createElement("div");l.id="btfw-movie-suggest-modal",l.className="modal",l.innerHTML=`
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
                     placeholder="${N===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${N===0?"disabled":""}>
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
    `,document.body.appendChild(l);let M=h(".modal-background",l),B=h(".delete",l);if(M.addEventListener("click",ie),B.addEventListener("click",ie),(z=h("#btfw-movie-prev",l))==null||z.addEventListener("click",()=>{u.page>1&&(u.page-=1,de())}),(m=h("#btfw-movie-next",l))==null||m.addEventListener("click",()=>{u.page<u.totalPages&&(u.page+=1,de())}),N===0){let D=h("#btfw-movie-search",l);D.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),D.blur()})}else{let D,ce=h("#btfw-movie-search",l);ce.addEventListener("input",()=>{clearTimeout(D),u.query=ce.value.trim(),u.page=1,D=setTimeout(()=>de(),400)}),(g=h("#btfw-movie-sort",l))==null||g.addEventListener("change",G=>{u.sortBy=G.target.value,u.page=1,de()}),(i=h("#btfw-movie-genre",l))==null||i.addEventListener("change",G=>{u.genreId=G.target.value,u.page=1,de()}),(p=h("#btfw-movie-year",l))==null||p.addEventListener("change",G=>{u.year=G.target.value.trim(),u.page=1,de()}),(_=h("#btfw-movie-rating",l))==null||_.addEventListener("change",G=>{u.minRating=G.target.value.trim(),u.page=1,de()})}}function he(){if(h("#btfw-movie-confirm-modal"))return;let l=document.createElement("div");l.id="btfw-movie-confirm-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let M=h(".modal-background",l),B=h(".delete",l),z=h("#btfw-movie-cancel",l),m=h("#btfw-movie-confirm",l),g=()=>O();M.addEventListener("click",g),B.addEventListener("click",g),z.addEventListener("click",g),m.addEventListener("click",le)}async function oe(){if(E&&H)return;let[l,M]=await Promise.all([Q("/api/meta"),Q("/api/genres")]);E=l,H=M;let B=h("#btfw-movie-suggest-modal");if(!B)return;let z=h("#btfw-movie-sort",B);if(z&&z.options.length===0){for(let g of l.sortOptions||[]){let i=document.createElement("option");i.value=g.value,i.textContent=g.label,z.appendChild(i)}z.value=u.sortBy}let m=h("#btfw-movie-genre",B);if(m&&m.options.length<=1)for(let g of M.genres||[]){let i=document.createElement("option");i.value=String(g.id),i.textContent=g.name,m.appendChild(i)}}function Ee(){let l={page:u.page,sort_by:u.sortBy};return u.query?(l.query=u.query,u.year&&(l.primary_release_year=u.year,l.year=u.year)):(u.genreId&&(l.with_genres=u.genreId),u.year&&(l.primary_release_year=u.year),u.minRating&&(l["vote_average.gte"]=u.minRating)),l}function pe(l){return!l||l==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${l}`}function we(){let l=h("#btfw-movie-suggest-modal");if(!l)return;let M=h("#btfw-movie-prev",l),B=h("#btfw-movie-next",l),z=h("#btfw-movie-page-label",l);z&&(z.textContent=`Page ${u.page} of ${u.totalPages}`),M&&(M.disabled=u.page<=1||u.loading),B&&(B.disabled=u.page>=u.totalPages||u.loading)}function Se(l){let M=h("#btfw-movie-suggest-modal");if(!M)return;let B=h(".btfw-movie-results",M);if(!l.length){B.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}B.innerHTML=l.map(z=>`
      <div class="movie-result"
           data-id="${z.id}"
           data-title="${z.title}"
           data-poster="${z.posterPath||""}"
           data-year="${z.releaseYear||""}">
        <div class="movie-result__poster">
          <img src="${pe(z.posterPath)}" alt="${z.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${z.title}</div>
          <small style="opacity:0.7;">${z.releaseYear||"N/A"}</small>
        </div>
      </div>
    `).join(""),V(".movie-result",B).forEach(z=>{z.addEventListener("click",()=>{f=z.dataset.id,a=z.dataset.title,b=z.dataset.poster,S=z.dataset.year||null;let m=h("#btfw-movie-confirm-modal");if(!m)return;let g=S?` (${S})`:"";h("#btfw-confirm-movie-title",m).textContent=`${a}${g}`,A()})})}async function de(){let l=h("#btfw-movie-suggest-modal");if(!l||u.loading)return;u.loading=!0,we();let M=h(".btfw-movie-results",l);M.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await oe();let B=await Q("/api/search",{params:Ee()});u.totalPages=Math.max(1,B.totalPages||1),Se(B.results||[]),I("runSearch",{page:u.page,totalPages:u.totalPages,count:(B.results||[]).length})}catch(B){K("runSearch failed:",B),M.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{u.loading=!1,we()}}async function v(){let l=h("#btfw-movie-history");if(l){l.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let B=(await Q("/api/history",{params:{page:1,limit:10}})).results||[];if(!B.length){l.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}l.innerHTML=B.map(z=>{let m=z.releaseYear?` (${z.releaseYear})`:"";return`
          <div class="history-item">
            <img src="${pe(z.posterPath).replace("w154","w92")}" alt="${z.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${z.movieTitle}${m}</div>
              <div class="history-item__meta">Requested by ${z.username}</div>
            </div>
          </div>
        `}).join("")}catch(M){K("loadHistory failed:",M),l.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function A(){let l=h("#btfw-movie-suggest-modal"),M=h("#btfw-movie-confirm-modal");M&&(l&&l.classList.add("btfw-movie-suggest-pending"),M.classList.add("is-active"))}function O(){let l=h("#btfw-movie-suggest-modal"),M=h("#btfw-movie-confirm-modal");l&&l.classList.remove("btfw-movie-suggest-pending"),M&&M.classList.remove("is-active")}async function Y(){let l=h("#btfw-movie-suggest-modal");if(l){I("openModal",{userRank:N}),l.classList.remove("btfw-movie-suggest-pending"),l.classList.add("is-active");try{await oe(),await Promise.all([de(),v()])}catch(M){K("openModal bootstrap failed:",M)}}}function ie(){let l=h("#btfw-movie-suggest-modal");l&&(O(),I("closeModal"),l.classList.remove("is-active"),h("#btfw-movie-search",l).value="",h(".btfw-movie-results",l).innerHTML="",u.query="",u.page=1,u.totalPages=1,f=null,a=null,b=null,S=null)}function se(l,M,B){let z=B?` (${B})`:"";return`\u{1F3AC} Movie request: ${M}${z} \u2014 suggested by ${l}`}async function le(){if(!f||!a)return;let l=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";I("confirmSuggestion",{movieId:f,movieTitle:a}),O();try{await L.play(),await Q("/api/suggestions",{method:"POST",body:{movieId:Number(f),movieTitle:a,username:l,posterPath:b||null,releaseYear:S||null}}),U(se(l,a,S)),await v(),ie()}catch(M){K("confirmSuggestion failed:",M),alert("Could not save your movie request. Please try again.")}}function ue(){I("boot: start",{workerBase:P.getWorkerBase()}),F(),te(),he();let l=0,M=50,B=()=>{if(ee()){I("Button added successfully");return}l+=1,l<M?setTimeout(B,100):console.warn(R,"Failed to add button after retries",{retryCount:l})};B()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ue,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ue,200)}):setTimeout(ue,200),{name:"ext:movie-suggestion",open:Y,close:ie,getWorkerBase:P.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async $=>$.init("ext:movie-suggestion"));})();
