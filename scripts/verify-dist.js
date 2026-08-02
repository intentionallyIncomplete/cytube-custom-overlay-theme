import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { verifyCss } from "./build-css.js";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "dist/billtube-fw.js",
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

const featuresBundle = fs.readFileSync(path.join(rootDir, "dist/features.bundle.js"), "utf8");
if (!/feature:themeSettings/.test(featuresBundle)) {
  console.error(
    "features.bundle.js does not define feature:themeSettings (viewer themes must not live in gated admin.bundle)"
  );
  process.exit(1);
}
if (!/feature:channelOptionsApply/.test(featuresBundle)) {
  console.error(
    "features.bundle.js does not define feature:channelOptionsApply (Channel Options dirty→Apply must ship to viewers/mods)"
  );
  process.exit(1);
}

const adminBundle = fs.readFileSync(path.join(rootDir, "dist/admin.bundle.js"), "utf8");
if (!/feature:channelThemeAdmin/.test(adminBundle)) {
  console.error("admin.bundle.js does not define feature:channelThemeAdmin");
  process.exit(1);
}
if (/feature:themeSettings/.test(adminBundle)) {
  console.error(
    "admin.bundle.js still defines feature:themeSettings — move viewer settings to features.bundle (#197)"
  );
  process.exit(1);
}

console.log("✓ All production bundles present");
console.log("✓ core.bundle.js includes util:motion");
console.log("✓ features.bundle.js includes feature:themeSettings");
console.log("✓ features.bundle.js includes feature:channelOptionsApply");
console.log("✓ admin.bundle.js is admin-only (channelThemeAdmin, no themeSettings)");

if (!verifyCss()) {
  process.exit(1);
}
