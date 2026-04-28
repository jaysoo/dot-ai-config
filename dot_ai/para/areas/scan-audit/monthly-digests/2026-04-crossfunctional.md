# Nx Platform Update — April 2026

> **Data gaps:** None. All five sources collected (Nx CLI GitHub releases, Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear, Pylon).

## TL;DR

- **Nx 22.7.0 shipped** — A 200+ PR release headlined by Vite 8, ESLint v10, Yarn catalogs, .NET CI workflow generator, multiple supply-chain CVE patches, and the lockdown of the new CNW Cloud-prompt funnel design after A/B testing. The 23.0.0 beta line also opened (target tokens, project-graph cleanup).
- **Self-Healing CI hardening + monetization** — Auto-apply suggestions launched on the blog, the team is rolling out paid Self-Healing for enterprises (Q2 onward), and a regression in git-fetch handling broke Self-Healing for ClickUp + others late in the month. Two enterprise customers (Mimecast, Codistica) flagged 300%+ cost increases and one consumer flagged a billing dispute over Self-Healing being on by default.
- **Polygraph Standalone is in heads-down execution mode** — 102 issues completed in one month: dedicated CLI, GitHub OAuth, repo graph integration, session resumability, four CRITICAL CVEs patched on the new frontend, and full UI refresh. Targeting public beta.
- **Onboarding funnel locked in** — CNW variant 1 was crowned A/B winner, the prompt was wired into `nx init`, and Cloud onboarding now auto-detects Nx workspaces and opens a PR. Get-started view, plan selection, and verify-email got polished.
- **Sandboxing reaches "fix the violations" phase** — Half of the CLI team's work this month was hunting down sandbox violations across the Nx repo's own tasks (graph-client, esbuild, Playwright, eslint, Jest, Maven, Gradle, etc.). New sandboxing UI filtering bugs caught and fixed. Island enabled in production.
- **Infrastructure: AWS GatewayAPI live, Anaplan onto AWS** — GatewayAPI rolled out to AWS dev, full Anaplan AWS deployment built from scratch (Spacelift, agents, secrets, ECR cache), Valkey VCS cache enabled across dev/staging/prod, AWS Valkey sentinel module landed.

## Nx 22.7.0 Major Release

The flagship release of the month landed April 24 with broad framework, build-tool, and CLI improvements. Vite 8 support shipped end-to-end, ESLint v10 migration completed, and a long list of .env, daemon, and migrate fixes resolved customer-reported pain.

**CLI:**

- **Vite 8 support** across React Router, Vue, Nuxt presets, with vitest + plugin-react-swc bumps
- **ESLint v10** — Nx repo migrated, framework configs prepended in flat-config generation, custom hasher removed
- **Yarn Berry catalog** support added (NXC-3647)
- **.NET ci-workflow generator** — Nx can now scaffold CI for .NET projects ([NXC-3356](https://linear.app/nxdev/issue/NXC-3356)); Island is using .NET ([NXC-4352](https://linear.app/nxdev/issue/NXC-4352))
- **Cross-file `.env` variable references** finally supported
- **JSON inputs** — selective hashing of specific JSON fields
- **`NX_BAIL` env var** — fail fast on first task failure
- **`tsgo` compiler integration** — Vite plugin adds compiler option for tsgo support
- **Decoupled DB version from Nx version** — multiple worktrees now share the DB
- **DotNet/Maven/Gradle batch executors** — multiple correctness and stability fixes
- **Supply-chain hardening**: transitive deps now flattened to pinned direct deps at publish time ([NXC-4197](https://linear.app/nxdev/issue/NXC-4197))

**Cloud:**

- Plan selection screen polished, get-started view updated, verify-email refresh ([CLOUD-4415](https://linear.app/nxdev/issue/CLOUD-4415))
- Workspace insights mobile layout fixed ([CLOUD-3515](https://linear.app/nxdev/issue/CLOUD-3515))

**Docs:**

- Blog moved to standalone Astro site (`nx-blog`); search restored, sitemap added (`sitemap-2.xml`)
- New KB article on migrating from `nx` package imports to `devkit` ahead of 23.0 / 24 removal ([DOC-462](https://linear.app/nxdev/issue/DOC-462))
- 22.x docs versioning shipped: each major Nx version is now snapshotted to `<version>.nx.dev/docs` ([DOC-69](https://linear.app/nxdev/issue/DOC-69))
- Tutorials section expanded by default in sidebar; ToC added to tutorial series ([DOC-474](https://linear.app/nxdev/issue/DOC-474), [DOC-466](https://linear.app/nxdev/issue/DOC-466))

**Blog posts**:
- [Self-Healing CI Now Suggests What to Auto-Apply](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions) (Apr 22)
- [Deploying a PNPM Monorepo to Cloudflare Pages](https://nx.dev/blog/pnpm-monorepo-cloudflare-pages) (Apr 20)
- [Sharing Tailwind CSS Styles Across Apps in a Monorepo](https://nx.dev/blog/sharing-tailwind-styles-nx-monorepo) (Apr 9)

**Who to contact:** Jason, Craigory, Leosvel, Jack

---

## Self-Healing CI

A high-stakes month for Self-Healing CI: it's now being monetized for enterprise, the auto-apply UX shipped, but a late-month regression broke commit-fetching for at least one major customer (ClickUp). One consumer customer publicly disputed default-on enablement.

**CLI:**

- `nx fix-ci` continues to be the install path; supply-chain hardening rolled forward
- Self-healing commit hooks (`prepare-commit-msg`, `commit-msg`) running before AI commits

**Cloud:**

- **Auto-apply suggestions** launched ([blog](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions))
- Better debug logs for `Refspec fetch` ETIMEDOUT path — surface shallow-clone diagnostics
- Strip Git trailers from Self-Healing rerun commits to avoid mis-attribution (2604.02.3)
- "Disable per-workspace" toggle for GitHub PR comments ([NXA-1307](https://linear.app/nxdev/issue/NXA-1307))
- Diff revert / unrelated-Kotlin-changes / authentication-no-feedback bugs all fixed ([NXA-764](https://linear.app/nxdev/issue/NXA-764), [NXA-1205](https://linear.app/nxdev/issue/NXA-1205), [NXA-1350](https://linear.app/nxdev/issue/NXA-1350))
- Loading spinner on slow self-healing overview filters
- Classification step no longer attempts fixes ([NXA-717](https://linear.app/nxdev/issue/NXA-717))

**Business:**

- Enterprise customers being moved to paid Self-Healing for Q2 ([NXA-1009](https://linear.app/nxdev/issue/NXA-1009), [NXA-1106](https://linear.app/nxdev/issue/NXA-1106))
- Self-serve adoption email campaign in progress ([NXA-1103](https://linear.app/nxdev/issue/NXA-1103))

**Customer escalations from Pylon:**

- **ClickUp**: "Self-Healing CI Fails to Fetch Commits After Update" — High priority, on hold (Pylon #784, Apr 27). Surfaced after the late-month update; still being investigated.
- **Mimecast**: "Cache hit rate drop to 4%" — flagged Apr 22, still waiting on us. Likely related to recent CI/cache changes.
- **fairsdotcom (consumer)**: $344 billing dispute over Self-Healing CI being default-on after `npx nx fix-ci` was scaffolded by `nx connect` (Pylon #683). Threatens chargeback citing FTC §5, Click-to-Cancel rule, EU Directive 2005/29/EC. **Action requested**: explicit opt-in before `npx nx fix-ci` is added by future `nx connect` / ci-workflow generators.
- **Codistica**: "300%+ Costs Increase" billing complaint (Pylon #719, Apr 19) — closed.

**Who to contact:** James, Jonathan, Max, Mark

---

## Polygraph Standalone

The single largest project in April by issue count: 102 completed issues. The Polygraph product is being extracted into a standalone application with its own CLI, GitHub App, frontend, and API. This is preparation for public availability.

**CLI:**

- New `polygraph-cli` (or just `polygraph`) — separate from Nx CLI, separate npm publish ([NXA-1145](https://linear.app/nxdev/issue/NXA-1145), [NXA-1137](https://linear.app/nxdev/issue/NXA-1137))
- Repo graph visualization integrated into CLI ([NXA-1329](https://linear.app/nxdev/issue/NXA-1329))
- Multi-agent support: works with Codex, OpenCode, Cursor, Claude ([NXA-1304](https://linear.app/nxdev/issue/NXA-1304), [NXA-1287](https://linear.app/nxdev/issue/NXA-1287))
- Session resumability fixed ([NXA-1175](https://linear.app/nxdev/issue/NXA-1175), [NXA-1334](https://linear.app/nxdev/issue/NXA-1334), [NXA-1282](https://linear.app/nxdev/issue/NXA-1282))
- `polygraph account select`, `repo show`, `agent list` commands added
- Agent launching generalized; child agent process lifetime decoupled from CLI

**Cloud / Frontend:**

- Full UI refresh: layout, breadcrumbs, error boundaries, user profile, organization dropdown, repository list ([NXA-1314](https://linear.app/nxdev/issue/NXA-1314), [NXA-1355](https://linear.app/nxdev/issue/NXA-1355), [NXA-1239](https://linear.app/nxdev/issue/NXA-1239), [NXA-1264](https://linear.app/nxdev/issue/NXA-1264), [NXA-1265](https://linear.app/nxdev/issue/NXA-1265))
- GitHub OAuth for `private-enterprise` mode ([NXA-1286](https://linear.app/nxdev/issue/NXA-1286))
- Sign-up blocked behind bypass token while in private mode ([NXA-1365](https://linear.app/nxdev/issue/NXA-1365))
- Onboarding flows hardened, repository selection, session sidebar
- Dark mode support ([NXA-1186](https://linear.app/nxdev/issue/NXA-1186))

**Infrastructure:**

- `/polygraph` and `/polygraph/private` routing through Nx API like Nx Cloud ([INF-1312](https://linear.app/nxdev/issue/INF-1312))
- AWS base registry image push ([INF-1336](https://linear.app/nxdev/issue/INF-1336))
- New OAuth + private-key secrets provisioned ([INF-1311](https://linear.app/nxdev/issue/INF-1311), [INF-1329](https://linear.app/nxdev/issue/INF-1329))

**Security:**

- **Four CRITICAL CVEs (CVSS 9.8 / 10.0) patched on Polygraph Frontend** ([NXA-1220](https://linear.app/nxdev/issue/NXA-1220), [NXA-1221](https://linear.app/nxdev/issue/NXA-1221), [NXA-1222](https://linear.app/nxdev/issue/NXA-1222), [NXA-1223](https://linear.app/nxdev/issue/NXA-1223))

**Who to contact:** James, Max, Chau, Jonathan, Mark, Victor

---

## Onboarding & CNW Funnel

The CNW funnel work continued. Variant 1 was crowned the A/B winner and locked in as the new baseline; two new variants were designed and entered testing. The same prompt was wired into `nx init` so users connecting an existing repo see the same flow. The "one-page connect workspace" experience went live for snapshot testing.

**CLI:**

- CNW variant 1 locked in; new variants designed and tracked via flow-variant index ([NXC-4190](https://linear.app/nxdev/issue/NXC-4190), [NXC-4336](https://linear.app/nxdev/issue/NXC-4336))
- Cloud prompt added to `nx init` using the same variant 1 copy ([NXC-4189](https://linear.app/nxdev/issue/NXC-4189), [NXC-3983](https://linear.app/nxdev/issue/NXC-3983))
- More CNW telemetry added to fix bugs ([NXC-4262](https://linear.app/nxdev/issue/NXC-4262))
- `nx init` in empty git directory now prompts for setup mode
- `nx-cloud onboard` command broken-and-fixed for public GitHub (OAuth was hitting `api.github.com` instead of `github.com`) ([CLOUD-4466](https://linear.app/nxdev/issue/CLOUD-4466))
- Auto-open browser for Cloud setup URL during CNW

**Cloud:**

- **One-page manual `connect workspace` flow** turned on in snapshot ([CLOUD-3954](https://linear.app/nxdev/issue/CLOUD-3954))
- **Upgraded GitHub + GitLab connect flows** — auto-detect Nx workspace and create a PR with Nx Cloud config (changelog 2604.23.1)
- "Show PR link after `nx connect`" so users can preview/review before merging ([CLOUD-4410](https://linear.app/nxdev/issue/CLOUD-4410))
- CNW yes/maybe/no prompt re-enabled with corrected behavior for "yes" and "maybe" branches ([CLOUD-4367](https://linear.app/nxdev/issue/CLOUD-4367), [CLOUD-4368](https://linear.app/nxdev/issue/CLOUD-4368), [CLOUD-4369](https://linear.app/nxdev/issue/CLOUD-4369))
- Setting `CLAUDECODE=1` no longer breaks Nx Cloud onboarding flow ([CLOUD-4399](https://linear.app/nxdev/issue/CLOUD-4399))
- Missing-permissions guidance for GitHub app added ([CLOUD-4402](https://linear.app/nxdev/issue/CLOUD-4402))
- New Auth0 signups can no longer block verification resend
- Self-served enterprise trial form fixed ([CLOUD-4413](https://linear.app/nxdev/issue/CLOUD-4413))

**Docs:**

- `nx connect` agentic onboarding documented ([DOC-412](https://linear.app/nxdev/issue/DOC-412))
- `nx-cloud onboard` command documented ([DOC-451](https://linear.app/nxdev/issue/DOC-451))
- "No-workspace CTA" restored in Self-Healing CI tutorial ([DOC-476](https://linear.app/nxdev/issue/DOC-476))

**Who to contact:** Jack, Jason, Nicole, Benjamin, Dillon

---

## Task Sandboxing & Hermetic Builds

Sandboxing moved from "build the system" to "use the system to clean up the Nx repo's own tasks." About half the CLI team's April issues were sandbox-violation hunts across graph-client, esbuild, Playwright, eslint, Jest, Maven, Gradle, vitest, dotnet, populate-local-registry, etc. Island enabled in production for sandboxing.

**CLI:**

- 40+ sandbox-violation tasks fixed in the Nx repo (one cycle's worth of cleanup)
- Inputs/outputs corrected for: graph-client typecheck, graph-migrate, esbuild executor, eslint, Jest, Vitest, Playwright, vale, populate-local-registry, jest dependent task outputs, .d.ts dependency inputs, json-input typing, .d.cts/.d.mts inputs, ts-jest with isolatedModules, copyReadme inputs
- Custom hashers now treated as opaque inputs in `nx show target` ([NXC-4200](https://linear.app/nxdev/issue/NXC-4200), [NXC-4202](https://linear.app/nxdev/issue/NXC-4202))
- AI Skill being built to fix sandbox violations ([NXC-4062](https://linear.app/nxdev/issue/NXC-4062))
- `nx show target` UI: hide implicit `default` configuration ([NXC-4077](https://linear.app/nxdev/issue/NXC-4077))

**Cloud:**

- File-tree filters now persist correctly across navigation ([Q-339](https://linear.app/nxdev/issue/Q-339))
- "Unexpected" filter can be split into reads vs writes ([Q-340](https://linear.app/nxdev/issue/Q-340))
- Tasks reading their own outputs no longer flagged ([Q-336](https://linear.app/nxdev/issue/Q-336))
- Path-vs-glob matching bug fixed ([CLOUD-4469](https://linear.app/nxdev/issue/CLOUD-4469))
- Layout shift on previous executions fixed ([Q-334](https://linear.app/nxdev/issue/Q-334))

**Infrastructure:**

- IO-trace deployed to **Island** (Apr 20)
- Temporarily removed from **ClickUp** Apr 21 while debugging issues
- Sandbox-violations count tooling requested (Pylon #754 — Sofie/Mimecast)

**Customer escalations from Pylon:**

- **Mimecast**: "Sandbox Violations Count on Main" feature request — "any way to get a current state of how many sandbox violations we have on main?" (Pylon #754)
- **Mimecast**: Sandboxing feature exploration (Pylon #718)
- **Various**: Sandbox feature proposal interest from Anaplan and others (Pylon #607)
- **DTE failures with sandbox violations** from at least one customer (Pylon #702)

**Who to contact:** Rares, Louie, Craigory, Leosvel

---

## Security

A heavy security month, mostly driven by Polygraph CVE remediation, axios supply-chain incident response, and ongoing license / supply-chain cleanup in Nx core.

**CLI:**

- **CVE-2026-25639 (axios)** — bumped to 1.13.5, then 1.15.0 across all packages ([NXC-4237](https://linear.app/nxdev/issue/NXC-4237))
- **CVE-2026-25128 (fast-xml-parser via @nx/s3-cache)** — switched AWS SDK pins from exact to caret ranges to allow consumer patches
- **minimatch ReDoS** — `@nx/owners` direct dep bumped 9.0.3 → 9.0.6; transitive `@nx/devkit` upgrades from 22.0.3 → 22.6.5 across cache/cloud/diagnostics/owners/conformance packages
- **yaml@1.x CVE** eliminated via postcss-loader bump
- **License cleanup**: replaced LGPL-licensed `@ltd/j-toml` with BSD-3-Clause `smol-toml`
- **Critical npm alerts** in React and Angular templates patched ([NXC-4240](https://linear.app/nxdev/issue/NXC-4240))
- **Shell metacharacters** properly quoted in CLI args passed to tasks (command-injection class)
- **Supply-chain hardening**: transitive deps flattened to pinned direct deps at publish ([NXC-4197](https://linear.app/nxdev/issue/NXC-4197))
- **`windowsHide: true`** on all child process spawns

**Cloud / Polygraph:**

- **4 CRITICAL CVEs** (3 × 9.8, 1 × 10.0) patched on Polygraph Frontend
- New audit-log coverage and filters expanded ([CLOUD-4446](https://linear.app/nxdev/issue/CLOUD-4446))
- GitHub-app-lacks-permissions guidance surfaced ([CLOUD-4402](https://linear.app/nxdev/issue/CLOUD-4402))

**Customer escalations from Pylon:**

- **Skyscanner**: "Security risk: nx-cloud fetched via npx bypasses lockfile" (Pylon #700) — they hit the malicious axios 1.14.1 transitive during the supply-chain attack window. They're asking for an officially-supported way to pin `nx-cloud` as a declared package.json dependency. Resolved + closed.
- **Multiple customers**: questions about the axios v1.14.1 supply-chain attack (Pylon #525, #524 — security incidents from Apr 1)

**Who to contact:** Jack, Nicole, Szymon, Altan, Chau

---

## AI-Powered Development & Agentic Experience

Continued investment in the AI/agentic pathways across CLI, MCP, and Polygraph.

**CLI:**

- AI Skill for fixing sandbox violations ([NXC-4062](https://linear.app/nxdev/issue/NXC-4062))
- `configure-ai-agents` continues maintenance: legacy `.gemini/skills` cleanup added
- `nx init` in empty git dir prompts for setup mode (better agent UX)
- Source map annotations in `nx show target` ([PR #35225](https://github.com/nrwl/nx/pull/35225))

**Cloud:**

- Self-Healing CI auto-apply (see Self-Healing section)
- MCP-related explorations for enterprise (Pylon ticket #655 captures customer interest)

**Polygraph:**

- Multi-agent support (Claude, Codex, OpenCode, Cursor) — see Polygraph section

**Docs:**

- Agent-readiness review for nx.dev (link headers, robots.txt AI rules) ([DOC-479](https://linear.app/nxdev/issue/DOC-479))
- "SEO for agents" investigation ([DOC-473](https://linear.app/nxdev/issue/DOC-473))

**Who to contact:** James, Max, Jack, Jonathan

---

## Infrastructure & Scale

Infrastructure focused on AWS GatewayAPI rollout, the Anaplan AWS migration, Valkey/Redis sentinel work, and Lighthouse cron-jobs framework.

**AWS GatewayAPI** ([INF-1334](https://linear.app/nxdev/issue/INF-1334)):

- Helm chart updated to support AWS
- TLS / external-secrets / VPC / hosted zones wired up
- HTTP listener, healthcheck, and CRDs deployed in dev
- Now in AWS development for validation before single-tenant rollout

**Anaplan AWS migration** (8 issues — they finished PoV and are moving from GCP to AWS for Private Link):

- Initial AWS yaml, AppProject, agents Terraform
- Spacelift integration
- Workflow controller deployment
- Cred rotator
- ECR endpoints + custom GitHub App env vars
- Bucket fixes

**Valkey / Redis**:

- AWS Valkey Terraform module ([INF-1315](https://linear.app/nxdev/issue/INF-1315))
- AWS Valkey sentinel deployment with sentinel-setup script ([INF-1324](https://linear.app/nxdev/issue/INF-1324))
- Azure Redis Terraform infra finalized ([INF-1234](https://linear.app/nxdev/issue/INF-1234))
- Valkey VCS cache enabled in dev / staging / prod NA + EU

**Lighthouse (Tenant MongoDB connections)** — 5 issues completed:

- Operations cluster static IP reservation ([INF-1316](https://linear.app/nxdev/issue/INF-1316))
- Operations IP allowed by default to MongoDB clusters across AWS/Azure/GCP ([INF-1317](https://linear.app/nxdev/issue/INF-1317))
- Cronjob framework for background mongo-query jobs ([INF-1327](https://linear.app/nxdev/issue/INF-1327))
- Credit-usage tool brought into Lighthouse for DPE visibility ([INF-1323](https://linear.app/nxdev/issue/INF-1323))
- Mongo connections prefer read-replicas ([INF-1321](https://linear.app/nxdev/issue/INF-1321))

**Multi-Cluster Facade** (continued from March):

- Per-downstream latency Prometheus metrics, workflow-mapping Valkey hit/miss metrics, OTel trace propagation through facade-to-downstream RPCs ([INF-1147](https://linear.app/nxdev/issue/INF-1147), [INF-1175](https://linear.app/nxdev/issue/INF-1175), [INF-1177](https://linear.app/nxdev/issue/INF-1177), [INF-1178](https://linear.app/nxdev/issue/INF-1178))
- Streaming timeout bug fix ([INF-1337](https://linear.app/nxdev/issue/INF-1337))
- Module/interface extraction review ([INF-1272](https://linear.app/nxdev/issue/INF-1272))

**Customer environment changes** (8 high-priority interrupts in April):

- **Anaplan**: ST instance migration GCP → AWS for Private Link ([INF-1322](https://linear.app/nxdev/issue/INF-1322))
- **CIBC**: Production SAML cutover ([INF-1319](https://linear.app/nxdev/issue/INF-1319)); Azure node-pool re-jig (intel→amd, ARM availability) ([INF-1335](https://linear.app/nxdev/issue/INF-1335))
- **Cisco**: SAML cert + SSO URL ([INF-1330](https://linear.app/nxdev/issue/INF-1330))
- **Caseware**: GH app env var swap ([INF-1338](https://linear.app/nxdev/issue/INF-1338))
- **Mimecast**: Anthropic API key restored ([INF-1333](https://linear.app/nxdev/issue/INF-1333))
- **Island**: Sandboxing feature enabled ([INF-1332](https://linear.app/nxdev/issue/INF-1332))
- **ClickUp**: New 2c/8gb resource class for agent permutation testing; class=2 c3d-16 added ([INF-1326](https://linear.app/nxdev/issue/INF-1326), [INF-1328](https://linear.app/nxdev/issue/INF-1328))

**EU Provider Research** — Initial plan docs and cloud-provider research published for EU-specific single-tenant offering ([INF-1308](https://linear.app/nxdev/issue/INF-1308), [INF-1310](https://linear.app/nxdev/issue/INF-1310))

**Vanta compliance** — BC/DR test documentation uploaded ([INF-661](https://linear.app/nxdev/issue/INF-661))

**Who to contact:** Steve, Patrick, Szymon, Altan

---

## Enterprise & Support Activity

April was a heavy support month with **216 Pylon tickets** from across enterprise + consumer customers. Several themes emerged that Sales / CS should be aware of:

**Recurring themes (sorted by impact):**

1. **Self-Healing CI default-on / billing surprise** — at least 2 enterprise (Mimecast cost spike) and 2 consumer (fairsdotcom $344 dispute, Codistica 300% spike) customers complained that CI cost increased significantly. The fairsdotcom dispute cites US/EU dark-pattern law and threatens chargeback. Engineering is asked to require explicit opt-in before scaffolding `npx nx fix-ci`.
2. **Cache hit rate drops** — Mimecast (cache hit rate fell to 4%, Pylon #758) and others; multiple "cache mismatch" tickets from various customers (Pylon #722, #724, #736).
3. **Self-Healing CI commit-fetch regression** — ClickUp (Pylon #784, High, on hold) — late-month regression after Cloud update; better diagnostics now in the error message but still under investigation.
4. **Contributor count / billing** — Multiple customers asking how "active contributors" is calculated; Island (Pylon #662) has ~60 duplicate identities inflating their count and is asking for dedup or canonical-GitHub-handle support. Consistent OSS-vs-paid contributor questions.
5. **Sandboxing customer interest** — Anaplan, Mimecast (sandboxing feature exploration) and Island (already enabled) all probing the new feature.
6. **Supply-chain anxiety post-axios** — Multiple customers (Skyscanner specifically) asking for guidance on pinning `nx-cloud` via lockfile.
7. **DTE / agent issues** — Multiple customers seeing intermittent DTE failures, idle-agent timeouts (CIPE hanging 35min — Pylon #681), unexpected run-count behavior.

**Highest-priority open tickets at month-end:**

- Pylon #784 (ClickUp, Self-Healing fetch failures) — High, on hold
- Pylon #758 (Mimecast, cache hit rate 4%) — Medium, waiting on us
- Pylon #754 (Mimecast/Sofie, sandbox-violations count) — Low, waiting on us
- Pylon #780 (ClickUp, credits for functional test usage) — waiting on us
- Pylon #793 (Cypress XVFB errors, Apr 28) — new
- Pylon #790 (Island, "Failed to download cached artifacts with corrupted hash") — new
- Pylon #785 (workspace not authorized) — new

**Support touch counts (top accounts):**

- ClickUp account `07e8f5e0...` — ~25 tickets in April
- ClickUp account `d0887338...` — ~15 tickets
- Mimecast (`b371760d...`) — 5 tickets
- Hudson-MX (`762ca5ec...`) — multiple billing/PO tickets
- Island (`f89331a0...`, `dc245028...`) — multiple

**Who to contact:** Steven, Miro, Tom (Support), Sales / CS leads

---

## Documentation & Developer Experience

**Docs (Jack, Caleb):**

- **Standalone blog and changelog** site fully migrated; old blog removed from `nx-dev`; `BLOG_URL` env var now required on Netlify ([DOC-478](https://linear.app/nxdev/issue/DOC-478))
- **Search restored** for blog after the rebuild ([DOC-481](https://linear.app/nxdev/issue/DOC-481))
- **Sitemap unification**: `sitemap-1.xml` (Framer), `sitemap-2.xml` (blog), `docs/sitemap-index.xml` (astro-docs) all rolled up ([DOC-486](https://linear.app/nxdev/issue/DOC-486))
- **Versioned docs**: 22.x snapshots deployed to `<version>.nx.dev/docs` ([DOC-69](https://linear.app/nxdev/issue/DOC-69))
- **Sidebar redesign**: Tutorials expanded by default, Concepts collapsed, "new" badge removed ([DOC-474](https://linear.app/nxdev/issue/DOC-474))
- **`nx commands` reference** corrected to exclude internal commands and include `generate` ([DOC-487](https://linear.app/nxdev/issue/DOC-487))
- **`nx.json` reference search ranking** fixed ([DOC-475](https://linear.app/nxdev/issue/DOC-475))
- **CLI Reference linked from Nx Release guide** ([DOC-472](https://linear.app/nxdev/issue/DOC-472))
- **Header/footer parity** with Framer marketing site (pixel-matched via Playwright/ImageMagick) ([DOC-463](https://linear.app/nxdev/issue/DOC-463))
- **Header/footer drift monitor** — new GitHub Action posts to #docs Slack channel nightly when Framer changes ([DOC-464](https://linear.app/nxdev/issue/DOC-464))
- **Image auto-optimization** for blog ([DOC-465](https://linear.app/nxdev/issue/DOC-465))
- **`nx-cloud onboard` documented** ([DOC-451](https://linear.app/nxdev/issue/DOC-451))
- **`allowUnixSockets` Claude Code sandbox docs** ([DOC-456](https://linear.app/nxdev/issue/DOC-456))
- **`nx → @nx/devkit` migration KB article** for v23 ([DOC-462](https://linear.app/nxdev/issue/DOC-462))
- **`no-output-timeout` launch template option** documented ([DOC-488](https://linear.app/nxdev/issue/DOC-488))

**Who to contact:** Jack, Caleb

---

## Breaking Changes / Action Required

- **23.0.0 betas opened** — first beta line, expect `nx` package import deprecations, `allWorkspaceFiles` removal, target spread token (`...`) support. Migration guidance: import from `@nx/devkit`, not `nx` directly ([DOC-462](https://linear.app/nxdev/issue/DOC-462)).
- **Vite 8** is now the default for new React Router apps; existing React Router users on framework mode get pinned to Vite 7 (until they upgrade).
- **ESLint v10** — Nx repo has migrated; downstream users on flat config may see slight changes from the new convert-to-flat-config behavior.
- **`@ltd/j-toml` (LGPL) replaced with `smol-toml` (BSD-3-Clause)** — a tiny user-visible API change is unlikely but worth noting for redistributors.
- **Self-Healing CI billing for enterprise** — enterprise customers being moved to paid Self-Healing for Q2; comms in progress ([NXA-1106](https://linear.app/nxdev/issue/NXA-1106)).
- **`nx connect` scaffolds `npx nx fix-ci`** — pending policy decision after fairsdotcom billing dispute. Sales / CS should be ready to discuss billing implications proactively.

---

## Coming Soon

- **Polygraph public beta** — frontend, CLI, and infrastructure foundations all complete; sign-up gating still on bypass token. Dark mode and onboarding hardened. Approaching launch readiness.
- **`nx migrate` Revamp** — three spikes completed in April: builtin migration prompts support, "Nx first-party packages only" mode, and orchestrating end-to-end agentic migrations ([NXC-4058](https://linear.app/nxdev/issue/NXC-4058), [NXC-4059](https://linear.app/nxdev/issue/NXC-4059), [NXC-4060](https://linear.app/nxdev/issue/NXC-4060)).
- **Multi-cluster facade in production** — observability metrics complete, streaming bug fixed; production rollout next.
- **AWS GatewayAPI in single-tenant** — currently in AWS dev; single-tenant rollout follows.
- **EU single-tenant region** — research and plan complete; provider selection underway.
- **Self-serve enterprise Self-Healing CI adoption email campaign** ([NXA-1103](https://linear.app/nxdev/issue/NXA-1103)).
- **Feature demos for non-enterprise users** — empty state, exit-warning, demo-mode cookie all implemented; rollout next.

---

## By the Numbers

| Metric                     | Count                                                                |
| -------------------------- | -------------------------------------------------------------------- |
| CLI stable releases        | 4 (22.6.4, 22.6.5, 22.7.0, 21.6.11)                                  |
| CLI prereleases            | 11 (22.7.0-beta.10..rc.2, 23.0.0-beta.0, 23.0.0-beta.1)              |
| Cloud changelog releases   | 22 (versions 2604.01.1 → 2604.28.1)                                  |
| Linear issues completed    | 471 across 6 teams                                                   |
| — Nx CLI (NXC)             | 91                                                                   |
| — Nx Cloud (CLOUD)         | 46                                                                   |
| — Infrastructure (INF)     | 28                                                                   |
| — RedPanda (NXA)           | 120                                                                  |
| — Quokka (Q)               | 22                                                                   |
| — Docs (DOC)               | 24                                                                   |
| Pylon support tickets      | 216 (across enterprise + consumer)                                   |
| Pylon high-priority open   | 1 (ClickUp #784); ~10 medium tickets in waiting_on_you state         |
| Blog posts published       | 3 (auto-apply suggestions, Cloudflare Pages, Tailwind sharing)       |
| Infrastructure commits     | 95 human-authored                                                    |

---

## Questions? Contact

- **Nx 22.7.0 / CLI Core**: Jason, Craigory, Leosvel
- **Self-Healing CI / AI / Agentic**: James, Jonathan, Max, Mark
- **Polygraph Standalone**: James, Max, Chau, Jonathan, Mark, Victor
- **Onboarding / CNW / `nx connect`**: Jack, Jason, Nicole, Benjamin, Dillon
- **Task Sandboxing / IO Tracing**: Rares, Louie, Craigory, Leosvel
- **Security / CVE response**: Jack, Nicole, Szymon, Altan, Chau
- **Infrastructure / GatewayAPI / Anaplan AWS / Valkey**: Steve, Patrick, Szymon, Altan
- **Cloud UI / Onboarding / Demo Mode**: Nicole, Benjamin, Dillon, Chau
- **Customer Support / Pylon escalations**: Steven, Miro, Tom
- **Documentation**: Jack, Caleb
- **JVM (Gradle / Maven)**: Louie, Jason, Craigory

_Generated on 2026-04-28. For the full technical changelog, see `2026-04-changelog.md`._
