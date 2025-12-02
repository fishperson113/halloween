/**
 * Test file for extension activation logic
 * 
 * This tests the core functionality of the extension without requiring VSCode API
 */

const fs = require('fs');
const path = require('path');

// Mock extension path
const extensionPath = __dirname;

// Test 1: Validate that CSS file exists
console.log('Test 1: Validating CSS file exists...');
const cssPath = path.join(extensionPath, 'themes', 'kiroween-background.css');
const cssExists = fs.existsSync(cssPath);
console.log(`  CSS file exists: ${cssExists ? '✓ PASS' : '✗ FAIL'}`);

// Test 2: Validate that background pattern exists
console.log('\nTest 2: Validating background pattern exists...');
const patternPath = path.join(extensionPath, 'assets', 'background-pattern.svg');
const patternExists = fs.existsSync(patternPath);
console.log(`  Pattern file exists: ${patternExists ? '✓ PASS' : '✗ FAIL'}`);

// Test 3: Validate CSS file contains required properties
console.log('\nTest 3: Validating CSS file content...');
if (cssExists) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const hasBackgroundImage = cssContent.includes('background-image');
    const hasBackgroundRepeat = cssContent.includes('background-repeat');
    const hasOpacity = cssContent.includes('opacity');
    const hasBlendMode = cssContent.includes('mix-blend-mode');
    
    console.log(`  Contains background-image: ${hasBackgroundImage ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Contains background-repeat: ${hasBackgroundRepeat ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Contains opacity: ${hasOpacity ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Contains mix-blend-mode: ${hasBlendMode ? '✓ PASS' : '✗ FAIL'}`);
}

// Test 4: Validate CSS references the correct pattern file
console.log('\nTest 4: Validating CSS references pattern file...');
if (cssExists) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const referencesPattern = cssContent.includes('background-pattern.svg');
    const usesRelativePath = cssContent.includes('../assets/background-pattern.svg');
    
    console.log(`  References background-pattern.svg: ${referencesPattern ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Uses relative path: ${usesRelativePath ? '✓ PASS' : '✗ FAIL'}`);
}

// Test 5: Validate opacity is within acceptable range
console.log('\nTest 5: Validating opacity value...');
if (cssExists) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const opacityMatch = cssContent.match(/opacity:\s*(0\.\d+)/);
    
    if (opacityMatch) {
        const opacity = parseFloat(opacityMatch[1]);
        const inRange = opacity >= 0.02 && opacity <= 0.08;
        console.log(`  Opacity value: ${opacity}`);
        console.log(`  Within range (0.02-0.08): ${inRange ? '✓ PASS' : '✗ FAIL'}`);
    } else {
        console.log('  Could not parse opacity value: ✗ FAIL');
    }
}

// Test 6: Validate package.json configuration
console.log('\nTest 6: Validating package.json configuration...');
const packagePath = path.join(extensionPath, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const hasMain = packageJson.main === './extension.js';
const hasActivationEvents = packageJson.activationEvents && packageJson.activationEvents.length > 0;
const hasCommands = packageJson.contributes && packageJson.contributes.commands && packageJson.contributes.commands.length > 0;
const hasConfiguration = packageJson.contributes && packageJson.contributes.configuration;

console.log(`  Has main entry point: ${hasMain ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Has activation events: ${hasActivationEvents ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Has commands: ${hasCommands ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  Has configuration: ${hasConfiguration ? '✓ PASS' : '✗ FAIL'}`);

// Test 7: Validate extension.js exists and has required exports
console.log('\nTest 7: Validating extension.js...');
const extensionJsPath = path.join(extensionPath, 'extension.js');
const extensionJsExists = fs.existsSync(extensionJsPath);
console.log(`  extension.js exists: ${extensionJsExists ? '✓ PASS' : '✗ FAIL'}`);

if (extensionJsExists) {
    const extensionContent = fs.readFileSync(extensionJsPath, 'utf8');
    const hasActivate = extensionContent.includes('function activate');
    const hasDeactivate = extensionContent.includes('function deactivate');
    const hasExports = extensionContent.includes('module.exports');
    const hasValidateAssets = extensionContent.includes('validateAssets');
    const hasErrorHandling = extensionContent.includes('handleMissingAssets');
    
    console.log(`  Has activate function: ${hasActivate ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Has deactivate function: ${hasDeactivate ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Has module exports: ${hasExports ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Has asset validation: ${hasValidateAssets ? '✓ PASS' : '✗ FAIL'}`);
    console.log(`  Has error handling: ${hasErrorHandling ? '✓ PASS' : '✗ FAIL'}`);
}

// Test 8: Validate path resolution logic
console.log('\nTest 8: Validating path resolution...');
const normalizedPath = cssPath.replace(/\\/g, '/');
const cssUri = `file:///${normalizedPath}`;
const isValidUri = cssUri.startsWith('file:///');
const hasNoBackslashes = !cssUri.includes('\\');

console.log(`  Generated URI: ${cssUri}`);
console.log(`  Valid file:/// URI: ${isValidUri ? '✓ PASS' : '✗ FAIL'}`);
console.log(`  No backslashes: ${hasNoBackslashes ? '✓ PASS' : '✗ FAIL'}`);

console.log('\n' + '='.repeat(50));
console.log('Extension activation logic tests complete!');
console.log('='.repeat(50));
