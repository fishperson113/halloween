#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m'
};

let hasErrors = false;
let hasWarnings = false;

function log(message, type = 'info') {
  const prefix = {
    success: `${colors.green}✓${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: ' '
  }[type];
  console.log(`${prefix} ${message}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`${description} exists at: ${filePath}`, 'success');
    return true;
  } else {
    log(`${description} NOT FOUND at: ${filePath}`, 'error');
    hasErrors = true;
    return false;
  }
}

function checkFileNotExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    log(`${description} correctly absent: ${filePath}`, 'success');
    return true;
  } else {
    log(`${description} should not exist: ${filePath}`, 'error');
    hasErrors = true;
    return false;
  }
}

console.log('\n=== Extension Structure Validation ===\n');

// 1. Validate package.json structure
console.log('1. Validating package.json structure...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check for code-related fields that should NOT exist
  if (!packageJson.main) {
    log('No "main" field (correct for theme extension)', 'success');
  } else {
    log('"main" field found - should not exist in theme extension', 'error');
    hasErrors = true;
  }
  
  if (!packageJson.activationEvents) {
    log('No "activationEvents" field (correct for theme extension)', 'success');
  } else {
    log('"activationEvents" field found - should not exist in theme extension', 'error');
    hasErrors = true;
  }
  
  if (!packageJson.commands) {
    log('No "commands" field (correct for theme extension)', 'success');
  } else {
    log('"commands" field found - should not exist in theme extension', 'error');
    hasErrors = true;
  }
  
  // Check for required fields
  if (packageJson.engines && packageJson.engines.vscode) {
    log(`VSCode engine version specified: ${packageJson.engines.vscode}`, 'success');
  } else {
    log('Missing "engines.vscode" field', 'error');
    hasErrors = true;
  }
  
  // Check contributes section
  if (packageJson.contributes) {
    const contributeKeys = Object.keys(packageJson.contributes);
    const allowedKeys = ['themes', 'productIconThemes', 'configuration'];
    const invalidKeys = contributeKeys.filter(key => !allowedKeys.includes(key));
    
    if (invalidKeys.length === 0) {
      log('Contributes section contains only theme-related contributions', 'success');
    } else {
      log(`Contributes section has unexpected keys: ${invalidKeys.join(', ')}`, 'error');
      hasErrors = true;
    }
  }
  
} catch (error) {
  log(`Failed to parse package.json: ${error.message}`, 'error');
  hasErrors = true;
}

// 2. Validate theme file paths
console.log('\n2. Validating theme file paths...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check color theme path
  if (packageJson.contributes && packageJson.contributes.themes) {
    packageJson.contributes.themes.forEach((theme, index) => {
      const themePath = theme.path.replace(/^\.\//, '');
      if (checkFile(themePath, `Color theme ${index + 1} (${theme.label})`)) {
        // VSCode natively supports JSONC (JSON with Comments) for theme files
        // Just verify the file is readable
        try {
          fs.readFileSync(themePath, 'utf8');
          log(`  Theme file is readable (VSCode will validate JSONC)`, 'success');
        } catch (e) {
          log(`  Theme file is not readable: ${e.message}`, 'error');
          hasErrors = true;
        }
      }
    });
  }
  
  // Check product icon theme path
  if (packageJson.contributes && packageJson.contributes.productIconThemes) {
    packageJson.contributes.productIconThemes.forEach((theme, index) => {
      const themePath = theme.path.replace(/^\.\//, '');
      if (checkFile(themePath, `Product icon theme ${index + 1} (${theme.label})`)) {
        // Verify it's valid JSON and check font paths
        try {
          const iconTheme = JSON.parse(fs.readFileSync(themePath, 'utf8'));
          log(`  Icon theme file is valid JSON`, 'success');
          
          // Check font paths
          if (iconTheme.fonts) {
            iconTheme.fonts.forEach((font, fontIndex) => {
              if (font.src) {
                font.src.forEach((src, srcIndex) => {
                  const fontPath = path.join(path.dirname(themePath), src.path.replace(/^\.\//, ''));
                  checkFile(fontPath, `  Font file for ${font.id}`);
                });
              }
            });
          }
        } catch (e) {
          log(`  Icon theme file has invalid JSON: ${e.message}`, 'error');
          hasErrors = true;
        }
      }
    });
  }
  
} catch (error) {
  log(`Failed to validate theme paths: ${error.message}`, 'error');
  hasErrors = true;
}

// 3. Check for build artifacts
console.log('\n3. Checking for build artifacts (should not exist)...');
checkFileNotExists('extension.js', 'extension.js');
checkFileNotExists('extension.ts', 'extension.ts');
checkFileNotExists('out', 'out/ directory');
checkFileNotExists('node_modules', 'node_modules/ directory');
checkFileNotExists('package-lock.json', 'package-lock.json');

// 4. Validate .vscodeignore
console.log('\n4. Validating .vscodeignore configuration...');
try {
  const vscodeignore = fs.readFileSync('.vscodeignore', 'utf8');
  
  const requiredPatterns = [
    { pattern: '.vscode', description: '.vscode/ directory exclusion' },
    { pattern: '.git', description: '.git/ directory exclusion' },
    { pattern: '.kiro', description: '.kiro/ directory exclusion' },
    { pattern: 'assets/*.svg', description: 'Source SVG exclusion' },
    { pattern: 'themes/*.css', description: 'Generated CSS exclusion' },
    { pattern: 'themes/*.html', description: 'Generated HTML exclusion' }
  ];
  
  requiredPatterns.forEach(({ pattern, description }) => {
    if (vscodeignore.includes(pattern)) {
      log(`${description} present`, 'success');
    } else {
      log(`${description} missing`, 'warning');
      hasWarnings = true;
    }
  });
  
} catch (error) {
  log(`Failed to read .vscodeignore: ${error.message}`, 'error');
  hasErrors = true;
}

// Summary
console.log('\n=== Validation Summary ===\n');
if (hasErrors) {
  log('Validation FAILED - errors found', 'error');
  process.exit(1);
} else if (hasWarnings) {
  log('Validation completed with warnings', 'warning');
  process.exit(0);
} else {
  log('All validations PASSED', 'success');
  process.exit(0);
}
