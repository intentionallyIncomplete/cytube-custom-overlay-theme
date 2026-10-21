import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getJsonItem,
  safeGetItem,
  safeRemoveItem,
  safeSetItem,
  setJsonItem,
  storageAvailable
} from "../../src/lib/storage";

/** Minimal localStorage shape the wrapper touches. */
function makeStub(overrides: Partial<Storage> = {}): Storage {
  const base = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(() => undefined),
    removeItem: vi.fn(() => undefined),
    clear: vi.fn(() => undefined),
    key: vi.fn(() => null),
    length: 0
  };
  return { ...base, ...overrides } as Storage;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("safeGetItem", () => {
  it("returns the stored value", () => {
    vi.stubGlobal("localStorage", makeStub({ getItem: () => "on" }));
    expect(safeGetItem("k")).toBe("on");
  });

  it("returns fallback when key is missing", () => {
    vi.stubGlobal("localStorage", makeStub());
    expect(safeGetItem("k", "1")).toBe("1");
  });

  it("returns fallback when storage throws", () => {
    vi.stubGlobal(
      "localStorage",
      makeStub({
        getItem: () => {
          throw new Error("SecurityError: blocked");
        }
      })
    );
    expect(safeGetItem("k", "0")).toBe("0");
  });
});

describe("safeSetItem", () => {
  it("returns true on successful write", () => {
    const stub = makeStub();
    vi.stubGlobal("localStorage", stub);
    expect(safeSetItem("k", "v")).toBe(true);
    expect(stub.setItem).toHaveBeenCalledWith("k", "v");
  });

  it("returns false on quota errors instead of throwing", () => {
    vi.stubGlobal(
      "localStorage",
      makeStub({
        setItem: () => {
          throw new DOMException("quota exceeded", "QuotaExceededError");
        }
      })
    );
    expect(() => safeSetItem("k", "v")).not.toThrow();
    expect(safeSetItem("k", "v")).toBe(false);
  });
});

describe("safeRemoveItem", () => {
  it("returns true on success and false when storage throws", () => {
    vi.stubGlobal("localStorage", makeStub());
    expect(safeRemoveItem("k")).toBe(true);
    vi.stubGlobal(
      "localStorage",
      makeStub({
        removeItem: () => {
          throw new Error("SecurityError: blocked");
        }
      })
    );
    expect(safeRemoveItem("k")).toBe(false);
  });
});

describe("getJsonItem", () => {
  it("parses stored JSON", () => {
    vi.stubGlobal("localStorage", makeStub({ getItem: () => '{"a":2}' }));
    expect(getJsonItem<{ a: number }>("k", { a: 0 })).toEqual({ a: 2 });
  });

  it("returns fallback when missing", () => {
    vi.stubGlobal("localStorage", makeStub());
    expect(getJsonItem("k", [])).toEqual([]);
  });

  it("returns fallback on corrupt JSON instead of throwing", () => {
    vi.stubGlobal("localStorage", makeStub({ getItem: () => "{not json" }));
    expect(getJsonItem("k", { ok: true })).toEqual({ ok: true });
  });

  it("returns fallback when storage throws", () => {
    vi.stubGlobal(
      "localStorage",
      makeStub({
        getItem: () => {
          throw new Error("SecurityError: blocked");
        }
      })
    );
    expect(getJsonItem("k", "fb")).toBe("fb");
  });
});

describe("setJsonItem", () => {
  it("serializes to JSON on write", () => {
    const stub = makeStub();
    vi.stubGlobal("localStorage", stub);
    expect(setJsonItem("k", { a: 1 })).toBe(true);
    expect(stub.setItem).toHaveBeenCalledWith("k", '{"a":1}');
  });

  it("returns false on quota errors instead of throwing", () => {
    vi.stubGlobal(
      "localStorage",
      makeStub({
        setItem: () => {
          throw new DOMException("quota exceeded", "QuotaExceededError");
        }
      })
    );
    expect(setJsonItem("k", { a: 1 })).toBe(false);
  });
});

describe("storageAvailable", () => {
  it("reports true when reads succeed", () => {
    vi.stubGlobal("localStorage", makeStub());
    expect(storageAvailable()).toBe(true);
  });

  it("reports false when storage access throws", () => {
    vi.stubGlobal(
      "localStorage",
      makeStub({
        getItem: () => {
          throw new Error("SecurityError: blocked");
        }
      })
    );
    expect(storageAvailable()).toBe(false);
  });
});
