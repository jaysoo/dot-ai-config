# Nx Platform Update — March 2026 (Partial: March 1–4)

> **Data gaps:** None — all four sources (CLI GitHub releases, Cloud changelog, cloud-infrastructure repo, Linear) were accessible.
> **Note:** This is a partial month digest covering March 1–4 only. A full digest should be regenerated at month end.

## TL;DR

- **AI-powered development takes center stage**: Codex agent support added, Polygraph AI ships repo summarization and PR syncing, Self-Healing CI removes its "Experimental" label, and nx.dev now publishes LLM discovery files (llms.txt).
- **Task Sandboxing matures**: File deletion tracking, UI cleanup, and reduced false positives bring sandboxing closer to GA stability.
- **New enterprise customer onboarded**: Caseware single-tenant instance fully provisioned on AWS with CI/CD and monitoring.
- **Support tooling migrated**: Customer support cut over from Salesforce to Pylon with SSO, custom domains, and Google Workspace integration.
- **66 issues completed across 7 teams in 4 days** — heaviest throughput from Red Panda (26 issues) and Infrastructure (12 issues).

---

## AI-Powered Development

The AI experience across Nx saw significant investment this week. On the CLI side, the `configure-ai-agents` command now supports **OpenAI's Codex** as a subagent, joining Claude Code and Cursor. The command's own UX was improved, and Nx Console now shows a clickable link to run it directly. An **agentic `nx init`** flow was implemented for AI agents that adopt Nx in existing workspaces.

**Polygraph AI** — the in-cloud coding agent — shipped repo summarization, PR status syncing, automatic PR cleanup on session end, and several security/stability fixes. The `.nx/polygraph` directory is now automatically added to `.gitignore`.

**Self-Healing CI** dropped its "Experimental" label and made the auto-apply recommendation more prominent in terminal output, VCS comments, and the Cloud UI. One enterprise customer (Cloudinary) had self-healing CI enabled on their single-tenant instance.

On the docs side, nx.dev now publishes `llms.txt` and `llms-full.txt` files plus `.md` URL variants for better AI agent discoverability.

## Task Sandboxing & Hermetic Builds

Task Sandboxing (eBPF-based IO tracing) continued hardening:

- **File deletions and renames** are now properly tracked (important for Gradle PID marker files that disappear).
- **Folder reads filtered out** from tracing since folders cannot be task inputs — eliminates false positives.
- **Task ID encoding fixed** — special characters like `:` were incorrectly coerced to `_` in sandbox reports.
- **UI improvements**: Violations warning now caps at 5 tasks with a link to the sorted run view. The separate violations tab was removed in favor of inline reporting.
- **Infrastructure**: IO trace daemon ring buffer reduced to 512MB on dev/staging for resource optimization.

## Workspace Access & Onboarding

A new **repository-access-based workspace visibility** setting shipped across multiple components. Users authenticating via GitHub/GitLab OAuth are now automatically added to workspace access policies based on their repository memberships, with a background sync job keeping permissions current.

After account creation, users are now **immediately prompted to connect their GitHub or GitLab account**, improving the first-run experience for users joining through organization invitations.

The Create Nx Workspace (CNW) prompt flow was **restored to match the v22.1.3 experience** while preserving new capabilities like NDJSON AI output and template flags.

## Enterprise Customers

- **Caseware**: New single-tenant AWS instance fully provisioned — Terraform, Spacelift, lighthouse rotation, GitHub app variables, and CI/CD pipeline all set up.
- **Cloudinary**: Self-healing CI enabled on their enterprise instance.
- **Vattenfall & Entain**: Both confirmed successfully using `@nx/dotnet` in CI — validating the .NET plugin for enterprise adoption.
- **McGraw Hill Education**: P95 percentile CIPE duration added to analytics graph, supporting their ongoing proof-of-value evaluation.
- A customer-escalated fix resolved an issue where `stop-agents-after` was ignored with hybrid changesets when software was affected, causing agents to burn unnecessary credits.

## Observability & Analytics

- **Grafana billing alerts** fully implemented — cost alert conditions defined, Grafana space added to Spacelift, and monitoring dashboards provisioned across environments.
- **CI pipeline analytics** now shows percentile breakdown (P5, P25, P50, P75, P95) for execution durations.
- **PostHog proxy consolidation** — moved to a common reverse proxy endpoint, cleaned up extra proxy configurations across staging and production.

## Security

- **Vanta compliance**: Remediated IAM user access keys older than 90 days.
- **Workspace access policies**: New authentication-based access controls ensure users only see workspaces they have repository access to.

## Support Infrastructure

The customer support stack completed its migration from **Salesforce to Pylon**:

- SSO configured
- Custom domains set up (help.nx.app for knowledge base, support.nx.app for customer portal)
- DNS configured for sending from cloud-support@nrwl.io
- Google Workspace connected
- Full cutover completed

## Ecosystem & Framework Support

- **Angular Rspack**: Fixed PostCSS CLI resources to use relative paths (cross-platform fix).
- **Vitest**: Reporter configuration from target options is now properly respected.
- **Gradle**: Batch runner output now tees to stderr for proper terminal display.
- **Bun**: Resolved false positive loop detection when running Nx with Bun.

## Performance & Core Improvements

- **napi-rs migrated from v2 to v3** — modernizing the native Rust bindings.
- **Telemetry rewritten in Rust** — moving another subsystem from JavaScript to native code.
- Reduced misc allocations: structuredClone replaces JSON deep clone, precomputed hash externals, optimized sort operations.
- Deps cache writes now skipped when already up-to-date.
- Input file resolution fixed for targets using `defaultConfiguration`.

## Breaking Changes / Action Required

None this month (partial month — pre-release only so far).

## Coming Soon

| Initiative                                        | Target      | Notes                                            |
| ------------------------------------------------- | ----------- | ------------------------------------------------ |
| Nx Local Dist Migration                           | Mar 13      | Moving local distribution to new architecture    |
| Allow new users to immediately opt into Team plan | Mar 6       | Streamlined upgrade path                         |
| Azure Hosted Redis/Valkey                         | In progress | Azure enterprise infrastructure                  |
| Multi-Cluster Agent Setups                        | In progress | main.go audit completed, implementation upcoming |

## By the Numbers

| Metric                         | Count                                                           |
| ------------------------------ | --------------------------------------------------------------- |
| CLI pre-releases               | 2 (22.6.0-beta.8, beta.9)                                       |
| Cloud releases                 | 2 (2603.04.2, 2603.04.3)                                        |
| Linear issues completed        | 66 across 7 teams                                               |
| Enterprise customers onboarded | 1 (Caseware)                                                    |
| Projects completed             | 3 (Grafana Billing Alerts, IO Trace Helm Chart, Q Jan-Feb Misc) |

## Questions? Contact

- **AI / Agentic Experience / Polygraph**: Max Kless, Jonathan Cammisuli, Victor Savkin
- **Task Sandboxing / IO Tracing**: Rares Matei, Louie Weng
- **Workspace Access & Onboarding**: Mark Lindsey, Nicole Oliver
- **Enterprise / Single Tenant**: Patrick Mariglia, Steve Pentland
- **Self-Healing CI**: James Henry
- **Infrastructure / Observability**: Szymon Wojciechowski, Steve Pentland
- **CLI Core / Performance**: Jason Jean, Leosvel Perez Espinosa, Jack Hsu
- **Docs**: Jack Hsu, Benjamin Cabanes
- **Support / Pylon**: Steven Nance, Benjamin Cabanes

_Generated on 2026-03-04. For the full technical changelog, see the companion changelog document._
