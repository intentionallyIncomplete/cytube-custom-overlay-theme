// BTFW — util:letterboxd
// Letterboxd film metadata via movies-storage worker (HTML OG scrape).
BTFW.define("util:letterboxd", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const LETTERBOXD_URL_RE =
    /https?:\/\/(?:www\.)?letterboxd\.com\/film\/([a-zA-Z0-9-]+)\/?/gi;

  const MISSING_PROXY_MSG =
    "Letterboxd proxy is unavailable. Ensure the movies-storage worker is deployed.";

  function encodePosterUrl(url) {
    // Protocol-relative URLs avoid CyTube link extraction (no "https://") and
    // survive sanitizeText (no & < > " ' ( ) ).
    return String(url || "").trim().replace(/^https:\/\//i, "//");
  }

  function encodeSourceUrl(url) {
    return String(url || "").trim().replace(/^https:\/\//i, "//");
  }

  function decodeSourceUrl(url) {
    const u = decodeCardField(url).trim();
    if (/^\/\//.test(u)) return `https:${u}`;
    return u.replace(/^https&#58;\/\//i, "https://");
  }

  function decodePosterUrl(url) {
    const u = String(url || "").trim();
    if (/^\/\//.test(u)) return `https:${u}`;
    return u.replace(/^https&#58;\/\//i, "https://");
  }

  function escapeCardField(value) {
    return String(value ?? "")
      .replace(/\|/g, "&#124;")
      .replace(/\[/g, "&#91;")
      .replace(/\]/g, "&#93;");
  }

  function slugFromUrl(url) {
    const match = String(url || "").match(
      /letterboxd\.com\/film\/([a-zA-Z0-9-]+)/i
    );
    return match ? match[1] : null;
  }

  const LETTERBOXD_CARD_TAG_RE =
    /\[letterboxdcard\]([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)(?:\|([^[]*))?\[\/letterboxdcard\]/g;

  const LETTERBOXD_BROKEN_CARD_TAIL_RE =
    /"\s*target="_blank"\s*rel="noopener noreferrer">https?:\/\/[^<[]*\[\/letterboxdcard\]/gi;

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

  function renderCardHtml(title, year, rating, overview, posterUrl, sourceUrl) {
    const safePoster = decodePosterUrl(String(posterUrl || "").trim());
    const posterAttr =
      /^https?:\/\//i.test(safePoster) || /^\/\//.test(safePoster)
        ? escapeHtml(safePoster)
        : "";
    const img = posterAttr
      ? `<img class="letterboxd-card__poster chat-media" src="${posterAttr}" alt="${escapeHtml(title)} poster" onerror="this.style.display='none'">`
      : "";
    const inner =
      img +
      `<div class="letterboxd-card__content">` +
      `<div class="letterboxd-card__title">${escapeHtml(title)} <span class="letterboxd-card__year">(${escapeHtml(year)})</span></div>` +
      `<div class="letterboxd-card__rating">★ ${escapeHtml(rating)}</div>` +
      `<div class="letterboxd-card__overview">${escapeHtml(overview)}</div>` +
      `</div>`;
    const href = decodeSourceUrl(sourceUrl || "").trim();
    if (/^https?:\/\//i.test(href)) {
      return (
        `<a class="letterboxd-card chat-media-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` +
        inner +
        `</a>`
      );
    }
    return `<div class="letterboxd-card chat-media-card">` + inner + `</div>`;
  }

  function stripBrokenCardTails(html) {
    return String(html || "").replace(LETTERBOXD_BROKEN_CARD_TAIL_RE, "");
  }

  function renderCardsInHtml(html) {
    return stripBrokenCardTails(html).replace(
      LETTERBOXD_CARD_TAG_RE,
      (_, title, year, rating, overview, poster, sourceUrl) =>
        renderCardHtml(
          decodeCardField(title),
          decodeCardField(year),
          decodeCardField(rating),
          decodeCardField(overview),
          decodeCardField(poster),
          sourceUrl
        )
    );
  }

  function formatCardTag(film, sourceUrl) {
    const title = escapeCardField(film.title || film.slug || "Film");
    const year = escapeCardField(film.year || "");
    const rating = escapeCardField(film.rating || "n/a");
    const overview = escapeCardField(film.overview || "No description available.");
    const posterUrl = escapeCardField(encodePosterUrl(film.posterUrl || ""));
    const pageUrl = escapeCardField(
      encodeSourceUrl(sourceUrl || (film.slug ? `https://letterboxd.com/film/${film.slug}/` : ""))
    );
    return `[letterboxdcard]${title}|${year}|${rating}|${overview}|${posterUrl}|${pageUrl}[/letterboxdcard]`;
  }

  async function fetchFilm(slug, options = {}) {
    const normalized = String(slug || "").trim().replace(/\/+$/, "");
    if (!normalized) throw new Error("Missing Letterboxd film slug");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    return proxy.workerFetch(`/api/letterboxd/film/${encodeURIComponent(normalized)}`, {
      signal: options.signal,
    });
  }

  async function expandUrlsInMessage(message, options = {}) {
    const text = String(message || "");
    const matches = [...text.matchAll(LETTERBOXD_URL_RE)];
    if (!matches.length) return text;

    let out = text;
    const seen = new Set();
    for (const match of matches) {
      const slug = match[1];
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      try {
        const film = await fetchFilm(slug, options);
        const card = formatCardTag(film, `https://letterboxd.com/film/${slug}/`);
        out = out.replace(
          new RegExp(
            `https?:\\/\\/(?:www\\.)?letterboxd\\.com\\/film\\/${slug}\\/?`,
            "gi"
          ),
          card
        );
      } catch (err) {
        console.warn("[BTFW letterboxd] Could not expand URL:", slug, err);
      }
    }
    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    LETTERBOXD_URL_RE,
    LETTERBOXD_CARD_TAG_RE,
    MISSING_PROXY_MSG,
    encodePosterUrl,
    decodePosterUrl,
    stripBrokenCardTails,
    slugFromUrl,
    formatCardTag,
    renderCardHtml,
    renderCardsInHtml,
    fetchFilm,
    expandUrlsInMessage,
    isAvailable,
  };
});
