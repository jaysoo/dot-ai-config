#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { performance } from 'perf_hooks';

console.log('Testing ESLint Plugin Performance...\n');

// Ensure we're in the Nx workspace root
const workspaceRoot = '/Users/jack/projects/nx';
process.chdir(workspaceRoot);

// Test configurations
const testConfigs = [
  {
    name: 'With Cache',
    env: {
      NX_DAEMON: 'true',
      NX_PROJECT_GRAPH_CACHE: 'true',
    },
  },
  {
    name: 'Without Cache (as reported in issue)',
    env: {
      NX_DAEMON: 'false',
      NX_PROJECT_GRAPH_CACHE: 'false',
    },
  },
];

// Projects to test
const testProjects = [
  'nx',
  'nx-dev',
  'graph-client',
  'workspace',
  'angular',
];

console.log('Building ESLint plugin with timing logs...');
try {
  execSync('nx build eslint', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build ESLint plugin:', error.message);
  process.exit(1);
}

// Run tests
const results = [];

for (const config of testConfigs) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${config.name}`);
  console.log(`Environment: ${JSON.stringify(config.env)}`);
  console.log(`${'='.repeat(60)}\n`);
  
  const configResults = {
    name: config.name,
    env: config.env,
    projects: {},
  };
  
  for (const project of testProjects) {
    console.log(`\nTesting project: ${project}`);
    console.log('-'.repeat(40));
    
    const startTime = performance.now();
    
    try {
      // Clear any existing cache
      if (config.env.NX_PROJECT_GRAPH_CACHE === 'false') {
        execSync('nx reset', { stdio: 'pipe' });
      }
      
      // Run the lint command and capture output
      const output = execSync(`nx lint ${project} --skip-nx-cache`, {
        env: { ...process.env, ...config.env },
        encoding: 'utf-8',
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Extract timing logs from output
      const timingLogs = output
        .split('\n')
        .filter(line => line.includes('[ESLint Plugin]'))
        .join('\n');
      
      configResults.projects[project] = {
        duration: duration,
        success: true,
        timingLogs: timingLogs || 'No timing logs found',
      };
      
      console.log(`✅ Success in ${(duration / 1000).toFixed(2)}s`);
      if (timingLogs) {
        console.log('\nTiming logs:');
        console.log(timingLogs);
      }
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      configResults.projects[project] = {
        duration: duration,
        success: false,
        error: error.message,
      };
      
      console.log(`❌ Failed in ${(duration / 1000).toFixed(2)}s`);
      console.log(`Error: ${error.message}`);
    }
  }
  
  results.push(configResults);
}

// Generate report
console.log(`\n${'='.repeat(60)}`);
console.log('PERFORMANCE REPORT');
console.log(`${'='.repeat(60)}\n`);

const reportDir = '.ai/2025-06-20/tasks';
const reportPath = join(reportDir, 'eslint-performance-report.md');

let report = '# ESLint Plugin Performance Report\n\n';
report += `Generated at: ${new Date().toISOString()}\n\n`;

for (const result of results) {
  report += `## ${result.name}\n\n`;
  report += `Environment:\n`;
  report += '```json\n';
  report += JSON.stringify(result.env, null, 2);
  report += '\n```\n\n';
  
  report += '| Project | Duration (s) | Status | Notes |\n';
  report += '|---------|-------------|--------|-------|\n';
  
  let totalDuration = 0;
  for (const [project, data] of Object.entries(result.projects)) {
    const duration = (data.duration / 1000).toFixed(2);
    totalDuration += data.duration;
    const status = data.success ? '✅' : '❌';
    const notes = data.timingLogs ? 'Has timing logs' : 'No timing logs';
    report += `| ${project} | ${duration} | ${status} | ${notes} |\n`;
  }
  
  report += `\n**Total Duration:** ${(totalDuration / 1000).toFixed(2)}s\n\n`;
  
  // Add timing log details
  report += '### Timing Log Details\n\n';
  for (const [project, data] of Object.entries(result.projects)) {
    if (data.timingLogs && data.timingLogs !== 'No timing logs found') {
      report += `#### ${project}\n\n`;
      report += '```\n';
      report += data.timingLogs;
      report += '\n```\n\n';
    }
  }
}

// Comparison section
report += '## Performance Comparison\n\n';
if (results.length >= 2) {
  const withCache = results[0];
  const withoutCache = results[1];
  
  report += '| Project | With Cache (s) | Without Cache (s) | Difference (s) | Slowdown Factor |\n';
  report += '|---------|---------------|------------------|----------------|----------------|\n';
  
  for (const project of testProjects) {
    const withCacheDuration = (withCache.projects[project]?.duration || 0) / 1000;
    const withoutCacheDuration = (withoutCache.projects[project]?.duration || 0) / 1000;
    const difference = withoutCacheDuration - withCacheDuration;
    const slowdownFactor = withCacheDuration > 0 ? (withoutCacheDuration / withCacheDuration).toFixed(2) : 'N/A';
    
    report += `| ${project} | ${withCacheDuration.toFixed(2)} | ${withoutCacheDuration.toFixed(2)} | ${difference.toFixed(2)} | ${slowdownFactor}x |\n`;
  }
}

// Write report
writeFileSync(reportPath, report);
console.log(`\nReport saved to: ${reportPath}`);

// Summary
console.log('\nSummary:');
console.log('--------');
for (const result of results) {
  const totalDuration = Object.values(result.projects)
    .reduce((sum, data) => sum + data.duration, 0);
  console.log(`${result.name}: ${(totalDuration / 1000).toFixed(2)}s total`);
}