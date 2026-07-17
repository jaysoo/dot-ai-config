import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, extname, relative } from 'node:path';

const workspaceRoot = process.cwd();
const contentRoot = `${workspaceRoot}/astro-docs/src/content/docs`;
const outputPath =
  process.argv[2] ??
  `${workspaceRoot}/.ai/2026-07-15/tasks/doc-552-kb-migration.json`;

function normalizeRouteSegment(segment) {
  return segment
    .toLowerCase()
    .replace(/[ _]/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function routeForSource(sourceFile) {
  const extension = extname(sourceFile);
  let route = relative(contentRoot, sourceFile)
    .slice(0, -extension.length)
    .split('/')
    .map(normalizeRouteSegment)
    .join('/');
  route = route.replace(/\/index$/, '');
  return `/docs/${route}`;
}

const sidebarInventory = JSON.parse(
  execFileSync(
    'pnpm',
    [
      'exec',
      'tsx',
      '-e',
      `import { sidebarTabs } from './astro-docs/sidebar.mts';
       const walk = (items, labels = [], output = []) => {
         for (const item of items) {
           if (typeof item === 'string') continue;
           const nextLabels = [...labels, item.label];
           const route = item.link ?? item.slug;
           if (route) output.push({ title: item.label, category: nextLabels[1] ?? 'Uncategorized', oldUrl: '/docs/' + route });
           if (Array.isArray(item.items)) walk(item.items, nextLabels, output);
         }
         return output;
       };
       const tab = sidebarTabs.find((item) => item.id === 'tab-knowledge-base');
       if (!tab) throw new Error('Knowledge Base sidebar tab not found.');
       console.log(JSON.stringify(walk(tab.groups)));`,
    ],
    { cwd: workspaceRoot, encoding: 'utf8' }
  )
);

const contentFiles = execFileSync(
  'rg',
  ['--files', 'astro-docs/src/content/docs'],
  { cwd: workspaceRoot, encoding: 'utf8' }
)
  .trim()
  .split(/\r?\n/)
  .filter((file) => /\.m(?:doc|dx)$/.test(file))
  .map((file) => `${workspaceRoot}/${file}`);

const filesByRoute = new Map();
for (const sourceFile of contentFiles) {
  const route = routeForSource(sourceFile);
  const matches = filesByRoute.get(route) ?? [];
  matches.push(sourceFile);
  filesByRoute.set(route, matches);
}

const basenameCounts = new Map();
for (const article of sidebarInventory) {
  const slug = article.oldUrl.split('/').at(-1);
  basenameCounts.set(slug, (basenameCounts.get(slug) ?? 0) + 1);
}

const collisionSlugs = new Map([
  [
    '/docs/troubleshooting/console-troubleshooting',
    'troubleshooting-console-troubleshooting',
  ],
  [
    '/docs/guides/nx-console/console-troubleshooting',
    'nx-console-troubleshooting',
  ],
  [
    '/docs/technologies/angular/guides/module-federation-with-ssr',
    'angular-module-federation-with-ssr',
  ],
  [
    '/docs/technologies/react/guides/module-federation-with-ssr',
    'react-module-federation-with-ssr',
  ],
]);

const articles = sidebarInventory.map((article) => {
  const sourceMatches = filesByRoute.get(article.oldUrl) ?? [];
  if (sourceMatches.length !== 1) {
    throw new Error(
      `${article.oldUrl} resolved to ${sourceMatches.length} source files: ${sourceMatches.join(', ')}`
    );
  }

  const sourceFile = sourceMatches[0];
  const sourceSlug = article.oldUrl.split('/').at(-1);
  const slug = collisionSlugs.get(article.oldUrl) ?? sourceSlug;
  if (
    (basenameCounts.get(sourceSlug) ?? 0) > 1 &&
    !collisionSlugs.has(article.oldUrl)
  ) {
    throw new Error(`Missing collision slug for ${article.oldUrl}`);
  }

  const content = readFileSync(sourceFile, 'utf8');
  const relativeReferenceLines = content
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter(({ text }) => /(?:\]\(|\bsrc=|\bhref=)["'(]*\.\.?\//.test(text));

  const extension = extname(sourceFile);
  return {
    ...article,
    sourceFile: relative(workspaceRoot, sourceFile),
    newSourceFile: `astro-docs/src/content/docs/kb/${slug}${extension}`,
    slug,
    newUrl: `/docs/kb/${slug}`,
    tags: [article.category],
    relativeReferenceLines,
  };
});

const newSlugs = new Set(articles.map((article) => article.slug));
if (newSlugs.size !== articles.length) {
  throw new Error('The generated KB slugs are not unique.');
}

const sourceFiles = new Set(articles.map((article) => article.sourceFile));
if (sourceFiles.size !== articles.length) {
  throw new Error('A source file appears more than once in the KB inventory.');
}

const categoryOrder = [...new Set(articles.map((article) => article.category))];
const relativeReferenceArticles = articles.filter(
  (article) => article.relativeReferenceLines.length > 0
);

const inventory = {
  articleCount: articles.length,
  categoryCount: categoryOrder.length,
  categoryOrder,
  collisionCount: [...basenameCounts.values()].filter((count) => count > 1)
    .length,
  relativeReferenceArticleCount: relativeReferenceArticles.length,
  articles,
};

writeFileSync(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      outputPath,
      articleCount: inventory.articleCount,
      categoryCount: inventory.categoryCount,
      categoryOrder,
      collisionCount: inventory.collisionCount,
      relativeReferenceArticleCount: inventory.relativeReferenceArticleCount,
      relativeReferenceLines: relativeReferenceArticles.reduce(
        (total, article) => total + article.relativeReferenceLines.length,
        0
      ),
    },
    null,
    2
  )
);
