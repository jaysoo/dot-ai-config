# Task Plan: Fix GitHub Issues Batch

## Task Overview
Fix the GitHub issues identified in the previous analysis, starting with the highest confidence documentation issues. Each issue will be fixed in its own branch with proper validation.

## Reference Issues
- From find-easy-github-issues.md: #31431, #30649, #30768, #30831, #31111
- From find-5-more-easy-issues.md: #30137, #30810, #31398, #30058, #30008

## Priority Order (Highest Confidence First)
Based on simplicity and clarity of requirements:

### Tier 1 - Very Simple Fixes (5-10 LOC)
1. #30831: Fix indexHtmlTransformer docs - Just correcting a function signature
2. #30137: Fix --dryRun flag documentation - Simple text corrections
3. #31431: Add Bun to CI deployment docs - Adding to existing list

### Tier 2 - Simple Additions (10-20 LOC)
4. #31111: Document NX_TUI environment variables - Adding missing env vars
5. #30649: Explain "*" version meaning - Adding clarification section

### Tier 3 - Moderate Additions (15-30 LOC)
6. #30058: Add Homebrew troubleshooting - Adding troubleshooting section
7. #31398: Clarify ciMode enablement - Documentation clarification
8. #30768: Standardize plugin location guidance - Updating multiple pages

### Tier 4 - Larger Updates (20-50 LOC)
9. #30810: Add E2E encryption verification guide - New guide section
10. #30008: Update Tailwind v4 docs - Version update (might need more research)

## Implementation Steps

### Step 1: Setup and Validation
**TODO**:
- [x] Read CONTRIBUTING.md for contribution guidelines
- [ ] Ensure local environment is ready
- [ ] Run full test suite to ensure starting from clean state

### Step 2: Fix Issue #30831 - indexHtmlTransformer Documentation
**What**: Fix incorrect function signature in @nx/angular:webpack-browser docs
**Branch**: issue/30831
**Changes**:
- Update function signature from `async (html: string) => string` to `async (config: object, html: string) => string`
**Validation**:
- Verify against actual implementation in codebase
- Check if other references need updating
**TODO**:
- [ ] Create branch
- [ ] Find and update documentation file
- [ ] Verify accuracy
- [ ] Commit with message: "docs(angular): fix indexHtmlTransformer function signature"

### Step 3: Fix Issue #30137 - dryRun Flag Documentation
**What**: Fix incorrect flag name in react-monorepo tutorial
**Branch**: issue/30137
**Changes**:
- Change `--dry-run` to `--dryRun`
- Add the flag to command example
- Note that playwright doesn't support dryRun
**Validation**:
- Test the commands locally to ensure correctness
**TODO**:
- [ ] Create branch
- [ ] Update tutorial documentation
- [ ] Verify commands work
- [ ] Commit with message: "docs(react): fix dryRun flag usage in tutorial"

### Step 4: Fix Issue #31431 - Add Bun to CI Docs
**What**: Add Bun to supported package managers in CI deployment docs
**Branch**: issue/31431
**Changes**:
- Add Bun to the list at https://nx.dev/ci/recipes/other/ci-deployment
**Validation**:
- Verify Bun is already in PackageManager type definitions
- Check for other CI docs that might need updating
**TODO**:
- [ ] Create branch
- [ ] Update CI deployment documentation
- [ ] Search for other CI docs mentioning package managers
- [ ] Commit with message: "docs(ci): add Bun to supported package managers list"

### Step 5: Fix Issue #31111 - Document NX_TUI Environment Variables
**What**: Add documentation for NX_TUI and NX_TUI_AUTO_EXIT
**Branch**: issue/31111
**Changes**:
- Add entries to environment variables reference page
- Include descriptions of what each variable does
**Validation**:
- Find where these are used in code to understand their purpose
**TODO**:
- [ ] Create branch
- [ ] Research NX_TUI usage in codebase
- [ ] Add to environment variables documentation
- [ ] Commit with message: "docs(core): add NX_TUI environment variables documentation"

### Step 6: Fix Issue #30649 - Explain "*" Version Meaning
**What**: Clarify what "*" means in project package.json files
**Branch**: issue/30649
**Changes**:
- Add section explaining "*" resolves to root package.json version, not latest npm
**Validation**:
- Test behavior in actual Nx workspace
**TODO**:
- [ ] Create branch
- [ ] Find appropriate docs location
- [ ] Add explanation section
- [ ] Commit with message: "docs(core): explain '*' version in project package.json"

### Step 7: Skip or Defer Complex Issues
For issues that require more investigation or are unclear:
- #30058: Homebrew troubleshooting - Need to verify the edge case
- #31398: ciMode enablement - Need to understand self-hosted setup better
- #30768: Plugin location - Multiple pages to update, needs consistency check
- #30810: E2E encryption - Need to understand encryption verification process
- #30008: Tailwind v4 - Need to check current v4 requirements

Mark these as "Skipped - Needs Further Investigation" if complexity exceeds expectations.

## Validation Steps for Each Fix
1. **Format check**: Run `npx prettier -- FILE_NAME` on changed files
2. **Build docs locally**: `nx serve-docs nx-dev` and verify changes appear correctly
3. **Link check**: Ensure no broken links introduced
4. **Accuracy check**: Verify technical accuracy against implementation

## Final Steps
After all fixes are complete:
1. Run `nx prepush` to ensure all validations pass
2. Document summary of changes in this file
3. Note any issues that were skipped and why

## Expected Outcome
- 5-10 documentation issues fixed across multiple branches
- Each fix validated and properly formatted
- Clear documentation of what was changed and why
- List of any issues that need more investigation

## Progress Tracking

### CRITICAL: Keep track of implementation progress here!

#### Issue #30831 - indexHtmlTransformer Documentation
- [x] Branch created
- [ ] Documentation updated - SKIPPED: Could not find the incorrect documentation in codebase
- [ ] Changes validated
- [ ] Committed
- **Status**: Skipped - The incorrect documentation appears to be on the website but not in the markdown files

#### Issue #30137 - dryRun Flag Documentation  
- [x] Branch created
- [x] Documentation updated
- [x] Changes validated
- [x] Committed - REVERTED per user request
- **Status**: Reverted - User reviewed and determined the issue isn't really an issue

#### Issue #31431 - Add Bun to CI Docs
- [x] Branch created
- [x] Documentation updated
- [x] Changes validated
- [x] Committed
- **Status**: Complete - Added bun to both package manager mentions in CI deployment docs

#### Issue #31111 - Document NX_TUI Environment Variables
- [x] Branch created
- [x] Documentation updated
- [x] Changes validated
- [x] Committed
- **Status**: Complete - Added NX_TUI and NX_TUI_AUTO_EXIT to environment variables reference

#### Issue #30649 - Explain "*" Version Meaning
- [x] Branch created
- [x] Documentation updated
- [x] Changes validated
- [x] Committed
- **Status**: Complete - Added section to dependency management docs explaining "*" version behavior

#### Skipped Issues
- [x] Document which issues were skipped and why

**Issues Skipped:**
1. #30831 - indexHtmlTransformer Documentation: Could not find the incorrect documentation in the codebase
2. #30058 - Homebrew troubleshooting: Needs verification of the edge case
3. #31398 - ciMode enablement: Needs better understanding of self-hosted setup
4. #30768 - Plugin location: Multiple pages to update, needs consistency check
5. #30810 - E2E encryption: Needs understanding of encryption verification process
6. #30008 - Tailwind v4: Needs to check current v4 requirements

**Issues Reverted:**
1. #30137 - dryRun Flag Documentation: User reviewed and determined it wasn't really an issue

## Branch Summary

Branches created and ready:
- `issue/31431` - Add Bun to CI deployment docs ✅
- `issue/31111` - Document NX_TUI environment variables ✅
- `issue/30649` - Explain "*" version meaning in project package.json ✅

Branches created but work skipped/reverted:
- `issue/30831` - Fix indexHtmlTransformer function signature (skipped - couldn't find docs)
- `issue/30137` - Fix dryRun flag documentation (reverted per user request)

Additional branches not created (lower priority):
- `issue/30058` - Add Homebrew troubleshooting
- `issue/31398` - Clarify ciMode enablement
- `issue/30768` - Standardize plugin location guidance
- `issue/30810` - Add E2E encryption verification guide
- `issue/30008` - Update Tailwind v4 documentation