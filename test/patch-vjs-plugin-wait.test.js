import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { patchWaitUntilDefinedForVjsPlugins } from "../src/lib/patch-vjs-plugin-wait.js";

describe("patchWaitUntilDefinedForVjsPlugins", () => {
  /** @type {Record<string, unknown>} */
  let saved;

  beforeEach(() => {
    saved = {
      window: globalThis.window,
      waitUntilDefined: globalThis.waitUntilDefined,
    };
    globalThis.window = {
      videojs: {
        getPlugin(name) {
          return name === "videoJsResolutionSwitcher" ? {} : undefined;
        },
      },
    };
    delete globalThis.waitUntilDefined;
  });

  afterEach(() => {
    if (saved.window === undefined) delete globalThis.window;
    else globalThis.window = saved.window;
    if (saved.waitUntilDefined === undefined) delete globalThis.waitUntilDefined;
    else globalThis.waitUntilDefined = saved.waitUntilDefined;
  });

  it("waits for videoJsResolutionSwitcher before videojs callback", async () => {
    /** @type {(() => void) | undefined} */
    let videojsCb;
    globalThis.waitUntilDefined = (obj, key, cb) => {
      if (obj === globalThis.window && key === "videojs") videojsCb = cb;
    };

    patchWaitUntilDefinedForVjsPlugins();

    let playerStarted = false;
    globalThis.waitUntilDefined(globalThis.window, "videojs", () => {
      playerStarted = true;
    });

    assert.equal(playerStarted, false);
    videojsCb?.();
    await new Promise((r) => setTimeout(r, 50));
    assert.equal(playerStarted, true);
  });

  it("does not wrap non-videojs waitUntilDefined calls", () => {
    const calls = [];
    globalThis.waitUntilDefined = (obj, key, cb) => {
      calls.push([obj, key]);
      cb();
    };

    patchWaitUntilDefinedForVjsPlugins();
    globalThis.waitUntilDefined({}, "foo", () => {});

    assert.deepEqual(calls, [[{}, "foo"]]);
  });
});
