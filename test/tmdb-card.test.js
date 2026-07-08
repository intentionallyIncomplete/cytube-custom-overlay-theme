import test from "node:test";
import assert from "node:assert/strict";

function escapeCardField(value) {
  return String(value ?? "")
    .replace(/\|/g, "&#124;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;");
}

function formatCardTag(media) {
  const title = escapeCardField(media.title || "Unknown");
  const year = escapeCardField(media.year || "");
  const rating = escapeCardField(media.rating || "n/a");
  const overview = escapeCardField(media.overview || "No summary available.");
  const posterPath = escapeCardField(media.posterPath || "");
  return `[tmdbcard]${title}|${year}|${rating}|${overview}|${posterPath}[/tmdbcard]`;
}

function posterUrlFromPath(posterPath) {
  const path = String(posterPath || "").trim();
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `https://image.tmdb.org/t/p/w342${path.startsWith("/") ? path : `/${path}`}`;
}

function parseUrl(url) {
  const match = String(url || "").match(/themoviedb\.org\/(movie|tv)\/(\d+)/i);
  if (!match) return null;
  return { mediaType: match[1].toLowerCase(), id: match[2] };
}

const tmdbFilter = {
  source:
    "\\[tmdbcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^\\[]+)\\[\\/tmdbcard\\]",
  replace:
    '<div class="tmdb-card chat-media-card"><img class="tmdb-card__poster chat-media" src="https://image.tmdb.org/t/p/w342\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="tmdb-card__content"><div class="tmdb-card__title">\\1 <span class="tmdb-card__year">(\\2)</span></div><div class="tmdb-card__rating">★ \\3</div><div class="tmdb-card__overview">\\4</div></div></div>',
  flags: "g",
};

function simulateCyTubeFilterMessage(msg, filter) {
  const re = new RegExp(filter.source, filter.flags);
  return msg.replace(re, (...args) => {
    const groups = args.slice(1, -2);
    return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
  });
}

test("parseUrl extracts movie id and type", () => {
  assert.deepEqual(
    parseUrl("https://www.themoviedb.org/movie/755898-war-of-the-worlds"),
    { mediaType: "movie", id: "755898" }
  );
});

test("parseUrl extracts tv id and type", () => {
  assert.deepEqual(
    parseUrl("https://www.themoviedb.org/tv/1396-breaking-bad"),
    { mediaType: "tv", id: "1396" }
  );
});

test("formatCardTag escapes pipe characters in overview", () => {
  const tag = formatCardTag({
    title: "War of the Worlds",
    year: "2025",
    rating: "4.2",
    overview: "Part one | part two",
    posterPath: "/abc.jpg",
  });
  assert.match(tag, /&#124;/);
  assert.doesNotMatch(tag, /part one \| part two/);
});

test("posterUrlFromPath builds TMDB image URL", () => {
  assert.equal(
    posterUrlFromPath("/n1y5htahL1C4tPF9sXRx0y39N8856.jpg"),
    "https://image.tmdb.org/t/p/w342/n1y5htahL1C4tPF9sXRx0y39N8856.jpg"
  );
});

test("tmdb card tag renders through CyTube filter", () => {
  const tag = formatCardTag({
    title: "War of the Worlds",
    year: "2025",
    rating: "4.2",
    overview: "A update on the classic.",
    posterPath: "/abc.jpg",
  });
  const out = simulateCyTubeFilterMessage(tag, tmdbFilter);
  assert.match(out, /tmdb-card/);
  assert.match(out, /image\.tmdb\.org\/t\/p\/w342\/abc\.jpg/);
  assert.doesNotMatch(out, /\[\/tmdbcard\]/);
});

test("TMDB_URL_RE matches movie page URLs", () => {
  const re =
    /https?:\/\/(?:www\.)?themoviedb\.org\/(movie|tv)\/(\d+)(?:-[a-zA-Z0-9-]+)?\/?/gi;
  const matches = [...("Check https://www.themoviedb.org/movie/755898-war-of-the-worlds ok").matchAll(re)];
  assert.equal(matches.length, 1);
  assert.equal(matches[0][1], "movie");
  assert.equal(matches[0][2], "755898");
});
