# Daily Summary - 2026-01-21

## Tasks Completed

### DOC-382: Update Releases Page for Nx 22 Details

**Linear**: https://linear.app/nxdev/issue/DOC-382
**Status**: Completed

Updated the releases page to reflect Nx 22 as the current version:

- **Supported Versions table updated**:
  - v22 → Current (released 2025-10-22)
  - v21 → LTS (released 2025-05-05)
  - v20 → LTS (released 2024-10-06)
  - Removed expired versions: v19, v18*, v17

- **Updated examples to use current versions**:
  - Version lockstep example: `nx@22.2.0` / `@nx/js@22.2.0`
  - Deprecation policy example: v21.1.0 → removed in v23.0.0

**Files Changed**:
- `astro-docs/src/content/docs/reference/releases.mdoc`

**Validation**: Build and lint passed successfully.
