# Top 10 AI-Suitable Nx Issues

## 1. Issue #29813
- **Title**: Running multiple nx targets simultaneously causes Nx daemon to shut down
- **URL**: https://github.com/nrwl/nx/issues/29813
- **Score**: 28
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Categories**: performance, simpleDocs
- **Core Contributors**: FrozenPandaz, AgentEnder
  - ✅ Provided guidance
- **Action Items**:
  - Type: investigate
    - Add console.log timing to packages/core/src/plugins/plugin.ts
    - Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false
    - Delete .nx/workspace-data before testing
    - Identify bottleneck from timing logs
  - Type: implement
    - Note: Follow core contributor guidance in comments

## 2. Issue #28322
- **Title**: [NX 20] Problems with empty workspace
- **URL**: https://github.com/nrwl/nx/issues/28322
- **Score**: 21
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Categories**: performance, deprecation
- **Core Contributors**: leosvelperez, leosvelperez, jaysoo, jaysoo, jaysoo, jaysoo
  - ✅ Provided guidance
- **Action Items**:
  - Type: investigate
    - Add console.log timing to packages/core/src/plugins/plugin.ts
    - Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false
    - Delete .nx/workspace-data before testing
    - Identify bottleneck from timing logs
  - Type: implement
    - Note: Follow core contributor guidance in comments

## 3. Issue #27900
- **Title**: Warning about outdated JSX transform being used for Next.js apps with React 19
- **URL**: https://github.com/nrwl/nx/issues/27900
- **Score**: 21
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Categories**: performance, deprecation
- **Core Contributors**: ndcunningham, ndcunningham
  - ✅ Provided guidance
- **Action Items**:
  - Type: investigate
    - Add console.log timing to packages/core/src/plugins/plugin.ts
    - Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false
    - Delete .nx/workspace-data before testing
    - Identify bottleneck from timing logs
  - Type: implement
    - Note: Follow core contributor guidance in comments

## 4. Issue #26936
- **Title**: tasks-runner component doesn't validate sock path
- **URL**: https://github.com/nrwl/nx/issues/26936
- **Score**: 21
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Categories**: performance, deprecation
- **Core Contributors**: MaxKless, MaxKless, MaxKless
  - ✅ Provided guidance
- **Action Items**:
  - Type: investigate
    - Add console.log timing to packages/core/src/plugins/plugin.ts
    - Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false
    - Delete .nx/workspace-data before testing
    - Identify bottleneck from timing logs
  - Type: implement
    - Note: Follow core contributor guidance in comments

## 5. Issue #29384
- **Title**: Have more clear Docker documentation
- **URL**: https://github.com/nrwl/nx/issues/29384
- **Score**: 20
- **Priority**: HIGH
- **AI Suitability**: HIGH
- **Categories**: performance, simpleDocs
- **Core Contributors**: isaacplmann, isaacplmann
- **Action Items**:
  - Type: investigate
    - Add console.log timing to packages/core/src/plugins/plugin.ts
    - Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false
    - Delete .nx/workspace-data before testing
    - Identify bottleneck from timing logs

## 6. Issue #29358
- **Title**: `@nx/esbuild 20.2.2` depends on a very old esbuild version `unmet peer esbuild@~0.19.2: found 0.24.0`
- **URL**: https://github.com/nrwl/nx/issues/29358
- **Score**: 18
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Categories**: deprecation
- **Core Contributors**: Coly010
  - ✅ Provided guidance
- **Action Items**:
  - Type: implement
    - Note: Follow core contributor guidance in comments

## 7. Issue #31574
- **Title**: Need to clarify how gitignore would affect nx inputs
- **URL**: https://github.com/nrwl/nx/issues/31574
- **Score**: 17
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Categories**: simpleDocs
- **Core Contributors**: FrozenPandaz

## 8. Issue #30163
- **Title**: Missing basic nx release/publish documentation
- **URL**: https://github.com/nrwl/nx/issues/30163
- **Score**: 17
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Categories**: simpleDocs
- **Core Contributors**: isaacplmann, isaacplmann

## 9. Issue #30058
- **Title**: Supplemental addition for troubleshooting global installs of nx
- **URL**: https://github.com/nrwl/nx/issues/30058
- **Score**: 17
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Categories**: simpleDocs
- **Core Contributors**: isaacplmann

## 10. Issue #31484
- **Title**: Rust error (application panicked) when launching NX commands within a git hook using lefthook
- **URL**: https://github.com/nrwl/nx/issues/31484
- **Score**: 10
- **Priority**: MEDIUM
- **AI Suitability**: HIGH
- **Categories**: deprecation
- **Core Contributors**: AgentEnder

