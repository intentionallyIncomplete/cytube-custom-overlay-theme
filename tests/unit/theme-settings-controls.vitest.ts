import { describe, expect, it } from "vitest";

import { createDirtyApplyController } from "../../src/lib/dirty-apply";
import { LS_KEYS } from "../../src/lib/btfw-constants.js";
import {
  isMovieInfoEnabled,
  setMovieInfoEnabled,
  type PrefStorage
} from "../../src/lib/movie-info-pref";
import {
  readMovieInfoToggle,
  writeMovieInfoToggle,
  type QueryRoot
} from "../../src/lib/theme-settings-controls";

interface FakeEl {
  id: string;
  hidden: boolean;
  disabled: boolean;
  checked: boolean;
  dataset: Record<string, string | undefined>;
  attrs: Map<string, string>;
  listeners: Map<string, Set<(event: { target: FakeEl }) => void>>;
  parent: FakeEl | null;
  contains(other: FakeEl): boolean;
  closest(selector: string): FakeEl | null;
  querySelector(selector: string): FakeEl | null;
  addEventListener(
    type: string,
    listener: (event: { target: FakeEl }) => void,
    options?: { signal?: AbortSignal }
  ): void;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
  hasAttribute(name: string): boolean;
}

function createFakeEl(id = ""): FakeEl {
  const el: FakeEl = {
    id,
    hidden: false,
    disabled: false,
    checked: false,
    dataset: {},
    attrs: new Map(),
    listeners: new Map(),
    parent: null,
    contains(other) {
      return other === el;
    },
    closest(selector) {
      if (selector.startsWith("#") && el.id === selector.slice(1)) return el;
      return el.parent ? el.parent.closest(selector) : null;
    },
    querySelector(selector) {
      if (selector === "#btfw-movie-info-enabled" && el.id === "btfw-theme-modal") {
        return checkbox;
      }
      return null;
    },
    addEventListener(type, listener, options) {
      if (!el.listeners.has(type)) el.listeners.set(type, new Set());
      el.listeners.get(type)?.add(listener);
      options?.signal?.addEventListener("abort", () => {
        el.listeners.get(type)?.delete(listener);
      });
    },
    setAttribute(name, value) {
      el.attrs.set(name, value);
    },
    getAttribute(name) {
      return el.attrs.has(name) ? (el.attrs.get(name) ?? null) : null;
    },
    removeAttribute(name) {
      el.attrs.delete(name);
    },
    hasAttribute(name) {
      return el.attrs.has(name);
    }
  };
  return el;
}

const checkbox = createFakeEl("btfw-movie-info-enabled");

function memoryStorage(seed: Record<string, string> = {}): PrefStorage {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    }
  };
}

describe("movie info toggle in theme settings", () => {
  it("reads and restores the Show movie info header checkbox", () => {
    const modal = createFakeEl("btfw-theme-modal");
    checkbox.checked = true;
    expect(readMovieInfoToggle(modal as unknown as QueryRoot)).toBe(true);

    writeMovieInfoToggle(modal as unknown as QueryRoot, false);
    expect(checkbox.checked).toBe(false);
    expect(readMovieInfoToggle(modal as unknown as QueryRoot)).toBe(false);
  });

  it("surfaces Apply when the checkbox changes and saves that value on Apply", async () => {
    const modal = createFakeEl("btfw-theme-modal");
    const applyButton = createFakeEl("btfw-ts-apply");
    checkbox.checked = false;
    const storage = memoryStorage({ [LS_KEYS.movieInfoEnabled]: "0" });

    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: applyButton as unknown as HTMLButtonElement,
      sections: [
        {
          id: "theme-settings",
          snapshot: () => JSON.stringify({
            movieInfo: readMovieInfoToggle(modal as unknown as QueryRoot)
          }),
          restore: (raw: string) => {
            const data = JSON.parse(raw) as { movieInfo?: boolean };
            if (typeof data.movieInfo === "boolean") {
              writeMovieInfoToggle(modal as unknown as QueryRoot, data.movieInfo);
            }
          },
          apply: () => {
            setMovieInfoEnabled(readMovieInfoToggle(modal as unknown as QueryRoot), {
              storage,
              target: new EventTarget()
            });
            return { ok: true };
          }
        }
      ]
    });

    expect(applyButton.hidden).toBe(true);

    checkbox.checked = true;
    modal.listeners.get("change")?.forEach((listener) => {
      listener({ target: checkbox });
    });
    await Promise.resolve();

    expect(controller.isDirty()).toBe(true);
    expect(applyButton.hidden).toBe(false);

    const result = await controller.applyAll();
    expect(result).toEqual({ ok: true });
    expect(isMovieInfoEnabled(storage)).toBe(true);
    expect(applyButton.hidden).toBe(true);

    controller.dispose();
  });
});
