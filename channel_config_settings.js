const CDN_BASE = "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/BillTube3-slim@v1.13.1";

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
