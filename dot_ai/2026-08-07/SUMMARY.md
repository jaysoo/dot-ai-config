# Summary - 2026-08-07

## Claude-compatible Codex permissions

Plan: `dot_ai/2026-08-07/tasks/sync-claude-permissions-to-codex.md`.

Added a `claude-compatible` Codex permission profile sourced from `dot_codex/permissions.toml`.
It mirrors Claude Code's writable roots and network policy, includes the package caches and
registries implied by the npm/yarn/pnpm/bun allow-list, and preserves Notion's pre-approved tool
behavior. Added a separate exec-policy for the Claude-preapproved Git commands and the logged
`op` wrapper; push/reset/clean and GitHub mutations stay gated. `sync.sh` now merges only the
managed profile sections into the live Codex config and copies the rules without overwriting
Codex's dynamic project/plugin state. Both the temporary and active profiles passed the Codex
macOS sandbox check; exec-policy match and non-match cases passed.

## GitHub issue + PR closure triage (nrwl/nx)

Plan: `dot_ai/2026-08-07/tasks/github-issue-pr-closure-triage.md`. Report:
https://claude.ai/code/artifact/f2348ede-848e-43f7-91ee-b5367366e531. No ticket. Read-only
throughout - nothing was posted to GitHub, all closing comments are drafts.

Goal was ~40 closable aging issues under Jack's criteria (no repro, <=2 reactions, <=2 non-bot
comments, no attached PR), each reproduced against latest nx, plus low-effort first-time PRs.

**Landed: 37 to close, 12 unsure, 39 keep.** Of 332 open issues, 184 are older than six months
and 72 met the criteria; the 11 low-activity issues with a linked PR were added at Jack's
request. Ten agents did the deep pass, four more attacked the result.

- **The adversarial pass changed the answer.** In the first pass the same agent both ran and
  graded each repro, and a botched repro looks identical to a real fix from the inside. The 17
  closures resting on an uncorroborated "I ran it and it worked" went to independent agents told
  to *refute* them: **13 of 17 were refuted** - 8 reproduced outright on 23.1.1, 5 had a repro
  unfaithful to the report. Close list dropped 45 -> 32. Worst catch was #33974 at confidence 82,
  whose repro contained no source-level back-import, so the reverse edge it was testing for could
  never have appeared.
- **`CLAUDECODE=1` disables the nx TUI.** `is-tui-enabled.ts` gates on `isAiAgent()`, so #34049's
  "the TUI renders fine" test never exercised the TUI at all. Any nx TUI check run from an agent
  session has to scrub `CLAUDECODE`/`CLAUDE_CODE_*`/`CI` first. Saved as a memory.
- **Stale cached graphs report success.** Two separate repros passed on a warm cache and only
  showed the real failure after `nx reset` + `--skip-nx-cache`. One agent caught itself doing it.
- **Deprecated self-hosted cache packages are the cleanest category**, and it came from searching
  the whole open set rather than the aging pool. `@nx/s3-cache`, `@nx/shared-fs-cache`,
  `@nx/gcs-cache`, `@nx/azure-cache` and the legacy `@nx/powerpack-*` aliases were deprecated on
  npm 2026-05-21 over CREEP (CVE-2025-36852); nx.dev says they get no further patches and the flaw
  is unfixable by design. No source in this repo either. Closes 35329, 34032, 34222, 33335, 32518.
  But **not 35424** - `@nx/key` is not deprecated (5.0.9 current), it has 9 reactions (most in the
  triage) and priority:high, and 5.0.4 shipped five days after the report with two same-day betas,
  which looks like a hotfix worth confirming internally.
- **The PR half of the ask does not apply.** Only 5 open PRs predate 2026 and none are low-effort
  (two internal, three with real descriptions and review rounds). Checked every author's prior
  merged-PR count across all 155 open PRs: 44 first-time contributors, only 2 with a thin
  description, and both explain their purpose. Reported that plainly rather than padding a list.
  Closeable: #31780 (author withdrew the approach) and #36102 (valid complaint, wrong fix).
- **Verified the fix commits personally** rather than trusting the agents - all 11 exist and land
  in sensible releases. Corrected one error before it reached a closing comment (`v8-compile-cache`
  removed in 17.0.4, not 17.2.0).
- **11 closures remain unverified** - platform-blocked (Windows, EAS, dotnet, Nx-key), no
  toolchain here. Given the 76% refutation rate on what was checkable, they are leads, not
  verdicts, and are flagged as such in the report.

### Incident

Two agents mis-expanded a path variable and ran a package install from `$HOME`, creating
`~/node_modules`, `~/package.json`, `~/nx.json`, `~/.yarnrc.yml`, `~/yarn.lock` and
`~/.yarn/install-state.gz`, and **overwriting a pre-existing `~/package-lock.json` dated 2021**.
Both cleaned up after themselves; `~` verified clean and `~/.yarn/berry` (Aug 2024) intact. The
2021 lockfile is unrecoverable. Later agent prompts got an explicit absolute-`cd` + `pwd` guard.

### Side findings worth their own tickets

- `nx add @nx/gradle` crashes on a repo without `nx.json` - `readNxJson` returns null and is
  dereferenced in `packages/gradle/src/utils/has-gradle-plugin.ts`.
- `@nx/angular-rspack-compiler` deep-imports `@angular/build/src/tools/...` without declaring
  `@angular/build`, whose modern `exports` map blocks it. Breaks **any** Angular+rspack repro repo
  and reads as "not reproducible" - it caused two of the false closures here.
- #33978's `outExtension` workaround makes `generatePackageJson` emit `"main": "./main.mjs.mjs"`.
- `kb/create-preset.mdoc` documents a CLI signature removed three years ago (cause of #34217).
- `kb/storybook-interaction-tests.mdoc` still says to install `@storybook/testing-library` and
  `@storybook/jest`, both removed in Storybook 8.

### Next

Jack reviews and decides what to post. Suggested order: the 5 deprecated-cache closures first
(backed by npm metadata, not a repro), then the 21 with a verified fix commit or a survived
attack, then hold the rest.
