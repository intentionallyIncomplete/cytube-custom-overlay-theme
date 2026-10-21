import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  TimeoutError,
  waitForElement,
  waitForCondition,
  observeOnce,
  debounce
} from "../../src/lib/dom-wait.ts";

class FakeMutationObserver {
  static instances = [];
  constructor(callback) {
    FakeMutationObserver.instances.push(this);
    this.callback = callback;
    this.target = null;
    this.init = null;
    this.disconnected = false;
  }
  observe(target, init) {
    this.target = target;
    this.init = init;
  }
  disconnect() {
    this.disconnected = true;
  }
  emit(records) {
    if (!this.disconnected) this.callback(records, this);
  }
}

function createFakeTimers() {
  const scheduled = [];
  return {
    setTimeoutFn(fn, ms) {
      const entry = { fn, ms, cleared: false };
      scheduled.push(entry);
      return entry;
    },
    clearTimeoutFn(handle) {
      const entry = scheduled.find((e) => e === handle);
      if (entry) entry.cleared = true;
    },
    runAll() {
      for (const entry of scheduled.splice(0)) {
        if (!entry.cleared) entry.fn();
      }
    },
    pendingCount() {
      return scheduled.filter((e) => !e.cleared).length;
    }
  };
}

function resetObservers() {
  FakeMutationObserver.instances = [];
}

describe("waitForElement", () => {
  it("resolves immediately for an existing element without creating an observer", async () => {
    resetObservers();
    const element = { id: "present" };
    const result = await waitForElement("#present", {
      observerClass: FakeMutationObserver,
      querySelector: () => element
    });
    assert.equal(result, element);
    assert.equal(FakeMutationObserver.instances.length, 0);
  });

  it("resolves on a later mutation and disconnects the observer", async () => {
    resetObservers();
    const element = { id: "late" };
    const root = { querySelector: () => null };
    const pending = waitForElement("#late", {
      root,
      observerClass: FakeMutationObserver
    });
    const observer = FakeMutationObserver.instances.at(-1);
    assert.ok(observer, "observer created for missing element");
    assert.equal(observer.disconnected, false);

    root.querySelector = () => element;
    observer.emit([{ addedNodes: [element] }]);

    assert.equal(await pending, element);
    assert.equal(observer.disconnected, true);
  });

  it("skips the existing-element check when includeExisting is false", async () => {
    resetObservers();
    const element = { id: "fresh" };
    let queryCalls = 0;
    const root = {
      querySelector: () => {
        queryCalls += 1;
        return element;
      }
    };
    const pending = waitForElement("#fresh", {
      root,
      includeExisting: false,
      observerClass: FakeMutationObserver
    });
    assert.equal(queryCalls, 0, "no query before first mutation");
    const observer = FakeMutationObserver.instances.at(-1);
    observer.emit([{}]);
    assert.equal(await pending, element);
  });

  it("rejects with TimeoutError and disconnects when the element never appears", async () => {
    resetObservers();
    const timers = createFakeTimers();
    const root = { querySelector: () => null };
    const pending = waitForElement("#never", {
      root,
      timeoutMs: 500,
      observerClass: FakeMutationObserver,
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    const rejection = assert.rejects(pending, TimeoutError);
    const observer = FakeMutationObserver.instances.at(-1);
    timers.runAll();
    await rejection;
    assert.equal(observer.disconnected, true, "observer disconnected on timeout");
  });

  it("rejects when no MutationObserver implementation exists", async () => {
    resetObservers();
    await assert.rejects(
      waitForElement("#anything", {
        observerClass: null,
        querySelector: () => null
      }),
      /no MutationObserver implementation/
    );
  });

  it("clears the pending timeout once resolved", async () => {
    resetObservers();
    const timers = createFakeTimers();
    const element = { id: "quick" };
    const pending = waitForElement("#quick", {
      timeoutMs: 1000,
      observerClass: FakeMutationObserver,
      querySelector: () => element,
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    await pending;
    assert.equal(timers.pendingCount(), 0, "timeout cleared after resolve");
  });
});

describe("observeOnce", () => {
  it("fires once on a matching batch and disconnects", () => {
    resetObservers();
    const seen = [];
    const observer = observeOnce(
      {},
      { childList: true, subtree: true },
      (muts) => muts.length > 0,
      (muts) => seen.push(muts),
      { observerClass: FakeMutationObserver }
    );
    observer.emit([{ type: "childList" }]);
    assert.equal(seen.length, 1);
    assert.equal(observer.disconnected, true, "disconnected after match");
    observer.emit([{ type: "childList" }]);
    assert.equal(seen.length, 1, "no second callback after disconnect");
  });

  it("ignores non-matching batches and stays connected", () => {
    resetObservers();
    const seen = [];
    const observer = observeOnce(
      {},
      { childList: true },
      (muts) => muts.some((m) => m.type === "attributes"),
      (muts) => seen.push(muts),
      { observerClass: FakeMutationObserver }
    );
    observer.emit([{ type: "childList" }]);
    assert.equal(seen.length, 0);
    assert.equal(observer.disconnected, false, "still observing");
    observer.emit([{ type: "attributes" }]);
    assert.equal(seen.length, 1);
    assert.equal(observer.disconnected, true);
  });

  it("disconnects silently on timeout without firing", () => {
    resetObservers();
    const timers = createFakeTimers();
    const seen = [];
    const observer = observeOnce(
      {},
      { childList: true },
      () => true,
      (muts) => seen.push(muts),
      {
        timeoutMs: 250,
        observerClass: FakeMutationObserver,
        setTimeoutFn: timers.setTimeoutFn,
        clearTimeoutFn: timers.clearTimeoutFn
      }
    );
    timers.runAll();
    assert.equal(seen.length, 0);
    assert.equal(observer.disconnected, true);
  });

  it("returns null when no MutationObserver implementation exists", () => {
    const observer = observeOnce(
      {},
      { childList: true },
      () => true,
      () => {},
      { observerClass: null }
    );
    assert.equal(observer, null);
  });
});

describe("waitForCondition", () => {
  const stubRoot = {};

  it("resolves immediately when the condition already holds", async () => {
    resetObservers();
    const value = { ready: true };
    const result = await waitForCondition(() => value, { root: stubRoot, observerClass: FakeMutationObserver });
    assert.equal(result, value);
    assert.equal(FakeMutationObserver.instances.length, 0);
  });

  it("resolves on a later mutation and disconnects", async () => {
    resetObservers();
    let value = null;
    const pending = waitForCondition(() => value, { root: stubRoot, observerClass: FakeMutationObserver });
    const observer = FakeMutationObserver.instances.at(-1);
    assert.ok(observer, "observer created while condition unmet");
    observer.emit([{}]);
    assert.equal(observer.disconnected, false, "still waiting when condition unmet");
    value = { ready: true };
    observer.emit([{}]);
    assert.equal(await pending, value);
    assert.equal(observer.disconnected, true);
  });

  it("rejects with TimeoutError and disconnects when the condition never holds", async () => {
    resetObservers();
    const timers = createFakeTimers();
    const pending = waitForCondition(() => null, {
      root: stubRoot,
      timeoutMs: 400,
      observerClass: FakeMutationObserver,
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    const rejection = assert.rejects(pending, TimeoutError);
    const observer = FakeMutationObserver.instances.at(-1);
    timers.runAll();
    await rejection;
    assert.equal(observer.disconnected, true);
  });

  it("rejects when no MutationObserver implementation exists", async () => {
    resetObservers();
    await assert.rejects(
      waitForCondition(() => null, { observerClass: null }),
      /no MutationObserver implementation/
    );
  });

  it("skips mutation re-checks after settling", async () => {
    resetObservers();
    let value = null;
    const pending = waitForCondition(() => value, { root: stubRoot, observerClass: FakeMutationObserver });
    const observer = FakeMutationObserver.instances.at(-1);
    value = { ready: true };
    observer.emit([{}]);
    await pending;
    value = null;
    observer.emit([{}]);
    assert.equal(observer.disconnected, true, "no callback after disconnect");
  });
});

describe("debounce", () => {
  it("collapses a burst into one trailing call", () => {
    const timers = createFakeTimers();
    const calls = [];
    const debounced = debounce((x) => calls.push(x), 100, {
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    debounced(1);
    debounced(2);
    debounced(3);
    assert.deepEqual(calls, []);
    timers.runAll();
    assert.deepEqual(calls, [3]);
  });

  it("cancel drops the pending call", () => {
    const timers = createFakeTimers();
    const calls = [];
    const debounced = debounce((x) => calls.push(x), 100, {
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    debounced(1);
    debounced.cancel();
    timers.runAll();
    assert.deepEqual(calls, []);
  });

  it("separates bursts across windows", () => {
    const timers = createFakeTimers();
    const calls = [];
    const debounced = debounce((x) => calls.push(x), 50, {
      setTimeoutFn: timers.setTimeoutFn,
      clearTimeoutFn: timers.clearTimeoutFn
    });
    debounced("a");
    timers.runAll();
    debounced("b");
    timers.runAll();
    assert.deepEqual(calls, ["a", "b"]);
  });
});
