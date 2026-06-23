import test from "node:test";
import assert from "node:assert/strict";

const legacyMediaUrl = "https://media.tenor.com/ABC123/tenor.gif";
const slugMediaUrl =
  "https://media.tenor.com/UDDCe8jyOYsAAAAC/national-chocolate-eclair-day-eclair-day.gif";
const legacyShortUrl = "https://c.tenor.com/XYZ789/tenor.gif";

const billtubeTenorMedia = {
  source: "https?://media\\.tenor\\.com/([\\w-]+)/([^ /\\n]+\\.gif)",
  replace:
    '<img class="tenor chat-picture" src="https://media.tenor.com/\\1/\\2" />',
  flags: "gi",
};

const billtubeTenorShort = {
  source: "https?://c\\.tenor\\.com/([\\w-]+)/([^ /\\n]+\\.gif)",
  replace:
    '<img class="tenor chat-picture" src="https://c.tenor.com/\\1/\\2" />',
  flags: "gi",
};

function pcreStyleReplace(filter, text) {
  const re = new RegExp(filter.source, filter.flags);
  return text.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

test("tenor media filter embeds legacy tenor.gif url", () => {
  const out = pcreStyleReplace(billtubeTenorMedia, legacyMediaUrl);
  assert.match(out, /class="tenor chat-picture"/);
  assert.match(out, /https:\/\/media\.tenor\.com\/ABC123\/tenor\.gif/);
});

test("tenor media filter embeds slug gif url", () => {
  const out = pcreStyleReplace(billtubeTenorMedia, slugMediaUrl);
  assert.match(out, /class="tenor chat-picture"/);
  assert.match(out, /UDDCe8jyOYsAAAAC\/national-chocolate-eclair-day-eclair-day\.gif/);
  assert.doesNotMatch(out, /\\1/);
});

test("tenor short filter embeds legacy c.tenor.com url", () => {
  const out = pcreStyleReplace(billtubeTenorShort, legacyShortUrl);
  assert.match(out, /https:\/\/c\.tenor\.com\/XYZ789\/tenor\.gif/);
});
