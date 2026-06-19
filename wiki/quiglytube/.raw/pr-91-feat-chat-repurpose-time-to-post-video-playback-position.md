---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 91
state: OPEN
title: "feat(chat): repurpose !time to post video playback position"
labels: ""
base: main
head: feat/chat-time-playback-position
created: 2026-06-19T05:40:00Z
updated: 2026-06-19T05:40:00Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/91
closes: "90"
---

# GitHub PR #91: feat(chat): repurpose !time to post video playback position

- **State:** OPEN
- **Branch:** `feat/chat-time-playback-position` → `main`
- **Closes:** #90
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/91

---

## Summary

- Repurpose `!time` to post the current video playback position instead of local wall-clock time
- Read position via `feature:syncGuard` `getPlayerTime()` (CyTube `PLAYER.getTime`)
- Format as `[M:SS]` or `[H:MM:SS]`; local-only feedback when no media is playing

## Files changed

| File | Change |
|------|--------|
| `modules/feature-chat-commands.js` | `formatPlaybackTime()` helper; async `!time` handler via syncGuard |
| `dist/chat.bundle.js` | Rebuilt |

## Implementation

```js
addCommand("time", async () => {
  const sg = await BTFW.init("feature:syncGuard");
  const seconds = await sg.getPlayerTime();
  if (seconds == null) {
    sysLocal("No active playback.");
    return "";
  }
  sendChat(`[${formatPlaybackTime(seconds)}]`);
  return "";
}, { desc: "Playback position", usage: "!time" });
```

## Verification

- Manual: user confirmed `!time` works on local CyTube + dev server
- `npm test` — 35/35 pass
- `npm run build` — success
