# Nx Astro Docs Staleness Audit — 2026-08-07

**Scope note:** targeted audit against the 4 smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator options that no longer match `packages/` source, (4) Ocean/Nx Cloud feature drift — GitHub App permissions vs. the actual manifest/call sites in `nrwl/ocean`, and `nx-cloud` CLI commands vs. the actual command registry in `nrwl/ocean`. This is the **first cycle with read access to the `nrwl/ocean` repo**, so smell #4 got real cross-repo verification for the first time instead of being parked in "Needs Input" (see NI-6/NI-7 in the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md)). Not a full line-by-line re-sweep of all 479 `.mdoc` files — the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog remains the authoritative full list until another exhaustive pass runs.

Current Nx: **23.2.0-beta.4** (verified live from root `package.json`, not training data). Node current LTS: **24.x** (Active); Node 20 EOL April 2026, Node 18 long EOL — matches this repo's own `technologies/node/introduction.mdoc` compatibility table, no drift found there.

**Linear MCP unavailable again — 7th consecutive audit cycle**, with yet another different symptom this time. See escalation section at the bottom.

---

## Summary

| Category | Confirmed (new or re-verified) | Needs Input |
|---|---|---|
| Old Nx version reference | 5 (2 re-verified, 3 new) | 3 |
| Old Node/npm/framework version | 1 (re-verified, upgraded from Needs Input to Confirmed) | 2 |
| Mismatched CLI/feature vs. source | 1 new (small) | 1 |
| Ocean feature drift (GitHub App permissions) | 0 — **verified clean**, no drift found | 1 |
| Ocean feature drift (`nx-cloud` CLI commands) | 1 new (**large — ~12 commands**) | 2 |
| **Total** | **8** | **9** |

---

## Confirmed Findings

### C-1 — `kb/publish-rust-crates.mdoc`: broken config, references removed `useLegacyVersioning` option (re-verified, = prior backlog item 7)
**File:** `astro-docs/src/content/docs/kb/publish-rust-crates.mdoc` (lines 13–18, 53–54)
**Category:** old-nx-version / broken-example
**Issue:** The page tells readers this recipe "currently requires the use of legacy versioning" and has them set `"useLegacyVersioning": true` in `nx.json`, framed as a temporary Nx v21-era workaround ("This will be added in a minor release of Nx v21 and this recipe will be updated accordingly"). `reference/nx-json.mdoc` (line 675) confirms "In Nx v22, the legacy versioning implementation was removed entirely." Current is v23 — two majors past removal. **This is not just stale wording, it's a config example that will fail on current Nx.** Still unfixed since the 06-29 audit.
**Suggested fix:** Verify whether `@monodon/rust` now implements `VersionActions` for the current release-versioning system; update the recipe accordingly and rewrite the aside in past tense (or remove it) if resolved.

---

### C-2 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still uses future tense for Nx 20 (re-verified, = prior backlog item 10 / H-13)
**File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc` (line 11)
**Category:** old-nx-version
**Issue:** "This API has been superceded by the v2 API and **will be removed in Nx 20**." Current Nx is 23.x. Should read "was removed in Nx 20."

---

### C-3 — `reference/Deprecated/legacy-cache.mdoc` also uses future tense for Nx 21 removal (re-verified, = prior backlog item 10)
**File:** `astro-docs/src/content/docs/reference/Deprecated/legacy-cache.mdoc` (lines 10, 15)
**Category:** old-nx-version
**Issue:** "In Nx 21, the legacy file system cache **will be removed** in favor of a new database cache" / "can still be used in Nx 20 by setting `useLegacyCache: true`." This directly contradicts `reference/nx-json.mdoc`'s correctly past-tense account of the same transition. Should read "was removed."

---

### C-4 — `kb/terminal-ui.mdoc`: stale "Windows support coming" notice, code shows it already shipped (re-verified + strengthened, = prior backlog item 8)
**File:** `astro-docs/src/content/docs/kb/terminal-ui.mdoc` (line 16)
**Category:** old-nx-version
**Issue:** "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Checked `packages/nx/src/tasks-runner/is-tui-enabled.ts` directly this cycle: there is no platform-based disablement of the TUI on Windows in current code — `process.platform !== 'win32'` is only used to pick unicode vs. ASCII glyphs. Windows support has shipped; this notice is actively misleading readers into thinking the TUI doesn't work on Windows today.

---

### C-5 — `features/run-tasks.mdoc`: Terminal UI described as version-specific on a mainline feature page (new, same topic as C-4)
**File:** `astro-docs/src/content/docs/features/run-tasks.mdoc` (line 109)
**Category:** old-nx-version
**Issue:** "In Nx 21, task output is displayed in an interactive terminal UI..." The Terminal UI is the current default task-output experience, not a version-specific footnote — anchoring it to "In Nx 21" on a general, non-deprecated feature page implies it's a recent/legacy-specific addition. Bundle the fix with C-4 (same underlying doc-maintenance gap: Terminal UI docs need a tense/framing pass).

---

### C-6 — `kb/launch-template-examples.mdoc`: worked examples use EOL, non-LTS Node 21 (re-verified and **upgraded from Needs Input to Confirmed**, = prior NI-5)
**File:** `astro-docs/src/content/docs/kb/launch-template-examples.mdoc` (lines 197, 208, 229, 243, 260, 273)
**Category:** old-node-version
**Issue:** The "Custom node version" section's mise, `install-node` step, and manual nvm tabs all use **Node 21** (`node-21`, `node=21`, `node_version: '21'`, `nvm install 21.7.3`). Node 21 was a non-LTS "Current" release, EOL since June 2024, and `technologies/node/introduction.mdoc` itself tells readers odd-numbered Node releases are discouraged in production. Every other image reference on the same page correctly uses `ubuntu22.04-node24.14-v1` — the Node 21 example is inconsistent with the rest of its own page. The 2026-07-10 audit parked this as "plausibly just a placeholder"; on review this cycle the internal inconsistency (same page correctly uses Node 24 elsewhere) plus EOL status make this a confirmed fix, not just a stylistic nit.
**Suggested fix:** Swap all Node 21 references in this section for Node 22 or 24.

---

### C-7 — `kb/pass-args-to-commands.mdoc`: single-dash typo for `--args` flag (new)
**File:** `astro-docs/src/content/docs/kb/pass-args-to-commands.mdoc` (line 291)
**Category:** mismatched-feature (typo)
**Issue:** "You should provide the arg using the `-args` option in such cases." — single dash. Every other reference on the same page (lines 269, 280, 283, 296) correctly uses `--args`, and `packages/nx/src/executors/run-commands/schema.json` (line 132) confirms the real option is `args`/`--args`. Likely a markdown en-dash artifact, not a renamed flag, but will mislead anyone who copies the single-dash form.
**Suggested fix:** One-character fix, `-args` → `--args`.

---

### C-8 — `reference/nx-cloud-cli.mdoc`: reference page omits roughly a dozen real `nx-cloud` commands (new — largest finding this cycle, first time cross-checked against `nrwl/ocean` source)
**File:** `astro-docs/src/content/docs/reference/nx-cloud-cli.mdoc` (titled "Cloud Commands," claims to be a "complete reference for all Nx Cloud CLI commands")
**Ocean source:** `libs/nx-packages/client-bundle/src/index.ts` (`commandMap`, lines 33–99)
**Category:** ocean-feature-drift
**Issue:** Commands registered in ocean's `commandMap` but missing from the docs page entirely:
- `clean-up-agents` (line 34)
- `upload-graph` (line 64)
- `upload-and-show-run-details` (line 48)
- `upload-agent-metrics` (line 97)
- `fix-ci` (line 66) — the feature is documented at `features/CI Features/self-healing-ci.mdoc`, but the actual `npx nx-cloud fix-ci` command name is never stated
- `apply-locally` (line 76) — same gap: `self-healing-ci.mdoc` (lines 306–314) documents an "Apply Locally" UI button but never names the CLI command it triggers
- `decrypt-artifact` (line 79) — `guides/Nx Cloud/encryption.mdoc` explains artifact encryption conceptually but never documents the command to manually decrypt an artifact (`npx nx-cloud decrypt-artifact <path> [--output-path <path>]`)
- `publish-conformance-rule` (singular, line 57) — only the plural `publish-conformance-rules` is documented anywhere

Commands that exist and are documented, but only on other pages never cross-linked from this "complete reference" page: `record` (`guides/Nx Cloud/record-commands.mdoc`), `validate` / `validate sandbox-violations` (`kb/launch-templates.mdoc`, `kb/custom-steps.mdoc`, `kb/fix-sandbox-violations.mdoc`), `conformance` / `conformance:check` (`enterprise/configure-conformance-rules-in-nx-cloud.mdoc`, `enterprise/conformance.mdoc`).

All commands the reference page *does* document match source correctly — this is purely a coverage gap, not an accuracy problem on the documented subset. One minor note: docs describe `complete-ci-run` as distinct from `stop-all-agents`, but in code (`index.ts:46-47`) it's a literal alias calling the same `stopAllAgents()` function — this matches the doc's own text ("Invoking this command is not needed anymore"), so not a contradiction, just worth knowing it's intentional aliasing.
**Suggested fix:** Add the 7 fully-undocumented commands (`clean-up-agents`, `upload-graph`, `upload-and-show-run-details`, `upload-agent-metrics`, `fix-ci`, `apply-locally`, `decrypt-artifact`, `publish-conformance-rule`) to `reference/nx-cloud-cli.mdoc`, or explicitly cross-link the 5 that are documented elsewhere (`record`, `validate`, `validate sandbox-violations`, `conformance`, `conformance:check`) from this page so it's actually the "complete reference" it claims to be.

---

## Ocean Feature Drift — GitHub App Permissions: **Verified Clean**

`kb/github-app-permissions.mdoc` was cross-checked line-by-line against real call sites in `nrwl/ocean` for the first time this cycle (`apps/nx-api/src/main/kotlin/integrations/github/GithubApi.kt`, `GithubClient.kt`, `GithubActionsClient.kt`, `handlers/CIWebhookHandlers.kt`, `services/GitHubActionsWorkflow.kt`, plus the Self-Healing CI and org-installation VCS libs). Every permission the docs list (Checks R&W, Contents R&W, Commit Statuses R&W, Issues R&W, Metadata R, Pull requests R&W, Workflows R&W, Actions R, Administration/org R, Members/org R) has a matching call site at the claimed access level, and the doc's callout that "Administration (read & write) was removed" is consistent with the one remaining write-adjacent call (`createRepoFromTemplate`) authenticating via the user's own OAuth token, not the App's installation token. No drift found — **no Linear issue needed for this smell this cycle.**

---

## Needs Input

### NI-1 — `kb/terminal-ui.mdoc` line 9: same version-anchoring pattern as C-4/C-5
Intro sentence: "In version 21, Nx provides an interactive UI in the terminal..." Less clear whether this is an acceptable "when it was introduced" framing vs. something to strip — docs-team call, fold into the C-4/C-5 fix if approved.

### NI-2 — Scattered "as of Nx X" footnotes in current pages (re-verified, = prior NI-2/NI-3, still open, still low-value-but-accurate)
`technologies/typescript/introduction.mdoc` (line 217, "as of Nx 20"), `reference/project-configuration.mdoc` ("Nx 19.5.0+"), `extending-nx/task-running-lifecycle.mdoc` ("since Nx 20.4+"), plus older ones from prior cycles. All factually correct, just numerous. Policy question for docs team: prune version footnotes once a feature has been default for 3+ majors?

### NI-3 — `kb/performant-project-graph-plugins.mdoc` / `kb/createnodes-compatibility.mdoc`: intentional multi-version compat docs
These document `createNodes`/`createNodesV2` naming differences across Nx 17–22+ on purpose, similar to a migration guide. Not flagged as a defect, but the "Nx 21 and earlier" framing could stand tightening now that Nx 21 is further in the past — docs-team call.

### NI-4 — `kb/launch-templates.mdoc`: `ubuntu22.04-node20.19-v1` and pnpm v8/npm v10 references
These are entries in a dated image changelog (a running list of what changed in each image version), not current guidance — every actual usage example on the page correctly uses `ubuntu22.04-node24.14-v1`. Likely fine as historical record; flagging only in case the changelog format itself should be pruned/archived eventually.

### NI-5 — `kb/flat-config.mdoc` line 127: "`import.meta.dirname` requires Node.js 20.11 or later"
Factually true today, but could read as endorsing Node 20 as sufficient when the site's own compatibility table already marks Node 20 as behind current LTS. Low priority.

### NI-6 — CLI/plugin drift audit didn't cover all of `guides/Nx Release/`
This cycle's CLI cross-check verified 24 hand-written pages (all accurate except C-7) against `packages/nx/src/command-line/**` and several `schema.json` files, but did not exhaustively check `guides/Nx Release/release-groups.mdoc`, `release-projects-independently.mdoc`, `configure-custom-registries.mdoc`, `customize-conventional-commit-types.mdoc`, `configure-changelog-format.mdoc`, `updating-version-references.mdoc`, `update-local-registry-setup.mdoc`, or the Module Boundaries guides — `nx release` is actively evolving (recent flags: `--multi-major-mode`, `--agentic`, `--validate`) and is a reasonable target for a focused follow-up pass.

### NI-7 — No literal GitHub App manifest found in `nrwl/ocean` to diff against
The managed `cloud.nx.app` GitHub App's permission set appears to be configured directly in GitHub's UI rather than as a checked-in manifest file — so this cycle's GitHub App permissions check (see above) was verified against call-site evidence (what the code actually calls), not a source-of-truth config file. If a manifest exists outside this repo, it wasn't reachable from here.

### NI-8 — `nx-cloud` commands not user-facing? Unclear which of the 4 fully-undocumented ones need docs at all
`clean-up-agents`, `upload-graph`, `upload-and-show-run-details`, `upload-agent-metrics` have no interactive prompts pointed at end users in `client-bundle/src/index.ts`, unlike `apply-locally` (clearly end-user-facing) — they may be internal plumbing invoked automatically by the agent lifecycle rather than something a user runs by hand. If internal-only, their absence from `reference/nx-cloud-cli.mdoc` may be intentional. Docs-team call on scope before filing a "document everything" ticket.

### NI-9 — `nx-cloud onboard` subcommands not individually re-verified this cycle
Cross-checked only that the onboarding dispatcher and its command files exist in `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/`; did not verify every listed subcommand (`status`, `connect-workspace`, `connect github`, `connect github poll`, `orgs list/create`, `repos list`, `templates list`, `vcs status`, `workspace create`) flag-by-flag against the docs.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, assignee **Linear agent** if assignable, else unassigned. Items 1–27 carried forward unchanged from the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) (re-verified where sampled this cycle — see C-1 through C-6 above). Items 28–29 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–6, 11–25, 27 | *(unchanged, see 2026-07-10 audit for full text)* | — | — |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) — **re-verified this cycle, still open (C-1)** | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice — **re-verified + expanded this cycle to include run-tasks.mdoc's version-anchored mention (C-4, C-5)** | High | 2 files |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples — **the launch-template-examples.mdoc Node 21 finding is now Confirmed, not just Needs Input (C-6)** | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones — **re-verified this cycle via v1-nx-plugin-api.mdoc and legacy-cache.mdoc (C-2, C-3)** | High | 3 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs — **terminal-ui.mdoc line 9 (NI-1) and typescript/introduction.mdoc (NI-2) add to this bucket** | Low | 8+ files |
| **28** | **Fix reference/nx-cloud-cli.mdoc: add 8 fully undocumented `nx-cloud` commands (`fix-ci`, `apply-locally`, `decrypt-artifact`, `clean-up-agents`, `upload-graph`, `upload-and-show-run-details`, `upload-agent-metrics`, `publish-conformance-rule`) and cross-link 5 more documented only on other pages (`record`, `validate`, `validate sandbox-violations`, `conformance`, `conformance:check`) (C-8)** | **High** | **1 file** |
| **29** | **Fix pass-args-to-commands.mdoc: `-args` typo should be `--args` (C-7)** | **Low** | **1 file** |

**No new issue needed** for GitHub App permissions this cycle — audited against real `nrwl/ocean` call sites and found clean.

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-07) where Linear issue creation could not be completed programmatically, and **the symptom has changed again**: `ListConnectors` this cycle reports the Linear connector as `installState: "connected"` (org-level auth is fine) but `enabledInChat: false` — i.e. it's authenticated but toggled off for this specific session/chat, which is a different failure mode than 07-10's "enabledInChat: true but zero tools exposed" or 06-17's "SSE transport removed." `ToolSearch` for `mcp__Linear__*`, `Linear`, and `create_issue` all returned no matching deferred tools.

Three different symptoms across three recent cycles (transport removed → enabled-but-no-tools → connected-but-disabled-in-chat) suggests this isn't one persistent bug but a connector that needs to be explicitly re-enabled per session, or a config issue upstream of any single fix in this repo. **Recommend Jack check the Linear connector toggle in this chat's connector settings directly** rather than waiting for a future cycle to auto-resolve it — 29 issues now sit queued in this backlog with zero created after 7 attempts.

## Recurring Checks to Run

(unchanged from prior audits — see the [area README](./README.md) for the checklist)
