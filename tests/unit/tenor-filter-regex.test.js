import test from "node:test";
import assert from "node:assert/strict";

const LINK =
  /(\w+:\/\/(?:[^:/[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^/\s]*)*)/gi;
const LINK_PLACEHOLDER = "\ueeee";

const mediaMUrl =
  "https://media1.tenor.com/m/s74rbssSimAAAAAd/elmo-door.gif";
const legacyMediaUrl = "https://media.tenor.com/ABC123/tenor.gif";
const slugMediaUrl =
  "https://media.tenor.com/UDDCe8jyOYsAAAAC/national-chocolate-eclair-day-eclair-day.gif";
const legacyShortUrl = "https://c.tenor.com/XYZ789/tenor.gif";
const shortPageUrl = "https://tenor.com/wykR.gif";

const billtubeTenorMediaM = {
  source: "(https?://media\\d*\\.tenor\\.com/m/[^\\s<]+\\.(?:gif|webp))",
  replace: '<img class="tenor chat-picture chat-media" src="\\1" />',
  flags: "gi",
  filterlinks: true,
};

const billtubeTenorMedia = {
  source: "(https?://media\\d*\\.tenor\\.com/(?!m/)[\\w-]+/[^\\s<]+\\.(?:gif|webp))",
  replace: '<img class="tenor chat-picture chat-media" src="\\1" />',
  flags: "gi",
};

const billtubeTenorShort = {
  source: "(https?://c\\.tenor\\.com/[\\w-]+/[^\\s<]+\\.(?:gif|webp))",
  replace: '<img class="tenor chat-picture chat-media" src="\\1" />',
  flags: "gi",
};

const billtubeTenorPageShort = {
  source: "(https?://(?:www\\.)?tenor\\.com/[\\w-]+\\.(?:gif|webp))",
  replace: '<img class="tenor chat-picture chat-media" src="\\1" />',
  flags: "gi",
};

function pcreStyleReplace(filter, text) {
  const re = new RegExp(filter.source, filter.flags);
  return text.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

function applyFilters(text, filters, filterlinksMode) {
  let out = text;
  for (const filter of filters) {
    if (!!filter.filterlinks !== filterlinksMode) continue;
    const re = new RegExp(filter.source, filter.flags);
    out = out.replace(re, (...args) => {
      const groups = args.slice(1, -2);
      return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
    });
  }
  return out;
}

function simulateCyTubeFilterMessage(msg, filters) {
  const links = msg.match(LINK) || [];
  let intermediate = msg.replace(LINK, LINK_PLACEHOLDER);
  intermediate = applyFilters(intermediate, filters, false);
  return intermediate.replace(/\ueeee/g, () => {
    const link = links.shift();
    const filtered = applyFilters(link, filters, true);
    if (filtered !== link) return filtered;
    return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`;
  });
}

test("tenor media m filter embeds media1 /m/ gif url", () => {
  const out = pcreStyleReplace(billtubeTenorMediaM, mediaMUrl);
  assert.match(out, /class="tenor chat-picture chat-media"/);
  assert.match(out, /https:\/\/media1\.tenor\.com\/m\/s74rbssSimAAAAAd\/elmo-door\.gif/);
});

test("tenor media m filter survives CyTube link extraction", () => {
  const out = simulateCyTubeFilterMessage(mediaMUrl, [billtubeTenorMediaM]);
  assert.match(out, /class="tenor chat-picture chat-media"/);
  assert.match(out, /media1\.tenor\.com\/m\/s74rbssSimAAAAAd\/elmo-door\.gif/);
  assert.doesNotMatch(out, /target="_blank"/);
});

test("tenor media filter embeds legacy media.tenor.com url", () => {
  const out = pcreStyleReplace(billtubeTenorMedia, legacyMediaUrl);
  assert.match(out, /class="tenor chat-picture chat-media"/);
  assert.match(out, /https:\/\/media\.tenor\.com\/ABC123\/tenor\.gif/);
});

test("tenor media filter embeds slug gif url", () => {
  const out = pcreStyleReplace(billtubeTenorMedia, slugMediaUrl);
  assert.match(out, /UDDCe8jyOYsAAAAC\/national-chocolate-eclair-day-eclair-day\.gif/);
});

test("tenor media filter does not steal /m/ urls from media m filter", () => {
  const out = pcreStyleReplace(billtubeTenorMedia, mediaMUrl);
  assert.equal(out, mediaMUrl);
});

test("tenor short filter embeds legacy c.tenor.com url", () => {
  const out = pcreStyleReplace(billtubeTenorShort, legacyShortUrl);
  assert.match(out, /https:\/\/c\.tenor\.com\/XYZ789\/tenor\.gif/);
});

test("tenor short filter embeds tenor.com slug gif url", () => {
  const out = pcreStyleReplace(billtubeTenorPageShort, shortPageUrl);
  assert.match(out, /https:\/\/tenor\.com\/wykR\.gif/);
});
