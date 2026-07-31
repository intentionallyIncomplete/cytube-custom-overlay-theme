import test from "node:test";
import assert from "node:assert/strict";

const GIPHY_SEARCH_PATH = "/api/giphy/search";
const GIPHY_TRENDING_PATH = "/api/giphy/trending";
const DEFAULT_WORKER_BASE = "https://empty-bar-d620.movies-storage-a.workers.dev";

function buildGiphyProxyUrl(base, endpoint, params = {}) {
  const path = endpoint === "search" ? GIPHY_SEARCH_PATH : GIPHY_TRENDING_PATH;
  const url = new URL(`${base.replace(/\/+$/, "")}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function mapGiphyResults(json) {
  return (json.data || []).map((g) => {
    const id = g.id || "";
    const thumb = (g.images && (g.images.fixed_width_small?.url
      || g.images.fixed_width?.url
      || g.images.downsized_still?.url)) || "";
    const urlClassic = id ? `https://media1.giphy.com/media/${id}/giphy.gif` : "";
    return { id, provider: "giphy", thumb, urlClassic };
  });
}

test("giphy proxy search URL has no api_key param", () => {
  const url = buildGiphyProxyUrl(DEFAULT_WORKER_BASE, "search", { q: "cat", limit: "50", rating: "pg-13" });
  const parsed = new URL(url);
  assert.equal(parsed.pathname, GIPHY_SEARCH_PATH);
  assert.equal(parsed.searchParams.get("q"), "cat");
  assert.equal(parsed.searchParams.get("api_key"), null);
});

test("giphy proxy trending URL", () => {
  const url = buildGiphyProxyUrl(DEFAULT_WORKER_BASE, "trending", { limit: "50" });
  const parsed = new URL(url);
  assert.equal(parsed.pathname, GIPHY_TRENDING_PATH);
  assert.equal(parsed.searchParams.get("limit"), "50");
});

test("mapGiphyResults extracts id and classic url", () => {
  const items = mapGiphyResults({
    data: [{
      id: "abc123",
      images: { fixed_width_small: { url: "https://media.giphy.com/thumb.gif" } },
    }],
  });
  assert.equal(items.length, 1);
  assert.equal(items[0].id, "abc123");
  assert.equal(items[0].urlClassic, "https://media1.giphy.com/media/abc123/giphy.gif");
  assert.equal(items[0].provider, "giphy");
});
