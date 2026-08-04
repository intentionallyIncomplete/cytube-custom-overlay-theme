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

## Phase 1: Create shared utility & audit high-risk sinks ✅ COMPLETE

- [x] Extract canonical `escapeHtml()` to `src/lib/escape-html.ts` (move/deduplicate from existing implementations)
- [x] Create `sanitizeHtml()` wrapper for content that must allow limited HTML (MOTD, custom notices)
- [x] Audit and document each `innerHTML` site with risk classification
- [x] Create tracking spreadsheet/doc with all 120+ `innerHTML` usages by file and risk level

See [`INNERHTML-AUDIT.md`](./INNERHTML-AUDIT.md) for the full 109-site audit table and
`src/lib/escape-html.ts` + `tests/unit/escape-html.vitest.ts` for the shared utility and its tests.
All 7 duplicated `escapeHtml()` implementations were replaced with imports from the shared module:
`feature-navbar.js`, `feature-notify.js`, `feature-playlist-tools.js`, `feature-theme-settings.js`,
`util-imdb-card.js`, `util-letterboxd.js`, `util-tmdb-card.js`.

---

## Phase 2: Fix critical vulnerabilities ✅ COMPLETE

**Target:** MOTD editor, movie suggestions, notify custom notices, template literals

- [x] MOTD editor: require explicit `sanitizeHtml()`/`escapeHtml()` call on input before storage
  - File: `src/modules/feature-motd-editor.js` (lines 165, 208 → `escapeHtml()`; line 247 → `sanitizeHtml()`)
  - Related: `src/modules/feature-stack.js` (lines 386, 388, 1649 → `sanitizeHtml()`)

- [x] Movie suggestions: wrap all `movie.title`, `movie.posterPath`/`posterSrc()`, `item.username` in `escapeHtml()`
  - File: `src/modules/feature-movie-suggestions.js` (lines 549–564, 626–638)

- [x] Notify custom notice: pass `o.html`/`o.icon` through `sanitizeHtml()` inside `feature-notify.js` (covers all callers automatically)
  - File: `src/modules/feature-notify.js` (lines 145, 171)

- [x] Template literals in `src/lib/templates/`: inject escaping inline (local `escapeHtml()` — see
  note below on why it's not imported from the shared module)
  - File: `src/lib/templates/stack.js` — `stackGroupHeaderHtml(title)` (line 18–20)

- [x] Theme icon pack escaping (found during HIGH-table remediation)
  - Files: `src/modules/feature-theme-icons.js` (lines 29, 43 → scoped `sanitizeHtml()`),
    `src/modules/util-theme-icon-packs.js` (`buildThemedIconHtml()` now escapes all 4
    attribute-sensitive characters, was quote-only)

- [x] Monkey Paw SVG integrity guard (found during HIGH-table remediation)
  - File: `src/modules/feature-monkey-paw.js` — confirmed `svgMarkup` is a first-party static asset
    (no user input in the fetch URL); added `isSafeSvgMarkup()` rejecting `<script>`/
    `<foreignObject>`/event-handlers/`javascript:`/`data:` hrefs before trusting the fetched body

**Note:** `templates/stack.js` and `util-theme-icon-packs.js` use small local `escapeHtml()`
implementations instead of importing the shared `src/lib/escape-html.ts` utility, because both are
loaded outside a normal bundler-resolved ESM context in their unit tests (`templates.test.js` uses a
plain Node ESM `import` that can't resolve `.js` → `.ts`; `theme-icon-packs.test.js` uses
`eval(readFileSync(...))`, which can't contain an `import` statement at all).

---

## Phase 3: Systematic replacement (low to medium risk)

**Target:** ~29 files with remaining `innerHTML` usages

- [x] Remediate/re-audit the 5 MEDIUM-table sites from `INNERHTML-AUDIT.md`
  - `feature-notify.js` / `feature-poll-overlay.js` (`ENTITY_DECODER`) — confirmed genuinely safe
    (a detached `<textarea>` never parses nested markup into elements) and documented why
  - `feature-stack.js` (`isMotdHtmlEmpty`, line 87) and `feature-notification-sounds.js`
    (`plainText()`, line 326) — **corrected finding:** their `<div>`-based DOM probes were *not*
    actually safe despite being "detached" — `<img src=x onerror=...>` still fires on elements
    created via `document.createElement()` even when never attached to the visible document,
    because "detached from the DOM" ≠ "inert document". Replaced both with regex-only tag-strip +
    entity decode (never touches an HTML parser); added
    `tests/unit/notification-sounds-plaintext.test.js` and an `<img onerror>` regression case to
    `tests/unit/motd-stack.test.js`
  - `feature-chat-filters.js` (lines 188, 198) — re-audited now that Phase 2 card-template
    escaping fixes have landed; no code change needed, residual risk is CyTube core's own
    `sanitize-html` boundary (out of scope for this theme), documented inline
  - See [`INNERHTML-AUDIT.md`](./INNERHTML-AUDIT.md) MEDIUM table for full details

- [x] Replace `innerHTML` with `textContent` + `createElement()` where HTML isn't needed (LOW table)
  - Full conversion of all ~64 LOW-table sites across 18 files: `feature-navbar.js`,
    `feature-chat-tools.js`, `feature-chat-commands.js`, `feature-chat.js`, `feature-emotes.js`,
    `feature-gifs.js`, `feature-drink-counter.js`, `feature-playlist-performance.js`,
    `feature-playlist-tools.js`, `feature-video-overlay.js`, `feature-audio.js`,
    `feature-local-subs.js`, `feature-channel-theme-admin.js`, `feature-movie-info.js`,
    `feature-theme-settings.js`, `feature-motd-editor.js`, `billtube-fw.ts`, `confirm-dialog.ts`
  - Complex static markup (theme-settings modal, channel-theme-admin panel, drink-counter SVG scene)
    parsed once via an inert `<template>` element + `cloneNode(true)` rather than rewritten as
    hundreds of individual `createElement()` calls, to reduce regression risk while still avoiding
    direct `innerHTML` assignment
  - Removed now-unused template-string helpers: `channelThemeTabAnchorHtml()`
    (`templates/channel-theme-admin.js`); replaced `bootOverlayCardHtml()` with an
    element-returning `buildBootOverlayCard()` (`templates/boot-overlay.js`)
  - Removed the `util:templates` dependency from `feature-chat.js` (was only used for static HTML
    fragments, now built inline with `createElement`)
  - **Bonus find:** an un-audited duplicate of the `isMotdHtmlEmpty()` DOM-probe vulnerability
    (same issue fixed in `feature-stack.js` during the MEDIUM pass) was discovered in
    `feature-motd-editor.js` and fixed the same way
  - Verified with `npm run lint`, `npm run typecheck`, `npm test` (123/123 passing), `npm run build`
  - See [`INNERHTML-AUDIT.md`](./INNERHTML-AUDIT.md) LOW table for full per-file details

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
- ✅ **MOTD editor textarea** (`feature-motd-editor.js:165, 208`) — Unescaped user-controlled HTML — fixed
- ✅ **Movie suggestions API** (`feature-movie-suggestions.js:549+`) — Unescaped API results — fixed
- ✅ **Notify custom notice** (`feature-notify.js:143, 169`) — Passthrough without validation — fixed
- ✅ **Stack template header** (`templates/stack.js:18–20`) — Unescaped `title` parameter — fixed
- ✅ **Theme icon packs** (`feature-theme-icons.js:29, 43`, `util-theme-icon-packs.js`) — fixed
- ✅ **Monkey Paw SVG** (`feature-monkey-paw.js:253`) — provenance confirmed + integrity guard added

---

## Current State

- ~120+ `innerHTML` usages across 29 files
- 7 duplicated `escapeHtml()` implementations (no shared utility)
- 0 SRI implementation (assets load without integrity hashes)
- No `insertAdjacentHTML` or `outerHTML` usage found

---

## Progress Tracking

**Overall Completion:** [x Phase 1 ] [x Phase 2 ] [~ Phase 3 (MEDIUM + LOW tables done, tagged-template/linter-rule follow-ups pending) ] [ Phase 4 ]

Track specific PRs/commits:
- Phase 1 PR: implemented (see `src/lib/escape-html.ts`, `.github/INNERHTML-AUDIT.md`)
- Phase 2a PR (critical sinks): implemented on `issue-201-html-escaping-templates` (`feature-motd-editor.js`, `feature-stack.js`, `feature-movie-suggestions.js`, `feature-notify.js`)
- Phase 2b PR (HIGH sinks — templates, theme icons, monkey paw): implemented on `issue-201-html-escaping-templates` (`templates/stack.js`, `feature-theme-icons.js`, `util-theme-icon-packs.js`, `feature-monkey-paw.js`, `feature-theme-settings.js`)
- Phase 3a PR (MEDIUM table): implemented on `issue-201-html-escaping-templates` (`feature-stack.js`, `feature-notification-sounds.js`, `feature-notify.js`, `feature-poll-overlay.js`, `feature-chat-filters.js`)
- Phase 3b PR (LOW-table full conversion): implemented on `issue-201-html-escaping-templates` (18 files — see LOW table above); linter-rule/tagged-template follow-ups (Tasks 3.2–3.3) still open
- Phase 4 PR (SRI assets): 

---

## Motivation

Raw HTML sinks are a common XSS vector. Centralizing escaping ensures consistent sanitization and reduces the risk of missed call sites. SRI on pinned CDN/dist assets prevents supply-chain tampering.
