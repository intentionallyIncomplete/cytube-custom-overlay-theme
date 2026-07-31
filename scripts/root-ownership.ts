/**
 * Root directory ownership catalog for epic #206 / issue #207.
 * Machine-readable source of truth for keep/move/merge/remove decisions.
 */

export type OwnershipLabel =
  | "source"
  | "generated"
  | "tests"
  | "tooling"
  | "deps"
  | "local-ephemera";

export type LayoutDecision = "keep" | "move" | "merge" | "remove";

export interface RootDirectoryEntry {
  readonly path: string;
  readonly ownership: OwnershipLabel;
  readonly decision: LayoutDecision;
  /** Final path after epic #206 completes (relative to repo root). */
  readonly destination: string;
  /** Follow-up issue that owns the physical move; null when no move is needed. */
  readonly followUpIssue: number | null;
  readonly purpose: string;
  readonly notes: string;
}

/**
 * Directories that may exist on disk but are never part of the public layout contract.
 * Still classified so audits never leave a root folder unlabeled.
 */
/**
 * VCS plumbing and relocated legacy root dirs that may still appear on disk
 * (e.g. leftover `css/` / `scss/` / `assets/` from pre-epic builds) without
 * failing the audit.
 */
export const IGNORED_FOR_LAYOUT_CONTRACT: ReadonlySet<string> = new Set([
  ".git",
  "css",
  "scss",
  "assets",
  // Local Windows / tooling leftovers (never part of the public tree)
  "Microsoft",
]);

/**
 * Every top-level directory that can appear in a working tree, with ownership + decision.
 * Paths are directory names only (no trailing slash).
 */
export const ROOT_DIRECTORY_CATALOG: readonly RootDirectoryEntry[] = [
  {
    path: ".cursor",
    ownership: "local-ephemera",
    decision: "keep",
    destination: ".cursor/",
    followUpIssue: null,
    purpose: "Local Cursor IDE skills and agent config.",
    notes: "Gitignored via .gitignore; not part of the public CDN tree.",
  },
  {
    path: ".github",
    ownership: "tooling",
    decision: "keep",
    destination: ".github/",
    followUpIssue: null,
    purpose: "CI workflows, release automation, and GitHub project metadata.",
    notes: "Standard GitHub ownership boundary; stays at root.",
  },
  {
    path: ".husky",
    ownership: "tooling",
    decision: "keep",
    destination: ".husky/",
    followUpIssue: null,
    purpose: "Git hooks (prepare/husky).",
    notes: "Gitignored from the public tree (#200); still a root tooling folder locally.",
  },
  {
    path: "dev",
    ownership: "local-ephemera",
    decision: "keep",
    destination: "dev/",
    followUpIssue: null,
    purpose: "Generated local channel-settings snippet for npm run dev.",
    notes: "Gitignored; never ships to CDN.",
  },
  {
    path: "dist",
    ownership: "generated",
    decision: "keep",
    destination: "dist/",
    followUpIssue: null,
    purpose: "esbuild bundles + compiled CSS (dist/css/) for jsDelivr.",
    notes:
      "Gitignored on main; tracked on release tags. Style ship artifacts live under dist/css/ (#208).",
  },
  {
    path: "e2e",
    ownership: "tests",
    decision: "merge",
    destination: "tests/e2e/",
    followUpIssue: 210,
    purpose: "Playwright smoke suite, fixtures, and boot helpers.",
    notes: "Consolidate with unit tests under a single tests/ tree.",
  },
  {
    path: "node_modules",
    ownership: "deps",
    decision: "keep",
    destination: "node_modules/",
    followUpIssue: null,
    purpose: "npm install output.",
    notes: "Always gitignored; classified so audits never leave it unlabeled.",
  },
  {
    path: "scripts",
    ownership: "tooling",
    decision: "keep",
    destination: "scripts/",
    followUpIssue: 212,
    purpose: "Shared build, verify, release, and CDN automation.",
    notes:
      "Keep at root as tooling. #212 tightens to shared scripts only (dev helpers already gitignored).",
  },
  {
    path: "src",
    ownership: "source",
    decision: "keep",
    destination: "src/",
    followUpIssue: null,
    purpose: "Application source: boot, modules, lib, config, workers, styles, assets.",
    notes:
      "Authored styles live under src/styles/ (#208). Authored static assets live under src/assets/ (#209).",
  },
  {
    path: "test",
    ownership: "tests",
    decision: "merge",
    destination: "tests/unit/",
    followUpIssue: 210,
    purpose: "Node unit tests (node:test) for lib and feature helpers.",
    notes: "Merge with e2e/ into tests/; keep runner separation via subfolders.",
  },
  {
    path: "test-results",
    ownership: "local-ephemera",
    decision: "keep",
    destination: "test-results/",
    followUpIssue: null,
    purpose: "Playwright local run artifacts.",
    notes: "Gitignored; never committed.",
  },
] as const;

const OWNERSHIP_LABELS: readonly OwnershipLabel[] = [
  "source",
  "generated",
  "tests",
  "tooling",
  "deps",
  "local-ephemera",
] as const;

const LAYOUT_DECISIONS: readonly LayoutDecision[] = [
  "keep",
  "move",
  "merge",
  "remove",
] as const;

export function isOwnershipLabel(value: unknown): value is OwnershipLabel {
  return (
    typeof value === "string" &&
    (OWNERSHIP_LABELS as readonly string[]).includes(value)
  );
}

export function isLayoutDecision(value: unknown): value is LayoutDecision {
  return (
    typeof value === "string" &&
    (LAYOUT_DECISIONS as readonly string[]).includes(value)
  );
}

export function getCatalogPaths(): readonly string[] {
  return ROOT_DIRECTORY_CATALOG.map((entry) => entry.path);
}

export function findCatalogEntry(
  path: string
): RootDirectoryEntry | undefined {
  return ROOT_DIRECTORY_CATALOG.find((entry) => entry.path === path);
}

/**
 * Returns root directory names present on disk that have no catalog entry.
 * Entries in {@link IGNORED_FOR_LAYOUT_CONTRACT} are excluded from the gap list
 * (`.git` is VCS plumbing; `node_modules` is catalogued separately when present).
 */
export function findUnclassifiedDirectories(
  actualDirectoryNames: readonly string[]
): string[] {
  const known = new Set(getCatalogPaths());
  return actualDirectoryNames
    .filter(
      (name) => !known.has(name) && !IGNORED_FOR_LAYOUT_CONTRACT.has(name)
    )
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Returns catalog paths whose decision is move/merge/remove (actionable).
 */
export function getActionableEntries(): readonly RootDirectoryEntry[] {
  return ROOT_DIRECTORY_CATALOG.filter(
    (entry) => entry.decision !== "keep"
  );
}

/**
 * Validates catalog invariants used by issue #207 acceptance criteria.
 */
export function validateCatalogInvariants(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const entry of ROOT_DIRECTORY_CATALOG) {
    if (seen.has(entry.path)) {
      errors.push(`Duplicate catalog path: ${entry.path}`);
    }
    seen.add(entry.path);

    if (!isOwnershipLabel(entry.ownership)) {
      errors.push(`${entry.path}: invalid ownership label`);
    }
    if (!isLayoutDecision(entry.decision)) {
      errors.push(`${entry.path}: invalid layout decision`);
    }
    if (entry.destination.trim().length === 0) {
      errors.push(`${entry.path}: missing destination`);
    }
    if (entry.purpose.trim().length === 0) {
      errors.push(`${entry.path}: missing purpose`);
    }
    if (entry.decision === "keep" && entry.followUpIssue !== null) {
      // keep with a follow-up is allowed only for tighten-in-place (#212 on scripts)
      if (entry.path !== "scripts") {
        errors.push(
          `${entry.path}: keep decision should not set followUpIssue (got #${String(entry.followUpIssue)})`
        );
      }
    }
    if (
      (entry.decision === "move" || entry.decision === "merge") &&
      entry.followUpIssue === null
    ) {
      errors.push(
        `${entry.path}: ${entry.decision} decision requires a followUpIssue`
      );
    }
  }

  return errors;
}

/**
 * Target root layout after epic #206 completes (directories only).
 */
export const TARGET_ROOT_LAYOUT: readonly string[] = [
  ".github/",
  ".husky/",
  "dist/",
  "scripts/",
  "src/",
  "tests/",
] as const;
