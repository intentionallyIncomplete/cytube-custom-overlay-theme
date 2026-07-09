#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const scssDir = path.join(rootDir, "scss");
const cssDir = path.join(rootDir, "css");

const REQUIRED_CSS = [
  "tokens.css",
  "base.css",
  "navbar.css",
  "chat.css",
  "overlays.css",
  "player.css",
  "mobile.css",
  "boot-overlay.css"
];

export function buildCss() {
  if (!fs.existsSync(scssDir)) {
    console.warn("⚠ scss/ directory missing; skipping CSS build");
    return false;
  }

  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  const scssFiles = fs
    .readdirSync(scssDir)
    .filter((name) => name.endsWith(".scss") && !name.startsWith("_"));

  for (const name of scssFiles) {
    const inputPath = path.join(scssDir, name);
    const outputPath = path.join(cssDir, name.replace(/\.scss$/, ".css"));
    const result = sass.compile(inputPath, {
      style: "expanded",
      sourceMap: false,
      loadPaths: [scssDir]
    });
    fs.writeFileSync(outputPath, result.css, "utf8");
    console.log(`✓ Built css/${path.basename(outputPath)}`);
  }

  return true;
}

export function verifyCss() {
  const missing = REQUIRED_CSS.filter((name) => !fs.existsSync(path.join(cssDir, name)));
  if (missing.length) {
    console.error("Missing compiled CSS (run npm run build:css):");
    missing.forEach((f) => console.error(`  - css/${f}`));
    return false;
  }
  console.log("✓ All compiled CSS files present");
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildCss();
}
