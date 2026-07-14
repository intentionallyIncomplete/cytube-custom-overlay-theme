---
name: updating-user-release-notes
description: Updates user-release-notes.json with polished, user-facing release bullets by analyzing branch commits, staged diffs, and any provided tickets or changelogs. Use when updating release notes, user changelog, Recent Updates copy, transforming internal changelogs for viewers, or preparing notes before a release.
---

# Updating User Release Notes

End-user release notes for BillTube3-slim (Options → User Preferences → General → **Recent Updates**). Distinct from `CHANGELOG.md` (semantic-release, maintainer-facing).

**Audience:** CyTube channel viewers and mods — friendly, plain language; no framework jargon.

**Primary output:** `src/config/user-release-notes.json`. On request, also emit a markdown summary (see [reference.md](reference.md)#markdown-export).

## Workflow

```
- [ ] 1. Gather raw material (git + any user-provided files)
- [ ] 2. Extract what / who / why per change
- [ ] 3. Categorize and draft user-facing entries
- [ ] 4. Merge into user-release-notes.json
- [ ] 5. Confirm JSON; note downstream wiring if needed
```

### 1. Gather raw material

**Always (repo root):**

```bash
git rev-parse --abbrev-ref HEAD
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master
git log --oneline main..HEAD 2>/dev/null || git log --oneline master..HEAD
git log main..HEAD --format="%h %s%n%b" 2>/dev/null || git log master..HEAD --format="%h %s%n%b"
git status
git diff --staged
git diff
git diff main...HEAD --stat 2>/dev/null || git diff master...HEAD --stat
```

Use `main` if it exists; else `master`. No unique branch commits → weight staged/working tree and provided files more heavily.

**Also read when supplied or mentioned:**

- Attached files (JIRA/Linear exports, PRDs, issue bodies)
- `CHANGELOG.md` or GitHub release text — **input only**, never copy verbatim
- Issue/PR links (`gh issue view`, `gh pr view`) for user-visible intent
- Product/channel context from `channel_config_settings.js` or user description

For large diffs, prioritize `modules/`, `css/`, and user-facing config; skim `dist/` only to confirm bundle impact.

### 2. Extract per change

For each commit, hunk, or ticket, answer internally:

| Question | Use for |
|----------|---------|
| **What changed?** (feature, improvement, fix, breaking, deprecation) | Category |
| **Who is affected?** (all viewers, mobile, mods, playlist users, etc.) | Wording |
| **Why does it matter?** (benefit, not implementation) | Opening line of each bullet |

Skip items with no viewer-visible effect (lint, CI, hook-only, `dist` regen-only). **Exception:** channel must re-paste Custom JS / new CDN pin → **Breaking / action required**.

### 3. Categorize and write

Assign each item to one bucket:

| Category | Use when |
|----------|----------|
| **New features** | New capability users didn’t have before |
| **Improvements** | Better experience on existing features |
| **Bug fixes** | Something broken is fixed |
| **Breaking changes** | User action required (CDN pin, settings reset, behavior change mods must know) |
| **Deprecations** | Feature removed or replaced; say what to use instead |

**Writing rules:**

- Lead with **user benefit**, not the technical change
- Plain language — no ticket numbers, commit hashes, file paths, internal codenames (`BTFW`, module filenames)
- **1–2 sentences per bullet** (max 3 only if breaking/action needs steps)
- Optional bold feature name in markdown export; in JSON use `Feature name: benefit sentence.`
- Group related commits into one bullet when they describe the same user outcome
- **Tone:** warm and direct (consumer/community), not enterprise B2B

**Transform before writing** — examples in [reference.md](reference.md#technical-to-user-facing).

**Version:** `package.json` `version`. New shipped version → prepend release; same version in progress → append to latest entry.

**Populate JSON:**

- `summary` — one sentence capturing the release theme (benefit-led)
- `categories` — when 2+ types exist or breaking/deprecations present (see reference)
- `highlights` — **always** fill: flat, scannable list (3–8 bullets) merging categories in order: features → improvements → fixes → breaking → deprecations

Omit empty category arrays. Do not duplicate the same fact in `summary` and every bullet.

### 4. Update `user-release-notes.json`

Schema: [reference.md](reference.md).

- **Prepend** new release when versioning up
- **Append** to latest when iterating same version
- Keep **≤ 5** releases; drop oldest
- Validate JSON after edit

### 5. Downstream

- Consumer: `modules/feature-theme-settings.js` → `decorateUserOptions()` (wire if not yet reading JSON)
- Module/CSS changes: `npm run build`; commit via [build-stage-commit](../build-stage-commit/SKILL.md) only if user asked

## Output to the user

1. Version + date touched  
2. Bullets grouped by category (same text as JSON)  
3. `summary` line  
4. Excluded internal-only work (one line)  
5. **Action required** callout if breaking (e.g. re-paste `channel_config_settings.js`)  

Optional: markdown release doc if requested.

Do not commit unless asked.

## Related files

| File | Role |
|------|------|
| `src/config/user-release-notes.json` | Canonical end-user notes |
| `CHANGELOG.md` | Maintainer input only |
| `package.json` | Version |
| `channel_config_settings.js` | CDN pin / channel snippet |
| `modules/feature-theme-settings.js` | User Preferences UI |
