const { nxRecipesRedirects: originalRedirects } = require('./redirects-simple');
const { nxRecipesRedirects: optimizedRedirects } = require('./redirects-optimized');

console.log('🔍 Analyzing redirect optimizations...\n');

// Extract original URLs and their destinations
const originalEntries = Object.entries(originalRedirects);
const optimizedEntries = Object.entries(optimizedRedirects);

console.log(`📊 Original redirects: ${originalEntries.length}`);
console.log(`📊 Optimized redirects: ${optimizedEntries.length}`);
console.log(`📈 Reduction: ${originalEntries.length - optimizedEntries.length} entries\n`);

// Test that we can resolve all original URLs with the new pattern
console.log('🧪 Testing original URLs against optimized patterns...\n');

const errors = [];
const successes = [];

// Simple pattern matcher for :slug* wildcards
function matchesPattern(url, pattern) {
  if (!pattern.includes(':slug*')) {
    return url === pattern;
  }
  
  const basePattern = pattern.replace('/:slug*', '');
  return url.startsWith(basePattern + '/') || url === basePattern;
}

function resolveUrl(originalUrl, optimizedRedirects) {
  // First check for exact match
  if (optimizedRedirects[originalUrl]) {
    return optimizedRedirects[originalUrl];
  }
  
  // Then check wildcard patterns
  for (const [pattern, destination] of Object.entries(optimizedRedirects)) {
    if (pattern.includes(':slug*') && matchesPattern(originalUrl, pattern)) {
      const basePattern = pattern.replace('/:slug*', '');
      const slug = originalUrl.substring(basePattern.length + 1);
      const baseDestination = destination.replace('/:slug*', '');
      return slug ? `${baseDestination}/${slug}` : baseDestination;
    }
  }
  
  return null;
}

// Test each original URL
originalEntries.forEach(([originalUrl, expectedDestination]) => {
  const resolvedDestination = resolveUrl(originalUrl, optimizedRedirects);
  
  if (resolvedDestination === expectedDestination) {
    successes.push({ originalUrl, destination: resolvedDestination });
  } else {
    errors.push({ 
      originalUrl, 
      expected: expectedDestination, 
      resolved: resolvedDestination 
    });
  }
});

console.log(`✅ Successfully resolved: ${successes.length}/${originalEntries.length}`);
console.log(`❌ Errors: ${errors.length}\n`);

if (errors.length > 0) {
  console.log('❌ ERRORS FOUND:');
  errors.forEach(({ originalUrl, expected, resolved }) => {
    console.log(`  ${originalUrl}`);
    console.log(`    Expected: ${expected}`);
    console.log(`    Resolved: ${resolved || 'NOT FOUND'}\n`);
  });
} else {
  console.log('🎉 All original URLs can be resolved correctly!\n');
}

// Show the fixes applied
console.log('🔧 FIXES APPLIED:\n');

console.log('1️⃣ Tech-only URLs now end with /recipes:');
const techOnlyFixes = [
  '/recipes/module-federation',
  '/recipes/react', 
  '/recipes/angular',
  '/recipes/node',
  '/recipes/storybook',
  '/recipes/cypress',
  '/recipes/next',
  '/recipes/nuxt',
  '/recipes/vite',
  '/recipes/webpack'
];

techOnlyFixes.forEach(url => {
  const original = originalRedirects[url];
  const optimized = optimizedRedirects[url];
  console.log(`  ${url}`);
  console.log(`    Before: ${original}`);
  console.log(`    After:  ${optimized}\n`);
});

console.log('2️⃣ Condensed into wildcard patterns:');
const wildcardPatterns = optimizedEntries
  .filter(([pattern]) => pattern.includes(':slug*'))
  .map(([pattern]) => pattern);

wildcardPatterns.forEach(pattern => {
  const basePattern = pattern.replace('/:slug*', '');
  const originalCount = originalEntries.filter(([url]) => 
    url.startsWith(basePattern + '/') && url !== basePattern
  ).length;
  console.log(`  ${pattern} (covers ${originalCount} original URLs)`);
});

console.log('\n✨ Optimization complete!'); 