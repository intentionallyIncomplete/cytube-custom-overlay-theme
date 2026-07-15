import { test } from "node:test";
import assert from "node:assert/strict";

const DEFAULT_CORS_PROXY = "https://vidprox.billtube.workers.dev/?url=";

function getCorsProxyOrigin(corsProxy = DEFAULT_CORS_PROXY) {
  try {
    return new URL(corsProxy).origin.toLowerCase();
  } catch {
    return "";
  }
}

/** Mirrors BTFW_AUDIO._isTrusted — only the CORS video proxy is trusted for Web Audio. */
function isTrusted(urlStr, corsProxy = DEFAULT_CORS_PROXY) {
  if (!urlStr) return false;
  if (String(urlStr).includes(corsProxy)) return true;
  try {
    const origin = new URL(urlStr).origin.toLowerCase();
    const proxyOrigin = getCorsProxyOrigin(corsProxy);
    return Boolean(proxyOrigin && origin === proxyOrigin);
  } catch {
    return false;
  }
}

function hasAnonymousCrossOrigin(el) {
  if (!el) return false;
  return el.crossOrigin === "anonymous" || el.getAttribute("crossorigin") === "anonymous";
}

test("trusts only the CORS video proxy host", () => {
  assert.equal(
    isTrusted("https://vidprox.billtube.workers.dev/?url=https%3A%2F%2Fexample.com%2Fv.mp4"),
    true
  );
  assert.equal(isTrusted("https://vidprox.billtube.workers.dev/other"), true);
});

test("rejects other workers.dev CDNs that lack Web Audio CORS", () => {
  assert.equal(
    isTrusted(
      "https://quiglysmovies.playerquigly.workers.dev/download.aspx?file=abc"
    ),
    false
  );
  assert.equal(isTrusted("https://empty-bar-d620.movies-storage-a.workers.dev/x"), false);
  assert.equal(isTrusted("https://cytube.billtube.workers.dev/video.mp4"), false);
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
