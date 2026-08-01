import { describe, expect, it } from "vitest";

import {
  canLoadAdminBundle,
  readAdminBundleGateContext,
  type AdminBundleGateContext
} from "../../src/lib/can-load-admin-bundle";

describe("canLoadAdminBundle (issue #197)", () => {
  it("denies when no permission APIs or rank are present", () => {
    expect(canLoadAdminBundle({})).toBe(false);
    expect(canLoadAdminBundle({ client: null, ranks: null })).toBe(false);
  });

  it("allows when window.hasPermission grants motdedit/seehidden/chanowner", () => {
    expect(
      canLoadAdminBundle({
        hasPermission: (p) => p === "motdedit"
      })
    ).toBe(true);
    expect(
      canLoadAdminBundle({
        hasPermission: (p) => p === "seehidden"
      })
    ).toBe(true);
    expect(
      canLoadAdminBundle({
        hasPermission: (p) => p === "chanowner"
      })
    ).toBe(true);
  });

  it("allows when CLIENT.hasPermission grants an admin permission", () => {
    const ctx: AdminBundleGateContext = {
      client: {
        hasPermission: (p) => p === "chanowner"
      }
    };
    expect(canLoadAdminBundle(ctx)).toBe(true);
  });

  it("allows when CLIENT.rank meets owner threshold from RANK table", () => {
    expect(
      canLoadAdminBundle({
        client: { rank: 4 },
        ranks: { owner: 3 }
      })
    ).toBe(true);
    expect(
      canLoadAdminBundle({
        client: { rank: 2 },
        ranks: { owner: 3 }
      })
    ).toBe(false);
  });

  it("falls back to rank >= 4 when RANK table is missing", () => {
    expect(canLoadAdminBundle({ client: { rank: 4 } })).toBe(true);
    expect(canLoadAdminBundle({ client: { rank: 3 } })).toBe(false);
  });

  it("ignores throwing hasPermission implementations", () => {
    expect(
      canLoadAdminBundle({
        hasPermission: () => {
          throw new Error("boom");
        },
        client: { rank: 0 }
      })
    ).toBe(false);
  });
});

describe("readAdminBundleGateContext", () => {
  it("reads hasPermission, CLIENT, and RANK from a window-like object", () => {
    const win = {
      hasPermission: (p: string) => p === "motdedit",
      CLIENT: { rank: 5, hasPermission: (p: string) => p === "chanowner" },
      RANK: { owner: 4 }
    };

    const ctx = readAdminBundleGateContext(win);
    expect(ctx.hasPermission?.("motdedit")).toBe(true);
    expect(ctx.client?.rank).toBe(5);
    expect(ctx.ranks?.owner).toBe(4);
    expect(canLoadAdminBundle(ctx)).toBe(true);
  });

  it("omits hasPermission when absent (exactOptionalPropertyTypes)", () => {
    const win = {
      CLIENT: { rank: 0 }
    };

    const ctx = readAdminBundleGateContext(win);
    expect(Object.prototype.hasOwnProperty.call(ctx, "hasPermission")).toBe(
      false
    );
    expect(canLoadAdminBundle(ctx)).toBe(false);
  });
});
