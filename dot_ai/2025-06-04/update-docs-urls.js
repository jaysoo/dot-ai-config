#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Import redirect rules from the nx-dev redirect-rules.js
const redirectRules = require('../../nx-dev/nx-dev/redirect-rules.js');

// Extract the specific redirect objects we need
const { nxApiRedirects, nxRecipesRedirects, nxModuleFederationConceptsRedirects } = redirectRules;

// Combine all relevant redirects
const allRedirects = {
  ...nxApiRedirects,
  ...nxRecipesRedirects,
  ...nxModuleFederationConceptsRedirects
};

// Convert redirect patterns to regex for matching
const redirectPatterns = [];
for (const [key, value] of Object.entries(allRedirects)) {
  // Handle wildcard patterns
  if (key.includes(':slug*')) {
    const basePattern = key.replace('/:slug*', '');
    const baseReplacement = value.replace('/:slug*', '');
    redirectPatterns.push({
      pattern: new RegExp(`^${escapeRegex(basePattern)}(/.*)?$`),
      replacement: baseReplacement,
      isWildcard: true,
      original: key
    });
  } else {
    // Exact match
    redirectPatterns.push({
      pattern: new RegExp(`^${escapeRegex(key)}$`),
      replacement: value,
      isWildcard: false,
      original: key
    });
  }
}

// Sort patterns by length (longest first) to match most specific patterns first
redirectPatterns.sort((a, b) => b.original.length - a.original.length);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Find and replace URLs in markdown content
function updateUrlsInContent(content, filePath) {
  const updates = [];
  let updatedContent = content;

  // Regex pattern for markdown links with internal URLs: [text](/url)
  const linkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;

  // Find all matches
  const matches = [...content.matchAll(linkPattern)];
  
  // Process matches in reverse order to maintain correct positions
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const text = match[1];
    const url = match[2];
    const fullMatch = match[0];
    const matchStart = match.index;
    
    // Remove any hash or query parameters for matching
    const urlWithoutHash = url.split('#')[0].split('?')[0];
    
    // Try to match against redirect patterns
    for (const redirectPattern of redirectPatterns) {
      const patternMatch = urlWithoutHash.match(redirectPattern.pattern);
      if (patternMatch) {
        let newUrl = redirectPattern.replacement;
        
        // Handle wildcard replacements
        if (redirectPattern.isWildcard && patternMatch[1]) {
          newUrl += patternMatch[1];
        }
        
        // Preserve hash and query parameters
        const hashIndex = url.indexOf('#');
        const queryIndex = url.indexOf('?');
        if (hashIndex !== -1) {
          newUrl += url.substring(hashIndex);
        } else if (queryIndex !== -1) {
          newUrl += url.substring(queryIndex);
        }

        // Only update if the URL actually changed
        if (url !== newUrl) {
          // Create the replacement
          const replacement = `[${text}](${newUrl})`;

          // Replace in content
          updatedContent = updatedContent.slice(0, matchStart) + 
                          replacement + 
                          updatedContent.slice(matchStart + fullMatch.length);
          
          // Track the update
          updates.push([url, newUrl]);
          
          console.log(`  Found: ${url} → ${newUrl}`);
          break; // Only apply the first matching redirect
        }
      }
    }
  }

  return { updatedContent, updates };
}

// Main function
async function updateDocumentationUrls() {
  console.log('Starting documentation URL updates...\n');
  
  const updatedFiles = {};
  let totalUpdates = 0;

  // Find all markdown files under docs/
  const files = glob.sync('docs/**/*.md', {
    cwd: path.join(__dirname, '..', '..'),
    absolute: true
  });

  console.log(`Found ${files.length} markdown files to process.\n`);

  // Process each file
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..', '..'), file);
    
    console.log(`Processing: ${relativePath}`);
    
    const { updatedContent, updates } = updateUrlsInContent(content, file);
    
    if (updates.length > 0) {
      // Write the updated content back to the file
      fs.writeFileSync(file, updatedContent, 'utf8');
      
      // Track the updates
      updatedFiles[relativePath] = updates;
      totalUpdates += updates.length;
      
      console.log(`  Updated ${updates.length} URL(s)\n`);
    } else {
      console.log(`  No updates needed\n`);
    }
  }

  // Write the tracking JSON file
  const outputPath = path.join(__dirname, '..', '..', 'updated-docs.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedFiles, null, 2), 'utf8');

  console.log('\nSummary:');
  console.log(`- Processed ${files.length} files`);
  console.log(`- Updated ${Object.keys(updatedFiles).length} files`);
  console.log(`- Total URL updates: ${totalUpdates}`);
  console.log(`\nTracking file written to: updated-docs.json`);
}

// Run the script
updateDocumentationUrls().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});