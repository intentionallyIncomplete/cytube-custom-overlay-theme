/**
 * Module-fields sub-domain of feature:channelThemeAdmin (#228 Phase 4).
 *
 * Owns the "external module URLs" dynamic input rows: rendering, trimming,
 * availability top-ups, value reads, and the abortable input/debounce
 * watcher lifecycle (WeakMap registry + beforeunload cleanup).
 * Verbatim-extracted from src/modules/feature-channel-theme-admin.js —
 * behavior-preserving.
 */

import { normalizeModuleUrls } from "./theme-config.js";

const MODULE_FIELD_MIN = 3;
const MODULE_FIELD_MAX = 10;
const MODULE_INPUT_SELECTOR = '[data-role="module-inputs"]';

interface ModuleWatcherRecord {
  container: HTMLElement;
  controller: AbortController;
  timeoutId: ReturnType<typeof setTimeout> | null;
  observer: MutationObserver | null;
}

const moduleWatcherRegistry = new WeakMap<HTMLElement, ModuleWatcherRecord>();
const activeModuleWatchers = new Set<ModuleWatcherRecord>();

if (typeof window !== "undefined" && !window.__btfwModuleWatcherCleanupRegistered) {
  window.addEventListener('beforeunload', () => {
    const watchers = Array.from(activeModuleWatchers);
    for (const watcher of watchers) {
      cleanupModuleWatcher(watcher.container, watcher);
    }
  });
  window.__btfwModuleWatcherCleanupRegistered = true;
}

export function getModuleContainer(panel: Element | null | undefined): HTMLElement | null {
  if (!panel) return null;
  return panel.querySelector<HTMLElement>(MODULE_INPUT_SELECTOR);
}

function createModuleInput(index: number, value?: string): { wrapper: HTMLDivElement; input: HTMLInputElement } {
  const wrapper = document.createElement("div");
  wrapper.className = "module-input__row";
  const input = document.createElement("input");
  input.type = "url";
  input.className = "module-input__control";
  input.id = `btfw-theme-module-${index}`;
  input.name = `btfw-theme-module-${index}`;
  input.placeholder = "https://example.com/module.js";
  input.dataset.role = "module-input";
  input.value = value || "";
  wrapper.appendChild(input);
  return { wrapper, input };
}

function appendModuleInput(container: HTMLElement | null, index: number, value?: string): HTMLInputElement | null {
  if (!container) return null;
  const { wrapper, input } = createModuleInput(index, value);
  container.appendChild(wrapper);
  return input;
}

export function renderModuleInputs(panel: Element | null | undefined, values: unknown): void {
  const container = getModuleContainer(panel);
  if (!container) return;
  const normalized = normalizeModuleUrls(values);
  const limited = normalized.slice(0, MODULE_FIELD_MAX);
  const rows: HTMLDivElement[] = [];
  limited.forEach((value, index) => {
    const { wrapper } = createModuleInput(index, value);
    rows.push(wrapper);
  });
  let count = limited.length;
  while (count < MODULE_FIELD_MIN && count < MODULE_FIELD_MAX) {
    const { wrapper } = createModuleInput(count, "");
    rows.push(wrapper);
    count++;
  }
  const canExtend = count < MODULE_FIELD_MAX && normalized.length === limited.length;
  if (canExtend && count === limited.length) {
    const { wrapper } = createModuleInput(count, "");
    rows.push(wrapper);
  }

  if (typeof container.replaceChildren === "function") {
    container.replaceChildren(...rows);
  } else {
    while (container.firstChild) container.removeChild(container.firstChild);
    rows.forEach(row => container.appendChild(row));
  }
}

function trimModuleInputs(panel: Element | null | undefined): void {
  const container = getModuleContainer(panel);
  if (!container) return;
  container.querySelectorAll('.module-input__row').forEach(row => {
    if (!row.querySelector('input[data-role="module-input"]')) {
      row.remove();
    }
  });
  let inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
  while (inputs.length > MODULE_FIELD_MIN) {
    const last = inputs[inputs.length - 1];
    if (last && !last.value.trim()) {
      const precedingHasEmpty = inputs.slice(0, inputs.length - 1).some(input => !input.value.trim());
      if (precedingHasEmpty) {
        const wrapper = last.closest('.module-input__row');
        if (wrapper && wrapper.parentElement === container) {
          container.removeChild(wrapper);
        } else {
          last.remove();
        }
        inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
        continue;
      }
    }
    break;
  }
}

export function ensureModuleFieldAvailability(panel: Element | null | undefined): void {
  const container = getModuleContainer(panel);
  if (!container) return;
  container.querySelectorAll('.module-input__row').forEach(row => {
    if (!row.querySelector('input[data-role="module-input"]')) {
      row.remove();
    }
  });
  let inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
  if (!inputs.length) {
    renderModuleInputs(panel, []);
    inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
  }
  if (inputs.length < MODULE_FIELD_MIN) {
    let index = inputs.length;
    while (index < MODULE_FIELD_MIN && index < MODULE_FIELD_MAX) {
      appendModuleInput(container, index, "");
      index++;
    }
    inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
  }
  const hasEmpty = inputs.some(input => !input.value.trim());
  if (!hasEmpty && inputs.length < MODULE_FIELD_MAX) {
    appendModuleInput(container, inputs.length, "");
    inputs = Array.from(container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]'));
  }
  trimModuleInputs(panel);
}

function finalizeModuleWatcher(container: HTMLElement, watcher: ModuleWatcherRecord): void {
  if (watcher.timeoutId !== null) {
    clearTimeout(watcher.timeoutId);
    watcher.timeoutId = null;
  }
  if (watcher.observer) {
    watcher.observer.disconnect();
    watcher.observer = null;
  }
  activeModuleWatchers.delete(watcher);
  if (moduleWatcherRegistry.get(container) === watcher) {
    moduleWatcherRegistry.delete(container);
  }
  if (container) {
    delete (container as unknown as { _btfwModuleHandlerBound?: boolean })._btfwModuleHandlerBound;
    if (container.dataset && container.dataset.btfwModuleWatcher) {
      delete container.dataset.btfwModuleWatcher;
    }
  }
}

function cleanupModuleWatcher(container: HTMLElement | null | undefined, expectedWatcher?: ModuleWatcherRecord): void {
  if (!container) return;
  const watcher = moduleWatcherRegistry.get(container);
  if (!watcher || (expectedWatcher && watcher !== expectedWatcher)) {
    return;
  }
  if (!watcher.controller.signal.aborted) {
    watcher.controller.abort();
    return;
  }
  finalizeModuleWatcher(container, watcher);
}

export function bindModuleFieldWatcher(panel: Element | null | undefined, onChange?: () => void): void {
  const container = getModuleContainer(panel);
  if (!container) {
    console.warn('[theme-admin] Module container not found for binding');
    return;
  }

  cleanupModuleWatcher(container);

  const controller = new AbortController();
  const watcherRecord: ModuleWatcherRecord = {
    container,
    controller,
    timeoutId: null,
    observer: null
  };

  moduleWatcherRegistry.set(container, watcherRecord);
  activeModuleWatchers.add(watcherRecord);

  controller.signal.addEventListener('abort', () => {
    if (moduleWatcherRegistry.get(container) === watcherRecord) {
      finalizeModuleWatcher(container, watcherRecord);
    }
  });

  const handler = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (target?.dataset?.role === 'module-input') {
      if (watcherRecord.timeoutId !== null) {
        clearTimeout(watcherRecord.timeoutId);
      }
      watcherRecord.timeoutId = setTimeout(() => {
        if (!controller.signal.aborted) {
          ensureModuleFieldAvailability(panel);
          if (typeof onChange === "function") onChange();
        }
        watcherRecord.timeoutId = null;
      }, 10);
    }
  };

  container.addEventListener('input', handler, { signal: controller.signal });
  container.addEventListener('change', handler, { signal: controller.signal });

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.removedNodes) {
        const hasContains = typeof node?.contains === 'function';
        if (
          node === panel ||
          node === container ||
          (hasContains && (node.contains(panel ?? null) || node.contains(container)))
        ) {
          cleanupModuleWatcher(container, watcherRecord);
          return;
        }
      }
    }
  });

  watcherRecord.observer = observer;
  observer.observe(document.body, { childList: true, subtree: true });

  (container as unknown as { _btfwModuleHandlerBound: boolean })._btfwModuleHandlerBound = true;
  if (container.dataset) {
    container.dataset.btfwModuleWatcher = "1";
  }
}

export function readModuleValues(panel: Element | null | undefined): string[] {
  const container = getModuleContainer(panel);
  if (!container) return [];
  const seen = new Set<string>();
  const values: string[] = [];
  container.querySelectorAll<HTMLInputElement>('input[data-role="module-input"]').forEach(input => {
    const value = (input.value || "").trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    values.push(value);
  });
  return values;
}
