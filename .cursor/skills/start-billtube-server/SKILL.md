---
name: billtube-local-dev
description: Starts the BillTube3-slim local asset dev server (build, watch, static host on :3000, channel snippet). Use when the user asks to run, start, or spin up local BillTube dev, npm run dev, the asset server, or test BillTube against local CyTube.
---

# BillTube Local Dev Server

Starts the BillTube3-slim Node asset server so CyTube can load fw, bundles, and CSS from localhost instead of jsDelivr.

## What `npm run dev` does

`scripts/dev.js` orchestrates:

1. Initial `npm run build` (bundles + `dist/billtube-fw.js`)
2. File watch on `src/` (modules, lib, config), `scss/` → rebuild on change
3. Static server (`scripts/dev-server.js`) on **127.0.0.1:3000** with CORS
4. Generates `dev/channel-settings.js` (localhost `CDN_BASE`, gitignored)

## Workflow

```
- [ ] 1. Confirm repo root (BillTube3-slim)
- [ ] 2. curl dist/billtube-fw.js — if 200, server already up; else check/free port 3000
- [ ] 3. Start dev server (background) only if step 2 was not 200
- [ ] 4. Verify endpoints
- [ ] 5. Report URLs + CyTube wiring (if relevant)
```

### 1. Repo root

```bash
cd <BillTube3-slim-root>
```

If `node_modules` is missing: `npm install` once.

### 2. Port check (before `npm run dev`)

Default port: **3000** (`PORT` or `BTFW_DEV_PORT` overrides).

**First, check whether a dev server is already healthy** — do not start a second one:

```powershell
curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:3000/dist/billtube-fw.js
```

If the response is **200**, port 3000 is already serving BillTube. Report the URLs below and stop — no need to run `npm run dev` again (a stale terminal or aborted task does not mean the server died).

**If port 3000 is in use but curl is not 200**, or you need a fresh watch process, free the port:

```powershell
netstat -ano | findstr "LISTENING" | findstr ":3000"
```

Note the PID in the last column, then:

```powershell
Stop-Process -Id <PID> -Force
```

Verify the port is free (`netstat` returns nothing), then start `npm run dev`.

**Alternative:** use another port without killing the existing process:

```powershell
$env:BTFW_DEV_PORT = "3001"
npm run dev
```

(then point CyTube channel JS at `http://127.0.0.1:3001`)

### 2b. `EADDRINUSE` on `npm run dev`

Typical cause: a leftover `node` dev server from an earlier `npm run dev` (background agent, closed terminal, or Ctrl+C in a different shell).

The initial **build still completes** before the listen step fails — bundles on disk are fine; only the server start failed.

Recovery (in order):

1. `curl` `http://127.0.0.1:3000/dist/billtube-fw.js` — if **200**, reuse the existing server; do not restart.
2. Else find and kill the listener (see port commands above), then `npm run dev` again.
3. Else set `BTFW_DEV_PORT` and update CyTube snippet port.

```powershell
Get-Process -Id <PID> | Format-List Id,ProcessName,Path
```

Usually `ProcessName` is `node` (often under Cursor’s bundled node).

### 3. Start (background)

Run in a **background** shell (`block_until_ms: 0`):

```bash
npm run dev
```

Do not block the conversation waiting for the process to exit — it runs until stopped.

Granular scripts (server-only or snippet-only):

| Script | Command |
|--------|---------|
| Full dev loop | `npm run dev` |
| Server only | `npm run dev:server` |
| Regenerate channel JS | `npm run dev:channel` |

### 4. Verify

After a short pause, confirm:

```bash
curl.exe -s -o NUL -w "%{http_code}" http://127.0.0.1:3000/dist/billtube-fw.js
```

Expect **200**. Also check:

- `http://127.0.0.1:3000/` — dev index with links
- `http://127.0.0.1:3000/dev/channel-settings.js` — CyTube channel snippet

In browser CyTube channel, console should show: `[BTFW] BASE: http://127.0.0.1:3000`

### 5. Report to user

Provide:

- Asset server: `http://127.0.0.1:3000/`
- Channel snippet: `http://127.0.0.1:3000/dev/channel-settings.js`
- Reminder: local CyTube (`sync` Docker on `:8080`) avoids HTTPS mixed-content blocks

## CyTube wiring (full stack)

BillTube dev server alone is not enough for end-to-end testing — CyTube must load the snippet.

1. Start BillTube: `npm run dev` (this skill)
2. Start CyTube: `docker compose up -d --build` from the `sync` repo (see `sync/.cursor/skills/start-cytube-docker/`)
3. Channel Settings → **Javascript** tab → paste contents of `dev/channel-settings.js` → Save JS

Do **not** use General → External Javascript for local dev — CyTube requires `https://` URLs only (`sync/src/channel/opts.js`).

Release `channel_config_settings.js` is never modified.

## Stop

- Kill the background terminal / `npm run dev` process (Ctrl+C in that terminal)
- Or free the port if a stale process remains:

```powershell
netstat -ano | findstr "LISTENING" | findstr ":3000"
Stop-Process -Id <PID> -Force
```

## Troubleshooting

| Symptom | Check |
|---------|--------|
| `EADDRINUSE` on port 3000 | Build may have succeeded; `curl` dist/billtube-fw.js — if 200, server is already up. Else `netstat` → `Stop-Process` → `npm run dev` (see §2b) |
| 404 on bundles | Run finished initial build? Check terminal for build errors |
| CyTube loads CDN assets | `io.domain` / channel snippet must point at `127.0.0.1:3000`, not jsDelivr |
| Mixed content blocked | Use local CyTube at `http://localhost:8080`, not `https://cytu.be` |
| Port in use | Reuse if healthy (`curl` 200), else `Stop-Process` or `BTFW_DEV_PORT` |
| PowerShell `&&` fails | Use `;` as separator |

## Related docs

- `BUILD.md` — local development section
- `sync/.cursor/skills/start-cytube-docker/` — CyTube Docker stack (sibling repo)
- `sync/docker/README.md` — first-time channel setup
