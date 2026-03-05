# Summary — 2026-03-04

## DOC-429: Task Sandboxing Documentation

Drafted, iterated, and pushed the new Task Sandboxing feature documentation page for Nx Cloud Enterprise. Multiple rounds of feedback from Rareș incorporated.

**PR:** https://github.com/nrwl/nx/pull/34686 (draft, CI green)

**What was created:**

- New doc page at `astro-docs/src/content/docs/features/CI Features/sandboxing.mdoc`
- SVG diagram (`sandboxing-cache-flow.svg`) showing declared inputs → build → declared outputs → cache key flow
- 6 screenshots: CIPE violations, task violations, sandbox analysis, raw report, cloud settings, settings sidebar
- Cross-reference added to remote caching page (`remote-cache.mdoc`)
- Sidebar entry with "New" badge under Orchestration & CI

**Key sections:**

- Why hermeticity matters (with `app.yaml` undeclared input + `vite-plugin-dts` undeclared output examples)
- How sandboxing works (Warning vs Strict modes)
- Investigating violations (CIPE → task details → sandbox analysis → raw report flow)
- Inspecting inputs and outputs (`nx show target`, `nx show project`, project details widget)
- Enabling sandboxing (Enterprise, single-tenant, Nx Agents required, not manual DTE)
- Excluding paths (global + `task-exclusions` per project/target)
- Cloud settings (Strict / Warning / Off enforcement modes)

**Feedback incorporated from Rareș:**

- Don't reference `@nx/vite` plugin specifically (avoid implying plugin defaults are wrong)
- Use `app.yaml` instead of `.env` for undeclared input example (`.env` env input syntax not supported)
- Remove `NX_CLOUD_IO_TRACING_DIRECTORY` (will be enabled by default on agents soon, NXC-3973)
- Updated exclude config to show actual format with `task-exclusions` support (from ocean PR #10053)
- Don't show node_modules/.nx/.pnpm-store in excludes (auto-excluded)
- Requires Nx Agents, not supported with manual DTE
- Minimum version is 22.5, not 21.5

## DOC-436: Fix Broken Netlify Image URLs on Docs

Fixed broken `/.netlify/images` URLs on astro-docs pages (e.g. sandboxing page). The Framer proxy edge function (`netlify/edge-functions/rewrite-framer-urls.ts`) was intercepting `/.netlify/*` requests and forwarding them to Framer instead of letting them pass through to Next.js (which rewrites them to the astro-docs site).

**Fix:** Added `'/.netlify/*'` to `excludedPath` in the Framer proxy edge function config.

**Branch:** `DOC-436` pushed, ready for PR.

## Netlify Deploy Triage

Triaged and rejected 34 pending deploy previews across nx-docs (18) and nx-dev (16). All 6 PRs were core/plugin changes with no docs or marketing file changes — none needed manual review.

## NXA-1075: nx-import Skill — Rounds 3-4 Validation + JEST.md + Gaps Report

Continued iterative validation of `nx import` skill reference files. Created JEST.md, ran rounds 3-4 (8 parallel scenarios each), compiled final gaps report, and pushed updates to the `nx-ai-agents-config` repo.

**What was accomplished:**

- **Created `references/JEST.md`** — Jest testing guidance for nx import: @nx/jest/plugin setup, jest.preset.js manual creation (nx add does NOT create it), testing deps by framework, babel-jest for @nx/react:library, tsconfig.spec.json, Jest vs Vitest coexistence
- **Updated `SKILL.md`** — Expanded Jest Preset Missing section, added JEST.md to references list, corrected `nx add @nx/jest` behavior
- **Round 3** — All 8 scenarios PASS. Key finding: N1 gaps from round 2 resolved by JEST.md. N5 found `jest.preset.js` not auto-created (corrected in docs).
- **Round 4** — All 8 scenarios PASS. JEST.md correctly guided agents. Remaining gaps are minor/medium.
- **Updated `TESTING-PLAYBOOK.md`** — Added lessons from rounds 3-4 (context compaction, duplicate agents, diminishing returns, scenario design insights)
- **Generated `GAPS-REPORT.md`** — 14 outstanding gaps prioritized: 3 critical (ndjson two-step, Next.js composite override, path depth mismatch), 4 medium, 7 minor. Plus 9 previously-resolved gaps.
- **Pushed to PR #74** on `nrwl/nx-ai-agents-config` — Added VITE.md, NEXT.md, JEST.md references + updated SKILL.md, synced to all 6 agent formats (Claude, OpenCode, Copilot, Cursor, Gemini, Codex). https://github.com/nrwl/nx-ai-agents-config/pull/74

**Files modified (canonical locations):**
- `~/.claude/commands/nx-import/references/JEST.md` (new)
- `~/.claude/commands/nx-import/SKILL.md` (updated)
- `~/.claude/commands/nx-import/TESTING-PLAYBOOK.md` (updated)
- `~/.claude/commands/nx-import/GAPS-REPORT.md` (new)
- `nrwl/nx-ai-agents-config` PR #74 branch `codex/import-skill` (28 files)

## Other

- Generated Director of Engineering briefing (capacity/risk analysis for April/May)
- Triaged and rejected 34 pending Netlify deploy previews
