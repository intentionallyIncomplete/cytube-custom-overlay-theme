/**
 * Minimal CyTube runtime stubs for the static E2E fixture page.
 * Enough for BillTube boot without a live Socket.IO server.
 */
(function () {
  const noop = () => {};
  const noopChain = () => chain;
  const chain = {
    on: noopChain,
    off: noopChain,
    click: noopChain,
    val: () => "",
    text: () => "",
    html: () => "",
    append: noopChain,
    prepend: noopChain,
    find: () => chain,
    addClass: noopChain,
    removeClass: noopChain,
    toggleClass: noopChain,
    attr: () => "",
    prop: () => undefined,
    each: noop,
    length: 0,
    trigger: noopChain,
    modal: noopChain,
    tab: noopChain,
    tooltip: noopChain
  };

  window.CHANNEL = {
    name: "e2e-fixture",
    emotes: [],
    usercount: 1
  };

  window.CLIENT = {
    name: "e2e-user",
    rank: 255
  };

  window.USEROPTS = {
    synch: true,
    sync_accuracy: 2,
    avatar: ""
  };

  window.PLAYER = {
    mediaId: null,
    mediaType: null,
    paused: true,
    getTime(cb) {
      if (typeof cb === "function") cb(0);
    },
    seekTo: noop,
    play: noop,
    pause: noop
  };

  window.socket = {
    on: noop,
    off: noop,
    emit: noop,
    removeListener: noop
  };

  window.jQuery = function () {
    return chain;
  };
  window.jQuery.fn = chain;
  window.$ = window.jQuery;

  function createVideojsStub() {
    function videojs() {
      return {
        ready(fn) {
          if (typeof fn === "function") fn();
        },
        dispose: noop,
        on: noop,
        off: noop,
        el: () => document.createElement("div")
      };
    }
    videojs.getPlugin = () => ({});
    videojs.registerPlugin = noop;
    return videojs;
  }

  window.videojs = createVideojsStub();

  window.waitUntilDefined = function (obj, key, cb) {
    if (typeof cb !== "function") return;
    if (obj === window && key === "videojs" && !window.videojs) {
      window.videojs = createVideojsStub();
    }
    const deadline = Date.now() + 5000;
    (function tick() {
      if (obj && obj[key] !== undefined) {
        cb();
        return;
      }
      if (Date.now() > deadline) {
        cb();
        return;
      }
      setTimeout(tick, 25);
    })();
  };
})();
