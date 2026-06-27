/* BTFW — util:themeRuntime (shared appearance presets, CSS vars, typography) */
BTFW.define("util:themeRuntime", [], async () => {
  const CRITICAL_FONT_WEIGHTS = [400, 500, 600];
  const GOOGLE_FONT_WEIGHT_QUERY = CRITICAL_FONT_WEIGHTS.join(";");

  const TINT_PRESETS = {
    midnight: {
      name: "Midnight Pulse",
      colors: {
        background: "#0d0d0d",
        surface: "#090d15",
        panel: "#191b24",
        text: "#e8ecfb",
        chatText: "#d4defd",
        accent: "#191434"
      }
    },
    aurora: {
      name: "Aurora Bloom",
      colors: {
        background: "#02121c",
        surface: "#071b28",
        panel: "#10273b",
        text: "#e9fbff",
        chatText: "#d0ebff",
        accent: "#4dd0f6"
      }
    },
    sunset: {
      name: "Sunset Neon",
      colors: {
        background: "#13030c",
        surface: "#1b0813",
        panel: "#26101d",
        text: "#ffe7f1",
        chatText: "#ffcade",
        accent: "#ff6b9d"
      }
    },
    ember: {
      name: "Ember Forge",
      colors: {
        background: "#110802",
        surface: "#190d05",
        panel: "#24140a",
        text: "#fbe3c9",
        chatText: "#f6cea3",
        accent: "#ff914d"
      }
    },
    continental: {
      name: "Continental Royal",
      iconPack: "continental",
      colors: {
        background: "#0a1628",
        surface: "#0f1f3d",
        panel: "#2a1520",
        text: "#f5f0e6",
        chatText: "#e8dcc8",
        accent: "#ffcc00"
      }
    }
  };

  const FONT_PRESETS = {
    inter: {
      name: "Inter",
      family: "'Inter', 'Segoe UI', sans-serif",
      google: `Inter:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    roboto: {
      name: "Roboto",
      family: "'Roboto', 'Segoe UI', sans-serif",
      google: `Roboto:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    poppins: {
      name: "Poppins",
      family: "'Poppins', 'Segoe UI', sans-serif",
      google: `Poppins:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    montserrat: {
      name: "Montserrat",
      family: "'Montserrat', 'Segoe UI', sans-serif",
      google: `Montserrat:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    opensans: {
      name: "Open Sans",
      family: "'Open Sans', 'Segoe UI', sans-serif",
      google: `Open+Sans:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    lato: {
      name: "Lato",
      family: "'Lato', 'Segoe UI', sans-serif",
      google: `Lato:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    nunito: {
      name: "Nunito",
      family: "'Nunito', 'Segoe UI', sans-serif",
      google: `Nunito:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    manrope: {
      name: "Manrope",
      family: "'Manrope', 'Segoe UI', sans-serif",
      google: `Manrope:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    outfit: {
      name: "Outfit",
      family: "'Outfit', 'Segoe UI', sans-serif",
      google: `Outfit:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    },
    urbanist: {
      name: "Urbanist",
      family: "'Urbanist', 'Segoe UI', sans-serif",
      google: `Urbanist:wght@${GOOGLE_FONT_WEIGHT_QUERY}`
    }
  };

  const FONT_DEFAULT_ID = "inter";
  const FONT_FALLBACK_FAMILY = FONT_PRESETS[FONT_DEFAULT_ID].family;
  const THEME_FONT_LINK_ID = "btfw-theme-font";
  const THEME_FONT_PRELOAD_LINK_ID = `${THEME_FONT_LINK_ID}-preload`;
  const THEME_FONT_PREVIEW_LINK_ID = `${THEME_FONT_LINK_ID}-preview`;
  const PREVIEW_FONT_WEIGHTS = [...CRITICAL_FONT_WEIGHTS];
  const previewFontLoadCache = new Map();
  const previewStylesheetPromises = new Map();

  const COLOR_KEYS = ["background", "surface", "panel", "text", "chatText", "accent"];
  const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

  const DEFAULT_APPEARANCE = {
    tint: "midnight",
    colors: { ...TINT_PRESETS.midnight.colors },
    typography: {
      preset: FONT_DEFAULT_ID,
      customFamily: ""
    },
    iconPack: "",
    icons: {}
  };

  function cloneAppearance(source) {
    return JSON.parse(JSON.stringify(source || DEFAULT_APPEARANCE));
  }

  function normalizeFontId(id) {
    if (!id) return FONT_DEFAULT_ID;
    const str = String(id).trim().toLowerCase();
    if (str === "custom") return "custom";
    return str.replace(/[^a-z0-9]+/g, "");
  }

  function getFontPreset(id) {
    const key = normalizeFontId(id);
    if (key === "custom") return null;
    return FONT_PRESETS[key] || null;
  }

  function buildGoogleFontUrl(name, weights = null) {
    if (!name) return "";
    const trimmed = name.trim();
    if (!trimmed) return "";
    const encoded = trimmed.replace(/\s+/g, "+");
    const weightQuery = weights
      ? (Array.isArray(weights) ? weights.join(";") : weights)
      : CRITICAL_FONT_WEIGHTS.join(";");
    return `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weightQuery}&display=swap`;
  }

  function resolveTypographyConfig(typo) {
    const presetId = normalizeFontId(typo?.preset || FONT_DEFAULT_ID);
    const isCustom = presetId === "custom";
    const preset = getFontPreset(presetId) || getFontPreset(FONT_DEFAULT_ID);
    const customName = (typo?.customFamily || "").trim();
    const family = isCustom && customName
      ? `'${customName.replace(/'/g, "\\'")}', ${FONT_FALLBACK_FAMILY}`
      : (preset?.family || FONT_FALLBACK_FAMILY);
    let url = preset?.google
      ? `https://fonts.googleapis.com/css2?family=${preset.google}&display=swap`
      : "";
    if (isCustom && customName) {
      url = buildGoogleFontUrl(customName);
    }
    return {
      preset: isCustom ? "custom" : (preset ? normalizeFontId(presetId) : FONT_DEFAULT_ID),
      label: isCustom && customName ? customName : (preset?.name || "Inter"),
      family,
      url: url || ""
    };
  }

  function isValidAssetUrl(url) {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
      const parsed = new URL(trimmed, typeof document !== "undefined" ? document.baseURI : undefined);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function ensureStylesheetLink(id, url) {
    if (typeof document === "undefined" || !document.head) return;
    let link = document.getElementById(id);
    const href = isValidAssetUrl(url) ? url.trim() : "";
    if (href) {
      if (!link) {
        link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.setAttribute("crossorigin", "anonymous");
        link.setAttribute("href", href);
        document.head.appendChild(link);
        return;
      }
      if (link.rel !== "stylesheet") link.rel = "stylesheet";
      if (link.getAttribute("crossorigin") !== "anonymous") {
        link.setAttribute("crossorigin", "anonymous");
      }
      if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    } else if (link?.parentElement) {
      link.parentElement.removeChild(link);
    }
  }

  function ensureFontPreloadLink(id, url) {
    if (typeof document === "undefined" || !document.head) return;
    let link = document.getElementById(id);
    const href = isValidAssetUrl(url) ? url.trim() : "";
    if (href) {
      if (!link) {
        link = document.createElement("link");
        link.id = id;
        link.rel = "preload";
        link.as = "style";
        link.setAttribute("crossorigin", "anonymous");
        link.setAttribute("href", href);
        document.head.appendChild(link);
        return;
      }
      if (link.getAttribute("href") !== href) link.setAttribute("href", href);
    } else if (link?.parentElement) {
      link.parentElement.removeChild(link);
    }
  }

  function extractPrimaryFontFamily(family) {
    if (!family) return "";
    const first = String(family).split(",")[0] || "";
    return first.replace(/['"]/g, "").trim();
  }

  function waitForFontFamilyLoad(name) {
    if (!name || typeof document === "undefined") return Promise.resolve(false);
    const fontSet = document.fonts;
    if (!fontSet || typeof fontSet.load !== "function") return Promise.resolve(false);
    if (typeof fontSet.check === "function") {
      try {
        if (fontSet.check(`1rem "${name}"`)) return Promise.resolve(true);
      } catch (_) {}
    }
    const requests = PREVIEW_FONT_WEIGHTS.map((weight) => {
      const spec = `${weight} 1rem "${name}"`;
      try {
        return fontSet.load(spec);
      } catch {
        try {
          return fontSet.load(`1rem "${name}"`);
        } catch {
          return Promise.resolve();
        }
      }
    });
    return Promise.all(requests).then(() => true).catch(() => false);
  }

  function ensurePreviewFontStylesheet(url) {
    if (typeof document === "undefined" || !document.head) return Promise.resolve(null);
    const existing = document.getElementById(THEME_FONT_PREVIEW_LINK_ID);
    if (!url) {
      existing?.parentElement?.removeChild(existing);
      return Promise.resolve(null);
    }
    if (existing && existing.getAttribute("href") === url) {
      if (existing.dataset.btfwLoaded === "1") return Promise.resolve(existing);
      if (previewStylesheetPromises.has(url)) return previewStylesheetPromises.get(url);
      const wait = new Promise((resolve) => {
        const finalize = () => resolve(existing);
        existing.addEventListener("load", () => {
          existing.dataset.btfwLoaded = "1";
          finalize();
        }, { once: true });
        existing.addEventListener("error", finalize, { once: true });
      });
      previewStylesheetPromises.set(url, wait);
      return wait.finally(() => { previewStylesheetPromises.delete(url); });
    }
    existing?.parentElement?.removeChild(existing);
    const link = document.createElement("link");
    link.id = THEME_FONT_PREVIEW_LINK_ID;
    link.rel = "stylesheet";
    link.dataset.btfwScope = "preview";
    const promise = new Promise((resolve) => {
      const finalize = () => resolve(link);
      link.addEventListener("load", () => {
        link.dataset.btfwLoaded = "1";
        finalize();
      }, { once: true });
      link.addEventListener("error", finalize, { once: true });
    });
    link.href = url;
    document.head.appendChild(link);
    previewStylesheetPromises.set(url, promise);
    return promise.finally(() => { previewStylesheetPromises.delete(url); });
  }

  function ensurePreviewFontAssets(resolved) {
    if (!resolved) return;
    const url = resolved.url || "";
    if (!url) return ensurePreviewFontStylesheet("");
    const family = extractPrimaryFontFamily(resolved.family);
    if (!family) return ensurePreviewFontStylesheet(url);
    const cacheKey = `${url}::${family}`;
    if (previewFontLoadCache.has(cacheKey)) return previewFontLoadCache.get(cacheKey);
    const loadPromise = ensurePreviewFontStylesheet(url)
      .then(() => waitForFontFamilyLoad(family))
      .catch(() => false);
    previewFontLoadCache.set(cacheKey, loadPromise);
    return loadPromise;
  }

  function applyLiveTypographyAssets(typography, options = {}) {
    const resolved = resolveTypographyConfig(typography);
    const scope = options.scope === "preview" ? "preview" : "runtime";
    const root = options.root || (typeof document !== "undefined" ? document.documentElement : null);
    if (root && resolved.family) {
      root.style.setProperty("--btfw-theme-font-family", resolved.family);
    }
    if (scope === "preview") {
      ensurePreviewFontAssets(resolved);
    } else {
      const fontUrl = resolved.url || "";
      ensureFontPreloadLink(THEME_FONT_PRELOAD_LINK_ID, fontUrl);
      ensureStylesheetLink(THEME_FONT_LINK_ID, fontUrl);
      const previewLink = document.getElementById(THEME_FONT_PREVIEW_LINK_ID);
      previewLink?.parentElement?.removeChild(previewLink);
    }
    return resolved;
  }

  function normalizeHexColor(value, fallback) {
    const str = String(value || "").trim();
    if (HEX_COLOR_RE.test(str)) return str.toLowerCase();
    return fallback;
  }

  function normalizeAppearanceConfig(cfg) {
    const base = cloneAppearance(DEFAULT_APPEARANCE);
    const input = cfg && typeof cfg === "object" ? cfg : {};
    const tint = TINT_PRESETS[input.tint] ? input.tint : (input.tint === "custom" ? "custom" : base.tint);
    const colors = { ...base.colors };
    const srcColors = input.colors && typeof input.colors === "object" ? input.colors : {};
    COLOR_KEYS.forEach((key) => {
      colors[key] = normalizeHexColor(srcColors[key], colors[key]);
    });
    if (tint !== "custom" && TINT_PRESETS[tint]) {
      Object.assign(colors, TINT_PRESETS[tint].colors);
    }
    const typoSrc = input.typography && typeof input.typography === "object" ? input.typography : {};
    const typography = {
      preset: normalizeFontId(typoSrc.preset || base.typography.preset),
      customFamily: typeof typoSrc.customFamily === "string" ? typoSrc.customFamily.trim() : ""
    };
    if (typography.preset !== "custom" && !getFontPreset(typography.preset)) {
      typography.preset = FONT_DEFAULT_ID;
    }
    let iconPack = typeof input.iconPack === "string" ? input.iconPack.trim().toLowerCase() : "";
    if (tint !== "custom" && TINT_PRESETS[tint]?.iconPack) {
      iconPack = iconPack || TINT_PRESETS[tint].iconPack;
    }
    const icons = {};
    const iconSrc = input.icons && typeof input.icons === "object" ? input.icons : {};
    Object.entries(iconSrc).forEach(([slotId, value]) => {
      if (typeof value === "string" && value.trim()) icons[slotId] = value.trim();
    });
    return { tint, colors, typography, iconPack, icons };
  }

  function extractAppearanceFromChannelConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return cloneAppearance(DEFAULT_APPEARANCE);
    return normalizeAppearanceConfig({
      tint: cfg.tint,
      colors: cfg.colors,
      typography: cfg.typography,
      iconPack: cfg.iconPack,
      icons: cfg.icons
    });
  }

  function applyRuntimeColors(theme) {
    if (!theme || typeof theme !== "object" || typeof document === "undefined") return;
    const colors = theme.colors && typeof theme.colors === "object" ? theme.colors : {};
    const root = document.documentElement;
    if (!root) return;
    const bg = colors.background || "#05060d";
    const surface = colors.surface || colors.panel || "#0b111d";
    const panel = colors.panel || "#141f36";
    const text = colors.text || "#e8ecfb";
    const chatText = colors.chatText || text;
    const accent = colors.accent || "#6d4df6";
    const map = {
      "--btfw-theme-bg": bg,
      "--btfw-theme-surface": surface,
      "--btfw-theme-panel": panel,
      "--btfw-theme-text": text,
      "--btfw-theme-chat-text": chatText,
      "--btfw-theme-accent": accent
    };
    Object.keys(map).forEach((key) => {
      if (map[key]) root.style.setProperty(key, map[key]);
    });
    root.setAttribute("data-btfw-theme-tint", theme.tint || "custom");
    try {
      document.dispatchEvent(new CustomEvent("btfw:channelThemeTint", {
        detail: {
          tint: theme.tint || "custom",
          colors: { bg, surface, panel, text, chat: chatText, accent },
          config: theme
        }
      }));
    } catch (_) {}
  }

  function applyRuntimeTypography(theme) {
    if (!theme || typeof theme !== "object") return null;
    const typography = theme.typography && typeof theme.typography === "object"
      ? theme.typography
      : {};
    const resolved = applyLiveTypographyAssets(typography, { scope: "runtime" });
    typography.resolvedFamily = resolved.family;
    return resolved;
  }

  function applyUserAppearance(config, options = {}) {
    const normalized = normalizeAppearanceConfig(config);
    const scope = options.scope === "preview" ? "preview" : "runtime";
    applyRuntimeColors(normalized);
    if (scope === "preview") {
      applyLiveTypographyAssets(normalized.typography, { scope: "preview" });
    } else {
      applyRuntimeTypography(normalized);
    }
    try {
      document.dispatchEvent(new CustomEvent("btfw:userThemeApplied", {
        detail: { config: normalized, scope }
      }));
    } catch (_) {}
    return normalized;
  }

  function revertToChannelAppearance() {
    const channel = typeof window !== "undefined" ? window.BTFW_THEME_ADMIN : null;
    if (channel && typeof channel === "object") {
      const appearance = extractAppearanceFromChannelConfig(channel);
      applyUserAppearance(appearance);
      return appearance;
    }
    applyUserAppearance(cloneAppearance(DEFAULT_APPEARANCE));
    return cloneAppearance(DEFAULT_APPEARANCE);
  }

  return {
    TINT_PRESETS,
    FONT_PRESETS,
    FONT_DEFAULT_ID,
    FONT_FALLBACK_FAMILY,
    COLOR_KEYS,
    DEFAULT_APPEARANCE,
    cloneAppearance,
    normalizeAppearanceConfig,
    extractAppearanceFromChannelConfig,
    normalizeFontId,
    getFontPreset,
    resolveTypographyConfig,
    applyLiveTypographyAssets,
    applyRuntimeColors,
    applyRuntimeTypography,
    applyUserAppearance,
    revertToChannelAppearance
  };
});
