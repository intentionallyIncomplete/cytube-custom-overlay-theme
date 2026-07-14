#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || process.env.BTFW_DEV_PORT || 3000);
const CDN_BASE = `http://127.0.0.1:${PORT}`;
const SOURCE = path.join(rootDir, "src", "config", "channel_config_settings.js");
const OUT_DIR = path.join(rootDir, "dev");
const OUT_FILE = path.join(OUT_DIR, "channel-settings.js");

const source = fs.readFileSync(SOURCE, "utf8");
const updated = source.replace(
  /const CDN_BASE = "[^"]+";/,
  `const CDN_BASE = "${CDN_BASE}";`
);

if (updated === source) {
  console.error("Could not rewrite CDN_BASE in src/config/channel_config_settings.js");
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, updated, "utf8");

console.log(`Wrote ${path.relative(rootDir, OUT_FILE)}`);
console.log(`CDN_BASE = ${CDN_BASE}`);
console.log("");
console.log("CyTube setup:");
console.log("  Channel Settings → Javascript tab → paste dev/channel-settings.js → Save JS");
console.log("  (External Javascript requires https:// — not usable for local http dev server)");
