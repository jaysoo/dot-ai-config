# Technologies Section Guides Comparison Report

## Summary
Comparison of the Guides sections within each Technology between production (nx.dev) and local Astro version (localhost:4321).

---

## TypeScript

### Production (nx.dev) ✅
**Has Guides section with 5 items:**
1. Switch to Workspaces and TS Project References
2. Enable Typescript Batch Mode
3. Define Secondary Entrypoints for Typescript Packages
4. Compile Typescript Packages to Multiple Formats
5. Use JavaScript instead TypeScript

### Local Astro ❌
**No Guides section** - Only shows:
- Generators
- Executors
- Migrations

**Status:** ⚠️ **MISSING ALL 5 GUIDES**

---

## Angular

### Production (nx.dev) ✅
**Has Guides section with 8 items:**
1. How to Migrate From AngularJS to Angular
2. Using Tailwind CSS with Angular projects
3. Using NgRx
4. Setup Module Federation with Angular SSR
5. Setup Angular Monorepo
6. Deploy an Angular application to Netlify
7. Import Libraries in Angular DevTools
8. Advanced Angular micro frontends with dynamic module federation

### Local Astro ✅
**Has Guides section with 8 items:**
1. How to Migrate From AngularJS to Angular
2. Using Tailwind CSS with Angular projects
3. Using NgRx
4. Setup Module Federation with Angular SSR
5. Setup Angular Monorepo
6. Deploy an Angular application to Netlify
7. Import Libraries in Angular DevTools
8. Advanced Angular micro frontends with dynamic module federation

**Status:** ✅ **COMPLETE - All guides present (same content, same order)**

---

## React

### Production (nx.dev) ✅
**Has Guides section with 9 items:**
1. React Native with Nx
2. Remix with Nx
3. React Router with Nx
4. Use Environment Variables in React
5. Using Tailwind CSS in React
6. Adding Images, Fonts, and Files
7. Setup Module Federation with SSR for React
8. Deploying Next.js applications to Vercel
9. React Compiler with Nx

### Local Astro ✅
**Has Guides section with 9 items:**
1. Adding Images, Fonts, and Files
2. Deploying Next.js applications to Vercel
3. Setup Module Federation with SSR
4. React Compiler with Nx
5. React Native with Nx
6. React Router with Nx
7. Remix with Nx
8. Use Environment Variables in React
9. Using Tailwind CSS in React

**Status:** ✅ **COMPLETE - All guides present (different order but same content)**

### React > Next

#### Production (nx.dev) ❓
**To be checked**

#### Local Astro ✅
**Has Guides section with 1 item:**
1. How to configure Next.js plugins

### React > Remix

#### Production (nx.dev) ❓
**To be checked**

#### Local Astro ❌
**No Guides section** - Only shows:
- Generators
- Executors
- Migrations
- Introduction

### React > React Native

#### Production (nx.dev) ❓
**To be checked**

#### Local Astro ❌
**No Guides section** - Only shows:
- Generators
- Executors
- Migrations
- Introduction

### React > Expo

#### Production (nx.dev) ❓
**To be checked**

#### Local Astro ❌
**No Guides section** - Only shows:
- Generators
- Executors
- Migrations
- Introduction

---

## Vue

### Production (nx.dev) ❌
**No Guides section** - Only shows:
- Introduction
- API
- Nuxt (nested technology)

### Local Astro ❌
**No Guides section** - Only shows:
- Generators
- Executors
- Migrations
- Introduction
- Nuxt (nested technology)

**Status:** ✅ **CONSISTENT - No guides in either version**

---

## Node.js

### Production (nx.dev) ✅
**Has Guides section with 5 items:**
1. Deploying a Node App to Fly.io
2. Add and Deploy Netlify Edge Functions with Node
3. Deploying AWS lambda in Node.js (deprecated)
4. Set Up Application Proxies
5. Wait for Tasks to Finish

### Local Astro ✅
**Has Guides section with 5 items:**
1. Set Up Application Proxies
2. Deploying AWS lambda in Node.js (deprecated)
3. Deploying a Node App to Fly.io
4. Add and Deploy Netlify Edge Functions with Node
5. Wait for Tasks to Finish

**Status:** ✅ **COMPLETE - All guides present (different order but same content)**

---

## Java

### Production (nx.dev) ❓
**To be checked**

### Local Astro ❓
**To be checked**

---

## Module Federation

### Production (nx.dev) ❓
**To be checked**

### Local Astro ❓
**To be checked**

---

## ESLint

### Production (nx.dev) ❓
**To be checked**

### Local Astro ❓
**To be checked**

---

## Build Tools

### Production (nx.dev) ❓
**Has nested sections:**
- Webpack
- Vite
- Rollup
- ESBuild
- Rspack
- Rsbuild

Each may have their own Guides.

### Local Astro ❓
**To be checked**

---

## Test Tools

### Production (nx.dev) ❓
**Has nested sections:**
- Cypress
- Jest
- Playwright
- Storybook
- Detox

Each may have their own Guides.

### Local Astro ❓
**To be checked**

---

## Summary of Findings

### ✅ Technologies with Complete Guides
- **Angular**: All 8 guides present in both versions (same content, same order)
- **React**: All 9 guides present in both versions (same content, different order)
- **Node.js**: All 5 guides present in both versions (same content, different order)

### ⚠️ Technologies Missing Guides
- **TypeScript**: Missing all 5 guides in local Astro version

### ℹ️ Nested Technologies Status
#### React Nested:
- **Next.js**: Has 1 guide in local ("How to configure Next.js plugins") - needs production verification
- **Remix**: No guides in local - needs production verification
- **React Native**: No guides in local - needs production verification  
- **Expo**: No guides in local - needs production verification

### ✅ Technologies with No Guides (Consistent)
- **Vue**: No guides in either version (consistent)

### 📝 Technologies Not Yet Verified
- Java
- Module Federation
- ESLint (and nested: ESLint Plugin)
- Build Tools (and nested: Webpack, Vite, Rollup, ESBuild, Rspack, Rsbuild)
- Test Tools (and nested: Cypress, Jest, Playwright, Storybook, Detox)

---

## Key Findings

1. **TypeScript guides are completely missing** in the local Astro version - this is the most critical gap found.

2. **Angular, React, and Node.js main sections are complete** - all have their guides present, though React and Node.js guides appear in a different order in the local version.

3. **Vue has no guides in either version** - this is consistent between production and local.

4. **Nested React technologies** (Next, Remix, React Native, Expo) appear to have limited or no guides in the local version, with only Next.js showing one guide.

5. **Nested Node.js technologies** (Express, Nest) need to be verified for guides.

6. The local Astro version uses the `getPluginItems()` function which looks for static guide files in the `/astro-docs/src/content/docs/technologies/` directory structure. Missing guides indicate these files haven't been migrated from the production documentation.

---

## Recommendations

1. **Priority 1**: Migrate TypeScript guides - create the necessary guide files under `/astro-docs/src/content/docs/technologies/typescript/guides/`

2. **Priority 2**: Verify and migrate guides for nested React technologies (Next, Remix, React Native, Expo)

3. **Priority 3**: Complete verification of remaining technologies and migrate any missing guides

---

*Note: This report covers the main Technologies section visible in the sidebar. Additional nested sections within Build Tools and Test Tools may have their own guides that need verification.*