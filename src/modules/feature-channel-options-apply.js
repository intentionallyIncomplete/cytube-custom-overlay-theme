/* BTFW — feature:channelOptionsApply
   Dirty → reveal Apply for Channel Options explicit-commit tabs.
   Leaves General/Admin CyTube auto-save (#cs-miscoptions / #cs-adminoptions) alone.
*/
import {
  createDirtyApplyController,
  setApplyButtonVisible
} from "../lib/dirty-apply.js";

BTFW.define("feature:channelOptionsApply", [], async () => {
  const IGNORE_ROOTS = [
    "#cs-miscoptions",
    "#cs-adminoptions",
    ".cs-checkbox",
    ".cs-textbox",
    ".cs-textbox-timeinput"
  ];

  /** @type {ReturnType<typeof createDirtyApplyController> | null} */
  let controller = null;
  /** @type {MutationObserver | null} */
  let permsObserver = null;

  function getSocket() {
    return window.socket || null;
  }

  function hideLegacySave(el) {
    if (!el) return;
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    el.classList.add("btfw-legacy-save-hidden");
  }

  function readControlValue(el) {
    if (!(el instanceof HTMLElement)) return "";
    if (el instanceof HTMLInputElement) {
      if (el.type === "checkbox" || el.type === "radio") {
        return el.checked ? "1" : "0";
      }
      return el.value;
    }
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
      return el.value;
    }
    return "";
  }

  function snapshotFields(root, selector) {
    if (!(root instanceof HTMLElement)) return "[]";
    const nodes = Array.from(root.querySelectorAll(selector));
    return JSON.stringify(
      nodes.map((node, index) => ({
        i: index,
        id: node.id || "",
        v: readControlValue(node)
      }))
    );
  }

  function restoreFields(root, selector, raw) {
    if (!(root instanceof HTMLElement)) return;
    let rows = [];
    try {
      rows = JSON.parse(raw);
    } catch {
      return;
    }
    if (!Array.isArray(rows)) return;
    const nodes = Array.from(root.querySelectorAll(selector));
    rows.forEach((row) => {
      if (!row || typeof row !== "object") return;
      const node =
        (typeof row.id === "string" && row.id
          ? root.querySelector(`#${CSS.escape(row.id)}`)
          : null) || nodes[row.i];
      if (!(node instanceof HTMLElement)) return;
      const value = typeof row.v === "string" ? row.v : "";
      if (node instanceof HTMLInputElement) {
        if (node.type === "checkbox" || node.type === "radio") {
          node.checked = value === "1";
        } else {
          node.value = value;
        }
        return;
      }
      if (node instanceof HTMLTextAreaElement || node instanceof HTMLSelectElement) {
        node.value = value;
      }
    });
  }

  function emitOrClick(socketEvent, payload, legacyButtonId) {
    const socket = getSocket();
    if (socket && typeof socket.emit === "function") {
      socket.emit(socketEvent, payload);
      return { ok: true };
    }
    const legacy = document.getElementById(legacyButtonId);
    if (legacy instanceof HTMLElement) {
      legacy.click();
      return { ok: true };
    }
    return { ok: false, error: `Unable to ${socketEvent}` };
  }

  function makeTextSection(id, textareaId, socketEvent, legacyButtonId, payloadKey) {
    return {
      id,
      snapshot() {
        const el = document.getElementById(textareaId);
        return el instanceof HTMLTextAreaElement ? el.value : "";
      },
      restore(snapshot) {
        const el = document.getElementById(textareaId);
        if (el instanceof HTMLTextAreaElement) el.value = snapshot;
      },
      apply() {
        const el = document.getElementById(textareaId);
        const value = el instanceof HTMLTextAreaElement ? el.value : "";
        return emitOrClick(socketEvent, { [payloadKey]: value }, legacyButtonId);
      }
    };
  }

  function makePermissionsSection() {
    return {
      id: "permissions",
      snapshot() {
        const root = document.getElementById("cs-permedit");
        return snapshotFields(root, "select");
      },
      restore(raw) {
        const root = document.getElementById("cs-permedit");
        restoreFields(root, "select", raw);
      },
      apply() {
        const root = document.getElementById("cs-permedit");
        if (!(root instanceof HTMLElement)) {
          return { ok: false, error: "Permissions form not found" };
        }
        const perms = {};
        root.querySelectorAll("select").forEach((select) => {
          if (!(select instanceof HTMLSelectElement)) return;
          const key = select.dataset.key || select.getAttribute("data-key");
          if (!key) return;
          perms[key] = parseFloat(select.value);
        });
        const socket = getSocket();
        if (socket && typeof socket.emit === "function") {
          socket.emit("setPermissions", perms);
          return { ok: true };
        }
        const saveBtn = root.querySelector("button.btn-primary, button.is-link");
        if (saveBtn instanceof HTMLElement) {
          saveBtn.click();
          return { ok: true };
        }
        return { ok: false, error: "Unable to setPermissions" };
      }
    };
  }

  function makeThemeAdminSection() {
    return {
      id: "theme-admin",
      snapshot() {
        const root = document.getElementById("cs-themeadmin") || document.querySelector("[data-btfw-theme-admin]");
        if (!(root instanceof HTMLElement)) return "";
        return snapshotFields(root, "input, select, textarea");
      },
      restore(raw) {
        const root = document.getElementById("cs-themeadmin") || document.querySelector("[data-btfw-theme-admin]");
        restoreFields(root, "input, select, textarea", raw);
      },
      apply() {
        const applyBtn = document.getElementById("btfw-theme-apply");
        if (applyBtn instanceof HTMLElement) {
          applyBtn.click();
          return { ok: true };
        }
        return { ok: true };
      }
    };
  }

  function ensureFooter(modal) {
    const footer = modal.querySelector(".modal-footer");
    if (!(footer instanceof HTMLElement)) return null;

    let status = footer.querySelector("#btfw-channeloptions-apply-status");
    if (!(status instanceof HTMLElement)) {
      status = document.createElement("span");
      status.id = "btfw-channeloptions-apply-status";
      status.className = "btfw-apply-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      footer.insertBefore(status, footer.firstChild);
    }

    let applyBtn = footer.querySelector("#btfw-channeloptions-apply");
    if (!(applyBtn instanceof HTMLButtonElement)) {
      applyBtn = document.createElement("button");
      applyBtn.type = "button";
      applyBtn.id = "btfw-channeloptions-apply";
      applyBtn.className = "button is-link";
      applyBtn.textContent = "Apply";
      setApplyButtonVisible(applyBtn, false);
      const closeBtn = footer.querySelector("[data-dismiss='modal'], .btn-default, .button:not(.is-link)");
      if (closeBtn instanceof HTMLElement) {
        footer.insertBefore(applyBtn, closeBtn);
      } else {
        footer.appendChild(applyBtn);
      }
    }
    return { footer, applyBtn, status };
  }

  function hideLegacySaves(modal) {
    hideLegacySave(modal.querySelector("#cs-motdsubmit"));
    hideLegacySave(modal.querySelector("#cs-csssubmit"));
    hideLegacySave(modal.querySelector("#cs-jssubmit"));
    const permRoot = modal.querySelector("#cs-permedit");
    if (permRoot) {
      permRoot.querySelectorAll("button.btn-primary, button.is-link").forEach((btn) => {
        if (btn instanceof HTMLElement && /save/i.test(btn.textContent || "")) {
          hideLegacySave(btn);
        }
      });
    }
  }

  function wire(modal) {
    if (!(modal instanceof HTMLElement) || modal.id !== "channeloptions") return;
    if (modal.dataset.btfwDirtyApplyWired === "1") {
      hideLegacySaves(modal);
      controller?.captureBaseline();
      return;
    }
    modal.dataset.btfwDirtyApplyWired = "1";

    const parts = ensureFooter(modal);
    if (!parts) return;
    hideLegacySaves(modal);

    const sections = [
      makeTextSection("motd", "cs-motdtext", "setMotd", "cs-motdsubmit", "motd"),
      makeTextSection("css", "cs-csstext", "setChannelCSS", "cs-csssubmit", "css"),
      makeTextSection("js", "cs-jstext", "setChannelJS", "cs-jssubmit", "js"),
      makePermissionsSection(),
      makeThemeAdminSection()
    ];

    controller?.dispose();
    controller = createDirtyApplyController({
      modal,
      applyButton: parts.applyBtn,
      sections,
      ignoreRoots: IGNORE_ROOTS,
      statusEl: parts.status,
      confirmDiscard: () => window.confirm("Discard unsaved channel settings?")
    });

    parts.applyBtn.addEventListener("click", (event) => {
      event.preventDefault();
      void controller?.applyAll();
    });

    const onHide = async (event) => {
      if (!controller?.isDirty()) return;
      const ok = await controller.tryClose();
      if (!ok) {
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          if (window.jQuery) window.jQuery(modal).modal("show");
        } catch (_) {}
      }
    };

    modal.addEventListener("hide.bs.modal", onHide);

    // Permissions form is built lazily — re-hide Save + refresh baseline when it appears
    const permRoot = modal.querySelector("#cs-permedit");
    if (permRoot && typeof MutationObserver === "function") {
      permsObserver?.disconnect();
      permsObserver = new MutationObserver(() => {
        hideLegacySaves(modal);
        controller?.recalculate();
      });
      permsObserver.observe(permRoot, { childList: true, subtree: true });
    }
  }

  function boot() {
    const existing = document.getElementById("channeloptions");
    if (existing) wire(existing);

    if (typeof MutationObserver === "function") {
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.id === "channeloptions") wire(node);
            const nested = node.querySelector?.("#channeloptions");
            if (nested instanceof HTMLElement) wire(nested);
          });
        }
      });
      mo.observe(document.documentElement, { childList: true, subtree: true });
    }

    document.addEventListener("show.bs.modal", (event) => {
      const modal = event?.target;
      if (modal instanceof HTMLElement && modal.id === "channeloptions") {
        wire(modal);
        hideLegacySaves(modal);
        controller?.captureBaseline();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  return {
    name: "feature:channelOptionsApply",
    markDirty: (sectionId) => controller?.markDirty(sectionId),
    recalculate: () => controller?.recalculate()
  };
});
