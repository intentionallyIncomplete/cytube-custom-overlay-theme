
BTFW.define("feature:styleCore", [], async () => {
  const CDN_FONT_AWESOME = "https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css";
  const CDN_BULMA = "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
  const CDN_BOOTSWATCH_P = "https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/paper/bootstrap.min.css";

  function hasStylesheet(hrefSubstring) {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
      l => (l.getAttribute("href") || "").includes(hrefSubstring)
    );
  }

  function appendCssIfMissing(id, href) {
    if (document.getElementById(id)) return;
    if (hasStylesheet(href)) return;

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    if (window.BTFW && window.BTFW.SRI && window.BTFW.SRI[href]) {
      link.integrity = window.BTFW.SRI[href];
      link.crossOrigin = "anonymous";
    }
    link.href = href;
    document.head.appendChild(link);
  }

  function ensureFontAwesome() {
    const hasFaWindow = !!window.FontAwesome;
    if (!hasFaWindow && !hasStylesheet("font-awesome")) {
      appendCssIfMissing("btfw-fa-css", CDN_FONT_AWESOME);
    }
  }

  function ensureBulma() {
    if (!hasStylesheet("bulma")) {
      appendCssIfMissing("btfw-bulma-css", CDN_BULMA);
    }
  }

  function ensureBootswatchTheme() {
    const hasBootstrap = hasStylesheet("bootstrap");
    if (!hasBootstrap) {
      appendCssIfMissing("btfw-bootswatch-paper", CDN_BOOTSWATCH_P);
    }
  }

  function ensureViewportMeta() {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1";
      document.head.appendChild(meta);
    }
  }

  function boot() {
    ensureViewportMeta();
    ensureFontAwesome();
    ensureBulma();
    ensureBootswatchTheme();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  return { name: "feature:styleCore" };
});
