# Linear March 2026 — Exhaustive Data Pull

**Date:** 2026-03-23
**Coverage:** All teams, completed issues (March 1-23), projects, status updates, initiatives

---

## 1. TEAMS

| Team | Key | ID |
|------|-----|----|
| Nx CLI | NXC | 2100b430-122d-4c3f-b3a0-ef1ac995951e |
| Nx Cloud | CLOUD | 35b6691d-7bd2-4838-8e63-dd08aedf1665 |
| Infrastructure | INF | b837fc89-fe9c-4918-9006-30dfabb3688c |
| RedPanda | NXA | b326be94-8f36-4798-ae2d-f77149ea7beb |
| Quokka | Q | af278ac5-1ec9-48c6-95f5-3111804472f4 |
| Docs | DOC | 6476c542-05d0-4c92-906e-a0333cc8fc2e |
| Customer Success | CS | c1b1078b-88c5-442d-b005-7a82d9e30f10 |
| Sales | SALES | fd7e0f5d-850f-4912-9aee-6d0f90d89a7a |

Other teams exist but are deprecated or inactive: Backend, Nx Dev Rel, OSS Outreach, Capybara, Axolotl, Nx Enterprise, Marketing, Nx Plugins, Operations.

---

## 2. COMPLETED ISSUES BY TEAM (March 2026)

### Nx CLI (NXC) — 50 issues completed in March (hasNextPage: true, likely more)

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| NXC-3570 | [M1] Migrate `nx` core package to local dist | Colum Ferry | Nx Local Dist Migration | 2026-03-20 |
| NXC-4089 | Fix `Database file exists but has no metadata table` | Leosvel Perez Espinosa | Miscellaneous | 2026-03-20 |
| NXC-4085 | Gradle plugin generates atomized targets for questionable tests | Louie Weng | Gradle Plugin for Nx | 2026-03-20 |
| NXC-4107 | Remove CRA migration logic from nx init | Jack Hsu | Miscellaneous | 2026-03-19 |
| NXC-4115 | Update webpack plugin versions to fix serialize-javascript CVE | Jack Hsu | — | 2026-03-19 |
| NXC-3985 | Fix `postTasksExecution` not called on SIGINT for continuous tasks | Leosvel Perez Espinosa | Miscellaneous | 2026-03-19 |
| NXC-4104 | Don't invoke `createProjectGraphAsync` in ng cli adapter | Leosvel Perez Espinosa | Miscellaneous | 2026-03-19 |
| NXC-3693 | Polish the telemetry feature | — | Surface Level Telemetry | 2026-03-18 |
| NXC-4106 | Fix tsconfig parsing cache invalidation issue | Leosvel Perez Espinosa | Miscellaneous | 2026-03-18 |
| NXC-4105 | Normalize `cwd` path in `nx show target` output | Leosvel Perez Espinosa | Miscellaneous | 2026-03-18 |
| NXC-4095 | Reduce common errors in CLI onboarding | Jack Hsu | — | 2026-03-18 |
| NXC-2944 | Automatically set cache:false for continuous tasks | Craigory Coppola | Miscellaneous | 2026-03-18 |
| NXC-4096 | Bring back cloud prompts and templates | Jack Hsu | — | 2026-03-17 |
| NXC-4049 | Fix plugin workers hanging due to graph recomputation | Craigory Coppola | Miscellaneous | 2026-03-17 |
| NXC-4093 | Investigate worker connection timeout | Craigory Coppola | Miscellaneous | 2026-03-17 |
| NXC-4087 | Investigate TypeScript setup nightly failures | Leosvel Perez Espinosa | Miscellaneous | 2026-03-17 |
| NXC-4082 | Evaluate skipping Rust-to-JS input transfer without subscribers | Craigory Coppola | Task Sandboxing | 2026-03-17 |
| NXC-3956 | Clear `TaskIOService` retained data after subscription | Craigory Coppola | Task Sandboxing | 2026-03-17 |
| NXC-3849 | Add external dependencies (Maven) | Jason Jean | Maven Support | 2026-03-17 |
| NXC-4088 | Mark PR #34877 nightly fix as done | Max Kless | Miscellaneous | 2026-03-17 |
| NXC-4084 | Show whether a target is continuous in `nx show target` | — | Task Sandboxing | 2026-03-17 |
| NXC-3970 | Extreme slowness running run-many lint (graph/daemon) | Craigory Coppola | Miscellaneous | 2026-03-16 |
| NXC-4066 | Fix process tree filtering with many subprocesses | Louie Weng | Task Sandboxing | 2026-03-16 |
| NXC-4081 | TS tasks should depend on all referenced tsconfig files from deps | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-16 |
| NXC-4005 | Nx repo test targets missing input for scripts/patched-jest-resolver.js | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-16 |
| NXC-4051 | E2E tests show unexpected reads on tsconfig.spec.json files | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-16 |
| NXC-4011 | IO tracing inputs list differs from expected nx outputs | Craigory Coppola | Task Sandboxing | 2026-03-16 |
| NXC-3974 | Use JSON by default for AI agent `show target` command | Craigory Coppola | Task Sandboxing | 2026-03-16 |
| NXC-3695 | Dogfood telemetry in ocean | Jason Jean | Surface Level Telemetry | 2026-03-16 |
| NXC-3696 | Dogfood telemetry in nx | Jason Jean | Surface Level Telemetry | 2026-03-16 |
| NXC-4064 | Exclude e2e.log | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-13 |
| NXC-4067 | Default to file tree with unexpected filter enabled | Louie Weng | Task Sandboxing | 2026-03-13 |
| NXC-4054 | Input violation check disagrees with `nx show target` | Rares Matei | Task Sandboxing | 2026-03-10 |
| NXC-4034 | Implicit dependencies using project.json name not detected | Craigory Coppola | Gradle Plugin for Nx | 2026-03-10 |
| NXC-4057 | Fix sandboxing inputs for `nx:build-base` | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-11 |
| NXC-4029 | Include Gradle files in Gradle task inputs | Louie Weng | Task Sandboxing | 2026-03-10 |
| NXC-4056 | Atomized depends-on targets ignore target name override | Louie Weng | Gradle Plugin for Nx | 2026-03-10 |
| NXC-4004 | graph-ui-code-block:typecheck reads undeclared build outputs | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-10 |
| NXC-3965 | Investigate d.ts outputs from dependency projects | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-10 |
| NXC-4041 | Add *.tsbuildinfo dependent outputs to tsc tasks | Leosvel Perez Espinosa | Task Sandboxing | 2026-03-06 |
| NXC-4040 | ESLint deps rule should add `catalog:` for missing deps | Leosvel Perez Espinosa | Miscellaneous | 2026-03-06 |
| NXC-3800 | Flush telemetry events on Process.exit / handleErrors | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3889 | Remove sensitive data from args before sending (telemetry) | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3734 | Capture Project Graph Creation time event | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3733 | Capture Nx Command event to GA | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3731 | Add configuration for opt-out of tracking | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3732 | Add prompt during CNW + Nx invocation | Colum Ferry | Surface Level Telemetry | 2026-03-09 |
| NXC-3954 | testCompile does not have inputs for test sources (Maven) | Jason Jean | Maven Support | 2026-03-09 |
| NXC-3888 | Investigate maven caching bug in batch mode v4 e2e | Jason Jean | Maven Support | 2026-03-09 |
| NXC-3829 | Remove custom Nx project name overrides in nx repo | Max Kless | Gradle Plugin for Nx | 2026-03-09 |

**Key themes:** Task Sandboxing I/O fixes (~18 issues), Surface Level Telemetry shipped (~8 issues), Gradle/Maven plugin improvements (~6 issues), performance/daemon fixes, CLI UX improvements.

**Top contributors:** Leosvel Perez Espinosa, Craigory Coppola, Colum Ferry, Jack Hsu, Louie Weng, Jason Jean, Max Kless.

---

### Nx Cloud (CLOUD) — 33 issues completed in March

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| CLOUD-4196 | Test Gitlab one-page onboarding flow on staging | Nicole Oliver | One-page connect workspace | 2026-03-20 |
| CLOUD-4316 | Pentest: Rollbar Client Token injection | Nicole Oliver | — | 2026-03-20 |
| CLOUD-4253 | Add Nx API endpoints for connect workspace CLI flow | dillon@nrwl.io | CLI AX | 2026-03-20 |
| CLOUD-4307 | Data modification request | Altan Stalker | Nx Cloud misc | 2026-03-20 |
| CLOUD-4333 | Delete data for user (GDPR) | Altan Stalker | Nx Cloud misc | 2026-03-20 |
| CLOUD-4261 | Implement reverse proxy for PostHog | Nicole Oliver | Evaluate product analytics | 2026-03-20 |
| CLOUD-4278 | Determine which feature flags can be retired | Nicole Oliver | Evaluate product analytics | 2026-03-20 |
| CLOUD-4265 | Turn PostHog on in staging | Nicole Oliver | Evaluate product analytics | 2026-03-20 |
| CLOUD-4377 | Add changelog link to app | Nicole Oliver | Nx Cloud changelog | 2026-03-19 |
| CLOUD-4351 | Frontend CRITICAL CVE-2025-15467 | Altan Stalker | — | 2026-03-17 |
| CLOUD-4311 | Pentest: Unauthenticated access to achievements endpoint | Nicole Oliver | — | 2026-03-13 |
| CLOUD-4270 | Simplify e2e auth by avoiding Auth0 in CI | Chau Tran | — | 2026-03-11 |
| CLOUD-4310 | Pentest: Email verification not enforced | dillon@nrwl.io | — | 2026-03-10 |
| CLOUD-4349 | YAML anchors fail in single-tenant distribute-on | Steven Nance | — | 2026-03-11 |
| CLOUD-4353 | Refresh verify email UI | Nicole Oliver | — | 2026-03-10 |
| CLOUD-4348 | Nx Graph grouped mode expand shows empty folder | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-4344 | Add file list filters in sandbox analysis process view | Louie Weng | — | 2026-03-09 |
| CLOUD-4346 | Nx graph grouped/flat toggle breaks All button | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-4338 | Alphabetize and add filter for trace end node list | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-2754 | Xterm search state not reset when terminal reopened | Nicole Oliver | — | 2026-03-07 |
| CLOUD-4345 | Vanta: Security awareness training records | Mark Lindsey | — | 2026-03-07 |
| CLOUD-4347 | Make the CIPE filter wider | Nicole Oliver | — | 2026-03-06 |
| CLOUD-4343 | Add metadata-only auto opt-in after onboarding migration | — | — | 2026-03-06 |
| CLOUD-4312 | Pentest: Sensitive data in session cookies | Chau Tran | — | 2026-03-04 |
| CLOUD-4334 | Add provided logos to website footer in Framer | Benjamin Cabanes | — | 2026-03-04 |
| CLOUD-4297 | stop-agents-after ignored with hybrid changeset | Miroslav Jonas | — | 2026-03-04 |
| CLOUD-4323 | Add P95 CIPE duration to analytics graph | Nicole Oliver | — | 2026-03-04 |
| CLOUD-3879 | Prompt to connect GH/GL account after account creation | — | — | 2026-03-02 |

**Key themes:** Pentest/security remediation (4 issues), PostHog analytics rollout (3 issues), Nx Graph improvements (3 issues), onboarding improvements, GDPR compliance.

**Top contributors:** Nicole Oliver, Chau Tran, Altan Stalker, dillon@nrwl.io, Benjamin Cabanes.

---

### Infrastructure (INF) — 49 issues completed in March (hasNextPage: true)

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| INF-1162 | Implement GetWorkflowStatus fan-out | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-22 |
| INF-1277 | Infra change request (Rollbar tokens) | Steve Pentland | — | 2026-03-22 |
| INF-1161 | Implement CancelWorkflow | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-20 |
| INF-1167 | Implement workflow-to-downstream Valkey mapping | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-20 |
| INF-1145 | Workflow Routing Engine | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-20 |
| INF-1273 | Cleanup duplicate values in secrets | szymon@nrwl.io | Break apart secrets | 2026-03-20 |
| INF-1271 | Change request for Caseware | Steve Pentland | — | 2026-03-19 |
| INF-1267 | Use new secrets in production | szymon@nrwl.io | Break apart secrets | 2026-03-19 |
| INF-1166 | Implement capability-based downstream filtering | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-19 |
| INF-1260 | LoadBalancer TLS Termination | Patrick Mariglia | K8S Gateway API | 2026-03-19 |
| INF-1142 | Downstream Controller Discovery API | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-19 |
| INF-1269 | Create checkin goroutine for downstreams | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-19 |
| INF-1263 | Split production secrets | szymon@nrwl.io | Break apart secrets | 2026-03-19 |
| INF-1268 | Enable io-trace-daemon for Legora | Steve Pentland | — | 2026-03-18 |
| INF-1266 | Use new secrets in staging | szymon@nrwl.io | Break apart secrets | 2026-03-18 |
| INF-1239 | Define config path for downstreams | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-18 |
| INF-1262 | Split staging secrets | szymon@nrwl.io | Break apart secrets | 2026-03-18 |
| INF-1257 | Look into Claude BigQuery connector | Steve Pentland | — | 2026-03-17 |
| INF-1264 | Use new secrets in dev | szymon@nrwl.io | Break apart secrets | 2026-03-17 |
| INF-1261 | Split development secrets | szymon@nrwl.io | Break apart secrets | 2026-03-17 |
| INF-1251 | Stamp-able way to enable Gateway API | Patrick Mariglia | K8S Gateway API | 2026-03-16 |
| INF-1250 | Update Google Terraform for Gateway API | Patrick Mariglia | K8S Gateway API | 2026-03-16 |
| INF-1258 | Change request for Legora (SAML) | szymon@nrwl.io | — | 2026-03-16 |
| INF-1255 | Infra change request | Patrick Mariglia | — | 2026-03-13 |
| INF-1254 | Infra change request | Steve Pentland | — | 2026-03-13 |
| INF-1154 | Create client for facade | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-13 |
| INF-1253 | Automate IAM for new AWS accounts | szymon@nrwl.io | Bring identity portal into OpenTofu | 2026-03-13 |
| INF-1248 | Infra change request (Azure ST) | Steve Pentland | — | 2026-03-11 |
| INF-1153 | Add endpoints to controller on --downstream | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-12 |
| INF-1152 | Design models and API surface for controller | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-08 |
| INF-1237 | Create a K8s Gateway in Dev | Patrick Mariglia | K8S Gateway API | 2026-03-12 |
| INF-1249 | Import existing SSO resources into tofu | szymon@nrwl.io | Bring identity portal into OpenTofu | 2026-03-12 |
| INF-1018 | Infra change request (Azure ST) | Patrick Mariglia | — | 2026-03-11 |
| INF-1227 | Infra change request | Steve Pentland | — | 2026-03-11 |
| INF-1247 | Remove azure-specific env var in wf-controller | szymon@nrwl.io | Azure Hosted Redis/Valkey | 2026-03-11 |
| INF-1242 | Change request for Caseware | Steve Pentland | — | 2026-03-10 |
| INF-1241 | Move wf-controller env vars for Azure tenants | szymon@nrwl.io | Azure Hosted Redis/Valkey | 2026-03-10 |
| INF-1235 | Add azure redis auth in nx-api | szymon@nrwl.io | Azure Hosted Redis/Valkey | 2026-03-10 |
| INF-1240 | Change request for Legora | szymon@nrwl.io | — | 2026-03-09 |
| INF-1233 | Add azure redis auth in workflow controller | szymon@nrwl.io | Azure Hosted Redis/Valkey | 2026-03-09 |
| INF-1238 | Change request for Legora | Steve Pentland | — | 2026-03-08 |
| INF-1141 | Controller Subsystem Audit for Facade Mode | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-07 |
| INF-1151 | Spike facade mode gating prototype | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-06 |
| INF-1218 | Investigation / Reading Documentation (GKE Docker) | Patrick Mariglia | GCP GKE Docker Image Pre-Loading | 2026-03-06 |
| INF-1236 | Change request for Mimecast | szymon@nrwl.io | — | 2026-03-06 |
| INF-1150 | Document cross-dependencies for selective disabling | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-04 |
| INF-1149 | Audit main.go startup and map subsystems | Steve Pentland | Multi-Cluster Agent Setups | 2026-03-04 |
| INF-1228 | Add Grafana space to spacelift | szymon@nrwl.io | Grafana Billing Alerts | 2026-03-04 |
| INF-1232 | Change request for Cloudinary | szymon@nrwl.io | — | 2026-03-04 |

**Key themes:** Multi-Cluster Agent Setups (~16 issues, major effort), secrets management overhaul (~8 issues), K8S Gateway API + L7 Load Balancing (~5 issues), Azure Redis/Valkey auth (~4 issues), identity portal OpenTofu (~2 issues), tenant change requests (~10 issues).

**Top contributors:** Steve Pentland, szymon@nrwl.io, Patrick Mariglia.

---

### RedPanda (NXA) — 50 issues completed in March (hasNextPage: true)

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| NXA-1170 | Detailed plan on supporting two types of orgs in nx-api | Altan Stalker | Polyr (Polygraph) | 2026-03-20 |
| NXA-1172 | feature-theme (Polygraph) | Chau Tran | Polyr (Polygraph) | 2026-03-20 |
| NXA-1176 | polygraph frontend environment variable | Chau Tran | Polyr (Polygraph) | 2026-03-20 |
| NXA-1163 | Init new Polygraph Frontend app | Chau Tran | Polyr (Polygraph) | 2026-03-20 |
| NXA-1154 | Add EXCLUDE_AI_CREDITS plan modifier to customers | Altan Stalker | Self-Healing CI | 2026-03-17 |
| NXA-1114 | Track initiating branch in .nx/polygraph | Max Kless | Polygraph AI | 2026-03-17 |
| NXA-1156 | Self-healing board shows generating fix after completion | Mark Lindsey | Self-Healing CI | 2026-03-17 |
| NXA-1148 | Switch between conformance reports on CIPE page | Mark Lindsey | — | 2026-03-17 |
| NXA-1153 | Conformance step intermittently shows "Step not found" | Mark Lindsey | Red Panda Misc | 2026-03-17 |
| NXA-1120 | Staging invite acceptance shows error page | Mark Lindsey | — | 2026-03-17 |
| NXA-1158 | Rename `cloud_polygraph_delegate` to `polygraph_delegate` | Max Kless | Polygraph AI | 2026-03-17 |
| NXA-1095 | Explore sessions without initiator | — | Polygraph AI | 2026-03-17 |
| NXA-897 | Add oauth integration for Azure DevOps | Chau Tran | Workspace visibility | 2026-03-16 |
| NXA-1143 | Create README for polygraph-mcp repo | Max Kless | Polygraph AI | 2026-03-13 |
| NXA-1152 | Add branch protection to polygraph repos | Max Kless | Polygraph AI | 2026-03-13 |
| NXA-1105 | Self-serve adoption: Docs and UI messaging cleanup | James Henry | Self-Healing CI | 2026-03-13 |
| NXA-834 | Update Claude agent SDK to support Tasks | James Henry | Self-Healing CI | 2026-03-13 |
| NXA-1069 | Test & document import gaps for @nx/gradle | Max Kless | Improve Nx Import | 2026-03-12 |
| NXA-1090 | Make monitor ci work with GitHub Actions | Jonathan Cammisuli | Polygraph AI | 2026-03-12 |
| NXA-1029 | Get GitHub Action logs | Jonathan Cammisuli | Polygraph AI | 2026-03-12 |
| NXA-995 | Default workspace visibility to repo access | Mark Lindsey | Workspace visibility | 2026-03-12 |
| NXA-1021 | Blocked on zod 4 migration | James Henry | Self-Healing CI | 2026-03-12 |
| NXA-1006 | Improve `nx import` AX like cnw/init | Max Kless | CLI AX | 2026-03-12 |
| NXA-1051 | Make branch names and session IDs unique | Max Kless | Polygraph AI | 2026-03-12 |
| NXA-1092 | Explore uploading child logs to cloud | Max Kless | Polygraph AI | 2026-03-12 |
| NXA-1142 | Update polygraph skills with new MCP naming | Max Kless | Polygraph AI | 2026-03-12 |
| NXA-1141 | Create Dependency does not update graph for some repos | Chau Tran | — | 2026-03-11 |
| NXA-1102 | Test visibility settings in snapshot/staging | Mark Lindsey | Workspace visibility | 2026-03-11 |
| NXA-1133 | Disable org visibility in settings if env var set | Mark Lindsey | Workspace visibility | 2026-03-11 |
| NXA-1136 | Clean up remaining uses of org public/private setting | Mark Lindsey | Workspace visibility | 2026-03-11 |
| NXA-885 | Fix condensed looking UI (Self-Healing) | Mark Lindsey | Self-Healing CI | 2026-03-11 |
| NXA-1138 | Update prod Github App for Action permission | Mark Lindsey | — | 2026-03-10 |
| NXA-973 | Workspace graph not connecting when project starts with @ | — | Polygraph AI | 2026-03-02 |
| NXA-1131 | Create separate polygraph MCP | Max Kless | Polygraph AI | 2026-03-10 |
| NXA-1117 | UI messaging for modelProviderIssue in CIPE fixes | Mark Lindsey | Self-Healing CI | 2026-03-10 |
| NXA-1121 | Polygraph command | Victor Savkin | Polygraph AI | 2026-03-10 |
| NXA-1024 | Battle test cross-repo plan mode | Victor Savkin | Polygraph AI | 2026-03-10 |
| NXA-782 | Add onboarding option to open PR for self-healing | Chau Tran | Self-Healing CI | 2026-03-09 |
| NXA-1107 | Enable adding repos to a running polygraph session | Max Kless | Polygraph AI | 2026-03-09 |
| NXA-1123 | Pushing branch after initial push fails | — | Polygraph AI | 2026-03-09 |
| NXA-989 | Icon click redirects to CNW for empty workspace | Mark Lindsey | Red Panda Misc | 2026-03-09 |
| NXA-1098 | No permission to accept suggestion in Self Healing | Chau Tran | Self-Healing CI | 2026-03-09 |
| NXA-1116 | Claude Code worktrees need to be Nx/Git ignored | Juri Strumpflohner | — | 2026-03-06 |
| NXA-952 | Monitor CI skill: bail when deps/tools unavailable | Chau Tran | CLI AX | 2026-03-06 |
| NXA-1004 | Reduce CI watcher subagent background polling | Chau Tran | CLI AX | 2026-03-06 |
| NXA-1122 | General login command (Polygraph) | Victor Savkin | Polygraph AI | 2026-03-06 |
| NXA-1091 | Test e2e experience for metadata-only workspaces | Victor Savkin | Polygraph AI | 2026-03-06 |
| NXA-1055 | Fix settings access when VCS and Cloud roles conflict | Mark Lindsey | Red Panda Misc | 2026-03-06 |
| NXA-1054 | Investigate org created with 0 admins | Mark Lindsey | Red Panda Misc | 2026-03-06 |
| NXA-878 | Augment self-healing status visibility for task items | Mark Lindsey | Self-Healing CI | 2026-03-05 |

**Key themes:** Polygraph AI (new product, ~18 issues), Self-Healing CI improvements (~10 issues), Workspace visibility (~5 issues), CLI AX / nx-import improvements.

**Top contributors:** Max Kless, Mark Lindsey, Chau Tran, Victor Savkin, James Henry, Altan Stalker.

---

### Quokka (Q) — 32 issues completed in March

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| Q-268 | Migrate prometheus handlers to service account auth | Rares Matei | Enterprise Analytics API Cleanup | 2026-03-23 |
| Q-315 | dailyProductUsage: persist AI credits, connections, contributors | Altan Stalker | Onboarding Enablement | 2026-03-20 |
| Q-310 | Record project graph size in latestProjectGraphs | Altan Stalker | Onboarding Enablement | 2026-03-20 |
| Q-313 | Move internal sandboxing route to /private | Louie Weng | Task Sandboxing | 2026-03-19 |
| Q-312 | Add env var to enable sandboxing toggle for ST | Louie Weng | Task Sandboxing | 2026-03-18 |
| Q-285 | protectedVERB variants use raisingVERB behind scenes | Altan Stalker | Nx-api Iterative Improvements | 2026-03-18 |
| Q-309 | Port Remix PostHog models to Kotlin shared lib | Altan Stalker | Onboarding Enablement | 2026-03-18 |
| Q-308 | Track workspace claims + 6-week info gather job | Altan Stalker | Onboarding Enablement | 2026-03-18 |
| Q-296 | Investigate inconsistent task violation reports | Rares Matei | Task Sandboxing | 2026-03-17 |
| Q-234 | Reduce number of logs from daemon | Rares Matei | Task Sandboxing | 2026-03-17 |
| Q-291 | Make PostHog available in gradle projects | Altan Stalker | Onboarding Enablement | 2026-03-17 |
| Q-292 | Surface compute and AI credit counts to daily audit | Altan Stalker | Onboarding Enablement | 2026-03-17 |
| Q-192 | Enterprise usage page credit limit blocks Clickup re-up | Altan Stalker | — | 2026-03-17 |
| Q-282 | WaitingAgents backed by valkey | Altan Stalker | March-April 2026 Misc | 2026-03-17 |
| Q-295 | Show compare panel for tasks without violations | Louie Weng | Task Sandboxing | 2026-03-16 |
| Q-294 | Version catalogs invalidate gradle project graph cache | Louie Weng | Gradle Plugin for Nx | 2026-03-12 |
| Q-242 | Investigate memory usage for tree view | Louie Weng | Task Sandboxing | 2026-03-11 |
| Q-249 | Use streaming for file tree and viewer components | Louie Weng | Task Sandboxing | 2026-03-11 |
| Q-260 | List view filter supports glob patterns | Louie Weng | Task Sandboxing | 2026-03-10 |
| Q-284 | Investigate race condition in reconciling continuous tasks | Altan Stalker | Continuous assignment of tasks | 2026-03-10 |
| Q-286 | Sandbox analysis views toggleable via URL | Louie Weng | Task Sandboxing | 2026-03-09 |
| Q-259 | File tree: toggle violation types visibility | Louie Weng | Task Sandboxing | 2026-03-09 |
| Q-277 | Show task ID in sandbox analysis view | Louie Weng | Task Sandboxing | 2026-03-09 |
| Q-279 | Add timeline/conformance view for sandbox violations | Louie Weng | Task Sandboxing | 2026-03-06 |
| Q-283 | Mismatch between files written count and file tree | Louie Weng | Task Sandboxing | 2026-03-06 |
| Q-281 | Unexpected reads exceed total files read in report | Rares Matei | Task Sandboxing | 2026-03-06 |
| Q-273 | Embed sandboxing exclusion list in io-trace-daemon | Rares Matei | Task Sandboxing | 2026-03-06 |
| Q-269 | Limit sandbox violations warning list + link to sorted view | Louie Weng | Task Sandboxing | 2026-03-03 |
| Q-272 | UI filtering not applied on initial load in Remix | Louie Weng | Task Sandboxing | 2026-03-04 |
| Q-265 | Add run details filters for flaky and sandbox violations | — | Task Sandboxing | 2026-03-05 |
| Q-274 | Conformance notifications do not send on ST | Altan Stalker | March-April Misc | 2026-03-04 |
| Q-237 | Handle file deletions in sandboxing | Rares Matei | Task Sandboxing | 2026-03-04 |
| Q-266 | Remove violations tab view | Louie Weng | Task Sandboxing | 2026-03-03 |
| Q-250 | Sandbox report taskId coerces special symbols to _ | Rares Matei | Task Sandboxing | 2026-03-02 |

**Key themes:** Task Sandboxing dominates (~22 issues), Onboarding Enablement/analytics (~6 issues), nx-api improvements.

**Top contributors:** Louie Weng, Altan Stalker, Rares Matei.

---

### Docs (DOC) — 28 issues completed in March

| ID | Title | Assignee | Completed |
|----|-------|----------|-----------|
| DOC-418 | Fix Next.js build failure for /ai-chat | Jack Hsu | 2026-03-20 |
| DOC-441 | Update docs to use latest image tag | Caleb Ukle | 2026-03-17 |
| DOC-448 | Restore CNW CTA getting started pages | Jack Hsu | 2026-03-20 |
| DOC-419 | Update outdated Angular migration doc | Jack Hsu | 2026-03-19 |
| DOC-450 | nx.dev/changelog internal server error | Caleb Ukle | 2026-03-19 |
| DOC-449 | Add frame protection headers to netlify configs | Caleb Ukle | 2026-03-18 |
| DOC-424 | Investigate why internal link checker isn't running | Caleb Ukle | 2026-03-17 |
| DOC-420 | Clarify "batch mode" in docs | Caleb Ukle | 2026-03-17 |
| DOC-446 | Documentation for telemetry | Jack Hsu | 2026-03-17 |
| DOC-445 | Track nx-dev server page views for AI traffic | Jack Hsu | 2026-03-17 |
| DOC-422 | Clarify supported Storybook versions | — | 2026-03-17 |
| DOC-344 | Document Docker Layer Caching | Caleb Ukle | 2026-03-17 |
| DOC-444 | nx.dev pages 404 on hard reload | Benjamin Cabanes | 2026-03-16 |
| DOC-439 | Fix redirect for /concepts/decisions/dependency-management | Caleb Ukle | 2026-03-12 |
| DOC-440 | Merge self-healing auto-apply video PR | Juri Strumpflohner | 2026-03-13 |
| DOC-442 | Fix broken OSS cloud pricing redirect | Caleb Ukle | 2026-03-12 |
| DOC-393 | Writing style linting (Vale) | Jack Hsu | 2026-03-06 |
| DOC-430 | Blog search missing Enterprise Task Analytics article | Jack Hsu | 2026-03-05 |
| DOC-437 | Clean up outdated version references (< Nx 20) | Jack Hsu | 2026-03-04 |
| DOC-436 | Docs images broken after rewrite changes | Jack Hsu | 2026-03-04 |
| DOC-429 | Document sandboxing feature for Cloud UI | Jack Hsu | 2026-03-04 |
| DOC-435 | /docs redirect returns 404 | Jack Hsu | 2026-03-03 |
| DOC-390 | Additional AI discovery mechanisms (llms.txt) | Jack Hsu | 2026-03-03 |
| DOC-431 | Clean-up for pages in Framer vs Next.js | Jack Hsu | 2026-03-03 |
| DOC-428 | Review all CLI and Cloud links | Jack Hsu | 2026-03-03 |
| DOC-432 | Add Cmd+K redirect from nx.dev to /docs | Benjamin Cabanes | 2026-03-03 |

**Key themes:** CNW funnel optimization, Framer/Next.js cleanup, security headers, AI traffic tracking, telemetry docs, broken links/redirects.

**Top contributors:** Jack Hsu, Caleb Ukle, Benjamin Cabanes.

---

### Customer Success (CS) — 10 issues completed in March

| ID | Title | Assignee | Project | Completed |
|----|-------|----------|---------|-----------|
| CS-71 | Calculate credit distribution for Flutter | Miroslav Jonas | — | 2026-03-12 |
| CS-70 | Create internal blogpost: Nx vs Turbo | Miroslav Jonas | — | 2026-03-12 |
| CS-67 | Migrate contributors count | Miroslav Jonas | Migrate DPE-tools to Lighthouse | 2026-03-12 |
| CS-69 | Refund for duplicate seats in February | Miroslav Jonas | — | 2026-03-06 |
| CS-133 | Configure SSO (Pylon) | Steven Nance | Pylon Rollout | 2026-03-03 |
| CS-132 | Setup custom domain (help.nx.app) | Benjamin Cabanes | Pylon Rollout | 2026-03-02 |
| CS-86 | Connect Pylon to Google Workspace | Cory Henderson | Pylon Rollout | 2026-03-02 |
| CS-92 | Setup DNS for custom email domain | Benjamin Cabanes | Pylon Rollout | 2026-03-02 |
| CS-154 | Cut over from Salesforce to Pylon | Steven Nance | Pylon Rollout | 2026-03-02 |
| CS-129 | Setup custom domain (support.nx.app) | Benjamin Cabanes | Pylon Rollout | 2026-03-02 |

**Key themes:** Pylon Rollout completion (6 issues — cutover from Salesforce done!), DPE tools migration, customer credit work.

---

## 3. PROJECTS (Active & Recently Updated)

### In Progress

| Project | Lead | Team(s) | Target Date | Status |
|---------|------|---------|-------------|--------|
| CNW/Init Funnel & Cloud Conversion Optimization | Jack Hsu | DOC, NXC | 2026-04-10 | In Progress |
| Quark-a task force | Cory Henderson | CLOUD | 2026-04-30 | In Progress |
| Ocean DX improvements | Nicole Oliver | CLOUD | — | In Progress |
| Feature demos | Nicole Oliver | CLOUD | 2026-03-31 | In Progress |
| March-April 2026 Misc | Altan Stalker | Q | 2026-04-30 | In Progress |
| Enterprise Analytics API Cleanup | Rares Matei | Q | — | In Progress |
| Workspace visibility | Mark Lindsey | NXA | — | In Progress |
| Implement Multi-Cluster Agent Setups | Steve Pentland | INF | 2026-04-08 | In Progress |
| Migrate DPE-tools to Lighthouse | Miroslav Jonas | CS | — | Completed (2026-03-23) |

### Planned

| Project | Lead | Team(s) | Target Date |
|---------|------|---------|-------------|
| Feature activation guides | Nicole Oliver | CLOUD | 2026-04-24 |
| In-Progress Agent Waterfall Visualization | Benjamin Cabanes | CLOUD | 2026-04-30 |
| Task Analytics Percentiles | — | Q | — |
| Resource-based parallel task assignment | — | Q | — |
| Lighthouse MongoDB connections | Patrick Mariglia | INF | 2026-04-17 |
| Allow new users to opt into Team plan | Benjamin Cabanes | CLOUD | — |

### Backlog (New in March)

| Project | Lead | Team(s) | Priority |
|---------|------|---------|----------|
| Determine Trivy alternative | — | INF | High |
| Spacelift -> Atlantis (investigate) | — | INF | Medium |
| ArgoCD: AppSet -> Helm -> AppSets | — | INF | Medium |
| General Availability for CLI Telemetry | Jack Hsu | NXC | — |
| Polyr (Polygraph) | Victor Savkin | NXA | — |
| Use GitHub webhooks to block CIPEs from forks | — | Q | — |
| Create unified DPE/AE portal under Lighthouse | Miroslav Jonas | CS | — |
| Measure/Understand Customer Sentiment | Joe Johnson | CS | — |
| Simplify Enterprise Trial (POV) Experience | Joe Johnson | CS | — |
| Support Angular v22 | Leosvel Perez Espinosa | NXC | — |
| Nx TUI + Mouse Capture | Craigory Coppola | NXC | — |
| CLI Analytics for Enterprise Customers | — | NXC | — |

### Completed

| Project | Lead | Team(s) |
|---------|------|---------|
| IO Trace Internal Helm Chart | Steve Pentland | INF |
| Pylon Rollout & Evaluation | Steven Nance | CS |
| Bucket access binding -> memberships | Patrick Mariglia | INF |
| Review Nx Resource Usage | Leosvel Perez Espinosa | NXC |

### Paused

| Project | Lead | Team(s) |
|---------|------|---------|
| Agentic Nx Migrations | Max Kless | NXA |

---

## 4. PROJECT STATUS UPDATES (March 2026)

### Implement Multi-Cluster Agent Setups (INF) — Steve Pentland
- **Progress:** 8% -> 16% -> 40% (as of Mar 20)
- **Health:** On Track
- **Summary:** Base framework and routing are in. Started doing passthrough of RunWorkflow, CancelWorkflow, etc. Currently working on workflow status and log streaming. Fell a bit behind due to security/pentest distractions.

### K8S Gateway API + L7 Load Balancing (INF) — Patrick Mariglia
- **Progress:** 38% -> 68% (as of Mar 20)
- **Health:** On Track
- **Summary:** Added scope around TLS on load balancers and `*.internal.nxcloud` CA management. Terraform abstraction for GCP Gateway API created, helm chart for application cluster runner. Exploring shared CA for internal trust. Gateway API chosen over Ingress as the modern approach despite some limitations.

### Bring identity portal into OpenTofu (INF) — szymon@nrwl.io
- **Status:** Closing as of Mar 16
- **Summary:** Existing resources (users, groups, permissions) imported into terraform state. New AWS accounts auto-grant access to infra admins and DPEs.

### CLI Agentic Experience (AX) (NXC/NXA) — Max Kless
- **Health:** On Track
- **Summary (Mar 9):** CLI refactors shipped for nx init, nx import, CNW. Benchmarks exist with good perf progress. nx connect taking longer than expected. Monitor CI skill improvements shipping. Agentic migration pivot: building better local `nx migrate` loop instead of cloud platform. Agent sandboxing alignment in progress. Blog post + video published for nx import. Skills submitted to Anthropic and Cursor registries.

### Task Sandboxing (Input/Output Tracing) (Q) — Rares Matei
- **Health:** On Track
- **Summary (Mar 6):** Sandbox violation count going down. Many UI improvements by Louie. Docs published. eBPF daemon performance issues mostly resolved. Embedded default exclusion list. File existence verification at flush time. Directory filtering. Creating Grafana dashboard next.

### Allow new users to opt into Team plan (CLOUD) — Benjamin Cabanes
- **Progress:** 0% -> 21% (as of Mar 6)
- **Summary:** Plan selection step built and approved. Hobby/Team toggle with usage-aware stat bars, Stripe checkout integration, plan preselection via cookie, PostHog analytics, reduced-motion support, ARIA tab semantics, E2E coverage. Remaining: Stripe wiring, accessibility pass, e2e tests.

### Review Nx Resource Usage (NXC) — Leosvel Perez Espinosa
- **Status:** Closing out, one last PR to merge
- **Summary:** Memory/CPU profiling completed, plugin worker shutdown fixed, dogfooded, main CLI/daemon performance improved. Future perf work will be incremental during cooldown.

---

## 5. ENTERPRISE PoVs (Customer Success / Sales)

| Customer | Status | Health | Lead | Key Update |
|----------|--------|--------|------|------------|
| **Anaplan** | Wrapping up | On Track | Austin Fahsl | ~9.5 min avg pipeline, 2+ hrs/week saved. Drafting business case vs $300K annual compute. |
| **CIBC** | Active | On Track | Austin Fahsl | PoV kicked off Mar 1. Encryption issue resolved. Container registry setup. |
| **MNP.ca** | Active | On Track | Austin Fahsl | Remote caching live, CI time halved. DTE implementation next. |
| **Rocket Mortgage** | Planning | At Risk | Austin Fahsl | Baseline metrics received. MSA legal questions in progress. Target date pushed to Apr 30. |
| **Cisco** | Blocked | At Risk | Austin Fahsl | MSA stuck in Cisco global procurement. Security questionnaire complete. Target pushed to Apr 30. |
| **McGraw Hill** | Pending | On Track | Austin Fahsl | Pushed to ~May. Customer completing Angular 20 upgrade first. Success criteria: 20% P95 CI time improvement. |

---

## 6. INITIATIVES

| Initiative | Status |
|------------|--------|
| **2026 March - April** | Active |
| **2026 May - June** | Planned |
| **2026 January - February** | Completed |

Projects in the **March-April initiative:**
- Quark-a task force (CLOUD)
- Ocean DX improvements (CLOUD)
- Feature demos (CLOUD)
- Feature activation guides (CLOUD)
- In-Progress Agent Waterfall Visualization (CLOUD)

---

## 7. NOTABLE IN-PROGRESS WORK (Large Efforts)

1. **Polygraph (Polyr)** — New independent product being built. Victor Savkin leading. Frontend bootstrapped by Chau Tran. ~18 NXA issues completed around Polygraph AI in March. Cross-repo plan mode battle-tested. Separate MCP created. GitHub Actions support added.

2. **Multi-Cluster Agent Setups** — Steve Pentland driving major infrastructure work. Facade mode for the workflow controller, allowing one app cluster to connect to multiple agent clusters. Progress went from 8% to 40% in March.

3. **Task Sandboxing (I/O Tracing)** — Cross-team effort spanning NXC, Q, and CLOUD. ~40+ issues completed across teams. eBPF daemon stabilized, UI completely revamped by Louie Weng, sandbox violations decreasing. Docs published.

4. **Surface Level Telemetry** — Shipped in Nx 22.6.0. Colum Ferry completed the core implementation (opt-out config, prompt, sensitive data removal, event flushing). Dogfooded in both nx and ocean repos. Jack Hsu wrote docs.

5. **Pylon Rollout** — Successfully cut over from Salesforce to Pylon for customer support. SSO configured, custom domains (help.nx.app, support.nx.app) set up, DNS configured for email, Google Workspace connected.

6. **K8S Gateway API + L7 Load Balancing** — Patrick Mariglia implementing modern Kubernetes ingress using Gateway API. TLS termination with shared CA for `*.internal.nxcloud`. 68% complete.

7. **Secrets Management Overhaul** — szymon@nrwl.io broke apart the monolithic `nx-cloud-secrets` JSON into distinct secrets across dev/staging/production environments (~8 issues).

---

## Summary Stats

| Team | Issues Completed (March) | Notable |
|------|-------------------------|---------|
| NXC | 50+ | Telemetry shipped, sandbox I/O, Gradle/Maven |
| CLOUD | 33 | Pentest fixes, PostHog, onboarding |
| INF | 49+ | Multi-cluster, Gateway API, secrets |
| NXA | 50+ | Polygraph AI, Self-Healing CI, workspace visibility |
| Q | 32 | Task Sandboxing UI, Onboarding analytics |
| DOC | 28 | CNW funnel, Framer cleanup, AI discovery |
| CS | 10 | Pylon cutover, DPE tools, Nx vs Turbo |
| **TOTAL** | **252+** | |
