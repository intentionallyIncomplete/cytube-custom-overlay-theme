/**
 * Wire first-open activation for BTFW modules that are defined at bundle load
 * but intentionally skipped during boot init (#197).
 */

export interface DeferredFeatureOpenApi {
  open?: () => void;
}

export type DeferredFeatureInit = (
  moduleName: string
) => Promise<DeferredFeatureOpenApi | null | undefined>;

export interface DeferredFeatureOpenOptions {
  readonly moduleName: string;
  readonly init: DeferredFeatureInit;
  readonly openEvent?: string;
  readonly clickSelector?: string;
  readonly onError?: (error: unknown) => void;
  /** Defaults to global document; injectable for tests. */
  readonly doc?: Document;
}

/**
 * Installs event/click handlers that init a module once, then call open().
 * Returns a dispose function.
 */
export function wireDeferredFeatureOpen(
  options: DeferredFeatureOpenOptions
): () => void {
  const doc = options.doc ?? document;
  let opening = false;

  const openFeature = async (): Promise<void> => {
    if (opening) {
      return;
    }
    opening = true;
    try {
      const api = await options.init(options.moduleName);
      if (api && typeof api.open === "function") {
        api.open();
      }
    } catch (error: unknown) {
      options.onError?.(error);
    } finally {
      opening = false;
    }
  };

  const onEvent = (): void => {
    void openFeature();
  };

  const onClick = (event: Event): void => {
    const target = event.target;
    if (
      typeof target !== "object" ||
      target === null ||
      !("closest" in target) ||
      typeof (target as Element).closest !== "function"
    ) {
      return;
    }
    const selector = options.clickSelector;
    if (!selector || !(target as Element).closest(selector)) {
      return;
    }
    event.preventDefault();
    void openFeature();
  };

  if (options.openEvent) {
    doc.addEventListener(options.openEvent, onEvent);
  }
  if (options.clickSelector) {
    doc.addEventListener("click", onClick, true);
  }

  return (): void => {
    if (options.openEvent) {
      doc.removeEventListener(options.openEvent, onEvent);
    }
    if (options.clickSelector) {
      doc.removeEventListener("click", onClick, true);
    }
  };
}
