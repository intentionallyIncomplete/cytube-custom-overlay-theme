// BTFW — util:giphy-proxy
// Client access to Giphy via the movies-storage worker (no browser API key).
BTFW.define("util:giphy-proxy", [], async () => {
  const DEFAULT_WORKER_BASE = "https://empty-bar-d620.movies-storage-a.workers.dev";
  const MISSING_PROXY_MSG = "Giphy proxy is unavailable. Ensure the movies-storage worker is deployed with GIPHY_API_KEY set.";

  function getWorkerBase() {
    try {
      const cfg = (window.BTFW_CONFIG && typeof window.BTFW_CONFIG === "object") ? window.BTFW_CONFIG : {};
      const fromCfg = cfg.integrations?.giphyProxy?.endpoint
        || cfg.integrations?.giphy?.endpoint
        || cfg.giphyProxy?.endpoint
        || cfg.movieSuggestions?.endpoint
        || cfg.integrations?.movieSuggestions?.endpoint
        || cfg.integrations?.tmdbProxy?.endpoint;
      const base = (fromCfg || DEFAULT_WORKER_BASE).trim();
      return base.replace(/\/+$/, "");
    } catch (_) {
      return DEFAULT_WORKER_BASE;
    }
  }

  function buildUrl(apiPath, params) {
    const normalizedPath = apiPath.startsWith("/") ? apiPath : `/${apiPath}`;
    const url = new URL(`${getWorkerBase()}${normalizedPath}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        url.searchParams.set(key, String(value));
      }
    }
    return url.toString();
  }

  async function giphyFetch(endpoint, params = {}, options = {}) {
    const path = endpoint === "search" ? "/api/giphy/search" : "/api/giphy/trending";
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      signal: options.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Giphy proxy request failed (${response.status})`);
    }
    return data;
  }

  function isAvailable() {
    return Boolean(getWorkerBase());
  }

  return {
    getWorkerBase,
    giphyFetch,
    isAvailable,
    MISSING_PROXY_MSG,
  };
});
