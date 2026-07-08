## Objective

Remove `feature-ratings.js` from features bundle and delete the file.

**Decision:** REMOVE

## Details

Community 1–5 star movie ratings in chat topbar (`#btfw-ratings`), shown in last 15 minutes of features ≥1 hour, backed by ratings Worker + leaderboard modal with TMDB posters.

### Why remove

- Feature not used; requires separate ratings Worker deployment
- ~1478 lines for inactive functionality
- Channel admin ratings endpoint field unnecessary

### Removal scope

| File / location | Change |
|-----------------|--------|
| `modules/feature-ratings.js` | Delete |
| `scripts/build.js` features bundle | Remove entry |
| `billtube-fw.js` / `src/billtube-fw.js` | Remove `BTFW.init("feature:ratings")` |
| `modules/feature-channel-theme-admin.js` | Remove ratings endpoint field + sync |

## Checklist

- [ ] Delete `modules/feature-ratings.js`
- [ ] Remove from features bundle and boot init
- [ ] Remove ratings integration from channel theme admin refactor
- [ ] Verify chat topbar layout without ratings slot

## Notes

Source audit: `docs/issue-prep/modules-cleanup.md` (feature-ratings section).

Related: channel theme admin refactor issue.
