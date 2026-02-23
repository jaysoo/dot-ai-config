## Completed

### February 2026


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
  - Currently two calls to `createNxCloudOnboardingURL`: one for README (source='readme'), one for completion message (source='create-nx-workspace-success-*')
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
  - Removed expired LTS versions (v19, v18*, v17)
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
  - Files: packages/nx/src/plugins/js/index.ts, lock-file/lock-file.ts, build-dependencies/*.ts
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
