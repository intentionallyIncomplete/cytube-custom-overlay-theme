// BTFW — util:tmdb-proxy
// Client access to TMDB via the movies-storage worker (no browser API key).
BTFW.define("util:tmdb-proxy", [], async () => {
  const DEFAULT_WORKER_BASE = "https://empty-bar-d620.movies-storage-a.workers.dev";
  const MISSING_PROXY_MSG = "TMDB proxy is unavailable. Ensure the movies-storage worker is deployed with TMDB_API_KEY set.";

  function getWorkerBase() {
    try {
      const cfg = (window.BTFW_CONFIG && typeof window.BTFW_CONFIG === "object") ? window.BTFW_CONFIG : {};
      const fromCfg = cfg.movieSuggestions?.endpoint
        || cfg.integrations?.movieSuggestions?.endpoint
        || cfg.integrations?.movieRequests?.endpoint
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

  async function workerFetch(apiPath, options = {}) {
    const response = await fetch(buildUrl(apiPath, options.params), {
      method: options.method || "GET",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Worker request failed (${response.status})`);
    }
    return data;
  }

  async function tmdbFetch(path, params = {}, options = {}) {
    const normalized = String(path || "").replace(/^\/+/, "");
    return workerFetch(`/api/tmdb/${normalized}`, { params, signal: options.signal });
  }

  function isAvailable() {
    return Boolean(getWorkerBase());
  }

  return {
    getWorkerBase,
    workerFetch,
    tmdbFetch,
    isAvailable,
    MISSING_PROXY_MSG,
  };
});
