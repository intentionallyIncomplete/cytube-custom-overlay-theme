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
  // Relocated legacy test roots (pre-#210); leftovers must not fail audits
  "test",
  "e2e",
  // Relocated Playwright artifacts (now under tests/test-results/)
  "test-results",
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
    purpose: "Generated local channel-settings snippet for maintainer-local helpers.",
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
    followUpIssue: null,
    purpose: "Shared build, verify, release, and CDN automation.",
    notes:
      "Keep at root as tooling. #212: shared scripts only; see scripts/README.md. Local-only dev helpers remain gitignored (#200).",
  },
  {
    path: "src",
    ownership: "source",
    decision: "keep",
    destination: "src/",
    followUpIssue: null,
    purpose: "Application source: boot, modules, lib, config, workers, styles, assets.",
    notes:
      "Authored styles live under src/styles/ (#208). Authored static assets live under src/assets/ (#209). Authored channel config + release notes live under src/config/ (#211).",
  },
  {
    path: "tests",
    ownership: "tests",
    decision: "keep",
    destination: "tests/",
    followUpIssue: null,
    purpose: "Unified automated tests: unit/, e2e/, fixtures/, and test-results/.",
    notes:
      "Consolidated from root test/ + e2e/ (#210). Layout: tests/unit/, tests/e2e/, tests/fixtures/, tests/test-results/.",
  },
] as const;

/**
 * Notable root *files* (not directories) with ownership + keep justification.
 * Complements {@link ROOT_DIRECTORY_CATALOG} for issue #211.
 */
export interface NotableRootFileEntry {
  readonly path: string;
  readonly ownership: OwnershipLabel;
  readonly decision: LayoutDecision;
  /** Authored source path when this file is generated; null when hand-authored at root. */
  readonly sourcePath: string | null;
  readonly followUpIssue: number | null;
  readonly purpose: string;
  /** Why this root path is allowed (especially for generated runtime). */
  readonly justification: string;
}

export const NOTABLE_ROOT_FILES: readonly NotableRootFileEntry[] = [
  {
    path: "channel_config_settings.js",
    ownership: "generated",
    decision: "keep",
    sourcePath: "src/config/channel_config_settings.js",
    followUpIssue: null,
    purpose:
      "CyTube External JS / jsDelivr entry that boots BillTube with a pinned CDN_BASE.",
    justification:
      "Must stay at repo root so existing operator URLs (cdn.jsdelivr.net/gh/.../@vX.Y.Z/channel_config_settings.js) keep working. Authored only under src/config/; root is emitted by build (unpinned template) and pinned by inject-cdn-version during release.",
  },
] as const;

export function findNotableRootFile(
  path: string
): NotableRootFileEntry | undefined {
  return NOTABLE_ROOT_FILES.find((entry) => entry.path === path);
}

/**
 * Validates notable-root-file invariants for issue #211.
 */
export function validateNotableRootFileInvariants(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const entry of NOTABLE_ROOT_FILES) {
    if (seen.has(entry.path)) {
      errors.push(`Duplicate notable root file: ${entry.path}`);
    }
    seen.add(entry.path);

    if (!isOwnershipLabel(entry.ownership)) {
      errors.push(`${entry.path}: invalid ownership label`);
    }
    if (!isLayoutDecision(entry.decision)) {
      errors.push(`${entry.path}: invalid layout decision`);
    }
    if (entry.purpose.trim().length === 0) {
      errors.push(`${entry.path}: missing purpose`);
    }
    if (entry.justification.trim().length === 0) {
      errors.push(`${entry.path}: missing justification`);
    }
    if (entry.ownership === "generated" && entry.sourcePath === null) {
      errors.push(`${entry.path}: generated files require a sourcePath`);
    }
    if (
      entry.ownership === "generated" &&
      entry.sourcePath !== null &&
      entry.sourcePath.trim().length === 0
    ) {
      errors.push(`${entry.path}: sourcePath must not be empty`);
    }
  }

  return errors;
}

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
      errors.push(
        `${entry.path}: keep decision should not set followUpIssue (got #${String(entry.followUpIssue)})`
      );
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
 * Validates catalog + notable-root-file invariants used by issues #207 / #211.
 */
export function validateAllOwnershipInvariants(): string[] {
  return [...validateCatalogInvariants(), ...validateNotableRootFileInvariants()];
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
