import { describe, expect, it, vi } from "vitest";

import {
  createDirtyApplyController,
  eventTargetIsInsideIgnoredRoot,
  isPersistFailure,
  isPersistSuccess,
  setApplyButtonVisible,
  type DirtySection,
  type PersistResult
} from "../../src/lib/dirty-apply";

interface FakeEl {
  hidden: boolean;
  disabled: boolean;
  dataset: Record<string, string | undefined>;
  attrs: Map<string, string>;
  listeners: Map<string, Set<(event: FakeEvent) => void>>;
  children: FakeEl[];
  id: string;
  className: string;
  textContent: string;
  value: string;
  parent: FakeEl | null;
  contains(other: FakeEl): boolean;
  closest(selector: string): FakeEl | null;
  querySelector(selector: string): FakeEl | null;
  addEventListener(
    type: string,
    listener: (event: FakeEvent) => void,
    options?: { signal?: AbortSignal; capture?: boolean }
  ): void;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
  hasAttribute(name: string): boolean;
}

interface FakeEvent {
  target: FakeEl;
  bubbles?: boolean;
}

function createFakeEl(id = ""): FakeEl {
  const el: FakeEl = {
    hidden: false,
    disabled: false,
    dataset: {},
    attrs: new Map(),
    listeners: new Map(),
    children: [],
    id,
    className: "",
    textContent: "",
    value: "",
    parent: null,
    contains(other: FakeEl): boolean {
      if (other === el) return true;
      return el.children.some((child) => child.contains(other));
    },
    closest(selector: string): FakeEl | null {
      if (selector.startsWith("#") && el.id === selector.slice(1)) return el;
      if (selector.startsWith(".") && el.className.split(/\s+/).includes(selector.slice(1))) {
        return el;
      }
      return el.parent ? el.parent.closest(selector) : null;
    },
    querySelector(selector: string): FakeEl | null {
      if (selector.startsWith("#")) {
        const want = selector.slice(1);
        const walk = (node: FakeEl): FakeEl | null => {
          if (node.id === want) return node;
          for (const child of node.children) {
            const hit = walk(child);
            if (hit) return hit;
          }
          return null;
        };
        return walk(el);
      }
      return null;
    },
    addEventListener(type, listener, options): void {
      if (!el.listeners.has(type)) el.listeners.set(type, new Set());
      el.listeners.get(type)?.add(listener);
      options?.signal?.addEventListener("abort", () => {
        el.listeners.get(type)?.delete(listener);
      });
    },
    setAttribute(name, value): void {
      el.attrs.set(name, value);
    },
    getAttribute(name): string | null {
      return el.attrs.has(name) ? (el.attrs.get(name) ?? null) : null;
    },
    removeAttribute(name): void {
      el.attrs.delete(name);
    },
    hasAttribute(name): boolean {
      return el.attrs.has(name);
    }
  };
  return el;
}

function append(parent: FakeEl, child: FakeEl): void {
  child.parent = parent;
  parent.children.push(child);
}

function createSection(
  id: string,
  initial: string,
  applyResult: PersistResult = { ok: true }
): DirtySection & { value: string; applyCalls: number } {
  const state = { value: initial, applyCalls: 0 };
  return {
    id,
    get value(): string {
      return state.value;
    },
    set value(next: string) {
      state.value = next;
    },
    get applyCalls(): number {
      return state.applyCalls;
    },
    snapshot(): string {
      return state.value;
    },
    restore(snapshot: string): void {
      state.value = snapshot;
    },
    apply(): PersistResult {
      state.applyCalls += 1;
      return applyResult;
    }
  };
}

describe("dirty-apply helpers", () => {
  it("classifies persist results", () => {
    expect(isPersistSuccess({ ok: true })).toBe(true);
    expect(isPersistFailure({ ok: false, error: "x" })).toBe(true);
    expect(isPersistSuccess({ ok: false, error: "x" })).toBe(false);
  });

  it("toggles Apply visibility with hidden + aria-hidden", () => {
    const button = createFakeEl("apply") as unknown as HTMLButtonElement;
    Object.defineProperty(button, "hidden", {
      configurable: true,
      writable: true,
      value: false
    });
    setApplyButtonVisible(button, false);
    expect(button.hidden).toBe(true);
    expect(button.getAttribute("aria-hidden")).toBe("true");
    expect(button.getAttribute("tabindex")).toBe("-1");

    setApplyButtonVisible(button, true);
    expect(button.hidden).toBe(false);
    expect(button.hasAttribute("aria-hidden")).toBe(false);
    expect(button.hasAttribute("tabindex")).toBe(false);
  });

  it("detects ignored auto-save roots", () => {
    const modal = createFakeEl("modal");
    const autosave = createFakeEl("cs-general");
    const input = createFakeEl("cs-box");
    input.className = "cs-checkbox";
    append(autosave, input);
    append(modal, autosave);

    const tracked = createFakeEl("cs-motdtext");
    append(modal, tracked);

    expect(
      eventTargetIsInsideIgnoredRoot(
        input as unknown as EventTarget,
        modal as unknown as HTMLElement,
        ["#cs-general", ".cs-checkbox"]
      )
    ).toBe(true);
    expect(
      eventTargetIsInsideIgnoredRoot(
        tracked as unknown as EventTarget,
        modal as unknown as HTMLElement,
        ["#cs-general"]
      )
    ).toBe(false);
  });
});

describe("createDirtyApplyController", () => {
  it("hides Apply until a section diverges from baseline", async () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    const section = createSection("a", "one");
    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section]
    });

    expect(button.hidden).toBe(true);
    expect(controller.isDirty()).toBe(false);

    section.value = "two";
    controller.recalculate();
    expect(controller.isDirty()).toBe(true);
    expect(button.hidden).toBe(false);

    const result = await controller.applyAll();
    expect(result).toEqual({ ok: true });
    expect(section.applyCalls).toBe(1);
    expect(button.hidden).toBe(true);

    controller.dispose();
  });

  it("does not mark dirty for events inside ignoreRoots", async () => {
    const modal = createFakeEl("modal");
    const ignore = createFakeEl("cs-generalsettings");
    const ignoredInput = createFakeEl("ignored");
    append(ignore, ignoredInput);
    append(modal, ignore);

    const tracked = createFakeEl("cs-motdtext");
    tracked.value = "";
    append(modal, tracked);

    const button = createFakeEl("apply");
    const section: DirtySection = {
      id: "motd",
      snapshot: (): string => tracked.value,
      restore: (s: string): void => {
        tracked.value = s;
      },
      apply: (): PersistResult => ({ ok: true })
    };

    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section],
      ignoreRoots: ["#cs-generalsettings"]
    });

    const ignoreListeners = modal.listeners.get("input");
    ignoreListeners?.forEach((listener) => {
      listener({ target: ignoredInput });
    });
    await Promise.resolve();
    expect(controller.isDirty()).toBe(false);

    tracked.value = "hello motd";
    ignoreListeners?.forEach((listener) => {
      listener({ target: tracked });
    });
    await vi.waitFor(() => {
      expect(controller.isDirty()).toBe(true);
      expect(button.hidden).toBe(false);
    });

    controller.dispose();
  });

  it("continues applyAll after a section failure", async () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    const okSection = createSection("ok", "a");
    const badSection = createSection("bad", "b", { ok: false, error: "boom" });

    const status = createFakeEl("status");
    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [okSection, badSection],
      statusEl: status as unknown as HTMLElement
    });

    okSection.value = "a2";
    badSection.value = "b2";
    controller.recalculate();

    const result = await controller.applyAll();
    expect(isPersistFailure(result)).toBe(true);
    expect(okSection.applyCalls).toBe(1);
    expect(badSection.applyCalls).toBe(1);
    expect(controller.isDirty()).toBe(true);
    expect(status.textContent).toContain("boom");

    controller.dispose();
  });

  it("tryClose restores baseline when confirmed", async () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    const section = createSection("a", "base");

    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section],
      confirmDiscard: () => true
    });
    section.value = "edited";
    controller.recalculate();
    expect(controller.isDirty()).toBe(true);

    const closed = await controller.tryClose();
    expect(closed).toBe(true);
    expect(section.value).toBe("base");
    expect(controller.isDirty()).toBe(false);

    controller.dispose();
  });

  it("tryClose waits for an in-flight applyAll before checking dirty state", async () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    let value = "base";
    const deferred: { resolve: (() => void) | null } = { resolve: null };
    const section: DirtySection = {
      id: "a",
      snapshot: (): string => value,
      restore: (s: string): void => {
        value = s;
      },
      apply: (): Promise<PersistResult> =>
        new Promise((resolve) => {
          deferred.resolve = () => resolve({ ok: true });
        })
    };
    const confirmDiscard = vi.fn(() => true);

    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section],
      confirmDiscard
    });

    value = "edited";
    controller.recalculate();
    expect(controller.isDirty()).toBe(true);

    const applyPromise = controller.applyAll();
    expect(controller.isApplying()).toBe(true);

    // User closes the modal while the Apply call is still in flight.
    const closePromise = controller.tryClose();
    deferred.resolve?.();
    await applyPromise;
    const closed = await closePromise;

    expect(closed).toBe(true);
    expect(confirmDiscard).not.toHaveBeenCalled();
    expect(controller.isDirty()).toBe(false);

    controller.dispose();
  });

  it("discard restores without prompting", () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    const section = createSection("a", "base");
    const confirmDiscard = vi.fn(() => true);

    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section],
      confirmDiscard
    });
    section.value = "edited";
    controller.recalculate();
    expect(controller.isDirty()).toBe(true);

    controller.discard();
    expect(confirmDiscard).not.toHaveBeenCalled();
    expect(section.value).toBe("base");
    expect(controller.isDirty()).toBe(false);

    controller.dispose();
  });

  it("markDirty forces dirty even when snapshot matches", () => {
    const modal = createFakeEl("modal");
    const button = createFakeEl("apply");
    const section = createSection("a", "same");
    const controller = createDirtyApplyController({
      modal: modal as unknown as HTMLElement,
      applyButton: button as unknown as HTMLButtonElement,
      sections: [section]
    });

    controller.markDirty("a");
    controller.recalculate();
    expect(controller.isDirty()).toBe(true);
    expect(button.hidden).toBe(false);

    controller.dispose();
  });
});
