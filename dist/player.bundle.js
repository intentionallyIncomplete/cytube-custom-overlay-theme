/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async({})=>{let U="#videowrap .video-js",P="vjs-default-skin",C="vjs-theme-city",p="vjs-big-play-centered",W=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),f={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},s="btfw-videojs-base-css",b="btfw-videojs-city-css",k=["https://vjs.zencdn.net/7.20.3/video-js.css"],m=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function T(w,M){let N=document;if(!N||!N.head||N.getElementById(w))return;let H=N.createElement("link");H.id=w,H.rel="stylesheet";let ie=Array.isArray(M)?M.slice():[M],ee=()=>{if(!ie.length)return!1;let le=ie.shift();return le?(H.href=le,!0):ee()};H.addEventListener("error",()=>{ee()||H.remove()}),ee()&&N.head.appendChild(H)}function K(){if(typeof window=="undefined"||!document.body)return!1;let w=document.createElement("div");w.className=`video-js ${P}`,w.style.position="absolute",w.style.opacity="0",w.style.pointerEvents="none",w.style.width="1px",w.style.height="1px",document.body.appendChild(w);let M=window.getComputedStyle(w).fontSize;return w.remove(),M&&Math.abs(parseFloat(M)-10)<.2}function $(){K()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||T(s,k)}function te(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||T(b,m)}function fe(w){if(!w)return null;try{return w.player||w.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(w.id)||window.videojs&&window.videojs.players&&window.videojs.players[w.id]}catch(M){return null}}function ge(w){let M=fe(w);if(!M)return;let N=typeof M.getChild=="function"?M.getChild("controlBar"):null,H=N&&typeof N.getChild=="function"?N.getChild("volumePanel"):null;if(H){w.classList.add("btfw-volume-inline");try{typeof H.inline=="function"&&H.inline(!0)}catch(ie){}}}function X(){$(),te(),document.querySelectorAll(U).forEach(w=>{w.classList.contains(P)&&w.classList.remove(P),Array.from(w.classList).forEach(M=>{M.startsWith("vjs-theme-")&&M!==C&&w.classList.remove(M)}),w.classList.contains(C)||w.classList.add(C),w.classList.contains(p)||w.classList.add(p),ge(w)})}function R(){var M;if(typeof window=="undefined")return;let w=(M=window.BTFW)==null?void 0:M.channelPosterUrl;w&&document.querySelectorAll(U).forEach(N=>{N.poster!==w&&(N.poster=w);try{let H=N.player||N.player_||window.videojs&&window.videojs.players&&window.videojs.players[N.id];H&&typeof H.poster=="function"&&H.poster(w)}catch(H){let ie=N.querySelector(".vjs-poster");ie&&(ie.style.backgroundImage=`url("${w}")`)}})}function I(){var N;if(typeof window=="undefined")return;let w=(N=window.PLAYER)==null?void 0:N.mediaType;document.querySelectorAll(".vjs-poster").forEach(H=>{w==="yt"||w==="dm"||w==="vi"||w==="tw"?H.classList.add("hidden"):H.classList.remove("hidden")})}function V(){document.querySelectorAll(W).forEach(M=>{M instanceof HTMLVideoElement&&(typeof M.playsInline=="boolean"&&(M.playsInline=!0),Object.entries(f).forEach(([N,H])=>{try{M.setAttribute(N,H)}catch(ie){}}))})}function Q(){if(typeof window=="undefined")return!1;let w=window.videojs;if(!w)return!1;let M=w.dom||w;if(!M||typeof M.textContent!="function")return!1;if(M.textContent&&M.textContent._btfwOptimized)return!0;let N=M.textContent.bind(M),H=function(ee,le){if(!ee)return ee;let pe;try{typeof ee.textContent!="undefined"?pe=ee.textContent:typeof ee.innerText!="undefined"&&(pe=ee.innerText)}catch(l){pe=void 0}if(pe!==void 0){let l=le==null?"":String(le);if(pe===l)return ee}return N(ee,le)};return H._btfwOptimized=!0,H._btfwOriginal=N,M.textContent=H,!0}function J(){if(Q()){J._tries=0;return}J._tries>20||(J._tries=(J._tries||0)+1,setTimeout(J,250))}let he="_btfwGuarded";function ne(w){if(!w)return!1;let M=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!w.closest(M)}function Ee(w){if(!w||w[he])return;w[he]=!0;let M=N=>{ne(N.target)||N.type==="click"&&N.button!==0||(N.preventDefault(),N.stopImmediatePropagation())};w.addEventListener("click",M,!0),w.addEventListener("pointerdown",N=>{ne(N.target)||(N.preventDefault(),N.stopImmediatePropagation())},!0),w.addEventListener("contextmenu",M,!0)}function de(){document.querySelectorAll(U).forEach(Ee)}function ve(){if(ve._mo)return;let w=document.getElementById("videowrap")||document.body,M=new MutationObserver(N=>{var ie,ee,le;let H=!1;for(let pe of N){for(let l of pe.addedNodes)if(l.nodeType===1&&((ie=l.classList)!=null&&ie.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME"||(ee=l.querySelector)!=null&&ee.call(l,U))){H=!0;break}for(let l of pe.removedNodes)if(l.nodeType===1&&((le=l.classList)!=null&&le.contains("video-js")||l.tagName==="VIDEO"||l.tagName==="IFRAME")){H=!0;break}}H&&(X(),de(),V(),R(),I(),document.querySelectorAll(U).forEach(ge))});M.observe(w,{childList:!0,subtree:!0,characterData:!1}),ve._mo=M}function xe(){setTimeout(()=>{V(),R(),I(),document.querySelectorAll(U).forEach(ge)},100)}function oe(){if(X(),de(),V(),J(),R(),I(),ve(),setInterval(()=>{I()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",xe),socket.on("changeMedia",xe)}catch(w){console.warn("[feature:player] Unable to bind changeMedia handler",w)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",oe):oe(),document.addEventListener("btfw:layoutReady",()=>setTimeout(oe,0)),{name:"feature:player",applyCityTheme:X,attachGuards:de,ensureInlinePlayback:V,applyPosterUrl:R,togglePosterVisibility:I,shouldAllowClick:ne}});BTFW.define("feature:stack",["feature:layout"],async({})=>{let U="btfw-stack-order",P="btfw-stack-motd-open",C="btfw-stack-playlist-open",p="btfw-stack-poll-open",W={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},f=W,s={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},b={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},k={"motd-group":1,"poll-group":2,"playlist-group":3},m=!1,T=null,K="",$=null,te=null,fe=null,ge={"motd-group":{storageKey:P,getDefaultOpen:e=>w(e,xe()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:C,getDefaultOpen:e=>w(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:p,getDefaultOpen:e=>w(e,de()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},X=null,R=!1,I=!1,V=null,Q=!1,J=!1,he=!1,ne=null,Ee=!1;function de(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function ve(e=""){let t=String(e||"").trim();if(!t)return!0;if(typeof document!="undefined"){let n=document.createElement("div");return n.innerHTML=t,!(n.textContent||"").replace(/\u00a0/g," ").trim()}return!t.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim()}function xe(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=oe(e);return t?!ve(t.innerHTML||""):!1}function oe(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}function w(e,t){return e!=null?!!e:!!t}let M=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],N=["#main","#mainpage","#mainpane"],H=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function ie(e,t,n){if(!e||!t||!n)return null;let a=H.map(z=>{let Y=document.getElementById(z.id);return Y?{...z,el:Y}:null}).filter(Boolean);if(!a.length){let z=document.getElementById("btfw-addmedia-panel");return z&&z.remove(),null}let o=document.getElementById("btfw-addmedia-panel");if(o||(o=document.createElement("section"),o.id="btfw-addmedia-panel",o.className="btfw-addmedia-panel",o.dataset.open="false",o.setAttribute("role","region"),o.setAttribute("aria-label","Add media controls"),o.setAttribute("aria-hidden","true"),o.setAttribute("hidden","hidden"),o.innerHTML=`
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
      `),o.parentElement!==e){let z=t.parentElement===e?t.nextSibling:null;e.insertBefore(o,z)}let h=o.querySelector(".btfw-addmedia-tabs"),x=o.querySelector(".btfw-addmedia-views"),y=o.querySelector(".btfw-addmedia-close");if(!h||!x)return null;for(;h.firstChild;)h.removeChild(h.firstChild);for(;x.firstChild;)x.removeChild(x.firstChild);a.forEach(({id:z,title:Y,el:O})=>{O.classList.remove("collapse","in","plcontrol-collapse"),O.style.removeProperty("display"),O.style.removeProperty("height"),O.removeAttribute("aria-expanded"),O.setAttribute("role","tabpanel"),O.setAttribute("data-btfw-addmedia","panel");let me=document.createElement("button");me.type="button",me.className="btfw-addmedia-tab",me.dataset.target=z,me.textContent=Y,me.setAttribute("role","tab"),h.appendChild(me);let ce=document.createElement("div");ce.className="btfw-addmedia-view",ce.dataset.target=z,ce.setAttribute("role","tabpanel"),ce.setAttribute("aria-hidden","true"),ce.appendChild(O),x.appendChild(ce)});let S=a.find(z=>z.default)||a[0],v=z=>{let Y=z||o.dataset.active||S.id;o.dataset.active=Y,h.querySelectorAll(".btfw-addmedia-tab").forEach(O=>{let me=O.dataset.target===Y;O.classList.toggle("is-active",me),O.setAttribute("aria-selected",me?"true":"false"),O.setAttribute("tabindex",me?"0":"-1")}),x.querySelectorAll(".btfw-addmedia-view").forEach(O=>{let me=O.dataset.target===Y;O.classList.toggle("is-active",me),O.setAttribute("aria-hidden",me?"false":"true")})},D=z=>{let Y=z!=null?!!z:o.dataset.open!=="true";return o.dataset.open=Y?"true":"false",o.classList.toggle("is-open",Y),o.setAttribute("aria-hidden",Y?"false":"true"),Y?(o.removeAttribute("hidden"),v(o.dataset.active||S.id)):o.setAttribute("hidden","hidden"),o.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:Y}})),Y};return o._btfwWired||(h.addEventListener("click",z=>{let Y=z.target.closest(".btfw-addmedia-tab");Y&&(z.preventDefault(),v(Y.dataset.target))}),y&&y.addEventListener("click",()=>D(!1)),o._btfwWired=!0),v(o.dataset.active||S.id),o._btfwToggle=D,o._btfwSetActive=v,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:Y,target:O})=>{let me=document.getElementById(Y);me&&me.dataset.btfwAddmedia!==O&&(me.dataset.btfwAddmedia=O,me.setAttribute("aria-controls","btfw-addmedia-panel"),me.addEventListener("click",ce=>{ce.preventDefault(),ce.stopPropagation(),v(O),D(!0),me.blur()}))})})(),{panel:o,toggle:D,setActive:v}}function ee(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),a=document.getElementById("btfw-video-overlay"),o=a&&n&&a.parentElement===n.parentElement?a:n;o&&o.parentElement?o.nextSibling?o.parentNode.insertBefore(t,o.nextSibling):o.parentNode.appendChild(t):e.appendChild(t);let h=document.createElement("div");h.className="btfw-stack-list",t.appendChild(h);let x=document.createElement("div");x.id="btfw-stack-footer",x.className="btfw-stack-footer",t.appendChild(x)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function le(){let e=document.getElementById("motdwrap");if(!e)return null;let t=document.getElementById("togglemotd");t&&t.closest("#motd")&&e.insertBefore(t,e.firstChild);let n=[];e.querySelectorAll(".btfw-motd-editrow").forEach(o=>{let h=(o.textContent||"").trim();h&&n.push(`<p>${h}</p>`),o.remove()}),e.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(o=>{o.contains(e)||o===e||((o.querySelector("#motd")||o.classList.contains("btfw-motd-editrow"))&&o.querySelectorAll("#motd").forEach(h=>{(h.innerHTML||"").trim()&&n.push(h.innerHTML)}),o.remove())});let a=e.querySelector(":scope > #motd");if(a||(a=document.createElement("div"),a.id="motd",e.appendChild(a)),e.querySelectorAll("#motd").forEach(o=>{o!==a&&((o.innerHTML||"").trim()&&n.push(o.innerHTML),o.remove())}),a.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(o=>{o.remove()}),a.querySelectorAll("#motd").forEach(o=>{(o.innerHTML||"").trim()&&n.push(o.innerHTML),o.remove()}),document.querySelectorAll("#togglemotd").forEach((o,h)=>{h!==0&&o.remove()}),n.length){let o=n.join("").trim();o&&ve(a.innerHTML)?a.innerHTML=o:o&&(a.innerHTML+=o)}return{motdwrap:e,motd:a}}function pe(){let e=document.getElementById("controlsrow"),t=document.getElementById("rightcontrols"),n=document.getElementById("btfw-plbar"),a=document.getElementById("playlistwrap"),o=document.getElementById("queuecontainer"),h=document.getElementById("playlistrow"),x=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),y=document.querySelectorAll(".btfw-controls-row"),S=h||a||o||x;if(!S)return;let v=n;v?v.classList.add("btfw-plbar"):(v=document.createElement("div"),v.id="btfw-plbar",v.className="btfw-plbar");let D=v.querySelector(".btfw-plbar__layout"),se,z;if(D)se=D.querySelector(".btfw-plbar__primary")||D,z=D.querySelector(".btfw-plbar__aside")||D;else{for(D=document.createElement("div"),D.className="btfw-plbar__layout",se=document.createElement("div"),se.className="btfw-plbar__primary",z=document.createElement("div"),z.className="btfw-plbar__aside",D.append(se,z);v.firstChild;)se.appendChild(v.firstChild);v.appendChild(D);let Z=se.querySelector(".field.has-addons");Z&&Z.classList.add("btfw-plbar__search");let we=se.querySelector("#btfw-pl-count");we&&(we.classList.add("btfw-plbar__count"),z.appendChild(we))}v.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(Z=>Z.remove());let Y=v.querySelector(".btfw-plbar__actions");Y||(Y=document.createElement("div"),Y.className="btfw-plbar__actions",(z||v).appendChild(Y));let O=document.getElementById("btfw-addmedia-btn"),me=Z=>{if(Z){if(Z.classList.add("btfw-plbar__action-btn"),Z.tagName==="BUTTON"||Z.tagName==="A")Z.classList.add("button","is-dark","is-small");else if(Z.tagName==="INPUT"){let we=(Z.type||"").toLowerCase();we==="button"||we==="submit"||we==="reset"?Z.classList.add("button","is-dark","is-small"):Z.classList.remove("button","is-dark","is-small")}}};v.parentElement!==S&&S.insertBefore(v,S.firstChild);let ce=ie(S,v,Y);ce?!O||!document.body.contains(O)?(O=document.createElement("button"),O.id="btfw-addmedia-btn",O.type="button",O.className="button is-small",O.innerHTML='<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>',Y.prepend(O)):Y.contains(O)||Y.prepend(O):O&&(O.parentElement&&O.parentElement.removeChild(O),O=null);let Ae=Z=>{if(!Z)return;Array.from(Z.children||[]).forEach(_e=>{_e&&(_e.classList.add("btfw-plbar__control"),Y.appendChild(_e))})};if(t&&(Ae(t),t.remove()),e&&(Ae(e),e.remove()),Y.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(me),ce&&O){O.classList.remove("is-dark"),O.classList.add("is-primary"),O.dataset.iconified||(O.innerHTML='<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>',O.dataset.iconified="1"),O.setAttribute("aria-controls","btfw-addmedia-panel");let Z=_e=>{O.setAttribute("aria-expanded",_e?"true":"false")};O.dataset.btfwBound||(O.dataset.btfwBound="1",O.addEventListener("click",_e=>{_e.preventDefault();let Je=document.getElementById("btfw-addmedia-panel"),Ze=Je&&Je._btfwToggle,pt=typeof Ze=="function"?Ze():!1;Z(pt)}));let we=ce.panel||document.getElementById("btfw-addmedia-panel");we&&(Z(we.dataset.open==="true"),we._btfwButtonSync||(we.addEventListener("btfw:addmedia:state",_e=>{Z(!!(_e.detail&&_e.detail.open))}),we._btfwButtonSync=!0))}y.forEach(Z=>{Z&&!S.contains(Z)&&(Z.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,Z.remove(),S.appendChild(Z),console.log("[stack] Moved floating controls row into playlist container"))}),S.contains(v)||S.insertBefore(v,S.firstChild)}function l(e,t){if(e.id==="motd-group"&&(le(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Me(),pe(),t=t.filter(y=>y&&y.id!=="rightcontrols"&&y.id!=="pollwrap").filter(y=>!y.querySelector||!y.querySelector("#pollwrap"))),e.id==="poll-group"&&(Me(),$e(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(y=>y&&!n.contains(y)&&!y.contains(n)));let a=document.createElement("section");a.className="btfw-stack-item btfw-group-item",a.dataset.bind=e.id,a.dataset.group="true";let o=document.createElement("header");o.className="btfw-stack-item__header",o.innerHTML=`
      <span class="btfw-stack-item__title">${e.title}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">\u2191</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">\u2193</button>
        </span>
      </div>
    `;let h=document.createElement("div");h.className="btfw-stack-item__body btfw-group-body",t.forEach(y=>{if(y&&y.parentElement!==h&&!h.contains(y)&&!y.contains(h))try{h.appendChild(y)}catch(S){console.warn("[stack] Failed to move element:",y.id||y.className,S)}}),a.appendChild(o),a.appendChild(h);let x=ge[e.id];return x&&rt(a,x),We(a,e.id),a.querySelector(".btfw-up").onclick=function(){let y=a.parentElement,S=a.previousElementSibling;S&&y.insertBefore(a,S),A(y)},a.querySelector(".btfw-down").onclick=function(){let y=a.parentElement,S=a.nextElementSibling;S?y.insertBefore(S,a):y.appendChild(a),A(y)},a}function A(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(U,JSON.stringify(t))}catch(t){}}function B(){try{return JSON.parse(localStorage.getItem(U)||"[]")}catch(e){return[]}}function q(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function d(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function g(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),a=localStorage.getItem(n);return a!==null?a==="true":!1}catch(t){return!1}}function i(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function u(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function E(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function F(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&de()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function ae(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),De())}function j(e){ae(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function ye(e,t,n){if(!e||E(e))return;let a=q(t),o=typeof n=="function"?n(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}function be(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(x=>x.dataset.docked!=="true"),n=e.length>0&&t.length===0,a=document.getElementById("btfw-stack"),o=document.getElementById("btfw-leftpad"),h=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",n),a.classList.toggle("btfw-stack--all-docked",n)),o&&o.classList.toggle("btfw-leftpad--stack-hidden",n),h&&h.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function Se(){var a;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let o=document.createElement("div");o.id="btfw-panel-bar",o.className="btfw-panel-bar",o.setAttribute("role","toolbar"),o.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(o)}let n=t.querySelector("#btfw-panel-bar");return re(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),m||(it(),m=!0),(a=document.getElementById("btfw-stack-drawer"))==null||a.remove(),t}function Te(e){e.preventDefault(),e.stopPropagation(),ot()}function r(){let e=Se();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML='<span class="btfw-panels-menu-btn__label">Panels</span>',t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",Te),t.dataset.btfwPanelsWired="1"),t}function c(e){if(!e)return null;let t=Array.from(e.classList).find(a=>a.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let a=n(e).data("uid");if(a!=null&&a!=="")return a}return e.dataset.uid||null}function _(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),a=n==null?void 0:n.querySelector(".qbtn-play");return a?(a.click(),!0):!1}function L(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),a=document.getElementById("queue_next");if(n&&a&&(n.value=t,!a.disabled))return a.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let o=window.socket;if(o&&typeof parseMediaLink=="function")try{let h=parseMediaLink(t);if((h==null?void 0:h.id)!=null&&(h!=null&&h.type))return o.emit("queue",{id:h.id,type:h.type,pos:"next",temp:!1}),!0}catch(h){}return!1}function G(e){ee();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&($&&(clearTimeout($),$=null),T=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),ue(),Re(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function re(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var h,x,y;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let S=n.dataset.panelGroup||((h=n.closest(".btfw-panel-btn"))==null?void 0:h.dataset.group);S&&G(S);return}let a=t.target.closest(".btfw-panel-playlist__play");if(a){t.preventDefault(),t.stopPropagation(),_(a.dataset.queueUid);return}let o=t.target.closest(".btfw-panel-playlist__add");if(o){t.preventDefault(),t.stopPropagation();let S=(x=o.closest(".btfw-panel-container"))==null?void 0:x.querySelector(".btfw-panel-playlist__add-form");if(!S)return;let v=S.hidden;S.hidden=!v,o.setAttribute("aria-expanded",v?"true":"false"),v&&((y=S.querySelector(".btfw-panel-playlist__link-input"))==null||y.focus())}}),e.addEventListener("submit",t=>{var x,y,S,v;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let a=n.querySelector(".btfw-panel-playlist__link-input"),o=(x=a==null?void 0:a.value)==null?void 0:x.trim();if(!o||!L(o))return;a.value="",n.hidden=!0,(S=(y=n.closest(".btfw-panel-container"))==null?void 0:y.querySelector(".btfw-panel-playlist__add"))==null||S.setAttribute("aria-expanded","false");let h=(v=n.closest(".btfw-panel-container"))==null?void 0:v.querySelector(".btfw-panel-playlist__queue");h&&Ce(h)}))}function ue(){if(te){try{te.disconnect()}catch(e){}te=null}fe=null}function Le(e){if(!e||fe===e)return;ue();let t=document.getElementById("queue");t&&(fe=e,te=new MutationObserver(()=>{e.isConnected&&T==="playlist-group"&&Ce(e)}),te.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function ke(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),a=n.findIndex(h=>h.classList.contains("queue_active")||h.classList.contains("playing")),o=a>=0?a+1:0;return n.slice(o,o+e)}function Ce(e){if(!e)return;let t=ke(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var S,v;let a=document.createElement("div");a.className="btfw-panel-playlist__item";let o=document.createElement("span");o.className="btfw-panel-playlist__title",o.textContent=(((S=n.querySelector(".qe_title"))==null?void 0:S.textContent)||"Untitled").trim();let h=document.createElement("span");h.className="btfw-panel-playlist__meta",h.textContent=(((v=n.querySelector(".qe_time"))==null?void 0:v.textContent)||"").trim();let x=document.createElement("div");x.className="btfw-panel-playlist__actions";let y=c(n);if(y!=null&&y!==""){let D=document.createElement("button");D.type="button",D.className="btfw-panel-playlist__play",D.textContent="Play",D.dataset.queueUid=String(y),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(D.disabled=!0),x.appendChild(D)}a.append(o,h,x),e.appendChild(a)})}function ze(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML='<i class="fa fa-thumb-tack" aria-hidden="true"></i>',n}function et(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `,e}function tt(e,t,n){let a=document.createElement("div");if(a.className="btfw-panel-container",n>0&&(a.style.bottom=`${-n*50}px`),e==="playlist-group"){a.classList.add("btfw-panel-container--playlist");let h=document.createElement("div");h.className="btfw-panel-playlist__toolbar";let x=document.createElement("button");x.type="button",x.className="btfw-panel-playlist__add",x.textContent="+Add",x.setAttribute("aria-expanded","false");let y=ze(e,t);h.append(x,y);let S=et(),v=document.createElement("div");return v.className="btfw-panel-container__host btfw-panel-playlist__queue",a.append(h,S,v),a}a.classList.add("btfw-panel-container--dock-only");let o=document.createElement("div");return o.className="btfw-panel-container__dock-only",o.appendChild(ze(e,t)),a.appendChild(o),a}function Ne(){$&&(clearTimeout($),$=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{j(e)}),ue(),T=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function Be(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||Ne()}function nt(){Be(!1)}function ot(){Se();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||Be(!e.classList.contains("open"))}function He(e){$&&clearTimeout($),$=setTimeout(()=>{$=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),T===e&&(T=null,ue()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function Oe(e,t){if(t&&($&&(clearTimeout($),$=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),T=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(Ce(n),Le(n))}}function it(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{T&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),Ne()))}))}function je(e,t){var a;if(!((a=document.getElementById("btfw-panel-bar"))!=null&&a.classList.contains("open")))return;if($&&(clearTimeout($),$=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),T===e&&(T=null,ue()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(o=>{o!==t&&delete o.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",Oe(e,t)}function at(e,t){let n=e.querySelector(".btfw-panel-container"),a=()=>{var o;(o=document.getElementById("btfw-panel-bar"))!=null&&o.classList.contains("open")&&($&&(clearTimeout($),$=null),Oe(t,e))};e.addEventListener("mouseenter",a),e.addEventListener("focusin",a),e.addEventListener("click",o=>{o.target.closest(".btfw-panel-container")||(o.preventDefault(),o.stopPropagation(),je(t,e))}),e.addEventListener("keydown",o=>{o.key!=="Enter"&&o.key!==" "||(o.preventDefault(),je(t,e))}),e.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(o.relatedTarget)||He(t))}),n==null||n.addEventListener("mouseenter",()=>{$&&(clearTimeout($),$=null)}),n==null||n.addEventListener("mouseleave",o=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(o.relatedTarget)||He(t))})}function qe(){let e=Se();r();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((y,S)=>(k[y.dataset.bind]||99)-(k[S.dataset.bind]||99)),a=n.map(y=>y.dataset.bind).join("|"),o=document.getElementById("btfw-panels-menu-btn");if(o&&(o.hidden=n.length===0,n.length===0)){K="",nt();return}if(a===K&&t.childElementCount===n.length)return;K=a;let h=t.classList.contains("open"),x=T;if(Ne(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((y,S)=>{let v=y.dataset.bind,D=s[v]||{short:"?",title:v},se=document.createElement("div");se.className="btfw-panel-btn",se.dataset.group=v,se.title=D.title,se.setAttribute("role","button"),se.setAttribute("aria-label",D.title),se.tabIndex=0;let z=document.createElement("span");z.className="btfw-panel-btn__label",z.textContent=b[v]||D.short,se.appendChild(z),se.appendChild(tt(v,D,S)),t.appendChild(se),at(se,v)}),h&&(Be(!0),x&&n.some(S=>S.dataset.bind===x))){let S=t.querySelector(`.btfw-panel-btn[data-group="${x}"]`);S&&Oe(x,S)}}function Re(e,t,n={}){if(!e)return;let a=!!t,o=n.persist===!1,h=e.dataset.bind,x=W[h];e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let y=e.querySelector(".btfw-stack-dock-btn");y&&(y.setAttribute("aria-pressed",a?"true":"false"),y.title=a?"Pinned to panels menu":"Dock to panels menu"),a?E(e)?j(e):T===h&&(T=null):(j(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!o&&x&&i(x,a),qe(),be()}function We(e,t){var S;let n=W[t];if(!n)return;let a=e.querySelector(".btfw-stack-item__header"),o=a==null?void 0:a.querySelector(".btfw-stack-header-toolbar"),h=o==null?void 0:o.querySelector(".btfw-stack-arrows");if(!h||h.querySelector(".btfw-stack-dock-btn"))return;let x=g(n);e.dataset.docked=x?"true":"false",e.classList.toggle("btfw-stack-item--docked",x);let y=document.createElement("button");y.type="button",y.className="btfw-arrow btfw-stack-dock-btn",y.textContent="\u2AF7",y.setAttribute("aria-label",`Dock ${((S=s[t])==null?void 0:S.title)||t} to panels menu`),y.setAttribute("aria-pressed",x?"true":"false"),y.title=x?"Pinned to panels menu":"Dock to panels menu",y.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),e.dataset.docked!=="true"&&Re(e,!0)}),h.insertBefore(y,h.firstChild)}function bt(){return q(C)}function ht(e){d(C,e)}function yt(){return q(p)}function wt(e){d(p,e)}function rt(e,t={}){let{storageKey:n,getDefaultOpen:a,toggleClass:o,ariaLabel:h="Toggle panel visibility",openTitle:x="Hide panel",closeTitle:y="Show panel"}=t,S=q(n),v=typeof a=="function"?a(S):S!==null?S:!0;e.hasAttribute("data-open")||(e.dataset.open=v?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let D=e.querySelector(".btfw-stack-item__header"),se=D&&D.querySelector(".btfw-stack-arrows");if(!se||se.querySelector(`.${o}`))return;let z=document.createElement("button");z.type="button",z.className=`btfw-arrow ${o}`,z.setAttribute("aria-label",h),z.style.display="flex",z.style.alignItems="center",z.style.justifyContent="center";let Y=()=>{let ce=e.dataset.open!=="false";z.textContent=ce?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",z.title=ce?x:y,z.setAttribute("aria-expanded",ce?"true":"false"),e.classList.toggle("is-open",ce)},O=(ce,Ae={})=>{let Z=!!ce,we=Ae.persist===!1;we&&(e._btfwSuppressPersist=!0),e.dataset.open=Z?"true":"false",Y(),we||d(n,Z),we&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};z.addEventListener("click",ce=>{ce.preventDefault(),ce.stopPropagation(),O(e.dataset.open==="false")}),Y(),new MutationObserver(ce=>{for(let Ae of ce)Ae.type==="attributes"&&(Y(),e._btfwSuppressPersist||d(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),se.insertBefore(z,se.firstChild),e._btfwSetOpenState=O,We(e,e.dataset.bind)}function Me(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function Ue(e){le();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(a){let o=a.querySelector(".btfw-group-body");o&&!o.contains(t)&&o.appendChild(t)}else{let o=M.find(h=>h.id==="motd-group");if(!o)return;a=l(o,[t]),a&&(n.appendChild(a),A(n))}st(a)}function st(e){let t=document.getElementById("motdwrap");if(!t)return;let n=xe();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let a=oe();a&&a.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let a=q(P),o=w(a,!0);e._btfwSetOpenState?e._btfwSetOpenState(o,{persist:!1}):(e.dataset.open=o?"true":"false",e.classList.toggle("is-open",o))}}function Fe(e){V&&clearTimeout(V),V=setTimeout(()=>{V=null,Ue(e)},50)}function lt(e){let t=oe();t&&(Q||(Q=!0,new MutationObserver(()=>{Fe(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function ct(e){J||!window.socket||!window.socket.on||(J=!0,window.socket.on("setMotd",()=>{Fe(e)}))}function Ye(e){let t=ee(),n=le(),a=(n==null?void 0:n.motd)||oe();a&&typeof e=="string"&&(a.innerHTML=e);let o=document.getElementById("cs-motdtext");o&&typeof e=="string"&&(o.value=e),t&&Fe(t)}function Ve(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,a=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||a==="video")return;Me(),$e();let o=e&&e.list;if(!o)return;let h=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!h){let S=M.find(v=>v.id==="poll-group");if(!S)return;h=l(S,[t]),h&&(o.appendChild(h),A(o));return}let x=h.querySelector(".btfw-group-body");x&&!x.contains(t)&&x.appendChild(t);let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&y.contains(t)&&x&&x.appendChild(t)}function Ge(e,t={}){Ve(e),De();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Pe(e,t={}){X&&clearTimeout(X),X=setTimeout(()=>{X=null,Ge(e,t)},50)}function dt(e){if(R)return;let t=document.getElementById("pollwrap");if(!t)return;R=!0,new MutationObserver(()=>{Pe(e,{forceOpen:de()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let a=document.getElementById("newpollbtn");a&&!a.dataset.btfwPollSync&&(a.dataset.btfwPollSync="1",a.addEventListener("click",()=>{Pe(e,{forceOpen:!0})}))}function ut(e){I||!window.socket||!window.socket.on||(I=!0,window.socket.on("newPoll",()=>Pe(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Pe(e)))}function ft(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||document.querySelector("footer");n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function Ke(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let a=n.querySelector(".btfw-stack-header-actions");if(!a){a=document.createElement("span"),a.className="btfw-stack-header-actions";let o=n.querySelector(".btfw-stack-header-toolbar"),h=(o==null?void 0:o.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");o&&h?o.insertBefore(a,h):h?n.insertBefore(a,h):n.appendChild(a)}return a}function Xe(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function De(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!de();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function mt(){let e=Ke("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){Xe(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let o=document.querySelector("#pollwrap > .poll-controls");o&&o.children.length===0&&o.remove()}let n=Ke("motd-group"),a=document.getElementById("btfw-motd-editbtn");if(n&&a){Xe(a,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),a.parentElement!==n&&n.appendChild(a);let o=a.closest(".btfw-motd-editrow");o&&o.parentElement&&o.remove()}}function $e(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(a=>{let o=t.querySelector(".poll-controls");o||(o=document.createElement("div"),o.className="poll-controls",t.insertBefore(o,t.firstChild)),a.parentElement!==o&&o.appendChild(a)}),e.children.length===0&&e.remove())}function Ie(e){if(!he){he=!0;try{let t=e.list,n=e.footer;$e(),Me();let a=new Map;M.forEach(x=>{let y=[];x.selectors.forEach(S=>{let v=document.querySelector(S);if(v&&!(t.contains(v)||v.contains(t))&&!N.includes(S)){if(S==="#pollwrap"){let D=v.dataset&&v.dataset.btfwPollOverlay,se=v.getAttribute&&v.getAttribute("data-btfw-poll-overlay");if(D==="video"||se==="video")return}y.push(v)}}),y.length>0&&a.set(x.id,{group:x,elements:y})});let o=B(),h=[];a.forEach(({group:x,elements:y},S)=>{if(!Array.from(t.children).find(D=>D.dataset.bind===S))try{let D=l(x,y);D&&h.push({item:D,id:S,priority:x.priority,isGroup:!0})}catch(D){console.warn("[stack] Failed to create group item:",S,D)}}),o.length>0?h.sort((x,y)=>{let S=o.findIndex(D=>D.id===x.id),v=o.findIndex(D=>D.id===y.id);return S>=0&&v>=0?S-v:S>=0?-1:v>=0?1:x.priority-y.priority}):h.sort((x,y)=>x.priority-y.priority),h.forEach(({item:x})=>{try{x&&!t.contains(x)&&!x.contains(t)&&t.appendChild(x)}catch(y){console.warn("[stack] Failed to add item to list:",y)}}),A(t),Ue(e),Ve(e),De(),mt(),ft(n)}finally{he=!1}}}function Qe(){let e=ee();if(!e||(Ie(e),lt(e),ct(e),dt(e),ut(e),Ee))return;Ee=!0;let t=new MutationObserver(()=>{ne||(ne=requestAnimationFrame(()=>{ne=null,Ie(e)}))}),n=document.getElementById("btfw-leftpad"),a=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),a&&t.observe(a,{childList:!0,subtree:!1}),setTimeout(()=>{let x=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');x&&ye(x,P,v=>w(v,xe()));let y=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');y&&ye(y,C,v=>v!==null?!!v:!0);let S=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');S&&ye(S,p,v=>w(v,de())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(v=>{let D=W[v.dataset.bind];D&&Re(v,g(D),{persist:!1})}),Se(),r(),qe(),Ge(e),be()},1e3);let o=0,h=setInterval(()=>{Ie(e),++o>8&&clearInterval(h)},700)}return document.addEventListener("btfw:layoutReady",Qe),document.addEventListener("btfw:chat:barsReady",()=>{Se(),r(),qe()}),setTimeout(Qe,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=ee();e&&setTimeout(()=>Ie(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Ye(t)}),{name:"feature:stack",hasMotdContent:xe,resolveMotdHost:oe,normalizeMotdStructure:le,applyMotdUpdate:Ye}});BTFW.define("feature:videoOverlay",[],async()=>{let U=(r,c=document)=>c.querySelector(r),P=["#mediarefresh","#voteskip","#fullscreenbtn"],C={localSubs:"btfw:video:localsubs"},p=5,W={owner:["chanowner","owner","founder","admin","administrator"]};function f(){var r;try{return((r=window.PLAYER)==null?void 0:r.mediaType)||null}catch(c){return null}}function s(){let r=(f()||"").toLowerCase();return r==="fi"||r==="gd"}function b(){try{return window.CLIENT||window.client||null}catch(r){return null}}function k(){try{return window.CHANNEL||window.channel||null}catch(r){return null}}function m(){let r=k();if(r&&typeof r.perms=="object"&&r.perms)return r.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(c){return{}}}function T(r=[]){let c=m();for(let _ of r){let L=c==null?void 0:c[_];if(typeof L=="number")return L}}function K(){let r=T(W.owner);return typeof r=="number"?r:p}function $(r){if(!r)return!1;try{if(typeof r.hasPermission=="function"&&r.hasPermission("chanowner"))return!0}catch(c){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(c){}return!1}function te(){let r=b();if(!r)return!1;let c=Number(r.rank);return Number.isFinite(c)?!!(c>=K()||$(r)):!1}let fe=()=>{try{return localStorage.getItem(C.localSubs)!=="0"}catch(r){return!0}},ge=r=>{try{localStorage.setItem(C.localSubs,r?"1":"0")}catch(c){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!r}}))},X=0,R=0,I=0,V=2e3,Q=8e3,J=45e3,he=12e4,ne=Q,Ee=!1,de=null;function ve(){if(U("#btfw-vo-css"))return;let r=document.createElement("style");r.id="btfw-vo-css",r.textContent=`
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
    `,document.head.appendChild(r)}function xe(r){let c=U("#videowrap");!c||!r||((r.parentElement!==c.parentElement||r.previousElementSibling!==c)&&c.insertAdjacentElement("afterend",r),r.classList.add("btfw-vo-visible"))}function oe(){if(!U("#videowrap"))return null;let c=U("#btfw-video-overlay");c||(c=document.createElement("div"),c.id="btfw-video-overlay"),c.classList.add("btfw-video-overlay"),xe(c);let _=c.querySelector("#btfw-vo-bar");_||(_=document.createElement("div"),_.className="btfw-vo-bar",_.id="btfw-vo-bar",c.appendChild(_));let L=M(c,_);return Se(L.left),l(L),A(L),w(c),c}function w(r){r&&r.querySelectorAll("button").forEach(c=>{c.classList.contains("btfw-vo-btn")||c.classList.add("btfw-vo-btn")})}function M(r,c){let _="btfw-vo-left",L="btfw-vo-right",G=c.querySelector(`#${_}`);G||(G=document.createElement("div"),G.id=_,G.className="btfw-vo-section btfw-vo-section--left",c.insertBefore(G,c.firstChild));let re=c.querySelector(`#${L}`);return re||(re=document.createElement("div"),re.id=L,re.className="btfw-vo-section btfw-vo-section--right",c.appendChild(re)),Array.from(c.children).forEach(ue=>{ue===G||ue===re||re.appendChild(ue)}),r.dataset.leftSection=`#${_}`,r.dataset.rightSection=`#${L}`,c.dataset.leftSection=`#${_}`,c.dataset.rightSection=`#${L}`,{left:G,right:re}}function N(){return document.querySelector("#ytapiplayer video, video")}function H(r=N()){return r?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof r.webkitShowPlaybackTargetPicker=="function":!1}function ie(){if(!de)return;let r=de._btfwAirplayHandler;if(r){try{de.removeEventListener("webkitplaybacktargetavailabilitychanged",r)}catch(c){}delete de._btfwAirplayHandler}de=null}function ee(r){if(!r||typeof r.addEventListener!="function"){ie();return}if(de===r)return;ie();let c=_=>{let L=!_||_.availability==="available",G=U("#btfw-airplay");G&&(G.style.display=L?"":"none")};try{r.addEventListener("webkitplaybacktargetavailabilitychanged",c),r._btfwAirplayHandler=c,de=r}catch(_){}}function le(){let r=U("#btfw-airplay");if(!r)return;let c=N();if(!H(c)){r.style.display="none",ie();return}r.style.display="",ee(c)}function pe(r,c){c&&c.classList.add("btfw-vo-visible")}function l(r){if(!(r!=null&&r.right)||!(r!=null&&r.left))return;let c=[];document.querySelector("#fullscreenbtn")||c.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:d,section:"right"}),c.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:u,section:"right"}),c.forEach(_=>{let L=document.querySelector(`#${_.id}`),G=_.section==="left"?r.left:r.right;L?G&&L.parentElement!==G&&G.appendChild(L):(L=document.createElement("button"),L.id=_.id,L.className="btfw-vo-btn",L.innerHTML=`<i class="${_.icon}"></i>`,L.title=_.tooltip,L.addEventListener("click",_.action),(G||r.right).appendChild(L))}),le()}function A(r){let c=r==null?void 0:r.right;c&&P.forEach(_=>{let L=document.querySelector(_);if(!L)return;if(L.dataset.btfwOverlay==="1"){L.parentElement!==c&&c.appendChild(L);return}let G=document.createElement("span");G.hidden=!0,G.setAttribute("data-btfw-ph",_);try{L.insertAdjacentElement("afterend",G)}catch(re){}if(L.classList.add("btfw-vo-adopted"),L.dataset.btfwOverlay="1",L.id==="mediarefresh"){let re=L.onclick;L.onclick=ue=>{ue.preventDefault();let Le=!!(ue&&ue.isTrusted);q(()=>{if(typeof re=="function")try{return re.call(L,ue),!0}catch(ke){console.warn("[video-overlay] native refresh handler failed:",ke)}return!1},{isUserAction:Le})}}c.appendChild(L)})}function B(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(r){console.warn("[video-overlay] Media refresh failed:",r)}return!1}function q(r,c={}){let{isUserAction:_=!1}=c,L=Date.now();if(I&&L-I>he&&(ne=Q,X=0),L<R){let ke=Math.ceil((R-L)/1e3);return E(_?`Refresh available in ${ke}s`:`Auto refresh paused. Next attempt in ${ke}s`,"warning"),!1}let G=_?V:ne;if(I&&L-I<G){let ke=G-(L-I),Ce=Math.ceil(ke/1e3);return R=L+ke,E(_?`Refresh available in ${Ce}s`:`Auto refresh paused. Next attempt in ${Ce}s`,"warning"),!1}if(X++,X>=10)return R=L+3e4,X=0,E("Refresh limit reached. 30s cooldown active.","error"),!1;let re=_?6e3:Math.max(12e3,ne+2e3);setTimeout(()=>{X>0&&X--},re);let ue=!1;if(typeof r=="function")try{ue=r()===!0}catch(ke){console.warn("[video-overlay] Refresh handler error:",ke)}return ue||(ue=B()),I=Date.now(),_?ne=Q:ne=Math.min(J,Math.max(Q,Math.round(ne*(ue?1.25:1.5)))),R=Math.max(R,I+(_?V:ne)),!_&&ue?E(`Auto refresh sent. Next attempt in ${Math.ceil(ne/1e3)}s`,"info"):E(ue?"Media refreshed":"Unable to refresh media",ue?"success":"error"),ue}function d(){let r=U("#videowrap");r&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen?r.webkitRequestFullscreen():r.mozRequestFullScreen&&r.mozRequestFullScreen())}function g(r,c=!0){if(!r||!H(r))return!1;if(r.setAttribute("airplay","allow"),r.setAttribute("x-webkit-airplay","allow"),c&&typeof r.webkitShowPlaybackTargetPicker=="function")try{r.webkitShowPlaybackTargetPicker()}catch(_){console.warn("[video-overlay] AirPlay picker failed:",_)}return le(),!0}function i(){if(!(Ee||!window.socket)){Ee=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let r=N();r&&(g(r,!1),ee(r)),le()},1e3)})}catch(r){console.warn("[video-overlay] Failed to attach AirPlay listener:",r)}}}function u(){let r=N();return H(r)?g(r)?(E("AirPlay enabled","success"),i(),!0):(E("AirPlay not available","warning"),!1):(le(),E("AirPlay not available","warning"),!1)}function E(r,c="info"){let _=document.getElementById("btfw-notification");_||(_=document.createElement("div"),_.id="btfw-notification",_.className="btfw-notification",document.body.appendChild(_)),_.textContent=r,_.className=`btfw-notification btfw-notification--${c} btfw-notification--show`,clearTimeout(_._hideTimer),_._hideTimer=setTimeout(()=>{_.classList.remove("btfw-notification--show")},3e3)}function F(){return U("video")}function ae(r){let c=(r||"").replace(/\r\n/g,`
`).trim()+`
`;return c=c.replace(/^\d+\s*$\n/gm,""),c=c.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),c=c.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+c}async function j(){let r=F();if(!r){be("Local subs only for HTML5 sources.");return}let c=document.createElement("input");c.type="file",c.accept=".vtt,.srt,text/vtt,text/plain",c.style.display="none",document.body.appendChild(c);let _=new Promise(L=>{c.addEventListener("change",async()=>{let G=c.files&&c.files[0];if(document.body.removeChild(c),!G)return L(!1);try{let re=await G.text(),Le=(G.name.split(".").pop()||"").toLowerCase()==="srt"?ae(re):re.startsWith("WEBVTT")?re:`WEBVTT

`+re,ke=URL.createObjectURL(new Blob([Le],{type:"text/vtt"}));ye(r,ke,G.name.replace(/\.[^.]+$/,"")||"Local"),be("Subtitles loaded."),L(!0)}catch(re){console.error(re),be("Failed to load subtitles."),L(!1)}},{once:!0})});c.click(),await _}function ye(r,c,_){var G;(G=U('track[data-btfw="1"]',r))==null||G.remove();let L=document.createElement("track");L.kind="subtitles",L.label=_||"Local",L.srclang="en",L.src=c,L.default=!0,L.setAttribute("data-btfw","1"),r.appendChild(L);try{for(let re of r.textTracks)re.mode=re.label===L.label?"showing":"disabled"}catch(re){}}function be(r){let c=U("#btfw-mini-toast");c||(c=document.createElement("div"),c.id="btfw-mini-toast",document.body.appendChild(c)),c.textContent=r,c.style.opacity="1",clearTimeout(c._hid),c._hid=setTimeout(()=>c.style.opacity="0",1400)}function Se(r){if(!r)return;let c=document.querySelector("#btfw-vo-subs");c||(c=document.createElement("button"),c.id="btfw-vo-subs",c.className="btfw-vo-btn",c.title="Load local subtitles (.vtt/.srt)",c.innerHTML='<i class="fa fa-closed-captioning"></i>',c.addEventListener("click",L=>{L.preventDefault(),j()}),r.insertBefore(c,r.firstChild||null));let _=fe()&&s();c.style.display=_?"":"none"}function Te(){ve(),oe();let r=[U("#videowrap"),U("#rightcontrols"),U("#leftcontrols"),document.body].filter(Boolean),c=new MutationObserver(()=>oe());r.forEach(_=>c.observe(_,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>oe());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>oe(),0)})}catch(_){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te(),{name:"feature:videoOverlay",setLocalSubsEnabled:ge,toggleFullscreen:d,enableAirplay:u}});BTFW.define("feature:resize",[],async()=>({name:"feature:resize"}));(function(){"use strict";let p="https://vidprox.billtube.workers.dev/?url=";function W(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function f(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var b,k,m;let s=typeof window!="undefined"&&(((b=window.BTFW_CONFIG)==null?void 0:b.corsVideoProxy)||((m=(k=window.BTFW_CONFIG)==null?void 0:k.integrations)==null?void 0:m.corsVideoProxy));if(typeof s=="string"&&s.trim()){let T=s.trim();if(T.includes("?"))return T;let K=T.endsWith("/")?"":"/";return`${T}${K}?url=`}return p},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_isTrusted(s){try{return new URL(s).hostname.toLowerCase().endsWith(".workers.dev")}catch(b){return!1}},_markInternalSrcSet(){this._lastInternalSrcSetAt=f()},_isInsideInternalWindow(){return f()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let s=this._getMediaElement();return s?s.crossOrigin==="anonymous"||s.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var s;if(this._hasAnonymousCrossOrigin())return!1;try{return(s=this.player)==null||s.crossOrigin("anonymous"),!0}catch(b){return!1}},_same(s,b){return String(s||"")===String(b||"")},_getMediaElement(){var k;let s=(k=this.player)==null?void 0:k.tech_;if(s){try{let m=typeof s.el=="function"?s.el():null;if(m instanceof HTMLMediaElement&&m.isConnected)return m}catch(m){}if(s.el_ instanceof HTMLMediaElement&&s.el_.isConnected)return s.el_}let b=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return b instanceof HTMLMediaElement&&b.isConnected?b:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(s){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(s){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(s){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(s){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(s){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(s){}this.mergerNode=null}},resetMediaBinding(){var b,k;this.disconnectChain();let s=this._getMediaElement();if(s&&this._syncFromRegistry(s)){((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((k=this.audioContext)==null?void 0:k.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(s){var $;let b=($=this.player)==null?void 0:$.tech_;if(!(b!=null&&b.el_)||b.el_!==s)return null;let k=s.parentNode;if(!k)return null;let m=s.tagName.toLowerCase()==="audio"?"audio":"video",T=document.createElement(m);T.className=s.className,s.id&&(T.id=s.id),T.setAttribute("playsinline",""),T.setAttribute("webkit-playsinline",""),T.classList.contains("vjs-tech")||T.classList.add("vjs-tech");let K=s.crossOrigin||s.getAttribute("crossorigin");return K&&(T.crossOrigin=K,T.setAttribute("crossorigin",K)),k.replaceChild(T,s),b.el_=T,delete s.__btfwSourceNode,T},_syncFromRegistry(s){let b=W().get(s)||s.__btfwSourceNode||null;return b?(W().set(s,b),this.sourceNode=b,this._sourceMediaElement=s,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b):null},_getOrCreateSourceNode(s){var T;let b=W(),k=b.get(s)||s.__btfwSourceNode||null;if(k)return b.set(s,k),this.sourceNode=k,this._sourceMediaElement=s,k.context&&k.context.state!=="closed"&&(this.audioContext=k.context),k;if(this.sourceNode&&this._sourceMediaElement===s)return b.set(s,this.sourceNode),s.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new(window.AudioContext||window.webkitAudioContext));let m;try{m=this.audioContext.createMediaElementSource(s)}catch(K){if((K==null?void 0:K.name)!=="InvalidStateError")throw K;let $=this._syncFromRegistry(s);if($)return $;let te=this._swapVideoTechElement(s);if(!te)throw K;let fe=(T=this.player)==null?void 0:T.currentSrc();if(fe&&this.player){this._markInternalSrcSet(),this.player.src({src:fe,type:"video/mp4"});try{this.player.load()}catch(ge){}}return this._getOrCreateSourceNode(te)}return b.set(s,m),s.__btfwSourceNode=m,this.sourceNode=m,this._sourceMediaElement=s,m},cleanup(){this.disconnectChain(),this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{});let s=this._getMediaElement();s&&(s.disableRemotePlayback=!1),this.stopWatchdog()},startWatchdog(){if(!this.player)return;this.stopWatchdog();let s=this._getMediaElement();if(s&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(s,{attributes:!0,attributeFilter:["src","crossorigin"]});let b=new MutationObserver(()=>{this._checkAndReapply("sources")});b.observe(s,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=b}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,k])=>{this.player.on(b,k)})}catch(b){}}this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800),this._lastKnownSrc=this.player.currentSrc()},stopWatchdog(){var s;if(this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(b){}try{(s=this._mutationObserver._sourceObserver)==null||s.disconnect()}catch(b){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([b,k])=>{this.player.off(b,k)})}catch(b){}this._watchdogPlayerHandlers=null}},_checkAndReapply(s){if(!this.player)return;let b=this.player.currentSrc();if(!b||(this._lastKnownSrc=b,this._isInsideInternalWindow()))return;if(b.includes(this.CORS_PROXY)){this.isProxied=!0,this.proxiedSrc=b;return}if(this._isTrusted(b)){this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin(),this.isProxied=!1,this.originalSrc=b;return}if(this._shouldForceProxy()){if(f()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=f(),this._forceProxyPreservingState(b)}},async _forceProxyPreservingState(s){if(!this.player)return;let b=this.player.currentTime(),k=!this.player.paused();this.originalSrc=s,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(s);try{this.player.pause()}catch(T){}try{this.player.crossOrigin("anonymous")}catch(T){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(T){}let m=()=>{try{this.player.currentTime(b)}catch(T){}this.isProxied=!0,k&&this.player.play().catch(()=>{})};typeof this.player.ready=="function"?this.player.ready(m):setTimeout(m,300)},async ensureProxy(){if(!this.player)return!1;let s=this.player.currentSrc();if(!s)return!1;if(s.includes(this.CORS_PROXY))return this.isProxied=!0,this.proxiedSrc=s,!0;try{let b=new URL(s);if(this._isTrusted(s)){if(this.originalSrc=s,this.isProxied=!1,this._hasAnonymousCrossOrigin())return!0;let k=this.player.currentTime(),m=!this.player.paused();try{this.player.pause()}catch(T){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:s,type:"video/mp4"});try{this.player.load()}catch(T){}return new Promise(T=>{this.player.ready(()=>{try{this.player.currentTime(k)}catch(K){}m&&this.player.play().catch(()=>{}),T(!0)})})}}catch(b){console.warn("[BTFW_AUDIO] Invalid URL:",b)}return this._forceProxyPreservingState(s),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var b;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if((this.boostEnabled||this.normalizationEnabled||this.monoEnabled)&&(!this.isProxied&&!this._isTrusted(this.player.currentSrc())?await this.ensureProxy():this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin()),!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let s=this._getMediaElement();if(!s)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((b=this.audioContext)==null?void 0:b.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),s.disableRemotePlayback=!0;let m=this._getOrCreateSourceNode(s);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let T=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(T.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(T.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(T.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(T.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(T.release,this.audioContext.currentTime),m.connect(this.compressorNode),m=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),m.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),m=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,m.connect(this.gainNode),m=this.gainNode),m.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(k){return console.error("[BTFW_AUDIO] Error building audio chain:",k),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(s){return this.NORM_PRESETS[s]?(this.currentNormPreset=s,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(s){return this.BOOST_MULTIPLIER=s,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let s=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),s}else{if(this.cleanup(),this.originalSrc&&this.isProxied){let s=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(k){}try{this.player.crossOrigin(null)}catch(k){}this._markInternalSrcSet(),this.player.src({src:this.originalSrc,type:"video/mp4"});try{this.player.load()}catch(k){}this.player.ready(()=>{try{this.player.currentTime(s)}catch(k){}this.isProxied=!1,b&&this.player.play().catch(()=>{})})}return!0}}}})();(function(){"use strict";function U(P){window.BTFW&&typeof BTFW.define=="function"?P():setTimeout(()=>U(P),0)}U(function(){BTFW.define("feature:audio",[],async()=>{let P=(d,g=document)=>g.querySelector(d),C=window.BTFW_AUDIO,p=null,W=null,f=null,s=!1,b=!1,k=!1,m=null,T=null,K=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function $(d){p&&(d?(p.classList.add("active"),p.style.background="rgba(46, 213, 115, 0.3)",p.style.borderColor="#2ed573",p.style.color="#2ed573",p.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(p.classList.remove("active"),p.style.background="",p.style.borderColor="",p.style.color="",p.style.boxShadow=""))}function te(d,g="info"){let i=P("#btfw-audioboost-toast");i||(i=document.createElement("div"),i.id="btfw-audioboost-toast",i.style.cssText=`
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
          `,document.body.appendChild(i)),i.textContent=d,i.style.background=g==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function fe(){if(await C.enableBoost()){s=!0;let g=Math.round(C.BOOST_MULTIPLIER*100);te(`Boosted by ${g}%`,"success"),$(!0)}else{let g=C._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";te(g,"error")}}async function ge(){await C.disableBoost(),s=!1,$(!1)}function X(d){W&&(d?(W.classList.add("active"),W.style.background="rgba(52, 152, 219, 0.3)",W.style.borderColor="#3498db",W.style.color="#3498db",W.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(W.classList.remove("active"),W.style.background="",W.style.borderColor="",W.style.color="",W.style.boxShadow=""))}function R(d,g="info"){let i=P("#btfw-audionorm-toast");i||(i=document.createElement("div"),i.id="btfw-audionorm-toast",i.style.cssText=`
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
          `,document.body.appendChild(i)),i.textContent=d,i.style.background=g==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function I(){if(await C.enableNormalization())b=!0,R("Normalization enabled","success"),X(!0);else{let g=C._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";R(g,"error")}}async function V(){await C.disableNormalization(),b=!1,X(!1)}function Q(d){f&&(d?(f.classList.add("active"),f.style.background="rgba(155, 89, 182, 0.3)",f.style.borderColor="#9b59b6",f.style.color="#9b59b6",f.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(f.classList.remove("active"),f.style.background="",f.style.borderColor="",f.style.color="",f.style.boxShadow=""))}function J(d,g="info"){let i=P("#btfw-mono-toast");i||(i=document.createElement("div"),i.id="btfw-mono-toast",i.style.cssText=`
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
          `,document.body.appendChild(i)),i.textContent=d,i.style.background=g==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function he(){if(await C.enableMono())k=!0,J("Stereo audio enabled","success"),Q(!0);else{let g=C._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";J(g,"error")}}async function ne(){await C.disableMono(),k=!1,Q(!1)}function Ee(){let d=document.createElement("button");d.id="btfw-vo-audioboost",d.className="btn btn-sm btn-default btfw-vo-adopted";let g=Math.round(C.BOOST_MULTIPLIER*100);return d.title=`Toggle Audio Boost (${g}%)`,d.setAttribute("data-btfw-overlay","1"),d.innerHTML='<i class="fa-solid fa-megaphone"></i>',d.addEventListener("click",()=>{C.boostEnabled?ge():fe()}),d.addEventListener("mouseenter",()=>oe()),d.addEventListener("mouseleave",()=>{setTimeout(()=>{!(m!=null&&m.matches(":hover"))&&!d.matches(":hover")&&w()},100)}),d}function de(){let d=document.createElement("button");d.id="btfw-vo-audionorm",d.className="btn btn-sm btn-default btfw-vo-adopted";let g=C.NORM_PRESETS[C.currentNormPreset].label;return d.title=`Toggle Audio Normalization (${g})`,d.setAttribute("data-btfw-overlay","1"),d.innerHTML='<i class="fa-solid fa-waveform-lines"></i>',d.addEventListener("click",()=>{C.normalizationEnabled?V():I()}),d.addEventListener("mouseenter",()=>H()),d.addEventListener("mouseleave",()=>{setTimeout(()=>{!(T!=null&&T.matches(":hover"))&&!d.matches(":hover")&&ie()},100)}),d}function ve(){let d=document.createElement("button");return d.id="btfw-vo-mono",d.className="btn btn-sm btn-default btfw-vo-adopted",d.title="Toggle Mono Audio (mix both channels to stereo)",d.setAttribute("data-btfw-overlay","1"),d.innerHTML='<i class="fa-solid fa-headphones"></i>',d.addEventListener("click",()=>{C.monoEnabled?ne():he()}),d}function xe(){if(m)return m;let d=document.createElement("div");return d.id="btfw-boost-context-menu",d.style.cssText=`
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
        `,K.forEach(g=>{let i=document.createElement("button");i.className="btfw-context-item",i.textContent=g.label,i.style.cssText=`
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
          `,C.BOOST_MULTIPLIER===g.multiplier&&(i.style.background="rgba(46, 213, 115, 0.2)",i.style.color="#2ed573"),i.addEventListener("mouseenter",()=>{C.BOOST_MULTIPLIER!==g.multiplier&&(i.style.background="rgba(109, 77, 246, 0.2)")}),i.addEventListener("mouseleave",()=>{C.BOOST_MULTIPLIER!==g.multiplier&&(i.style.background="transparent")}),i.addEventListener("click",async()=>{if(await C.setBoostMultiplier(g.multiplier),M(),p){let u=Math.round(g.multiplier*100);p.title=`Toggle Audio Boost (${u}%)`}C.boostEnabled&&te(`Boost set to ${g.label}`,"success")}),d.appendChild(i)}),d.addEventListener("mouseleave",()=>{setTimeout(()=>{p!=null&&p.matches(":hover")||w()},100)}),document.body.appendChild(d),m=d,d}function oe(){if(!p)return;let d=xe(),g=p.getBoundingClientRect();d.style.left=g.left+"px",d.style.top=g.bottom+5+"px",d.style.display="block"}function w(){m&&(m.style.display="none")}function M(){if(!m)return;m.querySelectorAll(".btfw-context-item").forEach((g,i)=>{let u=K[i];C.BOOST_MULTIPLIER===u.multiplier?(g.style.background="rgba(46, 213, 115, 0.2)",g.style.color="#2ed573"):(g.style.background="transparent",g.style.color="#e0e0e0")})}function N(){if(T)return T;let d=document.createElement("div");return d.id="btfw-norm-context-menu",d.style.cssText=`
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
        `,Object.keys(C.NORM_PRESETS).forEach(g=>{let i=C.NORM_PRESETS[g],u=document.createElement("button");u.className="btfw-context-item",u.textContent=i.label,u.style.cssText=`
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
          `,C.currentNormPreset===g&&(u.style.background="rgba(52, 152, 219, 0.2)",u.style.color="#3498db"),u.addEventListener("mouseenter",()=>{C.currentNormPreset!==g&&(u.style.background="rgba(109, 77, 246, 0.2)")}),u.addEventListener("mouseleave",()=>{C.currentNormPreset!==g&&(u.style.background="transparent")}),u.addEventListener("click",async()=>{await C.setNormPreset(g),ee(),W&&(W.title=`Toggle Audio Normalization (${i.label})`),C.normalizationEnabled&&R(`Preset: ${i.label}`,"success")}),d.appendChild(u)}),d.addEventListener("mouseleave",()=>{setTimeout(()=>{W!=null&&W.matches(":hover")||ie()},100)}),document.body.appendChild(d),T=d,d}function H(){if(!W)return;let d=N(),g=W.getBoundingClientRect();d.style.left=g.left+"px",d.style.top=g.bottom+5+"px",d.style.display="block"}function ie(){T&&(T.style.display="none")}function ee(){if(!T)return;let d=T.querySelectorAll(".btfw-context-item");Object.keys(C.NORM_PRESETS).forEach((g,i)=>{let u=d[i];C.currentNormPreset===g?(u.style.background="rgba(52, 152, 219, 0.2)",u.style.color="#3498db"):(u.style.background="transparent",u.style.color="#e0e0e0")})}function le(){let d=P("#btfw-vo-left");if(!d)return!1;let g=P("#btfw-vo-audioboost");g&&g.remove();let i=P("#btfw-vo-audionorm");i&&i.remove();let u=P("#btfw-vo-mono");return u&&u.remove(),p=Ee(),W=de(),f=ve(),d.appendChild(p),d.appendChild(W),d.appendChild(f),!0}function pe(d,g=20){let i=0,u=setInterval(()=>{i++,le()?(clearInterval(u),d()):i>=g&&clearInterval(u)},500)}function l(){if(typeof videojs=="undefined"){setTimeout(l,500);return}if(!P("#ytapiplayer")){setTimeout(l,500);return}C.player=videojs("ytapiplayer"),C.originalSrc=C.player.currentSrc(),C.startWatchdog()}function A(){setTimeout(()=>{C.resetMediaBinding(),C.boostEnabled=!1,C.normalizationEnabled=!1,C.monoEnabled=!1,C.isProxied=!1,$(!1),X(!1),Q(!1),l(),s&&setTimeout(()=>{fe()},1200),b&&setTimeout(()=>{I()},1200),k&&setTimeout(()=>{he()},1200)},600)}function B(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>C._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>C._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",A))}function q(){pe(()=>{l()}),B()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",q):q(),{name:"feature:audio",activate:fe,deactivate:ge,isActive:()=>C.boostEnabled,activateNormalization:I,deactivateNormalization:V,isNormalizationActive:()=>C.normalizationEnabled,activateMono:he,deactivateMono:ne,isMonoActive:()=>C.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async P=>P.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async P=>P.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:U})=>{let P=await U("util:tmdb-proxy"),C="movie-info",p={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},W="btfw-movie-info-style",f={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},s=0,b=!1,k=null;function m(i){typeof i=="function"&&f.cleanup.push(i)}function T(){for(;f.cleanup.length;){let i=f.cleanup.pop();try{i()}catch(u){}}f.header&&(f.header.remove(),f.header=null)}function K(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null),f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null),s=0,f.currentTitle="",f.isInitialized=!1,T()}function $(i){if(typeof i=="boolean")return i;if(typeof i=="number")return Number.isFinite(i)?i>0:!1;if(typeof i=="string"){let u=i.trim().toLowerCase();return u?u==="1"||u==="true"||u==="yes"||u==="on":!1}return!1}function te(){let i=[()=>{var u,E,F;return(F=(E=(u=window.BTFW_THEME_ADMIN)==null?void 0:u.integrations)==null?void 0:E.movieInfo)==null?void 0:F.enabled},()=>{var u,E,F;return(F=(E=(u=window.BTFW_CONFIG)==null?void 0:u.integrations)==null?void 0:E.movieInfo)==null?void 0:F.enabled},()=>{var u,E;return(E=(u=window.BTFW_CONFIG)==null?void 0:u.movieInfo)==null?void 0:E.enabled},()=>{var u;return(u=window.BTFW_CONFIG)==null?void 0:u.movieInfoEnabled},()=>{var u,E;return(E=(u=document==null?void 0:document.body)==null?void 0:u.dataset)==null?void 0:E.btfwMovieInfoEnabled}];for(let u of i)try{let E=typeof u=="function"?u():u;if($(E))return!0}catch(E){}return!1}function fe(){if(k||typeof MutationObserver!="function")return;let i=document.body;i&&(k=new MutationObserver(()=>I()),k.observe(i,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function ge(){if(b)return;b=!0;let i=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",i),document.addEventListener("btfw:ready",i)}function X(i=0){f.initTimer&&(clearTimeout(f.initTimer),f.initTimer=null),f.initTimer=window.setTimeout(()=>{f.initTimer=null,te()&&R()},Math.max(0,i))}function R(){if(f.isInitialized)return;let i=document.querySelector(p.TOPBAR_SELECTOR);if(!i){X(500);return}try{V(i),d(),J(),f.isInitialized=!0,setTimeout(()=>{w(),M()},120)}catch(u){X(800)}}function I(){te()?f.isInitialized?(w(),setTimeout(M,80)):X(0):K()}function V(i){if(!i&&(i=document.querySelector(p.TOPBAR_SELECTOR),!i))throw new Error("Chat topbar not found");let u=document.getElementById(p.CONTAINER_ID);u&&u.remove();let E=document.createElement("div");E.id=p.CONTAINER_ID,E.className="btfw-movie-header hide",E.dataset.module=C,i.insertAdjacentElement("afterend",E),f.header=E}function Q(){try{return window.socket||window.SOCKET||null}catch(i){return null}}function J(){he(),de();let i=q(w,250);window.addEventListener("resize",i),m(()=>window.removeEventListener("resize",i))}function he(){ne(),Ee()}function ne(){let i=document.querySelector(p.TITLE_SELECTOR);if(i){let u=()=>xe(),E=()=>oe();i.addEventListener("mouseenter",u),i.addEventListener("mouseleave",E),m(()=>{i.removeEventListener("mouseenter",u),i.removeEventListener("mouseleave",E)})}else if(typeof MutationObserver=="function"){let u=new MutationObserver(()=>{document.querySelector(p.TITLE_SELECTOR)&&(u.disconnect(),ne())});u.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),m(()=>{try{u.disconnect()}catch(E){}})}}function Ee(){let i=f.header;if(!i)return;let u=()=>ve(),E=()=>oe();i.addEventListener("mouseenter",u),i.addEventListener("mouseleave",E),m(()=>{i.removeEventListener("mouseenter",u),i.removeEventListener("mouseleave",E)})}function de(){let i=Q();if(i&&typeof i.on=="function"){i.on("changeMedia",M),m(()=>{var F,ae;try{(F=i.off)==null||F.call(i,"changeMedia",M)}catch(j){try{(ae=i.removeListener)==null||ae.call(i,"changeMedia",M)}catch(ye){}}});return}let u=0,E=()=>{if(!te()){f.socketRetryTimer=null;return}let F=Q();if(F&&typeof F.on=="function"){F.on("changeMedia",M),m(()=>{var ae,j;try{(ae=F.off)==null||ae.call(F,"changeMedia",M)}catch(ye){try{(j=F.removeListener)==null||j.call(F,"changeMedia",M)}catch(be){}}}),f.socketRetryTimer=null;return}if(u+=1,u>10){f.socketRetryTimer=null;return}f.socketRetryTimer=window.setTimeout(E,1e3)};f.socketRetryTimer=window.setTimeout(E,1200),m(()=>{f.socketRetryTimer&&(clearTimeout(f.socketRetryTimer),f.socketRetryTimer=null)})}function ve(){f.hideTimer&&(clearTimeout(f.hideTimer),f.hideTimer=null)}function xe(){ve(),f.header&&(f.header.classList.remove("hide"),f.header.classList.add("show"))}function oe(){ve(),f.hideTimer=window.setTimeout(()=>{f.header&&(f.header.classList.remove("show"),f.header.classList.add("hide"),setTimeout(()=>{f.header&&f.header.classList.contains("hide")&&f.header.classList.remove("hide")},320))},300)}function w(){if(!f.header)return;let i=window.innerWidth<=768;f.header.classList.toggle("btfw-mobile",i)}async function M(){var ae;if(!f.isInitialized)return;let i=document.querySelector(p.TITLE_SELECTOR),u=f.header;if(!i||!u)return;let E=((ae=i.textContent)==null?void 0:ae.trim())||"";if(!E){f.currentTitle="",le();return}if(E===f.currentTitle)return;f.currentTitle=E;let F=++s;ie();try{let j=await H(E);if(F!==s)return;l(j)}catch(j){if(F!==s)return;P.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ee()}}function N(i){let u=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],E=i;return u.forEach(F=>{let ae=new RegExp(`\\b${F}\\b`,"gi");E=E.replace(ae,"")}),E.replace(/\s{2,}/g," ").trim()}async function H(i){var ye;if(!P.isAvailable())throw new Error(P.MISSING_PROXY_MSG);let u=i.match(/(.+)\s*\((\d{4})\)/),E=u?u[1].trim():i,F=u?u[2]:"";F||(u=i.match(/(.+?)\s+(\d{4})\s*$/),u&&(E=u[1].trim(),F=u[2]));let ae=N(E),j=await P.tmdbFetch("search/movie",{query:ae,year:F});if(((ye=j==null?void 0:j.results)==null?void 0:ye.length)>0){let be=j.results[0];return{title:i,backdrop:be.backdrop_path?`https://image.tmdb.org/t/p/w1280${be.backdrop_path}`:null,poster:be.poster_path?`https://image.tmdb.org/t/p/w500${be.poster_path}`:null,summary:be.overview||"",rating:be.vote_average||0,releaseDate:be.release_date||"",voteCount:be.vote_count||0}}return{title:i,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ie(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-loading">
          <i class="fa fa-spinner fa-spin"></i>
          <p>Loading movie information...</p>
        </div>
      </div>
    `)}function ee(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <div class="btfw-movie-error">
          <i class="fa fa-exclamation-triangle"></i>
          <p>Unable to fetch movie information</p>
          <small>Check TMDB API key in Theme Settings</small>
        </div>
      </div>
    `)}function le(){f.header&&(pe(),f.header.innerHTML=`
      <div class="btfw-movie-content">
        <p>No movie information available</p>
      </div>
    `)}function pe(){f.header&&(f.header.style.backgroundImage="",f.header.style.backgroundColor="")}function l(i){if(!f.header)return;f.header.innerHTML="",p.ENABLE_BACKDROP&&i.backdrop?(f.header.style.backgroundImage=`url(${i.backdrop})`,f.header.style.backgroundSize="cover",f.header.style.backgroundPosition="center"):pe();let u=document.createElement("div");u.className="btfw-movie-overlay",f.header.appendChild(u);let E=document.createElement("div");if(E.className="btfw-movie-content",f.header.appendChild(E),i.poster){let j=document.createElement("img");j.src=i.poster,j.alt=`${i.title} Poster`,j.className="btfw-movie-poster",E.appendChild(j)}let F=document.createElement("div");F.className="btfw-movie-details",E.appendChild(F);let ae=document.createElement("h2");if(ae.textContent=i.title,ae.className="btfw-movie-title",F.appendChild(ae),p.SHOW_SUMMARY&&i.summary){let j=document.createElement("p");j.textContent=i.summary,j.className="btfw-movie-summary",F.appendChild(j)}if(p.ENABLE_RATING&&i.rating>0){let j=A(i.rating,i.voteCount);E.appendChild(j)}}function A(i,u){let E=document.createElement("div");E.className="btfw-movie-rating";let F=Math.round(i*10),ae=B(F),j="http://www.w3.org/2000/svg",ye=document.createElementNS(j,"svg");ye.setAttribute("width","60"),ye.setAttribute("height","60"),ye.setAttribute("viewBox","0 0 60 60");let be=25,Se=2*Math.PI*be,Te=Se-i/10*Se,r=document.createElementNS(j,"circle");r.setAttribute("cx","30"),r.setAttribute("cy","30"),r.setAttribute("r",be.toString()),r.setAttribute("stroke","#2a2a2a"),r.setAttribute("stroke-width","4"),r.setAttribute("fill","#1a1a1a"),ye.appendChild(r);let c=document.createElementNS(j,"circle");c.setAttribute("cx","30"),c.setAttribute("cy","30"),c.setAttribute("r",be.toString()),c.setAttribute("stroke",ae),c.setAttribute("stroke-width","3"),c.setAttribute("fill","none"),c.setAttribute("stroke-dasharray",Se.toString()),c.setAttribute("stroke-dashoffset",Te.toString()),c.setAttribute("transform","rotate(-90 30 30)"),c.setAttribute("stroke-linecap","round"),ye.appendChild(c);let _=document.createElementNS(j,"text");if(_.setAttribute("x","50%"),_.setAttribute("y","50%"),_.setAttribute("text-anchor","middle"),_.setAttribute("dominant-baseline","central"),_.setAttribute("fill","#fff"),_.setAttribute("font-size","10"),_.setAttribute("font-weight","bold"),_.textContent=`${F}%`,ye.appendChild(_),E.appendChild(ye),u>0){let L=document.createElement("div");L.className="btfw-movie-votes",L.textContent=`${u.toLocaleString()} votes`,E.appendChild(L)}return E}function B(i){let u=Math.max(0,Math.min(i,100));return u>=70?"#4caf50":u>=50?"#ff9800":"#f44336"}function q(i,u){let E=null;return function(...ae){E&&clearTimeout(E),E=setTimeout(()=>{E=null,i(...ae)},u)}}function d(){if(document.getElementById(W))return;let i=`
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
      ${p.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,u=document.createElement("style");u.id=W,u.textContent=i,document.head.appendChild(u)}function g(){fe(),ge(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):g(),{name:"feature:movie-info",refresh:I,cleanup:K}});BTFW.define("feature:monkeyPaw",[],async()=>{let U="btfw-monkey-paw-styles",P="btfw-monkey-paw-overlay",C="/assets/monkey-paw/paw.svg",p={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},W={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},f={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},s=null,b=null;function k(R){return new Promise(I=>setTimeout(I,R))}function m(){try{let R=typeof window!="undefined"?window.BTFW:null;return R&&(R.BASE||R.DEV_CDN)||""}catch(R){return""}}function T(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(R){return!1}}function K(){if(typeof document=="undefined"||document.getElementById(U))return;let R=document.createElement("style");R.id=U,R.textContent=`
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
    `,document.head.appendChild(R)}async function $(){if(s)return s;let I=`${m()}${C}`,V=await fetch(I,{credentials:"omit"});if(!V.ok)throw new Error(`Monkey paw SVG failed to load (${V.status})`);return s=await V.text(),s}function te(R){Object.entries(f).forEach(([I,V])=>{let Q=R.querySelector(`#${I}`),J=R.querySelector(`#${I}-tip`);Q&&(Q.style.transform=V.root),J&&(J.style.transform=V.tip)})}function fe(R){Object.entries(p).forEach(([I,V])=>{window.setTimeout(()=>{let Q=R.querySelector(`#${I}`),J=R.querySelector(`#${I}-tip`);Q&&(Q.style.transform=V.root),J&&window.setTimeout(()=>{J.style.transform=V.tip},120)},W[I])})}function ge(R){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${R}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function X(R={}){if(b)return b;if(typeof document!="undefined")return b=(async()=>{var he,ne;if(K(),T()){await k((he=R.reducedMotionMs)!=null?he:450);return}let I=document.getElementById(P);I||(I=document.createElement("div"),I.id=P,document.body.appendChild(I));let V;try{V=await $()}catch(Ee){console.warn("[monkey-paw] SVG load failed:",Ee),await k(300);return}I.innerHTML=ge(V),te(I);let Q=I.querySelector("#paw"),J=I.querySelector("#btfw-monkey-paw-msg");I.classList.remove("is-cursed"),J==null||J.classList.remove("is-visible"),requestAnimationFrame(()=>I.classList.add("is-active")),fe(I),await k(980),Q==null||Q.classList.add("btfw-monkey-paw-shaking"),await k(720),Q==null||Q.classList.remove("btfw-monkey-paw-shaking"),I.classList.add("is-cursed"),J==null||J.classList.add("is-visible"),await k((ne=R.holdMs)!=null?ne:1100),I.classList.remove("is-active"),await k(320),I.remove()})().finally(()=>{b=null}),b}return{name:"feature:monkeyPaw",play:X}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:U})=>{let P=await U("util:tmdb-proxy"),C=await U("feature:monkeyPaw"),p=(l,A=document)=>A.querySelector(l),W=(l,A=document)=>Array.from(A.querySelectorAll(l)),f=null,s=null,b=null,k=null,m={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},T=null,K=null,$="[movie-suggestion]";function te(...l){console.log($,...l)}function fe(...l){console.error($,...l)}function ge(l){var A;try{if((A=window.socket)!=null&&A.emit)return window.socket.emit("chatMsg",{msg:l}),!0}catch(B){}return!1}async function X(l,A={}){return P.workerFetch(l,A)}function R(){if(document.getElementById("btfw-movie-suggest-styles"))return;let l=document.createElement("style");l.id="btfw-movie-suggest-styles",l.textContent=`
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
    `,document.head.appendChild(l)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function V(){let l=p("a[href*='donate'], #donate-btn, .donate-btn");if(l){let B=l.closest("ul");if(B)return{ul:B,insertAfter:l.parentElement}}let A=p("#btfw-theme-btn-nav");if(A){let B=A.closest("ul");if(B)return{ul:B,insertAfter:null}}return{ul:p(".navbar .nav.navbar-nav")||p(".navbar-nav")||p(".btfw-navbar ul")||p(".navbar ul"),insertAfter:null}}function Q(){if(p("#btfw-movie-suggest-btn"))return!0;let l=V();if(!l.ul)return!1;let A=document.createElement("li"),B=document.createElement("a");return B.href="javascript:void(0)",B.className="btfw-nav-pill",B.id="btfw-movie-suggest-btn",B.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,A.appendChild(B),l.insertAfter?l.insertAfter.after(A):l.ul.insertBefore(A,l.ul.firstChild),B.addEventListener("click",H),!0}function J(){var q,d,g,i,u,E;if(p("#btfw-movie-suggest-modal"))return;let l=document.createElement("div");l.id="btfw-movie-suggest-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let A=p(".modal-background",l),B=p(".delete",l);if(A.addEventListener("click",ie),B.addEventListener("click",ie),(q=p("#btfw-movie-prev",l))==null||q.addEventListener("click",()=>{m.page>1&&(m.page-=1,oe())}),(d=p("#btfw-movie-next",l))==null||d.addEventListener("click",()=>{m.page<m.totalPages&&(m.page+=1,oe())}),I===0){let F=p("#btfw-movie-search",l);F.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),F.blur()})}else{let F,ae=p("#btfw-movie-search",l);ae.addEventListener("input",()=>{clearTimeout(F),m.query=ae.value.trim(),m.page=1,F=setTimeout(()=>oe(),400)}),(g=p("#btfw-movie-sort",l))==null||g.addEventListener("change",j=>{m.sortBy=j.target.value,m.page=1,oe()}),(i=p("#btfw-movie-genre",l))==null||i.addEventListener("change",j=>{m.genreId=j.target.value,m.page=1,oe()}),(u=p("#btfw-movie-year",l))==null||u.addEventListener("change",j=>{m.year=j.target.value.trim(),m.page=1,oe()}),(E=p("#btfw-movie-rating",l))==null||E.addEventListener("change",j=>{m.minRating=j.target.value.trim(),m.page=1,oe()})}}function he(){if(p("#btfw-movie-confirm-modal"))return;let l=document.createElement("div");l.id="btfw-movie-confirm-modal",l.className="modal",l.innerHTML=`
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
    `,document.body.appendChild(l);let A=p(".modal-background",l),B=p(".delete",l),q=p("#btfw-movie-cancel",l),d=p("#btfw-movie-confirm",l),g=()=>N();A.addEventListener("click",g),B.addEventListener("click",g),q.addEventListener("click",g),d.addEventListener("click",le)}async function ne(){if(T&&K)return;let[l,A]=await Promise.all([X("/api/meta"),X("/api/genres")]);T=l,K=A;let B=p("#btfw-movie-suggest-modal");if(!B)return;let q=p("#btfw-movie-sort",B);if(q&&q.options.length===0){for(let g of l.sortOptions||[]){let i=document.createElement("option");i.value=g.value,i.textContent=g.label,q.appendChild(i)}q.value=m.sortBy}let d=p("#btfw-movie-genre",B);if(d&&d.options.length<=1)for(let g of A.genres||[]){let i=document.createElement("option");i.value=String(g.id),i.textContent=g.name,d.appendChild(i)}}function Ee(){let l={page:m.page,sort_by:m.sortBy};return m.query?(l.query=m.query,m.year&&(l.primary_release_year=m.year,l.year=m.year)):(m.genreId&&(l.with_genres=m.genreId),m.year&&(l.primary_release_year=m.year),m.minRating&&(l["vote_average.gte"]=m.minRating)),l}function de(l){return!l||l==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${l}`}function ve(){let l=p("#btfw-movie-suggest-modal");if(!l)return;let A=p("#btfw-movie-prev",l),B=p("#btfw-movie-next",l),q=p("#btfw-movie-page-label",l);q&&(q.textContent=`Page ${m.page} of ${m.totalPages}`),A&&(A.disabled=m.page<=1||m.loading),B&&(B.disabled=m.page>=m.totalPages||m.loading)}function xe(l){let A=p("#btfw-movie-suggest-modal");if(!A)return;let B=p(".btfw-movie-results",A);if(!l.length){B.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}B.innerHTML=l.map(q=>`
      <div class="movie-result"
           data-id="${q.id}"
           data-title="${q.title}"
           data-poster="${q.posterPath||""}"
           data-year="${q.releaseYear||""}">
        <div class="movie-result__poster">
          <img src="${de(q.posterPath)}" alt="${q.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${q.title}</div>
          <small style="opacity:0.7;">${q.releaseYear||"N/A"}</small>
        </div>
      </div>
    `).join(""),W(".movie-result",B).forEach(q=>{q.addEventListener("click",()=>{f=q.dataset.id,s=q.dataset.title,b=q.dataset.poster,k=q.dataset.year||null;let d=p("#btfw-movie-confirm-modal");if(!d)return;let g=k?` (${k})`:"";p("#btfw-confirm-movie-title",d).textContent=`${s}${g}`,M()})})}async function oe(){let l=p("#btfw-movie-suggest-modal");if(!l||m.loading)return;m.loading=!0,ve();let A=p(".btfw-movie-results",l);A.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await ne();let B=await X("/api/search",{params:Ee()});m.totalPages=Math.max(1,B.totalPages||1),xe(B.results||[]),te("runSearch",{page:m.page,totalPages:m.totalPages,count:(B.results||[]).length})}catch(B){fe("runSearch failed:",B),A.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{m.loading=!1,ve()}}async function w(){let l=p("#btfw-movie-history");if(l){l.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let B=(await X("/api/history",{params:{page:1,limit:10}})).results||[];if(!B.length){l.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}l.innerHTML=B.map(q=>{let d=q.releaseYear?` (${q.releaseYear})`:"";return`
          <div class="history-item">
            <img src="${de(q.posterPath).replace("w154","w92")}" alt="${q.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${q.movieTitle}${d}</div>
              <div class="history-item__meta">Requested by ${q.username}</div>
            </div>
          </div>
        `}).join("")}catch(A){fe("loadHistory failed:",A),l.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function M(){let l=p("#btfw-movie-suggest-modal"),A=p("#btfw-movie-confirm-modal");A&&(l&&l.classList.add("btfw-movie-suggest-pending"),A.classList.add("is-active"))}function N(){let l=p("#btfw-movie-suggest-modal"),A=p("#btfw-movie-confirm-modal");l&&l.classList.remove("btfw-movie-suggest-pending"),A&&A.classList.remove("is-active")}async function H(){let l=p("#btfw-movie-suggest-modal");if(l){te("openModal",{userRank:I}),l.classList.remove("btfw-movie-suggest-pending"),l.classList.add("is-active");try{await ne(),await Promise.all([oe(),w()])}catch(A){fe("openModal bootstrap failed:",A)}}}function ie(){let l=p("#btfw-movie-suggest-modal");l&&(N(),te("closeModal"),l.classList.remove("is-active"),p("#btfw-movie-search",l).value="",p(".btfw-movie-results",l).innerHTML="",m.query="",m.page=1,m.totalPages=1,f=null,s=null,b=null,k=null)}function ee(l,A,B){let q=B?` (${B})`:"";return`\u{1F3AC} Movie request: ${A}${q} \u2014 suggested by ${l}`}async function le(){if(!f||!s)return;let l=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";te("confirmSuggestion",{movieId:f,movieTitle:s}),N();try{await C.play(),await X("/api/suggestions",{method:"POST",body:{movieId:Number(f),movieTitle:s,username:l,posterPath:b||null,releaseYear:k||null}}),ge(ee(l,s,k)),await w(),ie()}catch(A){fe("confirmSuggestion failed:",A),alert("Could not save your movie request. Please try again.")}}function pe(){te("boot: start",{workerBase:P.getWorkerBase()}),R(),J(),he();let l=0,A=50,B=()=>{if(Q()){te("Button added successfully");return}l+=1,l<A?setTimeout(B,100):console.warn($,"Failed to add button after retries",{retryCount:l})};B()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(pe,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(pe,200)}):setTimeout(pe,200),{name:"ext:movie-suggestion",open:H,close:ie,getWorkerBase:P.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async U=>U.init("ext:movie-suggestion"));})();
/*! Quiglytube player bundle entry — generated by scripts/build.js */
