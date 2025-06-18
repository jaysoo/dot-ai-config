# Nx Easy Issues - Stale Theme

Generated: 2025-06-17T22:07:11.252Z
Total issues in this theme: 3

## Summary

This report contains GitHub issues that are suitable for automated fixes or closure based on the "stale" theme.

## Issues

### 1. Issue #27849: @nx/eslint:lint-project create a fresh graph at every run

- **URL**: https://github.com/nrwl/nx/issues/27849
- **Score**: 10
- **Created**: 2024-09-10
- **Author**: beaussan
- **Labels**: type: bug, scope: linter
- **Reasons**: Has reproduction repository, Has VERIFIED workaround, User provided code fix, Simple configuration fix, Older than 6 months, Low engagement (1 reactions, 2 comments), Configuration/setup issue, Requires native module compilation
- **Suggested Actions**: Review for automated fix of linked repro, Implement verified workaround as fix, Review and implement user-provided fix, Apply configuration fix, Close as stale, Review for configuration fix

### 2. Issue #29373: Nx 19.8.8+ Angular MFE - lazy loaded modules in libs cause @nx/angular/mf to be loaded multiple times

- **URL**: https://github.com/nrwl/nx/issues/29373
- **Score**: 9
- **Created**: 2024-12-16
- **Author**: gkamperis
- **Labels**: type: bug, stale
- **Reasons**: Has reproduction repository, Has workaround posted, Dependency update related, Older than 6 months, Low engagement (0 reactions, 2 comments), Configuration/setup issue
- **Suggested Actions**: Review for automated fix of linked repro, Close with workaround comment, Generate PR for dependency update, Close as stale, Review for configuration fix

### 3. Issue #28674: Creating a `dotnetproject.json` node with an inferred plugin does not work with linting

- **URL**: https://github.com/nrwl/nx/issues/28674
- **Score**: 9
- **Created**: 2024-10-29
- **Author**: HaasStefan
- **Labels**: type: bug, scope: linter
- **Reasons**: Has reproduction repository, Simple configuration fix, Older than 6 months, Low engagement (0 reactions, 3 comments), Configuration/setup issue
- **Suggested Actions**: Review for automated fix of linked repro, Apply configuration fix, Close as stale, Review for configuration fix


## Batch Action Suggestions

### Close stale issues in batch:

```bash
gh issue close -R nrwl/nx 27849 29373 28674 \
  -c "Closing due to inactivity (6+ months). Please reopen if the issue persists with the latest version of Nx."
```
