---
type: source
title: "PR 82 — fix(player): usable volume slider and control bar spacing"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - player
  - playlist
  - enhancement
source_type: github-pr
confidence: high
github_number: 82
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/82
head_branch: fix/player-volume-slider-wider
base_branch: main
closes_issues: [73]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/player.bundle]]"
  - "[[sources/GitHub Issue 73]]"
sources:
  - "[[.raw/pr-82-fix-player-usable-volume-slider-and-control-bar-spacing.md]]"
key_claims:
  - "City theme volume was a 3em triangle wedge; BillTube now replaces it with a horizontal slider (mute + inline track + thumb) via CSS and `volumePanel.inline(true)` Targets `vjs-theme-city` (runtime theme), not only unused `.btfw-videojs-themed` selectors Final spacing: narrower track, volume panel inset from the left, remaining-time separated from the slider Fixes #73"
---

# PR 82 — fix(player): usable volume slider and control bar spacing

| Field | Value |
|-------|-------|
| GitHub | [#82](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/82) |
| State | **MERGED** |
| Branch | `fix/player-volume-slider-wider` → `main` |
| Labels | enhancement |
| Closes | [#73](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/73) |

## Summary

City theme volume was a 3em triangle wedge; BillTube now replaces it with a horizontal slider (mute + inline track + thumb) via CSS and `volumePanel.inline(true)` Targets `vjs-theme-city` (runtime theme), not only unused `.btfw-videojs-themed` selectors Final spacing: narrower track, volume panel inset from the left, remaining-time separated from the slider Fixes #73

## Test plan

- [x] `npm test` (31/31)
- [ ] Queue raw file or custom media (`fi`/`cm`); confirm horizontal volume track is draggable at low volumes
- [ ] Confirm remaining time is visually separate from the volume slider
- [ ] Resize to <=720px; control bar still usable without overlap

## Raw source

[[.raw/pr-82-fix-player-usable-volume-slider-and-control-bar-spacing.md]]
