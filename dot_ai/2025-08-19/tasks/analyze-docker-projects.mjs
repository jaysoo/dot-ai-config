#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Map Docker images from package-scripts.js to potential Nx projects
const dockerImageMapping = {
  'nx-cloud-nx-api': 'nx-api',
  'nx-cloud-file-server': 'file-server',
  'nx-cloud-aggregator': 'aggregator',
  'nx-cloud-workflow-controller': 'nx-cloud-workflow-controller',
  'nx-cloud-workflow-executor': 'docker-setup', // May be part of docker-setup
  'nx-cloud-workflow-log-uploader': 'docker-setup', // May be part of docker-setup
  'nx-cloud-frontend': 'nx-cloud',
  'nx-cloud-ai': 'nx-ai',
  'nx-cloud-background-worker': 'nx-background-worker',
  'activemq': 'activemq'
};

// Dockerfiles location based on package-scripts.js
const dockerfiles = {
  'nx-api': './apps/docker-setup/dockerfiles/nx-api.dockerfile',
  'file-server': './apps/docker-setup/dockerfiles/file-server.dockerfile',
  'aggregator': './apps/docker-setup/dockerfiles/aggregator.dockerfile',
  'nx-cloud-workflow-controller': './apps/docker-setup/dockerfiles/nx-cloud-workflow-controller.dockerfile',
  'nx-cloud-workflow-executor': './apps/docker-setup/dockerfiles/nx-cloud-workflow-executor.dockerfile',
  'nx-cloud-workflow-log-uploader': './apps/docker-setup/dockerfiles/nx-cloud-workflow-log-uploader.dockerfile',
  'nx-cloud-frontend': './apps/docker-setup/dockerfiles/nx-cloud-frontend.dockerfile',
  'nx-ai': './apps/docker-setup/dockerfiles/nx-ai.dockerfile',
  'nx-background-worker': './apps/docker-setup/dockerfiles/nx-background-worker.dockerfile',
  'activemq': './apps/activemq/activemq.dockerfile'
};

console.log('# Docker Image to Nx Project Mapping\n');
console.log('| Docker Image | Nx Project | Dockerfile | Project Config Exists |');
console.log('|--------------|------------|------------|----------------------|');

for (const [dockerImage, projectName] of Object.entries(dockerImageMapping)) {
  const dockerfile = dockerfiles[projectName] || dockerfiles[dockerImage.replace('nx-cloud-', '')];
  
  // Check if project.json exists
  const projectPaths = [
    `./apps/${projectName}/project.json`,
    `./libs/${projectName}/project.json`,
    `./packages/${projectName}/project.json`
  ];
  
  let projectConfigExists = false;
  let projectPath = '';
  for (const path of projectPaths) {
    if (existsSync(path)) {
      projectConfigExists = true;
      projectPath = path;
      break;
    }
  }
  
  console.log(`| ${dockerImage} | ${projectName} | ${dockerfile || 'N/A'} | ${projectConfigExists ? `✅ ${projectPath}` : '❌'} |`);
}

console.log('\n## Registries Used:');
console.log('- GAR: `us-east1-docker.pkg.dev/nxcloudoperations/nx-cloud`');
console.log('- Quay: `quay.io/nxdev`');
console.log('- DockerHub: `nxprivatecloud` (public releases)');

console.log('\n## Next Steps:');
console.log('1. Create/update project.json files for projects without configs');
console.log('2. Add Docker targets to each project');
console.log('3. Configure nx.json release groups for Docker images');