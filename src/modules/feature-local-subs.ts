import { toVtt } from "../lib/subtitle-bundle.js";

const BUTTON_ID = "btfw-vo-subs";
const INPUT_ID = "btfw-vo-subs-input";
const LEFT_SECTION_ID = "btfw-vo-left";
const TRACK_ATTR = "data-btfw-local-subs";

interface RemoteTrackPlayer {
  addRemoteTextTrack(
    options: { kind: string; src: string; label: string; srclang: string; default: boolean },
    manualCleanup: boolean
  ): HTMLTrackElement | null | undefined;
  removeRemoteTextTrack(track: TextTrack | HTMLTrackElement): void;
  textTracks(): ArrayLike<TextTrack>;
}

interface NotifyApi {
  success?: (opts: { title: string; html: string; timeout: number }) => void;
  error?: (opts: { title: string; html: string; timeout: number }) => void;
}

let objectUrl: string | null = null;
let attached: { track: TextTrack; remove: () => void } | null = null;
let syncTimer = 0;

window.BTFW.define("feature:local-subs", [], async () => {
  function notify(kind: "success" | "error", message: string): void {
    const api = (window as Window & { BTFW_notify?: NotifyApi }).BTFW_notify;
    const fn = api?.[kind];
    if (typeof fn !== "function") return;
    const span = document.createElement("span");
    span.textContent = message;
    fn({ title: "Subtitles", html: span.outerHTML, timeout: kind === "error" ? 5200 : 2600 });
  }

  function html5Video(): HTMLVideoElement | null {
    const el = document.querySelector("#videowrap video");
    return el instanceof HTMLVideoElement ? el : null;
  }

  function vjsPlayer(video: HTMLVideoElement): RemoteTrackPlayer | null {
    const host = video.closest(".video-js") as (HTMLElement & { player?: unknown }) | null;
    let player: unknown = host?.player;
    if (!player && host?.id) {
      const vjs = window.videojs as { getPlayer?: (id: string) => unknown } | undefined;
      try {
        player = typeof vjs?.getPlayer === "function" ? vjs.getPlayer(host.id) : null;
      } catch {
        player = null;
      }
    }
    const p = player as Partial<RemoteTrackPlayer> | null;
    return p && typeof p.addRemoteTextTrack === "function" && typeof p.textTracks === "function"
      ? (p as RemoteTrackPlayer)
      : null;
  }

  function detach(): void {
    if (attached) {
      try {
        attached.remove();
      } catch {
        /* player already disposed */
      }
      attached = null;
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  /** Shows `track` and hides every other subtitle/caption track on the same media. */
  function showOnly(track: TextTrack, all: ArrayLike<TextTrack>): void {
    for (let i = 0; i < all.length; i++) {
      const t = all[i];
      if (!t || (t.kind !== "subtitles" && t.kind !== "captions")) continue;
      t.mode = t === track ? "showing" : "disabled";
    }
    track.mode = "showing";
  }

  /**
   * Turning a track on before its cues finish loading can leave video.js
   * rendering only the first cue. Cycling the mode once the cues are in
   * re-arms its cue tracking, the same as toggling CC off and on.
   */
  function showWhenLoaded(el: HTMLTrackElement, all: () => ArrayLike<TextTrack>): void {
    const track = el.track;
    showOnly(track, all());
    const reshow = (): void => {
      if (attached?.track !== track) return;
      track.mode = "disabled";
      showOnly(track, all());
    };
    if (el.readyState === 2) reshow();
    else el.addEventListener("load", reshow);
  }

  function attach(video: HTMLVideoElement, url: string, label: string): boolean {
    const player = vjsPlayer(video);
    if (player) {
      const el = player.addRemoteTextTrack(
        { kind: "subtitles", src: url, label, srclang: "en", default: true },
        true
      );
      // Emulated text tracks return a video.js wrapper, not a DOM <track>.
      if (!el || !el.track) return false;
      attached = { track: el.track, remove: () => player.removeRemoteTextTrack(el) };
      showWhenLoaded(el, () => player.textTracks());
      return true;
    }
    const el = document.createElement("track");
    el.kind = "subtitles";
    el.label = label;
    el.srclang = "en";
    el.src = url;
    el.default = true;
    el.setAttribute(TRACK_ATTR, "1");
    video.appendChild(el);
    attached = { track: el.track, remove: () => el.remove() };
    showWhenLoaded(el, () => video.textTracks);
    return true;
  }

  async function load(file: File): Promise<void> {
    const video = html5Video();
    if (!video) {
      notify("error", "Local subtitles only work with direct video files.");
      return;
    }
    try {
      const vtt = toVtt(file.name, await file.text());
      detach();
      objectUrl = URL.createObjectURL(new Blob([vtt], { type: "text/vtt" }));
      const label = file.name.replace(/\.[^.]+$/, "") || "Local";
      if (!attach(video, objectUrl, label)) throw new Error("Player rejected the subtitle track");
      notify("success", `Loaded ${file.name}`);
    } catch (err) {
      console.error("[local-subs]", err);
      detach();
      notify("error", "Could not load that subtitle file.");
    }
  }

  function pickFile(): void {
    let input = document.getElementById(INPUT_ID) as HTMLInputElement | null;
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      input.id = INPUT_ID;
      input.accept = ".vtt,.srt,text/vtt";
      input.hidden = true;
      input.addEventListener("change", () => {
        const file = input?.files?.[0];
        if (input) input.value = "";
        if (file) void load(file);
      });
      document.body.appendChild(input);
    }
    input.click();
  }

  function ensureButton(): void {
    const section = document.getElementById(LEFT_SECTION_ID);
    if (!section) return;
    let btn = document.getElementById(BUTTON_ID);
    if (!btn) {
      btn = document.createElement("button");
      btn.id = BUTTON_ID;
      btn.setAttribute("type", "button");
      btn.className = "btfw-vo-btn";
      btn.title = "Load your own subtitles (.vtt/.srt)";
      btn.setAttribute("aria-label", "Load your own subtitles");
      const icon = document.createElement("i");
      icon.className = "fa fa-cc";
      icon.setAttribute("aria-hidden", "true");
      btn.appendChild(icon);
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        pickFile();
      });
    }
    if (btn.parentElement !== section) section.insertBefore(btn, section.firstChild);
    // `.btfw-vo-btn` sets `display`, which would override the `hidden` attribute.
    btn.style.display = html5Video() ? "" : "none";
  }

  function scheduleSync(): void {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(ensureButton, 50);
  }

  function boot(): void {
    ensureButton();
    const root = document.body;
    if (root && root.dataset.btfwLocalSubsObs !== "1") {
      root.dataset.btfwLocalSubsObs = "1";
      new MutationObserver(scheduleSync).observe(root, { childList: true, subtree: true });
    }
    const socket = window.socket;
    if (socket && typeof socket.on === "function") {
      socket.on("changeMedia", () => {
        detach();
        scheduleSync();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  return { name: "feature:local-subs" };
});
