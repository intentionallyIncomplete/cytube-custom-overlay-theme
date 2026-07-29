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
| `assets/` | source | **move** | `src/assets/` | #209 |
| `dev/` | local-ephemera | keep | `dev/` | — |
| `dist/` | generated | keep | `dist/` (includes `dist/css/`) | #208 done |
| `e2e/` | tests | **merge** | `tests/e2e/` | #210 |
| `node_modules/` | deps | keep | `node_modules/` | — |
| `scripts/` | tooling | keep (tighten) | `scripts/` | #212 |
| `src/` | source | keep | `src/` (includes `src/styles/`) | #208 done |
| `test/` | tests | **merge** | `tests/unit/` | #210 |
| `test-results/` | local-ephemera | keep | `test-results/` | — |

### Completed relocations (#208)

| Former path | Ownership | Now |
|-------------|-----------|-----|
| `scss/` | source | `src/styles/` |
| `css/` | generated | `dist/css/` |

Leftover root `scss/` / `css/` dirs (if any) are ignored by the ownership audit contract.

## One-off / ambiguous folders

| Path | Why ambiguous | Resolution |
|------|---------------|------------|
| `assets/` | Source branding at root, parallel to `src/` | #209: → `src/assets/` |
| `test/` + `e2e/` | Two test roots split by runner | #210: → `tests/unit/` + `tests/e2e/` |
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
├── tests/            # tests — unit/ + e2e/
└── [root configs]    # package.json, tsconfig*, Playwright, lint, README, BUILD.md
```

Local-only (gitignored, not part of the public layout contract): `.cursor/`, `dev/`, `node_modules/`, `test-results/`, `coverage/`, Playwright report caches.

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

## Progress (#208)

- [x] Authored styles live under `src/styles/`
- [x] Generated CSS ships only under `dist/css/`
- [x] Build, CDN, CI, and docs paths updated

Remaining physical moves: #209–#212.
