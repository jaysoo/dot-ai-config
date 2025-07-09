# Top 15 AI-Suitable Nx Issues (2023-2025)

Generated: 2025-06-27

## Summary
These 15 issues have been selected based on:
- Clear requirements and reproduction steps
- High AI suitability scores
- Core team involvement or guidance
- Isolated changes that won't break architecture

---

## 1. Issue #19519: nx Typescript generator "Cannot use import statement outside a module"
- **URL**: https://github.com/nrwl/nx/issues/19519
- **Score**: 30 (Highest)
- **Categories**: Simple docs fix, deprecation, migration, CLI error
- **Core team involved**: Yes
- **Action**: Update TypeScript generator configuration to properly handle module types

## 2. Issue #29813: Running multiple nx targets simultaneously causes Nx daemon to shut down
- **URL**: https://github.com/nrwl/nx/issues/29813
- **Score**: 28
- **Categories**: Performance, simple docs, CLI error
- **Core team involved**: Yes
- **Action**: Fix daemon process management for concurrent executions

## 3. Issue #31082: TypeError: Cannot read properties of undefined (reading 'exists')
- **URL**: https://github.com/nrwl/nx/issues/31082
- **Score**: 26
- **Categories**: Type error, CLI error
- **Core team involved**: Yes
- **Action**: Add null checks for file system operations

## 4. Issue #30461: Can't add playwright to existing project
- **URL**: https://github.com/nrwl/nx/issues/30461
- **Score**: 26
- **Categories**: Type error, CLI error
- **Core team involved**: Yes
- **Action**: Fix Playwright generator to handle existing project configurations

## 5. Issue #28410: Migration to 20 - Cannot read properties of undefined (reading 'cli')
- **URL**: https://github.com/nrwl/nx/issues/28410
- **Score**: 26
- **Categories**: Performance, type error, migration, CLI error
- **Core team involved**: Yes
- **Action**: Fix migration script to handle missing CLI configuration

## 6. Issue #28404: Nest Library generation fails in v20.0.0
- **URL**: https://github.com/nrwl/nx/issues/28404
- **Score**: 26
- **Categories**: Type error, CLI error
- **Core team involved**: Yes
- **Action**: Update Nest library generator for v20 compatibility

## 7. Issue #29940: The "@nx/angular:application" generator doesn't support existing TypeScript setup
- **URL**: https://github.com/nrwl/nx/issues/29940
- **Score**: 23
- **Categories**: Type error, migration, CLI error
- **Action**: Update Angular generator to detect and respect existing TS configs

## 8. Issue #29618: NX project graph calculation hanging indefinitely
- **URL**: https://github.com/nrwl/nx/issues/29618
- **Score**: 23
- **Categories**: Performance, type error, migration, CLI error
- **Action**: Add timeout and circular dependency detection to graph calculation

## 9. Issue #27816: Vitest fails on CI with workspace generators >19.0.0
- **URL**: https://github.com/nrwl/nx/issues/27816
- **Score**: 23
- **Categories**: Type error, migration
- **Action**: Fix workspace generator compatibility with Vitest in CI environments

## 10. Issue #26510: NextJS Turbopack fails to compile
- **URL**: https://github.com/nrwl/nx/issues/26510
- **Score**: 23
- **Categories**: Type error, migration, CLI error
- **Action**: Update Next.js executor to properly configure Turbopack

## 11. Issue #31648: [readCachedProjectGraph] ERROR: No cached ProjectGraph is available
- **URL**: https://github.com/nrwl/nx/issues/31648
- **Score**: 23
- **Categories**: Migration, CLI error
- **Assignee**: AgentEnder
- **Action**: Ensure project graph is created before reading cache in parallel executions

## 12. Issue #31188: Unable to find local plugin [] Map(0) {}
- **URL**: https://github.com/nrwl/nx/issues/31188
- **Score**: 23
- **Categories**: Migration
- **Action**: Fix local plugin resolution logic

## 13. Issue #30292: NX + NestJS + webpack -> rspack migration issues
- **URL**: https://github.com/nrwl/nx/issues/30292
- **Score**: 23
- **Categories**: Migration
- **Action**: Add rspack configuration support for NestJS projects

## 14. Issue #29853: @nx/dependency-checks: add option for transitive dependency satisfaction
- **URL**: https://github.com/nrwl/nx/issues/29853
- **Score**: 23
- **Categories**: Migration
- **Action**: Implement new option for dependency-checks executor

## 15. Issue #30058: Supplemental addition for troubleshooting global installs of nx
- **URL**: https://github.com/nrwl/nx/issues/30058
- **Score**: 22
- **Categories**: Simple docs, migration
- **Action**: Add troubleshooting section to documentation about global Nx installations

---

## Implementation Priority

### Immediate (High AI Suitability + Clear Fix):
1. #19519 - TypeScript module error
2. #31082 - Undefined reading 'exists'
3. #30461 - Playwright generator fix
4. #30058 - Documentation update

### Medium Priority (Requires Investigation):
5. #29813 - Daemon shutdown issue
6. #31648 - Cached project graph error
7. #29618 - Graph calculation hanging
8. #28410 - Migration CLI error

### Complex (Needs Design Consideration):
9. #26510 - Turbopack configuration
10. #30292 - Rspack migration support
11. #29853 - Dependency checks enhancement

---

## Next Steps

To work on any of these issues:
1. Use `gh issue view [NUMBER]` to see full details
2. Clone any reproduction repos to `./tmp/claude/repro-[NUMBER]`
3. Create a branch: `git checkout -b fix/issue-[NUMBER]`
4. Run `nx prepush` before submitting PR
5. Include "Fixes #[NUMBER]" in PR description