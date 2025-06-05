const nxRecipesRedirects = {
  // Tech-only URLs → /recipes endpoints
  '/recipes/module-federation': '/technologies/module-federation/recipes',
  '/recipes/react': '/technologies/react/recipes',
  '/recipes/angular': '/technologies/angular/recipes',
  '/recipes/node': '/technologies/node/recipes',
  '/recipes/storybook': '/technologies/test-tools/storybook/recipes',
  '/recipes/cypress': '/technologies/test-tools/cypress/recipes',
  '/recipes/next': '/technologies/react/next/recipes',
  '/recipes/nuxt': '/technologies/vue/nuxt/recipes',
  '/recipes/vite': '/technologies/build-tools/vite/recipes',
  '/recipes/webpack': '/technologies/build-tools/webpack/recipes',
  
  // Wildcard patterns for consistent tech sub-pages
  '/recipes/module-federation/:slug*': '/technologies/module-federation/recipes/:slug*',
  '/recipes/node/:slug*': '/technologies/node/recipes/:slug*',
  '/recipes/storybook/:slug*': '/technologies/test-tools/storybook/recipes/:slug*',
  '/recipes/cypress/:slug*': '/technologies/test-tools/cypress/recipes/:slug*',
  '/recipes/next/:slug*': '/technologies/react/next/recipes/:slug*',
  '/recipes/nuxt/:slug*': '/technologies/vue/nuxt/recipes/:slug*',
  '/recipes/vite/:slug*': '/technologies/build-tools/vite/recipes/:slug*',
  '/recipes/webpack/:slug*': '/technologies/build-tools/webpack/recipes/:slug*',
  
  // React - now using wildcard pattern (fixed typo and condensed)
  '/recipes/react/:slug*': '/technologies/react/recipes/:slug*',
  
  // Angular - using wildcard for rspack sub-paths, individual for special cases
  '/recipes/angular/rspack': '/technologies/angular/angular-rspack/recipes',
  '/recipes/angular/rspack/introduction': '/technologies/angular/angular-rspack/introduction',
  '/recipes/angular/rspack/:slug*': '/technologies/angular/angular-rspack/recipes/:slug*',
  '/recipes/angular/migration': '/technologies/angular/migration',
  '/recipes/angular/migration/angular': '/technologies/angular',
  '/recipes/angular/migration/angular-multiple': '/technologies/angular/migration/angular-multiple',
  // All other angular recipes follow standard pattern
  '/recipes/angular/:slug*': '/technologies/angular/recipes/:slug*',
  
  // Tips-n-tricks - keeping individual because destinations vary greatly
  '/recipes/tips-n-tricks/eslint': '/technologies/eslint',
  '/recipes/tips-n-tricks/:slug*': '/technologies/typescript/recipes/:slug*',
  '/recipes/tips-n-tricks/flat-config': '/technologies/eslint/recipes/flat-config',
};

module.exports = { nxRecipesRedirects }; 