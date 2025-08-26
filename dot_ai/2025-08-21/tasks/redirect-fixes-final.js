/**
 * Final Redirect Fixes for DOC-154
 * Generated: 2025-08-21
 * 
 * Analysis of 76 failed URLs shows:
 * - 11 Troubleshooting URLs: Need /docs prefix (currently redirect without it)
 * - 29 Technology URLs: Content moved to /docs/technologies/{tech}/Guides/
 * - 20 URLs: Content merged into parent pages or consolidated
 * - 16 URLs: Content doesn't exist in Astro yet (Docker, etc.)
 */

const redirectFixes = {
  // === TROUBLESHOOTING FIXES (11) ===
  // These currently redirect to /troubleshooting/* but should go to /docs/troubleshooting/*
  // The content has been consolidated in Astro docs
  '/recipes/troubleshooting/ts-solution-style': '/docs/troubleshooting',
  '/recipes/troubleshooting/reduce-typescript-compilations': '/docs/troubleshooting',
  '/recipes/troubleshooting/resolve-lockfile-conflicts': '/docs/troubleshooting',
  '/recipes/troubleshooting/updating-nx': '/docs/troubleshooting',
  '/recipes/troubleshooting/verbose-logging': '/docs/troubleshooting',
  '/recipes/troubleshooting/angular-cache': '/docs/troubleshooting',
  '/recipes/troubleshooting/clear-the-cache': '/docs/troubleshooting/troubleshoot-cache-misses',
  '/recipes/troubleshooting/react-typescript-compile-errors': '/docs/troubleshooting',
  '/recipes/troubleshooting/react-native-command-pod-install-unrecognized': '/docs/troubleshooting',
  '/recipes/troubleshooting/expo-native-dependency': '/docs/troubleshooting',
  '/recipes/troubleshooting/graph-restore-focus': '/docs/troubleshooting',

  // === MODULE FEDERATION REDIRECTS (3) ===
  // Content verified to exist at these locations
  '/recipes/module-federation/create-a-host': '/docs/technologies/module-federation/Guides/create-a-host',
  '/recipes/module-federation/create-a-remote': '/docs/technologies/module-federation/Guides/create-a-remote',
  '/recipes/module-federation/federate-a-module': '/docs/technologies/module-federation/Guides/federate-a-module',

  // === REACT REDIRECTS (9) ===
  '/recipes/react/react-dynamic-module-federation': '/docs/technologies/module-federation/Guides', // Consolidated
  '/recipes/react/react-module-federation-with-ssr': '/docs/technologies/react/Guides/module-federation-with-ssr',
  '/recipes/react/use-environment-variables-in-react': '/docs/technologies/react/Guides/use-environment-variables-in-react',
  '/recipes/react/using-tailwind-css-in-react': '/docs/technologies/react/Guides/using-tailwind-css-in-react',
  '/recipes/react/storybook-interaction-tests': '/docs/technologies/test-tools/storybook/Guides/storybook-interaction-tests',
  '/recipes/react/react-app-to-azure-static-web-service': '/docs/technologies/react', // Not migrated yet
  '/recipes/react/remix-application-to-a-different-provider': '/docs/technologies/react/Guides/remix',
  '/recipes/react/react-native-and-web-components': '/docs/technologies/react/Guides/react-native',
  '/recipes/react/deploy-nextjs-to-vercel': '/docs/technologies/react/Guides/deploy-nextjs-to-vercel',

  // === ANGULAR REDIRECTS (7) ===
  '/recipes/angular/angular-dynamic-module-federation': '/docs/technologies/angular/Guides/dynamic-module-federation-with-angular',
  '/recipes/angular/angular-module-federation-with-ssr': '/docs/technologies/angular/Guides/module-federation-with-ssr',
  '/recipes/angular/use-environment-variables-in-angular': '/docs/technologies/angular/Guides/use-environment-variables-in-angular',
  '/recipes/angular/using-tailwind-css-with-angular-projects': '/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects',
  '/recipes/angular/angular-setup-incremental-builds': '/docs/technologies/angular/Guides/setup-incremental-builds-angular',
  '/recipes/angular/angular-lazy-load-libraries': '/docs/technologies/angular', // Not migrated yet
  '/recipes/angular/angular-project-to-ghpages': '/docs/technologies/angular', // Not migrated yet

  // === NODE.JS REDIRECTS (7) ===
  // Note: Many Node deployment guides consolidated into single serverless guide
  '/recipes/node/node-server-fly-io': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/node-lambda-serverless-framework': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/node-aws-lambda': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-fastify-to-railway': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-koa-to-heroku': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-nestjs-to-render': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/set-up-express-proxies': '/docs/technologies/node/Guides/node-serverless-functions-netlify',

  // === WEBPACK REDIRECTS (5) ===
  '/recipes/webpack/webpack-typescript-monorepo': '/docs/technologies/build-tools/webpack',
  '/recipes/webpack/webpack-plugin-overview': '/docs/technologies/build-tools/webpack',
  '/recipes/webpack/webpack-config-setup': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  '/recipes/webpack/webpack-stylesheets-sass': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  '/recipes/webpack/webpack-react-module-federation': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',

  // === VITE REDIRECTS (1) ===
  '/recipes/vite/set-up-vite-manually': '/docs/technologies/build-tools/vite',

  // === STORYBOOK REDIRECTS (11) ===
  '/recipes/storybook/overview-react': '/docs/technologies/test-tools/storybook/Guides/overview-react',
  '/recipes/storybook/overview-angular': '/docs/technologies/test-tools/storybook/Guides/overview-angular',
  '/recipes/storybook/custom-builder-configs': '/docs/technologies/test-tools/storybook/Guides/custom-builder-configs',
  '/recipes/storybook/angular-storybook-interaction-tests': '/docs/technologies/test-tools/storybook/Guides/storybook-interaction-tests',
  '/recipes/storybook/angular-storybook-compodoc': '/docs/technologies/test-tools/storybook/Guides/angular-storybook-compodoc',
  '/recipes/storybook/angular-output-and-input-properties': '/docs/technologies/test-tools/storybook',
  '/recipes/storybook/angular-route-providers': '/docs/technologies/test-tools/storybook',
  '/recipes/storybook/one-storybook-for-all': '/docs/technologies/test-tools/storybook/Guides/one-storybook-for-all',
  '/recipes/storybook/one-storybook-per-scope': '/docs/technologies/test-tools/storybook/Guides/one-storybook-per-scope',
  '/recipes/storybook/storybook-composition-setup': '/docs/technologies/test-tools/storybook/Guides/storybook-composition-setup',
  '/recipes/storybook/angular-property-controls': '/docs/technologies/test-tools/storybook',

  // === TIPS & TRICKS REDIRECTS (2) ===
  '/recipes/tips-n-tricks/js-and-ts': '/docs/technologies/typescript/Guides/js-and-ts',
  '/recipes/tips-n-tricks/flat-config': '/docs/technologies/eslint/Guides/flat-config',

  // === DOCKER REDIRECTS (11) - CONTENT NOT MIGRATED YET ===
  // These should remain pointing to production nx.dev until content is migrated
  // Commenting out for now - let existing redirects handle these
  /*
  '/recipes/docker/build-angular-application-in-docker': null,
  '/recipes/docker/build-fastify-application-in-docker': null,
  '/recipes/docker/build-express-application-in-docker': null,
  '/recipes/docker/build-koa-application-in-docker': null,
  '/recipes/docker/build-nestjs-application-in-docker': null,
  '/recipes/docker/build-react-application-in-docker': null,
  '/recipes/docker/build-remix-application-in-docker': null,
  '/recipes/docker/build-nextjs-application-in-docker': null,
  '/recipes/docker/build-react-native-application-in-docker': null,
  '/recipes/docker/build-vue-application-in-docker': null,
  '/recipes/docker/build-nuxt-application-in-docker': null,
  */

  // === OTHER MISSING CONTENT (5) ===
  // These don't have equivalent pages in Astro yet
  /*
  '/recipes/vue/deploy-nuxt-to-vercel': null,
  '/recipes/playwright/playwright-ct-angular': null,
  '/recipes/playwright/playwright-ct-react': null,
  '/recipes/expo/test-app-detox': null,
  '/recipes/managing-repository/*': null,
  */
};

// Summary for implementation
const summary = {
  totalFixes: 56, // 76 total - 20 that don't exist yet
  categories: {
    troubleshooting: 11,
    moduleFederation: 3,
    react: 9,
    angular: 7,
    node: 7,
    webpack: 5,
    vite: 1,
    storybook: 11,
    tipsAndTricks: 2
  },
  notMigrated: {
    docker: 11,
    otherContent: 9
  }
};

module.exports = { redirectFixes, summary };