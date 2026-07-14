import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { measureTitleOverflow } from "../src/lib/nowplaying-overflow.js";

function mockElement({ clientWidth = 100, scrollWidth = 80, text = "Title" } = {}) {
  const classList = {
    _has: false,
    add(name) { if (name === "is-overflowing") this._has = true; },
    remove(name) { if (name === "is-overflowing") this._has = false; },
    toggle(name, on) {
      if (on === undefined) on = !this._has;
      this._has = !!on;
    }
  };
  const style = { _props: new Map() };
  return {
    clientWidth,
    scrollWidth,
    textContent: text,
    classList,
    style: {
      setProperty(k, v) { style._props.set(k, v); },
      getPropertyValue(k) { return style._props.get(k) || ""; }
    },
    getAttribute() { return null; },
    setAttribute() {},
    removeAttribute() {}
  };
}

describe("nowplaying-overflow", () => {
  it("test_measureTitleOverflow_overflows", () => {
    const outer = mockElement({ clientWidth: 100 });
    const inner = mockElement({ scrollWidth: 150 });
    assert.equal(measureTitleOverflow(outer, inner), true);
    assert.equal(outer.classList._has, true);
  });

  it("test_measureTitleOverflow_fits", () => {
    const outer = mockElement({ clientWidth: 100 });
    const inner = mockElement({ scrollWidth: 80 });
    assert.equal(measureTitleOverflow(outer, inner), false);
    assert.equal(outer.classList._has, false);
  });
});
