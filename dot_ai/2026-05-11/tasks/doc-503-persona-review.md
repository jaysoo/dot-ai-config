# DOC-503: Persona Review of Setting Up CI page

**Date:** 2026-05-11
**Branch:** `DOC-503` (worktree: `~/projects/nx-worktrees/DOC-503`)
**Linear:** [DOC-503](https://linear.app/nxdev/issue/DOC-503/movecreate-setting-up-ci-page-in-getting-started)
**Polygraph session:** docs-setting-up-ci-7e144f09

## Goal

Pressure-test the new `setup-ci.mdoc` page (`astro-docs/src/content/docs/getting-started/setup-ci.mdoc`) against two contrasting reader personas, compile actionable feedback, then produce three branch variants.

## Personas

1. **Persona A: Marcus** - existing Nx + GitHub Actions user, indifferent to Nx Cloud. Page needs to actually move him.
   File: `doc-503-persona-A-existing-user.md`
2. **Persona B: Priya** - new Nx user, doesn't know what Nx Cloud is, just learned Nx basics.
   File: `doc-503-persona-B-new-user.md`

## Process

1. Write persona briefs as standalone Markdown files (they're prompts Gemini will read directly).
2. Use `gemini-collab` skill to run a per-persona review of the page. Each Gemini call is given:
   - the persona brief
   - the page path
   - critical review instructions (specific findings, line refs, suggested edits, scoring)
3. Compile the two reviews into `doc-503-persona-feedback.md`.
4. Identify the most compelling cross-persona feedback and apply it to the current `DOC-503` branch as a new commit (via polygraph child agent).
5. Create two additional branches representing very different takes:
   - `DOC-503-variant-marketing` (or similar) - lean into Persona A's "convince me" frame
   - `DOC-503-variant-onboarding` (or similar) - lean into Persona B's "teach me" frame
   Final variant names decided after feedback compilation.

## Files

- `doc-503-persona-A-existing-user.md` - Marcus persona + review brief
- `doc-503-persona-B-new-user.md` - Priya persona + review brief
- `doc-503-persona-feedback.md` - compiled findings (written after Gemini returns)
- `doc-503-variant-plan.md` - sketches for the two alternate-take branches (written before branching)

## Constraints

- Do NOT delegate the Gemini call to a sub-agent - run gemini-collab directly from this session.
- Branch work goes through polygraph spawn_agent (the worktree is the polygraph clone).
- Pushes block on 1Password SSH agent - flag this to Jack each time a push is needed.
- Keep persona briefs and feedback in `.ai`, not in the nx repo.
