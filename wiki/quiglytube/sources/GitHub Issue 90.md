---
type: source
title: "Issue 90 — Change !time to report video playback position"
status: developing
created: 2026-06-19
updated: 2026-06-19
tags:
  - github-issue
  - chat
  - enhancement
source_type: github-issue
confidence: high
github_number: 90
github_state: OPEN
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/issues/90
related:
  - "[[sources/GitHub PR 91]]"
  - "[[modules/chat.bundle]]"
key_claims:
  - "Repurpose !time from wall-clock to playback timestamp"
---

# Issue 90 — Change !time to report video playback position

| Field | Value |
|-------|-------|
| GitHub | [#90](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/90) |
| State | **OPEN** (implementation in [[sources/GitHub PR 91]]) |
| Type | Feature |

## Summary

Feature request to change `!time` from local `[HH:MM]` wall-clock to current video playback position using `PLAYER.getTime` / syncGuard.
