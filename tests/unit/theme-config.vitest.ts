import { describe, expect, it } from "vitest";

import {
  createThemeConfigDomain,
  type ThemeRuntimeTypographyApi
} from "../../src/modules/theme-admin/theme-config";

const runtimeStub: ThemeRuntimeTypographyApi = {
  DEFAULT_APPEARANCE: { tint: "midnight", colors: {}, typography: { preset: "inter" } },
  FONT_DEFAULT_ID: "inter",
  FONT_FALLBACK_FAMILY: "sans-serif",
  normalizeFontId: (value) => (typeof value === "string" && value ? value : "inter"),
  resolveTypographyConfig: () => ({ family: "sans-serif" })
};

const legacySaved = { integrations: { enabled: true, movieInfo: { enabled: true } } };

describe("theme config without movie-info", () => {
  const domain = createThemeConfigDomain(runtimeStub);

  it("normalizeConfig drops a legacy integrations.movieInfo", () => {
    expect(domain.normalizeConfig(legacySaved).integrations).not.toHaveProperty("movieInfo");
  });

  it("defaults no longer include movieInfo", () => {
    expect(domain.cloneDefaults().integrations).not.toHaveProperty("movieInfo");
  });

  it("the generated Channel JS block never re-emits movieInfo", () => {
    expect(domain.buildConfigBlock(legacySaved)).not.toContain("movieInfo");
  });

  it("keeps integrations.enabled", () => {
    expect(domain.normalizeConfig(legacySaved).integrations.enabled).toBe(true);
  });
});

describe("theme config without favicon or poster", () => {
  const domain = createThemeConfigDomain(runtimeStub);

  it("keeps the channel header name and drops favicon and poster", () => {
    const normalized = domain.normalizeConfig({
      faviconUrl: "https://example.com/icon.png",
      posterUrl: "https://example.com/poster.jpg",
      branding: {
        headerName: "Quigly",
        header: "From header",
        favicon: "https://example.com/legacy.ico",
        faviconUrl: "https://example.com/icon.png",
        posterUrl: "https://example.com/poster.jpg"
      }
    });
    expect(normalized.branding.headerName).toBe("Quigly");
    expect(normalized.branding).not.toHaveProperty("header");
    expect(normalized.branding).not.toHaveProperty("faviconUrl");
    expect(normalized.branding).not.toHaveProperty("favicon");
    expect(normalized.branding).not.toHaveProperty("posterUrl");
    expect(normalized).not.toHaveProperty("faviconUrl");
    expect(normalized).not.toHaveProperty("posterUrl");
  });

  it("falls back to a legacy header name when branding.headerName is blank", () => {
    const normalized = domain.normalizeConfig({
      headerName: "Legacy name",
      branding: { headerName: "", header: "From header" }
    });
    expect(normalized.branding.headerName).toBe("Legacy name");
  });

  it("does not re-emit favicon or poster in the Channel JS block", () => {
    const block = domain.buildConfigBlock({
      headerName: "Legacy name",
      faviconUrl: "https://example.com/icon.png",
      posterUrl: "https://example.com/poster.jpg",
      branding: {
        headerName: "",
        faviconUrl: "https://example.com/icon.png",
        posterUrl: "https://example.com/poster.jpg"
      }
    });
    expect(block).toContain("Legacy name");
    expect(block).not.toContain("favicon");
    expect(block).not.toContain("poster");
  });
});
