/**
 * BillTube movie suggestions + TMDB proxy worker.
 *
 * Legacy (old movie-suggestions-worker.billtube.workers.dev):
 *   GET  /       → JSON array of suggestions
 *   POST /       → append suggestion
 *
 * New API:
 *   GET  /api/search, /api/history, /api/genres, /api/meta
 *   GET  /api/tmdb/{tmdb-path}  → TMDB proxy (server-side API key)
 *   GET  /api/giphy/search, /api/giphy/trending  → Giphy proxy (server-side API key)
 *   GET  /api/klipy/search, /api/klipy/trending, POST /api/klipy/share/{slug}  → KLIPY proxy
 *   POST /api/suggestions
 */

export interface Env {
  MOVIE_SUGGESTIONS: KVNamespace;
  TMDB_API_KEY: string;
  GIPHY_API_KEY?: string;
  KLIPY_APP_KEY?: string;
  ALLOWED_ORIGINS?: string;
}

const HISTORY_KEY = "suggestions:history";
const GENRES_CACHE_TTL_SEC = 60 * 60 * 24 * 7;
const MAX_HISTORY = 500;
const DEFAULT_HISTORY_PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity (high → low)" },
  { value: "popularity.asc", label: "Popularity (low → high)" },
  { value: "vote_average.desc", label: "Rating (high → low)" },
  { value: "vote_average.asc", label: "Rating (low → high)" },
  { value: "primary_release_date.desc", label: "Release date (newest)" },
  { value: "primary_release_date.asc", label: "Release date (oldest)" },
  { value: "title.asc", label: "Title (A → Z)" },
  { value: "title.desc", label: "Title (Z → A)" },
  { value: "revenue.desc", label: "Revenue (high → low)" },
  { value: "vote_count.desc", label: "Vote count (high → low)" },
] as const;

const DISCOVER_FILTER_KEYS = [
  "sort_by",
  "with_genres",
  "primary_release_year",
  "primary_release_date.gte",
  "primary_release_date.lte",
  "vote_average.gte",
  "vote_average.lte",
  "vote_count.gte",
  "certification",
  "certification_country",
  "certification.gte",
  "certification.lte",
  "region",
  "include_adult",
  "include_video",
  "language",
] as const;

const SEARCH_FILTER_KEYS = [
  "primary_release_year",
  "year",
  "region",
  "include_adult",
  "language",
] as const;

const ALLOWED_TMDB_PREFIXES = [
  "search/",
  "find/",
  "movie/",
  "tv/",
  "discover/",
  "genre/",
  "configuration/",
] as const;

/** Matches legacy movie-suggestions-worker.billtube.workers.dev records */
interface StoredSuggestion {
  key: string;
  movieId: number;
  movieTitle: string;
  username: string;
  posterPath: string | null;
  releaseYear: string | null;
  up: number;
  down: number;
  ts: number;
}

interface TmdbMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

interface TmdbPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface SuggestionInput {
  movieId?: number | string;
  movieTitle?: string;
  username?: string;
  posterPath?: string | null;
  releaseYear?: string | null;
  timestamp?: string;
}

function json(data: unknown, init: ResponseInit = {}, corsOrigin: string | null = null): Response {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  applyCors(headers, corsOrigin);
  return new Response(JSON.stringify(data), { ...init, headers });
}

function errorResponse(status: number, message: string, corsOrigin: string | null): Response {
  return json({ error: message }, { status }, corsOrigin);
}

function applyCors(headers: Headers, origin: string | null): void {
  if (!origin) return;
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  headers.set("vary", "Origin");
}

function resolveCorsOrigin(request: Request, env: Env): string | null {
  const allowed = (env.ALLOWED_ORIGINS || "*").trim();
  const origin = request.headers.get("Origin");
  if (allowed === "*") {
    return origin || "*";
  }
  const list = allowed.split(",").map((v) => v.trim()).filter(Boolean);
  if (origin && list.includes(origin)) return origin;
  return list[0] || null;
}

function requireTmdbKey(env: Env): string {
  const key = (env.TMDB_API_KEY || "").trim();
  if (!key) {
    throw new Error("TMDB_API_KEY is not configured on the worker");
  }
  return key;
}

function requireGiphyKey(env: Env): string {
  const key = (env.GIPHY_API_KEY || "").trim();
  if (!key) {
    throw new Error("GIPHY_API_KEY is not configured on the worker");
  }
  return key;
}

function requireKlipyKey(env: Env): string {
  const key = (env.KLIPY_APP_KEY || "").trim();
  if (!key) {
    throw new Error("KLIPY_APP_KEY is not configured on the worker");
  }
  return key;
}

async function tmdbFetch<T>(env: Env, path: string, params: Record<string, string | number | boolean | undefined>): Promise<T> {
  const apiKey = requireTmdbKey(env);
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TMDB ${response.status}: ${body.slice(0, 240)}`);
  }

  return response.json() as Promise<T>;
}

async function giphyFetch<T>(env: Env, path: string, params: Record<string, string | number | boolean | undefined>): Promise<T> {
  const apiKey = requireGiphyKey(env);
  const url = new URL(`https://api.giphy.com/v1/gifs/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Giphy ${response.status}: ${body.slice(0, 240)}`);
  }

  return response.json() as Promise<T>;
}

async function klipyFetch<T>(
  env: Env,
  endpoint: "search" | "trending",
  params: Record<string, string | number | boolean | undefined>,
  userAgent: string,
): Promise<T> {
  const appKey = requireKlipyKey(env);
  const url = new URL(`https://api.klipy.com/api/v1/${appKey}/gifs/${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`KLIPY ${response.status}: ${body.slice(0, 240)}`);
  }

  return response.json() as Promise<T>;
}

function normalizeStoredSuggestion(raw: unknown): StoredSuggestion | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const movieId = Number(record.movieId);
  const movieTitle = String(record.movieTitle || "").trim();
  const username = String(record.username || "").trim();
  if (!Number.isFinite(movieId) || movieId <= 0 || !movieTitle || !username) return null;

  const tsFromIso = record.timestamp ? Date.parse(String(record.timestamp)) : Number.NaN;
  const ts = typeof record.ts === "number" && Number.isFinite(record.ts)
    ? record.ts
    : Number.isFinite(tsFromIso)
      ? tsFromIso
      : Date.now();

  const posterRaw = record.posterPath;
  const posterPath = posterRaw && posterRaw !== "null" ? String(posterRaw) : null;

  return {
    key: String(record.key || `suggestion-${ts}`),
    movieId,
    movieTitle,
    username,
    posterPath,
    releaseYear: record.releaseYear ? String(record.releaseYear) : null,
    up: Number(record.up) || 0,
    down: Number(record.down) || 0,
    ts,
  };
}

function toLegacySuggestion(entry: StoredSuggestion) {
  return {
    key: entry.key,
    movieId: entry.movieId,
    movieTitle: entry.movieTitle,
    username: entry.username,
    posterPath: entry.posterPath,
    up: entry.up,
    down: entry.down,
    ts: entry.ts,
  };
}

function toHistoryResult(entry: StoredSuggestion) {
  return {
    ...toLegacySuggestion(entry),
    releaseYear: entry.releaseYear,
    timestamp: new Date(entry.ts).toISOString(),
  };
}

function normalizeMovie(movie: TmdbMovieResult) {
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : null;
  return {
    id: movie.id,
    title: movie.title,
    posterPath: movie.poster_path || null,
    releaseYear,
    releaseDate: movie.release_date || null,
    voteAverage: movie.vote_average ?? null,
    overview: movie.overview || "",
  };
}

async function readHistory(env: Env): Promise<StoredSuggestion[]> {
  const raw = await env.MOVIE_SUGGESTIONS.get(HISTORY_KEY, "json");
  if (!Array.isArray(raw)) return [];
  const items: StoredSuggestion[] = [];
  for (const entry of raw) {
    const normalized = normalizeStoredSuggestion(entry);
    if (normalized) items.push(normalized);
  }
  return items;
}

async function writeHistory(env: Env, items: StoredSuggestion[]): Promise<void> {
  await env.MOVIE_SUGGESTIONS.put(HISTORY_KEY, JSON.stringify(items));
}

function parsePositiveInt(value: string | null, fallback: number, max: number): number {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

function pickParams(url: URL, keys: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = url.searchParams.get(key);
    if (value != null && value !== "") out[key] = value;
  }
  return out;
}

function isAllowedTmdbPath(path: string): boolean {
  const normalized = path.replace(/^\/+/, "").toLowerCase();
  if (!normalized || normalized.includes("..")) return false;
  return ALLOWED_TMDB_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

async function handleGiphyProxy(env: Env, requestUrl: URL, endpoint: "search" | "trending", corsOrigin: string | null): Promise<Response> {
  const params: Record<string, string | number | boolean | undefined> = {};
  requestUrl.searchParams.forEach((value, key) => {
    if (key === "api_key") return;
    params[key] = value;
  });

  if (!params.rating) params.rating = "pg-13";
  if (!params.limit) params.limit = "50";

  const data = await giphyFetch(env, endpoint, params);
  return json(data, {}, corsOrigin);
}

async function handleKlipyProxy(
  env: Env,
  request: Request,
  requestUrl: URL,
  endpoint: "search" | "trending",
  corsOrigin: string | null,
): Promise<Response> {
  const params: Record<string, string | number | boolean | undefined> = {};
  requestUrl.searchParams.forEach((value, key) => {
    if (key === "app_key" || key === "api_key") return;
    params[key] = value;
  });

  if (!params.locale) params.locale = "us";
  if (!params.content_filter) params.content_filter = "high";
  if (!params.format_filter) params.format_filter = "gif,jpg";
  if (!params.per_page) params.per_page = "50";
  if (!params.page) params.page = "1";

  const userAgent = request.headers.get("User-Agent") || "BillTube/1.0";
  const data = await klipyFetch(env, endpoint, params, userAgent);
  return json(data, {}, corsOrigin);
}

async function handleKlipyShare(
  env: Env,
  request: Request,
  slug: string,
  corsOrigin: string | null,
): Promise<Response> {
  const normalizedSlug = slug.replace(/^\/+/, "").trim();
  if (!normalizedSlug || normalizedSlug.includes("..")) {
    return errorResponse(400, "Invalid KLIPY slug", corsOrigin);
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return errorResponse(400, "Invalid JSON body", corsOrigin);
  }

  const appKey = requireKlipyKey(env);
  const url = `https://api.klipy.com/api/v1/${appKey}/gifs/share/${encodeURIComponent(normalizedSlug)}`;
  const userAgent = request.headers.get("User-Agent") || "BillTube/1.0";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": userAgent,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    return errorResponse(response.status, `KLIPY share failed: ${text.slice(0, 240)}`, corsOrigin);
  }

  const data = await response.json().catch(() => ({}));
  return json(data, {}, corsOrigin);
}

async function handleTmdbProxy(env: Env, requestUrl: URL, tmdbPath: string, corsOrigin: string | null): Promise<Response> {
  if (!isAllowedTmdbPath(tmdbPath)) {
    return errorResponse(403, "TMDB path not allowed", corsOrigin);
  }

  const params: Record<string, string | number | boolean | undefined> = {};
  requestUrl.searchParams.forEach((value, key) => {
    if (key === "api_key") return;
    params[key] = value;
  });

  const data = await tmdbFetch(env, `/${tmdbPath}`, params);
  return json(data, {}, corsOrigin);
}

async function handleMeta(corsOrigin: string | null): Promise<Response> {
  return json({
    sortOptions: SORT_OPTIONS,
    discoverFilters: DISCOVER_FILTER_KEYS,
    searchFilters: SEARCH_FILTER_KEYS,
    defaults: {
      sortBy: "popularity.desc",
      language: "en-US",
      includeAdult: false,
    },
  }, {}, corsOrigin);
}

async function handleGenres(env: Env, url: URL, corsOrigin: string | null): Promise<Response> {
  const language = url.searchParams.get("language") || "en-US";
  const cacheKey = `cache:genres:${language}`;
  const cached = await env.MOVIE_SUGGESTIONS.get(cacheKey, "json");
  if (cached) {
    return json(cached, {}, corsOrigin);
  }

  const data = await tmdbFetch<{ genres: Array<{ id: number; name: string }> }>(env, "/genre/movie/list", {
    language,
  });

  const payload = { genres: data.genres || [] };
  await env.MOVIE_SUGGESTIONS.put(cacheKey, JSON.stringify(payload), {
    expirationTtl: GENRES_CACHE_TTL_SEC,
  });

  return json(payload, {}, corsOrigin);
}

async function handleSearch(env: Env, url: URL, corsOrigin: string | null): Promise<Response> {
  const query = (url.searchParams.get("query") || "").trim();
  const page = parsePositiveInt(url.searchParams.get("page"), 1, 500);
  const language = url.searchParams.get("language") || "en-US";
  const sortBy = url.searchParams.get("sort_by") || "popularity.desc";

  let tmdbData: TmdbPagedResponse<TmdbMovieResult>;

  if (query) {
    const searchParams: Record<string, string | number | boolean | undefined> = {
      query,
      page,
      language,
      include_adult: url.searchParams.get("include_adult") === "true",
      ...pickParams(url, SEARCH_FILTER_KEYS),
    };
    tmdbData = await tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(env, "/search/movie", searchParams);
  } else {
    const discoverParams: Record<string, string | number | boolean | undefined> = {
      page,
      language,
      sort_by: sortBy,
      include_adult: url.searchParams.get("include_adult") === "true",
      include_video: false,
      ...pickParams(url, DISCOVER_FILTER_KEYS),
    };
    tmdbData = await tmdbFetch<TmdbPagedResponse<TmdbMovieResult>>(env, "/discover/movie", discoverParams);
  }

  return json({
    mode: query ? "search" : "discover",
    page: tmdbData.page,
    totalPages: tmdbData.total_pages,
    totalResults: tmdbData.total_results,
    results: (tmdbData.results || []).map(normalizeMovie),
  }, {}, corsOrigin);
}

async function handleLegacyList(env: Env, corsOrigin: string | null): Promise<Response> {
  const all = await readHistory(env);
  return json(all.map(toLegacySuggestion), {}, corsOrigin);
}

async function handleHistory(env: Env, url: URL, corsOrigin: string | null): Promise<Response> {
  const page = parsePositiveInt(url.searchParams.get("page"), 1, 1000);
  const limit = parsePositiveInt(url.searchParams.get("limit"), DEFAULT_HISTORY_PAGE_SIZE, 50);
  const all = await readHistory(env);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);

  return json({
    page,
    limit,
    total,
    totalPages,
    results: items.map(toHistoryResult),
  }, {}, corsOrigin);
}

async function handleCreateSuggestion(request: Request, env: Env, corsOrigin: string | null, legacyResponse = false): Promise<Response> {
  let body: SuggestionInput;
  try {
    body = await request.json() as SuggestionInput;
  } catch {
    return errorResponse(400, "Invalid JSON body", corsOrigin);
  }

  const movieId = Number(body.movieId);
  const movieTitle = (body.movieTitle || "").trim();
  const username = (body.username || "").trim();

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return errorResponse(400, "movieId is required", corsOrigin);
  }
  if (!movieTitle) {
    return errorResponse(400, "movieTitle is required", corsOrigin);
  }
  if (!username) {
    return errorResponse(400, "username is required", corsOrigin);
  }

  const posterPath = body.posterPath && body.posterPath !== "null" ? String(body.posterPath) : null;
  const releaseYear = body.releaseYear ? String(body.releaseYear) : null;
  const ts = Date.now();

  const entry: StoredSuggestion = {
    key: `suggestion-${ts}`,
    movieId,
    movieTitle,
    username,
    posterPath,
    releaseYear,
    up: 0,
    down: 0,
    ts,
  };

  const history = await readHistory(env);
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.length = MAX_HISTORY;
  }
  await writeHistory(env, history);

  if (legacyResponse) {
    return json(toLegacySuggestion(entry), { status: 201 }, corsOrigin);
  }

  return json({ ok: true, suggestion: toHistoryResult(entry) }, { status: 201 }, corsOrigin);
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const corsOrigin = resolveCorsOrigin(request, env);

  if (request.method === "OPTIONS") {
    const headers = new Headers();
    applyCors(headers, corsOrigin);
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  try {
    if (request.method === "GET" && path === "/") {
      return handleLegacyList(env, corsOrigin);
    }

    if (request.method === "POST" && path === "/") {
      return handleCreateSuggestion(request, env, corsOrigin, true);
    }

    if (request.method === "GET" && path === "/api/meta") {
      return handleMeta(corsOrigin);
    }

    if (request.method === "GET" && path === "/api/genres") {
      return handleGenres(env, url, corsOrigin);
    }

    if (request.method === "GET" && path === "/api/search") {
      return handleSearch(env, url, corsOrigin);
    }

    if (request.method === "GET" && path === "/api/history") {
      return handleHistory(env, url, corsOrigin);
    }

    if (request.method === "GET" && path.startsWith("/api/tmdb/")) {
      const tmdbPath = path.slice("/api/tmdb/".length);
      return handleTmdbProxy(env, url, tmdbPath, corsOrigin);
    }

    if (request.method === "GET" && path === "/api/giphy/search") {
      return handleGiphyProxy(env, url, "search", corsOrigin);
    }

    if (request.method === "GET" && path === "/api/giphy/trending") {
      return handleGiphyProxy(env, url, "trending", corsOrigin);
    }

    if (request.method === "GET" && path === "/api/klipy/search") {
      return handleKlipyProxy(env, request, url, "search", corsOrigin);
    }

    if (request.method === "GET" && path === "/api/klipy/trending") {
      return handleKlipyProxy(env, request, url, "trending", corsOrigin);
    }

    if (request.method === "POST" && path.startsWith("/api/klipy/share/")) {
      const slug = path.slice("/api/klipy/share/".length);
      return handleKlipyShare(env, request, slug, corsOrigin);
    }

    if (request.method === "POST" && path === "/api/suggestions") {
      return handleCreateSuggestion(request, env, corsOrigin, false);
    }

    return errorResponse(404, "Not found", corsOrigin);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[movies-storage]", message);
    const status = message.includes("TMDB_API_KEY") || message.includes("GIPHY_API_KEY") || message.includes("KLIPY_APP_KEY") ? 503 : 500;
    return errorResponse(status, message, corsOrigin);
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
