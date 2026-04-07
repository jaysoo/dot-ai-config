# Nx Platform Changelog — April 2026 (Week 1: Apr 1-7)

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear, Pylon support tickets.
> **Data gaps:** Partial month (7 days). Pylon account names included for internal use.

## Polygraph Standalone

### Cloud / Red Panda

- Implement correct resumability ([NXA-1175](https://linear.app/nxdev/issue/NXA-1175)) — Victor
- Add onboarding of new organizations and repositories ([NXA-1184](https://linear.app/nxdev/issue/NXA-1184)) — Chau. Milestone: April Demo - UI Ready
- Prompt user to connect VCS account if not added yet ([NXA-1185](https://linear.app/nxdev/issue/NXA-1185)) — Chau. Milestone: April Demo - UI Ready
- Migrate existing polygraph screens to shared libs ([NXA-1183](https://linear.app/nxdev/issue/NXA-1183)) — Jonathan. Milestone: April Demo - UI Ready
- MWorkflows data model split ([NXA-1210](https://linear.app/nxdev/issue/NXA-1210)) — Altan
- Add vcsAccount.source NX_CLOUD check ([NXA-1218](https://linear.app/nxdev/issue/NXA-1218)) — Chau
- [CLI] Add filtering to repo selection ([NXA-1219](https://linear.app/nxdev/issue/NXA-1219)) — James
- Polish and harden onboarding UIs ([NXA-1215](https://linear.app/nxdev/issue/NXA-1215)) — Chau
- Polish onboarding UI ([NXA-1217](https://linear.app/nxdev/issue/NXA-1217)) — Chau
- Polish polygraph login UI ([NXA-1216](https://linear.app/nxdev/issue/NXA-1216)) — Chau
- Add select all button for repository selection ([NXA-1231](https://linear.app/nxdev/issue/NXA-1231)) — Chau
- Update polygraph-cli help text and default URL ([NXA-1230](https://linear.app/nxdev/issue/NXA-1230))
- Investigate personal GitHub account connection flow ([NXA-1234](https://linear.app/nxdev/issue/NXA-1234)) — Chau
- GitHub app uninstall leaves org connection UI inconsistent ([NXA-1233](https://linear.app/nxdev/issue/NXA-1233)) — Chau
- Connect repositories shows all org repositories ([NXA-1236](https://linear.app/nxdev/issue/NXA-1236)) — Chau
- Clarify org onboarding vs access policy behavior ([NXA-1238](https://linear.app/nxdev/issue/NXA-1238)) — Chau
- Victor cannot see the `polywhal` org ([NXA-1237](https://linear.app/nxdev/issue/NXA-1237)) — Chau
- Improve error boundary styling on existing screens ([NXA-1239](https://linear.app/nxdev/issue/NXA-1239)) — Chau
- Sidebar gets scrolled off the screen ([NXA-1240](https://linear.app/nxdev/issue/NXA-1240)) — Chau
- Polygraph standalone URLs still point to snapshot ([NXA-1246](https://linear.app/nxdev/issue/NXA-1246)) — Jonathan
- Agent logs are not uploaded in sessions ([NXA-1248](https://linear.app/nxdev/issue/NXA-1248))
- PR statuses do not update ([NXA-1250](https://linear.app/nxdev/issue/NXA-1250))
- Start session in session folder instead of repo root ([NXA-1251](https://linear.app/nxdev/issue/NXA-1251)) — Max
- `polygraph-cli session list` shows completed sessions ([NXA-1243](https://linear.app/nxdev/issue/NXA-1243)) — Max
- Ability to remove VCS connection ([NXA-1259](https://linear.app/nxdev/issue/NXA-1259)) — Chau
- Investigate Cursor 3 extensibility for Polygraph sessions ([NXA-1262](https://linear.app/nxdev/issue/NXA-1262)) — Max
- Publish polygraph Claude plugin without `nx` naming ([NXA-1145](https://linear.app/nxdev/issue/NXA-1145)) — Max
- Polygraph "Polyr" standalone CLI ([NXA-1137](https://linear.app/nxdev/issue/NXA-1137)) — James

## Security & Supply Chain

### CLI

- Bump axios to 1.13.5 to resolve CVE-2026-25639 ([#35148](https://github.com/nrwl/nx/pull/35148)) — 22.7.0-beta.10
- Update and pin ejs to 5.0.1 ([#35157](https://github.com/nrwl/nx/pull/35157)) — 22.7.0-beta.10
- Bump picomatch from 4.0.2 to 4.0.4 ([#35081](https://github.com/nrwl/nx/pull/35081)) — 22.6.4
- Pin version of axios ([#35093](https://github.com/nrwl/nx/pull/35093)) — 22.6.4
- Bump postcss-loader to ^8.2.1 to eliminate transitive yaml@1.x CVE ([#35028](https://github.com/nrwl/nx/pull/35028)) — 22.6.4

### Red Panda

- Vulnerability CRITICAL [10.0] — Polygraph Frontend CVE-2025-68121 ([NXA-1220](https://linear.app/nxdev/issue/NXA-1220)) — Chau
- Vulnerability CRITICAL [9.8] — Polygraph Frontend CVE-2024-24790 ([NXA-1223](https://linear.app/nxdev/issue/NXA-1223)) — Chau
- Vulnerability CRITICAL [9.8] — Polygraph Frontend CVE-2023-24540 ([NXA-1222](https://linear.app/nxdev/issue/NXA-1222)) — Chau
- Vulnerability CRITICAL [9.8] — Polygraph Frontend CVE-2023-24538 ([NXA-1221](https://linear.app/nxdev/issue/NXA-1221)) — Chau

### Pylon

- #525: Security Incident — Supply Chain Attack (Axios v1.14.1) inquiry — closed same-day
- #524: NX breach: affected versions and organizational impact — customer inquiry
- #584: Vector attack reproduction in nx-console — on hold for investigation

## Infrastructure & Reliability

### Infrastructure

- Facade Observability & Metrics ([INF-1147](https://linear.app/nxdev/issue/INF-1147)) — Steve. Parent issue completed.
- Add per-downstream request latency Prometheus metrics ([INF-1175](https://linear.app/nxdev/issue/INF-1175)) — Steve
- Add workflow mapping Valkey hit/miss metrics ([INF-1177](https://linear.app/nxdev/issue/INF-1177)) — Steve
- Propagate trace context through facade-to-downstream RPCs ([INF-1178](https://linear.app/nxdev/issue/INF-1178)) — Steve
- Review facade runner for interface/module extraction opportunities ([INF-1272](https://linear.app/nxdev/issue/INF-1272)) — Steve
- Research possible EU cloud providers ([INF-1308](https://linear.app/nxdev/issue/INF-1308)) — Szymon
- Create doc for EU cloud providers research ([INF-1310](https://linear.app/nxdev/issue/INF-1310)) — Szymon
- Istio integration: create initial plan docs ([INF-1314](https://linear.app/nxdev/issue/INF-1314)) — Steve
- Infrastructure change for Polygraph routing ([INF-1312](https://linear.app/nxdev/issue/INF-1312)) — Szymon
- Infrastructure change for Polygraph GitHub secrets ([INF-1311](https://linear.app/nxdev/issue/INF-1311)) — Steve
- Request for Change to Environment for CIBC — SAML cert update ([INF-1319](https://linear.app/nxdev/issue/INF-1319)) — Patrick

### Infrastructure Commits

- `33c5d572` chore(enterprise, azure): Bump FE Pod limit to 1 core to match other envs — Patrick (04/07)
- `1c8085da` chore(argo,dev): add workflow-controller-west1.yaml to argo writeback for dev — Altan (04/07)
- `ade8a948` chore(dev, wf-west): manually update image tag to 2604.06.6 — Altan (04/07)

### Cloud

- Eagerly reject invalid/mis-typed agent images (2604.07.7)
- Improved SCIM compatibility — resolve users and group members using external IDs and legacy identifiers (2604.07.8)
- Add missing index on `ciPipelineExecutions` ([CLOUD-4411](https://linear.app/nxdev/issue/CLOUD-4411)) — Nicole. Production slow query fix.
- Remove broken users from Caseware ST instance ([CLOUD-4407](https://linear.app/nxdev/issue/CLOUD-4407)) — Altan. DPE.

## Self-Healing CI

### Cloud

- Strip Git trailers from rerun commit messages (2604.02.3). Self-Healing CI previously retained `Signed-off-by` and `Co-authored-by` trailers in automated rerun commits.
- Show loading spinner for slow self-healing overview filters ([NXA-1166](https://linear.app/nxdev/issue/NXA-1166)) — Mark

### Red Panda

- Make enterprise clients pay for self-healing ([NXA-1009](https://linear.app/nxdev/issue/NXA-1009)) — James
- Ensure all existing enterprises informed of paying for self-healing from Q2 ([NXA-1106](https://linear.app/nxdev/issue/NXA-1106)) — James

### Pylon

- #523: Self-Healing CI feature enablement request
- #602: Self-healing comments missing during agent installation — investigated

## Onboarding & Cloud Conversion

### CLI

- CNW: Lock in variant 1 as new baseline, design two new A/B variants ([NXC-4190](https://linear.app/nxdev/issue/NXC-4190)) — Jack. FV1 ("remote cache" prompt) won with 63% lift.
- `nx migrate --no-interactive` still prompts for cloud ([NXC-4177](https://linear.app/nxdev/issue/NXC-4177)) — Craigory. Fixed.
- Handle non-interactive mode and add template shorthand names for CNW ([#35045](https://github.com/nrwl/nx/pull/35045)) — 22.6.4
- Handle "." and absolute paths as workspace name in CNW ([#35083](https://github.com/nrwl/nx/pull/35083)) — 22.6.4
- Validate bundler option for Angular presets in CNW ([#35074](https://github.com/nrwl/nx/pull/35074)) — 22.6.4
- Update nx init telemetry meta from CSV to JSON format ([#35076](https://github.com/nrwl/nx/pull/35076)) — 22.6.4

### Cloud

- Add remediation steps for onboarding CLI errors (2604.01.1)
- `CLAUDECODE=1` no longer exits early (2604.01.1)
- Missing guidance when GitHub app lacks permissions ([CLOUD-4402](https://linear.app/nxdev/issue/CLOUD-4402)) — Dillon

### Docs

- Document `nx-cloud onboard` command ([DOC-451](https://linear.app/nxdev/issue/DOC-451)) — Dillon
- Document new `nx connect` flow for agentic onboarding ([DOC-412](https://linear.app/nxdev/issue/DOC-412)) — Caleb

### Pylon

- #590: Release schedule for NX Cloud images (Ubuntu 22.04 Node 20.11 vs Node 22) — waiting on customer
- #600: Credits usage explanation for trial period
- #628: Cloud credits and licenses usage projections review

## AI-Powered Development

### CLI

- Clean up legacy .gemini/skills during configure-ai-agents ([#35117](https://github.com/nrwl/nx/pull/35117)) — 22.7.0-beta.10

### Cloud

- `CLAUDECODE=1` environment variable no longer breaks Nx Cloud onboarding (2604.01.1)

### Red Panda

- Publish polygraph Claude plugin without `nx` naming ([NXA-1145](https://linear.app/nxdev/issue/NXA-1145)) — Max
- Investigate Cursor 3 extensibility for Polygraph sessions ([NXA-1262](https://linear.app/nxdev/issue/NXA-1262)) — Max

### Pylon

- #622: Access token configuration for MCP review failures — resolved

## Ecosystem & Framework Support

### CLI

- Force Vite 7 when using React Router in framework mode ([#35101](https://github.com/nrwl/nx/pull/35101)) — 22.6.4
- Update vitest and plugin-react-swc versions for Vite 8 compat ([#35062](https://github.com/nrwl/nx/pull/35062)) — 22.6.4
- Bump sass version for Vue/Nuxt presets for Vite 8 compat ([#35073](https://github.com/nrwl/nx/pull/35073)) — 22.6.4
- Bump esbuild for new projects to be Vite 8 compatible ([#35132](https://github.com/nrwl/nx/pull/35132)) — 22.7.0-beta.10
- Increase Gradle project graph timeout defaults ([#35058](https://github.com/nrwl/nx/pull/35058)) — 22.6.4
- Prevent Gradle and Maven daemon accumulation during project graph recalculation ([#35143](https://github.com/nrwl/nx/pull/35143)) — 22.7.0-beta.10
- Recognize tsgo in dependency-checks lint rule ([#35048](https://github.com/nrwl/nx/pull/35048)) — 22.6.4
- Narrow tsc build-base outputs to only tsc-produced file types ([#35041](https://github.com/nrwl/nx/pull/35041), [#35086](https://github.com/nrwl/nx/pull/35086)) — 22.6.4

## Task Sandboxing

### CLI

- Investigate tsc targets on the nx repo ([NXC-4173](https://linear.app/nxdev/issue/NXC-4173)) — Leosvel
- Fix `nx-dev-e2e:lint` violations ([NXC-4186](https://linear.app/nxdev/issue/NXC-4186)) — Leosvel
- Fix `lint-pnpm-lock` violations ([NXC-4184](https://linear.app/nxdev/issue/NXC-4184)) — Leosvel
- Ignore build artifacts from ESLint tasks ([NXC-4183](https://linear.app/nxdev/issue/NXC-4183)) — Leosvel
- Investigate nx-examples e2e task issues ([NXC-4122](https://linear.app/nxdev/issue/NXC-4122)) — Craigory

### Pylon

- #607: Sandboxing feature proposal — customer request, on hold

## Miscellaneous

### CLI

- Add weekly cooldown and cycle reminder message ([NXC-4143](https://linear.app/nxdev/issue/NXC-4143)) — Jack
- Revert PR 34917 changes and surface report errors ([NXC-4111](https://linear.app/nxdev/issue/NXC-4111)) — Craigory
- Re-add Slack webhook URL for nightlies and releases ([NXC-4181](https://linear.app/nxdev/issue/NXC-4181)) — Jack
- Reduce published nx package size with files allowlist ([#35109](https://github.com/nrwl/nx/pull/35109)) — 22.7.0-beta.10
- Improve migrate error reporting ([#34980](https://github.com/nrwl/nx/pull/34980)) — 22.7.0-beta.10
- Display actual error message when plugin loading fails ([#35138](https://github.com/nrwl/nx/pull/35138)) — 22.7.0-beta.10
- Copy pnpm install configuration to generated package.json ([#35016](https://github.com/nrwl/nx/pull/35016)) — 22.7.0-beta.10
- Preserve sibling dependency inputs in native hashing ([#35071](https://github.com/nrwl/nx/pull/35071)) — 22.6.4
- Sandbox exclusions, multi-line typeof import detection, global ensurePackage mock ([#35056](https://github.com/nrwl/nx/pull/35056)) — 22.6.4
- Use explicit nx/bin/nx path in start-local-registry ([#35127](https://github.com/nrwl/nx/pull/35127)) — 22.6.4, 22.7.0-beta.10
- Use workspace root for package manager detection and normalize paths in plugins ([#35116](https://github.com/nrwl/nx/pull/35116)) — 22.7.0-beta.10
- Add conditional blog/changelog proxy in edge function ([#35043](https://github.com/nrwl/nx/pull/35043)) — 22.6.4
- Enforce no-disabled-tests via ESLint with per-project warning caps ([#35122](https://github.com/nrwl/nx/pull/35122)) — 22.7.0-beta.10
- React Native: use vite's transformWithEsbuild instead of direct esbuild import (22.6.4)

### Cloud

- Configure posthog with organization/workspace lifecycle events ([CLOUD-4374](https://linear.app/nxdev/issue/CLOUD-4374)) — Nicole. Quark-a task force.
- Verify Jarmo email to fix redirect loop ([CLOUD-4396](https://linear.app/nxdev/issue/CLOUD-4396)) — Chau

### Docs (Jack/Caleb)

- Update docs sidebar: expand Tutorials, collapse Concepts, remove "new" badge ([DOC-474](https://linear.app/nxdev/issue/DOC-474)) — Jack
- Testimonial Markdoc tag missing image and styled layout ([DOC-469](https://linear.app/nxdev/issue/DOC-469)) — Jack
- CTA component doesn't match current styles ([DOC-470](https://linear.app/nxdev/issue/DOC-470)) — Jack
- Match Framer header and footer ([DOC-463](https://linear.app/nxdev/issue/DOC-463)) — Jack
- Image auto optimization ([DOC-465](https://linear.app/nxdev/issue/DOC-465)) — Jack
- Add a ToC to the tutorial series ([DOC-466](https://linear.app/nxdev/issue/DOC-466)) — Jack

## Pylon Support Summary

55 tickets in 7 days across ~30 accounts. Excluding spam (2) and auto-replies:

**Top themes:**
- **Billing/account issues**: 8 tickets (payment failures, plan questions, credits, contributor counts)
- **Cloud runner/DTE errors**: 6 tickets (400 errors, ModuleNotFoundError, missing logs, concurrency issues)
- **Security inquiries**: 3 tickets (Axios CVE, nx breach, nx-console vector attack)
- **Self-Healing CI**: 2 tickets (enablement, missing comments)
- **Onboarding/config**: 4 tickets (cache misconfiguration, GitHub secrets, MCP tokens, agent images)
- **Feature requests**: 2 tickets (sandboxing, vitest browser mode)
- **Enterprise/SSO**: 2 tickets (SCIM, service account secrets)

**High-activity accounts:** ClickUp (8 tickets), Mimecast (4 tickets)

## Linear Project Status

### Completed in April

| Project | Lead | Link |
|---------|------|------|
| Implement Multi-Cluster Agent Setups | Steve | [View](https://linear.app/nxdev/project/implement-multi-cluster-agent-setups) |
| Europe-Provider Single Tenant Setup | Szymon | [View](https://linear.app/nxdev/project/europe-provider-single-tenant-setup) |
| Improve Worktrees Support | Jason | [View](https://linear.app/nxdev/project/improve-worktrees-support) |

### Active

| Project | Lead | Target | Link |
|---------|------|--------|------|
| CNW/Init Funnel & Cloud Conversion | Jack | 2026-04-10 | [View](https://linear.app/nxdev/project/cnw-init-funnel-cloud-conversion-optimization) |
| Task Sandboxing (I/O Tracing) | Rares | 2026-03-20 (overdue) | [View](https://linear.app/nxdev/project/task-sandboxing-input-output-tracing) |
| Polygraph Standalone | Victor | — | [View](https://linear.app/nxdev/project/polygraph-standalone) |
| Quark-a task force | Cory | 2026-04-30 | [View](https://linear.app/nxdev/project/quark-a-task-force) |
| Nx Local Dist Migration | Jason | 2026-04-03 (overdue) | [View](https://linear.app/nxdev/project/nx-local-dist-migration) |
| Istio integration | Steve | — | [View](https://linear.app/nxdev/project/istio-integration) |
| Lighthouse - MongoDB connections | Patrick | 2026-04-24 | [View](https://linear.app/nxdev/project/lighthouse-mongodb-connections) |
| Feature Demos | Nicole | 2026-03-31 (overdue) | [View](https://linear.app/nxdev/project/feature-demos) |

### Issues Completed: ~58 across 6 teams

Red Panda 33 · Nx CLI 10 · Infrastructure 11 · Docs 8 · Nx Cloud 6 · Quokka 0

_Generated on 2026-04-07._
