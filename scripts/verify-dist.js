import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { verifyCss } from "./build-css.js";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "dist/core.bundle.js",
  "dist/chat.bundle.js",
  "dist/player.bundle.js",
  "dist/playlist.bundle.js",
  "dist/admin.bundle.js",
  "dist/features.bundle.js"
];

const missing = required.filter((rel) => !fs.existsSync(path.join(rootDir, rel)));

if (missing.length) {
  console.error("Missing production bundles (run npm run build):");
  missing.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}

const coreBundle = fs.readFileSync(path.join(rootDir, "dist/core.bundle.js"), "utf8");
if (!/util:motion/.test(coreBundle)) {
  console.error("core.bundle.js does not define util:motion (add modules/util-motion.js to core bundle)");
  process.exit(1);
}

console.log("✓ All production bundles present");
console.log("✓ core.bundle.js includes util:motion");

if (!verifyCss()) {
  process.exit(1);
}
