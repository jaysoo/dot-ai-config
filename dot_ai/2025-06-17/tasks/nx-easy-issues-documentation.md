# Nx Easy Documentation Issues

## Documentation Issues (26 total)

### High Priority Documentation Issues

1. **#31111 - Undocumented environment variable on Nx Docs**
   - URL: https://github.com/nrwl/nx/issues/31111
   - Engagement: 4 reactions, 1 comment
   - Action: Add missing environment variable documentation

2. **#31037 - Next.js documentation needs to be revisited**
   - URL: https://github.com/nrwl/nx/issues/31037
   - Engagement: 0 reactions, 0 comments
   - Action: Review and update Next.js docs

3. **#30831 - @nx/angular:webpack-browser has incorrect documentation**
   - URL: https://github.com/nrwl/nx/issues/30831
   - Engagement: 0 reactions, 0 comments
   - Action: Fix indexhtmltransformer documentation

### Low Engagement Documentation Issues (Good for bulk closure)

4. **#30768 - Where to put @nx/plugin**
   - URL: https://github.com/nrwl/nx/issues/30768
   - Engagement: 0 reactions, 0 comments

5. **#30914 - How to use targetDefaults specifically for an inferred task executor**
   - URL: https://github.com/nrwl/nx/issues/30914
   - Engagement: 0 reactions, 0 comments

6. **#30649 - Meaning of "*" version in project package.json**
   - URL: https://github.com/nrwl/nx/issues/30649
   - Engagement: 0 reactions, 0 comments

7. **#31354 - @nx/react/router-plugin typecheck should generate types**
   - URL: https://github.com/nrwl/nx/issues/31354
   - Engagement: 1 reaction, 0 comments

8. **#30614 - @nx/dependency-checks fails on missing dev dependencies**
   - URL: https://github.com/nrwl/nx/issues/30614
   - Engagement: 0 reactions, 0 comments

### Additional Documentation Issues

9. **#31292 - @nx/storybook:configuration with --uiFramework fails** (Has workaround)
10. **#30473 - @nx/enforce-module-boundaries recommends changes that break build**
11. **#31068 - pnpm + rspack + Angular workspace fails on postinstall**
12. **#30595 - How to properly structure a small monorepo**
13. **#30647 - Set version for monorepo based on lerna**
14. **#30859 - Docs request: How to add/remove nx to/from angular project**
15. **#30929 - Docs request: Clear instructions for setting up RN integrated monorepo**
16. **#31163 - "Build Pipeline in Angular" uses obsolete Angular version in example**
17. **#31205 - Docs: Clarify behavior when both local and remote servers are running**
18. **#31309 - Canary Deployment Documentation**
19. **#31409 - Angular library with secondary entry-points project structure**
20. **#30565 - Import external module in generator unit tests**
21. **#30651 - How to utilize MFE with Next.js using page router**
22. **#30763 - List dependencies of single project**
23. **#30778 - Using Eslint with local plugins**
24. **#30784 - Better document on how to add TypeScript support**
25. **#31329 - Documentation: Add guide for Koa + TypeORM setup**
26. **#31515 - Document how to set up webpack rules for binary files**

## Bulk Closure Command for Documentation Issues

```bash
# Close documentation issues with low engagement
gh issue close -R nrwl/nx \
  30768 30914 30649 30614 30595 30647 30859 30929 \
  30565 30651 30763 30778 30784 31329 31515 \
  -c "Closing this documentation issue due to low engagement. If this documentation gap still exists, please feel free to reopen with specific details about what information is missing in the current docs."

# Close outdated documentation issues
gh issue close -R nrwl/nx \
  31163 31205 \
  -c "Closing this documentation issue as it references outdated versions. Please check the latest documentation at https://nx.dev and reopen if the issue persists."

# Documentation issues that need actual fixes (don't close these)
# Keep open: 31111, 31037, 30831, 31354, 31409, 31309
```

## Recommended Actions

1. **Quick Fixes**: Issues #31111, #30831 could be fixed with simple documentation updates
2. **Bulk Close**: Close low-engagement documentation questions that are likely outdated
3. **Review**: Issues with some engagement (#31111) should be reviewed before closing
4. **FAQ Candidates**: Many of these questions could be added to an FAQ section