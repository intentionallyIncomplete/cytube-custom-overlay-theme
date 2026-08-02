/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let D="#videowrap .video-js",P="vjs-default-skin",T="vjs-theme-city",h="vjs-big-play-centered",U=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),f={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},i="btfw-videojs-base-css",m="btfw-videojs-city-css",S=["https://vjs.zencdn.net/7.20.3/video-js.css"],u=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function C(v,A){let B=document;if(!B||!B.head||B.getElementById(v))return;let W=B.createElement("link");W.id=v,W.rel="stylesheet";let ie=Array.isArray(A)?A.slice():[A],se=()=>{if(!ie.length)return!1;let le=ie.shift();return le?(W.href=le,!0):se()};W.addEventListener("error",()=>{se()||W.remove()}),se()&&B.head.appendChild(W)}function V(){if(typeof window=="undefined"||!document.body)return!1;let v=document.createElement("div");v.className=`video-js ${P}`,v.style.position="absolute",v.style.opacity="0",v.style.pointerEvents="none",v.style.width="1px",v.style.height="1px",document.body.appendChild(v);let A=window.getComputedStyle(v).fontSize;return v.remove(),A&&Math.abs(parseFloat(A)-10)<.2}function K(){V()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||C(i,S)}function q(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||C(m,u)}function ne(v){if(!v)return null;try{return v.player||v.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(v.id)||window.videojs&&window.videojs.players&&window.videojs.players[v.id]}catch(A){return null}}function j(v){let A=ne(v);if(!A)return;let B=typeof A.getChild=="function"?A.getChild("controlBar"):null,W=B&&typeof B.getChild=="function"?B.getChild("volumePanel"):null;if(W){v.classList.add("btfw-volume-inline");try{typeof W.inline=="function"&&W.inline(!0)}catch(ie){}}}function X(){K(),q(),document.querySelectorAll(D).forEach(v=>{v.classList.contains(P)&&v.classList.remove(P),Array.from(v.classList).forEach(A=>{A.startsWith("vjs-theme-")&&A!==T&&v.classList.remove(A)}),v.classList.contains(T)||v.classList.add(T),v.classList.contains(h)||v.classList.add(h),j(v)})}function R(){var A;if(typeof window=="undefined")return;let v=(A=window.BTFW)==null?void 0:A.channelPosterUrl;v&&document.querySelectorAll(D).forEach(B=>{B.poster!==v&&(B.poster=v);try{let W=B.player||B.player_||window.videojs&&window.videojs.players&&window.videojs.players[B.id];W&&typeof W.poster=="function"&&W.poster(v)}catch(W){let ie=B.querySelector(".vjs-poster");ie&&(ie.style.backgroundImage=`url("${v}")`)}})}function I(){var B;if(typeof window=="undefined")return;let v=(B=window.PLAYER)==null?void 0:B.mediaType;document.querySelectorAll(".vjs-poster").forEach(W=>{v==="yt"||v==="dm"||v==="vi"||v==="tw"?W.classList.add("hidden"):W.classList.remove("hidden")})}function Q(){document.querySelectorAll(U).forEach(A=>{A instanceof HTMLVideoElement&&(typeof A.playsInline=="boolean"&&(A.playsInline=!0),Object.entries(f).forEach(([B,W])=>{try{A.setAttribute(B,W)}catch(ie){}}))})}function Z(){if(typeof window=="undefined")return!1;let v=window.videojs;if(!v)return!1;let A=v.dom||v;if(!A||typeof A.textContent!="function")return!1;if(A.textContent&&A.textContent._btfwOptimized)return!0;let B=A.textContent.bind(A),W=function(se,le){if(!se)return se;let ue;try{typeof se.textContent!="undefined"?ue=se.textContent:typeof se.innerText!="undefined"&&(ue=se.innerText)}catch(l){ue=void 0}if(ue!==void 0){let l=le==null?"":String(le);if(ue===l)return se}return B(se,le)};return W._btfwOptimized=!0,W._btfwOriginal=B,A.textContent=W,!0}function ee(){if(Z()){ee._tries=0;return}ee._tries>20||(ee._tries=(ee._tries||0)+1,setTimeout(ee,250))}let he="_btfwGuarded";function oe(v){if(!v)return!1;let A=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!v.closest(A)}function Ee(v){if(!v||v[he])return;v[he]=!0;let A=B=>{oe(B.target)||B.type==="click"&&B.button!==0||(B.preventDefault(),B.stopImmediatePropagation())};v.addEventListener("click",A,!0),v.addEventListener("pointerdown",B=>{oe(B.target)||(B.preventDefault(),B.stopImmediatePropagation())},!0),v.addEventListener("contextmenu",A,!0)}function pe(){document.querySelectorAll(D).forEach(Ee)}function we(){if(we._mo)return;let v=document.getElementById("videowrap")||document.body,A=new MutationObserver(B=>{var ie,se,le;let W=!1;for(let ue of B){for(let l of ue.addedNodes)if(l.nodeType===1&&((ie=l.classList)!=null&&ie.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME"||(se=l.querySelector)!=null&&se.call(l,D))){W=!0;break}for(let l of ue.removedNodes)if(l.nodeType===1&&((le=l.classList)!=null&&le.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME")){W=!0;break}}W&&(X(),pe(),Q(),R(),I(),document.querySelectorAll(D).forEach(j))});A.observe(v,{childList:!0,subtree:!0,characterData:!1}),we._mo=A}function Se(){setTimeout(()=>{Q(),R(),I(),document.querySelectorAll(D).forEach(j)},100)}function de(){if(X(),pe(),Q(),ee(),R(),I(),we(),setInterval(()=>{I()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",Se),socket.on("changeMedia",Se)}catch(v){console.warn("[feature:player] Unable to bind changeMedia handler",v)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",de):de(),document.addEventListener("btfw:layoutReady",()=>setTimeout(de,0)),{name:"feature:player",applyCityTheme:X,attachGuards:pe,ensureInlinePlayback:Q,applyPosterUrl:R,togglePosterVisibility:I,shouldAllowClick:oe}});function Pe(D=document){return!D||typeof D.querySelector!="function"?!1:!!(D.querySelector("#pollwrap .well.active")||D.querySelector("#pollwrap .well.muted")||D.querySelector("#pollwrap .poll-menu"))}function Ce(D,P){return D!=null?!!D:!!P}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:D})=>{let P=await D("util:templates"),{stack:T}=P,h="btfw-stack-order",U="btfw-stack-motd-open",f="btfw-stack-playlist-open",i="btfw-stack-poll-open",m={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},S=m,u={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},C={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},V={"motd-group":1,"poll-group":2,"playlist-group":3},K=!1,q=null,ne="",j=null,X=null,R=null,I={"motd-group":{storageKey:U,getDefaultOpen:e=>Ce(e,v()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:f,getDefaultOpen:e=>Ce(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:i,getDefaultOpen:e=>Ce(e,Pe()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},Q=null,Z=!1,ee=!1,he=null,oe=!1,Ee=!1,pe=!1,we=null,Se=!1;function de(e=""){let t=String(e||"").trim();if(!t)return!0;if(typeof document!="undefined"){let n=document.createElement("div");return n.innerHTML=t,!(n.textContent||"").replace(/\u00a0/g," ").trim()}return!t.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function v(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=A(e);return t?!de(t.innerHTML||""):!1}function A(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let B=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],W=["#main","#mainpage","#mainpane"],ie=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function se(e,t,n){if(!e||!t||!n)return null;let a=ie.map(z=>{let G=document.getElementById(z.id);return G?{...z,el:G}:null}).filter(Boolean);if(!a.length){let z=document.getElementById("btfw-addmedia-panel");return z&&z.remove(),null}let o=document.getElementById("btfw-addmedia-panel");if(o||(o=document.createElement("section"),o.id="btfw-addmedia-panel",o.className="btfw-addmedia-panel",o.dataset.open="false",o.setAttribute("role","region"),o.setAttribute("aria-label","Add media controls"),o.setAttribute("aria-hidden","true"),o.setAttribute("hidden","hidden"),o.innerHTML=T.addMediaPanelHtml()),o.parentElement!==e){let z=t.parentElement===e?t.nextSibling:null;e.insertBefore(o,z)}let d=o.querySelector(".btfw-addmedia-tabs"),w=o.querySelector(".btfw-addmedia-views"),y=o.querySelector(".btfw-addmedia-close");if(!d||!w)return null;for(;d.firstChild;)d.removeChild(d.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);a.forEach(({id:z,title:G,el:O})=>{O.classList.remove("collapse","in","plcontrol-collapse"),O.style.removeProperty("display"),O.style.removeProperty("height"),O.removeAttribute("aria-expanded"),O.setAttribute("role","tabpanel"),O.setAttribute("data-btfw-addmedia","panel");let me=document.createElement("button");me.type="button",me.className="btfw-addmedia-tab",me.dataset.target=z,me.textContent=G,me.setAttribute("role","tab"),d.appendChild(me);let fe=document.createElement("div");fe.className="btfw-addmedia-view",fe.dataset.target=z,fe.setAttribute("role","tabpanel"),fe.setAttribute("aria-hidden","true"),fe.appendChild(O),w.appendChild(fe)});let x=a.find(z=>z.default)||a[0],E=z=>{let G=z||o.dataset.active||x.id;o.dataset.active=G,d.querySelectorAll(".btfw-addmedia-tab").forEach(O=>{let me=O.dataset.target===G;O.classList.toggle("is-active",me),O.setAttribute("aria-selected",me?"true":"false"),O.setAttribute("tabindex",me?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(O=>{let me=O.dataset.target===G;O.classList.toggle("is-active",me),O.setAttribute("aria-hidden",me?"false":"true")})},H=z=>{let G=z!=null?!!z:o.dataset.open!=="true";return o.dataset.open=G?"true":"false",o.classList.toggle("is-open",G),o.setAttribute("aria-hidden",G?"false":"true"),G?(o.removeAttribute("hidden"),E(o.dataset.active||x.id)):o.setAttribute("hidden","hidden"),o.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:G}})),G};return o._btfwWired||(d.addEventListener("click",z=>{let G=z.target.closest(".btfw-addmedia-tab");G&&(z.preventDefault(),E(G.dataset.target))}),y&&y.addEventListener("click",()=>H(!1)),o._btfwWired=!0),E(o.dataset.active||x.id),o._btfwToggle=H,o._btfwSetActive=E,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:G,target:O})=>{let me=document.getElementById(G);me&&me.dataset.btfwAddmedia!==O&&(me.dataset.btfwAddmedia=O,me.setAttribute("aria-controls","btfw-addmedia-panel"),me.addEventListener("click",fe=>{fe.preventDefault(),fe.stopPropagation(),E(O),H(!0),me.blur()}))})})(),{panel:o,toggle:H,setActive:E}}function le(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),a=document.getElementById("btfw-video-overlay"),o=a&&n&&a.parentElement===n.parentElement?a:n;o&&o.parentElement?o.nextSibling?o.parentNode.insertBefore(t,o.nextSibling):o.parentNode.appendChild(t):e.appendChild(t);let d=document.createElement("div");d.className="btfw-stack-list",t.appendChild(d);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function ue(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let d=t.querySelector(":scope > #motd");return d?{motdwrap:t,motd:d}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let a=[];t.querySelectorAll(".btfw-motd-editrow").forEach(d=>{let w=(d.textContent||"").trim();w&&a.push(`<p>${w}</p>`),d.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(d=>{d.contains(t)||d===t||((d.querySelector("#motd")||d.classList.contains("btfw-motd-editrow"))&&d.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&a.push(w.innerHTML)}),d.remove())});let o=t.querySelector(":scope > #motd");if(o||(o=document.createElement("div"),o.id="motd",t.appendChild(o)),t.querySelectorAll("#motd").forEach(d=>{d!==o&&((d.innerHTML||"").trim()&&a.push(d.innerHTML),d.remove())}),o.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(d=>{d.remove()}),o.querySelectorAll("#motd").forEach(d=>{(d.innerHTML||"").trim()&&a.push(d.innerHTML),d.remove()}),document.querySelectorAll("#togglemotd").forEach((d,w)=>{w!==0&&d.remove()}),a.length){let d=a.join("").trim();d&&de(o.innerHTML)?o.innerHTML=d:d&&(o.innerHTML+=d)}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:o}}function l(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),a=document.getElementById("playlistwrap"),o=document.getElementById("queuecontainer"),d=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),y=document.querySelectorAll(".btfw-controls-row"),x=d||a||o||w;if(!x)return;let E=e;E?E.classList.add("btfw-plbar"):(E=document.createElement("div"),E.id="btfw-plbar",E.className="btfw-plbar");let H=E.querySelector(".btfw-plbar__layout"),ae,z;if(H)ae=H.querySelector(".btfw-plbar__primary")||H,z=H.querySelector(".btfw-plbar__aside")||H;else{for(H=document.createElement("div"),H.className="btfw-plbar__layout",ae=document.createElement("div"),ae.className="btfw-plbar__primary",z=document.createElement("div"),z.className="btfw-plbar__aside",H.append(ae,z);E.firstChild;)ae.appendChild(E.firstChild);E.appendChild(H);let te=ae.querySelector(".field.has-addons");te&&te.classList.add("btfw-plbar__search");let ve=ae.querySelector("#btfw-pl-count");ve&&(ve.classList.add("btfw-plbar__count"),z.appendChild(ve))}E.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(te=>te.remove());let G=E.querySelector(".btfw-plbar__actions");G||(G=document.createElement("div"),G.className="btfw-plbar__actions",(z||E).appendChild(G));let O=document.getElementById("btfw-addmedia-btn"),me=te=>{if(te){if(te.classList.add("btfw-plbar__action-btn"),te.tagName==="BUTTON"||te.tagName==="A")te.classList.add("button","is-dark","is-small");else if(te.tagName==="INPUT"){let ve=(te.type||"").toLowerCase();ve==="button"||ve==="submit"||ve==="reset"?te.classList.add("button","is-dark","is-small"):te.classList.remove("button","is-dark","is-small")}}};E.parentElement!==x&&x.insertBefore(E,x.firstChild);let fe=se(x,E,G);fe?!O||!document.body.contains(O)?(O=document.createElement("button"),O.id="btfw-addmedia-btn",O.type="button",O.className="button is-small",O.innerHTML=T.addMediaButtonHtml(),G.prepend(O)):G.contains(O)||G.prepend(O):O&&(O.parentElement&&O.parentElement.removeChild(O),O=null);let Ae=te=>{if(!te)return;Array.from(te.children||[]).forEach(Te=>{Te&&(Te.classList.add("btfw-plbar__control"),G.appendChild(Te))})};if(n&&(Ae(n),n.remove()),t&&(Ae(t),t.remove()),G.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(me),fe&&O){O.classList.remove("is-dark"),O.classList.add("is-primary"),O.dataset.iconified||(O.innerHTML=T.addMediaButtonHtml(),O.dataset.iconified="1"),O.setAttribute("aria-controls","btfw-addmedia-panel");let te=Te=>{O.setAttribute("aria-expanded",Te?"true":"false")};O.dataset.btfwBound||(O.dataset.btfwBound="1",O.addEventListener("click",Te=>{Te.preventDefault();let ot=document.getElementById("btfw-addmedia-panel"),it=ot&&ot._btfwToggle,gt=typeof it=="function"?it():!1;te(gt)}));let ve=fe.panel||document.getElementById("btfw-addmedia-panel");ve&&(te(ve.dataset.open==="true"),ve._btfwButtonSync||(ve.addEventListener("btfw:addmedia:state",Te=>{te(!!(Te.detail&&Te.detail.open))}),ve._btfwButtonSync=!0))}y.forEach(te=>{te&&!x.contains(te)&&(te.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,te.remove(),x.appendChild(te),console.log("[stack] Moved floating controls row into playlist container"))}),x.contains(E)||x.insertBefore(E,x.firstChild),E.dataset.btfwMerged="1"}function M(e,t){if(e.id==="motd-group"&&(ue(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Ie(),l(),t=t.filter(y=>y&&y.id!=="rightcontrols"&&y.id!=="pollwrap").filter(y=>!y.querySelector||!y.querySelector("#pollwrap"))),e.id==="poll-group"&&(Ie(),Ue(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(y=>y&&!n.contains(y)&&!y.contains(n)));let a=document.createElement("section");a.className="btfw-stack-item btfw-group-item",a.dataset.bind=e.id,a.dataset.group="true";let o=document.createElement("header");o.className="btfw-stack-item__header",o.innerHTML=T.stackGroupHeaderHtml(e.title);let d=document.createElement("div");d.className="btfw-stack-item__body btfw-group-body",t.forEach(y=>{if(y&&y.parentElement!==d&&!d.contains(y)&&!y.contains(d))try{d.appendChild(y)}catch(x){console.warn("[stack] Failed to move element:",y.id||y.className,x)}}),a.appendChild(o),a.appendChild(d);let w=I[e.id];return w&&ut(a,w),Ke(a,e.id),a.querySelector(".btfw-up").onclick=function(){let y=a.parentElement,x=a.previousElementSibling;x&&y.insertBefore(a,x),N(y)},a.querySelector(".btfw-down").onclick=function(){let y=a.parentElement,x=a.nextElementSibling;x?y.insertBefore(x,a):y.appendChild(a),N(y)},a}function N(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(h,JSON.stringify(t))}catch(t){}}function $(){try{return JSON.parse(localStorage.getItem(h)||"[]")}catch(e){return[]}}function p(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function g(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function r(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),a=localStorage.getItem(n);return a!==null?a==="true":!1}catch(t){return!1}}function b(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function _(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function F(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function ce(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Pe()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function Y(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Be())}function ge(e){Y(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function be(e,t,n){if(!e||F(e))return;let a=p(t),o=typeof n=="function"?n(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}function Le(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,a=document.getElementById("btfw-stack"),o=document.getElementById("btfw-leftpad"),d=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",n),a.classList.toggle("btfw-stack--all-docked",n)),o&&o.classList.toggle("btfw-leftpad--stack-hidden",n),d&&d.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function _e(){var a;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let o=document.createElement("div");o.id="btfw-panel-bar",o.className="btfw-panel-bar",o.setAttribute("role","toolbar"),o.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(o)}let n=t.querySelector("#btfw-panel-bar");return ye(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),K||(ct(),K=!0),(a=document.getElementById("btfw-stack-drawer"))==null||a.remove(),t}function s(e){e.preventDefault(),e.stopPropagation(),lt()}function c(){let e=_e();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=T.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",s),t.dataset.btfwPanelsWired="1"),t}function k(e){if(!e)return null;let t=Array.from(e.classList).find(a=>a.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let a=n(e).data("uid");if(a!=null&&a!=="")return a}return e.dataset.uid||null}function L(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),a=n==null?void 0:n.querySelector(".qbtn-play");return a?(a.click(),!0):!1}function J(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),a=document.getElementById("queue_next");if(n&&a&&(n.value=t,!a.disabled))return a.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let o=window.socket;if(o&&typeof parseMediaLink=="function")try{let d=parseMediaLink(t);if((d==null?void 0:d.id)!=null&&(d!=null&&d.type))return o.emit("queue",{id:d.id,type:d.type,pos:"next",temp:!1}),!0}catch(d){}return!1}function re(e){le();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(j&&(clearTimeout(j),j=null),q=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),ke(),He(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function ye(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var d,w,y;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let x=n.dataset.panelGroup||((d=n.closest(".btfw-panel-btn"))==null?void 0:d.dataset.group);x&&re(x);return}let a=t.target.closest(".btfw-panel-playlist__play");if(a){t.preventDefault(),t.stopPropagation(),L(a.dataset.queueUid);return}let o=t.target.closest(".btfw-panel-playlist__add");if(o){t.preventDefault(),t.stopPropagation();let x=(w=o.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!x)return;let E=x.hidden;x.hidden=!E,o.setAttribute("aria-expanded",E?"true":"false"),E&&((y=x.querySelector(".btfw-panel-playlist__link-input"))==null||y.focus())}}),e.addEventListener("submit",t=>{var w,y,x,E;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let a=n.querySelector(".btfw-panel-playlist__link-input"),o=(w=a==null?void 0:a.value)==null?void 0:w.trim();if(!o||!J(o))return;a.value="",n.hidden=!0,(x=(y=n.closest(".btfw-panel-container"))==null?void 0:y.querySelector(".btfw-panel-playlist__add"))==null||x.setAttribute("aria-expanded","false");let d=(E=n.closest(".btfw-panel-container"))==null?void 0:E.querySelector(".btfw-panel-playlist__queue");d&&qe(d)}))}function ke(){if(X){try{X.disconnect()}catch(e){}X=null}R=null}function xe(e){if(!e||R===e)return;ke();let t=document.getElementById("queue");t&&(R=e,X=new MutationObserver(()=>{e.isConnected&&q==="playlist-group"&&qe(e)}),X.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Me(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),a=n.findIndex(d=>d.classList.contains("queue_active")||d.classList.contains("playing")),o=a>=0?a+1:0;return n.slice(o,o+e)}function qe(e){if(!e)return;let t=Me(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var x,E;let a=document.createElement("div");a.className="btfw-panel-playlist__item";let o=document.createElement("span");o.className="btfw-panel-playlist__title",o.textContent=(((x=n.querySelector(".qe_title"))==null?void 0:x.textContent)||"Untitled").trim();let d=document.createElement("span");d.className="btfw-panel-playlist__meta",d.textContent=(((E=n.querySelector(".qe_time"))==null?void 0:E.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let y=k(n);if(y!=null&&y!==""){let H=document.createElement("button");H.type="button",H.className="btfw-panel-playlist__play",H.textContent="Play",H.dataset.queueUid=String(y),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(H.disabled=!0),w.appendChild(H)}a.append(o,d,w),e.appendChild(a)})}function Ye(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=T.panelUndockIconHtml(),n}function rt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=T.playlistAddFormHtml(),e}function at(e,t,n){let a=document.createElement("div");if(a.className="btfw-panel-container",n>0&&(a.style.bottom=`${-n*50}px`),e==="playlist-group"){a.classList.add("btfw-panel-container--playlist");let d=document.createElement("div");d.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let y=Ye(e,t);d.append(w,y);let x=rt(),E=document.createElement("div");return E.className="btfw-panel-container__host btfw-panel-playlist__queue",a.append(d,x,E),a}a.classList.add("btfw-panel-container--dock-only");let o=document.createElement("div");return o.className="btfw-panel-container__dock-only",o.appendChild(Ye(e,t)),a.appendChild(o),a}function Re(){j&&(clearTimeout(j),j=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{ge(e)}),ke(),q=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function Fe(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||Re()}function st(){Fe(!1)}function lt(){_e();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||Fe(!e.classList.contains("open"))}function Ve(e){j&&clearTimeout(j),j=setTimeout(()=>{j=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),q===e&&(q=null,ke()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function De(e,t){if(t&&(j&&(clearTimeout(j),j=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),q=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(qe(n),xe(n))}}function ct(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{q&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),Re()))}))}function Ge(e,t){var a;if(!((a=document.getElementById("btfw-panel-bar"))!=null&&a.classList.contains("open")))return;if(j&&(clearTimeout(j),j=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),q===e&&(q=null,ke()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(o=>{o!==t&&delete o.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",De(e,t)}function dt(e,t){let n=e.querySelector(".btfw-panel-container"),a=()=>{var o;(o=document.getElementById("btfw-panel-bar"))!=null&&o.classList.contains("open")&&(j&&(clearTimeout(j),j=null),De(t,e))};e.addEventListener("mouseenter",a),e.addEventListener("focusin",a),e.addEventListener("click",o=>{o.target.closest(".btfw-panel-container")||(o.preventDefault(),o.stopPropagation(),Ge(t,e))}),e.addEventListener("keydown",o=>{o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),Ge(t,e))}),e.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(o.relatedTarget)||Ve(t))}),n==null||n.addEventListener("mouseenter",()=>{j&&(clearTimeout(j),j=null)}),n==null||n.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(o.relatedTarget)||Ve(t))})}function $e(){let e=_e();c();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((y,x)=>(V[y.dataset.bind]||99)-(V[x.dataset.bind]||99)),a=n.map(y=>y.dataset.bind).join("|"),o=document.getElementById("btfw-panels-menu-btn");if(o&&(o.hidden=n.length===0,n.length===0)){ne="",st();return}if(a===ne&&t.childElementCount===n.length)return;ne=a;let d=t.classList.contains("open"),w=q;if(Re(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((y,x)=>{let E=y.dataset.bind,H=u[E]||{short:"?",title:E},ae=document.createElement("div");ae.className="btfw-panel-btn",ae.dataset.group=E,ae.title=H.title,ae.setAttribute("role","button"),ae.setAttribute("aria-label",H.title),ae.tabIndex=0;let z=document.createElement("span");z.className="btfw-panel-btn__label",z.textContent=C[E]||H.short,ae.appendChild(z),ae.appendChild(at(E,H,x)),t.appendChild(ae),dt(ae,E)}),d&&(Fe(!0),w&&n.some(x=>x.dataset.bind===w))){let x=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);x&&De(w,x)}}function He(e,t,n={}){if(!e)return;let a=!!t,o=n.persist===!1,d=e.dataset.bind,w=m[d];e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let y=e.querySelector(".btfw-stack-dock-btn");y&&(y.setAttribute("aria-pressed",a?"true":"false"),y.title=a?"Pinned to panels menu":"Dock to panels menu"),a?F(e)?ge(e):q===d&&(q=null):(ge(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!o&&w&&b(w,a),$e(),Le()}function Ke(e,t){var x;let n=m[t];if(!n)return;let a=e.querySelector(".btfw-stack-item__header"),o=a==null?void 0:a.querySelector(".btfw-stack-header-toolbar"),d=o==null?void 0:o.querySelector(".btfw-stack-arrows");if(!d||d.querySelector(".btfw-stack-dock-btn"))return;let w=r(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let y=document.createElement("button");y.type="button",y.className="btfw-arrow btfw-stack-dock-btn",y.textContent="\u2AF7",y.setAttribute("aria-label",`Dock ${((x=u[t])==null?void 0:x.title)||t} to panels menu`),y.setAttribute("aria-pressed",w?"true":"false"),y.title=w?"Pinned to panels menu":"Dock to panels menu",y.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),e.dataset.docked!=="true"&&He(e,!0)}),d.insertBefore(y,d.firstChild)}function vt(){return p(f)}function Et(e){g(f,e)}function xt(){return p(i)}function St(e){g(i,e)}function ut(e,t={}){let{storageKey:n,getDefaultOpen:a,toggleClass:o,ariaLabel:d="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:y="Show panel"}=t,x=p(n),E=typeof a=="function"?a(x):x!==null?x:!0;e.hasAttribute("data-open")||(e.dataset.open=E?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let H=e.querySelector(".btfw-stack-item__header"),ae=H&&H.querySelector(".btfw-stack-arrows");if(!ae||ae.querySelector(`.${o}`))return;let z=document.createElement("button");z.type="button",z.className=`btfw-arrow ${o}`,z.setAttribute("aria-label",d),z.style.display="flex",z.style.alignItems="center",z.style.justifyContent="center";let G=()=>{let fe=e.dataset.open!=="false";z.textContent=fe?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",z.title=fe?w:y,z.setAttribute("aria-expanded",fe?"true":"false"),e.classList.toggle("is-open",fe)},O=(fe,Ae={})=>{let te=!!fe,ve=Ae.persist===!1;ve&&(e._btfwSuppressPersist=!0),e.dataset.open=te?"true":"false",G(),ve||g(n,te),ve&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};z.addEventListener("click",fe=>{fe.preventDefault(),fe.stopPropagation(),O(e.dataset.open==="false")}),G(),new MutationObserver(fe=>{for(let Ae of fe)Ae.type==="attributes"&&(G(),e._btfwSuppressPersist||g(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),ae.insertBefore(z,ae.firstChild),e._btfwSetOpenState=O,Ke(e,e.dataset.bind)}function Ie(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function ze(e){ue();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(a){let o=a.querySelector(".btfw-group-body");o&&!o.contains(t)&&o.appendChild(t)}else{let o=B.find(d=>d.id==="motd-group");if(!o)return;a=M(o,[t]),a&&(n.appendChild(a),N(n))}ft(a)}function ft(e){let t=document.getElementById("motdwrap");if(!t)return;let n=v();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let a=A();a&&a.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let a=p(U),o=Ce(a,!0);e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}}function je(e){he&&clearTimeout(he),he=setTimeout(()=>{he=null,ze(e)},50)}function mt(e){let t=A();t&&(oe||(oe=!0,new MutationObserver(()=>{je(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function pt(e){Ee||!window.socket||!window.socket.on||(Ee=!0,window.socket.on("setMotd",()=>{je(e)}))}function Xe(e){let t=le(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let a=ue(!0),o=(a==null?void 0:a.motd)||A();o&&typeof e=="string"&&(o.innerHTML=e);let d=document.getElementById("cs-motdtext");d&&typeof e=="string"&&(d.value=e),t&&je(t)}function We(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,a=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||a==="video")return;Ie(),Ue();let o=e&&e.list;if(!o)return;let d=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!d){let x=B.find(E=>E.id==="poll-group");if(!x)return;d=M(x,[t]),d&&(o.appendChild(d),N(o));return}let w=d.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&y.contains(t)&&w&&w.appendChild(t)}function Qe(e,t={}){We(e),Be();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Ne(e,t={}){Q&&clearTimeout(Q),Q=setTimeout(()=>{Q=null,Qe(e,t)},50)}function bt(e){if(Z)return;let t=document.getElementById("pollwrap");if(!t)return;Z=!0,new MutationObserver(()=>{Ne(e,{forceOpen:Pe()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let a=document.getElementById("newpollbtn");a&&!a.dataset.btfwPollSync&&(a.dataset.btfwPollSync="1",a.addEventListener("click",()=>{Ne(e,{forceOpen:!0})}))}function ht(e){ee||!window.socket||!window.socket.on||(ee=!0,window.socket.on("newPoll",()=>Ne(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Ne(e)))}function yt(e){return!!e.closest('.modal, [role="dialog"]')}function Je(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(a=>!yt(a));n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function Ze(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let a=n.querySelector(".btfw-stack-header-actions");if(!a){a=document.createElement("span"),a.className="btfw-stack-header-actions";let o=n.querySelector(".btfw-stack-header-toolbar"),d=(o==null?void 0:o.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");o&&d?o.insertBefore(a,d):d?n.insertBefore(a,d):n.appendChild(a)}return a}function et(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Be(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Pe();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function tt(){let e=Ze("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){et(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let o=document.querySelector("#pollwrap > .poll-controls");o&&o.children.length===0&&o.remove()}let n=Ze("motd-group"),a=document.getElementById("btfw-motd-editbtn");if(n&&a){et(a,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),a.parentElement!==n&&n.appendChild(a);let o=a.closest(".btfw-motd-editrow");o&&o.parentElement&&o.remove()}}function Ue(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(a=>{let o=t.querySelector(".poll-controls");o||(o=document.createElement("div"),o.className="poll-controls",t.insertBefore(o,t.firstChild)),a.parentElement!==o&&o.appendChild(a)}),e.children.length===0&&e.remove())}function wt(e){return B.every(t=>t.selectors.some(a=>{var d,w;if(W.includes(a))return!1;let o=document.querySelector(a);if(!o||e.contains(o)||o.contains(e))return!1;if(a==="#pollwrap"){let y=(d=o.dataset)==null?void 0:d.btfwPollOverlay,x=(w=o.getAttribute)==null?void 0:w.call(o,"data-btfw-poll-overlay");if(y==="video"||x==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function Oe(e){if(!pe){pe=!0;try{let t=e.list,n=e.footer;if(wt(t)&&t.children.length>0){ze(e),We(e),Be(),tt(),Je(n);return}Ue(),Ie();let a=new Map;B.forEach(w=>{let y=[];w.selectors.forEach(x=>{let E=document.querySelector(x);if(E&&!(t.contains(E)||E.contains(t))&&!W.includes(x)){if(x==="#pollwrap"){let H=E.dataset&&E.dataset.btfwPollOverlay,ae=E.getAttribute&&E.getAttribute("data-btfw-poll-overlay");if(H==="video"||ae==="video")return}y.push(E)}}),y.length>0&&a.set(w.id,{group:w,elements:y})});let o=$(),d=[];a.forEach(({group:w,elements:y},x)=>{if(!Array.from(t.children).find(H=>H.dataset.bind===x))try{let H=M(w,y);H&&d.push({item:H,id:x,priority:w.priority,isGroup:!0})}catch(H){console.warn("[stack] Failed to create group item:",x,H)}}),o.length>0?d.sort((w,y)=>{let x=o.findIndex(H=>H.id===w.id),E=o.findIndex(H=>H.id===y.id);return x>=0&&E>=0?x-E:x>=0?-1:E>=0?1:w.priority-y.priority}):d.sort((w,y)=>w.priority-y.priority),d.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(y){console.warn("[stack] Failed to add item to list:",y)}}),N(t),ze(e),We(e),Be(),tt(),Je(n)}finally{pe=!1}}}function nt(){let e=le();if(!e||(Oe(e),mt(e),pt(e),bt(e),ht(e),Se))return;Se=!0;let t=new MutationObserver(()=>{we||(we=requestAnimationFrame(()=>{we=null,Oe(e)}))}),n=document.getElementById("btfw-leftpad"),a=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),a&&t.observe(a,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&be(w,U,E=>Ce(E,v()));let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&be(y,f,E=>E!==null?!!E:!0);let x=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');x&&be(x,i,E=>Ce(E,Pe())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(E=>{let H=m[E.dataset.bind];H&&He(E,r(H),{persist:!1})}),_e(),c(),$e(),Qe(e),Le()},1e3);let o=0,d=setInterval(()=>{Oe(e),++o>2&&clearInterval(d)},700)}return document.addEventListener("btfw:layoutReady",nt),document.addEventListener("btfw:chat:barsReady",()=>{_e(),c(),$e()}),setTimeout(nt,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=le();e&&setTimeout(()=>Oe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Xe(t)}),{name:"feature:stack",hasMotdContent:v,resolveMotdHost:A,normalizeMotdStructure:ue,applyMotdUpdate:Xe}});BTFW.define("feature:videoOverlay",[],async()=>{let D=(s,c=document)=>c.querySelector(s),P=["#mediarefresh","#voteskip","#fullscreenbtn"],T={localSubs:"btfw:video:localsubs"},h=5,U={owner:["chanowner","owner","founder","admin","administrator"]};function f(){var s;try{return((s=window.PLAYER)==null?void 0:s.mediaType)||null}catch(c){return null}}function i(){let s=(f()||"").toLowerCase();return s==="fi"||s==="gd"}function m(){try{return window.CLIENT||window.client||null}catch(s){return null}}function S(){try{return window.CHANNEL||window.channel||null}catch(s){return null}}function u(){let s=S();if(s&&typeof s.perms=="object"&&s.perms)return s.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(c){return{}}}function C(s=[]){let c=u();for(let k of s){let L=c==null?void 0:c[k];if(typeof L=="number")return L}}function V(){let s=C(U.owner);return typeof s=="number"?s:h}function K(s){if(!s)return!1;try{if(typeof s.hasPermission=="function"&&s.hasPermission("chanowner"))return!0}catch(c){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(c){}return!1}function q(){let s=m();if(!s)return!1;let c=Number(s.rank);return Number.isFinite(c)?!!(c>=V()||K(s)):!1}let ne=()=>{try{return localStorage.getItem(T.localSubs)!=="0"}catch(s){return!0}},j=s=>{try{localStorage.setItem(T.localSubs,s?"1":"0")}catch(c){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!s}}))},X=0,R=0,I=0,Q=2e3,Z=8e3,ee=45e3,he=12e4,oe=Z,Ee=!1,pe=null;function we(){if(D("#btfw-vo-css"))return;let s=document.createElement("style");s.id="btfw-vo-css",s.textContent=`
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
    `,document.head.appendChild(s)}function Se(s){let c=D("#videowrap");!c||!s||((s.parentElement!==c.parentElement||s.previousElementSibling!==c)&&c.insertAdjacentElement("afterend",s),s.classList.add("btfw-vo-visible"))}function de(){if(!D("#videowrap"))return null;let c=D("#btfw-video-overlay");c||(c=document.createElement("div"),c.id="btfw-video-overlay",c.setAttribute("data-testid","btfw-video-overlay")),c.classList.add("btfw-video-overlay"),c.getAttribute("data-testid")||c.setAttribute("data-testid","btfw-video-overlay"),Se(c);let k=c.querySelector("#btfw-vo-bar");k||(k=document.createElement("div"),k.className="btfw-vo-bar",k.id="btfw-vo-bar",c.appendChild(k));let L=A(c,k);return Le(L.left),l(L),M(L),v(c),c}function v(s){s&&s.querySelectorAll("button").forEach(c=>{c.classList.contains("btfw-vo-btn")||c.classList.add("btfw-vo-btn")})}function A(s,c){let k="btfw-vo-left",L="btfw-vo-right",J=c.querySelector(`#${k}`);J||(J=document.createElement("div"),J.id=k,J.className="btfw-vo-section btfw-vo-section--left",c.insertBefore(J,c.firstChild));let re=c.querySelector(`#${L}`);return re||(re=document.createElement("div"),re.id=L,re.className="btfw-vo-section btfw-vo-section--right",c.appendChild(re)),Array.from(c.children).forEach(ye=>{ye===J||ye===re||re.appendChild(ye)}),s.dataset.leftSection=`#${k}`,s.dataset.rightSection=`#${L}`,c.dataset.leftSection=`#${k}`,c.dataset.rightSection=`#${L}`,{left:J,right:re}}function B(){return document.querySelector("#ytapiplayer video, video")}function W(s=B()){return s?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof s.webkitShowPlaybackTargetPicker=="function":!1}function ie(){if(!pe)return;let s=pe._btfwAirplayHandler;if(s){try{pe.removeEventListener("webkitplaybacktargetavailabilitychanged",s)}catch(c){}delete pe._btfwAirplayHandler}pe=null}function se(s){if(!s||typeof s.addEventListener!="function"){ie();return}if(pe===s)return;ie();let c=k=>{let L=!k||k.availability==="available",J=D("#btfw-airplay");J&&(J.style.display=L?"":"none")};try{s.addEventListener("webkitplaybacktargetavailabilitychanged",c),s._btfwAirplayHandler=c,pe=s}catch(k){}}function le(){let s=D("#btfw-airplay");if(!s)return;let c=B();if(!W(c)){s.style.display="none",ie();return}s.style.display="",se(c)}function ue(s,c){c&&c.classList.add("btfw-vo-visible")}function l(s){if(!(s!=null&&s.right)||!(s!=null&&s.left))return;let c=[];document.querySelector("#fullscreenbtn")||c.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:p,section:"right"}),c.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:b,section:"right"}),c.forEach(k=>{let L=document.querySelector(`#${k.id}`),J=k.section==="left"?s.left:s.right;L?J&&L.parentElement!==J&&J.appendChild(L):(L=document.createElement("button"),L.id=k.id,L.className="btfw-vo-btn",L.innerHTML=`<i class="${k.icon}"></i>`,L.title=k.tooltip,L.addEventListener("click",k.action),(J||s.right).appendChild(L))}),le()}function M(s){let c=s==null?void 0:s.right;c&&P.forEach(k=>{let L=document.querySelector(k);if(!L)return;if(L.dataset.btfwOverlay==="1"){L.parentElement!==c&&c.appendChild(L);return}let J=document.createElement("span");J.hidden=!0,J.setAttribute("data-btfw-ph",k);try{L.insertAdjacentElement("afterend",J)}catch(re){}if(L.classList.add("btfw-vo-adopted"),L.dataset.btfwOverlay="1",L.id==="mediarefresh"){let re=L.onclick;L.onclick=ye=>{ye.preventDefault();let ke=!!(ye&&ye.isTrusted);$(()=>{if(typeof re=="function")try{return re.call(L,ye),!0}catch(xe){console.warn("[video-overlay] native refresh handler failed:",xe)}return!1},{isUserAction:ke})}}c.appendChild(L)})}function N(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(s){console.warn("[video-overlay] Media refresh failed:",s)}return!1}function $(s,c={}){let{isUserAction:k=!1}=c,L=Date.now();if(I&&L-I>he&&(oe=Z,X=0),L<R){let xe=Math.ceil((R-L)/1e3);return _(k?`Refresh available in ${xe}s`:`Auto refresh paused. Next attempt in ${xe}s`,"warning"),!1}let J=k?Q:oe;if(I&&L-I<J){let xe=J-(L-I),Me=Math.ceil(xe/1e3);return R=L+xe,_(k?`Refresh available in ${Me}s`:`Auto refresh paused. Next attempt in ${Me}s`,"warning"),!1}if(X++,X>=10)return R=L+3e4,X=0,_("Refresh limit reached. 30s cooldown active.","error"),!1;let re=k?6e3:Math.max(12e3,oe+2e3);setTimeout(()=>{X>0&&X--},re);let ye=!1;if(typeof s=="function")try{ye=s()===!0}catch(xe){console.warn("[video-overlay] Refresh handler error:",xe)}return ye||(ye=N()),I=Date.now(),k?oe=Z:oe=Math.min(ee,Math.max(Z,Math.round(oe*(ye?1.25:1.5)))),R=Math.max(R,I+(k?Q:oe)),!k&&ye?_(`Auto refresh sent. Next attempt in ${Math.ceil(oe/1e3)}s`,"info"):_(ye?"Media refreshed":"Unable to refresh media",ye?"success":"error"),ye}function p(){let s=D("#videowrap");s&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen())}function g(s,c=!0){if(!s||!W(s))return!1;if(s.setAttribute("airplay","allow"),s.setAttribute("x-webkit-airplay","allow"),c&&typeof s.webkitShowPlaybackTargetPicker=="function")try{s.webkitShowPlaybackTargetPicker()}catch(k){console.warn("[video-overlay] AirPlay picker failed:",k)}return le(),!0}function r(){if(!(Ee||!window.socket)){Ee=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let s=B();s&&(g(s,!1),se(s)),le()},1e3)})}catch(s){console.warn("[video-overlay] Failed to attach AirPlay listener:",s)}}}function b(){let s=B();return W(s)?g(s)?(_("AirPlay enabled","success"),r(),!0):(_("AirPlay not available","warning"),!1):(le(),_("AirPlay not available","warning"),!1)}function _(s,c="info"){let k=document.getElementById("btfw-notification");k||(k=document.createElement("div"),k.id="btfw-notification",k.className="btfw-notification",document.body.appendChild(k)),k.textContent=s,k.className=`btfw-notification btfw-notification--${c} btfw-notification--show`,clearTimeout(k._hideTimer),k._hideTimer=setTimeout(()=>{k.classList.remove("btfw-notification--show")},3e3)}function F(){return D("video")}function ce(s){let c=(s||"").replace(/\r\n/g,`
`).trim()+`
`;return c=c.replace(/^\d+\s*$\n/gm,""),c=c.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),c=c.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+c}async function Y(){let s=F();if(!s){be("Local subs only for HTML5 sources.");return}let c=document.createElement("input");c.type="file",c.accept=".vtt,.srt,text/vtt,text/plain",c.style.display="none",document.body.appendChild(c);let k=new Promise(L=>{c.addEventListener("change",async()=>{let J=c.files&&c.files[0];if(document.body.removeChild(c),!J)return L(!1);try{let re=await J.text(),ke=(J.name.split(".").pop()||"").toLowerCase()==="srt"?ce(re):re.startsWith("WEBVTT")?re:`WEBVTT

`+re,xe=URL.createObjectURL(new Blob([ke],{type:"text/vtt"}));ge(s,xe,J.name.replace(/\.[^.]+$/,"")||"Local"),be("Subtitles loaded."),L(!0)}catch(re){console.error(re),be("Failed to load subtitles."),L(!1)}},{once:!0})});c.click(),await k}function ge(s,c,k){var J;(J=D('track[data-btfw="1"]',s))==null||J.remove();let L=document.createElement("track");L.kind="subtitles",L.label=k||"Local",L.srclang="en",L.src=c,L.default=!0,L.setAttribute("data-btfw","1"),s.appendChild(L);try{for(let re of s.textTracks)re.mode=re.label===L.label?"showing":"disabled"}catch(re){}}function be(s){let c=D("#btfw-mini-toast");c||(c=document.createElement("div"),c.id="btfw-mini-toast",document.body.appendChild(c)),c.textContent=s,c.style.opacity="1",clearTimeout(c._hid),c._hid=setTimeout(()=>c.style.opacity="0",1400)}function Le(s){if(!s)return;let c=document.querySelector("#btfw-vo-subs");c||(c=document.createElement("button"),c.id="btfw-vo-subs",c.className="btfw-vo-btn",c.title="Load local subtitles (.vtt/.srt)",c.innerHTML='<i class="fa fa-closed-captioning"></i>',c.addEventListener("click",L=>{L.preventDefault(),Y()}),s.insertBefore(c,s.firstChild||null));let k=ne()&&i();c.style.display=k?"":"none"}function _e(){we(),de();let s=[D("#videowrap"),D("#rightcontrols"),D("#leftcontrols"),document.body].filter(Boolean),c=new MutationObserver(()=>de());s.forEach(k=>c.observe(k,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>de());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>de(),0)})}catch(k){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_e):_e(),{name:"feature:videoOverlay",setLocalSubsEnabled:j,toggleFullscreen:p,enableAirplay:b}});(function(){"use strict";let h="https://vidprox.movies-storage-a.workers.dev/?url=";function U(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function f(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var m,S,u;let i=typeof window!="undefined"&&(((m=window.BTFW_CONFIG)==null?void 0:m.corsVideoProxy)||((u=(S=window.BTFW_CONFIG)==null?void 0:S.integrations)==null?void 0:u.corsVideoProxy));if(typeof i=="string"&&i.trim()){let C=i.trim();if(C.includes("?"))return C;let V=C.endsWith("/")?"":"/";return`${C}${V}?url=`}return h},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(i){try{return new URL(h).origin.toLowerCase()}catch(m){return""}}},_isTrusted(i){if(!i)return!1;if(String(i).includes(this.CORS_PROXY))return!0;try{let m=new URL(i),S=m.origin.toLowerCase(),u=this._getCorsProxyOrigin();return u&&S===u?!0:/^vidprox\./i.test(m.hostname)}catch(m){return!1}},_unwrapProxiedUrl(i){if(!i||!this._isTrusted(i))return i;try{return new URL(i).searchParams.get("url")||i}catch(m){return i}},_markInternalSrcSet(){this._lastInternalSrcSetAt=f()},_isInsideInternalWindow(){return f()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let i=this._getMediaElement();return i?i.crossOrigin==="anonymous"||i.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var m,S,u,C;if(this._hasAnonymousCrossOrigin())return!1;let i=((S=(m=this.player)==null?void 0:m.currentSrc)==null?void 0:S.call(m))||((u=this._getMediaElement())==null?void 0:u.currentSrc)||"";if(i&&!this._isTrusted(i))return!1;try{return(C=this.player)==null||C.crossOrigin("anonymous"),!0}catch(V){return!1}},_clearMediaElementForCorsSwap(){let i=this._getMediaElement();if(i)try{for(i.removeAttribute("src"),i.removeAttribute("crossorigin");i.firstChild;)i.removeChild(i.firstChild);i.load()}catch(m){}},_same(i,m){return String(i||"")===String(m||"")},_getMediaElement(){var S;let i=(S=this.player)==null?void 0:S.tech_;if(i){try{let u=typeof i.el=="function"?i.el():null;if(u instanceof HTMLMediaElement&&u.isConnected)return u}catch(u){}if(i.el_ instanceof HTMLMediaElement&&i.el_.isConnected)return i.el_}let m=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return m instanceof HTMLMediaElement&&m.isConnected?m:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(i){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(i){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(i){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(i){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(i){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(i){}this.mergerNode=null}},resetMediaBinding(){var m,S;this.disconnectChain();let i=this._getMediaElement();if(i&&this._syncFromRegistry(i)){((m=this.audioContext)==null?void 0:m.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((S=this.audioContext)==null?void 0:S.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(i){var K;let m=(K=this.player)==null?void 0:K.tech_;if(!(m!=null&&m.el_)||m.el_!==i)return null;let S=i.parentNode;if(!S)return null;let u=i.tagName.toLowerCase()==="audio"?"audio":"video",C=document.createElement(u);C.className=i.className,i.id&&(C.id=i.id),C.setAttribute("playsinline",""),C.setAttribute("webkit-playsinline",""),C.classList.contains("vjs-tech")||C.classList.add("vjs-tech");let V=i.crossOrigin||i.getAttribute("crossorigin");return V&&(C.crossOrigin=V,C.setAttribute("crossorigin",V)),S.replaceChild(C,i),m.el_=C,delete i.__btfwSourceNode,C},_syncFromRegistry(i){let m=U().get(i)||i.__btfwSourceNode||null;return m?(U().set(i,m),this.sourceNode=m,this._sourceMediaElement=i,m.context&&m.context.state!=="closed"&&(this.audioContext=m.context),m):null},_getOrCreateSourceNode(i){var C;let m=U(),S=m.get(i)||i.__btfwSourceNode||null;if(S)return m.set(i,S),this.sourceNode=S,this._sourceMediaElement=i,S.context&&S.context.state!=="closed"&&(this.audioContext=S.context),S;if(this.sourceNode&&this._sourceMediaElement===i)return m.set(i,this.sourceNode),i.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new(window.AudioContext||window.webkitAudioContext));let u;try{u=this.audioContext.createMediaElementSource(i)}catch(V){if((V==null?void 0:V.name)!=="InvalidStateError")throw V;let K=this._syncFromRegistry(i);if(K)return K;let q=this._swapVideoTechElement(i);if(!q)throw V;let ne=(C=this.player)==null?void 0:C.currentSrc();if(ne&&this.player){this._markInternalSrcSet(),this.player.src({src:ne,type:"video/mp4"});try{this.player.load()}catch(j){}}return this._getOrCreateSourceNode(q)}return m.set(i,u),i.__btfwSourceNode=u,this.sourceNode=u,this._sourceMediaElement=i,u},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(i){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(i){return!1}},_clearCrossOriginAttribute(){var m,S;let i=this._getMediaElement();if(i)try{i.crossOrigin=null,i.removeAttribute("crossorigin")}catch(u){}try{(S=(m=this.player)==null?void 0:m.crossOrigin)==null||S.call(m,null)}catch(u){}},cleanup(){this.disconnectChain();let i=this._getMediaElement();i&&(i.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){var m,S;this.cleanup();let i=((S=(m=this.player)==null?void 0:m.currentSrc)==null?void 0:S.call(m))||"";return this.sourceNode&&i&&!this._isTrusted(i)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(i,{currentTime:m=0,wasPlaying:S=!1,clearCrossOrigin:u=!1}={}){if(!this.player||!i)return Promise.resolve(!1);try{this.player.pause()}catch(C){}u&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:i,type:"video/mp4"});try{this.player.load()}catch(C){}return new Promise(C=>{let V=!1,K=()=>{if(V)return;V=!0;try{this.player.off("canplay",q)}catch(j){}try{this.player.off("loadeddata",q)}catch(j){}try{this.player.currentTime(m)}catch(j){}let ne=S?this.player.play():Promise.resolve();Promise.resolve(ne).catch(()=>{}).finally(()=>C(!0))},q=()=>K();try{this.player.one("canplay",q)}catch(ne){try{this.player.on("canplay",q)}catch(j){}}try{this.player.one("loadeddata",q)}catch(ne){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&K()}catch(ne){}}),setTimeout(K,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let i=this._getMediaElement();if(i&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(i,{attributes:!0,attributeFilter:["src","crossorigin"]});let m=new MutationObserver(()=>{this._checkAndReapply("sources")});m.observe(i,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=m}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([m,S])=>{this.player.on(m,S)})}catch(m){}}this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800),this._lastKnownSrc=this.player.currentSrc()},stopWatchdog(){var i;if(this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(m){}try{(i=this._mutationObserver._sourceObserver)==null||i.disconnect()}catch(m){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([m,S])=>{this.player.off(m,S)})}catch(m){}this._watchdogPlayerHandlers=null}},_checkAndReapply(i){if(!this.player)return;let m=this.player.currentSrc();if(m&&(this._lastKnownSrc=m,!this._isInsideInternalWindow())){if(this._isTrusted(m)){this.isProxied=!0,this.proxiedSrc=m,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(m)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(f()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=f(),this._forceProxyPreservingState(m)}}},async _forceProxyPreservingState(i){if(!this.player)return!1;let m=this.player.currentTime(),S=!this.player.paused();if(this._isTrusted(i))return this.isProxied=!0,this.proxiedSrc=i,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(i)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(i)||i,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(u){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(u){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(u){}return new Promise(u=>{let C=!1,V=()=>{if(!C){C=!0;try{this.player.off("canplay",K)}catch(q){}try{this.player.off("loadeddata",K)}catch(q){}try{this.player.currentTime(m)}catch(q){}this.isProxied=!0,S&&this.player.play().catch(()=>{}),u(!0)}},K=()=>V();try{this.player.one("canplay",K)}catch(q){try{this.player.on("canplay",K)}catch(ne){}}try{this.player.one("loadeddata",K)}catch(q){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&V()}catch(q){}}),setTimeout(V,5e3)})},async ensureProxy(){if(!this.player)return!1;let i=this.player.currentSrc();if(!i)return!1;if(this._isTrusted(i)){if(this.isProxied=!0,this.proxiedSrc=i,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(i)),this._hasAnonymousCrossOrigin())return!0;let m=this.player.currentTime(),S=!this.player.paused();try{this.player.pause()}catch(u){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:i,type:"video/mp4"});try{this.player.load()}catch(u){}return new Promise(u=>{this.player.ready(()=>{try{this.player.currentTime(m)}catch(C){}S&&this.player.play().catch(()=>{}),u(!0)})})}return await this._forceProxyPreservingState(i),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var m;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let S=this.player.currentSrc();if(this._isTrusted(S))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this.player.currentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let i=this._getMediaElement();if(!i)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((m=this.audioContext)==null?void 0:m.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),i.disableRemotePlayback=!0;let u=this._getOrCreateSourceNode(i);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let C=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(C.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(C.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(C.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(C.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(C.release,this.audioContext.currentTime),u.connect(this.compressorNode),u=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),u.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),u=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,u.connect(this.gainNode),u=this.gainNode),u.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(S){return console.error("[BTFW_AUDIO] Error building audio chain:",S),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let i=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),i}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(i){return this.NORM_PRESETS[i]?(this.currentNormPreset=i,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(i){return this.BOOST_MULTIPLIER=i,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let i=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),i}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let i=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),i}return this._disableAllProcessing()}}})();(function(){"use strict";function D(P){window.BTFW&&typeof BTFW.define=="function"?P():setTimeout(()=>D(P),0)}D(function(){BTFW.define("feature:audio",[],async()=>{let P=(p,g=document)=>g.querySelector(p),T=window.BTFW_AUDIO,h=null,U=null,f=null,i=!1,m=!1,S=!1,u=null,C=null,V=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function K(p){h&&(p?(h.classList.add("active"),h.style.background="rgba(46, 213, 115, 0.3)",h.style.borderColor="#2ed573",h.style.color="#2ed573",h.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(h.classList.remove("active"),h.style.background="",h.style.borderColor="",h.style.color="",h.style.boxShadow=""))}function q(p,g="info"){let r=P("#btfw-audioboost-toast");r||(r=document.createElement("div"),r.id="btfw-audioboost-toast",r.style.cssText=`
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
          `,document.body.appendChild(r)),r.textContent=p,r.style.background=g==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",r.style.opacity="1",setTimeout(()=>{r.style.opacity="0"},2e3)}async function ne(){if(await T.enableBoost()){i=!0;let g=Math.round(T.BOOST_MULTIPLIER*100);q(`Boosted by ${g}%`,"success"),K(!0)}else{let g=T._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";q(g,"error")}}async function j(){await T.disableBoost(),i=!1,K(!1)}function X(p){U&&(p?(U.classList.add("active"),U.style.background="rgba(52, 152, 219, 0.3)",U.style.borderColor="#3498db",U.style.color="#3498db",U.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(U.classList.remove("active"),U.style.background="",U.style.borderColor="",U.style.color="",U.style.boxShadow=""))}function R(p,g="info"){let r=P("#btfw-audionorm-toast");r||(r=document.createElement("div"),r.id="btfw-audionorm-toast",r.style.cssText=`
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
          `,document.body.appendChild(r)),r.textContent=p,r.style.background=g==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",r.style.opacity="1",setTimeout(()=>{r.style.opacity="0"},2e3)}async function I(){if(await T.enableNormalization())m=!0,R("Normalization enabled","success"),X(!0);else{let g=T._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";R(g,"error")}}async function Q(){await T.disableNormalization(),m=!1,X(!1)}function Z(p){f&&(p?(f.classList.add("active"),f.style.background="rgba(155, 89, 182, 0.3)",f.style.borderColor="#9b59b6",f.style.color="#9b59b6",f.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(f.classList.remove("active"),f.style.background="",f.style.borderColor="",f.style.color="",f.style.boxShadow=""))}function ee(p,g="info"){let r=P("#btfw-mono-toast");r||(r=document.createElement("div"),r.id="btfw-mono-toast",r.style.cssText=`
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
          `,document.body.appendChild(r)),r.textContent=p,r.style.background=g==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",r.style.opacity="1",setTimeout(()=>{r.style.opacity="0"},2e3)}async function he(){if(await T.enableMono())S=!0,ee("Stereo audio enabled","success"),Z(!0);else{let g=T._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";ee(g,"error")}}async function oe(){await T.disableMono(),S=!1,Z(!1)}function Ee(){let p=document.createElement("button");p.id="btfw-vo-audioboost",p.className="btn btn-sm btn-default btfw-vo-adopted";let g=Math.round(T.BOOST_MULTIPLIER*100);return p.title=`Toggle Audio Boost (${g}%)`,p.setAttribute("data-btfw-overlay","1"),p.innerHTML='<i class="fa-solid fa-megaphone"></i>',p.addEventListener("click",()=>{T.boostEnabled?j():ne()}),p.addEventListener("mouseenter",()=>de()),p.addEventListener("mouseleave",()=>{setTimeout(()=>{!(u!=null&&u.matches(":hover"))&&!p.matches(":hover")&&v()},100)}),p}function pe(){let p=document.createElement("button");p.id="btfw-vo-audionorm",p.className="btn btn-sm btn-default btfw-vo-adopted";let g=T.NORM_PRESETS[T.currentNormPreset].label;return p.title=`Toggle Audio Normalization (${g})`,p.setAttribute("data-btfw-overlay","1"),p.innerHTML='<i class="fa-solid fa-waveform-lines"></i>',p.addEventListener("click",()=>{T.normalizationEnabled?Q():I()}),p.addEventListener("mouseenter",()=>W()),p.addEventListener("mouseleave",()=>{setTimeout(()=>{!(C!=null&&C.matches(":hover"))&&!p.matches(":hover")&&ie()},100)}),p}function we(){let p=document.createElement("button");return p.id="btfw-vo-mono",p.className="btn btn-sm btn-default btfw-vo-adopted",p.title="Toggle Mono Audio (mix both channels to stereo)",p.setAttribute("data-btfw-overlay","1"),p.innerHTML='<i class="fa-solid fa-headphones"></i>',p.addEventListener("click",()=>{T.monoEnabled?oe():he()}),p}function Se(){if(u)return u;let p=document.createElement("div");return p.id="btfw-boost-context-menu",p.style.cssText=`
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
        `,V.forEach(g=>{let r=document.createElement("button");r.className="btfw-context-item",r.textContent=g.label,r.style.cssText=`
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
          `,T.BOOST_MULTIPLIER===g.multiplier&&(r.style.background="rgba(46, 213, 115, 0.2)",r.style.color="#2ed573"),r.addEventListener("mouseenter",()=>{T.BOOST_MULTIPLIER!==g.multiplier&&(r.style.background="rgba(109, 77, 246, 0.2)")}),r.addEventListener("mouseleave",()=>{T.BOOST_MULTIPLIER!==g.multiplier&&(r.style.background="transparent")}),r.addEventListener("click",async()=>{if(await T.setBoostMultiplier(g.multiplier),A(),h){let b=Math.round(g.multiplier*100);h.title=`Toggle Audio Boost (${b}%)`}T.boostEnabled&&q(`Boost set to ${g.label}`,"success")}),p.appendChild(r)}),p.addEventListener("mouseleave",()=>{setTimeout(()=>{h!=null&&h.matches(":hover")||v()},100)}),document.body.appendChild(p),u=p,p}function de(){if(!h)return;let p=Se(),g=h.getBoundingClientRect();p.style.left=g.left+"px",p.style.top=g.bottom+5+"px",p.style.display="block"}function v(){u&&(u.style.display="none")}function A(){if(!u)return;u.querySelectorAll(".btfw-context-item").forEach((g,r)=>{let b=V[r];T.BOOST_MULTIPLIER===b.multiplier?(g.style.background="rgba(46, 213, 115, 0.2)",g.style.color="#2ed573"):(g.style.background="transparent",g.style.color="#e0e0e0")})}function B(){if(C)return C;let p=document.createElement("div");return p.id="btfw-norm-context-menu",p.style.cssText=`
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
        `,Object.keys(T.NORM_PRESETS).forEach(g=>{let r=T.NORM_PRESETS[g],b=document.createElement("button");b.className="btfw-context-item",b.textContent=r.label,b.style.cssText=`
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
          `,T.currentNormPreset===g&&(b.style.background="rgba(52, 152, 219, 0.2)",b.style.color="#3498db"),b.addEventListener("mouseenter",()=>{T.currentNormPreset!==g&&(b.style.background="rgba(109, 77, 246, 0.2)")}),b.addEventListener("mouseleave",()=>{T.currentNormPreset!==g&&(b.style.background="transparent")}),b.addEventListener("click",async()=>{await T.setNormPreset(g),se(),U&&(U.title=`Toggle Audio Normalization (${r.label})`),T.normalizationEnabled&&R(`Preset: ${r.label}`,"success")}),p.appendChild(b)}),p.addEventListener("mouseleave",()=>{setTimeout(()=>{U!=null&&U.matches(":hover")||ie()},100)}),document.body.appendChild(p),C=p,p}function W(){if(!U)return;let p=B(),g=U.getBoundingClientRect();p.style.left=g.left+"px",p.style.top=g.bottom+5+"px",p.style.display="block"}function ie(){C&&(C.style.display="none")}function se(){if(!C)return;let p=C.querySelectorAll(".btfw-context-item");Object.keys(T.NORM_PRESETS).forEach((g,r)=>{let b=p[r];T.currentNormPreset===g?(b.style.background="rgba(52, 152, 219, 0.2)",b.style.color="#3498db"):(b.style.background="transparent",b.style.color="#e0e0e0")})}function le(){let p=P("#btfw-vo-left");if(!p)return!1;let g=P("#btfw-vo-audioboost");g&&g.remove();let r=P("#btfw-vo-audionorm");r&&r.remove();let b=P("#btfw-vo-mono");return b&&b.remove(),h=Ee(),U=pe(),f=we(),p.appendChild(h),p.appendChild(U),p.appendChild(f),!0}function ue(p,g=20){let r=0,b=setInterval(()=>{r++,le()?(clearInterval(b),p()):r>=g&&clearInterval(b)},500)}function l(){if(typeof videojs=="undefined"){setTimeout(l,500);return}if(!P("#ytapiplayer")){setTimeout(l,500);return}T.player=videojs("ytapiplayer"),T.originalSrc=T.player.currentSrc(),T.startWatchdog()}function M(){setTimeout(()=>{T.resetMediaBinding(),T.boostEnabled=!1,T.normalizationEnabled=!1,T.monoEnabled=!1,T.isProxied=!1,K(!1),X(!1),Z(!1),l(),i&&setTimeout(()=>{ne()},1200),m&&setTimeout(()=>{I()},1200),S&&setTimeout(()=>{he()},1200)},600)}function N(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>T._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>T._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",M))}function $(){ue(()=>{l()}),N()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",$):$(),{name:"feature:audio",activate:ne,deactivate:j,isActive:()=>T.boostEnabled,activateNormalization:I,deactivateNormalization:Q,isNormalizationActive:()=>T.normalizationEnabled,activateMono:he,deactivateMono:oe,isMonoActive:()=>T.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async P=>P.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:D})=>{let P=await D("util:tmdb-proxy"),T="movie-info",h={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},U="btfw-movie-info-style",f={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},i=0,m=!1,S=null;function u(r){typeof r=="function"&&f.cleanup.push(r)}function C(){for(;f.cleanup.length;){let r=f.cleanup.pop();try{r()}catch(b){}}f.header&&(f.header.remove(),f.header=null)}function V(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null),f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null),i=0,f.currentTitle="",f.isInitialized=!1,C()}function K(r){if(typeof r=="boolean")return r;if(typeof r=="number")return Number.isFinite(r)?r>0:!1;if(typeof r=="string"){let b=r.trim().toLowerCase();return b?b==="1"||b==="true"||b==="yes"||b==="on":!1}return!1}function q(){let r=[()=>{var b,_,F;return(F=(_=(b=window.BTFW_THEME_ADMIN)==null?void 0:b.integrations)==null?void 0:_.movieInfo)==null?void 0:F.enabled},()=>{var b,_,F;return(F=(_=(b=window.BTFW_CONFIG)==null?void 0:b.integrations)==null?void 0:_.movieInfo)==null?void 0:F.enabled},()=>{var b,_;return(_=(b=window.BTFW_CONFIG)==null?void 0:b.movieInfo)==null?void 0:_.enabled},()=>{var b;return(b=window.BTFW_CONFIG)==null?void 0:b.movieInfoEnabled},()=>{var b,_;return(_=(b=document==null?void 0:document.body)==null?void 0:b.dataset)==null?void 0:_.btfwMovieInfoEnabled}];for(let b of r)try{let _=typeof b=="function"?b():b;if(K(_))return!0}catch(_){}return!1}function ne(){if(S||typeof MutationObserver!="function")return;let r=document.body;r&&(S=new MutationObserver(()=>I()),S.observe(r,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function j(){if(m)return;m=!0;let r=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",r),document.addEventListener("btfw:ready",r)}function X(r=0){f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.initTimer=window.setTimeout(()=>{f.initTimer=null,q()&&R()},Math.max(0,r))}function R(){if(f.isInitialized)return;let r=document.querySelector(h.TOPBAR_SELECTOR);if(!r){X(500);return}try{Q(r),p(),ee(),f.isInitialized=!0,setTimeout(()=>{v(),A()},120)}catch(b){X(800)}}function I(){q()?f.isInitialized?(v(),setTimeout(A,80)):X(0):V()}function Q(r){if(!r&&(r=document.querySelector(h.TOPBAR_SELECTOR),!r))throw new Error("Chat topbar not found");let b=document.getElementById(h.CONTAINER_ID);b&&b.remove();let _=document.createElement("div");_.id=h.CONTAINER_ID,_.className="btfw-movie-header hide",_.dataset.module=T,r.insertAdjacentElement("afterend",_),f.header=_}function Z(){try{return window.socket||window.SOCKET||null}catch(r){return null}}function ee(){he(),pe();let r=$(v,250);window.addEventListener("resize",r),u(()=>window.removeEventListener("resize",r))}function he(){oe(),Ee()}function oe(){let r=document.querySelector(h.TITLE_SELECTOR);if(r){let b=()=>Se(),_=()=>de();r.addEventListener("mouseenter",b),r.addEventListener("mouseleave",_),u(()=>{r.removeEventListener("mouseenter",b),r.removeEventListener("mouseleave",_)})}else if(typeof MutationObserver=="function"){let b=new MutationObserver(()=>{document.querySelector(h.TITLE_SELECTOR)&&(b.disconnect(),oe())});b.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),u(()=>{try{b.disconnect()}catch(_){}})}}function Ee(){let r=f.header;if(!r)return;let b=()=>we(),_=()=>de();r.addEventListener("mouseenter",b),r.addEventListener("mouseleave",_),u(()=>{r.removeEventListener("mouseenter",b),r.removeEventListener("mouseleave",_)})}function pe(){let r=Z();if(r&&typeof r.on=="function"){r.on("changeMedia",A),u(()=>{var F,ce;try{(F=r.off)==null||F.call(r,"changeMedia",A)}catch(Y){try{(ce=r.removeListener)==null||ce.call(r,"changeMedia",A)}catch(ge){}}});return}let b=0,_=()=>{if(!q()){f.socketRetryTimer=null;return}let F=Z();if(F&&typeof F.on=="function"){F.on("changeMedia",A),u(()=>{var ce,Y;try{(ce=F.off)==null||ce.call(F,"changeMedia",A)}catch(ge){try{(Y=F.removeListener)==null||Y.call(F,"changeMedia",A)}catch(be){}}}),f.socketRetryTimer=null;return}if(b+=1,b>10){f.socketRetryTimer=null;return}f.socketRetryTimer=window.setTimeout(_,1e3)};f.socketRetryTimer=window.setTimeout(_,1200),u(()=>{f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null)})}function we(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null)}function Se(){we(),f.header&&(f.header.classList.remove("hide"),f.header.classList.add("show"))}function de(){we(),f.hideTimer=window.setTimeout(()=>{f.header&&(f.header.classList.remove("show"),f.header.classList.add("hide"),setTimeout(()=>{f.header&&f.header.classList.contains("hide")&&f.header.classList.remove("hide")},320))},300)}function v(){if(!f.header)return;let r=window.innerWidth<=768;f.header.classList.toggle("btfw-mobile",r)}async function A(){var ce;if(!f.isInitialized)return;let r=document.querySelector(h.TITLE_SELECTOR),b=f.header;if(!r||!b)return;let _=((ce=r.textContent)==null?void 0:ce.trim())||"";if(!_){f.currentTitle="",le();return}if(_===f.currentTitle)return;f.currentTitle=_;let F=++i;ie();try{let Y=await W(_);if(F!==i)return;l(Y)}catch(Y){if(F!==i)return;P.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),se()}}function B(r){let b=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],_=r;return b.forEach(F=>{let ce=new RegExp(`\\b${F}\\b`,"gi");_=_.replace(ce,"")}),_.replace(/\s{2,}/g," ").trim()}async function W(r){var ge;if(!P.isAvailable())throw new Error(P.MISSING_PROXY_MSG);let b=r.match(/(.+)\s*\((\d{4})\)/),_=b?b[1].trim():r,F=b?b[2]:"";F||(b=r.match(/(.+?)\s+(\d{4})\s*$/),b&&(_=b[1].trim(),F=b[2]));let ce=B(_),Y=await P.tmdbFetch("search/movie",{query:ce,year:F});if(((ge=Y==null?void 0:Y.results)==null?void 0:ge.length)>0){let be=Y.results[0];return{title:r,backdrop:be.backdrop_path?`https://image.tmdb.org/t/p/w1280${be.backdrop_path}`:null,poster:be.poster_path?`https://image.tmdb.org/t/p/w500${be.poster_path}`:null,summary:be.overview||"",rating:be.vote_average||0,releaseDate:be.release_date||"",voteCount:be.vote_count||0}}return{title:r,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ie(){f.header&&(ue(),f.header.innerHTML=`
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
    `)}function ue(){f.header&&(f.header.style.backgroundImage="",f.header.style.backgroundColor="")}function l(r){if(!f.header)return;f.header.innerHTML="",h.ENABLE_BACKDROP&&r.backdrop?(f.header.style.backgroundImage=`url(${r.backdrop})`,f.header.style.backgroundSize="cover",f.header.style.backgroundPosition="center"):ue();let b=document.createElement("div");b.className="btfw-movie-overlay",f.header.appendChild(b);let _=document.createElement("div");if(_.className="btfw-movie-content",f.header.appendChild(_),r.poster){let Y=document.createElement("img");Y.src=r.poster,Y.alt=`${r.title} Poster`,Y.className="btfw-movie-poster",_.appendChild(Y)}let F=document.createElement("div");F.className="btfw-movie-details",_.appendChild(F);let ce=document.createElement("h2");if(ce.textContent=r.title,ce.className="btfw-movie-title",F.appendChild(ce),h.SHOW_SUMMARY&&r.summary){let Y=document.createElement("p");Y.textContent=r.summary,Y.className="btfw-movie-summary",F.appendChild(Y)}if(h.ENABLE_RATING&&r.rating>0){let Y=M(r.rating,r.voteCount);_.appendChild(Y)}}function M(r,b){let _=document.createElement("div");_.className="btfw-movie-rating";let F=Math.round(r*10),ce=N(F),Y="http://www.w3.org/2000/svg",ge=document.createElementNS(Y,"svg");ge.setAttribute("width","60"),ge.setAttribute("height","60"),ge.setAttribute("viewBox","0 0 60 60");let be=25,Le=2*Math.PI*be,_e=Le-r/10*Le,s=document.createElementNS(Y,"circle");s.setAttribute("cx","30"),s.setAttribute("cy","30"),s.setAttribute("r",be.toString()),s.setAttribute("stroke","#2a2a2a"),s.setAttribute("stroke-width","4"),s.setAttribute("fill","#1a1a1a"),ge.appendChild(s);let c=document.createElementNS(Y,"circle");c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r",be.toString()),c.setAttribute("stroke",ce),c.setAttribute("stroke-width","3"),c.setAttribute("fill","none"),c.setAttribute("stroke-dasharray",Le.toString()),c.setAttribute("stroke-dashoffset",_e.toString()),c.setAttribute("transform","rotate(-90 30 30)"),c.setAttribute("stroke-linecap","round"),ge.appendChild(c);let k=document.createElementNS(Y,"text");if(k.setAttribute("x","50%"),k.setAttribute("y","50%"),k.setAttribute("text-anchor","middle"),k.setAttribute("dominant-baseline","central"),k.setAttribute("fill","#fff"),k.setAttribute("font-size","10"),k.setAttribute("font-weight","bold"),k.textContent=`${F}%`,ge.appendChild(k),_.appendChild(ge),b>0){let L=document.createElement("div");L.className="btfw-movie-votes",L.textContent=`${b.toLocaleString()} votes`,_.appendChild(L)}return _}function N(r){let b=Math.max(0,Math.min(r,100));return b>=70?"#4caf50":b>=50?"#ff9800":"#f44336"}function $(r,b){let _=null;return function(...ce){_&&clearTimeout(_),_=setTimeout(()=>{_=null,r(...ce)},b)}}function p(){if(document.getElementById(U))return;let r=`
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
    `,b=document.createElement("style");b.id=U,b.textContent=r,document.head.appendChild(b)}function g(){ne(),j(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):g(),{name:"feature:movie-info",refresh:I,cleanup:V}});BTFW.define("feature:monkeyPaw",[],async()=>{let D="btfw-monkey-paw-styles",P="btfw-monkey-paw-overlay",T="/src/assets/monkey-paw/paw.svg",h={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},U={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},f={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},i=null,m=null;function S(R){return new Promise(I=>setTimeout(I,R))}function u(){try{let R=typeof window!="undefined"?window.BTFW:null;return R&&(R.BASE||R.DEV_CDN)||""}catch(R){return""}}function C(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(R){return!1}}function V(){if(typeof document=="undefined"||document.getElementById(D))return;let R=document.createElement("style");R.id=D,R.textContent=`
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
    `,document.head.appendChild(R)}async function K(){if(i)return i;let I=`${u()}${T}`,Q=await fetch(I,{credentials:"omit"});if(!Q.ok)throw new Error(`Monkey paw SVG failed to load (${Q.status})`);return i=await Q.text(),i}function q(R){Object.entries(f).forEach(([I,Q])=>{let Z=R.querySelector(`#${I}`),ee=R.querySelector(`#${I}-tip`);Z&&(Z.style.transform=Q.root),ee&&(ee.style.transform=Q.tip)})}function ne(R){Object.entries(h).forEach(([I,Q])=>{window.setTimeout(()=>{let Z=R.querySelector(`#${I}`),ee=R.querySelector(`#${I}-tip`);Z&&(Z.style.transform=Q.root),ee&&window.setTimeout(()=>{ee.style.transform=Q.tip},120)},U[I])})}function j(R){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${R}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function X(R={}){if(m)return m;if(typeof document!="undefined")return m=(async()=>{var he,oe;if(V(),C()){await S((he=R.reducedMotionMs)!=null?he:450);return}let I=document.getElementById(P);I||(I=document.createElement("div"),I.id=P,document.body.appendChild(I));let Q;try{Q=await K()}catch(Ee){console.warn("[monkey-paw] SVG load failed:",Ee),await S(300);return}I.innerHTML=j(Q),q(I);let Z=I.querySelector("#paw"),ee=I.querySelector("#btfw-monkey-paw-msg");I.classList.remove("is-cursed"),ee==null||ee.classList.remove("is-visible"),requestAnimationFrame(()=>I.classList.add("is-active")),ne(I),await S(980),Z==null||Z.classList.add("btfw-monkey-paw-shaking"),await S(720),Z==null||Z.classList.remove("btfw-monkey-paw-shaking"),I.classList.add("is-cursed"),ee==null||ee.classList.add("is-visible"),await S((oe=R.holdMs)!=null?oe:1100),I.classList.remove("is-active"),await S(320),I.remove()})().finally(()=>{m=null}),m}return{name:"feature:monkeyPaw",play:X}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:D})=>{let P=await D("util:tmdb-proxy"),T=await D("feature:monkeyPaw"),h=(l,M=document)=>M.querySelector(l),U=(l,M=document)=>Array.from(M.querySelectorAll(l)),f=null,i=null,m=null,S=null,u={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},C=null,V=null,K="[movie-suggestion]";function q(...l){console.log(K,...l)}function ne(...l){console.error(K,...l)}function j(l){var M;try{if((M=window.socket)!=null&&M.emit)return window.socket.emit("chatMsg",{msg:l}),!0}catch(N){}return!1}async function X(l,M={}){return P.workerFetch(l,M)}function R(){if(document.getElementById("btfw-movie-suggest-styles"))return;let l=document.createElement("style");l.id="btfw-movie-suggest-styles",l.textContent=`
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
    `,document.head.appendChild(l)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function Q(){let l=h("a[href*='donate'], #donate-btn, .donate-btn");if(l){let N=l.closest("ul");if(N)return{ul:N,insertAfter:l.parentElement}}let M=h("#btfw-theme-btn-nav");if(M){let N=M.closest("ul");if(N)return{ul:N,insertAfter:null}}return{ul:h(".navbar .nav.navbar-nav")||h(".navbar-nav")||h(".btfw-navbar ul")||h(".navbar ul"),insertAfter:null}}function Z(){if(h("#btfw-movie-suggest-btn"))return!0;let l=Q();if(!l.ul)return!1;let M=document.createElement("li"),N=document.createElement("a");return N.href="javascript:void(0)",N.className="btfw-nav-pill",N.id="btfw-movie-suggest-btn",N.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,M.appendChild(N),l.insertAfter?l.insertAfter.after(M):l.ul.insertBefore(M,l.ul.firstChild),N.addEventListener("click",W),!0}function ee(){var $,p,g,r,b,_;if(h("#btfw-movie-suggest-modal"))return;let l=document.createElement("div");l.id="btfw-movie-suggest-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let M=h(".modal-background",l),N=h(".delete",l);if(M.addEventListener("click",ie),N.addEventListener("click",ie),($=h("#btfw-movie-prev",l))==null||$.addEventListener("click",()=>{u.page>1&&(u.page-=1,de())}),(p=h("#btfw-movie-next",l))==null||p.addEventListener("click",()=>{u.page<u.totalPages&&(u.page+=1,de())}),I===0){let F=h("#btfw-movie-search",l);F.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),F.blur()})}else{let F,ce=h("#btfw-movie-search",l);ce.addEventListener("input",()=>{clearTimeout(F),u.query=ce.value.trim(),u.page=1,F=setTimeout(()=>de(),400)}),(g=h("#btfw-movie-sort",l))==null||g.addEventListener("change",Y=>{u.sortBy=Y.target.value,u.page=1,de()}),(r=h("#btfw-movie-genre",l))==null||r.addEventListener("change",Y=>{u.genreId=Y.target.value,u.page=1,de()}),(b=h("#btfw-movie-year",l))==null||b.addEventListener("change",Y=>{u.year=Y.target.value.trim(),u.page=1,de()}),(_=h("#btfw-movie-rating",l))==null||_.addEventListener("change",Y=>{u.minRating=Y.target.value.trim(),u.page=1,de()})}}function he(){if(h("#btfw-movie-confirm-modal"))return;let l=document.createElement("div");l.id="btfw-movie-confirm-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let M=h(".modal-background",l),N=h(".delete",l),$=h("#btfw-movie-cancel",l),p=h("#btfw-movie-confirm",l),g=()=>B();M.addEventListener("click",g),N.addEventListener("click",g),$.addEventListener("click",g),p.addEventListener("click",le)}async function oe(){if(C&&V)return;let[l,M]=await Promise.all([X("/api/meta"),X("/api/genres")]);C=l,V=M;let N=h("#btfw-movie-suggest-modal");if(!N)return;let $=h("#btfw-movie-sort",N);if($&&$.options.length===0){for(let g of l.sortOptions||[]){let r=document.createElement("option");r.value=g.value,r.textContent=g.label,$.appendChild(r)}$.value=u.sortBy}let p=h("#btfw-movie-genre",N);if(p&&p.options.length<=1)for(let g of M.genres||[]){let r=document.createElement("option");r.value=String(g.id),r.textContent=g.name,p.appendChild(r)}}function Ee(){let l={page:u.page,sort_by:u.sortBy};return u.query?(l.query=u.query,u.year&&(l.primary_release_year=u.year,l.year=u.year)):(u.genreId&&(l.with_genres=u.genreId),u.year&&(l.primary_release_year=u.year),u.minRating&&(l["vote_average.gte"]=u.minRating)),l}function pe(l){return!l||l==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${l}`}function we(){let l=h("#btfw-movie-suggest-modal");if(!l)return;let M=h("#btfw-movie-prev",l),N=h("#btfw-movie-next",l),$=h("#btfw-movie-page-label",l);$&&($.textContent=`Page ${u.page} of ${u.totalPages}`),M&&(M.disabled=u.page<=1||u.loading),N&&(N.disabled=u.page>=u.totalPages||u.loading)}function Se(l){let M=h("#btfw-movie-suggest-modal");if(!M)return;let N=h(".btfw-movie-results",M);if(!l.length){N.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}N.innerHTML=l.map($=>`
      <div class="movie-result"
           data-id="${$.id}"
           data-title="${$.title}"
           data-poster="${$.posterPath||""}"
           data-year="${$.releaseYear||""}">
        <div class="movie-result__poster">
          <img src="${pe($.posterPath)}" alt="${$.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${$.title}</div>
          <small style="opacity:0.7;">${$.releaseYear||"N/A"}</small>
        </div>
      </div>
    `).join(""),U(".movie-result",N).forEach($=>{$.addEventListener("click",()=>{f=$.dataset.id,i=$.dataset.title,m=$.dataset.poster,S=$.dataset.year||null;let p=h("#btfw-movie-confirm-modal");if(!p)return;let g=S?` (${S})`:"";h("#btfw-confirm-movie-title",p).textContent=`${i}${g}`,A()})})}async function de(){let l=h("#btfw-movie-suggest-modal");if(!l||u.loading)return;u.loading=!0,we();let M=h(".btfw-movie-results",l);M.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await oe();let N=await X("/api/search",{params:Ee()});u.totalPages=Math.max(1,N.totalPages||1),Se(N.results||[]),q("runSearch",{page:u.page,totalPages:u.totalPages,count:(N.results||[]).length})}catch(N){ne("runSearch failed:",N),M.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{u.loading=!1,we()}}async function v(){let l=h("#btfw-movie-history");if(l){l.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let N=(await X("/api/history",{params:{page:1,limit:10}})).results||[];if(!N.length){l.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}l.innerHTML=N.map($=>{let p=$.releaseYear?` (${$.releaseYear})`:"";return`
          <div class="history-item">
            <img src="${pe($.posterPath).replace("w154","w92")}" alt="${$.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${$.movieTitle}${p}</div>
              <div class="history-item__meta">Requested by ${$.username}</div>
            </div>
          </div>
        `}).join("")}catch(M){ne("loadHistory failed:",M),l.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function A(){let l=h("#btfw-movie-suggest-modal"),M=h("#btfw-movie-confirm-modal");M&&(l&&l.classList.add("btfw-movie-suggest-pending"),M.classList.add("is-active"))}function B(){let l=h("#btfw-movie-suggest-modal"),M=h("#btfw-movie-confirm-modal");l&&l.classList.remove("btfw-movie-suggest-pending"),M&&M.classList.remove("is-active")}async function W(){let l=h("#btfw-movie-suggest-modal");if(l){q("openModal",{userRank:I}),l.classList.remove("btfw-movie-suggest-pending"),l.classList.add("is-active");try{await oe(),await Promise.all([de(),v()])}catch(M){ne("openModal bootstrap failed:",M)}}}function ie(){let l=h("#btfw-movie-suggest-modal");l&&(B(),q("closeModal"),l.classList.remove("is-active"),h("#btfw-movie-search",l).value="",h(".btfw-movie-results",l).innerHTML="",u.query="",u.page=1,u.totalPages=1,f=null,i=null,m=null,S=null)}function se(l,M,N){let $=N?` (${N})`:"";return`\u{1F3AC} Movie request: ${M}${$} \u2014 suggested by ${l}`}async function le(){if(!f||!i)return;let l=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";q("confirmSuggestion",{movieId:f,movieTitle:i}),B();try{await T.play(),await X("/api/suggestions",{method:"POST",body:{movieId:Number(f),movieTitle:i,username:l,posterPath:m||null,releaseYear:S||null}}),j(se(l,i,S)),await v(),ie()}catch(M){ne("confirmSuggestion failed:",M),alert("Could not save your movie request. Please try again.")}}function ue(){q("boot: start",{workerBase:P.getWorkerBase()}),R(),ee(),he();let l=0,M=50,N=()=>{if(Z()){q("Button added successfully");return}l+=1,l<M?setTimeout(N,100):console.warn(K,"Failed to add button after retries",{retryCount:l})};N()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ue,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ue,200)}):setTimeout(ue,200),{name:"ext:movie-suggestion",open:W,close:ie,getWorkerBase:P.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async D=>D.init("ext:movie-suggestion"));})();
