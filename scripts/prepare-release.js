#!/usr/bin/env node
/**
 * semantic-release prepare orchestrator.
 * With SKIP_BUILD=1 (CI release job): verify existing dist artifacts, then inject CDN pin.
 * Otherwise: full `npm run build`, then inject CDN pin.
 * Kept as a script (not an npm one-liner) for cross-platform SKIP_BUILD branching.
 */

import { execSync } from "child_process";

const skipBuild = process.env.SKIP_BUILD === "1" || process.env.SKIP_BUILD === "true";

if (skipBuild) {
  console.log("SKIP_BUILD=1 — reusing CI build artifacts");
  execSync("npm run verify-dist", { stdio: "inherit" });
} else {
  execSync("npm run build", { stdio: "inherit" });
}

execSync("node scripts/inject-cdn-version.js", { stdio: "inherit" });
