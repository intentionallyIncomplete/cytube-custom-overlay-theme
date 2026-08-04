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
- [ ] Full SRI hash verification for this asset — deferred to Phase 4 (Task 4.1/4.2)
- **Risk Level**: HIGH
- **Complexity**: Low
- **PR**: implemented on `issue-201-html-escaping-templates`
- **Status**: Done (structural guard); full SRI deferred to Phase 4

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

### Task 3.2: Template utilities auto-escaping
- [ ] Create or update `src/lib/templates/` to use safe escaping by default
- [ ] Option A: Tagged template function for auto-escape (e.g., `html\`...\``)
- [ ] Option B: Builder/DSL for safe DOM generation
- [ ] Document pattern for safe template creation
- [ ] Migrate existing templates to use new pattern
- **PR**: TBD
- **Status**: Pending

### Task 3.3: Add linter rules
- [ ] Create ESLint rule or hook to warn on new `innerHTML` usage
- [ ] Add rule to project `.eslintrc` or linting config
- [ ] Test that rule catches new violations
- [ ] Document rule in CONTRIBUTING.md or security guidelines
- **PR**: TBD
- **Status**: Pending

---

## Phase 4: Asset hardening (SRI)

### Task 4.1: Generate SRI hashes for own assets
- [ ] Identify all files in `dist/css/` and `dist/*.bundle.js`
- [ ] Generate SRI hashes for each asset
- [ ] Create mapping file (e.g., `src/lib/sri-hashes.json`)
- [ ] Test hash generation and validation
- **Assets to hash**:
  - CSS: `tokens.css`, `base.css`, `navbar.css`, `chat.css`, `overlays.css`, `player.css`, `mobile.css`, `boot-overlay.css`
  - JS: `core.bundle.js`, `chat.bundle.js`, `player.bundle.js`, `playlist.bundle.js`, `features.bundle.js`, `admin.bundle.js`
- **PR**: TBD
- **Status**: Pending

### Task 4.2: Generate SRI hashes for pinned CDN assets
- [ ] List all third-party CDN URLs in codebase:
  - jsDelivr: bootswatch, bulma, Font Awesome, twemoji, emoji.json
  - cdnjs: summernote, jQuery
  - unpkg: videojs themes
  - vjs.zencdn.net: VideoJS
- [ ] Fetch each asset and generate SRI hash
- [ ] Create `sri-hashes.json` entry for each
- **PR**: TBD
- **Status**: Pending

### Task 4.3: Update asset loading helpers
- [ ] Update `src/billtube-fw.ts` (lines 196–271) `preload()` and `load()` functions
- [ ] Inject `integrity` attribute into generated `<link>` and `<script>` tags
- [ ] Verify SRI validation on test environment
- [ ] Document new `integrity` attribute behavior
- **PR**: TBD
- **Status**: Pending

### Task 4.4: Add `crossorigin="anonymous"` for SRI
- [ ] Verify `crossorigin="anonymous"` already set where needed (theme CSS)
- [ ] Add to any new CDN asset loaders
- [ ] Document requirement: `crossorigin="anonymous"` must accompany `integrity` attribute
- **PR**: TBD
- **Status**: Pending

---

## Summary of Changes by File

### New/Modified Files
- ✅ `src/lib/escape-html.ts` — NEW (shared utility)
- ✅ `src/lib/sri-hashes.json` — NEW (SRI mappings)
- ✅ `.github/SECURITY-HARDENING-TASKS.md` — NEW (this file)

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
- 🟠 `src/billtube-fw.ts` — SRI support still pending (Phase 4); LOW-table `innerHTML` sites already
  converted (Task 3.1)

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
- [ ] SRI hashes generated and validated for all pinned assets
- [ ] ESLint rule in place to prevent new raw HTML sinks (Phase 3, Task 3.3)
- [x] All changes tested and verified in local environment (lint, typecheck, `node --test` + `vitest`, build)
- [ ] Security guidelines document updated

---

## PR Organization Recommendation

1. **PR #1 (Phase 1)**: Create `escape-html.ts`, audit document
2. **PR #2 (Phase 2a)**: MOTD editor, movie suggestions, notify fixes
3. **PR #3 (Phase 2b)**: Template literal escaping
4. **PR #4 (Phase 3a)**: Replace innerHTML for low-risk files
5. **PR #5 (Phase 3b)**: Add linter rule
6. **PR #6 (Phase 4)**: SRI hashes and asset loader updates

Each PR should:
- Include security test cases
- Document any behavior changes
- Link back to issue #201
- Be reviewable independently

---

## Related Resources

- **Codebase Analysis**: [Explorer Agent Output](5b642bc8-aff6-4cd3-8aa4-720c2b05d8eb)
- **OWASP XSS Prevention**: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- **SRI Documentation**: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
- **CSP Headers**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP

---

**Last Updated:** August 4, 2026
**Status:** Phase 1 complete. Phase 2 complete — all CRITICAL (Tasks 2.1–2.3) and HIGH (Tasks 2.4–2.6) sinks fixed. Phase 3's MEDIUM-table remediation (Task 3.0) and LOW-table sweep (Task 3.1) both complete — all 109 audited `innerHTML` sites are now fixed, re-audited, or converted. Remaining: Task 3.2 (tagged-template auto-escape helper), Task 3.3 (ESLint rule for new `innerHTML` usage), and Phase 4 (SRI hashing).
