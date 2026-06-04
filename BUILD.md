# BillTube Build System

## Overview

BillTube bundles modules for production (6 HTTP requests instead of 33+) and serves them via **jsDelivr** using a **single git ref** per release (`@vX.Y.Z`).

## jsDelivr refs

| URL ref | Points to |
|---------|-----------|
| `@v1.0.5` | Git tag `v1.0.5` (use in production) |
| `@latest` | `main` branch tip (moves every push) |
| `@<commit-sha>` | Exact commit (only valid if that commit contains built `dist/`) |

**Rule:** CyTube `CDN_BASE`, `billtube-fw.js`, and all `dist/*.bundle.js` / `css/*` must use the **same** ref. `billtube-fw.js` derives its asset base from its own script URL.

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
npm run build          # writes dist/*.bundle.js
npm run verify-dist    # fail if bundles missing
```

Boot always loads `dist/*.bundle.js` from the same git ref as `billtube-fw.js`.

## Release pipeline

On each semantic-release to `main`:

1. Version bump in `package.json`
2. `npm run build` — rebuild `dist/`
3. `inject-cdn-version.js` — pin `channel_config_settings.js` to `@vX.Y.Z`
4. Git commit includes `package.json`, `CHANGELOG.md`, `channel_config_settings.js`, `billtube-fw.js`, and all `dist/*.bundle.js`
5. Git tag `vX.Y.Z` on that commit
6. `npm run purge-cdn` — invalidate jsDelivr cache for fw, config, bundles, and CSS (also runs via `.github/workflows/purge-cdn.yml` when `dist/` or `billtube-fw.js` change on `main`)

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
├── dist/                 # Built bundles (committed on release)
├── css/                  # Stylesheets (loaded from same ref as fw)
├── billtube-fw.js        # Loader + boot (must match release tag)
├── channel_config_settings.js  # CyTube channel snippet (pinned on release)
└── scripts/
    ├── build.js
    ├── verify-dist.js
    ├── inject-cdn-version.js
    └── purge-cdn.js
```

## Performance

- **Before:** ~33 sequential module loads (~1500–2000ms)
- **After:** 6 parallel bundle loads (~400–600ms)
