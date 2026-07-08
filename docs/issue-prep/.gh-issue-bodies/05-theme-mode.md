## Objective

Rename `feature-bulma-layer.js` to `feature-theme-mode.js` and wire Dark / Light / Auto controls into Theme settings.

**Decision:** REFACTOR + RENAME

## Details

Applies UI chrome theme mode (dark vs light) for legacy CyTube surfaces: sets `html[data-btfw-theme]`, injects Bulma/Bootstrap modal override CSS, persists `localStorage` `btfw:theme:mode`. Separate from Theme settings appearance (tints/colors/fonts).

### Problems

- `setTheme()` / `getTheme()` exported but never called; defaults to `"dark"`
- Name "bulma-layer" describes implementation, not behavior
- Overlapping dark rules in `css/overlays.css`
- Stale `feature:bulma` alias

### Rename proposal

| Current | Proposed |
|---------|----------|
| `modules/feature-bulma-layer.js` | `modules/feature-theme-mode.js` |
| `feature:bulma-layer` / `feature:bulma` | `feature:themeMode` |
| `#btfw-bulma-dark-bridge` | `#btfw-theme-mode-bridge` |

Keep `localStorage` key `btfw:theme:mode`. Register legacy aliases temporarily for cached bundles.

### Theme settings UI

Add control in `#btfw-theme-modal` → General tab:

| Option | Value |
|--------|-------|
| Dark | `dark` |
| Light | `light` |
| Auto | `auto` (follows `prefers-color-scheme`) |

Wire `feature-theme-settings.js`: on open sync via `getTheme()`, on Apply call `setTheme()`.

### Refactor scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-bulma-layer.js` | Rename → `feature-theme-mode.js` |
| `scripts/build.js` core bundle | Update path |
| `billtube-fw.js` / `src/billtube-fw.js` | `BTFW.init("feature:themeMode")` |
| `modules/feature-layout.js` | Dep `feature:bulma` → `feature:themeMode` |
| `modules/feature-theme-settings.js` | Add Dark / Light / Auto selector |
| `css/overlays.css` | Optional dedupe vs injected CSS |

## Checklist

- [ ] Rename file and module id to `feature:themeMode`
- [ ] Update bundle, boot, layout dependency; add short-lived legacy aliases
- [ ] Add Theme settings UI (Dark / Light / Auto)
- [ ] Wire apply/sync to `setTheme()` / `getTheme()`
- [ ] Verify `auto` tracks OS `prefers-color-scheme` live
- [ ] Audit `overlays.css` vs injected CSS for duplication
- [ ] Smoke test: Bulma modals, Bootstrap CyTube modals, Theme modal in each mode

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-bulma-layer section).
