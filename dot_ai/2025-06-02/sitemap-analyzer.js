const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

// Parse XML sitemap and extract URLs
async function extractUrlsFromSitemap(filePath) {
  const xmlContent = fs.readFileSync(filePath, 'utf8');
  const result = await parseStringPromise(xmlContent);
  
  return result.urlset.url.map(item => {
    const loc = item.loc[0];
    return loc.replace('https://nx.dev', '');
  });
}

// Extract recipe URLs from latest sitemap
async function getRecipeUrls(sitemapPath) {
  const urls = await extractUrlsFromSitemap(sitemapPath);
  return urls.filter(url => url.startsWith('/recipes'));
}

// Extract recipe and technology URLs from canary sitemap
async function getRecipeAndTechUrls(sitemapPath) {
  const urls = await extractUrlsFromSitemap(sitemapPath);
  return urls.filter(url => url.startsWith('/recipes') || url.startsWith('/technologies'));
}

// Find missing URLs
function findMissingUrls(latestRecipes, canaryUrls) {
  return latestRecipes.filter(url => !canaryUrls.includes(url));
}

// Main analysis function
async function analyzeSitemaps() {
  try {
    console.log('🔍 Analyzing sitemaps...');
    
    const latestRecipes = await getRecipeUrls('.ai/sitemap-latest.xml');
    const canaryUrls = await getRecipeAndTechUrls('.ai/sitemap-canary.xml');
    
    const missingUrls = findMissingUrls(latestRecipes, canaryUrls);
    
    console.log('📊 Analysis Results:');
    console.log(`  Recipe URLs in latest: ${latestRecipes.length}`);
    console.log(`  Recipe/Tech URLs in canary: ${canaryUrls.length}`);
    console.log(`  Missing URLs: ${missingUrls.length}`);
    
    if (missingUrls.length > 0) {
      console.log('\n🚨 Missing URLs (first 10):');
      missingUrls.slice(0, 10).forEach(url => console.log(`  - ${url}`));
      if (missingUrls.length > 10) {
        console.log(`  ... and ${missingUrls.length - 10} more`);
      }
    }
    
    // Save results
    fs.writeFileSync('.ai/analysis-results.json', JSON.stringify({
      latestRecipes,
      canaryUrls,
      missingUrls,
      analysis: {
        latestRecipeCount: latestRecipes.length,
        canaryUrlCount: canaryUrls.length,
        missingUrlCount: missingUrls.length,
        timestamp: new Date().toISOString()
      }
    }, null, 2));
    
    console.log('\n✅ Analysis complete! Results saved to .ai/analysis-results.json');
    
    return { latestRecipes, canaryUrls, missingUrls };
  } catch (error) {
    console.error('❌ Error analyzing sitemaps:', error);
    throw error;
  }
}

module.exports = { analyzeSitemaps, extractUrlsFromSitemap, getRecipeUrls, getRecipeAndTechUrls, findMissingUrls };

if (require.main === module) {
  analyzeSitemaps();
} 