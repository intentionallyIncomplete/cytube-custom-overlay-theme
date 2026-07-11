import test from "node:test";
import assert from "node:assert/strict";

const LINK =
  /(\w+:\/\/(?:[^:/[\]\s]+|\[[0-9a-f:]+\])(?::\d+)?(?:\/[^/\s]*)*)/gi;
const LINK_PLACEHOLDER = "\ueeee";

function escapeCardField(value) {
  return String(value ?? "")
    .replace(/\|/g, "&#124;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;");
}

function encodePosterUrl(url) {
  return String(url || "").trim().replace(/^https:\/\//i, "//");
}

function encodeSourceUrl(url) {
  return String(url || "").trim().replace(/^https:\/\//i, "//");
}

function formatCardTag(film, sourceUrl) {
  const title = escapeCardField(film.title || film.slug || "Film");
  const year = escapeCardField(film.year || "");
  const rating = escapeCardField(film.rating || "n/a");
  const overview = escapeCardField(film.overview || "No description available.");
  const posterUrl = escapeCardField(encodePosterUrl(film.posterUrl || ""));
  const pageUrl = escapeCardField(
    encodeSourceUrl(sourceUrl || (film.slug ? `https://letterboxd.com/film/${film.slug}/` : ""))
  );
  return `[letterboxdcard]${title}|${year}|${rating}|${overview}|${posterUrl}|${pageUrl}[/letterboxdcard]`;
}

function simulateCyTubeFilterMessage(msg, filter) {
  const links = msg.match(LINK) || [];
  let intermediate = msg.replace(LINK, LINK_PLACEHOLDER);
  const re = new RegExp(filter.source, filter.flags);
  intermediate = intermediate.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
  return intermediate.replace(/\ueeee/g, () => {
    const link = links.shift();
    return `<a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a>`;
  });
}

const letterboxdFilter = {
  source:
    "\\[letterboxdcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)(?:\\|([^\\[]+))?\\[\\/letterboxdcard\\]",
  replace:
    '<a class="letterboxd-card chat-media-card" href="https:\\6" target="_blank" rel="noopener noreferrer"><img class="letterboxd-card__poster chat-media" src="\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="letterboxd-card__content"><div class="letterboxd-card__title">\\1 <span class="letterboxd-card__year">(\\2)</span></div><div class="letterboxd-card__rating">★ \\3</div><div class="letterboxd-card__overview">\\4</div></div></a>',
  flags: "g",
};

test("formatCardTag escapes pipe characters in overview", () => {
  const tag = formatCardTag({
    title: "Hunter",
    year: "2015",
    rating: "3.2",
    overview: "Part one | part two",
    posterUrl: "https://a.ltrbxd.com/poster.jpg",
  });
  assert.match(tag, /&#124;/);
  assert.doesNotMatch(tag, /part one \| part two/);
});

test("formatCardTag encodes poster url to survive CyTube link extraction", () => {
  const tag = formatCardTag({
    title: "Warlock",
    year: "1989",
    rating: "3.0",
    overview: "A warlock in the 1980s.",
    posterUrl: "https://a.ltrbxd.com/poster.jpg?v=1",
  });
  assert.match(tag, /\/\/a\.ltrbxd\.com\/poster\.jpg/);
  assert.doesNotMatch(tag, /https:\/\//);
});

test("encoded poster card survives CyTube link placeholder pass", () => {
  const tag = formatCardTag({
    title: "Warlock",
    year: "1989",
    rating: "3.0",
    overview: "A warlock in the 1980s.",
    posterUrl: "https://a.ltrbxd.com/poster.jpg?v=1",
    slug: "warlock",
  });
  const out = simulateCyTubeFilterMessage(tag, letterboxdFilter);
  assert.match(out, /letterboxd-card/);
  assert.match(out, /\/\/a\.ltrbxd\.com\/poster\.jpg/);
  assert.match(out, /href="https:\/\/letterboxd\.com\/film\/warlock\/"/);
  assert.doesNotMatch(out, /\[\/letterboxdcard\]/);
});

test("encoded poster card survives CyTube sanitizeText and link extraction", () => {
  function sanitizeText(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\(/g, "&#40;")
      .replace(/\)/g, "&#41;");
  }

  const tag = formatCardTag({
    title: "Fight Club",
    year: "1999",
    rating: "4.3",
    overview: "Mischief. Mayhem. Soap.",
    posterUrl: "https://a.ltrbxd.com/poster.jpg?v=1",
    slug: "fight-club",
  });
  const out = simulateCyTubeFilterMessage(sanitizeText(tag), letterboxdFilter);
  assert.match(out, /letterboxd-card/);
  assert.match(out, /\/\/a\.ltrbxd\.com\/poster\.jpg/);
  assert.doesNotMatch(out, /\[\/letterboxdcard\]/);
  assert.doesNotMatch(out, /&amp;#58;/);
});

test("bare poster url in tag breaks card markup under CyTube link extraction", () => {
  const tag =
    "[letterboxdcard]Warlock|1989|3.0|A warlock in the 1980s.|https://a.ltrbxd.com/poster.jpg?v=1[/letterboxdcard]";
  const out = simulateCyTubeFilterMessage(tag, letterboxdFilter);
  assert.match(out, /target="_blank"/);
  assert.match(out, /\[\/letterboxdcard\]/);
});

test("slugFromUrl extracts film slug", () => {
  const slugFromUrl = (url) => {
    const match = String(url || "").match(/letterboxd\.com\/film\/([a-zA-Z0-9-]+)/i);
    return match ? match[1] : null;
  };
  assert.equal(slugFromUrl("https://letterboxd.com/film/hunter-2015/"), "hunter-2015");
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
