# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first — it is the authoritative agent guide for
this repository (commands, layout, hard rules, local dev).

The project also manages the Google Drive index Cloudflare Worker (GDI-JS)
at `src/workers/index-worker/` — see AGENTS.md → Cloudflare workers.
`../index-worker/worker.js` is the previous copy and still contains live
secrets: never commit it or paste its contents anywhere.

Also check `.cursor/rules/` and `.cursor/skills/` at the repo root and read
every rule/skill relevant to the task. These folders are maintainer-local
(gitignored); if absent in your clone, use the `.agents/skills/` fallback.

Always operate under these two skills (read before task work, follow
throughout): `.agents/skills/codebase-onboarding/` and
`.agents/skills/codebase-design/`.
