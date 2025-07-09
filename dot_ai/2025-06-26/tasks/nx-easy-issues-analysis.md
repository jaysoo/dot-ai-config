# Nx Easy Issues Analysis

Generated: 2025-06-26T19:55:39.858Z

## Summary

- **Total actionable issues**: 148
- **High AI suitability**: 117
- **Core team involved**: 65

## Top 10 Issues for AI Resolution


### 1. Issue #29813: Running multiple nx targets simultaneously causes Nx daemon to shut down
- **URL**: https://github.com/nrwl/nx/issues/29813
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Score**: 28
- **Categories**: performance, simpleDocs, configFix
- **Core Involvement**: Yes
- **Action Items**:
  - investigate: Add console.log timing to packages/core/src/plugins/plugin.ts; Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false; Delete .nx/workspace-data before testing; Identify bottleneck from timing logs
  - implement: Follow core contributor guidance in comments
  - fix: Search for the incorrect text in docs/; Make the correction; Ensure consistency across related docs

### 2. Issue #26936: tasks-runner component doesn't validate sock path
- **URL**: https://github.com/nrwl/nx/issues/26936
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Score**: 28
- **Categories**: performance, deprecation
- **Core Involvement**: Yes
- **Action Items**:
  - investigate: Add console.log timing to packages/core/src/plugins/plugin.ts; Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false; Delete .nx/workspace-data before testing; Identify bottleneck from timing logs
  - implement: Follow core contributor guidance in comments

### 3. Issue #29358: `@nx/esbuild 20.2.2` depends on a very old esbuild version `unmet peer esbuild@~0.19.2: found 0.24.0`
- **URL**: https://github.com/nrwl/nx/issues/29358
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 25
- **Categories**: deprecation
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 4. Issue #31648: [readCachedProjectGraph] ERROR: No cached ProjectGraph is available
- **URL**: https://github.com/nrwl/nx/issues/31648
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix, investigation
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 5. Issue #31371: NX   Failed to process project graph.  3 errors occurred while processing files for the @nx/eslint/plugin plugin (Defined at nx.json#plugins[5]) .   - eslint.config.mjs: Cannot find module 'eslint-plugin-import' Require stack:
- **URL**: https://github.com/nrwl/nx/issues/31371
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 6. Issue #31188: Unable to find local plugin [] Map(0) {}
- **URL**: https://github.com/nrwl/nx/issues/31188
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix, investigation
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 7. Issue #31097: Cannot run tests with Jest Runner in VSCode in new repo
- **URL**: https://github.com/nrwl/nx/issues/31097
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 8. Issue #31082: TypeError: Cannot read properties of undefined (reading 'exists')
- **URL**: https://github.com/nrwl/nx/issues/31082
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 9. Issue #30461: U can't add playwright to existing project
- **URL**: https://github.com/nrwl/nx/issues/30461
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments

### 10. Issue #30305: Rspack bug from version higher than 20.1.4 to latest - Could not find ${fileToRun}. Make sure your build succeeded.
- **URL**: https://github.com/nrwl/nx/issues/30305
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Score**: 18
- **Categories**: configFix
- **Core Involvement**: Yes
- **Action Items**:
  - implement: Follow core contributor guidance in comments


## Full Analysis

See `/tmp/nx-issues-analysis-v2.json` for complete results.
