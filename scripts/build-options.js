/** Shared esbuild options for loader and feature bundles. */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

export function isDevBuild() {
  return process.env.BTFW_DEV === "1" || process.argv.includes("--dev");
}

export function getEsbuildBaseOptions(isDev) {
  // #202: version sourced from package.json at build time; injected into
  // bundles as the __BTFW_VERSION__ define (consumed by billtube-fw.ts).
  const { version } = JSON.parse(
    readFileSync(path.join(rootDir, "package.json"), "utf8")
  );
  return {
    target: ["es2018"],
    bundle: true,
    format: "iife",
    platform: "browser",
    minify: !isDev,
    treeShaking: true,
    legalComments: isDev ? "inline" : "none",
    drop: isDev ? [] : ["debugger"],
    sourcemap: isDev ? "linked" : false,
    logLevel: "silent",
    define: {
      __BTFW_VERSION__: JSON.stringify(version)
    }
  };
}

export const MODULE_BUNDLE_BANNER = "var BTFW = globalThis.BTFW;";
