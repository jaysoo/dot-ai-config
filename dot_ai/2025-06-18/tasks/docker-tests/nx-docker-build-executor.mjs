#!/usr/bin/env node
/**
 * Example Nx Docker Build Executor with Caching
 * This demonstrates how to integrate Docker builds with Nx's caching system
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, statSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import crypto from 'crypto';

class NxDockerBuildExecutor {
  constructor(options, context) {
    this.options = options;
    this.context = context;
    this.cacheDir = options.cacheDir || join(context.root, '.nx', 'cache', 'docker');
  }

  /**
   * Calculate hash for cache key based on inputs
   */
  calculateCacheKey() {
    const inputs = {
      dockerfile: this.readFileContent(this.options.dockerfile),
      context: this.getDirectoryHash(this.options.context),
      buildArgs: this.options.buildArgs || {},
      target: this.options.target,
      platform: this.options.platform
    };
    
    return crypto.createHash('sha256')
      .update(JSON.stringify(inputs))
      .digest('hex')
      .substring(0, 16);
  }

  readFileContent(filePath) {
    try {
      return readFileSync(filePath, 'utf-8');
    } catch {
      return null;
    }
  }

  getDirectoryHash(dirPath) {
    // In real implementation, would recursively hash directory contents
    // For demo, using modification time
    try {
      return statSync(dirPath).mtime.toISOString();
    } catch {
      return Date.now().toString();
    }
  }

  /**
   * Try to restore image from cache
   */
  async restoreFromCache(cacheKey, imageName) {
    const cachePaths = [
      join(this.cacheDir, `${cacheKey}.tar`),
      // Could also check Nx Cloud cache here
    ];

    for (const cachePath of cachePaths) {
      if (existsSync(cachePath)) {
        console.log(`📦 Cache hit! Restoring from: ${cachePath}`);
        try {
          execSync(`docker load -i ${cachePath}`, { stdio: 'pipe' });
          
          // Tag with the desired name
          const cachedTag = `cached:${cacheKey}`;
          execSync(`docker tag ${cachedTag} ${imageName}`, { stdio: 'pipe' });
          
          return true;
        } catch (e) {
          console.warn(`⚠️  Failed to restore from cache: ${e.message}`);
        }
      }
    }
    
    return false;
  }

  /**
   * Save built image to cache
   */
  async saveToCache(cacheKey, imageName) {
    const cachePath = join(this.cacheDir, `${cacheKey}.tar`);
    
    // Ensure cache directory exists
    mkdirSync(dirname(cachePath), { recursive: true });
    
    try {
      // Tag for caching
      const cachedTag = `cached:${cacheKey}`;
      execSync(`docker tag ${imageName} ${cachedTag}`, { stdio: 'pipe' });
      
      // Save image
      console.log(`💾 Saving to cache: ${cachePath}`);
      execSync(`docker save ${cachedTag} -o ${cachePath}`, { stdio: 'pipe' });
      
      // Also save metadata
      const metadataPath = cachePath.replace('.tar', '.json');
      const metadata = {
        cacheKey,
        imageName,
        createdAt: new Date().toISOString(),
        size: statSync(cachePath).size,
        options: this.options
      };
      const { writeFileSync } = await import('fs');
      writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      return true;
    } catch (e) {
      console.error(`❌ Failed to save to cache: ${e.message}`);
      return false;
    }
  }

  /**
   * Build Docker image
   */
  async buildImage(imageName) {
    const buildCommand = this.constructBuildCommand(imageName);
    
    console.log(`🔨 Building Docker image...`);
    console.log(`   Command: ${buildCommand}`);
    
    try {
      execSync(buildCommand, { stdio: 'inherit', cwd: this.context.root });
      return true;
    } catch (e) {
      console.error(`❌ Docker build failed: ${e.message}`);
      return false;
    }
  }

  constructBuildCommand(imageName) {
    const parts = ['docker', 'build'];
    
    // Add tags
    parts.push('-t', imageName);
    if (this.options.tags) {
      this.options.tags.forEach(tag => parts.push('-t', tag));
    }
    
    // Add dockerfile
    parts.push('-f', this.options.dockerfile);
    
    // Add build args
    if (this.options.buildArgs) {
      Object.entries(this.options.buildArgs).forEach(([key, value]) => {
        parts.push('--build-arg', `${key}=${value}`);
      });
    }
    
    // Add target
    if (this.options.target) {
      parts.push('--target', this.options.target);
    }
    
    // Add platform
    if (this.options.platform) {
      parts.push('--platform', this.options.platform);
    }
    
    // Add context
    parts.push(this.options.context);
    
    return parts.join(' ');
  }

  /**
   * Push image if requested
   */
  async pushImage(imageName) {
    if (!this.options.push) {
      return true;
    }
    
    console.log(`📤 Pushing image: ${imageName}`);
    try {
      execSync(`docker push ${imageName}`, { stdio: 'inherit' });
      return true;
    } catch (e) {
      console.error(`❌ Docker push failed: ${e.message}`);
      return false;
    }
  }

  /**
   * Main execution
   */
  async execute() {
    console.log('🐳 Nx Docker Build Executor');
    console.log(`   Project: ${this.context.projectName}`);
    console.log(`   Target: ${this.context.targetName}`);
    
    const imageName = this.options.imageName || 
      `${this.context.projectName}:${this.context.targetName}`;
    
    // Calculate cache key
    const cacheKey = this.calculateCacheKey();
    console.log(`   Cache key: ${cacheKey}`);
    
    // Try to restore from cache
    if (this.options.cache !== false) {
      const restored = await this.restoreFromCache(cacheKey, imageName);
      if (restored) {
        console.log('✅ Image restored from cache!');
        
        // Still need to push if requested
        if (this.options.push) {
          await this.pushImage(imageName);
        }
        
        return { success: true, cached: true };
      }
    }
    
    // Build the image
    const built = await this.buildImage(imageName);
    if (!built) {
      return { success: false };
    }
    
    // Save to cache
    if (this.options.cache !== false) {
      await this.saveToCache(cacheKey, imageName);
    }
    
    // Push if requested
    if (this.options.push) {
      const pushed = await this.pushImage(imageName);
      if (!pushed) {
        return { success: false };
      }
    }
    
    return { success: true, cached: false };
  }
}

// Example usage (would be called by Nx)
const mockContext = {
  root: process.cwd(),
  projectName: 'my-app',
  targetName: 'docker-build'
};

const mockOptions = {
  dockerfile: './simple-app/Dockerfile',
  context: './simple-app',
  imageName: 'test-app:nx-cached',
  cache: true,
  push: false,
  cacheDir: './.ai/2025-06-18/tasks/docker-tests/nx-cache-simulation'
};

// Run the executor
const executor = new NxDockerBuildExecutor(mockOptions, mockContext);
const result = await executor.execute();

console.log('\n📊 Execution Result:', result);