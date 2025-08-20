#!/usr/bin/env node

import fs from 'fs';

function intelligentUrlMatch(foundUrl, expectedUrls) {
  // Remove leading/trailing slashes for comparison
  const normalizeUrl = (url) => url.replace(/^\/|\/$/g, '').toLowerCase();
  
  const foundNormalized = normalizeUrl(foundUrl);
  
  for (const expectedUrl of expectedUrls) {
    const expectedNormalized = normalizeUrl(expectedUrl);
    
    // Exact match
    if (foundNormalized === expectedNormalized) {
      return { match: true, type: 'exact', confidence: 'high' };
    }
    
    // Very close matches (common path variations)
    const closeMatches = [
      // reference vs references
      expectedNormalized.replace('reference/', 'references/'),
      expectedNormalized.replace('references/', 'reference/'),
      // ci/features vs features/ci-features  
      expectedNormalized.replace('ci/features/', 'features/ci-features/'),
      expectedNormalized.replace('features/ci-features/', 'ci/features/'),
      // recipes vs guides
      expectedNormalized.replace('/recipes/', '/guides/'),
      expectedNormalized.replace('/guides/', '/recipes/'),
      // concepts vs concept
      expectedNormalized.replace('concepts/', 'concept/'),
      expectedNormalized.replace('concept/', 'concepts/'),
    ];
    
    if (closeMatches.some(variant => foundNormalized === variant)) {
      return { match: true, type: 'path_variant', confidence: 'high' };
    }
    
    // Introduction pages are better than API pages for user experience
    if (expectedNormalized.endsWith('/api') && foundNormalized.endsWith('/introduction')) {
      const expectedBase = expectedNormalized.replace('/api', '');
      const foundBase = foundNormalized.replace('/introduction', '');
      if (expectedBase === foundBase) {
        return { match: true, type: 'better_intro_page', confidence: 'high' };
      }
    }
    
    // API vs generators (both are valid destinations)
    if (expectedNormalized.endsWith('/api') && foundNormalized.endsWith('/generators')) {
      const expectedBase = expectedNormalized.replace('/api', '');
      const foundBase = foundNormalized.replace('/generators', '');
      if (expectedBase === foundBase) {
        return { match: true, type: 'generators_instead_api', confidence: 'medium' };
      }
    }
    
    // Partial path matching for complex cases
    const expectedParts = expectedNormalized.split('/').filter(p => p.length > 2);
    const foundParts = foundNormalized.split('/').filter(p => p.length > 2);
    
    // Check if most significant parts match
    const significantMatches = expectedParts.filter(part => 
      foundParts.some(fPart => fPart.includes(part) || part.includes(fPart))
    );
    
    if (significantMatches.length >= Math.min(2, expectedParts.length - 1)) {
      return { match: true, type: 'semantic_match', confidence: 'medium' };
    }
  }
  
  return { match: false, type: 'no_match', confidence: 'none' };
}

function recalculateScore(searchResults, expectedUrls) {
  if (!expectedUrls || expectedUrls.length === 0) {
    return { score: 0, bestPosition: -1, matchType: 'no_expected_urls' };
  }
  
  let bestPosition = 10;
  let bestMatchType = 'no_match';
  let bestConfidence = 'none';
  
  for (let i = 0; i < Math.min(searchResults.length, 10); i++) {
    const result = searchResults[i];
    const match = intelligentUrlMatch(result.pathname, expectedUrls);
    
    if (match.match) {
      bestPosition = Math.min(bestPosition, i);
      if (match.confidence === 'high' || bestConfidence !== 'high') {
        bestMatchType = match.type;
        bestConfidence = match.confidence;
      }
    }
  }
  
  let score = 0;
  if (bestPosition < 10) {
    if (bestPosition <= 2) score = 3;
    else if (bestPosition <= 5) score = 2;  
    else if (bestPosition <= 8) score = 1;
    
    // Boost score for high confidence matches
    if (bestConfidence === 'high' && bestMatchType === 'better_intro_page') {
      score = Math.min(3, score + 1); // Introduction pages are often better than API
    }
  }
  
  return {
    score,
    bestPosition: bestPosition < 10 ? bestPosition + 1 : -1,
    matchType: bestMatchType,
    confidence: bestConfidence
  };
}

function recalculateAstroScores() {
  console.log('🔄 Recalculating Astro Scores with Intelligent URL Matching');
  console.log('='.repeat(60));
  
  const data = JSON.parse(fs.readFileSync('intelligent-search-results.json', 'utf8'));
  
  let totalNewScore = 0;
  let perfectResults = 0;
  let goodResults = 0;
  let unmatched = [];
  
  const recalculatedResults = data.keywordResults.map(result => {
    const newScoring = recalculateScore(result.searchResults, result.expectedUrls);
    
    const updatedResult = {
      ...result,
      recalculatedScore: newScoring.score,
      originalScore: result.oceanScore,
      matchType: newScoring.matchType,
      confidence: newScoring.confidence,
      improvement: newScoring.score - result.oceanScore
    };
    
    totalNewScore += newScoring.score;
    if (newScoring.score === 3) perfectResults++;
    if (newScoring.score > 0) goodResults++;
    
    if (newScoring.score === 0) {
      unmatched.push({
        keyword: result.keyword,
        category: result.category,
        expectedUrls: result.expectedUrls,
        actualUrls: result.searchResults.slice(0, 3).map(r => r.pathname),
        reason: 'no_intelligent_match_found'
      });
    }
    
    // Log the recalculation
    const statusIcon = newScoring.score > result.oceanScore ? '📈' : 
                      newScoring.score === result.oceanScore ? '➡️' : '📉';
    const matchDesc = newScoring.matchType !== 'no_match' ? ` (${newScoring.matchType})` : '';
    
    console.log(`${statusIcon} ${result.keyword}: ${result.oceanScore}/3 → ${newScoring.score}/3${matchDesc}`);
    
    return updatedResult;
  });
  
  const totalKeywords = data.keywordResults.length;
  const newOceanScore = (10 * totalNewScore) / (totalKeywords * 3);
  const originalOceanScore = data.summary.oceanScore;
  
  console.log('\n📊 RECALCULATED RESULTS');
  console.log('='.repeat(40));
  console.log(`Original Ocean Score: ${originalOceanScore.toFixed(2)}/10.0`);
  console.log(`Recalculated Score: ${newOceanScore.toFixed(2)}/10.0`);
  console.log(`Improvement: +${(newOceanScore - originalOceanScore).toFixed(2)}`);
  console.log(`Perfect Results: ${perfectResults}/${totalKeywords} (${(perfectResults/totalKeywords*100).toFixed(1)}%)`);
  console.log(`Good Results: ${goodResults}/${totalKeywords} (${(goodResults/totalKeywords*100).toFixed(1)}%)`);
  console.log(`Still Unmatched: ${unmatched.length}/${totalKeywords} (${(unmatched.length/totalKeywords*100).toFixed(1)}%)`);
  
  if (unmatched.length > 0) {
    console.log('\n❌ REMAINING UNMATCHED KEYWORDS:');
    console.log('='.repeat(40));
    unmatched.forEach(item => {
      console.log(`\n${item.keyword} (${item.category}):`);
      console.log(`  Expected: ${item.expectedUrls.join(', ')}`);
      console.log(`  Found: ${item.actualUrls.join(', ')}`);
    });
  }
  
  // Save recalculated results
  const recalculatedData = {
    ...data,
    recalculated: {
      timestamp: new Date().toISOString(),
      originalScore: originalOceanScore,
      recalculatedScore: newOceanScore,
      improvement: newOceanScore - originalOceanScore,
      perfectResults,
      goodResults,
      unmatched: unmatched.length
    },
    keywordResults: recalculatedResults
  };
  
  fs.writeFileSync('astro-recalculated-scores.json', JSON.stringify(recalculatedData, null, 2));
  console.log('\n💾 Recalculated results saved to: astro-recalculated-scores.json');
  
  return { newOceanScore, originalOceanScore, unmatched, perfectResults, goodResults };
}

recalculateAstroScores();