# Security Hardening Detailed Task Breakdown
## Issue #201: Remove raw HTML sinks and standardize escaping

---

## Phase 1: Create shared utility & audit high-risk sinks ✅ COMPLETE

### Task 1.1: Create `src/lib/escape-html.ts`
- [x] Create new file with canonical `escapeHtml()` function
- [x] Include `sanitizeHtml()` wrapper for limited HTML use cases
- [x] Add JSDoc comments with usage examples
- [x] Export both functions for use across modules
- **PR**: implemented on `main` (see `src/lib/escape-html.ts`)
- **Status**: Done — 18 passing unit tests in `tests/unit/escape-html.vitest.ts`

### Task 1.2: Audit all `innerHTML` usages
- [x] Document all 109 `.innerHTML =` assignment sites by file and exact line number
- [x] Classify each by risk level (Critical / High / Medium / Low / None)
- [x] Identify which files can use `textContent` + `createElement()` (deferred to Phase 3)
- [x] Identify which files need sanitization vs escaping
- [x] Create audit tracking doc — see [`INNERHTML-AUDIT.md`](./INNERHTML-AUDIT.md)
- **Actual counts (corrected from initial estimate)**:
  - 🔴 CRITICAL: 8 sites — MOTD editor, MOTD stack display, movie suggestions API results, notify custom HTML/icon passthrough
  - 🟠 HIGH: 5 sites — stack template header, theme icon packs (×2), monkey-paw overlay, theme-settings preset options
  - 🟡 MEDIUM: 5 sites — entity-decode probes (2 genuinely safe `<textarea>` tricks; 2 `<div>`-based
    probes that turned out *not* to be safe purely by being "detached" — see Task 3.0), chat-filters
    card rendering
  - 🟢 LOW: ~64 sites — static templates/constants or already escaped
  - ⚪ NONE: ~27 sites — clears or read-only comparisons
- **PR**: implemented on `main` (see `.github/INNERHTML-AUDIT.md`)
- **Status**: Done

### Task 1.3: Consolidate duplicated `escapeHtml()` implementations
- [x] Identify all 7 existing implementations (navbar, notify, playlist-tools, theme-settings, imdb-card, letterboxd, tmdb-card)
- [x] Verify they are functionally equivalent or document differences (notify's was missing `'` escaping — now covered by the shared 5-char superset)
- [x] Replace with centralized version via `import { escapeHtml } from "../lib/escape-html.js"`
- [x] Test each replacement in context (typecheck, lint, full `node --test` + `vitest` suites all pass)
- **PR**: implemented on `main`
- **Status**: Done — `feature-chat.js` does not actually define a local `escapeHtml()` (initial explorer report was inaccurate); no change needed there

---

## Phase 2: Fix critical vulnerabilities

### Task 2.1: MOTD Editor Security
- [x] Update `src/modules/feature-motd-editor.js` (lines 165, 208)
- [x] Require `sanitizeHtml()` call on input before storage (display path); use `escapeHtml()` for the raw-source `<textarea>` fallback paths
- [x] Test with Summernote fallback path (existing `node --test` + `vitest` suites pass; fallback paths reviewed by inspection)
- [x] Update related display code in `src/modules/feature-stack.js` (lines 386, 388, 1649)
- [ ] Add dedicated test case for malicious HTML input (deferred — no DOM test harness yet for these modules)
- **Risk Level**: CRITICAL
- **Complexity**: Medium
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done — sinks now sanitize/escape; dedicated regression test deferred

### Task 2.2: Movie Suggestions API Escaping
- [x] Update `src/modules/feature-movie-suggestions.js` (lines 549–564, 626–638)
- [x] Wrap all `movie.title` / `item.movieTitle` in `escapeHtml()`
- [x] Wrap `movie.posterPath` / `item.posterPath` (via `posterSrc()`) and `item.username` in `escapeHtml()` for the `src`/`alt`/attribute contexts
- [ ] Add dedicated test case for XSS injection attempts (deferred — no DOM test harness yet)
- **Risk Level**: CRITICAL
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

### Task 2.3: Notify Custom Notice Validation
- [x] Update `src/modules/feature-notify.js` (lines 145, 171)
- [x] Decided: sanitize (not reject) untrusted `o.html` and `o.icon` via the shared `sanitizeHtml()` allowlist, routed through `feature-notify.js` itself so all callers are covered automatically
- [x] Verified existing custom notice call sites (poll started, user joined, now playing) still render — their markup (`div`/`b`/`span`/`ul`/`li` + `class`) is within the default allowlist
- **Risk Level**: CRITICAL
- **Complexity**: Medium
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

### Task 2.4: Template Literal Escaping
- [x] Update `src/lib/templates/stack.js` — `stackGroupHeaderHtml(title)` (lines 18–20)
- [x] Escape `title` parameter before interpolation (local inline `escapeHtml()` — this file is
  loaded via plain Node ESM `import` in `tests/unit/templates.test.js`, which can't resolve the
  `.js` specifier to the shared `escape-html.ts` source the way esbuild's bundler resolution does)
- [ ] Apply same fix to other unescaped template literals in `src/lib/templates/` — none found;
  `templates/chat.js` and `templates/channel-theme-admin.js` take no dynamic parameters today
- [ ] Create helper function for safe template literals (optional: use tagged template syntax) — deferred
- [x] Test with special characters in titles (existing `stackGroupHeaderHtml` test still passes; all
  13 CRITICAL + HIGH sites verified via full `node --test` + `vitest` + `typecheck` + `lint` + `build`)
- **Risk Level**: HIGH
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

### Task 2.5: Theme Icon Pack Escaping (added — found during HIGH-table remediation)
- [x] `src/modules/feature-theme-icons.js` (lines 29, 43) — wrap `host.innerHTML` writes in a scoped
  `sanitizeHtml()` (custom allowlist preserving `aria-hidden`/`decoding` for `<i>`/`<img>` icon markup)
- [x] `src/modules/util-theme-icon-packs.js` — `buildThemedIconHtml()` now escapes all 4
  attribute-sensitive characters in `url` (was quote-only via ad-hoc `.replace()`); kept as a local
  inline escape since this file is loaded via `eval()` in `tests/unit/theme-icon-packs.test.js` and
  cannot contain an `import` statement
- **Risk Level**: HIGH
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

### Task 2.6: Monkey Paw SVG Integrity (added — found during HIGH-table remediation)
- [x] `src/modules/feature-monkey-paw.js` — confirmed `svgMarkup` provenance: fetched from our own
  static first-party asset path (`PAW_SVG_PATH`), no user input reaches the fetch URL
- [x] Added `isSafeSvgMarkup()` guard in `loadPawSvg()` as defense-in-depth against a compromised CDN
  mirror — rejects `<script>`/`<foreignObject>`/`<iframe>`/`<embed>`/`<object>`, event-handler
  attributes, and `javascript:`/`data:` in `href`/`xlink:href` before the fetched SVG is trusted
- [x] Full SRI hash verification for this asset — completed in Phase 4
- **Risk Level**: HIGH
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

---

## Phase 3: Systematic replacement (low to medium risk)

### Task 3.0: MEDIUM-table remediation/re-audit ✅ COMPLETE
- [x] `feature-notify.js` (line 11) / `feature-poll-overlay.js` (line 180) — `ENTITY_DECODER`
  scratch `<textarea>` confirmed genuinely safe (never parses nested markup into child elements,
  regardless of DOM attachment); documented why with inline comments to prevent future regressions
- [x] `feature-stack.js` (`isMotdHtmlEmpty`, line 87) — **corrected finding:** the original "safe
  because detached" reasoning didn't hold for a `<div>` — `<img src=x onerror=...>` still fires on
  elements created via `document.createElement()` even when never attached to the visible
  document. Removed the DOM probe branch, unconditionally use the existing regex-only fallback
  (extended with `&nbsp;`/`<br>` handling to match prior DOM-branch behavior)
- [x] `feature-notification-sounds.js` (`plainText()`, line 326) — same underlying issue, higher
  real-world severity since fed directly from raw chat message text (`handleChatMessage()` /
  `payload.msg`) rather than admin-authored MOTD. Replaced the `<div>` DOM probe with a
  regex tag-strip + entity decode that never touches an HTML parser
- [x] `feature-chat-filters.js` (lines 188, 198) — re-audited now that Phase 2 card-template
  escaping fixes (Task 2.2 equivalents) have landed; confirmed no unescaped interpolation of our
  own remains, residual risk is CyTube core's own `sanitize-html` boundary (out of scope);
  documented the conclusion inline, no code change needed
- [x] New tests: `tests/unit/notification-sounds-plaintext.test.js` (6 cases incl. an `<img
  onerror>` regression) and an added case in `tests/unit/motd-stack.test.js`
- **Risk Level**: MEDIUM
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done — full `node --test` + `vitest` + `typecheck` + `lint` + `build` all pass

### Task 3.1: Replace `innerHTML` with safer DOM methods ✅ COMPLETE
- [x] Analyzed each of the 18 files holding a LOW-table site
- [x] For each: converted to `textContent` + `createElement()`/`replaceChildren()`, or (for large
  static markup blocks) an inert `<template>` element + `cloneNode(true)` to avoid a live-document
  `innerHTML` write without doing a risky wholesale `createElement()` rewrite
- [x] Replaced all ~64 LOW-table `innerHTML` assignments
- [x] Used `textContent` for plain text, `appendChild()`/`append()`/`replaceChildren()` for elements
- [x] Verified with full `node --test` + `vitest` suites (123/123 passing), `npm run typecheck`,
  `npm run lint`, and `npm run build` after every file
- **Files converted**:
  - [x] `src/modules/feature-chat.js` (8 sites) — also removed the now-unused `util:templates`
    dependency and `chatTpl` variable entirely
  - [x] `src/modules/feature-navbar.js` (6 sites) — removed the now-unused `escapeHtml` import
  - [x] `src/modules/feature-theme-settings.js` (2 sites) — modal shell + `buildUserOptionsAboutHtml()`
    parsed via inert `<template>`
  - [x] `src/modules/feature-channel-theme-admin.js` (3 sites) — admin panel parsed via inert
    `<template>`; tab anchors via `createElement` (removed `channelThemeTabAnchorHtml()` export)
  - [x] `src/modules/feature-movie-info.js` (4 sites)
  - [x] `src/modules/feature-playlist-performance.js` (8 sites) — added `buildPerfIcon()` /
    `setPerfButtonLabel()` helpers; also fixed an unrelated `showMoreBtn` duplicate-declaration bug
    surfaced by the refactor
  - [x] `src/modules/feature-chat-tools.js`, `feature-chat-commands.js`, `feature-emotes.js`,
    `feature-gifs.js`, `feature-drink-counter.js`, `feature-playlist-tools.js`,
    `feature-video-overlay.js`, `feature-audio.js`, `feature-local-subs.js`,
    `feature-motd-editor.js`, `src/billtube-fw.ts`, `src/lib/confirm-dialog.ts`
  - [x] **Bonus find:** `feature-motd-editor.js` had an un-audited duplicate of the
    `isMotdHtmlEmpty()` DOM-probe issue fixed in `feature-stack.js` under Task 3.0 — fixed the same
    way (regex tag-strip + entity decode); `tests/unit/motd-stack.test.js` now covers both files
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done

### Task 3.2: Template utilities auto-escaping ✅ COMPLETE
- [x] Created `safeHtml()` tagged template function in `src/lib/escape-html.ts` — auto-escapes
  all interpolated values via `escapeHtml()` while passing static template segments verbatim
- [x] Added a local `safeHtml()` mirror to `src/lib/templates/stack.js` (same reason as the
  existing local `escapeHtml()`: the `.js` → `.ts` resolution doesn't work in the Node test runner)
- [x] Migrated `stackGroupHeaderHtml()` in `templates/stack.js` to use `safeHtml` instead of
  manual `escapeHtml()` wrapping — demonstrates the intended pattern for future template authors
- [x] No migration needed for `chat.js`, `channel-theme-admin.js`, or `boot-overlay.js` — they
  have zero dynamic interpolation (pure static HTML or `createElement()` construction)
- [x] Documented pattern with `@example` JSDoc in `escape-html.ts`
- [x] 6 unit tests in `tests/unit/escape-html.vitest.ts` covering auto-escape, static passthrough,
  null/undefined coercion, multiple interpolations, and attribute-context XSS
- [x] XSS regression case added to `tests/unit/templates.test.js` for `stackGroupHeaderHtml`
- [x] `escape-html.ts` added to `tsconfig.strict-tools.json` for strict-mode type checking
- **PR**: implemented on current branch
- **Status**: Done

### Task 3.3: Add linter rules ✅ COMPLETE
- [x] Added `no-restricted-syntax` rules to `eslint.config.js` (AST selectors targeting
  `AssignmentExpression[left.property.name='innerHTML']` and `outerHTML`) — uses ESLint's
  built-in rule with no custom plugin or extra dependency
- [x] Set to `"warn"` severity so existing reviewed sites don't block linting; each site can
  add an inline `// eslint-disable-next-line no-restricted-syntax -- safe: ...` comment
- [x] Warning message directs developers to `textContent`, `createElement()`,
  `replaceChildren()`, or the new `safeHtml` tagged template, and points to
  `.github/INNERHTML-AUDIT.md` for full guidance
- [x] Tested: rule fires on `.innerHTML =` assignments in existing source files
- **PR**: implemented on current branch
- **Status**: Done

---

## Phase 4: Asset hardening (SRI) ✅ COMPLETE

### Task 4.1: Generate SRI hashes for own assets ✅ COMPLETE
- [x] Identify all files in `dist/css/` and `dist/*.bundle.js`
- [x] Generate SRI hashes for each asset using `scripts/generate-sri.js`
- [x] Create mapping file (e.g., `src/config/sri-hashes.json`)
- [x] Test hash generation and validation
- **Assets to hash**:
  - CSS: `tokens.css`, `base.css`, `navbar.css`, `chat.css`, `overlays.css`, `player.css`, `mobile.css`, `boot-overlay.css`
  - JS: `core.bundle.js`, `chat.bundle.js`, `player.bundle.js`, `playlist.bundle.js`, `features.bundle.js`, `admin.bundle.js`
- **PR**: implemented on current branch
- **Status**: Done

### Task 4.2: Generate SRI hashes for pinned CDN assets ✅ COMPLETE
- [x] List all third-party CDN URLs in codebase:
  - jsDelivr: bootswatch, bulma, Font Awesome, twemoji, emoji.json
  - cdnjs: summernote, jQuery
  - unpkg: videojs themes
  - vjs.zencdn.net: VideoJS
- [x] Fetch each asset and generate SRI hash in `scripts/generate-sri.js`
- [x] Create `sri-hashes.json` entry for each
- **PR**: implemented on current branch
- **Status**: Done

### Task 4.3: Update asset loading helpers ✅ COMPLETE
- [x] Update `src/billtube-fw.ts` (lines 196–271) `preload()` and `load()` functions
- [x] Inject `integrity` attribute into generated `<link>` and `<script>` tags
- [x] Verify SRI validation on test environment
- [x] Document new `integrity` attribute behavior
- **PR**: implemented on current branch
- **Status**: Done

### Task 4.4: Add `crossorigin="anonymous"` for SRI ✅ COMPLETE
- [x] Verify `crossorigin="anonymous"` already set where needed (theme CSS)
- [x] Add to any new CDN asset loaders (`feature-style-core.js`, `feature-motd-editor.js`, etc.)
- [x] Document requirement: `crossorigin="anonymous"` must accompany `integrity` attribute
- **PR**: implemented on current branch
- **Status**: Done

---

## Summary of Changes by File

### New/Modified Files
- ✅ `src/lib/escape-html.ts` — NEW (shared utility)
- ✅ `src/config/sri-hashes.json` — NEW (SRI mappings)
- ✅ `scripts/generate-sri.js` — NEW (SRI hash generator)
- ✅ `docs/SECURITY-HARDENING-TASKS.md` — NEW (this file)

### Files Requiring Modifications (High to Critical Risk)
- ✅ `src/modules/feature-motd-editor.js` — Sanitization/escaping added
- ✅ `src/modules/feature-movie-suggestions.js` — Escaping added
- ✅ `src/modules/feature-notify.js` — Sanitization added
- ✅ `src/modules/feature-stack.js` — MOTD sinks sanitized
- ✅ `src/lib/templates/stack.js` — Title parameter escaped
- ✅ `src/modules/feature-theme-icons.js` — Icon host sinks sanitized
- ✅ `src/modules/util-theme-icon-packs.js` — Icon URL escaping fixed
- ✅ `src/modules/feature-monkey-paw.js` — SVG markup integrity guard added
- ✅ `src/modules/feature-stack.js` — MOTD-emptiness DOM probe replaced with regex (Task 3.0)
- ✅ `src/modules/feature-notification-sounds.js` — chat-text DOM probe replaced with regex (Task 3.0)
- ✅ `src/modules/feature-notify.js` / `feature-poll-overlay.js` — entity-decode `<textarea>` documented safe (Task 3.0)
- ✅ `src/modules/feature-chat-filters.js` — re-audited, no change needed (Task 3.0)
- ✅ `src/billtube-fw.ts` — SRI support added (Phase 4); LOW-table `innerHTML` sites converted (Task 3.1)

### Files Requiring Modifications (Low Risk) — ✅ all converted (Task 3.1)
- ✅ `src/modules/feature-chat.js` — innerHTML→createElement; removed `util:templates` dependency
- ✅ `src/modules/feature-navbar.js` — innerHTML→createElement/textContent; unused escape import removed
- ✅ `src/modules/feature-theme-settings.js` — innerHTML→inert `<template>` parsing
- ✅ `src/modules/feature-playlist-tools.js` — innerHTML→createElement/textContent
- ✅ Plus 14 other files — `feature-chat-tools.js`, `feature-chat-commands.js`, `feature-emotes.js`,
  `feature-gifs.js`, `feature-drink-counter.js`, `feature-playlist-performance.js`,
  `feature-video-overlay.js`, `feature-audio.js`, `feature-local-subs.js`,
  `feature-channel-theme-admin.js`, `feature-movie-info.js`, `feature-motd-editor.js`,
  `src/billtube-fw.ts`, `src/lib/confirm-dialog.ts`

---

## Success Criteria

- [x] All `innerHTML` sites classified and documented
- [x] All CRITICAL risk sinks fixed with escaping/sanitization
- [x] All HIGH risk sinks fixed with escaping/sanitization
- [x] All MEDIUM risk sinks fixed or re-audited and confirmed safe (Phase 3, Task 3.0)
- [x] Shared `escapeHtml()` utility extracted and in use across modules
- [x] All remaining LOW-risk `innerHTML` sites replaced with safer alternatives (Phase 3, Task 3.1)
- [x] SRI hashes generated and validated for all pinned assets (Phase 4)
- [x] ESLint rule in place to prevent new raw HTML sinks (Phase 3, Task 3.3)
- [x] All changes tested and verified in local environment (lint, typecheck, `node --test` + `vitest`, build)

---

**Last Updated:** August 6, 2026
**Status:** ✅ All Phases (1, 2, 3, and 4) are complete.
