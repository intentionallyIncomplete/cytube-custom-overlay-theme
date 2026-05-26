import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

console.log("✓ All production bundles present");
