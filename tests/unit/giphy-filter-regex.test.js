import test from "node:test";
import assert from "node:assert/strict";

const classicUrl =
  "https://media1.giphy.com/media/sRzRspcNEmgdtbQmnJ/giphy.gif";
const v1Url =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeG5tdTN6ZTdibzc3azdrZ2JmMG1zNWxtbGNsZXI5d2t6bTFubnVuZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/sRzRspcNEmgdtbQmnJ/giphy.gif";

const brokenLegacyGiphy = {
  source:
    "https?://(?:media\\d\\.giphy\\.com/media/([^/\\s]+)/giphy\\.gif|i\\.giphy\\.com/([^/\\s]+)\\.gif|giphy\\.com/gifs/(?:.*-)?([a-zA-Z0-9]+))",
  replace:
    '<img class="giphy chat-picture" src="https://media.giphy.com/media/\\1\\2\\3/200.gif" />',
  flags: "g",
};

const billtubeGiphyClassic = {
  source:
    "https?://media\\d+\\.giphy\\.com/media/(?!v1\\.)([^ /\\n]+)/giphy\\.gif",
  replace:
    '<img class="giphy chat-picture" src="https://media.giphy.com/media/\\1/giphy_s.gif" />',
  flags: "gi",
};

const billtubeGiphyV1 = {
  source:
    "https?://media\\d+\\.giphy\\.com/media/v1\\.[^/]+/([^ /\\n]+)/giphy\\.gif",
  replace:
    '<img class="giphy chat-picture" src="https://media.giphy.com/media/\\1/giphy_s.gif" />',
  flags: "gi",
};

function pcreStyleReplace(filter, text) {
  const re = new RegExp(filter.source, filter.flags);
  return text.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

test("JS String.replace leaves literal \\1\\2\\3 in replacement", () => {
  const out = classicUrl.replace(
    new RegExp(brokenLegacyGiphy.source, brokenLegacyGiphy.flags),
    brokenLegacyGiphy.replace
  );
  assert.match(out, /\\1\\2\\3/);
});

test("billtube classic giphy filter embeds id", () => {
  const out = pcreStyleReplace(billtubeGiphyClassic, classicUrl);
  assert.match(out, /sRzRspcNEmgdtbQmnJ/);
  assert.doesNotMatch(out, /\\1/);
});

test("billtube v1 giphy filter embeds id", () => {
  const out = pcreStyleReplace(billtubeGiphyV1, v1Url);
  assert.match(out, /sRzRspcNEmgdtbQmnJ/);
});

test("classic filter does not match v1 url", () => {
  const out = pcreStyleReplace(billtubeGiphyClassic, v1Url);
  assert.equal(out, v1Url);
});
