BTFW.define("feature:chat-commands", ["util:tmdb-proxy", "util:tmdb-card", "util:chatAutoscroll"], async ({ init }) => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const motion = await BTFW.init("util:motion");
  const tmdb = await init("util:tmdb-proxy");
  const tmdbCard = await init("util:tmdb-card");
  const chatAutoscroll = await init("util:chatAutoscroll");
  const now = ()=>Date.now();

  function sendChat(msg){
    try { if (window.socket?.emit) { socket.emit("chatMsg", { msg }); return true; } } catch(_) {}
    return false;
  }
  function sysLocal(text){
    const buf = $("#messagebuffer"); if (!buf) return;
    const d = document.createElement("div");
    d.className = "server-msg btfw-cmd";
    d.textContent = text;
    buf.appendChild(d);
    if (chatAutoscroll.shouldAutoScroll()) {
      buf.scrollTop = buf.scrollHeight;
    }
  }
  function getUser(){ try { return (window.CLIENT && CLIENT.name) ? CLIENT.name : ""; } catch(_) { return ""; } }
  function getRank(){ try { return (window.CLIENT && (CLIENT.rank|0)) || 0; } catch(_) { return 0; } }
  function hasRank(min){ return getRank() >= min; }
  function clamp(n,a,b){ return Math.min(b, Math.max(a, n)); }
  function norm(s){ return String(s||"").toLowerCase().replace(/['".,;:!?()[\]{}]/g,"").replace(/\s+/g," ").trim(); }
  function formatPlaybackTime(totalSeconds) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

function parseTmdbRef(args){
  const parts = args.map(a => String(a).toLowerCase());
  let mediaType = "movie";
  if (parts[0] === "movie" || parts[0] === "tv") mediaType = parts.shift();
  if (parts.length !== 1 || !/^\d+$/.test(parts[0])) return null;
  return { mediaType, id: parts[0] };
}

async function fetchTMDBSummary({ mediaType, id }){
  if (!tmdbCard.isAvailable()) return tmdbCard.MISSING_PROXY_MSG;
  try {
    const media = await tmdbCard.fetchMedia(mediaType, id);
    return tmdbCard.formatCardTag(media);
  } catch(e){
    console.error('[summary] TMDB error', e);
    return `TMDB error: ${e.message||e}`;
  }
}
async function fetchTMDBCast({ mediaType, id }){
  if (!tmdb.isAvailable()) return tmdb.MISSING_PROXY_MSG;

  try {
    const creditsData = await tmdb.tmdbFetch(`${mediaType}/${id}/credits`, {});

    const cast = creditsData.cast || [];
    if (!cast.length) return 'No cast information available.';

    const top8 = cast.slice(0, 8);
    const castList = top8.map(actor => {
      const character = actor.character ? ` (${actor.character})` : '';
      return `${actor.name}${character}`;
    }).join(', ');

    return `col:#87ceeb:Cast: ${castList}`;
  } catch(e){
    console.error('[cast] TMDB error', e);
    return `TMDB error: ${e.message||e}`;
  }
}
  function getChannelEmotes(){
    try {
      if (window.CHANNEL?.emotes) {
        const em = CHANNEL.emotes;
        if (Array.isArray(em)) return em.map(x => x.name || x);
        if (typeof em === 'object') return Object.keys(em);
      }
    } catch(_) {}
    const els = $$("#emotelist img, #emotelist .emote");
    if (els.length) return els.map(el => el.getAttribute('title') || el.getAttribute('alt') || el.dataset?.name).filter(Boolean);
    return [];
  }

  function emitVoteSkip(){ try { socket.emit("voteskip"); } catch(_) {} }
  function emitQueueAdd(url){
    try {
      if (typeof window.parseMediaLink === "function") {
        const parsed = parseMediaLink(url);
        if (!parsed) return "Couldn’t parse media link.";
        socket.emit("queue", { id: parsed.id, type: parsed.type, pos: "end", ttl: parsed.title || url });
        return null;
      }
      socket.emit("queue", { id: url, type: "url", pos: "end", ttl: url });
      return null;
    } catch(e){ return "Queue add failed."; }
  }
  const REG = new Map();
  function addCommand(name, handler, {desc="", usage="", cooldownMs=800, aliases=[]}={}){
    REG.set(name, {name, handler, desc, usage, cooldownMs, last:0, aliases});
    aliases.forEach(a => REG.set(a, REG.get(name)));
  }
  function listPrimary(){ return Array.from(new Set(Array.from(REG.values()).map(c=>c.name))).sort(); }
  function parseCommand(text){
    if (!text || text.length<2) return null;
    if (text[0] !== "!") return null;
    const parts = text.slice(1).trim().split(/\s+/);
    const name = (parts.shift()||"").toLowerCase();
    return { name, args: parts, raw: text };
  }

  addCommand("help", ()=> `Commands: ${listPrimary().map(n=>"!"+n).join(", ")}  —  Click the “?” button below chat for details.`, { desc:"List commands", usage:"!help" });

  addCommand("summary", async (ctx)=>{
  const ref = parseTmdbRef(ctx.args);
  if (!ref) return "Usage: !summary <tmdb id>  or  !summary tv <tmdb id>";
  const out = await fetchTMDBSummary(ref);
  sendChat(out);
  return "";
}, { desc:"TMDB summary by TMDB id (movie by default)", usage:"!summary [tv] <tmdb id>" });
addCommand("cast", async (ctx)=>{
  const ref = parseTmdbRef(ctx.args);
  if (!ref) return "Usage: !cast <tmdb id>  or  !cast tv <tmdb id>";
  const out = await fetchTMDBCast(ref);
  sendChat(out);
  return "";
}, { desc:"Show cast by TMDB id (movie by default)", usage:"!cast [tv] <tmdb id>" });
  
  addCommand("time", async () => {
    const sg = await BTFW.init("feature:syncGuard");
    const seconds = await sg.getPlayerTime();
    if (seconds == null) {
      sysLocal("No active playback.");
      return "";
    }
    sendChat(`[${formatPlaybackTime(seconds)}]`);
    return "";
  }, { desc: "Playback position", usage: "!time" });
  addCommand("skip",  ()=>{ if (!hasRank(2)) return "You lack permission to voteskip."; emitVoteSkip(); return ""; }, { desc:"Vote skip", usage:"!skip" });
  addCommand("add",   (ctx)=>{ if (!hasRank(2)) return "You lack permission to add."; const url=ctx.args.join(" ").trim(); if (!url) return "Usage: !add <url>"; const e=emitQueueAdd(url); return e||""; }, { desc:"Queue URL", usage:"!add <url>" });
  addCommand("sm",    ()=>{ const em=getChannelEmotes(); if (!em.length) return "No channel emotes found."; sendChat(em[Math.floor(Math.random()*em.length)]); return ""; }, { desc:"Random channel emote", usage:"!sm" });

  function onEnterIntercept(e){
    try {
      const input = e.currentTarget; if (!input) return;
      if (e.key === "Enter" && !e.shiftKey) {
        const text = input.value.trim();
        const parsed = parseCommand(text);
        if (!parsed) return; // normal message
        const cmd = REG.get(parsed.name);
        if (!cmd) return;
        const t = now();
        if (t - cmd.last < (cmd.cooldownMs||800)) { e.preventDefault(); sysLocal("Command is on cooldown…"); return; }
        cmd.last = t;
        e.preventDefault();
        const ctx = { args: parsed.args, raw: parsed.raw, user: getUser() };
        const res = cmd.handler(ctx);
        if (res instanceof Promise) {
          res.then(msg => { if (typeof msg === "string" && msg) sendChat(msg); })
             .catch(err => sysLocal(String(err)));
        } else if (typeof res === "string" && res) {
          sendChat(res);
        }
        input.value = "";
      }
    } catch(_) {}
  }
  function buildCommandsTable(){
    const content = document.createElement("div");
    content.className = "content";
    const intro = document.createElement("p");
    intro.textContent = "Type these in chat. Some require moderator permissions.";
    const tableWrap = document.createElement("div");
    tableWrap.className = "table-container";
    const table = document.createElement("table");
    table.className = "table is-fullwidth is-narrow";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Command", "Description", "Usage"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    const tbody = document.createElement("tbody");
    listPrimary().forEach((name) => {
      const c = REG.get(name);
      const desc  = c?.desc || "";
      const usage = c?.usage || ("!"+name);
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const nameCode = document.createElement("code");
      nameCode.textContent = "!" + name;
      nameCell.appendChild(nameCode);
      const descCell = document.createElement("td");
      descCell.textContent = desc;
      const usageCell = document.createElement("td");
      const usageCode = document.createElement("code");
      usageCode.textContent = usage;
      usageCell.appendChild(usageCode);
      row.append(nameCell, descCell, usageCell);
      tbody.appendChild(row);
    });
    table.append(thead, tbody);
    tableWrap.appendChild(table);
    content.append(intro, tableWrap);
    return content;
  }
  function ensureCommandsModal(){
    let m = $("#btfw-cmds-modal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "btfw-cmds-modal";
    m.className = "modal";
    m.dataset.btfwModalState = "closed";
    m.setAttribute("hidden", "");
    m.setAttribute("aria-hidden", "true");

    const background = document.createElement("div");
    background.className = "modal-background";

    const card = document.createElement("div");
    card.className = "modal-card btfw-modal";

    const header = document.createElement("header");
    header.className = "modal-card-head";
    const title = document.createElement("p");
    title.className = "modal-card-title";
    title.textContent = "Chat Commands";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.setAttribute("aria-label", "close");
    header.append(title, deleteBtn);

    const body = document.createElement("section");
    body.className = "modal-card-body";
    body.appendChild(buildCommandsTable());

    const footer = document.createElement("footer");
    footer.className = "modal-card-foot";
    const closeBtn = document.createElement("button");
    closeBtn.className = "button is-link";
    closeBtn.id = "btfw-cmds-close";
    closeBtn.textContent = "Close";
    footer.appendChild(closeBtn);

    card.append(header, body, footer);
    m.append(background, card);

    document.body.appendChild(m);
    const dismiss = () => motion.closeModal(m);
    $(".modal-background", m).addEventListener("click", dismiss);
    $(".delete", m).addEventListener("click", dismiss);
    $("#btfw-cmds-close", m).addEventListener("click", dismiss);
    return m;
  }
  function openCommandsModal(){
    const m = ensureCommandsModal();
    const body = m.querySelector(".modal-card-body");
    if (body) body.replaceChildren(buildCommandsTable());
    motion.openModal(m);
  }

  function injectCommandsButton(into){
    if (!into || into._btfwCmdBtn) return false;
    const btn = document.createElement("button");
    btn.id = "btfw-chatcmds-btn";
    btn.className = "button is-dark is-small btfw-chatbtn";
    const iconSlot = document.createElement("span");
    iconSlot.dataset.btfwIconSlot = "chat-commands-help";
    iconSlot.setAttribute("aria-hidden", "true");
    const icon = document.createElement("i");
    icon.className = "fa fa-question-circle";
    iconSlot.appendChild(icon);
    btn.appendChild(iconSlot);
    btn.title = "Commands";
    btn.addEventListener("click", (e)=>{ e.preventDefault(); openCommandsModal(); });
    into.appendChild(btn);
    into._btfwCmdBtn = true;
    return true;
  }

  function ensureCommandsButton(){
    let placed = false;
    const bottom = $("#btfw-chat-bottombar"); if (bottom) placed = injectCommandsButton(bottom);
    if (!placed) { const top = $("#btfw-chat-topbar"); if (top) placed = injectCommandsButton(top); }
    if (!placed) {
      const wrap = $("#chatwrap");
      if (wrap && !$("#btfw-chatcmds-float")) {
        const f = document.createElement("div");
        f.id = "btfw-chatcmds-float";
        f.style.position = "absolute"; f.style.right = "8px"; f.style.bottom = "42px"; f.style.zIndex = "1100";
        wrap.appendChild(f);
        injectCommandsButton(f);
      }
    }
  }

  function watchBars(){
    const root = document.body;
    const mo = new MutationObserver(()=>{
      if ($("#btfw-chat-bottombar") || $("#btfw-chat-topbar")) {
        ensureCommandsButton();
      }
    });
    mo.observe(root, { childList:true, subtree:true });
  }

  function boot(){
    const input = $("#chatline");
    if (input && !input._btfwCmds) { input._btfwCmds = true; input.addEventListener("keydown", onEnterIntercept, true); }
    ensureCommandsButton();
    watchBars();
  }

  document.addEventListener("btfw:layoutReady", ()=> setTimeout(boot,0));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:chat-commands" };
});







