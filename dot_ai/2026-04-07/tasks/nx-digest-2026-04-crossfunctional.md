# Nx Platform Update — April 2026 (Week 1: Apr 1-7)

> **Data gaps:** Partial month (7 days). Blog post on synthetic monorepos scheduled for April 8 but not yet live.

## TL;DR

- **Polygraph Standalone is sprinting toward its April demo** — 24 issues completed this week across onboarding, VCS connection, CLI, and UI polish. Cursor 3 extensibility investigation started.
- **Security response was fast** — Axios CVE-2026-25639 patched within 24 hours, picomatch CVE fixed, ejs pinned, and 4 critical Polygraph frontend CVEs remediated. Multiple customer inquiries handled same-day.
- **Infrastructure completed the Multi-Cluster Agent Setups project** — facade observability, Prometheus metrics, and trace propagation are all live. EU Provider research also wrapped.
- **CNW onboarding A/B test has a winner** — Variant 1 ("remote cache" prompt) won with a 63% lift in cloud conversion. Locked in as new baseline with two new variants designed.
- **Self-Healing CI improvements** — Git trailers no longer incorrectly attribute automated rerun commits to original committers. Enterprise billing for self-healing rolled out.

## Polygraph Standalone

The biggest area of activity this week. The Red Panda team completed 24 issues pushing toward the April Demo milestone — this product is moving fast.

**Cloud:**

- Full onboarding flow: org creation, repository connection, VCS account linking
- Sidebar and error boundary UI polish
- PR status updates now working
- VCS connection removal capability added
- URLs updated from snapshot to production endpoints

**CLI:**

- `polygraph-cli` help text and default URL updated
- Session folder handling improved (starts in session folder, not repo root)
- Session list now correctly shows completed sessions
- Repo selection filtering added

**AI/Tooling:**

- Polygraph Claude plugin published without `nx` naming (standalone branding)
- Investigation into Cursor 3 extensibility for Polygraph sessions started (Max)

**Who to contact:** Victor, Jonathan, Chau, Max

## Security & Supply Chain

Fast response across multiple vectors this week. Important for customer conversations — we patched everything within 24 hours.

**CLI:**

- Axios bumped to 1.13.5 to resolve CVE-2026-25639 ([#35148](https://github.com/nrwl/nx/pull/35148))
- ejs pinned to 5.0.1 ([#35157](https://github.com/nrwl/nx/pull/35157))
- picomatch bumped from 4.0.2 to 4.0.4 ([#35081](https://github.com/nrwl/nx/pull/35081))
- postcss-loader bumped to eliminate transitive yaml@1.x CVE ([#35028](https://github.com/nrwl/nx/pull/35028))

**Cloud:**

- 4 critical Polygraph frontend CVEs remediated (CVE-2025-68121, CVE-2024-24790, CVE-2023-24540, CVE-2023-24538)

**Support activity:**

- Multiple customer inquiries about Axios supply chain attack handled same-day (Pylon #525, #524)
- Customer asked about nx-console vector attack reproduction — on hold for investigation (Pylon #584)

**Who to contact:** Craigory, Chau, Steve

## Infrastructure & Reliability

Infrastructure team was the standout this week — completed two projects and started a third.

**Completed: Multi-Cluster Agent Setups**

- Facade layer observability fully instrumented
- Per-downstream request latency Prometheus metrics live
- Workflow mapping Valkey hit/miss metrics added
- Trace context propagation through facade-to-downstream RPCs
- Facade runner reviewed for interface/module extraction

**Completed: EU Provider Research**

- Cloud provider options documented for European single-tenant deployments

**Started: Istio Integration**

- Initial planning docs created

**Cloud:**

- Agent image validation improved — invalid/mis-typed images now eagerly rejected (2604.07.7)
- SCIM compatibility improved for enterprise SSO provisioning (2604.07.8)
- CIBC SAML certificate updated in production

**Who to contact:** Steve, Szymon, Patrick

## Self-Healing CI

Improvements to attribution accuracy and enterprise rollout.

**Cloud:**

- Git trailers (Signed-off-by, Co-authored-by) now stripped from automated rerun commits (2604.02.3). Previously, flaky task reruns were incorrectly attributed to the original committer.
- Loading spinner added for slow self-healing overview filters

**Enterprise:**

- Enterprise billing for self-healing rolled out — existing enterprises notified of Q2 payment requirement
- Customer enablement requests handled (Pylon #523)
- Self-healing comments missing during agent installation — investigated and resolved (Pylon #602)

**Who to contact:** James, Mark

## Onboarding & Cloud Conversion

**CLI:**

- CNW A/B test winner locked in: Variant 1 ("remote cache" prompt) won with 63% lift in cloud conversion. Two new variants designed for next round.
- `nx migrate --no-interactive` no longer incorrectly prompts for cloud setup
- Template shorthand names added for CNW

**Cloud:**

- CLI onboarding error remediation steps added (2604.01.1)
- `CLAUDECODE=1` environment variable no longer breaks onboarding flow (2604.01.1)
- Missing guidance when GitHub app lacks permissions — now surfaced clearly

**Docs:**

- `nx-cloud onboard` command documented
- `nx connect` flow documented for agentic onboarding

**Who to contact:** Jack, Dillon, Caleb

## AI-Powered Development

**CLI:**

- `configure-ai-agents` now cleans up legacy `.gemini/skills` directories ([#35117](https://github.com/nrwl/nx/pull/35117))
- Claude Code environment detection fixed so it doesn't break Nx Cloud flows

**Cloud:**

- Polygraph Claude plugin published as standalone (not under `nx` namespace)
- Cursor 3 extensibility investigation started for Polygraph sessions

**Docs:**

- Upcoming webinar: "AI Tools Underperforming? Synthetic Monorepos Could Be The Fix" (April 8) — Victor and Juri

**Support:**

- Customer MCP access token configuration issue resolved (Pylon #622)

**Who to contact:** Max, Victor, Juri

## Ecosystem & Framework Support

**CLI:**

- React Router: Force Vite 7 in framework mode to avoid peer dep conflicts ([#35101](https://github.com/nrwl/nx/pull/35101))
- Vite 8: vitest and plugin-react-swc versions updated for compat ([#35062](https://github.com/nrwl/nx/pull/35062))
- Vite 8: sass version bumped for Vue/Nuxt presets ([#35073](https://github.com/nrwl/nx/pull/35073))
- esbuild: bumped for new projects to be Vite 8 compatible ([#35132](https://github.com/nrwl/nx/pull/35132))
- Gradle: project graph timeout defaults increased ([#35058](https://github.com/nrwl/nx/pull/35058))
- Gradle/Maven: daemon accumulation during graph recalculation prevented ([#35143](https://github.com/nrwl/nx/pull/35143))
- TypeScript: `tsgo` recognized in dependency-checks lint rule ([#35048](https://github.com/nrwl/nx/pull/35048))
- tsc build-base outputs narrowed to only tsc-produced file types ([#35041](https://github.com/nrwl/nx/pull/35041), [#35086](https://github.com/nrwl/nx/pull/35086))

**Who to contact:** Leosvel, Craigory, Jason

## Task Sandboxing

The CLI team resolved 5 issues to fix lint and build violations exposed by sandboxing enforcement on the Nx repo itself.

**CLI:**

- ESLint task violations fixed for nx-dev-e2e
- pnpm-lock lint violations fixed
- Build artifacts excluded from ESLint tasks
- nx-examples e2e task issues investigated and resolved

**Who to contact:** Leosvel, Craigory, Rares

## Breaking Changes / Action Required

None this month.

## Coming Soon

- **Polygraph April Demo** — onboarding + session UI ready for stakeholder review
- **CNW/Init Funnel target: April 10** — new A/B variants launching
- **Nx Local Dist Migration** — Jason, overdue from April 3
- **.NET and Maven support** — target April 10
- **Lighthouse MongoDB connections** — Patrick, target April 24
- **Blog: Synthetic Monorepos webinar** — April 8

## By the Numbers

| Metric                   | Count                          |
| ------------------------ | ------------------------------ |
| CLI releases             | 2 (1 stable, 1 beta)           |
| Cloud releases           | 4                              |
| Linear issues completed  | ~58 across 6 teams             |
| Pylon support tickets    | 55 across ~30 accounts         |
| Infra projects completed | 2 (Multi-Cluster, EU Provider) |

## Questions? Contact

- **Polygraph Standalone**: Victor, Jonathan, Chau, Max
- **Security / Supply Chain**: Craigory, Chau, Steve
- **Infrastructure**: Steve, Szymon, Patrick
- **Self-Healing CI**: James, Mark
- **Onboarding / CNW**: Jack, Dillon
- **AI / Agentic**: Max, Victor
- **Ecosystem / Frameworks**: Leosvel, Craigory, Jason

_Generated on 2026-04-07. For the full technical changelog, see the changelog document._
