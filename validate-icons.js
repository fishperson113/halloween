const fs = require('fs');
const path = require('path');

// Validation results
const results = {
  passed: [],
  failed: []
};

function pass(message) {
  results.passed.push(message);
  console.log('✓', message);
}

function fail(message) {
  results.failed.push(message);
  console.error('✗', message);
}

// 1. Verify all required SVG files exist
const requiredIcons = [
  'pumpkin.svg',
  'eyeball.svg',
  'dead-tree-branch.svg',
  'lightning-bolt.svg',
  'witch-hat.svg',
  'cauldron.svg',
  'coffin.svg',
  'skull.svg',
  'haunted-eye.svg'
];

console.log('\n=== Checking SVG Files ===');
requiredIcons.forEach(icon => {
  const iconPath = path.join('product-icons', 'icons', icon);
  if (fs.existsSync(iconPath)) {
    pass(`${icon} exists`);
  } else {
    fail(`${icon} is missing`);
  }
});

// 2. Verify product-icon-theme.json exists
console.log('\n=== Checking Theme Configuration ===');
const themeJsonPath = path.join('product-icons', 'product-icon-theme.json');
if (fs.existsSync(themeJsonPath)) {
  pass('product-icon-theme.json exists');
  
  // 3. Verify theme JSON structure
  try {
    const themeJson = JSON.parse(fs.readFileSync(themeJsonPath, 'utf8'));
    
    if (themeJson.iconDefinitions) {
      pass('iconDefinitions section exists');
      
      // Check all required icons are defined
      const definedIcons = Object.keys(themeJson.iconDefinitions);
      const expectedIcons = ['pumpkin', 'eyeball', 'dead-tree-branch', 'lightning-bolt', 
                            'witch-hat', 'cauldron', 'coffin', 'skull', 'haunted-eye'];
      
      expectedIcons.forEach(icon => {
        if (definedIcons.includes(icon)) {
          pass(`Icon definition for '${icon}' exists`);
        } else {
          fail(`Icon definition for '${icon}' is missing`);
        }
      });
    } else {
      fail('iconDefinitions section is missing');
    }
    
    // Check VS Code icon mappings
    const requiredMappings = [
      'explorer-view-icon',
      'search-view-icon',
      'scm-view-icon',
      'debug-view-icon',
      'extensions-view-icon',
      'settings-view-icon',
      'terminal-view-icon',
      'error-icon',
      'info-icon',
      'warning-icon'
    ];
    
    console.log('\n=== Checking Icon Mappings ===');
    requiredMappings.forEach(mapping => {
      if (themeJson[mapping]) {
        pass(`${mapping} is mapped to '${themeJson[mapping]}'`);
      } else {
        fail(`${mapping} is not mapped`);
      }
    });
    
  } catch (error) {
    fail(`Failed to parse product-icon-theme.json: ${error.message}`);
  }
} else {
  fail('product-icon-theme.json is missing');
}

// 4. Verify package.json contribution
console.log('\n=== Checking Package Configuration ===');
const packageJsonPath = 'package.json';
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (packageJson.contributes && packageJson.contributes.productIconThemes) {
      const iconTheme = packageJson.contributes.productIconThemes.find(
        theme => theme.id === 'kiroween-icons'
      );
      
      if (iconTheme) {
        pass('productIconThemes contribution exists with id "kiroween-icons"');
        if (iconTheme.label === 'Kiroween Icons') {
          pass('Theme label is correct');
        }
        if (iconTheme.path === './product-icons/product-icon-theme.json') {
          pass('Theme path is correct');
        }
      } else {
        fail('kiroween-icons theme not found in productIconThemes');
      }
    } else {
      fail('productIconThemes contribution is missing');
    }
  } catch (error) {
    fail(`Failed to parse package.json: ${error.message}`);
  }
}

// 5. Verify SVG technical specifications
console.log('\n=== Checking SVG Technical Specifications ===');
requiredIcons.forEach(icon => {
  const iconPath = path.join('product-icons', 'icons', icon);
  if (fs.existsSync(iconPath)) {
    const svgContent = fs.readFileSync(iconPath, 'utf8');
    
    // Check for required attributes
    if (svgContent.includes('stroke="currentColor"')) {
      pass(`${icon} has stroke="currentColor"`);
    } else {
      fail(`${icon} missing stroke="currentColor"`);
    }
    
    if (svgContent.includes('fill="none"')) {
      pass(`${icon} has fill="none"`);
    } else {
      fail(`${icon} missing fill="none"`);
    }
    
    if (svgContent.includes('stroke-width="2"')) {
      pass(`${icon} has stroke-width="2"`);
    } else {
      fail(`${icon} missing stroke-width="2"`);
    }
    
    if (svgContent.includes('viewBox="0 0 24 24"')) {
      pass(`${icon} has viewBox="0 0 24 24"`);
    } else {
      fail(`${icon} missing viewBox="0 0 24 24"`);
    }
  }
});

// Summary
console.log('\n=== Validation Summary ===');
console.log(`Passed: ${results.passed.length}`);
console.log(`Failed: ${results.failed.length}`);

if (results.failed.length === 0) {
  console.log('\n✓ All validations passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some validations failed:');
  results.failed.forEach(msg => console.log('  -', msg));
  process.exit(1);
}
