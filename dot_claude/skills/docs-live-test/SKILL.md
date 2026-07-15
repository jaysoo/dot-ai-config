---
name: docs-live-test
description: Verify a docs guide actually works by building a fixture workspace in the guide's "before" state, then having a fresh agent follow ONLY the page to reach the guide's success criterion. Reports page gaps/mismatches and patches the page. Use when asked to "live test this guide", "verify the page works", "test the migration doc", or before shipping any migration/setup guide. Proven on the ESLint flat-config guide (DOC-549): found 2 page gaps + 2 generator bugs.
---

# Docs Live Test

Test a documentation guide the way a reader experiences it: no author knowledge, just the page.

## Inputs

- Page under test (file path in the repo, e.g. `astro-docs/src/content/docs/...`)
- The "before" state the guide assumes (e.g. legacy configs, old versions)
- Success criterion (e.g. `nx run-many -t lint` exits 0, app builds, feature works)

## Process

### 1. Setup agent (background, general-purpose)

Builds the fixture in the session scratchpad (NEVER inside the nx repo - gitignore kills watchers and pollutes the worktree):

- Create a real workspace (`create-nx-workspace` or `nx init`; check `--help`, never guess flags)
- Regress it to the guide's "before" state, planting one artifact per case the page addresses (e.g. a JSON config, a JS config the tool skips, an ignore file, each problem rule)
- Confirm the success criterion FAILS and capture the exact error
- `git commit` the baseline; write `FIXTURE_STATE.md` (versions, planted cases, failure output)
- Forbid the setup agent from reading the page under test (keeps the fixture unbiased)

### 2. Migrator agent (fresh, background)

- ONLY instruction source = the page under test (read once). Explicitly forbid reading other docs, package sources, or migration files
- Must reach the success criterion, then commit
- Log a FINDING for anything the page didn't cover: `blocker` (couldn't proceed from page alone), `gap` (needed knowledge the page omits), `mismatch` (page says X, reality is Y), `nit`
- Structured final report: result, steps mapped to page sections, findings, end state per planted case

### 3. Verify + patch (main loop)

- Independently rerun the success criterion in the fixture (`nx reset` first) - do not trust the agent's claim
- Check every planted case resolved the way the page prescribes (renames applied, not dropped; files deleted; etc.)
- Patch the page for each gap/mismatch (prettier + vale + commit per house docs flow)
- Product bugs the test exposes (generator/CLI defects) are NOT docs fixes: report them and offer to file Linear issues
- Report to Jack: pass/fail, gaps patched, bugs found, fixture path (note scratchpad is ephemeral; offer to move it if worth keeping)

## Gotchas (learned on DOC-549)

- Nx-inferred targets can mask the expected failure mode (e.g. eslintrc lint targets inject `ESLINT_USE_FLAT_CONFIG=false`, so failure = missing rules, not "config not found"). Capture BOTH the wired and raw-tool failure in FIXTURE_STATE.md and check the page's claims against the wired one.
- Pin the tool major the guide targets (the fixture once needed ESLint 9, not the latest 10).
- The migrator inevitably knows things - the findings log is the firewall: anything it did that the page didn't say is a gap, even when it succeeded.
