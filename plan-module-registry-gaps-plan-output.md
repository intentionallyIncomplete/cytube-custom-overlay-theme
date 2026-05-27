# Plan — module registry gaps
**Date:** 2026-05-26
**Discovery Source:** discovery-module-registry-gaps-discovery-output.md
**Status:** Approved

---

## Objective
Ship `util:motion` in production bundles and add unit tests for `BTFW.define` / `BTFW.init` so missing modules and boot ordering regressions are caught before release.

---

## Scope
### In Scope
- Prepend `modules/util-motion.js` to `core` bundle in `scripts/build.js`
- Rebuild `dist/*.bundle.js`
- New tests for `define` and `init` in `billtube-fw.js` (extract or test via harness)
- Optional early `BTFW.init("util:motion")` in boot sequence

### Out of Scope
- Legacy `core`/`bridge` deps on overlays modules
- Dev-only `feature:audioEnhancer`
- Renaming existing module IDs

---

## Implementation Phases

### Phase 1 — Bundle util:motion
**Goal:** `util:motion` is defined when any production bundle that calls `init("util:motion")` loads.
**Files affected:**
- `scripts/build.js` — add `modules/util-motion.js` as first file in `core` bundle

**Steps:**
1. Insert `modules/util-motion.js` at index 0 of `core.modules`.
2. Run `npm run build` and verify `dist/core.bundle.js` contains `util:motion` define.

**Acceptance criteria:** Production load path defines `util:motion` before chat/features bundles execute factories that call `init("util:motion")`.

### Phase 2 — Module loader tests
**Goal:** Automated coverage for registry failure modes (Class B from discovery).
**Files affected:**
- `billtube-fw.js` — source of `define` / `init` (may extract to testable module)
- New test file (framework TBD)

**Acceptance criteria:** Tests pass for all branches in Write New Tests table.

---

## Write New Tests

### Tests Required
| Test Name | Method Under Test | Branch / Condition to Exercise |
|-----------|------------------|-------------------------------|
| init throws when module missing | init | `Registry[moduleName]` is falsy — throws `Module not found` |
| init returns cached instance | init | `module.instance` is already set — returns without re-running factory |
| init resolves dependencies first | init | `module.instance` is null and `module.deps.length > 0` — calls `init` for each dep before factory |
| init runs factory when ready | init | `module.instance` is null and deps satisfied — assigns and returns factory result |
| define registers module | define | valid `moduleName` — stores entry in `Registry` with deps and factory |

---

## Open Questions Resolved
- Bundle placement: `core` bundle first file (per discovery recommendation).

## Open Questions Remaining
- [ ] Explicit boot `init("util:motion")` before `feature:layout`?
- [ ] Extract loader from IIFE for isolated unit tests vs. DOM harness?

---

## Risks
- Bundle order — `util:motion` must load before any bundle that inits it at parse/factory time — mitigated by core bundle loading first in `billtube-fw.js`.
