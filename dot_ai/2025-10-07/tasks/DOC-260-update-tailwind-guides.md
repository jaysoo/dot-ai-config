# DOC-260: Update TailwindCSS Guides

**Created**: 2025-10-07 12:16
**Issue**: https://linear.app/nxdev/issue/DOC-260/update-tailwindcss-guides
**Goal**: Update Tailwind CSS documentation to remove generator references and provide simple manual setup instructions that work with Tailwind v4

## Current State

Found 2 Tailwind documentation files:
1. `astro-docs/src/content/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects.mdoc`
2. `astro-docs/src/content/docs/technologies/react/Guides/using-tailwind-css-in-react.mdoc`

Both files currently:
- Reference `setup-tailwind` generator
- Use `createGlobPatternsForDependencies` utility from Nx
- Focus on automated setup

## Target State

Documentation should:
1. Remove all references to `setup-tailwind` generator
2. Remove usage of `createGlobPatternsForDependencies` utility
3. Use simple glob patterns instead (like nx-dev/nx-dev does)
4. Provide manual setup that works with Tailwind v3 and v4
5. Be framework-agnostic where possible
6. Make setup simple enough that users can do it in 2 minutes

## Plan

### 1. Angular Guide Updates
- Remove "Generating or adding Tailwind CSS support" section (lines 17-43)
- Simplify "Configuring the content sources" section:
  - Remove `createGlobPatternsForDependencies` utility usage
  - Show simple glob patterns instead
- Update all example `tailwind.config.js` to use simple globs
- Keep preset-based setup scenarios but simplify

### 2. React Guide Updates
- Remove "Automated Setup" section (lines 13-31)
- Keep manual setup but simplify
- Remove `createGlobPatternsForDependencies` utility usage
- Use simple glob patterns

### 3. Verification
- Create new Nx workspace
- Follow manual steps with Tailwind v4
- Use Playwright MCP to verify TW class renders correctly

## Implementation Notes

### Simple Glob Pattern Approach
Instead of:
```js
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
...
content: [
  join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
  ...createGlobPatternsForDependencies(__dirname),
]
```

Use:
```js
content: [
  join(__dirname, 'src/**/*.{ts,html,tsx,jsx}'),
  join(__dirname, '../**/*.{ts,html,tsx,jsx}'), // Include other projects
]
```

Or even simpler for monorepos:
```js
content: [
  './src/**/*.{ts,html,tsx,jsx}',
  '../../libs/**/*.{ts,html,tsx,jsx}', // Adjust based on structure
]
```

## Verification Steps
1. `npx create-nx-workspace@latest my-test-workspace`
2. Add Tailwind v4: `npm add -D tailwindcss@next @tailwindcss/postcss@next`
3. Follow manual setup from updated docs
4. Add a component with Tailwind class (e.g., `bg-blue-500`)
5. Build/serve the app
6. Use Playwright MCP to verify the class renders with correct styles
