# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **CLOUD-4189: CNW Cloud Prompt Variants with Promo Message** (2026-01-26)

   - Summary: Extended CNW flow variants to 3: Variant 0 (current prompt), Variant 1 (old prompt), Variant 2 (no prompt, promo message). Both template and custom flows support all three variants.
   - Files: `.ai/2026-01-26/SUMMARY.md`, `packages/create-nx-workspace/`

2. **DOC-386: Add Netlify edge function for GA4 asset tracking** (2026-01-23)

   - Summary: Added edge function to track `.txt` and `.md` requests in GA4; detects AI tools from user-agent; requires GA4 setup in Netlify
   - Files: `.ai/2026-01-23/SUMMARY.md`, `astro-docs/netlify/edge-functions/track-asset-requests.ts`

3. **NXC-3754: Clean up CNW GitHub URL Messaging** (2026-01-23)

   - Summary: Consolidated two redundant GitHub URL messages into single message with `?name=...` parameter when gh push fails
   - Files: `.ai/2026-01-23/SUMMARY.md`, `packages/create-nx-workspace/`

4. **NXC-3753: Update CI Workflow Generator - nx-cloud to nx** (2026-01-23)

   - Summary: Replaced `nx-cloud record` with `nx record` in ci-workflow generator; addressed PR review by using `isNxCloudUsed()` instead of custom function
   - Files: `.ai/2026-01-23/SUMMARY.md`, `packages/workspace/src/generators/ci-workflow/`

5. **NXC-3718: Implement `NX_PREFER_NODE_STRIP_TYPES` Environment Variable** (2026-01-23)

   - Summary: Added env var to skip swc-node/ts-node when Node.js 22.6+ has native TS support; still registers tsconfig-paths; created e2e test for jest/cypress/playwright config loading
   - Files: `.ai/2026-01-23/SUMMARY.md`, `packages/nx/src/plugins/js/utils/register.ts`, `e2e/js/src/js-strip-types.test.ts`

6. **NXC-3718: Deep Investigation - @nx/jest Plugin Slowness** (2026-01-22)

   - Summary: Ran controlled experiments isolating imports vs tsconfig variation; confirmed imports don't cause slowdown, only varying tsconfig options (rootDir, baseUrl, paths) bust the transpiler cache
   - Files: `.ai/2026-01-22/tasks/NXC-3718-investigation-results.md`

7. **NXC-3753: Make Nx Cloud CLI commands noop with warning** (2026-01-22)

   - Summary: Made all Nx Cloud CLI commands check for `nxCloudId` first; commands now warn and exit gracefully instead of erroring; `record` still runs underlying command
   - Files: `.ai/2026-01-22/SUMMARY.md`, `packages/nx/src/command-line/nx-cloud/`

8. **Lighthouse Architecture Documentation** (2026-01-22)

   - Summary: Created comprehensive architecture docs for the lighthouse Phoenix app (tenant management, SPACE metrics); documented Expected State, Space Metrics, and Emails contexts
   - Files: `.ai/para/resources/architectures/lighthouse-architecture.md`, `.ai/2026-01-22/SUMMARY.md`

9. **DOC-381: Clean up banner.json and add to gitignore** (2026-01-22)

   - Summary: Removed generated banner.json files from astro-docs and nx-dev, added to .gitignore
   - Files: `.ai/2026-01-22/SUMMARY.md`

10. **AI Usage Stats Baseline Collection** (2026-01-21)

    - Summary: Collected AI tool usage for 11 team members, established I+O/Day as apples-to-apples metric (excludes cache reads), set 30-day collection cadence
    - Files: `dot_ai/para/areas/productivity/ai-usage/2025-01-21/`, `dot_ai/para/areas/productivity/README.md`

## Pending
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
