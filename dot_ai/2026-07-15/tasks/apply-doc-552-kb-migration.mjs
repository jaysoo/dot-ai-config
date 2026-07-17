import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

const workspaceRoot = process.cwd();
const apply = process.argv.includes('--apply');
const inventoryPath = `${workspaceRoot}/.ai/2026-07-15/tasks/doc-552-kb-migration.json`;
const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
const contentRoot = `${workspaceRoot}/astro-docs/src/content/docs`;
const legacyIndexRoot = `${contentRoot}/knowledge-base`;
const newContentRoot = `${contentRoot}/kb`;
const sidebarPath = `${workspaceRoot}/astro-docs/sidebar.mts`;
const netlifyPath = `${workspaceRoot}/astro-docs/netlify.toml`;

function countOccurrences(content, value) {
  return content.split(value).length - 1;
}

function tagId(label) {
  if (label === '.NET') return 'dotnet';
  return label
    .toLowerCase()
    .replaceAll('&', '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function addTags(content, tags, sourceFile) {
  if (!content.startsWith('---\n')) {
    throw new Error(`${sourceFile} does not start with YAML frontmatter.`);
  }

  const frontmatterEnd = content.indexOf('\n---', 4);
  if (frontmatterEnd === -1) {
    throw new Error(`${sourceFile} has no closing frontmatter delimiter.`);
  }

  const frontmatter = content.slice(0, frontmatterEnd);
  if (/^tags:/m.test(frontmatter)) {
    throw new Error(`${sourceFile} already has tags frontmatter.`);
  }

  const tagLines = tags.map((tag) => `  - ${JSON.stringify(tag)}`).join('\n');
  return `${content.slice(0, frontmatterEnd)}\ntags:\n${tagLines}${content.slice(frontmatterEnd)}`;
}

function rewriteArticleUrls(content, redirects) {
  let replacements = 0;
  for (const { oldUrl, newUrl } of redirects) {
    const occurrences = countOccurrences(content, oldUrl);
    if (occurrences === 0) continue;
    content = content.replaceAll(oldUrl, newUrl);
    replacements += occurrences;
  }
  return { content, replacements };
}

function contentFiles() {
  return execFileSync('rg', ['--files', 'astro-docs/src/content/docs'], {
    cwd: workspaceRoot,
    encoding: 'utf8',
  })
    .trim()
    .split(/\r?\n/)
    .filter((file) => /\.m(?:doc|dx)$/.test(file));
}

function legacyIndexes() {
  return execFileSync(
    'rg',
    ['--files', 'astro-docs/src/content/docs/knowledge-base'],
    { cwd: workspaceRoot, encoding: 'utf8' }
  )
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .sort();
}

function routeForLegacyIndex(sourceFile) {
  const relativePath = sourceFile
    .replace(/^astro-docs\/src\/content\/docs\//, '')
    .replace(/\/index\.mdoc$/, '');
  return `/docs/${relativePath}`;
}

function buildRedirectBlock(indexFiles) {
  const articleBlocks = inventory.articles
    .slice()
    .sort((left, right) => left.oldUrl.localeCompare(right.oldUrl))
    .map(
      ({ oldUrl, newUrl }) =>
        `[[redirects]]\nfrom = ${JSON.stringify(oldUrl)}\nto = ${JSON.stringify(newUrl)}`
    )
    .join('\n\n');

  const tagsByIndexSlug = new Map(
    inventory.categoryOrder.map((category) => [tagId(category), category])
  );
  const indexBlocks = indexFiles
    .map((sourceFile) => {
      const oldUrl = routeForLegacyIndex(sourceFile);
      if (oldUrl === '/docs/knowledge-base') {
        return { oldUrl, newUrl: '/docs/kb' };
      }

      const indexSlug = oldUrl.split('/').at(-1);
      const category = tagsByIndexSlug.get(indexSlug);
      if (!category) {
        throw new Error(`No category tag matches ${oldUrl}.`);
      }
      return { oldUrl, newUrl: `/docs/kb?tag=${tagId(category)}` };
    })
    .sort((left, right) => left.oldUrl.localeCompare(right.oldUrl))
    .map(
      ({ oldUrl, newUrl }) =>
        `[[redirects]]\nfrom = ${JSON.stringify(oldUrl)}\nto = ${JSON.stringify(newUrl)}`
    )
    .join('\n\n');

  return `# DOC-552: Knowledge Base articles moved to flat /docs/kb routes\n${articleBlocks}\n\n# DOC-552: Legacy Knowledge Base indexes replaced by tagged discovery\n${indexBlocks}`;
}

if (inventory.articleCount !== 187 || inventory.categoryCount !== 25) {
  throw new Error('The migration inventory does not match the approved scope.');
}

if (!existsSync(legacyIndexRoot)) {
  throw new Error('The legacy Knowledge Base index directory does not exist.');
}

if (existsSync(newContentRoot)) {
  throw new Error('The destination KB content directory already exists.');
}

const indexFiles = legacyIndexes();
if (indexFiles.length !== 26) {
  throw new Error(
    `Expected 26 legacy index files, found ${indexFiles.length}.`
  );
}

const sortedRedirects = inventory.articles
  .map(({ oldUrl, newUrl }) => ({ oldUrl, newUrl }))
  .sort((left, right) => right.oldUrl.length - left.oldUrl.length);

for (const article of inventory.articles) {
  const sourceFile = `${workspaceRoot}/${article.sourceFile}`;
  const destinationFile = `${workspaceRoot}/${article.newSourceFile}`;
  if (!existsSync(sourceFile)) {
    throw new Error(`Missing source file: ${article.sourceFile}`);
  }
  if (existsSync(destinationFile)) {
    throw new Error(`Destination already exists: ${article.newSourceFile}`);
  }

  const content = readFileSync(sourceFile, 'utf8');
  addTags(content, article.tags, article.sourceFile);

  for (const match of content.matchAll(/(?:\.\.\/)+assets\/[^)"'\s]+/g)) {
    const sourceTarget = resolve(dirname(sourceFile), match[0]);
    const rewrittenReference = match[0].replace(
      /^(?:\.\.\/)+assets\//,
      '../../../assets/'
    );
    const destinationTarget = resolve(
      dirname(destinationFile),
      rewrittenReference
    );
    if (!existsSync(sourceTarget)) {
      throw new Error(
        `Missing relative asset in ${article.sourceFile}: ${match[0]}`
      );
    }
    if (sourceTarget !== destinationTarget) {
      throw new Error(
        `Relative asset rewrite changes target in ${article.sourceFile}: ${match[0]}`
      );
    }
  }
}

const sidebar = readFileSync(sidebarPath, 'utf8');
if (!sidebar.includes('const knowledgeBaseGroups: SidebarItems = [')) {
  throw new Error('Could not find the Knowledge Base sidebar groups.');
}
if (!sidebar.includes('groups: knowledgeBaseGroups,')) {
  throw new Error('Could not find the Knowledge Base sidebar tab.');
}

const netlify = readFileSync(netlifyPath, 'utf8');
if (netlify.includes('# DOC-552: Knowledge Base articles moved')) {
  throw new Error('The DOC-552 redirect block already exists.');
}
const existingRedirectSources = new Set(
  [...netlify.matchAll(/^from = "([^"]+)"$/gm)].map((match) => match[1])
);
const duplicateRedirectSources = inventory.articles
  .map((article) => article.oldUrl)
  .filter((oldUrl) => existingRedirectSources.has(oldUrl));
if (duplicateRedirectSources.length > 0) {
  throw new Error(
    `Article redirects already exist: ${duplicateRedirectSources.join(', ')}`
  );
}

if (!apply) {
  console.log(
    JSON.stringify(
      {
        mode: 'dry-run',
        articles: inventory.articleCount,
        tags: inventory.categoryCount,
        legacyIndexes: indexFiles.length,
        relativeAssetArticles: inventory.relativeReferenceArticleCount,
        message: 'Preflight passed. Re-run with --apply to write changes.',
      },
      null,
      2
    )
  );
  process.exit(0);
}

mkdirSync(newContentRoot, { recursive: true });

let rewrittenAssetReferences = 0;
for (const article of inventory.articles) {
  const sourceFile = `${workspaceRoot}/${article.sourceFile}`;
  const destinationFile = `${workspaceRoot}/${article.newSourceFile}`;
  let content = readFileSync(sourceFile, 'utf8');
  content = addTags(content, article.tags, article.sourceFile);
  content = content.replace(/(?:\.\.\/)+assets\//g, () => {
    rewrittenAssetReferences += 1;
    return '../../../assets/';
  });
  content = rewriteArticleUrls(content, sortedRedirects).content;

  writeFileSync(destinationFile, content);
  unlinkSync(sourceFile);
}

rmSync(legacyIndexRoot, { recursive: true });

let rewrittenStaticDocLinks = 0;
let rewrittenStaticDocFiles = 0;
for (const sourceFile of contentFiles()) {
  const absolutePath = `${workspaceRoot}/${sourceFile}`;
  const original = readFileSync(absolutePath, 'utf8');
  const rewritten = rewriteArticleUrls(original, sortedRedirects);
  if (rewritten.replacements === 0) continue;
  writeFileSync(absolutePath, rewritten.content);
  rewrittenStaticDocLinks += rewritten.replacements;
  rewrittenStaticDocFiles += 1;
}

const sidebarWithoutGroups = sidebar.replace(
  /\nconst knowledgeBaseGroups: SidebarItems = \[[\s\S]*?\n\];\n\nconst referenceGroups/,
  '\nconst referenceGroups'
);
if (sidebarWithoutGroups === sidebar) {
  throw new Error('Failed to remove the Knowledge Base sidebar groups.');
}
const updatedSidebar = sidebarWithoutGroups.replace(
  `    icon: 'information',\n    groups: knowledgeBaseGroups,`,
  `    icon: 'information',\n    link: 'kb',\n    groups: [],`
);
if (updatedSidebar === sidebarWithoutGroups) {
  throw new Error('Failed to convert the Knowledge Base tab to a direct link.');
}
writeFileSync(sidebarPath, updatedSidebar);

const redirectBlock = buildRedirectBlock(indexFiles);
const catchAllComment = '# Rewrite for base path handling (keeps URL the same)';
if (!netlify.includes(catchAllComment)) {
  throw new Error('Could not find the Netlify /docs catch-all redirect.');
}
let updatedNetlify = netlify.replace(
  'to = "/docs/knowledge-base/installation-and-updates"',
  'to = "/docs/kb?tag=installation-and-updates"'
);
updatedNetlify = updatedNetlify.replace(
  catchAllComment,
  `${redirectBlock}\n\n${catchAllComment}`
);
writeFileSync(netlifyPath, updatedNetlify);

console.log(
  JSON.stringify(
    {
      mode: 'apply',
      movedArticles: inventory.articleCount,
      removedLegacyIndexes: indexFiles.length,
      rewrittenAssetReferences,
      rewrittenStaticDocFiles,
      rewrittenStaticDocLinks,
      articleRedirects: inventory.articleCount,
      indexRedirects: indexFiles.length,
      remainingContentFiles: contentFiles().length,
      sidebar: relative(workspaceRoot, sidebarPath),
      netlify: relative(workspaceRoot, netlifyPath),
    },
    null,
    2
  )
);
