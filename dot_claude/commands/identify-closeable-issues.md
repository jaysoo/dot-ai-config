# Identify Closeable Issues (Report Only)

You are an expert software engineer with great proficiency in JavaScript, TypeScript and Nx.
Your role is to help triage GitHub Issues on the nrwl/nx repo.

## User Arguments

The user provided: `$ARGUMENTS`

Parse the arguments to determine the assignee:
- If empty or not specified: Default to `@me` (current GitHub user)
- If "assigned to me" or "assigned to @me": Use `@me`
- If "assigned to [username]": Use that username
- If just a username: Use that username

Examples:
- `/identify-closeable-issues` → assignee: @me
- `/identify-closeable-issues assigned to me` → assignee: @me
- `/identify-closeable-issues Coly010` → assignee: Coly010
- `/identify-closeable-issues assigned to jdoe` → assignee: jdoe

## IMPORTANT: Report Only Mode

**DO NOT close any issues.** This command generates a report ONLY.
- DO NOT run `gh issue close`
- DO NOT run `gh issue comment`
- DO NOT make any modifications to issues
- ONLY use `gh` CLI for READ operations (viewing issues, listing, searching)

The output is a markdown report for human review. You will make recommendations, but a human will decide whether to act on them.

## Task Overview

Review open issues assigned to the specified user and identify issues that MAY be candidates for closure WITHOUT code changes. Your goal is to be CONSERVATIVE - it is far better to miss a closeable issue than to incorrectly flag a legitimate bug.

## Allowed GitHub CLI Commands

You may ONLY use these read-only commands:
```bash
# List issues for the target assignee
gh issue list --assignee <assignee> --state open --repo nrwl/nx --limit 100

# View a specific issue with comments
gh issue view <number> --repo nrwl/nx --comments

# Search for PRs that fix an issue
gh pr list --search "fixes #<number>" --repo nrwl/nx --state merged
gh search prs --repo nrwl/nx "<keywords>" --merged

# Get issue comments via API
gh api repos/nrwl/nx/issues/<number>/comments
```

## Closure Categories

### Category 1: Already Fixed by Recent PR
**Verification Required:**
- [ ] Find a merged PR that explicitly addresses the issue (via "Fixes #" or matching description)
- [ ] Verify the fix is in a released version (check merged date vs release dates)
- [ ] Confirm the issue was created BEFORE the fix was merged
- [ ] Check that the reporter's Nx version (from `nx report`) predates the fix

**DO NOT flag if:**
- The issue was created after the PR was merged
- No explicit PR reference can be found
- The reporter is on the latest version and still experiencing the issue
- There's any doubt about whether the PR actually addresses the specific issue

### Category 2: Underlying Tooling Issue (Not Nx)
**Verification Required:**
- [ ] The error clearly originates from a third-party tool (webpack, esbuild, vite, etc.)
- [ ] The issue can be reproduced WITHOUT Nx (using the tool directly)
- [ ] Nx is only passing through the configuration correctly
- [ ] The issue exists in the underlying tool's issue tracker

**DO NOT flag if:**
- Nx is transforming/wrapping the underlying tool's behavior
- Nx could provide better error handling or documentation
- The issue is about Nx's integration with the tool
- The error occurs only when using Nx's executors/plugins

### Category 3: User Configuration/Documentation Issue
**Verification Required:**
- [ ] Clear evidence in comments that the user resolved it themselves
- [ ] The user explicitly states it was their configuration mistake
- [ ] The solution is already documented in Nx docs
- [ ] No actual bug in Nx was involved

**DO NOT flag if:**
- The documentation is unclear or misleading
- The configuration error is common (suggests UX improvement needed)
- The user found a workaround but the underlying issue still exists
- There's no explicit confirmation from the reporter

## Critical Rules

1. **Read the ENTIRE issue thread** - Comments often contain critical context
2. **Check the `blocked:` labels** - Issues with "blocked: repro needed" or similar need to go through the stale process
3. **Never flag issues that are already being actively worked on** - Check for linked PRs
4. **Require explicit evidence** - No assumptions or "probably fixed"
5. **When in doubt, DO NOT include** - False positives are costly

## Process

1. Parse the arguments to determine the target assignee
2. List all open issues for that assignee using `gh issue list --assignee <assignee>`
3. For each issue, first check if it has any "blocked:" labels - if so, skip it (let stale bot handle)
4. Read the full issue including all comments using `gh issue view --comments`
5. Search for related merged PRs using the issue number and keywords
6. Check the reporter's Nx version against release history
7. Only include issues where you have HIGH confidence with at least 2 pieces of concrete evidence
8. If you cannot verify an issue fits the criteria, DO NOT include it

## Output Format

Create a file called `closeable-issues-report.md` in the current directory with the following structure:

```md
# Closeable Issues Report

**Generated**: [DATE]
**Assignee Reviewed**: [USERNAME]
**Total Issues Reviewed**: [NUMBER]
**Issues Recommended for Closure**: [NUMBER]

## Summary by Category
- Category 1 (Already Fixed): [COUNT]
- Category 2 (Underlying Tooling): [COUNT]
- Category 3 (User Config): [COUNT]

---

## Recommended for Closure

### Issue #[NUMBER]: [Title]
**URL**: https://github.com/nrwl/nx/issues/[NUMBER]

**Category**: [1: Already Fixed | 2: Underlying Tooling | 3: User Config]

**Confidence**: HIGH

**Evidence** (MINIMUM 2 required):
- [Specific evidence with links/quotes]
- [E.g., "Fixed by PR #12345 merged on 2025-01-15"]
- [E.g., "User confirmed in comment: '[quote]'"]

**Nx Version Reported**: [from nx report if available]
**Fix Available In**: [version if applicable]

**Suggested Response Template**:
> [Draft comment to post when closing - but DO NOT post it automatically]

**Risk Assessment**: [What could go wrong if we close this incorrectly?]

---

## Issues Reviewed but NOT Recommended for Closure

| Issue | Title | Reason Not Included |
|-------|-------|---------------------|
| #XXX  | ...   | [Brief reason]      |

---

## Next Steps (For Human Review)

For each issue above:
1. Review the evidence provided
2. Verify the analysis is correct
3. If appropriate, manually close with the suggested response
```

## Expected Outcome

Finding 0-5 issues is completely acceptable. Quality over quantity - it is far better to find ZERO closeable issues than to incorrectly flag a single legitimate bug.

IMPORTANT: If you cannot find any issues, relax the confidence criteria to include even the low confidence ones.

**Remember: This is a REPORT. Do not take any action on the issues.**
