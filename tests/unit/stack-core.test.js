import { test, describe, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import {
  SKEY,
  MOTD_VISIBILITY_KEY,
  DOCKED_KEYS,
  GROUPS,
  saveStackOrder,
  loadStackOrder,
  getStoredVisibility,
  storeVisibility,
  getStoredDocked,
  storeDocked,
  isPanelInDrawer,
  applyStoredPanelOpenState
} from "../../src/lib/stack-core.js";

/** Minimal localStorage stub (node --test has no storage). */
function installStorageStub() {
  const map = new Map();
  globalThis.localStorage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
  return map;
}

function fakeEl({ bind = null, group = null, parent = null, closest = () => null } = {}) {
  return {
    dataset: { ...(bind ? { bind } : {}), ...(group ? { group } : {}) },
    parentElement: parent,
    closest
  };
}

describe("stack-core persistence", () => {
  let storage;

  beforeEach(() => {
    storage = installStorageStub();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  test("saveStackOrder serializes bind ids and group flags; loadStackOrder round-trips", () => {
    const list = fakeEl();
    list.children = [
      fakeEl({ bind: "motd-group", group: "true" }),
      fakeEl({ bind: "playlist-group", group: "true" })
    ];
    saveStackOrder(list);
    assert.deepEqual(loadStackOrder(), [
      { id: "motd-group", isGroup: true },
      { id: "playlist-group", isGroup: true }
    ]);
    assert.equal(storage.get(SKEY), JSON.stringify([
      { id: "motd-group", isGroup: true },
      { id: "playlist-group", isGroup: true }
    ]));
  });

  test("loadStackOrder returns [] for missing or corrupt storage", () => {
    assert.deepEqual(loadStackOrder(), []);
    storage.set(SKEY, "{not json");
    assert.deepEqual(loadStackOrder(), []);
  });

  test("visibility helpers round-trip and treat missing keys as null", () => {
    assert.equal(getStoredVisibility(MOTD_VISIBILITY_KEY), null);
    storeVisibility(MOTD_VISIBILITY_KEY, false);
    assert.equal(getStoredVisibility(MOTD_VISIBILITY_KEY), false);
    storeVisibility(MOTD_VISIBILITY_KEY, true);
    assert.equal(getStoredVisibility(MOTD_VISIBILITY_KEY), true);
  });

  test("getStoredDocked falls back to legacy -hidden key", () => {
    assert.equal(getStoredDocked(DOCKED_KEYS["poll-group"]), false);
    storage.set("btfw-stack-poll-hidden", "true");
    assert.equal(getStoredDocked(DOCKED_KEYS["poll-group"]), true);
    storeDocked(DOCKED_KEYS["poll-group"], false);
    assert.equal(getStoredDocked(DOCKED_KEYS["poll-group"]), false);
  });

  test("group registry matches the three stack domains", () => {
    assert.deepEqual(GROUPS.map((g) => g.id), ["motd-group", "playlist-group", "poll-group"]);
    assert.deepEqual(
      GROUPS.map((g) => g.priority),
      [1, 2, 3]
    );
  });
});

describe("stack-core panel state", () => {
  beforeEach(() => {
    installStorageStub();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  test("isPanelInDrawer detects drawer host via closest()", () => {
    assert.equal(isPanelInDrawer(null), false);
    assert.equal(isPanelInDrawer(fakeEl()), false);
    assert.equal(
      isPanelInDrawer(fakeEl({ closest: (sel) => (sel === ".btfw-panel-container__host" ? {} : null) })),
      true
    );
  });

  test("applyStoredPanelOpenState uses stored value through getDefaultOpen", () => {
    storeVisibility(MOTD_VISIBILITY_KEY, false);
    const wrapper = fakeEl();
    let seen;
    wrapper._btfwSetOpenState = (open) => {
      seen = open;
    };
    applyStoredPanelOpenState(wrapper, MOTD_VISIBILITY_KEY, (stored) => stored === true);
    assert.equal(seen, false);
  });

  test("applyStoredPanelOpenState falls back to dataset when no setter is wired", () => {
    const wrapper = fakeEl();
    wrapper.classList = { toggle() {} };
    applyStoredPanelOpenState(wrapper, MOTD_VISIBILITY_KEY, null);
    assert.equal(wrapper.dataset.open, "true");
  });

  test("applyStoredPanelOpenState skips panels inside the drawer", () => {
    const wrapper = fakeEl({
      closest: (sel) => (sel === ".btfw-panel-container__host" ? {} : null)
    });
    let called = false;
    wrapper._btfwSetOpenState = () => {
      called = true;
    };
    applyStoredPanelOpenState(wrapper, MOTD_VISIBILITY_KEY, () => true);
    assert.equal(called, false);
  });
});
