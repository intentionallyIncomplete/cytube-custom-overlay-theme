# Universal dirty → Apply settings system

**Date:** 2026-08-01  
**Updated:** 2026-08-02  
**Status:** Implemented on `feat/universal-dirty-apply`  
**Repos:** `cytube-custom-overlay-theme` (primary); `sync` only if needed to hide/relabel native Save controls  
**Scope lock:** Channel Options + Theme Settings use dirty → reveal **Apply**, **except** CyTube General / Admin options keep their existing **auto-save** behavior unchanged.

## Goal

Unify modal settings UX so:

1. For explicit-commit sections, edits do **not** persist until **Apply**.
2. When a change is detected in those sections, an **Apply** button is revealed.
3. **Apply** commits changes — either to `localStorage` (client prefs) or via CyTube socket APIs (channel config).
4. Labels **Save** are removed or renamed when they mean “commit settings”; keep only non-commit actions (e.g. **Save preset**).
5. **Exception:** Channel Options **General** and **Admin** tabs continue to auto-save via existing CyTube `setOptions` handlers (`sync/www/js/ui.js`). Do not intercept, buffer, or route them through Apply.

## Problem today

| Surface | Commit UX | Dirty? | Persist |
|---|---|---|---|
| Theme Settings | Always-on **Apply** | Partial draft only | `localStorage` |
| Theme preset row | **Save** | No | `localStorage` presets |
| Notification sounds | Theme Apply | Yes (draft/live) | `localStorage` |
| Channel theme admin | **Apply to Channel CSS & JS** | Yes (`dirty`) | Clicks CyTube CSS/JS Save |
| BillTube MOTD | **Save** | No | `setMotd` |
| CyTube MOTD / CSS / JS | **Save …** | No | sockets |
| CyTube Permissions | **Save** | No | `setPermissions` |
| CyTube General / Admin | Auto-save | N/A | `setOptions` on change / 1s debounce — **leave as-is** |
| Channel Options footer | **Close** only | N/A | — |

No shared dirty/Apply utility. Inconsistent button copy and persistence timing on explicit-commit surfaces.

## Approaches considered

### 1) Event-driven dirty bit only (like channel theme admin)

Any `input`/`change` sets `dirty = true`; Apply clears it.

- Pros: Simple, cheap, matches one existing BillTube pattern.
- Cons: Hard to revert on Close without also buffering values.

### 2) Draft object / live vs draft (like notification sounds)

All edits mutate a draft; UI reads draft; Apply copies draft → live + persist.

- Pros: Clean discard; easy preview; best for Theme Settings.
- Cons: Heavy to retrofit every CyTube tab’s DOM-bound state.

### 3) Hybrid controller + pluggable adapters (**recommended**)

Shared **DirtyApplyController** per modal:

- **Baseline snapshot** on open (serialized values per registered section).
- **Dirty** = current snapshot ≠ baseline (or section reports dirty).
- **Apply button** hidden until dirty; label always **Apply**.
- **Adapters** per section decide how to persist (`localStorage`, `socket.emit`, or temporary click of legacy submit).
- Optional **live preview** for Theme appearance only; Close without Apply reverts preview to baseline.
- **Auto-save sections are not registered** — General/Admin controls never flip modal dirty state and never go through Apply.

- Pros: One UX contract for explicit-commit tabs; leaves CyTube auto-save untouched; TypeScript-friendly.
- Cons: Channel Options has two persistence models (auto-save vs Apply) — document in UI copy if needed (“General options save automatically”).

**Recommendation:** Approach 3, with General/Admin excluded from the controller.

## Design

### UX contract (universal)

For each settings modal that participates (explicit-commit sections only):

1. On open: capture baseline; Apply hidden; no “unsaved” chrome.
2. On user edit in a **registered** section: mark dirty; **reveal Apply** in the modal footer (same style as Theme Settings `#btfw-ts-apply`).
3. On Apply: run all dirty section adapters; on full success, reset baseline, hide Apply, announce success (`aria-live`).
4. On Close / backdrop with dirty: confirm “Discard unsaved changes?” — Cancel keeps modal open; Confirm reverts registered sections to baseline and closes.
5. Replace per-tab **Save** buttons on explicit-commit tabs with footer Apply (temporary hidden click-bridge OK during migration).
6. Theme Settings instant-persist controls (ignore list, hover magnify) move behind Apply for consistency inside that modal.
7. **Auto-save carve-out:** edits to `.cs-checkbox` / `.cs-textbox` / `.cs-textbox-timeinput` (General/Admin) continue to emit `setOptions` immediately / debounced as today. They must be **excluded** from delegated dirty listeners (ignore those selectors or mark their panes `data-btfw-autosave="1"`).

**Copy:** Primary commit control is always **Apply**. Rename Theme “Save” preset control to **Save preset**.

### Modal coverage

#### A. Theme Settings (`#btfw-theme-modal`)

- Single footer **Apply** (already exists) — start **hidden** until dirty.
- Sections: Chat prefs, Notifications (sounds draft), General appearance, Layout, Ignore list, etc.
- Persist adapter: `localStorage` + existing `EVENTS.themeSettingsApply` bus.
- Appearance preview may update live while dirty; discard reverts via `themeRuntime` to last applied appearance.

#### B. Channel Options (`#channeloptions`)

- Inject footer **Apply** (hidden until dirty) beside Close via `feature-modal-skin` / new `feature:channel-options-apply`.
- Sections:

| Section | Today | After |
|---|---|---|
| General + Admin options | Auto `setOptions` | **Unchanged** — keep CyTube auto-save; do not register with DirtyApplyController |
| MOTD | Save MOTD | Dirty on textarea; Apply → `setMotd` |
| CSS | Save CSS | Dirty on textarea; Apply → `setChannelCSS` |
| JS | Save JS | Dirty on textarea; Apply → `setChannelJS` |
| Permissions | Save | Dirty on selects; Apply → `setPermissions` |
| Channel theme admin | Apply to Channel CSS & JS | Register as dirty section; modal Apply runs sync-into-CSS/JS then CSS/JS socket save |
| Chat filters / emotes | Per-row create/save | **Out of v1** (still CyTube micro-saves); follow-up |

**v1 includes:** MOTD, CSS, JS, Permissions, Theme admin tab, Theme Settings.  
**v1 excludes:** General/Admin auto-save changes; per-filter / per-emote row Saves.

Optional help text on General/Admin: “These options save automatically.”

#### C. BillTube MOTD editor modal

- Keep modal; unify footer to **Apply** (same controller pattern).

### Core module (TypeScript)

`src/lib/dirty-apply.ts` exported through `util:dirtyApply` BTFW module.

```ts
export type PersistResult =
  | { ok: true }
  | { ok: false; error: string };

export interface DirtySection {
  id: string;
  /** Capture serializable baseline for compare + revert */
  snapshot(): string;
  /** Restore DOM/state from snapshot string */
  restore(snapshot: string): void;
  /** Commit current UI state */
  apply(): PersistResult | Promise<PersistResult>;
}

export interface DirtyApplyControllerOptions {
  modal: HTMLElement;
  applyButton: HTMLButtonElement;
  sections: DirtySection[];
  /** Selectors / roots that auto-save and must not mark dirty */
  ignoreRoots?: string[];
  confirmDiscard?: () => boolean | Promise<boolean>;
}

export interface DirtyApplyController {
  isDirty(): boolean;
  recalculate(): void;
  applyAll(): Promise<PersistResult>;
  dispose(): void;
}
```

Behavior:

- `recalculate()` compares each section `snapshot()` to baseline; sets `data-btfw-dirty="1"` on modal; toggles Apply `hidden`.
- Delegated `input`/`change` inside modal → `recalculate()`, but **skip** events from auto-save roots (General/Admin).
- Sections may call `controller.markDirty()` for Summernote / custom widgets.
- `applyAll()` applies **only dirty** sections sequentially; continue on error; surface first error + count in footer status.
- Strict TS: no `any`; type guards for DOM/events; unit tests for dirty detection, ignore-roots, and persist results.

### CyTube General / Admin auto-save

**Do not change.**

- Leave `sync/www/js/ui.js` handlers for `.cs-checkbox`, `.cs-textbox`, and `.cs-textbox-timeinput` as-is.
- No BillTube `.off()` intercept for those handlers.
- No sync PR required for auto-save removal.
- DirtyApplyController must treat those controls as outside the Apply system so toggling a General checkbox does not reveal Apply.

Permissions / MOTD / CSS / JS Save buttons are still replaced by footer Apply (BillTube wrap; optional small sync relabel later).

### Apply button placement & styling

- Theme Settings: keep `#btfw-ts-apply` in `.modal-card-foot`; default `hidden` until dirty.
- Channel Options: inject into `.modal-footer`: `[ Apply ] [ Close ]` using `button is-link`.
- Visibility: `hidden` when clean; visible when dirty.
- Loading: `aria-busy` on Apply during async work; disable double-submit.

### Close / navigation guards

- Dirty + Close / Escape / backdrop → confirm discard (registered sections only).
- Closing while only General/Admin were edited (auto-saved) → **no** discard prompt.
- `beforeunload` when Theme Settings or Channel Options has dirty **Apply-tracked** sections (include for MOTD/CSS/JS risk).
- Tab switches do not auto-apply; dirty state is modal-global across Apply-tracked sections.

### Error handling

- Socket failure: keep dirty true; Apply stays visible; footer `role="status"` error.
- Partial success: baseline updates only for succeeded sections.
- Validation: block Apply for invalid section state; do not emit bad payloads.

### Testing

Unit (Vitest, strict TS):

- Snapshot equality / dirty detection.
- Events inside `ignoreRoots` do not mark dirty.
- `applyAll` success, partial failure, empty dirty.

Integration / manual:

1. Theme Settings: edit → Apply appears → Apply persists; discard restores.
2. Theme appearance preview + discard.
3. Channel Options General: toggle checkbox → still auto-saves via `setOptions`; Apply stays hidden.
4. MOTD / CSS / JS / Permissions: edit → Apply appears → Apply emits; inline Save gone.
5. Theme admin dirty merges into footer Apply.
6. Multi-tab dirty: MOTD + Permissions → one Apply commits both; General edits do not add dirty.
7. Discard confirm only when Apply-tracked sections are dirty.

## Phasing

| Phase | Deliverable |
|---|---|
| **P0** | `dirty-apply` TS util + unit tests (including ignore-roots) |
| **P1** | Theme Settings: hide Apply until dirty; remove instant persists; rename Save preset |
| **P2** | Channel Options footer Apply; wrap MOTD/CSS/JS/Permissions; kill those inline Saves |
| **P3** | Fold channel theme admin into the same controller; BillTube MOTD modal → Apply |

No phase to disable General auto-save. P0–P2 can ship as one BillTube PR if sized well.

## Out of scope

- Changing or removing CyTube General / Admin **auto-save**.
- Chat filter / emote **row** Save micro-flows (follow-up).
- User Options (`#useroptions`) (follow-up unless expanded).
- GIF picker / playlist modals.
- Server-side permission checks (unchanged).

## Success criteria

- No **Save** button meaning “commit settings” on Theme Settings or on Channel Options **explicit-commit** tabs (except **Save preset**).
- Apply is revealed only when Apply-tracked sections are dirty.
- General / Admin options continue to auto-save exactly as CyTube does today.
- Discard on close restores baseline for Apply-tracked sections; no discard prompt for auto-save-only edits.
- Shared TS controller is the only dirty/Apply mechanism for covered explicit-commit surfaces.

## Open decisions (resolved in this spec)

| Topic | Resolution |
|---|---|
| Scope | Channel Options + Theme Settings; **keep General/Admin auto-save** |
| Architecture | Hybrid controller + section adapters |
| Apply granularity | One Apply per modal (all dirty **registered** sections) |
| Instant Theme toggles | Move behind Apply |
| Filter/emote row Saves | Deferred |
| sync auto-save changes | **None** — leave `ui.js` auto-save alone |
