# NXC-4326 — Future of `withNxMetro` (research notes)

Linear: https://linear.app/nxdev/issue/NXC-4326/discussion-future-of-withnxmetro-nxreact-native-nxexpo
Milestone: v23 config helpers deprecated. Status: In Progress. Assignee: Jack.

## Helper inventory

Two copies, both `packages/<pkg>/plugins/with-nx-metro.ts`:

- `@nx/react-native` → `withNxMetro` (async)
- `@nx/expo` → `withNxMetro` (sync, sets `projectRoot: workspaceRoot` for Expo SDK 54+)

Both share near-identical logic. Internals split across:

- `with-nx-metro.ts` (watchFolders + mergeConfig)
- `metro-resolver.ts` (custom `resolveRequest` chain)

`metro-resolver.ts` diff between RN and Expo = 1 hunk:
Expo guards `lookupStartPath` to stay within `workspaceRoot` (SDK 54+ originModulePath quirk).

## What withNxMetro actually does

1. `watchFolders` = every non-`dist`/non-`e2e`/non-dot dir under `workspaceRoot`, plus user-supplied.
2. `resolver.nodeModulesPaths` = `[workspaceRoot/node_modules]`.
3. Custom `resolveRequest` chain (in order):
   a. user's existing `resolveRequest`
   b. metro default resolver
   c. **tsconfig-paths resolver** — `loadConfig()` from `tsconfig-paths`, `createMatchPath`
   d. **pnpm resolver** — `enhanced-resolve` + `CachedInputFileSystem`, conditions `[native, browser, require, default, react-native, node, ...user]`, mainFields `[react-native, browser, main, ...user]`, aliasFields `[browser]`
4. Sets `NX_REACT_NATIVE_DEBUG=true` when `debug: true`.
5. `mergeConfig(userConfig, nxConfig)`.

Both generators ship a `metro.config.js.template` that wraps the user's merged default + custom config in `withNxMetro(...)`.

## Upstream story (May 2026)

### Expo (`expo/metro-config`, SDK 52+)

Quote, Expo monorepo guide: *"Expo configures Metro automatically for monorepos. You don't have to manually configure Metro when using monorepos if you use `expo/metro-config`."*

- Auto-detects pnpm, npm, yarn, bun workspaces.
- Sets `watchFolders`, `resolver.nodeModulesPath`, cross-workspace resolution.
- Migration note: remove `watchFolders`, `resolver.nodeModulesPaths`, `resolver.extraNodeModules`, `resolver.disableHierarchicalLookup` from existing configs and run `expo start --clear`.
- tsconfig paths (`compilerOptions.paths`/`baseUrl`) supported by default since SDK 50 (`tsConfigPaths` default-on).

Net: for Expo, items (1) (2) (3c) are already covered by stock `expo/metro-config`. Only (3d) pnpm resolver + RN-specific conditions might add value, and even that is moot since Expo's resolver already speaks pnpm via the same workspaces detection.

### React Native CLI (`@react-native/metro-config`)

No auto monorepo support. Stock default still assumes single-project layout. Apps in monorepos must manually set:

- `config.watchFolders = [workspaceRoot]`
- `config.resolver.nodeModulesPaths = [project/node_modules, workspaceRoot/node_modules]`
- `config.resolver.disableHierarchicalLookup = true`
- For pnpm: `resolver.unstable_enableSymlinks: true`, optionally `unstable_enablePackageExports: true`
- tsconfig paths: not built in. Either babel-plugin-module-resolver (legacy) or a custom resolver.

Net: for RN CLI, (1)/(2)/(3c)/(3d) all still load-bearing.

## Community plugins (same-feature replacements?)

### `react-native-monorepo-config` (satya164)

- Watches monorepo root, blocks duplicate package versions, resolves hoisted peerDeps, prioritises `package.json#source` + `source` exports condition, reads workspaces from root `package.json`, supports custom workspace arrays.
- Does **not** cover: tsconfig paths, pnpm symlinks specifically, multi-condition exports beyond `source`.
- Yarn 4 first-class; pnpm/npm not explicitly documented.
- **Partial overlap** with withNxMetro. Misses tsconfig-paths leg and pnpm resolver.

### `@rnx-kit/metro-config` (Microsoft)

- `makeMetroConfig()` enhances Metro for monorepos.
- Adds `resolveUniqueModule()` / `exclusionList()` for duplicate-package dedup.
- Compatible with Expo's default config.
- Does **not** advertise tsconfig paths or pnpm-specific resolver chain.
- **Partial overlap**. Strongest at dedup, weakest at the tsconfig/pnpm bits Nx covers.

### Stock `expo/metro-config`

Full replacement for the Expo copy of `withNxMetro` once SDK 52+ is the floor. Covers (1)(2)(3a)(3b)(3c). The pnpm leg (3d) becomes redundant because Expo's monorepo detection wires pnpm correctly. Only edge case left: users supplying `exportsConditionNames`/`mainFields` overrides — those still need a custom `resolveRequest`, but it's not load-bearing for the common path.

## Findings

**Expo side**

- `withNxMetro` from `@nx/expo` is **redundant for SDK 52+** in the default case. Stock `expo/metro-config` does watchFolders, nodeModulesPaths, workspace detection across all PMs, and tsconfig paths.
- Custom resolver chain still adds: pnpm `enhanced-resolve` fallback with RN-specific conditions, user-supplied `exportsConditionNames`/`mainFields`. Realistic users of those flags = unknown; worth checking issue tracker before pulling.
- Recommended: **deprecate `@nx/expo`'s `withNxMetro` in v23, drop in v24.** Generator templates emit stock Expo config. Provide migration codemod that strips the wrapper and inlines any user-set `watchFolders`/`extensions`. SDK 52+ already needed for other Expo work in v23, so the floor is acceptable.

**React Native side**

- `withNxMetro` from `@nx/react-native` is **still load-bearing.** `@react-native/metro-config` has not caught up to Expo. Users in monorepos still need watchFolders, nodeModulesPaths, disableHierarchicalLookup, pnpm symlinks, tsconfig paths — none of which RN CLI's default provides.
- Community options (`react-native-monorepo-config`, `@rnx-kit/metro-config`) are partial. Neither covers the tsconfig-paths + pnpm-resolver combo together. Swap would be a feature regression.
- Recommended: **keep `@nx/react-native`'s `withNxMetro`.** Possibly trim once `@react-native/metro-config` ships monorepo auto-detect (no public roadmap signal yet — verify before v24).

**Asymmetric outcome → split the decision per package, don't bundle.**

## Open items / verification before write-up

- [ ] Check Nx GitHub issues for users actually setting `exportsConditionNames` / `mainFields` on `withNxMetro`. If zero real-world hits, the custom resolver is even safer to drop on Expo side.
- [ ] Confirm Nx v23 floor for Expo SDK (search packages/expo/src). If floor is <52, deprecation needs to wait or be conditional.
- [ ] Look for upstream RFC/PR on `@react-native/metro-config` adding monorepo support. If imminent, time the RN deprecation with it.
- [ ] Coupling to detox/RN deprecation sweep — not blocking, but worth flagging if RN investment is scaling back, the case for keeping the helper weakens.

## Sources

- Linear issue: https://linear.app/nxdev/issue/NXC-4326
- Expo monorepos guide: https://docs.expo.dev/guides/monorepos/
- Expo Metro customization: https://docs.expo.dev/guides/customizing-metro/
- Callstack RN pnpm monorepo guide: https://www.callstack.com/blog/react-native-monorepo-with-pnpm-workspaces
- `react-native-monorepo-config`: https://github.com/satya164/react-native-monorepo-config
- `@rnx-kit/metro-config`: https://microsoft.github.io/rnx-kit/docs/tools/metro-config
- Metro config docs: https://metrobundler.dev/docs/configuration/
