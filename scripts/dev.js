#!/usr/bin/env node

import { spawn, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || process.env.BTFW_DEV_PORT || 3000);

const WATCH_PATHS = [
  "modules",
  "src",
  "lib",
  "scss",
  "user-release-notes.json"
];

function shouldIgnoreWatch(filename) {
  const base = path.basename(String(filename).replace(/\\/g, "/"));
  if (base.endsWith(".test.js")) return true;
  if (base.endsWith(".generated.js")) return true;
  return false;
}

function runBuild() {
  const result = spawnSync(process.execPath, ["scripts/build.js"], {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, BTFW_DEV: "1" }
  });
  return result.status === 0;
}

function generateChannel() {
  spawnSync(process.execPath, ["scripts/generate-dev-channel.js"], {
    cwd: rootDir,
    stdio: "inherit",
    env: { ...process.env, BTFW_DEV_PORT: String(PORT) }
  });
}

function watchAndRebuild() {
  let timer = null;
  let building = false;
  let pending = false;

  const schedule = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      if (building) {
        pending = true;
        return;
      }
      building = true;
      console.log("\n[dev] Rebuilding...");
      const ok = runBuild();
      if (ok) {
        generateChannel();
      }
      building = false;
      if (pending) {
        pending = false;
        schedule();
      }
    }, 250);
  };

  for (const rel of WATCH_PATHS) {
    const target = path.join(rootDir, rel);
    if (!fs.existsSync(target)) {
      continue;
    }
    fs.watch(target, { recursive: true }, (_event, filename) => {
      if (!filename || shouldIgnoreWatch(filename)) {
        return;
      }
      schedule();
    });
  }
}

console.log("[dev] Initial build...");
if (!runBuild()) {
  process.exit(1);
}
generateChannel();

const server = spawn(process.execPath, ["scripts/dev-server.js"], {
  cwd: rootDir,
  stdio: "inherit",
  env: { ...process.env, BTFW_DEV_PORT: String(PORT) }
});

watchAndRebuild();

console.log("");
console.log(`Dev assets:  http://127.0.0.1:${PORT}/`);
console.log(`Channel JS:  http://127.0.0.1:${PORT}/dev/channel-settings.js`);
console.log("Edit modules/, src/, scss/ — rebuild is automatic.");
console.log("Press Ctrl+C to stop.");

function shutdown() {
  server.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

server.on("exit", (code) => {
  process.exit(code ?? 0);
});
