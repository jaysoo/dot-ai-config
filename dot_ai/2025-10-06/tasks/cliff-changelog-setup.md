# Cliff CLI Changelog Setup

**Date:** 2025-10-06
**Status:** ✅ Complete

## Overview

Completed the setup of git-cliff CLI tool to generate public changelogs for nx-cloud and nx-api releases. The changelog is automatically generated during the release process and served via `/changelog` endpoint.

## Components Implemented

### 1. Changelog Generation Script
**File:** `tools/scripts/private-cloud/generate-changelog.ts`

- **Calver parsing:** Parses version format `YYMM.DD.BUILD` (e.g., `2510.03.1`)
- **Previous tag detection:** Automatically finds previous tag based on calver format
  - For `2510.03.2` → finds `2510.03.1`
  - For `2510.03.1` → finds last tag from previous date
- **Output:** Writes to `apps/nx-cloud/public/CHANGELOG.md`
- **Config:** Uses `cliff-public.toml` for filtering

**Example usage:**
```bash
NX_VERSION=2510.06.3 npx tsx tools/scripts/private-cloud/generate-changelog.ts
```

### 2. Cliff Configuration
**File:** `cliff-public.toml`

**Filtering rules:**
- ✅ Include: `feat(nx-cloud)`, `feat(nx-api)`, `fix(nx-cloud)`, `fix(nx-api)`
- ✅ Include: `doc`, `perf`, `refactor` for nx-cloud and nx-api
- ❌ Exclude: All other commits (client-bundle, aggregator, etc.)
- ❌ Exclude: Release commits (`chore(release)`)

**Configuration:**
```toml
filter_commits = true
protect_breaking_commits = true
```

### 3. Remix Route
**File:** `apps/nx-cloud/app/routes/_empty.changelog.tsx`

- **Endpoint:** `/changelog`
- **Renders:** Markdown from `public/CHANGELOG.md` using `marked` library
- **Styling:** Tailwind prose classes with dark mode support
- **Fallback:** Shows "Changelog not available yet" if file missing

### 4. Release Integration
**File:** `tools/scripts/private-cloud/public-release-from-branch.ts`

**Integration point:** Before build (line 79-93)
```typescript
// Generate changelog before building
console.log('\n--- Generating public changelog ---');
try {
  execSync('npx tsx tools/scripts/private-cloud/generate-changelog.ts', {
    stdio: 'inherit',
    env: { ...process.env, NX_VERSION: newTag },
  });
  console.log('Changelog generated successfully\n');
} catch (changelogErr) {
  console.error('Warning: Failed to generate changelog:', changelogErr);
  // Don't fail the build if changelog generation fails
}
```

## Example Changelog Output

```markdown
# Changelog

Changes included in NX Cloud

## [2510.06.2]

### Bug Fixes

- Sanitize code blocks in suggested diffs

## [2510.04.2]

### Features

- Use flakiness rate in flaky analytics charts

## [2510.04.1]

### Bug Fixes

- Highlight remaining credits rather than consumed over total
```

## Testing

### Manual Test
```bash
# Test changelog generation
NX_VERSION=2510.06.3 npx tsx tools/scripts/private-cloud/generate-changelog.ts

# Test with custom output
NX_VERSION=2510.06.3 CHANGELOG_OUTPUT=/tmp/test.md npx tsx tools/scripts/private-cloud/generate-changelog.ts

# Test with broader range
git-cliff --config cliff-public.toml 2510.03.1..2510.06.3
```

### During Release
The changelog will be automatically generated when running:
```bash
RELEASE_BRANCH_PREFIX=public/2025.10 REGISTRY=<registry> \
  npx tsx tools/scripts/private-cloud/public-release-from-branch.ts
```

## Calver Version Logic

### Format: `YYMM.DD.BUILD`
- `YY` = 2-digit year (25 = 2025)
- `MM` = month (10 = October)
- `DD` = day (03 = 3rd)
- `BUILD` = build number for that date (1, 2, 3...)

### Examples
- `2510.03.1` = First build of Oct 3, 2025
- `2510.03.2` = Second build of Oct 3, 2025
- `2510.04.1` = First build of Oct 4, 2025

### Previous Tag Detection
1. If current build > 1: Try `YYMM.DD.(BUILD-1)`
2. If build = 1 or previous doesn't exist: Find last tag from git history
3. Fallback: Use most recent tag before current

## Files Modified/Created

### Created
- ✅ `tools/scripts/private-cloud/generate-changelog.ts`
- ✅ `apps/nx-cloud/app/routes/_empty.changelog.tsx`
- ✅ `apps/nx-cloud/public/CHANGELOG.md` (example)

### Modified
- ✅ `cliff-public.toml` (added filtering for nx-cloud/nx-api only)
- ✅ `tools/scripts/private-cloud/public-release-from-branch.ts` (integrated changelog generation)

## Commands Reference

### Generate Changelog Manually
```bash
# Using current NX_VERSION
NX_VERSION=2510.06.3 npx tsx tools/scripts/private-cloud/generate-changelog.ts

# Custom config
NX_VERSION=2510.06.3 CHANGELOG_CONFIG=cliff-internal.toml npx tsx tools/scripts/private-cloud/generate-changelog.ts

# Custom output path
NX_VERSION=2510.06.3 CHANGELOG_OUTPUT=/path/to/output.md npx tsx tools/scripts/private-cloud/generate-changelog.ts
```

### View Changelog
```bash
# Local development
# Start nx-cloud dev server and visit http://localhost:PORT/changelog

# Production
# Visit https://nx.app/changelog
```

### Generate Changelog for Range
```bash
# Using git-cliff directly
git-cliff --config cliff-public.toml 2510.03.1..2510.06.3

# Output to file
git-cliff --config cliff-public.toml 2510.03.1..2510.06.3 -o CHANGELOG.md
```

## GitHub Workflow Integration

### Workflow File: `.github/workflows/build-base.yml`

**Added Permissions:**
```yaml
permissions:
  contents: write
  id-token: write
  actions: write
  pull-requests: write  # Added for PR creation
```

**New Steps (lines 134-184):**

1. **Commit Changelog Changes**
   - Runs only on `public/` or `public-gar/` branches
   - Checks if `CHANGELOG.md` was modified
   - Commits changes with `github-actions[bot]` user
   - Sets output flag `has_changes` for next step

2. **Create Pull Request**
   - Runs only if changelog has changes
   - Creates new branch: `changelog-update-{release-branch}`
   - Pushes to origin with `--force` (safe for automation branches)
   - Creates PR to `master` (or `main` if it exists)
   - Uses `gh pr create` with `${{ github.token }}`

**PR Details:**
- **Title:** `chore(nx-cloud): update changelog from {branch-name}`
- **Body:** Explains the changelog update with automation notice
- **Target:** `master` branch (auto-detects `main` if present)
- **Source:** `changelog-update-{branch}` (e.g., `changelog-update-public-2025.10`)

### Flow Diagram

```
Release Branch Push (e.g., public/2025.10)
  ↓
Generate Changelog (public-release-from-branch.ts)
  ↓
Build Images
  ↓
Commit CHANGELOG.md
  ↓
Create PR Branch (changelog-update-public-2025.10)
  ↓
Push to GitHub
  ↓
Create PR to master
  ↓
Manual Review & Merge
```

## Next Steps / Future Improvements

1. **Markdown Library:** Consider adding `marked` to package.json if not already present
2. **Styling:** May want to match nx-cloud design system more closely
3. **Versioning:** Could add version selector to view historical changelogs
4. **RSS Feed:** Could generate RSS/Atom feed from changelog
5. **Release Notes:** Could integrate with GitHub releases
6. **Auto-merge:** Consider auto-merging changelog PRs if CI passes

## Notes

- Changelog generation is **non-blocking** - release continues even if it fails
- Only commits with scope `(nx-cloud)` or `(nx-api)` are included
- File is generated into `public/` directory so it's served as static asset
- The `/changelog` route reads from the static file at runtime
- **PR is automatically created** after successful build on release branches
- PR uses `GITHUB_TOKEN` with `pull-requests: write` permission
- Single-tenant builds also go through `build-base.yml` but skip PR creation (no `public/` in branch name)
