## Objective

Remove `feature-video-enhancements.js` after confirming chat title scroll works without it.

**Decision:** REMOVE

## Details

Catch-all module with URL encoding, Dropbox rewrite, auto-title extraction, VJS fullscreen/quality hacks, and redundant `updateTitleLength()` (`--length` unused by CSS).

### What we actually need

Chat-panel title scroll on hover for long custom media titles — **already implemented** in:

| Piece | Location |
|-------|----------|
| Overflow detection | `feature-nowplaying.js` |
| Unit-tested helper | `lib/nowplaying-overflow.js` |
| Hover scroll animation | `css/chat.css` |
| changeMedia / resize remeasure | `feature-nowplaying.js` |

No changes expected in `feature-video-overlay.js` unless QA finds a gap.

### Drop (do not port)

- URL space encoding + `queue` wrap
- Dropbox rewrite
- Auto-title from filename
- VJS fullscreen / resolution button hiding
- `--length` CSS variable updates

### Removal scope

| Target | Action |
|--------|--------|
| `modules/feature-video-enhancements.js` | Delete |
| `scripts/build.js` features bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:videoEnhancements")` |
| `css/chat.css` | Keep scroll rules |
| `modules/feature-nowplaying.js` | Keep; optionally export remeasure helper |

## Checklist

- [ ] QA: queue direct media with long custom title; confirm hover scroll in chat panel
- [ ] QA: resize chat panel; confirm ResizeObserver remeasures
- [ ] Delete `feature-video-enhancements.js`; update bundle + boot
- [ ] (Optional) Export remeasure from nowplaying if QA gap found

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-video-enhancements section).
