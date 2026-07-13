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

CI sets `HUSKY=0` during `npm ci` so install skips hook wiring; the workflow runs the same checks explicitly (`npm run lint:ci`, `typecheck`, `test`).

## Application code

- `modules/`, `lib/`, `src/`, `scripts/`, `test/` — ESM (`import` / `export`)
- CyTube channel modules loaded in-browser use the legacy `BTFW.define` script pattern unless noted in ESLint overrides
