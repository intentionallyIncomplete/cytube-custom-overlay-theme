BTFW.define("feature:videoOverlay", [], async () => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const CONTROL_SELECTORS = [
    "#mediarefresh",
    "#voteskip",
    "#fullscreenbtn"
  ];

  const DEFAULT_OWNER_RANK = 5; // Cytube owners default to rank 5 when CHANNEL perms are unavailable
  const PERMISSION_KEYS = {
    owner: ["chanowner", "owner", "founder", "admin", "administrator"]
  };

  function getClient() {
    try {
      return window.CLIENT || window.client || null;
    } catch (_) {
      return null;
    }
  }

  function getChannel() {
    try {
      return window.CHANNEL || window.channel || null;
    } catch (_) {
      return null;
    }
  }

  function getChannelPermissions() {
    const channel = getChannel();
    if (channel && typeof channel.perms === "object" && channel.perms) {
      return channel.perms;
    }
    try {
      return window.CHANNEL_PERMS || window.channelPermissions || {};
    } catch (_) {
      return {};
    }
  }

  function getPermissionThreshold(keys = []) {
    const perms = getChannelPermissions();
    for (const key of keys) {
      const value = perms?.[key];
      if (typeof value === "number") return value;
    }
    return undefined;
  }

  function getOwnerRankThreshold() {
    const ownerRank = getPermissionThreshold(PERMISSION_KEYS.owner);
    return typeof ownerRank === "number" ? ownerRank : DEFAULT_OWNER_RANK;
  }

  function hasOwnerPermission(client) {
    if (!client) return false;
    try {
      if (typeof client.hasPermission === "function" && client.hasPermission("chanowner")) {
        return true;
      }
    } catch (_) {}
    try {
      if (typeof window.hasPermission === "function" && window.hasPermission("chanowner")) {
        return true;
      }
    } catch (_) {}
    return false;
  }

  function isChannelOwner() {
    const client = getClient();
    if (!client) return false;
    const rank = Number(client.rank);
    if (!Number.isFinite(rank)) return false;

    if (rank >= getOwnerRankThreshold()) return true;

    if (hasOwnerPermission(client)) return true;

    return false;
  }

  let refreshClickCount = 0;
  let refreshCooldownUntil = 0;
  let lastRefreshTimestamp = 0;

  const USER_REFRESH_INTERVAL = 2000;
  const AUTO_REFRESH_BASE_INTERVAL = 8000;
  const AUTO_REFRESH_MAX_INTERVAL = 45000;
  const AUTO_IDLE_RESET_INTERVAL = 120000;

  let autoRefreshInterval = AUTO_REFRESH_BASE_INTERVAL;
  let airplayListenerAttached = false;
  let trackedAirplayVideo = null;

  function ensureCSS() {
    if ($("#btfw-vo-css")) return;
    const st = document.createElement("style");
    st.id = "btfw-vo-css";
    st.textContent = `
      #btfw-video-overlay{
        position: static;
        display: block;
        width: 100%;
        pointer-events: auto;
        opacity: 1;
        margin: 8px 0 4px;
      }

      #btfw-video-overlay .btfw-vo-bar{
        position: static;
        display: flex;
        gap: 8px;
        pointer-events: auto;
        background: transparent;
      }

      #btfw-video-overlay .btfw-vo-section {
        display:flex;
        align-items:center;
        gap:8px;
        pointer-events:auto;
      }

      #btfw-video-overlay .btfw-vo-section--right {
        margin-left:auto;
      }

      #btfw-video-overlay .btfw-vo-btn,
      #btfw-video-overlay .btfw-vo-adopted{
        all: unset;
        box-sizing: border-box;
        display:inline-grid;
        place-items:center;
        min-width:44px;
        height:44px;
        padding:0;
        border-radius:22px;
        border:0;
        background:rgba(0, 0, 0, 0.42);
        color:#fff;
        cursor:pointer;
        font:600 14px/1.05 "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        letter-spacing: 0.01em;
        backdrop-filter: blur(12px) saturate(120%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration:none;
      }

      #btfw-video-overlay .btfw-vo-btn i,
      #btfw-video-overlay .btfw-vo-adopted i {
        transition: transform 0.2s ease;
        font-size: 16px;
      }

      #btfw-video-overlay .btfw-vo-btn:hover,
      #btfw-video-overlay .btfw-vo-adopted:hover{
        background: rgba(109, 77, 246, 0.82);
        transform: translateY(-1px);
        box-shadow: 0 4px 16px rgba(109, 77, 246, 0.36);
      }

      #btfw-video-overlay .btfw-vo-btn:hover i,
      #btfw-video-overlay .btfw-vo-adopted:hover i {
        transform: scale(1.08);
      }

      #btfw-video-overlay .btfw-vo-btn:active,
      #btfw-video-overlay .btfw-vo-adopted:active {
        transform: translateY(0);
      }

      #btfw-video-overlay .btfw-vo-btn:focus-visible,
      #btfw-video-overlay .btfw-vo-adopted:focus-visible {
        outline: 2px solid rgba(109, 77, 246, 0.95);
        outline-offset: 2px;
      }

      .btfw-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 12px;
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(12px) saturate(120%);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 300px;
      }

      .btfw-notification--show {
        transform: translateX(0);
        opacity: 1;
      }

      .btfw-notification--success {
        background: rgba(34, 197, 94, 0.9);
        border: 1px solid rgba(34, 197, 94, 0.3);
      }

      .btfw-notification--error {
        background: rgba(239, 68, 68, 0.9);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }

      .btfw-notification--warning {
        background: rgba(245, 158, 11, 0.9);
        border: 1px solid rgba(245, 158, 11, 0.3);
      }

      .btfw-notification--info {
        background: rgba(59, 130, 246, 0.9);
        border: 1px solid rgba(59, 130, 246, 0.3);
      }

      #btfw-mini-toast{position:fixed;right:12px;bottom:12px;background:#111a;color:#fff;padding:8px 12px;border-radius:8px;font:12px/1.2 system-ui,Segoe UI,Arial;z-index:99999;pointer-events:none;opacity:0;transition:opacity .2s}

      @media (max-width: 768px) {
        #btfw-video-overlay .btfw-vo-bar {
          gap: 6px;
        }

        #btfw-video-overlay .btfw-vo-section {
          gap: 6px;
          flex-wrap: wrap;
        }

        #btfw-video-overlay .btfw-vo-btn,
        #btfw-video-overlay .btfw-vo-adopted {
          min-width: 40px;
          height: 40px;
          border-radius: 20px;
          font-size: 12px;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function mountOverlayToolbar(overlay) {
    const wrap = $("#videowrap");
    if (!wrap || !overlay) return;
    if (overlay.parentElement !== wrap.parentElement || overlay.previousElementSibling !== wrap) {
      wrap.insertAdjacentElement("afterend", overlay);
    }
    overlay.classList.add("btfw-vo-visible");
  }

  function ensureOverlay() {
    const wrap = $("#videowrap");
    if (!wrap) return null;

    let overlay = $("#btfw-video-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "btfw-video-overlay";
      overlay.setAttribute("data-testid", "btfw-video-overlay");
    }
    overlay.classList.add("btfw-video-overlay");
    if (!overlay.getAttribute("data-testid")) {
      overlay.setAttribute("data-testid", "btfw-video-overlay");
    }
    mountOverlayToolbar(overlay);

    let bar = overlay.querySelector("#btfw-vo-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "btfw-vo-bar";
      bar.id = "btfw-vo-bar";
      overlay.appendChild(bar);
    }

    const sections = ensureOverlaySections(overlay, bar);

    ensureCustomButtons(sections);
    adoptNativeControls(sections);
    restyleOverlayButtons(overlay);

    return overlay;
  }

  function restyleOverlayButtons(overlay) {
    if (!overlay) return;
    overlay
      .querySelectorAll("button")
      .forEach((btn) => {
        if (!btn.classList.contains("btfw-vo-btn")) {
          btn.classList.add("btfw-vo-btn");
        }
      });
  }

  function ensureOverlaySections(overlay, bar) {
    const leftId = "btfw-vo-left";
    const rightId = "btfw-vo-right";

    let left = bar.querySelector(`#${leftId}`);
    if (!left) {
      left = document.createElement("div");
      left.id = leftId;
      left.className = "btfw-vo-section btfw-vo-section--left";
      bar.insertBefore(left, bar.firstChild);
    }

    let right = bar.querySelector(`#${rightId}`);
    if (!right) {
      right = document.createElement("div");
      right.id = rightId;
      right.className = "btfw-vo-section btfw-vo-section--right";
      bar.appendChild(right);
    }

    Array.from(bar.children).forEach((child) => {
      if (child === left || child === right) return;
      right.appendChild(child);
    });

    overlay.dataset.leftSection = `#${leftId}`;
    overlay.dataset.rightSection = `#${rightId}`;
    bar.dataset.leftSection = `#${leftId}`;
    bar.dataset.rightSection = `#${rightId}`;

    return { left, right };
  }

  function getAirplayCandidate() {
    return document.querySelector("#ytapiplayer video, video");
  }

  function hasAirplaySupport(video = getAirplayCandidate()) {
    if (!video) return false;
    return (
      typeof window.WebKitPlaybackTargetAvailabilityEvent !== "undefined" ||
      typeof video.webkitShowPlaybackTargetPicker === "function"
    );
  }

  function unbindAirplayAvailability() {
    if (!trackedAirplayVideo) return;
    const handler = trackedAirplayVideo._btfwAirplayHandler;
    if (handler) {
      try {
        trackedAirplayVideo.removeEventListener("webkitplaybacktargetavailabilitychanged", handler);
      } catch (_) {}
      delete trackedAirplayVideo._btfwAirplayHandler;
    }
    trackedAirplayVideo = null;
  }

  function bindAirplayAvailability(video) {
    if (!video || typeof video.addEventListener !== "function") {
      unbindAirplayAvailability();
      return;
    }
    if (trackedAirplayVideo === video) return;

    unbindAirplayAvailability();

    const handler = (event) => {
      const available = !event || event.availability === "available";
      const btn = $("#btfw-airplay");
      if (!btn) return;
      btn.style.display = available ? "" : "none";
    };

    try {
      video.addEventListener("webkitplaybacktargetavailabilitychanged", handler);
      video._btfwAirplayHandler = handler;
      trackedAirplayVideo = video;
    } catch (_) {}
  }

  function updateAirplayButtonVisibility() {
    const btn = $("#btfw-airplay");
    if (!btn) return;
    const video = getAirplayCandidate();
    const supported = hasAirplaySupport(video);
    if (!supported) {
      btn.style.display = "none";
      unbindAirplayAvailability();
      return;
    }
    btn.style.display = "";
    bindAirplayAvailability(video);
  }

  function setupHoverEffects(_videowrap, overlay) {
    if (!overlay) return;
    overlay.classList.add("btfw-vo-visible");
  }

  function ensureCustomButtons(sections) {
    if (!sections?.right || !sections?.left) return;
    const customButtons = [];

    if (!document.querySelector("#fullscreenbtn")) {
      customButtons.push({ id: "btfw-fullscreen", icon: "fa fa-expand", tooltip: "Fullscreen", action: toggleFullscreen, section: "right" });
    }

    customButtons.push({
      id: "btfw-airplay",
      icon: "fa fa-television",
      tooltip: "AirPlay",
      action: enableAirplay,
      section: "right"
    });

    customButtons.forEach((btnConfig) => {
      let btn = document.querySelector(`#${btnConfig.id}`);
      const target = btnConfig.section === "left" ? sections.left : sections.right;
      if (!btn) {
        btn = document.createElement("button");
        btn.id = btnConfig.id;
        btn.className = "btfw-vo-btn";
        const icon = document.createElement("i");
        icon.className = btnConfig.icon;
        btn.appendChild(icon);
        btn.title = btnConfig.tooltip;
        btn.addEventListener("click", btnConfig.action);
        (target || sections.right).appendChild(btn);
      } else if (target && btn.parentElement !== target) {
        target.appendChild(btn);
      }
    });

    updateAirplayButtonVisibility();
  }

  function adoptNativeControls(sections) {
    const targetSection = sections?.right;
    if (!targetSection) return;
    CONTROL_SELECTORS.forEach((selector) => {
      const el = document.querySelector(selector);
      if (!el) return;

      if (el.dataset.btfwOverlay === "1") {
        if (el.parentElement !== targetSection) targetSection.appendChild(el);
        return;
      }

      const placeholder = document.createElement("span");
      placeholder.hidden = true;
      placeholder.setAttribute("data-btfw-ph", selector);
      try {
        el.insertAdjacentElement("afterend", placeholder);
      } catch (_) {}

      el.classList.add("btfw-vo-adopted");
      el.dataset.btfwOverlay = "1";

      if (el.id === "mediarefresh") {
        const original = el.onclick;
        el.onclick = (event) => {
          event.preventDefault();
          const isUserAction = !!(event && event.isTrusted);
          handleMediaRefresh(() => {
            if (typeof original === "function") {
              try {
                original.call(el, event);
                return true;
              } catch (err) {
                console.warn("[video-overlay] native refresh handler failed:", err);
              }
            }
            return false;
          }, { isUserAction });
        };
      }

      targetSection.appendChild(el);
    });
  }

  function emitNativeRefresh() {
    try {
      if (window.socket) {
        socket.emit("playerReady");
        return true;
      }
    } catch (e) {
      console.warn("[video-overlay] Media refresh failed:", e);
    }
    return false;
  }

  function handleMediaRefresh(triggerOriginal, options = {}) {
    const { isUserAction = false } = options;
    const now = Date.now();

    if (lastRefreshTimestamp && now - lastRefreshTimestamp > AUTO_IDLE_RESET_INTERVAL) {
      autoRefreshInterval = AUTO_REFRESH_BASE_INTERVAL;
      refreshClickCount = 0;
    }

    if (now < refreshCooldownUntil) {
      const remainingSeconds = Math.ceil((refreshCooldownUntil - now) / 1000);
      showNotification(
        isUserAction
          ? `Refresh available in ${remainingSeconds}s`
          : `Auto refresh paused. Next attempt in ${remainingSeconds}s`,
        "warning"
      );
      return false;
    }

    const minInterval = isUserAction ? USER_REFRESH_INTERVAL : autoRefreshInterval;
    if (lastRefreshTimestamp && now - lastRefreshTimestamp < minInterval) {
      const waitMs = minInterval - (now - lastRefreshTimestamp);
      const waitSeconds = Math.ceil(waitMs / 1000);
      refreshCooldownUntil = now + waitMs;
      showNotification(
        isUserAction
          ? `Refresh available in ${waitSeconds}s`
          : `Auto refresh paused. Next attempt in ${waitSeconds}s`,
        "warning"
      );
      return false;
    }

    refreshClickCount++;

    if (refreshClickCount >= 10) {
      refreshCooldownUntil = now + 30000;
      refreshClickCount = 0;
      showNotification("Refresh limit reached. 30s cooldown active.", "error");
      return false;
    }

    const decayMs = isUserAction
      ? 6000
      : Math.max(12000, autoRefreshInterval + 2000);
    setTimeout(() => {
      if (refreshClickCount > 0) refreshClickCount--;
    }, decayMs);

    let handled = false;
    if (typeof triggerOriginal === "function") {
      try {
        handled = triggerOriginal() === true;
      } catch (err) {
        console.warn("[video-overlay] Refresh handler error:", err);
      }
    }

    if (!handled) {
      handled = emitNativeRefresh();
    }

    lastRefreshTimestamp = Date.now();

    if (isUserAction) {
      autoRefreshInterval = AUTO_REFRESH_BASE_INTERVAL;
    } else {
      const multiplier = handled ? 1.25 : 1.5;
      autoRefreshInterval = Math.min(
        AUTO_REFRESH_MAX_INTERVAL,
        Math.max(AUTO_REFRESH_BASE_INTERVAL, Math.round(autoRefreshInterval * multiplier))
      );
    }

    const nextWindow = isUserAction ? USER_REFRESH_INTERVAL : autoRefreshInterval;
    refreshCooldownUntil = Math.max(refreshCooldownUntil, lastRefreshTimestamp + nextWindow);

    if (!isUserAction && handled) {
      showNotification(
        `Auto refresh sent. Next attempt in ${Math.ceil(autoRefreshInterval / 1000)}s`,
        "info"
      );
    } else {
      showNotification(
        handled ? "Media refreshed" : "Unable to refresh media",
        handled ? "success" : "error"
      );
    }

    return handled;
  }

  function toggleFullscreen() {
    const videowrap = $("#videowrap");
    if (!videowrap) return;

    if (!document.fullscreenElement) {
      if (videowrap.requestFullscreen) {
        videowrap.requestFullscreen();
      } else if (videowrap.webkitRequestFullscreen) {
        videowrap.webkitRequestFullscreen();
      } else if (videowrap.mozRequestFullScreen) {
        videowrap.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
  }

  function applyAirplayAttributes(video, showPicker = true) {
    if (!video || !hasAirplaySupport(video)) return false;
    video.setAttribute("airplay", "allow");
    video.setAttribute("x-webkit-airplay", "allow");
    if (showPicker && typeof video.webkitShowPlaybackTargetPicker === "function") {
      try {
        video.webkitShowPlaybackTargetPicker();
      } catch (err) {
        console.warn("[video-overlay] AirPlay picker failed:", err);
      }
    }
    updateAirplayButtonVisibility();
    return true;
  }

  function attachAirplayListener() {
    if (airplayListenerAttached || !window.socket) return;
    airplayListenerAttached = true;
    try {
      socket.on("changeMedia", () => {
        setTimeout(() => {
          const video = getAirplayCandidate();
          if (video) {
            applyAirplayAttributes(video, false);
            bindAirplayAvailability(video);
          }
          updateAirplayButtonVisibility();
        }, 1000);
      });
    } catch (err) {
      console.warn("[video-overlay] Failed to attach AirPlay listener:", err);
    }
  }

  function enableAirplay() {
    const video = getAirplayCandidate();
    if (!hasAirplaySupport(video)) {
      updateAirplayButtonVisibility();
      showNotification("AirPlay not available", "warning");
      return false;
    }
    if (applyAirplayAttributes(video)) {
      showNotification("AirPlay enabled", "success");
      attachAirplayListener();
      return true;
    }
    showNotification("AirPlay not available", "warning");
    return false;
  }

  function showNotification(message, type = "info") {
    let notification = document.getElementById("btfw-notification");

    if (!notification) {
      notification = document.createElement("div");
      notification.id = "btfw-notification";
      notification.className = "btfw-notification";
      document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.className = `btfw-notification btfw-notification--${type} btfw-notification--show`;

    clearTimeout(notification._hideTimer);
    notification._hideTimer = setTimeout(() => {
      notification.classList.remove("btfw-notification--show");
    }, 3000);
  }

  function boot() {
    ensureCSS();
    ensureOverlay();

    const targets = [
      $("#videowrap"),
      $("#rightcontrols"),
      $("#leftcontrols"),
      document.body
    ].filter(Boolean);
    const mo = new MutationObserver(() => ensureOverlay());
    targets.forEach((target) => mo.observe(target, { childList: true, subtree: true }));

    try {
      if (window.socket && typeof socket.on === "function") {
        socket.on("changeMedia", () => {
          setTimeout(() => ensureOverlay(), 0);
        });
      }
    } catch (_) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return {
    name: "feature:videoOverlay",
    toggleFullscreen,
    enableAirplay
  };
});
