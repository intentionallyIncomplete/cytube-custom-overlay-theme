/** Shared esbuild options for loader and feature bundles. */

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
    sourcemap: isDev ? "linked" : false,
    logLevel: "silent"
  };
}

export const MODULE_BUNDLE_BANNER = "var BTFW = globalThis.BTFW;";
