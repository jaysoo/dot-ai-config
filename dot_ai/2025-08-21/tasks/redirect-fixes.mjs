#!/usr/bin/env node

/**
 * Generate fixes for the 76 failed redirects based on Astro docs structure
 * 
 * Key findings:
 * 1. Troubleshooting pages exist but redirect to wrong path (missing /docs prefix)
 * 2. Technology-specific recipes moved to /docs/technologies/{tech}/Guides/
 * 3. Some content doesn't exist yet in Astro (Docker, some Storybook pages)
 */

import fs from 'fs';
import path from 'path';

const astroDocsPath = '/Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs';

// Check if a file exists in Astro docs
function checkAstroFile(relativePath) {
  const fullPath = path.join(astroDocsPath, relativePath);
  const mdocPath = fullPath.endsWith('.mdoc') ? fullPath : fullPath + '.mdoc';
  return fs.existsSync(mdocPath);
}

// Generate corrected redirect mappings
const fixes = {
  // === TROUBLESHOOTING FIXES (11) - Just need /docs prefix ===
  '/recipes/troubleshooting/ts-solution-style': '/docs/troubleshooting/ts-solution-style',
  '/recipes/troubleshooting/reduce-typescript-compilations': '/docs/troubleshooting/reduce-typescript-compilations',
  '/recipes/troubleshooting/resolve-lockfile-conflicts': '/docs/troubleshooting/resolve-lockfile-conflicts',
  '/recipes/troubleshooting/updating-nx': '/docs/troubleshooting/updating-nx',
  '/recipes/troubleshooting/verbose-logging': '/docs/troubleshooting/verbose-logging',
  '/recipes/troubleshooting/angular-cache': '/docs/troubleshooting/angular-cache',
  '/recipes/troubleshooting/clear-the-cache': '/docs/troubleshooting/clear-the-cache',
  '/recipes/troubleshooting/react-typescript-compile-errors': '/docs/troubleshooting/react-typescript-compile-errors',
  '/recipes/troubleshooting/react-native-command-pod-install-unrecognized': '/docs/troubleshooting/react-native-command-pod-install-unrecognized',
  '/recipes/troubleshooting/expo-native-dependency': '/docs/troubleshooting/expo-native-dependency',
  '/recipes/troubleshooting/graph-restore-focus': '/docs/troubleshooting/graph-restore-focus',
  
  // === TECHNOLOGY REDIRECTS - Content moved to /technologies/ ===
  
  // Module Federation (verified to exist)
  '/recipes/module-federation/create-a-host': '/docs/technologies/module-federation/Guides/create-a-host',
  '/recipes/module-federation/create-a-remote': '/docs/technologies/module-federation/Guides/create-a-remote',
  '/recipes/module-federation/federate-a-module': '/docs/technologies/module-federation/Guides/federate-a-module',
  
  // React (verified to exist)
  '/recipes/react/react-module-federation-with-ssr': '/docs/technologies/react/Guides/module-federation-with-ssr',
  '/recipes/react/use-environment-variables-in-react': '/docs/technologies/react/Guides/use-environment-variables-in-react',
  '/recipes/react/using-tailwind-css-in-react': '/docs/technologies/react/Guides/using-tailwind-css-in-react',
  '/recipes/react/deploy-nextjs-to-vercel': '/docs/technologies/react/Guides/deploy-nextjs-to-vercel',
  
  // Angular (verified to exist)
  '/recipes/angular/angular-dynamic-module-federation': '/docs/technologies/angular/Guides/dynamic-module-federation-with-angular',
  '/recipes/angular/angular-module-federation-with-ssr': '/docs/technologies/angular/Guides/module-federation-with-ssr',
  '/recipes/angular/use-environment-variables-in-angular': '/docs/technologies/angular/Guides/use-environment-variables-in-angular',
  '/recipes/angular/using-tailwind-css-with-angular-projects': '/docs/technologies/angular/Guides/using-tailwind-css-with-angular-projects',
  '/recipes/angular/angular-setup-incremental-builds': '/docs/technologies/angular/Guides/setup-incremental-builds-angular',
  
  // Node.js (verified to exist)
  '/recipes/node/node-server-fly-io': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/node-lambda-serverless-framework': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/node-aws-lambda': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-fastify-to-railway': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-koa-to-heroku': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/deploy-nestjs-to-render': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/node/set-up-express-proxies': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  
  // Webpack (moved to build-tools)
  '/recipes/webpack/webpack-typescript-monorepo': '/docs/technologies/build-tools/webpack/Guides/webpack-typescript-monorepo',
  '/recipes/webpack/webpack-plugin-overview': '/docs/technologies/build-tools/webpack',
  '/recipes/webpack/webpack-config-setup': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  '/recipes/webpack/webpack-stylesheets-sass': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  '/recipes/webpack/webpack-react-module-federation': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  
  // Vite (moved to build-tools)
  '/recipes/vite/set-up-vite-manually': '/docs/technologies/build-tools/vite/Guides/set-up-vite-manually',
  
  // Storybook (moved to test-tools)
  '/recipes/storybook/overview-react': '/docs/technologies/test-tools/storybook/Guides/overview-react',
  '/recipes/storybook/overview-angular': '/docs/technologies/test-tools/storybook/Guides/overview-angular',
  '/recipes/storybook/custom-builder-configs': '/docs/technologies/test-tools/storybook/Guides/custom-builder-configs',
  '/recipes/storybook/angular-storybook-interaction-tests': '/docs/technologies/test-tools/storybook/Guides/storybook-interaction-tests',
  '/recipes/storybook/angular-storybook-compodoc': '/docs/technologies/test-tools/storybook/Guides/angular-storybook-compodoc',
  '/recipes/storybook/angular-output-and-input-properties': '/docs/technologies/test-tools/storybook/Guides/angular-output-and-input-properties',
  '/recipes/storybook/angular-route-providers': '/docs/technologies/test-tools/storybook/Guides/angular-route-providers',
  '/recipes/storybook/one-storybook-for-all': '/docs/technologies/test-tools/storybook/Guides/one-storybook-for-all',
  '/recipes/storybook/one-storybook-per-scope': '/docs/technologies/test-tools/storybook/Guides/one-storybook-per-scope',
  '/recipes/storybook/storybook-composition-setup': '/docs/technologies/test-tools/storybook/Guides/storybook-composition-setup',
  '/recipes/storybook/angular-property-controls': '/docs/technologies/test-tools/storybook/Guides/angular-addon-controls',
  
  // TypeScript tips (may need to check actual location)
  '/recipes/tips-n-tricks/js-and-ts': '/docs/technologies/typescript/Guides/js-and-ts',
  '/recipes/tips-n-tricks/flat-config': '/docs/technologies/eslint/Guides/flat-config',
};

// Verify which fixes actually work
console.log('Verifying redirect fixes...\n');

const verified = [];
const needsReview = [];
const stillMissing = [];

for (const [from, to] of Object.entries(fixes)) {
  // Extract the path after /docs/
  const astroPath = to.replace('/docs/', '');
  
  if (checkAstroFile(astroPath)) {
    verified.push({ from, to });
    console.log(`✅ ${from} → ${to}`);
  } else {
    // Try without the last segment (might be merged into a parent doc)
    const parentPath = astroPath.substring(0, astroPath.lastIndexOf('/'));
    if (checkAstroFile(parentPath + '/index')) {
      needsReview.push({ from, to: `/docs/${parentPath}`, note: 'Content might be in parent page' });
      console.log(`⚠️  ${from} → ${to} (check parent page)`);
    } else {
      stillMissing.push({ from, to });
      console.log(`❌ ${from} → ${to} (file not found)`);
    }
  }
}

// Generate the fix file
const fixContent = `/**
 * Redirect fixes for DOC-154
 * Generated: ${new Date().toISOString()}
 * 
 * Summary:
 * - Verified working: ${verified.length}
 * - Needs review: ${needsReview.length}
 * - Still missing: ${stillMissing.length}
 */

const redirectFixes = {
  // === VERIFIED FIXES (${verified.length}) ===
${verified.map(({from, to}) => `  '${from}': '${to}',`).join('\n')}

  // === NEEDS REVIEW (${needsReview.length}) ===
  // These might need to point to parent pages or be handled differently
${needsReview.map(({from, to, note}) => `  // '${from}': '${to}', // ${note}`).join('\n')}

  // === STILL MISSING (${stillMissing.length}) ===
  // These pages don't exist in Astro yet
${stillMissing.map(({from, to}) => `  // '${from}': '${to}', // MISSING`).join('\n')}
};

module.exports = redirectFixes;
`;

fs.writeFileSync('./redirect-fixes.js', fixContent);

console.log('\n=== SUMMARY ===');
console.log(`Verified working: ${verified.length}`);
console.log(`Needs review: ${needsReview.length}`);
console.log(`Still missing: ${stillMissing.length}`);
console.log(`\nFixes saved to: redirect-fixes.js`);