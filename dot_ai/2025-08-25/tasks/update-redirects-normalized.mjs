#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all reports
const contentMatchReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-match-report.json'), 'utf8'));
const sitemapMatchReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'sitemap-match-report.json'), 'utf8'));
const verificationReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'url-verification-report.json'), 'utf8'));
const originalRedirects = JSON.parse(fs.readFileSync(path.join(__dirname, 'redirects.json'), 'utf8'));

// Function to normalize URLs according to Astro's rules
function normalizeAstroUrl(url) {
  // Split URL into segments
  const parts = url.split('/');
  
  // Process each segment
  const normalizedParts = parts.map(part => {
    if (!part) return part; // Keep empty parts (for leading/trailing slashes)
    
    // Convert to lowercase
    let normalized = part.toLowerCase();
    
    // Remove special characters (except dashes and underscores)
    // & is removed, other special chars too
    normalized = normalized.replace(/[&]/g, '');
    normalized = normalized.replace(/[^a-z0-9\s\-_]/g, '');
    
    // Replace spaces with dashes
    normalized = normalized.replace(/\s+/g, '-');
    
    // Clean up multiple dashes
    normalized = normalized.replace(/-+/g, '-');
    
    // Remove leading/trailing dashes
    normalized = normalized.replace(/^-+|-+$/g, '');
    
    return normalized;
  });
  
  // Rejoin and clean up
  let result = normalizedParts.join('/');
  
  // Clean up any double slashes (except after protocol)
  result = result.replace(/([^:])\/\//g, '$1/');
  
  return result;
}

// Function to calculate confidence score
function getConfidenceScore(oldPath, suggestedPath, matchData) {
  let confidence = 'LOW';
  let reason = '';
  
  const oldSegments = oldPath.split('/').filter(Boolean);
  const newSegments = suggestedPath.split('/').filter(Boolean);
  
  // Check if it's from sitemap (generally lower confidence)
  const isSitemapMatch = sitemapMatchReport.matches.some(m => m.oldPath === oldPath);
  
  // Check if it's from content match
  const contentMatch = contentMatchReport.partialMatches.find(m => m.oldPath === oldPath);
  
  if (contentMatch) {
    const score = contentMatch.score;
    
    // HIGH confidence scenarios
    if (score >= 4) {
      confidence = 'HIGH';
      reason = 'Strong path similarity';
    }
    // Last segment matches exactly (after normalization)
    else if (normalizeAstroUrl(oldSegments[oldSegments.length - 1]) === normalizeAstroUrl(newSegments[newSegments.length - 1])) {
      confidence = 'HIGH';
      reason = 'Exact filename match';
    }
    // Clear content migration patterns
    else if (oldPath.includes('/recipes/') && suggestedPath.includes('/guides/')) {
      confidence = 'HIGH';
      reason = 'recipes→guides migration';
    }
    else if (oldPath.includes('/nx-api/') && suggestedPath.includes('/technologies/')) {
      confidence = 'HIGH';
      reason = 'nx-api→technologies migration';
    }
    else if (oldPath.includes('/ci/features/') && suggestedPath.includes('/features/')) {
      confidence = 'HIGH';
      reason = 'CI features reorganization';
    }
    else if (oldPath.includes('/ci/concepts/') && suggestedPath.includes('/concepts/')) {
      confidence = 'HIGH';
      reason = 'CI concepts reorganization';
    }
    // MEDIUM confidence
    else if (score >= 2) {
      confidence = 'MEDIUM';
      reason = 'Partial path match';
    }
    // Multiple matching segments
    else if (oldSegments.filter(s => newSegments.some(n => normalizeAstroUrl(n) === normalizeAstroUrl(s))).length >= 2) {
      confidence = 'MEDIUM';
      reason = 'Multiple segment matches';
    }
    // LOW confidence
    else {
      confidence = 'LOW';
      reason = 'Weak match - review needed';
    }
  } else if (isSitemapMatch) {
    // Sitemap matches are generally lower confidence
    const sitemapMatch = sitemapMatchReport.matches.find(m => m.oldPath === oldPath);
    if (sitemapMatch?.sitemapMatch.type === 'exact') {
      confidence = 'MEDIUM';
      reason = 'Exact sitemap match';
    } else {
      confidence = 'LOW';
      reason = 'Sitemap partial match';
    }
  }
  
  return { confidence, reason };
}

// Read the original file
const redirectsPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const originalContent = fs.readFileSync(redirectsPath, 'utf8');

// Parse the file
const objectMatch = originalContent.match(/const\s+docsToAstroRedirects\s*=\s*({[\s\S]*?});/);
if (!objectMatch) {
  console.error('Could not find docsToAstroRedirects object');
  process.exit(1);
}

// Build comprehensive redirect data
const redirectData = {};
const brokenRedirects = [];
const workingPaths = new Set(verificationReport.working.map(w => w.oldPath));

// Track URL transformations for reporting
const urlTransformations = [];

// Process each redirect
for (const [oldPath, currentNewPath] of Object.entries(originalRedirects)) {
  const section = oldPath.split('/')[1] || 'root';
  
  if (!redirectData[section]) {
    redirectData[section] = {
      working: [],
      fixed: [],
      broken: []
    };
  }
  
  // Check if it's already working
  if (workingPaths.has(oldPath)) {
    // Normalize the working URL too
    const normalizedPath = normalizeAstroUrl(currentNewPath);
    if (normalizedPath !== currentNewPath) {
      urlTransformations.push({
        original: currentNewPath,
        normalized: normalizedPath
      });
    }
    redirectData[section].working.push({
      oldPath,
      newPath: normalizedPath
    });
  }
  // Check if we have a fix
  else {
    const contentMatch = contentMatchReport.partialMatches.find(m => m.oldPath === oldPath);
    const sitemapMatch = sitemapMatchReport.matches.find(m => m.oldPath === oldPath);
    
    if (contentMatch || sitemapMatch) {
      const suggestedPath = contentMatch?.match.url || sitemapMatch?.sitemapMatch.url;
      const normalizedPath = normalizeAstroUrl(suggestedPath);
      
      // Track if URL was transformed
      if (normalizedPath !== suggestedPath) {
        urlTransformations.push({
          original: suggestedPath,
          normalized: normalizedPath
        });
      }
      
      const { confidence, reason } = getConfidenceScore(oldPath, normalizedPath, { contentMatch, sitemapMatch });
      
      redirectData[section].fixed.push({
        oldPath,
        currentNewPath,
        suggestedPath: normalizedPath,
        confidence,
        reason
      });
    } else {
      redirectData[section].broken.push({
        oldPath,
        currentNewPath
      });
    }
  }
}

// Build the new file content
const beforeObject = originalContent.substring(0, objectMatch.index);
const afterObject = originalContent.substring(objectMatch.index + objectMatch[0].length);

let newContent = 'const docsToAstroRedirects = {\n';

// Statistics for summary
const stats = {
  totalWorking: 0,
  highConfidence: 0,
  mediumConfidence: 0,
  lowConfidence: 0,
  broken: 0,
  urlsNormalized: urlTransformations.length
};

// Process each section
const sortedSections = Object.keys(redirectData).sort();

for (const section of sortedSections) {
  const sectionData = redirectData[section];
  
  if (sectionData.working.length === 0 && sectionData.fixed.length === 0) {
    continue; // Skip sections with only broken redirects (will add at end)
  }
  
  newContent += `  // ========== ${section.toUpperCase()} ==========\n`;
  
  // Add working redirects
  if (sectionData.working.length > 0) {
    newContent += `  // ✅ WORKING (${sectionData.working.length}) - NO REVIEW NEEDED\n`;
    for (const redirect of sectionData.working) {
      newContent += `  "${redirect.oldPath}": "${redirect.newPath}", // [WORKING]\n`;
      stats.totalWorking++;
    }
    if (sectionData.fixed.length > 0) {
      newContent += '\n';
    }
  }
  
  // Add fixed redirects grouped by confidence
  if (sectionData.fixed.length > 0) {
    const highConf = sectionData.fixed.filter(f => f.confidence === 'HIGH');
    const medConf = sectionData.fixed.filter(f => f.confidence === 'MEDIUM');
    const lowConf = sectionData.fixed.filter(f => f.confidence === 'LOW');
    
    if (highConf.length > 0) {
      newContent += `  // 🟢 HIGH CONFIDENCE (${highConf.length})\n`;
      for (const fix of highConf) {
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [HIGH: ${fix.reason}]\n`;
        stats.highConfidence++;
      }
      if (medConf.length > 0 || lowConf.length > 0) {
        newContent += '\n';
      }
    }
    
    if (medConf.length > 0) {
      newContent += `  // 🟡 MEDIUM CONFIDENCE (${medConf.length}) - PLEASE REVIEW\n`;
      for (const fix of medConf) {
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [MEDIUM: ${fix.reason}]\n`;
        stats.mediumConfidence++;
      }
      if (lowConf.length > 0) {
        newContent += '\n';
      }
    }
    
    if (lowConf.length > 0) {
      newContent += `  // 🔴 LOW CONFIDENCE (${lowConf.length}) - MANUAL REVIEW REQUIRED\n`;
      for (const fix of lowConf) {
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [LOW: ${fix.reason}]\n`;
        stats.lowConfidence++;
      }
    }
  }
  
  newContent += '\n';
}

// Add broken redirects at the end
newContent += `  // ${'='.repeat(60)}\n`;
newContent += `  // ❌ BROKEN REDIRECTS - NO CONTENT FOUND\n`;
newContent += `  // These URLs have no matching content in docs or sitemap\n`;
newContent += `  // Consider removing these or migrating the content\n`;
newContent += `  // ${'='.repeat(60)}\n\n`;

for (const section of sortedSections) {
  const sectionData = redirectData[section];
  
  if (sectionData.broken.length > 0) {
    newContent += `  // ${section.toUpperCase()} - ${sectionData.broken.length} broken\n`;
    for (const broken of sectionData.broken) {
      newContent += `  // "${broken.oldPath}": "${broken.currentNewPath}", // [NO MATCH]\n`;
      stats.broken++;
    }
    newContent += '\n';
  }
}

// Remove trailing comma and close
newContent = newContent.replace(/,(\s*)$/, '$1');
newContent += '};\n';

// Write the updated file
const newFileContent = beforeObject + newContent + afterObject;
fs.writeFileSync(redirectsPath, newFileContent);

// Write transformation log
const transformLog = path.join(__dirname, 'url-transformations.txt');
let logContent = 'URL NORMALIZATIONS APPLIED\n';
logContent += '===========================\n\n';

// Group transformations by pattern
const patterns = {
  spaces: [],
  uppercase: [],
  ampersand: [],
  multiple: []
};

for (const transform of urlTransformations) {
  const hasSpaces = transform.original.includes(' ');
  const hasUppercase = transform.original !== transform.original.toLowerCase();
  const hasAmpersand = transform.original.includes('&');
  
  if (hasSpaces && (hasUppercase || hasAmpersand)) {
    patterns.multiple.push(transform);
  } else if (hasSpaces) {
    patterns.spaces.push(transform);
  } else if (hasUppercase) {
    patterns.uppercase.push(transform);
  } else if (hasAmpersand) {
    patterns.ampersand.push(transform);
  }
}

if (patterns.spaces.length > 0) {
  logContent += 'SPACES REPLACED WITH DASHES:\n';
  for (const t of patterns.spaces.slice(0, 5)) {
    logContent += `  ${t.original}\n  → ${t.normalized}\n\n`;
  }
  if (patterns.spaces.length > 5) {
    logContent += `  ... and ${patterns.spaces.length - 5} more\n\n`;
  }
}

if (patterns.ampersand.length > 0) {
  logContent += 'AMPERSANDS REMOVED:\n';
  for (const t of patterns.ampersand.slice(0, 5)) {
    logContent += `  ${t.original}\n  → ${t.normalized}\n\n`;
  }
  if (patterns.ampersand.length > 5) {
    logContent += `  ... and ${patterns.ampersand.length - 5} more\n\n`;
  }
}

if (patterns.uppercase.length > 0) {
  logContent += 'UPPERCASE TO LOWERCASE:\n';
  for (const t of patterns.uppercase.slice(0, 5)) {
    logContent += `  ${t.original}\n  → ${t.normalized}\n\n`;
  }
  if (patterns.uppercase.length > 5) {
    logContent += `  ... and ${patterns.uppercase.length - 5} more\n\n`;
  }
}

if (patterns.multiple.length > 0) {
  logContent += 'MULTIPLE TRANSFORMATIONS:\n';
  for (const t of patterns.multiple.slice(0, 5)) {
    logContent += `  ${t.original}\n  → ${t.normalized}\n\n`;
  }
  if (patterns.multiple.length > 5) {
    logContent += `  ... and ${patterns.multiple.length - 5} more\n\n`;
  }
}

fs.writeFileSync(transformLog, logContent);

// Generate summary
console.log('✅ Updated redirect file with normalized URLs');
console.log('\nURL Normalization Applied:');
console.log('- Lowercase: All URLs converted to lowercase');
console.log('- Spaces: Replaced with dashes (-)');
console.log('- Ampersands (&): Removed');
console.log('- Special characters: Removed');
console.log(`\nTotal URLs normalized: ${stats.urlsNormalized}`);
console.log(`Transformation log saved to: ${transformLog}`);
console.log('\nStatistics:');
console.log(`- ✅ Working (no review): ${stats.totalWorking}`);
console.log(`- 🟢 High confidence: ${stats.highConfidence}`);
console.log(`- 🟡 Medium confidence (review): ${stats.mediumConfidence}`);
console.log(`- 🔴 Low confidence (careful review): ${stats.lowConfidence}`);
console.log(`- ❌ Broken (no match): ${stats.broken}`);