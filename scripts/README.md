# scripts/

Shared project tooling for build, verify, release, CDN, and ownership audits.

This directory is **not** for one-off tasks. Prefer an npm script or an inline shell step in CI when the work is a single trivial command. Keep a file here only when it is reused, non-trivial, or needs cross-platform logic.

Home decision (epic [#206](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/206) / [#212](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/212)): keep `scripts/` — do not introduce a parallel `tools/` tree.

## Retained scripts

| File | Purpose | Entry points |
|------|---------|--------------|
| `build.js` | Production JS build (esbuild bundles + loader), channel config copy, release-notes codegen; runs CSS build and `verify-dist` | `npm run build`, `npm run build:js` |
| `build-css.js` | Compile `src/styles/*.scss` → `dist/css/`; exports `buildCss` / `verifyCss` for other scripts | `npm run build:css`; imported by `build.js`, `verify-dist.js` |
| `build-options.js` | Shared esbuild options + bundle banner (library module, not a CLI) | Imported by `build.js` |
| `verify-dist.js` | Assert required `dist/` JS + CSS artifacts exist | `npm run verify-dist`; CI release; spawned by `build.js` / `prepare-release.js` |
| `inject-cdn-version.js` | Pin root `channel_config_settings.js` to `v${version}` (optional `--commit`) | `npm run inject-cdn`; called by `prepare-release.js` |
| `prepare-release.js` | Release orchestrator: build or reuse CI artifacts (`SKIP_BUILD`), then inject CDN pin | `npm run prepare:release`; semantic-release `prepareCmd` |
| `purge-cdn.js` | Purge jsDelivr cache for every shipped CDN path | `npm run purge-cdn`; release / purge workflows |
| `verify-cdn-deploy.js` | Retried fetch + content/pin checks against jsDelivr `@vX.Y.Z` | `npm run verify:cdn` |
| `e2e-server.js` | Static HTTP server for Playwright fixtures (`127.0.0.1:3099`) | `npm run e2e:server`; `playwright.config.js` |
| `root-ownership.ts` | Typed root ownership catalog for epic #206 | Vitest (`tests/unit/root-ownership.vitest.ts`); `tsconfig.strict-tools.json` |

## Local-only helpers (gitignored)

These files are **not** in the public tree ([#200](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/200)). Maintainers may keep private copies locally; they stay gitignored and are **not** wired as public npm scripts:

- `scripts/dev.js` — watch build + local static server
- `scripts/dev-server.js` — static server only
- `scripts/generate-dev-channel.js` — regenerate `dev/channel-settings.js`

Public clones should use `npm run build` (and E2E via `npm run test:e2e`) without those helpers. Run a local copy directly with `node scripts/dev.js` when present.

## Generated / ignored under `scripts/`

- `scripts/.entries/` — esbuild entry stubs (gitignored)
- `scripts/bundles/` — gitignored build scratch
