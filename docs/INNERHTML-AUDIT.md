# `innerHTML` Site Audit — Issue #201, Phase 1

Complete, line-accurate inventory of every `.innerHTML =` assignment under `src/`, gathered via
`grep -n "\.innerHTML\s*="` (2026-08-03). This supersedes the rough per-file counts in
`SECURITY-HARDENING-TASKS.md` with exact line numbers and a risk classification for each site.

**Total: 109 assignment sites across 29 files.** (No `insertAdjacentHTML` or `outerHTML` sinks exist
in `src/`; `insertAdjacentElement` is used twice with DOM nodes, not HTML strings — not a sink.)

## Risk legend

| Level | Meaning |
|-------|---------|
| 🔴 CRITICAL | Unescaped/unsanitized untrusted or external data reaches the sink today |
| 🟠 HIGH | Untrusted-ish data (admin-authored, semi-trusted) reaches the sink without sanitization |
| 🟡 MEDIUM | Data is app-controlled but passes through another layer (chat filters, decode probes) worth revisiting |
| 🟢 LOW | Static markup / constants only, or already escaped via `escapeHtml()` |
| ⚪ NONE | Sink only ever clears content (`= ""`) or reads (comparison), no injection surface |

---

## 🔴 CRITICAL — ✅ Remediated

### 1. `src/modules/feature-motd-editor.js`
- **Line 165:** `host.innerHTML = '<textarea ...>' + initialHTML + '</textarea>'` — unescaped server MOTD into raw textarea HTML
- **Line 208:** Summernote fallback read path — unescaped display write
- **Remediation (Phase 2a):** Wrap `initialHTML` in `escapeHtml()` on fallback textarea write; route display write through `sanitizeHtml()`.

### 2. `src/modules/feature-movie-suggestions.js`
- **Lines 549, 552, 555, 564, 626, 629, 632, 638:** `container.innerHTML = movies.map(...)` — TMDB API search results (`movie.title`, `movie.poster`, `item.movieTitle`, `item.username`) directly interpolated into card HTML & attributes
- **Remediation (Phase 2a):** Wrap all dynamic `movie.title`, `movie.posterPath`, `item.movieTitle`, `item.username` interpolations in `escapeHtml()`.

### 3. `src/modules/feature-notify.js`
- **Line 145:** `icon.innerHTML = o.icon` — custom notice icon passthrough
- **Line 171:** `body.innerHTML = o.html` — custom notice HTML passthrough
- **Remediation (Phase 2a):** Wrap both in `sanitizeHtml()` so custom notice callers can pass safe HTML (`b`, `span`, `i`, `img`) without raw XSS risks.

### 4. `src/modules/feature-stack.js`
- **Lines 386, 388, 1649:** MOTD stack display rendering unescaped server MOTD
- **Remediation (Phase 2a):** Wrap display writes in `sanitizeHtml()`.

---

## 🟠 HIGH — ✅ Remediated

### 5. `src/lib/templates/stack.js`
- **Lines 18–20:** `stackGroupHeaderHtml(title)` — `title` parameter interpolated unescaped into template string
- **Remediation (Phase 2b):** Wrap `title` in local `escapeHtml()`.

### 6. `src/modules/feature-theme-icons.js`
- **Lines 29, 43:** `host.innerHTML = iconHtml` — icon pack markup written to DOM
- **Remediation (Phase 2b):** Wrap icon writes in scoped `sanitizeHtml()` allowlist.

### 7. `src/modules/util-theme-icon-packs.js`
- **Line 34:** `buildThemedIconHtml()` — incomplete attribute escaping (escaped `"` only)
- **Remediation (Phase 2b):** Use full 4-char attribute escaping (`&`, `<`, `>`, `"`).

### 8. `src/modules/feature-monkey-paw.js`
- **Line 253:** `overlay.innerHTML = svgMarkup` — SVG fetched from asset URL
- **Remediation (Phase 2b):** Confirmed static first-party provenance; added `isSafeSvgMarkup()` integrity guard rejecting script/object/foreignObject/event-handler attributes.

### 9. `src/modules/feature-theme-settings.js`
- **Line 80:** Preset options dropdown rendering — partial `<` escaping
- **Remediation (Phase 2b):** Replace `.replace(/</g, "&lt;")` with canonical `escapeHtml()`.

---

## 🟡 MEDIUM — ✅ Remediated / Re-audited (Phase 3, Task 3.0)

### 10. `src/modules/feature-notify.js`
- **Line 11:** `decodeHtmlEntities()` scratch `<textarea>` — parses entity-encoded text by setting `textarea.innerHTML = text` and reading `textarea.value`
- **Re-audit finding:** Genuinely safe. Textarea elements do not parse child HTML tags or execute scripts/resource loads, even when attached. Documented with inline comments.

### 11. `src/modules/feature-poll-overlay.js`
- **Line 180:** `decodeHtmlEntities()` scratch `<textarea>` — same pattern as notify
- **Re-audit finding:** Genuinely safe for the same reason. Documented with inline comments.

### 12. `src/modules/feature-stack.js`
- **Line 87:** `isMotdHtmlEmpty(html)` — creates a `<div>`, sets `innerHTML = html`, and checks `textContent.trim()` to see if the MOTD is empty
- **Remediation:** Removed `<div>` DOM probe branch entirely. Setting `innerHTML` on a `<div>` (even unattached) triggers `<img src=x onerror=...>` execution. Replaced with regex tag-strip + entity decode.

### 13. `src/modules/feature-notification-sounds.js`
- **Line 326:** `plainText(html)` — creates a `<div>`, sets `innerHTML = html`, reads `textContent`, and clears
- **Remediation:** Same vulnerability as #12, fed directly from raw chat message text. Replaced `<div>` DOM probe with regex tag-strip + entity decode.

### 14. `src/modules/feature-chat-filters.js`
- **Lines 188, 198:** Chat media filter card rendering
- **Re-audit finding:** Confirmed safe after Phase 2 TMDB/Letterboxd card escaping fixes. Residual risk is CyTube core's own `sanitize-html` boundary. Documented inline.

---

## 🟢 LOW — ✅ All ~64 sites converted to DOM APIs (Phase 3, Task 3.1)

All remaining ~64 `innerHTML` assignment sites across 18 files have been converted to `textContent`, `createElement()`, `replaceChildren()`, or inert `<template>` parsing:

- `src/modules/feature-chat.js` (8 sites)
- `src/modules/feature-navbar.js` (6 sites)
- `src/modules/feature-theme-settings.js` (2 sites)
- `src/modules/feature-channel-theme-admin.js` (3 sites)
- `src/modules/feature-movie-info.js` (4 sites)
- `src/modules/feature-playlist-performance.js` (8 sites)
- `src/modules/feature-chat-tools.js`
- `src/modules/feature-chat-commands.js`
- `src/modules/feature-emotes.js`
- `src/modules/feature-gifs.js`
- `src/modules/feature-drink-counter.js`
- `src/modules/feature-playlist-tools.js`
- `src/modules/feature-video-overlay.js`
- `src/modules/feature-audio.js`
- `src/modules/feature-local-subs.js`
- `src/modules/feature-motd-editor.js`
- `src/billtube-fw.ts`
- `src/lib/confirm-dialog.ts`

---

## Summary Status

- 🔴 **CRITICAL**: 8/8 sites remediated (Phase 2a)
- 🟠 **HIGH**: 5/5 sites remediated (Phase 2b)
- 🟡 **MEDIUM**: 5/5 sites remediated/confirmed safe (Phase 3, Task 3.0)
- 🟢 **LOW**: ~64/64 sites converted to DOM APIs (Phase 3, Task 3.1)
- 🔒 **SRI**: Asset hardening complete (Phase 4)
