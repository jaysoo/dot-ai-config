# Nx Platform Update — March 2026 (Week 1: March 1–4)

> **Data gaps:** No stable CLI release yet this month (22.6.0 in beta). No blog posts published in March yet. Linear issue-level data derived from Notion all-hands notes, Slack, and Pylon — direct Linear API not used.

## TL;DR

- **AI agent support expanded** — Codex (OpenAI) joins Claude Code and Cursor as a supported AI agent, and Polygraph AI now integrates with GitHub Actions for CI-aware sessions.
- **Self-Healing CI is now a first-class feature** — no longer labeled "experimental," with auto-apply recommendations made more prominent in the UI.
- **Native core upgraded to napi-rs v3** — removes 86 lines of unsafe Rust code and fixes a class of build-time bugs, improving long-term stability.
- **Onboarding flow restored and new PLG task force launched** — the Create Nx Workspace experience is back to its polished v22.1.3 state, and a cross-team "Quark-A" initiative is attacking activation friction end-to-end.
- **Enterprise infrastructure investments** — regional failover technical design published (targeting single-digit-minute recovery), Caseware single tenant onboarded, and Pylon is now the primary support platform for all enterprise customers.

---

## AI-Powered Development

Nx continues to be the only build system with deep AI agent integration. This month:

- **Codex subagent support** is now available in `nx configure-ai-agents`. Teams using OpenAI's Codex can now get the same zero-config Nx integration that Claude Code and Cursor users already enjoy — MCP server configuration, subagent TOML files, and version-aware setup are all handled automatically.
- **Polygraph AI** (Nx's AI-powered CI assistant) now integrates with GitHub Actions, bringing CI pipeline visibility directly into AI sessions. PR status tracking and repo summarization are available, and the team is actively dogfooding across Nx's own repos.
- The `.nx/polygraph` directory is now auto-added to `.gitignore` via a migration (runs on upgrade to 22.7) and during AI agent setup, keeping AI session artifacts out of version control.
- **Docs "Copy Prompt" feature** shipped — documentation pages now include a button to copy AI-optimized prompts, making it easier to use Nx docs with any AI coding tool.

**Questions?** Victor, Jon, James

---

## Self-Healing CI

Self-Healing CI has graduated from experimental to a **first-class Nx Cloud feature**:

- The "auto-apply" toggle for self-healing recommendations is now more prominent in the Cloud UI, making it easier for teams to opt into automatic fixes.
- Enterprise customer enablement is underway (e.g., Cloudinary enabled this week).
- Self-Healing CI is moving toward a paid tier for enterprise customers — CS is beginning those conversations ([Feb 16 All-hands](https://www.notion.so/30569f3c23878012bb79cffed36a0f09), [Tier/Plan Engagement Model](https://www.notion.so/2a369f3c2387803996a6ec89f0a17500)).

**Questions?** Victor, Jon, James

---

## Onboarding & Product-Led Growth

A new cross-team **[Quark-A task force](https://www.notion.so/31969f3c23878093acfad49fd64be54c)** was established on March 3 with a clear mandate: **remove all friction from discovering Nx → creating a workspace → activating cloud features**. The team includes leads for instrumentation, app onboarding, and Nx Agents activation.

Alongside this strategic initiative:

- The **Create Nx Workspace (CNW)** interactive flow was restored to match the polished v22.1.3 experience — the recent agentic onboarding work had introduced UI regressions (wrong prompts, missing cloud tokens, broken completion messages) that are now fixed.
- A new **Welcome View** is on staging (`staging.nx.app/welcome`), designed to guide new users through their first cloud activation steps.
- The **Framer-based website** is essentially complete (minus blog migration), and Nx will soon be fully off Vercel.

**Questions?** Nicole, Altan, Jack

---

## Workspace Visibility & Access Control

- **"Sync with repository access"** launched — workspace permissions are now automatically managed based on repository access, eliminating manual permission configuration.
- **Bitbucket OAuth** integration is complete, expanding cloud connectivity beyond GitHub and GitLab.
- Workspace visibility environment variables are rolling out to staging and dev environments.

**Questions?** Mark, Jon

---

## Task Sandboxing

The [sandboxing](https://deploy-preview-34707--nx-docs.netlify.app/docs/features/ci-features/sandboxing) initiative (hermetic task execution) continues with active dogfooding:

- Ready soon for single-tenant customers to be onboarded (must use Nx agents not manual DTEs).

- **IO-trace daemon ring buffer reduced to 512MB** on dev and staging — a tuning change to reduce memory overhead while maintaining tracing fidelity.
- The Quokka and Dolphin teams are dogfooding sandboxing on real CI pipelines, identifying and fixing edge cases with plugin interactions.
- **Continuous task assignment** is also being dogfooded — customers will need to adopt Prometheus metrics for full observability.

**Questions?** Rares, Altan, Jason

---

## Native Core & Performance

- **napi-rs migrated from v2 to v3** — this is a significant internal upgrade that removes 86 lines of unsafe Rust code (replaced with safe `Arc<T>` patterns), fixes a build-time bug with duplicate TypeScript declarations, and modernizes the Nx native module's threading model. Users won't see a feature change, but this improves long-term reliability and developer safety.
- **Deps cache writes optimized** — Nx now skips writing the dependency cache when it's already up-to-date, reducing unnecessary disk I/O.
- **TUI improvements and memory footprint reduction** continue as an ongoing effort.

**Questions?** Jason

---

## Ecosystem & Framework Support

Several fixes improve Nx compatibility across runtimes and frameworks:

- **Bun runtime**: Fixed a false-positive loop detection that prevented `bunx --bun nx` from working. Bun's async stack traces include extra frames that confused Nx's recursion guard.
- **Gradle**: Batch task runner output is now visible in the terminal (was being swallowed), fixing a significant usability gap for JVM teams.
- **Vitest**: The executor now respects custom reporter configurations from target options.
- **Angular + Rspack**: Fixed PostCSS resource path resolution and cross-platform path handling (unblocked Paylocity's upgrade to latest CLI).
- **ESLint v10**: Support landed via community contribution.
- **Package manager detection**: Improved fallback behavior when `pnpm dlx nx@latest init` was incorrectly using npm.

**Questions?** Jason

---

## Infrastructure & Reliability

- **[Regional failover technical design](https://www.notion.so/31869f3c23878166adcdf2ba7404f82b) published** (March 3) — a new architecture for automatic failover targeting single-digit-minute recovery time (down from 60–90 minutes). Aimed at banking, healthcare, and government customers with contractual failover requirements. Roughly doubles application cluster cost. Phases: infrastructure primitives → dual-region app → multi-region DB → agents mesh → production.
- **[Multi-cluster agent setups](https://www.notion.so/30369f3c2387817fbf94f38a0ffed522)** in progress (prerequisite for regional failover).
- **Grafana monitoring stack** being deployed — new Spacelift spaces, GCP IAM bindings, and cost alerting added.
- **PostHog analytics** migrated to reverse proxy setup across staging and production (NA).
- **[Caseware](https://www.notion.so/cb193389e13f428ca11338849cd6318f)** single tenant onboarded to AWS with Terraform, added to lighthouse rotation.

**Questions?** Steve, Patrick

---

## Enterprise & Customer Operations

- **Pylon is now the primary support platform** — cutover from Salesforce email completed March 2. All enterprise customers now route through Pylon for support. 50+ tickets migrated.
- **Active customer engagements**: [Legora](https://www.notion.so/26469f3c238780529e80cb076ebfe8d1) (Nx 22 upgrade + Okta SAML), [Fidelity](https://www.notion.so/4b72ec2586684cfcb4ff070dd2ddf774) (deploying latest Cloud version), [Entain](https://www.notion.so/1c2a440d9354443097762f8d347c9ea4) (monthly check-in), Paylocity (upgrade unblocked by PostCSS fix), [DNB](https://www.notion.so/31869f3c238780759bd8ca6d4923a02d) (churn review — interested in AI/self-healing/Polygraph features).
- **Support themes this week**: billing/contributor counting (3 tickets), agent/DTE issues (3 tickets), authentication/OAuth (4 tickets). An OAuth connection outage was identified and resolved on March 3.

**Questions?** Steven, Cory

---

## Breaking Changes / Action Required

None this month (no stable release yet). 22.6.0 is in beta — breaking changes, if any, will be documented at release.

Note: There will be upcoming communications about support tier changes for Self-Healing CI (moving to paid for enterprise). See [Feb 16 All-hands](https://www.notion.so/30569f3c23878012bb79cffed36a0f09) and [Tier/Plan Engagement Model](https://www.notion.so/2a369f3c2387803996a6ec89f0a17500).

---

## Coming Soon

- **22.6.0 stable release** — currently at beta.9, expected later this month.
- **[Quark-A](https://www.notion.so/31969f3c23878093acfad49fd64be54c) PLG initiative** — expect onboarding flow improvements throughout March.
- **Regional failover** — moving from design to infrastructure primitives phase.

---

## By the Numbers

| Metric                    | Count                                                          |
| ------------------------- | -------------------------------------------------------------- |
| CLI releases (beta)       | 2 (22.6.0-beta.8, beta.9)                                      |
| Cloud releases            | 2 (2603.04.2, 2603.04.3)                                       |
| Infrastructure commits    | 29 human-authored                                              |
| Pylon support tickets     | 50+ active                                                     |
| Enterprise customer syncs | 6 (Legora, Fidelity, Entain, Brain.co, McGraw Hill, Attentive) |

---

## Questions? Contact

- **AI / Polygraph / Self-Healing**: Victor, James, Jon
- **Onboarding / PLG / CNW**: Nicole, Altan
- **Sandboxing / IO Tracing**: Rares, Altan, Jason
- **Native Core / CLI**: Jason
- **Infrastructure / Reliability**: Steve, Patrick
- **Enterprise / CS**: Steven, Cory
- **Docs**: Jack, Caleb

_Generated on 2026-03-04. Early-month snapshot — Week 1 only. For the full technical changelog, see the companion document._
