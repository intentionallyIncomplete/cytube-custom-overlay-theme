import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  CHANNEL_CONFIG_CDN_REPO,
  CHANNEL_CONFIG_ROOT_PATH,
  CHANNEL_CONFIG_SOURCE_PATH,
  CHANNEL_CONFIG_VERSION_PLACEHOLDER,
  pinChannelConfigContent,
  verifyChannelConfigSource,
  verifyPinnedChannelConfig,
} from "../../src/lib/channel-config.js";
import { CDN_ASSET_PATHS } from "../../src/lib/cdn-deploy.js";
import {
  findNotableRootFile,
  validateNotableRootFileInvariants,
} from "../../scripts/root-ownership";

const REPO_ROOT: string = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("channel config ownership (issue #211)", () => {
  it("keeps authored source under src/config with the version placeholder", () => {
    const sourcePath: string = join(REPO_ROOT, CHANNEL_CONFIG_SOURCE_PATH);
    const content: string = readFileSync(sourcePath, "utf8");
    const result = verifyChannelConfigSource(content);

    expect(result).toEqual({ ok: true });
    expect(content).toContain(CHANNEL_CONFIG_VERSION_PLACEHOLDER);
    expect(content).not.toMatch(/@v\d+\.\d+\.\d+/);
  });

  it("lists the root pin as the first CDN asset path", () => {
    expect(CDN_ASSET_PATHS[0]).toBe(CHANNEL_CONFIG_ROOT_PATH);
  });

  it("pins placeholder content for a release tag without mutating source semantics", () => {
    const source =
      `const CDN_BASE = "https://cdn.jsdelivr.net/gh/${CHANNEL_CONFIG_CDN_REPO}${CHANNEL_CONFIG_VERSION_PLACEHOLDER}";\n`;
    const pinned: string = pinChannelConfigContent(source, "1.2.3");

    expect(pinned).toContain(`@v1.2.3`);
    expect(pinned).not.toContain(CHANNEL_CONFIG_VERSION_PLACEHOLDER);
    expect(verifyPinnedChannelConfig(pinned, "v1.2.3")).toEqual({ ok: true });
    expect(verifyChannelConfigSource(source)).toEqual({ ok: true });
  });

  it("rewrites an existing gh/@ref pin to the target release tag", () => {
    const source =
      `const CDN_BASE = "https://cdn.jsdelivr.net/gh/${CHANNEL_CONFIG_CDN_REPO}@v9.9.9";\n`;
    const pinned: string = pinChannelConfigContent(source, "v2.0.0");

    expect(pinned).toContain(`gh/${CHANNEL_CONFIG_CDN_REPO}@v2.0.0`);
    expect(pinned).not.toContain("@v9.9.9");
  });

  it("rejects source that already contains a concrete release pin", () => {
    const result = verifyChannelConfigSource(
      `const CDN_BASE = "https://cdn.jsdelivr.net/gh/${CHANNEL_CONFIG_CDN_REPO}@v1.0.0";\n`
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toContain("concrete");
    }
  });

  it("rejects pinned output that still has the placeholder", () => {
    const result = verifyPinnedChannelConfig(
      `const CDN_BASE = "...${CHANNEL_CONFIG_VERSION_PLACEHOLDER}";\n`,
      "v1.2.3"
    );
    expect(result.ok).toBe(false);
  });

  it("catalogues the root runtime file as generated with a justified keep", () => {
    expect(validateNotableRootFileInvariants()).toEqual([]);
    expect(findNotableRootFile(CHANNEL_CONFIG_ROOT_PATH)).toMatchObject({
      ownership: "generated",
      decision: "keep",
      sourcePath: CHANNEL_CONFIG_SOURCE_PATH,
      followUpIssue: null,
    });
    expect(findNotableRootFile(CHANNEL_CONFIG_ROOT_PATH)?.justification).toContain(
      "jsdelivr"
    );
    expect(findNotableRootFile(CHANNEL_CONFIG_ROOT_PATH)?.justification).toContain(
      "src/config"
    );
  });
});
