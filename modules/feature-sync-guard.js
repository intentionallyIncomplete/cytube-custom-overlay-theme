BTFW.define('feature:syncGuard', [], async () => {
  const DEFAULT_SYNC_ACCURACY = 2;
  const CHANGE_MEDIA_TIMEOUT_MS = 5000;
  const SEEK_TIMEOUT_MS = 8000;
  const SEEK_INTERVAL_MS = 200;
  const POST_BOOT_GUARD_MS = 30000;

  function hasActiveMedia() {
    const p = window.PLAYER;
    return !!(p && (p.mediaId || p.mediaType));
  }

  function getSyncAccuracy() {
    try {
      if (typeof USEROPTS !== 'undefined' && typeof USEROPTS.sync_accuracy === 'number') {
        return USEROPTS.sync_accuracy;
      }
    } catch (_) {}
    return DEFAULT_SYNC_ACCURACY;
  }

  function getPlayerTime() {
    return new Promise((resolve) => {
      const p = window.PLAYER;
      if (!p || typeof p.getTime !== 'function') {
        resolve(null);
        return;
      }
      try {
        p.getTime((t) => resolve(typeof t === 'number' && Number.isFinite(t) ? t : null));
      } catch (_) {
        resolve(null);
      }
    });
  }

  function applyServerPlayback(data) {
    const p = window.PLAYER;
    if (!p || !data || typeof data.currentTime !== 'number') return;

    if (data.paused === false && p.paused && typeof p.play === 'function') {
      try { p.play(); } catch (_) {}
    } else if (data.paused === true && !p.paused && typeof p.pause === 'function') {
      try { p.pause(); } catch (_) {}
    }

    if (typeof p.seekTo === 'function') {
      try { p.seekTo(data.currentTime); } catch (_) {}
    }
  }

  async function seekUntilSynced(targetTime, options = {}) {
    if (typeof targetTime !== 'number' || !Number.isFinite(targetTime)) {
      return false;
    }

    const accuracy = typeof options.accuracy === 'number' ? options.accuracy : getSyncAccuracy();
    const timeout = typeof options.timeout === 'number' ? options.timeout : SEEK_TIMEOUT_MS;
    const interval = typeof options.interval === 'number' ? options.interval : SEEK_INTERVAL_MS;
    const deadline = Date.now() + timeout;
    const playback = typeof options.paused === 'boolean'
      ? { currentTime: targetTime, paused: options.paused }
      : null;

    while (Date.now() < deadline) {
      if (playback) {
        applyServerPlayback(playback);
      } else {
        const p = window.PLAYER;
        if (p && typeof p.seekTo === 'function') {
          try { p.seekTo(targetTime); } catch (_) {}
        }
      }

      const local = await getPlayerTime();
      if (local != null && Math.abs(targetTime - local) <= accuracy) {
        return true;
      }

      await new Promise((r) => setTimeout(r, interval));
    }

    const finalLocal = await getPlayerTime();
    return finalLocal != null && Math.abs(targetTime - finalLocal) <= accuracy;
  }

  function waitForChangeMedia(timeoutMs = CHANGE_MEDIA_TIMEOUT_MS) {
    return new Promise((resolve) => {
      if (!window.socket) {
        resolve(null);
        return;
      }

      let done = false;
      const finish = (data) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve(data ?? null);
      };

      const timer = setTimeout(() => finish(null), timeoutMs);

      try {
        socket.once('changeMedia', finish);
        socket.emit('playerReady');
      } catch (_) {
        finish(null);
      }
    });
  }

  function armPostBootSyncGuard() {
    if (!window.socket || typeof socket.on !== 'function') return;

    const accuracy = getSyncAccuracy();
    const deadline = Date.now() + POST_BOOT_GUARD_MS;

    const onMediaUpdate = (data) => {
      if (Date.now() > deadline || !data || typeof data.currentTime !== 'number') return;
      if (typeof CLIENT !== 'undefined' && CLIENT.leader) return;
      if (typeof USEROPTS !== 'undefined' && USEROPTS.synch === false) return;

      getPlayerTime().then((local) => {
        if (local == null) return;
        if (Math.abs(data.currentTime - local) <= accuracy) return;
        applyServerPlayback(data);
      });
    };

    try {
      socket.on('mediaUpdate', onMediaUpdate);
      setTimeout(() => {
        try {
          if (typeof socket.off === 'function') socket.off('mediaUpdate', onMediaUpdate);
        } catch (_) {}
      }, POST_BOOT_GUARD_MS);
    } catch (_) {}
  }

  async function playbackResyncIfNeeded(options = {}) {
    if (!hasActiveMedia() || !window.socket) {
      return;
    }

    const changeMediaTimeout = typeof options.changeMediaTimeout === 'number'
      ? options.changeMediaTimeout
      : CHANGE_MEDIA_TIMEOUT_MS;
    const maxAttempts = typeof options.maxAttempts === 'number' ? options.maxAttempts : 2;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const media = await waitForChangeMedia(changeMediaTimeout);
      if (!media || typeof media.currentTime !== 'number') {
        continue;
      }

      const synced = await seekUntilSynced(media.currentTime, { paused: media.paused });
      if (synced) {
        window.BTFW._playbackResyncDone = true;
        armPostBootSyncGuard();
        return;
      }
    }
  }

  return {
    name: 'feature:syncGuard',
    playbackResyncIfNeeded,
    hasActiveMedia,
    seekUntilSynced,
    getPlayerTime,
    applyServerPlayback,
    getSyncAccuracy
  };
});
