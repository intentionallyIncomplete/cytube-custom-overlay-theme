---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 82
state: MERGED
title: "fix(player): usable volume slider and control bar spacing"
labels: "enhancement"
base: main
head: fix/player-volume-slider-wider
created: 2026-06-18T04:51:33Z
updated: 2026-06-18T05:25:31Z
merged: 2026-06-18T05:25:31Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/82
closes: "73"
---

# GitHub PR #82: fix(player): usable volume slider and control bar spacing

- **State:** MERGED
- **Branch:** `fix/player-volume-slider-wider` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T05:25:31Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/82
- **Closes:** #73

---

## Summary
- City theme volume was a 3em triangle wedge; BillTube now replaces it with a horizontal slider (mute + inline track + thumb) via CSS and `volumePanel.inline(true)`
- Targets `vjs-theme-city` (runtime theme), not only unused `.btfw-videojs-themed` selectors
- Final spacing: narrower track, volume panel inset from the left, remaining-time separated from the slider

Fixes #73

## Test plan
- [x] `npm test` (31/31)
- [ ] Queue raw file or custom media (`fi`/`cm`); confirm horizontal volume track is draggable at low volumes
- [ ] Confirm remaining time is visually separate from the volume slider
- [ ] Resize to <=720px; control bar still usable without overlap
