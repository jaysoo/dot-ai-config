#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const workDir = join(process.cwd(), '.ai/2025-06-18/tasks/docker-tests');
const nxCacheDir = join(workDir, 'nx-cache-simulation');

// Create cache directory
if (!existsSync(nxCacheDir)) {
  mkdirSync(nxCacheDir, { recursive: true });
}

console.log('🔍 Exploring Nx Docker Cache Integration Options\n');

// Simulate Nx cache hash calculation
function calculateHash(inputs) {
  return crypto.createHash('sha256').update(JSON.stringify(inputs)).digest('hex').substring(0, 16);
}

// Option 1: Docker Save/Load Integration
console.log('📦 Option 1: Docker Save/Load with Nx Cache\n');

const dockerfileContent = readFileSync(join(workDir, 'simple-app/Dockerfile'), 'utf-8');
const appContent = readFileSync(join(workDir, 'simple-app/app.js'), 'utf-8');

// Calculate hash based on inputs (similar to Nx)
const inputHash = calculateHash({
  dockerfile: dockerfileContent,
  appJs: appContent,
  nodeVersion: '18-alpine'
});

console.log(`   Input hash: ${inputHash}`);
console.log(`   Cache key would be: docker-build-${inputHash}`);

// Simulate Nx executor logic
const nxDockerExecutor = {
  execute: async (options) => {
    const cacheFile = join(nxCacheDir, `docker-${inputHash}.tar`);
    
    // Check if cached
    if (existsSync(cacheFile)) {
      console.log('   ✅ Cache hit! Loading image from Nx cache...');
      try {
        execSync(`docker load -i ${cacheFile}`, { stdio: 'inherit' });
        return { success: true, cached: true };
      } catch (e) {
        console.error('   ❌ Failed to load from cache:', e.message);
      }
    }
    
    // Build if not cached
    console.log('   ❌ Cache miss! Building image...');
    try {
      execSync(`docker build -t test-app:${inputHash} ./simple-app`, { 
        cwd: workDir,
        stdio: 'inherit' 
      });
      
      // Save to cache
      console.log('   💾 Saving to Nx cache...');
      execSync(`docker save test-app:${inputHash} -o ${cacheFile}`, { stdio: 'inherit' });
      
      return { success: true, cached: false };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

// Test the executor
console.log('   🧪 Testing Nx executor simulation...');
await nxDockerExecutor.execute({});

console.log('\n📦 Option 2: Layer-based Caching\n');

// Create a manifest for layer tracking
const layerManifest = {
  baseImage: 'node:18-alpine',
  layers: [
    { id: 'workdir', command: 'WORKDIR /app', hash: calculateHash('WORKDIR /app') },
    { id: 'copy', command: 'COPY app.js .', hash: calculateHash(appContent) },
  ],
  finalHash: inputHash
};

writeFileSync(
  join(nxCacheDir, `manifest-${inputHash}.json`), 
  JSON.stringify(layerManifest, null, 2)
);

console.log('   Layer manifest created:');
console.log(`   - Base image: ${layerManifest.baseImage}`);
console.log(`   - Layers: ${layerManifest.layers.length}`);
console.log(`   - Cache key: docker-layers-${inputHash}`);

console.log('\n📦 Option 3: Build Context Caching\n');

// Create build context tar
const contextTar = join(nxCacheDir, `context-${inputHash}.tar`);
try {
  execSync(`tar -cf ${contextTar} -C simple-app .`, { cwd: workDir });
  const size = execSync(`ls -lh ${contextTar}`).toString();
  console.log('   ✅ Build context saved:');
  console.log(`   ${size.trim()}`);
} catch (e) {
  console.error('   ❌ Failed to create context tar:', e.message);
}

console.log('\n📊 Nx Integration Recommendations:\n');

console.log('1. **Docker Save/Load Method** (Recommended)');
console.log('   - Pros: Simple, reliable, complete image caching');
console.log('   - Cons: Large cache files (~170MB per image)');
console.log('   - Implementation: Custom executor that wraps docker build/save/load');

console.log('\n2. **BuildKit Cache Export** (Future-looking)');
console.log('   - Pros: Efficient layer caching, smaller cache size');
console.log('   - Cons: Requires BuildKit features not available in all environments');
console.log('   - Implementation: Would need buildx or containerd support');

console.log('\n3. **Hybrid Approach**');
console.log('   - Cache build context + layer metadata');
console.log('   - Use docker build cache when available');
console.log('   - Fall back to full rebuild when needed');

console.log('\n4. **Remote Registry Integration**');
console.log('   - Push images to registry with cache tags');
console.log('   - Pull from registry on cache hit');
console.log('   - Works well with Nx Cloud');

// Create example Nx executor configuration
const executorConfig = {
  schema: {
    type: 'object',
    properties: {
      dockerfile: { type: 'string' },
      context: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      push: { type: 'boolean', default: false },
      cache: { type: 'boolean', default: true },
      cacheFrom: { type: 'array', items: { type: 'string' } },
      cacheTo: { type: 'array', items: { type: 'string' } }
    }
  },
  implementation: './docker-build.impl.ts'
};

writeFileSync(
  join(workDir, 'nx-docker-executor-schema.json'),
  JSON.stringify(executorConfig, null, 2)
);

console.log('\n✅ Created example Nx executor schema: nx-docker-executor-schema.json');