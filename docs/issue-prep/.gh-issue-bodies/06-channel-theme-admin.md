## Objective

Refactor `feature-channel-theme-admin.js`: resurface admin UI for channel admins only, strip orphaned appearance panels, remove dead integration toggles.

**Decision:** REFACTOR — resurface admin UI, strip orphaned panels, gate by channel permissions

## Details

~2241 lines with two layers: **runtime sync** (active — reads `BTFW_THEME_ADMIN`, applies branding/resources/integrations) and **channel admin UI** (inactive — `initPanel()` never wired; `removeChannelThemeTab()` runs on every settings modal open).

Per-user theming now lives in `feature-theme-settings.js`. Channel admin still had duplicate Palette, Typography, and preview sections.

### Admin UI — keep vs remove

| Section | Verdict |
|---------|---------|
| `integrations` (trimmed) | Keep |
| `resources` | Keep |
| `branding` | Keep |
| `palette`, `typography`, preview chips | Remove from UI |

**Remove integration toggles:** auto-subs (module REMOVE), audio enhancer (merged into boost), ratings endpoint (module REMOVE), TMDB API key UI (key in worker).

**Keep:** movie-info toggle, branding, resources.

### Resurface plan

1. Replace boot logic: if `canManageChannel()` → `initPanel()`; else hide tab
2. Invert `removeChannelThemeTab()` — only for non-admins
3. Non-admins never see panel
4. Update panel copy for channel operations, not global theme palette

### Config schema cleanup

Remove admin editors for `colors`, `tint`, `typography`, `integrations.tmdb`, `integrations.autoSubs`, `integrations.audioEnhancer`, ratings. Keep JSON fields for channel default appearance until migrated. `syncRuntimeThemeConfig()` stops pushing removed flags.

## Checklist

- [ ] Replace `removeChannelThemeTab` boot logic with permission-gated `initPanel`
- [ ] Remove Palette & Tint and Typography sections from `renderPanel`
- [ ] Remove TMDB API key field, callout, and key checks
- [ ] Remove `integrations.tmdb` from config output
- [ ] Remove auto-subs and audio-enhancer fields + sync functions
- [ ] Prune `applyRuntimeIntegrations` for removed modules
- [ ] Update panel title/lead and Integrations copy
- [ ] Verify Apply writes JS/CSS blocks for admins
- [ ] Verify non-admins do not see tab or panel
- [ ] Smoke test: movie-info toggle, branding apply, resources injection

## Dependencies

- Related cleanup issues: auto-subs REMOVE, audio enhancer MERGE, ratings REMOVE

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-channel-theme-admin section).

TMDB auth is worker-side only.
