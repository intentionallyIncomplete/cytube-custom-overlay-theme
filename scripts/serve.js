#!/usr/bin/env node

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const PORT = Number(process.env.DEV_SERVER_PORT || process.env.PORT || 3099);
const HOST = process.env.DEV_SERVER_HOST || "127.0.0.1";

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
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function serveFile(req, res, filePath) {
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

    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  });
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

  const urlPath = (req.url || "/").split("?")[0];

  if (urlPath === "/" || urlPath === "") {
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>BillTube dev server</title></head>
<body>
  <h1>BillTube dev server</h1>
  <ul>
    <li><a href="/dist/billtube-fw.js">dist/billtube-fw.js</a></li>
  </ul>
</body>
</html>`;
    send(res, 200, indexHtml, { "Content-Type": "text/html; charset=utf-8" });
    return;
  }

  const filePath = resolveFilePath(req.url || "/");
  if (!filePath) {
    send(res, 403, "Forbidden");
    return;
  }

  serveFile(req, res, filePath);
});

server.listen(PORT, HOST, () => {
  console.log(`BillTube dev server: http://${HOST}:${PORT}/`);
  console.log("Cache-Control: no-store — refresh the browser after a rebuild; no restart needed.");
});
