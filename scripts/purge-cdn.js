import { readFileSync } from "fs";

import { CDN_ASSET_PATHS, CDN_REPO } from "../src/lib/cdn-deploy.js";

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const tag = `v${version}`;

let failed = 0;

for (const file of CDN_ASSET_PATHS) {
  const url = `https://purge.jsdelivr.net/gh/${CDN_REPO}@${tag}/${file}`;
  const res = await fetch(url);
  const ok = res.ok;
  console.log(`${ok ? "✓" : "✗"} purge ${tag}/${file} (${res.status})`);
  if (!ok) failed++;
}

if (failed) {
  process.exit(1);
}
