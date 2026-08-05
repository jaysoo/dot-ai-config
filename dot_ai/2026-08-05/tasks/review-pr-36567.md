# Review nrwl/nx PR #36567

## Goal

Review the complete PR in context and report only actionable correctness, regression, test-coverage, or maintainability findings. Do not post comments or reviews to GitHub.

## Step 1: Establish scope and intent

- [x] Read the PR title, description, linked issue context, commits, reviews, comments, changed-file list, and CI state.
- [x] Identify the affected projects from the changed package roots. Resolved Nx target discovery was attempted but blocked by the current checkout's pnpm non-TTY modules-purge guard.

## Step 2: Inspect the implementation

- [x] Read the full diff and surrounding source code.
- [x] Trace changed behavior through callers, tests, project configuration, and relevant repository conventions.
- [x] Check generated-file boundaries and backward-compatibility implications.

## Step 3: Validate findings

- [x] Run focused runtime comparisons for picomatch array semantics and `splitGlobPatterns`; inspect the green full CI result and run `git diff --check`.
- [x] Re-check each candidate finding against the PR head and base behavior.

## Step 4: Report

- [x] Present findings first, ordered by severity, with exact file and line references.
- [x] Summarize validation gaps.
- [x] Remove this task from `.ai/TODO.md` and archive the completed review.

## Tracking

Keep this section updated while executing the review, including commands run, evidence gathered, candidate findings accepted or rejected, and validation results.

- Reviewed PR #36567 at `9f799c8fd602f4e709d054daa7bf42ef3a0b4681` against `origin/master` in Plannotator's isolated checkout, then canceled Plannotator per request.
- Scope: 38 files across nx, devkit, jest, playwright, react, rsbuild, eslint tests, manifests, and lockfile. No generated files changed; `git diff --check` is clean.
- GitHub context: draft, mergeable, review required; latest Linux/macOS, CodeQL, Netlify, conformance, lockfile, sync, formatting, and affected suites are green after a flaky self-healing rerun.
- Finding 1: `packages/nx/src/generators/utils/glob.ts:59` passes mixed positive/negative globs to `picomatch(patterns)`. Reproducer: `['packages/*/package.json', '!packages/excluded/package.json']` returns true for `tools/package.json`, while the previous combined minimatch returned false. Tree-created files outside every positive glob can enter `glob`/`globAsync` results.
- Finding 2: `packages/jest/src/plugins/plugin.ts:243` has the same array semantics on package-manager workspace globs. Negative workspace entries are supported and tested in the nx package-json plugin; with one present, a package outside all positive workspaces is treated as included and may be inferred as a Jest project.
- Rejected as primary findings: accepted `a/**`, `!(x)`, `#pattern`, and backslash semantic differences already documented in the implementation task; unrelated lockfile re-resolution drift is review noise given frozen-lockfile CI is green.
- Validation gap: `pnpm nx show ...` attempted an automatic install and stopped at `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`; no dependency mutation was authorized. Existing full CI and direct Node/tsx reproducers provide the evidence used here.

## Expected outcome

A concise, evidence-backed review of https://github.com/nrwl/nx/pull/36567 with no GitHub write actions.
