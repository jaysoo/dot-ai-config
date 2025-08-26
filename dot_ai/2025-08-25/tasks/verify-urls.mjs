#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const redirectsPath = path.join(__dirname, 'redirects.json');
const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));

const BASE_URL = 'https://canary.nx.dev';

// Function to check if a URL returns 200
async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    clearTimeout(timeoutId);
    
    return {
      status: response.status,
      ok: response.status === 200,
      redirected: response.status >= 300 && response.status < 400,
      location: response.headers.get('location')
    };
  } catch (error) {
    return {
      status: -1,
      ok: false,
      error: error.message
    };
  }
}

async function verifyUrls() {
  const results = {
    working: [],
    broken: [],
    redirected: [],
    errors: []
  };

  const total = Object.keys(redirects).length;
  let processed = 0;

  console.log(`Starting verification of ${total} redirect pairs...\n`);

  // Process in batches to avoid overwhelming the server
  const BATCH_SIZE = 10;
  const entries = Object.entries(redirects);
  
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, Math.min(i + BATCH_SIZE, entries.length));
    
    const batchPromises = batch.map(async ([oldPath, newPath]) => {
      const oldUrl = `${BASE_URL}${oldPath}`;
      const newUrl = `${BASE_URL}${newPath}`;
      
      // Check both old and new URLs
      const [oldResult, newResult] = await Promise.all([
        checkUrl(oldUrl),
        checkUrl(newUrl)
      ]);
      
      const result = {
        oldPath,
        newPath,
        oldUrl,
        newUrl,
        oldStatus: oldResult.status,
        newStatus: newResult.status,
        oldOk: oldResult.ok,
        newOk: newResult.ok,
        oldRedirected: oldResult.redirected,
        newRedirected: newResult.redirected,
        oldLocation: oldResult.location,
        newLocation: newResult.location
      };
      
      if (newResult.ok) {
        results.working.push(result);
      } else if (newResult.redirected) {
        results.redirected.push(result);
      } else if (newResult.error) {
        results.errors.push(result);
      } else {
        results.broken.push(result);
      }
      
      return result;
    });
    
    await Promise.all(batchPromises);
    processed += batch.length;
    
    // Progress update
    if (processed % 50 === 0 || processed === total) {
      console.log(`Processed ${processed}/${total} URLs (${Math.round(processed/total*100)}%)`);
    }
    
    // Small delay between batches to be respectful to the server
    if (i + BATCH_SIZE < entries.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate reports
  console.log('\n=== SUMMARY ===');
  console.log(`Total redirects checked: ${total}`);
  console.log(`Working (200 OK): ${results.working.length}`);
  console.log(`Broken: ${results.broken.length}`);
  console.log(`Redirected: ${results.redirected.length}`);
  console.log(`Errors: ${results.errors.length}`);

  // Save detailed results
  const reportPath = path.join(__dirname, 'url-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);

  // Create broken URLs list
  if (results.broken.length > 0) {
    const brokenPath = path.join(__dirname, 'broken-urls.txt');
    const brokenContent = '=== BROKEN NEW URLs ===\n\n' +
      results.broken.map(r => 
        `Old: ${r.oldPath}\nNew: ${r.newPath} (Status: ${r.newStatus})\n`
      ).join('\n');
    fs.writeFileSync(brokenPath, brokenContent);
    console.log(`Broken URLs list saved to: ${brokenPath}`);
  }

  // Create working URLs list
  if (results.working.length > 0) {
    const workingPath = path.join(__dirname, 'working-redirects.txt');
    const workingContent = '=== WORKING REDIRECTS ===\n\n' +
      results.working.map(r => 
        `${r.oldPath} -> ${r.newPath}`
      ).join('\n');
    fs.writeFileSync(workingPath, workingContent);
    console.log(`Working redirects saved to: ${workingPath}`);
  }

  return results;
}

// Run the verification
verifyUrls().catch(console.error);