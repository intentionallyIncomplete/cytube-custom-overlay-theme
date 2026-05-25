import { readFileSync } from "fs";

const REPO = "intentionallyIncomplete/BillTube3-slim";
const FILES = ["channel_config_settings.js", "billtube-fw.js"];

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const tag = `v${version}`;

for (const file of FILES) {
  const url = `https://purge.jsdelivr.net/gh/${REPO}@${tag}/${file}`;
  const res = await fetch(url);
  console.log(`${res.ok ? "✓" : "✗"} purge ${tag}/${file} (${res.status})`);
}
