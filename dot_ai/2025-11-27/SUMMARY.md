# Summary - November 27, 2025

## Completed Tasks

### Vercel Route Limit Fix - Redirect Consolidation

**Problem**: Nx.dev deployment on Vercel was failing with error "Maximum number of routes exceeded. Max is 2048, received 2054."

**Solution**: Consolidated redirect rules in `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` using Next.js wildcard patterns to reduce individual routes.

**Changes Made**:
| Consolidation | Routes Saved | Wildcard Pattern |
|--------------|--------------|------------------|
| Devkit docs | 145 → 1 | `/reference/core-api/devkit/documents/:slug*` → `/docs/reference/devkit/:slug*` |
| Nx docs | 30 → 1 | `/reference/core-api/nx/documents/:slug*` → `/docs/reference/nx-commands` |
| Tech API executors | 66 → 17 | 17 technology-specific wildcards |
| Tech API generators | 166 → 25 | 25 technology-specific wildcards |

**Results**:
- **Before**: 2,054 routes (6 over limit)
- **After**: 1,653 routes
- **Net Savings**: 401 routes
- **Headroom**: 395 routes to spare

**File Modified**: `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` (-879 lines, +140 lines)

**Technical Notes**:
- Wildcards use Next.js path segment matching (`:slug*`)
- Exceptions that don't follow patterns (like `convert-to-inferred` redirects) preserved as individual entries
- Deprecated URLs were already commented out in original file (not active redirects)

## Files Changed

- `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - Consolidated from 1,073 to 710 entries
