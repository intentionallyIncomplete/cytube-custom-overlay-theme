/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",["feature:layout"],async()=>{let T="#videowrap .video-js",M="vjs-default-skin",V="vjs-theme-city",y="vjs-big-play-centered",Q=["#videowrap video","#ytapiplayer video","#videowrap .video-js video","#videowrap .video-js .vjs-tech"].join(","),p={playsinline:"","webkit-playsinline":"","x5-video-player-type":"h5","x5-video-player-fullscreen":"false","x5-video-orientation":"portrait"},o="btfw-videojs-base-css",r="btfw-videojs-city-css",h=["https://vjs.zencdn.net/7.20.3/video-js.css"],l=["https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css","https://unpkg.com/@videojs/themes@1/dist/city/index.css"];function _(E,P){let R=document;if(!R||!R.head||R.getElementById(E))return;let Y=R.createElement("link");Y.id=E,Y.rel="stylesheet";let fe=Array.isArray(P)?P.slice():[P],me=()=>{if(!fe.length)return!1;let pe=fe.shift();return pe?(Y.href=pe,!0):me()};Y.addEventListener("error",()=>{me()||Y.remove()}),me()&&R.head.appendChild(Y)}function H(){if(typeof window=="undefined"||!document.body)return!1;let E=document.createElement("div");E.className=`video-js ${M}`,E.style.position="absolute",E.style.opacity="0",E.style.pointerEvents="none",E.style.width="1px",E.style.height="1px",document.body.appendChild(E);let P=window.getComputedStyle(E).fontSize;return E.remove(),P&&Math.abs(parseFloat(P)-10)<.2}function K(){H()||document.querySelector('link[href*="video-js"], link[href*="videojs"], style[data-vjs-styles]')||_(o,h)}function q(){document.querySelector('link[href*="videojs" i][href*="city" i], link[href*="@videojs/themes" i][href*="city" i]')||_(r,l)}function G(E){if(!E)return null;try{return E.player||E.player_||window.videojs&&typeof window.videojs.getPlayer=="function"&&window.videojs.getPlayer(E.id)||window.videojs&&window.videojs.players&&window.videojs.players[E.id]}catch(P){return null}}function O(E){let P=G(E);if(!P)return;let R=typeof P.getChild=="function"?P.getChild("controlBar"):null,Y=R&&typeof R.getChild=="function"?R.getChild("volumePanel"):null;if(Y){E.classList.add("btfw-volume-inline");try{typeof Y.inline=="function"&&Y.inline(!0)}catch(fe){}}}function D(){K(),q(),document.querySelectorAll(T).forEach(E=>{E.classList.contains(M)&&E.classList.remove(M),Array.from(E.classList).forEach(P=>{P.startsWith("vjs-theme-")&&P!==V&&E.classList.remove(P)}),E.classList.contains(V)||E.classList.add(V),E.classList.contains(y)||E.classList.add(y),O(E)})}function Z(){var P;if(typeof window=="undefined")return;let E=(P=window.BTFW)==null?void 0:P.channelPosterUrl;E&&document.querySelectorAll(T).forEach(R=>{R.poster!==E&&(R.poster=E);try{let Y=R.player||R.player_||window.videojs&&window.videojs.players&&window.videojs.players[R.id];Y&&typeof Y.poster=="function"&&Y.poster(E)}catch(Y){let fe=R.querySelector(".vjs-poster");fe&&(fe.style.backgroundImage=`url("${E}")`)}})}function re(){var R;if(typeof window=="undefined")return;let E=(R=window.PLAYER)==null?void 0:R.mediaType;document.querySelectorAll(".vjs-poster").forEach(Y=>{E==="yt"||E==="dm"||E==="vi"||E==="tw"?Y.classList.add("hidden"):Y.classList.remove("hidden")})}function z(){document.querySelectorAll(Q).forEach(P=>{P instanceof HTMLVideoElement&&(typeof P.playsInline=="boolean"&&(P.playsInline=!0),Object.entries(p).forEach(([R,Y])=>{try{P.setAttribute(R,Y)}catch(fe){}}))})}function $(){if(typeof window=="undefined")return!1;let E=window.videojs;if(!E)return!1;let P=E.dom||E;if(!P||typeof P.textContent!="function")return!1;if(P.textContent&&P.textContent._btfwOptimized)return!0;let R=P.textContent.bind(P),Y=function(me,pe){if(!me)return me;let be;try{typeof me.textContent!="undefined"?be=me.textContent:typeof me.innerText!="undefined"&&(be=me.innerText)}catch(c){be=void 0}if(be!==void 0){let c=pe==null?"":String(pe);if(be===c)return me}return R(me,pe)};return Y._btfwOptimized=!0,Y._btfwOriginal=R,P.textContent=Y,!0}function ne(){if($()){ne._tries=0;return}ne._tries>20||(ne._tries=(ne._tries||0)+1,setTimeout(ne,250))}let oe="_btfwGuarded";function X(E){if(!E)return!1;let P=[".vjs-control-bar",".vjs-control",".vjs-menu",".vjs-menu-content",".vjs-slider",".vjs-volume-panel",".vjs-text-track-settings",".vjs-tech .alert",'.vjs-tech [role="alert"]','.vjs-tech [role="dialog"]',".vjs-tech .modal",".vjs-tech .modal-dialog",".vjs-big-play-button",".vjs-poster"].join(",");return!!E.closest(P)}function Ee(E){if(!E||E[oe])return;E[oe]=!0;let P=R=>{X(R.target)||R.type==="click"&&R.button!==0||(R.preventDefault(),R.stopImmediatePropagation())};E.addEventListener("click",P,!0),E.addEventListener("pointerdown",R=>{X(R.target)||(R.preventDefault(),R.stopImmediatePropagation())},!0),E.addEventListener("contextmenu",P,!0)}function ce(){document.querySelectorAll(T).forEach(Ee)}function we(){if(we._mo)return;let E=document.getElementById("videowrap")||document.body,P=new MutationObserver(R=>{var fe,me,pe;let Y=!1;for(let be of R){for(let c of be.addedNodes)if(c.nodeType===1&&((fe=c.classList)!=null&&fe.contains("video-js")||c.tagName==="VIDEO"||c.tagName==="IFRAME"||(me=c.querySelector)!=null&&me.call(c,T))){Y=!0;break}for(let c of be.removedNodes)if(c.nodeType===1&&((pe=c.classList)!=null&&pe.contains("video-js")||c.tagName==="VIDEO"||c.tagName==="IFRAME")){Y=!0;break}}Y&&(D(),ce(),z(),Z(),re(),document.querySelectorAll(T).forEach(O))});P.observe(E,{childList:!0,subtree:!0,characterData:!1}),we._mo=P}function Se(){setTimeout(()=>{z(),Z(),re(),document.querySelectorAll(T).forEach(O)},100)}function ue(){if(D(),ce(),z(),ne(),Z(),re(),we(),setInterval(()=>{re()},1e3),typeof window!="undefined"&&window.socket&&typeof socket.on=="function")try{typeof socket.off=="function"&&socket.off("changeMedia",Se),socket.on("changeMedia",Se)}catch(E){console.warn("[feature:player] Unable to bind changeMedia handler",E)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ue):ue(),document.addEventListener("btfw:layoutReady",()=>setTimeout(ue,0)),{name:"feature:player",applyCityTheme:D,attachGuards:ce,ensureInlinePlayback:z,applyPosterUrl:Z,togglePosterVisibility:re,shouldAllowClick:X}});function Me(T=document){return!T||typeof T.querySelector!="function"?!1:!!(T.querySelector("#pollwrap .well.active")||T.querySelector("#pollwrap .well.muted")||T.querySelector("#pollwrap .poll-menu"))}function Ae(T,M){return T!=null?!!T:!!M}var St=/[&<>"']/g,_t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function ke(T){return T==null?"":String(T).replace(St,M=>{var V;return(V=_t[M])!=null?V:M})}function kt(T){return T.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function st(T){return T.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var Tt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],Lt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},Ct=["http","https","mailto"],At="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",Pt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,Mt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,Nt={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function It(T){let M=T;for(let V=0;V<3;V+=1){let y=M.replace(/&#x([0-9a-fA-F]+);?/g,(Q,p)=>{let o=Number.parseInt(p,16);if(!Number.isFinite(o)||o<0||o>1114111)return"";try{return String.fromCodePoint(o)}catch(r){return""}}).replace(/&#(\d+);?/g,(Q,p)=>{let o=Number(p);if(!Number.isFinite(o)||o<0||o>1114111)return"";try{return String.fromCodePoint(o)}catch(r){return""}}).replace(/&([a-zA-Z]+);?/g,(Q,p)=>{let o=Nt[p.toLowerCase()];return o!==void 0?o:Q});if(y===M)break;M=y}return M.replace(/[\u0000-\u001f\u007f]/g,"").replace(/[\s\u00a0]+/g,"")}function Bt(T){var Q,p;let M=new Map,V=new RegExp(Pt.source,"g"),y;for(;(y=V.exec(T))!==null;){let o=((Q=y[1])!=null?Q:"").toLowerCase(),r=(p=y[2])!=null?p:"";(r.startsWith('"')&&r.endsWith('"')||r.startsWith("'")&&r.endsWith("'"))&&(r=r.slice(1,-1)),M.set(o,r),y[0].length===0&&(V.lastIndex+=1)}return M}function Ot(T,M){var p;let V=It(T);if(V.length===0)return!0;let y=Mt.exec(V);if(!y)return!0;let Q=((p=y[1])!=null?p:"").toLowerCase();return M.includes(Q)?Q==="data"?/^data:image\//i.test(V):!0:!1}function Rt(T,M,V,y,Q,p,o){var G,O;let r=M.toLowerCase();if(!Q.has(r))return"";if(T)return`</${r}>`;let h=Bt(V||""),l=(G=p["*"])!=null?G:[],_=(O=p[r])!=null?O:[],H=[];for(let[D,Z]of h)D.startsWith("on")||!(l.includes(D)||_.includes(D))||(D==="href"||D==="src")&&!Ot(Z,o)||H.push(`${D}="${kt(Z)}"`);r==="a"&&h.get("target")==="_blank"&&_.includes("rel")&&(H.some(D=>D.startsWith("rel="))||H.push('rel="noopener noreferrer"'));let K=H.length>0?` ${H.join(" ")}`:"";return`<${r}${K}${y?" /":""}>`}function Ne(T,M={}){var _,H,K;if(T==null)return"";let V=String(T).replace(/<!--[\s\S]*?-->/g,""),y=new Set(((_=M.allowedTags)!=null?_:Tt).map(q=>q.toLowerCase())),Q=(H=M.allowedAttributes)!=null?H:Lt,p=(K=M.allowedSchemes)!=null?K:Ct,o=new RegExp(At,"g"),r="",h=0,l;for(;(l=o.exec(V))!==null;){let[q,G,O="",D="",Z]=l;r+=st(V.slice(h,l.index)),r+=Rt(G,O,D,Z,y,Q,p),h=l.index+q.length}return r+=st(V.slice(h)),r}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:T})=>{let M=await T("util:templates"),{stack:V}=M,y="btfw-stack-order",Q="btfw-stack-motd-open",p="btfw-stack-playlist-open",o="btfw-stack-poll-open",r={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},h=r,l={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},_={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},H={"motd-group":1,"poll-group":2,"playlist-group":3},K=!1,q=null,G="",O=null,D=null,Z=null,re={"motd-group":{storageKey:Q,getDefaultOpen:e=>Ae(e,E()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:p,getDefaultOpen:e=>Ae(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:o,getDefaultOpen:e=>Ae(e,Me()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},z=null,$=!1,ne=!1,oe=null,X=!1,Ee=!1,ce=!1,we=null,Se=!1;function ue(e=""){let t=String(e||"").trim();return t?!t.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function E(e=document){if(!e||typeof e.querySelector!="function")return!1;let t=P(e);return t?!ue(t.innerHTML||""):!1}function P(e=document){if(!e||typeof e.getElementById!="function")return null;let t=e.getElementById("motdwrap");if(!t)return e.getElementById("motd");let n=t.querySelector(":scope > #motd");return n||t.querySelector("#motd")||e.getElementById("motd")}let R=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Y=["#main","#mainpage","#mainpane"],fe=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function me(e,t,n){if(!e||!t||!n)return null;let a=fe.map(U=>{let ee=document.getElementById(U.id);return ee?{...U,el:ee}:null}).filter(Boolean);if(!a.length){let U=document.getElementById("btfw-addmedia-panel");return U&&U.remove(),null}let i=document.getElementById("btfw-addmedia-panel");if(i||(i=document.createElement("section"),i.id="btfw-addmedia-panel",i.className="btfw-addmedia-panel",i.dataset.open="false",i.setAttribute("role","region"),i.setAttribute("aria-label","Add media controls"),i.setAttribute("aria-hidden","true"),i.setAttribute("hidden","hidden"),i.innerHTML=V.addMediaPanelHtml()),i.parentElement!==e){let U=t.parentElement===e?t.nextSibling:null;e.insertBefore(i,U)}let f=i.querySelector(".btfw-addmedia-tabs"),w=i.querySelector(".btfw-addmedia-views"),g=i.querySelector(".btfw-addmedia-close");if(!f||!w)return null;for(;f.firstChild;)f.removeChild(f.firstChild);for(;w.firstChild;)w.removeChild(w.firstChild);a.forEach(({id:U,title:ee,el:F})=>{F.classList.remove("collapse","in","plcontrol-collapse"),F.style.removeProperty("display"),F.style.removeProperty("height"),F.removeAttribute("aria-expanded"),F.setAttribute("role","tabpanel"),F.setAttribute("data-btfw-addmedia","panel");let ge=document.createElement("button");ge.type="button",ge.className="btfw-addmedia-tab",ge.dataset.target=U,ge.textContent=ee,ge.setAttribute("role","tab"),f.appendChild(ge);let ye=document.createElement("div");ye.className="btfw-addmedia-view",ye.dataset.target=U,ye.setAttribute("role","tabpanel"),ye.setAttribute("aria-hidden","true"),ye.appendChild(F),w.appendChild(ye)});let k=a.find(U=>U.default)||a[0],S=U=>{let ee=U||i.dataset.active||k.id;i.dataset.active=ee,f.querySelectorAll(".btfw-addmedia-tab").forEach(F=>{let ge=F.dataset.target===ee;F.classList.toggle("is-active",ge),F.setAttribute("aria-selected",ge?"true":"false"),F.setAttribute("tabindex",ge?"0":"-1")}),w.querySelectorAll(".btfw-addmedia-view").forEach(F=>{let ge=F.dataset.target===ee;F.classList.toggle("is-active",ge),F.setAttribute("aria-hidden",ge?"false":"true")})},j=U=>{let ee=U!=null?!!U:i.dataset.open!=="true";return i.dataset.open=ee?"true":"false",i.classList.toggle("is-open",ee),i.setAttribute("aria-hidden",ee?"false":"true"),ee?(i.removeAttribute("hidden"),S(i.dataset.active||k.id)):i.setAttribute("hidden","hidden"),i.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:ee}})),ee};return i._btfwWired||(f.addEventListener("click",U=>{let ee=U.target.closest(".btfw-addmedia-tab");ee&&(U.preventDefault(),S(ee.dataset.target))}),g&&g.addEventListener("click",()=>j(!1)),i._btfwWired=!0),S(i.dataset.active||k.id),i._btfwToggle=j,i._btfwSetActive=S,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:ee,target:F})=>{let ge=document.getElementById(ee);ge&&ge.dataset.btfwAddmedia!==F&&(ge.dataset.btfwAddmedia=F,ge.setAttribute("aria-controls","btfw-addmedia-panel"),ge.addEventListener("click",ye=>{ye.preventDefault(),ye.stopPropagation(),S(F),j(!0),ge.blur()}))})})(),{panel:i,toggle:j,setActive:S}}function pe(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let t=document.getElementById("btfw-stack");if(!t){t=document.createElement("div"),t.id="btfw-stack",t.className="btfw-stack";let n=document.getElementById("videowrap"),a=document.getElementById("btfw-video-overlay"),i=a&&n&&a.parentElement===n.parentElement?a:n;i&&i.parentElement?i.nextSibling?i.parentNode.insertBefore(t,i.nextSibling):i.parentNode.appendChild(t):e.appendChild(t);let f=document.createElement("div");f.className="btfw-stack-list",t.appendChild(f);let w=document.createElement("div");w.id="btfw-stack-footer",w.className="btfw-stack-footer",t.appendChild(w)}return{list:t.querySelector(".btfw-stack-list"),footer:t.querySelector("#btfw-stack-footer")}}function be(e=!1){let t=document.getElementById("motdwrap");if(!t)return null;if(!e&&t.dataset.btfwMotdNormalized==="1"){let f=t.querySelector(":scope > #motd");return f?{motdwrap:t,motd:f}:null}let n=document.getElementById("togglemotd");n&&n.closest("#motd")&&t.insertBefore(n,t.firstChild);let a=[];t.querySelectorAll(".btfw-motd-editrow").forEach(f=>{let w=(f.textContent||"").trim();w&&a.push(`<p>${w}</p>`),f.remove()}),t.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(f=>{f.contains(t)||f===t||((f.querySelector("#motd")||f.classList.contains("btfw-motd-editrow"))&&f.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&a.push(w.innerHTML)}),f.remove())});let i=t.querySelector(":scope > #motd");if(i||(i=document.createElement("div"),i.id="motd",t.appendChild(i)),t.querySelectorAll("#motd").forEach(f=>{f!==i&&((f.innerHTML||"").trim()&&a.push(f.innerHTML),f.remove())}),i.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(f=>{f.remove()}),i.querySelectorAll("#motd").forEach(f=>{(f.innerHTML||"").trim()&&a.push(f.innerHTML),f.remove()}),document.querySelectorAll("#togglemotd").forEach((f,w)=>{w!==0&&f.remove()}),a.length){let f=a.join("").trim();f&&ue(i.innerHTML)?i.innerHTML=Ne(f):f&&(i.innerHTML+=Ne(f))}return t.dataset.btfwMotdNormalized="1",{motdwrap:t,motd:i}}function c(){let e=document.getElementById("btfw-plbar");if((e==null?void 0:e.dataset.btfwMerged)==="1")return;let t=document.getElementById("controlsrow"),n=document.getElementById("rightcontrols"),a=document.getElementById("playlistwrap"),i=document.getElementById("queuecontainer"),f=document.getElementById("playlistrow"),w=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),g=document.querySelectorAll(".btfw-controls-row"),k=f||a||i||w;if(!k)return;let S=e;S?S.classList.add("btfw-plbar"):(S=document.createElement("div"),S.id="btfw-plbar",S.className="btfw-plbar");let j=S.querySelector(".btfw-plbar__layout"),de,U;if(j)de=j.querySelector(".btfw-plbar__primary")||j,U=j.querySelector(".btfw-plbar__aside")||j;else{for(j=document.createElement("div"),j.className="btfw-plbar__layout",de=document.createElement("div"),de.className="btfw-plbar__primary",U=document.createElement("div"),U.className="btfw-plbar__aside",j.append(de,U);S.firstChild;)de.appendChild(S.firstChild);S.appendChild(j);let se=de.querySelector(".field.has-addons");se&&se.classList.add("btfw-plbar__search");let xe=de.querySelector("#btfw-pl-count");xe&&(xe.classList.add("btfw-plbar__count"),U.appendChild(xe))}S.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(se=>se.remove());let ee=S.querySelector(".btfw-plbar__actions");ee||(ee=document.createElement("div"),ee.className="btfw-plbar__actions",(U||S).appendChild(ee));let F=document.getElementById("btfw-addmedia-btn"),ge=se=>{if(se){if(se.classList.add("btfw-plbar__action-btn"),se.tagName==="BUTTON"||se.tagName==="A")se.classList.add("button","is-dark","is-small");else if(se.tagName==="INPUT"){let xe=(se.type||"").toLowerCase();xe==="button"||xe==="submit"||xe==="reset"?se.classList.add("button","is-dark","is-small"):se.classList.remove("button","is-dark","is-small")}}};S.parentElement!==k&&k.insertBefore(S,k.firstChild);let ye=me(k,S,ee);ye?!F||!document.body.contains(F)?(F=document.createElement("button"),F.id="btfw-addmedia-btn",F.type="button",F.className="button is-small",F.innerHTML=V.addMediaButtonHtml(),ee.prepend(F)):ee.contains(F)||ee.prepend(F):F&&(F.parentElement&&F.parentElement.removeChild(F),F=null);let Pe=se=>{if(!se)return;Array.from(se.children||[]).forEach(Ce=>{Ce&&(Ce.classList.add("btfw-plbar__control"),ee.appendChild(Ce))})};if(n&&(Pe(n),n.remove()),t&&(Pe(t),t.remove()),ee.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(ge),ye&&F){F.classList.remove("is-dark"),F.classList.add("is-primary"),F.dataset.iconified||(F.innerHTML=V.addMediaButtonHtml(),F.dataset.iconified="1"),F.setAttribute("aria-controls","btfw-addmedia-panel");let se=Ce=>{F.setAttribute("aria-expanded",Ce?"true":"false")};F.dataset.btfwBound||(F.dataset.btfwBound="1",F.addEventListener("click",Ce=>{Ce.preventDefault();let rt=document.getElementById("btfw-addmedia-panel"),at=rt&&rt._btfwToggle,xt=typeof at=="function"?at():!1;se(xt)}));let xe=ye.panel||document.getElementById("btfw-addmedia-panel");xe&&(se(xe.dataset.open==="true"),xe._btfwButtonSync||(xe.addEventListener("btfw:addmedia:state",Ce=>{se(!!(Ce.detail&&Ce.detail.open))}),xe._btfwButtonSync=!0))}g.forEach(se=>{se&&!k.contains(se)&&(se.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,se.remove(),k.appendChild(se),console.log("[stack] Moved floating controls row into playlist container"))}),k.contains(S)||k.insertBefore(S,k.firstChild),S.dataset.btfwMerged="1"}function N(e,t){if(e.id==="motd-group"&&(be(),t=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(Be(),c(),t=t.filter(g=>g&&g.id!=="rightcontrols"&&g.id!=="pollwrap").filter(g=>!g.querySelector||!g.querySelector("#pollwrap"))),e.id==="poll-group"&&(Be(),Ye(),t=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),t.length===0)return null;let n=document.querySelector("#btfw-stack .btfw-stack-list");n&&(t=t.filter(g=>g&&!n.contains(g)&&!g.contains(n)));let a=document.createElement("section");a.className="btfw-stack-item btfw-group-item",a.dataset.bind=e.id,a.dataset.group="true";let i=document.createElement("header");i.className="btfw-stack-item__header",i.innerHTML=V.stackGroupHeaderHtml(e.title);let f=document.createElement("div");f.className="btfw-stack-item__body btfw-group-body",t.forEach(g=>{if(g&&g.parentElement!==f&&!f.contains(g)&&!g.contains(f))try{f.appendChild(g)}catch(k){console.warn("[stack] Failed to move element:",g.id||g.className,k)}}),a.appendChild(i),a.appendChild(f);let w=re[e.id];return w&&pt(a,w),Qe(a,e.id),a.querySelector(".btfw-up").onclick=function(){let g=a.parentElement,k=a.previousElementSibling;k&&g.insertBefore(a,k),I(g)},a.querySelector(".btfw-down").onclick=function(){let g=a.parentElement,k=a.nextElementSibling;k?g.insertBefore(k,a):g.appendChild(a),I(g)},a}function I(e){try{let t=Array.from(e.children).map(n=>({id:n.dataset.bind,isGroup:n.dataset.group==="true"}));localStorage.setItem(y,JSON.stringify(t))}catch(t){}}function W(){try{return JSON.parse(localStorage.getItem(y)||"[]")}catch(e){return[]}}function he(e){try{let t=localStorage.getItem(e);return t===null?null:t==="true"}catch(t){return null}}function le(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function m(e){try{let t=localStorage.getItem(e);if(t!==null)return t==="true";let n=e.replace("-docked","-hidden"),a=localStorage.getItem(n);return a!==null?a==="true":!1}catch(t){return!1}}function b(e,t){try{localStorage.setItem(e,t?"true":"false")}catch(n){}}function x(){let e=document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']");return e.length?Array.from(e).every(t=>t.dataset.docked==="true"):!0}function B(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function ie(e){if(!e)return;if(e.classList.add("btfw-stack-item--in-drawer"),e.dataset.btfwInDrawer="true",e.dataset.bind==="poll-group"){let n=e.querySelector("#pollwrap");n&&Me()&&(n.classList.remove("btfw-poll-idle"),n.removeAttribute("hidden"),n.setAttribute("aria-hidden","false"))}}function u(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),Re())}function L(e){u(e);let t=document.querySelector("#btfw-stack .btfw-stack-list");!t||!e||e.parentElement!==t&&t.appendChild(e)}function v(e,t,n){if(!e||B(e))return;let a=he(t),i=typeof n=="function"?n(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(i,{persist:!1}):(e.dataset.open=i?"true":"false",e.classList.toggle("is-open",i))}function J(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),t=e.filter(w=>w.dataset.docked!=="true"),n=e.length>0&&t.length===0,a=document.getElementById("btfw-stack"),i=document.getElementById("btfw-leftpad"),f=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",n),a.classList.toggle("btfw-stack--all-docked",n)),i&&i.classList.toggle("btfw-leftpad--stack-hidden",n),f&&f.classList.toggle("btfw-grid--stack-hidden",n),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:n,allDocked:n,visibleCount:t.length,totalCount:e.length}}))}function Te(){var a;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let t=document.getElementById("btfw-panels-menu-shell");if(!t){t=document.createElement("div"),t.id="btfw-panels-menu-shell",t.className="btfw-panels-menu-shell",t.setAttribute("aria-label","Docked channel panels");let i=document.createElement("div");i.id="btfw-panel-bar",i.className="btfw-panel-bar",i.setAttribute("role","toolbar"),i.setAttribute("aria-label","Docked panel shortcuts"),t.appendChild(i)}let n=t.querySelector("#btfw-panel-bar");return ve(n),t.parentElement!==e&&e.insertBefore(t,e.firstChild),K||(ft(),K=!0),(a=document.getElementById("btfw-stack-drawer"))==null||a.remove(),t}function s(e){e.preventDefault(),e.stopPropagation(),ut()}function d(){let e=Te();if(!e)return null;let t=document.getElementById("btfw-panels-menu-btn");t?t.parentElement!==e&&e.appendChild(t):(t=document.createElement("button"),t.type="button",t.id="btfw-panels-menu-btn",t.className="button btfw-chatbtn btfw-panels-menu-btn",t.innerHTML=V.panelsMenuButtonHtml(),t.title="Docked Panels",t.setAttribute("aria-expanded","false"),t.hidden=!0,e.appendChild(t)),t.title="Docked Panels";let n=t.querySelector(".btfw-panels-menu-btn__label");return n&&(n.textContent="Panels"),t.classList.remove("is-wide"),t.dataset.btfwPanelsWired||(t.addEventListener("click",s),t.dataset.btfwPanelsWired="1"),t}function C(e){if(!e)return null;let t=Array.from(e.classList).find(a=>a.startsWith("pluid-"));if(t)return t.slice(6);let n=window.jQuery||window.$;if(n){let a=n(e).data("uid");if(a!=null&&a!=="")return a}return e.dataset.uid||null}function A(e){if(e==null||e==="")return!1;let t=window.socket;if(t&&typeof t.emit=="function")return t.emit("jumpTo",e),!0;let n=document.querySelector(`#queue > .queue_entry.pluid-${e}`),a=n==null?void 0:n.querySelector(".qbtn-play");return a?(a.click(),!0):!1}function te(e){let t=(e||"").trim();if(!t)return!1;let n=document.getElementById("mediaurl"),a=document.getElementById("queue_next");if(n&&a&&(n.value=t,!a.disabled))return a.click(),!0;if(typeof window.queue=="function"&&n)return n.value=t,window.queue("next","url"),!0;let i=window.socket;if(i&&typeof parseMediaLink=="function")try{let f=parseMediaLink(t);if((f==null?void 0:f.id)!=null&&(f!=null&&f.type))return i.emit("queue",{id:f.id,type:f.type,pos:"next",temp:!1}),!0}catch(f){}return!1}function ae(e){pe();let t=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);t&&(O&&(clearTimeout(O),O=null),q=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n.classList.remove("is-active"),delete n.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),Le(),We(t,!1),requestAnimationFrame(()=>{try{t.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(n){}}))}function ve(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",t=>{var f,w,g;let n=t.target.closest(".btfw-panel-undock");if(n){t.preventDefault(),t.stopPropagation();let k=n.dataset.panelGroup||((f=n.closest(".btfw-panel-btn"))==null?void 0:f.dataset.group);k&&ae(k);return}let a=t.target.closest(".btfw-panel-playlist__play");if(a){t.preventDefault(),t.stopPropagation(),A(a.dataset.queueUid);return}let i=t.target.closest(".btfw-panel-playlist__add");if(i){t.preventDefault(),t.stopPropagation();let k=(w=i.closest(".btfw-panel-container"))==null?void 0:w.querySelector(".btfw-panel-playlist__add-form");if(!k)return;let S=k.hidden;k.hidden=!S,i.setAttribute("aria-expanded",S?"true":"false"),S&&((g=k.querySelector(".btfw-panel-playlist__link-input"))==null||g.focus())}}),e.addEventListener("submit",t=>{var w,g,k,S;let n=t.target.closest(".btfw-panel-playlist__add-form");if(!n)return;t.preventDefault(),t.stopPropagation();let a=n.querySelector(".btfw-panel-playlist__link-input"),i=(w=a==null?void 0:a.value)==null?void 0:w.trim();if(!i||!te(i))return;a.value="",n.hidden=!0,(k=(g=n.closest(".btfw-panel-container"))==null?void 0:g.querySelector(".btfw-panel-playlist__add"))==null||k.setAttribute("aria-expanded","false");let f=(S=n.closest(".btfw-panel-container"))==null?void 0:S.querySelector(".btfw-panel-playlist__queue");f&&Fe(f)}))}function Le(){if(D){try{D.disconnect()}catch(e){}D=null}Z=null}function _e(e){if(!e||Z===e)return;Le();let t=document.getElementById("queue");t&&(Z=e,D=new MutationObserver(()=>{e.isConnected&&q==="playlist-group"&&Fe(e)}),D.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function Ie(e=5){let t=document.getElementById("queue");if(!t)return[];let n=Array.from(t.querySelectorAll(":scope > .queue_entry")),a=n.findIndex(f=>f.classList.contains("queue_active")||f.classList.contains("playing")),i=a>=0?a+1:0;return n.slice(i,i+e)}function Fe(e){if(!e)return;let t=Ie(5);if(e.replaceChildren(),!t.length){let n=document.createElement("p");n.className="btfw-panel-playlist__empty",n.textContent="No upcoming videos",e.appendChild(n);return}t.forEach(n=>{var k,S;let a=document.createElement("div");a.className="btfw-panel-playlist__item";let i=document.createElement("span");i.className="btfw-panel-playlist__title",i.textContent=(((k=n.querySelector(".qe_title"))==null?void 0:k.textContent)||"Untitled").trim();let f=document.createElement("span");f.className="btfw-panel-playlist__meta",f.textContent=(((S=n.querySelector(".qe_time"))==null?void 0:S.textContent)||"").trim();let w=document.createElement("div");w.className="btfw-panel-playlist__actions";let g=C(n);if(g!=null&&g!==""){let j=document.createElement("button");j.type="button",j.className="btfw-panel-playlist__play",j.textContent="Play",j.dataset.queueUid=String(g),!(n==null?void 0:n.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(j.disabled=!0),w.appendChild(j)}a.append(i,f,w),e.appendChild(a)})}function Ge(e,t){let n=document.createElement("button");return n.type="button",n.className="btfw-panel-undock",n.dataset.panelGroup=e,n.setAttribute("aria-label",`Pin ${t.title} below video`),n.title="Pin below video",n.innerHTML=V.panelUndockIconHtml(),n}function lt(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=V.playlistAddFormHtml(),e}function ct(e,t,n){let a=document.createElement("div");if(a.className="btfw-panel-container",n>0&&(a.style.bottom=`${-n*50}px`),e==="playlist-group"){a.classList.add("btfw-panel-container--playlist");let f=document.createElement("div");f.className="btfw-panel-playlist__toolbar";let w=document.createElement("button");w.type="button",w.className="btfw-panel-playlist__add",w.textContent="+Add",w.setAttribute("aria-expanded","false");let g=Ge(e,t);f.append(w,g);let k=lt(),S=document.createElement("div");return S.className="btfw-panel-container__host btfw-panel-playlist__queue",a.append(f,k,S),a}a.classList.add("btfw-panel-container--dock-only");let i=document.createElement("div");return i.className="btfw-panel-container__dock-only",i.appendChild(Ge(e,t)),a.appendChild(i),a}function De(){O&&(clearTimeout(O),O=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{L(e)}),Le(),q=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function He(e){let t=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");t&&t.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),n&&(n.classList.toggle("is-expanded",e),n.setAttribute("aria-expanded",e?"true":"false")),e||De()}function dt(){He(!1)}function ut(){Te();let e=document.getElementById("btfw-panel-bar"),t=document.getElementById("btfw-panels-menu-btn");!e||!t||t.hidden||He(!e.classList.contains("open"))}function Ke(e){O&&clearTimeout(O),O=setTimeout(()=>{O=null;let t=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);t&&(t.matches(":hover")||t.querySelector(".btfw-panel-container:hover")||(t.classList.remove("is-active"),q===e&&(q=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function $e(e,t){if(t&&(O&&(clearTimeout(O),O=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(n=>{n!==t&&n.classList.remove("is-active")}),q=e,t.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let n=t.querySelector(".btfw-panel-playlist__queue");n&&(Fe(n),_e(n))}}function ft(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{q&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(t=>{delete t.dataset.btfwFlyoutLocked}),De()))}))}function Xe(e,t){var a;if(!((a=document.getElementById("btfw-panel-bar"))!=null&&a.classList.contains("open")))return;if(O&&(clearTimeout(O),O=null),t.dataset.btfwFlyoutLocked==="true"&&t.classList.contains("is-active")){delete t.dataset.btfwFlyoutLocked,t.classList.remove("is-active"),q===e&&(q=null,Le()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(i=>{i!==t&&delete i.dataset.btfwFlyoutLocked}),t.dataset.btfwFlyoutLocked="true",$e(e,t)}function mt(e,t){let n=e.querySelector(".btfw-panel-container"),a=()=>{var i;(i=document.getElementById("btfw-panel-bar"))!=null&&i.classList.contains("open")&&(O&&(clearTimeout(O),O=null),$e(t,e))};e.addEventListener("mouseenter",a),e.addEventListener("focusin",a),e.addEventListener("click",i=>{i.target.closest(".btfw-panel-container")||(i.preventDefault(),i.stopPropagation(),Xe(t,e))}),e.addEventListener("keydown",i=>{i.key!=="Enter"&&i.key!==" "||(i.preventDefault(),Xe(t,e))}),e.addEventListener("mouseleave",i=>{e.dataset.btfwFlyoutLocked!=="true"&&(n!=null&&n.contains(i.relatedTarget)||Ke(t))}),n==null||n.addEventListener("mouseenter",()=>{O&&(clearTimeout(O),O=null)}),n==null||n.addEventListener("mouseleave",i=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(i.relatedTarget)||Ke(t))})}function ze(){let e=Te();d();let t=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!t)return;let n=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((g,k)=>(H[g.dataset.bind]||99)-(H[k.dataset.bind]||99)),a=n.map(g=>g.dataset.bind).join("|"),i=document.getElementById("btfw-panels-menu-btn");if(i&&(i.hidden=n.length===0,n.length===0)){G="",dt();return}if(a===G&&t.childElementCount===n.length)return;G=a;let f=t.classList.contains("open"),w=q;if(De(),t.replaceChildren(),t.style.setProperty("--btfw-panel-bar-count",String(Math.max(n.length,1))),n.forEach((g,k)=>{let S=g.dataset.bind,j=l[S]||{short:"?",title:S},de=document.createElement("div");de.className="btfw-panel-btn",de.dataset.group=S,de.title=j.title,de.setAttribute("role","button"),de.setAttribute("aria-label",j.title),de.tabIndex=0;let U=document.createElement("span");U.className="btfw-panel-btn__label",U.textContent=_[S]||j.short,de.appendChild(U),de.appendChild(ct(S,j,k)),t.appendChild(de),mt(de,S)}),f&&(He(!0),w&&n.some(k=>k.dataset.bind===w))){let k=t.querySelector(`.btfw-panel-btn[data-group="${w}"]`);k&&$e(w,k)}}function We(e,t,n={}){if(!e)return;let a=!!t,i=n.persist===!1,f=e.dataset.bind,w=r[f];e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let g=e.querySelector(".btfw-stack-dock-btn");g&&(g.setAttribute("aria-pressed",a?"true":"false"),g.title=a?"Pinned to panels menu":"Dock to panels menu"),a?B(e)?L(e):q===f&&(q=null):(L(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!i&&w&&b(w,a),ze(),J()}function Qe(e,t){var k;let n=r[t];if(!n)return;let a=e.querySelector(".btfw-stack-item__header"),i=a==null?void 0:a.querySelector(".btfw-stack-header-toolbar"),f=i==null?void 0:i.querySelector(".btfw-stack-arrows");if(!f||f.querySelector(".btfw-stack-dock-btn"))return;let w=m(n);e.dataset.docked=w?"true":"false",e.classList.toggle("btfw-stack-item--docked",w);let g=document.createElement("button");g.type="button",g.className="btfw-arrow btfw-stack-dock-btn",g.textContent="\u2AF7",g.setAttribute("aria-label",`Dock ${((k=l[t])==null?void 0:k.title)||t} to panels menu`),g.setAttribute("aria-pressed",w?"true":"false"),g.title=w?"Pinned to panels menu":"Dock to panels menu",g.addEventListener("click",S=>{S.preventDefault(),S.stopPropagation(),e.dataset.docked!=="true"&&We(e,!0)}),f.insertBefore(g,f.firstChild)}function qt(){return he(p)}function Ft(e){le(p,e)}function Dt(){return he(o)}function Ht(e){le(o,e)}function pt(e,t={}){let{storageKey:n,getDefaultOpen:a,toggleClass:i,ariaLabel:f="Toggle panel visibility",openTitle:w="Hide panel",closeTitle:g="Show panel"}=t,k=he(n),S=typeof a=="function"?a(k):k!==null?k:!0;e.hasAttribute("data-open")||(e.dataset.open=S?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let j=e.querySelector(".btfw-stack-item__header"),de=j&&j.querySelector(".btfw-stack-arrows");if(!de||de.querySelector(`.${i}`))return;let U=document.createElement("button");U.type="button",U.className=`btfw-arrow ${i}`,U.setAttribute("aria-label",f),U.style.display="flex",U.style.alignItems="center",U.style.justifyContent="center";let ee=()=>{let ye=e.dataset.open!=="false";U.textContent=ye?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",U.title=ye?w:g,U.setAttribute("aria-expanded",ye?"true":"false"),e.classList.toggle("is-open",ye)},F=(ye,Pe={})=>{let se=!!ye,xe=Pe.persist===!1;xe&&(e._btfwSuppressPersist=!0),e.dataset.open=se?"true":"false",ee(),xe||le(n,se),xe&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};U.addEventListener("click",ye=>{ye.preventDefault(),ye.stopPropagation(),F(e.dataset.open==="false")}),ee(),new MutationObserver(ye=>{for(let Pe of ye)Pe.type==="attributes"&&(ee(),e._btfwSuppressPersist||le(n,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),de.insertBefore(U,de.firstChild),e._btfwSetOpenState=F,Qe(e,e.dataset.bind)}function Be(){let e=document.getElementById("pollwrap");if(!e)return null;if(!e.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return e;let n=document.getElementById("btfw-poll-parking");return n||(n=document.createElement("div"),n.id="btfw-poll-parking",n.hidden=!0,n.setAttribute("aria-hidden","true"),document.body.appendChild(n)),n.appendChild(e),e}function je(e){be();let t=document.getElementById("motdwrap");if(!t)return;let n=e&&e.list;if(!n)return;let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(a){let i=a.querySelector(".btfw-group-body");i&&!i.contains(t)&&i.appendChild(t)}else{let i=R.find(f=>f.id==="motd-group");if(!i)return;a=N(i,[t]),a&&(n.appendChild(a),I(n))}bt(a)}function bt(e){let t=document.getElementById("motdwrap");if(!t)return;let n=E();if(t.classList.toggle("btfw-motd-empty",!n),t.toggleAttribute("hidden",!n),t.setAttribute("aria-hidden",n?"false":"true"),n){t.style.removeProperty("display");let a=P();a&&a.style.removeProperty("display")}if(e||(e=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),e&&n){let a=he(Q),i=Ae(a,!0);e._btfwSetOpenState?e._btfwSetOpenState(i,{persist:!1}):(e.dataset.open=i?"true":"false",e.classList.toggle("is-open",i))}}function Ue(e){oe&&clearTimeout(oe),oe=setTimeout(()=>{oe=null,je(e)},50)}function ht(e){let t=P();t&&(X||(X=!0,new MutationObserver(()=>{Ue(e)}).observe(t,{childList:!0,subtree:!0,characterData:!0})))}function yt(e){Ee||!window.socket||!window.socket.on||(Ee=!0,window.socket.on("setMotd",t=>{let n=typeof t=="string"?t:t&&typeof t.motd=="string"?t.motd:null,a=P();if(a){let i=n!==null?n:a.innerHTML,f=Ne(i);a.innerHTML!==f&&(a.innerHTML=f)}Ue(e)}))}function Ze(e){let t=pe(),n=document.getElementById("motdwrap");n&&delete n.dataset.btfwMotdNormalized;let a=be(!0),i=(a==null?void 0:a.motd)||P();i&&typeof e=="string"&&(i.innerHTML=Ne(e));let f=document.getElementById("cs-motdtext");f&&typeof e=="string"&&(f.value=e),t&&Ue(t)}function Ve(e){let t=document.getElementById("pollwrap");if(!t)return;let n=t.dataset&&t.dataset.btfwPollOverlay,a=t.getAttribute&&t.getAttribute("data-btfw-poll-overlay");if(n==="video"||a==="video")return;Be(),Ye();let i=e&&e.list;if(!i)return;let f=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!f){let k=R.find(S=>S.id==="poll-group");if(!k)return;f=N(k,[t]),f&&(i.appendChild(f),I(i));return}let w=f.querySelector(".btfw-group-body");w&&!w.contains(t)&&w.appendChild(t);let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&g.contains(t)&&w&&w.appendChild(t)}function Je(e,t={}){Ve(e),Re();let n=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');n&&(n.hidden=!1,n.removeAttribute("hidden"),t.forceOpen&&n._btfwSetOpenState?n._btfwSetOpenState(!0,{persist:!1}):t.forceOpen&&(n.dataset.open="true",n.classList.add("is-open")))}function Oe(e,t={}){z&&clearTimeout(z),z=setTimeout(()=>{z=null,Je(e,t)},50)}function gt(e){if($)return;let t=document.getElementById("pollwrap");if(!t)return;$=!0,new MutationObserver(()=>{Oe(e,{forceOpen:Me()})}).observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let a=document.getElementById("newpollbtn");a&&!a.dataset.btfwPollSync&&(a.dataset.btfwPollSync="1",a.addEventListener("click",()=>{Oe(e,{forceOpen:!0})}))}function wt(e){ne||!window.socket||!window.socket.on||(ne=!0,window.socket.on("newPoll",()=>Oe(e,{forceOpen:!0})),window.socket.on("closePoll",()=>Oe(e)))}function vt(e){return!!e.closest('.modal, [role="dialog"]')}function et(e){if(!e||e.querySelector("#btfw-footer"))return;let t=document.getElementById("btfw-footer");if(t&&t!==e&&!e.contains(t)){e.innerHTML="",e.appendChild(t);return}let n=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(a=>!vt(a));n&&!e.contains(n)&&(n.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(n))}function tt(e){let t=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),n=t==null?void 0:t.querySelector(".btfw-stack-item__header");if(!n)return null;let a=n.querySelector(".btfw-stack-header-actions");if(!a){a=document.createElement("span"),a.className="btfw-stack-header-actions";let i=n.querySelector(".btfw-stack-header-toolbar"),f=(i==null?void 0:i.querySelector(".btfw-stack-arrows"))||n.querySelector(".btfw-stack-arrows");i&&f?i.insertBefore(a,f):f?n.insertBefore(a,f):n.appendChild(a)}return a}function nt(e,t){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==t&&(e.innerHTML=t))}function Re(){let e=document.getElementById("pollwrap");if(!e)return;let t=!!e.closest(".btfw-panel-container__host"),n=!Me();if(t&&!n){e.classList.remove("btfw-poll-idle"),e.removeAttribute("hidden"),e.setAttribute("aria-hidden","false");return}e.classList.toggle("btfw-poll-idle",n),e.toggleAttribute("hidden",n),e.setAttribute("aria-hidden",n?"true":"false")}function ot(){let e=tt("poll-group"),t=document.getElementById("newpollbtn");if(e&&t){nt(t,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),t.parentElement!==e&&e.appendChild(t);let i=document.querySelector("#pollwrap > .poll-controls");i&&i.children.length===0&&i.remove()}let n=tt("motd-group"),a=document.getElementById("btfw-motd-editbtn");if(n&&a){nt(a,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),a.parentElement!==n&&n.appendChild(a);let i=a.closest(".btfw-motd-editrow");i&&i.parentElement&&i.remove()}}function Ye(){let e=document.getElementById("leftcontrols"),t=document.getElementById("pollwrap");e&&t&&(e.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(a=>{let i=t.querySelector(".poll-controls");i||(i=document.createElement("div"),i.className="poll-controls",t.insertBefore(i,t.firstChild)),a.parentElement!==i&&i.appendChild(a)}),e.children.length===0&&e.remove())}function Et(e){return R.every(t=>t.selectors.some(a=>{var f,w;if(Y.includes(a))return!1;let i=document.querySelector(a);if(!i||e.contains(i)||i.contains(e))return!1;if(a==="#pollwrap"){let g=(f=i.dataset)==null?void 0:f.btfwPollOverlay,k=(w=i.getAttribute)==null?void 0:w.call(i,"data-btfw-poll-overlay");if(g==="video"||k==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${t.id}"]`):!0)}function qe(e){if(!ce){ce=!0;try{let t=e.list,n=e.footer;if(Et(t)&&t.children.length>0){je(e),Ve(e),Re(),ot(),et(n);return}Ye(),Be();let a=new Map;R.forEach(w=>{let g=[];w.selectors.forEach(k=>{let S=document.querySelector(k);if(S&&!(t.contains(S)||S.contains(t))&&!Y.includes(k)){if(k==="#pollwrap"){let j=S.dataset&&S.dataset.btfwPollOverlay,de=S.getAttribute&&S.getAttribute("data-btfw-poll-overlay");if(j==="video"||de==="video")return}g.push(S)}}),g.length>0&&a.set(w.id,{group:w,elements:g})});let i=W(),f=[];a.forEach(({group:w,elements:g},k)=>{if(!Array.from(t.children).find(j=>j.dataset.bind===k))try{let j=N(w,g);j&&f.push({item:j,id:k,priority:w.priority,isGroup:!0})}catch(j){console.warn("[stack] Failed to create group item:",k,j)}}),i.length>0?f.sort((w,g)=>{let k=i.findIndex(j=>j.id===w.id),S=i.findIndex(j=>j.id===g.id);return k>=0&&S>=0?k-S:k>=0?-1:S>=0?1:w.priority-g.priority}):f.sort((w,g)=>w.priority-g.priority),f.forEach(({item:w})=>{try{w&&!t.contains(w)&&!w.contains(t)&&t.appendChild(w)}catch(g){console.warn("[stack] Failed to add item to list:",g)}}),I(t),je(e),Ve(e),Re(),ot(),et(n)}finally{ce=!1}}}function it(){let e=pe();if(!e||(qe(e),ht(e),yt(e),gt(e),wt(e),Se))return;Se=!0;let t=new MutationObserver(()=>{we||(we=requestAnimationFrame(()=>{we=null,qe(e)}))}),n=document.getElementById("btfw-leftpad"),a=document.getElementById("main");n&&t.observe(n,{childList:!0,subtree:!1}),a&&t.observe(a,{childList:!0,subtree:!1}),setTimeout(()=>{let w=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');w&&v(w,Q,S=>Ae(S,E()));let g=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');g&&v(g,p,S=>S!==null?!!S:!0);let k=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');k&&v(k,o,S=>Ae(S,Me())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(S=>{let j=r[S.dataset.bind];j&&We(S,m(j),{persist:!1})}),Te(),d(),ze(),Je(e),J()},1e3);let i=0,f=setInterval(()=>{qe(e),++i>2&&clearInterval(f)},700)}return document.addEventListener("btfw:layoutReady",it),document.addEventListener("btfw:chat:barsReady",()=>{Te(),d(),ze()}),setTimeout(it,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=pe();e&&setTimeout(()=>qe(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.html;typeof t=="string"&&Ze(t)}),{name:"feature:stack",hasMotdContent:E,resolveMotdHost:P,normalizeMotdStructure:be,applyMotdUpdate:Ze}});BTFW.define("feature:videoOverlay",[],async()=>{let T=(s,d=document)=>d.querySelector(s),M=["#mediarefresh","#voteskip","#fullscreenbtn"],V={localSubs:"btfw:video:localsubs"},y=5,Q={owner:["chanowner","owner","founder","admin","administrator"]};function p(){var s;try{return((s=window.PLAYER)==null?void 0:s.mediaType)||null}catch(d){return null}}function o(){let s=(p()||"").toLowerCase();return s==="fi"||s==="gd"}function r(){try{return window.CLIENT||window.client||null}catch(s){return null}}function h(){try{return window.CHANNEL||window.channel||null}catch(s){return null}}function l(){let s=h();if(s&&typeof s.perms=="object"&&s.perms)return s.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(d){return{}}}function _(s=[]){let d=l();for(let C of s){let A=d==null?void 0:d[C];if(typeof A=="number")return A}}function H(){let s=_(Q.owner);return typeof s=="number"?s:y}function K(s){if(!s)return!1;try{if(typeof s.hasPermission=="function"&&s.hasPermission("chanowner"))return!0}catch(d){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(d){}return!1}function q(){let s=r();if(!s)return!1;let d=Number(s.rank);return Number.isFinite(d)?!!(d>=H()||K(s)):!1}let G=()=>{try{return localStorage.getItem(V.localSubs)!=="0"}catch(s){return!0}},O=s=>{try{localStorage.setItem(V.localSubs,s?"1":"0")}catch(d){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!s}}))},D=0,Z=0,re=0,z=2e3,$=8e3,ne=45e3,oe=12e4,X=$,Ee=!1,ce=null;function we(){if(T("#btfw-vo-css"))return;let s=document.createElement("style");s.id="btfw-vo-css",s.textContent=`
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
    `,document.head.appendChild(s)}function Se(s){let d=T("#videowrap");!d||!s||((s.parentElement!==d.parentElement||s.previousElementSibling!==d)&&d.insertAdjacentElement("afterend",s),s.classList.add("btfw-vo-visible"))}function ue(){if(!T("#videowrap"))return null;let d=T("#btfw-video-overlay");d||(d=document.createElement("div"),d.id="btfw-video-overlay",d.setAttribute("data-testid","btfw-video-overlay")),d.classList.add("btfw-video-overlay"),d.getAttribute("data-testid")||d.setAttribute("data-testid","btfw-video-overlay"),Se(d);let C=d.querySelector("#btfw-vo-bar");C||(C=document.createElement("div"),C.className="btfw-vo-bar",C.id="btfw-vo-bar",d.appendChild(C));let A=P(d,C);return J(A.left),c(A),N(A),E(d),d}function E(s){s&&s.querySelectorAll("button").forEach(d=>{d.classList.contains("btfw-vo-btn")||d.classList.add("btfw-vo-btn")})}function P(s,d){let C="btfw-vo-left",A="btfw-vo-right",te=d.querySelector(`#${C}`);te||(te=document.createElement("div"),te.id=C,te.className="btfw-vo-section btfw-vo-section--left",d.insertBefore(te,d.firstChild));let ae=d.querySelector(`#${A}`);return ae||(ae=document.createElement("div"),ae.id=A,ae.className="btfw-vo-section btfw-vo-section--right",d.appendChild(ae)),Array.from(d.children).forEach(ve=>{ve===te||ve===ae||ae.appendChild(ve)}),s.dataset.leftSection=`#${C}`,s.dataset.rightSection=`#${A}`,d.dataset.leftSection=`#${C}`,d.dataset.rightSection=`#${A}`,{left:te,right:ae}}function R(){return document.querySelector("#ytapiplayer video, video")}function Y(s=R()){return s?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof s.webkitShowPlaybackTargetPicker=="function":!1}function fe(){if(!ce)return;let s=ce._btfwAirplayHandler;if(s){try{ce.removeEventListener("webkitplaybacktargetavailabilitychanged",s)}catch(d){}delete ce._btfwAirplayHandler}ce=null}function me(s){if(!s||typeof s.addEventListener!="function"){fe();return}if(ce===s)return;fe();let d=C=>{let A=!C||C.availability==="available",te=T("#btfw-airplay");te&&(te.style.display=A?"":"none")};try{s.addEventListener("webkitplaybacktargetavailabilitychanged",d),s._btfwAirplayHandler=d,ce=s}catch(C){}}function pe(){let s=T("#btfw-airplay");if(!s)return;let d=R();if(!Y(d)){s.style.display="none",fe();return}s.style.display="",me(d)}function be(s,d){d&&d.classList.add("btfw-vo-visible")}function c(s){if(!(s!=null&&s.right)||!(s!=null&&s.left))return;let d=[];document.querySelector("#fullscreenbtn")||d.push({id:"btfw-fullscreen",icon:"fas fa-expand",tooltip:"Fullscreen",action:he,section:"right"}),d.push({id:"btfw-airplay",icon:"fas fa-cast",tooltip:"AirPlay",action:b,section:"right"}),d.forEach(C=>{let A=document.querySelector(`#${C.id}`),te=C.section==="left"?s.left:s.right;if(A)te&&A.parentElement!==te&&te.appendChild(A);else{A=document.createElement("button"),A.id=C.id,A.className="btfw-vo-btn";let ae=document.createElement("i");ae.className=C.icon,A.appendChild(ae),A.title=C.tooltip,A.addEventListener("click",C.action),(te||s.right).appendChild(A)}}),pe()}function N(s){let d=s==null?void 0:s.right;d&&M.forEach(C=>{let A=document.querySelector(C);if(!A)return;if(A.dataset.btfwOverlay==="1"){A.parentElement!==d&&d.appendChild(A);return}let te=document.createElement("span");te.hidden=!0,te.setAttribute("data-btfw-ph",C);try{A.insertAdjacentElement("afterend",te)}catch(ae){}if(A.classList.add("btfw-vo-adopted"),A.dataset.btfwOverlay="1",A.id==="mediarefresh"){let ae=A.onclick;A.onclick=ve=>{ve.preventDefault();let Le=!!(ve&&ve.isTrusted);W(()=>{if(typeof ae=="function")try{return ae.call(A,ve),!0}catch(_e){console.warn("[video-overlay] native refresh handler failed:",_e)}return!1},{isUserAction:Le})}}d.appendChild(A)})}function I(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(s){console.warn("[video-overlay] Media refresh failed:",s)}return!1}function W(s,d={}){let{isUserAction:C=!1}=d,A=Date.now();if(re&&A-re>oe&&(X=$,D=0),A<Z){let _e=Math.ceil((Z-A)/1e3);return x(C?`Refresh available in ${_e}s`:`Auto refresh paused. Next attempt in ${_e}s`,"warning"),!1}let te=C?z:X;if(re&&A-re<te){let _e=te-(A-re),Ie=Math.ceil(_e/1e3);return Z=A+_e,x(C?`Refresh available in ${Ie}s`:`Auto refresh paused. Next attempt in ${Ie}s`,"warning"),!1}if(D++,D>=10)return Z=A+3e4,D=0,x("Refresh limit reached. 30s cooldown active.","error"),!1;let ae=C?6e3:Math.max(12e3,X+2e3);setTimeout(()=>{D>0&&D--},ae);let ve=!1;if(typeof s=="function")try{ve=s()===!0}catch(_e){console.warn("[video-overlay] Refresh handler error:",_e)}return ve||(ve=I()),re=Date.now(),C?X=$:X=Math.min(ne,Math.max($,Math.round(X*(ve?1.25:1.5)))),Z=Math.max(Z,re+(C?z:X)),!C&&ve?x(`Auto refresh sent. Next attempt in ${Math.ceil(X/1e3)}s`,"info"):x(ve?"Media refreshed":"Unable to refresh media",ve?"success":"error"),ve}function he(){let s=T("#videowrap");s&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():s.requestFullscreen?s.requestFullscreen():s.webkitRequestFullscreen?s.webkitRequestFullscreen():s.mozRequestFullScreen&&s.mozRequestFullScreen())}function le(s,d=!0){if(!s||!Y(s))return!1;if(s.setAttribute("airplay","allow"),s.setAttribute("x-webkit-airplay","allow"),d&&typeof s.webkitShowPlaybackTargetPicker=="function")try{s.webkitShowPlaybackTargetPicker()}catch(C){console.warn("[video-overlay] AirPlay picker failed:",C)}return pe(),!0}function m(){if(!(Ee||!window.socket)){Ee=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let s=R();s&&(le(s,!1),me(s)),pe()},1e3)})}catch(s){console.warn("[video-overlay] Failed to attach AirPlay listener:",s)}}}function b(){let s=R();return Y(s)?le(s)?(x("AirPlay enabled","success"),m(),!0):(x("AirPlay not available","warning"),!1):(pe(),x("AirPlay not available","warning"),!1)}function x(s,d="info"){let C=document.getElementById("btfw-notification");C||(C=document.createElement("div"),C.id="btfw-notification",C.className="btfw-notification",document.body.appendChild(C)),C.textContent=s,C.className=`btfw-notification btfw-notification--${d} btfw-notification--show`,clearTimeout(C._hideTimer),C._hideTimer=setTimeout(()=>{C.classList.remove("btfw-notification--show")},3e3)}function B(){return T("video")}function ie(s){let d=(s||"").replace(/\r\n/g,`
`).trim()+`
`;return d=d.replace(/^\d+\s*$\n/gm,""),d=d.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),d=d.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+d}async function u(){let s=B();if(!s){v("Local subs only for HTML5 sources.");return}let d=document.createElement("input");d.type="file",d.accept=".vtt,.srt,text/vtt,text/plain",d.style.display="none",document.body.appendChild(d);let C=new Promise(A=>{d.addEventListener("change",async()=>{let te=d.files&&d.files[0];if(document.body.removeChild(d),!te)return A(!1);try{let ae=await te.text(),Le=(te.name.split(".").pop()||"").toLowerCase()==="srt"?ie(ae):ae.startsWith("WEBVTT")?ae:`WEBVTT

`+ae,_e=URL.createObjectURL(new Blob([Le],{type:"text/vtt"}));L(s,_e,te.name.replace(/\.[^.]+$/,"")||"Local"),v("Subtitles loaded."),A(!0)}catch(ae){console.error(ae),v("Failed to load subtitles."),A(!1)}},{once:!0})});d.click(),await C}function L(s,d,C){var te;(te=T('track[data-btfw="1"]',s))==null||te.remove();let A=document.createElement("track");A.kind="subtitles",A.label=C||"Local",A.srclang="en",A.src=d,A.default=!0,A.setAttribute("data-btfw","1"),s.appendChild(A);try{for(let ae of s.textTracks)ae.mode=ae.label===A.label?"showing":"disabled"}catch(ae){}}function v(s){let d=T("#btfw-mini-toast");d||(d=document.createElement("div"),d.id="btfw-mini-toast",document.body.appendChild(d)),d.textContent=s,d.style.opacity="1",clearTimeout(d._hid),d._hid=setTimeout(()=>d.style.opacity="0",1400)}function J(s){if(!s)return;let d=document.querySelector("#btfw-vo-subs");if(!d){d=document.createElement("button"),d.id="btfw-vo-subs",d.className="btfw-vo-btn",d.title="Load local subtitles (.vtt/.srt)";let A=document.createElement("i");A.className="fa fa-closed-captioning",d.appendChild(A),d.addEventListener("click",te=>{te.preventDefault(),u()}),s.insertBefore(d,s.firstChild||null)}let C=G()&&o();d.style.display=C?"":"none"}function Te(){we(),ue();let s=[T("#videowrap"),T("#rightcontrols"),T("#leftcontrols"),document.body].filter(Boolean),d=new MutationObserver(()=>ue());s.forEach(C=>d.observe(C,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>ue());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>ue(),0)})}catch(C){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Te):Te(),{name:"feature:videoOverlay",setLocalSubsEnabled:O,toggleFullscreen:he,enableAirplay:b}});(function(){"use strict";let y="https://vidprox.movies-storage-a.workers.dev/?url=";function Q(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function p(){return Date.now()}window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var r,h,l;let o=typeof window!="undefined"&&(((r=window.BTFW_CONFIG)==null?void 0:r.corsVideoProxy)||((l=(h=window.BTFW_CONFIG)==null?void 0:h.integrations)==null?void 0:l.corsVideoProxy));if(typeof o=="string"&&o.trim()){let _=o.trim();if(_.includes("?"))return _;let H=_.endsWith("/")?"":"/";return`${_}${H}?url=`}return y},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(o){try{return new URL(y).origin.toLowerCase()}catch(r){return""}}},_isTrusted(o){if(!o)return!1;if(String(o).includes(this.CORS_PROXY))return!0;try{let r=new URL(o),h=r.origin.toLowerCase(),l=this._getCorsProxyOrigin();return l&&h===l?!0:/^vidprox\./i.test(r.hostname)}catch(r){return!1}},_unwrapProxiedUrl(o){if(!o||!this._isTrusted(o))return o;try{return new URL(o).searchParams.get("url")||o}catch(r){return o}},_markInternalSrcSet(){this._lastInternalSrcSetAt=p()},_isInsideInternalWindow(){return p()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let o=this._getMediaElement();return o?o.crossOrigin==="anonymous"||o.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var r,h,l,_;if(this._hasAnonymousCrossOrigin())return!1;let o=((h=(r=this.player)==null?void 0:r.currentSrc)==null?void 0:h.call(r))||((l=this._getMediaElement())==null?void 0:l.currentSrc)||"";if(o&&!this._isTrusted(o))return!1;try{return(_=this.player)==null||_.crossOrigin("anonymous"),!0}catch(H){return!1}},_clearMediaElementForCorsSwap(){let o=this._getMediaElement();if(o)try{for(o.removeAttribute("src"),o.removeAttribute("crossorigin");o.firstChild;)o.removeChild(o.firstChild);o.load()}catch(r){}},_same(o,r){return String(o||"")===String(r||"")},_getMediaElement(){var h;let o=(h=this.player)==null?void 0:h.tech_;if(o){try{let l=typeof o.el=="function"?o.el():null;if(l instanceof HTMLMediaElement&&l.isConnected)return l}catch(l){}if(o.el_ instanceof HTMLMediaElement&&o.el_.isConnected)return o.el_}let r=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return r instanceof HTMLMediaElement&&r.isConnected?r:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(o){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(o){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(o){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(o){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(o){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(o){}this.mergerNode=null}},resetMediaBinding(){var r,h;this.disconnectChain();let o=this._getMediaElement();if(o&&this._syncFromRegistry(o)){((r=this.audioContext)==null?void 0:r.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((h=this.audioContext)==null?void 0:h.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(o){var K;let r=(K=this.player)==null?void 0:K.tech_;if(!(r!=null&&r.el_)||r.el_!==o)return null;let h=o.parentNode;if(!h)return null;let l=o.tagName.toLowerCase()==="audio"?"audio":"video",_=document.createElement(l);_.className=o.className,o.id&&(_.id=o.id),_.setAttribute("playsinline",""),_.setAttribute("webkit-playsinline",""),_.classList.contains("vjs-tech")||_.classList.add("vjs-tech");let H=o.crossOrigin||o.getAttribute("crossorigin");return H&&(_.crossOrigin=H,_.setAttribute("crossorigin",H)),h.replaceChild(_,o),r.el_=_,delete o.__btfwSourceNode,_},_syncFromRegistry(o){let r=Q().get(o)||o.__btfwSourceNode||null;return r?(Q().set(o,r),this.sourceNode=r,this._sourceMediaElement=o,r.context&&r.context.state!=="closed"&&(this.audioContext=r.context),r):null},_getOrCreateSourceNode(o){var _;let r=Q(),h=r.get(o)||o.__btfwSourceNode||null;if(h)return r.set(o,h),this.sourceNode=h,this._sourceMediaElement=o,h.context&&h.context.state!=="closed"&&(this.audioContext=h.context),h;if(this.sourceNode&&this._sourceMediaElement===o)return r.set(o,this.sourceNode),o.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let l;try{l=this.audioContext.createMediaElementSource(o)}catch(H){if((H==null?void 0:H.name)!=="InvalidStateError")throw H;let K=this._syncFromRegistry(o);if(K)return K;let q=this._swapVideoTechElement(o);if(!q)throw H;let G=(_=this.player)==null?void 0:_.currentSrc();if(G&&this.player){this._markInternalSrcSet(),this.player.src({src:G,type:"video/mp4"});try{this.player.load()}catch(O){}}return this._getOrCreateSourceNode(q)}return r.set(o,l),o.__btfwSourceNode=l,this.sourceNode=l,this._sourceMediaElement=o,l},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(o){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(o){return!1}},_clearCrossOriginAttribute(){var r,h;let o=this._getMediaElement();if(o)try{o.crossOrigin=null,o.removeAttribute("crossorigin")}catch(l){}try{(h=(r=this.player)==null?void 0:r.crossOrigin)==null||h.call(r,null)}catch(l){}},cleanup(){this.disconnectChain();let o=this._getMediaElement();o&&(o.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){var r,h;this.cleanup();let o=((h=(r=this.player)==null?void 0:r.currentSrc)==null?void 0:h.call(r))||"";return this.sourceNode&&o&&!this._isTrusted(o)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(o,{currentTime:r=0,wasPlaying:h=!1,clearCrossOrigin:l=!1}={}){if(!this.player||!o)return Promise.resolve(!1);try{this.player.pause()}catch(_){}l&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(_){}return new Promise(_=>{let H=!1,K=()=>{if(H)return;H=!0;try{this.player.off("canplay",q)}catch(O){}try{this.player.off("loadeddata",q)}catch(O){}try{this.player.currentTime(r)}catch(O){}let G=h?this.player.play():Promise.resolve();Promise.resolve(G).catch(()=>{}).finally(()=>_(!0))},q=()=>K();try{this.player.one("canplay",q)}catch(G){try{this.player.on("canplay",q)}catch(O){}}try{this.player.one("loadeddata",q)}catch(G){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&K()}catch(G){}}),setTimeout(K,5e3)})},startWatchdog(){if(!this.player)return;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let r=new MutationObserver(()=>{this._checkAndReapply("sources")});r.observe(o,{childList:!0,subtree:!0}),this._mutationObserver._sourceObserver=r}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([r,h])=>{this.player.on(r,h)})}catch(r){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this.player.currentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;if(this._stopWatchdogInterval(),this._mutationObserver){try{this._mutationObserver.disconnect()}catch(r){}try{(o=this._mutationObserver._sourceObserver)==null||o.disconnect()}catch(r){}this._mutationObserver=null}if(this.player&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([r,h])=>{this.player.off(r,h)})}catch(r){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(o){if(!this.player)return;let r=this.player.currentSrc();if(r&&(this._lastKnownSrc=r,!this._isInsideInternalWindow())){if(this._isTrusted(r)){this.isProxied=!0,this.proxiedSrc=r,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(r)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(p()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=p(),this._forceProxyPreservingState(r)}}},async _forceProxyPreservingState(o){if(!this.player)return!1;let r=this.player.currentTime(),h=!this.player.paused();if(this._isTrusted(o))return this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(o)||o,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(l){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(l){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(l){}return new Promise(l=>{let _=!1,H=()=>{if(!_){_=!0;try{this.player.off("canplay",K)}catch(q){}try{this.player.off("loadeddata",K)}catch(q){}try{this.player.currentTime(r)}catch(q){}this.isProxied=!0,h&&this.player.play().catch(()=>{}),l(!0)}},K=()=>H();try{this.player.one("canplay",K)}catch(q){try{this.player.on("canplay",K)}catch(G){}}try{this.player.one("loadeddata",K)}catch(q){}typeof this.player.ready=="function"&&this.player.ready(()=>{try{typeof this.player.readyState=="function"&&this.player.readyState()>=2&&H()}catch(q){}}),setTimeout(H,5e3)})},async ensureProxy(){if(!this.player)return!1;let o=this.player.currentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let r=this.player.currentTime(),h=!this.player.paused();try{this.player.pause()}catch(l){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),this.player.src({src:o,type:"video/mp4"});try{this.player.load()}catch(l){}return new Promise(l=>{this.player.ready(()=>{try{this.player.currentTime(r)}catch(_){}h&&this.player.play().catch(()=>{}),l(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var r;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let h=this.player.currentSrc();if(this._isTrusted(h))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this.player.currentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let o=this._getMediaElement();if(!o)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((r=this.audioContext)==null?void 0:r.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),o.disableRemotePlayback=!0;let l=this._getOrCreateSourceNode(o);if(this.normalizationEnabled){this.compressorNode=this.audioContext.createDynamicsCompressor();let _=this.NORM_PRESETS[this.currentNormPreset];this.compressorNode.threshold.setValueAtTime(_.threshold,this.audioContext.currentTime),this.compressorNode.knee.setValueAtTime(_.knee,this.audioContext.currentTime),this.compressorNode.ratio.setValueAtTime(_.ratio,this.audioContext.currentTime),this.compressorNode.attack.setValueAtTime(_.attack,this.audioContext.currentTime),this.compressorNode.release.setValueAtTime(_.release,this.audioContext.currentTime),l.connect(this.compressorNode),l=this.compressorNode}return this.monoEnabled&&(this.splitterNode=this.audioContext.createChannelSplitter(2),this.monoMixGain=this.audioContext.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=this.audioContext.createChannelMerger(2),l.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),l=this.mergerNode),this.boostEnabled&&(this.gainNode=this.audioContext.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,l.connect(this.gainNode),l=this.gainNode),l.connect(this.audioContext.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(h){return console.error("[BTFW_AUDIO] Error building audio chain:",h),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(o){return this.NORM_PRESETS[o]?(this.currentNormPreset=o,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(o){return this.BOOST_MULTIPLIER=o,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let o=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),o}return this._disableAllProcessing()}}})();(function(){"use strict";let T=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),M=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),V="--btfw-boost-anchor",y="--btfw-norm-anchor";function Q(o,r,h){if(M&&h){r.style.setProperty("anchor-name",h),o.style.setProperty("position-anchor",h),o.style.setProperty("top","anchor(bottom)"),o.style.setProperty("left","anchor(left)");return}let l=r.getBoundingClientRect();o.style.left=l.left+"px",o.style.top=l.bottom+"px"}function p(o){window.BTFW&&typeof BTFW.define=="function"?o():setTimeout(()=>p(o),0)}p(function(){BTFW.define("feature:audio",[],async()=>{let o=(u,L=document)=>L.querySelector(u),r=window.BTFW_AUDIO,h=null,l=null,_=null,H=!1,K=!1,q=!1,G=null,O=null,D=null,Z=null,re=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function z(u){h&&(u?(h.classList.add("active"),h.style.background="rgba(46, 213, 115, 0.3)",h.style.borderColor="#2ed573",h.style.color="#2ed573",h.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(h.classList.remove("active"),h.style.background="",h.style.borderColor="",h.style.color="",h.style.boxShadow=""))}function $(u,L="info"){let v=o("#btfw-audioboost-toast");v||(v=document.createElement("div"),v.id="btfw-audioboost-toast",v.style.cssText=`
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function ne(){if(await r.enableBoost()){H=!0;let L=Math.round(r.BOOST_MULTIPLIER*100);$(`Boosted by ${L}%`,"success"),z(!0)}else{let L=r._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";$(L,"error")}}async function oe(){await r.disableBoost(),H=!1,z(!1)}function X(u){l&&(u?(l.classList.add("active"),l.style.background="rgba(52, 152, 219, 0.3)",l.style.borderColor="#3498db",l.style.color="#3498db",l.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(l.classList.remove("active"),l.style.background="",l.style.borderColor="",l.style.color="",l.style.boxShadow=""))}function Ee(u,L="info"){let v=o("#btfw-audionorm-toast");v||(v=document.createElement("div"),v.id="btfw-audionorm-toast",v.style.cssText=`
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function ce(){if(await r.enableNormalization())K=!0,Ee("Normalization enabled","success"),X(!0);else{let L=r._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";Ee(L,"error")}}async function we(){await r.disableNormalization(),K=!1,X(!1)}function Se(u){_&&(u?(_.classList.add("active"),_.style.background="rgba(155, 89, 182, 0.3)",_.style.borderColor="#9b59b6",_.style.color="#9b59b6",_.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(_.classList.remove("active"),_.style.background="",_.style.borderColor="",_.style.color="",_.style.boxShadow=""))}function ue(u,L="info"){let v=o("#btfw-mono-toast");v||(v=document.createElement("div"),v.id="btfw-mono-toast",v.style.cssText=`
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
          `,document.body.appendChild(v)),v.textContent=u,v.style.background=L==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",v.style.opacity="1",setTimeout(()=>{v.style.opacity="0"},2e3)}async function E(){if(await r.enableMono())q=!0,ue("Stereo audio enabled","success"),Se(!0);else{let L=r._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";ue(L,"error")}}async function P(){await r.disableMono(),q=!1,Se(!1)}function R(){let u=document.createElement("button");u.id="btfw-vo-audioboost",u.className="btn btn-sm btn-default btfw-vo-adopted";let L=Math.round(r.BOOST_MULTIPLIER*100);u.title=`Toggle Audio Boost (${L}%)`,u.setAttribute("data-btfw-overlay","1");let v=document.createElement("i");return v.className="fa-solid fa-megaphone",u.appendChild(v),u.addEventListener("click",()=>{r.boostEnabled?oe():ne()}),u.addEventListener("mouseenter",()=>{D&&(clearTimeout(D),D=null),pe()}),u.addEventListener("mouseleave",()=>{D=setTimeout(()=>be(),150)}),u}function Y(){let u=document.createElement("button");u.id="btfw-vo-audionorm",u.className="btn btn-sm btn-default btfw-vo-adopted";let L=r.NORM_PRESETS[r.currentNormPreset].label;u.title=`Toggle Audio Normalization (${L})`,u.setAttribute("data-btfw-overlay","1");let v=document.createElement("i");return v.className="fa-solid fa-waveform-lines",u.appendChild(v),u.addEventListener("click",()=>{r.normalizationEnabled?we():ce()}),u.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null),I()}),u.addEventListener("mouseleave",()=>{Z=setTimeout(()=>W(),150)}),u}function fe(){let u=document.createElement("button");u.id="btfw-vo-mono",u.className="btn btn-sm btn-default btfw-vo-adopted",u.title="Toggle Mono Audio (mix both channels to stereo)",u.setAttribute("data-btfw-overlay","1");let L=document.createElement("i");return L.className="fa-solid fa-headphones",u.appendChild(L),u.addEventListener("click",()=>{r.monoEnabled?P():E()}),u}function me(){if(G)return G;let u=document.createElement("div");return u.id="btfw-boost-context-menu",T&&(u.popover="auto"),u.style.cssText=`
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
          `,r.BOOST_MULTIPLIER===L.multiplier&&(v.style.background="rgba(46, 213, 115, 0.2)",v.style.color="#2ed573"),v.addEventListener("mouseenter",()=>{r.BOOST_MULTIPLIER!==L.multiplier&&(v.style.background="rgba(109, 77, 246, 0.2)")}),v.addEventListener("mouseleave",()=>{r.BOOST_MULTIPLIER!==L.multiplier&&(v.style.background="transparent")}),v.addEventListener("click",async()=>{if(await r.setBoostMultiplier(L.multiplier),c(),h){let J=Math.round(L.multiplier*100);h.title=`Toggle Audio Boost (${J}%)`}r.boostEnabled&&$(`Boost set to ${L.label}`,"success")}),u.appendChild(v)}),u.addEventListener("mouseenter",()=>{D&&(clearTimeout(D),D=null)}),u.addEventListener("mouseleave",()=>{D=setTimeout(()=>be(),100)}),document.body.appendChild(u),G=u,u}function pe(){if(!h)return;let u=me();Q(u,h,V),T?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function be(){G&&(T?G.matches(":popover-open")&&G.hidePopover():G.style.display="none")}function c(){if(!G)return;G.querySelectorAll(".btfw-context-item").forEach((L,v)=>{let J=re[v];r.BOOST_MULTIPLIER===J.multiplier?(L.style.background="rgba(46, 213, 115, 0.2)",L.style.color="#2ed573"):(L.style.background="transparent",L.style.color="#e0e0e0")})}function N(){if(O)return O;let u=document.createElement("div");return u.id="btfw-norm-context-menu",T&&(u.popover="auto"),u.style.cssText=`
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
        `,Object.keys(r.NORM_PRESETS).forEach(L=>{let v=r.NORM_PRESETS[L],J=document.createElement("button");J.className="btfw-context-item",J.textContent=v.label,J.style.cssText=`
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
          `,r.currentNormPreset===L&&(J.style.background="rgba(52, 152, 219, 0.2)",J.style.color="#3498db"),J.addEventListener("mouseenter",()=>{r.currentNormPreset!==L&&(J.style.background="rgba(109, 77, 246, 0.2)")}),J.addEventListener("mouseleave",()=>{r.currentNormPreset!==L&&(J.style.background="transparent")}),J.addEventListener("click",async()=>{await r.setNormPreset(L),he(),l&&(l.title=`Toggle Audio Normalization (${v.label})`),r.normalizationEnabled&&Ee(`Preset: ${v.label}`,"success")}),u.appendChild(J)}),u.addEventListener("mouseenter",()=>{Z&&(clearTimeout(Z),Z=null)}),u.addEventListener("mouseleave",()=>{Z=setTimeout(()=>W(),100)}),document.body.appendChild(u),O=u,u}function I(){if(!l)return;let u=N();Q(u,l,y),T?u.matches(":popover-open")||u.showPopover():u.style.display="block"}function W(){O&&(T?O.matches(":popover-open")&&O.hidePopover():O.style.display="none")}function he(){if(!O)return;let u=O.querySelectorAll(".btfw-context-item");Object.keys(r.NORM_PRESETS).forEach((L,v)=>{let J=u[v];r.currentNormPreset===L?(J.style.background="rgba(52, 152, 219, 0.2)",J.style.color="#3498db"):(J.style.background="transparent",J.style.color="#e0e0e0")})}function le(){let u=o("#btfw-vo-left");if(!u)return!1;let L=o("#btfw-vo-audioboost");L&&L.remove();let v=o("#btfw-vo-audionorm");v&&v.remove();let J=o("#btfw-vo-mono");return J&&J.remove(),h=R(),l=Y(),_=fe(),u.appendChild(h),u.appendChild(l),u.appendChild(_),!0}function m(u,L=20){let v=0,J=setInterval(()=>{v++,le()?(clearInterval(J),u()):v>=L&&clearInterval(J)},500)}function b(){if(typeof videojs=="undefined"){setTimeout(b,500);return}if(!o("#ytapiplayer")){setTimeout(b,500);return}r.player=videojs("ytapiplayer"),r.originalSrc=r.player.currentSrc(),r.startWatchdog()}function x(){setTimeout(()=>{r.resetMediaBinding(),r.boostEnabled=!1,r.normalizationEnabled=!1,r.monoEnabled=!1,r.isProxied=!1,z(!1),X(!1),Se(!1),b(),H&&setTimeout(()=>{ne()},1200),K&&setTimeout(()=>{ce()},1200),q&&setTimeout(()=>{E()},1200)},600)}function B(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>r._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>r._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",x))}function ie(){m(()=>{b()}),B()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ie):ie(),{name:"feature:audio",activate:ne,deactivate:oe,isActive:()=>r.boostEnabled,activateNormalization:ce,deactivateNormalization:we,isNormalizationActive:()=>r.normalizationEnabled,activateMono:E,deactivateMono:P,isMonoActive:()=>r.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async o=>o.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async o=>o.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:T})=>{let M=await T("util:tmdb-proxy"),V="movie-info",y={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},Q="btfw-movie-info-style",p={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},o=0,r=!1,h=null;function l(m){typeof m=="function"&&p.cleanup.push(m)}function _(){for(;p.cleanup.length;){let m=p.cleanup.pop();try{m()}catch(b){}}p.header&&(p.header.remove(),p.header=null)}function H(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null),p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null),o=0,p.currentTitle="",p.isInitialized=!1,_()}function K(m){if(typeof m=="boolean")return m;if(typeof m=="number")return Number.isFinite(m)?m>0:!1;if(typeof m=="string"){let b=m.trim().toLowerCase();return b?b==="1"||b==="true"||b==="yes"||b==="on":!1}return!1}function q(){let m=[()=>{var b,x,B;return(B=(x=(b=window.BTFW_THEME_ADMIN)==null?void 0:b.integrations)==null?void 0:x.movieInfo)==null?void 0:B.enabled},()=>{var b,x,B;return(B=(x=(b=window.BTFW_CONFIG)==null?void 0:b.integrations)==null?void 0:x.movieInfo)==null?void 0:B.enabled},()=>{var b,x;return(x=(b=window.BTFW_CONFIG)==null?void 0:b.movieInfo)==null?void 0:x.enabled},()=>{var b;return(b=window.BTFW_CONFIG)==null?void 0:b.movieInfoEnabled},()=>{var b,x;return(x=(b=document==null?void 0:document.body)==null?void 0:b.dataset)==null?void 0:x.btfwMovieInfoEnabled}];for(let b of m)try{let x=typeof b=="function"?b():b;if(K(x))return!0}catch(x){}return!1}function G(){if(h||typeof MutationObserver!="function")return;let m=document.body;m&&(h=new MutationObserver(()=>re()),h.observe(m,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function O(){if(r)return;r=!0;let m=()=>re();document.addEventListener("btfw:channelIntegrationsChanged",m),document.addEventListener("btfw:ready",m)}function D(m=0){p.initTimer&&(clearTimeout(p.initTimer),p.initTimer=null),p.initTimer=window.setTimeout(()=>{p.initTimer=null,q()&&Z()},Math.max(0,m))}function Z(){if(p.isInitialized)return;let m=document.querySelector(y.TOPBAR_SELECTOR);if(!m){D(500);return}try{z(m),he(),ne(),p.isInitialized=!0,setTimeout(()=>{E(),P()},120)}catch(b){D(800)}}function re(){q()?p.isInitialized?(E(),setTimeout(P,80)):D(0):H()}function z(m){if(!m&&(m=document.querySelector(y.TOPBAR_SELECTOR),!m))throw new Error("Chat topbar not found");let b=document.getElementById(y.CONTAINER_ID);b&&b.remove();let x=document.createElement("div");x.id=y.CONTAINER_ID,x.className="btfw-movie-header hide",x.dataset.module=V,m.insertAdjacentElement("afterend",x),p.header=x}function $(){try{return window.socket||window.SOCKET||null}catch(m){return null}}function ne(){oe(),ce();let m=W(E,250);window.addEventListener("resize",m),l(()=>window.removeEventListener("resize",m))}function oe(){X(),Ee()}function X(){let m=document.querySelector(y.TITLE_SELECTOR);if(m){let b=()=>Se(),x=()=>ue();m.addEventListener("mouseenter",b),m.addEventListener("mouseleave",x),l(()=>{m.removeEventListener("mouseenter",b),m.removeEventListener("mouseleave",x)})}else if(typeof MutationObserver=="function"){let b=new MutationObserver(()=>{document.querySelector(y.TITLE_SELECTOR)&&(b.disconnect(),X())});b.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),l(()=>{try{b.disconnect()}catch(x){}})}}function Ee(){let m=p.header;if(!m)return;let b=()=>we(),x=()=>ue();m.addEventListener("mouseenter",b),m.addEventListener("mouseleave",x),l(()=>{m.removeEventListener("mouseenter",b),m.removeEventListener("mouseleave",x)})}function ce(){let m=$();if(m&&typeof m.on=="function"){m.on("changeMedia",P),l(()=>{var B,ie;try{(B=m.off)==null||B.call(m,"changeMedia",P)}catch(u){try{(ie=m.removeListener)==null||ie.call(m,"changeMedia",P)}catch(L){}}});return}let b=0,x=()=>{if(!q()){p.socketRetryTimer=null;return}let B=$();if(B&&typeof B.on=="function"){B.on("changeMedia",P),l(()=>{var ie,u;try{(ie=B.off)==null||ie.call(B,"changeMedia",P)}catch(L){try{(u=B.removeListener)==null||u.call(B,"changeMedia",P)}catch(v){}}}),p.socketRetryTimer=null;return}if(b+=1,b>10){p.socketRetryTimer=null;return}p.socketRetryTimer=window.setTimeout(x,1e3)};p.socketRetryTimer=window.setTimeout(x,1200),l(()=>{p.socketRetryTimer&&(clearTimeout(p.socketRetryTimer),p.socketRetryTimer=null)})}function we(){p.hideTimer&&(clearTimeout(p.hideTimer),p.hideTimer=null)}function Se(){we(),p.header&&(p.header.classList.remove("hide"),p.header.classList.add("show"))}function ue(){we(),p.hideTimer=window.setTimeout(()=>{p.header&&(p.header.classList.remove("show"),p.header.classList.add("hide"),setTimeout(()=>{p.header&&p.header.classList.contains("hide")&&p.header.classList.remove("hide")},320))},300)}function E(){if(!p.header)return;let m=window.innerWidth<=768;p.header.classList.toggle("btfw-mobile",m)}async function P(){var ie;if(!p.isInitialized)return;let m=document.querySelector(y.TITLE_SELECTOR),b=p.header;if(!m||!b)return;let x=((ie=m.textContent)==null?void 0:ie.trim())||"";if(!x){p.currentTitle="",pe();return}if(x===p.currentTitle)return;p.currentTitle=x;let B=++o;fe();try{let u=await Y(x);if(B!==o)return;c(u)}catch(u){if(B!==o)return;M.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),me()}}function R(m){let b=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],x=m;return b.forEach(B=>{let ie=new RegExp(`\\b${B}\\b`,"gi");x=x.replace(ie,"")}),x.replace(/\s{2,}/g," ").trim()}async function Y(m){var L;if(!M.isAvailable())throw new Error(M.MISSING_PROXY_MSG);let b=m.match(/(.+)\s*\((\d{4})\)/),x=b?b[1].trim():m,B=b?b[2]:"";B||(b=m.match(/(.+?)\s+(\d{4})\s*$/),b&&(x=b[1].trim(),B=b[2]));let ie=R(x),u=await M.tmdbFetch("search/movie",{query:ie,year:B});if(((L=u==null?void 0:u.results)==null?void 0:L.length)>0){let v=u.results[0];return{title:m,backdrop:v.backdrop_path?`https://image.tmdb.org/t/p/w1280${v.backdrop_path}`:null,poster:v.poster_path?`https://image.tmdb.org/t/p/w500${v.poster_path}`:null,summary:v.overview||"",rating:v.vote_average||0,releaseDate:v.release_date||"",voteCount:v.vote_count||0}}return{title:m,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function fe(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let b=document.createElement("div");b.className="btfw-movie-loading";let x=document.createElement("i");x.className="fa fa-spinner fa-spin";let B=document.createElement("p");B.textContent="Loading movie information...",b.append(x,B),m.appendChild(b),p.header.replaceChildren(m)}function me(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let b=document.createElement("div");b.className="btfw-movie-error";let x=document.createElement("i");x.className="fa fa-exclamation-triangle";let B=document.createElement("p");B.textContent="Unable to fetch movie information";let ie=document.createElement("small");ie.textContent="Check TMDB API key in Theme Settings",b.append(x,B,ie),m.appendChild(b),p.header.replaceChildren(m)}function pe(){if(!p.header)return;be();let m=document.createElement("div");m.className="btfw-movie-content";let b=document.createElement("p");b.textContent="No movie information available",m.appendChild(b),p.header.replaceChildren(m)}function be(){p.header&&(p.header.style.backgroundImage="",p.header.style.backgroundColor="")}function c(m){if(!p.header)return;p.header.replaceChildren(),y.ENABLE_BACKDROP&&m.backdrop?(p.header.style.backgroundImage=`url(${m.backdrop})`,p.header.style.backgroundSize="cover",p.header.style.backgroundPosition="center"):be();let b=document.createElement("div");b.className="btfw-movie-overlay",p.header.appendChild(b);let x=document.createElement("div");if(x.className="btfw-movie-content",p.header.appendChild(x),m.poster){let u=document.createElement("img");u.src=m.poster,u.alt=`${m.title} Poster`,u.className="btfw-movie-poster",x.appendChild(u)}let B=document.createElement("div");B.className="btfw-movie-details",x.appendChild(B);let ie=document.createElement("h2");if(ie.textContent=m.title,ie.className="btfw-movie-title",B.appendChild(ie),y.SHOW_SUMMARY&&m.summary){let u=document.createElement("p");u.textContent=m.summary,u.className="btfw-movie-summary",B.appendChild(u)}if(y.ENABLE_RATING&&m.rating>0){let u=N(m.rating,m.voteCount);x.appendChild(u)}}function N(m,b){let x=document.createElement("div");x.className="btfw-movie-rating";let B=Math.round(m*10),ie=I(B),u="http://www.w3.org/2000/svg",L=document.createElementNS(u,"svg");L.setAttribute("width","60"),L.setAttribute("height","60"),L.setAttribute("viewBox","0 0 60 60");let v=25,J=2*Math.PI*v,Te=J-m/10*J,s=document.createElementNS(u,"circle");s.setAttribute("cx","30"),s.setAttribute("cy","30"),s.setAttribute("r",v.toString()),s.setAttribute("stroke","#2a2a2a"),s.setAttribute("stroke-width","4"),s.setAttribute("fill","#1a1a1a"),L.appendChild(s);let d=document.createElementNS(u,"circle");d.setAttribute("cx","30"),d.setAttribute("cy","30"),d.setAttribute("r",v.toString()),d.setAttribute("stroke",ie),d.setAttribute("stroke-width","3"),d.setAttribute("fill","none"),d.setAttribute("stroke-dasharray",J.toString()),d.setAttribute("stroke-dashoffset",Te.toString()),d.setAttribute("transform","rotate(-90 30 30)"),d.setAttribute("stroke-linecap","round"),L.appendChild(d);let C=document.createElementNS(u,"text");if(C.setAttribute("x","50%"),C.setAttribute("y","50%"),C.setAttribute("text-anchor","middle"),C.setAttribute("dominant-baseline","central"),C.setAttribute("fill","#fff"),C.setAttribute("font-size","10"),C.setAttribute("font-weight","bold"),C.textContent=`${B}%`,L.appendChild(C),x.appendChild(L),b>0){let A=document.createElement("div");A.className="btfw-movie-votes",A.textContent=`${b.toLocaleString()} votes`,x.appendChild(A)}return x}function I(m){let b=Math.max(0,Math.min(m,100));return b>=70?"#4caf50":b>=50?"#ff9800":"#f44336"}function W(m,b){let x=null;return function(...ie){x&&clearTimeout(x),x=setTimeout(()=>{x=null,m(...ie)},b)}}function he(){if(document.getElementById(Q))return;let m=`
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
    `,b=document.createElement("style");b.id=Q,b.textContent=m,document.head.appendChild(b)}function le(){G(),O(),re()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",le,{once:!0}):le(),{name:"feature:movie-info",refresh:re,cleanup:H}});BTFW.define("feature:monkeyPaw",[],async()=>{let T="btfw-monkey-paw-styles",M="btfw-monkey-paw-overlay",V="/src/assets/monkey-paw/paw.svg",y={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},Q={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},p={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},o=null,r=null,h=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function l(z){let $=String(z||"").trim();return/^<svg[\s>]/i.test($)?!h.test($):!1}function _(z){return new Promise($=>setTimeout($,z))}function H(){try{let z=typeof window!="undefined"?window.BTFW:null;return z&&(z.BASE||z.DEV_CDN)||""}catch(z){return""}}function K(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(z){return!1}}function q(){if(typeof document=="undefined"||document.getElementById(T))return;let z=document.createElement("style");z.id=T,z.textContent=`
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
    `,document.head.appendChild(z)}async function G(){if(o)return o;let $=`${H()}${V}`,ne=await fetch($,{credentials:"omit"});if(!ne.ok)throw new Error(`Monkey paw SVG failed to load (${ne.status})`);let oe=await ne.text();if(!l(oe))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return o=oe,o}function O(z){Object.entries(p).forEach(([$,ne])=>{let oe=z.querySelector(`#${$}`),X=z.querySelector(`#${$}-tip`);oe&&(oe.style.transform=ne.root),X&&(X.style.transform=ne.tip)})}function D(z){Object.entries(y).forEach(([$,ne])=>{window.setTimeout(()=>{let oe=z.querySelector(`#${$}`),X=z.querySelector(`#${$}-tip`);oe&&(oe.style.transform=ne.root),X&&window.setTimeout(()=>{X.style.transform=ne.tip},120)},Q[$])})}function Z(z){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${z}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function re(z={}){if(r)return r;if(typeof document!="undefined")return r=(async()=>{var Ee,ce;if(q(),K()){await _((Ee=z.reducedMotionMs)!=null?Ee:450);return}let $=document.getElementById(M);$||($=document.createElement("div"),$.id=M,document.body.appendChild($));let ne;try{ne=await G()}catch(we){console.warn("[monkey-paw] SVG load failed:",we),await _(300);return}$.innerHTML=Z(ne),O($);let oe=$.querySelector("#paw"),X=$.querySelector("#btfw-monkey-paw-msg");$.classList.remove("is-cursed"),X==null||X.classList.remove("is-visible"),requestAnimationFrame(()=>$.classList.add("is-active")),D($),await _(980),oe==null||oe.classList.add("btfw-monkey-paw-shaking"),await _(720),oe==null||oe.classList.remove("btfw-monkey-paw-shaking"),$.classList.add("is-cursed"),X==null||X.classList.add("is-visible"),await _((ce=z.holdMs)!=null?ce:1100),$.classList.remove("is-active"),await _(320),$.remove()})().finally(()=>{r=null}),r}return{name:"feature:monkeyPaw",play:re}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:T})=>{let M=await T("util:tmdb-proxy"),V=await T("feature:monkeyPaw"),y=(c,N=document)=>N.querySelector(c),Q=(c,N=document)=>Array.from(N.querySelectorAll(c)),p=null,o=null,r=null,h=null,l={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},_=null,H=null,K="[movie-suggestion]";function q(...c){console.log(K,...c)}function G(...c){console.error(K,...c)}function O(c){var N;try{if((N=window.socket)!=null&&N.emit)return window.socket.emit("chatMsg",{msg:c}),!0}catch(I){}return!1}async function D(c,N={}){return M.workerFetch(c,N)}function Z(){if(document.getElementById("btfw-movie-suggest-styles"))return;let c=document.createElement("style");c.id="btfw-movie-suggest-styles",c.textContent=`
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
    `,document.head.appendChild(c)}let re=(CLIENT==null?void 0:CLIENT.rank)||0;function z(){let c=y("a[href*='donate'], #donate-btn, .donate-btn");if(c){let I=c.closest("ul");if(I)return{ul:I,insertAfter:c.parentElement}}let N=y("#btfw-theme-btn-nav");if(N){let I=N.closest("ul");if(I)return{ul:I,insertAfter:null}}return{ul:y(".navbar .nav.navbar-nav")||y(".navbar-nav")||y(".btfw-navbar ul")||y(".navbar ul"),insertAfter:null}}function $(){if(y("#btfw-movie-suggest-btn"))return!0;let c=z();if(!c.ul)return!1;let N=document.createElement("li"),I=document.createElement("a");return I.href="javascript:void(0)",I.className="btfw-nav-pill",I.id="btfw-movie-suggest-btn",I.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,N.appendChild(I),c.insertAfter?c.insertAfter.after(N):c.ul.insertBefore(N,c.ul.firstChild),I.addEventListener("click",Y),!0}function ne(){var W,he,le,m,b,x;if(y("#btfw-movie-suggest-modal"))return;let c=document.createElement("div");c.id="btfw-movie-suggest-modal",c.className="modal",c.innerHTML=`
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
    `,document.body.appendChild(c);let N=y(".modal-background",c),I=y(".delete",c);if(N.addEventListener("click",fe),I.addEventListener("click",fe),(W=y("#btfw-movie-prev",c))==null||W.addEventListener("click",()=>{l.page>1&&(l.page-=1,ue())}),(he=y("#btfw-movie-next",c))==null||he.addEventListener("click",()=>{l.page<l.totalPages&&(l.page+=1,ue())}),re===0){let B=y("#btfw-movie-search",c);B.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),B.blur()})}else{let B,ie=y("#btfw-movie-search",c);ie.addEventListener("input",()=>{clearTimeout(B),l.query=ie.value.trim(),l.page=1,B=setTimeout(()=>ue(),400)}),(le=y("#btfw-movie-sort",c))==null||le.addEventListener("change",u=>{l.sortBy=u.target.value,l.page=1,ue()}),(m=y("#btfw-movie-genre",c))==null||m.addEventListener("change",u=>{l.genreId=u.target.value,l.page=1,ue()}),(b=y("#btfw-movie-year",c))==null||b.addEventListener("change",u=>{l.year=u.target.value.trim(),l.page=1,ue()}),(x=y("#btfw-movie-rating",c))==null||x.addEventListener("change",u=>{l.minRating=u.target.value.trim(),l.page=1,ue()})}}function oe(){if(y("#btfw-movie-confirm-modal"))return;let c=document.createElement("div");c.id="btfw-movie-confirm-modal",c.className="modal",c.innerHTML=`
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
    `,document.body.appendChild(c);let N=y(".modal-background",c),I=y(".delete",c),W=y("#btfw-movie-cancel",c),he=y("#btfw-movie-confirm",c),le=()=>R();N.addEventListener("click",le),I.addEventListener("click",le),W.addEventListener("click",le),he.addEventListener("click",pe)}async function X(){if(_&&H)return;let[c,N]=await Promise.all([D("/api/meta"),D("/api/genres")]);_=c,H=N;let I=y("#btfw-movie-suggest-modal");if(!I)return;let W=y("#btfw-movie-sort",I);if(W&&W.options.length===0){for(let le of c.sortOptions||[]){let m=document.createElement("option");m.value=le.value,m.textContent=le.label,W.appendChild(m)}W.value=l.sortBy}let he=y("#btfw-movie-genre",I);if(he&&he.options.length<=1)for(let le of N.genres||[]){let m=document.createElement("option");m.value=String(le.id),m.textContent=le.name,he.appendChild(m)}}function Ee(){let c={page:l.page,sort_by:l.sortBy};return l.query?(c.query=l.query,l.year&&(c.primary_release_year=l.year,c.year=l.year)):(l.genreId&&(c.with_genres=l.genreId),l.year&&(c.primary_release_year=l.year),l.minRating&&(c["vote_average.gte"]=l.minRating)),c}function ce(c){return!c||c==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${c}`}function we(){let c=y("#btfw-movie-suggest-modal");if(!c)return;let N=y("#btfw-movie-prev",c),I=y("#btfw-movie-next",c),W=y("#btfw-movie-page-label",c);W&&(W.textContent=`Page ${l.page} of ${l.totalPages}`),N&&(N.disabled=l.page<=1||l.loading),I&&(I.disabled=l.page>=l.totalPages||l.loading)}function Se(c){let N=y("#btfw-movie-suggest-modal");if(!N)return;let I=y(".btfw-movie-results",N);if(!c.length){I.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}I.innerHTML=c.map(W=>`
      <div class="movie-result"
           data-id="${ke(W.id)}"
           data-title="${ke(W.title)}"
           data-poster="${ke(W.posterPath||"")}"
           data-year="${ke(W.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${ke(ce(W.posterPath))}" alt="${ke(W.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${ke(W.title)}</div>
          <small style="opacity:0.7;">${ke(W.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),Q(".movie-result",I).forEach(W=>{W.addEventListener("click",()=>{p=W.dataset.id,o=W.dataset.title,r=W.dataset.poster,h=W.dataset.year||null;let he=y("#btfw-movie-confirm-modal");if(!he)return;let le=h?` (${h})`:"";y("#btfw-confirm-movie-title",he).textContent=`${o}${le}`,P()})})}async function ue(){let c=y("#btfw-movie-suggest-modal");if(!c||l.loading)return;l.loading=!0,we();let N=y(".btfw-movie-results",c);N.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await X();let I=await D("/api/search",{params:Ee()});l.totalPages=Math.max(1,I.totalPages||1),Se(I.results||[]),q("runSearch",{page:l.page,totalPages:l.totalPages,count:(I.results||[]).length})}catch(I){G("runSearch failed:",I),N.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{l.loading=!1,we()}}async function E(){let c=y("#btfw-movie-history");if(c){c.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let I=(await D("/api/history",{params:{page:1,limit:10}})).results||[];if(!I.length){c.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}c.innerHTML=I.map(W=>{let he=W.releaseYear?` (${ke(W.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${ke(ce(W.posterPath).replace("w154","w92"))}" alt="${ke(W.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${ke(W.movieTitle)}${he}</div>
              <div class="history-item__meta">Requested by ${ke(W.username)}</div>
            </div>
          </div>
        `}).join("")}catch(N){G("loadHistory failed:",N),c.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function P(){let c=y("#btfw-movie-suggest-modal"),N=y("#btfw-movie-confirm-modal");N&&(c&&c.classList.add("btfw-movie-suggest-pending"),N.classList.add("is-active"))}function R(){let c=y("#btfw-movie-suggest-modal"),N=y("#btfw-movie-confirm-modal");c&&c.classList.remove("btfw-movie-suggest-pending"),N&&N.classList.remove("is-active")}async function Y(){let c=y("#btfw-movie-suggest-modal");if(c){q("openModal",{userRank:re}),c.classList.remove("btfw-movie-suggest-pending"),c.classList.add("is-active");try{await X(),await Promise.all([ue(),E()])}catch(N){G("openModal bootstrap failed:",N)}}}function fe(){let c=y("#btfw-movie-suggest-modal");c&&(R(),q("closeModal"),c.classList.remove("is-active"),y("#btfw-movie-search",c).value="",y(".btfw-movie-results",c).innerHTML="",l.query="",l.page=1,l.totalPages=1,p=null,o=null,r=null,h=null)}function me(c,N,I){let W=I?` (${I})`:"";return`\u{1F3AC} Movie request: ${N}${W} \u2014 suggested by ${c}`}async function pe(){if(!p||!o)return;let c=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";q("confirmSuggestion",{movieId:p,movieTitle:o}),R();try{await V.play(),await D("/api/suggestions",{method:"POST",body:{movieId:Number(p),movieTitle:o,username:c,posterPath:r||null,releaseYear:h||null}}),O(me(c,o,h)),await E(),fe()}catch(N){G("confirmSuggestion failed:",N),alert("Could not save your movie request. Please try again.")}}function be(){q("boot: start",{workerBase:M.getWorkerBase()}),Z(),ne(),oe();let c=0,N=50,I=()=>{if($()){q("Button added successfully");return}c+=1,c<N?setTimeout(I,100):console.warn(K,"Failed to add button after retries",{retryCount:c})};I()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(be,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(be,200)}):setTimeout(be,200),{name:"ext:movie-suggestion",open:Y,close:fe,getWorkerBase:M.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async T=>T.init("ext:movie-suggestion"));})();
