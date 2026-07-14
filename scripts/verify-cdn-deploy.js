#!/usr/bin/env node

import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  buildCdnUrl,
  CDN_ASSET_PATHS,
  CDN_REPO,
  sleep,
  verifyAssetContent,
  verifyChannelConfigPin,
} from "../src/lib/cdn-deploy.js";

const DEFAULT_ATTEMPTS = 8;
const DEFAULT_DELAY_MS = 5000;

/**
 * @param {string} url
 * @param {{ attempts?: number, delayMs?: number }} [options]
 */
export async function fetchCdnAsset(url, options = {}) {
  const attempts = options.attempts ?? DEFAULT_ATTEMPTS;
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
  let lastStatus = 0;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    const res = await fetch(url, { redirect: "follow" });
    lastStatus = res.status;
    if (res.ok) {
      return { ok: true, status: res.status, body: await res.text() };
    }
    if (attempt < attempts) {
      console.log(`  retry ${attempt}/${attempts - 1} (${res.status}) ${url}`);
      await sleep(delayMs);
    }
  }

  return { ok: false, status: lastStatus, body: "" };
}

/**
 * @param {string} tag
 * @param {{ repo?: string, attempts?: number, delayMs?: number }} [options]
 */
export async function verifyCdnDeploy(tag, options = {}) {
  const repo = options.repo ?? CDN_REPO;
  const attempts = options.attempts;
  const delayMs = options.delayMs;
  const failures = [];

  console.log(`Verifying jsDelivr deploy for ${repo}@${tag.replace(/^@/, "")}...\n`);

  for (const filePath of CDN_ASSET_PATHS) {
    const url = buildCdnUrl(repo, tag, filePath);
    const fetched = await fetchCdnAsset(url, { attempts, delayMs });

    if (!fetched.ok) {
      failures.push(`${filePath}: HTTP ${fetched.status}`);
      console.log(`✗ ${filePath} (${fetched.status})`);
      continue;
    }

    const contentCheck = verifyAssetContent(filePath, fetched.body);
    if (!contentCheck.ok) {
      failures.push(`${filePath}: ${contentCheck.reason}`);
      console.log(`✗ ${filePath} — ${contentCheck.reason}`);
      continue;
    }

    if (filePath === "channel_config_settings.js") {
      const pinCheck = verifyChannelConfigPin(fetched.body, tag);
      if (!pinCheck.ok) {
        failures.push(pinCheck.reason);
        console.log(`✗ ${filePath} — ${pinCheck.reason}`);
        continue;
      }
    }

    console.log(`✓ ${filePath}`);
  }

  return { ok: failures.length === 0, failures };
}

function readTagFromArgs() {
  const tagArg = process.argv.find((arg) => arg.startsWith("--tag="));
  if (tagArg) {
    return tagArg.slice("--tag=".length).replace(/^@/, "");
  }
  const version = JSON.parse(readFileSync("package.json", "utf8")).version;
  return `v${version}`;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const tag = readTagFromArgs();
  const { ok, failures } = await verifyCdnDeploy(tag);

  if (!ok) {
    console.error("\nCDN deploy verification failed:");
    failures.forEach((line) => console.error(`  - ${line}`));
    process.exit(1);
  }

  console.log("\n✓ CDN deploy verification passed");
}
