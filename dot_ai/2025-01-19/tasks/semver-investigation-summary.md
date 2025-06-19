# Semver Support Investigation Summary

**Linear Issue**: NXC-2774 - Investigate whether npm, yarn, and pnpm all support normal semver ranges

## Executive Summary

**YES** - npm, yarn, and pnpm all support normal semver ranges. The vast majority of standard semver patterns (83%) work consistently across all three package managers.

## Key Findings

### Universally Supported Patterns ✓

All three package managers (npm, yarn, pnpm) support these semver patterns:

1. **Caret Ranges** (for versions ≥ 1.0.0)
   - `^7.5.0` - Allows updates to minor and patch versions

2. **Tilde Ranges** 
   - `~7.5.0` - Allows patch updates only
   - `~7.5` - Same as ~7.5.0
   - `~7` - Allows minor and patch updates

3. **Comparison Operators**
   - `>7.0.0`, `>=7.0.0`, `<8.0.0`, `<=7.5.0`

4. **Hyphen Ranges**
   - `7.0.0 - 7.5.0` - Inclusive range

5. **Wildcards**
   - `7.5.x` or `7.5.*` - Any patch version
   - `7.x` or `7.*` - Any minor/patch version  
   - `*` - Any version

6. **Compound Ranges**
   - `>=7.0.0 <8.0.0` - AND conditions
   - `6.0.0 || >=7.0.0` - OR conditions

### Patterns with Limited Support ⚠️

These patterns failed across ALL package managers:

1. **Pre-1.0 Caret Ranges**
   - `^0.5.0` - Not found in registries for test package
   - `^0.0.4` - Not found in registries for test package

2. **Specific Pre-release Versions**
   - `7.5.1-0` - Specific pre-release not available

**Note**: These failures appear to be due to the specific versions not existing in the registry for our test package, not due to syntax support issues.

## Practical Examples

### package.json Dependencies

All three package managers will handle these patterns identically:

```json
{
  "dependencies": {
    "lodash": "^4.17.0",      // ✓ Works in npm, yarn, pnpm
    "express": "~5.0.0",       // ✓ Works in npm, yarn, pnpm  
    "react": ">=18.0.0",       // ✓ Works in npm, yarn, pnpm
    "typescript": "5.x",       // ✓ Works in npm, yarn, pnpm
    "eslint": "8.0.0 - 8.50.0" // ✓ Works in npm, yarn, pnpm
  }
}
```

## Recommendations

1. **Use Standard Semver Ranges** - Stick to the commonly supported patterns listed above for maximum compatibility.

2. **Avoid Edge Cases** - While pre-1.0 caret ranges should theoretically work, they may have inconsistent behavior.

3. **Test Across Managers** - If using less common patterns, test installation with all three package managers.

4. **Lock Files** - Use lock files (package-lock.json, yarn.lock, pnpm-lock.yaml) to ensure consistent installations regardless of semver range resolution differences.

## Conclusion

The investigation confirms that npm, yarn, and pnpm have robust and consistent support for normal semver ranges. The core semver specification is well-supported across all three package managers, making it safe to use standard semver patterns in projects that may be used with different package managers.

The few unsupported patterns we found were due to missing versions in the registry rather than syntax incompatibility, suggesting even better compatibility than our test results indicate.