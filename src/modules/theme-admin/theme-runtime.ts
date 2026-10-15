/**
 * Theme-runtime sub-domain of feature:channelThemeAdmin (#228 Phase 4).
 *
 * Applies a normalized channel theme to the live page: runtime assets
 * (styles/scripts/modules), branding, integration flags, and the
 * BTFW_THEME_ADMIN sync bootstrap. Verbatim-extracted from
 * src/modules/feature-channel-theme-admin.js — behavior-preserving.
 *
 * Depends on the theme-config domain (injected) and on util:themeRuntime's
 * applyRuntimeColors/applyRuntimeTypography (injected — AMD module).
 */

import type { ThemeAdminConfig, ThemeConfigDomain } from "./theme-config.js";

/** Pieces of util:themeRuntime the runtime domain consumes. */
export interface ThemeRuntimeApplyApi {
  applyRuntimeColors(config: unknown): unknown;
  applyRuntimeTypography(config: unknown): unknown;
}

type AnyRecord = Record<string, unknown>;

export function createThemeRuntimeDomain(config: ThemeConfigDomain, rt: ThemeRuntimeApplyApi) {
  function removeRuntimeAsset(id: string): void {
    if (typeof document === "undefined") return;
    const existing = document.getElementById(id);
    if (existing?.parentElement) {
      existing.parentElement.removeChild(existing);
    } else {
      existing?.remove?.();
    }
  }

  function ensureRuntimeAsset(id: string, url: string, kind: string): HTMLElement {
    if (typeof document === "undefined" || !document.head) return null as unknown as HTMLElement;
    if (!url) {
      removeRuntimeAsset(id);
      return null as unknown as HTMLElement;
    }

    const attr = kind === "style" ? "href" : "src";
    const existing = document.getElementById(id);

    if (existing) {
      const current = existing.getAttribute(attr) || "";
      if (kind === "style" && existing.tagName === "LINK") {
        if (current === url) return existing;
        existing.setAttribute(attr, url);
        return existing;
      }
      if (kind !== "style" && existing.tagName === "SCRIPT" && current === url) {
        return existing;
      }
      removeRuntimeAsset(id);
    }

    if (kind === "style") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.id = id;
      document.head.appendChild(link);
      return link;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    script.id = id;
    document.head.appendChild(script);
    return script;
  }

  function pruneRuntimeAssets(prefix: string, keepCount: number): void {
    if (typeof document === "undefined") return;
    const nodes = Array.from(document.querySelectorAll(`[id^="${prefix}"]`));
    nodes.forEach(node => {
      const match = node.id.match(/(\d+)$/);
      if (!match) return;
      const index = Number(match[1]);
      if (Number.isNaN(index) || index < keepCount) return;
      if (node.parentElement) {
        node.parentElement.removeChild(node);
      } else {
        node.remove?.();
      }
    });
  }

  function applyRuntimeResources(theme: unknown): void {
    if (!theme || typeof theme !== "object") return;
    const t = theme as AnyRecord;
    const resources = (t.resources && typeof t.resources === "object") ? (t.resources as AnyRecord) : {};
    const styles = Array.isArray(resources.styles) ? (resources.styles as string[]) : [];
    styles.forEach((url, idx) => ensureRuntimeAsset(`btfw-theme-style-${idx}`, url, "style"));
    pruneRuntimeAssets("btfw-theme-style-", styles.length);

    const scripts = Array.isArray(resources.scripts) ? (resources.scripts as string[]) : [];
    scripts.forEach((url, idx) => ensureRuntimeAsset(`btfw-theme-script-${idx}`, url, "script"));
    pruneRuntimeAssets("btfw-theme-script-", scripts.length);

    const modules = config.normalizeModuleUrls(config.collectModuleCandidates(theme));
    modules.forEach((url, idx) => ensureRuntimeAsset(`btfw-theme-module-${idx}`, url, "script"));
    pruneRuntimeAssets("btfw-theme-module-", modules.length);
    t.resources = t.resources || {};
    const resourcesOut = t.resources as AnyRecord;
    resourcesOut.styles = styles.slice();
    resourcesOut.scripts = scripts.slice();
    resourcesOut.modules = modules;
    if (typeof window !== "undefined") {
      if (!window.BTFW) (window as unknown as AnyRecord).BTFW = {};
      const global = window.BTFW as unknown as AnyRecord;
      global.channelThemeModules = modules.slice();
    }
  }

  function applyRuntimeBranding(theme: unknown): void {
    if (!theme || typeof theme !== "object") return;
    const t = theme as AnyRecord;
    const branding = (t.branding && typeof t.branding === "object") ? (t.branding as AnyRecord) : (t.branding = {});
    const channelName = (
      (typeof window !== "undefined" && window.CHANNEL?.name) ||
      (typeof window !== "undefined" && window.CLIENT?.channel) ||
      ""
    ).trim();
    let name = channelName;
    if (!name) {
      name = typeof branding.headerName === "string" ? branding.headerName.trim() : "";
    }
    if (!name && typeof t.headerName === "string") {
      name = t.headerName.trim();
    }
    if (!name) name = "CyTube";
    branding.headerName = name;

    const selectors = [
      "#nav-collapsible .navbar-brand",
      ".navbar .navbar-brand",
      ".navbar-brand",
      "#navbrand"
    ];
    selectors.forEach(sel => {
      const anchor = document?.querySelector?.(sel);
      if (!anchor) return;
      let holder = anchor.querySelector<HTMLElement>('[data-btfw-brand-text]');
      if (holder) {
        holder.textContent = name;
      } else {
        let replaced = false;
        Array.from(anchor.childNodes || []).forEach(node => {
          if (node && node.nodeType === 3) {
            const text = (node.textContent || "").trim();
            if (!text) return;
            if (!replaced) {
              node.textContent = name;
              replaced = true;
            } else {
              node.textContent = "";
            }
          }
        });
        if (!replaced) {
          holder = document.createElement("span");
          holder.dataset.btfwBrandText = "1";
          if (anchor.childNodes.length > 0) {
            anchor.appendChild(document.createTextNode(" "));
          }
          holder.textContent = name;
          anchor.appendChild(holder);
        }
      }
      anchor.setAttribute("title", name);
      anchor.setAttribute("aria-label", name);
    });

    let faviconUrl = typeof branding.faviconUrl === "string" ? branding.faviconUrl.trim() : "";
    if (!faviconUrl && typeof branding.favicon === "string") {
      faviconUrl = branding.favicon.trim();
    }
    branding.faviconUrl = faviconUrl || "";
    branding.favicon = branding.faviconUrl;
    if (faviconUrl && typeof document !== "undefined") {
      const linkSelectors = 'link[rel*="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]';
      const links = Array.from(document.querySelectorAll(linkSelectors));
      if (!links.length) {
        const created = document.createElement("link");
        created.rel = "icon";
        document.head?.appendChild(created);
        links.push(created);
      }
      links.forEach(link => {
        try { (link as HTMLLinkElement).href = faviconUrl; } catch {}
      });
    }

    let poster = typeof branding.posterUrl === "string" ? branding.posterUrl.trim() : "";
    if (!poster && typeof branding.posterUrl === "string") {
      poster = branding.posterUrl.trim();
    }
    branding.posterUrl = poster || "";
    if (typeof window !== "undefined") {
      if (!window.BTFW) (window as unknown as AnyRecord).BTFW = {};
      const global = window.BTFW as unknown as AnyRecord;
      global.channelPosterUrl = poster || "";
    }
  }

  function applyRuntimeIntegrations(theme: unknown): void {
    if (!theme || typeof theme !== "object") return;
    const t = theme as AnyRecord;
    const integrations = (t.integrations && typeof t.integrations === "object") ? (t.integrations as AnyRecord) : (t.integrations = {});
    if (typeof integrations.enabled !== "boolean") {
      integrations.enabled = true;
    }
    delete integrations.tmdb;
    delete integrations.autoSubs;
    delete integrations.ratings;
    delete integrations.audioEnhancer;

    if (!integrations.movieInfo || typeof integrations.movieInfo !== "object") {
      integrations.movieInfo = { enabled: false };
    }
    const movieInfoRecord = integrations.movieInfo as AnyRecord;
    const movieInfoEnabled = Boolean(movieInfoRecord.enabled);
    movieInfoRecord.enabled = movieInfoEnabled;

    if (typeof window !== "undefined") {
      const cfg = (window.BTFW_CONFIG = window.BTFW_CONFIG || {}) as AnyRecord;
      cfg.integrationsEnabled = integrations.enabled;
      if (typeof cfg.integrations !== "object") {
        cfg.integrations = {};
      }
      const cfgIntegrations = cfg.integrations as AnyRecord;
      cfgIntegrations.movieInfo = cfgIntegrations.movieInfo || {};
      (cfgIntegrations.movieInfo as AnyRecord).enabled = movieInfoEnabled;
      cfg.movieInfo = cfg.movieInfo || {};
      (cfg.movieInfo as AnyRecord).enabled = movieInfoEnabled;
      cfg.movieInfoEnabled = movieInfoEnabled;
      cfg.shouldLoadMovieInfo = movieInfoEnabled;
      try {
        if (document?.body) {
          if (movieInfoEnabled) {
            document.body.dataset.btfwMovieInfoEnabled = "1";
          } else if (document.body.dataset?.btfwMovieInfoEnabled) {
            delete document.body.dataset.btfwMovieInfoEnabled;
          }
        }
      } catch {}
    }
    try {
      document?.dispatchEvent?.(new CustomEvent("btfw:channelIntegrationsChanged", {
        detail: {
          enabled: integrations.enabled,
          movieInfoEnabled
        }
      }));
    } catch {}
  }

  function syncRuntimeThemeConfig(source: unknown): ThemeAdminConfig | null {
    if (!source || typeof source !== "object" || typeof window === "undefined") return null;
    const normalized = config.normalizeConfig(source);
    if (!window.BTFW) (window as unknown as AnyRecord).BTFW = {};
    const global = window.BTFW as unknown as AnyRecord;
    window.BTFW_THEME_ADMIN = normalized;
    global.channelTheme = normalized;
    applyRuntimeResources(normalized);
    applyRuntimeBranding(normalized);
    rt.applyRuntimeColors(normalized);
    applyRuntimeIntegrations(normalized);
    rt.applyRuntimeTypography(normalized);
    const registry = window.BTFW;
    if (registry && typeof registry.init === "function") {
      registry.init("util:themePresets")
        .then((presets) => (presets as { applyActivePreset(): unknown }).applyActivePreset())
        .catch(() => {});
    }
    return normalized;
  }

  function bootstrapRuntimeThemeSync(): void {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const apply = (): void => {
      try {
        const cfg = window.BTFW_THEME_ADMIN;
        if (cfg && typeof cfg === "object") {
          syncRuntimeThemeConfig(cfg);
        }
      } catch (error) {
        console.warn("[theme-admin] Failed to sync runtime theme config", error);
      }
    };
    apply();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", apply, { once: true });
    }
  }

  return {
    removeRuntimeAsset,
    ensureRuntimeAsset,
    pruneRuntimeAssets,
    applyRuntimeResources,
    applyRuntimeBranding,
    applyRuntimeIntegrations,
    syncRuntimeThemeConfig,
    bootstrapRuntimeThemeSync
  };
}

export type ThemeRuntimeDomain = ReturnType<typeof createThemeRuntimeDomain>;
