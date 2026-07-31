All credit for the original project goes to https://github.com/BillTube and the original project: https://github.com/BillTube/BillTube3/tree/main

# Billtube3/Quiglytube-slim

Modular UI enhancement framework for [CyTube](https://cytu.be) channels. BillTube/Quiglytube replaces the default layout with a glass-style sidebar, theme tooling, movie requests, GIF search, polls, and other viewer-facing features—loaded as a small set of bundles from jsDelivr or a local dev server.

## What it does

- **Layout & theme** — Resizable chat column, glass panels, per-user color/font presets in Theme Settings
- **Chat** — Markdown-style filters, inline GIFs (Giphy and KLIPY), hover magnify for emotes, media handling
- **Player & playlist** — Audio boost, subtitles, movie info, queue tools
- **Movie requests** — TMDB search, suggestion history, chat announcements (via Cloudflare worker)
- **Mods** — Theme admin toolkit, MOTD/poll headers, channel branding

BillTube is not a standalone app. It runs inside a CyTube channel as Custom JavaScript plus CSS loaded from a CDN pin (`@vX.Y.Z`).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (for build and local dev)
- A CyTube channel where you can edit **Channel Settings → Admin -> External Javascript** (loads over CDN)
- Optional: local CyTube instance ([sync](https://github.com/intentionallyIncomplete/sync) Docker stack) for HTTP dev without mixed-content issues

## Quick start (channel operator)

1. Copy the latest release version number from the [latest release](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/releases).
2. In CyTube → **Channel Settings → Admin -> External Javascript**, paste the following CDN URL: https://cdn.jsdelivr.net/gh/IntentionallyIncomplete/cytube-custom-overlay-theme@latest/channel_config_settings.js
3. Import chat filters (Channel Settings → Chat → Filters).

## Local development

```bash
git clone https://github.com/intentionallyIncomplete/BillTube3-slim.git
cd cytube-custom-overlay-theme
npm install
npm run build
```

`npm run build` writes production bundles to `dist/` and copies the channel config template to the repo root.

| Command | Purpose |
|---------|---------|
| `npm run build` | Production bundles → `dist/` |
| `npm run test` | Unit tests |
| `npm run verify-dist` | Check required bundles exist |
| `npm run test:e2e` | Playwright suite (starts `scripts/e2e-server.js`) |

Maintainer-local watch/serve helpers (`scripts/dev.js`, `dev-server.js`, `generate-dev-channel.js`) are gitignored and not in public clones — see [scripts/README.md](scripts/README.md).

### Wire CyTube to localhost

1. Build assets: `npm run build`
2. Serve `dist/` (and related paths) from a local static server on `http://127.0.0.1:3000`, or use a maintainer-local `scripts/dev.js` if you have one
3. Start local CyTube (see `sync/docker/README.md` in the CyTube repo)
4. Channel Settings → **Javascript** → paste a local channel snippet that points `BASE` at your server → Save

Use the **Javascript** tab, not External Javascript—CyTube requires `https://` for external URLs. Local CyTube on `http://localhost:8080` avoids mixed-content blocks.

Console should show something like: `[BTFW] BASE: http://127.0.0.1:3000`

## Backend worker (movies & GIFs)

Movie search, suggestion storage, Giphy, and KLIPY traffic go through the Cloudflare **movies-storage** worker so API keys never ship in channel JavaScript.

```bash
cd src/workers/movies-storage
npm install
npx wrangler secret put TMDB_API_KEY
npx wrangler secret put GIPHY_API_KEY
npx wrangler secret put KLIPY_APP_KEY
npm run deploy
```

See [src/workers/movies-storage/README.md](src/workers/movies-storage/README.md) for routes and verification curls.

## Project layout

```
src/
├── lib/            # Shared helpers (imported by modules + tests)
├── modules/        # BTFW feature modules (bundled into dist/)
├── config/         # Authored channel snippet + user-release-notes.json
├── styles/         # Authored SCSS (source of truth)
├── assets/         # Authored branding SVGs (KLIPY, theme icons, monkey paw)
├── workers/        # Cloudflare workers (movies-storage, vidprox)
└── billtube-fw.ts  # Loader source → dist/billtube-fw.js
dist/               # Built JS bundles + dist/css/ (gitignored on main)
tests/              # unit/ + e2e/ + fixtures/ + test-results/ (Playwright)
scripts/            # Shared build / verify / release tooling (see scripts/README.md)
channel_config_settings.js   # Generated CyTube/jsDelivr pin (from src/config/; do not hand-edit)
```

Root folder ownership (source / generated / tests / tooling), keep/move/merge decisions, and the post-epic target tree are documented in [ROOT_OWNERSHIP.md](ROOT_OWNERSHIP.md) (issue #207 / epic #206).

Build, release, and jsDelivr pinning are documented in [BUILD.md](BUILD.md).

## License

MIT — see [LICENSE](LICENSE).
