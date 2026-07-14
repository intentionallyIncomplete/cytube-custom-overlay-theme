import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildCdnUrl,
  verifyAssetContent,
  verifyChannelConfigPin,
} from "../src/lib/cdn-deploy.js";

describe("cdn-deploy", () => {
  it("buildCdnUrl uses gh ref path", () => {
    assert.equal(
      buildCdnUrl("owner/repo", "v1.2.3", "dist/billtube-fw.js"),
      "https://cdn.jsdelivr.net/gh/owner/repo@v1.2.3/dist/billtube-fw.js"
    );
  });

  it("verifyChannelConfigPin accepts pinned CDN_BASE", () => {
    const content = 'const CDN_BASE = "https://cdn.jsdelivr.net/gh/owner/repo@v1.2.3";';
    assert.equal(verifyChannelConfigPin(content, "v1.2.3").ok, true);
  });

  it("verifyChannelConfigPin rejects wrong tag", () => {
    const content = 'const CDN_BASE = "https://cdn.jsdelivr.net/gh/owner/repo@v1.0.0";';
    assert.equal(verifyChannelConfigPin(content, "v1.2.3").ok, false);
  });

  it("verifyAssetContent requires util:motion in core bundle", () => {
    const core = "x".repeat(50) + "BTFW.define('util:motion'";
    assert.equal(verifyAssetContent("dist/core.bundle.js", core).ok, true);
    assert.equal(verifyAssetContent("dist/core.bundle.js", "x".repeat(50)).ok, false);
  });

  it("verifyAssetContent requires BTFW marker in loader", () => {
    const loader = "x".repeat(50) + "window.BTFW = {}";
    assert.equal(verifyAssetContent("dist/billtube-fw.js", loader).ok, true);
    assert.equal(verifyAssetContent("dist/billtube-fw.js", "x".repeat(10)).ok, false);
  });
});
