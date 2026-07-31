import test from "node:test";
import assert from "node:assert/strict";

const KLIPY_SEARCH_PATH = "/api/klipy/search";
const KLIPY_TRENDING_PATH = "/api/klipy/trending";
const DEFAULT_WORKER_BASE = "https://empty-bar-d620.movies-storage-a.workers.dev";

function buildKlipyProxyUrl(base, endpoint, params = {}) {
  const path = endpoint === "search" ? KLIPY_SEARCH_PATH : KLIPY_TRENDING_PATH;
  const url = new URL(`${base.replace(/\/+$/, "")}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function mapKlipyResults(json) {
  const rows = (json && json.data && Array.isArray(json.data.data)) ? json.data.data : [];
  return rows.map((item) => {
    if (!item || item.type === "ad") return null;
    const slug = item.slug || "";
    const id = String(item.id || slug || "");
    if (!id) return null;
    const file = item.file || {};
    const thumb = file.sm?.gif?.url || file.xs?.gif?.url || "";
    const urlClassic = file.hd?.gif?.url || file.md?.gif?.url || file.sm?.gif?.url || "";
    if (!urlClassic) return null;
    return { id, slug, provider: "klipy", thumb: thumb || urlClassic, urlClassic };
  }).filter(Boolean);
}

const klipyCdnFilter = {
  source: "(https?://static\\d*\\.klipy\\.com/[^\\s<]+)",
  flags: "gi",
  replace: "<span class=\"btfw-klipy-wrap\"><img class=\"klipy chat-picture\" src=\"\\1\" /></span>",
};

function pcreStyleReplace(filter, text) {
  const re = new RegExp(filter.source, filter.flags);
  return text.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

test("klipy proxy search URL has no app_key param", () => {
  const url = buildKlipyProxyUrl(DEFAULT_WORKER_BASE, "search", {
    q: "cat",
    per_page: "50",
    customer_id: "testuser",
  });
  const parsed = new URL(url);
  assert.equal(parsed.pathname, KLIPY_SEARCH_PATH);
  assert.equal(parsed.searchParams.get("q"), "cat");
  assert.equal(parsed.searchParams.get("app_key"), null);
  assert.equal(parsed.searchParams.get("api_key"), null);
});

test("klipy proxy trending URL", () => {
  const url = buildKlipyProxyUrl(DEFAULT_WORKER_BASE, "trending", { per_page: "24" });
  const parsed = new URL(url);
  assert.equal(parsed.pathname, KLIPY_TRENDING_PATH);
  assert.equal(parsed.searchParams.get("per_page"), "24");
});

test("mapKlipyResults extracts slug and cdn url", () => {
  const items = mapKlipyResults({
    data: {
      data: [{
        id: 123,
        slug: "hello-hi-662",
        type: "gif",
        file: {
          sm: { gif: { url: "https://static.klipy.com/sm.gif" } },
          hd: { gif: { url: "https://static.klipy.com/hd.gif" } },
        },
      }],
    },
  });
  assert.equal(items.length, 1);
  assert.equal(items[0].slug, "hello-hi-662");
  assert.equal(items[0].urlClassic, "https://static.klipy.com/hd.gif");
  assert.equal(items[0].provider, "klipy");
});

test("mapKlipyResults skips ad objects", () => {
  const items = mapKlipyResults({
    data: { data: [{ type: "ad", content: "<div>ad</div>" }] },
  });
  assert.equal(items.length, 0);
});

test("klipy cdn chat filter wraps image", () => {
  const url = "https://static1.klipy.com/path/to.gif";
  const out = pcreStyleReplace(klipyCdnFilter, url);
  assert.ok(out.includes("btfw-klipy-wrap"));
  assert.ok(out.includes('class="klipy chat-picture"'));
  assert.ok(out.includes(url));
  assert.doesNotMatch(out, /\\1/);
});
