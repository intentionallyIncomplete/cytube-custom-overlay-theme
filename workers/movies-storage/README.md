# movies-storage worker

Cloudflare Worker for BillTube movie requests.

## Deploy

```bash
cd workers/movies-storage
npm install
npx wrangler kv namespace create MOVIE_SUGGESTIONS   # first time only
npx wrangler secret put TMDB_API_KEY
npx wrangler secret put GIPHY_API_KEY
npx wrangler secret put KLIPY_APP_KEY
npm run deploy
```

## API

### Legacy (replaces movie-suggestions-worker.billtube.workers.dev)

| Method | Path | Response |
|--------|------|----------|
| GET | `/` | `[{ key, movieId, movieTitle, username, posterPath, up, down, ts }]` |
| POST | `/` | same fields in body → saved record |

### New (BillTube3-slim client)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/search` | TMDB search/discover with pagination |
| GET | `/api/history` | Paginated suggestion history |
| GET | `/api/tmdb/*` | Generic TMDB proxy (key stays on worker) |
| GET | `/api/giphy/search` | Giphy search (`q`, `limit`, `rating`) |
| GET | `/api/giphy/trending` | Giphy trending (`limit`, `rating`) |
| GET | `/api/klipy/search` | KLIPY search (`q`, `page`, `per_page`, `customer_id`, `locale`, `content_filter`) |
| GET | `/api/klipy/trending` | KLIPY trending (`page`, `per_page`, `customer_id`, `locale`, `content_filter`) |
| POST | `/api/klipy/share/{slug}` | KLIPY share attribution (`customer_id`, optional `q` in JSON body) |
| GET | `/api/letterboxd/film/{slug}` | Letterboxd film metadata (OG scrape) |
| POST | `/api/suggestions` | Save a suggestion |

## Verify

```bash
curl https://empty-bar-d620.movies-storage-a.workers.dev/
curl "https://empty-bar-d620.movies-storage-a.workers.dev/api/tmdb/search/movie?query=Fight%20Club"
curl "https://empty-bar-d620.movies-storage-a.workers.dev/api/giphy/trending?limit=5"
curl "https://empty-bar-d620.movies-storage-a.workers.dev/api/klipy/trending?per_page=5&customer_id=dev"
curl "https://empty-bar-d620.movies-storage-a.workers.dev/api/letterboxd/film/hunter-2015"
```
