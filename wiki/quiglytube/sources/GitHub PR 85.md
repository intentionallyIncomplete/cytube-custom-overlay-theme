---
type: source
title: "PR 85 — fix(chat): Giphy filters, full-size GIFs, 90% chat width cap"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - chat
  - refactor
  - enhancement
source_type: github-pr
confidence: high
github_number: 85
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/85
head_branch: fix/giphy-chat-filter-classic
base_branch: main
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
sources:
  - "[[.raw/pr-85-fix-chat-giphy-filters-full-size-gifs-90-chat-width-cap.md]]"
key_claims:
  - "Repair classic Giphy chat filters: split broken multi-capture regex into single-capture filters (giphy v1, classic, i.giphy, page, tenor variants) Embed full-resolution Giphy URLs (`giphy_s.gif` / `giphy.gif`) instead of 200px renditions Decouple chat GIF sizing from emote size setting; cap GIF width at 75% of chat column so 1.2× hover grow stays within 90%"
---

# PR 85 — fix(chat): Giphy filters, full-size GIFs, 90% chat width cap

| Field | Value |
|-------|-------|
| GitHub | [#85](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/85) |
| State | **MERGED** |
| Branch | `fix/giphy-chat-filter-classic` → `main` |
| Labels | enhancement |

## Summary

Repair classic Giphy chat filters: split broken multi-capture regex into single-capture filters (giphy v1, classic, i.giphy, page, tenor variants) Embed full-resolution Giphy URLs (`giphy_s.gif` / `giphy.gif`) instead of 200px renditions Decouple chat GIF sizing from emote size setting; cap GIF width at 75% of chat column so 1.2× hover grow stays within 90%

## Test plan

- [x] `npm test` (35/35)
- [x] `npm run verify-dist`
- [ ] Post `https://media1.giphy.com/media/sRzRspcNEmgdtbQmnJ/giphy.gif` → inline GIF renders at readable size
- [ ] Post v1 Giphy URL → still renders
- [ ] GIF does not overflow chat column; hover grow stays within bounds

## Raw source

[[.raw/pr-85-fix-chat-giphy-filters-full-size-gifs-90-chat-width-cap.md]]
