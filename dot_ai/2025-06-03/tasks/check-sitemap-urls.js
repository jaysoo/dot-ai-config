const fs = require('fs');
const path = require('path');

console.log('🌐 Checking all URLs from sitemap for HTTP status...\n');

// Read URLs from the file
const urlsFile = path.join(__dirname, 'urls-to-check.txt');
const urls = fs.readFileSync(urlsFile, 'utf8')
  .split('\n')
  .map(url => url.trim())
  .filter(url => url.length > 0);

console.log(`📊 Testing ${urls.length} URLs from sitemap...\n`);

// Test each URL
async function testUrl(url) {
  try {
    const response = await fetch(url, { 
      method: 'HEAD',
      timeout: 10000 // 10 second timeout
    });
    return {
      url,
      status: response.status,
      ok: response.ok,
      error: null
    };
  } catch (error) {
    return {
      url,
      status: null,
      ok: false,
      error: error.message
    };
  }
}

// Test all URLs in batches
async function checkAllUrls() {
  const results = [];
  const batchSize = 5; // Don't overwhelm the server
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`🔍 Testing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(urls.length/batchSize)} (${batch.length} URLs)...`);
    
    const batchResults = await Promise.all(batch.map(testUrl));
    results.push(...batchResults);
    
    // Progress update
    const processed = i + batch.length;
    const successCount = results.filter(r => r.ok).length;
    const failCount = results.filter(r => !r.ok).length;
    console.log(`  ✅ ${successCount} successful, ❌ ${failCount} failed (${processed}/${urls.length} total)`);
    
    // Small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Main execution
checkAllUrls().then(results => {
  console.log('\n📈 FINAL RESULTS:\n');
  
  const successful = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}\n`);
  
  // Write failed URLs to file
  const failedUrlsFile = path.join(__dirname, 'failed_url.txt');
  
  if (failed.length > 0) {
    console.log('❌ FAILED URLs:');
    const failedContent = failed.map(({ url, status, error }) => {
      const statusInfo = error ? `Error: ${error}` : `Status: ${status}`;
      console.log(`  ${url} - ${statusInfo}`);
      return `${url} - ${statusInfo}`;
    }).join('\n');
    
    fs.writeFileSync(failedUrlsFile, failedContent + '\n');
    console.log(`\n📝 Failed URLs written to: ${failedUrlsFile}\n`);
  } else {
    // Create empty file if no failures
    fs.writeFileSync(failedUrlsFile, '');
    console.log('🎉 All URLs are working! Empty failed_url.txt file created.\n');
  }
  
  if (successful.length === results.length) {
    console.log('🎉 All sitemap URLs are accessible!\n');
  } else {
    console.log('⚠️  Some URLs failed. Check failed_url.txt for details.\n');
  }
  
  // Show some examples
  if (successful.length > 0) {
    console.log('✅ Sample successful URLs:');
    successful.slice(0, 3).forEach(({ url }) => {
      console.log(`  ${url}`);
    });
    if (successful.length > 3) {
      console.log(`  ... and ${successful.length - 3} more`);
    }
  }
}).catch(error => {
  console.error('❌ URL checking failed:', error);
  process.exit(1);
}); 