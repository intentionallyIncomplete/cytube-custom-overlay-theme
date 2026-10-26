#!/usr/bin/env node

/**
 * Dead-selector provenance mapper (issue #246).
 *
 * Maps "never matched" selectors from an audit report (audit-dead-selectors
 * `--out` JSON) to the SCSS source rules they came from. Instead of relying
 * on dart-sass source maps (unavailable in this repo's sass build), it
 * flattens the authored SCSS tree with postcss-scss — nested rules are
 * expanded the same way sass compiles them (descendant chaining, `&`
 * substitution, comma-group cross products) — and indexes the flattened
 * selectors for lookup.
 *
 * Usage:
 *   node scripts/map-dead-selectors.js --report audit-results.json --out mapped.json
 *
 * Candidates that reference SCSS interpolation (`#{$var}` selectors) or
 * otherwise cannot be resolved are reported unmapped rather than guessed.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postcss from "postcss";
import scssSyntax from "postcss-scss";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(scriptDir, "..");

/** Conditional at-rules that wrap selector rules (recorded as context). */
const CONDITIONAL_AT_RULES = new Set([
  "media",
  "supports",
  "container",
  "layer",
  "scope",
  "starting-style",
]);

/** At-rules that are includes/annotations, never selector context. */
const SKIP_AT_RULES = new Set(["use", "forward", "import", "include"]);

const INTERPOLATION_MARKER = /[#$]\{/;

const MAX_COMBINATIONS = 4096;

// --- Pure helpers (unit-tested) ----------------------------------------

/**
 * Normalize a compiled or authored selector for textual comparison:
 * trim, collapse whitespace runs to a single space.
 *
 * @param {string} selector
 * @returns {string}
 */
export function normalizeSelector(selector) {
  return selector.replace(/\s+/g, " ").trim();
}

/**
 * Substitute `&` occurrences in a child selector with the parent selector.
 *
 * @param {string} child
 * @param {string} parent
 * @returns {string}
 */
function substituteAmpersand(child, parent) {
  if (!child.includes("&")) {
    return `${parent} ${child}`;
  }
  return child.replace(/&/g, parent);
}

/**
 * Flatten one rule's selector group against a list of parent selectors,
 * producing every combined selector the group yields (comma cross product).
 *
 * @param {string[]} childSelectors
 * @param {string[]} parents
 * @returns {string[]}
 */
function isMappableChild(selector) {
  if (INTERPOLATION_MARKER.test(selector)) {
    return false;
  }
  const trimmed = selector.trim();
  // postcss-scss truncates interpolated selectors at `#{` — the visible
  // artifact ends in a bare `#` (a valid selector never does).
  return trimmed !== "" && !trimmed.endsWith("#");
}

function flattenGroup(childSelectors, parents) {
  if (parents.length === 0) {
    // Top-level rules: the authored selectors are their own flattened form.
    const filtered = childSelectors.filter(isMappableChild);
    return filtered.length > 0 ? filtered : null;
  }
  const result = [];
  for (const child of childSelectors) {
    if (!isMappableChild(child)) {
      continue;
    }
    for (const parent of parents) {
      result.push(substituteAmpersand(child, parent));
    }
    if (result.length > MAX_COMBINATIONS) {
      return null;
    }
  }
  return result.length > 0 ? result : null;
}

/**
 * Flatten authored SCSS into selector records.
 *
 * @param {string} scssText
 * @returns {Array<{ selector: string, mediaContext: string, line: number }>}
 *   Records in source order. Nested rules are expanded (`&` substituted,
 *   comma groups cross-producted). Rules whose selectors use SCSS
 *   interpolation are skipped (unmatchable).
 */
function isMappableSelector(selector) {
  const trimmed = selector.trim();
  return trimmed !== "" && isMappableChild(selector);
}

/**
 * Neutralize quoted @use/@forward/@import directives before parsing:
 * postcss-scss rejects them, and they carry no selector meaning for us.
 *
 * @param {string} scssText
 * @returns {string}
 */
export function stripQuotedAtRules(scssText) {
  return scssText
    .replace(/@(?:use|forward)\s+["'][^"']+["'][^;]*;/g, "/* stripped */")
    .replace(/@import\s+["'][^"']+["']/g, "/* stripped */");
}

/**
 * Flatten authored SCSS into selector records.
 *
 * @param {string} scssText
 * @returns {Array<{ selector: string, mediaContext: string, line: number }>}
 *   Records in source order. Nested rules are expanded (`&` substituted,
 *   comma groups cross-producted). Files postcss-scss cannot parse at all
 *   return [] (their candidates surface as unmapped).
 */
export function flattenFileSelectors(scssText) {
  let root;
  try {
    root = postcss.parse(stripQuotedAtRules(scssText), { syntax: scssSyntax });
  } catch (err) {
    console.warn(`⚠ unparseable SCSS: ${err.reason ?? err.message}`);
    return [];
  }
  const records = [];

  /**
   * Walk nodes with a stack of ancestor selector groups.
   *
   * @param {Array} nodes
   * @param {string[]} parents Flattened parent selector list.
   * @param {string[]} atRuleChain Conditional at-rule names+params.
   */
  function visit(nodes, parents, atRuleChain) {
    for (const node of nodes) {
      if (node.type === "rule") {
        const selectors = node.selectors;
        const flattened = flattenGroup(selectors, parents);
        if (flattened === null) {
          continue;
        }
        const mediaContext = atRuleChain.join(" ");
        const start = node.source?.start;
        // Index only rules that author actual declarations: sass drops
        // container-only rules (nested children with no decls of their own).
        const hasDeclarations =
          node.nodes?.some((child) => child.type === "decl") ?? false;
        if (hasDeclarations) {
          for (const selector of flattened) {
            if (isMappableSelector(selector)) {
              records.push({
                selector,
                mediaContext,
                line: start === undefined ? 0 : start.line,
              });
            }
          }
        }
        visit(node.nodes ?? [], flattened, atRuleChain);
      } else if (node.type === "atrule") {
        if (SKIP_AT_RULES.has(node.name.toLowerCase())) {
          continue;
        }
        const chain = CONDITIONAL_AT_RULES.has(node.name.toLowerCase())
          ? [
              ...atRuleChain,
              `@${node.name}${node.params === undefined ? "" : ` ${node.params}`}`,
            ]
          : atRuleChain;
        visit(node.nodes ?? [], parents, chain);
      }
    }
  }

  visit(root.nodes ?? [], [], []);
  return records;
}

/**
 * Build a lookup index of flattened selectors across SCSS files.
 *
 * @param {Array<{ name: string, scss: string }>} files
 * @returns {Map<string, Array<{ file: string, line: number, mediaContext: string, selector: string }>>}
 */
export function buildSourceIndex(files) {
  const index = new Map();
  for (const file of files) {
    const stripped = stripQuotedAtRules(file.scss);
    const records = stripped.trim() === "" ? [] : flattenFileSelectors(file.scss);
    if (records.length === 0 && stripped.trim() !== "") {
      // Parse failure or no decl-bearing rules. flattenFileSelectors already
      // logged the parser reason when it was a real failure.
      console.warn(`⚠ ${file.name}: no authored selector rules indexed`);
    }
    for (const record of records) {
      const key = normalizeSelector(record.selector);
      if (!index.has(key)) {
        index.set(key, []);
      }
      index.get(key).push({
        file: file.name,
        line: record.line,
        mediaContext: record.mediaContext,
        selector: record.selector,
      });
    }
  }
  return index;
}

/**
 * Resolve one compiled selector to its authored locations.
 *
 * @param {Map<string, Array<object>>} index From buildSourceIndex.
 * @param {string} compiledSelector
 * @returns {Array<{ file: string, line: number, mediaContext: string, selector: string }>}
 */
export function lookupCandidates(index, compiledSelector) {
  return index.get(normalizeSelector(compiledSelector)) ?? [];
}

// --- CLI ---------------------------------------------------------------

function printUsage() {
  console.log(`Usage: node scripts/map-dead-selectors.js --report <audit.json> [--out <mapped.json>]

Options:
  --report <path>  audit report JSON from \`audit-dead-selectors.js --out\`
  --out <path>     write the mapped candidates to this file
  --help           show this help
`);
}

function parseArgs(argv) {
  const args = { report: null, out: null };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === "--help" || flag === "-h") {
      printUsage();
      process.exit(0);
    } else if (flag === "--report") {
      args.report = argv[i + 1];
      i += 1;
    } else if (flag === "--out") {
      args.out = argv[i + 1];
      i += 1;
    } else {
      console.error(`Unknown flag: ${flag}`);
      printUsage();
      process.exit(2);
    }
  }
  if (args.report === null) {
    console.error("Missing --report <path>");
    printUsage();
    process.exit(2);
  }
  return args;
}

function loadScssFiles() {
  const stylesDir = path.join(rootDir, "src", "styles");
  const files = [];
  for (const dir of [stylesDir, path.join(stylesDir, "partials")]) {
    if (!fs.existsSync(dir)) {
      continue;
    }
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".scss")) {
        continue;
      }
      const absolutePath = path.join(dir, name);
      files.push({
        name: path.relative(stylesDir, absolutePath),
        scss: fs.readFileSync(absolutePath, "utf8"),
      });
    }
  }
  return files;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const report = JSON.parse(fs.readFileSync(args.report, "utf8"));
  const index = buildSourceIndex(loadScssFiles());

  const mapped = [];
  const unmapped = [];
  for (const fileEntry of report.files) {
    for (const candidate of fileEntry.candidates) {
      const record = {
        file: fileEntry.file,
        selector: candidate.selector,
        mediaContext: candidate.mediaContext ?? "",
      };
      const locations = lookupCandidates(index, candidate.selector);
      if (locations.length === 0) {
        unmapped.push(record);
      } else {
        mapped.push({ ...record, sources: locations });
      }
    }
  }

  const sourceRules = new Set();
  const bySourceFile = new Map();
  for (const record of mapped) {
    for (const source of record.sources) {
      sourceRules.add(`${source.file}:${source.line}`);
    }
    const key = record.sources[0].file;
    if (!bySourceFile.has(key)) {
      bySourceFile.set(key, 0);
    }
    bySourceFile.set(key, bySourceFile.get(key) + 1);
  }

  console.log(
    `Mapped ${mapped.length} candidates to source; ${unmapped.length} unmapped`
  );
  console.log(`Source lines touched: ${sourceRules.size}`);
  for (const [file, count] of Array.from(bySourceFile.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    console.log(`  ${file}: ${count} mapped candidates`);
  }

  if (args.out !== null) {
    const result = {
      generatedAt: new Date().toISOString(),
      report: args.report,
      mapped,
      unmapped,
      sourceRuleCount: sourceRules.size,
    };
    fs.writeFileSync(
      path.resolve(rootDir, args.out),
      `${JSON.stringify(result, null, 2)}\n`,
      "utf8"
    );
    console.log(`\nMapped output written to ${args.out}`);
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}