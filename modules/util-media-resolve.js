// BTFW — util:media-resolve
// Resolve Imgur and Lensdump page URLs to direct media URLs via movies-storage worker.
BTFW.define("util:media-resolve", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const IMGUR_PAGE_URL_RE =
    /https?:\/\/(?:www\.)?imgur\.com\/(?:gallery\/[^\s?]+|a\/[a-zA-Z0-9]+)(?:[/?][^\s]*)?/gi;

  const LENSDUMP_PAGE_URL_RE =
    /https?:\/\/(?:www\.)?lensdump\.com\/(?:i|a)\/[a-zA-Z0-9]+(?:\/[^\s]*)?/gi;

  const MISSING_PROXY_MSG =
    "Media resolver is unavailable. Ensure the movies-storage worker is deployed.";

  async function resolvePageUrl(url, options = {}) {
    const target = String(url || "").trim();
    if (!target) throw new Error("Missing media URL");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    return proxy.workerFetch("/api/media/resolve", {
      params: { url: target },
      signal: options.signal,
    });
  }

  async function expandPageUrlsInMessage(message, urlRe, options = {}) {
    const text = String(message || "");
    const matches = [...text.matchAll(urlRe)];
    if (!matches.length) return text;

    let out = text;
    const seen = new Set();
    for (const match of matches) {
      const pageUrl = match[0];
      if (!pageUrl || seen.has(pageUrl)) continue;
      seen.add(pageUrl);
      try {
        const resolved = await resolvePageUrl(pageUrl, options);
        const mediaUrl = String(resolved?.url || "").trim();
        if (!mediaUrl) continue;
        out = out.replace(pageUrl, mediaUrl);
      } catch (err) {
        console.warn("[BTFW media-resolve] Could not resolve URL:", pageUrl, err);
      }
    }
    return out;
  }

  async function expandImgurUrlsInMessage(message, options = {}) {
    return expandPageUrlsInMessage(message, IMGUR_PAGE_URL_RE, options);
  }

  async function expandLensdumpUrlsInMessage(message, options = {}) {
    return expandPageUrlsInMessage(message, LENSDUMP_PAGE_URL_RE, options);
  }

  async function expandUrlsInMessage(message, options = {}) {
    let out = await expandImgurUrlsInMessage(message, options);
    out = await expandLensdumpUrlsInMessage(out, options);
    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    IMGUR_PAGE_URL_RE,
    LENSDUMP_PAGE_URL_RE,
    MISSING_PROXY_MSG,
    resolvePageUrl,
    expandImgurUrlsInMessage,
    expandLensdumpUrlsInMessage,
    expandUrlsInMessage,
    isAvailable,
  };
});
