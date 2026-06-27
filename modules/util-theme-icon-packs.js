/* BTFW — util:themeIconPacks (gag-theme icon slot registry and pack resolution) */
BTFW.define("util:themeIconPacks", [], async () => {
  const ICON_SLOT_IDS = [
    "nav-theme",
    "nav-movie-request",
    "perf-rocket",
    "chat-emotes",
    "chat-gif",
    "chat-users",
    "stack-add-media",
    "stack-new-poll",
    "stack-edit-motd",
    "chat-commands-help"
  ];

  const ICON_SLOTS = {
    "nav-theme": {
      label: "Theme settings",
      defaultHtml: '<i class="fa fa-sliders" aria-hidden="true"></i>'
    },
    "nav-movie-request": {
      label: "Movie request",
      defaultHtml: '<i class="fa fa-film" aria-hidden="true"></i>'
    },
    "perf-rocket": {
      label: "Performance mode",
      defaultHtml: '<i class="fa fa-rocket" aria-hidden="true"></i>'
    },
    "chat-emotes": {
      label: "Emotes",
      defaultHtml: '<i class="fa fa-smile" aria-hidden="true"></i>'
    },
    "chat-gif": {
      label: "GIF picker",
      defaultHtml: '<i class="fa fa-file-video-o" aria-hidden="true"></i>'
    },
    "chat-users": {
      label: "User list",
      defaultHtml: '<i class="fa fa-users" aria-hidden="true"></i>'
    },
    "stack-add-media": {
      label: "Add media",
      defaultHtml: '<i class="fa fa-plus" aria-hidden="true"></i>'
    },
    "stack-new-poll": {
      label: "New poll",
      defaultHtml: '<i class="fa fa-plus" aria-hidden="true"></i>'
    },
    "stack-edit-motd": {
      label: "Edit MOTD",
      defaultHtml: '<i class="fa fa-plus" aria-hidden="true"></i>'
    },
    "chat-commands-help": {
      label: "Chat commands",
      defaultHtml: '<i class="fa fa-question-circle" aria-hidden="true"></i>'
    }
  };

  const ICON_PACKS = {
    continental: {
      name: "Continental Royal",
      icons: {
        "nav-theme": "{base}/assets/themes/continental/crown.svg",
        "nav-movie-request": "{base}/assets/themes/continental/castle.svg",
        "perf-rocket": "{base}/assets/themes/continental/ship.svg",
        "chat-emotes": "{base}/assets/themes/continental/jewel.svg",
        "chat-gif": "{base}/assets/themes/continental/ship.svg",
        "stack-add-media": "{base}/assets/themes/continental/castle.svg",
        "stack-new-poll": "{base}/assets/themes/continental/crown.svg",
        "stack-edit-motd": "{base}/assets/themes/continental/crown.svg",
        "chat-commands-help": "{base}/assets/themes/continental/jewel.svg"
      }
    }
  };

  const TINT_ICON_PACKS = {
    continental: "continental"
  };

  const HTTP_URL_RE = /^https?:\/\//i;
  const DATA_URL_RE = /^data:/i;

  function isKnownSlot(slotId) {
    return Boolean(slotId && ICON_SLOTS[slotId]);
  }

  function isValidIconUrl(url) {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    return HTTP_URL_RE.test(trimmed) || DATA_URL_RE.test(trimmed) || trimmed.startsWith("/");
  }

  function resolveAssetBase(baseUrl) {
    if (typeof baseUrl === "string" && baseUrl.trim()) return baseUrl.trim().replace(/\/+$/, "");
    return "";
  }

  function resolveIconUrl(entry, baseUrl) {
    if (!entry) return "";
    const raw = typeof entry === "string" ? entry : (entry.url || "");
    if (!raw) return "";
    const base = resolveAssetBase(baseUrl);
    const resolved = raw.replace(/\{base\}/g, base);
    return isValidIconUrl(resolved) ? resolved : "";
  }

  function normalizeIconOverrides(input) {
    if (!input || typeof input !== "object") return {};
    const out = {};
    Object.entries(input).forEach(([slotId, value]) => {
      if (!isKnownSlot(slotId)) return;
      const url = typeof value === "string" ? value.trim() : "";
      if (url) out[slotId] = url;
    });
    return out;
  }

  function normalizeIconPackId(id) {
    if (!id) return "";
    const key = String(id).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "");
    return ICON_PACKS[key] ? key : "";
  }

  function resolveIconMap(appearance, options = {}) {
    const baseUrl = resolveAssetBase(options.baseUrl);
    const merged = {};
    const input = appearance && typeof appearance === "object" ? appearance : {};

    const tintKey = typeof input.tint === "string" ? input.tint.trim() : "";
    const tintPackId = TINT_ICON_PACKS[tintKey] || "";
    if (tintPackId && ICON_PACKS[tintPackId]) {
      Object.assign(merged, ICON_PACKS[tintPackId].icons);
    }

    const packId = normalizeIconPackId(input.iconPack);
    if (packId && ICON_PACKS[packId]) {
      Object.assign(merged, ICON_PACKS[packId].icons);
    }

    Object.assign(merged, normalizeIconOverrides(input.icons));

    const resolved = {};
    Object.entries(merged).forEach(([slotId, entry]) => {
      if (!isKnownSlot(slotId)) return;
      const url = resolveIconUrl(entry, baseUrl);
      if (url) resolved[slotId] = url;
    });
    return resolved;
  }

  function buildThemedIconHtml(url, slotMeta) {
    const label = slotMeta?.label || "Icon";
    return `<img class="btfw-theme-icon" src="${url.replace(/"/g, "&quot;")}" alt="" aria-hidden="true" decoding="async">`;
  }

  function buildSlotHtml(slotId, iconMap, options = {}) {
    const slot = ICON_SLOTS[slotId];
    if (!slot) return "";
    const url = iconMap?.[slotId] || resolveIconUrl(iconMap?.[slotId], options.baseUrl);
    if (url) return buildThemedIconHtml(url, slot);
    return slot.defaultHtml;
  }

  return {
    ICON_SLOT_IDS,
    ICON_SLOTS,
    ICON_PACKS,
    TINT_ICON_PACKS,
    isKnownSlot,
    isValidIconUrl,
    normalizeIconPackId,
    normalizeIconOverrides,
    resolveIconMap,
    resolveIconUrl,
    buildThemedIconHtml,
    buildSlotHtml
  };
});
