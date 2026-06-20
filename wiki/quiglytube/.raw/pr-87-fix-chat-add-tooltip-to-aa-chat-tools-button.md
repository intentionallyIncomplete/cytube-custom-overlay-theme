---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 87
state: MERGED
title: "fix(chat): add tooltip to Aa chat-tools button"
labels: "enhancement"
base: main
head: fix/chattools-button-tooltip-74
created: 2026-06-18T06:48:39Z
updated: 2026-06-18T06:50:18Z
merged: 2026-06-18T06:50:18Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/87
closes: "74"
---

# GitHub PR #87: fix(chat): add tooltip to Aa chat-tools button

- **State:** MERGED
- **Branch:** `fix/chattools-button-tooltip-74` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T06:50:18Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/87
- **Closes:** #74

---

## Summary
- Add `title` and `aria-label` ("Chat tools") to `#btfw-chattools-btn` in `ensureActionsButton()`
- Backfill tooltip on existing/legacy `#btfw-ct-open` button during `wire()` if missing

Closes #74

## Test plan
- [x] `npm test` (35/35)
- [x] `npm run build`
- [ ] Hover **Aa** button below chat input → "Chat tools" tooltip appears
- [ ] Tooltip copy matches modal header and peer buttons (Emotes, GIFs, Commands)

