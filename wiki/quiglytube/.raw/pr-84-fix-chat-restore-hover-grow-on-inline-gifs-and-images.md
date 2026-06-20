---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 84
state: MERGED
title: "fix(chat): restore hover grow on inline GIFs and images"
labels: "enhancement"
base: main
head: fix/chat-image-hover-grow-75
created: 2026-06-18T05:33:15Z
updated: 2026-06-18T05:37:26Z
merged: 2026-06-18T05:37:26Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/84
closes: "75"
---

# GitHub PR #84: fix(chat): restore hover grow on inline GIFs and images

- **State:** MERGED
- **Branch:** `fix/chat-image-hover-grow-75` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T05:37:26Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/84
- **Closes:** #75

---

## Summary
- Inline `.chat-picture` GIFs/images (Giphy, Tenor, generic chat images) scale to 1.2x on hover with a short transition and shadow lift
- Channel emotes, Twemoji, and avatars are excluded
- `#messagebuffer` uses `contain: layout style` (not `paint`) so scaled previews are not clipped; message rows with chat pictures allow overflow
- `prefers-reduced-motion: reduce` disables the effect

Fixes #75

## Test plan
- [x] `npm test` (31/31)
- [ ] Hover a Giphy/Tenor GIF in chat — modest grow, smooth restore on mouse leave
- [ ] Channel emotes do not scale on hover
- [ ] With reduced motion enabled in OS, no scale animation
