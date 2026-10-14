/**
 * MOTD sub-domain of the feature stack (#228 Phase 2).
 *
 * Owns everything MOTD: structure normalization, content detection,
 * stack-panel adoption, visibility sync, observers, and the setMotd
 * socket handler (with re-sanitization of CyTube's raw paint).
 *
 * Extracted verbatim from src/modules/feature-stack.js — behavior-preserving.
 * The shared stack shell (createGroupItem, save) is injected via context.
 */

import { sanitizeHtml } from "../../lib/escape-html.js";
import {
  MOTD_VISIBILITY_KEY,
  GROUPS,
  getStoredVisibility,
  saveStackOrder,
  type StackGroup,
  type StackPanelElement
} from "../../lib/stack-core.js";
import { getDefaultPollOpen } from "../../lib/stack-poll-visibility.js";

/** Pieces of the shared stack shell the MOTD domain needs. */
export interface StackMotdContext {
  createGroupItem(group: StackGroup, elements: Element[]): HTMLElement | null;
  /** Shell's ensureStack() — returns null before the stack exists. */
  ensureStackRefs(): StackRefs | null;
}

/** Refs returned by the shell's ensureStack(). */
export interface StackRefs {
  list: HTMLElement | null;
  footer: Element | null;
}

export interface StackMotdDomain {
  isMotdHtmlEmpty(html?: string): boolean;
  hasMotdContent(doc?: Document): boolean;
  resolveMotdHost(doc?: Document): HTMLElement | null;
  normalizeMotdStructure(force?: boolean): { motdwrap: HTMLElement; motd: HTMLElement } | null;
  ensureMotdStackPanel(refs: StackRefs | null): void;
  syncMotdWrapVisibility(motdGroup?: Element | null): void;
  scheduleMotdSync(refs: StackRefs | null): void;
  wireMotdObservers(refs: StackRefs | null): void;
  wireMotdSocket(refs: StackRefs | null): void;
  applyMotdUpdate(html: string): void;
}

// Regex-based tag strip, deliberately not `probe.innerHTML = raw` + read `.textContent`.
// MOTD content is admin-authored HTML, and setting innerHTML on a live-document element
// still triggers resource-loading event handlers like `<img src=x onerror=...>` even when
// that element is never attached to the visible DOM — "detached" is not the same as "inert".
// This is a same-behavior, environment-independent replacement (previously branched on
// `typeof document`); the entity handling here mirrors tests/unit/motd-stack.test.js.
function isMotdHtmlEmpty(html = ""): boolean {
  const raw = String(html || "").trim();
  if (!raw) return true;
  const text = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return !text;
}

function hasMotdContent(doc: Document = document): boolean {
  if (!doc || typeof doc.querySelector !== "function") return false;
  const motd = resolveMotdHost(doc);
  if (!motd) return false;
  return !isMotdHtmlEmpty(motd.innerHTML || "");
}

function resolveMotdHost(doc: Document = document): HTMLElement | null {
  if (!doc || typeof doc.getElementById !== "function") return null;
  const motdwrap = doc.getElementById("motdwrap");
  if (!motdwrap) return doc.getElementById("motd");
  const direct = motdwrap.querySelector<HTMLElement>(":scope > #motd");
  if (direct) return direct;
  return motdwrap.querySelector<HTMLElement>("#motd") || doc.getElementById("motd");
}

function normalizeMotdStructure(force = false): { motdwrap: HTMLElement; motd: HTMLElement } | null {
  const motdwrap = document.getElementById("motdwrap");
  if (!motdwrap) return null;
  if (!force && motdwrap.dataset.btfwMotdNormalized === "1") {
    const motd = motdwrap.querySelector<HTMLElement>(":scope > #motd");
    return motd ? { motdwrap, motd } : null;
  }

  const toggle = document.getElementById("togglemotd");
  if (toggle && toggle.closest("#motd")) {
    motdwrap.insertBefore(toggle, motdwrap.firstChild);
  }

  const extraParts: string[] = [];
  motdwrap.querySelectorAll(".btfw-motd-editrow").forEach((row) => {
    const text = (row.textContent || "").trim();
    if (text) extraParts.push(`<p>${text}</p>`);
    row.remove();
  });

  motdwrap.querySelectorAll(".col-lg-12, .col-md-12, .clear").forEach((el) => {
    if (el.contains(motdwrap) || el === motdwrap) return;
    if (el.querySelector("#motd") || el.classList.contains("btfw-motd-editrow")) {
      el.querySelectorAll<HTMLElement>("#motd").forEach((inner) => {
        if ((inner.innerHTML || "").trim()) extraParts.push(inner.innerHTML);
      });
    }
    el.remove();
  });

  let motd = motdwrap.querySelector<HTMLElement>(":scope > #motd");
  if (!motd) {
    motd = document.createElement("div");
    motd.id = "motd";
    motdwrap.appendChild(motd);
  }

  motdwrap.querySelectorAll<HTMLElement>("#motd").forEach((node) => {
    if (node === motd) return;
    if ((node.innerHTML || "").trim()) extraParts.push(node.innerHTML);
    node.remove();
  });

  motd.querySelectorAll("#togglemotd, .clear, .col-lg-12, .col-md-12, .btfw-motd-editrow").forEach((el) => {
    el.remove();
  });
  motd.querySelectorAll<HTMLElement>("#motd").forEach((inner) => {
    if ((inner.innerHTML || "").trim()) extraParts.push(inner.innerHTML);
    inner.remove();
  });

  document.querySelectorAll("#togglemotd").forEach((btn, index) => {
    if (index === 0) return;
    btn.remove();
  });

  if (extraParts.length) {
    const merged = extraParts.join("").trim();
    if (merged && isMotdHtmlEmpty(motd.innerHTML)) {
      motd.innerHTML = sanitizeHtml(merged);
    } else if (merged) {
      motd.innerHTML += sanitizeHtml(merged);
    }
  }

  motdwrap.dataset.btfwMotdNormalized = "1";
  return { motdwrap, motd };
}

export function createStackMotd(ctx: StackMotdContext): StackMotdDomain {
  let motdSyncTimer: ReturnType<typeof setTimeout> | null = null;
  let motdObserverWired = false;
  let motdSocketWired = false;

  function ensureMotdStackPanel(refs: StackRefs | null): void {
    normalizeMotdStructure();

    const motdwrap = document.getElementById("motdwrap");
    if (!motdwrap) return;

    const list = refs && refs.list;
    if (!list) return;

    let motdGroup = document.querySelector<StackPanelElement>('.btfw-stack-item[data-bind="motd-group"]');
    if (!motdGroup) {
      const group = GROUPS.find((g) => g.id === "motd-group");
      if (!group) return;
      motdGroup = ctx.createGroupItem(group, [motdwrap]);
      if (motdGroup) {
        list.appendChild(motdGroup);
        saveStackOrder(list);
      }
    } else {
      const body = motdGroup.querySelector(".btfw-group-body");
      if (body && !body.contains(motdwrap)) {
        body.appendChild(motdwrap);
      }
    }

    syncMotdWrapVisibility(motdGroup);
  }

  function syncMotdWrapVisibility(motdGroup?: Element | null): void {
    const motdwrap = document.getElementById("motdwrap");
    if (!motdwrap) return;

    const hasContent = hasMotdContent();
    motdwrap.classList.toggle("btfw-motd-empty", !hasContent);
    motdwrap.toggleAttribute("hidden", !hasContent);
    motdwrap.setAttribute("aria-hidden", hasContent ? "false" : "true");

    if (hasContent) {
      motdwrap.style.removeProperty("display");
      const motd = resolveMotdHost();
      if (motd) motd.style.removeProperty("display");
    }

    if (!motdGroup) {
      motdGroup = document.querySelector('.btfw-stack-item[data-bind="motd-group"]');
    }
    if (motdGroup && hasContent) {
      const stored = getStoredVisibility(MOTD_VISIBILITY_KEY);
      const shouldOpen = getDefaultPollOpen(stored, true);
      const panel = motdGroup as StackPanelElement;
      if (panel._btfwSetOpenState) {
        panel._btfwSetOpenState(shouldOpen, { persist: false });
      } else {
        panel.dataset.open = shouldOpen ? "true" : "false";
        panel.classList.toggle("is-open", shouldOpen);
      }
    }
  }

  function scheduleMotdSync(refs: StackRefs | null): void {
    if (motdSyncTimer) clearTimeout(motdSyncTimer);
    motdSyncTimer = setTimeout(() => {
      motdSyncTimer = null;
      ensureMotdStackPanel(refs);
    }, 50);
  }

  function wireMotdObservers(refs: StackRefs | null): void {
    const motd = resolveMotdHost();
    if (!motd) return;

    if (!motdObserverWired) {
      motdObserverWired = true;
      const observer = new MutationObserver(() => {
        scheduleMotdSync(refs);
      });
      observer.observe(motd, { childList: true, subtree: true, characterData: true });
    }
  }

  function wireMotdSocket(refs: StackRefs | null): void {
    if (motdSocketWired || !window.socket || !window.socket.on) return;
    motdSocketWired = true;
    // CyTube's callbacks.js `setMotd` does `$("#motd").html(motd)` with the raw
    // server payload. Theme socket handlers typically register after CyTube's, so
    // by the time this runs live `#motd` already holds unsanitized HTML. Re-sanitize
    // the painted markup so viewers are not left with the raw XSS payload.
    window.socket.on("setMotd", (payload) => {
      const html =
        typeof payload === "string"
          ? payload
          : payload && typeof payload === "object" && typeof (payload as { motd?: unknown }).motd === "string"
            ? (payload as { motd: string }).motd
            : null;
      const motd = resolveMotdHost();
      if (motd) {
        const source = html !== null ? html : motd.innerHTML;
        const cleaned = sanitizeHtml(source);
        if (motd.innerHTML !== cleaned) motd.innerHTML = cleaned;
      }
      scheduleMotdSync(refs);
    });
  }

  function applyMotdUpdate(html: string): void {
    const refs = ctx.ensureStackRefs();
    const motdwrap = document.getElementById("motdwrap");
    if (motdwrap) delete motdwrap.dataset.btfwMotdNormalized;
    const resolved = normalizeMotdStructure(true);
    const motd = resolved?.motd || resolveMotdHost();
    if (motd && typeof html === "string") {
      motd.innerHTML = sanitizeHtml(html);
    }
    const csMotd = document.getElementById("cs-motdtext") as HTMLTextAreaElement | null;
    if (csMotd && typeof html === "string") csMotd.value = html;
    if (refs) scheduleMotdSync(refs);
  }

  return {
    isMotdHtmlEmpty,
    hasMotdContent,
    resolveMotdHost,
    normalizeMotdStructure,
    ensureMotdStackPanel,
    syncMotdWrapVisibility,
    scheduleMotdSync,
    wireMotdObservers,
    wireMotdSocket,
    applyMotdUpdate
  };
}
