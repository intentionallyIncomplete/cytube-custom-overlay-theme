---
name: build-stage-commit
description: Builds BillTube3-slim bundles, stages the right artifacts, and creates git commits. Use when the user asks to build, stage, commit, ship changes, bump the CDN pin, or prepare a commit after implementation. Requires --no-verify until repo lint debt is fixed.
---

# Build, Stage, Commit (BillTube3-slim)

## When to use

- User explicitly asks to commit, build for commit, or stage release artifacts
- After UI/module/CSS work that affects runtime bundles or `channel_config_settings.js`
- Do **not** commit unless the user asked (see project git rules)

## npm scripts (from `package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `npm run build` | `node scripts/build.js` → updates `dist/*.bundle.js` |
| `verify-dist` | `npm run verify-dist` | Sanity-check dist output |
| `test` | `npm test` | `node --test test/**/*.test.js` |
| `inject-cdn` | `npm run inject-cdn` | Pins `channel_config_settings.js` `CDN_BASE` to `package.json` version (`@v{version}`) |
| `purge-cdn` | `npm run purge-cdn` | CDN cache purge (release ops; not every commit) |

There is no `lint:js` script in `package.json`; Husky runs `lint-staged` on commit (eslint on `.js`, `.css`, `.md`, `.json`).

## Pre-commit hooks (why `--no-verify`)

Husky (`.husky/`):

- **pre-commit:** `npm run lint-staged && npm run build:watch` (`build:watch` is not defined in `package.json` — hook may fail)
- **commit-msg:** `commitlint` (conventional commits)

The repo currently has widespread lint/syntax issues. **Every commit in this project must use `--no-verify`** until hooks pass cleanly. Do not drop `--no-verify` without user approval.

When lint debt is cleared, remove this requirement and use normal hooks.

## Workflow

Copy and track:

```
- [ ] 1. Review changes (status + diff)
- [ ] 2. Build (+ verify / test as appropriate)
- [ ] 3. CDN inject (if version bump)
- [ ] 4. Stage intentional files only
- [ ] 5. Commit with --no-verify
- [ ] 6. Post-commit status
```

### 1. Review

Run in parallel:

```bash
git status
git diff
git log -3 --oneline
```

Never stage secrets (`.env`, keys). Match recent commit style (conventional: `feat:`, `fix:`, `chore:`).

### 2. Build

**Always** when `modules/`, `css/`, or loader entrypoints changed:

```bash
npm run build
```

Optional but recommended before commit:

```bash
npm run verify-dist
npm test
```

If build fails, fix or report — do not commit broken `dist/` bundles.

### 3. CDN pin (version bumps only)

When `package.json` `version` changed (or plan requires CDN bump):

1. Bump `version` in `package.json` (patch/minor per change scope)
2. Run:

```bash
npm run inject-cdn
```

This rewrites `channel_config_settings.js` `CDN_BASE` to `...@v{version}`.

Release pipeline also runs `build` + `inject-cdn` in semantic-release `prepareCmd`; manual commits should mirror that for channel-facing changes.

### 4. Stage

**Typical BillTube3-slim commit set** (include only what this change touched):

| Path | When |
|------|------|
| `modules/**` | Source logic changed |
| `css/**` | Styles changed |
| `dist/*.bundle.js` | After `npm run build` |
| `billtube-fw.js`, `src/billtube-fw.js` | Loader/manifest changed |
| `channel_config_settings.js` | Theme admin and/or CDN pin |
| `package.json` | Version or script changes |
| `package-lock.json` | If present and deps changed |
| `.cursor/artifacts/**` | Only if user wants plan/docs in repo |

Do not stage unrelated WIP. Prefer explicit `git add <paths>` over `git add -A`.

Semantic-release release assets (reference): `package.json`, `CHANGELOG.md`, `channel_config_settings.js`, `billtube-fw.js`, all `dist/*` bundles listed in `package.json` → `release.plugins` → `@semantic-release/git`.

### 5. Commit

**Required:** `--no-verify` (project policy until lint/hooks are fixed).

Use a HEREDOC for the message (PowerShell: use a here-string or `-m` with a single quoted multi-line string):

```bash
git commit --no-verify -m "$(cat <<'EOF'
type(scope): short subject

Optional body: why, not what. Issue #NN if applicable.
EOF
)"
```

Examples:

- `feat(ui): minimal footer and 4px radius tokens (#39)`
- `chore(release): bump CDN pin to v1.0.8`

### 6. Confirm

```bash
git status
```

Report commit hash and summary. Do **not** push unless the user asked.

## Quick paths

**CSS/modules only (no version bump):**

```bash
npm run build
git add modules/ css/ dist/
git commit --no-verify -m "fix(ui): ..."
```

**Release-style (version + CDN):**

```bash
# edit package.json version first
npm run build
npm run inject-cdn
git add package.json channel_config_settings.js dist/ modules/ css/ billtube-fw.js
git commit --no-verify -m "chore(release): ..."
```

## Guardrails

- Only commit when the user requested it
- Never `git push --force` to `main` without explicit approval
- Never amend unless user asked and HEAD is unpushed local work
- Never skip `--no-verify` in this repo until the user says hooks are fixed
- If commit still fails without hooks, diagnose (GPG, permissions) — do not remove `--no-verify` as the first fix

## Future cleanup

When eslint/stylelint and Husky pre-commit pass:

1. Fix or replace `.husky/pre-commit` (`build:watch` → `npm run build` or drop watch)
2. Remove the mandatory `--no-verify` note from this skill
3. Use conventional commits without `--no-verify` so commitlint runs
