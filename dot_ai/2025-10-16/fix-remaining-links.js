const fs = require('fs');
const { execSync } = require('child_process');

// Get broken links from link checker
console.log('Running link checker...');
let output;
try {
  output = execSync(
    'npx ts-node -P ./scripts/tsconfig.scripts.json ./scripts/documentation/internal-link-checker.ts 2>&1',
    { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 }
  );
} catch (error) {
  output = error.stdout || error.output.join('');
}

// Parse the output to extract file:URL pairs
const lines = output.split('\n');
const brokenLinks = [];
let currentFile = null;

for (const line of lines) {
  const fileMatch = line.match(/⚠ File:(.+)/);
  if (fileMatch) {
    currentFile = 'docs' + fileMatch[1].trim();
  }

  const urlMatch = line.match(/-> (.+)/);
  if (urlMatch && currentFile) {
    const url = urlMatch[1].trim();
    // Skip /deprecated/ URLs as requested
    if (!url.includes('/deprecated/')) {
      brokenLinks.push({ file: currentFile, url });
    }
  }
}

console.log(`Found ${brokenLinks.length} broken links (excluding /deprecated/)`);

// Group by file
const fileMap = {};
for (const link of brokenLinks) {
  if (!fileMap[link.file]) {
    fileMap[link.file] = [];
  }
  fileMap[link.file].push(link.url);
}

console.log(`Across ${Object.keys(fileMap).length} files\n`);

// Cache for redirects
const redirectCache = {};

function getRedirect(url) {
  if (redirectCache[url] !== undefined) {
    return redirectCache[url];
  }

  // Test URL directly on nx.dev
  try {
    const result = execSync(`curl -s -I https://nx.dev${url}`, {
      encoding: 'utf-8',
      timeout: 5000
    });
    const locationMatch = result.match(/location:\s*(.+)/i);

    if (locationMatch) {
      const redirectUrl = locationMatch[1].trim();
      const pathOnly = redirectUrl.startsWith('http')
        ? new URL(redirectUrl).pathname
        : redirectUrl;

      redirectCache[url] = pathOnly;
      return pathOnly;
    }
  } catch (error) {
    // Ignore errors
  }

  redirectCache[url] = null;
  return null;
}

// Process each file
let totalChanges = 0;
let filesChanged = 0;

for (const [filePath, urls] of Object.entries(fileMap)) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let fileChanged = false;

  for (const url of urls) {
    const redirect = getRedirect(url);

    if (redirect && redirect !== url) {
      // Escape special regex characters in URL
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Match the URL with optional anchor and optional quotes (for use in URLs)
      const urlRegex = new RegExp(`(["']?)${escapedUrl}(#[^"'\\s)]*)?\\1`, 'g');

      const newContent = content.replace(urlRegex, (match, quote, anchor) => {
        return `${quote}${redirect}${anchor || ''}${quote}`;
      });

      if (newContent !== content) {
        content = newContent;
        fileChanged = true;
        totalChanges++;
        console.log(`  ${url} -> ${redirect}`);
      }
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesChanged++;
    console.log(`✓ ${filePath}\n`);
  }
}

console.log(`\nTotal links fixed: ${totalChanges}`);
console.log(`Files changed: ${filesChanged}`);
console.log(`Unique redirects checked: ${Object.keys(redirectCache).length}`);
console.log(`Redirects found: ${Object.keys(redirectCache).filter(k => redirectCache[k]).length}`);
