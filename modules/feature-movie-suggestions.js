// BTFW â€” ext:movie-suggestion
// TMDB movie suggestions for chat
BTFW.define("ext:movie-suggestion", [], async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let selectedMovieId = null;
  let selectedMovieTitle = null;
  let selectedPosterPath = null;

  const LOG = '[movie-suggestion]';
  function mlog(...args) { console.log(LOG, ...args); }
  function mwarn(...args) { console.warn(LOG, ...args); }
  function merror(...args) { console.error(LOG, ...args); }

  function normalizePosterPath(posterPath) {
    if (!posterPath || posterPath === 'null') return null;
    return posterPath;
  }

  function workerPosterPath(suggestion) {
    return normalizePosterPath(suggestion.posterPath);
  }

  function isValidSuggestion(s) {
    return !!(s && s.movieId != null && s.movieId !== '' && s.movieTitle && s.username);
  }

  function skipReason(s) {
    if (!s || typeof s !== 'object') return 'empty';
    if (s.movieId == null || s.movieId === '') return 'missing movieId';
    if (!s.movieTitle) return 'missing movieTitle';
    if (!s.username) return 'missing username';
    return 'unknown';
  }

  // Inject CSS
  function injectStyles() {
    if (document.getElementById("btfw-movie-suggest-styles")) return;
    const style = document.createElement("style");
    style.id = "btfw-movie-suggest-styles";
    style.textContent = `
      /* Movie Suggestion Modal Styles */
      #btfw-movie-suggest-modal .btfw-movie-results {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        margin-top: 16px;
      }

      #btfw-movie-suggest-modal .movie-result {
        min-width: 150px;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.2s ease;
      }

      #btfw-movie-suggest-modal .movie-result:hover {
        border-color: var(--btfw-color-accent, #6d4df6);
        transform: translateY(-2px);
      }

      #btfw-movie-suggest-modal .movie-result img {
        width: 100%;
        display: block;
      }

      #btfw-movie-suggest-modal .movie-result__info {
        padding: 8px;
      }

      #btfw-movie-suggest-modal .movie-result__title {
        font-weight: 600;
        font-size: 0.85rem;
      }

      #btfw-movie-suggest-modal .recent-suggestion {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        padding: 8px;
        border-radius: 8px;
        background: rgba(255,255,255,0.03);
      }

      #btfw-movie-suggest-modal .recent-suggestion img {
        width: 46px;
        height: 69px;
        border-radius: 4px;
        object-fit: cover;
      }

      #btfw-movie-suggest-modal .recent-suggestion__title {
        font-weight: 600;
      }

      #btfw-movie-suggest-modal .recent-suggestion__user {
        opacity: 0.7;
        font-size: 0.85rem;
      }

      .button.btfw-nav-pill#btfw-movie-suggest-btn:hover {
        background-color: var(--btfw-color-accent, #6d4df6);
      }
    `;
    document.head.appendChild(style);
  }

  // Get TMDB API key from config
  function getTMDBKey() {
    try {
      const cfg = (window.BTFW_CONFIG && typeof window.BTFW_CONFIG === "object") ? window.BTFW_CONFIG : {};
      const tmdbObj = (cfg.tmdb && typeof cfg.tmdb === "object") ? cfg.tmdb : {};
      const cfgKey = typeof tmdbObj.apiKey === "string" ? tmdbObj.apiKey.trim() : "";
      const legacyCfg = typeof cfg.tmdbKey === "string" ? cfg.tmdbKey.trim() : "";
      let lsKey = "";
      try { lsKey = (localStorage.getItem("btfw:tmdb:key") || "").trim(); }
      catch(_) {}
      const g = v => (v == null ? "" : String(v)).trim();
      const globalKey = g(window.TMDB_API_KEY) || g(window.BTFW_TMDB_KEY) || g(window.tmdb_key) || g(window.moviedbkey);
      const bodyKey = (document.body?.dataset?.tmdbKey || "").trim();
      const key = cfgKey || legacyCfg || lsKey || globalKey || bodyKey;
      return key || null;
    } catch(_) { return null; }
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
      insertAfter: null
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
      <span class="btfw-nav-pill__icon" aria-hidden="true"><i class="fa fa-film"></i></span>
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
                     placeholder="${userRank === 0 ? 'Please register to search and suggest movies' : 'Search for a movie...'}"
                     ${userRank === 0 ? 'disabled' : ''}>
            </div>
          </div>
          <div class="btfw-movie-results"></div>
          <div style="margin-top:24px;">
            <h6 style="font-weight:600;margin-bottom:12px;">Recent Suggestions:</h6>
            <div id="btfw-recent-suggestions"></div>
          </div>
        </section>
      </div>
    `;
    document.body.appendChild(modal);

    const bg = $(".modal-background", modal);
    const del = $(".delete", modal);
    bg.addEventListener("click", closeModal);
    del.addEventListener("click", closeModal);

    if (userRank === 0) {
      const input = $("#btfw-movie-search", modal);
      input.addEventListener("focus", () => {
        alert('You need to be registered to search and suggest movies.');
        input.blur();
      });
    } else {
      let searchTimeout;
      const input = $("#btfw-movie-search", modal);
      input.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        const query = input.value.trim();
        if (query.length > 2) {
          searchTimeout = setTimeout(() => searchMovies(query), 500);
        } else {
          $(".btfw-movie-results", modal).innerHTML = '';
        }
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
        </section>
        <footer class="modal-card-foot">
          <button class="button" id="btfw-movie-cancel">Cancel</button>
          <button class="button is-link" id="btfw-movie-confirm">Confirm</button>
        </footer>
      </div>
    `;
    document.body.appendChild(modal);

    const bg = $(".modal-background", modal);
    const del = $(".delete", modal);
    const cancel = $("#btfw-movie-cancel", modal);
    const confirm = $("#btfw-movie-confirm", modal);

    const close = () => modal.classList.remove("is-active");
    bg.addEventListener("click", close);
    del.addEventListener("click", close);
    cancel.addEventListener("click", close);
    confirm.addEventListener("click", confirmSuggestion);
  }

  function openModal() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    mlog('openModal', { userRank });
    modal.classList.add("is-active");

    const container = $("#btfw-recent-suggestions", modal);
    if (container) container.innerHTML = '';

    loadRecentSuggestions();
  }

  function closeModal() {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    mlog('closeModal');
    modal.classList.remove("is-active");
    $("#btfw-movie-search", modal).value = '';
    $(".btfw-movie-results", modal).innerHTML = '';
    $("#btfw-recent-suggestions", modal).innerHTML = '';
    selectedMovieId = null;
    selectedMovieTitle = null;
    selectedPosterPath = null;
  }

  function searchMovies(query) {
    mlog('searchMovies', { query });
    const apiKey = getTMDBKey();
    if (!apiKey) {
      merror('TMDB API key not available');
      return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const results = (data.results || []).slice(0, 5);
        mlog('searchMovies: results', { count: results.length });
        displaySearchResults(results);
      })
      .catch(err => merror('Error fetching movies:', err));
  }

  function displaySearchResults(movies) {
    const modal = $("#btfw-movie-suggest-modal");
    if (!modal) return;

    mlog('displaySearchResults', { count: movies.length });
    const container = $(".btfw-movie-results", modal);
    container.innerHTML = movies.map(movie => `
      <div class="movie-result" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path || ''}">
        <img src="https://image.tmdb.org/t/p/w154${movie.poster_path}" alt="${movie.title}" 
             onerror="this.src='https://via.placeholder.com/154x231?text=No+Image'">
        <div class="movie-result__info">
          <div class="movie-result__title">${movie.title}</div>
          <small style="opacity:0.7;">${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</small>
        </div>
      </div>
    `).join('');

    $$(".movie-result", container).forEach(el => {
      el.addEventListener("click", () => {
        selectedMovieId = el.dataset.id;
        selectedMovieTitle = el.dataset.title;
        selectedPosterPath = el.dataset.poster;
        
        const confirmModal = $("#btfw-movie-confirm-modal");
        if (!confirmModal) return;
        
        $("#btfw-confirm-movie-title", confirmModal).textContent = selectedMovieTitle;
        confirmModal.classList.add("is-active");
      });
    });
  }

  async function confirmSuggestion() {
    if (!selectedMovieId || !selectedMovieTitle) return;

    mlog('confirmSuggestion', { movieId: selectedMovieId, movieTitle: selectedMovieTitle });

    const confirmModal = $("#btfw-movie-confirm-modal");
    if (confirmModal) confirmModal.classList.remove("is-active");
    
    // Save the suggestion and wait for completion
    await suggestMovie(selectedMovieId, selectedMovieTitle, selectedPosterPath);
    
    // Give the worker a moment to process, then refresh
    await new Promise(resolve => setTimeout(resolve, 400));
    loadRecentSuggestions();
    
    // Keep modal open briefly to show the new suggestion
    await new Promise(resolve => setTimeout(resolve, 1200));
    closeModal();
  }

  function suggestMovie(movieId, movieTitle, posterPath) {
    const username = CLIENT?.name || 'Anonymous';
    const normalizedPoster = normalizePosterPath(posterPath);
    mlog('suggestMovie', {
      movieId,
      movieTitle,
      username,
      posterPath: normalizedPoster
    });

    return saveSuggestionToCloudflare(movieId, movieTitle, username, normalizedPoster);
  }

  function saveSuggestionToCloudflare(movieId, movieTitle, username, posterPath) {
    const normalizedPoster = normalizePosterPath(posterPath);
    const suggestion = {
      movieId,
      movieTitle,
      username,
      timestamp: new Date().toISOString()
    };
    if (normalizedPoster) {
      suggestion.posterPath = normalizedPoster;
    } else {
      mlog('saveSuggestionToCloudflare: posterPath omitted (null)');
    }

    mlog('saveSuggestionToCloudflare: POST', {
      movieId,
      movieTitle,
      username,
      hasPoster: !!normalizedPoster
    });

    return fetch('https://movie-suggestions-worker.billtube.workers.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(suggestion)
    })
      .then(res => {
        mlog('saveSuggestionToCloudflare: response status', res.status);
        return res.json();
      })
      .then(data => {
        mlog('Saved:', data);
        return data;
      })
      .catch(err => {
        merror('Save failed:', err);
        throw err;
      });
  }

  function loadRecentSuggestions() {
    const container = $("#btfw-recent-suggestions");
    if (!container) return;

    container.innerHTML = '';
    mlog('loadRecentSuggestions: fetch start');

    fetch('https://movie-suggestions-worker.billtube.workers.dev')
      .then(res => res.json())
      .then(async data => {
        const raw = Array.isArray(data) ? data : [];
        mlog('loadRecentSuggestions: raw=' + raw.length);

        const valid = [];
        const skipped = [];
        for (const s of raw) {
          if (isValidSuggestion(s)) {
            valid.push(s);
          } else {
            skipped.push(s);
          }
        }

        mlog('loadRecentSuggestions: valid=' + valid.length + ' skipped=' + skipped.length);
        if (skipped.length > 0) {
          const samples = skipped.slice(0, 3).map(s => ({
            reason: skipReason(s),
            keys: s && typeof s === 'object' ? Object.keys(s) : []
          }));
          mwarn('loadRecentSuggestions: skipped samples', samples);
        }

        const enrichStart = performance.now();
        mlog('loadRecentSuggestions: TMDB enrichment start', { count: valid.length });

        const suggestions = await Promise.all(
          valid.map(suggestion => {
            const storedPoster = workerPosterPath(suggestion);
            return fetchMovieDetails(suggestion.movieId).then(movie => {
              const tmdbPoster = normalizePosterPath(movie.poster_path);
              const posterPath = storedPoster || tmdbPoster || null;
              const posterSource = storedPoster ? 'worker' : (tmdbPoster ? 'tmdb' : 'none');
              mlog('loadRecentSuggestions: enriched', {
                movieId: suggestion.movieId,
                movieTitle: suggestion.movieTitle,
                username: suggestion.username,
                posterSource
              });
              return {
                movieId: suggestion.movieId,
                movieTitle: suggestion.movieTitle,
                username: suggestion.username,
                posterPath
              };
            });
          })
        );

        mlog('loadRecentSuggestions: TMDB enrichment end', {
          ms: Math.round(performance.now() - enrichStart)
        });

        suggestions.reverse().forEach(s => {
          addRecentSuggestion(s.movieId, s.movieTitle, s.username, s.posterPath);
        });
        mlog('loadRecentSuggestions: rendered=' + suggestions.length);
      })
      .catch(err => merror('Load failed:', err));
  }

  function addRecentSuggestion(movieId, movieTitle, username, posterPath) {
    const container = $("#btfw-recent-suggestions");
    if (!container) return;

    const usedTitleFallback = !movieTitle;
    const usedUserFallback = !username;
    const title = movieTitle || 'Unknown title';
    const user = username || 'Anonymous';
    if (usedTitleFallback || usedUserFallback) {
      mwarn('addRecentSuggestion: used fallbacks', {
        movieId,
        usedTitleFallback,
        usedUserFallback
      });
    }

    const poster = normalizePosterPath(posterPath) || '';
    mlog('addRecentSuggestion', {
      movieId,
      title,
      username: user,
      posterPath: !!poster,
      usedFallback: usedTitleFallback || usedUserFallback
    });

    const div = document.createElement('div');
    div.className = 'recent-suggestion';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w92${poster}" alt="${title}"
           onerror="this.src='https://via.placeholder.com/92x138?text=No+Image'">
      <div>
        <div class="recent-suggestion__title">${title}</div>
        <small class="recent-suggestion__user">Suggested by: ${user}</small>
      </div>
    `;
    container.appendChild(div);
  }

  function fetchMovieDetails(movieId) {
    mlog('fetchMovieDetails', { movieId });
    const apiKey = getTMDBKey();
    if (!apiKey) {
      merror('TMDB API key not available');
      return Promise.reject('No API key');
    }

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

    return fetch(url)
      .then(res => res.json())
      .catch(err => {
        mwarn('Fetch details failed', { movieId, err });
        return { poster_path: null };
      });
  }

  function boot() {
    mlog('boot: start');
    const apiKey = getTMDBKey();
    if (!apiKey) {
      mwarn('TMDB API key not configured. Add it in Theme Settings → Integrations.');
      return;
    }

    mlog('boot: TMDB key present', { hasKey: true });
    mlog('Initializing with TMDB API key');
    injectStyles();
    buildModal();
    buildConfirmModal();

    let retryCount = 0;
    const maxRetries = 50;

    const tryAddButton = () => {
      if (addNavButton()) {
        mlog('Button added successfully');
        return;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(tryAddButton, 100);
      } else {
        mwarn('Failed to add button after retries', { retryCount });
      }
    };

    tryAddButton();
  }

  document.addEventListener('btfw:layoutReady', () => {
    setTimeout(boot, 100);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(boot, 200);
    });
  } else {
    setTimeout(boot, 200);
  }

  return {
    name: 'ext:movie-suggestion',
    open: openModal,
    close: closeModal
  };
});

// Legacy id used by billtube-fw < v1.0.6
BTFW.define("feature:movie-suggestions", ["ext:movie-suggestion"], async (ctx) => ctx.init("ext:movie-suggestion"));