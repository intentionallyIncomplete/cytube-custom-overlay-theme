# Test Map Output — module registry gaps
**Date:** 2026-05-26
**Method Map Source:** map-methods-module-registry-gaps-output.md
**Status:** Complete

---

## Test Case: init throws when module missing

**Method Under Test:** `init`
**File:** `billtube-fw.js`
**Branch / Condition:** `Registry[moduleName]` is falsy — throws `Module not found`
**Expected Outcome:** Throws `Error` with message `Module not found: {moduleName}`; no factory or recursive `init` runs.

**Minimum Parameter Set:**
| Parameter | Type | Value | Required? | Notes |
|-----------|------|-------|-----------|-------|
| moduleName | string | `"__missing__"` | ✅ Required | ID not present in `Registry` after test setup |

**Dependencies to Satisfy:**
| Dependency | Action Required |
|------------|----------------|
| Registry | Real empty registry (or ensure name was never `define`d) — branch only reads lookup |

---

## Test Case: init returns cached instance

**Method Under Test:** `init`
**File:** `billtube-fw.js`
**Branch / Condition:** `module.instance` is already set — returns without re-running factory
**Expected Outcome:** Returns existing `module.instance`; `module.factory` is not invoked.

**Minimum Parameter Set:**
| Parameter | Type | Value | Required? | Notes |
|-----------|------|-------|-----------|-------|
| moduleName | string | `"test:cached"` | ✅ Required | Must match a `Registry` entry with `instance` pre-set |

**Dependencies to Satisfy:**
| Dependency | Action Required |
|------------|----------------|
| define | Real — register module first, then set `Registry["test:cached"].instance` to a stub object before calling `init` |
| module.factory | Mock/spy — assert not called |

---

## Test Case: init resolves dependencies first

**Method Under Test:** `init`
**File:** `billtube-fw.js`
**Branch / Condition:** `module.instance` is null and `module.deps.length > 0` — calls `init` for each dep before factory
**Expected Outcome:** Recursive `init` called for each dep name in order; factory not run until deps complete.

**Minimum Parameter Set:**
| Parameter | Type | Value | Required? | Notes |
|-----------|------|-------|-----------|-------|
| moduleName | string | `"test:with-deps"` | ✅ Required | Entry must have `instance: null` and `deps: ["test:dep-a"]` (single dep sufficient) |

**Dependencies to Satisfy:**
| Dependency | Action Required |
|------------|----------------|
| define | Real — `define("test:dep-a", [], async () => ({}))` then `define("test:with-deps", ["test:dep-a"], async () => ({}))` |
| init (recursive) | Spy — verify called with `"test:dep-a"` before parent factory |

---

## Test Case: init runs factory when ready

**Method Under Test:** `init`
**File:** `billtube-fw.js`
**Branch / Condition:** `module.instance` is null and deps satisfied — assigns and returns factory result
**Expected Outcome:** `module.factory` invoked with `{ define, init, DEV_CDN }`; return value stored on `module.instance` and returned.

**Minimum Parameter Set:**
| Parameter | Type | Value | Required? | Notes |
|-----------|------|-------|-----------|-------|
| moduleName | string | `"test:leaf"` | ✅ Required | Entry with `deps: []` and `instance: null` |

**Dependencies to Satisfy:**
| Dependency | Action Required |
|------------|----------------|
| define | Real — `define("test:leaf", [], async () => ({ ok: true }))` |
| module.factory | Real minimal factory returning identifiable object — assert return value |

---

## Test Case: define registers module

**Method Under Test:** `define`
**File:** `billtube-fw.js`
**Branch / Condition:** valid `moduleName` — stores entry in `Registry` with deps and factory
**Expected Outcome:** `Registry[moduleName]` exists with `deps`, `factory`, and `instance: null`.

**Minimum Parameter Set:**
| Parameter | Type | Value | Required? | Notes |
|-----------|------|-------|-----------|-------|
| moduleName | string | `"test:defined"` | ✅ Required | Registry key |
| moduleDeps | array | `[]` | ✅ Required | Explicit empty array exercises `moduleDeps \|\| []` path |
| functionFactory | function | `async () => null` | ✅ Required | Stored on registry entry |

**Dependencies to Satisfy:**
| Dependency | Action Required |
|------------|----------------|
| Registry | Real — assert post-condition on `Registry` object after `define` |

---

## Skipped (Not Yet Implemented)

| Method | Branch | Reason |
|--------|--------|--------|
| — | — | None |

---

## Summary
| Total Test Cases | Ready to Write | Skipped |
|-----------------|---------------|---------|
| 5 | 5 | 0 |

---

## Recommended Next Step
Pass this file to `/write-test` to author the test methods.
