# Method Map — Module Registry Gaps

**Source Plan:** plan-module-registry-gaps-plan-output.md  
**Date:** 2026-05-26

---

## Method: init

**File:** `billtube-fw.js`

**Full Signature:**
```javascript
async function init(moduleName) {
  var module = Registry[moduleName];
  if (!module) {
    throw new Error("Module not found: " + moduleName);
  }
  if (module.instance) {
    return module.instance;
  }

  for (var i = 0; i < module.deps.length; i++) {
    await init(module.deps[i]);
  }

  module.instance = await module.factory({ define, init, DEV_CDN });
  return module.instance;
}
```

**Status:** Found

---

### Branch: module missing (throw)
**Condition:** `Registry[moduleName]` is falsy — throws `Module not found`

**Direct Dependencies:**
| Called Method | Location | Purpose in this branch |
|---------------|----------|------------------------|
| N/A | N/A | Branch immediately throws; no direct calls |

**Parameter Analysis:**
| Parameter | Type | Required for this branch? | Reason |
|-----------|------|--------------------------|--------|
| moduleName | string | ✅ Required | Used in Registry lookup and error message |

---

### Branch: cached instance return
**Condition:** `module.instance` is already set — returns without re-running factory

**Direct Dependencies:**
| Called Method | Location | Purpose in this branch |
|---------------|----------|------------------------|
| N/A | N/A | Branch returns early; no direct calls |

**Parameter Analysis:**
| Parameter | Type | Required for this branch? | Reason |
|-----------|------|--------------------------|--------|
| moduleName | string | ✅ Required | Used to retrieve module from Registry (line 24) |

---

### Branch: deps resolution loop
**Condition:** `module.instance` is null and `module.deps.length > 0` — calls `init` for each dep before factory

**Direct Dependencies:**
| Called Method | Location | Purpose in this branch |
|---------------|----------|------------------------|
| init | billtube-fw.js (line 33) | Recursive call to initialize each dependency in `module.deps[i]` |

**Parameter Analysis:**
| Parameter | Type | Required for this branch? | Reason |
|-----------|------|--------------------------|--------|
| moduleName | string | ✅ Required | Used to retrieve module from Registry (line 24); branch condition checks `module.deps.length` |

---

### Branch: factory execution
**Condition:** `module.instance` is null and deps satisfied — assigns and returns factory result

**Direct Dependencies:**
| Called Method | Location | Purpose in this branch |
|---------------|----------|------------------------|
| module.factory() | billtube-fw.js (line 36) | Function property of module object; receives `{ define, init, DEV_CDN }` context |

**Parameter Analysis:**
| Parameter | Type | Required for this branch? | Reason |
|-----------|------|--------------------------|--------|
| moduleName | string | ✅ Required | Used to retrieve module from Registry (line 24) |

---

## Method: define

**File:** `billtube-fw.js`

**Full Signature:**
```javascript
function define(moduleName, moduleDeps, functionFactory) {
  Registry[moduleName] = {
    deps: moduleDeps || [],
    factory: functionFactory,
    instance: null
  };
}
```

**Status:** Found

---

### Branch: registers module in Registry
**Condition:** valid `moduleName` — stores entry in `Registry` with deps and factory

**Direct Dependencies:**
| Called Method | Location | Purpose in this branch |
|---------------|----------|------------------------|
| N/A | N/A | No method calls; direct Registry object assignment |

**Parameter Analysis:**
| Parameter | Type | Required for this branch? | Reason |
|-----------|------|--------------------------|--------|
| moduleName | string | ✅ Required | Used as Registry key (line 17) |
| moduleDeps | array (or falsy) | ✅ Required | Used in branch condition `moduleDeps \|\| []` (line 18) |
| functionFactory | function | ✅ Required | Stored in Registry entry (line 19); executed by init |

---

## Skipped Methods

None. All methods listed in the plan's "Write New Tests" table were found in source.

---

## Recommended Next Step

Pass this file to `/filter-methods` to produce the minimum-parameter test map.
