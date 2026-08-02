# Nx Astro Docs Staleness Audit — 2026-08-02

**Scope:** targeted 3-agent audit, same shape as the 2026-07-10 cycle, scoped to the three requested staleness smells: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/executor options that no longer match `packages/` source. All 478 `.mdoc` files under `astro-docs/src/content/docs` were covered by agent 1 (Nx versions) and agent 2 (Node/framework versions); agent 3 spot-checked ~20+ hand-written pages most likely to describe concrete flags/options. This is **not** a full option-by-option re-sweep of every reference page — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) backlog as the full historical list, now merged with this cycle's additions below.

**Live version verification** (per this file's own rules — no training-data guesses):
- `npm view nx version` → **23.1.1** published; this repo's own `package.json`/`nx.json` devDependency is **23.2.0-beta.4** (repo is ahead of the published release, pre-release). Current major = **23**.
- `npm view node dist-tags` → `latest: 26.5.1`. Cross-referenced against the Node.js release cadence (new major every April/October): as of 2026-08-02, Node 26 is Current, Node 24 is Active LTS, Node 22 is in the Maintenance/LTS-transition window, and **Node 20 is EOL (April 2026, now passed)** — confirms the 07-10 audit's Node-20-EOL claim is now correct, not just anticipated.
- React 19 remains current (Dec 2024 release); no React 16/17 prescriptive mentions found (see below).

**Docs reorganization note:** several previously-flagged files have moved since 07-10 — `guides/Nx Cloud/access-tokens.mdoc` → `kb/access-tokens.mdoc`, `reference/Nx Cloud/launch-template-examples.mdoc` → `kb/launch-template-examples.mdoc`, `extending-nx/task-running-lifecycle.mdoc` → `kb/task-running-lifecycle.mdoc`. Findings below use current paths; if a Linear issue references an old path from a prior cycle's file, re-verify the path before filing.

**Linear MCP unavailable again — 7th consecutive audit cycle.** This cycle's specific symptom: `ListConnectors` reports the Linear connector as installed but **`enabledInChat: false`** — no Linear tools are exposed to this session at all (different from 07-10's symptom, where `enabledInChat: true` but zero tools were still returned by `ToolSearch`). Six different failure modes across seven attempts (SSE transport removed → enabled-but-no-tools → not-enabled-in-chat) all point to the same practical outcome: **issue creation cannot be automated from this scheduled task under any observed connector state.** See escalation note at the bottom — this now needs direct human intervention in claude.ai connector settings rather than another retry next cycle.

---

## Summary

| Category | Confirmed (new this cycle) | Confirmed (re-verified, still open) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 1 (page-framing issue, C-11) | 5 (C-1, C-2/C-3, C-4/C-5 dup-file, C-6) | 15 |
| Old Node/npm/framework version | 0 new | 1 (C-7, re-verified) | 2 |
| Mismatched CLI/feature vs. source | 3 (C-8, C-9, C-10 — covers 4 files) | 0 | 4 |
| **Total** | **4 tickets / ~6 files** | **7 tickets / ~8 files** | **21 items** |

---

## Confirmed Findings

### C-1 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still future-tense about Nx 20 (re-verified, = prior H-13 / item 10)
**File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc:11`
**Category:** old-nx-version
**Excerpt:** `will be removed in Nx 20`
**Still unfixed** since 06-29.

### C-2 — `kb/access-tokens.mdoc` still frames a completed transition as "changing" (re-verified, = prior M-19 / item 24; **file moved** from `guides/Nx Cloud/access-tokens.mdoc`)
**File:** `astro-docs/src/content/docs/kb/access-tokens.mdoc:278-279`
**Excerpt:** `{% aside type="caution" title="Nx Cloud authentication is changing" %} From Nx 19.7 new workspaces are connected to Nx Cloud with a property called nxCloudId instead...`
**Still unfixed.**

### C-3 — `kb/personal-access-tokens.mdoc` carries the same stale Nx-19.7 framing (**new file for an existing issue**, fold into item 24)
**File:** `astro-docs/src/content/docs/kb/personal-access-tokens.mdoc:13`
**Excerpt:** `From Nx 19.7 repositories are connected to Nx Cloud via a property in nx.json called nxCloudId.`
**Reason:** Same underlying pattern as C-2 — a 4-major-old version anchor on what is now simply the default. Fixing item 24 should cover both files.

### C-4 — `technologies/react/introduction.mdoc` still conflates application/library `--bundler` enums (re-verified, = prior item 27)
**File:** `astro-docs/src/content/docs/technologies/react/introduction.mdoc:81-86`
**Excerpt:** `The --bundler option selects the build tool for your application or buildable library... Vite / Webpack / Rspack / Rollup`
**Live schema check confirms mismatch still real:**
- `packages/react/src/generators/application/schema.json`: `"bundler": {"enum": ["vite", "rsbuild", "rspack", "webpack"]}` — no `rollup`; `rsbuild` missing from docs.
- `packages/react/src/generators/library/schema.json`: `"bundler": {"enum": ["none", "vite", "rollup"]}` — no `rspack`/`webpack`/`rsbuild`.
**Still unfixed.**

### C-5 — `kb/terminal-ui.mdoc` stale "currently working on" Windows TUI notice (re-verified, = prior item 8)
**File:** `astro-docs/src/content/docs/kb/terminal-ui.mdoc:9,16,21`
**Excerpt:** `The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned.`
**Reason:** Nx 21 was 2 majors ago; if Windows TUI support has since shipped, this line is now actively wrong, not just dated — needs a docs-team check against current Windows TUI status, not just a wording tweak.
**Still unfixed.**

### C-6 — `kb/publish-rust-crates.mdoc` contradicts the v22 legacy-versioning removal stated elsewhere (re-verified with more detail, = prior item 7)
**File:** `astro-docs/src/content/docs/kb/publish-rust-crates.mdoc:13-18`
**Excerpt:** `In Nx v21, the implementation details of versioning were rewritten... you can still opt into the old versioning by setting release.version.useLegacyVersioning to true... Importantly, this recipe currently requires the use of legacy versioning...`
**Reason:** `reference/nx-json.mdoc:645-646` states legacy versioning "was removed entirely" in Nx v22. On current Nx 23, this recipe (which is not in a Deprecated folder) instructs readers to rely on a mechanism that per the site's own reference page no longer exists. This is likely a genuinely broken recipe, not just a stale version number — **flagging for docs-team/`@monodon/rust` maintainer input on whether new-versioning support has since landed** (see Needs Input).
**Still unfixed.**

### C-7 — `kb/bundling-node-projects.mdoc` EOL `target: 'node18'` in Vite config example (re-verified, = prior item 16)
**File:** `astro-docs/src/content/docs/kb/bundling-node-projects.mdoc:115`
**Excerpt:** `target: 'node18',`
**Reason:** Node 18 EOL'd April 2025; rest of the site (Node compatibility matrix, GitHub Actions examples) consistently uses Node 22/24.
**Still unfixed.**

### C-8 — `kb/setup-ci.mdoc` uses invalid `--ci=azure-pipelines` value (**new finding**)
**File:** `astro-docs/src/content/docs/kb/setup-ci.mdoc:183`
**Category:** mismatched-feature
**Excerpt:** `nx g ci-workflow --ci=azure-pipelines`
**Reason:** `packages/workspace/src/generators/ci-workflow/schema.json` enum for `ci` is `["github", "circleci", "azure", "bitbucket-pipelines", "gitlab"]` — the correct value is `azure`, not `azure-pipelines`. `getting-started/setup-ci.mdoc:76,79` already has this right (`--ci=github`, lists `azure` correctly) — only the `kb/setup-ci.mdoc` tab is wrong.

### C-9 — `angular-monorepo-tutorial.mdoc` uses invalid `--unitTestRunner=vitest` for `@nx/angular:library` (**new finding**)
**File:** `astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo-tutorial.mdoc:247`
**Category:** mismatched-feature
**Excerpt:** `npx nx g @nx/angular:library libs/ui --unitTestRunner=vitest`
**Reason:** `packages/angular/src/generators/library/schema.json` enum for `unitTestRunner` is `["vitest-angular", "vitest-analog", "jest", "none"]` — plain `"vitest"` was split into `vitest-angular`/`vitest-analog` and is no longer accepted. (Equivalent `vitest` value is still valid for `@nx/react:library` and `@nx/js:library` — those other tutorials are fine.) Running this exact command as written will fail schema validation.

### C-10 — Non-existent `--inputs`/`--outputs` flags on `nx show target` (**new finding, 2 files**)
**Files:**
- `astro-docs/src/content/docs/features/CI Features/sandboxing.mdoc:170,174,180`
- `astro-docs/src/content/docs/guides/Adopting Nx/from-turborepo.mdoc:151`
**Category:** mismatched-feature
**Excerpt:** `nx show target <project>:<target> --inputs --outputs` (with a caveat claiming "require Nx 22.6 or later")
**Reason:** `packages/nx/src/command-line/show/command-object.ts` defines no `--inputs`/`--outputs` boolean flags on `show target` — it only has `--configuration`/`--check`, plus separate positional subcommands `nx show target inputs <target>` / `nx show target outputs <target>`. Per `show-target/info.ts`, plain `nx show target <project>:<target>` already includes inputs/outputs in its output automatically when the target config declares them — no flag needed at all. Both doc locations describe an invocation and version gate that don't match the current implementation.

### C-11 — `guides/Nx Release/updating-version-references.mdoc` still framed as an in-flight "Breaking Change," points readers to a stale "v20 version of the website" (**new finding**)
**File:** `astro-docs/src/content/docs/guides/Nx Release/updating-version-references.mdoc:13-16`
**Category:** old-nx-version (page-framing, higher severity than a simple footnote)
**Excerpt:** `{% aside ... title="Breaking Changes in Nx v21" %} In Nx v21, the implementation details of versioning were rewritten... The following examples shows the Nx v21 and later configuration format, you can view the v20 version of the website to see the legacy format.`
**Reason:** The entire page is framed around a "breaking change in v21" callout (2 majors ago) and directs readers to "the v20 version of the website" for the legacy format — worth confirming whether that versioned-docs snapshot is even still hosted/linked anywhere; if not, this is a dead-end pointer, not just dated tone. Recommend rewriting to describe current (v21+) behavior as the only/default behavior.

---

## Needs Input

Carried forward from prior cycles (still applicable, no change) plus new items surfaced this cycle:

### Policy question: prune old "as of/since Nx X" footnotes on otherwise-current pages? (expanded file list this cycle)
Same open policy question as 07-10's NI-2/NI-3. New instances found this cycle, all **factually accurate**, just dated-feeling anchors on describe-current-behavior text:
- `reference/project-configuration.mdoc:233` ("Nx 19.5.0+"), `:533` ("version 16 or greater"), `:553` ("Nx 21+")
- `concepts/inferred-tasks.mdoc:9` — worth flagging specially: this is the **opening sentence of the core Inferred Tasks / Project Crystal concept page**, tied to "Nx version 18" (5 majors old) — a foundational concept reading like a versioned feature note is more visible than a footnote buried in a reference page.
- `reference/glossary.mdoc:154,231` ("Nx 15.3") — re-verified still present, = prior NI-3/L-4/L-7.
- `technologies/typescript/introduction.mdoc:217` ("as of Nx 20") — re-verified, = prior NI-2.
- `kb/task-running-lifecycle.mdoc:14` ("since Nx 20.4+") — re-verified (file moved from `extending-nx/`), = prior NI-2.
- `kb/deploying-node-projects.mdoc:3,197` ("Nx 20+", x2)
- `guides/ci-deployment.mdoc:8` ("Nx 20+")
- `kb/pass-args-to-commands.mdoc:174-175` ("Nx v18.1.1")
- `reference/nx-json.mdoc:645-646,658` ("as of Nx v21"; nested v21 refs inside a v22 breaking-change aside)
- `guides/Nx Release/configure-changelog-format.mdoc:55` ("Prior to Nx v21...")

**Recommendation to docs team:** decide a rule (e.g., "prune the version anchor once a feature has been default for 3+ majors") rather than handling these one-by-one — this is the 3rd cycle accumulating this same category.

### `kb/launch-template-examples.mdoc:197-260` Node 21 illustrative example (re-verified, = prior NI-5/H-12, still open)
`node-21` / `node_version: '21'` used as the "custom Node version override" example. Node 21 was never LTS, EOL since mid-2024. The surrounding correct example already uses `ubuntu22.04-node24.14-v1`. Plausibly just an arbitrary placeholder — confirm with docs owners whether to swap for a current LTS number.

### `reference/nx-mcp.mdoc` flags unverifiable from this repo (re-verified, = prior NI-6)
`--transport`, `--port`, `--tools`, `--minimal`, `--disableTelemetry`, `--debugLogs` — `packages/nx/src/command-line/mcp/mcp.ts` passes through to the separately-published `nx-mcp` package, not vendored here.

### Nx Cloud CLI flags reference the closed-source `nx-cloud` binary (re-verified + expanded, = prior NI-7)
`start-ci-run` flags (`--distribute-on`, `--stop-agents-after`, `--fix-tasks`, `--auto-apply-fixes`, `--with-env-vars`, `--require-explicit-completion`, etc.) seen in `features/CI Features/dynamic-agents.mdoc`, `distribute-task-execution.mdoc`, `self-healing-ci.mdoc`, `github-integration.mdoc`, `split-e2e-tasks.mdoc`, `guides/Adopting Nx/adding-to-*.mdoc`, `reference/nx-cloud-cli.mdoc`. `packages/nx/src/command-line/nx-cloud/start-ci-run/command-object.ts` confirms these all shell out to the closed-source `nx-cloud` binary — can't verify currency from this repo.

### `reference/environment-variables.mdoc` Nx Cloud env vars unreferenced in this repo (re-verified, = prior NI-8)
`NX_RUN_GROUP`, `NX_WORKING_DIRECTORY`, `NX_NO_OUTPUT_TIMEOUT` etc. have zero references outside the doc itself — likely closed-source Cloud stack, can't confirm.

### `kb/migrate-from-webpack.mdoc:18` — "Nx version 20.6.0 or greater" migration threshold (new, needs maintainer confirmation)
Legitimate for a migration guide to branch on starting version, but worth confirming the 20.6.0 threshold is still the correct cutoff.

### "Available since Nx 21.6.1" footnotes — low-severity, accurate (new, same pattern as policy question above)
`kb/cypress-component-testing.mdoc:80-81`, `technologies/test-tools/cypress/introduction.mdoc:136-137`, `kb/merge-atomized-outputs.mdoc:26,29-30`. Correct historical footnotes, not misleading — fold into the same policy decision as above rather than individual fixes.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Items 1–27 carried forward unchanged from prior cycles (see [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) and [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) audits) — re-verified where sampled this cycle (items 7, 8, 10, 16, 24, 27 above). New items this cycle:

| # | Title | Severity | Files |
|---|---|---|---|
| 28 | Fix `kb/setup-ci.mdoc`: invalid `--ci=azure-pipelines` value, should be `--ci=azure` | High | 1 file |
| 29 | Fix `angular-monorepo-tutorial.mdoc`: `--unitTestRunner=vitest` is invalid for `@nx/angular:library`, should be `vitest-angular`/`vitest-analog` | High | 1 file |
| 30 | Remove non-existent `--inputs`/`--outputs` flags on `nx show target` from sandboxing.mdoc and from-turborepo.mdoc | Medium | 2 files |
| 31 | Rewrite `updating-version-references.mdoc`: drop "Breaking Changes in Nx v21" framing and confirm/remove dead pointer to "v20 version of the website" | Medium | 1 file |
| 32 | Fold `kb/personal-access-tokens.mdoc` into item 24's fix (same stale Nx-19.7/nxCloudId framing as access-tokens.mdoc) | Medium | 1 file (companion to item 24) |
| 33 | Decide and apply a policy for pruning "as of/since Nx X" footnotes on current-behavior pages (12+ files this cycle, growing every cycle) — see Needs Input list above for the full file set, esp. `concepts/inferred-tasks.mdoc` as highest-visibility instance | Low | 12+ files |

Note: items 1–27's exact file paths should be re-verified before filing, since the site reorganization (see note at top) moved several files out of `guides/Nx Cloud/` and `reference/Nx Cloud/` into `kb/`.

---

## Linear MCP Status — Escalation

**7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-02) unable to create issues programmatically. Symptom history:
1. 06-17: "SSE transport removed"
2. 06-24 through 06-29: MCP unavailable (no further detail captured)
3. 07-10: `ListConnectors` → `enabledInChat: true`, but `ToolSearch` returns zero Linear tools for any query
4. **08-02 (this cycle): `ListConnectors` → `enabledInChat: false`** — connector installed but explicitly toggled off for this session/chat

Given seven straight failures across at least three distinct symptoms, this is not a transient blip — **recommend a human check claude.ai connector settings directly** (Settings → Connectors → Linear) rather than continuing to retry automatically each cycle. If the connector needs re-authing or re-enabling per-session, this scheduled task cannot create Linear issues until that's addressed structurally (e.g., enabling it at the org/default level for scheduled sessions, not just interactive ones).

## Recurring Checks to Run

(unchanged from prior audits — see top of this folder's README.md for the checklist)
