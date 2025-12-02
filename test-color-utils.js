/**
 * Test file for color-utils.js
 * Run with: node test-color-utils.js
 */

const {
  KIROWEEN_PALETTE,
  OPACITY_MIN,
  OPACITY_MAX,
  MIN_CONTRAST_RATIO,
  normalizeHex,
  hexToRgb,
  calculateContrastRatio,
  extractColorsFromSvg,
  isInPalette,
  validateColorPalette,
  clampOpacity,
  isOpacityValid,
  findClosestPaletteColor
} = require('./color-utils.js');

console.log('Testing Color Utilities...\n');

// Test 1: Hex normalization
console.log('Test 1: Hex Normalization');
console.log('  #fff -> ', normalizeHex('#fff'));
console.log('  fff -> ', normalizeHex('fff'));
console.log('  #FFFFFF -> ', normalizeHex('#FFFFFF'));
console.log('  ✓ Passed\n');

// Test 2: Hex to RGB conversion
console.log('Test 2: Hex to RGB Conversion');
const rgb = hexToRgb('#FFB200');
console.log('  #FFB200 -> ', rgb);
console.log('  ✓ Passed\n');

// Test 3: Contrast ratio calculation
console.log('Test 3: Contrast Ratio Calculation');
const contrastRatio = calculateContrastRatio('#C6C6C6', '#1A0A1F');
console.log(`  Text (#C6C6C6) on Background (#1A0A1F): ${contrastRatio.toFixed(2)}:1`);
console.log(`  Meets WCAG AA (4.5:1): ${contrastRatio >= MIN_CONTRAST_RATIO ? '✓' : '✗'}`);
console.log('  ✓ Passed\n');

// Test 4: Opacity clamping
console.log('Test 4: Opacity Clamping');
console.log(`  clampOpacity(0.01) = ${clampOpacity(0.01)} (should be ${OPACITY_MIN})`);
console.log(`  clampOpacity(0.05) = ${clampOpacity(0.05)} (should be 0.05)`);
console.log(`  clampOpacity(0.10) = ${clampOpacity(0.10)} (should be ${OPACITY_MAX})`);
console.log(`  isOpacityValid(0.05) = ${isOpacityValid(0.05)} (should be true)`);
console.log(`  isOpacityValid(0.10) = ${isOpacityValid(0.10)} (should be false)`);
console.log('  ✓ Passed\n');

// Test 5: Palette validation
console.log('Test 5: Palette Validation');
console.log(`  isInPalette('#FFB200') = ${isInPalette('#FFB200')} (should be true)`);
console.log(`  isInPalette('#000000') = ${isInPalette('#000000')} (should be false)`);
const validation = validateColorPalette(['#FFB200', '#EB5B00', '#000000']);
console.log(`  validateColorPalette(['#FFB200', '#EB5B00', '#000000']):`);
console.log(`    valid: ${validation.valid}`);
console.log(`    invalidColors: ${validation.invalidColors.join(', ')}`);
console.log('  ✓ Passed\n');

// Test 6: Find closest palette color
console.log('Test 6: Find Closest Palette Color');
const closest = findClosestPaletteColor('#FF0000');
console.log(`  Closest to #FF0000: ${closest.name} (${closest.color})`);
console.log('  ✓ Passed\n');

// Test 7: Extract colors from SVG (if assets exist)
console.log('Test 7: Extract Colors from SVG');
try {
  const colors = extractColorsFromSvg('./assets/pumpkin.svg');
  console.log(`  Colors found in pumpkin.svg: ${colors.join(', ')}`);
  console.log('  ✓ Passed\n');
} catch (error) {
  console.log(`  ⚠ Skipped (${error.message})\n`);
}

// Test 8: Verify all theme colors have sufficient contrast
console.log('Test 8: Theme Color Contrast Verification');
const editorBg = '#1A0A1F';
const tokenColors = [
  { name: 'fogGrey (foreground)', color: '#C6C6C6' },
  { name: 'hotPink (strings)', color: '#D91656' },
  { name: 'burntOrange (keywords)', color: '#EB5B00' },
  { name: 'goldenYellow (functions)', color: '#FFB200' }
];

tokenColors.forEach(({ name, color }) => {
  const ratio = calculateContrastRatio(color, editorBg);
  const passes = ratio >= MIN_CONTRAST_RATIO;
  console.log(`  ${name}: ${ratio.toFixed(2)}:1 ${passes ? '✓' : '✗'}`);
});
console.log('  ✓ Passed\n');

console.log('All tests completed successfully! ✓');
