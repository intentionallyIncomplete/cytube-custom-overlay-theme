/**
 * Shared dirty-state controller for settings modals.
 * Reveals an Apply button when registered sections diverge from baseline.
 */

export type PersistResult =
  | { ok: true }
  | { ok: false; error: string };

export interface DirtySection {
  id: string;
  snapshot(): string;
  restore(snapshot: string): void;
  apply(): PersistResult | Promise<PersistResult>;
}

export interface DirtyApplyControllerOptions {
  modal: HTMLElement;
  applyButton: HTMLButtonElement;
  sections: DirtySection[];
  /** CSS selectors for roots that auto-save and must not mark dirty */
  ignoreRoots?: readonly string[];
  confirmDiscard?: () => boolean | Promise<boolean>;
  statusEl?: HTMLElement | null;
}

export interface DirtyApplyController {
  isDirty(): boolean;
  recalculate(): void;
  markDirty(sectionId?: string): void;
  captureBaseline(): void;
  applyAll(): Promise<PersistResult>;
  tryClose(): Promise<boolean>;
  dispose(): void;
}

export function isPersistSuccess(result: PersistResult): result is { ok: true } {
  return result.ok === true;
}

export function isPersistFailure(
  result: PersistResult
): result is { ok: false; error: string } {
  return result.ok === false;
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  if (typeof HTMLElement === "function" && value instanceof HTMLElement) {
    return true;
  }
  return (
    typeof value === "object" &&
    value !== null &&
    "closest" in value &&
    typeof (value as { closest: unknown }).closest === "function" &&
    "contains" in value &&
    typeof (value as { contains: unknown }).contains === "function"
  );
}

export function isHTMLButtonElement(value: unknown): value is HTMLButtonElement {
  if (typeof HTMLButtonElement === "function" && value instanceof HTMLButtonElement) {
    return true;
  }
  return (
    isHTMLElement(value) &&
    "disabled" in value &&
    typeof (value as { disabled: unknown }).disabled === "boolean"
  );
}

/**
 * Show/hide Apply using the HTML `hidden` attribute (Chrome + Firefox Baseline).
 * Keeps aria-hidden in sync for assistive tech.
 */
export function setApplyButtonVisible(
  button: HTMLButtonElement,
  visible: boolean
): void {
  button.hidden = !visible;
  if (visible) {
    button.removeAttribute("aria-hidden");
    button.removeAttribute("tabindex");
  } else {
    button.setAttribute("aria-hidden", "true");
    button.setAttribute("tabindex", "-1");
  }
}

export function eventTargetIsInsideIgnoredRoot(
  target: EventTarget | null,
  modal: HTMLElement,
  ignoreRoots: readonly string[]
): boolean {
  if (!isHTMLElement(target) || ignoreRoots.length === 0) return false;
  for (const selector of ignoreRoots) {
    try {
      const root = modal.querySelector(selector);
      if (isHTMLElement(root) && root.contains(target)) {
        return true;
      }
      if (target.closest(selector)) {
        return true;
      }
    } catch {
      // Invalid selector — ignore
    }
  }
  return false;
}

function setBusy(button: HTMLButtonElement, busy: boolean): void {
  if (busy) {
    button.setAttribute("aria-busy", "true");
    button.disabled = true;
  } else {
    button.removeAttribute("aria-busy");
    button.disabled = false;
  }
}

function setStatus(statusEl: HTMLElement | null | undefined, message: string): void {
  if (!statusEl) return;
  statusEl.textContent = message;
}

export function createDirtyApplyController(
  options: DirtyApplyControllerOptions
): DirtyApplyController {
  const {
    modal,
    applyButton,
    sections,
    ignoreRoots = [],
    confirmDiscard,
    statusEl
  } = options;

  const baselines = new Map<string, string>();
  const forcedDirty = new Set<string>();
  const abort = new AbortController();
  let recalcQueued = false;
  let applying = false;

  function captureBaseline(): void {
    baselines.clear();
    forcedDirty.clear();
    for (const section of sections) {
      baselines.set(section.id, section.snapshot());
    }
    recalculate();
  }

  function sectionIsDirty(section: DirtySection): boolean {
    if (forcedDirty.has(section.id)) return true;
    const baseline = baselines.get(section.id);
    if (baseline === undefined) return true;
    return section.snapshot() !== baseline;
  }

  function isDirty(): boolean {
    return sections.some((section) => sectionIsDirty(section));
  }

  function recalculate(): void {
    const dirty = isDirty();
    if (dirty) {
      modal.dataset.btfwDirty = "1";
    } else {
      delete modal.dataset.btfwDirty;
    }
    setApplyButtonVisible(applyButton, dirty);
    if (!dirty) {
      setStatus(statusEl, "");
    }
  }

  function queueRecalculate(): void {
    if (recalcQueued || applying) return;
    recalcQueued = true;
    queueMicrotask(() => {
      recalcQueued = false;
      recalculate();
    });
  }

  function markDirty(sectionId?: string): void {
    if (typeof sectionId === "string" && sectionId.length > 0) {
      forcedDirty.add(sectionId);
    } else {
      for (const section of sections) {
        forcedDirty.add(section.id);
      }
    }
    queueRecalculate();
  }

  async function applyAll(): Promise<PersistResult> {
    if (applying) {
      return { ok: false, error: "Apply already in progress" };
    }
    applying = true;
    setBusy(applyButton, true);
    setStatus(statusEl, "");

    const dirtySections = sections.filter((section) => sectionIsDirty(section));
    if (dirtySections.length === 0) {
      setBusy(applyButton, false);
      applying = false;
      setApplyButtonVisible(applyButton, false);
      return { ok: true };
    }

    let firstError: string | null = null;
    let failCount = 0;

    for (const section of dirtySections) {
      try {
        const result = await section.apply();
        if (isPersistSuccess(result)) {
          baselines.set(section.id, section.snapshot());
          forcedDirty.delete(section.id);
        } else {
          failCount += 1;
          if (firstError === null) firstError = result.error;
        }
      } catch (err) {
        failCount += 1;
        const message =
          err instanceof Error ? err.message : "Unknown apply error";
        if (firstError === null) firstError = message;
      }
    }

    setBusy(applyButton, false);
    applying = false;
    recalculate();

    if (failCount > 0) {
      const message =
        firstError === null
          ? `Failed to apply ${failCount} section(s)`
          : `${firstError}${failCount > 1 ? ` (+${failCount - 1} more)` : ""}`;
      setStatus(statusEl, message);
      return { ok: false, error: message };
    }

    setStatus(statusEl, "Changes applied");
    return { ok: true };
  }

  async function tryClose(): Promise<boolean> {
    if (!isDirty()) return true;
    if (confirmDiscard) {
      const ok = await confirmDiscard();
      if (!ok) return false;
    } else {
      const ok = window.confirm("Discard unsaved changes?");
      if (!ok) return false;
    }
    for (const section of sections) {
      const baseline = baselines.get(section.id);
      if (baseline !== undefined) {
        section.restore(baseline);
      }
    }
    forcedDirty.clear();
    recalculate();
    return true;
  }

  function onModalEvent(event: Event): void {
    if (eventTargetIsInsideIgnoredRoot(event.target, modal, ignoreRoots)) {
      return;
    }
    queueRecalculate();
  }

  modal.addEventListener("input", onModalEvent, {
    signal: abort.signal,
    capture: true
  });
  modal.addEventListener("change", onModalEvent, {
    signal: abort.signal,
    capture: true
  });

  const onBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = "";
  };
  if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("beforeunload", onBeforeUnload, {
      signal: abort.signal
    });
  }

  captureBaseline();

  return {
    isDirty,
    recalculate,
    markDirty,
    captureBaseline,
    applyAll,
    tryClose,
    dispose(): void {
      abort.abort();
    }
  };
}
