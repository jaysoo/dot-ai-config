#!/usr/bin/env node

import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, extname } from 'path';

const ROOT = process.cwd();

// Pages to exclude (dynamic routes)
const EXCLUDE_PAGES = ['[...segments].tsx', '_app.tsx', '_document.tsx'];

// Patterns that indicate doc links
const DOC_LINK_PATTERNS = [
  /href=["']\//,  // Internal links starting with /
  /Link\s+href=["']\//,  // Next.js Link components
  /router\.push\(['"]\//, // Router navigation
  /window\.location.*=.*["']\//,  // Location changes
];

// Known doc paths (these would go to astro-docs)
const DOC_PATH_PREFIXES = [
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
  '/docker'
];

async function* walkDir(dir, baseDir = dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const path = join(dir, file);
    const stats = await stat(path);
    if (stats.isDirectory()) {
      yield* walkDir(path, baseDir);
    } else {
      yield relative(baseDir, path);
    }
  }
}

async function findNonDocPages() {
  const pages = {
    blog: [],
    marketing: {
      app: [],
      pages: []
    }
  };

  // Find blog pages
  console.log('Scanning blog pages...');
  const blogDir = join(ROOT, 'docs/blog');
  try {
    for await (const file of walkDir(blogDir)) {
      if (file.endsWith('.md')) {
        pages.blog.push(`docs/blog/${file}`);
      }
    }
  } catch (e) {
    console.log('Blog directory not found');
  }

  // Find marketing pages in app router
  console.log('Scanning app router pages...');
  const appDir = join(ROOT, 'nx-dev/nx-dev/app');
  try {
    for await (const file of walkDir(appDir)) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        pages.marketing.app.push(`nx-dev/nx-dev/app/${file}`);
      }
    }
  } catch (e) {
    console.log('App directory not found');
  }

  // Find marketing pages in pages router
  console.log('Scanning pages router...');
  const pagesDir = join(ROOT, 'nx-dev/nx-dev/pages');
  try {
    for await (const file of walkDir(pagesDir)) {
      const ext = extname(file);
      if ((ext === '.tsx' || ext === '.ts') && !EXCLUDE_PAGES.some(exclude => file.includes(exclude))) {
        pages.marketing.pages.push(`nx-dev/nx-dev/pages/${file}`);
      }
    }
  } catch (e) {
    console.log('Pages directory not found');
  }

  return pages;
}

async function checkFileForDocLinks(filePath) {
  const content = await readFile(join(ROOT, filePath), 'utf-8');
  const links = [];
  
  // Find all href patterns
  const hrefPattern = /href=["']([^"']+)["']/g;
  let match;
  while ((match = hrefPattern.exec(content)) !== null) {
    const url = match[1];
    // Check if it's an internal link and matches doc patterns
    if (url.startsWith('/') && !url.startsWith('//')) {
      for (const prefix of DOC_PATH_PREFIXES) {
        if (url.startsWith(prefix)) {
          links.push({
            url,
            line: content.substring(0, match.index).split('\n').length
          });
          break;
        }
      }
    }
  }
  
  // Find Link component patterns
  const linkPattern = /<Link[^>]+href=["']([^"']+)["']/g;
  while ((match = linkPattern.exec(content)) !== null) {
    const url = match[1];
    if (url.startsWith('/') && !url.startsWith('//')) {
      for (const prefix of DOC_PATH_PREFIXES) {
        if (url.startsWith(prefix)) {
          // Avoid duplicates
          if (!links.some(l => l.url === url && l.line === content.substring(0, match.index).split('\n').length)) {
            links.push({
              url,
              line: content.substring(0, match.index).split('\n').length
            });
          }
          break;
        }
      }
    }
  }
  
  return links;
}

async function main() {
  console.log('Finding non-documentation pages...\n');
  
  const pages = await findNonDocPages();
  
  console.log('\n=== Non-Documentation Pages Found ===\n');
  console.log(`Blog pages: ${pages.blog.length}`);
  console.log(`Marketing pages (app router): ${pages.marketing.app.length}`);
  console.log(`Marketing pages (pages router): ${pages.marketing.pages.length}`);
  console.log(`Total: ${pages.blog.length + pages.marketing.app.length + pages.marketing.pages.length}\n`);
  
  // Check each file for doc links
  console.log('=== Checking for Documentation Links ===\n');
  
  const allPages = [
    ...pages.blog,
    ...pages.marketing.app,
    ...pages.marketing.pages
  ];
  
  const filesWithDocLinks = [];
  
  for (const page of allPages) {
    try {
      const links = await checkFileForDocLinks(page);
      if (links.length > 0) {
        filesWithDocLinks.push({ file: page, links });
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }
  
  console.log(`Files with documentation links: ${filesWithDocLinks.length}\n`);
  
  // Generate report
  const report = {
    summary: {
      totalNonDocPages: allPages.length,
      pagesWithDocLinks: filesWithDocLinks.length,
      totalDocLinks: filesWithDocLinks.reduce((sum, f) => sum + f.links.length, 0)
    },
    pages: {
      blog: pages.blog,
      marketingApp: pages.marketing.app,
      marketingPages: pages.marketing.pages
    },
    filesWithDocLinks
  };
  
  // Save report
  await writeReport(report);
  
  console.log('\n=== Files with Documentation Links ===\n');
  for (const { file, links } of filesWithDocLinks) {
    console.log(`\n${file}:`);
    for (const link of links) {
      console.log(`  Line ${link.line}: ${link.url}`);
    }
  }
}

async function writeReport(report) {
  const { writeFile } = await import('fs/promises');
  const reportPath = join(ROOT, '.ai/2025-08-21/tasks/non-doc-pages-report.json');
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
}

main().catch(console.error);