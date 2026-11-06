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

test("channelThemeAdminPanelHtml includes apply button", () => {
  assert.match(channelThemeAdminPanelHtml(), /btfw-theme-apply/);
});

test("channelThemeAdminPanelHtml has no movie-info toggle", () => {
  const html = channelThemeAdminPanelHtml();
  assert.doesNotMatch(html, /btfw-theme-movie-info-toggle/);
  assert.doesNotMatch(html, /integrations\.movieInfo\.enabled/);
});

test("channelThemeAdminPanelHtml drops the empty Integrations section", () => {
  assert.doesNotMatch(channelThemeAdminPanelHtml(), /data-section="integrations"/);
});

test("channelThemeAdminPanelHtml keeps resources and the channel header name", () => {
  const html = channelThemeAdminPanelHtml();
  assert.match(html, /data-section="resources"/);
  assert.match(html, /id="btfw-theme-header-name"/);
  assert.match(html, /data-btfw-bind="branding\.headerName"/);
  assert.match(html, /data-btfw-bind="resources\.styles"/);
  assert.match(html, /data-role="module-inputs"/);
});

test("channelThemeAdminPanelHtml drops the channel palette and favicon/poster fields", () => {
  const html = channelThemeAdminPanelHtml();
  assert.doesNotMatch(html, /data-section="appearance"/);
  assert.doesNotMatch(html, /data-section="branding"/);
  assert.doesNotMatch(html, /btfw-theme-tint/);
  assert.doesNotMatch(html, /btfw-theme-favicon/);
  assert.doesNotMatch(html, /btfw-theme-poster/);
  assert.doesNotMatch(html, /data-btfw-bind="tint"/);
  assert.doesNotMatch(html, /data-btfw-bind="colors\./);
  assert.doesNotMatch(html, /branding\.faviconUrl/);
  assert.doesNotMatch(html, /branding\.posterUrl/);
});