# Discovery Output — module registry gaps (util:motion and similar)
**Date:** 2026-05-26
**Task:** Find modules likely to fail with `Module not found` like `feature:audio-boost` / `util:motion` after v1.0.6 release
**Status:** Complete

---

## What Was Investigated

Compared `BTFW.define()` IDs, `billtube-fw.js` boot `init()` list, dev-only script loading (`?dev=1`), and `scripts/build.js` bundle membership. Traced runtime `BTFW.init()` calls inside feature factories (transitive deps). Goal: predict the next console errors in **production bundle mode** (default on CyTube).

---

## Codebase Findings

### Entry Points

- `billtube-fw.js` — boots framework: loads CSS, then either 6 `dist/*.bundle.js` (prod) or 44 `modules/*.js` (dev), then runs `BTFW.init()` for each feature.
- `scripts/build.js` — concatenates/minifies modules into bundles; **does not include** `modules/util-motion.js`.
- `modules/util-motion.js` — defines `util:motion` (shared motion/prefers-reduced-motion helpers).

### Failure modes (two classes)

| Class | Example | Symptom | Status in v1.0.6 |
|-------|---------|---------|------------------|
| **A. ID mismatch** | Boot/init `feature:audio-boost` vs define `feature:audioboost` | Module not found at boot | Fixed via aliases + boot uses `feature:audioboost` |
| **B. Missing from bundles** | `util:motion` defined only in dev-loaded file | Module not found when a bundled feature calls `init("util:motion")` | **Active — causes current error** |

`util:motion` is **not** a naming bug. It is never shipped in any production bundle.

### Modules that call `util:motion` (will fail in prod until bundled)

All invoke `BTFW.init("util:motion")` at the **start** of their factory:

| Module | Bundle | Boot-inited? |
|--------|--------|--------------|
| `feature:chat` | chat | Yes |
| `feature:chat-tools` | chat | Yes |
| `feature:chat-commands` | chat | Yes |
| `feature:emotes` | features | Yes |
| `feature:gifs` | features | Yes |
| `feature:ratings` | features | Yes |
| `feature:motd-editor` | admin | Yes |
| `feature:theme-settings` | admin | Yes |

First failure is often `feature:chat` (early in boot parallel inits).

### Dev-only scripts (not in any bundle)

| File | Module ID | Notes |
|------|-----------|-------|
| `modules/util-motion.js` | `util:motion` | **Required by 8+ features; missing in prod** |
| `modules/feature-audio-enhancer.js` | `feature:audioEnhancer` | Intentionally dev-only (`?dev=1` + boot init only in dev) |

### Boot `init` list vs `define` — no orphaned boot IDs

All 44 production boot inits match a `BTFW.define()` (including `feature:audioboost`, `ext:movie-suggestion`). Aliases `feature:audio-boost` and `feature:movie-suggestions` exist but boot does not call them.

### Defined but not boot-inited (latent / optional)

Not immediate boot failures unless something calls `init()` on them:

| Module ID | File | Risk |
|-----------|------|------|
| `feature:audionorm` | `feature-audio-boost.js` | Never boot-inited; UI self-contained in same file |
| `feature:ambient` | `feature-ambient.js` | In player bundle only |
| `feature:resize` | `feature-resize.js` | In player bundle only |
| `feature:playlistSearch` | `feature-playlist-search.js` | Self-boots on DOMContentLoaded |
| `feature:overlays` | `feature-overlays.js` | Not boot-inited |
| `feature:userlistOverlay` | `feature-userlist-overlay.js` | Not boot-inited |
| `util:motion` | `util-motion.js` | **Transitive only — breaks prod** |

### Legacy modules — invalid `define` dependencies

These declare deps that **do not exist** as `BTFW.define()` anywhere:

| Module | Declared deps | Also uses |
|--------|---------------|-----------|
| `feature:overlays` | `core` | — |
| `feature:playlistSearch` | `core`, `bridge` | — |
| `feature:userlistOverlay` | `core`, `bridge` | `BTFW.require("bridge")` (not implemented on `window.BTFW`) |

Not boot-inited today. If enabled later, they will fail on `core`/`bridge` before any user-visible feature runs.

### Other typo / dynamic init risk

- `feature-theme-settings.js` — `getModule("feature:chatAvatars")` (wrong casing); correct ID is `feature:chat-avatars`. Caught with `.catch(() => null)` so non-fatal.

### Relevant Methods / Classes

- `BTFW.define(name, deps, factory)` — registers module; runs `init(deps)` first.
- `BTFW.init(name)` — resolves module; throws `Module not found: ${name}` if never defined.
- `billtube-fw.js` `load()` — appends bundle scripts; defines run at parse time when bundle executes.

### Existing Tests

- None found for module registry or boot sequence.

---

## Dependencies

| Library | Version | Relevant API | Notes |
|---------|---------|--------------|-------|
| semantic-release / exec | — | `prepareCmd: npm run build` | Bundles committed on release |
| terser | ^5.44 | minify bundles | Concat order = define order in bundle |
| BTFW loader | in-repo | `define`, `init` | No `require()` despite legacy calls |

---

## Fetched References

| URL | Key Takeaway |
|-----|-------------|
| (skipped) | context7 / external fetch not run — codebase-only discovery per user scope |

---

## Open Questions

- [ ] Should `util:motion` be prepended to `core.bundle.js` only, or duplicated into `chat.bundle.js`?
- [ ] Should `billtube-fw.js` call `BTFW.init("util:motion")` before `feature:layout` (explicit ordering)?
- [ ] Are `feature:overlays`, `feature:playlistSearch`, `feature:userlistOverlay` still used, or dead code to remove?
- [ ] Should `feature:audionorm` be boot-inited for parity with audioboost UI?
- [ ] tldraw map created if MCP available; verify in IDE if needed

---

## tldraw Info Map

Drawing name: `module-registry-discovery-info-map`

---

## Recommended Next Step

Proceed to **Planning (`/plan`)** with a focused fix: add `modules/util-motion.js` as the **first file** in `core` bundle in `scripts/build.js`, rebuild `dist/`, release, and optionally add early `BTFW.init("util:motion")` in `billtube-fw.js` before feature inits for clearer boot ordering.
