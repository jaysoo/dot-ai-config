# Potential Edge Cases to Break v22 Migrations

## 1. JS Migration Edge Cases

### Test: Multiple configurations with deprecated options
```json
{
  "build": {
    "executor": "@nx/js:swc",
    "options": {
      "external": ["react"]
    },
    "configurations": {
      "production": {
        "external": ["react", "lodash"]
      },
      "development": {
        "external": ["react-dom"],
        "externalBuildTargets": ["build"]
      },
      "staging": {
        "externalBuildTargets": ["build-base"]
      }
    }
  }
}
```
**Question**: Does it handle ALL configurations or just production?

### Test: Non-array values
```json
{
  "external": "react",  // String instead of array
  "externalBuildTargets": "build"  // String instead of array
}
```

### Test: Nested in targetDefaults with multiple executors
```json
{
  "targetDefaults": {
    "@nx/js:swc": { "options": { "external": ["a"] } },
    "@nx/js:tsc": { "options": { "external": ["b"] } }
  }
}
```

## 2. React Webpack Migration Edge Cases

### Test: svgr with object value (not just boolean)
```javascript
withReact({
  svgr: {
    svgo: false,
    titleProp: true,
    ref: true
  }
})
```
**Expected**: Should add withSvgr() with these options passed through

### Test: Multiple withReact() calls
```javascript
module.exports = composePlugins(
  withNx(),
  withReact({ svgr: false }),
  withReact({ svgo: true }),  // Second call
  (config) => config
);
```

### Test: NxReactWebpackPlugin with multiple instances
```javascript
new NxReactWebpackPlugin({ svgr: true }),
new NxReactWebpackPlugin({ svgr: false }),
```

### Test: Different code styles
```javascript
// No semicolons, single quotes
module.exports = composePlugins(
  withNx(),
  withReact({
    svgr: false
  }),
  config => config
)
```

### Test: webpack.config.ts (TypeScript)
Does it handle TypeScript config files?

## 3. Next.js Migration Edge Cases

### Test: nx.svgr with object value
```javascript
const nextConfig = {
  nx: {
    svgr: {
      svgo: false,
      titleProp: true
    }
  }
};
```

### Test: Existing custom webpack function
```javascript
const nextConfig = {
  nx: { svgr: true },
  webpack: (config, options) => {
    // Custom webpack config already exists
    config.module.rules.push({ test: /\.md$/ });
    return config;
  }
};
```
**Question**: Does it preserve existing webpack function?

### Test: next.config.ts (TypeScript)
```typescript
import type { NextConfig } from 'next';
const config: NextConfig = {
  nx: { svgr: true }
};
export default config;
```

### Test: ESM export style
```javascript
export default composePlugins(...plugins)({
  nx: { svgr: true }
});
```

### Test: Multiple nx options
```javascript
const nextConfig = {
  nx: {
    svgr: true,
    otherOption: 'value',
    customConfig: { foo: 'bar' }
  }
};
```
**Question**: Does it preserve other nx options?

## 4. Webpack/Rspack Migration Edge Cases

### Test: Options in multiple configurations
```json
{
  "build": {
    "executor": "@nx/webpack:webpack",
    "options": {
      "deleteOutputPath": true
    },
    "configurations": {
      "production": {
        "deleteOutputPath": false,
        "sassImplementation": "sass"
      },
      "development": {
        "sassImplementation": "node-sass"
      }
    }
  }
}
```

### Test: Options in multiple targets
```json
{
  "build": {
    "executor": "@nx/webpack:webpack",
    "options": { "deleteOutputPath": true }
  },
  "build-custom": {
    "executor": "@nx/webpack:webpack",
    "options": { "deleteOutputPath": true }
  }
}
```

### Test: String value for sassImplementation
```json
{
  "sassImplementation": "require('sass')"  // Function call as string
}
```

## 5. Release Version Config Migration Edge Cases

### Test: Unknown/custom generatorOptions properties
```json
{
  "release": {
    "version": {
      "generatorOptions": {
        "specifierSource": "prompt",
        "customProperty": "value",
        "anotherCustomProp": { "nested": "object" }
      }
    }
  }
}
```
**Question**: Does it preserve unknown properties or drop them?

### Test: packageRoot as array
```json
{
  "generatorOptions": {
    "packageRoot": ["dist/{projectName}", "build/{projectName}"]
  }
}
```

### Test: Both nx.json and project.json have release config
Set up release config in both files - does it migrate both?

### Test: preserveLocalDependencyProtocols as string
```json
{
  "generatorOptions": {
    "preserveLocalDependencyProtocols": "true"  // String not boolean
  }
}
```

### Test: Install options with non-standard values
```json
{
  "generatorOptions": {
    "skipLockFileUpdate": "yes",  // String instead of boolean
    "installArgs": ["--flag1", "--flag2"],  // Array instead of string
    "installIgnoreScripts": 1  // Number instead of boolean
  }
}
```

### Test: Nested in release group AND top-level
```json
{
  "release": {
    "version": {
      "generatorOptions": { "versionPrefix": "v" }
    },
    "groups": {
      "group1": {
        "version": {
          "generatorOptions": { "versionPrefix": "release-" }
        }
      }
    }
  }
}
```

## 6. Release Tag Consolidation Migration Edge Cases

### Test: Both flat and nested properties exist
```json
{
  "release": {
    "releaseTagPattern": "v{version}",  // Flat
    "releaseTag": {
      "pattern": "release-{version}",  // Nested - conflicts!
      "checkAllBranchesWhen": true
    }
  }
}
```
**Question**: Which wins? Does it merge or error?

### Test: Partial migration (some properties already nested)
```json
{
  "release": {
    "releaseTagPattern": "v{version}",  // Still flat
    "releaseTag": {
      "checkAllBranchesWhen": true  // Already nested
    }
  }
}
```

### Test: Non-boolean values
```json
{
  "releaseTagPatternCheckAllBranchesWhen": "true",  // String
  "releaseTagPatternRequireSemver": 1,  // Number
  "releaseTagPatternPreferDockerVersion": "false"  // String
}
```

### Test: Unknown releaseTagPattern* properties
```json
{
  "releaseTagPattern": "v{version}",
  "releaseTagPatternCustom": "value",
  "releaseTagPatternAnotherOne": true
}
```

## Recommended Testing Priority

**High Priority** (most likely to break):
1. React webpack with svgr object value (not boolean)
2. Next.js with existing webpack function
3. Release tag with both flat and nested properties
4. Release version with unknown/custom properties
5. JS migration with non-array values

**Medium Priority**:
6. Multiple configurations (all migrations)
7. TypeScript config files (.ts)
8. ESM export styles (Next.js)
9. Both nx.json and project.json configs (release)

**Low Priority** (migrations probably handle these):
10. Different code styles
11. Multiple instances of same pattern
12. String values instead of expected types
