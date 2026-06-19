BTFW.define("feature:chat-commands", [], async () => {
  const $  = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const motion = await BTFW.init("util:motion");
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
    buf.scrollTop = buf.scrollHeight;
  }
  function getUser(){ try { return (window.CLIENT && CLIENT.name) ? CLIENT.name : ""; } catch(_) { return ""; } }
  function getRank(){ try { return (window.CLIENT && (CLIENT.rank|0)) || 0; } catch(_) { return 0; } }
  function hasRank(min){ return getRank() >= min; }
  function clamp(n,a,b){ return Math.min(b, Math.max(a, n)); }
  function norm(s){ return String(s||"").toLowerCase().replace(/['".,;:!?()\[\]{}]/g,"").replace(/\s+/g," ").trim(); }
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

function getCurrentTitle(){
  const ct = document.getElementById('currenttitle') || document.querySelector('.currenttitle');
  let t = (ct?.textContent || "").trim();
  t = t.replace(/^\s*(?:currently|now)\s*playing\s*[:\-]\s*/i, "").trim();
  return t;
}

  function getTMDBKey(){
    try {
      const cfg = (window.BTFW_CONFIG && typeof window.BTFW_CONFIG === "object") ? window.BTFW_CONFIG : {};
      const tmdbObj = (cfg.tmdb && typeof cfg.tmdb === "object") ? cfg.tmdb : {};
      const cfgKey = typeof tmdbObj.apiKey === "string" ? tmdbObj.apiKey.trim() : "";
      const legacyCfg = typeof cfg.tmdbKey === "string" ? cfg.tmdbKey.trim() : "";
      let lsKey = "";
      try { lsKey = (localStorage.getItem("btfw:tmdb:key") || "").trim(); }
      catch(_) {}
      const g  = v => (v==null ? "" : String(v)).trim();
      const globalKey = g(window.TMDB_API_KEY) || g(window.BTFW_TMDB_KEY) || g(window.tmdb_key);
      const bodyKey = (document.body?.dataset?.tmdbKey || "").trim();
      const key = cfgKey || legacyCfg || lsKey || globalKey || bodyKey;
      return key || null;
    } catch(_) { return null; }
  }
async function fetchTMDBSummary(title){
  const key = getTMDBKey();
  if (!key) return 'TMDB key missing. Open Theme Settings → General → Integrations to add your TMDB API key, or set one of:\nwindow.BTFW_CONFIG.tmdb = { apiKey: "KEY" };\nlocalStorage.setItem("btfw:tmdb:key","KEY");\nwindow.tmdb_key = "KEY";';
  
  try {
    const imdbMatch = /^tt\d+$/.test(title.trim());
    let r;
    
    if (imdbMatch) {
      const url = `https://api.themoviedb.org/3/find/${encodeURIComponent(title.trim())}?api_key=${key}&external_source=imdb_id`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      r = (data.movie_results||[])[0] || (data.tv_results||[])[0];
    } else {
      const yearMatch = title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : '';
      let cleanTitle = title;
      
      if (year) {
        cleanTitle = title.replace(/\s*\(?\s*(19|20)\d{2}\s*\)?\s*/g, ' ').trim();
      }
      
      const q = encodeURIComponent(cleanTitle);
      
      if (year) {
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${q}&primary_release_year=${year}&include_adult=false&language=en-US`;
        const movieRes = await fetch(movieUrl);
        if (movieRes.ok) {
          const movieData = await movieRes.json();
          if (movieData.results && movieData.results.length > 0) {
            r = movieData.results[0];
            r.media_type = 'movie';
          }
        }
      }
      
      if (!r && year) {
        const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${q}&first_air_date_year=${year}&include_adult=false&language=en-US`;
        const tvRes = await fetch(tvUrl);
        if (tvRes.ok) {
          const tvData = await tvRes.json();
          if (tvData.results && tvData.results.length > 0) {
            r = tvData.results[0];
            r.media_type = 'tv';
          }
        }
      }
      
      if (!r) {
        const multiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${q}&include_adult=false&language=en-US`;
        const res = await fetch(multiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        r = (data.results||[])[0];
      }
    }
    
    if (!r) return 'No TMDB result.';
    
    const mediaType = r.media_type || (r.title ? 'movie' : 'tv');
    const name = r.title || r.name || title;
    const year = (r.release_date || r.first_air_date || '').slice(0,4);
    const rating = (typeof r.vote_average === "number") ? r.vote_average.toFixed(1) : 'n/a';
    let overview = r.overview || '';
    
    if (!overview && r.id) {
      const detailsUrl = `https://api.themoviedb.org/3/${mediaType}/${r.id}?api_key=${key}&language=en-US`;
      const dres = await fetch(detailsUrl);
      if (dres.ok) { const det = await dres.json(); overview = det.overview || ''; }
    }
    
    if (!overview) overview = 'No summary available.';
    
if (overview.length > 150) {
  overview = overview.substring(0, 147) + '...';
}
    
overview = overview.replace(/\|/g, '&#124;');
    
    const posterPath = r.poster_path || '';
    
    return `[tmdbcard]${name}|${year}|${rating}|${overview}|${posterPath}[/tmdbcard]`;
  } catch(e){ 
    console.error('[summary] TMDB error', e); 
    return `TMDB error: ${e.message||e}`; 
  }
}
async function fetchTMDBCast(title){
  const key = getTMDBKey();
  if (!key) return 'TMDB key missing. Configure your API key first.';
  
  try {
    const imdbMatch = /^tt\d+$/.test(title.trim());
    let movieId, mediaType = 'movie';
    
    if (imdbMatch) {
      const url = `https://api.themoviedb.org/3/find/${encodeURIComponent(title.trim())}?api_key=${key}&external_source=imdb_id`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const r = (data.movie_results||[])[0] || (data.tv_results||[])[0];
      if (!r) return 'No TMDB result.';
      movieId = r.id;
      mediaType = r.media_type || (data.movie_results?.[0] ? 'movie' : 'tv');
    } else {
      const yearMatch = title.match(/\b(19|20)\d{2}\b/);
      const year = yearMatch ? yearMatch[0] : '';
      let cleanTitle = title;
      
      if (year) {
        cleanTitle = title.replace(/\s*\(?\s*(19|20)\d{2}\s*\)?\s*/g, ' ').trim();
      }
      
      const q = encodeURIComponent(cleanTitle);
      let r;
      
      if (year) {
        const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${q}&primary_release_year=${year}&include_adult=false&language=en-US`;
        const movieRes = await fetch(movieUrl);
        if (movieRes.ok) {
          const movieData = await movieRes.json();
          if (movieData.results && movieData.results.length > 0) {
            r = movieData.results[0];
            mediaType = 'movie';
          }
        }
      }
      
      if (!r && year) {
        const tvUrl = `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${q}&first_air_date_year=${year}&include_adult=false&language=en-US`;
        const tvRes = await fetch(tvUrl);
        if (tvRes.ok) {
          const tvData = await tvRes.json();
          if (tvData.results && tvData.results.length > 0) {
            r = tvData.results[0];
            mediaType = 'tv';
          }
        }
      }
      
      if (!r) {
        const multiUrl = `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${q}&include_adult=false&language=en-US`;
        const res = await fetch(multiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        r = (data.results||[])[0];
        if (r) mediaType = r.media_type || (r.title ? 'movie' : 'tv');
      }
      
      if (!r) return 'No TMDB result.';
      movieId = r.id;
    }
    
    const creditsUrl = `https://api.themoviedb.org/3/${mediaType}/${movieId}/credits?api_key=${key}`;
    const creditsRes = await fetch(creditsUrl);
    if (!creditsRes.ok) throw new Error(`HTTP ${creditsRes.status}`);
    const creditsData = await creditsRes.json();
    
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
  function emitPlayNext(){ try { socket.emit("playNext"); } catch(_) {} }
  function emitBumpLastAfterCurrent(){
    try {
      const items = $$("#queue .queue_entry");
      if (items.length < 2) return "Not enough items to bump.";
      const active = $("#queue .queue_active"); if (!active) return "No active item found.";
      const last = items[items.length-1];
      const fromUid = last.getAttribute("data-uid") || last.dataset?.uid;
      const afterUid = active.getAttribute("data-uid") || active.dataset?.uid;
      if (!fromUid || !afterUid) return "Missing media UID.";
      socket.emit("moveMedia", { from: fromUid, after: afterUid });
      return null;
    } catch(e){ return "Bump failed."; }
  }
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
function canonicalizeYearSuffix(value){
  const input = String(value || "").trim();
  if (!input) return "";
  if (/\(\s*(?:19|20)\d{2}\s*\)\s*$/.test(input)) return input;

  const match = /(?:^|[\s,;:|/-])((?:19|20)\d{2})\s*$/.exec(input);
  if (!match) return input;

  const year = match[1];
  const basePart = input
    .slice(0, match.index)
    .replace(/[\s,;:|/-]+$/, "")
    .trim();

  if (!basePart) return input;

  return `${basePart} (${year})`;
}

function sanitizeTitleForSearch(t){
  if (!t) return "";
  let s = " " + t + " ";

  s = s.replace(/\[[^\]]*\]/g, " ");
  s = s.replace(/\(([^)]*)\)/g, (m, inner) => /^\s*\d{4}\s*$/.test(inner) ? m : " ");

  s = s.replace(/\b(?:official\s*trailer|trailer|teaser|lyrics|mv|amv|full\s*episode|episode\s*\d+|season\s*\d+)\b/gi, " ");
  s = s.replace(/\b(?:\d{3,4}p|[48]k|hdr|dolby(?:\s+vision)?|remaster|extended|uncut|subbed|dubbed)\b/gi, " ");

  s = s.replace(/\s{2,}/g, " ").trim();

  const split = s.split(/\s[-–|:]\s/);
  if (split.length > 1 && split[0].length >= 3) s = split[0].trim();

  s = canonicalizeYearSuffix(s);

  return s || t;
}
  const REG = new Map();
  function addCommand(name, handler, {desc="", usage="", cooldownMs=800, aliases=[]}={}){
    REG.set(name, {name, handler, desc, usage, cooldownMs, last:0, aliases});
    aliases.forEach(a => REG.set(a, REG.get(name)));
  }
  function listPrimary(){ return Array.from(new Set(Array.from(REG.values()).map(c=>c.name))).sort(); }
  function parseCommand(text){
    if (!text || text.length<2) return null;
    if (text.startsWith("/me ")) return { name:"/me", args:[text.slice(4)] };
    if (text[0] !== "!") return null;
    const parts = text.slice(1).trim().split(/\s+/);
    const name = (parts.shift()||"").toLowerCase();
    return { name, args: parts, raw: text };
  }

  addCommand("help", ()=> `Commands: ${listPrimary().map(n=>"!"+n).join(", ")}  —  Click the “?” button below chat for details.`, { desc:"List commands", usage:"!help" });

  addCommand("summary", async (ctx)=>{
  const raw = ctx.args.length ? ctx.args.join(" ") : getCurrentTitle();
  if (!raw) return "No current title, try: !summary <title>";
  const q = sanitizeTitleForSearch(raw);
  const out = await fetchTMDBSummary(q);
  sendChat(out);
  return "";
}, { desc:"TMDB summary for current or given title", usage:"!summary [title]" });
addCommand("cast", async (ctx)=>{
  const raw = ctx.args.length ? ctx.args.join(" ") : getCurrentTitle();
  if (!raw) return "No current title, try: !cast <title>";
  const q = sanitizeTitleForSearch(raw);
  const out = await fetchTMDBCast(q);
  sendChat(out);
  return "";
}, { desc:"Show cast for current or given title", usage:"!cast [title]" });
  
  addCommand("pick",  (ctx)=>{ const raw=ctx.args.join(" "); const parts=raw.split(/[,|]/).map(s=>s.trim()).filter(Boolean); if (parts.length<2) return "Usage: !pick a, b, c"; sendChat(`🎯 I choose: ${parts[Math.floor(Math.random()*parts.length)]}`); return ""; }, { desc:"Pick randomly", usage:"!pick a, b, c" });
  addCommand("ask",   ()=>{ const a=["Yes.","No.","Maybe.","Probably.","Probably not.","Absolutely.","Definitely not.","Ask again later."]; sendChat(a[Math.floor(Math.random()*a.length)]); return ""; }, { desc:"Magic-8", usage:"!ask <q>" });
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
  addCommand("dice",  ()=>{ sendChat(`🎲 ${1+Math.floor(Math.random()*5)}`); return ""; }, { desc:"Roll 1–5", usage:"!dice" });
  addCommand("roll",  ()=>{ sendChat(String(Math.floor(Math.random()*1000)).padStart(3,"0")); return ""; }, { desc:"Random 000–999", usage:"!roll" });
  addCommand("skip",  ()=>{ if (!hasRank(2)) return "You lack permission to voteskip."; emitVoteSkip(); return ""; }, { desc:"Vote skip", usage:"!skip" });
  addCommand("next",  ()=>{ if (!hasRank(2)) return "You lack permission to play next."; emitPlayNext(); return ""; }, { desc:"Play next", usage:"!next" });
  addCommand("bump",  ()=>{ if (!hasRank(2)) return "You lack permission to move items."; const e=emitBumpLastAfterCurrent(); return e||""; }, { desc:"Move last after current", usage:"!bump" });
  addCommand("add",   (ctx)=>{ if (!hasRank(2)) return "You lack permission to add."; const url=ctx.args.join(" ").trim(); if (!url) return "Usage: !add <url>"; const e=emitQueueAdd(url); return e||""; }, { desc:"Queue URL", usage:"!add <url>" });
  addCommand("now",   ()=>{ const t=getCurrentTitle(); if (!t) return "No current media."; sendChat(`now: ${t}`); return ""; }, { desc:"Show current title", usage:"!now" });
  addCommand("sm",    ()=>{ const em=getChannelEmotes(); if (!em.length) return "No channel emotes found."; sendChat(em[Math.floor(Math.random()*em.length)]); return ""; }, { desc:"Random channel emote", usage:"!sm" });
  addCommand("/me",   (ctx)=>{ const msg=(ctx.args[0]||"").trim(); if (msg) sendChat(`/me ${msg}`); return ""; });

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
    const rows = listPrimary().map(name=>{
      const c = REG.get(name);
      const desc  = c?.desc || "";
      const usage = c?.usage || ("!"+name);
      return `<tr><td><code>!${name}</code></td><td>${desc}</td><td><code>${usage}</code></td></tr>`;
    }).join("");
    return `
      <div class="content">
        <p>Type these in chat. Some require moderator permissions.</p>
        <div class="table-container">
          <table class="table is-fullwidth is-narrow">
            <thead><tr><th>Command</th><th>Description</th><th>Usage</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
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
    m.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-card btfw-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">Chat Commands</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">${buildCommandsTable()}</section>
        <footer class="modal-card-foot">
          <button class="button is-link" id="btfw-cmds-close">Close</button>
        </footer>
      </div>`;
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
    if (body) body.innerHTML = buildCommandsTable();
    motion.openModal(m);
  }

  function injectCommandsButton(into){
    if (!into || into._btfwCmdBtn) return false;
    const btn = document.createElement("button");
    btn.id = "btfw-chatcmds-btn";
    btn.className = "button is-dark is-small btfw-chatbtn";
    btn.innerHTML = `<i class="fa fa-question-circle" aria-hidden="true"></i>`;
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







