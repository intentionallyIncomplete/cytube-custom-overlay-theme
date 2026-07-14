// BTFW — util:tenor
// Resolve Tenor view/share URLs to direct media URLs via movies-storage worker.
BTFW.define("util:tenor", ["util:tmdb-proxy"], async ({ init }) => {
  const proxy = await init("util:tmdb-proxy");

  const TENOR_VIEW_URL_RE =
    /https?:\/\/(?:www\.)?tenor\.com\/view\/[^\s]+/gi;

  const MISSING_PROXY_MSG =
    "Tenor resolver is unavailable. Ensure the movies-storage worker is deployed.";

  async function resolveViewUrl(url, options = {}) {
    const target = String(url || "").trim();
    if (!target) throw new Error("Missing Tenor URL");
    if (!proxy.isAvailable()) throw new Error(MISSING_PROXY_MSG);
    return proxy.workerFetch("/api/tenor/resolve", {
      params: { url: target },
      signal: options.signal,
    });
  }

  async function expandViewUrlsInMessage(message, options = {}) {
    const text = String(message || "");
    const matches = [...text.matchAll(TENOR_VIEW_URL_RE)];
    if (!matches.length) return text;

    let out = text;
    const seen = new Set();
    for (const match of matches) {
      const viewUrl = match[0];
      if (!viewUrl || seen.has(viewUrl)) continue;
      seen.add(viewUrl);
      try {
        const resolved = await resolveViewUrl(viewUrl, options);
        const mediaUrl = String(resolved?.url || "").trim();
        if (!mediaUrl) continue;
        out = out.replace(viewUrl, mediaUrl);
      } catch (err) {
        console.warn("[BTFW tenor] Could not resolve view URL:", viewUrl, err);
      }
    }
    return out;
  }

  function isAvailable() {
    return proxy.isAvailable();
  }

  return {
    TENOR_VIEW_URL_RE,
    MISSING_PROXY_MSG,
    resolveViewUrl,
    expandViewUrlsInMessage,
    isAvailable,
  };
});
