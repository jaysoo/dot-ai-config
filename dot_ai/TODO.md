# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **NXC-4020: Restore CNW prompt flow to v22.1.3** (2026-03-02)
   - Summary: Reverted human-visible CNW flow to match v22.1.3, fixed `accessToken=undefined` bug, restored cloud prompt wording, split preset/template flows. CI green.
   - Files: `.ai/2026-03-02/tasks/cnw-revert-prompts-to-22.1.3.md`, PR: https://github.com/nrwl/nx/pull/34671

2. **February 2026 Cross-Functional Digest** (2026-03-02)
   - Summary: Generated monthly digest covering 457 issues across 6 teams, 6 CLI releases, 24 Cloud releases, ~160 infra commits. Plus technical changelog.
   - Files: `.ai/2026-03-02/tasks/nx-digest-2026-02-crossfunctional.md`, `.ai/2026-03-02/tasks/nx-digest-2026-02-changelog.md`

3. **DOC-428: Review All CLI and Cloud Links** (2026-03-02)
   - Summary: Full audit of nx.dev links in nx + ocean repos. Found 10 broken 404s, fixed ordering bugs, deleted legacy redirect-rules.js files, applied all fixes directly to `_redirects`.
   - Files: `.ai/2026-03-02/tasks/DOC-428-review-cli-cloud-links.md`

4. **DOC-415: Move nx-dev redirects to Netlify _redirects** (2026-02-25)
   - Summary: Moved 1,231 redirect rules from Next.js serverless to Netlify CDN edge `_redirects` file. Preview deployment verified working.
   - Files: `.ai/2026-02-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34612

5. **Fix #34399: Redundant vite.config.ts for vitest projects** (2026-02-25)
   - Summary: Removed redundant `createOrEditViteConfig` call from `@nx/js` library generator that created a `vite.config.ts` with ESM-only syntax alongside the correct `vitest.config.mts`. CI green.
   - Files: `.ai/2026-02-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34603

6. **DOC-406: Address PR review comments** (2026-02-24)
   - Summary: Fixed 3 nits from Robb on PR #34521 — missed `just` removal, confusing `locally` wording in DTE section, inconsistent `Nx's` possessive.
   - Files: `.ai/2026-02-24/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34521

7. **PR #34493: Fix esbuild noEmit/composite tsbuildinfo** (2026-02-23)
   - Summary: Monitored CI for `fix/js-noEmit-composite-tsbuildinfo` branch — CI passed. Relates to #34492 esbuild type-check fix.
   - Files: `.ai/2026-02-23/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34493

8. **#30146: Pruning docs guide + error message fix** (2026-02-23)
   - Summary: Created pruning deployment guide, updated bundling guide to match, added error message docs link in esbuild/rollup. Two branches: docs-only + error message.
   - Files: `.ai/2026-02-23/SUMMARY.md`, `.ai/2026-02-23/tasks/issue-30146-investigation.md`

9. **Nx Easy Issues: Top 11 AI-Suitable Issues** (2026-02-23)
   - Summary: Scanned 381 open issues, ranked by AI suitability. Top picks: #32126 (bun publish), #34492 (esbuild type-check), #34391 cluster (git tag interpolation), #34279 (webpack process.env regression).
   - Files: `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`

10. **Fix: Prevent nxCloudId for new workspaces** (2026-02-20)
    - Summary: Added `nxCloud: 'skip'` to custom CNW flow so new workspaces don't get `nxCloudId` in `nx.json`. Updated 8 e2e tests.
    - Files: `.ai/2026-02-20/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34532

## Pending
- [ ] Ask Alexis to update levels in Wagepoint and TriNet (2026-03-03 13:53)
- [ ] Ask Alexis to move people to the right manager in Wagepoint (2026-03-03 13:53)
- [ ] Ask Alexis about Colum sending hardware back (2026-03-03 13:52)
  - For offboarding

- [ ] Review Vite import results and make it repeatable (2026-03-02 09:23)
  - Project: `dot_ai/para/projects/nx-import-vite/`
  - Report + scenario logs: `dot_ai/para/projects/nx-import-vite/test-results/`
  - Generate CC instructions to further generate these markdown files for other plugins
- [ ] Issue:https://github.com/nrwl/nx/issues/32750 (2026-02-26 14:53)
  - WASI problem it seems
  - 6 scenarios tested, all passing. Review config snippets and findings.
- [ ] Take cloud stats script and build into lighthouse (2026-02-28 09:09)
- [ ] Follow-up: GitHub app flow should not involve infra (2026-02-24 14:26)

  - Present it to DPEs and Red Panda (Mark). It is prone to human errors and is annoyign to set up when we run out of callback URLs.
- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

- [ ] Help Nicole with onboarding to hit 600 per week

- [ ] https://linear.app/nxdev/issue/NXA-1075/import-test-and-document-import-gaps-for-nxvite

- [ ] Slack #nx heads-up on cooldown week (2026-02-13 11:21)

  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599

- [ ] Look through all TODO(v23) comments and add tasks for them

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
  - They verified the fix so we just need to port it back to the plugin
  - JVA said that he will open a PR

## Later
