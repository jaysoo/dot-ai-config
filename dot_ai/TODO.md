# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-415: Move nx-dev redirects to Netlify _redirects** (2026-02-25)

   - Summary: Moved 1,231 redirect rules from Next.js serverless to Netlify CDN edge `_redirects` file. Preview deployment verified working.
   - Files: `.ai/2026-02-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34612

2. **Fix #34399: Redundant vite.config.ts for vitest projects** (2026-02-25)

   - Summary: Removed redundant `createOrEditViteConfig` call from `@nx/js` library generator that created a `vite.config.ts` with ESM-only syntax alongside the correct `vitest.config.mts`. CI green.
   - Files: `.ai/2026-02-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34603

3. **DOC-406: Address PR review comments** (2026-02-24)

   - Summary: Fixed 3 nits from Robb on PR #34521 — missed `just` removal, confusing `locally` wording in DTE section, inconsistent `Nx's` possessive.
   - Files: `.ai/2026-02-24/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34521

4. **PR #34493: Fix esbuild noEmit/composite tsbuildinfo** (2026-02-23)

   - Summary: Monitored CI for `fix/js-noEmit-composite-tsbuildinfo` branch — CI passed. Relates to #34492 esbuild type-check fix.
   - Files: `.ai/2026-02-23/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34493

5. **#30146: Pruning docs guide + error message fix** (2026-02-23)

   - Summary: Created pruning deployment guide, updated bundling guide to match, added error message docs link in esbuild/rollup. Two branches: docs-only + error message.
   - Files: `.ai/2026-02-23/SUMMARY.md`, `.ai/2026-02-23/tasks/issue-30146-investigation.md`

6. **Nx Easy Issues: Top 11 AI-Suitable Issues** (2026-02-23)

   - Summary: Scanned 381 open issues, ranked by AI suitability. Top picks: #32126 (bun publish), #34492 (esbuild type-check), #34391 cluster (git tag interpolation), #34279 (webpack process.env regression).
   - Files: `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`

7. **Fix: Prevent nxCloudId for new workspaces** (2026-02-20)

   - Summary: Added `nxCloud: 'skip'` to custom CNW flow so new workspaces don't get `nxCloudId` in `nx.json`. Updated 8 e2e tests.
   - Files: `.ai/2026-02-20/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34532

8. **DOC-406: Dedupe Content & Style Guide Fixes** (2026-02-19)

   - Summary: Content deduplication across concepts/ and features/ pages (trimmed mental-model, consolidated remote-cache intro, added cross-references) + style guide compliance fixes across 10 pages. Created `STYLE_GUIDE.md`.
   - Files: `.ai/2026-02-19/tasks/doc-406-dedupe-getting-started.md`

9. **Fix #32880: Next.js Jest Tests Don't Exit** (2026-02-19)

   - Summary: Root caused and fixed — Nx daemon socket left open by `withNx` calling `createProjectGraphAsync()`. One-line fix: `resetDaemonClient: true`.
   - Files: `.ai/2026-02-19/tasks/issue-32880-jest-not-exiting.md`, PR: https://github.com/nrwl/nx/pull/34518

10. **DOC-405: Intro Page & Getting Started Improvements** (2026-02-13)

    - Summary: Restructured intro challenges/solutions, added plugin-registry links, added global Nx update instructions to installation page
    - Files: `.ai/2026-02-13/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34410

## Pending
- [ ] Issue:https://github.com/nrwl/nx/issues/32750 (2026-02-26 14:53)
  - WASI problem it seems

- [ ] Follow-up: GitHub app flow should not involve infra (2026-02-24 14:26)

  - Present it to DPEs and Red Panda (Mark). It is prone to human errors and is annoyign to set up when we run out of callback URLs.
- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

- [ ] Update all links for docs to use new URL (2026-02-23 11:57)

- [ ] Framer _must_ launch this week

- [ ] Sandboxing, get the list of problems by EOD Wednesday

- [x] Investigate if we need to update our edge functions, e.g. move the redirects from next.js to proper Netlify redirects file ✓ 2026-02-25
  - Done: DOC-415, PR #34612. Moved 1,231 redirects to Netlify `_redirects` file.

- [ ] Help Nicole with onboarding to hit 600 per week

- [ ] Help Max with AX and migrations specs before March starts

- [ ] Slack #nx heads-up on cooldown week (2026-02-13 11:21)

  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599

- [ ] Look through all TODO(v23) comments and add tasks for them

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
  - They verified the fix so we just need to port it back to the plugin
  - JVA said that he will open a PR

Later:
