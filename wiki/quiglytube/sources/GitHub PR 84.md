---
type: source
title: "PR 84 — fix(chat): restore hover grow on inline GIFs and images"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - chat
  - layout
  - enhancement
source_type: github-pr
confidence: high
github_number: 84
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/84
head_branch: fix/chat-image-hover-grow-75
base_branch: main
closes_issues: [75]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
  - "[[modules/core.bundle]]"
  - "[[sources/GitHub Issue 75]]"
sources:
  - "[[.raw/pr-84-fix-chat-restore-hover-grow-on-inline-gifs-and-images.md]]"
key_claims:
  - "Inline `.chat-picture` GIFs/images (Giphy, Tenor, generic chat images) scale to 1.2x on hover with a short transition and shadow lift Channel emotes, Twemoji, and avatars are excluded `#messagebuffer` uses `contain: layout style` (not `paint`) so scaled previews are not clipped; message rows with chat pictures allow overflow `prefers-reduced-motion: reduce` disables the effect"
---

# PR 84 — fix(chat): restore hover grow on inline GIFs and images

| Field | Value |
|-------|-------|
| GitHub | [#84](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/84) |
| State | **MERGED** |
| Branch | `fix/chat-image-hover-grow-75` → `main` |
| Labels | enhancement |
| Closes | [#75](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/75) |

## Summary

Inline `.chat-picture` GIFs/images (Giphy, Tenor, generic chat images) scale to 1.2x on hover with a short transition and shadow lift Channel emotes, Twemoji, and avatars are excluded `#messagebuffer` uses `contain: layout style` (not `paint`) so scaled previews are not clipped; message rows with chat pictures allow overflow `prefers-reduced-motion: reduce` disables the effect

## Test plan

- [x] `npm test` (31/31)
- [ ] Hover a Giphy/Tenor GIF in chat — modest grow, smooth restore on mouse leave
- [ ] Channel emotes do not scale on hover
- [ ] With reduced motion enabled in OS, no scale animation

## Raw source

[[.raw/pr-84-fix-chat-restore-hover-grow-on-inline-gifs-and-images.md]]
