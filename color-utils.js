/**
 * Color and Contrast Utilities for Halloween Background Theme
 * 
 * This module provides utilities for:
 * - Extracting colors from SVG files
 * - Calculating WCAG contrast ratios
 * - Validating colors against the Kiroween palette
 * - Clamping opacity values to acceptable ranges
 */

const fs = require('fs');

/**
 * Kiroween Color Palette
 * Defined colors that should be used in the background pattern
 */
const KIROWEEN_PALETTE = {
  goldenYellow: '#FFB200',
  burntOrange: '#EB5B00',
  hotPink: '#D91656',
  deepPurple: '#640D5F',
  darkPurple: '#3D0842',
  veryDark: '#1A0A1F',
  fogGrey: '#C6C6C6'
};

/**
 * Opacity constraints for background patterns
 */
const OPACITY_MIN = 0.02;
const OPACITY_MAX = 0.08;

/**
 * WCAG minimum contrast ratio for normal text (AA standard)
 */
const MIN_CONTRAST_RATIO = 4.5;

/**
 * Normalize a hex color to uppercase 6-character format
 * @param {string} hex - Hex color (e.g., '#fff', '#FFFFFF', 'fff')
 * @returns {string} Normalized hex color (e.g., '#FFFFFF')
 */
function normalizeHex(hex) {
  // Remove # if present
  hex = hex.replace('#', '').toUpperCase();
  
  // Expand 3-character hex to 6-character
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  return '#' + hex;
}

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color (e.g., '#FFFFFF')
 * @returns {{r: number, g: number, b: number}} RGB values (0-255)
 */
function hexToRgb(hex) {
  hex = normalizeHex(hex);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Calculate relative luminance of a color (WCAG formula)
 * @param {{r: number, g: number, b: number}} rgb - RGB values (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function getRelativeLuminance(rgb) {
  // Convert RGB to sRGB
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  // Apply gamma correction
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
function calculateContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Extract all color values from an SVG file
 * @param {string} svgPath - Path to SVG file
 * @returns {string[]} Array of hex color values found in the SVG
 */
function extractColorsFromSvg(svgPath) {
  if (!fs.existsSync(svgPath)) {
    throw new Error(`SVG file not found: ${svgPath}`);
  }
  
  const svgContent = fs.readFileSync(svgPath, 'utf-8');
  const colors = new Set();
  
  // Match hex colors in various formats
  // Matches: fill="#fff", stroke="#FFFFFF", color: #abc, etc.
  const hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
  let match;
  
  while ((match = hexPattern.exec(svgContent)) !== null) {
    colors.add(normalizeHex(match[0]));
  }
  
  // Note: This function only extracts explicit hex colors.
  // SVGs using 'currentColor', 'none', or named colors will return empty array.
  // This is expected behavior - those colors will be applied during pattern generation.
  
  return Array.from(colors);
}

/**
 * Check if a color exists in the Kiroween palette
 * @param {string} color - Hex color to check
 * @returns {boolean} True if color is in the palette
 */
function isInPalette(color) {
  const normalizedColor = normalizeHex(color);
  const paletteColors = Object.values(KIROWEEN_PALETTE).map(c => normalizeHex(c));
  return paletteColors.includes(normalizedColor);
}

/**
 * Validate that all colors in an array are from the Kiroween palette
 * @param {string[]} colors - Array of hex colors
 * @returns {{valid: boolean, invalidColors: string[]}} Validation result
 */
function validateColorPalette(colors) {
  const invalidColors = colors.filter(color => !isInPalette(color));
  
  return {
    valid: invalidColors.length === 0,
    invalidColors
  };
}

/**
 * Clamp opacity value to acceptable range (0.02 - 0.08)
 * @param {number} opacity - Opacity value to clamp
 * @returns {number} Clamped opacity value
 */
function clampOpacity(opacity) {
  if (typeof opacity !== 'number' || isNaN(opacity)) {
    throw new Error(`Invalid opacity value: ${opacity}`);
  }
  
  return Math.max(OPACITY_MIN, Math.min(OPACITY_MAX, opacity));
}

/**
 * Check if an opacity value is within the acceptable range
 * @param {number} opacity - Opacity value to check
 * @returns {boolean} True if opacity is within range
 */
function isOpacityValid(opacity) {
  return opacity >= OPACITY_MIN && opacity <= OPACITY_MAX;
}

/**
 * Find the closest palette color to a given color
 * @param {string} color - Hex color to match
 * @returns {{name: string, color: string, distance: number}} Closest palette color
 */
function findClosestPaletteColor(color) {
  const rgb = hexToRgb(color);
  let closestColor = null;
  let minDistance = Infinity;
  
  for (const [name, paletteColor] of Object.entries(KIROWEEN_PALETTE)) {
    const paletteRgb = hexToRgb(paletteColor);
    
    // Calculate Euclidean distance in RGB space
    const distance = Math.sqrt(
      Math.pow(rgb.r - paletteRgb.r, 2) +
      Math.pow(rgb.g - paletteRgb.g, 2) +
      Math.pow(rgb.b - paletteRgb.b, 2)
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = { name, color: paletteColor, distance };
    }
  }
  
  return closestColor;
}

module.exports = {
  KIROWEEN_PALETTE,
  OPACITY_MIN,
  OPACITY_MAX,
  MIN_CONTRAST_RATIO,
  normalizeHex,
  hexToRgb,
  getRelativeLuminance,
  calculateContrastRatio,
  extractColorsFromSvg,
  isInPalette,
  validateColorPalette,
  clampOpacity,
  isOpacityValid,
  findClosestPaletteColor
};
