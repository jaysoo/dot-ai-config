import { readFile, readdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const workspaceRoot = path.resolve(process.argv[2] ?? process.cwd());
const projectRoot = path.join(workspaceRoot, 'astro-docs');
const require = createRequire(path.join(workspaceRoot, 'package.json'));
const { load: parseYaml } = require('js-yaml');
const docsRoot = path.join(projectRoot, 'src/content/docs');
const knowledgeBaseRoot = path.join(docsRoot, 'kb');
const legacyKnowledgeBaseRoot = path.join(docsRoot, 'knowledge-base');
const topicPagePath = path.join(projectRoot, 'src/pages/kb/[topic].astro');

const errors = [];

function reportError(message) {
  errors.push(message);
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    reportError(`${file}: missing YAML frontmatter`);
    return {};
  }

  try {
    return parseYaml(match[1]) ?? {};
  } catch (error) {
    reportError(`${file}: invalid YAML frontmatter (${error.message})`);
    return {};
  }
}

function parseRedirects(source) {
  return [
    ...source.matchAll(/\[\[redirects\]\]([\s\S]*?)(?=\n\[\[redirects\]\]|$)/g),
  ]
    .map((match) => {
      const from = match[1].match(/^from\s*=\s*"([^"]+)"/m)?.[1];
      const to = match[1].match(/^to\s*=\s*"([^"]+)"/m)?.[1];
      return { from, to };
    })
    .filter((redirect) => redirect.from && redirect.to);
}

const topicDefinitions = JSON.parse(
  await readFile(
    path.join(projectRoot, 'src/data/knowledge-base-topics.json'),
    'utf8'
  )
);
const knowledgeBaseConfig = JSON.parse(
  await readFile(
    path.join(projectRoot, 'src/data/knowledge-base-config.json'),
    'utf8'
  )
);
const allowedTopics = new Set(topicDefinitions.map((topic) => topic.label));
const usedTopics = new Set();

if (allowedTopics.size !== topicDefinitions.length) {
  reportError('knowledge-base-topics.json contains duplicate labels');
}
if (
  new Set(topicDefinitions.map((topic) => topic.id)).size !==
  topicDefinitions.length
) {
  reportError('knowledge-base-topics.json contains duplicate IDs');
}

for (const topic of topicDefinitions) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(topic.id)) {
    reportError(`Topic ID must use lowercase kebab-case: "${topic.id}"`);
  }
  if (typeof topic.label !== 'string' || topic.label.trim() === '') {
    reportError(`Topic "${topic.id}" needs a label`);
  }
  if (
    typeof topic.description !== 'string' ||
    topic.description.trim() === ''
  ) {
    reportError(`Topic "${topic.id}" needs a description`);
  }
}

const entries = await readdir(knowledgeBaseRoot, { withFileTypes: true });
const nestedEntries = entries.filter((entry) => entry.isDirectory());
for (const entry of nestedEntries) {
  reportError(`src/content/docs/kb/${entry.name}: KB articles must stay flat`);
}

const articleFiles = entries
  .filter(
    (entry) =>
      entry.isFile() && ['.mdoc', '.mdx'].includes(path.extname(entry.name))
  )
  .map((entry) => entry.name)
  .sort();
const articleSlugs = new Set(
  articleFiles.map((file) => file.slice(0, -path.extname(file).length))
);
const topicIds = new Set(topicDefinitions.map((topic) => topic.id));

for (const slug of articleSlugs) {
  if (topicIds.has(slug)) {
    reportError(`KB article slug collides with a topic route: ${slug}`);
  }
}

try {
  if (!(await stat(topicPagePath)).isFile()) {
    reportError('src/pages/kb/[topic].astro must generate topic index pages');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    reportError('src/pages/kb/[topic].astro must generate topic index pages');
  } else {
    throw error;
  }
}

if (
  new Set(knowledgeBaseConfig.featuredArticleSlugs).size !==
  knowledgeBaseConfig.featuredArticleSlugs.length
) {
  reportError(
    'knowledge-base-config.json contains duplicate featured articles'
  );
}
for (const slug of knowledgeBaseConfig.featuredArticleSlugs) {
  if (!articleSlugs.has(slug)) {
    reportError(`Unknown featured article slug: ${slug}`);
  }
}

for (const file of articleFiles) {
  const source = await readFile(path.join(knowledgeBaseRoot, file), 'utf8');
  const frontmatter = parseFrontmatter(source, `src/content/docs/kb/${file}`);

  if (frontmatter.tags !== undefined) {
    reportError(`${file}: use "topics" instead of the legacy "tags" field`);
  }

  if (!Array.isArray(frontmatter.topics) || frontmatter.topics.length === 0) {
    reportError(`${file}: expected at least one topic`);
    continue;
  }

  if (new Set(frontmatter.topics).size !== frontmatter.topics.length) {
    reportError(`${file}: contains duplicate topics`);
  }

  for (const topic of frontmatter.topics) {
    if (!allowedTopics.has(topic)) {
      reportError(`${file}: unknown topic "${topic}"`);
    } else {
      usedTopics.add(topic);
    }
  }
}

const expectedNextJsArticles = new Set([
  'deploy-nextjs-to-vercel.mdoc',
  'next-config-setup.mdoc',
]);
for (const file of expectedNextJsArticles) {
  const source = await readFile(path.join(knowledgeBaseRoot, file), 'utf8');
  const frontmatter = parseFrontmatter(source, `src/content/docs/kb/${file}`);
  if (!frontmatter.topics?.includes('Next.js')) {
    reportError(`${file}: expected the Next.js topic`);
  }
}

for (const topic of allowedTopics) {
  if (!usedTopics.has(topic)) {
    reportError(`Topic "${topic}" is not used by any KB article`);
  }
}

try {
  if ((await stat(legacyKnowledgeBaseRoot)).isDirectory()) {
    reportError('src/content/docs/knowledge-base must be removed');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const netlifyConfig = await readFile(
  path.join(projectRoot, 'netlify.toml'),
  'utf8'
);
const articleMarker =
  '# DOC-552: Knowledge Base articles moved to flat /docs/kb routes';
const indexMarker =
  '# DOC-552: Legacy Knowledge Base indexes replaced by topic discovery';
const catchAllMarker = '# Rewrite for base path handling (keeps URL the same)';
const articleMarkerIndex = netlifyConfig.indexOf(articleMarker);
const indexMarkerIndex = netlifyConfig.indexOf(indexMarker);
const catchAllMarkerIndex = netlifyConfig.indexOf(catchAllMarker);

if (
  articleMarkerIndex === -1 ||
  indexMarkerIndex === -1 ||
  catchAllMarkerIndex === -1 ||
  !(
    articleMarkerIndex < indexMarkerIndex &&
    indexMarkerIndex < catchAllMarkerIndex
  )
) {
  reportError('DOC-552 redirects must remain before the /docs/* catch-all');
} else {
  const articleRedirects = parseRedirects(
    netlifyConfig.slice(articleMarkerIndex, indexMarkerIndex)
  );
  const indexRedirects = parseRedirects(
    netlifyConfig.slice(indexMarkerIndex, catchAllMarkerIndex)
  );

  if (articleRedirects.length !== 187) {
    reportError(
      `Expected 187 migrated article redirects, found ${articleRedirects.length}`
    );
  }

  const redirectSources = new Set();
  const redirectTargets = new Set();
  for (const redirect of articleRedirects) {
    if (redirectSources.has(redirect.from)) {
      reportError(`Duplicate article redirect source: ${redirect.from}`);
    }
    if (redirectTargets.has(redirect.to)) {
      reportError(`Duplicate article redirect target: ${redirect.to}`);
    }
    redirectSources.add(redirect.from);
    redirectTargets.add(redirect.to);

    if (!redirect.to.startsWith('/docs/kb/')) {
      reportError(`Article redirect has an invalid target: ${redirect.to}`);
      continue;
    }

    const slug = redirect.to.slice('/docs/kb/'.length);
    if (!articleSlugs.has(slug)) {
      reportError(`Article redirect target does not exist: ${redirect.to}`);
    }
  }

  const expectedIndexRedirects = new Map([
    ['/docs/knowledge-base', '/docs/kb'],
    ...topicDefinitions
      .filter((topic) => topic.legacyIndex !== false)
      .map((topic) => [
        `/docs/knowledge-base/${topic.id}`,
        `/docs/kb/${topic.id}`,
      ]),
  ]);

  if (indexRedirects.length !== expectedIndexRedirects.size) {
    reportError(
      `Expected ${expectedIndexRedirects.size} legacy index redirects, found ${indexRedirects.length}`
    );
  }

  for (const redirect of indexRedirects) {
    const expectedTarget = expectedIndexRedirects.get(redirect.from);
    if (!expectedTarget) {
      reportError(`Unexpected legacy index redirect: ${redirect.from}`);
    } else if (redirect.to !== expectedTarget) {
      reportError(
        `Legacy index redirect ${redirect.from} should target ${expectedTarget}`
      );
    }
    expectedIndexRedirects.delete(redirect.from);
  }

  for (const source of expectedIndexRedirects.keys()) {
    reportError(`Missing legacy index redirect: ${source}`);
  }
}

if (errors.length > 0) {
  console.error('Knowledge Base validation failed:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Knowledge Base validation passed: ${articleFiles.length} flat articles, ${topicDefinitions.length} topics, ${knowledgeBaseConfig.featuredArticleSlugs.length} featured articles, and 213 redirects.`
);
