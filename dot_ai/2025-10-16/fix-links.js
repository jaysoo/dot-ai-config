const fs = require('fs');
const path = require('path');

// Parse the redirect rules file
const redirectRulesPath = './nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const content = fs.readFileSync(redirectRulesPath, 'utf-8');

// Extract the docsToAstroRedirects object
const redirectsMatch = content.match(/const docsToAstroRedirects = \{([\s\S]*?)\n\};/);
if (!redirectsMatch) {
  console.error('Could not find docsToAstroRedirects object');
  process.exit(1);
}

// Parse the redirect mappings
const redirectsText = redirectsMatch[1];
const redirectMap = {};

// Parse the object - handle both single-line and multi-line entries
// Single line: '/old/path': '/new/path',
// Multi line:  '/old/path':
//              '/new/path',
const cleanedText = redirectsText
  .replace(/\/\/.*$/gm, '') // Remove comments
  .replace(/\s+/g, ' ')    // Collapse whitespace
  .trim();

const entryPattern = /'([^']+)':\s*'([^']+)'/g;
let match;
while ((match = entryPattern.exec(cleanedText)) !== null) {
  redirectMap[match[1]] = match[2];
}

console.log(`Loaded ${Object.keys(redirectMap).length} redirect rules`);

// Function to update links in a markdown file
function updateLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  // Find all markdown links [text](url) and direct URLs
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  content = content.replace(linkPattern, (match, text, url) => {
    // Only process internal links (no http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match;
    }

    // Remove any anchors for lookup
    let urlWithoutAnchor = url.split('#')[0];
    const anchor = url.includes('#') ? url.substring(url.indexOf('#')) : '';

    // Skip if already pointing to /docs/ (except /docs/ci/ which needs fixing)
    if (urlWithoutAnchor.startsWith('/docs/') && !urlWithoutAnchor.startsWith('/docs/ci/')) {
      return match;
    }

    // Fix incorrectly prefixed /docs/ci/ URLs - these should use /ci/ and then redirect
    if (urlWithoutAnchor.startsWith('/docs/ci/')) {
      urlWithoutAnchor = urlWithoutAnchor.replace('/docs/ci/', '/ci/');
      // Will fall through to redirect mapping below
    }

    // Check if this URL needs to be redirected via explicit mapping
    if (redirectMap[urlWithoutAnchor]) {
      changeCount++;
      return `[${text}](${redirectMap[urlWithoutAnchor]}${anchor})`;
    }

    // If URL starts with specific patterns that moved to astro-docs, add /docs prefix
    // Note: /ci/ has explicit redirects in redirectMap, so don't add it here
    const astroDocsPatterns = [
      '/features/',
      '/concepts/',
      '/recipes/',
      '/technologies/',
      '/extending-nx/',
      '/getting-started/',
      '/reference/',
      '/troubleshooting/',
      '/deprecated/',
      '/showcase/',
    ];

    // Handle /nx-enterprise/ -> /docs/enterprise/
    if (urlWithoutAnchor.startsWith('/nx-enterprise/')) {
      changeCount++;
      const newUrl = urlWithoutAnchor.replace('/nx-enterprise/', '/docs/enterprise/');
      return `[${text}](${newUrl}${anchor})`;
    }

    for (const pattern of astroDocsPatterns) {
      if (urlWithoutAnchor.startsWith(pattern)) {
        changeCount++;
        return `[${text}](/docs${urlWithoutAnchor}${anchor})`;
      }
    }

    return match;
  });

  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${filePath}: Updated ${changeCount} links`);
  }

  return changeCount;
}

// Find all markdown files in docs/blog, docs/courses, docs/changelog
const docsDir = './docs';
const directories = ['blog', 'courses', 'changelog'];
let totalChanges = 0;

for (const dir of directories) {
  const dirPath = path.join(docsDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠ Directory not found: ${dirPath}`);
    continue;
  }

  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = path.join(dirPath, file);
      totalChanges += updateLinksInFile(filePath);
    }
  }
}

console.log(`\nTotal links updated: ${totalChanges}`);
