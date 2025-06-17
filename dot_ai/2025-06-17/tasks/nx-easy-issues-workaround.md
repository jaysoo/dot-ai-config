# Nx Easy Issues - Issues with Workarounds

## Summary
- Total issues with workarounds: 23
- These issues have community-provided workarounds that are working
- Good candidates for closure with workaround documentation

## Top 10 Issues with Workarounds

### 1. #30362: `createProjectGraphAsync` no longer contains external nodes when using bun's new text-based lockfile
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/30362
- **Status**: Has working workaround posted

### 2. #29641: `releaseVersion` API doesn't update package versions when the lockfile updates
- **Score**: 9
- **URL**: https://github.com/nrwl/nx/issues/29641
- **Status**: Has working workaround posted

### 3. #30638: [createGlobPatternsForDependencies] Failed to generate glob pattern
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/30638
- **Status**: Has working workaround posted

### 4. #30302: on 20.5.0 bun.lock prevents nextjs build
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/30302
- **Status**: Has working workaround posted

### 5. #30240: PNPM v10 not supported in NX Webpack Plugin
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/30240
- **Status**: Has working workaround posted

### 6. #29772: Generators don't work when using pnpm catalogs
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/29772
- **Status**: Has working workaround posted

### 7. #29556: EPERM Error messages produced when retrying rename of project-graph.json
- **Score**: 8
- **URL**: https://github.com/nrwl/nx/issues/29556
- **Status**: Has working workaround posted

### 8. #31495: `nx:run-commands` does not honor `readyWhen` when only one command configured
- **Score**: 7
- **URL**: https://github.com/nrwl/nx/issues/31495
- **Status**: Has working workaround posted

### 9. #31097: Cannot run tests with Jest Runner in VSCode in new repo
- **Score**: 7
- **URL**: https://github.com/nrwl/nx/issues/31097
- **Status**: Has working workaround posted

### 10. #29616: Nx using `WebPack` does not work correctly (breakpoints & reload on save)
- **Score**: 7
- **URL**: https://github.com/nrwl/nx/issues/29616
- **Status**: Has working workaround posted

## Recommended Closure Script

```bash
# Extract issue numbers with workarounds
WORKAROUND_ISSUES=$(jq -r '.themes.workaround | .[] | .number' /tmp/easy-issues-analysis.json | head -15 | tr '\n' ' ')

# Close with workaround acknowledgment
gh issue close -R nrwl/nx $WORKAROUND_ISSUES \
  -c "Thank you for reporting this issue and for the community members who provided workarounds.

Since a working workaround has been shared and the issue has low engagement, we're closing this to help us focus on higher-priority items. The workaround will remain available for others who encounter this issue.

If this is blocking critical workflows even with the workaround, or if the workaround stops working in newer versions, please feel free to reopen with additional context.

For visibility, we're tracking the need to address these types of issues more systematically in future releases."
```

## Additional Actions

1. **Document Workarounds**: Consider adding common workarounds to official troubleshooting guides
2. **Track Patterns**: Many workarounds relate to package manager compatibility (bun, pnpm v10)
3. **Future Fixes**: Use these as input for improving package manager support