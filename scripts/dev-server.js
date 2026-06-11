#!/usr/bin/env node

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || process.env.BTFW_DEV_PORT || 3000);

const MIME = {
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8"
};

function resolveFilePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]);
  const relative = pathname.replace(/^\/+/, "");
  const filePath = path.resolve(rootDir, relative || ".");
  if (filePath !== rootDir && !filePath.startsWith(rootDir + path.sep)) {
    return null;
  }
  return filePath;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "Method not allowed");
    return;
  }

  const filePath = resolveFilePath(req.url || "/");
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  if (req.url === "/" || req.url === "") {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>BillTube3-slim dev</title></head>
<body>
  <h1>BillTube3-slim dev server</h1>
  <ul>
    <li><a href="/billtube-fw.js">billtube-fw.js</a></li>
    <li><a href="/dev/channel-settings.js">dev/channel-settings.js</a> (CyTube channel snippet)</li>
    <li><a href="/dist/core.bundle.js">dist/core.bundle.js</a></li>
  </ul>
</body>
</html>`;
    send(res, 200, indexHtml, { "Content-Type": "text/html; charset=utf-8" });
    return;
  }


  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      send(res, 404, "Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";

    if (req.method === "HEAD") {
      send(res, 200, "", { "Content-Type": type, "Content-Length": stat.size });
      return;
    }

    res.writeHead(200, { "Content-Type": type, "Content-Length": stat.size });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`BillTube dev server: http://127.0.0.1:${PORT}/`);
});
