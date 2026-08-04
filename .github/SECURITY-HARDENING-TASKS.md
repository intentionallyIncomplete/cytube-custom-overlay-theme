# Security Hardening Detailed Task Breakdown
## Issue #201: Remove raw HTML sinks and standardize escaping

---

## Phase 1: Create shared utility & audit high-risk sinks

### Task 1.1: Create `src/lib/escape-html.ts`
- [ ] Create new file with canonical `escapeHtml()` function
- [ ] Include `sanitizeHtml()` wrapper for limited HTML use cases
- [ ] Add JSDoc comments with usage examples
- [ ] Export both functions for use across modules
- **PR**: TBD
- **Status**: Pending

### Task 1.2: Audit all `innerHTML` usages
- [ ] Document all 120+ `innerHTML` locations by file
- [ ] Classify each by risk level (Critical / High / Medium / Low)
- [ ] Identify which files can use `textContent` + `createElement()`
- [ ] Identify which files need sanitization vs escaping
- [ ] Create audit spreadsheet/tracking doc
- **Files to analyze**:
  - `src/modules/feature-stack.js` (23 usages) — Risk: HIGH
  - `src/modules/feature-movie-suggestions.js` (12 usages) — Risk: CRITICAL
  - `src/modules/feature-motd-editor.js` (11 usages) — Risk: CRITICAL
  - `src/modules/feature-playlist-performance.js` (8 usages) — Risk: MEDIUM
  - `src/modules/feature-chat.js` (8 usages) — Risk: MEDIUM
  - `src/modules/feature-navbar.js` (6 usages) — Risk: LOW
  - `src/modules/feature-notify.js` (5 usages) — Risk: CRITICAL
  - Plus 22 other files with 1-5 usages each
- **PR**: TBD
- **Status**: Pending

### Task 1.3: Consolidate duplicated `escapeHtml()` implementations
- [ ] Identify all 7 existing implementations (navbar, notify, playlist-tools, theme-settings, chat, imdb-card, letterboxd)
- [ ] Verify they are functionally equivalent or document differences
- [ ] Create plan to replace with centralized version
- [ ] Test each replacement in context
- **PR**: TBD
- **Status**: Pending

---

## Phase 2: Fix critical vulnerabilities

### Task 2.1: MOTD Editor Security
- [ ] Update `src/modules/feature-motd-editor.js` (lines 165, 208)
- [ ] Require `sanitizeHtml()` call on input before storage
- [ ] Test with Summernote fallback path
- [ ] Update related display code in `src/modules/feature-stack.js` (line 1649)
- [ ] Add test case for malicious HTML input
- **Risk Level**: CRITICAL
- **Complexity**: Medium
- **PR**: TBD
- **Status**: Pending

### Task 2.2: Movie Suggestions API Escaping
- [ ] Update `src/modules/feature-movie-suggestions.js` (lines 549–626)
- [ ] Wrap all `movie.title` in `escapeHtml()`
- [ ] Wrap all `movie.poster` in `escapeAttr()` (for src attribute)
- [ ] Test with movie titles containing special characters
- [ ] Add test case for XSS injection attempts
- **Risk Level**: CRITICAL
- **Complexity**: Low
- **PR**: TBD
- **Status**: Pending

### Task 2.3: Notify Custom Notice Validation
- [ ] Update `src/modules/feature-notify.js` (lines 143, 169)
- [ ] Decide: validate/reject or sanitize untrusted `o.html` and `o.icon`
- [ ] Add validation function for notice HTML
- [ ] Test with custom notice HTML
- [ ] Document behavior change for custom notices
- **Risk Level**: CRITICAL
- **Complexity**: Medium
- **PR**: TBD
- **Status**: Pending

### Task 2.4: Template Literal Escaping
- [ ] Update `src/lib/templates/stack.js` — `stackGroupHeaderHtml(title)` (lines 18–20)
- [ ] Escape `title` parameter before interpolation
- [ ] Apply same fix to other unescaped template literals in `src/lib/templates/`
- [ ] Create helper function for safe template literals (optional: use tagged template syntax)
- [ ] Test with special characters in titles
- **Risk Level**: HIGH
- **Complexity**: Low
- **PR**: TBD
- **Status**: Pending

---

## Phase 3: Systematic replacement (low to medium risk)

### Task 3.1: Replace `innerHTML` with safer DOM methods
- [ ] Analyze each file in the 29-file list
- [ ] For each: decide if `textContent` + `createElement()` is viable
- [ ] Replace `innerHTML` assignments where safe
- [ ] Use `textContent` for plain text, `appendChild()` for elements
- [ ] Test visual and functional changes
- **High-priority files**:
  - [ ] `src/modules/feature-chat.js` (8 usages)
  - [ ] `src/modules/feature-navbar.js` (6 usages) — mostly labels (safe for textContent)
  - [ ] `src/modules/feature-theme-settings.js` (4 usages)
  - [ ] `src/modules/feature-channel-theme-admin.js` (4 usages)
  - [ ] `src/modules/feature-movie-info.js` (4 usages)
- **PR**: TBD (may split into multiple PRs by module)
- **Status**: Pending

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
- 🔴 `src/modules/feature-motd-editor.js` — Add sanitization
- 🔴 `src/modules/feature-movie-suggestions.js` — Add escaping
- 🔴 `src/modules/feature-notify.js` — Add validation
- 🟠 `src/lib/templates/stack.js` — Escape title parameter
- 🟠 `src/billtube-fw.ts` — Add SRI support

### Files Requiring Modifications (Medium to Low Risk)
- 🟡 `src/modules/feature-stack.js` — Replace duplicated escape
- 🟡 `src/modules/feature-chat.js` — Consolidate escape, consider innerHTML→textContent
- 🟡 `src/modules/feature-navbar.js` — Consolidate escape, replace innerHTML with textContent
- 🟡 `src/modules/feature-theme-settings.js` — Consolidate escape
- 🟡 `src/modules/feature-playlist-tools.js` — Consolidate escape
- 🟡 Plus 24 other files (lower priority)

---

## Success Criteria

- [x] All `innerHTML` sites classified and documented
- [ ] All CRITICAL risk sinks fixed with escaping/sanitization
- [ ] Shared `escapeHtml()` utility extracted and in use across modules
- [ ] All `innerHTML` replaced with safer alternatives or properly escaped (Phase 3)
- [ ] SRI hashes generated and validated for all pinned assets
- [ ] ESLint rule in place to prevent new raw HTML sinks
- [ ] All changes tested and verified in local/CI environment
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

**Last Updated:** August 3, 2026
**Status:** Ready for Phase 1 implementation
