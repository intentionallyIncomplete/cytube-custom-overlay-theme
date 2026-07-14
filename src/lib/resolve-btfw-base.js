/**
 * Resolve BillTube asset base URL from the fw loader script src.
 * Supports jsDelivr gh refs and generic origins (local dev server).
 */
export function resolveBtfwBaseFromScriptSrc(src, fallback) {
  if (!src || typeof src !== "string") {
    return fallback;
  }

  var jsdelivr = src.match(/^(https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/[^/]+@[^/]+)/);
  if (jsdelivr) {
    return jsdelivr[1];
  }

  try {
    var url = new URL(src);
    var basePath = url.pathname.replace(/\/[^/]*$/, "");
    if (/\/dist$/i.test(basePath)) {
      basePath = basePath.replace(/\/dist$/i, "") || "";
    }
    if (!basePath) {
      basePath = "";
    }
    return url.origin + basePath;
  } catch (_) {
    return fallback;
  }
}

export function resolveBtfwBase(doc, fallback) {
  var scripts = doc.getElementsByTagName("script");
  for (var i = scripts.length - 1; i >= 0; i--) {
    var src = scripts[i].src || "";
    if (!/billtube-fw\.js(?:\?|$)/.test(src)) {
      continue;
    }
    var base = resolveBtfwBaseFromScriptSrc(src, fallback);
    if (base !== fallback) {
      return base;
    }
  }

  console.warn(
    "[BTFW] Could not read version from billtube-fw.js URL; using fallback. Pin CDN_BASE in channel config to a release tag."
  );
  return fallback;
}
