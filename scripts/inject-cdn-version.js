import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const REPO = "intentionallyIncomplete/BillTube3-slim";
const CONFIG = "channel_config_settings.js";
const commit = process.argv.includes("--commit");

const version = JSON.parse(readFileSync("package.json", "utf8")).version;
const tag = `v${version}`;
const cdnRef = `@${tag}`;

let content = readFileSync(CONFIG, "utf8");
const updated = content
  .replaceAll("@__VERSION__", cdnRef)
  .replace(
    new RegExp(`gh/${REPO.replace("/", "\\/")}@[^/"']+`, "g"),
    `gh/${REPO}@${tag}`
  );

if (content === updated) {
  console.log(`CDN already pinned to ${tag}`);
  process.exit(0);
}

writeFileSync(CONFIG, updated);
console.log(`Pinned ${CONFIG} to ${tag}`);

if (!commit) {
  process.exit(0);
}

execSync('git config user.email "ci@github.com"', { stdio: "inherit" });
execSync('git config user.name "GitHub Actions"', { stdio: "inherit" });
execSync("git add channel_config_settings.js", { stdio: "inherit" });
try {
  execSync("git diff --cached --quiet");
  console.log("Nothing to commit");
  process.exit(0);
} catch {
  // staged changes present
}
execSync(`git commit -m "chore: pin CDN to ${tag} [skip ci]"`, { stdio: "inherit" });
execSync("git push", { stdio: "inherit" });
