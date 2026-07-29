#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";

import {
  CSS_OUTPUT_DIR,
  REQUIRED_CSS,
  STYLE_SOURCE_DIR,
} from "../src/lib/style-paths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

export {
  CSS_ASSET_PATHS,
  CSS_OUTPUT_DIR,
  REQUIRED_CSS,
  STYLE_SOURCE_DIR,
} from "../src/lib/style-paths.js";

const scssDir = path.join(rootDir, STYLE_SOURCE_DIR);
const cssDir = path.join(rootDir, CSS_OUTPUT_DIR);

export function buildCss() {
  if (!fs.existsSync(scssDir)) {
    console.warn(`⚠ ${STYLE_SOURCE_DIR}/ directory missing; skipping CSS build`);
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
    console.log(`✓ Built ${CSS_OUTPUT_DIR}/${path.basename(outputPath)}`);
  }

  return true;
}

export function verifyCss() {
  const missing = REQUIRED_CSS.filter(
    (name) => !fs.existsSync(path.join(cssDir, name))
  );
  if (missing.length) {
    console.error("Missing compiled CSS (run npm run build:css):");
    missing.forEach((f) => console.error(`  - ${CSS_OUTPUT_DIR}/${f}`));
    return false;
  }
  console.log("✓ All compiled CSS files present");
  return true;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildCss();
}
