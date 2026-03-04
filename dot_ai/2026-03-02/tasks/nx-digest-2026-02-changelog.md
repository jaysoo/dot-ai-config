# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear (NXC, CLOUD, INF, NXA, Q, DOC teams).

---

## Task Sandboxing & IO Tracing

### CLI
- Add initial impl of task io service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- Add passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3
- Filter non-cacheable and continuous tasks from sandbox violations (NXC-3951)
- Enhance `nx show target` with inputs/outputs inspection (NXC-3762, NXC-3763, NXC-3764)
- Add `--inputs` and `--check-input` / `--outputs` and `--check-output` flags to `nx show target`
- NX CLI PID listeners (NXC-3728)
- Expand hash inputs in TaskIOService for cloud consumption (NXC-3761)
- Fix: daemon does not detect all tasks (NXC-3841)
- Fix: not all file reads and writes are captured (NXC-3835)
- Fix: only listen for file events in the workspace directory (NXC-3837)
- Fix: output files should be relative to ws dir (NXC-3844)
- Fix: traced task missing filesWritten for tar.gz from run-commands (NXC-3863)
- Fix: cloud runner missing outputs from run-commands with multiple commands (NXC-3897)

### Cloud
- Add API endpoint to support persisting io tracing reports sent from Nx Agents (2602.12.11)
- Anomaly report log API endpoint for frontend (Q-193)
- Anomaly endpoint (Q-126)
- Strict mode toggle UI (Q-187)
- Strict mode violations fail DTE (Q-188)
- Show sandbox violation banner in WARNING mode (Q-207)
- Task list view warning indicator for tasks with trace issues (Q-208)
- IO trace analysis section in task details view (Q-209)
- Download raw report button (Q-215)
- Use virtualized views for file tree (Q-248)
- Expose PID and command for file read/write (Q-246)
- Display process command (Q-257)
- Enable sandboxing env vars on staging (Q-244)
- Skip generating signal file for cache hits, non-cacheable and continuous tasks (Q-241)
- Filter out reads from outside of the workspace root (Q-256)
- Fix: daemon may be over-sending task completion reports (Q-232)
- Fix: missing raw file when sandbox report exists (Q-233)
- Fix: avoid showing sandbox UI if no sandbox report present (Q-229)
- Fix: investigate oomKills on the daemon pod (Q-195)

### Infrastructure
- Deploy io-trace-daemon helm chart to development, staging, production (multiple commits, Feb 2-27)
- Add io-tracing SA + permissions + k8s permissions to prod (0f57bdd9)
- Add io-tracing SAs to GCP and AWS single-tenants (ee12326c, 1067cf17)
- Add io-trace-daemon ECR repo for AWS (35642447)
- Enable io tracing signal files on snapshot (97e7084b)
- Enable sandboxing on staging (ca1fc1f2)
- Enable sandbox endpoints on snapshot nx-api (fa415a4b)
- Increase io-trace-daemon ringbuf size and memory (cfd23f4d)
- Increase cpu limit for io trace daemon (1d45c80a)

---

## Self-Healing CI

### Cloud
- Self-Healing CI setup for new workspaces with BitBucket and Azure DevOps (2602.02.4)
- Auto-apply fix recommendations shown inline in settings + during fix application (2602.03.2)
- Self-healing failure reasons in Technical Details section (2602.12.5)
- Remove experimental badge from AI features (2602.18.3)
- Highlight pending auto-apply recommendations when applying changes via VCS or apply-locally (2602.19.6)
- Self-Healing CI enabled during repository onboarding with opt-in checkbox (2602.26.2)
- Combine warnings into a single block on GH comment (NXA-866)
- Ensure obfuscated client bundle contents do not get written to agent logs (NXA-873)
- Track when custom ANTHROPIC_API_KEY is in use (NXA-872)
- Internal AI credits reporting (NXA-868)
- Make custom hook logger available on all fixes (NXA-883)
- Increase fix timeout from 30 mins to 90 (NXA-884)
- Add audit logging for self-healing config changes (NXA-855)
- Add self-healing indicators to workspace and org dashboards (NXA-870)
- Expose auto-apply recommendations UI to everyone (NXA-889)
- Add a way to retry self-healing on latest commit (NXA-946)
- Surface self-healing logs in CIPE UI (NXA-892)
- Add passthrough for `nx-cloud apply-locally` to `nx` (NXA-1001)
- Adjust "too many unapplied fixes" logic (NXA-1002)
- Refactor self-healing flow to handle code changes separately (NXA-718)
- Use previously accepted/rejected fixes as additional context for Claude (NXA-518)
- Self-serve adoption data (NXA-941)
- Fix: self-healing comment state incorrect after applying fix (NXA-728)
- Fix: self healing fix apply fails due to serialization error (NXA-928)
- Fix: verification tasks briefly show as failing until completion (NXA-867)
- Fix: applied-automatically comment not posted on auto-applied PR review (NXA-877)
- Fix: "too many unapplied fixes" link loops (NXA-945)
- Fix: self-referential warning link (NXA-971)
- Fix: adjust bitbucket self-healing comment (NXA-837)
- Fix: MailChimp error logging and execution failures on git diff (NXA-882)
- Fix: enhance git command failure messages (NXA-933)
- Fix: occasional git merge-base failures for bitbucket (NXA-964)

---

## AI-Powered Development (Agentic Experience)

### CLI
- Improve configure-ai-agents to copy nx skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- Improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- Add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- Add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- Preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- Fix: make sure that mcp args aren't overridden in configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- Fix: handle Ctrl+C gracefully in configure-ai-agents (9128fcb66f) — 22.5.2
- Fix: only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2
- Fix: tweak configure-ai-agents messaging ([#34307](https://github.com/nrwl/nx/pull/34307)) — 22.5.0

### Cloud (Red Panda)
- Ensure new setup with minimal is respected in VSCode & Cursor (NXA-887)
- Make sure `nx mcp` uses latest version of `nx-mcp` (NXA-942)
- Re-check configure-ai-agents updating cursor/opencode configs (NXA-958)
- Implement agentic CNW that sets up the platform (NXA-920)
- Make sure flag overrides in mcp config aren't reverted on changes (NXA-967)
- Find good way to configure nx mcp flags when run through claude plugin (NXA-960)
- Improve agent-controlled create-nx-workspace (NXA-890)
- Migrate claude plugin to repo root instead of /generated (NXA-982)
- Add gifs to nx-ai-agents-config to showcase value (NXA-981)
- Automatically create agent config for the agent executing nx for init/cnw (NXA-1005)
- Build mechanism to show people configure-ai-agents is outdated (NXA-943)
- Add hints to MCP tool structuredContent (NXA-957)
- Set up release flow for AI agent configs (NXA-841)
- Fix: agent tries to commit/push after applying self-healing fix (NXA-983)
- Fix: CI monitor commits unrelated local changes with git add -A (NXA-951)
- Fix: agent misuses gh CLI instead of CI monitor skill (NXA-926)
- Fix: agentic CLI misclassifies Nx Cloud CI failure cause (NXA-891)
- Fix: nx console for cursor mcp tool handling (NXA-1017)

---

## Continuous Task Assignment

### Cloud (Quokka)
- Break up current DTE scheduler into branched implementation (Q-189)
- Continuous assignment implementation (Q-197)
- dte-benchmark package supports seeding and executing multiple DTEs (Q-191)
- DTE exporter supports pulling ALL DTEs from a given run group (Q-190)
- Create Nx plugin that recreates task graph from export (Q-139)
- Long polling rework with Valkey assignment (Q-210)
- Worker orchestrator remembers and ignores retrieved hashes (Q-225)
- WaitingAgents invalidation improvements (Q-224)
- Fix: non-cacheable tasks not guaranteed to run on requiring agent (Q-205)
- Fix: metrics collection doesn't work properly (Q-206)
- Fix: main job fails downloading artifacts (Q-213)
- Fix: workers that stall during shutdown cause a loop (Q-214)
- Fix: Valkey writes non-cacheable completion on assignment rather than completion (Q-216)
- Fix: shrinking worker pool may kill worker executing tasks (Q-220)
- Fix: complete-tasks and assign-tasks don't populate agent metadata (Q-223)
- Fix: tasks identified as candidates for flaky retries should not update execution status (Q-222)
- Fix: agent exits after all workers are spun down (Q-227)
- Fix: analysis screen visualization always shows utilization at 0% (Q-203)

---

## Workspace Onboarding & Connection

### Cloud
- Streamline version control integration forms for easy setup (2602.17.4)
- Allow users to connect workspaces using PNPM catalogs through GitHub/GitLab (2602.19.9)
- Workspace-Repository access syncing — match workspace access to VCS repo access (2602.27.5)
- Landing page link for CNW users to create workspace (2602.27.7)
- Fix: create-nx-workspace form "Update permissions" button missing (2602.03.1)
- Fix: back links in connect workspace flows (2602.04.2)
- Browser-based CNW bottom sheet replacement (CLOUD-4221)
- One-page GitHub/GitLab flow UI updates (CLOUD-4119)
- Test GitLab one-page onboarding flow on staging (CLOUD-4195)
- Simplify VCS integration forms (CLOUD-4279)
- Update /guide route for CNW users (CLOUD-4305)
- Multiple CNW prompt experiments (CLOUD-4235, CLOUD-4255, CLOUD-4288, CLOUD-4304)

### CLI
- Add variant 2 to CNW cloud prompts with promo message ([#34223](https://github.com/nrwl/nx/pull/34223)) — 22.5.0
- Add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- Add decorative banners for Nx Cloud CNW completion message ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- Add nxVersion to meta in shortUrl for CNW ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.5.1
- Fix: CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- Fix: prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2
- Fix: preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3

---

## Workspace Visibility

### Cloud (Red Panda)
- Redesign public/private repository sync (NXA-861)
- Add new isPublic field to workspace data model (NXA-893)
- Handle public/private migration for workspaces (NXA-902)
- Add feature flag for workspace visibility (NXA-904)
- Add visibility toggle to workspace settings (NXA-901)
- Remove visibility toggle from organization settings (NXA-900)
- Updated design doc for repository access sync (NXA-1019)
- Add OAuth integration for Bitbucket (NXA-898)

### Infrastructure
- Enable NX_CLOUD_WORKSPACE_VISIBILITY_ENABLED env var on dev (8816589d)
- Enable NX_CLOUD_REPOSITORY_ACCESS_ENABLED env var on dev (fba05e1b)

---

## Framer Marketing Site Migration

### Cloud
- Migrated 44 pages: Homepage, Pricing, Enterprise, Security, Partners, Community, Customers, Careers, 404, Solutions (Platform/Engineering/Management/Leadership), Contact (Sales/Labs/Engineering/Enterprise Trial), Resources, Webinar, Blog, React, Java, Remote Cache, Nx Cloud, Brands, Company
- Migrate header to Framer (CLOUD-4263)
- Enable rewrites for all Framer pages on canary (CLOUD-4269)
- Set canonical URL in Framer to point to nx.dev (CLOUD-4148)
- Consolidate marketing scripts into Google Tag Manager (CLOUD-4252)
- Add Framer event tracking bridge to GTM (CLOUD-4202)
- Add custom tracking events (CLOUD-4256)
- Pricing page refresh with new plan tier cards (CLOUD-4286, CLOUD-4287)
- Review SEO titles and descriptions for all Framer pages (CLOUD-4283)
- Update website copy and assets for new brand messaging (CLOUD-4284)

---

## JVM Ecosystem (Gradle & Maven)

### CLI — Gradle
- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Add debug env var to gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- Use tooling API compatible flags ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- Ensure batch output is not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.4.5/22.5.0
- Enforce that only one gradle task can be passed into executor ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.4.5/22.5.0
- Use gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- Ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- Use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3

### CLI — Maven
- Load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- Bump maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- Include pom.xml and ancestor pom files as inputs for all targets ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.4.5/22.5.0
- Correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- Use module-level variable for cache transfer between createNodes and createDependencies ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- Write output after each task in batch mode to ensure correct files are cached ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- Fix set the pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3

### Cloud (Quokka) — Gradle
- Dependent tasks generated with incorrect project names (Q-170)
- Set prefix for Gradle tasks (Q-173)
- Atomized test targets missing dependsOn (Q-174)
- Ensure dependent task output files use correct path (Q-247)

---

## Performance & Reliability

### CLI — Daemon & Resource Usage
- Eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- Reduce daemon inotify watch count by upgrading watchexec ([#34329](https://github.com/nrwl/nx/pull/34329)) — 22.5.0
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- Use `jemalloc` as the allocator (NXC-3877)
- Replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.5.2
- Skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.5.2
- Gate tui-logger init behind NX_TUI env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.5.2
- Use picocolors instead of chalk in the nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0
- Cache compiled glob patterns in native module to avoid redundant recompilation (NXC-3960)
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- Use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3

### CLI — TUI
- Move tui to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- Handle resizing better for inline_tui ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- Avoid crash when pane area is out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- Reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- Preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- Hitting [1] or [2] removes pinned panes if they match current task ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.5.1

### CLI — Daemon Fixes
- Handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.4.5/22.5.0
- Resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.4.5/22.5.0
- Handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- Clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- Allow overriding daemon logging settings ([#34324](https://github.com/nrwl/nx/pull/34324)) — 22.5.0
- Reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3

### Cloud
- Large runs no longer crash when daemon is enabled (2602.10.2)
- Task list sorting stable when items share the same primary sort value (2602.23.8)

### Infrastructure — Workflow Controller
- Enable async status updates in production NA/EU (a41bc05b)
- Enable async status updates for single-tenants: ClickUp, Emeria, Island, Flutter, Mimecast (multiple commits)
- Remove async processing feature flag (INF-1126)
- Bump workflow controller to 2 replicas for NA/EU (6d70b2f4)
- Handle signals for graceful rollout (INF-1133)
- Enable SubPath volumes on all environments (INF-1131)
- SubPath volume is the default (INF-1130)
- Workflow controller resource classes support DiskSize (INF-1129)
- Enable Valkey metrics scraping for workflow queue data (10ccbda3)

### Infrastructure — Scaling & Reliability
- Bump Celonis nx-api 3->6 replicas (724c3ced)
- Bump Island nx-api 3->6 replicas (b4c1b1c3)
- Move api/frontend replica settings to common config (64a95fd0)
- Deploy nginx-backed npm read-through cache for enterprise tenants (multiple commits)
- Migrate AL2 agent nodegroups to AL2023 (bde77c3a, dad11543)
- Use 1 nodegroup per zone instead of 1 nodegroup with multiple subnets for agents (d257ac8a)
- Investigate and fix nx-api memory leak (Q-171)
- Handle JSON.stringify limit for processInBackground daemon calls (Q-185)

---

## Security

### CLI
- Prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.4.5/22.5.0
- Bump minimatch to 10.2.1 to address CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1

### Cloud
- New `nx-cloud decrypt-artifact` command for E2E encrypted workspaces (2602.12.6)
- Access control settings require confirmation before saving (2602.11.1)
- Remove direct upload from executor/log uploader — enforce signed storage (INF-1140)
- Ensure obfuscated client bundle contents not written to agent logs (NXA-873)

### Infrastructure
- Remediate "Enabled IAM User Access Keys must not be older than 90 days" for multiple users (INF-1189, INF-1190, INF-1192)
- Move lighthouse to secure db password (5d26273a)
- Wire up new google secrets for lighthouse (c39965ec)
- Remove IAP connections from lighthouse (77fcf5b3)
- Login audit log, view page, and future extension framework for lighthouse (INF-1204)
- User filter on audit page (INF-1222)

---

## Polygraph AI (Multi-Repo Coordination)

### Cloud (Red Panda)
- Create repository discovery API endpoint (NXA-843)
- Implement PR creation and coordination (NXA-851)
- Create polygraph skills (NXA-876)
- Multi-repo implementation (NXA-939)
- Create Nx Cloud Polygraph session UI (NXA-850)
- PR graph visualization in UI and GitHub comment (NXA-915)
- Support repo selection (NXA-1010)
- Associate already opened PR to polygraph session (NXA-955)
- Mark ready for review updates descriptions in open PRs (NXA-950)
- Support for closing/completing sessions (NXA-985)
- Track author who creates the session (NXA-977)
- Add support for session description (NXA-976)
- Implement GitHub Actions integrations (NXA-1014)
- Update GitHub PR comment (NXA-987)
- MCP polygraph tools auto-install the client bundle (NXA-963)
- Design doc for GitHub status updates (NXA-988)
- Handle breaking changes in PR graphs that require releases (NXA-916)
- Handle required user input (NXA-910)
- Local interaction with polygraph session (NXA-912)
- Fix: delegate tool times out (NXA-948)
- Fix: init does not get repos that are dependencies of dependencies (NXA-947)
- Fix: replace token handling when cloning repos (NXA-956)

---

## Documentation & Website

### Docs Site
- Add llms-full.txt and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- Reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- Add server-side page view tracking for docs ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.4.5/22.5.0
- Make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.4.5/22.5.0
- Improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- Include nx CLI examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- Boost CLI command reference search ranking ([#34625](https://github.com/nrwl/nx/pull/34625))
- Widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- Update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- Correct interpolate sub command for CLI reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- Move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3
- Exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- Fix OG images wrong URL for embeds ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- Use right URL for the given Netlify context ([#34348](https://github.com/nrwl/nx/pull/34348)) — 22.5.0
- Use shared preview URL for Netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- Fix double-counting and exclude assets from page tracking ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.4.5/22.5.0
- Update broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192)) — 22.5.0
- Update dead links across nx-dev UI libraries ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0
- Fix internal link check caching ([#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2

### Docs Content (Linear)
- Switch DNS to Netlify for nx.dev (DOC-397)
- New sidebar structure PoC (DOC-365)
- Improve AX for Getting Started / Intro pages (DOC-405)
- Dedupe content across all Getting Started pages (DOC-406)
- Propose structure and content for Technology pages (DOC-407)
- Add Requirements section to relevant tech docs pages (DOC-423)
- Document GitHub app permissions (DOC-187)
- Add screenshots to cache miss troubleshooting docs (DOC-387)
- Document `checkAllBranchesWhen` type and behavior (DOC-414)
- Condense and remove redirects (DOC-403)
- Better handling of preview deployments from community (DOC-384)
- Investigate and resolve nx.dev outage (DOC-415)
- Fix blog redirect loop (DOC-425)
- Add redirect from /pricing to Nx Cloud plans section (DOC-426)
- Fix prod OG images linking to localhost:3000 (DOC-399)
- Fix Netlify build failing on server-handler upload (DOC-398)
- Fix incorrect usage for `nx show projects` docs (DOC-417)
- Command examples missing on Nx commands reference page (DOC-402)
- Use DEPLOY_URL for PR preview Netlify builds (DOC-413)
- Search overlay layout changes unexpectedly with browser zoom (DOC-410)
- Make "plugin registry" search show the plugin registry page (DOC-409)
- Refresh GITHUB_TOKEN for docs (DOC-396)
- Server-side page view tracking (DOC-395)

---

## Ecosystem & Framework Support

### CLI
- Support ESLint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3
- Allow wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- Support Angular v21.2 (NXC-3972) — 22.5.3
- NX_PREFER_NODE_STRIP_TYPES to use Node's strip types instead of transpilation ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0
- Bump swc to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215), [#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0
- Use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2
- Handle sophisticated vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0
- Preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0
- Use SASS indented syntax in nx-welcome component when style is sass ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- Exclude .json files from JS/TS regex patterns in angular-rspack ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.5.3
- Skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3
- Fix regression on process.env usage for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- Ensure safe process.env fallback replacement ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3
- Reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- Use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0
- Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- Remove file-loader dependency and update svgr migration ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- Remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- Guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3
- Use per-invocation cache in TS plugin to fix NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- Use surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1

### Nx Release
- Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2
- Allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3
- Add null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3

---

## Miscellaneous

### CLI
- Fall back to node_modules when tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0
- Hide already-installed nx packages from suggestion list during nx import ([#34227](https://github.com/nrwl/nx/pull/34227)) — 22.5.0
- Improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- Cloud commands are noop when not connected rather than errors ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- Add command to download cloud client ([#34333](https://github.com/nrwl/nx/pull/34333)) — 22.5.0
- Use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2
- Make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- Handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- Only detect flaky tasks for cacheable tasks ([#33994](https://github.com/nrwl/nx/pull/33994)) — 22.5.0
- Consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- Add missing FileType import for Windows watcher build ([#34369](https://github.com/nrwl/nx/pull/34369)) — 22.5.0
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- Make watch command work with --all and --initialRun ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3
- Allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- Use a consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1
- Avoid dropping unrelated continuous deps in makeAcyclic ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1
- Disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0
- Track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 21.3.12/22.5.0
- Use workspace root for path resolution when baseUrl is not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- Do not start the TUI logger unconditionally (NXC-3893)
- Clean up daemon workspace data directory on nx reset ([#34174](https://github.com/nrwl/nx/pull/34174)) — 22.5.0

### Cloud
- Enterprise contributor data rendered regardless of license duration (2602.09.5)
- Fix search parameters persisting between task/flaky analytics (2602.09.7)
- Compare Tasks page shows "Originated from" link for remote cache hits immediately (2602.11.3)
- Nx Cloud runner properly constructs URLs with trailing slash (2602.13.2)
- Error retrieving task details shows inline error instead of 404 (2602.18.13)
- Display null-name contributors as "No attribution" (2602.20.1)
- Copyright year dynamic (CLOUD-4230)
- Talk to Sales form stuck loading with ad blockers (CLOUD-4273)
- BitBucket PR comments malformatted (NXA-931)
- MCP work if users just paste links to runs/cipes (NXA-328)
- Sorting by duration resets when changing period (NXA-990)
- Add sorting to Agent Resource Usage list (NXA-998)

### Infrastructure
- New tenant provisioning: Wix (674137ce+), Legora (96f4801e+)
- Lighthouse auth rework: Google Auth login, audit logging, secure password handling, auto-update mechanism (multiple commits)
- Grafana billing alerts in Terraform (970f0df9)
- Update Terraform provider versions across all environments (multiple commits by Szymon)
- Spacelift admin stack setup and provider upgrades (multiple commits)
- Enable SAML for Wix (b1c1c43c)
- Add Bitbucket Cloud app secrets (5f9d1f59)
- New GitHub app setup for multiple tenants (d0e0114b, cf627422)
- Create GCP create_tenant.sh script (33220be4)
- Add synthetic checks for tenants (0858195b)
- PostHog reverse proxies (4f8fe0cb)
- OpenTelemetry Java agent tuning for production (415b75b2, 1f15fbbb)
- Disable otel coroutine instrumentation on dev (multiple commits)

### Cloud — Misc
- Account deletion request (CLOUD-4062)
- Data modification requests (CLOUD-4167, CLOUD-4282)
- Clean up current changelog site (CLOUD-3972)
- Storybook Calendar stories fix for visual diffs (CLOUD-4296)
- 7-Eleven admin cannot access organization settings (CLOUD-4173)
- Investigate frequent frontend container restarts (CLOUD-4222)
- Restore logs stream migration to workers (CLOUD-4217)
- Investigate view-logs requests causing frontend pod restarts (CLOUD-4210)
- Agent utilization view wrong/missing hung tasks (CLOUD-4259)
- Resource usage page shows inconsistent peak memory usage (CLOUD-4257)
- Custom encryption key not working with Azure (Q-221)
- All platforms report author from git executable (Q-226)
- 2026.01 on-prem release changelog (Q-178)
- Update MongoDB and Buf-Connect deps (Q-199)
- Update opentelemetry-javaagent to latest (Q-200)
- Redisson + Netty upgrade memory investigation (Q-212)
- Audit log functionality for RBC (Q-131)
- Itemize transactional emails for enterprise trial expiry (Q-132)
- Nx-api iterative improvements: longer timeouts for runs/end, executions, status, start, create-run-group (Q-166 through Q-181)

---

## Linear Project Status

### Completed in February 2026

| Project | Team | Lead |
|---------|------|------|
| Review Nx Resource Usage | NXC | Jonathan Cammisuli |
| Bucket access binding -> memberships | INF | Phil Mariglia |
| Lighthouse: Wire up Google Auth & Remove IaP | INF | Steve Pentland |
| Update and unify terraform provider versions | INF | Szymon Wojciechowski |
| WF Controller Multi-Replica Support | INF | Phil Mariglia |
| Wire up FE banners to Grafana | INF | Szymon Wojciechowski |
| Nx-api Iterative Improvements | Q | Altan Stalker |

### Active

| Project | Team | Key Focus |
|---------|------|-----------|
| Task Sandboxing (Input/Output Tracing) | NXC + Q | Dogfooding, GA preparation |
| CLI Agentic Experience (AX) | NXC + NXA | Configure-ai-agents, MCP, skills |
| Self-Healing CI | NXA | Auto-apply, multi-VCS, adoption |
| 600 workspaces connected every week | NXC + CLOUD | CNW optimization, onboarding |
| Continuous assignment of tasks | Q | Valkey-backed scheduling rewrite |
| Gradle Plugin for Nx | NXC + Q | Batch mode, atomized tasks |
| Polygraph AI | NXA | Multi-repo PR coordination |
| Framer Migration | CLOUD | Marketing site pages |
| Content and Structure Improvements | DOC | Sidebar, Getting Started, Tech pages |
| Workspace Visibility | NXA | Public/private sync with VCS |

### Issues Completed: 457 across 6 teams

NXC 85 · CLOUD 87 · INF 60 · NXA 111 · Q 89 · DOC 25

---

_Generated on 2026-03-02._
