import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

function mockTarget(classNames) {
  const classes = classNames.split(/\s+/).filter(Boolean);
  const node = {
    classList: {
      contains: (c) => classes.includes(c)
    },
    closest(selectors) {
      const parts = selectors.split(",");
      for (const part of parts) {
        const cls = part.trim().replace(/^\./, "");
        if (classes.includes(cls)) return node;
      }
      return null;
    }
  };
  return node;
}

describe("player click guard", () => {
  let shouldAllowClick;

  before(async () => {
    const doc = {
      readyState: "loading",
      head: { appendChild() {} },
      body: {},
      getElementById: () => null,
      querySelectorAll: () => [],
      addEventListener() {}
    };
    global.document = doc;
    global.window = {
      document: doc,
      addEventListener() {},
      setInterval: () => 0
    };

    let factory;
    global.BTFW = { define: (_, __, f) => { factory = f; } };
    await import("../src/modules/feature-player.js");
    const api = await factory({});
    shouldAllowClick = api.shouldAllowClick;
  });

  it("test_big_play_button_allowed", () => {
    const target = mockTarget("vjs-big-play-button");
    assert.equal(shouldAllowClick(target), true);
  });

  it("test_poster_allowed", () => {
    const target = mockTarget("vjs-poster");
    assert.equal(shouldAllowClick(target), true);
  });

  it("test_unlisted_target_blocked", () => {
    const target = mockTarget("vjs-tech");
    assert.equal(shouldAllowClick(target), false);
  });

  it("test_null_target_blocked", () => {
    assert.equal(shouldAllowClick(null), false);
  });
});
