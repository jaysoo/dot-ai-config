# Nx Easy Issues - Stale Issues (6+ months old)

## Summary
- Total stale issues: 77
- These are issues older than 6 months with low engagement
- Many likely already fixed in newer versions of Nx

## Top 10 Stale Issues

### 1. #29373: Nx 19.8.8+ Angular MFE - lazy loaded modules in libs cause @nx/angular/mf to be loaded multiple times
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/29373
- **Age**: 6+ months
- **Engagement**: Low (0 reactions, 2 comments)

### 2. #29307: Dependency-Checks ESLint Rule Fails for TypeScript Composite Projects in Nx 20.2.2
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/29307
- **Age**: 6+ months
- **Engagement**: Low (0 reactions, 1 comment)

### 3. #28832: Packages could not be mapped to the NPM lockfile
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/28832
- **Age**: 6+ months
- **Engagement**: Low

### 4. #28395: [Mac]: Failed to process project graph. Run "nx reset" to fix this
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/28395
- **Age**: 6+ months
- **Engagement**: Low

### 5. #26675: `nx migrate --run-migrations` installs deps with `legacy-peer-deps=true`
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/26675
- **Age**: 6+ months
- **Engagement**: Low

### 6. #26661: Agent Nx Tasks not using working-directory (GitHub Actions)
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/26661
- **Age**: 6+ months
- **Engagement**: Low

### 7. #26604: GeneratePackageJson missing package
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/26604
- **Age**: 6+ months
- **Engagement**: Low

### 8. #29283: `nx release` not respecting `implicitDependencies` when running `updateDependents`
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/29283
- **Age**: 6+ months
- **Engagement**: Low

### 9. #29146: Migration command fails (nx migrate --run-migrations=migrations.json)
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/29146
- **Age**: 6+ months
- **Engagement**: Low

### 10. #29131: @nx/expo:install fails if Expo module outputs any post-installation instructions
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/29131
- **Age**: 6+ months
- **Engagement**: Low

## Recommended Bulk Closure Script

```bash
# Get all stale issue numbers from the analysis
STALE_ISSUES=$(jq -r '.themes.stale | .[] | .number' /tmp/easy-issues-analysis.json | head -20 | tr '\n' ' ')

# Close stale issues with a helpful message
gh issue close -R nrwl/nx $STALE_ISSUES \
  -c "Closing this issue due to inactivity (6+ months). Many improvements have been made to Nx since this issue was opened. Please try with the latest version of Nx and reopen if the issue persists. 

To update to the latest Nx version:
\`\`\`bash
npx nx migrate latest
npx nx migrate --run-migrations
\`\`\`

If you're still experiencing this issue with the latest version, please feel free to reopen with updated reproduction steps."
```

## Additional Actions

1. **Verify Fixed Issues**: Many of these stale issues may already be fixed in newer versions
2. **Batch Processing**: Close in batches of 20-30 to avoid overwhelming notifications
3. **Monitor Reopens**: Track if any get reopened to identify still-relevant issues