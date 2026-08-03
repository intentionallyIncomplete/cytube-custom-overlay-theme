/**
 * Shared native <dialog> confirmation prompt, styled with the overlay theme.
 * Replaces window.confirm() for discard/destructive confirmations so focus
 * trapping, ::backdrop styling, and Escape-to-cancel come from the browser
 * instead of hand-rolled modal chrome.
 */

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const DIALOG_ID = "btfw-confirm-dialog";
const STYLE_ID = "btfw-confirm-dialog-style";

function injectStyles(): void {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${DIALOG_ID} {
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 40%, transparent 60%);
      border-radius: 16px;
      padding: 0;
      max-width: 420px;
      width: calc(100vw - 32px);
      background: color-mix(in srgb, var(--btfw-theme-panel, #141f36) 96%, transparent 4%);
      color: var(--btfw-theme-text, #e8ecfb);
      box-shadow: 0 24px 60px color-mix(in srgb, var(--btfw-theme-bg, #05060d) 60%, transparent 40%);
      font-family: var(--btfw-font-body, "Inter", sans-serif);
    }
    #${DIALOG_ID}::backdrop {
      background: color-mix(in srgb, var(--btfw-theme-bg, #05060d) 55%, transparent 45%);
      backdrop-filter: blur(4px);
    }
    #${DIALOG_ID} .btfw-confirm-body { padding: 22px 24px 8px; }
    #${DIALOG_ID} h2 { margin: 0 0 10px; font-size: 1.05rem; letter-spacing: 0.02em; }
    #${DIALOG_ID} p {
      margin: 0;
      font-size: 0.92rem;
      line-height: 1.5;
      color: color-mix(in srgb, var(--btfw-theme-text, #e8ecfb) 82%, transparent 18%);
    }
    #${DIALOG_ID} .btfw-confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 18px 24px 22px;
    }
    #${DIALOG_ID} button {
      padding: 8px 16px;
      border-radius: 10px;
      border: 0;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.88rem;
    }
    #${DIALOG_ID} .btfw-confirm-cancel {
      background: color-mix(in srgb, var(--btfw-theme-surface, #0b111d) 90%, transparent 10%);
      color: var(--btfw-theme-text, #e8ecfb);
      border: 1px solid color-mix(in srgb, var(--btfw-theme-accent, #6d4df6) 26%, transparent 74%);
    }
    #${DIALOG_ID} .btfw-confirm-ok {
      background: var(--btfw-theme-accent, #6d4df6);
      color: #fff;
    }
  `;
  document.head.appendChild(style);
}

function buildDialog(): HTMLDialogElement {
  injectStyles();
  const existing = document.getElementById(DIALOG_ID);
  if (existing instanceof HTMLDialogElement) return existing;

  const dialog = document.createElement("dialog");
  dialog.id = DIALOG_ID;
  dialog.innerHTML = `
    <div class="btfw-confirm-body">
      <h2 data-role="title"></h2>
      <p data-role="message"></p>
    </div>
    <div class="btfw-confirm-actions">
      <button type="button" class="btfw-confirm-cancel" data-role="cancel"></button>
      <button type="button" class="btfw-confirm-ok" data-role="confirm"></button>
    </div>
  `;
  document.body.appendChild(dialog);
  return dialog;
}

/**
 * Shows a native <dialog> confirmation prompt and resolves once the user
 * responds. Falls back to window.confirm() when <dialog>/showModal() aren't
 * available.
 */
export function confirmDialog(options: ConfirmDialogOptions): Promise<boolean> {
  const {
    title = "Discard changes?",
    message,
    confirmLabel = "Discard",
    cancelLabel = "Cancel"
  } = options;

  if (
    typeof document === "undefined" ||
    typeof HTMLDialogElement === "undefined" ||
    typeof HTMLDialogElement.prototype.showModal !== "function"
  ) {
    return Promise.resolve(typeof window !== "undefined" ? window.confirm(message) : false);
  }

  const dialog = buildDialog();
  if (dialog.open) dialog.close();

  const titleEl = dialog.querySelector('[data-role="title"]');
  const messageEl = dialog.querySelector('[data-role="message"]');
  const cancelBtn = dialog.querySelector('[data-role="cancel"]');
  const confirmBtn = dialog.querySelector('[data-role="confirm"]');

  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (cancelBtn) cancelBtn.textContent = cancelLabel;
  if (confirmBtn) confirmBtn.textContent = confirmLabel;

  return new Promise<boolean>((resolve) => {
    let settled = false;

    const cleanup = (): void => {
      cancelBtn?.removeEventListener("click", onCancelClick);
      confirmBtn?.removeEventListener("click", onConfirmClick);
      dialog.removeEventListener("click", onBackdropClick);
      dialog.removeEventListener("close", onClose);
    };

    const finish = (result: boolean): void => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const onCancelClick = (): void => {
      dialog.close();
    };
    const onConfirmClick = (): void => {
      dialog.returnValue = "confirm";
      dialog.close();
    };
    const onBackdropClick = (event: MouseEvent): void => {
      if (event.target === dialog) dialog.close();
    };
    const onClose = (): void => {
      finish(dialog.returnValue === "confirm");
    };

    cancelBtn?.addEventListener("click", onCancelClick);
    confirmBtn?.addEventListener("click", onConfirmClick);
    dialog.addEventListener("click", onBackdropClick);
    dialog.addEventListener("close", onClose);

    dialog.returnValue = "";
    dialog.showModal();
    (confirmBtn as HTMLButtonElement | null)?.focus();
  });
}
