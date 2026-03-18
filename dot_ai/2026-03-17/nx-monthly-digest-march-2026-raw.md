# Nx Monthly Digest - March 2026 - Raw Linear Data

Collected: 2026-03-17

---

## TEAM: Nx CLI (NXC-)

### Completed Issues (March 2026) - 56 issues

#### Project: Task Sandboxing (Input/Output Tracing) - 25 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-4082 | Evaluate skipping Rust-to-JS input transfer without subscribers | Craigory Coppola | 2026-03-17 |
| NXC-3956 | Clear `TaskIOService` retained data after subscription and don't accumulate it | Craigory Coppola | 2026-03-17 |
| NXC-4084 | Show whether a target is continuous in `nx show target` | unassigned | 2026-03-17 |
| NXC-4066 | Fix process tree filtering with many subprocesses | Louie Weng | 2026-03-16 |
| NXC-4081 | TS tasks should depend on all referenced tsconfig files from deps | Leosvel Perez Espinosa | 2026-03-16 |
| NXC-4005 | Nx repo test targets missing input for scripts/patched-jest-resolver.js | Leosvel Perez Espinosa | 2026-03-16 |
| NXC-4051 | E2E tests show unexpected reads on tsconfig.spec.json files | Leosvel Perez Espinosa | 2026-03-16 |
| NXC-4011 | IO tracing inputs list differs from expected nx outputs | Craigory Coppola | 2026-03-16 |
| NXC-3974 | Use JSON by default for AI agent `show target` command | Craigory Coppola | 2026-03-16 |
| NXC-4064 | Exclude e2e.log | Leosvel Perez Espinosa | 2026-03-13 |
| NXC-4067 | Default to file tree with unexpected filter enabled | Louie Weng | 2026-03-13 |
| NXC-4054 | Input violation check disagrees with `nx show target` | Rares Matei | 2026-03-10 |
| NXC-4057 | Fix sandboxing inputs for `nx:build-base` | Leosvel Perez Espinosa | 2026-03-11 |
| NXC-4029 | Include Gradle files in Gradle task inputs | Louie Weng | 2026-03-10 |
| NXC-4004 | graph-ui-code-block:typecheck reads undeclared build outputs from graph/ui-common | Leosvel Perez Espinosa | 2026-03-10 |
| NXC-3965 | Investigate d.ts outputs from dependency projects | Leosvel Perez Espinosa | 2026-03-10 |
| NXC-4041 | Add *.tsbuildinfo dependent outputs to tsc tasks | Leosvel Perez Espinosa | 2026-03-06 |
| NXC-4037 | `feature-organization-conformance-rule-seed:build` race condition | Rares Matei | 2026-03-06 |
| NXC-4039 | daemon still has memory issues | Rares Matei | 2026-03-05 |
| NXC-3966 | Find a solution for .nx/workspace-data/project-graph.json showing up for lint tasks | Craigory Coppola | 2026-03-05 |
| NXC-3968 | Determine why eslint reads package.json | Craigory Coppola | 2026-03-05 |
| NXC-3999 | nx-cloud.db* files are unexpectedly read during e2e lint runs | unassigned | 2026-03-05 |
| NXC-4000 | [machineId].db* files are unexpectedly read during sandboxed task runs | unassigned | 2026-03-05 |
| NXC-4003 | Sandbox tracing should exclude .nx/cache reads/writes from results | unassigned | 2026-03-05 |
| NXC-3973 | enable signal file writing automatically on agents | Rares Matei | 2026-03-05 |
| NXC-4033 | Ensure that run-executor is not used for run-commands processes in agents | Jason Jean | 2026-03-04 |
| NXC-3967 | Remove folder reads because they cannot be inputs | Rares Matei | 2026-03-03 |
| NXC-4001 | :gradle-project-graph:lint reads undeclared inputs (folder and build output) | Leosvel Perez Espinosa | 2026-03-09 |

#### Project: Surface Level Telemetry - 11 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-3695 | Dogfood in ocean | Jason Jean | 2026-03-16 |
| NXC-3696 | Dogfood in nx | Jason Jean | 2026-03-16 |
| NXC-3800 | Flush events on Process.exit / handleErrors | Colum Ferry | 2026-03-09 |
| NXC-3889 | Remove sensitive data from args before sending | Colum Ferry | 2026-03-09 |
| NXC-3734 | Capture Project Graph Creation time and send event to GA | Colum Ferry | 2026-03-09 |
| NXC-3733 | Capture Nx Command and send event to GA | Colum Ferry | 2026-03-09 |
| NXC-3731 | Add configuration for opt-out of tracking | Colum Ferry | 2026-03-09 |
| NXC-3732 | Add prompt during CNW + Nx invocation | Colum Ferry | 2026-03-09 |
| NXC-3890 | Track args as page location querystring | Colum Ferry | 2026-03-04 |
| NXC-3801 | Remove Major Version Number Properties | Colum Ferry | 2026-03-04 |
| NXC-3802 | Change custom metric to time such that we only need one for different use cases | Colum Ferry | 2026-03-04 |
| NXC-3803 | Track page view and other events separately | Colum Ferry | 2026-03-04 |
| NXC-3910 | Handle json file clobbering | Colum Ferry | 2026-03-04 |
| NXC-3891 | Rewrite in Rust | Jason Jean | 2026-03-03 |

#### Project: Gradle Plugin for Nx - 5 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-4034 | Implicit dependencies using project.json name not detected | Craigory Coppola | 2026-03-10 |
| NXC-4056 | Atomized depends-on targets ignore target name override | Louie Weng | 2026-03-10 |
| NXC-3829 | Remove custom Nx project name overrides in nx repo | Max Kless | 2026-03-09 |
| NXC-3828 | Reconcile Gradle plugin inferred dependsOn with renamed projects | Craigory Coppola | 2026-03-09 |
| NXC-3989 | Logs are not showing up in agents? | Louie Weng | 2026-03-09 |

#### Project: Maven Support - 3 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-3849 | Add external dependencies | Jason Jean | 2026-03-17 |
| NXC-3954 | testCompile does not have inputs for test sources? | Jason Jean | 2026-03-09 |
| NXC-3888 | investigate maven caching bug that happens in batch mode v4 e2e test | Jason Jean | 2026-03-09 |

#### Project: Miscellaneous - 8 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-4087 | Investigate TypeScript setup nightly failures | Leosvel Perez Espinosa | 2026-03-17 |
| NXC-4088 | Mark PR #34877 nightly fix as done | Max Kless | 2026-03-17 |
| NXC-3970 | Extreme slowness running run-many lint (graph/daemon) | Craigory Coppola | 2026-03-16 |
| NXC-4040 | ESLint deps rule should add `catalog:` for missing deps | Leosvel Perez Espinosa | 2026-03-06 |
| NXC-3833 | Handle JSON stringify (and other) errors in plugin cache saves | Craigory Coppola | 2026-03-06 |
| NXC-4035 | Surface clearer error when CNW hits SANDBOX_FAILED | Jack Hsu | 2026-03-05 |
| NXC-4018 | Regression with vitest `reporters` handling | Leosvel Perez Espinosa | 2026-03-02 |
| NXC-3553 | Add proper Stopped status when continuous sibling task fails or on SIGINT | Leosvel Perez Espinosa | 2026-02-24 |

#### Project: .NET (Dotnet) Support - 2 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-2753 | Vattenfall is using @nx/dotnet | Miroslav Jonas | 2026-03-03 |
| NXC-2913 | Entain is using @nx/dotnet | Miroslav Jonas | 2026-03-03 |

#### Project: Review Nx Resource Usage - 1 issue
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-3905 | Reduce misc allocations | Leosvel Perez Espinosa | 2026-03-03 |

#### No Project - 4 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXC-4030 | Address security CVE cluster: minimatch, copy-webpack-plugin, koa | Jack Hsu | 2026-03-05 |
| NXC-4020 | Bring back Nov 2025 CNW user flow | Jack Hsu | 2026-03-04 |
| NXC-3408 | pnpm dlx nx@latest init uses NPM rather than PNPM | Max Kless | 2026-03-04 |
| NXC-3466 | Fix nx-webpack-plugin bundling and workspace dependency translation | Colum Ferry | (archived Mar) |
| NXC-3521 | Do not set generatePackageJson true for NestJS Node apps | Colum Ferry | (archived Mar) |

---

## TEAM: Nx Cloud (CLOUD-)

### Completed Issues (March 2026) - ~17 March-completed issues (some archived older ones)

| ID | Title | Assignee | Project | Completed |
|---|---|---|---|---|
| CLOUD-4351 | Frontend - CRITICAL - CVE-2025-15467 | Altan Stalker | | 2026-03-17 |
| CLOUD-4311 | Pentest: Unauthenticated Access to Workspace Achievements Endpoint | Nicole Oliver | | 2026-03-13 |
| CLOUD-4270 | Simplify e2e auth by avoiding Auth0 in CI | Chau Tran | | 2026-03-11 |
| CLOUD-4310 | Pentest: Email Verification Not Enforced | dillon@nrwl.io | | 2026-03-10 |
| CLOUD-4349 | YAML anchors fail when distribute-on and launch-templates are in same file (single-tenant) | Steven Nance | | 2026-03-11 |
| CLOUD-4353 | Refresh verify email UI | Nicole Oliver | | 2026-03-10 |
| CLOUD-4348 | Nx Graph grouped mode expand shows empty folder view | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-4344 | Add file list filters in sandbox analysis process view | Louie Weng | | 2026-03-09 |
| CLOUD-4346 | Nx graph: grouped/flat toggle breaks All button | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-4338 | Alphabetize and add filter for trace end node list | Chau Tran | Nx Graph | 2026-03-09 |
| CLOUD-2754 | Xterm search state is not reset when terminal is closed and reopened | Nicole Oliver | | 2026-03-07 |
| CLOUD-4345 | [Vanta] Remediate security training records | Mark Lindsey | | 2026-03-07 |
| CLOUD-4347 | Make the CIPE filter wider | Nicole Oliver | | 2026-03-06 |
| CLOUD-4343 | Add metadata-only auto opt-in after one-page onboarding migration | (unassigned) | | 2026-03-06 |
| CLOUD-4312 | Pentest: Sensitive Data in Session Cookies (Refresh Token Exposure) | Chau Tran | | 2026-03-04 |
| CLOUD-4334 | Add provided logos to website footer in Framer | Benjamin Cabanes | | 2026-03-04 |
| CLOUD-4297 | stop-agents-after ignored with hybrid changeset when SW affected | Miroslav Jonas | | 2026-03-04 |
| CLOUD-4323 | Add P95 CIPE duration to analytics graph | Nicole Oliver | | 2026-03-04 |
| CLOUD-3879 | After a user creates their account, immediately prompt them to connect their GH/GL account | (unassigned) | | 2026-03-02 |

---

## TEAM: Infrastructure (INF-)

### Completed Issues (March 2026) - 30 issues

#### Project: K8S Gateway API + L7 Load Balancing - 3 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1251 | Stamp-able way to Enable Gateway API | Patrick Mariglia | 2026-03-16 |
| INF-1250 | Update Google Terraform to Support Gateway API | Patrick Mariglia | 2026-03-16 |
| INF-1237 | Create a K8s Gateway in Dev | Patrick Mariglia | 2026-03-12 |

#### Project: Implement Multi-Cluster Agent Setups - 5 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1154 | Create client for facade | Steve Pentland | 2026-03-13 |
| INF-1153 | Add endpoints to controller startup when --downstream param is set | Steve Pentland | 2026-03-12 |
| INF-1152 | Design models and api surface for controller | Steve Pentland | 2026-03-08 |
| INF-1141 | Controller Subsystem Audit for Facade Mode | Steve Pentland | 2026-03-07 |
| INF-1151 | Spike facade mode gating prototype | Steve Pentland | 2026-03-06 |
| INF-1150 | Document cross-dependencies and risks for selective disabling | Steve Pentland | 2026-03-04 |
| INF-1149 | Audit main.go startup sequence and map all initialized subsystems | Steve Pentland | 2026-03-04 |

#### Project: Azure Hosted Redis/Valkey - 3 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1247 | Remove azure specific env var in wf-controller | szymon@nrwl.io | 2026-03-11 |
| INF-1241 | Move out wf-controller env vars from AppSet to tenants' value files in Azure | szymon@nrwl.io | 2026-03-10 |
| INF-1235 | Add azure redis auth in nx-api | szymon@nrwl.io | 2026-03-10 |
| INF-1233 | Add azure redis auth in workflow controller | szymon@nrwl.io | 2026-03-09 |

#### Project: Dev/Staging/Prod - Break apart big secrets - 2 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1264 | Use new secrets in dev | szymon@nrwl.io | 2026-03-17 |
| INF-1261 | Split development secrets | szymon@nrwl.io | 2026-03-17 |

#### Project: Bring identity portal into OpenTofu - 2 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1253 | Automate IAM permission assignment for users in new AWS accounts | szymon@nrwl.io | 2026-03-13 |
| INF-1249 | Import existing SSO resources into tofu code | szymon@nrwl.io | 2026-03-12 |

#### Project: Grafana Billing Alerts - 3 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1228 | Add Grafana space to spacelift | szymon@nrwl.io | 2026-03-04 |
| INF-1225 | Grafana alert for Grafana Cloud monthly cost | szymon@nrwl.io | 2026-03-02 |
| INF-1219 | Figure out grafana billing alert conditions | szymon@nrwl.io | 2026-03-02 |

#### Enterprise/ST Change Requests - 10+ issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1258 | Request for Change: Legora (SAML) | szymon@nrwl.io | 2026-03-16 |
| INF-1255 | Infrastructure Change: MT route nx-cloud/private to backend-not-found | Patrick Mariglia | 2026-03-13 |
| INF-1254 | Infrastructure Change: ST route nx-cloud/private to backend-not-found | Steve Pentland | 2026-03-13 |
| INF-1248 | Infrastructure Change: CIBC SAML setup (Azure) | Steve Pentland | 2026-03-11 |
| INF-1018 | Infrastructure Change: Docker image registry for ST (Azure) | Patrick Mariglia | 2026-03-11 |
| INF-1227 | Infrastructure Change: changelog.nx.app subdomain | Steve Pentland | 2026-03-11 |
| INF-1242 | Request for Change: Caseware SAML | Steve Pentland | 2026-03-10 |
| INF-1240 | Request for Change: Legora workflow runner | szymon@nrwl.io | 2026-03-09 |
| INF-1238 | Request for Change: Legora GH redirect URL | Steve Pentland | 2026-03-08 |
| INF-1236 | Request for Change: Mimecast AI features | szymon@nrwl.io | 2026-03-06 |
| INF-1232 | Request for Change: Cloudinary self-healing | szymon@nrwl.io | 2026-03-04 |
| INF-1231 | Infrastructure Change: Caseware GH app | Steve Pentland | 2026-03-03 |
| INF-1224 | New Single Tenant Instance: Caseware (AWS) | Patrick Mariglia | 2026-03-03 |
| INF-1229 | Infrastructure Change: staging posthog env vars | Steve Pentland | 2026-03-03 |
| INF-1230 | Remove extra Posthog proxy endpoints | Steve Pentland | 2026-03-03 |
| INF-1226 | Infrastructure Change: Jack to db prod readers | Steve Pentland | 2026-03-02 |
| INF-1223 | Create doc outlining failover/multi-region/costs | Steve Pentland | 2026-03-03 |
| INF-1191 | [Vanta] Remediate IAM Access Keys for Rares | Rares Matei | 2026-03-04 |

#### Project: GCP GKE Docker Image Pre-Loading - 1 issue
| ID | Title | Assignee | Completed |
|---|---|---|---|
| INF-1218 | Investigation / Reading Documentation | Patrick Mariglia | 2026-03-06 |

---

## TEAM: Red Panda (NXA-)

### Completed Issues (March 2026) - ~55 issues

#### Project: Polygraph AI - 18 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-1114 | track initiating branch in .nx/polygraph | Max Kless | 2026-03-17 |
| NXA-1158 | Rename the `cloud_polygraph_delegate` skill to `polygraph_delegate` | Max Kless | 2026-03-17 |
| NXA-1095 | Explore sessions without initiator | (unassigned) | 2026-03-17 |
| NXA-1143 | create README for polygraph-mcp repo | Max Kless | 2026-03-13 |
| NXA-1152 | Add branch protection to polygraph repos | Max Kless | 2026-03-13 |
| NXA-1090 | Make monitor ci work with github actions | Jonathan Cammisuli | 2026-03-12 |
| NXA-1029 | Get Github Action logs | Jonathan Cammisuli | 2026-03-12 |
| NXA-1051 | Make branch names and session ids unique | Max Kless | 2026-03-12 |
| NXA-1092 | Explore uploading child logs to cloud | Max Kless | 2026-03-12 |
| NXA-1142 | update polygraph skills with new polygraph mcp naming | Max Kless | 2026-03-12 |
| NXA-1131 | Create separate polygraph mcp | Max Kless | 2026-03-10 |
| NXA-1121 | Polygraph command | Victor Savkin | 2026-03-10 |
| NXA-1024 | Battle test cross-repo plan mode | Victor Savkin | 2026-03-10 |
| NXA-1107 | Enable adding repos to a running polygraph session | Max Kless | 2026-03-09 |
| NXA-1123 | Pushing branch after initial push fails with `push_branch` tool | (unassigned) | 2026-03-09 |
| NXA-1100 | Figure out why deps from nx-example to nx aren't inferred correctly | Victor Savkin | 2026-03-05 |
| NXA-917 | Implement edge drawing in the app | Victor Savkin | 2026-03-05 |
| NXA-1096 | Explore using ACP | Victor Savkin | 2026-03-05 |
| NXA-1091 | Test e2e experience for metadata-only workspaces | Victor Savkin | 2026-03-06 |
| NXA-1122 | General login command | Victor Savkin | 2026-03-06 |
| NXA-973 | Workspace graph not connecting when project starts with `@` | (unassigned) | 2026-03-02 |
| NXA-909 | Require "nx login" to be used and set up the agent to make you log in | Jonathan Cammisuli | 2026-03-02 |
| NXA-1013 | Add Nx and Nx examples to polygraph | Jonathan Cammisuli | 2026-03-02 |
| NXA-1011 | Repo summarization | Victor Savkin | 2026-03-02 |
| NXA-1012 | Use workspace skill for summarization | Victor Savkin | 2026-03-02 |
| NXA-1020 | Sync PR statuses | Jonathan Cammisuli | 2026-03-02 |

#### Project: Self-Healing CI - 8 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-1154 | Add `EXCLUDE_AI_CREDITS` plan modifier to MailChimp (ST), Moderna (Prod), Cloudinary (ST) | Altan Stalker | 2026-03-17 |
| NXA-1156 | Self-healing board shows generating fix after completion | Mark Lindsey | 2026-03-17 |
| NXA-1105 | Self-serve adoption: Docs and UI messaging cleanup | James Henry | 2026-03-13 |
| NXA-834 | Update Claude agent SDK to support Tasks | James Henry | 2026-03-13 |
| NXA-1021 | Blocked on zod 4 migration | James Henry | 2026-03-12 |
| NXA-782 | Add option during onboarding to open pr to enable self healing in repo | Chau Tran | 2026-03-09 |
| NXA-1098 | No permission to accept suggestion in Self Healing CI | Chau Tran | 2026-03-09 |
| NXA-1117 | Add UI messaging on existing CIPE fixes for the newly tracked `modelProviderIssueStatus` field | Mark Lindsey | 2026-03-10 |
| NXA-878 | Augment self-healing status visibility for task items | Mark Lindsey | 2026-03-05 |
| NXA-936 | Track state against fixes that were created during Anthropic issues | James Henry | 2026-03-04 |

#### Project: Workspace visibility - 5 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-897 | Add oauth integration for Azure devops | Chau Tran | 2026-03-16 |
| NXA-995 | Default workspace visibility to repository access for new workspaces | Mark Lindsey | 2026-03-12 |
| NXA-1102 | Test visibility settings in snapshot/staging | Mark Lindsey | 2026-03-11 |
| NXA-1133 | Disable org visibility in settings action if env var is set | Mark Lindsey | 2026-03-11 |
| NXA-1136 | Clean up remaining uses of organization public/private setting | Mark Lindsey | 2026-03-11 |

#### Project: CLI Agentic Experience (AX) - 5 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-1069 | [Import] test & document import gaps for @nx/gradle | Max Kless | 2026-03-12 |
| NXA-1006 | improve `nx import` AX just like cnw/init | Max Kless | 2026-03-12 |
| NXA-952 | Monitor CI skill: bail when deps/tools unavailable | Chau Tran | 2026-03-06 |
| NXA-1004 | Explore reducing CI watcher subagent background polling tasks | Chau Tran | 2026-03-06 |
| NXA-997 | Plan out robust future for /sandbox & nx | Colum Ferry | 2026-03-04 |
| NXA-1023 | Enable codex subagents once they support them | Max Kless | 2026-03-04 |

#### Project: Improve Nx Import for all plugins - 3 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-1075 | [Import] test & document import gaps for @nx/vite | Jack Hsu | 2026-03-04 |
| NXA-1061 | [Import] test & document import gaps for @nx/next | Jack Hsu | 2026-03-04 |

#### Red Panda Misc / Other - 8 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| NXA-1148 | Add a way to switch between conformance reports on cipe conformance page | Mark Lindsey | 2026-03-17 |
| NXA-1153 | Conformance step intermittently shows "Step not found" | Mark Lindsey | 2026-03-17 |
| NXA-1120 | Staging invite acceptance shows an error page | Mark Lindsey | 2026-03-17 |
| NXA-1141 | Create Dependency does not update graph for some repos | Chau Tran | 2026-03-11 |
| NXA-1138 | Update prod Github App to include Action permission | Mark Lindsey | 2026-03-10 |
| NXA-885 | Fix condensed looking UI | Mark Lindsey | 2026-03-11 |
| NXA-989 | Icon click redirects to create-nx-workspace for empty workspace | Mark Lindsey | 2026-03-09 |
| NXA-1055 | Fix settings access when VCS and Cloud roles conflict | Mark Lindsey | 2026-03-06 |
| NXA-1054 | Investigate org created with 0 admins in membership list | Mark Lindsey | 2026-03-06 |
| NXA-1116 | Claude Code worktrees need to be Nx/Git ignored | Juri Strumpflohner | 2026-03-06 |
| NXA-1030 | Nrwl admins can't edit workspace settings | Mark Lindsey | 2026-03-03 |

---

## TEAM: Quokka (Q-)

### Completed Issues (March 2026) - 22 issues

#### Project: Task Sandboxing (Input/Output Tracing) - 15 issues
| ID | Title | Assignee | Completed |
|---|---|---|---|
| Q-295 | Show compare panel for tasks without violations | Louie Weng | 2026-03-16 |
| Q-242 | Investigate memory usage for tree view | Louie Weng | 2026-03-11 |
| Q-249 | Use streaming to read and render file tree and file viewer components | Louie Weng | 2026-03-11 |
| Q-260 | List view filter should support glob patterns | Louie Weng | 2026-03-10 |
| Q-286 | Ensure that views in the sandbox analysis can be toggled via URL | Louie Weng | 2026-03-09 |
| Q-259 | File tree view: toggle violation types visibility | Louie Weng | 2026-03-09 |
| Q-277 | Show task ID in sandbox analysis view | Louie Weng | 2026-03-09 |
| Q-279 | Add timeline/conformance view for sandbox violations | Louie Weng | 2026-03-06 |
| Q-283 | Mismatch between files written count and file tree | Louie Weng | 2026-03-06 |
| Q-281 | Unexpected reads exceed total files read in sandbox report | Rares Matei | 2026-03-06 |
| Q-273 | Embed sandboxing exclusion list in Nx io-trace-daemon | Rares Matei | 2026-03-06 |
| Q-269 | Limit sandbox violations warning list and link to sorted run view | Louie Weng | 2026-03-03 |
| Q-272 | UI filtering not applied on initial load in Remix | Louie Weng | 2026-03-04 |
| Q-265 | Add run details filters for flaky and sandbox violations | (unassigned) | 2026-03-05 |
| Q-237 | handle file deletions | Rares Matei | 2026-03-04 |
| Q-266 | Remove violations tab view | Louie Weng | 2026-03-03 |
| Q-250 | Sandbox report taskId coerces special symbols to `_` | Rares Matei | 2026-03-02 |

#### Project: Gradle Plugin for Nx - 1 issue
| ID | Title | Assignee | Completed |
|---|---|---|---|
| Q-294 | Ensure that changes to version catalogs will invalidate gradle project graph cache | Louie Weng | 2026-03-12 |

#### Other
| ID | Title | Assignee | Project | Completed |
|---|---|---|---|---|
| Q-192 | Enterprise usage page credit limit blocks Clickup re-up | Altan Stalker | | 2026-03-17 |
| Q-282 | WaitingAgents should be backed by valkey | Altan Stalker | March-April 2026 Misc | 2026-03-17 |
| Q-284 | Investigate possible race condition in reconciling continuous tasks | Altan Stalker | Continuous assignment of tasks | 2026-03-10 |
| Q-274 | Conformance notifications do not send on ST | Altan Stalker | March-April 2026 Misc | 2026-03-04 |

---

## TEAM: Docs (DOC-)

### Completed Issues (March 2026) - 15 issues (some archived older)

| ID | Title | Assignee | Completed |
|---|---|---|---|
| DOC-441 | Update docs to use the latest image tag | Caleb Ukle | 2026-03-17 |
| DOC-422 | Clarify supported Storybook versions in Nx docs | (unassigned) | 2026-03-17 |
| DOC-344 | Document Docker Layer Caching | Caleb Ukle | 2026-03-17 |
| DOC-444 | nx.dev pages 404 on hard reload | Benjamin Cabanes | 2026-03-16 |
| DOC-440 | Merge self-healing auto-apply video PR after video goes live | Juri Strumpflohner | 2026-03-13 |
| DOC-439 | Fix redirect for /concepts/decisions/dependency-management | Caleb Ukle | 2026-03-12 |
| DOC-442 | Fix broken OSS cloud pricing redirect | Caleb Ukle | 2026-03-12 |
| DOC-393 | Writing style "linting" | Jack Hsu | 2026-03-06 |
| DOC-430 | Blog search missing Enterprise Task Analytics article | Jack Hsu | 2026-03-05 |
| DOC-437 | Clean up outdated version references in docs (< Nx 20) | Jack Hsu | 2026-03-04 |
| DOC-436 | Docs images broken after rewrite changes | Jack Hsu | 2026-03-04 |
| DOC-429 | Document sandboxing feature for linking from Cloud UI | Jack Hsu | 2026-03-04 |
| DOC-435 | `/docs` redirect returns 404 after cleanup changes | Jack Hsu | 2026-03-03 |
| DOC-390 | Additional Discovery Mechanisms | Jack Hsu | 2026-03-03 |
| DOC-431 | Clean-up for pages in Framer instead Next.js | Jack Hsu | 2026-03-03 |
| DOC-428 | Review all CLI and Cloud links | Jack Hsu | 2026-03-03 |
| DOC-432 | Add Cmd+K redirect from nx.dev to /docs | Benjamin Cabanes | 2026-03-03 |

---

## PROJECTS - Status & Updates

### Active Projects with March Activity

#### Task Sandboxing (Input/Output Tracing)
- **Lead**: Rares Matei
- **Teams**: Nx CLI, Quokka
- **Status**: In Progress
- **Update (Mar 6)**: Three tracks this week: (1) Jason and Craigory discovering actionable issues in sandbox reports, (2) sandbox violation count going down, (3) Louie closing UI issues rapidly. Docs now live at nx.dev/docs/features/ci-features/sandboxing. eBPF daemon performance brought under control. Exclusion list now embedded by default. Focus for next week: continue creating issues from violations, fix them, create Grafana dashboard.
- **Milestones**: Production Hardening (57%), Fix sandboxing violations (46%), Daemon uploads are stable (90%), UI Anomaly Reporting (66%), CLI shows inputs and outputs (67%)

#### Surface Level Telemetry
- **Lead**: Jason Jean
- **Teams**: Nx CLI, Docs
- **Status**: In Progress
- **Target**: 2026-03-18
- **Milestones**: Events are sent to GA (completed), Dogfooded (completed), Nx Rust exposes Telemetry bindings (completed)

#### CLI Agentic Experience (AX)
- **Lead**: Max Kless (via project update)
- **Team**: RedPanda
- **Status**: In Progress
- **Update (Mar 9)**: Many things shipped, project in clean-up mode due to shifted focus to Polygraph. `nx init`, `nx import`, and `create-nx-workspace` all had AX refactors. Benchmarks exist and performance improved. `nx import` has tech-specific skill. Monitor CI flow gets continued improvements from Chau. Decided against agentic migration in cloud platform, will focus on local `nx migrate`. Agent sandboxing alignment needed. Published AX blog post and skills migration post.

#### Polygraph AI
- **Lead**: Jonathan Cammisuli
- **Team**: RedPanda
- **Status**: In Progress
- **Description**: Cross-repository work for Claude Code agents. New API endpoint, MCP tools, workspace graph, session management, branch tracking.

#### Self-Healing CI
- **Lead**: James Henry (implied from issues)
- **Team**: RedPanda
- **Status**: In Progress
- **Notable**: Updated Claude agent SDK for Tasks, zod 4 migration unblocked, docs/UI messaging cleanup, onboarding PR option added, model provider issue tracking implemented.

#### Implement Multi-Cluster Agent Setups
- **Lead**: Steve Pentland
- **Team**: Infrastructure
- **Status**: In Progress
- **Target**: 2026-04-08
- **Update (Mar 13)**: 8% -> 16% progress. Research led to solid foundation. Facade mode audit completed, client/endpoints for controller created. Some delay due to security/pentest interrupts.

#### K8S Gateway API + L7 Load Balancing
- **Lead**: Patrick Mariglia
- **Team**: Infrastructure
- **Status**: In Progress
- **Target**: 2026-03-20
- **Update (Mar 13)**: Exploration of Gateway API vs existing ingress/ILB approach. Gateway API is more modern but doesn't solve all hoped-for problems (client attribute denial, TLS cert injection for agent pods). Terraform abstraction for GCP nearly complete. Helm chart for GCP application cluster runner almost done. AWS/Azure investigation next.

#### Allow new users to immediately opt into Team plan
- **Lead**: Benjamin Cabanes
- **Team**: Nx Cloud
- **Status**: In Progress
- **Target**: 2026-03-06
- **Update (Mar 6)**: Plan selection step built with toggle between Hobby and Team. Stripe checkout integration, PostHog analytics, usage-aware stat bars. Storybook stories for all states.

#### Feature Demos
- **Lead**: Nicole Oliver
- **Team**: Nx Cloud
- **Status**: In Progress
- **Target**: 2026-03-31
- **Description**: In-app demos of analytics, run details, CIPE details for prospects and new users.

#### Workspace Visibility
- **Team**: RedPanda
- **Status**: In Progress
- **Notable**: Azure DevOps OAuth integration added, default to repository access, org visibility setting cleanup, testing in staging.

#### Review Nx Resource Usage
- **Lead**: Leosvel Perez Espinosa
- **Team**: Nx CLI
- **Status**: Completed
- **Update (Mar 2)**: Scoped to main in-flight changes, future work will be incremental during cooldown. Profile Memory & CPU Performance 100%, Plugin Worker Shutdown 100%, Dogfooded 100%.

#### Grafana Billing Alerts
- **Lead**: szymon@nrwl.io
- **Team**: Infrastructure
- **Status**: Completed

#### IO Trace Internal Helm Chart
- **Lead**: Steve Pentland
- **Team**: Infrastructure
- **Status**: Completed

#### Bring identity portal into OpenTofu
- **Lead**: szymon@nrwl.io
- **Team**: Infrastructure
- **Status**: Completed (closed Mar 16)
- **Update**: Existing resources imported into terraform state. New AWS accounts auto-grant access.

#### Azure Hosted Redis/Valkey
- **Team**: Infrastructure
- **Status**: In Progress
- **Notable**: Auth added in workflow controller and nx-api, env vars moved for Azure tenant overrides.

### Enterprise PoVs (Sales/DPE)

#### Anaplan PoV
- **Status**: Wrapping up. ~9.5 min avg pipeline time, 2+ hrs/week saved. Business case being drafted. 12-min Jest test blocker being split. Meeting next week.

#### CIBC PoV
- **Status**: Kicked off March 1. Encryption issue resolved. Container registry set up. Contract negotiations ongoing for cross-region redundancy.

#### MNP.ca PoV
- **Status**: Remote caching live, cutting CI in half. PR comments working. Next: DTE implementation. Business value report in progress.

#### Rocket Mortgage PoV
- **Status**: At risk. MSA legal questions being worked through. InfoSec approval pending. Target pushed to April 30.

#### Cisco PoV
- **Status**: At risk. Security questionnaire complete. MSA stuck in Cisco's global procurement. No realistic kickoff date until MSA clears.

#### McGraw Hill PoV
- **Status**: Pushed to ~May. Customer completing Angular 20 upgrade, GitHub Actions fixes, module boundary improvements first. Success criteria: 20% improvement in P95 CI times.

### Customer References in Issues

- **MailChimp**: Self-healing CI plan modifier (NXA-1154), self-healing permissions fix (NXA-1098)
- **Clickup**: Enterprise usage credit limit fix (Q-192), conformance notifications fix (Q-274)
- **Moderna**: AI credits plan modifier (NXA-1154)
- **Cloudinary**: Self-healing enabled, AI credits plan modifier (NXA-1154, INF-1232)
- **Vattenfall**: Using @nx/dotnet (NXC-2753)
- **Entain**: Using @nx/dotnet (NXC-2913)
- **Caseware**: New ST instance provisioned (AWS), SAML setup, GH app (INF-1224, INF-1231, INF-1242)
- **CIBC**: SAML setup on Azure (INF-1248)
- **Legora**: Workflow runner config, SAML config, GH redirect URL (INF-1240, INF-1258, INF-1238)
- **Mimecast**: AI features toggle enabled (INF-1236)
- **Island**: Anthropic API key set (INF-792, archived)
- **Anaplan**: Nx Agents deployed (INF-1091)
- **FlutterInt**: stop-agents-after hybrid changeset fix (CLOUD-4297)
