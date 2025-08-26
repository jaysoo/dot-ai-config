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
    // Last segment matches exactly
    else if (oldSegments[oldSegments.length - 1] === newSegments[newSegments.length - 1]) {
      confidence = 'HIGH';
      reason = 'Exact filename match';
    }
    // Clear content migration patterns
    else if (oldPath.includes('/recipes/') && suggestedPath.includes('/guides/')) {
      confidence = 'HIGH';
      reason = 'Clear recipes->guides migration';
    }
    else if (oldPath.includes('/nx-api/') && suggestedPath.includes('/technologies/')) {
      confidence = 'HIGH';
      reason = 'Clear nx-api->technologies migration';
    }
    else if (oldPath.includes('/ci/features/') && suggestedPath.includes('/features/CI Features/')) {
      confidence = 'HIGH';
      reason = 'Clear CI features reorganization';
    }
    else if (oldPath.includes('/ci/concepts/') && suggestedPath.includes('/concepts/CI Concepts/')) {
      confidence = 'HIGH';
      reason = 'Clear CI concepts reorganization';
    }
    // MEDIUM confidence
    else if (score >= 2) {
      confidence = 'MEDIUM';
      reason = 'Partial path match';
    }
    // Multiple matching segments
    else if (oldSegments.filter(s => newSegments.includes(s)).length >= 2) {
      confidence = 'MEDIUM';
      reason = 'Multiple segment matches';
    }
    // LOW confidence
    else {
      confidence = 'LOW';
      reason = 'Weak match - manual review needed';
    }
  } else if (isSitemapMatch) {
    // Sitemap matches are generally lower confidence
    const sitemapMatch = sitemapMatchReport.matches.find(m => m.oldPath === oldPath);
    if (sitemapMatch?.sitemapMatch.type === 'exact') {
      confidence = 'MEDIUM';
      reason = 'Exact sitemap match';
    } else {
      confidence = 'LOW';
      reason = 'Sitemap partial match - verify manually';
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
    redirectData[section].working.push({
      oldPath,
      newPath: currentNewPath
    });
  }
  // Check if we have a fix
  else {
    const contentMatch = contentMatchReport.partialMatches.find(m => m.oldPath === oldPath);
    const sitemapMatch = sitemapMatchReport.matches.find(m => m.oldPath === oldPath);
    
    if (contentMatch || sitemapMatch) {
      const suggestedPath = contentMatch?.match.url || sitemapMatch?.sitemapMatch.url;
      const { confidence, reason } = getConfidenceScore(oldPath, suggestedPath, { contentMatch, sitemapMatch });
      
      redirectData[section].fixed.push({
        oldPath,
        currentNewPath,
        suggestedPath,
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
  broken: 0
};

// Process each section
const sortedSections = Object.keys(redirectData).sort();

for (const section of sortedSections) {
  const sectionData = redirectData[section];
  
  if (sectionData.working.length === 0 && sectionData.fixed.length === 0) {
    continue; // Skip sections with only broken redirects (will add at end)
  }
  
  newContent += `  // ${'='.repeat(50)}\n`;
  newContent += `  // ${section.toUpperCase()} SECTION\n`;
  newContent += `  // ${'='.repeat(50)}\n\n`;
  
  // Add working redirects
  if (sectionData.working.length > 0) {
    newContent += `  // ✅ WORKING REDIRECTS (${sectionData.working.length}) - NO CHANGES NEEDED\n`;
    for (const redirect of sectionData.working) {
      newContent += `  "${redirect.oldPath}": "${redirect.newPath}", // [WORKING - KEEP AS IS]\n`;
      stats.totalWorking++;
    }
    newContent += '\n';
  }
  
  // Add fixed redirects grouped by confidence
  if (sectionData.fixed.length > 0) {
    const highConf = sectionData.fixed.filter(f => f.confidence === 'HIGH');
    const medConf = sectionData.fixed.filter(f => f.confidence === 'MEDIUM');
    const lowConf = sectionData.fixed.filter(f => f.confidence === 'LOW');
    
    if (highConf.length > 0) {
      newContent += `  // 🟢 HIGH CONFIDENCE FIXES (${highConf.length})\n`;
      for (const fix of highConf) {
        if (fix.currentNewPath !== fix.suggestedPath) {
          newContent += `  // OLD: "${fix.oldPath}": "${fix.currentNewPath}",\n`;
        }
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [HIGH: ${fix.reason}]\n`;
        stats.highConfidence++;
      }
      newContent += '\n';
    }
    
    if (medConf.length > 0) {
      newContent += `  // 🟡 MEDIUM CONFIDENCE FIXES (${medConf.length}) - PLEASE REVIEW\n`;
      for (const fix of medConf) {
        if (fix.currentNewPath !== fix.suggestedPath) {
          newContent += `  // OLD: "${fix.oldPath}": "${fix.currentNewPath}",\n`;
        }
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [MEDIUM: ${fix.reason}]\n`;
        stats.mediumConfidence++;
      }
      newContent += '\n';
    }
    
    if (lowConf.length > 0) {
      newContent += `  // 🔴 LOW CONFIDENCE FIXES (${lowConf.length}) - MANUAL REVIEW REQUIRED\n`;
      for (const fix of lowConf) {
        if (fix.currentNewPath !== fix.suggestedPath) {
          newContent += `  // OLD: "${fix.oldPath}": "${fix.currentNewPath}",\n`;
        }
        newContent += `  "${fix.oldPath}": "${fix.suggestedPath}", // [LOW: ${fix.reason}]\n`;
        stats.lowConfidence++;
      }
      newContent += '\n';
    }
  }
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
      newContent += `  // "${broken.oldPath}": "${broken.currentNewPath}", // [NO MATCH FOUND]\n`;
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

// Generate detailed summary
const summaryPath = path.join(__dirname, 'confidence-summary.md');
let summary = `# Redirect Update Confidence Summary
Generated: ${new Date().toISOString()}

## Overall Statistics
- ✅ **Working Redirects (KEEP):** ${stats.totalWorking}
- 🟢 **High Confidence Fixes:** ${stats.highConfidence}
- 🟡 **Medium Confidence Fixes:** ${stats.mediumConfidence}
- 🔴 **Low Confidence Fixes:** ${stats.lowConfidence}
- ❌ **Broken (No Match):** ${stats.broken}

## Confidence Levels Explained

### 🟢 HIGH Confidence
These are very likely correct:
- Exact filename matches
- Clear migration patterns (recipes→guides, nx-api→technologies)
- Strong path similarity (4+ matching segments)

### 🟡 MEDIUM Confidence  
These need quick review:
- Partial path matches
- Multiple matching segments
- Exact sitemap matches

### 🔴 LOW Confidence
These need careful manual review:
- Weak matches
- Sitemap partial matches
- Few matching segments

## Section Breakdown
`;

for (const section of sortedSections) {
  const sectionData = redirectData[section];
  const total = sectionData.working.length + sectionData.fixed.length + sectionData.broken.length;
  
  if (total > 0) {
    summary += `\n### ${section.toUpperCase()}\n`;
    summary += `- Working: ${sectionData.working.length}\n`;
    
    const highConf = sectionData.fixed.filter(f => f.confidence === 'HIGH').length;
    const medConf = sectionData.fixed.filter(f => f.confidence === 'MEDIUM').length;
    const lowConf = sectionData.fixed.filter(f => f.confidence === 'LOW').length;
    
    if (sectionData.fixed.length > 0) {
      summary += `- Fixed: ${sectionData.fixed.length} (H:${highConf}, M:${medConf}, L:${lowConf})\n`;
    }
    if (sectionData.broken.length > 0) {
      summary += `- Broken: ${sectionData.broken.length}\n`;
    }
  }
}

fs.writeFileSync(summaryPath, summary);

console.log('✅ Updated redirect file with confidence scores');
console.log(`📊 Summary saved to ${summaryPath}`);
console.log('\nQuick Stats:');
console.log(`- Working (no review needed): ${stats.totalWorking}`);
console.log(`- High confidence fixes: ${stats.highConfidence}`);
console.log(`- Medium confidence (review): ${stats.mediumConfidence}`);
console.log(`- Low confidence (careful review): ${stats.lowConfidence}`);
console.log(`- Broken (no match): ${stats.broken}`);