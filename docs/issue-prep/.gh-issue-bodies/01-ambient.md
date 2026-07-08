## Objective

Remove orphaned `feature-ambient.js` module from the player bundle and delete the file.

**Decision:** REMOVE

**Status:** Orphaned — bundled but not booted; UI integration removed.

## Details

Ambient glow mode for direct-file video playback (CyTube media types `fi` / `gd`). When enabled, clones the active `<video>` into a fixed-position background layer, applies blur/saturation filters, syncs playback, and semi-transparents UI panels.

### Why remove

- No `BTFW.init("feature:ambient")` anywhere
- No listeners for `btfw:ambient:state`
- Overlay toggle removed in commit `3f01875` (2025-10-29)
- ~485 lines dead code since Oct 2025

### Bundle / boot wiring

| Location | Present? |
|----------|----------|
| `scripts/build.js` → `player` bundle | Yes |
| `billtube-fw.js` module load / init | No (removed) |

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-ambient.js` | Delete |
| `scripts/build.js` player bundle | Remove entry |

## Checklist

- [ ] Remove `modules/feature-ambient.js` from `scripts/build.js` player bundle
- [ ] Delete `modules/feature-ambient.js`
- [ ] Verify build succeeds and player bundle size decreases

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-ambient section).

Previously wired through `feature-video-overlay.js` (`#btfw-ambient` button). Re-enable would require restoring overlay UI + boot init — not planned.
