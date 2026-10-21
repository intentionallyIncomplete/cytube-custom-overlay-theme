#!/usr/bin/env node
/**
 * Issue #202 storage-access audit.
 *
 * Enforces the storage consolidation contract:
 *  1. Direct localStorage access is confined to the allowlisted seam files
 *     (the constants registry, the guarded wrapper, and stack-core's typed
 *     persistence helpers). Everything else must go through src/lib/storage.ts.
 *  2. This script's allowlist and eslint's storageDirectAllowList stay in sync.
 *
 * Any NEW storage key literal has to appear next to a localStorage call, so
 * confining the calls confines the keys to the LS_KEYS registry. Run with
 * `npm run verify:keys`.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

// Keep in sync with storageDirectAllowList in eslint.config.js
const ALLOWLIST = [
  "src/lib/btfw-constants.js",
  "src/lib/storage.ts",
  "src/lib/stack-core.ts",
];

function listFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      // src/workers is server-side Cloudflare Workers code (mirrors eslint
      // ignores) — localStorage is a browser-only concept there.
      if (name === "node_modules" || name === "dist" || name === ".git" || name === "workers") continue;
      listFiles(full, out);
    } else if (name.endsWith(".js") || name.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

const files = ["src", "scripts"].flatMap((d) => listFiles(path.join(rootDir, d)));
const allowSet = new Set(ALLOWLIST.map((p) => path.join(rootDir, p)));

const problems = [];
for (const file of files) {
  const rel = path.relative(rootDir, file).replace(/\\/g, "/");
  const selfExempt = rel === "scripts/check-storage-keys.js";
  if (allowSet.has(file) || selfExempt) continue;
  const src = readFileSync(file, "utf8");
  // Strip block comments and full-line // comments so prose like
  // "rehydrate from localStorage" in docs does not trip the audit. Inline
  // trailing comments are NOT stripped (only conservative parsing here —
  // code before a `//` on the same line still counts).
  let inBlockComment = false;
  const codeLines = [];
  for (const rawLine of src.split("\n")) {
    const trimmed = rawLine.trim();
    if (inBlockComment) {
      if (trimmed.includes("*/")) inBlockComment = false;
      continue;
    }
    if (trimmed.startsWith("/*")) {
      if (!trimmed.includes("*/") || trimmed.indexOf("*/") === trimmed.indexOf("/*") + 1) {
        // may close on the same line
        if (!trimmed.includes("*/")) { inBlockComment = true; continue; }
      }
      if (!trimmed.slice(trimmed.indexOf("*/") + 2).trim()) continue;
    }
    if (trimmed.startsWith("//")) continue;
    if (trimmed.startsWith("*")) continue; // block-comment continuation
    codeLines.push(rawLine);
  }
  if (/\blocalStorage\b/.test(codeLines.join("\n"))) {
    problems.push(
      `${rel}: direct localStorage access — use src/lib/storage.ts helpers with LS_KEYS keys (or add the file to BOTH allowlists deliberately)`
    );
  }
}

// Allowlist sync between this script and eslint.config.js
const eslintConfig = readFileSync(path.join(rootDir, "eslint.config.js"), "utf8");
const eslintListBlock = eslintConfig.match(/storageDirectAllowList\s*=\s*\[([^\]]*)\]/);
if (!eslintListBlock) {
  problems.push("check-storage-keys: storageDirectAllowList not found in eslint.config.js");
} else {
  const eslintEntries = [...eslintListBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  for (const entry of ALLOWLIST) {
    if (!eslintEntries.includes(entry)) {
      problems.push(`check-storage-keys: ${entry} missing from storageDirectAllowList in eslint.config.js`);
    }
  }
  for (const entry of eslintEntries) {
    if (!ALLOWLIST.includes(entry)) {
      problems.push(`check-storage-keys: ${entry} in eslint allowlist but not in scripts/check-storage-keys.js`);
    }
  }
}

if (problems.length) {
  console.error(`✗ storage access audit failed (${problems.length}):`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log("✓ storage access: raw localStorage confined to the allowlisted seam files");
