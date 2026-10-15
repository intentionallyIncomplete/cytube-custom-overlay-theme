/**
 * Theme-config sub-domain of feature:channelThemeAdmin (#228 Phase 4).
 *
 * Pure configuration logic: defaults, deep merge, normalization,
 * sanitization, module-URL collection, and JS/CSS block generation.
 * No DOM access. Verbatim-extracted from
 * src/modules/feature-channel-theme-admin.js — behavior-preserving.
 *
 * util:themeRuntime is an AMD module (BTFW.define), so the values this
 * domain needs from it are injected via createThemeConfigDomain() rather
 * than a static import.
 */

import {
  buildJsConfigBlock,
  parseThemeAdminConfig,
  wrapCssThemeBlock
} from "../../lib/theme-admin-blocks.js";

/** Persisted channel theme config shape (index signature keeps legacy keys accessible). */
export interface ThemeAdminConfig {
  version: number;
  tint: string;
  colors: Record<string, string>;
  typography: Record<string, unknown>;
  integrations: { enabled: boolean; movieInfo: Record<string, unknown> } & Record<string, unknown>;
  resources: { styles: string[]; scripts: string[]; modules: string[] } & Record<string, unknown>;
  branding: { headerName: string; faviconUrl: string; posterUrl: string } & Record<string, unknown>;
  [key: string]: unknown;
}

/** Pieces of util:themeRuntime the config domain consumes. */
export interface ThemeRuntimeTypographyApi {
  DEFAULT_APPEARANCE: {
    tint: string;
    colors: Record<string, string>;
    typography: Record<string, unknown>;
  };
  FONT_DEFAULT_ID: string;
  FONT_FALLBACK_FAMILY: string;
  normalizeFontId(value: unknown): string;
  resolveTypographyConfig(typography: unknown): { family?: string } & Record<string, unknown>;
}

type AnyRecord = Record<string, unknown>;

/** Coerce a module-URL-ish value (string/array/object) to a trimmed string. */
export function coerceModuleValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (!value || typeof value !== "object") return "";

  if (Array.isArray(value)) {
    if (!value.length) return "";
    return coerceModuleValue(value[0]);
  }

  const record = value as AnyRecord;
  for (const key of ["url", "href", "src", "value"]) {
    if (typeof record[key] === "string") {
      return (record[key] as string).trim();
    }
  }

  return "";
}

/** Recursively collect values under /module/i keys (cycle-safe). */
export function collectModuleCandidates(source: unknown): unknown[] {
  if (!source || typeof source !== "object") return [];

  const seen = typeof WeakSet === "function" ? new WeakSet<object>() : null;
  const candidates: unknown[] = [];

  const traverse = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if (seen) {
      if (seen.has(value)) return;
      seen.add(value);
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item && typeof item === "object") {
          traverse(item);
        }
      });
      return;
    }

    const record = value as AnyRecord;
    Object.keys(record).forEach(key => {
      const child = record[key];
      if (/module/i.test(key)) {
        if (typeof child !== "undefined" && child !== null) {
          candidates.push(child);
        }
      }
      if (child && typeof child === "object") {
        traverse(child);
      }
    });
  };

  traverse(source);
  return candidates;
}

/** Flatten any module-URL-ish shape to a deduped string list. */
export function normalizeModuleUrls(values: unknown): string[] {
  const urls: string[] = [];
  const seenObjects = typeof WeakSet === "function" ? new WeakSet<object>() : null;

  const walk = (value: unknown): void => {
    if (typeof value === "undefined" || value === null) return;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        urls.push(trimmed);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(item => walk(item));
      return;
    }
    if (typeof value === "object") {
      if (seenObjects) {
        if (seenObjects.has(value)) return;
        seenObjects.add(value);
      }
      const record = value as AnyRecord;
      const direct = coerceModuleValue(record);
      if (direct) {
        urls.push(direct);
      }
      const skipKeys = ["url", "href", "src", "value"];
      Object.keys(record).forEach(key => {
        if (direct && skipKeys.includes(key)) return;
        walk(record[key]);
      });
    }
  };

  walk(values);

  const normalized: string[] = [];
  const seen = new Set<string>();
  urls.forEach(url => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    normalized.push(url);
  });
  return normalized;
}

export function createThemeConfigDomain(rt: ThemeRuntimeTypographyApi) {
  const DEFAULT_CONFIG: ThemeAdminConfig = {
    version: 8,
    tint: rt.DEFAULT_APPEARANCE.tint,
    colors: { ...rt.DEFAULT_APPEARANCE.colors },
    typography: { ...rt.DEFAULT_APPEARANCE.typography },
    integrations: {
      enabled: true,
      movieInfo: {
        enabled: false
      }
    },
    resources: {
      scripts: [],
      styles: [],
      modules: []
    },
    branding: {
      headerName: "CyTube",
      faviconUrl: "",
      posterUrl: ""
    }
  };

  function cloneDefaults(): ThemeAdminConfig {
    return structuredClone(DEFAULT_CONFIG);
  }

  function overwriteConfig(target: AnyRecord, source: unknown): AnyRecord {
    if (!target || typeof target !== "object") return target;
    Object.keys(target).forEach(key => {
      delete target[key];
    });
    if (!source || typeof source !== "object") return target;
    const copy = structuredClone(source) as AnyRecord;
    Object.keys(copy).forEach(key => {
      target[key] = copy[key];
    });
    return target;
  }

  function deepMerge<T extends AnyRecord>(target: T, source: unknown): T {
    if (!source || typeof source !== "object") return target;
    const targetRecord = target as AnyRecord;
    const sourceRecord = source as AnyRecord;
    Object.keys(sourceRecord).forEach(key => {
      const value = sourceRecord[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        targetRecord[key] = deepMerge(targetRecord[key] ? { ...(targetRecord[key] as AnyRecord) } : {}, value);
      } else {
        targetRecord[key] = Array.isArray(value) ? (value as unknown[]).slice() : value;
      }
    });
    return target;
  }

  function parseConfig(jsText: string) {
    return parseThemeAdminConfig(jsText);
  }

  function normalizeConfig(cfg: unknown): ThemeAdminConfig {
    const defaults = cloneDefaults();
    const normalized = cloneDefaults();
    deepMerge(normalized, cfg || {});

    delete normalized.slider;
    delete normalized.sliderEnabled;
    delete normalized.sliderJson;

    if (!normalized.integrations || typeof normalized.integrations !== "object") {
      normalized.integrations = structuredClone(defaults.integrations);
    }
    if (typeof normalized.integrations.enabled !== "boolean") {
      normalized.integrations.enabled = true;
    }
    delete normalized.integrations.tmdb;
    delete normalized.integrations.ratings;
    delete normalized.integrations.autoSubs;
    delete normalized.integrations.audioEnhancer;
    if (!normalized.integrations.movieInfo || typeof normalized.integrations.movieInfo !== "object") {
      normalized.integrations.movieInfo = { enabled: false };
    } else {
      normalized.integrations.movieInfo.enabled = Boolean(normalized.integrations.movieInfo.enabled);
    }

    if (normalized.features && typeof normalized.features === "object") {
      delete (normalized.features as AnyRecord).videoOverlayPoll;
      if (Object.keys(normalized.features).length === 0) {
        delete normalized.features;
      }
    }

    if (!normalized.resources || typeof normalized.resources !== "object") {
      normalized.resources = structuredClone(defaults.resources);
    }
    if (!Array.isArray(normalized.resources.styles)) {
      normalized.resources.styles = [];
    }
    if (!Array.isArray(normalized.resources.scripts)) {
      normalized.resources.scripts = [];
    }
    const normalizedModules = normalizeModuleUrls(collectModuleCandidates(normalized));
    normalized.resources.modules = normalizedModules;
    delete normalized.resources.moduleUrls;
    delete normalized.resources.externalModules;
    delete normalized.moduleUrls;
    delete normalized.externalModules;
    delete normalized.modules;

    if (!normalized.branding || typeof normalized.branding !== "object") {
      normalized.branding = structuredClone(defaults.branding);
    }
    if (typeof normalized.branding.favicon === "string" && !normalized.branding.faviconUrl) {
      normalized.branding.faviconUrl = normalized.branding.favicon;
    }
    if (typeof normalized.headerName === "string" && !normalized.branding.headerName) {
      normalized.branding.headerName = normalized.headerName;
    }
    if (typeof normalized.branding.header === "string" && !normalized.branding.headerName) {
      normalized.branding.headerName = normalized.branding.header;
    }
    if (typeof normalized.faviconUrl === "string" && !normalized.branding.faviconUrl) {
      normalized.branding.faviconUrl = normalized.faviconUrl;
    }
    if (typeof normalized.posterUrl === "string" && !normalized.branding.posterUrl) {
      normalized.branding.posterUrl = normalized.posterUrl;
    }
    if (typeof normalized.branding.posterUrl !== "string") {
      normalized.branding.posterUrl = "";
    }

    if (!normalized.typography || typeof normalized.typography !== "object") {
      normalized.typography = structuredClone(defaults.typography);
    }

    return normalized;
  }

  function sanitizeConfigForOutput(cfg: unknown): ThemeAdminConfig {
    const cleaned = structuredClone((cfg || {}) as ThemeAdminConfig);
    delete cleaned.slider;
    delete cleaned.sliderEnabled;
    delete cleaned.sliderJson;
    delete cleaned.headerName;
    delete cleaned.faviconUrl;
    delete cleaned.posterUrl;
    if (cleaned.branding && typeof cleaned.branding === "object") {
      delete cleaned.branding.favicon;
    }
    if (cleaned.integrations && typeof cleaned.integrations === "object") {
      delete cleaned.integrations.tmdb;
      delete cleaned.integrations.autoSubs;
      delete cleaned.integrations.ratings;
      delete cleaned.integrations.audioEnhancer;
    }
    return cleaned;
  }

  function buildConfigBlock(cfg: unknown): string {
    const normalized = normalizeConfig(cfg);
    const cleaned = sanitizeConfigForOutput(normalized);
    const json = JSON.stringify(cleaned, null, 2);
    return buildJsConfigBlock(json);
  }

  function buildCssBlock(cfg: unknown): string {
    const source = (cfg || {}) as ThemeAdminConfig;
    const colors = source.colors || {};
    const typography = rt.resolveTypographyConfig(source.typography || {});
    const bg = colors.background || "#05060d";
    const surface = colors.surface || colors.panel || "#0b111d";
    const panel = colors.panel || "#141f36";
    const textColor = colors.text || "#e8ecfb";
    const chatText = colors.chatText || textColor;
    const accent = colors.accent || "#6d4df6";
    const fontFamily = typography.family || rt.FONT_FALLBACK_FAMILY;

    return wrapCssThemeBlock(`:root {\n  --btfw-theme-bg: ${bg};\n  --btfw-theme-surface: ${surface};\n  --btfw-theme-panel: ${panel};\n  --btfw-theme-text: ${textColor};\n  --btfw-theme-chat-text: ${chatText};\n  --btfw-theme-accent: ${accent};\n  --btfw-theme-font-family: ${fontFamily};\n}`);
  }

  function stripLegacySliderGlobals(jsText: string): string {
    const source = typeof jsText === "string" ? jsText : '';
    if (!source) return '';

    const lines = source.split(/\r?\n/);
    const cleaned = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const trimmed = line.trim();
      if (/^(?:var|let|const)?\s*UI_ChannelList\s*=/.test(trimmed)) continue;
      if (/^window\.UI_ChannelList\s*=/.test(trimmed)) continue;
      if (/^(?:var|let|const)?\s*Channel_JSON\s*=/.test(trimmed)) continue;
      if (/^window\.Channel_JSON\s*=/.test(trimmed)) continue;
      cleaned.push(line);
    }

    while (cleaned.length && cleaned[0]!.trim() === '') {
      cleaned.shift();
    }
    for (let i = cleaned.length - 1; i > 0; i--) {
      if (cleaned[i]!.trim() === '' && cleaned[i - 1]!.trim() === '') {
        cleaned.splice(i, 1);
      }
    }

    return cleaned.join('\n');
  }

  return {
    DEFAULT_CONFIG,
    cloneDefaults,
    overwriteConfig,
    deepMerge,
    coerceModuleValue,
    collectModuleCandidates,
    normalizeModuleUrls,
    parseConfig,
    normalizeConfig,
    sanitizeConfigForOutput,
    buildConfigBlock,
    buildCssBlock,
    stripLegacySliderGlobals
  };
}

export type ThemeConfigDomain = ReturnType<typeof createThemeConfigDomain>;
