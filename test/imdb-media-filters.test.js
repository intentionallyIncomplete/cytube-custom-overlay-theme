import test from "node:test";
import assert from "node:assert/strict";

function escapeCardField(value) {
  return String(value ?? "")
    .replace(/\|/g, "&#124;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;");
}

function encodeSourceUrl(url) {
  return String(url || "").trim().replace(/^https:\/\//i, "//");
}

function formatCardTag(media) {
  const title = escapeCardField(media.title || "Unknown");
  const year = escapeCardField(media.year || "");
  const rating = escapeCardField(media.rating || "n/a");
  const overview = escapeCardField(media.overview || "No summary available.");
  const posterPath = escapeCardField(media.posterPath || "");
  const pageUrl = escapeCardField(encodeSourceUrl(media.sourceUrl || ""));
  return `[imdbcard]${title}|${year}|${rating}|${overview}|${posterPath}|${pageUrl}[/imdbcard]`;
}

function parseTitleUrl(url) {
  const match = String(url || "").match(/imdb\.com\/title\/(tt\d+)/i);
  return match ? match[1] : null;
}

function parseNameUrl(url) {
  const match = String(url || "").match(/imdb\.com\/name\/(nm\d+)/i);
  return match ? match[1] : null;
}

const imdbFilter = {
  source:
    "\\[imdbcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)(?:\\|([^\\[]+))?\\[\\/imdbcard\\]",
  replace:
    '<a class="imdb-card chat-media-card" href="https:\\6" target="_blank" rel="noopener noreferrer"><img class="imdb-card__poster chat-media" src="https://image.tmdb.org/t/p/w342\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="imdb-card__content"><div class="imdb-card__title">\\1 <span class="imdb-card__year">(\\2)</span></div><div class="imdb-card__rating">★ \\3</div><div class="imdb-card__overview">\\4</div></div></a>',
  flags: "g",
};

const CHAT_MEDIA_MAX_STYLE = ' style="max-width:300px;max-height:300px"';
const CHAT_IMGUR_REFERRER_ATTR = ' referrerpolicy="no-referrer"';
const IMGUR_IMAGE_HOST_RE = /(?:^|\/\/)(?:i\.)?imgur\.com\//i;

const lensdumpCdnFilter = {
  source: "(https?://b\\.l3n\\.co/[^\\s<]+\\.(?:gif|webp|png|jpe?g))",
  replace: `<img class="lensdump chat-picture chat-media"${CHAT_MEDIA_MAX_STYLE} src="\\1" />`,
  flags: "gi",
};

const imgurDirectFilter = {
  source: "(https?://i\\.imgur\\.com/[a-zA-Z0-9]+\\.(?:gif|webp|png|jpe?g|mp4)(?:\\?[^\\s<]*)?)",
  replace: `<img class="imgur chat-picture chat-media"${CHAT_MEDIA_MAX_STYLE}${CHAT_IMGUR_REFERRER_ATTR} src="\\1" />`,
  flags: "gi",
};

function pcreStyleReplace(filter, text) {
  const re = new RegExp(filter.source, filter.flags);
  return text.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

test("parseTitleUrl extracts tt id", () => {
  assert.equal(
    parseTitleUrl("https://www.imdb.com/title/tt9683542/"),
    "tt9683542"
  );
});

test("parseNameUrl extracts nm id", () => {
  assert.equal(
    parseNameUrl("https://www.imdb.com/name/nm5585082/?ref_=nv_sr_srsg_0"),
    "nm5585082"
  );
});

test("imdb card tag renders through CyTube filter", () => {
  const tag = formatCardTag({
    title: "Top Gun: Maverick",
    year: "2022",
    rating: "8.3",
    overview: "After thirty years, Maverick is still pushing the envelope.",
    posterPath: "/abc.jpg",
    sourceUrl: "https://www.imdb.com/title/tt9683542/",
  });
  const out = pcreStyleReplace(imdbFilter, tag);
  assert.match(out, /imdb-card/);
  assert.match(out, /href="https:\/\/www\.imdb\.com\/title\/tt9683542\/"/);
  assert.doesNotMatch(out, /\[\/imdbcard\]/);
});

test("lensdump cdn filter embeds direct gif url", () => {
  const url = "https://b.l3n.co/jlH8Oe.gif";
  const out = pcreStyleReplace(lensdumpCdnFilter, url);
  assert.match(out, /class="lensdump chat-picture chat-media"/);
  assert.match(out, /https:\/\/b\.l3n\.co\/jlH8Oe\.gif/);
});

test("IMGUR_IMAGE_HOST_RE matches i.imgur.com direct urls", () => {
  assert.ok(IMGUR_IMAGE_HOST_RE.test("https://i.imgur.com/VQi5RXE.jpg"));
  assert.ok(IMGUR_IMAGE_HOST_RE.test("https://imgur.com/abc123.jpg"));
  assert.ok(!IMGUR_IMAGE_HOST_RE.test("https://example.com/i.imgur.com/x.jpg"));
});

test("imgur direct filter embeds i.imgur.com url", () => {
  const url = "https://i.imgur.com/Tpbp60F.gif";
  const out = pcreStyleReplace(imgurDirectFilter, url);
  assert.match(out, /class="imgur chat-picture chat-media"/);
  assert.match(out, /referrerpolicy="no-referrer"/);
  assert.match(out, /https:\/\/i\.imgur\.com\/Tpbp60F\.gif/);
});

test("imgur direct filter embeds url with tracking query string", () => {
  const url = "https://i.imgur.com/YV32qsq.jpg?fb";
  const out = pcreStyleReplace(imgurDirectFilter, url);
  assert.match(out, /src="https:\/\/i\.imgur\.com\/YV32qsq\.jpg\?fb"/);
  assert.match(out, /max-width:300px/);
  assert.match(out, /max-height:300px/);
  assert.doesNotMatch(out, /\?fb(?![^"]*")/);
});

test("IMGUR_PAGE_URL_RE matches gallery urls", () => {
  const re =
    /https?:\/\/(?:www\.)?imgur\.com\/(?:gallery\/[^\s?]+|a\/[a-zA-Z0-9]+)(?:[/?][^\s]*)?/gi;
  const matches = [
    ..."https://imgur.com/gallery/one-mitch-coming-right-up-Tpbp60F".matchAll(re),
  ];
  assert.equal(matches.length, 1);
});

test("LENSDUMP_PAGE_URL_RE matches album urls", () => {
  const re =
    /https?:\/\/(?:www\.)?lensdump\.com\/(?:i|a)\/[a-zA-Z0-9]+(?:\/[^\s]*)?/gi;
  const matches = [
    ..."https://lensdump.com/a/8w2ri/?sort=date_desc&page=1".matchAll(re),
  ];
  assert.equal(matches.length, 1);
});
