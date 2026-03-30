# Nx Platform Update — March 2026

> **Data gaps:** Pylon customer support data not available (MCP not connected). No blog posts published in March. Ocean repo changelog fetched from public changelog.nx.app.

## TL;DR

- **Task Sandboxing shipped to customers** — eBPF-based I/O tracing now deployed to ClickUp, Legora, Island, and Wix. Cloud UI shows file-level violation analysis with filtering, timeline views, and glob-based exclusions. 50+ issues completed across CLI and Cloud.
- **AI-native developer experience launched** — `nx configure-ai-agents` auto-detects and sets up Claude Code, Cursor, Codex, and Gemini. Nx init and import work in agentic sandboxes. Polygraph Standalone (cross-repo conformance) entered rapid build-out with new frontend, CLI, and auth system.
- **Surface Level Telemetry is GA** — Analytics pipeline rewritten in Rust, integrated with GA4, dogfooded across nx and ocean repos. Users are prompted during workspace creation. All data is opt-out.
- **Self-Healing CI got smarter** — Now detects and runs workspace git hooks (`prepare-commit-msg`, `commit-msg`) before committing AI fixes. Access expanded to all users with allowed email domains. Error alerts and model provider notifications redesigned.
- **Major infrastructure push** — Multi-cluster agent facade controller built from scratch (22 issues). K8s Gateway API replacing nginx ingress. PrivateLink service researched for enterprise customers. All GitHub Action workflows across 5 repos now SHA-pinned.

## Task Sandboxing & Hermetic Builds

Nx can now trace every file read and write during task execution using eBPF (Linux) and report violations where tasks access files they shouldn't. This is the foundation for truly hermetic, reproducible builds.

**CLI:**

- Batch task support for sandboxing — Gradle and Maven tasks now traced correctly
- Default ignore for `**/node_modules/**` writes reduces false positives
- Signal file writing enabled automatically on CI agents
- Memory optimizations: retained data cleared after subscription, daemon memory issues resolved
- `nx show target` now displays whether a target is continuous and shows JSON by default for AI agents

**Cloud:**

- Sandbox analysis UI: file tree view with violation type toggles, glob-based filtering, compare panel for clean tasks, timeline/conformance view
- Streaming file tree rendering for large outputs
- Task ID shown in analysis view for easier debugging
- Violation badge correctly hidden when sandboxing mode is off
- Sandbox toggle enabled for single-tenant deployments via environment variable

**Infrastructure:**

- IO tracing daemon deployed to ClickUp, Legora, and all GCP single-tenant clusters
- Internal nx-api endpoint used for daemon communication (more secure)
- Default `traceTasks: ''` configuration for new deployments

**Who to contact:** Rares, Louie, Craigory

---

## AI-Powered Development

Nx is becoming the bridge between AI coding tools and monorepo intelligence. This month shipped first-class integrations with every major AI coding assistant, plus a new standalone conformance product.

**CLI:**

- `nx configure-ai-agents` auto-detects Claude Code, Cursor, Codex, and Gemini — sets up MCP server, AGENTS.md, and tool configs automatically
- Agentic mode added to `nx init` and `nx import` — works inside AI sandbox environments
- `.claude/worktrees` and `.claude/settings.local.json` added to gitignore by default
- `.agents` skills directory shared across Codex, Cursor, and Gemini
- `nx list` gains `--json` flag for better AI tool consumption
- PLUGIN.md files updated to help agents verify plugin capabilities
- `nx show target` outputs JSON by default when running inside an AI agent

**Cloud:**

- Self-Healing CI now runs workspace git hooks (`prepare-commit-msg`, `commit-msg`) before committing AI-generated fixes — fixes no longer violate conventional commit rules or linting hooks
- Access to accept/reject/revert Self-Healing CI suggestions expanded to all users with allowed email domains
- Error alerts redesigned with compact notification banners for model provider issues
- Self-Healing CI task summary data sanitized to prevent invalid character issues

**Docs:**

- AI traffic tracking: server page views now tagged with Netlify-Agent-Category header
- AI discovery mechanisms documented (AGENTS.md, MCP, PLUGIN.md)
- Self-healing auto-apply video merged after video went live

**Who to contact:** James, Jonathan, Max, Jack

---

## Performance & Reliability

Significant under-the-hood improvements to memory usage, daemon stability, and build correctness.

**CLI:**

- **jemalloc with tuned decay timers** replaces system allocator for native module — reduces memory fragmentation in long-running daemon processes
- **macOS file watching fixed**: switched from non-recursive kqueue to recursive FSEvents — resolves missed file change events on macOS
- Daemon: stale socket cleanup, skip stale recomputations, prevent lost file changes
- TUI: crash prevention when Nx Console connected, output deduplication, scroll-offset scrollbar, help text layout fix
- SQLite: retry entire transaction on DatabaseBusy, upsert for FK constraint prevention, prevent DB corruption from concurrent init
- Plugin cache: safe write utilities with LRU eviction, per-invocation cache for TS plugin
- `--parallel` limit now correctly respected for discrete task concurrency
- napi-rs upgraded from v2 to v3

**Who to contact:** Jason, Craigory, Leosvel

---

## Security

Multiple security remediations across the platform, driven by both proactive audits and external penetration testing.

**CLI:**

- CVE-2026-26996 (minimatch ReDoS) patched via bump to 10.2.4
- CVE cluster addressed: copy-webpack-plugin, koa, serialize-javascript
- Nuxt bumped to 3.21.1 to resolve critical audit vulnerability
- Shell metacharacters now properly quoted in CLI args passed to tasks (command injection fix)
- `windowsHide: true` set on all child process spawns (reduces attack surface on Windows)
- Clickjacking protection headers added to all Netlify configs

**Cloud:**

- 5 penetration test findings remediated: Rollbar client token injection, email verification enforcement, unauthenticated achievements endpoint, sensitive session cookie data, arbitrary URL as org
- Frontend critical CVE-2025-15467 patched
- `/nx-cloud/private` routes now return 404 (no longer exposing internal endpoints)

**Infrastructure:**

- All GitHub Action workflows across 5 repos (nx, nx-cloud-helm, nx-console, cloud-infrastructure, lighthouse) now pin to SHA instead of version tags — prevents supply chain attacks via tag mutation
- IAM access key rotation completed (Vanta compliance)

**Who to contact:** Jack, Nicole, Szymon, Altan

---

## Onboarding & Growth

Major effort to recover the CNW (Create Nx Workspace) funnel after a 30% conversion drop, plus the launch of usage telemetry.

**CLI:**

- CNW user flow restored to match proven v22.1.3 conversion baseline
- Cloud prompts and templates brought back with explicit opt-out option
- Auto-open browser for Cloud setup URL during workspace creation
- A/B testing cloud prompt copy for optimization
- Template shorthand names added for non-interactive mode
- Better error handling: graceful missing package manager, SANDBOX_FAILED surface, malformed nx.json

**Cloud:**

- Plan selection (Hobby vs. Team) during initial onboarding setup
- `nx-cloud onboard` CLI command added
- One-page "connect workspace" flow tested on GitLab staging
- GitHub app configuration guidance improved with descriptive warnings
- VCS organization access now managed through access policies with OAuth sync
- Verify email UI refreshed

**Telemetry (shipped to GA):**

- Analytics pipeline: GA4 integration with Rust bindings for performance
- Tracks: command name, project graph creation time, task/project counts, perf metrics
- Opt-out prompt during CNW and first Nx invocation
- Session ID persisted across CLI invocations
- Dogfooded in both nx and ocean repos
- Telemetry documentation published on nx.dev

**Who to contact:** Jack, Jason, Nicole, Colum

---

## JVM Ecosystem (Gradle & Maven)

Continued investment in making Nx the best monorepo tool for JVM projects.

**CLI:**

- **Maven external dependencies** now reported in the project graph — Maven projects show their dependency tree alongside JS projects
- Batch-safe hashing for both Maven and Gradle — fixes incorrect cache hits in CI
- Gradle: properties and wrapper files added to task inputs, atomizer no longer picks up test enums or annotation files
- Gradle: handles project names containing `.json` substring, always checks disk cache for project graph reports
- Maven: synchronized batch runner prevents concurrent access crashes, mutable lists fix for session projects

**Who to contact:** Louie, Jason, Craigory

---

## Infrastructure & Scale

The infrastructure team delivered foundational work for multi-cluster CI and modern load balancing.

**Multi-Cluster Agent Setups (22 issues):**

- Built a complete facade controller from scratch — routes workflows to downstream agent clusters based on capabilities
- Workflow routing engine with capability-based downstream filtering
- Controller discovery API with check-in goroutine for health monitoring
- Deployed to dev GCP with Helm chart, facade client, and proper IAM
- This enables customers to run different agent types (GPU, high-memory, ARM) in separate clusters

**K8s Gateway API (7 issues):**

- Replacing nginx ingress with Kubernetes Gateway API across environments
- GCP Gateway API with TLS termination and cert-manager integration
- External-DNS for automatic DNS record management
- Deployed to dev and staging, preparing for production rollout

**Other:**

- **PrivateLink**: AWS docs written, cost estimation complete, GCP/Azure research done
- **Secrets management**: Dev/staging/prod secrets split into separate files for better access control
- **Valkey**: All environment variables aliased from Redis naming to Valkey naming
- **Azure Redis**: Auth added to both nx-api and workflow controller
- **Grafana**: Billing alerts configured via Spacelift, cost monitoring active
- **Identity portal**: Existing SSO resources imported into OpenTofu, IAM automation for new AWS accounts

**Customer deployments:** New Caseware ST instance (AWS), CIBC SAML, Legora SAML + GH app, Mimecast AI features, Cloudinary self-healing

**Who to contact:** Steve, Patrick, Szymon

---

## Polygraph / Cross-Repo Conformance

Polygraph is being extracted into a standalone product for cross-repository conformance checking.

**New this month (21 issues):**

- New frontend application initialized with theme system and error handling
- Frontend authentication (public mode) with multiple auth strategies
- Kotlin backend: org/repo access checking, session management, membership management
- CLI published via automated pipeline
- GitHub App created for repository integration
- Data models refactored: MongoUser lifted to shared libs, VCS organization access redesigned
- Azure DevOps OAuth integration added for workspace visibility

**Infrastructure:**

- Polygraph deployed to dev environment with mongo, ingress, DNS, and secrets
- Dedicated namespace with external-dns and cert-manager

**Who to contact:** Victor, Chau, Jonathan, James

---

## Ecosystem & Framework Support

**CLI:**

- **Vite 8** support added (22.6.2)
- **Angular 21.2** support: signal forms, arrow functions in templates, exhaustive switch checks
- **ESLint v10** support with improved flat config conversion
- **Yarn Berry catalog** support for dependency management
- **pnpm catalog** references when fixing missing dependencies
- **Bun** environment support in release-publish executor, false positive loop detection fixed
- Dependency filesets with `^{projectRoot}` syntax for cross-project file inputs
- Negation pattern support for plugin include/exclude
- `NX_SKIP_FORMAT` environment variable to skip Prettier formatting

**Who to contact:** Leosvel, Jack, Craigory

---

## Documentation & Developer Experience

**Docs team (Jack & Caleb):**

- Blog and changelog extracted into standalone nx-blog Astro site
- Tutorials rewritten to be smaller and more focused
- Search improvements: wider dialog, better ranking, cross-site link checks
- Redirect system migrated from Next.js config to Netlify \_redirects
- Batch mode documentation clarified
- Docker layer caching documented
- Sandboxing feature documented for Cloud UI linking
- Storybook version support clarified
- Outdated version references (< Nx 20) cleaned up

**Who to contact:** Jack, Caleb

---

## Breaking Changes / Action Required

None this month. The 22.6.0 release is feature-heavy but backward-compatible.

**Note:** The analytics prompt during `create-nx-workspace` and first `nx` invocation is new — users will see an opt-in/opt-out question. This is not a breaking change but may surprise automated scripts. Use `--skipAnalytics` or set `NX_SKIP_ANALYTICS=true` to suppress.

---

## Coming Soon

- **Nx 22.7.0** — Currently in beta with vitest mode fixes, maven enhancements, sandbox improvements, MF graph caching fix, Playwright tsconfig hashing fix
- **nx migrate Revamp** — Spikes in progress (17% complete), will modernize the migration experience
- **Multi-cluster production** — Facade controller moving from dev to staging/production
- **Gateway API production rollout** — Dev and staging complete, production next
- **Polygraph public beta** — Frontend, CLI, and backend foundations complete; targeting public availability soon
- **Node 20 EOL preparation** — EOL April 30; planning deprecation messaging for Nx 23

---

## By the Numbers

| Metric                  | Count                                      |
| ----------------------- | ------------------------------------------ |
| CLI stable releases     | 5 (22.5.4, 22.6.0, 22.6.1, 22.6.2, 22.6.3) |
| Cloud releases          | 17                                         |
| Linear issues completed | 328 across 6 teams                         |
| — Nx CLI (NXC)          | 97                                         |
| — Nx Cloud (CLOUD)      | 32                                         |
| — Infrastructure (INF)  | ~80                                        |
| — RedPanda (NXA)        | 50                                         |
| — Quokka (Q)            | 36                                         |
| — Docs (DOC)            | 33                                         |
| Projects completed      | 8                                          |
| Pylon support tickets   | N/A (not connected)                        |
| Blog posts published    | 0                                          |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares, Louie, Craigory
- **AI / Agentic Experience / Self-Healing CI**: James, Jonathan, Max
- **Polygraph / Conformance**: Victor, Chau, Jonathan
- **Onboarding & Growth / CNW**: Jack, Jason, Nicole
- **Telemetry**: Colum, Jason
- **JVM (Gradle / Maven)**: Louie, Jason, Craigory
- **Infrastructure / Multi-Cluster / Gateway API**: Steve, Patrick, Szymon
- **Security**: Jack, Nicole, Szymon, Altan
- **CLI Core / Performance**: Jason, Leosvel, Craigory
- **Cloud UI / Features**: Nicole, Benjamin, Chau
- **Documentation**: Jack, Caleb

_Generated on 2026-03-30. For the full technical changelog, see `nx-digest-2026-03-changelog.md`._
