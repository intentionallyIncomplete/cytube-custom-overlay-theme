/* BTFW — util:themePresets (per-user named theme presets in localStorage) */
BTFW.define("util:themePresets", ["util:themeRuntime"], async ({ init }) => {
  const themeRuntime = await init("util:themeRuntime");

  const STORAGE_PREFIX = "btfw:userThemePresets:";
  const STORAGE_SUFFIX = ":v1";
  const STORE_VERSION = 1;
  const MAX_PRESETS = 20;
  const MAX_NAME_LEN = 48;

  function getChannelKey() {
    try {
      const client = typeof window !== "undefined" ? window.CLIENT : null;
      const raw = client?.channel || client?.channelName || window.CHANNEL?.name;
      if (raw && typeof raw === "string") {
        const slug = raw.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
        if (slug) return slug.slice(0, 64);
      }
    } catch (_) {}
    return "global";
  }

  function storageKey(channelKey) {
    return `${STORAGE_PREFIX}${channelKey || getChannelKey()}${STORAGE_SUFFIX}`;
  }

  function emptyStore() {
    return { version: STORE_VERSION, activeId: null, presets: [] };
  }

  function sanitizeName(name) {
    return String(name || "")
      .replace(/[\x00-\x1f\x7f]/g, "")
      .trim()
      .slice(0, MAX_NAME_LEN);
  }

  function newPresetId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return `preset-${crypto.randomUUID().slice(0, 8)}`;
    }
    return `preset-${Date.now().toString(36)}`;
  }

  function normalizePresetStore(raw) {
    if (!raw || typeof raw !== "object" || raw.version !== STORE_VERSION) {
      return emptyStore();
    }
    const presets = Array.isArray(raw.presets) ? raw.presets : [];
    const normalized = [];
    const seen = new Set();
    presets.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const id = String(item.id || "").trim();
      const name = sanitizeName(item.name);
      if (!id || !name || seen.has(id)) return;
      seen.add(id);
      normalized.push({
        id,
        name,
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date().toISOString(),
        config: themeRuntime.normalizeAppearanceConfig(item.config)
      });
    });
    normalized.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const capped = normalized.slice(0, MAX_PRESETS);
    let activeId = typeof raw.activeId === "string" ? raw.activeId : null;
    if (activeId && !capped.some((p) => p.id === activeId)) activeId = null;
    return { version: STORE_VERSION, activeId, presets: capped };
  }

  function loadPresetStore(channelKey) {
    try {
      const raw = localStorage.getItem(storageKey(channelKey));
      if (!raw) return emptyStore();
      return normalizePresetStore(JSON.parse(raw));
    } catch (_) {
      return emptyStore();
    }
  }

  function savePresetStore(store, channelKey) {
    try {
      const normalized = normalizePresetStore(store);
      localStorage.setItem(storageKey(channelKey), JSON.stringify(normalized));
      return normalized;
    } catch (_) {
      return normalizePresetStore(store);
    }
  }

  function listPresets(channelKey) {
    return loadPresetStore(channelKey).presets.slice();
  }

  function getActivePreset(channelKey) {
    const store = loadPresetStore(channelKey);
    if (!store.activeId) return null;
    return store.presets.find((p) => p.id === store.activeId) || null;
  }

  function getActiveAppearance(channelKey) {
    const active = getActivePreset(channelKey);
    if (active) return themeRuntime.cloneAppearance(active.config);
    return themeRuntime.extractAppearanceFromChannelConfig(
      typeof window !== "undefined" ? window.BTFW_THEME_ADMIN : null
    );
  }

  function setActivePreset(id, channelKey) {
    const store = loadPresetStore(channelKey);
    if (id && !store.presets.some((p) => p.id === id)) return store;
    store.activeId = id || null;
    return savePresetStore(store, channelKey);
  }

  function saveNewPreset(name, config, channelKey) {
    const store = loadPresetStore(channelKey);
    const presetName = sanitizeName(name);
    if (!presetName) return { store, preset: null };
    const now = new Date().toISOString();
    const preset = {
      id: newPresetId(),
      name: presetName,
      createdAt: now,
      updatedAt: now,
      config: themeRuntime.normalizeAppearanceConfig(config)
    };
    store.presets.unshift(preset);
    store.activeId = preset.id;
    const saved = savePresetStore(store, channelKey);
    return { store: saved, preset };
  }

  function updatePreset(id, patch, channelKey) {
    const store = loadPresetStore(channelKey);
    const preset = store.presets.find((p) => p.id === id);
    if (!preset) return store;
    if (patch && typeof patch.name === "string") {
      const nextName = sanitizeName(patch.name);
      if (nextName) preset.name = nextName;
    }
    if (patch && patch.config) {
      preset.config = themeRuntime.normalizeAppearanceConfig(patch.config);
    }
    preset.updatedAt = new Date().toISOString();
    return savePresetStore(store, channelKey);
  }

  function deletePreset(id, channelKey) {
    const store = loadPresetStore(channelKey);
    store.presets = store.presets.filter((p) => p.id !== id);
    if (store.activeId === id) store.activeId = null;
    return savePresetStore(store, channelKey);
  }

  function applyActivePreset(channelKey) {
    const active = getActivePreset(channelKey);
    if (active) {
      return themeRuntime.applyUserAppearance(active.config);
    }
    return themeRuntime.revertToChannelAppearance();
  }

  function applyAndPersistAppearance(config, options = {}) {
    const channelKey = options.channelKey || getChannelKey();
    const normalized = themeRuntime.applyUserAppearance(config, options);
    const store = loadPresetStore(channelKey);
    if (store.activeId) {
      updatePreset(store.activeId, { config: normalized }, channelKey);
    } else {
      const draftName = sanitizeName(options.presetName);
      if (draftName) {
        saveNewPreset(draftName, normalized, channelKey);
      }
    }
    return normalized;
  }

  function clearActivePreset(channelKey) {
    const store = setActivePreset(null, channelKey);
    themeRuntime.revertToChannelAppearance();
    return store;
  }

  function bootRehydrate() {
    const apply = () => {
      try {
        applyActivePreset();
      } catch (error) {
        console.warn("[theme-presets] Failed to apply user theme preset", error);
      }
    };
    apply();
    if (typeof document !== "undefined" && document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply, { once: true });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("load", apply, { once: true });
    }
  }

  bootRehydrate();

  return {
    getChannelKey,
    loadPresetStore,
    savePresetStore,
    listPresets,
    getActivePreset,
    getActiveAppearance,
    setActivePreset,
    saveNewPreset,
    updatePreset,
    deletePreset,
    applyActivePreset,
    applyAndPersistAppearance,
    clearActivePreset,
    bootRehydrate
  };
});
