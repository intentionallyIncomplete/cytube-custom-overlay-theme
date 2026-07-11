/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let U="#videowrap .video-js",P="vjs-default-skin",L="vjs-theme-city",h="vjs-big-play-centered",j=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),f={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},s="btfw-videojs-base-css",b="btfw-videojs-city-css",k=["https://vjs.zencdn.net/7.20.3/video-js.css"],p=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function M(g,C){let N=document;if(!N||!N.head||N.getElementById(g))return;let F=N.createElement("link");F.id=g,F.rel="stylesheet";let ee=Array.isArray(C)?C.slice():[C],ie=()=>{if(!ee.length)return!1;let ue=ee.shift();return ue?(F.href=ue,!0):ie()};F.addEventListener("error",()=>{ie()||F.remove()}),ie()&&N.head.appendChild(F)}function Z(){if(typeof window=="undefined"||!document.body)return!1;let g=document.createElement("div");g.className=`video-js ${P}`,g.style.position="absolute",g.style.opacity="0",g.style.pointerEvents="none",g.style.width="1px",g.style.height="1px",document.body.appendChild(g);let C=window.getComputedStyle(g).fontSize;return g.remove(),C&&Math.abs(parseFloat(C)-10)<.2}function ce(){Z()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||M(s,k)}function Y(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||M(b,p)}function de(g){if(!g)return null;try{return g.player||g.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(g.id)||window.videojs&&window.videojs.players&&window.videojs.players[g.id]}catch(C){return null}}function W(g){let C=de(g);if(!C)return;let N=typeof C.getChild=="function"?C.getChild("controlBar"):null,F=N&&typeof N.getChild=="function"?N.getChild("volumePanel"):null;if(F){g.classList.add("btfw-volume-inline");try{typeof F.inline=="function"&&F.inline(!0)}catch(ee){}}}function G(){ce(),Y(),document.querySelectorAll(U).forEach(g=>{g.classList.contains(P)&&g.classList.remove(P),Array.from(g.classList).forEach(C=>{C.startsWith("vjs-theme-")&&C!==L&&g.classList.remove(C)}),g.classList.contains(L)||g.classList.add(L),g.classList.contains(h)||g.classList.add(h),W(g)})}function q(){var C;if(typeof window=="undefined")return;let g=(C=window.BTFW)==null?void 0:C.channelPosterUrl;g&&document.querySelectorAll(U).forEach(N=>{N.poster!==g&&(N.poster=g);try{let F=N.player||N.player_||window.videojs&&window.videojs.players&&window.videojs.players[N.id];F&&typeof F.poster=="function"&&F.poster(g)}catch(F){let ee=N.querySelector(".vjs-poster");ee&&(ee.style.backgroundImage=`url("${g}")`)}})}function I(){var N;if(typeof window=="undefined")return;let g=(N=window.PLAYER)==null?void 0:N.mediaType;document.querySelectorAll(".vjs-poster").forEach(F=>{g==="yt"||g==="dm"||g==="vi"||g==="tw"?F.classList.add("hidden"):F.classList.remove("hidden")})}function K(){document.querySelectorAll(j).forEach(C=>{C instanceof HTMLVideoElement&&(typeof C.playsInline=="boolean"&&(C.playsInline=!0),Object.entries(f).forEach(([N,F])=>{try{C.setAttribute(N,F)}catch(ee){}}))})}function Q(){if(typeof window=="undefined")return!1;let g=window.videojs;if(!g)return!1;let C=g.dom||g;if(!C||typeof C.textContent!="function")return!1;if(C.textContent&&C.textContent._btfwOptimized)return!0;let N=C.textContent.bind(C),F=function(ie,ue){if(!ie)return ie;let pe;try{typeof ie.textContent!="undefined"?pe=ie.textContent:typeof ie.innerText!="undefined"&&(pe=ie.innerText)}catch(l){pe=void 0}if(pe!==void 0){let l=ue==null?"":String(ue);if(pe===l)return ie}return N(ie,ue)};return F._btfwOptimized=!0,F._btfwOriginal=N,C.textContent=F,!0}function J(){if(Q()){J._tries=0;return}J._tries>20||(J._tries=(J._tries||0)+1,setTimeout(J,250))}let be="_btfwGuarded";function oe(g){if(!g)return!1;let C=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!g.closest(C)}function ve(g){if(!g||g[be])return;g[be]=!0;let C=N=>{oe(N.target)||N.type==="click"&&N.button!==0||(N.preventDefault(),N.stopImmediatePropagation())};g.addEventListener("click",C,!0),g.addEventListener("pointerdown",N=>{oe(N.target)||(N.preventDefault(),N.stopImmediatePropagation())},!0),g.addEventListener("contextmenu",C,!0)}function me(){document.querySelectorAll(U).forEach(ve)}function we(){if(we._mo)return;let g=document.getElementById("videowrap")||document.body,C=new MutationObserver(N=>{var ee,ie,ue;let F=!1;for(let pe of N){for(let l of pe.addedNodes)if(l.nodeType===1&&((ee=l.classList)!=null&&ee.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME"||(ie=l.querySelector)!=null&&ie.call(l,U))){F=!0;break}for(let l of pe.removedNodes)if(l.nodeType===1&&((ue=l.classList)!=null&&ue.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME")){F=!0;break}}F&&(G(),me(),K(),q(),I(),document.querySelectorAll(U).forEach(W))});C.observe(g,{childList:!0,subtree:!0,characterData:!1}),we._mo=C}function Se(){setTimeout(()=>{K(),q(),I(),document.querySelectorAll(U).forEach(W)},100)}function ne(){if(G(),me(),K(),J(),q(),I(),we(),setInterval(()=>{I()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",Se),socket.on("changeMedia",Se)}catch(g){console.warn("[feature:player] Unable to bind changeMedia handler",g)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ne):ne(),document.addEventListener("btfw:layoutReady",()=>setTimeout(ne,0)),{name:"feature:player",applyCityTheme:G,attachGuards:me,ensureInlinePlayback:K,applyPosterUrl:q,togglePosterVisibility:I,shouldAllowClick:oe}});BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:U})=>{let P=await U("util:templates"),{stack:L}=P,h="btfw-stack-order",j="btfw-stack-motd-open",f="btfw-stack-playlist-open",s="btfw-stack-poll-open",b={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},k=b,p={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},M={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Z={"motd-group":1,"poll-group":2,"playlist-group":3},ce=!1,Y=null,de="",W=null,G=null,q=null,I={"motd-group":{storageKey:j,getDefaultOpen:e=>F(e,C()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:f,getDefaultOpen:e=>F(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:s,getDefaultOpen:e=>F(e,ne()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},K=null,Q=!1,J=!1,be=null,oe=!1,ve=!1,me=!1,we=null,Se=!1;function ne(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function g(e=""){let t=String(e||"").trim();if(!t)return!0;if(typeof document!="undefined"){let n=document.createElement("div");return n.innerHTML=t,!(n.textContent||"").replace(/\u00a0/g," ").trim()}return!t.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function C(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=N(e);return t?!g(t.innerHTML||""):!1}function N(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}function F(e,t){return e!=null?!!e:!!t}let ee=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],ie=["#main","#mainpage","#mainpane"],ue=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function pe(e,t,n){if(!e||!t||!n)return null;let r=ue.map(H=>{let V=document.getElementById(H.id);return V?{...H,el:V}:null}).filter(Boolean);if(!r.length){let H=document.getElementById("btfw-addmedia-panel");return H&&H.remove(),null}let o=document.getElementById("btfw-addmedia-panel");if(o||(o=document.createElement("section"),o.id="btfw-addmedia-panel",o.className="btfw-addmedia-panel",o.dataset.open="false",o.setAttribute("role","region"),o.setAttribute("aria-label","Add media controls"),o.setAttribute("aria-hidden","true"),o.setAttribute("hidden","hidden"),o.innerHTML=L.addMediaPanelHtml()),o.parentElement!==e){let H=t.parentElement===e?t.nextSibling:null;e.insertBefore(o,H)}let d=o.querySelector(".btfw-addmedia-tabs"),w=o.querySelector(".btfw-addmedia-views"),y=o.querySelector(".btfw-addmedia-close");if(!d||!w)return null;for(;d.firstChild;)d.removeChild(d.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);r.forEach(({id:H,title:V,el:O})=>{O.classList.remove("collapse","in","plcontrol-collapse"),O.style.removeProperty("display"),O.style.removeProperty("height"),O.removeAttribute("aria-expanded"),O.setAttribute("role","tabpanel"),O.setAttribute("data-btfw-addmedia","panel");let fe=document.createElement("button");fe.type="button",fe.className="btfw-addmedia-tab",fe.dataset.target=H,fe.textContent=V,fe.setAttribute("role","tab"),d.appendChild(fe);let le=document.createElement("div");le.className="btfw-addmedia-view",le.dataset.target=H,le.setAttribute("role","tabpanel"),le.setAttribute("aria-hidden","true"),le.appendChild(O),w.appendChild(le)});let S=r.find(H=>H.default)||r[0],E=H=>{let V=H||o.dataset.active||S.id;o.dataset.active=V,d.querySelectorAll(".btfw-addmedia-tab").forEach(O=>{let fe=O.dataset.target===V;O.classList.toggle("is-active",fe),O.setAttribute("aria-selected",fe?"true":"false"),O.setAttribute("tabindex",fe?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(O=>{let fe=O.dataset.target===V;O.classList.toggle("is-active",fe),O.setAttribute("aria-hidden",fe?"false":"true")})},$=H=>{let V=H!=null?!!H:o.dataset.open!=="true";return o.dataset.open=V?"true":"false",o.classList.toggle("is-open",V),o.setAttribute("aria-hidden",V?"false":"true"),V?(o.removeAttribute("hidden"),E(o.dataset.active||S.id)):o.setAttribute("hidden","hidden"),o.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:V}})),V};return o._btfwWired||(d.addEventListener("click",H=>{let V=H.target.closest(".btfw-addmedia-tab");V&&(H.preventDefault(),E(V.dataset.target))}),y&&y.addEventListener("click",()=>$(!1)),o._btfwWired=!0),E(o.dataset.active||S.id),o._btfwToggle=$,o._btfwSetActive=E,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:V,target:O})=>{let fe=document.getElementById(V);fe&&fe.dataset.btfwAddmedia!==O&&(fe.dataset.btfwAddmedia=O,fe.setAttribute("aria-controls","btfw-addmedia-panel"),fe.addEventListener("click",le=>{le.preventDefault(),le.stopPropagation(),E(O),$(!0),fe.blur()}))})})(),{panel:o,toggle:$,setActive:E}}function l(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),r=document.getElementById("btfw-video-overlay"),o=r&&n&&r.parentElement===n.parentElement?r:n;o&&o.parentElement?o.nextSibling?o.parentNode.insertBefore(t,o.nextSibling):o.parentNode.appendChild(t):e.appendChild(t);let d=document.createElement("div");d.className="btfw-stack-list",t.appendChild(d);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function A(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let d=t.querySelector(":scope > #motd");return d?{motdwrap:t,motd:d}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let r=[];t.querySelectorAll(".btfw-motd-editrow").forEach(d=>{let w=(d.textContent||"").trim();w&&r.push(`<p>${w}</p>`),d.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(d=>{d.contains(t)||d===t||((d.querySelector("#motd")||d.classList.contains("btfw-motd-editrow"))&&d.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&r.push(w.innerHTML)}),d.remove())});let o=t.querySelector(":scope > #motd");if(o||(o=document.createElement("div"),o.id="motd",t.appendChild(o)),t.querySelectorAll("#motd").forEach(d=>{d!==o&&((d.innerHTML||"").trim()&&r.push(d.innerHTML),d.remove())}),o.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(d=>{d.remove()}),o.querySelectorAll("#motd").forEach(d=>{(d.innerHTML||"").trim()&&r.push(d.innerHTML),d.remove()}),document.querySelectorAll("#togglemotd").forEach((d,w)=>{w!==0&&d.remove()}),r.length){let d=r.join("").trim();d&&g(o.innerHTML)?o.innerHTML=d:d&&(o.innerHTML+=d)}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:o}}function B(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),r=document.getElementById("playlistwrap"),o=document.getElementById("queuecontainer"),d=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),y=document.querySelectorAll(".btfw-controls-row"),S=d||r||o||w;if(!S)return;let E=e;E?E.classList.add("btfw-plbar"):(E=document.createElement("div"),E.id="btfw-plbar",E.className="btfw-plbar");let $=E.querySelector(".btfw-plbar__layout"),ae,H;if($)ae=$.querySelector(".btfw-plbar__primary")||$,H=$.querySelector(".btfw-plbar__aside")||$;else{for($=document.createElement("div"),$.className="btfw-plbar__layout",ae=document.createElement("div"),ae.className="btfw-plbar__primary",H=document.createElement("div"),H.className="btfw-plbar__aside",$.append(ae,H);E.firstChild;)ae.appendChild(E.firstChild);E.appendChild($);let te=ae.querySelector(".field.has-addons");te&&te.classList.add("btfw-plbar__search");let ge=ae.querySelector("#btfw-pl-count");ge&&(ge.classList.add("btfw-plbar__count"),H.appendChild(ge))}E.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(te=>te.remove());let V=E.querySelector(".btfw-plbar__actions");V||(V=document.createElement("div"),V.className="btfw-plbar__actions",(H||E).appendChild(V));let O=document.getElementById("btfw-addmedia-btn"),fe=te=>{if(te){if(te.classList.add("btfw-plbar__action-btn"),te.tagName==="BUTTON"||te.tagName==="A")te.classList.add("button","is-dark","is-small");else if(te.tagName==="INPUT"){let ge=(te.type||"").toLowerCase();ge==="button"||ge==="submit"||ge==="reset"?te.classList.add("button","is-dark","is-small"):te.classList.remove("button","is-dark","is-small")}}};E.parentElement!==S&&S.insertBefore(E,S.firstChild);let le=pe(S,E,V);le?!O||!document.body.contains(O)?(O=document.createElement("button"),O.id="btfw-addmedia-btn",O.type="button",O.className="button is-small",O.innerHTML=L.addMediaButtonHtml(),V.prepend(O)):V.contains(O)||V.prepend(O):O&&(O.parentElement&&O.parentElement.removeChild(O),O=null);let Ae=te=>{if(!te)return;Array.from(te.children||[]).forEach(ke=>{ke&&(ke.classList.add("btfw-plbar__control"),V.appendChild(ke))})};if(n&&(Ae(n),n.remove()),t&&(Ae(t),t.remove()),V.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(fe),le&&O){O.classList.remove("is-dark"),O.classList.add("is-primary"),O.dataset.iconified||(O.innerHTML=L.addMediaButtonHtml(),O.dataset.iconified="1"),O.setAttribute("aria-controls","btfw-addmedia-panel");let te=ke=>{O.setAttribute("aria-expanded",ke?"true":"false")};O.dataset.btfwBound||(O.dataset.btfwBound="1",O.addEventListener("click",ke=>{ke.preventDefault();let tt=document.getElementById("btfw-addmedia-panel"),nt=tt&&tt._btfwToggle,wt=typeof nt=="function"?nt():!1;te(wt)}));let ge=le.panel||document.getElementById("btfw-addmedia-panel");ge&&(te(ge.dataset.open==="true"),ge._btfwButtonSync||(ge.addEventListener("btfw:addmedia:state",ke=>{te(!!(ke.detail&&ke.detail.open))}),ge._btfwButtonSync=!0))}y.forEach(te=>{te&&!S.contains(te)&&(te.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,te.remove(),S.appendChild(te),console.log("[stack] Moved floating controls row into playlist container"))}),S.contains(E)||S.insertBefore(E,S.firstChild),E.dataset.btfwMerged="1"}function R(e,t){if(e.id==="motd-group"&&(A(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Me(),B(),t=t.filter(y=>y&&y.id!=="rightcontrols"&&y.id!=="pollwrap").filter(y=>!y.querySelector||!y.querySelector("#pollwrap"))),e.id==="poll-group"&&(Me(),je(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(y=>y&&!n.contains(y)&&!y.contains(n)));let r=document.createElement("section");r.className="btfw-stack-item btfw-group-item",r.dataset.bind=e.id,r.dataset.group="true";let o=document.createElement("header");o.className="btfw-stack-item__header",o.innerHTML=L.stackGroupHeaderHtml(e.title);let d=document.createElement("div");d.className="btfw-stack-item__body btfw-group-body",t.forEach(y=>{if(y&&y.parentElement!==d&&!d.contains(y)&&!y.contains(d))try{d.appendChild(y)}catch(S){console.warn("[stack] Failed to move element:",y.id||y.className,S)}}),r.appendChild(o),r.appendChild(d);let w=I[e.id];return w&&ut(r,w),Ve(r,e.id),r.querySelector(".btfw-up").onclick=function(){let y=r.parentElement,S=r.previousElementSibling;S&&y.insertBefore(r,S),m(y)},r.querySelector(".btfw-down").onclick=function(){let y=r.parentElement,S=r.nextElementSibling;S?y.insertBefore(S,r):y.appendChild(r),m(y)},r}function m(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(h,JSON.stringify(t))}catch(t){}}function v(){try{return JSON.parse(localStorage.getItem(h)||"[]")}catch(e){return[]}}function i(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function u(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function x(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),r=localStorage.getItem(n);return r!==null?r==="true":!1}catch(t){return!1}}function D(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function se(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function z(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Ee(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&ne()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function ye(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Ie())}function _e(e){ye(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function Te(e,t,n){if(!e||z(e))return;let r=i(t),o=typeof n=="function"?n(r):r!==null?!!r:!0;e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}function a(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,r=document.getElementById("btfw-stack"),o=document.getElementById("btfw-leftpad"),d=document.getElementById("btfw-grid");r&&(r.classList.toggle("btfw-stack--all-hidden",n),r.classList.toggle("btfw-stack--all-docked",n)),o&&o.classList.toggle("btfw-leftpad--stack-hidden",n),d&&d.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function c(){var r;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let o=document.createElement("div");o.id="btfw-panel-bar",o.className="btfw-panel-bar",o.setAttribute("role","toolbar"),o.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(o)}let n=t.querySelector("#btfw-panel-bar");return xe(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),ce||(ct(),ce=!0),(r=document.getElementById("btfw-stack-drawer"))==null||r.remove(),t}function _(e){e.preventDefault(),e.stopPropagation(),lt()}function T(){let e=c();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=L.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",_),t.dataset.btfwPanelsWired="1"),t}function X(e){if(!e)return null;let t=Array.from(e.classList).find(r=>r.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let r=n(e).data("uid");if(r!=null&&r!=="")return r}return e.dataset.uid||null}function re(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),r=n==null?void 0:n.querySelector(".qbtn-play");return r?(r.click(),!0):!1}function he(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),r=document.getElementById("queue_next");if(n&&r&&(n.value=t,!r.disabled))return r.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let o=window.socket;if(o&&typeof parseMediaLink=="function")try{let d=parseMediaLink(t);if((d==null?void 0:d.id)!=null&&(d!=null&&d.type))return o.emit("queue",{id:d.id,type:d.type,pos:"next",temp:!1}),!0}catch(d){}return!1}function Ce(e){l();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(W&&(clearTimeout(W),W=null),Y=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),Le(),De(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function xe(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var d,w,y;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let S=n.dataset.panelGroup||((d=n.closest(".btfw-panel-btn"))==null?void 0:d.dataset.group);S&&Ce(S);return}let r=t.target.closest(".btfw-panel-playlist__play");if(r){t.preventDefault(),t.stopPropagation(),re(r.dataset.queueUid);return}let o=t.target.closest(".btfw-panel-playlist__add");if(o){t.preventDefault(),t.stopPropagation();let S=(w=o.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!S)return;let E=S.hidden;S.hidden=!E,o.setAttribute("aria-expanded",E?"true":"false"),E&&((y=S.querySelector(".btfw-panel-playlist__link-input"))==null||y.focus())}}),e.addEventListener("submit",t=>{var w,y,S,E;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let r=n.querySelector(".btfw-panel-playlist__link-input"),o=(w=r==null?void 0:r.value)==null?void 0:w.trim();if(!o||!he(o))return;r.value="",n.hidden=!0,(S=(y=n.closest(".btfw-panel-container"))==null?void 0:y.querySelector(".btfw-panel-playlist__add"))==null||S.setAttribute("aria-expanded","false");let d=(E=n.closest(".btfw-panel-container"))==null?void 0:E.querySelector(".btfw-panel-playlist__queue");d&&Be(d)}))}function Le(){if(G){try{G.disconnect()}catch(e){}G=null}q=null}function ot(e){if(!e||q===e)return;Le();let t=document.getElementById("queue");t&&(q=e,G=new MutationObserver(()=>{e.isConnected&&Y==="playlist-group"&&Be(e)}),G.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function it(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),r=n.findIndex(d=>d.classList.contains("queue_active")||d.classList.contains("playing")),o=r>=0?r+1:0;return n.slice(o,o+e)}function Be(e){if(!e)return;let t=it(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var S,E;let r=document.createElement("div");r.className="btfw-panel-playlist__item";let o=document.createElement("span");o.className="btfw-panel-playlist__title",o.textContent=(((S=n.querySelector(".qe_title"))==null?void 0:S.textContent)||"Untitled").trim();let d=document.createElement("span");d.className="btfw-panel-playlist__meta",d.textContent=(((E=n.querySelector(".qe_time"))==null?void 0:E.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let y=X(n);if(y!=null&&y!==""){let $=document.createElement("button");$.type="button",$.className="btfw-panel-playlist__play",$.textContent="Play",$.dataset.queueUid=String(y),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&($.disabled=!0),w.appendChild($)}r.append(o,d,w),e.appendChild(r)})}function We(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=L.panelUndockIconHtml(),n}function rt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=L.playlistAddFormHtml(),e}function at(e,t,n){let r=document.createElement("div");if(r.className="btfw-panel-container",n>0&&(r.style.bottom=`${-n*50}px`),e==="playlist-group"){r.classList.add("btfw-panel-container--playlist");let d=document.createElement("div");d.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let y=We(e,t);d.append(w,y);let S=rt(),E=document.createElement("div");return E.className="btfw-panel-container__host btfw-panel-playlist__queue",r.append(d,S,E),r}r.classList.add("btfw-panel-container--dock-only");let o=document.createElement("div");return o.className="btfw-panel-container__dock-only",o.appendChild(We(e,t)),r.appendChild(o),r}function Oe(){W&&(clearTimeout(W),W=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{_e(e)}),Le(),Y=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function qe(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||Oe()}function st(){qe(!1)}function lt(){c();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||qe(!e.classList.contains("open"))}function Ue(e){W&&clearTimeout(W),W=setTimeout(()=>{W=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),Y===e&&(Y=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function Re(e,t){if(t&&(W&&(clearTimeout(W),W=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),Y=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(Be(n),ot(n))}}function ct(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{Y&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),Oe()))}))}function Ye(e,t){var r;if(!((r=document.getElementById("btfw-panel-bar"))!=null&&r.classList.contains("open")))return;if(W&&(clearTimeout(W),W=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),Y===e&&(Y=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(o=>{o!==t&&delete o.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",Re(e,t)}function dt(e,t){let n=e.querySelector(".btfw-panel-container"),r=()=>{var o;(o=document.getElementById("btfw-panel-bar"))!=null&&o.classList.contains("open")&&(W&&(clearTimeout(W),W=null),Re(t,e))};e.addEventListener("mouseenter",r),e.addEventListener("focusin",r),e.addEventListener("click",o=>{o.target.closest(".btfw-panel-container")||(o.preventDefault(),o.stopPropagation(),Ye(t,e))}),e.addEventListener("keydown",o=>{o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),Ye(t,e))}),e.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(o.relatedTarget)||Ue(t))}),n==null||n.addEventListener("mouseenter",()=>{W&&(clearTimeout(W),W=null)}),n==null||n.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(o.relatedTarget)||Ue(t))})}function Fe(){let e=c();T();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((y,S)=>(Z[y.dataset.bind]||99)-(Z[S.dataset.bind]||99)),r=n.map(y=>y.dataset.bind).join("|"),o=document.getElementById("btfw-panels-menu-btn");if(o&&(o.hidden=n.length===0,n.length===0)){de="",st();return}if(r===de&&t.childElementCount===n.length)return;de=r;let d=t.classList.contains("open"),w=Y;if(Oe(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((y,S)=>{let E=y.dataset.bind,$=p[E]||{short:"?",title:E},ae=document.createElement("div");ae.className="btfw-panel-btn",ae.dataset.group=E,ae.title=$.title,ae.setAttribute("role","button"),ae.setAttribute("aria-label",$.title),ae.tabIndex=0;let H=document.createElement("span");H.className="btfw-panel-btn__label",H.textContent=M[E]||$.short,ae.appendChild(H),ae.appendChild(at(E,$,S)),t.appendChild(ae),dt(ae,E)}),d&&(qe(!0),w&&n.some(S=>S.dataset.bind===w))){let S=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);S&&Re(w,S)}}function De(e,t,n={}){if(!e)return;let r=!!t,o=n.persist===!1,d=e.dataset.bind,w=b[d];e.dataset.docked=r?"true":"false",e.classList.toggle("btfw-stack-item--docked",r);let y=e.querySelector(".btfw-stack-dock-btn");y&&(y.setAttribute("aria-pressed",r?"true":"false"),y.title=r?"Pinned to panels menu":"Dock to panels menu"),r?z(e)?_e(e):Y===d&&(Y=null):(_e(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!o&&w&&D(w,r),Fe(),a()}function Ve(e,t){var S;let n=b[t];if(!n)return;let r=e.querySelector(".btfw-stack-item__header"),o=r==null?void 0:r.querySelector(".btfw-stack-header-toolbar"),d=o==null?void 0:o.querySelector(".btfw-stack-arrows");if(!d||d.querySelector(".btfw-stack-dock-btn"))return;let w=x(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let y=document.createElement("button");y.type="button",y.className="btfw-arrow btfw-stack-dock-btn",y.textContent="\u2AF7",y.setAttribute("aria-label",`Dock ${((S=p[t])==null?void 0:S.title)||t} to panels menu`),y.setAttribute("aria-pressed",w?"true":"false"),y.title=w?"Pinned to panels menu":"Dock to panels menu",y.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),e.dataset.docked!=="true"&&De(e,!0)}),d.insertBefore(y,d.firstChild)}function gt(){return i(f)}function vt(e){u(f,e)}function Et(){return i(s)}function xt(e){u(s,e)}function ut(e,t={}){let{storageKey:n,getDefaultOpen:r,toggleClass:o,ariaLabel:d="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:y="Show panel"}=t,S=i(n),E=typeof r=="function"?r(S):S!==null?S:!0;e.hasAttribute("data-open")||(e.dataset.open=E?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let $=e.querySelector(".btfw-stack-item__header"),ae=$&&$.querySelector(".btfw-stack-arrows");if(!ae||ae.querySelector(`.${o}`))return;let H=document.createElement("button");H.type="button",H.className=`btfw-arrow ${o}`,H.setAttribute("aria-label",d),H.style.display="flex",H.style.alignItems="center",H.style.justifyContent="center";let V=()=>{let le=e.dataset.open!=="false";H.textContent=le?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",H.title=le?w:y,H.setAttribute("aria-expanded",le?"true":"false"),e.classList.toggle("is-open",le)},O=(le,Ae={})=>{let te=!!le,ge=Ae.persist===!1;ge&&(e._btfwSuppressPersist=!0),e.dataset.open=te?"true":"false",V(),ge||u(n,te),ge&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};H.addEventListener("click",le=>{le.preventDefault(),le.stopPropagation(),O(e.dataset.open==="false")}),V(),new MutationObserver(le=>{for(let Ae of le)Ae.type==="attributes"&&(V(),e._btfwSuppressPersist||u(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),ae.insertBefore(H,ae.firstChild),e._btfwSetOpenState=O,Ve(e,e.dataset.bind)}function Me(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function $e(e){A();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let r=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(r){let o=r.querySelector(".btfw-group-body");o&&!o.contains(t)&&o.appendChild(t)}else{let o=ee.find(d=>d.id==="motd-group");if(!o)return;r=R(o,[t]),r&&(n.appendChild(r),m(n))}ft(r)}function ft(e){let t=document.getElementById("motdwrap");if(!t)return;let n=C();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let r=N();r&&r.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let r=i(j),o=F(r,!0);e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}}function He(e){be&&clearTimeout(be),be=setTimeout(()=>{be=null,$e(e)},50)}function mt(e){let t=N();t&&(oe||(oe=!0,new MutationObserver(()=>{He(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function pt(e){ve||!window.socket||!window.socket.on||(ve=!0,window.socket.on("setMotd",()=>{He(e)}))}function Ge(e){let t=l(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let r=A(!0),o=(r==null?void 0:r.motd)||N();o&&typeof e=="string"&&(o.innerHTML=e);let d=document.getElementById("cs-motdtext");d&&typeof e=="string"&&(d.value=e),t&&He(t)}function ze(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,r=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||r==="video")return;Me(),je();let o=e&&e.list;if(!o)return;let d=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!d){let S=ee.find(E=>E.id==="poll-group");if(!S)return;d=R(S,[t]),d&&(o.appendChild(d),m(o));return}let w=d.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&y.contains(t)&&w&&w.appendChild(t)}function Ke(e,t={}){ze(e),Ie();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Pe(e,t={}){K&&clearTimeout(K),K=setTimeout(()=>{K=null,Ke(e,t)},50)}function bt(e){if(Q)return;let t=document.getElementById("pollwrap");if(!t)return;Q=!0,new MutationObserver(()=>{Pe(e,{forceOpen:ne()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let r=document.getElementById("newpollbtn");r&&!r.dataset.btfwPollSync&&(r.dataset.btfwPollSync="1",r.addEventListener("click",()=>{Pe(e,{forceOpen:!0})}))}function ht(e){J||!window.socket||!window.socket.on||(J=!0,window.socket.on("newPoll",()=>Pe(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Pe(e)))}function Xe(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||document.querySelector("footer");n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function Qe(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let r=n.querySelector(".btfw-stack-header-actions");if(!r){r=document.createElement("span"),r.className="btfw-stack-header-actions";let o=n.querySelector(".btfw-stack-header-toolbar"),d=(o==null?void 0:o.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");o&&d?o.insertBefore(r,d):d?n.insertBefore(r,d):n.appendChild(r)}return r}function Je(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Ie(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!ne();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function Ze(){let e=Qe("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){Je(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let o=document.querySelector("#pollwrap > .poll-controls");o&&o.children.length===0&&o.remove()}let n=Qe("motd-group"),r=document.getElementById("btfw-motd-editbtn");if(n&&r){Je(r,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),r.parentElement!==n&&n.appendChild(r);let o=r.closest(".btfw-motd-editrow");o&&o.parentElement&&o.remove()}}function je(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(r=>{let o=t.querySelector(".poll-controls");o||(o=document.createElement("div"),o.className="poll-controls",t.insertBefore(o,t.firstChild)),r.parentElement!==o&&o.appendChild(r)}),e.children.length===0&&e.remove())}function yt(e){return ee.every(t=>t.selectors.some(r=>{var d,w;if(ie.includes(r))return!1;let o=document.querySelector(r);if(!o||e.contains(o)||o.contains(e))return!1;if(r==="#pollwrap"){let y=(d=o.dataset)==null?void 0:d.btfwPollOverlay,S=(w=o.getAttribute)==null?void 0:w.call(o,"data-btfw-poll-overlay");if(y==="video"||S==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function Ne(e){if(!me){me=!0;try{let t=e.list,n=e.footer;if(yt(t)&&t.children.length>0){$e(e),ze(e),Ie(),Ze(),Xe(n);return}je(),Me();let r=new Map;ee.forEach(w=>{let y=[];w.selectors.forEach(S=>{let E=document.querySelector(S);if(E&&!(t.contains(E)||E.contains(t))&&!ie.includes(S)){if(S==="#pollwrap"){let $=E.dataset&&E.dataset.btfwPollOverlay,ae=E.getAttribute&&E.getAttribute("data-btfw-poll-overlay");if($==="video"||ae==="video")return}y.push(E)}}),y.length>0&&r.set(w.id,{group:w,elements:y})});let o=v(),d=[];r.forEach(({group:w,elements:y},S)=>{if(!Array.from(t.children).find($=>$.dataset.bind===S))try{let $=R(w,y);$&&d.push({item:$,id:S,priority:w.priority,isGroup:!0})}catch($){console.warn("[stack] Failed to create group item:",S,$)}}),o.length>0?d.sort((w,y)=>{let S=o.findIndex($=>$.id===w.id),E=o.findIndex($=>$.id===y.id);return S>=0&&E>=0?S-E:S>=0?-1:E>=0?1:w.priority-y.priority}):d.sort((w,y)=>w.priority-y.priority),d.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(y){console.warn("[stack] Failed to add item to list:",y)}}),m(t),$e(e),ze(e),Ie(),Ze(),Xe(n)}finally{me=!1}}}function et(){let e=l();if(!e||(Ne(e),mt(e),pt(e),bt(e),ht(e),Se))return;Se=!0;let t=new MutationObserver(()=>{we||(we=requestAnimationFrame(()=>{we=null,Ne(e)}))}),n=document.getElementById("btfw-leftpad"),r=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),r&&t.observe(r,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&Te(w,j,E=>F(E,C()));let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&Te(y,f,E=>E!==null?!!E:!0);let S=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');S&&Te(S,s,E=>F(E,ne())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(E=>{let $=b[E.dataset.bind];$&&De(E,x($),{persist:!1})}),c(),T(),Fe(),Ke(e),a()},1e3);let o=0,d=setInterval(()=>{Ne(e),++o>2&&clearInterval(d)},700)}return document.addEventListener("btfw:layoutReady",et),document.addEventListener("btfw:chat:barsReady",()=>{c(),T(),Fe()}),setTimeout(et,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=l();e&&setTimeout(()=>Ne(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Ge(t)}),{name:"feature:stack",hasMotdContent:C,resolveMotdHost:N,normalizeMotdStructure:A,applyMotdUpdate:Ge}});BTFW.define("feature:videoOverlay",[],async()=>{let U=(a,c=document)=>c.querySelector(a),P=["#mediarefresh","#voteskip","#fullscreenbtn"],L={localSubs:"btfw:video:localsubs"},h=5,j={owner:["chanowner","owner","founder","admin","administrator"]};function f(){var a;try{return((a=window.PLAYER)==null?void 0:a.mediaType)||null}catch(c){return null}}function s(){let a=(f()||"").toLowerCase();return a==="fi"||a==="gd"}function b(){try{return window.CLIENT||window.client||null}catch(a){return null}}function k(){try{return window.CHANNEL||window.channel||null}catch(a){return null}}function p(){let a=k();if(a&&typeof a.perms=="object"&&a.perms)return a.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(c){return{}}}function M(a=[]){let c=p();for(let _ of a){let T=c==null?void 0:c[_];if(typeof T=="number")return T}}function Z(){let a=M(j.owner);return typeof a=="number"?a:h}function ce(a){if(!a)return!1;try{if(typeof a.hasPermission=="function"&&a.hasPermission("chanowner"))return!0}catch(c){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(c){}return!1}function Y(){let a=b();if(!a)return!1;let c=Number(a.rank);return Number.isFinite(c)?!!(c>=Z()||ce(a)):!1}let de=()=>{try{return localStorage.getItem(L.localSubs)!=="0"}catch(a){return!0}},W=a=>{try{localStorage.setItem(L.localSubs,a?"1":"0")}catch(c){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!a}}))},G=0,q=0,I=0,K=2e3,Q=8e3,J=45e3,be=12e4,oe=Q,ve=!1,me=null;function we(){if(U("#btfw-vo-css"))return;let a=document.createElement("style");a.id="btfw-vo-css",a.textContent=`
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
    `,document.head.appendChild(a)}function Se(a){let c=U("#videowrap");!c||!a||((a.parentElement!==c.parentElement||a.previousElementSibling!==c)&&c.insertAdjacentElement("afterend",a),a.classList.add("btfw-vo-visible"))}function ne(){if(!U("#videowrap"))return null;let c=U("#btfw-video-overlay");c||(c=document.createElement("div"),c.id="btfw-video-overlay"),c.classList.add("btfw-video-overlay"),Se(c);let _=c.querySelector("#btfw-vo-bar");_||(_=document.createElement("div"),_.className="btfw-vo-bar",_.id="btfw-vo-bar",c.appendChild(_));let T=C(c,_);return _e(T.left),l(T),A(T),g(c),c}function g(a){a&&a.querySelectorAll("button").forEach(c=>{c.classList.contains("btfw-vo-btn")||c.classList.add("btfw-vo-btn")})}function C(a,c){let _="btfw-vo-left",T="btfw-vo-right",X=c.querySelector(`#${_}`);X||(X=document.createElement("div"),X.id=_,X.className="btfw-vo-section btfw-vo-section--left",c.insertBefore(X,c.firstChild));let re=c.querySelector(`#${T}`);return re||(re=document.createElement("div"),re.id=T,re.className="btfw-vo-section btfw-vo-section--right",c.appendChild(re)),Array.from(c.children).forEach(he=>{he===X||he===re||re.appendChild(he)}),a.dataset.leftSection=`#${_}`,a.dataset.rightSection=`#${T}`,c.dataset.leftSection=`#${_}`,c.dataset.rightSection=`#${T}`,{left:X,right:re}}function N(){return document.querySelector("#ytapiplayer video, video")}function F(a=N()){return a?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof a.webkitShowPlaybackTargetPicker=="function":!1}function ee(){if(!me)return;let a=me._btfwAirplayHandler;if(a){try{me.removeEventListener("webkitplaybacktargetavailabilitychanged",a)}catch(c){}delete me._btfwAirplayHandler}me=null}function ie(a){if(!a||typeof a.addEventListener!="function"){ee();return}if(me===a)return;ee();let c=_=>{let T=!_||_.availability==="available",X=U("#btfw-airplay");X&&(X.style.display=T?"":"none")};try{a.addEventListener("webkitplaybacktargetavailabilitychanged",c),a._btfwAirplayHandler=c,me=a}catch(_){}}function ue(){let a=U("#btfw-airplay");if(!a)return;let c=N();if(!F(c)){a.style.display="none",ee();return}a.style.display="",ie(c)}function pe(a,c){c&&c.classList.add("btfw-vo-visible")}function l(a){if(!(a!=null&&a.right)||!(a!=null&&a.left))return;let c=[];document.querySelector("#fullscreenbtn")||c.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:m,section:"right"}),c.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:u,section:"right"}),c.forEach(_=>{let T=document.querySelector(`#${_.id}`),X=_.section==="left"?a.left:a.right;T?X&&T.parentElement!==X&&X.appendChild(T):(T=document.createElement("button"),T.id=_.id,T.className="btfw-vo-btn",T.innerHTML=`<i class="${_.icon}"></i>`,T.title=_.tooltip,T.addEventListener("click",_.action),(X||a.right).appendChild(T))}),ue()}function A(a){let c=a==null?void 0:a.right;c&&P.forEach(_=>{let T=document.querySelector(_);if(!T)return;if(T.dataset.btfwOverlay==="1"){T.parentElement!==c&&c.appendChild(T);return}let X=document.createElement("span");X.hidden=!0,X.setAttribute("data-btfw-ph",_);try{T.insertAdjacentElement("afterend",X)}catch(re){}if(T.classList.add("btfw-vo-adopted"),T.dataset.btfwOverlay="1",T.id==="mediarefresh"){let re=T.onclick;T.onclick=he=>{he.preventDefault();let Ce=!!(he&&he.isTrusted);R(()=>{if(typeof re=="function")try{return re.call(T,he),!0}catch(xe){console.warn("[video-overlay] native refresh handler failed:",xe)}return!1},{isUserAction:Ce})}}c.appendChild(T)})}function B(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(a){console.warn("[video-overlay] Media refresh failed:",a)}return!1}function R(a,c={}){let{isUserAction:_=!1}=c,T=Date.now();if(I&&T-I>be&&(oe=Q,G=0),T<q){let xe=Math.ceil((q-T)/1e3);return x(_?`Refresh available in ${xe}s`:`Auto refresh paused. Next attempt in ${xe}s`,"warning"),!1}let X=_?K:oe;if(I&&T-I<X){let xe=X-(T-I),Le=Math.ceil(xe/1e3);return q=T+xe,x(_?`Refresh available in ${Le}s`:`Auto refresh paused. Next attempt in ${Le}s`,"warning"),!1}if(G++,G>=10)return q=T+3e4,G=0,x("Refresh limit reached. 30s cooldown active.","error"),!1;let re=_?6e3:Math.max(12e3,oe+2e3);setTimeout(()=>{G>0&&G--},re);let he=!1;if(typeof a=="function")try{he=a()===!0}catch(xe){console.warn("[video-overlay] Refresh handler error:",xe)}return he||(he=B()),I=Date.now(),_?oe=Q:oe=Math.min(J,Math.max(Q,Math.round(oe*(he?1.25:1.5)))),q=Math.max(q,I+(_?K:oe)),!_&&he?x(`Auto refresh sent. Next attempt in ${Math.ceil(oe/1e3)}s`,"info"):x(he?"Media refreshed":"Unable to refresh media",he?"success":"error"),he}function m(){let a=U("#videowrap");a&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():a.requestFullscreen?a.requestFullscreen():a.webkitRequestFullscreen?a.webkitRequestFullscreen():a.mozRequestFullScreen&&a.mozRequestFullScreen())}function v(a,c=!0){if(!a||!F(a))return!1;if(a.setAttribute("airplay","allow"),a.setAttribute("x-webkit-airplay","allow"),c&&typeof a.webkitShowPlaybackTargetPicker=="function")try{a.webkitShowPlaybackTargetPicker()}catch(_){console.warn("[video-overlay] AirPlay picker failed:",_)}return ue(),!0}function i(){if(!(ve||!window.socket)){ve=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let a=N();a&&(v(a,!1),ie(a)),ue()},1e3)})}catch(a){console.warn("[video-overlay] Failed to attach AirPlay listener:",a)}}}function u(){let a=N();return F(a)?v(a)?(x("AirPlay enabled","success"),i(),!0):(x("AirPlay not available","warning"),!1):(ue(),x("AirPlay not available","warning"),!1)}function x(a,c="info"){let _=document.getElementById("btfw-notification");_||(_=document.createElement("div"),_.id="btfw-notification",_.className="btfw-notification",document.body.appendChild(_)),_.textContent=a,_.className=`btfw-notification btfw-notification--${c} btfw-notification--show`,clearTimeout(_._hideTimer),_._hideTimer=setTimeout(()=>{_.classList.remove("btfw-notification--show")},3e3)}function D(){return U("video")}function se(a){let c=(a||"").replace(/\r\n/g,`
`).trim()+`
`;return c=c.replace(/^\d+\s*$\n/gm,""),c=c.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),c=c.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+c}async function z(){let a=D();if(!a){ye("Local subs only for HTML5 sources.");return}let c=document.createElement("input");c.type="file",c.accept=".vtt,.srt,text/vtt,text/plain",c.style.display="none",document.body.appendChild(c);let _=new Promise(T=>{c.addEventListener("change",async()=>{let X=c.files&&c.files[0];if(document.body.removeChild(c),!X)return T(!1);try{let re=await X.text(),Ce=(X.name.split(".").pop()||"").toLowerCase()==="srt"?se(re):re.startsWith("WEBVTT")?re:`WEBVTT

`+re,xe=URL.createObjectURL(new Blob([Ce],{type:"text/vtt"}));Ee(a,xe,X.name.replace(/\.[^.]+$/,"")||"Local"),ye("Subtitles loaded."),T(!0)}catch(re){console.error(re),ye("Failed to load subtitles."),T(!1)}},{once:!0})});c.click(),await _}function Ee(a,c,_){var X;(X=U('track[data-btfw="1"]',a))==null||X.remove();let T=document.createElement("track");T.kind="subtitles",T.label=_||"Local",T.srclang="en",T.src=c,T.default=!0,T.setAttribute("data-btfw","1"),a.appendChild(T);try{for(let re of a.textTracks)re.mode=re.label===T.label?"showing":"disabled"}catch(re){}}function ye(a){let c=U("#btfw-mini-toast");c||(c=document.createElement("div"),c.id="btfw-mini-toast",document.body.appendChild(c)),c.textContent=a,c.style.opacity="1",clearTimeout(c._hid),c._hid=setTimeout(()=>c.style.opacity="0",1400)}function _e(a){if(!a)return;let c=document.querySelector("#btfw-vo-subs");c||(c=document.createElement("button"),c.id="btfw-vo-subs",c.className="btfw-vo-btn",c.title="Load local subtitles (.vtt/.srt)",c.innerHTML='<i class="fa fa-closed-captioning"></i>',c.addEventListener("click",T=>{T.preventDefault(),z()}),a.insertBefore(c,a.firstChild||null));let _=de()&&s();c.style.display=_?"":"none"}function Te(){we(),ne();let a=[U("#videowrap"),U("#rightcontrols"),U("#leftcontrols"),document.body].filter(Boolean),c=new MutationObserver(()=>ne());a.forEach(_=>c.observe(_,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>ne());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>ne(),0)})}catch(_){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te(),{name:"feature:videoOverlay",setLocalSubsEnabled:W,toggleFullscreen:m,enableAirplay:u}});(function(){"use strict";let h="https://vidprox.billtube.workers.dev/?url=";function j(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function f(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var b,k,p;let s=typeof window!="undefined"&&(((b=window.BTFW_CONFIG)==null?void 0:b.corsVideoProxy)||((p=(k=window.BTFW_CONFIG)==null?void 0:k.integrations)==null?void 0:p.corsVideoProxy));if(typeof s=="string"&&s.trim()){let M=s.trim();if(M.includes("?"))return M;let Z=M.endsWith("/")?"":"/";return`${M}${Z}?url=`}return h},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_isTrusted(s){try{return new URL(s).hostname.toLowerCase().endsWith(".workers.dev")}catch(b){return!1}},_markInternalSrcSet(){this._lastInternalSrcSetAt=f()},_isInsideInternalWindow(){return f()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let s=this._getMediaElement();return s?s.crossOrigin==="anonymous"||s.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var s;if(this._hasAnonymousCrossOrigin())return!1;try{return(s=this.player)==null||s.crossOrigin("anonymous"),!0}catch(b){return!1}},_same(s,b){return String(s||"")===String(b||"")},_getMediaElement(){var k;let s=(k=this.player)==null?void 0:k.tech_;if(s){try{let p=typeof s.el=="function"?s.el():null;if(p instanceof HTMLMediaElement&&p.isConnected)return p}catch(p){}if(s.el_ instanceof HTMLMediaElement&&s.el_.isConnected)return s.el_}let b=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return b instanceof HTMLMediaElement&&b.isConnected?b:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(s){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(s){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(s){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(s){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(s){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(s){}this.mergerNode=null}},resetMediaBinding(){var b,k;this.disconnectChain();let s=this._getMediaElement();if(s&&this._syncFromRegistry(s)){((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((k=this.audioContext)==null?void 0:k.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(s){var ce;let b=(ce=this.player)==null?void 0:ce.tech_;if(!(b!=null&&b.el_)||b.el_!==s)return null;let k=s.parentNode;if(!k)return null;let p=s.tagName.toLowerCase()==="audio"?"audio":"video",M=document.createElement(p);M.className=s.className,s.id&&(M.id=s.id),M.setAttribute("playsinline",""),M.setAttribute("webkit-playsinline",""),M.classList.contains("vjs-tech")||M.classList.add("vjs-tech");let Z=s.crossOrigin||s.getAttribute("crossorigin");return Z&&(M.crossOrigin=Z,M.setAttribute("crossorigin",Z)),k.replaceChild(M,s),b.el_=M,delete s.__btfwSourceNode,M},_syncFromRegistry(s){let b=j().get(s)||s.__btfwSourceNode||null;return b?(j().set(s,b),this.sourceNode=b,this._sourceMediaElement=s,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b):null},_getOrCreateSourceNode(s){var M;let b=j(),k=b.get(s)||s.__btfwSourceNode||null;if(k)return b.set(s,k),this.sourceNode=k,this._sourceMediaElement=s,k.context&&k.context.state!=="closed"&&(this.audioContext=k.context),k;if(this.sourceNode&&this._sourceMediaElement===s)return b.set(s,this.sourceNode),s.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new(window.AudioContext||window.webkitAudioContext));let p;try{p=this.audioContext.createMediaElementSource(s)}catch(Z){if((Z==null?void 0:Z.name)!=="InvalidStateError")throw Z;let ce=this._syncFromRegistry(s);if(ce)return ce;let Y=this._swapVideoTechElement(s);if(!Y)throw Z;let de=(M=this.player)==null?void 0:M.currentSrc();if(de&&this.player){this._markInternalSrcSet(),this.player.src({src:de,type:"video/mp4"});try{this.player.load()}catch(W){}}return this._getOrCreateSourceNode(Y)}return b.set(s,p),s.__btfwSourceNode=p,this.sourceNode=p,this._sourceMediaElement=s,p},cleanup(){this.disconnectChain(),this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{});let s=this._getMediaElement();s&&(s.disableRemotePlayback=!1),this.stopWatchdog()},startWatchdog(){if(!this.player)return;this.stopWatchdog();let s=this._getMediaElement();if(s&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(s,{attributes:!0,attributeFilter:["src","crossorigin"]});let b=new MutationObserver(()=>{this._checkAndReapply("sources")});b.observe(s,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=b}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,k])=>{this.player.on(b,k)})}catch(b){}}this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800),this._lastKnownSrc=this.player.currentSrc()},stopWatchdog(){var s;if(this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(b){}try{(s=this._mutationObserver._sourceObserver)==null||s.disconnect()}catch(b){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,k])=>{this.player.off(b,k)})}catch(b){}this._watchdogPlayerHandlers=null}},_checkAndReapply(s){if(!this.player)return;let b=this.player.currentSrc();if(!b||(this._lastKnownSrc=b,this._isInsideInternalWindow()))return;if(b.includes(this.CORS_PROXY)){this.isProxied=!0,this.proxiedSrc=b;return}if(this._isTrusted(b)){this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin(),this.isProxied=!1,this.originalSrc=b;return}if(this._shouldForceProxy()){if(f()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=f(),this._forceProxyPreservingState(b)}},async _forceProxyPreservingState(s){if(!this.player)return;let b=this.player.currentTime(),k=!this.player.paused();this.originalSrc=s,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(s);try{this.player.pause()}catch(M){}try{this.player.crossOrigin("anonymous")}catch(M){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(M){}let p=()=>{try{this.player.currentTime(b)}catch(M){}this.isProxied=!0,k&&this.player.play().catch(()=>{})};typeof this.player.ready=="function"?this.player.ready(p):setTimeout(p,300)},async ensureProxy(){if(!this.player)return!1;let s=this.player.currentSrc();if(!s)return!1;if(s.includes(this.CORS_PROXY))return this.isProxied=!0,this.proxiedSrc=s,!0;try{let b=new URL(s);if(this._isTrusted(s)){if(this.originalSrc=s,this.isProxied=!1,this._hasAnonymousCrossOrigin())return!0;let k=this.player.currentTime(),p=!this.player.paused();try{this.player.pause()}catch(M){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:s,type:"video/mp4"});try{this.player.load()}catch(M){}return new Promise(M=>{this.player.ready(()=>{try{this.player.currentTime(k)}catch(Z){}p&&this.player.play().catch(()=>{}),M(!0)})})}}catch(b){console.warn("[BTFW_AUDIO] Invalid URL:",b)}return this._forceProxyPreservingState(s),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var b;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if((this.boostEnabled||this.normalizationEnabled||this.monoEnabled)&&(!this.isProxied&&!this._isTrusted(this.player.currentSrc())?await this.ensureProxy():this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin()),!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let s=this._getMediaElement();if(!s)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((b=this.audioContext)==null?void 0:b.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),s.disableRemotePlayback=!0;let p=this._getOrCreateSourceNode(s);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let M=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(M.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(M.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(M.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(M.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(M.release,this.audioContext.currentTime),p.connect(this.compressorNode),p=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),p.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),p=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,p.connect(this.gainNode),p=this.gainNode),p.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(k){return console.error("[BTFW_AUDIO] Error building audio chain:",k),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(s){return this.NORM_PRESETS[s]?(this.currentNormPreset=s,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(s){return this.BOOST_MULTIPLIER=s,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}}}})();(function(){"use strict";function U(P){window.BTFW&&typeof BTFW.define=="function"?P():setTimeout(()=>U(P),0)}U(function(){BTFW.define("feature:audio",[],async()=>{let P=(m,v=document)=>v.querySelector(m),L=window.BTFW_AUDIO,h=null,j=null,f=null,s=!1,b=!1,k=!1,p=null,M=null,Z=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function ce(m){h&&(m?(h.classList.add("active"),h.style.background="rgba(46, 213, 115, 0.3)",h.style.borderColor="#2ed573",h.style.color="#2ed573",h.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(h.classList.remove("active"),h.style.background="",h.style.borderColor="",h.style.color="",h.style.boxShadow=""))}function Y(m,v="info"){let i=P("#btfw-audioboost-toast");i||(i=document.createElement("div"),i.id="btfw-audioboost-toast",i.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${v==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=v==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function de(){if(await L.enableBoost()){s=!0;let v=Math.round(L.BOOST_MULTIPLIER*100);Y(`Boosted by ${v}%`,"success"),ce(!0)}else{let v=L._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";Y(v,"error")}}async function W(){await L.disableBoost(),s=!1,ce(!1)}function G(m){j&&(m?(j.classList.add("active"),j.style.background="rgba(52, 152, 219, 0.3)",j.style.borderColor="#3498db",j.style.color="#3498db",j.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(j.classList.remove("active"),j.style.background="",j.style.borderColor="",j.style.color="",j.style.boxShadow=""))}function q(m,v="info"){let i=P("#btfw-audionorm-toast");i||(i=document.createElement("div"),i.id="btfw-audionorm-toast",i.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${v==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=v==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function I(){if(await L.enableNormalization())b=!0,q("Normalization enabled","success"),G(!0);else{let v=L._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";q(v,"error")}}async function K(){await L.disableNormalization(),b=!1,G(!1)}function Q(m){f&&(m?(f.classList.add("active"),f.style.background="rgba(155, 89, 182, 0.3)",f.style.borderColor="#9b59b6",f.style.color="#9b59b6",f.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(f.classList.remove("active"),f.style.background="",f.style.borderColor="",f.style.color="",f.style.boxShadow=""))}function J(m,v="info"){let i=P("#btfw-mono-toast");i||(i=document.createElement("div"),i.id="btfw-mono-toast",i.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${v==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=m,i.style.background=v==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function be(){if(await L.enableMono())k=!0,J("Stereo audio enabled","success"),Q(!0);else{let v=L._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";J(v,"error")}}async function oe(){await L.disableMono(),k=!1,Q(!1)}function ve(){let m=document.createElement("button");m.id="btfw-vo-audioboost",m.className="btn btn-sm btn-default btfw-vo-adopted";let v=Math.round(L.BOOST_MULTIPLIER*100);return m.title=`Toggle Audio Boost (${v}%)`,m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-megaphone"></i>',m.addEventListener("click",()=>{L.boostEnabled?W():de()}),m.addEventListener("mouseenter",()=>ne()),m.addEventListener("mouseleave",()=>{setTimeout(()=>{!(p!=null&&p.matches(":hover"))&&!m.matches(":hover")&&g()},100)}),m}function me(){let m=document.createElement("button");m.id="btfw-vo-audionorm",m.className="btn btn-sm btn-default btfw-vo-adopted";let v=L.NORM_PRESETS[L.currentNormPreset].label;return m.title=`Toggle Audio Normalization (${v})`,m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-waveform-lines"></i>',m.addEventListener("click",()=>{L.normalizationEnabled?K():I()}),m.addEventListener("mouseenter",()=>F()),m.addEventListener("mouseleave",()=>{setTimeout(()=>{!(M!=null&&M.matches(":hover"))&&!m.matches(":hover")&&ee()},100)}),m}function we(){let m=document.createElement("button");return m.id="btfw-vo-mono",m.className="btn btn-sm btn-default btfw-vo-adopted",m.title="Toggle Mono Audio (mix both channels to stereo)",m.setAttribute("data-btfw-overlay","1"),m.innerHTML='<i class="fa-solid fa-headphones"></i>',m.addEventListener("click",()=>{L.monoEnabled?oe():be()}),m}function Se(){if(p)return p;let m=document.createElement("div");return m.id="btfw-boost-context-menu",m.style.cssText=`
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
        `,Z.forEach(v=>{let i=document.createElement("button");i.className="btfw-context-item",i.textContent=v.label,i.style.cssText=`
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
          `,L.BOOST_MULTIPLIER===v.multiplier&&(i.style.background="rgba(46, 213, 115, 0.2)",i.style.color="#2ed573"),i.addEventListener("mouseenter",()=>{L.BOOST_MULTIPLIER!==v.multiplier&&(i.style.background="rgba(109, 77, 246, 0.2)")}),i.addEventListener("mouseleave",()=>{L.BOOST_MULTIPLIER!==v.multiplier&&(i.style.background="transparent")}),i.addEventListener("click",async()=>{if(await L.setBoostMultiplier(v.multiplier),C(),h){let u=Math.round(v.multiplier*100);h.title=`Toggle Audio Boost (${u}%)`}L.boostEnabled&&Y(`Boost set to ${v.label}`,"success")}),m.appendChild(i)}),m.addEventListener("mouseleave",()=>{setTimeout(()=>{h!=null&&h.matches(":hover")||g()},100)}),document.body.appendChild(m),p=m,m}function ne(){if(!h)return;let m=Se(),v=h.getBoundingClientRect();m.style.left=v.left+"px",m.style.top=v.bottom+5+"px",m.style.display="block"}function g(){p&&(p.style.display="none")}function C(){if(!p)return;p.querySelectorAll(".btfw-context-item").forEach((v,i)=>{let u=Z[i];L.BOOST_MULTIPLIER===u.multiplier?(v.style.background="rgba(46, 213, 115, 0.2)",v.style.color="#2ed573"):(v.style.background="transparent",v.style.color="#e0e0e0")})}function N(){if(M)return M;let m=document.createElement("div");return m.id="btfw-norm-context-menu",m.style.cssText=`
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
        `,Object.keys(L.NORM_PRESETS).forEach(v=>{let i=L.NORM_PRESETS[v],u=document.createElement("button");u.className="btfw-context-item",u.textContent=i.label,u.style.cssText=`
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
          `,L.currentNormPreset===v&&(u.style.background="rgba(52, 152, 219, 0.2)",u.style.color="#3498db"),u.addEventListener("mouseenter",()=>{L.currentNormPreset!==v&&(u.style.background="rgba(109, 77, 246, 0.2)")}),u.addEventListener("mouseleave",()=>{L.currentNormPreset!==v&&(u.style.background="transparent")}),u.addEventListener("click",async()=>{await L.setNormPreset(v),ie(),j&&(j.title=`Toggle Audio Normalization (${i.label})`),L.normalizationEnabled&&q(`Preset: ${i.label}`,"success")}),m.appendChild(u)}),m.addEventListener("mouseleave",()=>{setTimeout(()=>{j!=null&&j.matches(":hover")||ee()},100)}),document.body.appendChild(m),M=m,m}function F(){if(!j)return;let m=N(),v=j.getBoundingClientRect();m.style.left=v.left+"px",m.style.top=v.bottom+5+"px",m.style.display="block"}function ee(){M&&(M.style.display="none")}function ie(){if(!M)return;let m=M.querySelectorAll(".btfw-context-item");Object.keys(L.NORM_PRESETS).forEach((v,i)=>{let u=m[i];L.currentNormPreset===v?(u.style.background="rgba(52, 152, 219, 0.2)",u.style.color="#3498db"):(u.style.background="transparent",u.style.color="#e0e0e0")})}function ue(){let m=P("#btfw-vo-left");if(!m)return!1;let v=P("#btfw-vo-audioboost");v&&v.remove();let i=P("#btfw-vo-audionorm");i&&i.remove();let u=P("#btfw-vo-mono");return u&&u.remove(),h=ve(),j=me(),f=we(),m.appendChild(h),m.appendChild(j),m.appendChild(f),!0}function pe(m,v=20){let i=0,u=setInterval(()=>{i++,ue()?(clearInterval(u),m()):i>=v&&clearInterval(u)},500)}function l(){if(typeof videojs=="undefined"){setTimeout(l,500);return}if(!P("#ytapiplayer")){setTimeout(l,500);return}L.player=videojs("ytapiplayer"),L.originalSrc=L.player.currentSrc(),L.startWatchdog()}function A(){setTimeout(()=>{L.resetMediaBinding(),L.boostEnabled=!1,L.normalizationEnabled=!1,L.monoEnabled=!1,L.isProxied=!1,ce(!1),G(!1),Q(!1),l(),s&&setTimeout(()=>{de()},1200),b&&setTimeout(()=>{I()},1200),k&&setTimeout(()=>{be()},1200)},600)}function B(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>L._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>L._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",A))}function R(){pe(()=>{l()}),B()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",R):R(),{name:"feature:audio",activate:de,deactivate:W,isActive:()=>L.boostEnabled,activateNormalization:I,deactivateNormalization:K,isNormalizationActive:()=>L.normalizationEnabled,activateMono:be,deactivateMono:oe,isMonoActive:()=>L.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async P=>P.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:U})=>{let P=await U("util:tmdb-proxy"),L="movie-info",h={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},j="btfw-movie-info-style",f={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},s=0,b=!1,k=null;function p(i){typeof i=="function"&&f.cleanup.push(i)}function M(){for(;f.cleanup.length;){let i=f.cleanup.pop();try{i()}catch(u){}}f.header&&(f.header.remove(),f.header=null)}function Z(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null),f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null),s=0,f.currentTitle="",f.isInitialized=!1,M()}function ce(i){if(typeof i=="boolean")return i;if(typeof i=="number")return Number.isFinite(i)?i>0:!1;if(typeof i=="string"){let u=i.trim().toLowerCase();return u?u==="1"||u==="true"||u==="yes"||u==="on":!1}return!1}function Y(){let i=[()=>{var u,x,D;return(D=(x=(u=window.BTFW_THEME_ADMIN)==null?void 0:u.integrations)==null?void 0:x.movieInfo)==null?void 0:D.enabled},()=>{var u,x,D;return(D=(x=(u=window.BTFW_CONFIG)==null?void 0:u.integrations)==null?void 0:x.movieInfo)==null?void 0:D.enabled},()=>{var u,x;return(x=(u=window.BTFW_CONFIG)==null?void 0:u.movieInfo)==null?void 0:x.enabled},()=>{var u;return(u=window.BTFW_CONFIG)==null?void 0:u.movieInfoEnabled},()=>{var u,x;return(x=(u=document==null?void 0:document.body)==null?void 0:u.dataset)==null?void 0:x.btfwMovieInfoEnabled}];for(let u of i)try{let x=typeof u=="function"?u():u;if(ce(x))return!0}catch(x){}return!1}function de(){if(k||typeof MutationObserver!="function")return;let i=document.body;i&&(k=new MutationObserver(()=>I()),k.observe(i,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function W(){if(b)return;b=!0;let i=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",i),document.addEventListener("btfw:ready",i)}function G(i=0){f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.initTimer=window.setTimeout(()=>{f.initTimer=null,Y()&&q()},Math.max(0,i))}function q(){if(f.isInitialized)return;let i=document.querySelector(h.TOPBAR_SELECTOR);if(!i){G(500);return}try{K(i),m(),J(),f.isInitialized=!0,setTimeout(()=>{g(),C()},120)}catch(u){G(800)}}function I(){Y()?f.isInitialized?(g(),setTimeout(C,80)):G(0):Z()}function K(i){if(!i&&(i=document.querySelector(h.TOPBAR_SELECTOR),!i))throw new Error("Chat topbar not found");let u=document.getElementById(h.CONTAINER_ID);u&&u.remove();let x=document.createElement("div");x.id=h.CONTAINER_ID,x.className="btfw-movie-header hide",x.dataset.module=L,i.insertAdjacentElement("afterend",x),f.header=x}function Q(){try{return window.socket||window.SOCKET||null}catch(i){return null}}function J(){be(),me();let i=R(g,250);window.addEventListener("resize",i),p(()=>window.removeEventListener("resize",i))}function be(){oe(),ve()}function oe(){let i=document.querySelector(h.TITLE_SELECTOR);if(i){let u=()=>Se(),x=()=>ne();i.addEventListener("mouseenter",u),i.addEventListener("mouseleave",x),p(()=>{i.removeEventListener("mouseenter",u),i.removeEventListener("mouseleave",x)})}else if(typeof MutationObserver=="function"){let u=new MutationObserver(()=>{document.querySelector(h.TITLE_SELECTOR)&&(u.disconnect(),oe())});u.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),p(()=>{try{u.disconnect()}catch(x){}})}}function ve(){let i=f.header;if(!i)return;let u=()=>we(),x=()=>ne();i.addEventListener("mouseenter",u),i.addEventListener("mouseleave",x),p(()=>{i.removeEventListener("mouseenter",u),i.removeEventListener("mouseleave",x)})}function me(){let i=Q();if(i&&typeof i.on=="function"){i.on("changeMedia",C),p(()=>{var D,se;try{(D=i.off)==null||D.call(i,"changeMedia",C)}catch(z){try{(se=i.removeListener)==null||se.call(i,"changeMedia",C)}catch(Ee){}}});return}let u=0,x=()=>{if(!Y()){f.socketRetryTimer=null;return}let D=Q();if(D&&typeof D.on=="function"){D.on("changeMedia",C),p(()=>{var se,z;try{(se=D.off)==null||se.call(D,"changeMedia",C)}catch(Ee){try{(z=D.removeListener)==null||z.call(D,"changeMedia",C)}catch(ye){}}}),f.socketRetryTimer=null;return}if(u+=1,u>10){f.socketRetryTimer=null;return}f.socketRetryTimer=window.setTimeout(x,1e3)};f.socketRetryTimer=window.setTimeout(x,1200),p(()=>{f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null)})}function we(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null)}function Se(){we(),f.header&&(f.header.classList.remove("hide"),f.header.classList.add("show"))}function ne(){we(),f.hideTimer=window.setTimeout(()=>{f.header&&(f.header.classList.remove("show"),f.header.classList.add("hide"),setTimeout(()=>{f.header&&f.header.classList.contains("hide")&&f.header.classList.remove("hide")},320))},300)}function g(){if(!f.header)return;let i=window.innerWidth<=768;f.header.classList.toggle("btfw-mobile",i)}async function C(){var se;if(!f.isInitialized)return;let i=document.querySelector(h.TITLE_SELECTOR),u=f.header;if(!i||!u)return;let x=((se=i.textContent)==null?void 0:se.trim())||"";if(!x){f.currentTitle="",ue();return}if(x===f.currentTitle)return;f.currentTitle=x;let D=++s;ee();try{let z=await F(x);if(D!==s)return;l(z)}catch(z){if(D!==s)return;P.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ie()}}function N(i){let u=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],x=i;return u.forEach(D=>{let se=new RegExp(`\\b${D}\\b`,"gi");x=x.replace(se,"")}),x.replace(/\s{2,}/g," ").trim()}async function F(i){var Ee;if(!P.isAvailable())throw new Error(P.MISSING_PROXY_MSG);let u=i.match(/(.+)\s*\((\d{4})\)/),x=u?u[1].trim():i,D=u?u[2]:"";D||(u=i.match(/(.+?)\s+(\d{4})\s*$/),u&&(x=u[1].trim(),D=u[2]));let se=N(x),z=await P.tmdbFetch("search/movie",{query:se,year:D});if(((Ee=z==null?void 0:z.results)==null?void 0:Ee.length)>0){let ye=z.results[0];return{title:i,backdrop:ye.backdrop_path?`https://image.tmdb.org/t/p/w1280${ye.backdrop_path}`:null,poster:ye.poster_path?`https://image.tmdb.org/t/p/w500${ye.poster_path}`:null,summary:ye.overview||"",rating:ye.vote_average||0,releaseDate:ye.release_date||"",voteCount:ye.vote_count||0}}return{title:i,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ee(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-loading">
          <i class="fa fa-spinner fa-spin"></i>
          <p>Loading movie information...</p>
        </div>
      </div>
    `)}function ie(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-error">
          <i class="fa fa-exclamation-triangle"></i>
          <p>Unable to fetch movie information</p>
          <small>Check TMDB API key in Theme Settings</small>
        </div>
      </div>
    `)}function ue(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <p>No movie information available</p>
      </div>
    `)}function pe(){f.header&&(f.header.style.backgroundImage="",f.header.style.backgroundColor="")}function l(i){if(!f.header)return;f.header.innerHTML="",h.ENABLE_BACKDROP&&i.backdrop?(f.header.style.backgroundImage=`url(${i.backdrop})`,f.header.style.backgroundSize="cover",f.header.style.backgroundPosition="center"):pe();let u=document.createElement("div");u.className="btfw-movie-overlay",f.header.appendChild(u);let x=document.createElement("div");if(x.className="btfw-movie-content",f.header.appendChild(x),i.poster){let z=document.createElement("img");z.src=i.poster,z.alt=`${i.title} Poster`,z.className="btfw-movie-poster",x.appendChild(z)}let D=document.createElement("div");D.className="btfw-movie-details",x.appendChild(D);let se=document.createElement("h2");if(se.textContent=i.title,se.className="btfw-movie-title",D.appendChild(se),h.SHOW_SUMMARY&&i.summary){let z=document.createElement("p");z.textContent=i.summary,z.className="btfw-movie-summary",D.appendChild(z)}if(h.ENABLE_RATING&&i.rating>0){let z=A(i.rating,i.voteCount);x.appendChild(z)}}function A(i,u){let x=document.createElement("div");x.className="btfw-movie-rating";let D=Math.round(i*10),se=B(D),z="http://www.w3.org/2000/svg",Ee=document.createElementNS(z,"svg");Ee.setAttribute("width","60"),Ee.setAttribute("height","60"),Ee.setAttribute("viewBox","0 0 60 60");let ye=25,_e=2*Math.PI*ye,Te=_e-i/10*_e,a=document.createElementNS(z,"circle");a.setAttribute("cx","30"),a.setAttribute("cy","30"),a.setAttribute("r",ye.toString()),a.setAttribute("stroke","#2a2a2a"),a.setAttribute("stroke-width","4"),a.setAttribute("fill","#1a1a1a"),Ee.appendChild(a);let c=document.createElementNS(z,"circle");c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r",ye.toString()),c.setAttribute("stroke",se),c.setAttribute("stroke-width","3"),c.setAttribute("fill","none"),c.setAttribute("stroke-dasharray",_e.toString()),c.setAttribute("stroke-dashoffset",Te.toString()),c.setAttribute("transform","rotate(-90 30 30)"),c.setAttribute("stroke-linecap","round"),Ee.appendChild(c);let _=document.createElementNS(z,"text");if(_.setAttribute("x","50%"),_.setAttribute("y","50%"),_.setAttribute("text-anchor","middle"),_.setAttribute("dominant-baseline","central"),_.setAttribute("fill","#fff"),_.setAttribute("font-size","10"),_.setAttribute("font-weight","bold"),_.textContent=`${D}%`,Ee.appendChild(_),x.appendChild(Ee),u>0){let T=document.createElement("div");T.className="btfw-movie-votes",T.textContent=`${u.toLocaleString()} votes`,x.appendChild(T)}return x}function B(i){let u=Math.max(0,Math.min(i,100));return u>=70?"#4caf50":u>=50?"#ff9800":"#f44336"}function R(i,u){let x=null;return function(...se){x&&clearTimeout(x),x=setTimeout(()=>{x=null,i(...se)},u)}}function m(){if(document.getElementById(j))return;let i=`
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
    `,u=document.createElement("style");u.id=j,u.textContent=i,document.head.appendChild(u)}function v(){de(),W(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v,{once:!0}):v(),{name:"feature:movie-info",refresh:I,cleanup:Z}});BTFW.define("feature:monkeyPaw",[],async()=>{let U="btfw-monkey-paw-styles",P="btfw-monkey-paw-overlay",L="/assets/monkey-paw/paw.svg",h={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},j={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},f={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},s=null,b=null;function k(q){return new Promise(I=>setTimeout(I,q))}function p(){try{let q=typeof window!="undefined"?window.BTFW:null;return q&&(q.BASE||q.DEV_CDN)||""}catch(q){return""}}function M(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(q){return!1}}function Z(){if(typeof document=="undefined"||document.getElementById(U))return;let q=document.createElement("style");q.id=U,q.textContent=`
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
    `,document.head.appendChild(q)}async function ce(){if(s)return s;let I=`${p()}${L}`,K=await fetch(I,{credentials:"omit"});if(!K.ok)throw new Error(`Monkey paw SVG failed to load (${K.status})`);return s=await K.text(),s}function Y(q){Object.entries(f).forEach(([I,K])=>{let Q=q.querySelector(`#${I}`),J=q.querySelector(`#${I}-tip`);Q&&(Q.style.transform=K.root),J&&(J.style.transform=K.tip)})}function de(q){Object.entries(h).forEach(([I,K])=>{window.setTimeout(()=>{let Q=q.querySelector(`#${I}`),J=q.querySelector(`#${I}-tip`);Q&&(Q.style.transform=K.root),J&&window.setTimeout(()=>{J.style.transform=K.tip},120)},j[I])})}function W(q){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${q}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function G(q={}){if(b)return b;if(typeof document!="undefined")return b=(async()=>{var be,oe;if(Z(),M()){await k((be=q.reducedMotionMs)!=null?be:450);return}let I=document.getElementById(P);I||(I=document.createElement("div"),I.id=P,document.body.appendChild(I));let K;try{K=await ce()}catch(ve){console.warn("[monkey-paw] SVG load failed:",ve),await k(300);return}I.innerHTML=W(K),Y(I);let Q=I.querySelector("#paw"),J=I.querySelector("#btfw-monkey-paw-msg");I.classList.remove("is-cursed"),J==null||J.classList.remove("is-visible"),requestAnimationFrame(()=>I.classList.add("is-active")),de(I),await k(980),Q==null||Q.classList.add("btfw-monkey-paw-shaking"),await k(720),Q==null||Q.classList.remove("btfw-monkey-paw-shaking"),I.classList.add("is-cursed"),J==null||J.classList.add("is-visible"),await k((oe=q.holdMs)!=null?oe:1100),I.classList.remove("is-active"),await k(320),I.remove()})().finally(()=>{b=null}),b}return{name:"feature:monkeyPaw",play:G}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:U})=>{let P=await U("util:tmdb-proxy"),L=await U("feature:monkeyPaw"),h=(l,A=document)=>A.querySelector(l),j=(l,A=document)=>Array.from(A.querySelectorAll(l)),f=null,s=null,b=null,k=null,p={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},M=null,Z=null,ce="[movie-suggestion]";function Y(...l){console.log(ce,...l)}function de(...l){console.error(ce,...l)}function W(l){var A;try{if((A=window.socket)!=null&&A.emit)return window.socket.emit("chatMsg",{msg:l}),!0}catch(B){}return!1}async function G(l,A={}){return P.workerFetch(l,A)}function q(){if(document.getElementById("btfw-movie-suggest-styles"))return;let l=document.createElement("style");l.id="btfw-movie-suggest-styles",l.textContent=`
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
    `,document.head.appendChild(l)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function K(){let l=h("a[href*='donate'], #donate-btn, .donate-btn");if(l){let B=l.closest("ul");if(B)return{ul:B,insertAfter:l.parentElement}}let A=h("#btfw-theme-btn-nav");if(A){let B=A.closest("ul");if(B)return{ul:B,insertAfter:null}}return{ul:h(".navbar .nav.navbar-nav")||h(".navbar-nav")||h(".btfw-navbar ul")||h(".navbar ul"),insertAfter:null}}function Q(){if(h("#btfw-movie-suggest-btn"))return!0;let l=K();if(!l.ul)return!1;let A=document.createElement("li"),B=document.createElement("a");return B.href="javascript:void(0)",B.className="btfw-nav-pill",B.id="btfw-movie-suggest-btn",B.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,A.appendChild(B),l.insertAfter?l.insertAfter.after(A):l.ul.insertBefore(A,l.ul.firstChild),B.addEventListener("click",F),!0}function J(){var R,m,v,i,u,x;if(h("#btfw-movie-suggest-modal"))return;let l=document.createElement("div");l.id="btfw-movie-suggest-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let A=h(".modal-background",l),B=h(".delete",l);if(A.addEventListener("click",ee),B.addEventListener("click",ee),(R=h("#btfw-movie-prev",l))==null||R.addEventListener("click",()=>{p.page>1&&(p.page-=1,ne())}),(m=h("#btfw-movie-next",l))==null||m.addEventListener("click",()=>{p.page<p.totalPages&&(p.page+=1,ne())}),I===0){let D=h("#btfw-movie-search",l);D.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),D.blur()})}else{let D,se=h("#btfw-movie-search",l);se.addEventListener("input",()=>{clearTimeout(D),p.query=se.value.trim(),p.page=1,D=setTimeout(()=>ne(),400)}),(v=h("#btfw-movie-sort",l))==null||v.addEventListener("change",z=>{p.sortBy=z.target.value,p.page=1,ne()}),(i=h("#btfw-movie-genre",l))==null||i.addEventListener("change",z=>{p.genreId=z.target.value,p.page=1,ne()}),(u=h("#btfw-movie-year",l))==null||u.addEventListener("change",z=>{p.year=z.target.value.trim(),p.page=1,ne()}),(x=h("#btfw-movie-rating",l))==null||x.addEventListener("change",z=>{p.minRating=z.target.value.trim(),p.page=1,ne()})}}function be(){if(h("#btfw-movie-confirm-modal"))return;let l=document.createElement("div");l.id="btfw-movie-confirm-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let A=h(".modal-background",l),B=h(".delete",l),R=h("#btfw-movie-cancel",l),m=h("#btfw-movie-confirm",l),v=()=>N();A.addEventListener("click",v),B.addEventListener("click",v),R.addEventListener("click",v),m.addEventListener("click",ue)}async function oe(){if(M&&Z)return;let[l,A]=await Promise.all([G("/api/meta"),G("/api/genres")]);M=l,Z=A;let B=h("#btfw-movie-suggest-modal");if(!B)return;let R=h("#btfw-movie-sort",B);if(R&&R.options.length===0){for(let v of l.sortOptions||[]){let i=document.createElement("option");i.value=v.value,i.textContent=v.label,R.appendChild(i)}R.value=p.sortBy}let m=h("#btfw-movie-genre",B);if(m&&m.options.length<=1)for(let v of A.genres||[]){let i=document.createElement("option");i.value=String(v.id),i.textContent=v.name,m.appendChild(i)}}function ve(){let l={page:p.page,sort_by:p.sortBy};return p.query?(l.query=p.query,p.year&&(l.primary_release_year=p.year,l.year=p.year)):(p.genreId&&(l.with_genres=p.genreId),p.year&&(l.primary_release_year=p.year),p.minRating&&(l["vote_average.gte"]=p.minRating)),l}function me(l){return!l||l==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${l}`}function we(){let l=h("#btfw-movie-suggest-modal");if(!l)return;let A=h("#btfw-movie-prev",l),B=h("#btfw-movie-next",l),R=h("#btfw-movie-page-label",l);R&&(R.textContent=`Page ${p.page} of ${p.totalPages}`),A&&(A.disabled=p.page<=1||p.loading),B&&(B.disabled=p.page>=p.totalPages||p.loading)}function Se(l){let A=h("#btfw-movie-suggest-modal");if(!A)return;let B=h(".btfw-movie-results",A);if(!l.length){B.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}B.innerHTML=l.map(R=>`
      <div class="movie-result"
           data-id="${R.id}"
           data-title="${R.title}"
           data-poster="${R.posterPath||""}"
           data-year="${R.releaseYear||""}">
        <div class="movie-result__poster">
          <img src="${me(R.posterPath)}" alt="${R.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${R.title}</div>
          <small style="opacity:0.7;">${R.releaseYear||"N/A"}</small>
        </div>
      </div>
    `).join(""),j(".movie-result",B).forEach(R=>{R.addEventListener("click",()=>{f=R.dataset.id,s=R.dataset.title,b=R.dataset.poster,k=R.dataset.year||null;let m=h("#btfw-movie-confirm-modal");if(!m)return;let v=k?` (${k})`:"";h("#btfw-confirm-movie-title",m).textContent=`${s}${v}`,C()})})}async function ne(){let l=h("#btfw-movie-suggest-modal");if(!l||p.loading)return;p.loading=!0,we();let A=h(".btfw-movie-results",l);A.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await oe();let B=await G("/api/search",{params:ve()});p.totalPages=Math.max(1,B.totalPages||1),Se(B.results||[]),Y("runSearch",{page:p.page,totalPages:p.totalPages,count:(B.results||[]).length})}catch(B){de("runSearch failed:",B),A.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{p.loading=!1,we()}}async function g(){let l=h("#btfw-movie-history");if(l){l.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let B=(await G("/api/history",{params:{page:1,limit:10}})).results||[];if(!B.length){l.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}l.innerHTML=B.map(R=>{let m=R.releaseYear?` (${R.releaseYear})`:"";return`
          <div class="history-item">
            <img src="${me(R.posterPath).replace("w154","w92")}" alt="${R.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${R.movieTitle}${m}</div>
              <div class="history-item__meta">Requested by ${R.username}</div>
            </div>
          </div>
        `}).join("")}catch(A){de("loadHistory failed:",A),l.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function C(){let l=h("#btfw-movie-suggest-modal"),A=h("#btfw-movie-confirm-modal");A&&(l&&l.classList.add("btfw-movie-suggest-pending"),A.classList.add("is-active"))}function N(){let l=h("#btfw-movie-suggest-modal"),A=h("#btfw-movie-confirm-modal");l&&l.classList.remove("btfw-movie-suggest-pending"),A&&A.classList.remove("is-active")}async function F(){let l=h("#btfw-movie-suggest-modal");if(l){Y("openModal",{userRank:I}),l.classList.remove("btfw-movie-suggest-pending"),l.classList.add("is-active");try{await oe(),await Promise.all([ne(),g()])}catch(A){de("openModal bootstrap failed:",A)}}}function ee(){let l=h("#btfw-movie-suggest-modal");l&&(N(),Y("closeModal"),l.classList.remove("is-active"),h("#btfw-movie-search",l).value="",h(".btfw-movie-results",l).innerHTML="",p.query="",p.page=1,p.totalPages=1,f=null,s=null,b=null,k=null)}function ie(l,A,B){let R=B?` (${B})`:"";return`\u{1F3AC} Movie request: ${A}${R} \u2014 suggested by ${l}`}async function ue(){if(!f||!s)return;let l=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";Y("confirmSuggestion",{movieId:f,movieTitle:s}),N();try{await L.play(),await G("/api/suggestions",{method:"POST",body:{movieId:Number(f),movieTitle:s,username:l,posterPath:b||null,releaseYear:k||null}}),W(ie(l,s,k)),await g(),ee()}catch(A){de("confirmSuggestion failed:",A),alert("Could not save your movie request. Please try again.")}}function pe(){Y("boot: start",{workerBase:P.getWorkerBase()}),q(),J(),be();let l=0,A=50,B=()=>{if(Q()){Y("Button added successfully");return}l+=1,l<A?setTimeout(B,100):console.warn(ce,"Failed to add button after retries",{retryCount:l})};B()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(pe,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(pe,200)}):setTimeout(pe,200),{name:"ext:movie-suggestion",open:F,close:ee,getWorkerBase:P.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async U=>U.init("ext:movie-suggestion"));})();
/*! Quiglytube player bundle entry — generated by scripts/build.js */
