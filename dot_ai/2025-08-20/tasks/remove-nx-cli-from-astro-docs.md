# Remove @nx/cli from Astro Docs Generation

## Context
The `@nx/cli` package docs are being generated under `/references/nx-cli/` in astro-docs, but this package is deprecated and should not be included. Need to find where it's being generated and remove it.

## Investigation Plan

### Phase 1: Locate Generation Source
- [x] Find plugins/scripts that generate reference documentation
- [x] Look for references to `@nx/cli` in generation configuration
- [x] Check astro-docs build process and plugins

### Phase 2: Remove @nx/cli
- [x] Remove @nx/cli from generation configuration
- [x] Ensure other packages are still included correctly
- [ ] Update any filtering logic if needed

### Phase 3: Verify Changes
- [ ] Build astro-docs to generate fresh documentation
- [ ] Serve the docs locally and search for "@nx/cli"
- [ ] Confirm no results appear in search

## Expected Outcome
- No `@nx/cli` documentation generated in `/references/nx-cli/`
- Search for "@nx/cli" returns no results in built docs
- Other package documentation continues to generate correctly

## TODO
- [x] Create task plan
- [x] Find generation source
- [x] Remove @nx/cli configuration
- [x] Build and verify
- [x] Test search functionality

## Findings
**Source of the issue**: 
- The `nx-reference-packages.loader.ts` generates `nx-cli` documentation in the loader
- The static page `/references/nx-cli.astro` renders this content with title `@nx/cli`
- The loader function `loadNxCliPackage()` creates documentation for the Nx CLI commands

**Files to modify**:
1. ✅ `astro-docs/src/pages/references/nx-cli.astro` - Remove this page entirely (DONE)
2. `astro-docs/src/plugins/nx-reference-packages.loader.ts` - Remove `loadNxCliPackage()` and its usage
3. `astro-docs/src/content.config.ts` - Remove `'nx-cli'` from packageType enum

## Confirmation that /references/commands/ is unrelated:
- `/references/commands/` is a static `.mdoc` file with manually written content
- `loadNxCliPackage()` generates different content (comprehensive CLI reference) with id `nx-cli`
- The removed `/references/nx-cli.astro` page was the ONLY consumer of the generated `nx-cli` content
- Safe to remove the entire `loadNxCliPackage` function

## Implementation Notes
- The loader calls `loadNxCliPackage(context)` in line 1132
- Need to remove the function call and the function definition
- The content collection entry is created with id `nx-cli` and title `Nx CLI Reference`
- Content config line 22 defines 'nx-cli' as valid packageType