# Nx Release v22 Missing Documentation

## Context
Working on DOC-261 to document Nx Release changes for v22 from the Notion page:
https://www.notion.so/nxnrwl/Nx-Release-Changes-for-22-29269f3c238780d89986d90b03c33698

Current commit (8051358b57) already documented `releaseTag` changes, but several other v22 changes are missing.

## Documentation Structure
- Main reference: `astro-docs/src/content/docs/reference/nx-json.mdoc`
- Guides: `astro-docs/src/content/docs/guides/Nx Release/`
- Pattern: Use tabs with `{% tabs syncKey="nx-release-configuration" %}` showing "Nx 22+" vs "< Nx 22"

## Changes to Document

### 1. `preserveMatchingDependencyRanges` Default Changed to `true`
**PR**: https://github.com/nrwl/nx/pull/32983

**Details**:
- Default changed from `false` to `true`
- Impact: Dependency version ranges will be preserved during releases (e.g., `^1.0.0` stays `^1.1.0` instead of exact version)
- Migration: Set explicitly to `false` if you need exact versions

**Where to document**:
- **Primary location**: `astro-docs/src/content/docs/reference/nx-json.mdoc`
  - In the `### Version` section (around line 489-525)
  - Add to the list of "Some important changes in Nx 21" (currently at line 518-524)
  - Should be similar to the existing bullet about `preserveLocalDependencyProtocols` (line 523)

**Suggested content**:
```markdown
- `preserveMatchingDependencyRanges` now defaults to `true` (previously `false`)
  - Dependency version ranges are now preserved when they already satisfy the new version
  - Example: If releasing version `1.2.0` and a dependent has `^1.0.0`, it will remain `^1.0.0` (not changed to `1.2.0`)
  - Set to `false` explicitly if you need exact versions in all dependents
```

**Note**: This was NEVER documented originally - it exists in the TypeScript definition at `packages/nx/src/config/nx-json.ts:204` with a TODO comment (line 195) to change default in v22, which happened in PR #32983.

---

### 2. Release Graph Aware Filtering
**PR**: https://github.com/nrwl/nx/pull/32971

**Details**:
- New `ReleaseGraph` implementation with graph-aware filtering
- Breaking change: `VersionActions.init()` signature changed (no longer accepts second argument)
- New option: `updateDependents: "always"` added (in addition to existing `"auto"` and `"never"`)

**Where to document**:
- **Primary location**: `astro-docs/src/content/docs/reference/nx-json.mdoc`
  - In the `### Version` section
  - Needs new subsection explaining `updateDependents` option

- **Secondary**: May need guide showing examples
  - Could go in an existing guide like `release-projects-independently.mdoc` or `updating-version-references.mdoc`

**Uncertainty**:
- Not clear if `updateDependents` was documented before or if this is entirely new
- Need to check if there are existing references to `updateDependents` in guides
- The breaking change about `VersionActions.init()` might need an aside or migration note

**Suggested approach**:
1. Search for existing `updateDependents` references
2. If it exists, update to add `"always"` option
3. If it doesn't exist, create new subsection documenting all three options
4. Add breaking change note about `VersionActions.init()` for custom implementations

---

### 3. `ReleaseClient` Can Ignore nx.json Config
**PR**: https://github.com/nrwl/nx/pull/33099

**Details**:
- Feature: `ReleaseClient` API can now ignore `nx.json` release configuration
- Use case: Programmatic usage with custom configurations

**Where to document**:
- **Uncertainty**: Not sure if `ReleaseClient` is documented anywhere
- This is likely an advanced/programmatic API feature
- Might belong in API documentation or an advanced guide

**Suggested approach**:
1. Search for existing `ReleaseClient` references
2. If it exists, add this as new capability
3. If it doesn't, might need new "Programmatic API" guide or add to reference docs

---

### 4. `replaceExistingContents` Option for Changelog
**PR**: https://github.com/nrwl/nx/pull/33096

**Details**:
- Feature: New CLI and API option to replace entire changelog contents
- Use case: Full changelog regeneration instead of appending

**Where to document**:
- **Primary location**: `astro-docs/src/content/docs/reference/nx-json.mdoc`
  - In the `### Changelog` section (starts around line 526)
  - Could go under workspace or project changelog subsections

- **Secondary**: Might also mention in guides
  - `configure-changelog-format.mdoc` seems like a good fit

**Suggested content**:
```markdown
#### Replace Existing Contents

By default, changelog entries are prepended to existing files. To completely replace the changelog file contents instead:

```jsonc
{
  "release": {
    "changelog": {
      "workspaceChangelog": {
        "replaceExistingContents": true
      }
    }
  }
}
```
```

---

### 5. Custom Changelog Renderer Support
**PR**: https://github.com/nrwl/nx/pull/33095

**Details**:
- Feature: `changelog.renderer` can now be set to a custom implementation directly (not just a path)
- Use case: Full control over changelog formatting via programmatic API

**Where to document**:
- **Primary location**: Guide about custom changelog renderers
  - Likely `configure-changelog-format.mdoc`

- **Reference**: Mention in nx-json.mdoc changelog section

**Uncertainty**:
- Not clear if custom renderer path was previously documented
- This enhancement (direct implementation vs path) is for programmatic API usage

---

### 6. Docker Version Support for Git Tags
**PR**: https://github.com/nrwl/nx/pull/32972

**Details**:
- Feature: New `releaseTagPatternPreferDockerVersion` option (renamed to `releaseTag.preferDockerVersion` in v22)
- Use case: Use Docker-compatible version format in git tags

**Where to document**:
- **Primary location**: `astro-docs/src/content/docs/reference/nx-json.mdoc`
  - In the `### Release Tag` section (line 411+)
  - Should show both v22+ (`releaseTag.preferDockerVersion`) and < v22 (`releaseTagPatternPreferDockerVersion`)

- **Secondary**: `astro-docs/src/content/docs/guides/Nx Release/release-docker-images.mdoc`
  - This guide already has tabs for v22+ vs < v22 config
  - Should add example showing `preferDockerVersion` option

**Note**: This follows the same pattern as other `releaseTag*` properties that were refactored in current commit.

---

## Next Steps

1. ✅ Created task plan (this file)
2. ⬜ Search for existing references to verify what's already documented
3. ⬜ Determine priority order for implementation
4. ⬜ Implement documentation changes
5. ⬜ Test with local build
6. ⬜ Commit and push changes

## Files to Check
- `astro-docs/src/content/docs/reference/nx-json.mdoc` - main reference
- `astro-docs/src/content/docs/guides/Nx Release/configure-changelog-format.mdoc`
- `astro-docs/src/content/docs/guides/Nx Release/release-docker-images.mdoc`
- `astro-docs/src/content/docs/guides/Nx Release/release-projects-independently.mdoc`
- `astro-docs/src/content/docs/guides/Nx Release/updating-version-references.mdoc`

## Questions for User
1. Should we prioritize these by importance/frequency of use?
2. Are there any other sources besides the Notion page that list v22 changes?
3. Should programmatic API features (ReleaseClient, direct renderer impl) be in separate docs?
