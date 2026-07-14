
BTFW.define("feature:gifs", ["util:giphy-proxy", "util:klipy-proxy"], async ({ init }) => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const PER_PAGE = 12;
  const motion = await BTFW.init("util:motion");
  const giphyProxy = await init("util:giphy-proxy");
  const klipyProxy = await init("util:klipy-proxy");
  const BASE = (window.BTFW && BTFW.BASE ? BTFW.BASE.replace(/\/+$/,'') : "");

  const state = {
    provider: "giphy",  // "giphy" | "klipy" | "favorites"
    query: "",
    page: 1,
    total: 0,
    items: [],          // { id, provider, thumb, urlClassic }
    loading: false
  };

  let renderedItems = [];
  let gridClickHandlerAttached = false;

  const FAVORITES_KEY = "btfw:gifs:favorites";
  let favorites = loadFavorites();
  let favoriteLookup = buildFavoriteLookup(favorites);

  /* ---- Utils ---- */
  function insertAtCursor(input, text) {
    input.focus();
    const s = input.selectionStart ?? input.value.length;
    const e = input.selectionEnd   ?? input.value.length;
    const before = input.value.slice(0, s);
    const after  = input.value.slice(e);
    input.value = before + text + after;
    const pos = before.length + text.length;
    input.selectionStart = input.selectionEnd = pos;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function buildGiphyClassic(id){ return `https://media1.giphy.com/media/${id}/giphy.gif`; }

  function assetUrl(...segments) {
    const encoded = segments.map((segment) => String(segment).split("/").map(encodeURIComponent).join("/")).join("/");
    return BASE ? `${BASE}/${encoded}` : `/${encoded}`;
  }

  const KLIPY_POWERED_BY_URL = assetUrl(
    "assets/klipy/search-interface-branding/SVG Files/Powered by KLIPY  - white.svg"
  );
  const KLIPY_WATERMARK_URL = assetUrl("assets/klipy/card-branding/KLIPY Light with logo.svg");

  function getCustomerId() {
    try {
      if (window.CLIENT && window.CLIENT.name) return String(window.CLIENT.name);
      if (window.CLIENT && window.CLIENT.login) return String(window.CLIENT.login);
    } catch (_) {}
    return "guest";
  }

  function mapKlipyItem(item) {
    if (!item || item.type === "ad") return null;
    const slug = item.slug || "";
    const id = String(item.id || slug || "");
    if (!id) return null;
    const file = item.file || {};
    const thumb = file.sm?.gif?.url || file.xs?.gif?.url || file.sm?.jpg?.url || file.xs?.jpg?.url || "";
    const urlClassic = file.hd?.gif?.url || file.md?.gif?.url || file.sm?.gif?.url || "";
    if (!urlClassic) return null;
    return { id, slug, provider: "klipy", thumb: thumb || urlClassic, urlClassic };
  }

  function ensureOpeners() {
    ["#btfw-btn-gif", ".btfw-btn-gif", "#giphybtn", "#gifbtn"].forEach(sel=>{
      $$(sel).forEach(el=>{
        el.removeAttribute("onclick");
        const c = el.cloneNode(true);
        el.parentNode.replaceChild(c, el);
        c.addEventListener("click", e => { e.preventDefault(); open(); }, { capture:true });
      });
    });
    if (!$("#btfw-btn-gif")) {
      const bar = document.getElementById("btfw-chat-bottombar")
             || document.querySelector("#chatcontrols .input-group-btn")
             || document.getElementById("chatcontrols")
             || document.getElementById("chatwrap");
      if (bar) {
        const btn = document.createElement("button");
        btn.id = "btfw-btn-gif";
        btn.type = "button";
        btn.className = "button is-dark is-small btfw-chatbtn btfw-btn-gif";
        btn.innerHTML = (document.querySelector(".fa")) ? '<i class="fa fa-file-video-o"></i>' : 'GIF';
        btn.title = "GIFs";
        bar.appendChild(btn);
        btn.addEventListener("click", e => { e.preventDefault(); open(); }, { capture:true });
      }
    }
  }

  let modal = null;
  function ensureModal(){
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "btfw-gif-modal";
    modal.className = "modal";
    modal.dataset.btfwModalState = "closed";
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-card btfw-modal">
        <header class="modal-card-head">
          <p class="modal-card-title">GIFs</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="btfw-gif-toolbar">
            <div class="tabs is-boxed is-small btfw-gif-tabs">
              <ul>
                <li class="is-active" data-p="giphy"><a>Giphy</a></li>
                <li data-p="klipy"><a>KLIPY</a></li>
                <li data-p="favorites"><a>Favorites</a></li>
              </ul>
            </div>
            <div class="btfw-gif-search">
              <input id="btfw-gif-q" class="input is-small" type="text" placeholder="Search GIFs…">
              <button id="btfw-gif-go" class="button is-link is-small">Search</button>
              <button id="btfw-gif-trending" class="button is-dark is-small">Trending</button>
            </div>
            <div id="btfw-klipy-branding" class="btfw-klipy-branding is-hidden" aria-hidden="true">
              <img class="btfw-klipy-powered" src="" alt="Powered by KLIPY">
            </div>
          </div>

          <div id="btfw-gif-notice" class="btfw-gif-notice is-hidden"></div>
          <div id="btfw-gif-grid" class="btfw-gif-grid"></div>

          <nav class="pagination is-centered btfw-gif-pager" role="navigation" aria-label="pagination">
            <button id="btfw-gif-prev" class="button is-dark is-small">Prev</button>
            <span id="btfw-gif-pages" class="btfw-gif-pages">1 / 1</span>
            <button id="btfw-gif-next" class="button is-dark is-small">Next</button>
          </nav>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-link" id="btfw-gif-close">Close</button>
        </footer>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".modal-background").addEventListener("click", close);
    modal.querySelector(".delete").addEventListener("click", close);
    $("#btfw-gif-close", modal).addEventListener("click", close);

    modal.querySelector(".btfw-gif-tabs ul").addEventListener("click", e=>{
      const li = e.target.closest("li[data-p]"); if (!li) return;
      modal.querySelectorAll(".btfw-gif-tabs li").forEach(x=>x.classList.toggle("is-active", x===li));
      state.provider = li.getAttribute("data-p");
      state.page = 1;
      handleProviderChange();
    });

    $("#btfw-gif-go", modal).addEventListener("click", ()=> { state.page = 1; search(); });
    $("#btfw-gif-q",  modal).addEventListener("keydown", e=> { if (e.key === "Enter") { state.page = 1; search(); }});
    $("#btfw-gif-trending", modal).addEventListener("click", ()=>{
      $("#btfw-gif-q").value = "";
      state.page = 1; search();
    });

    $("#btfw-gif-prev", modal).addEventListener("click", ()=>{
      if (state.page > 1) { state.page--; debouncedRender(); }
    });
    $("#btfw-gif-next", modal).addEventListener("click", ()=>{
      const totalPages = Math.max(1, Math.ceil(state.total / PER_PAGE));
      if (state.page < totalPages) { state.page++; debouncedRender(); }
    });

    const powered = $(".btfw-klipy-powered", modal);
    if (powered && !powered.getAttribute("src")) {
      powered.src = KLIPY_POWERED_BY_URL;
    }

    return modal;
  }

  function showNotice(msg){
    const n = $("#btfw-gif-notice", modal);
    n.textContent = msg || "";
    n.classList.toggle("is-hidden", !msg);
  }

  async function fetchGiphy(q){
    const params = { limit: "50", rating: "pg-13" };
    if (q) params.q = q;

    const json = await giphyProxy.giphyFetch(q ? "search" : "trending", params);
    const list = (json.data || []).map(g => {
      const id    = g.id || ""; // always present
      const thumb = (g.images && (g.images.fixed_width_small?.url
                               || g.images.fixed_width?.url
                               || g.images.downsized_still?.url)) || "";
      const urlClassic = id ? buildGiphyClassic(id) : ""; // <— classic format ONLY
      return { id, provider: "giphy", thumb, urlClassic };
    });
    return { items: list, total: list.length };
  }

  async function fetchKlipy(q) {
    const params = {
      per_page: "50",
      page: "1",
      customer_id: getCustomerId(),
      locale: "us",
      content_filter: "high",
      format_filter: "gif,jpg",
    };
    if (q) params.q = q;

    const json = await klipyProxy.klipyFetch(q ? "search" : "trending", params);
    const rows = (json && json.data && Array.isArray(json.data.data)) ? json.data.data : [];
    const list = rows.map(mapKlipyItem).filter(Boolean);
    return { items: list, total: list.length };
  }

  async function search(){
    const q = ($("#btfw-gif-q", ensureModal()).value || "").trim();
    state.query = q;
    state.page = 1;

    if (state.provider === "favorites") {
      state.loading = false;
      applyFavoritesToState();
      render();
      return;
    }

    state.loading = true;
    renderSkeleton();

    try {
      const fetcher = state.provider === "klipy" ? fetchKlipy : fetchGiphy;
      const { items, total } = await fetcher(q);
      state.items = items;
      state.total = total;
      state.loading = false;
      showNotice(total ? "" : "No results. Try a different search.");
      render();
    } catch (e) {
      state.items = [];
      state.total = 0;
      state.loading = false;
      const label = state.provider === "klipy" ? "KLIPY" : "GIF";
      showNotice(`Failed to load ${label}s (proxy unavailable or network). Try again later.`);
      render();
    }
  }

  function renderSkeleton(){
    if (state.provider === "favorites") {
      return;
    }
    const grid = $("#btfw-gif-grid", ensureModal());

    renderedItems = [];

    const existingSkeletons = grid.querySelectorAll('.is-skeleton');
    if (existingSkeletons.length === PER_PAGE) {
      return;
    }

    grid.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (let i = 0; i < PER_PAGE; i++){
      const sk = document.createElement("div");
      sk.className = "btfw-gif-cell is-skeleton";
      const frame = document.createElement("div");
      frame.className = "btfw-gif-thumb";
      sk.appendChild(frame);
      frag.appendChild(sk);
    }

    grid.appendChild(frag);
    $("#btfw-gif-pages").textContent = "… / …";
  }

  function render(){
    const grid = $("#btfw-gif-grid", ensureModal());

    setupGridClickHandler(grid);

    updateToolbarForProvider();

    const totalPages = Math.max(1, Math.ceil(state.total / PER_PAGE));
    const clamped = Math.max(1, Math.min(totalPages, state.page));
    if (clamped !== state.page) state.page = clamped;

    const start = (state.page - 1) * PER_PAGE;
    const pageItems = state.items.slice(start, start + PER_PAGE);

    const canUpdateInPlace = shouldUpdateInPlace(pageItems, grid);

    const showRemove = state.provider === "favorites";

    if (canUpdateInPlace) {
      // Fast path: update existing elements
      updateExistingCells(grid, pageItems, { showRemove });
    } else {
      // Full render needed
      fullRender(grid, pageItems, { showRemove });
    }

    renderedItems = pageItems.map(item => ({
      id: item.id,
      slug: item.slug || "",
      provider: item.provider,
      thumb: item.thumb,
      urlClassic: item.urlClassic
    }));

    $("#btfw-gif-pages").textContent = `${state.page} / ${totalPages}`;
    $("#btfw-gif-prev").disabled = (state.page <= 1);
    $("#btfw-gif-next").disabled = (state.page >= totalPages);
  }

  function setupGridClickHandler(grid) {
    if (gridClickHandlerAttached) return;

    grid.addEventListener("click", (e) => {
      const toggle = e.target.closest(".btfw-gif-fav-toggle");
      if (toggle && handleFavoriteControl(toggle)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Find the clicked cell (bubbling from img or button)
      const cell = e.target.closest(".btfw-gif-cell");
      if (!cell || cell.classList.contains("is-skeleton")) return;

      const url = cell.dataset.url;
      if (!url) return;

      if (cell.dataset.provider === "klipy" && cell.dataset.slug) {
        klipyProxy.klipyShare(cell.dataset.slug, {
          customer_id: getCustomerId(),
          q: state.query || undefined,
        }).catch(() => {});
      }

      const input = document.getElementById("chatline");
      if (!input) return;

      insertAtCursor(input, " " + url + " ");
      close();
    });

    grid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
      const toggle = e.target.closest(".btfw-gif-fav-toggle");
      if (toggle && handleFavoriteControl(toggle)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    gridClickHandlerAttached = true;
  }

  function shouldUpdateInPlace(newItems, grid) {
    const existingCells = grid.querySelectorAll(".btfw-gif-cell:not(.is-skeleton)");

    if (existingCells.length !== newItems.length) return false;

    if (renderedItems.length === 0) return false;

    return true;
  }

  // Update existing cells efficiently
  function updateExistingCells(grid, newItems, opts = {}) {
    const { showRemove = false } = opts;
    const cells = grid.querySelectorAll(".btfw-gif-cell");

    newItems.forEach((item, index) => {
      const cell = cells[index];
      if (!cell) return;
      updateCell(cell, item, { showRemove });
    });
  }

  // Update a single cell's content
  function updateCell(cell, item, opts = {}) {
    const { showRemove = false } = opts;
    // Update data attribute
    cell.dataset.url = item.urlClassic || "";
    cell.dataset.id = item.id || "";
    cell.dataset.slug = item.slug || "";
    cell.dataset.thumb = item.thumb || "";
    cell.dataset.provider = item.provider || state.provider || "";
    cell.dataset.favKey = makeFavoriteKey(item);

    const img = cell.querySelector("img");
    if (img && img.src !== item.thumb) {
      img.src = item.thumb;
      img.alt = "gif";
      prepareImageLoadingState(cell, img);
    } else if (img) {
      prepareImageLoadingState(cell, img);
    }

    cell.classList.remove("is-skeleton");
    updateFavoriteVisualState(cell, showRemove);
  }

  // Full render when updating in place isn't possible
  function fullRender(grid, pageItems, opts = {}) {
    const { showRemove = false } = opts;
    // Use replaceChildren for efficient bulk replacement (better than innerHTML = "")
    const frag = document.createDocumentFragment();

    pageItems.forEach(item => {
      const cell = createGifCell(item, { showRemove });
      frag.appendChild(cell);
    });

    grid.replaceChildren(frag);
  }

  // Create a single GIF cell element
  function createGifCell(item, opts = {}) {
    const { showRemove = false } = opts;
    const cell = document.createElement("button");
    cell.className = "btfw-gif-cell";
    cell.type = "button";

    cell.dataset.url = item.urlClassic || "";
    cell.dataset.id = item.id || "";
    cell.dataset.slug = item.slug || "";
    cell.dataset.thumb = item.thumb || "";
    cell.dataset.provider = item.provider || state.provider || "";
    cell.dataset.favKey = makeFavoriteKey(item);

    const frame = document.createElement("div");
    frame.className = "btfw-gif-thumb";

    const img = document.createElement("img");
    img.src = item.thumb;
    img.alt = "gif";
    img.loading = "lazy";
    img.decoding = "async";
    prepareImageLoadingState(cell, img);

    frame.appendChild(img);
    cell.appendChild(frame);

    const toggle = document.createElement("span");
    toggle.className = "btfw-gif-fav-toggle" + (showRemove ? " is-remove" : "");
    toggle.dataset.action = showRemove ? "remove-favorite" : "toggle-favorite";
    toggle.setAttribute("role", "button");
    toggle.tabIndex = 0;
    cell.appendChild(toggle);

    updateFavoriteVisualState(cell, showRemove);

    return cell;
  }

  function updateFavoriteVisualState(cell, showRemove) {
    const favKey = cell.dataset.favKey;
    const isFav = favoriteLookup.has(favKey || "");
    cell.classList.toggle("is-favorited", isFav);
    const toggle = cell.querySelector(".btfw-gif-fav-toggle");
    if (!toggle) return;
    if (showRemove) {
      toggle.textContent = "×";
      toggle.title = "Remove from favorites";
      toggle.setAttribute("aria-label", "Remove from favorites");
      toggle.setAttribute("aria-pressed", "true");
      return;
    }
    toggle.textContent = isFav ? "★" : "☆";
    const label = isFav ? "Remove from favorites" : "Add to favorites";
    toggle.title = label;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", isFav ? "true" : "false");
  }

  function prepareImageLoadingState(cell, img) {
    const handleLoad = () => {
      cell.classList.remove("is-loading");
      cell.classList.remove("is-broken");
    };
    const handleError = () => {
      cell.classList.add("is-broken");
      cell.classList.remove("is-loading");
    };

    cell.classList.add("is-loading");
    img.onload = handleLoad;
    img.onerror = handleError;

    if (img.complete) {
      if (img.naturalWidth && img.naturalHeight) {
        handleLoad();
      } else {
        handleError();
      }
    }
  }

  let renderTimeout = null;

  function debouncedRender() {
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }

    renderTimeout = setTimeout(() => {
      render();
      renderTimeout = null;
    }, 16);
  }

  document.addEventListener('btfw:openGifs', ()=> {
    try { openGifModal(); } catch(e){}
  });

  function open(){
    ensureModal();
    showNotice("");
    state.page = 1;
    state.provider = modal.querySelector(".btfw-gif-tabs li.is-active")?.getAttribute("data-p") || "giphy";
    updateToolbarForProvider();
    if (state.provider !== "favorites") {
      renderSkeleton();
    }
    setTimeout(search, 0);
    motion.openModal(modal);
    const input = $("#btfw-gif-q", modal);
    if (input && state.provider !== "favorites") {
      requestAnimationFrame(() => {
        input.focus();
        input.select();
      });
    }
  }
  function close(){ if (modal) motion.closeModal(modal); }

  function handleProviderChange() {
    updateToolbarForProvider();
    if (state.provider === "favorites") {
      applyFavoritesToState();
      render();
    } else {
      renderSkeleton();
      search();
    }
  }

  function updateToolbarForProvider() {
    const m = modal || document;
    const searchBar = $(".btfw-gif-search", m);
    const branding = $("#btfw-klipy-branding", m);
    const input = $("#btfw-gif-q", m);
    if (!searchBar) return;
    const isFavorites = state.provider === "favorites";
    const isKlipy = state.provider === "klipy";
    searchBar.classList.toggle("is-hidden", isFavorites);
    if (branding) {
      branding.classList.toggle("is-hidden", !isKlipy);
      branding.setAttribute("aria-hidden", isKlipy ? "false" : "true");
    }
    if (input) {
      input.placeholder = isKlipy ? "Search KLIPY" : "Search GIFs…";
    }
  }

  function makeFavoriteKey(item) {
    const provider = item.provider || state.provider || "";
    const idPart = item.id || "";
    const urlPart = item.urlClassic || "";
    const fallback = idPart || urlPart;
    return provider + "::" + (fallback || "");
  }

  function loadFavorites() {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(item => item && typeof item === "object" && item.urlClassic)
          .map(item => ({
            provider: item.provider || "giphy",
            id: item.id || "",
            thumb: item.thumb || item.urlClassic,
            urlClassic: item.urlClassic
          }));
      }
    } catch (_) {}
    return [];
  }

  function saveFavorites() {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (_) {}
  }

  function buildFavoriteLookup(list) {
    const map = new Map();
    list.forEach(item => {
      const key = makeFavoriteKey(item);
      if (key) map.set(key, item);
    });
    return map;
  }

  function applyFavoritesToState() {
    state.loading = false;
    state.items = favorites.slice();
    state.total = favorites.length;
    showNotice(favorites.length ? "" : "Favorite GIFs will appear here once you star them.");
  }

  function cellToItem(cell) {
    if (!cell) return null;
    const provider = cell.dataset.provider || state.provider || "";
    const id = cell.dataset.id || "";
    const slug = cell.dataset.slug || "";
    const thumb = cell.dataset.thumb || "";
    const urlClassic = cell.dataset.url || "";
    const item = { provider, id, slug, thumb, urlClassic };
    item.favKey = cell.dataset.favKey || makeFavoriteKey(item);
    return item;
  }

  function toggleFavorite(item) {
    const key = item.favKey || makeFavoriteKey(item);
    if (!item.urlClassic) return;
    if (favoriteLookup.has(key)) {
      removeFavorite(item);
      return;
    }
    favorites.push({
      provider: item.provider,
      id: item.id,
      thumb: item.thumb || item.urlClassic,
      urlClassic: item.urlClassic
    });
    favoriteLookup.set(key, favorites[favorites.length - 1]);
    saveFavorites();
    if (state.provider === "favorites") {
      applyFavoritesToState();
    }
    render();
  }

  function removeFavorite(item) {
    const key = item.favKey || makeFavoriteKey(item);
    const idx = favorites.findIndex(f => makeFavoriteKey(f) === key);
    if (idx === -1) return;
    favorites.splice(idx, 1);
    favoriteLookup.delete(key);
    saveFavorites();
    if (state.provider === "favorites") {
      applyFavoritesToState();
    }
    render();
  }

  function handleFavoriteControl(toggle) {
    const cell = toggle.closest(".btfw-gif-cell");
    if (!cell || cell.classList.contains("is-skeleton")) return false;
    const item = cellToItem(cell);
    if (!item) return false;
    const action = toggle.dataset.action || "";
    if (action === "remove-favorite") {
      removeFavorite(item);
    } else {
      toggleFavorite(item);
    }
    return true;
  }

  function boot(){
    ensureOpeners();
    if (KLIPY_WATERMARK_URL) {
      document.documentElement.style.setProperty(
        "--btfw-klipy-watermark-url",
        `url("${KLIPY_WATERMARK_URL}")`
      );
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name:"feature:gifs", open, close };
});
