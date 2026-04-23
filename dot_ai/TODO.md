# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Night-shift community fixes batch** (2026-04-22)

   - Summary: 2 new worktrees created from session-2026-04-22 night-shift run (#33488, #33971). 3 approved fixes already applied in prior runs (#32595, #33523, #34095). #32579 skipped — core maintainer PR already addresses it. #34281 applied in ocean repo from pre-existing branch.
   - Session: `night-shift/sessions/session-2026-04-22.md`

2. **Night-shift community fixes batch** (2026-04-21)

   - Summary: 5 worktrees created from session-2026-04-21 night-shift run. All patches applied and committed (4 Nx + 1 Ocean + greenfield bench repo).
   - Session: `night-shift/sessions/session-2026-04-21.md`

3. **NXC-4182: Revert React Router Vite 7 workaround (now supports Vite 8)** (2026-04-21)

   - Summary: `@react-router/dev` 7.14.2 expanded its Vite peer dep to include `^8.0.0`. Bumped `reactRouterVersion` to ^7.14.2, added a 22.7.0 packageJsonUpdate migration, removed `useViteV7: true` force-flag, dead schema field, and e2e test downgrade block. Squashed to single commit. PR #35365.
   - Files: `.ai/2026-04-21/tasks/nxc-4182-react-router-vite-8.md`, PR #35365

4. **DOC-486: Blog sitemap in root nx.dev sitemap index** (2026-04-21)

   - Summary: Added `/sitemap-2.xml` for nx-blog via consolidated `additional-sitemaps.ts` edge function. In nx-blog, added `generate-sitemap.mjs` and refactored build into cacheable Nx targets (nx:run-commands + nx:noop fan-out). Both repos committed, PRs pending.
   - Files: `.ai/2026-04-21/SUMMARY.md`, `.ai/2026-04-21/tasks/doc-486-blog-sitemap.md`

5. **DOC-479: Agent-readiness signals for nx.dev + sitemap regression fix** (2026-04-20)

   - Summary: Shipped Link headers (RFC 8288), Content-Signal in robots.txt, routed nx.dev/robots.txt through astro-docs via beforeFiles rewrite (#35348). Follow-up #35351 restored sitemap generation removed by DOC-478 cleanup.
   - Files: `.ai/2026-04-20/tasks/doc-479-agent-readiness.md`, PRs #35348, #35351

6. **Init error investigation plan (Mar/Apr CNW+init telemetry)** (2026-04-20)

   - Summary: Pulled Mar/Apr CNW + init funnel/cloud stats via cnw-stats-analyzer. Updated skill (target 3k→2k, headline no-filter vs funnel human+AI/CI split). Wrote init error fix plan — ~22% of init starts fail with no stderr captured; `./nx --version` probe accounts for 9.8% of starts on its own.
   - Files: `.ai/2026-04-20/tasks/init-error-investigation.md`

7. **DOC-478: Clean up nx-dev to ai-chat/api/courses** (2026-04-17)

   - Summary: Stripped nx-dev down to 4 routes, deleted top-level docs/ (~333MB), removed unused libs, simplified feature-ai. ~148k lines deleted.
   - Files: `.ai/2026-04-17/SUMMARY.md`, PR #35315

8. **DOC-69: Versioned docs snapshot script** (2026-04-10)

   - Summary: Script + skill to create orphan branches with pre-built static docs for Netlify branch deploys. Supports v18-v22, auto Node switching via mise, tested v19-v21.
   - Files: `.ai/2026-04-10/SUMMARY.md`, `scripts/create-versioned-docs.mts`

9. **DOC-476: Bring back "no workspace" CTA in CI tutorial** (2026-04-10)

   - Summary: Restored cloud.nx.app CTA and skip-ahead flow for cloud onboarding users in self-healing CI tutorial.
   - Files: `.ai/2026-04-10/SUMMARY.md`

10. **Night-shift community fixes batch** (2026-04-09)

    - Summary: 11 worktrees created from session-2026-04-10 night-shift run. All patches applied and committed.
    - Session: `night-shift/sessions/session-2026-04-10.md`

## TODO

- [ ] Benchmarks repo
- [x] 🤖 Review night-shift fixes from 2026-04-22 session (2 newly applied, 20 fixed / 23 total) — **ALL REVIEWED**
  - Session report: `/Users/jack/projects/night-shift/sessions/session-2026-04-22.md`
  - 7 approved peer reviews processed:
    - [x] #33488 — prerelease (--preid) not applied to dependent patch bumps (conf: 88, ✅ approved) — newly committed `issue-33488` | reports: `/tmp/nightshift-work-Buhhez/reports/` — **REVIEWED: APPROVE WITH CHANGES** — fix correct, dead-code concern confirmed (`const sideEffectBump = 'patch'` on line 963 must be removed before PR), test only covers independent-group path. Report: `nx-worktrees/issue-33488/REVIEW_REPORT.md`
      - Note: Patch hunk counts were wrong; hand-applied the 3rd hunk in `release-group-processor.ts`. Leaves `const sideEffectBump = 'patch';` as dead code (matches reviewed patch shape but may need cleanup).
    - [x] #33523 — npm support for copy-workspace-modules (conf: 85, ✅ approved) — already committed in prior run `issue-33523` | reports: `/tmp/nightshift-work-BYtAKt/reports/`
    - [x] #34095 — @nx/next:build missing semver dependency (conf: 82, ✅ approved) — already committed in prior run `issue-34095` | reports: `/tmp/nightshift-work-uYb5CC/reports/`
    - [x] #32595 — @nx/angular-rspack-compiler defaults override user tsconfig (conf: 78, ✅ approved) — already committed in prior run `issue-32595` | reports: `/tmp/nightshift-work-zYArqC/reports/`
    - [x] #34281 — @nx/s3-cache non-pinned AWS SDK (conf: 92, ✅ approved) — applied in ocean `ocean-worktrees/issue-34281` (branch `fix/issue-34281-s3-cache-unpinned-aws-deps`) | reports: `/tmp/nightshift-work-I6dNQK/reports/`
    - [x] #32579 — nx:run-script pnpm workspace detection (conf: 82, ✅ approved) — SKIPPED: core maintainer PR `origin/fix/32579-detect-pnpm-workspace` already addresses it | reports: `/tmp/nightshift-work-0QwmBM/reports/`
- [x] 🤖 Review night-shift fixes from 2026-04-21 session (5 applied, 9 fixed / 12 total) — **ALL REVIEWED**
  - Session report: `/Users/jack/projects/night-shift/sessions/session-2026-04-21.md`
  - Worktrees: `~/projects/nx-worktrees/issue-*` and `~/projects/ocean-worktrees/issue-33335` — review code, run tests, create PRs
    - [x] #32595 — @nx/angular-rspack-compiler: defaults override user tsconfig (conf: 82, ⚠️ concerns) `issue-32595` | reports: `/tmp/nightshift-work-pWyqfW/reports/` — **REVIEWED: REJECT** — PR #35004 from core maintainer FrozenPandaz already fixes the same bug in 16 lines (CI green, awaiting review) vs. the bot's 267-line extends-chain walker. Of the 9 new tests, 3 pass both with and without the fix (they inline the algorithm); none actually exercise `setupCompilation` against `readConfiguration`. Also doesn't handle TS 5.0 array `extends`. Nudge #35004 forward instead of pushing this. Report: `nx-worktrees/issue-32595/REVIEW_REPORT.md`
    - [x] #33113 — Local generators: wrong path argument in schema docs (conf: 82, ✅ approved) `issue-33113` | reports: `/tmp/nightshift-work-SQVzFs/reports/` — **REVIEWED: APPROVE WITH CHANGES** — fix is correct and the regression test reproduces the user scenario, but scope is too narrow: PR #31856 added the same "path without extension = directory" logic to BOTH generator and executor, but this only updates the generator side. Executor's `executor-examples.md` (rendered on nx.dev) and `executor/schema.json` still have the stale docs. Expand scope or file follow-up. Report: `nx-worktrees/issue-33113/REVIEW_REPORT.md`
    - [x] #33331 — Next.js Vercel deploy docs: root dir + NEXT*PUBLIC* caching (conf: 82, ⚠️ concerns) `issue-33331` | reports: `/tmp/nightshift-work-1tLpci/reports/` — **REVIEWED: APPROVE WITH CHANGES** — NEXT*PUBLIC* build-time inlining and `inputs` guidance are technically accurate, but the example `inputs` array tells users `["default", "^production", ...]` while `@nx/next`'s plugin.ts actually infers `["default", "^default", { externalDependencies: ["next"] }, { dependentTasksOutputFiles: "**/*.d.ts", transitive: true }]`. Copy-pasters silently drop real inferred inputs. Also the link `/reference/inputs#environment-variables` is missing the `/docs/` prefix — will 404. Report: `nx-worktrees/issue-33331/REVIEW_REPORT.md`
    - [x] #33335 — S3 cache read-only mode value mismatch (conf: 90, ✅ approved) — applied to ocean repo `ocean-worktrees/issue-33335` | reports: `/tmp/nightshift-work-2MTk2q/reports/` — **REVIEWED: APPROVE WITH CHANGES** — core fix aligns `"read"`/`"read-only"` correctly across schemas, generator prompt, runtime (with backward-compat normalization in `powerpack-utils`); 12 powerpack-utils tests pass. Three gaps: (1) NO Ocean version plan was added despite Ocean requiring them for `fix()` commits, (2) s3/gcs/azure READMEs still document the broken `"read"` value even though issue reporter flagged the npm docs inconsistency, (3) out-of-scope `isPromptCancelledError` helper silently added with `process.exit(0)` behavior change and no tests. Minor: `NX_POWERPACK_CACHE_MODE=read` env path short-circuits before normalization. Report: `ocean-worktrees/issue-33335/REVIEW_REPORT.md`
    - [x] Spec #0 — bench-monorepo-orchestrators greenfield benchmark repo (conf: 70, ⚠️ concerns) — new repo at `~/projects/bench-monorepo-orchestrators` | reports: `/tmp/nightshift-work-29pdaR/reports/` — **REVIEWED: APPROVE WITH CHANGES** — scaffolding is real and produces a valid 110-node/300-edge/zero-cross-domain graph that Nx and Turbo both cache correctly, but spec §11 acceptance criteria don't pass: (1) `pnpm run format` fails everywhere (generator emits single quotes, oxfmt defaults to double), (2) `pnpm run test` fails on all five apps (no `.spec.tsx` files generated under `apps/*/src/`), (3) `vp run lint` on add_vp reports 0/0 cache hit and runs zero tasks (vite.config.ts shape wrong). Also: add_nx does NOT inject per-package `nx` blocks as §6 required (unused `scripts/add-nx-blocks.mjs` is dead code); silent scale reduction from 250/50 → 30/10 leaves README claim of matching `vsavkin/large-monorepo` scale stale. Report: `bench-monorepo-orchestrators/REVIEW_REPORT.md`
- [x] 🤖 Review night-shift fixes from 2026-04-10 session (11 applied, 29 fixed / 44 total)

  - Session report: `/Users/jack/projects/night-shift/sessions/session-2026-04-10.md`
  - Worktrees: `~/projects/nx-worktrees/issue-*` — review code, run tests, create PRs

    - [x] #32567 — swc-node/ts-node warning on Node 22.18+ (conf: 82, ⚠️ concerns) `issue-32567` | reports: `/tmp/nightshift-work-M5QYzE/reports/`
      - My notes: GOOD. Simple fix, it's unfortunate repro could not be done I wonder what the sandbox issue was and if we can fix it for future tasks.
    - [x] #32864 — Rspack Angular i18n Windows paths (conf: 0→approved) `issue-32864` | reports: `/tmp/nightshift-work-xJap7t/reports/`
      - My notes: GOOD. Also unfortunate that repro repo not provided, but given this is on Windows it's understandable. The problem is well understood and fix is simple. It'd be nice to look at whether posix is the right approach here or path.normalize is better alternative as a standard Node.js API -- in this case it looks like path.normalize has the same problem with windows paths but it would be good to try standards first and then document why they don't work before our custom logic.. It be great to also have commit message suggestion so when I apply the patch I know what to use.
    - [x] #33051 — Angular lib secondary entry point test-setup.ts (conf: 0→approved) `issue-33051` | reports: `/tmp/nightshift-work-sagVTL/reports/`

      - My notes: NOT GOOD. I think the approach was not careful enough about its effects, and it's better to be narrow and correct. See notes below.

        ```
        Nightshift agent fix quality issue — lesson learned:

        The agent proposed a fix that was technically correct but conceptually wrong. The secondary entry point generator's updateTsConfigIncludedFiles
        was mutating existing tsconfig entries (stripping src/ from glob patterns to widen them). The agent's fix added a path.includes('*') guard to
        skip non-glob paths — this solved the immediate bug (src/test-setup.ts getting mangled) but preserved the flawed approach of rewriting entries
        the generator didn't create.

        The better fix: Instead of mutating existing include/exclude entries, append new entries scoped to the secondary entry point (e.g.,
        testing/src/**/*.ts). This is additive — it doesn't touch anything the user or other generators put there, so it can't break them.

        Takeaway for future agents:
        1. Don't just fix the symptom — question whether the existing approach is sound. If a function is rewriting config it didn't create, the fix
        shouldn't be "rewrite more carefully" — it should be "stop rewriting other generators' output."
        2. Before proposing a fix, understand the full lifecycle: who creates the config, who modifies it, and why. The agent didn't ask "why are we
        mutating these entries at all?" until challenged.
        3. Minimal diff ≠ best fix. Two lines changed looks clean but papers over a design issue. An additive approach is more lines but fundamentally
        safer.
        ```

    - [x] #33523 — npm support for copy-workspace-modules (conf: 82, ✅ approved) `issue-33523` | reports: `/tmp/nightshift-work-xzmX6E/reports/`

      - My notes: REJECTED. Although the fix looks reasonable I don't know what 'getWorkspacePackagesFromGraph' function is. Need more explanation. And worst of all, there are no tests to verify the fix. This is a critical issue since it breaks npm support for the prune-lockfile executor, so we need to be sure the fix is correct and doesn't cause regressions. The agent should have asked:

        1. What is getWorkspacePackagesFromGraph? Where does it come from? How does it work? Is it well-tested?
        2. How can we verify this fix? Are there existing tests that cover this scenario, or do we need to add new tests?
        3. Can we run these tests in our environment to confirm the fix works and doesn't break anything else?

        Without answers to these questions, it's risky to apply a fix that changes core logic without test coverage.
        I don't have time to try it out myself since I'm busy, it'd be good if all the pieces are there so I can quickly review, test the repro, etc.
        It's not good that the repro isn't a real workspace, but via code analysis. If it's just through looking at code then tests are required.

    - [x] #34095 — @nx/next:build missing semver dep (conf: 82, ✅ approved) `issue-34095` | reports: `/tmp/nightshift-work-R1OwZd/reports/`
      - My notes: REJECTED. The fix looks reasonable at first, but we should NOT be importing semver statically in the first place, it needs to be dynamic when needed. THe withNx function needs more deps at build time than at run time, which is why the phase guard check is there. The original change by Colum should have put the semver import exactly when needed instead of the top-level import. Needs rework.
    - [ ] #34281 — @nx/s3-cache non-pinned AWS SDK (conf: 90, ✅ approved) — applied to ocean repo | reports: `/tmp/nightshift-work-drAGdC/reports/`

- [ ] Update Day 2 Montreal on-site agenda with PLG talking points (2026-04-11)
  - From Joe 1:1 (2026-04-10): 80/20 rule, sticky notes funnel exercise, activation metric (20+ runs / 24hr target), weekly metric reviews
  - Key themes: every engineer maps their work to a funnel stage, micro→macro metric connection, backend/infra teams included in PLG scrutiny
- [ ] nx-graph RCE: GHSA + CORS tightening follow-up (2026-04-02)
  - Steve settling on CVE 6.0 medium severity; needs a GHSA filed
  - Jason: CORS wildcard on nx console's PDV (Project Details View) needs major refactor or tightening
  - PDV reuses nx graph webview; runs on different origins per IDE (vscode-webview://, about:blank in IntelliJ)
  - Slack: #nx-graph-rce-investigation
- [ ] Update Notion Incident Management docs (2026-04-02)
  - Add scope statement + Severities Outline link to existing [IR Process page](https://www.notion.so/nxnrwl/Incident-Response-Process-Guidelines-21569f3c23878017a562cce81c2b1b62)
  - Create "Security Incident Response Plan" as sibling page under [Incident Management](https://www.notion.so/nxnrwl/Incident-Management-462453a4546340b8820c5d9d9ba74892)
  - Create postmortem entry for March 2026 org-access-leakage in [Postmortems DB](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208)
  - Drafts: `dot_ai/2026-04-02/ir-process-update-draft.md`, `dot_ai/2026-04-02/security-ir-plan-draft.md`
- [ ] Review Notion "Nx Software Vendors" page for Alexis (by 2026-04-07)
  - Page: https://www.notion.so/nxnrwl/Nx-Software-Vendors-1e469f3c238780cfb7d9d223bf317e30
  - Ensure it's up to date with admin tools
  - Alexis requested via Slack DM (2026-04-02)
- [ ] NXC-3345: Investigate issue with Rollup + SWC for workspace libs (due 2026-04-03)
  - Active session: `/Users/jack/projects/nx-worktrees/NXC-3345`
- [ ] Test Turborepo incremental task caching (2026-04-07)
  - Turbo 2.9.4 ships `futureFlags.incrementalTasks` — persists `.tsbuildinfo` etc in remote cache, restores on cache miss so tools do incremental builds instead of full rebuilds
  - PR: https://github.com/vercel/turborepo/pull/12531
  - Test on a TS monorepo: enable flag, configure `incremental` outputs, measure cache-miss rebuild times vs without
  - Evaluate whether Nx should offer equivalent (separate cache partition for tool-level incremental state)
- [ ] Publish remote cache packages to address CVEs and close GH issue (2026-04-23)
- [ ] Review PR #34890 (2026-03-23)
- [ ] Review Ben's 3 Ocean PRs — structural/dev improvements (2026-04-10)
  - #10265 — fixes `op-secrets`, not injecting env vars for e2e dev (adds fallback when 1Password CLI unavailable)
  - #10264 — fixes ToS redirect flake in e2e tests (DB/env drift between fixtures and app server)
  - #10635 — renames 3 misnamed `feature-*` libs to `util-*` + adds `nx_tags` to 5 untagged libs (~300 files)

## Active Claude Sessions

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

- `/Users/jack/projects/nx` (branch: master) — init error investigation (Apr/Mar CNW+init stats analysis) (2026-04-20)

## Later
