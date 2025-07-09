#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '../../../docs/shared/images/tutorials');

async function convertPngToAvif() {
  try {
    // Read all files in the directory
    const files = await fs.readdir(IMAGES_DIR);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    
    console.log(`Found ${pngFiles.length} PNG files to convert:`);
    pngFiles.forEach(file => console.log(`  - ${file}`));
    
    for (const pngFile of pngFiles) {
      const inputPath = path.join(IMAGES_DIR, pngFile);
      const outputPath = path.join(IMAGES_DIR, pngFile.replace('.png', '.avif'));
      
      console.log(`\nConverting ${pngFile} to AVIF...`);
      
      try {
        await sharp(inputPath)
          .avif({
            quality: 80,
            effort: 9,
            chromaSubsampling: '4:2:0'
          })
          .toFile(outputPath);
        
        // Get file sizes for comparison
        const pngStats = await fs.stat(inputPath);
        const avifStats = await fs.stat(outputPath);
        
        const reduction = ((1 - avifStats.size / pngStats.size) * 100).toFixed(1);
        console.log(`✓ Converted successfully`);
        console.log(`  PNG size: ${(pngStats.size / 1024).toFixed(1)} KB`);
        console.log(`  AVIF size: ${(avifStats.size / 1024).toFixed(1)} KB`);
        console.log(`  Size reduction: ${reduction}%`);
      } catch (error) {
        console.error(`✗ Failed to convert ${pngFile}:`, error.message);
      }
    }
    
    console.log('\n✅ Conversion complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Check if sharp is installed
try {
  await import('sharp');
} catch (error) {
  console.error('Sharp is not installed. Installing it now...');
  console.log('Run: pnpm add -D sharp');
  process.exit(1);
}

convertPngToAvif();