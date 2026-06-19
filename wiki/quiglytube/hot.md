---
type: meta
title: "Hot Cache"
updated: 2026-06-19T06:00:00
tags:
  - meta
---

# Recent Context

## Last Updated

2026-06-19. Shipped [[sources/GitHub PR 91]] — `!time` now posts video playback position (closes #90). User verified on local CyTube.

## Key Recent Facts

- **Open PR:** [[sources/GitHub PR 91]] — `!time` uses `feature:syncGuard` `getPlayerTime()`, formats `[M:SS]` / `[H:MM:SS]`
- **Prior merge:** [[sources/GitHub PR 89]] removed trivia + trivia leaderboard from `feature:chat-commands`
- **Open bug:** still only #54 — [[sources/GitHub Issue 54]]
- Chat commands live in `modules/feature-chat-commands.js` → `dist/chat.bundle.js`

## Recent Changes

- Created: [[sources/GitHub PR 91]], [[sources/GitHub Issue 90]]
- Updated: [[index]], [[log]]

## Active Threads

- PR #91 awaiting merge — manual test passed, CI pending
- Playback sync fix (#54) — separate from `!time` work
