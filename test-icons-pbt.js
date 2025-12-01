/**
 * Property-Based Tests for Kiroween Product Icons
 * 
 * This file implements property-based testing using fast-check to verify
 * universal properties that should hold across all icon files.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

// Test configuration
const NUM_RUNS = 100;

// Helper function to get all SVG files
function getAllSvgFiles() {
  const iconsDir = 'assets';
  return fs.readdirSync(iconsDir)
    .filter(file => file.endsWith('.svg'))
    .map(file => path.join(iconsDir, file));
}

// Helper function to parse SVG content
function parseSvgAttributes(svgContent) {
  const svgTagMatch = svgContent.match(/<svg[^>]*>/);
  if (!svgTagMatch) return null;
  
  const svgTag = svgTagMatch[0];
  return {
    hasStrokeCurrentColor: svgContent.includes('stroke="currentColor"'),
    hasFillNone: svgContent.includes('fill="none"'),
    hasStrokeWidth2: svgContent.includes('stroke-width="2"'),
    hasViewBox: svgTag.includes('viewBox="0 0 24 24"'),
    hasGradient: svgContent.includes('<linearGradient') || svgContent.includes('<radialGradient'),
    hasSvgNamespace: svgTag.includes('xmlns="http://www.w3.org/2000/svg"')
  };
}

// Custom arbitrary that generates SVG file paths
const svgFileArbitrary = fc.constantFrom(...getAllSvgFiles());

console.log('Running Property-Based Tests for Kiroween Product Icons\n');
console.log(`Configuration: ${NUM_RUNS} runs per property\n`);

let allTestsPassed = true;

/**
 * Property 1: SVG Structure Compliance
 * Feature: kiroween-product-icons, Property 1: SVG Structure Compliance
 * 
 * For any icon SVG file in the assets/ directory, 
 * the file should have stroke="currentColor", fill="none", 
 * no gradient elements, and use the SVG namespace.
 * 
 * Validates: Requirements 2.1, 2.3, 2.5
 */
console.log('Property 1: SVG Structure Compliance');
try {
  fc.assert(
    fc.property(svgFileArbitrary, (svgPath) => {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const attrs = parseSvgAttributes(svgContent);
      
      return attrs !== null &&
             attrs.hasStrokeCurrentColor &&
             attrs.hasFillNone &&
             !attrs.hasGradient &&
             attrs.hasSvgNamespace;
    }),
    { numRuns: NUM_RUNS, verbose: true }
  );
  console.log('✓ Property 1 passed\n');
} catch (error) {
  console.error('✗ Property 1 failed:', error.message, '\n');
  allTestsPassed = false;
}

/**
 * Property 2: Consistent Stroke Width
 * Feature: kiroween-product-icons, Property 2: Consistent Stroke Width
 * 
 * For any icon SVG file in the assets/ directory, 
 * the root SVG element should have stroke-width="2".
 * 
 * Validates: Requirements 2.2
 */
console.log('Property 2: Consistent Stroke Width');
try {
  fc.assert(
    fc.property(svgFileArbitrary, (svgPath) => {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const attrs = parseSvgAttributes(svgContent);
      
      return attrs !== null && attrs.hasStrokeWidth2;
    }),
    { numRuns: NUM_RUNS, verbose: true }
  );
  console.log('✓ Property 2 passed\n');
} catch (error) {
  console.error('✗ Property 2 failed:', error.message, '\n');
  allTestsPassed = false;
}

/**
 * Property 3: Standard ViewBox
 * Feature: kiroween-product-icons, Property 3: Standard ViewBox
 * 
 * For any icon SVG file in the assets/ directory, 
 * the root SVG element should have viewBox="0 0 24 24".
 * 
 * Validates: Requirements 2.4
 */
console.log('Property 3: Standard ViewBox');
try {
  fc.assert(
    fc.property(svgFileArbitrary, (svgPath) => {
      const svgContent = fs.readFileSync(svgPath, 'utf8');
      const attrs = parseSvgAttributes(svgContent);
      
      return attrs !== null && attrs.hasViewBox;
    }),
    { numRuns: NUM_RUNS, verbose: true }
  );
  console.log('✓ Property 3 passed\n');
} catch (error) {
  console.error('✗ Property 3 failed:', error.message, '\n');
  allTestsPassed = false;
}

/**
 * Property 4: Icon Reference Integrity
 * Feature: kiroween-product-icons, Property 4: Icon Reference Integrity
 * 
 * For any icon path referenced in the iconDefinitions section 
 * of product-icon-theme.json, the corresponding SVG file should exist at that path.
 * 
 * Validates: Requirements 4.5
 */
console.log('Property 4: Icon Reference Integrity');
try {
  const themeJsonPath = path.join('product-icons', 'product-icon-theme.json');
  const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
  
  const iconPaths = Object.values(themeJson.iconDefinitions || {})
    .map(def => def.iconPath)
    .filter(Boolean);
  
  const iconPathArbitrary = fc.constantFrom(...iconPaths);
  
  fc.assert(
    fc.property(iconPathArbitrary, (iconPath) => {
      // Resolve path relative to product-icons directory
      const fullPath = path.join('product-icons', iconPath);
      return fs.existsSync(fullPath);
    }),
    { numRuns: NUM_RUNS, verbose: true }
  );
  console.log('✓ Property 4 passed\n');
} catch (error) {
  console.error('✗ Property 4 failed:', error.message, '\n');
  allTestsPassed = false;
}

// Summary
console.log('='.repeat(50));
if (allTestsPassed) {
  console.log('✓ All property-based tests passed!');
  process.exit(0);
} else {
  console.log('✗ Some property-based tests failed');
  process.exit(1);
}
