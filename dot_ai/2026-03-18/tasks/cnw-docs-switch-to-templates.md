# Docs: Switch preset commands to template commands

## Goal

Reduce usage of legacy `--preset=` in docs where `--template=` is the modern equivalent. This reduces the number of users going through the longer preset prompt flow (which has a 25% drop-off rate vs templates).

## Changes

### 1. `extending-nx/organization-specific-plugin.mdoc:21`

**Before:**
```
npx create-nx-workspace myorg --preset=react-monorepo --ci=github
```

**After:**
```
npx create-nx-workspace myorg --template=nrwl/react-template
```

Drop `--ci=github` — templates handle CI setup.

### 2. `technologies/build-tools/webpack/introduction.mdoc:31-38`

This one is trickier. The page is specifically about using **webpack** as a bundler, and the template uses vite by default. Two options:

a. Switch to template and then add webpack via `nx add @nx/webpack` + reconfigure (preferred — templates are the entry point)
b. Keep preset since `--bundler=webpack` is the whole point of this section

**Recommendation:** Rewrite the "Setting up a new Nx workspace with Webpack" section to:
```
npx create-nx-workspace@latest --template=nrwl/react-template
```
Then explain adding webpack support via `nx add @nx/webpack` since the very next section already covers `nx add @nx/webpack`. Remove `--preset=react-standalone --bundler=webpack` and `--preset=react-monorepo --bundler=webpack`.

### 3. `technologies/angular/Guides/nx-and-angular.mdoc:81-86`

**Before (line 81):**
```
npx create-nx-workspace myngapp --preset=angular-standalone
```

**After:**
```
npx create-nx-workspace myngapp --template=nrwl/angular-template
```

**Before (line 85, aside):**
> You can use the `--preset=angular-monorepo` to start with a monorepo structure.

**After:**
> The Angular template creates a monorepo structure. You can start simple and add more projects later.

### 4. `technologies/typescript/introduction.mdoc:99`

**Before:**
> If you want to keep using the older style of setups with `compilerOptions.paths`, use `create-nx-workspace --preset=apps`.

**After:** Add a note that this is legacy:
> If you want to keep using the older style of setups with `compilerOptions.paths`, use `create-nx-workspace --preset=apps`. Note that this uses a legacy setup — the modern approach with project references is recommended for new workspaces.

### 5. NOT changing — Module federation pages (require `--preset=apps`)

These stay as-is since module federation needs the `apps` preset:
- `angular/Guides/module-federation-with-ssr.mdoc`
- `angular/Guides/dynamic-module-federation-with-angular.mdoc`
- `react/Guides/module-federation-with-ssr.mdoc`
- `module-federation/concepts/faster-builds-with-module-federation.mdoc`

## Flags to drop when switching to templates

- `--ci=github` — templates handle CI config
- `--bundler=webpack` — templates have a fixed bundler (vite for react, angular CLI for angular)

## Validation

- Run `nx serve astro-docs` and verify pages render correctly
- Run `nx-docs-style-check` after changes
- Grep for any remaining `--preset=react-monorepo` or `--preset=angular-monorepo` in astro-docs

## Context

- CNW telemetry shows 77% of non-AI users use presets, many driven by docs
- `react-monorepo` preset: 131 uses on 22.6.0
- `angular-monorepo` preset: 23 uses on 22.6.0
- Template flow has 85-93% start→precreate rate vs 72% for preset flow
