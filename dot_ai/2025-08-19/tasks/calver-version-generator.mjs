#!/usr/bin/env node

/**
 * Custom CalVer Version Generator for Nx Release
 * 
 * This generator maintains the existing CalVer scheme: yymm.dd.<build-number>
 * Used to replace the current bash-based versioning in tools/build-and-publish-to-snapshot.sh
 */

import { execSync } from 'child_process';

export function getCalverVersion() {
  // Get current date in yymm.dd format
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  const calverPrefix = `${year}${month}.${day}`;
  
  // Fetch existing tags for today
  try {
    execSync(`git fetch origin 'refs/tags/${calverPrefix}.*:refs/tags/${calverPrefix}.*'`, { 
      stdio: 'ignore' 
    });
  } catch (e) {
    // Ignore errors - may not have tags yet
  }
  
  // Count existing tags for today to determine build number
  let existingBuildCount = 0;
  try {
    const output = execSync(`git tag | grep -c "^${calverPrefix}\\." || true`, { 
      encoding: 'utf-8' 
    });
    existingBuildCount = parseInt(output.trim()) || 0;
  } catch (e) {
    // No existing tags for today
    existingBuildCount = 0;
  }
  
  const buildNumber = existingBuildCount + 1;
  const calverTag = `${calverPrefix}.${buildNumber}`;
  
  return calverTag;
}

// Example Nx Release Version Generator Plugin
export default {
  // This would be called by nx release version
  generateVersion: async (tree, schema) => {
    const version = getCalverVersion();
    
    console.log(`Generated CalVer version: ${version}`);
    
    // Update version in package.json files or wherever needed
    // This is a simplified example - actual implementation would use Nx tree API
    return {
      version,
      versionData: {
        calverPrefix: version.substring(0, 7),
        buildNumber: version.split('.').pop()
      }
    };
  }
};

// If run directly, output the version
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  console.log(getCalverVersion());
} else if (process.argv[1] && process.argv[1].endsWith('calver-version-generator.mjs')) {
  console.log(getCalverVersion());
}