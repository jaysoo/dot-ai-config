# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **NXC-3898: Clarify Security Email Usage** (2026-02-11)

   - Summary: Updated SECURITY.md to clarify security email is for demonstrable, verified vulnerabilities in Nx codebase, not outdated dependencies or scanner output
   - Files: `.ai/2026-02-11/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34411

2. **CLOUD-4246: Access Control Confirmation Dialog** (2026-02-11)

   - Summary: Replaced inline Save/Cancel buttons with modal confirmation dialogs for access control settings to prevent accidental changes from trackpad gestures
   - Files: `.ai/2026-02-11/SUMMARY.md`, PR: https://github.com/nrwl/ocean/pull/9985

3. **CLOUD-3924: Compare Tasks Cache Origin Fix** (2026-02-11)

   - Summary: Fixed "Originated from" link not showing on Compare Tasks page without selecting a comparison task; cache origin now displays immediately for remote-cache-hit tasks
   - Files: `.ai/2026-02-11/SUMMARY.md`, PR: https://github.com/nrwl/ocean/pull/9992

4. **Victor 1:1 Notes** (2026-02-09)

   - Summary: Timezone expectations for Max/Chau, Max performance feedback, team redundancy concerns, agentic onboarding progress
   - Files: `.ai/para/areas/personnel/victor.md`

4. **Google Apps Script PTO Calendar: Bug Fixes** (2026-02-06)

   - Summary: Fixed duplicate PTO bug (single-day events showing in Today AND Tomorrow) and skip Tomorrow section on Fridays
   - Files: `.ai/2026-02-06/SUMMARY.md`, `/Users/jack/projects/gcal/script.js`

5. **SPACE Metrics Port & UI Fix** (2026-02-05)

   - Summary: Ported SPACE metrics improvements from space-metrics to lighthouse (expanded Misc detection, Quokka team-specific rules, 365-day cap); fixed Target legend to use colored emoji squares
   - Files: `.ai/2026-02-05/SUMMARY.md`, `lib/lighthouse/space_metrics/calculators/linear_metrics.ex`

6. **Nx Cloud Workspace Claim Enforcement Spec** (2026-02-04)

   - Summary: Brainstormed structural changes to increase Nx Cloud onboarding; spec proposes 7-day claim enforcement where CI fails after grace period until workspace is claimed
   - Files: `.ai/2026-02-04/specs/cloud-claim-enforcement.md`

7. **Agentic CNW Implementation - AI Agent Detection & NDJSON Output** (2026-02-04)

   - Summary: Implemented AI agent detection and NDJSON output for create-nx-workspace; AI detected via env vars, non-interactive mode, structured JSON results with GitHub setup instructions
   - Files: `.ai/2026-02-04/SUMMARY.md`, `packages/create-nx-workspace/src/utils/ai/ai-output.ts`

8. **Google Apps Script PTO Calendar: Daily "Today + Tomorrow" Feature** (2026-02-04)

   - Summary: Extended daily notifications to show both today AND tomorrow's events for better planning; added day filtering and new Today/Tomorrow section formatting
   - Files: `.ai/2026-02-04/SUMMARY.md`, `/Users/jack/projects/gcal/script.js`

9. **DOC-395: Server-Side Page View Tracking** (2026-02-02)

   - Summary: Created track-page-requests edge function for HTML pages; fixed double-counting in track-asset-requests; added comprehensive excludedPath for fonts/images/pagefind
   - Files: `.ai/2026-02-02/tasks/DOC-395-server-page-tracking.md`, `astro-docs/netlify/edge-functions/track-page-requests.ts`

## Pending
- [ ] Write a proposal for stats for generators and other CLI commands (2026-02-11 09:11)
  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770674582319699
- [ ] SPACE Metrics (Lighthouse) Feedback from Jason Jean (2026-02-10 16:26)
  - PR Throughput: Show baseline context (what does "red 42" mean?)
  - Planning Accuracy: Add better description of what the metric measures
  - Issue Resolution:
    - Clarify it's for Misc/unassigned tasks only (definition differs for Red Panda vs Quokka)
    - Extend target to 14 days for Dolphin team (cycle-based workflow)
    - P75 targets should be more lenient than P50 (~50% more time as starting point)
    - Add asterisk noting Q1 is partial/in-progress quarter
- [ ] add Jeff to future planning meetings (2026-02-10 14:39)
- [ ] Talk to Max about time zone expectations (2026-02-09 14:00)
  - Need 3-4 hours overlap with Eastern team (noon ET = 6pm CET)
  - Address performance reliability concerns from Victor
- [ ] Talk to Chau about time zone expectations (2026-02-09 14:00)
  - Clarify Victor's overlap concerns (Chau is Central time, only 1hr behind Eastern)
  - Discuss backup coverage for critical areas
- [ ] Follow up with Nicole on agentic onboarding testing results (2026-02-09 14:00)
  - Goal: AI creates NX workspace with cloud setup via "YOLO mode"
  - Identify gaps where manual intervention required
- [ ] Review init experience and sync with Nicole (2026-02-10)
  - NX init improvements needed for AI compatibility
- [ ] Talk to Thomas to update Ben and others to be under me or Nicole, etc. for wagepoint (2026-02-09 11:45)
- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
- [ ] Talk to Thomas about reporting structure in Wagepoint (2026-01-30 16:04)
- [ ] Follow-up CLOUD-2614: Investigate discrepancy in contributor count (2025-10-27 09:58)
- [ ] Follow-up NXC-3427: Multiple Nx daemons persist for same workspace in 21.6.8 (2025-10-27 09:58)
- [ ] Follow up on slow jest configs for Island (2026-01-14 09:27)
  - Steven and Leo for this issue https://linear.app/nxdev/issue/NXC-3718/investigate-slow-nxjest-plugin-createnodes-with-ts-configs
- [ ] Steven 1:1 follow-up: DPE feature tracking improvements (2026-01-12 10:30)
  - Wait for Steven to create comprehensive feature list with desired metadata fields
  - Review list and identify what's solved by roadmap vs change log vs new solutions
  - Discuss with Victor (roadmap owner) and Nicole (change log) about implementation
  - Consider "post-done" status in Linear for released features
- [ ] Follow-up with Victor on Roadmap (2026-01-09 09:41)
  - Platform roadmap should be finalized and ready for review by end of next week. If not completed by then, raise this as a discussion topic during the 1:1 on Monday to address any blockers or get alignment on timeline.
- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

  - Linear: https://linear.app/nxdev/issue/NXC-3641
  - Plan: `.ai/2025-12-29/tasks/nxc-3641-template-updater.md`
  - Repo: `/Users/jack/projects/nx-template-updater`
  - Goal: Create `nrwl/nx-template-updater` repo to auto-update CNW templates when Nx publishes
  - Status: On hold - could be handled as an AI-assisted migration later, so no immediate action needed
  - Action: Discuss with Colum during 1:1 to confirm deprioritization

- [ ] Fix #33047 - @nx/web:file-server crash on non-GET requests (2025-10-27 09:58)

  - URL: https://github.com/nrwl/nx/issues/33047
  - Goal: Handle non-GET requests properly in file-server to prevent crashes with SPA mode
  - Impact: Small scoped fix (3 engagement)
  - Notes: Root cause identified - related to http-server issue with SPA proxy

- [ ] Fix #32880 - Next.js Jest tests do not exit properly (2025-10-27 09:58)

  - URL: https://github.com/nrwl/nx/issues/32880
  - Goal: Configure Jest properly for Next.js apps to avoid hanging after test completion
  - Impact: Medium (4 engagement)
  - Notes: Workaround exists (forceExit config), affects only Next.js apps created with nx/next

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)
