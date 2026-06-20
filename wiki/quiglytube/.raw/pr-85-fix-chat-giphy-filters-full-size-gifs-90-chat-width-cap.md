---
source: github-pr
repo: intentionallyIncomplete/BillTube3-slim
number: 85
state: MERGED
title: "fix(chat): Giphy filters, full-size GIFs, 90% chat width cap"
labels: "enhancement"
base: main
head: fix/giphy-chat-filter-classic
created: 2026-06-18T06:06:26Z
updated: 2026-06-18T06:34:42Z
merged: 2026-06-18T06:34:42Z
url: https://github.com/intentionallyIncomplete/BillTube3-slim/pull/85
closes: ""
---

# GitHub PR #85: fix(chat): Giphy filters, full-size GIFs, 90% chat width cap

- **State:** MERGED
- **Branch:** `fix/giphy-chat-filter-classic` → `main`
- **Labels:** enhancement
- **Merged:** 2026-06-18T06:34:42Z
- **URL:** https://github.com/intentionallyIncomplete/BillTube3-slim/pull/85

---

## Summary
- Repair classic Giphy chat filters: split broken multi-capture regex into single-capture filters (giphy v1, classic, i.giphy, page, tenor variants)
- Embed full-resolution Giphy URLs (`giphy_s.gif` / `giphy.gif`) instead of 200px renditions
- Decouple chat GIF sizing from emote size setting; cap GIF width at 75% of chat column so 1.2× hover grow stays within 90%

## Channel fix (manual)
1. Channel Settings → Chat Filters → **Import Required BillTube Chat Filters**
2. Remove duplicate broken legacy `giphy` / `giphy v1` entries if present
3. Reload channel CSS/JS after merge

## Test plan
- [x] `npm test` (35/35)
- [x] `npm run verify-dist`
- [ ] Post `https://media1.giphy.com/media/sRzRspcNEmgdtbQmnJ/giphy.gif` → inline GIF renders at readable size
- [ ] Post v1 Giphy URL → still renders
- [ ] GIF does not overflow chat column; hover grow stays within bounds
- [ ] Emote size setting still affects channel emotes only

