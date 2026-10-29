import { test, expect } from "@playwright/test";
import { gotoFixtureAndBoot } from "../helpers/boot.js";

const WORKER = "https://subtitle-bundles.ianbryanz.workers.dev";
const MANIFEST = `${WORKER}/bundle/abc.json`;

test.describe.configure({ mode: "parallel" });

async function stubBundle(page, deletes) {
  await page.route("https://cdn.example/**", (route) => route.abort());
  await page.route(`${WORKER}/bundle`, async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        id: "abc",
        manifestUrl: MANIFEST,
        deleteToken: "tok"
      })
    });
  });
  await page.route(`${WORKER}/bundle/*`, async (route) => {
    if (route.request().method() === "DELETE") deletes.push(route.request().url());
    await route.fulfill({ status: 204, body: "" });
  });
}

async function openAddMedia(page) {
  await gotoFixtureAndBoot(page);
  await page.locator("#btfw-addmedia-btn").click();
}

test("opening Add Media shows the subtitle file input", async ({ page }) => {
  await openAddMedia(page);
  await expect(page.getByRole("button", { name: "Attach subtitles (.vtt/.srt)" })).toBeVisible();
  await expect(page.locator("#btfw-subtitle-bundle-file")).toBeAttached();
});

test("Queue Last swaps the media URL for the stubbed manifest", async ({ page }) => {
  const deletes = [];
  await stubBundle(page, deletes);
  await openAddMedia(page);
  await page.locator("#mediaurl").fill("https://cdn.example/movie.mp4");
  await page.locator("#btfw-subtitle-bundle-file").setInputFiles({
    name: "caps.vtt",
    mimeType: "text/vtt",
    buffer: Buffer.from("WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHi\n")
  });
  await page.locator("#queue_end").click();
  await expect(page.locator("#mediaurl")).toHaveValue(MANIFEST);
});

test("a socket delete for the queued uid sends DELETE", async ({ page }) => {
  const deletes = [];
  await stubBundle(page, deletes);
  await openAddMedia(page);
  await page.locator("#mediaurl").fill("https://cdn.example/movie.mp4");
  await page.locator("#btfw-subtitle-bundle-file").setInputFiles({
    name: "caps.vtt",
    mimeType: "text/vtt",
    buffer: Buffer.from("WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHi\n")
  });
  await page.locator("#queue_end").click();
  await expect(page.locator("#mediaurl")).toHaveValue(MANIFEST);
  await page.evaluate((manifest) => {
    window.socket.emit("queue", { item: { uid: 7, media: { id: manifest, type: "cm" } }, after: 6 });
    window.socket.emit("delete", { uid: 7 });
  }, MANIFEST);
  await expect.poll(() => deletes.length).toBe(1);
});

test("on join, a bundle missing from the playlist is deleted", async ({ page }) => {
  const deletes = [];
  await stubBundle(page, deletes);
  await page.addInitScript((manifest) => {
    localStorage.setItem(
      "btfw:subtitle-bundles",
      JSON.stringify({ abc: { deleteToken: "tok", uid: null, manifestUrl: manifest } })
    );
    // Answer requestPlaylist like the CyTube server: send the current playlist.
    let sock;
    Object.defineProperty(window, "socket", {
      configurable: true,
      get: () => sock,
      set: (value) => {
        sock = value;
        sock.on("requestPlaylist", () => sock.emit("playlist", [{ uid: 1, media: { id: "https://cdn.example/other.mp4" } }]));
      }
    });
  }, MANIFEST);
  await gotoFixtureAndBoot(page);
  await expect.poll(() => deletes.length).toBe(1);
  expect(deletes[0]).toBe(`${WORKER}/bundle/abc`);
});

test("moveVideo does not delete the bundle", async ({ page }) => {
  const deletes = [];
  await stubBundle(page, deletes);
  await openAddMedia(page);
  await page.locator("#mediaurl").fill("https://cdn.example/movie.mp4");
  await page.locator("#btfw-subtitle-bundle-file").setInputFiles({
    name: "caps.vtt",
    mimeType: "text/vtt",
    buffer: Buffer.from("WEBVTT\n\n00:00:00.000 --> 00:00:01.000\nHi\n")
  });
  await page.locator("#queue_end").click();
  await expect(page.locator("#mediaurl")).toHaveValue(MANIFEST);
  await page.evaluate((manifest) => {
    window.socket.emit("queue", { item: { uid: 7, media: { id: manifest, type: "cm" } }, after: 6 });
    window.socket.emit("moveVideo", { from: 7, after: 2 });
  }, MANIFEST);
  await page.waitForTimeout(300);
  expect(deletes).toEqual([]);
});
