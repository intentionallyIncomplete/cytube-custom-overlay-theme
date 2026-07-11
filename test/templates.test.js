import test from "node:test";
import assert from "node:assert/strict";
import {
  chatTopbarHtml,
  chatUserlistPopoverHtml
} from "../lib/templates/chat.js";
import {
  addMediaPanelHtml,
  stackGroupHeaderHtml
} from "../lib/templates/stack.js";
import { channelThemeAdminPanelHtml } from "../lib/templates/channel-theme-admin.js";

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

test("channelThemeAdminPanelHtml includes apply button", () => {
  assert.match(channelThemeAdminPanelHtml(), /btfw-theme-apply/);
});
