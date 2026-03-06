# February 2026 Monthly Digest - Linear Data

## Summary Counts

| Team | Completed Issues |
|------|-----------------|
| NXC (Nx CLI / Dolphin) | 84 |
| CLOUD (Nx Cloud / Orca) | 85 |
| INF (Infrastructure / Kraken) | 60 |
| NXA (Red Panda) | 111 |
| Q (Quokka) | 89 |
| DOC (Docs) | 25 |
| **TOTAL** | **454** |

---

## NXC TEAM (Nx CLI / Dolphin) - 84 issues completed

### Project: Task Sandboxing (Input/Output Tracing) - 21 issues
Major initiative for eBPF-based IO tracing. Key deliverables:
- NXC-3728: NX CLI PID Listeners - Expose listeners from core that cloud client can subscribe to for IO tracing
- NXC-3761: Expand hash inputs in TaskIOService for cloud consumption
- NXC-3762, NXC-3763, NXC-3764: Enhanced `nx show target` with --inputs, --outputs, --check-input, --check-output flags
- NXC-3740: CLI command to report inputs/outputs for user verification
- NXC-3658, NXC-3659: Dogfood in Nx and Ocean repos
- NXC-3951: Filter non-cacheable and continuous tasks from sandbox violations
- NXC-3897: Cloud runner missing outputs from second+ command in multi run-commands
- NXC-3826, NXC-3837, NXC-3844, NXC-3834, NXC-3835, NXC-3841, NXC-3839, NXC-3845, NXC-3863, NXC-3907, NXC-3827: Various stability fixes (file filtering, output paths, race conditions, multi-PID handling)

### Project: Miscellaneous - 16 issues
- NXC-3972: Support Angular v21.2
- NXC-3918: Fix --help on yargs-based commands
- NXC-3816: Fix command injection vulnerability in get-npm-package-version (security)
- NXC-3553: Add proper Stopped status when continuous sibling task fails or on SIGINT
- NXC-3550: Nx TUI not used for some run-many build commands (bug fix)
- NXC-3759, NXC-3760: TUI scrollback and inline TUI hang fixes
- NXC-3249: Handle ^{projectRoot} inputs
- NXC-3892: Change sandbox setup to use DaemonClient.enabled isIsolatedPlugin
- NXC-3880: Update templates to 22.5
- NXC-3741: nx test-kt nx-api --help throws targets error
- NXC-3813: PRESET_FAILED: Failed to apply preset: empty
- NXC-3811: Address common CNW errors (top 5 error groups)
- NXC-3768: CI Monitoring: Chokidar Peer Dep Conflict
- NXC-3842: Stop warning on non-cacheable flaky tasks
- NXC-3812: Fix CNW amend errors

### Project: Review Nx Resource Usage - 14 issues
Major performance initiative:
- NXC-3877: Use jemalloc as allocator (-81% fragmentation, -26% RSS)
- NXC-3960: Cache compiled glob patterns (95.6% cache hit rate)
- NXC-3904: Reduce/avoid graph recomputations (Cypress port lock, native temp DB, Astro config)
- NXC-3908: Daemon serves stale project graph on rapid file changes
- NXC-3903: Fix ignore-files crate bug with prefix matching
- NXC-3893: Do not start TUI logger unconditionally
- NXC-3846: Deduplicate Output Strings
- NXC-3708, NXC-3717: Investigate high Memory and CPU usage
- NXC-3832: Watcher consumes a ton of CPU and memory on Linux (bump watchexec)
- NXC-3730: Implement shutting down plugin workers after graph created
- NXC-3685, NXC-3686: Dogfood in ocean and nx
- NXC-3959: Check if batch process terminal output accumulation is needed

### Project: Gradle Plugin for Nx - 12 issues
- NXC-3793: Add opt-in for executors to declare batch mode
- NXC-3957: Enable batch mode for Gradle in ocean
- NXC-3958: Ocean UI graph generation slow then crashes with Java OOM
- NXC-3988: Gradle task running pnpm exec in project root (regression from plugin v1)
- NXC-3779: CLIENT ADP: CI blocking when multiple gradle tasks run on same agent
- NXC-3797: Allow running batch executor in debug mode
- NXC-3798: Batch mode logs truncate with atomized tasks
- NXC-3804: ADP task getting interpreted by batch runner as a project
- NXC-3780: Update Gradle docs with batch mode
- NXC-3781: Ensure NX BATCH mode works on Ocean and Nx
- NXC-3777: Investigate flakes on Nx Console intellij tasks
- NXC-3858: Swap gradle icon for duke icon

### Project: CLI Agentic Experience (AX) - 7 issues
- NXC-3809: Enhance `nx list <plugin>` with paths and JSON output
- NXC-3774: Handle `--no-interactive` flag better in Nx CLI
- NXC-3791: Improve CLI output for configure-ai-agents skills setup
- NXC-3792: Collect benchmark data for MCP blog post
- NXC-3830: Set up CNW benchmarks for CLI agentic experience
- NXC-3843: Update PLUGIN.md for Gradle for Test Verification
- NXC-3971: Project graph fails when plugin isolation is turned off

### Project: (No Project) - 6 issues
- NXC-3505: Next.js Jest tests do not exit properly
- NXC-2102: Clarify trailing slash requirement for inputs in directory paths
- NXC-3920: Fix CNW template leftover AI agent files/install flow
- NXC-3898: Clarity security email should not be used to report outdated/vulnerable packages
- NXC-3786: Investigate Anaplan plugin worker timeout regression (Support, label: Support)
- NXC-3815: Investigate CNW gaps when doing agentic onboarding

### Project: Maven Support - 4 issues
- NXC-3366: Maven icon appears missing in UI
- NXC-3378: Reach out to DPEs for another Maven tester
- NXC-3850: Correctly map between maven locators and nx project names
- NXC-3810: Add pom.xml files to inputs

### Project: Run Terminal UI (TUI) - 2 issues
- NXC-3899: Unpinning a task by number key doesn't close pane
- NXC-3207: Scrollbar area (bug fix)

### Project: Surface Level Telemetry - 1 issue
- NXC-3736: Update Privacy Policy and Prompt (waiting on lawyers)

### Project: 600 workspaces connected every week - 1 issue
- NXC-3879: Add Nx version to short link metadata

---

## CLOUD TEAM (Nx Cloud / Orca) - 85 issues completed

### Project: Framer Migration - 44 issues
Massive website migration to Framer. All marketing pages migrated:
- CLOUD-4089: Homepage
- CLOUD-4075, CLOUD-4287, CLOUD-4286, CLOUD-4285: Pricing page + cards + comparison table
- CLOUD-4086: Enterprise page
- CLOUD-4087: Nx Cloud page
- CLOUD-4098: Security page
- CLOUD-4082: Customers page
- CLOUD-4085: Community page
- CLOUD-4084: Company page
- CLOUD-4083: Resources page
- CLOUD-4078: Partners page
- CLOUD-4079: Webinar page
- CLOUD-4081: Brands page
- CLOUD-4103, CLOUD-4102, CLOUD-4101, CLOUD-4100, CLOUD-4099: Contact pages (main, engineering, labs, sales, enterprise trial)
- CLOUD-4076: Enterprise > Trial page
- CLOUD-4077: Enterprise > Security page
- CLOUD-4124, CLOUD-4122, CLOUD-4121, CLOUD-4123: Solutions pages (leadership, management, engineering, platform)
- CLOUD-4236, CLOUD-4237: Java and React pages
- CLOUD-4238: 404 page
- CLOUD-4239: Careers page
- CLOUD-4092: Blog index + one blog post
- CLOUD-4097: Remote cache page
- CLOUD-4263: Migrate new header to Framer (mega menu)
- CLOUD-4269: Enable rewrites for all Framer pages on canary
- CLOUD-4148: Set canonical URL in Framer to point to nx.dev
- CLOUD-4252: Consolidate marketing scripts into GTM
- CLOUD-4202: Add Framer event tracking bridge to GTM
- CLOUD-4256: Add custom tracking events
- CLOUD-4284: Update copy/assets for new brand messaging
- CLOUD-4293: Address Victor & Heidi Framer site feedback
- CLOUD-4283: Review SEO titles and descriptions
- CLOUD-4292: Review homepage
- CLOUD-4291: Review pricing page
- CLOUD-4272: Address Juri's feedbacks

### Project: (No Project) - 21 issues
- CLOUD-2614: Investigate discrepancy in contributor count (Labels: Billing & usage, Support, Bug)
- CLOUD-4043: Unable to remove duplicate members when VCS connected (Labels: Support, Bug)
- CLOUD-4173: 7-Eleven admin cannot access organization settings (Label: Support)
- CLOUD-4031: Nx Cloud onboarding fails with pnpm catalogs (Label: Support)
- CLOUD-3924: Compare Tasks doesn't show cache origin unless you click compare (Labels: DPE, SaaS Customers, Support)
- CLOUD-4246: Require confirmation / prevent auto-save for sensitive settings
- CLOUD-4025: No results when using task analytics filters
- CLOUD-4296: Storybook Calendar stories change daily and break visual diffs
- CLOUD-4210: Investigate view-logs requests causing frontend pod restarts
- CLOUD-4275: Nx login doesn't handle trailing slash gracefully (Bug)
- CLOUD-4217: Restore logs stream migration to workers
- CLOUD-4276: Theme switch to System crashes nx.dev contact/sales page (Bug)
- CLOUD-4273: Talk to Sales form stuck loading with ad blockers
- CLOUD-4259: Agent utilization view shows wrong/missing hung tasks
- CLOUD-4257: Resource usage page shows inconsistent peak memory usage
- CLOUD-4222: Investigate frequent Nx Cloud frontend container restarts
- CLOUD-4200: Contributors over period empty on enterprise usage screen
- CLOUD-4232: "Connect your VCS provider" CTA should go away after connecting one
- CLOUD-4230: Update Nx Cloud footer copyright year dynamically
- CLOUD-4162: Show distributed agent visualization on CIPE critical error
- CLOUD-4216: Flaky tasks links for colon-named tasks return 404

### Project: 600 workspaces connected every week - 11 issues
- CLOUD-4305: Update /guide route for users from CNW (add tracking marker)
- CLOUD-4304: Feb 23 experiment: welcome view
- CLOUD-4289: Fix installing GH app in onboarding flow for non-cloud.nx.app envs
- CLOUD-4221: Replace browser-based CNW bottom sheet
- CLOUD-4242: Update CNW cloud prompt with explicit opt-out option
- CLOUD-4288: /welcome experiment Feb 16th
- CLOUD-4255: Experiment Feb 13: revert to previous prompts (Label: Experiment)
- CLOUD-4225: Remove extraneous title and button from orgs list empty state
- CLOUD-4235: Feb 6 experiment: refine cloud prompt from CNW (Label: Experiment)
- CLOUD-4194: Investigate missing README short links for template workspaces
- CLOUD-4224: Browser-based onboarding has an "Install GH app" button

### Project: Nx Cloud misc (Jan - Feb) - 3 issues
- CLOUD-4282: Data modification request (Production NA)
- CLOUD-4167: Change admin user org association for Hilton ST instance
- CLOUD-4062: Account deletion request

### Project: Nx Cloud pricing page refresh (2025 Q4) - 2 issues
- CLOUD-4185: Finalize highlight descriptions for each plan tier
- CLOUD-4184: Update prototype from sync feedback

### Project: One-page "connect workspace" flow - 2 issues
- CLOUD-4279: Simplify VCS integration forms
- CLOUD-4195: Test Gitlab one-page onboarding flow on staging

### Project: Nx Cloud changelog - 1 issue
- CLOUD-3972: Clean up the current changelog site

### Project: Workspace analytics: task stats - 1 issue
- CLOUD-4249: Ocean Tasks analytics page shows no data with sortBy

---

## INF TEAM (Infrastructure / Kraken) - 60 issues completed

### Project: (No Project) - 19 issues
Infrastructure requests and operational work:
- INF-1217: New Single Tenant Instance - Legora (PoV)
- INF-1200: New Single Tenant Instance - Wix (PoV)
- INF-1221: RunWorkflow shouldn't use request context when trying to unravel job (Bug)
- INF-1216: Add env vars for nx-cloud-frontend in snapshot (Cloudinary)
- INF-1214: Use other GitHub app for Wix and Cloudinary (callback URL limit)
- INF-1213: Request for Change - Cloudinary (GitHub redirect_uri for VCS)
- INF-1194: Support Celonis S3 VPC endpoint setup for ST artifacts (Enterprise, customer request)
- INF-1193: Cloudinary SAML setup
- INF-1190, INF-1189, INF-1192: Vanta IAM key rotation remediation (Security)
- INF-1188: Create io-tracing-writer SA for workflows bucket
- INF-1187: DB access for CIBC's Azure project
- INF-1186: Make C3D nodes generally available for ClickUp (Enterprise)
- INF-1185: PostHog reverse proxies
- INF-1184, INF-1138, INF-1136, INF-1132: Various env/config changes

### Project: Lighthouse: Wire up Google Auth & Remove IaP - 6 issues
- INF-1203: Login with Google and fetch groups
- INF-1204: Login audit log, view page, and future extension framework
- INF-1210: Begin basic page/action auditing
- INF-1211: Move password copy to backend (security improvement)
- INF-1212: Force all logout (invalidate sessions)
- INF-1222: User filter on audit page

### Project: Lighthouse - Azure & ServiceAccounts & Perf - 6 issues
- INF-1119: Service Account/Role Rework (proper permissions for all 3 clouds)
- INF-1120, INF-1121, INF-1122: GCP, AWS, Azure implementations
- INF-1123: Look at mechanisms to reuse base-level auth (role chaining)
- INF-1135: Performance improvement, cache deployed tenant version

### Project: Bucket access binding -> memberships - 6 issues
- INF-1202: Investigate Tofu IAM Migration Without Downtime
- INF-1205, INF-1206, INF-1207, INF-1208, INF-1209: IAM Binding -> Member migration across all environments

### Project: Update and unify terraform provider versions - 6 issues
- INF-1195, INF-1196, INF-1197: Update AWS, GCP, Azure providers & modules
- INF-1198: Update tofu version
- INF-1199: Update Grafana & Atlas providers
- INF-1201: Update dev/staging/prod/ops provider versions

### Project: Workflow Controller Multi-Replica Support - 4 issues
- INF-1124, INF-1125, INF-1126: Enable Async Processing in Prod, STs, remove feature flag
- INF-1133: Handle Signals (SIGTERM/SIGINT for queue processor)

### Project: WF Controller Support Nodes and Disk Changes - 3 issues
- INF-1129: Workflow Controller Resourceclasses support DiskSize
- INF-1130: use-single-subpath-volume is the default
- INF-1131: Enable SubPath Volumes on all Envs

### Project: Wire up FE banners to Grafana - 2 issues
- INF-1127: Test and adjust alert rules for webhooks
- INF-1128: Add grafana alerting tokens to ST envs

### Other Projects (1 issue each)
- INF-1137: (Fix the non-nx agent image story) WF Controller explicitly sets Command on agents main container
- INF-1220: (Grafana Billing Alerts) Add grafana billing alerts to terraform
- INF-1215: (IO Trace Internal Helm Chart) Enable io-trace-daemon on staging
- INF-1139: (In-depth Podman/Buildah validation) Investigation
- INF-1140: (Remove ability to use non-signed storage) Remove direct upload from executor/log uploader
- INF-752: (Make WF Controller more resilient) Workflow Controller does not Gracefully Roll
- INF-969: (Migrate AL2 -> AL2023) Converted to project
- INF-1134: (Valkey alternatives) Explore alternatives to bitnami Valkey chart

---

## NXA TEAM (Red Panda) - 111 issues completed

### Project: Self-Healing CI - 34 issues
- NXA-791: Ralph Mode - Automated CIPE Monitoring & Self-Healing Fix Application
- NXA-946: Add a way to retry self-healing on latest commit
- NXA-892: Surface self-healing logs in CIPE self-healing UI
- NXA-889: Expose auto-apply recommendations UI to everyone
- NXA-870: Add self-healing indicators to workspace and org dashboards
- NXA-776: Add Bitbucket and Azure support to self-healing CI setup dialog
- NXA-854: Ensure Gitlab experience is good
- NXA-855: Add audit logging for self-healing config changes
- NXA-884: Increase fix timeout from 30 mins to 90
- NXA-883: Make custom hook logger available on all fixes
- NXA-868: Internal AI credits reporting
- NXA-872: Track when custom ANTHROPIC_API_KEY is in use
- NXA-873: Ensure obfuscated client bundle contents do not get written to agent logs
- NXA-941: Self-serve adoption data
- NXA-856: Use different models with evals (OpenRouter, Ollama)
- NXA-822: Spike ollama/openrouter with claude code
- NXA-718: Refactor self-healing flow to handle code changes separately
- NXA-821: Associate launch template with remote task for agent fixes
- NXA-819: Emeria apply issues (customer)
- NXA-837: Adjust bitbucket self-healing comment
- NXA-866: Combine warnings into single block on GH comment
- NXA-867: Verification tasks briefly show as failing
- NXA-928: Self-healing fix apply fails due to serialization error
- NXA-728: Self-healing comment state incorrect after applying fix
- NXA-877: Applied automatically comment not posted on auto-applied PR review
- NXA-933: Enhance git command failure messages (likely git credentials issue in manual DTE)
- NXA-882: MailChimp: Improve error logging and fix execution failures on git diff
- NXA-945: Self-healing "too many unapplied fixes" link loops
- NXA-1002: Adjust "too many unapplied fixes" logic
- NXA-1001: Add passthrough for `nx-cloud apply-locally` to `nx`
- NXA-321: Use system OS level notification for CIPE fixes
- NXA-518: Add previously accepted or rejected fixes as additional context for Claude
- NXA-702: Provide a way to apply non-code-change context locally
- NXA-754: Create distribution of inspirationMetadata for self-healing dashboard

### Project: CLI Agentic Experience (AX) - 28 issues
- NXA-983: Agent tries to commit/push after applying self-healing fix
- NXA-1035: Create doc showing what Claude does better and worse
- NXA-943: Build mechanism to show people configure-ai-agents is outdated
- NXA-1005: Automatically create agent config for executing agent (nx init, cnw)
- NXA-972: Write blog post for skills launch
- NXA-1017: Fix nx console for cursor MCP tool handling
- NXA-981: Add gifs to nx-ai-agents-config to showcase value
- NXA-982: Migrate claude plugin to repo root instead of /generated
- NXA-826: Create launch content for new agent configs / claude plugin
- NXA-957: Add hints to MCP tool structuredContent
- NXA-841: Set up release flow (prerelease workflow for MCP server)
- NXA-828: Investigate Claude /sandbox mode hanging on Nx commands
- NXA-886: Adjust ci-watcher subagent to report intermediate CI states
- NXA-932: Add clearer agent instructions for failed CIPE status
- NXA-906: Make sure initial timeout is reasonable
- NXA-891: Agentic CLI misclassifies Nx Cloud CI failure cause
- NXA-926: Agent misuses gh CLI instead of CI monitor skill
- NXA-890: Improve agent-controlled create-nx-workspace
- NXA-960: Find good way to configure nx mcp flags when run through claude plugin
- NXA-967: Make sure flag overrides in mcp config aren't reverted on changes
- NXA-920: Implement agentic CNW that sets up the platform
- NXA-958: Re-check configure-ai-agents updating cursor/opencode configs
- NXA-942: Make sure `nx mcp` uses latest version of nx-mcp
- NXA-907: Write up overview of current onboarding gaps for agents
- NXA-857: Write a post covering outer CI loop
- NXA-887: Ensure new setup w/ minimal is respected in vscode & cursor
- NXA-825: Document Claude plugin / other agent configs
- NXA-858: Post on slack to get ppl to try out new plugin / config

### Project: Polygraph AI - 27 issues
New multi-repo AI orchestration product:
- NXA-850: Create Nx Cloud Polygraph session UI
- NXA-851: Implement PR creation and coordination
- NXA-843: Create repository discovery API endpoint
- NXA-876: Create polygraph skills (checked in ocean)
- NXA-1014: Implement GitHub Actions integrations
- NXA-976: Add support for polygraph session description
- NXA-977: Track author who creates session
- NXA-985: Support for closing/completing sessions
- NXA-988: Design doc for Github Status updates (polling vs webhooks)
- NXA-1010: Support repo selection
- NXA-956: Replace token handling when cloning repos
- NXA-963: MCP polygraph tools should auto install client bundle
- NXA-987: Update github PR comment
- NXA-970: Draw relevant part of graph updated in UI
- NXA-916: Handle breaking changes in PR graphs that require releases
- NXA-950: Mark ready for review does not update descriptions in open prs
- NXA-937: Implementation to download client bundle when it doesn't exist
- NXA-955: Associate already opened PR to polygraph session
- NXA-966: Move polywhal repos into nrwl org to connect to ocean
- NXA-939: Implement multi repo giga ralph
- NXA-914: Set up proper dogfooding env for Ocean
- NXA-912: Provide a way to interact with polygraph session locally
- NXA-915: Create a graph of PRs and display it in UI and github comment
- NXA-913: Figure out how to incorporate giga ralph into polygraph
- NXA-910: Handle required user input (e.g., password to sign commit)
- NXA-947: init does not get repos that are dependencies of dependencies
- NXA-948: Delegate tool times out

### Project: Workspace visibility - 8 issues
- NXA-898: Add OAuth integration for Bitbucket
- NXA-1019: Updated design doc for repository access sync for workspaces
- NXA-861: Redesign public/private repository sync
- NXA-893: Add new isPublic field to workspace data model
- NXA-902: Handle public/private migration for workspaces
- NXA-904: Add feature flag for workspace visibility
- NXA-901: Add visibility toggle to workspace settings
- NXA-900: Remove visibility toggle from organization settings

### Project: Red Panda Misc - 7 issues
- NXA-964: Fix occasional git merge-base failures for bitbucket self-healing
- NXA-1007: Add env-var for snapshot github app slug
- NXA-989: Icon click redirects to create-nx-workspace for empty workspace
- NXA-998: Add sorting to Agent Resource Usage list
- NXA-990: Sorting by duration resets when changing period (Bug)
- NXA-328: Make MCP work if users just paste links to runs/cipes
- NXA-931: BitBucket PR comments are malformatted (Bug)

### Project: (No Project) - 7 issues
- NXA-1041: 403 when upgrading org to Team plan (Label: Support)
- NXA-951: CI monitor commits unrelated local changes (git add -A)
- NXA-971: Warning link is self-referential in self-healing CI
- NXA-965: Remove env var for partitioning by launch template
- NXA-938: Hide "learn nx cloud" section for users not explicitly part of orgs (Bug)
- NXA-881: Add NX_DISABLED_POWERPACK env var to disable plugins
- NXA-765: Fix filter shows not verified fixes when filtering by fixable

---

## Q TEAM (Quokka) - 89 issues completed

### Project: Task Sandboxing (Input/Output Tracing) - 32 issues
Backend/daemon side of the sandboxing initiative:
- Q-80, Q-81, Q-82, Q-84: Core eBPF daemon: Signal file detection, PID mapping, task tracker, task completion + dedup
- Q-114: Deploy IO Trace Daemon to Snapshot via Kustomize
- Q-126: nx-api Anomaly Endpoint
- Q-127: UI Anomaly Display
- Q-151: Update Nx client to use nx-io-trace- filename prefix
- Q-186: nx-cloud runner should create unique id in marker file
- Q-187: Strict mode toggle UI
- Q-188: Strict mode violations should fail DTE
- Q-193: Anomaly report log API endpoint for frontend
- Q-195: Investigate oomKills on the daemon pod
- Q-196: Activate tracing in Ocean
- Q-204: Ensure sandbox reports get evicted at same lifetime as runs
- Q-207: Show sandbox violation banner for WARNING mode
- Q-208, Q-209: Task list view warning indicator + IO trace analysis section
- Q-215: Download raw report button
- Q-228, Q-229, Q-232, Q-233, Q-235: Stats, UI guards, over-reporting, missing files, 500 errors
- Q-241: Skip generating signal file for cache hits / non-cacheable / continuous tasks
- Q-244, Q-245: Enable sandboxing env vars on staging + activate signal files on nx repo
- Q-246: Expose PID and command for file read/write
- Q-248: Use virtualized views for file tree
- Q-256, Q-257: Filter reads outside workspace root + display process command
- Q-261: Update download to belong in sandbox analysis screen

### Project: Continuous assignment of tasks - 24 issues
Major DTE scheduler rework:
- Q-139, Q-140, Q-144: Create Nx plugin from export, configurable sleep executor, combined fixture script
- Q-153, Q-154: Fix task metadata timings and output path issues
- Q-182, Q-189, Q-190, Q-191: Benchmark package improvements, branched scheduler, DTE exporter support
- Q-197: Continuous assignment implementation
- Q-202: Nx repo throws daemon error fix
- Q-203: Analysis screen utilization at 0% fix
- Q-205: Non-cacheable tasks not guaranteed to run on correct agent
- Q-206: Metrics collection fixes
- Q-210: Long polling is not long with valkey assignment
- Q-213: Main job fails downloading artifacts
- Q-214: Workers that stall during shutdown cause loop
- Q-216: Valkey writes non-cacheable completion on assignment
- Q-220: Shrinking worker pool may kill executing worker
- Q-222: Flaky retry candidates should not update execution status
- Q-223: complete-tasks and assign-tasks don't populate agent metadata
- Q-224: WaitingAgents not invalidated often enough
- Q-225: Worker orchestrator should remember ignored hashes
- Q-227: Agent exits after all workers spun down

### Project: Jan-Feb 2026 Misc - 13 issues
- Q-221: [CIBC] Custom Encryption Key Not Working with Azure (DPE, Support - blocking PoV)
- Q-212: Redisson + Netty Upgrade increased direct memory use
- Q-200: Update opentelemetry-javaagent
- Q-199: Update MongoDB and Buf-Connect deps
- Q-177: `nx-cloud decrypt` CLI command (Feature, DPE)
- Q-185: Handle JSON.stringify limit for processInBackground daemon calls (Support)
- Q-178: 2026.01 on prem release changelog
- Q-176: Snapshot aggregator restarting
- Q-171: nx-api memory leak investigation
- Q-161: Investigate Stripe error for Betterleap failed payment (Support)
- Q-160: atomicfu update classloader issue
- Q-159: Investigate failing tests and CI anomalies on main
- Q-158: Inconsistent affectedProjectRatio values

### Project: Nx-api Iterative Improvements - 6 issues
- Q-165: Long-polling rework (prevent agent forgetfulness)
- Q-166, Q-167, Q-168, Q-180, Q-181: Timeout improvements for /runs/end, /v2/tasks, /v2/status, /v2/start, /create-run-group

### Project: Gradle Plugin for Nx - 6 issues
- Q-170: Dependent tasks generated with incorrect project names
- Q-173: Set prefix for Gradle tasks
- Q-174: Atomized test targets missing dependsOn
- Q-175: Disable gradle e2e until foojay back online
- Q-218: Change in nx repo
- Q-247: Ensure dependent task output files use correct path

### Project: LLM-enhanced flakiness detection - 2 issues
- Q-106: Create simulation with LLM-based evaluation
- Q-107: Obtain LLM simulation results for all benchmarked workspaces

### Other Projects (1 issue each)
- Q-131: (Enterprise Audit Log API) RBC accepts audit log functionality
- Q-132: (Reverse Trial Billing) Itemize and audit transactional emails
- Q-226: All platforms report author from git executable
- Q-230: Do not error log on failure to refresh VCS credentials
- Q-104: Investigate large agent idleness gaps for Essent runs (Support)
- Q-169: .complete metrics marker file not cleaned up

---

## DOC TEAM (Docs) - 25 issues completed

### Project: (No Project) - 18 issues
- DOC-426: Add redirect from /pricing to Nx Cloud plans section
- DOC-425: Blog not resolving due to too many redirects
- DOC-423: Add Requirements section to relevant tech docs pages
- DOC-415: Investigate nx.dev outage (~10 minutes)
- DOC-417: Fix incorrect usage for `nx show projects` docs
- DOC-414: Document `checkAllBranchesWhen` type and behavior
- DOC-413: Use DEPLOY_URL for PR preview Netlify builds
- DOC-410: Search overlay layout changes with browser zoom
- DOC-409: Make "plugin registry" search show the plugin registry page
- DOC-401: Investigate boosting CLI command reference pages in search
- DOC-402: Command examples missing on Nx commands reference page
- DOC-399: Fix prod OG images linking to localhost:3000
- DOC-398: Netlify build fails uploading ___netlify-server-handler
- DOC-397: Switch DNS to Netlify for nx.dev
- DOC-396: Refresh GITHUB_TOKEN for docs
- DOC-387: Add screenshots to cache miss troubleshooting docs
- DOC-384: Better handling of preview deployments from community
- DOC-187: Document GitHub app permissions

### Project: Content and Structure Improvements - 6 issues
- DOC-406: Dedupe Content Across All Getting Started Pages
- DOC-407: Propose structure and content for Technology pages
- DOC-400: Update docs breadcrumbs to match new sidebar hierarchy
- DOC-403: Let's condense and remove redirects
- DOC-405: Improve AX for Getting Started / Intro Pages
- DOC-365: PoC for new sidebar structure

### Project: Nx Knowledge Base docs project - 1 issue
- DOC-395: Track page views on server-side as well

---

## PROJECT UPDATES (Posted in February 2026)

### Task Sandboxing (Input/Output Tracing) - Teams: Q, NXC
- **Feb 27** (On Track): UI mostly complete. Added PID tracking with full command and parent PID visibility. Louie adding raw sandbox contents download (similar to agent logs).
- **Feb 16** (On Track): Progress on stability - figured out Java tasks all reuse same gradlew process; fixed run-commands multi-PID issue; stability on snapshot CI with production env vars.
- **Feb 10** (At Risk): Daemon running on Ocean generating files. Lots of process race conditions found and fixed. Goal: get daemon more stable, show raw version on the UI.
- **Feb 02** (At Risk): Runner changes merged for DTE signal files. Implemented forked process tracking in eBPF. Got example tracking all file reads/writes.

### CLI Agentic Experience (AX) - Teams: NXA, NXC, CLOUD
- **Feb 06** (On Track): Shipped CI monitor skill & agent with MCP tool. Shipped nx-generate, nx-workspace and more OSS skills. Testing & iterating internally.

### Enterprise Audit Log API - Teams: Q
- **Feb 06** (On Track): Completed. RBC accepted audit log functionality.

### Reverse Trial Billing - Teams: Q
- **Feb 02** (On Track): Marked as completed. Scoped billing changes and notifications done. Potential "Reverse Trial Fake Data" work for March.

### Migrate DPE-tools to Lighthouse - Teams: CS
- **Feb 16** (On Track): Migrating apps from React to Phoenix/Elixir after discussing with Steve. Lighthouse ready to accept static apps.

---

## COMPLETED PROJECTS (Status: Completed in Feb 2026)

1. **Bucket access binding -> memberships** (INF) - Completed Feb 23-27
2. **Lighthouse: Wire up Google Auth & Remove IaP** (INF) - Completed Feb 19-28
3. **Migrate AL2 agent nodegroups to AL2023 for tenants** (INF) - Completed Feb 6
4. **Enterprise Audit Log API** (Q) - Completed, target Feb 6
5. **Reverse Trial Billing** (Q) - Completed
6. **Enable first batch of prom metrics on snapshot** (Q) - Completed
7. **Pylon Rollout & Evaluation** (CS) - Completed Feb 23

---

## NOTABLE IN-PROGRESS / UPCOMING WORK

### Active Initiatives
- **Task Sandboxing (Input/Output Tracing)** (Q, NXC) - Target: Mar 13. UI nearly complete, stability improving.
- **CLI Agentic Experience (AX)** (NXA, NXC, CLOUD) - No target date. Multi-team effort, very active.
- **Polygraph AI** (NXA) - Planned. Multi-repo AI orchestration, 27 issues completed in Feb.
- **Workspace visibility** (NXA) - In Progress, started Feb 16. Public/private workspace controls.
- **Surface Level Telemetry** (NXC) - Target: Mar 6. Privacy policy updates.
- **Framer Migration** (CLOUD) - 44 pages migrated in Feb, massive effort.
- **Continuous assignment of tasks** (Q) - 24 issues completed, scheduler rework.
- **Agentic Nx Migrations** (NXA) - Started Feb 27, paused.

### Upcoming
- **Feature demos** (CLOUD) - Planned Mar 2 - Mar 31
- **Feature activation guides** (CLOUD) - Planned Mar 2 - Apr 24
- **GCP GKE Docker Image Pre-Loading** (INF) - Started Mar 2 - Mar 27
- **Extending Target Defaults functionality** (NXC) - Planned Mar 30 - Apr 10
- **K8S Gateway API + L7 Load Balancing** (INF) - Planned Apr 3 - Apr 18
- **Lighthouse - Enable Tenant MongoDB connections** (INF) - Planned Apr 13 - Apr 17

### Customer-Facing / Support Issues
- CLOUD-2614: Contributor count discrepancy (Billing & usage)
- CLOUD-4043: Duplicate members with VCS (Support)
- CLOUD-4173: 7-Eleven admin access (Support)
- CLOUD-4031: pnpm catalogs onboarding failure (Support)
- CLOUD-3924: Compare Tasks cache origin visibility (DPE, SaaS Customers)
- NXC-3786: Anaplan plugin worker timeout regression (Support)
- NXA-1041: 403 upgrading to Team plan (Support)
- Q-221: CIBC Custom Encryption Key blocking PoV (DPE, Support)
- Q-185: JSON.stringify limit for large repos (Support)
- Q-161: Betterleap failed payment (Support)
- Q-104: Essent agent idleness gaps (Support)
- INF-1194: Celonis S3 VPC endpoint (Enterprise, customer request)
- INF-1186: ClickUp C3D nodes (Enterprise)
- NXA-882: MailChimp execution failures (customer)
- NXA-819: Emeria apply issues (customer)
