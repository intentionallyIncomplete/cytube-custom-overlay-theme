import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createBtfwRegistry } from "../lib/btfw-registry.js";

const BASE = "https://cdn.example/billtube";

async function loadIconPacks() {
  const { define, init } = createBtfwRegistry(BASE);
  globalThis.BTFW = { define, init: (name) => init(name) };
  eval(readFileSync(new URL("../modules/util-theme-icon-packs.js", import.meta.url), "utf8"));
  return init("util:themeIconPacks");
}

describe("theme icon packs", () => {
  it("resolves continental tint with base placeholder", async () => {
    const iconPacks = await loadIconPacks();
    const map = iconPacks.resolveIconMap({ tint: "continental" }, { baseUrl: BASE });
    assert.equal(map["nav-theme"], `${BASE}/assets/themes/continental/crown.svg`);
    assert.equal(map["nav-movie-request"], `${BASE}/assets/themes/continental/castle.svg`);
  });

  it("merges explicit iconPack and per-slot overrides", async () => {
    const iconPacks = await loadIconPacks();
    const map = iconPacks.resolveIconMap({
      iconPack: "continental",
      icons: {
        "nav-theme": "https://example.com/custom.svg",
        "unknown-slot": "https://example.com/skip.svg"
      }
    }, { baseUrl: BASE });
    assert.equal(map["nav-theme"], "https://example.com/custom.svg");
    assert.equal(map["unknown-slot"], undefined);
  });

  it("returns empty map when no pack is configured", async () => {
    const iconPacks = await loadIconPacks();
    const map = iconPacks.resolveIconMap({ tint: "midnight" }, { baseUrl: BASE });
    assert.deepEqual(map, {});
  });

  it("builds default slot html when icon map is empty", async () => {
    const iconPacks = await loadIconPacks();
    const html = iconPacks.buildSlotHtml("nav-theme", {}, { baseUrl: BASE });
    assert.match(html, /fa-sliders/);
  });
});
