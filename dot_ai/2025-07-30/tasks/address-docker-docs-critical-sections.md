# Task: Address CRITICAL(AI) Sections in Docker Release Documentation

**Date**: 2025-07-30
**Type**: Documentation Enhancement
**Priority**: High

## Objective
Address three CRITICAL(AI) sections in the Docker release documentation to improve clarity and completeness for users.

## Context
The Docker support in Nx Release is experimental and the documentation has three sections marked with CRITICAL(AI) comments that need attention:
1. Production and Hotfix Releases section - needs examples of customizing config
2. CI/CD Example - needs warning about Nx Cloud Agents limitation
3. Docker Publishing in CI/CD - needs same warning about Nx Cloud Agents

## Steps

### Step 1: Create Directory Structure and Plan File ✓
- [x] Create `.ai/2025-07-30/tasks/` directory
- [x] Write this plan file

### Step 2: Address Production and Hotfix Releases Section
**File**: `docs/shared/recipes/nx-release/release-docker-images.md`
**Location**: Lines 183-190

TODO:
- [ ] Remove the CRITICAL(AI) comment block
- [ ] Add comprehensive examples showing how to customize docker version schemes
- [ ] Show different patterns for production vs hotfix releases
- [ ] Add explanation of available pattern tokens
- [ ] Add cross-reference to nx-json documentation

**Reasoning**: Users need clear examples of how to customize version patterns for different release scenarios. The current documentation mentions customization but doesn't show how to do it.

### Step 3: Add Nx Cloud Agents Warning - First Location
**File**: `docs/shared/recipes/nx-release/release-docker-images.md`
**Location**: Lines 214-222 (CI/CD Example section)

TODO:
- [ ] Remove the CRITICAL(AI) comment block
- [ ] Add a professional warning callout about Docker support limitations
- [ ] Include link to Nx Enterprise support as the solution
- [ ] Keep the tone informative, not negative

### Step 4: Add Nx Cloud Agents Warning - Second Location
**File**: `docs/shared/recipes/nx-release/publish-in-ci-cd.md`
**Location**: Lines 232-239 (Docker Publishing section)

TODO:
- [ ] Remove the CRITICAL(AI) comment block
- [ ] Add the same warning callout as in Step 3
- [ ] Ensure consistency between both warnings

### Step 5: Update nx-json Reference Documentation
**File**: `docs/shared/reference/nx-json.md`
**Location**: Docker section starting at line 529

TODO:
- [ ] Add missing `{projectName}` placeholder to the version scheme syntax documentation
- [ ] Expand date format documentation to show all supported format tokens (YYYY, YY, MM, DD, HH, mm, ss)
- [ ] Add more examples of version patterns
- [ ] Ensure all patterns from `packages/docker/src/release/version-pattern-utils.ts` are documented

**Available Pattern Tokens** (from version-pattern-utils.ts):
- `{projectName}` - the name of the project
- `{currentDate}` - the current date in ISO format
- `{currentDate|DATE FORMAT}` - the current date with custom format
- `{commitSha}` - The full commit sha
- `{shortCommitSha}` - The seven character commit sha

**Date Format Tokens**:
- YYYY - 4-digit year
- YY - 2-digit year
- MM - 2-digit month
- DD - 2-digit day
- HH - 2-digit hours (24-hour)
- mm - 2-digit minutes
- ss - 2-digit seconds

### Step 6: Create TODO.md
**File**: `.ai/TODO.md`

TODO:
- [ ] Create TODO.md file
- [ ] Add entry for this task with timestamp
- [ ] Include links to plan file and related documentation

## Implementation Tracking

**CRITICAL**: Keep track of progress in this section as we implement each step!

- Step 1: ✓ Completed - Created directory and plan file
- Step 2: ⏳ Pending
- Step 3: ⏳ Pending
- Step 4: ⏳ Pending
- Step 5: ⏳ Pending
- Step 6: ⏳ Pending

## Expected Outcome

After completing all steps:
1. Clear, comprehensive documentation for customizing Docker version schemes with practical examples
2. Professional warnings about Nx Cloud Agents limitations with helpful guidance to Nx Enterprise
3. Complete reference documentation that includes all available pattern tokens
4. Proper task tracking in place for future reference

## Notes
- The Docker support in Nx is experimental, so documentation clarity is especially important
- The warnings about Nx Cloud Agents should be helpful, not discouraging
- All pattern tokens available in the code should be documented for users