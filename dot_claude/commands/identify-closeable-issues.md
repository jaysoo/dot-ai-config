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

Review open issues assigned to the specified user and identify issues that MAY be candidates for closure WITHOUT code changes. Your goal is to be THOROUGH while maintaining a 75%+ confidence threshold. Use the confidence scoring system to transparently communicate your certainty level for each recommendation.

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
- [ ] Find a merged PR that explicitly addresses the issue (via "Fixes #" OR matching description/component)
- [ ] Verify the fix is in a released version (check merged date vs release dates)
- [ ] Confirm the issue was created BEFORE the fix was merged
- [ ] Check that the reporter's Nx version (from `nx report`) predates the fix

**Also acceptable:**
- PRs that clearly address the same component/symptoms even without explicit "Fixes #" linking
- Pattern-matched PRs where the fix description matches the issue's problem area

**DO NOT flag if:**
- The issue was created after the PR was merged
- The reporter is on the latest version and still experiencing the issue
- There are comments after the PR merge indicating the issue persists

### Category 2: Underlying Tooling / Version Compatibility Issue
**Verification Required:**
- [ ] The error clearly originates from a third-party tool (webpack, esbuild, vite, TypeScript, etc.)
- [ ] Nx is only passing through the configuration correctly
- [ ] The issue exists in the underlying tool's issue tracker OR is a known version compatibility issue

**Also covers version compatibility issues:**
- TypeScript version incompatibilities (e.g., TS4 vs TS5 breaking changes)
- Node.js version requirements
- Package manager version conflicts
- Dependency version mismatches that are outside Nx's control

**Resolution path:**
- User needs to update/downgrade the underlying tool
- User needs to align dependency versions

**DO NOT flag if:**
- Nx is transforming/wrapping the underlying tool's behavior in a way that causes the issue
- Nx could provide better error handling, documentation, or version warnings
- The issue is about Nx's integration with the tool
- The error occurs only when using Nx's executors/plugins

### Category 3: User Configuration/Documentation Issue
**Verification Required:**
- [ ] Clear evidence in comments that the user resolved it themselves
- [ ] The root cause is clearly identified as user environment/configuration (explicit admission not required)
- [ ] The solution is already documented in Nx docs OR is a standard configuration issue
- [ ] No actual bug in Nx was involved

**DO NOT flag if:**
- The documentation is unclear or misleading
- The configuration error is common (suggests UX improvement needed)
- The user found a workaround but the underlying issue still exists
- The root cause is ambiguous or could still be an Nx bug

### Category 4: Likely Fixed by Related PR
**Description**: A PR's description or changes suggest the reported problem has been addressed, even without explicit "Fixes #" linking. Use flexible matching - if a PR reasonably addresses the reported problem area, include it.

**Verification Required:**
- [ ] A merged PR addresses the same component/feature mentioned in the issue
- [ ] The PR description mentions fixing similar symptoms or the same area of code
- [ ] The PR was merged AFTER the issue was created
- [ ] No follow-up comments indicate the issue persists after the PR

**Matching Approach (flexible):**
- Use judgment to determine if a PR reasonably addresses the issue
- Match on component/feature area (e.g., "eslint generator" issue + "eslint generator fix" PR)
- Semantic similarity is acceptable - don't require exact keyword matches
- Consider the problem symptoms, not just the specific error message

**DO NOT flag if:**
- The PR was merged before the issue was created
- There are comments after the PR indicating the issue still exists
- The PR only partially addresses the problem
- The connection between PR and issue is too tenuous

### Category 5: Workaround Available / Community Resolution
**Description**: A workaround has been identified that solves the user's use case. Community confirmation is sufficient (maintainer comment not required).

**Verification Required:**
- [ ] A working workaround was confirmed by ANY user (reporter, community member, or maintainer)
- [ ] The workaround is documented in the issue thread
- [ ] The workaround actually addresses the reported problem
- [ ] No objections or reports that the workaround doesn't work

**Confidence Adjustment:**
- Maintainer confirmation → 85%+ confidence
- Community/reporter confirmation → 75-84% confidence

**DO NOT flag if:**
- The workaround is complex or unreasonable
- There are objections that the workaround doesn't fully solve the problem
- The workaround only addresses symptoms, not the root cause, and users want the root cause fixed

## Confidence Scoring System

Use a percentage-based confidence score for each issue. Only include issues with **75%+ confidence** in the "Recommended for Closure" section.

### Confidence Levels
- **HIGH (85-100%)**: 2+ strong pieces of evidence, explicit confirmation from user/maintainer
- **MEDIUM (75-84%)**: 1 strong + 1 supporting piece of evidence, or clear pattern match
- **LOW (<75%)**: Not included in recommendations, but listed in "Reviewed but NOT Recommended" section

### Calculating Confidence Score

**Strong Evidence (+25-35% each):**
- Explicit "Fixes #" PR reference (+35%)
- User explicitly confirmed the issue is resolved (+30%)
- Maintainer stated the issue can be closed (+35%)
- PR clearly addresses the exact component AND symptoms (+25%)

**Supporting Evidence (+10-20% each):**
- PR addresses same component/feature area (+15%)
- User found a workaround that solves their use case (+15%)
- Root cause identified as user configuration (+20%)
- Version compatibility issue with clear resolution path (+15%)
- Community member confirmed workaround works (+10%)

**Risk Factors (-5-15% each):**
- Issue created recently (less than 2 weeks old) (-10%)
- No response from original reporter (-5%)
- Complex issue with multiple symptoms (-10%)
- Ambiguity about whether PR fully addresses issue (-15%)

**Base Confidence:** Start at 50% and add/subtract based on evidence.

## Critical Rules

1. **Read the ENTIRE issue thread** - Comments often contain critical context
2. **Check the `blocked:` labels** - Issues with "blocked: repro needed" or similar need to go through the stale process
3. **Never flag issues that are already being actively worked on** - Check for linked PRs
4. **Provide evidence for your confidence score** - Show the calculation
5. **75% threshold** - Only include issues at or above 75% confidence in recommendations

## Process

1. Parse the arguments to determine the target assignee
2. List all open issues for that assignee using `gh issue list --assignee <assignee>`
3. For each issue, first check if it has any "blocked:" labels - if so, skip it (let stale bot handle)
4. Read the full issue including all comments using `gh issue view --comments`
5. Search for related merged PRs using the issue number AND keywords from the issue description
6. Check the reporter's Nx version against release history
7. Calculate confidence score for each issue using the scoring system above
8. Include issues with 75%+ confidence in "Recommended for Closure"
9. List all reviewed issues with <75% confidence in "Reviewed but NOT Recommended"

## Output Format

Create a file called `closeable-issues-report.md` in the current directory with the following structure:

```md
# Closeable Issues Report

**Generated**: [DATE]
**Assignee Reviewed**: [USERNAME]
**Total Issues Reviewed**: [NUMBER]
**Issues Recommended for Closure**: [NUMBER] (75%+ confidence)

## Summary by Category
- Category 1 (Already Fixed): [COUNT]
- Category 2 (Underlying Tooling/Version): [COUNT]
- Category 3 (User Config): [COUNT]
- Category 4 (Likely Fixed by Related PR): [COUNT]
- Category 5 (Workaround Available): [COUNT]

## Confidence Distribution
- HIGH (85-100%): [COUNT] issues
- MEDIUM (75-84%): [COUNT] issues
- Below threshold (<75%): [COUNT] issues

---

## Recommended for Closure (75%+ Confidence)

### Issue #[NUMBER]: [Title]
**URL**: https://github.com/nrwl/nx/issues/[NUMBER]

**Category**: [1-5]

**Confidence Score**: [XX]%
**Confidence Breakdown**:
- Base: 50%
- [+XX%] [Evidence description, e.g., "PR #12345 addresses same component"]
- [+XX%] [Evidence description, e.g., "User confirmed workaround works"]
- [-XX%] [Risk factor, e.g., "No response from original reporter"]
- **Total**: [XX]%

**Evidence**:
- [Specific evidence with links/quotes]
- [E.g., "PR #12345 description: 'Fixed eslint generator...'"]
- [E.g., "User @example commented: '[quote]'"]

**Nx Version Reported**: [from nx report if available]
**Fix Available In**: [version if applicable]

**Suggested Response Template**:
> [Draft comment to post when closing - but DO NOT post it automatically]

**Risk Assessment**: [What could go wrong if we close this incorrectly?]

---

## Issues Reviewed but NOT Recommended for Closure

| Issue | Title | Confidence | Reason Not Included |
|-------|-------|------------|---------------------|
| #XXX  | ...   | [XX]%      | [Brief reason]      |

---

## Next Steps (For Human Review)

For each issue above:
1. Review the evidence and confidence breakdown
2. Verify the analysis is correct
3. Pay extra attention to MEDIUM confidence (75-84%) issues
4. If appropriate, manually close with the suggested response

**Note**: A 75% threshold means ~1 in 4 recommendations may be incorrect. Human review is essential.
```

## Expected Outcome

With the 75% confidence threshold, expect to find more potential closeable issues than with stricter criteria. A typical outcome might be:
- 5-15 issues reviewed
- 2-8 issues recommended for closure (75%+ confidence)
- Remaining issues listed as "not recommended" with explanations

**Important Notes:**
- The 75% threshold is a balance between catching more closeable issues and maintaining accuracy
- Expect approximately 1 in 4 recommendations at the threshold to potentially be incorrect - this is acceptable because human review is required
- HIGH confidence (85%+) recommendations are more reliable than MEDIUM (75-84%)
- When in doubt about borderline cases, include them with honest confidence scores - let the human reviewer decide

**Remember: This is a REPORT. Do not take any action on the issues.**

