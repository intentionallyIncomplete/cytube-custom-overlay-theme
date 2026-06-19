---
type: source
title: "PR 91 — feat(chat): repurpose !time to post video playback position"
status: developing
created: 2026-06-19
updated: 2026-06-19
tags:
  - github-pr
  - chat
  - player
  - enhancement
source_type: github-pr
confidence: high
github_number: 91
github_state: OPEN
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/91
head_branch: feat/chat-time-playback-position
base_branch: main
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
  - "[[sources/GitHub Issue 90]]"
sources:
  - "[[.raw/pr-91-feat-chat-repurpose-time-to-post-video-playback-position.md]]"
key_claims:
  - "!time posts video playback position via syncGuard getPlayerTime instead of wall-clock time"
  - "Closes issue #90"
---

# PR 91 — feat(chat): repurpose !time to post video playback position

| Field | Value |
|-------|-------|
| GitHub | [#91](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/91) |
| State | **OPEN** |
| Branch | `feat/chat-time-playback-position` → `main` |
| Closes | #90 |

## Summary

`!time` in `feature:chat-commands` now reads `BTFW.init("feature:syncGuard").getPlayerTime()` and posts `[M:SS]` or `[H:MM:SS]` to chat. No player → local `sysLocal` only.

## Raw source

[[.raw/pr-91-feat-chat-repurpose-time-to-post-video-playback-position.md]]
