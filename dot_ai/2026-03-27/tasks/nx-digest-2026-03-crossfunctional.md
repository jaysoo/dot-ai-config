# Nx Platform Update — March 2026

> **Data gaps:** Pylon support ticket data not included (MCP unavailable). No blog posts published in March 2026. Contact DPE for enterprise support activity.

## TL;DR

- **Task Sandboxing** is production-ready and deployed to enterprise customers (ClickUp, Legora) — the largest cross-team effort this month spanning CLI, Cloud UI, daemon infrastructure, and docs.
- **AI-Powered Development** takes a leap forward: `configure-ai-agents` now auto-detects Claude Code, Cursor, Codex, and Gemini; the new **Polygraph** product (cross-repo AI sessions) is being built with an April demo milestone.
- **Nx 22.6.0** shipped with 40+ features including jemalloc memory optimization, new telemetry system, Vite 8 support, ESLint v10 support, and batch executor improvements for JVM.
- **Security hardening** across the platform: CVE patches, pentest remediation (5 findings fixed), GitHub Actions SHA pinning, and clickjacking protection headers.
- **Onboarding improvements** in both CLI and Cloud: plan selection during signup, A/B testing of Cloud prompts, restored CNW as primary entry point in docs.

---

## Task Sandboxing & Hermetic Builds

The biggest cross-team initiative this month. Task Sandboxing uses eBPF-based IO tracing to monitor exactly which files each task reads and writes during CI, surfacing undeclared inputs and outputs that can cause cache poisoning.

**What's new for customers:**

**CLI:**
- Now properly handles batch tasks for sandboxing, includes Gradle/Maven properties in inputs, and adds `.tsbuildinfo` to dependent task outputs — eliminating many false violations.

**Cloud:**
- The **Cloud UI** received a complete overhaul of the sandbox analysis experience: timeline/conformance views showing violation trends, glob-pattern filtering, violation-type toggles, compare panels for non-violating tasks, and URL-shareable view states.
- The **io-trace daemon** is more reliable: handles file deletions/renames, embeds default exclusion lists, filters out Nx's own file reads, and fixed kernel compatibility issues.

**Infrastructure:**
- Sandboxing is now **deployed to enterprise customers** including ClickUp and all GCP single-tenant environments. Legora has sandboxing enabled on their frontend.

**Docs:**
- New **documentation page** for sandboxing, written for linking from the Cloud UI.

**Who to contact:** Rares, Louie, Craigory

---

## AI-Powered Development

Nx is becoming the bridge between AI coding agents and your monorepo. This month saw major progress on two fronts: making existing AI tools work better with Nx, and building Polygraph — a new product for cross-repo AI sessions.

**What's new for customers:**

**CLI:**
- `nx configure-ai-agents` now **auto-detects** which AI tools are in use (Claude Code, Cursor, Codex, Gemini) and sets up CLAUDE.md, `.cursor/rules`, and shared `.agents` skills directories automatically. It also runs automatically during `create-nx-workspace` and `nx init` when invoked from within an AI agent.
- The CLI outputs **JSON by default** when it detects an AI agent, improving machine readability. `nx list` gained a `--json` flag.
- New `nx polygraph` command to **initialize cross-repo AI sessions** — a first step toward the Polygraph standalone product.

**Cloud:**
- New `nx-cloud onboard` CLI command for guided workspace setup.

**Polygraph Standalone (RedPanda):**
- Being built as a separate product: backend APIs for membership, sessions, and repo/org management are functional; frontend auth, sidebar navigation, and shared UI components are in progress. **April demo milestone** is on track.

**Who to contact:** James, Max, Jonathan (Polygraph); Jason, Craigory (CLI AX)

---

## Self-Healing CI

Self-Healing CI continues to mature with improvements to how AI-generated fixes interact with real-world repository configurations.

**What's new for customers:**

**Cloud:**
- Self-Healing now **discovers and runs git hooks** (`prepare-commit-msg`, `commit-msg`) on AI-proposed commit messages before saving — respecting team commit conventions.
- Users with **allowed email domains** can now accept, reject, and revert Self-Healing suggestions (previously limited to workspace admins).
- Fixed **prettier configuration leaking** from outside the workspace, which was causing large spurious diffs in fix suggestions.
- UI improvements: better error alert styling, compact banner when AI model provider had issues during fix generation.

**Infrastructure:**
- **Self-Healing enabled for Cloudinary** (enterprise customer).

**Who to contact:** Rares, Nicole

---

## Security

**CVE Patches:**

- **CVE-2026-26996** (minimatch): Patched via bump to 10.2.4.
- **CVE cluster** (copy-webpack-plugin, koa, minimatch): Addressed in a single security sweep.
- **CVE-2025-15467** (Cloud frontend): Critical frontend vulnerability patched.
- **Nuxt 3.21.1**: Bumped to resolve critical audit vulnerability.

**Pentest Remediation (5 findings):**

- Arbitrary URL injection in org names (email phishing vector) — fixed
- Rollbar client token allowing error report injection — fixed
- Email verification not enforced — fixed
- Unauthenticated access to workspace achievements endpoint — fixed
- CI API error messages exposing internal class names — fixed

**Infrastructure Hardening:**

- All **GitHub Actions pinned to SHAs** across 5 repositories (nx, nx-cloud-helm, nx-console, cloud-infrastructure, lighthouse workflows) — prevents supply chain attacks via tag mutation.
- **Clickjacking protection headers** added to nx.dev Netlify configs.
- Shell metacharacter quoting in CLI args passed to tasks — prevents command injection.
- Removed `shellapi` from winapi feature set to minimize antivirus false positives.
- Flipt feature flag service: metrics/debug routes moved off public endpoints.

**Who to contact:** Szymon (infra security), Steve (pentest), Dillon (Cloud security)

---

## Telemetry & Analytics

A new, opt-in telemetry system shipped in Nx 22.6.0 to help the team understand how Nx is being used in the wild.

**What's new:**

**CLI:**
- Users are **prompted during workspace creation** and first Nx invocation to opt in/out.
- Collects anonymized data: command names, project graph creation time, task counts, project counts, and performance metrics.
- Session IDs persist across CLI invocations for cohesive usage analysis.

**Cloud:**
- Workspace analytics now shows **CI pipeline duration percentiles** (p5/p25/p50/p75/p95).
- PostHog integration deployed with reverse proxy, daily product usage tracking (AI credits, concurrent connections, contributors).

**Docs:**
- **Documentation page** published explaining what's collected and how to opt out.

**Who to contact:** Colum (CLI telemetry), Altan (Cloud analytics), Nicole (PostHog)

---

## Onboarding & Cloud Conversion

A concerted effort to improve the new-user experience and Cloud adoption funnel.

**What's new:**

**CLI:**
- **A/B testing** of Cloud prompt copy to improve "yes" rate on Cloud connection during `create-nx-workspace`.
- Browser **auto-opens** for Cloud setup URL after answering "yes" to Cloud prompt.
- Added **timeouts to GitHub push flow** to prevent CLI hangs during workspace connection.

**Cloud:**
- **Plan selection during onboarding** — new orgs choose between Hobby and Team plans directly in the signup flow.
- VCS organization membership now managed via **access policies** (`VCS_ORG_SYNC`) instead of direct org document storage — cleaner, more consistent access model.
- **Interactive feature demos** are in active development — design doc completed, data requirements planned for each feature. These will give new users guided, in-app walkthroughs of key Cloud capabilities. Expected to land in the next two weeks.

**Docs:**
- **Restored CNW as primary CTA** on getting-started pages (CNW starts had dropped ~30% after previous docs changes).
- Created **smaller, focused tutorials** ("Learn Nx") covering individual concepts.

**Who to contact:** Jack (docs/CNW), Nicole & Dillon (Cloud onboarding/demos), Altan (conversion data)

---

## Performance & Reliability

**CLI:**

- **jemalloc** with tuned decay timers replaces the system allocator for Nx's native module — reduces memory fragmentation in long-running daemon processes.
- **Recursive FSEvents** on macOS replaces non-recursive kqueue watchers — fixes file watching reliability issues reported by multiple users.
- **SQLite transaction retries** on `DatabaseBusy` errors — prevents DB corruption from concurrent daemon initialization.
- TUI: prevented crashes when Nx Console is connected, when task output arrives after completion, and during PTY resize events.
- Daemon: skip stale recomputations, prevent lost file changes, reduce terminal output duplication.

**Cloud:**

- **WaitingAgents backed by Valkey** — sorted set enables proper agent assignment across API restarts, fixing DTE assignment gaps reported by Celonis and Legora.
- YAML anchors/aliases now parse correctly in distribution config files.

**Infrastructure:**

- **Gateway API migration** underway — replacing cert-manager + Ingress with Kubernetes Gateway API for L7 load balancing across dev, staging, and production. Enables more flexible traffic routing and certificate management.
- **Multi-cluster agent infrastructure** — Facade controller deployed in dev for downstream workflow controller management, enabling multi-cluster DTE setups.
- **Secrets management overhaul** — app secrets split across staging and production, migrated to KVS environment variables.

**Who to contact:** Jason (CLI performance), Altan (Cloud reliability), Patrick, Steve (infrastructure)

---

## JVM Ecosystem (Gradle & Maven)

Continued investment in first-class JVM support.

**What's new:**

**CLI:**
- **Batch-safe hashing** for Maven and Gradle — ensures tasks always have hashes for DTE.
- **External Maven dependencies** now reported in the project graph.
- Gradle: properties and wrapper files included in task inputs, atomized task `dependsOn` fixed, test enums excluded from atomizer.
- Gradle: batch runner output now tees to stderr for terminal display; excludes non-JS sub-projects from ESLint plugin.
- Maven: batch runner `invoke()` synchronized to prevent concurrent access; uses mutable lists for session projects (fixes user-reported crash).

**Cloud:**
- Version catalog changes now properly invalidate Gradle project graph cache.

**Docs:**
- **"Batch mode" explained** in documentation and added to glossary.

**Who to contact:** Louie, Jason

---

## Framework & Ecosystem Support

- **Angular v21.2** support added
- **ESLint v10** support with flat config improvements
- **Vite 8** support added (with vitest v4 pinning for Yarn Classic compatibility)
- **Yarn Berry catalog** support for `nx release` and dependency management
- **Bun** false-positive loop detection resolved
- Module Federation: ESM output enabled for Angular Rspack MF plugin
- `enforce-module-boundaries` now detects `require()` calls and supports wildcard paths
- Docs: Docker Layer Caching documented as enterprise feature; Storybook version support clarified

---

## Enterprise Customer Activity

### Infrastructure Changes

- **Caseware**: New AWS single-tenant provisioned. SCIM token + access control enabled. SAML configured. GitHub app vars set up. Added to Lighthouse rotation.
- **CIBC**: SAML environment variables configured. PoV kicked off March 1 — connected to Nx Cloud, Nx Replay enablement in progress.
- **Legora**: SCIM provisioning, SAML vars, sandboxing enabled on frontend, org access configured, io-trace daemon deployed.
- **ClickUp**: IO tracing deployed, sandboxing infrastructure enabled. Credit limit issue resolved (int32 overflow).
- **Mimecast**: AI environment variables configured (Self-Healing CI access).
- **Anaplan**: Missing agent environment variables added. Agents deployed to ST cluster.
- **Cloudinary**: Self-Healing CI enabled. AI credits excluded via plan modifier.
- **Celonis/Legora**: DTE assignment gap issue resolved (WaitingAgents backed by Valkey).

### Enterprise PoV Pipeline

| Customer            | Status                                                                                       | Health    |
| ------------------- | -------------------------------------------------------------------------------------------- | --------- |
| **Anaplan**         | Budget verbally approved at $175K/130 seats. MSA in procurement. Trial expires end of March. | On Track  |
| **MNP.ca**          | PoV completed. $41,800/yr proposal shared. MSA with legal.                                   | Completed |
| **CIBC**            | PoV kicked off Mar 1. Connected to Nx Cloud. Nx Replay enablement in progress.               | On Track  |
| **McGraw Hill**     | Stalled since Feb 4 kickoff. 5 prerequisites pending. Pushed to ~May.                        | At Risk   |
| **Rocket Mortgage** | Baseline metrics received. MSA legal questions being worked. Waiting on InfoSec.             | At Risk   |
| **Cisco**           | Security questionnaire complete. MSA stuck in global procurement. No kickoff date.           | At Risk   |

---

## Docs & Developer Experience

- **New tutorials**: Smaller, concept-focused "Learn Nx" tutorials replacing monolithic walkthroughs
- **AI traffic tracking**: Server-side page view tracking using Netlify `Agent-Category` header to distinguish AI agents from crawlers
- **Search improvements**: Search ranking tuned for CLI command references, blog search indexing fixed
- **Writing style linting**: Automated style checking against the docs style guide
- **AI discovery**: Additional discovery mechanisms (robots.txt, llms.txt) for AI agents
- **Redirects/routing**: Major cleanup of Framer proxy rewrites, fixed multiple 404s on hard reload, changelog 500 error resolved

---

## Breaking Changes / Action Required

- **vitest `reportsDirectory`** now resolves against workspace root instead of project root ([#34720](https://github.com/nrwl/nx/pull/34720)). If you have custom `reportsDirectory` paths, verify they still resolve correctly after upgrading to 22.6.0.

---

## Coming Soon

- **Polygraph Standalone**: April demo milestone — cross-repo AI session management as a standalone product (RedPanda team).
- **PrivateLink Service**: AWS PrivateLink documentation and pricing research complete; GCP/Azure research underway. Will enable private connectivity for enterprise single-tenant deployments.
- **Gateway API**: Full production rollout of Kubernetes Gateway API replacing Ingress across all environments.
- **Feature Demos**: Design doc and data planning complete for interactive feature demo experiences in the Cloud UI (Nicole).
- **Nx 22.7.0**: Beta cycle underway (beta.5 published March 27).

---

## By the Numbers

| Metric                  | Count                              |
| ----------------------- | ---------------------------------- |
| CLI releases (stable)   | 4 (22.5.4, 22.6.0, 22.6.1, 22.6.2) |
| Cloud releases          | 17                                 |
| Infra commits (human)   | ~150+                              |
| Linear issues completed | ~350+ across 6 teams               |
| Blog posts              | 0                                  |
| Pentest findings fixed  | 5                                  |
| CVEs patched            | 4                                  |
| Enterprise configs      | 7 customers                        |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares, Louie, Craigory
- **AI / Polygraph**: James, Max, Jonathan, Victor, Chau
- **Self-Healing CI**: Rares, Nicole
- **Security**: Szymon, Steve, Dillon
- **Telemetry & Analytics**: Colum, Altan, Nicole
- **Onboarding & Cloud**: Jack, Nicole, Altan, Dillon
- **CLI Core / Performance**: Jason, Craigory, Leosvel
- **JVM (Gradle/Maven)**: Louie, Jason
- **Infrastructure**: Patrick, Steve, Szymon
- **Docs**: Jack, Caleb

_Generated on 2026-03-27. For the full technical changelog, see Document 2._
