# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-393: Writing Style Linting — Vale + Claude Skill** (2026-03-06, completed)
   - Summary: Added Vale prose linter with 11 custom Nx rules, cacheable Nx target, mise.toml integration, and `nx-docs-style-check` Claude skill. CI green.
   - Files: `.ai/2026-03-06/specs/writing-style-linting.md`

2. **NXC-4030: Security CVE Cluster** (2026-03-05, completed)
   - Summary: Bumped copy-webpack-plugin, css-minimizer-webpack-plugin, MF packages, koa, Next.js to patched versions. Added noErrorOnMissing compat fix, migrations for 22.6.0-beta.10. PR #34708, CI green.
   - Files: `dot_ai/2026-03-05/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34708

3. **NXC-4035: Surface clearer CNW SANDBOX_FAILED error** (2026-03-05, completed)
   - Summary: Removed `--silent` from PM install commands, increased maxBuffer, structured error with exit code/log file/hint, added AI agent telemetry, migrated to CnwError. PR #34724.
   - Files: `dot_ai/2026-03-04/tasks/nxc-4035-cnw-sandbox-error-surfacing.md`, PR: https://github.com/nrwl/nx/pull/34724

4. **NXA-1075: nx-import Skill Rounds 3-4 + JEST.md + Gaps Report** (2026-03-04)
   - Summary: Created JEST.md, ran rounds 3-4 validation (8 scenarios each, all PASS), generated gaps report (14 gaps), pushed to nx-ai-agents-config PR #74.
   - Files: `.ai/2026-03-04/SUMMARY.md`, `~/.claude/commands/nx-import/GAPS-REPORT.md`

5. **DOC-436: Fix broken Netlify image URLs on docs** (2026-03-04)
   - Summary: Added `/.netlify/*` to Framer proxy edge function excludedPath so image CDN URLs pass through to astro-docs.
   - Files: `.ai/2026-03-04/SUMMARY.md`

6. **DOC-429: Task Sandboxing Documentation** (2026-03-04)
   - Summary: Created full sandboxing feature doc page with SVG diagram, 6 screenshots, examples, cloud settings. Multiple feedback rounds from Rareș. PR #34686 (draft, CI green).
   - Files: `.ai/2026-03-04/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34686

7. **NXC-4020: Restore CNW prompt flow to v22.1.3** (2026-03-02)
   - Summary: Reverted human-visible CNW flow to match v22.1.3, fixed `accessToken=undefined` bug, restored cloud prompt wording, split preset/template flows. CI green.
   - Files: `.ai/2026-03-02/tasks/cnw-revert-prompts-to-22.1.3.md`, PR: https://github.com/nrwl/nx/pull/34671

8. **February 2026 Cross-Functional Digest** (2026-03-02)
   - Summary: Generated monthly digest covering 457 issues across 6 teams, 6 CLI releases, 24 Cloud releases, ~160 infra commits. Plus technical changelog.
   - Files: `.ai/2026-03-02/tasks/nx-digest-2026-02-crossfunctional.md`, `.ai/2026-03-02/tasks/nx-digest-2026-02-changelog.md`

9. **DOC-428: Review All CLI and Cloud Links** (2026-03-02)
   - Summary: Full audit of nx.dev links in nx + ocean repos. Found 10 broken 404s, fixed ordering bugs, deleted legacy redirect-rules.js files, applied all fixes directly to `_redirects`.
   - Files: `.ai/2026-03-02/tasks/DOC-428-review-cli-cloud-links.md`

10. **DOC-415: Move nx-dev redirects to Netlify \_redirects** (2026-02-25)
    - Summary: Moved 1,231 redirect rules from Next.js serverless to Netlify CDN edge `_redirects` file. Preview deployment verified working.
    - Files: `.ai/2026-02-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34612

## Pending
- [ ] follow up on next.js cleanup pr (2026-03-06 15:50)
  - https://github.com/nrwl/nx/pull/34730

- [ ] Ask Alexis to move people to the right manager in Wagepoint (2026-03-03 13:53)
- [ ] Ask Alexis to update levels in Wagepoint and TriNet (2026-03-03 13:53)
- [ ] Ask Alexis about Colum sending hardware back (2026-03-03 13:52)
  - For offboarding

- [x] ~~Review Vite import results and make it repeatable~~ (2026-03-04, completed)
  - Created TESTING-PLAYBOOK.md, validated all 8 scenarios across 4 rounds, generated GAPS-REPORT.md
  - Pushed VITE.md, NEXT.md, JEST.md to nx-ai-agents-config PR #74
- [ ] Issue:https://github.com/nrwl/nx/issues/32750 (2026-02-26 14:53)
  - WASI problem it seems
  - 6 scenarios tested, all passing. Review config snippets and findings.
- [ ] Take cloud stats script and build into lighthouse (2026-02-28 09:09)
- [ ] Follow-up: GitHub app flow should not involve infra (2026-02-24 14:26)
  - Present it to DPEs and Red Panda (Mark). It is prone to human errors and is annoyign to set up when we run out of callback URLs.

- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

- [ ] Help Nicole with onboarding to hit 600 per week

- [x] ~~NXA-1075: Import test and document import gaps~~ (2026-03-04, completed)
  - 4 rounds × 8 scenarios, all PASS. GAPS-REPORT.md generated. PR #74 updated.

- [ ] Slack #nx heads-up on cooldown week (2026-02-13 11:21)
  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599

- [ ] Look through all TODO(v23) comments and add tasks for them

- [ ] Check on this disabled test e2e/nx-init/src/nx-init-nest.test.ts (https://github.com/nestjs/nest-cli/issues/3110)

- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
  - They verified the fix so we just need to port it back to the plugin
  - JVA said that he will open a PR

## Later
