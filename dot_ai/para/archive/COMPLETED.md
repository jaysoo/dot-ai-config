## Completed

### June 2026

- [x] PR #36123: ESLint removed rules migration fixes (2026-06-26)
  - Plan: `dot_ai/2026-06-26/tasks/pr-36123-eslint-removed-rules-fixes.md`
  - Summary: Fixed the typescript-eslint v8 removed-rules migration follow-ups on `feat/migrate-removed-ts-eslint-extension-rules`: added the non-format v7 rules missing from v8 (`ban-types`, `no-throw-literal`, `no-useless-template-literals`), guarded `formatFiles` so no-op runs do not rewrite configs, and extended the migration spec. Verified focused migration spec plus eslint build/lint.

- [x] Review PR #12084: Nx Cloud Rewind (2026-06-25)
  - Plan: `dot_ai/2026-06-25/tasks/review-pr-12084.md`
  - Summary: Reviewed https://github.com/nrwl/ocean/pull/12084 via GitHub connector and a temp worktree after Plannotator failed on unauthenticated `gh`. Found three correctness issues: exclusive Rewind period end passed to inclusive time-to-green API, contributor-count-only activity bypassing the no-cache empty state, and cumulative workspaceCreditUsage rows summed as daily deltas for task distribution detection. Targeted `testjs` suites passed locally.

- [x] DOC-537: SEO docs overhaul - nx workspace + pnpm workspace foundation MERGED (PR #36088), technology + Module Federation overview rework DRAFT (PR #36105) (2026-06-25)
  - Plan: `dot_ai/2026-06-23/tasks/seo-gsc-query-analysis.md`, Summary: `dot_ai/2026-06-25/SUMMARY.md`
  - Summary: GSC-driven SEO pass on nx.dev. #36088 (merged by jaysoo): retitled crafting-your-workspace for `nx workspace`, enriched the generated `@nx/workspace` reference page, added npm/pnpm/yarn/bun workspace recipes + per-tab tutorial links. #36105 (draft, one squashed commit on `doc-537-seo-followup`): all 33 technology intros `<Tech> Plugin for Nx` -> `Nx with <Tech>` + "Nx scales your `<Tech>` monorepo" descriptions + listing-page links; `<Tech> monorepo` in openings; standardized "Set up CI" -> `/docs/getting-started/setup-ci` on every overview; Angular overview as the `angular monorepo` landing; Module Federation overview rewritten (research + 3-judge panel) leading with the react-mfe template and the current consumer/provider generators; Next.js/Express/NestJS intros use their CNW templates. Heavy multi-agent Workflow use (research, judge panels, 32-page parallel edits) + deterministic scripts for the 87-file sweeps. Polygraph session `seo-research-80058b7a`. Follow-ups open: Next.js 14->15 deprecation (code+doc, scoped not started), Angular overview deprecated host/remote generators, plus storybook/what-is-a-monorepo/project.json metas.

- [x] NXC-4590: nx migrate crash with --include=optional - PR #36087 MERGED (2026-06-23)
  - Plan: `dot_ai/2026-06-23/tasks/nxc-4590-migrate-optional-crash.md`
  - Summary: `nx migrate --include=optional` crashed with "Cannot read properties of undefined (reading 'version')" in `generateMigrationsJsonAndUpdatePackageJson` (surfaced migrating the ocean repo). Root cause: the 4th arg to `writePromptMigrationFiles` read `packageUpdates[walkedTargetPackage].version` unguarded, but under optional the Migrator's `applyIncludeFilter()` deletes every required-closure member (including the target package, always seeded into the required set) from `packageUpdates`, so that entry is deterministically undefined. Not ocean-specific. Fix hoisted the already-safe `packageUpdates[walkedTargetPackage]?.version ?? opts.targetVersion` (used only by analytics 18 lines below) above the call and reused it (+8/-4). Exported the fn + added a regression test on the orchestration seam (the existing Migrator-level tests stop before the crash); it fails against pre-fix code with the exact reported TypeError. build-base, lint, full migrate.spec.ts (210/210) green; adversarial scan found no sibling unguarded accesses. Polygraph session `migrate-error-c1c6a147` (nrwl/nx + nrwl/ocean), Linear NXC-4590 linked.

- [x] Fix CNW template audit findings (2026-06-23)
  - Plan: `dot_ai/2026-06-23/tasks/fix-cnw-template-audit-findings.md`
  - Summary: Fixed the requested cnw-template follow-ups: TanStack AI dependency conflict by moving the TanStack AI packages to the compatible 0.34 generation and refreshing the lockfile; TanStack AI and TanStack Start README TypeScript rows now match `~6.0.3`; Angular production build no longer prerenders dynamic storefront routes and calls the API during build. Verified build/lint/typecheck, Angular `vite:test --run`, README link checks, and diff hygiene.

- [x] Nx template audit (2026-06-23)
  - Plan: `dot_ai/2026-06-23/tasks/nx-template-audit.md`
  - Summary: Audited all 12 nx.dev starter templates with subagents plus direct follow-up on the stalled Batch C check. Confirmed config layout is correct (only Angular and NestJS use project.json), all repos/generate outputs pin Nx 23.0.0, and no README 404s were found. Main issues: TanStack AI CNW install fails from TanStack AI peer mismatch; Angular production build fails without a compiler diagnostic; several repos still use TypeScript 5.9 without a clear blocker; Angular is the only confirmed TS 5 exception; several templates have absent or placeholder quality targets.

- [x] Nx docs organic search downtrend research (2026-06-23)
  - Plan: `dot_ai/2026-06-23/tasks/nx-docs-organic-search-downtrend.md`
  - Summary: Researched whether nx.dev docs' organic search decline matches broader market patterns. Found strong evidence of broad CTR pressure on informational/docs-like content from AI Overviews and zero-click behavior, plus comparable examples from Tailwind, monday.com, HubSpot, Stack Overflow-adjacent developer content, and publishers. Recommended diagnostics that distinguish ranking loss from CTR loss, plus a tooling stack spanning GSC generative AI reports, Ahrefs/Semrush, crawler audits, SERP tracking, log analysis, Core Web Vitals, and AI visibility monitoring.

- [x] Q-503: Improve CIPE upsell CTAs across key pages (ocean) - PR #11962 MERGED (2026-06-18)
  - Plan: `dot_ai/para/resources/architectures/ocean-architecture.md` (Personal Work History, 2026-06-17)
  - Summary: Gated sandboxing/resource-usage add-on upsell CTAs across surfaces (all hidden once entitled). Bigger CIPE rotating banner (per-CTA sample graphic, "Remind me later" 1-day snooze, x dismiss) moved above Managed agents; "Protect cache integrity with sandboxing" sub-label link on the overview Cache hit rate + /runs Cache hits tiles; non-clickable Sandboxing badge on the workspaces list; sandbox dashboard preview "FIX WITH AI" SUI; all preview modals wrapped in PosthogCaptureOnViewed. Replaced the Analysis-tab resource-usage banner with a locked sample of the real agent table (5 linux-medium-js agents, first row -> sample charts modal, rest blurred behind a "See per-agent resource charts" prompt) rendered under Agent utilization; sample data matches the modal's OOM story. Locked rows use filter:blur (not banned backdrop-filter); "Sample" badges. Self-healing CI scoped a polluted agent-cell e2e query. Opened against master by mistake (harness gitStatus hint) -> retargeted main. No version plan (upsell, covered by unreleased sandbox plans). Authored adversarial pre-PR review Workflows (caught a spec gap + the banned "Unlock" copy). Polygraph session `cloud-ctas-update-8c3cbeb1`.

- [x] Remote cache deprecation reach-out check (2026-06-17)
  - Plan: `dot_ai/2026-06-17/tasks/remote-cache-deprecation-reachouts.md`
  - Summary: Checked Pylon/email/support and Slack-indexed fallback searches for orgs reacting to deprecated remote cache plugins or showing migration interest in Nx Cloud remote cache. Found no direct deprecation-driven outreach; only adjacent Nx Cloud cache/usage support threads from Strike, Mimecast, Island, CIBC, and PayFit.

- [x] Cache safety blog factual/style review (2026-06-15)
  - Plan: `dot_ai/2026-06-15/tasks/cache-safety-blog-review.md`
  - Summary: Reviewed `blog/src/content/blog/2026-06-12-cache-safety-build-integrity.mdoc` for Nx and Turborepo factual correctness and consistency with the blog style guide. Main findings: correct overbroad Nx/Turbo input-hash wording, fix the invalid `tsconfig` example path, soften unsupported "protection by default" language, and make sandboxing enforcement mode precise.

- [x] Public sandbox status badge endpoint (2026-06-12) — PR #11878 merged, Polygraph session `badge-sandbox-4c2e7734`, Linear CLOUD-4623 linked
  - Summary: Public no-auth SVG badge at `/workspaces/{workspaceId}/sandbox-badge.svg` in nx-cloud. Entitlement-only: green "Build integrity by Nx" when the org has sandboxing (ENTERPRISE plan or SANDBOXING add-on), red "Build not protected" otherwise; org-name label (anti-spoofing, XML-escaped), links to Task Sandboxing docs, `?style=for-the-badge` 28px shields variant. Iterated through violations-on-default-branch + yellow state before Jack simplified to org entitlement only. Found + fixed helmet CORP same-origin blocking third-party embeds (path-scoped server.js override). Local demo of github.com/nrwl/nx and npmx.dev/package/nx with the badge injected into the README badge rows (/tmp/badge-demo). 7/7 specs, version plan included.
  - Files: `dot_ai/2026-06-10/tasks/sandbox-status-badge.md`, PR https://github.com/nrwl/ocean/pull/11878 (merged)

- [x] CLOUD-4629: Rotating CIPE CTA (sandboxing + resource usage) with per-type dismiss (2026-06-12) — PR #11871 merged, Linear Done, Polygraph session archived
  - Summary: Replaced SandboxCipeBanner with RotatingCipeCtaBanner on the CIPE run view: uniform-random pick per page load between sandbox and resource-usage upsells, per-CTA localStorage timestamp dismiss (`nx-cloud:cipe-cta-dismissed:<id>`) with 7-day expiry, legacy boolean key ignored. CTAs = typed CIPE_CTAS descriptor array inline in the component (copy, icons, docs urls, posthog names); pure `pickCipeCta` keeps the effect one line (useMemo not viable: localStorage + Math.random can't run during render). Shared `isResourceUsagePreviewEligible` extracted to model-organizations, used by CIPE details + Analysis tab loaders. Review arc: started with JSON config per original requirement, Jack reversed after reviewer flagged the JSON/presentation-map/ternary split; weight field also dropped as premature (50-50 definitional with two CTAs). No version plan — upsell work skips public changelog (saved to memory). PostHog viewed names keep dashboard continuity; dismiss event carries cta id. 6 commits, 10 new specs + 35/35 lib suite, tsc clean. nx repo in session never needed.
  - Files: `dot_ai/2026-06-12/tasks/cloud-4629-rotating-cipe-cta.md`, PR https://github.com/nrwl/ocean/pull/11871 (merged), Polygraph session `cloud-4629-rotating-banner-4e18c0c2` (archived)

- [x] NXC-4453: Document nx migrate agentic flow + --include (2026-06-10) — PR #35917 merged, Linear closed
  - Summary: Documented the Nx 23 `nx migrate` revamp across 9 files. Hub (automate-updating-dependencies) rebuilt as golden path: bare `nx migrate`, two phases (Generate applies packageJsonUpdates to package.json; Run executes migrations.json), migration shapes (generator-based ("script-based") / prompt-based; generator-only / prompt-only / hybrid), agentic flow (enable prompt, per-shape behavior, inside-agent deferral). Advanced guide: `--include` workflow (recommend `required` then `optional` per Jason - less PR bloat in large workspaces; per-plugin `nx migrate @nx/vite --include=optional` with cross-plugin caveat from Leo), multi-major, agentic flags + nx.json link. Removed deprecated `--interactive` AND the legacy `--from`/`--exclude-applied-migrations` catch-up workflow entirely. Console UI page: AI badge, prompt/hybrid card states, 23.0.0-beta.24 gate. Sidebar: KB section renamed "Installation and updates" (landing page moved to match slug + redirect in astro.config.mjs AND netlify.toml); advanced guide ended back in Platform features > Maintenance after review. Tracked Leo's evolving reference through PRs #35905 (--mode -> --include) and #35924 (supportsOptionalMigrations rename, no docs impact - property never named). validate-links run to green locally after sandbox grants (~/.m2 + ~/.gradle) - caught the label-coupled KB landing break (breadcrumbs + sidebar_group_cards slugify/match group labels). Single squashed commit, ~15 amend/force-push cycles.
  - Files: `dot_ai/2026-06-05/tasks/nxc-4453-agentic-migrate-docs.md`, `dot_ai/2026-06-10/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35917 (merged e4d35715), Polygraph session `docs-agentic--migrate-de6a34c5`

- [x] v23 docs: compat matrix alignment + technologies sidebar regroup (2026-06-10) — PR #35943 merged
  - Summary: Audited all 26 astro-docs "Supported Versions" tables against v23 `packages/*/package.json` peer deps (+ versions.ts minSupported floors + pnpm catalogs); fixed 8 stale ones (eslint missing ^10; vitest page said "@nx/vite" with ^1-^4 -> "@nx/vitest" ^3||^4; detox ^20.9->^20.0; nuxt ^3.10->^3.0; remix ^2.17.3->^2.0; express/nest separator style; removed stale storybook >=7 peer comment). Added 23.x rows to TypeScript (range unchanged), Node (26.x/24.x/^22.12.0 - Node 20 dropped per #35591), NestJS (^11), createNodes (prefers `createNodes`, `createNodesV2` deprecated alias per loader + #35893) matrices; Angular matrix needed no change. Regrouped Technologies sidebar: Frameworks & libraries = frontend-only; new Node, Java (JVM), .NET groups. CI validate-links caught that breadcrumbs/group-cards slugify sidebar group labels into `/docs/technologies-tools/<slug>` links - added the 3 missing landing pages (index.mdoc + sidebar_group_cards). Bonus bug: all 5 existing sidebar_group_cards attrs were Title Case vs sentence-case sidebar labels (exact match) so prod landing pages rendered "No pages found" - fixed all. 3 commits. Gotchas: local validate-links/dev-server blocked by gradle+dotnet toolchains in sandbox; polygraph session description update broken (plugin shells stale `session update-description`), persists via create_pr only.
  - Files: `dot_ai/2026-06-10/tasks/docs-v23-compat-matrices.md`, PR https://github.com/nrwl/nx/pull/35943 (merged), Polygraph session `docs-update-misc-updates-v23-837b8d30`

- [x] Capture analytics opt-in answer in `nx init` + CNW telemetry (recordStat) (2026-06-10) — PR #35922 merged
  - Summary: recordStat already sent the Nx Cloud prompt result; added the analytics opt-in answer as `analyticsPrompt: 'yes' | 'no' | 'unset'` in the `complete` stat for both create-nx-workspace and `nx init`. CNW: `determineAnalytics` changed boolean -> tri-state, threaded into meta (`'unset'` = not asked in CI/non-interactive; boolean behavior preserved via `=== 'yes'`). `nx init`: previously never asked the analytics prompt (deferred to first `nx` command); now asks right after the Cloud prompt, persists to nx.json (no double-prompt), records the answer. Consolidated the init helper into `ensureAnalyticsPreferenceSet(root?, interactive?)` returning the tri-state - single source of truth, no new eager module loads on the nx startup path (bin/nx.ts call site unchanged via defaults), inline union (no type alias). Review: F1 consolidation applied; triage needs-changes F1-guard (try/catch the init call like bin/nx.ts) + F4 (CNW `determineAnalytics` unit tests) applied locally; declined F2 (Ctrl+C -> 'no' persisted, pre-existing/test-pinned) + F3 (failed write still reports answer, hypothetical). tsc clean both packages; 14 + 17 + 3 tests pass. PR opened via Polygraph then merged; final F1-guard/F4 fixes not pushed (PR already merged, Jack deemed remaining feedback unimportant). Polygraph push_branch can't take amends (pull-rebase conflict) - same as CLOUD-4612.
  - Files: `dot_ai/2026-06-10/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35922 (merged), Polygraph session `capture-analytics-opt-in-22331534`

- [x] CLOUD-4612: Capture PostHog visibility events for add-on upsell CTAs (Nx Cloud / ocean) (2026-06-09) — PR #11766 merged
  - Summary: CTA click-through rates read artificially low because only page visits were tracked while the CTAs are eligibility/plan gated. Wrapped 4 surfaces so they capture `$element_viewed` on first visibility: `sandbox-cipe-banner` (CIPE runs), `resource-usage-preview-banner` (CIPE analysis), `sandbox-preview-banner` (sandbox violations sample data), `add-ons-locked-callout` (add-ons page FREE/OSS lock). Built thin lazy wrapper `PosthogCaptureOnViewed` in `libs/nx-cloud/feature-posthog` around @posthog/react's official component (NOT a reimplementation, per Jack's pushback): renders plain div until lazy `usePostHog()` client ready, then mounts official tracker with own `PostHogProvider client=` (pure context, no init). Reason: official component statically imports posthog-js (app lazy-loads it) and throws when no client initialized; wrapper also keeps jsdom specs passing (no IntersectionObserver needed on fallback path). 13 specs pass, tsc clean on touched libs. No version plan (internal instrumentation, add-on feat plans cover cycle). Commit `743dee9fe7` (amended twice, force-pushed; polygraph push_branch can't handle amends - pull-rebase conflicts).
  - Files: PR https://github.com/nrwl/ocean/pull/11766 (merged), Linear CLOUD-4612, Polygraph session `capture-visibility-ea74c849`

- [x] Disable Add-ons settings page for OSS orgs (Nx Cloud / ocean) (2026-06-09) — PR #11730 ready
  - Summary: OSS orgs saw a fully functional Add-ons page (same as paid Team) because the loader only locked the page for `plan === 'FREE'` (Hobby). Extended the lock to OSS so OSS orgs get the visible-but-locked page with the "Upgrade / View plans ->" callout, identical to Hobby (kept visible to advertise paid features). Minimal fix in `libs/nx-cloud/feature-organization-add-ons`: loader line 63 `if (organization.plan === 'FREE')` -> `if (organization.plan === 'FREE' || organization.plan === 'OSS')` (routes OSS into existing `planLocked: true` branch, skips all add-on DB reads); no nav/component changes needed (already render locked view). Added loader spec mirroring the FREE test. 28/28 tests pass. No version plan (unreleased add-ons-page-revamp feat plan covers the cycle). Coordinated via Polygraph; all ocean work delegated to child agents; nrwl/nx untouched.
  - Files: `dot_ai/2026-06-09/SUMMARY.md`, PR https://github.com/nrwl/ocean/pull/11730, Polygraph session `disable-oss-addons-1b747745`

- [x] Q-491: Scope CIPE sandbox violations banner to current CIPE + remove total (Nx Cloud / ocean) (2026-06-08) — draft PR #11733
  - Summary: CIPE page sandbox banner counted violations over a rolling 7-day branch window (shared `getWorkspaceSandboxViolations(latestOnly: true)` query with the dashboard), so "X of Y tasks" disagreed with what actually ran in the viewed CIPE (Jason flagged in Slack). Added `getSandboxViolationTaskCountForRunGroup` (distinct violating taskIds for the current run group, reusing the indexed `runGroup` filter), swapped the run-group-details loader off the dashboard query, dropped `sandboxTotalTaskCount` end-to-end, reworded banner to "N task(s) in this run has/have sandbox violations." Removed the now-false keep-in-sync comment in the dashboard loader (surfaces intentionally decoupled). tsc clean on 3 projects; timeline-container 6/6; run-group-details 18/18. No version plan (covered by unreleased sandbox-warning / task-sandboxing feat plans). 7 files, commit `2ecfc54930`, pushed + draft PR via Polygraph.
  - Files: `dot_ai/2026-06-08/SUMMARY.md`, PR https://github.com/nrwl/ocean/pull/11733, Polygraph session `fix-sandbox-3cce39e3`

- [x] NXC-4325: deprecate @nx/next withNx + composePlugins (2026-06-04) — MERGED PR #35861
  - Summary: Warn-once v23 deprecation (removal v24) of `withNx`/`composePlugins`, consolidated into `@nx/next` `deprecation.ts` (shared phase guard via `PHASE_PRODUCTION_SERVER`, dropped a magic string + `as any`). Generator now emits a plain `next.config.js` for the inferred plugin and a withNx-wrapped config for the legacy `@nx/next:build` executor (which needs it to honor `--outputPath` — regression caught by `e2e-next:next-legacy`). Verified Next 16/15/14 transpile workspace libs incl. CSS modules natively without withNx (scratch workspaces /tmp/test1,test14,test15). Migration recipe doc rewritten. Ran `/thermo-nuclear-code-quality-review` on the consolidation. Also diagnosed an unrelated `e2e-angular:misc` rspack hang as upstream (rspack 2.0.6 vs v1-only `@nx/angular-rspack`). Polygraph session `nxc-4325-0010e859`.
  - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35861, Polygraph session `nxc-4325-0010e859`

- [x] DOC-509: Surface targetDefaults spread token across task tutorials (2026-06-04) — MERGED PR #35871
  - Summary: Documented the `"..."` spread token (Nx 23.0.0) across three getting-started tutorials. Started as a one-page change to `configuring-tasks.mdoc` (new `### Extending target defaults for a project` subsection, `dependsOn: ["...", "generate-api-types"]`), grew on review (AgentEnder/Craigory) to `caching.mdoc` (per-project `inputs: ["...", ...]` example) and `reducing-configuration-boilerplate.mdoc` (inline spread example replacing a back-reference link). package.json/project.json tabs synced via `syncKey`. Review reworded `"..."` to expand whatever config the target inherits (targetDefaults OR an inferred plugin task). vale clean; validate-links deferred to CI (gradle sandbox blocks project graph). Single-repo Polygraph session `docs-spread-6df4621c`, draft PR via Polygraph, merged.
  - Files: PR https://github.com/nrwl/nx/pull/35871, Polygraph session `docs-spread-6df4621c`

- [x] NXC-4399: @nx/react multi-version support compliance (2026-06-04) — draft PR #35872, CI green
  - Summary: Redid @nx/react compliance (P19, milestone NXC-4072) in fresh Polygraph session `multi-version-jack-398d33f1`; original 2026-05-13 attempt (#35651) abandoned (branch recycled to unrelated diff). Matched merged @nx/vue precedent (#35845): React 18->19 window, `react`/`react-dom` peers, `minSupportedReactVersion` + `assert-supported-react-version.ts`, floor assert in all 17 generators + `all-generators-enforce-floor.spec.ts`, `keepExistingVersions`, react-router version map, 6 bilateral migration `requires` gates + 22.3.4 dual-lane split. Three review rounds: fixed react-router-dom version-source divergence (R1); reverted @react-router/dev/serve optional peers after `e2e-remix` proved npm auto-installs them and `react-server-dom-webpack@19` collides with remix's react@18 (R2-B1); bumped redux to RTK ^2.5.0 / react-redux ^9.2.0 to fix React 19 ERESOLVE (R2-B2). CI green on self-healing rerun `dab1a2243d`. Draft pending mark-ready.
  - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35872, Polygraph session `multi-version-jack-398d33f1`

- [x] NXC-4395: @nx/next multi-version support compliance (2026-06-04) — PR #35870, CI green, ready to merge
  - Summary: Redid @nx/next compliance (P15, milestone NXC-4072) in fresh Polygraph session `multi-4395-ae050ce9`; original #35652 closed (branch polluted with 40+ unrelated files). Mirrored merged @nx/express/node/nest precedent (#35807). Kept Next v14 per user decision (overrides findings #1/#2): window v14+v15+v16, floor 14.0.0, peer `>=14.0.0 <17.0.0`. New `assert-supported-next-version.ts` over devkit `assertSupportedPackageVersion` + floor assert in all 8 generators + `all-generators-enforce-floor.spec.ts` (sub-floor ~13.5.0). `keepExistingVersions` across all 6 generator install sites (init `?? true` + schema default, application, library, add-linting, styles.ts addStyleDependencies, add-swc-to-custom-server addSwcDependencies). Base `20.7.1-beta.0` migration gated `requires: { next: "^15.0.0" }`. Inferred plugin: no per-major branch (v14/15/16 emit identical target). CVE audit (GitHub Advisory DB high+critical, npm next) raised fresh-install pins to lowest CVE-free patch per major: next14 ~14.2.35 (no CVE-free 14.x exists), next15 ~15.5.18, next16 ~16.1.6 unchanged; eslint-config-next lockstep. 2 AI review rounds + Nx Cloud self-healing CI: fixed init keepExistingVersions plumbing, widened migration gate to bilateral `^15.0.0`, restored an inferred-plugin test a cherry-pick artifact from dead #35652 had deleted, caught 2 missed keepExistingVersions sweep sites. 18 files all under packages/next/, single commit, mergeable clean. Deviation (v14 kept) recorded as NXC-4395 comment.
  - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35870, Polygraph session `multi-4395-ae050ce9`

- [x] DOC-513: Mark Manual DTE as Enterprise-only in docs (2026-06-04) — MERGED PR #35864
  - Summary: Reframed docs per Joe's model (Nx Agents = task-distribution system on all plans; bringing your own compute = Enterprise-gated capability). Added Enterprise-only callouts to substantive pages, dropped Manual DTE from the assignment-rules intro, and did a full term + route rename "Manual DTE" -> "Bring your own compute": renamed the guide file, new route /docs/guides/nx-cloud/bring-your-own-compute, 301 redirect in astro-docs/netlify.toml, repointed nx-dev/_redirects targets. Kept the --distribute-on="manual" flag. vale 0 errors. Polygraph session docs-manual-dte-7f9e1e20.
  - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35864

### May 2026

- [x] Fix nx:run-script shell escaping (issue #34717) (2026-05-27) ✓ 2026-05-27
  - Summary: Two-commit PR [#35812](https://github.com/nrwl/nx/pull/35812) on branch `fix/34717-run-script-shell-quoting`. Root cause: `__unparsed__` joined with space and passed to `spawn(..., { shell: true })`, so shell metachars (`{}`, commas, quotes) in JSON values get re-interpreted by brace expansion. Fix reuses the existing `wrapArgIntoQuotesIfNeeded` helper from `run-commands.impl.ts` — moved it to `utils/shell-quoting.ts` in commit 1 (no-op extract), then mapped `__unparsed__` through it before joining in commit 2. Added 4-case spec for run-script. Verified end-to-end against nbarnett/nx-bug-repro: broken baseline reproduced, then patched in-tree installed nx and confirmed JSON survives intact through the spawn path. Polygraph session `triage-b9b40728` tracks repos (nrwl/nx + nbarnett/nx-bug-repro) and the PR.
  - Files: PR #35812, commits `b0b89c4018` (cleanup) + `92004a1cc4` (fix), Polygraph session https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/triage-b9b40728

- [x] NXC-4299: Native TS type stripping — review iteration (2026-05-08 -> 2026-05-19) ✓ 2026-05-19
  - Summary: Six fix-up commits on PR #35608 narrowing the fallback ladder (native strip -> tsconfig-paths -> swc/ts-node -> ESM loader register). Routed `.mts` through `loadTsFile`, surfaced `NX_NATIVE_TS_STRIP=false` opt-out hint on unrecoverable failures, force-registered ESM TS loader on dynamic-import path, gated `loadTsFile` on TS extensions to handle `ERR_REQUIRE_ASYNC_MODULE`.
  - Files: PR #35608, commits `bda1a9a7bd` -> `d665fa46fd`

- [x] Polygraph docs: move under `/docs` + Framer edge rewrite (2026-05-12) ✓ 2026-05-12
  - Summary: Multi-repo Polygraph session porting nrwl/nx's astro-docs base-path + `rewrite-framer-urls` edge function to nrwl/polygraph-docs. trypolygraph.com now serves Starlight docs under `/docs/*` and proxies everything else to `https://active-startup-540669.framer.app/<path>`, with the framer origin streaming-rewritten to `trypolygraph.com` so navigation stays on-domain. Three commits on `feat/docs-base-path-framer-rewrite`: initial port (`0e6bf54`), tried `build.format: 'file'` for trailing-slash (`d19d521` — reverted because Starlight baked `.html` into sidebar links + canonical URLs), final pattern matching nx exactly: `publish = "dist/docs"` + `/docs/* -> /:splat` rewrite (`d086def`). Workflow used two parallel read-only investigation child agents + one implementation child via Polygraph delegate-subagent. Side fix: polygraph-docs `.husky/pre-push` crashes on ≤20-commit branches with unset `origin/HEAD` (failing `git rev-parse <sha>~20` concatenates literal arg with rev-list fallback into newline-joined `$from`) — worked around locally with `git remote set-head origin main`; flagged real fix in PR body.
  - Files: `dot_ai/2026-05-12/SUMMARY.md`, `dot_ai/2026-05-12/tasks/polygraph-docs-base-path-and-framer-rewrite.md`, PR https://github.com/nrwl/polygraph-docs/pull/4

- [x] NXC-4156: Remove SVGR from @nx/rspack (v23) (2026-05-08) ✓ 2026-05-08
  - Summary: PR [#35611](https://github.com/nrwl/nx/pull/35611) merged at 19:36 UTC (`9f18c6ae2f`). Mirror of v22 webpack SVGR removal for rspack. Stripped `svgr` option from `withReact` / `NxReactRspackPlugin` / `WithReactOptions`, deleted `SvgrOptions`, consolidated standalone `\.svg$` rule into images rule in `apply-web-config`. Added `update-23-0-0-add-svgr-to-rspack-config` migration (versioned `23.0.0-beta.9`) inlining a `withSvgr` helper into user configs. Three CI e2e failures all confirmed unrelated (2 git filter-branch infra, 1 master-broken MF test).
  - Files: `dot_ai/2026-05-08/SUMMARY.md`, `dot_ai/2026-05-08/tasks/nxc-4156-rspack-svgr-removal.md`, PR #35611, merge commit `9f18c6ae2f`

- [x] NXC-4430: Tailwind v3 -> v4 PR polish + screenshots, MERGED (2026-05-06 -> 2026-05-08) ✓ 2026-05-08
  - Summary: PR #35594 merged at 19:50 UTC (`2445010810`). Final day work: rewrote PR description with v4 utility renames (`shadow-sm -> shadow-xs`, `rounded -> rounded-sm`) + Tailwind v4 upgrade-guide links; triaged screenshots into `dot_ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4/` (8 keepers, 11 dropped); backfilled task plan documenting scope, gotchas, verification.
  - Files: `dot_ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4.md`, `dot_ai/2026-05-08/SUMMARY.md`, PR #35594, merge commit `2445010810`

- [x] NXC-4448: Cypress 15.14 bump + remove stale Vite 8 guard — MERGED (2026-05-08 -> 2026-05-13) ✓ 2026-05-13
  - Summary: PR [#35613](https://github.com/nrwl/nx/pull/35613) merged as `d43c0c0a7e`. Cypress 15.14.0 added Vite 8 support (cypress-io/cypress#33078); nx had stale `^15.8.0` pin + a `vite >= 8` throw guard in `component-configuration`. Bumped versions, removed guard, split `packageJsonUpdates` (cypress + dev-server independently gated), wrote `remove-experimental-prompt-command` codemod, dropped 8 Vite-7-downgrade workarounds in e2e. Unblocked NXC-4154.
  - Files: PR #35613, merge commit `d43c0c0a7e`, `dot_ai/2026-05-08/SUMMARY.md`

- [x] NXC-4374: Add Node 26 to docs compat matrix (2026-05-08) ✓ 2026-05-08
  - Summary: PR #35623 merged at 15:37 UTC (`767d30eb28`). Adds Node 26 to documented support matrix.

- [x] NXC-4451: Drop Node 26 from nightly matrix until playwright/yauzl fix (2026-05-08) ✓ 2026-05-08
  - Summary: PR #35626 merged at 16:41 UTC (`78daae3be1`). Drops Node 26 from CI nightly because of unresolved playwright/yauzl incompat. Pairs with #35623 — docs say supported, CI defers actual coverage until upstream fix.

- [x] NXC-4154: Vite 7 -> 8 migrations — beta version verified (2026-05-08) ✓ 2026-05-08
  - Summary: Confirmed `packages/vite/migrations.json` already targets `23.0.0-beta.9` on origin (past the published `beta.8`). Local fully in sync — no push needed.
  - Files: commit `07d5add639` (origin/NXC-4154)

- [x] NXC-4430: Migrate Tailwind v3 to v4 (graph + nx-dev) (2026-05-06) ✓ 2026-05-06
  - Summary: PR [#35594](https://github.com/nrwl/nx/pull/35594) opened. Bumped `tailwindcss` `3.4.4 -> 4.1.11` (root + nx-dev/nx-dev pkg, all pinned exact), added `@tailwindcss/postcss 4.1.11`, dropped `@tailwindcss/aspect-ratio` (built into v4). Replaced 6 JS `tailwind.config.js` with CSS-based config (`@import 'tailwindcss'`, `@plugin '@tailwindcss/typography'` (and forms), `@source` paths, `@custom-variant dark (&:where(.dark, .dark *))`) and swapped 6 `postcss.config.js` to `@tailwindcss/postcss`. Codemod renamed v3 utilities (`shadow-sm -> shadow-xs`, `rounded -> rounded-sm`, blur, drop-shadow, backdrop-blur — 50 renames across 28 files) per Tailwind v4 upgrade guide; codemod scoped to JSX `className=`/`class=` attrs and `clsx|cn|twMerge|cva|classnames(...)` args after attempt 1 corrupted TS prop names + CSS `blur(...)` template literals. Added v3-compat `@layer base` border-color shim (gray-200 fallback) per upgrade guide's default-border-color note. Custom typography `prose code::before/after` overrides moved to plain CSS. Two real gotchas: `@source` extglob `!(*.stories|*.spec)` is unsupported in v4 — patterns matched zero files, so feature-ai utilities (`grid`, `w-12`, `dark:bg-zinc-800`) never made it into the bundle and /ai-chat shipped unstyled until I switched to plain dir paths + `@source not '**/*.{spec,test,stories}.*'` (the idiom astro-docs already used); pnpm `file:` deps cache stale source so `pnpm install --force` was needed after touching nx-dev/ui-* and graph/ui-*. Cytoscape "Cannot read properties of undefined (reading 'split')" on graph-client release-static is pre-existing on master, not a regression. Verified with builds + storybook builds + visual diff against prod /ai-chat (pixel-match). Single commit `91e822c036`, 50 files +337/-648.
  - Files: `dot_ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4.md`, `dot_ai/2026-05-06/SUMMARY.md`, `dot_ai/2026-05-08/SUMMARY.md` (PR description polish + screenshot colocation), PR #35594, commit `91e822c036`

- [x] NXC-4159: Drop Node 20 support and bump @types/node (2026-05-06) ✓ 2026-05-06
  - Summary: Removed Node 20 from e2e + nightly matrices (`e2e-matrix.yml`, `nightly/process-matrix.ts`) and ESLint docs (Node 20 EOL Apr 2026). Bumped `@types/node` repo catalog `^20.19.10` → `^24.11.0` (matches `mise.toml` runtime). Generator `typesNodeVersion` `'20.19.9'` → `'^22.0.0'` across 9 plugin `versions.ts` files (cypress, react-native, js, web, angular, node, react, jest, angular BC) + 1 vue lib snapshot. Renamed `nodeTLS` → `lowestNodeLTS` in `process-matrix.ts` (typo fix per Jack — was always meant to be "lowest LTS"); kept single-LTS semantics for non-core plugin projects. Added Node 26.0.0 to nightly matrix on both Linux + macOS for early validation (152/256 jobs). Fixed type narrowing in `packages/nx/src/utils/perf-logging.ts` exposed by `@types/node@24` tightening — `detail` moved from base `PerformanceEntry` to `PerformanceMark`/`PerformanceMeasure` subclasses; cast `getEntries() as PerformanceMeasure[]` since observer is configured with `entryTypes: ['measure']`. Branch pushed (`NXC-4159`), commits `89fae8e8e9` + `8a49d3611a`. PR opened via push URL (gh CLI blocked from sandbox). Initial CI run had 2 flaky e2e failures (maven `ECOMPROMISED` from verdaccio race; cache-no-daemon Jest 35s timeout on slow runner) — Jack reran the pipeline.
  - Files: `dot_ai/2026-05-06/SUMMARY.md`, commits `89fae8e8e9` + `8a49d3611a`

### April 2026

- [x] DOC-498: Edge function rewrite-framer-urls 500s on bot probes with leading // (2026-04-30) ✓ 2026-04-30
  - Summary: WordPress vuln scanners send `GET //wp/wp-includes/wlwmanifest.xml`. `new URL(pathname, framerUrl)` at `rewrite-framer-urls.ts:205` parses `//wp/...` as a protocol-relative URL — `wp` promoted to host, fetch DNS-fails, function 500s. Fix collapses leading `/+` to `/` and short-circuits common probes (`wp-(includes|admin|content)`, `xmlrpc.php`, `wlwmanifest`, `.env`, `.git/`) with a 404. Reproduced on prod with `curl --path-as-is` (without that flag curl normalizes `//` → `/` and you can't repro). Linear DOC-498, branch `doc-498-edge-function-bot-probe-fix`, commit `62a48ca6e7`, [PR #35527](https://github.com/nrwl/nx/pull/35527).
  - Files: `dot_ai/2026-04-30/SUMMARY.md`, `dot_ai/2026-04-30/tasks/doc-498-edge-function-bot-probe-fix.md`

- [x] Issue #35455: `@nx/s3-cache 5.0.3` causes `tokio-runtime-worker` panic — root-caused, fixed in 5.0.4 (2026-04-29) ✓ 2026-04-29
  - Summary: Root cause was a 36-byte UUID-format value in the `NX_POWERPACK_ENCRYPTION_KEY` GitHub secret (32 hex chars + 4 dashes), bypassing AES-256's mandatory 32-byte key requirement. The 5.0.3 publish on Apr 23 was the first to actually inject the env var into the cargo build (the 1Password entry from Sept 2024 had the wrong format all along but went unused). Reproduced locally by building nx-key with a deliberate 36-byte env var + adding a length-print to `crypto.rs:37` — matching `left: 36, right: 32` panic. Fixed by pulling the correct 32-byte key from the prod API server env and republishing as 5.0.4 (first beta attempt 5.0.4-beta.1 still panicked due to Nx Cloud remote cache hit on `build-rust` — `nx.json`'s `rust` namedInput doesn't include the env var so cache treats new build as identical input; resolved with `--skip-nx-cache`). 5.0.4 verified safe by transitivity: 5.0.2 ↔ prod API ↔ 5.0.4 all use the same KEY_X to encrypt/decrypt license blobs. Six follow-up hygiene issues identified for separate PRs.
  - Files: `dot_ai/2026-04-29/SUMMARY.md`, `dot_ai/2026-04-29/tasks/issue-35455-s3-cache-panic.md`

- [x] NXC-4178: Remove deprecated stylesheet options from non-Angular generators (2026-04-28) ✓ 2026-04-28
  - Summary: PR [#35103](https://github.com/nrwl/nx/pull/35103) merged (commit `d1e9a4349a`). Removed `--style=less`, `--style=styled-components`, `--style=styled-jsx`, `--style=@emotion/styled` from React/Next/Nuxt/Vue/Web/Workspace generator schemas + `VALID_STYLES`. Existing `.less` keeps compiling via new `deprecated-less-loader.js` wrappers in webpack/rspack with `__NX_LESS_DEPRECATION_WARNED` env-var dedup. Public-API drops: `cssInJsDependenciesBabel` (`@nx/react`), `lessVersion` (`@nx/vue`). Internal dead version constants removed from next/react/vue/rsbuild. Final day: rebased on master after #35049 (Tailwind) merged — 27 conflicts resolved by keeping master's tailwind + our additional removals; PR shrank 214→93 files. Three Plannotator review rounds: glob tightening, env-var-based HMR-safe dedup, stale URL drop, breaking-change marker, snapshot restoration after an earlier `-u` regenerate against broken local env baked in pre-#34965 legacy snapshots, dead-version cleanup.
  - Files: `dot_ai/2026-04-28/SUMMARY.md`, PR #35103, merge commit `d1e9a4349a`

- [x] NXC-3711: Remove Tailwind CSS setup-tailwind generators (2026-04-28) ✓ 2026-04-28
  - Summary: PR [#35049](https://github.com/nrwl/nx/pull/35049) merged (commit `933eb69826`). Removed 5 `setup-tailwind` generators (angular/react/next/vue/remix), `--style=tailwind`, `--addTailwind`, and `tailwind` style from CNW. `@nx/{angular,react,next,vue}/tailwind` kept but warn at runtime, full removal in Nx 24. Final day: addressed leosvelperez review (restored institutional catch-comment, BYO-Tailwind auto-detect in next cypress-component-configuration, added 4 deprecation-warning specs). Consolidated `graph/*/tailwind.config.js` to `ui-*/src` + `shared/src` globs. PR description rewritten caveman-lite. Two rebases on master.
  - Files: `dot_ai/2026-04-28/SUMMARY.md`, PR #35049, merge commit `933eb69826`

- [x] Ban `{% callout %}` in astro-docs, migrate to `{% aside %}` + new `{% deep_dive %}` (2026-04-24) ✓ 2026-04-24
  - Summary: Removed `callout` tag from `markdoc.config.mjs` (build hard-errors on reuse), added `{% deep_dive %}` tag (transform fixes `type: 'deepdive'`, reuses `Callout.astro`). Migrated 8 callouts across 8 files: 5 → `deep_dive`, 3 → `aside` (one `warning` → `caution` since Starlight has no warning type). Added "Markdoc tags" section to `STYLE_GUIDE.md` with old→new mapping. Added `.vale/styles/Nx/MarkdocCallout.yml` error-level rule (pattern `callout\s+(type|title)` — Vale's `TokenIgnores` blocks any regex containing `{`, `%`, `/` from matching Markdoc braces even with `scope: raw`, so the rule anchors on the required attribute instead). Verified on positive/negative cases + clean full-docs run across 498 files. Changes live on `fix/issue-33331` branch, uncommitted. Full build not run — worktree missing `node_modules`.
  - Files: `dot_ai/2026-04-24/tasks/callout-to-aside-migration.md`, `dot_ai/2026-04-24/SUMMARY.md`

- [x] DOC-462: KB article for migrating `nx` imports to `@nx/devkit` (2026-04-23) ✓ 2026-04-23
  - Summary: New recipe under Guides → Tips & Tricks explaining `nx` = CLI, `@nx/devkit` = public API. Includes `{% llm_copy_prompt %}` block for AI-driven migration, before/after code (project graph, generator, executor), common-symbols table by category, `@nx/devkit/testing` + `@nx/devkit/ngcli-adapter` subsections, and a "file an issue" escape hatch. Gemini review caught a non-existent `nx/src/generators/utils/format-files` Before path and flagged the missing testing-entry guidance in the LLM prompt — both fixed. Side fix in `markdoc.config.mjs`: the `llm_copy_prompt` `extractText` was stripping inline code (backticks), links, and ordered-list numbering from every page using the tag. Commit `6ddad14371`, pushed to `origin/DOC-462`. Also added a "Commit body style" rule to CLAUDE.md enforcing caveman-style terse commit bodies.

- [x] NXC-4182: Revert React Router Vite 7 workaround (now supports Vite 8) (2026-04-21) ✓ 2026-04-21
  - Summary: `@react-router/dev` 7.14.2 expanded its Vite peer dep to include `^8.0.0`, so the workarounds across #35101, #35110, and this branch's prior commits are no longer needed. Bumped `reactRouterVersion` to ^7.14.2, added a 22.7.0 packageJsonUpdate migrating `@react-router/*` to 7.14.2, removed the `useViteV7: true` force-flag in the React app generator, removed dead `useViteV7` schema field, and removed the pre-generate Vite/Vitest downgrade block in the e2e test. PR #35365 (squashed commit `4ff192abc7`, 6 files, +43/-20).

- [x] DOC-486: Sitemap needs to include blog (2026-04-21) ✓ 2026-04-21
  - Summary: Shipped both sides of the blog-sitemap wiring. **nx repo** (`DOC-486` branch, commit `c0085fcebb`): new consolidated `additional-sitemaps.ts` edge function proxying `/sitemap-1.xml` (Framer) and `/sitemap-2.xml` (nx-blog), replacing the previous `framer-sitemap.ts`. Updated `patch-sitemap-index.mjs` to reference `/sitemap-2.xml`. **nx-blog repo** (`feature/doc-486-publish-sitemap`, commit `09531fd`): new `generate-sitemap.mjs` (196 URLs), and full build refactor — scripts pared to `dev`/`build`/`preview`, all build steps are now cacheable `nx:run-commands` targets, `build` is `nx:noop` fanning out to `generate-feeds`/`generate-sitemap`/`pagefind` in parallel after `vite-build`.

- [x] DOC-479: Low-effort agent-readiness improvements for nx.dev (2026-04-20) ✓ 2026-04-20
  - Summary: Shipped Link response headers (RFC 8288) on Framer-proxied pages, Content-Signal directive in robots.txt, and Next.js `beforeFiles` rewrite routing `nx.dev/robots.txt` through astro-docs. PR #35348. Follow-up #35351 restored sitemap generation (removed as side effect of DOC-478 cleanup). Deferred Agent Skills Discovery index after research — no major agent client consumes `.well-known/agent-skills/` yet.

- [x] DOC-478: Clean up nx-dev to ai-chat, api, courses only (2026-04-16) ✓ 2026-04-17
  - Summary: Stripped nx-dev down to /ai-chat, /api/query-ai-handler, /api/query-ai-embeddings, /courses. Deleted top-level docs/ (~333MB). Removed 9 unused nx-dev/* libs, simplified feature-ai, removed conformance rules and scripts. ~148k lines deleted. PR #35315.

- [x] DOC-69: Versioned docs snapshot script (2026-04-10) ✓ 2026-04-10
  - Summary: Built `scripts/create-versioned-docs.mts` — creates orphan branches with pre-built static docs for Netlify branch deploys (v18-v22). Auto Node switching via mise, `NETLIFY_NEXT_PLUGIN_SKIP` for static serving. PR #35264.

- [x] DOC-476: Bring back "no workspace" CTA in CI tutorial (2026-04-10) ✓ 2026-04-10
  - Summary: Restored cloud.nx.app workspace creation CTA to self-healing CI tutorial. Added skip-ahead guidance for users who already have a CI workflow from cloud onboarding.

- [x] Netlify edge function perf: streaming + CDN cache + timing (2026-04-08) ✓ 2026-04-09
  - Summary: Streamed Framer proxy via TransformStream, added Netlify-CDN-Cache-Control with stale-while-revalidate, added timing logs + Server-Timing headers across all edge functions. PR #35215.

- [x] NXC-4210: Fix generateLockfile ignoring npm overrides (2026-04-07) ✓ 2026-04-09
  - Summary: Fixed two bugs: `normalizePackageJson()` stripping `overrides` field, and `findTarget()` dropping dependency edges when npm overrides force versions outside declared semver range. PR #35192.

- [x] NXC-4197: Supply chain hardening — pin transitive deps as direct deps (2026-04-02) ✓ 2026-04-08
  - Summary: Flattened 110 deps (34 direct + 76 transitive) to pinned versions via `scripts/expand-deps.ts`. Inlined `@yarnpkg/parsers`, removed `front-matter`, replaced `jest-diff` with `@jest/diff-sequences`. PR #35159.

- [x] NXC-4143: Cycle reminder script + workflow (2026-03-25) ✓ 2026-04-08
  - Summary: Cycle reminder script and GitHub Actions workflow for automated Linear cycle reminders.

- [x] DOC-474: Update docs sidebar for tutorial engagement (2026-04-07) ✓ 2026-04-07
  - Summary: Removed "New" badge from Tutorials, expanded Tutorials by default, collapsed "How Nx Works" and "Platform Features". PR #35194.

- [x] NXC-4169: Dependabot fixture noise reduction (2026-03-28) ✓ 2026-04-07
  - Summary: Reduced Dependabot alert noise from test fixtures. PR #35072. Follow-up NXC-4170 for 19 high-severity alerts in real deps.

- [x] DOC-463: Match Framer header and footer (2026-04-01) ✓ 2026-04-01
  - Summary: Pixel-matched blog header/footer to Framer (nx.dev). Inter font, exact layout measurements via Playwright/ImageMagick. Added hover dropdown menus for Solutions and Resources. Footer updated to 5 columns with copyright bar.

- [x] DOC-466: Add tutorial series ToC to tutorial pages (2026-04-01) ✓ 2026-04-01
  - Summary: Added "Tutorial Series" aside with numbered list to all 8 tutorial pages. Prerequisites standardized as plain paragraphs. PR #35120.

- [x] DOC-465: Build-time image optimization for blog (2026-04-01) ✓ 2026-04-01
  - Summary: Added sharp-based responsive WebP generation (640w, 1280w, original) for 1064 blog images. Nx task pipeline with caching. Fixed broken /documentation/ media paths across 15 posts. Filed DOC-469 for testimonial styling. PR nrwl/nx-blog#1.

### March 2026

- [x] CLOUD-4403: Add Node 22/24 agent image tags to cloud-infrastructure config maps (2026-03-31) ✓ 2026-03-31
  - Summary: Added `ubuntu22.04-node22.22-v1` and `ubuntu22.04-node24.14-v1` to all 12 agent-configuration config maps across all environments and enterprise customers. PR #4702 (cloud-infrastructure).

- [x] NXC-4176: Custom React workspace fails with Vite 8 and React Router (2026-03-31) ✓ 2026-03-31
  - Summary: Force Vite 7 when React Router is used in framework mode via `useViteV7` flag passed through vite configuration generator. PR #35101.

- [x] CLOUD-4029: Track Node 22 default agent image request (2026-03-30) ✓ 2026-03-30
  - Summary: Added Node 22.22 and Node 24.14 agent base images with Go 1.26 and pnpm 10. Closed stale PR #9093, created PR #10571 (ocean), merged. Follow-up CLOUD-4403 for cloud-infrastructure config map.

- [x] CLOUD-4401: Ctrl+C during onboarding prints readline stacktrace (2026-03-30) ✓ 2026-03-30
  - Summary: Added global uncaughtException/unhandledRejection handlers in `interactiveOnboarding()` using `isPromptCancelledError` to exit cleanly on Ctrl+C. PR #10568 (ocean), merged.

- [x] CLOUD-4400: Suppress url.parse() deprecation warning during CLI commands (2026-03-30) ✓ 2026-03-30
  - Summary: Monkey-patched `process.emitWarning` in client-bundle entry point to suppress DEP0169 from follow-redirects. PR #10569 (ocean), CI green.

- [x] #35068: Bump picomatch 4.0.2 → 4.0.4 (2026-03-30) ✓ 2026-03-30
  - Summary: Security fix — bumped picomatch in pnpm catalog to resolve two high-severity CVEs (method injection + ReDoS) across 6 @nx/* packages. PR #35081.

- [x] NXC-4172: Handle "." and absolute paths as workspace name in CNW (2026-03-30) ✓ 2026-03-30
  - Summary: Added `resolveSpecialFolderName()` to detect `.`/`./` and absolute paths before validation. Threaded `workingDir` through `CreateWorkspaceOptions`. PR #35083 merged.

- [x] NXC-4168: Add JSON Meta Telemetry to nx init (2026-03-28) ✓ 2026-03-30
  - Summary: Switched `recordStat` from CSV to JSON meta matching CNW format. Added start/complete/error/cancel events to `nx init`. PR #35076 merged.

- [x] NXC-4166: CNW Angular Bundler Validation (2026-03-28) ✓ 2026-03-30
  - Summary: Added early validation in `determineAngularOptions` to reject invalid bundlers for Angular presets. PR #35074 merged.

- [x] NXC-4171: Bump sass for vue/nuxt Vite 8 compat (2026-03-28) ✓ 2026-03-30
  - Summary: Bumped sass version for vue/nuxt presets for Vite 8 compatibility. PR #35073 merged.

- [x] NXC-4165: CNW apps preset fix — cancelled (2026-03-28) ✓ 2026-03-30
  - Summary: Cancelled — not worth addressing, will monitor CNW errors.

- [x] NXC-4167: CNW Yarn 4 PnP Fix — cancelled (2026-03-28) ✓ 2026-03-30
  - Summary: Cancelled — not worth addressing, will monitor CNW errors.

- [x] Follow up on Next.js cleanup PR #34730 (2026-03-06) ✓ 2026-03-20
  - Summary: PR #34730 merged 2026-03-20.

- [x] NXC-4153: Fix CNW Non-Interactive Mode + Template Shorthands (2026-03-27) ✓ 2026-03-27
  - Summary: Fixed 22.6.0 regression where non-interactive mode crashed without `--preset`. Default to `nrwl/empty-template`. Added shorthand template names (angular, react, typescript, empty). PR #35045.

- [x] NXC-4113: A/B Test Cloud Prompt Copy in CNW (2026-03-27) ✓ 2026-03-27
  - Summary: Re-enabled cloud prompt with 3 A/B copy variants tied to flow variant. Emphasizes remote caching, CI speed, mentions GitHub/GitLab, free tier, 2-min setup. Dimmed "never" option. Branch pushed.

- [x] NXC-4152: Fix Cypress CT tests failing with Vite 8 (2026-03-27) ✓ 2026-03-27
  - Summary: Added `useVite7ForCypressCT(tree)` helper to Angular and React cypress-component-configuration tests to work around Vite 8 guard in `@nx/cypress@22.7.0-beta.5`.

- [x] CNW Template Updates 22.6.1 → 22.6.2 (2026-03-27) ✓ 2026-03-27
  - Summary: Migrated all 4 CNW templates to Nx 22.6.2. Manual fixes needed for Vite 8, Angular 21.2.5, and localhost registry leak.

- [x] CNW Skill Improvements (2026-03-27) ✓ 2026-03-27
  - Summary: Added 3 guardrails to cnw-update-templates skill: localhost registry check, npm audit, framework version staleness detection.

- [x] DOC-452: Topic-Based Tutorial Series (2026-03-25) ✓ 2026-03-26
  - Summary: Replaced monolithic tutorials with 8 focused topic pages. Progressive disclosure, AI-agent friendly, workspace-agnostic. PR #34998 merged.

- [x] DOC-457: Webinar banner light mode support (2026-03-26) ✓ 2026-03-26
  - Summary: Made WebinarNotifier theme-aware — light mode gets white bg/dark text/dark CTA matching Framer marketing site; dark mode unchanged. PR #35029.

- [x] Docs: Getting started tutorial links (2026-03-26) ✓ 2026-03-26
  - Summary: Added consistent next steps and tutorial links across all getting started pages. Replaced cards with bullet lists. PR #35024.

- [x] NXC-4141: Reduce Push to GitHub Errors (2026-03-25) ✓ 2026-03-25
  - Summary: Added timeouts to CNW GitHub push flow (1s/10s/30s tiered), switched to execAndWait, eliminated error.log (#34482), added GitHubPushError with telemetry. PR #35011.

- [x] CLOUD-4390: ClickUp Exit Code 2 Investigation (2026-03-25) ✓ 2026-03-25
  - Summary: Investigated DTE runs showing status:2. Root cause: latent `maxOf(task.code)` bug in MarkTasksAsCompleted.kt + tsc exit code 2 + continuous assignments batching. UI fix in ocean#10513.

- [x] NXC-4112: Auto-open browser on Cloud "yes" (2026-03-25) ✓ 2026-03-25
  - Summary: Added auto-open browser for Cloud setup URL during CNW. Skips in CI, fails gracefully. PR #35014.
  - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35014

- [x] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110) ✓ 2026-03-25


- [x] Look through all TODO(v23) comments and add tasks for them ✓ 2026-03-25


- [x] Help Nicole with onboarding to hit 600 per week ✓ 2026-03-25


- [x] Take cloud stats script and build into lighthouse (2026-02-28 09:09) ✓ 2026-03-25

- [x] Ask Alexis about Colum sending hardware back (2026-03-03 13:52) ✓ 2026-03-25
  - For offboarding


- [x] Ask Alexis to update levels in Wagepoint and TriNet (2026-03-03 13:53) ✓ 2026-03-25

- [x] Ask Alexis to move people to the right manager in Wagepoint (2026-03-03 13:53) ✓ 2026-03-25

- [x] DOC-446: Telemetry Documentation (2026-03-17) ✓ 2026-03-17
  - Summary: Created telemetry reference page, added analytics property to nx.json reference, sidebar entry. Modeled after Turborepo/Astro docs. PR #34884.
  - Files: `.ai/2026-03-17/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34884

- [x] DOC-393: Writing Style Linting — Vale + Claude Skill (2026-03-06) ✓ 2026-03-06
  - Summary: Added Vale prose linter with 11 custom Nx rules (3 tiers), `.vale.ini` config, cacheable Nx target, mise.toml integration, and `nx-docs-style-check` Claude skill with IA audit + style validation. Commit `15d9a0ab9b`. CI green.
  - Files: `.ai/2026-03-06/specs/writing-style-linting.md`

- [x] NXC-4030: Security CVE Cluster (2026-03-05) ✓ 2026-03-05
  - Summary: Bumped copy-webpack-plugin to ^14.0.0, css-minimizer-webpack-plugin to ^8.0.0, @module-federation/* to ^2.1.0, koa to ^3.1.2, next to ~16.1.6. Added noErrorOnMissing for copy-webpack-plugin v14 compat. Added migrations for 22.6.0-beta.10. PR #34708, CI green.
  - Files: `dot_ai/2026-03-05/SUMMARY.md`

- [x] NXC-4035: Surface clearer CNW SANDBOX_FAILED error (2026-03-05) ✓ 2026-03-05
  - Plan: `dot_ai/2026-03-04/tasks/nxc-4035-cnw-sandbox-error-surfacing.md`
  - Summary: Removed `--silent` from PM install commands, increased maxBuffer, added structured error with exit code/log file/actionable hint, added missing telemetry for AI agent `needs_input`, migrated to CnwError. PR #34724.

- [x] NXA-1075: nx-import Skill — Rounds 3-4 Validation + JEST.md + Gaps Report (2026-03-04) ✓ 2026-03-04
  - Summary: Created JEST.md reference file, ran rounds 3-4 validation (8 scenarios × 4 rounds, all PASS), updated TESTING-PLAYBOOK.md with lessons learned, generated comprehensive GAPS-REPORT.md (14 outstanding gaps prioritized), pushed VITE.md/NEXT.md/JEST.md + updated SKILL.md to nx-ai-agents-config PR #74 (28 files across 6 agent formats).
  - Files: `.ai/2026-03-04/SUMMARY.md`, `~/.claude/commands/nx-import/GAPS-REPORT.md`

- [x] Review Vite import results and make it repeatable (2026-03-04) ✓ 2026-03-04
  - Summary: Completed as part of NXA-1075. Created TESTING-PLAYBOOK.md for repeatable process, validated all scenarios, generated gaps report.
  - Files: `~/.claude/commands/nx-import/TESTING-PLAYBOOK.md`

- [x] DOC-436: Fix broken Netlify image URLs on docs (2026-03-04) ✓ 2026-03-04
  - Summary: Added `/.netlify/*` to Framer proxy edge function excludedPath so image CDN URLs pass through to Next.js→astro-docs rewrite chain.
  - Files: `.ai/2026-03-04/SUMMARY.md`

- [x] DOC-429: Task Sandboxing Documentation (2026-03-04) ✓ 2026-03-04
  - Summary: Created full sandboxing feature doc page with SVG diagram, 6 screenshots, examples, cloud settings section. Multiple rounds of feedback from Rareș. PR #34686 (draft, CI green).
  - Files: `.ai/2026-03-04/SUMMARY.md`

- [x] NXC-4020: Restore CNW prompt flow to v22.1.3 (2026-03-02) ✓ 2026-03-02
  - Plan: `.ai/2026-03-02/tasks/cnw-revert-prompts-to-22.1.3.md`
  - Summary: Reverted human-visible CNW flow to match v22.1.3 exactly. Fixed `accessToken=undefined` bug, restored cloud prompt wording, split preset/template flows. PR #34671, CI green.

- [x] February 2026 Cross-Functional Digest (2026-03-02) ✓ 2026-03-02
  - Plan: `.ai/2026-03-02/tasks/nx-digest-2026-02-crossfunctional.md`
  - Summary: Generated monthly digest covering 457 issues across 6 teams, 6 CLI releases, 24 Cloud releases, ~160 infra commits. Companion technical changelog also produced.

- [x] DOC-428: Review All CLI and Cloud Links ✓ 2026-03-02
  - Plan: `.ai/2026-03-02/tasks/DOC-428-review-cli-cloud-links.md`
  - Summary: Full audit of nx.dev links in nx + ocean repos. Found 10 broken 404s, fixed `:slug*` generator bug, fixed redirect ordering, deleted legacy redirect-rules.js files, applied all fixes to `_redirects` + `netlify.toml`.

- [x] Update all links for docs to use new URL ✓ 2026-03-02
  - Covered by DOC-428 above.

### February 2026

- [x] Framer _must_ launch this week ✓ 2026-02-27

- [x] Nx Easy Issues: Work through top 11 AI-suitable issues (2026-02-23 15:00) ✓ 2026-02-26
  - Plan: `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`
  - Goal: Triage and fix community issues ranked by AI suitability
  - Top picks: #32126, #34492, #34391 cluster, #34399, #34279, #34172, #34542, #34300, #32832, #32481, #31495

- [x] Consolidate Netlify edge functions & add error handling (2026-02-19 19:45) ✓ 2026-02-26
  - Context: Edge function timeout crash reported on nx.dev (`01KHW77GJRWVJH26SK2C16RYG5`). Two chained edge functions on every `/docs/*` request add overhead.
  - Files: `astro-docs/netlify/edge-functions/`
  - Tasks:
    1. Merge `add-link-headers.ts` and `track-page-requests.ts` into a single edge function (both match `/docs/*` for HTML requests, currently chained via `context.next()`)
    2. Add `try/catch` + `console.error` around `context.next()` calls for better diagnostics on timeouts
    3. Add `AbortController` timeout (5s) to GA4 fetch in `context.waitUntil` to prevent hung isolates
    4. Review `track-asset-requests.ts` for the same improvements (matches `*.txt`, `*.md`)
    5. Test locally with `netlify dev` and verify edge function logs show correctly
    6. Check Netlify dashboard edge function logs around 4:31 PM ET Feb 19 for the crash details

## In Progress

This week:

- [x] DOC-415: Move nx-dev redirects to Netlify \_redirects (2026-02-25)
  - Summary: Moved 1,231 redirect rules from Next.js serverless `redirects()` config to a plain Netlify `_redirects` file processed at CDN edge. Faster, more resilient to outages.
  - PR: https://github.com/nrwl/nx/pull/34612

- [x] Fix #34399: Redundant vite.config.ts generation for vitest projects (2026-02-25)
  - Summary: Removed redundant `createOrEditViteConfig` call from `@nx/js` library generator that was creating a `vite.config.ts` with ESM-only `import.meta.dirname` alongside the correct `vitest.config.mts`. Fixed tests in js and plugin packages.
  - PR: https://github.com/nrwl/nx/pull/34603

- [x] Follow up on `op` and `gh` CLI usage with 1Password (2026-02-18 17:15) ✓ 2026-02-25
  - Victor noticed people rarely have 1Password popping up during screenshares
  - Check with everyone that they're using `gh` CLI with 1Password integration
  - Post reminder message in #dev channel
  - Mention during all hands

- [x] #30146: Pruning docs guide + error message fix (2026-02-23)
  - Plan: `.ai/2026-02-23/tasks/issue-30146-investigation.md`
  - Summary: Created "Pruning Projects for Deployment" guide, updated "Bundling Projects for Deployment" to match, added docs link to esbuild/rollup error messages. Two branches: `issues-30146` (docs) and `issues-30146-error-msg` (code).

- [x] CS-84: Connect Pylon to Linear (2026-02-23 14:34)
  - Plan: `.ai/2026-02-23/tasks/cs-84-connect-pylon-to-linear.md`
  - Goal: Enable Pylon-Linear integration for support issue tracking and sync

  - Linear: https://linear.app/nxdev/issue/NXC-3641
  - Plan: `.ai/2025-12-29/tasks/nxc-3641-template-updater.md`
  - Repo: `/Users/jack/projects/nx-template-updater`
  - Goal: Create `nrwl/nx-template-updater` repo to auto-update CNW templates when Nx publishes
  - Status: On hold - could be handled as an AI-assisted migration later, so no immediate action needed
  - Action: Discuss with Colum during 1:1 to confirm deprioritization

- [x] Fix: Prevent nxCloudId from being generated for new workspaces (2026-02-20) ✓ 2026-02-20
  - Plan: N/A (direct fix)
  - Summary: Added `nxCloud: 'skip'` to custom CNW flow so new workspaces don't get `nxCloudId` in `nx.json`. Updated 8 e2e tests to verify. Removed `--nxCloud=skip` from e2e utils (now handled in source).
  - PR: https://github.com/nrwl/nx/pull/34532

- [x] DOC-406: Dedupe Content & Style Guide Fixes (2026-02-19) ✓ 2026-02-19
  - Plan: `.ai/2026-02-19/tasks/doc-406-dedupe-getting-started.md`
  - Summary: Content deduplication across concepts/ and features/ pages (trimmed mental-model, consolidated remote-cache intro, added cross-references) + style guide compliance fixes across 10 pages. Created `STYLE_GUIDE.md`. Initially built custom Markdoc components but reverted — raw markdown must stay readable for AI agents.

- [x] Fix #32880 - Next.js Jest tests don't exit through Nx (2026-02-19) ✓ 2026-02-19
  - Plan: `.ai/2026-02-19/tasks/issue-32880-jest-not-exiting.md`
  - Summary: Root cause was Nx daemon socket left open by `withNx` calling `createProjectGraphAsync()` without `resetDaemonClient: true`. One-line fix in `packages/next/plugins/with-nx.ts`.
  - PR: https://github.com/nrwl/nx/pull/34518

- [x] Fix #33047 - @nx/web:file-server crash on non-GET requests (2025-10-27 09:58) ✓ 2026-02-18
  - URL: https://github.com/nrwl/nx/issues/33047
  - Goal: Handle non-GET requests properly in file-server to prevent crashes with SPA mode
  - Impact: Small scoped fix (3 engagement)
  - Notes: Root cause identified - related to http-server issue with SPA proxy

- [x] Follow up on slow jest configs for Island (2026-01-14 09:27) ✓ 2026-02-18
  - Steven and Leo for this issue https://linear.app/nxdev/issue/NXC-3718/investigate-slow-nxjest-plugin-createnodes-with-ts-configs

- [x] Follow-up CLOUD-2614: Investigate discrepancy in contributor count (2025-10-27 09:58) ✓ 2026-02-18

- [x] Follow-up NXC-3427: Multiple Nx daemons persist for same workspace in 21.6.8 (2025-10-27 09:58) ✓ 2026-02-18

- [x] Planning Meeting (2026-02-17 current) ✓ 2026-02-18
  - Plan: `.ai/2026-02-17/tasks/planning-meeting.md`
  - Topics: Blog migration to Framer, Cloud UI stats exposure

## Pending

- [x] DOC-405: Intro Page & Getting Started Improvements (2026-02-13)
  - PR: https://github.com/nrwl/nx/pull/34410
  - Restructured "Challenges of Monorepos" section with 4 focused challenges
  - Updated "What Nx Does" with 5 solutions (caching, graphs, orchestration, module boundaries, flakiness handling)
  - Updated plugin links to `/docs/plugin-registry` for better discoverability
  - Added "Update Global Installation" section to installation page (npm, Homebrew, Chocolatey, apt)
  - Summary: `.ai/2026-02-13/SUMMARY.md`

- [x] Nx.dev Website Update (2026-02-13)
  - Cherry-picked docs commits from master to website-22
  - Commit: `c0540c8846` - docs(misc): improve AX for getting started pages (#34410)

- [x] Steven 1:1 follow-up: DPE feature tracking improvements (2026-01-12 10:30) ✓ 2026-02-13
  - Wait for Steven to create comprehensive feature list with desired metadata fields
  - Review list and identify what's solved by roadmap vs change log vs new solutions
  - Discuss with Victor (roadmap owner) and Nicole (change log) about implementation
  - Consider "post-done" status in Linear for released features

- [x] Follow up with Nicole on agentic onboarding testing results (2026-02-09 14:00) ✓ 2026-02-13
  - Goal: AI creates NX workspace with cloud setup via "YOLO mode"
  - Identify gaps where manual intervention required

- [x] SPACE Metrics UI Improvements (2026-02-13)
  - Origin: Jason Jean feedback (2026-02-10)
  - PR: https://github.com/nrwl/lighthouse/pull/35
  - Implemented: YoY comparison for PR Throughput, classification footer, Dolphin 14-day target, P75 ~1.5x P50 thresholds, in-progress quarter asterisks, planning accuracy logic (above budget = green)
  - Plan: `.ai/2026-02-12/tasks/space-metrics-ui-improvements.md`
  - Summary: `.ai/2026-02-13/SUMMARY.md`

- [x] CLI Analytics for Enterprise Customers - Proposal (2026-02-12)
  - Slack: https://nrwl.slack.com/archives/C6WJMCAB1/p1770674582319699
  - Spec: `.ai/2026-02-12/specs/generator-metrics.md`
  - Created proposal for CLI analytics targeting Fidelity and Block/Square
  - Matches GA Analytics PR #34144 1:1 (all commands, not just generators)
  - Enterprise-only data collection, fire-and-forget ingestion, weekly aggregates, 1-year retention
  - Summary: `.ai/2026-02-12/SUMMARY.md`

- [x] CLOUD-4255: Remove Misleading Title for Deferred Connection (2026-02-12)
  - Linear: https://linear.app/nxdev/issue/CLOUD-4255
  - PR: https://github.com/nrwl/nx/pull/34416 (merged)
  - Fixed misleading "Nx Cloud configuration was successfully added" title for variant 2 deferred connection
  - Added `writeLines()` method to output banner without NX badge
  - Summary: `.ai/2026-02-12/SUMMARY.md`

- [x] Talk to Thomas about reporting structure in Wagepoint (2026-01-30 16:04) ✓ 2026-02-12

- [x] Follow-up with Victor on Roadmap (2026-01-09 09:41) ✓ 2026-02-12
  - Platform roadmap should be finalized and ready for review by end of next week. If not completed by then, raise this as a discussion topic during the 1:1 on Monday to address any blockers or get alignment on timeline.

- [x] Talk to Thomas to update Ben and others to be under me or Nicole, etc. for wagepoint (2026-02-09 11:45) ✓ 2026-02-12

- [x] Talk to Max about time zone expectations (2026-02-09 14:00) ✓ 2026-02-12
  - Need 3-4 hours overlap with Eastern team (noon ET = 6pm CET)
  - Address performance reliability concerns from Victor

- [x] Review init experience and sync with Nicole (2026-02-10) ✓ 2026-02-12
  - NX init improvements needed for AI compatibility

- [x] add Jeff to future planning meetings (2026-02-10 14:39) ✓ 2026-02-12

- [x] send email to lawyer (2026-02-12 11:49)

- [x] NXC-3898: Clarify security email usage in SECURITY.md (2026-02-11)
  - Linear: https://linear.app/nxdev/issue/NXC-3898
  - PR: https://github.com/nrwl/nx/pull/34411
  - Added "What Should Be Reported" section to clarify security email is for demonstrable, verified vulnerabilities in Nx codebase
  - Summary: `.ai/2026-02-11/SUMMARY.md`

- [x] CLOUD-4246: Add confirmation dialog for access control settings (2026-02-11)
  - PR: https://github.com/nrwl/ocean/pull/9985
  - Replaced inline Save/Cancel buttons with modal confirmation dialogs
  - Prevents accidental changes from trackpad gestures
  - Summary: `.ai/2026-02-11/SUMMARY.md`

- [x] CLOUD-3924: Show cache origin on Compare Tasks without comparison selection (2026-02-11)
  - Linear: https://linear.app/nxdev/issue/CLOUD-3924
  - PR: https://github.com/nrwl/ocean/pull/9992 (merged)
  - Fixed "Originated from" link not showing on Investigate tab unless comparison task was selected
  - Root cause: `getCacheCreationRun` calls required both baseTask AND comparorTask
  - Summary: `.ai/2026-02-11/SUMMARY.md`

- [x] Get back to Dillon re: 401K (2026-01-21 17:58) ✓ 2026-02-09

- [x] Claude plugin for Nx repo (2026-01-26) ✓ 2026-02-09
  - Create a plugin to share skills, agents, etc. with the Nx team
  - Discuss with Jason during 1:1

- [x] Potential: Consolidate CNW short URL generation (2026-01-26) ✓ 2026-02-09
  - Currently two calls to `createNxCloudOnboardingURL`: one for README (source='readme'), one for completion message (source='create-nx-workspace-success-\*')
  - Files: `packages/workspace/src/generators/new/generate-workspace-files.ts:311`, `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts:100`
  - May be intentional for separate tracking (discussed with Jason)

## In Progress

- [x] Check on Divvy vendor card that it works (2026-01-23 09:40) ✓ 2026-02-09

- [x] Add nx-console to SPACE metrics (2026-01-22 13:50) ✓ 2026-02-09

- [x] Follow-up: CNW ASCII Banner A/B Testing (2026-01-14) ✓ 2026-02-09
  - When implementing A/B testing for Nx Cloud completion message format (ASCII banner vs bordered/highlighted)
  - **Important**: Must include message format in short URL meta property for cloud analytics
  - Example: `variant-0-banner`, `variant-0-bordered`, `variant-1-banner`, `variant-1-bordered`
  - This allows tracking conversion rates per message format
  - Related: `.ai/2026-01-14/tasks/nxc-3628-remove-cloud-prompt.md` (see Follow-up Tasks section)

- [x] Google Apps Script PTO Calendar: Bug Fixes (2026-02-06)
  - Project: `/Users/jack/projects/gcal/script.js`
  - Fixed duplicate PTO bug where single-day events appeared in both Today AND Tomorrow sections
  - Root cause: time-based overlap failed for all-day events due to timezone offset
  - Fix: Added date key comparison for all-day events instead of timestamp overlap
  - Also fixed Friday display: skip "Tomorrow" section on Fridays (weekend)
  - Summary: `.ai/2026-02-06/SUMMARY.md`

- [x] Agentic CNW Implementation - AI Agent Detection & NDJSON Output (2026-02-04)
  - Linear: https://linear.app/nrwl/issue/NXC-3815, https://linear.app/nrwl/issue/NXC-3628
  - Branch: `agentic-onboarding`
  - Commit: `f79065d44a` - feat(core): add AI agent detection and NDJSON output for CNW
  - Implemented AI detection via env vars (CLAUDECODE, OPENCODE)
  - NDJSON streaming output with progress stages
  - Non-interactive mode with explicit `--template` requirement
  - GitHub setup instructions (gh CLI with timeout, fallback to /new URL)
  - Structured success/error results with hints
  - Spec: `.ai/2026-02-03/specs/agentic-cnw-onboarding.md`
  - Summary: `.ai/2026-02-04/SUMMARY.md`

- [x] Google Apps Script PTO Calendar: Daily "Today + Tomorrow" Feature (2026-02-04)
  - Project: `/Users/jack/projects/gcal/script.js`
  - Extended daily notifications to show both today AND tomorrow's events
  - Added event filtering by day (`filterEventsForDay`, `eventOverlapsDay`)
  - New formatting for Today/Tomorrow sections (`formatDaySection`, `formatDailySlackPayload`)
  - Gives advance notice of tomorrow's PTOs for better planning
  - Summary: `.ai/2026-02-04/SUMMARY.md`

- [x] DOC-395: Server-Side Page View Tracking (2026-02-02)
  - Linear: https://linear.app/nxdev/issue/DOC-395
  - PR #1: https://github.com/nrwl/nx/pull/34283 (merged - initial implementation)
  - PR #2: https://github.com/nrwl/nx/pull/34286 (follow-up fixes)
  - Created `track-page-requests.ts` edge function for HTML pages on `/docs/*`
  - Fixed double-counting in `track-asset-requests.ts` (simplified path patterns)
  - Added comprehensive `excludedPath` for fonts, images, pagefind, OG images
  - Uses `server_page_view` event name in GA4
  - Plan: `.ai/2026-02-02/tasks/DOC-395-server-page-tracking.md`

- [x] NXC-3806: Nx Worktree Cache Sharing (2026-02-02)
  - Linear: https://linear.app/nxdev/issue/NXC-3806
  - Commit: `36466fb1b0` - feat(core): share cache between git worktrees
  - Implemented automatic cache sharing between git worktrees
  - Worktrees use main repo's `.nx/cache` instead of separate caches
  - Key insight: workspace-data must remain per-workspace (daemon state)
  - Cache DB moved to cache directory with `linkTaskDetails=false`
  - Files: `cache-directory.ts`, `cache.ts`, `cache-directory.spec.ts`
  - Plan: `.ai/2026-02-02/tasks/worktree-cache-sharing.md`

### January 2026

- [x] Google Apps Script PTO Calendar Fix (2026-01-31)
  - Project: `/Users/jack/projects/gcal/script.js`
  - Fixed timezone issues causing "end before start" display bug
  - Removed brittle manual +5h/+8h offsets, implemented consistent UTC formatting
  - Fixed multi-day all-day events showing only first day (now shows full range)
  - Grouped events by person, merged consecutive days into ranges
  - Separated holidays into dedicated section
  - New output format with emojis and improved readability
  - Summary: `.ai/2026-01-31/SUMMARY.md`

- [x] DOC-380: Docs Layout Whitespace on Large Screens (2026-01-30)
  - Linear: https://linear.app/nxdev/issue/DOC-380
  - Fixed excessive whitespace on large screens (>1600px) in Astro docs
  - Final approach: Push TOC to right edge using `justify-content: space-between`
  - Initially tried max-width centered layout but reverted per user preference
  - Files: `astro-docs/src/styles/global.css`
  - Branch: DOC-380

- [x] DOC-392: Reduce nx-dev Next.js Build Memory Usage Below 8 GB (2026-01-30)
  - Linear: https://linear.app/nxdev/issue/DOC-392
  - Fixed OOM errors on Netlify (11+ GB → under 8 GB)
  - Added `experimental.cpus: 1` to limit static generation workers
  - Upgraded Next.js from 14.2.28 to 14.2.35
  - Added `NODE_OPTIONS: "--max-old-space-size=4096"` to deploy-build target
  - Created `netlify.toml` with `@netlify/plugin-nextjs` for proper SSR deployment
  - Added platform-specific `netlify` configurations to build targets
  - Updated `next-sitemap.config.js` to detect `NETLIFY` env for correct paths
  - Branch: DOC-392
  - Files: `next.config.js`, `project.json`, `netlify.toml`, `next-sitemap.config.js`, `package.json`

- [x] DOC-385: Fix Failing Internal Link Checks After /launch-nx Removal (2026-01-29)
  - Linear: https://linear.app/nxdev/issue/DOC-385
  - PR: https://github.com/nrwl/nx/pull/34255
  - Fixed broken `/launch-nx` link in release-notes.mdoc → `/blog/launch-nx-week-recap`
  - Root cause: `/launch-nx` was in ignore list since Sept 2025 when I created the file
  - Found cache input bug: `sitemap.xml` (index) cached instead of `sitemap-0.xml` (URLs)
  - Fixed cache inputs to use `sitemap*.xml` glob patterns
  - Commit: `f46c029cac`
  - Files: `astro-docs/validate-links.ts`, `nx-dev/nx-dev/project.json`, `release-notes.mdoc`

- [x] CLOUD-4211: Add 10% Scroll Depth Tracking to Docs and Non-Docs Pages (2026-01-28)
  - Linear: https://linear.app/nxdev/issue/CLOUD-4211
  - Added 10% threshold to scroll tracking on both nx-dev and astro-docs
  - Fixed bug where early scroll events were lost during 500ms initialization delay
  - astro-docs now has scroll tracking (previously had none)
  - Final thresholds: `[10, 25, 50, 75, 90]`
  - Commit: `8bc5c81eff`
  - Files: `nx-dev/feature-analytics/src/lib/use-window-scroll-depth.ts`, `astro-docs/public/global-scripts.js`

- [x] NXC-3783: Add Nx Cloud Connect URL to Template README (2026-01-28)
  - Linear: https://linear.app/nxdev/issue/NXC-3783
  - Implemented dynamic insertion of Nx Cloud connect URL into template READMEs
  - Pure function `updateReadmeContent()` replaces content between `<!-- BEGIN: nx-cloud -->` and `<!-- END: nx-cloud -->` markers
  - Section format: "## Finish your Nx platform setup" with link to connect URL
  - 6 test cases using inline snapshots (no mocking)
  - Commit: `5f46f71f62`
  - Files: `packages/create-nx-workspace/src/utils/template/update-readme.ts`, `packages/create-nx-workspace/src/utils/template/update-readme.spec.ts`

- [x] DOC-236: Support Markdown, llms.txt, and llms-full.txt (2026-01-27)
  - Linear: https://linear.app/nxdev/issue/DOC-236
  - Implemented LLM-friendly resource discovery following llmstxt.org specification
  - Created `/docs/llms-full.txt` endpoint concatenating all docs (~2.87MB, 503 pages)
  - Created `add-link-headers.ts` edge function for HTTP Link headers on docs pages
  - Edge function only processes `Accept: text/html` requests to minimize costs
  - Added nx-dev rewrite for llms-full.txt, fixed trailing slash normalization
  - Fixed Netlify edge function immutable response issue in both edge functions
  - Commit: `cf1b252d19`
  - Files: `astro-docs/src/pages/llms-full.txt.ts`, `astro-docs/netlify/edge-functions/add-link-headers.ts`, `astro-docs/netlify.toml`, `nx-dev/nx-dev/next.config.js`

- [x] CLOUD-4189: CNW Cloud Prompt Variants with Promo Message (2026-01-26)
  - Linear: https://linear.app/nxdev/issue/CLOUD-4189
  - Extended CNW flow variants to 3: Variant 0 (current prompt), Variant 1 (old prompt), Variant 2 (no prompt, promo message)
  - Variant 2 auto-connects and shows "Want faster builds?" completion with promo subtext
  - Both template and custom flows support all three variants
  - Commit: `4381fee3d0`
  - Files: 5 files in `packages/create-nx-workspace/`

- [x] DOC-386: Add Netlify edge function to track .txt and .md asset requests in GA4 (2026-01-23)
  - Linear: https://linear.app/nxdev/issue/DOC-386
  - Added `track-asset-requests.ts` edge function to send page_view events to GA4
  - Tracks all `.txt` and `.md` requests with custom dimensions (is_ai_tool, file_extension, etc.)
  - Configured in `astro-docs/netlify.toml`
  - Requires GA4 setup: `GA_MEASUREMENT_ID` and `GA_API_SECRET` env vars in Netlify

- [x] NXC-3754: Clean up CNW GitHub URL Messaging When gh Push Fails (2026-01-23)
  - Linear: https://linear.app/nxdev/issue/NXC-3754
  - Consolidated two redundant GitHub URL messages into single message with `?name=...` parameter
  - Updated error handler, completion messages, and SIGINT handler
  - Commit: `2d91f52580`
  - Files: 6 files in `packages/create-nx-workspace/`

- [x] NXC-3718: Implement `NX_PREFER_NODE_STRIP_TYPES` Environment Variable (2026-01-23)
  - Linear: https://linear.app/nxdev/issue/NXC-3718
  - Added env var to skip swc-node/ts-node when Node.js 22.6+ native TS type stripping is available
  - Still registers tsconfig-paths for path mapping support
  - Documented in `astro-docs/src/content/docs/reference/environment-variables.mdoc`
  - E2E test: `e2e/js/src/js-strip-types.test.ts` (tests jest, cypress, playwright config loading)
  - Files: `packages/nx/src/plugins/js/utils/register.ts`

- [x] NXC-3753: Make Nx Cloud CLI commands noop with warning (2026-01-22)
  - Linear: https://linear.app/nxdev/issue/NXC-3753
  - Made all Nx Cloud CLI commands check for `nxCloudId` before executing
  - Commands now show warning and exit gracefully without erroring
  - Special handling for `record`: still runs underlying command, just warns about recording
  - Files: `packages/nx/src/command-line/nx-cloud/` (8 files)

- [x] Lighthouse Architecture Documentation (2026-01-22)
  - Created comprehensive architecture docs for the lighthouse Phoenix app
  - File: `.ai/para/resources/architectures/lighthouse-architecture.md`
  - Documented: Expected State, Space Metrics, Emails contexts
  - Technical: Phoenix 1.8/LiveView, PostgreSQL, GitHub/Linear/Mandrill APIs

- [x] DOC-381: Clean up banner.json and add to gitignore (2026-01-22)
  - Linear: https://linear.app/nxdev/issue/DOC-381
  - Removed generated banner.json files from astro-docs and nx-dev
  - Added both paths to .gitignore
  - Files are generated during static builds, shouldn't be tracked
  - Commit: `b35d2a720a`

  - URL: https://linear.app/nxdev/issue/NXC-3427
  - Assignee: Max Kless | Priority: High | Status: In Progress
  - Issue: Multiple daemons observed after `nx reset`, causes "Waiting for graph construction" hangs
  - Customer: Block (via Caleb)

- [x] AI Usage Stats Baseline Collection (2026-01-21)
  - Established baseline for AI Amplification Index metric
  - Collected data from 11/18 team members across 3 tools (Claude Code, Cursor, Open Code)
  - Created apples-to-apples I+O/Day metric (excludes cache reads)
  - Key finding: Cursor vs Claude Code is 3.4x (not 50-100x) when compared fairly
  - Set 30-day collection cadence for trend tracking
  - Files: `dot_ai/para/areas/productivity/ai-usage/2025-01-21/`

- [x] DOC-382: Update Releases Page for Nx 22 Details (2026-01-21)
  - Linear: https://linear.app/nxdev/issue/DOC-382
  - Updated supported versions table: v22 Current, v21/v20 LTS
  - Removed expired LTS versions (v19, v18\*, v17)
  - Updated version examples to use v22.2.0
  - Files: `astro-docs/src/content/docs/reference/releases.mdoc`

- [x] NXC-3628: Remove Cloud Prompt from CNW for Variant 1 (2026-01-14)
  - Linear: https://linear.app/nxdev/issue/NXC-3628
  - Implemented A/B testing variant 1: skips cloud prompt, always shows platform link
  - Variant 1: No `nxCloudId` in nx.json, uses GitHub flow for URL generation
  - Added `(https://github.com/new)` to completion message when user hasn't pushed
  - Fixed expired cache file bug in ab-testing.ts (was doing 50-50 after expiry)
  - Files: 8 files in `packages/create-nx-workspace/`

- [x] DOC-376: GA Scroll Depth Tracking for Marketing Pages (2026-01-14)
  - Linear: https://linear.app/nxdev/issue/DOC-376
  - Added `useWindowScrollDepth` hook to track scroll depth on marketing pages (/, /react, /java, etc.)
  - Events: scroll_0, scroll_25, scroll_50, scroll_75, scroll_90
  - Files: `nx-dev/feature-analytics/src/lib/use-window-scroll-depth.ts`, `nx-dev/ui-common/src/lib/default-layout.tsx`
  - Commit: `897b528155`

- [x] Cut patch release for PR #34026 (20.8.x and 22.x) (2026-01-07) ✓ 2026-01-13
  - PR: https://github.com/nrwl/nx/pull/34026
  - Fix: `@nx/plugin:migration` generator failing with ESLint flat configs containing variable references
  - Customer: Fidelity (via Slack: https://nrwl.slack.com/archives/C6WJMCAB1/p1767627484254249)
  - Versions: 20.8.x and 22.x branches
  - **Action**: Discuss with Jason tomorrow (2026-01-09) to determine who will handle the release

- [x] Discuss Maven paywall decision with Victor (2026-01-07) ✓ 2026-01-13
  - From Jason 1:1: Push for clarity on revenue path or abandon gating
  - Address underlying motivations not clearly communicated
  - Team pushback: Colum against, James raised issues at all hands
  - **Update 2026-01-08**: Victor mentioned this is being brought up with execs today. Sync up with him tomorrow (2026-01-09).

- [x] Get a prod banner URL from Ben (2026-01-09 08:50) ✓ 2026-01-13
  - Banner is https://ready-knowledge-238309.framer.app/api/banners
  - Needs to be ready to go live next week

- [x] Review Patrick L5 doc (2026-01-09 08:29) ✓ 2026-01-13
  - Steve shared it on Slack, review and give feedback.

- [x] Remix vulnerability (2026-01-09 13:44) ✓ 2026-01-13
  - Remix has multiple CVEs requiring updates, but when Chau and Nicole attempted to upgrade to the fixed versions, it caused a regression in production, forcing a rollback. Ben is currently investigating the specific bugs so the team can properly patch and test on snapshot and staging environments before deploying to production again. The most critical bug is currently causing CI failures that need to be resolved first.
  - Looks like we have multiple version of react router which is leading to problems -- Altan noticed this and Chau found a way to pin the right versions

- [x] Send email for Nrwl Claude team plan (2026-01-12 09:53) ✓ 2026-01-13
  - Review the team's Claude.ai usage for this week to identify members actively using the Chat feature. Remove any team members who haven't used the team plan, as they're likely subscribed to their own Max plan individually. Each removed seat saves $30/month on the team subscription.
  - Ben is now on MAX plan
  - Chau is on personal MAX plan

- [x] DPEs sync (2026-01-12 09:18) ✓ 2026-01-13

- [x] Effy reviews (2026-01-09 08:42)
  - Due today, must get done before lunch!

- [x] Fix #32439 - MaxListenersExceededWarning with run-many (2025-10-27 09:58) ✓ 2026-01-09
  - URL: https://github.com/nrwl/nx/issues/32439 Goal: Fix event listener management in task runner to prevent MaxListenersExceededWarning
  - Impact: High (18 engagement - 4 comments, 14 reactions)
  - Notes: Reproducible in nx-examples repo, affects run-many and affected commands

  - URL: https://linear.app/nxdev/issue/CLOUD-2614
  - Assignee: Nicole Oliver | Priority: High | Status: Todo
  - Issue: Org shows 7/5 contributors used but list only shows 6 (null contributors not discounted)
  - Fix: Change in aggregator to discount "null" contributors from count
  - Customer: Org 65811494657f145ed525b196

- [x] Test out the para TUI app (2026-01-08 20:28) ✓ 2026-01-09
  - This is a comprehensive test of the TUI application to verify all PARA method features work correctly. Test the complete workflow including creating, viewing, editing, and archiving items across all four categories (Projects, Areas, Resources, Archive), as well as navigation, search, and any keyboard shortcuts. Verify that items can be moved between categories and that the UI responds correctly to all user interactions.
  - Testing plan:
    - [x] Navigation: Arrow keys (j/k/up/down), Tab between panes, Enter to select
    - [ ] Projects: Create new project, view details, edit content, archive project
    - [ ] Areas: Create new area, view details, edit content, archive area
    - [ ] Resources: Create new resource, view details, edit content, archive resource
    - [ ] Archive: View archived items, restore item from archive
    - [ ] Search: Full-text search across all categories, filter by category
    - [x] Keyboard shortcuts: Test all documented shortcuts (?, q, /, etc.)
    - [ ] Modal interactions: Create/edit modals open and close correctly
    - [ ] Error handling: Invalid input, empty states, edge cases

- [x] Infra Sync (2026-01-06) ✓ 2026-01-09
  - Docker Layer Caching as a feature to push, also NPM mirrors
    - Lots of value add for ST
  - It'd be a lot of work to replicate what our infra does for reliability, etc.

- [x] Check Mexico travel requirements (2026-01-08 21:06)
  - Research entry requirements for Mexico trip:
    - [ ] **Passport**: Verify validity (must be valid for duration of stay; 6+ months recommended)
    - [ ] **Visa**: Check if visa required based on citizenship (US/Canadian citizens typically visa-free for tourism up to 180 days)
    - [ ] **FMM (Tourist Card)**: Determine if Forma Migratoria Múltiple is needed and how to obtain (airline may provide or fill out online at INM website)
    - [ ] **COVID-19 requirements**: Check current vaccination/testing requirements (most restrictions lifted but verify)
    - [ ] **Travel insurance**: Consider travel medical insurance (recommended but not required)
    - [ ] **Return/onward ticket**: May be required as proof of departure
    - [ ] **Proof of accommodation**: Hotel reservations or address where staying
    - [ ] **Sufficient funds**: May need to show proof of financial means
    - [ ] **Customs declaration**: Fill out customs form on arrival

- [x] Talk to Jason (due 2026-01-09) ✓ 2026-01-08

- [x] 2025 Productivity Report for Victor (2026-01-08)
  - Report: https://docs.google.com/document/d/1AYjxss9Eba0QWuGsx7TZmqsF9FDeurZABi8kjTRQ2Mc/edit?tab=t.0
  - Key findings: August layoffs and AI adoption had net positive impact on productivity
  - Metrics: Issues per developer up (14.9→22.8), TTFR down 68% (2.5h→0.8h), PR volume up 22.7%, LOC changed up 133% YoY
  - 2026 focus: SPACE framework with 5 key metrics (PR throughput, AI usage, planning accuracy, PR cycle time, P1 resolution time)

### December 2025

- [x] Module Federation Dynamic Manifest and Static Fallback Issues (2025-08-21 10:49)
  - Dictation: `.ai/2025-08-21/dictations/module-federation-dynamic-manifest-issues.md`
  - Goal: Fix URL property handling in dynamic manifests and static fallback mechanism
  - Next steps: Create reproduction repo, communicate with Colum, review on Friday
  - This was skipped due to being stale

- [x] Add up unused TOIL hours (2025-12-19)
  - https://docs.google.com/spreadsheets/d/1fDF8XD1i9zZcPArRpnx0i0QVVxFYl2hXBsRzVEG_iiY/edit?gid=0#gid=0

- [x] Planning Meeting (2025-12-19)
  - Notes https://www.notion.so/nxnrwl/2026-Jan-Feb-planning-notes-2ce69f3c238780b78fe4e5a2e8a5b786
  - Roadmap and team moves
  - eBPF tracing of I/O and inputs/outputs - Cloud-heavy architecture (80% Cloud, 20% external tooling)
  - Codspeed? We need to know performance regressions
  - Proper Docker builds -- easier to adopt Nx into existing set up
  - KB for docs: https://linear.app/nxdev/project/nx-knowledge-base-docs-project-0c6aee98d867/overview

- [x] Nicole 1:1 (2025-12-18)
  - Onboarding numbers follow-up on any CNW impact
  - Platform roadmap for 2026
  - Customer advisory board
  - How do we communicate better with Sales and Marketing?

- [x] Ben 1:1 (2025-12-18)
  - Self-helped self-healing ownership
  - Framer
  - Ecommerce - Caitlin and Ben

- [x] Claude Skills & Commands Repository (2025-12-18)
  - Created new repo at `~/projects/claude-skills-commands/`
  - Centralizes custom Claude Code commands and skills
  - Includes `sync.sh` script to copy commands/skills to `~/.claude/`
  - Added `identify-closeable-issues` command (from Colum's AI Show & Tell)
  - Set up `.gitignore` and `.syncignore` for sync management

- [x] Steve 1:1 (2025-12-18)
  - Tracking inventory and requests from Sale to Infra
  - How to communicate with Sales and Marketing
  - How much does agents cluster cost us? What does XYZ cost? etc.
  - ClickUp renewal coming up -- how to track usage and ROI better
  - Estimates from PoVs are hard to use for actual usage
  - A way to count and calculate disk, compute, etc.
  - NPM and Docker registries going down is fine since we mirror for free
  - Report of what Sales and DPEs need and things they need to know

- [x] DOC-360: Simplify Banner JSON Schema (2025-12-18)
  - Changed banner config from array to single object
  - Build-time fetching from Framer CMS (parses JSON from `<pre>` tag)
  - Shared `prebuild-banner.mjs` script for nx-dev and astro-docs
  - Made prebuild non-cacheable, added banner-config.json as build input
  - Commit: `cc9964cc99`

- [x] Chau 1:1 (2025-12-18)
  - Move to Red Panda starting in January
  - Focus on frontend with some backend work
  - AI Czar
  - Main responsibilities: Auth, usage screen, enterprise licensing, graph

- [x] Prepare for Partners meeting (2025-12-17)
  - Review script from Zack
    - Nx MCP Server Demo — Show how easy the setup is and demonstrate the benefits when paired with an AI tool like Cursor and Claude
      - What projects are in this workspace? Use the nx mcp
      - Add React lib -- generators are good starting points and AI can customize further
      - Ask about Nx Release
    - Nx 2025
      - Angular Rspack
      - TUI and continuous tasks
      - PNPM catalog
      - Nx Release polish + Docker
      - Started experimenting with AI migrations
      - CPU/memory tracking
      - Polyglot
        - Java (Gradle, Maven), .NET
      - Updated to latest majors for tools/frameworks
        - Angular 21
      - Node 24 support with type stripping
    - Nx 2026 Roadmap Presentation — Explain Nx's plans for 2026, covering the roadmap and highlighting things you're most excited about
      - Modern JS tooling like oxc oxfmt oxlint
      - Polyglot
        - Partial graph task running
        - Native toolchains like mise
      - Nx Release for Apps
        - More Docker work -- layer caching, docker build --push, etc.
      - eBPF tracing for input/outputs
      - More AI
        - Moving away from many generators and generator options and lean more into a solid base that AI can enhance e.g. TailwindCSS
    - Q&A — Stay on for the Q&A session at the end to field questions in your areas of expertise (though it sounds like attendance is flexible if needed)

- [x] Review Colum's AI Show & Tell: Identify Closeable Issues Command (2025-12-16 12:12)
  - Slack: https://nrwl.slack.com/archives/C06C6AP7GNN/p1765902607326319
  - Slash command `/identify-closeable-issues` for Claude to find GitHub issues that can be closed
  - Categories: Already fixed by PR, underlying tooling issue (not Nx), user config issue
  - Has guardrails and confidence scoring, report-only mode (no auto-closing)
  - Try it out for CLI team issues, evaluate results, provide feedback to Colum
  - Command file: `~/.claude/commands/identify-closeable-issues.md`
- [x] Review PR #33822 - Allow copying Prisma client from node_modules (2025-12-16)
  - PR: https://github.com/nrwl/nx/pull/33822
  - Author: parostatkiem
  - Result: Completed with optimization - added smart node_modules filtering
  - Key finding: Original PR only fixed async method, sync method was missing fix
  - Performance: Prevented 39,000% regression by conditionally allowing node_modules traversal
  - Tests: Added 4 new tests, all 12 tests pass

- [x] CNW: Investigate users re-creating workspaces after successful creation (2025-12-16)
  - Issue: Users try to create a workspace again even though one was just created successfully
  - Root cause likely: NPM warnings returned as errors confuse users
  - The "something failed but workspace exists" messaging doesn't seem to be working

- [x] Migrate Nx packages with `import = require` to ESM-compatible imports (2025-12-16)
  - Plan: `.ai/2025-12-05/tasks/esm-import-migration-plan.md`
  - Goal: Enable dual CJS/ESM compilation for remaining 35 packages

- [x] Test Nuxt 4 ai-migrations (2025-12-16)
  - Verified migration patterns work correctly

- [x] Framer Sync (2025-12-16)
  1. Which page for canary this week? -> /community
  2. Banner JSON -> let's do this week on canary
  3. Pricing and Cloud pages
  - TBD (deadline Friday for exec team for outline of pages to review next week)
  - Sync first week in January
  4. Blog?
  - GitHub sync should work for local author with AI assistance
  - Custom components: embeds (videos, tweets), code blocks with highlighting/diffs
  - Could have plugin between authored and rendered content
  - More CTAs at end of blogs - Framer can do this

- [x] Infra Sync (2025-12-16)
  - Make sure Linear tasks are the source of truth, attach relevant docs, links, PRs
  - ClickUp renewal concerns
  - Follow-up with projects like Docker Layer Caching and Hosted Redis
  - Docker, not building in images makes a lot of headaches

- [x] CLI Sync (2025-12-16)
  - Can we check with Claude what issues are related to PRs
  - Follow up with Nicole on onboarding leftover items
  - DPEs Sync to go over dotnet adoption

- [x] Follow-up CLOUD-3875: Usage page total credits not aligned with Prepaid Plan credits (2025-12-15)
  - URL: https://linear.app/nxdev/issue/CLOUD-3875

- [x] Follow-up CLOUD-2540: Allow passing working directory to start-ci-run command (2025-12-15)
  - URL: https://linear.app/nxdev/issue/CLOUD-2540

- [x] Follow-up CLOUD-3551: Remove Pro Plan option from users who previously used Nx Cloud trial (2025-12-15)
  - URL: https://linear.app/nxdev/issue/CLOUD-3551

- [x] CNW + Nest #33776 (2025-12-15)
  - URL: https://github.com/nrwl/nx/issues/33776

- [x] Add GitHub push progress indicator and timeout (2025-12-15)
  - Plan: `.ai/2025-12-03/tasks/github-push-progress-timeout.md`

- [x] Iterate on CNW templates (2025-12-15)
  - Plan: `.ai/2025-11-12/tasks/nxc-3464-pr-release-cnw-templates.md`

- [x] DPEs Sync (2025-12-15)
  - Notes: `.ai/dpe-sync/README.md`

- [x] Louie 1:1 (2025-12-15)
  - Really enjoyed agent resource work and feature work in general
  - Working on background/backend is a bit demoralizing

- [x] Altan 1:1 (2025-12-15)
  - Continuous non cachable DTE
  - Ship these things but dogfood is slow
  - Generally okay with Red Panda work but feels like he doesn't add much value beyond execution
  - Would like some time to do team multiplier work

- [x] Victor 1:1 (2025-12-15)
  - AI Czar
  - Altan working on non-Red Panda work -- one day a week? Refactors, etc. team multiplier work -- talk to Nicole, Louie, etc. to coordinate
  - Leo and Max unhappiness
  - https://www.youtube.com/watch?v=JvosMkuNxF8&t=951s AI ROI
  - Tracing I/O for Enteprise -- talk to Steve about concerns

### November 2025

- [x] Publish @nx/key with axios 1.13.2 fix (2025-11-26)
  - Branch: NXC-3519

- [x] Investigate rootDir issue in swc executor for Nx 21 (2025-11-06)
  - Repro: https://github.com/HaasStefan/nx-repro-rootDir-swc-rollup-in-angular

- [x] Test Nuxt 4 migration for Colum https://www.npmjs.com/package/nx/v/0.0.0-pr-33611-c0ec6b0 (2025-11-26 11:00)

- [x] Add Szymon to Engineering team in 1password (talk to Victor/Jeff)

- [x] Fix #33258 - "Compile TypeScript Libraries to Multiple Formats" article produces invalid packages (2025-11-18 10:30)
  - URL: https://github.com/nrwl/nx/issues/33258
  - Goal: Fix documentation article that produces invalid packages
  - Priority: High
  - Scope: docs

- [x] Fix NXC-3504 / #32492 - Storybook migration hangs during nx migrate (2025-11-21 09:21)
  - Linear: https://linear.app/nxdev/issue/NXC-3504
  - GitHub: https://github.com/nrwl/nx/issues/32492
  - Plan: `.ai/2025-11-21/tasks/nxc-3504-storybook-migration-hangs.md`
  - Goal: Add non-interactive flags to storybook automigrate command to prevent hanging during migrations
  - Impact: High (14 engagement - 2 comments, 12 reactions)
  - Notes: Investigation complete, task plan created

- [x] NXC-3508 / #29481 - nx@npm:20.3.0 couldn't be built successfully (exit code 129) (2025-11-21 11:40)
  - Linear: https://linear.app/nxdev/issue/NXC-3508
  - GitHub: https://github.com/nrwl/nx/issues/29481
  - Plan: `.ai/2025-11-21/tasks/nxc-3508-exit-code-129-investigation.md`
  - Result: Closed as version mismatch issue - users can resolve by ensuring single nx version in dependency tree
  - Root Cause: Multiple nx versions causing parallel postinstall conflicts in CI/CD
  - Low engagement (2 people), user-solvable problem

- [x] Checkout Ben's Loom and let him know if it works or not https://nrwl.slack.com/archives/C07939JBZT9/p1763393473373429 (2025-11-17 11:01 AM)

- [x] NXC-3464: PR release with CNW templates (2025-11-12 15:30)
  - Plan: `.ai/2025-11-12/tasks/nxc-3464-pr-release-cnw-templates.md`
  - Goal: Open draft PR and publish PR release for CNW templates feature
  - Context: Meta property system already exists for tracking message effectiveness

- [x] Get Node 24 merged for Nx CI (2025-11-11 9:56)

- [x] PR release for CNW template changes (2025-11-11 9:56)

- [x] JS Plugin Performance Optimizations (2025-11-10 10:19)
  - Plan: `.ai/2025-11-07/tasks/js-plugin-performance-optimizations.md`
  - Goal: Optimize nx/js/dependencies-and-lockfile plugin to reduce graph creation time
  - Priority Optimizations:
    1. Eliminate duplicate lockfile reads (50-100ms savings)
    2. Cache TargetProjectLocator instance (10-50ms savings)
    3. Cache getLockFilePath result (eliminates repeated fs checks)
  - Estimated Total Savings: 60-150ms per plugin execution
  - Files: packages/nx/src/plugins/js/index.ts, lock-file/lock-file.ts, build-dependencies/\*.ts
  - Leo will take a look at this one

- [x] Optimize @nx/js/typescript plugin buildTscTargets performance (2025-11-10 10:19)
  - Plan: `dot_ai/2025-11-07/tasks/nx-typescript-plugin-performance-optimization.md`
  - Goal: Reduce buildTscTargets from 27s to <5s on pathological workspace
  - Context: Created reproduction workspace with 6,820 tsconfig files, deep project references
  - Related: NXC-3215 typescript:createNodes performance investigation
  - Leo will combine the picomatch optimization into his PR

- [x] Fix #32236 - Invalid Jest config with Node v22.18.0 (2025-10-27 09:58)
  - URL: https://github.com/nrwl/nx/issues/32236
  - Goal: Update Jest config generation to use ESM-compatible patterns instead of `__dirname` for Node v22.18.0+ compatibility
  - Impact: High (31 engagement - 6 comments, 25 reactions)
  - Notes: Multiple workarounds exist in comments, clear root cause identified

- [x] NXC-3215: Investigate typescript:createNodes and lockfile parsing performance (2025-11-06 13:20)
  - Issue: https://linear.app/nxdev/issue/NXC-3215/investigate-performance-issues-related-to-typescriptcreatenodes-and
  - Plan: `dot_ai/2025-11-06/tasks/nxc-3215-typescript-createNodes-performance.md`
  - Goal: Optimize graph creation from 17-31s down to <10s
  - Scale: 2,073 tsconfig files, 1.5MB pnpm-lock.yaml
  - Targets: typescript:createNodes <5s (from 11s), lockfile parsing <2s (from 4.78s)

- [x] NXC-3289: Vue E2E Fails on macOS/NPM/Node 20 (2025-10-29 11:14)
  - Issue: https://linear.app/nxdev/issue/NXC-3289/vue-e2e-fails-on-macosnpmnode-20
  - Goal: Fix Vue E2E test failures on macOS with npm and Node 20

### October 2025

- [x] Look into Katerina's issue: https://github.com/mandarini/repro-nx-release/tree/not-working

- [x] Test Storybook 10 Support PR (2025-10-29)
  - PR: https://github.com/nrwl/nx/pull/33277
  - Loom: https://www.loom.com/share/b8a78adc610245a08932a927b4269e03
  - PR Release: 0.0.0-pr-33277-88af54b
  - Status: Reviewed and tested Storybook 10 migration support

- [x] Circle back with ClickUp (Caleb) when 21.x patch is out with pnpm lockfile fix (2025-10-29)
  - PR: https://github.com/nrwl/nx/pull/33223
  - Status: 21.x patch released with pnpm lockfile fix

- [x] NXC-3244: Fix pnpm Lockfile Parser Undefined Importer Crash (2025-10-23)
  - Issue: https://linear.app/nxdev/issue/NXC-3244
  - PR: https://github.com/nrwl/nx/pull/33223
  - Goal: Fix "Cannot destructure property 'specifiers' of 'projectSnapshot' as it is undefined" error
  - Problem: When workspace packages were referenced but missing importer entries, undefined values were added to output lockfile
  - Solution: Added null check before adding workspace dependency importers
  - Impact: Prevents crashes when stringifying pnpm v9 lockfiles with out-of-sync workspace packages
  - Commit: 065c8c739f

- [x] Issue #33231: Fix nxViteTsPaths Local Path Aliases and Clean-up Worker Plugin (2025-10-24)
  - Goal: Fix critical bug where local path aliases in project-level tsconfig.app.json were ignored
  - Problem: `getProjectTsConfigPath` incorrectly joined workspace root with already-absolute project root
  - Solution: Use relative path from workspace root instead of absolute path
  - E2E test added: Vite React app with local path alias (`~/*` → `src/*`)
  - Additional clean-up: Made worker plugin configuration conditional based on TS Solution setup
  - Commits: d885dc9a84 (fix), follow-up clean-up commit
  - Impact: Breaking regression fix affecting all Vite projects using nxViteTsPaths with project-level path aliases

- [x] GitHub Issues Research - Nx 22.0.0/22.0.1 (2025-10-24)
  - Goal: Identify urgent bugs and regressions in Nx 22.0.0/22.0.1 releases
  - Critical issues identified:
    1. #33231 - `getProjectTsConfigPath` path resolution bug (FIXED)
    2. #33204 - Module resolution failures (NO FIX YET)
    3. #33076 - Optimistic TypeScript caching issue (PR #33077 OPEN)
    4. #33079 - Non-input references added to project references (NO FIX YET)
  - Related PRs reviewed: #33223 (pnpm lockfile), #33217 (daemon cache)
  - Recommendations: Prioritized issues requiring immediate attention
  - Documentation: Comprehensive analysis in conversation history

- [x] Performance Benchmark: tsconfig-fix vs main Branch (2025-10-24)
  - Goal: Measure typecheck performance differences between branches
  - Command: `hyperfine "npx nx run-many -t typecheck --skip-nx-cache"`
  - Results: tsconfig-fix delivers ~41% faster execution (84.5s vs 143.8s)
  - Improvements: 59s faster, 1.7x speedup, 72% lower variance, 37% less CPU
  - Report: `.ai/2025-10-24/benchmark-comparison-summary.md`

- [x] Nx.dev Website Update - Sync master to website-22 (2025-10-23)
  - Goal: Synchronize documentation updates from master to website-22 branch
  - Process: Cherry-picked 4 commits from master (post-083b97255a)
  - Commits applied:
    1. 2402ecb576 - Fix releaseTag object notation (#33202)
    2. 7c2f3511e2 - Add programmatic API guide (#33198)
    3. ab82c7b1be - Add Release Groups and Update Dependents guides (#33200)
    4. b3c3e40490 - Update nx release docs for v22 (#33189)
  - Result: 100% success rate, no conflicts
  - Impact: website-22 now has complete Nx Release v22 documentation

- [x] DOC-270: Fixed Codeblock Line Highlighting Syntax (2025-10-22)
  - Goal: Fix incorrect line highlighting syntax in Astro documentation
  - Problem: Using `{numbers}` syntax instead of Markdoc meta syntax
  - Solution: Updated to `{% meta="{numbers}" %}` format
  - Files: 7 instances across 4 files (tutorials and Next.js intro)
  - Commit: 5ab470ec74 - "docs(misc): fix bad line higlighting in docs"

- [x] Add missing release.version options to nx-json reference (2025-10-23)
  - Goal: Document `preVersionCommand`, `versionPrefix`, and `groupPreVersionCommand` in the Version section
  - Options found in guides but missing from reference:
    1. `release.version.preVersionCommand` - runs command before versioning
    2. `release.version.versionPrefix` - controls dependency version prefixes (auto/""/~/^/=)
    3. `release.groups[name].version.groupPreVersionCommand` - group-level pre-version command
  - Location: `astro-docs/src/content/docs/reference/nx-json.mdoc` (Version section around line 504)
  - Related guides: build-before-versioning.mdoc, configuration-version-prefix.mdoc

- [x] DOC-261: Document Nx Release v22 Missing Changes (2025-10-22 19:26)
  - Plan: `.ai/2025-10-22/tasks/nx-release-v22-missing-documentation.md`
  - Goal: Add documentation for 6 Nx Release v22 changes that weren't documented originally
  - Result: Successfully rebased onto master, resolved conflicts, and added all missing features
  - Commits: c07d4a5d1a (after rebase), 7e850571d6 (additional features)
  - Features documented: preserveMatchingDependencyRanges, updateDependents options, replaceExistingContents, ReleaseClient API, custom changelog renderer

- [x] DOC-269: GitLab Source Control Integration Guide Update (2025-10-22)
  - Plan: `dot_ai/2025-10-21/SUMMARY.md`
  - Goal: Update GitLab integration documentation to reflect UI changes
  - Status: Committed locally (71b0d76400), ready for push and PR
  - Files: `astro-docs/src/content/docs/guides/Nx Cloud/source-control-integration.mdoc`

- [x] DOC-302: PNPM Catalog Support (2025-10-21 14:28)
  - Plan: `dot_ai/2025-10-21/tasks/pnpm-catalog-support.md`
  - Goal: Add documentation about PNPM catalogs for maintaining single version policy
  - Status: Complete - Added concise aside in dependency-management.mdoc
  - Commit: 366535f8c2

- [x] DOC-301: Java Introduction Page Update (2025-10-21)
  - Plan: `dot_ai/2025-10-21/SUMMARY.md`
  - Goal: Restructure Java introduction page to improve onboarding
  - Result: Moved Requirements first, added Quick Start section, marked Maven as experimental
  - File: `astro-docs/src/content/docs/technologies/java/introduction.mdoc`

- [x] Framer Migration URL Inventory (2025-10-21)
  - Plan: `dot_ai/2025-10-21/tasks/framer-migration-urls.md`
  - Goal: Create comprehensive URL inventory for Framer migration planning
  - Result: Analyzed 1,307 URLs - 73 marketing pages, 168 blog posts (docs excluded)

- [x] DOC-188: TypeDoc Module Resolution Fix (2025-10-17)
  - Issue: https://linear.app/nxdev/issue/DOC-188
  - Goal: Fix DevKit API docs to use local workspace builds instead of node_modules
  - Result: Added TypeScript path mappings to redirect module resolution to `dist/packages/`
  - Files: `astro-docs/src/plugins/utils/typedoc/typedoc.ts`, `astro-docs/project.json`

- [x] Nx v22 Migration Testing (2025-10-17)
  - Plan: `dot_ai/2025-10-17/v22-migration-test-results.md`
  - Goal: Test Nx v21.6.5 → v22.0.0-beta.7 migration across 5 workspace types
  - Result: 100% success rate (5/5) - React (3 variants), Angular, Node all passed
  - Summary: `/tmp/NX-V22-MIGRATION-SUMMARY.md`
  - Key Learning: Use explicit version `22.0.0-beta.7`, not `@next` (points to v23)

- [x] Public Changelog System Implementation (2025-10-09)
  - Plan: `dot_ai/2025-10-09/SUMMARY.md`
  - Goal: Set up git-cliff CLI tool to generate public-facing changelogs for nx-cloud and nx-api
  - Result: Created feature library `@nx-cloud/feature-changelog`, implemented `/changelog` route
  - Features: CalVer version detection, component hashtags, breaking changes section
  - Files: `libs/nx-cloud/feature-changelog/`, `tools/scripts/private-cloud/generate-changelog.ts`

- [x] DOC-260: Update TailwindCSS Guides (2025-10-08)
  - Issue: https://linear.app/nxdev/issue/DOC-260
  - Goal: Remove deprecated generator references and provide simple manual setup
  - Result: Updated React and Angular guides with v3/v4 compatible instructions
  - Files: `astro-docs/src/content/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects.mdoc`, `astro-docs/src/content/docs/technologies/react/Guides/using-tailwind-css-in-react.mdoc`

- [x] DOC-252: AI Embeddings Support for Astro Docs (2025-10-08)
  - Issue: https://linear.app/nxdev/issue/DOC-252
  - Plan: `dot_ai/2025-10-08/tasks/doc-252-astro-embeddings.md`
  - Goal: Enable AI chat to search through Astro documentation
  - Result: Implemented dual-mode system (astro/legacy), local testing flag, HTML-to-markdown conversion
  - Stats: 504 docs pages, 3,100 sections, 106 community plugins
  - Files: `tools/documentation/create-embeddings/src/main.mts`, `.github/workflows/generate-embeddings.yml`

- [x] API Documentation Integration for Embeddings (2025-10-02)
  - Plan: `dot_ai/2025-10-02/SUMMARY.md`
  - Goal: Include dynamically generated API docs in embeddings (nx-cli, nx-cloud-cli, create-nx-workspace, plugins)
  - Status: Outstanding work - need to decide between parsing built HTML or using Astro loaders
  - Options: Parse `astro-docs/dist/api/**/*.html` OR use Astro loaders from `astro-docs/src/plugins/*.loader.ts`

- [x] Embeddings Script Refactoring (2025-10-02)
  - Plan: `dot_ai/2025-10-02/tasks/embeddings-script-refactoring.md`
  - Goal: Migrate embeddings generation from Next.js to Astro documentation
  - Result: Implemented `--mode=astro` with direct source reading and URL path generation
  - Output: 504 pages, 3,100 sections, 895KB

- [x] hey just fyi - we added ai.configure-agents-check notification to GA that doesn't correspond to a feature so we should ignore it for scorecards

### September 2025

- [x] NXC-3108: Remove Deprecated Webpack Options for v22 (2025-09-23)
  - Issue: https://linear.app/nxdev/issue/NXC-3108
  - Plan: `dot_ai/2025-09-23/SUMMARY.md`
  - Goal: Remove deprecated deleteOutputPath and sassImplementation options for Nx v22
  - Result: Created migration, removed options from all interfaces/schemas, added comprehensive tests
  - Commit: 25d82d78a8 - feat(webpack)!: remove deprecated deleteOutputPath and sassImplementation options

- [x] DOC-223: Add Conditional Noindex to Old Docs Pages (2025-09-22)
  - Plan: `dot_ai/2025-09-22/SUMMARY.md`
  - Goal: Prevent search engines from indexing old documentation during Astro migration
  - Result: Added noindex meta tags when NEXT_PUBLIC_ASTRO_URL is set
  - Files: DocViewer, changelog, plugin-registry, ai-chat pages

- [x] DOC-221: Add Algolia Search to Blog Index (2025-09-19)
  - Branch: DOC-221
  - Plan: `dot_ai/2025-09-19/SUMMARY.md`
  - Goal: Add blog-only search functionality during Astro migration
  - Result: Integrated AlgoliaSearch with blogOnly prop, facet filtering for blog posts
  - Files: algolia-search.tsx, blog-container.tsx

- [x] DOC-209: Update Header Menu Items (2025-09-16)
  - Branch: DOC-209
  - Plan: `dot_ai/2025-09-16/SUMMARY.md`
  - Goal: Update header navigation and add sidebar links
  - Result: Updated tutorials link, removed Office Hours/Code examples, added Plugin Registry and Changelog to sidebar
  - Commits: 8d4b7c352c, 160b0a7cab, ef899b1a28

- [x] Sync with Colum and Leo on Component Testing (CT) for Nx 22 (2025-09-16)
  - Discuss two options for component testing configuration:
    - Option 1: Keep current defaults, no user customization
    - Option 2: Create `webpack.cy.ts` with good defaults allowing user control (requires migration)
  - Goal: Decide on approach for component testing in Nx 22

- [x] DOC-185: Add API Documentation for Core Nx Packages (2025-09-15)
  - Branch: DOC-185 (nx-worktrees)
  - Plan: `dot_ai/2025-09-15/SUMMARY.md`
  - Goal: Create API documentation pages for nx, workspace, web, plugin packages
  - Result: Created 8 new API pages, updated ~40 redirect rules, fixed broken link validation
  - Commit: 776ea2b5f2 - docs(misc): add API docs for nx, workspace, web, plugin

- [x] DOC-184 & DOC-169: Documentation URL Fixes (2025-09-12)
  - Plans: `dot_ai/2025-09-12/SUMMARY.md`
  - DOC-184: Implemented client-side routing for old documentation URLs (12 files updated)
  - DOC-169: Fixed mobile menu icon theme visibility with CSS-only approach
  - Commits: Multiple commits for DOC-184, 06d0ce43d1 for DOC-169

- [x] NXC-2493: Docker Nx Release Migration (Ocean) (2025-09-10)
  - Branch: NXC-2493
  - Plan: `dot_ai/2025-09-10/SUMMARY.md`
  - Goal: Implement nx release support for Docker images in Ocean repository
  - Result: Migrated Dockerfiles, added docker:build targets, configured release groups
  - Commit: 7a146758b (amended multiple times)

- [x] DOC-184: Client-Side Routing for Old Documentation URLs (2025-09-09)
  - Branch: DOC-184 (nx-worktrees)
  - Issue: https://linear.app/nxdev/issue/DOC-184
  - Plan: `dot_ai/2025-09-09/SUMMARY.md`
  - Goal: Prevent 404s and content flashing for old documentation links
  - Result: Created Link wrapper component with URL transformation, updated 23 files
  - Commit: 51c0936abd

- [x] DOC-185: Add Missing API Reference Pages for Core Packages (2025-09-04)
  - Branch: DOC-185
  - Plan: `dot_ai/2025-09-04/SUMMARY.md`
  - Goal: Create Astro pages for missing core package documentation (nx, workspace, plugin, web)
  - Result: Created 12 new pages with flattened URL structure, updated redirect rules
  - Commit: 57222d29ea - docs(misc): add missing API reference pages for core packages

- [x] Review Linear Stale Issues for Nx CLI Team (2025-08-19 08:50)
  - Plan created: `dot_ai/2025-08-19/tasks/linear-stale-issues-review.md`
  - Goal: Identify and review stale issues in Linear that haven't been updated in 3+ months
  - Next steps: Review with assignees, close/update stale issues

- [x] Review PR #8300 for Austin - Powerpack Conformance Allow Option (2025-08-20 15:16)
  - PR: https://github.com/nrwl/ocean/pull/8300
  - Linear Issue: NXC-2951
  - Review scheduled for: Thursday, August 21, 2025
  - Notes: `dot_ai/2025-08-20/dictations/pr-review-austin-conformance.md`
  - Goal: Review new `allow` option for Powerpack conformance, verify Mailchimp fix

- [x] Marketing & Blog Platform Requirements Gathering (2025-08-22 13:30)
  - Dictation: `.ai/2025-08-22/dictations/marketing-blog-requirements-heidi.md`
  - Goal: Evaluate platform options for migrating away from Next.js + Vercel
  - Next steps: Review requirements against platform options, get feedback from Heidi

### August 2025

- [x] Fix Astro Documentation Styling Issues (2025-08-28 13:00)
  - Plan: `.ai/2025-08-28/tasks/fix-astro-docs-styling-issues.md`
  - Branch: DOC-143
  - Goal: Fix 5 Linear styling issues for Astro docs
  - Result: Fixed active link colors, deepdive callout spacing, card styling, TOC spacing, sidebar headers
  - Screenshots: Saved in `.ai/2025-08-28/tasks/`

- [x] DOC-135: Fix H1 and Frontmatter Title Mismatch (2025-08-20 09:12)
  - Plan created: `.ai/2025-08-20/tasks/doc-135-h1-title-fix.md`
  - Goal: Remove h1 headings from mdoc files to improve visual distinction between titles and h2
  - Result: Updated 7 files - removed h1 headings, preserved sidebar labels

- [x] Docker Tagging and Publishing Investigation (2025-08-19 11:13)
  - Plan created: `.ai/2025-08-19/tasks/docker-tagging-publishing-investigation.md`
  - Goal: Understand complete Docker tagging, pushing, and publishing flow with CalVer scheme
  - Result: Documented complete flow, identified CalVer implementation in build-and-publish-to-snapshot.sh

- [x] DOC-111: Update Astro Docs Header to Match Production (2025-08-13)
  - Plan created: Work completed in nx-worktrees/DOC-111 branch
  - Goal: Update Astro docs site header to match production nx.dev header
  - Result: Successfully created custom header with version switcher, resources dropdown, proper navigation
  - Commit: 4e276a8c74 - docs(nx-dev): make header more consistent with prod headers

- [x] DOC-110: Create Index Pages for All Astro Docs Guides (2025-08-13)
  - Goal: Create comprehensive index pages for all Astro docs sections
  - Result: Created 21 new index pages across the guides section
  - Status: All files created with proper frontmatter and navigation integration

- [x] Documentation Callout Migration Fix (2025-08-12)
  - Branch: DOC-110
  - Goal: Revert aside tags back to deepdive callout format
  - Result: Successfully reverted 6 deepdive callouts across 5 files

- [x] Add All Markdoc Tags to Astro Docs Site (2025-08-08)
  - Plan created: `dot_ai/2025-08-08/tasks/add-markdoc-tags.md`
  - Branch: DOC-68
  - Goal: Add support for all markdoc custom tags from nx-dev/ui-markdoc
  - Result: Successfully integrated all 27 tags with Astro wrapper components

- [x] Fix Astro Component Children Props (2025-08-08)
  - Goal: Update Astro components to pass <slot/> as children to React components
  - Result: Updated 5 components (Personas, Cards, Testimonial, etc.)
  - Commit: 9b896d6314 - docs(misc): pass children as props from Astro to React

- [x] Debug Cookie Prompt Not Rendering (2025-08-01)
  - Plan created: `dot_ai/2025-08-01/tasks/cookie-prompt-not-rendering.md`
  - Goal: Fix issue where Cookiebot script is not rendering in nx-dev website HTML source
  - Result: Created custom Cookiebot templates and styling solutions

- [x] PTO Calendar Analysis (2025-08-01)
  - Goal: Analyze PTO data from Google Calendar for engineering team
  - Result: Complete analysis with 341 total PTO days across 8 months
  - Deliverables: Analysis scripts, JSON data, executive summary

### July 2025

- [x] Patch Release Automation for Nx (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/nx-patch-release.mjs`
  - Goal: Streamline patch release process with automated cherry-picking
  - Result: Created automation script for branch 21.3.x

- [x] Address CRITICAL(AI) sections in Docker documentation (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/address-docker-docs-critical-sections.md`
  - Goal: Improve Docker release documentation by addressing three CRITICAL(AI) sections
  - Result: Enhanced production/hotfix releases, added Nx Cloud Agents warnings, updated nx-json reference

- [x] Test nx@0.0.0-pr-32120-1cb4170 Docker release functionality (2025-07-30)
  - Plan created: `dot_ai/2025-07-30/tasks/test-nx-docker-release.md`
  - Goal: Validate Nx workspace creation with Docker support for PR builds
  - Result: All tests passed successfully

- [x] Update Nx commands to use @latest in documentation (2025-07-29)
  - Plan created: `dot_ai/2025-07-29/tasks/update-nx-commands-to-latest.md`
  - Goal: Update all docs to use `npx nx@latest` commands
  - Result: Successfully updated 27 occurrences across 23 files

- [x] Fix Astro Docs Markdown Error (2025-07-22)
  - Plan created: `dot_ai/2025-07-22/tasks/fix-astro-docs-markdown-error.md`
  - Goal: Fix TypeError when building astro-docs after rebase with master
  - Result: Build completes successfully on branch `jack/astro-docs-fix-entry-metadata`
  - Solution: Skipped renderMarkdown calls in custom loaders

- [x] Remove unused Nx Cloud tutorial images (2025-07-21)
  - Plan created: `dot_ai/2025-07-21/tasks/remove-unused-nx-cloud-tutorial-images.md`
  - Goal: Clean up orphaned images from docs/nx-cloud/tutorial directory
  - Result: Analyzed all images, removed 16 unused files

- [x] Improve nx init output (2025-07-21)
  - Plan created: `dot_ai/2025-07-21/tasks/improve-nx-init-output.md`
  - Goal: Remove generic post-init messages and provide actionable, context-specific next steps
  - Result: Removed generic messages, added context-aware next steps, created "After Running nx init" guide

### June 2025

- [x] Ocean Feature Documentation Analysis (2025-06-26)
  - Plan created: `dot_ai/2025-06-26/tasks/ocean-feature-documentation-analysis.md`
  - Raw docs update plan: `dot_ai/2025-06-26/tasks/raw-docs-update-plan.md`
  - Goal: Identify key features needing documentation and create implementation plan
  - Result: Identified 6 major features, created prioritized implementation plan

- [x] Refactor Nx Cloud Error Handling (2025-06-25)
  - Plan created: `dot_ai/2025-06-25/tasks/refactor-nx-cloud-error-handling.md`
  - Goal: Improve error handling and user experience in Nx Cloud
  - Status: Completed planning and implementation

- [x] Fix Next.js Jest JSX Transform Warning (2025-06-24)
  - Plan created: `dot_ai/2025-06-24/tasks/fix-nextjs-jest-jsx-transform.md`
  - Goal: Update Next.js generators to use next/jest.js configuration with modern JSX transform
  - Issue: https://github.com/nrwl/nx/issues/27900
  - Result: Successfully updated both app and library generators to use next/jest.js
  - Commits: f1a2dd8a5e (initial), 008d254dc4 (improvements), 752737f11e (code consolidation)

- [x] Nx Easy Issues Analysis (2025-06-24)
  - Summary: `dot_ai/2025-06-24/tasks/nx-easy-issues-summary.md`
  - Goal: Analyze nrwl/nx repository for easy-to-close issues
  - Result: Found 524 actionable issues from 535 open issues, 230 highly suitable for AI assistance

- [x] Fix PTO Data Issues (2025-08-01 15:10)
  - Goal: Correct Patrick M.'s missing May vacation and remove Victor R. who is not an employee
  - Result: Successfully added Patrick M.'s 20-day May vacation and removed Victor R. from all data
  - Updated totals: 332 PTO days (was 324), May is now peak month with 64 days

- [x] Update Nx documentation to use npx nx@latest (2025-07-29)
  - Updated docs to use `npx nx@latest` for init and connect commands
  - Commit: 9b0fb37eb6 docs(misc): make sure "npx nx@latest" is used when calling init or coonnect (#32128)
  - Goal: Ensure users always get the latest version when setting up Nx

- [x] Address CRITICAL(AI) sections in Docker documentation (2025-07-30 14:30)
  - Plan created: `.ai/2025-07-30/tasks/address-docker-docs-critical-sections.md`
  - Goal: Improve Docker release documentation by addressing three CRITICAL(AI) sections
  - Changes made:
    - Enhanced Production and Hotfix Releases section with customization examples
    - Added Nx Cloud Agents compatibility warnings in two locations
    - Updated nx-json reference docs with complete pattern documentation

- [x] Test nx@0.0.0-pr-32120-1cb4170 Docker release functionality (2025-07-30 14:35)
  - Plan created: `.ai/2025-07-30/tasks/test-nx-docker-release.md`
  - Goal: Validate Nx workspace creation with Docker support and release functionality for PR builds
  - Result: All tests passed successfully

- [x] Update Nx commands to use @latest in documentation (2025-07-29 12:41)
  - Plan created: `.ai/2025-07-29/tasks/update-nx-commands-to-latest.md`
  - Goal: Update all docs to use `npx nx@latest` commands to ensure users get latest version
  - Result: Successfully updated 27 occurrences across 23 files and formatted with prettier

- [x] Remove unused Nx Cloud tutorial images (2025-07-21)
  - Plan created: `.ai/2025-07-21/tasks/remove-unused-nx-cloud-tutorial-images.md`
  - Implementation: Analyzed all images, removed 16 unused files
  - Goal: Clean up orphaned images from docs/nx-cloud/tutorial directory

- [x] Improve nx init output (2025-07-21 13:41)
  - Plan created: `.ai/2025-07-21/tasks/improve-nx-init-output.md`
  - Implementation: Removed generic messages, added context-aware next steps
  - Documentation: Created "After Running nx init" guide
  - Goal: Remove generic post-init messages and provide actionable, context-specific next steps

- [x] MCP Server Improvements (2025-06-12)
  - Plan created: `dot_ai/2025-06-12/tasks/mcp-server-improvements.md`
  - Goal: Implement architecture and performance improvements to MCP AI Content Server
  - Next Steps: Fix race conditions, add error handling, implement incremental indexing

- [x] Debug Migrate UI Module Resolution Issue (2025-06-13 17:05) (migrated)
  - Plan created: `dot_ai/2025-06-13/tasks/debug-migrate-ui-module-resolution.md`
  - Status: Active debugging
  - Issue: Migrations fail with "module not found" in UI but work in terminal
  - Note: Fix was implemented on 2025-06-17 but awaiting verification
  - Needed to set chdir or use exec/spawn with cwd set to workspace root

- [x] Fix Top 10 Easy Issues (2025-06-17 08:00) (migrated)
  - Plan created: `dot_ai/2025-06-17/tasks/fix-top-10-easy-issues-plan.md`
  - Status: 4 issues fixed, 6 skipped, awaiting user review
  - Next steps: User to manually review and push branches

- [x] Incident Management Consolidation Documentation (2025-06-17 17:30)
  - Status: In Progress
  - Location: `dot_ai/2025-06-17/tasks/incident-management-consolidation-summary.md`
  - Goal: Documented the comprehensive consolidation of Notion incident management pages from June 13

- [x] Enhance nx-easy-issues Command with AI Feedback (2025-06-17 16:30)
  - Status: In Progress
  - Location: Modified `/Users/jack/.claude/commands/nx-easy-issues.md`
  - Goal: Enhanced the nx-easy-issues.md command file based on comprehensive feedback from Gemini AI review
  - Key enhancements: automated scoring system, dry run mode, parallel processing

- [x] SKIPPED Add ShadCN Style Option to React Generator (2025-06-19) (migrated)
  - Plan created: `dot_ai/2025-06-19/tasks/add-shadcn-style-option-react-generator.md`
  - Status: Planning phase complete
  - Goal: Add 'shadcn' as a new style option alongside existing options
  - Note: Will integrate Tailwind CSS, PostCSS, and shadcn-specific configurations
  - 9-step implementation plan defined
  - Skipped this because it's just a demo

- [x] Provide Johan with @nx/php/laravel initial implementation

- [x] Tailwind stylesheet (025-06-20 15:00)

- [x] Review Tailwind v4 support changes (2025-01-20 15:00)
  - Plan created: `.ai/2025-01-20/tasks/review-tailwind-v4-support.md`
  - Goal: Review feat/tailwind-4 branch changes for React and Vue bundler support
  - Result: Implementation is solid and production-ready, createGlobPatternsForDependencies works correctly

- [x] Implement Tailwind v4 support for React and Vue (2025-06-20 17:23)
  - Plan created: `.ai/2025-06-20/tasks/tailwind-v4-implementation.md`
  - Next steps: Documentation updates and migration guide
  - Goal: Support Tailwind v4 with Vite plugin while maintaining backward compatibility
  - Result: Successfully implemented v4 support with version detection, bundler detection, and full backward compatibility

- [x] Investigate Docker + Nx + cache (2025-06-19 8:52)
  - Using `--cache-to` and `--cache-from` might help https://docs.docker.com/build/cache/backends/gha/

- [x] Review Nx AI Strategy Document (2025-06-19 9:30)
  - Spec created: `dot_ai/2025-06-19/specs/nx-ai-strategy.md`
  - Goal: Review strategic suggestions for Nx's AI-first platform
  - Topics: Business growth, user experience, operationalization, and 1-3-6 month strategy

- [x] Fix React Generator Tailwind Styles Filename Mismatch (2025-06-19 16:45)
  - Plan created: `.ai/2025-06-19/tasks/fix-react-tailwind-styles-filename.md`
  - Goal: Fix bug where project.json references styles.tailwind but generated file is styles.css
  - Result: Fixed in add-project.ts for both webpack and rspack, added tests
  - Commit: 8f15779d65

- [x] Create Nx AI Strategy Session brainstorm spec (2025-06-18 17:45)
  - Plan created: `dot_ai/2025-06-18/specs/nx-ai-strategy-session-agenda.md`
  - Goal: Develop comprehensive agenda for two-day AI strategy session
  - Result: Created detailed spec covering current state, user workflows, documentation strategy, partnerships, and session agenda

- [x] Verify and push AI fixes for Nx CLI (2025-06-18 16:05)

  ```
  1. Branch: issues/30914 - ✅ Fixed
    - Added documentation for setting target defaults on inferred tasks
    - Clarified how to use plugin-specific identifiers vs general target names
    - Test: View updated docs at docs/shared/reference/nx-json.md

  2. Branch: issues/29143 - ⏭️ Skipped (Jest-specific)
    - passWithNoTests configuration issue (Jest limitation)

  3. Branch: issues/28715 - ✅ Fixed
    - Clarified package.json vs project.json usage
    - Documented that both support executors through the 'nx' property
    - Test: View updated docs at docs/shared/reference/project-configuration.md

  4. Branch: issues/30589 - ✅ Fixed
    - Updated dependency-checks rule to detect pre-release to stable upgrades
    - Test: Run eslint with @nx/dependency-checks rule on projects with pre-release deps

  5. Branch: issues/30163 - ✅ Fixed
    - Created comprehensive nx release/verdaccio documentation
    - Added guide at docs/shared/recipes/nx-release/publish-with-verdaccio.md
    - Test: View new documentation and check navigation in docs site
  ```

- [x] Sync with Caleb and Ben on docs rework (2025-06-18 3:06)
  - https://linear.app/nxdev/issue/NXC-2781/propose-frameworks-and-solutions

- [x] Record RawDocs Tool Loom Video for Team (2025-06-18 14:45)
  - Plan created: Notes saved at `/Users/jack/Downloads/rawdocs-developer-guide.md`
  - Goal: Create a short Loom video (5-7 minutes) explaining the RawDocs tool workflow
  - Key points to cover:
    - 2-3 minute developer workflow
    - Demo of git push → AI analysis → doc update
    - Show the feature-docs structure
    - Emphasize non-blocking nature and time savings

- [x] Review PR for Nicholas for Migrate UI (2025-06-18 10:48)
  - https://github.com/nrwl/nx/pull/31626
  - https://github.com/nrwl/nx-console/pull/2567
  - https://www.loom.com/share/843154739c5d40b2b1554d097314977a
  - https://nrwl.slack.com/archives/C04J01JPC4Q/p1750193240507379

- [x] Add author filtering to analyze-changes.mjs (2025-06-18 10:30)
  - Plan created: `.ai/2025-06-18/tasks/add-author-filter-to-analyze-changes.md`
  - Goal: Filter commits by author with default showing only current user's commits
  - Result: Successfully implemented with --author CLI flag, wildcard "\*" support, and current user as default

- [x] Retrieve Notion Incident Response Pages (2025-06-13 15:30)
  - Plan created: `dot_ai/2025-06-13/tasks/retrieve-notion-incident-pages.md`
  - Related to: Incident Response Documentation Cleanup Plan
  - Goal: Retrieve and store locally the content of 19 Notion pages related to incident response documentation

- [x] Debug Migrate UI Module Resolution Issue (2025-06-13 17:05)
  - Plan created: `.ai/2025-06-13/tasks/debug-migrate-ui-module-resolution.md`
  - Goal: Fix module resolution failures when migrations import packages from node_modules
  - Solution: Simple `process.chdir(workspacePath)` fix implemented on 2025-06-17
  - Final task documentation: `.ai/2025-06-17/tasks/fix-angular-module-resolution-migrate-ui.md`
  - Result: Both module resolution and Angular file path issues resolved with single change

- [x] Track Nx Docs Restructure Issue (2025-06-13 14:30)
  - GitHub Issue: https://github.com/nrwl/nx/issues/31546
  - Status: Intentional change, user already answered
  - Goal: Monitor for a few days to see if addressed or new ideas emerge
  - Notes: `.ai/2025-06-13/dictations/nx-docs-restructure-tracking.md`
  - Completed: 2025-06-14 (Last Friday)

- [x] Fix GitHub Issues Batch (2025-06-17 11:00)
  - Plan created: `.ai/2025-06-17/tasks/fix-github-issues-batch.md`
  - Goal: Fix up to 10 GitHub documentation issues identified in previous analysis
  - Result: Successfully fixed 3 documentation issues:
    - #31431: Added Bun to CI deployment docs (branch: `issue/31431`)
    - #31111: Documented NX_TUI environment variables (branch: `issue/31111`)
    - #30649: Explained "\*" version meaning in project package.json (branch: `issue/30649`)
  - Skipped 1 issue (#30831) and reverted 1 issue (#30137) per user request

- [x] Find 5 More Easy GitHub Issues (< 100 LOC) (2025-06-17 10:45)
  - Plan created: `.ai/2025-06-17/tasks/find-5-more-easy-issues.md`
  - Goal: Find 5 additional GitHub issues beyond the first batch
  - Result: Successfully identified 5 more documentation issues totaling 85-135 LOC:
    - #30137: Fix --dryRun flag documentation
    - #30810: Add E2E encryption verification guide
    - #31398: Clarify ciMode enablement
    - #30058: Add Homebrew troubleshooting
    - #30008: Update Tailwind v4 docs
  - Deliverables: `5-more-easy-github-issues-summary.md`

- [x] Find 5 Easy GitHub Issues (< 100 LOC) (2025-06-17 10:30)
  - Plan created: `.ai/2025-06-17/tasks/find-easy-github-issues.md`
  - Goal: Identify 5 GitHub issues that can be fixed with minimal code changes
  - Result: Successfully identified 5 documentation issues totaling 50-80 LOC:
    - #31431: Add Bun to CI deployment docs
    - #30649: Explain "\*" version meaning
    - #30768: Standardize plugin location guidance
    - #30831: Fix indexHtmlTransformer docs
    - #31111: Document NX_TUI environment variables
  - Deliverables: `5-easy-github-issues-summary.md`

- [x] Implement heap usage logging feature (2025-06-13 16:00)
  - Plan created: `.ai/2025-06-13/tasks/implement-heap-logging.md`
  - Goal: Enable `NX_LOG_HEAP_USAGE=true nx run <project>:<target>` to display peak RSS memory usage
  - Result: Core feature implemented with pidusage library
  - Displays memory in format: `✔  nx run myapp:build (2.5s) (peak: 256MB)`
  - Deferred: Tests, documentation, ForkedProcessTaskRunner support

- [x] Incident Response Documentation Audit (2025-06-13 09:30)
  - Plan created: `.ai/2025-06-13/tasks/incident-response-audit.md`
  - Result: Created comprehensive inventory in `incident_response_pages.md`
  - Goal: Audit all Notion pages/databases for incident response content to identify inconsistencies, duplicates, and gaps
  - Findings: 26 pages/databases documented, maturity level 2/5, critical gaps in IRP and communication protocols
  - Deliverables:
    - Comprehensive inventory with 23 pages and 3 databases
    - Deep-dive analysis of 15 key resources
    - Maturity assessment (Level 2/5 - Repeatable)
    - Gap analysis identifying missing IRP, communication protocols, and severity classification
    - Gemini expert review with industry benchmarks
    - Detailed recommendations for reaching Level 3 maturity

- [x] Create Nx AI MCP Integration Summary Document (2025-06-12 11:15)
  - Plan created: Consolidated ideas from multiple dictations
  - Goal: Make Nx CLI invaluable for AI tools and drive npm package growth
  - Deliverables:
    - Comprehensive strategy document: `dot_ai/2025-06-12/nx-ai-mcp-integration-summary.md`
    - 11 repository intelligence MCP functions defined
    - Leveraged existing Nx features: tagging system, Polygraph
    - Growth hacking features: AI Workspace Report, gamification
    - Zero-configuration approach with built-in MCP server

- [x] MCP-Gemini Code Review and Improvement (2025-06-12 10:30)
  - Plan created: `dot_ai/2025-06-12/tasks/mcp-gemini-improvements.md`
  - Next steps: Fix critical security issues, improve error handling, add validation
  - Goal: Make the mcp-gemini server production-ready with proper security and best practices

- [x] Fix E2E Port Configuration for React App Generator (2025-06-12 00:00)
  - Plan created: `dot_ai/2025-06-12/tasks/fix-e2e-port-configuration.md`
  - Goal: Ensure all E2E test runners respect the --port option from React app generator
  - Result: Fixed across all bundlers (Vite, Webpack, Rspack, Rsbuild), all 96 tests passing

- [x] Documentation-Feature Correlation Tool (2025-06-11 12:00)
  - Plan created: `dot_ai/2025-06-11/tasks/docs-feature-correlation-tool.md`
  - Goal: Build tool to analyze feature changes and correlate with documentation needing updates
  - Result: Created 5-component system with AI-optimized output format

- [x] Create Curl-based Installation Script for Raw Docs (2025-06-11 01:05)
  - Plan created: `.ai/2025-06-11/tasks/curl-install-script.md`
  - Status: All 7 steps complete (Step 6 manually verified)
  - Goal: Enable one-line installation via GitHub CLI
  - Result: Fully functional install.sh script with GitHub CLI integration

- [x] Add Port Option to @nx/react:application Generator (2025-06-11 00:00)
  - Plan created: `dot_ai/2025-06-11/tasks/add-port-option-react-generator.md`
  - Goal: Add a --port option to the React application generator for custom dev server ports
  - Result: Implemented port option for all bundlers (Vite, Webpack, Rspack)

- [x] Nx Easy Issues Analysis - Stale & Low Engagement (2025-06-10 14:00)
  - Plan created: `dot_ai/2025-06-10/tasks/nx-easy-issues-stale-issues.md`
  - Goal: Analyze nrwl/nx repository for easy-to-close issues
  - Result: Found 221 issues that could be closed, created bulk closure scripts

- [x] MCP Server Auto-Reindexing (2025-06-10 10:45)
  - Plan created: `dot_ai/2025-06-10/tasks/mcp-server-auto-reindex.md`
  - Goal: Implement automatic re-indexing when content changes in dot_ai folder
  - Approach: Hash-based change detection before search operations
  - Implementation complete: Directory monitor, content indexer integration, server integration
  - Tests passing, documentation updated

- [x] Cross-Repository Raw Docs Integration - Phase 1 (2025-06-10 09:00)
  - Plan created: `dot_ai/2025-06-10/tasks/cross-repo-integration-phase1.md`
  - Spec reference: `dot_ai/2025-06-10/specs/cross-repo-integration.md`
  - Goal: Implement core integration system for monorepos to leverage raw-docs without submodules
  - Result: Created 3 new scripts, updated check-developers.mjs, built comprehensive test suite

- [x] Improve MCP Server Discoverability for AI Tools (2025-06-09 22:47)
  - Plan created: `dot_ai/2025-06-09/tasks/improve-mcp-server-discoverability.md`
  - Goal: Ensure AI tools prioritize calling MCP server for notes, dictations, specs, tasks, and TODOs
  - Deliverables:
    - Updated CLAUDE.md with MCP priority instructions
    - Created claude-mcp-instructions.md and cursor-mcp-instructions.md
    - Implemented keyword-mapping.json with test scripts
    - Created usage-examples.md with comprehensive query patterns
    - Built mcp-integration-guide.md for full documentation
    - Developed monitor-mcp-calls.mjs for usage tracking

- [x] Enhance Search Engine: Date Ranges and Categories (2025-06-09 22:05)
  - Plan created: `dot_ai/2025-06-09/tasks/enhance-search-engine-date-ranges-and-categories.md`
  - Goal: Support date range filtering (start..end), flexible category matching (singular/plural), and folder-based category filtering

- [x] Optimize extract_todos Token Usage (2025-06-09 13:15)
  - Plan created: `dot_ai/2025-06-09/tasks/optimize-extract-todos-token-usage.md`
  - Goal: Reduce token usage below 25000 limit while maintaining usefulness
  - Deliverables:
    - Refactored extract_todos function with 80%+ token reduction
    - Added configurable verbosity levels (minimal, standard, detailed)
    - Implemented status filtering (pending, completed, all)
    - Added token monitoring and smart truncation
    - Created comprehensive API documentation
    - Achieved token usage: 790 tokens for minimal mode, 4,022 for detailed mode

- [x] Phase 1: Raw Docs Implementation (2025-06-09 12:30)
  - Plan created: `dot_ai/2025-06-09/tasks/phase-1-raw-docs-implementation.md`
  - Status: Working example repository created at `dot_ai/2025-06-09/tasks/raw-docs-example/`
  - Next steps: Integration and testing will be a separate task
  - Goal: Create working example of raw-docs repository with essential scripts and pre-push hooks

- [x] Reorganize dot_ai Folder Structure (2025-06-09 12:00)
  - Plan created: `dot_ai/2025-06-09/tasks/organize-dot-ai-folder-structure.md`
  - Goal: Restructure all yyyy-mm-dd folders to have consistent subdirectories (tasks/, specs/, dictations/)
  - Result: Successfully moved 86 files to appropriate locations while preserving SUMMARY.md files

- [x] Nx Version Extraction & PPA Build Fixes (2025-06-06 09:00)
  - Plan created: `dot_ai/2025-06-06/tasks/extract-nx-prerelease-versions.md`
  - Goal: Extract all Nx 21.1.x versions and fix PPA build environment
  - Result: Successfully extracted 21 prereleases, hardened Launchpad pipeline

- [x] Documentation Research & Debian Package Pipeline Fixes (2025-06-05 08:00)
  - Plan created: Multiple tasks in `dot_ai/2025-06-05/tasks/`
  - Goal: Research competitor docs and fix Debian package publishing
  - Result: Fixed critical pipeline, implemented Node.js version checking, created HTML mockup

- [x] Nx Getting Started Experience Improvement - Phase 1 (2025-06-04 08:00)
  - Plan created: `dot_ai/2025-06-04/tasks/phase-1-simplify-intro-page.md`
  - Goal: Simplify intro page to get users to "wow moment" in under 2 minutes
  - Result: Reduced intro page complexity by 60%, created 60-second onboarding path

- [x] URL Validation and Testing (2025-06-03 09:00)
  - Plan created: `dot_ai/2025-06-03/tasks/check-sitemap-urls.js`
  - Goal: Validate all documentation URLs for health check
  - Result: Systematic testing with categorized failure report

- [x] Nx Documentation URL Redirect Analysis (2025-06-02 09:00)
  - Plan created: Various scripts in `dot_ai/2025-06-02/tasks/`
  - Goal: Analyze and create redirects for Nx documentation migration
  - Result: 100% redirect coverage achieved with high confidence scores

### January 2025

- [x] Add Tailwind CSS to Astro-Docs Website (2025-01-23)
  - Plan created: `dot_ai/2025-01-23/tasks/add-tailwind-to-astro-docs.md`
  - Goal: Integrate Tailwind CSS into the astro-docs website for enhanced styling capabilities
  - Result: Successfully installed Tailwind v3.4.4 with Starlight compatibility and Vite plugin configuration

- [x] Review Tailwind v4 Support Changes (2025-01-20)
  - Plan created: `dot_ai/2025-01-20/tasks/review-tailwind-v4-support.md`
  - Goal: Review feat/tailwind-4 branch changes for React and Vue bundler support
  - Result: Implementation is solid and production-ready, createGlobPatternsForDependencies works correctly

## Next Actions

1. Create Self-Healing CI documentation in raw-docs
2. Create Cache Isolation documentation in raw-docs
3. Update SAML + SCIM documentation with latest changes
4. Create GTM migration guide
5. Set up regular documentation update process
