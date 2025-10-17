# Remove `nx documentation` Target

**Issue**: DOC-254 - https://linear.app/nxdev/issue/DOC-254/remove-nx-documentation-target
**Branch**: DOC-254
**Date**: 2025-10-15

## Overview

Remove the `documentation` target from the root project and all references to it in CI workflows, hooks, and scripts. This will be done in three phases.

## Investigation Summary

### Documentation Target Details

**Location**: Root project `@nx/nx-source` in `project.json`

**Target Configuration**:
```json
"documentation": {
  "executor": "nx:run-commands",
  "options": {
    "commands": [
      "ts-node -P scripts/tsconfig.scripts.json ./scripts/documentation/generators/main.ts",
      "pnpm check-documentation-map"
    ],
    "parallel": false
  },
  "cache": true,
  "dependsOn": [
    {
      "target": "build",
      "projects": ["devkit", "typedoc-theme"]
    }
  ],
  "outputs": [
    "{workspaceRoot}/docs/external-generated",
    "{workspaceRoot}/docs/generated"
  ]
}
```

### What the Documentation Target Generates

The main script (`scripts/documentation/generators/main.ts`) generates:

1. **CLI Documentation** → `docs/generated/cli/`
2. **CNW Documentation** → `docs/generated/cli/`
3. **Devkit Documentation** → `docs/generated/devkit/`
4. **Package Schemas** → `docs/generated/packages/` and `docs/external-generated/packages/`
5. **Manifests** → `docs/generated/manifests/`
6. **Metadata** → `docs/generated/packages-metadata.json` and `docs/external-generated/packages-metadata.json`

### Scripts Involved

**Main generator script**:
- `scripts/documentation/generators/main.ts` - orchestrates all generation

**Generator scripts** (likely all can be removed in Phase 2):
- `scripts/documentation/generators/generate-cli-data.ts`
- `scripts/documentation/generators/generate-cnw-documentation.ts`
- `scripts/documentation/generators/generate-devkit-documentation.ts`
- `scripts/documentation/generators/generate-manifests.ts`
- `scripts/documentation/generators/utils-generator/convert-to-dictionary.ts`

**Package schema scripts** (used by generators):
- `scripts/documentation/package-schemas/generatePackageSchemas.ts`
- `scripts/documentation/package-schemas/utils.ts`
- `scripts/documentation/package-schemas/package-metadata.ts`
- `scripts/documentation/package-schemas/schema.resolver.ts`

**Docs and map.json verifcation:**
- `scripts/documentation/map-link-checker.ts` - Used by `check-documentation-map` npm script (should be removed since we no longer need map.json)

**Scripts to KEEP**:
- `scripts/documentation/internal-link-checker.ts` - Used by `nx-dev:build` target
- `scripts/documentation/json-parser.ts` - May be a utility
- `scripts/documentation/utils.ts` - May be a utility
- `scripts/documentation/load-webinars.ts` - May be used elsewhere
- `scripts/documentation/plugin-quality-indicators.ts` - Used by `nx-dev:deploy-build`
- `scripts/documentation/open-graph/generate-images.ts` - Used by `nx-dev:generate-og-images`

### Where Documentation Target is Run

1. **CI Workflow**: `.github/workflows/ci.yml` lines 89-91
   ```yaml
   - name: Check Documentation
     run: pnpm nx documentation
     timeout-minutes: 20
   ```

2. **Pre-push Hook**: `.husky/pre-push`
   ```bash
   pnpm nx prepush --parallel 8 --tuiAutoExit 0
   ```

3. **Prepush Target**: Root project's `prepush` target depends on `documentation`
   ```json
   "prepush": {
     "dependsOn": [
       "nx:format-native",
       "nx:lint-native",
       "documentation",  // <-- This dependency
       "check-commit",
       "check-format:quick",
       "check-lock-files"
     ]
   }
   ```

4. **Package.json scripts**:
   - `"documentation": "nx documentation"`
   - `"check-documentation-map": "ts-node -P ./scripts/tsconfig.scripts.json ./scripts/documentation/map-link-checker.ts"`

5. **nx-dev deploy-build target**: `nx-dev/nx-dev/project.json`
   ```json
   "deploy-build": {
     "dependsOn": [
       "@nx/nx-source:documentation"  // <-- This dependency
     ]
   }
   ```

### nx-dev Dependencies on Generated Files

#### API files that import from generated manifests

These files in `nx-dev/nx-dev/lib/` import JSON files from `public/documentation/generated/manifests/`:

1. **nx.api.ts** - imports `nx.json` and `new-nx-api.json`
2. **ci.api.ts** - imports `ci.json` and `tags.json`
3. **new-packages.api.ts** - imports `new-nx-api.json` (used by `[...segments].tsx`, `plugin-registry.tsx`)
4. **menus.api.ts** - imports `menus.json` (used by ALL page routes)
5. **tags.api.ts** - imports `tags.json`
6. **plugins.api.ts** - imports `extending-nx.json`

#### Code that reads from docs/generated/devkit

1. **packages.api.ts** (`nx-dev/data-access-packages/src/lib/packages.api.ts:180-203`)
   - Reads directory structure from `../../docs/generated/devkit`
   - Used in `getStaticDocumentPaths()` method for devkit package

2. **documents.api.ts** (`nx-dev/data-access-documents/src/lib/documents.api.ts`)
   - Lines 154-173: Reads from `../../docs/generated/devkit` in `getSlugsStaticDocumentPaths()`
   - Lines 198-213: Legacy handler for devkit docs at `/nx-api/devkit/documents/*`
   - Lines 215-231: NEW legacy handler for devkit docs at `/reference/core-api/devkit/documents/*`

#### Pages that use these APIs

- `pages/[...segments].tsx` - uses `menusApi`, `nxNewPackagesApi`
- `pages/ci/[...segments].tsx` - uses `menusApi`, `ciApi`
- `pages/extending-nx/[...segments].tsx` - likely uses `pluginsApi`
- `pages/plugin-registry.tsx` - uses `nxNewPackagesApi`
- All pages use `menusApi` for navigation

#### Generated Files Structure

**In `docs/generated/`:**
- `cli/` - CLI documentation (32 files)
- `devkit/` - Devkit API documentation (144 files in subdirectories)
- `manifests/` - JSON manifest files:
  - `ci.json` (69 KB)
  - `extending-nx.json` (17 KB)
  - `menus.json` (300 KB) - **CRITICAL: Used by all pages**
  - `new-nx-api.json` (296 KB) - **CRITICAL: Used for package API pages**
  - `nx.json` (467 KB)
  - `tags.json` (63 KB)
- `packages/` - Package schemas (34 directories)
- `packages-metadata.json` (264 KB)

**In `docs/external-generated/`:**
- `packages/` - External package schemas (6 items)
- `packages-metadata.json` (8 KB)

#### Build Process

The `copy-docs.js` script copies the entire `docs/` folder (including generated files) to `nx-dev/nx-dev/public/documentation/` during the `copy-docs` target, which runs before every build.

## Implementation Plan

### Phase 1: Remove Target from CI/Hooks (COMPLETED ✅)

**Goal**: Stop running the documentation target but don't remove any scripts or generated files yet.

**Completed Changes**:
1. ✅ Removed "Check Documentation" step from `.github/workflows/ci.yml`
2. ✅ Removed `documentation` dependency from `prepush` target in root `project.json`
3. ✅ Removed `documentation` script from `package.json`
4. ✅ Removed `@nx/nx-source:documentation` dependency from `nx-dev:deploy-build` target

**Files Modified**:
- `.github/workflows/ci.yml`
- `project.json` (root - prepush target)
- `nx-dev/nx-dev/project.json` (deploy-build target)
- `package.json` (documentation script)

**Status**: Committed in `0798700b75`

**Validation**: 
- Build works for nx-dev: `NEXT_PUBLIC_ASTRO_URL=https://nx-docs.netlify.app nx deploy-build nx-dev`
---

### Phase 2: Update nx-dev to Not Depend on Generated Files (IN PROGRESS)

**Goal**: Modify nx-dev code so it no longer renders/generates docs-related pages, and remove all code/targets/modules that are used in the removed pages.

**Status**: Partially complete - build works, but additional cleanup identified

**Completed**:
1. ✅ Removed 5 docs-related pages:
   - `pages/[...segments].tsx` - Main docs catch-all
   - `pages/ci/[...segments].tsx` - CI docs
   - `pages/ci/index.tsx` - CI root
   - `pages/extending-nx/[...segments].tsx` - Extending Nx docs
   - `pages/extending-nx/index.tsx` - Extending Nx root
   - `pages/plugin-registry.tsx` - Plugin registry (migrated to astro-docs)

2. ✅ Removed 6 docs-related API modules from `nx-dev/nx-dev/lib/`:
   - `nx.api.ts`, `ci.api.ts`, `plugins.api.ts`
   - `tags.api.ts`, `menus.api.ts`, `new-packages.api.ts`

3. ✅ Cleaned up remaining pages:
   - Removed menu/sidebar code from `changelog.tsx`
   - Removed menu/sidebar code from `ai-chat/index.tsx`

4. ✅ Updated dependencies in `nx-dev/nx-dev/package.json`:
   - Removed: `@nx/nx-dev-data-access-menu`, `@nx/nx-dev-data-access-packages`, `@nx/nx-dev-models-package`, `@nx/nx-dev-models-document`, `@nx/nx-dev-models-menu`, `@nx/nx-dev-feature-doc-viewer`, `@nx/nx-dev-feature-package-schema-viewer`
   - Added: `ai: "3.0.19"` (for API routes)

5. ✅ Added missing dependency to `nx-dev/ui-powerpack/package.json`:
   - Added: `@nx/nx-dev-feature-analytics`

6. ✅ Removed docs-related targets from `nx-dev/nx-dev/project.json`:
   - Removed `copy-docs` target
   - Removed `serve-docs` target
   - Removed `copy-docs` from `build-base` dependencies
   - Removed `copy-docs` from `serve` dependencies
   - Removed `copy-docs` command from `deploy-build`
   - Removed `implicitDependencies: ["docs"]`

7. ✅ Ran `nx sync` and `pnpm install`

**Remaining Cleanup** (see `.ai/2025-10-16/phase2-cleanup-remaining.md`):
- Remove unused data-access packages: `data-access-menu`, `data-access-packages`, `feature-package-schema-viewer`, `feature-doc-viewer`
- Remove unused model packages: `models-document`, `models-package`, `models-menu`
- Remove unused files in `data-access-documents`: `documents.api.ts`, `tags.api.ts`
- Remove unused file: `nx-dev/nx-dev/lib/rspack/pkg.ts`
- Update exports in `data-access-documents/src/node.index.ts`

**Validation**:
- ✅ Build works: `NEXT_PUBLIC_ASTRO_URL=https://nx-docs.netlify.app nx run nx-dev:build`
- ✅ All TypeScript compiles
- ⚠️  Internal link checker found broken links in Astro docs (expected, separate fix)

---

### Phase 3: Remove Documentation Target and Generated Files (Follow-up PR)

**Goal**: Clean up all the scripts and generated files.

**Files/Directories to Remove**:

1. **Remove the documentation target** from root `project.json` (lines 47-81)

2. **Remove generator scripts**:
   - `scripts/documentation/generators/` - entire directory
   - `scripts/documentation/package-schemas/` - entire directory

3. **Remove generated files**:
   - `docs/generated/` - entire directory
   - `docs/external-generated/` - entire directory

4. **Clean up package.json**:
   - Remove `check-documentation-map` script (if not needed)

5. **Update .gitignore**:
   - Add entries for `docs/generated` and `docs/external-generated` (if not already there)

**Scripts to KEEP** (in `scripts/documentation/`):
- `internal-link-checker.ts` - Used by `nx-dev:build` target
- `map-link-checker.ts` - Used by `check-documentation-map` npm script (investigate if needed)
- `json-parser.ts` - Utility (check usage)
- `utils.ts` - Utility (check usage)
- `load-webinars.ts` - May be used elsewhere
- `plugin-quality-indicators.ts` - Used by `nx-dev:deploy-build`
- `open-graph/generate-images.ts` - Used by `nx-dev:generate-og-images`
- `schema-flattener.ts` - Check usage before removing

**Validation**:
- Run `nx build nx-dev` successfully
- Run `internal-link-checker.ts` to ensure it still works
- Run `nx prepush` successfully
- Check that nx-dev site builds and serves correctly

## Notes

- The `internal-link-checker.ts` script is used in the `nx-dev:build` target and must continue to work
- The `generate-embeddings.yml` workflow doesn't use the documentation target
- The pre-push hook runs `nx prepush` which has the documentation dependency, so removing it from prepush target will fix the hook
