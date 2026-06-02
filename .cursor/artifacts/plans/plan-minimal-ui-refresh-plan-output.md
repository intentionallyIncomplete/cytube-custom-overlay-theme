# Plan — Minimal UI refresh (Issue #39)

**Date:** 2026-05-28  
**Discovery Source:** `discovery-minimal-ui-refresh-discovery-output.md`  
**Status:** Implemented — 2026-05-28

---

## Objective

Ship a cleaner, more minimal BillTube3 Slim UI on CyTube channels: video left and chat right by default (saved prefs unchanged), footer stripped of donate/marketing copy, and globally squarer panels with lighter shadows and more consistent spacing — validated in light and dark themes without breaking chat, player, playlist, or admin.

---

## Scope

### In Scope

- Remove ko-fi, disclaimer, and framework credit from page footer; keep login/register relocation
- Hide `#btfw-stack-footer` when only auth remains (or when empty)
- Token-driven reduction of border radius (`4px`), gap, and shadow weight
- Replace or align hardcoded radii/shadows in `base.css`, `overlays.css`, `chat.css`, `navbar.css`
- Dark-mode Bulma bridge shadow/radius alignment
- Confirm layout default and theme-settings copy (`video left, chat right`)
- Rebuild dist bundles; bump `package.json` / CDN pin in `channel_config_settings.js`; visual QA on CyTube

### Out of Scope

- Color palette / theme redesign
- New UI features or components
- Mobile-specific layout redesign
- Aligning 1100px CSS breakpoint with JS vertical threshold (unless required by regression)

---

## Implementation Phases

### Phase 1 — Footer cleanup

**Goal:** Remove non-functional footer branding; keep auth forms working.

**Files affected:**

- `modules/feature-footer.js` — Remove `BRANDING_HTML`, `insertBranding()`, `ensureBrandingBlock()`; drop branding CSS from `ensureStyles()`; keep `moveForms()` and auth slot logic
- `css/base.css` — Reduce `#btfw-stack-footer` padding/border if auth-only; remove unused `.credit` rules if dead
- `css/mobile.css` — Adjust stack footer margin if footer hidden/minimal
- `dist/features.bundle.js` — Regenerate via build

**Steps:**

1. Delete donate/disclaimer/credit HTML and branding injection path
2. Hide `#btfw-stack-footer` when `.btfw-footer__auth` has no children (or after branding removal leaves auth-only — hide entire stack footer host)
3. Trim footer-specific injected styles no longer needed
4. Run `npm run build`

**Dependencies:** `feature:stack` `attachFooter()`, CyTube `#loginform` / `#logoutform`

**Acceptance criteria:**

- No ko-fi link or "Buy Me a Coffee" image in DOM
- `#btfw-stack-footer` not visible when empty or auth-only (login/register remain reachable via CyTube navbar if footer hidden)
- No duplicate CyTube `#footer` visible

---

### Phase 2 — Design tokens (spacing & shape)

**Goal:** Centralize minimal aesthetic in `tokens.css` so dependents update together.

**Files affected:**

- `css/tokens.css` — Set `--btfw-radius` to **`4px`**; increase `--btfw-gap` (e.g. `8px`–`12px`); reduce `--btfw-overlay-shadow`, `--btfw-glass-shadow`, `--btfw-navbar-shadow` blur/spread
- Optional: add `--btfw-space-sm`, `--btfw-space-md` for future consistency (only if used in same PR)

**Steps:**

1. Apply new token values
2. Grep for `calc(var(--btfw-radius) + Npx)` in overlays/chat — ensure sums still look intentional
3. Spot-check button padding in Bulma `.button` rules in `base.css`

**Dependencies:** None (static CSS)

**Acceptance criteria:**

- `:root` tokens reflect squarer, lighter system
- Components using `var(--btfw-radius)` visibly squarer without broken overflow

---

### Phase 3 — Global CSS hardening

**Goal:** Eliminate heavy literals that bypass tokens.

**Files affected:**

- `css/base.css` — Replace `14px`/`16px`/`18px`/`20px` panel radii with `var(--btfw-radius)` or `calc(...)`; reduce `box-shadow` on `#queue`, `#pollwrap`, `.table-container`, inputs; review `body::after` accent overlay opacity
- `css/overlays.css` — Align literal `18px`/`22px`/`999px` pills where appropriate
- `css/chat.css` — Padding/breathing room on message list and input chrome
- `css/navbar.css` — Navbar pill/link padding (compact but not cramped)

**Steps:**

1. Work file-by-file: radius → shadow → padding
2. Prefer token references over new literals
3. Avoid changing functional z-index / grid placement

**Dependencies:** Phase 2 tokens

**Acceptance criteria:**

- Panels feel more geometric and breathable
- No horizontal scroll or clipped chat on desktop

---

### Phase 4 — Dark theme bridge

**Goal:** Dark mode matches lighter chrome from Phases 2–3.

**Files affected:**

- `modules/feature-bulma-layer.js` — Reduce `.box`/`.card`/`.panel` shadows in `DARK_CSS`; align border-radius with tokens where hardcoded

**Steps:**

1. Edit injected dark bridge rules only where shadows/radii fight tokens
2. Toggle theme on channel; compare light vs dark side-by-side

**Dependencies:** Phases 2–3

**Acceptance criteria:**

- Dark theme does not reintroduce heavy floating shadows
- Modals and panels consistent with light pass

---

### Phase 5 — Layout default verification

**Goal:** Satisfy issue #39 layout acceptance without breaking saved preferences.

**Files affected:**

- `modules/feature-layout.js` — Confirm `chatSidePref` / `getStoredChatSide()` default `"right"`; optional comment documenting semantics
- `modules/feature-theme-settings.js` — Confirm select default and Apply path
- `css/base.css` — Confirm `#btfw-grid` default template matches video-left

**Steps:**

1. Code review only unless bug found
2. Do **not** clear or migrate existing `btfw:layout:chatSide` values
3. Document in PR: first visit = no key → video left; saved `left` = user choice

**Dependencies:** `localStorage`, `btfw:layout:chatSideChanged` event

**Acceptance criteria:**

- Cleared `localStorage` → `btfw-grid--chat-right`, video column left of chat
- Theme Settings Apply persists choice across reload

---

### Phase 6 — Build, verify, ship

**Goal:** Production bundles and channel validation.

**Files affected:**

- `dist/*.bundle.js` — via `npm run build`
- `package.json` — patch version bump (e.g. `1.0.7` → `1.0.8`)
- `channel_config_settings.js` — update `CDN_BASE` to `@v1.0.8` (or matching new version); run `npm run inject-cdn` if required by release workflow

**Steps:**

1. Bump `package.json` version and `CDN_BASE` in `channel_config_settings.js`
2. `npm run build` and `npm run verify-dist` if available
3. `npm test`
4. Load CyTube channel with updated CDN pin (and `?dev=1` for local module iteration if needed)
5. Visual QA checklist (issue acceptance + light/dark)
6. Clear `btfw:layout:chatSide` once to verify default layout

**Dependencies:** npm scripts, CyTube host

**Acceptance criteria:**

- All issue #39 acceptance criteria pass
- No console errors on channel load
- Admin / theme settings / playlist still functional

---

## Write New Tests

No new automated tests required for this plan. Changes are primarily CSS and DOM injection; existing `test/btfw-registry.test.js` does not cover layout/footer. Validation is visual QA + manual layout storage checks.

### Tests Required

| Test Name | Method Under Test | Branch / Condition to Exercise |
|-----------|------------------|-------------------------------|
| — | — | — |

---

## Open Questions Resolved

- **Migrate `chatSide: left` users to new default?** No — issue requires respecting saved prefs.
- **Layout code changes needed?** Unlikely; verify only unless bug found in QA.
- **Hide `#btfw-stack-footer` when auth-only?** Yes — hide the stack footer when only auth remains or when empty.
- **`--btfw-radius` value?** **`4px`**
- **Bump CDN version in this PR?** Yes — bump `package.json` and `channel_config_settings.js` `CDN_BASE` (patch release, e.g. `v1.0.8`).

## Open Questions Remaining

_None._

---

## Risks

- **Saved layout prefs look like “wrong default”** — Mitigation: QA with cleared storage; document in PR.
- **Hardcoded CSS missed in grep** — Mitigation: search `border-radius` and `box-shadow` across `css/`.
- **Bulma/Bootstrap specificity fights tokens** — Mitigation: Phase 4 dark bridge pass.
- **CDN pin still serves old bundles** — Mitigation: version bump in Phase 6; `?dev=1` for pre-release module QA.
- **Hidden footer hides login forms** — Mitigation: confirm Sign in / Account remain in navbar; only hide stack footer when auth slot empty or policy says hide auth-only bar.
