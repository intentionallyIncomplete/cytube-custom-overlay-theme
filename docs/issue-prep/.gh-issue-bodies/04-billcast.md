## Objective

Remove Chromecast sender modules (`feature-billcast.js`, `feature-billcaster.js`) and strip Theme settings UI.

**Decision:** REMOVE

## Details

Two-file Chromecast integration for direct-file video (`fi`/`gd`): loader/gate + jQuery sender loading Google Cast SDK, injecting `#btfw-vo-cast` buttons into overlay bar.

### Why remove

- Niche feature (Chromecast + direct file + Chrome)
- jQuery + legacy overlay DOM; overlaps `feature-video-overlay.js`
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
| `modules/feature-theme-settings.js` | Remove `#btfw-billcast-toggle`, `TS_KEYS.billcastEnabled`, apply/sync logic, `billcastEnabled` from `btfw:themeSettings:apply` payload |

Optional: remove empty "Playback tools" card if only billcast lived there (local subs checkbox remains).

## Checklist

- [ ] Delete `feature-billcast.js` and `feature-billcaster.js`
- [ ] Remove both from features bundle and boot init
- [ ] Remove billcast toggle from Theme settings modal
- [ ] Clean up `TS_KEYS` and apply event payload
- [ ] Verify overlay bar renders without cast buttons

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-billcast section).

Viewers lose Chromecast sender; native browser/device cast unaffected.
