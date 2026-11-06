import { describe, expect, it, vi } from "vitest";

import {
  isMovieInfoEnabled,
  onMovieInfoChanged,
  setMovieInfoEnabled,
  type PrefStorage
} from "../../src/lib/movie-info-pref";
import { LS_KEYS } from "../../src/lib/btfw-constants.js";

function createMemoryStorage(seed: { [key: string]: string } = {}): PrefStorage {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => { map.set(key, value); }
  };
}

const throwingStorage: PrefStorage = {
  getItem: () => { throw new Error("SecurityError"); },
  setItem: () => { throw new Error("QuotaExceededError"); }
};

describe("isMovieInfoEnabled", () => {
  it("is off when the viewer never set it", () => {
    expect(isMovieInfoEnabled(createMemoryStorage())).toBe(false);
  });

  it("is on only for the stored value '1'", () => {
    expect(isMovieInfoEnabled(createMemoryStorage({ [LS_KEYS.movieInfoEnabled]: "1" }))).toBe(true);
    expect(isMovieInfoEnabled(createMemoryStorage({ [LS_KEYS.movieInfoEnabled]: "0" }))).toBe(false);
    expect(isMovieInfoEnabled(createMemoryStorage({ [LS_KEYS.movieInfoEnabled]: "true" }))).toBe(false);
  });

  it("is off when storage is unavailable", () => {
    expect(isMovieInfoEnabled(throwingStorage)).toBe(false);
  });
});

describe("setMovieInfoEnabled", () => {
  it("persists the choice so the next read sees it", () => {
    const storage = createMemoryStorage();
    setMovieInfoEnabled(true, { storage, target: new EventTarget() });
    expect(isMovieInfoEnabled(storage)).toBe(true);
  });

  it("notifies subscribers with the new value", () => {
    const target = new EventTarget();
    const listener = vi.fn();
    onMovieInfoChanged(listener, target);
    setMovieInfoEnabled(true, { storage: createMemoryStorage(), target });
    expect(listener).toHaveBeenCalledWith(true);
  });

  it("still notifies when storage throws, so the current page updates", () => {
    const target = new EventTarget();
    const listener = vi.fn();
    onMovieInfoChanged(listener, target);
    setMovieInfoEnabled(false, { storage: throwingStorage, target });
    expect(listener).toHaveBeenCalledWith(false);
  });
});

describe("onMovieInfoChanged", () => {
  it("stops notifying after unsubscribe", () => {
    const target = new EventTarget();
    const listener = vi.fn();
    const unsubscribe = onMovieInfoChanged(listener, target);
    unsubscribe();
    setMovieInfoEnabled(true, { storage: createMemoryStorage(), target });
    expect(listener).not.toHaveBeenCalled();
  });
});
