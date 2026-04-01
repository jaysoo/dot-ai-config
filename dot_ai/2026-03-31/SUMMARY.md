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

### CLOUD-4403: Add Node 22/24 agent image tags to cloud-infrastructure config map

- **PR**: https://github.com/nrwl/cloud-infrastructure/pull/4702
- **Context**: Follow-up to CLOUD-4029 (ocean PR #10571, merged). Images published to quay.io.
- **Change**: Added `ubuntu22.04-node22.22-v1` and `ubuntu22.04-node24.14-v1` to `enabledImages` in all 12 `agent-configuration` config maps across development, staging, production (NA/EU), and enterprise (AWS, Azure, GCP) environments.
- **Default image**: Left as Node 20. Follow-up task to switch default to Node 22 in 2-4 weeks after validation.
