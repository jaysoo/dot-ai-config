#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));

async function getNxVersions() {
  console.log('Fetching Nx package information...');
  
  try {
    // Get all versions for nx package
    const { stdout } = await execAsync('npm view nx versions --json');
    const allVersions = JSON.parse(stdout);
    
    // Filter for 21.0.x pre-release versions
    const preReleaseVersions = allVersions.filter(version => {
      return version.startsWith('21.0.') && 
             (version.includes('-beta.') || 
              version.includes('-rc.') || 
              version.includes('-canary.'));
    });
    
    console.log(`Found ${preReleaseVersions.length} pre-release versions for Nx 21.0`);
    
    return preReleaseVersions;
  } catch (error) {
    console.error('Error fetching Nx versions:', error);
    throw error;
  }
}

function sortVersions(versions) {
  console.log('Sorting versions according to semver...');
  
  return versions.sort((a, b) => {
    // Extract version parts
    const parseVersion = (v) => {
      const match = v.match(/^(\d+)\.(\d+)\.(\d+)(?:-(\w+)\.(\d+))?/);
      if (!match) return null;
      
      return {
        major: parseInt(match[1]),
        minor: parseInt(match[2]),
        patch: parseInt(match[3]),
        preRelease: match[4] || '',
        preReleaseNum: parseInt(match[5]) || 0
      };
    };
    
    const versionA = parseVersion(a);
    const versionB = parseVersion(b);
    
    if (!versionA || !versionB) return 0;
    
    // Compare major.minor.patch
    if (versionA.major !== versionB.major) return versionA.major - versionB.major;
    if (versionA.minor !== versionB.minor) return versionA.minor - versionB.minor;
    if (versionA.patch !== versionB.patch) return versionA.patch - versionB.patch;
    
    // If one has pre-release and other doesn't, non-pre-release is greater
    if (!versionA.preRelease && versionB.preRelease) return 1;
    if (versionA.preRelease && !versionB.preRelease) return -1;
    
    // Both have pre-release, compare type (canary < beta < rc)
    const preReleaseOrder = { 'canary': 1, 'beta': 2, 'rc': 3 };
    const orderA = preReleaseOrder[versionA.preRelease] || 0;
    const orderB = preReleaseOrder[versionB.preRelease] || 0;
    
    if (orderA !== orderB) return orderA - orderB;
    
    // Same pre-release type, compare numbers
    return versionA.preReleaseNum - versionB.preReleaseNum;
  });
}

async function main() {
  try {
    // Get versions
    const versions = await getNxVersions();
    
    if (versions.length === 0) {
      console.log('No pre-release versions found for Nx 21.0');
      return;
    }
    
    // Sort versions
    const sortedVersions = sortVersions(versions);
    
    // Write to file
    const outputPath = join(__dirname, 'nx-versions.txt');
    const content = sortedVersions.join('\n');
    
    await writeFile(outputPath, content, 'utf8');
    
    console.log(`\nSuccessfully wrote ${sortedVersions.length} versions to ${outputPath}`);
    console.log('\nFirst 10 versions:');
    sortedVersions.slice(0, 10).forEach(v => console.log(`  ${v}`));
    
    if (sortedVersions.length > 10) {
      console.log(`  ... and ${sortedVersions.length - 10} more`);
    }
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();