---
type: source
title: "PR 83 — fix(emotes): focus search input when opening picker"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - chat
  - enhancement
source_type: github-pr
confidence: high
github_number: 83
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/83
head_branch: fix/emote-search-focus-76
base_branch: main
closes_issues: [76]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
  - "[[sources/GitHub Issue 76]]"
sources:
  - "[[.raw/pr-83-fix-emotes-focus-search-input-when-opening-picker.md]]"
key_claims:
  - "Opening the emote picker now focuses `#btfw-emotes-search` so users can type to filter immediately Tab switches and clear-search still call `focusGrid()` for arrow-key tile navigation Search field gets an `aria-label`; Escape in search closes the picker Fixes #76"
---

# PR 83 — fix(emotes): focus search input when opening picker

| Field | Value |
|-------|-------|
| GitHub | [#83](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/83) |
| State | **MERGED** |
| Branch | `fix/emote-search-focus-76` → `main` |
| Labels | enhancement |
| Closes | [#76](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/76) |

## Summary

Opening the emote picker now focuses `#btfw-emotes-search` so users can type to filter immediately Tab switches and clear-search still call `focusGrid()` for arrow-key tile navigation Search field gets an `aria-label`; Escape in search closes the picker Fixes #76

## Test plan

- [x] `npm test` (31/31)
- [ ] Click emote button → cursor in search box, ready to type
- [ ] Tab from search → grid receives focus; arrow keys navigate tiles
- [ ] Clear search → focus returns to grid
- [ ] Escape closes picker without focus trap issues

## Raw source

[[.raw/pr-83-fix-emotes-focus-search-input-when-opening-picker.md]]
