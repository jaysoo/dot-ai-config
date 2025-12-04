# Summary - 2025-11-28

## Completed Tasks

### NXC-3541: Remove NODE_OPTIONS Flag and Add Jest Config CJS Migration

Fixed Node.js v24 compatibility issue where `--no-experimental-strip-types` flag in NODE_OPTIONS caused errors ("not allowed in NODE_OPTIONS"). Also added migration to convert `jest.config.ts` files from ESM to CJS syntax.

**Changes:**
1. **Removed NODE_OPTIONS manipulation** from `@nx/jest/plugin` (`packages/jest/src/plugins/plugin.ts`)
   - Removed code that added `--no-experimental-strip-types` flag for Node v24+
   - This flag is no longer needed and was causing issues

2. **Created ESM→CJS migration** (`packages/jest/src/migrations/update-22-2-0/convert-jest-config-to-cjs.ts`)
   - Converts `export default { ... }` → `module.exports = { ... }`
   - Converts `import { x } from 'y'` → `const { x } = require('y')`
   - Uses tsquery for AST-based transformations
   - Guards:
     - Only runs if `@nx/jest/plugin` is registered in nx.json
     - Uses `findPluginForConfigFile` to respect include/exclude patterns
     - Warns (doesn't convert) for `type: module` projects
     - Warns (doesn't convert) for ESM-only features (import.meta, top-level await)

3. **Comprehensive test coverage** (`convert-jest-config-to-cjs.spec.ts`)
   - Export/import conversion scenarios
   - Plugin registration guards
   - Include/exclude pattern handling
   - ESM-only feature detection

**Migration Version:** 22.2.0-beta.2

**Commit:** `2454848fe3` on branch `NXC-3541`

---

### DOC-354: Update Blog Post Links to New Enterprise Paths

Fixed 18 broken internal links across 6 blog posts that were pointing to old `/powerpack` and `/docs/enterprise/powerpack/*` paths.

**Files Updated:**
- `docs/blog/2024-09-25-evolving-nx.md` (4 links)
- `docs/blog/2024-09-25-introducing-nx-powerpack.md` (5 links)
- `docs/blog/2025-02-06-hetzner-cloud-success-story.md` (2 links)
- `docs/blog/2025-02-17-monorepos-are-ai-future-proof.md` (3 links)
- `docs/blog/2025-07-17-polygraph-conformance.md` (3 links)
- `docs/blog/2025-11-14-monorepo-myths.md` (1 link)

**Path Mappings:**
| Old Path | New Path |
|----------|----------|
| `/powerpack` | `/enterprise` |
| `/docs/enterprise/powerpack` | `/docs/enterprise` |
| `/docs/enterprise/powerpack/owners` | `/docs/enterprise/owners` |
| `/docs/enterprise/powerpack/conformance` | `/docs/enterprise/conformance` |
| `/docs/enterprise/powerpack/publish-conformance-rules-to-nx-cloud` | `/docs/enterprise/publish-conformance-rules-to-nx-cloud` |
| `/docs/reference/powerpack/conformance` | `/docs/reference/conformance` |

**Commit:** `c742537178` on branch `DOC-354`
