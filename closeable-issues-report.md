# Closeable Issues Report

**Generated**: 2025-12-16
**Assignee Reviewed**: @me (jaysoo)
**Total Issues Reviewed**: 22
**Issues Recommended for Closure**: 2

## Summary by Category
- Category 1 (Already Fixed): 0
- Category 2 (Underlying Tooling): 0
- Category 3 (User Config): 2

---

## Recommended for Closure

### Issue #28397: NX Cannot read properties of undefined (reading 'JsxEmit')
**URL**: https://github.com/nrwl/nx/issues/28397

**Category**: 3: User Config

**Confidence**: MEDIUM (relaxed criteria)

**Evidence**:
1. Multiple users in comments confirmed solution: upgrading TypeScript version fixes the issue
   - @DaveMBush: "Once I added the @nx/angular package which then told me my @swc-node/register, @swc/core, and typescript packages needed to be updated, the @nx/js:library schematic magically started working."
   - @JustinLivi: "Upgrading typescript to 5 resolved it for me"
   - @abarghoud: "the solution was to update typescript from 4.9.2 to 5.5.4"
   - @fcFn: "Upgrading to `latest` (as of this writing, `5.7.3`) solved the problem for me"
2. The error occurs when using outdated TypeScript versions that don't export the `JsxEmit` constant in the same way newer versions do

**Root Cause**: TypeScript API breaking changes between v4 and v5. The `ts.server.protocol` API changed, causing undefined errors with older TS versions.

**Suggested Response Template**:
> This issue appears to be related to TypeScript version compatibility. Multiple users have confirmed that upgrading to TypeScript 5.x resolves the error.
>
> The `JsxEmit` property access issue occurs because TypeScript's API changed between versions 4 and 5. Nx generators require TypeScript 5.x for compatibility with newer Nx versions.
>
> **Resolution**: Upgrade your TypeScript dependency to version 5.x (5.5.4 or later recommended).
>
> If you're still experiencing this issue on TypeScript 5.x, please open a new issue with a reproduction repository.

**Risk Assessment**: Low risk. The solution is well-documented in comments by multiple users. Users on older TypeScript versions should upgrade anyway for security and compatibility.

---

### Issue #22913: NxWebpackPlugin "resolves" baseHref starting with './' that breaks loading resources in packaged electron application
**URL**: https://github.com/nrwl/nx/issues/22913

**Category**: 3: User Config

**Confidence**: MEDIUM (relaxed criteria)

**Evidence**:
1. User @kieferhagin provided a workaround that was confirmed working: "For anyone else experiencing this exact problem, I found that using `.` alone works fine in Electron and does not have the same problem."
2. User @maroon1 confirmed: "Good! It worked for me."
3. The issue is about a specific edge case with Electron and `./` vs `.` in baseHref configuration

**Suggested Response Template**:
> This issue has a documented workaround that has been confirmed by multiple users.
>
> **Workaround**: Use `.` instead of `./` for the `baseHref` configuration when building Electron applications.
>
> This appears to be expected behavior due to how path resolution works in Electron contexts. The single dot notation (`.`) provides the same relative path behavior without the issues caused by the leading `./`.
>
> If this workaround doesn't resolve your issue, please open a new issue with a detailed reproduction.

**Risk Assessment**: Low risk. The workaround is simple and has been confirmed working by multiple users. The issue is specific to Electron applications.

---

## Issues Reviewed but NOT Recommended for Closure

| Issue | Title | Reason Not Included |
|-------|-------|---------------------|
| #33507 | Axios security vulnerability with @nx/s3-cache | Active high-priority security issue, needs proper fix |
| #30146 | ESBuild cannot generate package.json with new TypeScript setup | Active issue with ongoing work (PRs linked), workarounds exist but underlying issue persists |
| #28410 | Migration to 20 - Cannot read properties of undefined (reading 'cli') | User config issue but needs investigation - no confirmation of resolution pattern |
| #28395 | [Mac]: Failed to process project graph | ESLint plugin conflict issue - complex root cause, needs proper fix |
| #28385 | Error: The externalDependency could not be found | Active bug, users still reporting on latest versions (21.6.3) |
| #28309 | New eslint workspace with eslint 9 & angular breaks previous behavior | ESLint 9 flat config compatibility - ongoing work needed |
| #28197 | generatePackageJson is not adding npm packages for implicitDependencies | No confirmed resolution, user still seeking help |
| #28171 | [Import] Nx Import doesn't move tags | Active feature request, user waiting for resolution |
| #27879 | Inflight@1.0.6 removed for leaking memory | Security/dependency issue - upstream dependency needs updating |
| #27816 | Vitest fails on CI with workspace generators >19.0.0 | Reproduction needed, investigation ongoing |
| #27580 | @nx/webpack: Cannot exclude external dependencies | Still an issue per recent comment |
| #27571 | Pruned lock file creation failed | Users still reporting issue on recent versions |
| #27274 | Nx adds root package.json to dist in standalone React app | No confirmed resolution |
| #26909 | rspack withNx config ignoring library dependencies | Active issue, users still affected |
| #26602 | @nx/esbuild:esbuild asset copy ignores gitignored files | Feature request for better documentation/override capability |
| #21265 | [Vite] Support different environments with replaceFiles plugin | Feature request, still being requested |
| #17054 | Project package.json doesn't have all dependencies after build | Complex issue with generatePackageJson, no clear resolution |
| #15113 | nx doesn't build the deps projects when they change | Long-standing complex issue, recent user provided workaround but not official fix |
| #11289 | 'rootDir' is expected to contain all source files | Complex TS compilation issue - has workarounds but root cause varies |
| #10935 | The webpack executor uses hard-coded SWC config | Feature request for SWC config override - still requested |

---

## Notes on Review Process

### Issues Skipped for Specific Reasons

1. **#33507 (Axios security vulnerability)**: High priority security issue - should NOT be closed without proper fix
2. **#30146 (ESBuild package.json)**: Has ongoing PRs linked (#31545, #31557, #31634) - work in progress
3. **#27879 (Inflight memory leak)**: Security issue with transitive dependency - requires upstream changes
4. **#28171 (Import tags)**: User explicitly stated waiting for fix, issue marked stale but user responded

### Patterns Observed

1. **TypeScript Version Issues**: Several issues (#28397, #28410) relate to TypeScript version compatibility. Users on TS 4.x encounter errors with newer Nx versions.

2. **ESLint Flat Config Issues**: Multiple issues (#28395, #28309) relate to ESLint 9 flat config migration challenges.

3. **Package.json Generation**: Multiple issues (#30146, #17054, #26909) relate to generatePackageJson not including all dependencies.

4. **Watch/Serve Mode**: Issues (#15113, #27816) relate to dependencies not being rebuilt during watch mode.

---

## Next Steps (For Human Review)

For each issue above:
1. Review the evidence provided
2. Verify the analysis is correct
3. If appropriate, manually close with the suggested response

### Issues That Might Need Further Investigation

- **#28385**: Has many user reports and a recent comment pattern - might benefit from investigation into `.gitignore`/`.nxignore` documentation
- **#15113**: The recent workaround by @monabbous regarding `require.resolve('nx')` resolving to `nx.json` might warrant investigation

### Recommendations

1. Consider adding documentation about TypeScript 5.x requirement for Nx 20+
2. Consider improving error messages for TypeScript version mismatches
3. The inflight@1.0.6 dependency issue (#27879) affects security scanning - consider prioritizing dependency updates
