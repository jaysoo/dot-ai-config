# PNPM Catalog Support

**Linear Issue**: DOC-302
**Started**: 2025-10-21 14:28
**Due**: 2025-10-24

## Goal

Update the dependency management documentation to mention PNPM catalogs as a way to maintain single version policy when using PNPM.

## Context

From Linear issue:
- Update page: https://canary.nx.dev/docs/concepts/decisions/dependency-management
- Add aside about PNPM catalogs (https://pnpm.io/catalogs)
- Mention that catalogs can be used to maintain single version policy
- Projects can use `"react": "catalog:"` in their package.json files
- PNPM catalog support exists for Nx 22+

## Plan

1. Read the current dependency-management.mdoc file
2. Identify the appropriate section to add the PNPM catalog information
3. Add an aside (callout) about PNPM catalogs
4. Test the changes locally
5. Verify the content renders correctly

## Implementation Notes

File location: `astro-docs/src/content/docs/concepts/Decisions/dependency-management.mdoc`

The aside should:
- Mention PNPM catalogs as an alternative for single version policy with PNPM
- Include example: `"react": "catalog:"`
- Note compatibility: Nx 22+
- Link to PNPM catalog documentation

## Status

- [x] Read current file
- [x] Add PNPM catalog aside
- [x] Format with prettier (skipped - plugin issue)
- [x] Verify with git diff
- [x] Commit changes

## Completion Summary

Successfully added PNPM catalog support documentation to the dependency management page.

**Changes made:**
- Added a tip aside in the "Single Version Policy" section
- Mentioned PNPM catalogs as a way to maintain single version policy
- Included example usage: `"react": "catalog:"`
- Noted Nx 22+ compatibility
- Linked to PNPM catalog documentation

**Commit**: 366535f8c2 - docs(misc): add PNPM catalog support documentation

**File modified**: astro-docs/src/content/docs/concepts/Decisions/dependency-management.mdoc:48-50

**Notes**:
- Initially used wrong syntax (:::tip) - fixed to use Markdoc syntax ({% aside type="tip" %})
- Made text concise and clarified `<package>` is a placeholder for any package name
