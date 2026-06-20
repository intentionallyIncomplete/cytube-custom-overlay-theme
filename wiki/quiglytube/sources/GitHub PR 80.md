---
type: source
title: "PR 80 — fix(layout): release chat/video splitter on pointer up"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - chat
  - player
  - layout
  - bug
source_type: github-pr
confidence: high
github_number: 80
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/80
head_branch: fix/splitter-pointer-release-72
base_branch: main
closes_issues: [72]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
  - "[[modules/core.bundle]]"
  - "[[sources/GitHub Issue 72]]"
sources:
  - "[[.raw/pr-80-fix-layout-release-chat-video-splitter-on-pointer-up.md]]"
key_claims:
  - "Replace mousemove/mouseup on document with Pointer Events + `setPointerCapture` on `#btfw-vsplit` Tear down drag on `pointerup`, `pointercancel`, `window.blur`, and `visibilitychange` One-time wire guard; stop resize when layout flips vertical mid-drag `body.btfw-resizing` sets `col-resize` cursor and disables text selection"
---

# PR 80 — fix(layout): release chat/video splitter on pointer up

| Field | Value |
|-------|-------|
| GitHub | [#80](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/80) |
| State | **MERGED** |
| Branch | `fix/splitter-pointer-release-72` → `main` |
| Labels | bug |
| Closes | [#72](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/72) |

## Summary

Replace mousemove/mouseup on document with Pointer Events + `setPointerCapture` on `#btfw-vsplit` Tear down drag on `pointerup`, `pointercancel`, `window.blur`, and `visibilitychange` One-time wire guard; stop resize when layout flips vertical mid-drag `body.btfw-resizing` sets `col-resize` cursor and disables text selection

## Test plan

- [x] `npm test` (31 pass)
- [x] `npm run build`
- [ ] Drag `#btfw-vsplit` and release — column stops tracking immediately
- [ ] Release pointer outside browser window — drag ends
- [ ] Resize still persists width to localStorage

## Raw source

[[.raw/pr-80-fix-layout-release-chat-video-splitter-on-pointer-up.md]]
