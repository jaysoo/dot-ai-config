#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const workDir = join(process.cwd(), '.ai/2025-06-18/tasks/docker-tests');
const cacheDir = join(workDir, 'cache');

// Ensure cache directory exists
if (!existsSync(cacheDir)) {
  mkdirSync(cacheDir, { recursive: true });
}

console.log('🔍 Testing Docker BuildKit Cache Mechanisms\n');

// Create a more complex Dockerfile to see caching benefits
const complexDockerfile = `FROM node:18-alpine
WORKDIR /app

# Layer that won't change often
RUN apk add --no-cache curl

# Simulate package.json (would cache this layer)
RUN echo '{"name":"test","version":"1.0.0"}' > package.json
RUN npm install express

# App code that changes frequently
COPY app.js .
RUN echo "Build timestamp: ${Date.now()}" > build-info.txt

EXPOSE 3000
CMD ["node", "app.js"]`;

writeFileSync(join(workDir, 'simple-app/Dockerfile.complex'), complexDockerfile);

// Test 1: Build with inline cache
console.log('1️⃣ Testing Inline Cache Export...');
try {
  const startTime = Date.now();
  execSync(`DOCKER_BUILDKIT=1 docker build -f simple-app/Dockerfile.complex -t test-app:cached --build-arg BUILDKIT_INLINE_CACHE=1 ./simple-app`, { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  const buildTime = Date.now() - startTime;
  console.log(`✅ Build with inline cache completed in ${buildTime}ms\n`);
} catch (e) {
  console.error('❌ Inline cache build failed:', e.message);
}

// Test 2: Export cache to local directory
console.log('2️⃣ Testing Local Cache Export...');
try {
  const startTime = Date.now();
  execSync(`DOCKER_BUILDKIT=1 docker build -f simple-app/Dockerfile.complex -t test-app:v2 --cache-to type=local,dest=cache/buildkit ./simple-app`, { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  const buildTime = Date.now() - startTime;
  console.log(`✅ Build with cache export completed in ${buildTime}ms`);
  
  const cacheSize = execSync('du -sh cache/buildkit', { cwd: workDir }).toString();
  console.log(`   Cache size: ${cacheSize.trim()}\n`);
} catch (e) {
  console.error('❌ Cache export failed:', e.message);
}

// Test 3: Clean Docker cache and rebuild from exported cache
console.log('3️⃣ Testing Cache Import...');
try {
  // Remove the image
  execSync('docker rmi test-app:v2', { stdio: 'ignore' });
  
  // Rebuild using cached layers
  const startTime = Date.now();
  execSync(`DOCKER_BUILDKIT=1 docker build -f simple-app/Dockerfile.complex -t test-app:v3 --cache-from type=local,src=cache/buildkit ./simple-app`, { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  const buildTime = Date.now() - startTime;
  console.log(`✅ Build from cache completed in ${buildTime}ms (should be faster)\n`);
} catch (e) {
  console.error('❌ Cache import failed:', e.message);
}

// Test 4: Registry cache (simulation)
console.log('4️⃣ Testing Registry Cache Pattern...');
console.log('   Note: Registry cache requires a real registry, but the pattern would be:');
console.log('   --cache-to type=registry,ref=myregistry.com/myapp:buildcache');
console.log('   --cache-from type=registry,ref=myregistry.com/myapp:buildcache\n');

// Test 5: Test OCI layout cache
console.log('5️⃣ Testing OCI Layout Cache...');
try {
  execSync(`DOCKER_BUILDKIT=1 docker build -f simple-app/Dockerfile.complex -t test-app:v4 --cache-to type=oci,dest=cache/oci-cache.tar ./simple-app`, { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  const cacheSize = execSync('ls -lh cache/oci-cache.tar', { cwd: workDir }).toString();
  console.log('✅ OCI cache export successful');
  console.log(`   Cache file: ${cacheSize.trim()}\n`);
} catch (e) {
  console.error('❌ OCI cache export failed:', e.message);
}

console.log('📊 BuildKit Cache Summary:');
console.log('- Local cache: Stores layers in directory structure');
console.log('- Inline cache: Embeds cache metadata in the image');
console.log('- Registry cache: Stores cache in container registry');
console.log('- OCI cache: Exports cache as OCI-compliant tarball');
console.log('- All methods allow layer reuse without full rebuilds');