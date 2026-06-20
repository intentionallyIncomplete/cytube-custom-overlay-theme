---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 79
state: MERGED
title: "fix(playlist): encode spaces in media URLs before queueing"
labels: "bug"
base: main
head: fix/media-url-preserve-spaces
created: 2026-06-17T07:50:25Z
updated: 2026-06-17T07:51:21Z
merged: 2026-06-17T07:51:21Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/79
closes: "77"
---

# GitHub PR #79: fix(playlist): encode spaces in media URLs before queueing

- **State:** MERGED
- **Branch:** `fix/media-url-preserve-spaces` → `main`
- **Labels:** bug
- **Merged:** 2026-06-17T07:51:21Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/79
- **Closes:** #77

---

## Summary
- Auto-encode literal spaces as `%20` in `#mediaurl` on paste/input and immediately before CyTube `queue()` runs
- Self-hosted file URLs with spaces in the path queue without manual `%20` substitution
- Add `1.4.4` user release notes for the connected-user tooltip fix (PR #78)

Fixes #77
Part of epic #69

## Test plan
- [x] `npm test` (31 pass, including `media-url` helpers)
- [x] `npm run build`
- [ ] Paste `https://example.com/movies/My Movie.mp4` into Add from URL — field shows `%20`, video queues
- [ ] URLs that already use `%20` still work
- [ ] Options → Recent Updates shows 1.4.4 connected-user tooltip bullets
