import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const configDir = path.join(rootDir, "src", "config");
const outFile = path.join(configDir, "sri-hashes.json");

// CDN assets used across the project
const CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/bootswatch@3.4.1/slate/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css",
  "https://cdn.jsdelivr.net/gh/ElBeyonder/font-awesome-6.5.2-pro-full@master/css/all.css",
  "https://cdn.jsdelivr.net/npm/@videojs/themes@1/dist/city/index.css",
  "https://unpkg.com/@videojs/themes@1/dist/city/index.css",
  "https://vjs.zencdn.net/7.20.3/video-js.css",
  "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.20/summernote-lite.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js",
  "https://cdn.jsdelivr.net/npm/emoji.json@13.1.0/emoji.json",
  "https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js" // TW_VER is 14.0.2
];

function generateHash(buffer) {
  const hash = crypto.createHash("sha384").update(buffer).digest("base64");
  return `sha384-${hash}`;
}

async function fetchCdnHash(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return generateHash(buffer);
  } catch (err) {
    console.warn(`[SRI] ⚠ Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

function getLocalFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getLocalFiles(filePath, fileList);
    } else if (
      (filePath.endsWith(".js") || filePath.endsWith(".css")) &&
      !file.includes("billtube-fw.js") // Don't hash the loader itself (cyclic)
    ) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

export async function generateSri() {
  console.log("🔒 Generating SRI hashes...");
  
  const hashes = {};

  // 1. Process local dist files
  const localFiles = getLocalFiles(distDir);
  for (const filePath of localFiles) {
    const relativePath = "dist/" + path.relative(distDir, filePath).replace(/\\/g, "/");
    const buffer = fs.readFileSync(filePath);
    hashes[relativePath] = generateHash(buffer);
  }

  // 2. Process external CDN files
  for (const url of CDN_URLS) {
    const hash = await fetchCdnHash(url);
    if (hash) {
      hashes[url] = hash;
    }
  }

  // 3. Write to src/config/sri-hashes.json
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Keep existing hashes if fetch failed
  let existingHashes = {};
  if (fs.existsSync(outFile)) {
    try {
      existingHashes = JSON.parse(fs.readFileSync(outFile, "utf8"));
    } catch (e) {
      // ignore
    }
  }

  const finalHashes = { ...existingHashes, ...hashes };
  
  fs.writeFileSync(outFile, JSON.stringify(finalHashes, null, 2) + "\n", "utf8");
  console.log(`✓ Wrote SRI hashes to src/config/sri-hashes.json (${Object.keys(finalHashes).length} assets)`);
}

// Allow running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSri().catch(console.error);
}
