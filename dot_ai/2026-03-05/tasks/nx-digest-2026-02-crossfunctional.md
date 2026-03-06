# Nx Platform Update — February 2026

> **Data gaps:** None — all four sources collected (Nx CLI GitHub releases, Nx Cloud public changelog, cloud-infrastructure repo, Linear).

## TL;DR

- **Task Sandboxing** is now live in staging and production — eBPF-based IO tracing detects undeclared inputs/outputs, with a full Cloud UI for anomaly review and strict-mode enforcement.
- **Self-Healing CI** expanded to BitBucket and Azure DevOps, graduated AI features out of "experimental," and added one-click onboarding during workspace setup.
- **AI/Agentic Experience** matured significantly: Claude plugin, Nx MCP improvements, Polygraph multi-repo coordination, and agent-aware CNW are all shipping.
- **Performance overhaul** delivered -81% memory fragmentation (jemalloc), fixed a Linux watcher that was consuming 1 GB + 9 CPUs, and reduced daemon CPU waste from stale graph recomputations.
- **nx.dev fully migrated to Framer** for marketing pages (homepage, pricing, enterprise, contact, solutions, blog index — 40+ pages), with docs remaining on Astro/Starlight.

---

## Task Sandboxing & Hermetic Builds

Nx can now verify that tasks only read files they declare as inputs and only write files they declare as outputs. An eBPF-based daemon running on CI agents traces every file operation, then the Cloud UI surfaces anomalies — undeclared reads or writes — so teams can fix their build configuration before it causes cache correctness issues.

**What's new for customers:**
- A "Sandbox Analysis" section in task details shows which files were read/written vs. what was declared, with process-level attribution (which PID did it).
- Workspace settings now include a **strict mode toggle**: in strict mode, sandbox violations fail the build. Warning mode (default) shows banners without blocking.
- Raw IO trace reports can be downloaded for debugging.
- File tree views are virtualized for performance on large traces.

**Where it's deployed:** Snapshot, staging, and production (GCP). AWS and Azure single-tenant rollout is in progress with dedicated service accounts and IAM bindings.

- **Led by:** Rares, Louie, Craigory, Altan
- **CLI PR:** `nx show target --inputs --outputs --check-input --check-output` ([#34205](https://github.com/nrwl/nx/pull/34205))
- **Blog:** Related content expected in March

---

## Self-Healing CI

Self-Healing CI — where Nx Cloud automatically diagnoses and fixes CI failures using AI — reached a new level of maturity this month.

**What's new for customers:**
- **BitBucket and Azure DevOps support:** In-app setup is now available on all major VCS platforms, not just GitHub and GitLab.
- **Auto-apply recommendations:** Organization admins receive intelligent suggestions for which tasks/patterns are safe for automatic fix application.
- **One-click setup during onboarding:** When connecting a new workspace, self-healing CI can be enabled via a checkbox (on by default) — the system auto-generates a PR to add `nx fix-ci` to CI config.
- **AI features graduated from experimental:** The "experimental" badge has been removed from AI-powered features in the Cloud UI.
- **Apply fixes locally:** A new `nx-cloud apply-locally` CLI command (with `nx` passthrough) lets developers pull and apply self-healing fixes on their machine.
- **Detailed failure logs:** Admins can now see technical details when fixes fail, and self-healing logs are surfaced directly in the CIPE UI.

- **Led by:** James, Mark, Chau, Jon, Max
- **Blog:** [Making Nx Agent-Ready](https://nx.dev/blog) (related post on agentic CI)

---

## AI-Powered Development

Nx is investing heavily in making monorepos work seamlessly with AI coding assistants. February saw major progress on three fronts:

**1. Claude Plugin & Agent Configuration**
- The Nx Claude Plugin was prepared for Anthropic's plugin marketplace (migrated to repo root, added GIFs/demos).
- `nx configure-ai-agents` now auto-detects when you're running inside an AI agent and sets up config automatically — no prompts needed.
- Skills, subagents, and MCP plugin config are copied correctly, and outdated configs are flagged.
- Cursor and OpenCode support was improved alongside VS Code.

**2. Nx MCP Improvements**
- `nx list` gained a `--json` flag for better agent consumption.
- MCP tools return structured content with proper hints for Claude Code.
- Users can paste Nx Cloud run/CIPE links directly to MCP tools for instant analysis.

**3. Polygraph (Multi-Repo AI Coordination)**
- A new product in development: Polygraph coordinates AI agents across multiple repositories. It creates a "session" where child agents open PRs, the system tracks CI status, and a PR dependency graph is visualized in both the Cloud UI and GitHub comments.
- GitHub Actions integration was implemented for CI status tracking.
- Sessions support descriptions, author tracking, and completion states.

**4. Agentic Workspace Creation**
- `create-nx-workspace` now detects AI agents and uses `--no-interactive` + NDJSON output automatically.
- Agent benchmarks were established for CNW to track onboarding quality.

- **Led by:** Max, Jon, Chau, Colum, Juri, Victor
- **Blog:** [Nx Joins Linux Foundation and AAIF](https://nx.dev/blog/nx-joins-linux-foundation-and-aaif), [Why Monorepos are King in the Age of AI](https://nx.dev/blog/why-monorepos-are-king-in-the-age-of-ai)
- **Docs:** [Configure AI Agents](https://nx.dev/docs)

---

## Performance & Reliability

A dedicated initiative to review and reduce Nx's resource footprint delivered significant wins:

- **jemalloc allocator:** Replaced the system allocator with jemalloc, achieving -81% memory fragmentation and -26% RSS in validated benchmarks.
- **Linux watcher fix:** The daemon's file watcher was consuming up to 1 GB of memory and 9 CPU cores on Linux. Upgrading watchexec and switching to recursive FSEvents on macOS (instead of non-recursive kqueue) resolved this.
- **Daemon efficiency:** Stale graph recomputations are now skipped, preventing wasted CPU when rapid file changes arrive. The TUI logger no longer initializes unconditionally.
- **Glob pattern caching:** Compiled glob patterns are cached in the native module, with 95.6% cache hit rate observed in benchmarks.
- **Plugin worker lifecycle:** Plugins that don't provide later hooks are eagerly shut down, freeing memory sooner.
- **Terminal output:** Deduplicated output strings and reduced allocations in the task runner.

- **Led by:** Leosvel, Jason, Craigory

---

## Onboarding & Workspace Connection

The team continued iterating on the workspace creation → Cloud connection funnel, targeting 600 connected workspaces per week.

**What changed:**
- CNW now has an explicit "No, skip forever" opt-out for Cloud, distinguishing "not now" from "never."
- A decorative banner and improved messaging guide users from workspace creation to Cloud connection.
- The Cloud welcome page ran multiple A/B experiments throughout February.
- The one-page "connect workspace" flow was simplified with streamlined VCS integration forms.
- PNPM catalog support was fixed for workspace connection via GitHub and GitLab.
- Template README now includes the Nx Cloud connect URL.

- **Led by:** Nicole, Dillon, Colum, Jack

---

## Website Migration to Framer

The marketing website (nx.dev non-docs pages) was fully migrated from Next.js to Framer. This is a massive effort covering 40+ pages.

**Migrated pages:** Homepage, pricing, enterprise, security, Nx Cloud, customers, partners, community, company, careers, Java, React, blog index, resources, webinar, contact (all variants), solutions (all variants), 404, brands, remote cache, and enterprise trial.

**Supporting work:** SEO titles/descriptions reviewed, canonical URLs set to nx.dev, marketing scripts consolidated into Google Tag Manager, custom tracking events wired up, new pricing cards designed, and header mega menu migrated.

- **Led by:** Ben, Heidi, Dillon

---

## JVM Ecosystem (Gradle & Maven)

Gradle and Maven support continued to mature for enterprise customers:

- **Batch mode for Gradle** is now fully operational — tasks can opt in to batch execution, with debug mode, correct log handling for atomized targets, and proper dependent task resolution.
- Maven batch execution uses runtime-loaded classes for version-agnostic operation.
- Maven and Gradle icons were updated to the Java Duke icon for consistency.
- `pom.xml` and ancestor POM files are now correctly included as inputs for all Maven targets.
- Enabled batch mode in the Ocean (Nx Cloud) monorepo itself.

- **Led by:** Louie, Jason, Max

---

## Security

- **CVE-2026-26996 (minimatch):** Bumped minimatch to 10.2.1 to address this vulnerability ([#34509](https://github.com/nrwl/nx/pull/34509)).
- **Command injection fix:** Prevented command injection in `getNpmPackageVersion` where unsanitized `--preset` flag values were passed to `execSync()` ([#34309](https://github.com/nrwl/nx/pull/34309)).
- **IAM key rotation:** Rotated AWS IAM access keys for multiple team members per Vanta compliance requirements.
- **Lighthouse audit logging:** Page visits and password copy actions are now audited, with password retrieval moved to the backend (no longer visible in page source).
- **Signed storage enforcement:** Removed the ability to use non-signed (direct) artifact uploads — all artifact uploads now require signed URLs.
- **Antivirus compatibility:** Removed `shellapi` from Windows native binary's winapi featureset to minimize false positives from antivirus software.

---

## Continuous Task Assignment (DTE v2)

The next-generation distributed task execution engine continued development:

- Workers now properly handle pool shrinking, stalled shutdowns, and task completion races.
- Long-polling was reworked to prevent agent "forgetfulness."
- Multiple API endpoints support longer timeouts for large workspaces.
- Flaky task retries no longer incorrectly update execution status.
- Nx repo and Ocean successfully dogfooded with the new system.

- **Led by:** Altan

---

## Workspace Visibility

A new access control model for workspaces was implemented:

- Workspaces can now be individually marked public or private (previously org-level only).
- A new "Repository Access Sync" setting matches workspace access to VCS repository permissions — if your repo is public, the workspace is public; if private, only users with repo access can view it.
- BitBucket OAuth integration was added for repository access checking.
- Visibility toggle moved from organization settings to individual workspace settings.

- **Led by:** Mark

---

## Documentation & Developer Experience

- **Sidebar restructured:** The docs sidebar was reorganized into topics for better discoverability.
- **LLM-friendly docs:** Added `llms-full.txt` and HTTP Link headers so AI tools can discover and consume docs automatically.
- **CLI reference improvements:** Command examples now show on reference pages, search relevance was improved for CLI commands.
- **nx.dev moved to Netlify DNS** and migrated redirects from Next.js config to Netlify `_redirects`.
- **New blog posts:**
  - [Nx Joins Linux Foundation and AAIF](https://nx.dev/blog/nx-joins-linux-foundation-and-aaif)
  - [Why Monorepos are King in the Age of AI](https://nx.dev/blog/why-monorepos-are-king-in-the-age-of-ai)
  - [Configure Tailwind v4 with Angular in an Nx Monorepo](https://nx.dev/blog/setup-tailwind-4-angular-nx-workspace)

---

## Breaking Changes / Action Required

None this month.

---

## Coming Soon

- **Task Sandboxing** rollout to all AWS and Azure single-tenant environments.
- **Polygraph** approaching first external beta — multi-repo AI coordination.
- **Continuous Task Assignment (DTE v2)** moving toward production enablement.
- **Workspace visibility** feature flag in testing, expected to roll out broadly.

---

## By the Numbers

| Metric                  | Count                          |
| ----------------------- | ------------------------------ |
| CLI releases (stable)   | 5 (22.4.5, 22.5.0, 21.3.12, 22.5.1, 22.5.2, 22.5.3) |
| Cloud releases          | 24                             |
| Linear issues completed | ~460 across 6 teams            |
| Infrastructure commits  | ~110 human-authored            |
| Blog posts published    | 3                              |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing:** Rares, Louie, Craigory, Altan
- **Self-Healing CI:** James, Mark, Chau, Jon
- **AI / Agentic Experience:** Max, Jon, Juri, Victor
- **Polygraph:** Jon, Victor
- **Onboarding & Cloud:** Nicole, Dillon, Colum
- **Performance:** Leosvel, Jason
- **Gradle / Maven:** Louie, Jason
- **Infrastructure & Enterprise:** Steve, Patrick, Szymon
- **Website / Framer:** Ben, Heidi
- **Documentation:** Jack, Caleb

_Generated on 2026-03-05. For the full technical changelog, see Document 2._
