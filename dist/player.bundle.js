/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{BTFW.define("feature:player",[],async()=>{var M;let t=(d,A=document)=>A.querySelector(d),o=(d,A=document)=>Array.from(A.querySelectorAll(d)),f=((M=window.BTFW)==null?void 0:M.BASE)||"";function l(d){if(!d)return;let A=d.startsWith("http")?d:`${f}/${d.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(h=>h.getAttribute("href")===A||h.getAttribute("href")===d))return;let k=document.createElement("link");k.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[d]&&(k.integrity=window.BTFW.SRI[d],k.crossOrigin="anonymous"),k.href=A,document.head.appendChild(k)}function u(){let d=t("#videowrap");if(!d)return;l("dist/css/player.css"),d.classList.add("btfw-player-wrap");let A=d.querySelector("#controlsrow, .player-controls");A&&A.classList.add("btfw-player-controls"),s()}function s(){if(window.videojs)try{let d=document.querySelector(".video-js");d&&!d.classList.contains("btfw-vjs-enhanced")&&d.classList.add("btfw-vjs-enhanced")}catch(d){}}function b(){let d=t("#videowrap");if(!d)return;new MutationObserver(()=>{s()}).observe(d,{childList:!0,subtree:!0})}function m(){u(),b();try{let d=window.socket;d&&typeof d.on=="function"&&d.on("changeMedia",()=>{setTimeout(u,100)})}catch(d){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),{name:"feature:player",applyPlayerLayoutEnhancements:u}});function me(t=document){return!t||typeof t.querySelector!="function"?!1:!!(t.querySelector("#pollwrap .well.active")||t.querySelector("#pollwrap .well.muted")||t.querySelector("#pollwrap .poll-menu"))}function de(t,o){return t!=null?!!t:!!o}var Xe=/[&<>"']/g,Je={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function le(t){return t==null?"":String(t).replace(Xe,o=>{var f;return(f=Je[o])!=null?f:o})}function Ze(t){return t.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function qe(t){return t.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var et=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],tt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},nt=["http","https","mailto"],ot="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",it=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,rt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,at={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function st(t){let o=t;for(let l=0;l<3;l+=1){let u=o.replace(/&#x([0-9a-fA-F]+);?/g,(s,b)=>{let m=Number.parseInt(b,16);if(!Number.isFinite(m)||m<0||m>1114111)return"";try{return String.fromCodePoint(m)}catch(M){return""}}).replace(/&#(\d+);?/g,(s,b)=>{let m=Number(b);if(!Number.isFinite(m)||m<0||m>1114111)return"";try{return String.fromCodePoint(m)}catch(M){return""}}).replace(/&([a-zA-Z]+);?/g,(s,b)=>{let m=at[b.toLowerCase()];return m!==void 0?m:s});if(u===o)break;o=u}let f="";for(let l=0;l<o.length;l+=1){let u=o.charCodeAt(l);u<=31||u===127||(f+=o[l])}return f.replace(/[\s\u00a0]+/g,"")}function lt(t){var u,s;let o=new Map,f=new RegExp(it.source,"g"),l;for(;(l=f.exec(t))!==null;){let b=((u=l[1])!=null?u:"").toLowerCase(),m=(s=l[2])!=null?s:"";(m.startsWith('"')&&m.endsWith('"')||m.startsWith("'")&&m.endsWith("'"))&&(m=m.slice(1,-1)),o.set(b,m),l[0].length===0&&(f.lastIndex+=1)}return o}function ct(t,o){var s;let f=st(t);if(f.length===0)return!0;let l=rt.exec(f);if(!l)return!0;let u=((s=l[1])!=null?s:"").toLowerCase();return o.includes(u)?u==="data"?/^data:image\//i.test(f):!0:!1}function dt(t,o,f,l,u,s,b){var v,x;let m=o.toLowerCase();if(!u.has(m))return"";if(t)return`</${m}>`;let M=lt(f||""),d=(v=s["*"])!=null?v:[],A=(x=s[m])!=null?x:[],P=[];for(let[T,L]of M)T.startsWith("on")||!(d.includes(T)||A.includes(T))||(T==="href"||T==="src")&&!ct(L,b)||P.push(`${T}="${Ze(L)}"`);m==="a"&&M.get("target")==="_blank"&&A.includes("rel")&&(P.some(T=>T.startsWith("rel="))||P.push('rel="noopener noreferrer"'));let k=P.length>0?` ${P.join(" ")}`:"";return`<${m}${k}${l?" /":""}>`}function he(t,o={}){var A,P,k;if(t==null)return"";let f=String(t).replace(/<!--[\s\S]*?-->/g,""),l=new Set(((A=o.allowedTags)!=null?A:et).map(h=>h.toLowerCase())),u=(P=o.allowedAttributes)!=null?P:tt,s=(k=o.allowedSchemes)!=null?k:nt,b=new RegExp(ot,"g"),m="",M=0,d;for(;(d=b.exec(f))!==null;){let[h,v,x="",T="",L]=d;m+=qe(f.slice(M,d.index)),m+=dt(v,x,T,L,l,u,s),M=d.index+h.length}return m+=qe(f.slice(M)),m}var He="btfw-stack-order",ye="btfw-stack-motd-open",ke="btfw-stack-playlist-open",_e="btfw-stack-poll-open",we={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Te={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},Fe={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Le={"motd-group":1,"poll-group":2,"playlist-group":3},fe=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Ce=["#main","#mainpage","#mainpane"];function ue(t){try{let o=Array.from(t.children).map(f=>({id:f.dataset.bind,isGroup:f.dataset.group==="true"}));localStorage.setItem(He,JSON.stringify(o))}catch(o){}}function De(){try{return JSON.parse(localStorage.getItem(He)||"[]")}catch(t){return[]}}function ge(t){try{let o=localStorage.getItem(t);return o===null?null:o==="true"}catch(o){return null}}function Ae(t,o){try{localStorage.setItem(t,o?"true":"false")}catch(f){}}function Me(t){try{let o=localStorage.getItem(t);if(o!==null)return o==="true";let f=t.replace("-docked","-hidden"),l=localStorage.getItem(f);return l!==null?l==="true":!1}catch(o){return!1}}function $e(t,o){try{localStorage.setItem(t,o?"true":"false")}catch(f){}}function Pe(t){return!!(t!=null&&t.closest(".btfw-panel-container__host"))}function ve(t,o,f){if(!t||Pe(t))return;let l=ge(o!=null?o:""),u=typeof f=="function"?f(l):l!==null?!!l:!0;t._btfwSetOpenState?t._btfwSetOpenState(u,{persist:!1}):(t.dataset.open=u?"true":"false",t.classList.toggle("is-open",u))}function Ie(){let t=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),o=t.filter(b=>b.dataset.docked!=="true"),f=t.length>0&&o.length===0,l=document.getElementById("btfw-stack"),u=document.getElementById("btfw-leftpad"),s=document.getElementById("btfw-grid");l&&(l.classList.toggle("btfw-stack--all-hidden",f),l.classList.toggle("btfw-stack--all-docked",f)),u&&u.classList.toggle("btfw-leftpad--stack-hidden",f),s&&s.classList.toggle("btfw-grid--stack-hidden",f),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:f,allDocked:f,visibleCount:o.length,totalCount:t.length}}))}function Ne(t=""){let o=String(t||"").trim();return o?!o.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function ze(t=document){if(!t||typeof t.querySelector!="function")return!1;let o=pe(t);return o?!Ne(o.innerHTML||""):!1}function pe(t=document){if(!t||typeof t.getElementById!="function")return null;let o=t.getElementById("motdwrap");if(!o)return t.getElementById("motd");let f=o.querySelector(":scope > #motd");return f||o.querySelector("#motd")||t.getElementById("motd")}function Oe(t=!1){let o=document.getElementById("motdwrap");if(!o)return null;if(!t&&o.dataset.btfwMotdNormalized==="1"){let s=o.querySelector(":scope > #motd");return s?{motdwrap:o,motd:s}:null}let f=document.getElementById("togglemotd");f&&f.closest("#motd")&&o.insertBefore(f,o.firstChild);let l=[];o.querySelectorAll(".btfw-motd-editrow").forEach(s=>{let b=(s.textContent||"").trim();b&&l.push(`<p>${b}</p>`),s.remove()}),o.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(s=>{s.contains(o)||s===o||((s.querySelector("#motd")||s.classList.contains("btfw-motd-editrow"))&&s.querySelectorAll("#motd").forEach(b=>{(b.innerHTML||"").trim()&&l.push(b.innerHTML)}),s.remove())});let u=o.querySelector(":scope > #motd");if(u||(u=document.createElement("div"),u.id="motd",o.appendChild(u)),o.querySelectorAll("#motd").forEach(s=>{s!==u&&((s.innerHTML||"").trim()&&l.push(s.innerHTML),s.remove())}),u.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(s=>{s.remove()}),u.querySelectorAll("#motd").forEach(s=>{(s.innerHTML||"").trim()&&l.push(s.innerHTML),s.remove()}),document.querySelectorAll("#togglemotd").forEach((s,b)=>{b!==0&&s.remove()}),l.length){let s=l.join("").trim();s&&Ne(u.innerHTML)?u.innerHTML=he(s):s&&(u.innerHTML+=he(s))}return o.dataset.btfwMotdNormalized="1",{motdwrap:o,motd:u}}function We(t){let o=null,f=!1,l=!1;function u(A){Oe();let P=document.getElementById("motdwrap");if(!P)return;let k=A&&A.list;if(!k)return;let h=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(h){let v=h.querySelector(".btfw-group-body");v&&!v.contains(P)&&v.appendChild(P)}else{let v=fe.find(x=>x.id==="motd-group");if(!v)return;h=t.createGroupItem(v,[P]),h&&(k.appendChild(h),ue(k))}s(h)}function s(A){let P=document.getElementById("motdwrap");if(!P)return;let k=ze();if(P.classList.toggle("btfw-motd-empty",!k),P.toggleAttribute("hidden",!k),P.setAttribute("aria-hidden",k?"false":"true"),k){P.style.removeProperty("display");let h=pe();h&&h.style.removeProperty("display")}if(A||(A=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),A&&k){let h=ge(ye),v=de(h,!0),x=A;x._btfwSetOpenState?x._btfwSetOpenState(v,{persist:!1}):(x.dataset.open=v?"true":"false",x.classList.toggle("is-open",v))}}function b(A){o&&clearTimeout(o),o=setTimeout(()=>{o=null,u(A)},50)}function m(A){let P=pe();P&&(f||(f=!0,new MutationObserver(()=>{b(A)}).observe(P,{childList:!0,subtree:!0,characterData:!0})))}function M(A){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("setMotd",P=>{let k=typeof P=="string"?P:P&&typeof P=="object"&&typeof P.motd=="string"?P.motd:null,h=pe();if(h){let v=k!==null?k:h.innerHTML,x=he(v);h.innerHTML!==x&&(h.innerHTML=x)}b(A)}))}function d(A){let P=t.ensureStackRefs(),k=document.getElementById("motdwrap");k&&delete k.dataset.btfwMotdNormalized;let h=Oe(!0),v=(h==null?void 0:h.motd)||pe();v&&typeof A=="string"&&(v.innerHTML=he(A));let x=document.getElementById("cs-motdtext");x&&typeof A=="string"&&(x.value=A),P&&b(P)}return{isMotdHtmlEmpty:Ne,hasMotdContent:ze,resolveMotdHost:pe,normalizeMotdStructure:Oe,ensureMotdStackPanel:u,syncMotdWrapVisibility:s,scheduleMotdSync:b,wireMotdObservers:m,wireMotdSocket:M,applyMotdUpdate:d}}var ut=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function Ue(t){let{tpl:o}=t;function f(h,v,x){if(!h||!v||!x)return null;let T=ut.map(z=>{let W=document.getElementById(z.id);return W?{...z,el:W}:null}).filter(Boolean);if(!T.length){let z=document.getElementById("btfw-addmedia-panel");return z&&z.remove(),null}let L=document.getElementById("btfw-addmedia-panel");if(L||(L=document.createElement("section"),L.id="btfw-addmedia-panel",L.className="btfw-addmedia-panel",L.dataset.open="false",L.setAttribute("role","region"),L.setAttribute("aria-label","Add media controls"),L.setAttribute("aria-hidden","true"),L.setAttribute("hidden","hidden"),L.innerHTML=o.addMediaPanelHtml()),L.parentElement!==h){let z=v.parentElement===h?v.nextSibling:null;h.insertBefore(L,z)}let O=L.querySelector(".btfw-addmedia-tabs"),N=L.querySelector(".btfw-addmedia-views"),q=L.querySelector(".btfw-addmedia-close");if(!O||!N)return null;for(;O.firstChild;)O.removeChild(O.firstChild);for(;N.firstChild;)N.removeChild(N.firstChild);T.forEach(({id:z,title:W,el:I})=>{I.classList.remove("collapse","in","plcontrol-collapse"),I.style.removeProperty("display"),I.style.removeProperty("height"),I.removeAttribute("aria-expanded"),I.setAttribute("role","tabpanel"),I.setAttribute("data-btfw-addmedia","panel");let G=document.createElement("button");G.type="button",G.className="btfw-addmedia-tab",G.dataset.target=z,G.textContent=W,G.setAttribute("role","tab"),O.appendChild(G);let X=document.createElement("div");X.className="btfw-addmedia-view",X.dataset.target=z,X.setAttribute("role","tabpanel"),X.setAttribute("aria-hidden","true"),X.appendChild(I),N.appendChild(X)});let U=T.find(z=>z.default)||T[0],H=z=>{let W=z||L.dataset.active||U.id;L.dataset.active=W,O.querySelectorAll(".btfw-addmedia-tab").forEach(I=>{let G=I.dataset.target===W;I.classList.toggle("is-active",G),I.setAttribute("aria-selected",G?"true":"false"),I.setAttribute("tabindex",G?"0":"-1")}),N.querySelectorAll(".btfw-addmedia-view").forEach(I=>{let G=I.dataset.target===W;I.classList.toggle("is-active",G),I.setAttribute("aria-hidden",G?"false":"true")})},F=z=>{let W=z!=null?!!z:L.dataset.open!=="true";return L.dataset.open=W?"true":"false",L.classList.toggle("is-open",W),L.setAttribute("aria-hidden",W?"false":"true"),W?(L.removeAttribute("hidden"),H(L.dataset.active||U.id)):L.setAttribute("hidden","hidden"),L.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:W}})),W};return L._btfwWired||(O.addEventListener("click",z=>{let W=z.target.closest(".btfw-addmedia-tab");W&&(z.preventDefault(),H(W.dataset.target))}),q&&q.addEventListener("click",()=>F(!1)),L._btfwWired=!0),H(L.dataset.active||U.id),L._btfwToggle=F,L._btfwSetActive=H,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:W,target:I})=>{let G=document.getElementById(W);G&&G.dataset.btfwAddmedia!==I&&(G.dataset.btfwAddmedia=I,G.setAttribute("aria-controls","btfw-addmedia-panel"),G.addEventListener("click",X=>{X.preventDefault(),X.stopPropagation(),H(I),F(!0),G.blur()}))})})(),{panel:L,toggle:F,setActive:H}}function l(){let h=document.getElementById("btfw-plbar");if((h==null?void 0:h.dataset.btfwMerged)==="1")return;let v=document.getElementById("controlsrow"),x=document.getElementById("rightcontrols"),T=document.getElementById("playlistwrap"),L=document.getElementById("queuecontainer"),O=document.getElementById("playlistrow"),N=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),q=document.querySelectorAll(".btfw-controls-row"),U=O||T||L||N;if(!U)return;let H=h;H?H.classList.add("btfw-plbar"):(H=document.createElement("div"),H.id="btfw-plbar",H.className="btfw-plbar");let F=H.querySelector(".btfw-plbar__layout"),J,z;if(F)J=F.querySelector(".btfw-plbar__primary")||F,z=F.querySelector(".btfw-plbar__aside")||F;else{for(F=document.createElement("div"),F.className="btfw-plbar__layout",J=document.createElement("div"),J.className="btfw-plbar__primary",z=document.createElement("div"),z.className="btfw-plbar__aside",F.append(J,z);H.firstChild;)J.appendChild(H.firstChild);H.appendChild(F);let Y=J.querySelector(".field.has-addons");Y&&Y.classList.add("btfw-plbar__search");let Q=J.querySelector("#btfw-pl-count");Q&&(Q.classList.add("btfw-plbar__count"),z.appendChild(Q))}H.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(Y=>Y.remove());let W=H.querySelector(".btfw-plbar__actions");W||(W=document.createElement("div"),W.className="btfw-plbar__actions",(z||H).appendChild(W));let I=document.getElementById("btfw-addmedia-btn"),G=Y=>{if(Y){if(Y.classList.add("btfw-plbar__action-btn"),Y.tagName==="BUTTON"||Y.tagName==="A")Y.classList.add("button","is-dark","is-small");else if(Y.tagName==="INPUT"){let Q=(Y.type||"").toLowerCase();Q==="button"||Q==="submit"||Q==="reset"?Y.classList.add("button","is-dark","is-small"):Y.classList.remove("button","is-dark","is-small")}}};H.parentElement!==U&&U.insertBefore(H,U.firstChild);let X=f(U,H,W);X?!I||!document.body.contains(I)?(I=document.createElement("button"),I.id="btfw-addmedia-btn",I.setAttribute("type","button"),I.className="button is-small",I.innerHTML=o.addMediaButtonHtml(),W.prepend(I)):W.contains(I)||W.prepend(I):I&&(I.parentElement&&I.parentElement.removeChild(I),I=null);let ne=Y=>{if(!Y)return;Array.from(Y.children||[]).forEach(ee=>{ee&&(ee.classList.add("btfw-plbar__control"),W.appendChild(ee))})};if(x&&(ne(x),x.remove()),v&&(ne(v),v.remove()),W.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(G),X&&I){I.classList.remove("is-dark"),I.classList.add("is-primary"),I.dataset.iconified||(I.innerHTML=o.addMediaButtonHtml(),I.dataset.iconified="1"),I.setAttribute("aria-controls","btfw-addmedia-panel");let Y=ee=>{I.setAttribute("aria-expanded",ee?"true":"false")};I.dataset.btfwBound||(I.dataset.btfwBound="1",I.addEventListener("click",ee=>{ee.preventDefault();let se=document.getElementById("btfw-addmedia-panel"),ae=se&&se._btfwToggle,ie=typeof ae=="function"?ae():!1;Y(ie)}));let Q=X.panel||document.getElementById("btfw-addmedia-panel");Q&&(Y(Q.dataset.open==="true"),Q._btfwButtonSync||(Q.addEventListener("btfw:addmedia:state",ee=>{Y(!!ee.detail&&!!ee.detail.open)}),Q._btfwButtonSync=!0))}q.forEach(Y=>{Y&&!U.contains(Y)&&(Y.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,Y.remove(),U.appendChild(Y),console.log("[stack] Moved floating controls row into playlist container"))}),U.contains(H)||U.insertBefore(H,U.firstChild),H.dataset.btfwMerged="1"}function u(h){if(!h)return null;let v=Array.from(h.classList).find(T=>T.startsWith("pluid-"));if(v)return v.slice(6);let x=window.jQuery||window.$;if(x){let T=x(h).data("uid");if(T!=null&&T!=="")return T}return h.dataset.uid||null}function s(h){if(h==null||h==="")return!1;let v=window.socket;if(v&&typeof v.emit=="function")return v.emit("jumpTo",h),!0;let x=document.querySelector(`#queue > .queue_entry.pluid-${h}`),T=x==null?void 0:x.querySelector(".qbtn-play");return T?(T.click(),!0):!1}function b(h){let v=(h||"").trim();if(!v)return!1;let x=document.getElementById("mediaurl"),T=document.getElementById("queue_next");if(x&&T&&(x.value=v,!T.disabled))return T.click(),!0;if(typeof window.queue=="function"&&x)return x.value=v,window.queue("next","url"),!0;let L=window.socket;if(L&&typeof parseMediaLink=="function")try{let O=parseMediaLink(v);if((O==null?void 0:O.id)!=null&&(O!=null&&O.type))return L.emit("queue",{id:O.id,type:O.type,pos:"next",temp:!1}),!0}catch(O){}return!1}let m=null,M=null;function d(){if(m){try{m.disconnect()}catch(h){}m=null}M=null}function A(h){if(!h||M===h)return;d();let v=document.getElementById("queue");v&&(M=h,m=new MutationObserver(()=>{h.isConnected&&t.getActiveFlyoutGroup()==="playlist-group"&&k(h)}),m.observe(v,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function P(h=5){let v=document.getElementById("queue");if(!v)return[];let x=Array.from(v.querySelectorAll(":scope > .queue_entry")),T=x.findIndex(O=>O.classList.contains("queue_active")||O.classList.contains("playing")),L=T>=0?T+1:0;return x.slice(L,L+h)}function k(h){if(!h)return;let v=P(5);if(h.replaceChildren(),!v.length){let x=document.createElement("p");x.className="btfw-panel-playlist__empty",x.textContent="No upcoming videos",h.appendChild(x);return}v.forEach(x=>{var U,H;let T=document.createElement("div");T.className="btfw-panel-playlist__item";let L=document.createElement("span");L.className="btfw-panel-playlist__title",L.textContent=(((U=x.querySelector(".qe_title"))==null?void 0:U.textContent)||"Untitled").trim();let O=document.createElement("span");O.className="btfw-panel-playlist__meta",O.textContent=(((H=x.querySelector(".qe_time"))==null?void 0:H.textContent)||"").trim();let N=document.createElement("div");N.className="btfw-panel-playlist__actions";let q=u(x);if(q!=null&&q!==""){let F=document.createElement("button");F.type="button",F.className="btfw-panel-playlist__play",F.textContent="Play",F.dataset.queueUid=String(q),!(x==null?void 0:x.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(F.disabled=!0),N.appendChild(F)}T.append(L,O,N),h.appendChild(T)})}return{ensureAddMediaUI:f,mergePlaylistControls:l,getQueueEntryUid:u,playQueueEntry:s,queueMediaLink:b,disconnectQueuePreviewObserver:d,ensureQueuePreviewObserver:A,getUpcomingQueueEntries:P,renderPlaylistQueuePreview:k}}function Ge(t){let o=null,f=!1,l=!1;function u(){let k=document.getElementById("pollwrap");if(!k)return null;if(!k.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return k;let v=document.getElementById("btfw-poll-parking");return v||(v=document.createElement("div"),v.id="btfw-poll-parking",v.hidden=!0,v.setAttribute("aria-hidden","true"),document.body.appendChild(v)),v.appendChild(k),k}function s(k){let h=document.getElementById("pollwrap");if(!h)return;let v=h.dataset&&h.dataset.btfwPollOverlay,x=h.getAttribute&&h.getAttribute("data-btfw-poll-overlay");if(v==="video"||x==="video")return;u(),P();let T=k&&k.list;if(!T)return;let L=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!L){let q=fe.find(U=>U.id==="poll-group");if(!q)return;L=t.createGroupItem(q,[h]),L&&(T.appendChild(L),ue(T));return}let O=L.querySelector(".btfw-group-body");O&&!O.contains(h)&&O.appendChild(h);let N=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');N&&N.contains(h)&&O&&O.appendChild(h)}function b(k,h={}){s(k),A();let v=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');v&&(v.hidden=!1,v.removeAttribute("hidden"),h.forceOpen&&v._btfwSetOpenState?v._btfwSetOpenState(!0,{persist:!1}):h.forceOpen&&(v.dataset.open="true",v.classList.add("is-open")))}function m(k,h={}){o&&clearTimeout(o),o=setTimeout(()=>{o=null,b(k,h)},50)}function M(k){if(f)return;let h=document.getElementById("pollwrap");if(!h)return;f=!0,new MutationObserver(()=>{m(k,{forceOpen:me()})}).observe(h,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let x=document.getElementById("newpollbtn");x&&!x.dataset.btfwPollSync&&(x.dataset.btfwPollSync="1",x.addEventListener("click",()=>{m(k,{forceOpen:!0})}))}function d(k){l||!window.socket||!window.socket.on||(l=!0,window.socket.on("newPoll",()=>m(k,{forceOpen:!0})),window.socket.on("closePoll",()=>m(k)))}function A(){let k=document.getElementById("pollwrap");if(!k)return;let h=!!k.closest(".btfw-panel-container__host"),v=!me();if(h&&!v){k.classList.remove("btfw-poll-idle"),k.removeAttribute("hidden"),k.setAttribute("aria-hidden","false");return}k.classList.toggle("btfw-poll-idle",v),k.toggleAttribute("hidden",v),k.setAttribute("aria-hidden",v?"true":"false")}function P(){let k=document.getElementById("leftcontrols"),h=document.getElementById("pollwrap");k&&h&&(k.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(x=>{let T=h.querySelector(".poll-controls");T||(T=document.createElement("div"),T.className="poll-controls",h.insertBefore(T,h.firstChild)),x.parentElement!==T&&T.appendChild(x)}),k.children.length===0&&k.remove())}return{detachPollWrapFromPlaylist:u,movePollButton:P,ensurePollStackPanel:s,syncPollPanelVisibility:b,schedulePollSync:m,wirePollObservers:M,wirePollSocket:d,syncPollWrapVisibility:A}}BTFW.define("feature:stack",["feature:layout","util:templates"],async({init:t})=>{let o=await t("util:templates"),{stack:f}=o,l=!1,u=null,s="",b=null,m={"motd-group":{storageKey:ye,getDefaultOpen:e=>de(e,k()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:ke,getDefaultOpen:e=>de(e,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:_e,getDefaultOpen:e=>de(e,me()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},M=!1,d=null,A=!1,P=We({createGroupItem:T,ensureStackRefs:()=>x()}),k=P.hasMotdContent,h=Ue({tpl:f,getActiveFlyoutGroup:()=>u}),v=Ge({createGroupItem:T});function x(){let e=document.getElementById("btfw-leftpad");if(!e)return null;let n=document.getElementById("btfw-stack");if(!n){n=document.createElement("div"),n.id="btfw-stack",n.className="btfw-stack";let i=document.getElementById("videowrap"),p=document.getElementById("btfw-video-overlay"),S=p&&i&&p.parentElement===i.parentElement?p:i;S&&S.parentElement?S.nextSibling?S.parentNode.insertBefore(n,S.nextSibling):S.parentNode.appendChild(n):e.appendChild(n);let r=document.createElement("div");r.className="btfw-stack-list",n.appendChild(r);let a=document.createElement("div");a.id="btfw-stack-footer",a.className="btfw-stack-footer",n.appendChild(a)}return{list:n.querySelector(".btfw-stack-list"),footer:n.querySelector("#btfw-stack-footer")}}function T(e,n){if(e.id==="motd-group"&&(P.normalizeMotdStructure(),n=[document.getElementById("motdwrap")].filter(Boolean)),e.id==="playlist-group"&&(v.detachPollWrapFromPlaylist(),h.mergePlaylistControls(),n=n.filter(c=>c&&c.id!=="rightcontrols"&&c.id!=="pollwrap").filter(c=>!c.querySelector||!c.querySelector("#pollwrap"))),e.id==="poll-group"&&(v.detachPollWrapFromPlaylist(),v.movePollButton(),n=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),n.length===0)return null;let i=document.querySelector("#btfw-stack .btfw-stack-list");i&&(n=n.filter(c=>c&&!i.contains(c)&&!c.contains(i)));let p=document.createElement("section");p.className="btfw-stack-item btfw-group-item",p.dataset.bind=e.id,p.dataset.group="true";let S=document.createElement("header");S.className="btfw-stack-item__header",S.innerHTML=f.stackGroupHeaderHtml(e.title);let r=document.createElement("div");r.className="btfw-stack-item__body btfw-group-body",n.forEach(c=>{if(c&&c.parentElement!==r&&!r.contains(c)&&!c.contains(r))try{r.appendChild(c)}catch(g){console.warn("[stack] Failed to move element:",c.id||c.className,g)}}),p.appendChild(S),p.appendChild(r);let a=m[e.id];return a&&$(p,a),B(p,e.id),p.querySelector(".btfw-up").onclick=function(){let c=p.parentElement,g=p.previousElementSibling;g&&c.insertBefore(p,g),ue(c)},p.querySelector(".btfw-down").onclick=function(){let c=p.parentElement,g=p.nextElementSibling;g?c.insertBefore(g,p):c.appendChild(p),ue(c)},p}function L(e){e&&(e.classList.remove("btfw-stack-item--in-drawer"),delete e.dataset.btfwInDrawer,e.classList.toggle("is-open",e.dataset.open!=="false"),v.syncPollWrapVisibility())}function O(e){L(e);let n=document.querySelector("#btfw-stack .btfw-stack-list");!n||!e||e.parentElement!==n&&n.appendChild(e)}function N(){var p;let e=document.getElementById("btfw-chat-actions");if(!e)return null;let n=document.getElementById("btfw-panels-menu-shell");if(!n){n=document.createElement("div"),n.id="btfw-panels-menu-shell",n.className="btfw-panels-menu-shell",n.setAttribute("aria-label","Docked channel panels");let S=document.createElement("div");S.id="btfw-panel-bar",S.className="btfw-panel-bar",S.setAttribute("role","toolbar"),S.setAttribute("aria-label","Docked panel shortcuts"),n.appendChild(S)}let i=n.querySelector("#btfw-panel-bar");return F(i),n.parentElement!==e&&e.insertBefore(n,e.firstChild),l||(ee(),l=!0),(p=document.getElementById("btfw-stack-drawer"))==null||p.remove(),n}function q(e){e.preventDefault(),e.stopPropagation(),ne()}function U(){let e=N();if(!e)return null;let n=document.getElementById("btfw-panels-menu-btn");n?n.parentElement!==e&&e.appendChild(n):(n=document.createElement("button"),n.type="button",n.id="btfw-panels-menu-btn",n.className="button btfw-chatbtn btfw-panels-menu-btn",n.innerHTML=f.panelsMenuButtonHtml(),n.title="Docked Panels",n.setAttribute("aria-expanded","false"),n.hidden=!0,e.appendChild(n)),n.title="Docked Panels";let i=n.querySelector(".btfw-panels-menu-btn__label");return i&&(i.textContent="Panels"),n.classList.remove("is-wide"),n.dataset.btfwPanelsWired||(n.addEventListener("click",q),n.dataset.btfwPanelsWired="1"),n}function H(e){x();let n=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${e}"]`);n&&(b&&(clearTimeout(b),b=null),u=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(i=>{i.classList.remove("is-active"),delete i.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),h.disconnectQueuePreviewObserver(),w(n,!1),requestAnimationFrame(()=>{try{n.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(i){}}))}function F(e){!e||e.dataset.btfwActionsWired||(e.dataset.btfwActionsWired="1",e.addEventListener("click",n=>{var r,a,c;let i=n.target.closest(".btfw-panel-undock");if(i){n.preventDefault(),n.stopPropagation();let g=i.dataset.panelGroup||((r=i.closest(".btfw-panel-btn"))==null?void 0:r.dataset.group);g&&H(g);return}let p=n.target.closest(".btfw-panel-playlist__play");if(p){n.preventDefault(),n.stopPropagation(),h.playQueueEntry(p.dataset.queueUid);return}let S=n.target.closest(".btfw-panel-playlist__add");if(S){n.preventDefault(),n.stopPropagation();let g=(a=S.closest(".btfw-panel-container"))==null?void 0:a.querySelector(".btfw-panel-playlist__add-form");if(!g)return;let C=g.hidden;g.hidden=!C,S.setAttribute("aria-expanded",C?"true":"false"),C&&((c=g.querySelector(".btfw-panel-playlist__link-input"))==null||c.focus())}}),e.addEventListener("submit",n=>{var a,c,g,C;let i=n.target.closest(".btfw-panel-playlist__add-form");if(!i)return;n.preventDefault(),n.stopPropagation();let p=i.querySelector(".btfw-panel-playlist__link-input"),S=(a=p==null?void 0:p.value)==null?void 0:a.trim();if(!S||!h.queueMediaLink(S))return;p.value="",i.hidden=!0,(g=(c=i.closest(".btfw-panel-container"))==null?void 0:c.querySelector(".btfw-panel-playlist__add"))==null||g.setAttribute("aria-expanded","false");let r=(C=i.closest(".btfw-panel-container"))==null?void 0:C.querySelector(".btfw-panel-playlist__queue");r&&h.renderPlaylistQueuePreview(r)}))}function J(e,n){let i=document.createElement("button");return i.type="button",i.className="btfw-panel-undock",i.dataset.panelGroup=e,i.setAttribute("aria-label",`Pin ${n.title} below video`),i.title="Pin below video",i.innerHTML=f.panelUndockIconHtml(),i}function z(){let e=document.createElement("form");return e.className="btfw-panel-playlist__add-form",e.hidden=!0,e.innerHTML=f.playlistAddFormHtml(),e}function W(e,n,i){let p=document.createElement("div");if(p.className="btfw-panel-container",i>0&&(p.style.bottom=`${-i*50}px`),e==="playlist-group"){p.classList.add("btfw-panel-container--playlist");let r=document.createElement("div");r.className="btfw-panel-playlist__toolbar";let a=document.createElement("button");a.type="button",a.className="btfw-panel-playlist__add",a.textContent="+Add",a.setAttribute("aria-expanded","false");let c=J(e,n);r.append(a,c);let g=z(),C=document.createElement("div");return C.className="btfw-panel-container__host btfw-panel-playlist__queue",p.append(r,g,C),p}p.classList.add("btfw-panel-container--dock-only");let S=document.createElement("div");return S.className="btfw-panel-container__dock-only",S.appendChild(J(e,n)),p.appendChild(S),p}function I(){b&&(clearTimeout(b),b=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(e=>{e.classList.remove("is-active"),delete e.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(e=>{O(e)}),h.disconnectQueuePreviewObserver(),u=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function G(e){let n=document.getElementById("btfw-panel-bar"),i=document.getElementById("btfw-panels-menu-btn");n&&n.classList.toggle("open",e),document.documentElement.classList.toggle("btfw-panels-bar-open",e),i&&(i.classList.toggle("is-expanded",e),i.setAttribute("aria-expanded",e?"true":"false")),e||I()}function X(){G(!1)}function ne(){N();let e=document.getElementById("btfw-panel-bar"),n=document.getElementById("btfw-panels-menu-btn");!e||!n||n.hidden||G(!e.classList.contains("open"))}function Y(e){b&&clearTimeout(b),b=setTimeout(()=>{b=null;let n=document.querySelector(`.btfw-panel-btn[data-group="${e}"]`);n&&(n.matches(":hover")||n.querySelector(".btfw-panel-container:hover")||(n.classList.remove("is-active"),u===e&&(u=null,h.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function Q(e,n){if(n&&(b&&(clearTimeout(b),b=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(i=>{i!==n&&i.classList.remove("is-active")}),u=e,n.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),e==="playlist-group")){let i=n.querySelector(".btfw-panel-playlist__queue");i&&(h.renderPlaylistQueuePreview(i),h.ensureQueuePreviewObserver(i))}}function ee(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",e=>{u&&(e.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(n=>{delete n.dataset.btfwFlyoutLocked}),I()))}))}function se(e,n){var p;if(!((p=document.getElementById("btfw-panel-bar"))!=null&&p.classList.contains("open")))return;if(b&&(clearTimeout(b),b=null),n.dataset.btfwFlyoutLocked==="true"&&n.classList.contains("is-active")){delete n.dataset.btfwFlyoutLocked,n.classList.remove("is-active"),u===e&&(u=null,h.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(S=>{S!==n&&delete S.dataset.btfwFlyoutLocked}),n.dataset.btfwFlyoutLocked="true",Q(e,n)}function ae(e,n){let i=e.querySelector(".btfw-panel-container"),p=()=>{var S;(S=document.getElementById("btfw-panel-bar"))!=null&&S.classList.contains("open")&&(b&&(clearTimeout(b),b=null),Q(n,e))};e.addEventListener("mouseenter",p),e.addEventListener("focusin",p),e.addEventListener("click",S=>{S.target.closest(".btfw-panel-container")||(S.preventDefault(),S.stopPropagation(),se(n,e))}),e.addEventListener("keydown",S=>{S.key!=="Enter"&&S.key!==" "||(S.preventDefault(),se(n,e))}),e.addEventListener("mouseleave",S=>{e.dataset.btfwFlyoutLocked!=="true"&&(i!=null&&i.contains(S.relatedTarget)||Y(n))}),i==null||i.addEventListener("mouseenter",()=>{b&&(clearTimeout(b),b=null)}),i==null||i.addEventListener("mouseleave",S=>{e.dataset.btfwFlyoutLocked!=="true"&&(e.contains(S.relatedTarget)||Y(n))})}function ie(){let e=N();U();let n=e==null?void 0:e.querySelector("#btfw-panel-bar");if(!n)return;let i=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((c,g)=>(Le[c.dataset.bind]||99)-(Le[g.dataset.bind]||99)),p=i.map(c=>c.dataset.bind).join("|"),S=document.getElementById("btfw-panels-menu-btn");if(S&&(S.hidden=i.length===0,i.length===0)){s="",X();return}if(p===s&&n.childElementCount===i.length)return;s=p;let r=n.classList.contains("open"),a=u;if(I(),n.replaceChildren(),n.style.setProperty("--btfw-panel-bar-count",String(Math.max(i.length,1))),i.forEach((c,g)=>{let C=c.dataset.bind,D=Te[C]||{short:"?",title:C},j=document.createElement("div");j.className="btfw-panel-btn",j.dataset.group=C,j.title=D.title,j.setAttribute("role","button"),j.setAttribute("aria-label",D.title),j.tabIndex=0;let oe=document.createElement("span");oe.className="btfw-panel-btn__label",oe.textContent=Fe[C]||D.short,j.appendChild(oe),j.appendChild(W(C,D,g)),n.appendChild(j),ae(j,C)}),r&&(G(!0),a&&i.some(g=>g.dataset.bind===a))){let g=n.querySelector(`.btfw-panel-btn[data-group="${a}"]`);g&&Q(a,g)}}function w(e,n,i={}){if(!e)return;let p=!!n,S=i.persist===!1,r=e.dataset.bind,a=we[r];e.dataset.docked=p?"true":"false",e.classList.toggle("btfw-stack-item--docked",p);let c=e.querySelector(".btfw-stack-dock-btn");c&&(c.setAttribute("aria-pressed",p?"true":"false"),c.title=p?"Pinned to panels menu":"Dock to panels menu"),p?Pe(e)?O(e):u===r&&(u=null):(O(e),e._btfwSetOpenState?e._btfwSetOpenState(!0):(e.dataset.open="true",e.classList.add("is-open"))),!S&&a&&$e(a,p),ie(),Ie()}function B(e,n){var g;let i=we[n];if(!i)return;let p=e.querySelector(".btfw-stack-item__header"),S=p==null?void 0:p.querySelector(".btfw-stack-header-toolbar"),r=S==null?void 0:S.querySelector(".btfw-stack-arrows");if(!r||r.querySelector(".btfw-stack-dock-btn"))return;let a=Me(i);e.dataset.docked=a?"true":"false",e.classList.toggle("btfw-stack-item--docked",a);let c=document.createElement("button");c.type="button",c.className="btfw-arrow btfw-stack-dock-btn",c.textContent="\u2AF7",c.setAttribute("aria-label",`Dock ${((g=Te[n])==null?void 0:g.title)||n} to panels menu`),c.setAttribute("aria-pressed",a?"true":"false"),c.title=a?"Pinned to panels menu":"Dock to panels menu",c.addEventListener("click",C=>{C.preventDefault(),C.stopPropagation(),e.dataset.docked!=="true"&&w(e,!0)}),r.insertBefore(c,r.firstChild)}function $(e,n={}){let{storageKey:i,getDefaultOpen:p,toggleClass:S,ariaLabel:r="Toggle panel visibility",openTitle:a="Hide panel",closeTitle:c="Show panel"}=n,g=ge(i),C=typeof p=="function"?p(g):g!==null?g:!0;e.hasAttribute("data-open")||(e.dataset.open=C?"true":"false"),e.classList.toggle("is-open",e.dataset.open!=="false");let D=e.querySelector(".btfw-stack-item__header"),j=D&&D.querySelector(".btfw-stack-arrows");if(!j||j.querySelector(`.${S}`))return;let oe=document.createElement("button");oe.type="button",oe.className=`btfw-arrow ${S}`,oe.setAttribute("aria-label",r),oe.style.display="flex",oe.style.alignItems="center",oe.style.justifyContent="center";let re=()=>{let ce=e.dataset.open!=="false";oe.textContent=ce?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",oe.title=ce?a:c,oe.setAttribute("aria-expanded",ce?"true":"false"),e.classList.toggle("is-open",ce)},be=(ce,Se={})=>{let Re=!!ce,xe=Se.persist===!1;xe&&(e._btfwSuppressPersist=!0),e.dataset.open=Re?"true":"false",re(),xe||Ae(i,Re),xe&&queueMicrotask(()=>{e._btfwSuppressPersist=!1})};oe.addEventListener("click",ce=>{ce.preventDefault(),ce.stopPropagation(),be(e.dataset.open==="false")}),re(),new MutationObserver(ce=>{for(let Se of ce)Se.type==="attributes"&&(re(),e._btfwSuppressPersist||Ae(i,e.dataset.open!=="false"))}).observe(e,{attributes:!0,attributeFilter:["data-open"]}),j.insertBefore(oe,j.firstChild),e._btfwSetOpenState=be,B(e,e.dataset.bind)}function V(e){return!!e.closest('.modal, [role="dialog"]')}function te(e){if(!e||e.querySelector("#btfw-footer"))return;let n=document.getElementById("btfw-footer");if(n&&n!==e&&!e.contains(n)){e.innerHTML="",e.appendChild(n);return}let i=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(p=>!V(p));i&&!e.contains(i)&&(i.classList.add("btfw-footer"),e.innerHTML="",e.appendChild(i))}function Z(e){let n=document.querySelector(`.btfw-stack-item[data-bind="${e}"]`),i=n==null?void 0:n.querySelector(".btfw-stack-item__header");if(!i)return null;let p=i.querySelector(".btfw-stack-header-actions");if(!p){p=document.createElement("span"),p.className="btfw-stack-header-actions";let S=i.querySelector(".btfw-stack-header-toolbar"),r=(S==null?void 0:S.querySelector(".btfw-stack-arrows"))||i.querySelector(".btfw-stack-arrows");S&&r?S.insertBefore(p,r):r?i.insertBefore(p,r):i.appendChild(p)}return p}function y(e,n){e&&(e.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),e.classList.add("btfw-stack-header-btn"),e.innerHTML!==n&&(e.innerHTML=n))}function E(){let e=Z("poll-group"),n=document.getElementById("newpollbtn");if(e&&n){y(n,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),n.parentElement!==e&&e.appendChild(n);let S=document.querySelector("#pollwrap > .poll-controls");S&&S.children.length===0&&S.remove()}let i=Z("motd-group"),p=document.getElementById("btfw-motd-editbtn");if(i&&p){y(p,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),p.parentElement!==i&&i.appendChild(p);let S=p.closest(".btfw-motd-editrow");S&&S.parentElement&&S.remove()}}function _(e){return fe.every(n=>n.selectors.some(p=>{var r,a;if(Ce.includes(p))return!1;let S=document.querySelector(p);if(!S||e.contains(S)||S.contains(e))return!1;if(p==="#pollwrap"){let c=(r=S.dataset)==null?void 0:r.btfwPollOverlay,g=(a=S.getAttribute)==null?void 0:a.call(S,"data-btfw-poll-overlay");if(c==="video"||g==="video")return!1}return!0})?!!e.querySelector(`[data-bind="${n.id}"]`):!0)}function R(e){if(!M){M=!0;try{let n=e.list,i=e.footer;if(_(n)&&n.children.length>0){P.ensureMotdStackPanel(e),v.ensurePollStackPanel(e),v.syncPollWrapVisibility(),E(),te(i);return}v.movePollButton(),v.detachPollWrapFromPlaylist();let p=new Map;fe.forEach(a=>{let c=[];a.selectors.forEach(g=>{let C=document.querySelector(g);if(C&&!(n.contains(C)||C.contains(n))&&!Ce.includes(g)){if(g==="#pollwrap"){let D=C.dataset&&C.dataset.btfwPollOverlay,j=C.getAttribute&&C.getAttribute("data-btfw-poll-overlay");if(D==="video"||j==="video")return}c.push(C)}}),c.length>0&&p.set(a.id,{group:a,elements:c})});let S=De(),r=[];p.forEach(({group:a,elements:c},g)=>{if(!Array.from(n.children).find(D=>D.dataset.bind===g))try{let D=T(a,c);D&&r.push({item:D,id:g,priority:a.priority,isGroup:!0})}catch(D){console.warn("[stack] Failed to create group item:",g,D)}}),S.length>0?r.sort((a,c)=>{let g=S.findIndex(D=>D.id===a.id),C=S.findIndex(D=>D.id===c.id);return g>=0&&C>=0?g-C:g>=0?-1:C>=0?1:a.priority-c.priority}):r.sort((a,c)=>a.priority-c.priority),r.forEach(({item:a})=>{try{a&&!n.contains(a)&&!a.contains(n)&&n.appendChild(a)}catch(c){console.warn("[stack] Failed to add item to list:",c)}}),ue(n),P.ensureMotdStackPanel(e),v.ensurePollStackPanel(e),v.syncPollWrapVisibility(),E(),te(i)}finally{M=!1}}}function K(){let e=x();if(!e||(R(e),P.wireMotdObservers(e),P.wireMotdSocket(e),v.wirePollObservers(e),v.wirePollSocket(e),A))return;A=!0;let n=new MutationObserver(()=>{d||(d=requestAnimationFrame(()=>{d=null,R(e)}))}),i=document.getElementById("btfw-leftpad"),p=document.getElementById("main");i&&n.observe(i,{childList:!0,subtree:!1}),p&&n.observe(p,{childList:!0,subtree:!1}),setTimeout(()=>{let a=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');a&&ve(a,ye,C=>de(C,k()));let c=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');c&&ve(c,ke,C=>C!==null?!!C:!0);let g=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');g&&ve(g,_e,C=>de(C,me())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(C=>{let D=we[C.dataset.bind];D&&w(C,Me(D),{persist:!1})}),N(),U(),ie(),v.syncPollPanelVisibility(e),Ie()},1e3);let S=0,r=setInterval(()=>{R(e),++S>2&&clearInterval(r)},700)}return document.addEventListener("btfw:layoutReady",K),document.addEventListener("btfw:chat:barsReady",()=>{N(),U(),ie()}),setTimeout(K,1200),document.addEventListener("btfw:channelThemeTint",()=>{let e=x();e&&setTimeout(()=>R(e),100)}),document.addEventListener("btfw:motd:updated",e=>{var i;let n=(i=e==null?void 0:e.detail)==null?void 0:i.html;typeof n=="string"&&P.applyMotdUpdate(n)}),{name:"feature:stack",hasMotdContent:k,resolveMotdHost:P.resolveMotdHost,normalizeMotdStructure:P.normalizeMotdStructure,applyMotdUpdate:P.applyMotdUpdate}});var At=Object.freeze({messagebuffer:"#messagebuffer",chatline:"#chatline",chatwrap:"#chatwrap",userlist:"#userlist",userlistItem:"#userlist li, #userlist .userlist_item, #userlist .user",videowrap:"#videowrap",pollwrap:"#pollwrap",motd:"#motd",motdwrap:"#motdwrap",chatMsg:".chat-msg, .message, [class*=message]",username:".username"}),Mt=Object.freeze({ready:"btfw:ready",layoutReady:"btfw:layoutReady",chatBarsReady:"btfw:chat:barsReady",themeSettingsApply:"btfw:themeSettings:apply",openThemeSettings:"btfw:openThemeSettings",layoutOrientation:"btfw:layout:orientation",layoutStackVisibility:"btfw:layout:stackVisibility",channelThemeTint:"btfw:channelThemeTint",chatAutoScrollChanged:"btfw:chat:autoScrollChanged",chatEmoteSizeChanged:"btfw:chat:emoteSizeChanged",chatMediaScaleChanged:"btfw:chat:mediaScaleChanged",chatImageHoverMagnifyChanged:"btfw:chat:imageHoverMagnifyChanged",chatGifAutoplayChanged:"btfw:chat:gifAutoplayChanged",chatJoinNoticesChanged:"btfw:chat:joinNoticesChanged",videoLocalSubsChanged:"btfw:video:localsubs:changed",layoutChatSideChanged:"btfw:layout:chatSideChanged",themeSettingsOpen:"btfw:themeSettings:open"}),Ve=Object.freeze({chatTextPx:"btfw:chat:textSize",avatarsMode:"btfw:chat:avatars",avatarUrlsCache:"btfw:chat:avatars:urls:v1",emoteSize:"btfw:chat:emoteSize",mediaScale:"btfw:chat:mediaScale",gifAutoplay:"btfw:chat:gifAutoplay",chatAutoScroll:"btfw:chat:autoScroll",imageHoverMagnify:"btfw:chat:imageHoverMagnify",chatJoinNotices:"btfw:chat:joinNotices",chatTimestampsShow:"btfw:chat:ts:show",chatTimestampsFormat:"btfw:chat:ts:fmt",chatToolsHistory:"btfw:chat:history",chatStickColor:"btfw:chat:stickColor",chatIgnore:"btfw:chat:ignore",chatUnameColors:"btfw:chat:unameColors",emojiCompat:"btfw:emoji:twemoji",emotesSort:"btfw:emotes:sort",gifsFavorites:"btfw:gifs:favorites",notifyEnabled:"btfw:notify:enabled",notifySounds:"btfw:notify:sounds:v2",themeMode:"btfw:theme:mode",localSubs:"btfw:video:localsubs",addFromUrlTemp:"btfw:addfromurl:addTemp",layoutSide:"btfw:layout:chatSide",layoutGridLeftPx:"btfw:grid:leftPx",layoutGridVideoRatio:"btfw:grid:videoRatio",channelOptionsSize:"btfw:channeloptions:size",stackOrder:"btfw-stack-order",stackMotdOpen:"btfw-stack-motd-open",stackPlaylistOpen:"btfw-stack-playlist-open",stackPollOpen:"btfw-stack-poll-open",stackMotdDocked:"btfw-stack-motd-docked",stackPlaylistDocked:"btfw-stack-playlist-docked",stackPollDocked:"btfw-stack-poll-docked",emojiCache:"btfw:emoji:cache",themeModeLegacy:"btfw:bulma:theme",chatNameColorRetired:"btfw:chat:nameColor"}),Pt=Object.freeze({emotesRecent:"btfw:recent:emotes:",userThemePresets:"btfw:userThemePresets:"});function Ye(t,o=null){try{let f=globalThis.localStorage.getItem(t);return f!=null?f:o}catch(f){return o}}function je(t,o){try{return globalThis.localStorage.setItem(t,o),!0}catch(f){return!1}}BTFW.define("feature:videoOverlay",[],async()=>{let t=(r,a=document)=>a.querySelector(r),o=["#mediarefresh","#voteskip","#fullscreenbtn"],f={localSubs:Ve.localSubs},l=5,u={owner:["chanowner","owner","founder","admin","administrator"]};function s(){var r;try{return((r=window.PLAYER)==null?void 0:r.mediaType)||null}catch(a){return null}}function b(){let r=(s()||"").toLowerCase();return r==="fi"||r==="gd"}function m(){try{return window.CLIENT||window.client||null}catch(r){return null}}function M(){try{return window.CHANNEL||window.channel||null}catch(r){return null}}function d(){let r=M();if(r&&typeof r.perms=="object"&&r.perms)return r.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(a){return{}}}function A(r=[]){let a=d();for(let c of r){let g=a==null?void 0:a[c];if(typeof g=="number")return g}}function P(){let r=A(u.owner);return typeof r=="number"?r:l}function k(r){if(!r)return!1;try{if(typeof r.hasPermission=="function"&&r.hasPermission("chanowner"))return!0}catch(a){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(a){}return!1}function h(){let r=m();if(!r)return!1;let a=Number(r.rank);return Number.isFinite(a)?!!(a>=P()||k(r)):!1}let v=()=>Ye(f.localSubs,"1")!=="0",x=r=>{je(f.localSubs,r?"1":"0"),document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!r}}))},T=0,L=0,O=0,N=2e3,q=8e3,U=45e3,H=12e4,F=q,J=!1,z=null;function W(){if(t("#btfw-vo-css"))return;let r=document.createElement("style");r.id="btfw-vo-css",r.textContent=`
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
    `,document.head.appendChild(r)}function I(r){let a=t("#videowrap");!a||!r||((r.parentElement!==a.parentElement||r.previousElementSibling!==a)&&a.insertAdjacentElement("afterend",r),r.classList.add("btfw-vo-visible"))}function G(){if(!t("#videowrap"))return null;let a=t("#btfw-video-overlay");a||(a=document.createElement("div"),a.id="btfw-video-overlay",a.setAttribute("data-testid","btfw-video-overlay")),a.classList.add("btfw-video-overlay"),a.getAttribute("data-testid")||a.setAttribute("data-testid","btfw-video-overlay"),I(a);let c=a.querySelector("#btfw-vo-bar");c||(c=document.createElement("div"),c.className="btfw-vo-bar",c.id="btfw-vo-bar",a.appendChild(c));let g=ne(a,c);return p(g.left),w(g),B(g),X(a),a}function X(r){r&&r.querySelectorAll("button").forEach(a=>{a.classList.contains("btfw-vo-btn")||a.classList.add("btfw-vo-btn")})}function ne(r,a){let c="btfw-vo-left",g="btfw-vo-right",C=a.querySelector(`#${c}`);C||(C=document.createElement("div"),C.id=c,C.className="btfw-vo-section btfw-vo-section--left",a.insertBefore(C,a.firstChild));let D=a.querySelector(`#${g}`);return D||(D=document.createElement("div"),D.id=g,D.className="btfw-vo-section btfw-vo-section--right",a.appendChild(D)),Array.from(a.children).forEach(j=>{j===C||j===D||D.appendChild(j)}),r.dataset.leftSection=`#${c}`,r.dataset.rightSection=`#${g}`,a.dataset.leftSection=`#${c}`,a.dataset.rightSection=`#${g}`,{left:C,right:D}}function Y(){return document.querySelector("#ytapiplayer video, video")}function Q(r=Y()){return r?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof r.webkitShowPlaybackTargetPicker=="function":!1}function ee(){if(!z)return;let r=z._btfwAirplayHandler;if(r){try{z.removeEventListener("webkitplaybacktargetavailabilitychanged",r)}catch(a){}delete z._btfwAirplayHandler}z=null}function se(r){if(!r||typeof r.addEventListener!="function"){ee();return}if(z===r)return;ee();let a=c=>{let g=!c||c.availability==="available",C=t("#btfw-airplay");C&&(C.style.display=g?"":"none")};try{r.addEventListener("webkitplaybacktargetavailabilitychanged",a),r._btfwAirplayHandler=a,z=r}catch(c){}}function ae(){let r=t("#btfw-airplay");if(!r)return;let a=Y();if(!Q(a)){r.style.display="none",ee();return}r.style.display="",se(a)}function ie(r,a){a&&a.classList.add("btfw-vo-visible")}function w(r){if(!(r!=null&&r.right)||!(r!=null&&r.left))return;let a=[];document.querySelector("#fullscreenbtn")||a.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:te,section:"right"}),a.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:E,section:"right"}),a.forEach(c=>{let g=document.querySelector(`#${c.id}`),C=c.section==="left"?r.left:r.right;if(g)C&&g.parentElement!==C&&C.appendChild(g);else{g=document.createElement("button"),g.id=c.id,g.className="btfw-vo-btn";let D=document.createElement("i");D.className=c.icon,g.appendChild(D),g.title=c.tooltip,g.addEventListener("click",c.action),(C||r.right).appendChild(g)}}),ae()}function B(r){let a=r==null?void 0:r.right;a&&o.forEach(c=>{let g=document.querySelector(c);if(!g)return;if(g.dataset.btfwOverlay==="1"){g.parentElement!==a&&a.appendChild(g);return}let C=document.createElement("span");C.hidden=!0,C.setAttribute("data-btfw-ph",c);try{g.insertAdjacentElement("afterend",C)}catch(D){}if(g.classList.add("btfw-vo-adopted"),g.dataset.btfwOverlay="1",g.id==="mediarefresh"){let D=g.onclick;g.onclick=j=>{j.preventDefault();let oe=!!(j&&j.isTrusted);V(()=>{if(typeof D=="function")try{return D.call(g,j),!0}catch(re){console.warn("[video-overlay] native refresh handler failed:",re)}return!1},{isUserAction:oe})}}a.appendChild(g)})}function $(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(r){console.warn("[video-overlay] Media refresh failed:",r)}return!1}function V(r,a={}){let{isUserAction:c=!1}=a,g=Date.now();if(O&&g-O>H&&(F=q,T=0),g<L){let re=Math.ceil((L-g)/1e3);return _(c?`Refresh available in ${re}s`:`Auto refresh paused. Next attempt in ${re}s`,"warning"),!1}let C=c?N:F;if(O&&g-O<C){let re=C-(g-O),be=Math.ceil(re/1e3);return L=g+re,_(c?`Refresh available in ${be}s`:`Auto refresh paused. Next attempt in ${be}s`,"warning"),!1}if(T++,T>=10)return L=g+3e4,T=0,_("Refresh limit reached. 30s cooldown active.","error"),!1;let D=c?6e3:Math.max(12e3,F+2e3);setTimeout(()=>{T>0&&T--},D);let j=!1;if(typeof r=="function")try{j=r()===!0}catch(re){console.warn("[video-overlay] Refresh handler error:",re)}return j||(j=$()),O=Date.now(),c?F=q:F=Math.min(U,Math.max(q,Math.round(F*(j?1.25:1.5)))),L=Math.max(L,O+(c?N:F)),!c&&j?_(`Auto refresh sent. Next attempt in ${Math.ceil(F/1e3)}s`,"info"):_(j?"Media refreshed":"Unable to refresh media",j?"success":"error"),j}function te(){let r=t("#videowrap");r&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen?r.webkitRequestFullscreen():r.mozRequestFullScreen&&r.mozRequestFullScreen())}function Z(r,a=!0){if(!r||!Q(r))return!1;if(r.setAttribute("airplay","allow"),r.setAttribute("x-webkit-airplay","allow"),a&&typeof r.webkitShowPlaybackTargetPicker=="function")try{r.webkitShowPlaybackTargetPicker()}catch(c){console.warn("[video-overlay] AirPlay picker failed:",c)}return ae(),!0}function y(){if(!(J||!window.socket)){J=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let r=Y();r&&(Z(r,!1),se(r)),ae()},1e3)})}catch(r){console.warn("[video-overlay] Failed to attach AirPlay listener:",r)}}}function E(){let r=Y();return Q(r)?Z(r)?(_("AirPlay enabled","success"),y(),!0):(_("AirPlay not available","warning"),!1):(ae(),_("AirPlay not available","warning"),!1)}function _(r,a="info"){let c=document.getElementById("btfw-notification");c||(c=document.createElement("div"),c.id="btfw-notification",c.className="btfw-notification",document.body.appendChild(c)),c.textContent=r,c.className=`btfw-notification btfw-notification--${a} btfw-notification--show`,clearTimeout(c._hideTimer),c._hideTimer=setTimeout(()=>{c.classList.remove("btfw-notification--show")},3e3)}function R(){return t("video")}function K(r){let a=(r||"").replace(/\r\n/g,`
`).trim()+`
`;return a=a.replace(/^\d+\s*$\n/gm,""),a=a.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),a=a.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+a}async function e(){let r=R();if(!r){i("Local subs only for HTML5 sources.");return}let a=document.createElement("input");a.type="file",a.accept=".vtt,.srt,text/vtt,text/plain",a.style.display="none",document.body.appendChild(a);let c=new Promise(g=>{a.addEventListener("change",async()=>{let C=a.files&&a.files[0];if(document.body.removeChild(a),!C)return g(!1);try{let D=await C.text(),oe=(C.name.split(".").pop()||"").toLowerCase()==="srt"?K(D):D.startsWith("WEBVTT")?D:`WEBVTT

`+D,re=URL.createObjectURL(new Blob([oe],{type:"text/vtt"}));n(r,re,C.name.replace(/\.[^.]+$/,"")||"Local"),i("Subtitles loaded."),g(!0)}catch(D){console.error(D),i("Failed to load subtitles."),g(!1)}},{once:!0})});a.click(),await c}function n(r,a,c){var C;(C=t('track[data-btfw="1"]',r))==null||C.remove();let g=document.createElement("track");g.kind="subtitles",g.label=c||"Local",g.srclang="en",g.src=a,g.default=!0,g.setAttribute("data-btfw","1"),r.appendChild(g);try{for(let D of r.textTracks)D.mode=D.label===g.label?"showing":"disabled"}catch(D){}}function i(r){let a=t("#btfw-mini-toast");a||(a=document.createElement("div"),a.id="btfw-mini-toast",document.body.appendChild(a)),a.textContent=r,a.style.opacity="1",clearTimeout(a._hid),a._hid=setTimeout(()=>a.style.opacity="0",1400)}function p(r){if(!r)return;let a=document.querySelector("#btfw-vo-subs");if(!a){a=document.createElement("button"),a.id="btfw-vo-subs",a.className="btfw-vo-btn",a.title="Load local subtitles (.vtt/.srt)";let g=document.createElement("i");g.className="fa fa-cc",a.appendChild(g),a.addEventListener("click",C=>{C.preventDefault(),e()}),r.insertBefore(a,r.firstChild||null)}let c=v()&&b();a.style.display=c?"":"none"}function S(){W(),G();let r=[t("#videowrap"),t("#rightcontrols"),t("#leftcontrols"),document.body].filter(Boolean),a=new MutationObserver(()=>G());r.forEach(c=>a.observe(c,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>G());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>G(),0)})}catch(c){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",S):S(),{name:"feature:videoOverlay",setLocalSubsEnabled:x,toggleFullscreen:te,enableAirplay:E}});var Ke="https://vidprox.movies-storage-a.workers.dev/?url=";function Be(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function Ee(){return Date.now()}var Qe=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var o,f,l;let t=typeof window!="undefined"&&(((o=window.BTFW_CONFIG)==null?void 0:o.corsVideoProxy)||((l=(f=window.BTFW_CONFIG)==null?void 0:f.integrations)==null?void 0:l.corsVideoProxy));if(typeof t=="string"&&t.trim()){let u=t.trim();if(u.includes("?"))return u;let s=u.endsWith("/")?"":"/";return`${u}${s}?url=`}return Ke},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(t){try{return new URL(Ke).origin.toLowerCase()}catch(o){return""}}},_isTrusted(t){if(!t)return!1;if(String(t).includes(this.CORS_PROXY))return!0;try{let o=new URL(t),f=o.origin.toLowerCase(),l=this._getCorsProxyOrigin();return l&&f===l?!0:/^vidprox\./i.test(o.hostname)}catch(o){return!1}},_unwrapProxiedUrl(t){if(!t||!this._isTrusted(t))return t;try{return new URL(t).searchParams.get("url")||t}catch(o){return t}},_markInternalSrcSet(){this._lastInternalSrcSetAt=Ee()},_isInsideInternalWindow(){return Ee()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let t=this._getMediaElement();return t?t.crossOrigin==="anonymous"||t.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var o;if(this._hasAnonymousCrossOrigin())return!1;let t=this._readCurrentSrc();if(t&&!this._isTrusted(t))return!1;try{return(o=this.player)==null||o.crossOrigin("anonymous"),!0}catch(f){return!1}},_clearMediaElementForCorsSwap(){let t=this._getMediaElement();if(t)try{for(t.removeAttribute("src"),t.removeAttribute("crossorigin");t.firstChild;)t.removeChild(t.firstChild);t.load()}catch(o){}},_same(t,o){return String(t||"")===String(o||"")},_readCurrentSrc(){var t,o,f;try{let l=((o=(t=this.player)==null?void 0:t.currentSrc)==null?void 0:o.call(t))||"";if(l)return l}catch(l){}return((f=this._getMediaElement())==null?void 0:f.currentSrc)||""},_getMediaElement(){var f;let t=(f=this.player)==null?void 0:f.tech_;if(t){try{let l=typeof t.el=="function"?t.el():null;if(l instanceof HTMLMediaElement&&l.isConnected)return l}catch(l){}if(t.el_ instanceof HTMLMediaElement&&t.el_.isConnected)return t.el_}let o=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return o instanceof HTMLMediaElement&&o.isConnected?o:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(t){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(t){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(t){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(t){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(t){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(t){}this.mergerNode=null}},resetMediaBinding(){var o,f;this.disconnectChain();let t=this._getMediaElement();if(t&&this._syncFromRegistry(t)){((o=this.audioContext)==null?void 0:o.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((f=this.audioContext)==null?void 0:f.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(t){var b;let o=(b=this.player)==null?void 0:b.tech_;if(!(o!=null&&o.el_)||o.el_!==t)return null;let f=t.parentNode;if(!f)return null;let l=t.tagName.toLowerCase()==="audio"?"audio":"video",u=document.createElement(l);u.className=t.className,t.id&&(u.id=t.id),u.setAttribute("playsinline",""),u.setAttribute("webkit-playsinline",""),u.classList.contains("vjs-tech")||u.classList.add("vjs-tech");let s=t.crossOrigin||t.getAttribute("crossorigin");return s&&(u.crossOrigin=s,u.setAttribute("crossorigin",s)),f.replaceChild(u,t),o.el_=u,delete t.__btfwSourceNode,u},_syncFromRegistry(t){let o=Be().get(t)||t.__btfwSourceNode||null;return o?(Be().set(t,o),this.sourceNode=o,this._sourceMediaElement=t,o.context instanceof AudioContext&&o.context.state!=="closed"&&(this.audioContext=o.context),o):null},_getOrCreateSourceNode(t){let o=Be(),f=o.get(t)||t.__btfwSourceNode||null;if(f)return o.set(t,f),this.sourceNode=f,this._sourceMediaElement=t,f.context instanceof AudioContext&&f.context.state!=="closed"&&(this.audioContext=f.context),f;if(this.sourceNode&&this._sourceMediaElement===t)return o.set(t,this.sourceNode),t.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let l;try{l=this.audioContext.createMediaElementSource(t)}catch(u){if(!(u instanceof DOMException)||u.name!=="InvalidStateError")throw u;let s=this._syncFromRegistry(t);if(s)return s;let b=this._swapVideoTechElement(t);if(!b)throw u;let m=this._readCurrentSrc();if(m&&this.player){this._markInternalSrcSet(),this.player.src({src:m,type:"video/mp4"});try{this.player.load()}catch(M){}}return this._getOrCreateSourceNode(b)}return o.set(t,l),t.__btfwSourceNode=l,this.sourceNode=l,this._sourceMediaElement=t,l},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(t){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(t){return!1}},_clearCrossOriginAttribute(){var o,f;let t=this._getMediaElement();if(t)try{t.crossOrigin=null,t.removeAttribute("crossorigin")}catch(l){}try{(f=(o=this.player)==null?void 0:o.crossOrigin)==null||f.call(o,null)}catch(l){}},cleanup(){this.disconnectChain();let t=this._getMediaElement();t&&(t.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let t=this._readCurrentSrc();return this.sourceNode&&t&&!this._isTrusted(t)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(t,{currentTime:o=0,wasPlaying:f=!1,clearCrossOrigin:l=!1}={}){if(!this.player||!t)return Promise.resolve(!1);let u=this.player;try{this.player.pause()}catch(s){}l&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:t,type:"video/mp4"});try{this.player.load()}catch(s){}return new Promise(s=>{let b=!1,m=()=>{if(b)return;b=!0;try{u.off("canplay",M)}catch(A){}try{u.off("loadeddata",M)}catch(A){}try{u.currentTime(o)}catch(A){}let d=f?u.play():Promise.resolve();Promise.resolve(d).catch(()=>{}).finally(()=>s(!0))},M=()=>m();try{u.one("canplay",M)}catch(d){try{u.on("canplay",M)}catch(A){}}try{u.one("loadeddata",M)}catch(d){}typeof u.ready=="function"&&u.ready(()=>{try{typeof u.readyState=="function"&&u.readyState()>=2&&m()}catch(d){}}),setTimeout(m,5e3)})},startWatchdog(){if(!this.player)return;let t=this.player;this.stopWatchdog();let o=this._getMediaElement();if(o&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(o,{attributes:!0,attributeFilter:["src","crossorigin"]});let f=new MutationObserver(()=>{this._checkAndReapply("sources")});f.observe(o,{childList:!0,subtree:!0}),this._sourceObserver=f}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([f,l])=>{t.on(f,l)})}catch(f){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var o;this._stopWatchdogInterval();let t=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(f){}try{(o=this._sourceObserver)==null||o.disconnect()}catch(f){}this._sourceObserver=null,this._mutationObserver=null}if(t&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([f,l])=>{t.off(f,l)})}catch(f){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(t){if(!this.player)return;let o=this._readCurrentSrc();if(o&&(this._lastKnownSrc=o,!this._isInsideInternalWindow())){if(this._isTrusted(o)){this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(Ee()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=Ee(),this._forceProxyPreservingState(o)}}},async _forceProxyPreservingState(t){if(!this.player)return!1;let o=this.player,f=o.currentTime(),l=!o.paused();if(this._isTrusted(t))return this.isProxied=!0,this.proxiedSrc=t,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(t)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(t)||t,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(u){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(u){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(u){}return new Promise(u=>{let s=!1,b=()=>{if(!s){s=!0;try{o.off("canplay",m)}catch(M){}try{o.off("loadeddata",m)}catch(M){}try{o.currentTime(f)}catch(M){}this.isProxied=!0,l&&o.play().catch(()=>{}),u(!0)}},m=()=>b();try{o.one("canplay",m)}catch(M){try{o.on("canplay",m)}catch(d){}}try{o.one("loadeddata",m)}catch(M){}typeof o.ready=="function"&&o.ready(()=>{try{typeof o.readyState=="function"&&o.readyState()>=2&&b()}catch(M){}}),setTimeout(b,5e3)})},async ensureProxy(){if(!this.player)return!1;let t=this.player,o=this._readCurrentSrc();if(!o)return!1;if(this._isTrusted(o)){if(this.isProxied=!0,this.proxiedSrc=o,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(o)),this._hasAnonymousCrossOrigin())return!0;let f=t.currentTime(),l=!t.paused();try{t.pause()}catch(u){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),t.src({src:o,type:"video/mp4"});try{t.load()}catch(u){}return new Promise(u=>{t.ready(()=>{try{t.currentTime(f)}catch(s){}l&&t.play().catch(()=>{}),u(!0)})})}return await this._forceProxyPreservingState(o),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var o,f;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let l=this._readCurrentSrc();if(this._isTrusted(l))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let t=this._getMediaElement();if(!t)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((o=this.audioContext)==null?void 0:o.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),t.disableRemotePlayback=!0;let l=this._getOrCreateSourceNode(t),u=this.audioContext;if(!u)return!1;let s=l;if(this.normalizationEnabled){this.compressorNode=u.createDynamicsCompressor();let b=(f=this.NORM_PRESETS[this.currentNormPreset])!=null?f:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(b.threshold,u.currentTime),this.compressorNode.knee.setValueAtTime(b.knee,u.currentTime),this.compressorNode.ratio.setValueAtTime(b.ratio,u.currentTime),this.compressorNode.attack.setValueAtTime(b.attack,u.currentTime),this.compressorNode.release.setValueAtTime(b.release,u.currentTime),s.connect(this.compressorNode),s=this.compressorNode}return this.monoEnabled&&(this.splitterNode=u.createChannelSplitter(2),this.monoMixGain=u.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=u.createChannelMerger(2),s.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),s=this.mergerNode),this.boostEnabled&&(this.gainNode=u.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,s.connect(this.gainNode),s=this.gainNode),s.connect(u.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(l){return console.error("[BTFW_AUDIO] Error building audio chain:",l),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let t=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),t}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(t){return this.NORM_PRESETS[t]?(this.currentNormPreset=t,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(t){return this.BOOST_MULTIPLIER=t,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let t=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),t}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let t=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),t}return this._disableAllProcessing()}};(function(){"use strict";let t=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),o=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),f="--btfw-boost-anchor",l="--btfw-norm-anchor";function u(b,m,M){if(o&&M){m.style.setProperty("anchor-name",M),b.style.setProperty("position-anchor",M),b.style.setProperty("top","anchor(bottom)"),b.style.setProperty("left","anchor(left)");return}let d=m.getBoundingClientRect();b.style.left=d.left+"px",b.style.top=d.bottom+"px"}function s(b){window.BTFW&&typeof BTFW.define=="function"?b():setTimeout(()=>s(b),0)}s(function(){BTFW.define("feature:audio",[],async()=>{let b=(e,n=document)=>n.querySelector(e),m=Qe,M=null,d=null,A=null,P=!1,k=!1,h=!1,v=null,x=null,T=null,L=null,O=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function N(e){M&&(e?(M.classList.add("active"),M.style.background="rgba(46, 213, 115, 0.3)",M.style.borderColor="#2ed573",M.style.color="#2ed573",M.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(M.classList.remove("active"),M.style.background="",M.style.borderColor="",M.style.color="",M.style.boxShadow=""))}function q(e,n="info"){let i=b("#btfw-audioboost-toast");i||(i=document.createElement("div"),i.id="btfw-audioboost-toast",i.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${n==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=e,i.style.background=n==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function U(){if(await m.enableBoost()){P=!0;let n=Math.round(m.BOOST_MULTIPLIER*100);q(`Boosted by ${n}%`,"success"),N(!0)}else{let n=m._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";q(n,"error")}}async function H(){await m.disableBoost(),P=!1,N(!1)}function F(e){d&&(e?(d.classList.add("active"),d.style.background="rgba(52, 152, 219, 0.3)",d.style.borderColor="#3498db",d.style.color="#3498db",d.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(d.classList.remove("active"),d.style.background="",d.style.borderColor="",d.style.color="",d.style.boxShadow=""))}function J(e,n="info"){let i=b("#btfw-audionorm-toast");i||(i=document.createElement("div"),i.id="btfw-audionorm-toast",i.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${n==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=e,i.style.background=n==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function z(){if(await m.enableNormalization())k=!0,J("Normalization enabled","success"),F(!0);else{let n=m._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";J(n,"error")}}async function W(){await m.disableNormalization(),k=!1,F(!1)}function I(e){A&&(e?(A.classList.add("active"),A.style.background="rgba(155, 89, 182, 0.3)",A.style.borderColor="#9b59b6",A.style.color="#9b59b6",A.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(A.classList.remove("active"),A.style.background="",A.style.borderColor="",A.style.color="",A.style.boxShadow=""))}function G(e,n="info"){let i=b("#btfw-mono-toast");i||(i=document.createElement("div"),i.id="btfw-mono-toast",i.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${n==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(i)),i.textContent=e,i.style.background=n==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",i.style.opacity="1",setTimeout(()=>{i.style.opacity="0"},2e3)}async function X(){if(await m.enableMono())h=!0,G("Stereo audio enabled","success"),I(!0);else{let n=m._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";G(n,"error")}}async function ne(){await m.disableMono(),h=!1,I(!1)}function Y(){let e=document.createElement("button");e.id="btfw-vo-audioboost",e.className="btn btn-sm btn-default btfw-vo-adopted";let n=Math.round(m.BOOST_MULTIPLIER*100);e.title=`Toggle Audio Boost (${n}%)`,e.setAttribute("data-btfw-overlay","1");let i=document.createElement("i");return i.className="fa fa-bullhorn",e.appendChild(i),e.addEventListener("click",()=>{m.boostEnabled?H():U()}),e.addEventListener("mouseenter",()=>{T&&(clearTimeout(T),T=null),ae()}),e.addEventListener("mouseleave",()=>{T=setTimeout(()=>ie(),150)}),e}function Q(){let e=document.createElement("button");e.id="btfw-vo-audionorm",e.className="btn btn-sm btn-default btfw-vo-adopted";let n=m.NORM_PRESETS[m.currentNormPreset].label;e.title=`Toggle Audio Normalization (${n})`,e.setAttribute("data-btfw-overlay","1");let i=document.createElement("i");return i.className="fa fa-sliders",e.appendChild(i),e.addEventListener("click",()=>{m.normalizationEnabled?W():z()}),e.addEventListener("mouseenter",()=>{L&&(clearTimeout(L),L=null),$()}),e.addEventListener("mouseleave",()=>{L=setTimeout(()=>V(),150)}),e}function ee(){let e=document.createElement("button");e.id="btfw-vo-mono",e.className="btn btn-sm btn-default btfw-vo-adopted",e.title="Toggle Mono Audio (mix both channels to stereo)",e.setAttribute("data-btfw-overlay","1");let n=document.createElement("i");return n.className="fa fa-headphones",e.appendChild(n),e.addEventListener("click",()=>{m.monoEnabled?ne():X()}),e}function se(){if(v)return v;let e=document.createElement("div");return e.id="btfw-boost-context-menu",t&&(e.popover="auto"),e.style.cssText=`
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
          ${t?"":"display: none;"}
        `,O.forEach(n=>{let i=document.createElement("button");i.className="btfw-context-item",i.textContent=n.label,i.style.cssText=`
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
          `,m.BOOST_MULTIPLIER===n.multiplier&&(i.style.background="rgba(46, 213, 115, 0.2)",i.style.color="#2ed573"),i.addEventListener("mouseenter",()=>{m.BOOST_MULTIPLIER!==n.multiplier&&(i.style.background="rgba(109, 77, 246, 0.2)")}),i.addEventListener("mouseleave",()=>{m.BOOST_MULTIPLIER!==n.multiplier&&(i.style.background="transparent")}),i.addEventListener("click",async()=>{if(await m.setBoostMultiplier(n.multiplier),w(),M){let p=Math.round(n.multiplier*100);M.title=`Toggle Audio Boost (${p}%)`}m.boostEnabled&&q(`Boost set to ${n.label}`,"success")}),e.appendChild(i)}),e.addEventListener("mouseenter",()=>{T&&(clearTimeout(T),T=null)}),e.addEventListener("mouseleave",()=>{T=setTimeout(()=>ie(),100)}),document.body.appendChild(e),v=e,e}function ae(){if(!M)return;let e=se();u(e,M,f),t?e.matches(":popover-open")||e.showPopover():e.style.display="block"}function ie(){v&&(t?v.matches(":popover-open")&&v.hidePopover():v.style.display="none")}function w(){if(!v)return;v.querySelectorAll(".btfw-context-item").forEach((n,i)=>{let p=O[i];m.BOOST_MULTIPLIER===p.multiplier?(n.style.background="rgba(46, 213, 115, 0.2)",n.style.color="#2ed573"):(n.style.background="transparent",n.style.color="#e0e0e0")})}function B(){if(x)return x;let e=document.createElement("div");return e.id="btfw-norm-context-menu",t&&(e.popover="auto"),e.style.cssText=`
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
          ${t?"":"display: none;"}
        `,Object.keys(m.NORM_PRESETS).forEach(n=>{let i=m.NORM_PRESETS[n],p=document.createElement("button");p.className="btfw-context-item",p.textContent=i.label,p.style.cssText=`
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
          `,m.currentNormPreset===n&&(p.style.background="rgba(52, 152, 219, 0.2)",p.style.color="#3498db"),p.addEventListener("mouseenter",()=>{m.currentNormPreset!==n&&(p.style.background="rgba(109, 77, 246, 0.2)")}),p.addEventListener("mouseleave",()=>{m.currentNormPreset!==n&&(p.style.background="transparent")}),p.addEventListener("click",async()=>{await m.setNormPreset(n),te(),d&&(d.title=`Toggle Audio Normalization (${i.label})`),m.normalizationEnabled&&J(`Preset: ${i.label}`,"success")}),e.appendChild(p)}),e.addEventListener("mouseenter",()=>{L&&(clearTimeout(L),L=null)}),e.addEventListener("mouseleave",()=>{L=setTimeout(()=>V(),100)}),document.body.appendChild(e),x=e,e}function $(){if(!d)return;let e=B();u(e,d,l),t?e.matches(":popover-open")||e.showPopover():e.style.display="block"}function V(){x&&(t?x.matches(":popover-open")&&x.hidePopover():x.style.display="none")}function te(){if(!x)return;let e=x.querySelectorAll(".btfw-context-item");Object.keys(m.NORM_PRESETS).forEach((n,i)=>{let p=e[i];m.currentNormPreset===n?(p.style.background="rgba(52, 152, 219, 0.2)",p.style.color="#3498db"):(p.style.background="transparent",p.style.color="#e0e0e0")})}function Z(){let e=b("#btfw-vo-left");if(!e)return!1;let n=b("#btfw-vo-audioboost");n&&n.remove();let i=b("#btfw-vo-audionorm");i&&i.remove();let p=b("#btfw-vo-mono");return p&&p.remove(),M=Y(),d=Q(),A=ee(),e.appendChild(M),e.appendChild(d),e.appendChild(A),!0}function y(e,n=20){let i=0,p=setInterval(()=>{i++,Z()?(clearInterval(p),e()):i>=n&&clearInterval(p)},500)}function E(){if(typeof videojs=="undefined"){setTimeout(E,500);return}if(!b("#ytapiplayer")){setTimeout(E,500);return}m.player=videojs("ytapiplayer"),m.originalSrc=m._readCurrentSrc(),m.startWatchdog()}function _(){setTimeout(()=>{m.resetMediaBinding(),m.boostEnabled=!1,m.normalizationEnabled=!1,m.monoEnabled=!1,m.isProxied=!1,N(!1),F(!1),I(!1),E(),P&&setTimeout(()=>{U()},1200),k&&setTimeout(()=>{z()},1200),h&&setTimeout(()=>{X()},1200)},600)}function R(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>m._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>m._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",_))}function K(){y(()=>{E()}),R()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",K):K(),{name:"feature:audio",activate:U,deactivate:H,isActive:()=>m.boostEnabled,activateNormalization:z,deactivateNormalization:W,isNormalizationActive:()=>m.normalizationEnabled,activateMono:X,deactivateMono:ne,isMonoActive:()=>m.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async b=>b.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async b=>b.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async b=>b.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async b=>b.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:t})=>{let o=await t("util:tmdb-proxy"),f="movie-info",l={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},u="btfw-movie-info-style",s={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},b=0,m=!1,M=null;function d(y){typeof y=="function"&&s.cleanup.push(y)}function A(){for(;s.cleanup.length;){let y=s.cleanup.pop();try{y()}catch(E){}}s.header&&(s.header.remove(),s.header=null)}function P(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null),s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null),b=0,s.currentTitle="",s.isInitialized=!1,A()}function k(y){if(typeof y=="boolean")return y;if(typeof y=="number")return Number.isFinite(y)?y>0:!1;if(typeof y=="string"){let E=y.trim().toLowerCase();return E?E==="1"||E==="true"||E==="yes"||E==="on":!1}return!1}function h(){let y=[()=>{var E,_,R;return(R=(_=(E=window.BTFW_THEME_ADMIN)==null?void 0:E.integrations)==null?void 0:_.movieInfo)==null?void 0:R.enabled},()=>{var E,_,R;return(R=(_=(E=window.BTFW_CONFIG)==null?void 0:E.integrations)==null?void 0:_.movieInfo)==null?void 0:R.enabled},()=>{var E,_;return(_=(E=window.BTFW_CONFIG)==null?void 0:E.movieInfo)==null?void 0:_.enabled},()=>{var E;return(E=window.BTFW_CONFIG)==null?void 0:E.movieInfoEnabled},()=>{var E,_;return(_=(E=document==null?void 0:document.body)==null?void 0:E.dataset)==null?void 0:_.btfwMovieInfoEnabled}];for(let E of y)try{let _=typeof E=="function"?E():E;if(k(_))return!0}catch(_){}return!1}function v(){if(M||typeof MutationObserver!="function")return;let y=document.body;y&&(M=new MutationObserver(()=>O()),M.observe(y,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function x(){if(m)return;m=!0;let y=()=>O();document.addEventListener("btfw:channelIntegrationsChanged",y),document.addEventListener("btfw:ready",y)}function T(y=0){s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.initTimer=window.setTimeout(()=>{s.initTimer=null,h()&&L()},Math.max(0,y))}function L(){if(s.isInitialized)return;let y=document.querySelector(l.TOPBAR_SELECTOR);if(!y){T(500);return}try{N(y),te(),U(),s.isInitialized=!0,setTimeout(()=>{X(),ne()},120)}catch(E){T(800)}}function O(){h()?s.isInitialized?(X(),setTimeout(ne,80)):T(0):P()}function N(y){if(!y&&(y=document.querySelector(l.TOPBAR_SELECTOR),!y))throw new Error("Chat topbar not found");let E=document.getElementById(l.CONTAINER_ID);E&&E.remove();let _=document.createElement("div");_.id=l.CONTAINER_ID,_.className="btfw-movie-header hide",_.dataset.module=f,y.insertAdjacentElement("afterend",_),s.header=_}function q(){try{return window.socket||window.SOCKET||null}catch(y){return null}}function U(){H(),z();let y=V(X,250);window.addEventListener("resize",y),d(()=>window.removeEventListener("resize",y))}function H(){F(),J()}function F(){let y=document.querySelector(l.TITLE_SELECTOR);if(y){let E=()=>I(),_=()=>G();y.addEventListener("mouseenter",E),y.addEventListener("mouseleave",_),d(()=>{y.removeEventListener("mouseenter",E),y.removeEventListener("mouseleave",_)})}else if(typeof MutationObserver=="function"){let E=new MutationObserver(()=>{document.querySelector(l.TITLE_SELECTOR)&&(E.disconnect(),F())});E.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),d(()=>{try{E.disconnect()}catch(_){}})}}function J(){let y=s.header;if(!y)return;let E=()=>W(),_=()=>G();y.addEventListener("mouseenter",E),y.addEventListener("mouseleave",_),d(()=>{y.removeEventListener("mouseenter",E),y.removeEventListener("mouseleave",_)})}function z(){let y=q();if(y&&typeof y.on=="function"){y.on("changeMedia",ne),d(()=>{var R,K;try{(R=y.off)==null||R.call(y,"changeMedia",ne)}catch(e){try{(K=y.removeListener)==null||K.call(y,"changeMedia",ne)}catch(n){}}});return}let E=0,_=()=>{if(!h()){s.socketRetryTimer=null;return}let R=q();if(R&&typeof R.on=="function"){R.on("changeMedia",ne),d(()=>{var K,e;try{(K=R.off)==null||K.call(R,"changeMedia",ne)}catch(n){try{(e=R.removeListener)==null||e.call(R,"changeMedia",ne)}catch(i){}}}),s.socketRetryTimer=null;return}if(E+=1,E>10){s.socketRetryTimer=null;return}s.socketRetryTimer=window.setTimeout(_,1e3)};s.socketRetryTimer=window.setTimeout(_,1200),d(()=>{s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null)})}function W(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null)}function I(){W(),s.header&&(s.header.classList.remove("hide"),s.header.classList.add("show"))}function G(){W(),s.hideTimer=window.setTimeout(()=>{s.header&&(s.header.classList.remove("show"),s.header.classList.add("hide"),setTimeout(()=>{s.header&&s.header.classList.contains("hide")&&s.header.classList.remove("hide")},320))},300)}function X(){if(!s.header)return;let y=window.innerWidth<=768;s.header.classList.toggle("btfw-mobile",y)}async function ne(){var K;if(!s.isInitialized)return;let y=document.querySelector(l.TITLE_SELECTOR),E=s.header;if(!y||!E)return;let _=((K=y.textContent)==null?void 0:K.trim())||"";if(!_){s.currentTitle="",ae();return}if(_===s.currentTitle)return;s.currentTitle=_;let R=++b;ee();try{let e=await Q(_);if(R!==b)return;w(e)}catch(e){if(R!==b)return;o.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),se()}}function Y(y){let E=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],_=y;return E.forEach(R=>{let K=new RegExp(`\\b${R}\\b`,"gi");_=_.replace(K,"")}),_.replace(/\s{2,}/g," ").trim()}async function Q(y){var n;if(!o.isAvailable())throw new Error(o.MISSING_PROXY_MSG);let E=y.match(/(.+)\s*\((\d{4})\)/),_=E?E[1].trim():y,R=E?E[2]:"";R||(E=y.match(/(.+?)\s+(\d{4})\s*$/),E&&(_=E[1].trim(),R=E[2]));let K=Y(_),e=await o.tmdbFetch("search/movie",{query:K,year:R});if(((n=e==null?void 0:e.results)==null?void 0:n.length)>0){let i=e.results[0];return{title:y,backdrop:i.backdrop_path?`https://image.tmdb.org/t/p/w1280${i.backdrop_path}`:null,poster:i.poster_path?`https://image.tmdb.org/t/p/w500${i.poster_path}`:null,summary:i.overview||"",rating:i.vote_average||0,releaseDate:i.release_date||"",voteCount:i.vote_count||0}}return{title:y,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function ee(){if(!s.header)return;ie();let y=document.createElement("div");y.className="btfw-movie-content";let E=document.createElement("div");E.className="btfw-movie-loading";let _=document.createElement("i");_.className="fa fa-spinner fa-spin";let R=document.createElement("p");R.textContent="Loading movie information...",E.append(_,R),y.appendChild(E),s.header.replaceChildren(y)}function se(){if(!s.header)return;ie();let y=document.createElement("div");y.className="btfw-movie-content";let E=document.createElement("div");E.className="btfw-movie-error";let _=document.createElement("i");_.className="fa fa-exclamation-triangle";let R=document.createElement("p");R.textContent="Unable to fetch movie information";let K=document.createElement("small");K.textContent="Check TMDB API key in Theme Settings",E.append(_,R,K),y.appendChild(E),s.header.replaceChildren(y)}function ae(){if(!s.header)return;ie();let y=document.createElement("div");y.className="btfw-movie-content";let E=document.createElement("p");E.textContent="No movie information available",y.appendChild(E),s.header.replaceChildren(y)}function ie(){s.header&&(s.header.style.backgroundImage="",s.header.style.backgroundColor="")}function w(y){if(!s.header)return;s.header.replaceChildren(),l.ENABLE_BACKDROP&&y.backdrop?(s.header.style.backgroundImage=`url(${y.backdrop})`,s.header.style.backgroundSize="cover",s.header.style.backgroundPosition="center"):ie();let E=document.createElement("div");E.className="btfw-movie-overlay",s.header.appendChild(E);let _=document.createElement("div");if(_.className="btfw-movie-content",s.header.appendChild(_),y.poster){let e=document.createElement("img");e.src=y.poster,e.alt=`${y.title} Poster`,e.className="btfw-movie-poster",_.appendChild(e)}let R=document.createElement("div");R.className="btfw-movie-details",_.appendChild(R);let K=document.createElement("h2");if(K.textContent=y.title,K.className="btfw-movie-title",R.appendChild(K),l.SHOW_SUMMARY&&y.summary){let e=document.createElement("p");e.textContent=y.summary,e.className="btfw-movie-summary",R.appendChild(e)}if(l.ENABLE_RATING&&y.rating>0){let e=B(y.rating,y.voteCount);_.appendChild(e)}}function B(y,E){let _=document.createElement("div");_.className="btfw-movie-rating";let R=Math.round(y*10),K=$(R),e="http://www.w3.org/2000/svg",n=document.createElementNS(e,"svg");n.setAttribute("width","60"),n.setAttribute("height","60"),n.setAttribute("viewBox","0 0 60 60");let i=25,p=2*Math.PI*i,S=p-y/10*p,r=document.createElementNS(e,"circle");r.setAttribute("cx","30"),r.setAttribute("cy","30"),r.setAttribute("r",i.toString()),r.setAttribute("stroke","#2a2a2a"),r.setAttribute("stroke-width","4"),r.setAttribute("fill","#1a1a1a"),n.appendChild(r);let a=document.createElementNS(e,"circle");a.setAttribute("cx","30"),a.setAttribute("cy","30"),a.setAttribute("r",i.toString()),a.setAttribute("stroke",K),a.setAttribute("stroke-width","3"),a.setAttribute("fill","none"),a.setAttribute("stroke-dasharray",p.toString()),a.setAttribute("stroke-dashoffset",S.toString()),a.setAttribute("transform","rotate(-90 30 30)"),a.setAttribute("stroke-linecap","round"),n.appendChild(a);let c=document.createElementNS(e,"text");if(c.setAttribute("x","50%"),c.setAttribute("y","50%"),c.setAttribute("text-anchor","middle"),c.setAttribute("dominant-baseline","central"),c.setAttribute("fill","#fff"),c.setAttribute("font-size","10"),c.setAttribute("font-weight","bold"),c.textContent=`${R}%`,n.appendChild(c),_.appendChild(n),E>0){let g=document.createElement("div");g.className="btfw-movie-votes",g.textContent=`${E.toLocaleString()} votes`,_.appendChild(g)}return _}function $(y){let E=Math.max(0,Math.min(y,100));return E>=70?"#4caf50":E>=50?"#ff9800":"#f44336"}function V(y,E){let _=null;return function(...K){_&&clearTimeout(_),_=setTimeout(()=>{_=null,y(...K)},E)}}function te(){if(document.getElementById(u))return;let y=`
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
    `,E=document.createElement("style");E.id=u,E.textContent=y,document.head.appendChild(E)}function Z(){v(),x(),O()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z,{once:!0}):Z(),{name:"feature:movie-info",refresh:O,cleanup:P}});BTFW.define("feature:monkeyPaw",[],async()=>{let t="btfw-monkey-paw-styles",o="btfw-monkey-paw-overlay",f="/src/assets/monkey-paw/paw.svg",l={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},u={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},s={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},b=null,m=null,M=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function d(N){let q=String(N||"").trim();return/^<svg[\s>]/i.test(q)?!M.test(q):!1}function A(N){return new Promise(q=>setTimeout(q,N))}function P(){try{let N=typeof window!="undefined"?window.BTFW:null;return N&&(N.BASE||N.DEV_CDN)||""}catch(N){return""}}function k(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(N){return!1}}function h(){if(typeof document=="undefined"||document.getElementById(t))return;let N=document.createElement("style");N.id=t,N.textContent=`
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
    `,document.head.appendChild(N)}async function v(){if(b)return b;let q=`${P()}${f}`,U=await fetch(q,{credentials:"omit"});if(!U.ok)throw new Error(`Monkey paw SVG failed to load (${U.status})`);let H=await U.text();if(!d(H))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return b=H,b}function x(N){Object.entries(s).forEach(([q,U])=>{let H=N.querySelector(`#${q}`),F=N.querySelector(`#${q}-tip`);H&&(H.style.transform=U.root),F&&(F.style.transform=U.tip)})}function T(N){Object.entries(l).forEach(([q,U])=>{window.setTimeout(()=>{let H=N.querySelector(`#${q}`),F=N.querySelector(`#${q}-tip`);H&&(H.style.transform=U.root),F&&window.setTimeout(()=>{F.style.transform=U.tip},120)},u[q])})}function L(N){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${N}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function O(N={}){if(m)return m;if(typeof document!="undefined")return m=(async()=>{var J,z;if(h(),k()){await A((J=N.reducedMotionMs)!=null?J:450);return}let q=document.getElementById(o);q||(q=document.createElement("div"),q.id=o,document.body.appendChild(q));let U;try{U=await v()}catch(W){console.warn("[monkey-paw] SVG load failed:",W),await A(300);return}q.innerHTML=L(U),x(q);let H=q.querySelector("#paw"),F=q.querySelector("#btfw-monkey-paw-msg");q.classList.remove("is-cursed"),F==null||F.classList.remove("is-visible"),requestAnimationFrame(()=>q.classList.add("is-active")),T(q),await A(980),H==null||H.classList.add("btfw-monkey-paw-shaking"),await A(720),H==null||H.classList.remove("btfw-monkey-paw-shaking"),q.classList.add("is-cursed"),F==null||F.classList.add("is-visible"),await A((z=N.holdMs)!=null?z:1100),q.classList.remove("is-active"),await A(320),q.remove()})().finally(()=>{m=null}),m}return{name:"feature:monkeyPaw",play:O}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:t})=>{let o=await t("util:tmdb-proxy"),f=await t("feature:monkeyPaw"),l=(w,B=document)=>B.querySelector(w),u=(w,B=document)=>Array.from(B.querySelectorAll(w)),s=null,b=null,m=null,M=null,d={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},A=null,P=null,k="[movie-suggestion]";function h(...w){console.log(k,...w)}function v(...w){console.error(k,...w)}function x(w){var B;try{if((B=window.socket)!=null&&B.emit)return window.socket.emit("chatMsg",{msg:w}),!0}catch($){}return!1}async function T(w,B={}){return o.workerFetch(w,B)}function L(){if(document.getElementById("btfw-movie-suggest-styles"))return;let w=document.createElement("style");w.id="btfw-movie-suggest-styles",w.textContent=`
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
    `,document.head.appendChild(w)}let O=(CLIENT==null?void 0:CLIENT.rank)||0;function N(){let w=l("a[href*='donate'], #donate-btn, .donate-btn");if(w){let $=w.closest("ul");if($)return{ul:$,insertAfter:w.parentElement}}let B=l("#btfw-theme-btn-nav");if(B){let $=B.closest("ul");if($)return{ul:$,insertAfter:null}}return{ul:l(".navbar .nav.navbar-nav")||l(".navbar-nav")||l(".btfw-navbar ul")||l(".navbar ul"),insertAfter:null}}function q(){if(l("#btfw-movie-suggest-btn"))return!0;let w=N();if(!w.ul)return!1;let B=document.createElement("li"),$=document.createElement("a");return $.href="javascript:void(0)",$.className="btfw-nav-pill",$.id="btfw-movie-suggest-btn",$.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,B.appendChild($),w.insertAfter?w.insertAfter.after(B):w.ul.insertBefore(B,w.ul.firstChild),$.addEventListener("click",Q),!0}function U(){var V,te,Z,y,E,_;if(l("#btfw-movie-suggest-modal"))return;let w=document.createElement("div");w.id="btfw-movie-suggest-modal",w.className="modal",w.innerHTML=`
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
                     placeholder="${O===0?"Please register to search and suggest movies":"Search for a movie..."}"
                     ${O===0?"disabled":""}>
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
    `,document.body.appendChild(w);let B=l(".modal-background",w),$=l(".delete",w);if(B.addEventListener("click",ee),$.addEventListener("click",ee),(V=l("#btfw-movie-prev",w))==null||V.addEventListener("click",()=>{d.page>1&&(d.page-=1,G())}),(te=l("#btfw-movie-next",w))==null||te.addEventListener("click",()=>{d.page<d.totalPages&&(d.page+=1,G())}),O===0){let R=l("#btfw-movie-search",w);R.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),R.blur()})}else{let R,K=l("#btfw-movie-search",w);K.addEventListener("input",()=>{clearTimeout(R),d.query=K.value.trim(),d.page=1,R=setTimeout(()=>G(),400)}),(Z=l("#btfw-movie-sort",w))==null||Z.addEventListener("change",e=>{d.sortBy=e.target.value,d.page=1,G()}),(y=l("#btfw-movie-genre",w))==null||y.addEventListener("change",e=>{d.genreId=e.target.value,d.page=1,G()}),(E=l("#btfw-movie-year",w))==null||E.addEventListener("change",e=>{d.year=e.target.value.trim(),d.page=1,G()}),(_=l("#btfw-movie-rating",w))==null||_.addEventListener("change",e=>{d.minRating=e.target.value.trim(),d.page=1,G()})}}function H(){if(l("#btfw-movie-confirm-modal"))return;let w=document.createElement("div");w.id="btfw-movie-confirm-modal",w.className="modal",w.innerHTML=`
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
    `,document.body.appendChild(w);let B=l(".modal-background",w),$=l(".delete",w),V=l("#btfw-movie-cancel",w),te=l("#btfw-movie-confirm",w),Z=()=>Y();B.addEventListener("click",Z),$.addEventListener("click",Z),V.addEventListener("click",Z),te.addEventListener("click",ae)}async function F(){if(A&&P)return;let[w,B]=await Promise.all([T("/api/meta"),T("/api/genres")]);A=w,P=B;let $=l("#btfw-movie-suggest-modal");if(!$)return;let V=l("#btfw-movie-sort",$);if(V&&V.options.length===0){for(let Z of w.sortOptions||[]){let y=document.createElement("option");y.value=Z.value,y.textContent=Z.label,V.appendChild(y)}V.value=d.sortBy}let te=l("#btfw-movie-genre",$);if(te&&te.options.length<=1)for(let Z of B.genres||[]){let y=document.createElement("option");y.value=String(Z.id),y.textContent=Z.name,te.appendChild(y)}}function J(){let w={page:d.page,sort_by:d.sortBy};return d.query?(w.query=d.query,d.year&&(w.primary_release_year=d.year,w.year=d.year)):(d.genreId&&(w.with_genres=d.genreId),d.year&&(w.primary_release_year=d.year),d.minRating&&(w["vote_average.gte"]=d.minRating)),w}function z(w){return!w||w==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${w}`}function W(){let w=l("#btfw-movie-suggest-modal");if(!w)return;let B=l("#btfw-movie-prev",w),$=l("#btfw-movie-next",w),V=l("#btfw-movie-page-label",w);V&&(V.textContent=`Page ${d.page} of ${d.totalPages}`),B&&(B.disabled=d.page<=1||d.loading),$&&($.disabled=d.page>=d.totalPages||d.loading)}function I(w){let B=l("#btfw-movie-suggest-modal");if(!B)return;let $=l(".btfw-movie-results",B);if(!w.length){$.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}$.innerHTML=w.map(V=>`
      <div class="movie-result"
           data-id="${le(V.id)}"
           data-title="${le(V.title)}"
           data-poster="${le(V.posterPath||"")}"
           data-year="${le(V.releaseYear||"")}">
        <div class="movie-result__poster">
          <img src="${le(z(V.posterPath))}" alt="${le(V.title)}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${le(V.title)}</div>
          <small style="opacity:0.7;">${le(V.releaseYear||"N/A")}</small>
        </div>
      </div>
    `).join(""),u(".movie-result",$).forEach(V=>{V.addEventListener("click",()=>{s=V.dataset.id,b=V.dataset.title,m=V.dataset.poster,M=V.dataset.year||null;let te=l("#btfw-movie-confirm-modal");if(!te)return;let Z=M?` (${M})`:"";l("#btfw-confirm-movie-title",te).textContent=`${b}${Z}`,ne()})})}async function G(){let w=l("#btfw-movie-suggest-modal");if(!w||d.loading)return;d.loading=!0,W();let B=l(".btfw-movie-results",w);B.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await F();let $=await T("/api/search",{params:J()});d.totalPages=Math.max(1,$.totalPages||1),I($.results||[]),h("runSearch",{page:d.page,totalPages:d.totalPages,count:($.results||[]).length})}catch($){v("runSearch failed:",$),B.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{d.loading=!1,W()}}async function X(){let w=l("#btfw-movie-history");if(w){w.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let $=(await T("/api/history",{params:{page:1,limit:10}})).results||[];if(!$.length){w.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}w.innerHTML=$.map(V=>{let te=V.releaseYear?` (${le(V.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${le(z(V.posterPath).replace("w154","w92"))}" alt="${le(V.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${le(V.movieTitle)}${te}</div>
              <div class="history-item__meta">Requested by ${le(V.username)}</div>
            </div>
          </div>
        `}).join("")}catch(B){v("loadHistory failed:",B),w.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function ne(){let w=l("#btfw-movie-suggest-modal"),B=l("#btfw-movie-confirm-modal");B&&(w&&w.classList.add("btfw-movie-suggest-pending"),B.classList.add("is-active"))}function Y(){let w=l("#btfw-movie-suggest-modal"),B=l("#btfw-movie-confirm-modal");w&&w.classList.remove("btfw-movie-suggest-pending"),B&&B.classList.remove("is-active")}async function Q(){let w=l("#btfw-movie-suggest-modal");if(w){h("openModal",{userRank:O}),w.classList.remove("btfw-movie-suggest-pending"),w.classList.add("is-active");try{await F(),await Promise.all([G(),X()])}catch(B){v("openModal bootstrap failed:",B)}}}function ee(){let w=l("#btfw-movie-suggest-modal");w&&(Y(),h("closeModal"),w.classList.remove("is-active"),l("#btfw-movie-search",w).value="",l(".btfw-movie-results",w).innerHTML="",d.query="",d.page=1,d.totalPages=1,s=null,b=null,m=null,M=null)}function se(w,B,$){let V=$?` (${$})`:"";return`\u{1F3AC} Movie request: ${B}${V} \u2014 suggested by ${w}`}async function ae(){if(!s||!b)return;let w=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";h("confirmSuggestion",{movieId:s,movieTitle:b}),Y();try{await f.play(),await T("/api/suggestions",{method:"POST",body:{movieId:Number(s),movieTitle:b,username:w,posterPath:m||null,releaseYear:M||null}}),x(se(w,b,M)),await X(),ee()}catch(B){v("confirmSuggestion failed:",B),alert("Could not save your movie request. Please try again.")}}function ie(){h("boot: start",{workerBase:o.getWorkerBase()}),L(),U(),H();let w=0,B=50,$=()=>{if(q()){h("Button added successfully");return}w+=1,w<B?setTimeout($,100):console.warn(k,"Failed to add button after retries",{retryCount:w})};$()}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(ie,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(ie,200)}):setTimeout(ie,200),{name:"ext:movie-suggestion",open:Q,close:ee,getWorkerBase:o.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async t=>t.init("ext:movie-suggestion"));})();
