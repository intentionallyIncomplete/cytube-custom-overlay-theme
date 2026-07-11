// BTFW — util:letterboxd
// Letterboxd film metadata via movies-storage worker (HTML OG scrape).
BTFW.define("util:letterboxd", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const LETTERBOXD_URL_RE =
    /https?:\/\/(?:www\.)?letterboxd\.com\/film\/([a-zA-Z0-9-]+)\/?/gi;

  const LETTERBOXD_SLUG_TAG_RE =
    /\[letterboxdcard\]([a-zA-Z0-9-]+)\[\/letterboxdcard\]/g;

  const LETTERBOXD_CARD_TAG_RE =
    /\[letterboxdcard\]([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)(?:\|([^[]*))?\[\/letterboxdcard\]/g;

  const LETTERBOXD_BROKEN_CARD_TAIL_RE =
    /"\s*target="_blank"\s*rel="noopener noreferrer">https?:\/\/[^<[]*\[\/letterboxdcard\]/gi;

  const MISSING_PROXY_MSG =
    "Letterboxd proxy is unavailable. Ensure the movies-storage worker is deployed.";

  const filmCache = new Map();

  function encodePosterUrl(url) {
    return String(url || "")
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/^\/\//, "");
  }

  function decodePosterUrl(url) {
    const u = decodeCardField(String(url || "").trim());
    if (!u) return "";
    if (/^\/\//.test(u)) return `https:${u}`;
    if (/^https?:\/\//i.test(u)) return u;
    return `https://${u}`;
  }

  function resolveCardHref(sourceField) {
    const raw = decodeCardField(sourceField || "").trim();
    if (!raw) return "";
    if (/^\/\//.test(raw)) return `https:${raw}`;
    if (/^https?:\/\//i.test(raw)) return raw;
    if (/letterboxd\.com\/film\//i.test(raw)) {
      const slug = slugFromUrl(raw);
      return slug ? `https://letterboxd.com/film/${slug}/` : "";
    }
    const slug = raw.replace(/^\/+|\/+$/g, "");
    return slug ? `https://letterboxd.com/film/${slug}/` : "";
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
    const href = resolveCardHref(sourceUrl || "").trim();
    if (/^https?:\/\//i.test(href)) {
      return (
        `<a class="letterboxd-card chat-media-card" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">` +
        inner +
        `</a>`
      );
    }
    return `<div class="letterboxd-card chat-media-card">` + inner + `</div>`;
  }

  function renderCardFromFilm(film, slug) {
    const normalizedSlug = String(slug || film.slug || "").trim();
    return renderCardHtml(
      film.title || normalizedSlug || "Film",
      film.year || "",
      film.rating || "n/a",
      film.overview || "No description available.",
      encodePosterUrl(film.posterUrl || ""),
      normalizedSlug
    );
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
          decodeCardField(sourceUrl)
        )
    );
  }

  function formatCardTag(film, sourceUrl) {
    const slug = String(film?.slug || slugFromUrl(sourceUrl || "") || "").trim();
    if (!slug) return String(sourceUrl || "");
    return `[letterboxdcard]${slug}[/letterboxdcard]`;
  }

  function formatSlugTag(slug) {
    const normalized = String(slug || "").trim();
    if (!normalized) return "";
    return `[letterboxdcard]${normalized}[/letterboxdcard]`;
  }

  async function fetchFilmCached(slug, options = {}) {
    const normalized = String(slug || "").trim().replace(/\/+$/, "");
    if (!normalized) throw new Error("Missing Letterboxd film slug");
    if (filmCache.has(normalized)) return filmCache.get(normalized);
    const film = await fetchFilm(normalized, options);
    filmCache.set(normalized, film);
    return film;
  }

  async function fetchFilm(slug, options = {}) {
    const normalized = String(slug || "").trim().replace(/\/+$/, "");
    if (!normalized) throw new Error("Missing Letterboxd film slug");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    return proxy.workerFetch(`/api/letterboxd/film/${encodeURIComponent(normalized)}`, {
      signal: options.signal,
    });
  }

  async function expandSlugTagsInHtml(container) {
    if (!container) return;
    let html = container.innerHTML;
    if (!html.includes("[letterboxdcard]")) return;

    const slugs = [];
    for (const match of html.matchAll(LETTERBOXD_SLUG_TAG_RE)) {
      if (match[1]) slugs.push(match[1]);
    }
    if (!slugs.length) return;

    let out = html;
    for (const slug of [...new Set(slugs)]) {
      const tag = formatSlugTag(slug);
      if (!out.includes(tag)) continue;
      try {
        const film = await fetchFilmCached(slug);
        const cardHtml = renderCardFromFilm(film, slug);
        out = out.split(tag).join(cardHtml);
      } catch (err) {
        console.warn("[BTFW letterboxd] Card render failed:", slug, err);
      }
    }
    if (out !== container.innerHTML) container.innerHTML = out;
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
      const card = formatSlugTag(slug);
      out = out.replace(
        new RegExp(
          `https?:\\/\\/(?:www\\.)?letterboxd\\.com\\/film\\/${slug}\\/?`,
          "gi"
        ),
        card
      );
    }
    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    LETTERBOXD_URL_RE,
    LETTERBOXD_SLUG_TAG_RE,
    LETTERBOXD_CARD_TAG_RE,
    MISSING_PROXY_MSG,
    encodePosterUrl,
    decodePosterUrl,
    stripBrokenCardTails,
    slugFromUrl,
    formatCardTag,
    formatSlugTag,
    renderCardHtml,
    renderCardFromFilm,
    renderCardsInHtml,
    expandSlugTagsInHtml,
    fetchFilm,
    expandUrlsInMessage,
    isAvailable,
  };
});
