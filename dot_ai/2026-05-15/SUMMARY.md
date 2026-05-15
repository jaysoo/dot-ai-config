# 2026-05-15

## Q-443: Tie sandbox violations prompt and dashboard together

Continuation of the work started 2026-05-14 (ocean PR #11249 - sandbox-violation warning redesign, already merged).

### ocean (`/Users/jack/projects/ocean-worktrees/Q-443`, branch `Q-443`, PR open)

Commits on top of `main`:
- `126639409b` fix(nx-cloud): count sandbox-violation tasks, not runs (initial — distinct on taskId, run-group scoped)
- `92dd976152` feat(nx-cloud): collapsible "How to fix these violations" panel on dashboard
- `85bf2869b2` chore(misc): sync tsconfig
- `a7cb8a58b0` fix(nx-cloud): address review feedback (sandbox dashboard panels)
- `048e94ff48` fix(nx-cloud): use dedupe-most-recent for CIPE sandbox task count
- `e784c71ade` fix(nx-cloud): scope CIPE sandbox task count to branch + 7d window
- `956c5b9c7b` fix(nx-cloud): reuse dashboard violations query for CIPE warning count
- `2d4622e610` feat(nx-cloud): show "X of Y tasks" on CIPE sandbox warning
- `b884cf2f3f` fix(testing): pass branch on sandbox-report fixture so warning e2e matches new query

What landed:
- **CIPE warning task count** now uses the dashboard's own query (`getWorkspaceSandboxViolations({pageSize: 1})`, read `.totals.totalViolatingTasks`). One source of truth - CIPE warning, dashboard "Tasks with violations" tile, and the report's `index.json` "N tasks ok" all agree for a branch. Dashboard query untouched in this PR.
- **Header copy** changed to "X of Y tasks on this branch have sandbox violations" using `totalCleanTasks` already returned by the query.
- **Dashboard panel** ("How to fix these violations") added - collapsible, mirrors the run-page warning's Fix-with-AI / manual-flow two-column layout, uses enterprise/purple tokens. Includes the full 5-step manual sequence.
- **AI prompt builder** (`buildSandboxAiFixPrompt`) extracted to `@nx-cloud/ui-ci-pipeline-executions` so both surfaces share it. Step 5 adapts to branch: protected (main/master/workspace default) → "create a new branch and open a PR, then switch to the PR branch and start a new fix session with `<pr-branch>` reports"; feature → "push to this branch."
- **`isProtectedSandboxBranch`** helper exported and used on both surfaces. Threaded `workspace.defaultBranch` through the CIPE outlet context so the run-page warning gets the same protected detection as the dashboard.
- **Links**: in-app uses `<Link>` (same-tab); docs use absolute `https://nx.dev/docs/guides/nx-cloud/fix-sandbox-violations` with `target="_blank"`.
- **E2E fix**: `cipe-details.spec.ts` test fixture now sets `branch: cipe.branch` on `createTestSandboxReport` so the new branch-scoped query matches (auto-fix proposed by nx-cloud self-healing CI, applied locally before push).

### nx (`/Users/jack/projects/nx-worktrees/Q-443`, branch `Q-443`, PR open)

Single commit on top of master:
- `338a3a95b8` docs(nx-cloud): add fix sandbox violations guide

What landed:
- New KB article at `astro-docs/src/content/docs/guides/Nx Cloud/fix-sandbox-violations.mdoc` (URL `/docs/guides/nx-cloud/fix-sandbox-violations`).
- Sidebar entry under Knowledge Base → Continuous integration.
- `llm_copy_prompt` block at top (mirrors the in-app Fix-with-AI prompt).
- Cache-hits informational note moved to step 6 (was a top-of-page caution).
- Vale clean (0 errors).

### Notes / lessons applied to CLAUDE.md

- Version plans: skip a `fix:` plan when the feature already has a plan in the same unreleased cycle. Q-443 was a follow-up to PR #11249 (sandbox-warning redesign) which hadn't shipped, so all my `fix:` plans were noise.
- Refactor-on-extend pushback: extracting a shared dedup-stage builder from the dashboard fn made the PR harder to review even though dashboard behavior was unchanged. The accepted shape is to *call* the existing function rather than refactor it. Documented in CLAUDE.md.
