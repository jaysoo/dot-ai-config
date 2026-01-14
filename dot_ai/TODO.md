# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-376: GA Scroll Depth Tracking for Marketing Pages** (2026-01-14)

   - Summary: Added `useWindowScrollDepth` hook to track scroll depth on marketing pages (/, /react, /java); fires scroll_0/25/50/75/90 events to GA
   - Files: `.ai/2026-01-14/SUMMARY.md`, `nx-dev/feature-analytics/src/lib/use-window-scroll-depth.ts`

2. **AI Trends PARA Area** (2026-01-10)

   - Summary: Created new PARA area to track AI/LLM trends; first entry documents "Normalization of Deviance" pattern - the Challenger disaster parallel for YOLO mode AI usage
   - Files: `dot_ai/para/areas/ai-trends/README.md`

3. **PARA TUI: Power Edit Feature** (2026-01-09)

   - Summary: Added `E` keybinding to open files in external editor ($EDITOR/nvim); uses tea.ExecProcess for proper terminal handoff
   - Files: `tools/para/internal/app/app.go`, `tools/para/internal/app/keys.go`

4. **Performance Reviews - January 2026** (2026-01-08)

   - Summary: Compiled comprehensive performance review notes for 8 engineers using GitHub PRs, Linear issues, 1:1 notes, and hackday data; suggested MC answers for all 6 review questions per engineer
   - Files: `dot_ai/2026-01-08/tasks/performance-reviews-jan-2026.md`

5. **PARA TUI App Specification** (2026-01-08)

   - Summary: Created detailed spec for Go TUI app using Bubbletea/Bubbles/Lipgloss/Glamour/Bleve; features action-focused inbox, three-pane layout, full-text search, Linear/Git integrations
   - Files: `dot_ai/2026-01-08/specs/para-tui-spec.md`

6. **2025 Productivity Report for Victor** (2026-01-08)

   - Summary: Created comprehensive productivity analysis showing AI tooling and August layoffs had net positive impact; TTFR decreased 68%, PR volume up 22.7%, LOC changed up 133% YoY; recommended SPACE framework for 2026
   - Files: [Google Doc](https://docs.google.com/document/d/1AYjxss9Eba0QWuGsx7TZmqsF9FDeurZABi8kjTRQ2Mc/edit?tab=t.0)

7. **GitHub Issue #34010: Fix replaceOverride for Variable References** (2026-01-07)

   - Summary: Fixed `replaceOverride` in ast-utils.ts to handle ESLint flat configs with variable references using property-level AST updates and `structuredClone`
   - Files: `.ai/2026-01-07/SUMMARY.md`, `packages/eslint/src/generators/utils/flat-config/ast-utils.ts`

8. **2026 Engineering Metrics Framework** (2026-01-08)

   - Summary: Designed SPACE-aligned metrics framework for 2026 with 7 key metrics: PR throughput, AI amplification index, planning accuracy, TTFR, code health ratio, developer satisfaction, and stakeholder satisfaction surveys
   - Files: `.ai/2026-01-08/SUMMARY.md`

9. **Work Composition Metrics** (2026-01-07)

   - Summary: Added Planned Work %, Unplanned Work, and Firefighting % metrics to productivity report; includes YoY analysis script for AI/layoff impact assessment
   - Files: `.ai/2026-01-07/SUMMARY.md`, `collect-productivity-baselines.mjs`, `generate-productivity-report.mjs`, `analyze-yoy.mjs`

10. **Productivity Baseline Script Improvements** (2026-01-07)

    - Summary: Fixed 0 PRs issue (GraphQL node limit, GitHub token auth), then added per-month caching for fast re-runs
    - Files: `.ai/2026-01-07/SUMMARY.md`, `collect-productivity-baselines.mjs`, `data/README.md`

## In Progress
- [ ] Follow up on slow jest configs for Island (2026-01-14 09:27)
  - Steven and Leo for this issue https://linear.app/nxdev/issue/NXC-3718/investigate-slow-nxjest-plugin-createnodes-with-ts-configs
- [ ] Steven 1:1 follow-up: DPE feature tracking improvements (2026-01-12 10:30)
  - Wait for Steven to create comprehensive feature list with desired metadata fields
  - Review list and identify what's solved by roadmap vs change log vs new solutions
  - Discuss with Victor (roadmap owner) and Nicole (change log) about implementation
  - Consider "post-done" status in Linear for released features
- [ ] Follow-up with Victor on Roadmap (2026-01-09 09:41)
  - Platform roadmap should be finalized and ready for review by end of next week. If not completed by then, raise this as a discussion topic during the 1:1 on Monday to address any blockers or get alignment on timeline.
- [ ] Follow-up CLOUD-2614: Investigate discrepancy in contributor count (2025-10-27 09:58)

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

- [ ] Follow-up NXC-3427: Multiple Nx daemons persist for same workspace in 21.6.8 (2025-10-27 09:58)

  - URL: https://linear.app/nxdev/issue/NXC-3427
  - Assignee: Max Kless | Priority: High | Status: In Progress
  - Issue: Multiple daemons observed after `nx reset`, causes "Waiting for graph construction" hangs
  - Customer: Block (via Caleb)

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
