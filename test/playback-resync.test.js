import assert from "node:assert/strict";
import { describe, it, before, beforeEach, afterEach, mock } from "node:test";

describe("playback resync", () => {
  let api;
  let originalWindow;
  let originalSocket;
  let originalUseropts;
  let capturedEmit;
  let capturedOnce;

  before(async () => {
    let factory;
    global.BTFW = { define: (_, __, f) => { factory = f; } };
    await import("../modules/feature-sync-guard.js");
    api = await factory({});
  });

  beforeEach(() => {
    originalWindow = global.window;
    originalSocket = global.socket;
    originalUseropts = global.USEROPTS;
    capturedEmit = null;
    capturedOnce = null;
    const socket = {
      once: (event, fn) => { capturedOnce = { event, fn }; },
      emit: (event) => { capturedEmit = event; },
      on: () => {},
      off: () => {},
      connected: true
    };
    global.socket = socket;
    global.USEROPTS = { sync_accuracy: 2, synch: true };
    global.CLIENT = { leader: false };
    global.window = { BTFW: {}, socket };
  });

  afterEach(() => {
    global.window = originalWindow;
    global.socket = originalSocket;
    global.USEROPTS = originalUseropts;
    mock.timers.reset();
  });

  it("test_no_mediaId_then_noop", async () => {
    global.window.PLAYER = { mediaType: null };
    await api.playbackResyncIfNeeded();
    assert.equal(capturedEmit, null);
    assert.equal(global.window.BTFW._playbackResyncDone, undefined);
  });

  it("test_seekUntilSynced_applies_seek_until_within_accuracy", async () => {
    let localTime = 100;

    global.window.PLAYER = {
      paused: false,
      play() {},
      getTime(cb) { cb(localTime); },
      seekTo(t) { localTime = t; }
    };

    const ok = await api.seekUntilSynced(110, { accuracy: 2, interval: 1, timeout: 50 });
    assert.equal(localTime, 110);
    assert.equal(ok, true);
  });

  it("test_hardReloadMediaPlayer_clears_identity_before_playerReady", () => {
    const player = { mediaId: "abc", mediaType: "yt" };
    global.window.PLAYER = player;

    const ok = api.hardReloadMediaPlayer();

    assert.equal(ok, true);
    assert.equal(capturedEmit, "playerReady");
    assert.equal(player.mediaId, "");
    assert.equal(player.mediaType, "");
  });

  it("test_playbackResync_sets_flag_only_after_seek_verified", async () => {
    let localTime = 2082;
    const player = {
      mediaId: "abc",
      mediaType: "yt",
      paused: false,
      play() {},
      getTime(cb) { cb(localTime); },
      seekTo(t) { localTime = t; }
    };
    global.window.PLAYER = player;

    const p = api.playbackResyncIfNeeded();
    assert.equal(capturedEmit, "playerReady");
    assert.equal(player.mediaId, "");
    assert.equal(player.mediaType, "");
    assert.equal(capturedOnce.event, "changeMedia");

    capturedOnce.fn({ currentTime: 2092, paused: false, type: "yt", id: "abc" });
    await p;

    assert.equal(localTime, 2092);
    assert.equal(global.window.BTFW._playbackResyncDone, true);
  });

  it("test_playbackResync_no_flag_when_changeMedia_missing", async () => {
    global.window.PLAYER = { mediaId: "xyz" };

    const p = api.playbackResyncIfNeeded({ changeMediaTimeout: 5, maxAttempts: 1 });
    assert.equal(capturedEmit, "playerReady");
    await p;

    assert.equal(global.window.BTFW._playbackResyncDone, undefined);
  });

  it("test_applyServerPlayback_unpauses_when_server_playing", () => {
    let played = false;
    global.window.PLAYER = {
      paused: true,
      play() { played = true; },
      seekTo() {}
    };

    api.applyServerPlayback({ currentTime: 50, paused: false });
    assert.equal(played, true);
  });
});
