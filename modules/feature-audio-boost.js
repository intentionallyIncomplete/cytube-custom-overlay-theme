// BTFW Audio Processing System - Combined Boost + Normalization + Reconnect-safe auto-reproxy watchdog
(function() {
  'use strict';

  const INTERNAL_SET_GRACE_MS = 2000;   // time window where changes are considered ours
  const WATCHDOG_TICK_MS      = 800;    // polling backup
  const REAPPLY_DEBOUNCE_MS   = 800;    // avoid rapid re-sets
  const DEFAULT_CORS_PROXY    = 'https://vidprox.billtube.workers.dev/?url=';

  function safeNow() { return Date.now(); }

  window.BTFW_AUDIO = {
    audioContext: null,
    sourceNode: null,
    _sourceMediaElement: null,
    compressorNode: null,
    gainNode: null,
    player: null,

    // URL state
    originalSrc: null,
    proxiedSrc: null,
    isProxied: false,

    // Feature flags
    boostEnabled: false,
    normalizationEnabled: false,

    // Proxy and params
    get CORS_PROXY() {
      const configured = typeof window !== 'undefined' && (
        window.BTFW_CONFIG?.corsVideoProxy ||
        window.BTFW_CONFIG?.integrations?.corsVideoProxy
      );
      if (typeof configured === 'string' && configured.trim()) {
        const base = configured.trim();
        if (base.includes('?')) return base;
        const sep = base.endsWith('/') ? '' : '/';
        return `${base}${sep}?url=`;
      }
      return DEFAULT_CORS_PROXY;
    },
    BOOST_MULTIPLIER: 2.5,
    currentNormPreset: 'youtube',

    // Watchdog state
    _watchdogInterval: null,
    _mutationObserver: null,
    _watchdogPlayerHandlers: null,
    _lastKnownSrc: null,
    _lastInternalSrcSetAt: 0,
    _lastAutoReapplyAt: 0,

    NORM_PRESETS: {
      gentle:     { threshold: -12, knee: 20, ratio: 6,  attack: 0.01,  release: 0.5,  label: 'Gentle' },
      youtube:    { threshold: -24, knee: 30, ratio: 12, attack: 0.003, release: 0.25, label: 'YouTube' },
      aggressive: { threshold: -50, knee: 40, ratio: 12, attack: 0.001, release: 0.25, label: 'Aggressive' }
    },

    // Core utilities

    _isTrusted(urlStr) {
      try {
        const host = new URL(urlStr).hostname.toLowerCase();
        return host.endsWith('.workers.dev');
      } catch { return false; }
    },

    _markInternalSrcSet() {
      this._lastInternalSrcSetAt = safeNow();
    },

    _isInsideInternalWindow() {
      return safeNow() - this._lastInternalSrcSetAt <= INTERNAL_SET_GRACE_MS;
    },

    _shouldForceProxy() {
      // We proxy iff any processing is on. (You can change this policy if you want â€œalways proxyâ€.)
      return this.boostEnabled || this.normalizationEnabled;
    },

    _hasAnonymousCrossOrigin() {
      const el = this._getMediaElement();
      if (!el) return false;
      return el.crossOrigin === 'anonymous' || el.getAttribute('crossorigin') === 'anonymous';
    },

    _ensureAnonymousCrossOrigin() {
      if (this._hasAnonymousCrossOrigin()) return false;
      try {
        this.player?.crossOrigin('anonymous');
        return true;
      } catch {
        return false;
      }
    },

    _same(a, b) {
      // video.js may normalize encodings; compare decoded when proxied
      return String(a || '') === String(b || '');
    },

    _getMediaElement() {
      const tech = this.player?.tech_;
      if (tech) {
        try {
          const fromElFn = typeof tech.el === 'function' ? tech.el() : null;
          if (fromElFn instanceof HTMLMediaElement && fromElFn.isConnected) return fromElFn;
        } catch (_) {}
        if (tech.el_ instanceof HTMLMediaElement && tech.el_.isConnected) return tech.el_;
      }
      const fallback = document.querySelector('#ytapiplayer video, #videowrap .video-js .vjs-tech');
      if (fallback instanceof HTMLMediaElement && fallback.isConnected) return fallback;
      return null;
    },

    _hasIframeOnlyMedia() {
      if (this._getMediaElement()) return false;
      return Boolean(document.querySelector('#ytapiplayer iframe'));
    },

    disconnectChain() {
      if (this.sourceNode) {
        try { this.sourceNode.disconnect(); } catch (_) {}
      }
      if (this.compressorNode) {
        try { this.compressorNode.disconnect(); } catch (_) {}
        this.compressorNode = null;
      }
      if (this.gainNode) {
        try { this.gainNode.disconnect(); } catch (_) {}
        this.gainNode = null;
      }
    },

    resetMediaBinding() {
      this.disconnectChain();
      this.sourceNode = null;
      this._sourceMediaElement = null;
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
      }
      this.audioContext = null;
    },

    _getOrCreateSourceNode(videoEl) {
      if (this.sourceNode && this._sourceMediaElement === videoEl) {
        return this.sourceNode;
      }

      if (this.sourceNode && this._sourceMediaElement !== videoEl) {
        this.sourceNode = null;
        this._sourceMediaElement = null;
      }

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      this.sourceNode = this.audioContext.createMediaElementSource(videoEl);
      this._sourceMediaElement = videoEl;
      return this.sourceNode;
    },

    cleanup() {
      this.disconnectChain();

      if (this.audioContext && this.audioContext.state === 'running') {
        this.audioContext.suspend().catch(() => {});
      }

      const mediaEl = this._getMediaElement();
      if (mediaEl) {
        mediaEl.disableRemotePlayback = false;
      }

      this.stopWatchdog();
    },

    // Watchdog

    startWatchdog() {
      if (!this.player) return;
      this.stopWatchdog();

      const videoEl = this._getMediaElement();

      // Mutation observer for attribute/src/source changes
      if (videoEl && typeof MutationObserver !== 'undefined') {
        this._mutationObserver = new MutationObserver(() => {
          this._checkAndReapply('mutation');
        });
        this._mutationObserver.observe(videoEl, { attributes: true, attributeFilter: ['src', 'crossorigin'] });

        // Also observe <source> children swaps
        const sourceObserver = new MutationObserver(() => {
          this._checkAndReapply('sources');
        });
        sourceObserver.observe(videoEl, { childList: true, subtree: true });
        // Save both; if one is null, it's fine
        this._mutationObserver._sourceObserver = sourceObserver;
      }

      // Video.js hooks that often fire on internal resets
      if (!this._watchdogPlayerHandlers) {
        this._watchdogPlayerHandlers = {
          sourceset: () => this._checkAndReapply('sourceset'),
          loadstart: () => this._checkAndReapply('loadstart'),
          loadedmetadata: () => this._checkAndReapply('loadedmetadata'),
          stalled: () => this._checkAndReapply('stalled'),
          error: () => this._checkAndReapply('error')
        };
        try {
          Object.entries(this._watchdogPlayerHandlers).forEach(([event, handler]) => {
            this.player.on(event, handler);
          });
        } catch {}
      }

      // Lightweight interval backup
      this._watchdogInterval = setInterval(() => this._checkAndReapply('interval'), WATCHDOG_TICK_MS);

      // Prime last known
      this._lastKnownSrc = this.player.currentSrc();
    },

    stopWatchdog() {
      if (this._watchdogInterval) {
        clearInterval(this._watchdogInterval);
        this._watchdogInterval = null;
      }
      if (this._mutationObserver) {
        try { this._mutationObserver.disconnect(); } catch {}
        try { this._mutationObserver._sourceObserver?.disconnect(); } catch {}
        this._mutationObserver = null;
      }
      if (this.player && this._watchdogPlayerHandlers) {
        try {
          Object.entries(this._watchdogPlayerHandlers).forEach(([event, handler]) => {
            this.player.off(event, handler);
          });
        } catch {}
        this._watchdogPlayerHandlers = null;
      }
    },

    _checkAndReapply(reason) {
      if (!this.player) return;
      const current = this.player.currentSrc();
      if (!current) return;

      this._lastKnownSrc = current;

      // If we intentionally set src recently, ignore
      if (this._isInsideInternalWindow()) return;

      // If it's already proxied (or trusted and we opted to allow), nothing to do
      const isAlreadyProxied = current.includes(this.CORS_PROXY);
      if (isAlreadyProxied) {
        this.isProxied = true;
        this.proxiedSrc = current;
        return;
      }

      // Allow trusted domains to stay unproxied but ensure crossOrigin for processing
      if (this._isTrusted(current)) {
        if (this._shouldForceProxy()) {
          this._ensureAnonymousCrossOrigin();
        }
        this.isProxied = false;
        this.originalSrc = current;
        return;
      }

      // If processing is on and URL silently reverted -> reapply proxy
      if (this._shouldForceProxy()) {
        const since = safeNow() - this._lastAutoReapplyAt;
        if (since < REAPPLY_DEBOUNCE_MS) return;
        this._lastAutoReapplyAt = safeNow();
        // console.log('[BTFW_AUDIO] Auto-reproxy due to', reason);
        this._forceProxyPreservingState(current);
      }
    },

    async _forceProxyPreservingState(currentSrc) {
      // Preserve playstate/time and re-set proxied URL
      if (!this.player) return;
      const t = this.player.currentTime();
      const wasPlaying = !this.player.paused();

      this.originalSrc = currentSrc;
      this.proxiedSrc = this.CORS_PROXY + encodeURIComponent(currentSrc);

      try { this.player.pause(); } catch {}
      try { this.player.crossOrigin('anonymous'); } catch {}

      this._markInternalSrcSet();
      this.player.src({ src: this.proxiedSrc, type: 'video/mp4' });
      try { this.player.load(); } catch {}

      const resume = () => {
        try { this.player.currentTime(t); } catch {}
        this.isProxied = true;
        if (wasPlaying) {
          this.player.play().catch(() => {});
        }
      };

      if (typeof this.player.ready === 'function') {
        this.player.ready(resume);
      } else {
        setTimeout(resume, 300);
      }
    },

    // Proxy/application helpers

    async ensureProxy() {
      if (!this.player) return false;

      const currentSrc = this.player.currentSrc();
      if (!currentSrc) return false;

      if (currentSrc.includes(this.CORS_PROXY)) {
        this.isProxied = true;
        this.proxiedSrc = currentSrc;
        return true;
      }

      try {
        const url = new URL(currentSrc);
        if (this._isTrusted(currentSrc)) {
          this.originalSrc = currentSrc;
          this.isProxied = false;

          if (this._hasAnonymousCrossOrigin()) {
            return true;
          }

          const currentTime = this.player.currentTime();
          const wasPlaying = !this.player.paused();

          try { this.player.pause(); } catch {}
          this._ensureAnonymousCrossOrigin();

          this._markInternalSrcSet();
          this.player.src({ src: currentSrc, type: 'video/mp4' });
          try { this.player.load(); } catch {}

          return new Promise((resolve) => {
            this.player.ready(() => {
              try { this.player.currentTime(currentTime); } catch {}
              if (wasPlaying) {
                this.player.play().catch(() => {});
              }
              resolve(true);
            });
          });
        }
      } catch (e) {
        console.warn('[BTFW_AUDIO] Invalid URL:', e);
      }

      // Fallback: force proxy
      return this._forceProxyPreservingState(currentSrc), true;
    },

    async rebuildAudioChain() {
      if (!this.player) {
        console.error('[BTFW_AUDIO] Player not ready');
        return false;
      }

      if (this.boostEnabled || this.normalizationEnabled) {
        if (!this.isProxied && !this._isTrusted(this.player.currentSrc())) {
          await this.ensureProxy();
        } else if (this._shouldForceProxy()) {
          this._ensureAnonymousCrossOrigin();
        }
      }

      this.disconnectChain();

      const videoEl = this._getMediaElement();
      if (!videoEl) {
        console.error('[BTFW_AUDIO] No HTMLMediaElement for Web Audio');
        return false;
      }

      try {
        if (this.audioContext?.state === 'suspended') {
          await this.audioContext.resume().catch(() => {});
        }

        videoEl.disableRemotePlayback = true;

        const sourceNode = this._getOrCreateSourceNode(videoEl);
        let currentNode = sourceNode;

        if (this.normalizationEnabled) {
          this.compressorNode = this.audioContext.createDynamicsCompressor();
          const preset = this.NORM_PRESETS[this.currentNormPreset];
          this.compressorNode.threshold.setValueAtTime(preset.threshold, this.audioContext.currentTime);
          this.compressorNode.knee.setValueAtTime(preset.knee, this.audioContext.currentTime);
          this.compressorNode.ratio.setValueAtTime(preset.ratio, this.audioContext.currentTime);
          this.compressorNode.attack.setValueAtTime(preset.attack, this.audioContext.currentTime);
          this.compressorNode.release.setValueAtTime(preset.release, this.audioContext.currentTime);

          currentNode.connect(this.compressorNode);
          currentNode = this.compressorNode;
        }

        if (this.boostEnabled) {
          this.gainNode = this.audioContext.createGain();
          this.gainNode.gain.value = this.BOOST_MULTIPLIER;

          currentNode.connect(this.gainNode);
          currentNode = this.gainNode;
        }

        currentNode.connect(this.audioContext.destination);

        // Make sure watchdog is active while processing is enabled
        this.startWatchdog();

        console.log('[BTFW_AUDIO] Chain rebuilt:', {
          normalization: this.normalizationEnabled,
          boost: this.boostEnabled,
          proxied: this.isProxied
        });

        return true;
      } catch (e) {
        console.error('[BTFW_AUDIO] Error building audio chain:', e);
        this.disconnectChain();
        return false;
      }
    },

    // Public feature toggles

    async enableBoost() {
      this.boostEnabled = true;
      const ok = await this.rebuildAudioChain();
      return ok;
    },

    async disableBoost() {
      this.boostEnabled = false;

      if (this.normalizationEnabled) {
        const ok = await this.rebuildAudioChain();
        if (!this._shouldForceProxy()) this.stopWatchdog();
        return ok;
      } else {
        this.cleanup();

        // If we forced proxy only because of boost, we can return to original
        if (this.originalSrc && this.isProxied) {
          const currentTime = this.player.currentTime();
          const wasPlaying = !this.player.paused();

          try { this.player.pause(); } catch {}
          try { this.player.crossOrigin(null); } catch {}

          this._markInternalSrcSet();
          this.player.src({ src: this.originalSrc, type: 'video/mp4' });
          try { this.player.load(); } catch {}

          this.player.ready(() => {
            try { this.player.currentTime(currentTime); } catch {}
            this.isProxied = false;
            if (wasPlaying) {
              this.player.play().catch(() => {});
            }
          });
        }
        return true;
      }
    },

    async enableNormalization() {
      this.normalizationEnabled = true;
      const ok = await this.rebuildAudioChain();
      return ok;
    },

    async setNormPreset(presetKey) {
      if (!this.NORM_PRESETS[presetKey]) return false;
      this.currentNormPreset = presetKey;
      if (this.normalizationEnabled) {
        return await this.rebuildAudioChain();
      }
      return true;
    },

    async setBoostMultiplier(multiplier) {
      this.BOOST_MULTIPLIER = multiplier;
      if (this.boostEnabled) {
        return await this.rebuildAudioChain();
      }
      return true;
    },

    async disableNormalization() {
      this.normalizationEnabled = false;

      if (this.boostEnabled) {
        const ok = await this.rebuildAudioChain();
        if (!this._shouldForceProxy()) this.stopWatchdog();
        return ok;
      } else {
        this.cleanup();

        if (this.originalSrc && this.isProxied) {
          const currentTime = this.player.currentTime();
          const wasPlaying = !this.player.paused();

          try { this.player.pause(); } catch {}
          try { this.player.crossOrigin(null); } catch {}

          this._markInternalSrcSet();
          this.player.src({ src: this.originalSrc, type: 'video/mp4' });
          try { this.player.load(); } catch {}

          this.player.ready(() => {
            try { this.player.currentTime(currentTime); } catch {}
            this.isProxied = false;
            if (wasPlaying) {
              this.player.play().catch(() => {});
            }
          });
        }
        return true;
      }
    }
  };
})();

// Audio Boost Module
(function() {
  'use strict';

  function whenBTFWReady(callback) {
    if (window.BTFW && typeof BTFW.define === 'function') {
      callback();
    } else {
      setTimeout(() => whenBTFWReady(callback), 0);
    }
  }

  whenBTFWReady(function() {
    BTFW.define("feature:audioboost", [], async () => {
      const $ = (selector, root = document) => root.querySelector(selector);
      const sharedAudio = window.BTFW_AUDIO;

      let boostButton = null;
      let normButton = null;
      let shouldBoostAfterMediaChange = false;
      let shouldNormalizeAfterMediaChange = false;
      let boostContextMenu = null;
      let normContextMenu = null;

      const BOOST_PRESETS = [
        { multiplier: 1.5, label: '150%' },
        { multiplier: 2.5, label: '250%' },
        { multiplier: 3.5, label: '350%' }
      ];

      function updateBoostButtonState(active) {
        if (!boostButton) return;

        if (active) {
          boostButton.classList.add('active');
          boostButton.style.background = 'rgba(46, 213, 115, 0.3)';
          boostButton.style.borderColor = '#2ed573';
          boostButton.style.color = '#2ed573';
          boostButton.style.boxShadow = '0 0 12px rgba(46, 213, 115, 0.6)';
        } else {
          boostButton.classList.remove('active');
          boostButton.style.background = '';
          boostButton.style.borderColor = '';
          boostButton.style.color = '';
          boostButton.style.boxShadow = '';
        }
      }

      function showToast(message, type = 'info') {
        let toast = $('#btfw-audioboost-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'btfw-audioboost-toast';
          toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(46, 213, 115, 0.9)' : 'rgba(235, 77, 75, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `;
          document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'success' ? 'rgba(46, 213, 115, 0.9)' : 'rgba(235, 77, 75, 0.9)';
        toast.style.opacity = '1';

        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
      }

      async function activateAudioBoost() {
        const success = await sharedAudio.enableBoost();
        if (success) {
          shouldBoostAfterMediaChange = true;
          const percentage = Math.round(sharedAudio.BOOST_MULTIPLIER * 100);
          showToast(`Boosted by ${percentage}%`, 'success');
          updateBoostButtonState(true);
        } else {
          const msg = sharedAudio._hasIframeOnlyMedia()
            ? 'Audio boost requires direct video playback'
            : 'Failed to activate boost';
          showToast(msg, 'error');
        }
      }

      async function deactivateAudioBoost() {
        await sharedAudio.disableBoost();
        shouldBoostAfterMediaChange = false;
        updateBoostButtonState(false);
      }

      function updateNormButtonState(active) {
        if (!normButton) return;

        if (active) {
          normButton.classList.add('active');
          normButton.style.background = 'rgba(52, 152, 219, 0.3)';
          normButton.style.borderColor = '#3498db';
          normButton.style.color = '#3498db';
          normButton.style.boxShadow = '0 0 12px rgba(52, 152, 219, 0.6)';
        } else {
          normButton.classList.remove('active');
          normButton.style.background = '';
          normButton.style.borderColor = '';
          normButton.style.color = '';
          normButton.style.boxShadow = '';
        }
      }

      function showNormToast(message, type = 'info') {
        let toast = $('#btfw-audionorm-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'btfw-audionorm-toast';
          toast.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(52, 152, 219, 0.9)' : 'rgba(235, 77, 75, 0.9)'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          `;
          document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.background = type === 'success' ? 'rgba(52, 152, 219, 0.9)' : 'rgba(235, 77, 75, 0.9)';
        toast.style.opacity = '1';

        setTimeout(() => { toast.style.opacity = '0'; }, 2000);
      }

      async function activateNormalization() {
        const success = await sharedAudio.enableNormalization();
        if (success) {
          shouldNormalizeAfterMediaChange = true;
          showNormToast('Normalization enabled', 'success');
          updateNormButtonState(true);
        } else {
          const msg = sharedAudio._hasIframeOnlyMedia()
            ? 'Audio normalization requires direct video playback'
            : 'Failed to activate';
          showNormToast(msg, 'error');
        }
      }

      async function deactivateNormalization() {
        await sharedAudio.disableNormalization();
        shouldNormalizeAfterMediaChange = false;
        updateNormButtonState(false);
      }

      function createBoostButton() {
        const btn = document.createElement('button');
        btn.id = 'btfw-vo-audioboost';
        btn.className = 'btn btn-sm btn-default btfw-vo-adopted';
        const percentage = Math.round(sharedAudio.BOOST_MULTIPLIER * 100);
        btn.title = `Toggle Audio Boost (${percentage}%)`;
        btn.setAttribute('data-btfw-overlay', '1');
        btn.innerHTML = '<i class="fa-solid fa-megaphone"></i>';

        btn.addEventListener('click', () => {
          if (sharedAudio.boostEnabled) {
            deactivateAudioBoost();
          } else {
            activateAudioBoost();
          }
        });

        btn.addEventListener('mouseenter', () => showBoostContextMenu());
        btn.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!boostContextMenu?.matches(':hover') && !btn.matches(':hover')) {
              hideBoostContextMenu();
            }
          }, 100);
        });

        return btn;
      }

      function createNormButton() {
        const btn = document.createElement('button');
        btn.id = 'btfw-vo-audionorm';
        btn.className = 'btn btn-sm btn-default btfw-vo-adopted';
        const presetLabel = sharedAudio.NORM_PRESETS[sharedAudio.currentNormPreset].label;
        btn.title = `Toggle Audio Normalization (${presetLabel})`;
        btn.setAttribute('data-btfw-overlay', '1');
        btn.innerHTML = '<i class="fa-solid fa-waveform-lines"></i>';

        btn.addEventListener('click', () => {
          if (sharedAudio.normalizationEnabled) {
            deactivateNormalization();
          } else {
            activateNormalization();
          }
        });

        btn.addEventListener('mouseenter', () => showNormContextMenu());
        btn.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!normContextMenu?.matches(':hover') && !btn.matches(':hover')) {
              hideNormContextMenu();
            }
          }, 100);
        });

        return btn;
      }

      function createBoostContextMenu() {
        if (boostContextMenu) return boostContextMenu;

        const menu = document.createElement('div');
        menu.id = 'btfw-boost-context-menu';
        menu.style.cssText = `
          position: absolute;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(109, 77, 246, 0.3);
          border-radius: 8px;
          padding: 6px;
          display: none;
          z-index: 10000;
          min-width: 100px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `;

        BOOST_PRESETS.forEach(preset => {
          const item = document.createElement('button');
          item.className = 'btfw-context-item';
          item.textContent = preset.label;
          item.style.cssText = `
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `;

          if (sharedAudio.BOOST_MULTIPLIER === preset.multiplier) {
            item.style.background = 'rgba(46, 213, 115, 0.2)';
            item.style.color = '#2ed573';
          }

          item.addEventListener('mouseenter', () => {
            if (sharedAudio.BOOST_MULTIPLIER !== preset.multiplier) {
              item.style.background = 'rgba(109, 77, 246, 0.2)';
            }
          });

          item.addEventListener('mouseleave', () => {
            if (sharedAudio.BOOST_MULTIPLIER !== preset.multiplier) {
              item.style.background = 'transparent';
            }
          });

          item.addEventListener('click', async () => {
            await sharedAudio.setBoostMultiplier(preset.multiplier);
            updateBoostContextMenuSelection();
            if (boostButton) {
              const percentage = Math.round(preset.multiplier * 100);
              boostButton.title = `Toggle Audio Boost (${percentage}%)`;
            }
            if (sharedAudio.boostEnabled) {
              showToast(`Boost set to ${preset.label}`, 'success');
            }
          });

          menu.appendChild(item);
        });

        menu.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!boostButton?.matches(':hover')) {
              hideBoostContextMenu();
            }
          }, 100);
        });

        document.body.appendChild(menu);
        boostContextMenu = menu;
        return menu;
      }

      function showBoostContextMenu() {
        if (!boostButton) return;
        const menu = createBoostContextMenu();
        const rect = boostButton.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.display = 'block';
      }

      function hideBoostContextMenu() {
        if (boostContextMenu) boostContextMenu.style.display = 'none';
      }

      function updateBoostContextMenuSelection() {
        if (!boostContextMenu) return;
        const items = boostContextMenu.querySelectorAll('.btfw-context-item');
        items.forEach((item, idx) => {
          const preset = BOOST_PRESETS[idx];
          if (sharedAudio.BOOST_MULTIPLIER === preset.multiplier) {
            item.style.background = 'rgba(46, 213, 115, 0.2)';
            item.style.color = '#2ed573';
          } else {
            item.style.background = 'transparent';
            item.style.color = '#e0e0e0';
          }
        });
      }

      function createNormContextMenu() {
        if (normContextMenu) return normContextMenu;

        const menu = document.createElement('div');
        menu.id = 'btfw-norm-context-menu';
        menu.style.cssText = `
          position: absolute;
          background: rgba(20, 31, 54, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(52, 152, 219, 0.3);
          border-radius: 8px;
          padding: 6px;
          display: none;
          z-index: 10000;
          min-width: 110px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        `;

        Object.keys(sharedAudio.NORM_PRESETS).forEach(key => {
          const preset = sharedAudio.NORM_PRESETS[key];
          const item = document.createElement('button');
          item.className = 'btfw-context-item';
          item.textContent = preset.label;
          item.style.cssText = `
            display: block;
            width: 100%;
            padding: 6px 12px;
            background: transparent;
            border: none;
            color: #e0e0e0;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
            font-size: 13px;
            transition: all 0.2s ease;
          `;

          if (sharedAudio.currentNormPreset === key) {
            item.style.background = 'rgba(52, 152, 219, 0.2)';
            item.style.color = '#3498db';
          }

          item.addEventListener('mouseenter', () => {
            if (sharedAudio.currentNormPreset !== key) {
              item.style.background = 'rgba(109, 77, 246, 0.2)';
            }
          });

          item.addEventListener('mouseleave', () => {
            if (sharedAudio.currentNormPreset !== key) {
              item.style.background = 'transparent';
            }
          });

          item.addEventListener('click', async () => {
            await sharedAudio.setNormPreset(key);
            updateNormContextMenuSelection();
            if (normButton) {
              normButton.title = `Toggle Audio Normalization (${preset.label})`;
            }
            if (sharedAudio.normalizationEnabled) {
              showNormToast(`Preset: ${preset.label}`, 'success');
            }
          });

          menu.appendChild(item);
        });

        menu.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!normButton?.matches(':hover')) {
              hideNormContextMenu();
            }
          }, 100);
        });

        document.body.appendChild(menu);
        normContextMenu = menu;
        return menu;
      }

      function showNormContextMenu() {
        if (!normButton) return;
        const menu = createNormContextMenu();
        const rect = normButton.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.display = 'block';
      }

      function hideNormContextMenu() {
        if (normContextMenu) normContextMenu.style.display = 'none';
      }

      function updateNormContextMenuSelection() {
        if (!normContextMenu) return;
        const items = normContextMenu.querySelectorAll('.btfw-context-item');
        Object.keys(sharedAudio.NORM_PRESETS).forEach((key, idx) => {
          const item = items[idx];
          if (sharedAudio.currentNormPreset === key) {
            item.style.background = 'rgba(52, 152, 219, 0.2)';
            item.style.color = '#3498db';
          } else {
            item.style.background = 'transparent';
            item.style.color = '#e0e0e0';
          }
        });
      }

      function addButtonsToOverlay() {
        const voLeft = $('#btfw-vo-left');
        if (!voLeft) return false;

        const existingBoost = $('#btfw-vo-audioboost');
        if (existingBoost) existingBoost.remove();
        const existingNorm = $('#btfw-vo-audionorm');
        if (existingNorm) existingNorm.remove();

        boostButton = createBoostButton();
        normButton = createNormButton();
        voLeft.appendChild(boostButton);
        voLeft.appendChild(normButton);
        return true;
      }

      function waitForOverlayBar(callback, maxAttempts = 20) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (addButtonsToOverlay()) {
            clearInterval(interval);
            callback();
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 500);
      }

      function initializePlayer() {
        if (typeof videojs === 'undefined') { setTimeout(initializePlayer, 500); return; }

        const playerElement = $('#ytapiplayer');
        if (!playerElement) { setTimeout(initializePlayer, 500); return; }

        sharedAudio.player = videojs('ytapiplayer');
        sharedAudio.originalSrc = sharedAudio.player.currentSrc();
        sharedAudio.startWatchdog();
        // console.log('[audioboost] Player initialized');
      }

      function handleMediaChange() {
        setTimeout(() => {
          sharedAudio.resetMediaBinding();
          sharedAudio.boostEnabled = false;
          sharedAudio.normalizationEnabled = false;
          sharedAudio.isProxied = false;
          updateBoostButtonState(false);
          updateNormButtonState(false);
          initializePlayer();

          if (shouldBoostAfterMediaChange) {
            setTimeout(() => { activateAudioBoost(); }, 1200);
          }
          if (shouldNormalizeAfterMediaChange) {
            setTimeout(() => { activateNormalization(); }, 1200);
          }
        }, 600);
      }

      function hookSocketReconnects() {
        if (typeof socket === 'undefined' || !socket.on) return;
        socket.on('disconnect', () => {
          // keep time; watchdog will handle reapply after reconnect
        });
        socket.on('connect', () => {
          // After reconnect, enforce proxy if needed
          setTimeout(() => sharedAudio._checkAndReapply('socket-connect'), 500);
        });
        socket.on('reconnect', () => {
          setTimeout(() => sharedAudio._checkAndReapply('socket-reconnect'), 500);
        });
        socket.on('changeMedia', handleMediaChange);
      }

      function boot() {
        waitForOverlayBar(() => { initializePlayer(); });
        hookSocketReconnects();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
      } else {
        boot();
      }

      return {
        name: "feature:audioboost",
        activate: activateAudioBoost,
        deactivate: deactivateAudioBoost,
        isActive: () => sharedAudio.boostEnabled,
        activateNormalization,
        deactivateNormalization,
        isNormalizationActive: () => sharedAudio.normalizationEnabled
      };
    });

    // Legacy id used by billtube-fw < v1.0.6
    BTFW.define("feature:audio-boost", ["feature:audioboost"], async (ctx) => ctx.init("feature:audioboost"));
    BTFW.define("feature:audionorm", ["feature:audioboost"], async (ctx) => ctx.init("feature:audioboost"));
  });
})();
