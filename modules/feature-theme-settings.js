/* BTFW — feature:themeSettings */
BTFW.define("feature:themeSettings", ["util:themeRuntime", "util:themePresets", "feature:themeMode"], async ({ init }) => {
  const themeRuntime = await init("util:themeRuntime");
  const themePresets = await init("util:themePresets");
  const themeMode = await init("feature:themeMode");
  const motion = await BTFW.init("util:motion");

  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const TS_KEYS = {
    chatTextPx  : "btfw:chat:textSize",
    avatarsMode : "btfw:chat:avatars",
    emoteSize   : "btfw:chat:emoteSize",
    gifAutoplay : "btfw:chat:gifAutoplay",
    chatAutoScroll: "btfw:chat:autoScroll",
    imageHoverMagnify: "btfw:chat:imageHoverMagnify",
    chatJoinNotices: "btfw:chat:joinNotices",
    localSubs   : "btfw:video:localsubs",
    layoutSide  : "btfw:layout:chatSide",
    themeMode   : "btfw:theme:mode"
  };

  const get = (k, d) => { try { const v = localStorage.getItem(k); return v==null? d : v; } catch(_) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch(_){} };

  const IGNORE_KEY = "btfw:chat:ignore";

  let appearanceDraft = themeRuntime.cloneAppearance(themePresets.getActiveAppearance());
  let editingPresetId = themePresets.getActivePreset()?.id || null;
  let generalTabSyncing = false;

  function buildTintOptionsHtml() {
    const options = Object.entries(themeRuntime.TINT_PRESETS)
      .map(([id, preset]) => `<option value="${id}">${preset.name}</option>`)
      .join("");
    return `${options}<option value="custom">Custom mix</option>`;
  }

  function buildFontOptionsHtml() {
    return Object.entries(themeRuntime.FONT_PRESETS)
      .map(([id, preset]) => `<option value="${id}">${preset.name}</option>`)
      .join("") + '<option value="custom">Custom Google Font</option>';
  }

  function buildColorField(key, label) {
    return `
      <div class="btfw-ts-control btfw-ts-control--color">
        <label class="btfw-input__label" for="btfw-user-color-${key}">${label}</label>
        <input type="color" id="btfw-user-color-${key}" data-btfw-user-color="${key}">
      </div>`;
  }

  function syncThemeModeUI(modal) {
    const select = $("#btfw-theme-mode", modal);
    if (!select || !themeMode?.getTheme) return;
    const current = themeMode.getTheme();
    select.value = ["dark", "light", "auto"].includes(current) ? current : "dark";
  }

  function syncGeneralTabUI(modal) {
    if (!modal) return;
    generalTabSyncing = true;
    try {
      const draft = appearanceDraft;
      const tintSelect = $("#btfw-user-tint", modal);
      if (tintSelect) tintSelect.value = draft.tint || "midnight";
      themeRuntime.COLOR_KEYS.forEach((key) => {
        const input = $(`#btfw-user-color-${key}`, modal);
        if (input && draft.colors?.[key]) input.value = draft.colors[key];
      });
      const fontSelect = $("#btfw-user-font", modal);
      if (fontSelect) fontSelect.value = draft.typography?.preset || themeRuntime.FONT_DEFAULT_ID;
      const customFont = $("#btfw-user-font-custom", modal);
      if (customFont) customFont.value = draft.typography?.customFamily || "";
      const customField = $("#btfw-user-font-custom-field", modal);
      if (customField) {
        customField.style.display = draft.typography?.preset === "custom" ? "block" : "none";
      }
      const presetSelect = $("#btfw-user-preset-select", modal);
      if (presetSelect) {
        const presets = themePresets.listPresets();
        const active = themePresets.getActivePreset();
        presetSelect.innerHTML = `<option value="">Channel default</option>${presets
          .map((p) => `<option value="${p.id}">${p.name.replace(/</g, "&lt;")}</option>`)
          .join("")}`;
        presetSelect.value = active?.id || "";
      }
      const resolved = themeRuntime.resolveTypographyConfig(draft.typography || {});
      const fontLabel = $("[data-btfw-user-font-label]", modal);
      const fontSample = $("[data-btfw-user-font-sample]", modal);
      if (fontLabel) fontLabel.textContent = resolved.label || "Inter";
      if (fontSample) {
        fontSample.style.fontFamily = resolved.family || themeRuntime.FONT_FALLBACK_FAMILY;
      }
      syncThemeModeUI(modal);
    } finally {
      generalTabSyncing = false;
    }
  }

  function readGeneralTabDraft(modal) {
    const tint = $("#btfw-user-tint", modal)?.value || "midnight";
    const colors = {};
    themeRuntime.COLOR_KEYS.forEach((key) => {
      colors[key] = $(`#btfw-user-color-${key}`, modal)?.value || appearanceDraft.colors[key];
    });
    const preset = $("#btfw-user-font", modal)?.value || themeRuntime.FONT_DEFAULT_ID;
    const customFamily = $("#btfw-user-font-custom", modal)?.value || "";
    return themeRuntime.normalizeAppearanceConfig({
      tint,
      colors,
      typography: { preset, customFamily }
    });
  }

  function previewGeneralAppearance(modal) {
    appearanceDraft = readGeneralTabDraft(modal);
    themeRuntime.applyUserAppearance(appearanceDraft, { scope: "preview" });
    syncGeneralTabUI(modal);
  }

  function bindGeneralTab(modal) {
    if (!modal || modal._btfwGeneralBound) return;
    modal._btfwGeneralBound = true;

    const onInput = () => {
      if (generalTabSyncing) return;
      previewGeneralAppearance(modal);
    };
    $("#btfw-user-tint", modal)?.addEventListener("change", () => {
      const tint = $("#btfw-user-tint", modal)?.value;
      if (tint && tint !== "custom" && themeRuntime.TINT_PRESETS[tint]) {
        appearanceDraft = themeRuntime.normalizeAppearanceConfig({
          tint,
          colors: { ...themeRuntime.TINT_PRESETS[tint].colors },
          typography: appearanceDraft.typography
        });
        themeRuntime.applyUserAppearance(appearanceDraft, { scope: "preview" });
        syncGeneralTabUI(modal);
        return;
      }
      onInput();
    });
    themeRuntime.COLOR_KEYS.forEach((key) => {
      $(`#btfw-user-color-${key}`, modal)?.addEventListener("input", () => {
        if (generalTabSyncing) return;
        const tintSelect = $("#btfw-user-tint", modal);
        if (tintSelect && tintSelect.value !== "custom") tintSelect.value = "custom";
        onInput();
      });
    });
    $("#btfw-user-font", modal)?.addEventListener("change", () => {
      const customField = $("#btfw-user-font-custom-field", modal);
      const isCustom = $("#btfw-user-font", modal)?.value === "custom";
      if (customField) customField.style.display = isCustom ? "block" : "none";
      onInput();
    });
    $("#btfw-user-font-custom", modal)?.addEventListener("input", () => {
      const fontSelect = $("#btfw-user-font", modal);
      if (fontSelect && fontSelect.value !== "custom") fontSelect.value = "custom";
      onInput();
    });

    $("#btfw-user-preset-select", modal)?.addEventListener("change", () => {
      const id = $("#btfw-user-preset-select", modal)?.value || "";
      if (!id) {
        editingPresetId = null;
        themePresets.clearActivePreset();
        appearanceDraft = themeRuntime.cloneAppearance(
          themeRuntime.extractAppearanceFromChannelConfig(window.BTFW_THEME_ADMIN)
        );
      } else {
        const store = themePresets.setActivePreset(id);
        const preset = store.presets.find((p) => p.id === id);
        if (preset) {
          editingPresetId = preset.id;
          appearanceDraft = themeRuntime.cloneAppearance(preset.config);
          themeRuntime.applyUserAppearance(appearanceDraft);
        }
      }
      syncGeneralTabUI(modal);
    });

    $("#btfw-user-preset-save", modal)?.addEventListener("click", () => {
      const name = window.prompt("Preset name", editingPresetId ? themePresets.getActivePreset()?.name || "" : "");
      if (!name) return;
      const config = readGeneralTabDraft(modal);
      if (editingPresetId) {
        themePresets.updatePreset(editingPresetId, { name, config });
      } else {
        const result = themePresets.saveNewPreset(name, config);
        if (result.preset) editingPresetId = result.preset.id;
      }
      themeRuntime.applyUserAppearance(config);
      appearanceDraft = themeRuntime.cloneAppearance(config);
      syncGeneralTabUI(modal);
    });

    $("#btfw-user-preset-rename", modal)?.addEventListener("click", () => {
      const active = themePresets.getActivePreset();
      if (!active) return;
      const name = window.prompt("Rename preset", active.name);
      if (!name) return;
      themePresets.updatePreset(active.id, { name });
      syncGeneralTabUI(modal);
    });

    $("#btfw-user-preset-delete", modal)?.addEventListener("click", () => {
      const active = themePresets.getActivePreset();
      if (!active) return;
      if (!window.confirm(`Delete preset "${active.name}"?`)) return;
      themePresets.deletePreset(active.id);
      editingPresetId = null;
      appearanceDraft = themeRuntime.cloneAppearance(
        themeRuntime.extractAppearanceFromChannelConfig(window.BTFW_THEME_ADMIN)
      );
      themePresets.clearActivePreset();
      syncGeneralTabUI(modal);
      previewGeneralAppearance(modal);
    });

    $("#btfw-user-reset-channel", modal)?.addEventListener("click", () => {
      editingPresetId = null;
      themePresets.clearActivePreset();
      appearanceDraft = themeRuntime.cloneAppearance(
        themeRuntime.extractAppearanceFromChannelConfig(window.BTFW_THEME_ADMIN)
      );
      syncGeneralTabUI(modal);
      previewGeneralAppearance(modal);
    });
  }

  function applyGeneralAppearance() {
    const modal = $("#btfw-theme-modal");
    const config = modal ? readGeneralTabDraft(modal) : appearanceDraft;
    appearanceDraft = themeRuntime.cloneAppearance(config);
    if (editingPresetId) {
      themePresets.updatePreset(editingPresetId, { config });
      themePresets.setActivePreset(editingPresetId);
    }
    themeRuntime.applyUserAppearance(config);
    return config;
  }

  function onGeneralTabOpen() {
    const modal = $("#btfw-theme-modal");
    if (!modal) return;
    editingPresetId = themePresets.getActivePreset()?.id || null;
    appearanceDraft = themeRuntime.cloneAppearance(themePresets.getActiveAppearance());
    syncGeneralTabUI(modal);
  }

  function normalizeName(name){
    return (name || "").trim().replace(/^@+/, "");
  }

  function loadIgnoreNames(){
    try {
      const raw = localStorage.getItem(IGNORE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(v => normalizeName(String(v))).filter(Boolean);
    } catch(_) {
      return [];
    }
  }

  function persistIgnoreNames(list){
    try { localStorage.setItem(IGNORE_KEY, JSON.stringify(list)); } catch(_){}
  }

  // apply CSS variables immediately (used by chat/emote sizing)
  function applyChatTextPx(px){
    const wrap = $("#chatwrap");
    if (!wrap) return;
    const clamped = Math.min(Math.max(Number(px) || 14, 10), 20);
    wrap.style.setProperty("--btfw-chat-text", `${clamped}px`);
  }
  function applyEmoteSize(size){
    const px = size==="small"?100 : size==="big"?170 : 130; // medium default
    document.documentElement.style.setProperty("--btfw-emote-size", `${px}px`);
    document.dispatchEvent(new CustomEvent("btfw:chat:emoteSizeChanged", { detail:{ size, px } }));
  }

  function persistImageHoverMagnify(modal) {
    const on = $("#btfw-image-hover-magnify", modal)?.checked;
    set(TS_KEYS.imageHoverMagnify, on ? "1" : "0");
    document.dispatchEvent(new CustomEvent("btfw:chat:imageHoverMagnifyChanged", {
      detail: { enabled: !!on }
    }));
  }

  const moduleCache = new Map();
  function getModule(name){
    if (moduleCache.has(name)) return moduleCache.get(name);
    const promise = (window.BTFW && typeof BTFW.init === "function")
      ? BTFW.init(name).catch(()=>null)
      : Promise.resolve(null);
    moduleCache.set(name, promise);
    return promise;
  }

  let avatarsModule = null;
  let ignoreModule = null;

  function resolveAvatars(){
    if (avatarsModule) return Promise.resolve(avatarsModule);
    return getModule("feature:chat-avatars").then(mod => {
      if (mod) avatarsModule = mod;
      if (avatarsModule) return avatarsModule;
      return getModule("feature:chatAvatars").then(alt => {
        if (alt) avatarsModule = alt;
        return avatarsModule;
      });
    });
  }

  resolveAvatars();

  function resolveIgnore(){
    if (ignoreModule) return Promise.resolve(ignoreModule);
    return getModule("feature:chat-ignore").then(mod => {
      if (mod) ignoreModule = mod;
      return ignoreModule;
    });
  }
  resolveIgnore();

  function getIgnoreNames(){
    if (ignoreModule?.list) {
      try {
        const list = ignoreModule.list();
        if (Array.isArray(list)) return list.map(v => normalizeName(String(v))).filter(Boolean);
      } catch(_){}
    }
    return loadIgnoreNames();
  }

  function addIgnoreName(name){
    const normalized = normalizeName(name);
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    const current = new Set(getIgnoreNames().map(n => n.toLowerCase()));
    if (current.has(key)) return false;

    if (ignoreModule?.add) {
      try { ignoreModule.add(normalized); } catch(_){}
    } else {
      const list = loadIgnoreNames();
      list.push(key);
      persistIgnoreNames(list);
      resolveIgnore().then(mod => { try { mod?.add?.(normalized); } catch(_){} });
    }
    return true;
  }

  function removeIgnoreName(name){
    const normalized = normalizeName(name);
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    const current = getIgnoreNames();
    if (!current.some(n => n.toLowerCase() === key)) return false;

    if (ignoreModule?.remove) {
      try { ignoreModule.remove(normalized); } catch(_){}
    } else {
      const next = loadIgnoreNames().filter(n => n.toLowerCase() !== key);
      persistIgnoreNames(next);
      resolveIgnore().then(mod => { try { mod?.remove?.(normalized); } catch(_){} });
    }
    return true;
  }

  // --- modal creation ---
  function ensureModal(){
    let m = $("#btfw-theme-modal");
    if (m) return m;

    ["#themesettings","#themeSettingsModal",".themesettings"].forEach(sel=> $$(sel).forEach(el=>el.remove()));

    m = document.createElement("div");
    m.id = "btfw-theme-modal";
    m.className = "modal";
    m.dataset.btfwModalState = "closed";
    m.setAttribute("hidden", "");
    m.setAttribute("aria-hidden", "true");
    m.innerHTML = `
      <div class="modal-background"></div>
      <div class="modal-card btfw-theme-modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Theme Settings</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="tabs btfw-ts-tabs is-small" id="btfw-ts-tabs">
            <ul>
              <li class="is-active" data-tab="general"><a>General</a></li>
              <li data-tab="chat"><a>Chat</a></li>
              <li data-tab="notifications"><a>Notifications</a></li>
              <li data-tab="video"><a>Video</a></li>
              <li data-tab="ignore"><a>Ignore</a></li>
            </ul>
          </div>

          <div id="btfw-ts-panels">
            <!-- General -->
            <div class="btfw-ts-panel" data-tab="general" style="display:block;">
              <div class="btfw-ts-grid">
                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Interface theme</h3>
                    <p>Dark or light chrome for CyTube dialogs and legacy UI. Separate from your color palette below.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-theme-mode">Theme mode</label>
                      <select class="btfw-ts-select is-small" id="btfw-theme-mode">
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto (system)</option>
                      </select>
                      <p class="btfw-help">Auto follows your OS <code>prefers-color-scheme</code> preference.</p>
                    </div>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Your appearance</h3>
                    <p>Personal palette and typography layered on the channel default. Saved only in this browser.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-user-preset-select">Saved presets</label>
                      <div class="field has-addons">
                        <div class="control is-expanded">
                          <select class="btfw-ts-select is-small is-fullwidth" id="btfw-user-preset-select"></select>
                        </div>
                        <div class="control">
                          <button type="button" class="button is-small is-link" id="btfw-user-preset-save">Save</button>
                        </div>
                      </div>
                      <p class="btfw-help">Load a preset or save the current look. Use Apply to persist edits to the active preset.</p>
                    </div>
                    <div class="buttons are-small btfw-user-preset-actions">
                      <button type="button" class="button is-small" id="btfw-user-preset-rename">Rename</button>
                      <button type="button" class="button is-small is-danger is-light" id="btfw-user-preset-delete">Delete</button>
                      <button type="button" class="button is-small" id="btfw-user-reset-channel">Reset to channel default</button>
                    </div>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Palette &amp; tint</h3>
                    <p>Start from a curated tint, then fine-tune individual swatches.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-user-tint">Preset tint</label>
                      <select class="btfw-ts-select is-small" id="btfw-user-tint">${buildTintOptionsHtml()}</select>
                    </div>
                    <div class="btfw-ts-color-grid">
                      ${buildColorField("background", "Background")}
                      ${buildColorField("surface", "Surface")}
                      ${buildColorField("panel", "Panel")}
                      ${buildColorField("text", "Primary text")}
                      ${buildColorField("chatText", "Chat text")}
                      ${buildColorField("accent", "Accent")}
                    </div>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Typography</h3>
                    <p>Font family applied to the BillTube UI for you only.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-user-font">Font preset</label>
                      <select class="btfw-ts-select is-small" id="btfw-user-font">${buildFontOptionsHtml()}</select>
                    </div>
                    <div class="btfw-ts-control" id="btfw-user-font-custom-field" style="display:none;">
                      <label class="btfw-input__label" for="btfw-user-font-custom">Custom Google font name</label>
                      <input class="input is-small" type="text" id="btfw-user-font-custom" placeholder="Space Grotesk">
                    </div>
                    <div class="btfw-user-font-preview" aria-hidden="true">
                      <div class="btfw-user-font-preview__label" data-btfw-user-font-label>Inter</div>
                      <p class="btfw-user-font-preview__sample" data-btfw-user-font-sample>The quick brown fox jumps over the lazy dog.</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <!-- Chat -->
            <div class="btfw-ts-panel" data-tab="chat" style="display:none;">
              <div class="btfw-ts-grid">
                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Avatars & text</h3>
                    <p>Adjust density and readability for the chat column.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-avatars-mode">Avatar size</label>
                      <select class="btfw-ts-select is-small" id="btfw-avatars-mode">
                          <option value="off">Off</option>
                          <option value="small">Small</option>
                          <option value="big">Big</option>
                      </select>
                    </div>
                    <div class="btfw-ts-control">
                      <span class="btfw-input__label">Chat text size</span>
                      <div class="control btfw-range-control">
                        <input type="range" id="btfw-chat-textsize" min="10" max="20" step="1">
                        <span class="btfw-range-value" id="btfw-chat-textsize-value">14px</span>
                      </div>
                      <p class="btfw-help">Set chat typography anywhere between 10&nbsp;px and 20&nbsp;px.</p>
                    </div>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Media</h3>
                    <p>Control sticker and GIF behaviour for the chat experience.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-emote-size">Emote size</label>
                      <select class="btfw-ts-select is-small" id="btfw-emote-size">
                          <option value="small">Small (100×100)</option>
                          <option value="medium">Medium (130×130)</option>
                          <option value="big">Big (170×170)</option>
                      </select>
                      <p class="btfw-help">Applies to elements with <code>.channel-emote</code> and the GIF picker.</p>
                    </div>
                    <label class="checkbox btfw-checkbox">
                      <input type="checkbox" id="btfw-gif-autoplay"> <span>Autoplay GIFs in chat (otherwise play on hover)</span>
                    </label>
                    <label class="checkbox btfw-checkbox">
                      <input type="checkbox" id="btfw-chat-autoscroll"> <span>Auto-scroll to new messages</span>
                    </label>
                    <label class="checkbox btfw-checkbox">
                      <input type="checkbox" id="btfw-image-hover-magnify"> <span>Magnify images and emotes on hover</span>
                    </label>
                  </div>
                </section>

              </div>
            </div>

            <!-- Notifications -->
            <div class="btfw-ts-panel" data-tab="notifications" style="display:none;">
              <div class="btfw-ts-grid">
                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Join alerts</h3>
                    <p>Decide whether to show join popups for new users.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <label class="checkbox btfw-checkbox">
                      <input type="checkbox" id="btfw-chat-join-notices"> <span>Show notifications when users join</span>
                    </label>
                    <p class="btfw-help">Affects the “Joined” popups triggered by users entering the channel.</p>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Notification sounds</h3>
                    <p>Pick custom audio cues for channel activity.</p>
                  </header>
                  <div class="btfw-ts-card__body" id="btfw-notify-sounds-body">
                    <p class="btfw-help">Open this panel to configure alert tones for joins, mentions, polls, and new videos.</p>
                  </div>
                </section>
              </div>
            </div>

            <!-- Video -->
            <div class="btfw-ts-panel" data-tab="video" style="display:none;">
              <div class="btfw-ts-grid">
                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Layout</h3>
                    <p>Choose how the desktop layout positions chat and video.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <div class="btfw-ts-control">
                      <label class="btfw-input__label" for="btfw-chat-side">Layout mode</label>
                      <select class="btfw-ts-select is-small" id="btfw-chat-side">
                          <option value="right">Video left, chat right</option>
                          <option value="left">Chat left, video right</option>
                      </select>
                    </div>
                    <p class="btfw-help">Mobile screens automatically collapse into a stacked layout.</p>
                  </div>
                </section>

                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Playback tools</h3>
                    <p>Subtitle options for the HTML5 player.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <label class="checkbox btfw-checkbox">
                      <input type="checkbox" id="btfw-localsubs-toggle"> <span>Show the “Local Subtitles” button</span>
                    </label>
                    <p class="btfw-help">Allows viewers to load local <code>.vtt</code> or <code>.srt</code> caption files.</p>
                  </div>
                </section>
              </div>
            </div>

            <!-- Ignore -->
            <div class="btfw-ts-panel" data-tab="ignore" style="display:none;">
              <div class="btfw-ts-grid">
                <section class="btfw-ts-card">
                  <header class="btfw-ts-card__header">
                    <h3>Ignored users</h3>
                    <p>Hide messages from specific usernames. Changes apply instantly.</p>
                  </header>
                  <div class="btfw-ts-card__body">
                    <form class="btfw-ignore-form" id="btfw-ignore-form">
                      <div class="field has-addons">
                        <div class="control is-expanded">
                          <input class="input is-small" id="btfw-ignore-input" type="text" placeholder="Enter username">
                        </div>
                        <div class="control">
                          <button class="button is-link is-small" type="submit">Add</button>
                        </div>
                      </div>
                    </form>
                    <div class="btfw-ignore-list" id="btfw-ignore-list" aria-live="polite"></div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        <footer class="modal-card-foot">
          <button class="button is-link" id="btfw-ts-apply">Apply</button>
          <button class="button" id="btfw-ts-close">Close</button>
        </footer>
      </div>
    `;
    document.body.appendChild(m);

    // Close actions
    $(".modal-background", m).addEventListener("click", close);
    $(".delete", m).addEventListener("click", close);
    $("#btfw-ts-close", m).addEventListener("click", close);

    // Tabs
    $("#btfw-ts-tabs ul", m).addEventListener("click", (e)=>{
      const li = e.target.closest("li[data-tab]"); if (!li) return;
      $$("#btfw-ts-tabs li", m).forEach(x => x.classList.toggle("is-active", x===li));
      const tab = li.getAttribute("data-tab");
      $$("#btfw-ts-panels .btfw-ts-panel", m).forEach(p => p.style.display = (p.dataset.tab===tab) ? "block" : "none");
      if (tab === "general") onGeneralTabOpen();
    });

    // Apply button
    $("#btfw-ts-apply", m).addEventListener("click", applyAndPersist);

    const hoverMagnifyInput = $("#btfw-image-hover-magnify", m);
    if (hoverMagnifyInput && !hoverMagnifyInput._btfwHoverMagnifyBound) {
      hoverMagnifyInput._btfwHoverMagnifyBound = true;
      hoverMagnifyInput.addEventListener("change", () => persistImageHoverMagnify(m));
    }

    const chatTextSlider = $("#btfw-chat-textsize", m);
    const chatTextValue  = $("#btfw-chat-textsize-value", m);
    if (chatTextSlider && chatTextValue) {
      const updateLabel = (val) => { chatTextValue.textContent = `${val}px`; };
      chatTextSlider.addEventListener("input", () => updateLabel(chatTextSlider.value || "14"));
      updateLabel(chatTextSlider.value || "14");
    }

    // Open via event (also wired at boot via wireOpenEvent)
    if (!openEventWired) wireOpenEvent();

    const ignoreListEl = $("#btfw-ignore-list", m);
    const ignoreForm = $("#btfw-ignore-form", m);
    const ignoreInput = $("#btfw-ignore-input", m);

    const renderIgnoreList = () => {
      if (!ignoreListEl) return;
      const names = getIgnoreNames();
      ignoreListEl.innerHTML = "";
      if (!names.length) {
        const empty = document.createElement("p");
        empty.className = "btfw-help";
        empty.textContent = "No ignored users yet.";
        ignoreListEl.appendChild(empty);
        return;
      }
      const list = document.createElement("ul");
      list.className = "btfw-ignore-items";
      names
        .slice()
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
        .forEach(name => {
          const li = document.createElement("li");
          li.className = "btfw-ignore-item";

          const label = document.createElement("span");
          label.className = "btfw-ignore-name";
          label.textContent = name;

          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "button is-small is-light";
          removeBtn.setAttribute("data-ignore-remove", name);
          removeBtn.textContent = "Remove";

          li.appendChild(label);
          li.appendChild(removeBtn);
          list.appendChild(li);
        });
      ignoreListEl.appendChild(list);
    };

    if (ignoreForm && !ignoreForm._btfwIgnoreBound) {
      ignoreForm._btfwIgnoreBound = true;
      ignoreForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = normalizeName(ignoreInput?.value || "");
        if (!value) return;
        const added = addIgnoreName(value);
        if (added && ignoreInput) ignoreInput.value = "";
        renderIgnoreList();
      });
    }

    if (ignoreListEl && !ignoreListEl._btfwIgnoreBound) {
      ignoreListEl._btfwIgnoreBound = true;
      ignoreListEl.addEventListener("click", (event) => {
        const button = event.target?.closest?.("[data-ignore-remove]");
        if (!button) return;
        const name = button.getAttribute("data-ignore-remove") || "";
        if (removeIgnoreName(name)) {
          renderIgnoreList();
        }
      });
    }

    m._btfwRenderIgnoreList = renderIgnoreList;

    bindGeneralTab(m);
    syncGeneralTabUI(m);

    return m;
  }

  function applyAndPersist(){
    const m = $("#btfw-theme-modal"); if (!m) return;

    const avatarsMode = $("#btfw-avatars-mode", m)?.value || "big";
    const chatTextPx  = $("#btfw-chat-textsize", m)?.value || "14";
    const emoteSize   = $("#btfw-emote-size", m)?.value   || "medium";
    const gifAutoOn   = $("#btfw-gif-autoplay", m)?.checked;
    const autoScrollOn = $("#btfw-chat-autoscroll", m)?.checked;
    const hoverMagnifyOn = $("#btfw-image-hover-magnify", m)?.checked;
    const joinNoticesOn = $("#btfw-chat-join-notices", m)?.checked;
    const localSubsOn = $("#btfw-localsubs-toggle", m)?.checked;
    const chatSide    = $("#btfw-chat-side", m)?.value || "right";
    const themeModePref = $("#btfw-theme-mode", m)?.value || "dark";

    set(TS_KEYS.avatarsMode, avatarsMode);
    set(TS_KEYS.chatTextPx, chatTextPx);
    set(TS_KEYS.emoteSize, emoteSize);
    set(TS_KEYS.gifAutoplay, gifAutoOn ? "1":"0");
    set(TS_KEYS.chatAutoScroll, autoScrollOn ? "1" : "0");
    set(TS_KEYS.imageHoverMagnify, hoverMagnifyOn ? "1" : "0");
    set(TS_KEYS.chatJoinNotices, joinNoticesOn ? "1":"0");
    set(TS_KEYS.localSubs,   localSubsOn ? "1":"0");
    set(TS_KEYS.layoutSide, chatSide);
    if (themeMode?.setTheme) themeMode.setTheme(themeModePref);

    if (avatarsModule?.setMode) avatarsModule.setMode(avatarsMode);
    else resolveAvatars().then(mod => { if (mod?.setMode) mod.setMode(avatarsMode); });

    applyChatTextPx(parseInt(chatTextPx,10));
    applyEmoteSize(emoteSize);

    document.dispatchEvent(new CustomEvent("btfw:chat:gifAutoplayChanged", { detail:{ autoplay: !!gifAutoOn } }));
    document.dispatchEvent(new CustomEvent("btfw:chat:autoScrollChanged", { detail:{ enabled: !!autoScrollOn } }));
    document.dispatchEvent(new CustomEvent("btfw:chat:imageHoverMagnifyChanged", { detail:{ enabled: !!hoverMagnifyOn } }));
    document.dispatchEvent(new CustomEvent("btfw:chat:joinNoticesChanged", { detail:{ enabled: !!joinNoticesOn } }));
    document.dispatchEvent(new CustomEvent("btfw:video:localsubs:changed", { detail:{ enabled : !!localSubsOn } }));
    document.dispatchEvent(new CustomEvent("btfw:layout:chatSideChanged",   { detail:{ side    : chatSide } }));

    const userAppearance = applyGeneralAppearance();

    document.dispatchEvent(new CustomEvent("btfw:themeSettings:apply",     { detail:{
      values: {
        avatarsMode, chatTextPx: parseInt(chatTextPx,10),
        emoteSize, gifAutoplay: !!gifAutoOn, chatAutoScroll: !!autoScrollOn, imageHoverMagnify: !!hoverMagnifyOn,
        localSubs: !!localSubsOn,
        themeMode: themeModePref,
        joinNotices: !!joinNoticesOn,
        chatSide,
        userAppearance
      }
    }}));
  }

  function open(){
    const m = ensureModal();
    const reopening = m.dataset.btfwModalState !== "open";

    if (reopening) {
      const avatarSelect = $("#btfw-avatars-mode", m);
      const storedAv = get(TS_KEYS.avatarsMode,"big");
      const avNow = avatarsModule?.getMode ? avatarsModule.getMode() : storedAv;
      if (avatarSelect) {
        avatarSelect.value = ["off","small","big"].includes(avNow) ? avNow : "big";
      }
      resolveAvatars().then(mod => {
        if (mod?.getMode && avatarSelect) {
          const live = mod.getMode();
          avatarSelect.value = ["off","small","big"].includes(live) ? live : avatarSelect.value;
        }
      });

      const chatPxNow = get(TS_KEYS.chatTextPx, "14");
      const chatSlider = $("#btfw-chat-textsize", m);
      if (chatSlider) chatSlider.value = chatPxNow;
      const chatLabel = $("#btfw-chat-textsize-value", m);
      if (chatLabel) chatLabel.textContent = `${chatPxNow}px`;
      $("#btfw-emote-size", m).value   = get(TS_KEYS.emoteSize,   "medium");
      $("#btfw-gif-autoplay", m).checked = get(TS_KEYS.gifAutoplay, "1") === "1";
      $("#btfw-chat-autoscroll", m).checked = get(TS_KEYS.chatAutoScroll, "1") === "1";
      $("#btfw-image-hover-magnify", m).checked = get(TS_KEYS.imageHoverMagnify, "0") === "1";
      $("#btfw-chat-join-notices", m).checked = get(TS_KEYS.chatJoinNotices, "1") === "1";
      $("#btfw-localsubs-toggle", m).checked = get(TS_KEYS.localSubs, "1") === "1";
      const layoutSelect = $("#btfw-chat-side", m);
      const sideNow = get(TS_KEYS.layoutSide, "right");
      if (layoutSelect) layoutSelect.value = ["left","right"].includes(sideNow) ? sideNow : "right";

      if (typeof m._btfwRenderIgnoreList === "function") m._btfwRenderIgnoreList();

      onGeneralTabOpen();
    }

    motion.openModal(m);
    document.dispatchEvent(new CustomEvent("btfw:themeSettings:open"));
  }
  function close(){
    const modal = $("#btfw-theme-modal");
    if (modal) motion.closeModal(modal);
  }

  const OPEN_SELECTOR = "#btfw-theme-btn-chat, #btfw-theme-btn-nav, .btfw-theme-open";
  let delegatedOpeners = false;
  let openEventWired = false;

  function wireOpenEvent(){
    if (openEventWired) return;
    openEventWired = true;
    document.addEventListener("btfw:openThemeSettings", open);
  }

  function wireOpeners(){
    if (delegatedOpeners) return;
    delegatedOpeners = true;
    document.addEventListener("click", (event)=>{
      const trigger = event.target?.closest?.(OPEN_SELECTOR);
      if (!trigger) return;
      event.preventDefault();
      open();
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getUserReleaseNotesData() {
    if (typeof BTFW_USER_RELEASE_NOTES !== "undefined" && Array.isArray(BTFW_USER_RELEASE_NOTES?.releases)) {
      return BTFW_USER_RELEASE_NOTES;
    }
    return { releases: [] };
  }

  function formatRecentUpdatesHtml() {
    const latest = getUserReleaseNotesData().releases?.[0];
    if (!latest) {
      return '<p class="btfw-useroptions-muted">Updates will appear here after the next channel release.</p>';
    }
    const parts = [];
    if (latest.version) {
      parts.push(`<span class="btfw-useroptions-version">v${escapeHtml(latest.version)}</span>`);
    }
    if (latest.summary) {
      parts.push(`<p class="btfw-useroptions-summary">${escapeHtml(latest.summary)}</p>`);
    }
    const items = Array.isArray(latest.highlights) ? latest.highlights.filter(Boolean) : [];
    if (items.length) {
      parts.push(
        `<ul class="btfw-useroptions-updates-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      );
    }
    if (!parts.length) {
      return '<p class="btfw-useroptions-muted">Updates will appear here after the next channel release.</p>';
    }
    return parts.join("");
  }

  function buildUserOptionsAboutHtml() {
    return `
      <div class="btfw-useroptions-hero">
        <span class="btfw-useroptions-badge">Quiglytube3</span>
        <h4>Created by Bill, Modified by Quigly</h4>
        <p>Quiglytube3 keeps the entire channel aligned with a unified visual language. Theme and layout settings are managed by the channel to ensure a consistent experience.</p>
      </div>
      <div class="btfw-useroptions-panels">
        <article class="btfw-useroptions-panel btfw-useroptions-panel--updates">
          <h5>Recent Updates</h5>
          ${formatRecentUpdatesHtml()}
        </article>
        <article class="btfw-useroptions-panel">
          <h5>Need a tweak?</h5>
          <p>Ping Quigly in Discord with feedback.</p>
        </article>
      </div>
    `;
  }

 function decorateUserOptions(modal = document.getElementById("useroptions")){
  if (!modal) return;
  const pane = modal.querySelector("#us-general");
  if (pane && !pane._btfwDecorated) {
    pane._btfwDecorated = true;
    pane.classList.add("btfw-useroptions-pane");
    
    const headers = Array.from(pane.querySelectorAll('h3, h4, .section-header, legend'));
    headers.forEach(header => {
      const text = header.textContent.toLowerCase();
      if (text.includes('general preferences')) {
        header.style.display = 'none';
      }
    });
    
    const paragraphs = Array.from(pane.querySelectorAll('p, .help-block, .text-muted'));
    paragraphs.forEach(p => {
      const text = p.textContent.toLowerCase();
      if (text.includes('changing layouts') || text.includes('require refreshing')) {
        p.style.display = 'none';
      }
    });
    
        const controlsById = [
      '#us-theme',
      '#us-layout', 
      '#us-no-channelcss',
      '#us-no-channeljs'
    ];
    
    controlsById.forEach(id => {
      const element = pane.querySelector(id);
      if (element) {
        const formGroup = element.closest('.form-group, .control-group, .checkbox, label, div');
        if (formGroup) {
          formGroup.style.display = 'none';
        }
      }
    });
    
    const labels = Array.from(pane.querySelectorAll('label'));
    labels.forEach(label => {
      const text = label.textContent.toLowerCase();
      if (text.includes('theme') || 
          text.includes('layout') || 
          text.includes('ignore channel css') || 
          text.includes('ignore channel javascript')) {
        label.style.display = 'none';
        
        const formGroup = label.closest('.form-group, .control-group, .checkbox, div');
        if (formGroup) {
          formGroup.style.display = 'none';
        }
      }
    });
    
    const checkboxes = Array.from(pane.querySelectorAll('input[type="checkbox"]'));
    checkboxes.forEach(checkbox => {
      const name = checkbox.name || checkbox.id || '';
      if (name.includes('channelcss') || name.includes('channeljs')) {
        const container = checkbox.closest('.form-group, .control-group, .checkbox, label, div');
        if (container) {
          container.style.display = 'none';
        }
      }
    });
    
    const selects = Array.from(pane.querySelectorAll('select'));
    selects.forEach(select => {
      const name = select.name || select.id || '';
      if (name.includes('theme') || name.includes('layout')) {
        const container = select.closest('.form-group, .control-group, div');
        if (container) {
          container.style.display = 'none';
        }
      }
    });
    
    const customSection = document.createElement("div");
    customSection.className = "btfw-useroptions-about";
    customSection.innerHTML = buildUserOptionsAboutHtml();
    
    pane.insertBefore(customSection, pane.firstChild);
  }
}

  let userOptionsBound = false;
  function bindUserOptions(){
    if (userOptionsBound) return;
    userOptionsBound = true;
    document.addEventListener("show.bs.modal", (event)=>{
      const modal = event?.target?.closest?.("#useroptions") || (event?.target?.id === "useroptions" ? event.target : null);
      if (modal) decorateUserOptions(modal);
    }, true);
  }

  function boot(){
    applyChatTextPx(parseInt(get(TS_KEYS.chatTextPx, "14"),10));
    applyEmoteSize(get(TS_KEYS.emoteSize,"medium"));
    wireOpeners();
    wireOpenEvent();
    decorateUserOptions();
    bindUserOptions();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return { name: "feature:themeSettings", open, close, wireOpeners };
});
