// BTFW — util:klipy-proxy
// Client access to KLIPY via the movies-storage worker (no browser app key).
BTFW.define("util:klipy-proxy", [], async () => {
  const DEFAULT_WORKER_BASE = "https://empty-bar-d620.movies-storage-a.workers.dev";
  const MISSING_PROXY_MSG = "KLIPY proxy is unavailable. Ensure the movies-storage worker is deployed with KLIPY_APP_KEY set.";

  function getWorkerBase() {
    try {
      const cfg = (window.BTFW_CONFIG && typeof window.BTFW_CONFIG === "object") ? window.BTFW_CONFIG : {};
      const fromCfg = cfg.integrations?.klipyProxy?.endpoint
        || cfg.integrations?.klipy?.endpoint
        || cfg.klipyProxy?.endpoint
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

  async function klipyFetch(endpoint, params = {}, options = {}) {
    const path = endpoint === "search" ? "/api/klipy/search" : "/api/klipy/trending";
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      signal: options.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `KLIPY proxy request failed (${response.status})`);
    }
    return data;
  }

  async function klipyShare(slug, body = {}, options = {}) {
    const normalized = String(slug || "").replace(/^\/+/, "");
    if (!normalized) return;
    const response = await fetch(buildUrl(`/api/klipy/share/${encodeURIComponent(normalized)}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: options.signal,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `KLIPY share failed (${response.status})`);
    }
    return response.json().catch(() => ({}));
  }

  function isAvailable() {
    return Boolean(getWorkerBase());
  }

  return {
    getWorkerBase,
    klipyFetch,
    klipyShare,
    isAvailable,
    MISSING_PROXY_MSG,
  };
});
