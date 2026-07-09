#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as sass from "sass";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const scssDir = path.join(rootDir, "scss");
const cssDir = path.join(rootDir, "css");

const SCSS_SYNTAX = /(\$[\w-]+\s*:|@mixin\s|@include\s|@use\s|@forward\s|&[\w.:#[\]-])/;

function needsSassProcessing(source) {
  return SCSS_SYNTAX.test(source);
}

export function buildCss() {
  if (!fs.existsSync(scssDir)) {
    console.warn("⚠ scss/ directory missing; skipping CSS build");
    return;
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
    const source = fs.readFileSync(inputPath, "utf8");
    const css = needsSassProcessing(source)
      ? sass.compile(inputPath, { style: "expanded", sourceMap: false }).css
      : source;
    fs.writeFileSync(outputPath, css, "utf8");
    console.log(`✓ Built css/${path.basename(outputPath)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildCss();
}
