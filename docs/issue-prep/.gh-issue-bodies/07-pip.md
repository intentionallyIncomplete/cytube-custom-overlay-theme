## Objective

Remove `feature-pip.js` scroll-dock module from player bundle and delete the file.

**Decision:** REMOVE

## Details

**Not** browser Picture-in-Picture API. This is a scroll dock: `IntersectionObserver` on `#videowrap` reparents video into `#btfw-pip-dock` when scrolled off-screen.

- Default **off** (`localStorage` `btfw:pip === "1"` or `BTFW_setPiP()` only)
- No Theme settings toggle; nothing calls `BTFW_setPiP`
- Redundant with native video.js PiP control

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-pip.js` | Delete |
| `scripts/build.js` player bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:pip")` |
| `css/overlays.css` | Remove `#btfw-pip-dock` / `.btfw-pip` rules (optional) |

## Checklist

- [ ] Delete `modules/feature-pip.js`
- [ ] Remove from player bundle and boot init
- [ ] Optionally remove pip dock CSS from `overlays.css`
- [ ] Verify layout unaffected

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-pip section).
