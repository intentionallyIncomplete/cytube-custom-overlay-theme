import { readdirSync, type Dirent } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  findCatalogEntry,
  findNotableRootFile,
  findUnclassifiedDirectories,
  getActionableEntries,
  IGNORED_FOR_LAYOUT_CONTRACT,
  ROOT_DIRECTORY_CATALOG,
  TARGET_ROOT_LAYOUT,
  validateAllOwnershipInvariants,
  validateCatalogInvariants,
  type LayoutDecision,
  type OwnershipLabel,
} from "../../scripts/root-ownership";

const REPO_ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "../..");

function listRootDirectories(): string[] {
  return readdirSync(REPO_ROOT, { withFileTypes: true })
    .filter((entry: Dirent): boolean => entry.isDirectory())
    .map((entry: Dirent): string => entry.name)
    .sort((a: string, b: string): number => a.localeCompare(b));
}

describe("root ownership catalog (issue #207)", () => {
  it("passes catalog invariants for every entry", () => {
    expect(validateCatalogInvariants()).toEqual([]);
    expect(validateAllOwnershipInvariants()).toEqual([]);
  });

  it("classifies every directory currently present at the repo root", () => {
    const actual = listRootDirectories();
    const unclassified = findUnclassifiedDirectories(actual);
    expect(unclassified).toEqual([]);
  });

  it("assigns a valid ownership label to every catalog entry", () => {
    const labels: OwnershipLabel[] = ROOT_DIRECTORY_CATALOG.map(
      (entry) => entry.ownership
    );
    for (const label of labels) {
      expect([
        "source",
        "generated",
        "tests",
        "tooling",
        "deps",
        "local-ephemera",
      ]).toContain(label);
    }
  });

  it("records a keep/move/merge/remove decision for every catalog entry", () => {
    const decisions: LayoutDecision[] = ROOT_DIRECTORY_CATALOG.map(
      (entry) => entry.decision
    );
    for (const decision of decisions) {
      expect(["keep", "move", "merge", "remove"]).toContain(decision);
    }
  });

  it("has no remaining layout follow-up issues after #212", () => {
    const followUps = ROOT_DIRECTORY_CATALOG.filter(
      (entry) => entry.followUpIssue !== null
    );
    expect(followUps).toEqual([]);

    expect(findCatalogEntry("scripts")).toMatchObject({
      ownership: "tooling",
      decision: "keep",
      destination: "scripts/",
      followUpIssue: null,
    });
    expect(findCatalogEntry("scripts")?.notes).toContain("scripts/README.md");

    // #208–#212 directory moves / scripts tighten completed
    expect(getActionableEntries()).toEqual([]);
  });

  it("documents justified root channel_config_settings.js as generated keep", () => {
    expect(findNotableRootFile("channel_config_settings.js")).toMatchObject({
      ownership: "generated",
      decision: "keep",
      sourcePath: "src/config/channel_config_settings.js",
      followUpIssue: null,
    });
    expect(findCatalogEntry("src")?.notes).toContain("src/config/");
  });

  it("keeps src and dist as stable ownership anchors", () => {
    expect(findCatalogEntry("src")?.decision).toBe("keep");
    expect(findCatalogEntry("src")?.ownership).toBe("source");
    expect(findCatalogEntry("dist")?.decision).toBe("keep");
    expect(findCatalogEntry("dist")?.ownership).toBe("generated");
  });

  it("keeps unified tests/ as the tests ownership anchor", () => {
    expect(findCatalogEntry("tests")).toMatchObject({
      ownership: "tests",
      decision: "keep",
      destination: "tests/",
      followUpIssue: null,
    });
    expect(findCatalogEntry("tests")?.notes).toContain("unit/");
    expect(findCatalogEntry("tests")?.notes).toContain("e2e/");
    expect(findCatalogEntry("tests")?.notes).toContain("fixtures");
    expect(findCatalogEntry("tests")?.notes).toContain("test-results");
  });

  it("treats relocated style, asset, and test roots as layout-contract ignores", () => {
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("scss")).toBe(true);
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("css")).toBe(true);
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("assets")).toBe(true);
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("test")).toBe(true);
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("e2e")).toBe(true);
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has("test-results")).toBe(true);
    expect(findCatalogEntry("scss")).toBeUndefined();
    expect(findCatalogEntry("css")).toBeUndefined();
    expect(findCatalogEntry("assets")).toBeUndefined();
    expect(findCatalogEntry("test")).toBeUndefined();
    expect(findCatalogEntry("e2e")).toBeUndefined();
    expect(findCatalogEntry("test-results")).toBeUndefined();
    expect(findCatalogEntry("dist")?.notes).toContain("dist/css/");
    expect(findCatalogEntry("src")?.notes).toContain("src/styles/");
    expect(findCatalogEntry("src")?.notes).toContain("src/assets/");
  });

  it("documents a minimal post-epic root layout", () => {
    expect(TARGET_ROOT_LAYOUT).toEqual([
      ".github/",
      ".husky/",
      "dist/",
      "scripts/",
      "src/",
      "tests/",
    ]);
  });

  it("ignores .git and relocated style/asset/test roots when scanning for gaps", () => {
    expect(IGNORED_FOR_LAYOUT_CONTRACT.has(".git")).toBe(true);
    expect(
      findUnclassifiedDirectories([
        ".git",
        "css",
        "scss",
        "assets",
        "test",
        "e2e",
        "test-results",
        "mystery-folder",
      ])
    ).toEqual(["mystery-folder"]);
    expect(findCatalogEntry("node_modules")?.ownership).toBe("deps");
  });
});
