// BTFW Audio Processing System - Combined Boost + Normalization + Reconnect-safe auto-reproxy watchdog
(function() {
  'use strict';

  const INTERNAL_SET_GRACE_MS = 2000;   // time window where changes are considered ours
  const WATCHDOG_TICK_MS      = 800;    // polling backup
  const REAPPLY_DEBOUNCE_MS   = 800;    // avoid rapid re-sets
  const TRUSTED_DOMAINS       = [
    'cytube.billtube.workers.dev',
    'billtube.workers.dev'
  ];

  function safeNow() { return Date.now(); }

  window.BTFW_AUDIO = {
    audioContext: null,
    sourceNode: null,
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
    CORS_PROXY: 'https://vidprox.billtube.workers.dev/?url=',
    BOOST_MULTIPLIER: 2.5,
    currentNormPreset: 'youtube',

    // Watchdog state
    _watchdogInterval: null,
    _mutationObserver: null,
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
        const u = new URL(urlStr);
        return TRUSTED_DOMAINS.some(d => u.hostname === d);
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

    _same(a, b) {
      // video.js may normalize encodings; compare decoded when proxied
      return String(a || '') === String(b || '');
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

    cleanup() {
      this.disconnectChain();

      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
        this.audioContext = null;
      }

      this.sourceNode = null;

      if (this.player && this.player.tech_ && this.player.tech_.el_) {
        this.player.tech_.el_.disableRemotePlayback = false;
      }

      this.stopWatchdog();
    },

    // Watchdog

    startWatchdog() {
      if (!this.player) return;
      this.stopWatchdog();

      const videoEl = this.player.tech_?.el?.() || this.player.tech_?.el_ || document.querySelector('#ytapiplayer video');

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
      try {
        this.player.on('sourceset', () => this._checkAndReapply('sourceset'));
        this.player.on('loadstart', () => this._checkAndReapply('loadstart'));
        this.player.on('loadedmetadata', () => this._checkAndReapply('loadedmetadata'));
        this.player.on('stalled', () => this._checkAndReapply('stalled'));
        this.player.on('error', () => this._checkAndReapply('error'));
      } catch {}

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
          // For processing, trusted + crossOrigin is okay; just ensure CORS attribute
          try { this.player.crossOrigin('anonymous'); } catch {}
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
          // Use trusted as-is but make sure crossOrigin is set for WebAudio
          const currentTime = this.player.currentTime();
          const wasPlaying = !this.player.paused();

          this.originalSrc = currentSrc;

          try { this.player.pause(); } catch {}
          try { this.player.crossOrigin('anonymous'); } catch {}

          this._markInternalSrcSet();
          this.player.src({ src: currentSrc, type: 'video/mp4' });
          try { this.player.load(); } catch {}

          return new Promise((resolve) => {
            this.player.ready(() => {
              try { this.player.currentTime(currentTime); } catch {}
              this.isProxied = false;
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
      if (!this.player || !this.player.tech_ || !this.player.tech_.el_) {
        console.error('[BTFW_AUDIO] Player not ready');
        return false;
      }

      if (this.boostEnabled || this.normalizationEnabled) {
        if (!this.isProxied && !this._isTrusted(this.player.currentSrc())) {
          await this.ensureProxy();
        } else {
          // Ensure CORS for trusted sources when processing
          try { this.player.crossOrigin('anonymous'); } catch {}
        }
      }

      this.disconnectChain();

      try {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const videoEl = this.player.tech().el();
        if (this.player.tech_ && this.player.tech_.el_) {
          this.player.tech_.el_.disableRemotePlayback = true;
        }

        if (!this.sourceNode) {
          this.sourceNode = this.audioContext.createMediaElementSource(videoEl);
        }

        let currentNode = this.sourceNode;

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
        this.cleanup();
        return false;
      }
    },

    // Public feature toggles

    async enableBoost() {
      this.boostEnabled = true;
      const ok = await this.rebuildAudioChain();
      if (ok) this.startWatchdog();
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
      if (ok) this.startWatchdog();
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
      let shouldBoostAfterMediaChange = false;
      let contextMenu = null;

      const BOOST_PRESETS = [
        { multiplier: 1.5, label: '150%' },
        { multiplier: 2.5, label: '250%' },
        { multiplier: 3.5, label: '350%' }
      ];

      function updateButtonState(active) {
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
          updateButtonState(true);
        } else {
          showToast('Failed to activate boost', 'error');
        }
      }

      async function deactivateAudioBoost() {
        await sharedAudio.disableBoost();
        shouldBoostAfterMediaChange = false;
        updateButtonState(false);
      }

      function createButton() {
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

        btn.addEventListener('mouseenter', () => showContextMenu());
        btn.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!contextMenu?.matches(':hover') && !btn.matches(':hover')) {
              hideContextMenu();
            }
          }, 100);
        });

        return btn;
      }

      function createContextMenu() {
        if (contextMenu) return contextMenu;

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
            updateContextMenuSelection();
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
              hideContextMenu();
            }
          }, 100);
        });

        document.body.appendChild(menu);
        contextMenu = menu;
        return menu;
      }

      function showContextMenu() {
        if (!boostButton) return;
        const menu = createContextMenu();
        const rect = boostButton.getBoundingClientRect();
        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.display = 'block';
      }

      function hideContextMenu() {
        if (contextMenu) contextMenu.style.display = 'none';
      }

      function updateContextMenuSelection() {
        if (!contextMenu) return;
        const items = contextMenu.querySelectorAll('.btfw-context-item');
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

      function addButtonToOverlay() {
        const voLeft = $('#btfw-vo-left');
        if (!voLeft) return false;

        const existing = $('#btfw-vo-audioboost');
        if (existing) existing.remove();

        boostButton = createButton();
        voLeft.appendChild(boostButton);
        return true;
      }

      function waitForOverlayBar(callback, maxAttempts = 20) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (addButtonToOverlay()) {
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
          sharedAudio.cleanup();
          sharedAudio.isProxied = false;
          updateButtonState(false);
          initializePlayer();

          if (shouldBoostAfterMediaChange) {
            setTimeout(() => { activateAudioBoost(); }, 1200);
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
        isActive: () => sharedAudio.boostEnabled
      };
    });

    // Legacy id used by billtube-fw < v1.0.6
    BTFW.define("feature:audio-boost", ["feature:audioboost"], async (ctx) => ctx.init("feature:audioboost"));
  });
})();

/* Audio Normalization Module */
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
    BTFW.define("feature:audionorm", [], async () => {
      const $ = (selector, root = document) => root.querySelector(selector);
      const sharedAudio = window.BTFW_AUDIO;

      let normButton = null;
      let shouldNormalizeAfterMediaChange = false;
      let contextMenu = null;

      function updateButtonState(active) {
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

      function showToast(message, type = 'info') {
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
          showToast('Normalization enabled', 'success');
          updateButtonState(true);
        } else {
          showToast('Failed to activate', 'error');
        }
      }

      async function deactivateNormalization() {
        await sharedAudio.disableNormalization();
        shouldNormalizeAfterMediaChange = false;
        updateButtonState(false);
      }

      function createButton() {
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

        btn.addEventListener('mouseenter', () => showContextMenu());
        btn.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!contextMenu?.matches(':hover') && !btn.matches(':hover')) {
              hideContextMenu();
            }
          }, 100);
        });

        return btn;
      }

      function createContextMenu() {
        if (contextMenu) return contextMenu;

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
            updateContextMenuSelection();
            if (normButton) {
              normButton.title = `Toggle Audio Normalization (${preset.label})`;
            }
            if (sharedAudio.normalizationEnabled) {
              showToast(`Preset: ${preset.label}`, 'success');
            }
          });

          menu.appendChild(item);
        });

        menu.addEventListener('mouseleave', () => {
          setTimeout(() => {
            if (!normButton?.matches(':hover')) {
              hideContextMenu();
            }
          }, 100);
        });

        document.body.appendChild(menu);
        contextMenu = menu;
        return menu;
      }

      function showContextMenu() {
        if (!normButton) return;
        const menu = createContextMenu();
        const rect = normButton.getBoundingClientRect();

        menu.style.left = rect.left + 'px';
        menu.style.top = (rect.bottom + 5) + 'px';
        menu.style.display = 'block';
      }

      function hideContextMenu() {
        if (contextMenu) contextMenu.style.display = 'none';
      }

      function updateContextMenuSelection() {
        if (!contextMenu) return;
        const items = contextMenu.querySelectorAll('.btfw-context-item');
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

      function addButtonToOverlay() {
        const voLeft = $('#btfw-vo-left');
        if (!voLeft) return false;

        const existing = $('#btfw-vo-audionorm');
        if (existing) existing.remove();

        normButton = createButton();
        voLeft.appendChild(normButton);
        return true;
      }

      function waitForOverlayBar(callback, maxAttempts = 20) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (addButtonToOverlay()) {
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

        if (!sharedAudio.player) {
          sharedAudio.player = videojs('ytapiplayer');
          sharedAudio.originalSrc = sharedAudio.player.currentSrc();
        }
        sharedAudio.startWatchdog();
        // console.log('[audionorm] Player initialized');
      }

      function handleMediaChange() {
        setTimeout(() => {
          sharedAudio.cleanup();
          sharedAudio.isProxied = false;
          updateButtonState(false);
          initializePlayer();

          if (shouldNormalizeAfterMediaChange) {
            setTimeout(() => { activateNormalization(); }, 1200);
          }
        }, 600);
      }

      function hookSocketReconnects() {
        if (typeof socket === 'undefined' || !socket.on) return;
        socket.on('disconnect', () => { /* noop */ });
        socket.on('connect', () => setTimeout(() => sharedAudio._checkAndReapply('socket-connect'), 500));
        socket.on('reconnect', () => setTimeout(() => sharedAudio._checkAndReapply('socket-reconnect'), 500));
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
        name: "feature:audionorm",
        activate: activateNormalization,
        deactivate: deactivateNormalization,
        isActive: () => sharedAudio.normalizationEnabled
      };
    });
  });
})();