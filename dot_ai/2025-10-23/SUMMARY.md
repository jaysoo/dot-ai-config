# Summary - October 23, 2025

## Nx.dev Website Update (website-22 branch)

**Goal**: Synchronize documentation updates from `master` branch to `website-22` branch to keep production docs current.

**Process**:
1. Fetched latest `master` and `website-22` branches from origin
2. Identified last synced commit (083b97255a - PR #33190)
3. Found 4 documentation commits to cherry-pick from master
4. Successfully cherry-picked all commits in chronological order

**Commits Successfully Applied**:
1. **2402ecb576** - docs(release): update docs to use correct releaseTag object notation (#33202)
   - Updated 7 files with corrected `releaseTag` object structure

2. **7c2f3511e2** - docs(nx-dev): add dedicated guide for nx release programmatic API (#33198)
   - Created new guide: `programmatic-api.mdoc`
   - Updated 2 files, 260 insertions, 61 deletions

3. **ab82c7b1be** - docs(nx-dev): add guides for Release Groups and Update Dependents (#33200)
   - Created 2 new guides: `release-groups.mdoc` and `update-dependents.mdoc`
   - Updated 8 files, 424 insertions, 15 deletions

4. **b3c3e40490** - docs(misc): update nx release documentation for v22 changes (#33189)
   - Updated 7 files with v22-specific changes
   - 237 insertions, 27 deletions

**Impact**: The `website-22` branch now has comprehensive documentation for:
- Nx Release v22 features and changes
- Release Groups configuration and usage
- Update Dependents functionality
- Programmatic API for Nx Release
- Correct releaseTag object notation

**Result**: 100% success rate - all 4 commits cherry-picked without conflicts.

## In Progress

- **DOC-261**: Document Nx Release v22 Missing Changes (from October 22)
  - See TODO.md for full context
