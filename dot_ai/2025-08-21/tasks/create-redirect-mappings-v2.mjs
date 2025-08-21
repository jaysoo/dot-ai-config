#!/usr/bin/env node

import { writeFile } from 'fs/promises';
import { join } from 'path';

const ROOT = process.cwd();

// Known documentation URL patterns (from nx.dev)
const DOC_URL_PATTERNS = [
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

async function fetchSitemap(url) {
  console.log(`Fetching sitemap from ${url}...`);
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse URLs from sitemap XML
    const urlPattern = /<loc>(.*?)<\/loc>/g;
    const urls = [];
    let match;
    
    while ((match = urlPattern.exec(text)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return [];
  }
}

function isDocumentationUrl(url) {
  const path = new URL(url).pathname;
  return DOC_URL_PATTERNS.some(pattern => path.startsWith(pattern));
}

function categorizeUrls(urls) {
  const categories = {
    documentation: [],
    blog: [],
    marketing: []
  };
  
  for (const url of urls) {
    const path = new URL(url).pathname;
    
    if (path.startsWith('/blog/')) {
      categories.blog.push(url);
    } else if (isDocumentationUrl(url)) {
      categories.documentation.push(url);
    } else {
      categories.marketing.push(url);
    }
  }
  
  return categories;
}

function normalizeAstroPath(url) {
  // Remove the domain and get just the path
  const path = new URL(url).pathname;
  // Astro docs don't have /docs prefix in sitemap but they will in production
  return path === '/' ? '/docs' : `/docs${path}`.replace(/\/$/, '');
}

function createRedirectMappings(oldUrls, astroUrls) {
  const mappings = [];
  const uncertain = [];
  
  // Create a map of normalized astro paths
  const astroPathMap = new Map();
  for (const url of astroUrls) {
    const normalizedPath = normalizeAstroPath(url);
    astroPathMap.set(normalizedPath, url);
  }
  
  for (const oldUrl of oldUrls) {
    const oldPath = new URL(oldUrl).pathname.replace(/\/$/, '');
    
    // Direct mapping: old path -> /docs + old path
    const newPath = `/docs${oldPath}`;
    
    if (astroPathMap.has(newPath)) {
      mappings.push({
        old: oldPath,
        new: newPath,
        confidence: 'high'
      });
    } else {
      // Try some common transformations
      const variations = [
        newPath,
        newPath + '/',
        newPath.replace('/nx-api/', '/nx-api/'),  // nx-api might stay the same
        newPath.replace('/packages/', '/packages/'),  // packages might stay the same
        newPath.replace('/getting-started/intro', '/getting-started/'),
        newPath.replace('/reference/releases', '/release-notes/'),
      ];
      
      let found = false;
      for (const variant of variations) {
        if (astroPathMap.has(variant)) {
          mappings.push({
            old: oldPath,
            new: variant,
            confidence: 'medium'
          });
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Look for partial matches
        const pathSegments = oldPath.split('/').filter(s => s);
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        const possibleMatches = [];
        for (const [astroPath] of astroPathMap) {
          if (astroPath.includes(lastSegment)) {
            possibleMatches.push(astroPath);
          }
        }
        
        if (possibleMatches.length === 1) {
          mappings.push({
            old: oldPath,
            new: possibleMatches[0],
            confidence: 'low'
          });
        } else {
          uncertain.push({
            old: oldPath,
            possibleMatches: possibleMatches.slice(0, 5), // Limit to 5 suggestions
            reason: possibleMatches.length > 0 ? 'multiple matches' : 'no matches found'
          });
        }
      }
    }
  }
  
  return { mappings, uncertain };
}

async function main() {
  console.log('Creating redirect mappings for DOC-107\n');
  
  // Fetch nx.dev sitemap
  const nxDevUrls = await fetchSitemap('https://nx.dev/sitemap-0.xml');
  console.log(`Found ${nxDevUrls.length} URLs from nx.dev\n`);
  
  // Categorize nx.dev URLs
  const categorized = categorizeUrls(nxDevUrls);
  console.log(`Documentation URLs: ${categorized.documentation.length}`);
  console.log(`Blog URLs: ${categorized.blog.length}`);
  console.log(`Marketing URLs: ${categorized.marketing.length}\n`);
  
  // Fetch astro-docs sitemap
  const astroDocsUrls = await fetchSitemap('https://nx-docs.netlify.app/sitemap-0.xml');
  console.log(`Found ${astroDocsUrls.length} URLs from astro-docs\n`);
  
  // Create redirect mappings
  console.log('Creating redirect mappings...\n');
  const { mappings, uncertain } = createRedirectMappings(
    categorized.documentation,
    astroDocsUrls
  );
  
  console.log(`Created ${mappings.length} redirect mappings`);
  console.log(`  - High confidence: ${mappings.filter(m => m.confidence === 'high').length}`);
  console.log(`  - Medium confidence: ${mappings.filter(m => m.confidence === 'medium').length}`);
  console.log(`  - Low confidence: ${mappings.filter(m => m.confidence === 'low').length}`);
  console.log(`${uncertain.length} URLs need manual review\n`);
  
  // Generate redirect mapping file
  const redirectMarkdown = generateRedirectMarkdown(mappings, uncertain);
  const markdownPath = join(ROOT, '.ai/2025-08-21/tasks/redirect-mappings-v2.md');
  await writeFile(markdownPath, redirectMarkdown);
  console.log(`Redirect mappings saved to: ${markdownPath}`);
  
  // Generate JSON for programmatic use
  const redirectJson = {
    generated: new Date().toISOString(),
    summary: {
      totalDocUrls: categorized.documentation.length,
      mappedUrls: mappings.length,
      highConfidence: mappings.filter(m => m.confidence === 'high').length,
      mediumConfidence: mappings.filter(m => m.confidence === 'medium').length,
      lowConfidence: mappings.filter(m => m.confidence === 'low').length,
      uncertainUrls: uncertain.length
    },
    mappings,
    uncertain
  };
  
  const jsonPath = join(ROOT, '.ai/2025-08-21/tasks/redirect-mappings-v2.json');
  await writeFile(jsonPath, JSON.stringify(redirectJson, null, 2));
  console.log(`JSON mappings saved to: ${jsonPath}`);
  
  // Generate Next.js redirect configuration
  const redirectConfig = generateNextJsRedirects(mappings.filter(m => m.confidence !== 'low'));
  const configPath = join(ROOT, '.ai/2025-08-21/tasks/nextjs-redirects-v2.js');
  await writeFile(configPath, redirectConfig);
  console.log(`Next.js redirect config saved to: ${configPath}`);
}

function generateRedirectMarkdown(mappings, uncertain) {
  let markdown = '# URL Redirect Mappings\n\n';
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  markdown += '## Summary\n\n';
  markdown += `- Total mappings: ${mappings.length}\n`;
  markdown += `- High confidence: ${mappings.filter(m => m.confidence === 'high').length}\n`;
  markdown += `- Medium confidence: ${mappings.filter(m => m.confidence === 'medium').length}\n`;
  markdown += `- Low confidence: ${mappings.filter(m => m.confidence === 'low').length}\n`;
  markdown += `- Needs manual review: ${uncertain.length}\n\n`;
  
  markdown += '## High Confidence Redirect Mappings\n\n';
  markdown += '| Old URL | New URL |\n';
  markdown += '|---------|---------|\\n';
  
  const highConfidence = mappings.filter(m => m.confidence === 'high');
  for (const mapping of highConfidence) {
    markdown += `| ${mapping.old} | ${mapping.new} |\n`;
  }
  
  const mediumConfidence = mappings.filter(m => m.confidence === 'medium');
  if (mediumConfidence.length > 0) {
    markdown += '\n## Medium Confidence Redirect Mappings\n\n';
    markdown += '| Old URL | New URL |\n';
    markdown += '|---------|---------|\\n';
    
    for (const mapping of mediumConfidence) {
      markdown += `| ${mapping.old} | ${mapping.new} |\n`;
    }
  }
  
  const lowConfidence = mappings.filter(m => m.confidence === 'low');
  if (lowConfidence.length > 0) {
    markdown += '\n## Low Confidence Redirect Mappings (Need Review)\n\n';
    markdown += '| Old URL | New URL |\n';
    markdown += '|---------|---------|\\n';
    
    for (const mapping of lowConfidence) {
      markdown += `| ${mapping.old} | ${mapping.new} |\n`;
    }
  }
  
  if (uncertain.length > 0) {
    markdown += '\n## URLs Needing Manual Review\n\n';
    
    for (const item of uncertain) {
      markdown += `### ${item.old}\n`;
      markdown += `- Reason: ${item.reason}\n`;
      if (item.possibleMatches.length > 0) {
        markdown += '- Possible matches:\n';
        for (const match of item.possibleMatches) {
          markdown += `  - ${match}\n`;
        }
      }
      markdown += '\n';
    }
  }
  
  return markdown;
}

function generateNextJsRedirects(mappings) {
  const redirects = mappings.map(mapping => ({
    source: mapping.old,
    destination: mapping.new,
    permanent: true
  }));
  
  return `// Generated redirect configuration for nx-dev Next.js app
// Add this to next.config.js in the redirects() function

module.exports = {
  redirects: async () => {
    return [
      // Documentation redirects to new Astro site
${redirects.map(r => `      {
        source: '${r.source}',
        destination: '${r.destination}',
        permanent: true
      }`).join(',\n')}
    ];
  }
};

// Total redirects: ${redirects.length}
// Note: Low confidence mappings are excluded and need manual review
`;
}

main().catch(console.error);