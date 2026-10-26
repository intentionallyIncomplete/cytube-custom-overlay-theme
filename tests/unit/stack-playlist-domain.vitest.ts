import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createStackPlaylist,
  type StackPlaylistContext,
  type StackPlaylistDomain
} from "../../src/modules/stack/stack-playlist";

/**
 * Unit tests for the extracted playlist stack sub-domain (#228 Phase 2, #234).
 *
 * Covers the queue-facing surface: uid extraction (pluid class, jQuery data,
 * dataset.uid), play/queue link actions (socket emit, native play button,
 * window.queue fallback, parseMediaLink path), queue preview rendering
 * (empty state, entries, play buttons, disabled state), the queue preview
 * observer wiring + flyout gate, and the add-media UI guard clauses.
 */

// ---- fakes ---------------------------------------------------------------

interface FakeEl {
  id: string;
  tagName: string;
  className: string;
  innerHTML: string;
  textContent: string;
  value: string;
  type: string;
  disabled: boolean;
  dataset: Record<string, string | undefined>;
  classTokens: Set<string>;
  attrs: Map<string, string>;
  style: { removeProperty(name: string): void };
  children: FakeEl[];
  parentElement: FakeEl | null;
  isConnected: boolean;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  classList: {
    toggle(token: string, force?: boolean): void;
    remove(...tokens: string[]): void;
    add(...tokens: string[]): void;
    contains(token: string): boolean;
    [Symbol.iterator](): Iterator<string>;
  };
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
  appendChild(child: FakeEl): void;
  prepend(child: FakeEl): void;
  append(...children: FakeEl[]): void;
  replaceChildren(...children: FakeEl[]): void;
  remove(): void;
  click(): void;
  blur(): void;
}

function makeEl(id = "", tagName = "div"): FakeEl {
  const el: FakeEl = {
    id,
    tagName,
    className: "",
    innerHTML: "",
    textContent: "",
    value: "",
    type: "",
    disabled: false,
    dataset: {},
    classTokens: new Set(),
    attrs: new Map(),
    style: { removeProperty: () => {} },
    children: [],
    parentElement: null,
    isConnected: true,
    querySelector: () => null,
    querySelectorAll: () => [],
    classList: {
      toggle(token, force) {
        const on = force !== undefined ? force : !el.classTokens.has(token);
        if (on) el.classTokens.add(token);
        else el.classTokens.delete(token);
      },
      remove(...tokens) {
        tokens.forEach((t) => el.classTokens.delete(t));
      },
      add(...tokens) {
        tokens.forEach((t) => el.classTokens.add(t));
      },
      contains(token) {
        return el.classTokens.has(token);
      },
      *[Symbol.iterator]() {
        yield* el.classTokens;
      }
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
    prepend(child) {
      child.parentElement = el;
      el.children.unshift(child);
    },
    append(...children) {
      children.forEach((c) => {
        c.parentElement = el;
        el.children.push(c);
      });
    },
    replaceChildren(...children) {
      el.children = [];
      children.forEach((c) => {
        c.parentElement = el;
        el.children.push(c);
      });
    },
    remove() {
      const parent = el.parentElement;
      if (!parent) return;
      const idx = parent.children.indexOf(el);
      if (idx >= 0) parent.children.splice(idx, 1);
      el.parentElement = null;
    },
    click() {},
    blur() {}
  };
  // className setter keeps the token set the source of truth, so module code
  // that assigns `el.className = "..."` (renderPlaylistQueuePreview, the empty
  // state) stays observable through classList.contains().
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
  return el;
}

function makeQueueEntry(id: string, uidToken: string | null, overrides: Partial<FakeEl> = {}): FakeEl {
  const entry = makeEl(id, "div");
  if (uidToken) entry.classList.add(uidToken);
  Object.assign(entry, overrides);
  return entry;
}

interface FakeDoc {
  getElementById(id: string): FakeEl | null;
  querySelector(sel: string): FakeEl | null;
  querySelectorAll(sel: string): FakeEl[];
  createElement(tag: string): FakeEl;
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
    createElement: (tag) => makeEl("", tag),
    body: makeEl("body")
  };
}

const TPL = {
  addMediaPanelHtml: () => "<div class='btfw-addmedia-panel__inner'></div>",
  addMediaButtonHtml: () => "<span>Add media</span>"
};

function defaultCtx(overrides: Partial<StackPlaylistContext> = {}): StackPlaylistContext {
  return {
    tpl: TPL,
    getActiveFlyoutGroup: () => null,
    ...overrides
  };
}

// ---- env hooks -----------------------------------------------------------

let savedDocument: Document | undefined;
let savedWindow: (Window & { socket?: unknown }) | undefined;
let savedLocalStorage: Storage | undefined;
let savedParseMediaLink: unknown;

beforeEach(() => {
  savedDocument = globalThis.document;
  savedWindow = globalThis.window;
  savedLocalStorage = globalThis.localStorage;
  savedParseMediaLink = (globalThis as { parseMediaLink?: unknown }).parseMediaLink;
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: undefined });
  // Browsers always have window; module code reads window.jQuery/$. interactively,
  // so default to an empty object and override per-test with setGlobalWindow.
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: {} });
});

afterEach(() => {
  Object.defineProperty(globalThis, "document", { configurable: true, writable: true, value: savedDocument });
  Object.defineProperty(globalThis, "window", { configurable: true, writable: true, value: savedWindow });
  if (savedLocalStorage === undefined) delete (globalThis as { localStorage?: Storage }).localStorage;
  else globalThis.localStorage = savedLocalStorage;
  if (savedParseMediaLink === undefined) delete (globalThis as { parseMediaLink?: unknown }).parseMediaLink;
  else (globalThis as { parseMediaLink?: unknown }).parseMediaLink = savedParseMediaLink;
  vi.useRealTimers();
});

function setGlobalDoc(next: FakeDoc): void {
  (globalThis as { document?: unknown }).document = next as unknown as Document;
}

function setGlobalWindow(next: unknown): void {
  (globalThis as { window?: unknown }).window = next as Window & { socket?: unknown };
}

// ---- tests ---------------------------------------------------------------

describe("stack-playlist domain: queue entry uid", () => {
  it("extracts the uid from a pluid- class token", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entry = makeQueueEntry("e1", "pluid-abc123");
    expect(playlist.getQueueEntryUid(entry as unknown as HTMLElement)).toBe("abc123");
  });

  it("falls back to jQuery data('uid') when present", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entry = makeQueueEntry("e1", null);
    setGlobalWindow({
      jQuery: (target: unknown) => {
        expect(target).toBe(entry);
        return { data: (key: string) => (key === "uid" ? 42 : undefined) };
      }
    });
    expect(playlist.getQueueEntryUid(entry as unknown as HTMLElement)).toBe(42);
  });

  it("falls back to dataset.uid last and returns null when nothing matches", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entry = makeQueueEntry("e1", null);
    entry.dataset.uid = "abc123";
    expect(playlist.getQueueEntryUid(entry as unknown as HTMLElement)).toBe("abc123");

    const bare = makeQueueEntry("e2", null);
    expect(playlist.getQueueEntryUid(bare as unknown as HTMLElement)).toBeNull();
    expect(playlist.getQueueEntryUid(null)).toBeNull();
  });
});

describe("stack-playlist domain: playQueueEntry", () => {
  it("emits jumpTo over the socket when available", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const emit = vi.fn();
    setGlobalWindow({ socket: { on: vi.fn(), emit } });
    const ok = playlist.playQueueEntry("abc123");
    expect(ok).toBe(true);
    expect(emit).toHaveBeenCalledOnce();
    expect(emit).toHaveBeenCalledWith("jumpTo", "abc123");
  });

  it("falls back to the native play button when no socket exists", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entry = makeQueueEntry("qe", "pluid-abc123");
    const playBtn = makeEl("play", "button");
    entry.querySelector = (sel: string) => (sel === ".qbtn-play" ? playBtn : null);
    const clicked = vi.spyOn(playBtn, "click").mockImplementation(() => {});
    setGlobalDoc(makeDoc({}, { "#queue > .queue_entry.pluid-abc123": entry }));

    const ok = playlist.playQueueEntry("abc123");
    expect(ok).toBe(true);
    expect(clicked).toHaveBeenCalledOnce();
  });

  it("returns false for empty uids and when nothing can play", () => {
    const playlist = createStackPlaylist(defaultCtx());
    expect(playlist.playQueueEntry(null)).toBe(false);
    expect(playlist.playQueueEntry("")).toBe(false);

    setGlobalDoc(makeDoc({}, { "#queue > .queue_entry.pluid-missing": null }));
    setGlobalWindow({});
    expect(playlist.playQueueEntry("missing")).toBe(false);
  });
});

describe("stack-playlist domain: queueMediaLink", () => {
  it("returns false for blank urls", () => {
    const playlist = createStackPlaylist(defaultCtx());
    expect(playlist.queueMediaLink("")).toBe(false);
    expect(playlist.queueMediaLink("   ")).toBe(false);
    expect(playlist.queueMediaLink(null)).toBe(false);
  });

  it("fills the legacy mediaurl input and clicks queue_next when enabled", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const input = makeEl("mediaurl", "input");
    const queueNext = makeEl("queue_next", "button");
    const clicked = vi.spyOn(queueNext, "click").mockImplementation(() => {});
    setGlobalDoc(makeDoc({ mediaurl: input, queue_next: queueNext }));

    const ok = playlist.queueMediaLink("https://example.com/v.mp4");
    expect(ok).toBe(true);
    expect(input.value).toBe("https://example.com/v.mp4");
    expect(clicked).toHaveBeenCalledOnce();
  });

  it("uses window.queue when the queue_next button is disabled", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const input = makeEl("mediaurl", "input");
    const queueNext = makeEl("queue_next", "button");
    queueNext.disabled = true;
    setGlobalDoc(makeDoc({ mediaurl: input, queue_next: queueNext }));
    const queue = vi.fn();
    setGlobalWindow({ queue });

    const ok = playlist.queueMediaLink("https://example.com/v.mp4");
    expect(ok).toBe(true);
    expect(input.value).toBe("https://example.com/v.mp4");
    expect(queue).toHaveBeenCalledWith("next", "url");
  });

  it("emits a parsed queue event via parseMediaLink and the socket as last resort", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const emit = vi.fn();
    setGlobalWindow({ socket: { on: vi.fn(), emit } });
    (globalThis as { parseMediaLink?: unknown }).parseMediaLink = (url: string) => {
      expect(url).toBe("https://example.com/v.mp4");
      return { id: "dQw4w9WgXcQ", type: "yt" };
    };
    setGlobalDoc(makeDoc({ mediaurl: null, queue_next: null }));

    const ok = playlist.queueMediaLink("https://example.com/v.mp4");
    expect(ok).toBe(true);
    expect(emit).toHaveBeenCalledWith("queue", {
      id: "dQw4w9WgXcQ",
      type: "yt",
      pos: "next",
      temp: false
    });
  });

  it("returns false when every path is unavailable or parsing fails", () => {
    const playlist = createStackPlaylist(defaultCtx());
    setGlobalDoc(makeDoc({ mediaurl: null, queue_next: null }));
    setGlobalWindow({});
    expect(playlist.queueMediaLink("https://example.com/v.mp4")).toBe(false);

    // parseMediaLink present but returns null
    (globalThis as { parseMediaLink?: unknown }).parseMediaLink = () => null;
    setGlobalWindow({ socket: { on: vi.fn(), emit: vi.fn() } });
    expect(playlist.queueMediaLink("https://example.com/v.mp4")).toBe(false);
  });
});

describe("stack-playlist domain: queue preview", () => {
  function docWithQueue(entries: FakeEl[]): FakeDoc {
    const queue = makeEl("queue");
    queue.querySelectorAll = (sel: string) => (sel === ":scope > .queue_entry" ? entries : []);
    return makeDoc({ queue });
  }

  it("returns upcoming entries after the active one, honoring the limit", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const a = makeQueueEntry("a", "pluid-a");
    const active = makeQueueEntry("b", "pluid-b");
    active.classList.add("queue_active");
    const c = makeQueueEntry("c", "pluid-c");
    const d = makeQueueEntry("d", "pluid-d");
    setGlobalDoc(docWithQueue([a, active, c, d]));

    const upcoming = playlist.getUpcomingQueueEntries(5);
    expect(upcoming.map((e) => (e as unknown as FakeEl).id)).toEqual(["c", "d"]);

    const limited = playlist.getUpcomingQueueEntries(1);
    expect(limited.map((e) => (e as unknown as FakeEl).id)).toEqual(["c"]);
  });

  it("returns all entries from the top when nothing is playing", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const a = makeQueueEntry("a", "pluid-a");
    const b = makeQueueEntry("b", "pluid-b");
    setGlobalDoc(docWithQueue([a, b]));

    const upcoming = playlist.getUpcomingQueueEntries(5);
    expect(upcoming.map((e) => (e as unknown as FakeEl).id)).toEqual(["a", "b"]);
  });

  it("renders the empty state when the queue has no upcoming entries", () => {
    const playlist = createStackPlaylist(defaultCtx());
    setGlobalDoc(docWithQueue([]));
    const host = makeEl("host");
    playlist.renderPlaylistQueuePreview(host as unknown as HTMLElement);

    expect(host.children).toHaveLength(1);
    const empty = host.children[0]!;
    expect(empty.classList.contains("btfw-panel-playlist__empty")).toBe(true);
    expect(empty.textContent).toBe("No upcoming videos");
  });

  it("renders title, meta and a play button per entry; disables without socket or native play", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entry = makeQueueEntry("e1", "pluid-abc");
    const title = makeEl("t", "span");
    title.textContent = "A song";
    const meta = makeEl("m", "span");
    meta.textContent = "3:21";
    const entryNode = makeQueueEntry("qe", "pluid-abc");
    entryNode.querySelector = (sel: string) =>
      sel === ".qe_title" ? title : sel === ".qe_time" ? meta : sel === ".qbtn-play" ? null : null;
    setGlobalDoc(docWithQueue([entryNode]));
    setGlobalWindow({}); // no socket -> play buttons must be disabled

    const host = makeEl("host");
    playlist.renderPlaylistQueuePreview(host as unknown as HTMLElement);

    expect(host.children).toHaveLength(1);
    const item = host.children[0]!;
    const renderedTitle = item.children.find((c) => c.classList.contains("btfw-panel-playlist__title"));
    expect(renderedTitle?.textContent).toBe("A song");
    const renderedMeta = item.children.find((c) => c.classList.contains("btfw-panel-playlist__meta"));
    expect(renderedMeta?.textContent).toBe("3:21");
    const play = item.children
      .find((c) => c.classList.contains("btfw-panel-playlist__actions"))
      ?.children.find((c) => c.classList.contains("btfw-panel-playlist__play"));
    expect(play).toBeDefined();
    expect(play?.disabled).toBe(true);
    expect(play?.dataset.queueUid).toBe("abc");
  });

  it("enables the play button when a socket emit path exists", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const entryNode = makeQueueEntry("qe", "pluid-abc");
    entryNode.querySelector = (sel: string) => (sel === ".qbtn-play" ? null : null);
    setGlobalDoc(docWithQueue([entryNode]));
    setGlobalWindow({ socket: { on: vi.fn(), emit: vi.fn() } });

    const host = makeEl("host");
    playlist.renderPlaylistQueuePreview(host as unknown as HTMLElement);

    const play = host.children[0]!
      .children.find((c) => c.classList.contains("btfw-panel-playlist__actions"))
      ?.children.find((c) => c.classList.contains("btfw-panel-playlist__play"));
    expect(play?.disabled).toBe(false);
  });
});

class MutationObserverStub {
  static instances: MutationObserverStub[] = [];
  callback: () => void;
  observed: Array<{ target: unknown; options: unknown }> = [];
  disconnected = false;
  constructor(callback: () => void) {
    this.callback = callback;
    MutationObserverStub.instances.push(this);
  }
  observe(target: unknown, options: unknown): void {
    this.observed.push({ target, options });
  }
  disconnect(): void {
    this.disconnected = true;
  }
}

describe("stack-playlist domain: queue preview observer", () => {
  function currentObserver(): MutationObserverStub {
    const instance = MutationObserverStub.instances[MutationObserverStub.instances.length - 1];
    expect(instance).toBeDefined();
    return instance!;
  }

  beforeEach(() => {
    MutationObserverStub.instances = [];
    (globalThis as { MutationObserver?: unknown }).MutationObserver = MutationObserverStub;
  });

  afterEach(() => {
    delete (globalThis as { MutationObserver?: unknown }).MutationObserver;
  });

  it("watches #queue and re-renders only while the playlist flyout is open", () => {
    let activeFlyout: string | null = null;
    const playlist = createStackPlaylist(defaultCtx({ getActiveFlyoutGroup: () => activeFlyout }));
    const queue = makeEl("queue");
    const entryNode = makeQueueEntry("qe", "pluid-abc");
    queue.querySelectorAll = (sel: string) => (sel === ":scope > .queue_entry" ? [entryNode] : []);
    setGlobalDoc(makeDoc({ queue }));
    setGlobalWindow({});

    const host = makeEl("host");
    playlist.ensureQueuePreviewObserver(host as unknown as Element);
    const observer = currentObserver();
    expect(observer.observed).toHaveLength(1);
    expect(observer.observed[0]?.target).toBe(queue);

    // closed flyout -> no render
    activeFlyout = null;
    host.replaceChildren();
    observer.callback();
    expect(host.children).toHaveLength(0);

    // open playlist flyout -> renders
    activeFlyout = "playlist-group";
    observer.callback();
    expect(host.children).toHaveLength(1);
  });

  it("does not re-wire for the same host and disconnects on request", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const queue = makeEl("queue");
    queue.querySelectorAll = () => [];
    setGlobalDoc(makeDoc({ queue }));
    setGlobalWindow({});

    const host = makeEl("host");
    playlist.ensureQueuePreviewObserver(host as unknown as Element);
    const first = currentObserver();
    playlist.ensureQueuePreviewObserver(host as unknown as Element);
    expect(currentObserver()).toBe(first);

    playlist.disconnectQueuePreviewObserver();
    expect(first.disconnected).toBe(true);
  });
});

describe("stack-playlist domain: add-media UI guard clauses", () => {
  it("returns null when the required containers are missing", () => {
    const playlist = createStackPlaylist(defaultCtx());
    setGlobalDoc(makeDoc());
    const result = playlist.ensureAddMediaUI(
      null,
      null,
      null
    );
    expect(result).toBeNull();
  });

  it("removes a stale panel when no add-media sections exist", () => {
    const playlist = createStackPlaylist(defaultCtx());
    const panel = makeEl("btfw-addmedia-panel");
    const mainContainer = makeEl("main");
    const controlsBar = makeEl("btfw-plbar");
    const actionsCluster = makeEl("actions");
    const removed = vi.spyOn(panel, "remove").mockImplementation(() => {});
    setGlobalDoc(makeDoc({ "btfw-addmedia-panel": panel }));
    const result = playlist.ensureAddMediaUI(
      mainContainer as unknown as HTMLElement,
      controlsBar as unknown as HTMLElement,
      actionsCluster as unknown as HTMLElement
    );
    expect(result).toBeNull();
    expect(removed).toHaveBeenCalledOnce();
  });
});