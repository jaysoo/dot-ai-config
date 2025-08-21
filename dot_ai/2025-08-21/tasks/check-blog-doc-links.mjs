#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const ROOT = process.cwd();
const BLOG_DIR = join(ROOT, 'docs/blog');

// Known documentation URL patterns that should have /docs prefix
const DOC_PATTERNS = [
  '/getting-started',
  '/features',
  '/concepts',
  '/recipes',
  '/reference',
  '/nx-api',
  '/packages',
  '/plugins',
  '/ci',
  '/migrations',
  '/extending-nx',
  '/workspace',
  '/installation',
  '/angular',
  '/react',
  '/vue',
  '/node',
  '/web',
  '/jest',
  '/cypress',
  '/storybook',
  '/vite',
  '/webpack',
  '/esbuild',
  '/rspack',
  '/rollup',
  '/expo',
  '/react-native',
  '/detox',
  '/remix',
  '/next',
  '/nuxt',
  '/qwik',
  '/solid',
  '/lit',
  '/rust',
  '/go',
  '/gradle',
  '/docker',
  '/core-features',
  '/intro',
  '/tutorial',
  '/guides',
  '/community',
  '/structure',
  '/generators',
  '/executors',
  '/devkit',
  '/nx-devkit',
  '/examples',
  '/configuration'
];

async function findDocLinksInBlog() {
  const files = await readdir(BLOG_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  const results = [];
  
  for (const file of mdFiles) {
    const filePath = join(BLOG_DIR, file);
    const content = await readFile(filePath, 'utf-8');
    const links = [];
    
    // Find markdown links [text](url)
    const mdLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = mdLinkPattern.exec(content)) !== null) {
      const linkText = match[1];
      const url = match[2];
      
      // Check if it's an internal link that matches doc patterns
      if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/docs/')) {
        for (const pattern of DOC_PATTERNS) {
          if (url.startsWith(pattern)) {
            links.push({
              text: linkText,
              url: url,
              line: content.substring(0, match.index).split('\n').length,
              fullMatch: match[0]
            });
            break;
          }
        }
      }
    }
    
    // Find HTML links href="url"
    const htmlLinkPattern = /href=["']([^"']+)["']/g;
    
    while ((match = htmlLinkPattern.exec(content)) !== null) {
      const url = match[1];
      
      // Check if it's an internal link that matches doc patterns
      if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/docs/')) {
        for (const pattern of DOC_PATTERNS) {
          if (url.startsWith(pattern)) {
            // Check if not already found
            const line = content.substring(0, match.index).split('\n').length;
            if (!links.some(l => l.url === url && l.line === line)) {
              links.push({
                text: 'HTML link',
                url: url,
                line: line,
                fullMatch: match[0]
              });
            }
            break;
          }
        }
      }
    }
    
    if (links.length > 0) {
      results.push({
        file: file,
        path: filePath,
        links: links
      });
    }
  }
  
  return results;
}

async function main() {
  console.log('Checking blog posts for documentation links...\n');
  
  const results = await findDocLinksInBlog();
  
  if (results.length === 0) {
    console.log('✅ No documentation links found that need /docs prefix in blog posts!');
    return;
  }
  
  console.log(`Found documentation links in ${results.length} blog posts:\n`);
  
  let totalLinks = 0;
  
  for (const result of results) {
    console.log(`\n📄 ${result.file}`);
    console.log(`   Found ${result.links.length} documentation link(s):`);
    
    for (const link of result.links) {
      console.log(`   Line ${link.line}: ${link.url}`);
      console.log(`      Text: "${link.text}"`);
      console.log(`      Suggested: ${link.url} → /docs${link.url}`);
      totalLinks++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\nSummary: Found ${totalLinks} documentation links that need /docs prefix`);
  console.log(`Affected files: ${results.length}`);
  
  // Generate update script
  console.log('\n📝 Generating update script...');
  
  const scriptContent = `#!/usr/bin/env node
// Auto-generated script to update blog documentation links

import { readFile, writeFile } from 'fs/promises';

const updates = ${JSON.stringify(results, null, 2)};

async function updateFiles() {
  for (const fileData of updates) {
    console.log(\`Updating \${fileData.file}...\`);
    let content = await readFile(fileData.path, 'utf-8');
    
    // Sort links by position in reverse to avoid offset issues
    const sortedLinks = fileData.links.sort((a, b) => b.line - a.line);
    
    for (const link of fileData.links) {
      const newUrl = '/docs' + link.url;
      
      // For markdown links
      if (link.fullMatch.startsWith('[')) {
        const newMatch = link.fullMatch.replace(link.url, newUrl);
        content = content.replace(link.fullMatch, newMatch);
      }
      // For HTML links
      else if (link.fullMatch.startsWith('href=')) {
        const newMatch = link.fullMatch.replace(link.url, newUrl);
        content = content.replace(link.fullMatch, newMatch);
      }
    }
    
    await writeFile(fileData.path, content);
    console.log(\`  ✅ Updated \${fileData.links.length} links\`);
  }
}

updateFiles().catch(console.error);
`;
  
  await writeFile(join(ROOT, '.ai/2025-08-21/tasks/update-blog-doc-links.mjs'), scriptContent);
  console.log('Update script saved to: .ai/2025-08-21/tasks/update-blog-doc-links.mjs');
  console.log('Run it with: node .ai/2025-08-21/tasks/update-blog-doc-links.mjs');
}

import { writeFile } from 'fs/promises';

main().catch(console.error);