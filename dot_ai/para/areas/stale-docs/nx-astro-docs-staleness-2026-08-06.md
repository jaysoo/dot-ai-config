# Nx Astro Docs Staleness Audit — 2026-08-06

**Scope note:** targeted 4-agent audit against the exact 4 smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator options that no longer match `packages/*` source, (4) Ocean/Nx Cloud feature drift — specifically the GitHub App permissions kb page and `nx-cloud` CLI command docs against the actual `nrwl/ocean` source. Item (4) is **new ground** — no prior cycle in this backlog checked the `ocean` repo. This is **not** a full re-sweep of all ~500 `.mdoc` files; the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) remains the last exhaustive full-file sweep. This cycle re-verified a sample of previously open items opportunistically (see "Re-verified" below) while grepping adjacent content, and found several docs pages have been **reorganized** since 2026-07-10 (moved out of `guides/` and `extending-nx/` into `kb/`) — paths below reflect the current tree.

**Verification method (per this file's own rules — see README):** Current Nx version verified live via `git ls-remote --tags origin` on the `nx` checkout → latest is **23.1.1** (major 23). Node.js/npm/framework versions in docs were checked against the current 2026-08-06 EOL landscape (Node 20 EOL, Node 22/24 LTS current) — see Node/framework section below, which came back clean. CLI/schema findings were verified by reading the actual `packages/nx/schemas/nx-schema.json`, `command-object.ts`, and generator `schema.json` files, not from model training data. Ocean findings were verified by reading actual source in the local `/home/user/ocean` checkout (`GithubApi.kt`, `GithubActionsClient.kt`, `client-bundle/src/index.ts` and its command files) — no GitHub App manifest file exists in the ocean repo, so that comparison is inferred from which endpoints the app's installation token is used to call (see Needs Input).

**Linear MCP status:** still unavailable this cycle — `ListConnectors` shows the Linear connector as `installState: connected` (org-level) but `enabledInChat: false` for this session, and `ToolSearch` surfaces zero Linear tools. This is a **different symptom** than 2026-07-10 (`enabledInChat: true` but zero tools) and 2026-06-17 ("SSE transport removed") — three different failure modes across three cycles now. All issues below are queued for manual creation, appended to the running backlog (items 1–27 carried from prior audits, items 28–37 new this cycle).

---

## Summary

| Category | Confirmed (new this cycle) | Needs Input |
| --- | --- | --- |
| Old Nx version reference | 8 new files/anchors (+ 4 re-verified still-open from prior cycles, now on moved paths) | 2 |
| Old Node/npm/framework version | 0 (clean sweep) | 0 |
| Mismatched CLI/config option vs. source | 4 new | 1 (schema JSON files themselves, not docs) |
| Ocean feature drift (GitHub App / nx-cloud CLI) | 2 new | 2 |
| **Total** | **14 new** | **5** |

---

## Confirmed Findings — New This Cycle

### 1. `kb/deploying-node-projects.mdoc` — "Nx 20+" anchor for current default
**Lines:** frontmatter `description` + line 197
**Category:** old-nx-version
**Issue:** Frontmatter: *"Replaces the deprecated generatePackageJson option in Nx 20+."* Line 197: *"If you're upgrading to Nx 20+ with TS Solution Setup (the default for new workspaces)..."* Nx 20 is 3 majors behind current 23 — this reads as a floor/gate rather than the current, long-standing default.

### 2. `guides/ci-deployment.mdoc:8` — "the default in Nx 20+"
**Category:** old-nx-version
**Issue:** *"If your workspace uses TS project references (the default in Nx 20+), use the prune workflow instead."* Same "Nx 20+" default-anchor pattern in an active deployment guide.

### 3. `kb/personal-access-tokens.mdoc:13` — "From Nx 19.7" (second, previously-unflagged copy)
**Category:** old-nx-version
**Issue:** *"From Nx 19.7 repositories are connected to Nx Cloud via a property in `nx.json` called `nxCloudId`."* This is the **same underlying stale claim** as the already-tracked `kb/access-tokens.mdoc:279` issue (backlog item 24, originally flagged as `guides/Nx Cloud/access-tokens.mdoc`, now moved to `kb/`) — but it lives on a **separate page** that was never flagged before. Fixing one page will not fix the other.

### 4. `reference/project-configuration.mdoc` — 2 additional stale version anchors beyond the tracked one
**Category:** old-nx-version
**Issue:** Backlog item 26 already tracks line ~233 ("Nx 19.5.0+"). This cycle found two more on the same page:
- Line 457: *"Starting from v19.5.0, wildcards can be used to define dependencies in the `dependsOn` field."*
- Line 533: *"Additionally, when using the expanded object syntax, you can specify individual projects in version 16 or greater."* — Nx 16 is 7 majors behind current.

### 5. `kb/pass-args-to-commands.mdoc:175` — "Nx v18.1.1"
**Category:** old-nx-version
**Issue:** *"Support for providing command args as options was added in Nx v18.1.1."* 5 majors behind current, phrased as a feature-floor note on an active reference/KB page.

### 6. `reference/nx-json.mdoc` "Task options" table — wrong root-level properties (verified independently against `packages/nx/schemas/nx-schema.json`)
**Category:** mismatched-feature
**Issue:** Line 192 states the table's properties *"can be set at the root of `nx.json`"* and lists `parallel`, `captureStderr`, `skipNxCache`, `cacheDirectory`, `encryptionKey`, `selectivelyHashTsConfig`. I read `packages/nx/schemas/nx-schema.json`'s root `properties` directly — the actual root keys are: `affected, analytics, cacheDirectory, cli, conformance, defaultBase, defaultProject, extends, generators, implicitDependencies, migrate, namedInputs, neverConnectToCloud, nxCloudAccessToken, nxCloudEncryptionKey, nxCloudUrl, owners, parallel, plugins, release, sync, targetDefaults, tasksRunnerOptions, tui, useDaemonProcess, useInferencePlugins, workspaceLayout`. `captureStderr` and `skipNxCache` are **not** in that list — they only exist under `tasksRunnerOptions.<runner>.options`. The Cloud encryption field **is** a real root property, but it's named `nxCloudEncryptionKey`, not `encryptionKey` as documented — a reader writing `{ "encryptionKey": "..." }` at the nx.json root would have no effect. `cacheDirectory` and `parallel` are correctly root-level.

### 7. `reference/nx-json.mdoc` — `selectivelyHashTsConfig` looks dead in current code
**Category:** mismatched-feature
**Issue:** Documented on the same table as a root nx.json option (defaults to `false`). Grepped all of `packages/nx/src` — the string only appears in `hasher/task-hasher.ts` (passed through an untyped `options: any` constructor arg), `native/index.d.ts`, `plugins/js/hasher/hasher.ts`, and test files. It is never read from `nxJson` (root or `tasksRunnerOptions`) anywhere, and it's absent from `nx-schema.json`'s actual typed properties and from `DefaultTasksRunnerOptions`. Needs a maintainer call on whether this was intentionally de-wired (then docs should be removed/updated) or is a genuine gap.

### 8. `reference/inputs.mdoc` — missing the `json` input type
**Category:** mismatched-feature
**Issue:** The page documents project-configuration, command-argument, source-file, env-var, runtime, working-directory, external-dependency, dependent-task-output-file, tsconfig-subset, and named-input-reference input types — but never mentions the `{ "json": "path", "fields": [...], "excludeFields": [...] }` shape, which is defined in both `nx-schema.json` and `project-schema.json`'s `definitions.inputs` and is implemented natively (`native/tasks/hashers/hash_json.rs`, referenced in `native/index.d.ts`). This is a genuinely useful, fully-shipped input type that's simply absent from the reference page.

### 9. `reference/project-configuration.mdoc` — missing project-level `generators` defaults documentation
**Category:** mismatched-feature
**Issue:** `nx-json.mdoc` documents the workspace-level `generators` defaults property under its own "## Generators" section, but `project-configuration.mdoc` has no equivalent section for the project-scoped `generators` property, even though it's defined in `project-schema.json` ("List of default values used by generators") and actively read in `packages/nx/src/utils/params.ts` off `projectsConfigurations.projects[projectName].generators`.

### 10. `reference/environment-variables.mdoc` — missing `NX_MULTI_MAJOR_MODE`
**Category:** mismatched-feature
**Issue:** `nx-json.mdoc` itself references `NX_MULTI_MAJOR_MODE` twice ("The `NX_MULTI_MAJOR_MODE` environment variable takes precedence over this value"), and it's a real, actively-read override in `command-line/migrate/command-object.ts`, `migrate/multi-major.ts`, `migrate/migrate-config.ts`, and `config/nx-json.ts`. Its sibling migrate env vars (`NX_MIGRATE_USE_REGISTRY_RESOLUTION`, `NX_MIGRATE_SKIP_REGISTRY_FETCH`) **are** correctly documented on this page — this is a narrow, clean omission, not a symptom of a broader gap.

### 11. `kb/github-app-permissions.mdoc` — "Actions: Read" usage description too narrow
**Category:** ocean-feature-drift
**Issue:** The permission-details section says `Actions: Read` is used *"Only when using Nx Cloud MCP tools to get CI information."* Reading the actual ocean source, `GithubActionsClient.kt` (hits `/actions/runs`, `/actions/runs/{id}/jobs`, `/actions/jobs/{id}/logs`) is invoked via `ExternalCIRunService.syncByBranches`, which is triggered from **two** places: `NxConsoleHandlers.kt` (an Nx Console endpoint, gated by `NX_CLOUD_EXTERNAL_CI_SYNC_ENABLED`) and `PolygraphSessionService.kt` (Polygraph session CI status sync) — neither is "Nx Cloud MCP tools." The permission itself is correctly listed as required; only the stated trigger condition is stale/too narrow.

### 12. `reference/nx-cloud-cli.mdoc` — missing commands and a flag, confirmed against `ocean/libs/nx-packages/client-bundle/src/index.ts`
**Category:** ocean-feature-drift
**Issue:** The actual `nx-cloud` CLI dispatch table has 25 command keys. The "complete reference for all Nx Cloud CLI commands" page documents only 12 of them. Specifically missing:
- **`nx-cloud fix-ci`** — the self-healing CI trigger command — is entirely absent. High confidence: the command's own baked-in `--help` text in `client-bundle/src/lib/core/commands/fix-ci.ts` literally links to `https://nx.dev/ci/reference/nx-cloud-cli#npx-nxcloud-fix-ci`, an anchor that doesn't exist because this page has no `fix-ci` section.
- **`nx-cloud apply-locally <fix-identifier>`** (with a `--no-interactive` flag, per its own `--help` text) — mentioned only in a changelog bullet and a screenshot elsewhere, never documented with syntax/flags here.
- **`nx-cloud record`** (and `nx record` alias) — actual syntax `npx nx-cloud record -- <command> [args...]` per its `--help` text — missing from this "complete" reference. (There's a separate `guides/Nx Cloud/record-commands.mdoc` guide, but it documents the older `nx record --` alias without flags, and its own code-embedded help link points to a path that doesn't match where the guide currently lives — a secondary, smaller drift worth folding into the same fix.)
- **`get sandbox-reports`** is documented but missing its `--latest-reports-only` boolean flag (defaults to `true`; `--no-latest-reports-only` fetches all reports per task, per the command's own help text).

---

## Re-verified — Still Open (carried forward from prior cycles, paths updated)

The docs site has been reorganized since 2026-07-10 — several previously-flagged files moved out of `guides/` and `extending-nx/` into `kb/`. Confirmed still-present at their new paths:

- **`kb/access-tokens.mdoc:279`** ("Nx Cloud authentication is changing" / "From Nx 19.7...") = backlog item 24 (was `guides/Nx Cloud/access-tokens.mdoc`). Still open.
- **`kb/task-running-lifecycle.mdoc:14`** ("since Nx 20.4+") = backlog item 26 / prior NI-2 (was `extending-nx/task-running-lifecycle.mdoc`). Still open.
- **`kb/include-all-packagejson.mdoc`** ("As of Nx 15.0.11") = backlog item 26 / prior NI-3 (was `guides/Tips-n-Tricks/include-all-packagejson.mdoc`). Still open.
- **`reference/glossary.mdoc:154,231`** ("Nx 15.3", two entries) = backlog item 26 / prior NI-3. Still open, path unchanged.
- **`reference/project-configuration.mdoc:233`** ("Nx 19.5.0+") = backlog item 26 / prior NI-2. Still open, path unchanged (see finding #4 above for 2 more instances on this same page).
- **`technologies/typescript/introduction.mdoc:217`** ("as of Nx 20") = backlog item 26 / prior NI-2. Still open, path unchanged.

Node/npm/framework version claims in these and other pages were re-checked as part of the clean Node/framework sweep this cycle (see below) — no additional drift found.

---

## Node/npm/Framework Version Sweep — Clean

A full grep sweep of all 478 `.mdoc` files for EOL Node versions (14/16/18/20/21 as current guidance), old CI `node-version:` pins, and old framework majors (React ≤17, Angular pre-15, webpack 4, Jest ≤28, etc.) found **zero confirmed issues**. All CI YAML samples use Node 24; Docker/CircleCI images use `node:22`/`lts-alpine`/`lts`; the `technologies/node/introduction.mdoc` compatibility table correctly lists Node 26.x/24.x/^22.12.0 for current Nx; framework "Supported Versions" tables (React, Angular, Next.js, Webpack, Jest, Vite, Cypress, Playwright) all list current majors. `kb/angular-nx-version-matrix.mdoc` and the historical rows in the Node compatibility table are legitimate reference/history content, correctly excluded per this audit's own rules. **No Linear issues needed from this category this cycle.**

---

## Needs Input

### NI-9 — `kb/adding-assets-react.mdoc:50` — SVGR removal tense now ambiguous
*"As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)."* Current published major is now **23** (23.1.1) — "will be removed in Nx 23" describes a milestone that has arrived. Needs confirmation from the docs/plugin owners on whether SVGR-for-Rspack has actually been removed yet, so the copy can move from future to present/past tense (or stay future-tense if the removal is still pending in a later 23.x point release).

### NI-10 — `kb/createnodes-compatibility.mdoc:170` — same tense issue, and possibly self-contradictory
The "Future deprecation timeline" section says *"Nx 23: The `createNodesV2` export will be marked as deprecated in TypeScript types"* — but the compatibility table earlier on the same page already shows Nx 23.x+ treating `createNodesV2` as a "deprecated alias," which reads as already-true. Needs a plugin-author check on the actual current state and a tense fix.

### NI-11 — `packages/nx/schemas/{nx-schema,project-schema}.json` are themselves stale relative to the TypeScript source (not a docs-content bug — flag for nx-core engineering, not Docs team)
While verifying finding #6 above, spot-checked the schema JSON files against the actual TS config types and found two more gaps **in the schema files themselves** (the docs pages that link to them as "the full machine readable schema" are otherwise correct): (a) both schemas' `inputs` definitions are missing the `workingDirectory` input type, which is implemented and correctly documented in `inputs.mdoc`; (b) `project-schema.json`'s `release` property only lists `version`, omitting `docker`, even though `workspace-json-project-json.ts` defines `release.docker` and `project-configuration.mdoc` correctly documents project-level Docker release overrides. Recommend routing this to nx-core (not Docs) since the fix is in `packages/nx/schemas/*.json`, not in `astro-docs`.

### NI-12 — `kb/github-app-permissions.mdoc` — org-level `Administration: Read Only` and `Members: Read Only` unexplained
The "Required permissions" table lists both, but the "## Permission details" section only elaborates on Checks, Contents, Commit statuses, Issues, Metadata, Pull requests, Workflows, and Actions — no subsection for either org-level permission. Found clear usage for `Members: Read` (`fetchOrgMemberIds`/`listOrganizationMembers` in `GithubApi.kt`, org member/admin role sync), but after a thorough search could not find any current `nx-api` code path using an org-level `Administration` scope. May be dead/legacy, or used somewhere not found (e.g. SAML/SSO enforcement) — flagging rather than asserting unused.

### NI-13 — `kb/github-app-permissions.mdoc` — no committed GitHub App manifest exists as ground truth
Searched extensively (`app.yml`, `*manifest*`, `default_permissions`, Terraform/HCL, Probot-style config) in the `ocean` repo and found nothing — the App's permission scopes appear to be configured directly in GitHub's App settings UI, not in a committed file. All comparisons above are inferred from which endpoints the installation token calls in code, a reasonable proxy but not a hard manifest diff. If this config lives in GitHub's UI or an infra repo outside `nx`/`ocean`, that's the real source of truth and this audit couldn't reach it.

### NI-14 — `reference/nx-cloud-cli.mdoc` — several dispatch-table commands undocumented, possibly intentionally
`upload-graph`, `decrypt-artifact`, `clean-up-agents` (distinct from the documented `stop-all-agents`/`cleanup` — removes local Nx Agents lockfiles), and `upload-and-show-run-details` have no docs presence anywhere in astro-docs. These look like they may be internal plumbing invoked by Nx Cloud's own tooling rather than end users — flagging for a docs-team call on whether to document or explicitly mark internal, rather than asserting a gap. Separately, `validate`, `conformance`/`conformance:check`/`publish-conformance-rule(s)`, and `upload-agent-metrics` **are** documented but scattered across `kb/launch-templates.mdoc`, `kb/custom-steps.mdoc`, `kb/fix-sandbox-violations.mdoc`, `enterprise/conformance.mdoc`, and `kb/bring-your-own-compute.mdoc` rather than consolidated into the "complete" CLI reference — a completeness/consolidation gap, not a correctness one (flags checked, e.g. `validate --workflow-file/--step-file`, match code).

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, unassigned (Linear agent auto-assignment not possible without connector access — see status note). Items 1–27 carried forward unchanged from prior audits (see [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) and [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) for full text) — still open, 3 of them re-verified this cycle at new (moved) file paths as noted above. Items 28–37 are new this cycle.

| # | Title | Severity | Files |
| --- | --- | --- | --- |
| 1–27 | *(carried forward from 2026-06-29 / 2026-07-10 — see those files for full text; unchanged except paths noted in "Re-verified" above)* | — | — |
| 28 | Fix `kb/deploying-node-projects.mdoc`: replace "Nx 20+ is the default" TS Solution Setup anchors (frontmatter + body) with current-state phrasing | Medium | 1 file |
| 29 | Fix `guides/ci-deployment.mdoc`: replace "the default in Nx 20+" TS project references anchor with current-state phrasing | Medium | 1 file |
| 30 | Fix `kb/personal-access-tokens.mdoc`: remove/rephrase "From Nx 19.7 repositories are connected..." anchor — a second, previously-unflagged page carrying the same stale claim as open item 24 | Medium | 1 file |
| 31 | Fix `reference/project-configuration.mdoc`: 2 more stale version anchors ("Starting from v19.5.0" wildcards at ~line 457; "version 16 or greater" individual-project syntax at ~line 533) beyond the already-tracked line-233 issue; also add missing documentation for the project-level `generators` defaults property (exists in `project-schema.json`, read by code, undocumented) | Medium | 1 file |
| 32 | Fix `kb/pass-args-to-commands.mdoc`: remove/rephrase "added in Nx v18.1.1" anchor | Low | 1 file |
| 33 | Fix `reference/nx-json.mdoc` "Task options" table: `captureStderr`/`skipNxCache` are documented as settable at the nx.json root but only exist under `tasksRunnerOptions.<runner>.options`; the real root-level Cloud field is `nxCloudEncryptionKey`, not `encryptionKey` as documented. Also verify whether `selectivelyHashTsConfig` is dead code (not read from `nxJson` anywhere in `packages/nx/src`) and fix/remove docs accordingly | High | 1 file |
| 34 | Fix `reference/inputs.mdoc`: document the missing `json` input type (hash a subset of a JSON file's fields via `fields`/`excludeFields`) — defined in the schemas and implemented natively, absent from the reference page | Medium | 1 file |
| 35 | Fix `reference/environment-variables.mdoc`: add missing `NX_MULTI_MAJOR_MODE` row — referenced twice by `nx-json.mdoc` itself and actively read in migrate command code, but has no entry in the env var reference | Medium | 1 file |
| 36 | Fix `kb/github-app-permissions.mdoc`: correct the "Actions: Read" permission-detail description — says "Only when using Nx Cloud MCP tools," but actual usage is also triggered by Nx Console's external CI sync endpoint and Polygraph session CI status sync | Medium | 1 file |
| 37 | Fix `reference/nx-cloud-cli.mdoc`: add missing sections for `nx-cloud fix-ci` (its own `--help` text links to a page anchor that doesn't exist here) and `nx-cloud apply-locally <fix-identifier>`; add a section for `nx-cloud record`/`nx record` (currently only covered by an outdated separate guide using the old alias syntax without flags); add the missing `--latest-reports-only` flag to `get sandbox-reports` | High | 1 file |

**Running backlog total: 37 issues, 0 filed.**

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit cycle** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-06) where Linear issue creation could not be completed programmatically, with a **third distinct failure symptom**:
- 2026-06-17: "SSE transport removed"
- 2026-06-24 through 2026-06-29: MCP unavailable (symptom not further specified in those files)
- 2026-07-10: `ListConnectors` showed `enabledInChat: true`, but `ToolSearch` returned zero Linear tools for any query
- **2026-08-06 (this cycle): `ListConnectors` shows `installState: "connected"` at the org level but `enabledInChat: false` for this session** — the connector is authenticated but explicitly toggled off for chat use, a different state than 07-10's "enabled but empty."

Three different symptoms across three checks strongly suggests this isn't one transient bug but either (a) the connector's chat-enablement setting is being reset/toggled between sessions, or (b) automated/scheduled sessions (this one included) don't carry the same chat-enablement state as interactive sessions. Recommend checking claude.ai connector settings directly, specifically whether Linear is enabled for **this scheduled task's session context** and not just the interactive one — 6 manual-creation cycles and a 37-issue backlog is now enough accumulated cost to justify investigating rather than retrying per-audit.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
