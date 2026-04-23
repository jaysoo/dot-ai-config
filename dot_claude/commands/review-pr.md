# Deep PR Review

Thoroughly review a GitHub PR by checking out the branch locally, verifying tests, and validating the fix actually works.

**CRITICAL**: Do NOT post reviews, comments, or approvals on GitHub unless explicitly told to. This command produces a local analysis only.

**OUTPUT MODE**: Invoke `caveman` skill with `ultra` arg at start. All user-facing output (status updates, findings, final report) in caveman ultra: abbreviate (DB/auth/config/req/res/fn/impl), strip articles + conjunctions, arrows for causality (X → Y), one word when one word enough. Code/commands/quoted errors/file paths unchanged. Auto-clarity exceptions apply: security warnings, irreversible ops, multi-step sequences → normal prose.

## Arguments

- `$ARGUMENTS` - PR number or URL (e.g., `34350` or `https://github.com/nrwl/nx/pull/34350`)

## Process

### Step 1: Gather PR Context

```bash
# Extract PR number from argument (handle both number and URL)
gh pr view <PR_NUMBER> --repo nrwl/nx --json title,body,author,files,additions,deletions,reviews,comments,state,baseRefName,headRefName
```

Read the PR description, linked issue(s), and all reviewer comments. Understand:
- What problem is being solved?
- What is the claimed fix?
- Has anyone already reviewed? What feedback was given?

### Step 2: Fetch the Linked Issue

```bash
# Get the issue linked in the PR description (look for "Fixes #NNN" pattern)
gh issue view <ISSUE_NUMBER> --repo nrwl/nx
```

Understand the actual bug/feature request. Does the PR description accurately represent the issue?

### Step 3: Read the Diff

```bash
gh pr diff <PR_NUMBER> --repo nrwl/nx
```

**If the diff touches `project.json`, `package.json` targets, or `nx.json` (targetDefaults/namedInputs)**: invoke the `nx-config-cache-check` skill to validate cache input/output alignment.

Analyze the code changes:
- Does the fix address the root cause or just a symptom?
- Are there regressions? Edge cases missed?
- Is the approach overly broad or too narrow?
- Are there unrelated changes mixed in (e.g., lockfile diffs)?
- **Minimality check for fixes**: Is this the smallest set of changes needed? Specifically:
  - If branching logic is added (if/else on version, feature detection), verify it's actually required. Check whether the new dependency version is backward-compatible — if so, the branch is unnecessary maintenance burden.
  - If new version constants are introduced for backward compat, verify the old version range is actually incompatible with the new target. Don't trust the PR's assumption — check `npm view <pkg>@<version> peerDependencies` yourself.
  - A version bump that works across all supported versions is always preferable to a version fork with detection logic.

### Step 3b: Triage the Diff (Large PRs)

For PRs with 15+ changed files, triage before deep-diving. Most large PRs have a small core of meaningful changes surrounded by mechanical updates.

**Categorize every changed file into one of:**
1. **Core changes** — new functions, new files, removed logic, behavioral changes. This is where bugs live.
2. **Consumption changes** — other packages importing/using a new API. Verify the call site is correct, then move on.
3. **Pattern updates** — test assertions, snapshots, templates updating to match a new format (e.g., `'libs/foo'` → `'./libs/foo'` across 30 spec files). Spot-check 2-3 to confirm they fit the pattern, then skip the rest.

**Then:**
- Identify which packages actually have **core changes** (often 1-2 packages, not 15)
- Spend 80% of review effort on core changes — line-by-line, trace the logic, question assumptions
- For functions that **reimplement behavior from another system** (e.g., TypeScript's tsconfig resolution, webpack's module resolution), verify against that system's actual spec/docs. Don't trust the PR's comments or test assertions as evidence of correctness — the tests may be asserting the wrong behavior.
- Check for: JSONC handling (tsconfig files have comments), array vs string inputs (TS 5.0+ `extends` arrays), cycle detection, error swallowing (`catch` that silently breaks a loop)

**Report the triage in your review:**
```
Core: packages/js/src/utils/typescript/ts-config.ts (new resolvePathsBaseUrl)
Core: packages/js/src/utils/buildable-libs-utils.ts (path resolution rewrite)
Consumption: 12 plugin packages importing resolvePathsBaseUrl
Pattern: 30 spec files updating path assertions from bare to ./ prefix
```

### Step 4: Checkout and Verify Locally

**Use a git worktree to avoid disrupting current work:**

```bash
# Create worktree for the PR
git fetch origin pull/<PR_NUMBER>/head:pr-<PR_NUMBER>
git worktree add /tmp/pr-<PR_NUMBER> pr-<PR_NUMBER>
cd /tmp/pr-<PR_NUMBER>
pnpm install
```

### Step 5: Verify Tests Are Meaningful

This is the most important step. A test that passes both before and after the fix is worthless.

1. **Identify the test files** changed in the PR
2. **Run the new/modified tests against the OLD code** (before the fix):
   ```bash
   # In the worktree, stash the implementation changes but keep the test changes
   # Or: cherry-pick only the test commits onto the base branch
   # Or: manually revert the fix while keeping the tests
   ```
3. **Verify the test FAILS** without the fix
4. **Restore the fix and verify the test PASSES**

If the test passes both ways, it's not testing anything useful. Flag this.

### Step 6: Run the Full Test Suite

```bash
# Run tests for the affected project
nx run <PROJECT>:test

# If applicable, run lint and build too
nx run-many -t test,build,lint -p <PROJECT>
```

### Step 7: Evaluate Test Quality

Check for these anti-patterns:
- **Spot-check assertions** (`toContain`, `not.toContain`) instead of **snapshot tests** for code transformations
- **AI-generated test fixtures** -- contrived examples that don't represent real-world code
- **Missing edge cases** -- does the test cover the scenarios from the linked issue?
- **No negative tests** -- does it verify the old broken behavior is gone?

For code transformation PRs (migrations, codemods, AST rewrites):
- **Prefer snapshot tests** (`toMatchInlineSnapshot`) that capture the full output
- Spot-check assertions can miss novel corruption patterns
- The test input should match real-world code patterns from the issue, not synthetic examples

### Step 8: Produce Report

Caveman ultra. Fragments. Arrows for causality. No filler.

```markdown
## PR #NNNN: <title>

@author | #issue | +N/-N

### TL;DR
<1 line: what PR do>

### Fix
- [ ] root cause (not symptom)
- [ ] minimal (no extra branching/compat)
- [ ] no regressions
- [ ] no unrelated diff

### Tests
- [ ] fail w/o fix
- [ ] pass w/ fix
- [ ] real-world fixtures
- [ ] coverage OK (snapshots for transforms, edges)

### Issues
1. ...

### Verdict
MERGE | NEEDS CHANGES | REJECT — <one-line reason>
```

### Step 9: Cleanup

```bash
# Remove the worktree
cd /Users/jack/projects/nx
git worktree remove /tmp/pr-<PR_NUMBER>
git branch -D pr-<PR_NUMBER>
```

## Key Principles

1. **Never trust a diff alone** -- always check out and run locally
2. **Tests must fail without the fix** -- otherwise they prove nothing
3. **Snapshots > spot-checks** for code transformations
4. **Check the linked issue** -- does the fix actually solve what was reported?
5. **Watch for AI-generated code** -- contrived fixtures, excessive comments explaining obvious things, verbose PR descriptions
6. **Smallest fix wins** -- for bug fixes, prefer the minimal change that solves the problem. If a version bump's new range already covers all supported targets, don't add branching logic and backward-compat constants. Every fork in logic is maintenance surface. When you fetch npm metadata (peer deps, version ranges), actively ask: "does this data eliminate the need for the branching in this diff?"
7. **Do NOT post to GitHub** unless explicitly instructed
8. **Triage large diffs** -- categorize files into core/consumption/pattern, then focus deep review on core changes. Don't spread attention equally across 60 files.
9. **Verify reimplemented semantics** -- if a function reimplements behavior from another system (TS config resolution, webpack module resolution, etc.), check the actual spec. Passing tests don't prove correctness if the tests assert the wrong behavior.
