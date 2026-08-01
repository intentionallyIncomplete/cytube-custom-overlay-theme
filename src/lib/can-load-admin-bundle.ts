/**
 * Gate for fetching/initing dist/admin.bundle.js.
 * Matches channel-theme-admin canManageChannel permission surface so non-admins
 * never download the admin-only IIFE (issue #197 option C).
 */

export interface CytubePermissionClient {
  readonly hasPermission?: (permission: string) => boolean;
  readonly rank?: number;
}

export interface CytubeRankTable {
  readonly owner?: number;
  readonly founder?: number;
  readonly admin?: number;
  readonly administrator?: number;
}

export interface AdminBundleGateContext {
  readonly hasPermission?: (permission: string) => boolean;
  readonly client?: CytubePermissionClient | null;
  readonly ranks?: CytubeRankTable | null;
}

const ADMIN_PERMISSIONS = ["motdedit", "seehidden", "chanowner"] as const;

function hasAnyPermission(
  check: ((permission: string) => boolean) | undefined,
  permissions: readonly string[]
): boolean {
  if (typeof check !== "function") {
    return false;
  }
  return permissions.some((permission) => {
    try {
      return check(permission) === true;
    } catch {
      return false;
    }
  });
}

function ownerRankThreshold(ranks: CytubeRankTable | null | undefined): number {
  if (!ranks) {
    return 4;
  }
  const candidates: readonly (number | undefined)[] = [
    ranks.owner,
    ranks.founder,
    ranks.admin,
    ranks.administrator,
  ];
  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return 4;
}

/**
 * Returns true when the current CyTube session should fetch admin.bundle.js.
 */
export function canLoadAdminBundle(ctx: AdminBundleGateContext): boolean {
  if (hasAnyPermission(ctx.hasPermission, ADMIN_PERMISSIONS)) {
    return true;
  }

  const client = ctx.client ?? null;
  if (client && hasAnyPermission(client.hasPermission?.bind(client), ADMIN_PERMISSIONS)) {
    return true;
  }

  if (client && typeof client.rank !== "undefined") {
    const rank = client.rank | 0;
    return rank >= ownerRankThreshold(ctx.ranks);
  }

  return false;
}

export interface AdminBundleWindowLike {
  readonly hasPermission?: (permission: string) => boolean;
  readonly CLIENT?: CytubePermissionClient | null;
  readonly RANK?: CytubeRankTable | null;
  readonly Ranks?: CytubeRankTable | null;
}

/**
 * Reads CyTube globals from a window-like object for {@link canLoadAdminBundle}.
 */
export function readAdminBundleGateContext(
  win: AdminBundleWindowLike
): AdminBundleGateContext {
  const client =
    typeof win.CLIENT === "object" && win.CLIENT !== null ? win.CLIENT : null;

  const ranksRaw = win.RANK ?? win.Ranks ?? null;
  const ranks =
    typeof ranksRaw === "object" && ranksRaw !== null ? ranksRaw : null;

  if (typeof win.hasPermission === "function") {
    const check = win.hasPermission.bind(win);
    return { hasPermission: check, client, ranks };
  }

  return { client, ranks };
}
