# ESM Import Migration Plan

## Goal

Migrate Nx packages with `import x = require('y')` syntax to ESM-compatible imports while maintaining both CJS and ESM output.

## Background

During the dual CJS/ESM compilation hackday, we successfully enabled ESM builds for 3 packages (docker, gradle, maven). The remaining ~35 packages fail with TS1202 errors due to `import x = require('y')` syntax, which is incompatible with ESM module output.

**Example error:**
```
error TS1202: Import assignment cannot be used when targeting ECMAScript modules.
```

**Example problematic code** (`packages/eslint/src/generators/utils/eslint-file.ts:47`):
```typescript
import ts = require('typescript');
```

## Affected Packages

Packages with direct `import = require` usage (~18):
- angular, cypress, eslint, jest, next, node, react, remix, storybook, vite, webpack, workspace, and others

Additional packages excluded due to transitive tsconfig references.

## Migration Strategy

### Step 1: Update Base TypeScript Configuration

Add interop settings to `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**Why both?**
- `esModuleInterop`: Generates helper code for CJS/ESM interop at runtime
- `allowSyntheticDefaultImports`: Allows `import x from 'y'` even when module has no default export (type-checking only)

### Step 2: Convert Import Syntax

Transform `import x = require('y')` to standard ES imports:

| Original | Replacement | Use When |
|----------|-------------|----------|
| `import ts = require('typescript')` | `import * as ts from 'typescript'` | Module exports multiple named exports |
| `import foo = require('foo')` | `import foo from 'foo'` | Module has default export |
| `import { bar } = require('baz')` | `import { bar } from 'baz'` | Only need specific exports |

**Decision criteria:**
- Check what the module actually exports
- For TypeScript, use `import * as ts from 'typescript'` (namespace import)
- For most npm packages with default exports, use `import x from 'x'`

### Step 3: Handle Edge Cases

#### 3a. Dynamic Requires
```typescript
// Original
const pkg = require(dynamicPath);

// Keep as-is for CJS, or use dynamic import for ESM
const pkg = await import(dynamicPath);
```

#### 3b. Conditional Requires
```typescript
// Original
let ts;
try {
  ts = require('typescript');
} catch {}

// Convert to dynamic import
let ts;
try {
  ts = await import('typescript');
} catch {}
```

#### 3c. JSON Imports
```typescript
// Original
import schema = require('./schema.json');

// Convert with assertion
import schema from './schema.json' assert { type: 'json' };
// Or for broader compatibility
import schema from './schema.json' with { type: 'json' };
```

### Step 4: Verify Both Outputs Work

For each migrated package:

1. **Build CJS**: `nx build <package>` - verify `dist/packages/<package>/*.js` works
2. **Build ESM**: `nx build-esm <package>` - verify `dist/packages/<package>/esm/*.js` works
3. **Test CJS import**: Create test file with `require('@nx/<package>')`
4. **Test ESM import**: Create test file with `import ... from '@nx/<package>'`

Example test script (`test-dual-imports.mjs`):
```javascript
// Test ESM
import { something } from './dist/packages/eslint/esm/index.js';
console.log('ESM import works:', typeof something);

// Test CJS (dynamic import of CJS)
const cjs = await import('./dist/packages/eslint/index.js');
console.log('CJS import works:', typeof cjs.something);
```

## Migration Order (Recommended)

Start with packages that have minimal `import = require` usage:

1. **vitest** - Already confirmed NO problematic patterns, just re-enable
2. **rollup** - Likely minimal usage
3. **esbuild** - Likely minimal usage
4. **vite** - May have more usage but commonly ESM-first
5. **eslint** - Known `import ts = require('typescript')`
6. **jest** - Likely has several
7. **webpack** - Likely has several
8. **react/next/angular** - Higher complexity, do later

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking CJS consumers | Run full test suite after each package migration |
| Runtime behavior changes with `esModuleInterop` | Test actual module loading, not just types |
| Transitive dependency issues | Migrate in dependency order (leaf packages first) |
| JSON import assertions not supported everywhere | Use conditional logic or build-time transformation |

## Estimated Effort

- **Per package**: 30-60 minutes depending on number of imports to convert
- **Total packages**: ~18 with direct usage + dependencies
- **Testing overhead**: ~15 minutes per package

## Implementation Progress (2025-12-05)

### Completed Steps

1. [x] **Enabled `esModuleInterop` in `tsconfig.base.json`**
2. [x] **Converted `import = require` patterns across all packages** (~51 files)
3. [x] **Created `tsconfig.esm.json` for all 40 packages**
4. [x] **Built both CJS and ESM outputs successfully**
5. [x] **Published to local verdaccio** (nx@23.0.0-esm.4, @nx/devkit@23.0.0-esm.4)

### Key Configuration

**tsconfig.esm.json pattern** (working config):
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "../../dist/packages/PACKAGE/esm",
    "module": "ESNext",
    "moduleResolution": "node",
    "types": ["node"],
    "tsBuildInfoFile": "../../dist/packages/PACKAGE/esm/tsconfig.tsbuildinfo"
  },
  "include": ["**/*.ts", "**/*.json", "migrations.json"],
  "exclude": ["**/*.spec.ts", "**/*_spec.ts", "jest.config.ts", "**/__fixtures__/**/*.*"]
}
```

**package.json exports field**:
```json
"exports": {
  ".": {
    "import": "./esm/src/index.js",
    "require": "./src/index.js",
    "types": "./src/index.d.ts"
  },
  "./src/*": {
    "import": "./esm/src/*.js",
    "require": "./src/*.js"
  },
  "./*": "./*"
}
```

### Post-Build Fix Script

Created `scripts/fix-esm-imports.js` to handle ESM runtime issues:

1. **Copy native files** - Native JS files (index.js, native-bindings.js, etc.) to ESM output
2. **Fix .js extensions** - Add missing `.js` extensions for directory imports
3. **Fix JSON imports** - Convert JSON imports to `createRequire` pattern
4. **Fix CJS named imports** - Convert `import { x } from 'pkg'` to `import pkg from 'pkg'; const { x } = pkg;` for CJS-only packages (tmp, enquirer, ora, figures, cli-cursor, cli-spinners)

### Remaining Issues (for next session)

Current test at `/tmp/test-nx-esm` with v23.0.0-esm.4 needs further testing:
- Run `node test-esm.mjs` to check for additional CJS interop issues
- May need to add more packages to the CJS fix list
- Some deep imports may still have issues

### Files Modified

- `tsconfig.base.json` - Added esModuleInterop
- `nx.json` - Added build-esm targets
- All 40 `packages/*/tsconfig.esm.json` - Created
- All 40 `packages/*/project.json` - Added build-esm target
- ~51 files across packages - Converted `import = require` patterns
- `scripts/fix-esm-imports.js` - Post-build fix script

### Test Environment

- Local verdaccio on port 4873
- Test project: `/tmp/test-nx-esm` with `"type": "module"`
- Test script: `test-esm.mjs` with dynamic imports

## References

- [TypeScript ESM Support](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- [esModuleInterop deep dive](https://www.typescriptlang.org/tsconfig#esModuleInterop)
- Today's hackday work: `.ai/2025-12-05/SUMMARY.md`
