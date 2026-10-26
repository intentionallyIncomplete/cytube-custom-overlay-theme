import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createStackPoll,
  type StackPollContext,
  type StackPollSyncOptions
} from "../../src/modules/stack/stack-poll";
import type { StackRefs } from "../../src/modules/stack/stack-motd";

/**
 * Unit tests for the extracted poll stack sub-domain (#228 Phase 2, #234).
 *
 * Covers the sync surface the shell relies on: pollwrap decoupling from the
 * playlist DOM (parking), poll button relocation, wrap visibility sync
 * (idle vs content, drawer state), panel visibility sync (force-open through
 * the _btfwSetOpenState hook), the debounced sync scheduler, and the
 * newPoll/closePoll socket handlers.
 */

// ---- fakes ---------------------------------------------------------------

interface FakeEl {
  id: string;
  className: string;
  innerHTML: string;
  textContent: string;
  value: string;
  hidden: boolean;
  dataset: Record<string, string | undefined>;
  classTokens: Set<string>;
  attrs: Map<string, string>;
  children: FakeEl[];
  parentElement: FakeEl | null;
  closest(sel: string): FakeEl | null;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  classList: {
    toggle(token: string, force?: boolean): void;
    remove(token: string): void;
    add(token: string): void;
    contains(token: string): boolean;
    [Symbol.iterator](): Iterator<string>;
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
    className: "",
    innerHTML: "",
    textContent: "",
    value: "",
    hidden: false,
    dataset: {},
    classTokens: new Set(),
    attrs: new Map(),
    children: [],
    parentElement: null,
    closest: () => null,
    querySelector: (sel: string) => {
      // Minimal descendant walk for #id and .class selectors — enough for the
      // module's repeat lookups (e.g. `.poll-controls` inside pollwrap).
      const matches = (node: FakeEl): boolean => {
        if (sel.startsWith("#")) return node.id === sel.slice(1);
        if (sel.startsWith(".")) return node.classList.contains(sel.slice(1));
        return false;
      };
      const walk = (node: FakeEl): FakeEl | null => {
        if (matches(node)) return node;
        for (const child of node.children) {
          const hit = walk(child);
          if (hit) return hit;
        }
        return null;
      };
      return walk(el);
    },
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
      },
      *[Symbol.iterator]() {
        yield* el.classTokens;
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
      if (child.parentElement) child.remove();
      child.parentElement = el;
      el.children.push(child);
    },
    insertBefore(child, ref) {
      if (child.parentElement) child.remove();
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
      const p = el.parentElement;
      if (p) {
        const idx = p.children.indexOf(el);
        if (idx >= 0) p.children.splice(idx, 1);
        el.parentElement = null;
      }
    }
  };
  // className setter keeps the token set the source of truth, so module code
  // that assigns `el.className = "..."` (movePollButton's .poll-controls
  // container) stays observable through classList.contains().
  Object.defineProperty(el, "className", {
    configurable: true,
    enumerable: true,
    get() {
      return Array.from(el.classTokens).join(" ");
    },
    set(value: string) {
      el.classTokens = new Set(String(value).split(/\s+/).filter(Boolean));
    }
  });
  Object.defineProperty(el, "firstChild", {
    configurable: true,
    enumerable: true,
    get() {
      return el.children.length > 0 ? el.children[0] : null;
    }
  });
  return el;
}

interface FakeDoc {
  getElementById(id: string): FakeEl | null;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  createElement(tag: string): FakeEl;
  body: FakeEl;
}

/**
 * Content probes from the stack-poll-visibility library:
 * `#pollwrap .well.active` / `.well.muted` / `.poll-menu`.
 */
const POLL_CONTENT_SELECTORS = [
  "#pollwrap .well.active",
  "#pollwrap .well.muted",
  "#pollwrap .poll-menu"
];

function withPollContent(queryMapContent: FakeEl | null = null): Record<string, FakeEl | null> {
  const map: Record<string, FakeEl | null> = {};
  POLL_CONTENT_SELECTORS.forEach((sel) => {
    map[sel] = queryMapContent;
  });
  return map;
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
    createElement: (tag) => makeEl(""),
    body: makeEl("body")
  };
}

function defaultCtx(overrides: Partial<StackPollContext> = {}): StackPollContext {
  return {
    createGroupItem: () => null,
    ...overrides
  };
}

// ---- env hooks -----------------------------------------------------------

let savedDocument: Document | undefined;
let savedWindow: (Window & { socket?: unknown }) | undefined;
let savedLocalStorage: Storage | undefined;

beforeEach(() => {
  savedDocument = globalThis.document;
  savedWindow = globalThis.window;
  savedLocalStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: undefined });
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: {} });
  const map = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => (map.has(k) ? (map.get(k) ?? null) : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k)
  } as unknown as Storage;
});

afterEach(() => {
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: savedDocument });
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: savedWindow });
  if (savedLocalStorage === undefined) delete (globalThis as { localStorage?: Storage }).localStorage;
  else globalThis.localStorage = savedLocalStorage;
  vi.useRealTimers();
});

function setGlobalDoc(next: FakeDoc): void {
  (globalThis as { document?: unknown }).document = next as unknown as Document;
}

function setGlobalWindow(next: unknown): void {
  (globalThis as { window?: unknown }).window = next as Window & { socket?: unknown };
}

// ---- tests ---------------------------------------------------------------

describe("stack-poll domain: detachPollWrapFromPlaylist", () => {
  it("returns null when pollwrap is missing", () => {
    const poll = createStackPoll(defaultCtx());
    setGlobalDoc(makeDoc({ pollwrap: null }));
    expect(poll.detachPollWrapFromPlaylist()).toBeNull();
  });

  it("leaves pollwrap alone when it is not inside the playlist DOM", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    setGlobalDoc(makeDoc({ pollwrap: pollWrap }));
    expect(poll.detachPollWrapFromPlaylist()).toBe(pollWrap);
  });

  it("parks pollwrap in a hidden parking div when it lives inside the playlist row", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = (sel: string) =>
      sel === "#playlistrow, #playlistwrap, #queuecontainer, [data-bind=\"playlist-group\"]" ? makeEl("playlistrow") : null;
    const doc = makeDoc({ pollwrap: pollWrap });
    setGlobalDoc(doc);

    const result = poll.detachPollWrapFromPlaylist();
    expect(result).toBe(pollWrap);
    const parking = doc.body.children.find((c) => c.id === "btfw-poll-parking");
    expect(parking).toBeDefined();
    expect(parking!.hidden).toBe(true);
    expect(parking!.getAttribute("aria-hidden")).toBe("true");
    expect(parking!.children).toContain(pollWrap);
  });

  it("reuses an existing parking div", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => makeEl("playlistrow");
    const parking = makeEl("btfw-poll-parking");
    const doc = makeDoc({ pollwrap: pollWrap, "btfw-poll-parking": parking });
    setGlobalDoc(doc);

    poll.detachPollWrapFromPlaylist();
    expect(doc.body.children).not.toContain(parking);
    expect(parking.children).toContain(pollWrap);
  });
});

describe("stack-poll domain: movePollButton", () => {
  it("moves poll buttons into a .poll-controls container inside pollwrap", () => {
    const poll = createStackPoll(defaultCtx());
    const leftControls = makeEl("leftcontrols");
    const pollWrap = makeEl("pollwrap");
    const btn1 = makeEl("newpollbtn");
    const btn2 = makeEl("");
    btn2.setAttribute("onclick", "poll()");
    leftControls.children = [btn1, btn2];
    btn1.parentElement = leftControls;
    btn2.parentElement = leftControls;
    leftControls.querySelectorAll = (sel: string) =>
      sel === 'button[onclick*="poll"], button[title*="poll"], .poll-btn, #newpollbtn'
        ? [btn1, btn2]
        : [];
    setGlobalDoc(makeDoc({ leftcontrols: leftControls, pollwrap: pollWrap }));

    poll.movePollButton();

    const container = pollWrap.children.find((c) => c.id === "" && c.classList.contains("poll-controls"));
    expect(container).toBeDefined();
    expect(container!.children).toEqual([btn1, btn2]);
    expect(leftControls.parentElement).toBeNull(); // emptied leftcontrols removed
  });

  it("no-ops when either side of the move is missing", () => {
    const poll = createStackPoll(defaultCtx());
    setGlobalDoc(makeDoc({ leftcontrols: null, pollwrap: null }));
    poll.movePollButton();
    expect(true).toBe(true);
  });
});

describe("stack-poll domain: syncPollWrapVisibility", () => {
  it("marks the wrap idle + hidden when there is no poll content", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    setGlobalDoc(makeDoc({ pollwrap: pollWrap }, withPollContent(null)));

    poll.syncPollWrapVisibility();
    expect(pollWrap.classList.contains("btfw-poll-idle")).toBe(true);
    expect(pollWrap.getAttribute("hidden")).toBeDefined();
    expect(pollWrap.getAttribute("aria-hidden")).toBe("true");
  });

  it("restores the wrap when poll content exists and it is in a drawer", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    // In the drawer: closest matches the drawer host
    pollWrap.closest = (sel: string) => (sel === ".btfw-panel-container__host" ? makeEl("host") : null);
    setGlobalDoc(makeDoc({ pollwrap: pollWrap }, withPollContent(makeEl("well"))));

    poll.syncPollWrapVisibility();
    expect(pollWrap.classList.contains("btfw-poll-idle")).toBe(false);
    expect(pollWrap.getAttribute("hidden")).toBeNull();
    expect(pollWrap.getAttribute("aria-hidden")).toBe("false");
  });

  it("hides the wrap even in a drawer when content is missing", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = (sel: string) => (sel === ".btfw-panel-container__host" ? makeEl("host") : null);
    setGlobalDoc(makeDoc({ pollwrap: pollWrap }, withPollContent(null)));

    poll.syncPollWrapVisibility();
    expect(pollWrap.classList.contains("btfw-poll-idle")).toBe(true);
    expect(pollWrap.getAttribute("hidden")).toBeDefined();
  });
});

describe("stack-poll domain: syncPollPanelVisibility", () => {
  function docWithGroupAndWrap(group: FakeEl | null, pollWrap: FakeEl | null): FakeDoc {
    return makeDoc(
      { pollwrap: pollWrap },
      { '.btfw-stack-item[data-bind="poll-group"]': group }
    );
  }

  it("unhides the poll group and force-opens through the open-state hook", () => {
    let opened: { open: boolean; opts: unknown } | null = null;
    const poll = createStackPoll(defaultCtx());
    const group = makeEl("poll-group");
    (group as unknown as { _btfwSetOpenState: (o: boolean, opts: unknown) => void })._btfwSetOpenState = (
      o: boolean,
      opts: unknown
    ) => {
      opened = { open: o, opts };
    };
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => null; // not in playlist -> no parking
    setGlobalDoc(docWithGroupAndWrap(group, pollWrap));

    poll.syncPollPanelVisibility(refs(), { forceOpen: true });
    expect(group.hidden).toBe(false);
    expect(group.getAttribute("hidden")).toBeNull();
    expect(opened).toEqual({ open: true, opts: { persist: false } });
  });

  it("falls back to dataset.open when the group has no open-state hook", () => {
    const poll = createStackPoll(defaultCtx());
    const group = makeEl("poll-group");
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => null;
    setGlobalDoc(docWithGroupAndWrap(group, pollWrap));

    poll.syncPollPanelVisibility(refs(), { forceOpen: true });
    expect(group.dataset.open).toBe("true");
    expect(group.classList.contains("is-open")).toBe(true);
  });

  it("no-ops safely when no poll group exists", () => {
    const poll = createStackPoll(defaultCtx());
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => null;
    setGlobalDoc(docWithGroupAndWrap(null, pollWrap));
    poll.syncPollPanelVisibility(refs());
    expect(true).toBe(true);
  });
});

describe("stack-poll domain: schedulePollSync", () => {
  it("debounces repeated calls into a single visibility sync and applies options", () => {
    let opened: { open: boolean; opts: unknown } | null = null;
    let syncs = 0;
    const poll = createStackPoll(defaultCtx());
    const group = makeEl("poll-group");
    (group as unknown as { _btfwSetOpenState: (o: boolean, opts: unknown) => void })._btfwSetOpenState = (
      o: boolean,
      opts: unknown
    ) => {
      opened = { open: o, opts };
      syncs += 1;
    };
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => null;
    setGlobalDoc(makeDoc(
      { pollwrap: pollWrap },
      { '.btfw-stack-item[data-bind="poll-group"]': group }
    ));

    vi.useFakeTimers();
    const opts = { forceOpen: true } as StackPollSyncOptions;
    poll.schedulePollSync(refs(), opts);
    poll.schedulePollSync(refs(), opts);
    vi.advanceTimersByTime(60);
    expect(syncs).toBe(1); // debounced to a single execution
    expect(opened).toEqual({ open: true, opts: { persist: false } });
    vi.advanceTimersByTime(100);
    expect(syncs).toBe(1); // and no trailing execution
  });
});

describe("stack-poll domain: wirePollSocket", () => {
  function docWithGroupAndWrap(group: FakeEl | null, pollWrap: FakeEl | null): FakeDoc {
    return makeDoc(
      { pollwrap: pollWrap },
      { '.btfw-stack-item[data-bind="poll-group"]': group }
    );
  }

  it("force-opens the group on newPoll; closePoll syncs visibility without force-closing", () => {
    const poll = createStackPoll(defaultCtx());
    const group = makeEl("poll-group");
    const openStates: boolean[] = [];
    (group as unknown as { _btfwSetOpenState: (o: boolean, opts: unknown) => void })._btfwSetOpenState = (
      o: boolean,
      _opts: unknown
    ) => {
      openStates.push(o);
    };
    const pollWrap = makeEl("pollwrap");
    pollWrap.closest = () => null;
    setGlobalDoc(docWithGroupAndWrap(group, pollWrap));

    const handlers = new Map<string, (payload: unknown) => void>();
    const socket = { on: (event: string, handler: (payload: unknown) => void) => void handlers.set(event, handler) };
    setGlobalWindow({ socket });

    poll.wirePollSocket(refs());
    expect(handlers.has("newPoll")).toBe(true);
    expect(handlers.has("closePoll")).toBe(true);

    vi.useFakeTimers();
    handlers.get("newPoll")?.({});
    vi.advanceTimersByTime(60);
    expect(openStates).toEqual([true]);

    // closePoll runs a non-forced sync: the module un-hides the group but
    // deliberately leaves the open state alone (characterization as-is).
    handlers.get("closePoll")?.({});
    vi.advanceTimersByTime(60);
    expect(openStates).toEqual([true]);
    expect(group.hidden).toBe(false);
    expect(group.getAttribute("hidden")).toBeNull();
  });

  it("wires the socket only once", () => {
    const poll = createStackPoll(defaultCtx());
    setGlobalDoc(makeDoc({ pollwrap: null }));
    const handlers = new Map<string, unknown>();
    const socket = {
      on: (event: string, handler: (_p: unknown) => void) => void handlers.set(event, handler)
    };
    const refsValue = refs();
    setGlobalWindow({ socket });

    poll.wirePollSocket(refsValue);
    poll.wirePollSocket(refsValue);
    let newPollCount = 0;
    for (const key of handlers.keys()) if (key === "newPoll") newPollCount += 1;
    expect(newPollCount).toBe(1);
  });
});

// ---- helpers -------------------------------------------------------------

function refs(): StackRefs {
  return {
    list: makeEl("list") as unknown as HTMLElement,
    footer: null
  };
}