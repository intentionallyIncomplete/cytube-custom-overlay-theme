// BTFW — util:tmdb-card
// TMDB movie/TV metadata cards via movies-storage worker.
BTFW.define("util:tmdb-card", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const TMDB_URL_RE =
    /https?:\/\/(?:www\.)?themoviedb\.org\/(movie|tv)\/(\d+)(?:-[a-zA-Z0-9-]+)?\/?/gi;

  const TMDB_CARD_TAG_RE =
    /\[tmdbcard\]([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)(?:\|([^[]*))?\[\/tmdbcard\]/g;

  const MISSING_PROXY_MSG =
    "TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";

  const POSTER_SIZE = "w342";

  function escapeCardField(value) {
    return String(value ?? "")
      .replace(/\|/g, "&#124;")
      .replace(/\[/g, "&#91;")
      .replace(/\]/g, "&#93;");
  }

  function decodeCardField(value) {
    return String(value ?? "")
      .replace(/&#124;/g, "|")
      .replace(/&#91;/g, "[")
      .replace(/&#93;/g, "]");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function parseUrl(url) {
    const match = String(url || "").match(
      /themoviedb\.org\/(movie|tv)\/(\d+)/i
    );
    if (!match) return null;
    return { mediaType: match[1].toLowerCase(), id: match[2] };
  }

  function posterUrlFromPath(posterPath) {
    const path = String(posterPath || "").trim();
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("//")) return `https:${path}`;
    return `https://image.tmdb.org/t/p/${POSTER_SIZE}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function normalizeMedia(data, mediaType) {
    const title = data.title || data.name || "Unknown";
    const year = String(data.release_date || data.first_air_date || "").slice(0, 4);
    const rating =
      typeof data.vote_average === "number" ? data.vote_average.toFixed(1) : "n/a";
    let overview = String(data.overview || "").trim() || "No summary available.";
    if (overview.length > 150) {
      overview = `${overview.slice(0, 147)}...`;
    }
    return {
      title,
      year,
      rating,
      overview,
      posterPath: data.poster_path || "",
      mediaType,
      id: data.id,
    };
  }

  function encodeSourceUrl(url) {
    return String(url || "").trim().replace(/^https:\/\//i, "//");
  }

  function decodeSourceUrl(url) {
    const u = decodeCardField(url).trim();
    if (/^\/\//.test(u)) return `https:${u}`;
    return u.replace(/^https&#58;\/\//i, "https://");
  }

  function tmdbPageUrl(mediaType, id) {
    const type = String(mediaType || "").trim().toLowerCase();
    const mediaId = String(id || "").trim();
    if (!type || !mediaId) return "";
    return `https://www.themoviedb.org/${type}/${mediaId}`;
  }

  function formatCardTag(media) {
    const title = escapeCardField(media.title || "Unknown");
    const year = escapeCardField(media.year || "");
    const rating = escapeCardField(media.rating || "n/a");
    const overview = escapeCardField(media.overview || "No summary available.");
    const posterPath = escapeCardField(media.posterPath || "");
    const pageUrl = escapeCardField(
      encodeSourceUrl(media.sourceUrl || tmdbPageUrl(media.mediaType, media.id))
    );
    return `[tmdbcard]${title}|${year}|${rating}|${overview}|${posterPath}|${pageUrl}[/tmdbcard]`;
  }

  function renderCardHtml(title, year, rating, overview, posterPath, sourceUrl) {
    const posterSrc = posterUrlFromPath(decodeCardField(posterPath));
    const img = posterSrc
      ? `<img class="tmdb-card__poster chat-media" src="${escapeHtml(posterSrc)}" alt="${escapeHtml(title)} poster" onerror="this.style.display='none'">`
      : "";
    const inner =
      img +
      `<div class="tmdb-card__content">` +
      `<div class="tmdb-card__title">${escapeHtml(title)} <span class="tmdb-card__year">(${escapeHtml(year)})</span></div>` +
      `<div class="tmdb-card__rating">★ ${escapeHtml(rating)}</div>` +
      `<div class="tmdb-card__overview">${escapeHtml(overview)}</div>` +
      `</div>`;
    const href = decodeSourceUrl(sourceUrl || "").trim();
    if (/^https?:\/\//i.test(href)) {
      return (
        `<a class="tmdb-card chat-media-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` +
        inner +
        `</a>`
      );
    }
    return `<div class="tmdb-card chat-media-card">` + inner + `</div>`;
  }

  function renderCardsInHtml(html) {
    return String(html || "").replace(
      TMDB_CARD_TAG_RE,
      (_, title, year, rating, overview, poster, sourceUrl) =>
        renderCardHtml(
          decodeCardField(title),
          decodeCardField(year),
          decodeCardField(rating),
          decodeCardField(overview),
          poster,
          sourceUrl
        )
    );
  }

  async function fetchMedia(mediaType, id, options = {}) {
    const type = String(mediaType || "").trim().toLowerCase();
    const mediaId = String(id || "").trim();
    if (!type || !mediaId) throw new Error("Missing TMDB media type or id");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    const data = await proxy.tmdbFetch(`${type}/${encodeURIComponent(mediaId)}`, {
      language: "en-US",
    }, options);
    return normalizeMedia(data, type);
  }

  async function fetchFromUrl(url, options = {}) {
    const parsed = parseUrl(url);
    if (!parsed) throw new Error("Invalid TMDB URL");
    return fetchMedia(parsed.mediaType, parsed.id, options);
  }

  async function expandUrlsInMessage(message, options = {}) {
    const text = String(message || "");
    const matches = [...text.matchAll(TMDB_URL_RE)];
    if (!matches.length) return text;

    let out = text;
    const seen = new Set();
    for (const match of matches) {
      const fullUrl = match[0];
      const key = `${match[1]}:${match[2]}`;
      if (!fullUrl || seen.has(key)) continue;
      seen.add(key);
      try {
        const media = await fetchMedia(match[1], match[2], options);
        const card = formatCardTag({ ...media, sourceUrl: fullUrl });
        out = out.replace(
          new RegExp(
            `https?:\\/\\/(?:www\\.)?themoviedb\\.org\\/${match[1]}\\/${match[2]}(?:-[a-zA-Z0-9-]+)?\\/?`,
            "gi"
          ),
          card
        );
      } catch (err) {
        console.warn("[BTFW tmdb-card] Could not expand URL:", fullUrl, err);
      }
    }
    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    TMDB_URL_RE,
    TMDB_CARD_TAG_RE,
    MISSING_PROXY_MSG,
    parseUrl,
    posterUrlFromPath,
    formatCardTag,
    renderCardHtml,
    renderCardsInHtml,
    fetchMedia,
    fetchFromUrl,
    expandUrlsInMessage,
    isAvailable,
  };
});
