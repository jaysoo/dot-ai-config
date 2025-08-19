#!/usr/bin/env node

/**
 * Script to fix the Docker + Nx Release configuration
 * This will:
 * 1. Remove manually added docker targets
 * 2. Add release.docker.repositoryName to each project
 * 3. Create proper nx.json configuration
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Docker projects and their repository names
const dockerProjects = {
  'nx-api': 'nx-cloud-nx-api',
  'file-server': 'nx-cloud-file-server',
  'aggregator': 'nx-cloud-aggregator',
  'nx-cloud-workflow-controller': 'nx-cloud-workflow-controller',
  'nx-ai': 'nx-cloud-ai',
  'nx-background-worker': 'nx-cloud-background-worker',
  'activemq': 'activemq',
  'docker-setup': null // Special handling for multiple images
};

// Step 1: Remove manually added docker targets and add release config
function fixProjectConfig(projectName, repositoryName) {
  console.log(`\nProcessing ${projectName}...`);
  
  const projectPaths = [
    `./apps/${projectName}/project.json`,
    `./apps/${projectName}/package.json`,
    `./libs/${projectName}/project.json`,
  ];
  
  for (const path of projectPaths) {
    if (existsSync(path)) {
      const isPackageJson = path.endsWith('package.json');
      let config = JSON.parse(readFileSync(path, 'utf-8'));
      let projectConfig = isPackageJson ? config.nx : config;
      
      if (!projectConfig) {
        console.log(`  ⚠️  No nx configuration found in ${path}`);
        continue;
      }
      
      // Remove manually added docker targets
      if (projectConfig.targets) {
        const targetsToRemove = ['docker-build', 'docker-push', 
                                 'docker-build-workflow-executor', 'docker-push-workflow-executor',
                                 'docker-build-workflow-log-uploader', 'docker-push-workflow-log-uploader'];
        
        for (const target of targetsToRemove) {
          if (projectConfig.targets[target]) {
            delete projectConfig.targets[target];
            console.log(`  ✅ Removed ${target} target`);
          }
        }
      }
      
      // Remove docker tag if it was added
      if (projectConfig.tags) {
        projectConfig.tags = projectConfig.tags.filter(tag => tag !== 'docker');
      }
      
      // Add release configuration with repositoryName
      if (repositoryName) {
        if (!projectConfig.release) {
          projectConfig.release = {};
        }
        if (!projectConfig.release.docker) {
          projectConfig.release.docker = {};
        }
        projectConfig.release.docker.repositoryName = repositoryName;
        console.log(`  ✅ Added release.docker.repositoryName: ${repositoryName}`);
      }
      
      // Write back
      if (isPackageJson) {
        config.nx = projectConfig;
        writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
      } else {
        writeFileSync(path, JSON.stringify(projectConfig, null, 2) + '\n');
      }
      
      console.log(`  ✅ Updated ${path}`);
      break;
    }
  }
}

// Step 2: Create proper nx.json release configuration
function createNxJsonConfig() {
  console.log('\nCreating nx.json release configuration...');
  
  const nxJsonPath = './nx.json';
  const nxJson = JSON.parse(readFileSync(nxJsonPath, 'utf-8'));
  
  // Add @nx/docker plugin if not present
  if (!nxJson.plugins) {
    nxJson.plugins = [];
  }
  
  const hasDockerPlugin = nxJson.plugins.some(p => 
    (typeof p === 'string' && p === '@nx/docker') ||
    (typeof p === 'object' && p.plugin === '@nx/docker')
  );
  
  if (!hasDockerPlugin) {
    nxJson.plugins.push({
      plugin: '@nx/docker',
      options: {
        buildTargetName: 'docker:build',
        pushTargetName: 'docker:push'
      }
    });
    console.log('  ✅ Added @nx/docker plugin');
  }
  
  // Update release configuration
  if (!nxJson.release) {
    nxJson.release = {};
  }
  
  // Keep existing release config but add docker group
  nxJson.release.groups = nxJson.release.groups || {};
  
  nxJson.release.groups['docker-images'] = {
    projects: [
      'nx-api',
      'file-server', 
      'aggregator',
      'nx-cloud-workflow-controller',
      'nx-ai',
      'nx-background-worker',
      'activemq'
    ],
    projectsRelationship: 'fixed',
    version: {
      generator: './.ai/2025-08-19/tasks/calver-version-generator.mjs'
    },
    docker: {
      registryUrl: 'us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud',
      skipVersionActions: false,
      additionalRegistryUrls: ['quay.io/nxdev']
    }
  };
  
  console.log('  ✅ Added docker-images release group');
  
  // Write preview
  writeFileSync('.ai/2025-08-19/tasks/nx.json.preview', JSON.stringify(nxJson, null, 2) + '\n');
  console.log('  📝 Preview saved to .ai/2025-08-19/tasks/nx.json.preview');
  
  return nxJson;
}

// Step 3: Handle special cases (docker-setup with multiple images)
function handleDockerSetup() {
  console.log('\nHandling docker-setup project (multiple images)...');
  
  const projectPath = './apps/docker-setup/project.json';
  if (!existsSync(projectPath)) {
    console.log('  ❌ docker-setup project.json not found');
    return;
  }
  
  const config = JSON.parse(readFileSync(projectPath, 'utf-8'));
  
  // Add release configuration for multiple Docker images
  config.release = {
    docker: {
      // This project builds multiple images, handled differently
      multipleImages: true,
      images: [
        { repositoryName: 'nx-cloud-workflow-executor' },
        { repositoryName: 'nx-cloud-workflow-log-uploader' }
      ]
    }
  };
  
  // Clean up targets (remove manually added ones)
  const targetsToRemove = [
    'docker-build-workflow-executor', 
    'docker-push-workflow-executor',
    'docker-build-workflow-log-uploader', 
    'docker-push-workflow-log-uploader'
  ];
  
  for (const target of targetsToRemove) {
    if (config.targets && config.targets[target]) {
      delete config.targets[target];
      console.log(`  ✅ Removed ${target} target`);
    }
  }
  
  writeFileSync(projectPath, JSON.stringify(config, null, 2) + '\n');
  console.log('  ✅ Updated docker-setup project configuration');
}

// Main execution
console.log('Fixing Docker + Nx Release configuration...\n');

// Fix each project
for (const [projectName, repositoryName] of Object.entries(dockerProjects)) {
  if (repositoryName) {
    fixProjectConfig(projectName, repositoryName);
  }
}

// Handle docker-setup specially
handleDockerSetup();

// Create nx.json config
const nxJsonConfig = createNxJsonConfig();

console.log('\n\n📋 Summary:');
console.log('✅ Removed manually added docker targets from all projects');
console.log('✅ Added release.docker.repositoryName to each project');
console.log('✅ Created nx.json release configuration preview');

console.log('\n\n🎯 Next Steps:');
console.log('1. Review .ai/2025-08-19/tasks/nx.json.preview');
console.log('2. Apply nx.json changes: cp .ai/2025-08-19/tasks/nx.json.preview nx.json');
console.log('3. Create Dockerfile in each project directory (or symlink from docker-setup/dockerfiles)');
console.log('4. Test: nx release --group=docker-images --dry-run');

console.log('\n\n⚠️  Note: Since Dockerfiles are centralized, you may need to:');
console.log('   - Create symlinks: ln -s ../../docker-setup/dockerfiles/nx-api.dockerfile apps/nx-api/Dockerfile');
console.log('   - OR move Dockerfiles to project directories');
console.log('   - OR use custom targets instead of @nx/docker inference');