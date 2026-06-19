---
type: meta
title: "Wiki Log"
status: evergreen
created: 2026-06-08
updated: 2026-06-19
tags:
  - meta
---

# Wiki Log

Newest entries first. Do not edit past entries.

## 2026-06-19 — File PR #91 and issue #90 (!time playback position)

- **Operation:** SAVE (review-and-ship + obsidian-wiki)
- **Raw:** `.raw/pr-91-feat-chat-repurpose-time-to-post-video-playback-position.md`
- **Created:** [[sources/GitHub PR 91]], [[sources/GitHub Issue 90]]
- **Updated:** [[index]], [[hot]]
- **Status:** PR #91 OPEN; user verified `!time` on local stack

## 2026-06-18 — Ingest last 10 pull requests

- **Operation:** EXPORT + INGEST (GitHub PRs #79–#89)
- **Raw:** 10 files in `.raw/pr-*.md`
- **Created:** [[meta/pr-registry]], [[sources/GitHub PR 79]] … [[sources/GitHub PR 89]]
- **Updated:** [[index]], [[hot]]
- **Hook:** `.cursor/hooks/after-pr-create.mjs` auto-exports on future `gh pr create`

## 2026-06-08 — Ingest enhancement issues

- **Operation:** EXPORT + INGEST (GitHub label `enhancement`)
- **Raw:** 7 files in `.raw/` (#2, #22, #37, #39, #46, #50, #52)
- **Created:** [[meta/enhancement-registry]], [[sources/GitHub Issue 2]] … [[sources/GitHub Issue 52]]
- **Updated:** [[index]], [[hot]]

## 2026-06-08 — Bulk ingest `.raw/`

- **Operation:** INGEST (all `.raw/` sources)
- **Sources:** `.raw/BUILD.md` + 9 GitHub bug issues (`issue-4` … `issue-54`)
- **Created:** [[sources/GitHub Issue 4]] … [[sources/GitHub Issue 54]], [[meta/bug-registry]]
- **Updated:** [[sources/BUILD System]], [[questions/Issue 54 Playback Sync]], [[index]], [[hot]]
- **Removed:** duplicate `.raw/github-issues/` copies

## 2026-06-08 — Vault scaffold

- **Operation:** SCAFFOLD (Mode B — GitHub / Repository)
- **Trigger:** Initial wiki foundation from repo `BUILD.md`
- **Created:** [[overview]], [[index]], [[hot]], domain indexes, bundle module pages, release/boot flows, BUILD source summary
- **Ingested:** `.raw/BUILD.md` (copy of repo root `BUILD.md`)
