/**
 * Safe localStorage wrapper — the only sanctioned direct-storage seam (#202).
 *
 * Every access is try/catch-guarded: disabled/blocked storage (private
 * browsing), quota-exceeded writes, and JSON parse failures all degrade to
 * fallback values instead of throwing. Reads the storage off `globalThis` so
 * the same code path serves browsers (`window.localStorage`) and unit tests
 * (stubbed globals). Feature modules import this directly; the runtime
 * `util:storage` module re-exports it under the registry.
 */

/** True when localStorage reads work at all (blocked storage → false). */
export function storageAvailable(): boolean {
  try {
    globalThis.localStorage.getItem("__btfw_probe__");
    return true;
  } catch {
    return false;
  }
}

/** Get a raw string. Returns `fallback` when missing or storage throws. */
export function safeGetItem(key: string, fallback: string | null = null): string | null {
  try {
    const value = globalThis.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

/** Set a raw string. Returns false instead of throwing on quota/blocked storage. */
export function safeSetItem(key: string, value: string): boolean {
  try {
    globalThis.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Remove a key. Returns false instead of throwing on blocked storage. */
export function safeRemoveItem(key: string): boolean {
  try {
    globalThis.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/** Get a JSON value. Returns `fallback` when missing, corrupt, or storage throws. */
export function getJsonItem<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Set a JSON value. Returns false instead of throwing on quota/blocked storage. */
export function setJsonItem(key: string, value: unknown): boolean {
  try {
    globalThis.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
