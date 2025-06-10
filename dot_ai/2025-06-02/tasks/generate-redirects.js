const fs = require('fs');

// Generate Next.js redirect rules
function generateNextjsRedirects(urlMatches, confidenceThreshold = 0.7) {
  const redirects = [];
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    if (bestMatch.confidence >= confidenceThreshold) {
      redirects.push({
        source: oldUrl,
        destination: bestMatch.newUrl,
        permanent: true
      });
    }
  });
  
  return redirects;
}

// Generate Apache .htaccess redirect rules
function generateApacheRedirects(urlMatches, confidenceThreshold = 0.7) {
  const redirects = [];
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    if (bestMatch.confidence >= confidenceThreshold) {
      redirects.push(`Redirect 301 ${oldUrl} ${bestMatch.newUrl}`);
    }
  });
  
  return redirects;
}

// Generate Nginx redirect rules
function generateNginxRedirects(urlMatches, confidenceThreshold = 0.7) {
  const redirects = [];
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    if (bestMatch.confidence >= confidenceThreshold) {
      // Escape special regex characters in the old URL
      const escapedOldUrl = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      redirects.push(`rewrite ^${escapedOldUrl}$ ${bestMatch.newUrl} permanent;`);
    }
  });
  
  return redirects;
}

// Generate Cloudflare redirect rules
function generateCloudflareRedirects(urlMatches, confidenceThreshold = 0.7) {
  const redirects = [];
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    if (bestMatch.confidence >= confidenceThreshold) {
      redirects.push({
        source_url: `https://nx.dev${oldUrl}`,
        target_url: `https://nx.dev${bestMatch.newUrl}`,
        status_code: 301,
        preserve_query_string: true
      });
    }
  });
  
  return redirects;
}

// Generate human-readable migration report
function generateMigrationReport(urlMatches, unmatchedUrls, statistics) {
  const report = [];
  
  report.push('# Nx Documentation Migration Report');
  report.push('');
  report.push('## Summary');
  report.push('');
  report.push(`- **Total URLs analyzed**: ${statistics.totalMissing}`);
  report.push(`- **URLs with redirects**: ${statistics.matched}`);
  report.push(`- **URLs without redirects**: ${statistics.unmatched}`);
  report.push(`- **Match rate**: ${statistics.matchRate}%`);
  report.push('');
  
  // Group by confidence levels
  const highConfidence = [];
  const mediumConfidence = [];
  const lowConfidence = [];
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    if (bestMatch.confidence >= 0.9) {
      highConfidence.push({ oldUrl, bestMatch });
    } else if (bestMatch.confidence >= 0.7) {
      mediumConfidence.push({ oldUrl, bestMatch });
    } else {
      lowConfidence.push({ oldUrl, bestMatch });
    }
  });
  
  if (highConfidence.length > 0) {
    report.push(`## High Confidence Redirects (${highConfidence.length} URLs)`);
    report.push('');
    report.push('These redirects have 90%+ confidence and should be safe to implement:');
    report.push('');
    highConfidence.forEach(({ oldUrl, bestMatch }) => {
      report.push(`- \`${oldUrl}\` → \`${bestMatch.newUrl}\` (${Math.round(bestMatch.confidence * 100)}% - ${bestMatch.matchType})`);
    });
    report.push('');
  }
  
  if (mediumConfidence.length > 0) {
    report.push(`## Medium Confidence Redirects (${mediumConfidence.length} URLs)`);
    report.push('');
    report.push('These redirects have 70-89% confidence and should be reviewed:');
    report.push('');
    mediumConfidence.forEach(({ oldUrl, bestMatch }) => {
      report.push(`- \`${oldUrl}\` → \`${bestMatch.newUrl}\` (${Math.round(bestMatch.confidence * 100)}% - ${bestMatch.matchType})`);
    });
    report.push('');
  }
  
  if (lowConfidence.length > 0) {
    report.push(`## Low Confidence Redirects (${lowConfidence.length} URLs)`);
    report.push('');
    report.push('These redirects have <70% confidence and require manual review:');
    report.push('');
    lowConfidence.forEach(({ oldUrl, bestMatch }) => {
      report.push(`- \`${oldUrl}\` → \`${bestMatch.newUrl}\` (${Math.round(bestMatch.confidence * 100)}% - ${bestMatch.matchType})`);
    });
    report.push('');
  }
  
  if (unmatchedUrls.length > 0) {
    report.push(`## Unmatched URLs (${unmatchedUrls.length} URLs)`);
    report.push('');
    report.push('These URLs could not be automatically matched and require manual mapping:');
    report.push('');
    unmatchedUrls.forEach(url => {
      report.push(`- \`${url}\``);
    });
    report.push('');
  }
  
  report.push('## Pattern Analysis');
  report.push('');
  
  // Analyze patterns
  const patterns = {};
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0];
    const oldBase = oldUrl.split('/')[1];
    const newBase = bestMatch.newUrl.split('/')[1];
    const pattern = `${oldBase} → ${newBase}`;
    patterns[pattern] = (patterns[pattern] || 0) + 1;
  });
  
  report.push('Common migration patterns:');
  report.push('');
  Object.entries(patterns)
    .sort(([,a], [,b]) => b - a)
    .forEach(([pattern, count]) => {
      report.push(`- \`${pattern}\`: ${count} URLs`);
    });
  
  return report.join('\n');
}

// Main function to generate all redirect formats
async function generateAllRedirects() {
  try {
    console.log('🔍 Loading URL matching results...');
    
    if (!fs.existsSync('.ai/url-matches.json')) {
      throw new Error('URL matches not found. Run url-matcher.js first.');
    }
    
    const matchData = JSON.parse(fs.readFileSync('.ai/url-matches.json', 'utf8'));
    const { urlMatches, unmatchedUrls, statistics } = matchData;
    
    console.log(`📝 Generating redirect rules for ${statistics.matched} matched URLs...`);
    
    // Generate different redirect formats
    const nextjsRedirects = generateNextjsRedirects(urlMatches);
    const apacheRedirects = generateApacheRedirects(urlMatches);
    const nginxRedirects = generateNginxRedirects(urlMatches);
    const cloudflareRedirects = generateCloudflareRedirects(urlMatches);
    const migrationReport = generateMigrationReport(urlMatches, unmatchedUrls, statistics);
    
    // Save all outputs
    const outputs = [
      {
        filename: '.ai/redirects-nextjs.json',
        content: JSON.stringify(nextjsRedirects, null, 2),
        description: 'Next.js redirect configuration'
      },
      {
        filename: '.ai/redirects-apache.htaccess',
        content: apacheRedirects.join('\n'),
        description: 'Apache .htaccess redirect rules'
      },
      {
        filename: '.ai/redirects-nginx.conf',
        content: nginxRedirects.join('\n'),
        description: 'Nginx redirect configuration'
      },
      {
        filename: '.ai/redirects-cloudflare.json',
        content: JSON.stringify(cloudflareRedirects, null, 2),
        description: 'Cloudflare redirect rules'
      },
      {
        filename: '.ai/migration-report.md',
        content: migrationReport,
        description: 'Human-readable migration report'
      }
    ];
    
    console.log('\n📁 Saving redirect files:');
    outputs.forEach(({ filename, content, description }) => {
      fs.writeFileSync(filename, content);
      console.log(`  ✅ ${filename} - ${description}`);
    });
    
    // Generate summary
    console.log('\n📊 Redirect Summary:');
    console.log(`  High confidence (≥90%): ${Object.values(urlMatches).filter(matches => matches[0].confidence >= 0.9).length} URLs`);
    console.log(`  Medium confidence (70-89%): ${Object.values(urlMatches).filter(matches => matches[0].confidence >= 0.7 && matches[0].confidence < 0.9).length} URLs`);
    console.log(`  Low confidence (<70%): ${Object.values(urlMatches).filter(matches => matches[0].confidence < 0.7).length} URLs`);
    console.log(`  Total redirects generated: ${nextjsRedirects.length}`);
    
    console.log('\n✅ All redirect files generated successfully!');
    console.log('\n📖 Next steps:');
    console.log('  1. Review the migration report: .ai/migration-report.md');
    console.log('  2. Implement high-confidence redirects first');
    console.log('  3. Manually review medium and low confidence redirects');
    console.log('  4. Choose the appropriate redirect format for your platform');
    
    return {
      nextjsRedirects,
      apacheRedirects,
      nginxRedirects,
      cloudflareRedirects,
      migrationReport,
      statistics
    };
  } catch (error) {
    console.error('❌ Error generating redirects:', error);
    throw error;
  }
}

module.exports = {
  generateAllRedirects,
  generateNextjsRedirects,
  generateApacheRedirects,
  generateNginxRedirects,
  generateCloudflareRedirects,
  generateMigrationReport
};

if (require.main === module) {
  generateAllRedirects();
} 