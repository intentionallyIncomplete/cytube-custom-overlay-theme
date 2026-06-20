---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 80
state: MERGED
title: "fix(layout): release chat/video splitter on pointer up"
labels: "bug"
base: main
head: fix/splitter-pointer-release-72
created: 2026-06-17T07:56:49Z
updated: 2026-06-17T07:57:36Z
merged: 2026-06-17T07:57:36Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/80
closes: "72"
---

# GitHub PR #80: fix(layout): release chat/video splitter on pointer up

- **State:** MERGED
- **Branch:** `fix/splitter-pointer-release-72` → `main`
- **Labels:** bug
- **Merged:** 2026-06-17T07:57:36Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/80
- **Closes:** #72

---

## Summary
- Replace mousemove/mouseup on document with Pointer Events + `setPointerCapture` on `#btfw-vsplit`
- Tear down drag on `pointerup`, `pointercancel`, `window.blur`, and `visibilitychange`
- One-time wire guard; stop resize when layout flips vertical mid-drag
- `body.btfw-resizing` sets `col-resize` cursor and disables text selection

Fixes #72
Part of epic #69

## Test plan
- [x] `npm test` (31 pass)
- [x] `npm run build`
- [ ] Drag `#btfw-vsplit` and release — column stops tracking immediately
- [ ] Release pointer outside browser window — drag ends
- [ ] Resize still persists width to localStorage
