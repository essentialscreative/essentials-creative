#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts images to WebP format and generates multiple sizes
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const config = {
  inputDir: './assets/images',
  outputDir: './assets/images/optimized',
  sizes: [
    { width: 320, suffix: '-sm' },
    { width: 768, suffix: '-md' },
    { width: 1024, suffix: '-lg' },
    { width: 1920, suffix: '-xl' },
    { width: null, suffix: '' } // Original size
  ],
  formats: ['webp', 'jpg'],
  webpQuality: 85,
  jpegQuality: 85,
  skipPatterns: [/favicon/, /logo/, /optimized/]
};

/**
 * Process single image
 */
async function processImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const basename = path.basename(imagePath, ext);
  const shouldSkip = config.skipPatterns.some(pattern => pattern.test(imagePath));
  
  if (shouldSkip || !['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  console.log(`Processing: ${imagePath}`);
  
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  
  const promises = [];
  
  for (const size of config.sizes) {
    const width = size.width || metadata.width;
    
    // Skip if target width is larger than original
    if (width > metadata.width) continue;
    
    for (const format of config.formats) {
      const outputName = `${basename}${size.suffix}.${format}`;
      const outputPath = path.join(config.outputDir, outputName);
      
      let processedImage = image.clone();
      
      if (size.width) {
        processedImage = processedImage.resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }
      
      if (format === 'webp') {
        processedImage = processedImage.webp({ quality: config.webpQuality });
      } else {
        processedImage = processedImage.jpeg({ quality: config.jpegQuality });
      }
      
      promises.push(
        processedImage
          .toFile(outputPath)
          .then(() => console.log(`  ✓ Created ${outputName}`))
          .catch(err => console.error(`  ✗ Failed ${outputName}:`, err.message))
      );
    }
  }
  
  await Promise.all(promises);
}

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, fileList = []) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Generate picture element HTML helper
 */
function generatePictureElement(imageName, alt = '') {
  const sizes = config.sizes.filter(s => s.width).reverse();
  const srcsets = {
    webp: [],
    jpg: []
  };
  
  // Build srcsets
  for (const size of sizes) {
    srcsets.webp.push(`./assets/images/optimized/${imageName}${size.suffix}.webp ${size.width}w`);
    srcsets.jpg.push(`./assets/images/optimized/${imageName}${size.suffix}.jpg ${size.width}w`);
  }
  
  return `<picture>
  <source type="image/webp" 
          srcset="${srcsets.webp.join(', ')}"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw">
  <source type="image/jpeg" 
          srcset="${srcsets.jpg.join(', ')}"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw">
  <img src="./assets/images/optimized/${imageName}.jpg" 
       alt="${alt}"
       loading="lazy"
       class="responsive-image">
</picture>`;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Ensure output directory exists
    await fs.mkdir(config.outputDir, { recursive: true });
    
    // Get all images
    const imageFiles = await getImageFiles(config.inputDir);
    console.log(`Found ${imageFiles.length} images to process\n`);
    
    // Process images in batches to avoid memory issues
    const batchSize = 5;
    for (let i = 0; i < imageFiles.length; i += batchSize) {
      const batch = imageFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(processImage));
    }
    
    console.log('\n✅ Image optimization complete!');
    
    // Generate example HTML
    console.log('\n📝 Example picture element usage:');
    console.log(generatePictureElement('gallery-image-1', 'Gallery Image'));
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { processImage, generatePictureElement };