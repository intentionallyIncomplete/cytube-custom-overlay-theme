import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Regression guard for #247: feature-layout.js called init("util:layout-columns")
// / init("util:layout-viewport"), but no module ever defined those ids — the
// registry throws "Module not found" at boot and every bundle that depends on
// feature:layout dies. This test walks the module source and fails whenever any
// init(...) target has no matching define(...) anywhere in src/.
const SRC_ROOT = join(import.meta.dirname, "../../src");
const GENERATED_SUFFIX = ".generated.js";

function sourceFiles() {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "workers") continue; // Cloudflare workers are outside the bundle registry
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(js|ts)$/.test(entry.name) && !entry.name.endsWith(GENERATED_SUFFIX)) {
        out.push(full);
      }
    }
  };
  walk(SRC_ROOT);
  return out;
}

function scanIds(files, callName) {
  const ids = new Map(); // id -> first file that declares it
  const pattern = new RegExp(`\\b${callName}\\(\\s*(["'])([^"']+)\\1`, "g");
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    for (const match of src.matchAll(pattern)) {
      if (!ids.has(match[2])) ids.set(match[2], file);
    }
  }
  return ids;
}

describe("registry module ids", () => {
  // Exercises: init(...) targets must all be define(...)d somewhere in src/
  it("test_init_when_all_ids_scanned_then_every_target_is_defined", () => {
    const files = sourceFiles();
    const defined = scanIds(files, "define");
    const inited = scanIds(files, "init");

    const missing = [];
    for (const [id, file] of inited) {
      if (!defined.has(id)) {
        missing.push(`${id} (init in ${file})`);
      }
    }

    assert.deepEqual(
      missing.sort(),
      [],
      "init() targets without a define() crash boot with 'Module not found'"
    );
  });

  // Exercises: the known-good util ids stay resolvable (guards against
  // accidental renames of loader-defined or shim modules).
  it("test_init_when_core_util_ids_scanned_then_loader_and_shims_define_them", () => {
    const defined = scanIds(sourceFiles(), "define");
    for (const id of ["util:state", "feature:layout", "feature:styleCore", "feature:themeMode"]) {
      assert.ok(defined.has(id), `expected define("${id}") somewhere in src/`);
    }
  });
});