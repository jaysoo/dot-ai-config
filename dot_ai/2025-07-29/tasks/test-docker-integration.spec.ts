import 'nx/src/internal-testing-utils/mock-project-graph';

import {
  readProjectConfiguration,
  readNxJson,
  Tree,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '@nx/node';

describe('Node app Docker integration', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  describe('skipDockerPlugin flag', () => {
    it('should not initialize @nx/docker plugin when skipDockerPlugin is true', async () => {
      await applicationGenerator(tree, {
        directory: 'apps/legacy-api',
        framework: 'express',
        docker: true,
        skipDockerPlugin: true,
        addPlugin: true,
      });

      const nxJson = readNxJson(tree);
      const hasDockerPlugin = nxJson.plugins?.some(
        (plugin) => typeof plugin === 'string' 
          ? plugin === '@nx/docker' 
          : plugin.plugin === '@nx/docker'
      );
      
      expect(hasDockerPlugin).toBeFalsy();
    });

    it('should initialize @nx/docker plugin when skipDockerPlugin is false', async () => {
      await applicationGenerator(tree, {
        directory: 'apps/modern-api',
        framework: 'express',
        docker: true,
        skipDockerPlugin: false,
        addPlugin: true,
      });

      const nxJson = readNxJson(tree);
      const hasDockerPlugin = nxJson.plugins?.some(
        (plugin) => typeof plugin === 'string' 
          ? plugin === '@nx/docker' 
          : plugin.plugin === '@nx/docker'
      );
      
      expect(hasDockerPlugin).toBeTruthy();
    });

    it('should create docker-build target only when skipDockerPlugin is true', async () => {
      // Test with skipDockerPlugin=true
      await applicationGenerator(tree, {
        directory: 'apps/legacy-docker',
        framework: 'express',
        docker: true,
        skipDockerPlugin: true,
        addPlugin: true,
      });

      let project = readProjectConfiguration(tree, 'legacy-docker');
      expect(project.targets?.['docker-build']).toBeDefined();
      expect(project.targets?.['docker-build']).toMatchObject({
        dependsOn: ['build'],
        command: expect.stringContaining('docker build'),
      });

      // Reset tree
      tree = createTreeWithEmptyWorkspace();

      // Test with skipDockerPlugin=false
      await applicationGenerator(tree, {
        directory: 'apps/modern-docker',
        framework: 'express',
        docker: true,
        skipDockerPlugin: false,
        addPlugin: true,
      });

      project = readProjectConfiguration(tree, 'modern-docker');
      expect(project.targets?.['docker-build']).toBeUndefined();
    });

    it('should generate correct Dockerfile paths based on skipDockerPlugin', async () => {
      // Test with skipDockerPlugin=true (workspace-relative paths)
      await applicationGenerator(tree, {
        directory: 'apps/legacy-paths',
        framework: 'express',
        docker: true,
        skipDockerPlugin: true,
        addPlugin: true,
      });

      let dockerFile = tree.read('apps/legacy-paths/Dockerfile', 'utf8');
      expect(dockerFile).toContain('COPY dist/apps/legacy-paths legacy-paths/');
      expect(dockerFile).toContain('COPY apps/legacy-paths/package.json legacy-paths/');
      expect(dockerFile).toContain('npx nx docker-build');

      // Reset tree
      tree = createTreeWithEmptyWorkspace();

      // Test with skipDockerPlugin=false (project-relative paths)
      await applicationGenerator(tree, {
        directory: 'apps/modern-paths',
        framework: 'express',
        docker: true,
        skipDockerPlugin: false,
        addPlugin: true,
      });

      dockerFile = tree.read('apps/modern-paths/Dockerfile', 'utf8');
      expect(dockerFile).toContain('COPY dist modern-paths/');
      expect(dockerFile).toContain('COPY package.json modern-paths/');
      expect(dockerFile).toContain('npx nx docker:build');
    });

    it('should work correctly with deeply nested projects', async () => {
      // Test with skipDockerPlugin=false
      await applicationGenerator(tree, {
        directory: 'apps/backend/services/api',
        framework: 'express',
        docker: true,
        skipDockerPlugin: false,
        addPlugin: true,
      });

      const dockerFile = tree.read('apps/backend/services/api/Dockerfile', 'utf8');
      expect(dockerFile).toContain('COPY dist api/');
      expect(dockerFile).toContain('COPY package.json api/');
      expect(dockerFile).not.toContain('apps/backend/services/api');
    });

    it('should work with various frameworks', async () => {
      const frameworks = ['express', 'fastify', 'koa', 'none'] as const;

      for (const framework of frameworks) {
        tree = createTreeWithEmptyWorkspace();

        await applicationGenerator(tree, {
          directory: `apps/${framework}-app`,
          framework,
          docker: true,
          skipDockerPlugin: false,
          addPlugin: true,
        });

        const dockerFile = tree.read(`apps/${framework}-app/Dockerfile`, 'utf8');
        expect(dockerFile).toBeTruthy();
        expect(dockerFile).toContain('COPY dist');
        expect(dockerFile).toContain('COPY package.json');
      }
    });

    it('should work correctly for Nest framework', async () => {
      await applicationGenerator(tree, {
        directory: 'apps/nest-api',
        framework: 'nest',
        docker: true,
        skipDockerPlugin: false,
        addPlugin: true,
      });

      const dockerFile = tree.read('apps/nest-api/Dockerfile', 'utf8');
      expect(dockerFile).toBeTruthy();
      // Nest might have different structure, but should still use project-relative paths
      expect(dockerFile).toContain('package.json');
      expect(dockerFile).not.toContain('apps/nest-api/package.json');
    });
  });
});