import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const REPO = "intentionallyIncomplete/cytube-custom-overlay-theme";
const CONFIG_SRC = path.join(rootDir, "src", "config", "channel_config_settings.js");
const CONFIG_OUT = path.join(rootDir, "channel_config_settings.js");
const commit = process.argv.includes("--commit");

const version = JSON.parse(readFileSync(path.join(rootDir, "package.json"), "utf8")).version;
const tag = `v${version}`;
const cdnRef = `@${tag}`;

let content = readFileSync(CONFIG_SRC, "utf8");
const updated = content
  .replaceAll("@__VERSION__", cdnRef)
  .replace(
    new RegExp(`gh/${REPO.replace("/", "\\/")}@[^/"']+`, "g"),
    `gh/${REPO}@${tag}`
  );

if (content === updated) {
  console.log(`CDN already pinned to ${tag}`);
  writeFileSync(CONFIG_OUT, updated, "utf8");
  process.exit(0);
}

writeFileSync(CONFIG_OUT, updated, "utf8");
console.log(`Pinned ${path.relative(rootDir, CONFIG_OUT)} to ${tag} (from src/config)`);

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
