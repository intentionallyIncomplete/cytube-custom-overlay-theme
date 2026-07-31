#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

import {
  CHANNEL_CONFIG_CDN_REPO,
  CHANNEL_CONFIG_ROOT_PATH,
  CHANNEL_CONFIG_SOURCE_PATH,
  pinChannelConfigContent,
  verifyChannelConfigSource,
  verifyPinnedChannelConfig,
} from "../src/lib/channel-config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const CONFIG_SRC = path.join(rootDir, CHANNEL_CONFIG_SOURCE_PATH);
const CONFIG_OUT = path.join(rootDir, CHANNEL_CONFIG_ROOT_PATH);
const commit = process.argv.includes("--commit");

const version = JSON.parse(
  readFileSync(path.join(rootDir, "package.json"), "utf8")
).version;
const tag = `v${version}`;

const source = readFileSync(CONFIG_SRC, "utf8");
const sourceCheck = verifyChannelConfigSource(source);
if (!sourceCheck.ok) {
  console.error(`✗ ${sourceCheck.reason}`);
  process.exit(1);
}

const updated = pinChannelConfigContent(source, version, CHANNEL_CONFIG_CDN_REPO);
const pinCheck = verifyPinnedChannelConfig(updated, tag);
if (!pinCheck.ok) {
  console.error(`✗ ${pinCheck.reason}`);
  process.exit(1);
}

writeFileSync(CONFIG_OUT, updated, "utf8");
if (source === updated) {
  console.log(`CDN already pinned to ${tag}`);
} else {
  console.log(
    `Pinned ${path.relative(rootDir, CONFIG_OUT)} to ${tag} (from ${CHANNEL_CONFIG_SOURCE_PATH})`
  );
}

if (!commit) {
  process.exit(0);
}

execSync('git config user.email "ci@github.com"', { stdio: "inherit" });
execSync('git config user.name "GitHub Actions"', { stdio: "inherit" });
execSync(`git add ${CHANNEL_CONFIG_ROOT_PATH}`, { stdio: "inherit" });
try {
  execSync("git diff --cached --quiet");
  console.log("Nothing to commit");
  process.exit(0);
} catch {
  // staged changes present
}
execSync(`git commit -m "chore: pin CDN to ${tag} [skip ci]"`, {
  stdio: "inherit",
});
execSync("git push", { stdio: "inherit" });
