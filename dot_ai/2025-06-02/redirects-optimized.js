// Optimized redirects for Nx recipes migration
// Generated on: 2025-06-02T17:40:35.787Z
// Fixes:
// 1. Tech-only URLs now redirect to /recipes endpoints
// 2. Condensed similar patterns into wildcards where safe

const nxRecipesRedirects = {
  // Fix #1: Tech-only URLs should end with /recipes
  "/recipes/module-federation": "/technologies/module-federation/recipes",
  "/recipes/react": "/technologies/react/recipes", 
  "/recipes/angular": "/technologies/angular/recipes",
  "/recipes/node": "/technologies/node/recipes",
  "/recipes/storybook": "/technologies/test-tools/storybook/recipes",
  "/recipes/cypress": "/technologies/test-tools/cypress/recipes",
  "/recipes/next": "/technologies/react/next/recipes",
  "/recipes/nuxt": "/technologies/vue/nuxt/recipes",
  "/recipes/vite": "/technologies/build-tools/vite/recipes",
  "/recipes/webpack": "/technologies/build-tools/webpack/recipes",
  
  // Fix #2: Condensed patterns with wildcards - SAFE patterns only
  
  // Module Federation - all sub-paths follow same pattern
  "/recipes/module-federation/:slug*": "/technologies/module-federation/recipes/:slug*",
  
  // React - most sub-paths follow same pattern (excluding special cases)
  "/recipes/react/react-native": "/technologies/react/recipes/react-native",
  "/recipes/react/remix": "/technologies/react/recipes/remix",
  "/recipes/react/react-router": "/technologies/react/recipes/react-router",
  "/recipes/react/use-environment-variables-in-react": "/technologies/react/recipes/use-environment-variables-in-react",
  "/recipes/react/using-tailwind-css-in-react": "/technologies/react/recipes/using-tailwind-css-in-react",
  "/recipes/react/adding-assets-react": "/technologies/react/recipes/adding-assets-react",
  "/recipes/react/deploy-nextjs-to-vercel": "/technologies/react/recipes/deploy-nextjs-to-vercel",
  "/recipes/react/react-compiler": "/technologies/react/recipes/react-compiler",
  // Special case: this one goes to angular, not react
  "/recipes/react/module-federation-with-ssr": "/technologies/angular/recipes/module-federation-with-ssr",
  
  // Angular - keeping individual because of complex mappings
  "/recipes/angular/rspack": "/technologies/build-tools/rspack",
  "/recipes/angular/rspack/introduction": "/technologies/typescript/introduction",
  "/recipes/angular/rspack/getting-started": "/technologies/angular/angular-rspack/recipes/getting-started",
  "/recipes/angular/rspack/migrate-from-webpack": "/technologies/angular/angular-rspack/recipes/migrate-from-webpack",
  "/recipes/angular/rspack/handling-configurations": "/technologies/angular/angular-rspack/recipes/handling-configurations",
  "/recipes/angular/rspack/internationalization": "/technologies/angular/angular-rspack/recipes/internationalization",
  "/recipes/angular/migration": "/technologies/angular/migration",
  "/recipes/angular/migration/angular": "/technologies/angular",
  "/recipes/angular/migration/angular-multiple": "/technologies/angular/migration/angular-multiple",
  "/recipes/angular/use-environment-variables-in-angular": "/technologies/angular/recipes/use-environment-variables-in-angular",
  "/recipes/angular/using-tailwind-css-with-angular-projects": "/technologies/angular/recipes/using-tailwind-css-with-angular-projects",
  "/recipes/angular/module-federation-with-ssr": "/technologies/angular/recipes/module-federation-with-ssr",
  "/recipes/angular/dynamic-module-federation-with-angular": "/technologies/angular/recipes/dynamic-module-federation-with-angular",
  "/recipes/angular/setup-incremental-builds-angular": "/technologies/angular/recipes/setup-incremental-builds-angular",
  
  // Node - all sub-paths follow same pattern
  "/recipes/node/:slug*": "/technologies/node/recipes/:slug*",
  
  // Storybook - all sub-paths follow same pattern
  "/recipes/storybook/:slug*": "/technologies/test-tools/storybook/recipes/:slug*",
  
  // Cypress - all sub-paths follow same pattern  
  "/recipes/cypress/:slug*": "/technologies/test-tools/cypress/recipes/:slug*",
  
  // Next - all sub-paths follow same pattern
  "/recipes/next/:slug*": "/technologies/react/next/recipes/:slug*",
  
  // Nuxt - all sub-paths follow same pattern
  "/recipes/nuxt/:slug*": "/technologies/vue/nuxt/recipes/:slug*",
  
  // Vite - all sub-paths follow same pattern
  "/recipes/vite/:slug*": "/technologies/build-tools/vite/recipes/:slug*",
  
  // Webpack - all sub-paths follow same pattern
  "/recipes/webpack/:slug*": "/technologies/build-tools/webpack/recipes/:slug*",
  
  // Tips-n-tricks - keeping individual because destinations vary greatly
  "/recipes/tips-n-tricks/eslint": "/technologies/eslint",
  "/recipes/tips-n-tricks/switch-to-workspaces-project-references": "/technologies/typescript/recipes/switch-to-workspaces-project-references",
  "/recipes/tips-n-tricks/enable-tsc-batch-mode": "/technologies/typescript/recipes/enable-tsc-batch-mode",
  "/recipes/tips-n-tricks/define-secondary-entrypoints": "/technologies/typescript/recipes/define-secondary-entrypoints",
  "/recipes/tips-n-tricks/compile-multiple-formats": "/technologies/typescript/recipes/compile-multiple-formats",
  "/recipes/tips-n-tricks/js-and-ts": "/technologies/typescript/recipes/js-and-ts",
  "/recipes/tips-n-tricks/flat-config": "/technologies/eslint/recipes/flat-config"
};

module.exports = { nxRecipesRedirects }; 