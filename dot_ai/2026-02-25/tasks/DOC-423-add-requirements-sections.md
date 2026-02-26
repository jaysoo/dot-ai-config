# DOC-423: Add Requirements Section to Tech Docs Pages

## Context

Each technology page in the Nx docs sidebar should have a "Requirements" section near the top (after intro) that tells users what versions of the underlying technology are supported. Some techs already have dedicated compatibility pages (Angular version matrix, Node/TS compatibility), but most don't surface this information at all. The goal is to audit all tech pages, determine version support from peerDependencies and general policy ("current + previous 2 versions"), and create a comprehensive report.

## Phase 1: Findings - Version Support per Technology

### Existing Compatibility Pages (already documented)

| Technology           | Page                                                         | Status      |
| -------------------- | ------------------------------------------------------------ | ----------- |
| Angular              | `technologies/angular/Guides/angular-nx-version-matrix.mdoc` | Full matrix |
| Node.js + TypeScript | `reference/nodejs-typescript-compatibility.mdoc`             | Full matrix |

### Frameworks & Libraries

| #   | Technology            | Package                       | peerDependencies                                       | Derived Version Support                                    | Notes/Flags                                             |
| --- | --------------------- | ----------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------- |
| 1   | TypeScript            | `@nx/js`                      | verdaccio only                                         | >= 5.4.2 < 5.10.0                                          | Covered by Node/TS compat page                          |
| 2   | Angular               | `@nx/angular`                 | `@angular/*: >= 19.0.0 < 22.0.0` (via catalog)         | Angular 19, 20, 21                                         | Has dedicated version matrix page                       |
| 3   | Angular Rspack        | `@nx/angular-rspack`          | `@rspack/core: >=1.3.5 <1.7.0`                         | Rspack 1.3-1.6                                             | Also requires Angular (see Angular)                     |
| 4   | Angular Rsbuild       | `@nx/angular-rspack-compiler` | `@rsbuild/core: >=1.0.5 <2.0.0`                        | Rsbuild 1.x                                                | Also requires Angular                                   |
| 5   | **React**             | `@nx/react`                   | **NONE**                                               | React 18, 19 (policy)                                      | **MISSING peerDep for `react`**                         |
| 6   | Next.js               | `@nx/next`                    | `next: >=14.0.0 <17.0.0`                               | Next.js 14, 15, 16                                         | Good coverage                                           |
| 7   | Remix                 | `@nx/remix`                   | `@remix-run/dev: ^2.17.3`                              | Remix 2.x                                                  | Remix is being superseded by React Router v7            |
| 8   | React Native          | `@nx/react-native`            | `metro-config: >= 0.82.0`, `metro-resolver: >= 0.82.0` | Metro 0.82+                                                | No peerDep on `react-native` itself                     |
| 9   | Expo                  | `@nx/expo`                    | `metro-config: >= 0.82.0`, `metro-resolver: >= 0.82.0` | Metro 0.82+                                                | No peerDep on `expo` itself                             |
| 10  | **Vue**               | `@nx/vue`                     | **EMPTY `{}`**                                         | Vue 3.x (policy)                                           | **MISSING peerDep for `vue`**                           |
| 11  | Nuxt                  | `@nx/nuxt`                    | `@nuxt/schema: ^3.10.0 \|\| ^4.0.0`                    | Nuxt 3.10+, 4.x                                            | Good coverage                                           |
| 12  | Node.js               | `@nx/node`                    | NONE                                                   | See Node/TS compat page                                    | Expected - Node is runtime                              |
| 13  | Express               | `@nx/express`                 | `express: ^4.21.2`                                     | Express 4.x only                                           | **Possibly missing Express 5 support?** Express 5 is GA |
| 14  | **Nest**              | `@nx/nest`                    | **NONE**                                               | NestJS 11 (inferred from `@nestjs/schematics ^11.0.0` dep) | **MISSING peerDep for `@nestjs/core`**                  |
| 15  | Java                  | No package                    | N/A                                                    | JDK 17+ (standard)                                         | Docs-only technology                                    |
| 16  | Gradle                | `@nx/gradle`                  | NONE                                                   | Gradle 7+ (standard)                                       | No JS peerDeps expected                                 |
| 17  | Maven                 | `@nx/maven`                   | NONE                                                   | Maven 3.x (standard)                                       | No JS peerDeps expected                                 |
| 18  | .NET                  | `@nx/dotnet`                  | NONE                                                   | .NET 6+ (standard)                                         | No JS peerDeps expected                                 |
| 19  | **Module Federation** | `@nx/module-federation`       | **NONE**                                               | Webpack 5 OR Rspack 1.6 + MF Enhanced (bundled in deps)    | Has webpack/MF as regular deps, not peer                |
| 20  | ESLint                | `@nx/eslint`                  | `eslint: ^8.0.0 \|\| ^9.0.0`                           | ESLint 8, 9                                                | Good coverage                                           |

### Build Tools

| #   | Technology  | Package       | peerDependencies                       | Derived Version Support                   | Notes/Flags                             |
| --- | ----------- | ------------- | -------------------------------------- | ----------------------------------------- | --------------------------------------- |
| 21  | **Webpack** | `@nx/webpack` | **NONE**                               | Webpack 5 (bundled as `^5.101.3` in deps) | webpack is a regular dep, not peer      |
| 22  | Vite        | `@nx/vite`    | `vite: ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0` | Vite 5, 6, 7                              | Good coverage                           |
| 23  | **Rollup**  | `@nx/rollup`  | **NONE**                               | Rollup 4 (bundled as `^4.14.0` in deps)   | rollup is a regular dep, not peer       |
| 24  | ESBuild     | `@nx/esbuild` | `esbuild: >=0.19.2 <1.0.0`             | esbuild 0.19+                             | Good coverage                           |
| 25  | Rspack      | `@nx/rspack`  | `@module-federation/*` only            | Rspack via catalog (1.6.x)                | **MISSING peerDep for `@rspack/core`**  |
| 26  | **Rsbuild** | `@nx/rsbuild` | **EMPTY `{}`**                         | Unknown                                   | **MISSING peerDep for `@rsbuild/core`** |

### Test Tools

| #   | Technology    | Package          | peerDependencies                                     | Derived Version Support                               | Notes/Flags                                    |
| --- | ------------- | ---------------- | ---------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| 27  | Cypress       | `@nx/cypress`    | `cypress: >= 13 < 16`                                | Cypress 13, 14, 15                                    | Good coverage                                  |
| 28  | Vitest        | `@nx/vitest`     | `vitest: ^1.0.0 \|\| ^2.0.0 \|\| ^3.0.0 \|\| ^4.0.0` | Vitest 1, 2, 3, 4                                     | Good coverage (broad)                          |
| 29  | **Jest**      | `@nx/jest`       | **NONE**                                             | Jest 29, 30 (inferred from `jest-config` catalog dep) | **MISSING peerDep for `jest`**                 |
| 30  | Playwright    | `@nx/playwright` | `@playwright/test: ^1.36.0`                          | Playwright 1.36+                                      | Good - Playwright uses semver-ish within 1.x   |
| 31  | **Storybook** | `@nx/storybook`  | `storybook: >=7.0.0 <11.0.0`                         | Storybook 8, 9, 10                                    | **peerDep includes v7 but likely unsupported** |
| 32  | Detox         | `@nx/detox`      | `detox: ^20.9.0`                                     | Detox 20+                                             | Good coverage                                  |

---

## Phase 2: Packages with Missing/Questionable peerDependencies

### Definitely Missing peerDeps (the primary technology isn't declared):

1. **`@nx/react`** - No `react` peerDep
2. **`@nx/vue`** - Empty peerDeps, no `vue` peerDep
3. **`@nx/jest`** - No `jest` peerDep
4. **`@nx/nest`** - No `@nestjs/core` peerDep
5. **`@nx/rsbuild`** - Empty peerDeps, no `@rsbuild/core` peerDep
6. **`@nx/rspack`** - No `@rspack/core` peerDep (has it as regular dep via catalog)

### Debatable (technology bundled as regular dep instead of peer):

7. **`@nx/webpack`** - `webpack` is a regular dep (`^5.101.3`), not peer
8. **`@nx/rollup`** - `rollup` is a regular dep (`^4.14.0`), not peer
9. **`@nx/module-federation`** - `webpack` and `@module-federation/*` are regular deps

### Possibly Stale:

10. **`@nx/storybook`** - peerDep `>=7.0.0 <11.0.0` includes v7 which Jack says is no longer supported
11. **`@nx/express`** - Only supports Express 4 (`^4.21.2`), Express 5 is GA

---

## Phase 3: Implementation Plan

### Scope (per user direction)

- Add Requirements sections to all tech intro pages **except** Java, Gradle, Maven, .NET (skip for now)
- For technologies **with peerDeps**: use the actual peerDep version ranges
- For technologies **without peerDeps**: mark as TBD with suggestions to follow-up
- Do NOT fix missing peerDependencies in package.json (separate task)
- **Remove** `reference/nodejs-typescript-compatibility.mdoc` and fold its content into:
  - `technologies/typescript/introduction.mdoc` → gets the TypeScript Compatibility Matrix table
  - `technologies/node/introduction.mdoc` → gets the Node.js Compatibility Matrix table
- Add redirects from old URL `/docs/reference/nodejs-typescript-compatibility` to the appropriate tech page

### Format

Add a `## Requirements` section after the intro paragraph(s) and before the "Setting Up" / "Setup" section. Use a simple table format:

```markdoc
## Requirements

| Technology | Supported Versions |
| --- | --- |
| Next.js | >=14.0.0 <17.0.0 |
```

For Angular, keep the existing link to the dedicated version matrix page. For TypeScript and Node.js, inline the content from the old combined compat page directly into their respective intro pages (and delete the old combined page).

For techs with no peerDeps, use TBD:

```markdoc
## Requirements

| Technology | Supported Versions |
| --- | --- |
| React | TBD |
```

### Files to modify (26 total)

**Frameworks & Libraries (14 files):**

| #   | File                                                      | Requirements Content                                                                                                     |
| --- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | `technologies/typescript/introduction.mdoc`               | Inline TS compat matrix (moved from reference/nodejs-typescript-compatibility)                                            |
| 2   | `technologies/angular/introduction.mdoc`                  | Link to [Angular version matrix](/docs/technologies/angular/guides/angular-nx-version-matrix) (already has this)         |
| 3   | `technologies/angular/angular-rspack/introduction.mdoc`   | @rspack/core >=1.3.5 <1.7.0 + Angular (see matrix)                                                                       |
| 3b  | `technologies/angular/angular-rsbuild/create-config.mdoc` | No intro page (index hidden). @rsbuild/core >=1.0.5 <2.0.0. **Skip** - sub-feature of Angular, covered by Angular matrix |
| 4   | `technologies/react/introduction.mdoc`                    | React: TBD (no peerDep)                                                                                                  |
| 5   | `technologies/react/next/introduction.mdoc`               | Next.js: >=14.0.0 <17.0.0                                                                                                |
| 6   | `technologies/react/remix/introduction.mdoc`              | @remix-run/dev: ^2.17.3                                                                                                  |
| 7   | `technologies/react/react-native/introduction.mdoc`       | metro-config: >= 0.82.0 (React Native version: TBD)                                                                      |
| 8   | `technologies/react/expo/introduction.mdoc`               | metro-config: >= 0.82.0 (Expo SDK version: TBD)                                                                          |
| 9   | `technologies/vue/introduction.mdoc`                      | Vue: TBD (no peerDep)                                                                                                    |
| 10  | `technologies/vue/nuxt/introduction.mdoc`                 | @nuxt/schema: ^3.10.0 \|\| ^4.0.0                                                                                        |
| 11  | `technologies/node/introduction.mdoc`                     | Inline Node.js compat matrix (moved from reference/nodejs-typescript-compatibility)                                       |
| 12  | `technologies/node/express/introduction.mdoc`             | Express: ^4.21.2                                                                                                         |
| 13  | `technologies/node/nest/introduction.mdoc`                | NestJS: TBD (no peerDep)                                                                                                 |
| 14  | `technologies/module-federation/introduction.mdoc`        | Webpack 5 OR Rspack 1.6 (no peerDeps, bundled as deps)                                                                   |
| 15  | `technologies/eslint/introduction.mdoc`                   | ESLint: ^8.0.0 \|\| ^9.0.0                                                                                               |

**Build Tools (6 files):**

| #   | File                                                 | Requirements Content                    |
| --- | ---------------------------------------------------- | --------------------------------------- |
| 16  | `technologies/build-tools/webpack/introduction.mdoc` | Webpack: TBD (bundled as dep, not peer) |
| 17  | `technologies/build-tools/vite/introduction.mdoc`    | Vite: ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0    |
| 18  | `technologies/build-tools/rollup/introduction.mdoc`  | Rollup: TBD (bundled as dep, not peer)  |
| 19  | `technologies/build-tools/esbuild/introduction.mdoc` | esbuild: >=0.19.2 <1.0.0                |
| 20  | `technologies/build-tools/rspack/introduction.mdoc`  | Rspack: TBD (missing peerDep)           |
| 21  | `technologies/build-tools/rsbuild/introduction.mdoc` | Rsbuild: TBD (missing peerDep)          |

**Test Tools (6 files):**

| #   | File                                                   | Requirements Content                                       |
| --- | ------------------------------------------------------ | ---------------------------------------------------------- |
| 22  | `technologies/test-tools/cypress/introduction.mdoc`    | Cypress: >= 13 < 16                                        |
| 23  | `technologies/test-tools/vitest/introduction.mdoc`     | Vitest: ^1.0.0 \|\| ^2.0.0 \|\| ^3.0.0 \|\| ^4.0.0         |
| 24  | `technologies/test-tools/jest/introduction.mdoc`       | Jest: TBD (no peerDep)                                     |
| 25  | `technologies/test-tools/playwright/introduction.mdoc` | @playwright/test: ^1.36.0                                  |
| 26  | `technologies/test-tools/storybook/introduction.mdoc`  | Storybook: >=7.0.0 <11.0.0 (note: v7 support questionable) |
| 27  | `technologies/test-tools/detox/introduction.mdoc`      | Detox: ^20.9.0                                             |

**Skipped (per user direction):**

- `technologies/java/introduction.mdoc`
- `technologies/java/gradle/introduction.mdoc`
- `technologies/java/maven/introduction.mdoc`
- `technologies/dotnet/introduction.mdoc`

**Already covered (no new section needed, just verify):**

- Angular intro already links to version matrix (line 15) - may add formal ## Requirements header
- Angular Rsbuild intro (`angular-rsbuild/create-config`) - check if intro exists

### Insertion point pattern

Each intro page follows: frontmatter → intro paragraph(s) → optional aside → "## Setting Up" or "## Setup".
Insert `## Requirements` **before** the first `##` heading (Setup/Setting Up).

### Verification

1. `nx serve astro-docs` and spot-check 5-6 pages across categories
2. Verify table renders correctly in Markdoc
3. Ensure links to existing compat pages work
4. Check that Angular intro doesn't duplicate info

---

## Progress Tracker

### Completed

- [x] **#1 TypeScript** - Inlined TS compat matrix into `technologies/typescript/introduction.mdoc`
- [x] **#11 Node.js** - Inlined Node.js compat matrix into `technologies/node/introduction.mdoc`
- [x] **Deleted** `reference/nodejs-typescript-compatibility.mdoc`
- [x] **Sidebar** - Removed Node/TypeScript Compatibility entry from `astro-docs/sidebar.mts`
- [x] **Redirect** - Updated `nx-dev/nx-dev/redirect-rules-docs-to-astro.js` to point old URL to Node intro page

**Frameworks & Libraries:**
- [x] #2 `technologies/angular/introduction.mdoc` - Added `## Requirements` header wrapping existing version matrix link
- [x] #3 `technologies/angular/angular-rspack/introduction.mdoc` - Rspack: >=1.3.5 <1.7.0
- [x] #4 `technologies/react/introduction.mdoc` - React: TBD
- [x] #5 `technologies/react/next/introduction.mdoc` - Next.js: >=14.0.0 <17.0.0
- [x] #6 `technologies/react/remix/introduction.mdoc` - Remix: ^2.17.3
- [x] #7 `technologies/react/react-native/introduction.mdoc` - Metro: >= 0.82.0
- [x] #8 `technologies/react/expo/introduction.mdoc` - Metro: >= 0.82.0
- [x] #9 `technologies/vue/introduction.mdoc` - Vue: TBD
- [x] #10 `technologies/vue/nuxt/introduction.mdoc` - Nuxt: ^3.10.0 || ^4.0.0
- [x] #12 `technologies/node/express/introduction.mdoc` - Express: ^4.21.2
- [x] #13 `technologies/node/nest/introduction.mdoc` - NestJS: TBD
- [x] #14 `technologies/module-federation/introduction.mdoc` - Webpack 5 (bundled), Rspack: TBD
- [x] #15 `technologies/eslint/introduction.mdoc` - ESLint: ^8.0.0 || ^9.0.0

**Build Tools:**
- [x] #16 `technologies/build-tools/webpack/introduction.mdoc` - Webpack: TBD
- [x] #17 `technologies/build-tools/vite/introduction.mdoc` - Vite: ^5.0.0 || ^6.0.0 || ^7.0.0
- [x] #18 `technologies/build-tools/rollup/introduction.mdoc` - Rollup: TBD
- [x] #19 `technologies/build-tools/esbuild/introduction.mdoc` - esbuild: >=0.19.2 <1.0.0
- [x] #20 `technologies/build-tools/rspack/introduction.mdoc` - Rspack: TBD
- [x] #21 `technologies/build-tools/rsbuild/introduction.mdoc` - Rsbuild: TBD

**Test Tools:**
- [x] #22 `technologies/test-tools/cypress/introduction.mdoc` - Cypress: >= 13 < 16
- [x] #23 `technologies/test-tools/vitest/introduction.mdoc` - Vitest: ^1.0.0 || ^2.0.0 || ^3.0.0 || ^4.0.0
- [x] #24 `technologies/test-tools/jest/introduction.mdoc` - Jest: TBD
- [x] #25 `technologies/test-tools/playwright/introduction.mdoc` - Playwright: ^1.36.0
- [x] #26 `technologies/test-tools/storybook/introduction.mdoc` - Storybook: >=8.0.0 <11.0.0 (bumped from >=7.0.0 since v7 is no longer supported)
- [x] #27 `technologies/test-tools/detox/introduction.mdoc` - Detox: ^20.9.0

**Style Guide Fixes (applied to all edited pages):**
- [x] Replaced "allows you to" / "enables you to" with reader-perspective phrasing
- [x] Removed "easily", "just" (trust-undermining words)
- [x] Replaced "seamless", "leverage", "utilize", "streamline" (anti-AI language)
- [x] Removed possessives on product names ("Nx's" → "the Nx", "Angular's" → "Angular", etc.)
- [x] Fixed self-referential frontmatter descriptions ("This page also explains..." → integrated phrasing)
- [x] Fixed "here" link text to descriptive text
- [x] Formatted all files with prettier

### Still TODO (non-file-edit tasks)
- [ ] Run `nx serve astro-docs` and verify rendering
