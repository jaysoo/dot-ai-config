import fs from 'node:fs';

const input = process.argv[2];
if (!input) {
  throw new Error('Usage: node analyze-cnw-errors.mjs <cnw-errors.json>');
}

const groups = JSON.parse(fs.readFileSync(input, 'utf8'));
const failure = groups.find(
  (group) => group._id === 'WORKSPACE_CREATION_FAILED'
);

if (!failure) {
  throw new Error('WORKSPACE_CREATION_FAILED was not found');
}

const ansi = /\u001b\[[0-9;]*m/g;

function clean(message) {
  return message
    .replace(/\\u001b\[[0-9;]*m/g, '')
    .replace(/\\r/g, '')
    .replace(/\\n/g, '\n')
    .replace(ansi, '')
    .replace(/\r/g, '')
    .replace(/^Failed to create a workspace:\s*/i, '')
    .split('\n')
    .filter((line) => {
      return (
        !/^npm warn deprecated\s/i.test(line) &&
        !/^npm WARN deprecated\s/.test(line) &&
        !/^npm warn cleanup\s/i.test(line) &&
        !/^npm notice\s/i.test(line)
      );
    })
    .join('\n')
    .trim();
}

function classify(sample) {
  const message = clean(sample.message);

  if (/ts\.readConfigFile is not a function/i.test(message)) {
    return 'ts.readConfigFile is not a function';
  }
  if (/WorkspaceContext is not a constructor/i.test(message)) {
    return 'WorkspaceContext is not a constructor';
  }
  if (/Plugin Worker .* is exiting|host process was terminated before the worker/i.test(message + sample.errorFile)) {
    return 'Plugin worker exited';
  }
  if (/projects are defined in multiple locations/i.test(message)) {
    return 'Duplicate project names in nested workspace';
  }
  if (/Cannot find module/i.test(message)) {
    return 'Cannot find module';
  }
  if (/EBADENGINE|does not support Node\.js/i.test(message)) {
    return 'Unsupported Node/npm version';
  }
  if (/allowScripts|allow-scripts/i.test(message)) {
    return 'pnpm ignored install scripts';
  }
  if (/ERESOLVE/i.test(message)) {
    return 'ERESOLVE output (root cause truncated)';
  }
  if (/Unknown env config/i.test(message)) {
    return 'npm unknown env config (root cause truncated)';
  }
  if (/Command failed: pnpm install --no-frozen-lockfile/i.test(message)) {
    return 'Generic pnpm install failure';
  }
  if (/^Fetching nx\.\.\.|^Progress: resolved/m.test(message)) {
    return 'pnpm progress only (root cause truncated)';
  }
  if (!message) {
    return 'npm warnings only / fully truncated';
  }
  if (/deprecated /i.test(message)) {
    return 'npm deprecation output (root cause truncated)';
  }
  return 'Other';
}

const categories = new Map();
const exactMessages = new Map();
const errorFiles = new Map();
const versions = new Map();

for (const sample of failure.samples) {
  const category = classify(sample);
  const categorySamples = categories.get(category) ?? [];
  categorySamples.push(sample);
  categories.set(category, categorySamples);

  const message = clean(sample.message);
  exactMessages.set(message, (exactMessages.get(message) ?? 0) + 1);
  errorFiles.set(
    sample.errorFile,
    (errorFiles.get(sample.errorFile) ?? 0) + 1
  );
  versions.set(sample.nxVersion, (versions.get(sample.nxVersion) ?? 0) + 1);
}

function sortedEntries(map) {
  return [...map.entries()].sort(
    ([leftKey, leftCount], [rightKey, rightCount]) =>
      rightCount - leftCount || leftKey.localeCompare(rightKey)
  );
}

console.log(
  JSON.stringify(
    {
      aggregate: {
        count: failure.count,
        human: failure.human,
        ai: failure.ai,
        sampleCount: failure.samples.length,
        newestSample: failure.samples.at(0)?.createdAt?.$date,
        oldestSample: failure.samples.at(-1)?.createdAt?.$date,
      },
      versions: sortedEntries(versions).map(([version, count]) => ({
        version,
        count,
      })),
      categories: [...categories.entries()]
        .map(([category, samples]) => ({
          category,
          count: samples.length,
          distinctErrorFiles: new Set(samples.map((sample) => sample.errorFile))
            .size,
          versions: Object.entries(
            samples.reduce((counts, sample) => {
              counts[sample.nxVersion] = (counts[sample.nxVersion] ?? 0) + 1;
              return counts;
            }, {})
          )
            .sort(([, left], [, right]) => right - left)
            .map(([version, count]) => `${version}:${count}`),
          example: clean(samples[0].message).slice(0, 300),
          exampleFile: samples[0].errorFile,
        }))
        .sort(
          (left, right) =>
            right.count - left.count ||
            left.category.localeCompare(right.category)
        ),
      repeatedExactMessages: sortedEntries(exactMessages)
        .filter(([, count]) => count > 1)
        .slice(0, 15)
        .map(([message, count]) => ({
          count,
          message: message.slice(0, 300),
        })),
      repeatedErrorFiles: sortedEntries(errorFiles)
        .filter(([, count]) => count > 1)
        .slice(0, 15)
        .map(([errorFile, count]) => ({ count, errorFile })),
    },
    null,
    2
  )
);
