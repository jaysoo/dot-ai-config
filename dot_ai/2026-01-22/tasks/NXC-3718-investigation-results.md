# NXC-3718: Investigation Results - Slow @nx/jest Plugin with TS Configs

## Root Cause: CONFIRMED

**The slowness is caused by unique `paths` (or other non-normalized compiler options) in per-project `tsconfig.spec.json` files, which prevents transpiler registration caching.**

## Evidence

| Scenario | Time (500 configs) | Factor |
|----------|-------------------|--------|
| Shared tsconfig (all same) | 4.5s | 1x |
| Unique `paths` per project | 32s | **7x slower** |

Island's 100s for 574 configs is consistent with this finding plus additional overhead from their complex setup (deep import chains, many setupFilesAfterEnv, etc.).

## Technical Details

### The Caching Mechanism

In `packages/nx/src/plugins/js/utils/register.js`:

```javascript
function getTranspiler(compilerOptions, tsConfigRaw) {
  // These options GET normalized (don't affect cache key):
  compilerOptions.module = ts.ModuleKind.CommonJS;
  compilerOptions.moduleResolution = ts.ModuleResolutionKind.NodeJs;
  compilerOptions.target = ts.ScriptTarget.ES2021;
  delete compilerOptions.strict;
  // etc.

  // Registration key is JSON of remaining options:
  let registrationKey = JSON.stringify(compilerOptions);

  // Check cache
  if (registered.has(registrationKey)) {
    return registrationEntry.cleanup;  // Cache HIT - fast!
  }
  // Cache MISS - register new transpiler (slow)
}
```

### Options That DO Affect Cache Key (cause cache misses)

- `paths` - Different path mappings per project
- `baseUrl` - Different base URLs
- `rootDir` / `rootDirs` - Different root directories
- Any other options NOT explicitly normalized

### Options That DON'T Affect Cache Key (normalized away)

- `module`, `moduleResolution`, `target`, `lib`
- `strict`, `noImplicitAny`, `strictNullChecks`
- `outDir`, `declaration`, `composite`

## CPU Profile Analysis

Island's profile (`jest-plugin-graph-build.cpuprofile`) showed:

| Category | Hits | % of CPU |
|----------|------|----------|
| SWC transpilation | 253,183 | 29.9% |
| GC | 65,176 | 7.7% |
| File I/O | 56,078 | 6.6% |
| tsconfig-paths resolution | 44,337 | 5.2% |
| TypeScript operations | 38,165 | 4.5% |
| JSON5 parsing | 35,482 | 4.2% |

Key finding: **9,058 transformSync calls** for 574 configs = ~16 transpilations per config. This matches the pattern of each config triggering re-transpilation of shared imports due to cache misses.

## Solutions

### Immediate Fix (User-side)

1. **Consolidate `paths` in `tsconfig.base.json`** instead of per-project tsconfig files
2. **Use identical `tsconfig.spec.json`** across projects (just extend base with same options)

### Long-term Fix (Nx-side)

**Option A: Normalize more options in registration key**

```javascript
// In getTranspiler():
// Also normalize paths since they don't affect transpilation output
delete compilerOptions.paths;
delete compilerOptions.baseUrl;
delete compilerOptions.rootDir;
```

**Option B: Add plugin option to use root tsconfig**

```json
{
  "plugins": [{
    "plugin": "@nx/jest",
    "options": {
      "useRootTsConfig": true
    }
  }]
}
```

**Option C: Cache transpiled results separately from registration**

Instead of re-transpiling when the transpiler changes, cache the transpiled output by file content hash.

## Reproduction

```bash
# Setup test workspace
cd /tmp/jest1

# Fast (shared tsconfig): ~5s
node setup-shared-tsconfig.mjs
nx report

# Slow (unique paths): ~32s
node setup-varying-paths.mjs
nx report
```

## Files

- Test workspace: `/tmp/jest1`
- Island CPU profile: `/Users/jack/Downloads/jest-plugin-graph-build.cpuprofile`
- Setup scripts: `/tmp/jest1/setup-*.mjs`
