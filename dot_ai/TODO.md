# TODO

## Recent Tasks (Last 10)
<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Performance Reviews - January 2026** (2026-01-08)
   - Summary: Compiled comprehensive performance review notes for 8 engineers using GitHub PRs, Linear issues, 1:1 notes, and hackday data; suggested MC answers for all 6 review questions per engineer
   - Files: `dot_ai/2026-01-08/tasks/performance-reviews-jan-2026.md`

2. **PARA TUI App Specification** (2026-01-08)
   - Summary: Created detailed spec for Go TUI app using Bubbletea/Bubbles/Lipgloss/Glamour/Bleve; features action-focused inbox, three-pane layout, full-text search, Linear/Git integrations
   - Files: `dot_ai/2026-01-08/specs/para-tui-spec.md`

3. **2025 Productivity Report for Victor** (2026-01-08)
   - Summary: Created comprehensive productivity analysis showing AI tooling and August layoffs had net positive impact; TTFR decreased 68%, PR volume up 22.7%, LOC changed up 133% YoY; recommended SPACE framework for 2026
   - Files: [Google Doc](https://docs.google.com/document/d/1AYjxss9Eba0QWuGsx7TZmqsF9FDeurZABi8kjTRQ2Mc/edit?tab=t.0)

4. **GitHub Issue #34010: Fix replaceOverride for Variable References** (2026-01-07)
   - Summary: Fixed `replaceOverride` in ast-utils.ts to handle ESLint flat configs with variable references using property-level AST updates and `structuredClone`
   - Files: `.ai/2026-01-07/SUMMARY.md`, `packages/eslint/src/generators/utils/flat-config/ast-utils.ts`

5. **2026 Engineering Metrics Framework** (2026-01-08)
   - Summary: Designed SPACE-aligned metrics framework for 2026 with 7 key metrics: PR throughput, AI amplification index, planning accuracy, TTFR, code health ratio, developer satisfaction, and stakeholder satisfaction surveys
   - Files: `.ai/2026-01-08/SUMMARY.md`

6. **Work Composition Metrics** (2026-01-07)
   - Summary: Added Planned Work %, Unplanned Work, and Firefighting % metrics to productivity report; includes YoY analysis script for AI/layoff impact assessment
   - Files: `.ai/2026-01-07/SUMMARY.md`, `collect-productivity-baselines.mjs`, `generate-productivity-report.mjs`, `analyze-yoy.mjs`

7. **Productivity Baseline Script Improvements** (2026-01-07)
   - Summary: Fixed 0 PRs issue (GraphQL node limit, GitHub token auth), then added per-month caching for fast re-runs
   - Files: `.ai/2026-01-07/SUMMARY.md`, `collect-productivity-baselines.mjs`, `data/README.md`

8. **AI Usage Tracking Scripts** (2025-12-30)
   - Summary: Created suite of scripts to track AI tool usage (Claude Code, Cursor, VSCode) for team accountability; supports markdown/HTML output, cost estimates, shareable via GitHub Gist
   - Files: `scripts/ai-usage.mjs`, `scripts/claude-code-usage.mjs`, `scripts/cursor-usage.mjs`, `scripts/vscode-copilot-usage.mjs`

9. **DOC-330: Netlify Migration Review** (2025-12-29)
   - Summary: Reviewed nx-dev Netlify config; found issues: missing @netlify/plugin-nextjs, ~959 redirects near limit, external rewrites need plugin, middleware compatibility
   - Files: `dot_ai/2025-12-29/tasks/doc-330-netlify-migration-review.md`

10. **NXC-3641: Centralized Template Updater** (2025-12-29)
    - Summary: Built `nrwl/nx-template-updater` repo with GitHub App auth, nightly workflows, Slack notifications; committed locally, ready for team review
    - Files: `dot_ai/2025-12-29/tasks/nxc-3641-template-updater.md`, `/Users/jack/projects/nx-template-updater`

## In Progress

- [ ] Discuss Maven paywall decision with Victor (2026-01-07)
  - From Jason 1:1: Push for clarity on revenue path or abandon gating
  - Address underlying motivations not clearly communicated
  - Team pushback: Colum against, James raised issues at all hands

- [ ] Cut patch release for PR #34026 (20.8.x and 22.x) (2026-01-07)
  - PR: https://github.com/nrwl/nx/pull/34026
  - Fix: `@nx/plugin:migration` generator failing with ESLint flat configs containing variable references
  - Customer: Fidelity (via Slack: https://nrwl.slack.com/archives/C6WJMCAB1/p1767627484254249)
  - Versions: 20.8.x and 22.x branches

- [ ] Infra Sync
  - Docker Layer Caching as a feature to push, also NPM mirrors
    - Lots of value add for ST
  - It'd be a lot of work to replicate what our infra does for reliability, etc.

- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)
  - Linear: https://linear.app/nxdev/issue/NXC-3641
  - Plan: `.ai/2025-12-29/tasks/nxc-3641-template-updater.md`
  - Repo: `/Users/jack/projects/nx-template-updater`
  - Goal: Create `nrwl/nx-template-updater` repo to auto-update CNW templates when Nx publishes
  - Status: Implementation complete, pending team review
  - Remaining:
    - Test full update workflow via manual trigger
    - Add post-merge squash workflow to `nrwl/empty-template`
    - Enable schedule in check-and-update.yml (currently commented out)
    - Also need to run `npx nx configure-ai-agents` and `npx nx run-many -t lint test typecheck build e2e`

- [ ] Fix #33047 - @nx/web:file-server crash on non-GET requests (2025-10-27 09:58)
  - URL: https://github.com/nrwl/nx/issues/33047
  - Goal: Handle non-GET requests properly in file-server to prevent crashes with SPA mode
  - Impact: Small scoped fix (3 engagement)
  - Notes: Root cause identified - related to http-server issue with SPA proxy

- [ ] Follow-up NXC-3427: Multiple Nx daemons persist for same workspace in 21.6.8
  - URL: https://linear.app/nxdev/issue/NXC-3427
  - Assignee: Max Kless | Priority: High | Status: In Progress
  - Issue: Multiple daemons observed after `nx reset`, causes "Waiting for graph construction" hangs
  - Customer: Block (via Caleb)

- [ ] Follow-up CLOUD-3924: Compare Tasks doesn't show cache origin unless you click compare
  - URL: https://linear.app/nxdev/issue/CLOUD-3924
  - Assignee: Unassigned | Priority: High | Status: Todo
  - Issue: Cache origin not visible on Investigate tab until you click "Check for task"
  - Created by: Miro (DPE request)

- [ ] Follow-up CLOUD-2614: Investigate discrepancy in contributor count
  - URL: https://linear.app/nxdev/issue/CLOUD-2614
  - Assignee: Nicole Oliver | Priority: High | Status: Todo
  - Issue: Org shows 7/5 contributors used but list only shows 6 (null contributors not discounted)
  - Fix: Change in aggregator to discount "null" contributors from count
  - Customer: Org 65811494657f145ed525b196

- [ ] Fix #32880 - Next.js Jest tests do not exit properly (2025-10-27 09:58)
  - URL: https://github.com/nrwl/nx/issues/32880
  - Goal: Configure Jest properly for Next.js apps to avoid hanging after test completion
  - Impact: Medium (4 engagement)
  - Notes: Workaround exists (forceExit config), affects only Next.js apps created with nx/next

- [ ] Fix #32439 - MaxListenersExceededWarning with run-many (2025-10-27 09:58)
  - URL: https://github.com/nrwl/nx/issues/32439 Goal: Fix event listener management in task runner to prevent MaxListenersExceededWarning
  - Impact: High (18 engagement - 4 comments, 14 reactions)
  - Notes: Reproducible in nx-examples repo, affects run-many and affected commands

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

