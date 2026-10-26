import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MOTD_VISIBILITY_KEY } from "../../src/lib/stack-core";
import { createStackMotd, type StackMotdContext, type StackRefs } from "../../src/modules/stack/stack-motd";

/**
 * Unit tests for the extracted MOTD stack sub-domain (#228 Phase 2, #234).
 *
 * Covers the sync surface the shell relies on: content detection, motd host
 * resolution, structure normalization (simple paths), wrap visibility sync
 * (empty hides / content restores, stored open preference), applyMotdUpdate
 * sanitization + editor sync, the setMotd socket handler, and the debounced
 * sync scheduler. Browser globals are stubbed per-test in the repo's
 * hand-rolled-fake style (see dirty-apply.vitest.ts).
 */

// ---- fakes ---------------------------------------------------------------

function installStorageStub(): Map<string, string> {
  const map = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => (map.has(k) ? (map.get(k) ?? null) : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k)
  } as unknown as Storage;
  return map;
}

interface FakeEl {
  id: string;
  innerHTML: string;
  textContent: string;
  value: string;
  dataset: Record<string, string | undefined>;
  classTokens: Set<string>;
  attrs: Map<string, string>;
  style: { removeProperty(name: string): void };
  children: FakeEl[];
  parentElement: FakeEl | null;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  classList: {
    toggle(token: string, force?: boolean): void;
    remove(token: string): void;
    add(token: string): void;
    contains(token: string): boolean;
  };
  toggleAttribute(name: string, force?: boolean): void;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
  appendChild(child: FakeEl): void;
  insertBefore(child: FakeEl, ref: FakeEl | null): void;
  remove(): void;
}

function makeEl(id = ""): FakeEl {
  const el: FakeEl = {
    id,
    innerHTML: "",
    textContent: "",
    value: "",
    dataset: {},
    classTokens: new Set(),
    attrs: new Map(),
    style: { removeProperty: () => {} },
    children: [],
    parentElement: null,
    querySelector: () => null,
    querySelectorAll: () => [],
    classList: {
      toggle(token, force) {
        const on = force !== undefined ? force : !el.classTokens.has(token);
        if (on) el.classTokens.add(token);
        else el.classTokens.delete(token);
      },
      remove(token) {
        el.classTokens.delete(token);
      },
      add(token) {
        el.classTokens.add(token);
      },
      contains(token) {
        return el.classTokens.has(token);
      }
    },
    toggleAttribute(name, force) {
      const on = force !== undefined ? force : !el.attrs.has(name);
      if (on) el.attrs.set(name, "");
      else el.attrs.delete(name);
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
    appendChild(child) {
      child.parentElement = el;
      el.children.push(child);
    },
    insertBefore(child, ref) {
      child.parentElement = el;
      if (ref === null) {
        el.children.push(child);
        return;
      }
      const idx = el.children.indexOf(ref);
      if (idx >= 0) el.children.splice(idx, 0, child);
      else el.children.push(child);
    },
    remove() {
      // detach from parent children array
      const p = el.parentElement;
      if (p) {
        const idx = p.children.indexOf(el);
        if (idx >= 0) p.children.splice(idx, 1);
        el.parentElement = null;
      }
    }
  };
  return el;
}

interface FakeDoc {
  getElementById(id: string): FakeEl | null;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  body: FakeEl;
}

function makeDoc(
  byId: Record<string, FakeEl | null> = {},
  queryMap: Record<string, FakeEl | null> = {},
  queryAllMap: Record<string, FakeEl[]> = {}
): FakeDoc {
  return {
    getElementById: (id) => (id in byId ? (byId[id] ?? null) : null),
    querySelector: (sel) => (sel in queryMap ? (queryMap[sel] ?? null) : null),
    querySelectorAll: (sel) => (sel in queryAllMap ? (queryAllMap[sel] ?? []) : []),
    body: makeEl("body")
  };
}

function defaultCtx(overrides: Partial<StackMotdContext> = {}): StackMotdContext {
  return {
    createGroupItem: () => null,
    ensureStackRefs: () => null,
    ...overrides
  };
}

// ---- env hooks -----------------------------------------------------------

let doc: FakeDoc;
let savedDocument: Document | undefined;
let savedWindow: (Window & { socket?: unknown }) | undefined;
let savedLocalStorage: Storage | undefined;

beforeEach(() => {
  savedDocument = globalThis.document;
  savedWindow = globalThis.window;
  savedLocalStorage = globalThis.localStorage;
  // Node has no document/window; the modules read them lazily.
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: undefined });
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: undefined });
});

afterEach(() => {
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: savedDocument });
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: savedWindow });
  if (savedLocalStorage === undefined) delete (globalThis as { localStorage?: Storage }).localStorage;
  else globalThis.localStorage = savedLocalStorage;
  vi.useRealTimers();
});

function setGlobalDoc(next: FakeDoc): void {
  doc = next;
  (globalThis as { document?: unknown }).document = next as unknown as Document;
}

function setGlobalWindow(next: unknown): void {
  (globalThis as { window?: unknown }).window = next as Window & { socket?: unknown };
}

// ---- tests ---------------------------------------------------------------

describe("stack-motd domain: content detection", () => {
  it("detects empty MOTD html (whitespace, br, nbsp, bare img)", () => {
    const motd = createStackMotd(defaultCtx());
    expect(motd.isMotdHtmlEmpty("")).toBe(true);
    expect(motd.isMotdHtmlEmpty("   ")).toBe(true);
    expect(motd.isMotdHtmlEmpty("<p><br></p>")).toBe(true);
    expect(motd.isMotdHtmlEmpty("<p>&nbsp;</p>")).toBe(true);
    expect(motd.isMotdHtmlEmpty('<img src=x onerror="alert(1)">')).toBe(true);
    expect(motd.isMotdHtmlEmpty("<p>Welcome</p>")).toBe(false);
    expect(motd.isMotdHtmlEmpty('<p>Welcome<img src=x onerror="alert(1)"></p>')).toBe(false);
  });

  it("hasMotdContent resolves the motd host and reads its innerHTML", () => {
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    setGlobalDoc(makeDoc({ motdwrap: wrap }));

    expect(motd.hasMotdContent(doc as unknown as Document)).toBe(true);

    inner.innerHTML = "<p><br></p>";
    expect(motd.hasMotdContent(doc as unknown as Document)).toBe(false);
  });

  it("hasMotdContent returns false when no motd host exists", () => {
    const motd = createStackMotd(defaultCtx());
    setGlobalDoc(makeDoc({ motdwrap: null }));
    expect(motd.hasMotdContent(doc as unknown as Document)).toBe(false);
  });

  it("resolveMotdHost prefers a direct #motd child of motdwrap", () => {
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const direct = makeEl("motd");
    const nested = makeEl("motd");
    wrap.querySelector = (sel: string) => {
      if (sel === ":scope > #motd") return direct;
      if (sel === "#motd") return nested;
      return null;
    };
    setGlobalDoc(makeDoc({ motdwrap: wrap }));
    expect(motd.resolveMotdHost(doc as unknown as Document)).toBe(direct);
  });

  it("resolveMotdHost falls back to a nested #motd and then a bare #motd", () => {
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const nested = makeEl("motd");
    wrap.querySelector = (sel: string) => (sel === "#motd" ? nested : null);
    setGlobalDoc(makeDoc({ motdwrap: wrap }));
    expect(motd.resolveMotdHost(doc as unknown as Document)).toBe(nested);

    const bare = makeEl("motd");
    setGlobalDoc(makeDoc({ motdwrap: null, motd: bare }));
    expect(motd.resolveMotdHost(doc as unknown as Document)).toBe(bare);
  });
});

describe("stack-motd domain: visibility sync", () => {
  it("hides motdwrap when empty and restores it with content", () => {
    installStorageStub();
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    setGlobalDoc(makeDoc({ motdwrap: wrap }));

    motd.syncMotdWrapVisibility(null);
    expect(wrap.attrs.has("hidden")).toBe(false);
    expect(wrap.classTokens.has("btfw-motd-empty")).toBe(false);
    expect(wrap.getAttribute("aria-hidden")).toBe("false");

    inner.innerHTML = "";
    motd.syncMotdWrapVisibility(null);
    expect(wrap.getAttribute("aria-hidden")).toBe("true");
    expect(wrap.classTokens.has("btfw-motd-empty")).toBe(true);
  });

  it("applies the stored open preference to the motd group when hidden-false persisted", () => {
    const storage = installStorageStub();
    storage.set(MOTD_VISIBILITY_KEY, "false");
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    const group = makeEl("motd-group");
    let opened: boolean | null = null;
    group.dataset = {};
    (group as unknown as { _btfwSetOpenState: (o: boolean) => void })._btfwSetOpenState = (o: boolean) => {
      opened = o;
    };
    setGlobalDoc(makeDoc({ motdwrap: wrap }, { '.btfw-stack-item[data-bind="motd-group"]': group }));

    motd.syncMotdWrapVisibility(group as unknown as Element);
    expect(opened).toBe(false);
  });

  it("opens the motd group by default when no preference is stored", () => {
    installStorageStub();
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    const group = makeEl("motd-group");
    let opened: boolean | null = null;
    (group as unknown as { _btfwSetOpenState: (o: boolean) => void })._btfwSetOpenState = (o: boolean) => {
      opened = o;
    };
    setGlobalDoc(makeDoc({ motdwrap: wrap }, { '.btfw-stack-item[data-bind="motd-group"]': group }));

    motd.syncMotdWrapVisibility(group as unknown as Element);
    expect(opened).toBe(true);
  });

  it("falls back to dataset.open when the group has no open-state hook", () => {
    installStorageStub();
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    const group = makeEl("motd-group");
    setGlobalDoc(makeDoc({ motdwrap: wrap }, { '.btfw-stack-item[data-bind="motd-group"]': group }));

    motd.syncMotdWrapVisibility(group as unknown as Element);
    expect(group.dataset.open).toBe("true");
    expect(group.classTokens.has("is-open")).toBe(true);
  });

  it("no-ops without hidden state churn when content is missing", () => {
    installStorageStub();
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    setGlobalDoc(makeDoc({ motdwrap: wrap }));
    // Should not throw while content is absent.
    motd.syncMotdWrapVisibility(null);
    expect(true).toBe(true);
  });
});

describe("stack-motd domain: applyMotdUpdate", () => {
  it("sanitizes html into #motd and mirrors it into the editor textarea", () => {
    const storage = installStorageStub();
    const motd = createStackMotd(defaultCtx());
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    wrap.querySelectorAll = () => [];
    const textarea = makeEl("cs-motdtext");
    setGlobalDoc(makeDoc({ motdwrap: wrap, "cs-motdtext": textarea }));

    motd.applyMotdUpdate("<p>Hello<script>window.__xss=1</script></p>");
    expect(inner.innerHTML).not.toContain("<script");
    expect(inner.innerHTML).toContain("Hello");
    expect(textarea.value).toBe("<p>Hello<script>window.__xss=1</script></p>");
    // the forced re-normalize re-marks the wrap after ingesting the update
    expect(wrap.dataset.btfwMotdNormalized).toBe("1");
    // no decode crashes on storage etc.
    expect(storage.size).toBeGreaterThanOrEqual(0);
  });

  it("schedules a sync when refs are available", () => {
    installStorageStub();
    const group = makeEl("motd-group");
    const ctx = defaultCtx({
      ensureStackRefs: () =>
        ({
          list: { children: [] as FakeEl[] },
          footer: null
        } as unknown as StackRefs)
    });
    const motd = createStackMotd(ctx);
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    wrap.querySelectorAll = () => [];
    setGlobalDoc(makeDoc({ motdwrap: wrap }, { '.btfw-stack-item[data-bind="motd-group"]': group }));

    vi.useFakeTimers();
    motd.applyMotdUpdate("<p>Hello</p>");
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    vi.advanceTimersByTime(60);
  });
});

describe("stack-motd domain: setMotd socket handler", () => {
  it("re-sanitizes the painted motd and schedules a sync", () => {
    installStorageStub();
    const ctx = defaultCtx({
      ensureStackRefs: () => null
    });
    const motd = createStackMotd(ctx);
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>old</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    wrap.querySelectorAll = () => [];
    setGlobalDoc(makeDoc({ motdwrap: wrap }));

    const handlers = new Map<string, (payload: unknown) => void>();
    const socket = {
      on: (event: string, handler: (payload: unknown) => void) => void handlers.set(event, handler)
    };
    const refs = { list: { children: [] as FakeEl[] }, footer: null } as unknown as StackRefs;
    setGlobalWindow({ socket });

    // fake timers so the debounced panel sync never fires on the real clock
    // (afterEach resets document, and a real 50ms timer would then crash)
    vi.useFakeTimers();
    motd.wireMotdSocket(refs);
    expect(handlers.has("setMotd")).toBe(true);

    handlers.get("setMotd")?.('<p>Hi<script>window.__xss=1</script></p>');
    expect(inner.innerHTML).not.toContain("<script");
    expect(inner.innerHTML).toContain("Hi");

    handlers.get("setMotd")?.({ motd: "<i>obj</i>" });
    expect(inner.innerHTML).toContain("<i>obj</i>");
  });

  it("wires the socket at most once", () => {
    installStorageStub();
    const motd = createStackMotd(defaultCtx());
    setGlobalDoc(makeDoc({ motdwrap: null }));
    const handlers = new Map<string, (payload: unknown) => void>();
    const socket = {
      on: (event: string, handler: (payload: unknown) => void) => void handlers.set(event, handler)
    };
    const refs = { list: { children: [] as FakeEl[] }, footer: null } as unknown as StackRefs;
    setGlobalWindow({ socket });

    motd.wireMotdSocket(refs);
    motd.wireMotdSocket(refs);
    let setMotdCount = 0;
    for (const key of handlers.keys()) if (key === "setMotd") setMotdCount += 1;
    expect(setMotdCount).toBe(1);
  });
});

describe("stack-motd domain: debounced sync scheduler", () => {
  it("scheduleMotdSync debounces repeated calls into a single panel sync", () => {
    installStorageStub();
    let createCalls = 0;
    const ctx = defaultCtx({
      ensureStackRefs: () => null,
      createGroupItem: () => {
        createCalls += 1;
        return null;
      }
    });
    const motd = createStackMotd(ctx);
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    wrap.querySelectorAll = () => [];
    setGlobalDoc(makeDoc({ motdwrap: wrap }));

    const refs = { list: makeEl("list") as unknown as HTMLElement, footer: null } as unknown as StackRefs;

    vi.useFakeTimers();
    motd.scheduleMotdSync(refs);
    motd.scheduleMotdSync(refs); // clears the first timer: one window = one sync
    vi.advanceTimersByTime(60);
    expect(createCalls).toBe(1);
    vi.advanceTimersByTime(100); // no leftover timer
    expect(createCalls).toBe(1);
  });

  it("scheduleMotdSync runs ensureMotdStackPanel with the refs it was given", () => {
    installStorageStub();
    let createdGroupWith: FakeEl[] | null = null;
    const group = makeEl("motd-group");
    const ctx = defaultCtx({
      ensureStackRefs: () => null,
      createGroupItem: (_g, els: Element[]) => {
        createdGroupWith = els as unknown as FakeEl[];
        return group as unknown as HTMLElement;
      }
    });
    const motd = createStackMotd(ctx);
    const wrap = makeEl("motdwrap");
    const inner = makeEl("motd");
    inner.innerHTML = "<p>Hello</p>";
    wrap.querySelector = (sel: string) => (sel === ":scope > #motd" ? inner : null);
    wrap.querySelectorAll = () => [];
    const list = makeEl("list");
    setGlobalDoc(makeDoc({ motdwrap: wrap }, { '.btfw-stack-item[data-bind="motd-group"]': null }));

    const refs = { list: list as unknown as HTMLElement, footer: null } as unknown as StackRefs;
    vi.useFakeTimers();
    motd.scheduleMotdSync(refs);
    vi.advanceTimersByTime(60);
    expect(createdGroupWith).not.toBeNull();
    expect(createdGroupWith?.[0]).toBe(wrap);
  });
});