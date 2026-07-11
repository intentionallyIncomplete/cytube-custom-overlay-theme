import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveBtfwBaseFromScriptSrc,
  resolveBtfwBase
} from "../lib/resolve-btfw-base.js";

const FALLBACK = "https://cdn.example/fallback";

describe("resolveBtfwBaseFromScriptSrc", () => {
  it("resolves jsDelivr gh ref base", () => {
    const src =
      "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/cytube-custom-overlay-theme@v1.3.1/billtube-fw.js";
    assert.equal(
      resolveBtfwBaseFromScriptSrc(src, FALLBACK),
      "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/cytube-custom-overlay-theme@v1.3.1"
    );
  });

  it("resolves local dev server base", () => {
    assert.equal(
      resolveBtfwBaseFromScriptSrc("http://127.0.0.1:3000/billtube-fw.js?v=dev", FALLBACK),
      "http://127.0.0.1:3000"
    );
  });

  it("resolves subpath base", () => {
    assert.equal(
      resolveBtfwBaseFromScriptSrc("http://localhost:3000/assets/billtube-fw.js", FALLBACK),
      "http://localhost:3000/assets"
    );
  });

  it("returns fallback for empty src", () => {
    assert.equal(resolveBtfwBaseFromScriptSrc("", FALLBACK), FALLBACK);
  });
});

describe("resolveBtfwBase", () => {
  it("reads the last matching billtube-fw script tag", () => {
    const scripts = [
      { src: "http://127.0.0.1:3000/other.js" },
      { src: "http://127.0.0.1:3000/billtube-fw.js" }
    ];
    const doc = {
      getElementsByTagName() {
        return scripts;
      }
    };
    assert.equal(resolveBtfwBase(doc, FALLBACK), "http://127.0.0.1:3000");
  });
});
