/**
 * Socket recorder for E2E characterization tests.
 *
 * The fixture's cytube-stubs.js sets `window.socket = { on: noop, ... }`, which
 * swallows every handler feature modules register at boot. This init script traps
 * that assignment and wraps `on` so registered handlers are recorded in
 * `window.__socketHandlers` (while still calling the original), letting tests
 * emit CyTube socket events (setMotd, newPoll, closePoll) at the real entry
 * points feature-stack uses.
 */

export async function installSocketRecorder(page) {
  await page.addInitScript(() => {
    window.__socketHandlers = {};
    let _socket;
    Object.defineProperty(window, "socket", {
      configurable: true,
      get() {
        return _socket;
      },
      set(v) {
        _socket = v;
        if (v && typeof v.on === "function") {
          const originalOn = v.on.bind(v);
          v.on = (evt, fn) => {
            (window.__socketHandlers[evt] ||= []).push(fn);
            try {
              originalOn(evt, fn);
            } catch { /* stub on() must never break module boot */ }
          };
        }
      }
    });
  });
}

/** Invoke every handler registered for `evt` with `payload` (must be cloneable). */
export function emitSocketEvent(page, evt, payload) {
  return page.evaluate(
    ([e, p]) => {
      (window.__socketHandlers[e] || []).forEach((fn) => fn(p));
    },
    [evt, payload]
  );
}
