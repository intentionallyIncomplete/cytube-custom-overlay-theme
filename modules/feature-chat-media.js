BTFW.define("feature:chatMedia", [], async () => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  const LS_SIZE = "btfw:chat:emoteSize";
  const LS_AUTO = "btfw:chat:gifAutoplay"; // "1" | "0"
  const LS_HOVER_MAGNIFY = "btfw:chat:imageHoverMagnify"; // "1" | "0"
  const SIZE_PX = { sm: 100, md: 130, lg: 170 };
  const SEL = "#messagebuffer img.giphy.chat-picture, #messagebuffer img.klipy.chat-picture";

  function getSize(){ try { return localStorage.getItem(LS_SIZE) || "md"; } catch(_) { return "md"; } }
  function setSize(v){
    if (!SIZE_PX[v]) v = "md";
    try { localStorage.setItem(LS_SIZE, v); } catch(_){}
    applySize(v);
  }
  function getAutoplay(){ try { return localStorage.getItem(LS_AUTO) ?? "1"; } catch(_) { return "1"; } }
  function setAutoplay(on){
    try { localStorage.setItem(LS_AUTO, on ? "1" : "0"); } catch(_){}
    applyAutoplay();
  }
  function getHoverMagnify(){ try { return localStorage.getItem(LS_HOVER_MAGNIFY) ?? "0"; } catch(_) { return "0"; } }
  function setHoverMagnify(on){
    try { localStorage.setItem(LS_HOVER_MAGNIFY, on ? "1" : "0"); } catch(_){}
    applyHoverMagnify(on);
  }

  function applyHoverMagnify(on){
    if (on) {
      document.documentElement.dataset.btfwChatHoverMagnify = "1";
    } else {
      delete document.documentElement.dataset.btfwChatHoverMagnify;
    }
  }

  function applySize(mode){
    const px = SIZE_PX[mode] || SIZE_PX.md;
    document.documentElement.style.setProperty("--btfw-emote-size", px + "px");
  }

  const isGiphy = (img)=> img.classList.contains("giphy") || /media\d\.giphy\.com\/media\/.+\/.+\.gif/i.test(img.src);
  const toAnimated = (src)=> src
    .replace(/\/giphy_s\.gif$/i, "/giphy.gif")
    .replace(/\/200_s\.gif$/i, "/giphy.gif")
    .replace(/\/200\.gif$/i, "/giphy.gif");
  const toStatic = (src)=> src
    .replace(/\/giphy\.gif$/i, "/giphy_s.gif")
    .replace(/\/200\.gif$/i, "/giphy_s.gif");

  function setSrcIfDifferent(img, next){
    if (next && img.src !== next) img.src = next;
  }

  function clearGifSizeCaps(img){
    if (img.hasAttribute("width"))  img.removeAttribute("width");
    if (img.hasAttribute("height")) img.removeAttribute("height");
    img.style.removeProperty("max-width");
    img.style.removeProperty("max-height");
    img.style.setProperty("width", "auto", "important");
    img.style.setProperty("height", "auto", "important");
  }

  function wireOne(img){
    clearGifSizeCaps(img);

    if (!img._btfwWired) {
      img._btfwWired = true;
    }

    const auto = getAutoplay() === "1";
    if (isGiphy(img)) {
      if (auto) {
        setSrcIfDifferent(img, toAnimated(img.src));
        img.onmouseenter = null;
        img.onmouseleave = null;
      } else {
        setSrcIfDifferent(img, toStatic(img.src));
        img.onmouseenter = () => { setSrcIfDifferent(img, toAnimated(img.src)); };
        img.onmouseleave = () => { setSrcIfDifferent(img, toStatic(img.src));   };
      }
    }
  }

  function processNode(node){
    if (!node) return;
    const direct = (node.matches && node.matches(SEL)) ? [node] : [];
    const list = direct.length ? direct : (node.querySelectorAll ? node.querySelectorAll(SEL) : []);
    list.forEach(wireOne);
  }

  function applyAutoplay(){
    $$(SEL).forEach(wireOne);
  }

  function boot(){
    const buf = $("#messagebuffer");
    if (buf) processNode(buf);

    if (buf && !buf._btfwMediaMO){
      const mo = new MutationObserver(muts=>{
        for (const m of muts) {
          if (m.type === "childList" && m.addedNodes) {
            m.addedNodes.forEach(n => { if (n.nodeType===1) processNode(n); });
          }
        }
      });
      mo.observe(buf, { childList:true, subtree:true });
      buf._btfwMediaMO = mo;
    }

    applySize(getSize());
    applyAutoplay();
    applyHoverMagnify(getHoverMagnify() === "1");

    document.addEventListener("btfw:chat:imageHoverMagnifyChanged", (event) => {
      const enabled = !!(event?.detail?.enabled);
      setHoverMagnify(enabled);
    });
    document.addEventListener("btfw:themeSettings:apply", (event) => {
      const values = event?.detail?.values;
      if (!values || typeof values.imageHoverMagnify !== "boolean") return;
      applyHoverMagnify(values.imageHoverMagnify);
    });

    console.log("[BTFW] chatMedia ready (runtime sizing)");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return {
    name:"feature:chatMedia",
    setEmoteSize: setSize,
    getEmoteSize: getSize,
    setGifAutoplayOn: setAutoplay,
    getGifAutoplayOn: ()=> getAutoplay()==="1",
    setImageHoverMagnify: setHoverMagnify,
    getImageHoverMagnify: ()=> getHoverMagnify()==="1"
  };
});
