import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDefaultPollOpen, hasPollContent } from "../src/lib/stack-poll-visibility.js";

function mockDoc(selectors) {
  return {
    querySelector(sel) {
      return selectors[sel] ?? null;
    }
  };
}

describe("stack-poll-visibility", () => {
  it("test_hasPollContent_when_active_well", () => {
    const doc = mockDoc({ "#pollwrap .well.active": {} });
    assert.equal(hasPollContent(doc), true);
  });

  it("test_hasPollContent_when_muted_well", () => {
    const doc = mockDoc({
      "#pollwrap .well.active": null,
      "#pollwrap .well.muted": {}
    });
    assert.equal(hasPollContent(doc), true);
  });

  it("test_hasPollContent_when_idle", () => {
    const doc = mockDoc({
      "#pollwrap .well.active": null,
      "#pollwrap .well.muted": null,
      "#pollwrap .poll-menu": null
    });
    assert.equal(hasPollContent(doc), false);
  });

  it("test_getDefaultPollOpen_stored_overrides", () => {
    assert.equal(getDefaultPollOpen(false, true), false);
  });

  it("test_getDefaultPollOpen_content_when_no_stored", () => {
    assert.equal(getDefaultPollOpen(null, true), true);
    assert.equal(getDefaultPollOpen(null, false), false);
  });
});
