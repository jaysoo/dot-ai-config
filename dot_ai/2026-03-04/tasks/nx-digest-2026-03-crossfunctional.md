# Nx Platform Update — March 1–4, 2026

> **Data gaps:** None. All four sources (CLI GitHub releases, Cloud changelog, cloud-infrastructure repo, Linear) were accessible.

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

Self-Healing CI dropped its "Experimental" label. The auto-apply recommendation is now more prominent in terminal output, VCS comments, and the Cloud UI. Cloudinary had self-healing CI enabled on their enterprise instance.

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

- Remediated IAM user access keys older than 90 days for Vanta compliance.
- New authentication-based workspace access policies ensure users only see workspaces they have repository access to.

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

## Docs Cleanup: Outdated Version References

The following docs pages contain version-conditional content referencing Nx versions older than 20. Since the current version is 22 (23 in beta), content gated on versions < 20 can be removed — keep only the modern path.

### Version-Conditional Tabs to Simplify

These files use tab pairs like "Nx 18+" / "Nx < 18". The "< 18" tab can be removed entirely and the "18+" content shown as the default:

| File | Tabs | Action |
|------|------|--------|
| `react-native/introduction.mdoc` | "Nx 18+" / "Nx < 18" | Remove "Nx < 18" tab, keep 18+ content as default |
| `cypress/introduction.mdoc` | "Nx 18+" / "Nx < 18" | Remove "Nx < 18" tab, keep 18+ content as default |

These files use "Nx 22+" / "Nx < 22" tabs — keep both for now (Nx 20/21 users still active):

| File | Tabs | Action |
|------|------|--------|
| `nx-json.mdoc` | "Nx 22+" / "Nx < 22" | Keep both (active versions) |
| `release-npm-packages.mdoc` | "Nx 22+" / "Nx < 22" | Keep both |
| `release-docker-images.mdoc` | "Nx 22+" / "Nx < 22" | Keep both |
| `publish-rust-crates.mdoc` | "Nx 22+" / "Nx < 22" | Keep both |
| `release-projects-independently.mdoc` | "Nx 22+" / "Nx < 22" | Keep both |

### Outdated Version References to Clean Up

| File | Reference | Action |
|------|-----------|--------|
| `next-config-setup.mdoc` | "Nx 15 and prior" section (L102), "Nx 16's composePlugins" (L54) | Remove "Nx 15 and prior" section entirely; drop "Nx 16" qualifier (composePlugins is standard now) |
| `deploy-nextjs-to-vercel.mdoc` | "Starting from Nx 11" (L9) | Remove version qualifier — just say it works |
| `faster-builds-with-module-federation.mdoc` | "Starting in Nx 14" (L22) | Remove version qualifier |
| `webpack-plugins.mdoc` | "Prior to Nx 18" (L16, L388) | Remove pre-18 content, keep current approach |
| `webpack-config-setup.mdoc` | "introduced in Nx 18" (L60) | Remove version qualifier |
| `use-environment-variables-in-react.mdoc` | "with the release of Nx 19" (L78) | Remove version qualifier |
| `environment-variables.mdoc` | "Workspaces created before Nx 18" (L15) | Remove historical context |
| `configure-inputs.mdoc` | "As of Nx 18" (L327) | Remove version qualifier |
| `configure-outputs.mdoc` | "As of Nx 18" (L58) | Remove version qualifier |

### Deprecated Reference Pages (Already in `/reference/Deprecated/`)

These are fine as-is — they're explicitly in the Deprecated section and serve as migration references:
- `rescope.mdoc` — @nrwl → @nx migration (Nx 15/16/17 table)
- `npm-scope.mdoc` — npmScope property (Nx 16/17)
- `angular-schematics-builders.mdoc` — Angular CLI compat (Nx 17)
- `cacheable-operations.mdoc` — cacheableOperations → cache property (Nx 17)
- `as-provided-vs-derived.mdoc` — generator naming (Nx 17/20)
- `workspace-generators.mdoc` — workspace generators (Nx 16)
- `global-implicit-dependencies.mdoc` — implicit deps (Nx 15)

### Plugin Compatibility Page (Keep as-is)

`createnodes-compatibility.mdoc` documents plugin API compatibility across Nx 17-22+ — this is a reference table for plugin authors and should stay.

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

- AI / Agentic Experience / Polygraph: Max Kless, Jonathan Cammisuli, Victor Savkin
- Task Sandboxing / IO Tracing: Rares Matei, Louie Weng
- Workspace Access & Onboarding: Mark Lindsey, Nicole Oliver
- Enterprise / Single Tenant: Patrick Mariglia, Steve Pentland
- Self-Healing CI: James Henry
- Infrastructure / Observability: Szymon Wojciechowski, Steve Pentland
- CLI Core / Performance: Jason Jean, Leosvel Perez Espinosa, Jack Hsu
- Docs: Jack Hsu, Benjamin Cabanes
- Support / Pylon: Steven Nance, Benjamin Cabanes

_Generated on 2026-03-04. For the full technical changelog, see the companion changelog document._
