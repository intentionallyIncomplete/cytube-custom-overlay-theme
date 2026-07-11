import test from "node:test";
import assert from "node:assert/strict";

function formatSlugTag(slug) {
  return `[letterboxdcard]${slug}[/letterboxdcard]`;
}

function encodePosterUrl(url) {
  return String(url || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^\/\//, "");
}

function escapeCardField(value) {
  return String(value ?? "")
    .replace(/\|/g, "&#124;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;");
}

function formatLegacyCardTag(film, slug) {
  const title = escapeCardField(film.title || slug || "Film");
  const year = escapeCardField(film.year || "");
  const rating = escapeCardField(film.rating || "n/a");
  const overview = escapeCardField(film.overview || "No description available.");
  const posterUrl = escapeCardField(encodePosterUrl(film.posterUrl || ""));
  return `[letterboxdcard]${title}|${year}|${rating}|${overview}|${posterUrl}|${slug}[/letterboxdcard]`;
}

const LINK =
  /(\w+:\/\/(?:[^:/[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^/\s]*)*)/gi;
const PROTO_REL_LINK = /(?<![\w/])(\/\/[^\s<[\]|]+)/gi;
const LINK_PLACEHOLDER = "\ueeee";

function simulateCyTubeFilterMessage(msg, filters) {
  const list = Array.isArray(filters) ? filters : [filters];
  const links = msg.match(LINK) || [];
  const protoLinks = msg.match(PROTO_REL_LINK) || [];
  let intermediate = msg.replace(LINK, LINK_PLACEHOLDER);
  intermediate = intermediate.replace(PROTO_REL_LINK, LINK_PLACEHOLDER);
  for (const filter of list) {
    const re = new RegExp(filter.source, filter.flags);
    intermediate = intermediate.replace(re, (...args) => {
      const groups = args.slice(1, -2);
      return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
    });
  }
  const allLinks = [...links, ...protoLinks];
  return intermediate.replace(/\ueeee/g, () => {
    const link = allLinks.shift();
    return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`;
  });
}

const letterboxdFilters = [
  {
    source: "\\[letterboxdcard\\]([a-zA-Z0-9-]+)\\[\\/letterboxdcard\\]",
    replace: "[letterboxdcard]\\1[/letterboxdcard]",
    flags: "g",
  },
  {
    source:
      "\\[letterboxdcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([a-zA-Z0-9-]+)\\[\\/letterboxdcard\\]",
    replace:
      '<a class="letterboxd-card chat-media-card" href="https://letterboxd.com/film/\\6/" target="_blank" rel="noopener noreferrer"><img class="letterboxd-card__poster chat-media" src="https://\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="letterboxd-card__content"><div class="letterboxd-card__title">\\1 <span class="letterboxd-card__year">(\\2)</span></div><div class="letterboxd-card__rating">★ \\3</div><div class="letterboxd-card__overview">\\4</div></div></a>',
    flags: "g",
  },
];

test("slug tag fits under CyTube default chat limit", () => {
  const tag = formatSlugTag("the-furious");
  assert.equal(tag, "[letterboxdcard]the-furious[/letterboxdcard]");
  assert.ok(tag.length < 80);
});

test("slug tag survives CyTube link placeholder pass", () => {
  const tag = formatSlugTag("the-furious");
  const out = simulateCyTubeFilterMessage(tag, letterboxdFilters);
  assert.equal(out, tag);
  assert.doesNotMatch(out, /target="_blank"/);
});

test("legacy full tag still renders through CyTube filter", () => {
  const tag = formatLegacyCardTag(
    {
      title: "Hunter",
      year: "2015",
      rating: "3.2",
      overview: "A rogue cop killer hunts the night.",
      posterUrl: "https://a.ltrbxd.com/poster.jpg",
    },
    "hunter-2015"
  );
  const out = simulateCyTubeFilterMessage(tag, letterboxdFilters);
  assert.match(out, /letterboxd-card/);
  assert.match(out, /href="https:\/\/letterboxd\.com\/film\/hunter-2015\/"/);
});

test("slugFromUrl extracts film slug", () => {
  const slugFromUrl = (url) => {
    const match = String(url || "").match(/letterboxd\.com\/film\/([a-zA-Z0-9-]+)/i);
    return match ? match[1] : null;
  };
  assert.equal(slugFromUrl("https://letterboxd.com/film/the-furious/"), "the-furious");
});

test("stripBrokenCardTails removes orphaned linkified poster suffix", () => {
  const stripBrokenCardTails = (html) =>
    String(html || "").replace(
      /"\s*target="_blank"\s*rel="noopener noreferrer">https?:\/\/[^<[]*\[\/letterboxdcard\]/gi,
      ""
    );
  const broken =
    '<div class="letterboxd-card">Fight Club</div>" target="_blank" rel="noopener noreferrer">https://a.ltrbxd.com/poster.jpg[/letterboxdcard]';
  const out = stripBrokenCardTails(broken);
  assert.doesNotMatch(out, /\[\/letterboxdcard\]/);
  assert.doesNotMatch(out, /target="_blank"/);
});
