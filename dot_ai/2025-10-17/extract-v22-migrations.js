const fs = require('fs');
const path = require('path');

const migrationFiles = [
  'packages/angular/migrations.json',
  'packages/cypress/migrations.json',
  'packages/detox/migrations.json',
  'packages/devkit/migrations.json',
  'packages/docker/migrations.json',
  'packages/esbuild/migrations.json',
  'packages/eslint-plugin/migrations.json',
  'packages/eslint/migrations.json',
  'packages/expo/migrations.json',
  'packages/express/migrations.json',
  'packages/gradle/migrations.json',
  'packages/jest/migrations.json',
  'packages/js/migrations.json',
  'packages/module-federation/migrations.json',
  'packages/nest/migrations.json',
  'packages/next/migrations.json',
  'packages/node/migrations.json',
  'packages/nuxt/migrations.json',
  'packages/nx/migrations.json',
  'packages/playwright/migrations.json',
  'packages/plugin/migrations.json',
  'packages/react-native/migrations.json',
  'packages/react/migrations.json',
  'packages/remix/migrations.json',
  'packages/rollup/migrations.json',
  'packages/rsbuild/migrations.json',
  'packages/rspack/migrations.json',
  'packages/storybook/migrations.json',
  'packages/vite/migrations.json',
  'packages/vue/migrations.json',
  'packages/web/migrations.json',
  'packages/webpack/migrations.json',
  'packages/workspace/migrations.json'
];

const v22Migrations = [];

for (const file of migrationFiles) {
  const fullPath = path.join('/Users/jack/projects/nx', file);

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const migrations = JSON.parse(content);
    const packageName = file.split('/')[1]; // Extract package name

    if (migrations.generators) {
      for (const [key, migration] of Object.entries(migrations.generators)) {
        const version = migration.version;

        // Check if version starts with 22
        if (version && version.startsWith('22.')) {
          v22Migrations.push({
            package: packageName,
            migrationKey: key,
            version: version,
            description: migration.description || '',
            implementation: migration.implementation || migration.factory || '',
            cli: migration.cli || ''
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

// Sort by package name, then by version
v22Migrations.sort((a, b) => {
  if (a.package !== b.package) {
    return a.package.localeCompare(b.package);
  }
  return a.version.localeCompare(b.version);
});

console.log(`\n=== V22 MIGRATIONS (${v22Migrations.length} total) ===\n`);

let currentPackage = '';
for (const migration of v22Migrations) {
  if (migration.package !== currentPackage) {
    currentPackage = migration.package;
    console.log(`\n## @nx/${currentPackage}`);
  }

  console.log(`\n### ${migration.migrationKey}`);
  console.log(`- **Version**: ${migration.version}`);
  console.log(`- **Description**: ${migration.description}`);
  console.log(`- **Implementation**: ${migration.implementation}`);
  if (migration.cli) {
    console.log(`- **CLI**: ${migration.cli}`);
  }
}

console.log(`\n\n=== SUMMARY ===`);
console.log(`Total v22 migrations: ${v22Migrations.length}`);

// Group by package
const byPackage = {};
for (const migration of v22Migrations) {
  if (!byPackage[migration.package]) {
    byPackage[migration.package] = [];
  }
  byPackage[migration.package].push(migration);
}

console.log(`\nBy package:`);
for (const [pkg, migs] of Object.entries(byPackage).sort()) {
  console.log(`  @nx/${pkg}: ${migs.length} migrations`);
}
