# Universal dirty → Apply settings system

**Date:** 2026-08-01  
**Status:** Draft — awaiting user review  
**Repos:** `cytube-custom-overlay-theme` (primary), `sync` (CyTube client behavior for Channel Options)  
**Scope lock:** **C** — Everything editable in Channel Options + Theme Settings, including converting General’s auto-save to explicit Apply

## Goal

Unify modal settings UX so:

1. Edits do **not** persist immediately.
2. When any change is detected, an **Apply** button is revealed (or enabled).
3. **Apply** commits changes — either to `localStorage` (client prefs) or via CyTube socket APIs (channel config).
4. Labels **Save** are removed or renamed when they mean “commit settings”; keep only non-commit actions (e.g. “Save preset”).

Modern-web guidance for this domain is thin (closest guides are post-interaction form validation). Design therefore follows Baseline forms patterns (`:user-invalid` only after interaction for validation) plus existing BillTube drafts (`feature-channel-theme-admin` dirty flag, `feature-notification-sounds` draft/live).

TypeScript work must follow project strict mode: explicit return types, no `any`, no non-null assertions, type guards for DOM/external payloads, unit tests for guards and dirty comparison helpers.

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
| CyTube General / Admin | Auto-save | N/A | `setOptions` on change / 1s debounce |
| Channel Options footer | **Close** only | N/A | — |

No shared dirty/Apply utility. Inconsistent button copy and persistence timing.

## Approaches considered

### 1) Event-driven dirty bit only (like channel theme admin)

Any `input`/`change` sets `dirty = true`; Apply clears it.

- Pros: Simple, cheap, matches one existing BillTube pattern.
- Cons: Hard to revert on Close; hard to know *what* to emit for General options without also buffering values.

### 2) Draft object / live vs draft (like notification sounds)

All edits mutate a draft; UI reads draft; Apply copies draft → live + persist.

- Pros: Clean discard; easy preview; best for Theme Settings.
- Cons: Heavy to retrofit every CyTube tab’s DOM-bound state.

### 3) Hybrid controller + pluggable adapters (**recommended**)

Shared **DirtyApplyController** per modal:

- **Baseline snapshot** on open (serialized values per registered section).
- **Dirty** = current snapshot ≠ baseline (or section reports dirty).
- **Apply button** hidden/disabled until dirty; label always **Apply**.
- **Adapters** per section decide how to persist (`localStorage`, `socket.emit`, or click legacy submit once then retire).
- Optional **live preview** stays allowed for Theme General appearance only; Close without Apply reverts preview to baseline.

- Pros: One UX contract; works for BillTube + CyTube-wrapped tabs; TypeScript-friendly; can phase adapters.
- Cons: More upfront design; General auto-save requires intercepting CyTube handlers (and ideally a sync change).

**Recommendation:** Approach 3.

## Design

### UX contract (universal)

For each settings modal that participates:

1. On open: capture baseline; Apply hidden (or disabled + `aria-disabled`); no “unsaved” chrome.
2. On user edit: mark dirty; **reveal Apply** in the modal footer (primary link style, same as Theme Settings `#btfw-ts-apply`).
3. On Apply: run all dirty section adapters; on full success, reset baseline, hide Apply, announce success (`aria-live`).
4. On Close / backdrop with dirty: confirm “Discard unsaved changes?” — Cancel keeps modal open; Confirm reverts DOM to baseline (or reloads section from last applied) and closes.
5. Replace per-tab **Save** buttons with nothing (footer Apply owns commit) or a visually hidden compatibility click target only if a temporary bridge needs it.
6. Instant-persist exceptions are **forbidden** inside these modals going forward (ignore list add/remove and hover-magnify live toggles in Theme Settings must move behind Apply or become explicit “apply on change” only outside this system — **decision: gate them behind Apply** for consistency).

**Copy:** Primary commit control is always **Apply**. Rename Theme “Save” preset control to **Save preset** (creates/updates a named preset; does not replace modal Apply).

### Modal coverage

#### A. Theme Settings (`#btfw-theme-modal`)

- Single footer **Apply** (already exists) — start **hidden** until dirty.
- Sections: Chat prefs, Notifications (sounds draft), General appearance, Layout, Ignore list, etc.
- Persist adapter: `localStorage` + existing `EVENTS.themeSettingsApply` bus.
- Appearance preview may update live while dirty; discard reverts via `themeRuntime` to last applied appearance.

#### B. Channel Options (`#channeloptions`)

- Inject footer **Apply** (hidden until dirty) beside Close via `feature-modal-skin` / new `feature:channel-options-apply`.
- Sections (each registers an adapter):

| Section | Today | After |
|---|---|---|
| General + Admin options | Auto `setOptions` | Buffer edits; Apply emits one or more `setOptions` payloads |
| MOTD | Save MOTD | Dirty on textarea; Apply → `setMotd` |
| CSS | Save CSS | Dirty on textarea; Apply → `setChannelCSS` |
| JS | Save JS | Dirty on textarea; Apply → `setChannelJS` |
| Permissions | Save | Dirty on selects; Apply → `setPermissions` |
| Channel theme admin | Apply to Channel CSS & JS | Becomes a dirty section; modal Apply runs its sync-into-CSS/JS then CSS/JS socket save (or section Apply merges into the same footer Apply) |
| Chat filters / emotes | Per-row create/save | **Out of v1** for row-level CRUD (still CyTube micro-saves); document as follow-up. Filter *import* bulk actions stay explicit buttons. |

**v1 includes:** General, Admin, MOTD, CSS, JS, Permissions, Theme admin tab.  
**v1 excludes:** Per-filter / per-emote row Saves (different interaction model).

#### C. BillTube MOTD editor modal

- Rename Save → use same footer Apply pattern (or remove modal if Channel Options MOTD is enough — **keep modal**, unify to Apply).

### Core module (TypeScript)

New library (names illustrative):

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

- `recalculate()` compares each section `snapshot()` to baseline map; sets `data-btfw-dirty="1"` on modal; toggles Apply visibility (`hidden` attribute + CSS).
- Listen for `input`/`change` inside modal (delegated) → `recalculate()`.
- Sections may call `controller.markDirty()` for non-input edits (Summernote, custom widgets).
- `applyAll()` applies **only dirty** sections sequentially; stop or continue-on-error — **decision: continue all, surface first error + count** via status text.
- Strict TS: no `any`; narrow `event.target` with type guards; test `isDirty`, snapshot equality, and clamp/error result helpers.

### Bridging CyTube General auto-save

**Required for scope C.**

1. **BillTube intercept (required when theme loads):**
   - `$(".cs-checkbox").off("change")` / textbox `keyup` handlers that emit `setOptions` (same selectors as `sync/www/js/ui.js` ~619–683).
   - Re-bind to “update draft + mark dirty” only.
   - On Apply: build `setOptions` object from current General/Admin controls and `socket.emit("setOptions", data)`.

2. **sync repo change (required for vanilla CyTube + clean ownership):**
   - Remove auto-emit from `.cs-checkbox` / `.cs-textbox` / `.cs-textbox-timeinput` in `www/js/ui.js`.
   - Add a single Channel Options Apply path *or* leave Apply entirely to BillTube and document that stock CyTube without BillTube keeps a reduced UX until sync ships an Apply button.
   - **Decision:** sync PR removes auto-save and per-tab Save buttons’ direct emits; introduces `#cs-options-apply` (or relies on BillTube-injected `#btfw-channeloptions-apply`). Prefer BillTube-injected button for styling consistency; sync exposes `window` helpers or data attributes only if needed:
     - `data-btfw-apply-section="motd|css|js|perms|options"`

3. Permissions: after `makeOption` builds the form, hide/remove the inline Save; register section with controller; Apply reads all selects → `setPermissions`.

### Apply button placement & styling

- Theme Settings: keep `#btfw-ts-apply` in `.modal-card-foot`; default `hidden` until dirty.
- Channel Options: inject into `.modal-footer` via modal-skin:  
  `[ Apply ] [ Close ]`  
  Apply uses Bulma/BillTube `button is-link` to match Theme Settings.
- Visibility: `hidden` when clean; visible when dirty (not merely disabled — matches “reveal” requirement).
- Loading: `aria-busy` on Apply during async socket round-trips; disable double-submit.

### Close / navigation guards

- Dirty + Close / Escape / backdrop → confirm discard.
- `beforeunload` when Channel Options or Theme Settings open and dirty (optional v1 — **include** for Channel Options CSS/JS/MOTD risk).
- Switching Channel Options tabs does **not** auto-apply; dirty state is modal-global.

### Error handling

- Socket failure: keep dirty true; Apply stays visible; show error in footer status (`role="status"`).
- Partial success: baseline updates only for sections that succeeded; failed sections remain dirty.
- Validation (e.g. timeinput parse): block Apply for that section using `:user-invalid` / existing CyTube validation; do not emit invalid payloads.

### Testing

Unit (Vitest, strict TS):

- Snapshot equality / dirty detection.
- `applyAll` success, partial failure, empty dirty.
- Type guards for persist results.

Integration / manual:

1. Theme Settings: edit chat text size → Apply appears → Apply persists → reload OK; Close discard restores.
2. Theme Settings: edit appearance → preview updates → discard reverts.
3. Channel Options General: toggle checkbox → no socket until Apply → Apply emits `setOptions`.
4. MOTD / CSS / JS / Permissions: edit → Apply appears → Apply emits correct socket; Save buttons gone.
5. Theme admin tab dirty merges into footer Apply.
6. Multi-tab dirty: edit MOTD + General → one Apply commits both.
7. Confirm discard path.
8. Without BillTube (post-sync): General no longer silently auto-saves (document stock UX).

## Phasing

| Phase | Deliverable |
|---|---|
| **P0** | `dirty-apply` TS util + unit tests |
| **P1** | Theme Settings: hide Apply until dirty; remove instant persists; rename Save preset |
| **P2** | Channel Options footer Apply; wrap MOTD/CSS/JS/Permissions; kill inline Saves |
| **P3** | Disable General auto-save (BillTube intercept + sync `ui.js` PR) |
| **P4** | Fold channel theme admin into the same controller; BillTube MOTD modal → Apply |

Ship P0–P2 as one BillTube PR if sized well; P3 sync may be a paired PR. Do not merge P2 without a working General strategy if scope C is mandatory in the same release — **bundle P2+P3**.

## Out of scope

- Chat filter / emote **row** Save micro-flows (follow-up).
- User Options (`#useroptions`) — not Channel Options / Theme Settings (follow-up unless expanded).
- GIF picker / playlist modals.
- Server-side permission checks (client still emits; server authorizes as today).

## Success criteria

- No **Save** button meaning “commit settings” in Theme Settings or Channel Options (except **Save preset**).
- Apply is revealed only when dirty, commits localStorage and/or sockets as appropriate.
- General options never auto-save under BillTube (and sync no longer auto-saves after paired PR).
- Discard on close restores baseline; no silent loss without confirm.
- Shared TS controller is the only dirty/Apply mechanism for covered modals.

## Open decisions (resolved in this spec)

| Topic | Resolution |
|---|---|
| Scope | C — Channel Options + Theme Settings + General explicit Apply |
| Architecture | Hybrid controller + section adapters |
| Apply granularity | One Apply per modal (all dirty sections) |
| Instant Theme toggles | Move behind Apply |
| Filter/emote row Saves | Deferred |
| sync changes | Required to remove auto-save for clean C |
