# Chat media sizing system

**Date:** 2026-08-01  
**Status:** Implemented on `feat/chat-media-sizing`  
**Repo:** cytube-custom-overlay-theme

## Goal

Introduce a global chat media sizing model so GIFs, parsed image links, and animated emote GIFs scale to a user-controlled percentage of available chat width (default **80%**), with a clamped max-height. Separately, change the existing Small / Medium / Big emote control from fixed pixels to percentages of chat width (**30% / 60% / 90%**).

## Decisions locked in

| Decision | Choice |
|---|---|
| Architecture | Hybrid: CSS `%` width + fixed/clamped max-height; Theme setting drives CSS vars; remove conflicting inline caps |
| Media scale scope | **Option A:** large media only (parsed GIF/image links + animated `.channel-emote` GIFs) |
| Emote size control | Keep discrete Small / Medium / Big, but map to **30% / 60% / 90%** of chat width instead of 100 / 130 / 170 px |
| Movie/info cards | Out of scope (TMDB / Letterboxd / IMDB keep current card/poster rules) |
| Twemoji / Unicode emoji | Out of scope |
| Avatars | Out of scope |

## Problem today

Sizing is layered and fights itself:

1. `feature-chat-filters.js` injects inline `max-width:300px;max-height:300px` on parsed media.
2. `chat.scss` overrides with `--btfw-chat-gif-max-width` (90%) and `--btfw-chat-gif-max-height` (220px) using `!important`.
3. `feature-chat-media.js` strips inline caps only for Giphy/Klipy (not Tenor/Lensdump/Imgur).
4. Static emotes use pixel `--btfw-emote-size` (100 / 130 / 170); layout/mobile SCSS also overwrites that var with different px values.
5. There is no Theme control for “how wide should chat media be?”

## Target behavior

### Available chat width

Treat `#messagebuffer` as the sizing container (the user’s visible chat message column). Percentages resolve against that container’s inline size so media tracks real chat width across desktop, vertical layout, and mobile without measuring in JS.

Implementation detail: set `container-type: inline-size` on `#messagebuffer` (or the nearest stable chat content wrapper) so square-ish emote max-height can use `cqw` units. Do **not** use the same CSS `%` for both `max-width` and `max-height` on emotes — `%` height resolves against containing-block height and would be wrong.

### Large media (media scale %)

Applies to:

- Parsed chat pictures: Giphy, Klipy, Tenor, Lensdump, Imgur (`.chat-media.chat-picture` / provider classes)
- Animated channel emotes: `img.channel-emote[src$=".gif"]`

Rules:

- `max-width: var(--btfw-chat-media-scale)` where the var is a percentage string (default `80%`)
- `max-height: var(--btfw-chat-gif-max-height)` remains a **clamp** (keep current `220px` unless testing shows it should scale later)
- `width/height: auto`; `object-fit: contain`
- Hover magnify continues to pre-shrink by `--btfw-chat-gif-hover-scale` then `transform: scale(...)`

Does **not** apply to static `.channel-emote` (non-GIF).

### Static emotes (Small / Medium / Big → %)

Applies to static `img.channel-emote` only (not `.gif` sources).

| Setting value | Today | New |
|---|---|---|
| `small` | 100×100 px | **30%** of chat container width |
| `medium` (default) | 130×130 px | **60%** of chat container width |
| `big` | 170×170 px | **90%** of chat container width |

CSS shape:

- `--btfw-emote-size: 30% | 60% | 90%` (set from Theme / typography rehydrate)
- `max-width: var(--btfw-emote-size)`
- `max-height: N cqw` derived from the same percentage (e.g. store unitless `--btfw-emote-size-pct: 30` and use `max-width: calc(var(--btfw-emote-size-pct) * 1%)` + `max-height: calc(var(--btfw-emote-size-pct) * 1cqw)`), so height tracks **width** of the chat container, preserving today’s square-cap intent

LocalStorage key stays `btfw:chat:emoteSize` with values `small` | `medium` | `big` (no migration of stored keys; only the applied CSS changes).

### User setting: media scale percentage

Add under Theme Settings → **Chat** (same card as emote size / GIF autoplay):

- Control: range or numeric input labeled **Media scale**
- Persisted key: `btfw:chat:mediaScale` (string integer percent, e.g. `"80"`)
- Default: **80**
- Allowed range: **40–100**, step **5**
- On change: write `--btfw-chat-media-scale` (e.g. `80%`) on `#messagebuffer` or `:root` as appropriate; replace today’s hardcoded `--btfw-chat-gif-max-width: 90%`

Help text: “Maximum width for GIFs and linked images in chat, as a percent of the chat window.”

Emote size help text: update labels from `Small (100×100)` → `Small (30%)`, etc., and clarify it applies to static channel emotes; animated GIF emotes follow Media scale.

## Architecture

```
Theme Settings (Chat)
  ├─ Emote size select → applyEmoteSize() → --btfw-emote-size-pct / --btfw-emote-size
  └─ Media scale %    → applyMediaScale() → --btfw-chat-media-scale

chat.scss (#messagebuffer, container-type: inline-size)
  ├─ static .channel-emote     → max-width/height from emote %
  ├─ .channel-emote[src$=.gif] → max-width from media scale; max-height clamp
  └─ .chat-media.chat-picture  → max-width from media scale; max-height clamp

feature-chat-filters.js
  └─ stop emitting inline max-width/max-height (kill CHAT_MEDIA_MAX_STYLE)

feature-chat-media.js
  └─ stop needing clearGifSizeCaps for width caps (optional keep width/height attr clear)
```

No `ResizeObserver` / JS pixel measurement for v1. Percentages + container queries are enough.

## Exact code touchpoints

| Area | Change |
|---|---|
| `src/modules/feature-chat-filters.js` | Remove `CHAT_MEDIA_MAX_STYLE` / stop injecting `style="max-width:300px;max-height:300px"` on filter replacements |
| `src/styles/chat.scss` | Wire media scale var; switch emote caps to % + `cqw`; point GIF/picture rules at `--btfw-chat-media-scale`; enable container queries on `#messagebuffer` |
| `src/styles/mobile.scss` | Remove px / competing `--btfw-emote-size` and `--btfw-chat-gif-max-width` overrides that fight user settings (width already scales with chat) |
| `src/styles/partials/_base-layout.scss` | Same: drop hardcoded emote/gif width overrides once % system owns them |
| `src/lib/apply-chat-typography.ts` | Replace `emoteSizeToPx` with percent mapping; set CSS vars; optionally apply stored media scale on rehydrate |
| `src/lib/btfw-constants.js` | Add `LS_KEYS.mediaScale` (and event if other modules listen) |
| `src/modules/feature-chat-media.js` | Align emote size application with % API; drop/simplify inline-cap clearing for sizing |
| `src/modules/feature-theme-settings.js` | New Media scale control; update emote option labels; load/save/apply |

## Error handling & edge cases

- Invalid / missing `mediaScale` in LS → default `80`
- Values outside 40–100 → clamp on apply
- Legacy `feature-chat-media.js` `sm` / `md` / `lg` aliases → map to small/medium/big then to percents
- Hover magnify + large %: keep existing pre-shrink formula so scaled hover does not overflow the chat column
- `contain-intrinsic-size` on emotes currently assumes px; update to a safe estimate (e.g. medium-ish) or drop if it causes CLS issues
- CyTube sanitize-html: still only rely on allowed attributes; sizing lives in CSS, not new inline styles

## Testing

1. Theme → Chat: change Media scale; confirm Giphy/Tenor/Imgur/Lensdump/Klipy images resize live without reload.
2. Confirm animated `.channel-emote` GIFs follow Media scale, not Emote size.
3. Confirm static emotes follow 30/60/90% and ignore Media scale.
4. Resize chat / switch vertical / mobile widths: media and emotes track chat width; no horizontal overflow of `#messagebuffer`.
5. Hover magnify still works; reduced-motion still disables scale transform.
6. Import/export of chat filters no longer embeds 300px inline styles on new media HTML.
7. Cards (TMDB/Letterboxd/IMDB) unchanged.
8. Rehydrate after reload: both settings restore from localStorage.

## Out of scope (explicit)

- Unifying emote + media into one slider
- Scaling movie cards / posters
- Changing Twemoji size
- JS-measured pixel caps / ResizeObserver
- Server-side chat filter changes beyond removing client-authored inline size attributes in this theme’s filter templates

## Success criteria

- One Theme control sets how wide large chat media may be (default 80% of chat width).
- Emote Small/Medium/Big are percentage-based (30/60/90) and independent of Media scale.
- No inline `300px` caps from BillTube chat filters.
- Layout/mobile no longer overwrite user emote/media width with competing pixel/% defaults.
