# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Agentic CNW Implementation - AI Agent Detection & NDJSON Output** (2026-02-04)

   - Summary: Implemented AI agent detection and NDJSON output for create-nx-workspace; AI detected via env vars, non-interactive mode, structured JSON results with GitHub setup instructions
   - Files: `.ai/2026-02-04/SUMMARY.md`, `packages/create-nx-workspace/src/utils/ai/ai-output.ts`

2. **Google Apps Script PTO Calendar: Daily "Today + Tomorrow" Feature** (2026-02-04)

   - Summary: Extended daily notifications to show both today AND tomorrow's events for better planning; added day filtering and new Today/Tomorrow section formatting
   - Files: `.ai/2026-02-04/SUMMARY.md`, `/Users/jack/projects/gcal/script.js`

3. **DOC-395: Server-Side Page View Tracking** (2026-02-02)

   - Summary: Created track-page-requests edge function for HTML pages; fixed double-counting in track-asset-requests; added comprehensive excludedPath for fonts/images/pagefind
   - Files: `.ai/2026-02-02/tasks/DOC-395-server-page-tracking.md`, `astro-docs/netlify/edge-functions/track-page-requests.ts`

4. **NXC-3806: Nx Worktree Cache Sharing** (2026-02-02)

   - Summary: Implemented automatic cache sharing between git worktrees; worktrees use main repo's `.nx/cache`; discovered cache DB must be co-located with files and workspace-data must stay per-workspace
   - Files: `.ai/2026-02-02/tasks/worktree-cache-sharing.md`, `packages/nx/src/utils/cache-directory.ts`

5. **Google Apps Script PTO Calendar Fix** (2026-01-31)

   - Summary: Fixed timezone issues (end before start bug), multi-day event handling, grouped events by person, separated holidays, improved output format
   - Files: `.ai/2026-01-31/SUMMARY.md`, `/Users/jack/projects/gcal/script.js`

6. **Lighthouse SPACE Metrics UI Improvement** (2026-01-30)

   - Summary: Improved metric target legends with colored square emojis and cleaner legend format across all 4 metrics sections
   - Files: `.ai/2026-01-30/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/29

7. **Leo 1:1 Notes** (2026-01-30)

   - Summary: Updated Leo's personnel file with comprehensive notes from 2026-01-26 1:1 covering Swedbank onsite, L5 career development, and AI automation initiatives
   - Files: `.ai/para/areas/personnel/leo.md`

8. **DOC-380: Docs Layout Whitespace on Large Screens** (2026-01-30)

   - Summary: Fixed excessive whitespace on large screens in Astro docs by pushing TOC to right edge; initially tried max-width centered layout but reverted to simpler flex approach
   - Files: `.ai/2026-01-30/SUMMARY.md`, `astro-docs/src/styles/global.css`

9. **DOC-392: Reduce nx-dev Next.js Build Memory Usage Below 8 GB** (2026-01-30)

   - Summary: Fixed OOM errors on Netlify by adding `experimental.cpus: 1`, upgrading Next.js to 14.2.35, and configuring proper Netlify deployment with `@netlify/plugin-nextjs`
   - Files: `.ai/2026-01-30/SUMMARY.md`, `nx-dev/nx-dev/next.config.js`, `nx-dev/nx-dev/project.json`, `nx-dev/nx-dev/netlify.toml`

10. **DOC-385: Fix Failing Internal Link Checks After /launch-nx Removal** (2026-01-29)

    - Summary: Fixed broken `/launch-nx` link in release-notes.mdoc, removed from ignore list, and fixed cache input bug where `sitemap.xml` (index) was cached instead of `sitemap-0.xml` (actual URLs)
    - Files: `.ai/2026-01-29/SUMMARY.md`, `astro-docs/validate-links.ts`, `nx-dev/nx-dev/project.json`

## Pending
- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
- [ ] Talk to Thomas about reporting structure in Wagepoint (2026-01-30 16:04)
- [ ] Claude plugin for Nx repo (2026-01-26)
  - Create a plugin to share skills, agents, etc. with the Nx team
  - Discuss with Jason during 1:1
- [ ] Potential: Consolidate CNW short URL generation (2026-01-26)
  - Currently two calls to `createNxCloudOnboardingURL`: one for README (source='readme'), one for completion message (source='create-nx-workspace-success-*')
  - Files: `packages/workspace/src/generators/new/generate-workspace-files.ts:311`, `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts:100`
  - May be intentional for separate tracking (discussed with Jason)

## In Progress
- [ ] Check on Divvy vendor card that it works (2026-01-23 09:40)
- [ ] Add nx-console to SPACE metrics (2026-01-22 13:50)
- [ ] Follow-up CLOUD-2614: Investigate discrepancy in contributor count (2025-10-27 09:58)
- [ ] Get back to Dillon re: 401K (2026-01-21 17:58)
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

- [ ] Follow-up CLOUD-3924: Compare Tasks doesn't show cache origin unless you click compare

  - URL: https://linear.app/nxdev/issue/CLOUD-3924
  - Assignee: Unassigned | Priority: High | Status: Todo
  - Issue: Cache origin not visible on Investigate tab until you click "Check for task"
  - Created by: Miro (DPE request)

- [ ] Fix #32880 - Next.js Jest tests do not exit properly (2025-10-27 09:58)

  - URL: https://github.com/nrwl/nx/issues/32880
  - Goal: Configure Jest properly for Next.js apps to avoid hanging after test completion
  - Impact: Medium (4 engagement)
  - Notes: Workaround exists (forceExit config), affects only Next.js apps created with nx/next

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

- [ ] Follow-up: CNW ASCII Banner A/B Testing (2026-01-14)
  - When implementing A/B testing for Nx Cloud completion message format (ASCII banner vs bordered/highlighted)
  - **Important**: Must include message format in short URL meta property for cloud analytics
  - Example: `variant-0-banner`, `variant-0-bordered`, `variant-1-banner`, `variant-1-bordered`
  - This allows tracking conversion rates per message format
  - Related: `.ai/2026-01-14/tasks/nxc-3628-remove-cloud-prompt.md` (see Follow-up Tasks section)
