const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cache for redirect lookups
const redirectCache = {};

// Function to get the actual redirect from nx.dev
function getRedirect(url) {
  if (redirectCache[url]) {
    return redirectCache[url];
  }

  try {
    const result = execSync(`curl -s -I https://nx.dev${url}`, { encoding: 'utf-8' });
    const locationMatch = result.match(/location:\s*(.+)/i);

    if (locationMatch) {
      const redirectUrl = locationMatch[1].trim();
      // If it's a full URL, extract just the path
      const pathOnly = redirectUrl.startsWith('http')
        ? new URL(redirectUrl).pathname
        : redirectUrl;

      redirectCache[url] = pathOnly;
      console.log(`  Redirect: ${url} -> ${pathOnly}`);
      return pathOnly;
    }
  } catch (error) {
    // If curl fails or no redirect found, return null
  }

  redirectCache[url] = null;
  return null;
}

// Function to update links in a markdown file
function updateLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changeCount = 0;

  // Find all markdown links [text](url)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

  content = content.replace(linkPattern, (match, text, url) => {
    // Only process internal links (no http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return match;
    }

    // Remove any anchors for lookup
    const urlWithoutAnchor = url.split('#')[0];
    const anchor = url.includes('#') ? url.substring(url.indexOf('#')) : '';

    // Skip if already pointing to /docs/
    if (urlWithoutAnchor.startsWith('/docs/')) {
      return match;
    }

    // Check if this URL redirects on nx.dev
    const redirectUrl = getRedirect(urlWithoutAnchor);

    if (redirectUrl && redirectUrl !== urlWithoutAnchor) {
      changeCount++;
      return `[${text}](${redirectUrl}${anchor})`;
    }

    return match;
  });

  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${filePath}: Updated ${changeCount} links`);
  }

  return changeCount;
}

// Recursively find all markdown files in a directory
function findMarkdownFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
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

  const files = findMarkdownFiles(dirPath);
  for (const filePath of files) {
    totalChanges += updateLinksInFile(filePath);
  }
}

console.log(`\nTotal links updated: ${totalChanges}`);
console.log(`Total unique redirects found: ${Object.keys(redirectCache).filter(k => redirectCache[k]).length}`);
