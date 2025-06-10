const fs = require('fs');

// Calculate similarity between two strings using Levenshtein distance
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance implementation
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Extract meaningful parts from URL for matching
function extractUrlParts(url) {
  const parts = url.split('/').filter(part => part.length > 0);
  const lastPart = parts[parts.length - 1];
  const secondLastPart = parts.length > 1 ? parts[parts.length - 2] : '';
  
  return {
    lastPart,
    secondLastPart,
    fullPath: parts.join('/'),
    pathWithoutFirst: parts.slice(1).join('/'),
    keywords: parts.filter(part => part.length > 2) // Extract meaningful keywords
  };
}

// Calculate keyword overlap score
function calculateKeywordOverlap(url1Parts, url2Parts) {
  const keywords1 = new Set(url1Parts.keywords);
  const keywords2 = new Set(url2Parts.keywords);
  
  const intersection = new Set([...keywords1].filter(x => keywords2.has(x)));
  const union = new Set([...keywords1, ...keywords2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Find best matches for a missing URL
function findBestMatches(missingUrl, canaryUrls, threshold = 0.25) {
  const missingParts = extractUrlParts(missingUrl);
  const matches = [];
  
  for (const canaryUrl of canaryUrls) {
    const canaryParts = extractUrlParts(canaryUrl);
    
    // Calculate different types of similarity
    const lastPartSimilarity = calculateSimilarity(missingParts.lastPart, canaryParts.lastPart);
    const pathSimilarity = calculateSimilarity(missingParts.pathWithoutFirst, canaryParts.pathWithoutFirst);
    const fullSimilarity = calculateSimilarity(missingParts.fullPath, canaryParts.fullPath);
    const keywordOverlap = calculateKeywordOverlap(missingParts, canaryParts);
    
    let confidence = 0;
    let matchType = '';
    
    // Exact match on last part gets highest score
    if (missingParts.lastPart === canaryParts.lastPart) {
      confidence = 0.95;
      matchType = 'exact_last_part';
    }
    // High similarity on last part
    else if (lastPartSimilarity > 0.8) {
      confidence = lastPartSimilarity * 0.85;
      matchType = 'similar_last_part';
    }
    // High keyword overlap
    else if (keywordOverlap > 0.5) {
      confidence = keywordOverlap * 0.75;
      matchType = 'keyword_overlap';
    }
    // High similarity on path without first segment
    else if (pathSimilarity > 0.6) {
      confidence = pathSimilarity * 0.7;
      matchType = 'path_similarity';
    }
    // General similarity
    else if (fullSimilarity > threshold) {
      confidence = fullSimilarity * 0.5;
      matchType = 'general_similarity';
    }
    
    if (confidence > threshold) {
      matches.push({
        oldUrl: missingUrl,
        newUrl: canaryUrl,
        confidence: Math.round(confidence * 100) / 100,
        matchType,
        similarities: {
          lastPart: Math.round(lastPartSimilarity * 100) / 100,
          path: Math.round(pathSimilarity * 100) / 100,
          full: Math.round(fullSimilarity * 100) / 100,
          keywords: Math.round(keywordOverlap * 100) / 100
        }
      });
    }
  }
  
  // Sort by confidence descending
  return matches.sort((a, b) => b.confidence - a.confidence);
}

// Main matching function
async function matchMissingUrls() {
  try {
    console.log('🔍 Loading analysis results...');
    
    if (!fs.existsSync('.ai/analysis-results.json')) {
      throw new Error('Analysis results not found. Run sitemap-analyzer.js first.');
    }
    
    const analysisData = JSON.parse(fs.readFileSync('.ai/analysis-results.json', 'utf8'));
    const { missingUrls, canaryUrls } = analysisData;
    
    console.log(`📝 Matching ${missingUrls.length} missing URLs against ${canaryUrls.length} canary URLs...`);
    
    const urlMatches = {};
    const unmatchedUrls = [];
    let matchedCount = 0;
    
    for (let i = 0; i < missingUrls.length; i++) {
      const missingUrl = missingUrls[i];
      const matches = findBestMatches(missingUrl, canaryUrls);
      
      if (matches.length > 0) {
        urlMatches[missingUrl] = matches;
        matchedCount++;
        
        if ((i + 1) % 10 === 0) {
          console.log(`  Processed ${i + 1}/${missingUrls.length} URLs...`);
        }
      } else {
        unmatchedUrls.push(missingUrl);
      }
    }
    
    console.log(`\n📊 Matching Results:`);
    console.log(`  URLs with potential matches: ${matchedCount}`);
    console.log(`  URLs without matches: ${unmatchedUrls.length}`);
    
    // Show some examples
    console.log(`\n🎯 Top matches (first 5):`);
    const sortedMatches = Object.entries(urlMatches)
      .map(([url, matches]) => ({ url, bestMatch: matches[0] }))
      .sort((a, b) => b.bestMatch.confidence - a.bestMatch.confidence)
      .slice(0, 5);
    
    sortedMatches.forEach(({ url, bestMatch }) => {
      console.log(`  ${url} → ${bestMatch.newUrl} (${Math.round(bestMatch.confidence * 100)}%)`);
    });
    
    if (unmatchedUrls.length > 0) {
      console.log(`\n❌ Unmatched URLs (first 5):`);
      unmatchedUrls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
      if (unmatchedUrls.length > 5) {
        console.log(`  ... and ${unmatchedUrls.length - 5} more`);
      }
    }
    
    // Save results
    const matchResults = {
      urlMatches,
      unmatchedUrls,
      statistics: {
        totalMissing: missingUrls.length,
        matched: matchedCount,
        unmatched: unmatchedUrls.length,
        matchRate: Math.round((matchedCount / missingUrls.length) * 100),
        timestamp: new Date().toISOString()
      }
    };
    
    fs.writeFileSync('.ai/url-matches.json', JSON.stringify(matchResults, null, 2));
    console.log(`\n✅ Matching complete! Results saved to .ai/url-matches.json`);
    
    return matchResults;
  } catch (error) {
    console.error('❌ Error matching URLs:', error);
    throw error;
  }
}

module.exports = { 
  matchMissingUrls, 
  findBestMatches, 
  calculateSimilarity, 
  extractUrlParts, 
  calculateKeywordOverlap 
};

if (require.main === module) {
  matchMissingUrls();
} 