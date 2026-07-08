## Objective

Remove `feature-auto-subs.js` from the player bundle and delete the file.

**Decision:** REMOVE

**Status:** Opt-in channel integration; heavy external dependencies; unreliable title matching.

## Details

Automatically fetches English subtitles for direct-file video by resolving `#currenttitle` → TMDB → IMDb → Wyzie SRT → WebVTT blob → `videojs.addRemoteTextTrack()`. No viewer UI.

### Why remove

- Hit-or-miss title parsing and movie-only TMDB search
- Two external services (TMDB proxy + Wyzie) with no SLA
- ~650 lines for occasional success
- Overlaps `feature-local-subs.js` (user-picked subs in Theme settings)
- Unreachable admin toggle adds config surface without UX

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-auto-subs.js` | Delete |
| `scripts/build.js` player bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:auto-subs")` |
| `modules/feature-channel-theme-admin.js` | Remove `integrations.autoSubs` toggle, config sync, help text |

`util:tmdb-proxy` stays — used by movie-info, movie-suggestions, etc.

## Checklist

- [ ] Delete `modules/feature-auto-subs.js`
- [ ] Remove from `scripts/build.js` player bundle
- [ ] Remove `BTFW.init("feature:auto-subs")` from boot files
- [ ] Remove auto-subs integration from channel theme admin
- [ ] Verify local-subs flow still works for viewers who want subtitles

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-auto-subs section).
