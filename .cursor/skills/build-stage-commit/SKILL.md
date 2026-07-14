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
| `inject-cdn` | `npm run inject-cdn` | Rewrites `channel_config_settings.js` `CDN_BASE` to match `package.json` (`@v{version}`). **Release runs this on main** — not a pre-commit step for feature PRs. |
| `purge-cdn` | `npm run purge-cdn` | Purges jsDelivr cache **after** files exist at a git tag. CI only (`release.yml`, `purge-cdn.yml`) — never pre-commit. |

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
- [ ] 3. Skip version/CDN pin in feature PRs (release owns this on main)
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

Never stage secrets (`.env`, keys). Match recent commit style and **semantic-release types** (see below).

## Commit message types (semantic-release)

Source: `package.json` → `release.plugins` → `@semantic-release/commit-analyzer` (angular preset + custom `releaseRules`).

Pick the **type** from what the change does for **users/runtime**, not from file paths. Wrong types change the version bump on merge to `main`.

| Type | Version bump | Use when |
|------|--------------|----------|
| `feat` | **minor** | New user-facing capability, new module behavior viewers/mod owners notice |
| `fix` | **patch** | Bug fix (sync, playback, UI regression, broken channel JS) |
| `perf` | **patch** | Measurable performance improvement, no new feature |
| `refactor` | **patch** | Internal restructure, same external behavior |
| `build` | **patch** | Build pipeline, bundle tooling, `scripts/build.js`, dist wiring |
| `revert` | **patch** | Reverts a prior commit (`revert: "..."` body per angular) |
| `BREAKING CHANGE` / `feat!` | **major** | Breaking channel config, loader contract, or removed public API |
| `*(no-release)` | **none** | Docs-only, skill/rules, CI, tests-only, `.cursor/` — scope must be `no-release` |

Types **not** in `releaseRules` (`chore`, `docs`, `test`, `ci`, `style`) do **not** trigger a release by default. Prefer a releasing type above when the change should ship to CyTube channels.

### Type selection (before drafting)

```
User-visible bug fix?           → fix(scope):
New viewer/mod feature?         → feat(scope):
Faster/smaller, same behavior?  → perf(scope):
Same behavior, cleaner code?    → refactor(scope):
Build/dist/scripts only?        → build(scope):
Revert prior commit?            → revert(scope):
No release (docs/skills/CI)?    → chore(no-release): or type(no-release):
Breaking loader/channel API?    → feat(scope)!: … + BREAKING CHANGE footer
```

### Format

Angular conventional commits:

```
type(scope): imperative subject

Optional body — why, not what. Closes #NN when applicable.
```

- **scope**: short area (`sync`, `ui`, `player`, `dev`, `release`) — use `no-release` to skip versioning
- **subject**: ≤72 chars, imperative mood, no trailing period
- **footer**: `BREAKING CHANGE: …` for major bumps; `Closes #64` to link issues

### Examples (aligned with release rules)

| Change | Message |
|--------|---------|
| Playback sync after channel JS | `fix(sync): hard reload player after layout (#64)` |
| New poll overlay behavior | `feat(ui): stack poll drawer above chat` |
| Bundle size / boot time | `perf(boot): collapse layout resize passes` |
| Extract sync helper, same behavior | `refactor(sync): split seekUntilSynced` |
| `scripts/build.js` / terser config | `build(bundle): update features bundle inputs` |
| Skill or wiki only | `chore(no-release): document semantic-release commit types` |
| Semantic-release on main (CI only) | `chore(release): 1.5.0 [skip ci]` — **do not use in feature PRs** |

Do **not** use `chore:` for bug fixes or features that should patch/minor bump — use `fix` / `feat` so semantic-release versions correctly.

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

### 3. Version and CDN pin — do NOT do this in feature PRs

**Default for feature/fix PRs:** do **not** bump `package.json` `version` and do **not** edit `channel_config_settings.js` `CDN_BASE`.

Semantic-release on merge to `main` will:

1. Compute the next version from commit types per `releaseRules` (`feat` → minor, `fix`/`perf`/`refactor`/`build` → patch, breaking → major; `*(no-release)` → skip)
2. Run `npm run build && node scripts/inject-cdn-version.js`
3. Commit `package.json`, `CHANGELOG.md`, `channel_config_settings.js`, and release assets
4. Create the git tag (e.g. `v1.1.0`)
5. CI runs `purge-cdn` after publish

**Why manual bumps break channels (#39 example):**

- PR pinned `@v1.0.8` and bumped `package.json` to `1.0.8`
- Merge `feat:` commit triggered semantic-release → **1.1.0** (minor, not patch)
- Tag `v1.0.8` was **never created** → CyTube channels still on `@v1.0.8` got **404s**
- `origin/main` has `@v1.1.0`; channels must paste/update config from main after release

**When local `inject-cdn` is optional:**

- Only if you intentionally bump `package.json` outside the release flow (rare) and need to sync `channel_config_settings.js` without hand-editing URLs
- If `CDN_BASE` already matches `package.json`, inject is a no-op

**After a release:** update CyTube channel settings with `channel_config_settings.js` from `main` (or set `CDN_BASE` to the new `@v{tag}`). Purge is handled by CI.

### 4. Stage

**Typical BillTube3-slim commit set** (include only what this change touched):

| Path | When |
|------|------|
| `src/modules/**` | Source logic changed |
| `css/**` | Styles changed |
| `dist/*.bundle.js` | After `npm run build` |
| `dist/billtube-fw.js`, `src/billtube-fw.ts` | Loader/manifest changed |
| `channel_config_settings.js` | Theme admin changes only — **not** CDN pin in feature PRs |
| `package.json` | Script/deps changes only — **not** `version` in feature PRs |
| `package-lock.json` | If present and deps changed |
| `.cursor/artifacts/**` | Only if user wants plan/docs in repo |

Do not stage unrelated WIP. Prefer explicit `git add <paths>` over `git add -A`.

Semantic-release release assets (reference): `package.json`, `CHANGELOG.md`, `channel_config_settings.js`, `dist/billtube-fw.js`, all `dist/*` bundles listed in `package.json` → `release.plugins` → `@semantic-release/git`.

### 5. Commit

**Required:** `--no-verify` (project policy until lint/hooks are fixed).

1. Classify the diff using **Commit message types** above — pick `fix`/`feat`/`perf`/etc., not generic `chore`, unless scope is `no-release`.
2. Draft subject + body; add `Closes #NN` or `BREAKING CHANGE:` when applicable.
3. Commit:

```bash
git commit --no-verify -m "$(cat <<'EOF'
type(scope): short subject

Optional body: why, not what. Closes #NN if applicable.
EOF
)"
```

PowerShell (no HEREDOC):

```powershell
git commit --no-verify -m "fix(sync): hard reload player after layout" -m "Closes #64"
```

Do **not** use `chore(release):` or version bumps in feature PRs — release CI owns that on `main`.

### 6. Confirm

```bash
git status
```

Report commit hash and summary. Do **not** push unless the user asked.

## Quick paths

**CSS/modules only (typical feature PR):**

```bash
npm run build
git add src/ css/ dist/
git commit --no-verify -m "fix(sync): ..."   # or feat/perf per release table
```

Do **not** include `package.json` version or `channel_config_settings.js` CDN pin changes.

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
