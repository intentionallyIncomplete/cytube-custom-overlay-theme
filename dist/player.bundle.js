/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let B="#videowrap .video-js",W="vjs-default-skin",be="vjs-theme-city",S="vjs-big-play-centered",ye=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),p={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},o="btfw-videojs-base-css",a="btfw-videojs-city-css",b=["https://vjs.zencdn.net/7.20.3/video-js.css"],c=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function C(w,A){let N=document;if(!N||!N.head||N.getElementById(w))return;let j=N.createElement("link");j.id=w,j.rel="stylesheet";let le=Array.isArray(A)?A.slice():[A],ce=()=>{if(!le.length)return!1;let de=le.shift();return de?(j.href=de,!0):ce()};j.addEventListener("error",()=>{ce()||j.remove()}),ce()&&N.head.appendChild(j)}function U(){if(typeof window=="undefined"||!document.body)return!1;let w=document.createElement("div");w.className=`video-js ${W}`,w.style.position="absolute",w.style.opacity="0",w.style.pointerEvents="none",w.style.width="1px",w.style.height="1px",document.body.appendChild(w);let A=window.getComputedStyle(w).fontSize;return w.remove(),A&&Math.abs(parseFloat(A)-10)<.2}function X(){U()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||C(o,b)}function D(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||C(a,c)}function V(w){if(!w)return null;try{return w.player||w.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(w.id)||window.videojs&&window.videojs.players&&window.videojs.players[w.id]}catch(A){return null}}function R(w){let A=V(w);if(!A)return;let N=typeof A.getChild=="function"?A.getChild("controlBar"):null,j=N&&typeof N.getChild=="function"?N.getChild("volumePanel"):null;if(j){w.classList.add("btfw-volume-inline");try{typeof j.inline=="function"&&j.inline(!0)}catch(le){}}}function Y(){X(),D(),document.querySelectorAll(B).forEach(w=>{w.classList.contains(W)&&w.classList.remove(W),Array.from(w.classList).forEach(A=>{A.startsWith("vjs-theme-")&&A!==be&&w.classList.remove(A)}),w.classList.contains(be)||w.classList.add(be),w.classList.contains(S)||w.classList.add(S),R(w)})}function O(){var A;if(typeof window=="undefined")return;let w=(A=window.BTFW)==null?void 0:A.channelPosterUrl;w&&document.querySelectorAll(B).forEach(N=>{N.poster!==w&&(N.poster=w);try{let j=N.player||N.player_||window.videojs&&window.videojs.players&&window.videojs.players[N.id];j&&typeof j.poster=="function"&&j.poster(w)}catch(j){let le=N.querySelector(".vjs-poster");le&&(le.style.backgroundImage=`url("${w}")`)}})}function I(){var N;if(typeof window=="undefined")return;let w=(N=window.PLAYER)==null?void 0:N.mediaType;document.querySelectorAll(".vjs-poster").forEach(j=>{w==="yt"||w==="dm"||w==="vi"||w==="tw"?j.classList.add("hidden"):j.classList.remove("hidden")})}function Q(){document.querySelectorAll(ye).forEach(A=>{A instanceof HTMLVideoElement&&(typeof A.playsInline=="boolean"&&(A.playsInline=!0),Object.entries(p).forEach(([N,j])=>{try{A.setAttribute(N,j)}catch(le){}}))})}function ee(){if(typeof window=="undefined")return!1;let w=window.videojs;if(!w)return!1;let A=w.dom||w;if(!A||typeof A.textContent!="function")return!1;if(A.textContent&&A.textContent._btfwOptimized)return!0;let N=A.textContent.bind(A),j=function(ce,de){if(!ce)return ce;let ue;try{typeof ce.textContent!="undefined"?ue=ce.textContent:typeof ce.innerText!="undefined"&&(ue=ce.innerText)}catch(l){ue=void 0}if(ue!==void 0){let l=de==null?"":String(de);if(ue===l)return ce}return N(ce,de)};return j._btfwOptimized=!0,j._btfwOriginal=N,A.textContent=j,!0}function J(){if(ee()){J._tries=0;return}J._tries>20||(J._tries=(J._tries||0)+1,setTimeout(J,250))}let we="_btfwGuarded";function oe(w){if(!w)return!1;let A=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!w.closest(A)}function xe(w){if(!w||w[we])return;w[we]=!0;let A=N=>{oe(N.target)||N.type==="click"&&N.button!==0||(N.preventDefault(),N.stopImmediatePropagation())};w.addEventListener("click",A,!0),w.addEventListener("pointerdown",N=>{oe(N.target)||(N.preventDefault(),N.stopImmediatePropagation())},!0),w.addEventListener("contextmenu",A,!0)}function pe(){document.querySelectorAll(B).forEach(xe)}function ve(){if(ve._mo)return;let w=document.getElementById("videowrap")||document.body,A=new MutationObserver(N=>{var le,ce,de;let j=!1;for(let ue of N){for(let l of ue.addedNodes)if(l.nodeType===1&&((le=l.classList)!=null&&le.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME"||(ce=l.querySelector)!=null&&ce.call(l,B))){j=!0;break}for(let l of ue.removedNodes)if(l.nodeType===1&&((de=l.classList)!=null&&de.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME")){j=!0;break}}j&&(Y(),pe(),Q(),O(),I(),document.querySelectorAll(B).forEach(R))});A.observe(w,{childList:!0,subtree:!0,characterData:!1}),ve._mo=A}function _e(){setTimeout(()=>{Q(),O(),I(),document.querySelectorAll(B).forEach(R)},100)}function se(){if(Y(),pe(),Q(),J(),O(),I(),ve(),setInterval(()=>{I()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",_e),socket.on("changeMedia",_e)}catch(w){console.warn("[feature:player] Unable to bind changeMedia handler",w)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",se):se(),document.addEventListener("btfw:layoutReady",()=>setTimeout(se,0)),{name:"feature:player",applyCityTheme:Y,attachGuards:pe,ensureInlinePlayback:Q,applyPosterUrl:O,togglePosterVisibility:I,shouldAllowClick:oe}});function Pe(B=document){return!B||typeof B.querySelector!="function"?!1:!!(B.querySelector("#pollwrap .well.active")||B.querySelector("#pollwrap .well.muted")||B.querySelector("#pollwrap .poll-menu"))}function Ce(B,W){return B!=null?!!B:!!W}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:B})=>{let W=await B("util:templates"),{stack:be}=W,S="btfw-stack-order",ye="btfw-stack-motd-open",p="btfw-stack-playlist-open",o="btfw-stack-poll-open",a={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},b=a,c={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},C={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},U={"motd-group":1,"poll-group":2,"playlist-group":3},X=!1,D=null,V="",R=null,Y=null,O=null,I={"motd-group":{storageKey:ye,getDefaultOpen:e=>Ce(e,w()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:p,getDefaultOpen:e=>Ce(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:o,getDefaultOpen:e=>Ce(e,Pe()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},Q=null,ee=!1,J=!1,we=null,oe=!1,xe=!1,pe=!1,ve=null,_e=!1;function se(e=""){let t=String(e||"").trim();if(!t)return!0;if(typeof document!="undefined"){let n=document.createElement("div");return n.innerHTML=t,!(n.textContent||"").replace(/\u00a0/g," ").trim()}return!t.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function w(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=A(e);return t?!se(t.innerHTML||""):!1}function A(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let N=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],j=["#main","#mainpage","#mainpane"],le=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function ce(e,t,n){if(!e||!t||!n)return null;let r=le.map(z=>{let K=document.getElementById(z.id);return K?{...z,el:K}:null}).filter(Boolean);if(!r.length){let z=document.getElementById("btfw-addmedia-panel");return z&&z.remove(),null}let i=document.getElementById("btfw-addmedia-panel");if(i||(i=document.createElement("section"),i.id="btfw-addmedia-panel",i.className="btfw-addmedia-panel",i.dataset.open="false",i.setAttribute("role","region"),i.setAttribute("aria-label","Add media controls"),i.setAttribute("aria-hidden","true"),i.setAttribute("hidden","hidden"),i.innerHTML=be.addMediaPanelHtml()),i.parentElement!==e){let z=t.parentElement===e?t.nextSibling:null;e.insertBefore(i,z)}let f=i.querySelector(".btfw-addmedia-tabs"),y=i.querySelector(".btfw-addmedia-views"),h=i.querySelector(".btfw-addmedia-close");if(!f||!y)return null;for(;f.firstChild;)f.removeChild(f.firstChild);for(;y.firstChild;)y.removeChild(y.firstChild);r.forEach(({id:z,title:K,el:q})=>{q.classList.remove("collapse","in","plcontrol-collapse"),q.style.removeProperty("display"),q.style.removeProperty("height"),q.removeAttribute("aria-expanded"),q.setAttribute("role","tabpanel"),q.setAttribute("data-btfw-addmedia","panel");let he=document.createElement("button");he.type="button",he.className="btfw-addmedia-tab",he.dataset.target=z,he.textContent=K,he.setAttribute("role","tab"),f.appendChild(he);let me=document.createElement("div");me.className="btfw-addmedia-view",me.dataset.target=z,me.setAttribute("role","tabpanel"),me.setAttribute("aria-hidden","true"),me.appendChild(q),y.appendChild(me)});let _=r.find(z=>z.default)||r[0],E=z=>{let K=z||i.dataset.active||_.id;i.dataset.active=K,f.querySelectorAll(".btfw-addmedia-tab").forEach(q=>{let he=q.dataset.target===K;q.classList.toggle("is-active",he),q.setAttribute("aria-selected",he?"true":"false"),q.setAttribute("tabindex",he?"0":"-1")}),y.querySelectorAll(".btfw-addmedia-view").forEach(q=>{let he=q.dataset.target===K;q.classList.toggle("is-active",he),q.setAttribute("aria-hidden",he?"false":"true")})},$=z=>{let K=z!=null?!!z:i.dataset.open!=="true";return i.dataset.open=K?"true":"false",i.classList.toggle("is-open",K),i.setAttribute("aria-hidden",K?"false":"true"),K?(i.removeAttribute("hidden"),E(i.dataset.active||_.id)):i.setAttribute("hidden","hidden"),i.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:K}})),K};return i._btfwWired||(f.addEventListener("click",z=>{let K=z.target.closest(".btfw-addmedia-tab");K&&(z.preventDefault(),E(K.dataset.target))}),h&&h.addEventListener("click",()=>$(!1)),i._btfwWired=!0),E(i.dataset.active||_.id),i._btfwToggle=$,i._btfwSetActive=E,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:K,target:q})=>{let he=document.getElementById(K);he&&he.dataset.btfwAddmedia!==q&&(he.dataset.btfwAddmedia=q,he.setAttribute("aria-controls","btfw-addmedia-panel"),he.addEventListener("click",me=>{me.preventDefault(),me.stopPropagation(),E(q),$(!0),he.blur()}))})})(),{panel:i,toggle:$,setActive:E}}function de(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),r=document.getElementById("btfw-video-overlay"),i=r&&n&&r.parentElement===n.parentElement?r:n;i&&i.parentElement?i.nextSibling?i.parentNode.insertBefore(t,i.nextSibling):i.parentNode.appendChild(t):e.appendChild(t);let f=document.createElement("div");f.className="btfw-stack-list",t.appendChild(f);let y=document.createElement("div");y.id="btfw-stack-footer",y.className="btfw-stack-footer",t.appendChild(y)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function ue(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let f=t.querySelector(":scope > #motd");return f?{motdwrap:t,motd:f}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let r=[];t.querySelectorAll(".btfw-motd-editrow").forEach(f=>{let y=(f.textContent||"").trim();y&&r.push(`<p>${y}</p>`),f.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(f=>{f.contains(t)||f===t||((f.querySelector("#motd")||f.classList.contains("btfw-motd-editrow"))&&f.querySelectorAll("#motd").forEach(y=>{(y.innerHTML||"").trim()&&r.push(y.innerHTML)}),f.remove())});let i=t.querySelector(":scope > #motd");if(i||(i=document.createElement("div"),i.id="motd",t.appendChild(i)),t.querySelectorAll("#motd").forEach(f=>{f!==i&&((f.innerHTML||"").trim()&&r.push(f.innerHTML),f.remove())}),i.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(f=>{f.remove()}),i.querySelectorAll("#motd").forEach(f=>{(f.innerHTML||"").trim()&&r.push(f.innerHTML),f.remove()}),document.querySelectorAll("#togglemotd").forEach((f,y)=>{y!==0&&f.remove()}),r.length){let f=r.join("").trim();f&&se(i.innerHTML)?i.innerHTML=f:f&&(i.innerHTML+=f)}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:i}}function l(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),r=document.getElementById("playlistwrap"),i=document.getElementById("queuecontainer"),f=document.getElementById("playlistrow"),y=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),h=document.querySelectorAll(".btfw-controls-row"),_=f||r||i||y;if(!_)return;let E=e;E?E.classList.add("btfw-plbar"):(E=document.createElement("div"),E.id="btfw-plbar",E.className="btfw-plbar");let $=E.querySelector(".btfw-plbar__layout"),ae,z;if($)ae=$.querySelector(".btfw-plbar__primary")||$,z=$.querySelector(".btfw-plbar__aside")||$;else{for($=document.createElement("div"),$.className="btfw-plbar__layout",ae=document.createElement("div"),ae.className="btfw-plbar__primary",z=document.createElement("div"),z.className="btfw-plbar__aside",$.append(ae,z);E.firstChild;)ae.appendChild(E.firstChild);E.appendChild($);let te=ae.querySelector(".field.has-addons");te&&te.classList.add("btfw-plbar__search");let Ee=ae.querySelector("#btfw-pl-count");Ee&&(Ee.classList.add("btfw-plbar__count"),z.appendChild(Ee))}E.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(te=>te.remove());let K=E.querySelector(".btfw-plbar__actions");K||(K=document.createElement("div"),K.className="btfw-plbar__actions",(z||E).appendChild(K));let q=document.getElementById("btfw-addmedia-btn"),he=te=>{if(te){if(te.classList.add("btfw-plbar__action-btn"),te.tagName==="BUTTON"||te.tagName==="A")te.classList.add("button","is-dark","is-small");else if(te.tagName==="INPUT"){let Ee=(te.type||"").toLowerCase();Ee==="button"||Ee==="submit"||Ee==="reset"?te.classList.add("button","is-dark","is-small"):te.classList.remove("button","is-dark","is-small")}}};E.parentElement!==_&&_.insertBefore(E,_.firstChild);let me=ce(_,E,K);me?!q||!document.body.contains(q)?(q=document.createElement("button"),q.id="btfw-addmedia-btn",q.type="button",q.className="button is-small",q.innerHTML=be.addMediaButtonHtml(),K.prepend(q)):K.contains(q)||K.prepend(q):q&&(q.parentElement&&q.parentElement.removeChild(q),q=null);let Ae=te=>{if(!te)return;Array.from(te.children||[]).forEach(Le=>{Le&&(Le.classList.add("btfw-plbar__control"),K.appendChild(Le))})};if(n&&(Ae(n),n.remove()),t&&(Ae(t),t.remove()),K.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(he),me&&q){q.classList.remove("is-dark"),q.classList.add("is-primary"),q.dataset.iconified||(q.innerHTML=be.addMediaButtonHtml(),q.dataset.iconified="1"),q.setAttribute("aria-controls","btfw-addmedia-panel");let te=Le=>{q.setAttribute("aria-expanded",Le?"true":"false")};q.dataset.btfwBound||(q.dataset.btfwBound="1",q.addEventListener("click",Le=>{Le.preventDefault();let ot=document.getElementById("btfw-addmedia-panel"),it=ot&&ot._btfwToggle,wt=typeof it=="function"?it():!1;te(wt)}));let Ee=me.panel||document.getElementById("btfw-addmedia-panel");Ee&&(te(Ee.dataset.open==="true"),Ee._btfwButtonSync||(Ee.addEventListener("btfw:addmedia:state",Le=>{te(!!(Le.detail&&Le.detail.open))}),Ee._btfwButtonSync=!0))}h.forEach(te=>{te&&!_.contains(te)&&(te.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,te.remove(),_.appendChild(te),console.log("[stack] Moved floating controls row into playlist container"))}),_.contains(E)||_.insertBefore(E,_.firstChild),E.dataset.btfwMerged="1"}function P(e,t){if(e.id==="motd-group"&&(ue(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Ie(),l(),t=t.filter(h=>h&&h.id!=="rightcontrols"&&h.id!=="pollwrap").filter(h=>!h.querySelector||!h.querySelector("#pollwrap"))),e.id==="poll-group"&&(Ie(),Ue(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(h=>h&&!n.contains(h)&&!h.contains(n)));let r=document.createElement("section");r.className="btfw-stack-item btfw-group-item",r.dataset.bind=e.id,r.dataset.group="true";let i=document.createElement("header");i.className="btfw-stack-item__header",i.innerHTML=be.stackGroupHeaderHtml(e.title);let f=document.createElement("div");f.className="btfw-stack-item__body btfw-group-body",t.forEach(h=>{if(h&&h.parentElement!==f&&!f.contains(h)&&!h.contains(f))try{f.appendChild(h)}catch(_){console.warn("[stack] Failed to move element:",h.id||h.className,_)}}),r.appendChild(i),r.appendChild(f);let y=I[e.id];return y&&ut(r,y),Ke(r,e.id),r.querySelector(".btfw-up").onclick=function(){let h=r.parentElement,_=r.previousElementSibling;_&&h.insertBefore(r,_),M(h)},r.querySelector(".btfw-down").onclick=function(){let h=r.parentElement,_=r.nextElementSibling;_?h.insertBefore(_,r):h.appendChild(r),M(h)},r}function M(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(S,JSON.stringify(t))}catch(t){}}function H(){try{return JSON.parse(localStorage.getItem(S)||"[]")}catch(e){return[]}}function fe(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function ie(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function m(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),r=localStorage.getItem(n);return r!==null?r==="true":!1}catch(t){return!1}}function g(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function x(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function F(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function ne(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Pe()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function u(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Be())}function T(e){u(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function v(e,t,n){if(!e||F(e))return;let r=fe(t),i=typeof n=="function"?n(r):r!==null?!!r:!0;e._btfwSetOpenState?e._btfwSetOpenState(i,{persist:!1}):(e.dataset.open=i?"true":"false",e.classList.toggle("is-open",i))}function G(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(y=>y.dataset.docked!=="true"),n=e.length>0&&t.length===0,r=document.getElementById("btfw-stack"),i=document.getElementById("btfw-leftpad"),f=document.getElementById("btfw-grid");r&&(r.classList.toggle("btfw-stack--all-hidden",n),r.classList.toggle("btfw-stack--all-docked",n)),i&&i.classList.toggle("btfw-leftpad--stack-hidden",n),f&&f.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function ke(){var r;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let i=document.createElement("div");i.id="btfw-panel-bar",i.className="btfw-panel-bar",i.setAttribute("role","toolbar"),i.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(i)}let n=t.querySelector("#btfw-panel-bar");return ge(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),X||(ct(),X=!0),(r=document.getElementById("btfw-stack-drawer"))==null||r.remove(),t}function s(e){e.preventDefault(),e.stopPropagation(),lt()}function d(){let e=ke();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=be.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",s),t.dataset.btfwPanelsWired="1"),t}function k(e){if(!e)return null;let t=Array.from(e.classList).find(r=>r.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let r=n(e).data("uid");if(r!=null&&r!=="")return r}return e.dataset.uid||null}function L(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),r=n==null?void 0:n.querySelector(".qbtn-play");return r?(r.click(),!0):!1}function Z(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),r=document.getElementById("queue_next");if(n&&r&&(n.value=t,!r.disabled))return r.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let i=window.socket;if(i&&typeof parseMediaLink=="function")try{let f=parseMediaLink(t);if((f==null?void 0:f.id)!=null&&(f!=null&&f.type))return i.emit("queue",{id:f.id,type:f.type,pos:"next",temp:!1}),!0}catch(f){}return!1}function re(e){de();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(R&&(clearTimeout(R),R=null),D=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),Te(),$e(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function ge(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var f,y,h;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let _=n.dataset.panelGroup||((f=n.closest(".btfw-panel-btn"))==null?void 0:f.dataset.group);_&&re(_);return}let r=t.target.closest(".btfw-panel-playlist__play");if(r){t.preventDefault(),t.stopPropagation(),L(r.dataset.queueUid);return}let i=t.target.closest(".btfw-panel-playlist__add");if(i){t.preventDefault(),t.stopPropagation();let _=(y=i.closest(".btfw-panel-container"))==null?void 0:y.querySelector(".btfw-panel-playlist__add-form");if(!_)return;let E=_.hidden;_.hidden=!E,i.setAttribute("aria-expanded",E?"true":"false"),E&&((h=_.querySelector(".btfw-panel-playlist__link-input"))==null||h.focus())}}),e.addEventListener("submit",t=>{var y,h,_,E;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let r=n.querySelector(".btfw-panel-playlist__link-input"),i=(y=r==null?void 0:r.value)==null?void 0:y.trim();if(!i||!Z(i))return;r.value="",n.hidden=!0,(_=(h=n.closest(".btfw-panel-container"))==null?void 0:h.querySelector(".btfw-panel-playlist__add"))==null||_.setAttribute("aria-expanded","false");let f=(E=n.closest(".btfw-panel-container"))==null?void 0:E.querySelector(".btfw-panel-playlist__queue");f&&qe(f)}))}function Te(){if(Y){try{Y.disconnect()}catch(e){}Y=null}O=null}function Se(e){if(!e||O===e)return;Te();let t=document.getElementById("queue");t&&(O=e,Y=new MutationObserver(()=>{e.isConnected&&D==="playlist-group"&&qe(e)}),Y.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Me(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),r=n.findIndex(f=>f.classList.contains("queue_active")||f.classList.contains("playing")),i=r>=0?r+1:0;return n.slice(i,i+e)}function qe(e){if(!e)return;let t=Me(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var _,E;let r=document.createElement("div");r.className="btfw-panel-playlist__item";let i=document.createElement("span");i.className="btfw-panel-playlist__title",i.textContent=(((_=n.querySelector(".qe_title"))==null?void 0:_.textContent)||"Untitled").trim();let f=document.createElement("span");f.className="btfw-panel-playlist__meta",f.textContent=(((E=n.querySelector(".qe_time"))==null?void 0:E.textContent)||"").trim();let y=document.createElement("div");y.className="btfw-panel-playlist__actions";let h=k(n);if(h!=null&&h!==""){let $=document.createElement("button");$.type="button",$.className="btfw-panel-playlist__play",$.textContent="Play",$.dataset.queueUid=String(h),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&($.disabled=!0),y.appendChild($)}r.append(i,f,y),e.appendChild(r)})}function Ye(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=be.panelUndockIconHtml(),n}function rt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=be.playlistAddFormHtml(),e}function at(e,t,n){let r=document.createElement("div");if(r.className="btfw-panel-container",n>0&&(r.style.bottom=`${-n*50}px`),e==="playlist-group"){r.classList.add("btfw-panel-container--playlist");let f=document.createElement("div");f.className="btfw-panel-playlist__toolbar";let y=document.createElement("button");y.type="button",y.className="btfw-panel-playlist__add",y.textContent="+Add",y.setAttribute("aria-expanded","false");let h=Ye(e,t);f.append(y,h);let _=rt(),E=document.createElement("div");return E.className="btfw-panel-container__host btfw-panel-playlist__queue",r.append(f,_,E),r}r.classList.add("btfw-panel-container--dock-only");let i=document.createElement("div");return i.className="btfw-panel-container__dock-only",i.appendChild(Ye(e,t)),r.appendChild(i),r}function Re(){R&&(clearTimeout(R),R=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{T(e)}),Te(),D=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function Fe(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||Re()}function st(){Fe(!1)}function lt(){ke();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||Fe(!e.classList.contains("open"))}function Ve(e){R&&clearTimeout(R),R=setTimeout(()=>{R=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),D===e&&(D=null,Te()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function De(e,t){if(t&&(R&&(clearTimeout(R),R=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),D=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(qe(n),Se(n))}}function ct(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{D&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),Re()))}))}function Ge(e,t){var r;if(!((r=document.getElementById("btfw-panel-bar"))!=null&&r.classList.contains("open")))return;if(R&&(clearTimeout(R),R=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),D===e&&(D=null,Te()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(i=>{i!==t&&delete i.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",De(e,t)}function dt(e,t){let n=e.querySelector(".btfw-panel-container"),r=()=>{var i;(i=document.getElementById("btfw-panel-bar"))!=null&&i.classList.contains("open")&&(R&&(clearTimeout(R),R=null),De(t,e))};e.addEventListener("mouseenter",r),e.addEventListener("focusin",r),e.addEventListener("click",i=>{i.target.closest(".btfw-panel-container")||(i.preventDefault(),i.stopPropagation(),Ge(t,e))}),e.addEventListener("keydown",i=>{i.key!=="Enter"&&i.key!==" "||(i.preventDefault(),Ge(t,e))}),e.addEventListener("mouseleave",i=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(i.relatedTarget)||Ve(t))}),n==null||n.addEventListener("mouseenter",()=>{R&&(clearTimeout(R),R=null)}),n==null||n.addEventListener("mouseleave",i=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(i.relatedTarget)||Ve(t))})}function He(){let e=ke();d();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((h,_)=>(U[h.dataset.bind]||99)-(U[_.dataset.bind]||99)),r=n.map(h=>h.dataset.bind).join("|"),i=document.getElementById("btfw-panels-menu-btn");if(i&&(i.hidden=n.length===0,n.length===0)){V="",st();return}if(r===V&&t.childElementCount===n.length)return;V=r;let f=t.classList.contains("open"),y=D;if(Re(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((h,_)=>{let E=h.dataset.bind,$=c[E]||{short:"?",title:E},ae=document.createElement("div");ae.className="btfw-panel-btn",ae.dataset.group=E,ae.title=$.title,ae.setAttribute("role","button"),ae.setAttribute("aria-label",$.title),ae.tabIndex=0;let z=document.createElement("span");z.className="btfw-panel-btn__label",z.textContent=C[E]||$.short,ae.appendChild(z),ae.appendChild(at(E,$,_)),t.appendChild(ae),dt(ae,E)}),f&&(Fe(!0),y&&n.some(_=>_.dataset.bind===y))){let _=t.querySelector(`.btfw-panel-btn[data-group="${y}"]`);_&&De(y,_)}}function $e(e,t,n={}){if(!e)return;let r=!!t,i=n.persist===!1,f=e.dataset.bind,y=a[f];e.dataset.docked=r?"true":"false",e.classList.toggle("btfw-stack-item--docked",r);let h=e.querySelector(".btfw-stack-dock-btn");h&&(h.setAttribute("aria-pressed",r?"true":"false"),h.title=r?"Pinned to panels menu":"Dock to panels menu"),r?F(e)?T(e):D===f&&(D=null):(T(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!i&&y&&g(y,r),He(),G()}function Ke(e,t){var _;let n=a[t];if(!n)return;let r=e.querySelector(".btfw-stack-item__header"),i=r==null?void 0:r.querySelector(".btfw-stack-header-toolbar"),f=i==null?void 0:i.querySelector(".btfw-stack-arrows");if(!f||f.querySelector(".btfw-stack-dock-btn"))return;let y=m(n);e.dataset.docked=y?"true":"false",e.classList.toggle("btfw-stack-item--docked",y);let h=document.createElement("button");h.type="button",h.className="btfw-arrow btfw-stack-dock-btn",h.textContent="\u2AF7",h.setAttribute("aria-label",`Dock ${((_=c[t])==null?void 0:_.title)||t} to panels menu`),h.setAttribute("aria-pressed",y?"true":"false"),h.title=y?"Pinned to panels menu":"Dock to panels menu",h.addEventListener("click",E=>{E.preventDefault(),E.stopPropagation(),e.dataset.docked!=="true"&&$e(e,!0)}),f.insertBefore(h,f.firstChild)}function vt(){return fe(p)}function Et(e){ie(p,e)}function xt(){return fe(o)}function _t(e){ie(o,e)}function ut(e,t={}){let{storageKey:n,getDefaultOpen:r,toggleClass:i,ariaLabel:f="Toggle panel visibility",openTitle:y="Hide panel",closeTitle:h="Show panel"}=t,_=fe(n),E=typeof r=="function"?r(_):_!==null?_:!0;e.hasAttribute("data-open")||(e.dataset.open=E?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let $=e.querySelector(".btfw-stack-item__header"),ae=$&&$.querySelector(".btfw-stack-arrows");if(!ae||ae.querySelector(`.${i}`))return;let z=document.createElement("button");z.type="button",z.className=`btfw-arrow ${i}`,z.setAttribute("aria-label",f),z.style.display="flex",z.style.alignItems="center",z.style.justifyContent="center";let K=()=>{let me=e.dataset.open!=="false";z.textContent=me?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",z.title=me?y:h,z.setAttribute("aria-expanded",me?"true":"false"),e.classList.toggle("is-open",me)},q=(me,Ae={})=>{let te=!!me,Ee=Ae.persist===!1;Ee&&(e._btfwSuppressPersist=!0),e.dataset.open=te?"true":"false",K(),Ee||ie(n,te),Ee&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};z.addEventListener("click",me=>{me.preventDefault(),me.stopPropagation(),q(e.dataset.open==="false")}),K(),new MutationObserver(me=>{for(let Ae of me)Ae.type==="attributes"&&(K(),e._btfwSuppressPersist||ie(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),ae.insertBefore(z,ae.firstChild),e._btfwSetOpenState=q,Ke(e,e.dataset.bind)}function Ie(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function ze(e){ue();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let r=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(r){let i=r.querySelector(".btfw-group-body");i&&!i.contains(t)&&i.appendChild(t)}else{let i=N.find(f=>f.id==="motd-group");if(!i)return;r=P(i,[t]),r&&(n.appendChild(r),M(n))}ft(r)}function ft(e){let t=document.getElementById("motdwrap");if(!t)return;let n=w();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let r=A();r&&r.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let r=fe(ye),i=Ce(r,!0);e._btfwSetOpenState?e._btfwSetOpenState(i,{persist:!1}):(e.dataset.open=i?"true":"false",e.classList.toggle("is-open",i))}}function je(e){we&&clearTimeout(we),we=setTimeout(()=>{we=null,ze(e)},50)}function mt(e){let t=A();t&&(oe||(oe=!0,new MutationObserver(()=>{je(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function pt(e){xe||!window.socket||!window.socket.on||(xe=!0,window.socket.on("setMotd",()=>{je(e)}))}function Xe(e){let t=de(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let r=ue(!0),i=(r==null?void 0:r.motd)||A();i&&typeof e=="string"&&(i.innerHTML=e);let f=document.getElementById("cs-motdtext");f&&typeof e=="string"&&(f.value=e),t&&je(t)}function We(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,r=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||r==="video")return;Ie(),Ue();let i=e&&e.list;if(!i)return;let f=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!f){let _=N.find(E=>E.id==="poll-group");if(!_)return;f=P(_,[t]),f&&(i.appendChild(f),M(i));return}let y=f.querySelector(".btfw-group-body");y&&!y.contains(t)&&y.appendChild(t);let h=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');h&&h.contains(t)&&y&&y.appendChild(t)}function Qe(e,t={}){We(e),Be();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Ne(e,t={}){Q&&clearTimeout(Q),Q=setTimeout(()=>{Q=null,Qe(e,t)},50)}function bt(e){if(ee)return;let t=document.getElementById("pollwrap");if(!t)return;ee=!0,new MutationObserver(()=>{Ne(e,{forceOpen:Pe()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let r=document.getElementById("newpollbtn");r&&!r.dataset.btfwPollSync&&(r.dataset.btfwPollSync="1",r.addEventListener("click",()=>{Ne(e,{forceOpen:!0})}))}function ht(e){J||!window.socket||!window.socket.on||(J=!0,window.socket.on("newPoll",()=>Ne(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Ne(e)))}function yt(e){return!!e.closest('.modal, [role="dialog"]')}function Je(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(r=>!yt(r));n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function Ze(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let r=n.querySelector(".btfw-stack-header-actions");if(!r){r=document.createElement("span"),r.className="btfw-stack-header-actions";let i=n.querySelector(".btfw-stack-header-toolbar"),f=(i==null?void 0:i.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");i&&f?i.insertBefore(r,f):f?n.insertBefore(r,f):n.appendChild(r)}return r}function et(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Be(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Pe();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function tt(){let e=Ze("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){et(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let i=document.querySelector("#pollwrap > .poll-controls");i&&i.children.length===0&&i.remove()}let n=Ze("motd-group"),r=document.getElementById("btfw-motd-editbtn");if(n&&r){et(r,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),r.parentElement!==n&&n.appendChild(r);let i=r.closest(".btfw-motd-editrow");i&&i.parentElement&&i.remove()}}function Ue(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(r=>{let i=t.querySelector(".poll-controls");i||(i=document.createElement("div"),i.className="poll-controls",t.insertBefore(i,t.firstChild)),r.parentElement!==i&&i.appendChild(r)}),e.children.length===0&&e.remove())}function gt(e){return N.every(t=>t.selectors.some(r=>{var f,y;if(j.includes(r))return!1;let i=document.querySelector(r);if(!i||e.contains(i)||i.contains(e))return!1;if(r==="#pollwrap"){let h=(f=i.dataset)==null?void 0:f.btfwPollOverlay,_=(y=i.getAttribute)==null?void 0:y.call(i,"data-btfw-poll-overlay");if(h==="video"||_==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function Oe(e){if(!pe){pe=!0;try{let t=e.list,n=e.footer;if(gt(t)&&t.children.length>0){ze(e),We(e),Be(),tt(),Je(n);return}Ue(),Ie();let r=new Map;N.forEach(y=>{let h=[];y.selectors.forEach(_=>{let E=document.querySelector(_);if(E&&!(t.contains(E)||E.contains(t))&&!j.includes(_)){if(_==="#pollwrap"){let $=E.dataset&&E.dataset.btfwPollOverlay,ae=E.getAttribute&&E.getAttribute("data-btfw-poll-overlay");if($==="video"||ae==="video")return}h.push(E)}}),h.length>0&&r.set(y.id,{group:y,elements:h})});let i=H(),f=[];r.forEach(({group:y,elements:h},_)=>{if(!Array.from(t.children).find($=>$.dataset.bind===_))try{let $=P(y,h);$&&f.push({item:$,id:_,priority:y.priority,isGroup:!0})}catch($){console.warn("[stack] Failed to create group item:",_,$)}}),i.length>0?f.sort((y,h)=>{let _=i.findIndex($=>$.id===y.id),E=i.findIndex($=>$.id===h.id);return _>=0&&E>=0?_-E:_>=0?-1:E>=0?1:y.priority-h.priority}):f.sort((y,h)=>y.priority-h.priority),f.forEach(({item:y})=>{try{y&&!t.contains(y)&&!y.contains(t)&&t.appendChild(y)}catch(h){console.warn("[stack] Failed to add item to list:",h)}}),M(t),ze(e),We(e),Be(),tt(),Je(n)}finally{pe=!1}}}function nt(){let e=de();if(!e||(Oe(e),mt(e),pt(e),bt(e),ht(e),_e))return;_e=!0;let t=new MutationObserver(()=>{ve||(ve=requestAnimationFrame(()=>{ve=null,Oe(e)}))}),n=document.getElementById("btfw-leftpad"),r=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),r&&t.observe(r,{childList:!0,subtree:!1}),setTimeout(()=>{let y=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');y&&v(y,ye,E=>Ce(E,w()));let h=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');h&&v(h,p,E=>E!==null?!!E:!0);let _=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');_&&v(_,o,E=>Ce(E,Pe())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(E=>{let $=a[E.dataset.bind];$&&$e(E,m($),{persist:!1})}),ke(),d(),He(),Qe(e),G()},1e3);let i=0,f=setInterval(()=>{Oe(e),++i>2&&clearInterval(f)},700)}return document.addEventListener("btfw:layoutReady",nt),document.addEventListener("btfw:chat:barsReady",()=>{ke(),d(),He()}),setTimeout(nt,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=de();e&&setTimeout(()=>Oe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Xe(t)}),{name:"feature:stack",hasMotdContent:w,resolveMotdHost:A,normalizeMotdStructure:ue,applyMotdUpdate:Xe}});BTFW.define("feature:videoOverlay",[],async()=>{let B=(s,d=document)=>d.querySelector(s),W=["#mediarefresh","#voteskip","#fullscreenbtn"],be={localSubs:"btfw:video:localsubs"},S=5,ye={owner:["chanowner","owner","founder","admin","administrator"]};function p(){var s;try{return((s=window.PLAYER)==null?void 0:s.mediaType)||null}catch(d){return null}}function o(){let s=(p()||"").toLowerCase();return s==="fi"||s==="gd"}function a(){try{return window.CLIENT||window.client||null}catch(s){return null}}function b(){try{return window.CHANNEL||window.channel||null}catch(s){return null}}function c(){let s=b();if(s&&typeof s.perms=="object"&&s.perms)return s.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(d){return{}}}function C(s=[]){let d=c();for(let k of s){let L=d==null?void 0:d[k];if(typeof L=="number")return L}}function U(){let s=C(ye.owner);return typeof s=="number"?s:S}function X(s){if(!s)return!1;try{if(typeof s.hasPermission=="function"&&s.hasPermission("chanowner"))return!0}catch(d){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(d){}return!1}function D(){let s=a();if(!s)return!1;let d=Number(s.rank);return Number.isFinite(d)?!!(d>=U()||X(s)):!1}let V=()=>{try{return localStorage.getItem(be.localSubs)!=="0"}catch(s){return!0}},R=s=>{try{localStorage.setItem(be.localSubs,s?"1":"0")}catch(d){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!s}}))},Y=0,O=0,I=0,Q=2e3,ee=8e3,J=45e3,we=12e4,oe=ee,xe=!1,pe=null;function ve(){if(B("#btfw-vo-css"))return;let s=document.createElement("style");s.id="btfw-vo-css",s.textContent=`
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
    `,document.head.appendChild(s)}function _e(s){let d=B("#videowrap");!d||!s||((s.parentElement!==d.parentElement||s.previousElementSibling!==d)&&d.insertAdjacentElement("afterend",s),s.classList.add("btfw-vo-visible"))}function se(){if(!B("#videowrap"))return null;let d=B("#btfw-video-overlay");d||(d=document.createElement("div"),d.id="btfw-video-overlay",d.setAttribute("data-testid","btfw-video-overlay")),d.classList.add("btfw-video-overlay"),d.getAttribute("data-testid")||d.setAttribute("data-testid","btfw-video-overlay"),_e(d);let k=d.querySelector("#btfw-vo-bar");k||(k=document.createElement("div"),k.className="btfw-vo-bar",k.id="btfw-vo-bar",d.appendChild(k));let L=A(d,k);return G(L.left),l(L),P(L),w(d),d}function w(s){s&&s.querySelectorAll("button").forEach(d=>{d.classList.contains("btfw-vo-btn")||d.classList.add("btfw-vo-btn")})}function A(s,d){let k="btfw-vo-left",L="btfw-vo-right",Z=d.querySelector(`#${k}`);Z||(Z=document.createElement("div"),Z.id=k,Z.className="btfw-vo-section btfw-vo-section--left",d.insertBefore(Z,d.firstChild));let re=d.querySelector(`#${L}`);return re||(re=document.createElement("div"),re.id=L,re.className="btfw-vo-section btfw-vo-section--right",d.appendChild(re)),Array.from(d.children).forEach(ge=>{ge===Z||ge===re||re.appendChild(ge)}),s.dataset.leftSection=`#${k}`,s.dataset.rightSection=`#${L}`,d.dataset.leftSection=`#${k}`,d.dataset.rightSection=`#${L}`,{left:Z,right:re}}function N(){return document.querySelector("#ytapiplayer video, video")}function j(s=N()){return s?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof s.webkitShowPlaybackTargetPicker=="function":!1}function le(){if(!pe)return;let s=pe._btfwAirplayHandler;if(s){try{pe.removeEventListener("webkitplaybacktargetavailabilitychanged",s)}catch(d){}delete pe._btfwAirplayHandler}pe=null}function ce(s){if(!s||typeof s.addEventListener!="function"){le();return}if(pe===s)return;le();let d=k=>{let L=!k||k.availability==="available",Z=B("#btfw-airplay");Z&&(Z.style.display=L?"":"none")};try{s.addEventListener("webkitplaybacktargetavailabilitychanged",d),s._btfwAirplayHandler=d,pe=s}catch(k){}}function de(){let s=B("#btfw-airplay");if(!s)return;let d=N();if(!j(d)){s.style.display="none",le();return}s.style.display="",ce(d)}function ue(s,d){d&&d.classList.add("btfw-vo-visible")}function l(s){if(!(s!=null&&s.right)||!(s!=null&&s.left))return;let d=[];document.querySelector("#fullscreenbtn")||d.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:fe,section:"right"}),d.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:g,section:"right"}),d.forEach(k=>{let L=document.querySelector(`#${k.id}`),Z=k.section==="left"?s.left:s.right;L?Z&&L.parentElement!==Z&&Z.appendChild(L):(L=document.createElement("button"),L.id=k.id,L.className="btfw-vo-btn",L.innerHTML=`<i class="${k.icon}"></i>`,L.title=k.tooltip,L.addEventListener("click",k.action),(Z||s.right).appendChild(L))}),de()}function P(s){let d=s==null?void 0:s.right;d&&W.forEach(k=>{let L=document.querySelector(k);if(!L)return;if(L.dataset.btfwOverlay==="1"){L.parentElement!==d&&d.appendChild(L);return}let Z=document.createElement("span");Z.hidden=!0,Z.setAttribute("data-btfw-ph",k);try{L.insertAdjacentElement("afterend",Z)}catch(re){}if(L.classList.add("btfw-vo-adopted"),L.dataset.btfwOverlay="1",L.id==="mediarefresh"){let re=L.onclick;L.onclick=ge=>{ge.preventDefault();let Te=!!(ge&&ge.isTrusted);H(()=>{if(typeof re=="function")try{return re.call(L,ge),!0}catch(Se){console.warn("[video-overlay] native refresh handler failed:",Se)}return!1},{isUserAction:Te})}}d.appendChild(L)})}function M(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(s){console.warn("[video-overlay] Media refresh failed:",s)}return!1}function H(s,d={}){let{isUserAction:k=!1}=d,L=Date.now();if(I&&L-I>we&&(oe=ee,Y=0),L<O){let Se=Math.ceil((O-L)/1e3);return x(k?`Refresh available in ${Se}s`:`Auto refresh paused. Next attempt in ${Se}s`,"warning"),!1}let Z=k?Q:oe;if(I&&L-I<Z){let Se=Z-(L-I),Me=Math.ceil(Se/1e3);return O=L+Se,x(k?`Refresh available in ${Me}s`:`Auto refresh paused. Next attempt in ${Me}s`,"warning"),!1}if(Y++,Y>=10)return O=L+3e4,Y=0,x("Refresh limit reached. 30s cooldown active.","error"),!1;let re=k?6e3:Math.max(12e3,oe+2e3);setTimeout(()=>{Y>0&&Y--},re);let ge=!1;if(typeof s=="function")try{ge=s()===!0}catch(Se){console.warn("[video-overlay] Refresh handler error:",Se)}return ge||(ge=M()),I=Date.now(),k?oe=ee:oe=Math.min(J,Math.max(ee,Math.round(oe*(ge?1.25:1.5)))),O=Math.max(O,I+(k?Q:oe)),!k&&ge?x(`Auto refresh sent. Next attempt in ${Math.ceil(oe/1e3)}s`,"info"):x(ge?"Media refreshed":"Unable to refresh media",ge?"success":"error"),ge}function fe(){let s=B("#videowrap");s&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen())}function ie(s,d=!0){if(!s||!j(s))return!1;if(s.setAttribute("airplay","allow"),s.setAttribute("x-webkit-airplay","allow"),d&&typeof s.webkitShowPlaybackTargetPicker=="function")try{s.webkitShowPlaybackTargetPicker()}catch(k){console.warn("[video-overlay] AirPlay picker failed:",k)}return de(),!0}function m(){if(!(xe||!window.socket)){xe=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let s=N();s&&(ie(s,!1),ce(s)),de()},1e3)})}catch(s){console.warn("[video-overlay] Failed to attach AirPlay listener:",s)}}}function g(){let s=N();return j(s)?ie(s)?(x("AirPlay enabled","success"),m(),!0):(x("AirPlay not available","warning"),!1):(de(),x("AirPlay not available","warning"),!1)}function x(s,d="info"){let k=document.getElementById("btfw-notification");k||(k=document.createElement("div"),k.id="btfw-notification",k.className="btfw-notification",document.body.appendChild(k)),k.textContent=s,k.className=`btfw-notification btfw-notification--${d} btfw-notification--show`,clearTimeout(k._hideTimer),k._hideTimer=setTimeout(()=>{k.classList.remove("btfw-notification--show")},3e3)}function F(){return B("video")}function ne(s){let d=(s||"").replace(/\r\n/g,`
`).trim()+`
`;return d=d.replace(/^\d+\s*$\n/gm,""),d=d.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),d=d.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+d}async function u(){let s=F();if(!s){v("Local subs only for HTML5 sources.");return}let d=document.createElement("input");d.type="file",d.accept=".vtt,.srt,text/vtt,text/plain",d.style.display="none",document.body.appendChild(d);let k=new Promise(L=>{d.addEventListener("change",async()=>{let Z=d.files&&d.files[0];if(document.body.removeChild(d),!Z)return L(!1);try{let re=await Z.text(),Te=(Z.name.split(".").pop()||"").toLowerCase()==="srt"?ne(re):re.startsWith("WEBVTT")?re:`WEBVTT

`+re,Se=URL.createObjectURL(new Blob([Te],{type:"text/vtt"}));T(s,Se,Z.name.replace(/\.[^.]+$/,"")||"Local"),v("Subtitles loaded."),L(!0)}catch(re){console.error(re),v("Failed to load subtitles."),L(!1)}},{once:!0})});d.click(),await k}function T(s,d,k){var Z;(Z=B('track[data-btfw="1"]',s))==null||Z.remove();let L=document.createElement("track");L.kind="subtitles",L.label=k||"Local",L.srclang="en",L.src=d,L.default=!0,L.setAttribute("data-btfw","1"),s.appendChild(L);try{for(let re of s.textTracks)re.mode=re.label===L.label?"showing":"disabled"}catch(re){}}function v(s){let d=B("#btfw-mini-toast");d||(d=document.createElement("div"),d.id="btfw-mini-toast",document.body.appendChild(d)),d.textContent=s,d.style.opacity="1",clearTimeout(d._hid),d._hid=setTimeout(()=>d.style.opacity="0",1400)}function G(s){if(!s)return;let d=document.querySelector("#btfw-vo-subs");d||(d=document.createElement("button"),d.id="btfw-vo-subs",d.className="btfw-vo-btn",d.title="Load local subtitles (.vtt/.srt)",d.innerHTML='<i class="fa fa-closed-captioning"></i>',d.addEventListener("click",L=>{L.preventDefault(),u()}),s.insertBefore(d,s.firstChild||null));let k=V()&&o();d.style.display=k?"":"none"}function ke(){ve(),se();let s=[B("#videowrap"),B("#rightcontrols"),B("#leftcontrols"),document.body].filter(Boolean),d=new MutationObserver(()=>se());s.forEach(k=>d.observe(k,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>se());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>se(),0)})}catch(k){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ke):ke(),{name:"feature:videoOverlay",setLocalSubsEnabled:R,toggleFullscreen:fe,enableAirplay:g}});(function(){"use strict";let S="https://vidprox.movies-storage-a.workers.dev/?url=";function ye(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function p(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var a,b,c;let o=typeof window!="undefined"&&(((a=window.BTFW_CONFIG)==null?void 0:a.corsVideoProxy)||((c=(b=window.BTFW_CONFIG)==null?void 0:b.integrations)==null?void 0:c.corsVideoProxy));if(typeof o=="string"&&o.trim()){let C=o.trim();if(C.includes("?"))return C;let U=C.endsWith("/")?"":"/";return`${C}${U}?url=`}return S},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(o){try{return new URL(S).origin.toLowerCase()}catch(a){return""}}},_isTrusted(o){if(!o)return!1;if(String(o).includes(this.CORS_PROXY))return!0;try{let a=new URL(o),b=a.origin.toLowerCase(),c=this._getCorsProxyOrigin();return c&&b===c?!0:/^vidprox\./i.test(a.hostname)}catch(a){return!1}},_unwrapProxiedUrl(o){if(!o||!this._isTrusted(o))return o;try{return new URL(o).searchParams.get("url")||o}catch(a){return o}},_markInternalSrcSet(){this._lastInternalSrcSetAt=p()},_isInsideInternalWindow(){return p()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let o=this._getMediaElement();return o?o.crossOrigin==="anonymous"||o.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var a,b,c,C;if(this._hasAnonymousCrossOrigin())return!1;let o=((b=(a=this.player)==null?void 0:a.currentSrc)==null?void 0:b.call(a))||((c=this._getMediaElement())==null?void 0:c.currentSrc)||"";if(o&&!this._isTrusted(o))return!1;try{return(C=this.player)==null||C.crossOrigin("anonymous"),!0}catch(U){return!1}},_clearMediaElementForCorsSwap(){let o=this._getMediaElement();if(o)try{for(o.removeAttribute("src"),o.removeAttribute("crossorigin");o.firstChild;)o.removeChild(o.firstChild);o.load()}catch(a){}},_same(o,a){return String(o||"")===String(a||"")},_getMediaElement(){var b;let o=(b=this.player)==null?void 0:b.tech_;if(o){try{let c=typeof o.el=="function"?o.el():null;if(c instanceof HTMLMediaElement&&c.isConnected)return c}catch(c){}if(o.el_ instanceof HTMLMediaElement&&o.el_.isConnected)return o.el_}let a=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return a instanceof HTMLMediaElement&&a.isConnected?a:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(o){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(o){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(o){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(o){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(o){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(o){}this.mergerNode=null}},resetMediaBinding(){var a,b;this.disconnectChain();let o=this._getMediaElement();if(o&&this._syncFromRegistry(o)){((a=this.audioContext)==null?void 0:a.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(o){var X;let a=(X=this.player)==null?void 0:X.tech_;if(!(a!=null&&a.el_)||a.el_!==o)return null;let b=o.parentNode;if(!b)return null;let c=o.tagName.toLowerCase()==="audio"?"audio":"video",C=document.createElement(c);C.className=o.className,o.id&&(C.id=o.id),C.setAttribute("playsinline",""),C.setAttribute("webkit-playsinline",""),C.classList.contains("vjs-tech")||C.classList.add("vjs-tech");let U=o.crossOrigin||o.getAttribute("crossorigin");return U&&(C.crossOrigin=U,C.setAttribute("crossorigin",U)),b.replaceChild(C,o),a.el_=C,delete o.__btfwSourceNode,C},_syncFromRegistry(o){let a=ye().get(o)||o.__btfwSourceNode||null;return a?(ye().set(o,a),this.sourceNode=a,this._sourceMediaElement=o,a.context&&a.context.state!=="closed"&&(this.audioContext=a.context),a):null},_getOrCreateSourceNode(o){var C;let a=ye(),b=a.get(o)||o.__btfwSourceNode||null;if(b)return a.set(o,b),this.sourceNode=b,this._sourceMediaElement=o,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b;if(this.sourceNode&&this._sourceMediaElement===o)return a.set(o,this.sourceNode),o.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let c;try{c=this.audioContext.createMediaElementSource(o)}catch(U){if((U==null?void 0:U.name)!=="InvalidStateError")throw U;let X=this._syncFromRegistry(o);if(X)return X;let D=this._swapVideoTechElement(o);if(!D)throw U;let V=(C=this.player)==null?void 0:C.currentSrc();if(V&&this.player){this._markInternalSrcSet(),this.player.src({src:V,type:"video/mp4"});try{this.player.load()}catch(R){}}return this._getOrCreateSourceNode(D)}return a.set(o,c),o.__btfwSourceNode=c,this.sourceNode=c,this._sourceMediaElement=o,c},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(o){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(o){return!1}},_clearCrossOriginAttribute(){var a,b;let o=this._getMediaElement();if(o)try{o.crossOrigin=null,o.removeAttribute("crossorigin")}catch(c){}try{(b=(a=this.player)==null?void 0:a.crossOrigin)==null||b.call(a,null)}catch(c){}},cleanup(){this.disconnectChain();let o=this._getMediaElement();o&&(o.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){var a,b;this.cleanup();let o=((b=(a=this.player)==null?void 0:a.currentSrc)==null?void 0:b.call(a))||"";return this.sourceNode&&o&&!this._isTrusted(o)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(o,{currentTime:a=0,wasPlaying:b=!1,clearCrossOrigin:c=!1}={}){if(!this.player||!o)return Promise.resolve(!1);try{this.player.pause()}catch(C){}c&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(C){}return new Promise(C=>{let U=!1,X=()=>{if(U)return;U=!0;try{this.player.off("canplay",D)}catch(R){}try{this.player.off("loadeddata",D)}catch(R){}try{this.player.currentTime(a)}catch(R){}let V=b?this.player.play():Promise.resolve();Promise.resolve(V).catch(()=>{}).finally(()=>C(!0))},D=()=>X();try{this.player.one("canplay",D)}catch(V){try{this.player.on("canplay",D)}catch(R){}}try{this.player.one("loadeddata",D)}catch(V){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&X()}catch(V){}}),setTimeout(X,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let a=new MutationObserver(()=>{this._checkAndReapply("sources")});a.observe(o,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=a}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([a,b])=>{this.player.on(a,b)})}catch(a){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this.player.currentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;if(this._stopWatchdogInterval(),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(a){}try{(o=this._mutationObserver._sourceObserver)==null||o.disconnect()}catch(a){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([a,b])=>{this.player.off(a,b)})}catch(a){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(o){if(!this.player)return;let a=this.player.currentSrc();if(a&&(this._lastKnownSrc=a,!this._isInsideInternalWindow())){if(this._isTrusted(a)){this.isProxied=!0,this.proxiedSrc=a,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(a)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(p()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=p(),this._forceProxyPreservingState(a)}}},async _forceProxyPreservingState(o){if(!this.player)return!1;let a=this.player.currentTime(),b=!this.player.paused();if(this._isTrusted(o))return this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(o)||o,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(c){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(c){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(c){}return new Promise(c=>{let C=!1,U=()=>{if(!C){C=!0;try{this.player.off("canplay",X)}catch(D){}try{this.player.off("loadeddata",X)}catch(D){}try{this.player.currentTime(a)}catch(D){}this.isProxied=!0,b&&this.player.play().catch(()=>{}),c(!0)}},X=()=>U();try{this.player.one("canplay",X)}catch(D){try{this.player.on("canplay",X)}catch(V){}}try{this.player.one("loadeddata",X)}catch(D){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&U()}catch(D){}}),setTimeout(U,5e3)})},async ensureProxy(){if(!this.player)return!1;let o=this.player.currentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let a=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(c){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(c){}return new Promise(c=>{this.player.ready(()=>{try{this.player.currentTime(a)}catch(C){}b&&this.player.play().catch(()=>{}),c(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var a;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let b=this.player.currentSrc();if(this._isTrusted(b))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this.player.currentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let o=this._getMediaElement();if(!o)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((a=this.audioContext)==null?void 0:a.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),o.disableRemotePlayback=!0;let c=this._getOrCreateSourceNode(o);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let C=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(C.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(C.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(C.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(C.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(C.release,this.audioContext.currentTime),c.connect(this.compressorNode),c=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),c.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),c=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,c.connect(this.gainNode),c=this.gainNode),c.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(b){return console.error("[BTFW_AUDIO] Error building audio chain:",b),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(o){return this.NORM_PRESETS[o]?(this.currentNormPreset=o,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(o){return this.BOOST_MULTIPLIER=o,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()}}})();(function(){"use strict";let B=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),W=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),be="--btfw-boost-anchor",S="--btfw-norm-anchor";function ye(o,a,b){if(W&&b){a.style.setProperty("anchor-name",b),o.style.setProperty("position-anchor",b),o.style.setProperty("top","anchor(bottom)"),o.style.setProperty("left","anchor(left)");return}let c=a.getBoundingClientRect();o.style.left=c.left+"px",o.style.top=c.bottom+"px"}function p(o){window.BTFW&&typeof BTFW.define=="function"?o():setTimeout(()=>p(o),0)}p(function(){BTFW.define("feature:audio",[],async()=>{let o=(u,T=document)=>T.querySelector(u),a=window.BTFW_AUDIO,b=null,c=null,C=null,U=!1,X=!1,D=!1,V=null,R=null,Y=null,O=null,I=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function Q(u){b&&(u?(b.classList.add("active"),b.style.background="rgba(46, 213, 115, 0.3)",b.style.borderColor="#2ed573",b.style.color="#2ed573",b.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(b.classList.remove("active"),b.style.background="",b.style.borderColor="",b.style.color="",b.style.boxShadow=""))}function ee(u,T="info"){let v=o("#btfw-audioboost-toast");v||(v=document.createElement("div"),v.id="btfw-audioboost-toast",v.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${T==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=T==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function J(){if(await a.enableBoost()){U=!0;let T=Math.round(a.BOOST_MULTIPLIER*100);ee(`Boosted by ${T}%`,"success"),Q(!0)}else{let T=a._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";ee(T,"error")}}async function we(){await a.disableBoost(),U=!1,Q(!1)}function oe(u){c&&(u?(c.classList.add("active"),c.style.background="rgba(52, 152, 219, 0.3)",c.style.borderColor="#3498db",c.style.color="#3498db",c.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(c.classList.remove("active"),c.style.background="",c.style.borderColor="",c.style.color="",c.style.boxShadow=""))}function xe(u,T="info"){let v=o("#btfw-audionorm-toast");v||(v=document.createElement("div"),v.id="btfw-audionorm-toast",v.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${T==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=T==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function pe(){if(await a.enableNormalization())X=!0,xe("Normalization enabled","success"),oe(!0);else{let T=a._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";xe(T,"error")}}async function ve(){await a.disableNormalization(),X=!1,oe(!1)}function _e(u){C&&(u?(C.classList.add("active"),C.style.background="rgba(155, 89, 182, 0.3)",C.style.borderColor="#9b59b6",C.style.color="#9b59b6",C.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(C.classList.remove("active"),C.style.background="",C.style.borderColor="",C.style.color="",C.style.boxShadow=""))}function se(u,T="info"){let v=o("#btfw-mono-toast");v||(v=document.createElement("div"),v.id="btfw-mono-toast",v.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${T==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=T==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function w(){if(await a.enableMono())D=!0,se("Stereo audio enabled","success"),_e(!0);else{let T=a._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";se(T,"error")}}async function A(){await a.disableMono(),D=!1,_e(!1)}function N(){let u=document.createElement("button");u.id="btfw-vo-audioboost",u.className="btn btn-sm btn-default btfw-vo-adopted";let T=Math.round(a.BOOST_MULTIPLIER*100);return u.title=`Toggle Audio Boost (${T}%)`,u.setAttribute("data-btfw-overlay","1"),u.innerHTML='<i class="fa-solid fa-megaphone"></i>',u.addEventListener("click",()=>{a.boostEnabled?we():J()}),u.addEventListener("mouseenter",()=>{Y&&(clearTimeout(Y),Y=null),de()}),u.addEventListener("mouseleave",()=>{Y=setTimeout(()=>ue(),150)}),u}function j(){let u=document.createElement("button");u.id="btfw-vo-audionorm",u.className="btn btn-sm btn-default btfw-vo-adopted";let T=a.NORM_PRESETS[a.currentNormPreset].label;return u.title=`Toggle Audio Normalization (${T})`,u.setAttribute("data-btfw-overlay","1"),u.innerHTML='<i class="fa-solid fa-waveform-lines"></i>',u.addEventListener("click",()=>{a.normalizationEnabled?ve():pe()}),u.addEventListener("mouseenter",()=>{O&&(clearTimeout(O),O=null),M()}),u.addEventListener("mouseleave",()=>{O=setTimeout(()=>H(),150)}),u}function le(){let u=document.createElement("button");return u.id="btfw-vo-mono",u.className="btn btn-sm btn-default btfw-vo-adopted",u.title="Toggle Mono Audio (mix both channels to stereo)",u.setAttribute("data-btfw-overlay","1"),u.innerHTML='<i class="fa-solid fa-headphones"></i>',u.addEventListener("click",()=>{a.monoEnabled?A():w()}),u}function ce(){if(V)return V;let u=document.createElement("div");return u.id="btfw-boost-context-menu",B&&(u.popover="auto"),u.style.cssText=`
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
          ${B?"":"display: none;"}
        `,I.forEach(T=>{let v=document.createElement("button");v.className="btfw-context-item",v.textContent=T.label,v.style.cssText=`
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
          `,a.BOOST_MULTIPLIER===T.multiplier&&(v.style.background="rgba(46, 213, 115, 0.2)",v.style.color="#2ed573"),v.addEventListener("mouseenter",()=>{a.BOOST_MULTIPLIER!==T.multiplier&&(v.style.background="rgba(109, 77, 246, 0.2)")}),v.addEventListener("mouseleave",()=>{a.BOOST_MULTIPLIER!==T.multiplier&&(v.style.background="transparent")}),v.addEventListener("click",async()=>{if(await a.setBoostMultiplier(T.multiplier),l(),b){let G=Math.round(T.multiplier*100);b.title=`Toggle Audio Boost (${G}%)`}a.boostEnabled&&ee(`Boost set to ${T.label}`,"success")}),u.appendChild(v)}),u.addEventListener("mouseenter",()=>{Y&&(clearTimeout(Y),Y=null)}),u.addEventListener("mouseleave",()=>{Y=setTimeout(()=>ue(),100)}),document.body.appendChild(u),V=u,u}function de(){if(!b)return;let u=ce();ye(u,b,be),B?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function ue(){V&&(B?V.matches(":popover-open")&&V.hidePopover():V.style.display="none")}function l(){if(!V)return;V.querySelectorAll(".btfw-context-item").forEach((T,v)=>{let G=I[v];a.BOOST_MULTIPLIER===G.multiplier?(T.style.background="rgba(46, 213, 115, 0.2)",T.style.color="#2ed573"):(T.style.background="transparent",T.style.color="#e0e0e0")})}function P(){if(R)return R;let u=document.createElement("div");return u.id="btfw-norm-context-menu",B&&(u.popover="auto"),u.style.cssText=`
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
          ${B?"":"display: none;"}
        `,Object.keys(a.NORM_PRESETS).forEach(T=>{let v=a.NORM_PRESETS[T],G=document.createElement("button");G.className="btfw-context-item",G.textContent=v.label,G.style.cssText=`
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
          `,a.currentNormPreset===T&&(G.style.background="rgba(52, 152, 219, 0.2)",G.style.color="#3498db"),G.addEventListener("mouseenter",()=>{a.currentNormPreset!==T&&(G.style.background="rgba(109, 77, 246, 0.2)")}),G.addEventListener("mouseleave",()=>{a.currentNormPreset!==T&&(G.style.background="transparent")}),G.addEventListener("click",async()=>{await a.setNormPreset(T),fe(),c&&(c.title=`Toggle Audio Normalization (${v.label})`),a.normalizationEnabled&&xe(`Preset: ${v.label}`,"success")}),u.appendChild(G)}),u.addEventListener("mouseenter",()=>{O&&(clearTimeout(O),O=null)}),u.addEventListener("mouseleave",()=>{O=setTimeout(()=>H(),100)}),document.body.appendChild(u),R=u,u}function M(){if(!c)return;let u=P();ye(u,c,S),B?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function H(){R&&(B?R.matches(":popover-open")&&R.hidePopover():R.style.display="none")}function fe(){if(!R)return;let u=R.querySelectorAll(".btfw-context-item");Object.keys(a.NORM_PRESETS).forEach((T,v)=>{let G=u[v];a.currentNormPreset===T?(G.style.background="rgba(52, 152, 219, 0.2)",G.style.color="#3498db"):(G.style.background="transparent",G.style.color="#e0e0e0")})}function ie(){let u=o("#btfw-vo-left");if(!u)return!1;let T=o("#btfw-vo-audioboost");T&&T.remove();let v=o("#btfw-vo-audionorm");v&&v.remove();let G=o("#btfw-vo-mono");return G&&G.remove(),b=N(),c=j(),C=le(),u.appendChild(b),u.appendChild(c),u.appendChild(C),!0}function m(u,T=20){let v=0,G=setInterval(()=>{v++,ie()?(clearInterval(G),u()):v>=T&&clearInterval(G)},500)}function g(){if(typeof videojs=="undefined"){setTimeout(g,500);return}if(!o("#ytapiplayer")){setTimeout(g,500);return}a.player=videojs("ytapiplayer"),a.originalSrc=a.player.currentSrc(),a.startWatchdog()}function x(){setTimeout(()=>{a.resetMediaBinding(),a.boostEnabled=!1,a.normalizationEnabled=!1,a.monoEnabled=!1,a.isProxied=!1,Q(!1),oe(!1),_e(!1),g(),U&&setTimeout(()=>{J()},1200),X&&setTimeout(()=>{pe()},1200),D&&setTimeout(()=>{w()},1200)},600)}function F(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>a._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>a._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",x))}function ne(){m(()=>{g()}),F()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ne):ne(),{name:"feature:audio",activate:J,deactivate:we,isActive:()=>a.boostEnabled,activateNormalization:pe,deactivateNormalization:ve,isNormalizationActive:()=>a.normalizationEnabled,activateMono:w,deactivateMono:A,isMonoActive:()=>a.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async o=>o.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:B})=>{let W=await B("util:tmdb-proxy"),be="movie-info",S={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},ye="btfw-movie-info-style",p={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},o=0,a=!1,b=null;function c(m){typeof m=="function"&&p.cleanup.push(m)}function C(){for(;p.cleanup.length;){let m=p.cleanup.pop();try{m()}catch(g){}}p.header&&(p.header.remove(),p.header=null)}function U(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null),p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null),o=0,p.currentTitle="",p.isInitialized=!1,C()}function X(m){if(typeof m=="boolean")return m;if(typeof m=="number")return Number.isFinite(m)?m>0:!1;if(typeof m=="string"){let g=m.trim().toLowerCase();return g?g==="1"||g==="true"||g==="yes"||g==="on":!1}return!1}function D(){let m=[()=>{var g,x,F;return(F=(x=(g=window.BTFW_THEME_ADMIN)==null?void 0:g.integrations)==null?void 0:x.movieInfo)==null?void 0:F.enabled},()=>{var g,x,F;return(F=(x=(g=window.BTFW_CONFIG)==null?void 0:g.integrations)==null?void 0:x.movieInfo)==null?void 0:F.enabled},()=>{var g,x;return(x=(g=window.BTFW_CONFIG)==null?void 0:g.movieInfo)==null?void 0:x.enabled},()=>{var g;return(g=window.BTFW_CONFIG)==null?void 0:g.movieInfoEnabled},()=>{var g,x;return(x=(g=document==null?void 0:document.body)==null?void 0:g.dataset)==null?void 0:x.btfwMovieInfoEnabled}];for(let g of m)try{let x=typeof g=="function"?g():g;if(X(x))return!0}catch(x){}return!1}function V(){if(b||typeof MutationObserver!="function")return;let m=document.body;m&&(b=new MutationObserver(()=>I()),b.observe(m,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function R(){if(a)return;a=!0;let m=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",m),document.addEventListener("btfw:ready",m)}function Y(m=0){p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.initTimer=window.setTimeout(()=>{p.initTimer=null,D()&&O()},Math.max(0,m))}function O(){if(p.isInitialized)return;let m=document.querySelector(S.TOPBAR_SELECTOR);if(!m){Y(500);return}try{Q(m),fe(),J(),p.isInitialized=!0,setTimeout(()=>{w(),A()},120)}catch(g){Y(800)}}function I(){D()?p.isInitialized?(w(),setTimeout(A,80)):Y(0):U()}function Q(m){if(!m&&(m=document.querySelector(S.TOPBAR_SELECTOR),!m))throw new Error("Chat topbar not found");let g=document.getElementById(S.CONTAINER_ID);g&&g.remove();let x=document.createElement("div");x.id=S.CONTAINER_ID,x.className="btfw-movie-header hide",x.dataset.module=be,m.insertAdjacentElement("afterend",x),p.header=x}function ee(){try{return window.socket||window.SOCKET||null}catch(m){return null}}function J(){we(),pe();let m=H(w,250);window.addEventListener("resize",m),c(()=>window.removeEventListener("resize",m))}function we(){oe(),xe()}function oe(){let m=document.querySelector(S.TITLE_SELECTOR);if(m){let g=()=>_e(),x=()=>se();m.addEventListener("mouseenter",g),m.addEventListener("mouseleave",x),c(()=>{m.removeEventListener("mouseenter",g),m.removeEventListener("mouseleave",x)})}else if(typeof MutationObserver=="function"){let g=new MutationObserver(()=>{document.querySelector(S.TITLE_SELECTOR)&&(g.disconnect(),oe())});g.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),c(()=>{try{g.disconnect()}catch(x){}})}}function xe(){let m=p.header;if(!m)return;let g=()=>ve(),x=()=>se();m.addEventListener("mouseenter",g),m.addEventListener("mouseleave",x),c(()=>{m.removeEventListener("mouseenter",g),m.removeEventListener("mouseleave",x)})}function pe(){let m=ee();if(m&&typeof m.on=="function"){m.on("changeMedia",A),c(()=>{var F,ne;try{(F=m.off)==null||F.call(m,"changeMedia",A)}catch(u){try{(ne=m.removeListener)==null||ne.call(m,"changeMedia",A)}catch(T){}}});return}let g=0,x=()=>{if(!D()){p.socketRetryTimer=null;return}let F=ee();if(F&&typeof F.on=="function"){F.on("changeMedia",A),c(()=>{var ne,u;try{(ne=F.off)==null||ne.call(F,"changeMedia",A)}catch(T){try{(u=F.removeListener)==null||u.call(F,"changeMedia",A)}catch(v){}}}),p.socketRetryTimer=null;return}if(g+=1,g>10){p.socketRetryTimer=null;return}p.socketRetryTimer=window.setTimeout(x,1e3)};p.socketRetryTimer=window.setTimeout(x,1200),c(()=>{p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null)})}function ve(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null)}function _e(){ve(),p.header&&(p.header.classList.remove("hide"),p.header.classList.add("show"))}function se(){ve(),p.hideTimer=window.setTimeout(()=>{p.header&&(p.header.classList.remove("show"),p.header.classList.add("hide"),setTimeout(()=>{p.header&&p.header.classList.contains("hide")&&p.header.classList.remove("hide")},320))},300)}function w(){if(!p.header)return;let m=window.innerWidth<=768;p.header.classList.toggle("btfw-mobile",m)}async function A(){var ne;if(!p.isInitialized)return;let m=document.querySelector(S.TITLE_SELECTOR),g=p.header;if(!m||!g)return;let x=((ne=m.textContent)==null?void 0:ne.trim())||"";if(!x){p.currentTitle="",de();return}if(x===p.currentTitle)return;p.currentTitle=x;let F=++o;le();try{let u=await j(x);if(F!==o)return;l(u)}catch(u){if(F!==o)return;W.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ce()}}function N(m){let g=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],x=m;return g.forEach(F=>{let ne=new RegExp(`\\b${F}\\b`,"gi");x=x.replace(ne,"")}),x.replace(/\s{2,}/g," ").trim()}async function j(m){var T;if(!W.isAvailable())throw new Error(W.MISSING_PROXY_MSG);let g=m.match(/(.+)\s*\((\d{4})\)/),x=g?g[1].trim():m,F=g?g[2]:"";F||(g=m.match(/(.+?)\s+(\d{4})\s*$/),g&&(x=g[1].trim(),F=g[2]));let ne=N(x),u=await W.tmdbFetch("search/movie",{query:ne,year:F});if(((T=u==null?void 0:u.results)==null?void 0:T.length)>0){let v=u.results[0];return{title:m,backdrop:v.backdrop_path?`https://image.tmdb.org/t/p/w1280${v.backdrop_path}`:null,poster:v.poster_path?`https://image.tmdb.org/t/p/w500${v.poster_path}`:null,summary:v.overview||"",rating:v.vote_average||0,releaseDate:v.release_date||"",voteCount:v.vote_count||0}}return{title:m,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function le(){p.header&&(ue(),p.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-loading">
          <i class="fa fa-spinner fa-spin"></i>
          <p>Loading movie information...</p>
        </div>
      </div>
    `)}function ce(){p.header&&(ue(),p.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-error">
          <i class="fa fa-exclamation-triangle"></i>
          <p>Unable to fetch movie information</p>
          <small>Check TMDB API key in Theme Settings</small>
        </div>
      </div>
    `)}function de(){p.header&&(ue(),p.header.innerHTML=`
      <div class="btfw-movie-content">
        <p>No movie information available</p>
      </div>
    `)}function ue(){p.header&&(p.header.style.backgroundImage="",p.header.style.backgroundColor="")}function l(m){if(!p.header)return;p.header.innerHTML="",S.ENABLE_BACKDROP&&m.backdrop?(p.header.style.backgroundImage=`url(${m.backdrop})`,p.header.style.backgroundSize="cover",p.header.style.backgroundPosition="center"):ue();let g=document.createElement("div");g.className="btfw-movie-overlay",p.header.appendChild(g);let x=document.createElement("div");if(x.className="btfw-movie-content",p.header.appendChild(x),m.poster){let u=document.createElement("img");u.src=m.poster,u.alt=`${m.title} Poster`,u.className="btfw-movie-poster",x.appendChild(u)}let F=document.createElement("div");F.className="btfw-movie-details",x.appendChild(F);let ne=document.createElement("h2");if(ne.textContent=m.title,ne.className="btfw-movie-title",F.appendChild(ne),S.SHOW_SUMMARY&&m.summary){let u=document.createElement("p");u.textContent=m.summary,u.className="btfw-movie-summary",F.appendChild(u)}if(S.ENABLE_RATING&&m.rating>0){let u=P(m.rating,m.voteCount);x.appendChild(u)}}function P(m,g){let x=document.createElement("div");x.className="btfw-movie-rating";let F=Math.round(m*10),ne=M(F),u="http://www.w3.org/2000/svg",T=document.createElementNS(u,"svg");T.setAttribute("width","60"),T.setAttribute("height","60"),T.setAttribute("viewBox","0 0 60 60");let v=25,G=2*Math.PI*v,ke=G-m/10*G,s=document.createElementNS(u,"circle");s.setAttribute("cx","30"),s.setAttribute("cy","30"),s.setAttribute("r",v.toString()),s.setAttribute("stroke","#2a2a2a"),s.setAttribute("stroke-width","4"),s.setAttribute("fill","#1a1a1a"),T.appendChild(s);let d=document.createElementNS(u,"circle");d.setAttribute("cx","30"),d.setAttribute("cy","30"),d.setAttribute("r",v.toString()),d.setAttribute("stroke",ne),d.setAttribute("stroke-width","3"),d.setAttribute("fill","none"),d.setAttribute("stroke-dasharray",G.toString()),d.setAttribute("stroke-dashoffset",ke.toString()),d.setAttribute("transform","rotate(-90 30 30)"),d.setAttribute("stroke-linecap","round"),T.appendChild(d);let k=document.createElementNS(u,"text");if(k.setAttribute("x","50%"),k.setAttribute("y","50%"),k.setAttribute("text-anchor","middle"),k.setAttribute("dominant-baseline","central"),k.setAttribute("fill","#fff"),k.setAttribute("font-size","10"),k.setAttribute("font-weight","bold"),k.textContent=`${F}%`,T.appendChild(k),x.appendChild(T),g>0){let L=document.createElement("div");L.className="btfw-movie-votes",L.textContent=`${g.toLocaleString()} votes`,x.appendChild(L)}return x}function M(m){let g=Math.max(0,Math.min(m,100));return g>=70?"#4caf50":g>=50?"#ff9800":"#f44336"}function H(m,g){let x=null;return function(...ne){x&&clearTimeout(x),x=setTimeout(()=>{x=null,m(...ne)},g)}}function fe(){if(document.getElementById(ye))return;let m=`
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
      ${S.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,g=document.createElement("style");g.id=ye,g.textContent=m,document.head.appendChild(g)}function ie(){V(),R(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ie,{once:!0}):ie(),{name:"feature:movie-info",refresh:I,cleanup:U}});BTFW.define("feature:monkeyPaw",[],async()=>{let B="btfw-monkey-paw-styles",W="btfw-monkey-paw-overlay",be="/src/assets/monkey-paw/paw.svg",S={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},ye={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},p={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},o=null,a=null;function b(O){return new Promise(I=>setTimeout(I,O))}function c(){try{let O=typeof window!="undefined"?window.BTFW:null;return O&&(O.BASE||O.DEV_CDN)||""}catch(O){return""}}function C(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(O){return!1}}function U(){if(typeof document=="undefined"||document.getElementById(B))return;let O=document.createElement("style");O.id=B,O.textContent=`
      #${W} {
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

      #${W}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${W}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${W}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${W} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${W} .btfw-monkey-paw-title {
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

      #${W} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${W} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${W} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${W} .f-tip {
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

      #${W} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${W} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${W} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${W} .f-root,
        #${W} .f-tip,
        #${W} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(O)}async function X(){if(o)return o;let I=`${c()}${be}`,Q=await fetch(I,{credentials:"omit"});if(!Q.ok)throw new Error(`Monkey paw SVG failed to load (${Q.status})`);return o=await Q.text(),o}function D(O){Object.entries(p).forEach(([I,Q])=>{let ee=O.querySelector(`#${I}`),J=O.querySelector(`#${I}-tip`);ee&&(ee.style.transform=Q.root),J&&(J.style.transform=Q.tip)})}function V(O){Object.entries(S).forEach(([I,Q])=>{window.setTimeout(()=>{let ee=O.querySelector(`#${I}`),J=O.querySelector(`#${I}-tip`);ee&&(ee.style.transform=Q.root),J&&window.setTimeout(()=>{J.style.transform=Q.tip},120)},ye[I])})}function R(O){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${O}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function Y(O={}){if(a)return a;if(typeof document!="undefined")return a=(async()=>{var we,oe;if(U(),C()){await b((we=O.reducedMotionMs)!=null?we:450);return}let I=document.getElementById(W);I||(I=document.createElement("div"),I.id=W,document.body.appendChild(I));let Q;try{Q=await X()}catch(xe){console.warn("[monkey-paw] SVG load failed:",xe),await b(300);return}I.innerHTML=R(Q),D(I);let ee=I.querySelector("#paw"),J=I.querySelector("#btfw-monkey-paw-msg");I.classList.remove("is-cursed"),J==null||J.classList.remove("is-visible"),requestAnimationFrame(()=>I.classList.add("is-active")),V(I),await b(980),ee==null||ee.classList.add("btfw-monkey-paw-shaking"),await b(720),ee==null||ee.classList.remove("btfw-monkey-paw-shaking"),I.classList.add("is-cursed"),J==null||J.classList.add("is-visible"),await b((oe=O.holdMs)!=null?oe:1100),I.classList.remove("is-active"),await b(320),I.remove()})().finally(()=>{a=null}),a}return{name:"feature:monkeyPaw",play:Y}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:B})=>{let W=await B("util:tmdb-proxy"),be=await B("feature:monkeyPaw"),S=(l,P=document)=>P.querySelector(l),ye=(l,P=document)=>Array.from(P.querySelectorAll(l)),p=null,o=null,a=null,b=null,c={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},C=null,U=null,X="[movie-suggestion]";function D(...l){console.log(X,...l)}function V(...l){console.error(X,...l)}function R(l){var P;try{if((P=window.socket)!=null&&P.emit)return window.socket.emit("chatMsg",{msg:l}),!0}catch(M){}return!1}async function Y(l,P={}){return W.workerFetch(l,P)}function O(){if(document.getElementById("btfw-movie-suggest-styles"))return;let l=document.createElement("style");l.id="btfw-movie-suggest-styles",l.textContent=`
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
    `,document.head.appendChild(l)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function Q(){let l=S("a[href*='donate'], #donate-btn, .donate-btn");if(l){let M=l.closest("ul");if(M)return{ul:M,insertAfter:l.parentElement}}let P=S("#btfw-theme-btn-nav");if(P){let M=P.closest("ul");if(M)return{ul:M,insertAfter:null}}return{ul:S(".navbar .nav.navbar-nav")||S(".navbar-nav")||S(".btfw-navbar ul")||S(".navbar ul"),insertAfter:null}}function ee(){if(S("#btfw-movie-suggest-btn"))return!0;let l=Q();if(!l.ul)return!1;let P=document.createElement("li"),M=document.createElement("a");return M.href="javascript:void(0)",M.className="btfw-nav-pill",M.id="btfw-movie-suggest-btn",M.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,P.appendChild(M),l.insertAfter?l.insertAfter.after(P):l.ul.insertBefore(P,l.ul.firstChild),M.addEventListener("click",j),!0}function J(){var H,fe,ie,m,g,x;if(S("#btfw-movie-suggest-modal"))return;let l=document.createElement("div");l.id="btfw-movie-suggest-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let P=S(".modal-background",l),M=S(".delete",l);if(P.addEventListener("click",le),M.addEventListener("click",le),(H=S("#btfw-movie-prev",l))==null||H.addEventListener("click",()=>{c.page>1&&(c.page-=1,se())}),(fe=S("#btfw-movie-next",l))==null||fe.addEventListener("click",()=>{c.page<c.totalPages&&(c.page+=1,se())}),I===0){let F=S("#btfw-movie-search",l);F.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),F.blur()})}else{let F,ne=S("#btfw-movie-search",l);ne.addEventListener("input",()=>{clearTimeout(F),c.query=ne.value.trim(),c.page=1,F=setTimeout(()=>se(),400)}),(ie=S("#btfw-movie-sort",l))==null||ie.addEventListener("change",u=>{c.sortBy=u.target.value,c.page=1,se()}),(m=S("#btfw-movie-genre",l))==null||m.addEventListener("change",u=>{c.genreId=u.target.value,c.page=1,se()}),(g=S("#btfw-movie-year",l))==null||g.addEventListener("change",u=>{c.year=u.target.value.trim(),c.page=1,se()}),(x=S("#btfw-movie-rating",l))==null||x.addEventListener("change",u=>{c.minRating=u.target.value.trim(),c.page=1,se()})}}function we(){if(S("#btfw-movie-confirm-modal"))return;let l=document.createElement("div");l.id="btfw-movie-confirm-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let P=S(".modal-background",l),M=S(".delete",l),H=S("#btfw-movie-cancel",l),fe=S("#btfw-movie-confirm",l),ie=()=>N();P.addEventListener("click",ie),M.addEventListener("click",ie),H.addEventListener("click",ie),fe.addEventListener("click",de)}async function oe(){if(C&&U)return;let[l,P]=await Promise.all([Y("/api/meta"),Y("/api/genres")]);C=l,U=P;let M=S("#btfw-movie-suggest-modal");if(!M)return;let H=S("#btfw-movie-sort",M);if(H&&H.options.length===0){for(let ie of l.sortOptions||[]){let m=document.createElement("option");m.value=ie.value,m.textContent=ie.label,H.appendChild(m)}H.value=c.sortBy}let fe=S("#btfw-movie-genre",M);if(fe&&fe.options.length<=1)for(let ie of P.genres||[]){let m=document.createElement("option");m.value=String(ie.id),m.textContent=ie.name,fe.appendChild(m)}}function xe(){let l={page:c.page,sort_by:c.sortBy};return c.query?(l.query=c.query,c.year&&(l.primary_release_year=c.year,l.year=c.year)):(c.genreId&&(l.with_genres=c.genreId),c.year&&(l.primary_release_year=c.year),c.minRating&&(l["vote_average.gte"]=c.minRating)),l}function pe(l){return!l||l==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${l}`}function ve(){let l=S("#btfw-movie-suggest-modal");if(!l)return;let P=S("#btfw-movie-prev",l),M=S("#btfw-movie-next",l),H=S("#btfw-movie-page-label",l);H&&(H.textContent=`Page ${c.page} of ${c.totalPages}`),P&&(P.disabled=c.page<=1||c.loading),M&&(M.disabled=c.page>=c.totalPages||c.loading)}function _e(l){let P=S("#btfw-movie-suggest-modal");if(!P)return;let M=S(".btfw-movie-results",P);if(!l.length){M.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}M.innerHTML=l.map(H=>`
      <div class="movie-result"
           data-id="${H.id}"
           data-title="${H.title}"
           data-poster="${H.posterPath||""}"
           data-year="${H.releaseYear||""}">
        <div class="movie-result__poster">
          <img src="${pe(H.posterPath)}" alt="${H.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${H.title}</div>
          <small style="opacity:0.7;">${H.releaseYear||"N/A"}</small>
        </div>
      </div>
    `).join(""),ye(".movie-result",M).forEach(H=>{H.addEventListener("click",()=>{p=H.dataset.id,o=H.dataset.title,a=H.dataset.poster,b=H.dataset.year||null;let fe=S("#btfw-movie-confirm-modal");if(!fe)return;let ie=b?` (${b})`:"";S("#btfw-confirm-movie-title",fe).textContent=`${o}${ie}`,A()})})}async function se(){let l=S("#btfw-movie-suggest-modal");if(!l||c.loading)return;c.loading=!0,ve();let P=S(".btfw-movie-results",l);P.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await oe();let M=await Y("/api/search",{params:xe()});c.totalPages=Math.max(1,M.totalPages||1),_e(M.results||[]),D("runSearch",{page:c.page,totalPages:c.totalPages,count:(M.results||[]).length})}catch(M){V("runSearch failed:",M),P.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{c.loading=!1,ve()}}async function w(){let l=S("#btfw-movie-history");if(l){l.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let M=(await Y("/api/history",{params:{page:1,limit:10}})).results||[];if(!M.length){l.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}l.innerHTML=M.map(H=>{let fe=H.releaseYear?` (${H.releaseYear})`:"";return`
          <div class="history-item">
            <img src="${pe(H.posterPath).replace("w154","w92")}" alt="${H.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${H.movieTitle}${fe}</div>
              <div class="history-item__meta">Requested by ${H.username}</div>
            </div>
          </div>
        `}).join("")}catch(P){V("loadHistory failed:",P),l.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function A(){let l=S("#btfw-movie-suggest-modal"),P=S("#btfw-movie-confirm-modal");P&&(l&&l.classList.add("btfw-movie-suggest-pending"),P.classList.add("is-active"))}function N(){let l=S("#btfw-movie-suggest-modal"),P=S("#btfw-movie-confirm-modal");l&&l.classList.remove("btfw-movie-suggest-pending"),P&&P.classList.remove("is-active")}async function j(){let l=S("#btfw-movie-suggest-modal");if(l){D("openModal",{userRank:I}),l.classList.remove("btfw-movie-suggest-pending"),l.classList.add("is-active");try{await oe(),await Promise.all([se(),w()])}catch(P){V("openModal bootstrap failed:",P)}}}function le(){let l=S("#btfw-movie-suggest-modal");l&&(N(),D("closeModal"),l.classList.remove("is-active"),S("#btfw-movie-search",l).value="",S(".btfw-movie-results",l).innerHTML="",c.query="",c.page=1,c.totalPages=1,p=null,o=null,a=null,b=null)}function ce(l,P,M){let H=M?` (${M})`:"";return`\u{1F3AC} Movie request: ${P}${H} \u2014 suggested by ${l}`}async function de(){if(!p||!o)return;let l=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";D("confirmSuggestion",{movieId:p,movieTitle:o}),N();try{await be.play(),await Y("/api/suggestions",{method:"POST",body:{movieId:Number(p),movieTitle:o,username:l,posterPath:a||null,releaseYear:b||null}}),R(ce(l,o,b)),await w(),le()}catch(P){V("confirmSuggestion failed:",P),alert("Could not save your movie request. Please try again.")}}function ue(){D("boot: start",{workerBase:W.getWorkerBase()}),O(),J(),we();let l=0,P=50,M=()=>{if(ee()){D("Button added successfully");return}l+=1,l<P?setTimeout(M,100):console.warn(X,"Failed to add button after retries",{retryCount:l})};M()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ue,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ue,200)}):setTimeout(ue,200),{name:"ext:movie-suggestion",open:j,close:le,getWorkerBase:W.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async B=>B.init("ext:movie-suggestion"));})();
