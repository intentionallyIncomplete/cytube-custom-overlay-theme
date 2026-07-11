import { createBtfwRegistry } from "../lib/btfw-registry.js";
import { resolveBtfwBase } from "../lib/resolve-btfw-base.js";
import { patchWaitUntilDefinedForVjsPlugins } from "../lib/patch-vjs-plugin-wait.js";
import { bootOverlayCardHtml } from "../lib/templates/boot-overlay.js";
import { BOOT_FOUNDATION, BOOT_LAYOUT, BOOT_CHAT, BOOT_DOM, BOOT_NAV, BOOT_SETTINGS, BOOT_SYNC } from "./boot/manifest.js";

patchWaitUntilDefinedForVjsPlugins();

const FALLBACK_CDN = "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/cytube-custom-overlay-theme@latest";
const DEV_CDN = resolveBtfwBase(document, FALLBACK_CDN);

interface VideoAudioState {
  muted: boolean;
  volume: number | null;
}

interface BootOverlayApi {
  show(): void;
  hide(): void;
  fail(message?: string): void;
}

(function () {
  const { define, init } = createBtfwRegistry(DEV_CDN);

  const BASE = DEV_CDN;
  window.BTFW = { define, init, DEV_CDN, BASE, state: null };

  const BootOverlay: BootOverlayApi = (function () {
    let overlay: HTMLDivElement | null = null;
    let styleEl: HTMLStyleElement | null = null;
    let muteInterval: ReturnType<typeof setInterval> | null = null;
    const suppressedVideos = new Map<HTMLVideoElement, VideoAudioState>();
    const documentElement = document.documentElement;

    function cleanupVideoRefs() {
      for (const [video] of suppressedVideos) {
        if (!(video instanceof HTMLVideoElement) || !video.isConnected) {
          suppressedVideos.delete(video);
        }
      }
    }

    function suppressVideoAudio() {
      cleanupVideoRefs();
      const videos = document.querySelectorAll("video");
      videos.forEach(function (video) {
        if (!(video instanceof HTMLVideoElement)) return;
        if (!suppressedVideos.has(video)) {
          const state: VideoAudioState = {
            muted: video.muted,
            volume: typeof video.volume === "number" ? video.volume : null
          };
          suppressedVideos.set(video, state);
        }
        try {
          video.muted = true;
        } catch (_) {
          /* ignore */
        }
      });
    }

    function startAudioSuppression() {
      suppressVideoAudio();
      if (muteInterval) return;
      muteInterval = setInterval(suppressVideoAudio, 250);
      documentElement?.classList.add("btfw-loading-muted");
    }

    function stopAudioSuppression() {
      if (muteInterval) {
        clearInterval(muteInterval);
        muteInterval = null;
      }
      for (const [video, state] of suppressedVideos.entries()) {
        if (!(video instanceof HTMLVideoElement)) {
          suppressedVideos.delete(video);
          continue;
        }
        try {
          if (!state.muted) {
            video.muted = false;
            if (typeof state.volume === "number") video.volume = state.volume;
          }
        } catch (_) {
          /* ignore */
        }
        suppressedVideos.delete(video);
      }
      documentElement?.classList.remove("btfw-loading-muted");
    }

    function attach() {
      if (overlay) return overlay;
      overlay = document.createElement("div");
      overlay.id = "btfw-boot-overlay";
      overlay.setAttribute("role", "status");
      overlay.setAttribute("aria-live", "polite");
      overlay.innerHTML = bootOverlayCardHtml();
      const mount = function () {
        if (!overlay || overlay.isConnected) return;
        const host = document.body || document.documentElement;
        host.appendChild(overlay);
      };
      if (document.body) mount();
      else document.addEventListener("DOMContentLoaded", mount, { once: true });
      return overlay;
    }

    function show() {
      attach();
      startAudioSuppression();
    }

    function hide() {
      stopAudioSuppression();
      if (!overlay) return;
      overlay.setAttribute("data-state", "hidden");
      setTimeout(function () {
        if (overlay) {
          overlay.remove();
          overlay = null;
        }
        if (styleEl) {
          styleEl.remove();
          styleEl = null;
        }
      }, 260);
    }

    function fail(message?: string) {
      const ov = attach();
      ov.setAttribute("data-state", "error");
      const label = ov.querySelector(".btfw-boot-overlay__label");
      if (label) {
        label.innerHTML =
          "<strong>Quigly's Playground</strong>Something went wrong loading the experience.";
      }
      const err = ov.querySelector(".btfw-boot-overlay__error");
      if (err) err.textContent = message || "Please refresh to retry.";
      setTimeout(function () {
        hide();
      }, 4000);
    }

    return { show, hide, fail };
  })();

  BootOverlay.show();

  function qparam(u: string, kv: string) {
    return u + (u.indexOf("?") >= 0 ? "&" : "?") + kv;
  }

  const BTFW_VERSION = (function () {
    const m = /[?&]v=([^&]+)/.exec(location.search);
    return (m && m[1]) || "dev-" + Date.now();
  })();

  const SUPPORTS_PRELOAD = (function () {
    try {
      return document.createElement("link").relList.supports("preload");
    } catch (e) {
      return false;
    }
  })();

  function preload(href: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      const link = document.createElement("link");
      let url: string;

      try {
        url = qparam(href, "v=" + encodeURIComponent(BTFW_VERSION));
      } catch (err) {
        reject(err instanceof Error ? err : new Error("Failed to prepare preload URL"));
        return;
      }

      let settled = false;

      function promoteToStylesheet() {
        link.rel = "stylesheet";
        link.removeAttribute("onload");
        link.removeAttribute("onerror");
      }

      function handleLoad() {
        if (settled) return;
        settled = true;
        promoteToStylesheet();
        resolve(true);
      }

      function handleError(event: Event | string) {
        if (settled) return;
        settled = true;
        promoteToStylesheet();
        const reason =
          event && typeof event === "object" && "error" in event && event.error
            ? (event.error as Error)
            : new Error("Failed to preload stylesheet: " + href);
        reject(reason);
      }

      if (SUPPORTS_PRELOAD) {
        link.rel = "preload";
        link.as = "style";
      } else {
        link.rel = "stylesheet";
      }

      link.onload = handleLoad;
      link.onerror = handleError;
      link.href = url;

      document.head.appendChild(link);

      if (!SUPPORTS_PRELOAD) {
        Promise.resolve().then(function () {
          if (!settled) {
            settled = true;
            resolve(true);
          }
        });
      }
    });
  }

  function load(src: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.async = true;
      s.defer = true;
      s.src = qparam(src, "v=" + encodeURIComponent(BTFW_VERSION)) + "&t=" + Date.now();
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error("Failed to load " + src));
      };
      document.head.appendChild(s);
    });
  }

  console.log("[BTFW] BASE:", BASE);

  Promise.all([
    preload(BASE + "/css/tokens.css"),
    preload(BASE + "/css/base.css"),
    preload(BASE + "/css/navbar.css"),
    preload(BASE + "/css/chat.css"),
    preload(BASE + "/css/overlays.css"),
    preload(BASE + "/css/player.css"),
    preload(BASE + "/css/mobile.css"),
    preload(BASE + "/css/boot-overlay.css")
  ])
    .then(function () {
      const scripts = [
        "dist/core.bundle.js",
        "dist/chat.bundle.js",
        "dist/player.bundle.js",
        "dist/playlist.bundle.js",
        "dist/admin.bundle.js",
        "dist/features.bundle.js"
      ];
      return Promise.all(
        scripts.map(function (file) {
          return load(BASE + "/" + file);
        })
      );
    })
    .then(function () {
      return window.BTFW.init("util:state");
    })
    .then(function () {
      return Promise.all(
        BOOT_FOUNDATION.map(function (name) {
          return window.BTFW.init(name);
        })
      );
    })
    .then(function () {
      return Promise.all(
        BOOT_LAYOUT.map(function (name) {
          return window.BTFW.init(name);
        })
      );
    })
    .then(function () {
      const groups = [BOOT_DOM, BOOT_CHAT, BOOT_NAV, BOOT_SYNC, BOOT_SETTINGS];
      const inits = groups.flatMap(function (group) {
        return group.map(function (name) {
          return window.BTFW.init(name);
        });
      });
      return Promise.all(inits);
    })
    .then(function () {
      return window.BTFW.init("feature:layout").then(function (layout) {
        const layoutApi = layout as { commitLayout?: () => Promise<void> } | null;
        return layoutApi && layoutApi.commitLayout
          ? layoutApi.commitLayout()
          : Promise.resolve();
      });
    })
    .then(function () {
      return window.BTFW.init("feature:syncGuard").then(function (sg) {
        const syncGuard = sg as { playbackResyncIfNeeded?: () => Promise<void> } | null;
        return syncGuard && syncGuard.playbackResyncIfNeeded
          ? syncGuard.playbackResyncIfNeeded()
          : Promise.resolve();
      });
    })
    .then(function () {
      console.log("[BTFW v3.4f] Ready.");
      document.dispatchEvent(
        new CustomEvent("btfw:ready", {
          detail: { version: "3.4f", timestamp: Date.now() }
        })
      );
      BootOverlay.hide();
    })
    .catch(function (e: unknown) {
      const err = e as { message?: string };
      console.error("[BTFW v3.4f] boot failed:", (err && err.message) || e);
      BootOverlay.fail((err && err.message) || "Unknown error");
    });
})();
