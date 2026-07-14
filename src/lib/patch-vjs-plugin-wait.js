const PLUGIN_NAME = "videoJsResolutionSwitcher";
const POLL_MS = 25;
const TIMEOUT_MS = 5000;
const INSTALL_RETRIES = 40;

function getRoot() {
  return typeof globalThis !== "undefined" ? globalThis : undefined;
}

function getVideoJs() {
  const root = getRoot();
  if (!root) return null;
  return root.videojs ?? root.window?.videojs ?? null;
}

function hasResolutionSwitcherPlugin() {
  const vjs = getVideoJs();
  return Boolean(vjs && typeof vjs.getPlugin === "function" && vjs.getPlugin(PLUGIN_NAME));
}

function wrapWaitUntilDefined(original) {
  if (!original || original._btfwVjsPluginWait) return original;

  const root = getRoot();
  const win = root?.window ?? root;

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
  if (!root || typeof root.waitUntilDefined !== "function") return false;
  root.waitUntilDefined = wrapWaitUntilDefined(root.waitUntilDefined);
  return true;
}

export function patchWaitUntilDefinedForVjsPlugins() {
  if (installPatch()) return;

  let tries = 0;
  const timer = setInterval(() => {
    if (installPatch() || ++tries >= INSTALL_RETRIES) clearInterval(timer);
  }, 50);
}
