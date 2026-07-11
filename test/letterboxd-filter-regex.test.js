import test from "node:test";
import assert from "node:assert/strict";

const letterboxdFilters = [
  {
    source:
      "\\[letterboxdcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([a-zA-Z0-9-]+)\\[\\/letterboxdcard\\]",
    replace:
      '<a class="letterboxd-card chat-media-card" href="https://letterboxd.com/film/\\6/" target="_blank" rel="noopener noreferrer"><img class="letterboxd-card__poster chat-media" src="https://\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="letterboxd-card__content"><div class="letterboxd-card__title">\\1 <span class="letterboxd-card__year">(\\2)</span></div><div class="letterboxd-card__rating">★ \\3</div><div class="letterboxd-card__overview">\\4</div></div></a>',
    flags: "g",
  },
  {
    source:
      "\\[letterboxdcard\\]([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\[\\/letterboxdcard\\]",
    replace:
      '<div class="letterboxd-card chat-media-card"><img class="letterboxd-card__poster chat-media" src="https://\\5" alt="\\1 poster" onerror="this.style.display=\'none\'"><div class="letterboxd-card__content"><div class="letterboxd-card__title">\\1 <span class="letterboxd-card__year">(\\2)</span></div><div class="letterboxd-card__rating">★ \\3</div><div class="letterboxd-card__overview">\\4</div></div></div>',
    flags: "g",
  },
];

function pcreStyleReplace(filters, text) {
  const list = Array.isArray(filters) ? filters : [filters];
  let out = text;
  for (const filter of list) {
    const re = new RegExp(filter.source, filter.flags);
    out = out.replace(re, (...args) => {
      const groups = args.slice(1, -2);
      return filter.replace.replace(/\\(\d+)/g, (_, n) => groups[Number(n) - 1] ?? "");
    });
  }
  return out;
}

test("letterboxd slug tag survives CyTube filters", () => {
  const tag = "[letterboxdcard]the-furious[/letterboxdcard]";
  const out = pcreStyleReplace(
    [
      {
        source: "\\[letterboxdcard\\]([a-zA-Z0-9-]+)\\[\\/letterboxdcard\\]",
        replace: "[letterboxdcard]\\1[/letterboxdcard]",
        flags: "g",
      },
    ],
    tag
  );
  assert.equal(out, tag);
});

test("letterboxd filter renders legacy card from encoded poster tag", () => {
  const tag =
    "[letterboxdcard]Hunter|2015|3.2|A rogue cop killer hunts the night.|a.ltrbxd.com/poster.jpg|hunter-2015[/letterboxdcard]";
  const out = pcreStyleReplace(letterboxdFilters, tag);
  assert.match(out, /letterboxd-card/);
  assert.match(out, /Hunter/);
  assert.match(out, /2015/);
  assert.match(out, /3\.2/);
  assert.match(out, /rogue cop killer/);
  assert.match(out, /https:\/\/a\.ltrbxd\.com\/poster\.jpg/);
  assert.match(out, /href="https:\/\/letterboxd\.com\/film\/hunter-2015\/"/);
});

test("letterboxd slug regex matches film urls", () => {
  const re = /https?:\/\/(?:www\.)?letterboxd\.com\/film\/([a-zA-Z0-9-]+)\/?/gi;
  const url = "https://letterboxd.com/film/hunter-2015/";
  const match = re.exec(url);
  assert.equal(match?.[1], "hunter-2015");
});
