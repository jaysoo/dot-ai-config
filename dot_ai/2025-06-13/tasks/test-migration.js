/**
 * Test migration to reproduce module resolution issue
 * This mimics a typical Nx migration that imports workspace packages
 */

// Try to import a common package that would be in node_modules
try {
  console.log('Attempting to require @angular/core...');
  const angularCore = require('@angular/core');
  console.log('✓ Successfully loaded @angular/core');
  console.log('  Version:', angularCore.VERSION?.full || 'unknown');
} catch (err) {
  console.error('✗ Failed to load @angular/core:', err.message);
}

// Try other common packages
const testPackages = ['typescript', 'react', '@nx/workspace'];
testPackages.forEach(pkg => {
  try {
    require.resolve(pkg);
    console.log(`✓ Can resolve ${pkg}`);
  } catch (err) {
    console.error(`✗ Cannot resolve ${pkg}`);
  }
});

// Log context information
console.log('\nMigration Context:');
console.log('- __filename:', __filename);
console.log('- __dirname:', __dirname);
console.log('- process.cwd():', process.cwd());
console.log('- require.main?.filename:', require.main?.filename);

// The actual migration function
module.exports = function testMigration(tree, context) {
  console.log('Running test migration...');
  console.log('Tree root:', tree.root);
  return tree;
};