# Deep PR Review

Thoroughly review a GitHub PR by checking out the branch locally, verifying tests, and validating the fix actually works.

**CRITICAL**: Do NOT post reviews, comments, or approvals on GitHub unless explicitly told to. This command produces a local analysis only.

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

Analyze the code changes:
- Does the fix address the root cause or just a symptom?
- Are there regressions? Edge cases missed?
- Is the approach overly broad or too narrow?
- Are there unrelated changes mixed in (e.g., lockfile diffs)?

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

Output a structured analysis:

```markdown
## PR #NNNN Review: <title>

**Author**: @username | **Issue**: #NNNN | **LOC**: +N/-N

### Summary
<1-2 sentence summary of what the PR does>

### Fix Assessment
- [ ] Addresses root cause (not just symptom)
- [ ] No regressions identified
- [ ] No unrelated changes mixed in

### Test Assessment
- [ ] New tests fail without the fix
- [ ] New tests pass with the fix
- [ ] Test fixtures represent real-world patterns
- [ ] Adequate coverage (snapshots for transforms, edge cases)

### Issues Found
<numbered list of problems, if any>

### Verdict
MERGE / NEEDS CHANGES / REJECT

<explanation>
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
6. **Do NOT post to GitHub** unless explicitly instructed
