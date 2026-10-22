import {
  CSS_END_MARKERS,
  CSS_START_MARKERS,
  JS_END_MARKERS,
  JS_START_MARKERS,
  hasBrokenThemeAdminJsMarkers,
  hasThemeAdminCssBlock,
  hasThemeAdminJsBlock,
  replaceThemeAdminBlock
} from "../lib/theme-admin-blocks.js";
import * as adminTpl from "../lib/templates/channel-theme-admin.js";
import { createThemeConfigDomain } from "./theme-admin/theme-config.js"; // resolves to theme-config.ts
import { createThemeRuntimeDomain } from "./theme-admin/theme-runtime.js"; // resolves to theme-runtime.ts
import {
  bindModuleFieldWatcher,
  ensureModuleFieldAvailability,
  getModuleContainer,
  readModuleValues,
  renderModuleInputs
} from "./theme-admin/module-fields.js";

BTFW.define("feature:channelThemeAdmin", ["util:themeRuntime"], async ({ init }) => {
  const themeRuntime = await init("util:themeRuntime");
  const {
    FONT_DEFAULT_ID,
    FONT_FALLBACK_FAMILY,
    DEFAULT_APPEARANCE,
    normalizeFontId,
    resolveTypographyConfig,
    applyRuntimeColors,
    applyRuntimeTypography
  } = themeRuntime;

  const themeConfig = createThemeConfigDomain({
    DEFAULT_APPEARANCE,
    FONT_DEFAULT_ID,
    FONT_FALLBACK_FAMILY,
    normalizeFontId,
    resolveTypographyConfig
  });
  const themeRuntimeDomain = createThemeRuntimeDomain(themeConfig, {
    applyRuntimeColors,
    applyRuntimeTypography
  });

  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const JS_FIELD_SELECTORS = [
    "#cs-jstext",
    "#chanjs", "#channel-js", "#channeljs", "#customjs", "#customJS",
    "textarea[name=chanjs]", "textarea[name=channeljs]",
    "textarea[data-setting='customJS']", "textarea[data-setting='chanjs']",
    "textarea[name='js']", ".channel-js-field"
  ];

  const CSS_FIELD_SELECTORS = [
    "#cs-csstext",
    "#chancss", "#channel-css", "#channelcss", "#customcss", "#customCSS",
    "textarea[name=chancss]", "textarea[name=channelcss]",
    "textarea[data-setting='customCSS']", "textarea[data-setting='chancss']",
    "textarea[name='css']", ".channel-css-field"
  ];


  const STYLE_ID = "btfw-theme-admin-style";
  let themeAdminSheetAdopted = false;

  function supportsConstructableStylesheets(){
    return typeof CSSStyleSheet === "function" &&
      typeof CSSStyleSheet.prototype.replaceSync === "function" &&
      typeof document !== "undefined" &&
      Array.isArray(document.adoptedStyleSheets ?? []);
  }

  const THEME_ADMIN_CSS = `
      .btfw-theme-admin {
        --btfw-admin-surface: color-mix(in srgb, var(--btfw-theme-panel, #141f36) 92%, transparent 8%);
        --btfw-admin-surface-alt: color-mix(in srgb, var(--btfw-theme-surface, #0b111d) 88%, transparent 12%);
        --btfw-admin-border: color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 40%, transparent 60%);
        --btfw-admin-border-soft: color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 26%, transparent 74%);
        --btfw-admin-shadow: 0 20px 46px color-mix(in srgb, var(--btfw-theme-bg, #05060d) 55%, transparent 45%);
        --btfw-admin-text: var(--btfw-theme-text, #dce4ff);
        --btfw-admin-text-soft: color-mix(in srgb, var(--btfw-theme-text, #dce4ff) 72%, transparent 28%);
        --btfw-admin-chip: color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 28%, transparent 72%);
        padding: 18px 10px 28px;
        color: var(--btfw-admin-text);
        font-family: var(--btfw-font-body, 'Inter', sans-serif);
      }
      .btfw-theme-admin h3 { font-size: 1.12rem; margin: 0 0 12px; letter-spacing: 0.04em; font-weight: 700; }
      .btfw-theme-admin p.lead { margin: 0 0 18px; color: var(--btfw-admin-text-soft); max-width: 720px; }
      .btfw-theme-admin details.section {
        border-radius: 20px;
        border: 1px solid var(--btfw-admin-border-soft);
        margin-bottom: 18px;
        background: linear-gradient(135deg, color-mix(in srgb, var(--btfw-admin-surface) 94%, transparent 6%), color-mix(in srgb, var(--btfw-admin-surface-alt) 88%, transparent 12%));
        box-shadow: var(--btfw-admin-shadow);
        overflow: hidden;
        transition: border 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .btfw-theme-admin details.section[open] {
        border-color: var(--btfw-admin-border);
        box-shadow: 0 22px 52px color-mix(in srgb, var(--btfw-theme-bg, #05060d) 58%, transparent 42%);
        background: linear-gradient(135deg, color-mix(in srgb, var(--btfw-admin-surface-alt) 96%, transparent 4%), color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 18%, transparent 82%));
      }
      .btfw-theme-admin summary.section__summary { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; cursor: pointer; list-style: none; }
      .btfw-theme-admin summary.section__summary::-webkit-details-marker { display: none; }
      .btfw-theme-admin .section__title { display: flex; flex-direction: column; gap: 4px; }
      .btfw-theme-admin .section__title h4 { margin: 0; font-size: 0.95rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--btfw-admin-text); }
      .btfw-theme-admin .section__title span { font-size: 0.84rem; color: var(--btfw-admin-text-soft); letter-spacing: 0.02em; }
      .btfw-theme-admin .section__chevron { width: 28px; height: 28px; border-radius: 10px; border: 1px solid var(--btfw-admin-border-soft); display: inline-flex; align-items: center; justify-content: center; color: var(--btfw-admin-text-soft); font-size: 0.78rem; transition: transform 0.24s ease, border 0.18s ease, color 0.18s ease, background 0.18s ease; }
      .btfw-theme-admin details.section[open] .section__chevron { transform: rotate(90deg); color: var(--btfw-admin-text); border-color: var(--btfw-admin-border); background: color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 14%, transparent 86%); }
      .btfw-theme-admin .section__body { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 16px; }
      .btfw-theme-admin .field { display: flex; flex-direction: column; gap: 6px; }
      .btfw-theme-admin label { font-weight: 600; letter-spacing: 0.03em; color: color-mix(in srgb, var(--btfw-admin-text) 92%, transparent 8%); }
      .btfw-theme-admin .btfw-checkbox { display: inline-flex; gap: 10px; align-items: center; font-weight: 600; color: color-mix(in srgb, var(--btfw-admin-text) 92%, transparent 8%); }
      .btfw-theme-admin .btfw-checkbox input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--btfw-theme-accent, #6d4df6); }
      .btfw-theme-admin .movie-info-toggle { display: inline-flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      .btfw-theme-admin .movie-info-toggle button { min-width: 0; }
      .btfw-theme-admin [data-role="movie-info-requirements"] { margin-top: 4px; }
      .btfw-theme-admin .field.is-disabled label,
      .btfw-theme-admin .field.is-disabled .help { opacity: 0.55; }
      .btfw-theme-admin .module-inputs { display: grid; gap: 10px; margin-top: 8px; }
      .btfw-theme-admin .module-input__row { display: flex; }
      .btfw-theme-admin .module-input__control { width: 100%; }
      .btfw-theme-admin input[type="text"],
      .btfw-theme-admin input[type="url"],
      .btfw-theme-admin textarea,
      .btfw-theme-admin select {
        width: 100%;
        background: color-mix(in srgb, var(--btfw-admin-surface-alt) 92%, transparent 8%);
        border: 1px solid var(--btfw-admin-border-soft);
        border-radius: 12px;
        padding: 10px 12px;
        color: color-mix(in srgb, var(--btfw-admin-text) 98%, white 2%);
        font-size: 0.95rem;
        box-shadow: inset 0 1px 0 color-mix(in srgb, var(--btfw-theme-bg, #05060d) 14%, transparent 86%);
        transition: border 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
      }
      .btfw-theme-admin input[type="text"]:focus,
      .btfw-theme-admin input[type="url"]:focus,
      .btfw-theme-admin textarea:focus,
      .btfw-theme-admin select:focus { border-color: var(--btfw-theme-accent, #6d4df6); box-shadow: 0 0 0 2px color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 22%, transparent 78%); outline: none; }
      .btfw-theme-admin .field.is-disabled input,
      .btfw-theme-admin .field.is-disabled textarea,
      .btfw-theme-admin .field.is-disabled select { opacity: 0.55; }
      .btfw-theme-admin input[type="color"] { width: 100%; height: 44px; padding: 0; border-radius: 12px; border: 1px solid var(--btfw-admin-border); background: var(--btfw-admin-surface-alt); cursor: pointer; }
      .btfw-theme-admin .help { font-size: 0.82rem; color: var(--btfw-admin-text-soft); line-height: 1.5; }
      .btfw-theme-admin .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 14px; }
      .btfw-theme-admin .preview { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 16px; padding: 18px; border-radius: 16px; background: linear-gradient(135deg, color-mix(in srgb, var(--btfw-admin-surface-alt) 94%, transparent 6%), color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 16%, transparent 84%)); box-shadow: inset 0 1px 0 color-mix(in srgb, var(--btfw-admin-border) 20%, transparent 80%); }
      .btfw-theme-admin .preview__main { display: flex; flex-direction: column; gap: 10px; }
      .btfw-theme-admin .preview__chips { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); gap: 8px; }
      .btfw-theme-admin .preview__chip { padding: 10px; border-radius: 10px; background: var(--btfw-admin-chip); color: color-mix(in srgb, var(--btfw-admin-text) 96%, white 4%); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; }
      .btfw-theme-admin .preview__accent { display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 999px; font-weight: 700; letter-spacing: 0.08em; color: color-mix(in srgb, var(--btfw-admin-text) 98%, white 2%); background: var(--btfw-theme-accent, #6d4df6); box-shadow: 0 10px 24px color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 32%, transparent 68%); }
      .btfw-theme-admin .preview--font { padding: 18px; border-radius: 14px; background: color-mix(in srgb, var(--btfw-admin-surface) 96%, transparent 4%); border: 1px solid var(--btfw-admin-border-soft); box-shadow: inset 0 1px 0 color-mix(in srgb, var(--btfw-theme-bg, #05060d) 18%, transparent 82%); display: flex; flex-direction: column; gap: 8px; }
      .btfw-theme-admin .preview__font-label { font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--btfw-admin-text-soft); }
      .btfw-theme-admin .preview__font-text { font-size: 1rem; color: var(--btfw-admin-text); }
      .btfw-theme-admin .buttons { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 16px; }
      .btfw-theme-admin .buttons .btn-primary,
      .btfw-theme-admin .buttons .btn-secondary { padding: 10px 18px; border-radius: 12px; border: 0; font-weight: 600; letter-spacing: 0.02em; cursor: pointer; transition: transform 0.16s ease, filter 0.16s ease; }
      .btfw-theme-admin .buttons .btn-primary { background: linear-gradient(135deg, color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 90%, white 10%), color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 68%, transparent 32%)); color: color-mix(in srgb, var(--btfw-admin-text) 98%, white 2%); }
      .btfw-theme-admin .buttons .btn-secondary { background: color-mix(in srgb, var(--btfw-admin-surface-alt) 90%, transparent 10%); color: var(--btfw-admin-text); border: 1px solid var(--btfw-admin-border-soft); }
      .btfw-theme-admin .buttons .btn-primary:hover,
      .btfw-theme-admin .buttons .btn-secondary:hover { filter: brightness(1.05); transform: translateY(-1px); }
      .btfw-theme-admin .buttons .btn-secondary:hover { border-color: var(--btfw-admin-border); }
      .btfw-theme-admin .status { font-size: 0.82rem; color: var(--btfw-admin-text-soft); }
      .btfw-theme-admin .integrations-callout { padding: 12px 14px; border-radius: 14px; background: color-mix(in srgb, var(--btfw-admin-surface-alt) 94%, transparent 6%); border: 1px dashed var(--btfw-admin-border-soft); display: flex; flex-direction: column; gap: 6px; font-size: 0.86rem; color: var(--btfw-admin-text-soft); }
      .btfw-theme-admin .integrations-callout strong { color: var(--btfw-admin-text); }
      @media (max-width: 720px) {
        .btfw-theme-admin { padding: 14px 6px 24px; }
        .btfw-theme-admin summary.section__summary { padding: 16px; }
        .btfw-theme-admin .section__body { padding: 0 16px 16px; }
        .btfw-theme-admin .grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
      }
    `;

  function injectLocalStyles(){
    if (typeof document === "undefined") return;

    if (supportsConstructableStylesheets()) {
      if (themeAdminSheetAdopted) return;
      try {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(THEME_ADMIN_CSS);
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        themeAdminSheetAdopted = true;
        return;
      } catch (err) {
        console.warn("[theme-admin] Constructable stylesheet failed, falling back to <style> tag", err);
      }
    }

    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = THEME_ADMIN_CSS;
    document.head.appendChild(style);
  }

  function canManageChannel(){
    try {
      if (typeof window.hasPermission === "function") {
        if (window.hasPermission("motdedit") || window.hasPermission("seehidden") || window.hasPermission("chanowner")) return true;
      }
      const client = window.CLIENT || null;
      if (client?.hasPermission) {
        if (client.hasPermission("motdedit") || client.hasPermission("seehidden") || client.hasPermission("chanowner")) return true;
      }
      if (client && typeof client.rank !== "undefined") {
        const rank = client.rank | 0;
        const ranks = window.RANK || window.Ranks || {};
        const owner = [ranks.owner, ranks.founder, ranks.admin, ranks.administrator].find(v => typeof v === "number");
        if (typeof owner === "number") return rank >= owner;
        return rank >= 4;
      }
    } catch (_) {}
    return false;
  }

  function ensureField(modal, selectors, fallbackId){
    for (const selector of selectors) {
      const el = modal ? modal.querySelector(selector) : document.querySelector(selector);
      if (el) return el;
    }
    const host = modal?.querySelector("form") || modal?.querySelector(".modal-body") || modal || document.body;
    const textarea = document.createElement("textarea");
    textarea.id = fallbackId;
    textarea.style.display = "none";
    textarea.dataset.btfwThemeAdmin = "synthetic";
    host.appendChild(textarea);
    return textarea;
  }

  function normalizeTargetId(raw){
    if (!raw) return null;
    const str = String(raw).trim();
    if (!str) return null;
    if (str.startsWith("#")) return str.slice(1);
    if (/^[A-Za-z][\w:-]*$/.test(str)) return str;
    return null;
  }

  function setActiveTab(tabContainer, contentContainer, panel, trigger){
    if (!panel || !tabContainer) return;
    const anchors = Array.from(tabContainer.querySelectorAll("a[href^='#'], a[data-target^='#']"));
    anchors.forEach(anchor => {
      const host = anchor.closest("li, [role='tab'], .tab") || anchor;
      const targetAttr = anchor.getAttribute("data-target") || anchor.getAttribute("href") || "";
      const targetId = normalizeTargetId(targetAttr);
      const isActive = trigger ? anchor === trigger : (targetId && targetId === panel.id);
      host.classList.toggle("active", !!isActive);
      host.classList.toggle("is-active", !!isActive);
      if (host.setAttribute) host.setAttribute("aria-selected", isActive ? "true" : "false");
      anchor.classList.toggle("active", !!isActive);
      anchor.classList.toggle("is-active", !!isActive);
    });

    const container = contentContainer || panel.parentElement;
    if (!container) return;
    const panes = Array.from(container.querySelectorAll(".tab-pane, [role='tabpanel'], .modal-tab, .tab-panel"));
    panes.forEach(pane => {
      const active = pane === panel;
      pane.classList.toggle("active", active);
      pane.classList.toggle("is-active", active);
      if (pane.classList.contains("tab-pane")) {
        pane.classList.toggle("in", active);
      }
      pane.style.display = active ? "block" : "none";
      if (pane.setAttribute) pane.setAttribute("aria-hidden", active ? "false" : "true");
    });
  }

  function ensureTabSystem(modal){
    if (!modal) return { tabContainer: null, contentContainer: null };
    const tabContainer = modal.querySelector(".nav-tabs, .modal-tabs, [role='tablist']");
    const contentContainer = modal.querySelector(".tab-content, .modal-content .modal-body, .modal-body");

    if (tabContainer && !tabContainer.dataset.btfwTabsWired) {
      tabContainer.dataset.btfwTabsWired = "1";
      tabContainer.addEventListener("click", (event) => {
        const anchor = event.target.closest("a[href^='#'], a[data-target^='#']");
        if (!anchor) return;
        const rawTarget = anchor.getAttribute("data-target") || anchor.getAttribute("href") || "";
        const normalized = normalizeTargetId(rawTarget);
        if (!normalized) return;
        let panel = document.getElementById(normalized);
        if (panel && !modal.contains(panel)) panel = null;
        if (!panel) return;
        event.preventDefault();
        setActiveTab(tabContainer, contentContainer, panel, anchor);
      }, true);
    }

    return { tabContainer, contentContainer };
  }

  function syncMovieInfoToggle(panel, cfg){
    if (!panel || !cfg || typeof cfg !== "object") return;
    const integrations = cfg.integrations = cfg.integrations && typeof cfg.integrations === "object"
      ? cfg.integrations
      : (cfg.integrations = structuredClone(themeConfig.DEFAULT_CONFIG.integrations));
    if (!integrations.movieInfo || typeof integrations.movieInfo !== "object") {
      integrations.movieInfo = { enabled: false };
    }
    const button = panel.querySelector('#btfw-theme-movie-info-toggle');
    const input = panel.querySelector('#btfw-theme-movie-info-enabled');
    if (!button || !input) return;
    const enabled = Boolean(integrations.movieInfo.enabled);
    input.checked = enabled;
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    button.classList.toggle('is-link', enabled);
    button.classList.toggle('is-dark', !enabled);
    button.classList.toggle('is-active', enabled);
    button.textContent = enabled ? 'Movie info overlay enabled' : 'Enable movie info overlay';
  }

  function buildThemeTabAnchorContent(){
    const icon = document.createElement('span');
    icon.className = 'fa fa-magic';
    const label = document.createElement('span');
    label.textContent = 'Theme';
    return [icon, document.createTextNode(' '), label];
  }

  function renderPanel(panel){
    injectLocalStyles();
    // The admin panel markup is a large static, first-party fragment with no dynamic
    // interpolation (see src/lib/templates/channel-theme-admin.js). Parsing it via a <template>
    // keeps the fragment inert until explicitly cloned into the live panel, rather than assigning
    // innerHTML directly on an already-attached element.
    const scratch = document.createElement("template");
    scratch.innerHTML = adminTpl.channelThemeAdminPanelHtml();
    panel.replaceChildren(scratch.content.cloneNode(true));
    return panel;
  }

  function watchInputs(panel, cfg, onChange){
    $$('[data-btfw-bind]', panel).forEach(input => {
      const handler = () => onChange();
      input.addEventListener("input", handler);
      input.addEventListener("change", handler);
    });

    bindModuleFieldWatcher(panel, onChange);

    const resetBtn = panel.querySelector('#btfw-theme-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const defaults = themeConfig.cloneDefaults();
        cfg.integrations = structuredClone(defaults.integrations);
        cfg.branding = structuredClone(defaults.branding);
        cfg.resources = structuredClone(defaults.resources);
        updateInputs(panel, cfg);
        onChange();
      });
    }

    const movieInfoButton = panel.querySelector('#btfw-theme-movie-info-toggle');
    const movieInfoInput = panel.querySelector('#btfw-theme-movie-info-enabled');
    if (movieInfoButton && movieInfoInput) {
      movieInfoButton.addEventListener('click', () => {
        const next = !movieInfoInput.checked;
        movieInfoInput.checked = next;
        if (!cfg.integrations || typeof cfg.integrations !== 'object') {
          cfg.integrations = {};
        }
        if (!cfg.integrations.movieInfo || typeof cfg.integrations.movieInfo !== 'object') {
          cfg.integrations.movieInfo = { enabled: false };
        }
        cfg.integrations.movieInfo.enabled = next;
        syncMovieInfoToggle(panel, cfg);
        onChange();
      });
    }
  }

  function updateInputs(panel, cfg){
    $$('[data-btfw-bind]', panel).forEach(input => {
      const path = input.dataset.btfwBind;
      let value = cfg;
      path.split('.').forEach(part => { if (value) value = value[part]; });
      if (input.type === "checkbox") {
        input.checked = Boolean(value);
      } else if (input.tagName === "TEXTAREA") {
        if (Array.isArray(value)) {
          input.value = value.join('\n');
        } else {
          input.value = value || "";
        }
      } else if (input.type === "color") {
        input.value = value || "#000000";
      } else {
        input.value = value ?? "";
      }
    });
    const root = document.documentElement;
    if (root) {
      root.classList.add("btfw-poll-overlay-enabled");
      root.classList.remove("btfw-poll-overlay-disabled");
    }
    const modules = themeConfig.normalizeModuleUrls(themeConfig.collectModuleCandidates(cfg));
    renderModuleInputs(panel, modules);
    ensureModuleFieldAvailability(panel);
    syncMovieInfoToggle(panel, cfg);
  }

  function setValueAtPath(obj, path, value){
    const parts = path.split('.');
    let cursor = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (!cursor[key] || typeof cursor[key] !== "object") cursor[key] = {};
      cursor = cursor[key];
    }
    cursor[parts[parts.length - 1]] = value;
  }

  function collectConfig(panel, cfg){
    const updated = themeConfig.cloneDefaults();
    themeConfig.deepMerge(updated, cfg);
    $$('[data-btfw-bind]', panel).forEach(input => {
      const path = input.dataset.btfwBind;
      let value;
      if (input.type === "checkbox") {
        value = input.checked;
      } else if (input.tagName === "TEXTAREA") {
        const lines = input.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        value = lines;
      } else {
        value = input.value;
        if (typeof value === "string") {
          value = value.trim();
        }
      }
      setValueAtPath(updated, path, value);
    });
    if (!updated.resources || typeof updated.resources !== "object") {
      updated.resources = themeConfig.cloneDefaults().resources;
    }
    updated.resources.modules = themeConfig.normalizeModuleUrls(readModuleValues(panel));
    delete updated.resources.moduleUrls;
    delete updated.resources.externalModules;
    delete updated.moduleUrls;
    delete updated.externalModules;
    delete updated.slider;
    delete updated.sliderEnabled;
    delete updated.sliderJson;
    if (!updated.integrations || typeof updated.integrations !== "object") {
      updated.integrations = themeConfig.cloneDefaults().integrations;
    }
    if (typeof updated.integrations.enabled !== "boolean") {
      updated.integrations.enabled = true;
    }
    delete updated.integrations.tmdb;
    delete updated.integrations.ratings;
    delete updated.integrations.autoSubs;
    delete updated.integrations.audioEnhancer;
    if (!updated.integrations.movieInfo || typeof updated.integrations.movieInfo !== "object") {
      updated.integrations.movieInfo = { enabled: false };
    }
    updated.integrations.movieInfo.enabled = Boolean(updated.integrations.movieInfo.enabled);
    if (updated.features && typeof updated.features === "object") {
      delete updated.features.videoOverlayPoll;
      if (Object.keys(updated.features).length === 0) {
        delete updated.features;
      }
    }
    if (!updated.typography || typeof updated.typography !== "object") {
      updated.typography = themeConfig.cloneDefaults().typography;
    }
    if (!updated.branding || typeof updated.branding !== "object") {
      updated.branding = themeConfig.cloneDefaults().branding;
    }
    if (typeof updated.branding.headerName !== "string") {
      updated.branding.headerName = "";
    }
    if (typeof updated.branding.faviconUrl !== "string") {
      updated.branding.faviconUrl = "";
    }
    if (typeof updated.branding.posterUrl !== "string") {
      updated.branding.posterUrl = "";
    }
    updated.headerName = updated.branding.headerName;
    updated.faviconUrl = updated.branding.faviconUrl;
    updated.posterUrl = updated.branding.posterUrl;
    const typo = updated.typography || {};
    typo.preset = normalizeFontId(typo.preset || FONT_DEFAULT_ID);
    if (typo.preset !== 'custom') {
      typo.customFamily = '';
    } else {
      typo.customFamily = (typo.customFamily || '').trim();
    }
    updated.typography = {
      preset: typo.preset,
      customFamily: typo.customFamily || ''
    };
    if (!updated.branding || typeof updated.branding !== "object") {
      updated.branding = themeConfig.cloneDefaults().branding;
    }
    if (typeof updated.branding.favicon === "string" && !updated.branding.faviconUrl) {
      updated.branding.faviconUrl = updated.branding.favicon;
    }
    updated.branding.favicon = updated.branding.faviconUrl || '';
    updated.branding.posterUrl = (updated.branding.posterUrl || '').trim();
    updated.branding.headerName = (updated.branding.headerName || '').trim();
    updated.version = themeConfig.DEFAULT_CONFIG.version;
    return updated;
  }

  function triggerChannelSubmit(modal, jsField, cssField){
    const roots = [];
    if (modal) roots.push(modal);
    roots.push(document);

    const selectors = [
      '#cs-jssubmit',
      '#cs-csssubmit',
      "button[name='save-js']",
      "button[name='save-css']",
      "button[data-action='save-js']",
      "button[data-action='save-css']"
    ];

    const clicked = new Set();
    selectors.forEach(sel => {
      roots.forEach(root => {
        if (!root) return;
        const el = root.querySelector(sel);
        if (!el || clicked.has(el) || typeof el.click !== 'function') return;
        try {
          el.click();
          clicked.add(el);
        } catch (_) {}
      });
    });

    let submitted = clicked.size > 0;
    const formSet = new Set();
    if (jsField && jsField.form) formSet.add(jsField.form);
    if (cssField && cssField.form) formSet.add(cssField.form);
    formSet.forEach(form => {
      if (!form) return;
      try {
        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
          submitted = true;
        } else if (typeof form.submit === 'function') {
          form.submit();
          submitted = true;
        }
      } catch (_) {}
    });

    return submitted;
  }

  function ensureTab(modal){
    if (!modal) return null;

    const { tabContainer, contentContainer } = ensureTabSystem(modal);
    const panelHost = contentContainer || modal.querySelector('.tab-content') || modal;

    let panel = panelHost?.querySelector('#btfw-theme-admin-panel');
    if (panel) return panel;

    if (!tabContainer || !panelHost) return null;

    let tab = tabContainer.querySelector("li[data-btfw-theme-tab]");
    if (!tab) {
      const existingLink = tabContainer.querySelector("a[href='#btfw-theme-admin-panel'], a[data-target='#btfw-theme-admin-panel']");
      if (existingLink) {
        tab = existingLink.closest('li') || existingLink;
        tab.dataset.btfwThemeTab = "1";
      } else if (tabContainer.tagName === 'UL' || tabContainer.tagName === 'OL' || tabContainer.classList.contains('nav-tabs')) {
        tab = document.createElement('li');
        tab.dataset.btfwThemeTab = "1";
        const anchor = document.createElement('a');
        anchor.href = '#btfw-theme-admin-panel';
        anchor.setAttribute('data-toggle', 'tab');
        anchor.append(...buildThemeTabAnchorContent());
        anchor.style.display = 'flex';
        anchor.style.alignItems = 'center';
        anchor.style.gap = '8px';
        tab.appendChild(anchor);
        tabContainer.appendChild(tab);
      } else {
        const anchor = document.createElement('a');
        anchor.href = '#btfw-theme-admin-panel';
        anchor.setAttribute('data-toggle', 'tab');
        anchor.className = 'btfw-theme-tab-toggle';
        anchor.append(...buildThemeTabAnchorContent());
        tabContainer.appendChild(anchor);
        tab = anchor;
      }
    }

    panel = document.createElement('div');
    panel.id = 'btfw-theme-admin-panel';
    panel.className = 'tab-pane';
    panel.setAttribute('role', 'tabpanel');
    panel.style.display = 'none';
    panelHost.appendChild(panel);

    return panel;
  }

  function applyConfigToFields(panel, cfg, modal, options = {}){
    const mode = options.mode || 'manual';
    const status = panel.querySelector('#btfw-theme-status');
    const jsField = ensureField(modal, JS_FIELD_SELECTORS, "chanjs");
    const cssField = ensureField(modal, CSS_FIELD_SELECTORS, "chancss");
    if (!jsField || !cssField) {
      if (status) {
        status.textContent = "Could not find Channel JS or CSS fields.";
        status.dataset.variant = "error";
      }
      return;
    }

    const existingJs = jsField.value || "";
    const existingCss = cssField.value || "";

    const mergedConfig = collectConfig(panel, cfg);
    const jsBlock = themeConfig.buildConfigBlock(mergedConfig);
    const cssBlock = themeConfig.buildCssBlock(mergedConfig);

    const cleanedJs = themeConfig.stripLegacySliderGlobals(existingJs);
    jsField.value = replaceThemeAdminBlock(cleanedJs, jsBlock, JS_START_MARKERS, JS_END_MARKERS);

    cssField.value = replaceThemeAdminBlock(existingCss, cssBlock, CSS_START_MARKERS, CSS_END_MARKERS);

    ['input', 'change'].forEach(type => {
      try {
        jsField.dispatchEvent(new Event(type, { bubbles: true }));
      } catch (_) {}
      try {
        cssField.dispatchEvent(new Event(type, { bubbles: true }));
      } catch (_) {}
    });

    const runtimeConfig = themeRuntimeDomain.syncRuntimeThemeConfig(mergedConfig) || mergedConfig;

    if (status) {
      if (mode === 'manual') {
        status.textContent = "Theme JS & CSS applied. Submitting changes...";
        status.dataset.variant = "pending";
      } else if (mode === 'init') {
        status.textContent = "BillTube theme prepared. Click apply to submit changes.";
        status.dataset.variant = "idle";
      }
    }
    return { config: runtimeConfig, jsField, cssField };
  }

  function initPanel(modal){
    if (!canManageChannel()) return false;
    const panel = ensureTab(modal);
    if (!panel || panel.dataset.initialized === "1") return Boolean(panel);

    renderPanel(panel);

    const jsField = ensureField(modal, JS_FIELD_SELECTORS, "chanjs");
    const cssField = ensureField(modal, CSS_FIELD_SELECTORS, "chancss");
    const storedConfig = themeConfig.parseConfig(jsField?.value || "");
    const cfg = themeConfig.deepMerge(themeConfig.cloneDefaults(), storedConfig || {});
    const storedVersion = Number(cfg.version) || 0;
    cfg.version = themeConfig.DEFAULT_CONFIG.version;

    delete cfg.slider;
    delete cfg.sliderEnabled;
    delete cfg.sliderJson;

    if (!cfg.integrations || typeof cfg.integrations !== "object") {
      cfg.integrations = themeConfig.cloneDefaults().integrations;
    }
    if (typeof cfg.integrations.enabled !== "boolean") {
      cfg.integrations.enabled = true;
    }
    delete cfg.integrations.tmdb;
    delete cfg.integrations.ratings;
    delete cfg.integrations.autoSubs;
    delete cfg.integrations.audioEnhancer;
    if (!cfg.integrations.movieInfo || typeof cfg.integrations.movieInfo !== "object") {
      cfg.integrations.movieInfo = { enabled: false };
    }
    cfg.integrations.movieInfo.enabled = Boolean(cfg.integrations.movieInfo.enabled);

    if (!cfg.branding || typeof cfg.branding !== "object") {
      cfg.branding = themeConfig.cloneDefaults().branding;
    }
    if (typeof cfg.branding.favicon === "string" && !cfg.branding.faviconUrl) {
      cfg.branding.faviconUrl = cfg.branding.favicon;
    }
    if (typeof cfg.headerName === "string" && !cfg.branding.headerName) {
      cfg.branding.headerName = cfg.headerName;
    }
    if (typeof cfg.branding.header === "string" && !cfg.branding.headerName) {
      cfg.branding.headerName = cfg.branding.header;
    }
    if (typeof cfg.faviconUrl === "string" && !cfg.branding.faviconUrl) {
      cfg.branding.faviconUrl = cfg.faviconUrl;
    }
    if (typeof cfg.posterUrl === "string" && !cfg.branding.posterUrl) {
      cfg.branding.posterUrl = cfg.posterUrl;
    }
    if (typeof cfg.branding.posterUrl !== "string") {
      cfg.branding.posterUrl = '';
    }

    if (!cfg.resources || typeof cfg.resources !== "object") {
      cfg.resources = themeConfig.cloneDefaults().resources;
    }
    if (!Array.isArray(cfg.resources.styles)) {
      cfg.resources.styles = [];
    }
    if (!Array.isArray(cfg.resources.scripts)) {
      cfg.resources.scripts = [];
    }
    const resourceModules = themeConfig.normalizeModuleUrls(themeConfig.collectModuleCandidates(cfg));
    cfg.resources.modules = resourceModules;
    delete cfg.resources.moduleUrls;
    delete cfg.resources.externalModules;
    delete cfg.moduleUrls;
    delete cfg.externalModules;
    delete cfg.modules;

let initializing = true;
updateInputs(panel, cfg);
initializing = false;

setTimeout(() => {
  const modules = themeConfig.normalizeModuleUrls(themeConfig.collectModuleCandidates(cfg));
  renderModuleInputs(panel, modules);
  ensureModuleFieldAvailability(panel);
}, 50);

    let dirty = false;
    const status = panel.querySelector('#btfw-theme-status');

    const markDirty = () => {
      if (initializing) return;
      const latest = collectConfig(panel, cfg);
      themeConfig.overwriteConfig(cfg, latest);
      dirty = true;
      if (status) {
        status.textContent = "Changes pending. Click Apply in the channel settings footer…";
        status.dataset.variant = "pending";
      }
      try {
        BTFW.init("feature:channelOptionsApply").then((mod) => {
          mod?.markDirty?.("theme-admin");
        });
      } catch (_) {}
    };

    watchInputs(panel, cfg, markDirty);

    // CRITICAL FIX: Ensure module fields are initialized after binding
    setTimeout(() => {
      const container = getModuleContainer(panel);
      if (container) {
        ensureModuleFieldAvailability(panel);
      } else {
        console.error('[theme-admin] Module container NOT found after panel init');
      }
    }, 100);

    const applyBtn = panel.querySelector('#btfw-theme-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const latest = collectConfig(panel, cfg);
        themeConfig.overwriteConfig(cfg, latest);
        const result = applyConfigToFields(panel, cfg, modal, { mode: 'manual' });
        if (!result) return;
        dirty = false;
        window.setTimeout(() => {
          const submitted = triggerChannelSubmit(modal, result.jsField, result.cssField);
          if (status) {
            if (submitted) {
              status.textContent = "Theme JS & CSS applied and submitted to CyTube.";
              status.dataset.variant = "saved";
            } else {
              status.textContent = "Theme JS & CSS applied. Save channel settings to publish.";
              status.dataset.variant = "idle";
            }
          }
        }, 60);
      });
    }

    const observer = new MutationObserver(() => {
      const active = panel.classList.contains('active') || panel.style.display === 'block';
      if (active && status && dirty) {
        status.textContent = "Changes pending. Click apply to sync with Channel JS/CSS.";
        status.dataset.variant = "pending";
      }
    });
    observer.observe(panel, { attributes: true, attributeFilter: ['class', 'style'] });

    const existingJs = jsField?.value || "";
    const existingCss = cssField?.value || "";
    const hasJsBlock = hasThemeAdminJsBlock(existingJs) && !hasBrokenThemeAdminJsMarkers(existingJs);
    const hasCssBlock = hasThemeAdminCssBlock(existingCss);
    const currentVersion = storedVersion;
    let needsInit = !hasJsBlock || !hasCssBlock;
    if (currentVersion < themeConfig.DEFAULT_CONFIG.version) {
      cfg.version = themeConfig.DEFAULT_CONFIG.version;
      needsInit = true;
    }
    if (needsInit) {
      dirty = true;
      if (status) {
        status.textContent = "Changes pending. Click Apply in the channel settings footer…";
        status.dataset.variant = "idle";
      }
      try {
        BTFW.init("feature:channelOptionsApply").then((mod) => {
          mod?.markDirty?.("theme-admin");
        });
      } catch (_) {}
    } else if (status && !dirty) {
      status.textContent = "Theme settings loaded. No changes applied yet.";
      status.dataset.variant = "idle";
    }

    panel.dataset.initialized = "1";
    return true;
  }

  const CHANNEL_MODAL_SELECTOR = "#channeloptions, #channelsettingsmodal, #channeloptionsmodal, .channel-settings-modal";

  function removeChannelThemeTab(modal) {
    if (!modal) return;
    modal.querySelector("#btfw-theme-admin-panel")?.remove();
    modal.querySelectorAll(
      "a[href='#btfw-theme-admin-panel'], a[data-target='#btfw-theme-admin-panel']"
    ).forEach((link) => {
      const tab = link.closest("li[data-btfw-theme-tab]") || link.closest("li");
      if (tab?.parentElement) tab.remove();
      else link.remove();
    });
    delete modal.dataset.btfwThemeAdminBound;
  }

  function ensureModalPanel(modal) {
    if (!modal) return;
    if (canManageChannel()) {
      initPanel(modal);
    } else {
      removeChannelThemeTab(modal);
    }
  }

  function boot() {
    ensureModalPanel(document.querySelector(CHANNEL_MODAL_SELECTOR));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  const bindModalEvents = (()=>{
    let bound = false;
    return function(){
      if (bound) return;
      bound = true;
      const handler = (event)=>{
        const modal = event?.target?.closest?.(CHANNEL_MODAL_SELECTOR) ||
          (event?.target && event.target.matches?.(CHANNEL_MODAL_SELECTOR) ? event.target : null);
        ensureModalPanel(modal);
      };
      document.addEventListener("show.bs.modal", handler, true);
      document.addEventListener("shown.bs.modal", handler, true);
    };
  })();

  themeRuntimeDomain.bootstrapRuntimeThemeSync();
  bindModalEvents();

  return { name: "feature:channelThemeAdmin" };
});
