# Nx Easy Issues Analysis Summary

Generated: 2025-06-20
Analysis Period: 2024-06-20 to 2025-06-20

## Overview

Analyzed 539 open issues from the Nx repository and identified **50 issues** that are candidates for easy resolution based on our scoring criteria.

## Distribution by Theme

| Theme | Count | Percentage |
|-------|-------|------------|
| Documentation | 34 | 68% |
| Workaround Available | 5 | 10% |
| Stale Issues | 3 | 6% |
| Configuration | 3 | 6% |
| Reproduction Available | 3 | 6% |
| Dependencies | 2 | 4% |

## Top 10 Easiest Issues to Resolve

1. **#29143: `passWithNoTests` ineffective** (Score: 13)
   - No documentation changes needed
   - Has reproduction: https://github.com/jestjs/jest/issues/8896
   - Should verify the bug still exists (it probably does since someone mentioned still seeing it in April 2025)
   - https://github.com/nrwl/nx/issues/29143
   - This is specifically with non-inferred projects (i.e. use NX_ADD_PLUGINS=false when create-nx-workspace; don't use plugins in nx.json; use project.json)

MY NOTES: This was marked as documentation needed, but that's not true. It's an actual bug if we can still reproduce it.

2. **#30589: Unexpected Behavior in `@nx/dependency-check`** (Score: 11)
   - Has verified workaround ready to implement
   - https://github.com/nrwl/nx/issues/30589


MY NOTES: There were no workarounds provided, but another user had clarified that this is intended behavior and would be hard to support what the author suggested. I closed it as nothing needs to be done.

3. **#30163: Missing basic nx release/publish documentation** (Score: 11)
   - Pure documentation issue with clear requirements
   - https://github.com/nrwl/nx/issues/30163

MY NOTES: This one is legit, and we should actually add something into raw-docs for release/versioning. Skip the changes for now unless it's simple few lines of changes in EXISTING docs.

4. **#26651: CommitReferences are not included in all Changelogs** (Score: 11)
   - Has reproduction, config fix needed
   - https://github.com/nrwl/nx/issues/26651

MY NOTES: This one is related to Nx Release, and it's not clear if it's a bug or just intended behavior. From what I understand, `nx release` without programmatic API usage has lots of limitations, so I imagine that per-project CHANGELOG.md is not handled out of the box. User probably needs to use the programmatic API to achieve this, and I'm not sure how that works. Need to read our existing docs, and I know there are gaps there, which is likely why users are confused. We need a raw docs to cover this.

5. **#27849: @nx/eslint:lint-project create a fresh graph** (Score: 10)
   - User provided code fix, just needs review
   - https://github.com/nrwl/nx/issues/27849

MY NOTES: This one is not easy since it involved graph calculation slowness. Generally we should add logging around WHERE in the eslint plugin (e.g. packages/eslint/src/plugins/plugin.ts) the slowness comes from -- like just console.log. Then create a new project, and run with NX_DAEMON=false and NX_PROJECT_GRAPH_CACHE=false (and also `rm -rf .nx/workspace-data`) to get the full timing logged to terminal. From the timing log we'll know where the slowness is, then look at the code and figure out how to fix it. This is a CATEGORY of issues that we need to prioritize as HIGH, and have a usualy plan around how to tackle it. Please help suggest ways we can add hints to YOU/AI to fix this!

6. **#31572: Issue with running create nx workspace@latest** (Score: 9)
   - Looks like maybe a special case with the create-nx-workspace using `.` as directory
   - Could also be specific to the Nest preset?
   - https://github.com/nrwl/nx/issues/31572

MY NOTES: This is a good issue for AI/YOU to validate whether the problem is with `.` directory or nest preset. The actual fix might be hard because the logs are swallowed during create-nx-workspace, but it's possible that by analyzing the code YOU can figure it out. The CRITICAL part is that we should be creatring the smallest breaking example, so try to narrow the bug down to specific options, presets, etc. that reproduces the error. It would be helpful in the future to run through tests to confirm combinations of different dimensions will present the bug -- If it is every combination then it could be a P0 bug!@

7. **#31037: Next.js documentation needs to be revisited** (Score: 9)
   - Clear documentation update request
   - This sentence `After running a build, the output will be in the {workspaceRoot}/dist/{projectRoot} folder` is wrong like author said. It must be `{projectRoot}/dist` folder, or whereever the project's output directory is configured (see below).
   - There should be no mentions of `vite.config.ts` this is a MISTAKE, it must be `next.config.js` and we should show the correct content on how to configure output relative to project root.
   - The second tab for `Using the @nx/next:build executor` should specify that this is legacy behavior when not using `@nx/next/plugin` in `nx.json`. You cannot configure your Next.js projects this way if you are using the next plugin --- link to the inferred tasks doc page.
   - https://github.com/nrwl/nx/issues/31037

MY NOTES: This is a perfect AI task for YOU! Great job. You may just need some more context around inferred projects (e.g. usign `@nx/next/plugin` or other inference plugins), and the legacy executor configuration model.

8. **#30649: Meaning of "*" version in project package.json** (Score: 9)
   - Documentation clarification needed
   - https://github.com/nrwl/nx/issues/30649

MY NOTES: Honestly, I'm not sure how I would handle this. The closest page to write this info is https://nx.dev/concepts/decisions/dependency-management, but I'm not convinced we should add it because it is just package manager behavior, not Nx-specific. For confusion on behavior and documentation requests like this, I would collect all of them in a `.ai/DOCUMENTATION_REQUESTS.md` with a link to issue and a small summary, so we can look through them later.

9. **#30199: React Monorepo tutorial needs update** (Score: 9)
   - Tutorial update for ESLint config format
   - https://github.com/nrwl/nx/issues/30199

MY NOTES: This is perfect for AI/YOU to work on. The file is just outdated. What I would do is follow the tutorial, and then see what the files are and match them on the tutorial docs for react-monorepo.

10. **#29508: Angular Library Generator not working** (Score: 9)
    - Has verified workaround, needs implementation
    - https://github.com/nrwl/nx/issues/29508

MY NOTES: This is a perfect AI task for YOU! Great job. The action item is very clear from the last comment from `leosvelperez`. I think it would be useful to keep a list of known Nx core contributors in `CLAUDE.md` so you can rank those comments higher. CRITICAL: implement what was suggested: `I'll send a PR soon to deprecate the simpleName option and clarify that the exact name should be provided instead`.
 
## Recommended Actions

MY NOTES: This whole section is mostly useless. Most issues should be done in isolation, with some documentation requests we're unsure about going into `.ai/DOCUMENTATION_REQUESTS.md` like I mentioned above. I would skip this whole section and make sure the notes in the previous section has the suggested actions.

### Immediate Actions (High Impact, Low Effort)

1. **Documentation Sprint**: 34 documentation issues could be resolved in a focused effort
   - Most are clarifications or updates to existing docs
   - Several have clear requirements specified

2. **Implement Verified Workarounds**: 5 issues have community-verified fixes
   - These can be quickly turned into PRs
   - Community has already validated the solutions

3. **Close Stale Issues**: 3 issues are candidates for closure
   - Over 6 months old with low engagement
   - May no longer be relevant

### Batch Processing Opportunities

1. **Documentation Updates**: Group similar docs issues into single PRs
2. **Configuration Fixes**: Several issues relate to nx.json or project.json configs
3. **Tutorial Updates**: Multiple tutorial issues could be addressed together

## Key Insights

MY NOTES: THis key insights section is good. There hsould also be notes if verified workarounds are coming from Nx core contributors, or if any issues have comments from core contributors -- maybe mention if most issues have no comments from core contributors, which will let us know how on top of issues we are. Also consider if a core contributor suggests a fix is easy/imminent, or a pull request is coming, but it's been weeks/months since that comment.

1. **68% are documentation issues** - This represents a significant opportunity for quick wins
2. **Multiple issues have user-provided fixes** - These just need review and implementation
3. **Low engagement on many issues** - Suggests they may not be critical or already resolved
4. **Several verified workarounds** - Community has already done the testing

## Next Steps

1. Review the themed markdown files for detailed issue lists:
   - `.ai/2025-06-20/tasks/nx-easy-issues-documentation.md`
   - `.ai/2025-06-20/tasks/nx-easy-issues-workaround.md`
   - `.ai/2025-06-20/tasks/nx-easy-issues-stale.md`

2. Consider creating automated PRs for the highest-scoring issues

3. Batch similar issues together for efficient resolution

4. Use the provided GitHub CLI commands to close stale issues with appropriate messages
