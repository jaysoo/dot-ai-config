# Skill & Command Usage Tracker

Tracks when skills and commands were last invoked. Use this to identify unused items for cleanup.

## Invocations

| Name                   | Type    | Last Invoked | Count |
| ---------------------- | ------- | ------------ | ----- |
| plannotator-review     | command | 2026-08-05   | 1     |
| plan-task              | command | 2026-08-05   | 1     |
| dot-claude-guard       | skill   | 2026-08-06   | 22    |
| ga-traffic             | skill   | 2026-07-30   | 0     |
| nx-workspace           | skill   | 2026-08-05   | 2     |
| ocean-trivy-verify     | skill   | 2026-07-29   | 0     |
| openai-docs            | skill   | 2026-07-27   | 2     |
| cnw-update-templates   | skill   | 2026-07-15   | 3     |
| code-comment-style     | skill   | 2026-08-06   | 1     |
| github:yeet            | skill   | 2026-07-13   | 1     |
| github:github          | skill   | 2026-07-13   | 1     |
| use-plannotator-for-review | skill | 2026-08-05 | 2     |
| remotion-best-practices | skill   | 2026-07-13   | 3     |
| caveman                | skill   | 2026-08-06   | 37    |
| 1-on-1-prep            | skill   | 2026-07-23   | 2     |
| polygraph:polygraph    | skill   | 2026-08-06   | 11    |
| op-request-reason      | skill   | 2026-07-28   | 1     |
| freeze-capture         | skill   | 2026-07-06   | 1     |
| blog-writing           | skill   | 2026-07-24   | 6     |
| nx-workspace-expert    | skill   | 2026-07-09   | 1     |
| nx-docs-writer         | skill   | 2026-07-08   | 1     |
| nx-docs-style-check    | skill   | 2026-08-06   | 4     |
| reflect                | command | 2026-08-06   | 15    |
| polygraph:await-polygraph-ci | skill | 2026-07-21 | 1 |
| summarize              | command | 2026-08-06   | 12    |
| update-config          | skill   | 2026-06-24   | 1     |
| nx-scorecard           | skill   | 2026-06-09   | 0     |
| audit-project-health   | skill   | 2026-05-25   | 12    |
| scan-and-audit         | skill   | 2026-05-25   | 1     |
| plan-week              | command | 2026-05-21   | 3     |
| dte-analyzer           | skill   | 2026-05-15   | 2     |
| audit-dependencies     | skill   | 2026-04-24   | 3     |
| brainstorm             | skill   | 2026-04-24   | 2     |
| gemini-collab          | skill   | 2026-04-24   | 1     |
| skill-creator          | skill   | 2026-04-24   | 1     |
| terminal-demo-recorder | skill   | 2026-04-24   | 1     |
| cnw-stats-local-server | skill   | 2026-04-23   | 0     |
| audit-api-surface      | skill   | 2026-04-09   | 9     |
| audit-supply-chain     | skill   | 2026-04-09   | 5     |
| customer-deps-audit    | task    | 2026-04-09   | 5     |
| team-capacity-audit    | task    | 2026-04-09   | 12    |
| cnw-stats-analyzer     | skill   | 2026-04-01   | 3     |
| reflect                | skill   | 2026-04-01   | 2     |
| linear-issue-style     | skill   | 2026-07-30   | 8     |
| site-checker           | skill   | 2026-04-01   | 0     |
| summarize              | command | 2026-04-01   | 2     |
| plan-week              | skill   | 2026-03-30   | 1     |
| netlify-deploy-status  | skill   | 2026-03-27   | 1     |
| pylon-support          | skill   | 2026-03-27   | 1     |
| kudos                  | command | 2026-03-24   | 0     |
| metrics-review         | skill   | 2026-03-24   | 1     |
| 2026-04-24             | terminal-demo-recorder | 1            | 0     |
## USAGE UPDATE
2026-04-24: invoked caveman skill
\n2026-04-28: configured whitelist.toml policy for non-destructive tools
cnw-stats-analyzer (2026-04-29): 1
2026-06-04: invoked caveman skill (count++)
2026-06-04: invoked remotion-best-practices skill -> set up promos screenshot->video project
2026-06-10: invoked caveman, polygraph, op-request-reason skills (ocean sandbox badge session)
2026-06-12: invoked caveman, remotion skills (task sandboxing explainer video)
2026-06-12: invoked summarize, reflect skills (ocean badge session); created readme-demo-injector skill
2026-06-18: invoked op-request-reason, summarize, reflect skills (ocean Q-503 upsell CTAs); created pre-pr-review skill; CLAUDE.md += Ocean PR-base-is-main + fish var word-splitting + git-add-after-rm; settings.json += npx eslint
2026-06-23: invoked reflect, op-request-reason skills (CNW templates hardening: CI Node 24, TS 5.9/6.0 split, project.json->package.json conversion, doc-link 404 audit, PR #36085, reviewed audit fixes); created cnw-templates-dep-audit skill (daily dep audit + PRs); deprecated cnw-update-templates; CLAUDE.md += node -e fish gotcha + installed-vs-declared deps + WebFetch small-batch; settings.json nx.dev domain BLOCKED by classifier
2026-07-09: invoked nx-workspace-expert skill (GitHub Actions CI parallelization guidance)
2026-07-11: invoked caveman, polygraph, nx-docs-style-check skills (DOC-549 high-impact pages session)
2026-07-15: invoked cnw-update-templates, op-request-reason, dot-claude-guard skills (nx 23.1.0 migrate of 12 templates + TS-6 tsconfig fixes: baseUrl->relative paths, moduleResolution node->bundler, drop esModuleInterop:false/ignoreDeprecations, e2e types:[node], @types/node 20->24, angular narrowing bug; force-pushed 8 repos); patched cnw-update-templates skill (typecheck target fix + coverage assertion + 3c clean-install/fresh-scaffold verify + 3d deprecation scan)
2026-07-15: invoked summarize, reflect, linear-issue-style skills (DOC-549 wrap-up); created docs-live-test skill
2026-07-18: invoked caveman, linear-issue-style skills (Ahrefs keyword analysis, DOC-555); deduped caveman rows
2026-07-18: invoked caveman, linear-issue-style skills (Ahrefs SEO audit -> DOC-556)
2026-07-21: invoked caveman, polygraph:polygraph, linear-issue-style, polygraph:await-polygraph-ci, summarize, reflect (NXC-4179 re-enable e2e tests, PR #36408 merged)
2026-07-21: invoked caveman, linear-issue-style skills (GHA job summary research for Nx Cloud DTE runs -> CLOUD-4877)
2026-07-21: invoked caveman skill (Joe 1:1 notes + TODO action items)
2026-07-22: invoked caveman skill (60-day TODO summary)
2026-07-23: invoked dot-claude-guard skill (Codex CLI config compatibility audit)
2026-07-27: invoked caveman skill (GEO/SEO keyword + AI prompt tracker -> Notion Acquisition page)
2026-07-28: invoked dot-claude-guard skill (Codex CLI config compatibility audit)
2026-07-28: invoked caveman skill (archax + accrual-dev pre-churn agent usage lookup)
2026-07-28: invoked linear-issue-style skill (churn-risk alerting -> CLOUD-5049)
2026-07-28: invoked caveman, polygraph, op-request-reason skills (NXC-4688 optional webpack/MF peers for @nx/react + @nx/next, draft PR #36492)
2026-07-28: invoked polygraph:polygraph, polygraph:session-debrief, caveman skills (NXC-4612 nightly E2E matrix failure triage)
2026-07-29: invoked polygraph:polygraph, linear-issue-style skills (NXC-4739 axios/brace-expansion bumps PR #36507; removal research -> NXC-4743)
2026-07-29: invoked polygraph:polygraph, polygraph:session-debrief, caveman skills (NXC-4687 CNW template egress fallback, draft PR #36508)
2026-07-30: invoked summarize, reflect commands (NXC-4688 merged #36492 wrap-up)
2026-07-30: invoked caveman, linear-issue-style skills (Ahrefs CI keyword research -> 5 content ideas in DOC-563)
2026-08-04: invoked caveman skill (DOC-542 Pylon KB sync investigation, plan + Linear comment)
2026-08-05: invoked polygraph:polygraph, caveman skills (DOC-542 Pylon KB sync session)
2026-08-05: invoked summarize, reflect skills (NXC-4687 merged #36508 wrap-up; CLAUDE.md updates + cnw-dist-smoke skill created)
2026-08-06: invoked caveman skill (Nx keyword & prompt audit session)
