# Root directory ownership map

Audit deliverable for [#207](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/207) under epic [#206](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/206).

Machine-readable source of truth: [`scripts/root-ownership.ts`](scripts/root-ownership.ts).  
Guarded by Vitest: `npm run test:vitest`.

## Ownership labels

| Label | Meaning |
|-------|---------|
| `source` | Authored code or assets edited by humans |
| `generated` | Build/release output (often gitignored on `main`, tagged for jsDelivr) |
| `tests` | Automated tests and fixtures |
| `tooling` | CI, hooks, build/release scripts |
| `deps` | Package manager install trees |
| `local-ephemera` | Local/IDE/runtime scratch; gitignored |

## Current root directories

| Path | Ownership | Decision | Destination (post-epic) | Follow-up |
|------|-----------|----------|-------------------------|-----------|
| `.cursor/` | local-ephemera | keep | `.cursor/` | — |
| `.github/` | tooling | keep | `.github/` | — |
| `.husky/` | tooling | keep | `.husky/` | — |
| `dev/` | local-ephemera | keep | `dev/` | — |
| `dist/` | generated | keep | `dist/` (includes `dist/css/`) | #208 done |
| `node_modules/` | deps | keep | `node_modules/` | — |
| `scripts/` | tooling | keep (tighten) | `scripts/` | #212 |
| `src/` | source | keep | `src/` (styles + assets) | #208/#209 done |
| `tests/` | tests | keep | `tests/` (`unit/` + `e2e/` + `fixtures/` + `test-results/`) | #210 done |

### Completed relocations

| Former path | Ownership | Now | Issue |
|-------------|-----------|-----|-------|
| `scss/` | source | `src/styles/` | #208 |
| `css/` | generated | `dist/css/` | #208 |
| `assets/` | source | `src/assets/` | #209 |
| `test/` | tests | `tests/unit/` | #210 |
| `e2e/` | tests | `tests/e2e/` + `tests/fixtures/` | #210 |
| `test-results/` | local-ephemera | `tests/test-results/` | #210 |

Leftover root `scss/` / `css/` / `assets/` / `test/` / `e2e/` / `test-results/` dirs (if any) are ignored by the ownership audit contract.

## One-off / ambiguous folders

| Path | Why ambiguous | Resolution |
|------|---------------|------------|
| `dev/` | Only exists for local channel snippets | Keep as gitignored local-ephemera |
| `scripts/` | Mix of shared release tooling and (gitignored) dev helpers | #212: keep shared scripts only |
| `channel_config_settings.js` (root file) | Generated runtime pin at repo root | #211: ownership behind `src/config/` |

## Target root layout (after epic #206)

```
cytube-custom-overlay-theme/
├── .github/          # tooling — CI / release
├── .husky/           # tooling — git hooks (local/public policy per #200)
├── dist/             # generated — JS bundles + css/
├── scripts/          # tooling — shared build/verify/release only
├── src/              # source — app, styles, assets, config, workers
├── tests/            # tests — unit/ + e2e/ + fixtures/ + test-results/
└── [root configs]    # package.json, tsconfig*, Playwright, lint, README, BUILD.md
```

Local-only (gitignored, not part of the public layout contract): `.cursor/`, `dev/`, `node_modules/`, `tests/test-results/`, `coverage/`, Playwright report caches.

## Notable root files (ownership, not directories)

| File | Ownership | Decision | Follow-up |
|------|-----------|----------|-----------|
| `channel_config_settings.js` | generated | move ownership / minimize root runtime | #211 |
| `package.json`, `tsconfig*.json`, `playwright.config.js`, `stylelint.config.js`, `vitest.config.ts` | tooling | keep at root | — |
| `README.md`, `BUILD.md`, `CHANGELOG.md`, `ROOT_OWNERSHIP.md` | tooling/docs | keep at root (`docs/` is gitignored) | — |

## Acceptance (#207)

- [x] Every root directory has an ownership label
- [x] Every root directory has a keep / move / merge / remove decision
- [x] Ambiguous one-offs have a proposed destination + owning follow-up issue
- [x] Target root layout is documented here and encoded in `TARGET_ROOT_LAYOUT`

## Progress (#208 / #209 / #210)

- [x] Authored styles live under `src/styles/`
- [x] Generated CSS ships only under `dist/css/`
- [x] Authored static assets live under `src/assets/` (ship in-tree; not generated)
- [x] Build, CDN, CI, and docs paths updated for styles + assets
- [x] Unit + e2e tests live under `tests/` (`unit/`, `e2e/`, `fixtures/`)
- [x] Playwright artifacts (including `.last-run.json`) live under `tests/test-results/`
- [x] Playwright / Node / Vitest / CI / docs paths updated for the unified tree

Remaining physical moves: #211–#212.
