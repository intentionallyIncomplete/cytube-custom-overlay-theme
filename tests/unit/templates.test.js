import test from "node:test";
import assert from "node:assert/strict";
import {
  chatTopbarHtml,
  chatUserlistPopoverHtml
} from "../../src/lib/templates/chat.js";
import {
  addMediaPanelHtml,
  stackGroupHeaderHtml
} from "../../src/lib/templates/stack.js";
import { channelThemeAdminPanelHtml } from "../../src/lib/templates/channel-theme-admin.js";

function buildTintOptionsHtml() {
  return '<option value="midnight">Midnight</option><option value="custom">Custom mix</option>';
}

function buildColorField(key, label, bindPath) {
  return `<div class="btfw-ts-control btfw-ts-control--color"><label class="btfw-input__label" for="btfw-theme-color-${key}">${label}</label><input type="color" id="btfw-theme-color-${key}" data-btfw-bind="${bindPath}"></div>`;
}

test("chatTopbarHtml includes nowplaying slot", () => {
  assert.match(chatTopbarHtml(), /btfw-nowplaying-slot/);
});

test("chatUserlistPopoverHtml includes popbody", () => {
  assert.match(chatUserlistPopoverHtml(), /btfw-popbody/);
});

test("addMediaPanelHtml includes tablist", () => {
  assert.match(addMediaPanelHtml(), /btfw-addmedia-tabs/);
});

test("stackGroupHeaderHtml embeds title", () => {
  assert.match(stackGroupHeaderHtml("Playlist"), /Playlist/);
});

test("stackGroupHeaderHtml escapes script injection in title", () => {
  const result = stackGroupHeaderHtml('<script>alert("xss")</script>');
  assert.ok(!result.includes("<script>"), "raw <script> tag must not appear in output");
  assert.match(result, /&lt;script&gt;/, "script tag should be escaped to HTML entities");
});

const mockThemeRuntime = {
  TINT_PRESETS: {
    midnight: { name: "Midnight" },
    custom: { name: "Custom" }
  }
};

test("channelThemeAdminPanelHtml includes apply button", () => {
  assert.match(channelThemeAdminPanelHtml(mockThemeRuntime), /btfw-theme-apply/);
});