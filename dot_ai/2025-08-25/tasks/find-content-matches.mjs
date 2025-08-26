#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the verification report
const reportPath = path.join(__dirname, 'url-verification-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Load all redirects
const redirectsPath = path.join(__dirname, 'redirects.json');
const allRedirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const ASTRO_DOCS_BASE = '/Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs';

// Function to recursively find all .mdoc files
function findMdocFiles(dir, files = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      findMdocFiles(fullPath, files);
    } else if (item.name.endsWith('.mdoc') || item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Convert file path to URL path
function filePathToUrl(filePath) {
  const relative = path.relative(ASTRO_DOCS_BASE, filePath);
  const urlPath = '/docs/' + relative
    .replace(/\.(mdoc|md)$/, '')
    .replace(/\\/g, '/');
  
  // Handle index files
  if (urlPath.endsWith('/index')) {
    return urlPath.slice(0, -6); // Remove '/index'
  }
  
  return urlPath;
}

// Extract title from mdoc/md file
function extractTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Try to extract from frontmatter
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const titleMatch = frontmatterMatch[1].match(/title:\s*['"]?([^'"\n]+)['"]?/);
      if (titleMatch) {
        return titleMatch[1];
      }
    }
    
    // Try to extract first H1
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1];
    }
    
    return path.basename(filePath, path.extname(filePath));
  } catch (error) {
    return null;
  }
}

// Main analysis
function analyzeContentMatches() {
  console.log('Finding all content files in astro-docs...');
  const contentFiles = findMdocFiles(ASTRO_DOCS_BASE);
  console.log(`Found ${contentFiles.length} content files\n`);

  // Create a map of available content
  const availableContent = {};
  for (const file of contentFiles) {
    const url = filePathToUrl(file);
    const title = extractTitle(file);
    availableContent[url] = {
      file: path.relative('/Users/jack/projects/nx-worktrees/DOC-154', file),
      title,
      url
    };
  }

  // Analyze broken URLs
  const matches = {
    exact: [],
    partial: [],
    noMatch: [],
    suggestions: {}
  };

  console.log(`Analyzing ${report.broken.length} broken URLs...\n`);

  for (const broken of report.broken) {
    const targetPath = broken.newPath;
    
    // Check for exact match
    if (availableContent[targetPath]) {
      matches.exact.push({
        ...broken,
        match: availableContent[targetPath]
      });
      continue;
    }
    
    // Check for partial matches (different path structure)
    const pathSegments = targetPath.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [contentUrl, contentInfo] of Object.entries(availableContent)) {
      const contentSegments = contentUrl.split('/').filter(Boolean);
      
      // Score based on matching segments
      let score = 0;
      for (const segment of pathSegments) {
        if (contentSegments.includes(segment)) {
          score++;
        }
      }
      
      // Boost score if the last segment matches
      if (contentSegments[contentSegments.length - 1] === lastSegment) {
        score += 2;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = contentInfo;
      }
    }
    
    if (bestScore >= 2) {
      matches.partial.push({
        ...broken,
        match: bestMatch,
        score: bestScore
      });
      matches.suggestions[targetPath] = bestMatch.url;
    } else {
      matches.noMatch.push(broken);
    }
  }

  // Generate report
  const matchReport = {
    summary: {
      total: report.broken.length,
      exactMatches: matches.exact.length,
      partialMatches: matches.partial.length,
      noMatches: matches.noMatch.length
    },
    exactMatches: matches.exact,
    partialMatches: matches.partial,
    noMatches: matches.noMatch,
    suggestions: matches.suggestions
  };

  // Save the match report
  const matchReportPath = path.join(__dirname, 'content-match-report.json');
  fs.writeFileSync(matchReportPath, JSON.stringify(matchReport, null, 2));
  console.log(`Content match report saved to: ${matchReportPath}`);

  // Create suggested fixes file
  const fixesPath = path.join(__dirname, 'suggested-redirect-fixes.txt');
  let fixesContent = '=== SUGGESTED REDIRECT FIXES ===\n\n';
  
  fixesContent += `Summary:\n`;
  fixesContent += `- Exact matches found: ${matches.exact.length}\n`;
  fixesContent += `- Partial matches found: ${matches.partial.length}\n`;
  fixesContent += `- No matches found: ${matches.noMatch.length}\n\n`;
  
  if (matches.exact.length > 0) {
    fixesContent += '=== EXACT MATCHES (content exists at expected path) ===\n';
    fixesContent += 'These URLs may have issues with routing or need investigation:\n\n';
    for (const match of matches.exact) {
      fixesContent += `${match.oldPath} -> ${match.newPath}\n`;
      fixesContent += `  Content file: ${match.match.file}\n\n`;
    }
  }
  
  if (matches.partial.length > 0) {
    fixesContent += '\n=== PARTIAL MATCHES (content exists at different path) ===\n';
    fixesContent += 'Suggested redirect updates:\n\n';
    for (const match of matches.partial) {
      fixesContent += `OLD: "${match.oldPath}": "${match.newPath}",\n`;
      fixesContent += `NEW: "${match.oldPath}": "${match.match.url}",\n`;
      fixesContent += `  Content file: ${match.match.file}\n`;
      fixesContent += `  Match score: ${match.score}\n\n`;
    }
  }
  
  if (matches.noMatch.length > 0) {
    fixesContent += '\n=== NO MATCHES FOUND ===\n';
    fixesContent += 'These may need content migration or removal:\n\n';
    const sampleNoMatches = matches.noMatch.slice(0, 20); // Show first 20
    for (const noMatch of sampleNoMatches) {
      fixesContent += `${noMatch.oldPath} -> ${noMatch.newPath}\n`;
    }
    if (matches.noMatch.length > 20) {
      fixesContent += `\n... and ${matches.noMatch.length - 20} more\n`;
    }
  }
  
  fs.writeFileSync(fixesPath, fixesContent);
  console.log(`Suggested fixes saved to: ${fixesPath}`);

  return matchReport;
}

// Run the analysis
analyzeContentMatches();