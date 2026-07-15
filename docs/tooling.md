# Tooling and config conventions

The repo root is ESM (`"type": "module"` in `package.json`). Tooling configs follow one of these formats:

| Format | Use for |
|--------|---------|
| ESM `*.config.js` with `export default` | ESLint, Stylelint, Commitlint, lint-staged |
| JSON | `tsconfig.json`, `package.json` metadata |
| `*.cjs` | CommonJS only when a tool cannot load ESM (suffix makes intent explicit) |
| Shell in `.husky/*` | Git hooks (not Node modules) |

## Config files

- `eslint.config.js` — ESLint 9 flat config
- `stylelint.config.js` — Stylelint 16 flat config
- `commitlint.config.js` — Commit message rules (conventional commits)
- `lint-staged.config.js` — Pre-commit staged file checks

Do not add new `.eslintrc.*`, `.stylelintrc.*`, or inline `lint-staged` blocks in `package.json`.

## Git hooks (Husky)

- `package.json` → `"prepare": "husky"` (Husky 9+)
- Hooks live in `.husky/` without sourcing `_/husky.sh`
- **pre-commit** — `lint-staged`
- **commit-msg** — `commitlint`

CI sets `HUSKY=0` during `npm ci` so install skips hook wiring; the workflow runs the same checks explicitly (`npm run lint:ci`, `typecheck`, `test`, `build`, Playwright E2E).

Release workflow (`.github/workflows/release.yml`) runs after CI on `main` only when `verify`, `e2e`, and `ci-gate` succeed; it downloads the `build-output` artifact and sets `SKIP_BUILD=1` so semantic-release does not rebuild. Post-publish: `purge-cdn` then `verify:cdn`. See [BUILD.md](../BUILD.md#release-pipeline).

## Build outputs

- Generated `dist/`, `css/`, `channel_config_settings.js`, and `src/modules/user-release-notes.generated.js` are gitignored on `main`.
- Release tags include built assets via `@semantic-release/git` for jsDelivr (`@vX.Y.Z`).

## Application code

- `src/modules/`, `src/lib/`, `src/`, `scripts/`, `test/` — ESM (`import` / `export`)
- CyTube channel modules loaded in-browser use the legacy `BTFW.define` script pattern unless noted in ESLint overrides
