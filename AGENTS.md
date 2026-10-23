# AGENTS.md — cytube-custom-overlay-theme (BillTube3-slim)

Guidance for AI coding agents working in this repository.

## What this is

Modular UI enhancement framework for CyTube (cytu.be) channels. TypeScript +
SCSS source in `src/`, bundled by esbuild/dart-sass into `dist/`, shipped to
viewers via jsDelivr CDN pins (`@vX.Y.Z`). Loaded into a channel as Custom
JavaScript — not a standalone app.

## Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Build (JS + CSS) | `npm run build` |
| Lint (eslint + stylelint) | `npm run lint` |
| Typecheck (two tsconfigs) | `npm run typecheck` |
| Unit tests (node:test + vitest) | `npm run test` |
| E2E (Playwright) | `npm run test:e2e` |
| Full CI-equivalent gate | `npm run release:verify` |

Run the relevant gates before claiming done: at minimum `lint` +
`typecheck`, plus tests for touched code.

## Layout

- `src/billtube-fw.ts` — loader; derives asset BASE from its own script URL
- `src/modules/` — feature modules (`feature-*.js`) and shared utils
  (`util-*.js`); build inputs for the 6 dist bundles (core, chat, player,
  playlist, admin, features)
- `src/lib/` — shared helpers (imported by modules + tests)
- `src/styles/` — SCSS source of truth; entry files without `_` prefix
  compile to `dist/css/<name>.css`; shared partials in `partials/_*.scss`
- `src/config/` — authored channel config template + user-release-notes.json
- `src/workers/` — Cloudflare workers (movies-storage, vidprox)
- `tests/` — unit/, e2e/, fixtures/
- `scripts/` — build/verify/release tooling (see scripts/README.md)

## Cloudflare workers

This project manages three Cloudflare Workers:

- `src/workers/movies-storage/` — TMDB search, suggestion history (KV),
  Giphy/KLIPY proxies, Letterboxd metadata. Secrets via
  `npx wrangler secret put` (TMDB_API_KEY, GIPHY_API_KEY, KLIPY_APP_KEY);
  never in client code. Routes in its README.md.
- `src/workers/vidprox/` — CORS video proxy fallback for audio boost when
  media hosts lack CORS headers. Requires `global_fetch_strictly_public`
  in wrangler.jsonc (same-zone upstreams fail with error 1042 otherwise).
- **Google Drive index worker (GDI-JS)** — `src/workers/index-worker/`,
  Cloudflare Worker name `quiglysmovies`. It indexes the owner's Google
  Drive files for playback in CyTube. Secrets are Worker bindings read
  from `env` (`GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`,
  `CRYPTO_BASE_KEY`, `HMAC_BASE_KEY`): never commit secret values.
  `../index-worker/worker.js` is the previous copy and still contains
  live secrets — never commit it or paste its contents into PRs, issues,
  or chats. Related read-only: `sync/gdrive-userscript/` generates the
  CyTube Google Drive userscript.

Deploy pattern: `cd <worker dir> && npm install && npm run deploy`.
For the index worker, fill gitignored `.dev.vars` from `.dev.vars.example`
first. The deploy script already passes `--secrets-file .dev.vars`.
Do not append that flag through `npm run`; npm consumes `--secrets-file`
and Wrangler then treats the filename as the Worker entry point.

## Hard rules

- **Never hand-edit `dist/`** (including `dist/css/`) — build output,
  overwritten by `npm run build`. `dist/` is gitignored on main; release
  tags include it for jsDelivr.
- **Root `channel_config_settings.js` is GENERATED** (from `src/config/` by
  `scripts/inject-cdn-version.js`). Edit only `src/config/`.
- `src/styles/` is the only place styles change. Plain CSS only at runtime —
  SCSS compiles away before shipping.
- **Conventional commits required** (commitlint + husky wired). semantic-
  release mapping: `feat`→minor, `fix`/`perf`/`refactor`/`build`/`revert`→
  patch, `BREAKING CHANGE`→major, `chore`/`docs`/`test`/`ci`→no release.
- No API keys or secrets in client/channel code; worker secrets go through
  `wrangler secret` (src/workers/movies-storage).
- Before user-facing releases, update `src/config/user-release-notes.json`
  so Options → User Preferences → General → Recent Updates stays current.

## Local dev / testing

1. **Start the local CyTube server first.** Verify the `sync` Docker stack is
   up before anything else: `docker ps` must show the sync containers
   running (start them from the `sync` repo's Docker setup if not — see
   `sync/docker/README.md`). The `sync` repo is a READ-ONLY clone of a
   third-party repo — do not modify it except when strictly necessary for
   the Docker setup.
2. Start the theme dev server: `npm run e2e:server` (serves the fixture
   static server used by Playwright and local testing).
3. Serve/point `BASE` at the server (External JS requires `https://`; inline
   channel JS is the local-dev path).
4. Console should log `[BTFW] BASE: http://<LAN-IP>:3000`

## Agent task guidance

Check `.cursor/rules/` and `.cursor/skills/` at the repo root and read every
rule/skill relevant to the task — they guide agents through this codebase.
These folders are maintainer-local (gitignored); if absent in your clone,
use the `.agents/skills/` fallback.

**Always operate under these two skills** (read them before task work and
follow their instructions throughout):

- `.agents/skills/codebase-onboarding/` — run its workflow when first
  working in this repo or when asked to onboard/update CLAUDE.md; it
  enhances, never replaces, the existing CLAUDE.md.
- `.agents/skills/codebase-design/` — apply its deep-module vocabulary and
  principles to every design, refactor, or interface decision.

## References

- BUILD.md — build system, release pipeline, CDN pinning, rollback
- ROOT_OWNERSHIP.md — which root files are source vs generated
- README.md — features, quick start, project layout
