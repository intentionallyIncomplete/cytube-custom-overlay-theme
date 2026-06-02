# Discovery — Minimal UI refresh (Issue #39)

**Date:** 2026-05-28  
**Issue:** https://github.com/intentionallyIncomplete/BillTube3-slim/issues/39  
**Branch:** `39-enhancement-minimal-ui-refresh-layout-default-footer-cleanup-and-reduced-visual-bulk`

---

## Task description

Reduce visual bulk and clutter: default layout video left / chat right, remove footer donate/disclaimer/credit chrome, squarer corners and more consistent spacing, lighter shadows — without full theme redesign or new features.

---

## Codebase entry points

| Area | Primary files | Notes |
|------|---------------|-------|
| Layout | `modules/feature-layout.js`, `css/base.css` L520–599 | `chatSidePref` default `"right"`; key `btfw:layout:chatSide`; shell `#btfw-grid` |
| Layout prefs UI | `modules/feature-theme-settings.js` | Apply writes `btfw:layout:chatSide`; dispatches `btfw:layout:chatSideChanged` |
| Footer | `modules/feature-footer.js`, `modules/feature-stack.js`, `css/base.css` L1083–1178 | `BRANDING_HTML` includes ko-fi; auth forms moved to `.btfw-footer__auth` |
| Design tokens | `css/tokens.css` | `--btfw-radius`, `--btfw-gap`, shadow tokens |
| Global chrome | `css/base.css`, `css/overlays.css`, `css/chat.css`, `css/navbar.css` | Many hardcoded radii bypass token |
| Dark bridge | `modules/feature-bulma-layer.js` | Injected Bulma dark styles |
| Loader | `channel_config_settings.js`, `billtube-fw.js` | CDN pin; `?dev=1` loads unbundled modules |
| Build | `npm run build` → `dist/*.bundle.js` | `feature-footer.js` in `features.bundle.js` |

---

## Dependency table

| Dependency | Version / mechanism | Relevance |
|------------|---------------------|-----------|
| CyTube DOM | Host page | `#videowrap`, `#chatwrap`, legacy `#footer` |
| Bulma | 0.9.4 via `feature-style-core.js` | Buttons, modals |
| Bootswatch Slate | CDN | Base Bootstrap |
| esbuild | package.json | Bundles |
| localStorage | Browser | `btfw:layout:chatSide`, `btfw:grid:leftPx`, `btfw:theme:mode` |

---

## Findings

1. **Layout default already correct in source** — `getStoredChatSide()` returns `"right"` when key missing; CSS `#btfw-grid` defaults to video \| chat.
2. **Live channel QA (2026-05-28)** — `cytu.be/r/quiglys_movie_repo` had `chatSide: "left"` in localStorage → chat-left layout; ko-fi present; `--btfw-radius: 12px`.
3. **Footer cleanup** — Single ko-fi reference in `feature-footer.js`; removing `BRANDING_HTML` / `insertBranding()` is the main code change.
4. **Token-first CSS** — Lower `--btfw-radius` and shadow tokens, then fix literals in `base.css`.
5. **Breakpoint mismatch** — `base.css` `@media (max-width: 1100px)` vs JS vertical threshold ~900–940px (informational; out of issue scope unless touched).

---

## Open questions (discovery)

- [ ] Hide `#btfw-stack-footer` entirely when only auth forms remain, or keep minimal auth bar?
- [ ] One-time migration for users with `chatSide: "left"`? (Issue says respect saved prefs — **no migration**.)
- [ ] Target `--btfw-radius` value (e.g. 4px vs 6px)?

---

## tldraw info-map

**Not created** — discovery was performed via parallel exploration in chat; no `{plan_name}-info-map` exists yet.

---

## Visual QA baseline

| Check | Baseline |
|-------|----------|
| Video left, chat right | Fail (saved pref `left`) |
| Ko-fi removed | Fail |
| Squarer UI | Not met (`12px`) |
