/*! Quiglytube player bundle */
var BTFW = globalThis.BTFW;
(()=>{var ot=Object.defineProperty;var it=(e,n)=>{for(var d in n)ot(e,d,{get:n[d],enumerable:!0})};BTFW.define("feature:player",[],async()=>{var T;let e=(u,x=document)=>x.querySelector(u),n=(u,x=document)=>Array.from(x.querySelectorAll(u)),d=((T=window.BTFW)==null?void 0:T.BASE)||"";function a(u){if(!u)return;let x=u.startsWith("http")?u:`${d}/${u.replace(/^\//,"")}`;if(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(y=>y.getAttribute("href")===x||y.getAttribute("href")===u))return;let S=document.createElement("link");S.rel="stylesheet",window.BTFW&&window.BTFW.SRI&&window.BTFW.SRI[u]&&(S.integrity=window.BTFW.SRI[u],S.crossOrigin="anonymous"),S.href=x,document.head.appendChild(S)}function p(){let u=e("#videowrap");if(!u)return;a("dist/css/player.css"),u.classList.add("btfw-player-wrap");let x=u.querySelector("#controlsrow, .player-controls");x&&x.classList.add("btfw-player-controls"),s()}function s(){if(window.videojs)try{let u=document.querySelector(".video-js");u&&!u.classList.contains("btfw-vjs-enhanced")&&u.classList.add("btfw-vjs-enhanced")}catch(u){}}function w(){let u=e("#videowrap");if(!u)return;new MutationObserver(()=>{s()}).observe(u,{childList:!0,subtree:!0})}function f(){p(),w();try{let u=window.socket;u&&typeof u.on=="function"&&u.on("changeMedia",()=>{setTimeout(p,100)})}catch(u){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",f):f(),{name:"feature:player",applyPlayerLayoutEnhancements:p}});var Ce={};it(Ce,{addMediaButtonHtml:()=>lt,addMediaPanelHtml:()=>st,panelUndockIconHtml:()=>Le,panelsMenuButtonHtml:()=>Te,playlistAddFormHtml:()=>Me,stackGroupHeaderHtml:()=>_e});function rt(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function at(e,...n){var a;let d="";for(let p=0;p<e.length;p+=1)d+=(a=e[p])!=null?a:"",p<n.length&&(d+=rt(n[p]));return d}function st(){return`
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
      `}function _e(e){return at`
      <span class="btfw-stack-item__title">${e}</span>
      <div class="btfw-stack-header-toolbar">
        <span class="btfw-stack-header-actions"></span>
        <span class="btfw-stack-arrows">
          <button type="button" class="btfw-arrow btfw-up" aria-label="Move panel up">↑</button>
          <button type="button" class="btfw-arrow btfw-down" aria-label="Move panel down">↓</button>
        </span>
      </div>
    `}function Te(){return'<span class="btfw-panels-menu-btn__label">Panels</span>'}function Le(){return'<i class="fa fa-thumb-tack" aria-hidden="true"></i>'}function Me(){return`
      <label class="btfw-panel-playlist__link-label">
        <span class="btfw-panel-playlist__link-caption">Link</span>
        <input type="url" class="btfw-panel-playlist__link-input input is-small" placeholder="https://..." autocomplete="off" required>
      </label>
      <div class="btfw-panel-playlist__add-actions">
        <button type="submit" class="button is-small is-primary btfw-panel-playlist__submit">Add to queue</button>
      </div>
    `}function lt(){return'<span data-btfw-icon-slot="stack-add-media" aria-hidden="true"><i class="fa fa-plus"></i></span><span>Add media</span>'}function fe(e=document){return!e||typeof e.querySelector!="function"?!1:!!(e.querySelector("#pollwrap .well.active")||e.querySelector("#pollwrap .well.muted")||e.querySelector("#pollwrap .poll-menu"))}function le(e,n){return e!=null?!!e:!!n}var ve=class extends Error{constructor(n){super(n),this.name="TimeoutError"}};function ze(){let e=globalThis.MutationObserver;return typeof e=="function"?e:null}function Ue(){var n,d;let e=globalThis;return{setTimeoutFn:(n=e.setTimeout)!=null?n:null,clearTimeoutFn:(d=e.clearTimeout)!=null?d:null}}function ct(e,n){if(n)return n;let d=e!=null?e:globalThis.document;return d&&typeof d.querySelector=="function"?a=>d.querySelector(a):()=>null}function Ge(e){if(e)try{e.disconnect()}catch(n){}}function me(e,n={}){let{root:d=null,timeoutMs:a,includeExisting:p=!0,observerClass:s}=n;return new Promise((w,f)=>{var $,F;let T=s!==void 0?s:ze(),u=ct(d,n.querySelector),x=Ue(),O=($=n.setTimeoutFn)!=null?$:x.setTimeoutFn,S=(F=n.clearTimeoutFn)!=null?F:x.clearTimeoutFn,y=null,v=null,L=!1,_=N=>{L||(L=!0,Ge(y),y=null,v!==null&&S&&(S(v),v=null),N())},A=N=>{_(()=>w(N))},I=N=>{_(()=>f(N))},R=()=>{typeof a!="number"||!O||!S||(v=O(()=>{I(new ve(`waitForElement: "${e}" not found within ${a}ms`))},a))};if(p){let N=u(e);if(N){A(N);return}}if(!T){I(new Error("waitForElement: no MutationObserver implementation available"));return}y=new T(()=>{let N=u(e);N&&A(N)});let B=d!=null?d:globalThis.document;if(!B){I(new Error("waitForElement: no root available to observe"));return}y.observe(B,{childList:!0,subtree:!0}),R()})}function he(e,n={}){let{root:d=null,timeoutMs:a,observerClass:p}=n;return new Promise((s,w)=>{var I,R;let f=p!==void 0?p:ze(),T=Ue(),u=(I=n.setTimeoutFn)!=null?I:T.setTimeoutFn,x=(R=n.clearTimeoutFn)!=null?R:T.clearTimeoutFn,O=null,S=null,y=!1,v=B=>{y||(y=!0,Ge(O),O=null,S!==null&&x&&(x(S),S=null),B())},L=()=>{typeof a!="number"||!u||!x||(S=u(()=>{v(()=>w(new ve("waitForCondition: condition not met within timeout")))},a))},_=e();if(_){v(()=>s(_));return}if(!f){v(()=>w(new Error("waitForCondition: no MutationObserver implementation available")));return}let A=d!=null?d:globalThis.document;if(!A){v(()=>w(new Error("waitForCondition: no root available to observe")));return}O=new f(()=>{let B=e();B&&v(()=>s(B))}),O.observe(A,{childList:!0,subtree:!0,attributes:!0}),L()})}var dt=/[&<>"']/g,ut={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function se(e){return e==null?"":String(e).replace(dt,n=>{var d;return(d=ut[n])!=null?d:n})}function ft(e){return e.replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ve(e){return e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}var mt=["a","b","strong","i","em","u","s","strike","small","p","br","hr","div","span","ul","ol","li","blockquote","code","pre","h1","h2","h3","h4","h5","h6","sub","sup","img","table","thead","tbody","tr","td","th","font"],pt={"*":["class","title"],a:["href","target","rel"],img:["src","alt","width","height"],font:["color","size"],td:["colspan","rowspan","align"],th:["colspan","rowspan","align"]},bt=["http","https","mailto"],ht="<(/)?([a-zA-Z][a-zA-Z0-9]*)((?:\\s+[^<>]*?)?)\\s*(/)?>",yt=/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g,gt=/^\s*([a-zA-Z][a-zA-Z0-9+.-]*):/,wt={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",colon:":",nbsp:" "};function vt(e){let n=e;for(let a=0;a<3;a+=1){let p=n.replace(/&#x([0-9a-fA-F]+);?/g,(s,w)=>{let f=Number.parseInt(w,16);if(!Number.isFinite(f)||f<0||f>1114111)return"";try{return String.fromCodePoint(f)}catch(T){return""}}).replace(/&#(\d+);?/g,(s,w)=>{let f=Number(w);if(!Number.isFinite(f)||f<0||f>1114111)return"";try{return String.fromCodePoint(f)}catch(T){return""}}).replace(/&([a-zA-Z]+);?/g,(s,w)=>{let f=wt[w.toLowerCase()];return f!==void 0?f:s});if(p===n)break;n=p}let d="";for(let a=0;a<n.length;a+=1){let p=n.charCodeAt(a);p<=31||p===127||(d+=n[a])}return d.replace(/[\s\u00a0]+/g,"")}function Et(e){var p,s;let n=new Map,d=new RegExp(yt.source,"g"),a;for(;(a=d.exec(e))!==null;){let w=((p=a[1])!=null?p:"").toLowerCase(),f=(s=a[2])!=null?s:"";(f.startsWith('"')&&f.endsWith('"')||f.startsWith("'")&&f.endsWith("'"))&&(f=f.slice(1,-1)),n.set(w,f),a[0].length===0&&(d.lastIndex+=1)}return n}function St(e,n){var s;let d=vt(e);if(d.length===0)return!0;let a=gt.exec(d);if(!a)return!0;let p=((s=a[1])!=null?s:"").toLowerCase();return n.includes(p)?p==="data"?/^data:image\//i.test(d):!0:!1}function xt(e,n,d,a,p,s,w){var v,L;let f=n.toLowerCase();if(!p.has(f))return"";if(e)return`</${f}>`;let T=Et(d||""),u=(v=s["*"])!=null?v:[],x=(L=s[f])!=null?L:[],O=[];for(let[_,A]of T)_.startsWith("on")||!(u.includes(_)||x.includes(_))||(_==="href"||_==="src")&&!St(A,w)||O.push(`${_}="${ft(A)}"`);f==="a"&&T.get("target")==="_blank"&&x.includes("rel")&&(O.some(_=>_.startsWith("rel="))||O.push('rel="noopener noreferrer"'));let S=O.length>0?` ${O.join(" ")}`:"";return`<${f}${S}${a?" /":""}>`}function ye(e,n={}){var x,O,S;if(e==null)return"";let d=String(e).replace(/<!--[\s\S]*?-->/g,""),a=new Set(((x=n.allowedTags)!=null?x:mt).map(y=>y.toLowerCase())),p=(O=n.allowedAttributes)!=null?O:pt,s=(S=n.allowedSchemes)!=null?S:bt,w=new RegExp(ht,"g"),f="",T=0,u;for(;(u=w.exec(d))!==null;){let[y,v,L="",_="",A]=u;f+=Ve(d.slice(T,u.index)),f+=xt(v,L,_,A,a,p,s),T=u.index+y.length}return f+=Ve(d.slice(T)),f}var Ye="btfw-stack-order",ge="btfw-stack-motd-open",Ae="btfw-stack-playlist-open",Pe="btfw-stack-poll-open",Ee={"motd-group":"btfw-stack-motd-docked","playlist-group":"btfw-stack-playlist-docked","poll-group":"btfw-stack-poll-docked"},Oe={"motd-group":{short:"MOTD",title:"Message of the Day"},"playlist-group":{short:"PL",title:"Playlist"},"poll-group":{short:"Poll",title:"Polls & Voting"}},je={"motd-group":"MD","playlist-group":"PL","poll-group":"PV"},Ie={"motd-group":1,"poll-group":2,"playlist-group":3},de=[{id:"motd-group",title:"Message of the Day",selectors:["#motdwrap","#motdrow","#motd","#announcements"],priority:1},{id:"playlist-group",title:"Playlist",selectors:["#playlistrow","#playlistwrap","#queuecontainer","#queue"],priority:2},{id:"poll-group",title:"Polls & Voting",selectors:["#pollwrap","#btfw-poll-parking","#btfw-poll-history"],priority:3}],Ne=["#main","#mainpage","#mainpane"];function ce(e){try{let n=Array.from(e.children).map(d=>({id:d.dataset.bind,isGroup:d.dataset.group==="true"}));localStorage.setItem(Ye,JSON.stringify(n))}catch(n){}}function Ke(){try{return JSON.parse(localStorage.getItem(Ye)||"[]")}catch(e){return[]}}function we(e){try{let n=localStorage.getItem(e);return n===null?null:n==="true"}catch(n){return null}}function Be(e,n){try{localStorage.setItem(e,n?"true":"false")}catch(d){}}function Re(e){try{let n=localStorage.getItem(e);if(n!==null)return n==="true";let d=e.replace("-docked","-hidden"),a=localStorage.getItem(d);return a!==null?a==="true":!1}catch(n){return!1}}function Qe(e,n){try{localStorage.setItem(e,n?"true":"false")}catch(d){}}function qe(e){return!!(e!=null&&e.closest(".btfw-panel-container__host"))}function Se(e,n,d){if(!e||qe(e))return;let a=we(n!=null?n:""),p=typeof d=="function"?d(a):a!==null?!!a:!0;e._btfwSetOpenState?e._btfwSetOpenState(p,{persist:!1}):(e.dataset.open=p?"true":"false",e.classList.toggle("is-open",p))}function Fe(){let e=Array.from(document.querySelectorAll("#btfw-stack .btfw-stack-item[data-group='true']")),n=e.filter(w=>w.dataset.docked!=="true"),d=e.length>0&&n.length===0,a=document.getElementById("btfw-stack"),p=document.getElementById("btfw-leftpad"),s=document.getElementById("btfw-grid");a&&(a.classList.toggle("btfw-stack--all-hidden",d),a.classList.toggle("btfw-stack--all-docked",d)),p&&p.classList.toggle("btfw-leftpad--stack-hidden",d),s&&s.classList.toggle("btfw-grid--stack-hidden",d),document.dispatchEvent(new CustomEvent("btfw:layout:stackVisibility",{detail:{allHidden:d,allDocked:d,visibleCount:n.length,totalCount:e.length}}))}function De(e=""){let n=String(e||"").trim();return n?!n.replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/\u00a0/g," ").replace(/\s+/g," ").trim():!0}function Xe(e=document){if(!e||typeof e.querySelector!="function")return!1;let n=pe(e);return n?!De(n.innerHTML||""):!1}function pe(e=document){if(!e||typeof e.getElementById!="function")return null;let n=e.getElementById("motdwrap");if(!n)return e.getElementById("motd");let d=n.querySelector(":scope > #motd");return d||n.querySelector("#motd")||e.getElementById("motd")}function He(e=!1){let n=document.getElementById("motdwrap");if(!n)return null;if(!e&&n.dataset.btfwMotdNormalized==="1"){let s=n.querySelector(":scope > #motd");return s?{motdwrap:n,motd:s}:null}let d=document.getElementById("togglemotd");d&&d.closest("#motd")&&n.insertBefore(d,n.firstChild);let a=[];n.querySelectorAll(".btfw-motd-editrow").forEach(s=>{let w=(s.textContent||"").trim();w&&a.push(`<p>${w}</p>`),s.remove()}),n.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach(s=>{s.contains(n)||s===n||((s.querySelector("#motd")||s.classList.contains("btfw-motd-editrow"))&&s.querySelectorAll("#motd").forEach(w=>{(w.innerHTML||"").trim()&&a.push(w.innerHTML)}),s.remove())});let p=n.querySelector(":scope > #motd");if(p||(p=document.createElement("div"),p.id="motd",n.appendChild(p)),n.querySelectorAll("#motd").forEach(s=>{s!==p&&((s.innerHTML||"").trim()&&a.push(s.innerHTML),s.remove())}),p.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach(s=>{s.remove()}),p.querySelectorAll("#motd").forEach(s=>{(s.innerHTML||"").trim()&&a.push(s.innerHTML),s.remove()}),document.querySelectorAll("#togglemotd").forEach((s,w)=>{w!==0&&s.remove()}),a.length){let s=a.join("").trim();s&&De(p.innerHTML)?p.innerHTML=ye(s):s&&(p.innerHTML+=ye(s))}return n.dataset.btfwMotdNormalized="1",{motdwrap:n,motd:p}}function Ze(e){let n=null,d=!1,a=!1;function p(x){He();let O=document.getElementById("motdwrap");if(!O)return;let S=x&&x.list;if(!S)return;let y=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');if(y){let v=y.querySelector(".btfw-group-body");v&&!v.contains(O)&&v.appendChild(O)}else{let v=de.find(L=>L.id==="motd-group");if(!v)return;y=e.createGroupItem(v,[O]),y&&(S.appendChild(y),ce(S))}s(y)}function s(x){let O=document.getElementById("motdwrap");if(!O)return;let S=Xe();if(O.classList.toggle("btfw-motd-empty",!S),O.toggleAttribute("hidden",!S),O.setAttribute("aria-hidden",S?"false":"true"),S){O.style.removeProperty("display");let y=pe();y&&y.style.removeProperty("display")}if(x||(x=document.querySelector('.btfw-stack-item[data-bind="motd-group"]')),x&&S){let y=we(ge),v=le(y,!0),L=x;L._btfwSetOpenState?L._btfwSetOpenState(v,{persist:!1}):(L.dataset.open=v?"true":"false",L.classList.toggle("is-open",v))}}function w(x){n&&clearTimeout(n),n=setTimeout(()=>{n=null,p(x)},50)}function f(x){let O=pe();O&&(d||(d=!0,new MutationObserver(()=>{w(x)}).observe(O,{childList:!0,subtree:!0,characterData:!0})))}function T(x){a||!window.socket||!window.socket.on||(a=!0,window.socket.on("setMotd",O=>{let S=typeof O=="string"?O:O&&typeof O=="object"&&typeof O.motd=="string"?O.motd:null,y=pe();if(y){let v=S!==null?S:y.innerHTML,L=ye(v);y.innerHTML!==L&&(y.innerHTML=L)}w(x)}))}function u(x){let O=e.ensureStackRefs(),S=document.getElementById("motdwrap");S&&delete S.dataset.btfwMotdNormalized;let y=He(!0),v=(y==null?void 0:y.motd)||pe();v&&typeof x=="string"&&(v.innerHTML=ye(x));let L=document.getElementById("cs-motdtext");L&&typeof x=="string"&&(L.value=x),O&&w(O)}return{isMotdHtmlEmpty:De,hasMotdContent:Xe,resolveMotdHost:pe,normalizeMotdStructure:He,ensureMotdStackPanel:p,syncMotdWrapVisibility:s,scheduleMotdSync:w,wireMotdObservers:f,wireMotdSocket:T,applyMotdUpdate:u}}var kt=[{id:"addfromurl",title:"From URL",default:!0},{id:"searchcontrol",title:"Library & YouTube"}];function Je(e){let{tpl:n}=e;function d(y,v,L){if(!y||!v||!L)return null;let _=kt.map(D=>{let U=document.getElementById(D.id);return U?{...D,el:U}:null}).filter(Boolean);if(!_.length){let D=document.getElementById("btfw-addmedia-panel");return D&&D.remove(),null}let A=document.getElementById("btfw-addmedia-panel");if(A||(A=document.createElement("section"),A.id="btfw-addmedia-panel",A.className="btfw-addmedia-panel",A.dataset.open="false",A.setAttribute("role","region"),A.setAttribute("aria-label","Add media controls"),A.setAttribute("aria-hidden","true"),A.setAttribute("hidden","hidden"),A.innerHTML=n.addMediaPanelHtml()),A.parentElement!==y){let D=v.parentElement===y?v.nextSibling:null;y.insertBefore(A,D)}let I=A.querySelector(".btfw-addmedia-tabs"),R=A.querySelector(".btfw-addmedia-views"),B=A.querySelector(".btfw-addmedia-close");if(!I||!R)return null;for(;I.firstChild;)I.removeChild(I.firstChild);for(;R.firstChild;)R.removeChild(R.firstChild);_.forEach(({id:D,title:U,el:q})=>{q.classList.remove("collapse","in","plcontrol-collapse"),q.style.removeProperty("display"),q.style.removeProperty("height"),q.removeAttribute("aria-expanded"),q.setAttribute("role","tabpanel"),q.setAttribute("data-btfw-addmedia","panel");let V=document.createElement("button");V.type="button",V.className="btfw-addmedia-tab",V.dataset.target=D,V.textContent=U,V.setAttribute("role","tab"),I.appendChild(V);let K=document.createElement("div");K.className="btfw-addmedia-view",K.dataset.target=D,K.setAttribute("role","tabpanel"),K.setAttribute("aria-hidden","true"),K.appendChild(q),R.appendChild(K)});let $=_.find(D=>D.default)||_[0],F=D=>{let U=D||A.dataset.active||$.id;A.dataset.active=U,I.querySelectorAll(".btfw-addmedia-tab").forEach(q=>{let V=q.dataset.target===U;q.classList.toggle("is-active",V),q.setAttribute("aria-selected",V?"true":"false"),q.setAttribute("tabindex",V?"0":"-1")}),R.querySelectorAll(".btfw-addmedia-view").forEach(q=>{let V=q.dataset.target===U;q.classList.toggle("is-active",V),q.setAttribute("aria-hidden",V?"false":"true")})},N=D=>{let U=D!=null?!!D:A.dataset.open!=="true";return A.dataset.open=U?"true":"false",A.classList.toggle("is-open",U),A.setAttribute("aria-hidden",U?"false":"true"),U?(A.removeAttribute("hidden"),F(A.dataset.active||$.id)):A.setAttribute("hidden","hidden"),A.dispatchEvent(new CustomEvent("btfw:addmedia:state",{detail:{open:U}})),U};return A._btfwWired||(I.addEventListener("click",D=>{let U=D.target.closest(".btfw-addmedia-tab");U&&(D.preventDefault(),F(U.dataset.target))}),B&&B.addEventListener("click",()=>N(!1)),A._btfwWired=!0),F(A.dataset.active||$.id),A._btfwToggle=N,A._btfwSetActive=F,(()=>{[{id:"showsearch",target:"searchcontrol"}].forEach(({id:U,target:q})=>{let V=document.getElementById(U);V&&V.dataset.btfwAddmedia!==q&&(V.dataset.btfwAddmedia=q,V.setAttribute("aria-controls","btfw-addmedia-panel"),V.addEventListener("click",K=>{K.preventDefault(),K.stopPropagation(),F(q),N(!0),V.blur()}))})})(),{panel:A,toggle:N,setActive:F}}function a(){let y=document.getElementById("btfw-plbar");if((y==null?void 0:y.dataset.btfwMerged)==="1")return;let v=document.getElementById("controlsrow"),L=document.getElementById("rightcontrols"),_=document.getElementById("playlistwrap"),A=document.getElementById("queuecontainer"),I=document.getElementById("playlistrow"),R=document.querySelector('#btfw-stack .btfw-stack-item[data-bind="playlist-group"] .btfw-stack-item__body'),B=document.querySelectorAll(".btfw-controls-row"),$=I||_||A||R;if(!$)return;let F=y;F?F.classList.add("btfw-plbar"):(F=document.createElement("div"),F.id="btfw-plbar",F.className="btfw-plbar");let N=F.querySelector(".btfw-plbar__layout"),Q,D;if(N)Q=N.querySelector(".btfw-plbar__primary")||N,D=N.querySelector(".btfw-plbar__aside")||N;else{for(N=document.createElement("div"),N.className="btfw-plbar__layout",Q=document.createElement("div"),Q.className="btfw-plbar__primary",D=document.createElement("div"),D.className="btfw-plbar__aside",N.append(Q,D);F.firstChild;)Q.appendChild(F.firstChild);F.appendChild(N);let Y=Q.querySelector(".field.has-addons");Y&&Y.classList.add("btfw-plbar__search");let X=Q.querySelector("#btfw-pl-count");X&&(X.classList.add("btfw-plbar__count"),D.appendChild(X))}F.querySelectorAll("#showmediaurl, #btfw-pl-poll").forEach(Y=>Y.remove());let U=F.querySelector(".btfw-plbar__actions");U||(U=document.createElement("div"),U.className="btfw-plbar__actions",(D||F).appendChild(U));let q=document.getElementById("btfw-addmedia-btn"),V=Y=>{if(Y){if(Y.classList.add("btfw-plbar__action-btn"),Y.tagName==="BUTTON"||Y.tagName==="A")Y.classList.add("button","is-dark","is-small");else if(Y.tagName==="INPUT"){let X=(Y.type||"").toLowerCase();X==="button"||X==="submit"||X==="reset"?Y.classList.add("button","is-dark","is-small"):Y.classList.remove("button","is-dark","is-small")}}};F.parentElement!==$&&$.insertBefore(F,$.firstChild);let K=d($,F,U);K?!q||!document.body.contains(q)?(q=document.createElement("button"),q.id="btfw-addmedia-btn",q.setAttribute("type","button"),q.className="button is-small",q.innerHTML=n.addMediaButtonHtml(),U.prepend(q)):U.contains(q)||U.prepend(q):q&&(q.parentElement&&q.parentElement.removeChild(q),q=null);let oe=Y=>{if(!Y)return;Array.from(Y.children||[]).forEach(Z=>{Z&&(Z.classList.add("btfw-plbar__control"),U.appendChild(Z))})};if(L&&(oe(L),L.remove()),v&&(oe(v),v.remove()),U.querySelectorAll("button, a.btn, input[type=button], input[type=submit], input[type=reset], select").forEach(V),K&&q){q.classList.remove("is-dark"),q.classList.add("is-primary"),q.dataset.iconified||(q.innerHTML=n.addMediaButtonHtml(),q.dataset.iconified="1"),q.setAttribute("aria-controls","btfw-addmedia-panel");let Y=Z=>{q.setAttribute("aria-expanded",Z?"true":"false")};q.dataset.btfwBound||(q.dataset.btfwBound="1",q.addEventListener("click",Z=>{Z.preventDefault();let ae=document.getElementById("btfw-addmedia-panel"),ie=ae&&ae._btfwToggle,re=typeof ie=="function"?ie():!1;Y(re)}));let X=K.panel||document.getElementById("btfw-addmedia-panel");X&&(Y(X.dataset.open==="true"),X._btfwButtonSync||(X.addEventListener("btfw:addmedia:state",Z=>{Y(!!Z.detail&&!!Z.detail.open)}),X._btfwButtonSync=!0))}B.forEach(Y=>{Y&&!$.contains(Y)&&(Y.style.cssText+=`
          margin-top: 8px;
          position: relative !important;
          bottom: auto !important;
          left: auto !important;
          right: auto !important;
          width: auto !important;
        `,Y.remove(),$.appendChild(Y),console.log("[stack] Moved floating controls row into playlist container"))}),$.contains(F)||$.insertBefore(F,$.firstChild),F.dataset.btfwMerged="1"}function p(y){if(!y)return null;let v=Array.from(y.classList).find(_=>_.startsWith("pluid-"));if(v)return v.slice(6);let L=window.jQuery||window.$;if(L){let _=L(y).data("uid");if(_!=null&&_!=="")return _}return y.dataset.uid||null}function s(y){if(y==null||y==="")return!1;let v=window.socket;if(v&&typeof v.emit=="function")return v.emit("jumpTo",y),!0;let L=document.querySelector(`#queue > .queue_entry.pluid-${y}`),_=L==null?void 0:L.querySelector(".qbtn-play");return _?(_.click(),!0):!1}function w(y){let v=(y||"").trim();if(!v)return!1;let L=document.getElementById("mediaurl"),_=document.getElementById("queue_next");if(L&&_&&(L.value=v,!_.disabled))return _.click(),!0;if(typeof window.queue=="function"&&L)return L.value=v,window.queue("next","url"),!0;let A=window.socket;if(A&&typeof parseMediaLink=="function")try{let I=parseMediaLink(v);if((I==null?void 0:I.id)!=null&&(I!=null&&I.type))return A.emit("queue",{id:I.id,type:I.type,pos:"next",temp:!1}),!0}catch(I){}return!1}let f=null,T=null;function u(){if(f){try{f.disconnect()}catch(y){}f=null}T=null}function x(y){if(!y||T===y)return;u();let v=document.getElementById("queue");v&&(T=y,f=new MutationObserver(()=>{y.isConnected&&e.getActiveFlyoutGroup()==="playlist-group"&&S(y)}),f.observe(v,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]}))}function O(y=5){let v=document.getElementById("queue");if(!v)return[];let L=Array.from(v.querySelectorAll(":scope > .queue_entry")),_=L.findIndex(I=>I.classList.contains("queue_active")||I.classList.contains("playing")),A=_>=0?_+1:0;return L.slice(A,A+y)}function S(y){if(!y)return;let v=O(5);if(y.replaceChildren(),!v.length){let L=document.createElement("p");L.className="btfw-panel-playlist__empty",L.textContent="No upcoming videos",y.appendChild(L);return}v.forEach(L=>{var $,F;let _=document.createElement("div");_.className="btfw-panel-playlist__item";let A=document.createElement("span");A.className="btfw-panel-playlist__title",A.textContent=((($=L.querySelector(".qe_title"))==null?void 0:$.textContent)||"Untitled").trim();let I=document.createElement("span");I.className="btfw-panel-playlist__meta",I.textContent=(((F=L.querySelector(".qe_time"))==null?void 0:F.textContent)||"").trim();let R=document.createElement("div");R.className="btfw-panel-playlist__actions";let B=p(L);if(B!=null&&B!==""){let N=document.createElement("button");N.type="button",N.className="btfw-panel-playlist__play",N.textContent="Play",N.dataset.queueUid=String(B),!(L==null?void 0:L.querySelector(".qbtn-play"))&&!(window.socket&&typeof window.socket.emit=="function")&&(N.disabled=!0),R.appendChild(N)}_.append(A,I,R),y.appendChild(_)})}return{ensureAddMediaUI:d,mergePlaylistControls:a,getQueueEntryUid:p,playQueueEntry:s,queueMediaLink:w,disconnectQueuePreviewObserver:u,ensureQueuePreviewObserver:x,getUpcomingQueueEntries:O,renderPlaylistQueuePreview:S}}function et(e){let n=null,d=!1,a=!1;function p(){let S=document.getElementById("pollwrap");if(!S)return null;if(!S.closest('#playlistrow, #playlistwrap, #queuecontainer, [data-bind="playlist-group"]'))return S;let v=document.getElementById("btfw-poll-parking");return v||(v=document.createElement("div"),v.id="btfw-poll-parking",v.hidden=!0,v.setAttribute("aria-hidden","true"),document.body.appendChild(v)),v.appendChild(S),S}function s(S){let y=document.getElementById("pollwrap");if(!y)return;let v=y.dataset&&y.dataset.btfwPollOverlay,L=y.getAttribute&&y.getAttribute("data-btfw-poll-overlay");if(v==="video"||L==="video")return;p(),O();let _=S&&S.list;if(!_)return;let A=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');if(!A){let B=de.find($=>$.id==="poll-group");if(!B)return;A=e.createGroupItem(B,[y]),A&&(_.appendChild(A),ce(_));return}let I=A.querySelector(".btfw-group-body");I&&!I.contains(y)&&I.appendChild(y);let R=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');R&&R.contains(y)&&I&&I.appendChild(y)}function w(S,y={}){s(S),x();let v=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');v&&(v.hidden=!1,v.removeAttribute("hidden"),y.forceOpen&&v._btfwSetOpenState?v._btfwSetOpenState(!0,{persist:!1}):y.forceOpen&&(v.dataset.open="true",v.classList.add("is-open")))}function f(S,y={}){n&&clearTimeout(n),n=setTimeout(()=>{n=null,w(S,y)},50)}function T(S){if(d)return;let y=document.getElementById("pollwrap");if(!y)return;d=!0,new MutationObserver(()=>{f(S,{forceOpen:fe()})}).observe(y,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class"]});let L=document.getElementById("newpollbtn");L&&!L.dataset.btfwPollSync&&(L.dataset.btfwPollSync="1",L.addEventListener("click",()=>{f(S,{forceOpen:!0})}))}function u(S){a||!window.socket||!window.socket.on||(a=!0,window.socket.on("newPoll",()=>f(S,{forceOpen:!0})),window.socket.on("closePoll",()=>f(S)))}function x(){let S=document.getElementById("pollwrap");if(!S)return;let y=!!S.closest(".btfw-panel-container__host"),v=!fe();if(y&&!v){S.classList.remove("btfw-poll-idle"),S.removeAttribute("hidden"),S.setAttribute("aria-hidden","false");return}S.classList.toggle("btfw-poll-idle",v),S.toggleAttribute("hidden",v),S.setAttribute("aria-hidden",v?"true":"false")}function O(){let S=document.getElementById("leftcontrols"),y=document.getElementById("pollwrap");S&&y&&(S.querySelectorAll('button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn').forEach(L=>{let _=y.querySelector(".poll-controls");_||(_=document.createElement("div"),_.className="poll-controls",y.insertBefore(_,y.firstChild)),L.parentElement!==_&&_.appendChild(L)}),S.children.length===0&&S.remove())}return{detachPollWrapFromPlaylist:p,movePollButton:O,ensurePollStackPanel:s,syncPollPanelVisibility:w,schedulePollSync:f,wirePollObservers:T,wirePollSocket:u,syncPollWrapVisibility:x}}BTFW.define("feature:stack",["feature:layout"],async()=>{let e=!1,n=null,d="",a=null,p={"motd-group":{storageKey:ge,getDefaultOpen:t=>le(t,u()),toggleClass:"btfw-motd-toggle",ariaLabel:"Toggle message of the day visibility",openTitle:"Hide message of the day",closeTitle:"Show message of the day"},"playlist-group":{storageKey:Ae,getDefaultOpen:t=>le(t,!0),toggleClass:"btfw-playlist-toggle",ariaLabel:"Toggle playlist visibility",openTitle:"Hide playlist (improves performance)",closeTitle:"Show playlist"},"poll-group":{storageKey:Pe,getDefaultOpen:t=>le(t,fe()),toggleClass:"btfw-poll-toggle",ariaLabel:"Toggle poll panel visibility",openTitle:"Hide poll panel",closeTitle:"Show poll panel"}},s=!1,w=null,f=!1,T=Ze({createGroupItem:y,ensureStackRefs:()=>S()}),u=T.hasMotdContent,x=Je({tpl:Ce,getActiveFlyoutGroup:()=>n}),O=et({createGroupItem:y});function S(){let t=document.getElementById("btfw-leftpad");if(!t)return null;let i=document.getElementById("btfw-stack");if(!i){i=document.createElement("div"),i.id="btfw-stack",i.className="btfw-stack";let m=document.getElementById("videowrap"),o=document.getElementById("btfw-video-overlay"),c=o&&m&&o.parentElement===m.parentElement?o:m;c&&c.parentElement?c.nextSibling?c.parentNode.insertBefore(i,c.nextSibling):c.parentNode.appendChild(i):t.appendChild(i);let b=document.createElement("div");b.className="btfw-stack-list",i.appendChild(b);let M=document.createElement("div");M.id="btfw-stack-footer",M.className="btfw-stack-footer",i.appendChild(M)}return{list:i.querySelector(".btfw-stack-list"),footer:i.querySelector("#btfw-stack-footer")}}function y(t,i){if(t.id==="motd-group"&&(T.normalizeMotdStructure(),i=[document.getElementById("motdwrap")].filter(Boolean)),t.id==="playlist-group"&&(O.detachPollWrapFromPlaylist(),x.mergePlaylistControls(),i=i.filter(C=>C&&C.id!=="rightcontrols"&&C.id!=="pollwrap").filter(C=>!C.querySelector||!C.querySelector("#pollwrap"))),t.id==="poll-group"&&(O.detachPollWrapFromPlaylist(),O.movePollButton(),i=[document.getElementById("pollwrap"),document.getElementById("btfw-poll-history")].filter(Boolean)),i.length===0)return null;let m=document.querySelector("#btfw-stack .btfw-stack-list");m&&(i=i.filter(C=>C&&!m.contains(C)&&!C.contains(m)));let o=document.createElement("section");o.className="btfw-stack-item btfw-group-item",o.dataset.bind=t.id,o.dataset.group="true";let c=document.createElement("header");c.className="btfw-stack-item__header",c.innerHTML=_e(t.title);let b=document.createElement("div");b.className="btfw-stack-item__body btfw-group-body",i.forEach(C=>{if(C&&C.parentElement!==b&&!b.contains(C)&&!C.contains(b))try{b.appendChild(C)}catch(r){console.warn("[stack] Failed to move element:",C.id||C.className,r)}}),o.appendChild(c),o.appendChild(b);let M=p[t.id];return M&&re(o,M),ie(o,t.id),o.querySelector(".btfw-up").onclick=function(){let C=o.parentElement,r=o.previousElementSibling;r&&C.insertBefore(o,r),ce(C)},o.querySelector(".btfw-down").onclick=function(){let C=o.parentElement,r=o.nextElementSibling;r?C.insertBefore(r,o):C.appendChild(o),ce(C)},o}function v(t){t&&(t.classList.remove("btfw-stack-item--in-drawer"),delete t.dataset.btfwInDrawer,t.classList.toggle("is-open",t.dataset.open!=="false"),O.syncPollWrapVisibility())}function L(t){v(t);let i=document.querySelector("#btfw-stack .btfw-stack-list");!i||!t||t.parentElement!==i&&i.appendChild(t)}function _(){var o;let t=document.getElementById("btfw-chat-actions");if(!t)return null;let i=document.getElementById("btfw-panels-menu-shell");if(!i){i=document.createElement("div"),i.id="btfw-panels-menu-shell",i.className="btfw-panels-menu-shell",i.setAttribute("aria-label","Docked channel panels");let c=document.createElement("div");c.id="btfw-panel-bar",c.className="btfw-panel-bar",c.setAttribute("role","toolbar"),c.setAttribute("aria-label","Docked panel shortcuts"),i.appendChild(c)}let m=i.querySelector("#btfw-panel-bar");return B(m),i.parentElement!==t&&t.insertBefore(i,t.firstChild),e||(oe(),e=!0),(o=document.getElementById("btfw-stack-drawer"))==null||o.remove(),i}function A(t){t.preventDefault(),t.stopPropagation(),q()}function I(){let t=_();if(!t)return null;let i=document.getElementById("btfw-panels-menu-btn");i?i.parentElement!==t&&t.appendChild(i):(i=document.createElement("button"),i.type="button",i.id="btfw-panels-menu-btn",i.className="button btfw-chatbtn btfw-panels-menu-btn",i.innerHTML=Te(),i.title="Docked Panels",i.setAttribute("aria-expanded","false"),i.hidden=!0,t.appendChild(i)),i.title="Docked Panels";let m=i.querySelector(".btfw-panels-menu-btn__label");return m&&(m.textContent="Panels"),i.classList.remove("is-wide"),i.dataset.btfwPanelsWired||(i.addEventListener("click",A),i.dataset.btfwPanelsWired="1"),i}function R(t){S();let i=document.querySelector(`#btfw-stack .btfw-stack-item[data-bind="${t}"]`);i&&(a&&(clearTimeout(a),a=null),n=null,document.querySelectorAll(".btfw-panel-btn.is-active").forEach(m=>{m.classList.remove("is-active"),delete m.dataset.btfwFlyoutLocked}),document.documentElement.classList.remove("btfw-panels-flyout-open"),x.disconnectQueuePreviewObserver(),ae(i,!1),requestAnimationFrame(()=>{try{i.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(m){}}))}function B(t){!t||t.dataset.btfwActionsWired||(t.dataset.btfwActionsWired="1",t.addEventListener("click",i=>{var b,M,C;let m=i.target.closest(".btfw-panel-undock");if(m){i.preventDefault(),i.stopPropagation();let r=m.dataset.panelGroup||((b=m.closest(".btfw-panel-btn"))==null?void 0:b.dataset.group);r&&R(r);return}let o=i.target.closest(".btfw-panel-playlist__play");if(o){i.preventDefault(),i.stopPropagation(),x.playQueueEntry(o.dataset.queueUid);return}let c=i.target.closest(".btfw-panel-playlist__add");if(c){i.preventDefault(),i.stopPropagation();let r=(M=c.closest(".btfw-panel-container"))==null?void 0:M.querySelector(".btfw-panel-playlist__add-form");if(!r)return;let l=r.hidden;r.hidden=!l,c.setAttribute("aria-expanded",l?"true":"false"),l&&((C=r.querySelector(".btfw-panel-playlist__link-input"))==null||C.focus())}}),t.addEventListener("submit",i=>{var M,C,r,l;let m=i.target.closest(".btfw-panel-playlist__add-form");if(!m)return;i.preventDefault(),i.stopPropagation();let o=m.querySelector(".btfw-panel-playlist__link-input"),c=(M=o==null?void 0:o.value)==null?void 0:M.trim();if(!c||!x.queueMediaLink(c))return;o.value="",m.hidden=!0,(r=(C=m.closest(".btfw-panel-container"))==null?void 0:C.querySelector(".btfw-panel-playlist__add"))==null||r.setAttribute("aria-expanded","false");let b=(l=m.closest(".btfw-panel-container"))==null?void 0:l.querySelector(".btfw-panel-playlist__queue");b&&x.renderPlaylistQueuePreview(b)}))}function $(t,i){let m=document.createElement("button");return m.type="button",m.className="btfw-panel-undock",m.dataset.panelGroup=t,m.setAttribute("aria-label",`Pin ${i.title} below video`),m.title="Pin below video",m.innerHTML=Le(),m}function F(){let t=document.createElement("form");return t.className="btfw-panel-playlist__add-form",t.hidden=!0,t.innerHTML=Me(),t}function N(t,i,m){let o=document.createElement("div");if(o.className="btfw-panel-container",m>0&&(o.style.bottom=`${-m*50}px`),t==="playlist-group"){o.classList.add("btfw-panel-container--playlist");let b=document.createElement("div");b.className="btfw-panel-playlist__toolbar";let M=document.createElement("button");M.type="button",M.className="btfw-panel-playlist__add",M.textContent="+Add",M.setAttribute("aria-expanded","false");let C=$(t,i);b.append(M,C);let r=F(),l=document.createElement("div");return l.className="btfw-panel-container__host btfw-panel-playlist__queue",o.append(b,r,l),o}o.classList.add("btfw-panel-container--dock-only");let c=document.createElement("div");return c.className="btfw-panel-container__dock-only",c.appendChild($(t,i)),o.appendChild(c),o}function Q(){a&&(clearTimeout(a),a=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(t=>{t.classList.remove("is-active"),delete t.dataset.btfwFlyoutLocked}),document.querySelectorAll(".btfw-panel-container__host .btfw-stack-item").forEach(t=>{L(t)}),x.disconnectQueuePreviewObserver(),n=null,document.documentElement.classList.remove("btfw-panels-flyout-open")}function D(t){let i=document.getElementById("btfw-panel-bar"),m=document.getElementById("btfw-panels-menu-btn");i&&i.classList.toggle("open",t),document.documentElement.classList.toggle("btfw-panels-bar-open",t),m&&(m.classList.toggle("is-expanded",t),m.setAttribute("aria-expanded",t?"true":"false")),t||Q()}function U(){D(!1)}function q(){_();let t=document.getElementById("btfw-panel-bar"),i=document.getElementById("btfw-panels-menu-btn");!t||!i||i.hidden||D(!t.classList.contains("open"))}function V(t){a&&clearTimeout(a),a=setTimeout(()=>{a=null;let i=document.querySelector(`.btfw-panel-btn[data-group="${t}"]`);i&&(i.matches(":hover")||i.querySelector(".btfw-panel-container:hover")||(i.classList.remove("is-active"),n===t&&(n=null,x.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open")))},140)}function K(t,i){if(i&&(a&&(clearTimeout(a),a=null),document.querySelectorAll(".btfw-panel-btn.is-active").forEach(m=>{m!==i&&m.classList.remove("is-active")}),n=t,i.classList.add("is-active"),document.documentElement.classList.add("btfw-panels-flyout-open"),t==="playlist-group")){let m=i.querySelector(".btfw-panel-playlist__queue");m&&(x.renderPlaylistQueuePreview(m),x.ensureQueuePreviewObserver(m))}}function oe(){document.documentElement.dataset.btfwPanelDismissWired||(document.documentElement.dataset.btfwPanelDismissWired="1",document.addEventListener("click",t=>{n&&(t.target.closest(".btfw-panel-btn, .btfw-panel-container, #btfw-panels-menu-btn, #btfw-panels-menu-shell")||(document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(i=>{delete i.dataset.btfwFlyoutLocked}),Q()))}))}function Y(t,i){var o;if(!((o=document.getElementById("btfw-panel-bar"))!=null&&o.classList.contains("open")))return;if(a&&(clearTimeout(a),a=null),i.dataset.btfwFlyoutLocked==="true"&&i.classList.contains("is-active")){delete i.dataset.btfwFlyoutLocked,i.classList.remove("is-active"),n===t&&(n=null,x.disconnectQueuePreviewObserver()),document.querySelector(".btfw-panel-btn.is-active")||document.documentElement.classList.remove("btfw-panels-flyout-open");return}document.querySelectorAll(".btfw-panel-btn[data-btfw-flyout-locked]").forEach(c=>{c!==i&&delete c.dataset.btfwFlyoutLocked}),i.dataset.btfwFlyoutLocked="true",K(t,i)}function X(t,i){let m=t.querySelector(".btfw-panel-container"),o=()=>{var c;(c=document.getElementById("btfw-panel-bar"))!=null&&c.classList.contains("open")&&(a&&(clearTimeout(a),a=null),K(i,t))};t.addEventListener("mouseenter",o),t.addEventListener("focusin",o),t.addEventListener("click",c=>{c.target.closest(".btfw-panel-container")||(c.preventDefault(),c.stopPropagation(),Y(i,t))}),t.addEventListener("keydown",c=>{c.key!=="Enter"&&c.key!==" "||(c.preventDefault(),Y(i,t))}),t.addEventListener("mouseleave",c=>{t.dataset.btfwFlyoutLocked!=="true"&&(m!=null&&m.contains(c.relatedTarget)||V(i))}),m==null||m.addEventListener("mouseenter",()=>{a&&(clearTimeout(a),a=null)}),m==null||m.addEventListener("mouseleave",c=>{t.dataset.btfwFlyoutLocked!=="true"&&(t.contains(c.relatedTarget)||V(i))})}function Z(){let t=_();I();let i=t==null?void 0:t.querySelector("#btfw-panel-bar");if(!i)return;let m=Array.from(document.querySelectorAll('#btfw-stack .btfw-stack-item[data-docked="true"]')).sort((C,r)=>(Ie[C.dataset.bind]||99)-(Ie[r.dataset.bind]||99)),o=m.map(C=>C.dataset.bind).join("|"),c=document.getElementById("btfw-panels-menu-btn");if(c&&(c.hidden=m.length===0,m.length===0)){d="",U();return}if(o===d&&i.childElementCount===m.length)return;d=o;let b=i.classList.contains("open"),M=n;if(Q(),i.replaceChildren(),i.style.setProperty("--btfw-panel-bar-count",String(Math.max(m.length,1))),m.forEach((C,r)=>{let l=C.dataset.bind,k=Oe[l]||{short:"?",title:l},P=document.createElement("div");P.className="btfw-panel-btn",P.dataset.group=l,P.title=k.title,P.setAttribute("role","button"),P.setAttribute("aria-label",k.title),P.tabIndex=0;let z=document.createElement("span");z.className="btfw-panel-btn__label",z.textContent=je[l]||k.short,P.appendChild(z),P.appendChild(N(l,k,r)),i.appendChild(P),X(P,l)}),b&&(D(!0),M&&m.some(r=>r.dataset.bind===M))){let r=i.querySelector(`.btfw-panel-btn[data-group="${M}"]`);r&&K(M,r)}}function ae(t,i,m={}){if(!t)return;let o=!!i,c=m.persist===!1,b=t.dataset.bind,M=Ee[b];t.dataset.docked=o?"true":"false",t.classList.toggle("btfw-stack-item--docked",o);let C=t.querySelector(".btfw-stack-dock-btn");C&&(C.setAttribute("aria-pressed",o?"true":"false"),C.title=o?"Pinned to panels menu":"Dock to panels menu"),o?qe(t)?L(t):n===b&&(n=null):(L(t),t._btfwSetOpenState?t._btfwSetOpenState(!0):(t.dataset.open="true",t.classList.add("is-open"))),!c&&M&&Qe(M,o),Z(),Fe()}function ie(t,i){var r;let m=Ee[i];if(!m)return;let o=t.querySelector(".btfw-stack-item__header"),c=o==null?void 0:o.querySelector(".btfw-stack-header-toolbar"),b=c==null?void 0:c.querySelector(".btfw-stack-arrows");if(!b||b.querySelector(".btfw-stack-dock-btn"))return;let M=Re(m);t.dataset.docked=M?"true":"false",t.classList.toggle("btfw-stack-item--docked",M);let C=document.createElement("button");C.type="button",C.className="btfw-arrow btfw-stack-dock-btn",C.textContent="\u2AF7",C.setAttribute("aria-label",`Dock ${((r=Oe[i])==null?void 0:r.title)||i} to panels menu`),C.setAttribute("aria-pressed",M?"true":"false"),C.title=M?"Pinned to panels menu":"Dock to panels menu",C.addEventListener("click",l=>{l.preventDefault(),l.stopPropagation(),t.dataset.docked!=="true"&&ae(t,!0)}),b.insertBefore(C,b.firstChild)}function re(t,i={}){let{storageKey:m,getDefaultOpen:o,toggleClass:c,ariaLabel:b="Toggle panel visibility",openTitle:M="Hide panel",closeTitle:C="Show panel"}=i,r=we(m),l=typeof o=="function"?o(r):r!==null?r:!0;t.hasAttribute("data-open")||(t.dataset.open=l?"true":"false"),t.classList.toggle("is-open",t.dataset.open!=="false");let k=t.querySelector(".btfw-stack-item__header"),P=k&&k.querySelector(".btfw-stack-arrows");if(!P||P.querySelector(`.${c}`))return;let z=document.createElement("button");z.type="button",z.className=`btfw-arrow ${c}`,z.setAttribute("aria-label",b),z.style.display="flex",z.style.alignItems="center",z.style.justifyContent="center";let j=()=>{let ee=t.dataset.open!=="false";z.textContent=ee?"\u{1F441}\uFE0F":"\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F",z.title=ee?M:C,z.setAttribute("aria-expanded",ee?"true":"false"),t.classList.toggle("is-open",ee)},ne=(ee,ue={})=>{let $e=!!ee,ke=ue.persist===!1;ke&&(t._btfwSuppressPersist=!0),t.dataset.open=$e?"true":"false",j(),ke||Be(m,$e),ke&&queueMicrotask(()=>{t._btfwSuppressPersist=!1})};z.addEventListener("click",ee=>{ee.preventDefault(),ee.stopPropagation(),ne(t.dataset.open==="false")}),j(),new MutationObserver(ee=>{for(let ue of ee)ue.type==="attributes"&&(j(),t._btfwSuppressPersist||Be(m,t.dataset.open!=="false"))}).observe(t,{attributes:!0,attributeFilter:["data-open"]}),P.insertBefore(z,P.firstChild),t._btfwSetOpenState=ne,ie(t,t.dataset.bind)}function g(t){return!!t.closest('.modal, [role="dialog"]')}function H(t){if(!t||t.querySelector("#btfw-footer"))return;let i=document.getElementById("btfw-footer");if(i&&i!==t&&!t.contains(i)){t.innerHTML="",t.appendChild(i);return}let m=document.getElementById("footer")||Array.from(document.querySelectorAll("footer")).find(o=>!g(o));m&&!t.contains(m)&&(m.classList.add("btfw-footer"),t.innerHTML="",t.appendChild(m))}function W(t){let i=document.querySelector(`.btfw-stack-item[data-bind="${t}"]`),m=i==null?void 0:i.querySelector(".btfw-stack-item__header");if(!m)return null;let o=m.querySelector(".btfw-stack-header-actions");if(!o){o=document.createElement("span"),o.className="btfw-stack-header-actions";let c=m.querySelector(".btfw-stack-header-toolbar"),b=(c==null?void 0:c.querySelector(".btfw-stack-arrows"))||m.querySelector(".btfw-stack-arrows");c&&b?c.insertBefore(o,b):b?m.insertBefore(o,b):m.appendChild(o)}return o}function G(t,i){t&&(t.classList.remove("btn","btn-sm","btn-default","button","is-small","is-link"),t.classList.add("btfw-stack-header-btn"),t.innerHTML!==i&&(t.innerHTML=i))}function te(){let t=W("poll-group"),i=document.getElementById("newpollbtn");if(t&&i){G(i,'<span data-btfw-icon-slot="stack-new-poll" aria-hidden="true"><i class="fa fa-plus"></i></span> New Poll'),i.parentElement!==t&&t.appendChild(i);let c=document.querySelector("#pollwrap > .poll-controls");c&&c.children.length===0&&c.remove()}let m=W("motd-group"),o=document.getElementById("btfw-motd-editbtn");if(m&&o){G(o,'<span data-btfw-icon-slot="stack-edit-motd" aria-hidden="true"><i class="fa fa-plus"></i></span> Edit MOTD'),o.parentElement!==m&&m.appendChild(o);let c=o.closest(".btfw-motd-editrow");c&&c.parentElement&&c.remove()}}function J(t){return de.every(i=>i.selectors.some(o=>{var b,M;if(Ne.includes(o))return!1;let c=document.querySelector(o);if(!c||t.contains(c)||c.contains(t))return!1;if(o==="#pollwrap"){let C=(b=c.dataset)==null?void 0:b.btfwPollOverlay,r=(M=c.getAttribute)==null?void 0:M.call(c,"data-btfw-poll-overlay");if(C==="video"||r==="video")return!1}return!0})?!!t.querySelector(`[data-bind="${i.id}"]`):!0)}function h(t){if(!s){s=!0;try{let i=t.list,m=t.footer;if(J(i)&&i.children.length>0){T.ensureMotdStackPanel(t),O.ensurePollStackPanel(t),O.syncPollWrapVisibility(),te(),H(m);return}O.movePollButton(),O.detachPollWrapFromPlaylist();let o=new Map;de.forEach(M=>{let C=[];M.selectors.forEach(r=>{let l=document.querySelector(r);if(l&&!(i.contains(l)||l.contains(i))&&!Ne.includes(r)){if(r==="#pollwrap"){let k=l.dataset&&l.dataset.btfwPollOverlay,P=l.getAttribute&&l.getAttribute("data-btfw-poll-overlay");if(k==="video"||P==="video")return}C.push(l)}}),C.length>0&&o.set(M.id,{group:M,elements:C})});let c=Ke(),b=[];o.forEach(({group:M,elements:C},r)=>{if(!Array.from(i.children).find(k=>k.dataset.bind===r))try{let k=y(M,C);k&&b.push({item:k,id:r,priority:M.priority,isGroup:!0})}catch(k){console.warn("[stack] Failed to create group item:",r,k)}}),c.length>0?b.sort((M,C)=>{let r=c.findIndex(k=>k.id===M.id),l=c.findIndex(k=>k.id===C.id);return r>=0&&l>=0?r-l:r>=0?-1:l>=0?1:M.priority-C.priority}):b.sort((M,C)=>M.priority-C.priority),b.forEach(({item:M})=>{try{M&&!i.contains(M)&&!M.contains(i)&&i.appendChild(M)}catch(C){console.warn("[stack] Failed to add item to list:",C)}}),ce(i),T.ensureMotdStackPanel(t),O.ensurePollStackPanel(t),O.syncPollWrapVisibility(),te(),H(m)}finally{s=!1}}}function E(){let t=S();if(!t||(h(t),T.wireMotdObservers(t),T.wireMotdSocket(t),O.wirePollObservers(t),O.wirePollSocket(t),f))return;f=!0;let i=new MutationObserver(()=>{w||(w=requestAnimationFrame(()=>{w=null,h(t)}))}),m=document.getElementById("btfw-leftpad"),o=document.getElementById("main");m&&i.observe(m,{childList:!0,subtree:!1}),o&&i.observe(o,{childList:!0,subtree:!1}),me("#btfw-stack .btfw-stack-item",{root:document}).then(()=>{let c=document.querySelector('.btfw-stack-item[data-bind="motd-group"]');c&&Se(c,ge,C=>le(C,u()));let b=document.querySelector('.btfw-stack-item[data-bind="playlist-group"]');b&&Se(b,Ae,C=>C!==null?!!C:!0);let M=document.querySelector('.btfw-stack-item[data-bind="poll-group"]');M&&Se(M,Pe,C=>le(C,fe())),document.querySelectorAll('#btfw-stack .btfw-stack-item[data-group="true"]').forEach(C=>{let r=Ee[C.dataset.bind];r&&ae(C,Re(r),{persist:!1})}),_(),I(),Z(),O.syncPollPanelVisibility(t),Fe(),h(t)}).catch(()=>{})}return document.addEventListener("btfw:layoutReady",E),document.addEventListener("btfw:chat:barsReady",()=>{_(),I(),Z()}),setTimeout(E,1200),document.addEventListener("btfw:channelThemeTint",()=>{let t=S();t&&setTimeout(()=>h(t),100)}),document.addEventListener("btfw:motd:updated",t=>{var m;let i=(m=t==null?void 0:t.detail)==null?void 0:m.html;typeof i=="string"&&T.applyMotdUpdate(i)}),{name:"feature:stack",hasMotdContent:u,resolveMotdHost:T.resolveMotdHost,normalizeMotdStructure:T.normalizeMotdStructure,applyMotdUpdate:T.applyMotdUpdate}});BTFW.define("feature:videoOverlay",[],async()=>{let e=(r,l=document)=>l.querySelector(r),n=["#mediarefresh","#voteskip","#fullscreenbtn"],d={localSubs:"btfw:video:localsubs"},a=5,p={owner:["chanowner","owner","founder","admin","administrator"]};function s(){var r;try{return((r=window.PLAYER)==null?void 0:r.mediaType)||null}catch(l){return null}}function w(){let r=(s()||"").toLowerCase();return r==="fi"||r==="gd"}function f(){try{return window.CLIENT||window.client||null}catch(r){return null}}function T(){try{return window.CHANNEL||window.channel||null}catch(r){return null}}function u(){let r=T();if(r&&typeof r.perms=="object"&&r.perms)return r.perms;try{return window.CHANNEL_PERMS||window.channelPermissions||{}}catch(l){return{}}}function x(r=[]){let l=u();for(let k of r){let P=l==null?void 0:l[k];if(typeof P=="number")return P}}function O(){let r=x(p.owner);return typeof r=="number"?r:a}function S(r){if(!r)return!1;try{if(typeof r.hasPermission=="function"&&r.hasPermission("chanowner"))return!0}catch(l){}try{if(typeof window.hasPermission=="function"&&window.hasPermission("chanowner"))return!0}catch(l){}return!1}function y(){let r=f();if(!r)return!1;let l=Number(r.rank);return Number.isFinite(l)?!!(l>=O()||S(r)):!1}let v=()=>{try{return localStorage.getItem(d.localSubs)!=="0"}catch(r){return!0}},L=r=>{try{localStorage.setItem(d.localSubs,r?"1":"0")}catch(l){}document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed",{detail:{enabled:!!r}}))},_=0,A=0,I=0,R=2e3,B=8e3,$=45e3,F=12e4,N=B,Q=!1,D=null;function U(){if(e("#btfw-vo-css"))return;let r=document.createElement("style");r.id="btfw-vo-css",r.textContent=`
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
    `,document.head.appendChild(r)}function q(r){let l=e("#videowrap");!l||!r||((r.parentElement!==l.parentElement||r.previousElementSibling!==l)&&l.insertAdjacentElement("afterend",r),r.classList.add("btfw-vo-visible"))}function V(){if(!e("#videowrap"))return null;let l=e("#btfw-video-overlay");l||(l=document.createElement("div"),l.id="btfw-video-overlay",l.setAttribute("data-testid","btfw-video-overlay")),l.classList.add("btfw-video-overlay"),l.getAttribute("data-testid")||l.setAttribute("data-testid","btfw-video-overlay"),q(l);let k=l.querySelector("#btfw-vo-bar");k||(k=document.createElement("div"),k.className="btfw-vo-bar",k.id="btfw-vo-bar",l.appendChild(k));let P=oe(l,k);return M(P.left),g(P),H(P),K(l),l}function K(r){r&&r.querySelectorAll("button").forEach(l=>{l.classList.contains("btfw-vo-btn")||l.classList.add("btfw-vo-btn")})}function oe(r,l){let k="btfw-vo-left",P="btfw-vo-right",z=l.querySelector(`#${k}`);z||(z=document.createElement("div"),z.id=k,z.className="btfw-vo-section btfw-vo-section--left",l.insertBefore(z,l.firstChild));let j=l.querySelector(`#${P}`);return j||(j=document.createElement("div"),j.id=P,j.className="btfw-vo-section btfw-vo-section--right",l.appendChild(j)),Array.from(l.children).forEach(ne=>{ne===z||ne===j||j.appendChild(ne)}),r.dataset.leftSection=`#${k}`,r.dataset.rightSection=`#${P}`,l.dataset.leftSection=`#${k}`,l.dataset.rightSection=`#${P}`,{left:z,right:j}}function Y(){return document.querySelector("#ytapiplayer video, video")}function X(r=Y()){return r?typeof window.WebKitPlaybackTargetAvailabilityEvent!="undefined"||typeof r.webkitShowPlaybackTargetPicker=="function":!1}function Z(){if(!D)return;let r=D._btfwAirplayHandler;if(r){try{D.removeEventListener("webkitplaybacktargetavailabilitychanged",r)}catch(l){}delete D._btfwAirplayHandler}D=null}function ae(r){if(!r||typeof r.addEventListener!="function"){Z();return}if(D===r)return;Z();let l=k=>{let P=!k||k.availability==="available",z=e("#btfw-airplay");z&&(z.style.display=P?"":"none")};try{r.addEventListener("webkitplaybacktargetavailabilitychanged",l),r._btfwAirplayHandler=l,D=r}catch(k){}}function ie(){let r=e("#btfw-airplay");if(!r)return;let l=Y();if(!X(l)){r.style.display="none",Z();return}r.style.display="",ae(l)}function re(r,l){l&&l.classList.add("btfw-vo-visible")}function g(r){if(!(r!=null&&r.right)||!(r!=null&&r.left))return;let l=[];document.querySelector("#fullscreenbtn")||l.push({id:"btfw-fullscreen",icon:"fa fa-expand",tooltip:"Fullscreen",action:te,section:"right"}),l.push({id:"btfw-airplay",icon:"fa fa-television",tooltip:"AirPlay",action:E,section:"right"}),l.forEach(k=>{let P=document.querySelector(`#${k.id}`),z=k.section==="left"?r.left:r.right;if(P)z&&P.parentElement!==z&&z.appendChild(P);else{P=document.createElement("button"),P.id=k.id,P.className="btfw-vo-btn";let j=document.createElement("i");j.className=k.icon,P.appendChild(j),P.title=k.tooltip,P.addEventListener("click",k.action),(z||r.right).appendChild(P)}}),ie()}function H(r){let l=r==null?void 0:r.right;l&&n.forEach(k=>{let P=document.querySelector(k);if(!P)return;if(P.dataset.btfwOverlay==="1"){P.parentElement!==l&&l.appendChild(P);return}let z=document.createElement("span");z.hidden=!0,z.setAttribute("data-btfw-ph",k);try{P.insertAdjacentElement("afterend",z)}catch(j){}if(P.classList.add("btfw-vo-adopted"),P.dataset.btfwOverlay="1",P.id==="mediarefresh"){let j=P.onclick;P.onclick=ne=>{ne.preventDefault();let be=!!(ne&&ne.isTrusted);G(()=>{if(typeof j=="function")try{return j.call(P,ne),!0}catch(ee){console.warn("[video-overlay] native refresh handler failed:",ee)}return!1},{isUserAction:be})}}l.appendChild(P)})}function W(){try{if(window.socket)return socket.emit("playerReady"),!0}catch(r){console.warn("[video-overlay] Media refresh failed:",r)}return!1}function G(r,l={}){let{isUserAction:k=!1}=l,P=Date.now();if(I&&P-I>F&&(N=B,_=0),P<A){let ee=Math.ceil((A-P)/1e3);return t(k?`Refresh available in ${ee}s`:`Auto refresh paused. Next attempt in ${ee}s`,"warning"),!1}let z=k?R:N;if(I&&P-I<z){let ee=z-(P-I),ue=Math.ceil(ee/1e3);return A=P+ee,t(k?`Refresh available in ${ue}s`:`Auto refresh paused. Next attempt in ${ue}s`,"warning"),!1}if(_++,_>=10)return A=P+3e4,_=0,t("Refresh limit reached. 30s cooldown active.","error"),!1;let j=k?6e3:Math.max(12e3,N+2e3);setTimeout(()=>{_>0&&_--},j);let ne=!1;if(typeof r=="function")try{ne=r()===!0}catch(ee){console.warn("[video-overlay] Refresh handler error:",ee)}return ne||(ne=W()),I=Date.now(),k?N=B:N=Math.min($,Math.max(B,Math.round(N*(ne?1.25:1.5)))),A=Math.max(A,I+(k?R:N)),!k&&ne?t(`Auto refresh sent. Next attempt in ${Math.ceil(N/1e3)}s`,"info"):t(ne?"Media refreshed":"Unable to refresh media",ne?"success":"error"),ne}function te(){let r=e("#videowrap");r&&(document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.mozCancelFullScreen&&document.mozCancelFullScreen():r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen?r.webkitRequestFullscreen():r.mozRequestFullScreen&&r.mozRequestFullScreen())}function J(r,l=!0){if(!r||!X(r))return!1;if(r.setAttribute("airplay","allow"),r.setAttribute("x-webkit-airplay","allow"),l&&typeof r.webkitShowPlaybackTargetPicker=="function")try{r.webkitShowPlaybackTargetPicker()}catch(k){console.warn("[video-overlay] AirPlay picker failed:",k)}return ie(),!0}function h(){if(!(Q||!window.socket)){Q=!0;try{socket.on("changeMedia",()=>{setTimeout(()=>{let r=Y();r&&(J(r,!1),ae(r)),ie()},1e3)})}catch(r){console.warn("[video-overlay] Failed to attach AirPlay listener:",r)}}}function E(){let r=Y();return X(r)?J(r)?(t("AirPlay enabled","success"),h(),!0):(t("AirPlay not available","warning"),!1):(ie(),t("AirPlay not available","warning"),!1)}function t(r,l="info"){let k=document.getElementById("btfw-notification");k||(k=document.createElement("div"),k.id="btfw-notification",k.className="btfw-notification",document.body.appendChild(k)),k.textContent=r,k.className=`btfw-notification btfw-notification--${l} btfw-notification--show`,clearTimeout(k._hideTimer),k._hideTimer=setTimeout(()=>{k.classList.remove("btfw-notification--show")},3e3)}function i(){return e("video")}function m(r){let l=(r||"").replace(/\r\n/g,`
`).trim()+`
`;return l=l.replace(/^\d+\s*$\n/gm,""),l=l.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g,"$1.$2"),l=l.replace(/(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/g,"$1 --> $2"),`WEBVTT

`+l}async function o(){let r=i();if(!r){b("Local subs only for HTML5 sources.");return}let l=document.createElement("input");l.type="file",l.accept=".vtt,.srt,text/vtt,text/plain",l.style.display="none",document.body.appendChild(l);let k=new Promise(P=>{l.addEventListener("change",async()=>{let z=l.files&&l.files[0];if(document.body.removeChild(l),!z)return P(!1);try{let j=await z.text(),be=(z.name.split(".").pop()||"").toLowerCase()==="srt"?m(j):j.startsWith("WEBVTT")?j:`WEBVTT

`+j,ee=URL.createObjectURL(new Blob([be],{type:"text/vtt"}));c(r,ee,z.name.replace(/\.[^.]+$/,"")||"Local"),b("Subtitles loaded."),P(!0)}catch(j){console.error(j),b("Failed to load subtitles."),P(!1)}},{once:!0})});l.click(),await k}function c(r,l,k){var z;(z=e('track[data-btfw="1"]',r))==null||z.remove();let P=document.createElement("track");P.kind="subtitles",P.label=k||"Local",P.srclang="en",P.src=l,P.default=!0,P.setAttribute("data-btfw","1"),r.appendChild(P);try{for(let j of r.textTracks)j.mode=j.label===P.label?"showing":"disabled"}catch(j){}}function b(r){let l=e("#btfw-mini-toast");l||(l=document.createElement("div"),l.id="btfw-mini-toast",document.body.appendChild(l)),l.textContent=r,l.style.opacity="1",clearTimeout(l._hid),l._hid=setTimeout(()=>l.style.opacity="0",1400)}function M(r){if(!r)return;let l=document.querySelector("#btfw-vo-subs");if(!l){l=document.createElement("button"),l.id="btfw-vo-subs",l.className="btfw-vo-btn",l.title="Load local subtitles (.vtt/.srt)";let P=document.createElement("i");P.className="fa fa-cc",l.appendChild(P),l.addEventListener("click",z=>{z.preventDefault(),o()}),r.insertBefore(l,r.firstChild||null)}let k=v()&&w();l.style.display=k?"":"none"}function C(){U(),V();let r=[e("#videowrap"),e("#rightcontrols"),e("#leftcontrols"),document.body].filter(Boolean),l=new MutationObserver(()=>V());r.forEach(k=>l.observe(k,{childList:!0,subtree:!0})),document.addEventListener("btfw:video:localsubs:changed",()=>V());try{window.socket&&typeof socket.on=="function"&&socket.on("changeMedia",()=>{setTimeout(()=>V(),0)})}catch(k){}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",C):C(),{name:"feature:videoOverlay",setLocalSubsEnabled:L,toggleFullscreen:te,enableAirplay:E}});var tt="https://vidprox.movies-storage-a.workers.dev/?url=";function We(){return window.__btfwMediaSourceNodes||(window.__btfwMediaSourceNodes=new WeakMap),window.__btfwMediaSourceNodes}function xe(){return Date.now()}var nt=window.BTFW_AUDIO={audioContext:null,sourceNode:null,_sourceMediaElement:null,compressorNode:null,gainNode:null,splitterNode:null,monoMixGain:null,mergerNode:null,player:null,_sourceObserver:null,originalSrc:null,proxiedSrc:null,isProxied:!1,boostEnabled:!1,normalizationEnabled:!1,monoEnabled:!1,get CORS_PROXY(){var n,d,a;let e=typeof window!="undefined"&&(((n=window.BTFW_CONFIG)==null?void 0:n.corsVideoProxy)||((a=(d=window.BTFW_CONFIG)==null?void 0:d.integrations)==null?void 0:a.corsVideoProxy));if(typeof e=="string"&&e.trim()){let p=e.trim();if(p.includes("?"))return p;let s=p.endsWith("/")?"":"/";return`${p}${s}?url=`}return tt},BOOST_MULTIPLIER:2.5,currentNormPreset:"youtube",_watchdogInterval:null,_mutationObserver:null,_watchdogPlayerHandlers:null,_visibilityHandler:null,_lastKnownSrc:null,_lastInternalSrcSetAt:0,_lastAutoReapplyAt:0,_rebuildInFlight:null,NORM_PRESETS:{gentle:{threshold:-12,knee:20,ratio:6,attack:.01,release:.5,label:"Gentle"},youtube:{threshold:-24,knee:30,ratio:12,attack:.003,release:.25,label:"YouTube"},aggressive:{threshold:-50,knee:40,ratio:12,attack:.001,release:.25,label:"Aggressive"}},_getCorsProxyOrigin(){try{return new URL(this.CORS_PROXY).origin.toLowerCase()}catch(e){try{return new URL(tt).origin.toLowerCase()}catch(n){return""}}},_isTrusted(e){if(!e)return!1;if(String(e).includes(this.CORS_PROXY))return!0;try{let n=new URL(e),d=n.origin.toLowerCase(),a=this._getCorsProxyOrigin();return a&&d===a?!0:/^vidprox\./i.test(n.hostname)}catch(n){return!1}},_unwrapProxiedUrl(e){if(!e||!this._isTrusted(e))return e;try{return new URL(e).searchParams.get("url")||e}catch(n){return e}},_markInternalSrcSet(){this._lastInternalSrcSetAt=xe()},_isInsideInternalWindow(){return xe()-this._lastInternalSrcSetAt<=2e3},_shouldForceProxy(){return this.boostEnabled||this.normalizationEnabled||this.monoEnabled},_hasAnonymousCrossOrigin(){let e=this._getMediaElement();return e?e.crossOrigin==="anonymous"||e.getAttribute("crossorigin")==="anonymous":!1},_ensureAnonymousCrossOrigin(){var n;if(this._hasAnonymousCrossOrigin())return!1;let e=this._readCurrentSrc();if(e&&!this._isTrusted(e))return!1;try{return(n=this.player)==null||n.crossOrigin("anonymous"),!0}catch(d){return!1}},_clearMediaElementForCorsSwap(){let e=this._getMediaElement();if(e)try{for(e.removeAttribute("src"),e.removeAttribute("crossorigin");e.firstChild;)e.removeChild(e.firstChild);e.load()}catch(n){}},_same(e,n){return String(e||"")===String(n||"")},_readCurrentSrc(){var e,n,d;try{let a=((n=(e=this.player)==null?void 0:e.currentSrc)==null?void 0:n.call(e))||"";if(a)return a}catch(a){}return((d=this._getMediaElement())==null?void 0:d.currentSrc)||""},_getMediaElement(){var d;let e=(d=this.player)==null?void 0:d.tech_;if(e){try{let a=typeof e.el=="function"?e.el():null;if(a instanceof HTMLMediaElement&&a.isConnected)return a}catch(a){}if(e.el_ instanceof HTMLMediaElement&&e.el_.isConnected)return e.el_}let n=document.querySelector("#ytapiplayer video, #videowrap .video-js .vjs-tech");return n instanceof HTMLMediaElement&&n.isConnected?n:null},_hasIframeOnlyMedia(){return this._getMediaElement()?!1:!!document.querySelector("#ytapiplayer iframe")},disconnectChain(){if(this.sourceNode)try{this.sourceNode.disconnect()}catch(e){}if(this.compressorNode){try{this.compressorNode.disconnect()}catch(e){}this.compressorNode=null}if(this.gainNode){try{this.gainNode.disconnect()}catch(e){}this.gainNode=null}if(this.splitterNode){try{this.splitterNode.disconnect()}catch(e){}this.splitterNode=null}if(this.monoMixGain){try{this.monoMixGain.disconnect()}catch(e){}this.monoMixGain=null}if(this.mergerNode){try{this.mergerNode.disconnect()}catch(e){}this.mergerNode=null}},resetMediaBinding(){var n,d;this.disconnectChain();let e=this._getMediaElement();if(e&&this._syncFromRegistry(e)){((n=this.audioContext)==null?void 0:n.state)==="running"&&this.audioContext.suspend().catch(()=>{});return}this.sourceNode=null,this._sourceMediaElement=null,((d=this.audioContext)==null?void 0:d.state)==="running"&&this.audioContext.suspend().catch(()=>{})},_swapVideoTechElement(e){var w;let n=(w=this.player)==null?void 0:w.tech_;if(!(n!=null&&n.el_)||n.el_!==e)return null;let d=e.parentNode;if(!d)return null;let a=e.tagName.toLowerCase()==="audio"?"audio":"video",p=document.createElement(a);p.className=e.className,e.id&&(p.id=e.id),p.setAttribute("playsinline",""),p.setAttribute("webkit-playsinline",""),p.classList.contains("vjs-tech")||p.classList.add("vjs-tech");let s=e.crossOrigin||e.getAttribute("crossorigin");return s&&(p.crossOrigin=s,p.setAttribute("crossorigin",s)),d.replaceChild(p,e),n.el_=p,delete e.__btfwSourceNode,p},_syncFromRegistry(e){let n=We().get(e)||e.__btfwSourceNode||null;return n?(We().set(e,n),this.sourceNode=n,this._sourceMediaElement=e,n.context instanceof AudioContext&&n.context.state!=="closed"&&(this.audioContext=n.context),n):null},_getOrCreateSourceNode(e){let n=We(),d=n.get(e)||e.__btfwSourceNode||null;if(d)return n.set(e,d),this.sourceNode=d,this._sourceMediaElement=e,d.context instanceof AudioContext&&d.context.state!=="closed"&&(this.audioContext=d.context),d;if(this.sourceNode&&this._sourceMediaElement===e)return n.set(e,this.sourceNode),e.__btfwSourceNode=this.sourceNode,this.sourceNode;(!this.audioContext||this.audioContext.state==="closed")&&(this.audioContext=new AudioContext);let a;try{a=this.audioContext.createMediaElementSource(e)}catch(p){if(!(p instanceof DOMException)||p.name!=="InvalidStateError")throw p;let s=this._syncFromRegistry(e);if(s)return s;let w=this._swapVideoTechElement(e);if(!w)throw p;let f=this._readCurrentSrc();if(f&&this.player){this._markInternalSrcSet(),this.player.src({src:f,type:"video/mp4"});try{this.player.load()}catch(T){}}return this._getOrCreateSourceNode(w)}return n.set(e,a),e.__btfwSourceNode=a,this.sourceNode=a,this._sourceMediaElement=e,a},_connectPassthrough(){if(!this.sourceNode||!this.audioContext)return!1;try{this.sourceNode.disconnect()}catch(e){}try{return this.sourceNode.connect(this.audioContext.destination),!0}catch(e){return!1}},_clearCrossOriginAttribute(){var n,d;let e=this._getMediaElement();if(e)try{e.crossOrigin=null,e.removeAttribute("crossorigin")}catch(a){}try{(d=(n=this.player)==null?void 0:n.crossOrigin)==null||d.call(n,null)}catch(a){}},cleanup(){this.disconnectChain();let e=this._getMediaElement();e&&(e.disableRemotePlayback=!1),this._connectPassthrough()||(this.sourceNode=null,this._sourceMediaElement=null,this.audioContext&&this.audioContext.state==="running"&&this.audioContext.suspend().catch(()=>{})),this.stopWatchdog()},async _disableAllProcessing(){this.cleanup();let e=this._readCurrentSrc();return this.sourceNode&&e&&!this._isTrusted(e)&&(await this.ensureProxy(),this._connectPassthrough()),!0},_restorePlayerSrc(e,{currentTime:n=0,wasPlaying:d=!1,clearCrossOrigin:a=!1}={}){if(!this.player||!e)return Promise.resolve(!1);let p=this.player;try{this.player.pause()}catch(s){}a&&this._clearCrossOriginAttribute(),this._markInternalSrcSet(),this.player.src({src:e,type:"video/mp4"});try{this.player.load()}catch(s){}return new Promise(s=>{let w=!1,f=()=>{if(w)return;w=!0;try{p.off("canplay",T)}catch(x){}try{p.off("loadeddata",T)}catch(x){}try{p.currentTime(n)}catch(x){}let u=d?p.play():Promise.resolve();Promise.resolve(u).catch(()=>{}).finally(()=>s(!0))},T=()=>f();try{p.one("canplay",T)}catch(u){try{p.on("canplay",T)}catch(x){}}try{p.one("loadeddata",T)}catch(u){}typeof p.ready=="function"&&p.ready(()=>{try{typeof p.readyState=="function"&&p.readyState()>=2&&f()}catch(u){}}),setTimeout(f,5e3)})},startWatchdog(){if(!this.player)return;let e=this.player;this.stopWatchdog();let n=this._getMediaElement();if(n&&typeof MutationObserver!="undefined"){this._mutationObserver=new MutationObserver(()=>{this._checkAndReapply("mutation")}),this._mutationObserver.observe(n,{attributes:!0,attributeFilter:["src","crossorigin"]});let d=new MutationObserver(()=>{this._checkAndReapply("sources")});d.observe(n,{childList:!0,subtree:!0}),this._sourceObserver=d}if(!this._watchdogPlayerHandlers){this._watchdogPlayerHandlers={sourceset:()=>this._checkAndReapply("sourceset"),loadstart:()=>this._checkAndReapply("loadstart"),loadedmetadata:()=>this._checkAndReapply("loadedmetadata"),stalled:()=>this._checkAndReapply("stalled"),error:()=>this._checkAndReapply("error")};try{Object.entries(this._watchdogPlayerHandlers).forEach(([d,a])=>{e.on(d,a)})}catch(d){}}(typeof document=="undefined"||!document.hidden)&&this._startWatchdogInterval(),!this._visibilityHandler&&typeof document!="undefined"&&(this._visibilityHandler=()=>this._onVisibilityChange(),document.addEventListener("visibilitychange",this._visibilityHandler)),this._lastKnownSrc=this._readCurrentSrc()},_startWatchdogInterval(){this._watchdogInterval||(this._watchdogInterval=setInterval(()=>this._checkAndReapply("interval"),800))},_stopWatchdogInterval(){this._watchdogInterval&&(clearInterval(this._watchdogInterval),this._watchdogInterval=null)},_onVisibilityChange(){typeof document!="undefined"&&(document.hidden?this._stopWatchdogInterval():this.player&&(this._startWatchdogInterval(),this._checkAndReapply("visibility-restore")))},stopWatchdog(){var n;this._stopWatchdogInterval();let e=this.player;if(this._mutationObserver){try{this._mutationObserver.disconnect()}catch(d){}try{(n=this._sourceObserver)==null||n.disconnect()}catch(d){}this._sourceObserver=null,this._mutationObserver=null}if(e&&this._watchdogPlayerHandlers){try{Object.entries(this._watchdogPlayerHandlers).forEach(([d,a])=>{e.off(d,a)})}catch(d){}this._watchdogPlayerHandlers=null}this._visibilityHandler&&typeof document!="undefined"&&(document.removeEventListener("visibilitychange",this._visibilityHandler),this._visibilityHandler=null)},_checkAndReapply(e){if(!this.player)return;let n=this._readCurrentSrc();if(n&&(this._lastKnownSrc=n,!this._isInsideInternalWindow())){if(this._isTrusted(n)){this.isProxied=!0,this.proxiedSrc=n,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(n)),this._shouldForceProxy()&&this._ensureAnonymousCrossOrigin();return}if(this._shouldForceProxy()){if(xe()-this._lastAutoReapplyAt<800)return;this._lastAutoReapplyAt=xe(),this._forceProxyPreservingState(n)}}},async _forceProxyPreservingState(e){if(!this.player)return!1;let n=this.player,d=n.currentTime(),a=!n.paused();if(this._isTrusted(e))return this.isProxied=!0,this.proxiedSrc=e,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(e)),this._ensureAnonymousCrossOrigin(),!0;this.originalSrc=this._unwrapProxiedUrl(e)||e,this.proxiedSrc=this.CORS_PROXY+encodeURIComponent(this.originalSrc);try{this.player.pause()}catch(p){}this._markInternalSrcSet(),this._clearMediaElementForCorsSwap();try{this.player.crossOrigin("anonymous")}catch(p){}this._markInternalSrcSet(),this.player.src({src:this.proxiedSrc,type:"video/mp4"});try{this.player.load()}catch(p){}return new Promise(p=>{let s=!1,w=()=>{if(!s){s=!0;try{n.off("canplay",f)}catch(T){}try{n.off("loadeddata",f)}catch(T){}try{n.currentTime(d)}catch(T){}this.isProxied=!0,a&&n.play().catch(()=>{}),p(!0)}},f=()=>w();try{n.one("canplay",f)}catch(T){try{n.on("canplay",f)}catch(u){}}try{n.one("loadeddata",f)}catch(T){}typeof n.ready=="function"&&n.ready(()=>{try{typeof n.readyState=="function"&&n.readyState()>=2&&w()}catch(T){}}),setTimeout(w,5e3)})},async ensureProxy(){if(!this.player)return!1;let e=this.player,n=this._readCurrentSrc();if(!n)return!1;if(this._isTrusted(n)){if(this.isProxied=!0,this.proxiedSrc=n,(!this.originalSrc||this._isTrusted(this.originalSrc))&&(this.originalSrc=this._unwrapProxiedUrl(n)),this._hasAnonymousCrossOrigin())return!0;let d=e.currentTime(),a=!e.paused();try{e.pause()}catch(p){}this._ensureAnonymousCrossOrigin(),this._markInternalSrcSet(),e.src({src:n,type:"video/mp4"});try{e.load()}catch(p){}return new Promise(p=>{e.ready(()=>{try{e.currentTime(d)}catch(s){}a&&e.play().catch(()=>{}),p(!0)})})}return await this._forceProxyPreservingState(n),!0},async rebuildAudioChain(){if(this._rebuildInFlight)return this._rebuildInFlight;this._rebuildInFlight=this._rebuildAudioChainImpl();try{return await this._rebuildInFlight}finally{this._rebuildInFlight=null}},async _rebuildAudioChainImpl(){var n,d;if(!this.player)return console.error("[BTFW_AUDIO] Player not ready"),!1;if(this._shouldForceProxy()){let a=this._readCurrentSrc();if(this._isTrusted(a))this._ensureAnonymousCrossOrigin();else if(!await this.ensureProxy()||!this._isTrusted(this._readCurrentSrc()))return console.error("[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe"),!1}if(!this.boostEnabled&&!this.normalizationEnabled&&!this.monoEnabled)return!0;this.disconnectChain();let e=this._getMediaElement();if(!e)return console.error("[BTFW_AUDIO] No HTMLMediaElement for Web Audio"),!1;try{((n=this.audioContext)==null?void 0:n.state)==="suspended"&&await this.audioContext.resume().catch(()=>{}),e.disableRemotePlayback=!0;let a=this._getOrCreateSourceNode(e),p=this.audioContext;if(!p)return!1;let s=a;if(this.normalizationEnabled){this.compressorNode=p.createDynamicsCompressor();let w=(d=this.NORM_PRESETS[this.currentNormPreset])!=null?d:this.NORM_PRESETS.youtube;this.compressorNode.threshold.setValueAtTime(w.threshold,p.currentTime),this.compressorNode.knee.setValueAtTime(w.knee,p.currentTime),this.compressorNode.ratio.setValueAtTime(w.ratio,p.currentTime),this.compressorNode.attack.setValueAtTime(w.attack,p.currentTime),this.compressorNode.release.setValueAtTime(w.release,p.currentTime),s.connect(this.compressorNode),s=this.compressorNode}return this.monoEnabled&&(this.splitterNode=p.createChannelSplitter(2),this.monoMixGain=p.createGain(),this.monoMixGain.gain.value=.5,this.mergerNode=p.createChannelMerger(2),s.connect(this.splitterNode),this.splitterNode.connect(this.monoMixGain,0),this.splitterNode.connect(this.monoMixGain,1),this.monoMixGain.connect(this.mergerNode,0,0),this.monoMixGain.connect(this.mergerNode,0,1),s=this.mergerNode),this.boostEnabled&&(this.gainNode=p.createGain(),this.gainNode.gain.value=this.BOOST_MULTIPLIER,s.connect(this.gainNode),s=this.gainNode),s.connect(p.destination),this.startWatchdog(),console.log("[BTFW_AUDIO] Chain rebuilt:",{normalization:this.normalizationEnabled,boost:this.boostEnabled,mono:this.monoEnabled,proxied:this.isProxied}),!0}catch(a){return console.error("[BTFW_AUDIO] Error building audio chain:",a),this.disconnectChain(),!1}},async enableBoost(){return this.boostEnabled=!0,await this.rebuildAudioChain()},async disableBoost(){if(this.boostEnabled=!1,this.normalizationEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableNormalization(){return this.normalizationEnabled=!0,await this.rebuildAudioChain()},async setNormPreset(e){return this.NORM_PRESETS[e]?(this.currentNormPreset=e,this.normalizationEnabled?await this.rebuildAudioChain():!0):!1},async setBoostMultiplier(e){return this.BOOST_MULTIPLIER=e,this.boostEnabled?await this.rebuildAudioChain():!0},async disableNormalization(){if(this.normalizationEnabled=!1,this.boostEnabled||this.monoEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()},async enableMono(){return this.monoEnabled=!0,await this.rebuildAudioChain()},async disableMono(){if(this.monoEnabled=!1,this.boostEnabled||this.normalizationEnabled){let e=await this.rebuildAudioChain();return this._shouldForceProxy()||this.stopWatchdog(),e}return this._disableAllProcessing()}};(function(){"use strict";let e=typeof HTMLElement!="undefined"&&Object.hasOwn(HTMLElement.prototype,"popover"),n=typeof CSS!="undefined"&&typeof CSS.supports=="function"&&CSS.supports("position-anchor: --btfw-anchor-probe"),d="--btfw-boost-anchor",a="--btfw-norm-anchor";function p(w,f,T){if(n&&T){f.style.setProperty("anchor-name",T),w.style.setProperty("position-anchor",T),w.style.setProperty("top","anchor(bottom)"),w.style.setProperty("left","anchor(left)");return}let u=f.getBoundingClientRect();w.style.left=u.left+"px",w.style.top=u.bottom+"px"}function s(w){window.BTFW&&typeof BTFW.define=="function"?w():setTimeout(()=>s(w),0)}s(function(){BTFW.define("feature:audio",[],async()=>{let w=(o,c=document)=>c.querySelector(o),f=nt,T=null,u=null,x=null,O=!1,S=!1,y=!1,v=null,L=null,_=null,A=null,I=[{multiplier:1.5,label:"150%"},{multiplier:2.5,label:"250%"},{multiplier:3.5,label:"350%"}];function R(o){T&&(o?(T.classList.add("active"),T.style.background="rgba(46, 213, 115, 0.3)",T.style.borderColor="#2ed573",T.style.color="#2ed573",T.style.boxShadow="0 0 12px rgba(46, 213, 115, 0.6)"):(T.classList.remove("active"),T.style.background="",T.style.borderColor="",T.style.color="",T.style.boxShadow=""))}function B(o,c="info"){let b=w("#btfw-audioboost-toast");b||(b=document.createElement("div"),b.id="btfw-audioboost-toast",b.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${c==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(b)),b.textContent=o,b.style.background=c==="success"?"rgba(46, 213, 115, 0.9)":"rgba(235, 77, 75, 0.9)",b.style.opacity="1",setTimeout(()=>{b.style.opacity="0"},2e3)}async function $(){if(await f.enableBoost()){O=!0;let c=Math.round(f.BOOST_MULTIPLIER*100);B(`Boosted by ${c}%`,"success"),R(!0)}else{let c=f._hasIframeOnlyMedia()?"Audio boost requires direct video playback":"Failed to activate boost";B(c,"error")}}async function F(){await f.disableBoost(),O=!1,R(!1)}function N(o){u&&(o?(u.classList.add("active"),u.style.background="rgba(52, 152, 219, 0.3)",u.style.borderColor="#3498db",u.style.color="#3498db",u.style.boxShadow="0 0 12px rgba(52, 152, 219, 0.6)"):(u.classList.remove("active"),u.style.background="",u.style.borderColor="",u.style.color="",u.style.boxShadow=""))}function Q(o,c="info"){let b=w("#btfw-audionorm-toast");b||(b=document.createElement("div"),b.id="btfw-audionorm-toast",b.style.cssText=`
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${c==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(b)),b.textContent=o,b.style.background=c==="success"?"rgba(52, 152, 219, 0.9)":"rgba(235, 77, 75, 0.9)",b.style.opacity="1",setTimeout(()=>{b.style.opacity="0"},2e3)}async function D(){if(await f.enableNormalization())S=!0,Q("Normalization enabled","success"),N(!0);else{let c=f._hasIframeOnlyMedia()?"Audio normalization requires direct video playback":"Failed to activate";Q(c,"error")}}async function U(){await f.disableNormalization(),S=!1,N(!1)}function q(o){x&&(o?(x.classList.add("active"),x.style.background="rgba(155, 89, 182, 0.3)",x.style.borderColor="#9b59b6",x.style.color="#9b59b6",x.style.boxShadow="0 0 12px rgba(155, 89, 182, 0.6)"):(x.classList.remove("active"),x.style.background="",x.style.borderColor="",x.style.color="",x.style.boxShadow=""))}function V(o,c="info"){let b=w("#btfw-mono-toast");b||(b=document.createElement("div"),b.id="btfw-mono-toast",b.style.cssText=`
            position: fixed;
            top: 120px;
            right: 20px;
            background: ${c==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)"};
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
          `,document.body.appendChild(b)),b.textContent=o,b.style.background=c==="success"?"rgba(155, 89, 182, 0.9)":"rgba(235, 77, 75, 0.9)",b.style.opacity="1",setTimeout(()=>{b.style.opacity="0"},2e3)}async function K(){if(await f.enableMono())y=!0,V("Stereo audio enabled","success"),q(!0);else{let c=f._hasIframeOnlyMedia()?"Mono audio requires direct video playback":"Failed to activate";V(c,"error")}}async function oe(){await f.disableMono(),y=!1,q(!1)}function Y(){let o=document.createElement("button");o.id="btfw-vo-audioboost",o.className="btn btn-sm btn-default btfw-vo-adopted";let c=Math.round(f.BOOST_MULTIPLIER*100);o.title=`Toggle Audio Boost (${c}%)`,o.setAttribute("data-btfw-overlay","1");let b=document.createElement("i");return b.className="fa fa-bullhorn",o.appendChild(b),o.addEventListener("click",()=>{f.boostEnabled?F():$()}),o.addEventListener("mouseenter",()=>{_&&(clearTimeout(_),_=null),ie()}),o.addEventListener("mouseleave",()=>{_=setTimeout(()=>re(),150)}),o}function X(){let o=document.createElement("button");o.id="btfw-vo-audionorm",o.className="btn btn-sm btn-default btfw-vo-adopted";let c=f.NORM_PRESETS[f.currentNormPreset].label;o.title=`Toggle Audio Normalization (${c})`,o.setAttribute("data-btfw-overlay","1");let b=document.createElement("i");return b.className="fa fa-sliders",o.appendChild(b),o.addEventListener("click",()=>{f.normalizationEnabled?U():D()}),o.addEventListener("mouseenter",()=>{A&&(clearTimeout(A),A=null),W()}),o.addEventListener("mouseleave",()=>{A=setTimeout(()=>G(),150)}),o}function Z(){let o=document.createElement("button");o.id="btfw-vo-mono",o.className="btn btn-sm btn-default btfw-vo-adopted",o.title="Toggle Mono Audio (mix both channels to stereo)",o.setAttribute("data-btfw-overlay","1");let c=document.createElement("i");return c.className="fa fa-headphones",o.appendChild(c),o.addEventListener("click",()=>{f.monoEnabled?oe():K()}),o}function ae(){if(v)return v;let o=document.createElement("div");return o.id="btfw-boost-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,I.forEach(c=>{let b=document.createElement("button");b.className="btfw-context-item",b.textContent=c.label,b.style.cssText=`
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
          `,f.BOOST_MULTIPLIER===c.multiplier&&(b.style.background="rgba(46, 213, 115, 0.2)",b.style.color="#2ed573"),b.addEventListener("mouseenter",()=>{f.BOOST_MULTIPLIER!==c.multiplier&&(b.style.background="rgba(109, 77, 246, 0.2)")}),b.addEventListener("mouseleave",()=>{f.BOOST_MULTIPLIER!==c.multiplier&&(b.style.background="transparent")}),b.addEventListener("click",async()=>{if(await f.setBoostMultiplier(c.multiplier),g(),T){let M=Math.round(c.multiplier*100);T.title=`Toggle Audio Boost (${M}%)`}f.boostEnabled&&B(`Boost set to ${c.label}`,"success")}),o.appendChild(b)}),o.addEventListener("mouseenter",()=>{_&&(clearTimeout(_),_=null)}),o.addEventListener("mouseleave",()=>{_=setTimeout(()=>re(),100)}),document.body.appendChild(o),v=o,o}function ie(){if(!T)return;let o=ae();p(o,T,d),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function re(){v&&(e?v.matches(":popover-open")&&v.hidePopover():v.style.display="none")}function g(){if(!v)return;v.querySelectorAll(".btfw-context-item").forEach((c,b)=>{let M=I[b];f.BOOST_MULTIPLIER===M.multiplier?(c.style.background="rgba(46, 213, 115, 0.2)",c.style.color="#2ed573"):(c.style.background="transparent",c.style.color="#e0e0e0")})}function H(){if(L)return L;let o=document.createElement("div");return o.id="btfw-norm-context-menu",e&&(o.popover="auto"),o.style.cssText=`
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
        `,Object.keys(f.NORM_PRESETS).forEach(c=>{let b=f.NORM_PRESETS[c],M=document.createElement("button");M.className="btfw-context-item",M.textContent=b.label,M.style.cssText=`
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
          `,f.currentNormPreset===c&&(M.style.background="rgba(52, 152, 219, 0.2)",M.style.color="#3498db"),M.addEventListener("mouseenter",()=>{f.currentNormPreset!==c&&(M.style.background="rgba(109, 77, 246, 0.2)")}),M.addEventListener("mouseleave",()=>{f.currentNormPreset!==c&&(M.style.background="transparent")}),M.addEventListener("click",async()=>{await f.setNormPreset(c),te(),u&&(u.title=`Toggle Audio Normalization (${b.label})`),f.normalizationEnabled&&Q(`Preset: ${b.label}`,"success")}),o.appendChild(M)}),o.addEventListener("mouseenter",()=>{A&&(clearTimeout(A),A=null)}),o.addEventListener("mouseleave",()=>{A=setTimeout(()=>G(),100)}),document.body.appendChild(o),L=o,o}function W(){if(!u)return;let o=H();p(o,u,a),e?o.matches(":popover-open")||o.showPopover():o.style.display="block"}function G(){L&&(e?L.matches(":popover-open")&&L.hidePopover():L.style.display="none")}function te(){if(!L)return;let o=L.querySelectorAll(".btfw-context-item");Object.keys(f.NORM_PRESETS).forEach((c,b)=>{let M=o[b];f.currentNormPreset===c?(M.style.background="rgba(52, 152, 219, 0.2)",M.style.color="#3498db"):(M.style.background="transparent",M.style.color="#e0e0e0")})}function J(){let o=w("#btfw-vo-left");if(!o)return!1;let c=w("#btfw-vo-audioboost");c&&c.remove();let b=w("#btfw-vo-audionorm");b&&b.remove();let M=w("#btfw-vo-mono");return M&&M.remove(),T=Y(),u=X(),x=Z(),o.appendChild(T),o.appendChild(u),o.appendChild(x),!0}function h(o,c=20){let b=c*500;he(()=>w("#btfw-vo-left")?!0:null,{timeoutMs:b}).then(()=>{J(),o()}).catch(()=>{J()&&o()})}function E(){Promise.all([he(()=>typeof videojs!="undefined"?videojs:null),me("#ytapiplayer")]).then(([o])=>{f.player=o("ytapiplayer"),f.originalSrc=f._readCurrentSrc(),f.startWatchdog()}).catch(()=>{})}function t(){setTimeout(()=>{f.resetMediaBinding(),f.boostEnabled=!1,f.normalizationEnabled=!1,f.monoEnabled=!1,f.isProxied=!1,R(!1),N(!1),q(!1),E(),O&&setTimeout(()=>{$()},1200),S&&setTimeout(()=>{D()},1200),y&&setTimeout(()=>{K()},1200)},600)}function i(){typeof socket=="undefined"||!socket.on||(socket.on("disconnect",()=>{}),socket.on("connect",()=>{setTimeout(()=>f._checkAndReapply("socket-connect"),500)}),socket.on("reconnect",()=>{setTimeout(()=>f._checkAndReapply("socket-reconnect"),500)}),socket.on("changeMedia",t))}function m(){h(()=>{E()}),i()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",m):m(),{name:"feature:audio",activate:$,deactivate:F,isActive:()=>f.boostEnabled,activateNormalization:D,deactivateNormalization:U,isNormalizationActive:()=>f.normalizationEnabled,activateMono:K,deactivateMono:oe,isMonoActive:()=>f.monoEnabled}}),BTFW.define("feature:audioboost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audio-boost",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:audionorm",["feature:audio"],async w=>w.init("feature:audio")),BTFW.define("feature:monoaudio",["feature:audio"],async w=>w.init("feature:audio"))})})();BTFW.define("feature:movie-info",["util:tmdb-proxy"],async({init:e})=>{let n=await e("util:tmdb-proxy"),d="movie-info",a={CONTAINER_ID:"btfw-movie-header",TITLE_SELECTOR:"#currenttitle",TOPBAR_SELECTOR:".btfw-chat-topbar",ENABLE_BACKDROP:!0,ENABLE_RATING:!0,SHOW_SUMMARY:!0},p="btfw-movie-info-style",s={isInitialized:!1,header:null,currentTitle:"",hideTimer:null,initTimer:null,socketRetryTimer:null,cleanup:[]},w=0,f=!1,T=null;function u(h){typeof h=="function"&&s.cleanup.push(h)}function x(){for(;s.cleanup.length;){let h=s.cleanup.pop();try{h()}catch(E){}}s.header&&(s.header.remove(),s.header=null)}function O(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null),s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null),w=0,s.currentTitle="",s.isInitialized=!1,x()}function S(h){if(typeof h=="boolean")return h;if(typeof h=="number")return Number.isFinite(h)?h>0:!1;if(typeof h=="string"){let E=h.trim().toLowerCase();return E?E==="1"||E==="true"||E==="yes"||E==="on":!1}return!1}function y(){let h=[()=>{var E,t,i;return(i=(t=(E=window.BTFW_THEME_ADMIN)==null?void 0:E.integrations)==null?void 0:t.movieInfo)==null?void 0:i.enabled},()=>{var E,t,i;return(i=(t=(E=window.BTFW_CONFIG)==null?void 0:E.integrations)==null?void 0:t.movieInfo)==null?void 0:i.enabled},()=>{var E,t;return(t=(E=window.BTFW_CONFIG)==null?void 0:E.movieInfo)==null?void 0:t.enabled},()=>{var E;return(E=window.BTFW_CONFIG)==null?void 0:E.movieInfoEnabled},()=>{var E,t;return(t=(E=document==null?void 0:document.body)==null?void 0:E.dataset)==null?void 0:t.btfwMovieInfoEnabled}];for(let E of h)try{let t=typeof E=="function"?E():E;if(S(t))return!0}catch(t){}return!1}function v(){if(T||typeof MutationObserver!="function")return;let h=document.body;h&&(T=new MutationObserver(()=>I()),T.observe(h,{attributes:!0,attributeFilter:["data-btfw-movie-info-enabled"]}))}function L(){if(f)return;f=!0;let h=()=>I();document.addEventListener("btfw:channelIntegrationsChanged",h),document.addEventListener("btfw:ready",h)}function _(h=0){s.initTimer&&(clearTimeout(s.initTimer),s.initTimer=null),s.initTimer=window.setTimeout(()=>{s.initTimer=null,y()&&A()},Math.max(0,h))}function A(){if(s.isInitialized)return;let h=document.querySelector(a.TOPBAR_SELECTOR);if(!h){_(500);return}try{R(h),te(),$(),s.isInitialized=!0,setTimeout(()=>{K(),oe()},120)}catch(E){_(800)}}function I(){y()?s.isInitialized?(K(),setTimeout(oe,80)):_(0):O()}function R(h){if(!h&&(h=document.querySelector(a.TOPBAR_SELECTOR),!h))throw new Error("Chat topbar not found");let E=document.getElementById(a.CONTAINER_ID);E&&E.remove();let t=document.createElement("div");t.id=a.CONTAINER_ID,t.className="btfw-movie-header hide",t.dataset.module=d,h.insertAdjacentElement("afterend",t),s.header=t}function B(){try{return window.socket||window.SOCKET||null}catch(h){return null}}function $(){F(),D();let h=G(K,250);window.addEventListener("resize",h),u(()=>window.removeEventListener("resize",h))}function F(){N(),Q()}function N(){let h=document.querySelector(a.TITLE_SELECTOR);if(h){let E=()=>q(),t=()=>V();h.addEventListener("mouseenter",E),h.addEventListener("mouseleave",t),u(()=>{h.removeEventListener("mouseenter",E),h.removeEventListener("mouseleave",t)})}else if(typeof MutationObserver=="function"){let E=new MutationObserver(()=>{document.querySelector(a.TITLE_SELECTOR)&&(E.disconnect(),N())});E.observe(document.body||document.documentElement,{childList:!0,subtree:!0}),u(()=>{try{E.disconnect()}catch(t){}})}}function Q(){let h=s.header;if(!h)return;let E=()=>U(),t=()=>V();h.addEventListener("mouseenter",E),h.addEventListener("mouseleave",t),u(()=>{h.removeEventListener("mouseenter",E),h.removeEventListener("mouseleave",t)})}function D(){let h=B();if(h&&typeof h.on=="function"){h.on("changeMedia",oe),u(()=>{var E,t;try{(E=h.off)==null||E.call(h,"changeMedia",oe)}catch(i){try{(t=h.removeListener)==null||t.call(h,"changeMedia",oe)}catch(m){}}});return}he(()=>{if(!y())return null;let E=B();return E&&typeof E.on=="function"?E:null},{timeoutMs:1e4}).then(E=>{s.socketRetryTimer=null,E.on("changeMedia",oe),u(()=>{var t,i;try{(t=E.off)==null||t.call(E,"changeMedia",oe)}catch(m){try{(i=E.removeListener)==null||i.call(E,"changeMedia",oe)}catch(o){}}})}).catch(()=>{s.socketRetryTimer=null}),u(()=>{s.socketRetryTimer&&(clearTimeout(s.socketRetryTimer),s.socketRetryTimer=null)})}function U(){s.hideTimer&&(clearTimeout(s.hideTimer),s.hideTimer=null)}function q(){U(),s.header&&(s.header.classList.remove("hide"),s.header.classList.add("show"))}function V(){U(),s.hideTimer=window.setTimeout(()=>{s.header&&(s.header.classList.remove("show"),s.header.classList.add("hide"),setTimeout(()=>{s.header&&s.header.classList.contains("hide")&&s.header.classList.remove("hide")},320))},300)}function K(){if(!s.header)return;let h=window.innerWidth<=768;s.header.classList.toggle("btfw-mobile",h)}async function oe(){var m;if(!s.isInitialized)return;let h=document.querySelector(a.TITLE_SELECTOR),E=s.header;if(!h||!E)return;let t=((m=h.textContent)==null?void 0:m.trim())||"";if(!t){s.currentTitle="",ie();return}if(t===s.currentTitle)return;s.currentTitle=t;let i=++w;Z();try{let o=await X(t);if(i!==w)return;g(o)}catch(o){if(i!==w)return;n.isAvailable()||console.warn("[movie-info] TMDB proxy unavailable. Deploy movies-storage worker with TMDB_API_KEY."),ae()}}function Y(h){let E=["Extended","Director's Cut","Directors Cut","Unrated","Theatrical Cut"],t=h;return E.forEach(i=>{let m=new RegExp(`\\b${i}\\b`,"gi");t=t.replace(m,"")}),t.replace(/\s{2,}/g," ").trim()}async function X(h){var c;if(!n.isAvailable())throw new Error(n.MISSING_PROXY_MSG);let E=h.match(/(.+)\s*\((\d{4})\)/),t=E?E[1].trim():h,i=E?E[2]:"";i||(E=h.match(/(.+?)\s+(\d{4})\s*$/),E&&(t=E[1].trim(),i=E[2]));let m=Y(t),o=await n.tmdbFetch("search/movie",{query:m,year:i});if(((c=o==null?void 0:o.results)==null?void 0:c.length)>0){let b=o.results[0];return{title:h,backdrop:b.backdrop_path?`https://image.tmdb.org/t/p/w1280${b.backdrop_path}`:null,poster:b.poster_path?`https://image.tmdb.org/t/p/w500${b.poster_path}`:null,summary:b.overview||"",rating:b.vote_average||0,releaseDate:b.release_date||"",voteCount:b.vote_count||0}}return{title:h,backdrop:null,poster:null,summary:"",rating:0,releaseDate:"",voteCount:0}}function Z(){if(!s.header)return;re();let h=document.createElement("div");h.className="btfw-movie-content";let E=document.createElement("div");E.className="btfw-movie-loading";let t=document.createElement("i");t.className="fa fa-spinner fa-spin";let i=document.createElement("p");i.textContent="Loading movie information...",E.append(t,i),h.appendChild(E),s.header.replaceChildren(h)}function ae(){if(!s.header)return;re();let h=document.createElement("div");h.className="btfw-movie-content";let E=document.createElement("div");E.className="btfw-movie-error";let t=document.createElement("i");t.className="fa fa-exclamation-triangle";let i=document.createElement("p");i.textContent="Unable to fetch movie information";let m=document.createElement("small");m.textContent="Check TMDB API key in Theme Settings",E.append(t,i,m),h.appendChild(E),s.header.replaceChildren(h)}function ie(){if(!s.header)return;re();let h=document.createElement("div");h.className="btfw-movie-content";let E=document.createElement("p");E.textContent="No movie information available",h.appendChild(E),s.header.replaceChildren(h)}function re(){s.header&&(s.header.style.backgroundImage="",s.header.style.backgroundColor="")}function g(h){if(!s.header)return;s.header.replaceChildren(),a.ENABLE_BACKDROP&&h.backdrop?(s.header.style.backgroundImage=`url(${h.backdrop})`,s.header.style.backgroundSize="cover",s.header.style.backgroundPosition="center"):re();let E=document.createElement("div");E.className="btfw-movie-overlay",s.header.appendChild(E);let t=document.createElement("div");if(t.className="btfw-movie-content",s.header.appendChild(t),h.poster){let o=document.createElement("img");o.src=h.poster,o.alt=`${h.title} Poster`,o.className="btfw-movie-poster",t.appendChild(o)}let i=document.createElement("div");i.className="btfw-movie-details",t.appendChild(i);let m=document.createElement("h2");if(m.textContent=h.title,m.className="btfw-movie-title",i.appendChild(m),a.SHOW_SUMMARY&&h.summary){let o=document.createElement("p");o.textContent=h.summary,o.className="btfw-movie-summary",i.appendChild(o)}if(a.ENABLE_RATING&&h.rating>0){let o=H(h.rating,h.voteCount);t.appendChild(o)}}function H(h,E){let t=document.createElement("div");t.className="btfw-movie-rating";let i=Math.round(h*10),m=W(i),o="http://www.w3.org/2000/svg",c=document.createElementNS(o,"svg");c.setAttribute("width","60"),c.setAttribute("height","60"),c.setAttribute("viewBox","0 0 60 60");let b=25,M=2*Math.PI*b,C=M-h/10*M,r=document.createElementNS(o,"circle");r.setAttribute("cx","30"),r.setAttribute("cy","30"),r.setAttribute("r",b.toString()),r.setAttribute("stroke","#2a2a2a"),r.setAttribute("stroke-width","4"),r.setAttribute("fill","#1a1a1a"),c.appendChild(r);let l=document.createElementNS(o,"circle");l.setAttribute("cx","30"),l.setAttribute("cy","30"),l.setAttribute("r",b.toString()),l.setAttribute("stroke",m),l.setAttribute("stroke-width","3"),l.setAttribute("fill","none"),l.setAttribute("stroke-dasharray",M.toString()),l.setAttribute("stroke-dashoffset",C.toString()),l.setAttribute("transform","rotate(-90 30 30)"),l.setAttribute("stroke-linecap","round"),c.appendChild(l);let k=document.createElementNS(o,"text");if(k.setAttribute("x","50%"),k.setAttribute("y","50%"),k.setAttribute("text-anchor","middle"),k.setAttribute("dominant-baseline","central"),k.setAttribute("fill","#fff"),k.setAttribute("font-size","10"),k.setAttribute("font-weight","bold"),k.textContent=`${i}%`,c.appendChild(k),t.appendChild(c),E>0){let P=document.createElement("div");P.className="btfw-movie-votes",P.textContent=`${E.toLocaleString()} votes`,t.appendChild(P)}return t}function W(h){let E=Math.max(0,Math.min(h,100));return E>=70?"#4caf50":E>=50?"#ff9800":"#f44336"}function G(h,E){let t=null;return function(...m){t&&clearTimeout(t),t=setTimeout(()=>{t=null,h(...m)},E)}}function te(){if(document.getElementById(p))return;let h=`
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
      ${a.TITLE_SELECTOR}:hover {
        color: #4fc3f7 !important;
        transition: color 0.2s ease;
      }
    `,E=document.createElement("style");E.id=p,E.textContent=h,document.head.appendChild(E)}function J(){v(),L(),I()}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",J,{once:!0}):J(),{name:"feature:movie-info",refresh:I,cleanup:O}});BTFW.define("feature:monkeyPaw",[],async()=>{let e="btfw-monkey-paw-styles",n="btfw-monkey-paw-overlay",d="/src/assets/monkey-paw/paw.svg",a={"f-pinky":{root:"rotate(85deg)",tip:"rotate(70deg)"},"f-ring":{root:"rotate(88deg)",tip:"rotate(75deg)"},"f-index":{root:"rotate(87deg)",tip:"rotate(74deg)"},"f-thumb":{root:"rotate(62deg)",tip:"rotate(38deg)"}},p={"f-pinky":0,"f-ring":90,"f-index":190,"f-thumb":300},s={"f-pinky":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-ring":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-index":{root:"rotate(0deg)",tip:"rotate(0deg)"},"f-thumb":{root:"rotate(-18deg)",tip:"rotate(0deg)"}},w=null,f=null,T=/<\s*(script|foreignobject|iframe|embed|object)\b|on\w+\s*=|(?:xlink:href|href)\s*=\s*["']?\s*(?:javascript|data):/i;function u(R){let B=String(R||"").trim();return/^<svg[\s>]/i.test(B)?!T.test(B):!1}function x(R){return new Promise(B=>setTimeout(B,R))}function O(){try{let R=typeof window!="undefined"?window.BTFW:null;return R&&(R.BASE||R.DEV_CDN)||""}catch(R){return""}}function S(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(R){return!1}}function y(){if(typeof document=="undefined"||document.getElementById(e))return;let R=document.createElement("style");R.id=e,R.textContent=`
      #${n} {
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

      #${n}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${n}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${n}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${n} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${n} .btfw-monkey-paw-title {
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

      #${n} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${n} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${n} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${n} .f-tip {
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

      #${n} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${n} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${n} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${n} .f-root,
        #${n} .f-tip,
        #${n} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `,document.head.appendChild(R)}async function v(){if(w)return w;let B=`${O()}${d}`,$=await fetch(B,{credentials:"omit"});if(!$.ok)throw new Error(`Monkey paw SVG failed to load (${$.status})`);let F=await $.text();if(!u(F))throw new Error("Monkey paw SVG failed integrity check (unexpected markup)");return w=F,w}function L(R){Object.entries(s).forEach(([B,$])=>{let F=R.querySelector(`#${B}`),N=R.querySelector(`#${B}-tip`);F&&(F.style.transform=$.root),N&&(N.style.transform=$.tip)})}function _(R){Object.entries(a).forEach(([B,$])=>{window.setTimeout(()=>{let F=R.querySelector(`#${B}`),N=R.querySelector(`#${B}-tip`);F&&(F.style.transform=$.root),N&&window.setTimeout(()=>{N.style.transform=$.tip},120)},p[B])})}function A(R){return`
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${R}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `}async function I(R={}){if(f)return f;if(typeof document!="undefined")return f=(async()=>{var Q,D;if(y(),S()){await x((Q=R.reducedMotionMs)!=null?Q:450);return}let B=document.getElementById(n);B||(B=document.createElement("div"),B.id=n,document.body.appendChild(B));let $;try{$=await v()}catch(U){console.warn("[monkey-paw] SVG load failed:",U),await x(300);return}B.innerHTML=A($),L(B);let F=B.querySelector("#paw"),N=B.querySelector("#btfw-monkey-paw-msg");B.classList.remove("is-cursed"),N==null||N.classList.remove("is-visible"),requestAnimationFrame(()=>B.classList.add("is-active")),_(B),await x(980),F==null||F.classList.add("btfw-monkey-paw-shaking"),await x(720),F==null||F.classList.remove("btfw-monkey-paw-shaking"),B.classList.add("is-cursed"),N==null||N.classList.add("is-visible"),await x((D=R.holdMs)!=null?D:1100),B.classList.remove("is-active"),await x(320),B.remove()})().finally(()=>{f=null}),f}return{name:"feature:monkeyPaw",play:I}});BTFW.define("ext:movie-suggestion",["util:tmdb-proxy","feature:monkeyPaw"],async({init:e})=>{let n=await e("util:tmdb-proxy"),d=await e("feature:monkeyPaw"),a=(g,H=document)=>H.querySelector(g),p=(g,H=document)=>Array.from(H.querySelectorAll(g)),s=null,w=null,f=null,T=null,u={query:"",page:1,totalPages:1,sortBy:"popularity.desc",genreId:"",year:"",minRating:"",loading:!1},x=null,O=null,S="[movie-suggestion]";function y(...g){console.log(S,...g)}function v(...g){console.error(S,...g)}function L(g){var H;try{if((H=window.socket)!=null&&H.emit)return window.socket.emit("chatMsg",{msg:g}),!0}catch(W){}return!1}async function _(g,H={}){return n.workerFetch(g,H)}function A(){if(document.getElementById("btfw-movie-suggest-styles"))return;let g=document.createElement("style");g.id="btfw-movie-suggest-styles",g.textContent=`
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
    `,document.head.appendChild(g)}let I=(CLIENT==null?void 0:CLIENT.rank)||0;function R(){let g=a("a[href*='donate'], #donate-btn, .donate-btn");if(g){let W=g.closest("ul");if(W)return{ul:W,insertAfter:g.parentElement}}let H=a("#btfw-theme-btn-nav");if(H){let W=H.closest("ul");if(W)return{ul:W,insertAfter:null}}return{ul:a(".navbar .nav.navbar-nav")||a(".navbar-nav")||a(".btfw-navbar ul")||a(".navbar ul"),insertAfter:null}}function B(){if(a("#btfw-movie-suggest-btn"))return!0;let g=R();if(!g.ul)return!1;let H=document.createElement("li"),W=document.createElement("a");return W.href="javascript:void(0)",W.className="btfw-nav-pill",W.id="btfw-movie-suggest-btn",W.innerHTML=`
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `,H.appendChild(W),g.insertAfter?g.insertAfter.after(H):g.ul.insertBefore(H,g.ul.firstChild),W.addEventListener("click",X),!0}function $(){var G,te,J,h,E,t;if(a("#btfw-movie-suggest-modal"))return;let g=document.createElement("div");g.id="btfw-movie-suggest-modal",g.className="modal",g.innerHTML=`
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
    `,document.body.appendChild(g);let H=a(".modal-background",g),W=a(".delete",g);if(H.addEventListener("click",Z),W.addEventListener("click",Z),(G=a("#btfw-movie-prev",g))==null||G.addEventListener("click",()=>{u.page>1&&(u.page-=1,V())}),(te=a("#btfw-movie-next",g))==null||te.addEventListener("click",()=>{u.page<u.totalPages&&(u.page+=1,V())}),I===0){let i=a("#btfw-movie-search",g);i.addEventListener("focus",()=>{alert("You need to be registered to search and suggest movies."),i.blur()})}else{let i,m=a("#btfw-movie-search",g);m.addEventListener("input",()=>{clearTimeout(i),u.query=m.value.trim(),u.page=1,i=setTimeout(()=>V(),400)}),(J=a("#btfw-movie-sort",g))==null||J.addEventListener("change",o=>{u.sortBy=o.target.value,u.page=1,V()}),(h=a("#btfw-movie-genre",g))==null||h.addEventListener("change",o=>{u.genreId=o.target.value,u.page=1,V()}),(E=a("#btfw-movie-year",g))==null||E.addEventListener("change",o=>{u.year=o.target.value.trim(),u.page=1,V()}),(t=a("#btfw-movie-rating",g))==null||t.addEventListener("change",o=>{u.minRating=o.target.value.trim(),u.page=1,V()})}}function F(){if(a("#btfw-movie-confirm-modal"))return;let g=document.createElement("div");g.id="btfw-movie-confirm-modal",g.className="modal",g.innerHTML=`
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
    `,document.body.appendChild(g);let H=a(".modal-background",g),W=a(".delete",g),G=a("#btfw-movie-cancel",g),te=a("#btfw-movie-confirm",g),J=()=>Y();H.addEventListener("click",J),W.addEventListener("click",J),G.addEventListener("click",J),te.addEventListener("click",ie)}async function N(){if(x&&O)return;let[g,H]=await Promise.all([_("/api/meta"),_("/api/genres")]);x=g,O=H;let W=a("#btfw-movie-suggest-modal");if(!W)return;let G=a("#btfw-movie-sort",W);if(G&&G.options.length===0){for(let J of g.sortOptions||[]){let h=document.createElement("option");h.value=J.value,h.textContent=J.label,G.appendChild(h)}G.value=u.sortBy}let te=a("#btfw-movie-genre",W);if(te&&te.options.length<=1)for(let J of H.genres||[]){let h=document.createElement("option");h.value=String(J.id),h.textContent=J.name,te.appendChild(h)}}function Q(){let g={page:u.page,sort_by:u.sortBy};return u.query?(g.query=u.query,u.year&&(g.primary_release_year=u.year,g.year=u.year)):(u.genreId&&(g.with_genres=u.genreId),u.year&&(g.primary_release_year=u.year),u.minRating&&(g["vote_average.gte"]=u.minRating)),g}function D(g){return!g||g==="null"?"https://via.placeholder.com/154x231?text=No+Image":`https://image.tmdb.org/t/p/w154${g}`}function U(){let g=a("#btfw-movie-suggest-modal");if(!g)return;let H=a("#btfw-movie-prev",g),W=a("#btfw-movie-next",g),G=a("#btfw-movie-page-label",g);G&&(G.textContent=`Page ${u.page} of ${u.totalPages}`),H&&(H.disabled=u.page<=1||u.loading),W&&(W.disabled=u.page>=u.totalPages||u.loading)}function q(g){let H=a("#btfw-movie-suggest-modal");if(!H)return;let W=a(".btfw-movie-results",H);if(!g.length){W.innerHTML='<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>';return}W.innerHTML=g.map(G=>`
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
    `).join(""),p(".movie-result",W).forEach(G=>{G.addEventListener("click",()=>{s=G.dataset.id,w=G.dataset.title,f=G.dataset.poster,T=G.dataset.year||null;let te=a("#btfw-movie-confirm-modal");if(!te)return;let J=T?` (${T})`:"";a("#btfw-confirm-movie-title",te).textContent=`${w}${J}`,oe()})})}async function V(){let g=a("#btfw-movie-suggest-modal");if(!g||u.loading)return;u.loading=!0,U();let H=a(".btfw-movie-results",g);H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Searching\u2026</p>';try{await N();let W=await _("/api/search",{params:Q()});u.totalPages=Math.max(1,W.totalPages||1),q(W.results||[]),y("runSearch",{page:u.page,totalPages:u.totalPages,count:(W.results||[]).length})}catch(W){v("runSearch failed:",W),H.innerHTML='<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>'}finally{u.loading=!1,U()}}async function K(){let g=a("#btfw-movie-history");if(g){g.innerHTML='<p style="opacity:0.75;">Loading\u2026</p>';try{let W=(await _("/api/history",{params:{page:1,limit:10}})).results||[];if(!W.length){g.innerHTML='<p style="opacity:0.75;">No requests yet.</p>';return}g.innerHTML=W.map(G=>{let te=G.releaseYear?` (${se(G.releaseYear)})`:"";return`
          <div class="history-item">
            <img src="${se(D(G.posterPath).replace("w154","w92"))}" alt="${se(G.movieTitle)}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${se(G.movieTitle)}${te}</div>
              <div class="history-item__meta">Requested by ${se(G.username)}</div>
            </div>
          </div>
        `}).join("")}catch(H){v("loadHistory failed:",H),g.innerHTML='<p style="opacity:0.75;">Could not load recent requests.</p>'}}}function oe(){let g=a("#btfw-movie-suggest-modal"),H=a("#btfw-movie-confirm-modal");H&&(g&&g.classList.add("btfw-movie-suggest-pending"),H.classList.add("is-active"))}function Y(){let g=a("#btfw-movie-suggest-modal"),H=a("#btfw-movie-confirm-modal");g&&g.classList.remove("btfw-movie-suggest-pending"),H&&H.classList.remove("is-active")}async function X(){let g=a("#btfw-movie-suggest-modal");if(g){y("openModal",{userRank:I}),g.classList.remove("btfw-movie-suggest-pending"),g.classList.add("is-active");try{await N(),await Promise.all([V(),K()])}catch(H){v("openModal bootstrap failed:",H)}}}function Z(){let g=a("#btfw-movie-suggest-modal");g&&(Y(),y("closeModal"),g.classList.remove("is-active"),a("#btfw-movie-search",g).value="",a(".btfw-movie-results",g).innerHTML="",u.query="",u.page=1,u.totalPages=1,s=null,w=null,f=null,T=null)}function ae(g,H,W){let G=W?` (${W})`:"";return`\u{1F3AC} Movie request: ${H}${G} \u2014 suggested by ${g}`}async function ie(){if(!s||!w)return;let g=(CLIENT==null?void 0:CLIENT.name)||"Anonymous";y("confirmSuggestion",{movieId:s,movieTitle:w}),Y();try{await d.play(),await _("/api/suggestions",{method:"POST",body:{movieId:Number(s),movieTitle:w,username:g,posterPath:f||null,releaseYear:T||null}}),L(ae(g,w,T)),await K(),Z()}catch(H){v("confirmSuggestion failed:",H),alert("Could not save your movie request. Please try again.")}}function re(){y("boot: start",{workerBase:n.getWorkerBase()}),A(),$(),F(),me(".navbar, .navbar-nav, #nav-collapsible",{timeoutMs:5e3}).catch(()=>{}).then(()=>{B()?y("Button added successfully"):console.warn(S,"Failed to add nav button")})}return document.addEventListener("btfw:layoutReady",()=>{setTimeout(re,100)}),document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(re,200)}):setTimeout(re,200),{name:"ext:movie-suggestion",open:X,close:Z,getWorkerBase:n.getWorkerBase}});BTFW.define("feature:movie-suggestions",["ext:movie-suggestion"],async e=>e.init("ext:movie-suggestion"));})();
