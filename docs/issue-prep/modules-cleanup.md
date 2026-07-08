# Modules cleanup — issue prep

Audit of `modules/` for modules that are unused, low-value, or candidates to split.

---

## `feature-ambient.js` (`feature:ambient`)

**Decision:** REMOVE

**Status:** Orphaned — bundled but not booted; UI integration removed.

### Purpose

Ambient glow mode for direct-file video playback (CyTube media types `fi` / `gd`).

When enabled, the module:

1. Clones the active `<video>` into a fixed-position background layer behind `#videowrap`
2. Applies heavy blur, saturation, and brightness filters for a “glow” effect
3. Syncs the clone with the source video (src, play/pause, seek)
4. Semi-transparents UI panels (`body.btfw-ambient-active`) so the glow shows through
5. Monitors `#videowrap` / video element changes on a 500ms interval
6. Listens to `socket.on("changeMedia")` and auto-disables when media is not direct (`fi`/`gd`)

### Public API

| Export | Role |
|--------|------|
| `enable()` | Activate ambient mode (requires direct media) |
| `disable()` | Deactivate and fade out glow |
| `toggle()` | Toggle on/off |
| `refresh()` | Rebuild glow elements while active |
| `isActive()` | Current state |
| `isSupported()` | Always `true` |

Dispatches `btfw:ambient:state` custom event on state changes.

### Bundle / boot wiring

| Location | Present? |
|----------|----------|
| `scripts/build.js` → `player` bundle | Yes |
| `billtube-fw.js` module load list | No (removed) |
| `billtube-fw.js` `BTFW.init(...)` list | No (removed) |

### Consumers

None in current codebase.

- No `BTFW.init("feature:ambient")` anywhere
- No listeners for `btfw:ambient:state`
- No references in theme settings, release notes, or CSS files outside the module’s injected `<style>`

Previously wired through `feature-video-overlay.js` (ambient toggle button `#btfw-ambient`, channel-owner + direct-media only). Removed in commit `3f01875` (“Disable ambient glow module”, 2025-10-29).

### Size / structure

- ~485 lines, single file
- ~80 lines of inline CSS via `ensureCSS()`
- Commented-out storage preference code (`STORAGE_KEY`, `getStoredPreference`, `setStoredPreference`) — intentionally session-only, always starts disabled
- Commented-out `removeCSS()`

### History

| Date | Commit | Change |
|------|--------|--------|
| 2025-09-24 | `de18368` | Added module; replaced external `BillTube_Ambient.js` script; wired into `billtube-fw.js` and `feature-video-overlay.js` |
| 2025-10-21 | `0550166` | Added `isDirectMedia()` guard + `changeMedia` socket handler |
| 2025-10-29 | `3f01875` | Disabled: removed boot init, removed overlay UI + `feature:ambient` dependency from video-overlay |

### Cleanup options

1. **Remove entirely** — no runtime consumers; saves ~485 lines + bundle weight
2. **Re-enable** — restore overlay button + `BTFW.init`; move inline CSS to `css/overlays.css`
3. **Split** — extract CSS to stylesheet; extract video-sync/glow DOM into `util-ambient-glow.js` if kept

### Recommendation

Remove from `player` bundle (`scripts/build.js`) and delete file. Dead code since Oct 2025; no planned re-enable.

---

## `feature-audio-boost.js` + `feature-audio-enhancer.js`

**Decision:** MERGE into `feature-audio-boost.js`; DELETE `feature-audio-enhancer.js`

### Current state

Two parallel implementations (~2100 lines combined) targeting the same overlay buttons and Web Audio pipeline:

| | `feature-audio-boost.js` | `feature-audio-enhancer.js` |
|--|----------------------------|--------------------------|
| Audio engine | `window.BTFW_AUDIO` | Module-local `sharedAudio` (duplicate) |
| Boot | `feature:audioboost` (always inited) | `feature:audioEnhancer` (always inited, gated at runtime) |
| Boost UI | `#btfw-vo-audioboost` — always shown | Same ID when integration enabled |
| Norm UI | `feature:audionorm` defined, **never boot-inited** | `#btfw-vo-audionorm` when integration enabled |
| CORS proxy | `vidprox.billtube.workers.dev` (inaccessible) | Same hardcoded URL |
| Trusted hosts | Exact match: `cytube.billtube.workers.dev`, `billtube.workers.dev` | None — always proxies when processing |

Channel theme admin toggle (`integrations.audioEnhancer.enabled`) exists in code but the admin panel is stripped from CyTube channel settings (`removeChannelThemeTab`). Users only see the always-on boost button from `feature:audioboost`.

Verified: typical indexed GDrive URLs on `*.workers.dev` already return `Access-Control-Allow-Origin: *` — no proxy needed for the common case.

### Implementation plan

#### 1. Deploy owned Cloudflare CORS proxy worker

Replace `vidprox.billtube.workers.dev` with a worker we control (e.g. `vidprox.<our-account>.workers.dev`).

Worker contract (inferred from client usage):

| Item | Spec |
|------|------|
| Request | `GET /?url=<encodeURIComponent(originalVideoUrl)>` |
| Behavior | Server-side `fetch(originalUrl)`, stream body to client |
| Response headers | `Access-Control-Allow-Origin: *` (or CyTube origin), support `Range` / `206` for seeking |
| Scope | Fallback only — rare third-party hosts without CORS |

Store proxy base URL in one constant in `feature-audio-boost.js` (future: `BTFW_CONFIG` override).

#### 2. Update trusted-domain policy in `BTFW_AUDIO`

Replace exact-host `TRUSTED_DOMAINS` list with suffix matching:

```javascript
// Remove hardcoded billtube hostnames:
//   'cytube.billtube.workers.dev', 'billtube.workers.dev'

function _isTrusted(urlStr) {
  try {
    const host = new URL(urlStr).hostname.toLowerCase();
    return host.endsWith('.workers.dev');
  } catch {
    return false;
  }
}
```

URL routing when boost or normalization is enabled:

```
*.workers.dev host?
  yes → keep original URL, set crossOrigin('anonymous'), Web Audio chain (no proxy)
  no  → rewrite src via owned CORS proxy worker, then Web Audio chain
```

Watchdog (`_checkAndReapply`) follows the same rule on `changeMedia` / src drift.

#### 3. Merge `feature-audio-enhancer.js` into `feature-audio-boost.js`

Single module owns the full feature:

| Keep from enhancer | Action |
|--------------------|--------|
| `#btfw-vo-audionorm` button + preset menu | Port into boost file; boot with boost (fix dead `feature:audionorm`) |
| Norm Web Audio chain (`DynamicsCompressor`) | Already in `BTFW_AUDIO` — wire UI only |
| `computeIntegrationEnabled()` gate | **Drop** — always-on per user request |
| `btfw:channelIntegrationsChanged` listener | **Drop** |
| Duplicate `sharedAudio` engine | **Drop** — use `window.BTFW_AUDIO` only |

| Keep from boost | Action |
|-----------------|--------|
| `BTFW_AUDIO` engine + watchdog | Retain, apply trusted/proxy policy above |
| `#btfw-vo-audioboost` button | Retain, always shown for direct media |
| `feature:audioboost` boot init | Retain as sole entry point |

#### 4. Remove dead code and references

| File / location | Change |
|-----------------|--------|
| `modules/feature-audio-enhancer.js` | Delete |
| `scripts/build.js` player bundle | Remove enhancer entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:audioEnhancer")` |
| `modules/feature-channel-theme-admin.js` | Remove `integrations.audioEnhancer` toggle, config sync, and help text |
| `feature:audionorm` IIFE in boost file | Fold into single `feature:audioboost` define (or one module, two buttons) |

#### 5. Expected runtime outcome

| Media source | Path | UX |
|--------------|------|-----|
| Indexed GDrive on `*.workers.dev` | Trusted, direct URL | Boost + norm work, no proxy hop |
| Rare third-party URL (no CORS) | Owned proxy fallback | Brief reload on enable; boost works if proxy deployed |
| YouTube / Vimeo / iframe embed | N/A | Button hidden or fails gracefully |
| Dead `vidprox.billtube.workers.dev` | Removed | No dependency on inaccessible worker |

Always-on megaphone + waveform buttons in `#btfw-vo-left` — no theme settings toggle.

### Work items (checklist)

- [ ] Create and deploy CORS video proxy Cloudflare Worker
- [ ] Update `CORS_PROXY` constant to owned worker URL
- [ ] Replace `TRUSTED_DOMAINS` exact list with `*.workers.dev` suffix match
- [ ] Merge norm button/UI from enhancer into `feature-audio-boost.js`
- [ ] Remove integration gate and duplicate engine from enhancer
- [ ] Delete `feature-audio-enhancer.js`; update bundle + boot
- [ ] Remove `audioEnhancer` from channel theme admin
- [ ] Smoke test: `*.workers.dev` direct file (boost without proxy), third-party URL (proxy fallback)

---

## `feature-auto-subs.js` (`feature:auto-subs`)

**Decision:** REMOVE

**Status:** Opt-in channel integration; heavy external dependencies; unreliable title matching.

### Purpose

Automatically fetches English subtitles for direct-file video (`fi` / `gd`) by:

1. Reading `#currenttitle` from CyTube
2. Resolving title → IMDb ID via TMDB (`util:tmdb-proxy` → movies-storage worker)
3. Fetching SRT from third-party `sub.wyzie.ru`
4. Converting SRT → WebVTT blob URLs
5. Injecting tracks via `videojs.addRemoteTextTrack()`

No viewer UI — subtitles appear in the player CC menu when a match succeeds.

### Activation

Gated by `integrations.autoSubs.enabled` (channel theme admin). Admin panel is stripped from CyTube channel settings (same as `audioEnhancer`) — config must be set via `BTFW_CONFIG` / `body[data-btfw-auto-subs-enabled]`.

Requires `util:tmdb-proxy` (movies-storage worker with `TMDB_API_KEY`).

### Bundle / boot wiring

| Location | Present? |
|----------|----------|
| `scripts/build.js` → `player` bundle | Yes |
| `billtube-fw.js` `BTFW.init("feature:auto-subs")` | Yes |
| Dependency | `util:tmdb-proxy` |

### Why remove

- Hit-or-miss: title parsing, movie-only TMDB search, weak TV (`SxxExx`) support
- Two external services (TMDB proxy + Wyzie) with no SLA
- ~650 lines + blob-track watcher complexity for occasional success
- Overlaps conceptually with `feature-local-subs.js` (user-picked subs in Theme settings) for viewers who want subtitles
- Unreachable admin toggle adds config surface without UX

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-auto-subs.js` | Delete |
| `scripts/build.js` player bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:auto-subs")` |
| `modules/feature-channel-theme-admin.js` | Remove `integrations.autoSubs` toggle, config sync, help text |

`util:tmdb-proxy` stays — still used by movie-info, movie-suggestions, etc.

### Recommendation

Remove from player bundle and delete file. Subtitle needs covered by existing local-subs user flow.

---

## `feature-billcast.js` + `feature-billcaster.js`

**Decision:** REMOVE

**Status:** Chromecast sender for direct-file video; jQuery + Google Cast SDK; user toggle in Theme settings.

### Purpose

Two-file Chromecast integration:

| File | Role |
|------|------|
| `feature-billcast.js` (`feature:billcast`) | Loader/gate: reads `localStorage` `btfw:billcast:enabled` (default on), lazy-loads billcaster on direct media (`fi`/`gd`), listens to `btfw:themeSettings:apply` and `changeMedia` |
| `feature-billcaster.js` | jQuery Chromecast sender: loads `gstatic.com` Cast SDK, injects `#btfw-vo-cast` / `#btfw-vo-cast-fallback` into overlay bar, syncs playback to Cast receiver |

Casts direct video URL to default media receiver. Chrome-only for real casting; fallback button shows alert in other browsers.

### Front-end UI

User-facing toggle in Theme modal → **Playback tools** panel (`feature-theme-settings.js`):

| Element | Location |
|---------|----------|
| `#btfw-billcast-toggle` | `#btfw-theme-modal` → General tab → “Playback tools” card |
| Label | “Enable Billcast (Chromecast sender)” |
| Storage key | `btfw:billcast:enabled` via `TS_KEYS.billcastEnabled` |
| Apply event | `btfw:themeSettings:apply` with `detail.values.billcastEnabled` |

Runtime cast buttons (when enabled + direct media): `#btfw-vo-cast`, `#btfw-vo-cast-fallback` in `#btfw-vo-bar`.

Note: `feature-billcast.js` `disable()` removes `#castButton` / `#fallbackButton` — stale IDs; billcaster uses `btfw-vo-cast*` instead.

### Bundle / boot wiring

| Location | Present? |
|----------|----------|
| `scripts/build.js` → `features` bundle | Both files |
| `billtube-fw.js` `BTFW.init("feature:billcast")` | Yes |
| Runtime load | `feature-billcast` also dynamically injects `feature-billcaster.js` via `<script>` (redundant with bundle) |

External dependency: `https://www.gstatic.com/cv/js/sender/v1/cast_sender.js` (Google Cast framework).

### Why remove

- Niche feature (Chromecast + direct file + Chrome)
- jQuery + legacy overlay DOM construction; overlaps with `feature-video-overlay.js` bar
- Dual delivery (bundled + dynamic script load)
- Stale disable logic (wrong button IDs)
- Maintenance cost vs usage

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-billcast.js` | Delete |
| `modules/feature-billcaster.js` | Delete |
| `scripts/build.js` features bundle | Remove both entries |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:billcast")` |
| `modules/feature-theme-settings.js` | Remove `#btfw-billcast-toggle` checkbox and “Playback tools” billcast label; remove `TS_KEYS.billcastEnabled`, apply/sync logic, `billcastEnabled` from `btfw:themeSettings:apply` payload |

Optional cleanup: remove empty “Playback tools” card if only billcast lived there (local subs checkbox remains).

### Recommendation

Delete both modules and strip Theme settings UI. Viewers lose Chromecast sender; native browser/device cast unaffected.

---

## `feature-bulma-layer.js` (`feature:bulma-layer` / `feature:bulma`)

**Decision:** REFACTOR + RENAME

**Status:** Active core module; dark/light/auto API exists but has no UI; misleading name.

### Purpose (today)

Applies **UI chrome theme mode** (dark vs light) for legacy CyTube surfaces:

- Sets `html[data-btfw-theme="dark"|"light"]` and class `btfw-theme-dark`
- Injects Bulma + Bootstrap modal override CSS using `--btfw-color-*` tokens
- Persists preference in `localStorage` (`btfw:theme:mode`; legacy `btfw:bulma:theme`)
- Supports `dark`, `light`, `auto` (`prefers-color-scheme` via `matchMedia` watcher)

Separate from Theme settings **appearance** system (`util-theme-runtime` tints/colors/fonts).

### Problem

| Issue | Detail |
|-------|--------|
| No UI | `setTheme()` / `getTheme()` exported but never called; defaults to `"dark"` on boot |
| Misleading name | “bulma-layer” describes an implementation detail, not user-facing behavior |
| CSS duplication | Overlapping `html[data-btfw-theme="dark"]` rules in `css/overlays.css` |
| Stale aliases | `feature:bulma` → `feature:bulma-layer`; layout depends on `feature:bulma` |

### Rename proposal

| Current | Proposed |
|---------|----------|
| `modules/feature-bulma-layer.js` | `modules/feature-theme-mode.js` |
| `feature:bulma-layer` | `feature:themeMode` |
| `feature:bulma` (alias) | `feature:themeMode` (update `feature:layout` dep directly) |
| `#btfw-bulma-dark-bridge` (style id) | `#btfw-theme-mode-bridge` |

Keep `localStorage` key `btfw:theme:mode` for backward compatibility.

Register legacy aliases (`feature:bulma-layer`, `feature:bulma`) temporarily if needed for cached bundles.

### Theme settings UI (wire-up)

Add control in `#btfw-theme-modal` → **General** tab, new card or inside “Your appearance”:

| Option | Value | Behavior |
|--------|-------|----------|
| Dark | `dark` | Always `data-btfw-theme="dark"`, inject bridge CSS |
| Light | `light` | `data-btfw-theme="light"`, clear bridge CSS |
| Auto | `auto` | Follow `prefers-color-scheme`; re-apply on OS theme change |

Suggested UI: segmented control or radio group (`#btfw-theme-mode-dark`, `#btfw-theme-mode-light`, `#btfw-theme-mode-auto`).

**Integration in `feature-theme-settings.js`:**

1. On modal open: `BTFW.init("feature:themeMode")` → `getTheme()` → sync control state
2. On Apply (or immediate change): `setTheme(selectedMode)`
3. Optional: add `TS_KEYS.themeMode = "btfw:theme:mode"` for read on sync (module already owns the key)

`auto` must call existing `wireAutoWatcher()` path — already implemented in module.

### Refactor scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-bulma-layer.js` | Rename → `feature-theme-mode.js`; update `BTFW.define` id, style element id, comments |
| `scripts/build.js` core bundle | Update path |
| `billtube-fw.js` / `src/billtube-fw.js` | `BTFW.init("feature:themeMode")` |
| `modules/feature-layout.js` | Dependency `feature:bulma` → `feature:themeMode` |
| `modules/feature-theme-settings.js` | Add Dark / Light / Auto selector; wire `setTheme` / `getTheme` |
| `css/overlays.css` | Optional: dedupe Bulma dark rules already in module inject |

### Work items (checklist)

- [ ] Rename file and module id to `feature:themeMode`
- [ ] Update bundle, boot, layout dependency; add short-lived legacy aliases
- [ ] Add Theme settings UI (Dark / Light / Auto)
- [ ] Wire apply/sync to `setTheme()` / `getTheme()`
- [ ] Verify `auto` tracks OS `prefers-color-scheme` changes live
- [ ] Audit `overlays.css` vs injected CSS for duplication
- [ ] Smoke test: Bulma modals, Bootstrap CyTube modals, Theme modal itself in each mode

### Recommendation

Keep and refactor — required for dark CyTube/Bulma chrome. Rename to `feature-theme-mode`, expose the existing API in Theme settings General tab.

---

## `feature-channel-theme-admin.js` (`feature:channelThemeAdmin`)

**Decision:** REFACTOR — resurface admin UI, strip orphaned panels, gate by channel permissions

**Status:** ~2241 lines; runtime sync active; CyTube settings UI deliberately removed and `initPanel()` never wired.

### Purpose (today)

Two responsibilities in one module:

| Layer | Active? | Role |
|-------|---------|------|
| **Runtime sync** | Yes | Reads `window.BTFW_THEME_ADMIN` from channel custom JS → applies branding, resources, integration flags (`BTFW_CONFIG`), dispatches `btfw:channelIntegrationsChanged` |
| **Channel admin UI** | No | Would inject “Channel Theme Toolkit” tab into CyTube channel settings; writes config back into Channel JS/CSS via `==BTFW_THEME_ADMIN_START==` markers |

Boot calls `removeChannelThemeTab()` on every channel settings modal open (`2193:2233`). `initPanel()` exists (`2018`) but is never invoked.

Permission helper `canManageChannel()` (`1094:1112`) checks `chanowner` / `motdedit` / `seehidden` or rank ≥ admin.

### Architecture shift (why cleanup is needed)

**Per-user theming** now lives in `feature-theme-settings.js` (`#btfw-theme-modal`): tint, colors, typography, saved presets, localStorage-only.

Channel admin still had duplicate **Palette & Tint**, **Typography**, and live preview sections — orphaned now that no single admin theme controls all viewers.

**Channel default appearance** remains in `BTFW_THEME_ADMIN` JSON for `revertToChannelAppearance()` (“Reset to channel default” in user Theme settings). That can stay in channel JS without an admin color picker.

### Admin UI sections — keep vs remove

| Section (`data-section`) | Verdict | Reason |
|--------------------------|---------|--------|
| `integrations` | **Keep** (trimmed) | Channel-wide API keys and feature flags |
| `resources` | **Keep** | Extra CSS/JS/module URLs for all visitors |
| `branding` | **Keep** | Header name, favicon, poster — channel-wide |
| `palette` | **Remove from UI** | Per-user Theme settings owns appearance |
| `typography` | **Remove from UI** | Per-user Theme settings owns fonts |
| Preview chips / font sample | **Remove** | Tied to removed palette/typography editors |

**Remove integration toggles** (aligned with other cleanup decisions):

| Control | Reason |
|---------|--------|
| Auto subtitles (Wyzie) | `feature-auto-subs` marked REMOVE |
| Audio enhancer | Merging into always-on `feature-audio-boost`; gate removed |

**Keep integration controls:**

| Control | Config path |
|---------|-------------|
| Movie info overlay toggle | `integrations.movieInfo.enabled` |

**Remove with ratings module:**

| Control | Reason |
|---------|--------|
| Ratings API endpoint | `feature-ratings` marked REMOVE |

**Remove TMDB API key UI** (secret now in Cloudflare worker):

| Control | Reason |
|---------|--------|
| TMDB API key field + callout | Key lives in movies-storage worker `TMDB_API_KEY`; client must not store or edit it |
| Movie-info “requires TMDB key” warnings | `feature-movie-info` + `!summary` use `util:tmdb-proxy`; gate on `tmdb.isAvailable()` (worker deployed), not channel key |

### Resurface plan (channel admins only)

1. **Stop removing the tab** — replace `ensureModalPanel()` / `boot()` behavior:
   - If `!canManageChannel()` → hide/remove tab (or no-op)
   - If `canManageChannel()` → `ensureTab(modal)` + `initPanel(modal)` on `show.bs.modal` / `shown.bs.modal`

2. **Delete or invert `removeChannelThemeTab()`** — only run when user lacks permission, not for all users.

3. **Gate visibility** — non-admins never see `#btfw-theme-admin-panel` or tab link; no synthetic hidden textareas for guests.

4. **Update panel copy** — lead text should describe channel integrations/branding/resources, not “theme palette for all visitors.”

### Config schema cleanup

| Field | UI | Runtime |
|-------|-----|---------|
| `colors`, `tint`, `typography` | Remove admin editors | Keep in JSON for channel default + `buildCssBlock()` until migrated; optional future: static defaults only |
| `integrations.tmdb` / `apiKey` | **Remove** field, normalize, and help copy | **Remove** from `BTFW_THEME_ADMIN` output; `applyRuntimeIntegrations` already strips client-side key — rely on worker only |
| `integrations.autoSubs` | Remove UI + sync | Remove from `applyRuntimeIntegrations` when module deleted |
| `integrations.audioEnhancer` | Remove UI + sync | Remove when boost merge completes |
| `integrations.movieInfo` | Keep toggle | Keep |
| `branding`, `resources` | Keep | Keep |

`syncRuntimeThemeConfig()` should stop pushing removed integration flags to `BTFW_CONFIG` / `body.dataset` as those modules are deleted.

### Refactor scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-channel-theme-admin.js` | Resurface tab; wire `initPanel`; trim `renderPanel` HTML; remove dead sync helpers (`syncAutoSubsToggle`, `syncAudioEnhancerToggle`, palette/typography watchers); shrink `DEFAULT_CONFIG` |
| `channel_config_settings.js` | Update template/docs for slimmer `BTFW_THEME_ADMIN` shape |
| `modules/feature-theme-settings.js` | No admin overlap; “Reset to channel default” continues using `BTFW_THEME_ADMIN` appearance fields |

### Work items (checklist)

- [ ] Replace `removeChannelThemeTab` boot logic with permission-gated `initPanel`
- [ ] Remove Palette & Tint and Typography sections from `renderPanel`
- [ ] Remove TMDB API key field, callout, and `syncMovieInfoToggle` key checks
- [ ] Remove `integrations.tmdb` from `DEFAULT_CONFIG`, `normalizeConfig`, and channel JS output
- [ ] Remove auto-subs and audio-enhancer fields + sync functions
- [ ] Prune `applyRuntimeIntegrations` for removed modules
- [ ] Update panel title/lead and Integrations section copy
- [ ] Verify Apply still writes JS/CSS blocks to channel fields for admins
- [ ] Verify non-admin users do not see tab or panel
- [ ] Smoke test: movie-info toggle (worker TMDB, no client key), branding apply, resources injection

### Recommendation

Keep module — runtime sync is required. Refactor admin UI into a **channel operations panel** (integrations, branding, resources), resurface it for channel admins only, and drop appearance controls that duplicated per-user Theme settings. TMDB auth is worker-side only.

---

## `feature-pip.js` (`feature:pip`)

**Decision:** REMOVE (candidate)

**Status:** ~50 lines; booted; **off by default**; no settings UI; not browser PiP.

### Purpose (actual behavior)

**Not** the browser Picture-in-Picture API. This is a **scroll dock**:

1. `IntersectionObserver` watches `#videowrap`
2. When &lt;10% visible (scrolled mostly off-screen) → move `#videowrap` into `#btfw-pip-dock` above chat column
3. When visible again → restore original DOM parent
4. Adds class `btfw-pip` for dock styling (`css/overlays.css`)

Preference: `localStorage` `btfw:pip === "1"` or `window.BTFW_setPiP()`. Default **off** (`pref()` false when unset).

### vs native PiP

| | `feature-pip.js` | Browser / video.js PiP |
|--|------------------|------------------------|
| Mechanism | Reparent `#videowrap` in page DOM | `video.requestPictureInPicture()` floating window |
| UI | None (`BTFW_setPiP` only) | video.js PiP control (`player.css`) |
| Default | Off | Browser/player native |

`overlays.css` comment: “When PiP is enabled in future” — never finished.

### Consumers

None. No Theme settings toggle; nothing calls `BTFW_setPiP`.

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-pip.js` | Delete |
| `scripts/build.js` player bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:pip")` |
| `css/overlays.css` | Remove `#btfw-pip-dock` / `.btfw-pip` rules (optional) |

### Recommendation

Remove — redundant with native PiP on the video element; inactive by default; no user-facing control; scroll-dock behavior is fragile with layout refactors.

---

## `feature-ratings.js` (`feature:ratings`)

**Decision:** REMOVE

**Status:** ~1478 lines; opt-in via `integrations.ratings.endpoint`; unused by channel owner.

### Purpose

Community 1–5 star movie ratings in the chat topbar (`#btfw-ratings`), shown only in the last 15 minutes of features ≥1 hour, backed by a ratings Worker (`POST /rate`, `GET /stats`) plus a leaderboard modal with TMDB posters.

### Why remove

- Feature not used; requires separate ratings Worker deployment
- Large module (~1478 lines) for inactive functionality
- Channel admin ratings endpoint field becomes unnecessary

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-ratings.js` | Delete |
| `scripts/build.js` features bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:ratings")` |
| `modules/feature-channel-theme-admin.js` | Remove ratings endpoint field + `applyRuntimeIntegrations` ratings sync (update refactor plan) |

### Recommendation

Delete module and strip ratings integration from channel admin refactor.

---

## `feature-video-enhancements.js` (`feature:videoEnhancements`)

**Decision:** REMOVE — delete module after confirming chat title scroll works without it

### Purpose (today)

Catch-all “video UX” tweaks bundled in one module:

| Behavior | Notes |
|----------|--------|
| `updateTitleLength()` | Sets `--length` on `#currenttitle` / `.current-title` from text length |
| VJS fullscreen removal | DOM remove + injected CSS hiding `.vjs-fullscreen-control` |
| Quality button hide | Hides `.vjs-resolution-button` when menu has ≤1 item |
| Media URL space encoding | Wraps `window.queue`, binds `#queue_end` / `#queue_next` / Enter on `#mediaurl` |
| Dropbox URL rewrite | `www.dropbox.com` → `dl.dropbox.com` on paste/input |
| Auto-title from filename | Fills `#addfromurl-title-val` / `#mediaurl-title` when empty |

Only `changeMedia` + boot call `updateTitleLength()`; everything else runs on queue UI events or timers.

### What we actually need

Chat-panel title scroll on hover when the label is wider than the panel — so long custom media titles remain readable.

**Already implemented elsewhere (not in this module):**

| Piece | Location |
|-------|----------|
| Overflow detection (`is-overflowing`, `--scroll-distance`, `--scroll-duration`) | `feature-nowplaying.js` → `measureTitleOverflow` / `scheduleOverflowMeasure` |
| Pure helper (unit-tested) | `lib/nowplaying-overflow.js` |
| Hover scroll animation | `css/chat.css` → `@keyframes btfw-nowplaying-scroll` on `#btfw-nowplaying-slot > .btfw-nowplaying.is-overflowing:hover .btfw-nowplaying__text` |
| `changeMedia` / resize remeasure | `feature-nowplaying.js` (socket + `Callbacks.changeMedia` + `ResizeObserver` on slot) |

`feature-video-enhancements` only sets `--length`, which **no CSS consumes**; scroll uses `--scroll-distance` from nowplaying. The enhancements module is redundant for title scroll.

Fullscreen is owned by `feature-video-overlay.js`; quality UI is native video.js — do not port hide logic.

### `feature-video-overlay.js` — expected changes

**No new scroll CSS or overflow logic in overlay** unless manual QA finds a gap.

Rationale: `#currenttitle` lives in the chat topbar (`#btfw-nowplaying-slot`); `feature-nowplaying.js` mounts, updates, and remeasures it. Colocating scroll in overlay would duplicate owners.

Optional hardening (only if QA fails on custom titles):

- Export `scheduleOverflowMeasure` (or `remeasureTitleOverflow`) from `feature-nowplaying` return object
- `feature-video-overlay.js`: on `changeMedia`, delegate to that API for `#currenttitle`

Do **not** move `chat.css` rules into overlay.

### Drop (do not port)

- URL space encoding + `queue` wrap
- Dropbox rewrite
- Auto-title extraction from filename
- VJS fullscreen button removal / injected hide CSS
- VJS resolution button hide
- `--length` CSS variable updates

Custom titles: users set `#mediaurl-title` (etc.) at queue time; `changeMedia` → nowplaying `setTitle` → `scheduleOverflowMeasure`.

### Bundle / boot wiring

| File | Entry |
|------|--------|
| `scripts/build.js` | `features` bundle → `modules/feature-video-enhancements.js` |
| `billtube-fw.js` / `src/billtube-fw.js` | `BTFW.init("feature:videoEnhancements")` |

### Removal scope

| Target | Action |
|--------|--------|
| `modules/feature-video-enhancements.js` | Delete |
| `scripts/build.js` | Remove from features bundle |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:videoEnhancements")` |
| `css/chat.css` | Keep scroll rules (no change) |
| `modules/feature-nowplaying.js` | Keep; optionally export remeasure helper |
| `modules/feature-video-overlay.js` | No change unless QA gap |

### Work items (checklist)

- [ ] QA: queue direct media with a long custom title; confirm hover scroll in chat panel
- [ ] QA: resize chat panel; confirm `ResizeObserver` remeasures
- [ ] Delete `feature-video-enhancements.js`; update bundle + boot
- [ ] (Optional) Export remeasure from nowplaying; one-line delegate in overlay if gap found

### Recommendation

Delete module. Title scroll is already handled by `feature-nowplaying.js` + `css/chat.css`. Do not duplicate into `feature-video-overlay.js` unless QA proves a missed code path.

---

<!-- Next module: -->
