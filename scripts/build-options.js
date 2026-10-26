/** Shared esbuild options for loader and feature bundles. */

import { readFileSync } from "fs";

// __BTFW_VERSION__ is declared in src/btfw-globals.d.ts and substituted at
// bundle time (#242): the loader logs it and publishes it on btfw:ready.
const PKG = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

export function isDevBuild() {
  return process.env.BTFW_DEV === "1" || process.argv.includes("--dev");
}

export function getEsbuildBaseOptions(isDev) {
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
    define: { __BTFW_VERSION__: JSON.stringify(PKG.version) },
    logLevel: "silent"
  };
}

export const MODULE_BUNDLE_BANNER = "var BTFW = globalThis.BTFW;";
