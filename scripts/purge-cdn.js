import { readFileSync } from "fs";

const REPO = "intentionallyIncomplete/BillTube3-slim";
const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const tag = `v${version}`;

const FILES = [
  "channel_config_settings.js",
  "billtube-fw.js",
  "dist/core.bundle.js",
  "dist/chat.bundle.js",
  "dist/player.bundle.js",
  "dist/playlist.bundle.js",
  "dist/admin.bundle.js",
  "dist/features.bundle.js",
  "css/tokens.css",
  "css/base.css",
  "css/navbar.css",
  "css/chat.css",
  "css/overlays.css",
  "css/player.css",
  "css/mobile.css",
  "css/boot-overlay.css"
];

let failed = 0;

for (const file of FILES) {
  const url = `https://purge.jsdelivr.net/gh/${REPO}@${tag}/${file}`;
  const res = await fetch(url);
  const ok = res.ok;
  console.log(`${ok ? "✓" : "✗"} purge ${tag}/${file} (${res.status})`);
  if (!ok) failed++;
}

if (failed) {
  process.exit(1);
}
