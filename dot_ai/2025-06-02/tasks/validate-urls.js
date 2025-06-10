const { nxRecipesRedirects } = require('./redirects-final');

console.log('🌐 Validating all redirect destination URLs against canary.nx.dev...\n');

// Extract all unique destination URLs, expanding wildcards with sample URLs
const originalRedirects = require('./redirects-simple').nxRecipesRedirects;
const destinationUrls = new Set();

// Add all destinations from the optimized redirects
Object.entries(nxRecipesRedirects).forEach(([source, destination]) => {
  if (destination.includes(':slug*')) {
    // For wildcards, we need to test with actual URLs from the original data
    const baseSource = source.replace('/:slug*', '');
    Object.entries(originalRedirects).forEach(([origSource, origDest]) => {
      if (origSource.startsWith(baseSource + '/') && origSource !== baseSource) {
        destinationUrls.add(origDest);
      }
    });
    // Also add the base destination
    const baseDest = destination.replace('/:slug*', '');
    destinationUrls.add(baseDest);
  } else {
    destinationUrls.add(destination);
  }
});

// Convert to array and sort
const urlsToTest = Array.from(destinationUrls).sort();

console.log(`📊 Testing ${urlsToTest.length} unique destination URLs...\n`);

// Test each URL
async function testUrl(url) {
  const fullUrl = `https://canary.nx.dev${url}`;
  try {
    const response = await fetch(fullUrl, { method: 'HEAD' });
    return {
      url,
      fullUrl,
      status: response.status,
      ok: response.ok,
      error: null
    };
  } catch (error) {
    return {
      url,
      fullUrl,
      status: null,
      ok: false,
      error: error.message
    };
  }
}

// Test all URLs
async function validateAllUrls() {
  const results = [];
  const batchSize = 5; // Don't overwhelm the server
  
  for (let i = 0; i < urlsToTest.length; i += batchSize) {
    const batch = urlsToTest.slice(i, i + batchSize);
    console.log(`🔍 Testing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urlsToTest.length/batchSize)} (${batch.length} URLs)...`);
    
    const batchResults = await Promise.all(batch.map(testUrl));
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < urlsToTest.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Main execution
validateAllUrls().then(results => {
  console.log('\n📈 RESULTS:\n');
  
  const successful = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`);
  
  if (failed.length > 0) {
    console.log('❌ FAILED URLs:');
    failed.forEach(({ url, status, error, fullUrl }) => {
      console.log(`  ${url} (${fullUrl})`);
      if (error) {
        console.log(`    Error: ${error}`);
      } else {
        console.log(`    Status: ${status}`);
      }
    });
    console.log();
  }
  
  if (successful.length === results.length) {
    console.log('🎉 All destination URLs are valid!\n');
  } else {
    console.log('⚠️  Some URLs failed validation. Please review the redirects.\n');
  }
  
  // Show some successful examples
  console.log('✅ Sample successful URLs:');
  successful.slice(0, 5).forEach(({ url, fullUrl }) => {
    console.log(`  ${url} → ${fullUrl}`);
  });
  
  if (successful.length > 5) {
    console.log(`  ... and ${successful.length - 5} more`);
  }
}).catch(error => {
  console.error('❌ Validation failed:', error);
}); 