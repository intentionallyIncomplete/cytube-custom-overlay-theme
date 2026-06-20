#!/usr/bin/env node
/**
 * postToolUse hook: after `gh pr create`, export PR to wiki/.raw and
 * inject obsidian-wiki follow-up context for the agent.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAW_DIR = path.join("wiki", "quiglytube", ".raw");
const SKILL_PATH = ".cursor/skills/obsidian-wiki/SKILL.md";

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function slugify(title) {
  return String(title || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function isPrCreateCommand(command) {
  if (!command || typeof command !== "string") return false;
  const normalized = command.replace(/\s+/g, " ").trim();
  return /\bgh\s+pr\s+create\b/.test(normalized);
}

function extractPrNumber(text) {
  if (!text) return null;
  const m = String(text).match(/\/pull\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function ghJson(args) {
  const out = execFileSync("gh", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  return JSON.parse(out);
}

function yamlQuote(value) {
  return JSON.stringify(String(value ?? ""));
}

function writePrRaw(pr) {
  const labels = (pr.labels || []).map((l) => l.name).join(", ");
  const filename = `pr-${pr.number}-${slugify(pr.title)}.md`;
  const filePath = path.join(RAW_DIR, filename);
  const closing = (pr.closingIssuesReferences || [])
    .map((r) => r.number)
    .filter(Boolean);

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
    `url: ${pr.url || ""}`,
    `closes: ${yamlQuote(closing.join(", "))}`,
    "---",
    "",
    `# GitHub PR #${pr.number}: ${pr.title}`,
    "",
    `- **State:** ${pr.state}`,
    `- **Branch:** \`${pr.headRefName}\` → \`${pr.baseRefName}\``,
    `- **Labels:** ${labels || "none"}`,
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

  fs.mkdirSync(RAW_DIR, { recursive: true });
  fs.writeFileSync(filePath, content.replace(/\r\n/g, "\n"), "utf8");
  return { filename, filePath };
}

function emit(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

const inputText = readStdin();
if (!inputText.trim()) {
  emit({});
  process.exit(0);
}

let input;
try {
  input = JSON.parse(inputText);
} catch {
  emit({});
  process.exit(0);
}

const command =
  input?.tool_input?.command ??
  input?.command ??
  input?.arguments?.command ??
  "";

if (!isPrCreateCommand(command)) {
  emit({});
  process.exit(0);
}

const toolOutput =
  input?.tool_output ??
  input?.output ??
  input?.result ??
  "";

const prNumber =
  extractPrNumber(toolOutput) ?? extractPrNumber(command);

if (!prNumber) {
  emit({
    additional_context: [
      "[BillTube wiki hook] `gh pr create` ran but no PR number was detected in the output.",
      `Read ${SKILL_PATH} and update wiki/quiglytube: fetch the latest PR with gh, write .raw/, ingest to sources/, update index.md, log.md, hot.md.`,
    ].join("\n"),
  });
  process.exit(0);
}

try {
  const pr = ghJson([
    "pr",
    "view",
    String(prNumber),
    "--repo",
    "intentionallyIncomplete/BillTube3-slim",
    "--json",
    "number,title,state,body,createdAt,updatedAt,url,headRefName,baseRefName,labels,closingIssuesReferences",
  ]);

  const { filename, filePath } = writePrRaw(pr);

  emit({
    additional_context: [
      `[BillTube wiki hook] PR #${pr.number} created: ${pr.url}`,
      "",
      "Follow the obsidian-wiki skill immediately:",
      `1. Read ${SKILL_PATH}`,
      `2. Raw snapshot written: ${filePath.replace(/\\/g, "/")} (do not edit .raw/ after the fact)`,
      `3. INGEST: create wiki/quiglytube/sources/PR ${pr.number} — ${pr.title}.md (summary + wikilinks)`,
      "4. Update wiki/quiglytube/index.md, log.md, and hot.md",
      "5. Link related issues/PRs from the body (e.g. Closes #N)",
      "",
      "Complete wiki filing in this turn unless the user opted out.",
    ].join("\n"),
  });
} catch (err) {
  emit({
    additional_context: [
      `[BillTube wiki hook] PR #${prNumber} was created but auto-export failed: ${err.message}`,
      `Read ${SKILL_PATH} and manually export with gh pr view, then ingest into wiki/quiglytube.`,
    ].join("\n"),
  });
}

process.exit(0);
