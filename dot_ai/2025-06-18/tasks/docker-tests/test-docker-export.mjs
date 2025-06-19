#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const workDir = join(process.cwd(), '.ai/2025-06-18/tasks/docker-tests');
const outputDir = join(workDir, 'outputs');

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🔍 Testing Docker Build Output Options\n');

// Test 1: Standard docker build (no output)
console.log('1️⃣ Standard Docker Build (no --output flag)');
try {
  execSync('docker build -t test-app:standard ./simple-app', { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  console.log('✅ Standard build successful\n');
} catch (e) {
  console.error('❌ Standard build failed:', e.message);
}

// Test 2: Docker format output
console.log('2️⃣ Docker Format Output (--output type=docker)');
try {
  execSync('docker build -o type=docker,dest=outputs/image-docker.tar ./simple-app', { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  console.log('✅ Docker format export successful');
  const size = execSync('ls -lh outputs/image-docker.tar', { cwd: workDir }).toString();
  console.log(`   File size: ${size.trim()}\n`);
} catch (e) {
  console.error('❌ Docker format export failed:', e.message);
}

// Test 3: OCI format output
console.log('3️⃣ OCI Format Output (--output type=oci)');
try {
  execSync('docker build -o type=oci,dest=outputs/image-oci.tar ./simple-app', { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  console.log('✅ OCI format export successful');
  const size = execSync('ls -lh outputs/image-oci.tar', { cwd: workDir }).toString();
  console.log(`   File size: ${size.trim()}\n`);
} catch (e) {
  console.error('❌ OCI format export failed:', e.message);
}

// Test 4: Local directory output
console.log('4️⃣ Local Directory Output (--output type=local)');
try {
  // Clean up any existing local output
  if (existsSync(join(outputDir, 'local'))) {
    rmSync(join(outputDir, 'local'), { recursive: true });
  }
  execSync('docker build -o type=local,dest=outputs/local ./simple-app', { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  console.log('✅ Local directory export successful');
  const files = execSync('ls -la outputs/local/', { cwd: workDir }).toString();
  console.log(`   Contents:\n${files}`);
} catch (e) {
  console.error('❌ Local directory export failed:', e.message);
}

// Test 5: Try tar format
console.log('5️⃣ Tar Format Output (--output type=tar)');
try {
  execSync('docker build -o type=tar,dest=outputs/image.tar ./simple-app', { 
    cwd: workDir,
    stdio: 'inherit' 
  });
  console.log('✅ Tar format export successful');
  const size = execSync('ls -lh outputs/image.tar', { cwd: workDir }).toString();
  console.log(`   File size: ${size.trim()}\n`);
} catch (e) {
  console.error('❌ Tar format export failed:', e.message);
}

console.log('\n📊 Summary of available output types:');
console.log('- docker: Creates a Docker image tarball (can be loaded with docker load)');
console.log('- oci: Creates an OCI image tarball (more portable format)');
console.log('- local: Exports filesystem contents only (not a full image)');
console.log('- tar: Exports filesystem as tar (similar to local)');
console.log('- registry: Can push directly to registry (requires destination)');