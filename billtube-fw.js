(() => {
  // lib/btfw-registry.js
  function createBtfwRegistry(devCdn) {
    const Registry = /* @__PURE__ */ Object.create(null);
    function define(moduleName, moduleDeps, functionFactory) {
      Registry[moduleName] = {
        deps: moduleDeps || [],
        factory: functionFactory,
        instance: null
      };
    }
    async function init(moduleName) {
      const module = Registry[moduleName];
      if (!module) {
        throw new Error("Module not found: " + moduleName);
      }
      if (module.instance) {
        return module.instance;
      }
      for (let i = 0; i < module.deps.length; i++) {
        await init(module.deps[i]);
      }
      module.instance = await module.factory({ define, init, DEV_CDN: devCdn });
      return module.instance;
    }
    function getRegistry() {
      return Registry;
    }
    return { define, init, getRegistry };
  }

  // lib/resolve-btfw-base.js
  function resolveBtfwBaseFromScriptSrc(src, fallback) {
    if (!src || typeof src !== "string") {
      return fallback;
    }
    var jsdelivr = src.match(/^(https:\/\/cdn\.jsdelivr\.net\/gh\/[^/]+\/[^/]+@[^/]+)/);
    if (jsdelivr) {
      return jsdelivr[1];
    }
    try {
      var url = new URL(src);
      var basePath = url.pathname.replace(/\/[^/]*$/, "");
      if (!basePath) {
        basePath = "";
      }
      return url.origin + basePath;
    } catch (_) {
      return fallback;
    }
  }
  function resolveBtfwBase(doc, fallback) {
    var scripts = doc.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || "";
      if (!/billtube-fw\.js(?:\?|$)/.test(src)) {
        continue;
      }
      var base = resolveBtfwBaseFromScriptSrc(src, fallback);
      if (base !== fallback) {
        return base;
      }
    }
    console.warn(
      "[BTFW] Could not read version from billtube-fw.js URL; using fallback. Pin CDN_BASE in channel config to a release tag."
    );
    return fallback;
  }

  // lib/patch-vjs-plugin-wait.js
  var PLUGIN_NAME = "videoJsResolutionSwitcher";
  var POLL_MS = 25;
  var TIMEOUT_MS = 5e3;
  var INSTALL_RETRIES = 40;
  function getRoot() {
    return typeof globalThis !== "undefined" ? globalThis : void 0;
  }
  function getVideoJs() {
    var _a, _b, _c;
    const root = getRoot();
    if (!root)
      return null;
    return (_c = (_b = root.videojs) != null ? _b : (_a = root.window) == null ? void 0 : _a.videojs) != null ? _c : null;
  }
  function hasResolutionSwitcherPlugin() {
    const vjs = getVideoJs();
    return Boolean(vjs && typeof vjs.getPlugin === "function" && vjs.getPlugin(PLUGIN_NAME));
  }
  function wrapWaitUntilDefined(original) {
    var _a;
    if (!original || original._btfwVjsPluginWait)
      return original;
    const root = getRoot();
    const win = (_a = root == null ? void 0 : root.window) != null ? _a : root;
    function patched(obj, key, cb) {
      if (obj === win && key === "videojs") {
        return original(obj, key, () => {
          const deadline = Date.now() + TIMEOUT_MS;
          const tick = () => {
            if (hasResolutionSwitcherPlugin() || Date.now() > deadline) {
              if (!hasResolutionSwitcherPlugin()) {
                console.warn(
                  `[BTFW] ${PLUGIN_NAME} plugin not registered; direct-file player may fail`
                );
              }
              cb();
              return;
            }
            setTimeout(tick, POLL_MS);
          };
          tick();
        });
      }
      return original(obj, key, cb);
    }
    patched._btfwVjsPluginWait = true;
    return patched;
  }
  function installPatch() {
    const root = getRoot();
    if (!root || typeof root.waitUntilDefined !== "function")
      return false;
    root.waitUntilDefined = wrapWaitUntilDefined(root.waitUntilDefined);
    return true;
  }
  function patchWaitUntilDefinedForVjsPlugins() {
    if (installPatch())
      return;
    let tries = 0;
    const timer = setInterval(() => {
      if (installPatch() || ++tries >= INSTALL_RETRIES)
        clearInterval(timer);
    }, 50);
  }

  // src/billtube-fw.ts
  patchWaitUntilDefinedForVjsPlugins();
  var FALLBACK_CDN = "https://cdn.jsdelivr.net/gh/intentionallyIncomplete/BillTube3-slim@latest";
  var DEV_CDN = resolveBtfwBase(document, FALLBACK_CDN);
  (function() {
    const { define, init } = createBtfwRegistry(DEV_CDN);
    const BASE = DEV_CDN;
    window.BTFW = { define, init, DEV_CDN, BASE };
    const BootOverlay = /* @__PURE__ */ function() {
      let overlay = null;
      let styleEl = null;
      let muteInterval = null;
      const suppressedVideos = /* @__PURE__ */ new Map();
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
        videos.forEach(function(video) {
          if (!(video instanceof HTMLVideoElement))
            return;
          if (!suppressedVideos.has(video)) {
            const state = {
              muted: video.muted,
              volume: typeof video.volume === "number" ? video.volume : null
            };
            suppressedVideos.set(video, state);
          }
          try {
            video.muted = true;
          } catch (_) {
          }
        });
      }
      function startAudioSuppression() {
        var _a;
        suppressVideoAudio();
        if (muteInterval)
          return;
        muteInterval = setInterval(suppressVideoAudio, 250);
        (_a = document.documentElement) == null ? void 0 : _a.classList.add("btfw-loading-muted");
      }
      function stopAudioSuppression() {
        var _a;
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
              if (typeof state.volume === "number")
                video.volume = state.volume;
            }
          } catch (_) {
          }
          suppressedVideos.delete(video);
        }
        (_a = document.documentElement) == null ? void 0 : _a.classList.remove("btfw-loading-muted");
      }
      function attach() {
        if (overlay)
          return overlay;
        overlay = document.createElement("div");
        overlay.id = "btfw-boot-overlay";
        overlay.setAttribute("role", "status");
        overlay.setAttribute("aria-live", "polite");
        overlay.innerHTML = `
        <div class="btfw-boot-overlay__card">
          <div class="btfw-boot-overlay__ring"></div>
          <p class="btfw-boot-overlay__label">
            <strong>BillTube theme</strong>
            Preparing the channel experience\u2026
          </p>
          <p class="btfw-boot-overlay__error"></p>
        </div>
      `;
        const mount = function() {
          if (!overlay || overlay.isConnected)
            return;
          const host = document.body || document.documentElement;
          host.appendChild(overlay);
        };
        if (document.body)
          mount();
        else
          document.addEventListener("DOMContentLoaded", mount, { once: true });
        return overlay;
      }
      function show() {
        attach();
        startAudioSuppression();
      }
      function hide() {
        stopAudioSuppression();
        if (!overlay)
          return;
        overlay.setAttribute("data-state", "hidden");
        setTimeout(function() {
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
      function fail(message) {
        const ov = attach();
        ov.setAttribute("data-state", "error");
        const label = ov.querySelector(".btfw-boot-overlay__label");
        if (label) {
          label.innerHTML = "<strong>BillTube theme</strong>Something went wrong loading the experience.";
        }
        const err = ov.querySelector(".btfw-boot-overlay__error");
        if (err)
          err.textContent = message || "Please refresh to retry.";
        setTimeout(function() {
          hide();
        }, 4e3);
      }
      return { show, hide, fail };
    }();
    BootOverlay.show();
    function qparam(u, kv) {
      return u + (u.indexOf("?") >= 0 ? "&" : "?") + kv;
    }
    const BTFW_VERSION = function() {
      const m = /[?&]v=([^&]+)/.exec(location.search);
      return m && m[1] || "dev-" + Date.now();
    }();
    const SUPPORTS_PRELOAD = function() {
      try {
        return document.createElement("link").relList.supports("preload");
      } catch (e) {
        return false;
      }
    }();
    function preload(href) {
      return new Promise(function(resolve, reject) {
        const link = document.createElement("link");
        let url;
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
          if (settled)
            return;
          settled = true;
          promoteToStylesheet();
          resolve(true);
        }
        function handleError(event) {
          if (settled)
            return;
          settled = true;
          promoteToStylesheet();
          const reason = event && typeof event === "object" && "error" in event && event.error ? event.error : new Error("Failed to preload stylesheet: " + href);
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
          Promise.resolve().then(function() {
            if (!settled) {
              settled = true;
              resolve(true);
            }
          });
        }
      });
    }
    function load(src) {
      return new Promise(function(resolve, reject) {
        const s = document.createElement("script");
        s.async = true;
        s.defer = true;
        s.src = qparam(src, "v=" + encodeURIComponent(BTFW_VERSION)) + "&t=" + Date.now();
        s.onload = function() {
          resolve();
        };
        s.onerror = function() {
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
    ]).then(function() {
      const scripts = [
        "dist/core.bundle.js",
        "dist/chat.bundle.js",
        "dist/player.bundle.js",
        "dist/playlist.bundle.js",
        "dist/admin.bundle.js",
        "dist/features.bundle.js"
      ];
      return Promise.all(
        scripts.map(function(file) {
          return load(BASE + "/" + file);
        })
      );
    }).then(function() {
      return Promise.all([
        window.BTFW.init("feature:styleCore"),
        window.BTFW.init("feature:themeMode")
      ]);
    }).then(function() {
      return window.BTFW.init("feature:layout");
    }).then(function() {
      const inits = [
        window.BTFW.init("feature:footer"),
        window.BTFW.init("feature:player"),
        window.BTFW.init("feature:stack"),
        window.BTFW.init("feature:chat"),
        window.BTFW.init("feature:chat-tools"),
        window.BTFW.init("feature:chat-filters"),
        window.BTFW.init("feature:chat-username-colors"),
        window.BTFW.init("feature:emotes"),
        window.BTFW.init("feature:chatMedia"),
        window.BTFW.init("feature:emoji-compat"),
        window.BTFW.init("feature:chat-avatars"),
        window.BTFW.init("feature:chat-timestamps"),
        window.BTFW.init("feature:chat-ignore"),
        window.BTFW.init("feature:themeIcons"),
        window.BTFW.init("feature:navbar"),
        window.BTFW.init("feature:modal-skin"),
        window.BTFW.init("feature:nowplaying"),
        window.BTFW.init("feature:gifs"),
        window.BTFW.init("feature:videoOverlay"),
        window.BTFW.init("feature:poll-overlay"),
        window.BTFW.init("feature:notify"),
        window.BTFW.init("feature:notification-sounds"),
        window.BTFW.init("feature:syncGuard"),
        window.BTFW.init("feature:chat-commands"),
        window.BTFW.init("feature:drink-counter"),
        window.BTFW.init("feature:playlistPerformance"),
        window.BTFW.init("feature:playlist-tools"),
        window.BTFW.init("feature:local-subs"),
        window.BTFW.init("feature:emoji-loader"),
        window.BTFW.init("feature:motd-editor"),
        window.BTFW.init("feature:channelThemeAdmin"),
        window.BTFW.init("feature:themeSettings"),
        window.BTFW.init("feature:audio"),
        window.BTFW.init("feature:movie-info"),
        window.BTFW.init("ext:movie-suggestion")
      ];
      return Promise.all(inits);
    }).then(function() {
      return window.BTFW.init("feature:layout").then(function(layout) {
        const layoutApi = layout;
        return layoutApi && layoutApi.commitLayout ? layoutApi.commitLayout() : Promise.resolve();
      });
    }).then(function() {
      return window.BTFW.init("feature:syncGuard").then(function(sg) {
        const syncGuard = sg;
        return syncGuard && syncGuard.playbackResyncIfNeeded ? syncGuard.playbackResyncIfNeeded() : Promise.resolve();
      });
    }).then(function() {
      console.log("[BTFW v3.4f] Ready.");
      document.dispatchEvent(
        new CustomEvent("btfw:ready", {
          detail: { version: "3.4f", timestamp: Date.now() }
        })
      );
      BootOverlay.hide();
    }).catch(function(e) {
      const err = e;
      console.error("[BTFW v3.4f] boot failed:", err && err.message || e);
      BootOverlay.fail(err && err.message || "Unknown error");
    });
  })();
})();
