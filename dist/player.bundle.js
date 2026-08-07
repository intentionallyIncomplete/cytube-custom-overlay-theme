/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let T="#videowrap .video-js",M="vjs-default-skin",Y="vjs-theme-city",y="vjs-big-play-centered",Q=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),p={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},o="btfw-videojs-base-css",i="btfw-videojs-city-css",b=["https://vjs.zencdn.net/7.20.3/video-js.css"],l=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function _(E,P){let R=document;if(!R||!R.head||R.getElementById(E))return;let W=R.createElement("link");W.id=E,W.rel="stylesheet";let me=Array.isArray(P)?P.slice():[P],pe=()=>{if(!me.length)return!1;let le=me.shift();return le?(W.href=le,window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[le]?(W.integrity=window.BTFW.SRI[le],W.crossOrigin="anonymous"):(W.removeAttribute("integrity"),W.removeAttribute("crossorigin")),!0):pe()};W.addEventListener("error",()=>{pe()||W.remove()}),pe()&&R.head.appendChild(W)}function H(){if(typeof window=="undefined"||!document.body)return!1;let E=document.createElement("div");E.className=`video-js ${M}`,E.style.position="absolute",E.style.opacity="0",E.style.pointerEvents="none",E.style.width="1px",E.style.height="1px",document.body.appendChild(E);let P=window.getComputedStyle(E).fontSize;return E.remove(),P&&Math.abs(parseFloat(P)-10)<.2}function K(){H()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||_(o,b)}function q(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||_(i,l)}function G(E){if(!E)return null;try{return E.player||E.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(E.id)||window.videojs&&window.videojs.players&&window.videojs.players[E.id]}catch(P){return null}}function O(E){let P=G(E);if(!P)return;let R=typeof P.getChild=="function"?P.getChild("controlBar"):null,W=R&&typeof R.getChild=="function"?R.getChild("volumePanel"):null;if(W){E.classList.add("btfw-volume-inline");try{typeof W.inline=="function"&&W.inline(!0)}catch(me){}}}function D(){K(),q(),document.querySelectorAll(T).forEach(E=>{E.classList.contains(M)&&E.classList.remove(M),Array.from(E.classList).forEach(P=>{P.startsWith("vjs-theme-")&&P!==Y&&E.classList.remove(P)}),E.classList.contains(Y)||E.classList.add(Y),E.classList.contains(y)||E.classList.add(y),O(E)})}function Z(){var P;if(typeof window=="undefined")return;let E=(P=window.BTFW)==null?void 0:P.channelPosterUrl;E&&document.querySelectorAll(T).forEach(R=>{R.poster!==E&&(R.poster=E);try{let W=R.player||R.player_||window.videojs&&window.videojs.players&&window.videojs.players[R.id];W&&typeof W.poster=="function"&&W.poster(E)}catch(W){let me=R.querySelector(".vjs-poster");me&&(me.style.backgroundImage=`url("${E}")`)}})}function re(){var R;if(typeof window=="undefined")return;let E=(R=window.PLAYER)==null?void 0:R.mediaType;document.querySelectorAll(".vjs-poster").forEach(W=>{E==="yt"||E==="dm"||E==="vi"||E==="tw"?W.classList.add("hidden"):W.classList.remove("hidden")})}function z(){document.querySelectorAll(Q).forEach(P=>{P instanceof HTMLVideoElement&&(typeof P.playsInline=="boolean"&&(P.playsInline=!0),Object.entries(p).forEach(([R,W])=>{try{P.setAttribute(R,W)}catch(me){}}))})}function $(){if(typeof window=="undefined")return!1;let E=window.videojs;if(!E)return!1;let P=E.dom||E;if(!P||typeof P.textContent!="function")return!1;if(P.textContent&&P.textContent._btfwOptimized)return!0;let R=P.textContent.bind(P),W=function(pe,le){if(!pe)return pe;let be;try{typeof pe.textContent!="undefined"?be=pe.textContent:typeof pe.innerText!="undefined"&&(be=pe.innerText)}catch(c){be=void 0}if(be!==void 0){let c=le==null?"":String(le);if(be===c)return pe}return R(pe,le)};return W._btfwOptimized=!0,W._btfwOriginal=R,P.textContent=W,!0}function ne(){if($()){ne._tries=0;return}ne._tries>20||(ne._tries=(ne._tries||0)+1,setTimeout(ne,250))}let oe="_btfwGuarded";function X(E){if(!E)return!1;let P=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!E.closest(P)}function Ee(E){if(!E||E[oe])return;E[oe]=!0;let P=R=>{X(R.target)||R.type==="click"&&R.button!==0||(R.preventDefault(),R.stopImmediatePropagation())};E.addEventListener("click",P,!0),E.addEventListener("pointerdown",R=>{X(R.target)||(R.preventDefault(),R.stopImmediatePropagation())},!0),E.addEventListener("contextmenu",P,!0)}function de(){document.querySelectorAll(T).forEach(Ee)}function we(){if(we._mo)return;let E=document.getElementById("videowrap")||document.body,P=new MutationObserver(R=>{var me,pe,le;let W=!1;for(let be of R){for(let c of be.addedNodes)if(c.nodeType===1&&((me=c.classList)!=null&&me.contains("video-js")||c.tagName==="VIDEO"||c.tagName==="IFRAME"||(pe=c.querySelector)!=null&&pe.call(c,T))){W=!0;break}for(let c of be.removedNodes)if(c.nodeType===1&&((le=c.classList)!=null&&le.contains("video-js")||c.tagName==="VIDEO"||c.tagName==="IFRAME")){W=!0;break}}W&&(D(),de(),z(),Z(),re(),document.querySelectorAll(T).forEach(O))});P.observe(E,{childList:!0,subtree:!0,characterData:!1}),we._mo=P}function Se(){setTimeout(()=>{z(),Z(),re(),document.querySelectorAll(T).forEach(O)},100)}function fe(){if(D(),de(),z(),ne(),Z(),re(),we(),setInterval(()=>{re()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",Se),socket.on("changeMedia",Se)}catch(E){console.warn("[feature:player] Unable to bind changeMedia handler",E)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fe):fe(),document.addEventListener("btfw:layoutReady",()=>setTimeout(fe,0)),{name:"feature:player",applyCityTheme:D,attachGuards:de,ensureInlinePlayback:z,applyPosterUrl:Z,togglePosterVisibility:re,shouldAllowClick:X}});function Me(T=document){return!T||typeof T.querySelector!="function"?!1:!!(T.querySelector("#pollwrap .well.active")||T.querySelector("#pollwrap .well.muted")||T.querySelector("#pollwrap .poll-menu"))}function Ae(T,M){return T!=null?!!T:!!M}var St=/[&<>"']/g,_t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ke(T){return T==null?"":String(T).replace(St,M=>{var Y;return(Y=_t[M])!=null?Y:M})}function kt(T){return T.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function st(T){return T.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var Tt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],Lt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},Ct=["http","https","mailto"],At="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",Pt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,Mt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,It={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function Nt(T){let M=T;for(let y=0;y<3;y+=1){let Q=M.replace(/&#x([0-9a-fA-F]+);?/g,(p,o)=>{let i=Number.parseInt(o,16);if(!Number.isFinite(i)||i<0||i>1114111)return"";try{return String.fromCodePoint(i)}catch(b){return""}}).replace(/&#(\d+);?/g,(p,o)=>{let i=Number(o);if(!Number.isFinite(i)||i<0||i>1114111)return"";try{return String.fromCodePoint(i)}catch(b){return""}}).replace(/&([a-zA-Z]+);?/g,(p,o)=>{let i=It[o.toLowerCase()];return i!==void 0?i:p});if(Q===M)break;M=Q}let Y="";for(let y=0;y<M.length;y+=1){let Q=M.charCodeAt(y);Q<=31||Q===127||(Y+=M[y])}return Y.replace(/[\s\u00a0]+/g,"")}function Bt(T){var Q,p;let M=new Map,Y=new RegExp(Pt.source,"g"),y;for(;(y=Y.exec(T))!==null;){let o=((Q=y[1])!=null?Q:"").toLowerCase(),i=(p=y[2])!=null?p:"";(i.startsWith('"')&&i.endsWith('"')||i.startsWith("'")&&i.endsWith("'"))&&(i=i.slice(1,-1)),M.set(o,i),y[0].length===0&&(Y.lastIndex+=1)}return M}function Ot(T,M){var p;let Y=Nt(T);if(Y.length===0)return!0;let y=Mt.exec(Y);if(!y)return!0;let Q=((p=y[1])!=null?p:"").toLowerCase();return M.includes(Q)?Q==="data"?/^data:image\//i.test(Y):!0:!1}function Rt(T,M,Y,y,Q,p,o){var G,O;let i=M.toLowerCase();if(!Q.has(i))return"";if(T)return`</${i}>`;let b=Bt(Y||""),l=(G=p["*"])!=null?G:[],_=(O=p[i])!=null?O:[],H=[];for(let[D,Z]of b)D.startsWith("on")||!(l.includes(D)||_.includes(D))||(D==="href"||D==="src")&&!Ot(Z,o)||H.push(`${D}="${kt(Z)}"`);i==="a"&&b.get("target")==="_blank"&&_.includes("rel")&&(H.some(D=>D.startsWith("rel="))||H.push('rel="noopener noreferrer"'));let K=H.length>0?` ${H.join(" ")}`:"";return`<${i}${K}${y?" /":""}>`}function Ie(T,M={}){var _,H,K;if(T==null)return"";let Y=String(T).replace(/<!--[\s\S]*?-->/g,""),y=new Set(((_=M.allowedTags)!=null?_:Tt).map(q=>q.toLowerCase())),Q=(H=M.allowedAttributes)!=null?H:Lt,p=(K=M.allowedSchemes)!=null?K:Ct,o=new RegExp(At,"g"),i="",b=0,l;for(;(l=o.exec(Y))!==null;){let[q,G,O="",D="",Z]=l;i+=st(Y.slice(b,l.index)),i+=Rt(G,O,D,Z,y,Q,p),b=l.index+q.length}return i+=st(Y.slice(b)),i}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:T})=>{let M=await T("util:templates"),{stack:Y}=M,y="btfw-stack-order",Q="btfw-stack-motd-open",p="btfw-stack-playlist-open",o="btfw-stack-poll-open",i={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},b=i,l={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},_={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},H={"motd-group":1,"poll-group":2,"playlist-group":3},K=!1,q=null,G="",O=null,D=null,Z=null,re={"motd-group":{storageKey:Q,getDefaultOpen:e=>Ae(e,E()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:p,getDefaultOpen:e=>Ae(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:o,getDefaultOpen:e=>Ae(e,Me()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},z=null,$=!1,ne=!1,oe=null,X=!1,Ee=!1,de=!1,we=null,Se=!1;function fe(e=""){let t=String(e||"").trim();return t?!t.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function E(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=P(e);return t?!fe(t.innerHTML||""):!1}function P(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let R=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],W=["#main","#mainpage","#mainpane"],me=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function pe(e,t,n){if(!e||!t||!n)return null;let a=me.map(V=>{let ee=document.getElementById(V.id);return ee?{...V,el:ee}:null}).filter(Boolean);if(!a.length){let V=document.getElementById("btfw-addmedia-panel");return V&&V.remove(),null}let r=document.getElementById("btfw-addmedia-panel");if(r||(r=document.createElement("section"),r.id="btfw-addmedia-panel",r.className="btfw-addmedia-panel",r.dataset.open="false",r.setAttribute("role","region"),r.setAttribute("aria-label","Add media controls"),r.setAttribute("aria-hidden","true"),r.setAttribute("hidden","hidden"),r.innerHTML=Y.addMediaPanelHtml()),r.parentElement!==e){let V=t.parentElement===e?t.nextSibling:null;e.insertBefore(r,V)}let f=r.querySelector(".btfw-addmedia-tabs"),w=r.querySelector(".btfw-addmedia-views"),g=r.querySelector(".btfw-addmedia-close");if(!f||!w)return null;for(;f.firstChild;)f.removeChild(f.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);a.forEach(({id:V,title:ee,el:F})=>{F.classList.remove("collapse","in","plcontrol-collapse"),F.style.removeProperty("display"),F.style.removeProperty("height"),F.removeAttribute("aria-expanded"),F.setAttribute("role","tabpanel"),F.setAttribute("data-btfw-addmedia","panel");let ge=document.createElement("button");ge.type="button",ge.className="btfw-addmedia-tab",ge.dataset.target=V,ge.textContent=ee,ge.setAttribute("role","tab"),f.appendChild(ge);let ye=document.createElement("div");ye.className="btfw-addmedia-view",ye.dataset.target=V,ye.setAttribute("role","tabpanel"),ye.setAttribute("aria-hidden","true"),ye.appendChild(F),w.appendChild(ye)});let k=a.find(V=>V.default)||a[0],S=V=>{let ee=V||r.dataset.active||k.id;r.dataset.active=ee,f.querySelectorAll(".btfw-addmedia-tab").forEach(F=>{let ge=F.dataset.target===ee;F.classList.toggle("is-active",ge),F.setAttribute("aria-selected",ge?"true":"false"),F.setAttribute("tabindex",ge?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(F=>{let ge=F.dataset.target===ee;F.classList.toggle("is-active",ge),F.setAttribute("aria-hidden",ge?"false":"true")})},U=V=>{let ee=V!=null?!!V:r.dataset.open!=="true";return r.dataset.open=ee?"true":"false",r.classList.toggle("is-open",ee),r.setAttribute("aria-hidden",ee?"false":"true"),ee?(r.removeAttribute("hidden"),S(r.dataset.active||k.id)):r.setAttribute("hidden","hidden"),r.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:ee}})),ee};return r._btfwWired||(f.addEventListener("click",V=>{let ee=V.target.closest(".btfw-addmedia-tab");ee&&(V.preventDefault(),S(ee.dataset.target))}),g&&g.addEventListener("click",()=>U(!1)),r._btfwWired=!0),S(r.dataset.active||k.id),r._btfwToggle=U,r._btfwSetActive=S,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:ee,target:F})=>{let ge=document.getElementById(ee);ge&&ge.dataset.btfwAddmedia!==F&&(ge.dataset.btfwAddmedia=F,ge.setAttribute("aria-controls","btfw-addmedia-panel"),ge.addEventListener("click",ye=>{ye.preventDefault(),ye.stopPropagation(),S(F),U(!0),ge.blur()}))})})(),{panel:r,toggle:U,setActive:S}}function le(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),a=document.getElementById("btfw-video-overlay"),r=a&&n&&a.parentElement===n.parentElement?a:n;r&&r.parentElement?r.nextSibling?r.parentNode.insertBefore(t,r.nextSibling):r.parentNode.appendChild(t):e.appendChild(t);let f=document.createElement("div");f.className="btfw-stack-list",t.appendChild(f);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function be(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let f=t.querySelector(":scope > #motd");return f?{motdwrap:t,motd:f}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let a=[];t.querySelectorAll(".btfw-motd-editrow").forEach(f=>{let w=(f.textContent||"").trim();w&&a.push(`<p>${w}</p>`),f.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(f=>{f.contains(t)||f===t||((f.querySelector("#motd")||f.classList.contains("btfw-motd-editrow"))&&f.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&a.push(w.innerHTML)}),f.remove())});let r=t.querySelector(":scope > #motd");if(r||(r=document.createElement("div"),r.id="motd",t.appendChild(r)),t.querySelectorAll("#motd").forEach(f=>{f!==r&&((f.innerHTML||"").trim()&&a.push(f.innerHTML),f.remove())}),r.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(f=>{f.remove()}),r.querySelectorAll("#motd").forEach(f=>{(f.innerHTML||"").trim()&&a.push(f.innerHTML),f.remove()}),document.querySelectorAll("#togglemotd").forEach((f,w)=>{w!==0&&f.remove()}),a.length){let f=a.join("").trim();f&&fe(r.innerHTML)?r.innerHTML=Ie(f):f&&(r.innerHTML+=Ie(f))}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:r}}function c(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),a=document.getElementById("playlistwrap"),r=document.getElementById("queuecontainer"),f=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),g=document.querySelectorAll(".btfw-controls-row"),k=f||a||r||w;if(!k)return;let S=e;S?S.classList.add("btfw-plbar"):(S=document.createElement("div"),S.id="btfw-plbar",S.className="btfw-plbar");let U=S.querySelector(".btfw-plbar__layout"),ue,V;if(U)ue=U.querySelector(".btfw-plbar__primary")||U,V=U.querySelector(".btfw-plbar__aside")||U;else{for(U=document.createElement("div"),U.className="btfw-plbar__layout",ue=document.createElement("div"),ue.className="btfw-plbar__primary",V=document.createElement("div"),V.className="btfw-plbar__aside",U.append(ue,V);S.firstChild;)ue.appendChild(S.firstChild);S.appendChild(U);let se=ue.querySelector(".field.has-addons");se&&se.classList.add("btfw-plbar__search");let xe=ue.querySelector("#btfw-pl-count");xe&&(xe.classList.add("btfw-plbar__count"),V.appendChild(xe))}S.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(se=>se.remove());let ee=S.querySelector(".btfw-plbar__actions");ee||(ee=document.createElement("div"),ee.className="btfw-plbar__actions",(V||S).appendChild(ee));let F=document.getElementById("btfw-addmedia-btn"),ge=se=>{if(se){if(se.classList.add("btfw-plbar__action-btn"),se.tagName==="BUTTON"||se.tagName==="A")se.classList.add("button","is-dark","is-small");else if(se.tagName==="INPUT"){let xe=(se.type||"").toLowerCase();xe==="button"||xe==="submit"||xe==="reset"?se.classList.add("button","is-dark","is-small"):se.classList.remove("button","is-dark","is-small")}}};S.parentElement!==k&&k.insertBefore(S,k.firstChild);let ye=pe(k,S,ee);ye?!F||!document.body.contains(F)?(F=document.createElement("button"),F.id="btfw-addmedia-btn",F.type="button",F.className="button is-small",F.innerHTML=Y.addMediaButtonHtml(),ee.prepend(F)):ee.contains(F)||ee.prepend(F):F&&(F.parentElement&&F.parentElement.removeChild(F),F=null);let Pe=se=>{if(!se)return;Array.from(se.children||[]).forEach(Ce=>{Ce&&(Ce.classList.add("btfw-plbar__control"),ee.appendChild(Ce))})};if(n&&(Pe(n),n.remove()),t&&(Pe(t),t.remove()),ee.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(ge),ye&&F){F.classList.remove("is-dark"),F.classList.add("is-primary"),F.dataset.iconified||(F.innerHTML=Y.addMediaButtonHtml(),F.dataset.iconified="1"),F.setAttribute("aria-controls","btfw-addmedia-panel");let se=Ce=>{F.setAttribute("aria-expanded",Ce?"true":"false")};F.dataset.btfwBound||(F.dataset.btfwBound="1",F.addEventListener("click",Ce=>{Ce.preventDefault();let rt=document.getElementById("btfw-addmedia-panel"),at=rt&&rt._btfwToggle,xt=typeof at=="function"?at():!1;se(xt)}));let xe=ye.panel||document.getElementById("btfw-addmedia-panel");xe&&(se(xe.dataset.open==="true"),xe._btfwButtonSync||(xe.addEventListener("btfw:addmedia:state",Ce=>{se(!!(Ce.detail&&Ce.detail.open))}),xe._btfwButtonSync=!0))}g.forEach(se=>{se&&!k.contains(se)&&(se.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,se.remove(),k.appendChild(se),console.log("[stack] Moved floating controls row into playlist container"))}),k.contains(S)||k.insertBefore(S,k.firstChild),S.dataset.btfwMerged="1"}function I(e,t){if(e.id==="motd-group"&&(be(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Be(),c(),t=t.filter(g=>g&&g.id!=="rightcontrols"&&g.id!=="pollwrap").filter(g=>!g.querySelector||!g.querySelector("#pollwrap"))),e.id==="poll-group"&&(Be(),Ye(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(g=>g&&!n.contains(g)&&!g.contains(n)));let a=document.createElement("section");a.className="btfw-stack-item btfw-group-item",a.dataset.bind=e.id,a.dataset.group="true";let r=document.createElement("header");r.className="btfw-stack-item__header",r.innerHTML=Y.stackGroupHeaderHtml(e.title);let f=document.createElement("div");f.className="btfw-stack-item__body btfw-group-body",t.forEach(g=>{if(g&&g.parentElement!==f&&!f.contains(g)&&!g.contains(f))try{f.appendChild(g)}catch(k){console.warn("[stack] Failed to move element:",g.id||g.className,k)}}),a.appendChild(r),a.appendChild(f);let w=re[e.id];return w&&pt(a,w),Qe(a,e.id),a.querySelector(".btfw-up").onclick=function(){let g=a.parentElement,k=a.previousElementSibling;k&&g.insertBefore(a,k),N(g)},a.querySelector(".btfw-down").onclick=function(){let g=a.parentElement,k=a.nextElementSibling;k?g.insertBefore(k,a):g.appendChild(a),N(g)},a}function N(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(y,JSON.stringify(t))}catch(t){}}function j(){try{return JSON.parse(localStorage.getItem(y)||"[]")}catch(e){return[]}}function he(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function ce(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function m(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),a=localStorage.getItem(n);return a!==null?a==="true":!1}catch(t){return!1}}function h(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function x(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function B(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function ie(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Me()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function u(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Re())}function L(e){u(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function v(e,t,n){if(!e||B(e))return;let a=he(t),r=typeof n=="function"?n(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(r,{persist:!1}):(e.dataset.open=r?"true":"false",e.classList.toggle("is-open",r))}function J(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,a=document.getElementById("btfw-stack"),r=document.getElementById("btfw-leftpad"),f=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",n),a.classList.toggle("btfw-stack--all-docked",n)),r&&r.classList.toggle("btfw-leftpad--stack-hidden",n),f&&f.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function Te(){var a;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let r=document.createElement("div");r.id="btfw-panel-bar",r.className="btfw-panel-bar",r.setAttribute("role","toolbar"),r.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(r)}let n=t.querySelector("#btfw-panel-bar");return ve(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),K||(ft(),K=!0),(a=document.getElementById("btfw-stack-drawer"))==null||a.remove(),t}function s(e){e.preventDefault(),e.stopPropagation(),ut()}function d(){let e=Te();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=Y.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",s),t.dataset.btfwPanelsWired="1"),t}function C(e){if(!e)return null;let t=Array.from(e.classList).find(a=>a.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let a=n(e).data("uid");if(a!=null&&a!=="")return a}return e.dataset.uid||null}function A(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),a=n==null?void 0:n.querySelector(".qbtn-play");return a?(a.click(),!0):!1}function te(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),a=document.getElementById("queue_next");if(n&&a&&(n.value=t,!a.disabled))return a.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let r=window.socket;if(r&&typeof parseMediaLink=="function")try{let f=parseMediaLink(t);if((f==null?void 0:f.id)!=null&&(f!=null&&f.type))return r.emit("queue",{id:f.id,type:f.type,pos:"next",temp:!1}),!0}catch(f){}return!1}function ae(e){le();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(O&&(clearTimeout(O),O=null),q=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),Le(),We(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function ve(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var f,w,g;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let k=n.dataset.panelGroup||((f=n.closest(".btfw-panel-btn"))==null?void 0:f.dataset.group);k&&ae(k);return}let a=t.target.closest(".btfw-panel-playlist__play");if(a){t.preventDefault(),t.stopPropagation(),A(a.dataset.queueUid);return}let r=t.target.closest(".btfw-panel-playlist__add");if(r){t.preventDefault(),t.stopPropagation();let k=(w=r.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!k)return;let S=k.hidden;k.hidden=!S,r.setAttribute("aria-expanded",S?"true":"false"),S&&((g=k.querySelector(".btfw-panel-playlist__link-input"))==null||g.focus())}}),e.addEventListener("submit",t=>{var w,g,k,S;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let a=n.querySelector(".btfw-panel-playlist__link-input"),r=(w=a==null?void 0:a.value)==null?void 0:w.trim();if(!r||!te(r))return;a.value="",n.hidden=!0,(k=(g=n.closest(".btfw-panel-container"))==null?void 0:g.querySelector(".btfw-panel-playlist__add"))==null||k.setAttribute("aria-expanded","false");let f=(S=n.closest(".btfw-panel-container"))==null?void 0:S.querySelector(".btfw-panel-playlist__queue");f&&Fe(f)}))}function Le(){if(D){try{D.disconnect()}catch(e){}D=null}Z=null}function _e(e){if(!e||Z===e)return;Le();let t=document.getElementById("queue");t&&(Z=e,D=new MutationObserver(()=>{e.isConnected&&q==="playlist-group"&&Fe(e)}),D.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Ne(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),a=n.findIndex(f=>f.classList.contains("queue_active")||f.classList.contains("playing")),r=a>=0?a+1:0;return n.slice(r,r+e)}function Fe(e){if(!e)return;let t=Ne(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var k,S;let a=document.createElement("div");a.className="btfw-panel-playlist__item";let r=document.createElement("span");r.className="btfw-panel-playlist__title",r.textContent=(((k=n.querySelector(".qe_title"))==null?void 0:k.textContent)||"Untitled").trim();let f=document.createElement("span");f.className="btfw-panel-playlist__meta",f.textContent=(((S=n.querySelector(".qe_time"))==null?void 0:S.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let g=C(n);if(g!=null&&g!==""){let U=document.createElement("button");U.type="button",U.className="btfw-panel-playlist__play",U.textContent="Play",U.dataset.queueUid=String(g),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(U.disabled=!0),w.appendChild(U)}a.append(r,f,w),e.appendChild(a)})}function Ge(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=Y.panelUndockIconHtml(),n}function lt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=Y.playlistAddFormHtml(),e}function ct(e,t,n){let a=document.createElement("div");if(a.className="btfw-panel-container",n>0&&(a.style.bottom=`${-n*50}px`),e==="playlist-group"){a.classList.add("btfw-panel-container--playlist");let f=document.createElement("div");f.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let g=Ge(e,t);f.append(w,g);let k=lt(),S=document.createElement("div");return S.className="btfw-panel-container__host btfw-panel-playlist__queue",a.append(f,k,S),a}a.classList.add("btfw-panel-container--dock-only");let r=document.createElement("div");return r.className="btfw-panel-container__dock-only",r.appendChild(Ge(e,t)),a.appendChild(r),a}function De(){O&&(clearTimeout(O),O=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{L(e)}),Le(),q=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function He(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||De()}function dt(){He(!1)}function ut(){Te();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||He(!e.classList.contains("open"))}function Ke(e){O&&clearTimeout(O),O=setTimeout(()=>{O=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),q===e&&(q=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function $e(e,t){if(t&&(O&&(clearTimeout(O),O=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),q=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(Fe(n),_e(n))}}function ft(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{q&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),De()))}))}function Xe(e,t){var a;if(!((a=document.getElementById("btfw-panel-bar"))!=null&&a.classList.contains("open")))return;if(O&&(clearTimeout(O),O=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),q===e&&(q=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(r=>{r!==t&&delete r.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",$e(e,t)}function mt(e,t){let n=e.querySelector(".btfw-panel-container"),a=()=>{var r;(r=document.getElementById("btfw-panel-bar"))!=null&&r.classList.contains("open")&&(O&&(clearTimeout(O),O=null),$e(t,e))};e.addEventListener("mouseenter",a),e.addEventListener("focusin",a),e.addEventListener("click",r=>{r.target.closest(".btfw-panel-container")||(r.preventDefault(),r.stopPropagation(),Xe(t,e))}),e.addEventListener("keydown",r=>{r.key!=="Enter"&&r.key!==" "||(r.preventDefault(),Xe(t,e))}),e.addEventListener("mouseleave",r=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(r.relatedTarget)||Ke(t))}),n==null||n.addEventListener("mouseenter",()=>{O&&(clearTimeout(O),O=null)}),n==null||n.addEventListener("mouseleave",r=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(r.relatedTarget)||Ke(t))})}function ze(){let e=Te();d();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((g,k)=>(H[g.dataset.bind]||99)-(H[k.dataset.bind]||99)),a=n.map(g=>g.dataset.bind).join("|"),r=document.getElementById("btfw-panels-menu-btn");if(r&&(r.hidden=n.length===0,n.length===0)){G="",dt();return}if(a===G&&t.childElementCount===n.length)return;G=a;let f=t.classList.contains("open"),w=q;if(De(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((g,k)=>{let S=g.dataset.bind,U=l[S]||{short:"?",title:S},ue=document.createElement("div");ue.className="btfw-panel-btn",ue.dataset.group=S,ue.title=U.title,ue.setAttribute("role","button"),ue.setAttribute("aria-label",U.title),ue.tabIndex=0;let V=document.createElement("span");V.className="btfw-panel-btn__label",V.textContent=_[S]||U.short,ue.appendChild(V),ue.appendChild(ct(S,U,k)),t.appendChild(ue),mt(ue,S)}),f&&(He(!0),w&&n.some(k=>k.dataset.bind===w))){let k=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);k&&$e(w,k)}}function We(e,t,n={}){if(!e)return;let a=!!t,r=n.persist===!1,f=e.dataset.bind,w=i[f];e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let g=e.querySelector(".btfw-stack-dock-btn");g&&(g.setAttribute("aria-pressed",a?"true":"false"),g.title=a?"Pinned to panels menu":"Dock to panels menu"),a?B(e)?L(e):q===f&&(q=null):(L(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!r&&w&&h(w,a),ze(),J()}function Qe(e,t){var k;let n=i[t];if(!n)return;let a=e.querySelector(".btfw-stack-item__header"),r=a==null?void 0:a.querySelector(".btfw-stack-header-toolbar"),f=r==null?void 0:r.querySelector(".btfw-stack-arrows");if(!f||f.querySelector(".btfw-stack-dock-btn"))return;let w=m(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let g=document.createElement("button");g.type="button",g.className="btfw-arrow btfw-stack-dock-btn",g.textContent="\u2AF7",g.setAttribute("aria-label",`Dock ${((k=l[t])==null?void 0:k.title)||t} to panels menu`),g.setAttribute("aria-pressed",w?"true":"false"),g.title=w?"Pinned to panels menu":"Dock to panels menu",g.addEventListener("click",S=>{S.preventDefault(),S.stopPropagation(),e.dataset.docked!=="true"&&We(e,!0)}),f.insertBefore(g,f.firstChild)}function qt(){return he(p)}function Ft(e){ce(p,e)}function Dt(){return he(o)}function Ht(e){ce(o,e)}function pt(e,t={}){let{storageKey:n,getDefaultOpen:a,toggleClass:r,ariaLabel:f="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:g="Show panel"}=t,k=he(n),S=typeof a=="function"?a(k):k!==null?k:!0;e.hasAttribute("data-open")||(e.dataset.open=S?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let U=e.querySelector(".btfw-stack-item__header"),ue=U&&U.querySelector(".btfw-stack-arrows");if(!ue||ue.querySelector(`.${r}`))return;let V=document.createElement("button");V.type="button",V.className=`btfw-arrow ${r}`,V.setAttribute("aria-label",f),V.style.display="flex",V.style.alignItems="center",V.style.justifyContent="center";let ee=()=>{let ye=e.dataset.open!=="false";V.textContent=ye?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",V.title=ye?w:g,V.setAttribute("aria-expanded",ye?"true":"false"),e.classList.toggle("is-open",ye)},F=(ye,Pe={})=>{let se=!!ye,xe=Pe.persist===!1;xe&&(e._btfwSuppressPersist=!0),e.dataset.open=se?"true":"false",ee(),xe||ce(n,se),xe&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};V.addEventListener("click",ye=>{ye.preventDefault(),ye.stopPropagation(),F(e.dataset.open==="false")}),ee(),new MutationObserver(ye=>{for(let Pe of ye)Pe.type==="attributes"&&(ee(),e._btfwSuppressPersist||ce(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),ue.insertBefore(V,ue.firstChild),e._btfwSetOpenState=F,Qe(e,e.dataset.bind)}function Be(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function je(e){be();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(a){let r=a.querySelector(".btfw-group-body");r&&!r.contains(t)&&r.appendChild(t)}else{let r=R.find(f=>f.id==="motd-group");if(!r)return;a=I(r,[t]),a&&(n.appendChild(a),N(n))}bt(a)}function bt(e){let t=document.getElementById("motdwrap");if(!t)return;let n=E();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let a=P();a&&a.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let a=he(Q),r=Ae(a,!0);e._btfwSetOpenState?e._btfwSetOpenState(r,{persist:!1}):(e.dataset.open=r?"true":"false",e.classList.toggle("is-open",r))}}function Ue(e){oe&&clearTimeout(oe),oe=setTimeout(()=>{oe=null,je(e)},50)}function ht(e){let t=P();t&&(X||(X=!0,new MutationObserver(()=>{Ue(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function yt(e){Ee||!window.socket||!window.socket.on||(Ee=!0,window.socket.on("setMotd",t=>{let n=typeof t=="string"?t:t&&typeof t.motd=="string"?t.motd:null,a=P();if(a){let r=n!==null?n:a.innerHTML,f=Ie(r);a.innerHTML!==f&&(a.innerHTML=f)}Ue(e)}))}function Ze(e){let t=le(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let a=be(!0),r=(a==null?void 0:a.motd)||P();r&&typeof e=="string"&&(r.innerHTML=Ie(e));let f=document.getElementById("cs-motdtext");f&&typeof e=="string"&&(f.value=e),t&&Ue(t)}function Ve(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,a=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||a==="video")return;Be(),Ye();let r=e&&e.list;if(!r)return;let f=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!f){let k=R.find(S=>S.id==="poll-group");if(!k)return;f=I(k,[t]),f&&(r.appendChild(f),N(r));return}let w=f.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&g.contains(t)&&w&&w.appendChild(t)}function Je(e,t={}){Ve(e),Re();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Oe(e,t={}){z&&clearTimeout(z),z=setTimeout(()=>{z=null,Je(e,t)},50)}function gt(e){if($)return;let t=document.getElementById("pollwrap");if(!t)return;$=!0,new MutationObserver(()=>{Oe(e,{forceOpen:Me()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let a=document.getElementById("newpollbtn");a&&!a.dataset.btfwPollSync&&(a.dataset.btfwPollSync="1",a.addEventListener("click",()=>{Oe(e,{forceOpen:!0})}))}function wt(e){ne||!window.socket||!window.socket.on||(ne=!0,window.socket.on("newPoll",()=>Oe(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Oe(e)))}function vt(e){return!!e.closest('.modal, [role="dialog"]')}function et(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(a=>!vt(a));n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function tt(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let a=n.querySelector(".btfw-stack-header-actions");if(!a){a=document.createElement("span"),a.className="btfw-stack-header-actions";let r=n.querySelector(".btfw-stack-header-toolbar"),f=(r==null?void 0:r.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");r&&f?r.insertBefore(a,f):f?n.insertBefore(a,f):n.appendChild(a)}return a}function nt(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Re(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Me();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function ot(){let e=tt("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){nt(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let r=document.querySelector("#pollwrap > .poll-controls");r&&r.children.length===0&&r.remove()}let n=tt("motd-group"),a=document.getElementById("btfw-motd-editbtn");if(n&&a){nt(a,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),a.parentElement!==n&&n.appendChild(a);let r=a.closest(".btfw-motd-editrow");r&&r.parentElement&&r.remove()}}function Ye(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(a=>{let r=t.querySelector(".poll-controls");r||(r=document.createElement("div"),r.className="poll-controls",t.insertBefore(r,t.firstChild)),a.parentElement!==r&&r.appendChild(a)}),e.children.length===0&&e.remove())}function Et(e){return R.every(t=>t.selectors.some(a=>{var f,w;if(W.includes(a))return!1;let r=document.querySelector(a);if(!r||e.contains(r)||r.contains(e))return!1;if(a==="#pollwrap"){let g=(f=r.dataset)==null?void 0:f.btfwPollOverlay,k=(w=r.getAttribute)==null?void 0:w.call(r,"data-btfw-poll-overlay");if(g==="video"||k==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function qe(e){if(!de){de=!0;try{let t=e.list,n=e.footer;if(Et(t)&&t.children.length>0){je(e),Ve(e),Re(),ot(),et(n);return}Ye(),Be();let a=new Map;R.forEach(w=>{let g=[];w.selectors.forEach(k=>{let S=document.querySelector(k);if(S&&!(t.contains(S)||S.contains(t))&&!W.includes(k)){if(k==="#pollwrap"){let U=S.dataset&&S.dataset.btfwPollOverlay,ue=S.getAttribute&&S.getAttribute("data-btfw-poll-overlay");if(U==="video"||ue==="video")return}g.push(S)}}),g.length>0&&a.set(w.id,{group:w,elements:g})});let r=j(),f=[];a.forEach(({group:w,elements:g},k)=>{if(!Array.from(t.children).find(U=>U.dataset.bind===k))try{let U=I(w,g);U&&f.push({item:U,id:k,priority:w.priority,isGroup:!0})}catch(U){console.warn("[stack] Failed to create group item:",k,U)}}),r.length>0?f.sort((w,g)=>{let k=r.findIndex(U=>U.id===w.id),S=r.findIndex(U=>U.id===g.id);return k>=0&&S>=0?k-S:k>=0?-1:S>=0?1:w.priority-g.priority}):f.sort((w,g)=>w.priority-g.priority),f.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(g){console.warn("[stack] Failed to add item to list:",g)}}),N(t),je(e),Ve(e),Re(),ot(),et(n)}finally{de=!1}}}function it(){let e=le();if(!e||(qe(e),ht(e),yt(e),gt(e),wt(e),Se))return;Se=!0;let t=new MutationObserver(()=>{we||(we=requestAnimationFrame(()=>{we=null,qe(e)}))}),n=document.getElementById("btfw-leftpad"),a=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),a&&t.observe(a,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&v(w,Q,S=>Ae(S,E()));let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&v(g,p,S=>S!==null?!!S:!0);let k=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');k&&v(k,o,S=>Ae(S,Me())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(S=>{let U=i[S.dataset.bind];U&&We(S,m(U),{persist:!1})}),Te(),d(),ze(),Je(e),J()},1e3);let r=0,f=setInterval(()=>{qe(e),++r>2&&clearInterval(f)},700)}return document.addEventListener("btfw:layoutReady",it),document.addEventListener("btfw:chat:barsReady",()=>{Te(),d(),ze()}),setTimeout(it,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=le();e&&setTimeout(()=>qe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Ze(t)}),{name:"feature:stack",hasMotdContent:E,resolveMotdHost:P,normalizeMotdStructure:be,applyMotdUpdate:Ze}});BTFW.define("feature:videoOverlay",[],async()=>{let T=(s,d=document)=>d.querySelector(s),M=["#mediarefresh","#voteskip","#fullscreenbtn"],Y={localSubs:"btfw:video:localsubs"},y=5,Q={owner:["chanowner","owner","founder","admin","administrator"]};function p(){var s;try{return((s=window.PLAYER)==null?void 0:s.mediaType)||null}catch(d){return null}}function o(){let s=(p()||"").toLowerCase();return s==="fi"||s==="gd"}function i(){try{return window.CLIENT||window.client||null}catch(s){return null}}function b(){try{return window.CHANNEL||window.channel||null}catch(s){return null}}function l(){let s=b();if(s&&typeof s.perms=="object"&&s.perms)return s.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(d){return{}}}function _(s=[]){let d=l();for(let C of s){let A=d==null?void 0:d[C];if(typeof A=="number")return A}}function H(){let s=_(Q.owner);return typeof s=="number"?s:y}function K(s){if(!s)return!1;try{if(typeof s.hasPermission=="function"&&s.hasPermission("chanowner"))return!0}catch(d){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(d){}return!1}function q(){let s=i();if(!s)return!1;let d=Number(s.rank);return Number.isFinite(d)?!!(d>=H()||K(s)):!1}let G=()=>{try{return localStorage.getItem(Y.localSubs)!=="0"}catch(s){return!0}},O=s=>{try{localStorage.setItem(Y.localSubs,s?"1":"0")}catch(d){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!s}}))},D=0,Z=0,re=0,z=2e3,$=8e3,ne=45e3,oe=12e4,X=$,Ee=!1,de=null;function we(){if(T("#btfw-vo-css"))return;let s=document.createElement("style");s.id="btfw-vo-css",s.textContent=`
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
    `,document.head.appendChild(s)}function Se(s){let d=T("#videowrap");!d||!s||((s.parentElement!==d.parentElement||s.previousElementSibling!==d)&&d.insertAdjacentElement("afterend",s),s.classList.add("btfw-vo-visible"))}function fe(){if(!T("#videowrap"))return null;let d=T("#btfw-video-overlay");d||(d=document.createElement("div"),d.id="btfw-video-overlay",d.setAttribute("data-testid","btfw-video-overlay")),d.classList.add("btfw-video-overlay"),d.getAttribute("data-testid")||d.setAttribute("data-testid","btfw-video-overlay"),Se(d);let C=d.querySelector("#btfw-vo-bar");C||(C=document.createElement("div"),C.className="btfw-vo-bar",C.id="btfw-vo-bar",d.appendChild(C));let A=P(d,C);return J(A.left),c(A),I(A),E(d),d}function E(s){s&&s.querySelectorAll("button").forEach(d=>{d.classList.contains("btfw-vo-btn")||d.classList.add("btfw-vo-btn")})}function P(s,d){let C="btfw-vo-left",A="btfw-vo-right",te=d.querySelector(`#${C}`);te||(te=document.createElement("div"),te.id=C,te.className="btfw-vo-section btfw-vo-section--left",d.insertBefore(te,d.firstChild));let ae=d.querySelector(`#${A}`);return ae||(ae=document.createElement("div"),ae.id=A,ae.className="btfw-vo-section btfw-vo-section--right",d.appendChild(ae)),Array.from(d.children).forEach(ve=>{ve===te||ve===ae||ae.appendChild(ve)}),s.dataset.leftSection=`#${C}`,s.dataset.rightSection=`#${A}`,d.dataset.leftSection=`#${C}`,d.dataset.rightSection=`#${A}`,{left:te,right:ae}}function R(){return document.querySelector("#ytapiplayer video, video")}function W(s=R()){return s?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof s.webkitShowPlaybackTargetPicker=="function":!1}function me(){if(!de)return;let s=de._btfwAirplayHandler;if(s){try{de.removeEventListener("webkitplaybacktargetavailabilitychanged",s)}catch(d){}delete de._btfwAirplayHandler}de=null}function pe(s){if(!s||typeof s.addEventListener!="function"){me();return}if(de===s)return;me();let d=C=>{let A=!C||C.availability==="available",te=T("#btfw-airplay");te&&(te.style.display=A?"":"none")};try{s.addEventListener("webkitplaybacktargetavailabilitychanged",d),s._btfwAirplayHandler=d,de=s}catch(C){}}function le(){let s=T("#btfw-airplay");if(!s)return;let d=R();if(!W(d)){s.style.display="none",me();return}s.style.display="",pe(d)}function be(s,d){d&&d.classList.add("btfw-vo-visible")}function c(s){if(!(s!=null&&s.right)||!(s!=null&&s.left))return;let d=[];document.querySelector("#fullscreenbtn")||d.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:he,section:"right"}),d.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:h,section:"right"}),d.forEach(C=>{let A=document.querySelector(`#${C.id}`),te=C.section==="left"?s.left:s.right;if(A)te&&A.parentElement!==te&&te.appendChild(A);else{A=document.createElement("button"),A.id=C.id,A.className="btfw-vo-btn";let ae=document.createElement("i");ae.className=C.icon,A.appendChild(ae),A.title=C.tooltip,A.addEventListener("click",C.action),(te||s.right).appendChild(A)}}),le()}function I(s){let d=s==null?void 0:s.right;d&&M.forEach(C=>{let A=document.querySelector(C);if(!A)return;if(A.dataset.btfwOverlay==="1"){A.parentElement!==d&&d.appendChild(A);return}let te=document.createElement("span");te.hidden=!0,te.setAttribute("data-btfw-ph",C);try{A.insertAdjacentElement("afterend",te)}catch(ae){}if(A.classList.add("btfw-vo-adopted"),A.dataset.btfwOverlay="1",A.id==="mediarefresh"){let ae=A.onclick;A.onclick=ve=>{ve.preventDefault();let Le=!!(ve&&ve.isTrusted);j(()=>{if(typeof ae=="function")try{return ae.call(A,ve),!0}catch(_e){console.warn("[video-overlay] native refresh handler failed:",_e)}return!1},{isUserAction:Le})}}d.appendChild(A)})}function N(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(s){console.warn("[video-overlay] Media refresh failed:",s)}return!1}function j(s,d={}){let{isUserAction:C=!1}=d,A=Date.now();if(re&&A-re>oe&&(X=$,D=0),A<Z){let _e=Math.ceil((Z-A)/1e3);return x(C?`Refresh available in ${_e}s`:`Auto refresh paused. Next attempt in ${_e}s`,"warning"),!1}let te=C?z:X;if(re&&A-re<te){let _e=te-(A-re),Ne=Math.ceil(_e/1e3);return Z=A+_e,x(C?`Refresh available in ${Ne}s`:`Auto refresh paused. Next attempt in ${Ne}s`,"warning"),!1}if(D++,D>=10)return Z=A+3e4,D=0,x("Refresh limit reached. 30s cooldown active.","error"),!1;let ae=C?6e3:Math.max(12e3,X+2e3);setTimeout(()=>{D>0&&D--},ae);let ve=!1;if(typeof s=="function")try{ve=s()===!0}catch(_e){console.warn("[video-overlay] Refresh handler error:",_e)}return ve||(ve=N()),re=Date.now(),C?X=$:X=Math.min(ne,Math.max($,Math.round(X*(ve?1.25:1.5)))),Z=Math.max(Z,re+(C?z:X)),!C&&ve?x(`Auto refresh sent. Next attempt in ${Math.ceil(X/1e3)}s`,"info"):x(ve?"Media refreshed":"Unable to refresh media",ve?"success":"error"),ve}function he(){let s=T("#videowrap");s&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen())}function ce(s,d=!0){if(!s||!W(s))return!1;if(s.setAttribute("airplay","allow"),s.setAttribute("x-webkit-airplay","allow"),d&&typeof s.webkitShowPlaybackTargetPicker=="function")try{s.webkitShowPlaybackTargetPicker()}catch(C){console.warn("[video-overlay] AirPlay picker failed:",C)}return le(),!0}function m(){if(!(Ee||!window.socket)){Ee=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let s=R();s&&(ce(s,!1),pe(s)),le()},1e3)})}catch(s){console.warn("[video-overlay] Failed to attach AirPlay listener:",s)}}}function h(){let s=R();return W(s)?ce(s)?(x("AirPlay enabled","success"),m(),!0):(x("AirPlay not available","warning"),!1):(le(),x("AirPlay not available","warning"),!1)}function x(s,d="info"){let C=document.getElementById("btfw-notification");C||(C=document.createElement("div"),C.id="btfw-notification",C.className="btfw-notification",document.body.appendChild(C)),C.textContent=s,C.className=`btfw-notification btfw-notification--${d} btfw-notification--show`,clearTimeout(C._hideTimer),C._hideTimer=setTimeout(()=>{C.classList.remove("btfw-notification--show")},3e3)}function B(){return T("video")}function ie(s){let d=(s||"").replace(/\r\n/g,`
`).trim()+`
`;return d=d.replace(/^\d+\s*$\n/gm,""),d=d.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),d=d.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+d}async function u(){let s=B();if(!s){v("Local subs only for HTML5 sources.");return}let d=document.createElement("input");d.type="file",d.accept=".vtt,.srt,text/vtt,text/plain",d.style.display="none",document.body.appendChild(d);let C=new Promise(A=>{d.addEventListener("change",async()=>{let te=d.files&&d.files[0];if(document.body.removeChild(d),!te)return A(!1);try{let ae=await te.text(),Le=(te.name.split(".").pop()||"").toLowerCase()==="srt"?ie(ae):ae.startsWith("WEBVTT")?ae:`WEBVTT

`+ae,_e=URL.createObjectURL(new Blob([Le],{type:"text/vtt"}));L(s,_e,te.name.replace(/\.[^.]+$/,"")||"Local"),v("Subtitles loaded."),A(!0)}catch(ae){console.error(ae),v("Failed to load subtitles."),A(!1)}},{once:!0})});d.click(),await C}function L(s,d,C){var te;(te=T('track[data-btfw="1"]',s))==null||te.remove();let A=document.createElement("track");A.kind="subtitles",A.label=C||"Local",A.srclang="en",A.src=d,A.default=!0,A.setAttribute("data-btfw","1"),s.appendChild(A);try{for(let ae of s.textTracks)ae.mode=ae.label===A.label?"showing":"disabled"}catch(ae){}}function v(s){let d=T("#btfw-mini-toast");d||(d=document.createElement("div"),d.id="btfw-mini-toast",document.body.appendChild(d)),d.textContent=s,d.style.opacity="1",clearTimeout(d._hid),d._hid=setTimeout(()=>d.style.opacity="0",1400)}function J(s){if(!s)return;let d=document.querySelector("#btfw-vo-subs");if(!d){d=document.createElement("button"),d.id="btfw-vo-subs",d.className="btfw-vo-btn",d.title="Load local subtitles (.vtt/.srt)";let A=document.createElement("i");A.className="fa fa-closed-captioning",d.appendChild(A),d.addEventListener("click",te=>{te.preventDefault(),u()}),s.insertBefore(d,s.firstChild||null)}let C=G()&&o();d.style.display=C?"":"none"}function Te(){we(),fe();let s=[T("#videowrap"),T("#rightcontrols"),T("#leftcontrols"),document.body].filter(Boolean),d=new MutationObserver(()=>fe());s.forEach(C=>d.observe(C,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>fe());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>fe(),0)})}catch(C){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te(),{name:"feature:videoOverlay",setLocalSubsEnabled:O,toggleFullscreen:he,enableAirplay:h}});(function(){"use strict";let y="https://vidprox.movies-storage-a.workers.dev/?url=";function Q(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function p(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var i,b,l;let o=typeof window!="undefined"&&(((i=window.BTFW_CONFIG)==null?void 0:i.corsVideoProxy)||((l=(b=window.BTFW_CONFIG)==null?void 0:b.integrations)==null?void 0:l.corsVideoProxy));if(typeof o=="string"&&o.trim()){let _=o.trim();if(_.includes("?"))return _;let H=_.endsWith("/")?"":"/";return`${_}${H}?url=`}return y},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(o){try{return new URL(y).origin.toLowerCase()}catch(i){return""}}},_isTrusted(o){if(!o)return!1;if(String(o).includes(this.CORS_PROXY))return!0;try{let i=new URL(o),b=i.origin.toLowerCase(),l=this._getCorsProxyOrigin();return l&&b===l?!0:/^vidprox\./i.test(i.hostname)}catch(i){return!1}},_unwrapProxiedUrl(o){if(!o||!this._isTrusted(o))return o;try{return new URL(o).searchParams.get("url")||o}catch(i){return o}},_markInternalSrcSet(){this._lastInternalSrcSetAt=p()},_isInsideInternalWindow(){return p()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let o=this._getMediaElement();return o?o.crossOrigin==="anonymous"||o.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var i,b,l,_;if(this._hasAnonymousCrossOrigin())return!1;let o=((b=(i=this.player)==null?void 0:i.currentSrc)==null?void 0:b.call(i))||((l=this._getMediaElement())==null?void 0:l.currentSrc)||"";if(o&&!this._isTrusted(o))return!1;try{return(_=this.player)==null||_.crossOrigin("anonymous"),!0}catch(H){return!1}},_clearMediaElementForCorsSwap(){let o=this._getMediaElement();if(o)try{for(o.removeAttribute("src"),o.removeAttribute("crossorigin");o.firstChild;)o.removeChild(o.firstChild);o.load()}catch(i){}},_same(o,i){return String(o||"")===String(i||"")},_getMediaElement(){var b;let o=(b=this.player)==null?void 0:b.tech_;if(o){try{let l=typeof o.el=="function"?o.el():null;if(l instanceof HTMLMediaElement&&l.isConnected)return l}catch(l){}if(o.el_ instanceof HTMLMediaElement&&o.el_.isConnected)return o.el_}let i=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return i instanceof HTMLMediaElement&&i.isConnected?i:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(o){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(o){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(o){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(o){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(o){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(o){}this.mergerNode=null}},resetMediaBinding(){var i,b;this.disconnectChain();let o=this._getMediaElement();if(o&&this._syncFromRegistry(o)){((i=this.audioContext)==null?void 0:i.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((b=this.audioContext)==null?void 0:b.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(o){var K;let i=(K=this.player)==null?void 0:K.tech_;if(!(i!=null&&i.el_)||i.el_!==o)return null;let b=o.parentNode;if(!b)return null;let l=o.tagName.toLowerCase()==="audio"?"audio":"video",_=document.createElement(l);_.className=o.className,o.id&&(_.id=o.id),_.setAttribute("playsinline",""),_.setAttribute("webkit-playsinline",""),_.classList.contains("vjs-tech")||_.classList.add("vjs-tech");let H=o.crossOrigin||o.getAttribute("crossorigin");return H&&(_.crossOrigin=H,_.setAttribute("crossorigin",H)),b.replaceChild(_,o),i.el_=_,delete o.__btfwSourceNode,_},_syncFromRegistry(o){let i=Q().get(o)||o.__btfwSourceNode||null;return i?(Q().set(o,i),this.sourceNode=i,this._sourceMediaElement=o,i.context&&i.context.state!=="closed"&&(this.audioContext=i.context),i):null},_getOrCreateSourceNode(o){var _;let i=Q(),b=i.get(o)||o.__btfwSourceNode||null;if(b)return i.set(o,b),this.sourceNode=b,this._sourceMediaElement=o,b.context&&b.context.state!=="closed"&&(this.audioContext=b.context),b;if(this.sourceNode&&this._sourceMediaElement===o)return i.set(o,this.sourceNode),o.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let l;try{l=this.audioContext.createMediaElementSource(o)}catch(H){if((H==null?void 0:H.name)!=="InvalidStateError")throw H;let K=this._syncFromRegistry(o);if(K)return K;let q=this._swapVideoTechElement(o);if(!q)throw H;let G=(_=this.player)==null?void 0:_.currentSrc();if(G&&this.player){this._markInternalSrcSet(),this.player.src({src:G,type:"video/mp4"});try{this.player.load()}catch(O){}}return this._getOrCreateSourceNode(q)}return i.set(o,l),o.__btfwSourceNode=l,this.sourceNode=l,this._sourceMediaElement=o,l},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(o){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(o){return!1}},_clearCrossOriginAttribute(){var i,b;let o=this._getMediaElement();if(o)try{o.crossOrigin=null,o.removeAttribute("crossorigin")}catch(l){}try{(b=(i=this.player)==null?void 0:i.crossOrigin)==null||b.call(i,null)}catch(l){}},cleanup(){this.disconnectChain();let o=this._getMediaElement();o&&(o.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){var i,b;this.cleanup();let o=((b=(i=this.player)==null?void 0:i.currentSrc)==null?void 0:b.call(i))||"";return this.sourceNode&&o&&!this._isTrusted(o)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(o,{currentTime:i=0,wasPlaying:b=!1,clearCrossOrigin:l=!1}={}){if(!this.player||!o)return Promise.resolve(!1);try{this.player.pause()}catch(_){}l&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(_){}return new Promise(_=>{let H=!1,K=()=>{if(H)return;H=!0;try{this.player.off("canplay",q)}catch(O){}try{this.player.off("loadeddata",q)}catch(O){}try{this.player.currentTime(i)}catch(O){}let G=b?this.player.play():Promise.resolve();Promise.resolve(G).catch(()=>{}).finally(()=>_(!0))},q=()=>K();try{this.player.one("canplay",q)}catch(G){try{this.player.on("canplay",q)}catch(O){}}try{this.player.one("loadeddata",q)}catch(G){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&K()}catch(G){}}),setTimeout(K,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let i=new MutationObserver(()=>{this._checkAndReapply("sources")});i.observe(o,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=i}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([i,b])=>{this.player.on(i,b)})}catch(i){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this.player.currentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;if(this._stopWatchdogInterval(),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(i){}try{(o=this._mutationObserver._sourceObserver)==null||o.disconnect()}catch(i){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([i,b])=>{this.player.off(i,b)})}catch(i){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(o){if(!this.player)return;let i=this.player.currentSrc();if(i&&(this._lastKnownSrc=i,!this._isInsideInternalWindow())){if(this._isTrusted(i)){this.isProxied=!0,this.proxiedSrc=i,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(i)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(p()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=p(),this._forceProxyPreservingState(i)}}},async _forceProxyPreservingState(o){if(!this.player)return!1;let i=this.player.currentTime(),b=!this.player.paused();if(this._isTrusted(o))return this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(o)||o,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(l){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(l){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(l){}return new Promise(l=>{let _=!1,H=()=>{if(!_){_=!0;try{this.player.off("canplay",K)}catch(q){}try{this.player.off("loadeddata",K)}catch(q){}try{this.player.currentTime(i)}catch(q){}this.isProxied=!0,b&&this.player.play().catch(()=>{}),l(!0)}},K=()=>H();try{this.player.one("canplay",K)}catch(q){try{this.player.on("canplay",K)}catch(G){}}try{this.player.one("loadeddata",K)}catch(q){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&H()}catch(q){}}),setTimeout(H,5e3)})},async ensureProxy(){if(!this.player)return!1;let o=this.player.currentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let i=this.player.currentTime(),b=!this.player.paused();try{this.player.pause()}catch(l){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(l){}return new Promise(l=>{this.player.ready(()=>{try{this.player.currentTime(i)}catch(_){}b&&this.player.play().catch(()=>{}),l(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var i;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let b=this.player.currentSrc();if(this._isTrusted(b))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this.player.currentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let o=this._getMediaElement();if(!o)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((i=this.audioContext)==null?void 0:i.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),o.disableRemotePlayback=!0;let l=this._getOrCreateSourceNode(o);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let _=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(_.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(_.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(_.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(_.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(_.release,this.audioContext.currentTime),l.connect(this.compressorNode),l=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),l.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),l=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,l.connect(this.gainNode),l=this.gainNode),l.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(b){return console.error("[BTFW_AUDIO] Error building audio chain:",b),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(o){return this.NORM_PRESETS[o]?(this.currentNormPreset=o,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(o){return this.BOOST_MULTIPLIER=o,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()}}})();(function(){"use strict";let T=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),M=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),Y="--btfw-boost-anchor",y="--btfw-norm-anchor";function Q(o,i,b){if(M&&b){i.style.setProperty("anchor-name",b),o.style.setProperty("position-anchor",b),o.style.setProperty("top","anchor(bottom)"),o.style.setProperty("left","anchor(left)");return}let l=i.getBoundingClientRect();o.style.left=l.left+"px",o.style.top=l.bottom+"px"}function p(o){window.BTFW&&typeof BTFW.define=="function"?o():setTimeout(()=>p(o),0)}p(function(){BTFW.define("feature:audio",[],async()=>{let o=(u,L=document)=>L.querySelector(u),i=window.BTFW_AUDIO,b=null,l=null,_=null,H=!1,K=!1,q=!1,G=null,O=null,D=null,Z=null,re=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function z(u){b&&(u?(b.classList.add("active"),b.style.background="rgba(46, 213, 115, 0.3)",b.style.borderColor="#2ed573",b.style.color="#2ed573",b.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(b.classList.remove("active"),b.style.background="",b.style.borderColor="",b.style.color="",b.style.boxShadow=""))}function $(u,L="info"){let v=o("#btfw-audioboost-toast");v||(v=document.createElement("div"),v.id="btfw-audioboost-toast",v.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${L==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function ne(){if(await i.enableBoost()){H=!0;let L=Math.round(i.BOOST_MULTIPLIER*100);$(`Boosted by ${L}%`,"success"),z(!0)}else{let L=i._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";$(L,"error")}}async function oe(){await i.disableBoost(),H=!1,z(!1)}function X(u){l&&(u?(l.classList.add("active"),l.style.background="rgba(52, 152, 219, 0.3)",l.style.borderColor="#3498db",l.style.color="#3498db",l.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(l.classList.remove("active"),l.style.background="",l.style.borderColor="",l.style.color="",l.style.boxShadow=""))}function Ee(u,L="info"){let v=o("#btfw-audionorm-toast");v||(v=document.createElement("div"),v.id="btfw-audionorm-toast",v.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${L==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function de(){if(await i.enableNormalization())K=!0,Ee("Normalization enabled","success"),X(!0);else{let L=i._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";Ee(L,"error")}}async function we(){await i.disableNormalization(),K=!1,X(!1)}function Se(u){_&&(u?(_.classList.add("active"),_.style.background="rgba(155, 89, 182, 0.3)",_.style.borderColor="#9b59b6",_.style.color="#9b59b6",_.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(_.classList.remove("active"),_.style.background="",_.style.borderColor="",_.style.color="",_.style.boxShadow=""))}function fe(u,L="info"){let v=o("#btfw-mono-toast");v||(v=document.createElement("div"),v.id="btfw-mono-toast",v.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${L==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function E(){if(await i.enableMono())q=!0,fe("Stereo audio enabled","success"),Se(!0);else{let L=i._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";fe(L,"error")}}async function P(){await i.disableMono(),q=!1,Se(!1)}function R(){let u=document.createElement("button");u.id="btfw-vo-audioboost",u.className="btn btn-sm btn-default btfw-vo-adopted";let L=Math.round(i.BOOST_MULTIPLIER*100);u.title=`Toggle Audio Boost (${L}%)`,u.setAttribute("data-btfw-overlay","1");let v=document.createElement("i");return v.className="fa-solid fa-megaphone",u.appendChild(v),u.addEventListener("click",()=>{i.boostEnabled?oe():ne()}),u.addEventListener("mouseenter",()=>{D&&(clearTimeout(D),D=null),le()}),u.addEventListener("mouseleave",()=>{D=setTimeout(()=>be(),150)}),u}function W(){let u=document.createElement("button");u.id="btfw-vo-audionorm",u.className="btn btn-sm btn-default btfw-vo-adopted";let L=i.NORM_PRESETS[i.currentNormPreset].label;u.title=`Toggle Audio Normalization (${L})`,u.setAttribute("data-btfw-overlay","1");let v=document.createElement("i");return v.className="fa-solid fa-waveform-lines",u.appendChild(v),u.addEventListener("click",()=>{i.normalizationEnabled?we():de()}),u.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null),N()}),u.addEventListener("mouseleave",()=>{Z=setTimeout(()=>j(),150)}),u}function me(){let u=document.createElement("button");u.id="btfw-vo-mono",u.className="btn btn-sm btn-default btfw-vo-adopted",u.title="Toggle Mono Audio (mix both channels to stereo)",u.setAttribute("data-btfw-overlay","1");let L=document.createElement("i");return L.className="fa-solid fa-headphones",u.appendChild(L),u.addEventListener("click",()=>{i.monoEnabled?P():E()}),u}function pe(){if(G)return G;let u=document.createElement("div");return u.id="btfw-boost-context-menu",T&&(u.popover="auto"),u.style.cssText=`
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
          ${T?"":"display: none;"}
        `,re.forEach(L=>{let v=document.createElement("button");v.className="btfw-context-item",v.textContent=L.label,v.style.cssText=`
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
          `,i.BOOST_MULTIPLIER===L.multiplier&&(v.style.background="rgba(46, 213, 115, 0.2)",v.style.color="#2ed573"),v.addEventListener("mouseenter",()=>{i.BOOST_MULTIPLIER!==L.multiplier&&(v.style.background="rgba(109, 77, 246, 0.2)")}),v.addEventListener("mouseleave",()=>{i.BOOST_MULTIPLIER!==L.multiplier&&(v.style.background="transparent")}),v.addEventListener("click",async()=>{if(await i.setBoostMultiplier(L.multiplier),c(),b){let J=Math.round(L.multiplier*100);b.title=`Toggle Audio Boost (${J}%)`}i.boostEnabled&&$(`Boost set to ${L.label}`,"success")}),u.appendChild(v)}),u.addEventListener("mouseenter",()=>{D&&(clearTimeout(D),D=null)}),u.addEventListener("mouseleave",()=>{D=setTimeout(()=>be(),100)}),document.body.appendChild(u),G=u,u}function le(){if(!b)return;let u=pe();Q(u,b,Y),T?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function be(){G&&(T?G.matches(":popover-open")&&G.hidePopover():G.style.display="none")}function c(){if(!G)return;G.querySelectorAll(".btfw-context-item").forEach((L,v)=>{let J=re[v];i.BOOST_MULTIPLIER===J.multiplier?(L.style.background="rgba(46, 213, 115, 0.2)",L.style.color="#2ed573"):(L.style.background="transparent",L.style.color="#e0e0e0")})}function I(){if(O)return O;let u=document.createElement("div");return u.id="btfw-norm-context-menu",T&&(u.popover="auto"),u.style.cssText=`
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
          ${T?"":"display: none;"}
        `,Object.keys(i.NORM_PRESETS).forEach(L=>{let v=i.NORM_PRESETS[L],J=document.createElement("button");J.className="btfw-context-item",J.textContent=v.label,J.style.cssText=`
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
          `,i.currentNormPreset===L&&(J.style.background="rgba(52, 152, 219, 0.2)",J.style.color="#3498db"),J.addEventListener("mouseenter",()=>{i.currentNormPreset!==L&&(J.style.background="rgba(109, 77, 246, 0.2)")}),J.addEventListener("mouseleave",()=>{i.currentNormPreset!==L&&(J.style.background="transparent")}),J.addEventListener("click",async()=>{await i.setNormPreset(L),he(),l&&(l.title=`Toggle Audio Normalization (${v.label})`),i.normalizationEnabled&&Ee(`Preset: ${v.label}`,"success")}),u.appendChild(J)}),u.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null)}),u.addEventListener("mouseleave",()=>{Z=setTimeout(()=>j(),100)}),document.body.appendChild(u),O=u,u}function N(){if(!l)return;let u=I();Q(u,l,y),T?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function j(){O&&(T?O.matches(":popover-open")&&O.hidePopover():O.style.display="none")}function he(){if(!O)return;let u=O.querySelectorAll(".btfw-context-item");Object.keys(i.NORM_PRESETS).forEach((L,v)=>{let J=u[v];i.currentNormPreset===L?(J.style.background="rgba(52, 152, 219, 0.2)",J.style.color="#3498db"):(J.style.background="transparent",J.style.color="#e0e0e0")})}function ce(){let u=o("#btfw-vo-left");if(!u)return!1;let L=o("#btfw-vo-audioboost");L&&L.remove();let v=o("#btfw-vo-audionorm");v&&v.remove();let J=o("#btfw-vo-mono");return J&&J.remove(),b=R(),l=W(),_=me(),u.appendChild(b),u.appendChild(l),u.appendChild(_),!0}function m(u,L=20){let v=0,J=setInterval(()=>{v++,ce()?(clearInterval(J),u()):v>=L&&clearInterval(J)},500)}function h(){if(typeof videojs=="undefined"){setTimeout(h,500);return}if(!o("#ytapiplayer")){setTimeout(h,500);return}i.player=videojs("ytapiplayer"),i.originalSrc=i.player.currentSrc(),i.startWatchdog()}function x(){setTimeout(()=>{i.resetMediaBinding(),i.boostEnabled=!1,i.normalizationEnabled=!1,i.monoEnabled=!1,i.isProxied=!1,z(!1),X(!1),Se(!1),h(),H&&setTimeout(()=>{ne()},1200),K&&setTimeout(()=>{de()},1200),q&&setTimeout(()=>{E()},1200)},600)}function B(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>i._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>i._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",x))}function ie(){m(()=>{h()}),B()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ie):ie(),{name:"feature:audio",activate:ne,deactivate:oe,isActive:()=>i.boostEnabled,activateNormalization:de,deactivateNormalization:we,isNormalizationActive:()=>i.normalizationEnabled,activateMono:E,deactivateMono:P,isMonoActive:()=>i.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async o=>o.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:T})=>{let M=await T("util:tmdb-proxy"),Y="movie-info",y={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},Q="btfw-movie-info-style",p={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},o=0,i=!1,b=null;function l(m){typeof m=="function"&&p.cleanup.push(m)}function _(){for(;p.cleanup.length;){let m=p.cleanup.pop();try{m()}catch(h){}}p.header&&(p.header.remove(),p.header=null)}function H(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null),p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null),o=0,p.currentTitle="",p.isInitialized=!1,_()}function K(m){if(typeof m=="boolean")return m;if(typeof m=="number")return Number.isFinite(m)?m>0:!1;if(typeof m=="string"){let h=m.trim().toLowerCase();return h?h==="1"||h==="true"||h==="yes"||h==="on":!1}return!1}function q(){let m=[()=>{var h,x,B;return(B=(x=(h=window.BTFW_THEME_ADMIN)==null?void 0:h.integrations)==null?void 0:x.movieInfo)==null?void 0:B.enabled},()=>{var h,x,B;return(B=(x=(h=window.BTFW_CONFIG)==null?void 0:h.integrations)==null?void 0:x.movieInfo)==null?void 0:B.enabled},()=>{var h,x;return(x=(h=window.BTFW_CONFIG)==null?void 0:h.movieInfo)==null?void 0:x.enabled},()=>{var h;return(h=window.BTFW_CONFIG)==null?void 0:h.movieInfoEnabled},()=>{var h,x;return(x=(h=document==null?void 0:document.body)==null?void 0:h.dataset)==null?void 0:x.btfwMovieInfoEnabled}];for(let h of m)try{let x=typeof h=="function"?h():h;if(K(x))return!0}catch(x){}return!1}function G(){if(b||typeof MutationObserver!="function")return;let m=document.body;m&&(b=new MutationObserver(()=>re()),b.observe(m,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function O(){if(i)return;i=!0;let m=()=>re();document.addEventListener("btfw:channelIntegrationsChanged",m),document.addEventListener("btfw:ready",m)}function D(m=0){p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.initTimer=window.setTimeout(()=>{p.initTimer=null,q()&&Z()},Math.max(0,m))}function Z(){if(p.isInitialized)return;let m=document.querySelector(y.TOPBAR_SELECTOR);if(!m){D(500);return}try{z(m),he(),ne(),p.isInitialized=!0,setTimeout(()=>{E(),P()},120)}catch(h){D(800)}}function re(){q()?p.isInitialized?(E(),setTimeout(P,80)):D(0):H()}function z(m){if(!m&&(m=document.querySelector(y.TOPBAR_SELECTOR),!m))throw new Error("Chat topbar not found");let h=document.getElementById(y.CONTAINER_ID);h&&h.remove();let x=document.createElement("div");x.id=y.CONTAINER_ID,x.className="btfw-movie-header hide",x.dataset.module=Y,m.insertAdjacentElement("afterend",x),p.header=x}function $(){try{return window.socket||window.SOCKET||null}catch(m){return null}}function ne(){oe(),de();let m=j(E,250);window.addEventListener("resize",m),l(()=>window.removeEventListener("resize",m))}function oe(){X(),Ee()}function X(){let m=document.querySelector(y.TITLE_SELECTOR);if(m){let h=()=>Se(),x=()=>fe();m.addEventListener("mouseenter",h),m.addEventListener("mouseleave",x),l(()=>{m.removeEventListener("mouseenter",h),m.removeEventListener("mouseleave",x)})}else if(typeof MutationObserver=="function"){let h=new MutationObserver(()=>{document.querySelector(y.TITLE_SELECTOR)&&(h.disconnect(),X())});h.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),l(()=>{try{h.disconnect()}catch(x){}})}}function Ee(){let m=p.header;if(!m)return;let h=()=>we(),x=()=>fe();m.addEventListener("mouseenter",h),m.addEventListener("mouseleave",x),l(()=>{m.removeEventListener("mouseenter",h),m.removeEventListener("mouseleave",x)})}function de(){let m=$();if(m&&typeof m.on=="function"){m.on("changeMedia",P),l(()=>{var B,ie;try{(B=m.off)==null||B.call(m,"changeMedia",P)}catch(u){try{(ie=m.removeListener)==null||ie.call(m,"changeMedia",P)}catch(L){}}});return}let h=0,x=()=>{if(!q()){p.socketRetryTimer=null;return}let B=$();if(B&&typeof B.on=="function"){B.on("changeMedia",P),l(()=>{var ie,u;try{(ie=B.off)==null||ie.call(B,"changeMedia",P)}catch(L){try{(u=B.removeListener)==null||u.call(B,"changeMedia",P)}catch(v){}}}),p.socketRetryTimer=null;return}if(h+=1,h>10){p.socketRetryTimer=null;return}p.socketRetryTimer=window.setTimeout(x,1e3)};p.socketRetryTimer=window.setTimeout(x,1200),l(()=>{p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null)})}function we(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null)}function Se(){we(),p.header&&(p.header.classList.remove("hide"),p.header.classList.add("show"))}function fe(){we(),p.hideTimer=window.setTimeout(()=>{p.header&&(p.header.classList.remove("show"),p.header.classList.add("hide"),setTimeout(()=>{p.header&&p.header.classList.contains("hide")&&p.header.classList.remove("hide")},320))},300)}function E(){if(!p.header)return;let m=window.innerWidth<=768;p.header.classList.toggle("btfw-mobile",m)}async function P(){var ie;if(!p.isInitialized)return;let m=document.querySelector(y.TITLE_SELECTOR),h=p.header;if(!m||!h)return;let x=((ie=m.textContent)==null?void 0:ie.trim())||"";if(!x){p.currentTitle="",le();return}if(x===p.currentTitle)return;p.currentTitle=x;let B=++o;me();try{let u=await W(x);if(B!==o)return;c(u)}catch(u){if(B!==o)return;M.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),pe()}}function R(m){let h=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],x=m;return h.forEach(B=>{let ie=new RegExp(`\\b${B}\\b`,"gi");x=x.replace(ie,"")}),x.replace(/\s{2,}/g," ").trim()}async function W(m){var L;if(!M.isAvailable())throw new Error(M.MISSING_PROXY_MSG);let h=m.match(/(.+)\s*\((\d{4})\)/),x=h?h[1].trim():m,B=h?h[2]:"";B||(h=m.match(/(.+?)\s+(\d{4})\s*$/),h&&(x=h[1].trim(),B=h[2]));let ie=R(x),u=await M.tmdbFetch("search/movie",{query:ie,year:B});if(((L=u==null?void 0:u.results)==null?void 0:L.length)>0){let v=u.results[0];return{title:m,backdrop:v.backdrop_path?`https://image.tmdb.org/t/p/w1280${v.backdrop_path}`:null,poster:v.poster_path?`https://image.tmdb.org/t/p/w500${v.poster_path}`:null,summary:v.overview||"",rating:v.vote_average||0,releaseDate:v.release_date||"",voteCount:v.vote_count||0}}return{title:m,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function me(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let h=document.createElement("div");h.className="btfw-movie-loading";let x=document.createElement("i");x.className="fa fa-spinner fa-spin";let B=document.createElement("p");B.textContent="Loading movie information...",h.append(x,B),m.appendChild(h),p.header.replaceChildren(m)}function pe(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let h=document.createElement("div");h.className="btfw-movie-error";let x=document.createElement("i");x.className="fa fa-exclamation-triangle";let B=document.createElement("p");B.textContent="Unable to fetch movie information";let ie=document.createElement("small");ie.textContent="Check TMDB API key in Theme Settings",h.append(x,B,ie),m.appendChild(h),p.header.replaceChildren(m)}function le(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let h=document.createElement("p");h.textContent="No movie information available",m.appendChild(h),p.header.replaceChildren(m)}function be(){p.header&&(p.header.style.backgroundImage="",p.header.style.backgroundColor="")}function c(m){if(!p.header)return;p.header.replaceChildren(),y.ENABLE_BACKDROP&&m.backdrop?(p.header.style.backgroundImage=`url(${m.backdrop})`,p.header.style.backgroundSize="cover",p.header.style.backgroundPosition="center"):be();let h=document.createElement("div");h.className="btfw-movie-overlay",p.header.appendChild(h);let x=document.createElement("div");if(x.className="btfw-movie-content",p.header.appendChild(x),m.poster){let u=document.createElement("img");u.src=m.poster,u.alt=`${m.title} Poster`,u.className="btfw-movie-poster",x.appendChild(u)}let B=document.createElement("div");B.className="btfw-movie-details",x.appendChild(B);let ie=document.createElement("h2");if(ie.textContent=m.title,ie.className="btfw-movie-title",B.appendChild(ie),y.SHOW_SUMMARY&&m.summary){let u=document.createElement("p");u.textContent=m.summary,u.className="btfw-movie-summary",B.appendChild(u)}if(y.ENABLE_RATING&&m.rating>0){let u=I(m.rating,m.voteCount);x.appendChild(u)}}function I(m,h){let x=document.createElement("div");x.className="btfw-movie-rating";let B=Math.round(m*10),ie=N(B),u="http://www.w3.org/2000/svg",L=document.createElementNS(u,"svg");L.setAttribute("width","60"),L.setAttribute("height","60"),L.setAttribute("viewBox","0 0 60 60");let v=25,J=2*Math.PI*v,Te=J-m/10*J,s=document.createElementNS(u,"circle");s.setAttribute("cx","30"),s.setAttribute("cy","30"),s.setAttribute("r",v.toString()),s.setAttribute("stroke","#2a2a2a"),s.setAttribute("stroke-width","4"),s.setAttribute("fill","#1a1a1a"),L.appendChild(s);let d=document.createElementNS(u,"circle");d.setAttribute("cx","30"),d.setAttribute("cy","30"),d.setAttribute("r",v.toString()),d.setAttribute("stroke",ie),d.setAttribute("stroke-width","3"),d.setAttribute("fill","none"),d.setAttribute("stroke-dasharray",J.toString()),d.setAttribute("stroke-dashoffset",Te.toString()),d.setAttribute("transform","rotate(-90 30 30)"),d.setAttribute("stroke-linecap","round"),L.appendChild(d);let C=document.createElementNS(u,"text");if(C.setAttribute("x","50%"),C.setAttribute("y","50%"),C.setAttribute("text-anchor","middle"),C.setAttribute("dominant-baseline","central"),C.setAttribute("fill","#fff"),C.setAttribute("font-size","10"),C.setAttribute("font-weight","bold"),C.textContent=`${B}%`,L.appendChild(C),x.appendChild(L),h>0){let A=document.createElement("div");A.className="btfw-movie-votes",A.textContent=`${h.toLocaleString()} votes`,x.appendChild(A)}return x}function N(m){let h=Math.max(0,Math.min(m,100));return h>=70?"#4caf50":h>=50?"#ff9800":"#f44336"}function j(m,h){let x=null;return function(...ie){x&&clearTimeout(x),x=setTimeout(()=>{x=null,m(...ie)},h)}}function he(){if(document.getElementById(Q))return;let m=`
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
    `,h=document.createElement("style");h.id=Q,h.textContent=m,document.head.appendChild(h)}function ce(){G(),O(),re()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ce,{once:!0}):ce(),{name:"feature:movie-info",refresh:re,cleanup:H}});BTFW.define("feature:monkeyPaw",[],async()=>{let T="btfw-monkey-paw-styles",M="btfw-monkey-paw-overlay",Y="/src/assets/monkey-paw/paw.svg",y={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},Q={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},p={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},o=null,i=null,b=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function l(z){let $=String(z||"").trim();return/^<svg[\s>]/i.test($)?!b.test($):!1}function _(z){return new Promise($=>setTimeout($,z))}function H(){try{let z=typeof window!="undefined"?window.BTFW:null;return z&&(z.BASE||z.DEV_CDN)||""}catch(z){return""}}function K(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(z){return!1}}function q(){if(typeof document=="undefined"||document.getElementById(T))return;let z=document.createElement("style");z.id=T,z.textContent=`
      #${M} {
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

      #${M}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${M}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${M}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${M} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${M} .btfw-monkey-paw-title {
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

      #${M} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${M} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${M} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${M} .f-tip {
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

      #${M} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${M} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${M} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${M} .f-root,
        #${M} .f-tip,
        #${M} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(z)}async function G(){if(o)return o;let $=`${H()}${Y}`,ne=await fetch($,{credentials:"omit"});if(!ne.ok)throw new Error(`Monkey paw SVG failed to load (${ne.status})`);let oe=await ne.text();if(!l(oe))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return o=oe,o}function O(z){Object.entries(p).forEach(([$,ne])=>{let oe=z.querySelector(`#${$}`),X=z.querySelector(`#${$}-tip`);oe&&(oe.style.transform=ne.root),X&&(X.style.transform=ne.tip)})}function D(z){Object.entries(y).forEach(([$,ne])=>{window.setTimeout(()=>{let oe=z.querySelector(`#${$}`),X=z.querySelector(`#${$}-tip`);oe&&(oe.style.transform=ne.root),X&&window.setTimeout(()=>{X.style.transform=ne.tip},120)},Q[$])})}function Z(z){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${z}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function re(z={}){if(i)return i;if(typeof document!="undefined")return i=(async()=>{var Ee,de;if(q(),K()){await _((Ee=z.reducedMotionMs)!=null?Ee:450);return}let $=document.getElementById(M);$||($=document.createElement("div"),$.id=M,document.body.appendChild($));let ne;try{ne=await G()}catch(we){console.warn("[monkey-paw] SVG load failed:",we),await _(300);return}$.innerHTML=Z(ne),O($);let oe=$.querySelector("#paw"),X=$.querySelector("#btfw-monkey-paw-msg");$.classList.remove("is-cursed"),X==null||X.classList.remove("is-visible"),requestAnimationFrame(()=>$.classList.add("is-active")),D($),await _(980),oe==null||oe.classList.add("btfw-monkey-paw-shaking"),await _(720),oe==null||oe.classList.remove("btfw-monkey-paw-shaking"),$.classList.add("is-cursed"),X==null||X.classList.add("is-visible"),await _((de=z.holdMs)!=null?de:1100),$.classList.remove("is-active"),await _(320),$.remove()})().finally(()=>{i=null}),i}return{name:"feature:monkeyPaw",play:re}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:T})=>{let M=await T("util:tmdb-proxy"),Y=await T("feature:monkeyPaw"),y=(c,I=document)=>I.querySelector(c),Q=(c,I=document)=>Array.from(I.querySelectorAll(c)),p=null,o=null,i=null,b=null,l={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},_=null,H=null,K="[movie-suggestion]";function q(...c){console.log(K,...c)}function G(...c){console.error(K,...c)}function O(c){var I;try{if((I=window.socket)!=null&&I.emit)return window.socket.emit("chatMsg",{msg:c}),!0}catch(N){}return!1}async function D(c,I={}){return M.workerFetch(c,I)}function Z(){if(document.getElementById("btfw-movie-suggest-styles"))return;let c=document.createElement("style");c.id="btfw-movie-suggest-styles",c.textContent=`
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
    `,document.head.appendChild(c)}let re=(CLIENT==null?void 0:CLIENT.rank)||0;function z(){let c=y("a[href*='donate'], #donate-btn, .donate-btn");if(c){let N=c.closest("ul");if(N)return{ul:N,insertAfter:c.parentElement}}let I=y("#btfw-theme-btn-nav");if(I){let N=I.closest("ul");if(N)return{ul:N,insertAfter:null}}return{ul:y(".navbar .nav.navbar-nav")||y(".navbar-nav")||y(".btfw-navbar ul")||y(".navbar ul"),insertAfter:null}}function $(){if(y("#btfw-movie-suggest-btn"))return!0;let c=z();if(!c.ul)return!1;let I=document.createElement("li"),N=document.createElement("a");return N.href="javascript:void(0)",N.className="btfw-nav-pill",N.id="btfw-movie-suggest-btn",N.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,I.appendChild(N),c.insertAfter?c.insertAfter.after(I):c.ul.insertBefore(I,c.ul.firstChild),N.addEventListener("click",W),!0}function ne(){var j,he,ce,m,h,x;if(y("#btfw-movie-suggest-modal"))return;let c=document.createElement("div");c.id="btfw-movie-suggest-modal",c.className="modal",c.innerHTML=`
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
    `,document.body.appendChild(c);let I=y(".modal-background",c),N=y(".delete",c);if(I.addEventListener("click",me),N.addEventListener("click",me),(j=y("#btfw-movie-prev",c))==null||j.addEventListener("click",()=>{l.page>1&&(l.page-=1,fe())}),(he=y("#btfw-movie-next",c))==null||he.addEventListener("click",()=>{l.page<l.totalPages&&(l.page+=1,fe())}),re===0){let B=y("#btfw-movie-search",c);B.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),B.blur()})}else{let B,ie=y("#btfw-movie-search",c);ie.addEventListener("input",()=>{clearTimeout(B),l.query=ie.value.trim(),l.page=1,B=setTimeout(()=>fe(),400)}),(ce=y("#btfw-movie-sort",c))==null||ce.addEventListener("change",u=>{l.sortBy=u.target.value,l.page=1,fe()}),(m=y("#btfw-movie-genre",c))==null||m.addEventListener("change",u=>{l.genreId=u.target.value,l.page=1,fe()}),(h=y("#btfw-movie-year",c))==null||h.addEventListener("change",u=>{l.year=u.target.value.trim(),l.page=1,fe()}),(x=y("#btfw-movie-rating",c))==null||x.addEventListener("change",u=>{l.minRating=u.target.value.trim(),l.page=1,fe()})}}function oe(){if(y("#btfw-movie-confirm-modal"))return;let c=document.createElement("div");c.id="btfw-movie-confirm-modal",c.className="modal",c.innerHTML=`
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
    `,document.body.appendChild(c);let I=y(".modal-background",c),N=y(".delete",c),j=y("#btfw-movie-cancel",c),he=y("#btfw-movie-confirm",c),ce=()=>R();I.addEventListener("click",ce),N.addEventListener("click",ce),j.addEventListener("click",ce),he.addEventListener("click",le)}async function X(){if(_&&H)return;let[c,I]=await Promise.all([D("/api/meta"),D("/api/genres")]);_=c,H=I;let N=y("#btfw-movie-suggest-modal");if(!N)return;let j=y("#btfw-movie-sort",N);if(j&&j.options.length===0){for(let ce of c.sortOptions||[]){let m=document.createElement("option");m.value=ce.value,m.textContent=ce.label,j.appendChild(m)}j.value=l.sortBy}let he=y("#btfw-movie-genre",N);if(he&&he.options.length<=1)for(let ce of I.genres||[]){let m=document.createElement("option");m.value=String(ce.id),m.textContent=ce.name,he.appendChild(m)}}function Ee(){let c={page:l.page,sort_by:l.sortBy};return l.query?(c.query=l.query,l.year&&(c.primary_release_year=l.year,c.year=l.year)):(l.genreId&&(c.with_genres=l.genreId),l.year&&(c.primary_release_year=l.year),l.minRating&&(c["vote_average.gte"]=l.minRating)),c}function de(c){return!c||c==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${c}`}function we(){let c=y("#btfw-movie-suggest-modal");if(!c)return;let I=y("#btfw-movie-prev",c),N=y("#btfw-movie-next",c),j=y("#btfw-movie-page-label",c);j&&(j.textContent=`Page ${l.page} of ${l.totalPages}`),I&&(I.disabled=l.page<=1||l.loading),N&&(N.disabled=l.page>=l.totalPages||l.loading)}function Se(c){let I=y("#btfw-movie-suggest-modal");if(!I)return;let N=y(".btfw-movie-results",I);if(!c.length){N.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}N.innerHTML=c.map(j=>`
      <div class="movie-result"
           data-id="${ke(j.id)}"
           data-title="${ke(j.title)}"
           data-poster="${ke(j.posterPath||"")}"
           data-year="${ke(j.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${ke(de(j.posterPath))}" alt="${ke(j.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${ke(j.title)}</div>
          <small style="opacity:0.7;">${ke(j.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),Q(".movie-result",N).forEach(j=>{j.addEventListener("click",()=>{p=j.dataset.id,o=j.dataset.title,i=j.dataset.poster,b=j.dataset.year||null;let he=y("#btfw-movie-confirm-modal");if(!he)return;let ce=b?` (${b})`:"";y("#btfw-confirm-movie-title",he).textContent=`${o}${ce}`,P()})})}async function fe(){let c=y("#btfw-movie-suggest-modal");if(!c||l.loading)return;l.loading=!0,we();let I=y(".btfw-movie-results",c);I.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await X();let N=await D("/api/search",{params:Ee()});l.totalPages=Math.max(1,N.totalPages||1),Se(N.results||[]),q("runSearch",{page:l.page,totalPages:l.totalPages,count:(N.results||[]).length})}catch(N){G("runSearch failed:",N),I.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{l.loading=!1,we()}}async function E(){let c=y("#btfw-movie-history");if(c){c.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let N=(await D("/api/history",{params:{page:1,limit:10}})).results||[];if(!N.length){c.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}c.innerHTML=N.map(j=>{let he=j.releaseYear?` (${ke(j.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${ke(de(j.posterPath).replace("w154","w92"))}" alt="${ke(j.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${ke(j.movieTitle)}${he}</div>
              <div class="history-item__meta">Requested by ${ke(j.username)}</div>
            </div>
          </div>
        `}).join("")}catch(I){G("loadHistory failed:",I),c.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function P(){let c=y("#btfw-movie-suggest-modal"),I=y("#btfw-movie-confirm-modal");I&&(c&&c.classList.add("btfw-movie-suggest-pending"),I.classList.add("is-active"))}function R(){let c=y("#btfw-movie-suggest-modal"),I=y("#btfw-movie-confirm-modal");c&&c.classList.remove("btfw-movie-suggest-pending"),I&&I.classList.remove("is-active")}async function W(){let c=y("#btfw-movie-suggest-modal");if(c){q("openModal",{userRank:re}),c.classList.remove("btfw-movie-suggest-pending"),c.classList.add("is-active");try{await X(),await Promise.all([fe(),E()])}catch(I){G("openModal bootstrap failed:",I)}}}function me(){let c=y("#btfw-movie-suggest-modal");c&&(R(),q("closeModal"),c.classList.remove("is-active"),y("#btfw-movie-search",c).value="",y(".btfw-movie-results",c).innerHTML="",l.query="",l.page=1,l.totalPages=1,p=null,o=null,i=null,b=null)}function pe(c,I,N){let j=N?` (${N})`:"";return`\u{1F3AC} Movie request: ${I}${j} \u2014 suggested by ${c}`}async function le(){if(!p||!o)return;let c=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";q("confirmSuggestion",{movieId:p,movieTitle:o}),R();try{await Y.play(),await D("/api/suggestions",{method:"POST",body:{movieId:Number(p),movieTitle:o,username:c,posterPath:i||null,releaseYear:b||null}}),O(pe(c,o,b)),await E(),me()}catch(I){G("confirmSuggestion failed:",I),alert("Could not save your movie request. Please try again.")}}function be(){q("boot: start",{workerBase:M.getWorkerBase()}),Z(),ne(),oe();let c=0,I=50,N=()=>{if($()){q("Button added successfully");return}c+=1,c<I?setTimeout(N,100):console.warn(K,"Failed to add button after retries",{retryCount:c})};N()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(be,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(be,200)}):setTimeout(be,200),{name:"ext:movie-suggestion",open:W,close:me,getWorkerBase:M.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async T=>T.init("ext:movie-suggestion"));})();
