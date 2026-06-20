---
type: source
title: "PR 87 — fix(chat): add tooltip to Aa chat-tools button"
status: mature
created: 2026-06-18
updated: 2026-06-18
tags:
  - github-pr
  - chat
  - enhancement
source_type: github-pr
confidence: high
github_number: 87
github_state: MERGED
github_url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/87
head_branch: fix/chattools-button-tooltip-74
base_branch: main
closes_issues: [74]
related:
  - "[[overview]]"
  - "[[meta/pr-registry]]"
  - "[[modules/chat.bundle]]"
  - "[[sources/GitHub Issue 74]]"
sources:
  - "[[.raw/pr-87-fix-chat-add-tooltip-to-aa-chat-tools-button.md]]"
key_claims:
  - "Add `title` and `aria-label` (\"Chat tools\") to `#btfw-chattools-btn` in `ensureActionsButton()` Backfill tooltip on existing/legacy `#btfw-ct-open` button during `wire()` if missing Closes #74"
---

# PR 87 — fix(chat): add tooltip to Aa chat-tools button

| Field | Value |
|-------|-------|
| GitHub | [#87](https://github.com/intentionallyIncomplete/BillTube3-slim/pull/87) |
| State | **MERGED** |
| Branch | `fix/chattools-button-tooltip-74` → `main` |
| Labels | enhancement |
| Closes | [#74](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/74) |

## Summary

Add `title` and `aria-label` ("Chat tools") to `#btfw-chattools-btn` in `ensureActionsButton()` Backfill tooltip on existing/legacy `#btfw-ct-open` button during `wire()` if missing Closes #74

## Test plan

- [x] `npm test` (35/35)
- [x] `npm run build`
- [ ] Hover **Aa** button below chat input → "Chat tools" tooltip appears
- [ ] Tooltip copy matches modal header and peer buttons (Emotes, GIFs, Commands)

## Raw source

[[.raw/pr-87-fix-chat-add-tooltip-to-aa-chat-tools-button.md]]
