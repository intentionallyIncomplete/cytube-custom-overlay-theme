---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 89
state: MERGED
title: "refactor(chat): remove trivia and trivia leaderboard commands"
labels: "enhancement"
base: main
head: chore/remove-trivia-88
created: 2026-06-18T07:33:33Z
updated: 2026-06-18T07:38:10Z
merged: 2026-06-18T07:38:09Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/89
closes: ""
---

# GitHub PR #89: refactor(chat): remove trivia and trivia leaderboard commands

- **State:** MERGED
- **Branch:** `chore/remove-trivia-88` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T07:38:09Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/89

---

## Objective

Remove the chat Trivia feature **and its trivia leaderboard** from BillTube3-slim. Both `!trivia` and the trivia-only `!leaderboard` command go away together, along with all scoring and worker integration.

Trivia is not a standalone module â€” it is embedded in `feature:chat-commands` and posts plain CyTube chat messages. A rich card UI (`.btfw-chat-trivia*`) exists in CSS but has no JS renderer (removed from `feature-chat.js` in Oct 2025).

## Scope

### In scope (remove)

| Item | Details |
|------|---------|
| `!trivia` command | Start trivia rounds (rank â‰¥ 2) |
| `!leaderboard` command | Trivia score leaderboard in chat-commands â€” **not** the ratings leaderboard |
| Trivia scoring | `updateScore()`, worker POST `/updateScore` |
| Auto leaderboard posts | `displayLeaderboard()` after correct answers and on manual `!leaderboard` |
| Answer detection | `onIncomingChatMsg` socket listener |
| External worker | `trivia-worker.billtube.workers.dev` (`/updateScore`, `/leaderboard`) |
| Orphaned trivia CSS | `.btfw-chat-trivia*` block in `chat.css` |

### Out of scope (keep)

| Item | Details |
|------|---------|
| Ratings leaderboard | `feature-ratings.js` â€” separate feature, unaffected |
| Other chat commands | `!help`, `!summary`, `!pick`, etc. remain in `feature:chat-commands` |

## Current behavior

- `!trivia` (rank â‰¥ 2) fetches a multiple-choice question from OpenTDB, broadcasts it to chat, and starts a 30s timeout.
- Users answer by typing the correct answer in chat; a `socket.on(chatMsg)` listener scores winners.
- On correct answer, scores update via the worker and `displayLeaderboard()` posts scores to chat automatically.
- `!leaderboard` manually fetches and posts the trivia leaderboard from the same worker.

## Files to change

### Required â€” source

| File | What to remove |
|------|----------------|
| `modules/feature-chat-commands.js` | Entire trivia + leaderboard subsystem (approx. lines 32â€“93): `workerUrl`, `triviaAPIUrl`, state vars, `decodeHTMLEntities`, `stylizeUsername`, `updateScore`, `displayLeaderboard`, `fetchTriviaQuestion`, `startTriviaOnce`, `onIncomingChatMsg`; `addCommand(trivia, â€¦)` and `addCommand(leaderboard, â€¦)`; `wireIncoming()` and its `boot()` call (trivia is the only consumer) |
| `css/chat.css` | Lines 710â€“809: orphaned `.btfw-chat-trivia*` styles and `--btfw-trivia-option-color` |

### Required â€” build artifact

| File | Action |
|------|--------|
| `dist/chat.bundle.js` | Regenerate via `npm run build` after source removal (do not hand-edit) |

### No changes needed

- `package.json`, `scripts/build.js`, `billtube-fw.js`, `src/billtube-fw.js` â€” no trivia-specific wiring (chat-commands module stays for other commands)
- `feature-ratings.js` â€” ratings leaderboard is unrelated
- `dev/channel-settings.js`, `channel_config_settings.js` â€” no trivia config
- `user-release-notes.json`, wiki, README, CHANGELOG â€” no trivia references
- `test/` â€” no trivia tests
- Player / admin bundles â€” no trivia UI

## External dependencies (decommission separately)

- `https://opentdb.com/api.php` â€” question source (hardcoded)
- `https://trivia-worker.billtube.workers.dev` â€” `/updateScore`, `/leaderboard` (not in this repo; safe to retire once trivia is removed)

## Checklist

- [ ] Remove `!trivia` command and all trivia game logic from `modules/feature-chat-commands.js`
- [ ] Remove `!leaderboard` command, `displayLeaderboard()`, and `updateScore()` (trivia scoring only)
- [ ] Remove `wireIncoming()` socket listener and its `boot()` call
- [ ] Remove orphaned `.btfw-chat-trivia*` block from `css/chat.css`
- [ ] Run `npm run build` and commit updated `dist/chat.bundle.js`
- [ ] Verify `!trivia` and `!leaderboard` no longer appear in the commands modal (`?` button)
- [ ] Confirm ratings leaderboard (`feature-ratings.js`) still works
- [ ] (Optional) Decommission `trivia-worker.billtube.workers.dev`

## Notes

- There is no `feature-trivia` module, feature flag, or dedicated bundle entry.
- The chat `!leaderboard` command is trivia-only; do not confuse it with the ratings leaderboard modal in `feature-ratings.js`.
- Trivia messages currently render as plain chat (`[code]Trivia: â€¦[/code]`, `col:` colored options) â€” not the styled card.
- `sendChat('!trivia')` on round start broadcasts the command string to all users; this goes away with removal.
- Answer matching uses exact `message.toLowerCase() === correctAnswer` (the file's `norm()` helper is unused for trivia).

## Architecture (pre-removal)

```
billtube-fw.js â†’ dist/chat.bundle.js â†’ feature:chat-commands
  â”œâ”€ !trivia / !leaderboard (chatline intercept)
  â”œâ”€ socket.on(chatMsg) â†’ onIncomingChatMsg
  â”œâ”€ fetch â†’ opentdb.com
  â”œâ”€ fetch â†’ trivia-worker.billtube.workers.dev (/updateScore, /leaderboard)
  â””â”€ socket.emit(chatMsg) â†’ plain chat text + leaderboard posts

css/chat.css (.btfw-chat-trivia*) â€” no JS consumer (dead CSS)
```

