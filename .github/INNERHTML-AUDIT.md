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

| File | Lines | Notes | Fix |
|------|-------|-------|-----|
| `feature-motd-editor.js` | 165, 208 | `initialHTML` (server-stored MOTD) rendered raw into textarea/editor host | Wrapped with `escapeHtml()` so raw HTML source displays as literal text instead of terminating the `<textarea>` early |
| `feature-motd-editor.js` | 247 | `motdDisplay.innerHTML = html` — MOTD write path | Wrapped with `sanitizeHtml()` |
| `feature-stack.js` | 386, 388 | `motd.innerHTML = merged` / `+= merged` — merged MOTD panels | Wrapped with `sanitizeHtml()` |
| `feature-stack.js` | 1649 | `motd.innerHTML = html` — MOTD display path (`applyMotdUpdate`) | Wrapped with `sanitizeHtml()`; **also** `wireMotdSocket("setMotd")` now re-sanitizes after CyTube's `$("#motd").html(motd)` paints the raw server payload (theme handlers register after CyTube, so viewers were previously left with unsanitized HTML on the echo path) |
| `feature-movie-suggestions.js` | 549–564 | `movie.title` (×2), `movie.posterPath` via `posterSrc()` unescaped, from TMDB API | Wrapped all interpolated fields with `escapeHtml()` |
| `feature-movie-suggestions.js` | 626–638 | `item.movieTitle`, `item.username`, poster path unescaped, from TMDB/history API | Wrapped all interpolated fields with `escapeHtml()` |
| `feature-notify.js` | 145 | `icon.innerHTML = o.icon` — unrestricted passthrough | Wrapped with `sanitizeHtml()` |
| `feature-notify.js` | 171 | `body.innerHTML = o.html` — unrestricted passthrough | Wrapped with `sanitizeHtml()` |

**Fixed in this pass:** all 8 CRITICAL sites now route through `escapeHtml()`/`sanitizeHtml()` from
`src/lib/escape-html.ts`. Verified existing `feature-notify.js` call sites (poll/join notices) still
render correctly since their markup (`div`, `b`, `span`, `ul`, `li` + `class` attribute) is within
`sanitizeHtml()`'s default allowlist. HIGH/MEDIUM/LOW sites below remain for Phase 2/3.

---

## 🟠 HIGH — ✅ Remediated

| File | Lines | Notes | Fix |
|------|-------|-------|-----|
| `feature-stack.js` | 631 | `stackTpl.stackGroupHeaderHtml(group.title)` — `title` unescaped in template | `templates/stack.js` now escapes `title` (local inline `escapeHtml()` — see note below) |
| `feature-theme-icons.js` | 29 | `host.innerHTML = stored` — theme-config-sourced icon HTML (`dataset.btfwIconDefault`) | Wrapped with a scoped `sanitizeHtml()` (custom allowlist preserving `aria-hidden`/`decoding` for icon markup) |
| `feature-theme-icons.js` | 43 | `iconPacks.buildThemedIconHtml(url, slotMeta)` — theme-config `url` interpolated | Same scoped `sanitizeHtml()` at the call site, plus `buildThemedIconHtml()` itself now escapes all 4 attribute-sensitive characters (was quote-only) |
| `feature-monkey-paw.js` | 253 | `buildOverlayMarkup(svgMarkup)` — verify `svgMarkup` provenance before Phase 3 | Confirmed `svgMarkup` is our own static first-party asset (`PAW_SVG_PATH`, no user input in the URL); added `isSafeSvgMarkup()` guard in `loadPawSvg()` rejecting `<script>`/`<foreignObject>`/`<iframe>`/`<embed>`/`<object>`, event-handler attributes, and `javascript:`/`data:` href/xlink:href before the fetched body is trusted — defense-in-depth against a compromised CDN mirror |
| `feature-theme-settings.js` | 80–82 | Preset `<option value="${p.id}">${p.name...}</option>` — `p.id` is fully unescaped in an attribute (quote-breakout risk), `p.name` only strips `<` via inline `.replace()`, not the shared utility | Both `p.id` and `p.name` now use the already-imported shared `escapeHtml()` |

**Fixed in this pass.** Note on `templates/stack.js`: `tests/unit/templates.test.js` loads that file
via a plain Node ESM `import` (not eval, not vitest), which cannot resolve a `.js` specifier to the
sibling `.ts` source (`escape-html.ts`) the way esbuild's bundler resolution does for the production
build. `templates/stack.js` therefore keeps a small local `escapeHtml()` mirroring the shared one
instead of importing it — same for `util-theme-icon-packs.js`, which is loaded via
`eval(readFileSync(...))` in `tests/unit/theme-icon-packs.test.js` and can't contain any `import`
statement at all.

---

## 🟡 MEDIUM — ✅ Remediated / re-audited

| File | Lines | Notes | Fix |
|------|-------|-------|-----|
| `feature-notify.js` | 11 | `ENTITY_DECODER.innerHTML = value` — detached scratch `<textarea>`, decode-only trick | Confirmed genuinely safe and documented with a comment explaining *why*: a `<textarea>`'s content model never parses nested markup into child elements, so this can't create an `<img>`/`<script>`/etc. regardless of attachment |
| `feature-poll-overlay.js` | 180 | Same decode-probe pattern as above (poll titles) | Same — documented as safe for the same `<textarea>`-specific reason |
| `feature-stack.js` | 87 | `probe.innerHTML = raw` — detached `<div>`, used only for `.textContent` emptiness check | **Corrected finding:** the original "safe: not inserted into document" reasoning was wrong for a `<div>` — browsers still fire `<img src=x onerror=...>` on elements created via `document.createElement()` even when never attached to the visible DOM ("detached" ≠ "inert document"). Replaced the DOM probe with the existing regex-only fallback (`<[^>]+>` strip + entity decode) unconditionally, matching `tests/unit/motd-stack.test.js` |
| `feature-notification-sounds.js` | 326 | `scratch.innerHTML = String(html)` — same detached-`<div>`-probe pattern, fed directly from **raw chat message text** (`payload.msg` in `handleChatMessage()`) | Same underlying issue as above, but higher real-world severity since the input is attacker-controlled chat text, not admin-authored MOTD. Replaced `plainText()`'s DOM probe with a regex tag-strip + entity decode (never touches an HTML parser); added `tests/unit/notification-sounds-plaintext.test.js` including an explicit `<img onerror>` regression case |
| `feature-chat-filters.js` | 188, 198 | Live chat message HTML rewritten by letterboxd/tmdb/imdb card renderers, which now use the shared `escapeHtml()` (Phase 1) for titles | **Re-audited:** `span.innerHTML` here is CyTube's own already-rendered, already-live message markup (passed through CyTube server-side `sanitize-html` — see the existing `CHAT_IMGUR_REFERRER_ATTR` comment in this file). The card renderers no longer introduce any unescaped interpolation of their own (Phase 1). Residual risk for non-card message content is CyTube core's sanitize-html trust boundary, out of scope for this theme. No code change; documented the conclusion inline |

**Correction to the original Phase 1 audit note:** "detached nodes never execute scripts" is true
for `<script>` tags specifically (browsers never execute a `<script>` inserted via `innerHTML`,
attached or not), but it does **not** generalize to other elements — `<img>`/`<video>`/etc.
event handlers like `onerror`/`onload` still fire on elements created via `document.createElement()`
even when never appended to the visible document tree, because "detached from the DOM" is not the
same as "belonging to an inert document". The two genuinely-safe sites above are safe for an
unrelated, `<textarea>`-specific reason (no nested-element parsing at all), not because they're
detached.

---

## 🟢 LOW (static markup, constants, or already escaped) — ✅ Converted

| File | Lines | Fix |
|------|-------|-----|
| `feature-navbar.js` | 110, 232, 366, 589 (static); 374, 530 (already wrapped in `escapeHtml()`) | All converted to `createElement`/`replaceChildren`/`textContent`; unused `escapeHtml` import removed |
| `feature-chat-tools.js` | 110, 132 (static array of constants), 313 | Converted to `createElement`/`replaceChildren`/`textContent` |
| `feature-chat-commands.js` | 374, 396, 405 | Converted to `createElement`/`replaceChildren`; `buildCommandsTable()` now returns a DOM element |
| `feature-chat.js` | 318, 326, 343, 811, 862, 937, 949, 964 (all `chatTpl.*Html()` static templates) | Converted to direct `createElement` construction; removed the `util:templates` dependency and `chatTpl` variable entirely |
| `feature-emotes.js` | 178, 525 | Converted to `createElement`/`replaceChildren`/`textContent` |
| `feature-gifs.js` | 91, 108 | Converted to `createElement`/`replaceChildren`/`textContent` |
| `feature-drink-counter.js` | 391 | Static SVG (`SCENE_HTML`) now parsed once via an inert `<template>` and cloned (`buildSceneFragment()`) instead of `innerHTML` |
| `feature-playlist-performance.js` | 247, 336, 344, 348, 366, 385, 389, 433 (constant `PERF_ICON_HTML` / literal glyphs) | Converted to `createElement`/`textContent`; added `buildPerfIcon()`/`setPerfButtonLabel()` helpers |
| `feature-playlist-tools.js` | 22, 104 | Converted to `createElement`/`textContent` |
| `feature-video-overlay.js` | 455, 799 | Converted to `createElement` |
| `feature-audio.js` | 1138, 1166, 1193 | Converted to `createElement` |
| `feature-local-subs.js` | 125 | Converted to `createElement` |
| `feature-channel-theme-admin.js` | 1150, 1425, 1436 | Admin panel now parsed via an inert `<template>` + `cloneNode()`; tab anchors built directly with `createElement` (removed the now-unused `channelThemeTabAnchorHtml()` template export) |
| `feature-movie-info.js` | 406, 419, 433 (static loading/error states) | Converted to `createElement`/`replaceChildren` |
| `feature-theme-settings.js` | 475 (static modal shell); 1133 → calls `buildUserOptionsAboutHtml()` | Both now parsed via an inert `<template>` + `cloneNode()`; ignore-list clear (774, tracked under NONE) also converted to `replaceChildren()` — **note:** line 79/80 (the preset `<option>` list) is tracked under HIGH above, not here |
| `feature-motd-editor.js` | 100, 446, 455 | Modal shell converted to `createElement`; Edit-MOTD buttons converted via a `buildMotdEditBtnContent()` helper |
| `billtube-fw.ts` | 127, 164 | `bootOverlayCardHtml()` replaced with `buildBootOverlayCard()`, which returns a DOM element (`appendChild`) instead of an HTML string; hardcoded label string converted to `append()` with a `<strong>` + text node |
| `confirm-dialog.ts` | 80 | Converted to `createElement` DOM construction |

**Bonus fix found during the sweep:** `feature-motd-editor.js` had its own copy of the `isMotdHtmlEmpty()`
DOM-probe pattern (a duplicate of the one already fixed in `feature-stack.js` during Phase 3's MEDIUM
pass) that the original audit missed. Replaced with the same regex-based tag-strip + entity-decode
implementation; `tests/unit/motd-stack.test.js` now documents it as covering both files.

**Note:** `feature-theme-settings.js:79` uses inline `.replace(/</g, "&lt;")` (partial escaping, not
the shared utility) for the preset `<option>` list — flagged for Phase 3 cleanup even though it's
not user-facing untrusted input today.

---

## ⚪ NONE (clear / no-op / read-only comparison)

| File | Lines |
|------|-------|
| `feature-navbar.js` | — (232, 366 already counted above as clears, listed once) |
| `feature-theme-settings.js` | 774 |
| `feature-chat-tools.js` | 390 |
| `feature-emotes.js` | 420 |
| `feature-gifs.js` | 270 |
| `feature-layout.js` | 519 |
| `feature-movie-info.js` | 448 |
| `feature-movie-suggestions.js` | 545 (static "no results" message), 591, 605, 616, 622, 642, 686 (clear) |
| `feature-nowplaying.js` | 218 |
| `feature-channel-theme-admin.js` | 664 |
| `feature-stack.js` | 164, 496, 534, 850, 1092, 1100, 1756, 1769, 1796 (static template calls / comparison-guarded clears) |
| `util-letterboxd.js` | 191 (comparison-guarded write of already-escaped card HTML) |

---

## Summary

| Risk | Sites |
|------|-------|
| 🔴 CRITICAL | 8 (✅ fixed) |
| 🟠 HIGH | 5 (✅ fixed) |
| 🟡 MEDIUM | 5 (✅ remediated/re-audited) |
| 🟢 LOW | ~64 (✅ converted) |
| ⚪ NONE | ~27 |
| **Total** | **109** |

The 8 CRITICAL + 5 HIGH + 5 MEDIUM sites are remediated or re-audited and confirmed safe, and all ~64
LOW-risk sites have been converted from `innerHTML` to `createElement`/`textContent`/`replaceChildren`
(or inert `<template>` parsing for complex static markup) — not required for security since these sites
only ever held static/constant/already-escaped markup, but done for defense-in-depth/consistency per
the full-conversion decision for Phase 3. Remaining follow-ups are the linter-rule/tagged-template
items tracked in `SECURITY-HARDENING-TASKS.md` Tasks 3.1–3.3, and Phase 4 (SRI/asset hardening).

## Phase 1 completed in this pass

- [x] Extracted canonical `escapeHtml()` + `sanitizeHtml()` to `src/lib/escape-html.ts`
- [x] Deduplicated all 7 local `escapeHtml()` implementations to import the shared utility:
  `feature-navbar.js`, `feature-notify.js`, `feature-playlist-tools.js`,
  `feature-theme-settings.js`, `util-imdb-card.js`, `util-letterboxd.js`, `util-tmdb-card.js`
- [x] Full `innerHTML` site audit with risk classification (this document)
- [x] `tests/unit/escape-html.vitest.ts` — 18 unit tests covering escaping and sanitization
- [x] Remediated all 8 CRITICAL sites: `feature-motd-editor.js`, `feature-stack.js`,
  `feature-movie-suggestions.js`, `feature-notify.js` — wired `escapeHtml()`/`sanitizeHtml()` into
  each flagged sink
- [x] Remediated all 5 HIGH sites: `templates/stack.js`, `feature-theme-icons.js`,
  `util-theme-icon-packs.js`, `feature-monkey-paw.js`, `feature-theme-settings.js`

## Phase 3 (MEDIUM table) completed in this pass

- [x] Corrected the "detached nodes never execute scripts" assumption — true only for `<script>`
  tags, not for `<img onerror>`/similar on non-inert documents
- [x] `feature-stack.js` (`isMotdHtmlEmpty`, line 87) — removed the `<div>`-based DOM probe,
  unconditionally use the pre-existing regex-only fallback (now covers `&nbsp;`/`<br>` like the
  DOM branch did)
- [x] `feature-notification-sounds.js` (`plainText()`, line 326) — removed the `<div>`-based DOM
  probe fed with raw chat text, replaced with a regex tag-strip + entity decode; added
  `tests/unit/notification-sounds-plaintext.test.js`
- [x] `feature-notify.js` / `feature-poll-overlay.js` (`ENTITY_DECODER`) — confirmed genuinely safe
  (textarea-specific), documented why with inline comments
- [x] `feature-chat-filters.js` (lines 188, 198) — re-audited after Phase 2 card-template fixes;
  no code change needed, documented the accepted CyTube-core trust boundary inline
- [x] Added a regression test to `tests/unit/motd-stack.test.js` covering bare `<img onerror>` MOTD
  payloads

## Phase 3 (LOW table) completed in this pass

- [x] Converted all ~64 LOW-risk sites across 18 files to `createElement()`/`textContent`/
  `replaceChildren()`, or inert `<template>` parsing + `cloneNode()` for complex static markup
  (`feature-theme-settings.js`, `feature-channel-theme-admin.js`, `feature-drink-counter.js`)
- [x] Removed template-string helpers made obsolete by the conversion:
  `channelThemeTabAnchorHtml()` (`templates/channel-theme-admin.js`), `bootOverlayCardHtml()` →
  replaced with element-returning `buildBootOverlayCard()` (`templates/boot-overlay.js`)
- [x] Removed the `util:templates` dependency from `feature-chat.js` entirely (was only used for
  static HTML fragments now built inline with `createElement`)
- [x] Found and fixed an un-audited duplicate of the `isMotdHtmlEmpty()` DOM-probe vulnerability in
  `feature-motd-editor.js` (see MEDIUM section note above)
- [x] `npm run lint`, `npm run typecheck`, `npm test` (123/123 passing), and `npm run build` all pass
  clean after the conversion
