# Issue #30146: ESBuild cannot generate package.json with new TypeScript setup

**Issue:** https://github.com/nrwl/nx/issues/30146
**Date:** 2026-02-23
**Status:** Investigation complete, awaiting decision on solution approach

## Problem Summary

In Nx 20, `generatePackageJson: true` throws an error in `@nx/esbuild` and `@nx/rollup` when using the new TS Solution Setup (TypeScript project references + package manager workspaces). This breaks Docker/containerization workflows that depend on producing a slim `package.json` + lockfile for deployment.

**Error location:** `packages/esbuild/src/executors/esbuild/lib/normalize.ts:18-22`

## User Impact (34 comments, opened Feb 2025)

- **Docker image bloat:** One user's image doubled from ~700MB to ~1.5GB using full workspace deps
- **Firebase Cloud Functions:** Cannot deploy without a `package.json`; bundling all deps causes memory exhaustion
- **User attrition:** At least one team is "moving away from Nx for future projects"
- **No response from Nx team since June 2025** — 8 months of unanswered complaints

## Workarounds Users Have Tried

| Workaround | Problems |
|---|---|
| Manual deploy `package.json` | Must manually maintain deps — miss one and deploy fails |
| `bundle: true, thirdParty: true` | Memory exhaustion for larger apps, ESM `require` hacks needed |
| `bundle: true` + `format: ["cjs"]` | Still bundles everything — memory problems returned |
| Custom esbuild metafile parser | No lockfile, pnpm-specific |
| Custom dependency traversal script | Tricky with ESM transitive deps, no lockfile |
| Use entire workspace `package.json` | Docker image doubled in size |

## What Nx Already Shipped (But Users Don't Know)

Three PRs merged mid-2025:

1. **`@nx/js:prune-lockfile`** (PR #31557, June 2025) — Pruned lockfile from project `package.json`
2. **`@nx/js:copy-workspace-modules`** (PR #31545, June 2025) — Copies workspace libs to output
3. **`@nx/docker`** (PR #31634, July 2025) — Docker build/run target inference

New `nx g @nx/node:application --docker` projects get `prune` targets automatically. Existing projects do not.

## Remaining Gaps

1. **No migration path** for existing projects
2. **Poor discoverability / docs** — prune-lockfile is "poorly documented"
3. **Deps must be in project `package.json`** — can't rely on root-level deps
4. **No Firebase/serverless guidance** — can't customize output `package.json` fields
5. **Open bugs:** PR #34347 (`rehoistNodes` crash), PR #31780 (type-only imports)
6. **No communication** — last Nx team comment was June 2025

## Proposed Solutions

### Solution 1: Migration Generator (Recommended — highest impact, lowest risk)

Add `nx g @nx/node:setup-prune` (or auto-migrate) that:
- Detects node apps using esbuild/webpack/rollup
- Adds `prune-lockfile`, `copy-workspace-modules`, `prune` targets
- Removes `generatePackageJson` if present
- Optionally generates/updates Dockerfile

### Solution 2: Backward-Compatible `generatePackageJson`

Instead of throwing, `@nx/esbuild` would:
- Read project `package.json` → copy to output
- Replace `workspace:*` with `file:./workspace_modules/...`
- Invoke prune-lockfile logic inline
- Show deprecation warning pointing to new approach

### Solution 3: Unified `nx prune <project>` with Customization

Top-level command + `packageJsonOverrides` option for Firebase/serverless:
```json
{
  "prune": {
    "options": {
      "packageJsonOverrides": {
        "type": "module",
        "engines": { "node": "20" }
      }
    }
  }
}
```

## Working Config for Current Nx (Today)

```jsonc
{
  "nx": {
    "targets": {
      "build": {
        "executor": "@nx/esbuild:esbuild",
        "options": { "generatePackageJson": false }
      },
      "prune-lockfile": {
        "dependsOn": ["build"],
        "executor": "@nx/js:prune-lockfile",
        "options": { "buildTarget": "build" }
      },
      "copy-workspace-modules": {
        "dependsOn": ["build"],
        "executor": "@nx/js:copy-workspace-modules",
        "options": { "buildTarget": "build" }
      },
      "prune": {
        "dependsOn": ["prune-lockfile", "copy-workspace-modules"],
        "executor": "nx:noop"
      }
    }
  }
}
```

## Next Steps

- [ ] Decide which solution(s) to pursue
- [ ] If implementing: create feature branch, implement, test with repro workspace
- [ ] Post comment on issue explaining the current state and new workflow
