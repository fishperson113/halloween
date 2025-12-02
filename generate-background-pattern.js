#!/usr/bin/env node

/**
 * Halloween Background Pattern Generator
 * 
 * Combines existing Halloween SVG assets into a seamless tiled pattern
 * with the Kiroween color palette applied.
 */

const fs = require('fs');
const path = require('path');

// Kiroween color palette from theme
const PALETTE = {
  goldenYellow: '#FFB200',
  burntOrange: '#EB5B00',
  hotPink: '#D91656',
  deepPurple: '#640D5F',
  darkPurple: '#3D0842',
  veryDark: '#1A0A1F',
  fogGrey: '#C6C6C6'
};

// Pattern configuration
const PATTERN_SIZE = 400; // 400x400px tile
const GRID_SIZE = 4; // 4x4 grid of elements
const CELL_SIZE = PATTERN_SIZE / GRID_SIZE;

// Halloween assets to use in the pattern
const ASSETS = [
  'ghost.svg',
  'pumpkin.svg',
  'skull.svg',
  'witch-hat.svg',
  'eyeball.svg'
];

/**
 * Read and parse an SVG file
 */
function readSVG(filename) {
  const filepath = path.join(__dirname, 'assets', filename);
  if (!fs.existsSync(filepath)) {
    throw new Error(`Asset not found: ${filename}`);
  }
  return fs.readFileSync(filepath, 'utf8');
}

/**
 * Apply color to SVG by replacing currentColor and adding stroke/fill attributes
 */
function applySVGColor(svgContent, color) {
  let colored = svgContent
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/fill="currentColor"/g, `fill="${color}"`);
  
  // Add stroke color to path elements that don't have it
  colored = colored.replace(/<path /g, `<path stroke="${color}" fill="none" `);
  colored = colored.replace(/<circle /g, `<circle stroke="${color}" fill="${color}" `);
  
  return colored;
}

/**
 * Extract the inner content of an SVG (everything between <svg> tags)
 */
function extractSVGContent(svgString) {
  const match = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  return match ? match[1].trim() : '';
}

/**
 * Generate a random element configuration for the grid
 */
function generateElementConfig(row, col, seed) {
  // Use seed for deterministic "randomness"
  const random = (seed * 9301 + 49297) % 233280 / 233280;
  
  const assetIndex = Math.floor(random * ASSETS.length);
  const colors = Object.values(PALETTE).filter(c => c !== PALETTE.veryDark);
  const colorIndex = Math.floor((random * 7919) % colors.length);
  
  // Calculate position with some offset for variety
  const offsetX = ((random * 1000) % 30) - 15;
  const offsetY = ((random * 2000) % 30) - 15;
  const x = col * CELL_SIZE + CELL_SIZE / 2 + offsetX;
  const y = row * CELL_SIZE + CELL_SIZE / 2 + offsetY;
  
  // Random rotation
  const rotation = Math.floor((random * 3000) % 360);
  
  // Random scale (0.4 to 0.7 for subtlety)
  const scale = 0.4 + ((random * 5000) % 30) / 100;
  
  return {
    asset: ASSETS[assetIndex],
    color: colors[colorIndex],
    x,
    y,
    rotation,
    scale
  };
}

/**
 * Create an SVG group element with transform
 */
function createSVGGroup(config, content) {
  const transform = `translate(${config.x}, ${config.y}) rotate(${config.rotation}) scale(${config.scale})`;
  return `  <g transform="${transform}" opacity="0.15">
    ${content}
  </g>`;
}

/**
 * Generate the complete background pattern
 */
function generatePattern() {
  console.log('Generating Halloween background pattern...');
  
  // Load all SVG assets
  const svgAssets = {};
  for (const asset of ASSETS) {
    try {
      svgAssets[asset] = readSVG(asset);
      console.log(`✓ Loaded ${asset}`);
    } catch (error) {
      console.error(`✗ Failed to load ${asset}:`, error.message);
      process.exit(1);
    }
  }
  
  // Generate grid of elements
  const elements = [];
  let seed = 12345; // Fixed seed for reproducibility
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const config = generateElementConfig(row, col, seed);
      
      // Get SVG content and apply color
      const svgContent = extractSVGContent(svgAssets[config.asset]);
      const coloredContent = applySVGColor(svgContent, config.color);
      
      // Create positioned group
      const group = createSVGGroup(config, coloredContent);
      elements.push(group);
    }
  }
  
  // Create the final SVG with proper viewBox for tiling
  const patternSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     viewBox="0 0 ${PATTERN_SIZE} ${PATTERN_SIZE}" 
     width="${PATTERN_SIZE}" 
     height="${PATTERN_SIZE}">
  <defs>
    <style>
      /* Ensure smooth rendering */
      * { shape-rendering: geometricPrecision; }
    </style>
  </defs>
  
  <!-- Background (transparent) -->
  <rect width="${PATTERN_SIZE}" height="${PATTERN_SIZE}" fill="none"/>
  
  <!-- Halloween elements -->
${elements.join('\n')}
</svg>`;
  
  return patternSVG;
}

/**
 * Main execution
 */
function main() {
  try {
    const pattern = generatePattern();
    
    // Write to assets directory
    const outputPath = path.join(__dirname, 'assets', 'background-pattern.svg');
    fs.writeFileSync(outputPath, pattern, 'utf8');
    
    console.log(`\n✓ Background pattern generated successfully!`);
    console.log(`  Output: ${outputPath}`);
    console.log(`  Size: ${PATTERN_SIZE}x${PATTERN_SIZE}px`);
    console.log(`  Elements: ${GRID_SIZE * GRID_SIZE} Halloween icons`);
    console.log(`  Colors: Kiroween palette applied`);
    
  } catch (error) {
    console.error('\n✗ Error generating pattern:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { generatePattern, PALETTE, ASSETS };
