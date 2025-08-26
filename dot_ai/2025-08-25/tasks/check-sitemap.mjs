#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load previous reports
const reportPath = path.join(__dirname, 'url-verification-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const matchReportPath = path.join(__dirname, 'content-match-report.json');
const matchReport = JSON.parse(fs.readFileSync(matchReportPath, 'utf8'));

const SITEMAP_URL = 'https://canary.nx.dev/docs/sitemap-0.xml';

// Function to fetch and parse sitemap
async function fetchSitemap() {
  console.log(`Fetching sitemap from ${SITEMAP_URL}...`);
  
  try {
    const response = await fetch(SITEMAP_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap: ${response.status}`);
    }
    
    const xml = await response.text();
    
    // Extract URLs from sitemap
    const urlMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
    const urls = [];
    
    for (const match of urlMatches) {
      const url = match[1];
      // Extract path from full URL
      const urlObj = new URL(url);
      urls.push(urlObj.pathname);
    }
    
    console.log(`Found ${urls.length} URLs in sitemap\n`);
    return urls;
  } catch (error) {
    console.error('Error fetching sitemap:', error.message);
    return [];
  }
}

// Function to find best match from sitemap
function findBestSitemapMatch(targetPath, sitemapUrls) {
  // First try exact match
  if (sitemapUrls.includes(targetPath)) {
    return { url: targetPath, score: 100, type: 'exact' };
  }
  
  // Extract key segments from target
  const targetSegments = targetPath.split('/').filter(Boolean);
  const targetLastSegment = targetSegments[targetSegments.length - 1];
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const sitemapUrl of sitemapUrls) {
    const sitemapSegments = sitemapUrl.split('/').filter(Boolean);
    
    // Calculate similarity score
    let score = 0;
    
    // Check for matching segments
    for (const segment of targetSegments) {
      if (sitemapSegments.includes(segment)) {
        score += 10;
      }
    }
    
    // Boost if last segment matches
    if (sitemapSegments[sitemapSegments.length - 1] === targetLastSegment) {
      score += 30;
    }
    
    // Check for similar structure
    if (Math.abs(targetSegments.length - sitemapSegments.length) <= 1) {
      score += 5;
    }
    
    // Special cases for common transformations
    // recipes/X -> docs/guides/X or docs/technologies/Y/Guides/X
    if (targetPath.startsWith('/docs/recipes/')) {
      const recipeName = targetPath.replace('/docs/recipes/', '');
      if (sitemapUrl.includes('/guides/') && sitemapUrl.includes(recipeName.split('/').pop())) {
        score += 20;
      }
      if (sitemapUrl.includes('/Guides/') && sitemapUrl.includes(recipeName.split('/').pop())) {
        score += 20;
      }
    }
    
    // nx-api/X -> docs/technologies/X
    if (targetPath.startsWith('/docs/nx-api/')) {
      const apiName = targetPath.replace('/docs/nx-api/', '').split('/')[0];
      if (sitemapUrl.includes(`/technologies/${apiName}`)) {
        score += 25;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = sitemapUrl;
    }
  }
  
  if (bestScore >= 30) {
    return { url: bestMatch, score: bestScore, type: 'partial' };
  }
  
  return null;
}

// Main analysis
async function analyzeSitemapMatches() {
  const sitemapUrls = await fetchSitemap();
  
  if (sitemapUrls.length === 0) {
    console.error('Failed to fetch sitemap URLs');
    return;
  }
  
  // Analyze broken URLs that had no content matches
  const noMatchUrls = matchReport.noMatches;
  const sitemapMatches = {
    found: [],
    notFound: [],
    suggestions: {}
  };
  
  console.log(`Analyzing ${noMatchUrls.length} URLs with no content matches against sitemap...\n`);
  
  for (const broken of noMatchUrls) {
    const match = findBestSitemapMatch(broken.newPath, sitemapUrls);
    
    if (match) {
      sitemapMatches.found.push({
        ...broken,
        sitemapMatch: match
      });
      sitemapMatches.suggestions[broken.oldPath] = match.url;
    } else {
      sitemapMatches.notFound.push(broken);
    }
  }
  
  // Create sitemap analysis report
  const sitemapReport = {
    summary: {
      totalAnalyzed: noMatchUrls.length,
      foundInSitemap: sitemapMatches.found.length,
      notInSitemap: sitemapMatches.notFound.length,
      sitemapTotalUrls: sitemapUrls.length
    },
    matches: sitemapMatches.found,
    noMatches: sitemapMatches.notFound,
    suggestions: sitemapMatches.suggestions
  };
  
  // Save sitemap report
  const sitemapReportPath = path.join(__dirname, 'sitemap-match-report.json');
  fs.writeFileSync(sitemapReportPath, JSON.stringify(sitemapReport, null, 2));
  console.log(`Sitemap match report saved to: ${sitemapReportPath}`);
  
  // Add to suggested fixes
  const additionalFixesPath = path.join(__dirname, 'sitemap-suggested-fixes.txt');
  let fixesContent = '=== SITEMAP-BASED SUGGESTED FIXES ===\n\n';
  
  fixesContent += `Summary:\n`;
  fixesContent += `- URLs found in sitemap: ${sitemapMatches.found.length}\n`;
  fixesContent += `- URLs not in sitemap: ${sitemapMatches.notFound.length}\n\n`;
  
  if (sitemapMatches.found.length > 0) {
    fixesContent += '=== FOUND IN SITEMAP ===\n';
    fixesContent += 'These redirects can be updated to point to existing sitemap URLs:\n\n';
    
    // Group by match type
    const exactMatches = sitemapMatches.found.filter(m => m.sitemapMatch.type === 'exact');
    const partialMatches = sitemapMatches.found.filter(m => m.sitemapMatch.type === 'partial');
    
    if (exactMatches.length > 0) {
      fixesContent += 'Exact matches:\n';
      for (const match of exactMatches) {
        fixesContent += `"${match.oldPath}": "${match.sitemapMatch.url}",\n`;
      }
      fixesContent += '\n';
    }
    
    if (partialMatches.length > 0) {
      fixesContent += 'Partial matches (verify manually):\n';
      for (const match of partialMatches.slice(0, 50)) { // Show first 50
        fixesContent += `"${match.oldPath}": "${match.sitemapMatch.url}", // Score: ${match.sitemapMatch.score}\n`;
      }
      if (partialMatches.length > 50) {
        fixesContent += `... and ${partialMatches.length - 50} more partial matches\n`;
      }
    }
  }
  
  fs.writeFileSync(additionalFixesPath, fixesContent);
  console.log(`Sitemap-based fixes saved to: ${additionalFixesPath}`);
  
  console.log('\n=== SITEMAP ANALYSIS SUMMARY ===');
  console.log(`Total URLs analyzed: ${noMatchUrls.length}`);
  console.log(`Found in sitemap: ${sitemapMatches.found.length}`);
  console.log(`Not found anywhere: ${sitemapMatches.notFound.length}`);
  
  return sitemapReport;
}

// Run the analysis
analyzeSitemapMatches().catch(console.error);