# BillTube Build System

## Overview

BillTube bundles modules for production (6 HTTP requests instead of 33+) and serves them via **jsDelivr** using a **single git ref** per release (`@vX.Y.Z`).

## jsDelivr refs

| URL ref | Points to |
|---------|-----------|
| `@v1.0.5` | Git tag `v1.0.5` (use in production) |
| `@latest` | `main` branch tip (moves every push) |
| `@<commit-sha>` | Exact commit (only valid if that commit contains built `dist/`) |

**Rule:** CyTube `CDN_BASE`, `dist/billtube-fw.js`, and all `dist/*.bundle.js` / `css/*` must use the **same** ref. The loader derives its asset base from its own script URL.

## Bundle strategy

- **core.bundle.js** — Style core, Bulma layer, layout
- **chat.bundle.js** — Chat features
- **player.bundle.js** — Player, video, audio boost, subs, movie info
- **playlist.bundle.js** — Playlist and now-playing
- **admin.bundle.js** — Theme admin and settings
- **features.bundle.js** — Remaining features

## Local development

```bash
npm install
npm run build          # esbuild: scss → css/, src + modules → dist/billtube-fw.js + dist/*.bundle.js
npm run release:verify # lint, typecheck, test, build, bundle size check
npm run verify-dist    # fail if bundles missing
npm run check:bundles  # compare dist/*.js to scripts/bundle-size-budget.json
```

### Local asset server (CyTube testing)

`dist/billtube-fw.js` derives `BASE` from its own script URL, so local fw loads local bundles and CSS.

```bash
npm run dev            # build, watch modules/src/css, serve on :3000, write dev/channel-settings.js
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Build + watch + static server + generated channel snippet |
| `npm run dev:server` | Static server only (`PORT` or `BTFW_DEV_PORT`, default 3000) |
| `npm run dev:channel` | Regenerate `dev/channel-settings.js` with `CDN_BASE` → localhost |

**CyTube wiring (local instance recommended — avoids HTTPS mixed content):**

1. Start BillTube: `npm run dev`
2. Start local CyTube (see `sync/docker/README.md` in the CyTube repo)
3. Channel Settings → **Javascript** tab → paste contents of `dev/channel-settings.js` → Save JS

External Javascript (General settings) requires `https://` and will reject `http://127.0.0.1:3000/...`. Inline channel JS is the correct local-dev path.
4. Open the channel — console should log `[BTFW] BASE: http://127.0.0.1:3000`

`dev/channel-settings.js` is generated and gitignored; release `channel_config_settings.js` is never mutated.

Before a user-facing release, update `user-release-notes.json` (see `.cursor/skills/updating-user-release-notes/`) so **Options → User Preferences → General → Recent Updates** stays current.

Boot always loads `dist/*.bundle.js` from the same origin/ref as `dist/billtube-fw.js`.

## CSS / SCSS

**Source of truth:** `scss/`. **Ship target:** compiled `css/*.css` on jsDelivr (plain CSS only — no SCSS at runtime).

| Layer | Path | Role |
|-------|------|------|
| Entry bundles | `scss/*.scss` (no `_` prefix) | One compiled file each → `css/<name>.css` |
| Partials | `scss/partials/_*.scss` | Shared layout, theme, tokens; pulled in via `@use` |
| Theme tokens | `scss/partials/_variables.scss` | SCSS variables compiled to `:root` CSS custom properties |
| Token bundle | `scss/tokens.scss` | Surfaces + root tokens → `css/tokens.css` (loaded first at boot) |

**Edit workflow**

1. Change styles in `scss/` only — do not hand-edit `css/` (overwritten by build).
2. `npm run build:css` — compile all entry SCSS → `css/`.
3. `npm run build` — CSS + JS bundles (what CI and release run).

`dist/billtube-fw.js` preloads `css/tokens.css`, `css/base.css`, and the feature sheets from the same `BASE` ref as bundles. CyTube channels never load `.scss`.

**Lint:** `npm run lint:css` (stylelint on `scss/**/*.scss`).

## Release pipeline

Validation and publishing are split across two GitHub Actions workflows:

| Workflow | Trigger | Role |
|----------|---------|------|
| **CI** (`.github/workflows/ci.yml`) | Every push and PR | Lint, typecheck, test, build, bundle budgets; uploads `build-output` artifact |
| **Release** (`.github/workflows/release.yml`) | After CI succeeds on `main` push | Reuses CI artifacts, runs semantic-release, purges CDN, verifies deploy |

PRs only run CI. Merges to `main` run CI once; Release waits for that run and does **not** repeat lint/test/build.

### Build outputs (what ships)

| Output | Source | On jsDelivr |
|--------|--------|-------------|
| `dist/billtube-fw.js` | `src/billtube-fw.ts` via esbuild | Loader; derives `BASE` for all assets |
| `dist/*.bundle.js` (6 files) | `modules/` via esbuild | Feature code |
| `css/*.css` (8 files) | `scss/` via dart-sass | Theme styles |
| `channel_config_settings.js` | Hand-edited + release pin | CyTube channel snippet |
| `modules/user-release-notes.generated.js` | `user-release-notes.json` at build | Bundled into admin (release commit) |

`dist/`, `css/`, and generated modules are **gitignored on `main`** between releases. Release tags include built assets for jsDelivr (`@vX.Y.Z`).

### Release steps (automated)

On each releasable push to `main` (after CI passes):

1. **CI** — `npm run lint:ci`, `typecheck`, `test`, `build`, `check:bundles`; upload `dist/`, `css/`, `user-release-notes.generated.js`
2. **Release** — download artifacts (`SKIP_BUILD=1`), `verify-dist`
3. **semantic-release** — version bump, changelog, `prepare:release` (skip build, run `inject-cdn-version.js`)
4. **Git commit** — `package.json`, `CHANGELOG.md`, pinned `channel_config_settings.js`, all `dist/*.js`, all `css/*.css`
5. **Git tag** — `vX.Y.Z`
6. **Purge** — `npm run purge-cdn` invalidates jsDelivr cache for every shipped path
7. **Verify** — `npm run verify:cdn` fetches each asset from `@vX.Y.Z`, checks HTTP 200, content markers, and CDN pin in channel config. Release fails if verification fails.

Local preflight (same checks as CI, without CDN verify):

```bash
npm run release:verify
```

### CDN version injection

`scripts/inject-cdn-version.js` runs during `prepare:release` **after** semantic-release bumps `package.json` version:

- Replaces `gh/intentionallyIncomplete/cytube-custom-overlay-theme@*` refs in `channel_config_settings.js` with `@vX.Y.Z`
- Also supports `@__VERSION__` placeholder if present

The pinned `CDN_BASE` in the release commit must match the git tag viewers load from jsDelivr.

### Purge timing

| When | What runs |
|------|-----------|
| New release published | `release.yml` → `purge-cdn` then `verify:cdn` |
| Push to `main` touches `dist/` or `css/` | `.github/workflows/purge-cdn.yml` (e.g. release commit) |

Purge uses `https://purge.jsdelivr.net/gh/...` for each path in `lib/cdn-deploy.js` → `CDN_ASSET_PATHS`.

### Rollback

jsDelivr git refs are immutable per tag. To roll back viewers:

1. Open the last good tag on GitHub (e.g. `v1.21.2`)
2. Copy `channel_config_settings.js` from that tag (or set `CDN_BASE` to `@v1.21.2`)
3. Paste into CyTube → Channel Settings → Javascript → Save JS

No purge is required when pinning an **older** tag — that ref still exists on GitHub. To ship a forward fix, merge to `main` and let semantic-release cut a new patch.

If a bad release tag must be abandoned, revert the release commit on `main` and cut a new release; channels stay on the previous `@v` pin until updated.

### Commit types and version bumps

Configured in `package.json` → `release` → `@semantic-release/commit-analyzer` ([issue #37](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/37)):

| Bump | Types / signals |
|------|-----------------|
| major | `BREAKING CHANGE` / breaking commits |
| minor | `feat` |
| patch | `fix`, `perf`, `refactor`, `build`, `revert` |
| none | `chore(no-release):`, `[skip release]` in message, or types not listed (e.g. `docs`, `test`, `ci`) |

### After each release (manual)

Paste the updated **`channel_config_settings.js`** from the release commit into CyTube → Channel settings → Custom JavaScript / JS. The repo file is not applied to your channel automatically.

## File structure

```
BillTube3-slim/
├── modules/              # Source (build input)
├── user-release-notes.json  # End-user Recent Updates copy (bundled into admin)
├── dist/                 # Built loader + bundles (gitignored on main; on release tags)
├── scss/                 # Stylesheet source (SCSS) — edit here
│   └── partials/         # Shared partials (_*.scss); not compiled directly
├── css/                  # Compiled CSS (gitignored on main; on release tags)
├── channel_config_settings.js  # CyTube channel snippet (pinned on release)
└── scripts/
    ├── build.js          # JS bundles + dist/billtube-fw.js; calls build-css.js
    ├── build-css.js      # scss/*.scss → css/*.css (dart-sass)
    ├── verify-dist.js
    ├── check-bundle-sizes.js
    ├── bundle-size-budget.json
    ├── inject-cdn-version.js
    ├── prepare-release.js   # semantic-release prepare (build or reuse CI artifacts)
    ├── verify-cdn-deploy.js # post-purge jsDelivr smoke test
    └── purge-cdn.js
```

## Performance

- **Before:** ~33 sequential module loads (~1500–2000ms)
- **After:** 6 parallel bundle loads (~400–600ms)
