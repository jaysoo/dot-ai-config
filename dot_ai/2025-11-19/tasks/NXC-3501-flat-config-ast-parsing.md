# Task Plan: NXC-3501 - Fix flat config JSON parsing for complex spread elements

## Issue Summary

**GitHub Issue**: https://github.com/nrwl/nx/issues/31796
**Linear Issue**: https://linear.app/nxdev/issue/NXC-3501

When running Nx generators (like `nx g @nx/plugin:plugin`), the ESLint flat config parsing fails with an `InvalidSymbol` error when the config contains spread elements that aren't simple identifiers.

### Reproduction
```js
// eslint.config.mjs
import jest from "eslint-plugin-jest";

export default [
    {
        files: ['**/*.spec.ts'],
        ...(jest.configs['flat/recommended'])  // ← This causes the error
    }
];
```

### Error
```
NX   InvalidSymbol in JSON at 4:9

  2 |     {
  3 |         "files":  ["**/*.spec.ts"],
> 4 |         ...(jest.configs["flat/recommended"])
    |         ^^^^^^^^^^^^^^^^
  5 |     }
```

### Additional Real-World Case: Variable References

Another common failure occurs when the config uses variable references instead of literals:

```js
// eslint.config.mjs
import pluginPackageJson from "eslint-plugin-package-json";
import jsoncParser from "jsonc-eslint-parser";

export default [
    {
        files: ["package.json"],
        plugins: { "package-json": pluginPackageJson },  // ← Variable reference
        languageOptions: {
            parser: jsoncParser,  // ← Variable reference
        },
    }
];
```

### Error
```
Error: InvalidSymbol in JSON at 4:35
  2 |     {
  3 |         "files":  ["package.json"],
> 4 |         "plugins":  { "package-json": pluginPackageJson },
    |                                       ^^^^^^^^^^^^^^^^^
  5 |         "languageOptions":  {
  6 |             "parser":  jsoncParser,
  7 |         },
```

The JSON parser fails because `pluginPackageJson` and `jsoncParser` are variable identifiers, not string literals wrapped in quotes.

## Root Cause Analysis

**File**: `packages/eslint/src/generators/utils/flat-config/ast-utils.ts`

### Problem Location

1. **Line 15** - `SPREAD_ELEMENTS_REGEXP`:
   ```ts
   const SPREAD_ELEMENTS_REGEXP = /\s*\.\.\.[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*,?\n?/g;
   ```
   Only matches simple patterns like `...foo` or `...foo.bar.baz`

2. **Lines 188-201** - `hasOverride` function:
   - Gets object source text with `node.getFullText()`
   - Strips spread elements using regex (incomplete)
   - Calls `parseTextToJson()` which fails on remaining complex spread syntax

3. **Lines 210-220** - `parseTextToJson` function:
   ```ts
   function parseTextToJson(text: string): any {
     return parseJson(
       text
         .replace(/'/g, '"')
         .replace(/\s([a-zA-Z0-9_]+)\s*:/g, ' "$1": ')
         // ... more replacements
     );
   }
   ```
   Expects valid JSON-like text but receives invalid spread syntax

### Patterns NOT Handled by Current Regex
- `...(jest.configs['flat/recommended'])` - parenthesized expression
- `...someFunction()` - function call
- `...obj['key']` - element access
- `...(config || {})` - logical expressions

## Solution Approach

Replace JSON parsing with AST-based property extraction using TypeScript compiler API.

### Why AST is Better
1. Handles any valid JavaScript expression
2. Only extracts properties with extractable literal values
3. Ignores complex expressions gracefully
4. More maintainable than regex-based approach

## Implementation Steps

### Step 1: Add failing unit tests (TDD)

Add tests to `packages/eslint/src/generators/utils/flat-config/ast-utils.spec.ts` that reproduce the reported failures:

```ts
describe('hasOverride', () => {
  it('should handle spread elements with parenthesized expressions', () => {
    const content = `
import jest from "eslint-plugin-jest";

export default [
    {
        files: ['**/*.spec.ts'],
        ...(jest.configs['flat/recommended'])
    }
];`;

    const result = hasOverride(content, (o) =>
      Array.isArray(o.files) && o.files.includes('**/*.spec.ts')
    );
    expect(result).toBe(true);
  });

  it('should handle variable references in property values', () => {
    const content = `
import pluginPackageJson from "eslint-plugin-package-json";
import jsoncParser from "jsonc-eslint-parser";

export default [
    {
        files: ["package.json"],
        plugins: { "package-json": pluginPackageJson },
        languageOptions: {
            parser: jsoncParser,
        },
    }
];`;

    const result = hasOverride(content, (o) =>
      Array.isArray(o.files) && o.files.includes('package.json')
    );
    expect(result).toBe(true);
  });

  it('should handle spread elements with function calls', () => {
    const content = `
export default [
    {
        files: ['*.ts'],
        ...getConfig()
    }
];`;

    const result = hasOverride(content, (o) =>
      Array.isArray(o.files) && o.files.includes('*.ts')
    );
    expect(result).toBe(true);
  });

  it('should handle spread elements with element access', () => {
    const content = `
export default [
    {
        files: ['*.json'],
        ...configs['recommended']
    }
];`;

    const result = hasOverride(content, (o) =>
      Array.isArray(o.files) && o.files.includes('*.json')
    );
    expect(result).toBe(true);
  });

  it('should extract rules property correctly', () => {
    const content = `
export default [
    {
        files: ['*.ts'],
        rules: {
          '@nx/enforce-module-boundaries': 'error'
        }
    }
];`;

    const result = hasOverride(content, (o) =>
      !!o.rules?.['@nx/enforce-module-boundaries']
    );
    expect(result).toBe(true);
  });
});
```

Run tests to confirm they fail:
```bash
nx run @nx/eslint:test --testFile=ast-utils.spec.ts
```

### Step 2: Create AST property extraction helper

Create a new function `extractPropertiesFromObjectLiteral`:

```ts
/**
 * Extracts property values from an ObjectLiteralExpression using AST.
 * Only extracts properties that have simple literal values.
 * Returns a partial object suitable for the lookup function.
 */
function extractPropertiesFromObjectLiteral(
  node: ts.ObjectLiteralExpression
): Partial<Linter.ConfigOverride<Linter.RulesRecord>> {
  const result: Partial<Linter.ConfigOverride<Linter.RulesRecord>> = {};

  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;

    const name = prop.name.getText().replace(/['"]/g, '');
    const value = extractLiteralValue(prop.initializer);

    if (value !== undefined) {
      result[name] = value;
    }
  }

  return result;
}
```

### Step 2: Create literal value extractor

```ts
/**
 * Extracts literal values from AST nodes.
 * Returns undefined for complex expressions that can't be statically evaluated.
 */
function extractLiteralValue(node: ts.Node): unknown {
  if (ts.isStringLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;

  if (ts.isArrayLiteralExpression(node)) {
    const arr: unknown[] = [];
    for (const element of node.elements) {
      const value = extractLiteralValue(element);
      if (value === undefined) return undefined;
      arr.push(value);
    }
    return arr;
  }

  if (ts.isObjectLiteralExpression(node)) {
    const obj: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        const name = prop.name.getText().replace(/['"]/g, '');
        const value = extractLiteralValue(prop.initializer);
        if (value === undefined) return undefined;
        obj[name] = value;
      } else if (ts.isSpreadAssignment(prop)) {
        // Cannot extract spread assignments statically
        continue;
      } else {
        return undefined;
      }
    }
    return obj;
  }

  // For complex expressions, return undefined
  return undefined;
}
```

### Step 3: Update `hasOverride` function

Modify the `hasOverride` function (lines 171-207) to use AST extraction:

```ts
export function hasOverride(
  content: string,
  lookup: (override: Linter.ConfigOverride<Linter.RulesRecord>) => boolean
): boolean {
  const source = ts.createSourceFile(
    '',
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  );
  const format = content.includes('export default') ? 'mjs' : 'cjs';
  const exportsArray =
    format === 'mjs' ? findExportDefault(source) : findModuleExports(source);
  if (!exportsArray) {
    return false;
  }
  for (const node of exportsArray) {
    if (isOverride(node)) {
      let data: Partial<Linter.ConfigOverride<Linter.RulesRecord>>;

      if (ts.isObjectLiteralExpression(node)) {
        // Use AST extraction instead of JSON parsing
        data = extractPropertiesFromObjectLiteral(node);
      } else {
        // Handle compat.config(...).map(...) pattern
        const arrowBody = node['expression'].arguments[0].body.expression;
        if (ts.isObjectLiteralExpression(arrowBody)) {
          data = extractPropertiesFromObjectLiteral(arrowBody);
        } else {
          continue;
        }
      }

      if (lookup(data as Linter.ConfigOverride<Linter.RulesRecord>)) {
        return true;
      }
    }
  }
  return false;
}
```

### Step 4: Update `replaceOverride` function

Apply similar changes to the `replaceOverride` function (lines 225-300). Note: `replaceOverride` also modifies content, so we need to keep the position tracking but use AST for extracting data.

### Step 5: Consider `addPatternsToFlatConfigIgnoresBlock`

Review usage of `parseTextToJson` at line 102 - this also needs the same fix for consistency.

### Step 6: Integration testing

Test with the original reproduction case to verify the fix works end-to-end:

```bash
# Create test workspace
npx create-nx-workspace@latest test-workspace --preset=ts

# Add problematic eslint config
# Run the generator
nx g @nx/plugin:plugin tools/test
```

## Files to Modify

1. **Tests (first)**: `packages/eslint/src/generators/utils/flat-config/ast-utils.spec.ts`
   - Add new test suite for `hasOverride` (failing tests first)
   - Cover spread patterns, variable references, and edge cases

2. **Implementation**: `packages/eslint/src/generators/utils/flat-config/ast-utils.ts`
   - Add `extractPropertiesFromObjectLiteral` function
   - Add `extractLiteralValue` function
   - Update `hasOverride` function
   - Update `replaceOverride` function
   - Review `addPatternsToFlatConfigIgnoresBlock`

## Testing Commands

```bash
# Run unit tests for the eslint package
nx run-many -t test,build,lint -p @nx/eslint

# Run affected tests
nx affected -t build,test,lint

# Run e2e tests if needed
nx affected -t e2e-local
```

## Verification Checklist

- [ ] Fix handles `...(plugin.configs['recommended'])` pattern
- [ ] Fix handles `...functionCall()` pattern
- [ ] Fix handles `...obj['key']` pattern
- [ ] Existing tests pass
- [ ] New tests added for edge cases
- [ ] `replaceOverride` also updated if needed
- [ ] No regressions in existing ESLint config manipulation
- [ ] Integration test with original reproduction passes

## Risk Assessment

**Low Risk**: This change is focused on improving robustness of existing functionality. The AST approach is more reliable than regex-based parsing.

**Potential Issues**:
- Edge cases with nested object literals
- Performance (should be negligible since AST is already created)

**Important Note**: If the function signature of `hasOverride` changes, update all invocations:
- `packages/eslint/src/generators/utils/eslint-file.ts` (line 367)
- `packages/plugin/src/generators/lint-checks/generator.ts` (lines 210, 245)
- `packages/js/src/generators/library/library.ts` (line 457)
- `packages/nuxt/src/utils/add-linting.ts` (lines 110, 136)
- `packages/angular/src/migrations/update-20-2-0/remove-angular-eslint-rules.ts` (line 65)
- `packages/angular/src/migrations/update-20-2-0/disable-angular-eslint-prefer-standalone.ts` (lines 25, 45)

The signature should remain `(content: string, lookup: Function) => boolean` - only the internal implementation changes.

## Alternative Approaches Considered

1. **Improve the regex** - Not viable, regex cannot handle all valid JS expressions
2. **Use a JS parser like Babel** - Overkill, TypeScript AST already available
3. **Use `eval()`** - Security risk, not viable

## Timeline Estimate

- Implementation: 1-2 hours
- Testing: 1 hour
- Review/refinement: 0.5 hours

Total: ~3 hours
