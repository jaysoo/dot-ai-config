# Add Port Option to @nx/react:application Generator

## Task Type
**Enhancement** - Adding a new configuration option to existing React application generator

## Overview
Add a `--port` option to the `@nx/react:application` generator that allows users to specify a custom port number for their development server instead of using the default ports (4200 for Vite, 4300 for Webpack/Rspack).

## Current Behavior Analysis
Based on code review:
- Vite applications default to port 4200 (hardcoded in `packages/vite/src/utils/generator-utils.ts` lines 504-506)
- Webpack/Rspack applications don't have explicit port configuration in the generators
- Port configuration flows from React generator → Configuration generators → Generated config files

## Implementation Plan

### Phase 1: Update React Application Generator Schema
**Goal:** Add `--port` option to the React application generator

#### Step 1.1: Update React Generator Schema
- [ ] Update `packages/react/src/generators/application/schema.json`
- [ ] Add `port` property with appropriate validation
- [ ] Update TypeScript interface in `packages/react/src/generators/application/schema.d.ts`

**Schema addition:**
```json
{
  "port": {
    "type": "number",
    "description": "The port to use for the development server",
    "x-prompt": "Which port would you like to use for the dev server?",
    "default": 4200
  }
}
```

#### Step 1.2: Pass Port to Configuration Generators
- [ ] Update `packages/react/src/generators/application/application.ts`
- [ ] Pass the port option when calling vite/webpack/rspack configuration generators

CRITICAL: ensure the port option is also added to schema.json, schema interface, etc. of the vite/webpack/rspack generators when you update them later!

### Phase 2: Update Vite Configuration Generator
**Goal:** Use custom port in Vite configuration

#### Step 2.1: Update Vite Configuration Schema
- [ ] Update `packages/vite/src/generators/configuration/schema.json`
- [ ] Add `port` property
- [ ] Update TypeScript interface in `packages/vite/src/generators/configuration/schema.d.ts`

#### Step 2.2: Update ViteConfigFileOptions Interface
- [ ] Modify `packages/vite/src/utils/generator-utils.ts`
- [ ] Add `port?: number` to the `ViteConfigFileOptions` interface (line 369)

#### Step 2.3: Update createOrEditViteConfig Function
- [ ] Modify the `createOrEditViteConfig` function in `packages/vite/src/utils/generator-utils.ts`
- [ ] Update the `devServerOption` to use the custom port (lines 499-506)
- [ ] Pass port through to the config generation

**Expected changes:**
```typescript
const devServerOption = onlyVitest
  ? ''
  : options.includeLib
  ? ''
  : `  server:{
    port: ${options.port ?? 4200},
    host: 'localhost',
  },`;
```

#### Step 2.4: Update Configuration Generator
- [ ] Modify `packages/vite/src/generators/configuration/configuration.ts`
- [ ] Pass the port option to `createOrEditViteConfig`

### Phase 3: Update Webpack Configuration Generator
**Goal:** Use custom port in Webpack configuration

#### Step 3.1: Update Webpack Configuration Schema
- [ ] Update `packages/webpack/src/generators/configuration/schema.json`
- [ ] Add `port` property
- [ ] Update TypeScript interface

#### Step 3.2: Update Webpack Config Generation
- [ ] Modify `packages/webpack/src/generators/configuration/configuration.ts`
- [ ] Update generated webpack config to include port in devServer configuration
- [ ] Ensure the serve target passes the port to the dev-server executor

**Expected webpack.config.js changes:**
```javascript
devServer: {
  port: <%= port ?? 4200 %>,
  host: 'localhost',
}
```

### Phase 4: Update Rspack Configuration Generator
**Goal:** Use custom port in Rspack configuration

#### Step 4.1: Update Rspack Configuration Schema
- [ ] Update `packages/rspack/src/generators/configuration/schema.json`
- [ ] Add `port` property
- [ ] Update TypeScript interface

#### Step 4.2: Implement Port Configuration in Rspack
- [ ] Update Rspack configuration generator
- [ ] Modify the generated rspack configuration
- [ ] Ensure compatibility with Rspack's devServer configuration

### Phase 5: Testing & Documentation
**Goal:** Ensure the feature works correctly and is documented

#### Step 5.1: Add Unit Tests
- [ ] Test React generator with port option
- [ ] Test Vite configuration with custom port
- [ ] Test Webpack configuration with custom port
- [ ] Test Rspack configuration with custom port
- [ ] Test edge cases (invalid ports, port conflicts)

#### Step 5.2: Add E2E Tests
- [ ] Add port test to `e2e/react/src/react-vite.test.ts`
- [ ] Add port test to `e2e/react/src/react-rspack.test.ts`
- [ ] Add port test to `e2e/react/src/react-webpack.test.ts`
- [ ] Each test should:
  - Generate an app with a custom port
  - Verify the config file contains the correct port
  - Optionally verify the dev server starts on that port

#### Step 5.3: Update Documentation
- [ ] Update generator documentation to include the new `--port` option
- [ ] Add examples in the schema's examplesFile

## Testing Script
Create a script to test the implementation:

```javascript
// .ai/2025-06-11/tasks/test-port-option.mjs
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testPortOption() {
  const testCases = [
    { bundler: 'vite', port: 3000 },
    { bundler: 'webpack', port: 8080 },
    { bundler: 'rspack', port: 5000 }
  ];

  for (const { bundler, port } of testCases) {
    console.log(`Testing ${bundler} with port ${port}...`);
    
    try {
      // Generate app
      await execAsync(`nx g @nx/react:application test-app-${bundler} --bundler=${bundler} --port=${port} --dry-run`);
      console.log(`✓ ${bundler} generator accepts port option`);
      
      // TODO: Add actual file content verification
    } catch (error) {
      console.error(`✗ ${bundler} generator failed:`, error.message);
    }
  }
}

testPortOption();
```

## Reasoning & Considerations

1. **Default Behavior**: If no port is specified, the generators should continue using their current defaults
   - Vite: 4200
   - Webpack: 4200 (to be consistent)
   - Rspack: 4200 (to be consistent)

2. **Port Validation**: 
   - Valid range: 1-65535
   - Consider warning for privileged ports (< 1024)
   - No validation for port conflicts (let the dev server handle it)

3. **Configuration Flow**:
   - React generator receives port option
   - Passes it to the appropriate bundler configuration generator
   - Configuration generator generates the config file with the port

4. **Backwards Compatibility**: 
   - Port is optional, so existing workflows remain unchanged
   - No breaking changes to existing APIs

## Alternative Approaches Considered

1. **Environment Variable**: Use `NX_DEV_PORT` environment variable
   - Pros: More flexible, can be changed without regenerating
   - Cons: Less discoverable, not part of the generator API

2. **Post-generation Configuration**: Allow port configuration in `project.json`
   - Pros: Can be changed post-generation
   - Cons: Requires manual editing, less convenient

## Expected Outcome

When complete, developers should be able to:

```bash
# Generate a React app with Vite on port 3000
nx g @nx/react:application my-app --bundler=vite --port=3000

# Generate a React app with Webpack on port 8080
nx g @nx/react:application my-app --bundler=webpack --port=8080

# Generate a React app with Rspack on port 5000
nx g @nx/react:application my-app --bundler=rspack --port=5000
```

The generated applications should:
1. Have their bundler config files with the specified port
2. Start their development servers on the specified ports when running `nx serve my-app`
3. Work without any additional configuration

## CRITICAL: Success Criteria
- [ ] Generator accepts `--port` option without errors
- [ ] Vite apps use custom port in vite.config.ts
- [ ] Webpack apps use custom port in webpack.config.js
- [ ] Rspack apps use custom port in rspack.config.js
- [ ] All existing tests pass
- [ ] New tests for port functionality pass
- [ ] Documentation is updated
- [ ] No breaking changes to existing functionality


