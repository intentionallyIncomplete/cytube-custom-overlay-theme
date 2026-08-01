import { EventEmitter } from "node:events";

import { describe, expect, it, vi } from "vitest";

import {
  applyChatTextPx,
  applyEmoteSize,
  applyStoredChatTypography,
  emoteSizeToPx
} from "../../src/lib/apply-chat-typography";
import { wireDeferredFeatureOpen } from "../../src/lib/defer-feature-open";
import { EVENTS, LS_KEYS } from "../../src/lib/btfw-constants.js";

interface StyleBag {
  setProperty(name: string, value: string): void;
  getPropertyValue(name: string): string;
}

function createStyleBag(): StyleBag {
  const props = new Map<string, string>();
  return {
    setProperty(name: string, value: string): void {
      props.set(name, value);
    },
    getPropertyValue(name: string): string {
      return props.get(name) ?? "";
    }
  };
}

function createFakeDocument(): Document {
  const emitter = new EventEmitter();
  const chatwrap = { style: createStyleBag() };
  const documentElement = { style: createStyleBag() };

  const doc = {
    documentElement,
    querySelector(selector: string): unknown {
      if (selector === "#chatwrap") return chatwrap;
      return null;
    },
    addEventListener(
      type: string,
      listener: (...args: unknown[]) => void,
      _options?: unknown
    ): void {
      emitter.on(type, listener);
    },
    removeEventListener(
      type: string,
      listener: (...args: unknown[]) => void,
      _options?: unknown
    ): void {
      emitter.off(type, listener);
    },
    dispatchEvent(event: Event): boolean {
      emitter.emit(event.type, event);
      return true;
    }
  };

  return doc as unknown as Document;
}

describe("apply-chat-typography", () => {
  it("maps emote size names to px", () => {
    expect(emoteSizeToPx("small")).toBe(100);
    expect(emoteSizeToPx("big")).toBe(170);
    expect(emoteSizeToPx("medium")).toBe(130);
    expect(emoteSizeToPx("unknown")).toBe(130);
  });

  it("sets and clamps chat text CSS var on #chatwrap", () => {
    const doc = createFakeDocument();
    applyChatTextPx(18, doc);
    const wrap = doc.querySelector("#chatwrap") as unknown as { style: StyleBag };
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("18px");

    applyChatTextPx(99, doc);
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("20px");
  });

  it("dispatches emote size change event", () => {
    const doc = createFakeDocument();
    const spy = vi.fn();
    doc.addEventListener(EVENTS.chatEmoteSizeChanged, spy);

    const px = applyEmoteSize("big", doc);
    expect(px).toBe(170);
    expect(
      (doc.documentElement as unknown as { style: StyleBag }).style.getPropertyValue(
        "--btfw-emote-size"
      )
    ).toBe("170px");
    expect(spy).toHaveBeenCalledOnce();
  });

  it("reads stored values from localStorage", () => {
    const store = new Map<string, string>();
    const original = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string): string | null => store.get(key) ?? null,
        setItem: (key: string, value: string): void => {
          store.set(key, value);
        },
        removeItem: (key: string): void => {
          store.delete(key);
        }
      }
    });

    store.set(LS_KEYS.chatTextPx, "16");
    store.set(LS_KEYS.emoteSize, "small");

    const doc = createFakeDocument();
    applyStoredChatTypography(doc);
    const wrap = doc.querySelector("#chatwrap") as unknown as { style: StyleBag };
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("16px");
    expect(
      (doc.documentElement as unknown as { style: StyleBag }).style.getPropertyValue(
        "--btfw-emote-size"
      )
    ).toBe("100px");

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: original
    });
  });
});

describe("wireDeferredFeatureOpen", () => {
  it("inits module and opens on custom event", async () => {
    const open = vi.fn();
    const init = vi.fn(async () => ({ open }));
    const doc = createFakeDocument();

    const dispose = wireDeferredFeatureOpen({
      moduleName: "feature:gifs",
      init,
      openEvent: "btfw:test-open-gifs",
      doc
    });

    doc.dispatchEvent(new Event("btfw:test-open-gifs"));
    await vi.waitFor(() => {
      expect(init).toHaveBeenCalledWith("feature:gifs");
      expect(open).toHaveBeenCalledOnce();
    });

    dispose();
  });

  it("inits module and opens on matching click", async () => {
    const open = vi.fn();
    const init = vi.fn(async () => ({ open }));
    const doc = createFakeDocument();
    const btn = {
      id: "btfw-btn-gif",
      closest(sel: string): unknown {
        return sel.includes("btfw-btn-gif") ? this : null;
      }
    };

    const dispose = wireDeferredFeatureOpen({
      moduleName: "feature:gifs",
      init,
      clickSelector: "#btfw-btn-gif",
      doc
    });

    const event = new Event("click");
    Object.defineProperty(event, "target", { value: btn });
    Object.defineProperty(event, "preventDefault", { value: vi.fn() });
    doc.dispatchEvent(event);

    await vi.waitFor(() => {
      expect(init).toHaveBeenCalledWith("feature:gifs");
      expect(open).toHaveBeenCalledOnce();
    });

    dispose();
  });
});
