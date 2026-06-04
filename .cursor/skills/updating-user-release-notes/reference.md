# user-release-notes.json

## Schema

```json
{
  "releases": [
    {
      "version": "1.1.1",
      "date": "2026-06-04",
      "summary": "One benefit-led sentence for the whole release.",
      "categories": {
        "features": [],
        "improvements": [],
        "fixes": [],
        "breaking": [],
        "deprecations": []
      },
      "highlights": [
        "Flat scan list for modals; required even when categories is set."
      ]
    }
  ]
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `releases` | yes | Newest first |
| `version` | yes | Match `package.json` when shipping |
| `date` | yes | `YYYY-MM-DD` |
| `summary` | recommended | Benefit-led; shown in compact UI |
| `categories` | optional | Omit keys with empty arrays |
| `highlights` | yes | 3–8 items; dedupe vs `summary` |

`highlights` is the canonical quick-scan list. `categories` supports richer UI or markdown export later.

## Technical → user-facing

| Technical (input) | User-facing (output) |
|-------------------|----------------------|
| Implemented Redis caching layer for dashboard API endpoints | Dashboards load faster so you spend less time waiting. |
| Fixed race condition in concurrent checkout flow | Fixed an issue where some orders could fail during busy periods. |
| `fix(player): filter invalid recent suggestions` | Movie suggestions no longer show broken or empty picks. |
| `feat(ui): minimal UI refresh` | Cleaner panels and a tidier page footer. |
| Bump `CDN_BASE` to `@v1.2.0` in channel config | **Action required:** Channel staff need to update Custom JavaScript with the new CDN pin so viewers get this release. |
| `chore(release):`, eslint, husky only | *(omit)* |

**BillTube-specific segments:** all viewers (default), mobile viewers, chat/emoji users, playlist/queue users, mods/admins (theme toolkit).

## Example entry

```json
{
  "version": "1.1.1",
  "date": "2026-06-04",
  "summary": "Smoother movie picks and more reliable audio when you join the channel.",
  "categories": {
    "improvements": [
      "Movie suggestions: picks with missing data are filtered out so the list stays useful."
    ],
    "fixes": [
      "Audio enhancer: starts correctly when the channel loads instead of staying silent."
    ]
  },
  "highlights": [
    "Movie suggestions no longer show broken or empty entries.",
    "Audio enhancer loads correctly when the channel starts."
  ]
}
```

## Markdown export

When the user wants a release doc (PR, GitHub, Discord), use:

```markdown
# Quiglytube3 — v1.1.1 (2026-06-04)

[summary paragraph]

## New Features
- **Name**: Benefit-led description.

## Improvements
- **Area**: What got better and how it helps.

## Bug Fixes
- Fixed [issue in user terms].

## Breaking Changes
- **Action required**: What channel staff or users must do.

## Deprecations
- **Old thing**: Use [replacement] instead.
```

Omit empty sections. Match JSON content; do not add facts not grounded in git/tickets/diff.

## Modal consumption

`decorateUserOptions()` in `feature-theme-settings.js` — newest release:

- Title: `Recent Updates`
- Prefer `highlights` as bullets; fall back to `summary`
- Optional: render `categories` as subsections when wired

Until wired, JSON still holds copy for manual paste or follow-up PR.
