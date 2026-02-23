# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **#30146: Pruning docs guide + error message fix** (2026-02-23)

   - Summary: Created pruning deployment guide, updated bundling guide to match, added error message docs link in esbuild/rollup. Two branches: docs-only + error message.
   - Files: `.ai/2026-02-23/SUMMARY.md`, `.ai/2026-02-23/tasks/issue-30146-investigation.md`

2. **Nx Easy Issues: Top 11 AI-Suitable Issues** (2026-02-23)

   - Summary: Scanned 381 open issues, ranked by AI suitability. Top picks: #32126 (bun publish), #34492 (esbuild type-check), #34391 cluster (git tag interpolation), #34279 (webpack process.env regression).
   - Files: `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`

3. **Fix: Prevent nxCloudId for new workspaces** (2026-02-20)

   - Summary: Added `nxCloud: 'skip'` to custom CNW flow so new workspaces don't get `nxCloudId` in `nx.json`. Updated 8 e2e tests.
   - Files: `.ai/2026-02-20/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34532

4. **DOC-406: Dedupe Content & Style Guide Fixes** (2026-02-19)

   - Summary: Content deduplication across concepts/ and features/ pages (trimmed mental-model, consolidated remote-cache intro, added cross-references) + style guide compliance fixes across 10 pages. Created `STYLE_GUIDE.md`.
   - Files: `.ai/2026-02-19/tasks/doc-406-dedupe-getting-started.md`

5. **Fix #32880: Next.js Jest Tests Don't Exit** (2026-02-19)

   - Summary: Root caused and fixed — Nx daemon socket left open by `withNx` calling `createProjectGraphAsync()`. One-line fix: `resetDaemonClient: true`.
   - Files: `.ai/2026-02-19/tasks/issue-32880-jest-not-exiting.md`, PR: https://github.com/nrwl/nx/pull/34518

6. **DOC-405: Intro Page & Getting Started Improvements** (2026-02-13)

   - Summary: Restructured intro challenges/solutions, added plugin-registry links, added global Nx update instructions to installation page
   - Files: `.ai/2026-02-13/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34410

7. **Nx.dev Website Update** (2026-02-13)

   - Summary: Cherry-picked docs commits from master to website-22 branch; 1 commit for AX improvements on getting started pages
   - Files: `.ai/2026-02-13/SUMMARY.md`

8. **SPACE Metrics UI Improvements** (2026-02-13)

   - Summary: Implemented YoY comparison for PR Throughput, classification footer, Dolphin 14-day target, P75 ~1.5x P50 thresholds, in-progress quarter asterisks, and planning accuracy logic fix (above budget = green)
   - Files: `.ai/2026-02-13/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/35

9. **CLI Analytics for Enterprise Customers - Proposal** (2026-02-12)

   - Summary: Created proposal spec for CLI analytics; matches GA PR #34144 1:1 for all commands, enterprise-only, fire-and-forget ingestion
   - Files: `.ai/2026-02-12/specs/generator-metrics.md`

10. **CLOUD-4255: Remove Misleading Title for Deferred Connection** (2026-02-12)

    - Summary: Fixed misleading "Nx Cloud configuration was successfully added" title for variant 2 deferred connection; added `writeLines()` to CLIOutput to output banner without NX badge
    - Files: `.ai/2026-02-12/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34416

## Pending
- [ ] Nx Easy Issues: Work through top 11 AI-suitable issues (2026-02-23 15:00)
  - Plan: `.ai/2026-02-23/tasks/nx-easy-issues-top11.md`
  - Goal: Triage and fix community issues ranked by AI suitability
  - Top picks: #32126, #34492, #34391 cluster, #34399, #34279, #34172, #34542, #34300, #32832, #32481, #31495

- [ ] Update all links for docs to use new URL (2026-02-23 11:57)

- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

- [ ] Consolidate Netlify edge functions & add error handling (2026-02-19 19:45)
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

- [ ] Framer _must_ launch this week

- [ ] Sandboxing, get the list of problems by EOD Wednesday

- [ ] Investigate if we need to update our edge functions, e.g. move the redirects from next.js to proper Netlify redirects file
  - Could help with any connectivity or latency issues

- [ ] Help Nicole with onboarding to hit 600 per week

- [ ] Help Max with AX and migrations specs before March starts

- [ ] Follow up on `op` and `gh` CLI usage with 1Password (2026-02-18 17:15)

  - Victor noticed people rarely have 1Password popping up during screenshares
  - Check with everyone that they're using `gh` CLI with 1Password integration
  - Post reminder message in #dev channel
  - Mention during all hands

- [ ] Slack #nx heads-up on cooldown week (2026-02-13 11:21)

  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599

- [ ] Look through all TODO(v23) comments and add tasks for them

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
  - They verified the fix so we just need to port it back to the plugin
  - JVA said that he will open a PR

Later:
