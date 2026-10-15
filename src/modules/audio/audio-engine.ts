/**
 * Audio processing engine of feature-audio.js (#228 Phase 3, step 5).
 *
 * Owns the Web Audio chain (boost gain / normalization compressor / mono
 * splitter-merger), CORS proxy trust logic (configured proxy + vidprox.*
 * siblings), proxy swap/reapply state machine, and the reconnect-safe
 * watchdog (MutationObserver + player event hooks + interval + Page
 * Visibility handling). Exposed as the BTFW_AUDIO singleton; the UI shell
 * in feature-audio.js consumes it via the same global.
 *
 * Extracted verbatim from src/modules/feature-audio.js — behavior-preserving.
 */


  const INTERNAL_SET_GRACE_MS = 2000;   // time window where changes are considered ours
  const WATCHDOG_TICK_MS      = 800;    // polling backup
  const REAPPLY_DEBOUNCE_MS   = 800;    // avoid rapid re-sets
  const DEFAULT_CORS_PROXY    = 'https://vidprox.movies-storage-a.workers.dev/?url=';

  function mediaSourceRegistry() {
    if (!window.__btfwMediaSourceNodes) {
      window.__btfwMediaSourceNodes = new WeakMap();
    }
    return window.__btfwMediaSourceNodes;
  }

  function safeNow() { return Date.now(); }

export const BTFW_AUDIO = window.BTFW_AUDIO = {
    audioContext: null,
    sourceNode: null,
    _sourceMediaElement: null,
    compressorNode: null,
    gainNode: null,
    splitterNode: null,
    monoMixGain: null,
    mergerNode: null,
    player: null,
    _sourceObserver: null,

    // URL state
    originalSrc: null,
    proxiedSrc: null,
    isProxied: false,

    // Feature flags
    boostEnabled: false,
    normalizationEnabled: false,
    monoEnabled: false,

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
    _visibilityHandler: null,
    _lastKnownSrc: null,
    _lastInternalSrcSetAt: 0,
    _lastAutoReapplyAt: 0,
    _rebuildInFlight: null,

    NORM_PRESETS: {
      gentle:     { threshold: -12, knee: 20, ratio: 6,  attack: 0.01,  release: 0.5,  label: 'Gentle' },
      youtube:    { threshold: -24, knee: 30, ratio: 12, attack: 0.003, release: 0.25, label: 'YouTube' },
      aggressive: { threshold: -50, knee: 40, ratio: 12, attack: 0.001, release: 0.25, label: 'Aggressive' }
    },

    // Core utilities

    _getCorsProxyOrigin() {
      try {
        return new URL(this.CORS_PROXY).origin.toLowerCase();
      } catch {
        try {
          return new URL(DEFAULT_CORS_PROXY).origin.toLowerCase();
        } catch {
          return '';
        }
      }
    },

    // Only CORS video proxies are safe for Web Audio. Other *.workers.dev CDNs
    // (movie hosts, etc.) often lack ACAO, which makes MediaElementSource output silence.
    // Sibling vidprox.* deployments (channel CDNs) share the same ACAO contract.
    _isTrusted(urlStr) {
      if (!urlStr) return false;
      if (String(urlStr).includes(this.CORS_PROXY)) return true;
      try {
        const parsed = new URL(urlStr);
        const origin = parsed.origin.toLowerCase();
        const proxyOrigin = this._getCorsProxyOrigin();
        if (proxyOrigin && origin === proxyOrigin) return true;
        return /^vidprox\./i.test(parsed.hostname);
      } catch {
        return false;
      }
    },

    _unwrapProxiedUrl(urlStr) {
      if (!urlStr || !this._isTrusted(urlStr)) return urlStr;
      try {
        const nested = new URL(urlStr).searchParams.get('url');
        return nested || urlStr;
      } catch {
        return urlStr;
      }
    },

    _markInternalSrcSet() {
      this._lastInternalSrcSetAt = safeNow();
    },

    _isInsideInternalWindow() {
      return safeNow() - this._lastInternalSrcSetAt <= INTERNAL_SET_GRACE_MS;
    },

    _shouldForceProxy() {
      return this.boostEnabled || this.normalizationEnabled || this.monoEnabled;
    },

    _hasAnonymousCrossOrigin() {
      const el = this._getMediaElement();
      if (!el) return false;
      return el.crossOrigin === 'anonymous' || el.getAttribute('crossorigin') === 'anonymous';
    },

    // Never enable CORS mode while the element still points at a non-ACAO host —
    // the browser immediately re-fetches currentSrc with Origin and bricks Video.js
    // (MEDIA_ERR_SRC_NOT_SUPPORTED) when the CDN omits Access-Control-Allow-Origin.
    _ensureAnonymousCrossOrigin() {
      if (this._hasAnonymousCrossOrigin()) return false;
      const current = this.player?.currentSrc?.() || this._getMediaElement()?.currentSrc || '';
      if (current && !this._isTrusted(current)) return false;
      try {
        this.player?.crossOrigin('anonymous');
        return true;
      } catch {
        return false;
      }
    },

    _clearMediaElementForCorsSwap() {
      const el = this._getMediaElement();
      if (!el) return;
      try {
        el.removeAttribute('src');
        el.removeAttribute('crossorigin');
        while (el.firstChild) el.removeChild(el.firstChild);
        el.load();
      } catch {}
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
        } catch {}
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
        try { this.sourceNode.disconnect(); } catch {}
      }
      if (this.compressorNode) {
        try { this.compressorNode.disconnect(); } catch {}
        this.compressorNode = null;
      }
      if (this.gainNode) {
        try { this.gainNode.disconnect(); } catch {}
        this.gainNode = null;
      }
      if (this.splitterNode) {
        try { this.splitterNode.disconnect(); } catch {}
        this.splitterNode = null;
      }
      if (this.monoMixGain) {
        try { this.monoMixGain.disconnect(); } catch {}
        this.monoMixGain = null;
      }
      if (this.mergerNode) {
        try { this.mergerNode.disconnect(); } catch {}
        this.mergerNode = null;
      }
    },

    resetMediaBinding() {
      this.disconnectChain();
      const videoEl = this._getMediaElement();
      if (videoEl && this._syncFromRegistry(videoEl)) {
        if (this.audioContext?.state === 'running') {
          this.audioContext.suspend().catch(() => {});
        }
        return;
      }
      this.sourceNode = null;
      this._sourceMediaElement = null;
      if (this.audioContext?.state === 'running') {
        this.audioContext.suspend().catch(() => {});
      }
    },

    _swapVideoTechElement(videoEl) {
      const tech = this.player?.tech_;
      if (!tech?.el_ || tech.el_ !== videoEl) return null;

      const parent = videoEl.parentNode;
      if (!parent) return null;

      const tag = videoEl.tagName.toLowerCase() === 'audio' ? 'audio' : 'video';
      const newEl = document.createElement(tag);
      newEl.className = videoEl.className;
      if (videoEl.id) newEl.id = videoEl.id;
      newEl.setAttribute('playsinline', '');
      newEl.setAttribute('webkit-playsinline', '');
      if (!newEl.classList.contains('vjs-tech')) {
        newEl.classList.add('vjs-tech');
      }

      const cross = videoEl.crossOrigin || videoEl.getAttribute('crossorigin');
      if (cross) {
        newEl.crossOrigin = cross;
        newEl.setAttribute('crossorigin', cross);
      }

      parent.replaceChild(newEl, videoEl);
      tech.el_ = newEl;
      delete videoEl.__btfwSourceNode;

      return newEl;
    },

    _syncFromRegistry(videoEl) {
      const cached = mediaSourceRegistry().get(videoEl) || videoEl.__btfwSourceNode || null;
      if (!cached) return null;
      mediaSourceRegistry().set(videoEl, cached);
      this.sourceNode = cached;
      this._sourceMediaElement = videoEl;
      if (cached.context instanceof AudioContext && cached.context.state !== 'closed') {
        this.audioContext = cached.context;
      }
      return cached;
    },

    _getOrCreateSourceNode(videoEl) {
      const registry = mediaSourceRegistry();
      let cached = registry.get(videoEl) || videoEl.__btfwSourceNode || null;
      if (cached) {
        registry.set(videoEl, cached);
        this.sourceNode = cached;
        this._sourceMediaElement = videoEl;
        if (cached.context instanceof AudioContext && cached.context.state !== 'closed') {
          this.audioContext = cached.context;
        }
        return cached;
      }

      if (this.sourceNode && this._sourceMediaElement === videoEl) {
        registry.set(videoEl, this.sourceNode);
        videoEl.__btfwSourceNode = this.sourceNode;
        return this.sourceNode;
      }

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioContext();
      }

      let node;
      try {
        node = this.audioContext.createMediaElementSource(videoEl);
      } catch (err) {
        if (!(err instanceof DOMException) || err.name !== 'InvalidStateError') throw err;

        const synced = this._syncFromRegistry(videoEl);
        if (synced) return synced;

        const freshEl = this._swapVideoTechElement(videoEl);
        if (!freshEl) throw err;

        const src = this.player?.currentSrc();
        if (src && this.player) {
          this._markInternalSrcSet();
          this.player.src({ src, type: 'video/mp4' });
          try { this.player.load(); } catch {}
        }

        return this._getOrCreateSourceNode(freshEl);
      }

      registry.set(videoEl, node);
      videoEl.__btfwSourceNode = node;
      this.sourceNode = node;
      this._sourceMediaElement = videoEl;
      return node;
    },

    _connectPassthrough() {
      if (!this.sourceNode || !this.audioContext) return false;
      try { this.sourceNode.disconnect(); } catch {}
      try {
        this.sourceNode.connect(this.audioContext.destination);
        return true;
      } catch {
        return false;
      }
    },

    _clearCrossOriginAttribute() {
      const el = this._getMediaElement();
      if (el) {
        try {
          el.crossOrigin = null;
          el.removeAttribute('crossorigin');
        } catch {}
      }
      try { this.player?.crossOrigin?.(null); } catch {}
    },

    // Soft teardown: drop boost/norm/mono nodes but keep the same <video>
    // + MediaElementSource. Swapping tech.el_ (hard cleanup) desyncs Video.js
    // controls — progress/time freeze while media.currentTime still moves.
    cleanup() {
      this.disconnectChain();

      const mediaEl = this._getMediaElement();
      if (mediaEl) {
        mediaEl.disableRemotePlayback = false;
      }

      const keptPassthrough = this._connectPassthrough();
      if (!keptPassthrough) {
        this.sourceNode = null;
        this._sourceMediaElement = null;
        if (this.audioContext && this.audioContext.state === 'running') {
          this.audioContext.suspend().catch(() => {});
        }
      }

      this.stopWatchdog();
    },

    async _disableAllProcessing() {
      // Keep the current media element + MediaElementSource. MES permanently
      // captures element audio; navigating back to a non-ACAO host while the
      // source node is still bound yields silence (RMS 0) even with passthrough.
      // Staying on the CORS proxy (or any trusted URL) keeps audio alive without
      // swapping tech.el_ (which freezes Video.js controls).
      this.cleanup();

      const liveSrc = this.player?.currentSrc?.() || '';
      if (this.sourceNode && liveSrc && !this._isTrusted(liveSrc)) {
        await this.ensureProxy();
        this._connectPassthrough();
      }
      return true;
    },

    _restorePlayerSrc(src, { currentTime = 0, wasPlaying = false, clearCrossOrigin = false } = {}) {
      if (!this.player || !src) return Promise.resolve(false);
      const player = this.player;

      try { this.player.pause(); } catch {}
      if (clearCrossOrigin) {
        // Clear on the element first — player.crossOrigin(null) throws when
        // tech.el_ is briefly missing after DOM churn ("Cannot set properties of null").
        this._clearCrossOriginAttribute();
      }

      this._markInternalSrcSet();
      this.player.src({ src, type: 'video/mp4' });
      try { this.player.load(); } catch {}

      return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          try { player.off('canplay', onReady); } catch {}
          try { player.off('loadeddata', onReady); } catch {}
          try { player.currentTime(currentTime); } catch {}
          const playPromise = wasPlaying ? player.play() : Promise.resolve();
          Promise.resolve(playPromise).catch(() => {}).finally(() => resolve(true));
        };

        const onReady = () => finish();
        try { player.one('canplay', onReady); } catch {
          try { player.on('canplay', onReady); } catch {}
        }
        try { player.one('loadeddata', onReady); } catch {}

        if (typeof player.ready === 'function') {
          player.ready(() => {
            try {
              if (typeof player.readyState === 'function' && player.readyState() >= 2) {
                finish();
              }
            } catch {}
          });
        }

        setTimeout(finish, 5000);
      });
    },

    // Watchdog

    startWatchdog() {
      if (!this.player) return;
      const player = this.player;
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
        this._sourceObserver = sourceObserver;
      }

      // Video.js hooks that often fire on internal resets.
      // Intentionally NOT using AbortController/{ signal } here: player.on/off
      // is video.js's own event emitter (not native EventTarget), and
      // MutationObserver.disconnect() has no signal option either — neither
      // API accepts an AbortSignal, so this manual on/off pairing (mirrored
      // in stopWatchdog()) is the correct pattern for this case, not a gap.
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
            player.on(event, handler);
          });
        } catch {}
      }

      // Lightweight interval backup — paused via Page Visibility API while the tab is hidden
      if (typeof document === 'undefined' || !document.hidden) {
        this._startWatchdogInterval();
      }

      if (!this._visibilityHandler && typeof document !== 'undefined') {
        this._visibilityHandler = () => this._onVisibilityChange();
        document.addEventListener('visibilitychange', this._visibilityHandler);
      }

      // Prime last known
      this._lastKnownSrc = player.currentSrc();
    },

    _startWatchdogInterval() {
      if (this._watchdogInterval) return;
      this._watchdogInterval = setInterval(() => this._checkAndReapply('interval'), WATCHDOG_TICK_MS);
    },

    _stopWatchdogInterval() {
      if (!this._watchdogInterval) return;
      clearInterval(this._watchdogInterval);
      this._watchdogInterval = null;
    },

    // Backgrounded tabs don't need sub-second polling; the MutationObserver +
    // player event hooks stay live (they're event-driven, not polling) so a
    // revert is still caught immediately once the tab is visible again.
    _onVisibilityChange() {
      if (typeof document === 'undefined') return;
      if (document.hidden) {
        this._stopWatchdogInterval();
      } else if (this.player) {
        this._startWatchdogInterval();
        this._checkAndReapply('visibility-restore');
      }
    },

    stopWatchdog() {
      this._stopWatchdogInterval();
      const player = this.player;
      if (this._mutationObserver) {
        try { this._mutationObserver.disconnect(); } catch {}
        try { this._sourceObserver?.disconnect(); } catch {}
        this._sourceObserver = null;
        this._mutationObserver = null;
      }
      if (player && this._watchdogPlayerHandlers) {
        try {
          Object.entries(this._watchdogPlayerHandlers).forEach(([event, handler]) => {
            player.off(event, handler);
          });
        } catch {}
        this._watchdogPlayerHandlers = null;
      }
      if (this._visibilityHandler && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', this._visibilityHandler);
        this._visibilityHandler = null;
      }
    },

    _checkAndReapply(_reason) {
      if (!this.player) return;
      const current = this.player.currentSrc();
      if (!current) return;

      this._lastKnownSrc = current;

      // If we intentionally set src recently, ignore
      if (this._isInsideInternalWindow()) return;

      // Already on a CORS-capable vidprox — keep crossOrigin, do not double-wrap
      if (this._isTrusted(current)) {
        this.isProxied = true;
        this.proxiedSrc = current;
        if (!this.originalSrc || this._isTrusted(this.originalSrc)) {
          this.originalSrc = this._unwrapProxiedUrl(current);
        }
        if (this._shouldForceProxy()) {
          this._ensureAnonymousCrossOrigin();
        }
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
      if (!this.player) return false;
      const player = this.player;
      const t = player.currentTime();
      const wasPlaying = !player.paused();

      // Already CORS-safe (configured proxy or sibling vidprox.*)
      if (this._isTrusted(currentSrc)) {
        this.isProxied = true;
        this.proxiedSrc = currentSrc;
        if (!this.originalSrc || this._isTrusted(this.originalSrc)) {
          this.originalSrc = this._unwrapProxiedUrl(currentSrc);
        }
        this._ensureAnonymousCrossOrigin();
        return true;
      }

      this.originalSrc = this._unwrapProxiedUrl(currentSrc) || currentSrc;
      this.proxiedSrc = this.CORS_PROXY + encodeURIComponent(this.originalSrc);

      try { this.player.pause(); } catch {}

      // Drop the untrusted src BEFORE enabling CORS mode. Setting
      // crossOrigin while currentSrc is a non-ACAO CDN triggers an immediate
      // CORS refetch that fails and leaves Video.js with MEDIA_ERR_SRC_NOT_SUPPORTED.
      this._markInternalSrcSet();
      this._clearMediaElementForCorsSwap();
      try { this.player.crossOrigin('anonymous'); } catch {}

      this._markInternalSrcSet();
      this.player.src({ src: this.proxiedSrc, type: 'video/mp4' });
      try { this.player.load(); } catch {}

      return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          try { player.off('canplay', onReady); } catch {}
          try { player.off('loadeddata', onReady); } catch {}
          try { player.currentTime(t); } catch {}
          this.isProxied = true;
          if (wasPlaying) {
            player.play().catch(() => {});
          }
          resolve(true);
        };

        const onReady = () => finish();

        try { player.one('canplay', onReady); } catch {
          try { player.on('canplay', onReady); } catch {}
        }
        try { player.one('loadeddata', onReady); } catch {}

        if (typeof player.ready === 'function') {
          player.ready(() => {
            try {
              if (typeof player.readyState === 'function' && player.readyState() >= 2) {
                finish();
              }
            } catch {}
          });
        }

        setTimeout(finish, 5000);
      });
    },

    // Proxy/application helpers

    async ensureProxy() {
      if (!this.player) return false;
      const player = this.player;

      const currentSrc = player.currentSrc();
      if (!currentSrc) return false;

      if (this._isTrusted(currentSrc)) {
        this.isProxied = true;
        this.proxiedSrc = currentSrc;
        if (!this.originalSrc || this._isTrusted(this.originalSrc)) {
          this.originalSrc = this._unwrapProxiedUrl(currentSrc);
        }

        if (this._hasAnonymousCrossOrigin()) {
          return true;
        }

        const currentTime = player.currentTime();
        const wasPlaying = !player.paused();

        try { player.pause(); } catch {}
        // Safe: currentSrc is already on a CORS proxy
        this._ensureAnonymousCrossOrigin();

        this._markInternalSrcSet();
        player.src({ src: currentSrc, type: 'video/mp4' });
        try { player.load(); } catch {}

        return new Promise((resolve) => {
          player.ready(() => {
            try { player.currentTime(currentTime); } catch {}
            if (wasPlaying) {
              player.play().catch(() => {});
            }
            resolve(true);
          });
        });
      }

      // Fallback: force proxy and wait until the proxied media is ready
      await this._forceProxyPreservingState(currentSrc);
      return true;
    },

    async rebuildAudioChain() {
      if (this._rebuildInFlight) {
        return this._rebuildInFlight;
      }

      this._rebuildInFlight = this._rebuildAudioChainImpl();
      try {
        return await this._rebuildInFlight;
      } finally {
        this._rebuildInFlight = null;
      }
    },

    async _rebuildAudioChainImpl() {
      if (!this.player) {
        console.error('[BTFW_AUDIO] Player not ready');
        return false;
      }

      if (this._shouldForceProxy()) {
        // Always key off live currentSrc — stale isProxied after CyTube reverts
        // the URL used to call crossOrigin on the bare movie CDN and brick the player.
        const liveSrc = this.player.currentSrc();
        if (!this._isTrusted(liveSrc)) {
          const proxied = await this.ensureProxy();
          if (!proxied || !this._isTrusted(this.player.currentSrc())) {
            console.error('[BTFW_AUDIO] Proxy required but currentSrc is not CORS-safe');
            return false;
          }
        } else {
          this._ensureAnonymousCrossOrigin();
        }
      }

      if (!this.boostEnabled && !this.normalizationEnabled && !this.monoEnabled) {
        return true;
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
        const ctx = this.audioContext;
        if (!ctx) return false;
        let currentNode: AudioNode = sourceNode;

        if (this.normalizationEnabled) {
          this.compressorNode = ctx.createDynamicsCompressor();
          const preset = this.NORM_PRESETS[this.currentNormPreset] ?? this.NORM_PRESETS.youtube!;
          this.compressorNode.threshold.setValueAtTime(preset.threshold, ctx.currentTime);
          this.compressorNode.knee.setValueAtTime(preset.knee, ctx.currentTime);
          this.compressorNode.ratio.setValueAtTime(preset.ratio, ctx.currentTime);
          this.compressorNode.attack.setValueAtTime(preset.attack, ctx.currentTime);
          this.compressorNode.release.setValueAtTime(preset.release, ctx.currentTime);

          currentNode.connect(this.compressorNode);
          currentNode = this.compressorNode;
        }

        if (this.monoEnabled) {
          this.splitterNode = ctx.createChannelSplitter(2);
          this.monoMixGain = ctx.createGain();
          this.monoMixGain.gain.value = 0.5;
          this.mergerNode = ctx.createChannelMerger(2);

          currentNode.connect(this.splitterNode);
          this.splitterNode.connect(this.monoMixGain, 0);
          this.splitterNode.connect(this.monoMixGain, 1);
          this.monoMixGain.connect(this.mergerNode, 0, 0);
          this.monoMixGain.connect(this.mergerNode, 0, 1);
          currentNode = this.mergerNode;
        }

        if (this.boostEnabled) {
          this.gainNode = ctx.createGain();
          this.gainNode.gain.value = this.BOOST_MULTIPLIER;

          currentNode.connect(this.gainNode);
          currentNode = this.gainNode;
        }

        currentNode.connect(ctx.destination);

        // Make sure watchdog is active while processing is enabled
        this.startWatchdog();

        console.log('[BTFW_AUDIO] Chain rebuilt:', {
          normalization: this.normalizationEnabled,
          boost: this.boostEnabled,
          mono: this.monoEnabled,
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

      if (this.normalizationEnabled || this.monoEnabled) {
        const ok = await this.rebuildAudioChain();
        if (!this._shouldForceProxy()) this.stopWatchdog();
        return ok;
      }

      return this._disableAllProcessing();
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

      if (this.boostEnabled || this.monoEnabled) {
        const ok = await this.rebuildAudioChain();
        if (!this._shouldForceProxy()) this.stopWatchdog();
        return ok;
      }

      return this._disableAllProcessing();
    },

    async enableMono() {
      this.monoEnabled = true;
      const ok = await this.rebuildAudioChain();
      return ok;
    },

    async disableMono() {
      this.monoEnabled = false;

      if (this.boostEnabled || this.normalizationEnabled) {
        const ok = await this.rebuildAudioChain();
        if (!this._shouldForceProxy()) this.stopWatchdog();
        return ok;
      }

      return this._disableAllProcessing();
    }
  };
