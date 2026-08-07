
BTFW.define("feature:player", [], async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const ASSET_BASE = window.BTFW?.BASE || "";

  function ensureStylesheet(href) {
    if (!href) return;
    const abs = href.startsWith("http") ? href : `${ASSET_BASE}/${href.replace(/^\//, "")}`;

    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      (l) => l.getAttribute("href") === abs || l.getAttribute("href") === href
    );
    if (exists) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    if (window.BTFW && window.BTFW.SRI && window.BTFW.SRI[href]) {
      link.integrity = window.BTFW.SRI[href];
      link.crossOrigin = "anonymous";
    }
    link.href = abs;
    document.head.appendChild(link);
  }

  function applyPlayerLayoutEnhancements() {
    const wrap = $("#videowrap");
    if (!wrap) return;

    ensureStylesheet("dist/css/player.css");

    wrap.classList.add("btfw-player-wrap");

    const controls = wrap.querySelector("#controlsrow, .player-controls");
    if (controls) {
      controls.classList.add("btfw-player-controls");
    }

    enhanceVideojsIfPresent();
  }

  function enhanceVideojsIfPresent() {
    if (!window.videojs) return;

    try {
      const playerEl = document.querySelector(".video-js");
      if (playerEl && !playerEl.classList.contains("btfw-vjs-enhanced")) {
        playerEl.classList.add("btfw-vjs-enhanced");
      }
    } catch (_) { }
  }

  function setupMutationObserver() {
    const wrap = $("#videowrap");
    if (!wrap) return;

    const observer = new MutationObserver(() => {
      enhanceVideojsIfPresent();
    });

    observer.observe(wrap, { childList: true, subtree: true });
  }

  function boot() {
    applyPlayerLayoutEnhancements();
    setupMutationObserver();

    try {
      const sock = window.socket;
      if (sock && typeof sock.on === "function") {
        sock.on("changeMedia", () => {
          setTimeout(applyPlayerLayoutEnhancements, 100);
        });
      }
    } catch (_) { }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  return {
    name: "feature:player",
    applyPlayerLayoutEnhancements
  };
});
