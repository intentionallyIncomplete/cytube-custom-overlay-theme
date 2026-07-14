# vidprox — CORS video proxy

Fallback proxy for BillTube audio boost/normalization when direct media URLs lack CORS headers.

## Deploy

```bash
cd src/workers/vidprox
npm install
npm run deploy
```

Default client URL: `https://vidprox.billtube.workers.dev/?url=`

Override in channel config: `BTFW_CONFIG.corsVideoProxy`

## API

```
GET /?url=<encodeURIComponent(videoUrl)>
```

Supports `Range` / `206` for seeking. Response includes `Access-Control-Allow-Origin: *`.
