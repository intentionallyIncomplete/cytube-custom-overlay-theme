---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 83
state: MERGED
title: "fix(emotes): focus search input when opening picker"
labels: "enhancement"
base: main
head: fix/emote-search-focus-76
created: 2026-06-18T05:28:32Z
updated: 2026-06-18T05:29:38Z
merged: 2026-06-18T05:29:37Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/83
closes: "76"
---

# GitHub PR #83: fix(emotes): focus search input when opening picker

- **State:** MERGED
- **Branch:** `fix/emote-search-focus-76` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T05:29:37Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/83
- **Closes:** #76

---

## Summary
- Opening the emote picker now focuses `#btfw-emotes-search` so users can type to filter immediately
- Tab switches and clear-search still call `focusGrid()` for arrow-key tile navigation
- Search field gets an `aria-label`; Escape in search closes the picker

Fixes #76

## Test plan
- [x] `npm test` (31/31)
- [ ] Click emote button → cursor in search box, ready to type
- [ ] Tab from search → grid receives focus; arrow keys navigate tiles
- [ ] Clear search → focus returns to grid
- [ ] Escape closes picker without focus trap issues
