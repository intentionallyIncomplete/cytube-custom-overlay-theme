// BTFW — util:imdb-card
// IMDB title/person metadata cards via TMDB find API.
BTFW.define("util:imdb-card", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const IMDB_TITLE_URL_RE =
    /https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+)(?:\/[^\s]*)?/gi;

  const IMDB_NAME_URL_RE =
    /https?:\/\/(?:www\.)?imdb\.com\/name\/(nm\d+)(?:\/[^\s]*)?/gi;

  const IMDB_CARD_TAG_RE =
    /\[imdbcard\]([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)(?:\|([^[]*))?\[\/imdbcard\]/g;

  const MISSING_PROXY_MSG =
    "IMDB card resolver is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";

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

  function parseTitleUrl(url) {
    const match = String(url || "").match(/imdb\.com\/title\/(tt\d+)/i);
    return match ? match[1] : null;
  }

  function parseNameUrl(url) {
    const match = String(url || "").match(/imdb\.com\/name\/(nm\d+)/i);
    return match ? match[1] : null;
  }

  function imdbPageUrl(kind, id) {
    const normalized = String(id || "").trim();
    if (!normalized) return "";
    return `https://www.imdb.com/${kind}/${normalized}/`;
  }

  function posterUrlFromPath(posterPath) {
    const path = String(posterPath || "").trim();
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("//")) return `https:${path}`;
    return `https://image.tmdb.org/t/p/${POSTER_SIZE}${path.startsWith("/") ? path : `/${path}`}`;
  }

  function encodeSourceUrl(url) {
    return String(url || "").trim().replace(/^https:\/\//i, "//");
  }

  function decodeSourceUrl(url) {
    const u = decodeCardField(url).trim();
    if (/^\/\//.test(u)) return `https:${u}`;
    return u.replace(/^https&#58;\/\//i, "https://");
  }

  function truncateOverview(text, max = 150) {
    let overview = String(text || "").trim() || "No summary available.";
    if (overview.length > max) overview = `${overview.slice(0, max - 3)}...`;
    return overview;
  }

  function normalizeTitleMedia(data) {
    const title = data.title || data.name || "Unknown";
    const year = String(data.release_date || data.first_air_date || "").slice(0, 4);
    const rating =
      typeof data.vote_average === "number" ? data.vote_average.toFixed(1) : "n/a";
    return {
      title,
      year,
      rating,
      overview: truncateOverview(data.overview || ""),
      posterPath: data.poster_path || "",
      sourceUrl: "",
    };
  }

  function normalizePersonMedia(person) {
    const knownFor = Array.isArray(person.known_for)
      ? person.known_for
          .map((item) => item.title || item.name)
          .filter(Boolean)
          .slice(0, 3)
          .join(", ")
      : "";
    const overview = knownFor
      ? `Known for: ${knownFor}`
      : String(person.known_for_department || "").trim() || "No credits listed.";
    return {
      title: person.name || "Unknown",
      year: String(person.known_for_department || "").trim(),
      rating: "",
      overview: truncateOverview(overview),
      posterPath: person.profile_path || "",
      sourceUrl: "",
    };
  }

  function formatCardTag(media) {
    const title = escapeCardField(media.title || "Unknown");
    const year = escapeCardField(media.year || "");
    const rating = escapeCardField(media.rating || "");
    const overview = escapeCardField(media.overview || "No summary available.");
    const posterPath = escapeCardField(media.posterPath || "");
    const pageUrl = escapeCardField(encodeSourceUrl(media.sourceUrl || ""));
    return `[imdbcard]${title}|${year}|${rating}|${overview}|${posterPath}|${pageUrl}[/imdbcard]`;
  }

  function renderCardHtml(title, year, rating, overview, posterPath, sourceUrl) {
    const posterSrc = posterUrlFromPath(decodeCardField(posterPath));
    const img = posterSrc
      ? `<img class="imdb-card__poster chat-media" src="${escapeHtml(posterSrc)}" alt="${escapeHtml(title)} poster" onerror="this.style.display='none'">`
      : "";
    const yearHtml = year
      ? ` <span class="imdb-card__year">(${escapeHtml(year)})</span>`
      : "";
    const ratingHtml = rating
      ? `<div class="imdb-card__rating">★ ${escapeHtml(rating)}</div>`
      : "";
    const inner =
      img +
      `<div class="imdb-card__content">` +
      `<div class="imdb-card__title">${escapeHtml(title)}${yearHtml}</div>` +
      ratingHtml +
      `<div class="imdb-card__overview">${escapeHtml(overview)}</div>` +
      `</div>`;
    const href = decodeSourceUrl(sourceUrl || "").trim();
    if (/^https?:\/\//i.test(href)) {
      return (
        `<a class="imdb-card chat-media-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` +
        inner +
        `</a>`
      );
    }
    return `<div class="imdb-card chat-media-card">` + inner + `</div>`;
  }

  function renderCardsInHtml(html) {
    return String(html || "").replace(
      IMDB_CARD_TAG_RE,
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

  async function fetchTitleByImdbId(imdbId, options = {}) {
    const id = String(imdbId || "").trim();
    if (!/^tt\d+$/i.test(id)) throw new Error("Invalid IMDB title id");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    const data = await proxy.tmdbFetch(`find/${encodeURIComponent(id)}`, {
      external_source: "imdb_id",
      language: "en-US",
    }, options);
    const media = (data.movie_results || [])[0] || (data.tv_results || [])[0];
    if (!media) throw new Error("No TMDB match for IMDB title");
    return normalizeTitleMedia(media);
  }

  async function fetchPersonByImdbId(imdbId, options = {}) {
    const id = String(imdbId || "").trim();
    if (!/^nm\d+$/i.test(id)) throw new Error("Invalid IMDB name id");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    const data = await proxy.tmdbFetch(`find/${encodeURIComponent(id)}`, {
      external_source: "imdb_id",
      language: "en-US",
    }, options);
    const person = (data.person_results || [])[0];
    if (!person) throw new Error("No TMDB match for IMDB person");
    return normalizePersonMedia(person);
  }

  async function expandUrlsInMessage(message, options = {}) {
    const text = String(message || "");
    const titleMatches = [...text.matchAll(IMDB_TITLE_URL_RE)];
    const nameMatches = [...text.matchAll(IMDB_NAME_URL_RE)];
    if (!titleMatches.length && !nameMatches.length) return text;

    let out = text;
    const seen = new Set();

    for (const match of titleMatches) {
      const fullUrl = match[0];
      const imdbId = match[1];
      if (!fullUrl || !imdbId || seen.has(imdbId)) continue;
      seen.add(imdbId);
      try {
        const media = await fetchTitleByImdbId(imdbId, options);
        const card = formatCardTag({
          ...media,
          sourceUrl: imdbPageUrl("title", imdbId),
        });
        out = out.replace(
          new RegExp(
            `https?:\\/\\/(?:www\\.)?imdb\\.com\\/title\\/${imdbId}(?:\\/[^\\s]*)?`,
            "gi"
          ),
          card
        );
      } catch (err) {
        console.warn("[BTFW imdb-card] Could not expand title URL:", fullUrl, err);
      }
    }

    for (const match of nameMatches) {
      const fullUrl = match[0];
      const imdbId = match[1];
      if (!fullUrl || !imdbId || seen.has(imdbId)) continue;
      seen.add(imdbId);
      try {
        const media = await fetchPersonByImdbId(imdbId, options);
        const card = formatCardTag({
          ...media,
          sourceUrl: imdbPageUrl("name", imdbId),
        });
        out = out.replace(
          new RegExp(
            `https?:\\/\\/(?:www\\.)?imdb\\.com\\/name\\/${imdbId}(?:\\/[^\\s]*)?`,
            "gi"
          ),
          card
        );
      } catch (err) {
        console.warn("[BTFW imdb-card] Could not expand name URL:", fullUrl, err);
      }
    }

    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    IMDB_TITLE_URL_RE,
    IMDB_NAME_URL_RE,
    IMDB_CARD_TAG_RE,
    MISSING_PROXY_MSG,
    parseTitleUrl,
    parseNameUrl,
    posterUrlFromPath,
    formatCardTag,
    renderCardHtml,
    renderCardsInHtml,
    fetchTitleByImdbId,
    fetchPersonByImdbId,
    expandUrlsInMessage,
    isAvailable,
  };
});
