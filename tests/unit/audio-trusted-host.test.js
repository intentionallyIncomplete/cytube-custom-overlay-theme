import { test } from "node:test";
import assert from "node:assert/strict";

const DEFAULT_CORS_PROXY = "https://vidprox.movies-storage-a.workers.dev/?url=";

function getCorsProxyOrigin(corsProxy = DEFAULT_CORS_PROXY) {
  try {
    return new URL(corsProxy).origin.toLowerCase();
  } catch {
    return "";
  }
}

/** Mirrors BTFW_AUDIO._isTrusted — CORS video proxies (configured + vidprox.*). */
function isTrusted(urlStr, corsProxy = DEFAULT_CORS_PROXY) {
  if (!urlStr) return false;
  if (String(urlStr).includes(corsProxy)) return true;
  try {
    const parsed = new URL(urlStr);
    const origin = parsed.origin.toLowerCase();
    const proxyOrigin = getCorsProxyOrigin(corsProxy);
    if (proxyOrigin && origin === proxyOrigin) return true;
    return /^vidprox\./i.test(parsed.hostname);
  } catch {
    return false;
  }
}

function unwrapProxiedUrl(urlStr, corsProxy = DEFAULT_CORS_PROXY) {
  if (!urlStr || !isTrusted(urlStr, corsProxy)) return urlStr;
  try {
    const nested = new URL(urlStr).searchParams.get("url");
    return nested || urlStr;
  } catch {
    return urlStr;
  }
}

function hasAnonymousCrossOrigin(el) {
  if (!el) return false;
  return el.crossOrigin === "anonymous" || el.getAttribute("crossorigin") === "anonymous";
}

/** Mirrors the guard in BTFW_AUDIO._ensureAnonymousCrossOrigin */
function canEnableAnonymousCrossOrigin(currentSrc, corsProxy = DEFAULT_CORS_PROXY) {
  if (!currentSrc) return true;
  return isTrusted(currentSrc, corsProxy);
}

test("trusts only the CORS video proxy host", () => {
  assert.equal(
    isTrusted("https://vidprox.movies-storage-a.workers.dev/?url=https%3A%2F%2Fexample.com%2Fv.mp4"),
    true
  );
  assert.equal(isTrusted("https://vidprox.movies-storage-a.workers.dev/other"), true);
});

test("trusts sibling vidprox.* CORS proxies", () => {
  assert.equal(
    isTrusted(
      "https://vidprox.movies-storage-a.workers.dev/?url=https%3A%2F%2Fsweet-pine.example%2Fv.mp4"
    ),
    true
  );
});

test("rejects other workers.dev CDNs that lack Web Audio CORS", () => {
  assert.equal(
    isTrusted(
      "https://quiglysmovies.playerquigly.workers.dev/download.aspx?file=abc"
    ),
    false
  );
  assert.equal(isTrusted("https://empty-bar-d620.movies-storage-a.workers.dev/x"), false);
  assert.equal(isTrusted("https://cytube.moviesstoragea.workers.dev/video.mp4"), false);
});

test("rejects non-proxy hosts", () => {
  assert.equal(isTrusted("https://example.com/video.mp4"), false);
  assert.equal(isTrusted("not-a-url"), false);
  assert.equal(isTrusted(""), false);
});

test("detects anonymous crossOrigin on media element", () => {
  const el = { crossOrigin: "anonymous", getAttribute: () => null };
  assert.equal(hasAnonymousCrossOrigin(el), true);

  const unset = { crossOrigin: null, getAttribute: (name) => (name === "crossorigin" ? "anonymous" : null) };
  assert.equal(hasAnonymousCrossOrigin(unset), true);

  const missing = { crossOrigin: null, getAttribute: () => null };
  assert.equal(hasAnonymousCrossOrigin(missing), false);
});

test("blocks crossOrigin enable while currentSrc is a non-CORS movie CDN", () => {
  assert.equal(
    canEnableAnonymousCrossOrigin(
      "https://quiglysmovies.playerquigly.workers.dev/download.aspx?file=abc"
    ),
    false
  );
});

test("allows crossOrigin enable once currentSrc is on a vidprox", () => {
  assert.equal(
    canEnableAnonymousCrossOrigin(
      "https://vidprox.movies-storage-a.workers.dev/?url=https%3A%2F%2Fquiglysmovies.example%2Fv.mp4"
    ),
    true
  );
  assert.equal(
    canEnableAnonymousCrossOrigin(
      "https://vidprox.movies-storage-a.workers.dev/?url=https%3A%2F%2Fcdn.example%2Fv.mp4"
    ),
    true
  );
});

test("unwraps nested url from a CORS proxy for restore on disable", () => {
  const bare = "https://quiglysmovies.playerquigly.workers.dev/download.aspx?file=abc";
  const proxied = `${DEFAULT_CORS_PROXY}${encodeURIComponent(bare)}`;
  assert.equal(unwrapProxiedUrl(proxied), bare);
  assert.equal(unwrapProxiedUrl(bare), bare);
});
