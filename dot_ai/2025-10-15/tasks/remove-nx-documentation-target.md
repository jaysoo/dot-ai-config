# Remove `nx documentation` Target

**Issue**: DOC-254 - https://linear.app/nxdev/issue/DOC-254/remove-nx-documentation-target
**Branch**: DOC-254
**Date**: 2025-10-15

## Overview

Remove the `documentation` target from the root project and all references to it in CI workflows, hooks, and scripts. This will be done in two phases.

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

**Scripts to KEEP**:
- `scripts/documentation/internal-link-checker.ts` - Used by `nx-dev:build` target
- `scripts/documentation/map-link-checker.ts` - Used by `check-documentation-map` npm script
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

The following files read from `docs/generated/devkit`:
- `nx-dev/data-access-packages/src/lib/packages.api.ts`
- `nx-dev/data-access-documents/src/lib/documents.api.ts`

These would need to be updated or the generation needs to continue working somehow.

## Implementation Plan

### Phase 1: Remove Target from CI/Hooks (This PR)

**Goal**: Stop running the documentation target but don't remove any scripts or generated files yet.

1. Remove "Check Documentation" step from `.github/workflows/ci.yml`
2. Remove `documentation` dependency from `prepush` target in root `project.json`
3. Remove `documentation` script from `package.json` (optional - could leave for manual runs)
4. Remove `@nx/nx-source:documentation` dependency from `nx-dev:deploy-build` target
5. Verify `nx build nx-dev` still works

**Files to modify**:
- `.github/workflows/ci.yml`
- `project.json` (root - prepush target)
- `nx-dev/nx-dev/project.json` (deploy-build target)
- `package.json` (optional - documentation script)

**Validation**:
- Run `nx build nx-dev` to ensure it still works

### Phase 2: Remove Scripts and Generated Files (Follow-up PR)

**Goal**: Clean up all the scripts, generated files, and nx-dev pages that depend on them.

1. Remove the `documentation` target entirely from root `project.json`
2. Remove `scripts/documentation/generators/` directory
3. Remove `scripts/documentation/package-schemas/` directory
4. Remove `docs/generated/` directory
5. Remove `docs/external-generated/` directory
6. Update `nx-dev` code to not depend on generated files:
   - `nx-dev/data-access-packages/src/lib/packages.api.ts`
   - `nx-dev/data-access-documents/src/lib/documents.api.ts`
7. Remove any nx-dev pages that display generated content
8. Remove `check-documentation-map` script from package.json if no longer needed
9. Update `.gitignore` if it has entries for generated docs

**Files to investigate further**:
- Check if `scripts/documentation/schema-flattener.ts` is used elsewhere
- Check if any other scripts depend on the generators

**Validation**:
- Run `nx build nx-dev`
- Run `./scripts/documentation/internal-link-checker.ts` to ensure it still works
- Check that the nx-dev site builds and serves correctly

## Notes

- The `internal-link-checker.ts` script is used in the `nx-dev:build` target and must continue to work
- The `generate-embeddings.yml` workflow doesn't use the documentation target
- The pre-push hook runs `nx prepush` which has the documentation dependency, so removing it from prepush target will fix the hook
