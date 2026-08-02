import { EventEmitter } from "node:events";

import { describe, expect, it, vi } from "vitest";

import {
  applyChatTextPx,
  applyEmoteSize,
  applyMediaScale,
  applyStoredChatTypography,
  clampMediaScale,
  emoteSizeToPercent,
  MEDIA_SCALE_DEFAULT,
  normalizeEmoteSizeName
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
  it("maps emote size names to chat-width percent", () => {
    expect(emoteSizeToPercent("small")).toBe(30);
    expect(emoteSizeToPercent("big")).toBe(90);
    expect(emoteSizeToPercent("medium")).toBe(60);
    expect(emoteSizeToPercent("unknown")).toBe(60);
    expect(emoteSizeToPercent("sm")).toBe(30);
    expect(emoteSizeToPercent("lg")).toBe(90);
    expect(normalizeEmoteSizeName("md")).toBe("medium");
  });

  it("sets and clamps chat text CSS var on #chatwrap", () => {
    const doc = createFakeDocument();
    applyChatTextPx(18, doc);
    const wrap = doc.querySelector("#chatwrap") as unknown as { style: StyleBag };
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("18px");

    applyChatTextPx(99, doc);
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("20px");
  });

  it("dispatches emote size change event with percent vars", () => {
    const doc = createFakeDocument();
    const spy = vi.fn();
    doc.addEventListener(EVENTS.chatEmoteSizeChanged, spy);

    const pct = applyEmoteSize("big", doc);
    expect(pct).toBe(90);
    const rootStyle = (doc.documentElement as unknown as { style: StyleBag }).style;
    expect(rootStyle.getPropertyValue("--btfw-emote-size-pct")).toBe("90");
    expect(rootStyle.getPropertyValue("--btfw-emote-size")).toBe("90%");
    expect(spy).toHaveBeenCalledOnce();
  });

  it("clamps and applies media scale percent", () => {
    expect(clampMediaScale(80)).toBe(80);
    expect(clampMediaScale(37)).toBe(40);
    expect(clampMediaScale(103)).toBe(100);
    expect(clampMediaScale("not-a-number")).toBe(MEDIA_SCALE_DEFAULT);

    const doc = createFakeDocument();
    const spy = vi.fn();
    doc.addEventListener(EVENTS.chatMediaScaleChanged, spy);
    expect(applyMediaScale(65, doc)).toBe(65);
    expect(
      (doc.documentElement as unknown as { style: StyleBag }).style.getPropertyValue(
        "--btfw-chat-media-scale"
      )
    ).toBe("65%");
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
    store.set(LS_KEYS.mediaScale, "70");

    const doc = createFakeDocument();
    applyStoredChatTypography(doc);
    const wrap = doc.querySelector("#chatwrap") as unknown as { style: StyleBag };
    const rootStyle = (doc.documentElement as unknown as { style: StyleBag }).style;
    expect(wrap.style.getPropertyValue("--btfw-chat-text")).toBe("16px");
    expect(rootStyle.getPropertyValue("--btfw-emote-size")).toBe("30%");
    expect(rootStyle.getPropertyValue("--btfw-emote-size-pct")).toBe("30");
    expect(rootStyle.getPropertyValue("--btfw-chat-media-scale")).toBe("70%");

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
