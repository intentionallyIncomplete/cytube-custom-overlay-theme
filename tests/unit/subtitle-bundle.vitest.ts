import { describe, expect, it } from "vitest";

import {
  bundleIdFromMediaId,
  classifyLink,
  toVtt
} from "../../src/lib/subtitle-bundle";

const WORKER = "https://quiglysmovies.ianbryanz.workers.dev";
const BUNDLES = "https://subtitle-bundles.ianbryanz.workers.dev";

describe("toVtt", () => {
  it("strips cue indexes, converts comma millis, and normalizes arrows", () => {
    const srt = [
      "1",
      "00:00:01,000 --> 00:00:04,000",
      "Hello",
      "",
      "2",
      "00:00:05,500-->00:00:06,000",
      "World",
      ""
    ].join("\r\n");

    expect(toVtt("captions.srt", srt)).toBe(
      [
        "WEBVTT",
        "",
        "00:00:01.000 --> 00:00:04.000",
        "Hello",
        "",
        "00:00:05.500 --> 00:00:06.000",
        "World",
        ""
      ].join("\n")
    );
  });

  it("converts caption text that is not already WEBVTT", () => {
    const text = "00:00:01,250 --> 00:00:02,000\nHi\n";
    expect(toVtt("notes.txt", text)).toBe("WEBVTT\n\n00:00:01.250 --> 00:00:02.000\nHi\n");
  });

  it("passes through text that already starts with WEBVTT when the name is not .srt", () => {
    const vtt = "WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nHi\n";
    expect(toVtt("captions.vtt", vtt)).toBe(vtt);
  });

  it("still converts a .srt file even when the body starts with WEBVTT", () => {
    const body = "WEBVTT\n\n00:00:01,000 --> 00:00:02,000\nHi\n";
    expect(toVtt("captions.srt", body).startsWith("WEBVTT\n\n")).toBe(true);
    expect(toVtt("captions.srt", body)).toContain("00:00:01.000 --> 00:00:02.000");
  });
});

describe("classifyLink", () => {
  it("treats index-worker file paths as drive links", () => {
    expect(classifyLink(`${WORKER}/0:/Movies/film.mp4`, WORKER)).toBe("drive");
    expect(classifyLink(`${WORKER}/files/movie`, `${WORKER}/`)).toBe("drive");
  });

  it("treats signed index-worker download links as direct", () => {
    const signed =
      `${WORKER}/download.aspx?file=zYPDIjC4pgRkr15P3y3K%2FwtRugh3Ggdw6smNcVdAE%2BKcjc%2B8QJ%2B6Kqzdj8vzhi%2BZ%2Bwo7ypBKopBGbZfz69THDQ%3D%3D` +
      "&expiry=S3WRBvhU%2Fz%2F%2BEDc5cf2oCfiP2x5gFZifwLlpZ6egyY4%3D&mac=781b810d";
    expect(classifyLink(signed, WORKER)).toBe("direct");
    expect(classifyLink("https://other.example/download.aspx?file=a", WORKER)).toBe("unsupported");
  });

  it("rejects worker routes that are not Drive files", () => {
    expect(classifyLink(`${WORKER}/manifest/abc`, WORKER)).toBe("unsupported");
    expect(classifyLink(`${WORKER}/srt2vtt`, WORKER)).toBe("unsupported");
    expect(classifyLink(`${WORKER}/proxy`, WORKER)).toBe("unsupported");
    expect(classifyLink(`${WORKER}/login`, WORKER)).toBe("unsupported");
  });

  it("treats direct media extensions as direct and ignores the query", () => {
    expect(classifyLink("https://cdn.example/v.mp4?token=1", WORKER)).toBe("direct");
    expect(classifyLink("https://cdn.example/v.webm", WORKER)).toBe("direct");
    expect(classifyLink("https://cdn.example/a/v.ogg", WORKER)).toBe("direct");
    expect(classifyLink("https://cdn.example/live.m3u8", WORKER)).toBe("direct");
  });

  it("returns unsupported for other https links, non-https media, and invalid urls", () => {
    expect(classifyLink("https://www.youtube.com/watch?v=abc", WORKER)).toBe("unsupported");
    expect(classifyLink("http://cdn.example/v.mp4", WORKER)).toBe("unsupported");
    expect(classifyLink("not a url", WORKER)).toBe("unsupported");
    expect(classifyLink("", WORKER)).toBe("unsupported");
  });

  it("does not treat bundle-worker manifests as Drive links", () => {
    expect(classifyLink(`${BUNDLES}/bundle/abc.json`, WORKER)).toBe("unsupported");
  });
});

describe("bundleIdFromMediaId", () => {
  it("parses a manifest media id on the bundle worker origin", () => {
    expect(bundleIdFromMediaId(`${BUNDLES}/bundle/abc123.json`, BUNDLES)).toBe("abc123");
    expect(bundleIdFromMediaId(`${BUNDLES}/bundle/abc123.json?x=1`, `${BUNDLES}/`)).toBe("abc123");
  });

  it("returns null for other media ids", () => {
    expect(bundleIdFromMediaId(`${BUNDLES}/bundle/abc123`, BUNDLES)).toBeNull();
    expect(bundleIdFromMediaId(`${WORKER}/bundle/abc.json`, BUNDLES)).toBeNull();
    expect(bundleIdFromMediaId("https://cdn.example/v.mp4", BUNDLES)).toBeNull();
    expect(bundleIdFromMediaId("nope", BUNDLES)).toBeNull();
  });
});
