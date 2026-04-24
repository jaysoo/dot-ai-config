# 2026-04-23 Summary

## Shipped

### DOC-462: KB article for migrating `nx` imports to `@nx/devkit`

New recipe under Guides → Tips & Tricks: `astro-docs/src/content/docs/guides/Tips-n-Tricks/migrate-nx-imports-to-devkit.mdoc`.

- `{% llm_copy_prompt %}` block at top — users paste it into an AI agent to auto-migrate imports.
- Before/after code blocks: project graph, generator, executor, JSON utils.
- Common-symbols table grouped by category (Tree, Workspace, Tasks, Project graph, Plugins, Generators, Executors, Utils, Package manager, Task runner).
- Sub-entry sections for `@nx/devkit/testing` and `@nx/devkit/ngcli-adapter` (`NxScopedHost`).
- "Missing symbol?" section links to `github.com/nrwl/nx/issues/new` and warns about `nx/src/devkit-internals`.
- Sidebar entry added under Knowledge Base → Recipes.
- Gemini review caught a bogus `nx/src/generators/utils/format-files` Before path (never existed in `nx`) — fixed to use real internal paths (`readProjectConfiguration`, `readNxJson`).
- Vale + prettier clean. Commit `6ddad14371`, pushed to `origin/DOC-462`.

### Markdoc fix: `llm_copy_prompt` transform

Side effect of DOC-462: the `{% llm_copy_prompt %}` tag's `extractText` was stripping inline code (backticks), links, and renumbering ordered list items as `- ` bullets. Fix in `astro-docs/markdoc.config.mjs` adds handlers for `code` and `link` nodes and tracks ordered-list index via the list-context arg. Also improves rendering for every existing prompt (tutorial pages etc.).

### CLAUDE.md: caveman commit body rule

Added explicit "Commit body style" paragraph under Git Workflow (CLAUDE.md line 81): caveman style applies to commit bodies too, 1–3 short sentences per template section, readable in under 15s. Edited `~/projects/dot-ai-config/dot_claude/CLAUDE.md` and synced to `~/.claude/CLAUDE.md`. Mirror feedback memory at `~/.claude/projects/-Users-jack-projects-nx/memory/feedback_caveman_commit_style.md`.

## Diagnosis (Linear filed)

### NXC-4353: Powerpack release dry-run fails with ERR_PNPM_CANNOT_RESOLVE_WORKSPACE_PROTOCOL

Root-caused the powerpack dry-run failure. Bug has been latent since the pnpm migration (Dec 3, 2025) — `--dry-run true` is passed to both `npm-packages-version.ts` and `npm-packages-publish.ts`, so `nx release version` doesn't persist the `workspace:*` → concrete-version rewrite to `dist/libs/nx-packages/nx-key/package.json`. `pnpm publish --dry-run` on that dist then fails on workspace resolution. Real releases work because non-dry-run writes concrete versions.

Initially suspected `pnpm.supportedArchitectures` was the fix (cross-checked with Gemini, both agreed) — disproved by reproducing the error locally on Mac where the darwin binary is already symlinked into node_modules. Empirically verified the actual fix: always pass `--dry-run false` to the version step; keep the publish step honoring the workflow flag. `dist/` is gitignored, no persistence concern. No consumer/tarball impact.

Timeline:

- Dec 3, 2025 — pnpm migration; bug introduced but hidden (script didn't propagate publish exit codes).
- Jan 8 (run #178) — fake-green dry-run (silent pnpm error).
- Mar 12 (run #183) — real release genuinely green.
- Mar 24 (PR #10489 "polygraph publishing cleanup") — exit-code check added, bug now surfaces.
- Apr 8+ — dry-runs fail honestly.

Also confirmed no Nx regression: diffed @nx/js + nx release code 22.6.0-beta.12 → 22.7.0-beta.17, only cosmetic `windowsHide: false`→`true` + import-path refactor.

Filed NXC-4353 (low priority, due 2026-05-23) for the CLI team to action in ~1 month.

## Investigation (separate task, in progress)

### nx-cloud onboard: GitHub OAuth 404 regression

`NX_CLOUD_API=https://cloud.nx.app npx nx-cloud onboard` dies at "Loading repositories..." with a 404 from `api.github.com/login/oauth/access_token`. Root cause: OAuth token exchange is on `github.com/login/oauth/access_token` (different host from REST API). Regression traced to commit `972a17a1d6` (PR #10837 — polygraph session resume). Full notes in `.ai/2026-04-23/tasks/nx-cloud-onboard-github-oauth-404-regression.md`. Needs Linear issue filed — not a Nx CLI repo issue, belongs to Nx Cloud (CLOUD-).

## Active sessions

Unchanged. Only long-running session is the 2026-04-20 init error investigation in `/Users/jack/projects/nx` (master).
