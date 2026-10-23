#!/usr/bin/env node

/**
 * Dead-selector audit (issue #231).
 *
 * Builds the shipped CSS, crawls the fixture channel page (and optionally a
 * real channel page via --url) at desktop + mobile viewports, then reports
 * compiled selectors that never matched any element. Candidates are
 * "possibly dead" — review by hand before deleting anything.
 *
 * Usage:
 *   npm run audit:css
 *   npm run audit:css -- --url https://cytu.be/... --out audit-results.json
 *
 * The audit never writes into dist/: it only reads the compiled CSS after
 * `npm run build`, and it restores the generated root
 * channel_config_settings.js if the build rewrote it.
 */

import fs from "fs";
import path from "path";
import http from "http";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { chromium } from "@playwright/test";

import { parseCssSelectors, auditCoverage } from "./dead-selector-lib.js";
import {
  CSS_OUTPUT_DIR,
  REQUIRED_CSS,
} from "../src/lib/style-paths.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(scriptDir, "..");
const fixturePath = "/tests/fixtures/channel.html";
const PREVIEW_LIMIT = 60;
const viewports = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
];

// --- CLI ---------------------------------------------------------------

function printUsage() {
  console.log(`Usage: node scripts/audit-dead-selectors.js [options]

Options:
  --url <channel-url>  additionally crawl a real channel page (fixture-only
                       runs are the baseline; the channel crawl adds signal)
  --out <path>         write the full JSON report to this file
  --no-mobile          skip the mobile viewport crawl
  --help               show this help
`);
}

function parseArgs(argv) {
  const args = { url: null, out: null, mobile: true };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === "--help" || flag === "-h") {
      printUsage();
      process.exit(0);
    } else if (flag === "--url") {
      args.url = argv[i + 1];
      i += 1;
    } else if (flag === "--out") {
      args.out = argv[i + 1];
      i += 1;
    } else if (flag === "--no-mobile") {
      args.mobile = false;
    } else {
      console.error(`Unknown flag: ${flag}`);
      printUsage();
      process.exit(2);
    }
  }
  return args;
}

// --- Build -------------------------------------------------------------

/**
 * Generated paths that `npm run build` (re)writes. Release commits track
 * dist/ and the generated configs, so a local rebuild would dirty tracked
 * release artifacts; the audit snapshots them before building and restores
 * their previous bytes afterwards, leaving the worktree exactly as found.
 *
 * @type {readonly string[]}
 */
const GENERATED_BUILD_PATHS = Object.freeze([
  "channel_config_settings.js",
  "src/config/sri-hashes.json",
  "src/modules/user-release-notes.generated.js",
  "dist/billtube-fw.js",
  "dist/core.bundle.js",
  "dist/chat.bundle.js",
  "dist/player.bundle.js",
  "dist/playlist.bundle.js",
  "dist/admin.bundle.js",
  "dist/features.bundle.js",
  ...REQUIRED_CSS.map((name) => `${CSS_OUTPUT_DIR}/${name}`),
]);

function snapshotGeneratedFiles() {
  const snapshot = new Map();
  for (const relativePath of GENERATED_BUILD_PATHS) {
    const absolutePath = path.join(rootDir, relativePath);
    if (fs.existsSync(absolutePath)) {
      snapshot.set(absolutePath, fs.readFileSync(absolutePath, "utf8"));
    }
  }
  return snapshot;
}

function restoreGeneratedFiles(snapshot) {
  for (const [absolutePath, bytes] of snapshot) {
    fs.writeFileSync(absolutePath, bytes, "utf8");
  }
}

/**
 * Run `npm run build` and restore every generated artifact it rewrote.
 */
function runBuildPreservingGenerated() {
  const snapshot = snapshotGeneratedFiles();

  const result = spawnSync("npm", ["run", "build"], {
    cwd: rootDir,
    stdio: "inherit",
  });

  restoreGeneratedFiles(snapshot);
  if (result.status !== 0) {
    console.error(`Build failed (exit ${result.status}); aborting audit.`);
    process.exit(result.status === null ? 1 : result.status);
  }
}

// --- CSS parsing -------------------------------------------------------

function loadCssEntries() {
  const entries = [];
  for (const name of REQUIRED_CSS) {
    const cssPath = path.join(rootDir, CSS_OUTPUT_DIR, name);
    if (!fs.existsSync(cssPath)) {
      console.error(
        `Missing compiled CSS: ${CSS_OUTPUT_DIR}/${name} — run npm run build first`
      );
      process.exit(1);
    }
    const cssText = fs.readFileSync(cssPath, "utf8");
    entries.push({ file: name, selectors: parseCssSelectors(cssText) });
  }
  return entries;
}

function collectAllSelectors(entries) {
  const seen = new Set();
  const ordered = [];
  for (const entry of entries) {
    for (const record of entry.selectors) {
      if (!seen.has(record.selector)) {
        seen.add(record.selector);
        ordered.push(record.selector);
      }
    }
  }
  return ordered;
}

// --- Fixture server ----------------------------------------------------

async function findFreePort() {
  const server = http.createServer();
  const port = await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      resolve(server.address().port);
    });
  });
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitForHttpResponse(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { method: "HEAD" });
      if (response.status === 200) {
        return;
      }
    } catch {
      // Server not accepting connections yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function startFixtureServer() {
  const port = await findFreePort();
  const child = spawn("node", ["scripts/e2e-server.js"], {
    cwd: rootDir,
    env: { ...process.env, E2E_HOST: "127.0.0.1", E2E_PORT: String(port) },
    stdio: ["ignore", "ignore", "inherit"],
  });
  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitForHttpResponse(`${baseUrl}${fixturePath}`, 15_000);
  } catch (err) {
    child.kill();
    throw err;
  }
  return { child, baseUrl };
}

// --- Crawling ----------------------------------------------------------

async function collectMatchedSelectors(page, selectors) {
  const results = await page.evaluate((selectorList) => {
    const matched = [];
    for (const selector of selectorList) {
      let found = false;
      try {
        found = Boolean(document.querySelector(selector));
      } catch {
        // Selector unsupported by this browser engine — not a match.
      }
      matched.push(found);
    }
    return matched;
  }, selectors);

  const matched = new Set();
  for (let i = 0; i < selectors.length; i += 1) {
    if (results[i]) {
      matched.add(selectors[i]);
    }
  }
  return matched;
}

async function runInteractions(page, interactions) {
  if (interactions === null) {
    return false;
  }
  let ranAny = false;
  for (const interaction of interactions) {
    try {
      await interaction(page);
      ranAny = true;
    } catch {
      // A single interaction failing should not abort the crawl.
    }
  }
  return ranAny;
}

async function waitForFrameworkBoot(page) {
  await page
    .waitForSelector('[data-testid="btfw-grid"]', {
      state: "visible",
      timeout: 45_000,
    })
    .catch(() => {});
  await page
    .waitForSelector('[data-testid="btfw-boot-overlay"]', {
      state: "detached",
      timeout: 30_000,
    })
    .catch(() => {});
}

/**
 * Interaction passes for the fixture page: widen the DOM that plays with
 * the framework's own affordances (theme settings modal, tabs, hover chrome)
 * so modal- and state-scoped selectors get a chance to match.
 */
const fixtureInteractions = [
  async (page) => {
    await page.evaluate(() => {
      document.dispatchEvent(new CustomEvent("btfw:openThemeSettings"));
    });
    await page.waitForSelector("#btfw-theme-modal", {
      state: "visible",
      timeout: 15_000,
    });
  },
  async (page) => {
    await page.click('#btfw-ts-tabs li[data-tab="chat"] a', {
      timeout: 5_000,
    });
  },
  async (page) => {
    await page.selectOption("#btfw-emote-size", "big", { timeout: 5_000 });
  },
  async (page) => {
    await page.hover('[data-testid="btfw-video-stage"]', { timeout: 5_000 });
  },
  async (page) => {
    await page.focus('[aria-label="Chat message"]', { timeout: 5_000 });
  },
];

const channelInteractions = [
  async (page) => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  },
];

async function crawlUrl(browser, url, { selectors, waitForBoot, interactions, useMobile }) {
  const viewportList = useMobile ? viewports : [viewports[0]];
  const crawled = [];
  const matched = new Set();

  for (const viewport of viewportList) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
      if (waitForBoot) {
        await waitForFrameworkBoot(page);
      } else {
        await page.waitForTimeout(2_000);
      }
      const before = await collectMatchedSelectors(page, selectors);
      const reopened = await runInteractions(page, interactions);
      const after = reopened
        ? await collectMatchedSelectors(page, selectors)
        : new Set();
      for (const selector of before) {
        matched.add(selector);
      }
      for (const selector of after) {
        matched.add(selector);
      }
      crawled.push({ name: viewport.name, matchedCount: matched.size });
      console.log(
        `  ✓ ${viewport.name}: ${matched.size}/${selectors.length} selectors matched`
      );
    } finally {
      await context.close();
    }
  }
  return { crawled, matched };
}

// --- Reporting ---------------------------------------------------------

function printReport(coverage, contexts, args) {
  const { distinct, files } = coverage;
  console.log("");
  console.log(
    `Crawl contexts: ${
      contexts.length === 0
        ? "none"
        : contexts
            .map((c) => `${c.page}/${c.name} (${c.matchedCount})`)
            .join(", ")
    }`
  );
  console.log(`Distinct compiled selectors: ${distinct.selectors}`);
  console.log(`Matched at least once:        ${distinct.matched}`);
  console.log(`Never matched (candidates):   ${distinct.candidates}`);
  console.log("");
  console.log("Per stylesheet:");
  for (const file of files) {
    const total = String(file.total);
    const matched = String(file.matched);
    const candidates = String(file.candidates.length);
    console.log(
      `  ${file.file.padEnd(18)} total ${total.padStart(5)} · matched ${matched.padStart(5)} · candidates ${candidates.padStart(5)}`
    );
  }

  let mediaScoped = 0;
  const preview = [];
  for (const file of files) {
    for (const candidate of file.candidates) {
      if (candidate.mediaContext !== "") {
        mediaScoped += 1;
      }
      const scope =
        candidate.mediaContext === ""
          ? "top-level"
          : `@@ ${candidate.mediaContext}`;
      preview.push(`  [${file.file}] ${candidate.selector}  ${scope}`);
    }
  }

  console.log("");
  console.log(
    `Never-matched candidates: ${distinct.candidates} distinct (${mediaScoped} inside @media/@supports)`
  );
  console.log(
    "Review before deleting anything — candidates are UNPROVEN dead selectors."
  );
  console.log(
    `Preview (${Math.min(preview.length, PREVIEW_LIMIT)} of ${preview.length}):`
  );
  console.log(preview.slice(0, PREVIEW_LIMIT).join("\n"));
  if (args.url === null) {
    console.log("");
    console.log(
      "Hint: run with --url <channel-url> to crawl the live channel page for a deeper signal."
    );
  }
}

function writeJsonReport(outPath, coverage, contexts, args) {
  const report = {
    generatedAt: new Date().toISOString(),
    command: "audit-dead-selectors",
    fixture: { path: fixturePath, viewports: viewports.map((v) => v.name) },
    channelUrl: args.url,
    contexts,
    files: coverage.files,
    totals: coverage.totals,
    distinct: coverage.distinct,
  };
  fs.writeFileSync(
    path.resolve(rootDir, outPath),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );
  console.log(`\nFull report written to ${outPath}`);
}

// --- Entry -------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log("🔎 Dead-selector audit (issue #231)");
  console.log(`Building the shipped CSS + JS bundles...`);
  runBuildPreservingGenerated();

  const entries = loadCssEntries();
  const selectors = collectAllSelectors(entries);
  console.log(
    `Parsed ${entries.length} stylesheets → ${selectors.length} distinct compiled selectors`
  );

  let serverChild = null;
  let browser = null;
  let contexts = [];
  const matchedEverywhere = new Set();
  try {
    const { child, baseUrl } = await startFixtureServer();
    serverChild = child;
    console.log(`Fixture server up on ${baseUrl}`);

    browser = await chromium.launch({ headless: true });
    console.log("Crawling fixture page...");
    const fixtureResult = await crawlUrl(browser, `${baseUrl}${fixturePath}`, {
      selectors,
      waitForBoot: true,
      interactions: fixtureInteractions,
      useMobile: args.mobile,
    });
    contexts = fixtureResult.crawled.map((c) => ({ page: "fixture", ...c }));
    for (const selector of fixtureResult.matched) {
      matchedEverywhere.add(selector);
    }

    if (args.url !== null) {
      console.log(`Crawling channel page ${args.url}...`);
      const channelResult = await crawlUrl(browser, args.url, {
        selectors,
        waitForBoot: false,
        interactions: channelInteractions,
        useMobile: args.mobile,
      });
      contexts.push(...channelResult.crawled.map((c) => ({ page: "channel", ...c })));
      for (const selector of channelResult.matched) {
        matchedEverywhere.add(selector);
      }
    }

    const coverage = auditCoverage(entries, matchedEverywhere);
    printReport(coverage, contexts, args);
    if (args.out !== null) {
      writeJsonReport(args.out, coverage, contexts, args);
    }
  } finally {
    if (browser !== null) {
      await browser.close();
    }
    if (serverChild !== null) {
      serverChild.kill();
    }
  }
}

main().catch((err) => {
  console.error(`Audit failed: ${err.message}`);
  process.exit(1);
});