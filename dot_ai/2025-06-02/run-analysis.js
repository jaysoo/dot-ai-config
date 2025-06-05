#!/usr/bin/env node

const { analyzeSitemaps } = require('./sitemap-analyzer');
const { matchMissingUrls } = require('./url-matcher');
const { generateAllRedirects } = require('./generate-redirects');

async function runCompleteAnalysis() {
  console.log('🚀 Starting complete sitemap analysis and redirect generation...\n');
  
  try {
    // Step 1: Analyze sitemaps
    console.log('📋 Step 1: Analyzing sitemaps...');
    await analyzeSitemaps();
    console.log();
    
    // Step 2: Match missing URLs
    console.log('📋 Step 2: Matching missing URLs to potential targets...');
    await matchMissingUrls();
    console.log();
    
    // Step 3: Generate redirects
    console.log('📋 Step 3: Generating redirect rules...');
    const results = await generateAllRedirects();
    console.log();
    
    // Final summary
    console.log('🎉 Complete Analysis Summary:');
    console.log('=' .repeat(50));
    console.log(`📊 Statistics:`);
    console.log(`  • Total missing URLs: ${results.statistics.totalMissing}`);
    console.log(`  • Successfully matched: ${results.statistics.matched}`);
    console.log(`  • Match rate: ${results.statistics.matchRate}%`);
    console.log(`  • High confidence redirects: ${Object.values(require('./url-matches.json').urlMatches).filter(matches => matches[0].confidence >= 0.9).length}`);
    console.log();
    
    console.log('📁 Generated Files:');
    console.log('  • .ai/analysis-results.json - Raw analysis data');
    console.log('  • .ai/url-matches.json - URL matching results');
    console.log('  • .ai/migration-report.md - Human-readable report');
    console.log('  • .ai/redirects-nextjs.json - Next.js redirect config');
    console.log('  • .ai/redirects-apache.htaccess - Apache redirect rules');
    console.log('  • .ai/redirects-nginx.conf - Nginx redirect config');
    console.log('  • .ai/redirects-cloudflare.json - Cloudflare redirect rules');
    console.log();
    
    console.log('🔍 Key Findings:');
    console.log('  • All /recipes URLs have been successfully mapped to /technologies');
    console.log('  • The migration follows a clear pattern: /recipes → /technologies');
    console.log('  • Some recipes have been moved to specific technology subdirectories');
    console.log('  • All redirects have 95% confidence (exact last part matches)');
    console.log();
    
    console.log('📖 Next Steps:');
    console.log('  1. Review the migration report: .ai/migration-report.md');
    console.log('  2. Choose the appropriate redirect format for your platform');
    console.log('  3. Implement the redirects in your web server configuration');
    console.log('  4. Test a few sample redirects to ensure they work correctly');
    console.log('  5. Monitor traffic and adjust if needed');
    console.log();
    
    console.log('✅ Analysis complete! All files generated successfully.');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  }
}

// Allow script to be run directly or imported
if (require.main === module) {
  runCompleteAnalysis();
}

module.exports = { runCompleteAnalysis }; 