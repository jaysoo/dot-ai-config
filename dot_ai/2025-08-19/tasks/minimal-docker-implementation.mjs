#!/usr/bin/env node

/**
 * Minimal implementation for nx release Docker support
 * 
 * This script adds the bare minimum needed to use nx release for Docker
 * WITHOUT changing the existing structure
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

// Docker projects and their image names (from package-scripts.js)
const dockerProjects = {
  'nx-api': {
    imageName: 'nx-cloud-nx-api',
    dockerfile: './apps/docker-setup/dockerfiles/nx-api.dockerfile'
  },
  'file-server': {
    imageName: 'nx-cloud-file-server',
    dockerfile: './apps/docker-setup/dockerfiles/file-server.dockerfile'
  },
  'aggregator': {
    imageName: 'nx-cloud-aggregator',
    dockerfile: './apps/docker-setup/dockerfiles/aggregator.dockerfile'
  },
  'nx-cloud-workflow-controller': {
    imageName: 'nx-cloud-workflow-controller',
    dockerfile: './apps/docker-setup/dockerfiles/nx-cloud-workflow-controller.dockerfile'
  },
  'nx-ai': {
    imageName: 'nx-cloud-ai',
    dockerfile: './apps/docker-setup/dockerfiles/nx-ai.dockerfile'
  },
  'nx-background-worker': {
    imageName: 'nx-cloud-background-worker',
    dockerfile: './apps/docker-setup/dockerfiles/nx-background-worker.dockerfile'
  },
  'activemq': {
    imageName: 'activemq',
    dockerfile: './apps/activemq/activemq.dockerfile'
  }
};

console.log('Setting up minimal nx release Docker support...\n');

// Step 1: Add custom docker targets to each project
function addCustomDockerTargets(projectName, config) {
  const projectPaths = [
    `./apps/${projectName}/project.json`,
    `./apps/${projectName}/package.json`
  ];
  
  for (const path of projectPaths) {
    if (existsSync(path)) {
      const isPackageJson = path.endsWith('package.json');
      let fileContent = JSON.parse(readFileSync(path, 'utf-8'));
      let projectConfig = isPackageJson ? fileContent.nx : fileContent;
      
      if (!projectConfig) continue;
      
      // Add minimal custom docker targets
      if (!projectConfig.targets) {
        projectConfig.targets = {};
      }
      
      // Custom docker:build target using existing dockerfile location
      projectConfig.targets['docker:build'] = {
        executor: 'nx:run-commands',
        options: {
          commands: [
            `docker buildx build --platform linux/amd64 -t ${config.imageName}:\${NX_RELEASE_VERSION} --build-arg NX_VERSION=\${NX_RELEASE_VERSION} -f ${config.dockerfile} .`
          ]
        }
      };
      
      // Custom docker:push target
      projectConfig.targets['docker:push'] = {
        executor: 'nx:run-commands',
        dependsOn: ['docker:build'],
        options: {
          commands: [
            `docker tag ${config.imageName}:\${NX_RELEASE_VERSION} us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud/${config.imageName}:\${NX_RELEASE_VERSION}`,
            `docker tag ${config.imageName}:\${NX_RELEASE_VERSION} quay.io/nxdev/${config.imageName}:\${NX_RELEASE_VERSION}`,
            `docker push us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud/${config.imageName}:\${NX_RELEASE_VERSION}`,
            `docker push quay.io/nxdev/${config.imageName}:\${NX_RELEASE_VERSION}`
          ]
        }
      };
      
      // Add release configuration
      if (!projectConfig.release) {
        projectConfig.release = {};
      }
      if (!projectConfig.release.docker) {
        projectConfig.release.docker = {};
      }
      projectConfig.release.docker.repositoryName = config.imageName;
      
      // Write back
      if (isPackageJson) {
        fileContent.nx = projectConfig;
        writeFileSync(path, JSON.stringify(fileContent, null, 2) + '\n');
      } else {
        writeFileSync(path, JSON.stringify(projectConfig, null, 2) + '\n');
      }
      
      console.log(`✅ Added custom docker targets to ${projectName}`);
      break;
    }
  }
}

// Step 2: Update nx.json with minimal release configuration
function updateNxJson() {
  const nxJsonPath = './nx.json';
  const nxJson = JSON.parse(readFileSync(nxJsonPath, 'utf-8'));
  
  // Add docker-images release group
  if (!nxJson.release) {
    nxJson.release = {};
  }
  if (!nxJson.release.groups) {
    nxJson.release.groups = {};
  }
  
  nxJson.release.groups['docker-images'] = {
    projects: Object.keys(dockerProjects),
    projectsRelationship: 'fixed',
    version: {
      generator: './.ai/2025-08-19/tasks/calver-version-generator.mjs'
    }
  };
  
  // Save preview
  writeFileSync('.ai/2025-08-19/tasks/nx.json-minimal.preview', JSON.stringify(nxJson, null, 2) + '\n');
  console.log('\n✅ Created nx.json preview at .ai/2025-08-19/tasks/nx.json-minimal.preview');
}

// Execute
console.log('Adding custom docker targets to projects...\n');
for (const [project, config] of Object.entries(dockerProjects)) {
  addCustomDockerTargets(project, config);
}

console.log('\nUpdating nx.json...');
updateNxJson();

console.log('\n\n📋 Summary:');
console.log('✅ Added custom docker:build and docker:push targets to all projects');
console.log('✅ Targets use existing Dockerfiles in apps/docker-setup/dockerfiles/');
console.log('✅ Added release.docker.repositoryName to each project');
console.log('✅ Created nx.json preview with docker-images release group');

console.log('\n🎯 Next Steps:');
console.log('1. Review and apply nx.json: cp .ai/2025-08-19/tasks/nx.json-minimal.preview nx.json');
console.log('2. Test: NX_RELEASE_VERSION=test nx run nx-api:docker:build');
console.log('3. Use nx release: nx release --group=docker-images');