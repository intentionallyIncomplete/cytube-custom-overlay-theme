# BillTube E2E test target

Stable Playwright target for overlay regression tests ([#171](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/171)).

## Modes

| Mode | Command | Target |
|------|---------|--------|
| Fixture (default) | `npm run test:e2e` | Static CyTube-like page + local asset server |
| Full stack (local) | `E2E_BASE_URL=http://localhost:8080/r/<channel> npm run test:e2e` | CyTube Docker from `sync` + BillTube dev server |

## Smoke suite ([#170](https://github.com/intentionallyIncomplete/cytube-custom-overlay-theme/issues/170))

`e2e/smoke/overlay-smoke.spec.js` covers:

- App boot (grid ready, boot overlay dismissed)
- Overlay load (video stage, video overlay, chat column)
- Chat / player rendering (chat chrome, message buffer, player shell)
- Failure path (core bundle abort → boot error status)

`e2e/helpers/boot.js` shared `gotoFixtureAndBoot()` waits on `data-testid` hooks — no console-string coupling.

## Fixture server (CI + local default)

1. `npm run build`
2. `npm run test:e2e`

`playwright.config.js` starts `scripts/e2e-server.js` on `127.0.0.1:3099` unless `E2E_BASE_URL` is set.

- Fixture page: `http://127.0.0.1:3099/e2e/fixture/channel.html`
- Serves built `dist/` and `css/` from the repo root
- `e2e/fixture/cytube-stubs.js` mocks `socket`, `CHANNEL`, `PLAYER`, `videojs`, and jQuery

Manual server only:

```bash
npm run build
npm run e2e:server
```

Override port/host with `E2E_PORT` / `E2E_HOST`.

## Full CyTube stack (optional)

Use when tests need real Socket.IO / playback behavior.

1. From `sync`: `docker compose up -d --build` (see `sync/.cursor/skills/start-cytube-docker/`)
2. From this repo: `npm run dev` (asset server on `:3000`)
3. CyTube channel → Javascript tab → paste `dev/channel-settings.js` → Save JS
4. Run Playwright against the live channel:

```bash
E2E_BASE_URL=http://localhost:8080/r/billtube-dev npm run test:e2e
```

`E2E_BASE_URL` disables the built-in fixture web server. Point `E2E_FIXTURE_PATH` at a channel path if needed (default fixture path is only used when `E2E_BASE_URL` is unset).

## CI

`.github/workflows/ci.yml` job `e2e` builds artifacts, installs Chromium, and runs `npm run test:e2e` against the fixture server.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `E2E_BASE_URL` | _(unset)_ | External CyTube URL; skips fixture web server |
| `E2E_HOST` | `127.0.0.1` | Fixture server bind address |
| `E2E_PORT` | `3099` | Fixture server port |
| `E2E_FIXTURE_PATH` | `/e2e/fixture/channel.html` | Path appended to `baseURL` in smoke tests |
