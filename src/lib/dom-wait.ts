/**
 * Shared DOM lifecycle helpers (#203).
 *
 * Replaces ad-hoc setInterval/setTimeout retry loops and bare MutationObserver
 * wiring across feature modules with three primitives:
 *
 * - waitForElement: resolve (or reject on timeout) once a selector matches.
 *   MutationObserver-based; no polling.
 * - observeOnce: run a callback on the first matching mutation batch, then
 *   disconnect automatically — one-shot observers never leak.
 * - debounce: trailing debounce shared by observer callbacks.
 *
 * MutationObserver and the root/query surface are injectable so tests can run
 * these helpers without a real DOM.
 */

export interface WaitOptions {
  /** Subtree root to observe. Default: document. */
  root?: ParentNode | null;
  /** Reject with a TimeoutError after this many ms. Default: no timeout. */
  timeoutMs?: number;
  /** Elements present at call time resolve immediately (default true). */
  includeExisting?: boolean;
  /** Observer constructor override (tests). Default: globalThis.MutationObserver. */
  observerClass?: MutationObserverConstructor | null;
  /** Query override (tests). Default: root.querySelector / document.querySelector. */
  querySelector?: ((selector: string) => Element | null) | null;
  /** Timer override (tests). Default: globalThis.setTimeout. */
  setTimeoutFn?: (fn: () => void, ms: number) => number;
  /** Timer-clear override (tests). Default: globalThis.clearTimeout. */
  clearTimeoutFn?: (handle: number) => void;
}

export interface ObserveOnceOptions {
  /** Reject with a TimeoutError after this many ms. Default: no timeout. */
  timeoutMs?: number;
  /** Observer constructor override (tests). Default: globalThis.MutationObserver. */
  observerClass?: MutationObserverConstructor | null;
  /** Timer overrides (tests). */
  setTimeoutFn?: (fn: () => void, ms: number) => number;
  clearTimeoutFn?: (handle: number) => void;
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

type MutationObserverConstructor = {
  new (callback: (mutations: MutationRecord[], observer: MutationObserver) => void): MutationObserver;
};

interface MinimalMutationObserver {
  observe(target: Node, options?: MutationObserverInit): void;
  disconnect(): void;
}

function defaultObserverClass(): MutationObserverConstructor | null {
  const ctor = (globalThis as Record<string, unknown>).MutationObserver;
  return typeof ctor === "function" ? (ctor as MutationObserverConstructor) : null;
}

function defaultTimers() {
  const g = globalThis as {
    setTimeout?: (fn: () => void, ms: number) => number;
    clearTimeout?: (handle: number) => void;
  };
  return {
    setTimeoutFn: g.setTimeout ?? null,
    clearTimeoutFn: g.clearTimeout ?? null,
  };
}

function resolveQuery(
  root: ParentNode | null | undefined,
  override: WaitOptions["querySelector"]
): (selector: string) => Element | null {
  if (override) return override;
  const scope = (root ?? (globalThis as { document?: Document }).document) as {
    querySelector?: (selector: string) => Element | null;
  } | null;
  if (scope && typeof scope.querySelector === "function") {
    return (selector) => scope.querySelector!(selector);
  }
  return () => null;
}

function safeDisconnect(observer: MinimalMutationObserver | null): void {
  if (!observer) return;
  try {
    observer.disconnect();
  } catch (_) {
    /* observer already torn down */
  }
}

/**
 * Resolve with the first element matching `selector`, observing `root`'s
 * subtree with a MutationObserver instead of polling. The observer is
 * disconnected on resolve, timeout, and error — never left attached.
 */
export function waitForElement(selector: string, options: WaitOptions = {}): Promise<Element> {
  const {
    root = null,
    timeoutMs,
    includeExisting = true,
    observerClass,
  } = options;

  return new Promise<Element>((resolve, reject) => {
    const observerCtor = observerClass !== undefined ? observerClass : defaultObserverClass();
    const query = resolveQuery(root, options.querySelector);
    const globalTimers = defaultTimers();
    const setTimeoutFn = options.setTimeoutFn ?? globalTimers.setTimeoutFn;
    const clearTimeoutFn = options.clearTimeoutFn ?? globalTimers.clearTimeoutFn;

    let observer: MinimalMutationObserver | null = null;
    let timeoutHandle: unknown = null;
    let settled = false;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      safeDisconnect(observer);
      observer = null;
      if (timeoutHandle !== null && clearTimeoutFn) {
        clearTimeoutFn(timeoutHandle as number);
        timeoutHandle = null;
      }
      fn();
    };

    const settleWith = (element: Element) => {
      finish(() => resolve(element));
    };

    const settleError = (error: unknown) => {
      finish(() => reject(error));
    };

    const startTimeout = () => {
      if (typeof timeoutMs !== "number" || !setTimeoutFn || !clearTimeoutFn) return;
      timeoutHandle = setTimeoutFn(() => {
        settleError(new TimeoutError(`waitForElement: "${selector}" not found within ${timeoutMs}ms`));
      }, timeoutMs);
    };

    if (includeExisting) {
      const existing = query(selector);
      if (existing) {
        settleWith(existing);
        return;
      }
    }

    if (!observerCtor) {
      settleError(new Error("waitForElement: no MutationObserver implementation available"));
      return;
    }

    observer = new observerCtor(() => {
      const found = query(selector);
      if (found) settleWith(found);
    });

    const observeRoot = root ?? (globalThis as { document?: Document }).document;
    if (!observeRoot) {
      settleError(new Error("waitForElement: no root available to observe"));
      return;
    }

    observer.observe(observeRoot, { childList: true, subtree: true });
    startTimeout();
  });
}

/**
 * Observe `target` until `predicate` sees a mutation batch it accepts, invoke
 * `onMatch`, and disconnect. The observer cannot outlive its match — one-shot
 * by construction. Returns the observer so callers may disconnect early.
 */
export function observeOnce(
  target: Node,
  init: MutationObserverInit,
  predicate: (mutations: MutationRecord[]) => boolean,
  onMatch: (mutations: MutationRecord[]) => void,
  options: ObserveOnceOptions = {}
): MutationObserver | null {
  const observerCtor = options.observerClass !== undefined
    ? options.observerClass
    : defaultObserverClass();

  if (!observerCtor) return null;

  const globalTimers = defaultTimers();
  const setTimeoutFn = options.setTimeoutFn ?? globalTimers.setTimeoutFn;
  const clearTimeoutFn = options.clearTimeoutFn ?? globalTimers.clearTimeoutFn;
  let timeoutHandle: unknown = null;
  let settled = false;

  const observer = new observerCtor((mutations) => {
    if (settled) return;
    if (!predicate(mutations)) return;
    settled = true;
    if (timeoutHandle !== null && clearTimeoutFn) {
      clearTimeoutFn(timeoutHandle as number);
      timeoutHandle = null;
    }
    safeDisconnect(observer);
    onMatch(mutations);
  });

  if (typeof options.timeoutMs === "number" && setTimeoutFn && clearTimeoutFn) {
    timeoutHandle = setTimeoutFn(() => {
      if (settled) return;
      settled = true;
      safeDisconnect(observer);
    }, options.timeoutMs);
  }

  observer.observe(target, init);
  return observer;
}

export interface DebouncedFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  waitMs: number,
  timers?: { setTimeoutFn?: (fn: () => void, ms: number) => number; clearTimeoutFn?: (handle: number) => void }
): DebouncedFunction<TArgs> {
  const { setTimeoutFn, clearTimeoutFn } = timers ?? {};
  const schedule = setTimeoutFn ?? ((g: { setTimeout?: typeof setTimeout }) => g.setTimeout)(globalThis as { setTimeout?: typeof setTimeout });
  const clear = clearTimeoutFn ?? ((g: { clearTimeout?: typeof clearTimeout }) => g.clearTimeout)(globalThis as { clearTimeout?: typeof clearTimeout });
  if (!schedule || !clear) {
    throw new Error("debounce: no timer implementation available");
  }

  let handle: number | null = null;

  const debounced = (...args: TArgs) => {
    if (handle !== null) clear(handle);
    handle = schedule(() => {
      handle = null;
      fn(...args);
    }, waitMs);
  };

  debounced.cancel = () => {
    if (handle !== null) {
      clear(handle);
      handle = null;
    }
  };

  return debounced;
}

export interface WaitConditionOptions {
  /** Subtree root to observe. Default: document. */
  root?: ParentNode | null;
  /** Reject with a TimeoutError after this many ms. Default: no timeout. */
  timeoutMs?: number;
  /** Observer constructor override (tests). Default: globalThis.MutationObserver. */
  observerClass?: MutationObserverConstructor | null;
  /** Timer overrides (tests). */
  setTimeoutFn?: (fn: () => void, ms: number) => number;
  clearTimeoutFn?: (handle: number) => void;
}

/**
 * Resolve once `condition` returns a truthy value, re-checking after each
 * mutation in `root`'s subtree. For waits that cannot be expressed as a
 * CSS selector (e.g. a JS global finally existing). The observer is
 * disconnected on resolve, timeout, and error — never left attached.
 */
export function waitForCondition<T>(
  condition: () => T | null | undefined | false,
  options: WaitConditionOptions = {}
): Promise<T> {
  const { root = null, timeoutMs, observerClass } = options;

  return new Promise<T>((resolve, reject) => {
    const observerCtor = observerClass !== undefined ? observerClass : defaultObserverClass();
    const globalTimers = defaultTimers();
    const setTimeoutFn = options.setTimeoutFn ?? globalTimers.setTimeoutFn;
    const clearTimeoutFn = options.clearTimeoutFn ?? globalTimers.clearTimeoutFn;

    let observer: MinimalMutationObserver | null = null;
    let timeoutHandle: unknown = null;
    let settled = false;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      safeDisconnect(observer);
      observer = null;
      if (timeoutHandle !== null && clearTimeoutFn) {
        clearTimeoutFn(timeoutHandle as number);
        timeoutHandle = null;
      }
      fn();
    };

    const startTimeout = () => {
      if (typeof timeoutMs !== "number" || !setTimeoutFn || !clearTimeoutFn) return;
      timeoutHandle = setTimeoutFn(() => {
        finish(() => reject(new TimeoutError("waitForCondition: condition not met within timeout")));
      }, timeoutMs);
    };

    const initial = condition();
    if (initial) {
      finish(() => resolve(initial));
      return;
    }

    if (!observerCtor) {
      finish(() => reject(new Error("waitForCondition: no MutationObserver implementation available")));
      return;
    }

    const observeRoot = root ?? (globalThis as { document?: Document }).document;
    if (!observeRoot) {
      finish(() => reject(new Error("waitForCondition: no root available to observe")));
      return;
    }

    observer = new observerCtor(() => {
      const value = condition();
      if (value) finish(() => resolve(value));
    });

    observer.observe(observeRoot, { childList: true, subtree: true, attributes: true });
    startTimeout();
  });
}