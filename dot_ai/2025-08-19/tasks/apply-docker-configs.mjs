#!/usr/bin/env node

/**
 * Script to actually apply Docker configurations to projects
 * This will modify the project files
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

// Special handling for workflow executor and log uploader (part of docker-setup)
const dockerSetupConfigs = {
  'workflow-executor': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-cloud-workflow-executor.dockerfile',
    imageName: 'nx-cloud-workflow-executor',
    platforms: ['linux/amd64', 'linux/arm64']
  },
  'workflow-log-uploader': {
    dockerfile: './apps/docker-setup/dockerfiles/nx-cloud-workflow-log-uploader.dockerfile',
    imageName: 'nx-cloud-workflow-log-uploader',
    platforms: ['linux/amd64', 'linux/arm64']
  }
};

// Docker targets template
function getDockerTargets(config, projectName) {
  return {
    [`docker-build${projectName ? `-${projectName}` : ''}`]: {
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
    [`docker-push${projectName ? `-${projectName}` : ''}`]: {
      executor: 'nx:run-commands',
      dependsOn: [`docker-build${projectName ? `-${projectName}` : ''}`],
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
function updateProjectConfig(projectName, projectPath, isPackageJson = false) {
  console.log(`\nProcessing ${projectName}...`);
  
  const config = dockerConfigs[projectName];
  if (!config) {
    console.log(`  ⚠️  No Docker configuration found for ${projectName}`);
    return false;
  }
  
  let configPath;
  let configData;
  let fullConfig;
  
  // Check for project.json or package.json
  const projectJsonPath = join(projectPath, 'project.json');
  const packageJsonPath = join(projectPath, 'package.json');
  
  if (existsSync(projectJsonPath)) {
    configPath = projectJsonPath;
    configData = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
    fullConfig = configData;
  } else if (existsSync(packageJsonPath)) {
    configPath = packageJsonPath;
    fullConfig = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    // Ensure nx configuration exists
    if (!fullConfig.nx) {
      console.log(`  ⚠️  No nx configuration in package.json for ${projectName}`);
      return false;
    }
    configData = fullConfig.nx;
    isPackageJson = true;
  } else {
    console.log(`  ❌ No configuration file found for ${projectName}`);
    return false;
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
  
  // Write the updated configuration
  if (isPackageJson) {
    fullConfig.nx = configData;
    writeFileSync(configPath, JSON.stringify(fullConfig, null, 2) + '\n');
  } else {
    writeFileSync(configPath, JSON.stringify(configData, null, 2) + '\n');
  }
  
  console.log(`  ✅ Docker targets added to ${configPath}`);
  console.log(`     - docker-build`);
  console.log(`     - docker-push`);
  
  return true;
}

// Special handling for docker-setup project (has multiple Docker images)
function updateDockerSetupProject() {
  console.log('\nProcessing docker-setup (special handling for multiple images)...');
  
  const projectPath = './apps/docker-setup/project.json';
  if (!existsSync(projectPath)) {
    console.log('  ❌ docker-setup project.json not found');
    return false;
  }
  
  const configData = JSON.parse(readFileSync(projectPath, 'utf-8'));
  
  if (!configData.targets) {
    configData.targets = {};
  }
  
  // Add targets for each Docker image in docker-setup
  for (const [name, config] of Object.entries(dockerSetupConfigs)) {
    const targets = getDockerTargets(config, name);
    Object.assign(configData.targets, targets);
  }
  
  // Add tags
  if (!configData.tags) {
    configData.tags = [];
  }
  if (!configData.tags.includes('docker')) {
    configData.tags.push('docker');
  }
  
  writeFileSync(projectPath, JSON.stringify(configData, null, 2) + '\n');
  
  console.log(`  ✅ Docker targets added to ${projectPath}`);
  console.log(`     - docker-build-workflow-executor`);
  console.log(`     - docker-push-workflow-executor`);
  console.log(`     - docker-build-workflow-log-uploader`);
  console.log(`     - docker-push-workflow-log-uploader`);
  
  return true;
}

// Main execution
console.log('Applying Docker configurations to projects...\n');

let successCount = 0;
let failCount = 0;

// Process each project
for (const [projectName] of Object.entries(dockerConfigs)) {
  const projectPaths = [
    `./apps/${projectName}`,
    `./libs/${projectName}`,
    `./packages/${projectName}`
  ];
  
  let processed = false;
  for (const path of projectPaths) {
    if (existsSync(path)) {
      if (updateProjectConfig(projectName, path)) {
        successCount++;
      } else {
        failCount++;
      }
      processed = true;
      break;
    }
  }
  
  if (!processed) {
    console.log(`\n⚠️  Project ${projectName} not found in any standard location`);
    failCount++;
  }
}

// Handle docker-setup project
if (updateDockerSetupProject()) {
  successCount++;
} else {
  failCount++;
}

console.log('\n\n📋 Summary:');
console.log(`✅ ${successCount} projects updated successfully`);
console.log(`❌ ${failCount} projects failed to update`);

console.log('\n\n🎯 Next Steps:');
console.log('1. Review the updated project configurations');
console.log('2. Test Docker builds: nx run <project>:docker-build --args.version=test');
console.log('3. Update nx.json with the release configuration');
console.log('4. Migrate build scripts to use nx release commands');