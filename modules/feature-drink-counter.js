BTFW.define("feature:drink-counter", [], async () => {
  const $ = (s, r = document) => r.querySelector(s);
  const motion = await BTFW.init("util:motion");

  const MAX_DRINK_ANIMS = 5;

  const POUR_TIMING = {
    tiltSettle: 300,
    beforeStream: 150,
    beforeFill: 400,
    hold: 700,
    beforeClose: 300,
    afterClose: 250,
  };

  const drinkQueues = new WeakMap();

  const SCENE_HTML = `
    <svg class="btfw-drink-counter__stream" viewBox="0 0 80 200" aria-hidden="true">
      <path class="btfw-drink-counter__stream-path"
        d="M10 0 C12 30, 8 60, 14 90 C18 115, 22 140, 28 165 C32 180, 36 190, 38 200"
        fill="none" stroke="#d4841a" stroke-width="11" stroke-linecap="round" opacity="0.92" />
      <path
        d="M10 0 C12 30, 8 60, 14 90 C18 115, 22 140, 28 165 C32 180, 36 190, 38 200"
        fill="none" stroke="rgba(255,240,200,0.35)" stroke-width="5" stroke-linecap="round" />
    </svg>
    <div class="btfw-drink-counter__glass-wrap">
      <svg class="btfw-drink-counter__glass-svg" viewBox="0 0 72 110" aria-hidden="true">
        <path d="M8 10 L14 100 L58 100 L64 10 Z" fill="rgba(200,230,255,0.13)" stroke="#aac" stroke-width="2.5" />
        <clipPath id="btfw-drink-glass-clip">
          <path d="M8 10 L14 100 L58 100 L64 10 Z" />
        </clipPath>
        <rect x="0" y="28" width="72" height="75" fill="#d4841a" opacity="0.85" clip-path="url(#btfw-drink-glass-clip)" />
        <ellipse cx="36" cy="27" rx="26" ry="10" fill="#fff8ee" opacity="0.9" clip-path="url(#btfw-drink-glass-clip)" />
      </svg>
    </div>
    <div class="btfw-drink-counter__face-wrap">
      <svg class="btfw-drink-counter__face-svg" viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id="btfw-drink-mouth-clip">
            <ellipse class="btfw-drink-counter__mouth-clip-shape" cx="50" cy="75" rx="0.1" ry="0.1" />
          </clipPath>
        </defs>
        <circle class="btfw-drink-counter__face-base" cx="50" cy="50" r="46" fill="#f5c07a" />
        <ellipse cx="36" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.18)" />
        <g class="btfw-drink-counter__eye-l">
          <circle cx="33" cy="44" r="7" fill="#1a1109" />
          <circle cx="35" cy="42" r="2.2" fill="white" />
        </g>
        <g class="btfw-drink-counter__eye-r">
          <circle cx="67" cy="44" r="7" fill="#1a1109" />
          <circle cx="69" cy="42" r="2.2" fill="white" />
        </g>
        <path class="btfw-drink-counter__brow-l" d="M22 33 Q33 28 42 31" fill="none" stroke="#5c3d11" stroke-width="3.2" stroke-linecap="round" />
        <path class="btfw-drink-counter__brow-r" d="M58 31 Q67 28 78 33" fill="none" stroke="#5c3d11" stroke-width="3.2" stroke-linecap="round" />
        <path class="btfw-drink-counter__mouth-outline" d="M38 72 Q50 80 62 72 Q50 76 38 72 Z" fill="#5c3d11" />
        <ellipse class="btfw-drink-counter__mouth-cavity" cx="50" cy="75" rx="0.1" ry="0.1" fill="#1a0a00" />
        <g clip-path="url(#btfw-drink-mouth-clip)">
          <rect class="btfw-drink-counter__mouth-beer" x="34" y="65" width="32" height="22" fill="#d4841a" rx="2" />
          <rect class="btfw-drink-counter__mouth-foam" x="34" y="65" width="32" height="5" fill="#fff8ee" opacity="0" />
        </g>
        <g class="btfw-drink-counter__teeth" opacity="0">
          <rect x="40" y="69" width="6" height="7" rx="1.5" fill="white" />
          <rect x="47" y="69" width="6" height="7" rx="1.5" fill="white" />
          <rect x="54" y="69" width="6" height="7" rx="1.5" fill="white" />
        </g>
        <ellipse class="btfw-drink-counter__tongue" cx="50" cy="80" rx="0.1" ry="0.1" fill="#e8665a" />
      </svg>
    </div>
  `;

  let currentCount = 0;
  let lastCount = null;
  let socketWired = false;

  function drinkAnimationCount(prev, next) {
    if (prev === null || next <= prev) return 0;
    return Math.min(next - prev, MAX_DRINK_ANIMS);
  }

  function hideStockDrinkbar() {
    const wrap = document.getElementById("drinkbarwrap");
    if (wrap) wrap.hidden = true;
    const bar = document.getElementById("drinkbar");
    if (bar) bar.hidden = true;
  }

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function getPourEls(widget) {
    return {
      faceWrap: widget.querySelector(".btfw-drink-counter__face-wrap"),
      glassWrap: widget.querySelector(".btfw-drink-counter__glass-wrap"),
      stream: widget.querySelector(".btfw-drink-counter__stream"),
      streamPath: widget.querySelector(".btfw-drink-counter__stream-path"),
      mouthOutline: widget.querySelector(".btfw-drink-counter__mouth-outline"),
      mouthCavity: widget.querySelector(".btfw-drink-counter__mouth-cavity"),
      mouthClipShape: widget.querySelector(".btfw-drink-counter__mouth-clip-shape"),
      mouthBeer: widget.querySelector(".btfw-drink-counter__mouth-beer"),
      mouthFoam: widget.querySelector(".btfw-drink-counter__mouth-foam"),
      teeth: widget.querySelector(".btfw-drink-counter__teeth"),
      tongue: widget.querySelector(".btfw-drink-counter__tongue"),
      browL: widget.querySelector(".btfw-drink-counter__brow-l"),
      browR: widget.querySelector(".btfw-drink-counter__brow-r"),
      eyeL: widget.querySelector(".btfw-drink-counter__eye-l"),
      eyeR: widget.querySelector(".btfw-drink-counter__eye-r"),
    };
  }

  function openMouth(els) {
    if (!els.mouthOutline) return;

    els.mouthOutline.setAttribute(
      "d",
      "M34 68 Q38 64 50 63 Q62 64 66 68 Q64 87 50 88 Q36 87 34 68 Z",
    );
    els.mouthCavity?.setAttribute("rx", "14");
    els.mouthCavity?.setAttribute("ry", "11");
    els.mouthCavity?.setAttribute("cy", "76");
    els.mouthClipShape?.setAttribute("rx", "14");
    els.mouthClipShape?.setAttribute("ry", "11");
    els.mouthClipShape?.setAttribute("cy", "76");
    if (els.teeth) els.teeth.setAttribute("opacity", "1");
    els.tongue?.setAttribute("rx", "9");
    els.tongue?.setAttribute("ry", "5");
    els.tongue?.setAttribute("cy", "84");
    els.browL?.setAttribute("d", "M22 29 Q33 24 42 27");
    els.browR?.setAttribute("d", "M58 27 Q67 24 78 29");
    if (els.eyeL) els.eyeL.style.transform = "scaleY(1.2)";
    if (els.eyeR) els.eyeR.style.transform = "scaleY(1.2)";
  }

  function closeMouth(els) {
    if (!els.mouthOutline) return;

    els.mouthOutline.setAttribute("d", "M38 72 Q50 80 62 72 Q50 76 38 72 Z");
    els.mouthCavity?.setAttribute("rx", "0.1");
    els.mouthCavity?.setAttribute("ry", "0.1");
    els.mouthCavity?.setAttribute("cy", "75");
    els.mouthClipShape?.setAttribute("rx", "0.1");
    els.mouthClipShape?.setAttribute("ry", "0.1");
    els.mouthClipShape?.setAttribute("cy", "75");
    if (els.teeth) els.teeth.setAttribute("opacity", "0");
    els.tongue?.setAttribute("rx", "0.1");
    els.tongue?.setAttribute("ry", "0.1");
    els.tongue?.setAttribute("cy", "80");
    els.browL?.setAttribute("d", "M22 33 Q33 28 42 31");
    els.browR?.setAttribute("d", "M58 31 Q67 28 78 33");
    els.mouthBeer?.classList.remove("is-filled");
    if (els.mouthFoam) els.mouthFoam.setAttribute("opacity", "0");
    if (els.eyeL) els.eyeL.style.transform = "";
    if (els.eyeR) els.eyeR.style.transform = "";
  }

  function resetPourStream(els) {
    if (!els.stream || !els.streamPath) return;

    els.stream.classList.remove("is-flowing");
    els.streamPath.style.transition = "none";
    els.streamPath.style.strokeDashoffset = "80";
    void els.streamPath.getBoundingClientRect();
    els.streamPath.style.transition = "";
  }

  function getDrinkQueue(widget) {
    if (!drinkQueues.has(widget)) {
      drinkQueues.set(widget, { pending: 0, running: false });
    }
    return drinkQueues.get(widget);
  }

  async function playDrinkOnce(widget, onDone) {
    const done = typeof onDone === "function" ? onDone : () => {};

    if (!widget || motion.prefersReducedMotion()) {
      done();
      return;
    }

    const els = getPourEls(widget);
    if (!els.faceWrap) {
      done();
      return;
    }

    widget.classList.add("is-drinking");

    try {
      resetPourStream(els);
      openMouth(els);
      els.faceWrap.classList.add("is-tilted");

      await delay(POUR_TIMING.tiltSettle);
      if (!widget.isConnected) return;

      els.glassWrap?.classList.add("is-pouring");

      await delay(POUR_TIMING.beforeStream);
      if (!widget.isConnected) return;

      els.stream?.classList.add("is-flowing");
      if (els.streamPath) els.streamPath.style.strokeDashoffset = "0";

      await delay(POUR_TIMING.beforeFill);
      if (!widget.isConnected) return;

      els.mouthBeer?.classList.add("is-filled");
      if (els.mouthFoam) els.mouthFoam.setAttribute("opacity", "0.9");

      await delay(POUR_TIMING.hold);
      if (!widget.isConnected) return;

      els.faceWrap.classList.remove("is-tilted");
      els.glassWrap?.classList.remove("is-pouring");
      els.stream?.classList.remove("is-flowing");

      await delay(POUR_TIMING.beforeClose);
      if (!widget.isConnected) return;

      closeMouth(els);

      await delay(POUR_TIMING.afterClose);
    } finally {
      widget.classList.remove("is-drinking");
      done();
    }
  }

  function drainDrinkQueue(widget) {
    const queue = getDrinkQueue(widget);
    if (queue.pending <= 0) {
      queue.running = false;
      return;
    }

    queue.running = true;
    queue.pending -= 1;
    playDrinkOnce(widget, () => drainDrinkQueue(widget));
  }

  function playDrinkAnimations(widget, times) {
    const n = Math.max(0, times);
    if (!n || !widget) return;

    const queue = getDrinkQueue(widget);
    queue.pending += n;
    if (!queue.running) {
      drainDrinkQueue(widget);
    }
  }

  function updateCount(count) {
    const n = Math.max(0, Number(count) || 0);
    const widget = document.getElementById("btfw-drink-counter");
    const animCount = drinkAnimationCount(lastCount, n);
    lastCount = n;
    currentCount = n;

    if (!widget) return;

    widget.classList.toggle("is-hidden", n === 0);

    const countEl = widget.querySelector(".btfw-drink-counter__count");
    if (countEl) countEl.textContent = String(n);

    const label = n === 1 ? "1 drink" : `${n} drinks`;
    widget.setAttribute("aria-label", `Channel drinks: ${label}`);
    widget.title = label;

    if (animCount > 0) {
      playDrinkAnimations(widget, animCount);
    }
  }

  function readFallbackCount() {
    const el = document.getElementById("drinkcount");
    if (!el) return null;
    const m = (el.textContent || "").trim().match(/^(\d+)/);
    return m ? Number(m[1]) : null;
  }

  function ensureDrinkWidget() {
    const actions = $("#chatwrap .btfw-chat-bottombar #btfw-chat-actions");
    if (!actions || document.getElementById("btfw-drink-counter")) {
      return Boolean(document.getElementById("btfw-drink-counter"));
    }

    const widget = document.createElement("div");
    widget.id = "btfw-drink-counter";
    widget.className = "btfw-drink-counter is-hidden";
    widget.setAttribute("aria-live", "polite");
    widget.innerHTML = `
      <div class="btfw-drink-counter__scene" aria-hidden="true">
        ${SCENE_HTML}
      </div>
      <span class="btfw-drink-counter__count">0</span>
    `;

    if (motion.prefersReducedMotion()) {
      widget.classList.add("btfw-drink-counter--reduce-motion");
    }

    const anchor = actions.querySelector("#usercount");
    actions.insertBefore(widget, anchor || null);

    updateCount(currentCount);
    hideStockDrinkbar();
    return true;
  }

  function wireSocket() {
    if (socketWired) return;
    const sock = window.socket;
    if (!sock || typeof sock.on !== "function") {
      setTimeout(wireSocket, 500);
      return;
    }
    socketWired = true;
    sock.on("drinkCount", (count) => {
      updateCount(count);
      hideStockDrinkbar();
    });
  }

  function boot() {
    hideStockDrinkbar();

    const fallback = readFallbackCount();
    if (fallback !== null && fallback > 0) {
      lastCount = fallback;
      currentCount = fallback;
    }

    const sync = () => {
      ensureDrinkWidget();
      wireSocket();
      hideStockDrinkbar();
    };

    sync();

    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  return { name: "feature:drink-counter", updateCount, drinkAnimationCount };
});
