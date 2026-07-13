#!/usr/bin/env node

import { execSync } from "child_process";

const skipBuild = process.env.SKIP_BUILD === "1" || process.env.SKIP_BUILD === "true";

if (skipBuild) {
  console.log("SKIP_BUILD=1 — reusing CI build artifacts");
  execSync("npm run verify-dist", { stdio: "inherit" });
} else {
  execSync("npm run build", { stdio: "inherit" });
}

execSync("node scripts/inject-cdn-version.js", { stdio: "inherit" });
