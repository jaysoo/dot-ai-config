# NXC-4728: Add docs reviewer checks to review-pr skill

Date: 2026-08-04
Linear: NXC-4728 | PR: https://github.com/nrwl/nx/pull/36562 (draft)
Branch: NXC-4728 (worktree ~/projects/nx-worktrees/NXC-4728)
Polygraph session: humble-beaver-3540ffdd

## Goal

review-pr skill had no docs-specific checks. Docs PRs (astro-docs content) should be reviewed against committed rules: astro-docs/STYLE_GUIDE.md + CLAUDE.md docs instructions.

## What shipped

- New `.claude/agents/docs-reviewer.md` — read-only analyzer, same pattern as performance/security analyzers:
  - Reads STYLE_GUIDE.md/CLAUDE.md from PR checkout (not from memory) so rules track the repo
  - Structural checks: redirects for moved/renamed/deleted pages (astro.config.mjs + astro-docs/netlify.toml), sidebar-label-coupled routes (breadcrumbs/sidebar_group_cards), Markdoc validity, links/anchors
  - Content checks: IA five rules, golden path, claim calibration, terminology, anti-AI voice rules
  - Verdicts: DOCS_SOUND / DOCS_CONCERN (important) / DOCS_BROKEN (critical); voice polish -> Suggestions
  - Does NOT run vale (read-only; vale runs in CI) — covers what vale can't
- SKILL.md wiring:
  - Step 5a.4 dispatch, gated on diff touching `astro-docs/src/content/` or `astro-docs/sidebar.mts`
  - Structural-skip-table row (inverse gate), Step 7 verdict list, DOCS_SOUND in endorsement-evidence rule
  - PIPELINE_VERSION 5 -> 6
  - "Docs direction" trim-time section now delegates compliance to the agent, keeps editorial direction

## Notes

- All claimed paths/mechanisms verified against repo before commit (session-debrief lesson from skill-template-updates: a SKILL.md once shipped a fabricated workflow reference)
- `.claude/` is in Jack's global gitignore — needed `git add -f` for the new agent file (existing agents are tracked)
