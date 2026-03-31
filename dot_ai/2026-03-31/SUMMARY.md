# Summary — 2026-03-31

## Completed

### NXC-4176: Custom React workspace fails with Vite 8 and React Router

- **PR**: https://github.com/nrwl/nx/pull/35101
- **Problem**: Creating a custom React workspace with React Router in framework/server mode failed due to peer dependency conflict between Vite 8 (new default) and `@react-router/dev`.
- **Fix**: Pass `useViteV7: true` from the React app generator's `setupViteConfiguration` when `useReactRouter` is true. Added `useViteV7` to `ViteConfigurationGeneratorSchema` so the flag flows through `viteConfigurationGenerator` -> `initGenerator` -> `checkDependenciesInstalled`.
- **Files changed**:
  - `packages/react/src/generators/application/lib/bundlers/add-vite.ts` — pass `useViteV7` when react-router
  - `packages/vite/src/generators/configuration/schema.d.ts` — add `useViteV7` to type
  - `packages/react/src/generators/application/application.spec.ts` — test asserting vite 7 used with react-router
