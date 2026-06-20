---
type: source
title: "PR 79 — fix(playlist): encode spaces in media URLs before queueing"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - player
  - playlist
  - bug
source_type: github-pr
confidence: high
github_number: 79
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/79
head_branch: fix/media-url-preserve-spaces
base_branch: main
closes_issues: [77]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/playlist.bundle]]"
  - "[[sources/GitHub Issue 77]]"
sources:
  - "[[.raw/pr-79-fix-playlist-encode-spaces-in-media-urls-before-queueing.md]]"
key_claims:
  - "Auto-encode literal spaces as `%20` in `#mediaurl` on paste/input and immediately before CyTube `queue()` runs Self-hosted file URLs with spaces in the path queue without manual `%20` substitution Add `1.4.4` user release notes for the connected-user tooltip fix (PR #78) Fixes #77"
---

# PR 79 — fix(playlist): encode spaces in media URLs before queueing

| Field | Value |
|-------|-------|
| GitHub | [#79](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/79) |
| State | **MERGED** |
| Branch | `fix/media-url-preserve-spaces` → `main` |
| Labels | bug |
| Closes | [#77](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/77) |

## Summary

Auto-encode literal spaces as `%20` in `#mediaurl` on paste/input and immediately before CyTube `queue()` runs Self-hosted file URLs with spaces in the path queue without manual `%20` substitution Add `1.4.4` user release notes for the connected-user tooltip fix (PR #78) Fixes #77

## Test plan

- [x] `npm test` (31 pass, including `media-url` helpers)
- [x] `npm run build`
- [ ] Paste `https://example.com/movies/My Movie.mp4` into Add from URL — field shows `%20`, video queues
- [ ] URLs that already use `%20` still work
- [ ] Options → Recent Updates shows 1.4.4 connected-user tooltip bullets

## Raw source

[[.raw/pr-79-fix-playlist-encode-spaces-in-media-urls-before-queueing.md]]
