const CDN_BASE = "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/cytube-custom-overlay-theme@v1.21.1";

// CyTube defers video.js plugins; wait until resolution switcher registers before player init.
(function () {
  var PLUGIN = "videoJsResolutionSwitcher";
  function wrap(fn) {
    if (!fn || fn._btfwVjsPluginWait) return fn;
    function patched(obj, key, cb) {
      if (obj === window && key === "videojs") {
        return fn(obj, key, function () {
          var deadline = Date.now() + 5000;
          (function tick() {
            var vjs = window.videojs;
            var ok = vjs && typeof vjs.getPlugin === "function" && vjs.getPlugin(PLUGIN);
            if (ok || Date.now() > deadline) return cb();
            setTimeout(tick, 25);
          })();
        });
      }
      return fn(obj, key, cb);
    }
    patched._btfwVjsPluginWait = true;
    return patched;
  }
  function install() {
    if (typeof window.waitUntilDefined === "function") {
      window.waitUntilDefined = wrap(window.waitUntilDefined);
    }
  }
  install();
  var n = 0;
  var t = setInterval(function () { install(); if (++n > 40) clearInterval(t); }, 50);
})();

// BTFW_THEME_ADMIN_START
window.BTFW_THEME_ADMIN = {
  "version": 6,
  "tint": "custom",
  "colors": {
    "background": "#110802",
    "surface": "#190d05",
    "panel": "#211b17",
    "text": "#fbe3c9",
    "chatText": "#e6caad",
    "accent": "#d97436"
  },
  "typography": {
    "preset": "nunito",
    "customFamily": ""
  },
  "integrations": {
    "enabled": true
  },
  "resources": {
    "scripts": [],
    "styles": [],
    "modules": []
  },
  "branding": {
    "headerName": "Quiglytube Slim (Experimental)"
  }
};
// BTFW_THEME_ADMIN_END

// BTFW_LOADER_SENTINEL
(function (W, D) {
  var FILE = "billtube-fw.js";

  // Already loaded/applied? bail.
  if (W.BTFW && W.BTFW.init) { console.debug("[BTFW] already present; skip"); return; }
  if (D.querySelector('script[data-btfw-loader]')) { console.debug("[BTFW] loader tag exists; skip"); return; }
  if (D.getElementById("btfw-grid")) { console.debug("[BTFW] layout present; skip"); return; }

  var primary = CDN_BASE + "/" + FILE;

  function inject(src, attr) {
    var s = D.createElement("script");
    s.src = src;
    s.async = false;
    s.defer = false;
    s.dataset.btfwLoader = "1";
    if (attr) Object.keys(attr).forEach(function (k) { s.setAttribute(k, attr[k]); });
    D.head.appendChild(s);
    return s;
  }
  // Primary load
  var tag = inject(primary);

  tag.onerror = function () {
    console.warn("[BTFW] primary failed, retrying same pin");
    inject(CDN_BASE + "/" + FILE + "?" + Date.now(), { "data-btfw-fallback": "1" });
  };
})(window, document);
