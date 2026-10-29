import { escapeHtml } from "../lib/escape-html.js";
import {
  bundleIdFromMediaId,
  classifyLink,
  toVtt,
  type LinkClass
} from "../lib/subtitle-bundle.js";

const DEFAULT_ENDPOINT = "https://subtitle-bundles.ianbryanz.workers.dev";
/** Google Drive index worker; links on this origin are resolved server-side. */
const DEFAULT_DRIVE_ORIGIN = "https://quiglysmovies.ianbryanz.workers.dev";
const STORAGE_KEY = "btfw:subtitle-bundles";
const IN_FLIGHT_MS = 30000;
const DURATION_TIMEOUT_MS = 10000;
const ROW_ID = "btfw-subtitle-bundle";
const HINT_TEXT = "Subtitles can only be attached to direct video files and Google Drive index links.";

interface OwnedBundle {
  deleteToken: string;
  uid: string | null;
  manifestUrl: string;
}

interface BundleCreated {
  id: string;
  manifestUrl: string;
  deleteToken: string;
}

interface NotifyError {
  (opts: { title: string; html: string; timeout: number }): void;
}

const submittedAt = new Map<string, number>();
const boundQueueButtons = new WeakSet<Element>();
let lastSubmittedId: string | null = null;
let bypassOnce = false;
let busy = false;
let socketWired = false;
let repairTimer = 0;

window.BTFW.define("feature:subtitle-bundle", [], async () => {
  function bundleEndpoint(): string {
    try {
      const fromCfg = window.BTFW_CONFIG?.integrations?.subtitleBundles?.endpoint;
      const base = typeof fromCfg === "string" && fromCfg.trim() ? fromCfg.trim() : DEFAULT_ENDPOINT;
      return base.replace(/\/+$/, "");
    } catch {
      return DEFAULT_ENDPOINT;
    }
  }

  function driveOrigin(): string {
    try {
      const fromCfg = window.BTFW_CONFIG?.integrations?.subtitleBundles?.driveOrigin;
      return new URL(typeof fromCfg === "string" && fromCfg.trim() ? fromCfg.trim() : DEFAULT_DRIVE_ORIGIN).origin;
    } catch {
      return DEFAULT_DRIVE_ORIGIN;
    }
  }

  function endpointOrigin(): string {
    try {
      return new URL(bundleEndpoint()).origin;
    } catch {
      return "";
    }
  }

  function loadOwned(): Record<string, OwnedBundle> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return {};
      const out: Record<string, OwnedBundle> = {};
      for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
        if (!value || typeof value !== "object") continue;
        const row = value as Partial<OwnedBundle>;
        if (typeof row.deleteToken !== "string" || typeof row.manifestUrl !== "string") continue;
        out[id] = {
          deleteToken: row.deleteToken,
          uid: row.uid == null ? null : String(row.uid),
          manifestUrl: row.manifestUrl
        };
      }
      return out;
    } catch {
      return {};
    }
  }

  function saveOwned(owned: Record<string, OwnedBundle>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(owned));
    } catch {
      /* quota or private mode */
    }
  }

  function forgetBundle(id: string, token: string): void {
    void fetch(`${bundleEndpoint()}/bundle/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  }

  function dropOwned(id: string): void {
    const owned = loadOwned();
    const row = owned[id];
    if (!row) return;
    delete owned[id];
    saveOwned(owned);
    submittedAt.delete(id);
    forgetBundle(id, row.deleteToken);
    if (lastSubmittedId === id) lastSubmittedId = null;
  }

  /** CyTube emits `queue` as `{ item: { uid, media }, after }`. */
  function onQueue(payload: unknown): void {
    if (!payload || typeof payload !== "object") return;
    const rec = (payload as { item?: { uid?: unknown; media?: { id?: unknown } } }).item;
    if (!rec || typeof rec !== "object") return;
    const mediaId = rec.media && rec.media.id != null ? String(rec.media.id) : "";
    const id = bundleIdFromMediaId(mediaId, endpointOrigin());
    if (!id) return;
    const owned = loadOwned();
    const row = owned[id];
    if (!row || rec.uid == null) return;
    row.uid = String(rec.uid);
    owned[id] = row;
    saveOwned(owned);
  }

  function onQueueFail(): void {
    const id = lastSubmittedId;
    if (!id) return;
    const row = loadOwned()[id];
    if (!row || row.uid != null) return;
    dropOwned(id);
  }

  function onDelete(payload: unknown): void {
    if (!payload || typeof payload !== "object" || !("uid" in payload)) return;
    const uid = (payload as { uid?: unknown }).uid;
    if (uid == null) return;
    const wanted = String(uid);
    const owned = loadOwned();
    for (const [id, row] of Object.entries(owned)) {
      if (row.uid === wanted) dropOwned(id);
    }
  }

  function onPlaylist(items: unknown): void {
    if (!Array.isArray(items)) return;
    const uids = new Set<string>();
    const mediaIds = new Set<string>();
    for (const item of items) {
      if (!item || typeof item !== "object") continue;
      const rec = item as { uid?: unknown; media?: { id?: unknown } };
      if (rec.uid != null) uids.add(String(rec.uid));
      if (rec.media && rec.media.id != null) mediaIds.add(String(rec.media.id));
    }
    const now = Date.now();
    const owned = loadOwned();
    for (const [id, row] of Object.entries(owned)) {
      if (row.uid == null && now - (submittedAt.get(id) || 0) < IN_FLIGHT_MS) continue;
      const uidMissing = row.uid != null && !uids.has(row.uid);
      const mediaMissing = !mediaIds.has(row.manifestUrl) && !mediaIds.has(id);
      if (uidMissing || mediaMissing) dropOwned(id);
    }
  }

  function wireSocket(): void {
    if (socketWired) return;
    const socket = window.socket;
    if (!socket || typeof socket.on !== "function") return;
    socketWired = true;
    socket.on("queue", onQueue);
    socket.on("queueFail", onQueueFail);
    socket.on("delete", onDelete);
    socket.on("playlist", onPlaylist);
    // The join-time `playlist` event usually arrives before this module boots,
    // so ask for it again to reconcile bundles removed while we were away.
    if (Object.keys(loadOwned()).length > 0 && typeof socket.emit === "function") {
      socket.emit("requestPlaylist");
    }
  }

  function toast(message: string): void {
    const notify = (window as Window & { BTFW_notify?: { error?: NotifyError } }).BTFW_notify;
    if (notify && typeof notify.error === "function") {
      notify.error({
        title: "Subtitles",
        html: `<span>${escapeHtml(message)}</span>`,
        timeout: 5200
      });
      return;
    }
    let el = document.getElementById("btfw-subtitle-bundle-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "btfw-subtitle-bundle-toast";
      el.className = "btfw-subtitle-bundle__toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
  }

  function mediaInput(): HTMLInputElement | null {
    const el = document.getElementById("mediaurl");
    return el instanceof HTMLInputElement ? el : null;
  }

  function fileInput(): HTMLInputElement | null {
    const el = document.getElementById("btfw-subtitle-bundle-file");
    return el instanceof HTMLInputElement ? el : null;
  }

  function updateHint(): void {
    const hint = document.getElementById("btfw-subtitle-bundle-hint");
    if (!hint) return;
    const value = (mediaInput()?.value || "").trim();
    const show = value.length > 0 && classifyLink(value, driveOrigin()) === "unsupported";
    hint.hidden = !show;
  }

  function syncChip(): void {
    const chip = document.getElementById("btfw-subtitle-bundle-chip");
    const clear = document.getElementById("btfw-subtitle-bundle-clear");
    const file = fileInput()?.files?.[0];
    if (chip) {
      chip.textContent = file ? file.name : "";
      chip.hidden = !file;
    }
    if (clear) clear.hidden = !file;
  }

  function clearFile(): void {
    const input = fileInput();
    if (input) input.value = "";
    syncChip();
  }

  function setQueueButtonsDisabled(disabled: boolean): void {
    for (const id of ["queue_next", "queue_end"]) {
      const btn = document.getElementById(id);
      if (btn instanceof HTMLButtonElement) btn.disabled = disabled;
    }
  }

  function probeDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      let settled = false;
      const finish = (value: number): void => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        video.onloadedmetadata = null;
        video.onerror = null;
        video.removeAttribute("src");
        try {
          video.load();
        } catch {
          /* element was never inserted */
        }
        resolve(value);
      };
      const timer = window.setTimeout(() => finish(0), DURATION_TIMEOUT_MS);
      video.onloadedmetadata = () => {
        const duration = video.duration;
        finish(Number.isFinite(duration) && duration > 0 ? duration : 0);
      };
      video.onerror = () => finish(0);
      video.src = url;
    });
  }

  function isCreated(value: unknown): value is BundleCreated {
    if (!value || typeof value !== "object") return false;
    const row = value as Partial<BundleCreated>;
    return typeof row.id === "string" && typeof row.manifestUrl === "string" && typeof row.deleteToken === "string";
  }

  async function submitBundle(button: HTMLButtonElement): Promise<void> {
    const file = fileInput()?.files?.[0];
    if (!file || busy) return;
    busy = true;
    setQueueButtonsDisabled(true);
    try {
      const videoUrl = (mediaInput()?.value || "").trim();
      const kind: LinkClass = classifyLink(videoUrl, driveOrigin());
      if (kind === "unsupported") {
        toast(HINT_TEXT);
        return;
      }
      const vtt = toVtt(file.name, await file.text());
      const duration = kind === "direct" ? await probeDuration(videoUrl) : 0;
      const label = file.name.replace(/\.[^.]+$/, "") || file.name;
      const response = await fetch(`${bundleEndpoint()}/bundle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, vtt, label, duration })
      });
      if (response.status !== 201) {
        throw new Error(`Subtitle bundle failed (${response.status})`);
      }
      const data: unknown = await response.json();
      if (!isCreated(data)) throw new Error("Subtitle bundle response was incomplete");
      const owned = loadOwned();
      owned[data.id] = { deleteToken: data.deleteToken, uid: null, manifestUrl: data.manifestUrl };
      saveOwned(owned);
      submittedAt.set(data.id, Date.now());
      lastSubmittedId = data.id;
      const media = mediaInput();
      if (media) media.value = data.manifestUrl;
      clearFile();
      setQueueButtonsDisabled(false);
      bypassOnce = true;
      button.click();
    } catch (err) {
      console.error(err);
      toast("Could not attach subtitles.");
    } finally {
      busy = false;
      setQueueButtonsDisabled(false);
    }
  }

  function onQueueClick(event: Event): void {
    if (bypassOnce) {
      bypassOnce = false;
      return;
    }
    if (busy) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const file = fileInput()?.files?.[0];
    if (!file) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const button = event.currentTarget;
    if (!(button instanceof HTMLButtonElement)) return;
    void submitBundle(button);
  }

  function bindQueueButtons(): void {
    for (const id of ["queue_next", "queue_end"]) {
      const btn = document.getElementById(id);
      if (!btn || boundQueueButtons.has(btn)) continue;
      boundQueueButtons.add(btn);
      btn.addEventListener("click", onQueueClick, true);
    }
  }

  function ensureRow(): void {
    const host = document.getElementById("addfromurl");
    if (!host) return;
    let row = document.getElementById(ROW_ID);
    if (!row) {
      row = document.createElement("div");
      row.id = ROW_ID;
      row.className = "btfw-subtitle-bundle";

      const attach = document.createElement("button");
      attach.type = "button";
      attach.className = "btn btn-sm btfw-subtitle-bundle__attach";
      attach.textContent = "Attach subtitles (.vtt/.srt)";

      const input = document.createElement("input");
      input.type = "file";
      input.id = "btfw-subtitle-bundle-file";
      input.className = "btfw-subtitle-bundle__file";
      input.accept = ".vtt,.srt";
      input.addEventListener("change", () => syncChip());
      attach.addEventListener("click", () => input.click());

      const chip = document.createElement("span");
      chip.id = "btfw-subtitle-bundle-chip";
      chip.className = "btfw-subtitle-bundle__chip";
      chip.hidden = true;

      const clear = document.createElement("button");
      clear.type = "button";
      clear.id = "btfw-subtitle-bundle-clear";
      clear.className = "btn btn-sm btfw-subtitle-bundle__clear";
      clear.textContent = "Clear";
      clear.hidden = true;
      clear.addEventListener("click", () => clearFile());

      const hint = document.createElement("p");
      hint.id = "btfw-subtitle-bundle-hint";
      hint.className = "btfw-subtitle-bundle__hint";
      hint.hidden = true;
      hint.textContent = HINT_TEXT;

      row.append(attach, input, chip, clear, hint);
    }

    const group = host.querySelector(":scope > .input-group");
    const before = group ? group.nextSibling : null;
    if (row.parentElement !== host || (group && row.previousSibling !== group)) {
      host.insertBefore(row, before);
    }

    const media = mediaInput();
    if (media && media.dataset.btfwSubtitleHint !== "1") {
      media.dataset.btfwSubtitleHint = "1";
      media.addEventListener("input", updateHint);
    }
    updateHint();
  }

  function repair(): void {
    ensureRow();
    bindQueueButtons();
    wireSocket();
  }

  function boot(): void {
    repair();
    const root = document.body;
    if (!root || root.dataset.btfwSubtitleBundleObs === "1") return;
    root.dataset.btfwSubtitleBundleObs = "1";
    const observer = new MutationObserver(() => {
      window.clearTimeout(repairTimer);
      repairTimer = window.setTimeout(repair, 50);
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  return { name: "feature:subtitle-bundle" };
});
