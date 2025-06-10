#!/usr/bin/env node

/**
 * Node.js version compatibility checker for nx
 * This script checks the current Node.js version and provides warnings if needed
 */

import { execSync } from 'child_process';

const RECOMMENDED_VERSION = 20;
const WARNING_THRESHOLD = 20;

function getNodeVersion() {
  const versionString = process.version;
  const match = versionString.match(/^v(\d+)\.(\d+)\.(\d+)/);
  
  if (!match) {
    return null;
  }
  
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3]),
    full: versionString
  };
}

function checkNodeVersion() {
  const version = getNodeVersion();
  
  if (!version) {
    console.error('WARNING: Unable to determine Node.js version');
    return false;
  }
  
  if (version.major < WARNING_THRESHOLD) {
    console.error(`
╔══════════════════════════════════════════════════════════════════════╗
║                         ⚠️  NODE.JS WARNING ⚠️                         ║
╠══════════════════════════════════════════════════════════════════════╣
║ You are using Node.js ${version.full.padEnd(47)}║
║ Node.js >= ${RECOMMENDED_VERSION} is recommended for optimal compatibility with nx.   ║
║                                                                      ║
║ Your current version may work but could encounter issues.            ║
║                                                                      ║
║ To upgrade Node.js:                                                  ║
║ • Visit: https://nodejs.org/en/download/                             ║
║ • Or use NodeSource: https://github.com/nodesource/distributions    ║
║                                                                      ║
║ For Ubuntu/Debian:                                                   ║
║   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - ║
║   sudo apt-get install -y nodejs                                     ║
╚══════════════════════════════════════════════════════════════════════╝
`);
    return false;
  }
  
  return true;
}

// Export for use in other scripts
export { getNodeVersion, checkNodeVersion };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkNodeVersion();
}