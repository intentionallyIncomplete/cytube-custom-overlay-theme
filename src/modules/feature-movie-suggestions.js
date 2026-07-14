// BTFW — ext:movie-suggestion
// TMDB movie requests via movies-storage worker
BTFW.define("ext:movie-suggestion", ["util:tmdb-proxy", "feature:monkeyPaw"], async ({ init }) => {
  const tmdb = await init("util:tmdb-proxy");
  const monkeyPaw = await init("feature:monkeyPaw");
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let selectedMovieId = null;
  let selectedMovieTitle = null;
  let selectedPosterPath = null;
  let selectedReleaseYear = null;

  const searchState = {
    query: "",
    page: 1,
    totalPages: 1,
    sortBy: "popularity.desc",
    genreId: "",
    year: "",
    minRating: "",
    loading: false,
  };

  let metaCache = null;
  let genresCache = null;

  const LOG = "[movie-suggestion]";
  function mlog(...args) { console.log(LOG, ...args); }
  function merror(...args) { console.error(LOG, ...args); }

  function sendChat(msg) {
    try {
      if (window.socket?.emit) {
        window.socket.emit("chatMsg", { msg });
        return true;
      }
    } catch (_) {}
    return false;
  }

  async function workerFetch(path, options = {}) {
    return tmdb.workerFetch(path, options);
  }

  function injectStyles() {
    if (document.getElementById("btfw-movie-suggest-styles")) return;
    const style = document.createElement("style");
    style.id = "btfw-movie-suggest-styles";
    style.textContent = `
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
    `;
    document.head.appendChild(style);
  }

  const userRank = CLIENT?.rank || 0;

  function findNavList() {
    const donateBtn = $("a[href*='donate'], #donate-btn, .donate-btn");
    if (donateBtn) {
      const ul = donateBtn.closest("ul");
      if (ul) return { ul, insertAfter: donateBtn.parentElement };
    }

    const themeBtn = $("#btfw-theme-btn-nav");
    if (themeBtn) {
      const ul = themeBtn.closest("ul");
      if (ul) return { ul, insertAfter: null };
    }

    return {
      ul: $(".navbar .nav.navbar-nav") || $(".navbar-nav") || $(".btfw-navbar ul") || $(".navbar ul"),
      insertAfter: null,
    };
  }

  function addNavButton() {
    if ($("#btfw-movie-suggest-btn")) return true;

    const nav = findNavList();
    if (!nav.ul) return false;

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.className = "btfw-nav-pill";
    a.id = "btfw-movie-suggest-btn";
    a.innerHTML = `
      <span class="btfw-nav-pill__icon" data-btfw-icon-slot="nav-movie-request" aria-hidden="true"><i class="fa fa-film"></i></span>
      <span class="btfw-nav-pill__label">Request</span>
    `;

    li.appendChild(a);

    if (nav.insertAfter) {
      nav.insertAfter.after(li);
    } else {
      nav.ul.insertBefore(li, nav.ul.firstChild);
    }

    a.addEventListener("click", openModal);
    return true;
  }

  function buildModal() {
    if ($("#btfw-movie-suggest-modal")) return;

    const modal = document.createElement("div");
    modal.id = "btfw-movie-suggest-modal";
    modal.className = "modal";
    modal.innerHTML = `
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
                     placeholder="${userRank === 0 ? "Please register to search and suggest movies" : "Search for a movie..."}"
                     ${userRank === 0 ? "disabled" : ""}>
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
    `;
    document.body.appendChild(modal);

    const bg = $(".modal-background", modal);
    const del = $(".delete", modal);
    bg.addEventListener("click", closeModal);
    del.addEventListener("click", closeModal);

    $("#btfw-movie-prev", modal)?.addEventListener("click", () => {
      if (searchState.page > 1) {
        searchState.page -= 1;
        runSearch();
      }
    });
    $("#btfw-movie-next", modal)?.addEventListener("click", () => {
      if (searchState.page < searchState.totalPages) {
        searchState.page += 1;
        runSearch();
      }
    });

    if (userRank === 0) {
      const input = $("#btfw-movie-search", modal);
      input.addEventListener("focus", () => {
        alert("You need to be registered to search and suggest movies.");
        input.blur();
      });
    } else {
      let searchTimeout;
      const input = $("#btfw-movie-search", modal);
      input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchState.query = input.value.trim();
        searchState.page = 1;
        searchTimeout = setTimeout(() => runSearch(), 400);
      });

      $("#btfw-movie-sort", modal)?.addEventListener("change", (e) => {
        searchState.sortBy = e.target.value;
        searchState.page = 1;
        runSearch();
      });
      $("#btfw-movie-genre", modal)?.addEventListener("change", (e) => {
        searchState.genreId = e.target.value;
        searchState.page = 1;
        runSearch();
      });
      $("#btfw-movie-year", modal)?.addEventListener("change", (e) => {
        searchState.year = e.target.value.trim();
        searchState.page = 1;
        runSearch();
      });
      $("#btfw-movie-rating", modal)?.addEventListener("change", (e) => {
        searchState.minRating = e.target.value.trim();
        searchState.page = 1;
        runSearch();
      });
    }
  }

  function buildConfirmModal() {
    if ($("#btfw-movie-confirm-modal")) return;

    const modal = document.createElement("div");
    modal.id = "btfw-movie-confirm-modal";
    modal.className = "modal";
    modal.innerHTML = `
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
    `;
    document.body.appendChild(modal);

    const bg = $(".modal-background", modal);
    const del = $(".delete", modal);
    const cancel = $("#btfw-movie-cancel", modal);
    const confirm = $("#btfw-movie-confirm", modal);

    const close = () => closeConfirmModal();
    bg.addEventListener("click", close);
    del.addEventListener("click", close);
    cancel.addEventListener("click", close);
    confirm.addEventListener("click", confirmSuggestion);
  }

  async function ensureFilterOptions() {
    if (metaCache && genresCache) return;

    const [meta, genres] = await Promise.all([
      workerFetch("/api/meta"),
      workerFetch("/api/genres"),
    ]);

    metaCache = meta;
    genresCache = genres;

    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    const sortSelect = $("#btfw-movie-sort", modal);
    if (sortSelect && sortSelect.options.length === 0) {
      for (const option of meta.sortOptions || []) {
        const el = document.createElement("option");
        el.value = option.value;
        el.textContent = option.label;
        sortSelect.appendChild(el);
      }
      sortSelect.value = searchState.sortBy;
    }

    const genreSelect = $("#btfw-movie-genre", modal);
    if (genreSelect && genreSelect.options.length <= 1) {
      for (const genre of genres.genres || []) {
        const el = document.createElement("option");
        el.value = String(genre.id);
        el.textContent = genre.name;
        genreSelect.appendChild(el);
      }
    }
  }

  function buildSearchParams() {
    const params = {
      page: searchState.page,
      sort_by: searchState.sortBy,
    };

    if (searchState.query) {
      params.query = searchState.query;
      if (searchState.year) {
        params.primary_release_year = searchState.year;
        params.year = searchState.year;
      }
    } else {
      if (searchState.genreId) params.with_genres = searchState.genreId;
      if (searchState.year) params.primary_release_year = searchState.year;
      if (searchState.minRating) params["vote_average.gte"] = searchState.minRating;
    }

    return params;
  }

  function posterSrc(posterPath) {
    if (!posterPath || posterPath === "null") {
      return "https://via.placeholder.com/154x231?text=No+Image";
    }
    return `https://image.tmdb.org/t/p/w154${posterPath}`;
  }

  function updatePager() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    const prev = $("#btfw-movie-prev", modal);
    const next = $("#btfw-movie-next", modal);
    const label = $("#btfw-movie-page-label", modal);

    if (label) {
      label.textContent = `Page ${searchState.page} of ${searchState.totalPages}`;
    }
    if (prev) prev.disabled = searchState.page <= 1 || searchState.loading;
    if (next) next.disabled = searchState.page >= searchState.totalPages || searchState.loading;
  }

  function renderSearchResults(movies) {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    const container = $(".btfw-movie-results", modal);
    if (!movies.length) {
      container.innerHTML = `<p style="opacity:0.75;padding:8px 0;">No movies found. Try another search or filter.</p>`;
      return;
    }

    container.innerHTML = movies.map((movie) => `
      <div class="movie-result"
           data-id="${movie.id}"
           data-title="${movie.title}"
           data-poster="${movie.posterPath || ""}"
           data-year="${movie.releaseYear || ""}">
        <div class="movie-result__poster">
          <img src="${posterSrc(movie.posterPath)}" alt="${movie.title}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        </div>
        <div class="movie-result__info">
          <div class="movie-result__title">${movie.title}</div>
          <small style="opacity:0.7;">${movie.releaseYear || "N/A"}</small>
        </div>
      </div>
    `).join("");

    $$(".movie-result", container).forEach((el) => {
      el.addEventListener("click", () => {
        selectedMovieId = el.dataset.id;
        selectedMovieTitle = el.dataset.title;
        selectedPosterPath = el.dataset.poster;
        selectedReleaseYear = el.dataset.year || null;

        const confirmModal = $("#btfw-movie-confirm-modal");
        if (!confirmModal) return;

        const yearSuffix = selectedReleaseYear ? ` (${selectedReleaseYear})` : "";
        $("#btfw-confirm-movie-title", confirmModal).textContent = `${selectedMovieTitle}${yearSuffix}`;
        openConfirmModal();
      });
    });
  }

  async function runSearch() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal || searchState.loading) return;

    searchState.loading = true;
    updatePager();

    const container = $(".btfw-movie-results", modal);
    container.innerHTML = `<p style="opacity:0.75;padding:8px 0;">Searching…</p>`;

    try {
      await ensureFilterOptions();
      const data = await workerFetch("/api/search", { params: buildSearchParams() });
      searchState.totalPages = Math.max(1, data.totalPages || 1);
      renderSearchResults(data.results || []);
      mlog("runSearch", {
        page: searchState.page,
        totalPages: searchState.totalPages,
        count: (data.results || []).length,
      });
    } catch (err) {
      merror("runSearch failed:", err);
      container.innerHTML = `<p style="opacity:0.75;padding:8px 0;">Search failed. Try again in a moment.</p>`;
    } finally {
      searchState.loading = false;
      updatePager();
    }
  }

  async function loadHistory() {
    const container = $("#btfw-movie-history");
    if (!container) return;

    container.innerHTML = `<p style="opacity:0.75;">Loading…</p>`;

    try {
      const data = await workerFetch("/api/history", { params: { page: 1, limit: 10 } });
      const items = data.results || [];
      if (!items.length) {
        container.innerHTML = `<p style="opacity:0.75;">No requests yet.</p>`;
        return;
      }

      container.innerHTML = items.map((item) => {
        const year = item.releaseYear ? ` (${item.releaseYear})` : "";
        const poster = posterSrc(item.posterPath).replace("w154", "w92");
        return `
          <div class="history-item">
            <img src="${poster}" alt="${item.movieTitle}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
            <div>
              <div class="history-item__title">${item.movieTitle}${year}</div>
              <div class="history-item__meta">Requested by ${item.username}</div>
            </div>
          </div>
        `;
      }).join("");
    } catch (err) {
      merror("loadHistory failed:", err);
      container.innerHTML = `<p style="opacity:0.75;">Could not load recent requests.</p>`;
    }
  }

  function openConfirmModal() {
    const suggestModal = $("#btfw-movie-suggest-modal");
    const confirmModal = $("#btfw-movie-confirm-modal");
    if (!confirmModal) return;

    if (suggestModal) suggestModal.classList.add("btfw-movie-suggest-pending");
    confirmModal.classList.add("is-active");
  }

  function closeConfirmModal() {
    const suggestModal = $("#btfw-movie-suggest-modal");
    const confirmModal = $("#btfw-movie-confirm-modal");
    if (suggestModal) suggestModal.classList.remove("btfw-movie-suggest-pending");
    if (confirmModal) confirmModal.classList.remove("is-active");
  }

  async function openModal() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    mlog("openModal", { userRank });
    modal.classList.remove("btfw-movie-suggest-pending");
    modal.classList.add("is-active");

    try {
      await ensureFilterOptions();
      await Promise.all([runSearch(), loadHistory()]);
    } catch (err) {
      merror("openModal bootstrap failed:", err);
    }
  }

  function closeModal() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    closeConfirmModal();
    mlog("closeModal");
    modal.classList.remove("is-active");
    $("#btfw-movie-search", modal).value = "";
    $(".btfw-movie-results", modal).innerHTML = "";
    searchState.query = "";
    searchState.page = 1;
    searchState.totalPages = 1;
    selectedMovieId = null;
    selectedMovieTitle = null;
    selectedPosterPath = null;
    selectedReleaseYear = null;
  }

  function formatChatAnnouncement(username, movieTitle, releaseYear) {
    const year = releaseYear ? ` (${releaseYear})` : "";
    return `🎬 Movie request: ${movieTitle}${year} — suggested by ${username}`;
  }

  async function confirmSuggestion() {
    if (!selectedMovieId || !selectedMovieTitle) return;

    const username = CLIENT?.name || "Anonymous";
    mlog("confirmSuggestion", { movieId: selectedMovieId, movieTitle: selectedMovieTitle });

    closeConfirmModal();

    try {
      await monkeyPaw.play();

      await workerFetch("/api/suggestions", {
        method: "POST",
        body: {
          movieId: Number(selectedMovieId),
          movieTitle: selectedMovieTitle,
          username,
          posterPath: selectedPosterPath || null,
          releaseYear: selectedReleaseYear || null,
        },
      });

      sendChat(formatChatAnnouncement(username, selectedMovieTitle, selectedReleaseYear));
      await loadHistory();
      closeModal();
    } catch (err) {
      merror("confirmSuggestion failed:", err);
      alert("Could not save your movie request. Please try again.");
    }
  }

  function boot() {
    mlog("boot: start", { workerBase: tmdb.getWorkerBase() });
    injectStyles();
    buildModal();
    buildConfirmModal();

    let retryCount = 0;
    const maxRetries = 50;

    const tryAddButton = () => {
      if (addNavButton()) {
        mlog("Button added successfully");
        return;
      }

      retryCount += 1;
      if (retryCount < maxRetries) {
        setTimeout(tryAddButton, 100);
      } else {
        console.warn(LOG, "Failed to add button after retries", { retryCount });
      }
    };

    tryAddButton();
  }

  document.addEventListener("btfw:layoutReady", () => {
    setTimeout(boot, 100);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(boot, 200);
    });
  } else {
    setTimeout(boot, 200);
  }

  return {
    name: "ext:movie-suggestion",
    open: openModal,
    close: closeModal,
    getWorkerBase: tmdb.getWorkerBase,
  };
});

// Legacy id used by billtube-fw < v1.0.6
BTFW.define("feature:movie-suggestions", ["ext:movie-suggestion"], async (ctx) => ctx.init("ext:movie-suggestion"));
