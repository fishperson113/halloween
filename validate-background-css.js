/**
 * Validation script for Kiroween background CSS
 * Verifies that the CSS file meets all requirements
 */

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'themes', 'kiroween-background.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('Validating Kiroween Background CSS...\n');

let allPassed = true;

// Requirement 1.1: Background image styling
if (cssContent.includes('background-image:') && cssContent.includes('background-pattern.svg')) {
  console.log('✓ Background image styling present');
} else {
  console.log('✗ Background image styling missing');
  allPassed = false;
}

// Requirement 1.4: Seamless tiling configuration
if (cssContent.includes('background-repeat: repeat') && cssContent.includes('background-size:')) {
  console.log('✓ Seamless tiling configuration present');
} else {
  console.log('✗ Seamless tiling configuration missing');
  allPassed = false;
}

// Requirement 3.4: Opacity settings
const opacityMatch = cssContent.match(/opacity:\s*(0\.\d+)/);
if (opacityMatch) {
  const opacity = parseFloat(opacityMatch[1]);
  if (opacity >= 0.02 && opacity <= 0.08) {
    console.log(`✓ Opacity within valid range (${opacity})`);
  } else {
    console.log(`✗ Opacity out of range (${opacity}), should be 0.02-0.08`);
    allPassed = false;
  }
} else {
  console.log('✗ Opacity setting missing');
  allPassed = false;
}

// Requirement 3.4: Blend mode settings
if (cssContent.includes('mix-blend-mode:')) {
  console.log('✓ Blend mode setting present');
} else {
  console.log('✗ Blend mode setting missing');
  allPassed = false;
}

// Target element check
if (cssContent.includes('.monaco-editor .view-lines')) {
  console.log('✓ Targets .monaco-editor .view-lines element');
} else {
  console.log('✗ Does not target .monaco-editor .view-lines element');
  allPassed = false;
}

// Relative path check (Requirement 3.2)
if (cssContent.includes("url('../assets/background-pattern.svg')") || 
    cssContent.includes('url("../assets/background-pattern.svg")')) {
  console.log('✓ Uses relative path for background asset');
} else {
  console.log('✗ Does not use relative path for background asset');
  allPassed = false;
}

console.log('\n' + (allPassed ? '✓ All validations passed!' : '✗ Some validations failed'));
process.exit(allPassed ? 0 : 1);
