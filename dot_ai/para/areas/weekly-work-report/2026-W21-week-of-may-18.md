# Weekly Work Report: May 18–24, 2026

> **Repos covered:** `nrwl/nx` · `nrwl/ocean`
> **Generated:** 2026-05-25 (Monday)
> **PRs analyzed:** 45 (nx) + 62 (ocean) = 107 merged PRs

---

## Executive Summary

A **very active week** dominated by two parallel efforts:

1. **Polygraph** (ocean) — the largest product focus by headcount; roughly half of ocean’s 62 PRs touch it, with ~6 engineers contributing. New capabilities landed: interactive TUI, Codex app-server transport, session prune, config-agents command, multiplexer support, permission-requested handling, pipeline secrets, and shared sessions.
2. **dist-build migration + v23 stabilisation** (nx) — FrozenPandaz drove the migration of several plugins to local dist builds and shipped three consecutive beta bumps (β16 → β17 → β18) with associated CI/toolchain fixes.

Other notable areas: **live run streaming** (nx-cloud/ocean), **add-ons page** polish, and **sandbox violation** improvements in the workflow controller.

---

## 🔵 nrwl/nx — 45 Merged PRs

### FrozenPandaz — 17 PRs · _High volume; breadth across infra and features_

**Products/areas:** Core, JS, Linting, Testing, Module Federation, rsbuild, Repo CI

| # | Title |
|---|-------|
| #34951 | **feat(core): add shell tab-completion (bash, zsh, fish, powershell)** 🌟 |
| #35720 | fix(linter)!: migrate @nx/eslint + @nx/eslint-plugin to local dist build |
| #35743 | fix(testing): publish @nx/vitest, @nx/cypress, @nx/playwright, @nx/vite from local dist |
| #35561 | cleanup(core): use `calculateHashesForCreateNodes` for batch hashing |
| #35772 | feat(js): support pnpm 11.2.2 |
| #35756 | fix(js): fall back to npm publish when bun publish fails with auth error |
| #35736 | fix(core): treat undefined task parallelism as parallel when scheduling |
| #35707 | fix(rsbuild): infer build outputs from `distPath.root` directly |
| #35774 | fix(repo): run dotnet restore before macOS e2e job |
| #35771 | fix(repo): run dotnet restore before publish |
| #35775 | chore(repo): set pnpm minimumReleaseAge with nx exclusions |
| #35765 | chore(misc): pin corepack default pnpm to packageManager version |
| #35764 | chore(module-federation): re-enable webpack-based React e2e (webpack 5.107.1 fix) |
| #35753 | chore(module-federation): skip webpack e2e tests pending 5.107.0 compat |
| #35776 | chore(repo): update nx to 23.0.0-beta.18 |
| #35749 | chore(repo): update nx to 23.0.0-beta.17 |
| #35721 | chore(repo): update nx to 23.0.0-beta.16 |

**Assessment:** The biggest contributor this week by PR count. Simultaneously driving three beta releases, the dist-build migration across multiple plugins, and shipped the headline feature — shell tab-completion. The rapid β16→β17→β18 cadence in one week means something was blocking and being iteratively fixed; worth confirming β.18 is stable before a wider release.

---

### AgentEnder — 8 PRs · _Core cleanup + docs_

**Products/areas:** Core, Dotnet, nx-plugin, Docs

| # | Title |
|---|-------|
| #35730 | cleanup(core): drop stale @nrwl dedup TODO in nx report |
| #35729 | cleanup(core): remove deprecated non-native scanner and `stripSourceCode` |
| #35755 | fix(nx-plugin): plugin lint checks should use `dependentTasksOutputFiles` |
| #35738 | fix(dotnet): include `Directory.*.*` files in inputs |
| #35754 | chore(repo): preserve preset dist ignore in graph jest configs |
| #35759 | docs(core): task-specific env vars not loaded in batch mode |
| #35752 | docs(core): document `convert-target-defaults-to-array` migration |
| #35760 | docs(core): document spread token in nx.json target defaults reference |

**Assessment:** Good spread of code hygiene (dead code removal) and docs hardening. The three docs PRs in one week stand out — these are all “undocumented gaps” found organically, which is healthy. The dotnet `Directory.*.*` fix is small but important for .NET monorepo users.

---

### jaysoo — 4 PRs (nx) · _v23 cleanup + docs_

**Products/areas:** JS, Docs, Breaking changes/v23

| # | Title |
|---|-------|
| #35735 | fix(js): always register transpiler for `registerTsProject` |
| #35659 | **feat(misc)!: drop deprecated webpack plugin re-exports + v23 polish** 🌟 |
| #35777 | docs(misc): add structural anti-AI rules to docs style guide |
| #35763 | docs(misc): remote cache docs |

**Assessment:** Focused on v23 housekeeping (dropping deprecated re-exports) and docs quality control. The anti-AI rules for docs is a meta-investment in doc quality. Lighter week in nx compared to ocean work.

---

### leosvelperez — 4 PRs · _Core plugin system + JS_

**Products/areas:** Core, JS, Repo

| # | Title |
|---|-------|
| #35631 | fix(core): resolve local plugin subpath imports from source |
| #35725 | fix(js): multi-version support compliance |
| #35688 | feat(misc): convert prompt generator migrations to use `prompt` field |
| #35717 | chore(repo): drop unused root devDeps (postcss tooling + 3D suite) |

**Assessment:** Steady focused work on plugin resolution correctness and multi-version compliance. The migration UX improvement (#35688) is a good DX win.

---

### bcabanes — 1 PR · _Docs/Marketing site_

| # | Title |
|---|-------|
| #35702 | docs(nx-dev): refresh docs header CTA and star widget styling |

**Assessment:** Single PR — likely pulled toward other work this week.

---

### External / Community contributors

| Contributor | # | Title |
|---|---|-------|
| arturovt | #35680 | fix(core): handle object form of `bin` field in `getPrettierPath` |
| Stanzilla | #35757 | fix(core): detect VSCode Copilot AI agent |

---

## 🟢 nrwl/ocean — 62 Merged PRs

### StalkAltan — 7 PRs · _Large feature + client-bundle fixes_

**Products/areas:** nx-api, client-bundle, db-schema-kotlin

| # | Title |
|---|-------|
| #11253 | **feat(nx-cloud,nx-api): implement live run streaming with real-time progress updates** 🌟 |
| #11315 | feat(nx-api,client-bundle): split project graph upload from run end |
| #11370 | fix(nx-api,client-bundle): align project graph hashing |
| #11375 | fix(client-bundle): map tasks for nx core before running continuous tasks |
| #11379 | fix(client-bundle): allow project graph payload without branch |
| #11386 | fix(client-bundle): prevent signed URLs in artifact download errors |
| #11382 | chore(db-schema-kotlin): use default plugin inputs |

**Assessment:** Big week — shipped live run streaming (#11253) and immediately followed up with a chain of client-bundle fixes. The pattern of one large feature + N follow-up fixes suggests the streaming feature is still stabilising. Worth keeping an eye on it.

---

### MaxKless — 9 PRs · _Polygraph CLI breadth_

**Products/areas:** Polygraph, polygraph-cli

| # | Title |
|---|-------|
| #11413 | feat(polygraph): add config agents command |
| #11367 | feat(polygraph-cli): add session prune command |
| #11389 | fix(polygraph): restrict token config permissions |
| #11385 | feat(polygraph): support additional multiplexers |
| #11225 | fix(polygraph): accept repo names in add-repo |
| #11092 | refactor(polygraph-cli): rename `target` → `repo` in CLI agent/git commands |
| #11359 | feat(polygraph): show "coming soon" for parent logs (Codex/OpenCode) |
| #11356 | fix(polygraph): materialize initiator repo in-place when started via `--repo` |
| #11355 | feat(polygraph): stamp `$schema` when creating config.json |

**Assessment:** Highest PR count in ocean. Covering the full breadth of the Polygraph CLI — new commands, config schema improvements, multiplexer support. The rename of `target` → `repo` is a user-facing breaking change that other CLI users/docs will need to follow.

---

### rarmatei — 5 PRs · _Sandbox / workflow-controller_

**Products/areas:** workflow-controller, nx-cloud (sandbox violations)

| # | Title |
|---|-------|
| #11411 | fix(workflow-controller): simplify io-trace classification to one stat per path |
| #11383 | fix(workflow-controller): close eBPF-only classification gaps in io-trace-daemon |
| #11376 | feat(workflow-controller): add `--ebpf-only-classification` flag to io-trace-daemon |
| #11333 | fix(workflow-controller): emit unexpectedReads/Writes as arrays in sandbox report |
| #11398 / #11391 | fix(nx-cloud): gate sandbox violations CIPE banner behind `enable_sandbox` flag |

**Assessment:** Iterative hardening of the sandbox/io-trace system. Two nearly-identical PRs (#11391 and #11398) for the same sandbox banner gate — looks like a duplicate or a fix-on-fix pattern; worth a quick check on whether both are needed.

---

### Cammisuli — 3 PRs · _Polygraph Codex driver_

**Products/areas:** Polygraph, polygraph-cli

| # | Title |
|---|-------|
| #11403 | feat(polygraph): add support to handle `permission-requested` |
| #11392 | feat(polygraph): migrate Codex driver to app-server transport |
| #11346 | fix(polygraph-cli): don’t skip parent-host prompt when `--launch` is set |

**Assessment:** Focused, substantial work — the app-server transport migration is architecturally significant for Codex support.

---

### lourw — 2 PRs · _nx-cloud Add-ons feature_

**Products/areas:** nx-cloud, nx-api

| # | Title |
|---|-------|
| #11277 | feat(nx-cloud,nx-api): ensure add-on operations trigger notifications + emails |
| #11297 | feat(nx-cloud): polish add-ons page — enterprise gating, unified actions |

**Assessment:** Two meaty PRs on a single feature (add-ons). Notifications + email wiring (#11277) combined with UI polish (#11297) looks like a feature reaching completion. Good forward momentum.

---

### JamesHenry / AI-JamesHenry — 2 PRs · _Polygraph TUI + multiplexers_

**Products/areas:** Polygraph

| # | Title |
|---|-------|
| #11360 | feat(polygraph): interactive TUI for `polygraph`, misc consistency fixes |
| #11385 | feat(polygraph): support additional multiplexers _(co-author with MaxKless)_ |

**Assessment:** The interactive TUI is a notable UX improvement for Polygraph power users.

---

### juristr — 1 PR · _Polygraph UI_

| # | Title |
|---|-------|
| #11410 | fix(polygraph): make repo names clickable |

---

### nartc — 1 PR · _Polygraph demo_

| # | Title |
|---|-------|
| #11354 | feat(polygraph): add sample account demo remix |

---

### nixallover — 2 PRs · _nx-cloud housekeeping_

**Products/areas:** nx-cloud, Docs

| # | Title |
|---|-------|
| #11281 | chore(nx-cloud): remove in-app template-based CNW |
| #11345 | docs(nx-cloud): extract posthog group-flags guidance into a Claude skill |

---

### pmariglia — 2 PRs · _Repo infra_

| # | Title |
|---|-------|
| #11402 | feat(repo): npm caching |
| #11396 | chore(repo): Update NPM read-through address |

---

## 🚩 Items Needing Your Attention

| Priority | Item | Why |
|----------|------|-----|
| 🔴 **Watch** | **Polygraph feature velocity** | ~30 of ocean’s 62 PRs touch Polygraph. 6+ engineers are shipping fast across CLI, TUI, multiplexers, Codex driver, demo seeding, shared sessions, pipeline secrets — all in one week. Is there a coherent release/GA plan? |
| 🟠 **Check** | **nx β16→β17→β18 in one week** | Three beta bumps in 7 days means something was iteratively broken. Confirm β.18 is stable before promoting or cutting a wider announcement. |
| 🟠 **Check** | **Live run streaming (ocean #11253) follow-up fixes** | StalkAltan shipped the big feature + 5 immediate follow-ups. Still in stabilisation mode — check if it’s behind a flag before broad exposure. |
| 🟡 **Minor** | **rarmatei duplicate sandbox PRs** | #11391 and #11398 both gate the sandbox CIPE banner behind `enable_sandbox`. Confirm one wasn’t redundant. |
| 🟡 **Minor** | **MaxKless `target` → `repo` rename** | User-facing CLI breaking change. Docs and any external tutorials referencing `polygraph agent --target` need updating. |
| 🟡 **Minor** | **bcabanes only 1 PR** | Unusually light; no concern yet but worth a check-in. |

---

## 📊 Contribution Snapshot

| Person | nx PRs | ocean PRs | Total | Focus |
|--------|--------|-----------|-------|-------|
| FrozenPandaz | 17 | — | 17 | dist-migration, β releases, tab-completion |
| MaxKless | — | 9 | 9 | Polygraph CLI |
| AgentEnder | 8 | — | 8 | Core cleanup, docs |
| StalkAltan | — | 7 | 7 | Live run streaming, client-bundle |
| jaysoo | 4 | 3 | 7 | v23 polish, docs, deprecations |
| rarmatei | — | 5 | 5 | Sandbox / io-trace |
| leosvelperez | 4 | — | 4 | Plugin resolution, multi-version |
| Cammisuli | — | 3 | 3 | Polygraph Codex driver |
| lourw | — | 2 | 2 | Add-ons feature |
| JamesHenry | — | 2 | 2 | Polygraph TUI + multiplexers |
| nixallover | — | 2 | 2 | nx-cloud cleanup |
| pmariglia | — | 2 | 2 | Repo infra |
| bcabanes | 1 | — | 1 | Docs UI |
| juristr | — | 1 | 1 | Polygraph UI fix |
| nartc | — | 1 | 1 | Polygraph demo |

---

_Report generated automatically by Claude Code on 2026-05-25. Covers merged PRs only; open/draft PRs and commit-only activity are excluded. Bot PRs (`polygraph-snapshot-app[bot]`, `Copilot`) are excluded from per-person breakdowns above._
