/* BTFW — feature:themeIcons (apply gag-theme icon packs to slotted UI elements) */
BTFW.define("feature:themeIcons", ["util:themeIconPacks", "util:themeRuntime"], async ({ init }) => {
  const iconPacks = await init("util:themeIconPacks");
  const themeRuntime = await init("util:themeRuntime");

  let activeIconMap = {};
  let observer = null;
  let refreshScheduled = false;

  function getAssetBase() {
    try {
      const btfw = typeof window !== "undefined" ? window.BTFW : null;
      return (btfw && (btfw.BASE || btfw.DEV_CDN)) || "";
    } catch (_) {
      return "";
    }
  }

  function captureDefaultHtml(host) {
    if (!host || host.dataset.btfwIconDefaultCaptured === "1") return;
    host.dataset.btfwIconDefaultCaptured = "1";
    host.dataset.btfwIconDefault = host.innerHTML.trim();
  }

  function restoreHost(host) {
    if (!host) return;
    const fallback = iconPacks.ICON_SLOTS[host.dataset.btfwIconSlot]?.defaultHtml || "";
    const stored = host.dataset.btfwIconDefault || fallback;
    host.innerHTML = stored;
    host.classList.remove("btfw-theme-icon-host--themed");
    host.removeAttribute("data-btfw-icon-active");
  }

  function applyToHost(host, url) {
    if (!host || !host.dataset.btfwIconSlot) return;
    const slotId = host.dataset.btfwIconSlot;
    captureDefaultHtml(host);
    if (!url) {
      restoreHost(host);
      return;
    }
    const slotMeta = iconPacks.ICON_SLOTS[slotId];
    host.innerHTML = iconPacks.buildThemedIconHtml(url, slotMeta);
    host.classList.add("btfw-theme-icon-host--themed");
    host.setAttribute("data-btfw-icon-active", slotId);
  }

  function applyIconMap(iconMap) {
    activeIconMap = iconMap && typeof iconMap === "object" ? { ...iconMap } : {};
    if (typeof document === "undefined") return activeIconMap;
    document.querySelectorAll("[data-btfw-icon-slot]").forEach((host) => {
      const slotId = host.dataset.btfwIconSlot;
      applyToHost(host, activeIconMap[slotId] || "");
    });
    return activeIconMap;
  }

  function clearIcons() {
    return applyIconMap({});
  }

  function resolveFromAppearance(appearance) {
    return iconPacks.resolveIconMap(appearance, { baseUrl: getAssetBase() });
  }

  function applyFromAppearance(appearance) {
    return applyIconMap(resolveFromAppearance(appearance));
  }

  function scheduleRefresh() {
    if (refreshScheduled) return;
    refreshScheduled = true;
    requestAnimationFrame(() => {
      refreshScheduled = false;
      applyIconMap(activeIconMap);
    });
  }

  function onThemeEvent(event) {
    const config = event?.detail?.config;
    if (config && typeof config === "object") {
      applyFromAppearance(config);
      return;
    }
    applyFromAppearance(themeRuntime.cloneAppearance());
  }

  function bindThemeEvents() {
    if (typeof document === "undefined") return;
    document.addEventListener("btfw:channelThemeTint", onThemeEvent);
    document.addEventListener("btfw:userThemeApplied", onThemeEvent);
    document.addEventListener("btfw:ready", () => {
      try {
        const channel = window.BTFW_THEME_ADMIN;
        if (channel) applyFromAppearance(themeRuntime.extractAppearanceFromChannelConfig(channel));
      } catch (_) {}
    }, { once: true });
  }

  function startObserver() {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined") return;
    if (observer) return;
    observer = new MutationObserver((records) => {
      const relevant = records.some((record) => {
        if (record.type === "attributes" && record.attributeName === "data-btfw-icon-slot") return true;
        if (record.type !== "childList") return false;
        return Array.from(record.addedNodes).some((node) => {
          if (!(node instanceof Element)) return false;
          return node.matches?.("[data-btfw-icon-slot]") || node.querySelector?.("[data-btfw-icon-slot]");
        });
      });
      if (relevant) scheduleRefresh();
    });
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-btfw-icon-slot"]
    });
  }

  bindThemeEvents();
  startObserver();

  return {
    name: "feature:themeIcons",
    applyIconMap,
    applyFromAppearance,
    clearIcons,
    resolveFromAppearance,
    buildSlotHtml: (slotId) => iconPacks.buildSlotHtml(slotId, activeIconMap, { baseUrl: getAssetBase() }),
    refresh: scheduleRefresh
  };
});
