#!/usr/bin/env node

/**
 * Script to add Docker targets to project configurations
 * This will update project.json files to include @nx/docker executors
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// Docker configuration for each project
const dockerConfigs = {
  'nx-api': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-api.dockerfile',
    imageName: 'nx-cloud-nx-api',
    platforms: ['linux/amd64']
  },
  'file-server': {
    dockerfile: './apps/docker-setup/dockerfiles/file-server.dockerfile',
    imageName: 'nx-cloud-file-server',
    platforms: ['linux/amd64']
  },
  'aggregator': {
    dockerfile: './apps/docker-setup/dockerfiles/aggregator.dockerfile',
    imageName: 'nx-cloud-aggregator',
    platforms: ['linux/amd64']
  },
  'nx-cloud-workflow-controller': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-cloud-workflow-controller.dockerfile',
    imageName: 'nx-cloud-workflow-controller',
    platforms: ['linux/amd64']
  },
  'nx-ai': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-ai.dockerfile',
    imageName: 'nx-cloud-ai',
    platforms: ['linux/amd64']
  },
  'nx-background-worker': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-background-worker.dockerfile',
    imageName: 'nx-cloud-background-worker',
    platforms: ['linux/amd64']
  },
  'activemq': {
    dockerfile: './apps/activemq/activemq.dockerfile',
    imageName: 'activemq',
    platforms: ['linux/amd64']
  }
};

// Docker targets template
function getDockerTargets(config) {
  return {
    'docker-build': {
      executor: '@nx/docker:build',
      options: {
        file: config.dockerfile,
        platforms: config.platforms,
        tags: [
          `${config.imageName}:latest`,
          `${config.imageName}:{args.version}`
        ],
        buildArgs: {
          NX_VERSION: '{args.version}'
        },
        push: false
      },
      configurations: {
        production: {
          cache: true,
          cacheFrom: [
            `type=registry,ref=us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud/${config.imageName}:latest`
          ],
          cacheTo: 'type=inline'
        }
      }
    },
    'docker-push': {
      executor: 'nx:run-commands',
      dependsOn: ['docker-build'],
      options: {
        commands: [
          `docker tag ${config.imageName}:{args.version} us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud/${config.imageName}:{args.version}`,
          `docker tag ${config.imageName}:{args.version} quay.io/nxdev/${config.imageName}:{args.version}`,
          `docker push us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud/${config.imageName}:{args.version}`,
          `docker push quay.io/nxdev/${config.imageName}:{args.version}`
        ],
        parallel: false
      }
    }
  };
}

// Function to update project configuration
function updateProjectConfig(projectName, projectPath) {
  console.log(`\nProcessing ${projectName}...`);
  
  const config = dockerConfigs[projectName];
  if (!config) {
    console.log(`  ⚠️  No Docker configuration found for ${projectName}`);
    return;
  }
  
  let configPath;
  let configData;
  
  // Check for project.json
  const projectJsonPath = join(projectPath, 'project.json');
  const packageJsonPath = join(projectPath, 'package.json');
  
  if (existsSync(projectJsonPath)) {
    configPath = projectJsonPath;
    configData = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
  } else if (existsSync(packageJsonPath)) {
    configPath = packageJsonPath;
    configData = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    // Ensure nx configuration exists
    if (!configData.nx) {
      console.log(`  ⚠️  No nx configuration in package.json for ${projectName}`);
      return;
    }
    configData = configData.nx;
  } else {
    console.log(`  ❌ No configuration file found for ${projectName}`);
    return;
  }
  
  // Add Docker targets
  const dockerTargets = getDockerTargets(config);
  
  if (!configData.targets) {
    configData.targets = {};
  }
  
  // Add Docker targets
  Object.assign(configData.targets, dockerTargets);
  
  // Add tags if not present
  if (!configData.tags) {
    configData.tags = [];
  }
  if (!configData.tags.includes('docker')) {
    configData.tags.push('docker');
  }
  
  console.log(`  ✅ Docker targets added to ${projectName}`);
  console.log(`     - docker-build`);
  console.log(`     - docker-push`);
  
  // Return the updated config for review (not writing yet)
  return {
    path: configPath,
    config: configPath.endsWith('package.json') ? { nx: configData } : configData
  };
}

// Main execution
console.log('Adding Docker targets to projects...\n');

const updates = [];

// Process each project
for (const [projectName] of Object.entries(dockerConfigs)) {
  const projectPaths = [
    `./apps/${projectName}`,
    `./libs/${projectName}`,
    `./packages/${projectName}`
  ];
  
  for (const path of projectPaths) {
    if (existsSync(path)) {
      const update = updateProjectConfig(projectName, path);
      if (update) {
        updates.push(update);
      }
      break;
    }
  }
}

console.log('\n\n📋 Summary:');
console.log(`${updates.length} project configurations ready to update`);

console.log('\n\nConfigurations to be written:');
updates.forEach(update => {
  console.log(`\n${update.path}:`);
  console.log(JSON.stringify(update.config, null, 2).substring(0, 500) + '...');
});

console.log('\n\n⚠️  This is a dry run. To apply changes, uncomment the write operations in the script.');