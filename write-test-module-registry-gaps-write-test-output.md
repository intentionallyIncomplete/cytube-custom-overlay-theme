# Write-Test Output — module registry gaps
**Date:** 2026-05-26
**Plan Source:** plan-module-registry-gaps-plan-output.md
**Method Map Source:** map-methods-module-registry-gaps-output.md
**Test Map Source:** plan-module-registry-gaps-test-map.md
**Status:** Complete

---

## Tests Written

| Test Name | File | Method Under Test | Branch Condition | Status |
|-----------|------|------------------|-----------------|--------|
| init throws when module missing | test/btfw-registry.test.js | init | Registry miss → throw | ✅ Written |
| init returns cached instance | test/btfw-registry.test.js | init | cached instance short-circuit | ✅ Written |
| init resolves dependencies first | test/btfw-registry.test.js | init | deps loop before factory | ✅ Written |
| init runs factory when ready | test/btfw-registry.test.js | init | leaf factory execution | ✅ Written |
| define registers module | test/btfw-registry.test.js | define | Registry entry created | ✅ Written |

---

## Files Modified
- `lib/btfw-registry.js` — extracted `createBtfwRegistry` (source for loader + tests)
- `src/billtube-fw.js` — loader entry (replaces inline registry in `billtube-fw.js`)
- `test/btfw-registry.test.js` — 5 tests added
- `scripts/build.js` — `util-motion` in core bundle; esbuild `billtube-fw.js`
- `scripts/verify-dist.js` — asserts `util:motion` in core bundle
- `package.json` — `"test": "node --test test/**/*.test.js"`

---

## Skipped / Deferred
- None

---

## Recommended Next Step
Run `npm run build && npm test` locally (shell hook blocked in agent session). Then `/verify`.
