## Overview

Improve security posture by eliminating raw HTML injection points, centralizing HTML escaping, and optionally enforcing Subresource Integrity on pinned assets.

## Recommended Approach: Staged Refactoring with Risk Prioritization

**Strategy:** Centralize escaping first, then systematically replace `innerHTML` with safer patterns in phases based on risk level.

### Why this approach?
- ✅ Lowest disruption; can land incrementally
- ✅ Allows prioritizing XSS-critical paths first
- ✅ Keeps MOTD HTML storage working during transition
- ✅ Reviewable in small PRs per module or phase

---

## Phase 1: Create shared utility & audit high-risk sinks

- [ ] Extract canonical `escapeHtml()` to `src/lib/escape-html.ts` (move/deduplicate from existing implementations)
- [ ] Create `sanitizeHtml()` wrapper for content that must allow limited HTML (MOTD, custom notices)
- [ ] Audit and document each `innerHTML` site with risk classification
- [ ] Create tracking spreadsheet/doc with all 120+ `innerHTML` usages by file and risk level

---

## Phase 2: Fix critical vulnerabilities

**Target:** MOTD editor, movie suggestions, notify custom notices, template literals

- [ ] MOTD editor: require explicit `sanitizeHtml()` call on input before storage
  - File: `src/modules/feature-motd-editor.js` (lines 165, 208)
  - Related: `src/modules/feature-stack.js` (line 1649)

- [ ] Movie suggestions: wrap all `movie.title`, `movie.poster` in `escapeHtml()`
  - File: `src/modules/feature-movie-suggestions.js` (lines 549–626)

- [ ] Notify custom notice: validate/reject untrusted `o.html` or pass through `sanitizeHtml()`
  - File: `src/modules/feature-notify.js` (lines 143, 169)

- [ ] Template literals in `src/lib/templates/`: inject escaping inline or use `textContent` alternative
  - File: `src/lib/templates/stack.js` — `stackGroupHeaderHtml(title)` (line 18–20)

---

## Phase 3: Systematic replacement (low to medium risk)

**Target:** ~29 files with remaining `innerHTML` usages

- [ ] Replace `innerHTML` with `textContent` + `createElement()` where HTML isn't needed
  - Audit: `src/modules/feature-chat.js`, `feature-navbar.js`, `feature-theme-settings.js`, etc.

- [ ] Template utilities in `src/lib/templates/` can use tagged template function for auto-escaping
  - Helper function in `escape-html.ts` for safe template literals

- [ ] Add linter rule to warn on new `innerHTML` usage
  - ESLint rule or custom rule to catch future violations

---

## Phase 4: Asset hardening

**Target:** CDN assets, dist bundles, third-party dependencies

- [ ] Generate SRI hashes for all `dist/*` CSS/JS and pinned CDN assets
  - `dist/css/*.css`, `dist/*.bundle.js`
  - jsDelivr gh pins in `billtube-fw.ts`
  - Third-party CDNs (bootswatch, bulma, Font Awesome, twemoji, etc.)

- [ ] Update `preload()` and `load()` helpers in `billtube-fw.ts` to inject `integrity` attribute
  - Files: `src/billtube-fw.ts` (lines 196–271)
  - Update loader functions: `preload()`, `load()`

- [ ] Optionally add `crossorigin="anonymous"` for SRI validation (already used for theme CSS)
  - Already present in `util-theme-runtime.js` (lines 212, 218, 237)

---

## High-Risk Sinks Identified

From codebase analysis:
- **MOTD editor textarea** (`feature-motd-editor.js:165, 208`) — Unescaped user-controlled HTML
- **Movie suggestions API** (`feature-movie-suggestions.js:549+`) — Unescaped API results
- **Notify custom notice** (`feature-notify.js:143, 169`) — Passthrough without validation
- **Stack template header** (`templates/stack.js:18–20`) — Unescaped `title` parameter

---

## Current State

- ~120+ `innerHTML` usages across 29 files
- 7 duplicated `escapeHtml()` implementations (no shared utility)
- 0 SRI implementation (assets load without integrity hashes)
- No `insertAdjacentHTML` or `outerHTML` usage found

---

## Progress Tracking

**Overall Completion:** [ Phase 1 ] [ Phase 2 ] [ Phase 3 ] [ Phase 4 ]

Track specific PRs/commits:
- Phase 1 PR: 
- Phase 2a PR (critical sinks): 
- Phase 2b PR (templates): 
- Phase 3 PR (systematic replacement): 
- Phase 4 PR (SRI assets): 

---

## Motivation

Raw HTML sinks are a common XSS vector. Centralizing escaping ensures consistent sanitization and reduces the risk of missed call sites. SRI on pinned CDN/dist assets prevents supply-chain tampering.
