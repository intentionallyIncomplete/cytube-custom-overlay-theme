/* BTFW — feature:monkeyPaw (Monkey Paw curl animation after movie requests) */
BTFW.define("feature:monkeyPaw", [], async () => {
  const STYLE_ID = "btfw-monkey-paw-styles";
  const OVERLAY_ID = "btfw-monkey-paw-overlay";
  const PAW_SVG_PATH = "/assets/monkey-paw/paw.svg";

  const CURLS = {
    "f-pinky": { root: "rotate(85deg)", tip: "rotate(70deg)" },
    "f-ring": { root: "rotate(88deg)", tip: "rotate(75deg)" },
    "f-index": { root: "rotate(87deg)", tip: "rotate(74deg)" },
    "f-thumb": { root: "rotate(62deg)", tip: "rotate(38deg)" }
  };

  const STAGGER = {
    "f-pinky": 0,
    "f-ring": 90,
    "f-index": 190,
    "f-thumb": 300
  };

  const OPEN_FINGER_TRANSFORMS = {
    "f-pinky": { root: "rotate(0deg)", tip: "rotate(0deg)" },
    "f-ring": { root: "rotate(0deg)", tip: "rotate(0deg)" },
    "f-index": { root: "rotate(0deg)", tip: "rotate(0deg)" },
    "f-thumb": { root: "rotate(-18deg)", tip: "rotate(0deg)" }
  };

  let svgMarkupCache = null;
  let playPromise = null;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getAssetBase() {
    try {
      const btfw = typeof window !== "undefined" ? window.BTFW : null;
      return (btfw && (btfw.BASE || btfw.DEV_CDN)) || "";
    } catch (_) {
      return "";
    }
  }

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (_) {
      return false;
    }
  }

  function injectStyles() {
    if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID} {
        position: fixed;
        inset: 0;
        z-index: 6200;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(10, 8, 6, 0.92);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease;
        font-family: Georgia, "Times New Roman", serif;
        overflow: hidden;
      }

      #${OVERLAY_ID}.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      #${OVERLAY_ID}::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 60%, rgba(60, 28, 8, 0.45) 0%, transparent 70%);
        pointer-events: none;
        transition: background 1.4s ease;
      }

      #${OVERLAY_ID}.is-cursed::before {
        background: radial-gradient(ellipse at 50% 60%, rgba(120, 15, 15, 0.55) 0%, transparent 70%);
      }

      #${OVERLAY_ID} .btfw-monkey-paw-scene {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        padding: 24px 20px;
        max-width: min(92vw, 420px);
      }

      #${OVERLAY_ID} .btfw-monkey-paw-title {
        color: #7a4c22;
        font-size: 0.95rem;
        font-weight: normal;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        margin: 0;
        opacity: 0;
        animation: btfwMonkeyPawFadeIn 1.2s 0.15s forwards;
      }

      @keyframes btfwMonkeyPawFadeIn {
        to { opacity: 1; }
      }

      #${OVERLAY_ID} .btfw-monkey-paw-stage {
        position: relative;
        width: min(72vw, 300px);
        height: min(78vw, 380px);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #${OVERLAY_ID} #paw {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 16px 48px rgba(0, 0, 0, 0.9)) drop-shadow(0 4px 12px rgba(80, 30, 0, 0.6));
      }

      #${OVERLAY_ID} .f-root {
        transition: transform 0.65s cubic-bezier(0.4, 0, 0.15, 1);
      }

      #${OVERLAY_ID} .f-tip {
        transition: transform 0.55s 0.12s cubic-bezier(0.4, 0, 0.15, 1);
      }

      @keyframes btfwMonkeyPawShake {
        0%, 100% { transform: rotate(0deg) translateY(0); }
        15% { transform: rotate(-4deg) translateY(-4px); }
        30% { transform: rotate(5deg) translateY(-6px); }
        45% { transform: rotate(-4deg) translateY(-3px); }
        60% { transform: rotate(4deg) translateY(-5px); }
        75% { transform: rotate(-3deg) translateY(-2px); }
        90% { transform: rotate(2deg) translateY(-1px); }
      }

      #${OVERLAY_ID} #paw.btfw-monkey-paw-shaking {
        animation: btfwMonkeyPawShake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }

      #${OVERLAY_ID} .btfw-monkey-paw-msg {
        font-size: 0.78rem;
        letter-spacing: 0.15em;
        color: #c0392b;
        opacity: 0;
        transition: opacity 0.8s;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
      }

      #${OVERLAY_ID} .btfw-monkey-paw-msg.is-visible {
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        #${OVERLAY_ID} .f-root,
        #${OVERLAY_ID} .f-tip,
        #${OVERLAY_ID} #paw.btfw-monkey-paw-shaking {
          transition: none;
          animation: none;
        }
      }
    `;
    document.head.appendChild(style);
  }

  async function loadPawSvg() {
    if (svgMarkupCache) return svgMarkupCache;
    const base = getAssetBase();
    const url = `${base}${PAW_SVG_PATH}`;
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error(`Monkey paw SVG failed to load (${res.status})`);
    svgMarkupCache = await res.text();
    return svgMarkupCache;
  }

  function resetFingerTransforms(rootEl) {
    Object.entries(OPEN_FINGER_TRANSFORMS).forEach(([id, transforms]) => {
      const root = rootEl.querySelector(`#${id}`);
      const tip = rootEl.querySelector(`#${id}-tip`);
      if (root) root.style.transform = transforms.root;
      if (tip) tip.style.transform = transforms.tip;
    });
  }

  function runFingerCurl(rootEl) {
    Object.entries(CURLS).forEach(([id, curl]) => {
      window.setTimeout(() => {
        const root = rootEl.querySelector(`#${id}`);
        const tip = rootEl.querySelector(`#${id}-tip`);
        if (root) root.style.transform = curl.root;
        if (tip) {
          window.setTimeout(() => {
            tip.style.transform = curl.tip;
          }, 120);
        }
      }, STAGGER[id]);
    });
  }

  function buildOverlayMarkup(svgMarkup) {
    return `
      <div class="btfw-monkey-paw-scene" role="dialog" aria-modal="true" aria-labelledby="btfw-monkey-paw-title">
        <h2 class="btfw-monkey-paw-title" id="btfw-monkey-paw-title">The Monkey Paw</h2>
        <div class="btfw-monkey-paw-stage">${svgMarkup}</div>
        <p class="btfw-monkey-paw-msg" id="btfw-monkey-paw-msg">Your wish is granted.</p>
      </div>
    `;
  }

  async function play(options = {}) {
    if (playPromise) return playPromise;
    if (typeof document === "undefined") return;

    playPromise = (async () => {
      injectStyles();

      if (prefersReducedMotion()) {
        await wait(options.reducedMotionMs ?? 450);
        return;
      }

      let overlay = document.getElementById(OVERLAY_ID);
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = OVERLAY_ID;
        document.body.appendChild(overlay);
      }

      let svgMarkup;
      try {
        svgMarkup = await loadPawSvg();
      } catch (err) {
        console.warn("[monkey-paw] SVG load failed:", err);
        await wait(300);
        return;
      }

      overlay.innerHTML = buildOverlayMarkup(svgMarkup);
      resetFingerTransforms(overlay);

      const paw = overlay.querySelector("#paw");
      const msg = overlay.querySelector("#btfw-monkey-paw-msg");

      overlay.classList.remove("is-cursed");
      msg?.classList.remove("is-visible");

      requestAnimationFrame(() => overlay.classList.add("is-active"));

      runFingerCurl(overlay);
      await wait(980);

      paw?.classList.add("btfw-monkey-paw-shaking");
      await wait(720);
      paw?.classList.remove("btfw-monkey-paw-shaking");

      overlay.classList.add("is-cursed");
      msg?.classList.add("is-visible");

      await wait(options.holdMs ?? 1100);

      overlay.classList.remove("is-active");
      await wait(320);
      overlay.remove();
    })().finally(() => {
      playPromise = null;
    });

    return playPromise;
  }

  return {
    name: "feature:monkeyPaw",
    play
  };
});
