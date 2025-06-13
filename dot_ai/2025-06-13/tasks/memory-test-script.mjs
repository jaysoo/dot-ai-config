#!/usr/bin/env node

/**
 * Memory-intensive test script for verifying heap logging
 * Usage: node memory-test-script.mjs [--duration=5000] [--size=100]
 */

const args = process.argv.slice(2);
const duration = parseInt(args.find(arg => arg.startsWith('--duration='))?.split('=')[1] || '5000');
const size = parseInt(args.find(arg => arg.startsWith('--size='))?.split('=')[1] || '100');

console.log(`Starting memory-intensive task...`);
console.log(`Duration: ${duration}ms, Array size: ${size}MB`);

// Create large arrays to consume memory
const arrays = [];
const bytesPerMB = 1024 * 1024;
const elementsPerMB = bytesPerMB / 8; // 8 bytes per number

// Allocate memory gradually
for (let i = 0; i < size; i++) {
  arrays.push(new Array(elementsPerMB).fill(Math.random()));
  console.log(`Allocated ${i + 1}MB...`);
}

console.log(`Holding memory for ${duration}ms...`);

// Keep the process alive
setTimeout(() => {
  console.log('Memory test complete');
  process.exit(0);
}, duration);

// Force garbage collection to not happen
setInterval(() => {
  // Touch arrays to prevent GC
  arrays.forEach(arr => arr[0] = Math.random());
}, 100);