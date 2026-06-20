const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const RAW_DIR = path.join(ROOT, ".raw");
const SOURCES_DIR = path.join(ROOT, "sources");

function slugify(title) {
  return String(title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function yamlQuote(v) {
  return JSON.stringify(String(v ?? ""));
}

function extractSummary(body) {
  if (!body || !body.trim()) return "";
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Summary\s*$/i.test(lines[i].trim())) {
      const out = [];
      for (let j = i + 1; j < lines.length; j++) {
        const line = lines[j];
        if (/^##\s+/.test(line)) break;
        if (line.trim()) out.push(line.replace(/^[-*]\s+/, "").trim());
      }
      return out.slice(0, 4).join(" ");
    }
  }
  const first = lines.find((l) => l.trim() && !l.startsWith("#"));
  return first ? first.trim().slice(0, 200) : "";
}

function extractTestPlan(body) {
  if (!body) return [];
  const m = body.replace(/\r\n/g, "\n").match(/## Test plan[\s\S]*?(?=\n## |\n---|$)/i);
  if (!m) return [];
  return m[0]
    .split("\n")
    .filter((l) => /^[-*]\s+\[[ x]\]/i.test(l.trim()))
    .slice(0, 5)
    .map((l) => l.replace(/^[-*]\s+/, "").trim());
}

function domainTags(pr) {
  const t = `${pr.title} ${pr.body || ""}`.toLowerCase();
  const tags = ["github-pr"];
  if (/\bchat\b|giphy|emote|trivia|command/.test(t)) tags.push("chat");
  if (/\bplayer\b|volume|video/.test(t)) tags.push("player");
  if (/\blayout\b|splitter/.test(t)) tags.push("layout");
  if (/\bplaylist\b|media.?url|queue/.test(t)) tags.push("playlist");
  if (/refactor|remove|trivia/.test(t)) tags.push("refactor");
  if ((pr.labels || []).some((l) => l.name === "bug")) tags.push("bug");
  else tags.push("enhancement");
  return tags;
}

function relatedLinks(pr) {
  const related = ["[[overview]]", "[[meta/pr-registry]]"];
  const t = `${pr.title} ${pr.body || ""}`.toLowerCase();
  if (/\bchat\b|giphy|emote|trivia|command/.test(t)) related.push("[[modules/chat.bundle]]");
  if (/\bplayer\b|volume/.test(t)) related.push("[[modules/player.bundle]]");
  if (/\blayout\b|splitter/.test(t)) related.push("[[modules/core.bundle]]");
  if (/\bplaylist\b|media.?url/.test(t)) related.push("[[modules/playlist.bundle]]");
  for (const ref of pr.closingIssuesReferences || []) {
    related.push(`[[sources/GitHub Issue ${ref.number}]]`);
  }
  return [...new Set(related)];
}

function writeRaw(pr) {
  const labels = (pr.labels || []).map((l) => l.name).join(", ");
  const closing = (pr.closingIssuesReferences || []).map((r) => r.number);
  const filename = `pr-${pr.number}-${slugify(pr.title)}.md`;
  const filePath = path.join(RAW_DIR, filename);
  const content = [
    "---",
    "source: github-pr",
    "repo: intentionallyIncomplete/BillTube3-slim",
    `number: ${pr.number}`,
    `state: ${pr.state}`,
    `title: ${yamlQuote(pr.title)}`,
    `labels: ${yamlQuote(labels)}`,
    `base: ${pr.baseRefName || ""}`,
    `head: ${pr.headRefName || ""}`,
    `created: ${pr.createdAt || ""}`,
    `updated: ${pr.updatedAt || ""}`,
    `merged: ${pr.mergedAt || ""}`,
    `url: ${pr.url || ""}`,
    `closes: ${yamlQuote(closing.join(", "))}`,
    "---",
    "",
    `# GitHub PR #${pr.number}: ${pr.title}`,
    "",
    `- **State:** ${pr.state}`,
    `- **Branch:** \`${pr.headRefName}\` → \`${pr.baseRefName}\``,
    `- **Labels:** ${labels || "none"}`,
    `- **Merged:** ${pr.mergedAt || "n/a"}`,
    `- **URL:** ${pr.url}`,
    closing.length ? `- **Closes:** ${closing.map((n) => `#${n}`).join(", ")}` : "",
    "",
    "---",
    "",
    pr.body || "_No body._",
    "",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  fs.writeFileSync(filePath, content.replace(/\r\n/g, "\n"), "utf8");
  return filename;
}

function writeSource(pr, rawFile) {
  const title = `PR ${pr.number} — ${pr.title}`;
  const safeName = `GitHub PR ${pr.number}.md`;
  const outPath = path.join(SOURCES_DIR, safeName);
  const summary = extractSummary(pr.body);
  const tests = extractTestPlan(pr.body);
  const closing = (pr.closingIssuesReferences || []).map((r) => r.number);
  const labels = (pr.labels || []).map((l) => l.name).join(", ");
  const tags = domainTags(pr);

  const lines = [
    "---",
    "type: source",
    `title: ${yamlQuote(title)}`,
    `status: ${pr.state === "MERGED" ? "mature" : "developing"}`,
    "created: 2026-06-18",
    "updated: 2026-06-18",
    "tags:",
    ...tags.map((t) => `  - ${t}`),
    "source_type: github-pr",
    "confidence: high",
    `github_number: ${pr.number}`,
    `github_state: ${pr.state}`,
    `github_url: ${pr.url}`,
    `head_branch: ${pr.headRefName}`,
    `base_branch: ${pr.baseRefName}`,
    closing.length ? `closes_issues: [${closing.join(", ")}]` : "",
    "related:",
    ...relatedLinks(pr).map((r) => `  - "${r}"`),
    "sources:",
    `  - "[[.raw/${rawFile}]]"`,
    "key_claims:",
  ].filter(Boolean);

  if (summary) lines.push(`  - ${yamlQuote(summary)}`);
  else lines.push(`  - ${yamlQuote(pr.title)}`);

  lines.push("---", "", `# ${title}`, "");
  lines.push("| Field | Value |", "|-------|-------|");
  lines.push(`| GitHub | [#${pr.number}](${pr.url}) |`);
  lines.push(`| State | **${pr.state}** |`);
  lines.push(`| Branch | \`${pr.headRefName}\` → \`${pr.baseRefName}\` |`);
  lines.push(`| Labels | ${labels || "none"} |`);
  if (closing.length) lines.push(`| Closes | ${closing.map((n) => `[#${n}](https://github.com/intentionallyIncomplete/BillTube3-slim/issues/${n})`).join(", ")} |`);
  lines.push("");

  if (summary) {
    lines.push("## Summary", "", summary, "");
  }

  if (tests.length) {
    lines.push("## Test plan", "", ...tests.map((t) => `- ${t}`), "");
  }

  lines.push("## Raw source", "", `[[.raw/${rawFile}]]`, "");
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  return safeName;
}

const raw = execFileSync(
  "gh",
  [
    "pr",
    "list",
    "--repo",
    "intentionallyIncomplete/BillTube3-slim",
    "--state",
    "all",
    "--limit",
    "10",
    "--json",
    "number,title,state,body,createdAt,updatedAt,url,headRefName,baseRefName,labels,closingIssuesReferences,mergedAt",
  ],
  { encoding: "utf8" },
);

const prs = JSON.parse(raw).sort((a, b) => b.number - a.number);
const manifest = [];

for (const pr of prs) {
  const rawFile = writeRaw(pr);
  const sourceFile = writeSource(pr, rawFile);
  manifest.push({ number: pr.number, title: pr.title, state: pr.state, rawFile, sourceFile });
  console.log(`PR #${pr.number}: ${rawFile} → ${sourceFile}`);
}

fs.writeFileSync(
  path.join(__dirname, "pr-export-manifest.json"),
  JSON.stringify({ date: "2026-06-18", count: manifest.length, items: manifest }, null, 2),
);
console.log("Done", manifest.length);
