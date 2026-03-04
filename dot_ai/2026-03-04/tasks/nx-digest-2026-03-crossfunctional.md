# Nx Platform Update — March 1–4, 2026

> **Data gaps:** No blog posts published yet. Only 2 of ~13 active projects have posted March status updates — most screenshots will come later in the month. No screenshots available from Linear project updates yet.

## TL;DR

- Codex agent support added, Polygraph AI ships repo summarization and PR syncing, Self-Healing CI drops its "Experimental" label, and nx.dev now publishes LLM discovery files (llms.txt).
- Task sandboxing continues hardening with file deletion tracking, UI cleanup, and fewer false positives. The feature monitors file system access during task execution to flag undeclared inputs and outputs.
- Caseware single-tenant instance fully provisioned on AWS with CI/CD and monitoring.
- Customer support cut over from Salesforce to Pylon with SSO, custom domains, and Google Workspace integration.
- 66 issues completed across 7 teams in 4 days, with Red Panda (26 issues) and Infrastructure (12 issues) leading throughput.

---

## AI-Powered Development

The `configure-ai-agents` command now supports OpenAI Codex as a subagent, joining Claude Code and Cursor. Its UX was improved, and Nx Console shows a clickable link to run it directly. A new agentic `nx init` flow lets AI agents adopt Nx in existing workspaces.

Polygraph AI, the in-cloud coding agent, shipped repo summarization, PR status syncing, automatic PR cleanup on session end, and several security/stability fixes. The `.nx/polygraph` directory is now automatically added to `.gitignore`.

Self-Healing CI dropped its "Experimental" label — it's now GA. The auto-apply recommendation is now more prominent in terminal output, VCS comments, and the Cloud UI. Cloudinary had self-healing CI enabled on their enterprise instance. Active rollouts in progress for: Emeria, CREXi, MailChimp, Moderna, PayFit, ClickUp, and Island.

nx.dev now publishes `llms.txt` and `llms-full.txt` files plus `.md` URL variants for better AI agent discoverability.

## Task Sandboxing & Hermetic Builds

Task sandboxing monitors file system access during task execution, flagging any reads or writes that fall outside declared `inputs` and `outputs` in your project configuration. A hermetic task only reads from its declared inputs and writes to its declared outputs, which is critical for cache correctness. Undeclared dependencies can cause false cache hits (stale results served when undeclared inputs change) or missing artifacts (outputs not captured in the cache).

The feature operates in two enforcement modes: warning mode reports violations in the Nx Cloud UI but allows task completion, while strict mode fails tasks immediately on violation. Teams can exclude paths via `.nx/workflows/sandboxing-config.yaml` using glob patterns.

For more details, see [sandboxing documentation](https://nx.dev/docs/features/ci-features/sandboxing). Requires Nx 22.5+, Nx Enterprise plan, and single-tenant deployment with Nx Agents.

This week's hardening work:

- File deletions and renames are now properly tracked, which matters for Gradle PID marker files that disappear during builds.
- Folder reads are filtered out from tracing since folders cannot be task inputs. This eliminates a category of false positives.
- Task ID encoding fixed where special characters like `:` were incorrectly coerced to `_` in sandbox reports.
- The violations warning now caps at 5 tasks with a link to the sorted run view. The separate violations tab was removed in favor of inline reporting.
- IO trace daemon ring buffer reduced to 512MB on dev/staging for resource optimization.

## Workspace Access & Onboarding

A new repository-access-based workspace visibility setting shipped across multiple components. Users authenticating via GitHub/GitLab OAuth are now automatically added to workspace access policies based on their repository memberships, with a background sync job keeping permissions current.

After account creation, users are now immediately prompted to connect their GitHub or GitLab account, improving the first-run experience for users joining through organization invitations.

The Create Nx Workspace (CNW) prompt flow was restored to match the v22.1.3 experience while preserving new capabilities like NDJSON AI output and template flags.

## Enterprise Customers

- Caseware's new single-tenant AWS instance is fully provisioned with Terraform, Spacelift, lighthouse rotation, GitHub app variables, and CI/CD pipeline.
- Cloudinary had self-healing CI enabled on their enterprise instance.
- Vattenfall and Entain both confirmed successfully using `@nx/dotnet` in CI, validating the .NET plugin for enterprise adoption.
- McGraw Hill Education now has P95 percentile CIPE duration on their analytics graph, supporting their ongoing proof-of-value evaluation.
- A customer-escalated fix resolved an issue where `stop-agents-after` was ignored with hybrid changesets when software was affected, causing agents to burn unnecessary credits.

## Observability & Analytics

- Grafana billing alerts are fully implemented with cost alert conditions defined, Grafana space added to Spacelift, and monitoring dashboards provisioned across environments.
- CI pipeline analytics now shows percentile breakdown (P5, P25, P50, P75, P95) for execution durations.
- PostHog proxy consolidated to a common reverse proxy endpoint, cleaning up extra proxy configurations across staging and production.

## Security

- **Polygraph session scoping fix**: `getSession` now constrains queries to the workspace ID, preventing potential cross-workspace session leakage. Flagged as urgent.
- **IAM key rotation**: Remediated IAM user access keys older than 90 days for Vanta compliance.
- **Workspace visibility**: Repository-access-based access policies ensure users only see workspaces they have repository membership for.
- IAM permissions tightened across dev/staging/prod for service accounts and GCP image operations.

## Support Infrastructure

The customer support stack completed its migration from Salesforce to Pylon. SSO is configured, custom domains are set up (help.nx.app for knowledge base, support.nx.app for customer portal), DNS is configured for sending from cloud-support@nrwl.io, and Google Workspace is connected. Full cutover is complete.

## Ecosystem & Framework Support

- Angular Rspack: fixed PostCSS CLI resources to use relative paths (cross-platform fix).
- Vitest reporter configuration from target options is now properly respected.
- Gradle batch runner output now tees to stderr for proper terminal display.
- Resolved false positive loop detection when running Nx with Bun.

## Performance & Core Improvements

- napi-rs migrated from v2 to v3, modernizing the native Rust bindings.
- Telemetry rewritten in Rust, moving another subsystem from JavaScript to native code.
- Reduced misc allocations: structuredClone replaces JSON deep clone, precomputed hash externals, optimized sort operations.
- Deps cache writes now skipped when already up-to-date.
- Input file resolution fixed for targets using `defaultConfiguration`.

## Breaking Changes / Action Required

None so far.

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
| Linear issues completed        | 67+ across 7 teams                                              |
| Enterprise customers onboarded | 1 (Caseware)                                                    |
| Projects completed             | 3 (Grafana Billing Alerts, IO Trace Helm Chart, Q Jan-Feb Misc) |

## Questions? Contact

- AI / Agentic Experience / Polygraph: Max, Jonathan, Victor
- Task Sandboxing / IO Tracing: Rares, Louie
- Workspace Access & Onboarding: Mark, Nicole
- Enterprise / Single Tenant: Patrick, Steve
- Self-Healing CI: James
- Infrastructure / Observability: Szymon, Steve
- CLI Core / Performance: Jason, Leosvel, Jack
- Docs: Jack, Caleb
- Support / Pylon: Steven, Benjamin

_Generated on 2026-03-04. For the full technical changelog, see the companion changelog document._
